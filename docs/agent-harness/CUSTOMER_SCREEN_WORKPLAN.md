# Drive Dog Customer Screen Workplan

Status: draft for review before implementation  
Created: 2026-07-24  
Use with: `PRD.md`, `SPEC.md`, `FIRST_IMPLEMENTATION_SLICE.md`, `CHECKS.md`

## 1. Screen Boundary

The customer screen is an owner-side CRM screen for customers that the business
owner created or approved.

The screen starts with an existing or newly created owner-managed customer.

The screen ends at the customer profile boundary:

- customer identity and contact data
- address and delivery preferences
- internal operational notes
- password reset / setup support for customers who forgot access
- stored customer invoices and invoice links
- customer value and ordering metrics
- quick links into related orders, prices, payments, invoices, and delivery work
- deleted customers archive / page

The screen is not responsible for:

- public signup
- anonymous checkout
- customer-facing catalog browsing
- live Grow / Meshulam payment calls
- full order fulfillment workflow
- invoice issuing through the payment/accounting provider
- route optimization
- inventory management
- customer action history / audit timeline

Working rule:

> A customer screen is the owner's source of truth for the customer record. It
> can link to orders and payments, but it should not become the whole system.

## 2. Business Definitions

### Customer

A `Customer` is a person or household the owner has approved and manages in the
system.

Required MVP fields:

- name
- last name
- phone
- address
- city
- delivery notes
- password/access setup status

Optional / derived fields for the screen:

- total orders
- total revenue / customer value
- average order value
- last order date
- invoices list / invoice links
- deleted customer status / deleted timestamp

Recommended implementation fields from `SPEC.md`:

- `id`
- `name`
- `last_name`
- `phone`
- `address`
- `city`
- `delivery_notes`
- `password_hash`
- `must_change_password`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

### Active Customer

Initial owner decision from 2026-07-24: active/inactive is not meaningful for
this screen right now. Do not build business behavior around active status
unless this changes.

### Phone Identity

Phone is the unique customer identifier. Two customers should not share the same
phone number unless the owner explicitly changes this rule later.

## 3. Business Rules

- Customers are created by the owner only.
- Owner employees also use this screen.
- There is no self-registration.
- Unknown phone numbers must receive a generic response in future login flows.
- Phone is unique per customer.
- Duplicate phone handling must be explicit before save or as a server-side
  validation error.
- Active/inactive has no business meaning in the current decision set.
- If deactivation is added later, it needs separate rules before implementation.
- Customer deletion is allowed from the customer screen.
- Delete must be an explicit action with confirmation.
- Deleted customers are kept and shown on a separate deleted-customers page.
- Failed delete actions must not remove the customer from the UI as if the
  action succeeded.
- `localStorage` is acceptable only for the current static demo. It must not be
  the source of truth for the real customer screen.
- The source of truth for customer records must be backend / DB.
- Failed save/update/delete actions must not show success and must not change
  UI state as if the action succeeded.
- Editing customer address updates the customer's orders accordingly.
- Delivery notes do not automatically transfer into new orders.
- Passwords must never be stored or shown in plain text.
- Password reset is initiated from the customer screen by setting fixed
  temporary password `123456`. The customer must be forced to change it on next
  login.
- Customer invoices can be stored and shown on the customer screen. Current
  owner assumption is that invoice links will come from Meshulam / Grow later,
  but exact integration details are deferred.
- Invoice data should include invoice link, invoice number, date, amount, and
  payment status.
- Customer metrics should be derived from orders/payments, not manually typed.
- Customer metrics include total purchases, number of orders, average order
  value, and last order date. Do not include common/frequent products in the
  current scope.
- Customer history / audit log is not required in the current customer screen
  scope.
- Every employee can edit customers, delete customers, and reset customer
  passwords in the current scope.
- Customer screen must be responsive and comfortable on mobile from the first
  implementation.

## 4. Sections

### Section A: Existing Screen Audit

Purpose:

- Understand the current static owner-admin customer behavior before changing
  implementation.

Acceptance:

- Current customer list fields are documented.
- Current customer form actions are documented.
- `localStorage` demo persistence is explicitly marked as temporary.
- Gaps between static demo and real implementation are listed.

Recommended branch:

```text
docs/customer-screen-audit
```

### Section B: Customer Data Model

Purpose:

- Define the persistent customer model and migration path from demo data.

Acceptance:

