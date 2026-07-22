# Drive Dog Client Discovery Checklist

Use this checklist to close gaps before implementation. Ask only questions whose
answers change product behavior, implementation, or commercial scope.

## Business Operations

- What is the exact meaning of "5-10 orders": per day, per week, or another
  period?
- Does the business owner usually work alone, or could another person need
  access soon?
- Are there seasonal peaks or specific busy days?

## Customer Data

- Is there an existing customer list in Excel/CSV, or only WhatsApp contacts?
- Are customer phone numbers unique enough to use as the main login key?
- Are there customers with the same household but different phone numbers?
- Should inactive customers remain searchable?

## Delivery

- Should the customer choose an exact delivery date?
- Or should the customer request a date and the business owner confirms later?
- Are there delivery days or blocked days?
- Should service areas be predefined zones or free text?
- Should the owner be able to change the delivery date after order creation?

## Products

- What are the top product brands/series for the initial catalog?
- Does each sellable bag have a fixed SKU/barcode?
- Are images required for all products in MVP?
- Are products for dogs and cats separated in the customer UI?

## Pricing

- What should win when multiple pricing rules apply?
  - Customer fixed price
  - Customer discount
  - Promotion
- Are prices shown including VAT?
- Can owner override price on a manual order?
- Are promotions global or customer-specific?

## Payments

- Which Grow / Meshulam payment methods are active in the business account?
- Is bit active?
- Are Apple Pay / Google Pay active?
- Should cash-on-delivery be visible to all customers or only owner-selected
  customers?
- What should happen if a customer opens a payment link but does not pay?

## Invoices

- Does Grow / Meshulam issue invoice-tax-receipts automatically for online
  payments?
- Can Grow / Meshulam issue invoice/receipt documents for cash-on-delivery
  through API?
- If not, should the owner issue cash invoices manually or should another
  invoice provider be connected?

## OTP / Messaging

- Should login codes be sent by SMS first?
- Is WhatsApp OTP required for MVP or later?
- Which sender/business number should customers recognize?
- What is the acceptable monthly cost for OTP messages?

## Proposal / Signature

- Should the proposal signature be a static downloadable approval, or a real
  backend form that sends email automatically?
- If automatic email is required, which provider should be used?
- Should signed approvals be stored anywhere besides email?

## Launch

- Who will enter the first 100 customers?
- Is CSV import required before launch?
- Who will create the first catalog?
- What is the first real test order scenario?
- What date is targeted for pilot use?

