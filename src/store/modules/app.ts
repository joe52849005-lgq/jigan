import { Module, MutationTree } from 'vuex';

import { IRootState } from '@/store';

export interface IAppState {
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  };
  isCollapse: boolean;
  name?: string;
  doctitle?: string;
  size?: string;
}


const mutations: MutationTree<IAppState> = {
  collapse(state: IAppState) {
    state.sidebar.opened = !state.sidebar.opened;
  },
  appName(state: IAppState, appinfo: any) {
    state.name = appinfo.name;
  },
  changeTitle(state: IAppState, title: any) {
    state.doctitle = title;
  },
};

const appState: IAppState = {
  sidebar: {
    opened: false,
    withoutAnimation: true
  },
  isCollapse: false,
  name: '',
  doctitle: '',
  size: "medium"
};

const app: Module<IAppState, IRootState> = {
  namespaced: true,
  state: appState,
  mutations,
};

export default app;
