# Drive Dog Checks

## MVP Behavior Checklist

### Customer Access

- Existing customer can request a temporary code.
- Unknown phone number receives a generic response.
- Code expires after configured TTL.
- Attempts are limited.
- Customer sees only their own data.
- Customer cannot self-register.

### Catalog

- Catalog displays active product families and variants.
- Product variant includes brand, series, life stage, flavor, weight, and price.
- Customer can add multiple products to one order.
- Customer can quickly reorder last purchased product.

### Pricing

- Base price appears correctly.
- Customer-specific price appears correctly.
- Customer discount appears correctly.
- Promotion behavior matches approved precedence.
- Order total matches item totals, discounts, and VAT expectations.

### Orders

- Customer can create an order.
- Owner can create a manual order.
- Order notes are saved.
- Primary address is shown.
- Address edits are saved.
- Delivery request respects two-day notice.
- Orders can be filtered by date and area.

### Payments

- Online payment link is created server-side.
- Only payment URL is exposed to customer.
- Provider IDs/tokens are stored internally.
- Successful payment callback marks order paid.
- Failed payment callback does not mark order paid.
- Duplicate callback does not double-update order.
- Manual cash-on-delivery order can be marked paid cash.

### Invoices

- Invoice callback stores invoice number.
- Invoice callback stores invoice URL.
- Missing invoice callback is visible as pending/unknown.
- Cash-on-delivery invoice behavior matches provider confirmation.

### Delivery

- Delivery list shows orders by date.
- Delivery list shows area/city.
- Payment status is visible before delivery.
- Cash-on-delivery orders are distinguishable from paid online orders.

### Mobile / Desktop

- Customer flow works on mobile.
- Owner flow works on mobile.
- Owner flow works on desktop.
- Text does not overflow buttons, cards, or tables.

## Proposal / Questionnaire Checks

- `/proposal` returns HTTP `200`.
- `/proposal` includes Drive Dog and Orma AI details.
- `/proposal` includes monthly maintenance of `300 ₪ + מע״מ`.
- Signature pad works with mouse and touch.
- Signature approval validates name, approval checkbox, and non-empty signature.
- Root route returns questionnaire.
- Public pages do not expose credentials.

## Integration Checks

- Grow sandbox credentials are environment-specific.
- Grow production credentials are never committed.
- Webhook routes use HTTPS.
- Webhook payloads are logged before processing.
- Webhook processing is idempotent.
- Amount and order ID are verified before marking paid.
- bit / Apple Pay / Google Pay live testing is not run without approval.

