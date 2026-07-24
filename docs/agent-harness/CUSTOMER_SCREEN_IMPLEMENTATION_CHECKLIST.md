# Drive Dog Customer Screen Implementation Checklist

Status: ready for implementation planning  
Created: 2026-07-24  
Source: `CUSTOMER_SCREEN_WORKPLAN.md`

## Decisions Locked For This Checklist

- Users: owner and employees.
- Customer exists once owner creates it.
- Phone is unique per customer.
- Required customer fields: first name, last name, phone, address, city,
  delivery notes.
- Active/inactive has no business meaning right now.
- Customer deletion is allowed, but deleted customers are kept on a separate
  deleted-customers page/archive.
- Password reset sets temporary password `123456`; customer must change it on
  next login.
- Invoice data: link, invoice number, date, amount, payment status.
- Invoice source is expected to be Meshulam / Grow later; exact integration is
  deferred.
- Customer metrics: total purchases, number of orders, average order value,
  last order date.
- Do not show common/frequent products in this scope.
- Creating an order from customer screen supports both full order screen and
  quick modal.
- Delivery notes do not transfer automatically into new orders.
- Address edits update the customer's orders accordingly.
- Every employee can edit, delete, and reset customer password.
- Customer history / audit timeline is not required.
- Screen must be responsive and comfortable on phone from the first
  implementation.
- No Excel/CSV import in this scope; create demo customers for testing.

## 1. Current Screen Audit

Section: Existing Screen Audit  
Branch: `docs/customer-screen-audit`  
Status: pending

Acceptance:

- Current static customer behavior is documented.
- Current list columns, form fields, and actions are documented.
- Demo-only `localStorage` behavior is documented.
- Gaps to backend / DB implementation are listed.
- No product behavior is changed.

Prompt:

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
לתעד את ההתנהגות הקיימת של מסך הלקוחות לפני מימוש אמיתי.

דרישות:
- קרא את PRD.md, SPEC.md, FIRST_IMPLEMENTATION_SLICE.md,
  CUSTOMER_SCREEN_WORKPLAN.md ואת admin.html.
- תעד שדות, פעולות, localStorage, וחוסרים למימוש אמיתי.
- אל תשנה קוד מוצר.

Acceptance criteria:
- יש מסמך audit קצר.
- localStorage מסומן כדמו בלבד.
- אין שינוי באפליקציה.
```

## 2. Customer Data Model

Section: Customer Data Model  
Branch: `feat/customer-screen-data-model`  
Status: pending

Acceptance:

- Customer records persist in backend / DB.
- Hard refresh does not lose customer changes.
- Fields exist for first name, last name, phone, address, city, delivery notes,
  password hash/setup state, must-change-password, deleted status/timestamp.
- Phone uniqueness is enforced.
- Deleted customers are retained for deleted-customers page/archive.
- Demo customer records exist for tests.
- No Excel/CSV import is built in this scope.

Prompt:

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
לממש מודל לקוחות מתמיד בשרת / DB.

דרישות:
- אל תשתמש ב-localStorage כמקור אמת עסקי.
- תמוך בשדות: שם, שם משפחה, טלפון, כתובת, עיר, הערות משלוח.
- אכוף טלפון ייחודי.
- שמור לקוחות מחוקים לארכיון/דף נפרד.
- הכן לקוחות דמה לבדיקות.
- אל תממש ייבוא Excel/CSV.

Acceptance criteria:
- יצירה/עריכה נשמרות אחרי refresh.
- כפילות טלפון נחסמת.
- מחיקה לא מוחקת היסטוריה לגמרי אלא מעבירה לארכיון.
- build/tests רלוונטיים עוברים.
```

## 3. Customer List

Section: Customer List  
Branch: `feat/customer-screen-list`  
Status: pending

Acceptance:

- List loads from backend / DB.
- Table columns: full name, phone, city, last order date, number of orders,
  total purchases, actions.
- Search works by full name, address, phone, and city.
- Row actions include open/view, edit, delete.
- Deleted customers are not shown in the main list.
- Empty, loading, and error states exist.
- Mobile table/list is usable without horizontal overflow.

Prompt:

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
לבנות רשימת לקוחות מתמידה, מהירה ונוחה לסריקה.

דרישות:
- טען לקוחות מהשרת / DB.
- הצג שם מלא, טלפון, עיר, הזמנה אחרונה, מספר הזמנות, סך רכישות ופעולות.
- חיפוש לפי שם מלא, כתובת, טלפון ועיר.
- אל תציג לקוחות מחוקים ברשימה הראשית.
- תמוך במובייל.

