<template>
  <div
    :id="id"
    :class="className"
    :style="{height: height, width: width}"
  />
</template>

<script lang="ts">
/* eslint-disable */
import echarts, { EChartOption } from 'echarts'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from './mixins/resize'
import _ from 'lodash'
require('echarts/theme/macarons')

@Component({
  name: 'PollutantsChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: 'chart' }) private id!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '200px' }) private height!: string
  @Prop({ default: () => [] }) private chartData!: any[]
  @Prop() private axis!: any
  @Prop({ default: () => [] }) private series!: any[]

  @Watch('chartData')
  onChartDataChange() {
    this.initChart()
  }

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }

  private initChart() {
    this.chart = echarts.init(document.getElementById(this.id) as HTMLDivElement)

    // const chartData = [
    //   {
    //     name: 'PM10',
    //     value: 80
    //   },
    //   {
    //     name: 'PM2.5',
    //     value: 43
    //   },
    //   {
    //     name: 'NO2',
    //     value: 15
    //   },
    //   {
    //     name: 'O3',
    //     value: 131
    //   },
    //   {
    //     name: 'CO',
    //     value: 0.9
    //   },
    //   {
    //     name: 'SO2',
    //     value: 6
    //   }
    // ]

    // let renderData: any[] = [
    //   {
    //     value: [],
    //     name: '主要污染物',
    //     symbol: 'none',
    //     lineStyle: {
    //       normal: {
    //         color: 'rgba(7, 118, 249, 0.5)',
    //         width: 2
    //       }
    //     },
    //     areaStyle: {
    //       normal: {
    //         color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
    //           {
    //             offset: 0,
    //             color: 'rgba(2,69,228,1)'
    //           },
    //           {
    //             offset: 1,
    //             color: 'rgba(0,193,228,1)'
    //           }
    //         ], false)
    //       }
    //     },
    //   }
    // ]

    // chartData.forEach((d: any, i: number) => {
    //   let value: any[] = ['', '', '', '', '', '']
    //   value[i] = max
    //   renderData[0].value[i] = d.value
    //   renderData.push({
    //     value,
    //     symbol: 'none',
    //     symbolSize: 12,
    //     lineStyle: {
    //       normal: {
    //         color: 'transparent'
    //       }
    //     },
    //     itemStyle: {
    //       normal: {
    //         color: '#00B6E4',
    //       }
    //     }
    //   })
    // })

    const max: number = _.max(this.chartData.map(d => d.value))
    const renderData = this.chartData.map(d => d.value)
    
    const indicator: any[] = this.chartData.map(item => {
      return {
        name: item.name,
        max,
        color: '#00B6E4'
      }
    })

    this.chart.setOption({
      backgroundColor: 'transparent',
      grid: {
        top: "1%",
        left: "1%",
        right: "1%",
        bottom: "1%"
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      radar: [
        {
          center: ["50%", "50%"],
          radius: "70%",
          startAngle: 90,
          splitArea: {
            areaStyle: {
              color: 'transparent'
            }
          },
          axisLabel: {
            show: false,
            fontSize: 20,
            color: "#00B6E4",
            fontStyle: "normal",
            fontWeight: "normal"
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(7, 118, 249, 0.5)"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(7, 118, 249, 0.5)"
            }
          },
          indicator
        }
      ],
      series: [
        {
          type: 'radar',
          tooltip: {
            trigger: 'item',
            position: (point: any[], params: Object|any[], dom: HTMLElement, rect: any, size: any) => {
              let obj: any = { top: 10 }
              obj[['left', 'right'][+(point[0] < size.viewSize[0] / 2)]] = 80
              return obj
            }
          },
          data: [
            {
              value: renderData,
              name: '主要污染物'
            }
          ],
          symbol: 'none',
          lineStyle: {
            normal: {
              color: 'rgba(7, 118, 249, 0.5)',
              width: 2
            }
          },
          itemStyle: {
            normal: {
              color: '#00B6E4',
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: 'rgba(2,69,228,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(0,193,228,1)'
                }
              ], false)
            }
          }
        }
      ]
    } as any)
  }
}
</script>
