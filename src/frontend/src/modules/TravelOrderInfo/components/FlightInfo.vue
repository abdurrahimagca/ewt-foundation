<script lang="ts" setup>
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import { ref, computed } from "vue";

const props = defineProps<{
  flightInfo: EntityCollection<"ce_flight_info"> | null;
}>();

const emit = defineEmits<{
  (e: "update:flightInfo", value: EntityCollection<"ce_flight_info">): void;
}>();

const formErrors = ref<Record<string, string>>({});

const validateForm = () => {
  const errors: Record<string, string> = {};
  props.flightInfo?.forEach((flight) => {
    if (!flight.flightNumber) {
      errors.flightNumber = "Flight number is required";
    }
    if (!flight.flightDepartureDate) {
      errors.departureDate = "Departure date is required";
    }
    if (!flight.flightArrivalDate) {
      errors.arrivalDate = "Arrival date is required";
    }
  });
  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const handleUpdate = () => {
  if (validateForm() && props.flightInfo) {
    emit("update:flightInfo", props.flightInfo);
  }
};

const formatDateForInput = (date: string | null) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
};

const formatDateForDisplay = (date: string | null) => {
  if (!date) return "";
  return new Date(date).toLocaleString();
};
</script>

<template>
  <div class="ewt-grid ewt-grid--2">
    <div v-for="flight in flightInfo" :key="flight.id" class="ewt-form-group">
      <div class="ewt-form-group-header">
        <h3 class="ewt-form-group-title">Flight Details</h3>
      </div>

      <div class="ewt-form-row">
        <div class="ewt-form-col">
          <label class="ewt-form-label">Flight Number</label>
          <input
            type="text"
            class="ewt-input"
            v-model="flight.flightNumber"
            :class="{ 'ewt-input--error': formErrors.flightNumber }"
            @input="handleUpdate"
          />
          <div v-if="formErrors.flightNumber" class="ewt-error-text">
            {{ formErrors.flightNumber }}
          </div>
        </div>
      </div>

      <div class="ewt-form-row">
        <div class="ewt-form-col">
          <label class="ewt-form-label">Departure</label>
          <div class="ewt-input-group">
            <input
              type="datetime-local"
              class="ewt-input ewt-input--date"
              :value="formatDateForInput(flight.flightDepartureDate)"
              @input="
                (e: Event) => {
                  flight.flightDepartureDate = (
                    e.target as HTMLInputElement
                  ).value;
                  handleUpdate();
                }
              "
              :class="{ 'ewt-input--error': formErrors.departureDate }"
            />
            <div class="ewt-input-hint">
              {{ formatDateForDisplay(flight.flightDepartureDate) }}
            </div>
          </div>
          <div v-if="formErrors.departureDate" class="ewt-error-text">
            {{ formErrors.departureDate }}
          </div>
        </div>

        <div class="ewt-form-col">
          <label class="ewt-form-label">Arrival</label>
          <div class="ewt-input-group">
            <input
              type="datetime-local"
              class="ewt-input ewt-input--date"
              :value="formatDateForInput(flight.flightArrivalDate)"
              @input="
                (e: Event) => {
                  flight.flightArrivalDate = (
                    e.target as HTMLInputElement
                  ).value;
                  handleUpdate();
                }
              "
              :class="{ 'ewt-input--error': formErrors.arrivalDate }"
            />
            <div class="ewt-input-hint">
              {{ formatDateForDisplay(flight.flightArrivalDate) }}
            </div>
          </div>
          <div v-if="formErrors.arrivalDate" class="ewt-error-text">
            {{ formErrors.arrivalDate }}
          </div>
        </div>
      </div>

      <div class="ewt-form-row">
        <div class="ewt-form-col">
          <label class="ewt-form-label">Departure Airport</label>
          <input
            type="text"
            class="ewt-input"
            v-model="flight.flightDepartureAirport"
            :class="{ 'ewt-input--error': formErrors.departureAirport }"
            @input="handleUpdate"
          />
          <div v-if="formErrors.departureAirport" class="ewt-error-text">
            {{ formErrors.departureAirport }}
          </div>
        </div>

        <div class="ewt-form-col">
          <label class="ewt-form-label">Arrival Airport</label>
          <input
            type="text"
            class="ewt-input"
            v-model="flight.flightArrivalAirport"
            :class="{ 'ewt-input--error': formErrors.arrivalAirport }"
            @input="handleUpdate"
          />
          <div v-if="formErrors.arrivalAirport" class="ewt-error-text">
            {{ formErrors.arrivalAirport }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
