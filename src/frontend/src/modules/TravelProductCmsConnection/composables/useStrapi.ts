import { ref, readonly } from "vue";

type StrapiResponse = {
  success: boolean;
  data: { documentId: string; strapiUrl: string } | null;
  error: string | null;
};

const useStrapi = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createOrFindCmsResourceForProductRequest = async (
    productId: string,
    parentProductId: string | null,
    isChildCanUseThisResource: boolean,
    productName?: string,
    productCreatedAt?: string,
  ): Promise<StrapiResponse> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch("/strapi/product-content/create", {
        method: "POST",
        body: JSON.stringify({
          productId,
          parentProductId,
          isChildCanUseThisResource,
          productName,
          productCreatedAt,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || response.statusText;
        error.value = errorMsg;
        return {
          success: false,
          data: null,
          error: errorMsg,
        };
      }

      const { documentId, strapiUrl } = data.data;

      if (!documentId || !strapiUrl) {
        const errorMsg = "Invalid response from server";
        error.value = errorMsg;
        return {
          success: false,
          data: null,
          error: errorMsg,
        };
      }

      return {
        success: true,
        data: { documentId, strapiUrl },
        error: null,
      };
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Unknown error occurred";
      error.value = errorMsg;
      return {
        success: false,
        data: null,
        error: errorMsg,
      };
    } finally {
      loading.value = false;
    }
  };

  const findCmsResourceForProductRequest = async (
    productId: string,
    parentProductId: string | null,
    productName?: string,
    productCreatedAt?: string,
  ): Promise<StrapiResponse> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`/strapi/product-content/find`, {
        method: "POST",
        body: JSON.stringify({
          productId,
          parentProductId,
          productName,
          productCreatedAt,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || response.statusText;
        error.value = errorMsg;
        return {
          success: false,
          data: null,
          error: errorMsg,
        };
      }

      const { documentId, strapiUrl } = data.data;

      if (!documentId || !strapiUrl) {
        const errorMsg = "Invalid response from server";
        error.value = errorMsg;
        return {
          success: false,
          data: null,
          error: errorMsg,
        };
      }

      return {
        success: true,
        data: { documentId, strapiUrl },
        error: null,
      };
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Unknown error occurred";
      error.value = errorMsg;
      return {
        success: false,
        data: null,
        error: errorMsg,
      };
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    createOrFindCmsResourceForProductRequest,
    findCmsResourceForProductRequest,
  };
};

export default useStrapi;