- Customer table/model includes the MVP fields.
- Phone uniqueness policy is defined.
- Active/inactive does not drive business behavior.
- Customer deletion is explicitly allowed.
- Deleted customers are retained for a separate deleted-customers page.
- Demo customer records exist for testing.

Recommended branch:

```text
feat/customer-screen-data-model
```

### Section C: Customer List

Purpose:

- Let the owner scan, search, filter, and open customers quickly.

Acceptance:

- Owner sees full name, phone, city, last order date, number of orders, total
  purchases, and row actions.
- Search works across full name, address, phone, and city.
- Empty state is clear.
- Loading and error states exist.
- Mobile layout is usable without horizontal overflow.

Recommended branch:

```text
feat/customer-screen-list
```

### Section D: Customer Create/Edit

Purpose:

- Let the owner create and update customer records reliably.

Acceptance:

- Owner can create customer with required first name, last name, and phone.
- Owner can edit first name, last name, phone, address, city, and delivery notes.
- Owner can delete a customer.
- Duplicate phone warning exists before save or as a server validation error.
- Save errors do not show success.
- Successful save refreshes the persisted customer record.
- Validation messages are clear in Hebrew.

Recommended branch:

```text
feat/customer-screen-edit
```

### Section E: Customer Detail

Purpose:

- Give the owner one operational profile page for a customer.

Acceptance:

- Detail view shows customer identity, address, delivery notes, invoices,
  related orders, related pricing rules, and customer value metrics.
- Owner can jump from customer detail to create manual order.
- Owner can create an order from the customer screen with both a full order
  screen path and a quick modal path.
- Owner can jump to customer-specific pricing.
- Related orders are read-only summaries unless the orders screen owns editing.
- Missing related data has a clean empty state.

Recommended branch:

```text
feat/customer-screen-detail
```

### Section F: Order / Pricing Links

Purpose:

- Connect the customer screen to existing owner workflows without duplicating
  order and pricing logic inside the customer screen.

Acceptance:

- "Create manual order" starts the order flow with the selected customer.
- A quick order modal can also be opened from the customer screen.
- "Add customer price" starts the pricing flow with the selected customer.
- Customer screen does not recalculate business totals itself.
- Customer screen shows summaries returned from order/pricing data.

Recommended branch:

```text
feat/customer-screen-workflow-links
```

### Section G: Password Reset

Purpose:

- Let the owner reset customer access when a customer forgot the password,
  without exposing stored passwords.

Acceptance:

- Customer profile has a reset-password action.
- Reset sets temporary password `123456`.
- Customer is forced to change the temporary password on next login.
- No password is displayed.
- No real external message/email is sent.
- Owner-facing copy makes the limitation clear.

Recommended branch:

```text
feat/customer-screen-password-reset
```

### Section H: Customer Invoices

Purpose:

- Show invoice links that belong to the customer.

Acceptance:

- Customer profile shows invoice links.
- Invoice list includes invoice link, invoice number, date, amount, and payment
  status.
- Meshulam / Grow is the expected future invoice source, but the exact flow is
  deferred.
- Customer screen does not issue official invoices.
- Missing invoices have a clear empty state.

Recommended branch:

```text
feat/customer-screen-invoices
```

### Section I: Customer Metrics

Purpose:

- Show how much the customer orders and how valuable the customer is.

Acceptance:

- Customer profile shows total purchases.
- Customer profile shows number of orders.
- Customer profile shows average order value.
- Customer profile shows last order date.
- Customer profile does not show common/frequent products in the current scope.
- Metrics are derived from persisted order/payment data.

Recommended branch:

```text
feat/customer-screen-metrics
```

### Section J: Mobile and Hebrew QA

Purpose:

- Make the customer screen usable on mobile and desktop.

Acceptance:

- List, form, and detail views are tested on mobile width.
- The screen is responsive and comfortable on phone from the first
  implementation.
- Hebrew RTL layout is correct.
- Long names, addresses, and notes do not break controls.
- Buttons keep stable dimensions and do not overflow.
- Main actions remain reachable without awkward scrolling.

Recommended branch:

```text
fix/customer-screen-mobile-rtl
```

## 5. Execution Checklist

```text
Section: Existing Screen Audit
Task: Document current static customer-screen behavior
Status: pending
Acceptance:
- Current customer list/form/detail behavior is documented.
- Demo-only localStorage persistence is identified.
- Gaps for real backend/DB implementation are listed.
- No product behavior is changed.
```

