import { useSw } from "@/modules/shared/composables/useSw";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { defineStore } from "pinia";
import { ref } from "vue";
import { data as swDataModule } from "@shopware-ag/meteor-admin-sdk";
import { dateRangeSchema } from "../types/dateType";
const {
  fetchSwEntityCollection,
  deleteSwEntity,
  saveSwEntity,
  createSwEntity,
} = useSw();

export const useDateConfig = defineStore("dateConfig", () => {
  const data = ref<Entity<"ce_travel_product_date_config"> | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const productId = ref<string | null>(null);

  const init = async (pid: string) => {
    productId.value = pid;
    await searchResource();
  };

  const createNewResource = async (strategy: "dateRange" | "staticDate") => {
    try {
      if (!productId.value) {
        error.value = "Product ID is required";
        throw new Error("Product ID is required");
      }
      isLoading.value = true;
      const newResource = await createSwEntity("ce_travel_product_date_config");

      if (!newResource) {
        error.value = "Failed to create date config";
        throw new Error("Failed to create date config");
      }
      newResource.productId = productId.value;
      if (strategy === "dateRange") {
        const dateRange = await createSwEntity("ce_date_range");
        if (!dateRange) {
          error.value = "Failed to create date range";
          throw new Error("Failed to create date range");
        }
        newResource.isDateRange = true;
        newResource.dateRange = dateRange;
      } else if (strategy === "staticDate") {
        const staticDate = await createSwEntity("ce_static_date_opt");
        if (!staticDate) {
          error.value = "Failed to create static date";
          throw new Error("Failed to create static date");
        }
        newResource.isStaticDate = true;
        newResource.staticDate = staticDate;
      }
      data.value = newResource;
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  const searchResource = async () => {
    if (!productId.value) {
      error.value = "Product ID is required";
      throw new Error("Product ID is required");
    }
    const criteria = new swDataModule.Classes.Criteria();
    criteria.addFilter({
      type: "equals",
      field: "productId",
      value: productId.value,
    });
    criteria.addAssociation("dateRange");
    criteria.addAssociation("staticDate");
    const result = await fetchSwEntityCollection(
      "ce_travel_product_date_config",
      criteria,
    );
    if (result && result.length > 1) {
      error.value =
        "You have dublicate date config for this product only this gonna used";
    }
    data.value = result?.first() || null;
  };

  const deleteResource = async () => {
    try {
      if (!data.value) {
        error.value = "No date config to delete";
        throw new Error("No date config to delete");
      }
      await deleteSwEntity("ce_travel_product_date_config", data.value.id);
      data.value = null;
      error.value = null;
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  const saveResource = async () => {
    try {
      isLoading.value = true;
      if (!data.value) {
        error.value = "No date config to save";
        throw new Error("No date config to save");
      }
      if (data.value.dateRange) {
        const parsedDateRange = dateRangeSchema.safeParse(
          data.value.dateRange.dateRangeData,
        );
        if (parsedDateRange.success) {
          data.value.dateRange.dateRangeData = parsedDateRange.data;
        } else {
          error.value = "Invalid date range data";
          throw new Error("Invalid date range data");
        }
      }
      await saveSwEntity("ce_travel_product_date_config", data.value);
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    data,
    isLoading,
    error,
    productId,
    createNewResource,
    init,
    searchResource,
    deleteResource,
    saveResource,
  };
});
