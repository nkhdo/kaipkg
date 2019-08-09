import {
  KEY_CODES, OPTION_CLASSES, isElement, addClass, removeClass, findElIndex, triggerEvent,
} from './dom';

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

export const focusNextOption = (container) => {
  if (!isElement(container)) {
    return;
  }
  const allOptions = getAllOptions(container);
  const currentOption = getCurrentOption(container);
  if (!currentOption) {
    addClass(allOptions[0], OPTION_CLASSES.FOCUS);
  } else {
    removeClass(currentOption, OPTION_CLASSES.FOCUS);
    const idx = findElIndex(allOptions, currentOption);
    let nextIdx = idx + 1;
    if (nextIdx >= allOptions.length) {
      nextIdx = 0;
    }
    addClass(allOptions[nextIdx], OPTION_CLASSES.FOCUS);
  }
};

export const focusPreviousOption = (container) => {
  if (!isElement(container)) {
    return;
  }
  const allOptions = getAllOptions(container);
  const currentOption = getCurrentOption(container);
  if (!currentOption) {
    addClass(allOptions[0], OPTION_CLASSES.FOCUS);
  } else {
    removeClass(currentOption, OPTION_CLASSES.FOCUS);
    const idx = findElIndex(allOptions, currentOption);
    let prevIdx = idx - 1;
    if (prevIdx < 0) {
      prevIdx = allOptions.length - 1;
    }
    addClass(allOptions[prevIdx], OPTION_CLASSES.FOCUS);
  }
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
    case KEY_CODES.TAB:
      break;
    default:
      if (!searchable) {
        evt.preventDefault();
        evt.stopPropagation();
      }
  }
};
