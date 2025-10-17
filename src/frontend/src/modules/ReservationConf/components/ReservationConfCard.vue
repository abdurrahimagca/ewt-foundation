<script lang="ts" setup>
import { computed, toRef, watch } from "vue";
import ProductSelector from "@/modules/shared/components/ProductSelector.vue";
import ProductStreamSelector from "@/modules/shared/components/ProductStreamSelector.vue";
import type { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";

const props = defineProps<{
  reservationConf: Entity<"ce_reservation_configuration">;
  loading: boolean;
  index?: number;
}>();

const emit = defineEmits<{
  (e: "save", id: string): void;
  (e: "delete", id: string): void;
}>();

const reservationConf = toRef(props, "reservationConf");
const conf = computed(() => reservationConf.value);
const displayIndex = computed(() => (props.index ?? 0) + 1);

watch(
  () => conf.value?.reservationProduct,
  (product) => {
    if (!conf.value) {
      return;
    }
    conf.value.reservationProductId = product?.id ?? null;
  },
  { immediate: true },
);

watch(
  () => conf.value?.applyToProductStream,
  (stream) => {
    if (!conf.value) {
      return;
    }
    conf.value.applyToProductStreamId = stream?.id ?? null;
  },
  { immediate: true },
);

const handleSave = () => {
  if (!conf.value) {
    return;
  }
  emit("save", conf.value.id);
};

const handleDelete = () => {
  if (!conf.value) {
    return;
  }
  emit("delete", conf.value.id);
};
</script>

<template>
  <div class="ewt-card ewt-card--padded ewt-card--stacked">
    <header class="ewt-card-header">
      <div class="ewt-flex ewt-flex--center ewt-flex--between">
        <h3 class="ewt-card-title">
          <i class="fa-solid fa-gear"></i>
          Configuration {{ displayIndex }}
        </h3>
        <div class="ewt-button-group">
          <button
            class="ewt-button ewt-button--primary"
            @click="handleSave"
            :disabled="loading"
          >
            <i class="fa-solid fa-save"></i>
            Save
          </button>
          <button
            class="ewt-button ewt-button--danger"
            @click="handleDelete"
            :disabled="loading"
          >
            <i class="fa-solid fa-trash"></i>
            Delete
          </button>
        </div>
      </div>
    </header>

    <div class="ewt-card-body">
      <div class="ewt-form-grid">
        <label class="ewt-form-control">
          <span>Active</span>
          <input type="checkbox" v-model="conf.isActive" :disabled="loading" />
        </label>

        <label class="ewt-form-control">
          <span>Days cancellable before reservation</span>
          <input
            type="number"
            min="0"
            v-model.number="conf.cancellableDayBeforeReservation"
            :disabled="loading"
          />
        </label>

        <div class="ewt-form-control ewt-form-control--inline">
          <label>
            <input
              type="checkbox"
              v-model="conf.addPerAdult"
              :disabled="loading"
            />
            Add per adult
          </label>
          <label>
            <input
              type="checkbox"
              v-model="conf.addPerChild"
              :disabled="loading"
            />
            Add per child
          </label>
          <label>
            <input
              type="checkbox"
              v-model="conf.addPerInfant"
              :disabled="loading"
            />
            Add per infant
          </label>
        </div>
      </div>

      <section class="ewt-form-section">
        <h4 class="ewt-section-title">Assignments</h4>
        <div class="ewt-form-subgrid">
          <div>
            <label class="ewt-label">Reservation product</label>
            <ProductSelector v-model="conf.reservationProduct" />
          </div>
          <div>
            <label class="ewt-label">Apply to product stream</label>
            <ProductStreamSelector v-model="conf.applyToProductStream" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.ewt-card--stacked {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ewt-card-header {
  border-bottom: 1px solid var(--ewt-border);
  padding-bottom: 1rem;
}

.ewt-card-title {
  margin: 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ewt-card-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ewt-form-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.ewt-form-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.ewt-form-control input[type="number"] {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--ewt-border);
  background: var(--ewt-surface);
  color: var(--ewt-text);
}

.ewt-form-control--inline {
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
}

.ewt-form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ewt-section-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.ewt-form-subgrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.ewt-label {
  font-weight: 600;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.75rem;
}
</style>
