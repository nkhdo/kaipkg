<template>
  <div class="vue-select__options">
    <div
      v-if="groupLabel"
      class="vue-select__options-group"
    >
      {{ groupLabel }}
    </div>
    <div
      v-for="option in shownOptions"
      :key="valueFor(option)"
      :data-value="valueFor(option)"
      class="vue-select__options-item"
      :class="{ 'vue-select__options-item--active': isSelected(option) }"
      @mousedown.prevent.stop="handleOptionClick(option)"
    >
      <slot :option="option" />
    </div>
    <div
      v-if="creatable && !!search"
      class="vue-select__options-item"
      @mousedown.prevent.stop="createOption(search)"
    >
      create "<strong>{{ search }}</strong>"
    </div>
    <template
      v-else-if="shownOptions.length === 0"
    >
      <div
        v-if="allOptions.length === 0"
        class="vue-select__text--muted"
      >
        No option...
      </div>
      <div
        v-else-if="!!search"
        class="vue-select__text--muted"
      >
        No matching option...
      </div>
      <div
        v-else
        class="vue-select__text--muted"
      >
        No more option...
      </div>
    </template>
  </div>
</template>

<script>
import optionsMixin from '../mixins/options';

export default {
  name: 'VueSelectOptions',
  mixins: [optionsMixin],
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
    isSelected(option) {
      return this.values.includes(this.valueFor(option));
    },
    handleOptionClick(option) {
      this.$emit('option-click', option);
    },
    createOption(value) {
      const option = this.createOptionFn(value);
      if (option === undefined) {
        // no option created
        return;
      }
      if (this.findOptionWithValue(this.valueFor(option)) !== undefined) {
        // duplicated option
        this.$emit('option-click', option);
        return;
      }
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

.vue-select__options {
  &-group {
    font-weight: 600;
    padding: $spacer;
  }
  &-item {
    padding: $spacer $spacer * 2;
    cursor: pointer;
    &:hover {
      background-color: $background-color-hover;
    }
  }
  &-item--focus {
    background-color: $background-color-hover;
  }
  &-item--active {
    background-color: $background-color-active;
  }

  .vue-select__text--muted {
    padding: 0 $spacer $spacer;
    color: #666;
    text-align: center;
  }
}
</style>
