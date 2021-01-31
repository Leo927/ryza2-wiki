<template>
  <div class="col-md-6 mx-auto">
    <b-form-input
      class="mb-3"
      type="text"
      placeholder="搜索"
      v-model = "keyword"
      :keyup:enter="search"
    ></b-form-input>
    <b-table hover :items="items" :fields="fields">
      <template #cell(name)="data">
          <router-link :to="`/${data.item.type}/${data.item['.key']}`">{{data.item.name}}</router-link>
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
      items: db.collection("item").orderBy('name')
    };
  },
  data() {
    return {
      fields: ["name", "itemType"],
      items: [],
      keyword:""
    };
  },
  methods: {
    search() {},
  },
};
</script>