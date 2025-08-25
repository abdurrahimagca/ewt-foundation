<script lang="ts" setup>
import {
  MeetingPointData,
  meetingPointDataSchema,
} from "../types/meeting-data";
import { ref, watch } from "vue";
import OpenStreetMap from "@/modules/shared/components/OpenStreetMap.vue";

const props = defineProps<{
  meetingPointOptionData?: Record<string, unknown> | null;
}>();

const emit = defineEmits<{
  (e: "update:meetingPointData", value: MeetingPointData): void;
}>();

// Default data structure for new meeting point data
const createDefaultData = (): MeetingPointData => ({
  meeting_point_option_data: {
    input_type: "manual_input",
    content: [
      {
        langCode: "en-GB",
        title: "",
        description: "",
      },
    ],
  },
});

// Validate and parse the incoming data
const validateData = (
  data: Record<string, unknown> | null | undefined,
): MeetingPointData => {
  if (!data) {
    return createDefaultData();
  }

  try {
    return meetingPointDataSchema.parse(data);
  } catch (error) {
    console.warn("Invalid meeting point data, using default:", error);
    return createDefaultData();
  }
};

// Create a reactive copy of the data
const localData = ref<MeetingPointData>(
  validateData(props.meetingPointOptionData),
);

// Watch for external prop changes
watch(
  () => props.meetingPointOptionData,
  (newValue) => {
    localData.value = validateData(newValue);
  },
  { deep: true },
);

// Emit changes to parent
const emitUpdate = () => {
  emit("update:meetingPointData", localData.value);
};

// Helper to add new content item
const addContentItem = () => {
  localData.value.meeting_point_option_data.content.push({
    langCode: "en-GB",
    title: "",
    description: "",
  });
  emitUpdate();
};

// Helper to remove content item
const removeContentItem = (index: number) => {
  localData.value.meeting_point_option_data.content.splice(index, 1);
  emitUpdate();
};

// Helper to add new option (only for select type)
const addOption = () => {
  if (localData.value.meeting_point_option_data.input_type === "select") {
    localData.value.meeting_point_option_data.options.push([
      {
        langCode: "en-GB",
        title: "",
        description: "",
      },
    ]);
    emitUpdate();
  }
};

// Helper to remove option
const removeOption = (index: number) => {
  if (localData.value.meeting_point_option_data.input_type === "select") {
    localData.value.meeting_point_option_data.options.splice(index, 1);
    emitUpdate();
  }
};

// Helper to add language variant to option
const addOptionLanguage = (optionIndex: number) => {
  if (localData.value.meeting_point_option_data.input_type === "select") {
    localData.value.meeting_point_option_data.options[optionIndex].push({
      langCode: "es-ES",

      title: "",
      description: "",
    });
    emitUpdate();
  }
};

// Helper to remove language variant from option
const removeOptionLanguage = (optionIndex: number, langIndex: number) => {
  if (localData.value.meeting_point_option_data.input_type === "select") {
    localData.value.meeting_point_option_data.options[optionIndex].splice(
      langIndex,
      1,
    );
    emitUpdate();
  }
};

// Change input type
const changeInputType = (
  newType: "select" | "manual_input" | "open_street_maps_iframe_options",
) => {
  if (newType === "select") {
    localData.value.meeting_point_option_data = {
      input_type: "select",
      content: localData.value.meeting_point_option_data.content,
      options: [],
    };
  } else if (newType === "open_street_maps_iframe_options") {
    localData.value.meeting_point_option_data = {
      input_type: "open_street_maps_iframe_options",
      content: localData.value.meeting_point_option_data.content,
      options: [],
    };
  } else {
    localData.value.meeting_point_option_data = {
      input_type: "manual_input",
      content: localData.value.meeting_point_option_data.content,
    };
  }
  emitUpdate();
};

// Map point methods
const addMapPoint = () => {
  if (
    localData.value.meeting_point_option_data.input_type ===
    "open_street_maps_iframe_options"
  ) {
    localData.value.meeting_point_option_data.options.push({
      langCode: "en-GB",
      title: "",
      description: "",
      latitude: 51.505,
      longitude: -0.09,
    });
    emitUpdate();
  }
};

