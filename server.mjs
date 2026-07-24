import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const distDir = join(root, "dist");
const port = Number(process.env.PORT ?? 5180);

const routes = new Map([
  ["/", "admin.html"],
  ["/admin", "admin.html"],
  ["/admin.html", "admin.html"],
  ["/proposal", "proposal.html"],
  ["/proposal.html", "proposal.html"],
  ["/questionnaire", "index.html"],
  ["/questionnaire.html", "index.html"]
]);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function send(res, status, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  res.end(body);
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
    const filePath = fileFor(url);
    const body = await readFile(filePath);
    send(res, 200, body, mimeTypes[extname(filePath)] ?? "application/octet-stream");
  } catch {
    send(res, 404, "Not found");
  }
}).listen(port, "0.0.0.0", () => {
  console.log(`Drive Dog listening on http://0.0.0.0:${port}`);
});
