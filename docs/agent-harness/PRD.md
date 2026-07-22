# Drive Dog PRD

Status: initial MVP draft  
Source of truth: Drive Dog local project files and Noam's Slack inputs  
Last updated: 2026-07-22

## Problem

Drive Dog currently manages recurring customer orders through phone and
WhatsApp. Customer details, addresses, food preferences, orders, payment links,
and delivery planning are scattered, creating operational disorder.

## Goal

Build an MVP CRM and ordering system that centralizes customers, products,
orders, payments, invoices, and delivery planning in one place.

Drive Dog is not a public ecommerce store. It is a closed ordering system for
customers approved and created by the business owner.

## Target Users

### Business Owner

The business owner manages customers, products, prices, orders, payments, and
delivery planning.

### End Customer

An existing customer can enter with a phone number and temporary code, browse
the catalog, reorder past products, create an order, and choose payment.

## Business Snapshot

- Business name: Drive Dog / דרייב דוג
- Contact: Matanel Yaakobi / מתן יעקובי
- Approximate customers: 100
- Approximate order volume: 5-10
- Approximate catalog size: 30-40 products
- Service areas: Sderot, Netivot, Beer Sheva, Ofakim, and surrounding
  settlements
- Primary device use: desktop and mobile
- Main pain: disorder across customers, orders, and payments
- First-month success: work becomes easy, quick, and centralized

## MVP Scope

### Customer Management

- Create and edit customers.
- Store name, phone, address, area, delivery notes, and internal notes.
- Customer access is allowed only after the business owner creates the customer.
- One primary address per customer.
- Temporary delivery changes can be added as order notes.

### Customer Portal

- Phone number entry.
- Temporary code login.
- Customer sees only their own data.
- No open self-registration.
- No public signup.
- No anonymous checkout.
- No public storefront behavior where anyone can browse and buy.
- Generic response for unknown phone numbers.

Access rule:

- Only customers created or approved by the business owner may place orders.

### Catalog

- Catalog organized by brand, series, life stage, flavor, and weight.
- Each sellable variant is a SKU.
- Customers can browse the catalog.
- Customers can order multiple products in one order.
- Customers can quickly reorder the last purchased product.

### Pricing

- Base product price.
- Customer-specific fixed prices.
- Customer discounts.
- Simple promotions.

TBD: final precedence between fixed customer price, customer discount, and
promotion.

### Orders

- Customer-created orders.
- Manual owner-created orders for phone orders and less technical customers.
- Order items and quantities.
- Delivery date or delivery request with two days' notice.
- Order notes.

TBD: whether customers choose an exact delivery date or request a date that the
business owner confirms.

### Payments

- Online payment through Grow / Meshulam.
- Cash on delivery as an exception.
- No credit-account model.
- No payment card storage.
- Owner can copy a payment link and send it manually for manual orders.

### Invoices

- Online-payment invoices should be handled through Grow / Meshulam.
- Store invoice number and invoice URL when returned by provider.

TBD: whether Grow / Meshulam can issue immediate invoice/receipt documents for
cash-on-delivery through API.

### Delivery

- Delivery planning is manual.
- Minimum two-day notice.
- Delivery list should be filterable by date, area/city, order status, and
payment status.
- No automatic route optimization in MVP.

## Success Criteria

- Business owner can create a customer and product.
- Existing customer can log in with phone and temporary code.
- Customer can place an order with multiple products.
- Manual orders can be created by the owner.
- Online payment link can be generated.
- Successful payment updates the order.
- Invoice details are stored when returned by Grow / Meshulam.
- Cash-on-delivery order can be marked and later marked paid.
- Delivery list is usable by date and area.
- The system is usable on desktop and mobile.

## Open Product Questions

- Exact delivery date behavior.
- Price precedence rules.
- Cash-on-delivery invoice behavior.
- Whether initial customer import from CSV/Excel is required.
- Whether service areas need predefined zones or free-text city/area values.
