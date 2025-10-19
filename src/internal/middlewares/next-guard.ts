import { Next } from "hono";
import { verify } from "hono/jwt";
import { Context } from "hono";

export const nextGuard = async (c: Context, next: Next) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        return c.json({ error: "JWT_SECRET is not set" }, 500);
    }
    const token = c.req.header("X-Requester-Token");
    if (!token) {
        return c.json({ error: "Token is required" }, 401);
    }
    const decoded = await verify(token, JWT_SECRET);

    if (!decoded) {
        return c.json({ error: "Invalid token" }, 401);
    }
    const requester = decoded.requester;
    const allowedRequesters = process.env.ALLOWED_REQUESTERS?.split(",") || [];
    if (!allowedRequesters.includes(requester as string)) {
        return c.json({ error: "You are not authorized to access this resource with this requester" }, 403);
    }

    await next();
}