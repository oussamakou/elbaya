# Farm El Baya shop

## Local preview

Run `npm install`, `npm run shop:setup`, then `npm run dev`.

- Catalogue: `/fr/products` and `/en/products`.
- Individual product pages: `/fr/products/pomegranates`, `/fr/products/olive-oil`, `/fr/products/honey` (also `/en/…`). New products automatically get a page at `/products/{id}`. Draft pages return 404 and are excluded from the sitemap.
- Owner dashboard: `/fr/admin` (French operator interface).
- The generated owner password is in `.shop/admin-access.txt`, which is excluded from Git. Save it in a password manager, then remove this text file.
- Products, orders, images and delivery settings persist in `.shop/shop.db` during development. This is real local storage, not browser-only sample data. The basket alone is stored in the customer's browser; addresses are not.
- To choose an owner password, provide `SHOP_SETUP_PASSWORD` securely in the environment before the first setup. Setup preserves existing credentials. Passwords must be 16–256 characters.

## Launch workflow for Mehdi

The site keeps room bookings as its main purpose. Farm products have a separate catalogue, product pages and request form. The homepage and farm story link to the shop; Guides stays in the footer and Forge redirects to the farm.

1. Open /fr/admin with the password saved privately in .shop/admin-access.txt. The same generated password hash and session secret are configured in Vercel Production.
2. Review product descriptions and formats. Upload real photos if available; the illustrations can remain until then.
3. Share /fr/products/reserve or /en/products/reserve. Customers provide first name, last name, Tunisian phone, governorate, city/locality, street address, optional email, product, size and quantity. No customer account is required.
4. Check the **Précommandes** admin tab for requests. Call the customer, agree on price, delivery fee and availability, then mark Contacté or Confirmée. A request is not a guaranteed inventory reservation; status changes here do not change stock. Email alerts require the Resend connection described below; there are no SMS notifications.
5. When prices, inventory and delivery areas are finalized, optionally open direct cash-on-delivery checkout using the steps below.

## Before accepting priced orders

1. Edit the three seeded seasonal products: pomegranates, olive oil and honey. Keep the illustrations or add actual photos to the gallery. Confirm descriptions, formats, prices and stock.
2. Each format has independent inventory measured in **packs**, not kilograms. A 3 kg format with stock 20 means twenty 3 kg packs. Stock should exclude packs committed elsewhere.
3. Enter prices in DT, including up to three decimals. Storage uses integer millimes, not floating-point currency.
4. Add only delivery areas the farm's own driver serves, and set the agreed fee for each.
5. Switch products to **En vente**, then enable **Accepter les commandes** in **Livraison & ouverture**.
6. Place a test order, confirm by phone, and verify the delivery workflow with Mehdi. Email alerts require the Resend connection below. There are no automatic phone calls, SMS or WhatsApp messages; the dashboard remains the source of truth.

The defaults intentionally contain **no invented prices or stock** and keep ordering paused. Products with status **Brouillon** are private; **Hors saison** is visible with a pre-order request link; a format with zero stock cannot be ordered.

## Priced pre-orders (optional direct checkout)

Choose **Précommandes ouvertes** on a product, enter its estimated availability message, set a price for every size, and enter **Colis à réserver** for each size. Open the shop's order switch and configure delivery areas as for ready orders.

- Reservation places are a separate counter from ready stock. A confirmed checkout reserves the requested packs atomically; no money or deposit is taken online.
- The customer sees the estimate, reservation terms and total before submitting. Availability is an estimate to confirm by phone, not a guaranteed harvest date.
- If any item is a pre-order, the entire basket ships together when all products are ready, with one delivery fee. This is stated at checkout.
- The order snapshots the pre-order label and availability message. Changing a product later does not rewrite existing orders. If the estimate changes before checkout, the customer must review the product and add it again.
- **Précommandes** filters the owner's order list. The existing phone-confirmation, delivery and cash-collection workflow still applies.
- Cancelling a pre-order restores reservation places even if the product has since switched to ready-stock sales. It never silently creates physical stock. When opening ready sales after a harvest, enter only the physical packs not already committed to pre-orders.
- Quantities are reserved on submission; Mehdi must cancel spam, unconfirmed or abandoned reservations manually. There is no paid deposit, automatic expiry or automatic customer messaging. Owner email alerts are separate.

## Hosted production

