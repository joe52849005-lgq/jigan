<template>
  <div
    :id="id"
    :class="className"
    :style="{height: height, width: width}"
  />
</template>

<script lang="ts">
/* eslint-disable */
// https://gallery.echartsjs.com/editor.html?c=x-kEU4uvs
import echarts, { EChartOption } from 'echarts'
import 'echarts-liquidfill'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from './mixins/resize'
require('echarts/theme/macarons')

@Component({
  name: 'CoverageChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: 'chart' }) private id!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '200px' }) private height!: string
  @Prop({ default: () => [] }) private chartData!: any
  @Prop() private axis!: any
  @Prop({ default: () => [] }) private series!: any[]

  private data = [this.chartData, this.chartData, this.chartData, ]

  private option = {
      backgroundColor: 'transparent',
      title: [{
        show: false
      }],
      series: [{
        type: 'liquidFill',
        // color: [new echarts.graphic.LinearGradient(
        //     0, 0, 0, 1,
        //     [{
        //             offset: 0,
        //             color: '#4DBEFF'
        //         },
        //         {
        //             offset: 1,
        //             color: '#0E3093'
        //         },
        //     ]
        // )],
        color: ['#0E3093'],
        radius: '95%',
        shape: 'circle',
        center: ['50%', '50%'],
        data: this.data,
        backgroundStyle: { // 内图 背景色 边
            color: 'transparent'
        },
        outline: {
            show: true,
            borderDistance: 0, //边框距离
            itemStyle: {
                borderWidth: 3,
                borderColor: '#2985FF',
            }
        },
        label: {
            normal: {
                color: '#fff',
                insideColor: '#fff',
                fontSize: 35
            }
        }
    }]
    }

  @Watch('chartData')
  onChartDataChange(value: number) {
    this.data = [value, value, value, ]
    this.option = {
      ...this.option,
      series: [{
        type: 'liquidFill',
        color: ['#0E3093'],
        radius: '95%',
        shape: 'circle',
        center: ['50%', '50%'],
        data: this.data,
        backgroundStyle: { // 内图 背景色 边
            color: 'transparent'
        },
        outline: {
            show: true,
            borderDistance: 0, //边框距离
            itemStyle: {
                borderWidth: 3,
                borderColor: '#2985FF',
            }
        },
        label: {
            normal: {
                color: '#fff',
                insideColor: '#fff',
                fontSize: 35
            }
        }
    }]
    }
    this.initChart()
  }

  mounted() {
    this.chart = echarts.init(document.getElementById(this.id) as HTMLDivElement)
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
    (this.chart as any).setOption(this.option)
  }
}
</script>
