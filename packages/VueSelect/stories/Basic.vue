<template>
  <div id="basic">
    <div
      id="single"
      class="sample"
    >
      <label>Single</label>
      <vue-select
        v-model="singleValue"
        :options="options"
        :searchable="searchable"
        :disabled="disabled"
      />
      {{ singleValue }}
    </div>
    <div
      id="multiple"
      class="sample"
    >
      <label>Multiple</label>
      <vue-select
        v-model="multipleValues"
        :options="options"
        :searchable="searchable"
        :disabled="disabled"
        multiple
      />
      {{ multipleValues }}
    </div>
    <div class="options">
      <div>
        <input
          id="searchable-checkbox"
          v-model="searchable"
          type="checkbox"
        >
        <label for="searchable-checkbox">searchable</label>
      </div>
      <div>
        <input
          id="disabled-checkbox"
          v-model="disabled"
          type="checkbox"
        >
        <label for="disabled-checkbox">disabled</label>
      </div>
    </div>
  </div>
</template>

<script>
import VueSelect from '../src/VueSelect.vue';

export default {
  name: 'BasicStory',
  components: {
    VueSelect,
  },
  data() {
    return {
      options: [
        {
          label: 'Apple',
          value: 'apple',
        },
        {
          label: 'Orange',
          value: 'orange',
        },
        {
          label: 'Pen',
          value: 'pen',
        },
        {
          label: 'Bucket',
          value: 'bucket',
        },
      ],
      singleValue: null,
      multipleValues: [],
      searchable: true,
      multiple: false,
      disabled: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.sample {
  margin: 1rem 0;
}
</style>