Acceptance criteria:
- החיפוש עובד בכל השדות שאושרו.
- פעולות השורה זמינות.
- loading/empty/error קיימים.
- אין overflow במובייל.
```

## 4. Customer Create / Edit / Delete

Section: Customer Create/Edit/Delete  
Branch: `feat/customer-screen-edit-delete`  
Status: pending

Acceptance:

- Owner/employee can create customer.
- Owner/employee can edit first name, last name, phone, address, city, delivery
  notes.
- Required validation exists for first name, last name, and phone.
- Duplicate phone error is clear.
- Save failure does not show success or mutate state incorrectly.
- Delete requires confirmation.
- Delete moves customer to deleted-customers page/archive.
- Delete failure leaves customer visible.
- Address change updates the customer's orders accordingly.
- Delivery notes do not automatically copy into new orders.

Prompt:

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
לבנות flow אמין ליצירה, עריכה ומחיקת לקוח.

דרישות:
- ולידציה לשם, שם משפחה וטלפון.
- טלפון ייחודי.
- שמירת כתובת/עיר/הערות משלוח.
- שינוי כתובת מעדכן הזמנות של הלקוח בהתאם.
- הערות משלוח לא עוברות אוטומטית להזמנה חדשה.
- מחיקה דורשת אישור ומעבירה לדף לקוחות מחוקים.
- כשל לא מציג הצלחה מזויפת.

Acceptance criteria:
- create/edit/delete עובדים מול מקור אמת.
- מחיקה משאירה את הלקוח בארכיון.
- כשלי API מטופלים ברור.
- build/tests רלוונטיים עוברים.
```

## 5. Deleted Customers Page

Section: Deleted Customers  
Branch: `feat/customer-screen-deleted-customers`  
Status: pending

Acceptance:

- Separate page/view shows deleted customers.
- Deleted customer includes full name, phone, city, deleted date when available,
  and open/view action.
- Deleted customers do not appear in active customer selects by default.
- Restoring customer is not required unless explicitly added later.
- Mobile view is usable.

Prompt:

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
להציג לקוחות שנמחקו בדף/ארכיון נפרד.

דרישות:
- אל תמחק פיזית את הלקוח אם הוא נמחק מהמסך.
- הצג לקוחות מחוקים בדף נפרד.
- אל תציג אותם ברשימת לקוחות רגילה או בבחירת לקוח להזמנה.
- אל תממש restore אלא אם כבר קיימת תבנית מקומית ברורה.

Acceptance criteria:
- לקוח שנמחק עובר לדף לקוחות מחוקים.
- הרשימה הראשית נקייה מלקוחות מחוקים.
- המובייל תקין.
```

## 6. Customer Detail

Section: Customer Detail  
Branch: `feat/customer-screen-detail`  
Status: pending

Acceptance:

- Profile areas/tabs: details, orders, invoices, metrics, password reset.
- Details show full name, phone, address, city, delivery notes.
- Orders summary appears.
- Invoice list appears.
- Metrics appear.
- Password reset action appears.
- Full create-order action opens order screen with customer preselected.
- Quick order modal opens from profile.
- Empty states are clear.
- Mobile layout is comfortable.

Prompt:

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
לבנות פרופיל לקוח מלא לבעל העסק ולעובדים.

דרישות:
- אזורים: פרטים, הזמנות, חשבוניות, מדדים, איפוס סיסמה.
- הצג פרטי לקוח והערות משלוח.
- הצג הזמנות קשורות כסיכום.
- הצג חשבוניות.
- הצג מדדים.
- הוסף גם פתיחת מסך הזמנה מלא וגם modal הזמנה מהיר.

Acceptance criteria:
- פרופיל לקוח מלא וקריא.
- שני מסלולי יצירת הזמנה עובדים.
- אין overflow במובייל.
- build/tests רלוונטיים עוברים.
```

## 7. Order Creation From Customer

Section: Customer Order Links  
Branch: `feat/customer-screen-order-links`  
Status: pending

Acceptance:

- Full order screen path opens with customer preselected.
- Quick order modal can create a basic order from customer profile.
- Customer screen does not duplicate order total logic if order logic already
  exists elsewhere.
- Delivery notes do not transfer automatically.
- Errors are shown clearly.

Prompt:

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
לחבר יצירת הזמנה מתוך פרופיל לקוח בשני מסלולים: מסך מלא ו-modal מהיר.

דרישות:
- מסך הזמנה מלא נפתח עם customer preselected.
- modal מהיר נפתח מתוך פרופיל הלקוח.
- אל תכפיל לוגיקת סכומים אם קיימת לוגיקה במסך הזמנות.
- הערות משלוח לא עוברות אוטומטית להזמנה.
- כשל יצירה מציג שגיאה ולא הצלחה מזויפת.

