<script lang="ts" setup>
import { useSw } from "@/modules/shared/composables/useSw";
import { data } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { ref, onMounted, watch } from "vue";
import { location } from "@shopware-ag/meteor-admin-sdk";
const productId = ref<string | undefined>(undefined);
const dateConfig = ref<Entity<"ce_travel_product_date_config"> | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const sw = useSw();
const { fetchSwEntity } = sw;
onMounted(async () => {
  location.startAutoResizer();
  const result: any = await data.get({
    //todo: validate if this correct id
    id: "sw-product-detail__product",
    selectors: ["id"],
  });

  if (result && result.id) {
    productId.value = result.id;
  }
  location.stopAutoResizer();
});

watch(productId, async (newValue) => {
  if (newValue) {
    try {
      const criteria = new data.Classes.Criteria();
      criteria.addFilter({
        type: "equals",
        field: "productId",
        value: newValue,
      });
      dateConfig.value = await fetchSwEntity(
        "ce_travel_product_date_config",
        criteria,
      );
    } catch (e) {
      error.value = "Failed to fetch date config";
    } finally {
      isLoading.value = false;
    }
  }
});
watch(dateConfig, async (newValue) => {
  if (newValue?.isDateRange && newValue?.isStaticDate) {
    error.value = "Cannot have both date range and static date";
  }
});

const handleSave = async () => {
  if (dateConfig.value) {
    try {
      await sw.saveSwEntity("ce_travel_product_date_config", dateConfig.value);
    } catch (e) {
      error.value = "Failed to save date config";
    }
  }
};

const createDateConfig = async () => {
  const newDateConfig = await sw.createSwEntity(
    "ce_travel_product_date_config",
  );
  if (!newDateConfig) {
    error.value = "Failed to create date config";
    return;
  }
  dateConfig.value = newDateConfig;
};

const createDateRanges = async () => {
  if (dateConfig.value) {
    const data = await sw.createSwEntity("ce_date_range");
    if (!data) {
      error.value = "Failed to create date range";
      return;
    }
    dateConfig.value.dateRanges?.add(data);
  }
};

const createStaticDate = async () => {
  if (dateConfig.value) {
    const data = await sw.createSwEntity("ce_static_date_opt");
    if (!data) {
      error.value = "Failed to create static date";
      return;
    }
    dateConfig.value.staticDate = data;
  }
};
</script>
<template>
  <div>
    <h1>Date Config</h1>
    <div v-if="isLoading">
      <p>Loading...</p>
    </div>
    <div v-if="!dateConfig && !isLoading && !error">
      <p>No date config found</p>
      <button @click="createDateConfig">Create Date Config</button>
    </div>
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
    <div v-if="dateConfig">
      <input
        :disabled="!!dateConfig.isStaticDate"
        type="checkbox"
        v-model="dateConfig.isDateRange"
      />
      <DateRange
        v-if="dateConfig.isDateRange"
        :dateRange="dateConfig.dateRanges"
      />
      <button
        v-if="dateConfig.isDateRange && !dateConfig.dateRanges"
        @click="createDateRanges"
      ></button>
      <input
        :disabled="!!dateConfig.isDateRange"
        type="checkbox"
        v-model="dateConfig.isStaticDate"
      />
      <button
        v-if="dateConfig.isStaticDate && !dateConfig.staticDate"
        @click="createStaticDate"
      ></button>
      <StaticDateOpt
        v-if="dateConfig.isStaticDate"
        :staticDate="dateConfig.staticDate"
      />
      <button @click="handleSave">Save</button>
    </div>
  </div>
</template>
