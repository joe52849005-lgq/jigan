<template>
  <!-- eslint-disable -->
  <div class="split-screen-1">
    <div
      class="statistics-frame statistics-frame--big"
      style="height: calc((100vh - 74.2px) / 2)"
    >
      <div class="statistics-frame__title">火点统计</div>
      <div class="statistics-frame__content">
        <div class="tabs-burning">
          <div
            class="tab-burning"
            :class="{ 'tab-burning--active': burnActive === 'day' }"
            @click="handleBurningChange('day')"
            @mouseenter="clearInt(0, 'day')"
            @mouseleave="init"
          >
            <span class="tab-burning__text">本日</span>
          </div>
          <div
            class="tab-burning"
            :class="{ 'tab-burning--active': burnActive === 'week' }"
            @click="handleBurningChange('week')"
            @mouseenter="clearInt(1, 'week')"
            @mouseleave="init"
          >
            <span class="tab-burning__text">本周</span>
          </div>
          <div
            class="tab-burning"
            :class="{ 'tab-burning--active': burnActive === 'month' }"
            @click="handleBurningChange('month')"
            @mouseenter="clearInt(2, 'month')"
            @mouseleave="init"
          >
            <span class="tab-burning__text">本月</span>
          </div>
        </div>
        <div class="burning-data-list">
          <el-row class="burning-data-list-title">
            <el-col :span="9">
              <span
                class="burning-data-item"
                style="display: inline-block; height: 17px;"
              />
            </el-col>
            <el-col :span="5">
              <span
                class="burning-data-item"
                style="display: inline-block; height: 17px;"
              />
            </el-col>
            <el-col :span="5">
              <span class="burning-data-item">同比</span>
            </el-col>
            <el-col :span="5">
              <span class="burning-data-item">环比</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">
              <span
                class="burning-data-item"
                style="justify-content: flex-start;"
                >火点总数(个):</span
              >
            </el-col>
            <el-col :span="5">
              <span class="burning-data-item">
                <span class="burning-data-number yellow">{{
                  compare.warnTotal
                }}</span>
              </span>
            </el-col>
            <el-col :span="5">
              <span class="burning-data-item">
                <span
                  :class="[
                    'burning-data-number',
                    compare.warnTb > 0 ? 'green' : 'red'
                  ]"
                  >{{
                    compare.warnTb || compare.warnTb == 0
                      ? `${compare.warnTb}%`
                      : "-"
                  }}</span
                >
              </span>
            </el-col>
            <el-col :span="5">
              <span class="burning-data-item">
                <span
                  :class="[
                    'burning-data-number',
                    compare.warnHb > 0 ? 'green' : 'red'
                  ]"
                  >{{
                    compare.warnHb || compare.warnHb == 0
                      ? `${compare.warnHb}%`
                      : "-"
                  }}</span
                >
              </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">
              <span
                class="burning-data-item"
                style="justify-content: flex-start; width: 100px;"
                >已处理总数(个):</span
              >
            </el-col>
            <el-col :span="5">
              <span class="burning-data-item">
                <span class="burning-data-number yellow">{{
                  compare.doneTotal
                }}</span>
              </span>
            </el-col>
            <el-col :span="5">
              <span class="burning-data-item">
                <span
                  :class="[
                    'burning-data-number',
                    compare.doneTb > 0 ? 'green' : 'red'
                  ]"
                  >{{
                    compare.doneTb || compare.doneTb == 0
                      ? `${compare.doneTb}%`
                      : "-"
                  }}</span
                >
              </span>
            </el-col>
            <el-col :span="5">
              <span class="burning-data-item">
                <span
                  :class="[
                    'burning-data-number',
                    compare.doneHb > 0 ? 'green' : 'red'
                  ]"
                  >{{
                    compare.doneHb || compare.doneHb == 0
                      ? `${compare.doneHb}%`
                      : "-"
                  }}</span
                >
              </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">
              <span
                class="burning-data-item"
                style="justify-content: flex-start; width: 105px;"
                >火点处理及时率:</span
              >
            </el-col>
            <el-col :span="5">
              <span class="burning-data-item">
                <span class="burning-data-number yellow">{{
                  compare.timelyTotal || compare.timelyTotal == 0
                    ? `${compare.timelyTotal}%`
                    : 0
                }}</span>
              </span>
            </el-col>
            <el-col :span="5">
              <span class="burning-data-item">
                <span
                  :class="[
                    'burning-data-number',
                    compare.timelyTb > 0 ? 'green' : 'red'
                  ]"
                  >{{
                    compare.timelyTb || compare.timelyTb == 0
                      ? `${compare.timelyTb}%`
                      : "-"
                  }}</span
                >
              </span>
            </el-col>
            <el-col :span="5">
              <span class="burning-data-item">
                <span
                  :class="[
                    'burning-data-number',
                    compare.timelyHb > 0 ? 'green' : 'red'
                  ]"
                  >{{
                    compare.timelyHb || compare.timelyHb == 0
                      ? `${compare.timelyHb}%`
                      : "-"
                  }}</span
                >
              </span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="statistics-frame" style="height: calc((100vh - 74.2px) / 2);">
      <div class="statistics-frame__title">月度火点趋势</div>
      <div class="statistics-frame__content statistics-frame_month">
        <multiple-chart
          style="height:100%"
          v-if="monthAlert.chartData.length"
          id="monthAlert"
          :chart-data="monthAlert.chartData"
          :series="monthAlert.series"
        />
        <div
          v-else
          style="display: flex; justify-content: center; align-items: center;"
        >
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue } from "vue-property-decorator";
import MultipleChart from "@/components/Charts/MultipleChart.vue";
import { isArray } from "lodash";
import axios from "axios";
import { log } from "util";
@Component({
  name: "SplitScreen1",
  components: {
    MultipleChart
  }
})
export default class extends Vue {
  private burnActive = "day";
  private compare: any = {
    warnTotal: 0,
    warnTb: 0,
    warnHb: 0,
    doneTotal: 0,
    doneTb: 0,
    doneHb: 0,
    timelyTotal: 0,
    timelyTb: 0,
    timelyHb: 0
  };

