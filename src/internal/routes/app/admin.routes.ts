import { Hono } from "hono";
import fs from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ADMIN_ROUTES = new Hono();
ADMIN_ROUTES.get("/index", async (c) => {
  const html = fs.readFileSync(
    join(__dirname, "../../../views/main/index.html"),
  );
  if (!html) {
    return c.html("<h1>404</h1>", 404);
  }
  return c.html(html.toString());
});
export default ADMIN_ROUTES;
