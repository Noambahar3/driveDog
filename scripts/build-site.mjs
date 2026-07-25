import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const questionnaireHtml = readFileSync('questionnaire.html', 'utf8');
const proposalHtml = readFileSync('proposal.html', 'utf8');
const adminHtml = readFileSync('admin.html', 'utf8');
const customerScreenChecklistHtml = readFileSync('customer-screen-checklist.html', 'utf8');
const driveDogLogo = readFileSync('assets/drive-dog-logo.jpg').toString('base64');
const demoApiCustomers = [
  { id: 'c1', firstName: 'עמי', lastName: 'כהן', phone: '050-1111111', address: 'הכלנית 12', city: 'ראשון לציון', deliveryNotes: 'להתקשר לפני הגעה', mustChangePassword: false, deletedAt: null, createdAt: '2026-07-22T00:00:00.000Z', updatedAt: '2026-07-22T00:00:00.000Z' },
  { id: 'c2', firstName: 'דנה', lastName: 'לוי', phone: '052-2222222', address: 'הגפן 8', city: 'רחובות', deliveryNotes: 'להשאיר ליד הדלת', mustChangePassword: false, deletedAt: null, createdAt: '2026-07-22T00:00:00.000Z', updatedAt: '2026-07-22T00:00:00.000Z' },
  { id: 'c3', firstName: 'יוסי', lastName: 'מזרחי', phone: '054-3333333', address: 'העצמאות 40', city: 'אשדוד', deliveryNotes: 'כלב גדול בחצר', mustChangePassword: false, deletedAt: null, createdAt: '2026-07-22T00:00:00.000Z', updatedAt: '2026-07-22T00:00:00.000Z' }
];

const worker = `const questionnaireHtml = ${JSON.stringify(questionnaireHtml)};
const proposalHtml = ${JSON.stringify(proposalHtml)};
const adminHtml = ${JSON.stringify(adminHtml)};
const customerScreenChecklistHtml = ${JSON.stringify(customerScreenChecklistHtml)};
const demoApiCustomers = ${JSON.stringify(demoApiCustomers)};
const driveDogLogo = ${JSON.stringify(driveDogLogo)};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function binaryFromBase64(base64) {
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) bytes[index] = raw.charCodeAt(index);
  return bytes;
}

function normalizePhone(phone) {
  return String(phone ?? "").replace(/[^\\d+]/g, "");
}

function normalizeCustomerInput(input, existing = {}) {
  return {
    firstName: String(input.firstName ?? existing.firstName ?? "").trim(),
    lastName: String(input.lastName ?? existing.lastName ?? "").trim(),
    phone: String(input.phone ?? existing.phone ?? "").trim(),
    address: String(input.address ?? existing.address ?? "").trim(),
    city: String(input.city ?? existing.city ?? "").trim(),
    deliveryNotes: String(input.deliveryNotes ?? existing.deliveryNotes ?? "").trim()
  };
}

function validateCustomerInput(input) {
  if (!input.firstName) return "נדרש שם";
  if (!input.lastName) return "נדרש שם משפחה";
  if (!input.phone) return "נדרש טלפון";
  return null;
}

function ensureUniquePhone(customers, phone, customerId) {
  const normalized = normalizePhone(phone);
  return !customers.some((customer) => customer.id !== customerId && normalizePhone(customer.phone) === normalized);
}

async function handleCustomerApi(request, url) {
  const match = url.pathname.match(/^\\/api\\/customers(?:\\/([^/]+))?(?:\\/([^/]+))?$/);
  if (!match) return null;
  const [, customerId, action] = match;
  if (request.method === "GET" && !customerId) {
    return json({ customers: demoApiCustomers.filter((customer) => !customer.deletedAt) });
  }
  if (request.method === "GET" && customerId === "deleted" && !action) {
    return json({ customers: demoApiCustomers.filter((customer) => customer.deletedAt) });
  }
  if (request.method === "POST" && !customerId) {
    const input = normalizeCustomerInput(await request.json());
    const validationError = validateCustomerInput(input);
    if (validationError) return json({ error: validationError }, 400);
    if (!ensureUniquePhone(demoApiCustomers, input.phone)) return json({ error: "כבר קיים לקוח עם הטלפון הזה" }, 409);
    const now = new Date().toISOString();
    const customer = { id: "c_" + Date.now().toString(36), ...input, mustChangePassword: false, deletedAt: null, createdAt: now, updatedAt: now };
    demoApiCustomers.push(customer);
    return json({ customer }, 201);
  }
  const customer = demoApiCustomers.find((item) => item.id === customerId);
  if (!customer) return json({ error: "לקוח לא נמצא" }, 404);
  if (request.method === "PATCH" && !action) {
    const input = normalizeCustomerInput(await request.json(), customer);
    const validationError = validateCustomerInput(input);
    if (validationError) return json({ error: validationError }, 400);
    if (!ensureUniquePhone(demoApiCustomers, input.phone, customer.id)) return json({ error: "כבר קיים לקוח עם הטלפון הזה" }, 409);
    Object.assign(customer, input, { updatedAt: new Date().toISOString() });
    return json({ customer });
  }
  if (request.method === "DELETE" && !action) {
    Object.assign(customer, { deletedAt: customer.deletedAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
    return json({ customer });
  }
  if (request.method === "POST" && action === "reset-password") {
    Object.assign(customer, { mustChangePassword: true, updatedAt: new Date().toISOString() });
    return json({ customer });
  }
  return json({ error: "פעולה לא נתמכת" }, 405);
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const apiResponse = await handleCustomerApi(request, url);
    if (apiResponse) return apiResponse;
    if (url.pathname === "/assets/drive-dog-logo.jpg") {
      return new Response(binaryFromBase64(driveDogLogo), {
        headers: {
          "content-type": "image/jpeg",
          "cache-control": "no-store"
        }
      });
    }
    const html = url.pathname === "/" || url.pathname.startsWith("/admin")
      ? adminHtml
      : url.pathname.startsWith("/proposal")
        ? proposalHtml
        : url.pathname.startsWith("/questionnaire")
          ? questionnaireHtml
          : url.pathname.startsWith("/customer-screen-checklist")
            ? customerScreenChecklistHtml
            : adminHtml;

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }
};
`;

mkdirSync('dist/server', { recursive: true });
mkdirSync('dist/.openai', { recursive: true });
mkdirSync('dist/assets', { recursive: true });
writeFileSync('dist/server/index.js', worker);
writeFileSync('dist/index.html', questionnaireHtml);
writeFileSync('dist/proposal.html', proposalHtml);
writeFileSync('dist/admin.html', adminHtml);
writeFileSync('dist/customer-screen-checklist.html', customerScreenChecklistHtml);
copyFileSync('assets/drive-dog-logo.jpg', 'dist/assets/drive-dog-logo.jpg');
copyFileSync('.openai/hosting.json', 'dist/.openai/hosting.json');
