# Lodgify Scheduled Messages — Farm El Baya

Guest-facing message templates for the **international / instant-book** path (PayPal via Lodgify checkout). The Tunisia path has its own separate WhatsApp-based flow and isn't covered here.

The voice and details below come directly from reading real WhatsApp conversations between Mahdi, Meriem, and past guests — not invented. See "Housekeeping" below for a few real inconsistencies that review surfaced.

**How to use this file:** copy each block into the matching message in Lodgify's Scheduled Messages editor. Edit freely — this is a starting point, not a fixed script. Before pasting, double-check that any date-related tags you add actually exist in Lodgify's merge-tag picker — the tags used below (`GuestFirstName`, `HouseName`, `OwnerName`, `HousePhone`, `OwnerUrl`, `CurrencyCode`, `PaymentAmount`, `BookingId`) are confirmed from Lodgify's own default templates.

## Public listing copy

Use the same accommodation name across the direct site, Lodgify, Airbnb, and Booking.com:

**Public name:** The Baya Room at Farm El Baya

**Platform headline:** Olive-Grove Farm Stay with Indoor-Outdoor Gym

**EN description**

Slow down in the Baya Room, an air-conditioned private room with its own bathroom on our family-run, 40-acre permaculture farm near Testour. Wake among olive, pomegranate, and fig trees, meet the animals that roam the farm, train in the indoor-outdoor movement gym, and end the day stargazing from the rooftop.

The room sleeps up to three guests. Your stay includes access to the farm's trails and shared outdoor spaces, plus the movement gym for yoga, calisthenics, mobility, rings, climbing, running, and parkour. You can also use two shared kitchens — one indoors and one open-air. A seasonal farm breakfast is available on request for 20 TND per person; home-cooked Tunisian lunch or dinner can be prepared with advance notice for 40 TND per person.

Farm El Baya is approximately one hour from Tunis, 15 minutes from Testour, and 20–40 minutes from the Roman ruins of Dougga.

This is a living, working farm rather than a resort. Animals roam freely, rural sounds are part of the experience, and Wi-Fi is suitable for basic use but can vary. Come for simple comfort, generous food, open land, and an authentic glimpse of farm life in northern Tunisia.

**FR description**

Ralentissez dans la Chambre Baya, une chambre privée climatisée avec sa propre salle de bain, au cœur de notre ferme permaculturelle familiale de 40 acres près de Testour. Réveillez-vous entre oliviers, grenadiers et figuiers, rencontrez les animaux qui vivent en liberté, entraînez-vous dans l'espace de mouvement intérieur et extérieur, puis terminez la journée sous les étoiles sur le toit.

La chambre accueille jusqu'à trois personnes. Votre séjour inclut l'accès aux sentiers et aux espaces extérieurs partagés, ainsi qu'à l'espace de mouvement pour le yoga, la callisthénie, la mobilité, les anneaux, la grimpe, la course et le parkour. Vous pouvez également utiliser deux cuisines partagées — une intérieure et une en plein air. Un petit-déjeuner fermier de saison est disponible sur demande à 20 TND par personne ; un déjeuner ou dîner tunisien maison peut être préparé sur réservation à 40 TND par personne.

Farm El Baya se trouve à environ une heure de Tunis, 15 minutes de Testour et 20 à 40 minutes du site romain de Dougga.

C'est une ferme vivante en activité, pas un hôtel-club. Les animaux circulent librement, les sons de la campagne font partie de l'expérience et le Wi-Fi convient à un usage simple mais peut varier. Venez pour le confort sans artifice, une cuisine généreuse, l'espace et une immersion authentique dans la vie d'une ferme du nord de la Tunisie.

## Real details worth knowing (learned from past guest chats)

