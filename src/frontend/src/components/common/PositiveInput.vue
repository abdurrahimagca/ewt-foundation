<template>
  <input
    :id="id"
    v-model.number="localValue"
    type="number"
    class="form-input"
    :min="min"
    @input="validateInput"
  />
</template>

<script>
export default {
  props: {
    id: String,
    value: Number,
    min: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", Math.max(this.min, newValue));
      },
    },
  },
  methods: {
    validateInput(event) {
      if (event.target.value < this.min) {
        this.localValue = this.min;
      }
    },
  },
};
</script>
