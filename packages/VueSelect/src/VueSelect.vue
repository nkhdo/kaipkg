<template>
  <div
    class="kaipkg-select"
    :class="componentClasses"
  >
    <div
      class="kaipkg-select__container"
      @click.prevent.stop="handleClick"
    >
      <div
        v-for="val in values"
        v-show="showValues"
        :key="val"
        class="kaipkg-select__container-value"
      >
        <slot
          name="selected-option"
          :selected-option="findOptionWithValue(val)"
        >
          {{ labelFor(findOptionWithValue(val)) }}
        </slot>
      </div>
      <input
        ref="inputElement"
        v-model="search"
        :class="inputClasses"
        :placeholder="inputPlaceholder"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
      >
      <div class="kaipkg-select__container-arrow">
        <slot name="arrow">
          <div class="kaipkg-select__arrow" />
        </slot>
      </div>
    </div>
    <div class="kaipkg-select__options">
      <div
        v-for="option in options"
        :key="valueFor(option)"
        class="kaipkg-select__options-item"
        @mousedown="selectOption(option)"
      >
        <slot
          name="option"
          :option="option"
        >
          {{ labelFor(option) }}
        </slot>
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
  },
  methods: {
    handleClick() {
      this.$refs.inputElement.focus();
    },
    handleInputFocus() {
      this.open = true;
    },
    handleInputBlur() {
      this.open = false;
      this.search = '';
    },
    selectOption(option) {
      const value = this.valueFor(option);
      if (this.multiple) {
        this.$emit('input', [...this.value, value]);
      } else {
        this.$emit('input', value);
      }
      this.open = false;
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
  },
};
</script>

<style lang="scss">
$spacer: .5rem;

$border-color: #f0f0f0;
$border-color-open: #80bdff;
$border-radius: 4px;

$background-color: #ffffff;
$background-color-hover: #fcfcfc;
$background-color-active: #80bdff;
$background-color-disabled: #fbfbfb;

.kaipkg-select {
  position: relative;

  &__container {
    border: 1px solid $border-color;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    padding: $spacer;
    border-radius: $border-radius;
    background-color: $background-color;
    cursor: pointer;
    z-index: 1;

    &-value {
      margin-right: $spacer / 2;
    }

    &-input {
      border: none;
      outline: none;
      width: 100%;
      background: transparent;
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
      }
    }
  }

  &__options {
    border: 1px solid $border-color;
    border-radius: $border-radius;
    width: 100%;
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
</style>
