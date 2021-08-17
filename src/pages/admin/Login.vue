<template>
  <div :class="['login-container', 'login-container-' + $config.name]">
    <div
      class="login-box"
      :style="{ height: height + 'px' }"
      v-if="type === 'default'"
    >
      <svg
        class="bg-img"
        id="wave"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 100 35"
        preserveAspectRatio="none"
        v-show="$store.state.main.showTab"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g class="parallax">
          <use
            class="theme-fill-color"
            xlink:href="#gentle-wave"
            x="50"
            y="0"
          />
          <use
            class="theme-fill-color"
            xlink:href="#gentle-wave"
            x="50"
            y="3"
          />
          <use
            class="theme-fill-color"
            xlink:href="#gentle-wave"
            x="50"
            y="6"
          />
        </g>
      </svg>
      <div style="z-index: 100">
        <img
          :style="'height:' + logoHeight"
          class="logo"
          :src="logoImg"
          v-if="$config.name !== '500w'"
          alt
        />
        <div v-else style="height: 2.1rem"></div>
        <div class="bbm-box" @keypress.enter="onSubmit">
          <label class="input-row user-name">
            <span
              class="icon iconfont h5-icon-new-index-user theme-color"
            ></span>
            <input
              v-model="userName"
              ref="loginUserName"
              class="input"
              type="text"
              placeholder="帐号"
              autocomplete="new-password"
              @blur="userNameBlur"
              @focus="userNameFocus"
              maxlength="20"
            />
            <div
              class="userRecordList"
              ref="userRecordList"
              v-show="showRecordList && showRecordList.length && showRecoed"
            >
              <ul>
                <li
                  v-for="(item, i) in showRecordList"
                  :key="i"
                  @click="userRecordClick(item)"
                >
                  <span class="recordName">{{ item.userName }}</span>
                  <span class="recordPassword">********</span>
                  <span class="recordClear" @click.stop="userRecordDelete(i)">
                    <van-icon name="clear" />
                  </span>
                </li>
              </ul>
            </div>
          </label>
          <label class="input-row">
            <span
              class="icon iconfont h5-icon-new-index-password theme-color"
            ></span>
            <input
              v-model="password"
              class="input"
              type="password"
              placeholder="密码"
              autocomplete="new-password"
              maxlength="20"
            />
          </label>
          <label
            class="input-row auth"
            v-if="loginVerify == 'imgCode'"
            v-show="isCaptcha && $store.state.user.code.authImg"
          >
            <span
              class="icon iconfont h5-icon-new-index-yzm theme-color"
            ></span>
            <input
              v-model="code"
              class="input"
              type="tel"
              placeholder="验证码"
              autocomplete="new-password"
              maxlength="4"
            />
            <img
              class="auth-code-img"
              :src="$store.state.user.code.authImg"
              alt
              @click="refreshArchCode"
            />
          </label>
          <div class="password-row">
            <a
              href="javascript:void(0)"
              class="no-password"
              @click="toastText('请联系客服找回密码', 'top')"
              >忘记密码？</a
            >
            <label class="recode-password">
              <span>记住密码</span>
              <span class="switch-box">
                <van-switch v-model="record" size="0.5rem"></van-switch>
              </span>
            </label>
          </div>

          <button
            type="button"
            class="theme-bg theme-border submit-button"
            @click="onSubmit"
            :disabled="
              submitted ||
              (loginVerify == 'imgCode'
                ? isCaptcha && !$store.state.user.code.authImg
                : false) ||
              !userName
            "
          >
            立即登录
          </button>
          <!-- <button>点击弹出验证码</button> -->
          <div v-if="loginVerify == 'wyCode'" id="captcha"></div>
        </div>
        <slide-verify
          v-if="verify && isCaptcha"
          :userName="userName"
          @success="onSuccess"
          @closeVerify="closeVerify"
        ></slide-verify>
        <div v-if="loginVerify == 'wyCode' && wyLoading" class="verify_all">
          <div
            :class="[
              'verify_before',
              { 'qp-verify_before': $config.newQP || $config.blackTheme },
              { 'qp-verify_blush': $config.blush },
            ]"
          >
            <div class="verify_loading" :class="verifyClass"></div>
            <p>安全检测中</p>
          </div>
        </div>
        <p class="bottom" v-if="$config.name !== '500w'">
          没有帐号?
          <a
            class="tag-a theme-color"
            @click.stop="$router.replace('/admin/register')"
            >立即注册</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Login",
  data() {
    return {
      userName: "",
      password: "",
      code: "",
      hah: "",
      record: false,
      submitted: false,
      isCaptcha: false,
      height: window.document.documentElement.clientHeight,
      showRecoed: false,
      userRecordList: [],
      showRecordList: [],
      recordScroll: null,
      type: "default",
      verify: false,
      captchaIns: null,
      wyLoading: false,
      getDateTimer: 0,
      loginVerify: this.$store.state.main.VerificationCode || "imgCode", // type  tCode: 滑动验证 imgCode： 图片验证  wyCode：网易盾
    };
  },
  components: {
  },
  watch: {
    "$store.state.main.VerificationCode"(newVal) {
      this.loginVerify = newVal;
    },
    userName() {
      this.userName = this.userName.replace(/\s/g, "");
      this.showRecordList = this.userRecordList.filter((item) => {
        let itemLowerCase = item.userName.toLowerCase();
        let userNameLowerCase = this.userName.toLowerCase();
        if (itemLowerCase.includes(userNameLowerCase)) {
          return item;
        }
      });
    },
    password() {
      this.password = this.password.replace(/\s/g, "");
    },
    code() {
      this.code = this.code.replace(/\s/g, "");
    },
    showRecoed() {
      setTimeout(() => {
        this.recordScroll && this.recordScroll.refresh();
      }, 200);
    },
  },
  created() {
    this.$store.commit("main/getisRedLop", false);
    this.$store.commit("main/isShowMask", {
      page: "",
      status: false,
    });
    switch (this.$config.home) {
      default:
        if (["vnst"].includes(this.$config.name)) {
          // this.type = "vnst2";
          this.$router.replace("/admin/vnst2-login");
        } else {
          console.log('in defautl?')
          this.type = "default";
          this.checkArchCode();
          this.userRecordList = this.$store.state.user.userRecordList;
          this.showRecordList = this.$store.state.user.userRecordList;
          this.goNewLogin();
        }
        break;
    }
  },
  mounted() {
    window.addEventListener("resize", function () {
      this.height = document.body.scrollHeight;
    });
    this.loginVerify = this.$store.state.main.VerificationCode
    setTimeout(() => {
      if(this.$store.state.main.config.antiCheatSystem && this.$store.state.main.config.antiCheatSystem === 'on' && JSON.stringify(this.$store.state.user.Watchman) !== '{}') {
        initWatchman({
          productNumber: 'YD00815584448686',
          onload:  (instance) => {
            this.$store.state.user.Watchman = instance
          }
        });
      }
    }, 1000);
  },
  computed: {
    logoImg() {
      let img = "";
      if (
        localStorage["main/logoInfo"] &&
        JSON.parse(localStorage["main/logoInfo"]).length > 0
      ) {
        try {
          JSON.parse(localStorage["main/logoInfo"]).forEach((ff) => {
            if (ff.position === "register_logo" && ff.clientType === "mobile") {
              img = localStorage.SiteStaticsUrl + ff.body[0].img;
            }
          });
        } catch (error) {
          img = require("@site/assets/img/admin/admin-logo.png");
        }
      } else {
        img = require("@site/assets/img/admin/admin-logo.png");
      }
      return img;
    },
    logoHeight() {
      return this.$config.logoChose ? this.$config.logoChose : "1rem";
    },
    verifyClass() {
      if (this.$config.newQP || this.$config.blackTheme) {
        return "verify_loadingQP";
      } else if (this.$config.home === "xpj") {
        return "verify_loadingA";
      } else if (this.$config.blush) {
        return "verify_loadingBlush";
      } else {
        return "verify_loadingB";
      }
    },
  },
  methods: {
    getWYdata() {
      let _this = this;
      _this.wyLoading = true;
      this.$store.dispatch("user/getYiDunCode").then((res) => {
        initNECaptcha(
          {
            element: "#captcha",
            captchaId: res.data.CAPTCHA_ID,
            mode: "popup",
            width: 'auto',
            appendTo: "body",
            feedbackEnable: false,
            onClose: function () {
              _this.submitted = false;
            },
            onVerify: function (err, result) {
              if (err) return;
              _this.$store
                .dispatch("user/getCheckYiDunCode", {
                  NECaptchaValidate: result.validate,
                  userName: _this.userName.replace(/\s/g, ""),
                })
                .then((res) => {
                  if (res.code === 200) {
                    const data = {
                      userName: _this.userName.replace(/\s/g, ""),
                      password: _this.password.replace(/\s/g, ""),
                      record: _this.record,
                    };
                    if (_this.isCaptcha) {
                      data.code = 1111;
                    }
                    _this.postLoginSumit(data);
                  }
                });
            },
          },
          function (instance) {
            // 初始化成功后得到验证实例instance，可以调用实例的方法
            _this.captchaIns = instance;
            _this.wyLoading = false;
            instance.popUp();
          },
          function (err) {
            // 初始化失败后触发该函数，err对象描述当前错误信息
          }
        );
      });
    },
    closeVerify() {
      this.verify = false;
      this.submitted = false;
    },
    onSuccess() {
      this.verify = false;
      const data = {
        userName: this.userName.replace(/\s/g, ""),
        password: this.password.replace(/\s/g, ""),
        record: this.record,
      };
      if (this.isCaptcha) {
        data.code = 1111;
      }
      this.postLoginSumit(data);
    },
    // onFail(){
    // },
    // onRefresh(){
    // },
    onSubmit() {
      if (this.$config.preview) {
        this.previewAlert();
      } else if (this.submitted) {
      } else if (
        this.checkUserForLogin(this.userName) &&
        this.checkPassword(this.password) &&
        (this.isCaptcha
          ? this.loginVerify == "imgCode"
            ? this.checkCode(this.code)
            : true
          : true)
      ) {
        this.submitted = true;
        const data = {
          userName: this.userName.replace(/\s/g, ""),
          password: this.password.replace(/\s/g, ""),
          record: this.record,
        };

        if (this.isCaptcha) {
          data.code = this.code.replace(/\s/g, "");
        }
        if (this.loginVerify == "tCode") {
          this.verify = true;
        } else if (this.loginVerify == "wyCode") {
          this.getWYdata();
        } else {
          this.postLoginSumit(data);
        }
      }
    },
    checkArchCode() {
      this.submitted = true;
      this.$store.dispatch("user/isCaptcha", {
        callback: (res) => {
          this.submitted = false;
          if (res.code !== 200 || res.data === 0) {
            this.isCaptcha = false;
          } else {
            this.isCaptcha = true;
            if (!this.$store.state.user.code.authImg) {
              this.refreshArchCode();
            }
          }
        },
      });
    },
    refreshArchCode() {
      if (this.loginVerify != "imgCode") return;
      if (this.userName && !this.submitted && this.isCaptcha) {
        this.submitted = true;
        this.$store.dispatch("user/refreshAuthCode", {
          userName: this.userName,
          callback: (res) => {
            this.submitted = false;
          },
        });
      } else {
        this.submitted = false;
        this.$store.state.user.code = {
          authImg: "",
          code: "",
        };
      }
    },
    userRecordClick(item) {
      this.userName = item.userName;
      this.password = item.password;
      this.showRecoed = false;
      setTimeout(() => {
        this.$refs.loginUserName.blur();
      }, 0);
    },
    userRecordDelete(i) {
      this.userRecordList.splice(i, 1);
      this.showRecordList = this.userRecordList;
      this.$store.commit("user/setRecord", this.userRecordList);
    },
    userNameFocus() {
      this.showRecoed = true;
    },
    userNameBlur() {
      if (this.loginVerify == "imgCode") {
        setTimeout(() => {
          this.showRecoed = false;
          this.refreshArchCode();
        }, 0);
      }
    },
    postLoginSumit(data) {
      this.$store.dispatch("user/login", {
        data,
        callback: (res) => {
          this.submitted = false;
          this.$store.state.main.loadingText = "";
          if (res.code === 200) {
            this.$store
              .dispatch("user/refreshBalance")
              .then((res) => {
                if (res.code && res.code !== 200) {
                  if (
                    res.message.includes("设备上登录") ||
                    res.message.includes("请登录")
                  ) {
                    this.$store.commit("user/clean");
                    this.$router.replace("/");
                    this.toastText(res.message, "top");
                    setTimeout(() => {
                      this.$stomp.reInit();
                    }, 1000);
                  }
                }
              })
              .catch((err) => {});

            this.$store.dispatch("user/refreshBank").then();
            this.$store.dispatch("user/refreshUsdt").then();

            setTimeout(
              function () {
                this.$router.push("/");
                this.submitted = false;
              }.bind(this),
              1000
            );

            this.$store
              .dispatch("lottery/getAllPlayWay")
              .then((res) => {
                this.$store.commit("lottery/checkPlayWay");
              })
              .catch((err) => {});
            this.$store.dispatch("user/refreshMsgCount").then();

            this.$store
              .dispatch("agency/getRefundRebate")
              .then((res) => {
                this.$store.commit("lottery/checkPlayWay");
              })
              .catch((err) => {});

            if (localStorage["agent"]) {
              localStorage.removeItem("agent");
            }
            setTimeout(() => {
              this.$stomp.reInit();
            }, 1000);
          } else {
            this.submitted = false;
            this.toastText(res.message, "middle");
            if (this.loginVerify == "tCode") {
              this.verify = false;
            } else if (this.loginVerify == "wyCode") {
              this.captchaIns && this.captchaIns.refresh();
            } else {
              if (this.isCaptcha) {
                this.refreshArchCode();
              } else {
                this.checkArchCode();
              }
            }
          }
        },
      });
    },
  },
  beforeDestroy() {
    this.$store.state.user.code = {
      authImg: "",
      code: "",
    };
    this.verify = false;
    clearInterval(this.getDateTimer);
  },
};
</script>

