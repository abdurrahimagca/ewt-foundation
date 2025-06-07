<script lang="ts" setup>
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";
import ProductReadonlyViewer from "./ProductReadonlyViewer.vue";

const props = defineProps<{
  roomProductInfos: EntityCollection<"ce_room_product_detailed_info"> | null;
}>();

const emit = defineEmits<{
  (
    e: "update:roomProductInfos",
    value: EntityCollection<"ce_room_product_detailed_info">,
  ): void;
}>();

const handleUpdate = () => {
  if (props.roomProductInfos) {
    emit("update:roomProductInfos", props.roomProductInfos);
  }
};
</script>

<template>
  <div class="ewt-grid">
    <div v-if="!roomProductInfos?.length" class="ewt-meta-info ewt-mb-3">
      No room information available
    </div>

    <div
      v-for="roomProductInfo in roomProductInfos"
      :key="roomProductInfo.id"
      class="ewt-form-group"
    >
      <div class="ewt-form-group-header">
        <h3 class="ewt-form-group-title">Room Details</h3>
      </div>

      <div class="ewt-grid">
        <ProductReadonlyViewer :id="roomProductInfo.roomProductId" />

        <div class="ewt-form-row">
          <div class="ewt-form-col">
            <label class="ewt-form-label">Number of Adults</label>
            <input
              type="number"
              class="ewt-input"
              v-model="roomProductInfo.numberOfAdults"
              min="0"
              @input="handleUpdate"
            />
          </div>

          <div class="ewt-form-col">
            <label class="ewt-form-label">Number of Children</label>
            <input
              type="number"
              class="ewt-input"
              v-model="roomProductInfo.numberOfChildren"
              min="0"
              @input="handleUpdate"
            />
          </div>

          <div class="ewt-form-col">
            <label class="ewt-form-label">Number of Infants</label>
            <input
              type="number"
              class="ewt-input"
              v-model="roomProductInfo.numberOfInfants"
              min="0"
              @input="handleUpdate"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
