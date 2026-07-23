# Drive Dog First Implementation Slice

Status: ready for scaffold recommendation  
Created: 2026-07-22  
Scope: implementation readiness only; do not build the full MVP from this file

## Purpose

Define the first small implementation slice for Drive Dog so development can
start without waiting for every open product question.

The first slice should prove the core business workflow:

Owner manages customers/products -> owner creates a manual order -> system
calculates totals -> order appears in delivery/payment views -> payment provider
is represented by stubs.

Product boundary: Drive Dog must stay a closed owner-approved customer system,
not a public ecommerce store.

## PRD / SPEC Readiness Assessment

`PRD.md` and `SPEC.md` are clear enough for a first implementation slice if the
slice avoids unresolved business decisions.

Ready enough:

- Roles: owner and customer are defined.
- Customer creation rules are defined.
- Product family / variant structure is defined.
- Manual orders are required.
- Customer orders are required later, but do not need to be first.
- Basic payment statuses are defined.
- Delivery list requirements are defined.
- Grow / Meshulam integration can be stubbed.

Still open:

- Whether "5-10 orders" means per day, per week, or another period.
- Whether customers choose an exact delivery date or only request one.
- Final precedence between customer fixed price, customer discount, and
  promotion.
- Whether initial customer import is required.
- Whether Grow / Meshulam can issue cash-on-delivery invoice documents through
  API.
- Initial password/setup-link delivery and email/signature backend provider.

Recommendation:

- Start implementation with owner-side foundations and manual orders.
- Keep customer portal, password setup automation, and live Grow integration for later slices.
- Use placeholders and stubs for open integration points.

## Existing-Solutions Preflight

Checked current open-source / maintained options before choosing a custom first
slice:

- Medusa: open-source commerce platform with customizable commerce modules and
  admin. Source: https://medusajs.com/ and https://docs.medusajs.com/
- Vendure: open-source headless commerce platform for catalog, pricing, orders,
  B2B/D2C, and custom workflows. Source: https://vendure.io/
- Saleor: open-source headless ecommerce platform with GraphQL APIs and
  extensibility. Source: https://saleor.io/
- Refine: open-source React framework for admin panels and internal tools.
  Source: https://refine.dev/core/

Assessment:

- Medusa/Vendure/Saleor are strong for larger commerce platforms, but they bring
  substantial commerce assumptions, setup, and integration surface for a small
  closed CRM with about 100 customers and 30-40 products.
- Drive Dog explicitly should not be modeled as an open storefront. Any future
  customer-facing catalog must sit behind phone/password access for customers
  approved by the business owner.
- Drive Dog's first slice needs custom CRM behavior, manual orders, local
  pricing rules, simple delivery views, and Grow-specific payment stubs more
  than a full commerce engine.
- Refine or React Admin-style libraries may help later for admin CRUD speed, but
  should not dictate product architecture before the first domain model is
  stable.

Recommendation:

- Build the first slice custom and small.
- Re-evaluate admin framework use after the first domain model is implemented.
- Do not adopt a full headless commerce platform for slice 1 unless Noam
  explicitly wants the project to become a commerce-platform customization.
- Do not implement anonymous catalog browsing, public checkout, or public signup
  in any first scaffold.

## First MVP Slice

### What To Build

Build an owner-first working skeleton with local/stubbed data flows:

1. Application scaffold.
2. Basic owner dashboard shell.
3. Customer CRUD.
4. Product family / product variant CRUD.
5. Customer-specific pricing basics.
6. Manual order creation.
7. Order item totals.
8. Payment status selection.
9. Delivery list view.
10. Grow / Meshulam payment-link stub.

### Why This Slice First

- It validates the most important operational pain: disorder around customers,
  products, orders, payments, and deliveries.
- It does not require password setup delivery provider selection.
- It does not require live payment credentials.
- It does not require a final customer-facing UX.
- It creates the data model the customer portal will later use.

## What Not To Build Yet

Do not build these in slice 1:

- Customer portal.
- Customer password login.
- Public storefront.
- Public signup.
- Anonymous checkout.
- Live Grow / Meshulam payment API calls.
- Real webhook handling.
- Real invoice callback handling.
- Cash-on-delivery invoice automation.
- CSV/Excel import.
- Promotions engine beyond placeholder fields.
- Route optimization.
- Inventory management.
- Mobile app.
- Email/signature backend.
- Multi-user roles beyond owner/customer data shape.

## First Screens

### Owner Layout

Purpose:

- Give the owner navigation and a simple operational home.

Views:

- Dashboard
- Customers
- Products
- Orders
- Deliveries
- Settings / Stubs

Acceptance:

- Owner can move between first screens.
- Navigation works on desktop and mobile.

### Customers List

Purpose:

- Find and manage customers.

Fields:

