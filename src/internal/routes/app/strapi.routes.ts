import { Hono } from "hono";
import {
  strapiCreateContent,
  strapiFindContent,
} from "../../services/strapi.service.js";
import { StrapiRequestBody } from "../../types/strapi.js";

const STRAPI = new Hono();

STRAPI.post("/product-content/create", async (c) => {
  try {
    const body = await c.req.json();
    const validatedBody = StrapiRequestBody.parse(body);

    const response = await strapiCreateContent(validatedBody);

    if (!response.success || response.error) {
      console.log("error", response.error);
      return c.json(
        {
          status: 500,
          timestamp: new Date().toISOString(),
          error: "Failed to create product content",
          details: {
            error: [response.error || "Unknown error"],
          },
        },
        500,
      );
    }

    return c.json({
      status: 200,
      timestamp: new Date().toISOString(),
      message: "Product content created successfully",
      data: response.data,
    });
  } catch (error) {
    return c.json(
      {
        status: 400,
        timestamp: new Date().toISOString(),
        error: "Invalid request body",
        details: {
          error: [error instanceof Error ? error.message : "Unknown error"],
        },
      },
      400,
    );
  }
});

STRAPI.post("/product-content/find", async (c) => {
  try {
    const body = await c.req.json();
    const validatedBody = StrapiRequestBody.parse(body);

    const response = await strapiFindContent(validatedBody);

    if (!response.success || response.error) {
      return c.json(
        {
          status: 500,
          timestamp: new Date().toISOString(),
          error: "Failed to find product content",
          details: {
            error: [response.error || "Unknown error"],
          },
        },
        500,
      );
    }

    if (!response.data) {
      return c.json(
        {
          status: 404,
          timestamp: new Date().toISOString(),
          error: "Product content not found",
        },
        404,
      );
    }

    return c.json({
      status: 200,
      timestamp: new Date().toISOString(),
      message: "Product content found successfully",
      data: response.data,
    });
  } catch (error) {
    return c.json(
      {
        status: 400,
        timestamp: new Date().toISOString(),
        error: "Invalid request body",
        details: {
          error: [error instanceof Error ? error.message : "Unknown error"],
        },
      },
      400,
    );
  }
});

export default STRAPI;