```text
Section: Customer Data Model
Task: Persist customers in backend / DB
Status: pending
Acceptance:
- Customer records are saved in backend / DB.
- Refresh does not lose customer changes.
- Phone duplicate policy is enforced.
- Active/inactive does not drive behavior in this screen.
- Deleted customers are retained and can be shown on a separate page.
- Demo customer records exist for tests.
```

```text
Section: Customer List
Task: Build persisted customer list with search and filters
Status: pending
Acceptance:
- List loads from backend.
- Search works by full name, address, phone, and city.
- Table shows full name, phone, city, last order date, number of orders, total
  purchases, and actions.
- Loading, empty, and error states exist.
- Mobile layout is usable.
```

```text
Section: Customer Create/Edit
Task: Build reliable create/edit flow
Status: pending
Acceptance:
- Required first name, last name, and phone validation works.
- Duplicate phone warning/error works.
- Save success reflects backend response.
- Save failure leaves previous state intact.
- Delete requires confirmation.
- Delete failure leaves the customer visible.
- Deleted customer moves to the deleted-customers page/archive.
- Hebrew validation messages are clear.
```

```text
Section: Customer Detail
Task: Build owner customer profile
Status: pending
Acceptance:
- Profile shows contact, address, delivery notes, invoices, and metrics.
- Related order summaries appear.
- Related customer prices appear.
- Full create-order action works with customer preselected.
- Quick create-order modal works.
- Empty states are clear.
```

```text
Section: Workflow Links
Task: Connect customer to order and pricing flows
Status: pending
Acceptance:
- Create manual order opens with customer preselected.
- Quick order modal can also be opened from the customer profile.
- Add customer price opens with customer preselected.
- Customer screen does not duplicate order total logic.
- Broken target flow shows a clear error instead of silent failure.
```

```text
Section: Password Reset
Task: Add safe customer password reset action
Status: pending
Acceptance:
- Reset action exists on customer profile.
- Reset sets temporary password `123456`.
- Customer must change password on next login.
- No password is displayed.
- No external message/email is sent.
```

```text
Section: Customer Invoices
Task: Show customer invoice links
Status: pending
Acceptance:
- Invoice links appear in the customer profile.
- Invoice list includes invoice link, invoice number, date, amount, and payment
  status.
- Empty invoice state is clear.
- Customer screen does not issue invoices.
```

```text
Section: Customer Metrics
Task: Show customer value metrics
Status: pending
Acceptance:
- Total purchases is shown.
- Number of orders is shown.
- Average order value is shown.
- Last order date is shown.
- Common/frequent products are not shown in the current scope.
- Metrics are derived from persisted orders/payments.
```

```text
Section: Mobile and Hebrew QA
Task: Verify mobile RTL quality
Status: pending
Acceptance:
- Customer list works on mobile.
- Customer form works on mobile.
- Customer detail works on mobile.
- The screen is responsive and comfortable on phone.
- Long Hebrew text does not overflow.
- Relevant build/tests pass.
```

## 6. Ready Prompts For Agents

### Prompt: Existing Screen Audit

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
לתעד את ההתנהגות הקיימת של מסך הלקוחות לפני מימוש אמיתי.

הקשר עסקי:
Drive Dog הוא CRM סגור להזמנות מזון לחיות. בעל העסק יוצר לקוחות; אין הרשמה
פתוחה ואין checkout אנונימי. המסך הנוכחי הוא דמו סטטי, ו-localStorage מותר רק
כדמו ולא כמקור אמת עסקי.

דרישות:
- קרא קודם את PRD.md, SPEC.md, FIRST_IMPLEMENTATION_SLICE.md ואת admin.html.
- תעד אילו שדות ופעולות קיימים כרגע במסך הלקוחות.
- סמן במפורש מה דמו זמני ומה חייב לעבור backend / DB.
- אל תשנה קוד מוצר.

