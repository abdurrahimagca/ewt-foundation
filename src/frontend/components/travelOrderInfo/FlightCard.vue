<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps<{
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
  <div class="flight-card">
    <div class="input-group">
      <label><strong>Airline:</strong></label>
      <input v-model="flightInfo.airline" />
    </div>
    <div class="input-group">
      <label><strong>Flight Number:</strong></label>
      <input v-model="flightInfo.flightNumber" />
    </div>
    <div class="flight-dates">
      <div class="flight-date">
        <label><strong>Departure Airport:</strong></label>
        <input v-model="flightInfo.departureAirport" />
        <label><strong>Departure Date:</strong></label>
        <input
          type="datetime-local"
          :value="formatDateForInput(flightInfo.arrivalDate)"
          @input="
            (e) =>
              (flightInfo.arrivalDate = formatDateForSave(
                (e.target as HTMLInputElement).value,
              ))
          "
        />
      </div>
      <div class="flight-date">
        <label><strong>Return Airport:</strong></label>
        <input v-model="flightInfo.arrivalAirport" />
        <label><strong>Return Date:</strong></label>
        <input
          type="datetime-local"
          :value="formatDateForInput(flightInfo.returnDate)"
          @input="
            (e) =>
              (flightInfo.returnDate = formatDateForSave(
                (e.target as HTMLInputElement).value,
              ))
          "
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.flight-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.flight-dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

.flight-date {
  text-align: left;
}

label {
  display: block;
  margin-bottom: 4px;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #189eff;
}

div {
  margin-bottom: 12px;
}

.input-group {
  margin-bottom: 16px;
}

input[type="datetime-local"] {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input[type="datetime-local"]:focus {
  outline: none;
  border-color: #189eff;
}
</style>
