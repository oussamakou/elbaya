import {randomBytes, scryptSync} from 'node:crypto';
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'node:fs';

const envPath = '.env.local';
let env = existsSync(envPath) ? readFileSync(envPath, 'utf8') : '';
if (/^SHOP_ADMIN_PASSWORD_HASH=/m.test(env)) {
  console.log(
    'Shop admin is already configured. Existing credentials were left unchanged.',
  );
} else {
  const password =
    process.env.SHOP_SETUP_PASSWORD || randomBytes(18).toString('base64url');
  if (password.length < 16 || password.length > 256)
    throw new Error('Use a password of 16–256 characters.');
  const salt = randomBytes(16).toString('hex');
  env += `\n# Farm shop owner access\nSHOP_ADMIN_PASSWORD_HASH=${salt}:${scryptSync(password, salt, 64).toString('hex')}\n`;
  if (!/^SHOP_SESSION_SECRET=/m.test(env))
    env += `SHOP_SESSION_SECRET=${randomBytes(48).toString('hex')}\n`;
  writeFileSync(envPath, env, {mode: 0o600});
  mkdirSync('.shop', {recursive: true});
  writeFileSync(
    '.shop/admin-access.txt',
    `Farm El Baya — local shop admin\n\nPage: /fr/admin\nPassword: ${password}\n\nThis file is private and excluded from Git. Keep the password in a password manager and remove this file after saving it.\nThe password hash and session secret are in .env.local.\n`,
    {mode: 0o600},
  );
  console.log(
    'Shop admin configured. Local credentials are in .shop/admin-access.txt (excluded from Git). Restart the development server if it is running.',
  );
}
