<template>
  <div id="basic">
    <vue-form
      v-model="formData"
      :schema="formSchema"
      no-submit-button
    />
    <hr>
    <div class="preview">
      {{ formData }}
    </div>
  </div>
</template>

<script>
import VueForm from '../src/components/VueForm.vue';

export default {
  name: 'NoSubmitButtonStory',
  components: {
    VueForm,
  },
  data: () => ({
    formData: {
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
    handleSubmit() {
      // eslint-disable-next-line no-alert
      alert('Submit!');
    },
  },
};
</script>
