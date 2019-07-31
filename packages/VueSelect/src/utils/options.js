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
