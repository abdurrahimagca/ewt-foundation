import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { defineStore } from "pinia";
import { ref } from "vue";

const ASSOCIATIONS = [
  "productsToApply",
  "productsToApply.productOptions",
  "hotelBundle",
  "childDiscount",
  "genericBundles",
  "dateConfigurator",
  "hotelBundle.roomOptions",
  "hotelBundle.roomOptions.roomProducts",
  "hotelBundle.roomOptions.roomProducts.productOptions",
  "hotelBundle.roomOptions.roomSaleRule",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule.supplementProducts",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule.supplementProducts.productOptions",
  "genericBundles.parentProductOptions",
  "genericBundles.genericProductOptions",
  "genericBundles.genericProductOptions.productOptions",
  "genericBundles.parentProductOptions.productOptions",
];

export const useTravelProductConfig = defineStore("travelProductConfig", () => {
  const dataToEdit = ref<Entity<"ce_travel_product_config"> | null>(null);
  const isLoading = ref(false);
  const isEditing = ref(false);
  const dataToOverview =
    ref<EntityCollection<"ce_travel_product_config"> | null>(null);
  const currentPage = ref(1);
  const totalCount = ref(0);

  const searchResources = async (
    criteria?: InstanceType<typeof data.Classes.Criteria>,
  ) => {
    try {
      isLoading.value = true;
      const repo = data.repository("ce_travel_product_config");
      const searchCriteria = criteria || new data.Classes.Criteria();

      // Ensure we have the productsToApply association
      if (!searchCriteria.getAssociation("productsToApply")) {
        searchCriteria.addAssociation("productsToApply");
      }

      const result = await repo.search(searchCriteria);

      if (!result) {
        dataToOverview.value = null;
        totalCount.value = 0;
        return;
      }

      dataToOverview.value = result;
      totalCount.value = result.total || 0;

      if (searchCriteria.getPage()) {
        currentPage.value = searchCriteria.getPage();
      }
    } catch (e) {
      console.error(e);
      dataToOverview.value = null;
      totalCount.value = 0;
      notification.dispatch({
        title: "Error",
        message: (e as Error).message,
        variant: "error",
      });
    } finally {
      isEditing.value = false;
      isLoading.value = false;
    }
  };

  const createNewResource = async () => {
    try {
      isLoading.value = true;
      const repo = data.repository("ce_travel_product_config");
      const newEntity = await repo.create();

      if (!newEntity) throw new Error("Could not create entity");
      newEntity.configurationName = "New configuration";
      newEntity.configurationIdentifier = `ewt-trp-${newEntity.id.slice(0, 8)}`;
      newEntity.variantAware = false;
      newEntity.isDateConfigurable = false;
      await repo.save(newEntity);

      // Reset to first page after creation
      currentPage.value = 1;
      await searchResources();
    } catch (e) {
      console.error(e);
      notification.dispatch({
        title: "Error",
        message: (e as Error).message,
        variant: "error",
      });
    } finally {
      isLoading.value = false;
    }
  };

  const deleteResource = async (id: string) => {
    try {
      isLoading.value = true;
      const repo = data.repository("ce_travel_product_config");
      await repo.delete(id);

      // If we're on a page with only one item and it's deleted, go to previous page
      if (dataToOverview.value?.length === 1 && currentPage.value > 1) {
        currentPage.value--;
      }

      await searchResources();
      notification.dispatch({
        title: "Success",
        message: "Data deleted successfully",
        variant: "success",
      });
    } catch (e) {
      console.error(e);
      notification.dispatch({
        title: "Error",
        message: (e as Error).message,
        variant: "error",
      });
    } finally {
      isLoading.value = false;
    }
  };

  const setResource = async (id: string) => {
    try {
      isLoading.value = true;
      const criteria = new data.Classes.Criteria();
      ASSOCIATIONS.forEach((a) => criteria.addAssociation(a));
      criteria.addFilter(data.Classes.Criteria.equals("id", id));

      const repo = data.repository("ce_travel_product_config");
      const result = await repo.search(criteria);

      const first = result?.first();
      if (!first) throw new Error("No entity data found");
      dataToEdit.value = first;
    } catch (e) {
      console.error(e);
      notification.dispatch({
        title: "Error",
        message: (e as Error).message,
        variant: "error",
      });
    } finally {
      isLoading.value = false;
      isEditing.value = true;
    }
  };

  const upsertResource = async () => {
    try {
      isLoading.value = true;
      const repo = data.repository("ce_travel_product_config");
      if (!dataToEdit.value) {
        throw new Error("No entity data found");
      }
      await repo.save(dataToEdit.value);
      notification.dispatch({
        title: "Success",
        message: "Data saved successfully",
        variant: "success",
      });
      await setResource(dataToEdit.value.id);
    } catch (e) {
      console.error(e);
      notification.dispatch({
        title: "Error",
        message: (e as Error).message,
        variant: "error",
      });
    } finally {
      isLoading.value = false;
      isEditing.value = false;
    }
  };

  const createFreshEntity = async <K extends keyof EntitySchema.Entities>(
    key: K,
  ): Promise<Entity<K>> => {
    try {
      const repo = data.repository(key);
      const newEntity = await repo.create();

      if (!newEntity) {
        throw new Error(`Could not create entity of type ${key}`);
      }

      return newEntity;
    } catch (e) {
      console.error(e);
      notification.dispatch({
        title: "Error",
        message: (e as Error).message,
        variant: "error",
      });
      throw e;
    }
  };

  return {
    dataToEdit,
    dataToOverview,
    deleteResource,
    searchResources,
    createNewResource,
    isLoading,
    setResource,
    upsertResource,
    isEditing,
    currentPage,
    totalCount,
    createFreshEntity,
  };
});
