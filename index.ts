import { Hono } from "hono";
import { logger } from "hono/logger";
import GLOBAL_ROUTE from "./internal/routes/public/routes.ts";
import { serve } from "@hono/node-server";
import SHOPWARE_ROUTE from "./internal/routes/app/shopware.routes.ts";
import { cors } from "hono/cors";

const app = new Hono();
app.use(logger());
app.use("*", cors());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "shopware-app-shop-id",
      "shopware-app-token",
      "X-Forwarded-For",
      "X-Forwarded-Proto",
      "X-Forwarded-Port",
    ],
  }),
);
app.route("/", SHOPWARE_ROUTE);
app.route("/public/ewt-foundation", GLOBAL_ROUTE);

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
