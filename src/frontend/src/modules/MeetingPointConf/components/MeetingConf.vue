<script lang="ts" setup>
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { MeetingPointData } from "../types/meeting-data";
import MeetingPointOptionData from "./MeetingPointOptionData.vue";
import ProductSelector from "@/modules/shared/components/ProductSelector.vue";

const props = defineProps<{
  meetingPointOption: Entity<"ce_meeting_point_option"> | null;
}>();

const emit = defineEmits<{
  (
    e: "update:meetingPointOption",
    value: Entity<"ce_meeting_point_option">,
  ): void;
}>();

const handleProductUpdate = (value: Entity<"product"> | null) => {
  if (!props.meetingPointOption) return;

  // Update the entity properties directly
  props.meetingPointOption.onSelectAddProduct = value;
  props.meetingPointOption.onSelectAddProductId = value?.id || null;

  emit("update:meetingPointOption", props.meetingPointOption);
};

const handleMeetingPointDataUpdate = (value: MeetingPointData) => {
  if (!props.meetingPointOption) return;

  // Update the entity property directly
  props.meetingPointOption.meetingPointOptionData = value as Record<
    string,
    unknown
  >;

  emit("update:meetingPointOption", props.meetingPointOption);
};
</script>

<template>
  <div class="ewt-form-row meeting-conf-grid">
    <div class="ewt-form-col">
      <div class="section-card">
        <label class="ewt-form-label">Meeting point content</label>
        <p class="section-hint">
          Define localized title and description, and choose between manual
          input or a predefined select list.
        </p>
        <MeetingPointOptionData
          :meetingPointOptionData="meetingPointOption?.meetingPointOptionData"
          @update:meetingPointData="handleMeetingPointDataUpdate"
        />
      </div>
    </div>
    <div class="ewt-form-col">
      <div class="section-card">
        <label class="ewt-form-label">On select: add product</label>
        <p class="section-hint">
          When a meeting point is selected, this product will be added
          automatically.
        </p>
        <ProductSelector
          :modelValue="meetingPointOption?.onSelectAddProduct"
          @update:modelValue="handleProductUpdate"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.meeting-conf-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meeting-conf-grid > .ewt-form-col {
  width: 100%;
}

.section-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
}

.ewt-help-text {
  color: #5f6b7a;
  margin: 6px 0 16px;
  font-size: 13px;
}

.section-hint {
  color: #6b7280;
  margin: 4px 0 12px;
  font-size: 12px;
}
</style>
