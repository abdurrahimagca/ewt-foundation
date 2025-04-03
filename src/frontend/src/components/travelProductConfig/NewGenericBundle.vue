<script lang="ts" setup>
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import NewGenericBundleNode from "./NewGenericBundleNode.vue";
import { data } from "@shopware-ag/meteor-admin-sdk";
import { useTravelProductConfigStore } from "../../store/useTravelProductBundleStore";

const store = useTravelProductConfigStore();
const props = defineProps<{
  inheritedData: EntityCollection<"ce_generic_bundle">;
}>();
async function saveChanges() {
  try {
    if (!props.inheritedData) {
      throw new Error("Inherited data is undefined");
    }
    await data.repository("ce_generic_bundle").saveAll(props.inheritedData);
  } catch (e) {
    console.error("Error on saving bundle product: ", e);
  }
}
</script>

<template>
  <pre>{{ JSON.stringify(store.entityData?.genericBundles, null, 2) }}</pre>
  <div v-if="inheritedData && inheritedData !== null" class="ewt-card-detail">
    <button class="ewt-button ewt-button--primary" @click="saveChanges">
      Save Changes
    </button>
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
