<template>
  <div class="container">
    <h1 class="text-center">主页</h1>

    <b-row>
      <b-col class="col-md-6 mx-auto">
        <Search
          class="mx-auto"
          :collections="['item', 'monster', 'pickable']"
          :onEnter="directToDetail"
        ></Search>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Search from "@/components/Search";
// @ is an alias to /src

export default {
  name: "Home",
  components: {
    Search,
  },
  methods: {
    directToDetail(source) {
      this.$router.push(`/${source.type}/${source.id}`);
    },
  },
};
</script>
