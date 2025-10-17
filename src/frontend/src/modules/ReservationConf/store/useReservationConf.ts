import { useSw } from "@/modules/shared/composables/useSw";
import { data as swDataModule } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const {
  fetchSwEntityCollection,
  createSwEntity,
  saveSwEntity,
  deleteSwEntity,
} = useSw();

type ReservationEntity = Entity<"ce_reservation_configuration">;

export const useReservationConf = defineStore("reservationConf", () => {
  const items = ref<ReservationEntity[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const entityLoading = ref<string[]>([]);

  const hasItems = computed(() => items.value.length > 0);

  const setEntityLoading = (id: string, loading: boolean) => {
    entityLoading.value = loading
      ? [...new Set([...entityLoading.value, id])]
      : entityLoading.value.filter((storedId) => storedId !== id);
  };

  const isEntityLoading = (id: string) =>
    entityLoading.value.includes(id) || isLoading.value;

  const init = async () => {
    await searchResource();
  };

  const resetAssociations = (entity: ReservationEntity) => {
    entity.reservationProduct = entity.reservationProduct || null;
    entity.reservationProductId = entity.reservationProduct?.id || null;
    entity.applyToProductStream = entity.applyToProductStream || null;
    entity.applyToProductStreamId = entity.applyToProductStream?.id || null;
  };

  const removeItem = (target: ReservationEntity) => {
    items.value = items.value.filter(
      (item) => item.id !== target.id && item !== target,
    );
  };

  const isDraftEntity = (entity: ReservationEntity) => {
    try {
      const draftCheck =
        typeof (entity as unknown as { isNew?: () => boolean }).isNew ===
        "function"
          ? (entity as unknown as { isNew: () => boolean }).isNew()
          : false;
      return draftCheck || !entity.id;
    } catch {
      return !entity.id;
    }
  };

  const createNewResource = async () => {
    try {
      isLoading.value = true;
      const entity = await createSwEntity("ce_reservation_configuration");
      if (!entity) {
        throw new Error("Failed to create reservation configuration");
      }
      entity.isActive = false;
      entity.addPerAdult = false;
      entity.addPerChild = false;
      entity.addPerInfant = false;
      entity.cancellableDayBeforeReservation = 0;
      entity.reservationProduct = null;
      entity.reservationProductId = null;
      entity.applyToProductStream = null;
      entity.applyToProductStreamId = null;
      items.value = [entity, ...items.value];
      error.value = null;
      return entity;
    } catch (e) {
      console.error(e);
      error.value =
        e instanceof Error
          ? e.message
          : "Unknown error while creating reservation configuration";
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const searchResource = async () => {
    try {
      isLoading.value = true;
      const criteria = new swDataModule.Classes.Criteria();
      criteria.addAssociation("reservationProduct");
      criteria.addAssociation("applyToProductStream");
      const result = await fetchSwEntityCollection(
        "ce_reservation_configuration",
        criteria,
      );
      items.value = result ? [...result] : [];
      items.value.forEach(resetAssociations);
      error.value = null;
    } catch (e) {
      console.error(e);
      error.value = "Failed to load reservation configurations";
    } finally {
      isLoading.value = false;
    }
  };

  const saveResource = async (id: string) => {
    const entity = items.value.find((item) => item.id === id);
    if (!entity) {
      error.value = "Reservation configuration not found";
      return;
    }
    try {
      setEntityLoading(id, true);
      resetAssociations(entity);
      await saveSwEntity("ce_reservation_configuration", entity);
      error.value = null;
    } catch (e) {
      console.error(e);
      error.value =
        e instanceof Error
          ? e.message
          : "Unknown error while saving reservation configuration";
    } finally {
      setEntityLoading(id, false);
    }
  };

  const deleteResource = async (id: string) => {
    const entity = items.value.find((item) => item.id === id);
    if (!entity) {
      error.value = "Reservation configuration not found";
      return;
    }
    if (isDraftEntity(entity)) {
      removeItem(entity);
      error.value = null;
      return;
    }
    try {
      setEntityLoading(id, true);
      await deleteSwEntity("ce_reservation_configuration", id);
      removeItem(entity);
      error.value = null;
    } catch (e) {
      console.error(e);
      error.value =
        e instanceof Error
          ? e.message
          : "Unknown error while deleting reservation configuration";
    } finally {
      setEntityLoading(id, false);
    }
  };

  return {
    items,
    isLoading,
    error,
    hasItems,
    entityLoading,
    isEntityLoading,
    init,
    createNewResource,
    searchResource,
    saveResource,
    deleteResource,
  };
});
