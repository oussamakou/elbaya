# Farm El Baya — Copywriter Handoff (English)

## How to use this document

- This document lists only the copy that renders **visibly on the page** — headlines, buttons, body text, labels, form fields, review quotes. It does not include meta titles/descriptions (search-result snippets), image alt text, or aria-only labels read by screen readers but never printed on screen.
- Every row has an **ID** (e.g. `HOME-HERO-01`). Please **don't change the ID** — it's how the edit gets mapped back to the right file in the site when we implement it.
- Edit only the **New Copy** column. Leave it blank if a line is fine as-is.
- The **Notes / where it appears** column gives context: what kind of element it is (headline, button, quick fact...), any length constraint, and which page/section it's on.
- Some strings are **shared** across multiple pages (marked "shared" in Notes) — one edit updates it everywhere it appears.
- A few items are flagged **⚠️ NEEDS DECISION** — pre-existing issues spotted during extraction (e.g. French text left on the English page). Please leave a note in New Copy on what to do, even if it's "leave as-is."
- This is the **English** copy only. French lives in matching files and will be handled as a separate pass once English is locked — flag in Notes if a line shouldn't just be a literal translation (e.g. idioms, guest quotes).
- Source: most copy comes from `content/en/*.json` content files; some is hardcoded directly in component files (noted per row where relevant — not needed for editing, just context for us).

---

## Homepage

| ID | Notes / where it appears | Current Copy | New Copy |
|---|---|---|---|
| HOME-HERO-HEAD | Hero headline (renders on two lines) | Farm stays under\nthe olive trees. | |
| HOME-HERO-SUB | Hero subheadline | A private room on a 40-acre permaculture farm in Testour, one hour from Tunis. Olive groves, animals, and room to move. | |
| HOME-HERO-CTA | Hero button | Check availability | |
| HOME-HERO-SCROLL | Small "scroll" hint below the hero, only on the homepage (other pages' heroes don't have this) | Scroll | |
| HOME-FACTS-01 | Quick-facts strip, item 1 | Baya Room · sleeps 3 | |
| HOME-FACTS-02 | Quick-facts strip, item 2 | From 180 DT / night | |
| HOME-FACTS-03 | Quick-facts strip, item 3 | Movement, animals, olive groves | |
| HOME-FACTS-04 | Quick-facts strip, item 4 | 1 hour from Tunis | |
| HOME-FACTS-05 | Quick-facts strip, item 5 | Open farm space & movement area | |
| HOME-QUOTE | Pull-quote banner (also reused on Farm page — shared) | Get lost on purpose. The best places aren't always on the map. | |
| HOME-PILLAR1-TITLE | Three Pillars, pillar 1 title | The room | |
| HOME-PILLAR1-BODY | Three Pillars, pillar 1 body | One private room - the Baya Room - with a private bathroom, quiet mornings, and a direct rate from 180 DT per night. | |
| HOME-PILLAR2-TITLE | Three Pillars, pillar 2 title | The table | |
| HOME-PILLAR2-BODY | Three Pillars, pillar 2 body — reworded so it doesn't read as a fixed daily menu (same fix as the Stay-page breakfast section) | Farm breakfast on request (20 DT) - fresh and seasonal, different every morning. Lunch and dinner on request: Tunisian home cooking by Mahdi's mother. | |
| HOME-PILLAR3-TITLE | Three Pillars, pillar 3 title | The land | |
| HOME-PILLAR3-BODY | Three Pillars, pillar 3 body | Forty acres of olive groves, pomegranates, and fig trees, with beehives, animals, and trails between them. Stargaze from the rooftop, or step out to Andalusian Testour and Roman Dougga, both a short drive from this authentic, working farm. | |
| HOME-PILLAR-LINK | Link label under each pillar | Discover more | |
| HOME-PILLAR-DECOR | Large decorative background text behind pillars (not read as content, purely visual — flag if it should change) | El Baya Retreat | |
| HOME-MOVE-EYEBROW | Movement & Family section, eyebrow (shared with Experiences page) | Movement and family space | |
| HOME-MOVE-HEAD | Movement & Family section, heading (shared) | A farm where bodies can move. | |
| HOME-MOVE-BODY | Movement & Family section, body text (shared) | Farm El Baya now includes Mahdi's movement area: an indoor and outdoor space for yoga, calisthenics, mobility, rings, climbing, and playful physical exploration - part farm gym, part open ground for a run or parkour. | |
| HOME-MOVE-CTA | Movement & Family section, button (shared) | See experiences | |
| HOME-REVIEWS-HEAD | Reviews section heading | Guests leave grounded. | |
| HOME-REVIEWS-SUB | Reviews section subhead | Public reviews mention the food, calm, hospitality, and the feeling of being welcomed into real farm life. | |
| HOME-REVIEWS-EYEBROW | Reviews section eyebrow | Verified guest proof | |
| HOME-REVIEWS-STAT1 | Stat label ("5.0" is the number, this is the caption) | Google review examples from recent guests | |
| HOME-REVIEWS-STAT2 | Stat label ("8-10" is the number, this is the caption) | Booking.com guest scores shared by travelers | |
| HOME-REVIEWS-STAT3 | Stat label ("24h" is the number, this is the caption) | Typical direct booking response window | |
| HOME-TEST-01 | Guest testimonial 1 — Helmi, Finland, Nov 2025 | You can see that everything on the farm is made with love and purpose. You feel good and relaxed there. The food that you get there is the best food you will get in Tunisia. | |
| HOME-TEST-02 | Guest testimonial 2 — Mariah, United States, Mar 2025 | Leaving the farm I feel grounded, nourished, and inspired. The time I spent here was immersive. I was provided with more food than I could eat. | |
| HOME-TEST-03 | Guest testimonial 3 — Lorenzo, Italy, Google Review | I wanted to stay only one night but stayed for two. To be honest, I wanted to stay a whole week. | |
| HOME-TEST-04 | ⚠️ NEEDS DECISION — Guest testimonial 4, Souhir/Tunisia. This quote is in French but displays on the English page as-is. Decide: translate to English, or keep French as an authentic guest-voice touch? | Un coup de cœur et un coup de foudre. Quand simplicité rime avec authenticité, hospitalité et générosité. | |
| HOME-TEST-05 | Guest testimonial 5 — Romeo, France, Nov 2025 | Combining organic farming, sports, and personal development is simply fantastic. You can feel that it is his passion that drives him. | |
| HOME-CONF-EYEBROW | Booking Confidence section, eyebrow (shared across Home/Stay/Experiences) | Book direct with confidence | |
| HOME-CONF-HEAD | Booking Confidence section, heading (shared) | No platform fees. Clear next steps. A real host replies. | |
| HOME-CONF-BODY | Booking Confidence section, body (shared) | Send your dates and guest count. Mahdi replies within 24 hours with availability, meal options, and any deposit details before anything is confirmed. | |
| HOME-CONF-CTA | Booking Confidence section, button (shared) | Request availability | |
| HOME-CONF-WA | Booking Confidence section, WhatsApp link label (shared) | WhatsApp Mahdi | |
| HOME-CONF-PT1 | Booking Confidence bullet point (shared) | Farm breakfast on request (20 DT) | |
| HOME-CONF-PT2 | Booking Confidence bullet point (shared) | Payment settled on arrival | |
| HOME-CONF-PT3 | Booking Confidence bullet point (shared) | Lunch, dinner, and farm experiences on request | |
| HOME-CONF-PT4 | Booking Confidence bullet point (shared) | One hour from Tunis, 15 minutes from Testour | |
| HOME-FORGE-LABEL | Forge teaser banner, small label | COMING THIS SUMMER | |
| HOME-FORGE-HEAD | Forge teaser banner, heading | Forge. | |
| HOME-FORGE-BODY | Forge teaser banner, body | A separate seven-day men's retreat on this land. Physical work. Cold mornings. Honest conversation. | |
| HOME-FORGE-CTA | Forge teaser banner, button | Explore Forge → | |

---

## Homepage — third-party reviews (not editable as marketing copy)

These 9 reviews are real quotes pulled from Google/Booking.com and displayed as review cards. **Please don't rewrite the review text itself** — but flag in New Copy if you'd cut any of them, want them reordered, or want the section intro copy (above, `HOME-REVIEWS-*`) changed instead.

