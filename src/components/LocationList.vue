<template>
  <div class="container">
    <h1 class="text-center">地点</h1>
    <b-row class="col-md-6 mx-auto">
      <b-input
        class="list-group-item col-md"
        v-on:keyup.enter.stop.prevent="addLocation"
        v-model="location"
        v-if="editMode"
      >
      </b-input>
    </b-row>

    <b-modal id="modal-edit">
      <b-input
        v-if="selectedIndex != null"
        v-model="settingsDoc.locations[selectedIndex]"
      ></b-input>
      <template v-slot:modal-footer>
        <b-button @click="updateLocation">确认</b-button>
      </template>
    </b-modal>

    <ul class="col-md-6 mx-auto" v-if="settingsDoc">
      <li
        class="list-group-item col-md-12"
        v-for="(loc, index) in settingsDoc.locations
          ? settingsDoc.locations
          : []"
        :key="loc"
      >
        <div class="row">
          <b-input
            class="col-md"
            v-model="settingsDoc.locations[index]"
            disabled
          >
          </b-input>
          <b-button
            variant="outline-info"
            v-if="editMode"
            class="col-md-2"
            v-b-modal:modal-edit
            @click="selectLocation(index)"
            >修改</b-button
          >
          <b-button
            variant="outline-danger"
            v-if="editMode"
            class="col-md-2"
            @click="deleteLocation(index)"
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
      doc: "settings",
      selectedIndex: null,
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
        this.settingsDoc.locations.push(this.location);
        await db
          .collection(this.collection)
          .doc(this.doc)
          .update({ locations: this.settingsDoc.locations });
        this.location = "";
      }
    },

    selectLocation(index) {
      this.selectedIndex = index;
    },

    async deleteLocation(index) {
      this.settingsDoc.locations.splice(index, 1);
      await db
        .collection(this.collection)
        .doc(this.doc)
        .update({ locations: this.settingsDoc.locations });
    },

    updateLocation() {
      db.collection(this.collection)
        .doc(this.doc)
        .update({ locations: this.settingsDoc.locations });
      this.$bvModal.hide("modal-edit");
    },
  },
};
</script>