<template>
  <div class="container">
    <b-row class="col-md-6 mx-auto">
      <b-input
        class="list-group-item col-md"
        v-on:keyup.enter="addLocation"
        v-model="location"
        v-if="editMode"
      >
      </b-input>
    </b-row>

    <ul class="col-md-6 mx-auto" v-if="settingsDoc">
      <li
        class="list-group-item col-md-12"
        v-for="(loc, index) in settingsDoc.locations ? settingsDoc.locations : []"
        :key="loc"
      >
        <div class="row">
          <b-input
            class="col-md"
            v-model="settingsDoc.locations[index]"
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
      settingsDoc: { locations: [] },
      location: "",
      collection: "misc",
      doc: "settings"
    };
  },
  computed: {
    ...mapState(["editMode"]),
  },
  firestore() {
    return {
      settingsDoc: db.collection(this.collection).doc(this.doc),
    };
  },

  methods: {
    async addLocation() {
      if (this.location.length > 0) {
        console.log(this.settingsDoc.locations)
        this.settingsDoc.locations.push(this.location);
        await db
          .collection(this.collection)
          .doc(this.doc)
          .update({ locations: this.settingsDoc.locations });
        this.location = "";
      }
    },

    async deleteLocation(index) {
      this.locations.locations.locations.splice(index, 1);
      await db
        .collection(this.collection)
        .doc(this.doc)
        .update({ data: this.settingsDoc.locations });
    },

    updateLocation() {
      db.collection(this.collection)
        .doc(this.doc)
        .update({ data: this.settingsDoc.locations });
    },
  },
};
</script>