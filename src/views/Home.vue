<template>
  <div class="container">
    <h1 class="text-center">主页</h1>
    <Search 
    :collections="['item','monster','pickable']"
    :onEnter="directToDetail"
    ></Search>
  </div>
</template>

<script>
import Search from '@/components/Search';
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
    Search
  },
  methods:{
    directToDetail(source){
      this.$router.push(`/${source.type}/${source.id}`);
    }
  }

}
</script>
