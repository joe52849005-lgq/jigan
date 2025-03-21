/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'

Vue.use(Vuex)

export interface IRootState {
  app?: any;
  user?: any;
  menu?: any;
  reuseTab?: any;
  loadingCtrl?: any;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({
  modules: {
    app: app,
    user: user,
  }
})
