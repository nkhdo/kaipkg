<template>
  <form
    :id="formId"
    class="vue-form"
    @submit="submit"
  >
    <vue-form-input
      v-for="field in schema"
      :key="field.name"
      :schema="field"
      :value="value[field.name]"
      @input="value => emitChange(field.name, value)"
    />
    <div
      v-if="!noSubmitButton"
      class="vue-input"
    >
      <slot name="submit-button">
        <input
          class="vue-input-el"
          type="submit"
          value="Submit"
        >
      </slot>
    </div>
  </form>
</template>

<script>
import VueFormInput from './VueFormInput.vue';

export default {
  name: 'VueForm',
  components: {
    VueFormInput,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
    schema: {
      type: Array,
      required: true,
    },
    noSubmitButton: {
      type: Boolean,
      default: false,
    },
  },
  provide() {
    return {
      formId: this.formId,
    };
  },
  data() {
    return {
      formId: Math.random().toString(36).substring(7),
    };
  },
  methods: {
    emitChange(field, value) {
      this.$emit('input', {
        ...this.value,
        [field]: value,
      });
    },
    submit(e) {
      this.$emit('submit', e);
    },
  },
};
</script>

<style lang="scss">
@import '../scss/main.scss';
</style>
