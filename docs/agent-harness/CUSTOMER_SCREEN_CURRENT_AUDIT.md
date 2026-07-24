# Drive Dog Customer Screen Current Audit

Status: completed  
Created: 2026-07-24  
Scope: documentation only; no product behavior changed

## Sources Read

- `docs/agent-harness/PRD.md`
- `docs/agent-harness/SPEC.md`
- `docs/agent-harness/FIRST_IMPLEMENTATION_SLICE.md`
- `docs/agent-harness/CUSTOMER_SCREEN_WORKPLAN.md`
- `admin.html`

## Current Implementation Summary

The current customer screen lives inside the static owner admin MVP in
`admin.html`.

It is a browser-only demo. Customer data is seeded in JavaScript and persisted
with `localStorage` under the key `driveDogAdminMvpV1`.

This is useful for demo/testing, but it is not a business source of truth.

## Current Customer Seed Data

Current demo customers have these fields:

- `id`
- `name`
- `phone`
- `address`
- `city`
- `area`
- `deliveryNotes`
- `internalNotes`
- `active`

Current seed includes 3 demo customers:

- עמי כהן
- דנה לוי
- יוסי מזרחי

## Current Customer List

Location:

- `customersView()`
- `customersTable(rows)`

Current columns:

- שם
- טלפון
- עיר/אזור
- סטטוס
- פעולות

Current displayed row data:

- customer name
- address as muted secondary text
- phone
- city
- area
- active/inactive chip

Current row actions:

- עריכה
- הזמנה

Current search:

- Search input placeholder: `חיפוש לפי שם, טלפון או עיר`
- Actual search checks: `name`, `phone`, `city`, `area`
- Address is not searched.

## Current Customer Form

Location:

- `customerForm`
- `bindCustomers()`
- `fillCustomer(id)`

Current fields:

- שם
- טלפון
- כתובת
- עיר
- אזור
- פעיל
- הערות משלוח
- הערות פנימיות

Current actions:

- שמירה
- ניקוי

Current validation:

- Requires only `name` and `phone`.
- No last-name field.
- No phone uniqueness validation.
- No structured phone validation.
- No server-side validation.

Current save behavior:

- Upserts the customer into `state.customers`.
- Saves entire state to `localStorage`.
- Shows toast `לקוח נשמר`.
- Re-renders the page.

## Current Order Link From Customer

The customer row action `הזמנה` sets `state.selected.customerId`, switches to the
orders tab, and renders the order screen.

Current behavior:

- Opens the orders tab with the customer selected.
- Does not create a quick order modal.
- Does not create an order until the order form is submitted.

## Current Persistence

Location:

- `loadState()`
- `saveState(message)`

Current behavior:

- Reads from `localStorage`.
- Falls back to seed data when no stored state exists.
- Saves the full state object to `localStorage`.
- `איפוס דמו` resets local demo state.

Important:

> `localStorage` is demo-only and must not be used as the source of truth for
> the real customer screen.

## Gaps Against Approved Customer-Screen Workplan

### Data Model Gaps

- No backend / DB source of truth.
- No separate first name / last name fields.
- No deleted customer archive.
- No `deleted_at`.
- No password reset fields or behavior.
- No invoice fields.
- No customer metrics fields or derived query.
- No server-side phone uniqueness.

### Customer List Gaps

- Missing required approved columns:
  - full name from first name + last name
  - last order date
  - number of orders
  - total purchases
- Search does not include address.
- Deleted customers are not modeled, so they cannot be excluded from the main
  list.
- List is table-based and may need mobile-specific review.

### Create / Edit / Delete Gaps

- No last-name field.
- No duplicate phone handling.
- No delete action.
- No deleted-customers page/archive.
- No failed-save state from backend because there is no backend.
- Address edits do not explicitly update customer orders according to approved
  rule.
- Delivery notes are stored on customer, but order creation behavior needs to
  ensure they do not transfer automatically.

### Customer Detail Gaps

- No dedicated customer profile/detail page.
- No profile tabs/areas:
  - details
  - orders
  - invoices
  - metrics
  - password reset
- No quick order modal from customer profile.

### Password Reset Gaps

- No reset button.
- No temporary password `123456` behavior.
- No forced password change flag update.
- No password hash handling.

### Invoice Gaps

- No customer invoice list.
- No invoice link.
- No invoice number.
- No invoice date.
- No invoice amount.
- No payment status.
- No Meshulam / Grow future-source placeholder in customer profile.

### Metrics Gaps

- No total purchases metric on customer.
- No number of orders metric on customer.
- No average order value metric.
- No last order date metric in customer profile/list.

### Permissions Gaps

- Current static demo has no real user/employee permission model.
- Approved rule says every employee can edit, delete, and reset customer
  password.

### Mobile Gaps

- Existing page is visually responsive at a general admin-shell level, but the
  customer list/form/detail requirements need dedicated mobile QA.

## Audit Verdict

The current customer screen is sufficient as a static demo and reference for
basic owner-side flow, but it is not implementation-ready as a business screen.

Before real implementation, the customer screen must move to backend / DB, add
the approved customer fields, add deletion/archive behavior, add a real profile
view, add password reset, invoices, metrics, and mobile QA.

No product behavior was changed during this audit.
