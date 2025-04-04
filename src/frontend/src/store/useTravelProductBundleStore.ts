// stores/useTravelProductConfig.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import type { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";

const ASSOCIATION = [

  "hotelBundle",
  "genericBundles",
  "genericBundles.parentProducts",
  "genericBundles.productOptions",
  "childDiscount",
  "hotelBundle.roomOptions",
  "hotelBundle.roomOptions.roomProducts",
  "hotelBundle.roomOptions.roomSaleRule",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule",
  "hotelBundle.roomOptions.roomSaleRule.supplementRule.supplementProducts",
];

export const useTravelProductConfigStore = defineStore(
  "travelProductConfig",
  () => {
    const productId = ref<string>();

    const entityData = ref<Entity<"ce_travel_product_config">>();
    const isLoading = ref(false);
    const error = ref<string>();

    async function fetchData(pid: string) {
      try {
        if (!pid) throw new Error("Product ID is required");
        isLoading.value = true;
        const criteria = new data.Classes.Criteria();
        ASSOCIATION.forEach((a) => criteria.addAssociation(a));
        criteria.addFilter(data.Classes.Criteria.equals("productId", pid));

        const repo = data.repository("ce_travel_product_config");
        const result = await repo.search(criteria);
        const resultData = result?.first();
        //console.log("result data:", resultData);
        // console.log(JSON.stringify(resultData, null, 2));
        if (!resultData) throw new Error("No entity data found");

        entityData.value = resultData;

        return entityData.value;
      } catch (e) {
        console.error(e);
        error.value = (e as Error).message;
        return null;
      } finally {
        isLoading.value = false;
      }
    }

    async function createData(pid: string) {
      try {
        if (!pid) throw new Error("Product ID is required");
        const repo = data.repository("ce_travel_product_config");
        const newEntity = await repo.create();
        if (!newEntity) throw new Error("Could not create entity");
        newEntity.productId = pid;
        await repo.save(newEntity);
        return await fetchData(pid);
      } catch (e) {
        console.error(e);
        error.value = (e as Error).message;
        return null;
      }
    }

    async function refreshState() {
      isLoading.value = true;
      error.value = undefined;
      try {
        if (!entityData.value)
          throw new Error("[Validation] No entity data found");
        try {
          const repo = data.repository("ce_travel_product_config");
          await repo.save(entityData.value);
          notification.dispatch({
            title: "Success",
            message: "Configuration saved",
            variant: "success",
          });
        } catch (saveError) {
          throw new Error(
            `[Save] Failed to save entity: ${(saveError as Error).message}`,
          );
        }

        const criteria = new data.Classes.Criteria();
        ASSOCIATION.forEach((a) => criteria.addAssociation(a));

        try {
          criteria.setIds([entityData.value?.id]);
        } catch (criteriaError) {
          throw new Error(
            `[Criteria] Failed to set IDs: ${(criteriaError as Error).message}`,
          );
        }

        let result;
        try {
          result = await data
            .repository("ce_travel_product_config")
            .search(criteria);
        } catch (searchError) {
          throw new Error(
            `[Search] Failed to search repository: ${(searchError as Error).message}`,
          );
        }

        const resultData = result?.first();
        if (!resultData)
          throw new Error("[SEARCH] No entity data found after refresh");

        entityData.value = resultData;
      } catch (e) {
        notification.dispatch({
          title: "Error",
          message: (e as Error).message,
          variant: "error",
        });
        //* Detaylı hata logları
        //  console.log("error saving entity data", JSON.stringify(e));
        //console.log("data is:", entityData.value);
        //console.log("raw data is:", JSON.stringify(entityData.value, null, 2));
        // console.log("generic bundles:", entityData.value?.genericBundles);
        //console.log(
        //  "raw generic bundles:",
        // JSON.stringify(entityData.value?.genericBundles, null, 2),
        //);
        console.error(JSON.stringify(e, null, 2));
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    }

    async function deleteDataFromRepo() {
      try {
        if (!entityData.value) throw new Error("No entity data found");
        isLoading.value = true;
        const repo = data.repository("ce_travel_product_config");
        await repo.delete(entityData.value.id);

        entityData.value = undefined;
        const newData = await createData(productId.value!);
        if (!newData) throw new Error("Could not recreate entity data");
        entityData.value = newData;
        notification.dispatch({
          title: "Success",
          message: "Configuration deleted",
          variant: "success",
        });
      } catch (e) {
        console.error(e);
        error.value = (e as Error).message;
      } finally {
        isLoading.value = false;
      }
    }

    async function addHotelBundle() {
      try {
        const repo = data.repository("ce_hotel_bundle");
        const newHotelBundle = await repo.create();
        if (!newHotelBundle || !entityData.value)
          throw new Error("Could not create hotel bundle");
        newHotelBundle.minRoomSelection = 1;
        newHotelBundle.maxRoomSelection = 1;
        entityData.value.hotelBundle = newHotelBundle;
      } catch (e) {
        console.error(e);
        error.value = (e as Error).message;
      }
    }

    async function addGenericBundleProduct() {
      try {
        const repo = data.repository("ce_generic_bundle");
        const newGenericBundle = await repo.create();
        if (!newGenericBundle || !entityData.value)
          throw new Error("Could not create generic bundle");

        entityData.value.genericBundles?.add(newGenericBundle);
      } catch (e) {
        console.error(e);
        error.value = (e as Error).message;
      }
    }

    async function addChildDiscount() {
      try {
        const repo = data.repository("ce_custom_child_discount");
        const newChildDiscount = await repo.create();
        if (!newChildDiscount || !entityData.value)
          throw new Error("Could not create child discount");
        newChildDiscount.infantsDiscountPercentage = 100;
        newChildDiscount.childDiscountPercentage = 50;
        entityData.value.childDiscount = newChildDiscount;
      } catch (e) {
        console.error(e);
        error.value = (e as Error).message;
      }
    }

    return {
      productId,
      entityData,
      isLoading,
      error,
      fetchData,
      createData,

      deleteDataFromRepo,
      addHotelBundle,
      addGenericBundleProduct,
      addChildDiscount,
      refreshState,
    };
  },
);
