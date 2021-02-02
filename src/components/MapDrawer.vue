<template>
  <div>
    <Square :size="'1200px'">
      <div>
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
          class="fas fa-circle mapElement"
          :style="{
            color: map.resourcePoints[posData.rpIndex].color,
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
      return this.$refs.mapImage.height;
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
      this.clickHandler(percentPos);
    },

    getRelativePercentageCoor(event) {
      var mousePos = { x: event.clientX, y: event.clientY };
      var size = event.target.height;
      var rect = event.target.getBoundingClientRect();
      var mapPos = { x: rect.left, y: rect.top };
      var relativePos = { x: mousePos.x - mapPos.x, y: mousePos.y - mapPos.y };
      var percentPos = { x: relativePos.x / size, y: relativePos.y / size };
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