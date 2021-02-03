<template>
  <div class="col-md-6 mx-auto">
    <b-row>
      <div class="col-12">
        <l-v-search name="search" :collections="['items']" :onSelect="directToDetail"></l-v-search>
      </div>
    </b-row>
    <b-row>
      <b-table hover :items="itemList" :fields="fields">
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
      fields: ["name", "itemType"],
      keyword: "",
      startAt: 0,
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