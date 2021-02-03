<template>
  <div class="col-md-6 mx-auto">
    <b-row>
    <b-table hover :items="itemList" :fields="fields">
      <template #cell(name)="data">
        <router-link :to="`/${data.item.type}/${data.item['.key']}`">{{
          data.item.name
        }}</router-link>
      </template>
    </b-table>
    </b-row>

<b-row>
    <b-button class="col-md col-12" @click="getPreviousPage" variant="outline-info">
      <i class="fas fa-arrow-left"></i>
    </b-button>
    <b-button class="col-md col-12" @click="getNextPage" variant="outline-info">
      <i class="fas fa-arrow-right"></i>
    </b-button>
    </b-row>
  </div>
</template>

<script>
import { db } from "@/main";
import { mapState } from "vuex";
const dataLimit = 10;
//import { mapState } from 'vuex';
export default {
  data() {
    return {
      fields: ["name", "itemType"],
      items: [],
      keyword: "",
      startAt: 0,
    };
  },

  computed: {
    ...mapState(["itemTypes"]),

    itemList() {
      return this.items.map((x) => {
        return { ...x, itemType: this.itemTypes[x.itemTypeIndex] };
      });
    },

    endAt() {
      return this.startAt + dataLimit;
    },
  },

  methods: {
    search() {},

    initialize() {
      this.getNextPage()
    },

    getNextPage() {
      
      var ref = db.collection("item").orderBy("name").limit(dataLimit).startAfter(this.startAt);
      ref.get().then((documentSnapshots) => {
        if(documentSnapshots.docs.length ==0){
          return;
        }
        this.startAt =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];
          this.items = documentSnapshots.docs.map(x=>x.data())
      });
    },

    getPreviousPage(){
      var ref = db.collection("item").orderBy("name").limit(dataLimit).endAt(this.startAt);
      ref.get().then((documentSnapshots) => {
        this.startAt =
          documentSnapshots.docs[0];
          this.items = documentSnapshots.docs.map(x=>x.data())
        this.startAt = this.startAt <0?0:this.startAt;
      });
    }
  },

  created(){
    this.initialize();
  }
};
</script>