const removeMapPoint = (index: number) => {
  if (
    localData.value.meeting_point_option_data.input_type ===
    "open_street_maps_iframe_options"
  ) {
    localData.value.meeting_point_option_data.options.splice(index, 1);
    emitUpdate();
  }
};

const updateMapPointCoordinates = (
  index: number,
  point: { lat: number; lng: number },
) => {
  if (
    localData.value.meeting_point_option_data.input_type ===
    "open_street_maps_iframe_options"
  ) {
    localData.value.meeting_point_option_data.options[index].latitude =
      point.lat;
    localData.value.meeting_point_option_data.options[index].longitude =
      point.lng;
    emitUpdate();
  }
};

const clearMapPointCoordinates = (index: number) => {
  if (
    localData.value.meeting_point_option_data.input_type ===
    "open_street_maps_iframe_options"
  ) {
    localData.value.meeting_point_option_data.options[index].latitude = 51.505;
    localData.value.meeting_point_option_data.options[index].longitude = -0.09;
    emitUpdate();
  }
};

const formatCoordinates = (mapPoint: {
  latitude: number;
  longitude: number;
}) => {
  return `${mapPoint.latitude.toFixed(6)}, ${mapPoint.longitude.toFixed(6)}`;
};
</script>

<template>
  <div class="meeting-point-editor">
    <div class="header-row">
      <h3>Meeting Point</h3>
      <div class="segmented">
        <button
          type="button"
          :class="[
            'segment',
            {
              active:
                localData.meeting_point_option_data.input_type ===
                'manual_input',
            },
          ]"
          @click="changeInputType('manual_input')"
        >
          Manual input
        </button>
        <button
          type="button"
          :class="[
            'segment',
            {
              active:
                localData.meeting_point_option_data.input_type === 'select',
            },
          ]"
          @click="changeInputType('select')"
        >
          Select list
        </button>
        <button
          type="button"
          :class="[
            'segment',
            {
              active:
                localData.meeting_point_option_data.input_type ===
                'open_street_maps_iframe_options',
            },
          ]"
          @click="changeInputType('open_street_maps_iframe_options')"
        >
          Map Points
        </button>
      </div>
    </div>

    <p class="help">
      Maintain localized content below. Switch input type to allow a dropdown of
      predefined meeting points.
    </p>

    <!-- Content Section -->
    <div class="card content-section">
      <div class="card-header">
        <h4>Localized content</h4>
        <button @click="addContentItem" class="btn btn-primary">
          Add content
        </button>
      </div>
      <div
        v-for="(content, index) in localData.meeting_point_option_data.content"
        :key="index"
        class="content-item"
      >
        <div class="row header">
          <span>Item {{ index + 1 }}</span>
          <button @click="removeContentItem(index)" class="btn btn-ghost">
            Remove
          </button>
        </div>

        <div class="form-group">
          <label>Language</label>
          <select v-model="content.langCode" @change="emitUpdate">
            <option value="en-GB">English (GB)</option>
            <option value="es-ES">Spanish (ES)</option>
          </select>
        </div>

        <div class="form-group">
          <label>Title</label>
          <input
            v-model="content.title"
            @input="emitUpdate"
            type="text"
            placeholder="Enter title"
          />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea
            v-model="content.description"
            @input="emitUpdate"
            placeholder="Enter description"
            rows="3"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Options Section (only for select type) -->
    <div
      v-if="localData.meeting_point_option_data.input_type === 'select'"
      class="card options-section"
    >
      <div class="card-header">
        <h4>Options</h4>
        <button @click="addOption" class="btn btn-primary">Add option</button>
      </div>

      <div
        v-for="(option, optionIndex) in localData.meeting_point_option_data
          .options"
        :key="optionIndex"
        class="option-group"
      >
        <div class="row header">
          <span>Option {{ optionIndex + 1 }}</span>
          <button @click="removeOption(optionIndex)" class="btn btn-ghost">
            Remove option
          </button>
        </div>

        <div
          v-for="(lang, langIndex) in option"
          :key="langIndex"
          class="option-language"
        >
          <div class="row header small">
            <span>Language {{ langIndex + 1 }}</span>
            <button
              @click="removeOptionLanguage(optionIndex, langIndex)"
              class="btn btn-ghost"
            >
              Remove language
            </button>
          </div>

          <div class="form-group">
            <label>Language</label>
            <select v-model="lang.langCode" @change="emitUpdate">
              <option value="en-GB">English (GB)</option>
              <option value="es-ES">Spanish (ES)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Title</label>
            <input
              v-model="lang.title"
              @input="emitUpdate"
              type="text"
              placeholder="Enter option title"
            />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea
              v-model="lang.description"
              @input="emitUpdate"
              placeholder="Enter option description"
              rows="2"
            ></textarea>
          </div>
        </div>

        <button @click="addOptionLanguage(optionIndex)" class="btn">
          Add language variant
        </button>
      </div>
    </div>

    <!-- Map Points Section (only for open_street_maps_iframe_options type) -->
    <div
      v-if="
        localData.meeting_point_option_data.input_type ===
        'open_street_maps_iframe_options'
      "
      class="card map-points-section"
    >
      <div class="card-header">
        <h4>Map Points</h4>
        <button @click="addMapPoint" class="btn btn-primary">
          Add map point
        </button>
      </div>

      <div
        v-for="(mapPoint, mapPointIndex) in localData.meeting_point_option_data
          .options"
        :key="mapPointIndex"
        class="map-point-group"
      >
        <div class="row header">
          <span>Map Point {{ mapPointIndex + 1 }}</span>
          <button @click="removeMapPoint(mapPointIndex)" class="btn btn-ghost">
            Remove point
          </button>
        </div>

        <!-- OpenStreetMap Component -->
        <div class="map-container">
          <OpenStreetMap
            :model-value="{ lat: mapPoint.latitude, lng: mapPoint.longitude }"
            :initial-lat="mapPoint.latitude || 51.505"
            :initial-lng="mapPoint.longitude || -0.09"
            :initial-zoom="13"
            height="300px"
            @point-selected="
              (point) => updateMapPointCoordinates(mapPointIndex, point)
            "
            @point-cleared="() => clearMapPointCoordinates(mapPointIndex)"
          />
        </div>

        <!-- Map Point Details -->
        <div class="map-point-details">
          <div class="row two-cols">
            <div class="form-group">
              <label>Language</label>
              <select v-model="mapPoint.langCode" @change="emitUpdate">
                <option value="en-GB">English (GB)</option>
                <option value="es-ES">Spanish (ES)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Coordinates</label>
              <input
                :value="formatCoordinates(mapPoint)"
                type="text"
                readonly
                placeholder="Select a point on the map"
                class="coordinates-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Title</label>
            <input
              v-model="mapPoint.title"
              @input="emitUpdate"
              type="text"
              placeholder="Enter point title"
            />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea
              v-model="mapPoint.description"
              @input="emitUpdate"
              placeholder="Enter point description"
              rows="2"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meeting-point-editor {
  max-width: 880px;
  padding: 20px;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.segmented {
  display: inline-flex;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.segment {
  padding: 6px 12px;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-size: 13px;
  color: #4b5563;
}

.segment.active {
  background: #ffffff;
  color: #111827;
}

.help {
  margin: 8px 0 16px;
  color: #6b7280;
  font-size: 12px;
}

.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  padding: 16px;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.row.header {
  margin-bottom: 10px;
  font-weight: 600;
}

.row.header.small {
  font-weight: 500;
}

.two-cols {
  gap: 12px;
}

.two-cols > * {
  flex: 1 1 0;
}

.content-item,
.option-group {
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  background: #fafafa;
}

.option-language {
  border: 1px solid #ececec;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
  background: #ffffff;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
}

.btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
}

.btn:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.btn-primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.btn-ghost {
  background: transparent;
  border-color: transparent;
  color: #6b7280;
}

.btn-ghost:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

/* Map-specific styles */
.map-points-section {
  margin-top: 20px;
}

.map-point-group {
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: #fafafa;
}

.map-container {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.map-point-details {
  background: #ffffff;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.coordinates-input {
  background-color: #f9fafb !important;
  font-family: monospace;
  color: #059669;
  font-weight: 500;
}
</style>
