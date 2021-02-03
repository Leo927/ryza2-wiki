<template>
  <div class="col-md-6 mx-auto">
    <b-row>
      <div class="col-12">
        <l-v-search name="search" :collections="['items']" :onSelect="directToDetail"></l-v-search>
      </div>
    </b-row>
    <b-row>
      <b-pagination v-model="currentPage" :total-rows="itemList.length" :per-page="10" aria-controls="item-table" class="mx-auto"></b-pagination>
      <b-table id="item-table" hover :items="itemList" :fields="fields" per-page="10" :current-page="currentPage">
        <template #cell(name)="data">
          <router-link :to="`/${data.item.type}/${data.item.id}`">{{
            data.item.name
          }}</router-link>
        </template>
      </b-table>
      
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
      keyword: "",

      currentPage: 1,

      fields: [
          {
            key: 'name',
            sortable: true
          },
          {
            key: 'itemType',
            sortable: true
          }
        ],
    };
  },

  components: {
  },

  computed: {
    ...mapState(["itemTypes", "items"]),

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
    directToDetail(source) {
      this.$router.push(`/${source.type}/${source.id}`);
    },
  },
};
</script>