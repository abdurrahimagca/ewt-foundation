import { Hono } from "hono";
import { logger } from "hono/logger";
import GLOBAL_ROUTE from "./internal/routes/public/routes.ts";
import { serve } from "@hono/node-server";
import SHOPWARE_ROUTE from "./internal/routes/app/shopware.routes.ts";
const app = new Hono();

app.use(logger());
app.route("/app/ewt-foundation", SHOPWARE_ROUTE);
app.route("/public/ewt-foundation", GLOBAL_ROUTE);

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
