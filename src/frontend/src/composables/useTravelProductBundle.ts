import { ref } from "vue";
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";

export function useTravelProductConfig() {
  const productId = ref<string | undefined>(undefined);
  const entityData = ref<Entity<"ce_travel_product_config"> | undefined>(
    undefined,
  );
  const isLoading = ref(false);
  const error = ref<string | undefined>(undefined);

  const associations = [
    "hotelBundle",
    "additionalProducts",
    "additionalProducts.parentProducts",
    "additionalProducts.bundleProducts",
    "additionalProducts.bundleProducts.parentProducts",
    "additionalProducts.bundleProducts.productOptions",
    "childDiscount",
    "hotelBundle.roomOptions",
    "hotelBundle.roomOptions.roomProduct",
    "hotelBundle.roomOptions.additionalProducts",
    "hotelBundle.roomOptions.additionalProducts.parentProducts",
    "hotelBundle.roomOptions.additionalProducts.bundleProducts",
    "hotelBundle.roomOptions.additionalProducts.bundleProducts.parentProducts",
    "hotelBundle.roomOptions.additionalProducts.bundleProducts.productOptions",
    "hotelBundle.roomOptions.roomSaleRule",
    "hotelBundle.roomOptions.roomSaleRule.supplementRule",
    "hotelBundle.roomOptions.roomSaleRule.supplementRule.supplementProduct",
  ];

  const fetchData = async (pid: string | undefined) => {
    try {
      if (!pid) throw new Error("Product ID is required");
      isLoading.value = true;
      const criteria = new data.Classes.Criteria();
      associations.forEach((association) => {
        criteria.addAssociation(association);
      });
      criteria.addFilter(data.Classes.Criteria.equals("productId", pid));

      const repo = data.repository("ce_travel_product_config");
      const result = await repo.search(criteria);

      const resultData = result?.first();
      if (!resultData) throw new Error("No entity data found");

      entityData.value = resultData;

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
    try {
      isLoading.value = true;
      if (!entityData.value) throw new Error("No entity data found");

      const repo = data.repository("ce_travel_product_config");
      await repo.save(entityData.value);
      if (!productId.value) {
        throw new Error("No productId found in entity data");
      }

      const newData = await fetchData(productId.value);
      if (!newData) throw new Error("Could not fetch updated entity data");

      entityData.value = newData;
      notification.dispatch({
        title: "Success",
        message: "Configuration saved successfully",
        variant: "success",
      });
    } catch (e) {
      console.error(e);
      notification.dispatch({
        title: "Error",
        message: "Failed to save configuration. Please try again.",
        variant: "error",
      });
      error.value = e as string;
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

  const addHotelBundle = async () => {
    try {
      const repo = data.repository("ce_hotel_bundle");
      const newHotelBundle = await repo.create();
      if (!newHotelBundle || !entityData.value)
        throw new Error("Could not create hotel bundle");

      newHotelBundle.minRoomSelection = 1;
      newHotelBundle.maxRoomSelection = 1;

      await repo.save(newHotelBundle);
      entityData.value.hotelBundleId = newHotelBundle.id;
      entityData.value.hotelBundle = newHotelBundle;
      await upsertUpdatedData();
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
      newGenericBundle.availableOnMaxParentQuantity = 1;
      await repo.save(newGenericBundle);
      entityData.value.additionalProductsId = newGenericBundle.id;
      entityData.value.additionalProducts = newGenericBundle;

      await upsertUpdatedData();
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

      newChildDiscount.infantDiscountPercentage = 100;
      newChildDiscount.childDiscountPercentage = 50;
      await repo.save(newChildDiscount);
      entityData.value.childDiscountId = newChildDiscount.id;
      entityData.value.childDiscount = newChildDiscount;
      await upsertUpdatedData();
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
