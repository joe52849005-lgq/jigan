<template>
    <div :class="{'has-logo': showLogo}">
        <sidebar-logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :background-color="variables.menuBg"
                :text-color="variables.menuText"
                :active-text-color="menuActiveTextColor"
                :unique-opened="false"
                :collapse-transition="false"
                mode="vertical"
            >
                <template v-for="route in routes">
                    <el-menu-item-group
                        :key="route.path"
                        v-if="route.meta.group"
                        :title="route.meta.title"
                    >
                        <sidebar-item
                            :item="route"
                            :base-path="route.path"
                            :is-collapse="isCollapse"
                        />
                    </el-menu-item-group>
                </template>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import { AppModule } from "@/store/modules/app";
import { PermissionModule } from "@/store/modules/permission";
import { SettingsModule } from "@/store/modules/settings";
import SidebarItem from "./SidebarItem.vue";
import SidebarLogo from "./SidebarLogo.vue";
import variables from "@/styles/_variables.scss";
import permission from "@/api/premission";
import { namespace, State } from "vuex-class";
const appModule = namespace("app");

@Component({
    name: "SideBar",
    components: {
        SidebarItem,
        SidebarLogo,
    },
})
export default class extends Vue {
    @appModule.State("sidebar")
    sidebar: any;

    // get sidebar() {
    //     return AppModule.sidebar;
    // }
    created() {
        console.log(this.sidebar);
    }
    get routes() {
        console.log(permission);

        return permission;
    }

    get showLogo() {
        return SettingsModule.showSidebarLogo;
    }

    get menuActiveTextColor() {
        if (SettingsModule.sidebarTextTheme) {
            return SettingsModule.theme;
        } else {
            return variables.menuActiveText;
        }
    }

    get variables() {
        return variables;
    }

    get activeMenu() {
        const route = this.$route;
        const { meta, path } = route;
        // if set path, the sidebar will highlight the path you set
        if (meta.activeMenu) {
            return meta.activeMenu;
        }
        return path;
    }

    get isCollapse() {
        return !this.sidebar.opened;
    }
}
</script>

<style lang="scss">
.sidebar-container {
    // reset element-ui css
    .horizontal-collapse-transition {
        transition: 0s width ease-in-out, 0s padding-left ease-in-out,
            0s padding-right ease-in-out;
    }

    .scrollbar-wrapper {
        overflow-x: hidden !important;
    }

    .el-scrollbar__view {
        height: 100%;
    }

    .el-scrollbar__bar {
        &.is-vertical {
            right: 0px;
        }

        &.is-horizontal {
            display: none;
        }
    }
}
</style>

<style lang="scss" scoped>
.el-scrollbar {
    height: 100%;
}

.has-logo {
    .el-scrollbar {
        height: calc(100% - 50px);
    }
}

.el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
}
</style>
