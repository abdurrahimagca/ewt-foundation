import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ADMIN_ROUTES = new Hono();

// Tüm Klasörü Statik Olarak Sunma
ADMIN_ROUTES.use(
  "/assets/*",
  serveStatic({ root: join(__dirname, "../../../frontend/dist/assets") }),
);

// Query Parametreleri ile Gelen İstekleri index.html'ye Yönlendirme
ADMIN_ROUTES.get("/*", (c) => {
  const htmlPath = join(__dirname, "../../../frontend/dist/index.html");

  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath);
    return c.html(html.toString());
  } else {
    return c.html("<h1>404 - Page Not Found</h1>", 404);
  }
});

export default ADMIN_ROUTES;
