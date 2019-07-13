<template>
  <input
    :value="value"
    :placeholder="schema.placeholder"
    @input="onInput"
  >
</template>

<script>
export default {
  name: 'TextInput',
  props: {
    value: {
      type: String,
      required: true,
    },
    schema: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value);
    },
  },
};
</script>
