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
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.traveller-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.traveller-info p {
  margin: 8px 0;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

input:focus {
  outline: none;
  border-color: #4a90e2;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

input[type="datetime-local"] {
  width: 100%;
  padding: 9px 12px;
  color: #333;
}
</style>
