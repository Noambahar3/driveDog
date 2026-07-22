# Drive Dog - בדיקת אינטגרציה משולם / Grow

תאריך בדיקה: 2026-07-22  
סטטוס: בדיקה על בסיס התיעוד הציבורי של Grow Developers, ללא גישת API של העסק

## מסקנה קצרה

האינטגרציה המרכזית ל-MVP נראית ישימה:

- יצירת קישור תשלום להזמנה דרך API קיימת.
- Grow מחזירה URL לתשלום, וגם מזהי process לשמירה פנימית.
- Grow שולחת callback / webhook לשרת שלנו אחרי תשלום.
- אפשר לקבל callback נפרד כאשר חשבונית נוצרת, כולל מספר חשבונית וקישור חשבונית.
- התיעוד כולל Sandbox, אבל לא לכל אמצעי התשלום יש סביבת בדיקה.

הנקודה הלא סגורה: הפקת חשבונית מס מיידית עבור תשלום מזומן לשליח. בתיעוד הציבורי שמצאתי אין endpoint ברור שמייצר חשבונית עבור תשלום מזומן שלא עבר כעסקת Grow. זה דורש אישור ישיר מ-Grow / משולם או בדיקה בחשבון העסקי.

## מקורות רשמיים שנבדקו

- API Reference Introduction: https://developers.grow.business/reference/introduction
- Authentication: https://developers.grow.business/reference/authentication
- Create Payment Link: https://developers.grow.business/reference/create-payment-link
- Create Payment Link Response: https://developers.grow.business/reference/refund-overview-1
- Server-to-Server Callback for Payment Request: https://developers.grow.business/reference/payment-request-callback
- Invoice Server Response: https://developers.grow.business/reference/invoice-server-response
- Webhooks: https://developers.grow.business/docs/webhooks
- Testing Environment: https://developers.grow.business/reference/testing-environment
- Parameter Mapping: https://developers.grow.business/reference/parameter-mapping
- Get Payment Process Info: https://developers.grow.business/reference/get-payment-process-info

## מה Grow תומכת לפי התיעוד

### אמצעי תשלום

Grow מציינת תמיכה באמצעי תשלום כמו:

- כרטיסי אשראי
- bit
- PayBox
- Apple Pay
- Google Pay
- העברה בנקאית

ב-Create Payment Link קיימים פרמטרים להצגת סוגי תשלום שונים:

- `transactionType[0]` - Credit Card
- `transactionType[1]` - bit
- `transactionType[2]` - Apple Pay
- `transactionType[3]` - Google Pay
- `transactionType[4]` - bank transfer
- `transactionType[5]` - PayBox

עבור Drive Dog, ב-MVP מספיק להפעיל:

- אשראי
- bit, אם זמין בחשבון העסקי
- Google Pay / Apple Pay, אם זמין ורלוונטי

מזומן לשליח לא עובר דרך Grow כתשלום אונליין, אלא נשאר סטטוס פנימי במערכת.

### יצירת קישור תשלום

Endpoint בתיעוד:

`POST http://sandboxapi.grow.link/api/light/server/1.0/CreatePaymentLink`

הערות חשובות:

- נדרש `x-api-key` בכל בקשה.
- הבקשות חייבות לצאת מהשרת בלבד. לא מהדפדפן.
- צריך לקבל מ-Grow את המזהים של העסק: `userId`, `pageCode`, ובמידת הצורך `apiKey`.
- יש שדות חובה כמו כותרת, פרטי משלם, ומוצר/ים.
- אפשר להעביר מוצרים עם שם, מחיר, כמות, VAT, ועוד.
- אפשר להעביר עד 9 שדות custom דרך `cField1` וכו'. מומלץ לשמור שם מזהה הזמנה פנימי אם אין שדה ייעודי טוב יותר.
- קיימים `notifyUrl` ל-callback תשלום ו-`invoiceNotifyUrl` ל-callback חשבונית.

תגובה מוצלחת כוללת:

- `paymentLinkProcessId`
- `paymentLinkProcessToken`
- `url`

חשוב: לפי התיעוד אסור לחשוף ללקוח את processId/processToken. ללקוח מציגים או שולחים רק את ה-URL לתשלום.

### קבלת סטטוס תשלום

Grow שולחת Server-to-Server Callback ל-`notifyUrl` שהעברנו בבקשת יצירת הקישור.

ה-callback כולל נתונים כמו:

- סטטוס תשלום
- קוד סטטוס
- סכום
- תאריך תשלום
- מזהה עסקה
- שם משלם
- טלפון משלם
- אימייל
- סוג עסקה / אמצעי תשלום

לפי התיעוד, אחרי קבלת callback צריך לקרוא ל-`ApproveTransaction` כדי לאשר למערכת Grow שהעדכון נקלט. חשוב: העסקה עצמה עדיין מעובדת גם אם אישור הקליטה נכשל, לכן אצלנו צריך לשמור webhook בצורה idempotent ולדעת לטפל בכפילויות.

### קבלת פרטי חשבונית

Grow תומכת ב-Invoice Callback דרך `invoiceNotifyUrl`.

כאשר חשבונית נוצרת בהצלחה עבור עסקה, Grow יכולה לשלוח callback שמכיל:

- `transactionId`
- `processId`
- `invoiceNumber`
- `invoiceUrl`

זה מתאים ל-MVP:

