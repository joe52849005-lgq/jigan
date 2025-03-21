import { Module, MutationTree, Getter, GetterTree, ActionTree, ActionContext } from 'vuex';
import { IRootState } from '..';

export interface ILoginInfoState {
  token?: string;
  info?: UserInfo;
}

export interface UserInfo {
  id: number;
}

const mutations: MutationTree<ILoginInfoState> = {
  setToken(state: ILoginInfoState, token: any) {
    state.token = token
  },
  setInfo(state: ILoginInfoState, info: UserInfo) {
    state.info = info;
  },
  logout(state: ILoginInfoState) {
    state.info = void 0;
    state.token = void 0;
  },

}
const getters: GetterTree<ILoginInfoState, IRootState> = {

}
//获取用户信息
const actions: ActionTree<ILoginInfoState, IRootState> = {
  logged(context: ActionContext<ILoginInfoState, IRootState>, param: any) {
    //异步加载数据设置用户信息
  }
}
const loginInfoState: ILoginInfoState = {
  token: undefined,
  info: undefined
}
const user: Module<ILoginInfoState, IRootState> = {
  namespaced: true,
  state: loginInfoState,
  mutations,
  actions,
  getters
}

export default user

