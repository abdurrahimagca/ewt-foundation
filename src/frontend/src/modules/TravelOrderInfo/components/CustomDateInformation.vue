<script lang="ts" setup>
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { onMounted, ref } from "vue";
import {
  customDateOrderInformationSchema,
  CustomDateOrderInformation,
} from "../types/travelCustomDate";
import AddressViewer from "@/modules/shared/components/AddressViewer.vue";

const props = defineProps<{
  customDateInformation: Entity<"ce_custom_date_information"> | null;
}>();
const data = ref<CustomDateOrderInformation | undefined>(undefined);
const isLoading = ref(true);
const error = ref<string | undefined>(undefined);

onMounted(() => {
  if (props.customDateInformation) {
    data.value = customDateOrderInformationSchema.parse(
      props.customDateInformation.customDateInformation,
    );
  } else {
    error.value = "No custom date information found";
  }
  isLoading.value = false;
});
</script>
<template>
  <div v-if="data" class="ewt-custom-date-information">
    <div class="ewt-form-group">
      <label for="startDate">Start Date</label>
      <input
        type="date"
        id="startDate"
        v-model="data.customDateInformation.startDate"
      />
    </div>
    <div class="ewt-form-group">
      <label for="endDate">End Date</label>
      <input
        type="date"
        id="endDate"
        v-model="data.customDateInformation.endDate"
      />
    </div>
    <div class="ewt-form-group">
      <label for="durationInDays">Duration in Days</label>
      <input
        type="number"
        id="durationInDays"
        v-model="data.customDateInformation.durationInDays"
      />
    </div>
    <div class="ewt-form-group">
      <AddressViewer
        :modelValue="data.pickUpInformation.pickUpLocation"
        :isEditable="true"
      />
    </div>
  </div>
</template>
