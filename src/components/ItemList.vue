<template>
  <div class="col-md-6 mx-auto">
    <b-row>
      <b-pagination
        v-model="currentPage"
        :total-rows="itemList.length"
        :per-page="10"
        aria-controls="item-table"
        class="mx-auto"
      ></b-pagination>
    </b-row>
    <b-row>
      <b-form-group id="input-group-3" class="col-md" label="类型" label-for="input-3">
        <b-form-select
          id="input-3"
          v-model="filterItemType"
          :options="itemTypes"
          required
        ></b-form-select>
      </b-form-group>
      <b-form-group id="input-group-3" class="col-md" label="五行" label-for="input-3">
        <b-form-select
          id="input-3"
          v-model="filterElement"
          :options="elements"
          required
        ></b-form-select>
      </b-form-group>
      
      <b-form-group id="input-group-3" class="col-md" label="属性:" label-for="input-3">
        <b-form-select
          id="input-3"
          v-model="filterAttribute"
          :options="attributes"
          required
        ></b-form-select>
      </b-form-group>
    </b-row>
    <b-row>
      <b-table
        id="item-table"
        hover
        :items="itemList"
        :fields="fields"
        sort-by="name"
        per-page="10"
        :current-page="currentPage"
      >
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

      filterElement: null,

      filterAttribute: null,

      filterItemType:null, 

      currentPage: 1,

      fields: [
        {
          key: "name",
          sortable: true,
        },
        {
          key: "itemType",
          sortable: true,
        },
      ],
    };
  },

  components: {},

  computed: {
    ...mapState(["itemTypes", "items", "attributes", "elements"]),

    itemList() {
      var filteredList = this.items.map((x) => {
        return { ...x, itemType: this.itemTypes[x.itemTypeIndex] };
      });

      if( this.filterElement){
        filteredList = filteredList.filter((x) => {
            return x.elementIndexes.includes(
              this.elements.findIndex((x) => x == this.filterElement)
            );
          })
      }

      if (this.filterAttribute) {
        filteredList = filteredList.filter((x) => {
            return x.attributes.includes(this.filterAttribute);
          });
      } 
      
      if (this.filterItemType){
        filteredList = filteredList.filter((x) => {
            return x.itemType == this.filterItemType;
          });
      }
      
      return filteredList
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