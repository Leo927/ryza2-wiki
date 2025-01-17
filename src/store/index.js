import Vue from 'vue'
import Vuex from 'vuex'
import state from './state';
import mutations from './mutations';
import actions from './actions';
import modules from './modules';
import getters from './getters';

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  state,
  mutations,
  modules,
  getters
})
