<script setup lang="ts">
import { useTravelProductConfig } from "../store/useTravelProductConfig";
import { computed } from "vue";
import { storeToRefs } from "pinia";

const store = useTravelProductConfig();

const swData = computed(
  () => storeToRefs(store).dataToEdit.value?.noAccommodationConfig,
);
</script>

<template>
  <div v-if="swData" class="ewt-grid ewt-grid--2">
    <div class="ewt-form-group">
      <label class="ewt-form-label">Min Adults</label>
      <input v-model="swData.minAdults" type="number" class="ewt-input" />
    </div>
    <div class="ewt-form-group">
      <label class="ewt-form-label">Max Adults</label>
      <input v-model="swData.maxAdults" type="number" class="ewt-input" />
    </div>
    <div class="ewt-form-group">
      <label class="ewt-form-label">Min Children</label>
      <input v-model="swData.minChildren" type="number" class="ewt-input" />
    </div>
    <div class="ewt-form-group">
      <label class="ewt-form-label">Max Children</label>
      <input v-model="swData.maxChildren" type="number" class="ewt-input" />
    </div>
    <div class="ewt-form-group">
      <label class="ewt-form-label">Min Infants</label>
      <input v-model="swData.minInfants" type="number" class="ewt-input" />
    </div>
    <div class="ewt-form-group">
      <label class="ewt-form-label">Max Infants</label>
      <input v-model="swData.maxInfants" type="number" class="ewt-input" />
    </div>
    <div class="ewt-form-group">
      <label class="ewt-form-label">Min Total Persons</label>
      <input v-model="swData.minTotalPersons" type="number" class="ewt-input" />
    </div>
    <div class="ewt-form-group">
      <label class="ewt-form-label">Max Total Persons</label>
      <input v-model="swData.maxTotalPersons" type="number" class="ewt-input" />
    </div>
  </div>
</template>
