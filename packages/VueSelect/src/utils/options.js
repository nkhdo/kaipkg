import {
  KEY_CODES,
  isElement,
  addClass,
  removeClass,
  hasClass,
  findElIndex,
  triggerEvent,
  scrollIntoView,
} from './dom';

export const OPTION_CLASSES = {
  OPTION: 'vue-select__options-item',
  ACTIVE: 'vue-select__options-item--active',
  FOCUS: 'vue-select__options-item--focus',
  GROUP: 'vue-select__options-group',
};

export const labelFor = (option, labelKey = 'label') => {
  if (typeof option === 'object') {
    return option[labelKey];
  }
  return option;
};

export const valueFor = (option, valueKey = 'value') => {
  if (typeof option === 'object') {
    return option[valueKey];
  }
  return option;
};

export const findOptionWithValue = (options, value, valueKey = 'value') => options
  .find(option => valueFor(option, valueKey) === value);

// DOM
export const getAllOptions = container => container.querySelectorAll(`.${OPTION_CLASSES.OPTION}`);

export const getCurrentOption = container => container.querySelector(`.${OPTION_CLASSES.FOCUS}`)
    || container.querySelector(`.${OPTION_CLASSES.ACTIVE}`);

export const scrollToOption = (container, option) => {
  if (!isElement(option)) {
    return;
  }
  scrollIntoView(container.querySelector('.vue-select__panel-body'), option);
};

export const focusNextOption = (container) => {
  if (!isElement(container)) {
    return;
  }
  const allOptions = getAllOptions(container);
  const currentOption = getCurrentOption(container);
  let nextIdx = 0;
  if (currentOption) {
    const idx = findElIndex(allOptions, currentOption);
    nextIdx = idx + 1;
    if (nextIdx >= allOptions.length) {
      nextIdx = 0;
    }
    removeClass(currentOption, OPTION_CLASSES.FOCUS);
  }
  const nextOption = allOptions[nextIdx];
  addClass(nextOption, OPTION_CLASSES.FOCUS);
  scrollToOption(container, nextOption);
};

export const focusPreviousOption = (container) => {
  if (!isElement(container)) {
    return;
  }
  const allOptions = getAllOptions(container);
  const currentOption = getCurrentOption(container);
  let prevIdx = allOptions.length - 1;
  if (currentOption) {
    const idx = findElIndex(allOptions, currentOption);
    prevIdx = idx - 1;
    if (prevIdx < 0) {
      prevIdx = allOptions.length - 1;
    }
    removeClass(currentOption, OPTION_CLASSES.FOCUS);
  }
  const prevOption = allOptions[prevIdx];
  addClass(prevOption, OPTION_CLASSES.FOCUS);
  scrollToOption(container, prevOption);
};

export const clearFocus = (container) => {
  if (!isElement(container)) {
    return;
  }
  const currentOption = getCurrentOption(container);
  removeClass(currentOption, OPTION_CLASSES.FOCUS);
};

export const selectCurrentOption = (container) => {
  if (!isElement(container)) {
    return;
  }
  let currentOption = getCurrentOption(container);
  if (!currentOption) {
    [currentOption] = getAllOptions(container);
  }
  triggerEvent(currentOption, 'mousedown');
};

export const closeGroupIfPossible = (container) => {
  if (!isElement(container)) {
    return;
  }
  let currentOption = getCurrentOption(container);
  if (!currentOption) {
    [currentOption] = getAllOptions(container);
  }
  if (hasClass(currentOption, OPTION_CLASSES.GROUP) && currentOption.dataset.show) {
    triggerEvent(currentOption, 'mousedown');
  }
};

export const openGroupIfPossible = (container) => {
  if (!isElement(container)) {
    return;
  }
  let currentOption = getCurrentOption(container);
  if (!currentOption) {
    [currentOption] = getAllOptions(container);
  }
  if (hasClass(currentOption, OPTION_CLASSES.GROUP) && !currentOption.dataset.show) {
    triggerEvent(currentOption, 'mousedown');
  }
};

export const handleKeyDown = (evt, container, searchable = false) => {
  switch (evt.keyCode) {
    case KEY_CODES.DOWN:
      evt.preventDefault();
      focusNextOption(container);
      break;
    case KEY_CODES.UP:
      evt.preventDefault();
      focusPreviousOption(container);
      break;
    case KEY_CODES.ENTER:
      evt.preventDefault();
      selectCurrentOption(container);
      break;
    case KEY_CODES.LEFT:
      evt.preventDefault();
      closeGroupIfPossible(container);
      break;
    case KEY_CODES.RIGHT:
      evt.preventDefault();
      openGroupIfPossible(container);
      break;
    case KEY_CODES.TAB:
      break;
    default:
      if (!searchable) {
        evt.preventDefault();
        evt.stopPropagation();
      }
  }
};
