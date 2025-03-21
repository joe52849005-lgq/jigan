<template>
    <div :id="id" :class="className" :style="{height: height, width: width}" />
</template>

<script lang="ts">
/* eslint-disable */
import echarts, { EChartOption } from "echarts";
import { Component, Prop, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ResizeMixin from "./mixins/resize";
import { log } from "util";
require("echarts/theme/macarons");

@Component({
    name: "MultipleChart",
})
export default class extends mixins(ResizeMixin) {
    @Prop({ default: "chart" }) private className!: string;
    @Prop({ default: "chart" }) private id!: string;
    @Prop({ default: "100%" }) private width!: string;
    @Prop({ default: "100%" }) private height!: string;
    @Prop({ default: () => [] }) private chartData!: any[];
    @Prop() private axis!: any;
    @Prop({ default: () => [] }) private series!: any[];

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
    currentIndex: any = -1;
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
                dataIndex: currentIndex,
            });
            currentIndex = (currentIndex + 1) % dataLen;
            this.currentIndex = currentIndex;
            // 高亮当前图形
            this.chart.dispatchAction({
                type: "highlight",
                seriesIndex: 0,
                dataIndex: currentIndex,
            });

            // 显示 tooltip
            this.chart.dispatchAction({
                type: "showTip",
                seriesIndex: 0,
                dataIndex: currentIndex,
            });
        }, this.animationDuration);
    }
    private initChart() {
        let clientWidth = document.body.clientWidth;
        let fontSize = clientWidth > 1366 ? 14 : 10;
        this.chart = echarts.init(
            document.getElementById(this.id) as HTMLDivElement
        );

        const xAxisData: string[] = this.chartData.map((item) => item.name);

        const series: any[] = [];
        this.series.forEach((item) => {
            const dataArr = this.chartData.map((v) => v[item.property]);
            if (item.type === "line") {
                series.push({
                    name: item.name,
                    type: "line",
                    // stack: '总量',
                    symbol: "circle",
                    symbolSize: 5,
                    label: {
                        normal: {
                            show: true,
                            position: "top",
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: item.color,
                            lineStyle: {
                                color: item.color,
                                width: 1,
                            },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    1,
                                    0,
                                    0,
                                    item.colorList
                                ),
                            },
                        },
                    },
                    markPoint: {
                        itemStyle: {
                            normal: {
                                color: "red",
                            },
                        },
                    },
                    smooth: true,
                    data: dataArr,
                });
            }
        });
        let option = {
            backgroundColor: "transparent",
            grid: {
                left: "5%",
                right: "10%",
                top: "15%",
                bottom: "10%",
                containLabel: true,
            },
            tooltip: {
                show: true,
                trigger: "axis",
                textStyle: {
                    color: "#fff",
                    fontSize: fontSize,
                },
            },
            legend: {
                show: true,
                icon: "stack",
                itemWidth: 10,
                itemHeight: 10,
                textStyle: {
                    color: "#ffffff",
                    fontSize: fontSize,
                },
                data: this.series.map((item) => item.name),
            },
            xAxis: [
                {
                    type: "category",
                    boundaryGap: false,
                    axisLabel: {
                        color: "#30eee9",
                        fontSize: 10,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#397cbc",
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#195384",
                            opacity: 0.4,
                        },
                    },
                    data: xAxisData,
                },
            ],
            yAxis: [
                {
                    type: "value",
                    min: 0,
                    // max: 1000,
                    axisLabel: {
                        formatter: "{value}",
                        textStyle: {
                            color: "#2ad1d2",
                            fontSize: fontSize,
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#52FFFF",
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: "#11366e",
                        },
                    },
                },
            ],
            series,
        };
        this.chart.setOption(option, true);
        this.setAnimation(option);
        let _this = this;
        this.chart.on("mouseover", function (e: any) {
            if (e.dataIndex != 0) {
                _this.currentIndex = e.dataIndex;
                clearInterval(_this.timer);
            }
        });
        this.chart.on("mouseout", function () {
            _this.setAnimation(option);
        });
    }
}
</script>
