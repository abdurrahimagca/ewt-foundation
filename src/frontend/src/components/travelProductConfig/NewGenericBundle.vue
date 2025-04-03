<script lang="ts" setup>
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import NewGenericBundleNode from "./NewGenericBundleNode.vue";

defineProps<{
  inheritedData: EntityCollection<"ce_generic_bundle">;
}>();
</script>

<template>
  <div v-if="inheritedData && inheritedData !== null" class="ewt-card-detail">
    <div v-for="bundle in inheritedData" :key="bundle.id">
      <div v-if="bundle.isNew()">this is new</div>

      {{ bundle.id }}
      {{ bundle.__identifier__() }}
      <NewGenericBundleNode :inheritedData="bundle" />
    </div>
  </div>
</template>

<style scoped>
.form-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
}

.ewt-grid-2 {
  max-width: 800px;
}
</style>
