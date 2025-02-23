import { Hono } from "hono";
import { logger } from "hono/logger";
import shopware from "./internal/routes/app/main.routes.ts";
import appPublic from "./internal/routes/public/routes.ts";
import { serve } from "@hono/node-server";
const app = new Hono();

app.use(logger());
app.route("/", shopware);
app.route("public/ewt-foundation", appPublic);

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