- Name
- Phone
- City
- Area
- Active status
- Last order placeholder

Actions:

- Create customer
- Edit customer
- Open customer detail

### Customer Detail

Purpose:

- Store the owner-managed customer record.

Fields:

- Name
- Phone
- Address
- City
- Area
- Delivery notes
- Internal notes
- Active status

Actions:

- Save
- Create manual order
- View customer orders

### Products List

Purpose:

- Manage the first catalog.

Fields:

- Brand
- Series
- Animal type
- Life stage
- Flavor
- Weight
- Display name
- Base price
- Active status

Actions:

- Create family / variant
- Edit product variant

### Customer Pricing

Purpose:

- Define simple customer-specific prices before full pricing logic.

Fields:

- Customer
- Product variant
- Custom price
- Discount percent
- Notes

Acceptance:

- Manual order uses custom price when present.
- Discount behavior is visibly simple and documented.

### Manual Order Creation

Purpose:

- Let owner create orders for phone/older customers.

Flow:

1. Select customer.
2. Add one or more product variants.
3. Edit quantity.
4. Calculate totals.
5. Choose delivery date/request.
6. Add delivery notes.
7. Choose payment status:
   - `pending_online_payment`
   - `cash_on_delivery`
   - `paid_cash`
   - `paid_online` for manual testing only
8. Create order.

### Orders List

Purpose:

- See operational order status.

Fields:

- Order ID
- Customer
- Created date
- Delivery date/request
- Area/city
- Total
- Order status
- Payment status
- Source

Filters:

- Status
- Payment status
- Area/city
- Delivery date

### Delivery List

Purpose:

- Give owner the first usable delivery workflow.

Fields:

- Delivery date/request
- Customer
- Address
- City/area
- Order items
- Notes
- Payment status

Acceptance:

- Owner can filter today's/upcoming delivery work.
- Cash-on-delivery orders are visually distinct.

### Settings / Integration Stubs

Purpose:

- Make external dependencies explicit without activating them.

Stub cards:

- Grow / Meshulam: not connected
- Password setup delivery provider: not selected
- Email/signature backend: not selected
- Customer import: not configured

## First Models / Tables

Implement these first:

- `customers`
- `product_families`
- `product_variants`
- `customer_prices`
- `orders`
- `order_items`
- `payments`

Optional in slice 1:

- `invoices` as placeholder table only
- `integration_events` for future webhook logs

Do not implement yet:

- `sessions`
- `webhook_events` with production semantics
- `imports`
- `users` beyond a simple owner placeholder/auth stub

## Integration Stubs

### Grow / Meshulam Stub

Stub behavior:

- "Create payment link" button generates a fake URL like
  `https://pay.example.test/orders/{orderId}`.
- Store payment URL on `payments`.
- Allow manual simulation of `paid_online`, `failed`, and `cancelled`.
- Do not call Grow live or sandbox APIs.

Acceptance:

- Later live integration can replace the stub without changing order flow.

### Invoice Stub

Stub behavior:

- Store empty invoice fields.
- Show invoice status as `pending_provider`.
- Do not generate official invoice documents.

### Customer Login Stub

Stub behavior:

- No customer portal login in slice 1.
- Settings page marks password setup delivery provider as `TBD`.

### Signature / Email Stub

Stub behavior:

- No backend email sending in app scaffold.
- Existing static proposal page remains separate.

## What Counts As "Working"

At the end of the first slice:

- App runs locally.
- Owner can navigate first screens.
- Owner can create/edit customers.
- Owner can create/edit product variants.
- Owner can add customer-specific price.
- Owner can create manual order with multiple items.
- Order total is calculated.
- Order gets a delivery date/request and area/city.
- Order appears in orders list.
- Order appears in delivery list.
- Payment status can be set or simulated.
- Grow/payment integration is clearly stubbed and cannot charge anyone.
- Seed/demo data exists for at least:
  - 3 customers
  - 5 product variants
  - 3 orders
- Basic checks pass.
- No other-project data, names, credentials, or assumptions are present.

## Branch Recommendation

It is safe to open branch `dev` and start the first scaffold if Noam approves
these assumptions:

- Slice 1 is owner-side only.
- Customer portal and password setup automation wait for slice 2.
- Grow / Meshulam is stubbed only in slice 1.
- The first scaffold may use placeholder auth for owner access.
- Delivery date can be modeled as a nullable/requested date field until the
  exact behavior is approved.

Information still needed before slice 2:

- Exact customer delivery-date behavior.
- Initial password/setup-link delivery provider.
- Real Grow / Meshulam credentials.
- Invoice behavior for cash-on-delivery.
- Pricing precedence confirmation.
- Customer import requirement.

## Recommended Next Command After Approval

Do not run until Noam approves scaffold start.

```bash
git checkout -b dev
```
