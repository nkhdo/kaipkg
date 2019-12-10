<template>
  <div :class="componentClasses">
    <div
      class="vue-select__container"
      @click.prevent="focus"
      @mousedown.prevent="preventHideOptions = true"
      @mouseup.prevent="preventHideOptions = false"
    >
      <div class="vue-select__container-values">
        <div
          v-for="val in values"
          :key="val"
          :class="valueClasses"
        >
          <div class="vue-select__container-values-value-text">
            <slot
              name="selected-option"
              :option="findOrCreateOptionWithValue(val)"
            >
              {{ labelFor(findOrCreateOptionWithValue(val)) }}
            </slot>
          </div>
          <a
            v-if="multiple"
            class="vue-select__deselect"
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
          @blur="onBlur"
          @keydown="handleKeyDown"
        >
      </div>
      <div class="vue-select__container-actions">
        <slot name="actions" />
        <a
          v-if="clearable && !empty"
          class="vue-select__deselect vue-select__deselect-all"
          title="Clear"
          @click.prevent.stop="clear()"
        />
        <div class="vue-select__arrow" />
      </div>
    </div>
    <div
      ref="panel"
      class="vue-select__panel"
    >
      <div class="vue-select__panel-header">
        <slot name="panel-header" />
      </div>
      <div class="vue-select__panel-body">
        <vue-select-options
          v-if="!grouped"
          :values="values"
          :options="normalizeOptions(options)"
          :label-key="labelKey"
          :value-key="valueKey"
          :creatable="creatable"
          :searchable="searchable"
          :search="search"
          :multiple="multiple"
          :create-option-fn="createOptionFn"
          @option-click="handleOptionClick"
          @option-created="handleOptionCreated"
        >
          <template v-slot:default="{ option }">
            <slot
              name="option"
              :option="option"
            >
              {{ labelFor(option) }}
            </slot>
          </template>
        </vue-select-options>
        <template v-else>
          <vue-select-options
            v-for="group in options"
            :key="group[groupKey]"
            :group-label="group[groupKey]"
            :collapsible="groupCollapsible"
            :initially-expanded="group.initiallyExpanded"
            :values="values"
            :options="normalizeOptions(group[optionsKey])"
            :label-key="labelKey"
            :value-key="valueKey"
            :creatable="creatable"
            :searchable="searchable"
            :search="search"
            :multiple="multiple"
            :create-option-fn="createOptionFn"
            @option-click="handleOptionClick"
            @option-created="handleOptionCreated"
          >
            <template v-slot:default="{ option }">
              <slot
                name="option"
                :option="option"
              >
                {{ labelFor(option) }}
              </slot>
            </template>
          </vue-select-options>
        </template>
      </div>
      <div class="vue-select__panel-footer">
        <slot name="panel-footer" />
      </div>
    </div>
  </div>
</template>

<script>
import optionsMixin from '../mixins/options';
import VueSelectOptions from './VueSelectOptions.vue';
import { handleKeyDown, clearFocus as clearOptionFocus } from '../utils/options';

