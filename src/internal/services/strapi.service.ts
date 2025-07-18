import {
  StrapiCreateResponseBody,
  StrapiFindResponseBody,
  StrapiRequestBody,
  StrapiServiceResponse,
} from "../types/strapi.js";
async function _strapiFetch(
  path: string,
  method: "POST" | "GET",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
): Promise<StrapiServiceResponse> {
  const strapiUrl = process.env.STRAPI_URL;
  const strapiToken = process.env.STRAPI_TOKEN;

  if (!strapiUrl || !strapiToken) {
    return {
      success: false,
      data: null,
      error: "Missing STRAPI_URL or STRAPI_TOKEN",
    };
  }
  try {
    const response = await fetch(`${strapiUrl}/${path}`, {
      method,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiToken}`,
      },
    });
    if (!response.ok) {
      return {
        success: false,
        data: null,
        error: `Failed to fetch from Strapi: ${response.status} ${response.statusText}`,
      };
    }
    const data = await response.json();
    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch from Strapi",
    };
  }
}

async function _strapiFetchGet(
  pathWithParams: string,
): Promise<StrapiServiceResponse> {
  const strapiUrl = process.env.STRAPI_URL;
  const strapiToken = process.env.STRAPI_TOKEN;

  if (!strapiUrl || !strapiToken) {
    return {
      success: false,
      data: null,
      error: "Missing STRAPI_URL or STRAPI_TOKEN",
    };
  }
  try {
    const response = await fetch(`${strapiUrl}/${pathWithParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiToken}`,
      },
    });
    if (!response.ok) {
      return {
        success: false,
        data: null,
        error: `Failed to fetch from Strapi: ${response.status} ${response.statusText}`,
      };
    }
    const data = await response.json();
    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch from Strapi",
    };
  }
}

async function _strapiCreate(
  body: StrapiRequestBody,
): Promise<StrapiServiceResponse> {
  const FETCH_PATH = "api/product-contents";
  const ADMIN_PATH =
    "admin/content-manager/collection-types/api::product-content.product-content";

  // Wrap the body in a data object as expected by Strapi
  const strapiPayload = {
    data: {
      productId: body.productId,
      parentProductId: body.parentProductId,
      isChildCanUseThisResource: body.isChildCanUseThisResource,
      productName: body.productName,
      productCreatedAt: body.productCreatedAt,
    },
  };

  const response = await _strapiFetch(FETCH_PATH, "POST", strapiPayload);
  if (!response.success || !response.data || !response.data) {
    return response;
  }
  const data = response.data as unknown as StrapiCreateResponseBody;
  return {
    success: true,
    data: {
      documentId: data.data.documentId,
      strapiUrl: `${process.env.STRAPI_URL}/${ADMIN_PATH}/${data.data.documentId}`,
    },
    error: null,
  };
}

export async function strapiCreateContent(
  body: StrapiRequestBody,
): Promise<StrapiServiceResponse> {
  return await _strapiCreate(body);
}

export async function strapiFindContent(
  body: StrapiRequestBody,
): Promise<StrapiServiceResponse> {
  return await _strapiFind(body);
}

async function _strapiFind(
  body: StrapiRequestBody,
): Promise<StrapiServiceResponse> {
  const FETCH_PATH = "api/product-contents";
  const ADMIN_PATH =
    "admin/content-manager/collection-types/api::product-content.product-content";

  // Build query parameters for GET request using Strapi REST API format
  const params = new URLSearchParams();

  // Add the OR filter: productId = body.productId OR (parentProductId = body.parentProductId AND isChildCanUseThisResource = true)
  params.append("filters[$or][0][productId][$eq]", body.productId);

  if (body.parentProductId) {
    params.append(
      "filters[$or][1][$and][0][productId][$eq]",
      body.parentProductId,
    );
    params.append(
      "filters[$or][1][$and][1][isChildCanUseThisResource][$eq]",
      "true",
    );
  }

  const response = await _strapiFetchGet(`${FETCH_PATH}?${params.toString()}`);
  if (!response.success || !response.data || !response.data) {
    return response;
  }
  const data = response.data as unknown as StrapiFindResponseBody;

  // If no data found, return null
  if (!data.data || data.data.length === 0) {
    return {
      success: true,
      data: null,
      error: null,
    };
  }

  // Return the first matching result
  const firstResult = data.data[0];
  return {
    success: true,
    data: {
      documentId: firstResult.documentId,
      strapiUrl: `${process.env.STRAPI_URL}/${ADMIN_PATH}/${firstResult.documentId}`,
    },
    error: null,
  };
}
