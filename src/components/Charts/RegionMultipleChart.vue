<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
/* eslint-disable */
import echarts, { EChartOption } from "echarts";
import { Component, Prop, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ResizeMixin from "./mixins/resize";
require("echarts/theme/macarons");

@Component({
  name: "RegionMultipleChart"
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: "chart" }) private className!: string;
  @Prop({ default: "chart" }) private id!: string;
  @Prop({ default: "100%" }) private width!: string;
  @Prop({ default: "100%" }) private height!: string;
  @Prop({ default: () => [] }) private chartData!: any[];
  @Prop() private axis!: any;
  @Prop({ default: () => [] }) private series!: any[];
  @Prop({
    default: () => {
      return {
        borderWidth: 0,
        top: "20%",
        bottom: "10%",
        left: "8%",
        right: "5%"
      };
    }
  })
  private grid!: any[];

  @Prop({
    default: 0.8
  })
  private lineStyle!: number;

  @Prop({ default: () => ["#d85965", "#f39762", "#3079fc", "#07b8c5"] })
  private colorList!: any[];

  @Watch("chartData")
  onChartDataChange() {
    this.initChart();
  }

  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  }

  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
    clearInterval(this.timer);
    this.timer = null;
  }
  timer: any = null;
  animationDuration: number = 3000;
  chart: any = null;
  currentIndex: number = -1;
  setAnimation(option: any) {
    let currentIndex = this.currentIndex;
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      var dataLen = option.series[0].data.length;

      // 取消之前高亮的图形
      this.chart.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex: currentIndex
      });
      currentIndex = (currentIndex + 1) % dataLen;
      this.currentIndex = currentIndex;
      // 高亮当前图形
      this.chart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: currentIndex
      });

      // 显示 tooltip
      this.chart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: currentIndex
      });
    }, this.animationDuration);
  }
  private initChart() {
    let clientWidth = document.body.clientWidth;
    let fontSize = clientWidth > 1366 ? 12 : 10;
    this.chart = echarts.init(
      document.getElementById(this.id) as HTMLDivElement
    );

    const xAxisData: string[] = this.chartData.map(item => item.name);

    const series: any[] = [];
    this.series.forEach((item, index) => {
      const dataArr = this.chartData.map(v => v[item.property]);
      if (item.type === "bar") {
        series.push({
          name: item.name,
          type: "bar",
          barMaxWidth: 10,
          barGap: "30%",
          itemStyle: {
            normal: {
              color: this.colorList[index],
              barBorderRadius: 0,
              label: {
                show: false,
                position: "top"
              }
            }
          },
          data: dataArr
        });
      } else if (item.type === "line") {
        series.push({
          name: item.name,
          type: "line",
          symbol: "circle",
          symbolSize: 5,
          smooth: item.smooth ? true : false,
          lineStyle: {
            width: this.lineStyle
          },
          itemStyle: {
            normal: {
              color: this.colorList[index],
              barBorderRadius: 0,
              label: {
                show: false,
                position: "top"
              }
            }
          },
          data: dataArr
        });
      }
    });
    let option = {
      backgroundColor: "transparent",
      grid: {
        ...this.grid,
        textStyle: {
          color: "#fff",
          fontSize: fontSize
        }
      },
      tooltip: {
        show: true,
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          shadowStyle: "rgba(0, 0, 0, 0.5)"
        },
        textStyle: {
          color: "#fff",
          fontSize: fontSize
        }
      },
      legend: {
        top: 0,
        left: 10,
        itemWidth: 16,
        itemHeight: 8,
        itemGap: 16,
        textStyle: {
          color: "#99dced",
          fontSize: fontSize
        },
        data: this.series.map(item => item.name)
      },
      xAxis: [
        {
          type: "category",
          axisLine: {
            show: false,
            lineStyle: {
              color: "#fff",
              type: "dashed",
              width: 0.8
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: "#fff",
              fontWeight: "normal",
              fontSize: fontSize
            }
          },
          data: xAxisData
        }
      ],
      yAxis: [
        {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#1b5581",
              type: "dashed",
              width: 0.8
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#fff",
              type: "dashed",
              width: 0.8
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: "#fff",
              fontWeight: "normal",
              fontSize: fontSize
            }
          },
          splitArea: {
            show: false
          }
        }
      ],
      series
    };
    this.chart.setOption(option, true);
    this.setAnimation(option);
    let _this = this;
    this.chart.on("mouseover", function(e: any) {
      if (e.dataIndex != 0) {
        _this.currentIndex = e.dataIndex;
        clearInterval(_this.timer);
      }
    });
    this.chart.on("mouseout", function() {
      _this.setAnimation(option);
    });
  }
}
</script>
