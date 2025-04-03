<script lang="ts" setup>
import { data, notification } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { watch } from "vue";
import NewProductSelector from "../common/NewProductSelector.vue";
import { useTravelProductConfigStore } from "../../store/useTravelProductBundleStore";

const props = defineProps<{
  d: Entity<"ce_generic_bundle">;
}>();
const { refreshState } = useTravelProductConfigStore();

// Watch parentProducts changes
watch(
  () => props.d.parentProducts,
  async (newVal) => {
    if (newVal?.length > 0) {
      props.d.parentProducts = newVal;
      await data.repository("product").saveAll(props.d.parentProducts);
      await data.repository("ce_generic_bundle").save(props.d);
      await refreshState();

      notification.dispatch({
        title: "Success",
        message: "Parent products saved successfully.",
      });
    }
  },
  { deep: true, immediate: false },
);

// Watch productOptions changes
watch(
  () => props.d.productOptions,
  async (newVal) => {
    if (newVal?.length > 0) {
      props.d.productOptions = newVal;
      await data.repository("product").saveAll(props.d.productOptions);
      await data.repository("ce_generic_bundle").save(props.d);
      await refreshState();
      notification.dispatch({
        title: "Success",
        message: "Product options saved successfully.",
      });
    }
  },

  { deep: true, immediate: false },
);
</script>

<template>
  <div v-if="d.isNew()">New Bundle</div>
  <div>ID: {{ d.id }}</div>

  <NewProductSelector :selecteds="d.parentProducts" />
  <NewProductSelector :selecteds="d.productOptions" />

  <div class="ewt-form-group">
    <label class="ewt-form-label">Available On Min Parent Quantity</label>
    <input
      v-model="d.availableOnMinParentQuantity"
      type="number"
      class="ewt-input"
    />
  </div>

  <div class="ewt-form-group">
    <label class="ewt-form-label">Available On Max Parent Quantity</label>
    <input
      v-model="d.availableOnMaxParentQuantity"
      type="number"
      class="ewt-input"
    />
  </div>

  <div class="rm-group">
    <label class="ewt-form-label">Is Parent Operator And?</label>
    <input
      v-model="d.isParentOperatorAnd"
      type="checkbox"
      class="ewt-checkbox"
    />
  </div>

  <div class="ewt-form-group">
    <label class="ewt-form-label">Match Parent Quantity</label>
    <input
      v-model="d.matchParentQuantity"
      type="checkbox"
      class="ewt-checkbox"
    />
  </div>

  <div class="ewt-form-group">
    <label class="ewt-form-label">Match Travellers</label>
    <input v-model="d.matchTravellers" type="checkbox" class="ewt-checkbox" />
  </div>

  <div class="ewt-form-group">
    <label class="ewt-form-label">Allow Multiple</label>
    <input
      v-model="d.allowMultipleSelection"
      type="checkbox"
      class="ewt-checkbox"
    />
  </div>

  <div class="ewt-form-group">
    <label class="ewt-form-label">Is Required</label>
    <input v-model="d.isRequired" type="checkbox" class="ewt-checkbox" />
  </div>

  <div class="ewt-form-group">
    <label class="ewt-form-label">Propaganda Text</label>
    <input v-model="d.propagandaText" type="text" class="ewt-input" />
  </div>
</template>
