<template>
  <div>
    <b-modal :id="`modal-${resPointIndex}`" size="lg" title="资源点编辑" v-if="editMode" no-close-on-backdrop>
    <ResoucePointDetail 
    :name = "`RPdetail-${resPointIndex}`"
    :onSubmit="onSubmitResourcePoint"
    :onCancel="onCancelResourcePoint"
    :resourcePointArray= "resourcePointArray"
    :index= "resPointIndex"
    >
    <template v-slot:footbar>
      <span></span>
    </template>
    </ResoucePointDetail>
    <template v-slot:modal-footer>
        <span></span>
      </template>
    </b-modal>
    <b-container class="rounded border border-info">
    <b-row>
      <!-- 颜色 -->
      <div class="col-md-1 my-auto" :class="{'btn-primary':resPointIndex==selectedIndex, 'btn':editMode}" @click="onClickColor">
        <i class="fas fa-circle my-auto" :style="{'color':resourcePoint.color}"></i>
        </div>
      <div class="col-md">
        <ul class="list-group">
          <li
            class="list-group-item"
            v-for="(pick, index) in resourcePoint.pickables"
            :key="index"
          >
            <b-row>
              <div class="col-md-3">
                {{ toolTypes[pick.toolTypeIndex] }}
              </div>
              <div class="col-md-3" v-for="j in [0, 1, 2]" :key="j">
                <router-link v-if="pick.resources[j]" :to="`/${pick.resources[j].type}/${pick.resources[j].id}`">
                  {{ pick.resources[j].name }}
                </router-link>
              </div>
            </b-row>
          </li>
        </ul>
      </div>

      <b-col md="2">
      <b-button v-if="editMode" @click.stop="onEdit" class="col-md" variant="info">
        编辑
      </b-button>

      <b-button v-if="editMode" @click.stop="onDelete" class="col-md" variant="danger">
        删除
      </b-button>
      </b-col>

    </b-row>
    </b-container>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import ResoucePointDetail from "@/components/ResourcePointDetail";

export default {
  props: {
    resPointIndex: Number,
    resourcePointArray: Array,
    onSelectRP: Function,
    selectedIndex: Number,
  },


  components:{
    ResoucePointDetail
  },


  computed:{
    ...mapState([
      'editMode',
      'toolTypes'
    ]),

    resourcePoint(){
      return this.resourcePointArray[this.resPointIndex]
    }
  },


  methods:{
    onDelete(){
      this.resourcePointArray.splice(this.resPointIndex, 1)
    },
    
    onCancelResourcePoint() {
      this.$bvModal.hide(`modal-${this.resPointIndex}`);
    },

    onSubmitResourcePoint(pickable){
      console.log(pickable)
      this.resourcePointArray[this.resPointIndex] = pickable
      this.$bvModal.hide(`modal-${this.resPointIndex}`);

    },

    onEdit(){
      this.$bvModal.show(`modal-${this.resPointIndex}`);
    },

    onClickColor(){
      if(!this.editMode){
        return
      }
      this.onSelectRP(this.resPointIndex)
    }
  }
};
</script>