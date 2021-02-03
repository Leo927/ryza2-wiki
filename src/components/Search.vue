<template>
  <div>
    <v-select
      :value="keyword"
      @input="clickOption"
      :options="options"
      label="name"
      :filter="pinyinFilter"
    >
    </v-select>
  </div>
</template>

<script>
const pinyin = require("tiny-pinyin");
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

    pinyinFilter(array, keyword) {
      return array.filter((value) => {
        if (!value || !value.name) {
          return false;
        }
        var py = pinyin
          .parse(value.name)
          .map((x) => x.target)
          .join("").toLowerCase();
        var isIncluded = py.includes(keyword.toLowerCase());
        return isIncluded;
      });
    },
  },

  computed: {
    options() {
      return this.collections.map((x) => this.$store.state[x]).flat(3);
    },
  },
};
</script>