Production needs a persistent **libSQL-compatible remote database**, for example a Turso libSQL database. The elbaya-shop Turso database was provisioned through the existing Vercel project on the Starter ($0/month) plan, in Dublin. It is connected to Production only. Local development continues to use its own SQLite file. Keep deployment in the current Next.js Node runtime.

Configure these server-only variables in the hosting project's environment:

| Variable | Value |
| --- | --- |
| `TURSO_DATABASE_URL` (or `SHOP_DATABASE_URL`) | Remote `libsql://…` database URL, provided by the marketplace integration |
| `TURSO_AUTH_TOKEN` (or `SHOP_DATABASE_AUTH_TOKEN`) | Database authentication token, provided by the marketplace integration |
| `SHOP_ADMIN_PASSWORD_HASH` | Salt and scrypt hash generated by setup |
| `SHOP_SESSION_SECRET` | Random secret generated by setup, at least 32 characters |
| `SHOP_ORIGIN` | Exact public origin, e.g. `https://farmelbaya.com` (no trailing slash); optional when request origin is reliable |

Never prefix these variables with `NEXT_PUBLIC_`. Use HTTPS. Owner sessions are HttpOnly, same-site cookies lasting eight hours; changing the password hash or secret invalidates existing sessions. Login and order throttles are stored in the database. Vercel's trusted client IP header is used on Vercel; other deployments use a shared rate-limit bucket and should add trusted proxy/IP rate limiting before scaling.

**A Git push does not copy `.env.local`, the password text file, the local database, or locally uploaded photos.** For this project, the database variables and admin credentials are already configured in Vercel Production. For another deployment, add the variables from `.env.shop.example`, then redeploy. Copying the same hash and session secret from `.env.local` keeps the current owner password; there is no default production password. Set `SHOP_ORIGIN` only for the matching domain/environment, or leave it unset for same-origin preview deployments. A new remote database starts with the three seasonal illustrations and closed ordering; configure real products there. If retaining existing local data is needed, migrate it explicitly before opening sales.

Signed session tokens are also checked against hashed session records in the database. Logout revokes the server record, so replaying the old cookie fails. The owner page is excluded from indexing and cannot be embedded in a frame. Each admin operation checks authentication independently. This is a single-owner password system, not MFA or an independent penetration-test certification; protect the owner password, database token and hosting account.

Without a production database the public page shows the paused seasonal catalogue. Admin writes and checkout fail closed. Local `file:` storage is rejected on Vercel because its filesystem is ephemeral. A self-hosted server may set `SHOP_DATABASE_URL=file:/absolute/persistent/path/shop.db` on a backed-up persistent volume.

Tables are created idempotently on first access. Photos are decoded, resized, stripped of metadata and stored as WebP blobs in the same database; they do not rely on writable deployment files. This is intended for a small farm catalogue. For a large photo library, move image storage to object storage. Removed photos are detached from products but retained in storage; include cleanup and retention in ongoing maintenance. Configure provider backups and test restoration before launch.

