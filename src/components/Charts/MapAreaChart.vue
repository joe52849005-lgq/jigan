<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
/* eslint-disable */
import echarts, { EChartOption } from "echarts";
import { Component, Prop, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
require("echarts/theme/macarons");
import ResizeMixin from "./mixins/resize";

@Component({
  name: "MultipleChart"
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: "chart" }) private className!: string;
  @Prop({ default: "chart" }) private id!: string;
  @Prop({ default: "100%" }) private width!: string;
  @Prop({ default: "100%" }) private height!: string;
  @Prop() private axis!: any;
  @Prop() private geoCoordMap!: any;
  @Prop() private areaStatistics!: any;
  @Prop({ default: () => [] }) private series!: any[];
  @Prop({ default: () => ["#D85965", "#F39762", "#3079FC", "#07B8C5"] })
  private colorList!: any[];

  private currentName = "贵港市";
  private areaName = "广西";
  private currentParams: any = {};
  chart: any = {};
  private cityMap: any = {
    百色市: "baise",
    北海市: "beihai",
    崇左市: "chongzuo",
    防城港市: "fangchenggang",
    贵港市: "guigang",
    桂林市: "guilin",
    河池市: "hechi",
    贺州市: "hezhou",
    来宾市: "laibin",
    柳州市: "liuzhou",
    南宁市: "nanning",
    钦州市: "qinzhou",
    梧州市: "wuzhou",
    玉林市: "yulin"
  };

  private geoCoordMaps: any = {
    南宁市: [108.320004, 22.82402],
    柳州市: [109.411703, 24.314617],
    桂林市: [110.299121, 25.274215],
    梧州市: [111.297604, 23.474803],
    北海市: [109.119254, 21.473343],
    防城港市: [108.345478, 21.614631],
    钦州市: [108.624175, 21.967127],
    贵港市: [109.602146, 23.0936],
    玉林市: [110.154393, 22.63136],
    百色市: [106.616285, 23.897742],
    贺州市: [111.552056, 24.414141],
    河池市: [108.062105, 24.695899],
    来宾市: [109.229772, 23.733766],
    崇左市: [107.353926, 22.404108]
  };

  @Watch("areaStatistics.chartData")
  onDataChange() {
    this.initChart("广西");
  }

  mounted() {
    this.$nextTick(() => {
      echarts.registerMap("广西", require("../../assets/json/guangxi.json"));
      this.initChart("广西");
    });
  }

  beforeDestroy() {
    clearInterval(this.intel);
    this.intel = null;
    if (!this.chart) {
      return;
    }

    this.chart.dispose();
    this.chart = null;
  }

  private initChart(areaName: string) {
    this.chart = echarts.init(
      document.getElementById(this.id) as HTMLDivElement
    );
    this.areaName = areaName;
    const series: any[] = [];
    let max = 0;
    max = Math.max.apply(
      Math,
      this.areaStatistics.chartData.map(function(o: any) {
        return o.warn;
      })
    );
    this.areaStatistics.series.forEach((v: any, i: number) => {
      series.push({
        name: v.name,
        type: "map",
        geoIndex: 0,
        data: this.areaStatistics.chartData.map((item: any) => {
          return {
            name: item.name,
            value: item[v.property]
          };
        })
      });
    });

    this.chart.setOption({
      backgroundColor: "transparent",

      grid: {
        left: 0,
        right: 0,
        bottom: -15,
        top: "5%"
      },
      color: this.colorList,
      tooltip: {
        show: true
      },
      legend: {
        show: false
      },
      visualMap: {
        min: 0,
        max: max,
        left: "3%",
        bottom: "10%",
        text: ["高", "低"],
        textStyle: { color: "#ffffff" },
        calculable: true,
        inRange: {
          color: ["#24CFF4", "#2E98CA", "#1E62AC"]
          // color: [
          //   "#1890ff",
          //   "#14488b",
          //   "#164b8e",
          //   "#1e5397",
          //   "#22569a",
          //   "#2a5ea2",
          //   "#2d62a6",
          //   "#3166aa"
          // ]
        },
        show: true
      },
      geo: {
        map: areaName,
        label: {
          show: true,
          color: "#fff"
        },
        aspectScale: 1,
        zoom: 1.2,
        itemStyle: {
          normal: {
            areaColor: "rgb(39, 66, 191)",
            borderColor: "rgb(4, 16, 35)",
            borderWidth: 1
          },
          emphasis: {
            areaColor: "#00ECFC"
          }
        }
      },
      series
    } as any);

    this.chart.on("click", (params: any) => {
      (window.event as Event).cancelBubble = true;
      console.log(params);

      let result: any = {};
      this.areaStatistics.chartData.forEach((v: any, i: number) => {
        if (params.name == v.name) {
          result = Object.assign({
            city_code: v.city_code,
            name: params.name
          });
        }
      });
      this.$emit("select", result);
    });

    this.initChr();
    let _this = this;
    this.chart.on("mouseover", function(e: any) {
      _this.dataIndex = e.dataIndex;
      _this.chart.dispatchAction({
        type: "downplay",
        seriesIndex: 0
      });
      _this.chart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: _this.dataIndex //第几个tooltip
      });

      _this.chart.dispatchAction({
        type: "showTip",
        seriesIndex: 0, //第几条series
        dataIndex: _this.dataIndex //第几个tooltip
      });
      clearInterval(_this.intel);
    });
    this.chart.on("mouseout", function() {
      _this.initChr();
    });
  }
  dataIndex: any = 0;
  initChr() {
    this.intel = setInterval(() => {
      if (this.chart && this.chart.dispatchAction) {
        if (this.dataIndex >= this.areaStatistics.chartData.length) {
          this.dataIndex = 0;
        } else {
          this.currentName = this.areaStatistics.chartData[this.dataIndex].name;
          this.chart.dispatchAction({
            type: "downplay",
            seriesIndex: 0
          });
          this.chart.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: this.dataIndex //第几个tooltip
          });

          this.chart.dispatchAction({
            type: "showTip",
            seriesIndex: 0, //第几条series
            dataIndex: this.dataIndex //第几个tooltip
          });
          this.dataIndex++;
        }
      } else {
        clearInterval(this.intel);
      }
    }, 2000);
  }
  intel: any = null;
}
</script>
