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
  name: 'BasicStory',
  components: {
    VueForm,
  },
  data: () => ({
    formData: {
      firstName: 'Hoang',
      lastName: 'Do',
      birthYear: 1994,
    },
    formSchema: [
      {
        name: 'firstName',
        label: 'First name',
        placeholder: 'John',
        type: String,
        required: true,
      },
      {
        name: 'lastName',
        label: 'Last name',
        placeholder: 'Doe',
        type: String,
        required: true,
      },
      {
        name: 'birthYear',
        label: 'Birth year',
        placeholder: 'Some year in the past',
        type: Number,
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
