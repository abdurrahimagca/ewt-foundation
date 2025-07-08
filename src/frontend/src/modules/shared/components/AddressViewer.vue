<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";
import { PickUpLocation } from "@/modules/TravelOrderInfo/types/travelCustomDate";

const props = defineProps<{
  modelValue: PickUpLocation;
  isEditable?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const localAddress = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const googleMapsSrc = computed(() => {
  if (!localAddress.value.meetingPointIframe) {
    return undefined;
  }
  return localAddress.value.meetingPointIframe;
});
</script>

<template>
  <div class="address-viewer-container">
    <div class="address-form">
      <div class="form-grid">
        <div class="form-field">
          <label for="street">Street</label>
          <input
            id="street"
            v-model="localAddress.meetingPointStreet"
            :disabled="!isEditable"
            placeholder="e.g. Ataturk St."
          />
        </div>
        <div class="form-field">
          <label for="city">City</label>
          <input
            id="city"
            v-model="localAddress.meetingPointCity"
            :disabled="!isEditable"
            placeholder="e.g. Istanbul"
          />
        </div>
        <div class="form-field">
          <label for="zipCode">Zip Code</label>
          <input
            id="zipCode"
            v-model="localAddress.meetingPointZip"
            :disabled="!isEditable"
            placeholder="e.g. 34000"
          />
        </div>
        <div class="form-field">
          <label for="country">Country</label>
          <input
            id="country"
            v-model="localAddress.meetingPointCountry"
            :disabled="!isEditable"
            placeholder="e.g. Türkiye"
          />
        </div>
        <div class="form-field full-width">
          <label for="address">Full Address</label>
          <textarea
            id="address"
            v-model="localAddress.meetingPointAddress"
            :disabled="!isEditable"
            rows="3"
            placeholder="Enter full address details"
          ></textarea>
        </div>
      </div>
    </div>
    <div class="map-viewer">
      <div v-if="googleMapsSrc" class="map-iframe-wrapper">
        <iframe
          :src="googleMapsSrc"
          width="100%"
          height="100%"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
        ></iframe>
      </div>
      <div v-else class="map-placeholder">
        Please provide a valid address to see the map location.
      </div>
    </div>
  </div>
</template>

<style scoped>
.address-viewer-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  font-family: -apple-system, system-ui, sans-serif;
}

.address-form {
  display: flex;
  flex-direction: column;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

input,
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background-color: #f9fafb;
}

input:hover,
textarea:hover {
  background-color: #fff;
  border-color: #a5b4fc;
}

input:focus,
textarea:focus {
  background-color: #fff;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

input:disabled,
textarea:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  color: #9ca3af;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.map-viewer {
  border-radius: 12px;
  overflow: hidden;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  min-height: 300px;
}

.map-iframe-wrapper {
  width: 100%;
  height: 100%;
}

.map-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  text-align: center;
  padding: 2rem;
}

@media (max-width: 900px) {
  .address-viewer-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
