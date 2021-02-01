<template>
  <div>
    <b-modal :id="`modal-${resPointIndex}`" size="lg" title="资源点编辑" v-if="editMode">
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

    <b-row>
      <!-- 颜色 -->
      <div class="col-md-2 border">
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
                {{ pick.tool }}
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

      <b-button v-if="editMode" @click.stop="onEdit">
        编辑
      </b-button>

      <b-button v-if="editMode" @click.stop="onDelete">
        删除
      </b-button>

    </b-row>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import ResoucePointDetail from "@/components/ResourcePointDetail";

export default {
  props: {
    resPointIndex: Number,
    resourcePointArray: Array,
  },


  components:{
    ResoucePointDetail
  },


  computed:{
    ...mapState([
      'editMode'
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
    }
  }
};
</script>