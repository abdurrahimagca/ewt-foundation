import { Hono } from "hono";

const global = new Hono();

global.get("/ping", (c) => {
  return c.json({
    message: "pong",
  });
});

export default global;
