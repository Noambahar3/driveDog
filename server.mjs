import { createServer } from "node:http";
import { randomBytes, scryptSync } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const distDir = join(root, "dist");
const dataDir = join(root, "data");
const dbPath = process.env.DRIVE_DOG_DB_PATH || join(dataDir, "drive-dog-db.json");
const port = Number(process.env.PORT ?? 5180);

const routes = new Map([
  ["/", "admin.html"],
  ["/admin", "admin.html"],
  ["/admin.html", "admin.html"],
  ["/proposal", "proposal.html"],
  ["/proposal.html", "proposal.html"],
  ["/questionnaire", "index.html"],
  ["/questionnaire.html", "index.html"],
  ["/customer-screen-checklist", "customer-screen-checklist.html"],
  ["/customer-screen-checklist.html", "customer-screen-checklist.html"]
]);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png"
};

const demoCustomers = [
  {
    id: "c1",
    firstName: "עמי",
    lastName: "כהן",
    phone: "050-1111111",
    address: "הכלנית 12",
    city: "ראשון לציון",
    deliveryNotes: "להתקשר לפני הגעה",
    passwordHash: "",
    passwordSalt: "",
    mustChangePassword: false,
    deletedAt: null,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z"
  },
  {
    id: "c2",
    firstName: "דנה",
    lastName: "לוי",
    phone: "052-2222222",
    address: "הגפן 8",
    city: "רחובות",
    deliveryNotes: "להשאיר ליד הדלת",
    passwordHash: "",
    passwordSalt: "",
    mustChangePassword: false,
    deletedAt: null,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z"
  },
  {
    id: "c3",
    firstName: "יוסי",
    lastName: "מזרחי",
    phone: "054-3333333",
    address: "העצמאות 40",
    city: "אשדוד",
    deliveryNotes: "כלב גדול בחצר",
    passwordHash: "",
    passwordSalt: "",
    mustChangePassword: false,
    deletedAt: null,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z"
  }
];

function send(res, status, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function sendJson(res, status, body) {
  send(res, status, JSON.stringify(body), "application/json; charset=utf-8");
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Invalid JSON body");
    error.status = 400;
    throw error;
  }
}

async function readDb() {
  try {
    return JSON.parse(await readFile(dbPath, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    const initial = { customers: demoCustomers };
    await writeDb(initial);
    return initial;
  }
}

async function writeDb(db) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dbPath, `${JSON.stringify(db, null, 2)}\n`);
}

function publicCustomer(customer) {
  const { passwordHash, passwordSalt, ...safeCustomer } = customer;
  return safeCustomer;
}

function normalizePhone(phone) {
  return String(phone ?? "").replace(/[^\d+]/g, "");
}

function splitLegacyName(name) {
  const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" ")
  };
}

function normalizeCustomerInput(input, existing = {}) {
  const legacy = splitLegacyName(input.name);
  return {
    firstName: String(input.firstName ?? legacy.firstName ?? existing.firstName ?? "").trim(),
    lastName: String(input.lastName ?? legacy.lastName ?? existing.lastName ?? "").trim(),
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

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return {
    passwordSalt: salt,
    passwordHash: scryptSync(password, salt, 64).toString("hex")
  };
}

function createId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(3).toString("hex")}`;
}

async function handleCustomerApi(req, res, url) {
  const db = await readDb();
  const match = url.pathname.match(/^\/api\/customers(?:\/([^/]+))?(?:\/([^/]+))?$/);
  if (!match) return false;

  const [, customerId, action] = match;

  if (req.method === "GET" && !customerId) {
    const includeDeleted = url.searchParams.get("includeDeleted") === "true";
    const customers = db.customers
      .filter((customer) => includeDeleted || !customer.deletedAt)
      .map(publicCustomer);
    sendJson(res, 200, { customers });
    return true;
  }

  if (req.method === "GET" && customerId === "deleted" && !action) {
    sendJson(res, 200, { customers: db.customers.filter((customer) => customer.deletedAt).map(publicCustomer) });
    return true;
  }

  if (req.method === "POST" && !customerId) {
    const input = normalizeCustomerInput(await readJsonBody(req));
    const validationError = validateCustomerInput(input);
    if (validationError) {
      sendJson(res, 400, { error: validationError });
      return true;
    }
    if (!ensureUniquePhone(db.customers, input.phone)) {
      sendJson(res, 409, { error: "כבר קיים לקוח עם הטלפון הזה" });
      return true;
    }
    const now = new Date().toISOString();
    const customer = {
      id: createId("c"),
      ...input,
      passwordHash: "",
      passwordSalt: "",
      mustChangePassword: false,
      deletedAt: null,
      createdAt: now,
      updatedAt: now
    };
    db.customers.push(customer);
    await writeDb(db);
    sendJson(res, 201, { customer: publicCustomer(customer) });
    return true;
  }

  const customer = db.customers.find((item) => item.id === customerId);
  if (!customer) {
    sendJson(res, 404, { error: "לקוח לא נמצא" });
    return true;
  }

  if (req.method === "PATCH" && customerId && !action) {
    const input = normalizeCustomerInput(await readJsonBody(req), customer);
    const validationError = validateCustomerInput(input);
    if (validationError) {
      sendJson(res, 400, { error: validationError });
      return true;
    }
    if (!ensureUniquePhone(db.customers, input.phone, customer.id)) {
      sendJson(res, 409, { error: "כבר קיים לקוח עם הטלפון הזה" });
      return true;
    }
    Object.assign(customer, input, { updatedAt: new Date().toISOString() });
    await writeDb(db);
    sendJson(res, 200, { customer: publicCustomer(customer) });
    return true;
  }

  if (req.method === "DELETE" && customerId && !action) {
    customer.deletedAt = customer.deletedAt ?? new Date().toISOString();
    customer.updatedAt = new Date().toISOString();
    await writeDb(db);
    sendJson(res, 200, { customer: publicCustomer(customer) });
    return true;
  }

  if (req.method === "POST" && customerId && action === "reset-password") {
    Object.assign(customer, hashPassword("123456"), {
      mustChangePassword: true,
      updatedAt: new Date().toISOString()
    });
    await writeDb(db);
    sendJson(res, 200, { customer: publicCustomer(customer) });
    return true;
  }

  sendJson(res, 405, { error: "פעולה לא נתמכת" });
  return true;
}

function fileFor(url) {
  const routeFile = routes.get(url.pathname);
  if (routeFile) return join(distDir, routeFile);

  const cleanPath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  return join(distDir, cleanPath);
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    if (await handleCustomerApi(req, res, url)) return;
    const filePath = fileFor(url);
    const body = await readFile(filePath);
    send(res, 200, body, mimeTypes[extname(filePath)] ?? "application/octet-stream");
  } catch (error) {
    if (error.status) {
      sendJson(res, error.status, { error: error.message });
      return;
    }
    if (error.code === "ENOENT") {
      send(res, 404, "Not found");
      return;
    }
    sendJson(res, 500, { error: "שגיאת שרת" });
  }
}).listen(port, "0.0.0.0", () => {
  console.log(`Drive Dog listening on http://0.0.0.0:${port}`);
});
