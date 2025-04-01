<script lang="ts" setup>
import { data } from "@shopware-ag/meteor-admin-sdk";
import { defineProps } from "vue";
import RoomBundle from "./RoomBundle.vue";

const props = defineProps<{
  inheritedData: EntitySchema.Entities["ce_hotel_bundle"];
}>();

async function removeRoom() {
  props.inheritedData.roomOptions?.pop();
}
const emit = defineEmits<{
  (e: "update:data"): void;
}>();

async function addRoom() {
  try {
    const repo = data.repository("ce_travel_product_config_room_bundle");
    const newData = await repo.create();
    if (newData === null) {
      throw new Error("Could not create new room bundle");
    }

    await repo.save(newData);

    props.inheritedData.roomOptions?.push(newData);
    emit("update:data");
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <div v-if="inheritedData" class="ewt-card-detail">
    <div class="ewt-section">
      <h3 class="ewt-section-title">Hotel General Room Configuration</h3>
      <p class="ewt-subtitle">
        Configure room selection limits and options it'll effect how many
        <strong>rooms</strong> can added. Each room can have own config
      </p>
    </div>
    <div class="ewt-grid-2">
      <div class="ewt-form-group">
        <label for="minRoomSelection" class="ewt-form-label"
          >Minimum Rooms</label
        >
        <input
          id="minRoomSelection"
          v-model="inheritedData.minRoomSelection"
          type="number"
          min="1"
          class="ewt-input"
        />
      </div>

      <div class="ewt-form-group">
        <label for="maxRoomSelection" class="ewt-form-label"
          >Maximum Rooms</label
        >
        <input
          id="maxRoomSelection"
          v-model="inheritedData.maxRoomSelection"
          type="number"
          min="1"
          class="ewt-input"
        />
      </div>
    </div>

    <div class="ewt-section">
      <div class="ewt-header">
        <h4 class="ewt-section-title">Room Bundles</h4>
        <div class="ewt-flex ewt-gap-3">
          <button @click="addRoom" class="ewt-btn ewt-btn--primary">
            <span class="icon">+</span> Add Room
          </button>
          <button @click="removeRoom" class="ewt-btn ewt-btn--secondary">
            <span class="icon">-</span> Remove Last Room
          </button>
        </div>
      </div>

      <div v-if="inheritedData.roomOptions" class="ewt-grid-rooms">
        <RoomBundle
          @update:data="emit('update:data')"
          :roomBundle="inheritedData.roomOptions"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hotel-bundle-container {
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
}

.hotel-bundle-header {
  margin-bottom: 24px;
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
}

.hotel-bundle-header h3 {
  font-size: 1.25rem;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.subtitle {
  color: #666;
  font-size: 0.875rem;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: #f8f9fa;
}

.form-input:focus {
  border-color: #0066cc;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  outline: none;
}

.room-bundles-section {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 20px;
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h4 {
  font-size: 1rem;
  margin: 0;
  color: #333;
}

.button-group {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background-color: #0066cc;
  color: white;
}

.btn-primary:hover {
  background-color: #0052a3;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #d0d0d0;
}

.icon {
  margin-right: 6px;
  font-size: 1rem;
}

.room-bundles-container {
  background: white;
  border-radius: 6px;
  padding: 16px;
  margin-top: 16px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hotel-bundle-container {
    padding: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .button-group {
    width: 100%;
  }

  .btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
