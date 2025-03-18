<script lang="ts" setup>
import { defineProps, defineEmits, reactive, watch } from "vue";
import { CeTravelOrderInfo } from "../../../internal/types/ce_travel_order_info";

const props = defineProps<{
  flightInfo: NonNullable<CeTravelOrderInfo["flightInfo"]>;
}>();

const emit = defineEmits(["update"]);

// flightInfo'yu reactive nesne olarak oluştur
const localFlightInfo = reactive({ ...props.flightInfo });

watch(
  () => props.flightInfo,
  (newValue) => {
    Object.assign(localFlightInfo, newValue);
  },
  { deep: true, immediate: true },
);

watch(
  localFlightInfo,
  (newValue) => {
    emit("update", { ...newValue });
  },
  { deep: true },
);
</script>

<template>
  <div class="flight-card">
    <div>
      <label><strong>Airline:</strong></label>
      <input v-model="localFlightInfo.airline" />
    </div>
    <div>
      <label><strong>Flight Number:</strong></label>
      <input v-model="localFlightInfo.flightNumber" />
    </div>
    <div class="flight-dates">
      <div class="flight-date">
        <label><strong>Departure:</strong></label>
        <input v-model="localFlightInfo.departureAirport" />
        <input type="text" v-model="localFlightInfo.arrivalDate" />
      </div>
      <div class="flight-date">
        <label><strong>Return:</strong></label>
        <input v-model="localFlightInfo.arrivalAirport" />
        <input type="text" v-model="localFlightInfo.returnDate" />
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

input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
