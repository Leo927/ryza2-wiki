<template>
  <b-container>
    <div v-if="isAdmin">
      <h1>后台管理</h1>
      <hr />
      <h5>重新计算目录</h5>
      <b-row>
        <b-button class="col-sm-3" @click="reIndexItems">物品</b-button>
        <b-button class="col-sm-3" @click="reIndexMaps">地图</b-button>
      </b-row>

      <hr />
      <h5>物品属性</h5>
      <b-row class="mb-3">
        <b-input v-model="attribute" class="col-sm"></b-input>
        <b-button class="col-sm" @click="addAttribute"
          >添加</b-button
        >
      </b-row>
      <b-row>
        <div class="card col-md-2" v-for="attr in attributes" :key="attr">
          <div class="card-body">
            <h5 class="card-title text-center">{{ attr }}</h5>
            <b-button class="col-md" @click="removeAttribute(attr)"
              >删除</b-button
            >
          </div>
        </div>
      </b-row>
      <hr />

    </div>
  </b-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {reIndexItems} from '@/dbAccess/item'
import { addAttribute, removeAttribute } from "@/dbAccess/config";
import {reIndexMaps} from '@/dbAccess/map'

export default {
  data() {
    return {
      attribute: "",
    };
  },

  computed: {
    ...mapGetters(["isAdmin"]),

    ...mapState(["attributes"]),
  },

  created() {
    if (!this.isAdmin) {
      this.$router.push("/");
    }
  },

  methods: {

    addAttribute(){
      if(this.attribute.length <=0){
        return
      }
      addAttribute(this.attribute);
      this.attribute = ""
    },

    reIndexItems,


    removeAttribute,
    reIndexMaps,
  },
};
</script>