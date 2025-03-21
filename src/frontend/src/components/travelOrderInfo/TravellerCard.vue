<script lang="ts" setup>
import { defineProps } from "vue";

defineProps<{
  traveller: EntitySchema.Entities["ce_travellers"][];
}>();

// Helper functions for date formatting
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
};

const formatDateForSave = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString(); // Format: YYYY-MM-DDTHH:mm:ss.sssZ
};
</script>

<template>
  <div class="ewt-card-detail" v-for="(person, index) in traveller" :key="index">
    <div class="ewt-traveller-info">
      <div class="ewt-form-group">
        <label class="ewt-form-label"><strong>Name:</strong></label>
        <input v-model="person.name" type="text" class="ewt-input" />
      </div>
      <div class="ewt-form-group">
        <label class="ewt-form-label"><strong>Surname:</strong></label>
        <input v-model="person.surname" type="text" class="ewt-input" />
      </div>
      <div class="ewt-form-group">
        <label class="ewt-form-label"><strong>Birthdate:</strong></label>
        <input
          type="datetime-local"
          :value="formatDateForInput(person.birthdate)"
          @input="(e) => (person.birthdate = formatDateForSave((e.target as HTMLInputElement).value))"
          class="ewt-input ewt-input--datetime"
        />
      </div>
      <div class="ewt-form-group">
        <label class="ewt-form-label"><strong>Email:</strong></label>
        <input v-model="person.email" type="email" class="ewt-input" />
      </div>
      <div class="ewt-form-group">
        <label class="ewt-form-label"><strong>Phone:</strong></label>
        <input v-model="person.phone" type="tel" class="ewt-input" />
      </div>
      <div class="ewt-form-group">
        <label class="ewt-form-label"><strong>Passport:</strong></label>
        <input v-model="person.passportNumber" type="text" class="ewt-input" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Remove all scoped styles since we're using shared styles.css */
</style>