| ID | Reviewer | Current Copy | New Copy (only for cut/reorder notes) |
|---|---|---|---|
| HOME-REV-01 | Elisabeth K., Google · 5★ | A little escape into nature. I really enjoyed discovering Farm El Baya, with its olive trees, animals and delicious home-cooked Tunisian lunch. | |
| HOME-REV-02 | Audrey Chen, Google · 5★ | I had such a lovely stay at Farm El Baya. Several archaeological sites were within the area. I loved all the creatures and the host parents fed me like a queen. | |
| HOME-REV-03 | Lorenzo Pagnutti, Google · 5★ | Absolutely amazing place. We planned to stay only one night but ended staying for an extra one. Don't forget to go on the rooftop and look at the stars at night. | |
| HOME-REV-04 | Ahmed Kalfat, Google · 5★ | The atmosphere is authentic yet modern, a clean and calm space to take a break and come back to the essentials of life. The food is made with care and generosity. | |
| HOME-REV-05 | ⚠️ NEEDS DECISION — Mehdi Slim, Google · 5★, in French with no translation shown | Un séjour absolument incroyable dans cette ferme aux portes de Tunis. Le rooftop offre un ciel étoilé à couper le souffle. Un séjour parfait. | |
| HOME-REV-06 | David Moreno, Google · 5★ | The breakfast was the best in our stay in Tunisia: eggs from the farm, yogurt made with their resources, oil from their olive trees. | |
| HOME-REV-07 | Romeo Gaucher, Google · 5★ | A beautiful and peaceful place where life feels good. Animals, flora, and family members all form a place of tranquility far from the city. | |
| HOME-REV-08 | Pascal, Booking.com · 10/10 | Perfect stop for our cross-country roadtrip. Extremely comfy place with a relaxed, welcoming atmosphere and incredibly helpful, attentive people. | |
| HOME-REV-09 | Natalie, Booking.com · 8/10 | Comfortable stay on a farm with friendly owners. Lovely olive farm with goats and a good Tunisian breakfast. I would recommend this stay. | |

---

## Stay page

| ID | Notes / where it appears | Current Copy | New Copy |
|---|---|---|---|
| STAY-HERO-HEAD | Hero headline | A private room under the olive trees. | |
| STAY-FACTS-01 | Quick-facts strip, item 1 | Baya Room | |
| STAY-FACTS-02 | Quick-facts strip, item 2 | Private | |
| STAY-FACTS-03 | Quick-facts strip, item 3 | From 180 DT / night | |
| STAY-FACTS-04 | Quick-facts strip, item 4 | 20 DT add-on | |
| STAY-FACTS-05 | Quick-facts strip, item 5 | Within 24 hours | |
| STAY-INTRO-BODY | Intro paragraph | One private room - the Baya Room - with its own bathroom, air conditioning, its own light, and its own quiet. Farm breakfast is available each morning (20 DT). This is not a hotel. It is a living farm that welcomes one stay at a time. | |
| STAY-INTRO-CTA | Intro button | Check availability | |
| STAY-ROOM-NAME | Room Showcase, room name | The Baya Room | |
| STAY-ROOM-BADGE | Room Showcase, rate badge | From 180 DT / night | |
| STAY-ROOM-INTRO | Room Showcase, intro text | The Baya Room is private and air-conditioned. The olive groves, rooftop, and quiet of a working farm are just outside. | |
| STAY-ROOM-SPEC1 | Room Showcase, spec line | Private room with a private bathroom | |
| STAY-ROOM-SPEC2 | Room Showcase, spec line | Sleeps up to 3 guests | |
| STAY-ROOM-SPEC3 | Room Showcase, spec line | Air conditioning | |
| STAY-ROOM-CTA | Room Showcase, button | Request the Baya Room | |
| STAY-ADDONS-HEAD | Optional extras section, heading | Make the stay your own. | |
| STAY-ADDONS-INTRO | Optional extras section, intro | Add farm meals, hands-on sessions, or a local outing when you book. Every extra is arranged in advance, and seasonal activities depend on availability. | |
| STAY-ADDONS-CURRENCY | Optional extras section, price note | DT prices follow the farm rates; euro amounts match the Lodgify add-ons. | |
| STAY-ADDONS-REVEAL | Full add-on list disclosure | Compare all 9 add-ons | |
| STAY-ADDONS-FEATURE1-LABEL | Featured add-on 1, small label | From the kitchen | |
| STAY-ADDONS-FEATURE1-TITLE | Featured add-on 1, title | Farm breakfast | |
| STAY-ADDONS-FEATURE1-BODY | Featured add-on 1, description | A seasonal breakfast prepared fresh each morning from the farm and nearby producers. | |
| STAY-ADDONS-FEATURE1-PRICE | Featured add-on 1, price | 20 DT / €6 per guest, per day | |
| STAY-ADDONS-FEATURE2-LABEL | Featured add-on 2, small label | Move with Mahdi | |
| STAY-ADDONS-FEATURE2-TITLE | Featured add-on 2, title | Training session | |
| STAY-ADDONS-FEATURE2-BODY | Featured add-on 2, description | A 90-minute assessment, training session, and practical plan to take home. | |
| STAY-ADDONS-FEATURE2-PRICE | Featured add-on 2, price | 70 DT / €21 per guest | |
| STAY-ADDONS-FEATURE3-LABEL | Featured add-on 3, small label | October to December | |
| STAY-ADDONS-FEATURE3-TITLE | Featured add-on 3, title | Olive harvest | |
| STAY-ADDONS-FEATURE3-BODY | Featured add-on 3, description | Pick with the family and follow the harvest. Olive oil is available separately. | |
| STAY-ADDONS-FEATURE3-PRICE | Featured add-on 3, price | 50 DT / €15 per guest | |
| STAY-ADDONS-GROUP1 | Full add-on list, group heading | Meals | |
| STAY-ADDONS-MEAL1 | Full add-on list, meal | Farm breakfast - Prepared fresh each morning. - 20 DT / €6 per guest, per day | |
| STAY-ADDONS-MEAL2 | Full add-on list, meal | Home-cooked lunch - Local ingredients; request in advance. - 40 DT / €12 per guest | |
| STAY-ADDONS-MEAL3 | Full add-on list, meal | Dinner with the family - Traditional dinner; request in advance. - 40 DT / €12 per guest | |
| STAY-ADDONS-MEAL4 | Full add-on list, meal | Kids meal - A half portion for children aged 5 to 12. - 20 DT / €6 per child | |
| STAY-ADDONS-GROUP2 | Full add-on list, group heading | Farm experiences | |
| STAY-ADDONS-EXP1 | Full add-on list, farm experience | Training session with Mahdi - A 90-minute assessment, session, and take-home plan. - 70 DT / €21 per guest | |
| STAY-ADDONS-EXP2 | Full add-on list, farm experience | Beekeeping visit - A guided hive visit with the protective suit provided. - 40 DT / €12 per guest | |
| STAY-ADDONS-EXP3 | Full add-on list, farm experience | Olive harvest - Seasonal from October to December; olive oil sold separately. - 50 DT / €15 per guest | |
| STAY-ADDONS-EXP4 | Full add-on list, farm experience | Cooking with the family - Prepare bread and local dishes; the shared meal is included. - 70 DT / €21 per guest | |
| STAY-ADDONS-GROUP3 | Full add-on list, group heading | Local outing | |
| STAY-ADDONS-OUTING1 | Full add-on list, local outing | Private Testour and Dougga tour - Explore the Andalusian town and Roman city with a local guide. - €74 per booking on Lodgify | |
| STAY-BREAKFAST-HEAD | Breakfast block heading | What breakfast looks like | |
| STAY-BREAKFAST-BODY | Breakfast block body — rewritten to address a guest question about why breakfast seemed repetitive; now makes clear it varies day to day | No two mornings taste quite the same. Breakfast is set fresh each day from what the farm and local producers have on hand - farm eggs, olive oil pressed from trees you can see from your window, homemade yogurt, Tunisian flatbreads, seasonal fruit and juice among them. The table changes with the season. That's the point. | |
| STAY-BREAKFAST-WA | WhatsApp button under the breakfast text, for guests who have meal questions | Let's Connect | |
| STAY-CABIN-LABEL | Olive Cabin block, small label | COMING SOON | |
| STAY-CABIN-HEAD | Olive Cabin block heading | The Olive Cabin | |
| STAY-CABIN-BODY | Olive Cabin block body | A standalone cabin being built among the olive trees. Private. Quiet. Its own outdoor kitchen. Its own sky. Join the list to be first to know. | |
| STAY-CABIN-CTA | Olive Cabin block button | Notify me when it's ready | |
| STAY-NEARBY-HEAD | Nearby block heading | Nearby - beyond the farm | |
| STAY-NEARBY-01 | Nearby item | Testour town - 15 min · Pomegranates, Andalusian heritage, local market | |
| STAY-NEARBY-02 | Nearby item | Dougga - 20-40 min · UNESCO Roman city, one of North Africa's best preserved | |
| STAY-NEARBY-03 | Nearby item | River - nearby · Swimming and walking | |
| STAY-NEARBY-04 | Nearby item | Tunis - 1 hour · Day trips possible | |

