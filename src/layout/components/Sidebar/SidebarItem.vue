<template>
    <div
        v-if="!item.meta.hidden"
        :class="[isCollapse ? 'simple-mode' : 'full-mode', {'first-level': isFirstLevel}]"
    >
        <sidebar-item-link
            v-if="item.children&&item.children.length === 0||!item.children"
            :to="item.path"
            :target="item.meta.target || ''"
        >
            <el-menu-item :class="{'submenu-title-noDropdown': isFirstLevel}">
                <svg-icon v-if="theOnlyOneChild.meta.icon" :name="theOnlyOneChild.meta.icon" />
                <span v-if="theOnlyOneChild.meta.title" slot="title">{{ theOnlyOneChild.meta.title}}</span>
            </el-menu-item>
        </sidebar-item-link>
        <!-- :target="props.menu.target || ''" -->
        <el-submenu v-else :index="resolvePath(item.path)" popper-append-to-body>
            <template slot="title">
                <i v-if="item.meta && item.meta.icon" :class="item.meta.icon"></i>
                <span v-if="item.meta && item.meta.title" slot="title">{{ item.meta.title }}</span>
            </template>
            <template v-if="item.children">
                <sidebar-item
                    v-for="child in item.children"
                    :key="child.path"
                    :item="child"
                    :is-collapse="isCollapse"
                    :is-first-level="false"
                    :base-path="resolvePath(child.path)"
                    class="nest-menu"
                />
            </template>
        </el-submenu>
    </div>
</template>

<script lang="ts">
import path from "path";
import { Component, Prop, Vue } from "vue-property-decorator";
import { RouteConfig } from "vue-router";
import { isExternal } from "@/utils/validate";
import SidebarItemLink from "./SidebarItemLink.vue";

@Component({
    name: "SidebarItem",
    components: {
        SidebarItemLink,
    },
})
export default class extends Vue {
    @Prop({ required: true }) private item!: RouteConfig;
    @Prop({ default: false }) private isCollapse!: boolean;
    @Prop({ default: true }) private isFirstLevel!: boolean;
    @Prop({ default: "" }) private basePath!: string;
    created() {}
    get alwaysShowRootMenu() {
        if (this.item.meta && this.item.meta.alwaysShow) {
            return true;
        }
        return false;
    }

    get showingChildNumber() {
        if (this.item.children) {
            const showingChildren = this.item.children.filter((item) => {
                if (item.meta && item.meta.hidden) {
                    return false;
                } else {
                    return true;
                }
            });

            return showingChildren.length;
        }
        return 0;
    }

    get theOnlyOneChild() {
        if (this.showingChildNumber > 1) {
            return null;
        }

        if (this.item.children) {
            for (const child of this.item.children) {
                if (!child.meta || !child.meta.hidden) {
                    return child;
                }
            }
        }
        // If there is no children, return itself with path removed,
        // because this.basePath already conatins item's path information
        return { ...this.item, path: "" };
    }

    private resolvePath(routePath: string) {
        if (isExternal(routePath)) {
            return routePath;
        }
        if (isExternal(this.basePath)) {
            return this.basePath;
        }
        return path.resolve(this.basePath, routePath);
    }
}
</script>

<style lang="scss">
.el-submenu.is-active > .el-submenu__title {
    color: $subMenuActiveText !important;
}

.full-mode {
    .nest-menu .el-submenu > .el-submenu__title,
    .el-submenu .el-menu-item {
        min-width: $sideBarWidth !important;
        background-color: $subMenuBg !important;

        &:hover {
            background-color: $subMenuHover !important;
        }
    }
}

.simple-mode {
    &.first-level {
        .submenu-title-noDropdown {
            padding: 0 !important;
            position: relative;

            .el-tooltip {
                padding: 0 !important;
            }
        }

        .el-submenu {
            overflow: hidden;

            & > .el-submenu__title {
                padding: 0px !important;

                .el-submenu__icon-arrow {
                    display: none;
                }

                & > span {
                    visibility: hidden;
                }
            }
        }
    }
}
</style>

<style lang="scss" scoped>
.svg-icon {
    margin-right: 16px;
}

.simple-mode {
    .svg-icon {
        margin-left: 20px;
    }
}
</style>
