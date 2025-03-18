<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps<{
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
  <div class="traveller-card" v-for="(person, index) in traveller" :key="index">
    <div class="traveller-info">
      <div class="input-group">
        <label><strong>Name:</strong></label>
        <input v-model="person.name" type="text" />
      </div>
      <div class="input-group">
        <label><strong>Surname:</strong></label>
        <input v-model="person.surname" type="text" />
      </div>
      <div class="input-group">
        <label><strong>Birthdate:</strong></label>
        <input
          type="datetime-local"
          :value="formatDateForInput(person.birthdate)"
          @input="
            (e) =>
              (person.birthdate = formatDateForSave(
                (e.target as HTMLInputElement).value,
              ))
          "
        />
      </div>
      <div class="input-group">
        <label><strong>Email:</strong></label>
        <input v-model="person.email" type="email" />
      </div>
      <div class="input-group">
        <label><strong>Phone:</strong></label>
        <input v-model="person.phone" type="tel" />
      </div>
      <div class="input-group">
        <label><strong>Passport:</strong></label>
        <input v-model="person.passportNumber" type="text" />
      </div>
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

.input-group {
  margin-bottom: 12px;
}

.input-group label {
  display: block;
  margin-bottom: 4px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #189eff;
}

input[type="datetime-local"] {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input[type="datetime-local"]:focus {
  outline: none;
  border-color: #189eff;
}
</style>
