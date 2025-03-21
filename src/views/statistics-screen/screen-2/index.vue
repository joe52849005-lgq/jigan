<template>
  <div class="statistics-screen-2" :style="{ width: '100%' }">
    <el-row :gutter="20" style="z-index: 5; height: calc(100vh - 74.2px);">
      <el-col :span="6">
        <div class="statistics-frame selectWrap">
          <div class="statistics-frame__title">
            <span>选择地图</span>
          </div>
          <div class="statistics-frame__content">
            <el-row :gutter="20">
              <el-col :span="6" class="contentName">
                <span style=" ">地市</span>
              </el-col>
              <el-col :span="16" style="padding-left:0;">
                <el-select
                  v-model="regionCode"
                  clearable
                  placeholder="请选择"
                  style="width:100%;height:25px;"
                  @change="regionCodeChange"
                >
                  <el-option
                    v-for="item in cityCodeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-top:10px">
              <el-col :span="6" class="contentName">
                <span style=" ">监控类型</span>
              </el-col>
              <el-col :span="16" style="padding-left:0">
                <el-select
                  v-model="monitoring"
                  clearable
                  placeholder="请选择监控点"
                  style="width:100%"
                >
                  <el-option label="全部" value="1" />
                  <el-option label="秸秆燃烧监控点" value="2" />
                  <el-option label="空气监测站点-国控点" value="3" />
                  <el-option label="遥感火点" value="4" />
                </el-select>
              </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-top:10px">
              <el-col :span="6" class="contentName">
                <span style=" ">监控点</span>
              </el-col>
              <el-col :span="16" style="padding-left:0">
                <el-input
                  v-model="searchName"
                  style="width:100%"
                  placeholder="请输入监控点名称"
                />
              </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-top:5px">
              <el-col :span="12" :offset="6">
                <el-button
                  class="btn"
                  style="color: #00b1d6;
    background: rgba(0, 177, 214, 0.18);
    border: 1px solid #00b1d6;"
                  @click="search()"
                  >搜索</el-button
                >

                <el-button
                  class="btn"
                  style="color: #00b1d6;
    background: rgba(0, 177, 214, 0.18);
    border: 1px solid #00b1d6;"
                  @click="clear()"
                  >重置</el-button
                >
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="statistics-frame">
          <div class="statistics-frame__title">实时火点信息</div>
          <div class="statistics-frame__content warnInfoContent">
            <div class="warnInfo">
              <div class="number">序号</div>
              <div class="time">发生时间</div>
              <div class="point_name">地点</div>
            </div>
            <div style="overflow:hidden;">
              <vue-seamless-scroll
                :data="mockData"
                :class-option="classOption"
                class="seamless-warp"
              >
                <div
                  class="warnInfo"
                  v-for="item in mockData"
                  :key="item.number"
                >
                  <div class="number">{{ item.number }}</div>
                  <div class="time">{{ item.crateTimeLabel }}</div>
                  <div class="point_name" :title="item.pointName">
                    {{ item.cityName + item.pointName }}
                  </div>
                </div>
              </vue-seamless-scroll>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-background="rgba(0, 0, 0, 0.6)"
          style="width: 100vw; height: 100vh; position:absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
          :style="{ display: loading ? 'block' : 'none' }"
        />
        <!-- <div
          id="div1"
          :style="style"
                />-->
      </el-col>
      <BaiduMap ref="baiduMap" :regionCode="regionCode" />
    </el-row>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Vue, Prop } from "vue-property-decorator";
import BaiduMap from "./components/BaiduMap.vue";
import axios from "axios";
@Component({
  name: "BdMap",
  components: { BaiduMap }
})
export default class extends Vue {
  @Prop({ default: () => {} }) private mapData!: any; //统计大屏tab中的地图点击跳转数据
  mockData: any[] = []; //实时警告信息数据
  monitoring: any = "1"; //监控类型
  cityCodeList: any = ""; //地市下拉
  regionCode: any = "";
  regionName: any = "";
  searchName: any = ""; //监控点名称
  searchGuoList: any = [];
  searchJianList: any = [];
  classOption: any = {
    step: 0.5, // 数值越大速度滚动越快
    limitMoveNum: 17, // 开始无缝滚动的数据量 this.dataList.length
    hoverStop: true, // 是否开启鼠标悬停stop
    direction: 1, // 0向下 1向上 2向左 3向右
    openWatch: true, // 开启数据实时监控刷新dom
    singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
    singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
    waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
  };
  created() {
    if (this.mapData) {
      this.regionCode = this.mapData.city_code;
      this.regionName = this.mapData.name;
    } else {
      this.regionCode = "";
      this.regionName = "";
    }
  }