  private monthAlert: any = {
    chartData: [],
    series: [
      {
        name: "火点总数",
        property: "warn",
        type: "line",
        color: "#E22547",
        colorList: [
          {
            offset: 0,
            color: "rgba(7,44,90,0.3)"
          },
          {
            offset: 1,
            color: "rgba(226, 37, 71, 0.9)"
          }
        ]
      },
      {
        name: "处理总数",
        property: "done",
        type: "line",
        color: "#d3d531",
        colorList: [
          {
            offset: 0,
            color: "rgba(7,44,90,0.3)"
          },
          {
            offset: 1,
            color: "rgba(211,213,49,0.9)"
          }
        ]
      }
    ]
  };

  private realTimeAlert: any[] = [];
  intal: any = null;
  compareByTimeData: any[] = [];
  beforeDestroy() {
    clearInterval(this.intal);
    this.intal = null;
  }
  created() {
    this.getMonthAlert();
    this.getCompareByTime();
    this.init();
  }
  clearInt(index: number, name: string) {
    this.index = index;
    this.burnActive = name;
    clearInterval(this.intal);
    this.handleBurningChange(name);
  }
  index: number = 0;
  init() {
    let tabList = ["day", "week", "month"];
    this.intal = setInterval(() => {
      if (this.index == 2) {
        this.index = 0;
      } else {
        this.index += 1;
      }
      this.burnActive = tabList[this.index];
      this.handleBurningChange(tabList[this.index]);
    }, 3000);
  }