*(Stay page also includes the shared Booking Confidence, Getting Here, Policy Block, and FAQ Block sections — see "Shared sections" below.)*

---

## Farm page

| ID | Notes / where it appears | Current Copy | New Copy |
|---|---|---|---|
| FARM-HERO-HEAD | Hero headline | This is a farm in progress. | |
| FARM-BLOCK1-TITLE | Story block 1 title | Four years ago, Mahdi made a decision. | |
| FARM-BLOCK1-BODY | Story block 1 body | His family had farmed this land for generations - 40 acres of monoculture olives, managed the conventional way. Four years ago, Mahdi began the transition. To permaculture. To biodiversity. To a farm that works with nature instead of against it. It is not finished. It may never be finished. That is the point. | |
| FARM-BLOCK2-TITLE | Story block 2 title | The land and what it grows. | |
| FARM-BLOCK2-BODY | Story block 2 body | Olives, pressed into oil guests take home in bottles. Pomegranates picked in autumn and juiced by hand. Almonds, figs, peaches, plums. A greenhouse for year-round growing. Vegetables pulled from the ground hours before your plate. Beehives among the trees, tended through the seasons. | |
| FARM-BLOCK3-TITLE | Story block 3 title | The animals roam freely. | |
| FARM-BLOCK3-BODY | Story block 3 body | A horse. A donkey. Sheep. Chickens and ducks. A peacock who answers to no one. Two Malinois dogs who make the nights feel safe. During the day, all of them go wherever they please. You will find them in unexpected places. That is normal here. | |
| FARM-MAHDI-QUOTE | Mahdi pull-quote | I enjoy movement, music, building with my hands, meditating, and hosting the world on my land. | |
| FARM-MAHDI-ATTR | Mahdi quote attribution | Mahdi, Farm El Baya | |
| FARM-MAHDI-BODY | Mahdi bio paragraph | Mahdi is a calisthenics coach, yoga teacher, builder, beekeeper, farmer, and host. He keeps adding to the farm with the patience of someone who knows living things do not respond to deadlines. | |
| FARM-MAP-HEAD | Farm map section heading | Explore the land | |
| FARM-MAP-QUOTE | Farm map section quote (same as `HOME-QUOTE`, shared) | Get lost on purpose. The best places aren't always on the map. | |
| FARM-MAP-EXPAND | Map viewer control label | View full map | |
| FARM-MAP-CLOSE | Map viewer control label | Close map | |
| FARM-MAP-DOWNLOAD | Map viewer control label | Download | |

---

## Experiences page

| ID | Notes / where it appears | Current Copy | New Copy |
|---|---|---|---|
| EXP-HERO-HEAD | Hero headline | There is always something to do. And always permission to do nothing. | |
| EXP-CHOOSE-EYEBROW | "Choose your pace" block, eyebrow | Included and available | |
| EXP-CHOOSE-HEAD | "Choose your pace" block, heading | Choose your pace. | |
| EXP-CHOOSE-BODY | "Choose your pace" block, body | Some experiences are included with every stay. Others are seasonal or arranged on request with Mahdi. | |
| EXP-ITEM01-TITLE | Experience item 1 title | Access to 40 Acres | |
| EXP-ITEM01-BODY | Experience item 1 description (tag: Included) | Walk the trails. Sit under the olive trees. Watch the animals. The land is yours to explore. | |
| EXP-ITEM02-TITLE | Experience item 2 title — renamed from "Mouvement Research" | The Movement Area | |
| EXP-ITEM02-BODY | Experience item 2 description (tag: Included) | An indoor and outdoor space for yoga, calisthenics, and movement - bars, rings, and open ground for a farm gym session, a run, or parkour. | |
| EXP-ITEM04-TITLE | Experience item — Kids Playground Area removed (farm has no playground); items renumbered | Rooftop Stargazing | |
| EXP-ITEM04-BODY | Experience item description (tag: Included) | One of the farm's best-kept secrets. The rooftop at night, far from city light. | |
| EXP-ITEM05-TITLE | Experience item title | Training Session with Mahdi | |
| EXP-ITEM05-BODY | Experience item description (tag: 70 DT / person) — clarified that assessment + training + plan all happen inside the single 90-minute session | A single 90-minute session with Mahdi - assessment, training, and a plan to take home, all in one sitting. | |
| EXP-ITEM06-TITLE | Experience item 6 title | Beekeeping Session | |
| EXP-ITEM06-BODY | Experience item 6 description (tag: 40 DT / person) | Suit up and visit the hives with Mahdi. Learn how the bees live and how the honey is made. | |
| EXP-ITEM07-TITLE | Experience item 7 title | Olive Harvest | |
| EXP-ITEM07-BODY | Experience item 7 description (tag: 50 DT / person · Autumn) | October to December - join the harvest and press your own oil. Olive oil priced separately by size and quality. | |
| EXP-ITEM08-TITLE | Experience item 8 title | Outdoor Kitchen Session | |
| EXP-ITEM08-BODY | Experience item 8 description (tag: 70 DT / person) | Cook and bake with the family around the open-air kitchen. Fire, food, conversation - the shared meal is included. | |
| EXP-ITEM09-TITLE | Experience item 9 title | Guided Tour - Testour or Dougga | |
| EXP-ITEM09-BODY | Experience item 9 description (tag: From 50 DT / person) | A professional guide takes you through Testour's Andalusian medina or the Roman city of Dougga, with an olive-oil tasting and a visit to an organic olive mill. | |
| EXP-ITEM10-TITLE | Experience item 10 title | Farm Breakfast | |
| EXP-ITEM10-BODY | Experience item 10 description (tag: 20 DT / person) | A farm breakfast set fresh each morning. Eggs, oil, yogurt, fruit, bread, juice. | |
| EXP-ITEM11-TITLE | Experience item 11 title | Animal Care | |
| EXP-ITEM11-BODY | Experience item 11 description (tag: Included) | Feed the chickens. Walk with the donkey. Spend time with the horse. The animals are daily life here. | |
| EXP-ITEM12-TITLE | Experience item 12 title | Pomegranate & Fruit Harvest | |
| EXP-ITEM12-BODY | Experience item 12 description (tag: Seasonal) | Pomegranates, figs, almonds - depending on the season, there is always something to pick. | |
| EXP-EVENTS-EYEBROW | Events block, eyebrow | Culture & events nearby | |
| EXP-EVENTS-HEAD | Events block, heading | When to come. | |
| EXP-EVENTS-SUB | Events block, subhead | Time your stay around the region's festivals and Roman heritage - all within a short drive. | |
| EXP-EVENT01-TITLE | Event 1 title | Dougga Festival | |
| EXP-EVENT01-BODY | Event 1 description (timing: July) | Classical theatre and music in the Roman amphitheatre at Dougga, a UNESCO World Heritage site nearby. | |
| EXP-EVENT02-TITLE | Event 2 title | Testour Pomegranate Festival | |
| EXP-EVENT02-BODY | Event 2 description (timing: Late October) | The town's famous autumn celebration of its pomegranate harvest, 15 minutes away. | |
| EXP-EVENT03-TITLE | Event 3 title | Jazz Festival | |
| EXP-EVENT03-BODY | Event 3 description (timing: Late April) | Live jazz in the region each spring. | |
| EXP-EVENT04-TITLE | Event 4 title | Roman Dougga | |
| EXP-EVENT04-BODY | Event 4 description (timing: Year-round) | One of North Africa's best-preserved Roman cities - temples, theatre, and mosaics, 20-40 minutes away. | |
| EXP-EVENT05-TITLE | Event 5 title | Testour Medina | |
| EXP-EVENT05-BODY | Event 5 description (timing: Year-round) | Andalusian heritage, a historic mosque, and a weekly market, 15 minutes away. | |

