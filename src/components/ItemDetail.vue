<template>
  <div>
    <b-row v-if="item">
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
              item && item.photoUrl
                ? item.photoUrl
                : 'https://via.placeholder.com/150'
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
                v-model="item.itemTypeIndex"
                :options="itemTypeOptions"
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
                v-model="item.elementIndexes"
                :options="elementOptions"
                @input="setElementIndexes"
                :aria-describedby="ariaDescribedby"
                name="flavour-1"
                :disabled="!editMode"
              ></b-form-checkbox-group>
            </b-form-group>
          </div>
        </b-row>

        <l-v-search v-if="editMode"
          :collections="['attributes']"
          :onSelectOption="addAttribute"
        ></l-v-search>
        <!-- 物品属性列表 -->
        <b-container>
          <b-row>
            <div
              class="card col-md-2"
              v-for="(attr, attrIndex) in this.item.attributes"
              :key="attrIndex"
            >
              <div >
                <h5 class="card-title text-center">{{ attr }}</h5>
                <b-button class="col-md" @click="removeAttribute(attrIndex)" v-if="editMode">
                  删除
                </b-button>
              </div>
            </div>
          </b-row>
        </b-container>

        <b-row class="mb-3">
          <div class="col-md">
            <h3 class="text-center">来源</h3>
            <div v-if="editMode">
              <l-v-search
                :collections="['items']"
                :onSelectOption="addSources"
              ></l-v-search>
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
              <l-v-search
                :collections="['items']"
                :onSelectOption="addDevelop"
              ></l-v-search>
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
import { emptyItem } from "@/models/item";
import { mapActions } from "vuex";
import {
  createItem,
  getItem,
  deleteItem,
  updateItem,
} from "@/dbAccess/item";

export default {
  data() {
    return {
      item: emptyItem(),
      original: emptyItem(),
      result: "",
      lastItem: null,
      photoFile: null,
      sources: [],
    };
  },
  components: {},
  computed: {
    createMode() {
      return this.$route.params.id == null && this.editMode;
    },
    ...mapState(["editMode", "itemTypes", "elements", "attributes", "defaultItemTypeIndex", "elementColors"]),

    elementOptions() {
      return this.elements.map((value, index) => {
        return { text: value, value: index };
      });
    },

    itemTypeOptions() {
      return this.itemTypes.map((value, index) => {
        return { text: value, value: index };
      });
    },

    id() {
      return this.$route.params.id;
    },
  },

  watch: {
    id: function () {
      this.initialize();
    },
  },

  methods: {
    ...mapActions(["searchAll", "updateDifferences"]),

    async onSubmit() {
      if (!this.editMode) {
        throw "User submitting while not in edit mode";
      }
      if (this.createMode) {
        await createItem(this.item, this.photoFile);
        
        this.lastItem = this.item.name;
        this.initialize()
        this.result = "创建";
      } else if (this.editMode) {
        await updateItem(this.item, this.original, this.photoFile);
        
        this.initialize()
        this.result = "修改";
      }
    },

    setElementIndexes(checked) {
      this.item.elementIndexes = checked;
    },

    reset() {
      this.item = emptyItem();
      this.photoFile = null;
    },

    async onDelete() {
      await deleteItem(this.item);
      this.$router.push("/items");
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

    async initialize() {
      if (this.id) {
        const response = await getItem(this.id);
        this.item = this.checkAttributes(response.data());
        this.original = JSON.parse(JSON.stringify(this.item));
        this.photoFile = null;
      }else{
        this.item = emptyItem();
        this.item.itemTypeIndex = this.defaultItemTypeIndex
      }
      this.result = "";
    },

    checkAttributes(item){
      return item.attributes?item:{...item, attributes:[]}
    },

    addAttribute(item) {
      this.item.attributes.push(item);
    },

    removeAttribute(attrIndex) {
      this.item.attributes.splice(attrIndex, 1);
    },
  },

  created() {
    this.initialize();
  },
};
</script>