export default {
  name: 'VueSelect',
  components: {
    VueSelectOptions,
  },
  mixins: [optionsMixin],
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
      default: (value) => value.trim(),
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    closeOnSelect: {
      type: Boolean,
      default: true,
    },
    grouped: {
      type: Boolean,
      default: false,
    },
    groupCollapsible: {
      type: Boolean,
      default: false,
    },
    groupKey: {
      type: String,
      default: 'group',
    },
    optionsKey: {
      type: String,
      default: 'options',
    },
    normalizer: {
      type: Function,
      default: (option) => option,
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
        'vue-select': true,
        'vue-select--open': this.open,
        'vue-select--empty': this.empty,
        'vue-select--single': !this.multiple,
        'vue-select--multiple': this.multiple,
        'vue-select--disabled': this.disabled,
      };
    },
    valueClasses() {
      const isPlaceholder = !this.multiple && this.showInput;
      return {
        'vue-select__container-values-value': true,
        'vue-select__placeholder': isPlaceholder,
        'vue-select--transparent': isPlaceholder && !!this.search,
      };
    },
    inputClasses() {
      return {
        'vue-select__container-input': true,
        'vue-select--transparent': !this.showInput,
      };
    },
    empty() {
      if (this.multiple) {
        return (this.value || []).length === 0;
      }
      return [null, undefined].includes(this.value)
        && this.findOptionWithValue(this.value) === undefined;
    },
    inputPlaceholder() {
      if (!this.open || this.empty) {
        return this.placeholder;
      }
      return '';
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
    showInput() {
      if (!this.searchable) {
        return this.empty;
      }
      return this.open || this.empty;
    },
    allOptions() {
      if (this.grouped) {
        return [
          ...this.options.reduce((total, current) => total.concat(current[this.optionsKey]), []),
          ...this.createdOptions,
        ];
      }
      return [...this.options, ...this.createdOptions].map(this.normalizer);
    },
  },
  created() {
    // force input value of multiple select to be an array
    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit('input', []);
    }
  },
  mounted() {
    if (this.autofocus) {
      this.focus();
    }
  },
  methods: {
    focus() {
      this.$refs.inputElement.focus();
      this.showOptionsSelect();
    },
    blur() {
      this.$refs.inputElement.blur();
      this.hideOptionsSelect();
    },
    handleOptionClick(option) {
      this.selectOption(option);
    },
    handleOptionCreated(option) {
      this.$emit('option-created', option);
      this.createdOptions.push(option);
      this.handleOptionClick(option);
    },
    showOptionsSelect() {
      if (!this.open) {
        this.open = true;
        this.$emit('focus');
      }
    },
    onBlur() {
      if (this.closeOnSelect) {
        this.hideOptionsSelect();
      }

      if (this.preventHideOptions) {
        this.preventHideOptions = false;
      } else {
        this.hideOptionsSelect();
      }
    },
    hideOptionsSelect() {
      if (this.open) {
        this.open = false;
        this.search = '';
        clearOptionFocus(this.$refs.panel);
        this.$emit('blur');
      }
    },
    selectOption(option) {
      this.search = '';
      const value = this.valueFor(option);
      if (this.multiple) {
        if (!this.values.includes(value)) {
          this.$emit('input', [...this.value, value]);
        }
      } else if (value !== this.value) {
        this.$emit('input', value);
      }
      if (this.closeOnSelect) {
        this.hideOptionsSelect();
      }
    },
    deselectOption(value) {
      if (this.multiple) {
        this.$emit('input', this.value.filter((v) => v !== value));
      } else {
        this.$emit('input', null);
      }
      if (this.closeOnSelect) {
        this.hideOptionsSelect();
      }
    },
    clear() {
      if (this.multiple) {
        this.$emit('input', []);
      } else {
        this.$emit('input', null);
      }
      this.$emit('clear');
    },
    findOrCreateOptionWithValue(value) {
      const option = this.findOptionWithValue(value);
      if (option === undefined && value !== null && value !== undefined) {
        try {
          return this.createOptionFn(value.toString());
        } catch (err) {
          return option;
        }
      }
      return option;
    },
    normalizeOptions(options) {
      return options.map(this.normalizer);
    },
    handleKeyDown(evt) {
      if (this.open) {
        const { panel } = this.$refs;
        handleKeyDown(evt, panel, this.searchable);
      }
    },
  },
};
</script>

<style lang="scss">
@import '../scss/variables';

.vue-select {
  position: relative;

  &__container {
    box-sizing: border-box;
    width: 100%;
    min-width: 50px;
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
      min-width: 0;
      margin-right: $spacer / 2;
      &-value {
        display: inline-flex;
        align-items: center;
        margin-right: $spacer / 2;
        box-sizing: border-box;
        max-width: 100%;
        &-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-width: 0;
        }
        .vue-select__deselect {
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-actions {
      margin-left: auto;
      display: flex;
      align-items: center;
    }
  }

  &__panel {
    box-sizing: border-box;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    width: 100%;
    min-width: 100px;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: $background-color;
    box-shadow: $box-shadow;

    visibility: hidden;
    opacity: 0;
    z-index: -1;

    transition: all .1s ease-in-out;

    &-body {
      position: relative;
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
    .vue-select__container {
      border-color: $border-color-open;
    }
  }

  &.vue-select--open {
    .vue-select__container {
      border-color: $border-color-open;
    }
    .vue-select__panel {
      visibility: visible;
      opacity: 1;
      z-index: 2;
    }
  }

  &.vue-select--single:not(.vue-select--empty:not(.vue-select--open)) {
    .vue-select__container {
      &-values {
        position: relative;
        .vue-select__container-input {
          position: absolute;
          width: 100%;
          left: 0;
          right: 0;
        }
      }
    }
  }

  &.vue-select--multiple {
    .vue-select__container {
      &-values {
        &-value {
          border-radius: $border-radius;
          background-color: $background-color-active;
          padding: 0 $spacer / 2;
          .vue-select__deselect {
            margin-left: $spacer/2;
          }
        }
      }
      &-input {
        flex: 1;
      }
    }
  }

  &.vue-select--disabled {
    pointer-events: none;
    .vue-select__container {
      background-color: $background-color-disabled;
    }
  }

  &__arrow {
    border-color: darken($border-color, 20%);
    border-style: solid;
    border-width: 0 2px 2px 0;
    width: 5px;
    height: 5px;
    transform: rotate(45deg);
    margin: 0 0 3px 0;
    transition: .1s transform linear;
  }

  &__deselect {
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

  &--transparent {
    opacity: 0;
    width: 0;
    z-index: -1;
  }

  &__deselect-all {
    margin-left: auto;
    margin-right: $spacer / 2;
  }

  &__placeholder {
    opacity: .4;
  }
}
</style>
