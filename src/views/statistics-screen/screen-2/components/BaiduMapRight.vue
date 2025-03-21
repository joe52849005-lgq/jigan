<template>
  <div
    class="right_content"
    :style="{ height: style.height, width: style.width }"
  >
    <el-row :gutter="20" style="padding :10px">
      <el-row :gutter="20" class="item_content">
        <el-col :span="24">
          <div class="item_title">{{ getDataObj.jcdd }}</div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="item_content">
        <el-col :span="12">
          <span style="font-size:10px">经度：</span>
          <span class="item_content_span">{{ getDataObj.mapLng }}</span>
        </el-col>
        <el-col :span="12">
          <span style="font-size:10px">纬度：</span>
          <span class="item_content_span">{{ getDataObj.mapLat }}</span>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="item_content">
        <div class="item_line" />
        <el-col :span="24">实时AQI</el-col>
        <el-col :span="12">
          <div id="AQICharts" style="width:240px;height:240px" />
        </el-col>
        <el-col :span="12">
          <div v-for="item in AQInorm" :key="item.id">
            <el-row :gutter="20">
              <el-col :span="10">
                <div
                  :style="{
                    width: '100%',
                    height: '16px',
                    background: item.color,
                    'margin-top': '8px'
                  }"
                />
              </el-col>
              <el-col :span="12" style="line-height:31px">{{
                item.name
              }}</el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="item_content">
        <div class="item_line" />
        <el-col :span="24" style="margin-bottom:5px">污染物</el-col>
        <el-col
          v-for="(item, index) in pollution"
          :key="index"
          :span="7"
          class="item_content_unit"
        >
          <span style="line-height:38px;opacity:1">
            {{
              item.name === "pM25"
                ? "PM2.5"
                : item.name == "pM10"
                ? "PM10"
                : item.name == "sO2"
                ? "SO2"
                : item.name == "nO2"
                ? "NO2"
                : item.name == "co"
                ? "CO"
                : item.name == "o3"
                ? "O3"
                : item.name
            }}
          </span>

          <span
            v-if="!item.value"
            :style="{
              float: 'right',
              'font-size': '25px',
              color: item.color,
              opacity: 1
            }"
          >
            <!-- {{ item.value }} -->
            0
          </span>
          <span
            v-if="item.value"
            :style="{
              float: 'right',
              'font-size': '25px',
              color: item.color,
              opacity: 1
            }"
            >{{ item.value }}</span
          >
        </el-col>
      </el-row>

      <el-row :gutter="20" class="item_content">
        <div class="item_line" />
        <el-col :span="24" style="margin-bottom:5px">小时监控趋势</el-col>
        <div
          id="hourCharts"
          :span="24"
          style="margin-bottom:5px;height:240px;width:360px"
        />
      </el-row>

      <el-row :gutter="20" class="item_content">
        <div class="item_line" />
        <el-col :span="24" style="margin-bottom:5px">近15日空气质量</el-col>
        <div
          id="sevenCharts"
          :span="24"
          style="margin-bottom:5px;height:240px;width:360px"
        />
      </el-row>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Mock from "mockjs";
import echarts from "echarts";
import moment from "moment";
import { log } from "util";
@Component({
  name: "BdMapRight"
})
export default class extends Vue {
  @Prop({ default: () => {} }) private BaiduMapRightData!: object;
  @Watch("BaiduMapRightData", { deep: true })
  changeBaiduMapRightData(val: any) {
    this.getData(val.pointObj, val.DataObj);
  }
  style: any = {
    height: "",
    width: ""
  };
  AQIStyle: any = {
    height: "200px",
    width: ""
  };
  getDataObj: any = {};
  fullData: any = {};
  AQInorm: any[] = [
    { min: 0, max: 50, name: "优", color: "#00E400" },
    { min: 51, max: 100, name: "良", color: "#FFFF00" },
    { min: 101, max: 150, name: "轻度污染", color: "#FF7E00" },
    { min: 151, max: 200, name: "中度污染", color: "#FF0000" },
    { min: 201, max: 300, name: "重度污染", color: "#99004C" },
    { min: 301, max: 500, name: "严重污染", color: "#7E0023" }
  ];
  AQIhours: any[] = [
    { value: Mock.Random.integer(0, 500), color: "" },
    { value: Mock.Random.integer(0, 500), color: "" },
    { value: Mock.Random.integer(0, 500), color: "" },
    { value: Mock.Random.integer(0, 500), color: "" },
    { value: Mock.Random.integer(0, 500), color: "" },
    { value: Mock.Random.integer(0, 500), color: "" },
    { value: Mock.Random.integer(0, 500), color: "" }
  ];
  pollution: any[] = [
    { name: "pM25", value: "", color: "#8CCD26" },
    { name: "pM10", value: "", color: "#8CCD26" },
    { name: "sO2", value: "", color: "#8CCD26" },
    { name: "nO2", value: "", color: "#8CCD26" },
    { name: "co", value: "", color: "#8CCD26" },
    { name: "o3", value: "", color: "#8CCD26" }
  ];

