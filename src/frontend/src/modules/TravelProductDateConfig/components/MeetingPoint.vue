<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { Entity } from "@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity";
import { MeetingPointType } from "../types/meetingPoint";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import { location } from "@shopware-ag/meteor-admin-sdk";

const props = defineProps<{
  meetingPoint: Entity<"ce_meeting_point">;
}>();

const emit = defineEmits<{
  (e: "update:meetingPoint", value: Entity<"ce_meeting_point">): void;
}>();

const showInstructions = ref(false);
const showIframePreview = ref(false);
const searchQuery = ref("");
const mapCenter = ref<[number, number]>([51.505, -0.09]);
const markerPosition = ref<[number, number] | null>(null);

async function geocodeAndSetMap(address: string) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address,
      )}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);
      if (!isNaN(latitude) && !isNaN(longitude)) {
        mapCenter.value = [latitude, longitude];
        markerPosition.value = [latitude, longitude];
      }
    }
  } catch (error) {
    console.error("Error geocoding address:", error);
  }
}

onMounted(() => {

  if (props.meetingPoint.meetingPointAddress) {
    
    geocodeAndSetMap(props.meetingPoint.meetingPointAddress);
  }
  
});

async function searchAddress() {
  if (!searchQuery.value) return;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery.value,
      )}`,
    );
    const data = await response.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);
      mapCenter.value = [latitude, longitude];
      markerPosition.value = [latitude, longitude];
      updateMeetingPointFromGeocoding(data[0]);
    } else {
      alert("Address not found");
    }
  } catch (error) {
    console.error("Error searching address:", error);
    alert("Failed to search for the address.");
  }
}

async function onMapClick(event: { latlng: { lat: number; lng: number } }) {
  const { lat, lng } = event.latlng;
  markerPosition.value = [lat, lng];
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );
    const data = await response.json();
    if (data) {
      updateMeetingPointFromGeocoding(data);
    }
  } catch (error) {
    console.error("Error reverse geocoding:", error);
  }
}

function updateMeetingPointFromGeocoding(data: any) {
  const address = data.address || {};
  const updates: Partial<Entity<"ce_meeting_point">> = {
    meetingPointStreet: address.road || "",
    meetingPointHouseNumber: address.house_number || "",
    meetingPointCity: address.city || address.town || address.village || "",
    meetingPointZip: address.postcode || "",
    meetingPointCountry: address.country || "",
    meetingPointAddress: data.display_name || "",
  };

  if (markerPosition.value) {
    const [lat, lon] = markerPosition.value as [number, number];
    const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01}%2C${lat - 0.01}%2C${lon + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lon}`;
    updates.meetingPointIframe = iframeSrc;
  }

  Object.assign(props.meetingPoint, updates);
  emit("update:meetingPoint", props.meetingPoint);
}

// Computed for instructions handling
const instructions = computed({
  get: () => {
    if (!props.meetingPoint.meetingPointInstructions) {
      return [];
    }
    try {
      const parsed =
        typeof props.meetingPoint.meetingPointInstructions === "string"
          ? JSON.parse(props.meetingPoint.meetingPointInstructions)
          : props.meetingPoint.meetingPointInstructions;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  set: (value: MeetingPointType) => {
    props.meetingPoint.meetingPointInstructions = value as any;
    emit("update:meetingPoint", props.meetingPoint);
  },
});

const addLanguageInstruction = () => {
  const newInstructions = [...instructions.value];
  newInstructions.push({
    languageCode: "en-GB",
    instructions: [],
  });
  instructions.value = newInstructions;
};

const removeLanguageInstruction = (langIndex: number) => {
  const newInstructions = [...instructions.value];
  newInstructions.splice(langIndex, 1);
  instructions.value = newInstructions;
};

const addInstruction = (langIndex: number) => {
  const newInstructions = [...instructions.value];
  newInstructions[langIndex].instructions.push({
    title: "",
    description: "",
  });
  instructions.value = newInstructions;
};

const removeInstruction = (langIndex: number, instrIndex: number) => {
  const newInstructions = [...instructions.value];
  newInstructions[langIndex].instructions.splice(instrIndex, 1);
  instructions.value = newInstructions;
};

const updateLanguageCode = (langIndex: number, value: string) => {
  const newInstructions = [...instructions.value];
  newInstructions[langIndex].languageCode = value;
  instructions.value = newInstructions;
};

const updateInstructionTitle = (
  langIndex: number,
  instrIndex: number,
  value: string,
) => {
  const newInstructions = [...instructions.value];
  newInstructions[langIndex].instructions[instrIndex].title = value;
  instructions.value = newInstructions;
};

const updateInstructionDescription = (
  langIndex: number,
  instrIndex: number,
  value: string,
) => {
  const newInstructions = [...instructions.value];
  newInstructions[langIndex].instructions[instrIndex].description = value;
  instructions.value = newInstructions;
};

// Methods to handle form field updates and emit changes
const updateField = (field: keyof Entity<"ce_meeting_point">, value: any) => {
  (props.meetingPoint as any)[field] = value;
  emit("update:meetingPoint", props.meetingPoint);
};

const handleNameUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateField("meetingPointName", target.value);
};

const handlePhoneUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateField("meetingPointPhone", target.value);
};

const handleEmailUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateField("meetingPointEmail", target.value);
};

const handleStreetUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateField("meetingPointStreet", target.value);
};

const handleHouseNumberUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateField("meetingPointHouseNumber", target.value);
};

const handleFloorUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateField("meetingPointFloor", target.value);
};

const handleAddressUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateField("meetingPointAddress", target.value);
};

const handleCityUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateField("meetingPointCity", target.value);
};

const handleZipUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateField("meetingPointZip", target.value);
};

const handleCountryUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateField("meetingPointCountry", target.value);
};

const handleIframeUpdate = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  updateField("meetingPointIframe", target.value);
};
</script>

<template>
  <div class="ewt-meeting-point">
    <div class="ewt-meeting-point-form">
              <!-- Map Section -->
      <div class="ewt-map-section">
        <div class="ewt-section-header">
          <h3 class="ewt-section-title">
            <i class="fa-solid fa-map-location-dot"></i>
            Address Lookup
          </h3>
        </div>
        <div class="ewt-map-search">
          <input
            type="text"
            v-model="searchQuery"
            class="ewt-input"
            placeholder="Search for an address..."
            @keyup.enter="searchAddress"
          />
          <button
            @click="searchAddress"
            class="ewt-button ewt-button--primary"
            type="button"
          >
            <i class="fa-solid fa-search"></i>
            Search
          </button>
        </div>
        <div class="ewt-map-container">
          <l-map
            ref="map"
            :zoom="13"
            :center="mapCenter"
            @click="onMapClick"
            style="height: 400px; width: 100%"
          >
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            ></l-tile-layer>
            <l-marker v-if="markerPosition" :lat-lng="markerPosition">
            </l-marker>
          </l-map>
        </div>
      </div>
      <div class="ewt-form-grid">
        <div class="ewt-input-group">
            
          <label class="ewt-form-label" for="meetingPointName">
            <i class="fa-solid fa-map-pin"></i>
            Meeting Point Name
          </label>
          <input
            type="text"
            id="meetingPointName"
            class="ewt-input"
            :value="meetingPoint.meetingPointName"
            @input="handleNameUpdate"
            placeholder="Enter meeting point name"
          />
        </div>

        <div class="ewt-input-group">
          <label class="ewt-form-label" for="meetingPointPhone">
            <i class="fa-solid fa-phone"></i>
            Phone Number
          </label>
          <input
            type="tel"
            id="meetingPointPhone"
            class="ewt-input"
            :value="meetingPoint.meetingPointPhone"
            @input="handlePhoneUpdate"
            placeholder="Enter phone number"
          />
        </div>

        <div class="ewt-input-group">
          <label class="ewt-form-label" for="meetingPointEmail">
            <i class="fa-solid fa-envelope"></i>
            Email Address
          </label>
          <input
            type="email"
            id="meetingPointEmail"
            class="ewt-input"
            :value="meetingPoint.meetingPointEmail"
            @input="handleEmailUpdate"
            placeholder="Enter email address"
          />
        </div>

        <div class="ewt-input-group">
          <label class="ewt-form-label" for="meetingPointStreet">
            <i class="fa-solid fa-road"></i>
            Street Address
          </label>
          <input
            type="text"
            id="meetingPointStreet"
            class="ewt-input"
            :value="meetingPoint.meetingPointStreet"
            @input="handleStreetUpdate"
            placeholder="Enter street address"
          />
        </div>

        <div class="ewt-input-group">
          <label class="ewt-form-label" for="meetingPointHouseNumber">
            <i class="fa-solid fa-house-circle-check"></i>
            House Number
          </label>
          <input
            type="text"
            id="meetingPointHouseNumber"
            class="ewt-input"
            :value="meetingPoint.meetingPointHouseNumber"
            @input="handleHouseNumberUpdate"
            placeholder="Enter house number"
          />
        </div>

        <div class="ewt-input-group">
          <label class="ewt-form-label" for="meetingPointFloor">
            <i class="fa-solid fa-stairs"></i>
            Floor
          </label>
          <input
            type="text"
            id="meetingPointFloor"
            class="ewt-input"
            :value="meetingPoint.meetingPointFloor"
            @input="handleFloorUpdate"
            placeholder="Enter floor number"
          />
        </div>

        <div class="ewt-input-group">
          <label class="ewt-form-label" for="meetingPointAddress">
            <i class="fa-solid fa-location-dot"></i>
            Address
          </label>
          <input
            type="text"
            id="meetingPointAddress"
            class="ewt-input"
            :value="meetingPoint.meetingPointAddress"
            @input="handleAddressUpdate"
            placeholder="Enter address"
          />
        </div>

        <div class="ewt-input-group">
          <label class="ewt-form-label" for="meetingPointCity">
            <i class="fa-solid fa-city"></i>
            City
          </label>
          <input
            type="text"
            id="meetingPointCity"
            class="ewt-input"
            :value="meetingPoint.meetingPointCity"
            @input="handleCityUpdate"
            placeholder="Enter city"
          />
        </div>

        <div class="ewt-input-group">
          <label class="ewt-form-label" for="meetingPointZip">
            <i class="fa-solid fa-hashtag"></i>
            Zip Code
          </label>
          <input
            type="text"
            id="meetingPointZip"
            class="ewt-input"
            :value="meetingPoint.meetingPointZip"
            @input="handleZipUpdate"
            placeholder="Enter zip code"
          />
        </div>

        <div class="ewt-input-group">
          <label class="ewt-form-label" for="meetingPointCountry">
            <i class="fa-solid fa-flag"></i>
            Country
          </label>
          <input
            type="text"
            id="meetingPointCountry"
            class="ewt-input"
            :value="meetingPoint.meetingPointCountry"
            @input="handleCountryUpdate"
            placeholder="Enter country"
          />
        </div>
      </div>


      <!-- Iframe Section -->
      <div class="ewt-iframe-section">
        <div class="ewt-section-header">
          <h3 class="ewt-section-title">
            <i class="fa-solid fa-map"></i>
            Map Integration
          </h3>
          <button
            @click="showIframePreview = !showIframePreview"
            class="ewt-button ewt-button--secondary ewt-button--sm"
            type="button"
          >
            <i
              class="fa-solid"
              :class="showIframePreview ? 'fa-eye-slash' : 'fa-eye'"
            ></i>
            {{ showIframePreview ? "Hide Preview" : "Show Preview" }}
          </button>
        </div>

        <div class="ewt-input-group">
          <label class="ewt-form-label" for="meetingPointIframe">
            <i class="fa-solid fa-link"></i>
            Map URL
          </label>
          <input
            type="text"
            id="meetingPointIframe"
            class="ewt-input"
            :value="meetingPoint.meetingPointIframe"
            @input="handleIframeUpdate"
            placeholder="Enter map URL (e.g., OpenStreetMap embed URL)"
          />
        </div>

        <div
          v-if="showIframePreview && meetingPoint.meetingPointIframe"
          class="ewt-iframe-preview"
        >
          <h4 class="ewt-preview-title">
            <i class="fa-solid fa-eye"></i>
            Preview
          </h4>
          <div class="ewt-iframe-container">
            <iframe
              width="100%"
              height="300"
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
              :src="meetingPoint.meetingPointIframe"
              style="border: 1px solid black"
            ></iframe>
          </div>
        </div>
      </div>

      <!-- Instructions Section -->
      <div class="ewt-instructions-section">
        <div class="ewt-section-header">
          <h3 class="ewt-section-title">
            <i class="fa-solid fa-list-check"></i>
            Meeting Point Instructions
          </h3>
          <button
            @click="showInstructions = !showInstructions"
            class="ewt-button ewt-button--secondary ewt-button--sm"
            type="button"
          >
            <i
              class="fa-solid"
              :class="showInstructions ? 'fa-chevron-up' : 'fa-chevron-down'"
            ></i>
            {{ showInstructions ? "Hide" : "Show" }} Instructions
          </button>
        </div>

        <div v-if="showInstructions" class="ewt-instructions-content">
          <div v-if="instructions.length === 0" class="ewt-empty-state">
            <div class="ewt-empty-content">
              <i class="fa-solid fa-info-circle ewt-empty-icon"></i>
              <p class="ewt-empty-text">No instructions configured</p>
            </div>
          </div>

          <div
            v-for="(lang, langIndex) in instructions"
            :key="langIndex"
            class="ewt-language-block"
          >
            <div class="ewt-language-header">
              <div class="ewt-input-group ewt-language-input">
                <label class="ewt-form-label">
                  <i class="fa-solid fa-language"></i>
                  Language Code
                </label>
                <input
                  type="text"
                  class="ewt-input"
                  :value="lang.languageCode"
                  @input="
                    updateLanguageCode(
                      langIndex,
                      ($event.target as HTMLInputElement).value,
                    )
                  "
                  placeholder="e.g., en-GB, es-ES"
                />
              </div>
              <button
                @click="removeLanguageInstruction(langIndex)"
                class="ewt-button ewt-button--danger ewt-button--sm"
                type="button"
              >
                <i class="fa-solid fa-trash"></i>
                Remove Language
              </button>
            </div>

            <div class="ewt-instructions-list">
              <div
                v-for="(instr, instrIndex) in lang.instructions"
                :key="instrIndex"
                class="ewt-instruction-item"
              >
                <div class="ewt-instruction-fields">
                  <div class="ewt-input-group">
                    <label class="ewt-form-label">
                      <i class="fa-solid fa-heading"></i>
                      Title
                    </label>
                    <input
                      type="text"
                      class="ewt-input"
                      :value="instr.title"
                      @input="
                        updateInstructionTitle(
                          langIndex,
                          instrIndex,
                          ($event.target as HTMLInputElement).value,
                        )
                      "
                      placeholder="Enter instruction title"
                    />
                  </div>
                  <div class="ewt-input-group">
                    <label class="ewt-form-label">
                      <i class="fa-solid fa-align-left"></i>
                      Description
                    </label>
                    <textarea
                      class="ewt-textarea"
                      :value="instr.description"
                      @input="
                        updateInstructionDescription(
                          langIndex,
                          instrIndex,
                          ($event.target as HTMLTextAreaElement).value,
                        )
                      "
                      placeholder="Enter instruction description"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <button
                  @click="removeInstruction(langIndex, instrIndex)"
                  class="ewt-button ewt-button--danger ewt-button--sm"
                  type="button"
                >
                  <i class="fa-solid fa-trash"></i>
                  Remove
                </button>
              </div>

              <button
                @click="addInstruction(langIndex)"
                class="ewt-button ewt-button--outline"
                type="button"
              >
                <i class="fa-solid fa-plus"></i>
                Add Instruction
              </button>
            </div>
          </div>

          <div class="ewt-add-section">
            <button
              @click="addLanguageInstruction"
              class="ewt-button ewt-button--primary"
              type="button"
            >
              <i class="fa-solid fa-plus"></i>
              Add Language
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ewt-meeting-point {
  width: 100%;
}