1. התשלום מתבצע ב-Grow.
2. Grow מפיקה חשבונית מס לפי הגדרות העסק.
3. המערכת שומרת את מספר החשבונית והקישור.
4. בעל העסק יכול לראות את הקישור מתוך ההזמנה.

### בדיקות וסביבת Sandbox

Grow מפרידה בין Sandbox ל-Production.

נקודות חשובות:

- קיימת סביבת Sandbox בכתובת `https://sandbox.meshulam.co.il/api/light/server/1.0/`.
- לכל סביבה יש מזהים נפרדים, כמו `pageCode`, `userId`, ו-`apiKey`.
- Live credentials מתקבלים רק אחרי השלמת פיתוח ובדיקות מול Grow.
- לפי התיעוד, ל-bit, Google Pay ו-Apple Pay אין סביבת בדיקה ייעודית; עסקאות באמצעים האלה הן Live ועלולות לחייב בפועל.
- PayBox לא ניתן להשלמה ב-Sandbox.

לכן בדיקות MVP צריכות להתחיל באשראי Sandbox בלבד.

## מימוש מומלץ ל-Drive Dog

### תשלום אונליין

זרימה מוצעת:

1. הלקוח מאשר הזמנה במערכת.
2. המערכת יוצרת `Order` בסטטוס `pending_payment`.
3. השרת קורא ל-Create Payment Link.
4. המערכת שומרת:
   - `paymentLinkProcessId`
   - `paymentLinkProcessToken`
   - `payment_url`
   - `order_id`
   - סכום צפוי
5. הלקוח מועבר ל-`payment_url`.
6. Grow שולחת callback ל-`notifyUrl`.
7. המערכת מאמתת שהסכום וההזמנה תואמים.
8. המערכת מסמנת את ההזמנה כ-`paid_online`.
9. המערכת קוראת ל-`ApproveTransaction`.
10. Grow שולחת callback חשבונית ל-`invoiceNotifyUrl`, אם הוגדר.
11. המערכת שומרת `invoiceNumber` ו-`invoiceUrl`.

### הזמנה ידנית

זרימה מוצעת:

1. בעל העסק פותח הזמנה ידנית.
2. המערכת יוצרת קישור תשלום דרך Grow.
3. בעל העסק מעתיק את ה-URL ושולח ללקוח.
4. שאר הזרימה זהה להזמנה שהלקוח פתח לבד.

### מזומן לשליח

זרימה זמנית ל-MVP:

1. הלקוח או בעל העסק בוחרים "מזומן לשליח".
2. ההזמנה נכנסת בסטטוס `cash_on_delivery`.
3. בעל העסק מסמן `paid_cash` לאחר קבלת מזומן.
4. הפקת החשבונית נשארת נקודת בדיקה:
   - אם Grow מאפשרת הפקת מסמך על מזומן דרך API, נחבר את זה.
   - אם לא, בעל העסק יצטרך להפיק ידנית בממשק Grow או להשתמש בספק חשבוניות אחר.

## פרטים שצריך לקבל מ-Grow / משולם

לפני פיתוח אמיתי צריך לבקש:

- פתיחת גישת API לעסק.
- `userId` ל-Sandbox.
- `pageCode` ל-Sandbox עבור אמצעי התשלום הרצויים.
- `x-api-key` אם נדרש למסלול העסק.
- הרשאת webhook.
- הגדרת `notifyUrl`.
- הגדרת `invoiceNotifyUrl`.
- אישור אילו אמצעי תשלום זמינים בחשבון העסקי.
- אישור האם חשבונית מס קבלה מופקת אוטומטית אחרי תשלום.
- תשובה מפורשת: האם אפשר להפיק חשבונית/קבלה דרך API עבור מזומן לשליח.

## החלטות טכניות ל-MVP

- כל קריאות Grow יעברו דרך backend בלבד.
- לא שומרים פרטי אשראי.
- שומרים מזהי Grow פנימיים, אבל לא מציגים ללקוח process token.
- כל webhook נשמר לפני עיבוד, כדי לא לאבד אירועים.
- עיבוד webhook חייב להיות idempotent.
- הזמנה לא תיכנס למשלוחים כ"שולמה" עד callback תקין או סימון מזומן ידני.
- נתחיל בבדיקות Sandbox עם אשראי בלבד.

## סיכונים

- חשבונית על מזומן לשליח לא מובטחת דרך API לפי התיעוד הציבורי.
- bit / Apple Pay / Google Pay לא ניתנים לבדיקה אמיתית ב-Sandbox לפי התיעוד.
- נדרש אישור/הפעלה מצד Grow ל-webhooks.
- צריך להיזהר ממגבלת "special characters" בפרמטרים, במיוחד בעברית והערות הזמנה. נדרש test מוקדם עם עברית.
- אם לא ניתן להעביר מזהה הזמנה חיצוני בצורה נקייה, נשתמש ב-`cField1` ונבדוק שהוא חוזר ב-webhook.

## המלצה

להמשיך עם Grow כפתרון תשלומים ל-MVP, אבל לסמן את "מזומן לשליח + חשבונית במקום" כסיכון פתוח עד שמקבלים תשובה רשמית מ-Grow.

אם Grow לא תומכת במסמך מזומן דרך API, אפשרויות fallback:

1. בעל העסק מפיק ידנית בממשק Grow.
2. מחברים ספק חשבוניות נוסף שתומך API להפקת מסמך על מזומן.
3. מאפשרים מזומן רק כחריג תפעולי, עם תזכורת "להפיק חשבונית ידנית".