  mounted() {
    this.$nextTick(() => {
      this.style.width = document.documentElement.clientWidth - 900 + "px";
      this.style.height = document.documentElement.clientHeight - 100 + "px";
      this.AQIStyle.width = document.documentElement.clientWidth - 900 + "px";
    });
    // this.getAQICharts()
  }

  getStyle(width: any, height: any) {
    this.style.height = height - 100 + "px";
    this.style.width = width - 900 + "px";
    this.AQIStyle.width = width - 900 + "px";
  }
  // 污染物数据
  pollutionData(data: any) {
    this.pollution.forEach(element => {
      Object.keys(data).forEach(item => {
        if (element.name == item) {
          element.value = data[item];
        }
      });
    });
    this.pollution.forEach(element => {
      this.AQInorm.forEach(item => {
        if (item.min <= element.value && item.max >= element.value) {
          element.color = item.color;
        }
      });
    });
  }
  // 标注传来的数据
  getData(commonObj: any, getDataObj: any) {
    this.getDataObj = commonObj;
    this.fullData = getDataObj;
    this.pollutionData(getDataObj.real);
    this.getAQICharts(commonObj.aqi);
    this.hourCharts(getDataObj.hourlyAQI);
    this.sevenCharts(getDataObj.dailyAQI);
  }
  // 实时AQI
  getAQICharts(AQI: any) {
    const data = {
      value: AQI,
      name: ""
    };
    for (let i = 0; i < this.AQInorm.length; i++) {
      if (this.AQInorm[i].min < AQI && AQI <= this.AQInorm[i].max) {
        data.name = `空气${this.AQInorm[i].name}`;
      }
    }
    this.AQICharts(data);
  }
  day: any = "";
  sevenDate(day: any) {
    this.day = day;
    const date = new Date().getTime() - 1000 * 60 * 60 * 24 * (day - 1);

    const time = moment(new Date(date)).format("MM/dd");
    return time;
  }
  // 近15日数据
  sevenCharts(dayTrend: any) {
    const AQIdata: any[] = [];
    const date: any[] = [];
    const chartsData: any[] = [];
    for (let i = 0; i < dayTrend.length; i++) {
      const aqiObj = {
        value: dayTrend[i].value === null ? 0 : dayTrend[i].value,
        time: dayTrend[i].extend
      };
      date.push(dayTrend[i].extend);
      chartsData.push(dayTrend[i].value);
      AQIdata.push(aqiObj);
    }

    const showColorData: any[] = [];
    for (let i = 0; i < AQIdata.length; i++) {
      const showColorObj: any = {};
      for (let j = 0; j < this.AQInorm.length; j++) {
        if (
          this.AQInorm[j].min <= AQIdata[i].value &&
          AQIdata[i].value <= this.AQInorm[j].max
        ) {
          AQIdata[i].color = this.AQInorm[j].color;
          showColorObj.color = AQIdata[i].color;
          showColorObj.offset = i / (AQIdata.length - 1);
        }
      }
      showColorData.push(showColorObj);
    }
    let sevenCharts: any = document.getElementById("sevenCharts");
    const myChart: any = echarts.init(sevenCharts);
    myChart.setOption(
      {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: "AQI",
          x: "left"
        },
        color: "#0080ff",
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: date,
            axisLine: {
              lineStyle: {
                color: "#2FC7D8"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#ffffff"
              }
            }
          }
        ],
        series: [
          {
            name: "AQI",
            type: "line",
            itemStyle: {
              normal: {
                lineStyle: {
                  // 系列级个性化折线样式
                  width: 5,
                  type: "solid",
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    1,
                    0,
                    showColorData
                  ) // 线条渐变色
                }
              }
            }, // 线条样式
            data: chartsData
          }
        ]
      },
      true
    );
  }
  // 小时监控趋势
  hourCharts(data: any) {
    const AQIdata = [];
    const hour = [];
    for (let i = 0; i < data.length; i++) {
      const aqiObj = {
        value: data[i].value === null ? 0 : data[i].value,
        time: moment(data[i].extend).format("YYYY-MM-DD : HH")
      };
      AQIdata.push(aqiObj);

      hour.push(moment(data[i].extend).format("YYYY-MM-DD : HH"));
    }
    const newAQIdata: any =
      AQIdata.length < 15
        ? AQIdata
        : AQIdata.slice(AQIdata.length - 15, AQIdata.length);
    const nerHour: any =
      hour.length < 15 ? hour : hour.slice(hour.length - 15, hour.length);
    const showColorData = []; // 颜色数据
    const showData = []; // 要展示的数据
    for (let i = 0; i < newAQIdata.length; i++) {
      // const element = array[i];
      const showColorObj: any = {};
      for (let j = 0; j < this.AQInorm.length; j++) {
        if (
          this.AQInorm[j].min <= newAQIdata[i].value &&
          newAQIdata[i].value <= this.AQInorm[j].max
        ) {
          newAQIdata[i].color = this.AQInorm[j].color;
          showColorObj.color = this.AQInorm[j].color;
          showColorObj.offset = i / (newAQIdata.length - 1);
        }
      }
      showColorData.push(showColorObj);
      showData.push(AQIdata[i].value);
    }
    let hourCharts: any = document.getElementById("hourCharts");
    const myChart: any = echarts.init(hourCharts);
    myChart.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      },
      legend: {
        data: "AQI",
        x: "left"
      },
      color: "#0080ff",
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: nerHour,
          axisLine: {
            lineStyle: {
              color: "#2FC7D8"
            }
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#ffffff"
            }
          }
        }
      ],
      series: [
        {
          name: "AQI",
          type: "line",
          itemStyle: {
            normal: {
              lineStyle: {
                // 系列级个性化折线样式
                width: 5,
                type: "solid",
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  showColorData
                ) // 线条渐变色
              }
            }
          }, // 线条样式
          data: showData
        }
      ]
    });
  }
  AQICharts(data: any) {
    const AQIColorData = [];
    let AQICharts: any = document.getElementById("AQICharts");
    const myChart: any = echarts.init(AQICharts);
    myChart.setOption({
      tooltip: {
        formatter: "{a} <br/>{c} {b}"
      },
      toolbox: {
        show: true,
        feature: {
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
        {
          name: "速度",
          type: "gauge",
          z: 3,
          min: 0,
          max: 500,
          center: ["40%", "50%"], // 默认全局居中
          radius: "50%",
          // eslint-disable-next-line no-dupe-keys
          splitNumber: 10, // 仪表盘刻度的分割段数,默认 10。

          axisLine: {
            // 坐标轴线
            lineStyle: {
              // 属性lineStyle控制线条样式
              width: 10,
              shadowColor: "#000",
              shadowBlur: 0,
              color: [
                [1 / 10, "#00E400"],
                [2 / 10, "#FFFF00"],
                [3 / 10, "#FF7E00"],
                [4 / 10, "#FF0000"],
                [6 / 10, "#99004C"],
                [1, "#7E0023"]
              ]
            }
          },
          axisTick: {
            show: false,
            // 坐标轴小标记
            length: 15, // 属性length控制线长
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: "auto"
            }
          },
          splitLine: {
            // 分隔线
            length: 20, // 属性length控制线长
            lineStyle: {
              // 属性lineStyle（详见lineStyle）控制线条样式
              color: "auto"
            }
          },
          // 刻度标签。
          axisLabel: {
            distance: -42,
            color: "#ffffff"
          },
          title: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontWeight: "bolder",
            fontSize: 15,
            // 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
            offsetCenter: [0, "40%"],
            color: "#ffffff"
          },
          detail: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            offsetCenter: [0, "-30%"],
            fontWeight: "bolder",
            fontFamily: "Arial",
            color: "#ffffff"
          },
          data: [data]
        }
      ]
    });
  }
}
</script>

