<template>
  <div class="mb-5">
    <!-- 登录弹窗 -->
    <b-modal id="modal-login" @shown="onLoginModalShown">
      <div id="firebaseui-auth-container"></div>
      <template v-slot:modal-footer>
        <span></span>
      </template>
    </b-modal>

    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand to="/">主页</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/items">物品</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav>
          <b-nav-item to="/locations">地点</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav-item to="/maps">地图</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav v-if="isAdmin">
          <b-nav-item to="/config">后台</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-col style="min-width:300px">
            <l-v-search
            name="search"
              class="mx-auto"
              :collections="['items', 'monsters', 'pickables', 'maps']"
            ></l-v-search>
          </b-col>
          <b-form-checkbox
            v-if="isAdmin"
            class="my-auto mx-5"
            v-model="editMode"
            name="check-button"
            switch
          >
            编辑模式
          </b-form-checkbox>

          <!-- 已登录 -->
          <b-nav-item-dropdown v-if="$store.state.uid" right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item @click="signOut">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>

          <!-- 未登录 -->
          <b-button
            v-if="!uid"
            v-b-modal.modal-login
            size="sm"
            class="col-md my-auto my-sm-0"
            >登录</b-button
          >
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import * as firebaseui from "firebaseui";
import firebase from "firebase/app";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  computed: {
    ...mapState(["uid"]),
    ...mapGetters(["isAdmin"]),

    editMode: {
      get: function () {
        return this.$store.editMode;
      },
      // setter
      set: function (newValue) {
        this.setEditMode(newValue);
      },
    },
  },

  components: {
  },

  data() {
    return {
      loginUI: null,
    };
  },

  methods: {
    ...mapActions(["setEditMode"]),
    onLoginModalShown() {
      var uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: () => {
            this.$bvModal.hide("modal-login");
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return false;
          },
        },
        signInFlow: "popup",
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        ],
      };
      this.loginUI.start("#firebaseui-auth-container", uiConfig);
    },

    directToDetail(source) {
      this.$router.push(`/${source.type}/${source.id}`);
    },

    async signOut() {
      await firebase.auth().signOut();
    },
  },

  created() {
    this.loginUI =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());
  },
};
</script>