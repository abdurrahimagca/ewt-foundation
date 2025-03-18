<script lang="ts" setup>
import { defineProps } from "vue";
import { CeTravelOrderInfo } from "../../../internal/types/ce_travel_order_info";

const props = defineProps<{
  flightInfo: NonNullable<CeTravelOrderInfo["flightInfo"]>;
}>();
</script>

<template>
  <div class="flight-card">
    <p><strong>Airline:</strong> {{ flightInfo.airline }}</p>
    <p><strong>Flight Number:</strong> {{ flightInfo.flightNumber }}</p>
    <div class="flight-dates">
      <div class="flight-date">
        <p><strong>Departure:</strong></p>
        <p>{{ flightInfo.departureAirport }}</p>
        <p>{{ flightInfo.returnDate }}</p>
      </div>
      <div class="flight-date">
        <p><strong>Return:</strong></p>
        <p>{{ flightInfo.arrivalAirport }}</p>
        <p>{{ flightInfo.arrivalDate }}</p>
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
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.flight-date {
  text-align: center;
}
</style>
