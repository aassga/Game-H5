<template>
  <view-page class="login-box" :full-box="!isShowFixed">
    <div slot="content">
      <i class="icon iconfont h5-icon-left-menu-ico back-icon" @click="goBack()"></i>
      <div class="content">
        <div class="down-log" v-show="showDownLog && tabIndex === 1 && ['aqvns'].includes($config.name)">
          <div class="mask"></div>
          <div class="img-area" :style="{'top':(this.$store.state.main.windowHeight / 2) + 'px'}">
            <img
              v-if="['aqvns'].includes($config.name)"
              :src="require('@site/assets/img/admin/down_center.gif')"
            />
            <div class="download-btn" @click="onDownload"></div>
            <div class="close-btn" @click="showDownLog = false"></div>
          </div>
        </div>
        <img :style="'height:' + logoHeight" class="logo" :src="logoImg" alt />
        <img src="../../assets/img/login/vnst-header.png" class="header-img" />
        <div class="img-list">
          <img src="../../assets/img/login/vnst-item1.png" />
          <img src="../../assets/img/login/vnst-item2.png" />
          <img src="../../assets/img/login/vnst-item3.png" />
        </div>
        <div class="cont-box">
          <div v-if="tabIndex === 0" class="form">
            <ul>
              <li class="user-name">
                <i
                  class="icon iconfont h5-icon-new-index-user theme-color"
                ></i>
                <input
                  placeholder="请输入帐号"
                  ref="loginUserName"
                  v-model="userName"
                  @blur="userNameBlur"
                  @focus="userNameFocus"
                  type="text"
                  autocomplete="new-password"
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
                      <span
                        class="recordClear"
                        @click.stop="userRecordDelete(i)"
                      >
                        <van-icon name="clear" />
                      </span>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <i
                  class="icon iconfont h5-icon-new-index-password theme-color"
                ></i>
                <input-row
                  v-model="password"
                  placeholder="请输入密码"
                  type="password"
                  v-keyBroayStates
                />
              </li>
              <li
                v-if="loginVerify == 'imgCode'"
                v-show="isCaptcha && $store.state.user.code.authImg"
              >
                <i
                  class="icon iconfont h5-icon-new-index-yzm theme-color"
                ></i>
                <input-row
                  v-model="code"
                  placeholder="请输入验证码"
                  type="tel"
                  v-keyBroayStates
                  max-len="4"
                />
                <img
                  class="code-num"
                  :src="$store.state.user.code.authImg"
                  alt
                  @click="refreshArchCode"
                />
              </li>
            </ul>
          </div>
          <div v-if="tabIndex === 1" class="form register-form" ref="formHei">
            <ul>
              <li>
                <i
                  class="icon iconfont h5-icon-new-index-user theme-color"
                ></i>
                <input-row
                  v-model="modal.userName"
                  placeholder="帐号（6-10位字母或数字）"
                  type="text"
                  max-len="10"
                  v-keyBroayStates
                  :blurFunc="refreshArchCode"
                />
              </li>
              <li>
                <i
                  class="icon iconfont h5-icon-new-index-password theme-color"
                ></i>
                <input-row
                  v-model="modal.password"
                  placeholder="密码（8-20位字母或数字）"
                  type="password"
                  max-len="20"
                  v-keyBroayStates
                />
              </li>
              <li>
                <i
                  class="icon iconfont h5-icon-new-index-password theme-color"
                ></i>
                <input-row
                  v-model="modal.password2"
                  placeholder="请确认密码"
                  type="password"
                  max-len="20"
                  v-keyBroayStates
                />
              </li>
              <li v-for="(item, i) in registerList" :key="'input-' + i">
                <i :class="[item.key, item.class, 'theme-color']"></i>
                <input-row
                  v-model="modal[item.key]"
                  :placeholder="item.placeholder"
                  :type="item.type"
                  :maxLen="item.max + ''"
                  v-keyBroayStates
                />
                <button
                  v-if="item.key == 'sms'"
                  @click="stopTime"
                  :class="{ isGoTime: !isGoTime }"
                  class="message-code nvs-message-code theme-color"
                >
                  {{ isGoTime ? "获取验证码" : "重新获取(" + stepTime + ")" }}
                </button>
              </li>
              <li v-if="loginVerify == 'imgCode'" v-show="showAuth && isCaptcha && $store.state.user.code.authImg">
                <i
                  class="icon iconfont h5-icon-new-index-yzm theme-color"
                ></i>
                <input-row
                  v-model="vercode"
                  placeholder="请输入验证码"
                  type="tel"
                  max-len="4"
                  v-keyBroayStates
                />
                <img
                  class="code-num"
                  :src="$store.state.user.code.authImg"
                  alt
                  @click="refreshArchCode"
                />
              </li>
              <li v-if="selfSiteModel === 'invite_code'">
                <i
                  class="icon iconfont h5-icon-new-index-yqm theme-color"
                ></i>
                <input-row
                  v-model="agent"
                  placeholder="请输入邀请码"
                  type="tel"
                  :disabled="hasAgent"
                  v-keyBroayStates
                />
              </li>
            </ul>
          </div>
          <div v-if="tabIndex === 0" class="toolbar">
            <span
              class="forget-pwd"
              @click="toastText('请联系客服找回密码', 'top')"
              >忘记密码？</span
            >
            <span class="remeber_pwd">记住密码</span>
            <van-switch
              v-model="record"
              size="0.56rem"
              inactive-color="#fff"
            ></van-switch>
          </div>
          <button
            type="button"
            @click="onSubmit"
            :class="
              tabIndex === 0 && (submitted || userName.length === 0)
                ? 'disabled'
                : ''
            "
            class="submit theme-bg"
          >
            {{ tabIndex === 0 ? "立即登录" : "立即注册" }}
          </button>
          <div v-if="loginVerify == 'wyCode'" id="captchaVnst"></div>
          <div class="bottom-tip">
            <p v-if="tabIndex === 0">
              没有帐号？<span @click="goRegister" class="theme-color">立即注册</span>
            </p>
            <p v-if="tabIndex === 1">
              <img
                src="../../assets/img/login/Shape.png"
                alt=""
              />已有帐号？<span @click="goLogin" class="theme-color">立即登录</span>
            </p>
          </div>
        </div>
        <img class="bottom-img" src="../../assets/img/login/vnst-bottom.png">
      </div>
    </div>
    <slide-verify
      slot="content-static"
      v-if="verify"
      :userName="userName || modal.userName"
      @success="onSuccess"
      @closeVerify="closeVerify"
    ></slide-verify>
    <div id="captchaVnst"></div>
    <div
      slot="content-static"
      v-if="loginVerify == 'wyCode' && wyLoading"
      class="verify_all"
    >
      <div :class="['verify_before',{'qp-verify_before' : $config.newQP || $config.blackTheme}]">
        <div
          class="verify_loading"
          :class="verifyClass"
        ></div>
        <p>安全检测中</p>
      </div>
    </div>
  </view-page>
