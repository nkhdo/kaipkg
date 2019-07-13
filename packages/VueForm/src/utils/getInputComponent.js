import TextInput from '../components/input/TextInput.vue';
import NumberInput from '../components/input/NumberInput.vue';

const getInputComponent = (schema) => {
  if (schema.component) {
    return schema.component;
  }
  const inputType = schema.type;
  if (inputType === Number) {
    return NumberInput;
  }
  return TextInput;
};

export default getInputComponent;
