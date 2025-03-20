<script lang="ts" setup>
import { defineProps } from "vue";
defineProps<{
  rule: EntitySchema.Entities["ce_room_sale_rule"];
}>();

/** interface ce_room_sale_rule {
    id: string;
    minAdults: number;
    maxAdults: number;
    minChildren: number;
    maxChildren: number;
    supplementRule?: Entity<"ce_room_supplement_rule">;
  } */
</script>

<template>
  <div>
    <div class="form-group">
      <label for="minAdults">Minimum Adults</label>
      <input id="minAdults" v-model="rule.minAdults" type="number" />
    </div>
    <div class="form-group">
      <label for="maxAdults">Maximum Adults</label>
      <input id="maxAdults" v-model="rule.maxAdults" type="number" />
    </div>
    <div class="form-group">
      <label for="minChildren">Minimum Children</label>
      <input id="minChildren" v-model="rule.minChildren" type="number" />
    </div>
    <div class="form-group">
      <label for="maxChildren">Maximum Children</label>
      <input id="maxChildren" v-model="rule.maxChildren" type="number" />
    </div>
  </div>
</template>