  mounted() {
    let clientWidth = document.documentElement.clientWidth;
    this.classOption.limitMoveNum = clientWidth > 1366 ? 17 : 10;
    this.cityCode();
    this.tableData();
    // this.search();
  }
  regionCodeChange(regionCode: any) {
    let obj: any = {};
    obj = this.cityCodeList.find((item: any) => {
      return item.value === regionCode; // 筛选出匹配数据
    });
    this.regionCode = regionCode;
    this.regionName = obj.label;
  }

  // 获取实时火点
  tableData() {
    this.mockData = [];
    axios
      .get("/api/warningmessage/todaywarning", {
        params: {
          cityCode: this.regionCode,
          pointName: this.regionName
        }
      })
      .then((res: any) => {
        if (res.code === 0) {
          if (Array(res.data)) {
            this.mockData = res.data;
            for (let i = 0; i < this.mockData.length; i++) {
              this.mockData[i].number = i + 1;
            }
            this.mockData.reverse();
          } else {
            console.log("实时火点信息 没有数据");
          }
        }
      })
      .catch(function(error) {
        // 请求失败处理
        console.log(error);
      });
  }
  loading: boolean = false;
  async search() {
    this.tableData();
    this.loading = true;
    if (this.monitoring === "1") {
      Promise.all([
        this.guokongPoint(this.regionCode),
        this.jiankongPoint(this.regionCode)
      ])
        .then(([guo, jian]) => {
          this.searchGuoList = guo.data;
          this.searchJianList = jian.data;
          let map: any = this.$refs.baiduMap;
          map.search(
            true,
            this.monitoring,
            this.regionName,
            this.searchGuoList,
            this.searchJianList,
            this.searchName
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }
    if (this.monitoring === "2") {
      await Promise.all([this.jiankongPoint(this.regionCode)])
        .then(([jian]) => {
          this.searchJianList = jian.data;
          let map: any = this.$refs.baiduMap;
          map.search(
            this.monitoring,
            this.regionName,
            this.searchGuoList,
            this.searchJianList,
            this.searchName
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }
    if (this.monitoring === "3") {
      await Promise.all([this.guokongPoint(this.regionCode)])
        .then(([guo]) => {
          this.searchGuoList = guo.data;
          let map: any = this.$refs.baiduMap;
          map.search(
            this.monitoring,
            this.regionName,
            this.searchGuoList,
            this.searchJianList,
            this.searchName
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }

    // setTimeout(() => {
    //   let map: any = this.$refs.baiduMap;
    //   map.search(
    //     this.monitoring,
    //     this.regionName,
    //     this.searchGuoList,
    //     this.searchJianList,
    //     this.searchName
    //   );
    //   this.loading = false;
    // }, 1300);
  }
  clear() {
    if (this.mapData) {
      this.regionCode = this.mapData.city_code;
      this.regionName = this.mapData.name;
    } else {
      this.regionCode = "";
      this.regionName = "";
    }
    this.monitoring = "1";
    this.cityCode();
    this.tableData();
  }
  guokongPoint(regionCode: any) {
    // 国控点
    const temp =
      regionCode == "undefined" || regionCode == null ? "" : regionCode;
    return axios.get("/api/gxenvironment/getenvstationmappoints", {
      params: { CityCode: regionCode }
    });
    // .then(res => {
    //   this.searchGuoList = res.data;
    // });
  }
  jiankongPoint(regionCode: any) {
    // 监控点
    const temp =
      regionCode == "undefined" || regionCode == null ? "" : regionCode;
    return axios.get("/api/monitorypoint/getmappoints", {
      params: { cityCode: regionCode }
    });
    // .then((res: any) => {
    //   this.searchJianList = res.data;
    // });
  }
  // 城市编码
  cityCode() {
    axios
      .get("/api/area/optionsbyspecificlevel", { params: { Level: 2 } })
      .then((res: any) => {
        if (res && res.code === 0) {
          this.cityCodeList = res.data;
          this.search();
        }
      });
  }
}
</script>

<style lang="scss">
@import "../../../styles/statistics-screen.scss";
@media screen and (min-width: 1366px) {
  .statistics-screen-2 {
    height: calc(100vh - 74.2px);
    .selectWrap {
      height: 250px;
    }
    .warnInfoContent {
      height: 550px;
    }
    .statistics-frame {
      width: 100% !important;
      position: relative;
      margin: 12px;
      overflow: hidden;
      max-width: 420px;
      min-width: 350px;
      @include background-setting(
        "../../../assets/screen_images/img-bg01.2e383400.png",
        625px,
        322px
      );
      height: calc((100vh - 74.2px - 12px) / 2);

      &--big {
        @include background-setting(
          "../../../assets/screen_images/img-bg01.2e383400.png",
          625px,
          322px
        );
      }

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background: rgba(0, 0, 0, 0.2);
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #1244a6;
      }

      &::-webkit-scrollbar-track {
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
      }

      &::-webkit-scrollbar-corner {
        background: none;
      }

      &__title {
        position: absolute;
        top: 6px;
        left: 12px;
        font-size: 18px;
        font-weight: bold;
        color: #00ecfc;
        // font-size: 18px;
        // font-weight: bold;
        // background-image: -webkit-linear-gradient(top, #f7ce78, #ffb14e);
        // -webkit-background-clip: text;
        // background-clip: text;
        // -webkit-text-fill-color: transparent;
      }
      .warnInfo {
        display: flex;
        line-height: 30px;
        text-align: left;
        color: #fff;
        opacity: 0.8;
        .number {
          width: 50px;
        }
        .time {
          width: 160px;
        }
        .point_name {
          width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      &__content {
        margin-top: 42px;
        padding: 12px;
        .contentName {
          margin: 0 0 0 10px;
          text-align: center;
          line-height: 34px;
          border: 1px solid rgba(0, 177, 214, 1);
          background: rgba(0, 177, 214, 0.18);
          color: #00b1d6;
          border-radius: 4px;
        }
        .tabs-burning {
          position: relative;
          display: flex;
          width: 170px;
          height: 25px;
          background-color: #033555;
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

          &--active {
            background-color: #3399ff;
          }
        }

        .burning-data-list {
          padding: 12px;
          padding-right: 84px;

          .el-row:not(:last-child) {
            margin-bottom: 38px;
          }
        }

        .burning-data-item {
          font-size: 14px;
          line-height: 27px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .burning-data-number {
          font-size: 24px;

          &.red {
            color: #e22547;
          }

          &.blue {
            color: #42b9fd;
          }

          &.green {
            color: #25e268;
          }

          &.yellow {
            color: #d3d531;
          }
        }

        .el-table {
          background: transparent;
          color: #fff;
          opacity: 0.8;

          thead {
            color: #fff;
            font-weight: 400;

            th,
            td {
              border-bottom: 0;
            }
          }

          tr,
          th,
          &::before {
            background: transparent;
          }

          td {
            border-bottom: 1px solid rgba(14, 230, 251, 0.2);
          }
        }

        .el-table__header-wrapper {
          margin-bottom: 22px;
        }

        .el-table__header {
          background: rgba(0, 96, 255, 0.2);
        }

        .el-table--enable-row-hover .el-table__body tr:hover > td {
          background: transparent;
        }

        .realtime-alert-status {
          color: #15b5ff;
        }
      }
    }
  }
}
@media screen and (max-width: 1366px) {
  .statistics-screen-2 {
    height: calc(100vh - 74.2px);
    .selectWrap {
      height: 200px;
    }
    .warnInfoContent {
      height: 340px;
    }
    .statistics-frame {
      width: 100% !important;
      position: relative;
      margin: 12px;
      overflow: hidden;
      max-width: 420px;
      min-width: 350px;
      @include background-setting(
        "../../../assets/screen_images/img-bg01.png",
        625px,
        322px
      );
      height: calc((100% / 3) - 12px);

      &--big {
        @include background-setting(
          "../../../assets/screen_images/img-bg01.png",
          625px,
          322px
        );
      }

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background: rgba(0, 0, 0, 0.2);
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #1244a6;
      }

      &::-webkit-scrollbar-track {
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
      }

      &::-webkit-scrollbar-corner {
        background: none;
      }

      &__title {
        position: absolute;
        top: 6px;
        left: 12px;
        font-size: 15px;
        font-weight: bold;
        background-image: -webkit-linear-gradient(top, #f7ce78, #ffb14e);
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .warnInfo {
        display: flex;
        line-height: 30px;
        text-align: left;
        color: #fff;
        opacity: 0.8;
        .number {
          width: 50px;
        }
        .time {
          width: 130px;
        }
        .point_name {
          width: 190px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      &__content {
        margin-top: 12px;
        padding: 12px;
        font-size: 10px;
        .contentName {
          margin: 0 0 0 10px;
          text-align: center;
          line-height: 24px;
          border: 1px solid rgba(0, 177, 214, 1);
          background: rgba(0, 177, 214, 0.18);
          color: #00b1d6;
          border-radius: 4px;
        }
        .tabs-burning {
          position: relative;
          display: flex;
          width: 170px;
          height: 25px;
          background-color: #033555;
        }

        .tab-burning {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          padding: 0 4px;
          font-size: 10px;
          cursor: pointer;
          color: #fff;

          &--active {
            background-color: #3399ff;
          }
        }

        .burning-data-list {
          padding: 12px;
          padding-right: 84px;

          .el-row:not(:last-child) {
            margin-bottom: 38px;
          }
        }

        .burning-data-item {
          font-size: 14px;
          line-height: 27px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .burning-data-number {
          font-size: 24px;

          &.red {
            color: #e22547;
          }

          &.blue {
            color: #42b9fd;
          }

          &.green {
            color: #25e268;
          }

          &.yellow {
            color: #d3d531;
          }
        }

        .el-table {
          background: transparent;
          color: #fff;
          opacity: 0.8;

          thead {
            color: #fff;
            font-weight: 400;

            th,
            td {
              border-bottom: 0;
            }
          }

          tr,
          th,
          &::before {
            background: transparent;
          }

          td {
            border-bottom: 1px solid rgba(14, 230, 251, 0.2);
          }
        }

        .el-table__header-wrapper {
          margin-bottom: 22px;
        }

        .el-table__header {
          background: rgba(0, 96, 255, 0.2);
        }

        .el-table--enable-row-hover .el-table__body tr:hover > td {
          background: transparent;
        }

        .realtime-alert-status {
          color: #15b5ff;
        }
      }
    }
  }
  .el-input--medium .el-input__inner {
    height: 27px;
    font-size: 12px;
  }
  .btn {
    height: 27px;
    line-height: 7px;
    margin-top: 15px;
    font-size: 12px;
    padding: 0px 22px;
  }
  .el-table {
    font-size: 10px;
  }
}
.el-input-group__append,
.el-input-group__prepend {
  color: #00b1d6;
  background: rgba(0, 177, 214, 0.18);
  border: 1px solid rgba(0, 177, 214, 1);
}

.el-input__inner {
  border: 1px solid rgba(0, 177, 214, 1);
  // background: rgba(255, 255, 255, 0);
  background: rgba(0, 177, 214, 0.18);
  color: #fff;
}

.statistics-screen-2 .statistics-frame__content .el-table thead {
  display: none;
}

.statistics-screen-2 .el-loading-text {
  color: #fff;
}

.statistics-screen-2 .el-loading-spinner .path {
  stroke: #fff;
}

.bm-view {
  width: 100%;
  height: 300px;
}

/*滚动条样式*/
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
  background: rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 6px;
  background: #1244a6;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>
