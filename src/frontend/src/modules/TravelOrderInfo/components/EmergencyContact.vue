<script lang="ts" setup>
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { ref } from "vue";

const props = defineProps<{
  emergencyContact: Entity<"ce_emergency_contact_information"> | null;
}>();

const emit = defineEmits<{
  (
    e: "update:emergencyContact",
    value: Entity<"ce_emergency_contact_information">,
  ): void;
}>();

const formErrors = ref<Record<string, string>>({});

const validateForm = () => {
  const errors: Record<string, string> = {};

  if (!props.emergencyContact?.contactName) {
    errors.contactName = "Contact name is required";
  }

  if (!props.emergencyContact?.contactSurname) {
    errors.contactSurname = "Contact surname is required";
  }

  if (!props.emergencyContact?.contactPhone) {
    errors.contactPhone = "Contact phone is required";
  }

  if (!props.emergencyContact?.contactEmail) {
    errors.contactEmail = "Contact email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.emergencyContact.contactEmail)
  ) {
    errors.contactEmail = "Invalid email format";
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const handleUpdate = () => {
  if (validateForm() && props.emergencyContact) {
    emit("update:emergencyContact", props.emergencyContact);
  }
};
</script>

<template>
  <div class="ewt-grid ewt-grid--2">
    <div v-if="emergencyContact" class="ewt-form-group">
      <div class="ewt-form-group-header">
        <h3 class="ewt-form-group-title">Contact Details</h3>
      </div>

      <div class="ewt-form-row">
        <div class="ewt-form-col">
          <label class="ewt-form-label">Contact Name</label>
          <input
            type="text"
            class="ewt-input"
            v-model="emergencyContact.contactName"
            :class="{ 'ewt-input--error': formErrors.contactName }"
            @input="handleUpdate"
          />
          <div v-if="formErrors.contactName" class="ewt-error-text">
            {{ formErrors.contactName }}
          </div>
        </div>

        <div class="ewt-form-col">
          <label class="ewt-form-label">Contact Surname</label>
          <input
            type="text"
            class="ewt-input"
            v-model="emergencyContact.contactSurname"
            :class="{ 'ewt-input--error': formErrors.contactSurname }"
            @input="handleUpdate"
          />
          <div v-if="formErrors.contactSurname" class="ewt-error-text">
            {{ formErrors.contactSurname }}
          </div>
        </div>
      </div>

      <div class="ewt-form-row">
        <div class="ewt-form-col">
          <label class="ewt-form-label">Contact Phone</label>
          <input
            type="tel"
            class="ewt-input"
            v-model="emergencyContact.contactPhone"
            :class="{ 'ewt-input--error': formErrors.contactPhone }"
            @input="handleUpdate"
          />
          <div v-if="formErrors.contactPhone" class="ewt-error-text">
            {{ formErrors.contactPhone }}
          </div>
        </div>

        <div class="ewt-form-col">
          <label class="ewt-form-label">Contact Email</label>
          <input
            type="email"
            class="ewt-input"
            v-model="emergencyContact.contactEmail"
            :class="{ 'ewt-input--error': formErrors.contactEmail }"
            @input="handleUpdate"
          />
          <div v-if="formErrors.contactEmail" class="ewt-error-text">
            {{ formErrors.contactEmail }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
