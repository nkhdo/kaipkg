<template>
  <input
    type="number"
    :value="value"
    :placeholder="schema.placeholder"
    @input="onInput"
  >
</template>

<script>
export default {
  name: 'NumberInput',
  props: {
    value: {
      type: Number,
      required: true,
    },
    schema: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onInput(e) {
      this.$emit('input', parseFloat(e.target.value));
    },
  },
};
</script>
