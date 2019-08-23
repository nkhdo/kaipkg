<template>
  <div id="groups">
    <vue-select
      v-model="country"
      :options="options"
      grouped
      :clearable="clearable"
      :searchable="searchable"
      :creatable="creatable"
      :group-collapsible="collapsible"
      :disabled="disabled"
    >
      <template v-slot:panel-header>
        Panel header slot
      </template>
      <template v-slot:panel-footer>
        Panel footer slot
      </template>
    </vue-select>
    <div>
      Country: {{ country }}
    </div>
    <div class="options">
      <div>
        <input
          id="searchable-checkbox"
          v-model="searchable"
          type="checkbox"
        >
        <label for="searchable-checkbox">searchable</label>
      </div>
      <div>
        <input
          id="clearable-checkbox"
          v-model="clearable"
          type="checkbox"
        >
        <label for="clearable-checkbox">clearable</label>
      </div>
      <div>
        <input
          id="creatable-checkbox"
          v-model="creatable"
          type="checkbox"
        >
        <label for="creatable-checkbox">creatable</label>
      </div>
      <div>
        <input
          id="collapsible-checkbox"
          v-model="collapsible"
          type="checkbox"
        >
        <label for="collapsible-checkbox">group collapsible</label>
      </div>
      <div>
        <input
          id="disabled-checkbox"
          v-model="disabled"
          type="checkbox"
        >
        <label for="disabled-checkbox">disabled</label>
      </div>
    </div>
  </div>
</template>

<script>
import VueSelect from '../src/components/VueSelect.vue';

export default {
  name: 'GroupsStory',
  components: {
    VueSelect,
  },
  data() {
    return {
      country: null,
      options: [
        {
          group: 'Asea',
          initiallyExpanded: true,
          options: [
            {
              label: 'Vietnam',
              value: 'vietnam',
            },
            {
              label: 'Singapore',
              value: 'singapore',
            },
          ],
        },
        {
          group: 'Euro',
          options: [
            {
              label: 'France',
              value: 'france',
            },
            {
              label: 'England',
              value: 'england',
            },
          ],
        },
      ],
      searchable: true,
      clearable: true,
      creatable: false,
      collapsible: true,
      disabled: false,
    };
  },
};
</script>

<style>

</style>
