<script lang="ts" setup>
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
defineProps<{
  staticDate: Entity<"ce_static_date_opt"> | null;
}>();
</script>
<template>
  <div>
    <h1>Static Date Opt</h1>
    <div v-if="!staticDate">
      <p>No static date opt found</p>
    </div>
    <div v-if="staticDate">
      <input type="date" v-model="staticDate.startDate" />
      <input type="date" v-model="staticDate.endDate" />
      <input type="number" v-model="staticDate.durationInDays" />
    </div>
  </div>
</template>