</template>

<script>
import BScroll from "better-scroll";
import SlideVerify from "../../components/slide-verify/index";
import logoMixin from "../home/theme/mixin";
export default {
  name: "VnstLogin",
  mixins: [logoMixin],
  data() {
    return {
      isGoTime: true,
      stepTime: 60,
      timeNode: null,
      tabIndex: 0,
      userName: "",
      password: "",
      interval: null,
      record: false,
      submitted: false,
      height: window.document.documentElement.offsetHeight,
      isCaptcha: false,
      agent: "",
      hasAgent: false,
      code: "",
      modal: {
        userName: "",
        password: "",
        password2: "",
        archCode: "",
      },
      vercode: "",
      showRecoed: false,
      userRecordList: [],
      showRecordList: [],
      verify: false,
      captchaIns: null,
      wyLoading: false,
      loginVerify: this.$store.state.main.VerificationCode || "imgCode", // type  tCode: 滑动验证 imgCode： 图片验证  wyCode：网易盾
      registerList: [],
      showAuth:null,
      selfSiteModel:null,
      showDownLog : true
    };
  },
  components: {
    SlideVerify,
  },
  created() {
    this.$store.state.main.windowHeight
    if(sessionStorage['showBlackAdvert'] && sessionStorage['showBlackAdvert'] == '1') {
      this.goRegister()
    }
    if (this.$route.query.index === "1") {
      this.goRegister();
    }
    if (localStorage["agent"]) {
      // c模式不直接进入注册
      if (this.personalMode !== "mode_c") {
        this.goRegister();
      }
      this.agent = localStorage["agent"];
      this.hasAgent = true;
      localStorage.setItem('agentFirst', true)
    }

    this.checkArchCode();

    this.userRecordList = this.$store.state.user.userRecordList;
    this.showRecordList = this.$store.state.user.userRecordList;
    this.initData(this.$store.state.main.config)
  },
  computed: {
    logoHeight() {
      return this.$config.logoChose ? this.$config.logoChose : "1rem";
    },
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
    isShowFixed(){
      return this.$store.state.main.keyBoardStatus
    },
    verifyClass() {
      if (this.$config.newQP || this.$config.blackTheme) {
        return 'verify_loadingQP'
      }else if(this.$config.home === 'xpj') {
        return 'verify_loadingA'
      }else {
        return 'verify_loadingB'
      }
    }
  },
  watch: {
    "$store.state.main.VerificationCode"(newVal) {
      this.loginVerify = newVal;
    },
    archCode() {
      this.modal.archCode = this.archCode;
    },
    "modal.userName"() {
      if (!this.modal.userName) {
        this.$store.state.user.code = {
          authImg: "",
          code: "",
        };
      }
    },
    "$store.state.main.config"(newVal) {
      this.initData(newVal)
    },
    tabIndex() {
      this.resetFrom();
      this.captchaIns && this.captchaIns.refresh();
      this.showDownLog = true
      this.$store.state.user.code = {
        authImg: "",
        code: ""
      };
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
    showRecoed() {
      this.initScroll();
    },
  },
  mounted() {
    let _this = this;
    document.addEventListener("visibilitychange", _this.checkViChange);
    this.initScroll();
  },
  methods: {
    initData(newVal) {
      this.showAuth = false;
      if (newVal) {
        const registerH5 = newVal.register.h5;
        let register = [];
        registerH5.forEach((v, i) => {
          register[i] = {};
          switch (v) {
            case "phone":
              register[i].placeholder = "请输入手机号";
              register[i].name = "手机号";
              register[i].class = "icon iconfont h5-icon-icon-iphone";
              register[i].value = "";
              register[i].key = v;
              register[i].type = "tel";
              register[i].check = /^1[\d]{10}$/;
              register[i].max = 11;
              break;
            case "sms":
              register[i].placeholder = "请输入验证码";
              register[i].name = "手机号验证码";
              register[i].class = "icon iconfont h5-icon-icon-yzm";
              register[i].value = "";
              register[i].key = v;
              register[i].type = "tel";
              register[i].check = /[\d]{6}/;
              register[i].max = 6;
              break;
            case "email":
              register[i].placeholder = "请输入邮箱地址";
              register[i].name = "邮箱地址";
              register[i].class = "icon iconfont h5-icon-icon-email";
              register[i].value = "";
              register[i].key = v;
              register[i].type = "text";
              register[i].check = /^[A-z\d_]+@[A-z\d_]+\.[a-z]+$/;
              register[i].max = 99;
              break;
            case "wechat":
              register[i].placeholder = "请输入微信号";
              register[i].name = "微信号";
              register[i].class = "icon iconfont h5-icon-icon-wechat";
              register[i].value = "";
              register[i].key = v;
              register[i].type = "text";
              register[i].check = /^[\S]+$/;
              register[i].max = 32;
              break;
            case "realName":
              register[i].placeholder = "真实姓名必须与银行卡姓名一致";
              register[i].name = "真实姓名";
              register[i].class = "icon iconfont h5-icon-icon-realname";
              register[i].value = "";
              register[i].key = v;
              register[i].type = "text";
              register[i].check = /^[\S]+$/;
              register[i].max = 10;
              break;
            case "payPassword":
              register[i].placeholder = "请输入支付密码";
              register[i].name = "支付密码";
              register[i].class = "icon iconfont h5-icon-icon-trans-password";
              register[i].value = "";
              register[i].key = v;
              register[i].type = "password";
              register[i].check = /^[\d]{6}$/;
              register[i].max = 6;
              break;
          }
        });
        let index = registerH5.indexOf("sms");
        if (index > -1) {
          this.showAuth = false;
        } else {
          this.showAuth = true;
        }
        this.selfSiteModel = newVal["site_model"]
        this.$nextTick(()=>{
          this.registerList = register
        })
      }
    },
    getWYdata() {
      let _this = this;
      _this.wyLoading = true;
      this.$store.dispatch("user/getYiDunCode").then((res) => {
        initNECaptcha(
          {
            element: "#captchaVnst",
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
                  userName: (_this.userName || _this.modal.userName).replace(
                    /\s/g,
                    ""
                  ),
                })
                .then((res) => {
                  if (res.code === 200) {
                    _this.onSuccess();
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
      if (this.tabIndex === 0) {
        this.getLoginUrl();
      } else {
        this.getRegisterUrl();
      }
    },
    // onFail(){
    // },
    // onRefresh(){
    // },
    getRegisterUrl() {
      this.$store.dispatch("user/register", {
        data: this.modal,
        record: this.record,
        callback: (res) => {
          if (typeof res === "string") {
            this.submitted = false;
            this.toastText(res, "top");
            this.refreshArchCode();
          } else if (res["code"] === 200) {
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
                    this.toastText(
                      res.message,
                      "top",
                      this.loginVerify == "imgCode" ? 1000 : 2000
                    );
                    setTimeout(() => {
                      this.$stomp.reInit();
                    }, 1000);
                  }
                }
              })
              .catch((err) => {});

            this.$store.dispatch("user/refreshBank").then();
            this.$store.dispatch("user/refreshUsdt").then();

            setTimeout(() => {
              this.submitted = false;
              if (res.data["activity_url"]) {
                if (/^http[s]?/.test(res.data["activity_url"] || "")) {
                  window.location.href = res.data["activity_url"];
                } else if (/^\//.test(res.data["activity_url"] || "")) {
                  window.location.href =
                    window.location.origin + res.data["activity_url"];
                } else {
                  window.location.href = "http://" + res.data["activity_url"];
                }
              } else {
                this.$router.replace("/");
              }
            }, 0);

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
          } else if (res["msg"]) {
            this.submitted = false;
            this.toastText(
              res["msg"],
              "top",
              this.loginVerify == "imgCode" ? 1000 : 2000
            );
            this.refreshArchCode();
            this.captchaIns && this.captchaIns.refresh();
          } else if (res["message"]) {
            this.submitted = false;
            this.toastText(
              res["message"],
              "top",
              this.loginVerify == "imgCode" ? 1000 : 2000
            );
            this.refreshArchCode();
            this.captchaIns && this.captchaIns.refresh();
          } else {
            this.submitted = false;
            this.toastText(
              "注册失败",
              "top",
              this.loginVerify == "imgCode" ? 1000 : 2000
            );
            this.refreshArchCode();
            this.captchaIns && this.captchaIns.refresh();
          }
        },
      });
    },
    getLoginUrl() {
      const data = {
        userName: this.userName.replace(/\s/g, ""),
        password: this.password.replace(/\s/g, ""),
        record: this.record,
      };
      if (this.isCaptcha) {
        if (this.loginVerify != "imgCode") {
          data.code = 1111;
        } else {
          data.code = this.code.replace(/\s/g, "");
        }
      }
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
                    this.toastText(
                      res.message,
                      "top",
                      this.loginVerify == "imgCode" ? 1000 : 2000
                    );

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
    initScroll() {
      setTimeout(() => {
        this.$refs.userRecordList &&
          new BScroll(this.$refs.userRecordList, {
            scrollY: true,
            scrollX: false,
            click: true,
            autoBlur: false,
          });
      }, 200);
    },
    checkViChange() {
      let nowTime = ~~((Date.now() - this.timeNode) / 1000);
      if (nowTime >= this.stepTime) {
        clearInterval(this.interval);
        this.stepTime = 60;
        this.isGoTime = true;
      } else {
        this.stepTime = 60 - nowTime;
        this.stopTime();
      }
    },
    stopTime() {
      if (!this.isGoTime) return false;
      if (!this.modal.phone || !/^1[\d]{10}$/.test(this.modal.phone)) {
        this.toastText("请输入正确的手机号", "top");
        return false;
      }
      this.$store.dispatch("user/getPhoneCode", {
        phone: this.modal.phone,
        callback: (res) => {
          if (res.code === 200) {
            this.toastText("短信验证码已发送，5分钟内有效", "top");
            this.timeNode = Date.now();
            this.isGoTime = false;
            this.interval = setInterval(() => {
              this.stepTime--;
              if (this.stepTime < 0) {
                this.isGoTime = true;
                this.stepTime = 60;
                clearInterval(this.interval);
              }
            }, 1000);
          } else {
            this.isGoTime = true;
            this.toastText(res.message, "top");
          }
        },
      });
    },
    goBack() {
      this.$router.push("/home");
    },
    goLogin() {
      this.tabIndex = 0;
    },
    goRegister() {
      this.tabIndex = 1;
      //注册时获取验证码
      if (this.loginVerify != "imgCode") return;
      this.refreshArchCode();
    },
    onSubmit(evt) {
      if (this.tabIndex === 0) {
        this.vnstOnLogin();
      } else {
        this.vnstOnregister();
      }
    },
    vnstOnLogin() {
      if (this.$config.preview) {
        this.previewAlert();
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
        if (this.loginVerify == "tCode") {
          this.verify = true;
        } else if (this.loginVerify == "wyCode") {
          this.getWYdata();
        } else {
          this.getLoginUrl();
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
      if (this.tabIndex === 0) {
        if (this.userName && !this.submitted && this.isCaptcha) {
          this.submitted = true;
          this.$store.dispatch("user/refreshAuthCode", {
            userName: this.userName || this.modal.userName,
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
      } else {
        this.$store.dispatch('user/refreshAuthCode', { userName: this.modal.userName })
      }
    },
    isNeedAuth(showAuth, code) {
      if (this.loginVerify != "imgCode") {
        return false;
      }
      if (showAuth) {
        let show = this.checkCode(code);
        return show;
      } else {
        return true;
      }
    },
    vnstOnregister() {
      if (this.$config.preview) {
        this.previewAlert();
        return;
      }

      if (this.submitted) return;
      if (this.modal.userName && this.modal.userName === this.modal.password) {
        this.toastText("登录密码不能与帐号相同", "top");
      } else if (
        this.checkUserForRegister(this.modal.userName) &&
        this.checkPasswordForRegister(this.modal.password) &&
        this.checkPassword2(this.modal.password, this.modal.password2) &&
        this.registerList.every((item) => {
          let tag = true;
          if (this.modal[item.key]) {
            this.$set(
              this.modal,
              item.key,
              this.modal[item.key].replace(/\s/g, "")
            );
            if (item.check.test(this.modal[item.key])) {
              tag = true;
            } else {
              tag = false;
              this.toastText("请输入正确的" + item.name, "top");
            }
          } else {
            tag = false;
            this.toastText(item.name + "不能为空", "top");
          }

          return tag;
        }) &&
        (this.selfSiteModel !== "invite_code" || this.checkAgent(this.agent)) &&
        (this.loginVerify == "imgCode"
          ? this.isNeedAuth(this.showAuth, this.vercode)
          : true)
      ) {
        this.submitted = true;
        if (
          this.selfSiteModel === "invite_code" ||
          this.selfSiteModel === "invite_link"
        ) {
          if (this.agent !== "") {
            this.modal["agent"] = this.modal["invite_code"] = this.agent;
          }

          if (this.vercode !== "") {
            this.modal["code"] = this.vercode;
          }
        }
        if (this.loginVerify == "tCode") {
          this.verify = true;
        } else if (this.loginVerify == "wyCode") {
          this.getWYdata();
        } else {
          this.getRegisterUrl();
        }
      }
    },
    resetFrom() {
      this.userName = "";
      this.password = "";
      this.code = "";
      if (!localStorage["agent"]) this.agent = "";
      this.modal = {
        userName: "",
        password: "",
        password2: "",
        archCode: "",
      };
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
  },
  beforeDestroy() {
    clearInterval(this.interval);
    this.$store.state.user.code = {
      authImg: "",
      code: "",
    };
    sessionStorage.removeItem('showBlackAdvert')
  },
};
</script>

<style lang="less" scoped>
/deep/ .user-input-row  {
  &::after{
    display: none;
  }
}
.login-box {
  background: linear-gradient(0deg, #e3f5ff, #ffffff);
}
.logo {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
.back-icon {
  position: absolute;
  left: 0;
  top: 0;
  height: 0.9rem !important;
  width: 0.9rem !important;
  line-height: 0.9rem !important;
  display: inline-block;
  font-size: 0.72rem;
  -webkit-transform: rotateZ(180deg) !important;
  transform: rotateZ(180deg) !important;
  color: #fff;
}
.content {
  width: 100%;
  box-sizing: border-box;
  .down-log {
    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.3);
      z-index: 9;
    }
    .img-area {
      position: absolute;
      width: 100%;
      margin-top: -2.8rem;
      img {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 99;
        width: 100%;
      }
      .download-btn {
        position: absolute;
        left: 0;
        top: 4.8rem;
        width: 100%;
        height: 1.3rem;
        z-index: 999;
      }
      .close-btn {
        position: absolute;
        right: 0rem;
        top: 0.25rem;
        width: 0.8rem;
        height: 0.8rem;
        z-index: 999;
      }
    }
  }
  .header-img {
    width: 100%;
    height: 3.28rem;
    display: block;
  }
  .img-list {
    display: flex;
    margin: 0.28rem auto;
    width: 7.02rem;
    justify-content: space-between;
    img {
      width: 2.22rem;
      height: 1.9rem;
    }
  }
  .cont-box {
    width: 7.02rem;
    margin: 0 auto;
    box-shadow: 0px 0.02rem 0.16rem 0px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    background-color: #fff;
  }
  .bottom-img {
    width: 100%;
    height: 1.5rem;
    margin-top: 0.24rem;
    margin-bottom: 0.25rem;
  }
  .form {
    width: 7.02rem;
    margin: 0 auto;
    height: auto;
    ul {
      height: auto;
      li {
        height: 1.09rem;
        align-items: center;
        display: flex;
        box-sizing: border-box;
        position: relative;
        &:after {
          position: absolute;
          right: 0;
          bottom: 0;
          height: 1px;
          content: "";
          transform: scaleY(0.5);
          background-color: #efefef;
          width: 100%;
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
            z-index: 999;
            border: 0.01rem solid #c0c0c0;
            max-height: 3rem;
            overflow-y: hidden;
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
        i {
          width: 0.44rem;
          height: 0.44rem;
          margin-left: 0.32rem;
          margin-top: 0.1rem;
          background-size: contain;
          background-position: center center;
          background-repeat: no-repeat;
        }
        input {
          flex: 1;
          margin-left: 0.24rem;
          font-size: 0.32rem;
          margin-top: 0.02rem;
        }
        input::-webkit-input-placeholder {
          font-size: 0.32rem;
          color: #bbbbbb;
          font-weight: 400;
          text-transform: capitalize !important;
        }

        input::-moz-placeholder {
          font-size: 0.32rem;
          color: #bbbbbb;
          font-weight: 400;
          text-transform: capitalize !important;
        }

        input::-ms-input-placeholder {
          font-size: 0.32rem;
          color: #bbbbbb;
          font-weight: 400;
          text-transform: capitalize !important;
        }

        .user,
        .pwd,
        .record {
          color: #00bdd4;
        }
        .code-num {
          width: 0.94rem;
          height: 0.56rem;
          margin-right: 0.22rem;
          background-color: #00bdd4;
        }
        .message-code {
          width: 2.6rem;
          height: 0.58rem;
          // background: rgba(241, 241, 241, 1);
          background: #fff;
          border-radius: 0.1rem;
          border: none;
          font-size: 0.28rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          border: 1px solid #00bdd4;
          margin-right: 0.2rem;
        }
        .isGoTime {
          background: #fff;
          border: 1px solid rgb(139, 139, 139);
          color: #fff;
        }
      }
    }
  }
  .toolbar {
    height: 1.38rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0.27rem;
    .forget-pwd {
      font-size: 0.3rem;
      //font-family: PingFang-SC-Medium;
      //font-weight: 400;
      color: rgba(136, 136, 136, 1);
      flex: 1;
      text-align: left;
    }

    .remeber_pwd {
      color: rgba(136, 136, 136, 1);
      font-size: 0.3rem;
      //font-weight: 400;
      margin-right: 0.16rem;
    }

    .van-switch {
      transition: all 400ms;
    }

    .van-switch--on {
      transition: all 400ms;
    }
  }
  .submit {
    height: 0.96rem;
    width: 6.52rem;
    line-height: 0.96rem;
    text-align: center;
    color: #ffffff;
    box-shadow: 0px 5px 25px 0px rgba(38, 91, 77, 0.06);
    border-radius: 0.1rem;
    border: 0;
    font-size: 0.36rem;
    font-weight: bold;

    &.disabled,
    &:disabled {
      opacity: 0.7;
    }
  }
  .register-form {
    height: auto;

    .phone {
      color: #00bdd4;
    }

    .sure-pwd,
    .email,
    .sms,
    .wechat,
    .realName,
    .payPassword,
    .yqm {
      color: #00bdd4;
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
      background-image: url('../../assets/img/verify/saomiao-newqp.gif');
    }
    > p {
      font-size: 0.26rem;
      color: #070707;
      text-align: center;
    }
    &.qp-verify_before {
      background: #000;
      > p {
        color: #F6CF32 !important;
      }
    }
  }
}
.bottom-tip {
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
  p {
    color: #8B8B8B;
    font-size: 0.32rem;
    text-align: center;
    span {
      font-size: 0.32rem;
      color: #4A8DFB;
    }
    img {
      display: inline-block;
      width: 0.39rem;
      height: 0.24rem;
      margin-right: .1rem;
      vertical-align: unset;
    }
  }
}
</style>
