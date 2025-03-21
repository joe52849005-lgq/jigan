<template>
    <div :class="classObj" class="app-wrapper">
        <sidebar class="sidebar-container" />
        <div class="main-container hasTagsView">
            <div class="fixed-header">
                <navbar />
                <tags-view />
            </div>
            <app-main />
        </div>
    </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import { SettingsModule } from "@/store/modules/settings";
import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/resize";

@Component({
    name: "Layout",
    components: {
        AppMain,
        Navbar,
        Settings,
        Sidebar,
        TagsView,
    },
})
export default class extends mixins(ResizeMixin) {
    get classObj() {
        return {
            hideSidebar: !this.sidebar.opened,
            openSidebar: this.sidebar.opened,
            withoutAnimation: this.sidebar.withoutAnimation,
        };
    }

    get showTagsView() {
        return false;
    }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
}

.main-container {
    min-height: 100%;
    transition: margin-left 0.28s;
    margin-left: $sideBarWidth;
    position: relative;
}

.sidebar-container {
    transition: width 0.28s;
    width: $sideBarWidth !important;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar {
    .main-container {
        margin-left: 54px;
    }

    .sidebar-container {
        width: 54px !important;
    }

    .fixed-header {
        width: calc(100% - 54px);
    }
}

.withoutAnimation {
    .main-container,
    .sidebar-container {
        transition: none;
    }
}
</style>
