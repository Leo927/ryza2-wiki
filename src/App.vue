<template>
  <div id="app">
    <Navbar></Navbar>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

</style>

<script>
import Navbar from '@/components/Navbar';
export default {
  components:{
    Navbar
  }
}
</script>