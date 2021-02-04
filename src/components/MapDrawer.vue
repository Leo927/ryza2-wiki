<template>
  <div>
    <span class="dot"></span>
    <Square :size="'1200px'">
      <div class="photoContainer">
        <img
          ref="mapImage"
          :src="this.map.photoUrl"
          alt="地图图片"
          width="100%"
          height="100%"
          @click.stop="onClickMap"
        />
        
        <i
          v-for="(posData, index) in dotList"
          :key="index"
          @click.stop="onDotClick(posData)"
          class="dot"
          :style="{
            'background-color': map.resourcePoints[posData.rpIndex].color,
            left: `${posData.pos.x * 100}%`,
            top: `${posData.pos.y * 100}%`,
          }"
        ></i>
      </div>
    </Square>
  </div>
</template>

<style scoped>
.mapElement {
  position: absolute;
}
.photoContainer{
  position: relative;
}

.dot {
  height: 5px;
  width: 5px;
  border-radius: 50%;
  display: inline-block;
  position: absolute;
}


#sample {
  color: yellow;
  left: 500px;
  top: 200px;
}
</style>


<script>
import Square from "@/components/Square";
import { mapState } from "vuex";

export default {
  props: {
    map: Object,
    clickHandler: Function,
  },

  components: {
    Square,
    
  },

  computed: {
    size() {
      return {y:this.$refs.mapImage.height, x:this.$refs.mapImage.width};
    },

    ...mapState(["editMode"]),

    dotList() {
      var rpData = this.map.resourcePoints.map((rp, rpIndex) => {
        return { rp, rpIndex };
      });
      var posData = rpData
        .map((j) => {
          return j.rp.pos.flatMap((p, posIndex) => {
            return { pos: p, rpIndex: j.rpIndex, posIndex: posIndex };
          });
        })
        .flat(3);
      return posData;
    },
  },

  data() {
    return {
      mapImage: null,
      svg: null,
    };
  },

  methods: {
    onClickMap(event) {
      if (!this.editMode) {
        return;
      }
      var percentPos = this.getRelativePercentageCoor(event);
      console.log(percentPos)
      this.clickHandler(percentPos);
    },

    getRelativePercentageCoor(event) {
      var mousePos = { x: event.clientX, y: event.clientY };
      var height = event.target.height;
      var width = event.target.width;
      var rect = event.target.getBoundingClientRect();
      var mapPos = { x: rect.left, y: rect.top };
      var relativePos = { x: mousePos.x - mapPos.x, y: mousePos.y - mapPos.y };
      var percentPos = { x: relativePos.x / width, y: relativePos.y / height };
      return percentPos;
    },

    onDotClick(posData){
        if(!this.editMode){
            return;
        }
        var rp = this.map.resourcePoints[posData.rpIndex];
        var posArray = rp.pos;
        posArray.splice(posData.posIndex, 1)
    }
  },
};
</script>