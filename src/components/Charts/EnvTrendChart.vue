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
require('echarts/theme/macarons')

@Component({
  name: 'EnvTrendChart'
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
    
    const xAxisData: string[] = this.chartData.map(item => item.Name)
    
    const series: any[] = []
    this.series.forEach(item => {
      const dataArr = this.chartData.map(v => v[item.property])
      if (item.type === 'line') {
        series.push({
          name: item.name,
          type: 'line',
          stack: '总量',
          symbol: 'circle',
          symbolSize: 5,
          label: {
            show: true,
            position: 'top',
            formatter: (params: any): string => {
              return `{title|${this.chartData[params.dataIndex]['Data']}}`
            },
            rich: {
              title: {
                fontSize: 14,
                color: '#52FFFF',
                align: 'center',
                padding: [5, 0, 0, 0],
                backgroundColor: {
                  image: require('../../assets/screen_images/img-qp.png')
                },
                width: 25,
                height: 25
              }
            }
          },
          itemStyle: {
            normal: {
              color: item.color,
              lineStyle: {
                color: item.color,
                width: 2
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, item.colorList),
              }
            }
          },
          smooth: true,
          data: dataArr
        })
      }
    })

    this.chart.setOption({
      backgroundColor: 'transparent',
      grid: {
        left: '5%',
        right: '10%',
        top: '20%',
        bottom: '5%',
        containLabel: true
      },
      tooltip: {
        show: false,
        trigger: 'axis'
      },
      legend: {
        show: false,
        icon: 'stack',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
            color: '#ffffff'
        },
        data: this.series.map(item => item.name)
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          color: '#30eee9'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#397cbc'
          }
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#195384',
            opacity: 0.4
          }
        },
        data: xAxisData
      }],
      yAxis: [{
        type: 'value',
        min: 0,
        axisLabel: {
          formatter: '{value}',
          textStyle: {
              color: '#2ad1d2'
          }
        },
        axisLine: {
            lineStyle: {
                color: '#52FFFF'
            }
        },
        axisTick: {
            show: false,
        },
        splitLine: {
          show: false,
          lineStyle: {
              color: '#11366e'
          }
        }
      }],
      series
    } as EChartOption<EChartOption.SeriesLine | EChartOption.SeriesBar>)
  }
}
</script>
