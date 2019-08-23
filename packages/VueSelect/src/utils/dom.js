export const KEY_CODES = {
  TAB: 9,
  ENTER: 13,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
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

export const hasClass = (el, className) => {
  if (isElement(el)) {
    return el.classList.contains(className);
  }
  return false;
};

export const findElIndex = (elements, el) => {
  for (let i = 0; i < elements.length; i += 1) {
    if (elements[i] === el) {
      return i;
    }
  }
  return -1;
};

// from react-select
export const scrollIntoView = (container, el) => {
  const scrollingRect = container.getBoundingClientRect();
  const focusedRect = el.getBoundingClientRect();
  const overScroll = el.offsetHeight / 3;

  if (focusedRect.bottom + overScroll > scrollingRect.bottom) {
    const proposedScrollTop = el.offsetTop + el.clientHeight - container.offsetHeight + overScroll;
    const containerScrollHeight = container.scrollHeight;
    // eslint-disable-next-line no-param-reassign
    container.scrollTop = Math.min(proposedScrollTop, containerScrollHeight);
  } else if (focusedRect.top - overScroll < scrollingRect.top) {
    // eslint-disable-next-line no-param-reassign
    container.scrollTop = Math.max(el.offsetTop - overScroll, 0);
  }
};
