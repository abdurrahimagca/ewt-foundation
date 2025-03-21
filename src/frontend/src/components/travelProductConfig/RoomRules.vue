<script lang="ts" setup>
import { defineProps } from "vue";
import Supplement from "./Supplement.vue";
import { data } from "@shopware-ag/meteor-admin-sdk";
const props = defineProps<{
  rule: EntitySchema.Entities["ce_room_sale_rule"];
}>();

/** interface ce_room_sale_rule {
    id: string;
    minAdults: number;
    maxAdults: number;
    minChildren: number;
    maxChildren: number;
    supplementRule?: Entity<"ce_room_supplement_rule">;
  } */

async function createSupplementRule() {
  const repo = data.repository("ce_room_supplement_rule");
  const newSupplementRule = await repo.create();
  if (newSupplementRule === null) {
    throw new Error("Could not create new supplement rule");
  }
  props.rule.supplementRule = newSupplementRule;
}
</script>

<template>
  <div class="ewt-card-detail">
    <div class="ewt-grid-2">
      <div class="ewt-form-group">
        <label for="minAdults" class="ewt-form-label">Minimum Adults</label>
        <input
          id="minAdults"
          v-model="rule.minAdults"
          min="1"
          type="number"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="maxAdults" class="ewt-form-label">Maximum Adults</label>
        <input
          id="maxAdults"
          v-model="rule.maxAdults"
          min="1"
          type="number"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="minChildren" class="ewt-form-label">Minimum Children</label>
        <input
          id="minChildren"
          v-model="rule.minChildren"
          min="1"
          type="number"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="maxChildren" class="ewt-form-label">Maximum Children</label>
        <input
          id="maxChildren"
          v-model="rule.maxChildren"
          min="1"
          type="number"
          class="ewt-input"
        />
      </div>
    </div>
    <div class="ewt-button-group">
      <button @click="createSupplementRule" class="ewt-btn ewt-btn--primary">
        Add Supplement
      </button>
    </div>
    <div v-if="rule.supplementRule" class="ewt-mt-4">
      <Supplement :inheritedData="rule.supplementRule" />
    </div>
  </div>
</template>

<style scoped>
/* Remove all styles as they're now in styles.css */
</style>
