<template>
  <div class="col-md-6 mx-auto">
    <b-input
      class="mb-3"
      type="text"
      placeholder="搜索"
      v-model="keyword"
      :keyup:enter="search"
    ></b-input>

    <b-table hover :items="maps" :fields="fields">
      <template #cell(name)="data">
        <router-link :to="`/${data.item.type}/${data.item['.key']}`">{{
          data.item.name
        }}</router-link>
      </template>
    </b-table>
  </div>
</template>

<script>
import { db } from "@/main";

//import { mapState } from 'vuex';
export default {
  firestore() {
    return {
      maps: db.collection("map").orderBy("name"),
    };
  },
  data() {
    return {
      fields: ["name"],
      maps: [],
      keyword: "",
    };
  },
  methods: {
    search() {},
  },
};
</script>