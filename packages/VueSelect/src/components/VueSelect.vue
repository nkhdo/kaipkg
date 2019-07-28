<template>
  <div
    class="kaipkg-select"
    :class="componentClasses"
  >
    <div
      class="kaipkg-select__container"
      @click.prevent.stop="handleContainerClick"
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
            v-if="clearable || multiple"
            class="kaipkg-select__deselect"
            title="Deselect"
            @click.prevent.stop="deselectOption(val)"
          />
        </div>
        <input
          ref="inputElement"
          v-model="search"
          :class="inputClasses"
          :placeholder="inputPlaceholder"
          @focus="showOptionsSelect"
          @blur="hideOptionsSelect"
        >
        <a
          v-if="clearable && multiple && !empty"
          class="kaipkg-select__deselect kaipkg-select__deselect-all"
          title="Deselect all"
          @click.prevent.stop="deselectAll()"
        />
      </div>
      <div class="kaipkg-select__container-arrow">
        <div class="kaipkg-select__arrow" />
      </div>
    </div>
    <div class="kaipkg-select__options">
      <div
        v-for="option in shownOptions"
        :key="valueFor(option)"
        class="kaipkg-select__options-item"
        :class="{ 'kaipkg-select__options-item__active': isSelected(option) }"
        @mousedown="handleOptionClick(option)"
      >
        <slot
          name="option"
          :option="option"
        >
          {{ labelFor(option) }}
        </slot>
      </div>
      <div
        v-if="shownOptions.length === 0"
        class="kaipkg-select-text__muted"
      >
        <span v-if="options.length === 0">
          No option...
        </span>
        <span>
          No more option...
        </span>
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
  },
  data() {
    return {
      search: '',
      open: false,
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
        return this.value.length === 0;
      }
      return this.value === null || this.value === undefined;
    },
    inputPlaceholder() {
      if (!this.open || this.multiple) {
        return this.placeholder;
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
        return false;
      }
      return this.open || this.empty;
    },
    shownOptions() {
      if (this.multiple) {
        return this.options.filter(option => !this.isSelected(option));
      }
      return this.options;
    },
  },
  methods: {
    handleContainerClick() {
      this.$refs.inputElement.focus();
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
    deselectAll() {
      if (this.multiple) {
        this.$emit('input', []);
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
      return this.options.find(option => this.valueFor(option) === value);
    },
    isSelected(option) {
      return this.values.includes(this.valueFor(option));
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

.kaipkg-select {
  position: relative;

  &__container {
    border: 1px solid $border-color;
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
      margin-right: $spacer / 2;
      &-value {
        display: inline-flex;
        align-items: center;
        margin-right: $spacer / 2;
        flex: 1;
        .kaipkg-select__deselect {
          margin-left: auto;
        }
      }
    }

    &-input {
      border: none;
      outline: none;
      background: transparent;
      flex: 1;
    }

    &-arrow {
      margin-left: auto;
      .kaipkg-select__arrow {
        border-color: darken($border-color, 10%);
        border-style: solid;
        border-width: 0 2px 2px 0;
        width: 5px;
        height: 5px;
        transform: rotate(45deg);
        margin: 0 2px 2px 0;
      }
    }
  }

  &__options {
    border: 1px solid $border-color;
    border-radius: $border-radius;
    width: 100%;
    max-height: 200px;
    overflow: auto;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: $background-color;

    display: none;
    opacity: 0;
    z-index: -1;

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

  &.kaipkg-select--open {
    .kaipkg-select__container {
      border-color: $border-color-open;
    }
    .kaipkg-select__options {
      display: block;
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
          flex: unset;
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
  top: 0;
  left: 0;
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
    background-color: darken($border-color, 10%);
    position: absolute;
    top: 4px;
  }
  &:after {
    content: "";
    width: 2px;
    height: 10px;
    background-color: darken($border-color, 10%);
    position: absolute;
    left: 4px;
  }
  &:hover, &:focus {
    &:before, &::after {
      background-color: darken($border-color, 20%);
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
}
</style>
