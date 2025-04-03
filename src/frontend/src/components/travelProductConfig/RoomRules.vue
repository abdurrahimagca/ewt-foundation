<script lang="ts" setup>
import { defineProps } from "vue";
import Supplement from "./Supplement.vue";
import { data } from "@shopware-ag/meteor-admin-sdk";
const props = defineProps<{
  rule: EntitySchema.Entities["ce_room_sale_rule"];
}>();

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
      <div class="ewt-form-group">
        <label for="childrenStartAge" class="ewt-form-label"
          >Children Start Age</label
        >
        <input
          id="childrenStartAge"
          v-model="rule.childrenStartAge"
          min="0"
          type="number"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="childrenEndAge" class="ewt-form-label"
          >Children End Age</label
        >
        <input
          id="childrenStartAge"
          v-model="rule.childrenEndAge"
          min="0"
          type="number"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="minInfants" class="ewt-form-label">Minimum Infants</label>
        <input
          id="minInfants"
          v-model="rule.minInfants"
          min="0"
          type="number"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="maxInfants" class="ewt-form-label">Maximum Infants</label>
        <input
          id="maxInfants"
          v-model="rule.maxInfants"
          min="0"
          type="number"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="maxTotalPersons" class="ewt-form-label"
          >Maximum Total Persons</label
        >
        <input
          id="maxTotalPersons"
          v-model="rule.maxTotalPersons"
          min="1"
          type="number"
          class="ewt-input"
        />
      </div>
      <div class="ewt-form-group">
        <label for="allowPets" class="ewt-form-label">Allow Pets</label>
        <input
          id="allowPets"
          v-model="rule.allowPets"
          type="checkbox"
          class="ewt-checkbox"
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
