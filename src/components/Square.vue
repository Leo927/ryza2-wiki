<template>
<div class="square" :style="{'max-width':size}">
    <div class="content">
        <slot>
            No Content
        </slot>
    </div>
    </div>
</template>



<style scoped>
.square{
  position: relative;
  max-width: 300px;
  border: solid 1px black
}
  
.square .content {
   position: absolute;
   width: 100%;
   height: 100%;
  }
  
  .square:after {
   content: '';
   display: block;
   padding-top: calc(100%);
  }
</style>

<script>
export default {
    props:{
        size: String
    }
}
</script>