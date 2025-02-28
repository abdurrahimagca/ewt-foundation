import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
const GLOBAL_ROUTE = new Hono();

GLOBAL_ROUTE.get("/ping", (c) => {
  return c.json({
    message: "pong",
  });
});
GLOBAL_ROUTE.get("/page/ping", (c) => {
  return c.json({
    message: "pong",
  });
});

GLOBAL_ROUTE.use(
  "/frontend/*",
  serveStatic({
    root: "html",
    rewriteRequestPath: (path) => path.replace(/^\/public\/frontend/, ""),
  })
);

export default GLOBAL_ROUTE;