.ewt-meeting-point-form {
  background: var(--ewt-bg-secondary, #f8f9fa);
  border: 1px solid var(--ewt-border, #e9ecef);
  border-radius: 8px;
  padding: 1.5rem;
  transition: var(--ewt-transition, all 0.2s ease);
}

.ewt-meeting-point-form:hover {
  border-color: var(--ewt-primary, #007bff);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.ewt-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.ewt-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ewt-language-input {
  flex: 1;
}

.ewt-form-label {
  font-weight: 500;
  color: var(--ewt-text, #212529);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.ewt-form-label i {
  color: var(--ewt-primary, #007bff);
}

.ewt-input,
.ewt-textarea {
  padding: 0.75rem;
  border: 1px solid var(--ewt-border, #ced4da);
  border-radius: 6px;
  font-size: 0.875rem;
  transition: var(--ewt-transition, all 0.2s ease);
  background: var(--ewt-bg, #fff);
  color: var(--ewt-text, #212529);
  font-family: inherit;
}

.ewt-input:focus,
.ewt-textarea:focus {
  outline: none;
  border-color: var(--ewt-primary, #007bff);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.ewt-input::placeholder,
.ewt-textarea::placeholder {
  color: var(--ewt-text-secondary, #6c757d);
  opacity: 0.7;
}

.ewt-textarea {
  resize: vertical;
  min-height: 80px;
}

.ewt-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--ewt-transition, all 0.2s ease);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.ewt-button--primary {
  background-color: var(--ewt-primary, #007bff);
  color: white;
}

.ewt-button--primary:hover {
  background-color: var(--ewt-primary-dark, #0056b3);
  transform: translateY(-1px);
}

.ewt-button--secondary {
  background-color: var(--ewt-secondary, #6c757d);
  color: white;
}

.ewt-button--secondary:hover {
  background-color: var(--ewt-secondary-dark, #545b62);
  transform: translateY(-1px);
}

.ewt-button--danger {
  background-color: var(--ewt-danger, #dc3545);
  color: white;
}

.ewt-button--danger:hover {
  background-color: var(--ewt-danger-dark, #c82333);
  transform: translateY(-1px);
}

.ewt-button--outline {
  background-color: transparent;
  color: var(--ewt-primary, #007bff);
  border: 1px solid var(--ewt-primary, #007bff);
}

.ewt-button--outline:hover {
  background-color: var(--ewt-primary, #007bff);
  color: white;
}

.ewt-button--sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.ewt-map-section,
.ewt-iframe-section,
.ewt-instructions-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--ewt-border, #e9ecef);
}

.ewt-map-search {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.ewt-map-container {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--ewt-border, #e9ecef);
}

.ewt-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.ewt-section-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ewt-text, #212529);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ewt-section-title i {
  color: var(--ewt-primary, #007bff);
}

.ewt-iframe-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--ewt-bg, #fff);
  border: 1px solid var(--ewt-border, #e9ecef);
  border-radius: 6px;
}

.ewt-preview-title {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--ewt-text, #212529);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ewt-iframe-container {
  width: 100%;
  min-height: 300px;
  border-radius: 4px;
  overflow: hidden;
}

.ewt-iframe-container iframe {
  width: 100%;
  height: 300px;
  border: none;
  border-radius: 4px;
}

.ewt-instructions-content {
  background: var(--ewt-bg, #fff);
  border: 1px solid var(--ewt-border, #e9ecef);
  border-radius: 6px;
  padding: 1.5rem;
}

.ewt-language-block {
  background: var(--ewt-bg-secondary, #f8f9fa);
  border: 1px solid var(--ewt-border, #e9ecef);
  border-radius: 6px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.ewt-language-header {
  display: flex;
  align-items: end;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.ewt-instruction-item {
  background: var(--ewt-bg, #fff);
  border: 1px solid var(--ewt-border, #e9ecef);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
  align-items: start;
}

.ewt-instruction-fields {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
}

.ewt-empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--ewt-text-secondary, #6c757d);
}

.ewt-empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.ewt-empty-icon {
  font-size: 2rem;
  opacity: 0.5;
}

.ewt-empty-text {
  margin: 0;
  font-size: 0.875rem;
}

.ewt-add-section {
  padding-top: 1rem;
  border-top: 1px solid var(--ewt-border, #e9ecef);
}

@media (max-width: 768px) {
  .ewt-form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .ewt-meeting-point-form {
    padding: 1rem;
  }

  .ewt-section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .ewt-language-header {
    flex-direction: column;
    align-items: stretch;
  }

  .ewt-instruction-item {
    flex-direction: column;
  }

  .ewt-instruction-fields {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .ewt-form-grid {
    gap: 0.75rem;
  }

  .ewt-input,
  .ewt-textarea {
    padding: 0.625rem;
    font-size: 0.8125rem;
  }
}
</style>
