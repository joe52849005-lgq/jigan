<template>
    <div class="navbar">
        <hamburger
            id="hamburger-container"
            :is-active="sidebar.opened"
            class="hamburger-container"
            @toggleClick="toggleSideBar"
        />
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
        <div class="right-menu">
            <template>
                <header-search class="right-menu-item" />
                <error-log class="errLog-container right-menu-item hover-effect" />
                <screenfull class="right-menu-item hover-effect" />
                <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom"></el-tooltip>
            </template>
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" />
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown">
                    <router-link to="/profile/">
                        <el-dropdown-item>{{ $t('navbar.profile') }}</el-dropdown-item>
                    </router-link>
                    <router-link to="/">
                        <el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
                    </router-link>
                    <a
                        target="_blank"
                        href="https://github.com/armour/vue-typescript-admin-template/"
                    >
                        <el-dropdown-item>{{ $t('navbar.github') }}</el-dropdown-item>
                    </a>
                    <a target="_blank" href="https://armour.github.io/vue-typescript-admin-docs/">
                        <el-dropdown-item>Docs</el-dropdown-item>
                    </a>
                    <el-dropdown-item divided @click.native="logout">
                        <span style="display:block;">{{ $t('navbar.logOut') }}</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import ErrorLog from "@/components/ErrorLog/index.vue";
import Hamburger from "@/components/Hamburger/index.vue";
import HeaderSearch from "@/components/HeaderSearch/index.vue";
import Screenfull from "@/components/Screenfull/index.vue";
import { namespace, State } from "vuex-class";
const appModule = namespace("app");
const userModule = namespace("user");
@Component({
    name: "Navbar",
    components: {
        Breadcrumb,
        ErrorLog,
        Hamburger,
        HeaderSearch,
        Screenfull,
    },
})
export default class extends Vue {
    @appModule.State("sidebar")
    sidebar: any;
    @appModule.Mutation("collapse")
    collapse!: () => void;
    @userModule.State("info")
    user: any;

    get avatar() {
        return true;
    }

    private toggleSideBar() {
      this.collapse()
    }

    private async logout() {
        // await UserModule.LogOut()
        this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        padding: 0 15px;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
