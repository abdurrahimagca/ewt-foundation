import { useSw } from "@/modules/shared/composables/useSw";
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { defineStore } from "pinia";
import { ref, toRaw } from "vue";
import {
  ALL_ASSOCIATIONS_CRITERIA,
  DEFAULT_SUMMARY_CRITERIA,
} from "../types/consts";
const {
  fetchSwEntity,
  fetchSwEntityCollection,
  deleteSwEntity,
  saveSwEntity,
  createSwEntity,
} = useSw();

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
      const searchCriteria = criteria || DEFAULT_SUMMARY_CRITERIA;
      const result = await fetchSwEntityCollection(
        "ce_travel_product_config",
        searchCriteria,
      );
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
      const newEntity = await createSwEntity("ce_travel_product_config");

      if (!newEntity) throw new Error("Could not create entity");
      newEntity.configurationName = "New configuration";
      newEntity.configurationIdentifier = `ewt-trp-${newEntity.id.slice(0, 8)}`;
      await saveSwEntity("ce_travel_product_config", newEntity);
      currentPage.value = 1;
      notification.dispatch({
        title: "Success",
        message: "Data created successfully",
        variant: "success",
      });
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
      await deleteSwEntity("ce_travel_product_config", id);
      if (dataToOverview.value?.length === 1 && currentPage.value > 1) {
        currentPage.value--;
      }
      notification.dispatch({
        title: "Success",
        message: "Data deleted successfully",
        variant: "success",
      });
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

  const setResource = async (id: string) => {
    try {
      isLoading.value = true;
      ALL_ASSOCIATIONS_CRITERIA.setIds([id]);
      const result = await fetchSwEntity(
        "ce_travel_product_config",
        ALL_ASSOCIATIONS_CRITERIA,
      );
      if (!result) throw new Error("No entity data found");
      dataToEdit.value = result;
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
      isEditing.value = false;
      if (!dataToEdit.value) throw new Error("No entity data found");
      await saveSwEntity("ce_travel_product_config", dataToEdit.value);
      await setResource(dataToEdit.value.id);

      notification.dispatch({
        title: "Success",
        message: "Data saved successfully",
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
  const cancelEdit = () => {
    dataToEdit.value = null;
    isEditing.value = false;
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
    cancelEdit,
    totalCount,
  };
});