Note: Experiences page also shows the **full version** of the Movement & Family section (`HOME-MOVE-*` rows above, plus the family paragraph and cards below) and the shared Booking Confidence section.

| ID | Notes / where it appears | Current Copy | New Copy |
|---|---|---|---|
| EXP-MOVE-FAMILY | Movement & Family section, family paragraph (full version only — hidden on homepage) — playground reference removed, farm has no playground | Families are welcome too. Children have open farm space to roam and animals to meet, so slow days are easier for parents and more alive for kids. | |
| EXP-MOVE-CARD1-TITLE | Movement & Family card 1 title — renamed from "Mouvement Research" | The Movement Area | |
| EXP-MOVE-CARD1-BODY | Movement & Family card 1 body | Yoga, calisthenics, and a farm gym for strength, balance, mobility, rings, and bodyweight practice. | |
| EXP-MOVE-CARD2-TITLE | Movement & Family card 2 title | Open-air practice | |
| EXP-MOVE-CARD2-BODY | Movement & Family card 2 body | Move under the trees, practice handstands, or join simple morning movement when Mahdi is available. | |

---

## Forge page

| ID | Notes / where it appears | Current Copy | New Copy |
|---|---|---|---|
| FORGE-HERO-LABEL | Hero small label | FARM EL BAYA · TESTOUR · SUMMER 2026 | |
| FORGE-HERO-HEAD | Hero headline (renders on two lines) | Where men are forged,\nin the earth. | |
| FORGE-HERO-BODY | Hero body | A seven-day retreat for men who are done coasting. Physical work. Cold mornings. Real food. Honest conversation. No wifi dependency. No performance. Just the work of becoming who you already know you should be. | |
| FORGE-HERO-CTA | Hero button | Apply for early access → | |
| FORGE-STAT1 | Stat | 15 men max | |
| FORGE-STAT2 | Stat | 7 days | |
| FORGE-STAT3 | Stat | 1 hour from Tunis | |
| FORGE-WEEK1-LABEL | "The week" item 1 label | 01 · ARRIVAL | |
| FORGE-WEEK1-BODY | "The week" item 1 body | Transition from the city to the site. Setting the intention. The first fire. | |
| FORGE-WEEK2-LABEL | "The week" item 2 label | 02 · THE BODY | |
| FORGE-WEEK2-BODY | "The week" item 2 body | Days 2 & 3. Physical testing. Calisthenics, breathwork, cold exposure. Finding your edge. | |
| FORGE-WEEK3-LABEL | "The week" item 3 label | 03 · THE LAND | |
| FORGE-WEEK3-BODY | "The week" item 3 body | Days 4 & 5. Working with the soil. Beekeeping. Harvesting. Building. The farm as teacher. | |
| FORGE-WEEK4-LABEL | "The week" item 4 label | 04 · INNER WORK | |
| FORGE-WEEK4-BODY | "The week" item 4 body | Confronting the internal silence. Honest dialogue. Meditation. The transition back to self-governance. | |
| FORGE-WEEK5-LABEL | "The week" item 5 label | 05 · DEPARTURE | |
| FORGE-WEEK5-BODY | "The week" item 5 body | Closing the circle. Integration. Return to the world with a new baseline. | |
| FORGE-NOTFOR | "Not for everyone" statement (4 lines, one block) | For men who feel the gap between who they are and who they could be.\nFor those who seek discomfort as a teacher.\nFor honest conversation without social performance.\nWarning: this is not a spa weekend. | |
| FORGE-INCLUDED | "Included" list (4 items, one line each) | Accommodation · Organic food · All sessions · Facilitation | |
| FORGE-FAQ1-Q | FAQ question 1 | Who is this for? | |
| FORGE-FAQ1-A | FAQ answer 1 | Men ready to work physically, speak honestly, and spend a week close to the land. | |
| FORGE-FAQ2-Q | FAQ question 2 | Do I need to be very fit? | |
| FORGE-FAQ2-A | FAQ answer 2 | No. You need willingness, not performance. Sessions scale to the person. | |
| FORGE-FAQ3-Q | FAQ question 3 | Is there internet? | |
| FORGE-FAQ3-A | FAQ answer 3 | There is signal when needed. The retreat is designed to reduce dependency. | |
| FORGE-FAQ4-Q | FAQ question 4 | How do applications work? | |
| FORGE-FAQ4-A | FAQ answer 4 | Send your email. Mahdi reviews each application individually. You will hear back within 48 hours. | |
| FORGE-WAITLIST-HEAD | Waitlist section heading | 15 spots. Applications reviewed individually. Not everyone is accepted. | |
| FORGE-WAITLIST-NOTE | Note below the waitlist form | You will hear back within 48 hours. | |
| FORGE-WAITLIST-BACK | Back-link at bottom | ← Back to Farm El Baya | |

---

## Book page

| ID | Notes / where it appears | Current Copy | New Copy |
|---|---|---|---|
| BOOK-HERO-HEAD | Hero headline | Book your farm stay. | |
| BOOK-HERO-SUB | Hero subheadline | There is one private room on the farm - the Baya Room. Choose how you'd like to book, then check availability and confirm your dates. | |
| BOOK-HERO-URGENCY | Hero urgency line | Weekends, harvest dates, and small groups confirm fastest. | |
| BOOK-HERO-CTA | Hero button, jumps down to the booking-method chooser with International pre-selected | See live availability | |
| BOOK-FACTS-01 | Quick-facts strip, item 1 | From 180 DT / night | |
| BOOK-FACTS-02 | Quick-facts strip, item 2 | 20 DT add-on | |
| BOOK-FACTS-03 | Quick-facts strip, item 3 | 30% deposit | |
| BOOK-FACTS-04 | Quick-facts strip, item 4 | Baya Room · the only room | |
| BOOK-FACTS-05 | Quick-facts strip, item 5 | Testour, 1h from Tunis | |
| BOOK-WAY-HEAD | "Book your way" intro heading | Book your way | |
| BOOK-WAY-BODY | "Book your way" intro body | Choose your booking method to see the right calendar and payment flow. | |
| BOOK-CHOOSER-LABEL | Booking mode chooser label | Choose your booking method | |
| BOOK-OPT1-TITLE | Booking option 1 title | International | |
| BOOK-OPT1-SUB | Booking option 1 subtitle | Pay online | |
| BOOK-OPT2-TITLE | Booking option 2 title | Tunisia | |
| BOOK-OPT2-SUB | Booking option 2 subtitle | Pay locally | |
| BOOK-INTL-EYEBROW | International path, eyebrow | International booking | |
| BOOK-INTL-HEAD | International path, heading | Choose your dates and book online. | |
| BOOK-INTL-INTRO | International path, intro | The calendar shows live availability and your total price. Continue through Lodgify to secure the booking with PayPal. | |
| BOOK-INTL-CALLABEL | International path, calendar label | Lodgify live availability | |
| BOOK-INTL-NOTETITLE | International path, note title | Secure online confirmation | |
| BOOK-INTL-NOTEBODY | International path, note text | The 30% deposit is paid through PayPal. Your remaining balance is settled on arrival. | |
| BOOK-INTL-QUESTION | International path, question line | Want to ask about meals, experiences, or getting here before you book? | |
| BOOK-INTL-LINK | International path, WhatsApp link | Ask Mahdi on WhatsApp | |
| BOOK-TN-EYEBROW | Tunisia path, eyebrow | Booking from Tunisia | |
| BOOK-TN-HEAD | Tunisia path, heading | Check the dates. Confirm directly with Mahdi. | |
| BOOK-TN-INTRO | Tunisia path, intro | Choose available dates below, then send the completed request on WhatsApp to arrange the deposit by Tunisian bank transfer. | |

