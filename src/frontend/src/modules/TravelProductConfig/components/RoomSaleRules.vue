<script setup lang="ts">
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import Supplement from "./Supplement.vue";
import { data } from "@shopware-ag/meteor-admin-sdk";

const props = defineProps<{
  swData: Entity<"ce_room_sale_rule">;
}>();
import { useTravelProductConfig } from "../store/useTravelProductConfig";
const store = useTravelProductConfig();
async function handleCreateSupplementRuleResource() {
  const newSupplementRule = await store.createFreshEntity(
    "ce_room_supplement_rule",
  );
  if (newSupplementRule === null) {
    throw new Error("Could not create new supplement rule");
  }

  props.swData.supplementRule = newSupplementRule;
}
</script>
<template>
  <div v-if="swData" class="ewt-form-group">
    <h4 class="ewt-form-title">Occupancy Configuration</h4>

    <div class="ewt-grid ewt-grid--2">
      <!-- Adults -->
      <div class="ewt-form-group">
        <label class="ewt-form-label">Adults</label>
        <div class="ewt-flex">
          <div class="ewt-form-group" style="flex: 1">
            <label class="ewt-form-label">Minimum</label>
            <input
              v-model="swData.minAdults"
              type="number"
              class="ewt-input"
              placeholder="Min adults"
            />
          </div>
          <div class="ewt-form-group" style="flex: 1">
            <label class="ewt-form-label">Maximum</label>
            <input
              v-model="swData.maxAdults"
              type="number"
              class="ewt-input"
              placeholder="Max adults"
            />
          </div>
        </div>
      </div>

      <!-- Children -->
      <div class="ewt-form-group">
        <label class="ewt-form-label">Children</label>
        <div class="ewt-flex">
          <div class="ewt-form-group" style="flex: 1">
            <label class="ewt-form-label">Minimum</label>
            <input
              v-model="swData.minChildren"
              type="number"
              class="ewt-input"
              placeholder="Min children"
            />
          </div>
          <div class="ewt-form-group" style="flex: 1">
            <label class="ewt-form-label">Maximum</label>
            <input
              v-model="swData.maxChildren"
              type="number"
              class="ewt-input"
              placeholder="Max children"
            />
          </div>
        </div>
      </div>

      <!-- Children Age Range -->
      <div class="ewt-form-group">
        <label class="ewt-form-label">Children Age Range</label>
        <div class="ewt-flex">
          <div class="ewt-form-group" style="flex: 1">
            <label class="ewt-form-label">Start Age</label>
            <input
              v-model="swData.childrenStartAge"
              type="number"
              class="ewt-input"
              placeholder="Start age"
            />
          </div>
          <div class="ewt-form-group" style="flex: 1">
            <label class="ewt-form-label">End Age</label>
            <input
              v-model="swData.childrenEndAge"
              type="number"
              class="ewt-input"
              placeholder="End age"
            />
          </div>
        </div>
      </div>

      <!-- Infants -->
      <div class="ewt-form-group">
        <label class="ewt-form-label">Infants</label>
        <div class="ewt-flex">
          <div class="ewt-form-group" style="flex: 1">
            <label class="ewt-form-label">Minimum</label>
            <input
              v-model="swData.minInfants"
              type="number"
              class="ewt-input"
              placeholder="Min infants"
            />
          </div>
          <div class="ewt-form-group" style="flex: 1">
            <label class="ewt-form-label">Maximum</label>
            <input
              v-model="swData.maxInfants"
              type="number"
              class="ewt-input"
              placeholder="Max infants"
            />
          </div>
        </div>
      </div>

      <!-- Total Persons and Pets -->
      <div class="ewt-form-group">
        <label class="ewt-form-label">Maximum Total Persons</label>
        <input
          v-model="swData.maxTotalPersons"
          type="number"
          class="ewt-input"
          placeholder="Max total persons"
        />
      </div>

      <div class="ewt-form-group">
        <div class="ewt-checkbox-group">
          <input
            v-model="swData.allowPets"
            type="checkbox"
            class="ewt-checkbox"
          />
          <label class="ewt-checkbox-label">Allow Pets</label>
        </div>
      </div>
    </div>
    <div v-if="swData.supplementRule">
      <Supplement :sw-data="swData.supplementRule" />
    </div>
    <div v-else>
      <button
        class="ewt-button ewt-button--primary"
        @click="handleCreateSupplementRuleResource"
      >
        <span class="ewt-button--secondary"
          >Initialize Supplement Rule Resource</span
        >
      </button>
    </div>
  </div>
</template>
