<template>
 uh oh its empty 
</template>

<style scoped>
.top-bar {
  justify-content: space-between;
  margin: 20px 0;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  gap: 16px;
}

.ewt-button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.primary-actions {
  flex-shrink: 0;
}

.icon {
  margin-right: 6px;
}

.ewt-tabs {
  display: flex;
  gap: 4px;
  padding: 0 4px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.ewt-tab-button {
  padding: 12px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ewt-tab-button:hover {
  color: #4f46e5;
}

.ewt-tab-button.active {
  color: #4f46e5;
  border-bottom-color: #4f46e5;
}

.tab-icon {
  font-size: 16px;
}

.ewt-tab-content {
  position: relative;
  min-height: 300px;
  overflow: visible;
}

.ewt-tab-pane {
  position: relative;
}

.ewt-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* Make the debug output collapsible and styled */
pre {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: auto;
  margin-top: 24px;
  font-size: 12px;
  color: #374151;
}
</style>
