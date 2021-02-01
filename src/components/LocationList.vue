<template>
  <div class="container">
    <b-row class="col-md-6 mx-auto">
      <b-input
        class="list-group-item col-md"
        v-on:keyup.enter="addLocation"
        v-model="location"
      >
      </b-input>
    </b-row>

    <ul class="col-md-6 mx-auto" v-if="data">
      <li
        class="list-group-item col-md-12"
        v-for="(loc, index) in data.locations ? data.locations.locations : []"
        :key="loc"
      >
        <div class="row">
          <b-input
            class="col-md"
            v-model="data.locations.locations[index]"
            v-on:keyup.enter="updateLocation"
            :disabled="!editMode"
          >
          </b-input>
          <b-button v-if="editMode" class="col-md-3" @click="deleteLocation(index)"
            >删除</b-button
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from "@/main";
import { mapState } from "vuex";

export default {
  data() {
    return {
      data: { locations: { locations: [] } },
      location: "",
    };
  },
  computed: {
    ...mapState(["editMode"]),
  },
  firestore() {
    return {
      data: db.collection("misc").doc("locations"),
    };
  },

  methods: {
    async addLocation() {
      if (this.location.length > 0) {
        this.data.locations.locations.push(this.location);
        await db
          .collection("misc")
          .doc("locations")
          .update({ locations: this.data.locations });
        this.location = "";
      }
    },

    async deleteLocation(index) {
      this.data.locations.locations.splice(index, 1);
      await db
        .collection("misc")
        .doc("locations")
        .update({ locations: this.data.locations });
    },

    updateLocation() {
      db.collection("misc")
        .doc("locations")
        .update({ locations: this.data.locations });
    },
  },
};
</script>