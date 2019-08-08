<template>
  <div id="normalizer">
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
        :creatable="creatable"
        :disabled="disabled"
      >
        <template v-slot:selected-option="{option}">
          {{ option.label }} <i>({{ option.value }})</i>
        </template>
        <template v-slot:option="{option}">
          {{ option.label }} <i>({{ option.value }})</i>
        </template>
      </vue-select>
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
        :creatable="creatable"
        :disabled="disabled"
        multiple
        autofocus
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
          id="creatable-checkbox"
          v-model="creatable"
          type="checkbox"
        >
        <label for="creatable-checkbox">creatable</label>
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
import VueSelect from '../src/components/VueSelect.vue';

export default {
  name: 'NormalizerStory',
  components: {
    VueSelect,
  },
  data() {
    return {
      options: [
        {
          label: 'This is an option with "null" value',
          value: null,
        },
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
      singleValue: 'kaid',
      multipleValues: ['kaid'],
      searchable: true,
      clearable: true,
      creatable: true,
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