- The farm is in **Slouguia village**, reached via the **Testour exit off the Béja highway**.
- **The live arrival script that actually works** (used almost word-for-word, every time, once a guest is at the gate): *"Blue gate — open it if it's closed — then straight ahead, then left between the olive trees. The house is at the end."* Guests get lost even with the GPS link alone (one drove 80km out of his way) — always pair the link with this landmark script.
- **Two kitchens** available for self-catering in the Baya suite: one shared indoor, one outdoor right in front of the guesthouse. Small grocery shops are ~10 minutes away in **Testour or Mjez El Beb**.
- **The Baya Room has air conditioning.** **Heating** is available in winter (oil-filled radiators, extra blankets on request). **Towels and foutas** are provided.
- A **horse lives on the farm**, but there's no formal guided riding service — experienced riders are welcome to ride or walk with him informally.
- **Three friendly dogs** live on the farm and may come say hello — worth mentioning proactively (as Mahdi already does), and confirming pets aren't allowed inside the house.
- Nearby dining beyond the farm: **Les Vergers des Montagnes** (15 min away, meals by reservation at least a day ahead, has a pool), **Pizza El Baraka** near the Testour exit (uses the farm's own cheese — the "4 fromage" is recommended), **Le Malouf** in Testour for traditional Tunisian food, and **Achour**, a méchoui (grilled meat) stand at the entrance to Slouguia, close to the farm.
- **No card payment on site** — meals and extras are cash only; this has been asked and confirmed more than once.
- A **guard (Mokhtar)** can assist guests checking in late when family isn't on-site.
- Two nice, human touches worth keeping alive: recommending the **sunset from the trampoline**, and a heads-up to **bring mosquito cream** (there are sometimes mosquitoes).
- **Farm El Baya has three independent suites** — Baya (the one with the mezzanine, and the one on the direct site/Lodgify), Elyssa, and a third — each rented separately, mostly via Airbnb/Booking.com for the two not on the direct site. If a WhatsApp or Airbnb conversation is about Elyssa or the third suite rather than Baya, double-check details before answering — kitchen setup and amenities may genuinely differ by suite, which likely explains some of the inconsistent descriptions found in past chats.

## Housekeeping — things this review surfaced

- **Check-out time corrected to 11:00 AM** (was 10:00 AM in the previous draft and on the current site — every real transcript shows 11am as the practiced norm, with flexibility for late flights). **Fixed on the live site too (`PolicyBlock.tsx`, `FaqBlock.tsx`) as of this update.**
- **Pricing drift found — and it's bigger than first thought.** Breakfast alone has been quoted at four different real prices across guest chats: 20 DT/couple, 30 DT/couple (four separate guests), 40 DT/couple, and 20 DT/person (=40/couple, the official site rate) — plus one guest got it free as a suite-specific perk. The templates and quick replies below standardize on the site's official numbers: **20 TND/person breakfast, 40 TND/person lunch or dinner.** Worth making a habit of reusing the Quick Replies below verbatim rather than quoting from memory.
- **The day-of-arrival check-in message is already a manual daily ritual** — "hope you're well 🙂 what time will you arrive today?" plus the GPS link is sent, nearly word-for-word, to almost every guest by hand. This is the strongest candidate to become an actual scheduled message rather than a manual one — see the new proposed message below. **Check whether Lodgify offers a "day of arrival" trigger** (distinct from the existing "2 days before arrival" one) before setting it up.
- **The Airbnb listing's map pin is confirmed wrong** — it points to a place called "Borj Lella," not the farm ("Oui elle est fausse. J'arrive pas à la changer"). At least one guest drove 80km out of the way because of it. This needs escalating directly to Airbnb support — not something a message template can fix.
- **A third phone number surfaced** — "+216 25 686 567," attributed to "ma mère" once and given out as a general contact twice more. On top of Meriem's, Mahdi's Tunisian number, and the Qatar WhatsApp, that's now four numbers in circulation. Worth deciding on the two (Mahdi/Meriem) used in the templates below and retiring the rest from active use.
- **Children's pricing may be more generous in practice than policy.** A 10-year-old was given a free breakfast in one chat ("the child will be complementary"), while the pricing agreed earlier this project was under-5 free, 5–12 half-price. Worth Mahdi confirming which is the real policy.
- **Suites clarified:** all three (Baya, Elyssa, and a third) still exist; only Baya is offered on the direct site/Lodgify for now. The single-room narrative on the website is accurate for the direct-booking path — nothing to change there.
- **Real guest feedback worth knowing, not a copy fix:** in her review, Narjess (4/5 stars) mentioned cobwebs at the windows, Wi-Fi that was "basically nonexistent" during her stay, and breakfast that felt expensive for what was included. Nothing to change in these templates — just flagging it as real signal for cleaning prep, Wi-Fi expectations, and breakfast presentation.

## Priority key

- 🔴 **Essential** — skipping this risks real guest confusion, anxiety, or a payment dispute.
- 🟡 **Valuable** — not strictly required, but meaningfully improves the guest experience or the brand.
- 🔵 **Business-serving** — helps Farm El Baya more than the guest directly (still fine to send).
- ⚪ **Forced** — Lodgify default that can't be turned off; written to stay harmless no matter when it fires.

---

## 🔴 Check-in instructions
*Trigger: 2 days before arrival — currently disabled in Lodgify, needs enabling.*

**EN**
```
Hi {{GuestFirstName}}, hope you're doing well :)

Looking forward to having you at Farm El Baya soon. Check-in is from 2:00 PM.

Here's the GPS link: https://maps.app.goo.gl/wRctHd9C7vw9p8XD7
The village is called Slouguia — take the Testour exit off the Béja highway. Free parking is available on site.

A few practical notes: the Baya Room has air conditioning. Wi-Fi works for basic use, but we're on a rural farm so connection can vary. If you'd like breakfast (20 TND/person), lunch, or dinner (40 TND/person each), just let me know a day ahead if you can. You're also welcome to use our two kitchens if you'd rather cook — there are small shops in Testour or Mjez El Beb, about 10 minutes away.

One small tip: bring some mosquito cream, just in case.

Any questions before you arrive, reach Mahdi at {{HousePhone}} or Meriem at +216 22 604 980.

See you soon,

{{OwnerName}} - {{HouseName}}
{{HousePhone}}
{{OwnerUrl}}
```

**FR**
```
Bonjour {{GuestFirstName}}, j'espère que vous allez bien :)

Nous avons hâte de vous accueillir bientôt à Farm El Baya. L'arrivée se fait à partir de 14h.

Voici le lien GPS : https://maps.app.goo.gl/wRctHd9C7vw9p8XD7
Le village s'appelle Slouguia, vous prenez la sortie de Testour sur l'autoroute de Béja. Parking gratuit sur place.

Quelques précisions utiles : la Chambre Baya est climatisée. Le Wi-Fi fonctionne pour un usage simple, mais nous sommes dans une ferme rurale donc la connexion peut varier. Pour le petit-déjeuner (20 dinars/personne), le déjeuner ou le dîner (40 dinars/personne chacun), dites-le-moi si possible la veille. Vous avez aussi accès à deux cuisines si vous préférez cuisiner vous-même — il y a de petites épiceries à Testour ou Mjez El Beb, à environ 10 minutes.

Petit conseil : pensez à ramener de la crème anti-moustique, on ne sait jamais.

Pour toute question avant votre arrivée, contactez Mahdi au {{HousePhone}} ou Meriem au +216 22 604 980.

À bientôt,

{{OwnerName}} - {{HouseName}}
{{HousePhone}}
{{OwnerUrl}}
```

---

## 🟡 Day-of-arrival check-in *(proposed — new)*
*This isn't one of Lodgify's default triggers, so it may not exist as an option — check for a "day of arrival" or "morning of check-in" trigger before setting it up. If it's not available, this is worth sending manually until it is, since it's already what happens for nearly every guest today by hand.*

**EN**
```
Hi {{GuestFirstName}}, hope you're doing well :)

What time do you think you'll arrive today?

Once you're close, here's how to find us: blue gate, open it if it's closed, then straight ahead and left between the olive trees — the house is at the end.

See you soon,

{{OwnerName}} - {{HouseName}}
{{HousePhone}}
```

**FR**
```
Bonjour {{GuestFirstName}}, j'espère que vous allez bien :)

Vers quelle heure pensez-vous arriver aujourd'hui ?

Une fois proche, voici comment nous trouver : portail bleu, ouvrez-le s'il est fermé, puis tout droit et à gauche entre les oliviers — la maison est au fond.

À bientôt,

{{OwnerName}} - {{HouseName}}
{{HousePhone}}
```

---

## 🔴 Booking accepted
*Trigger: booking confirmed — fires for every channel (direct, Airbnb, Booking.com), so keep it general, not payment-specific.*

**EN**
```
Hi {{GuestFirstName}},

Good news — your stay at {{HouseName}} is confirmed.

I'll send check-in details and directions closer to your arrival. In the meantime, if you have any questions, just reply here or reach Mahdi on WhatsApp at {{HousePhone}}.

Looking forward to hosting you,

{{OwnerName}} - {{HouseName}}
{{HousePhone}}
{{OwnerUrl}}
```

**FR**
```
Bonjour {{GuestFirstName}},

Bonne nouvelle — votre séjour à {{HouseName}} est confirmé.

Je vous enverrai les détails d'arrivée et l'itinéraire à l'approche de votre séjour. En attendant, pour toute question, répondez ici ou écrivez à Mahdi sur WhatsApp au {{HousePhone}}.

Au plaisir de vous accueillir,

{{OwnerName}} - {{HouseName}}
{{HousePhone}}
{{OwnerUrl}}
```

---

## 🟡 Welcome message
*Trigger: during stay — currently blank. Not strictly required (check-in info already covers logistics), but this is the personal-touch moment that differentiates a direct stay from an Airbnb listing.*

**EN**
```
Hi {{GuestFirstName}}, welcome to Farm El Baya.

Make yourself at home. The farm is yours to explore — the olive groves, the trails, the animals, and the rooftop at night, far from any city light. If you're around at sunset, the trampoline is a great spot for it.

Breakfast, lunch, and dinner are all available if you'd like them, made fresh from what the farm produces — just let us know a bit in advance. And if the mosquitoes are out, sorry in advance — worth having some cream on hand.

If anything comes up, message Mahdi at {{HousePhone}} or Meriem at +216 22 604 980 — we're close by.

Enjoy your stay,

{{OwnerName}} - {{HouseName}}
```

**FR**
```
Bonjour {{GuestFirstName}}, bienvenue à Farm El Baya.

Faites comme chez vous. La ferme est à vous pour l'explorer — les oliviers, les sentiers, les animaux, et le toit la nuit, loin de toute lumière de ville. Si vous êtes là au coucher du soleil, le trampoline est un très bon endroit pour ça.

Le petit-déjeuner, le déjeuner et le dîner sont disponibles si vous le souhaitez, préparés frais à partir de ce que produit la ferme — prévenez-nous simplement un peu à l'avance. Et s'il y a des moustiques, désolé d'avance — une petite crème peut être utile.

S'il y a quoi que ce soit, écrivez à Mahdi au {{HousePhone}} ou à Meriem au +216 22 604 980 — nous ne sommes jamais loin.

Profitez bien de votre séjour,

{{OwnerName}} - {{HouseName}}
```

---

## 🟡 Check-out reminder
*Trigger: day of departure. Low cost, mild value — mostly insurance against late-checkout confusion.*

**EN**
```
Hi {{GuestFirstName}},

Just a quick reminder that check-out is by 11:00 AM today.

I hope you leave feeling rested. If your travel plans need a bit more time, just let us know — we're often able to work something out.

Safe travels,

{{OwnerName}} - {{HouseName}}
```

**FR**
```
Bonjour {{GuestFirstName}},

Un petit rappel : le départ se fait avant 11h aujourd'hui.

J'espère que vous repartez reposé. Si vos plans de voyage demandent un peu plus de temps, dites-le-nous — on arrive souvent à s'arranger.

Bon voyage,

{{OwnerName}} - {{HouseName}}
```

---

## 🔵 Review request
*Trigger: 2 days after departure. The guest doesn't need this for a good stay — it exists to build the review base that makes direct booking credible.*

**EN**
```
Hi {{GuestFirstName}},

Thank you for staying at Farm El Baya — it was a pleasure hosting you.

If you have a minute, a short review helps other travelers find us, and helps me keep running the farm this way.

Google: https://www.google.com/maps/search/?api=1&query=Farm%20Elbaya%20Testour
Booking.com: https://www.booking.com/hotel/tn/farm-el-baya.fr.html#tab-reviews

Hope to host you again sometime,

{{OwnerName}} - {{HouseName}}
```

**FR**
```
Bonjour {{GuestFirstName}},

Merci d'avoir séjourné à Farm El Baya — ce fut un plaisir de vous accueillir.

Si vous avez un instant, un petit avis aide d'autres voyageurs à nous trouver, et m'aide à continuer à faire vivre la ferme ainsi.

Google : https://www.google.com/maps/search/?api=1&query=Farm%20Elbaya%20Testour
Booking.com : https://www.booking.com/hotel/tn/farm-el-baya.fr.html#tab-reviews

J'espère vous accueillir à nouveau,

{{OwnerName}} - {{HouseName}}
```

> **When a review isn't perfect:** Mahdi's real reply to a 4/5 review is a good model to keep using — thank them for the honest feedback, don't get defensive, say you hope next time will be different. That instinct already works; no need to script it.

---

## 🔴 Payment received
*Trigger: guest makes payment. Lodgify's default text says "everything is all set" — misleading, since this is the deposit, not the full amount. Fixed below.*

**EN**
```
Hi {{GuestFirstName}},

I've received your deposit of {{CurrencyCode}} {{PaymentAmount}} for your stay at {{HouseName}} (#{{BookingId}}).

Your dates are confirmed. The remaining balance is settled in person on arrival — no further online payment is needed.

Any questions, just reply here.

{{OwnerName}} - {{HouseName}}
{{HousePhone}}
{{OwnerUrl}}
```

**FR**
```
Bonjour {{GuestFirstName}},

J'ai bien reçu votre acompte de {{CurrencyCode}} {{PaymentAmount}} pour votre séjour à {{HouseName}} (#{{BookingId}}).

Vos dates sont confirmées. Le solde se règle en personne à l'arrivée — aucun autre paiement en ligne n'est nécessaire.

Pour toute question, répondez simplement ici.

{{OwnerName}} - {{HouseName}}
{{HousePhone}}
{{OwnerUrl}}
```

---

## 🔴 Payment failed
*Trigger: guest payment fails. Without this, a guest can believe they're booked when they aren't.*

**EN**
```
Hi {{GuestFirstName}},

Your deposit payment for {{HouseName}} (#{{BookingId}}) didn't go through. This can happen for a few reasons — sometimes it's worth simply trying again.

If it keeps failing, message me here or on WhatsApp at {{HousePhone}} and I'll help sort it out directly.

{{OwnerName}} - {{HouseName}}
```

**FR**
```
Bonjour {{GuestFirstName}},

Votre paiement d'acompte pour {{HouseName}} (#{{BookingId}}) n'a pas abouti. Cela arrive parfois — un nouvel essai suffit souvent.

Si le problème persiste, écrivez-moi ici ou sur WhatsApp au {{HousePhone}} et je vous aiderai directement.

{{OwnerName}} - {{HouseName}}
```

---

## 🔴 Booking canceled
*Trigger: booking canceled. Silence after a cancellation invites a "did this actually go through?" follow-up.*

**EN**
```
Hi {{GuestFirstName}},

Your booking at {{HouseName}} (#{{BookingId}}) has been canceled.

If a refund applies under our cancellation policy, you'll receive a separate confirmation once it's processed.

Hope to welcome you to the farm another time,

{{OwnerName}} - {{HouseName}}
```

**FR**
```
Bonjour {{GuestFirstName}},

Votre réservation à {{HouseName}} (#{{BookingId}}) a été annulée.

Si un remboursement s'applique selon notre politique d'annulation, vous recevrez une confirmation séparée une fois celui-ci traité.

J'espère vous accueillir à la ferme une autre fois,

{{OwnerName}} - {{HouseName}}
```

---

## 🔴 Refund processed
*Trigger: host issues refund. Pairs with the above — closes the loop.*

**EN**
```
Hi {{GuestFirstName}},

Your refund of {{CurrencyCode}} {{PaymentAmount}} for {{HouseName}} (#{{BookingId}}) has been processed via PayPal.

Thank you for your understanding, and I hope to host you another time.

{{OwnerName}} - {{HouseName}}
```

**FR**
```
Bonjour {{GuestFirstName}},

Votre remboursement de {{CurrencyCode}} {{PaymentAmount}} pour {{HouseName}} (#{{BookingId}}) a été traité via PayPal.

Merci de votre compréhension, j'espère vous accueillir une autre fois.

{{OwnerName}} - {{HouseName}}
```

---

## ⚪ Payment reminder
*Trigger: unclear — this message can't be disabled on the account, and it's unconfirmed whether a real scheduled second charge exists. Written to stay true regardless of when it fires: no demand for money, just reassurance.*

**EN**
```
Hi {{GuestFirstName}},

Just confirming your stay at {{HouseName}} (#{{BookingId}}) is all set on our end. If your deposit is already paid, there's nothing else to do — the remaining balance is simply settled in person on arrival.

If anything looks off on your side, message me here or on WhatsApp at {{HousePhone}}.

{{OwnerName}} - {{HouseName}}
```

**FR**
```
Bonjour {{GuestFirstName}},

Je confirme que votre séjour à {{HouseName}} (#{{BookingId}}) est bien en ordre de notre côté. Si votre acompte est déjà réglé, il n'y a rien d'autre à faire — le solde se règle simplement en personne à l'arrivée.

Si quelque chose ne semble pas correct de votre côté, écrivez-moi ici ou sur WhatsApp au {{HousePhone}}.

{{OwnerName}} - {{HouseName}}
```

---

## Quick replies

Straight from the recurring questions in real guest chats — these are for Lodgify's Quick Replies feature (or just copy-paste on WhatsApp/Airbnb/Booking.com), not scheduled messages, since they fire on-demand rather than on a trigger. Written in Lodgify's own "Reply to..." format.

### Reply to "How do we find the farm?" (before arrival)
**EN**
```
Here's the GPS link for Farm El Baya: https://maps.app.goo.gl/wRctHd9C7vw9p8XD7
The village is called Slouguia — take the Testour exit off the Béja highway.
You can reach us at {{HousePhone}} (Mahdi) or +216 22 604 980 (Meriem).
See you soon!
```
**FR**
```
Voici le lien GPS pour Farm El Baya : https://maps.app.goo.gl/wRctHd9C7vw9p8XD7
Le village s'appelle Slouguia, vous prenez la sortie de Testour sur l'autoroute de Béja.
Vous pouvez nous joindre au {{HousePhone}} (Mahdi) ou au +216 22 604 980 (Meriem).
Merci et à bientôt !
```

### Reply to "We're here / at the gate, how do we get in?" (live, on arrival)
*Send this in the moment — pairs with the GPS link above, which alone hasn't been enough for several guests.*

**EN**
```
Blue gate — open it if it's closed. Then straight ahead, and left between the olive trees. The house is at the end. Welcome!
```
**FR**
```
Portail bleu — ouvrez-le s'il est fermé. Puis tout droit, et à gauche entre les oliviers. La maison est au fond. Bienvenue !
```

### Reply to "What's breakfast/lunch/dinner and how much?"
**EN**
```
Farm breakfast is 20 TND per person (farm eggs, olive oil, traditional bread, jam, coffee or tea). Lunch and dinner are 40 TND per person each, ideally ordered a day ahead so we can prepare. Let me know if you have any allergies or preferences.
```
**FR**
```
Le petit-déjeuner fermier est à 20 dinars par personne (œufs de la ferme, huile d'olive, pain traditionnel, confiture, café ou thé). Le déjeuner et le dîner sont à 40 dinars par personne chacun, idéalement à commander la veille pour qu'on puisse préparer. Dites-moi si vous avez des allergies ou des préférences.
```

### Reply to "Can we cook our own meals?"
**EN**
```
Yes, of course — you're welcome to use our two kitchens (one indoor, one outdoor) if you'd rather cook than order. Small grocery shops are about 10 minutes away in Testour or Mjez El Beb.
```
**FR**
```
Oui bien sûr — vous avez accès à deux cuisines (une intérieure, une extérieure) si vous préférez cuisiner plutôt que commander. De petites épiceries se trouvent à environ 10 minutes, à Testour ou Mjez El Beb.
```

### Reply to "Any local recommendations?"
**EN**
```
Absolutely! A few favorites nearby:
- The Roman site of Dougga - beautiful, and one of the best-preserved in North Africa
- Testour and Teboursouk - lovely traditional towns, both close by
- Le Malouf in Testour - great for traditional Tunisian food
- Pizza El Baraka, near the Testour exit - they use our farm's own cheese
- Achour, a méchoui (grilled meat) stand at the entrance to Slouguia, very close to us
- Les Vergers des Montagnes - 15 minutes away, has a pool, but meals need booking a day ahead
Let me know what you're in the mood for and I'm happy to point you in the right direction!
```
**FR**
```
Avec plaisir ! Quelques favoris dans le coin :
- Le site romain de Dougga - magnifique, l'un des mieux conservés d'Afrique du Nord
- Testour et Teboursouk - de jolis villages traditionnels, tout proches
- Le Malouf à Testour - excellent pour la cuisine tunisienne traditionnelle
- Pizza El Baraka, à la sortie de Testour - ils utilisent notre propre fromage de ferme
- Achour, un stand de méchoui à l'entrée de Slouguia, tout près de nous
- Les Vergers des Montagnes - à 15 minutes, avec piscine, mais réservez les repas la veille
Dites-moi ce qui vous ferait plaisir et je vous oriente volontiers !
```

### Reply to "Is there Wi-Fi?"
**EN**
```
Yes, Wi-Fi is available - though we're on a rural farm, so the connection can vary a bit. We'll give you the network name and password when you arrive.
```
**FR**
```
Oui, le Wi-Fi est disponible - même si nous sommes dans une ferme rurale, donc la connexion peut un peu varier. Nous vous donnerons le nom du réseau et le mot de passe à votre arrivée.
```

### Reply to "Is there air conditioning or heating?"
**EN**
```
Yes. The Baya Room has air conditioning. In winter, we also provide heating (oil-filled radiators) and extra blankets, so don't worry about the cold.
```
**FR**
```
Oui. La Chambre Baya est climatisée. En hiver, nous fournissons aussi du chauffage (radiateurs bain d'huile) et des couvertures supplémentaires, ne vous inquiétez pas pour le froid.
```

### Reply to "Can we go horseback riding?"
**EN**
```
We have a very gentle horse on the farm. If you have riding experience, you're welcome to ride or walk with him - we don't currently offer a formal guided riding service though.
```
**FR**
```
Nous avons un cheval très gentil sur la ferme. Si vous avez de l'expérience, vous pouvez le monter ou vous promener avec lui - mais nous ne proposons pas pour l'instant de service d'équitation encadré.
```

### Reply to "Are there animals / do you have pets on the farm?"
**EN**
```
Yes - we have three very friendly dogs who may come say hello, plus a gentle horse and some free-roaming farm animals. Just let us know if you'd rather they kept their distance. For your own pets: they're welcome on the farm, but please don't bring them inside the house.
```
**FR**
```
Oui - nous avons trois chiens très gentils qui viendront peut-être vous dire bonjour, ainsi qu'un cheval doux et quelques animaux en liberté sur la ferme. Dites-nous si vous préférez qu'ils gardent leurs distances. Pour vos propres animaux : ils sont bienvenus sur la ferme, mais merci de ne pas les faire entrer dans la maison.
```

### Reply to "Can we pay by card?"
**EN**
```
Unfortunately not on site - meals and any extras are settled in cash when you're here. If you booked through Airbnb or Booking.com, the room itself is already paid through the platform.
```
**FR**
```
Malheureusement non sur place - les repas et les extras se règlent en espèces sur place. Si vous avez réservé via Airbnb ou Booking.com, la chambre elle-même est déjà payée via la plateforme.
```

### Positive reply to "Can we check in early?"
**EN**
```
Thanks for checking! We're often on site, so an early arrival is usually fine - just let us know roughly when you'll be here and we'll make sure everything's ready.
```
**FR**
```
Merci de demander ! Nous sommes souvent sur place, donc une arrivée plus tôt est généralement possible - dites-nous simplement à peu près quand vous arriverez et on s'assurera que tout est prêt.
```

### Negative reply to "Can we check in early?"
**EN**
```
Thanks for asking! We need a bit more time to have the room ready today, so check-in is from 2:00 PM. Happy to store your bags earlier if that helps, and you're welcome to enjoy the farm grounds while you wait.
```
**FR**
```
Merci de demander ! Nous avons besoin d'un peu plus de temps pour préparer la chambre aujourd'hui, donc l'arrivée se fait à partir de 14h. Nous pouvons garder vos bagages avant si besoin, et vous êtes les bienvenus pour profiter de la ferme en attendant.
```

### Positive reply to "Can we check out a bit later?"
**EN**
```
No problem at all - just let us know your flight or departure time and we'll work something out. Hope it gives you a more relaxed morning.
```
**FR**
```
Pas de souci du tout - indiquez-nous simplement votre heure de vol ou de départ et on s'arrangera. J'espère que ça vous donnera une matinée plus tranquille.
```

### Negative reply to "Can we check out a bit later?"
**EN**
```
I'd love to offer more time, but we have guests arriving soon and need to prepare the room. Check-out is by 11:00 AM, but you're welcome to leave your bags with us for a bit afterward if that helps.
```
**FR**
```
J'aimerais vous donner plus de temps, mais nous avons des invités qui arrivent bientôt et devons préparer la chambre. Le départ se fait avant 11h, mais vous pouvez laisser vos bagages avec nous un moment après si ça vous aide.
```

### Reply to "The weather/roads look bad, can we push back or cancel?"
*Matches how this has actually been handled well - no friction, no guilt, door left open.*

**EN**
```
No worries at all, please stay safe - that comes first. Let us know how your plans change and we'll sort out the dates (or the cancellation) with you.
```
**FR**
```
Aucun souci, restez en sécurité avant tout. Tenez-nous au courant de vos plans et on s'arrangera pour les dates (ou l'annulation) avec vous.
```

---

## Left disabled (not applicable to this setup)

| Message | Why it's off |
|---|---|
| Card pre-authorization / Damage charge | No card-based security-deposit mechanism exists yet — would need a payment gateway that isn't set up. |
| Send quote / Quote reminder / Quote expired | Only relevant if quoting custom prices to inquiries; the Baya Room uses fixed pricing and instant book. |
| Inquiry received / Booking request / Booking rejected | Only relevant for Request-to-Book; the international path is instant book. |
| Change request accepted | Low priority — revisit if guests start asking to shift dates often. |
