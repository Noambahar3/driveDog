# Drive Dog Worklog

Use this file as a running project memory for decisions, risks, and meaningful
changes. Keep entries short and factual.

## 2026-07-22

### Initial MVP Direction

- Drive Dog is a separate project with ID `proj-20260722-c0bjt68np0t`.
- Product direction: closed CRM and ordering system for recurring private
  dog/cat food customers.
- Business owner creates customers; customers do not self-register.
- Customer login should use phone number and temporary code.
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
  customer portal, OTP, and live Grow / Meshulam calls are deferred.
- Existing-solutions preflight checked Medusa, Vendure, Saleor, and Refine.
- Recommendation: start custom small scaffold on `dev` after Noam approves slice
  assumptions.

### Product Boundary Confirmed

- Noam clarified that Drive Dog must not be a public store.
- The system is only for customers selected/created/approved by the business
  owner.
- Public signup, anonymous checkout, and open storefront behavior are outside
  the intended product direction.
