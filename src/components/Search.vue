<template>
  <div>
    <v-select
      :value="keyword"
      @input="clickOption"
      :options="options"
      label="name"
      :filter="pinyinFilter"
      ref="searchbar"
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
directives: { focus: { inserted: function (el) { el.focus() } } } ,
  data() {
    return {
      keyword: "",
      error: false,
    };
  },

  methods: {
    clickOption(value) {
      this.onSelectOption(value);     
      setTimeout(() => {
        this.$refs.searchbar.$refs.search.focus();   
      }, 100);
      
    },

    pinyinFilter(array, keyword) {
      return array.filter((value) => {
        if (!value) {
          return false;
        }

        var py
        if (typeof value === "string") {
          // value contains keyword check chinese against chinese
          if (value.includes(keyword)) {
            return true;
          }

          // value contains keyword check pinyin
          py = pinyin
            .parse(value)
            .map((x) => x.target)
            .join("")
            .toLowerCase();
          if (py.includes(keyword.toLowerCase())) {
            return true;
          }
        }

        if (!value.name) {
          return false;
        }
        if(typeof value.name != 'string'){
          return false
        }

        //check against orignal chinese
        if (value.name.includes(keyword)) {
          return true;
        }


        //check pinyin
        py = pinyin
          .parse(value.name)
          .map((x) => x.target)
          .join("")
          .toLowerCase();
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