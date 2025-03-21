<template>
  <!-- eslint-disable -->
  <div class="split-screen-3">
    <div class="statistics-frame">
      <div class="statistics-frame__title">实时火点信息</div>

      <div class="statistics-frame__content">
        <div class="statistics-frame__item statistics-frame__itemTitle">
          <div class="statistics-frame__time">发生时间</div>
          <div class="statistics-frame__address">地点</div>
          <div class="statistics-frame__warntype">处理状态</div>
        </div>
        <div class="statistics-frame__scroll">
          <vue-seamless-scroll
            :data="realTimeAlert"
            :class-option="classOption"
            class="seamless-warp"
          >
            <div
              v-for="(item, index) in realTimeAlert"
              :key="index"
              class="statistics-frame__item"
            >
              <div class="statistics-frame__time">
                {{ item.crateTimeLabel }}
              </div>
              <div class="statistics-frame__address" :title="item.pointName">
                {{ item.cityName + item.pointName }}
              </div>
              <div class="statistics-frame__warntype">
                {{ item.isSolvegetLabel }}
              </div>
            </div>
          </vue-seamless-scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
@Component({
  name: "SplitScreen3"
})
export default class extends Vue {
  private realTimeAlert: any[] = [];
  classOption: any = {
    step: 0.5, // 数值越大速度滚动越快

    limitMoveNum: 21, // 开始无缝滚动的数据量 this.dataList.length

    hoverStop: true, // 是否开启鼠标悬停stop

    direction: 1, // 0向下 1向上 2向左 3向右

    openWatch: true, // 开启数据实时监控刷新dom

    singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1

    singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3

    waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
  };
  created() {
    let clientWidth = document.body.clientWidth;
    this.classOption.limitMoveNum = clientWidth > 1366 ? 21 : 16;
    this.getDayAlert();
  }
  private getDayAlert() {
    axios
      .get("/api/warningmessage/todaywarning")
      .then((res: any) => {
        if (res.code === 0) {
          if (
            res.data !== undefined &&
            res.data !== null &&
            res.data.length > 0
          ) {
            this.realTimeAlert = res.data;
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
}
</script>

<style lang="scss">
@import "../../../styles/statistics-screen.scss";
@media screen and (min-width: 1366px) {
  .split-screen-3 {
    height: calc(100vh - 74.2px);
    .statistics-frame {
      width: 100%;
      position: relative;
      margin-top: 12px;
      margin-left: 10px;
      margin-right: 10px;
      overflow: hidden;
      @include background-setting(
        "../../../assets/screen_images/img-bg01.png",
        100%,
        322px
      );
      height: calc(100vh - 74.2px);

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

        .tabs-env-title {
          display: flex;
          font-size: 18px;
          color: #fff;
        }

        .tab-env-title {
          cursor: pointer;

          &--active {
            color: #00ecfc;
          }
        }
      }

      &__content {
        margin-top: 42px;
        padding: 12px;
        overflow: hidden;
      }
      &__scroll {
        overflow: hidden;
      }

      &__item {
        display: flex;
        color: #fff;
        opacity: 0.8;
        text-align: left;
        line-height: 35px;
        font-size: 14px;
      }
      &__itemTitle {
        border-bottom: 1px solid #ffffff;
        padding-bottom: 10px;
        text-align: center;
      }
      &__time {
        width: 140px !important;
      }

      &__warntype {
        width: 75px;
        box-sizing: border-box;
      }
      &__address {
        padding: 0 30px;
        width: 380px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
@media screen and (max-width: 1366px) {
  .split-screen-3 {
    margin-right: 20px;
    height: calc(100vh - 74.2px);
    .statistics-frame {
      position: relative;
      margin-top: 12px;
      margin-left: 10px;
      margin-right: 10px;
      overflow: hidden;
      @include background-setting(
        "../../../assets/screen_images/img-bg01.png",
        100%,
        322px
      );
      height: calc(100vh - 74.2px);

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

        .tabs-env-title {
          display: flex;
          font-size: 18px;
          color: #fff;
        }

        .tab-env-title {
          cursor: pointer;

          &--active {
            color: #00ecfc;
          }
        }
      }

      &__content {
        margin-top: 18px;
        padding: 12px;
        overflow: hidden;
      }
      &__scroll {
        overflow: hidden;
      }

      &__item {
        display: flex;
        color: #fff;
        opacity: 0.8;
        text-align: left;
        line-height: 30px;
        font-size: 10px;
      }
      &__itemTitle {
        border-bottom: 1px solid #ffffff;
        padding-bottom: 0px;
        text-align: center;
      }
      &__time {
        width: 180px !important;
      }

      &__warntype {
        width: 100px;
        box-sizing: border-box;
      }
      &__address {
        padding: 0 10px;
        width: 320px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
