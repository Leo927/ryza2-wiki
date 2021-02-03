<template>
  <b-container>
    <!-- resource point editor modal -->
    <b-modal id="modal-create" size="lg" title="资源点编辑" v-if="editMode" no-close-on-backdrop>
      <ResoucePointDetail
        name="create"
        :onSubmit="onSubmitResourcePoint"
        :onCancel="onCancelResourcePoint"
      ></ResoucePointDetail>
      <template v-slot:modal-footer>
        <span></span>
      </template>
    </b-modal>

    <b-row>
      <b-col>
        <!-- update hint -->
        <div
          class="text-success text-center"
          :style="{ visibility: lastItem ? 'visible' : 'hidden' }"
        >
          {{ lastItem }} {{ result }}成功
        </div>

        <b-row>
          <!-- 地图 -->
          <div class="col-md square">
            <MapDrawer :map="item" :clickHandler="mapClickHandler"></MapDrawer>
          </div>
          <div class="col-md">
            <!-- ID -->
            <b-form-group
              id="input-group-0"
              label="ID:"
              label-for="input-0"
              v-if="editMode && !createMode"
            >
              <b-form-input
                id="input-0"
                v-model="item.id"
                type="text"
                placeholder="无"
                disabled
              ></b-form-input>
            </b-form-group>

            <b-row>
              <!-- 名称 -->
              <b-form-group
                id="input-group-1"
                label="名称:"
                label-for="input-1"
                class="col-md"
              >
                <b-form-input
                  id="input-1"
                  v-model="item.name"
                  type="text"
                  placeholder="输入名称"
                  :disabled="!editMode"
                  required
                ></b-form-input>
              </b-form-group>

              <!-- 地点选择 -->
              <b-form-group
                id="input-group-3"
                label="属于:"
                label-for="input-3"
                class="col-md"
              >
               <l-v-search :collections="['locations']" :onSelectOption="(value)=>{item.location=value}"></l-v-search>
              </b-form-group>
            </b-row>

            <!-- 上传图片 -->
            <b-form-group
              v-if="editMode"
              id="file-group-1"
              label="上传图片"
              label-for="file-1"
            >
              <b-form-file
                id="file-1"
                v-model="photoFile"
                :state="Boolean(photoFile)"
                placeholder="选择一个文件或者拖到此处"
                drop-placeholder="拖到此处"
                :disabled="!editMode"
              ></b-form-file>
            </b-form-group>

<b-container>
            <b-row class="mb-2">
              <!-- 添加资源点 -->
              <b-button
                variant="outline-primary"
                class="col-md"
                v-b-modal.modal-create
                v-if="editMode"
                >添加资源点</b-button
              >
              <!-- 删除资源坐标 -->
              <b-button
                variant="outline-danger"
                class="col-md"
                @click="selectedIndex = null"
                v-if="editMode"
                >删除资源坐标</b-button
              >
            </b-row>
            </b-container>

            <!-- 资源显示 -->
            <div
              v-for="(res, resPointIndex) in item.resourcePoints"
              :key="resPointIndex"
            >
              <ResourcePointCard
                :resourcePoint="item.resourcePoints[resPointIndex]"
                :color="'yellow'"
                :resPointIndex="resPointIndex"
                :resourcePointArray="item.resourcePoints"
                :onSelectRP="onSelectRP"
                :selectedIndex="selectedIndex"
              ></ResourcePointCard>
            </div>
          </div>
        </b-row>

        <!-- 按钮 -->
        <b-container>
        <b-row class="mt-3">
          <b-button
            v-if="editMode"
            class="col-md"
            @click="onSubmit"
            variant="outline-primary"
            >提交</b-button
          >
          <b-button
            v-if="createMode"
            class="col-md"
            @click="reset"
            variant="outline-danger"
            >清空</b-button
          >
          <b-button
            v-if="editMode && !createMode"
            col
            class="col-md"
            @click="onDelete"
            variant="outline-danger"
            >删除</b-button
          >
        </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>


<script>
import { mapState } from "vuex";
import { emptyMap } from "@/models/map";
import { mapActions } from "vuex";
import ResoucePointDetail from "@/components/ResourcePointDetail";
import ResourcePointCard from "@/components/ResourcePointCard";
import MapDrawer from "@/components/MapDrawer";
import { getMap, createMap, updateMap, deleteMap } from "@/dbAccess/map";

export default {
  data() {
    return {
      item: emptyMap(),
      original: emptyMap(),
      result: "",
      lastItem: null,
      photoFile: null,
      resourceIndex: null,
      selectedIndex: null,
    };
  },
  components: {
    ResoucePointDetail,
    ResourcePointCard,
    MapDrawer,
  },

  computed: {
    createMode() {
      return this.$route.params.id == null && this.editMode;
    },
    ...mapState(["editMode", "locations"]),

    id(){
      return this.$route.params.id;
    }
  },

  watch: {
    "$route.path": function () {
      this.initialize();
    },
  },

  methods: {
    ...mapActions(["searchAll"]),

    async onSubmit() {
      if (!this.editMode) {
        throw "User submitting while not in edit mode";
      }
      if (this.createMode) {
        await createMap(this.item, this.photoFile);
        setTimeout(() => {
          this.$router.push(`/${this.item.type}/${this.item.id}`);
        }, 1000);
      } else if (this.editMode) {
        await updateMap(this.item, this.original, this.photoFile);
        this.result = "修改";
        this.lastItem = this.item.name;
      }
    },

    reset() {
      this.item = emptyMap();
      this.photoFile = null;
    },

    async onDelete() {
      await deleteMap(this.item);
      this.lastItem = this.item.name;
      this.$router.push("/maps");
    },

    async initialize() {
      if (this.id) {
        const response = await getMap(this.id);
        this.item = response.data()
        this.original = JSON.parse(JSON.stringify(this.item));
      }
    },

    onSubmitResourcePoint(newPickable) {
      this.item.resourcePoints.push(newPickable);
      this.$bvModal.hide("modal-create");
    },

    onCancelResourcePoint() {
      this.$bvModal.hide("modal-create");
    },

    deleteResPoint(resPointIndex) {
      this.item.resourcePoints.splice(resPointIndex, 1);
    },

    onSelectRP(index) {
      if (index == this.selectedIndex) {
        this.selectedIndex = null;
      } else {
        this.selectedIndex = index;
      }
    },

    getAllResources(item) {
      return item.resourcePoints
        .flat(3)
        .map((x) => x.pickables)
        .flat(3)
        .map((x) => x.resources)
        .flat(3);
    },

    mapClickHandler(percentPos) {
      if (!this.editMode) {
        return;
      }
      if (this.selectedIndex == null) {
        return;
      }
      this.item.resourcePoints[this.selectedIndex].pos.push(percentPos);
    },

    print() {
      console.log(this.item.resourcePoints);
    },
  },

  created() {
    this.initialize();
  },

  beforeRouteUpdate() {
    this.initialize();
  },
};
</script>