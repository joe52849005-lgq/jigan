<template>
  <div
    class="right_content"
    :style="{ height: style.height, width: style.width }"
  >
    <el-row :gutter="20" style="padding :10px">
      <el-row :gutter="20" class="item_content">
        <el-col :span="24">
          <div class="item_title">{{ getDataObj.pointName }}</div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="item_content">
        <el-col :span="12">
          <span style="font-size:10px">经度：</span>
          <span class="item_content_span">{{ getDataObj.mapJd }}</span>
        </el-col>
        <el-col :span="12">
          <span style="font-size:10px">纬度：</span>
          <span class="item_content_span">{{ getDataObj.mapWd }}</span>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="item_content">
        <div class="item_line" />
        <el-col :span="24">
          <div>
            <el-col :span="24" style="padding:10px 0">实时警报</el-col>
            <div>
              <el-col :span="8" style="text-align:center">
                <div class="circle_one">
                  <div class="circle_one_txt">
                    {{ rightData.dayWarningCount }}
                  </div>
                </div>
                <div style="margin:10px 0;color:#00E5FF">今日</div>
              </el-col>
              <el-col :span="8" style="text-align:center">
                <div class="circle_two">
                  <div class="circle_two_txt">
                    {{ rightData.weekWarningCount }}
                  </div>
                </div>
                <div style="margin:10px 0;color:#44FB5C">本周</div>
              </el-col>

              <el-col :span="8" style="text-align:center">
                <div class="circle_three">
                  <div class="circle_three_txt">
                    {{ rightData.monthWarningCount }}
                  </div>
                </div>
                <div style="margin:10px 0;color:#E4E638">本月</div>
              </el-col>
            </div>
          </div>

          <div>
            <el-col :span="24" style="padding:10px 0">已处理</el-col>
            <div>
              <el-col :span="8" style="text-align:center">
                <div class="circle_one">
                  <div class="circle_one_txt">
                    {{ rightData.dayWarningSolvegetCount }}
                  </div>
                </div>
                <div style="margin:10px 0;color:#00E5FF">今日</div>
              </el-col>
              <el-col :span="8" style="text-align:center">
                <div class="circle_two">
                  <div class="circle_two_txt">
                    {{ rightData.weekWarningSolvegetCount }}
                  </div>
                </div>
                <div style="margin:10px 0;color:#44FB5C">本周</div>
              </el-col>

              <el-col :span="8" style="text-align:center">
                <div class="circle_three">
                  <div class="circle_three_txt">
                    {{ rightData.monthWarningSolvegetCount }}
                  </div>
                </div>
                <div style="margin:10px 0;color:#E4E638">本月</div>
              </el-col>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="item_content">
        <div class="item_line" />
        <el-col :span="7">违规图片</el-col>
        <el-col :span="17" class="tabs-burning" style="margin-bottom:5px">
          <div
            class="tab-burning"
            :class="{ active: burnActive === 'day' }"
            @click="handleImgChange('day')"
          >
            <span class="tab-burning__text">本日</span>
          </div>
          <div
            class="tab-burning"
            :class="{ active: burnActive === 'week' }"
            @click="handleImgChange('week')"
          >
            <span class="tab-burning__text">本周</span>
          </div>
          <div
            class="tab-burning"
            :class="{ active: burnActive === 'month' }"
            @click="handleImgChange('month')"
          >
            <span class="tab-burning__text">本月</span>
          </div>
        </el-col>
        <div style="max-height:145px;overflow-y:auto;width:100%;">
          <el-col v-for="item in imgList" :key="item.id" :span="8" class>
            <el-image
              style="width: 100%; height: 100%;margin-top:5px;"
              :src="item"
              fit="contain"
              :preview-src-list="imgList"
            />
          </el-col>
        </div>
      </el-row>

      <el-row :gutter="20" class="item_content">
        <div class="item_line" />
        <el-col :span="24" style="margin-bottom:5px">近十五日火点趋势</el-col>
        <div
          id="myChart"
          :span="24"
          style="margin-bottom:5px;height:250px;width:100%;margin-top:5px;top:40px"
        />
      </el-row>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import echarts from "echarts";
import axios from "axios";
import moment from "moment";

@Component({
  name: "BdMapJian"
})
export default class extends Vue {
  @Prop({ default: () => {} }) private BaiduMapJianData!: object;

