import {createHash, randomUUID} from 'node:crypto';
import {db} from './db';
import {id, object, ShopError, text} from './validation';
import {queueNotification} from './notifications';

export type ContactRequest = {id:string; createdAt:string; name:string; email:string; phone:string; message:string};
export async function createContact(input:unknown) {
  const o=object(input);
  if(o.website)throw new ShopError('invalid');
  const data={name:text(o.name,120),email:text(o.email,254),phone:text(o.phone??'',30,false),message:text(o.message,4000)};
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)||/[\r\n]/.test(data.email))throw new ShopError('email');
  if(data.phone&&!/^[+\d\s().-]{6,30}$/.test(data.phone))throw new ShopError('phone');
  if(data.message.length<10)throw new ShopError('invalid');
  const key=id(o.requestKey), hash=createHash('sha256').update(JSON.stringify(data)).digest('hex');
  const tx=await(await db()).transaction('write');
  try {
    const old=await tx.execute({sql:'SELECT request_hash,data FROM shop_contacts WHERE request_key=?',args:[key]});
    if(old.rows.length){if(old.rows[0].request_hash!==hash)throw new ShopError('conflict',409);return JSON.parse(String(old.rows[0].data)) as ContactRequest;}
    const contact:ContactRequest={...data,id:`MSG-${randomUUID()}`,createdAt:new Date().toISOString()};
    await tx.execute({sql:'INSERT INTO shop_contacts(id,request_key,request_hash,data) VALUES (?,?,?,?)',args:[contact.id,key,hash,JSON.stringify(contact)]});
    await queueNotification(tx,contact.id,{subject:`El Baya · Nouveau message ${contact.id}`,reply_to:contact.email,text:[
      'Nouveau message depuis le formulaire de contact El Baya',`Référence : ${contact.id}`,`Nom : ${contact.name}`,`Email : ${contact.email}`,`Téléphone : ${contact.phone||'Non renseigné'}`,'',contact.message,'','Répondez directement à cet email pour contacter le visiteur.','https://www.farmelbaya.com/fr/admin',
    ].join('\n')});
    await tx.commit();return contact;
  } finally {tx.close();}
}
export async function contacts():Promise<ContactRequest[]> {
  return (await(await db()).execute('SELECT data FROM shop_contacts ORDER BY rowid DESC LIMIT 500')).rows.map(row=>JSON.parse(String(row.data)));
}
