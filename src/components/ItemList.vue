<template>
  <div class="col-md-6 mx-auto">
    <b-row>
    <b-table hover :items="itemList" :fields="fields">
      <template #cell(name)="data">
        <router-link :to="`/${data.item.type}/${data.item.id}`">{{
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
import { mapState } from "vuex";
const dataLimit = 10;
//import { mapState } from 'vuex';
export default {
  data() {
    return {
      fields: ["name", "itemType"],
      keyword: "",
      startAt: 0,
    };
  },

  computed: {
    ...mapState(["itemTypes", 'items']),

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

  },

  created(){
    this.initialize();
  }
};
</script>