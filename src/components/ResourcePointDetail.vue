<template>
  <div class="container">
    <b-button @click="print">DEBUG</b-button>

    <!-- 颜色 -->
    <b-row>
      <b-button class="col-md-6" @click="randomizeColor">随机颜色</b-button>
      <i class="fas fa-circle my-auto col-md-6" :style="{'color':resourcePoint.color}"></i>
    </b-row>



    <!-- 列表 -->
    <div
      v-for="(pick, pickIndex) in resourcePoint.pickables"
      :key="pickIndex"
      class="my-2"
    >
      <!-- 工具 -->
      <b-row>
        <b-form-group label="工具" v-slot="{ ariaDescribedby }" class="mx-auto">
          <b-form-radio-group
            id="btn-radios-1"
            v-model="resourcePoint.pickables[pickIndex].tool"
            :options="toolTypes"
            :aria-describedby="ariaDescribedby"
            name="radios-btn-default"
            buttons
          ></b-form-radio-group>
        </b-form-group>
      </b-row>

      <!-- 资源 -->
      <b-row>
        <!-- 搜索 -->
        <b-col md>
          <Search
            :collections="['item']"
            :onEnter="
              (data) => {
                resourcePoint.pickables[pickIndex].resources.push(data);
              }
            "
          ></Search>
        </b-col>

        <!-- 资源列表 -->
        <b-col md v-for="j in [0, 1, 2]" :key="j">
          <div
            class="input-group mb-3"
            v-if="resourcePoint.pickables[pickIndex].resources[j]"
          >
            <input
              v-model="resourcePoint.pickables[pickIndex].resources[j].name"
              type="text"
              class="form-control"
              placeholder="资源名称"
              aria-label="资源名称"
              aria-describedby="button-addon2"
              disabled
            />

            <!-- 删除按钮 -->
            <button
              class="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
              @click="deleteResource(pickIndex, j)"
            >
              删除
            </button>
          </div>
        </b-col>
        <!-- 移除整行 -->
        <b-button class="col-md-1" @click="deletePickable(pickIndex)">
          <i class="fas fa-minus"></i>
        </b-button>
      </b-row>
    </div>


    <b-row>
      <!-- 添加新项目 -->
      <b-button class="col-md" variant="info" @click="addPickable"
        ><i class="fas fa-plus"></i
      ></b-button>
      <slot name="footbar">
        <b-button
          class="col-md"
          variant="primary"
          @click.stop.prevent="onSubmit(resourcePoint)"
        >
          确定
        </b-button>
        <b-button variant="danger" class="col-md" @click.stop.prevent="onCancel(resourcePoint)">
          取消
        </b-button>
      </slot>
    </b-row>
  </div>
</template>

<script>
import { emptyResoucePoint } from "@/models/resourcePoint";
import { emptyPickable } from "@/models/pickable";
import { mapState } from "vuex";
import Search from "@/components/Search";

export default {
  props: {
    onSubmit: Function,
    onCancel: Function,
    resourcePointArray: Array,
    index: Number,
  },

  components: {
    Search,
  },

  computed: {
    ...mapState(["toolTypes", "editMode"]),

    createMode() {
      return this.index == undefined;
    },
  },

  data() {
    return {
      resourcePoint: emptyResoucePoint(),
    };
  },

  methods: {
    addPickable() {
      this.resourcePoint.pickables.push(emptyPickable());
    },

    deleteResource(pickableIndex, resourceIndex) {
      this.resourcePoint.pickables[pickableIndex].resources.splice(
        resourceIndex,
        1
      );
    },

    print() {
      console.log(this.resourcePoint);
    },

    randomizeColor(){
      this.resourcePoint.color = `#${Math.floor(Math.random()*16777215).toString(16)}`;      
    },

    deletePickable(pickableIndex){
      this.resourcePointArray[this.index].pickables.splice(pickableIndex, 1);
    }
  },

  created() {
    randomizeColor();
    if (!this.createMode) {
      this.resourcePoint = this.resourcePointArray[this.index];
    }
  }
};
</script>