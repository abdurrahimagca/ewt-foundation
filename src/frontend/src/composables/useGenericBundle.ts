import { ref } from "vue";
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";

export function useGenericBundle() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function addBundleProduct(
    inheritedData: Entity<"ce_generic_bundle">,
    emit: Function,
  ) {
    try {
      const repo = data.repository("ce_generic_bundle_product");
      const newData = await repo.create();
      if (!newData) throw new Error("Could not create new bundle product");
      newData.matchParentQuantity = true;
      await repo.save(newData);
      if (!inheritedData?.bundleProducts) {
        throw new Error("Inherited data is undefined");
      }
      const result = await repo.get(newData.id);
      if (!result) throw new Error("Could not get new bundle product");
      inheritedData.bundleProducts.add(result);

      emit("update:data");
    } catch (e) {
      console.error(e);
      error.value = (e as Error).message;
    }
  }

  async function handleParentProductChange(
    inheritedData: Entity<"ce_generic_bundle">,
    product:
      | EntitySchema.Entities["product"]
      | EntitySchema.Entities["product"][],
    emit: Function,
  ) {
    try {
      if (!Array.isArray(product)) throw new Error("Product must be array");
      if (!inheritedData?.parentProducts) {
        throw new Error("Inherited data is undefined");
      }
      inheritedData.parentProductId = product.map((item) => item.id);
      inheritedData.parentProducts = product as EntityCollection<"product">;
      await data.repository("ce_generic_bundle").save(inheritedData);
      emit("update:data");
    } catch (e) {
      console.error("error on handling parent product change", e);
      error.value = (e as Error).message;
      notification.dispatch({
        title: "Error",
        message: "An error occurred while updating the parent product.",
        variant: "error",
      });
    }
  }

  async function handleNestedParentProductChange(
    inheritedData: Entity<"ce_generic_bundle">["bundleProducts"],
    id: string,
    products: EntitySchema.Entities["product"][],
    emit: Function,
  ) {
    try {
      const opt = inheritedData?.find((opt) => opt.id === id);
      if (!opt) throw new Error("Option not found");
      if (!(products instanceof Array))
        throw new Error("Product must be array");
      if (products.some((p) => !p || !p.id))
        throw new Error("One of the products is invalid");

      opt.parentProducts = products as EntityCollection<"product">;
      opt.parentProductId = products.map((item) => item.id);

      const index = inheritedData.findIndex((o) => o.id === opt.id);
      if (index !== -1) {
        inheritedData[index] = opt;
      }

      await data
        .repository("ce_generic_bundle_product")
        .save(opt as Entity<"ce_generic_bundle_product">);

      emit("update:data");

      notification.dispatch({
        title: "Parent Product Updated",
        message: "Parent product updated successfully.",
        variant: "success",
      });
    } catch (e) {
      console.error("error on bundle product parent product:", e);
      error.value = (e as Error).message;
      notification.dispatch({
        title: "Error",
        message: "An error occurred while updating the parent product.",
        variant: "error",
      });
    }
  }

  async function handleProductOptionsChange(
    inheritedData: Entity<"ce_generic_bundle">["bundleProducts"],
    id: string,
    products: EntitySchema.Entities["product"][],
    emit: Function,
  ) {
    try {
      const opt = inheritedData?.find((opt) => opt.id === id);
      if (!opt) throw new Error("Option not found");
      if (!(products instanceof Array))
        throw new Error("Product must be array");
      opt.parentProducts = products as EntityCollection<"product">;
      opt.parentProductId = products.map((item) => item.id);
      const index = inheritedData.findIndex((o) => o.id === opt.id);
      if (index !== -1) {
        inheritedData[index] = opt;
      }

      await data
        .repository("ce_generic_bundle_product")
        .save(opt as Entity<"ce_generic_bundle_product">);

      emit("update:data");

      notification.dispatch({
        title: "Product Options Updated",
        message: "Product options updated successfully.",
        variant: "success",
      });
    } catch (e) {
      console.error("error on product options:", e);
      error.value = (e as Error).message;
      notification.dispatch({
        title: "Error",
        message: "An error occurred while updating the product options.",
        variant: "error",
      });
    }
  }

  return {
    isLoading,
    error,
    addBundleProduct,
    handleParentProductChange,
    handleNestedParentProductChange,
    handleProductOptionsChange,
  };
}
