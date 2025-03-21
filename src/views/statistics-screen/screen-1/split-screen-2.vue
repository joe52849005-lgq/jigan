<template>
  <!-- eslint-disable -->
  <div class="split-screen-2">
    <div class="statistics-frame statistics-frame--big">
      <div class="statistics-frame__content">
        <el-row :gutter="10" class="data-card-list">
          <el-col :span="8">
            <div class="data-card">
              <!-- 原始: color: #d85965; -->
              <div class="data-card__value" style="color: #E22547;">
                {{ collectionStatistics.warn }}
              </div>
              <div class="data-card__label">当日火点总数</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="data-card">
              <div class="data-card__value" style="color: #d3d531;">
                {{ collectionStatistics.done }}
              </div>
              <div class="data-card__label">当日处理总数</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="data-card">
              <div class="data-card__value" style="color: #07b8c5;">
                {{ collectionStatistics.point_num }}
              </div>
              <div class="data-card__label">监控点位总数</div>
            </div>
          </el-col>
        </el-row>
        <div class="map-action">
          <el-button type="primary" size="mini" @click="$emit('to-monitor')">
            实时监控
            <i class="el-icon-arrow-right el-icon--right"></i>
          </el-button>
        </div>
        <map-area-chart
          v-if="areaStatistics.chartData.length"
          id="areaStatistics"
          :area-statistics="areaStatistics"
          @select="onMapSelect"
        />
        <div
          v-if="areaStatistics.chartData.length"
          class="map-action__title"
          style="margin-top: -15px"
        >
          各地市监控点位数
        </div>
      </div>
    </div>
    <div class="statistics-frame">
      <div class="statistics-frame__title">各地市数据展示</div>
      <div class="statistics-frame__content" style="padding-top: 24px">
        <!-- 原始：:colorList="['#d85965', '#3079fc']" -->
        <region-multiple-chart
          id="cityStatistics"
          :chart-data="cityStatistics.chartData"
          :series="cityStatistics.series"
          :grid="{
            borderWidth: 0,
            top: '15%',
            bottom: '10%',
            left: '8%',
            right: '5%'
          }"
          :line-style="1.2"
          :colorList="['#E22547', '#d3d531']"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue } from "vue-property-decorator";
import MultipleChart from "@/components/Charts/MultipleChart.vue";
import MapAreaChart from "@/components/Charts/MapAreaChart.vue";
import RegionMultipleChart from "@/components/Charts/RegionMultipleChart.vue";
import { isArray, sumBy, sortBy, reverse, slice, map } from "lodash";
import Axios from "axios";

@Component({
  name: "SplitScreen2",
  components: {
    MultipleChart,
    MapAreaChart,
    RegionMultipleChart
  }
})
export default class extends Vue {
  private burnActive = 0;
  private realTimeAlert: any[] = [];
  private areaStatistics: any = {
    series: [
      {
        name: "监控点位数",
        property: "warn"
      }
    ],
    chartData: [],
    currentData: {
      name: "广西壮族自治区",
      value: 0
    }
  };
  private cityStatistics: any = {
    series: [
      {
        name: "火点总数",
        property: "warn",
        type: "line",
        smooth: true
      },
      {
        name: "处理总数",
        property: "done",
        type: "line",
        smooth: true
      }
    ],
    chartData: []
  };
  private collectionStatistics: any = {
    point_num: 0,
    overBanBurn: 0,
    warn: 0,
    done: 0
  };

  created() {
    this.getCityCount();
    this.getpointwarningstatistics();
  }

  private onMapSelect(params: any, echart: any) {
    this.$emit("to-monitor", params);
  }
  getpointwarningstatistics() {
    Axios.get("/api/monitorypoint/getpointwarningstatistics").then(res => {
      const { data } = res;
      this.collectionStatistics.point_num = data.pointCount;
      this.collectionStatistics.warn = data.warningCount;
      this.collectionStatistics.done = data.warningSolvegetCount;
    });
  }

  private getCityCount() {
    Axios.get("/api/monitorypoint/getpointwarningcountinfo").then(res => {
      const { data } = res;
      this.cityStatistics.chartData = isArray(data)
        ? data.map((v: any) => {
            return {
              done: v.warningSolvegetCount,
              warn: v.warningCount,
              name: v.cityName.split("市")[0]
            };
          })
        : [];
      this.areaStatistics.chartData = data.map((v: any) => {
        return {
          warn: v.pointCount,
          name: v.cityName,
          city_code: v.cityCode
        };
      });
    });
  }
}
</script>

<style lang="scss">
@import "../../../styles/statistics-screen.scss";
@media screen and (min-width: 1366px) {
  .split-screen-2 {
    height: calc(100vh - 74.2px);
    .statistics-frame {
      position: relative;
      margin-top: 12px;
      margin-left: 10px;
      overflow: hidden;
      overflow-y: auto;
      @include background-setting(
        "../../../assets/screen_images/img-bg01.png",
        625px,
        322px
      );
      height: calc((100vh - 74.2px) / 2);
      width: 100%;

      &--big {
        @include background-setting(
          "../../../assets/screen_images/img-bg02.png",
          625px,
          656px
        );
        height: calc((100vh - 74.2px) / 2);
        width: 100%;
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
      #areaStatistics {
        height: calc(100% - 120px) !important;
      }
      #cityStatistics {
        margin-top: 15px;
        height: calc(100% - 38px) !important;
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
        margin-top: 0px;
        padding: 12px;
        height: 100%;
      }

      .data-card {
        padding: 10px;
        text-align: center;
        border: 1px solid #0a43bc;

        &__value {
          font-size: 24px;
          color: #e22547;
          margin-bottom: 7px;
        }

        &__label {
          font-size: 12px;
          color: #fff;
        }
      }

      .map-action {
        display: flex;
        align-items: center;
        // margin-left: 20px;
        margin-top: 20px;

        &__title {
          font-size: 18px;
          color: #fff;
        }

        .el-button {
          background-color: #3050c4;
          border-color: #3050c4;
          // margin-left: 25px;
        }
      }
    }
  }
}
@media screen and (max-width: 1366px) {
  .split-screen-2 {
    height: calc(100vh - 74.2px);
    .statistics-frame {
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
      height: calc((100vh - 74.2px) / 2);
      width: 100%;

      &--big {
        @include background-setting(
          "../../../assets/screen_images/img-bg02.png",
          100%,
          656px
        );
        height: calc((100vh - 74.2px) / 2);
        width: 100%;
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
        font-size: 14px;
        font-weight: bold;
        color: #00ecfc;
      }

      &__content {
        margin-top: 0px;
        padding: 12px;
        height: 100%;
      }
      #areaStatistics {
        height: calc(100% - 65px) !important;
      }
      #cityStatistics {
        margin-top: 15px;
        height: calc(100% - 14px) !important;
      }
      .data-card {
        padding: 3px;
        text-align: center;
        border: 1px solid #0a43bc;
        &__value {
          font-size: 16px;
          color: #e22547;
          margin-bottom: 3px;
        }

        &__label {
          font-size: 12px;
          color: #fff;
        }
      }

      .map-action {
        display: flex;
        align-items: center;
        // margin-left: 20px;
        margin-top: 10px;

        &__title {
          font-size: 14px;
          color: #fff;
        }

        .el-button {
          background-color: #3050c4;
          border-color: #3050c4;
          // margin-left: 25px;
          font-size: 12px;
          padding: 4px 10px;
        }
      }
    }
  }
}
</style>
