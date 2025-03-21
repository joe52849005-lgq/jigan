<template>
    <!-- eslint-disable -->
    <div class="statistics-screen scroll-style">
        <screen-header ref="screenHeader" @change="onScreenChange" />
        <div v-if="screen === '统计大屏'" class="statistics-screen__container">
            <div class="statistics-screen__content">
                <split-screen-one @to-monitor="onToMonitor" />
            </div>
        </div>
        <div v-if="screen === '实时监控大屏'" class="statistics-screen__container2">
            <div class="statistics-screen__content">
                <!-- 实时监控大屏 -->
                <div class="split-screen">
                    <split-screen-two :mapData="mapData" />
                </div>
            </div>
        </div>
        <div v-if="screen === '管理后台'" class="statistics-screen__container2">
            <div class="statistics-screen__content">
                <!-- 管理后台 -->
                <div class="split-screen">
                    <split-screen-three :mapData="mapData" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue } from "vue-property-decorator";
import ScreenHeader from "./components/screen-header.vue";
import SplitScreenOne from "./screen-1/index.vue";
import SplitScreenTwo from "./screen-2/index.vue";
import SplitScreenThree from "./screen-3/index.vue";

@Component({
    name: "StatisticsScreen",
    components: {
        ScreenHeader,
        SplitScreenOne,
        SplitScreenTwo,
        SplitScreenThree,
    },
})
export default class extends Vue {
    private screen = "统计大屏";
    private mapData: any = {};
    private onScreenChange(name: string, type: number) {
        this.screen = name;
        if (type != 1) {
            this.mapData = {};
        }
    }

    private onToMonitor(areaData: any) {
        (this.$refs.screenHeader as any).setScreenTab();
        this.mapData = areaData;
        this.onScreenChange("实时监控大屏", 1);
    }
}
</script>

<style lang="scss">
@import "../../styles/statistics-screen.scss";
.split-screen {
    width: 100%;
    overflow: hidden;
}
@media screen and (min-width: 1366px) {
    .statistics-screen {
        width: 100vw;
        height: 100vh;
        color: #fff;
        background: #00121e;
        overflow-y: hidden;
        overflow-x: auto;

        &__container {
            width: 100%;
            height: 100%;
            background-position: center center;
            background: url("../../assets/screen_images/img_bg_new.png") center
                center no-repeat;
        }

        &__container2 {
            width: 100%;
            height: 100%;
        }

        &__content {
            display: flex;
            justify-content: space-between;
            padding-top: 60px;
        }
    }
}
@media screen and (max-width: 1366px) {
    .statistics-screen {
        width: 100vw;
        height: 100vh;
        color: #fff;
        background: #00121e;
        overflow-y: hidden;
        overflow-x: auto;

        &__container {
            width: 100%;
            height: 100%;
            background-position: center center;
            background: url("../../assets/screen_images/img_bg_new.png") center
                center no-repeat;
        }

        &__container2 {
            width: 100%;
            height: 100%;
        }

        &__content {
            display: flex;
            justify-content: space-between;
            padding-top: 50px;
        }
    }
}

.scroll-style {
    -ms-overflow-style: none;

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

    scrollbar-highlight-color: #1244a6;
    scrollbar-track-color: rgba(0, 0, 0, 0.1);
}
</style>
