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
    <div class="flight-header">
      <div class="input-group">
        <label><strong>Airline</strong></label>
        <input v-model="flightInfo.airline" placeholder="Enter airline name" />
      </div>
      <div class="input-group">
        <label><strong>Flight Number</strong></label>
        <input
          v-model="flightInfo.flightNumber"
          placeholder="Enter flight number"
        />
      </div>
    </div>

    <div class="flight-dates">
      <div class="flight-date">
        <div class="airport-section">
          <label><strong>Departure Airport</strong></label>
          <input
            v-model="flightInfo.departureAirport"
            placeholder="Enter departure airport"
          />
        </div>
        <div class="date-section">
          <label><strong>Departure Date</strong></label>
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
      </div>

      <div class="flight-date">
        <div class="airport-section">
          <label><strong>Return Airport</strong></label>
          <input
            v-model="flightInfo.arrivalAirport"
            placeholder="Enter return airport"
          />
        </div>
        <div class="date-section">
          <label><strong>Return Date</strong></label>
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
  </div>
</template>

<style scoped>
.flight-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.flight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.flight-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.flight-dates {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.flight-date {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.flight-divider {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #e1e1e1;
}

.plane-icon {
  font-size: 20px;
}

.input-group {
  margin-bottom: 16px;
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
