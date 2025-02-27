import { ZodSchema, ZodError } from "zod";
import { Context, Next } from "hono";

export const validatorMw = (schema: ZodSchema) => {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const parsedData = schema.parse(body);

      c.set("parsedData", parsedData);
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        return c.json(
          {
            message: "Validation Error",
            errors: error.errors.map((err) => ({
              path: err.path,
              message: err.message,
            })),
          },
          400,
        );
      }
      return c.json(
        {
          message: "Internal Server Error",
        },
        500,
      );
    }
  };
};
