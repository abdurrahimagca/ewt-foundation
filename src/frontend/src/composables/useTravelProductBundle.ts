import { ref } from "vue";
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";

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

export function useTravelProductConfig() {
  const productId = ref<string | undefined>(undefined);
  const entityData = ref<Entity<"ce_travel_product_config"> | undefined>(
    undefined,
  );
  const isLoading = ref(false);
  const error = ref<string | undefined>(undefined);
  const lastSnapshot = ref<Entity<"ce_travel_product_config"> | undefined>(
    undefined,
  );

  const fetchData = async (pid: string | undefined) => {
    try {
      if (!pid) throw new Error("Product ID is required");
      isLoading.value = true;
      const criteria = new data.Classes.Criteria();
      ASSOCIATION.forEach((association) => {
        criteria.addAssociation(association);
      });
      criteria.addFilter(data.Classes.Criteria.equals("productId", pid));

      const repo = data.repository("ce_travel_product_config");
      const result = await repo.search(criteria);

      const resultData = result?.first();
      if (!resultData) throw new Error("No entity data found");

      entityData.value = resultData;
      lastSnapshot.value = resultData;

      return entityData.value;
    } catch (e) {
      console.error(e);
      error.value = e as string;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const createData = async (pid: string | undefined) => {
    try {
      if (!pid) throw new Error("Product ID is required");
      const repo = data.repository("ce_travel_product_config");
      const newEntity = await repo.create();
      if (!newEntity) throw new Error("Could not create new entity");

      newEntity.productId = pid;
      await repo.save(newEntity);
      return await fetchData(pid);
    } catch (e) {
      console.error(e);
      error.value = e as string;
      return null;
    }
  };

  const upsertUpdatedData = async () => {
    if (!entityData.value) {
      throw new Error("No entity data found");
    }
    try {
      isLoading.value = true;
      const repo = data.repository("ce_travel_product_config");
      await repo.save(entityData.value);
      const newResult = await fetchData(entityData.value?.productId as string);
      if (!newResult) throw new Error("No entity data found");
      entityData.value = newResult;
      lastSnapshot.value = newResult;
      notification.dispatch({
        title: "Configuration updated",
        message: "Configuration updated successfully",
        variant: "success",
      });
    } catch (e) {
      tryRefreshData();
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteDataFromRepo = async () => {
    try {
      isLoading.value = true;
      if (!entityData.value) throw new Error("No entity data found");

      const repo = data.repository("ce_travel_product_config");
      await repo.delete(entityData.value.id);

      entityData.value = undefined;
      const newData = await createData(productId.value as string);
      if (!newData) throw new Error("Could not create new entity data");
      entityData.value = newData;
      notification.dispatch({
        title: "Success",
        message: "Configuration deleted",
        variant: "success",
      });
    } catch (e) {
      console.error(e);
      error.value = e as string;
    } finally {
      isLoading.value = false;
    }
  };

  const tryRefreshData = async () => {
    try {
      if (!lastSnapshot.value) throw new Error("No last snapshot found");
      await deleteDataFromRepo();
      const repo = data.repository("ce_travel_product_config");
      await repo.save(lastSnapshot.value);
      const newResult = await fetchData(
        lastSnapshot.value?.productId as string,
      );
      if (!newResult) throw new Error("No entity data found");
      entityData.value = newResult;
      notification.dispatch({
        title: "Configuration could not be updated",
        message: "Configuration could not be updated last snapshot restored",
        variant: "error",
      });
    } catch (e) {
      console.error(e);
      error.value = "Error refreshing data";
    }
  };

  const addHotelBundle = async () => {
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
      error.value = e as string;
    }
  };

  const addGenericBundleProduct = async () => {
    try {
      const repo = data.repository("ce_generic_bundle");
      const newGenericBundle = await repo.create();
      if (!newGenericBundle || !entityData.value)
        throw new Error("Could not create generic bundle");
      if (!entityData.value.genericBundles) {
        throw new Error("No generic bundles found");
      }
      newGenericBundle.availableOnMinParentQuantity = 1;
      entityData.value.genericBundles.push(newGenericBundle);
    } catch (e) {
      console.error(e);
      error.value = e as string;
    }
  };

  const addChildDiscount = async () => {
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
      error.value = e as string;
    }
  };

  return {
    productId,
    entityData,
    isLoading,
    error,
    fetchData,
    createData,
    upsertUpdatedData,
    deleteDataFromRepo,
    addHotelBundle,
    addGenericBundleProduct,
    addChildDiscount,
  };
}
