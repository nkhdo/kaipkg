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
        :normalizer="normalizer"
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
        :creatable="creatable"
        :disabled="disabled"
        :normalizer="normalizer"
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
  name: 'BasicStory',
  components: {
    VueSelect,
  },
  data() {
    return {
      options: [
        {
          name: 'This is an option with "null" value',
          id: null,
        },
        {
          name: 'Apple make the label longer longer',
          id: 'apple',
        },
        {
          name: 'Orange make the label longer longer',
          id: 'orange',
        },
        {
          name: 'Pen long long long long long label',
          id: 'pen',
        },
        {
          name: 'Bucket long again long long long long',
          id: 'bucket',
        },
      ],
      singleValue: null,
      multipleValues: null,
      searchable: true,
      clearable: true,
      creatable: false,
      disabled: false,
      normalizer(option) {
        return {
          label: `${option.name} - ${option.id}`,
          value: option.id,
        };
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.sample {
  margin: 1rem 0;
}
</style>