  private handleBurningChange(tab: string) {
    this.burnActive = tab;
    let index: any = tab == "day" ? 0 : tab == "week" ? 1 : 2;
    let data: any = this.compareByTimeData[index];
    if (data) {
      data.warnTotal = data.warningMessageCount;
      data.warnTb =
        data.tbWarningMessageCount != null
          ? parseFloat((data.tbWarningMessageCount * 100).toFixed(2))
          : null;
      data.warnHb =
        data.hbWarningMessageCount != null
          ? parseFloat((data.hbWarningMessageCount * 100).toFixed(2))
          : null;
      data.doneTotal = data.warningMessageSolvegetCount;
      data.doneTb =
        data.tbWarningMessageSolvegetCount != null
          ? parseFloat((data.tbWarningMessageSolvegetCount * 100).toFixed(2))
          : null;
      data.doneHb =
        data.hbWarningMessageSolvegetCount != null
          ? parseFloat((data.hbWarningMessageSolvegetCount * 100).toFixed(2))
          : null;
      data.timelyTotal =
        data.solvegetRatio != null
          ? parseFloat((data.solvegetRatio * 100).toFixed(2))
          : null;
      data.timelyTb =
        data.tbSolvegetRatio != null
          ? parseFloat((data.tbSolvegetRatio * 100).toFixed(2))
          : null;
      data.timelyHb =
        data.hbSolvegetRatio != null
          ? parseFloat((data.hbSolvegetRatio * 100).toFixed(2))
          : null;
    }
    this.compare = {
      ...this.compare,
      ...data
    };
  }

  private getMonthAlert() {
    axios.get("/api/warningmessage/yearwarning").then(res => {
      this.monthAlert.chartData = isArray(res.data)
        ? res.data.map((v: any) => {
            return {
              name: v.dateTime,
              done: v.warningMessageSolvegetCount,
              warn: v.warningMessageCount
            };
          })
        : [];
    });
  }

  private getCompareByTime() {
    axios.get("/api/warningmessage/dayweekmonthwarning").then(res => {
      if (Array(res.data)) {
        this.compareByTimeData = res.data;
        this.handleBurningChange("day");
      }
    });
  }
}
</script>

<style lang="scss">
@import "../../../styles/statistics-screen.scss";
@media screen and (min-width: 1366px) {
  .split-screen-1 {
    height: calc(100vh - 74.2px);
    width: 100%;
    .statistics-frame {
      width: 100%;
      position: relative;
      margin-top: 12px;
      margin-left: 10px;
      overflow: hidden;
      overflow-y: auto;
      @include background-setting(
        "../../../assets/screen_images/img-bg01.png",
        100%,
        322px
      );
      height: calc((100% / 2) - 12px);

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
      }

      &__content {
        margin-top: 42px;
        padding: 12px;
        height: calc((100%) - 22px);

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
        .burning-data-list-title {
          margin-bottom: 24px;
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
      &_month {
        height: calc((100%) - 50px) !important;
        margin-top: 20px;
      }
    }
    #monthAlert {
      top: 38px;
    }
  }
}
@media screen and (max-width: 1366px) {
  .split-screen-1 {
    height: calc(100vh - 74.2px);
    width: 100%;
    .statistics-frame {
      width: 100%;
      position: relative;
      margin-top: 12px;
      margin-left: 10px;
      overflow: hidden;
      overflow-y: auto;
      @include background-setting(
        "../../../assets/screen_images/img-bg01.png",
        100%,
        322px
      );
      height: calc((100% / 2) - 12px);

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
        font-size: 14px;
        font-weight: bold;
        color: #00ecfc;
      }

      &__content {
        margin-top: 32px;
        padding: 12px;

        .tabs-burning {
          position: relative;
          display: flex;
          width: 170px;
          height: 20px;
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
          padding: 0px 12px;
          padding-right: 84px;

          .el-row:not(:last-child) {
            margin-bottom: 18px;
          }
        }
        .burning-data-list-title {
          margin-bottom: 24px;
        }
        .burning-data-item {
          font-size: 10px;
          line-height: 27px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .burning-data-number {
          font-size: 18px;

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
      &_month {
        height: calc((100%) - 50px) !important;
        margin-top: 20px;
      }
    }
    #monthAlert {
      top: 38px;
    }
  }
}
</style>
