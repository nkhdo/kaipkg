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
        :clearable="clearable"
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
        :clearable="clearable"
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
          id="clearable-checkbox"
          v-model="clearable"
          type="checkbox"
        >
        <label for="clearable-checkbox">clearable</label>
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
          label: 'Apple make the label longer longer',
          value: 'apple',
        },
        {
          label: 'Orange make the label longer longer',
          value: 'orange',
        },
        {
          label: 'Pen long long long long long label',
          value: 'pen',
        },
        {
          label: 'Bucket long again long long long long',
          value: 'bucket',
        },
      ],
      singleValue: null,
      multipleValues: [],
      searchable: true,
      clearable: true,
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
