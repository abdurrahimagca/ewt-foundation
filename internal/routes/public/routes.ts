import { Hono } from "hono";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GLOBAL_ROUTE = new Hono();

GLOBAL_ROUTE.get("/ping", (c) => {
  return c.json({
    message: "pong",
  });
});

GLOBAL_ROUTE.get("/index", async (c) => {
  const html = fs.readFileSync(
    join(__dirname, "../../../views/main/index.html"),
  );
  if (!html) {
    return c.html("<h1>404</h1>", 404);
  }
  return c.html(html.toString());
});


export default GLOBAL_ROUTE;
