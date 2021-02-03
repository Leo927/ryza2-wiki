<template>
  <div class="col-md-6 mx-auto">
    <b-row>
      <router-link
        class="btn btn-outline-primary mx-auto col-md"
        v-if="editMode"
        to="/map/"
        >创建新地图</router-link
      >
      <b-table hover :items="maps" :fields="fields">
      <template #cell(name)="data">
        <router-link :to="`/${data.item.type}/${data.item['.key']}`">{{
          data.item.name
        }}</router-link>
      </template>
    </b-table>
    </b-row>
    

    
  </div>
</template>

<script>
import { db } from "@/main";
import { mapState } from "vuex";

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

  computed: {
    ...mapState(["editMode"]),
  },

  methods: {
    search() {},
  },
};
</script>