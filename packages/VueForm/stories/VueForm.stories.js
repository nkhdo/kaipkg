import { storiesOf } from '@storybook/vue';
import Basic from './Basic.vue';
import NoSubmitButton from './NoSubmitButton.vue';

storiesOf('VueForm', module)
  .add('Basic', () => Basic)
  .add('No submit button', () => NoSubmitButton);
