import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
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

export const useDataStore = defineStore("travelProductConfig", () => {
  const travelProductConfigData =
    ref<Entity<"ce_travel_product_config"> | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isEditing = ref(false);
  const toggleEdit = () => {
    isEditing.value = !isEditing.value;
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
      travelProductConfigData.value = first;
    } catch (e) {
      console.error(e);
      error.value = (e as Error).message;
    } finally {
      isLoading.value = false;
    }
  };

  const upsertResorce = async () => {
    try {
      isLoading.value = true;
      const repo = data.repository("ce_travel_product_config");
      if (!travelProductConfigData.value) {
        throw new Error("No entity data found");
      }
      await repo.save(travelProductConfigData.value);
      notification.dispatch(
        {
          title: "Success",
          message: "Data saved successfully",
          variant: "success"
        });
      await setResource(travelProductConfigData.value.id);
    } catch (e) {
      console.error(e);
      error.value = (e as Error).message;
    } finally {
      isLoading.value = false;
    }
  };
  return {
    travelProductConfigData,
    isLoading,
    error,
    setResource,
    upsertResorce,
    isEditing,
    toggleEdit,
  };
});
