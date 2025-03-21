<script lang="ts" setup>
import { defineProps } from "vue";

 defineProps<{
  flightInfo: EntitySchema.Entities["ce_flight_info"];
}>();

// Helper functions for date formatting
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
};

const formatDateForSave = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString(); // Format: YYYY-MM-DDTHH:mm:ss.sssZ
};
</script>

<template>
  <div class="ewt-card-detail">
    <div class="ewt-flight-header">
      <div class="ewt-form-group">
        <label class="ewt-form-label"><strong>Airline</strong></label>
        <input v-model="flightInfo.airline" placeholder="Enter airline name" class="ewt-input" />
      </div>
      <div class="ewt-form-group">
        <label class="ewt-form-label"><strong>Flight Number</strong></label>
        <input v-model="flightInfo.flightNumber" placeholder="Enter flight number" class="ewt-input" />
      </div>
    </div>

    <div class="ewt-flight-dates">
      <div class="ewt-grid-2">
        <div class="ewt-form-group">
          <label class="ewt-form-label"><strong>Departure Airport</strong></label>
          <input
            v-model="flightInfo.departureAirport"
            placeholder="Enter departure airport"
            class="ewt-input"
          />
        </div>
        <div class="ewt-form-group">
          <label class="ewt-form-label"><strong>Departure Date</strong></label>
          <input
            type="datetime-local"
            :value="formatDateForInput(flightInfo.arrivalDate)"
            @input="(e) => (flightInfo.arrivalDate = formatDateForSave((e.target as HTMLInputElement).value))"
            class="ewt-input ewt-input--datetime"
          />
        </div>
      </div>

      <div class="ewt-grid-2">
        <div class="ewt-form-group">
          <label class="ewt-form-label"><strong>Return Airport</strong></label>
          <input
            v-model="flightInfo.arrivalAirport"
            placeholder="Enter return airport"
            class="ewt-input"
          />
        </div>
        <div class="ewt-form-group">
          <label class="ewt-form-label"><strong>Return Date</strong></label>
          <input
            type="datetime-local"
            :value="formatDateForInput(flightInfo.returnDate)"
            @input="(e) => (flightInfo.returnDate = formatDateForSave((e.target as HTMLInputElement).value))"
            class="ewt-input ewt-input--datetime"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Remove all scoped styles since we're using shared styles.css */
</style>
