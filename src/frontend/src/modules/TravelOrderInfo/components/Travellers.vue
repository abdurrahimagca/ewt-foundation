<script lang="ts" setup>
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { ref } from "vue";
import EntityCollection from "@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection";

const props = defineProps<{
  travellers: EntityCollection<"ce_traveller"> | null;
}>();

const emit = defineEmits<{
  (e: "update:travellers", value: EntityCollection<"ce_traveller">): void;
}>();

const formErrors = ref<Record<string, Record<string, string>>>({});

const validateTraveller = (
  traveller: Entity<"ce_traveller">,
  index: number,
) => {
  const errors: Record<string, string> = {};

  if (!traveller.travellerType) {
    errors.travellerType = "Traveller type is required";
  }

  if (!traveller.travellerName) {
    errors.travellerName = "Traveller name is required";
  }

  if (!traveller.travellerSurname) {
    errors.travellerSurname = "Traveller surname is required";
  }

  if (!traveller.travellerEmail) {
    errors.travellerEmail = "Traveller email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(traveller.travellerEmail)) {
    errors.travellerEmail = "Invalid email format";
  }

  if (!traveller.travellerBirthDate) {
    errors.travellerBirthDate = "Birth date is required";
  }

  formErrors.value[index] = errors;
  return Object.keys(errors).length === 0;
};

const validateForm = () => {
  if (!props.travellers?.length) {
    return false;
  }

  let isValid = true;
  props.travellers.forEach((traveller, index) => {
    if (!validateTraveller(traveller, index)) {
      isValid = false;
    }
  });

  return isValid;
};

const handleUpdate = () => {
  if (validateForm() && props.travellers) {
    emit("update:travellers", props.travellers);
  }
};

const removeTraveller = (index: number) => {
  if (props.travellers) {
    props.travellers.splice(index, 1);
    handleUpdate();
  }
};

const formatDateForInput = (date: string | null) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const formatDateForDisplay = (date: string | null) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};
</script>

<template>
  <div class="ewt-grid">
    <div
      v-for="(traveller, index) in travellers"
      :key="traveller.id"
      class="ewt-form-group"
    >
      <div class="ewt-form-group-header">
        <h3 class="ewt-form-group-title">Traveller {{ index + 1 }}</h3>
        <button
          class="ewt-button ewt-button--danger ewt-button--sm"
          @click="() => removeTraveller(index)"
        >
          Remove
        </button>
      </div>

      <div class="ewt-form-row">
        <div class="ewt-form-col">
          <label class="ewt-form-label">Traveller Type</label>
          <select
            class="ewt-input"
            v-model="traveller.travellerType"
            :class="{ 'ewt-input--error': formErrors[index]?.travellerType }"
            @change="handleUpdate"
          >
            <option value="">Select Type</option>
            <option value="adult">Adult</option>
            <option value="child">Child</option>
            <option value="infant">Infant</option>
          </select>
          <div v-if="formErrors[index]?.travellerType" class="ewt-error-text">
            {{ formErrors[index].travellerType }}
          </div>
        </div>

        <div class="ewt-form-col">
          <label class="ewt-form-label">Birth Date</label>
          <div class="ewt-input-group">
            <input
              type="date"
              class="ewt-input ewt-input--date"
              :value="formatDateForInput(traveller.travellerBirthDate)"
              @input="
                (e: Event) => {
                  traveller.travellerBirthDate = (
                    e.target as HTMLInputElement
                  ).value;
                  handleUpdate();
                }
              "
              :class="{
                'ewt-input--error': formErrors[index]?.travellerBirthDate,
              }"
            />
            <div class="ewt-input-hint">
              {{ formatDateForDisplay(traveller.travellerBirthDate) }}
            </div>
          </div>
          <div
            v-if="formErrors[index]?.travellerBirthDate"
            class="ewt-error-text"
          >
            {{ formErrors[index].travellerBirthDate }}
          </div>
        </div>
      </div>

      <div class="ewt-form-row">
        <div class="ewt-form-col">
          <label class="ewt-form-label">Name</label>
          <input
            type="text"
            class="ewt-input"
            v-model="traveller.travellerName"
            :class="{ 'ewt-input--error': formErrors[index]?.travellerName }"
            @input="handleUpdate"
          />
          <div v-if="formErrors[index]?.travellerName" class="ewt-error-text">
            {{ formErrors[index].travellerName }}
          </div>
        </div>

        <div class="ewt-form-col">
          <label class="ewt-form-label">Surname</label>
          <input
            type="text"
            class="ewt-input"
            v-model="traveller.travellerSurname"
            :class="{
              'ewt-input--error': formErrors[index]?.travellerSurname,
            }"
            @input="handleUpdate"
          />
          <div
            v-if="formErrors[index]?.travellerSurname"
            class="ewt-error-text"
          >
            {{ formErrors[index].travellerSurname }}
          </div>
        </div>
      </div>

      <div class="ewt-form-row">
        <div class="ewt-form-col">
          <label class="ewt-form-label">Email</label>
          <input
            type="email"
            class="ewt-input"
            v-model="traveller.travellerEmail"
            :class="{ 'ewt-input--error': formErrors[index]?.travellerEmail }"
            @input="handleUpdate"
          />
          <div v-if="formErrors[index]?.travellerEmail" class="ewt-error-text">
            {{ formErrors[index].travellerEmail }}
          </div>
        </div>

        <div class="ewt-form-col">
          <label class="ewt-form-label">Phone (Optional)</label>
          <input
            type="tel"
            class="ewt-input"
            v-model="traveller.travellerPhone"
            @input="handleUpdate"
          />
        </div>
      </div>

      <div class="ewt-form-row">
        <div class="ewt-form-col">
          <label class="ewt-form-label">Passport Number (Optional)</label>
          <input
            type="text"
            class="ewt-input"
            v-model="traveller.travellerPassportNumber"
            @input="handleUpdate"
          />
        </div>

        <div class="ewt-form-col">
          <label class="ewt-form-label">Nationality (Optional)</label>
          <input
            type="text"
            class="ewt-input"
            v-model="traveller.travellerNationality"
            @input="handleUpdate"
          />
        </div>
      </div>

      <div class="ewt-form-row">
        <div class="ewt-form-col">
          <label class="ewt-form-label">Dietary Information (Optional)</label>
          <textarea
            class="ewt-input"
            v-model="traveller.travellerDietInfoManualInput"
            @input="handleUpdate"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
