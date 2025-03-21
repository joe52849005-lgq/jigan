<template>
  <!-- eslint-disable -->
  <div style="display: flex;justify-content: space-between;width:100%;">
    <div id="statisticsScreen1" class="split-screen">
      <split-screen-1 :area-data="areaData" />
    </div>
    <div id="statisticsScreen2" class="split-screen">
      <split-screen-2 @select-area="onSelectArea" @to-monitor="onToMonitor" />
    </div>
    <div id="statisticsScreen3" class="split-screen">
      <split-screen-3 :area-data="areaData" />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import MultipleChart from "@/components/Charts/MultipleChart.vue";
import { AreaModule } from "@/store/modules/area";
import SplitScreen1 from "./split-screen-1.vue";
import SplitScreen2 from "./split-screen-2.vue";
import SplitScreen3 from "./split-screen-3.vue";
import { namespace, State } from "vuex-class";
const userModule = namespace("user");

@Component({
  name: "SplitScreenOne",
  components: {
    MultipleChart,
    SplitScreen1,
    SplitScreen2,
    SplitScreen3
  }
})
export default class extends Vue {
  private areaData: any = {
    name: "广西壮族自治区",
    value: 0
  };
  @userModule.State("info")
  userInfo: any;

  private onSelectArea(data: any) {
    this.areaData = {
      ...this.areaData,
      ...data
    };
  }

  private onToMonitor(params: any) {
    this.$emit("to-monitor", params);
  }
}
</script>
<style lang="scss">
#statisticsScreen1,
#statisticsScreen2,
#statisticsScreen3 {
  width: calc(100% / 3);
  overflow: hidden;
}

@media screen and (min-width: 1366px) {
  #statisticsScreen3 {
    margin-right: 10px;
  }
}
@media screen and (max-width: 1366px) {
  #statisticsScreen2 {
    width: 520px;
    overflow: hidden;
  }
}
</style>
