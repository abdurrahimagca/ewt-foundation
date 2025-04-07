import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { defineStore } from "pinia";
import { ref } from "vue";
const ASSOCIATIONS = [
  "product",
  "hotelBundle",
  "childDiscount",
  "genericBundles",
  "dateConfigurator",
  "hotelBundle.roomOptions",
  "hotelBundle.roomOptions.roomProducts",
  "hotelBundle.roomOptions.roomProducts.productOption",
  "hotelBundle.roomOptions.roomProducts.equivalentProduct",
  "hotelBundle.roomOptions.roomSaleRule",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule.supplementProducts",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule.supplementProducts.productOption",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule.supplementProducts.equivalentProduct",
  "genericBundles.parentProductOptions",
  "genericBundles.genericProductOptions",
  "genericBundles.genericProductOptions.productOption",
  "genericBundles.parentProductOptions.equivalentProduct",
  "genericBundles.parentProductOptions.productOption",
  "genericBundles.genericProductOptions.equivalentProduct",
];

export const useTravelProductConfig = defineStore("travelProductConfig", () => {
  const dataToEdit = ref<Entity<"ce_travel_product_config"> | null>(null);
  const isLoading = ref(false);
  const isEditing = ref(false);
  const dataToOverview =
    ref<EntityCollection<"ce_travel_product_config"> | null>(null);

  const searchResources = async (
    criteria?: InstanceType<typeof data.Classes.Criteria>,
  ) => {
    try {
      isLoading.value = true;
      const repo = data.repository("ce_travel_product_config");
      //TODO: create a default criteria
      const result = await repo.search(
        criteria ? criteria : new data.Classes.Criteria(),
      );
      dataToOverview.value = result;
    } catch (e) {
      console.error(e);
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
  };
});
