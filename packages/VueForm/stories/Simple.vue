<template>
  <div id="simple">
    <vue-form
      v-model="formData"
      :schema="formSchema"
      @submit.prevent="handleSubmit"
    />
  </div>
</template>

<script>
import VueForm from '../src/components/VueForm.vue';

export default {
  name: 'SimpleStory',
  components: {
    VueForm,
  },
  data: () => ({
    formData: {
      firstName: 'Hoang',
      lastName: 'Do',
    },
    formSchema: [
      {
        name: 'firstName',
        label: 'First name',
        type: String,
        required: true,
      },
      {
        name: 'lastName',
        label: 'Last name',
        type: String,
        required: true,
      },
    ],
  }),
  methods: {
    handleSubmit(e) {
      window.console.log('submit', e);
      window.console.log('data', this.formData);
    },
  },
};
</script>
