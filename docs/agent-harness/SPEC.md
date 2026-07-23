# Drive Dog SPEC

Status: initial functional specification  
Use with: `PRD.md`, `CHECKS.md`, and `GROW_INTEGRATION_CHECK.md`

## System Overview

Drive Dog is a closed CRM and ordering system for recurring private customers.
The business owner creates customers. Customers then use phone and password
login to order food products from a structured catalog.

This system must not behave like an open public store. There is no anonymous
checkout, no open registration, and no order placement for customers that the
business owner has not created or approved.

## Roles

### `owner`

- Full administrative access.
- Manage customers, products, prices, orders, delivery list, and payment status.

### `customer`

- Access only their own profile and orders.
- Can browse catalog and place orders.

## Core Entities

### Customer

- `id`
- `name`
- `phone`
- `address`
- `city`
- `area`
- `delivery_notes`
- `password_hash`
- `must_change_password`
- `internal_notes`
- `is_active`
- `created_at`
- `updated_at`

### ProductFamily

- `id`
- `brand`
- `series`
- `animal_type`
- `description`
- `is_active`

### ProductVariant

- `id`
- `product_family_id`
- `life_stage`
- `flavor`
- `weight`
- `display_name`
- `base_price`
- `image_url`
- `is_active`

### CustomerPrice

- `id`
- `customer_id`
- `product_variant_id`
- `custom_price`
- `discount_percent`
- `notes`

### Promotion

- `id`
- `name`
- `product_variant_id`
- `discount_type`
- `discount_value`
- `starts_at`
- `ends_at`
- `is_active`

### Order

- `id`
- `customer_id`
- `source`
- `delivery_date`
- `delivery_area`
- `delivery_notes`
- `status`
- `payment_status`
- `total_amount`
- `created_at`
- `updated_at`

Allowed `source` values:

- `customer_portal`
- `manual_owner`

### OrderItem

- `id`
- `order_id`
- `product_variant_id`
- `quantity`
- `unit_price`
- `discount_amount`
- `line_total`

### Payment

- `id`
- `order_id`
- `provider`
- `provider_transaction_id`
- `payment_method`
- `status`
- `amount`
- `paid_at`
- `payment_url`
- `raw_provider_status`

### Invoice

- `id`
- `order_id`
- `provider`
- `provider_invoice_id`
- `invoice_number`
- `invoice_url`
- `status`
- `issued_at`

## Status Model

### Order Status

- `draft`
- `pending_payment`
- `paid`
- `cash_on_delivery`
- `preparing`
- `ready_for_delivery`
- `delivered`
- `cancelled`

### Payment Status

- `not_selected`
- `pending_online_payment`
- `paid_online`
- `cash_on_delivery`
- `paid_cash`
- `failed`
- `cancelled`

## Customer Login

- Login uses phone number and password.
- Owner-created customers receive a temporary password or one-time setup link.
- First login with a temporary password must require password change.
- Passwords are stored as hashes only.
- Max attempts: TBD, recommended 5 attempts before temporary lock.
- Unknown phone numbers should receive a generic response.
- Customers cannot create accounts by themselves.
- Customers cannot browse/place orders unless their phone number belongs to an
  active owner-created customer record.
- Unknown users may receive a contact message, but not a self-service signup
  flow.

## Order Rules

- Minimum delivery notice: two days.
- Customer may order multiple products.
- One primary customer address.
- One-off delivery change should be placed in order notes.
- No inventory checks in MVP.
- No credit account / debt model.

## Pricing Rules

MVP recommendation:

1. Customer-specific price overrides base price.
2. Customer discount applies after the selected price.
3. Promotion rules stay simple and visible.

TBD: Noam/business owner must approve final precedence before implementation.

## Grow / Meshulam Integration

Use backend-only calls.

Required flows:

- Create payment link.
- Store provider process ID/token internally.
- Show or send only the payment URL.
- Receive payment callback.
- Verify amount and order match.
- Update order/payment status idempotently.
- Approve transaction callback if required by provider.
- Receive invoice callback when available.
- Store invoice number and URL.

Open risk:

- Cash-on-delivery invoice through Grow / Meshulam API is unverified.

## Public Proposal / Signature Page

Current proposal route:

- `https://drive-dog-questionnaire.candy-pine-7976.chatgpt.site/proposal`

Current questionnaire route:

- `https://drive-dog-questionnaire.candy-pine-7976.chatgpt.site`

Signature behavior:

- Static page creates a signed approval file.
- Static page opens a prepared email to `Ami@hai.tech`.
- Automatic email delivery requires a backend or mail provider integration.

## Non-Functional Requirements

- Mobile-first customer experience.
- Owner interface usable on desktop and mobile.
- Hebrew-first UI.
- No card data stored.
- Payment provider secrets stored server-side only.
- Webhooks idempotent.
- Public artifacts must not expose private phone numbers or credentials.

## Implementation Placeholders

- Framework: TBD
- Database: TBD
- Hosting: TBD
- Initial password/setup-link delivery provider: TBD
- Email/signature backend provider: TBD
- Grow / Meshulam credentials: TBD
- Initial customer import method: TBD
