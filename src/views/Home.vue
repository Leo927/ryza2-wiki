<template>
  <div class="container">
    <h1 class="text-center">主页</h1>

    <b-row>
      <b-col class="col-md-6 mx-auto">
        <l-v-search
          name="search"
          class="mx-auto"
          :collections="['items', 'monsters', 'pickables', 'maps']"
        ></l-v-search>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {
  },
  methods: {
    directToDetail(source) {
      this.$router.push(`/${source.type}/${source.id}`);
    },
  },
};
</script>
