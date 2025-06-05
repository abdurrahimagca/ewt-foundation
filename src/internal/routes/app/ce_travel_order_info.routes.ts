import { Hono } from "hono";
import { apiShopTransformMw } from "../../middlewares/storefront-api.js";

import {
  ceTravelOrderInfoInsertInformationSchema,
  ceTravelOrderInfoUpdateInformationSchema,
  searchTravelOrderInfoSchema,
} from "@/internal/types/new_ce_travel_order_info.js";
import CeTravelOrderInfoService from "../../services/ce_travel_order_info.service.js";
import { shopwareId } from "@/internal/types/ce_travel_product_bundle.js";
import {
  ApiResponse,
  ApiErrorResponse,
} from "@/internal/types/api-response.js";

const TRAVEL_ORDER_INFO = new Hono();

TRAVEL_ORDER_INFO.use("/*", apiShopTransformMw);

TRAVEL_ORDER_INFO.get("/travel-order-info", async (c) => {
  try {
    const shop = c.get("shop");
    const customerId = c.get("customerId");
    const orderId = c.req.query("orderId");
    if (!orderId) {
      const response: ApiErrorResponse = {
        status: 400,
        timestamp: new Date().toISOString(),
        error: "Invalid request body",
        details: { customerId: ["Customer ID is required"], orderId: ["Order ID is required"] },
      };
      return c.json(response, 400);
    }

    const data = await new CeTravelOrderInfoService(
      shop,
    ).getOrderTravelInfoService(customerId, orderId);

    if (!data || data.length === 0) {
      const response: ApiErrorResponse = {
        status: 404,
        timestamp: new Date().toISOString(),
        error: "Travel order info not found",
        details: { orderId: ["Travel order info not found"] },
      };
      return c.json(response, 404);
    }

    const response: ApiResponse<typeof data> = {
      status: 200,
      timestamp: new Date().toISOString(),
      message: "Travel order info retrieved successfully",
      data,
    };
    return c.json(response, 200);
  } catch (error) {
    console.error("Error in GET /travel-order-info:", error);
    const response: ApiErrorResponse = {
      status: 500,
      timestamp: new Date().toISOString(),
      error: "Internal server error",
      details: {
        server: [error instanceof Error ? error.message : "Unknown error"],
      },
    };
    return c.json(response, 500);
  }
});

TRAVEL_ORDER_INFO.post("/travel-order-info", async (c) => {
  try {
    const shop = c.get("shop");
    const body = await c.req.json();

    const result = ceTravelOrderInfoInsertInformationSchema.safeParse(body);
    if (!result.success) {
      const flattened = result.error.flatten();
      const response: ApiErrorResponse = {
        status: 400,
        timestamp: new Date().toISOString(),
        error: "Invalid request body",
        details: {
          ...flattened.fieldErrors,
          formErrors: flattened.formErrors,
        },
      };
      return c.json(response, 400);
    }

    await new CeTravelOrderInfoService(shop).createOrderTravelInfoService(
      result.data,
      c.get("customerId"),
    );
    const response: ApiResponse<null> = {
      status: 201,
      timestamp: new Date().toISOString(),
      message: "Travel order info created successfully",
      data: null,
    };
    return c.json(response, 201);
  } catch (error) {
    console.error("Error in POST /travel-order-info:", error);
    const response: ApiErrorResponse = {
      status: 500,
      timestamp: new Date().toISOString(),
      error: "Internal server error",
      details: {
        server: [error instanceof Error ? error.message : "Unknown error"],
      },
    };
    return c.json(response, 500);
  }
});

TRAVEL_ORDER_INFO.delete("/travel-order-info", async (c) => {
  try {
    const shop = c.get("shop");
    const orderId = c.req.query("orderId");
    const infoId = c.req.query("infoId");
    

    const parsedOrderId = shopwareId.safeParse(orderId);
    const parsedInfoId = shopwareId.safeParse(infoId);

    if (!parsedOrderId.success || !parsedInfoId.success) {
      const response: ApiErrorResponse = {
        status: 400,
        timestamp: new Date().toISOString(),
        error: "Invalid order ID format",
        details: { orderId: ["Invalid Shopware ID format"] },
      };
      return c.json(response, 400);
    }

    await new CeTravelOrderInfoService(shop).deleteOrderTravelInfoService(
      parsedOrderId.data,
      parsedInfoId.data,
      c.get("customerId"),
    );
    const response: ApiResponse<null> = {
      status: 200,
      timestamp: new Date().toISOString(),
      message: "Travel order info deleted successfully",
      data: null,
    };
    return c.json(response, 200);
  } catch (error) {
    console.error("Error in DELETE /travel-order-info:", error);
    const response: ApiErrorResponse = {
      status: 500,
      timestamp: new Date().toISOString(),
      error: "Internal server error",
      details: {
        server: [error instanceof Error ? error.message : "Unknown error"],
      },
    };
    return c.json(response, 500);
  }
});

TRAVEL_ORDER_INFO.patch("/travel-order-info", async (c) => {
  try {
    const shop = c.get("shop");

    const body = await c.req.json();

    const result = ceTravelOrderInfoUpdateInformationSchema.safeParse(body);
    if (!result.success) {
      const flattened = result.error.flatten();
      const response: ApiErrorResponse = {
        status: 400,
        timestamp: new Date().toISOString(),
        error: "Invalid request body",
        details: {
          ...flattened.fieldErrors,
          formErrors: flattened.formErrors,
        },
      };
      return c.json(response, 400);
    }

    await new CeTravelOrderInfoService(shop).updateOrderTravelInfoService(
      result.data,
      c.get("customerId"),
    );
    const response: ApiResponse<null> = {
      status: 200,
      timestamp: new Date().toISOString(),
      message: "Travel order info updated successfully",
      data: null,
    };
    return c.json(response, 200);
  } catch (error) {
    console.error("Error in PATCH /travel-order-info:", error);
    const response: ApiErrorResponse = {
      status: 500,
      timestamp: new Date().toISOString(),
      error: "Internal server error",
      details: {
        server: [error instanceof Error ? error.message : "Unknown error"],
      },
    };
    return c.json(response, 500);
  }
});

export default TRAVEL_ORDER_INFO;
