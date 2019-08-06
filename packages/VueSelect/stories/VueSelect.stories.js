import { storiesOf } from '@storybook/vue';
import Basic from './Basic.vue';
import Groups from './Groups.vue';
import Normalizer from './Normalizer.vue';

storiesOf('VueSelect', module)
  .add('Basic', () => Basic)
  .add('Groups', () => Groups)
  .add('Normalizer', () => Normalizer);
