<script>
import getInputComponent from '../utils/getInputComponent';
import getInputId from '../utils/getInputId';
import getInputLabel from '../utils/getInputLabel';

export default {
  functional: true,
  props: {
    value: {
      type: [String, Number, Array, Object, Date],
      required: true,
    },
    schema: {
      type: Object,
      required: true,
    },
  },
  inject: ['formId'],
  render(createElement, { props, listeners, injections }) {
    const { schema } = props;
    const { formId } = injections;
    const component = getInputComponent(schema);
    const id = getInputId(schema, formId);
    const label = getInputLabel(schema);
    return createElement('div', {
      class: 'kaipkg-input',
    }, [
      createElement('label', {
        class: 'kaipkg-input-label',
        attrs: {
          for: id,
        },
      }, label),
      createElement(component, {
        class: 'kaipkg-input-el',
        attrs: {
          id,
        },
        props,
        on: listeners,
      }),
    ]);
  },
};
</script>
