<script lang="ts" setup>
defineProps<{
  data: Record<string, unknown>;
  title?: string;
}>();

/**
 * Formats a value for display
 */
function formatValue(value: unknown): string {
  if (value === null) return 'None';
  if (value === undefined) return 'Not specified';
  
  if (typeof value === 'object') {
    return ''; // Return an empty string for objects to handle them in the template
  }
  
  return String(value);
}
</script>

<template>
  <div class="generic-info-container">
    <h3 v-if="title">{{ title }}</h3>
    
    <div class="info-grid">
      <template v-for="(value, key) in data" :key="key">
        <div class="info-label">{{ key }}</div>
        <div class="info-value">
          <template v-if="typeof value === 'object' && value !== null">
            <div v-for="(nestedValue, nestedKey) in value" :key="nestedKey">
              <strong>{{ nestedKey }}:</strong> {{ formatValue(nestedValue) }}
            </div>
          </template>
          <template v-else>
            {{ formatValue(value) }}
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.generic-info-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 8px 16px;
}

.info-label {
  font-weight: 600;
  color: #495057;
  text-transform: capitalize;
}

.info-value {
  color: #212529;
  word-break: break-word;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-label {
    margin-top: 8px;
  }
  
  .info-label:first-child {
    margin-top: 0;
  }
}
</style>