<script lang="ts" setup>
import { useSw } from "@/modules/shared/composables/useSw";
import { ref, onMounted } from "vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { data } from "@shopware-ag/meteor-admin-sdk";

const props = defineProps<{
  id: string | undefined;
}>();

const { fetchSwEntity } = useSw();
const product = ref<Entity<"product"> | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  if (!props.id) return;

  try {
    isLoading.value = true;
    const criteria = new data.Classes.Criteria();
    criteria.setIds([props.id]);
    product.value = await fetchSwEntity("product", criteria);
  } catch (e) {
    error.value = "Failed to load product information";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="ewt-form-group">
    <div v-if="isLoading" class="ewt-loading">Loading...</div>
    <div v-else-if="error" class="ewt-error-text ewt-mb-3">{{ error }}</div>

    <div v-else-if="product" class="ewt-grid">
      <div class="ewt-form-row">
        <div class="ewt-form-col">
          <label class="ewt-form-label">Product Name</label>
          <div class="ewt-meta-info">{{ product.name }}</div>
        </div>

        <div class="ewt-form-col">
          <label class="ewt-form-label">Product Number</label>
          <div class="ewt-meta-info">{{ product.productNumber }}</div>
        </div>
      </div>

      <div class="ewt-form-row">
        <div class="ewt-form-col">
          <label class="ewt-form-label">Tax ID</label>
          <div class="ewt-meta-info">{{ product.taxId }}</div>
        </div>

        <div class="ewt-form-col">
          <label class="ewt-form-label">Stock</label>
          <div class="ewt-meta-info">{{ product.stock }}</div>
        </div>
      </div>

      <div class="ewt-actions ewt-mt-2">
        <a
          :href="`https://ewt-shop.homelab-kaleici.space/admin/sw/product/${product.id}/base`"
          target="_blank"
          class="ewt-button ewt-button--primary ewt-button--sm"
        >
          View Details
        </a>
      </div>
    </div>
  </div>
</template>
