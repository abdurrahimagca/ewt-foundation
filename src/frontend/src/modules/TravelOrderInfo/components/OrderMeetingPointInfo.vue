<script lang="ts" setup>
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import MeetingConf from "@/modules/MeetingPointConf/components/MeetingConf.vue";

const props = defineProps<{
  orderMeetingPointInfo: Entity<"ce_order_meeting_point_info"> | null;
}>();

const emit = defineEmits<{
  (
    e: "update:orderMeetingPointInfo",
    value: Entity<"ce_order_meeting_point_info">,
  ): void;
}>();

const handleMeetingPointOptionUpdate = (
  value: Entity<"ce_meeting_point_option">,
) => {
  if (!props.orderMeetingPointInfo) return;

  // Update the meeting point option
  props.orderMeetingPointInfo.meetingPointOption = value;
  props.orderMeetingPointInfo.meetingPointOptionId = value.id;

  emit("update:orderMeetingPointInfo", props.orderMeetingPointInfo);
};

const handleManualInputUpdate = () => {
  if (!props.orderMeetingPointInfo) return;
  emit("update:orderMeetingPointInfo", props.orderMeetingPointInfo);
};
</script>

<template>
  <div class="ewt-form-group">
    <div class="ewt-form-group-header">
      <h3 class="ewt-form-group-title">Order Meeting Point Info</h3>
    </div>
    <div class="ewt-form-row">
      <div class="ewt-form-col">
        <label class="ewt-form-label">Meeting Point Manual Input</label>
        <input
          type="text"
          class="ewt-input"
          v-model="orderMeetingPointInfo?.meetingPointOptionManualInput"
          @input="handleManualInputUpdate"
          placeholder="Enter manual meeting point information"
        />
      </div>
    </div>

    <!-- Meeting Point Configuration (the extra point) -->
    <div class="ewt-form-row">
      <div class="ewt-form-col">
        <label class="ewt-form-label">Meeting Point Configuration</label>
        <MeetingConf
          :meetingPointOption="
            orderMeetingPointInfo?.meetingPointOption || null
          "
          @update:meetingPointOption="handleMeetingPointOptionUpdate"
        />
      </div>
    </div>
  </div>
</template>
