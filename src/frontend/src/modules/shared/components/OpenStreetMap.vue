<template>
  <div class="osm-container">
    <!-- Search Input -->
    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          @input="onSearchInput"
          @keydown.enter="performSearch"
          type="text"
          placeholder="Search for a location..."
          class="search-input"
        />
        <button
          @click="performSearch"
          class="search-button"
          :disabled="!searchQuery.trim()"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>

      <!-- Search Results Dropdown -->
      <div v-if="searchResults.length > 0" class="search-results">
        <div
          v-for="(result, index) in searchResults"
          :key="index"
          @click="selectSearchResult(result)"
          class="search-result-item"
        >
          <div class="result-name">{{ result.display_name }}</div>
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div class="map-wrapper">
      <l-map
        ref="mapRef"
        v-model:zoom="zoom"
        :center="center"
        @click="onMapClick"
        class="map"
        :options="mapOptions"
      >
        <l-tile-layer
          :url="tileLayerUrl"
          :attribution="attribution"
        ></l-tile-layer>

        <!-- Selected Point Marker -->
        <l-marker
          v-if="selectedPoint"
          :lat-lng="selectedPoint"
          :draggable="true"
          @dragend="onMarkerDrag"
        >
          <l-popup>
            <div class="popup-content">
              <strong>Selected Location</strong><br />
              Lat: {{ selectedPoint.lat.toFixed(6) }}<br />
              Lng: {{ selectedPoint.lng.toFixed(6) }}
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>

    <!-- Coordinates Display -->
    <div v-if="selectedPoint" class="coordinates-display">
      <div class="coordinates-info">
        <span class="label">Selected Coordinates:</span>
        <span class="coordinates">
          {{ selectedPoint.lat.toFixed(6) }}, {{ selectedPoint.lng.toFixed(6) }}
        </span>
        <button @click="clearSelection" class="clear-button">Clear</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, nextTick } from "vue";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";

// Types
interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  boundingbox: string[];
}

interface MapPoint {
  lat: number;
  lng: number;
}

// Props
interface Props {
  initialLat?: number;
  initialLng?: number;
  initialZoom?: number;
  height?: string;
  modelValue?: MapPoint | null;
}

const props = withDefaults(defineProps<Props>(), {
  initialLat: 51.505,
  initialLng: -0.09,
  initialZoom: 13,
  height: "400px",
  modelValue: null,
});

// Emits
const emit = defineEmits<{
  "update:modelValue": [value: MapPoint | null];
  pointSelected: [point: MapPoint];
  pointCleared: [];
}>();

// Reactive data
const mapRef = ref();
const searchQuery = ref("");
const searchResults = ref<SearchResult[]>([]);
const selectedPoint = ref<MapPoint | null>(props.modelValue);
const zoom = ref(props.initialZoom);
const center = ref<[number, number]>([props.initialLat, props.initialLng]);

// Map configuration
const tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const mapOptions = {
  zoomControl: true,
  attributionControl: true,
};

// Search functionality
let searchTimeout: ReturnType<typeof setTimeout>;

const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim().length > 2) {
      performSearch();
    } else {
      searchResults.value = [];
    }
  }, 300);
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) return;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery.value,
      )}&limit=5&addressdetails=1`,
    );

    if (response.ok) {
      searchResults.value = await response.json();
    }
  } catch (error) {
    console.error("Search error:", error);
    searchResults.value = [];
  }
};

const selectSearchResult = (result: SearchResult) => {
  const lat = parseFloat(result.lat);
  const lng = parseFloat(result.lon);

  // Update map center and zoom
  center.value = [lat, lng];
  zoom.value = 15;

  // Set selected point
  setSelectedPoint({ lat, lng });

  // Clear search
  searchQuery.value = result.display_name;
  searchResults.value = [];

  // Focus map to the location
  nextTick(() => {
    if (mapRef.value?.leafletObject) {
      mapRef.value.leafletObject.setView([lat, lng], 15);
    }
  });
};

// Map interaction
const onMapClick = (event: any) => {
  const { lat, lng } = event.latlng;
  setSelectedPoint({ lat, lng });
};

const onMarkerDrag = (event: any) => {
  const { lat, lng } = event.target.getLatLng();
  setSelectedPoint({ lat, lng });
};

// Point management
const setSelectedPoint = (point: MapPoint) => {
  selectedPoint.value = point;
  emit("update:modelValue", point);
  emit("pointSelected", point);
};

const clearSelection = () => {
  selectedPoint.value = null;
  emit("update:modelValue", null);
  emit("pointCleared");
};

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    selectedPoint.value = newValue;
    if (newValue) {
      center.value = [newValue.lat, newValue.lng];
    }
  },
  { deep: true },
);

// Close search results when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".search-container")) {
    searchResults.value = [];
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  // If there's an initial point, center the map on it
  if (props.modelValue) {
    center.value = [props.modelValue.lat, props.modelValue.lng];
  }
});
</script>

<style scoped>
.osm-container {
  width: 100%;
  position: relative;
}

.search-container {
  position: relative;
  margin-bottom: 10px;
  z-index: 1000;
}

.search-input-wrapper {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  background: white;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 14px;
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.search-button {
  padding: 12px 16px;
  border: none;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover:not(:disabled) {
  background: #2563eb;
}

.search-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 6px 6px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-result-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
}

.search-result-item:hover {
  background: #f9fafb;
}

.search-result-item:last-child {
  border-bottom: none;
}

.result-name {
  font-size: 14px;
  color: #374151;
}

.map-wrapper {
  position: relative;
  height: v-bind("props.height");
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.map {
  height: 100%;
  width: 100%;
}

.popup-content {
  font-size: 12px;
  line-height: 1.4;
}

.coordinates-display {
  margin-top: 10px;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.coordinates-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.label {
  font-weight: 500;
  color: #374151;
}

.coordinates {
  font-family: monospace;
  color: #059669;
  font-weight: 500;
}

.clear-button {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.clear-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
}

/* Responsive design */
@media (max-width: 640px) {
  .coordinates-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .search-input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style>
