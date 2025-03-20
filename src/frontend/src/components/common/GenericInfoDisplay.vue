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
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

h3 {
  margin: 0 0 20px 0;
  color: #1a1a1a;
  font-size: 1.25rem;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: minmax(140px, 1fr) 2fr;
  gap: 16px 24px;
}

.info-label {
  font-weight: 500;
  color: #666;
  text-transform: capitalize;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.info-value {
  color: #1a1a1a;
  word-break: break-word;
  font-size: 0.95rem;
  line-height: 1.5;
  padding: 4px 0;
}

.info-value strong {
  color: #4a4a4a;
  font-weight: 500;
  margin-right: 4px;
}

/* Add a subtle border between rows */
.info-grid > div {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

/* Remove border from last row */
.info-grid > div:nth-last-child(-n+2) {
  border-bottom: none;
}

@media (max-width: 768px) {
  .generic-info-container {
    padding: 16px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .info-label {
    margin-top: 8px;
    color: #4a4a4a;
    font-weight: 600;
  }
  
  .info-value {
    padding-bottom: 12px;
  }
  
  /* Adjust borders for mobile */
  .info-grid > div:nth-child(even) {
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 8px;
  }
  
  .info-grid > div:nth-last-child(1) {
    border-bottom: none;
  }
}
</style>