Acceptance criteria:
- שני המסלולים עובדים.
- ההזמנה משויכת ללקוח הנכון.
- build/tests רלוונטיים עוברים.
```

## 8. Password Reset

Section: Password Reset  
Branch: `feat/customer-screen-password-reset`  
Status: pending

Acceptance:

- Reset action exists in customer profile.
- Every employee can use reset action.
- Reset sets temporary password `123456`.
- Customer must change password on next login.
- Password hash is updated; plain password is not stored.
- No password is displayed after reset.
- No external message/email/WhatsApp is sent in this scope.

Prompt:

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
להוסיף איפוס סיסמה בטוח ללקוח ששכח סיסמה.

דרישות:
- כפתור איפוס בפרופיל לקוח.
- כל עובד יכול לבצע איפוס.
- האיפוס מגדיר סיסמה זמנית 123456.
- הלקוח חייב לשנות סיסמה בכניסה הבאה.
- אל תשמור או תציג סיסמה plain text.
- אל תשלח הודעה חיצונית.

Acceptance criteria:
- reset מעדכן hash/setup state.
- must_change_password=true אחרי איפוס.
- אין חשיפה של סיסמה שמורה.
- build/tests רלוונטיים עוברים.
```

## 9. Customer Invoices

Section: Customer Invoices  
Branch: `feat/customer-screen-invoices`  
Status: pending

Acceptance:

- Customer profile shows invoices.
- Invoice fields: link, invoice number, date, amount, payment status.
- Meshulam / Grow is treated as future expected source.
- Exact provider integration is deferred.
- Customer screen does not issue official invoices.
- Empty state is clear.

Prompt:

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
להציג חשבוניות של לקוח בפרופיל.

דרישות:
- הצג קישור, מספר חשבונית, תאריך, סכום וסטטוס תשלום.
- הנח שמקור עתידי צפוי להיות Meshulam / Grow, אבל אל תממש אינטגרציה חיה עכשיו.
- אל תנפיק חשבוניות מתוך מסך הלקוח.
- הצג empty state ברור.

Acceptance criteria:
- חשבוניות מוצגות בפרופיל לקוח.
- הנתונים נשמרים במקור אמת.
- אין קריאות חיות ל-provider.
- build/tests רלוונטיים עוברים.
```

## 10. Customer Metrics

Section: Customer Metrics  
Branch: `feat/customer-screen-metrics`  
Status: pending

Acceptance:

- Profile shows total purchases.
- Profile shows number of orders.
- Profile shows average order value.
- Profile shows last order date.
- Metrics derive from persisted orders/payments.
- Common/frequent products are not shown.

Prompt:

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
להציג מדדי ערך לקוח בפרופיל וברשימה לפי הצורך.

דרישות:
- סך רכישות כולל.
- מספר הזמנות.
- ממוצע להזמנה.
- תאריך הזמנה אחרונה.
- אל תוסיף מוצרים קבועים/נפוצים.
- חשב את המדדים מנתוני הזמנות/תשלומים ולא משדה ידני.

Acceptance criteria:
- המדדים נכונים מול נתוני seed/test.
- אין חישוב כפול לא עקבי.
- build/tests רלוונטיים עוברים.
```

## 11. Responsive Mobile QA

Section: Mobile and Hebrew QA  
Branch: `fix/customer-screen-mobile-rtl`  
Status: pending

Acceptance:

- Customer list is comfortable on phone.
- Customer profile is comfortable on phone.
- Create/edit form is comfortable on phone.
- Quick order modal is comfortable on phone.
- Deleted customers page is comfortable on phone.
- Hebrew RTL layout is correct.
- Long names, addresses, invoice links, and notes do not overflow.
- Main actions remain reachable.

Prompt:

```text
אנחנו עובדים על customer-screen בפרויקט Drive Dog.

המטרה:
לוודא שמסך הלקוחות נוח ורספונסיבי בטלפון כבר בשלב הראשון.

דרישות:
- בדוק רשימה, פרופיל, טופס, modal הזמנה ודף לקוחות מחוקים במובייל.
- ודא RTL בעברית.
- ודא שאין overflow לטקסטים ארוכים.
- שמור פעולות מרכזיות נגישות.

Acceptance criteria:
- המסך נוח בטלפון.
- אין שבירת טקסט/כפתורים.
- build/tests רלוונטיים עוברים.
```

## Suggested Branch Order

1. `docs/customer-screen-audit`
2. `feat/customer-screen-data-model`
3. `feat/customer-screen-list`
4. `feat/customer-screen-edit-delete`
5. `feat/customer-screen-deleted-customers`
6. `feat/customer-screen-detail`
7. `feat/customer-screen-order-links`
8. `feat/customer-screen-password-reset`
9. `feat/customer-screen-invoices`
10. `feat/customer-screen-metrics`
11. `fix/customer-screen-mobile-rtl`