<style lang="less" type='text/less' scoped>
.login-container {
  min-height: 100vh;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  &.login-container-qp {
    background-color: #000;
  }
  &.login-container-tccp {
    background-color: #520107;
  }
}
.login-box {
  background-color: white;
  height: 100vh;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  .logo {
    display: block;
    height: 1rem;
    padding: 0.8rem 0 0.3rem !important;
    margin: 0 auto;
    box-sizing: content-box;
  }

  .bbm-box {
    padding: 0 0.5rem;

    .input-row {
      width: 100%;
      padding: 0.31rem 0;
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
      position: relative;
      // border-bottom: 0.02rem solid #F3F3F3;
      &::after {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        right: 0;
        bottom: 0;
        left: 0rem;
        border-bottom: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
      &.user-name {
        position: relative;
        .userRecordList {
          position: absolute;
          left: 0.7rem;
          top: 0.9rem;
          width: 5.02rem;
          background: #fff;
          box-shadow: 0px 0.05rem 0.07rem 0 rgba(38, 91, 77, 0.06);
          padding: 0 0.32rem;
          border-radius: 0.1rem;
          color: #555555;
          font-size: 0.32rem;
          z-index: 1;
          border: 0.01rem solid #c0c0c0;
          max-height: 3rem;
          overflow-y: hidden;
          z-index: 999;
          ul {
            li {
              height: 0.96rem;
              line-height: 0.96rem;
              border-bottom: 0.01rem solid #efefef;
              overflow: hidden;
              .recordName {
                width: 2.3rem;
                text-align: left;
                float: left;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .recordPassword {
                float: left;
              }
              .recordClear {
                float: right;
                color: #d8d8d8;
              }
              &:last-child {
                border-bottom: none;
              }
            }
          }
        }
      }
      .icon {
        font-size: 0.46rem;
        line-height: 0.54rem;
        height: 0.48rem;
        display: block;
        transform: translateY(-0.04rem);
        width: 0.56rem;
        text-align: center;
      }

      .input {
        flex: 1 !important;
        font-size: 0.36rem;
        line-height: 0.48rem;
        padding: 0 0.2rem;
        border: none;
        outline: 0;
        -webkit-appearance: none;
        background-color: rgba(0, 0, 0, 0) !important;
        color: #424242 !important;
        min-width: 0 !important;
        width: unset !important;
        max-width: 9999px;

        &:focus {
          -webkit-appearance: none;
          border: none;
          outline: 0;
        }
      }

      .input:-webkit-autofill {
        background-color: rgba(0, 0, 0, 0) !important;
        color: #424242 !important;
        min-width: 0 !important;
        width: unset !important;
      }

      &.auth {
        padding: 0.24rem 0;
      }

      .auth-code-img {
        height: 0.6rem;
        transform-origin: right;
      }
    }

    .password-row {
      width: 100%;
      font-size: 0.32rem;
      line-height: 1.3rem;
      height: 1.3rem;
      color: #888;

      &:after {
        content: "";
        display: table;
        clear: both;
      }

      .no-password {
        float: left;
        color: #888;
      }

      .recode-password {
        float: right;
        word-spacing: normal;

        .switch-box {
          display: inline-block;
          position: relative;
          top: 0.16rem;
          margin-left: 0.1rem;
        }
      }
    }
  }

  .submit-button {
    height: 0.9rem;
    line-height: 0.9rem;
    font-size: 0.36rem;
    width: 100%;
    display: block;
    border-radius: 0.1rem;
    border: none;
    color: #fff;
  }

  .bottom {
    text-align: center;
    margin-top: 0;
    font-size: 0.32rem;
    color: #888;
    line-height: 1.68rem;
    .tag-a {
      text-decoration: underline;
    }
  }

  .bg-img {
    position: absolute;
    left: 0;
    top: 100%;
    transform: translateY(-100%);
    width: 100%;
    padding-bottom: 1.18rem;
    pointer-events: none;
  }

  .bg-img .parallax > use {
    fill-opacity: 0.2;
  }

  .parallax > use {
    animation: wave-move 20s linear infinite;
  }

  .parallax > use:nth-child(1) {
    animation-delay: -2s;
  }

  .parallax > use:nth-child(2) {
    animation-delay: -2s;
    animation-duration: 17s;
  }

  .parallax > use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
  }

  @keyframes wave-move {
    0% {
      transform: translate(-90px, 0);
    }

    100% {
      transform: translate(85px, 0);
    }
  }
}
.verify_all {
  user-select: none;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
  .verify_before {
    width: 3rem;
    height: 3.2rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    border-radius: 0.1rem;
    .verify_loading {
      width: 2.23rem;
      height: 2.23rem;
      margin: 0.26rem auto 0.2rem auto;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      // animation: verifyBefore 1s linear 0.2s infinite alternate;
    }
    .verify_loadingA {
      background-image: url("../../assets/img/verify/saomiao.gif");
    }
    .verify_loadingB {
      background-image: url("../../assets/img/verify/saomiao-b.gif");
    }
    .verify_loadingQP {
      background-image: url("../../assets/img/verify/saomiao-newqp.gif");
    }
    .verify_loadingBlush {
      background-image: url("../../assets/img/verify/saomiao-blush.gif");
    }
    > p {
      font-size: 0.26rem;
      color: #070707;
      text-align: center;
    }
    &.qp-verify_before {
      background: #000;
      > p {
        color: #f6cf32 !important;
      }
    }
    &.qp-verify_blush {
      background: #9c010f;
      > p {
        color: #f5dc9d !important;
      }
    }
  }
}
</style>
