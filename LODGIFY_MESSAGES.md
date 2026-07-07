# Lodgify Scheduled Messages — Farm El Baya

Guest-facing message templates for the **international / instant-book** path (PayPal via Lodgify checkout). The Tunisia path has its own separate WhatsApp-based flow and isn't covered here.

The voice and details below come directly from reading real WhatsApp conversations between Mahdi, Meriem, and past guests — not invented. See "Housekeeping" below for a few real inconsistencies that review surfaced.

**How to use this file:** copy each block into the matching message in Lodgify's Scheduled Messages editor. Edit freely — this is a starting point, not a fixed script. Before pasting, double-check that any date-related tags you add actually exist in Lodgify's merge-tag picker — the tags used below (`GuestFirstName`, `HouseName`, `OwnerName`, `HousePhone`, `OwnerUrl`, `CurrencyCode`, `PaymentAmount`, `BookingId`) are confirmed from Lodgify's own default templates.

## Real details worth knowing (learned from past guest chats)

- The farm is in **Slouguia village**, reached via the **Testour exit off the Béja highway**.
- **Two kitchens** available for self-catering: one shared indoor, one outdoor right in front of the guesthouse. Small grocery shops are ~10 minutes away in **Testour or Mjez El Beb**.
- **No air conditioning** — fans are provided, and rooms have several windows. **Heating** is available in winter. **Towels and foutas** are provided.
- A **horse lives on the farm**, but there's no formal guided riding service — experienced riders are welcome to ride or walk with him informally.
- Nearby dining beyond the farm: **Les Vergers des Montagnes** (15 min away, meals by reservation at least a day ahead, has a pool), a pizzeria near the Testour exit, and **Le Malouf** in Testour for traditional Tunisian food.
- A **guard** can assist guests checking in late when family isn't on-site.
- Two nice, human touches worth keeping alive: recommending the **sunset from the trampoline**, and a heads-up to **bring mosquito cream** (there are sometimes mosquitoes).

## Housekeeping — things this review surfaced

