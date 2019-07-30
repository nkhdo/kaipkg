<template>
  <div
    class="kaipkg-select"
    :class="componentClasses"
  >
    <div
      class="kaipkg-select__container"
      @click.prevent.stop="focus"
    >
      <div class="kaipkg-select__container-values">
        <div
          v-for="val in values"
          v-show="showValues"
          :key="val"
          class="kaipkg-select__container-values-value"
        >
          <slot
            name="selected-option"
            :selected-option="findOptionWithValue(val)"
          >
            {{ labelFor(findOptionWithValue(val)) }}
          </slot>
          <a
            v-if="multiple"
            class="kaipkg-select__deselect"
            title="Deselect"
            @click.prevent.stop="deselectOption(val)"
          />
        </div>
        <input
          ref="inputElement"
          v-model="search"
          :placeholder="inputPlaceholder"
          :class="inputClasses"
          @focus="showOptionsSelect"
          @blur="hideOptionsSelect"
        >
      </div>
      <div class="kaipkg-select__container-actions">
        <a
          v-if="clearable && !empty"
          class="kaipkg-select__deselect kaipkg-select__deselect-all"
          title="Clear"
          @click.prevent.stop="clear()"
        />
        <div class="kaipkg-select__arrow" />
      </div>
    </div>
    <div class="kaipkg-select__options">
      <div class="kaipkg-select__options-header">
        <slot name="options-header" />
      </div>
      <div class="kaipkg-select__options-body">
        <div
          v-for="option in shownOptions"
          :key="valueFor(option)"
          class="kaipkg-select__options-body-item"
          :class="{ 'kaipkg-select__options-body-item__active': isSelected(option) }"
          @mousedown.prevent.stop="handleOptionClick(option)"
        >
          <slot
            name="option"
            :option="option"
          >
            {{ labelFor(option) }}
          </slot>
        </div>
        <template
          v-if="shownOptions.length === 0"
        >
          <div
            v-if="creatable && !!search"
            class="kaipkg-select__options-body-item"
            @mousedown.prevent.stop="createOption(search)"
          >
            create "<strong>{{ search }}</strong>"
          </div>
          <div
            v-else-if="allOptions.length === 0"
            class="kaipkg-select-text__muted"
          >
            No option...
          </div>
          <div
            v-else-if="!!search"
            class="kaipkg-select-text__muted"
          >
            No matching option...
          </div>
          <div
            v-else
            class="kaipkg-select-text__muted"
          >
            No more option...
          </div>
        </template>
      </div>
      <div class="kaipkg-select__options-footer">
        <slot name="options-footer" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueSelect',
  props: {
    // eslint-disable-next-line vue/require-prop-types, vue/require-default-prop
    value: {},
    options: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Select...',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    creatable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    valueKey: {
      type: String,
      default: 'value',
    },
    labelKey: {
      type: String,
      default: 'label',
    },
    createOptionFn: {
      type: Function,
      default: value => value.trim(),
    },
  },
  data() {
    return {
      search: '',
      open: false,
      createdOptions: [],
    };
  },
  computed: {
    componentClasses() {
      return {
        'kaipkg-select--open': this.open,
        'kaipkg-select--multiple': this.multiple,
        'kaipkg-select--disabled': this.disabled,
      };
    },
    inputClasses() {
      return {
        'kaipkg-select__container-input': true,
        'kaipkg--transparent': !this.showInput,
      };
    },
    empty() {
      if (this.multiple) {
        return (this.value || []).length === 0;
      }
      return this.value === null || this.value === undefined;
    },
    inputPlaceholder() {
      if (!this.open) {
        return this.placeholder;
      }
      if (this.multiple) {
        return 'Search...';
      }
      return this.labelFor(this.findOptionWithValue(this.value)) || this.placeholder;
    },
    values() {
      if (this.empty) {
        return [];
      }
      if (this.multiple) {
        return this.value;
      }
      return [this.value];
    },
    showValues() {
      if (!this.multiple) {
        return !this.open || !this.searchable;
      }
      return true;
    },
    showInput() {
      if (!this.searchable) {
        return this.empty;
      }
      return this.open || this.empty;
    },
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
  created() {
    // force input value of multiple select to be an array
    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit('input', []);
    }
  },
  methods: {
    focus() {
      this.$refs.inputElement.focus();
    },
    blur() {
      this.$refs.inputElement.blur();
    },
    handleOptionClick(option) {
      if (this.multiple) {
        this.toggleOption(option);
      } else {
        this.selectOption(option);
      }
    },
    showOptionsSelect() {
      this.open = true;
    },
    hideOptionsSelect() {
      this.open = false;
      this.search = '';
    },
    toggleOption(option) {
      const value = this.valueFor(option);
      if (this.values.includes(value)) {
        this.deselectOption(value);
      } else {
        this.selectOption(option);
      }
    },
    selectOption(option) {
      const value = this.valueFor(option);
      if (this.multiple) {
        this.$emit('input', [...this.value, value]);
      } else {
        this.$emit('input', value);
      }
      this.hideOptionsSelect();
    },
    deselectOption(value) {
      if (this.multiple) {
        this.$emit('input', this.value.filter(v => v !== value));
      } else {
        this.$emit('input', null);
      }
      this.hideOptionsSelect();
    },
    clear() {
      if (this.multiple) {
        this.$emit('input', []);
      } else {
        this.$emit('input', null);
      }
    },
    labelFor(option) {
      if (typeof option === 'object') {
        return option[this.labelKey];
      }
      return option;
    },
    valueFor(option) {
      if (typeof option === 'object') {
        return option[this.valueKey];
      }
      return option;
    },
    findOptionWithValue(value) {
      return this.allOptions.find(option => this.valueFor(option) === value);
    },
    isSelected(option) {
      return this.values.includes(this.valueFor(option));
    },
    createOption(value) {
      const option = this.createOptionFn(value);
      if (option) {
        this.createdOptions.push(option);
        this.selectOption(option);
      }
    },
  },
};
</script>

