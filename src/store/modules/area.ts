/* eslint-disable */
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import axios from 'axios'

export interface IAreaState {
  cityList: any[];
}

@Module({ dynamic: true, store, name: "area" })
class Area extends VuexModule implements IAreaState {
  public cityList: any[] = [];

  @Mutation
  private SET_CITYLIST(data: any[]) {
    this.cityList = data;
  }

  @Action
  public getGXCityList() {
    return new Promise(resolve => {
      axios({
        baseURL: `${process.env.VUE_APP_SCREEN_API}/p1upgrade/app/api`,
        url: "/getGXCityList",
        method: "get",
        params: {
          token: process.env.VUE_APP_SCREEN_TOKEN
        }
      }).then((res: any) => {
        if (res.data.code === 0) {
          this.SET_CITYLIST(res.data.data || []);
        }
        resolve(this.cityList);
      });
    })
  }
}

export const AreaModule = getModule(Area)
