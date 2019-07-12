<template>
  <form
    class="kaipkg-form"
    @submit="submit"
  >
    <div
      v-for="field in schema"
      :key="field.name"
      class="kaipkg-field"
    >
      <input
        :value="value[field.name]"
        :required="!!field.required"
        @input="e => emitChange(field.name, e)"
      >
    </div>
    <div class="kaipkg-field">
      <input
        type="submit"
        value="Submit"
      >
    </div>
  </form>
</template>

<script>
export default {
  name: 'VueForm',
  props: {
    value: {
      type: Object,
      required: true,
    },
    schema: {
      type: Array,
      required: true,
    },
  },
  methods: {
    emitChange(field, e) {
      this.$emit('input', {
        ...this.value,
        [field]: e.target.value,
      });
    },
    submit(e) {
      this.$emit('submit', e);
    },
  },
};
</script>

<style lang="scss">
.kaipkg-form {
  border: 1px solid #ccc;
  padding: 5px;
}
</style>
