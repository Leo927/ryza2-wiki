<template>
  <div>
    <v-select
      :value="keyword"
      @input="clickOption"
      :options="options"
      label="name"
    >
    </v-select>
  </div>
</template>

<script>
import router from "../router";

export default {
  props: {
    collections: Array,
    onSelectOption: {
      type: Function,
      default: (value) => {
        router.push(`/${value.type}/${value.id}`);
      },
    },
  },

  data() {
    return {
      keyword: "",
      error: false,
    };
  },

  methods: {
    clickOption(value) {
      this.onSelectOption(value);
    },
  },

  computed: {
    options() {
      return this.collections.map((x) => this.$store.state[x]).flat(3)
    },
  },
};
</script>