Acceptance criteria:
- יש מסמך קצר עם current behavior.
- יש רשימת gaps למימוש אמיתי.
- אין שינוי התנהגות באפליקציה.
```

### Prompt: Customer Data Model

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
להעביר את לקוחות המסך ממקור אמת בדפדפן למקור אמת בשרת / DB.

הקשר עסקי:
לקוח הוא רשומה שבעל העסק יצר או אישר. כרגע active/inactive לא מייצר משמעות
עסקית במסך. טלפון הוא מזהה ייחודי. מסך הלקוח צריך לתמוך בפרטי לקוח, איפוס
סיסמה זמנית, חשבוניות כקישורים ומדדי רכישה.

דרישות:
- קרא קודם את הקוד הקיים והשתלב בדפוסים הקיימים.
- אל תשתמש ב-localStorage כמקור אמת עסקי.
- צור/עדכן מודל לקוח עם שדות MVP.
- הגדר מדיניות duplicate phone.
- אל תבנה חוקיות active/inactive בלי החלטה חדשה.
- שמור לקוחות מחוקים לדף/ארכיון נפרד.
- הכן רשימת לקוחות דמה לבדיקות.

Acceptance criteria:
- יצירת/עריכת לקוח נשמרת בשרת / DB.
- hard refresh לא מאבד נתונים.
- כפילות טלפון מטופלת.
- שדות שם, שם משפחה, טלפון, כתובת, עיר והערות משלוח נתמכים.
- לקוחות מחוקים נשמרים לארכיון/דף נפרד.
- קיימים לקוחות דמה לבדיקות.
- build/tests רלוונטיים עוברים.
```

### Prompt: Customer Create/Edit

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
לבנות flow אמין ליצירה ועריכת לקוח.

הקשר עסקי:
בעל העסק מנהל את הלקוחות. אין הרשמה פתוחה. שגיאת שמירה לא יכולה להציג הצלחה או
לשנות מצב כאילו הפעולה הצליחה.

דרישות:
- קרא קודם את הקוד הקיים.
- הוסף validation לשם, שם משפחה וטלפון.
- הוסף טיפול duplicate phone לפי מדיניות השרת.
- שמור שם, שם משפחה, טלפון, כתובת, עיר והערות משלוח.
- הצג loading, success, error ו-try again.
- ודא מובייל ו-RTL.

Acceptance criteria:
- לקוח חדש נשמר ומופיע ברשימה.
- עריכת לקוח קיימת נשמרת אחרי refresh.
- כשל שמירה משאיר את המצב הקודם.
- הודעות שגיאה בעברית ברורות.
- build/tests רלוונטיים עוברים.
```

### Prompt: Customer Detail

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
לבנות פרופיל לקוח לבעל העסק.

הקשר עסקי:
מסך הלקוח הוא מרכז התמונה על לקוח אחד: פרטי קשר, כתובת, הערות משלוח, הזמנות
קשורות, מחירים קשורים, קישורי חשבוניות, איפוס סיסמה ומדדי ערך. הוא לא מחליף
את מסכי הזמנות ותשלומים.

דרישות:
- קרא קודם את הקוד הקיים.
- הצג פרטי לקוח מלאים.
- הצג סיכום הזמנות קשורות.
- הצג סיכום מחירים אישיים קשורים.
- הצג קישורי חשבוניות.
- הצג סך רכישות, מספר הזמנות, ממוצע להזמנה ותאריך הזמנה אחרונה.
- הוסף פעולה "צור הזמנה ידנית" עם לקוח נבחר.
- הוסף גם modal מהיר להזמנה מתוך הלקוח.
- הוסף פעולה "הוסף מחיר אישי" עם לקוח נבחר.
- אל תחשב לוגיקת סכומים מחדש במסך הלקוח.

Acceptance criteria:
- פתיחת לקוח מציגה פרופיל ברור.
- הזמנות ומחירים מוצגים כסיכומים.
- פעולות מהירות מעבירות למסך הנכון עם customer preselected.
- modal הזמנה מהיר עובד מתוך פרופיל הלקוח.
- אין overflow במובייל.
- build/tests רלוונטיים עוברים.
```

## 7. Recommended Implementation Order

1. Existing Screen Audit
2. Customer Data Model
3. Customer List
4. Customer Create/Edit
5. Customer Detail
6. Workflow Links
7. Password Reset
8. Customer Invoices
9. Customer Metrics
10. Mobile and Hebrew QA

Do not move to the next branch until the current branch has acceptance criteria,
implementation, relevant checks, and review.

## 8. Open Questions For Noam / Owner

- No open product questions for the current customer-screen checklist.

## 9. Bottom Line

Do not implement "a big customer screen".

Implement small, reviewable units:

```text
customer model -> list -> create/edit -> detail -> workflow links -> password reset -> invoices -> metrics -> mobile QA
```

Each unit must have business rules, acceptance criteria, tests/checks, and its
own branch.
