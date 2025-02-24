import { Hono } from "hono";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from "path";
import { AppServer } from "@shopware-ag/app-server-sdk";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const global = new Hono();

global.get("/ping", (c) => {
  return c.json({
    message: "pong",
  });
});

global.get("/index", async (c) => {
  const html = fs.readFileSync(join(__dirname, "../../../views/main/index.html"));
  if (!html) {
    return c.html("<h1>404</h1>", 404);
  }
  return c.html(html.toString());
});


export default global;