**Lodgify booking widget (embedded third-party widget UI labels):**

| ID | Notes | Current Copy | New Copy |
|---|---|---|---|
| BOOK-LODGIFY-CHECKIN | | Check-in | |
| BOOK-LODGIFY-CHECKOUT | | Check-out | |
| BOOK-LODGIFY-GUESTS | Top-level guests field label | Guests | |
| BOOK-LODGIFY-TOTAL | | Total price: | |
| BOOK-LODGIFY-SELECTDATES | | Select dates to see total price | |
| BOOK-LODGIFY-FROM | | From | |
| BOOK-LODGIFY-PERNIGHT | | per night | |
| BOOK-LODGIFY-BOOKNOW | | Book now | |
| BOOK-LODGIFY-DONE | Closes the guest-breakdown panel below | Done | |
| BOOK-LODGIFY-GUESTSINGULAR | Guest count display when exactly 1 guest is selected ({{NumberOfGuests}} is filled in by the widget, don't remove) | {{NumberOfGuests}} guest | |
| BOOK-LODGIFY-GUESTPLURAL | Guest count display for 2+ guests | {{NumberOfGuests}} guests | |
| BOOK-LODGIFY-GUESTBREAKDOWN | Heading inside the guest-breakdown panel (adults/children/infants/pets counters) | Guests | |
| BOOK-LODGIFY-ADULTS | Adult counter row label, singular/plural pair | {"one":"adult","other":"adults"} | |
| BOOK-LODGIFY-ADULTSDESC | Adult counter row helper text ({minAge} filled in by the widget) | Ages {minAge} or above | |
| BOOK-LODGIFY-CHILDREN | Child counter row label, singular/plural pair | {"one":"child","other":"children"} | |
| BOOK-LODGIFY-CHILDRENDESC | Child counter row helper text ({minAge}/{maxAge} filled in by the widget) | Ages {minAge}-{maxAge} | |
| BOOK-LODGIFY-CHILDRENNO | Shown instead of the child counter if the listing doesn't accept children | Not suitable for children | |
| BOOK-LODGIFY-INFANTS | Infant counter row label, singular/plural pair | {"one":"infant","other":"infants"} | |
| BOOK-LODGIFY-INFANTSDESC | Infant counter row helper text ({maxAge} filled in by the widget) | Under {maxAge} | |
| BOOK-LODGIFY-INFANTSNO | Shown instead of the infant counter if the listing doesn't accept infants | Not suitable for infants | |
| BOOK-LODGIFY-PETS | Pet counter row label, singular/plural pair | {"one":"pet","other":"pets"} | |
| BOOK-LODGIFY-PETSNO | Shown instead of the pet counter — pets aren't currently allowed | Not allowed | |

Note: the widget's `adults`/`children`/`infants`/`pets` rows use Lodgify's own `{"one":"...","other":"..."}` pluralization format — edit the words inside the quotes, but keep that JSON-like structure intact or the widget will render it literally.

*(Book page also includes the shared Policy Block, Getting Here, and FAQ Block sections — see below.)*

---

## Guides section (/guides)

Three long-form travel guides (Dougga, Testour, olive harvest) built to attract search traffic for informational queries ("where to stay near Dougga", "Testour travel guide", "olive harvest Tunisia"). Each guide has its own hero image, quick facts, a lead paragraph, several sections, and a booking CTA, plus links to the other two guides at the bottom. Same structure exists in French — French rows aren't listed here per this doc's English-only scope (see note at top).

### Guides index page

| ID | Notes / where it appears | Current Copy | New Copy |
|---|---|---|---|
| GUIDES-INDEX-HEAD | Hero headline | Guides to the valley. | |
| GUIDES-INDEX-SUB | Hero subheadline | Where we send our guests: the Roman city up the road, the Andalusian town down the hill, and the season that shapes the farm's whole year. | |
| GUIDES-INDEX-LABEL | Small eyebrow label above the hero headline (shared: also used as the breadcrumb link text on every guide article) | Guides | |
| GUIDES-READMORE | "Read the guide" link on each card (shared across index cards and related-guide links) | Read the guide | |
| GUIDES-INDEX-CTA-HEAD | Bottom CTA heading | Stay in the middle of it all. | |
| GUIDES-INDEX-CTA-BODY | Bottom CTA body | One private room on a working farm, an hour from Tunis - and fifteen minutes from everything in these guides. | |
| GUIDES-INDEX-CTA-BTN | Bottom CTA button (shared: same button reused at the end of every guide article) | Check availability | |
| GUIDES-BREADCRUMB-HOME | Breadcrumb link text, appears on every guide article ("Home / Guides") | Home | |
| GUIDES-RELATED-HEAD | "Keep exploring" heading above the related-guides links at the bottom of every article | Keep exploring | |

**Guide preview cards (index page)** — each card shows the guide's tag, hero line, and teaser. These are the same strings as `GUIDES-DOUGGA-TAG` / `-HERO` / `-TEASER` etc. below (and reused again as the "Keep exploring" related-guide cards on the other two articles) — edit once here, or in the guide's own table below; don't duplicate.

### Dougga guide (/guides/dougga)

| ID | Notes / where it appears | Current Copy | New Copy |
|---|---|---|---|
| GUIDES-DOUGGA-TAG | Small tag/pill shown on preview cards and the article | UNESCO World Heritage · 20-40 min from the farm | |
| GUIDES-DOUGGA-HERO | Article H1 / preview card title | Dougga: a Roman city, almost to yourself. | |
| GUIDES-DOUGGA-TEASER | Preview-card teaser text (index page + related-guide cards) | North Africa's best-preserved Roman town sits on a quiet hillside half an hour from the farm. Here is how to visit it well. | |
| GUIDES-DOUGGA-FACT1 | Quick-facts strip, item 1 (label: Distance) | 20-40 min from the farm | |
| GUIDES-DOUGGA-FACT2 | Quick-facts strip, item 2 (label: Status) | UNESCO World Heritage site | |
| GUIDES-DOUGGA-FACT3 | Quick-facts strip, item 3 (label: Time needed) | 2-3 hours on site | |
| GUIDES-DOUGGA-FACT4 | Quick-facts strip, item 4 (label: Best seasons) | Spring and autumn | |
| GUIDES-DOUGGA-LEAD | Opening/lead paragraph, styled larger than body text | Dougga is widely described as the best-preserved Roman small town in North Africa - a UNESCO World Heritage site draped across a hillside of wheat fields and olive groves in Tunisia's Medjerda valley. It is 20 to 40 minutes by car from Farm El Baya, which makes the farm one of the closest places to spend the night near the site. This guide covers what to see, when to go, and how to turn the visit into a slow weekend rather than a rushed day trip from Tunis. | |
| GUIDES-DOUGGA-SEC1-HEAD | Section 1 heading | Why Dougga is worth the trip | |
| GUIDES-DOUGGA-SEC1-P1 | Section 1, paragraph 1 | Most visitors meet Roman Tunisia at Carthage, where the ruins share space with a modern suburb. Dougga is the opposite: an entire ancient town - streets, temples, houses, baths - left largely intact on its original hillside, with wheat fields below and almost no crowds. UNESCO listed it in 1997 as the best-preserved example of a small Roman town in North Africa. | |
| GUIDES-DOUGGA-SEC1-P2 | Section 1, paragraph 2 | The city is older than Rome's arrival. It began as Thugga, a Numidian settlement, and that layered history is still legible in the stones - most visibly in the Libyco-Punic mausoleum, one of the very few pre-Roman monuments of its kind still standing anywhere. | |
| GUIDES-DOUGGA-SEC2-HEAD | Section 2 heading | What to see on site | |
| GUIDES-DOUGGA-SEC2-P1 | Section 2, paragraph 1 | The capitol is the postcard: a temple dedicated to Jupiter, Juno, and Minerva, raised in the second century AD, its portico still standing proud against the valley. A short walk away, the theatre - built around 168 AD with seating for some 3,500 spectators - remains complete enough that it still hosts performances during the Dougga Festival each July. | |
| GUIDES-DOUGGA-SEC2-P2 | Section 2, paragraph 2 | Give yourself time beyond the two landmarks. The paved Roman streets lead past the market square, the baths, private houses, and the temple of Juno Caelestis with its crescent-shaped precinct. Many of Dougga's famous mosaics now hang in the Bardo Museum in Tunis, but here the town itself is the exhibit. | |
| GUIDES-DOUGGA-SEC3-HEAD | Section 3 heading | When to go and what to bring | |
| GUIDES-DOUGGA-SEC3-P1 | Section 3, paragraph 1 | Spring and autumn are the sweet spots: green hills and wildflowers from March to May, soft light and harvest colours in October and November. In summer, aim for early morning or the last hours of the day - the site is exposed and shade is scarce. | |
| GUIDES-DOUGGA-SEC3-P2 | Section 3, paragraph 2 | The grounds are large and the ancient paving is uneven, so wear proper shoes and bring water and a hat. Facilities on site are minimal - part of the charm, but plan for it. Two to three hours covers the main circuit at an unhurried pace. | |
| GUIDES-DOUGGA-SEC4-HEAD | Section 4 heading | Getting there from Farm El Baya | |
| GUIDES-DOUGGA-SEC4-P1 | Section 4, paragraph 1 | The drive from the farm takes 20 to 40 minutes on countryside roads, passing near Teboursouk. If you would rather not navigate, Mahdi arranges a guided tour from the farm (from 50 DT per person) with a professional guide - including an olive-oil tasting and a visit to an organic olive mill along the way. | |
| GUIDES-DOUGGA-SEC4-P2 | Section 4, paragraph 2 | Dougga pairs naturally with Testour, the Andalusian town fifteen minutes from the farm, for a full day of history in the Medjerda valley. | |
| GUIDES-DOUGGA-SEC5-HEAD | Section 5 heading | Where to stay near Dougga | |
| GUIDES-DOUGGA-SEC5-P1 | Section 5, paragraph 1 | There are no hotels at the site itself, and most visitors see it in a hurry from Tunis. Staying nearby changes the visit completely. Farm El Baya is a working permaculture farm about half an hour away, with one private room - the Baya Room, from 180 DT per night - farm breakfast in the morning, and rooftop stargazing under the same dark countryside sky the Romans knew. | |
| GUIDES-DOUGGA-CTA-HEAD | Bottom CTA heading | Make it a slow weekend, not a day trip. | |
| GUIDES-DOUGGA-CTA-BODY | Bottom CTA body | Stay the night half an hour from the ruins - farm breakfast before, stargazing after. | |

### Testour guide (/guides/testour)

| ID | Notes / where it appears | Current Copy | New Copy |
|---|---|---|---|
| GUIDES-TESTOUR-TAG | Small tag/pill shown on preview cards and the article | Andalusian heritage · 15 min from the farm | |
| GUIDES-TESTOUR-HERO | Article H1 / preview card title | Testour: Andalusia, fifteen minutes away. | |
| GUIDES-TESTOUR-TEASER | Preview-card teaser text | A town built by exiles from Spain four centuries ago, with a mosque clock that runs backwards and a festival for its pomegranates. | |
| GUIDES-TESTOUR-FACT1 | Quick-facts strip, item 1 (label: Distance) | 15 min from the farm | |
| GUIDES-TESTOUR-FACT2 | Quick-facts strip, item 2 (label: Founded) | Early 1600s, by Andalusian exiles | |
| GUIDES-TESTOUR-FACT3 | Quick-facts strip, item 3 (label: Famous for) | Backwards clock · pomegranates · malouf | |
| GUIDES-TESTOUR-FACT4 | Quick-facts strip, item 4 (label: Best time) | Autumn festivals, or any market day | |
| GUIDES-TESTOUR-LEAD | Opening/lead paragraph | Fifteen minutes from Farm El Baya, in the Medjerda river valley, Testour is one of the most unusual towns in Tunisia. It was built in the early 1600s by Andalusian Muslims expelled from Spain, and four centuries later that heritage still lives in its architecture, its music, and its festivals. This guide covers what to see, when the festivals happen, and how to fold Testour into a farm stay. | |
| GUIDES-TESTOUR-SEC1-HEAD | Section 1 heading | A piece of Andalusia in the Medjerda valley | |
| GUIDES-TESTOUR-SEC1-P1 | Section 1, paragraph 1 | When Spain expelled its last Muslim communities after 1609, thousands of families crossed the Mediterranean and rebuilt their lives in northern Tunisia. Testour is their most complete creation: a town laid out on Andalusian lines, with tiled roofs, arched doorways, and brick minarets that would not look out of place in southern Spain. | |
| GUIDES-TESTOUR-SEC1-P2 | Section 1, paragraph 2 | It is still a living country town rather than a museum - which is exactly why it rewards a slow visit. Wander the main street, look up at the rooflines, and glance into the courtyards when a door stands open. | |
| GUIDES-TESTOUR-SEC2-HEAD | Section 2 heading | The Great Mosque and its backwards clock | |
| GUIDES-TESTOUR-SEC2-P1 | Section 2, paragraph 1 | Testour's landmark is its Great Mosque, built in the seventeenth century by the Andalusian settlers - look for the Stars of David worked into the minaret's tiles, a nod to the Jewish community that helped build the town. Then look closely at the clock: its face runs counter-clockwise, one of the very few clocks in the world that run backwards. Nobody is entirely sure why - the theories range from nostalgia for a lost homeland to a craftsman's signature - and after decades stopped, it was restored to working order in 2014 by a descendant of the town's Andalusian families. | |
| GUIDES-TESTOUR-SEC3-HEAD | Section 3 heading | Pomegranates, markets, and malouf | |
| GUIDES-TESTOUR-SEC3-P1 | Section 3, paragraph 1 | Testour's pomegranates are famous across Tunisia, and the town celebrates them with a festival in late October when the harvest comes in. Each July, Testour hosts its International Festival of Malouf - the Andalusian classical music the exiles carried with them, and Tunisia's oldest festival devoted to it - filling summer evenings with music. | |
| GUIDES-TESTOUR-SEC3-P2 | Section 3, paragraph 2 | The weekly market is the best way to see the town at work. For a meal out, Le Malouf in Testour is a good address, and Les Vergers des Montagnes, fifteen minutes away, is worth reserving a day ahead. | |
| GUIDES-TESTOUR-SEC4-HEAD | Section 4 heading | Make it a half-day from the farm | |
| GUIDES-TESTOUR-SEC4-P1 | Section 4, paragraph 1 | Testour is the easiest outing from Farm El Baya - fifteen minutes by car, or the first stop on a guided day that continues to the Roman city of Dougga. Mahdi arranges tours with a professional guide from 50 DT per person, including an olive-oil tasting and a visit to an organic olive mill. The small grocery shops in town also make Testour the practical stop if you plan to cook in the farm's two kitchens. | |
| GUIDES-TESTOUR-SEC5-HEAD | Section 5 heading | Where to stay near Testour | |
| GUIDES-TESTOUR-SEC5-P1 | Section 5, paragraph 1 | Farm El Baya sits in the countryside at Slouguia, fifteen minutes from town - a working permaculture farm with a single private room, the Baya Room, from 180 DT per night, with farm breakfast available each morning. Time your stay to the pomegranate festival and you can pick fruit on the farm the same weekend. | |
| GUIDES-TESTOUR-CTA-HEAD | Bottom CTA heading | Festivals in town, quiet on the farm. | |
| GUIDES-TESTOUR-CTA-BODY | Bottom CTA body | Stay fifteen minutes from Testour - close for the market mornings, far from the noise at night. | |

### Olive harvest guide (/guides/olive-harvest)

| ID | Notes / where it appears | Current Copy | New Copy |
|---|---|---|---|
| GUIDES-HARVEST-TAG | Small tag/pill shown on preview cards and the article | October - December · 50 DT / person | |
| GUIDES-HARVEST-HERO | Article H1 / preview card title | Join the olive harvest. | |
| GUIDES-HARVEST-TEASER | Preview-card teaser text | From October to December the farm's groves come alive. Pick with the family, press your own oil, and taste it at breakfast. | |
| GUIDES-HARVEST-FACT1 | Quick-facts strip, item 1 (label: Season) | October to December | |
| GUIDES-HARVEST-FACT2 | Quick-facts strip, item 2 (label: Price) | 50 DT / person | |
| GUIDES-HARVEST-FACT3 | Quick-facts strip, item 3 (label: The groves) | 40 acres in permaculture transition | |
| GUIDES-HARVEST-FACT4 | Quick-facts strip, item 4 (label: Take home) | Your own bottled oil | |
| GUIDES-HARVEST-LEAD | Opening/lead paragraph | Tunisia is one of the largest olive-oil producers on earth, and from October to December the whole north of the country turns to the harvest. At Farm El Baya, a 40-acre permaculture farm near Testour, guests can join it - picking alongside the family, following the fruit to an organic mill, and tasting oil pressed from trees you can see from the room's windows. The harvest experience costs 50 DT per person. | |
| GUIDES-HARVEST-SEC1-HEAD | Section 1 heading | Why Tunisia is an olive country | |
| GUIDES-HARVEST-SEC1-P1 | Section 1, paragraph 1 — fact checked against the International Olive Council's 2025/26 season figures | Olive trees have been cultivated in this valley since Carthaginian and Roman times - the ruins at nearby Dougga were built on wheat and olive wealth. In the 2025/26 season, Tunisia became the world's second-largest olive-oil producer behind Spain, according to the International Olive Council - and the north, around the Medjerda valley, is some of its most fertile ground. | |
| GUIDES-HARVEST-SEC1-P2 | Section 1, paragraph 2 | Farm El Baya's groves are part of that story, with a twist: four years ago the family began converting 40 acres of conventional monoculture olives to permaculture - working with the land instead of against it. The harvest is the moment the whole year points toward. | |
| GUIDES-HARVEST-SEC2-HEAD | Section 2 heading | What a harvest day looks like | |
| GUIDES-HARVEST-SEC2-P1 | Section 2, paragraph 1 | The work is done by hand and by comb: nets spread beneath the trees, olives raked from the branches, sorted and sacked. It is genuinely physical, genuinely satisfying work - the kind you fall into a rhythm with after twenty minutes. Guests join for as much or as little as they like. | |
| GUIDES-HARVEST-SEC2-P2 | Section 2, paragraph 2 | The olives then travel to an organic mill nearby to be pressed. Fresh oil, days old, tastes nothing like supermarket oil - green, peppery, alive. Guests take their own bottles home; the oil is priced separately by size and quality. | |
| GUIDES-HARVEST-SEC3-HEAD | Section 3 heading | Taste it at the source | |
| GUIDES-HARVEST-SEC3-P1 | Section 3, paragraph 1 | During harvest season, breakfast on the farm (20 DT) comes with the year's new oil - over farm eggs, flatbread, and whatever the garden gives that morning. To go deeper, the guided tour toward Testour and Dougga includes an olive-oil tasting. | |
| GUIDES-HARVEST-SEC4-HEAD | Section 4 heading | When to come and what to bring | |
| GUIDES-HARVEST-SEC4-P1 | Section 4, paragraph 1 | The harvest runs October to December, and late October overlaps with Testour's pomegranate festival, fifteen minutes away - the farm's own pomegranates, figs, and almonds ripen in the same window. Bring clothes that can get dusty and closed shoes; the farm provides the rest. | |
| GUIDES-HARVEST-SEC4-P2 | Section 4, paragraph 2 | Autumn is also simply the farm's best light: warm days, cool nights, and clear skies for stargazing from the rooftop. | |
| GUIDES-HARVEST-SEC5-HEAD | Section 5 heading | Plan a harvest stay | |
| GUIDES-HARVEST-SEC5-P1 | Section 5, paragraph 1 | There is one room on the farm - the Baya Room, from 180 DT per night - so harvest weekends confirm fast. Book direct, mention that you want to join the harvest, and the family will plan your dates around the picking. | |
| GUIDES-HARVEST-CTA-HEAD | Bottom CTA heading | One room, one harvest, your oil. | |
| GUIDES-HARVEST-CTA-BODY | Bottom CTA body | Come in autumn, pick with the family, and take the year's oil home in a bottle. | |

**Photo credits (visible caption at the bottom of the article, not editable — required attribution for licensed third-party images).** The Dougga and Testour hero photos are sourced from Wikimedia Commons under Creative Commons licenses that require attribution. The olive-harvest photo is the farm's own and carries no credit line. Flag in New Copy only if you'd rather commission original photography to replace the two licensed images.

| ID | Guide | Current Copy |
|---|---|---|
| GUIDES-DOUGGA-CREDIT | Dougga | Photo: Mohamed Amine Abassi, CC BY 2.0, via Wikimedia Commons |
| GUIDES-TESTOUR-CREDIT | Testour | Photo: Bellyglad, CC BY 2.0, via Wikimedia Commons |

---

## Shared sections (appear on multiple pages)

### Getting Here — Stay, Book pages

| ID | Notes | Current Copy | New Copy |
|---|---|---|---|
| SHARED-HERE-EYEBROW | Eyebrow | Getting here | |
| SHARED-HERE-HEAD | Heading | Near Testour, one hour from Tunis. | |
| SHARED-HERE-BODY | Body | The farm is in Slouguia village, near Testour - take the Testour exit off the Béja highway. Exact directions are shared after your booking request, and free parking is available on site. | |
| SHARED-HERE-CTA | Button | Request availability | |
| SHARED-HERE-FACT1 | Fact card | Tunis — About 1 hour by car | |
| SHARED-HERE-FACT2 | Fact card | Testour — About 15 minutes away | |
| SHARED-HERE-FACT3 | Fact card | Parking — Free on site | |
| SHARED-HERE-FACT4 | Fact card | Arrival — Exact details sent after confirmation | |
| SHARED-HERE-MAPTOGGLE | Map toggle label | Show map | |

### Policy Block — Stay, Book pages

| ID | Notes | Current Copy | New Copy |
|---|---|---|---|
| SHARED-POLICY-EYEBROW | Eyebrow | Before you come | |
| SHARED-POLICY-HEAD | Heading | Simple stay policies. | |
| SHARED-POLICY-BODY | Body | The booking flow clearly explains how to confirm your dates and pay the deposit. | |
| SHARED-POLICY-01T | Policy 1 title | Check-in | |
| SHARED-POLICY-01B | Policy 1 body | From 2:00 PM. Earlier arrival is possible when the room is ready. | |
| SHARED-POLICY-02T | Policy 2 title | Check-out | |
| SHARED-POLICY-02B | Policy 2 body | By 11:00 AM, with flexibility when there is no same-day arrival. | |
| SHARED-POLICY-03T | Policy 3 title | Deposit | |
| SHARED-POLICY-03B | Policy 3 body | A 30% deposit confirms every booking, refundable if cancelled 7+ days before arrival. | |
| SHARED-POLICY-04T | Policy 4 title | Cancellation | |
| SHARED-POLICY-04B | Policy 4 body | Free cancellation up to 7 days before arrival when no special event or group booking applies. | |
| SHARED-POLICY-05T | Policy 5 title | Payment | |
| SHARED-POLICY-05B | Policy 5 body | International guests pay the deposit online with PayPal. Guests in Tunisia arrange a local bank transfer with Mahdi. The balance is settled on arrival. | |
| SHARED-POLICY-06T | Policy 6 title | Meals | |
| SHARED-POLICY-06B | Policy 6 body | Farm breakfast on request (20 DT). Lunch and dinner on request (40 DT each), confirmed before arrival. | |
| SHARED-POLICY-07T | Policy 7 title | Families | |
| SHARED-POLICY-07B | Policy 7 body — playground reference removed, farm has no playground | Families and children are welcome. The farm includes open outdoor space for kids to explore. Please mention children's ages in the booking notes. | |
| SHARED-POLICY-08T | Policy 8 title | Parking | |
| SHARED-POLICY-08B | Policy 8 body | Free on-site parking is available. A car is recommended for the easiest arrival. | |
| SHARED-POLICY-09T | Policy 9 title | Wi-Fi | |
| SHARED-POLICY-09B | Policy 9 body | Wi-Fi is available for basic use. This is a rural farm, so connection quality can vary. | |
| SHARED-POLICY-10T | Policy 10 title | Animals | |
| SHARED-POLICY-10B | Policy 10 body | The farm has free-roaming animals and working dogs. Please ask before bringing pets. | |

### FAQ Block ("Practical questions") — Stay, Book pages

| ID | Notes | Current Copy | New Copy |
|---|---|---|---|
| SHARED-FAQ-HEAD | Section heading | Practical questions | |
| SHARED-FAQ01-Q | Question 1 | What is included? | |
| SHARED-FAQ01-A | Answer 1 | A private room and bathroom with air conditioning, plus access to the farm's rooftop, trails, animals, and shared outdoor spaces. Farm breakfast (20 DT) and meals are available as add-ons. | |
| SHARED-FAQ02-Q | Question 2 | Can I request breakfast, lunch or dinner? | |
| SHARED-FAQ02-A | Answer 2 | Yes. Farm breakfast is 20 DT, and lunch and dinner are 40 DT each, per person - all on request and confirmed with your booking details. | |
| SHARED-FAQ03-Q | Question 3 | How do I get there? | |
| SHARED-FAQ03-A | Answer 3 | The farm is in Slouguia village, about one hour from Tunis - take the Testour exit off the Béja highway. Exact directions and a GPS link are shared after your booking request. | |
| SHARED-FAQ04-Q | Question 4 | How do I pay the deposit? | |
| SHARED-FAQ04-A | Answer 4 | International guests pay the 30% deposit through PayPal during Lodgify checkout. Guests in Tunisia confirm their dates with Mahdi on WhatsApp and receive local bank-transfer details. The balance is settled on arrival. | |
| SHARED-FAQ05-Q | Question 5 | Can we cook our own meals? | |
| SHARED-FAQ05-A | Answer 5 | Yes. You're welcome to use two kitchens on site - one indoor, one outdoor - if you'd rather cook than order. Small grocery shops are about 10 minutes away in Testour or Mjez El Beb. | |
| SHARED-FAQ06-Q | Question 6 | Is there Wi-Fi, air conditioning, or heating? | |
| SHARED-FAQ06-A | Answer 6 | The Baya Room has air conditioning and heating. Wi-Fi is available for basic use, though the connection can vary on a rural farm. | |
| SHARED-FAQ07-Q | Question 7 | Can we go horseback riding? | |
| SHARED-FAQ07-A | Answer 7 | There's a gentle horse on the farm. If you have riding experience, you're welcome to ride or walk with him - we don't currently offer a formal guided riding service. | |
| SHARED-FAQ08-Q | Question 8 | What's worth visiting nearby? | |
| SHARED-FAQ08-A | Answer 8 | The Roman site of Dougga is close by and well worth it, along with the towns of Testour and Teboursouk. Le Kef is about 1.5 hours away. For meals out, Les Vergers des Montagnes (15 minutes, reserve a day ahead) and Le Malouf in Testour are both good options. | |
| SHARED-FAQ09-Q | Question 9 | Can we check out later than 11:00 AM? | |
| SHARED-FAQ09-A | Answer 9 | Often, yes - especially for a late flight. Just let us know your travel plans and we'll do our best to work something out. | |

### Tunisia Availability Calendar — Book page

| ID | Notes | Current Copy | New Copy |
|---|---|---|---|
| SHARED-CAL-TITLE | Calendar title | Availability calendar | |
| SHARED-CAL-LOADING | Loading state | Checking available dates… | |
| SHARED-CAL-ERROR1 | Error state, line 1 | The calendar is temporarily unavailable. | |
| SHARED-CAL-ERROR2 | Error state, line 2 | Try again, or ask Mahdi to check your dates directly. | |
| SHARED-CAL-RETRY | Error state, button | Try again | |
| SHARED-CAL-ERRORWA | Error state, WhatsApp link | Ask Mahdi on WhatsApp | |
| SHARED-CAL-LEGEND1 | Legend | Available | |
| SHARED-CAL-LEGEND2 | Legend | Unavailable | |
| SHARED-CAL-LEGEND3 | Legend | Available for check-out only | |
| SHARED-CAL-LEGEND4 | Legend | Past date | |
| SHARED-CAL-LEGEND5 | Legend | Selected stay | |
| SHARED-CAL-CHECKIN | Field label | Check-in | |
| SHARED-CAL-CHECKOUT | Field label | Check-out | |
| SHARED-CAL-PROMPT1 | Helper prompt | Select a check-in date | |
| SHARED-CAL-PROMPT2 | Helper prompt | Now select your check-out date | |
| SHARED-CAL-FIRSTNAME | Field label | First name | |
| SHARED-CAL-FIRSTNAMEPH | Field placeholder | Your first name | |
| SHARED-CAL-GUESTS | Field label | Guests | |
| SHARED-CAL-GUEST1 | Guest dropdown, option 1 | 1 guest | |
| SHARED-CAL-GUEST2 | Guest dropdown, option 2 | 2 guests | |
| SHARED-CAL-GUEST3 | Guest dropdown, option 3 | 3 guests | |
| SHARED-CAL-SUBMIT | Submit button | Send selected dates on WhatsApp | |
| SHARED-CAL-VALID1 | Validation message | Select your check-in and check-out dates | |
| SHARED-CAL-VALID2 | Validation message | Enter your first name to continue | |
| SHARED-CAL-NOTE | Note | Availability may take a short time to synchronize. Mahdi confirms your dates before you transfer the deposit. | |
| SHARED-CAL-STEP1 | "What happens next" step 1 | Mahdi checks the dates and confirms the exact 30% deposit. | |
| SHARED-CAL-STEP2 | "What happens next" step 2 | You receive the policy and Tunisian bank details. | |
| SHARED-CAL-STEP3 | "What happens next" step 3 | The booking is added to Lodgify after the deposit is received. | |

---

## Navbar

| ID | Notes | Current Copy | New Copy |
|---|---|---|---|
| NAV-LINK-STAY | Nav link | Stay | |
| NAV-LINK-FARM | Nav link | The Farm | |
| NAV-LINK-EXP | Nav link | Experiences | |
| NAV-LINK-GUIDES | Nav link (desktop header + mobile menu; also appears as a footer link, hardcoded to match) | Guides | |
| NAV-LINK-BOOK | Nav link | Book | |
| NAV-LINK-FORGE | Nav link | Forge | |
| NAV-CTA-BOOK | Primary button (default) | Book now | |
| NAV-CTA-APPLY | Primary button (on Forge page only) | Apply → | |

## Footer

| ID | Notes | Current Copy | New Copy |
|---|---|---|---|
| FOOTER-TAGLINE | Tagline | A living farm in Testour, Tunisia. | |
| FOOTER-DIRECT | Direct-booking line | Book directly - no commissions, better rates. | |
| FOOTER-SOCIAL1 | Instagram handle shown | @farmelbaya | |
| FOOTER-SOCIAL2 | Instagram handle shown | @holistic.athlete | |
| FOOTER-LEGAL | Legal line | © Farm El Baya · farmelbaya.com | |

## 404 / Not Found page

| ID | Notes | Current Copy | New Copy |
|---|---|---|---|
| 404-EYEBROW | Eyebrow | 404 | |
| 404-HEAD | Heading | This page wandered off the trail. | |
| 404-SUBHEAD | ⚠️ NEEDS DECISION — this French line is shown inline even on the English 404 page. Decide: keep bilingual, translate, or remove. | Cette page s'est égarée. | |
| 404-BODY | Body text | The page you're looking for isn't here — but the farm still is. | |
| 404-LINK | Link | Return home · Retour | |

## Common / shared form strings (used in Forge waitlist form etc.)

| ID | Notes | Current Copy | New Copy |
|---|---|---|---|
| COMMON-EMAIL-PH | Email field placeholder | Your email address | |
| COMMON-NOTIFY | Post-submit button label | Notify me | |
| COMMON-BACK | Back link | ← Back to Farm El Baya | |
