<script lang="ts" setup>
import { defineProps } from "vue";
import { CeTravelOrderInfo } from "../../../internal/types/ce_travel_order_info";

const props = defineProps<{
  flightInfo: EntitySchema.Entities["ce_travel_order_info"]["flightInfo"];
}>();
</script>

<template>
  <div class="flight-card" v-for="(flight, index) in flightInfo" :key="index">
    <p><strong>Airline:</strong> {{ flight.airline }}</p>
    <p><strong>Flight Number:</strong> {{ flight.flightNumber }}</p>
    <div class="flight-dates">
      <div class="flight-date">
        <p><strong>Departure:</strong></p>
        <p>{{ flight.departureAirport }}</p>
        <p>{{ flight.returnDate }}</p>
      </div>
      <div class="flight-date">
        <p><strong>Return:</strong></p>
        <p>{{ flight.arrivalAirport }}</p>
        <p>{{ flight.arrivalDate }}</p>
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
