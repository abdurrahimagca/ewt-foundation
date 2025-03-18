<script lang="ts" setup>
import { defineProps } from "vue";
import { CeTravelOrderInfo } from "../../../internal/types/ce_travel_order_info";

const props = defineProps<{
  traveller: CeTravelOrderInfo["travellers"];
}>();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<template>
  <div class="traveller-card" v-for="(person, index) in traveller" :key="index">
    <div class="traveller-info">
      <p><strong>Name:</strong> {{ person.name }} {{ person.surname }}</p>
      <p><strong>Birthdate:</strong> {{ formatDate(person.birthdate) }}</p>
      <p><strong>Email:</strong> {{ person.email }}</p>
      <p><strong>Phone:</strong> {{ person.phone }}</p>
      <p><strong>Passport:</strong> {{ person.passportNumber }}</p>
    </div>
  </div>
</template>

<style scoped>
.traveller-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.traveller-info p {
  margin: 8px 0;
}
</style>
