const http = require("http");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const positional = args.filter((value, index) => !value.startsWith("--") && !args[index - 1]?.startsWith("--"));
const root = path.resolve(option("--root") || positional[0] || path.join(__dirname, "..", "site"));
const port = Number(option("--port") || positional[1] || 4205);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function send(res, status, content, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(content);
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath.endsWith("/")) urlPath += "index.html";

  const safePath = path.normalize(path.join(root, urlPath));
  if (!safePath.startsWith(path.normalize(root))) {
    return send(res, 403, "Forbidden");
  }

  fs.readFile(safePath, (err, data) => {
    if (err) return send(res, 404, "Not found");
    const ext = path.extname(safePath).toLowerCase();
    return send(res, 200, data, mime[ext] || "application/octet-stream");
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`YC Systems preview running at http://127.0.0.1:${port}/`);
});