<style scoped>
.right_content {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url("../../../../assets/screen_images/img-bg01.2e383400.png");

  /* background-image: url(/img/img-bg01.2e383400.png); */
  /* opacity: 0.8; */
  width: 200px;
  z-index: 5;
  float: right;
  margin: 30px;
  max-width: 420px;
  padding: 0 15px;
  overflow: hidden;
  overflow-y: auto;
}
/*滚动条样式*/
.right_content::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
  background: rgba(0, 0, 0, 0.2);
}

.right_content::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 6px;
  background: #1244a6;
}
.right_content::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.item_content {
  padding-top: 10px;
}
.item_content_span {
  font-size: 14px;
  color: #00ecfc;
  font-weight: bold;
}
.item_title {
  font-size: 18px;
  font-weight: bold;
  color: #00ecfc;
  /* font-size: 18px;
    font-weight: bold;
    background-image: -webkit-linear-gradient(top, #f7ce78, #ffb14e);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; */
}
.item_line {
  border-top: 2px #0060ff solid;
  margin: 10px;
  opacity: 0.52;
}
.item_content_unit {
  background: rgba(4, 17, 42, 1);
  opacity: 0.8;
  margin: 7px;
  padding: 2px;
}
@media screen and (max-width: 1366px) {
  .right_content {
    font-size: 14px;
  }
}
</style>
