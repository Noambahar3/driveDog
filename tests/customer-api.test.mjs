import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const tempDir = await mkdtemp(join(tmpdir(), "drive-dog-customers-"));
const dbPath = join(tempDir, "db.json");
const port = 5299;
const baseUrl = `http://127.0.0.1:${port}`;

const server = spawn(process.execPath, ["server.mjs"], {
  cwd: new URL("..", import.meta.url),
  env: { ...process.env, PORT: String(port), DRIVE_DOG_DB_PATH: dbPath },
  stdio: ["ignore", "pipe", "pipe"]
});

async function waitForServer() {
  const started = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("server did not start")), 5000);
    server.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("Drive Dog listening")) {
        clearTimeout(timeout);
        resolve();
      }
    });
    server.stderr.on("data", (chunk) => reject(new Error(chunk.toString())));
  });
  await started;
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {})
    }
  });
  const body = await response.json();
  return { response, body };
}

try {
  await waitForServer();

  const initial = await request("/api/customers");
  assert.equal(initial.response.status, 200);
  assert.equal(initial.body.customers.length, 3);

  const created = await request("/api/customers", {
    method: "POST",
    body: JSON.stringify({
      firstName: "נועה",
      lastName: "ישראלי",
      phone: "050-9999999",
      address: "הרצל 10",
      city: "נתיבות",
      deliveryNotes: "לתאם מראש"
    })
  });
  assert.equal(created.response.status, 201);
  assert.equal(created.body.customer.firstName, "נועה");
  assert.equal(created.body.customer.lastName, "ישראלי");

  const refreshed = await request("/api/customers");
  assert.equal(refreshed.response.status, 200);
  assert.ok(refreshed.body.customers.some((customer) => customer.phone === "050-9999999"));

  const duplicate = await request("/api/customers", {
    method: "POST",
    body: JSON.stringify({
      firstName: "כפול",
      lastName: "טלפון",
      phone: "050-9999999",
      address: "בדיקה",
      city: "בדיקה"
    })
  });
  assert.equal(duplicate.response.status, 409);
  assert.match(duplicate.body.error, /טלפון/);

  const reset = await request(`/api/customers/${created.body.customer.id}/reset-password`, { method: "POST" });
  assert.equal(reset.response.status, 200);
  assert.equal(reset.body.customer.mustChangePassword, true);
  assert.equal(reset.body.customer.passwordHash, undefined);

  const deleted = await request(`/api/customers/${created.body.customer.id}`, { method: "DELETE" });
  assert.equal(deleted.response.status, 200);
  assert.ok(deleted.body.customer.deletedAt);

  const activeCustomers = await request("/api/customers");
  assert.ok(!activeCustomers.body.customers.some((customer) => customer.id === created.body.customer.id));

  const deletedCustomers = await request("/api/customers/deleted");
  assert.ok(deletedCustomers.body.customers.some((customer) => customer.id === created.body.customer.id));
} finally {
  server.kill("SIGTERM");
  await rm(tempDir, { recursive: true, force: true });
}