<style lang="scss">
$spacer: .5rem;

$border-color: #f0f0f0;
$border-color-open: #80bdff;
$border-radius: 4px;

$background-color: #ffffff;
$background-color-hover: #f5f6f7;
$background-color-active: rgba(199, 224, 244, 0.35);
$background-color-disabled: #fbfbfb;

$box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);

.kaipkg-select {
  position: relative;

  &__container {
    border: 1px solid $border-color;
    min-width: 50px;
    display: flex;
    align-items: center;
    padding: $spacer;
    border-radius: $border-radius;
    background-color: $background-color;
    z-index: 1;

    &-values {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      flex: 1;
      min-width: 0;
      margin-right: $spacer / 2;
      &-value {
        display: inline-flex;
        align-items: center;
        margin-right: $spacer / 2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .kaipkg-select__deselect {
          margin-left: auto;
        }
      }
    }

    &-input {
      border: none;
      outline: none;
      margin: 0;
      padding: 0;
      background: transparent;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-actions {
      margin-left: auto;
      display: flex;
      align-items: center;
      .kaipkg-select__arrow {
        border-color: darken($border-color, 20%);
        border-style: solid;
        border-width: 0 2px 2px 0;
        width: 5px;
        height: 5px;
        transform: rotate(45deg);
        margin: 0 0 3px 0;
      }
    }
  }

  &__options {
    box-sizing: border-box;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    width: 100%;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: $background-color;
    box-shadow: $box-shadow;

    visibility: hidden;
    opacity: 0;
    z-index: -1;

    transition: all .1s ease-in-out;

    &-body {
      max-height: 250px;
      overflow: auto;
      &-item {
        padding: $spacer;
        cursor: pointer;
        &:hover, &:focus {
          background-color: $background-color-hover;
        }
      }
      &-item__active {
        background-color: $background-color-active;
      }
    }
  }

  &:hover {
    .kaipkg-select__container {
      border-color: $border-color-open;
    }
  }

  &.kaipkg-select--open {
    .kaipkg-select__container {
      border-color: $border-color-open;
    }
    .kaipkg-select__options {
      visibility: visible;
      opacity: 1;
      z-index: 2;
    }
  }

  &.kaipkg-select--multiple {
    .kaipkg-select__container {
      &-values {
        &-value {
          border-radius: $border-radius;
          background-color: $background-color-active;
          padding: 0 $spacer / 2;
          .kaipkg-select__deselect {
            margin-left: $spacer/2;
          }
        }
      }
    }
  }

  &.kaipkg-select--disabled {
    pointer-events: none;
    .kaipkg-select__container {
      background-color: $background-color-disabled;
    }
  }
}

.kaipkg--transparent {
  opacity: 0;
  position: absolute;
  z-index: -1;
}

.kaipkg-select__deselect {
  cursor: pointer;
  position: relative;
  display: inline-block;
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
  &:before {
    content: "";
    width: 10px;
    height: 2px;
    background-color: darken($border-color, 20%);
    position: absolute;
    top: 4px;
  }
  &:after {
    content: "";
    width: 2px;
    height: 10px;
    background-color: darken($border-color, 20%);
    position: absolute;
    left: 4px;
  }
  &:hover, &:focus {
    &:before, &::after {
      background-color: darken($border-color, 40%);
    }
  }
}

.kaipkg-select__deselect-all {
  margin-left: auto;
  margin-right: $spacer / 2;
}

.kaipkg-select-text__muted {
  padding: $spacer;
  color: #666;
  text-align: center;
}
</style>
