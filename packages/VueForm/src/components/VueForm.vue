<template>
  <div class="kaipkg-vue-form">
    {{message}}
  </div>
</template>

<script>
export default {
  name: 'VueForm',
  props: {
    message: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
.kaipkg-vue-form {
  background-color: #ccc;
}
</style>
