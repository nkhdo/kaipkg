<template>
  <div class="vue-select__options">
    <div
      v-if="groupLabel"
      class="vue-select__options-item vue-select__options-group"
      :data-show="showOptionsPanel"
      @mousedown.stop.prevent="toggleShow"
    >
      <div
        v-if="collapsible"
        class="vue-select__arrow"
        :class="{ rotated: !showOptionsPanel }"
      />
      <span>
        {{ groupLabel }}
      </span>
    </div>
    <div v-if="showOptionsPanel">
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
    collapsible: {
      type: Boolean,
      default: false,
    },
    search: {
      type: String,
      required: true,
    },
    createOptionFn: {
      type: Function,
      required: true,
    },
    initiallyExpanded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showOptions: {
        noSearch: this.initiallyExpanded,
        search: false,
      },
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
    showOptionsPanel() {
      if (!this.collapsible) {
        return true;
      }
      return this.search ? this.showOptions.search : this.showOptions.noSearch;
    },
  },
  watch: {
    search: {
      handler(val) {
        if (val) {
          this.showOptions.search = this.shownOptions.length > 0;
        }
      },
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
    toggleShow() {
      if (!this.collapsible) {
        return;
      }
      if (this.search) {
        this.showOptions.search = !this.showOptions.search;
      } else {
        this.showOptions.noSearch = !this.showOptions.noSearch;
      }
    },
  },
};
</script>

<style lang="scss">
@import '../scss/variables';

.vue-select__options {
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

  &-group {
    font-weight: 600;
    padding: $spacer;
    .vue-select__arrow {
      display: inline-block;
      margin-right: $spacer/2;
      &.rotated {
        transform: rotate(-45deg);
      }
    }
  }

  .vue-select__text--muted {
    padding: 0 $spacer $spacer;
    color: #666;
    text-align: center;
  }
}
</style>