The browser prepares photos before upload. The server caps uploads at 3 MiB and optimized images at 1.5 MB, below [Vercel's 4.5 MB function request/response limit](https://vercel.com/docs/functions/limitations#request-body-size). Original camera files are not kept. The code is compatible with Vercel's Node runtime, and the deployment workflow verifies the remote database and server-side admin authentication before assigning the production domain.

## Order handling

- Guest checkout: Tunisian phone number, name, address, delivery area, notes; cash on delivery only.
- Prices, delivery fees, availability and quantities are validated on the server. The client total must match the server total before an order can be accepted.
- Order creation and stock reservation are one write transaction. Retrying an identical request key returns the original order without reserving stock again.
- Statuses: new, confirmed, delivering, delivered, cancelled. Payment can be marked collected when delivered.
- Cancelling an unpaid, undelivered order restores its packs once. Cancelled orders cannot be reopened. Delivered/paid orders cannot be cancelled through this interface; returns/refunds are outside this version.
- Product/settings/order revisions reject stale admin edits rather than overwriting concurrent changes. Refresh and reopen an editor after a conflict.
- Keep existing format IDs; set stock to zero to stop selling a format. This preserves correct cancellation handling for existing orders.
- Dashboard shows the latest 500 orders; filter by status and print a delivery list. Historical data remains in the database. There is no scheduled stock release: Mehdi must cancel unconfirmed/abandoned orders himself.

## Verification

`npm run typecheck` and `npm run build` check the application. With a local development server running, `npm run test:shop` exercises admin authentication, photo upload, product publishing, checkout, idempotency, stock reservation, price tampering, stale edits, cancellation and unauthorized writes using temporary records, then restores previous delivery settings and deletes its own records. Do not run this test against production; it rejects non-local URLs.

Run `npm run test:shop:browser` with Google Chrome installed to exercise the actual French/English storefront, mobile navigation, admin login, product/photo forms, delivery setup, checkout and payment updates. It writes desktop/mobile screenshots to `.playwright-mcp/` and cleans up its temporary records. Like the API test, it requires the default local development database and refuses configured remote storage.

The browser checkout and admin interface should also be reviewed at desktop and phone widths before launch. Current backend reference: https://docs.turso.tech/sdk/ts/reference.

## Hosting plan and operational ownership

The existing Vercel team is on Hobby. Vercel restricts Hobby to personal, non-commercial use. This farm business requires an appropriate commercial plan before launch. Pro currently starts at $20/month plus applicable tax and metered usage; do not upgrade billing without owner approval. See https://vercel.com/docs/plans/hobby and https://vercel.com/pricing. The Turso database's free Starter plan is separate from Vercel hosting.

Mehdi must check the dashboard for new requests, maintain real availability and arrange delivery himself. Keep the database and Vercel accounts under long-term owner control. Store the admin password in a password manager.

Run node scripts/test-reservations.mjs against the local server to verify the visible English form, mobile layout, optional email, persistent requests, admin status updates, duplicate protection and invalid-input rejection. The script deletes only its own test requests.

## Archived review deployment (11 September 2026)

Review: https://elbaya-5cuwuqak4-oussamakous-projects.vercel.app/en/products/reserve
Admin: https://elbaya-5cuwuqak4-oussamakous-projects.vercel.app/fr/admin

The Vercel build passed. Hosted checks passed for the catalogue, unauthorized-admin rejection, password login, secure HttpOnly/SameSite cookie flags, request persistence in Turso, admin inbox visibility and status updates. Test requests were removed. These checks refer to the original review deployment. The owner requested merging and publishing the shop on 19 September 2026; no paid hosting upgrade was purchased.

Production deployment now follows master. Use https://www.farmelbaya.com/fr/products/reserve and /fr/admin. Production environment variables are configured; Preview does not share the production database or admin credentials. The confirmed activity tariffs on master remain 90 DT / €26, 70 DT / €21 and 250 DT / €74.

## Owner email alerts (Resend)

The recipient requested by the owner is configured through `SHOP_NOTIFY_EMAIL` in Vercel, not exposed to visitors. Sending is not active until all three production variables are set:

- `RESEND_API_KEY`: a sending API key for the verified domain.
- `SHOP_EMAIL_FROM`: e.g. `El Baya <commandes@notifications.farmelbaya.com>` after verifying that subdomain in Resend.
- `SHOP_NOTIFY_EMAIL`: the owner's receiving mailbox.

Create/sign in to the owner's Resend account, verify the sending domain using the DNS records Resend supplies, set the variables privately in Vercel Production, then redeploy. Do not paste keys into chat or commit them. The existing Gmail recipient does not need to move to Resend.

Every new shop order and unpriced pre-order request queues a French email in the same database transaction. Alerts include contact details, products/quantities, totals where applicable, and an admin link. No customer confirmation emails are sent. Existing records from before this feature are not backfilled.

Sending runs after the response. A failed email does not reject a saved order. Pending alerts retry on subsequent submissions and authenticated dashboard visits (up to three at a time, with a one-minute retry delay). There is no periodic retry scheduler yet; a quiet shop needs a dashboard refresh to retry. The dashboard shows unconfigured sending or pending alerts. Provider acceptance does not guarantee inbox delivery; verify spam and Resend delivery logs during activation.

A database lease prevents concurrent sends, and a stable Resend idempotency key deduplicates provider retries within its retention window. If the process dies after provider acceptance but before recording success and retries after the provider's window, a duplicate is possible. Sent alert bodies are cleared from the queue; orders remain in their original tables.

Run `node scripts/test-shop-notifications.mjs` for isolated tests with a mocked provider. It never sends real mail. Before activation, submit an explicitly labeled test request and have the owner confirm receipt. Remove that test request and its queue entry afterward.
