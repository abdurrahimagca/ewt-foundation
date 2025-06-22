<script lang="ts" setup>
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { computed } from "vue";
import { dateRangeSchema } from "../types/dateType";

const props = defineProps<{
  dateRange: Entity<"ce_date_range"> | null;
}>();
const parsedDateRange = computed(() => {
  if (!props.dateRange) {
    return null;
  }
  return dateRangeSchema.safeParse(props.dateRange.dateRangeData);
});

const addDateRange = () => {
  if (parsedDateRange.value?.data) {
    parsedDateRange.value.data.dateRange.push({
      startFrom: new Date(),
      endTo: new Date(),
    });
  }
};

const removeDateRange = (date: { startFrom: Date; endTo: Date }) => {
  if (parsedDateRange.value?.data) {
    parsedDateRange.value.data.dateRange = parsedDateRange.value.data.dateRange.filter(d => d !== date);
  }
};
</script>
<template>
  <div>
    <h1>Date Range</h1>
    <div v-if="!dateRange">
      <p>No date range found</p>
    </div>
    <div v-if="dateRange">
      <div
        v-for="date in parsedDateRange?.data?.dateRange"
        :key="date.startFrom.toISOString()"
      >
        <input type="date" v-model="date.startFrom" />
        <input type="date" v-model="date.endTo" />
        <button @click="addDateRange">Add</button>
        <button @click="removeDateRange(date)">Remove</button>
      </div>

      <input type="number" v-model="dateRange.maxDurationInDays" />
      <input type="number" v-model="dateRange.minDurationInDays" />
    </div>
  </div>
</template>
