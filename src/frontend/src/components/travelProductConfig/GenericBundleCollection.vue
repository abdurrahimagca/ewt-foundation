<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useTravelProductConfigStore } from "../../store/useTravelProductBundleStore";
import NewProductSelector from "../common/NewProductSelector.vue";
import GenericBundle from "./GenericBundle.vue";

const store = useTravelProductConfigStore();
const { entityData } = storeToRefs(store);
</script>

<template>
  <div v-if="entityData?.genericBundles && entityData.genericBundles.length">
    <div
      v-for="bundle in entityData.genericBundles"
      :key="bundle.id"
      class="ewt-card-detail"
    >
      <GenericBundle :d="bundle" :key="bundle.id" />
    </div>
  </div>
  <div v-else class="ewt-empty-state">No Generic Bundles Found</div>
</template>

<style scoped>
.ewt-card-detail {
  border: 1px solid #e5e7eb;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background: white;
}
</style>
