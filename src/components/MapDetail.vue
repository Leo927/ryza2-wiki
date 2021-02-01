<template>
  <b-container>
    <b-button @click.stop="print">DEBUG</b-button>
    <!-- resource point editor modal -->
    <b-modal id="modal-create" size="lg" title="资源点编辑" v-if="editMode">
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
          <img
            class="col-md-6"
            :src="
              item.photoUrl ? item.photoUrl : 'https://via.placeholder.com/150'
            "
            alt=""
            style="height: 100%"
          />
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

            <!-- 名称 -->
            <b-form-group id="input-group-1" label="名称:" label-for="input-1">
              <b-form-input
                id="input-1"
                v-model="item.name"
                type="text"
                placeholder="输入名称"
                :disabled="!editMode"
                required
              ></b-form-input>
            </b-form-group>

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

            
            <b-row class="mb-2">
              <!-- 添加资源点 -->
            <b-button variant="primary" class="col-md" v-b-modal.modal-create v-if="editMode"
              >添加资源点</b-button
            >
              <!-- 删除资源坐标 -->
              <b-button variant="danger" class="col-md" @click="selectedIndex=null" v-if="editMode"
              >删除资源坐标</b-button
            >
            
            </b-row>

            <!-- 资源显示 -->
            <div
              v-for="(res, resPointIndex) in item.resourcePoints"
              :key="resPointIndex"
            >
              <ResourcePointCard
                :resourcePoint="item.resourcePoints[resPointIndex]"
                :color="'yellow'"       
                :resPointIndex="resPointIndex"
                :resourcePointArray = "item.resourcePoints"  
                :onSelectRP = "onSelectRP"
                :selectedIndex = "selectedIndex"
              ></ResourcePointCard>
            </div>
          </div>
        </b-row>

        <!-- 按钮 -->
        <b-row class="mt-3">
          <b-button
            v-if="editMode"
            class="col-md"
            @click="onSubmit"
            variant="primary"
            >提交</b-button
          >
          <b-button
            v-if="createMode"
            class="col-md"
            @click="reset"
            variant="danger"
            >清空</b-button
          >
          <b-button
            v-if="editMode && !createMode"
            col
            class="col-md"
            @click="onDelete"
            variant="danger"
            >删除</b-button
          >
        </b-row>
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
import { getDeviation } from '@/businesslogic/findDifference.js'

export default {
  data() {
    return {
      item: emptyMap(),
      original: emptyMap(),
      result: "",
      lastItem: null,
      photoFile: null,
      resourceIndex: null,
      selectedIndex:null
    };
  },
  components: {
    ResoucePointDetail,
    ResourcePointCard,
  },
  computed: {
    createMode() {
      return this.$route.params.id == null && this.editMode;
    },
    ...mapState(["editMode"]),
  },

  watch: {
    "$route.path": function () {
      this.initialize();
    },
  },

  methods: {
    ...mapActions([
      "addItem",
      "getItem",
      "updateItem",
      "deleteItem",
      "searchAll",
      "updateSource",
      "uploadImage",
    ]),

    localUpdateSource(){
      this.updateSource({
          deviation:getDeviation(this.getAllResources(this.item), this.getAllResources(this.original)),
          source:this.item
      });
    },

    async onSubmit() {
      if (this.photoFile != null) {
        this.uploadImage({
          type: this.item.type,
          id: this.item.id,
          file: this.photoFile,
          callback: (response) => {
            response.ref.getDownloadURL().then((url) => {
              this.item.photoUrl = url;
              if (this.createMode) {
                this.handleCreate();
              } else {
                this.handleUpdate();
              }
            });
          },
        });
      } else {
        if (this.createMode) {
          this.handleCreate();
        } else {
          this.handleUpdate();
        }
      }
    },

    handleCreate() {
      this.addItem(this.item).then(() => {
        this.lastItem = this.item.name;
        this.result = "创建";
        this.reset();
        this.uploadImage({
          type: this.item.type,
          id: this.item.id,
          file: this.photoFile,
          callback: () => {
          },
        });
        this.localUpdateSource()
      });
    },

    handleUpdate() {
      this.updateItem(this.item).then(() => {
        this.lastItem = this.item.name;
        this.result = "修改";
        this.localUpdateSource();
      });
    },

    reset() {
      this.item = emptyMap();
      this.photoFile = null;
    },

    onDelete() {
      this.deleteItem(this.$route.params.id).then(() => {
        this.lastItem = this.item.name;
        this.item = emptyMap();
        this.result = "删除";
        this.$router.push("/items");
        this.localUpdateSource()
      });
    },

    addSources(source) {
      source = {
        id: source.id,
        type: source.type,
        name: source.name,
      };
      this.item.sources.push(source);
    },

    deleteSource(index) {
      this.item.sources.splice(index, 1);
    },

    addDevelop(develop) {
      develop = {
        id: develop.id,
        type: develop.type,
        name: develop.name,
      };
      this.item.develops.push(develop);
    },

    deleteDevelop(index) {
      this.item.develops.splice(index, 1);
    },

    initialize() {
      if (this.$route.params.id) {
        this.getItem({ type: "map", id: this.$route.params.id }).then(
          (response) => {
            this.item = response.data();
            this.item.id = this.$route.params.id;
            this.original = JSON.parse(JSON.stringify(this.item));
          }
        );
      }
    },

    onSubmitResourcePoint(newPickable) {
      this.item.resourcePoints.push(newPickable);
      this.$bvModal.hide("modal-create");
    },

    onCancelResourcePoint() {
      this.$bvModal.hide("modal-create");
    },

    deleteResPoint(resPointIndex){
      this.item.resourcePoints.splice(resPointIndex, 1)
    },

    onSelectRP(index){
      if(index==this.selectedIndex){
        this.selectedIndex=null
      }else{
        this.selectedIndex = index
      }
    },

    getAllResources(item){
      return item.resourcePoints.flat(3).map(x=>x.pickables).flat(3).map(x=>x.resources).flat(3)
    },

    print() {
      console.log(this.getAllResources(this.item));
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