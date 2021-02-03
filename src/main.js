import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import firebase from 'firebase/app'
import VueFirestore from 'vue-firestore'
import 'firebase/firestore'
import 'firebase/storage'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Search from '@/components/Search';



const firebaseConfig = {
  apiKey: "AIzaSyC6s6_hpk94oRm2Mfn97HAUnlI5zfmmxSA",
  authDomain: "ryza2-a8b44.firebaseapp.com",
  projectId: "ryza2-a8b44",
  storageBucket: "ryza2-a8b44.appspot.com",
  messagingSenderId: "796710019410",
  appId: "1:796710019410:web:4a1bf603b90c297a055a8b"
};

firebase.initializeApp(firebaseConfig)
export const storageRef = firebase.storage().ref();
export const db = firebase.firestore()

Vue.use(VueFirestore)
Vue.component('l-v-search', Search)
Vue.component('v-select', vSelect)

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  created() {

    db.collection("misc").doc("settings")
    .onSnapshot((response) => {
      this.$store.state.itemTypes = response.data().itemTypes;
      this.$store.state.toolTypes = response.data().toolTypes;
      this.$store.state.elements = response.data().elements;
      this.$store.state.locations = response.data().locations;
      this.$store.state.attributes = response.data().attributes; 
      this.$store.state.admins = response.data().admins; 
      this.$store.state.defaultItemTypeIndex = response.data().defaultItemTypeIndex; 
    });

    firebase.auth().onAuthStateChanged((user) => {
      this.$store.state.uid = user ? user.uid : null
    });

    db.collection("item").doc("index")
      .onSnapshot((doc) =>{
      this.$store.state.items = doc.data().itemArray;
    });


  },
  render: h => h(App)
}).$mount('#app')
