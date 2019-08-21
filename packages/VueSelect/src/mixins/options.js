import { valueFor, labelFor, findOptionWithValue } from '../utils/options';

export default {
  methods: {
    valueFor(option) {
      return valueFor(option, this.valueKey);
    },
    labelFor(option) {
      return labelFor(option, this.labelKey);
    },
    findOptionWithValue(value) {
      return findOptionWithValue(this.allOptions, value, this.valueKey);
    },
  },
};
