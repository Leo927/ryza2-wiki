<template>
  <div>
    <b-row>
      <b-col md="9 mx-auto">
        <div
          class="text-success text-center"
          :style="{ visibility: lastItem ? 'visible' : 'hidden' }"
        >
          {{ lastItem }} {{ result }}成功
        </div>

        <b-row>
          <img
            class="col-md-3"
            :src="
              item.photoUrl ? item.photoUrl : 'https://via.placeholder.com/150'
            "
            alt=""
            style="height: 100%"
          />
          <div class="col-9">
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

            <b-form-group
              id="input-group-3"
              label="物品类型:"
              label-for="input-3"
            >
              <b-form-select
                id="input-3"
                v-model="item.itemType"
                :options="ItemType"
                required
                :disabled="!editMode"
              ></b-form-select>
            </b-form-group>

            <b-form-group v-if="editMode">
              <b-form-file
                v-model="photoFile"
                :state="Boolean(photoFile)"
                placeholder="选择一个文件或者拖到此处"
                drop-placeholder="拖到此处"
                :disabled="!editMode"
              ></b-form-file>
            </b-form-group>

            <b-form-group label="属性:" v-slot="{ ariaDescribedby }">
              <b-form-checkbox-group
                id="checkbox-group-1"
                v-model="item.elements"
                :options="['风', '冰', '火', '雷']"
                :aria-describedby="ariaDescribedby"
                name="flavour-1"
                :disabled="!editMode"
              ></b-form-checkbox-group>
            </b-form-group>
          </div>
        </b-row>

        <b-row class="mb-3">
          <div class="col-md">
            <h3 class="text-center">来源</h3>
            <div v-if="editMode">
              <Search :collections="['item']" :onEnter="addSources"></Search>
            </div>
            <div>
              <b-table
                hover
                :items="item.sources"
                :fields="['name', editMode ? 'delete' : null]"
              >
                <template #cell(name)="data">
                  <router-link :to="`/${data.item.type}/${data.item.id}`">{{
                    data.item.name
                  }}</router-link>
                </template>
                <template #cell(delete)="row">
                  <b-button
                    size="sm"
                    @click="deleteSource(row.index)"
                    class="mr-2"
                  >
                    删除
                  </b-button>
                </template>
              </b-table>
            </div>
          </div>

          <div class="col-md">
            <h3 class="text-center">改变</h3>
            <div v-if="editMode">
              <Search :collections="['item']" :onEnter="addDevelop"></Search>
            </div>
            <div>
              <b-table
                hover
                :items="item.develops"
                :fields="['name', editMode ? 'delete' : null]"
              >
                <template #cell(name)="data">
                  <router-link :to="`/${data.item.type}/${data.item.id}`">{{
                    data.item.name
                  }}</router-link>
                </template>
                <template #cell(delete)="row">
                  <b-button
                    size="sm"
                    @click="deleteDevelop(row.index)"
                    class="mr-2"
                  >
                    删除
                  </b-button>
                </template>
              </b-table>
            </div>
          </div>
        </b-row>

        <b-row>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import { emptyItem, ItemType } from "@/models/item";
import { mapActions } from "vuex";
import Search from "@/components/Search";

export default {
  data() {
    return {
      item: emptyItem(),
      original: emptyItem(),
      result: "",
      ItemType,
      lastItem: null,
      photoFile: null,
      sources: [],
    };
  },
  components: {
    Search,
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
      "updateDifferences",
      "uploadImage",
    ]),

    async onSubmit() {
      if (this.photoFile != null) {
        this.uploadImage({
          type: this.item.type,
          id: this.item.id,
          file: this.photoFile,
          callback: (response) => {
            console.log(response.ref);
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
          callback: (response) => {
            console.log(response);
          },
        });
      });
    },

    handleUpdate() {
      this.updateItem(this.item).then(() => {
        this.lastItem = this.item.name;
        this.result = "修改";
        this.updateDifferences({
          current: this.item,
          original: this.original,
        });
      });
    },

    reset() {
      this.item = emptyItem();
      this.photoFile = null;
    },

    onDelete() {
      this.deleteItem(this.item).then(() => {
        this.lastItem = this.item.name;
        this.item = emptyItem();
        this.result = "删除";
        this.$router.push("/items");
        this.updateDifferences({ current: this.item, original: this.original });
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
        this.getItem({ type: "item", id: this.$route.params.id }).then(
          (response) => {
            this.item = response.data();
            this.item.id = this.$route.params.id;
            this.original = JSON.parse(JSON.stringify(this.item));
          }
        );
      }
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