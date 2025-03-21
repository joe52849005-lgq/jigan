<template>
    <!-- eslint-disable -->
    <div class="statistics-screen-header">
        <div class="statistics-screen-header-left">
            <el-tabs v-model="activeName" @tab-click="onScreenChange">
                <el-tab-pane label="统计大屏" name="统计大屏" />
                <el-tab-pane label="实时监控大屏" name="实时监控大屏" />
                <el-tab-pane label="管理后台" name="管理后台" />
            </el-tabs>
        </div>
        <div class="statistics-screen-header-right">
            <span class="statistics-screen-header__time">{{ currentTime }}</span>
            <span class="statistics-screen-header__line">|</span>
            <span class="statistics-screen-header__date">{{ currentDate }}</span>
            <span class="statistics-screen-header__week">{{ currentWeek }}</span>
            <i
                style="margin-left:10px;cursor:pointer;"
                @click="loginOut"
                title="退出登录"
                class="el-icon-switch-button"
            ></i>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    name: "StatisticsScreenHeader",
})
export default class extends Vue {
    @Prop({
        type: String,
        default: "",
    })
    private title!: string;

    private activeName = "统计大屏";

    private currentTime = "";
    private currentDate = "";
    private currentWeek = "";
    private timer: any = null;

    private setCurrentTime() {
        const dateTime = new Date();
        this.currentDate = this.dateFormat(dateTime);
        this.currentWeek = this.weekFormat(dateTime.getDay());
        this.currentTime = this.timeFormat(dateTime);

        this.timer = setInterval(() => {
            this.currentTime = this.timeFormat(new Date());
        }, 1000);
    }

    private dateFormat(dateTime: Date) {
        return (
            dateTime.getFullYear() +
            "/" +
            (dateTime.getMonth() + 1).toString().padStart(2, "0") +
            "/" +
            dateTime.getDate().toString().padStart(2, "0")
        );
    }

    private weekFormat(week: number) {
        switch (week) {
            case 0:
                return "星期日";
            case 1:
                return "星期一";
            case 2:
                return "星期二";
            case 3:
                return "星期三";
            case 4:
                return "星期四";
            case 5:
                return "星期五";
            case 6:
                return "星期六";
            default:
                return "暂无数据";
        }
    }

    private timeFormat(dateTime: Date) {
        return (
            dateTime.getHours().toString().padStart(2, "0") +
            ":" +
            dateTime.getMinutes().toString().padStart(2, "0") +
            ":" +
            dateTime.getSeconds().toString().padStart(2, "0")
        );
    }
    private loginOut() {
        this.$router.push("/login");
    }

    private onScreenChange(tab: any) {
        // this.$router.push("/statistics-screen");
        this.$emit("change", tab.name);
    }

    public setScreenTab() {
        this.activeName = "实时监控大屏";
    }

    created() {
        this.setCurrentTime();
    }

    beforeDestroy() {
        clearInterval(this.timer);
    }
}
</script>

<style lang="scss">
@import "../../../styles/statistics-screen.scss";
@media screen and (min-width: 1366px) {
    .statistics-screen {
        &-header {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 999;
            color: #39d6fe;
            width: 100%;
            @include background-setting(
                "../../../assets/screen_images/header_1.png",
                100%,
                54.2px
            );
            height: 54.2px;
            line-height: 54.2px;
            overflow: hidden;

            &-left,
            &-right {
                height: 30px;
                line-height: 30px;
            }

            &-left {
                position: absolute;
                top: 0;
                left: 40px;
                color: #fff;
                align-items: center;

                .el-tabs__header {
                    margin: 0;
                }

                .el-tabs__active-bar {
                    height: 3px;
                    background-color: #f2cb62;
                }

                .el-tabs__nav-wrap:after {
                    background-color: transparent;
                }

                .el-tabs__item {
                    height: 30px;
                    line-height: 30px;
                    color: #fff;
                    padding: 0 40px;
                    font-weight: bold;
                    font-size: 16px;

                    &.is-active {
                        color: #f2cb62;
                    }
                }
            }

            &-right {
                position: absolute;
                top: 0;
                right: 11px;
                color: #39d6fe;
                align-items: center;
                justify-content: flex-end;
            }

            &__time {
                font-weight: bold;
                margin-right: 3px;
                font-size: 16px;
            }

            &__line {
                font-size: 2px;
                color: #00f2ff;
                padding-right: 6px;
                margin-left: 6px;
            }

            &__date {
                font-size: 10px;
                margin-right: 3px;
            }

            &__week {
                font-size: 10px;
            }
        }
    }
}
@media screen and (max-width: 1366px) {
    .statistics-screen {
        &-header {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 999;
            color: #39d6fe;
            width: 100%;
            @include background-setting(
                "../../../assets/screen_images/header_1.png",
                100%,
                40.2px
            );
            height: 40.2px;
            line-height: 40.2px;
            overflow: hidden;

            &-left,
            &-right {
                height: 20px;
                line-height: 20px;
            }

            &-left {
                position: absolute;
                top: 0;
                left: 40px;
                color: #fff;
                align-items: center;

                .el-tabs__header {
                    margin: 0;
                }

                .el-tabs__active-bar {
                    height: 3px;
                    background-color: #f2cb62;
                }

                .el-tabs__nav-wrap:after {
                    background-color: transparent;
                }

                .el-tabs__item {
                    height: 22px;
                    line-height: 20px;
                    color: #fff;
                    padding: 0 40px;
                    font-weight: bold;
                    font-size: 13px;

                    &.is-active {
                        color: #f2cb62;
                    }
                }
            }

            &-right {
                position: absolute;
                top: 0;
                right: 11px;
                color: #39d6fe;
                align-items: center;
                justify-content: flex-end;
            }

            &__time {
                font-weight: bold;
                margin-right: 3px;
                font-size: 14px;
            }

            &__line {
                font-size: 2px;
                color: #00f2ff;
                padding-right: 6px;
                margin-left: 6px;
            }

            &__date {
                font-size: 10px;
                margin-right: 3px;
            }

            &__week {
                font-size: 0.1rem;
            }
        }
    }
}
</style>
