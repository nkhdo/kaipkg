<template>
  <div class="kaipkg-select__options">
    <div
      v-if="groupLabel"
      class="kaipkg-select__options-group"
    >
      {{ groupLabel }}
    </div>
    <div
      v-for="option in shownOptions"
      :key="valueFor(option)"
      class="kaipkg-select__options-item"
      :class="{ 'kaipkg-select__options-item--active': isSelected(option) }"
      @mousedown.prevent.stop="handleOptionClick(option)"
    >
      <slot :option="option" />
    </div>
    <template
      v-if="shownOptions.length === 0"
    >
      <div
        v-if="creatable && !!search"
        class="kaipkg-select__options-item"
        @mousedown.prevent.stop="createOption(search)"
      >
        create "<strong>{{ search }}</strong>"
      </div>
      <div
        v-else-if="allOptions.length === 0"
        class="kaipkg-select__text--muted"
      >
        No option...
      </div>
      <div
        v-else-if="!!search"
        class="kaipkg-select__text--muted"
      >
        No matching option...
      </div>
      <div
        v-else
        class="kaipkg-select__text--muted"
      >
        No more option...
      </div>
    </template>
  </div>
</template>

<script>
import { valueFor, labelFor } from '../utils/options';

export default {
  name: 'VueSelectOptions',
  props: {
    groupLabel: {
      type: String,
      default: '',
    },
    values: {
      type: Array,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    valueKey: {
      type: String,
      required: true,
    },
    labelKey: {
      type: String,
      required: true,
    },
    multiple: {
      type: Boolean,
      required: true,
    },
    creatable: {
      type: Boolean,
      required: true,
    },
    searchable: {
      type: Boolean,
      required: true,
    },
    search: {
      type: String,
      required: true,
    },
    createOptionFn: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      createdOptions: [],
    };
  },
  computed: {
    allOptions() {
      return [...this.options, ...this.createdOptions];
    },
    shownOptions() {
      // for multiple select, filter out the selected options
      const options = this.multiple
        ? this.allOptions.filter(option => !this.isSelected(option))
        : this.allOptions;
      if (!this.searchable || !this.search) {
        return options;
      }
      // linear search
      const lowercaseSearch = this.search.toLowerCase();
      return options.filter(option => this.labelFor(option)
        .toString()
        .toLowerCase()
        .includes(lowercaseSearch));
    },
  },
  methods: {
    valueFor(option) {
      return valueFor(option, this.valueKey);
    },
    labelFor(option) {
      return labelFor(option, this.labelKey);
    },
    isSelected(option) {
      return this.values.includes(this.valueFor(option));
    },
    handleOptionClick(option) {
      this.$emit('option-click', option);
    },
    createOption(value) {
      const option = this.createOptionFn(value);
      if (option !== undefined) {
        this.createdOptions.push(option);
        this.$emit('option-created', option);
      }
    },
  },
};
</script>

<style lang="scss">
@import '../scss/variables';

.kaipkg-select__options {
  &-group {
    font-weight: 600;
    padding: $spacer;
  }
  &-item {
    padding: $spacer $spacer * 2;
    cursor: pointer;
    &:hover, &:focus {
      background-color: $background-color-hover;
    }
  }
  &-item--active {
    background-color: $background-color-active;
  }

  .kaipkg-select__text--muted {
    padding: 0 $spacer $spacer;
    color: #666;
    text-align: center;
  }
}
</style>
