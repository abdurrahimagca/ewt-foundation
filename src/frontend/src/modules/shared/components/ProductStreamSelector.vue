<script lang="ts" setup>
import { data } from "@shopware-ag/meteor-admin-sdk";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { defineProps, ref, watch, defineEmits } from "vue";
import { useSw } from "@/modules/shared/composables/useSw";

defineProps<{
  modelValue: Entity<"product_stream"> | null;
}>();
const { fetchSwEntityCollection } = useSw();

const nameToSearch = ref<string | null | undefined>(undefined);
const selectables = ref<Entity<"product_stream">[]>([]);
const isDropdownOpen = ref(false);
const error = ref<string | undefined>(undefined);

const emits = defineEmits<{
  (e: "update:modelValue", value: Entity<"product_stream"> | null): void;
}>();

async function searchStream() {
  if (!nameToSearch?.value?.trim()) {
    selectables.value = [];
    return;
  }
  try {
    const criteria = new data.Classes.Criteria();
    criteria.addFilter(
      data.Classes.Criteria.multi("OR", [
        data.Classes.Criteria.contains("name", nameToSearch.value),
        data.Classes.Criteria.contains("description", nameToSearch.value),
      ]),
    );

    const streams = await fetchSwEntityCollection("product_stream", criteria);

    if (streams === null) {
      throw new Error("No streams found");
    }
    selectables.value = streams;
  } catch (e) {
    error.value = (e as Error).message;
  }
}

function handleInputFocus() {
  isDropdownOpen.value = true;
}

function selectStream(stream: Entity<"product_stream">) {
  emits("update:modelValue", stream);
  isDropdownOpen.value = false;
  nameToSearch.value = "";
}

function openStreamDetail(streamId: string) {
  const detailUrl = `http://ewt-shop.homelab-kaleici.space/admin#/sw/product/stream/detail/${streamId}`;
  window.open(detailUrl, "_blank");
}

watch(nameToSearch, () => {
  searchStream();
});
</script>

<template>
  <div class="stream-selection-wrapper">
    <div class="stream-selection">
      <div class="selected-tags-wrapper">
        <div class="selected-tags" v-if="modelValue">
          <div class="tag">
            <div class="stream-info">
              <span class="stream-name">
                {{ modelValue.name ? modelValue.name : "__unnamed__" }}
              </span>
              <span class="stream-description" v-if="modelValue.description">
                {{ modelValue.description }}
              </span>
            </div>
            <div class="tag-actions">
              <button
                class="info-button"
                @click.stop="openStreamDetail(modelValue.id)"
                title="View stream details"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="dropdown-container">
        <div class="search-input-wrapper">
          <svg
            class="search-icon"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 3a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM2 8.5a6.5 6.5 0 1 1 11.436 4.23l3.857 3.857a.75.75 0 0 1-1.061 1.061l-3.857-3.857A6.5 6.5 0 0 1 2 8.5z"
              fill="currentColor"
            />
          </svg>
          <input
            type="text"
            v-model="nameToSearch"
            placeholder="Search stream name or description"
            @focus="handleInputFocus"
            class="search-input"
          />
        </div>

        <div v-if="isDropdownOpen" class="dropdown-content">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div
            v-else-if="selectables.length === 0 && nameToSearch"
            class="no-results"
          >
            No streams found
          </div>

          <div v-else-if="selectables.length > 0" class="options-list">
            <div
              v-for="stream in selectables"
              :key="stream.id"
              class="option"
              @click="selectStream(stream)"
            >
              <div class="stream-info">
                <span class="stream-name">
                  {{ stream.name ? stream.name : "__unnamed__" }}
                </span>
                <span class="stream-description" v-if="stream.description">
                  {{ stream.description }}
                </span>
              </div>
              <button
                class="info-button"
                @click.stop="openStreamDetail(stream.id)"
                title="View stream details"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
.stream-selection-wrapper {
  min-height: 120px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, system-ui, sans-serif;
  margin: 16px 0;
  width: 100%;
}

.stream-selection {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
}

.stream-selection.frozen {
  opacity: 0.8;
  background-color: #f9fafb;
  pointer-events: none;
}

.stream-selection.frozen .edit-button {
  pointer-events: auto;
  opacity: 1;
}

.selected-tags-wrapper {
  max-height: 150px;
  overflow-y: auto;
  padding: 4px 0;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background-color: #f0f7ff;
  color: #1e40af;
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border: 1px solid #bfdbfe;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
  gap: 16px;
  margin-bottom: 4px;
}

.stream-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
  padding: 2px 0;
}

.stream-name {
  font-weight: 600;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #1e40af;
}

.stream-description {
  font-size: 13px;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  line-height: 1.5;
}

.tag-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
}

.info-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  opacity: 0.8;
}

.info-button:hover {
  opacity: 1;
  background-color: rgba(59, 130, 246, 0.1);
}

.remove-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  padding: 6px;
  font-size: 18px;
  line-height: 1;
  border-radius: 6px;
  transition: all 0.2s ease;
  opacity: 0.8;
}

.remove-tag:hover {
  opacity: 1;
  background-color: rgba(59, 130, 246, 0.1);
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 16px 12px 44px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background-color: #f8fafc;
}

.search-input:hover {
  background-color: #fff;
  border-color: #cbd5e1;
}

.search-input:focus {
  background-color: #fff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  color: #9ca3af;
}

.search-input::placeholder {
  color: #9ca3af;
}

.dropdown-container {
  position: relative;
  width: 100%;
  z-index: 100;
  box-sizing: border-box;
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  max-height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
}

.options-list {
  padding: 8px 0;
}

.option {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #1e293b;
  gap: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.option:hover {
  background-color: #f8fafc;
}

.option.selected {
  background-color: #eef2ff;
  color: #4f46e5;
  font-weight: 500;
}

.option:last-child {
  border-bottom: none;
}

.error-message {
  color: #dc2626;
  padding: 16px 20px;
  font-size: 14px;
  background-color: #fef2f2;
  border-radius: 8px;
  margin: 12px;
  border: 1px solid #fecaca;
}

.no-results {
  padding: 20px;
  color: #64748b;
  font-size: 14px;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.commit-button,
.edit-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.commit-button {
  background-color: #4f46e5;
  color: white;
}

.commit-button:hover {
  background-color: #4338ca;
}

.edit-button {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.edit-button:hover {
  background-color: #e5e7eb;
}

button:active {
  transform: translateY(1px);
}

button:disabled {
  background-color: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Custom scrollbar for dropdown */
.dropdown-content::-webkit-scrollbar {
  width: 8px;
}

.dropdown-content::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.dropdown-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.dropdown-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.search-input-wrapper:after {
  content: "";
  display: none;
}

.stream-link {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

.stream-link:hover {
  text-decoration: underline;
}

.add-stream {
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  padding: 2px 8px;
  font-size: 18px;
  line-height: 1;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.add-stream:hover {
  background-color: #4f46e5;
  color: white;
}

.unsaved-changes {
  color: #9ca3af;
  font-size: 14px;
  font-style: italic;
}

.commit-button.has-changes {
  background-color: #059669;
}

.commit-button.has-changes:hover {
  background-color: #047857;
}
</style>