  style: any = {
    height: "",
    width: ""
  };
  AQIStyle: any = {
    height: "200px",
    width: ""
  };
  getDataObj: any = {};
  rightData: any = {};
  imgList: any[] = [];
  trend: any[] = [];
  burnActive: any = "day";
  pointCode: any = "";
  @Watch("BaiduMapJianData", { deep: true })
  changeBaiduMapJianData(val: any) {
    this.pointCode = val.DataObj.pointCode;
    this.handleImgChange("day");
    this.getData(val.pointObj, val.DataObj);
  }
  mounted() {
    this.$nextTick(() => {
      this.style.width = document.documentElement.clientWidth - 900 + "px";
      this.style.height = document.documentElement.clientHeight - 100 + "px";
      this.AQIStyle.width = document.documentElement.clientWidth - 900 + "px";
    });
  }
  getStyle(width: any, height: any) {
    this.style.height = height - 100 + "px";
    this.style.width = width - 900 + "px";
    this.AQIStyle.width = width - 900 + "px";
  }
  handleImgChange(value: any) {
    let pointCode = this.pointCode;
    this.burnActive = value;
    let type = value == "day" ? 1 : value == "week" ? 2 : 3;
    this.imgList = [];
    axios
      .get("/api/warningmessage/getpointwarningimgsbytype", {
        params: { type, pointCode }
      })
      .then(res => {
        this.imgList = res.data;
      });
  }
  // 标注传来的数据
  getData(data: any, getDataObj: any) {
    const time = [];
    const doneData = [];
    const warnData = [];
    this.rightData = getDataObj.warningStatistics;
    this.getDataObj = data;
    // this.imgList = getDataObj.warningImgs;
    this.trend = getDataObj.warningTrend;
    if (this.trend.length === 0) {
      const date: any = new Array(15);
      date.map((item: any, index: any) => {
        return {
          date: this.sevenDate(index + 1),
          warningSolvegetCount: 0,
          warningCount: 0
        };
      });
      this.$nextTick(() => {
        this.hourCharts(date);
      });
    } else {
      const date: any = [];
      for (let j = 0; j < 15; j++) {
        date.push({
          date: this.sevenDate(j + 1),
          warningSolvegetCount: 0,
          warningCount: 0
        });
      }

      const trend = [];
      for (let j = 0; j < this.trend.length; j++) {
        trend.push({
          date: moment(new Date(this.trend[j].date)).format("MM月DD日"),
          warningSolvegetCount: this.trend[j].warningSolvegetCount,
          warningCount: this.trend[j].warningCount
        });
      }
      for (const j in date) {
        for (const k in trend) {
          if (date[j].date === trend[k].date) {
            date[j].warningSolvegetCount += trend[k].warningSolvegetCount;
            date[j].warningCount += trend[k].warningCount;
          }
        }
      }
      this.$nextTick(() => {
        this.hourCharts(date);
      });
    }
  }
  day: any;
  sevenDate(day: any) {
    this.day = day;
    const date = new Date().getTime() - 1000 * 60 * 60 * 24 * (day - 1);
    const time = moment(new Date(date)).format("MM月DD日");
    return time;
  }
  // 小时监控趋势
  hourCharts(data: any[]) {
    const newData = data.reverse();
    const time = [];
    const doneData = [];
    const warnData = [];
    for (let i = 0; i < newData.length; i++) {
      time.push(newData[i].date);
      doneData.push(newData[i].warningSolvegetCount);
      warnData.push(newData[i].warningCount);
    }
    let hourCharts: any = document.getElementById("myChart");
    const myChart: any = echarts.init(hourCharts);
    let option: any = {
      tooltip: {
        trigger: "axis"
      },
      legend: {
        //   color: ['#ffffff', '#ffffff'],
        data: ["处理总数", "火点总数"],
        textStyle: {
          // 图例文字的样式
          color: "#fff"
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: time,
        axisLine: {
          lineStyle: {
            color: "#2FC7D8"
          }
        }
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#ffffff"
          }
        }
      },
      series: [
        {
          name: "处理总数",
          type: "line",
          stack: "数量",
          data: doneData,
          itemStyle: {
            normal: {
              lineStyle: {
                // 系列级个性化折线样式
                width: 3,
                type: "solid",
                color: "#41FDFF"
              },
              color: "#41FDFF"
            }
          } // 线条样式
        },
        {
          name: "火点总数",
          type: "line",
          stack: "数量",
          data: warnData,
          itemStyle: {
            normal: {
              color: "#527FFF",
              lineStyle: {
                // 系列级个性化折线样式
                width: 3,
                type: "solid",
                color: "#527FFF"
              }
            }
          } // 线条样式
        }
      ]
    };
    myChart.setOption(option, true);
  }
}
</script>

<style scoped lang="scss">
.right_content {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url("../../../../assets/screen_images/img-bg01.2e383400.png");

  /* opacity: 0.8; */
  width: 200px;
  z-index: 5;
  float: right;
  margin: 30px;
  max-width: 420px;
  padding: 0 15px;
  overflow: hidden;
  overflow-y: auto;
  .tabs-burning {
    position: relative;
    display: flex;
    width: 170px;
    height: 25px;
    background-color: #033555;
    padding: 0 !important;
  }

  .tab-burning {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 0 4px;
    font-size: 14px;
    cursor: pointer;
    color: #fff;
  }
  .active {
    background-color: #3399ff;
  }
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
  // font-size: 18px;
  // font-weight: bold;
  // background-image: -webkit-linear-gradient(top, #f7ce78, #ffb14e);
  // background-clip: text;
  // -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
}
.el-image-viewer__wrapper {
  position: fixed;
  top: 10%;
  left: 10%;
  bottom: 10%;
  right: 10%;
  padding: 50px;
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
.circle_one {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  position: relative;
  box-shadow: 0px -7px 10px 0px #00e5ff inset;
  border-radius: 50%;
  position: relative;
}
.circle_one_txt {
  color: #00e5ff;
  font-size: 40px;
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%);
}

.circle_two {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  position: relative;
  box-shadow: 0px -7px 10px 0px #44fb5c inset;
  border-radius: 50%;
  position: relative;
}
.circle_two_txt {
  color: #44fb5c;
  font-size: 40px;
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%);
}

.circle_three {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  position: relative;
  box-shadow: 0px -7px 10px 0px #e4e638 inset;
  border-radius: 50%;
  position: relative;
}
.circle_three_txt {
  color: #e4e638;
  font-size: 40px;
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%);
}
@media screen and (max-width: 1366px) {
  .right_content {
    font-size: 10px;
  }
}
</style>
