# Drive Dog Worklog

Use this file as a running project memory for decisions, risks, and meaningful
changes. Keep entries short and factual.

## 2026-07-22

### Initial MVP Direction

- Drive Dog is a separate project with ID `proj-20260722-c0bjt68np0t`.
- Product direction: closed CRM and ordering system for recurring private
  dog/cat food customers.
- Business owner creates customers; customers do not self-register.
- Customer login should use phone number and password. Owner-created customers
  receive a temporary password or setup link, and must change it on first login.
- MVP includes customer management, product catalog, customer prices/discounts,
  customer orders, manual orders, Grow / Meshulam payment links, payment status,
  invoices for online payments, and delivery list.
- MVP excludes inventory management, consumption prediction, mobile apps,
  automatic route optimization, and employee/driver roles unless later approved.

### Business Discovery

- Approximate customer count: 100.
- Approximate order volume: 5-10.
- Approximate catalog size: 30-40 products.
- Service areas: Sderot, Netivot, Beer Sheva, Ofakim, and surrounding
  settlements.
- Main pain: operational disorder across WhatsApp/phone workflows.
- Success after one month: work is easy, fast, and centralized.

### Payment / Invoice Findings

- Grow / Meshulam supports payment-link based online flow according to public
  developer documentation.
- Payment callbacks and invoice callbacks appear suitable for MVP online
  payments.
- Cash-on-delivery invoice generation through Grow / Meshulam API remains
  unverified.

### Public Artifacts

- Questionnaire route:
  `https://drive-dog-questionnaire.candy-pine-7976.chatgpt.site`
- MVP proposal route:
  `https://drive-dog-questionnaire.candy-pine-7976.chatgpt.site/proposal`
- Proposal includes Orma AI details, monthly maintenance of 300 NIS + VAT, and
  static signature flow.

### Harness Created

- Created `docs/agent-harness` with clean Drive Dog harness documents.
- Harness uses the reference example for structure only.
- No other-project product decisions should be treated as Drive Dog truth.

### First Implementation Slice Prepared

- Created `FIRST_IMPLEMENTATION_SLICE.md`.
- Readiness verdict: PRD/SPEC are sufficient for an owner-side first scaffold if
  customer portal, password setup automation, and live Grow / Meshulam calls are
  deferred.
- Existing-solutions preflight checked Medusa, Vendure, Saleor, and Refine.
- Recommendation: start custom small scaffold on `dev` after Noam approves slice
  assumptions.

### Product Boundary Confirmed

- Noam clarified that Drive Dog must not be a public store.
- The system is only for customers selected/created/approved by the business
  owner.
- Public signup, anonymous checkout, and open storefront behavior are outside
  the intended product direction.

### Owner Admin MVP Started

- Built a static owner-admin MVP at `admin.html`.
- Build now copies it to `dist/admin.html` and serves it from `/admin` in the
  generated worker.
- Current scope includes dashboard, customers, products, customer-specific
  pricing, manual orders, delivery list, settings/stubs, demo seed data, and
  localStorage persistence.
- Grow / Meshulam remains a payment-link stub only. No live charges or external
  API calls are made.

## 2026-07-24

### Customer Screen Workplan Drafted

- Noam shared a preferred screen workflow pattern from the Solar Tzadi sales
  screen process as a work style example only.
- Created `CUSTOMER_SCREEN_WORKPLAN.md` for Drive Dog customer-screen
  readiness: screen boundaries, business rules, section checklist, branch
  recommendations, and ready prompts for implementation agents.
- Explicitly marked current `localStorage` behavior as demo-only; real customer
  records must use backend / DB as source of truth.
- Questionnaire decisions so far: customer screen is for owner + employees;
  customer exists once owner creates it; phone is unique; active/inactive has no
  current business meaning; screen should support editing first/last name,
  phone, address, city, delivery notes, password reset to a fixed temporary
  password with forced change, invoice links, customer purchase metrics, and
  starting a new order; customer history is not required.
- Noam approved allowing customer deletion from the customer screen.
- Password reset decision: reset button sets temporary password `123456`, and
  the customer must change it on next login.
- Invoice-link direction: likely Meshulam / Grow, but exact implementation is
  deferred.
- Final customer-screen questionnaire decisions: no Excel/CSV import in this
  scope; use demo customers for tests; address edits update the customer's
  orders; deleted customers are kept on a separate page/archive; customer table
  columns are full name, phone, city, last order date, order count, total
  purchases, and actions; search covers name, address, phone, and city; profile
  areas are details, orders, invoices, metrics, and password reset; create order
  supports both full screen and quick modal; do not include common/frequent
  products; delivery notes do not automatically copy into new orders; every
  employee can edit/delete/reset; mobile responsiveness is required in the
  first implementation.
- Created `CUSTOMER_SCREEN_IMPLEMENTATION_CHECKLIST.md` with branch-ready tasks
  and prompts.
- Completed the current customer-screen audit in
  `CUSTOMER_SCREEN_CURRENT_AUDIT.md`; no product behavior changed.
- Implemented the customer data model slice on branch
  `feat/customer-screen-data-model`: local Node server now exposes a file-backed
  customer API with demo customers, unique phone validation, soft-delete archive,
  and password reset to temporary `123456` with forced next-login change.
- Added `tests/customer-api.test.mjs`; `npm test` covers the customer API
  persistence and validation flow.
- Implemented the customer list slice on branch `feat/customer-screen-list`:
  `admin.html` now loads customers from `/api/customers`, shows approved list
  columns, calculates last order/order count/total purchases from existing
  orders, searches by full name/address/phone/city, and has loading/empty/error
  states.

## 2026-07-25

### Customer Create/Edit/Delete Started

- Opened branch `feat/customer-screen-edit-delete`.
- Connected the customer form in `admin.html` to the customer API for create
  and edit instead of mutating UI state optimistically.
- Added customer row deletion with confirmation; successful deletes soft-delete
  through the API and remove the customer from the active list, while failures
  keep the customer visible.
- Updated API tests to cover customer edit, edit validation, and duplicate
  phone errors during edit.

### Customer Screen Plan Completed

- Finished the remaining customer-screen checklist sections on
  `feat/customer-screen-edit-delete`: deleted-customer archive, customer
  profile, workflow links, quick order modal, password reset, invoices, metrics,
  and mobile/RTL refinements.
- Added active profile actions for full order flow, quick order flow, customer
  price flow, and reset password.
- Added invoice seed data for profile display only; Meshulam / Grow remains a
  future source and no live provider call was added.
- Verified with `npm run build`, `npm test`, and a local API smoke check for
  create, reset password, delete, and deleted-customer archive.
