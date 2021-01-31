<template>
  <div>
    <b-form-input
      list="my-list-id"
      v-model="keyword"
      placeholder="搜索"
      v-on:keyup.enter="onSearch()"
    ></b-form-input>
  </div>
</template>

<script>
import { mapActions } from "vuex";


export default {
  props: {
    collections: Array,
    onEnter: Function,
  },

  data() {
    return {
      keyword: "",
      options: [],
    };
  },

  methods: {
    ...mapActions(["search"]),
    async onSearch() {
      const data = await this.search({
        keyword: this.keyword,
        collections: this.collections,
      });
      this.options = data;
      if (data.length == 0) {
        return;
      }
      this.onEnter(data[0]);
    },
  },
};
</script>