- **Check-out time corrected to 11:00 AM** (was 10:00 AM in the previous draft and on the current site — every real transcript shows 11am as the practiced norm, with flexibility for late flights). **The website's own copy still says 10:00 AM — worth fixing there too, separately from this file.**
- **Pricing drift found:** breakfast was quoted as "40 dinars par couple" once, "20 dinars par personne" (= 40/couple, consistent) another time, but **"30 dinars par couple" to one guest (Salma)** — that figure doesn't match either. The templates below standardize on the site's official numbers: **20 TND/person breakfast, 40 TND/person lunch or dinner.** Worth making sure everyone quotes these same figures going forward.
- **Three phone numbers were circulating** (Mahdi's Qatar WhatsApp, Mahdi's Tunisian number, Meriem's Tunisian number). Standardized below: **Mahdi ({{HousePhone}}) for bookings and payments, Meriem (+216 22 604 980) for arrival and on-site questions** — matching how the family actually splits the work.
- **Two GPS links were in use.** Standardized on `https://maps.app.goo.gl/wRctHd9C7vw9p8XD7`, the one used in nearly every conversation.
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

A few practical notes: there's no AC, but fans are provided and the room has several windows. Wi-Fi works for basic use, but we're on a rural farm so connection can vary. If you'd like breakfast (20 TND/person), lunch, or dinner (40 TND/person each), just let me know a day ahead if you can. You're also welcome to use our two kitchens if you'd rather cook — there are small shops in Testour or Mjez El Beb, about 10 minutes away.

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

Quelques précisions utiles : pas de climatisation, mais des ventilateurs sont fournis et la chambre a plusieurs fenêtres. Le Wi-Fi fonctionne pour un usage simple, mais nous sommes dans une ferme rurale donc la connexion peut varier. Pour le petit-déjeuner (20 dinars/personne), le déjeuner ou le dîner (40 dinars/personne chacun), dites-le-moi si possible la veille. Vous avez aussi accès à deux cuisines si vous préférez cuisiner vous-même — il y a de petites épiceries à Testour ou Mjez El Beb, à environ 10 minutes.

Petit conseil : pensez à ramener de la crème anti-moustique, on ne sait jamais.

Pour toute question avant votre arrivée, contactez Mahdi au {{HousePhone}} ou Meriem au +216 22 604 980.

À bientôt,

{{OwnerName}} - {{HouseName}}
{{HousePhone}}
{{OwnerUrl}}
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

Straight from the recurring questions in real guest chats — these are for Lodgify's Quick Replies feature (or just copy-paste), not scheduled messages, since they fire on-demand rather than on a trigger.

### Directions / GPS
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

### Meals & pricing
**EN**
```
Farm breakfast is 20 TND per person (farm eggs, olive oil, traditional bread, jam, coffee or tea). Lunch and dinner are 40 TND per person each, ideally ordered a day ahead. You're also welcome to use our two kitchens (one indoor, one outdoor) if you'd rather cook — there are small grocery shops about 10 minutes away in Testour or Mjez El Beb.
```
**FR**
```
Le petit-déjeuner fermier est à 20 dinars par personne (œufs de la ferme, huile d'olive, pain traditionnel, confiture, café ou thé). Le déjeuner et le dîner sont à 40 dinars par personne chacun, idéalement à commander la veille. Vous avez aussi accès à deux cuisines (une intérieure, une extérieure) si vous préférez cuisiner vous-même — il y a de petites épiceries à 10 minutes (Testour ou Mjez El Beb).
```

### Horseback riding
**EN**
```
We have a very gentle horse on the farm. If you have riding experience, you're welcome to ride or walk with him — we don't currently offer a formal guided riding service though.
```
**FR**
```
Nous avons un cheval très gentil sur la ferme. Si vous avez de l'expérience, vous pouvez le monter ou vous promener avec lui — mais nous ne proposons pas pour l'instant de service d'équitation encadré.
```

### Nearby attractions
**EN**
```
Nearby, there's the Roman site of Dougga (beautiful), the towns of Testour and Teboursouk, and Le Kef about 1.5 hours away. For meals out, there's also Les Vergers des Montagnes (15 min away, reserve at least a day ahead, has a pool) and Le Malouf restaurant in Testour for traditional Tunisian food.
```
**FR**
```
Autour de la ferme, il y a le site romain de Dougga (magnifique), les villages de Testour et Teboursouk, et la ville du Kef à environ 1h30. Pour manger, il y a aussi Les Vergers des Montagnes (15 min, réservation au moins un jour à l'avance, avec piscine) et le restaurant Le Malouf à Testour pour de la cuisine tunisienne traditionnelle.
```

### Wi-Fi / AC / heating
**EN**
```
Wi-Fi is available, but we're on a rural farm so the connection can vary. There's no air conditioning, but fans are provided and the rooms have several windows. Heating is available in winter.
```
**FR**
```
Le Wi-Fi est disponible mais nous sommes dans une ferme rurale donc la connexion peut varier. Pas de climatisation, mais des ventilateurs sont fournis et les chambres ont plusieurs fenêtres. Le chauffage est disponible en hiver.
```

### Late check-out request
**EN**
```
No problem, a later check-out is often possible depending on availability — just tell us your flight or departure time and we'll work it out.
```
**FR**
```
Pas de souci, c'est possible de partir un peu plus tard selon les disponibilités — dites-nous simplement votre heure de vol ou de départ et on s'organise.
```

---

## Left disabled (not applicable to this setup)

| Message | Why it's off |
|---|---|
| Card pre-authorization / Damage charge | No card-based security-deposit mechanism exists yet — would need a payment gateway that isn't set up. |
| Send quote / Quote reminder / Quote expired | Only relevant if quoting custom prices to inquiries; the Baya Room uses fixed pricing and instant book. |
| Inquiry received / Booking request / Booking rejected | Only relevant for Request-to-Book; the international path is instant book. |
| Change request accepted | Low priority — revisit if guests start asking to shift dates often. |
