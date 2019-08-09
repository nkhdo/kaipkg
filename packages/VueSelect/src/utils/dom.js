export const KEY_CODES = {
  TAB: 9,
  ENTER: 13,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

export const OPTION_CLASSES = {
  OPTION: 'vue-select__options-item',
  ACTIVE: 'vue-select__options-item--active',
  FOCUS: 'vue-select__options-item--focus',
};

export const isElement = el => el && el.nodeType === Node.ELEMENT_NODE;

export const triggerEvent = (el, type) => {
  if (!isElement(el)) {
    return;
  }
  if ('createEvent' in document) {
    // modern browsers, IE9+
    const e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
  } else {
    // IE 8
    const e = document.createEventObject();
    e.eventType = type;
    el.fireEvent(`on${e.eventType}`, e);
  }
};

export const addClass = (el, className) => {
  if (isElement(el)) {
    el.classList.add(className);
  }
};

export const removeClass = (el, className) => {
  if (isElement(el)) {
    el.classList.remove(className);
  }
};

export const findElIndex = (elements, el) => {
  for (let i = 0; i < elements.length; i += 1) {
    if (elements[i] === el) {
      return i;
    }
  }
  return -1;
};
