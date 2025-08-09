<script setup lang="ts">
import { notification } from "@shopware-ag/meteor-admin-sdk";
import { useTravelProductConfig } from "../store/useTravelProductConfig";

const store = useTravelProductConfig();
import { storeToRefs } from "pinia";
import { computed } from "vue";
import RoomBundle from "../components/RoomBundle.vue";
import { useSw } from "@/modules/shared/composables/useSw";
const { createSwEntity } = useSw();
const swData = computed(() => {
  return storeToRefs(store).dataToEdit.value?.hotelBundle;
});
const handleCreateRoomBundleResource = async () => {
  try {
    const newEntity = await createSwEntity("ce_room_bundle");
    if (!newEntity) {
      console.error("Failed to create new room bundle");
      return;
    }
    if (!store.dataToEdit) {
      throw new Error("dataToEdit is not defined");
    }
    if (!store.dataToEdit.hotelBundle?.roomOptions) {
      throw new Error("roomOptions is not defined");
    }

    store.dataToEdit.hotelBundle.roomOptions.add(newEntity);
  } catch (error) {
    notification.dispatch({
      title: "error",
      message: "Failed to create room bundle resource",
    });
    console.error("Error creating room bundle resource:", error);
  }
};

const handleCreateHotelBundle = async () => {
  try {
    const newEntity = await createSwEntity("ce_hotel_bundle");
    if (!newEntity) {
      console.error("Failed to create new hotel bundle");
      return;
    }
    if (!store.dataToEdit) {
      throw new Error("dataToEdit is not defined");
    }
    newEntity.minRoomSelection = 1;

    store.dataToEdit.hotelBundle = newEntity;
  } catch (error) {
    notification.dispatch({
      title: "error",
      message: "Failed to create hotel bundle",
    });
    console.error("Error creating hotel bundle:", error);
  }
};
</script>
<template>
  <div v-if="swData" class="ewt-form-group">
    <h2 class="ewt-heading ewt-heading--h2">Hotel Bundle</h2>
    <div class="ewt-grid ewt-grid--2">
      <div class="ewt-fieldset">
        <label class="ewt-form-label">Min Room Selection</label>
        <input
          v-model="swData.minRoomSelection"
          type="number"
          class="ewt-input"
        />
      </div>
      <div class="ewt-fieldset">
        <label class="ewt-form-label">Max Room Selection</label>
        <input
          v-model="swData.maxRoomSelection"
          type="number"
          class="ewt-input"
        />
      </div>
      <div class="ewt-fieldset">
        <label class="ewt-form-label">Max Additional Pre Night</label>
        <input
          v-model="swData.maxAdditionalPreNight"
          type="number"
          class="ewt-input"
        />
      </div>
      <div class="ewt-fieldset">
        <label class="ewt-form-label">Max Additional Post Night</label>
        <input
          v-model="swData.maxAdditionalPostNight"
          type="number"
          class="ewt-input"
        />
      </div>
    </div>
    <div class="ewt-mt-4">
      <RoomBundle />
    </div>
    <div class="ewt-mt-4">
      <button
        class="ewt-button ewt-button--secondary"
        @click="handleCreateRoomBundleResource"
      >
        Add Room Option
      </button>
    </div>
  </div>
  <div v-else class="ewt-form-group">
    <button
      class="ewt-button ewt-button--primary"
      @click="handleCreateHotelBundle"
    >
      Create Hotel Bundle
    </button>
  </div>
</template>
