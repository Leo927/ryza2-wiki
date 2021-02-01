<template>
  <div>
    <b-form-input
      list="my-list-id"
      v-model="keyword"
      placeholder="搜索"
      class="border-5"
      :class="{'border-danger':error}"
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
      error: false
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
        this.error=true;
        return;
      }
      this.error=false;
      this.onEnter(data[0]);
      this.keyword ="";
    },
  },
};
</script>