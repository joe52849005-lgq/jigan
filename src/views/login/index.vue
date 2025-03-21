<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <img src="../../assets/login/user.png" alt />
        </span>
        <el-input
          v-model="loginForm.username"
          ref="username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item prop="password" style>
        <span class="svg-container">
          <img src="../../assets/login/lock.png" alt />
        </span>
        <el-input
          v-model="loginForm.password"
          ref="password"
          type="password"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%; font-size:18px;margin-bottom:15px;margin-top:20px;"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >
      <div
        style="text-align:center;font-size:14px;color:#999999;cursor:pointer;"
      >
        忘记密码请联系管理员
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Form as ElForm, Input } from "element-ui";
import { setToken, getToken } from "@/utils/cookies";
import AxiosInterceptor from "@/utils/request";

import { namespace, State } from "vuex-class";
const userModule = namespace("user");
@Component({
  name: "Login"
})
export default class extends Vue {
  @userModule.Mutation("setToken")
  storeSetToken!: (payload: any) => void;
  private loading = false;
  private loginForm = {
    username: null,
    password: null,
    clientId: "ScreenWebapp"
  };
  private loginRules = {
    username: [
      {
        required: true,
        trigger: "blur",
        message: "请输入用户名"
      }
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: "请输入密码"
      }
    ]
  };

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true;
        this.loginForm.clientId = "ScreenWebapp";
        axios
          .post("/api/userinfo/login", this.loginForm)
          .then((res: any) => {
            const { access_token, user } = res.data;
            this.loading = false;
            setToken(res.data.access_token);
            AxiosInterceptor.setToken(res.data.access_token);
            this.storeSetToken(res.data.access_token);
            this.$router.push({
              path: "/statistics-screen"
            });
          })
          .finally(() => {
            this.loading = false;
          });
      }
    });
  }
}
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/

.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;

    input {
      height: 40px;
      border: 0px;
      border-radius: 0px;
      background-color: transparent !important;
      -webkit-appearance: none;
      color: #000000;
    }
  }

  .el-form-item {
    border: 1px solid #1492ff;
    background: #ffffff;
    border-radius: 5px;
    margin-top: 24px;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: url("../../assets/login/bg.png") no-repeat center;

  .login-form {
    position: fixed;
    width: 440px;
    height: 417px;
    padding: 35px;
    top: 24%;
    right: 23%;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 6px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 0px 5px 0px 10px;
    box-sizing: border-box;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    position: relative;
    display: inline-block;
    img {
      position: absolute;
      margin-top: -13px;
      width: 24px;
    }
  }

  .title-container {
    position: relative;

    .title {
      color: #1492ff;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
      font-size: 20px;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
