import { storiesOf } from '@storybook/vue';
import VueForm from '../src/components/VueForm.vue';

storiesOf('VueForm', module).add('Normal usage', () => ({
  components: { VueForm },
  template:
    `
      <vue-form
        :message="message"
      />
    `,
  data: () => ({
    message: 'Hello world!',
  }),
}));
