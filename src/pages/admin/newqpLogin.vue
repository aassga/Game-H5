<template>
  <view-page class="login-box" :full-box="!isShowFixed">
    <div slot="content">
    <div class="qp-home-header" v-if="$config.newQP">
      <img class="home-logo" :src="logoImg" alt="" v-if="$config.name !== '500w'">
      <img src="@src/assets/img/home/qp/down-gif.gif" :class="['right-button',{'login-right':$store.state.user.token}]" @click="onDownload">
    </div>
      <div class="content">
        <a class="back-icon" href="javascript:;" @click="goBack()">
          <div class="close-wrapper">
            <div class="line_1"></div>
            <div class="line_2"></div>
          </div>
        </a>
        <div class="btn-group">
          <span
            :class="['top-login', { active: tabIndex === 0 }]"
            @click="goLogin"
            >登录</span
          >
          <span
            :class="['top-reg', { active: tabIndex === 1 }]"
            @click="goRegister"
            >注册</span
          >
        </div>
        <div class="cont-box">
          <div v-if="tabIndex === 0" class="form">
            <ul>
              <li class="user-name">
                <i class="icon iconfont h5-icon-zhanghao1"></i>
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
                <i class="icon iconfont h5-icon-mima1"></i>
                <input-row
                  v-model="password"
                  placeholder="请输入密码"
                  type="password"
                  :type="loginPwShow ? 'text' : 'password'"
                  v-keyBroayStates
                  max-len="20"
                />
                <i :class="['icon','iconfont','yanjin',loginPwShow ? 'h5-icon-ziyuan6' : 'h5-icon-xianshimima',]"
                  @click="loginPwShow = !loginPwShow"
                ></i>
              </li>
              <li
                v-if="loginVerify == 'imgCode'"
                v-show="isCaptcha && $store.state.user.code.authImg"
              >
                <i class="icon iconfont h5-icon-yanzhengma1"></i>
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
                <i class="icon iconfont h5-icon-zhanghao1"></i>
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
                <i class="icon iconfont h5-icon-mima1"></i>
                <input-row
                  v-model="modal.password"
                  placeholder="密码（8-20位字母或数字）"
                  :type="regPwShow ? 'text' : 'password'"
                  max-len="20"
                  v-keyBroayStates
                />
                <i :class="['icon','iconfont','yanjin',regPwShow ? 'h5-icon-ziyuan6' : 'h5-icon-xianshimima',]"
                  @click="regPwShow = !regPwShow"
                ></i>
              </li>
              <li>
                <i class="icon iconfont h5-icon-mima1"></i>
                <input-row
                  v-model="modal.password2"
                  placeholder="请确认密码"
                  :type="regPw2Show ? 'text' : 'password'"
                  max-len="20"
                  v-keyBroayStates
                />
                <i :class="['icon','iconfont','yanjin',regPw2Show ? 'h5-icon-ziyuan6' : 'h5-icon-xianshimima',]"
                  @click="regPw2Show = !regPw2Show"
                ></i>
              </li>
              <li v-for="(item, i) in registerList" :key="'input-' + i">
                <i :class="[item.key, item.class]"></i>
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
                  class="message-code nvs-message-code"
                >
                  {{ isGoTime ? "获取验证码" : "重新获取(" + stepTime + ")" }}
                </button>
              </li>
              <li v-if="loginVerify == 'imgCode'" v-show="showAuth && isCaptcha && $store.state.user.code.authImg">
                <i class="icon iconfont h5-icon-yanzhengma1"></i>
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
                <i class="icon iconfont h5-icon-yanzhengma1"></i>
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
          <button
            type="button"
            @click="onSubmit"
            :class="
              tabIndex === 0 && (submitted || userName.length === 0)
                ? 'disabled'
                : ''
            "
            class="submit"
          >
            {{ tabIndex === 0 ? "立即登录" : "立即注册" }}
          </button>
          <div v-if="tabIndex === 0" class="toolbar">
            <span
              class="forget-pwd"
              @click="toastText('请联系客服找回密码', 'top')"
              >忘记密码？</span
            >
            <span class="remeber_pwd" @click="inService()">在线客服</span>
          </div>
          <div v-if="loginVerify == 'wyCode'" id="captchaVnst"></div>
        </div>
        <div class="down-shade" v-if="isShade">
          <div :class="['down-box',{'jj-down-box':$config.name === '99qp'}]">
            <div class="mask"></div>
            <div class="down-box-top">
              <span class="az">{{$config.name === '99qp' ? '300' : '100'}}万人安装</span>
              <img
                class="down-close"
                @click="onCloseShade"
                src="../../assets/img/login/dowm/down_close_d.png"
                alt=""
              />
            </div>
            <div class="down-log">
              <img
                :src="require('@site/assets/img/admin/down_center.gif')"
                alt=""
              />
            </div>
            <img src="../../assets/img/99qp-domain.png" class="domain" v-if="$config.name === '99qp'">
            <div class="down-btn">
              <span @click="onDownload('enterprisesignLink')"
                ><img src="../../assets/img/login/dowm/ios_btn.png" alt=""
              /></span>
              <span @click="onDownload('enterprisesignLink')"
                ><img src="../../assets/img/login/dowm/and_btn.png" alt=""
              /></span>
            </div>
          </div>
        </div>
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
      <div :class="['verify_before',{'qp-verify_before' : $config.newQP}]">
        <div
          class="verify_loading"
          :class="verifyClass"
        ></div>
        <p>安全检测中</p>
      </div>
    </div>
    <div slot="content-static" v-show="isShow" class="down-bottom" @click="onDownload" v-no-touch-move>
      <img :src="require('@site/assets/img/admin/down_bottom.gif')" alt=""/>
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
      showAuth: null,
      selfSiteModel: null,
      loginPwShow: false,
      regPwShow: false,
      regPw2Show: false,
      isShade:false,
      isShow:true,
    };
  },
  components: {
    SlideVerify,
  },
  created() {
    if (
      sessionStorage["showBlackAdvert"] &&
      sessionStorage["showBlackAdvert"] == "1"
    ) {
      this.goRegister();
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
      localStorage.setItem("agentFirst", true);
    }

    this.checkArchCode();

    this.userRecordList = this.$store.state.user.userRecordList;
    this.showRecordList = this.$store.state.user.userRecordList;
    this.initData(this.$store.state.main.config);
  },
  computed: {
    logoImg() {
      // let img = "";
      // if (
      //   localStorage["main/logoInfo"] &&
      //   JSON.parse(localStorage["main/logoInfo"]).length > 0
      // ) {
      //   try {
      //     JSON.parse(localStorage["main/logoInfo"]).forEach((ff) => {
      //       if (ff.position === "register_logo" && ff.clientType === "mobile") {
      //         img = localStorage.SiteStaticsUrl + ff.body[0].img;
      //       }
      //     });
      //   } catch (error) {
      //     img = require("@site/assets/img/admin/admin-logo.png");
      //   }
      // } else {
      //   img = require("@site/assets/img/admin/admin-logo.png");
      // }
      return require("@site/assets/img/home/logo.png");
    },
    isShowFixed() {
      return this.$store.state.main.keyBoardStatus;
    },
    verifyClass() {
      if(this.$config.home === 'xpj') {
        return 'verify_loadingA'
      }else if (this.$config.home === 'qp' && this.$config.newQP) {
        return 'verify_loadingQP'
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
      this.initData(newVal);
    },
    tabIndex() {
      this.resetFrom();
      this.captchaIns && this.captchaIns.refresh();
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
    if (this.$mobileDevice.isAndroid) {
      let originalHeight = document.documentElement.clientHeight || document.body.clientHeight
      window.addEventListener('resize', () => {
        var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight
        if (resizeHeight - 0 < originalHeight - 0) {
          // 当软键盘弹起，在此处操作
          setTimeout(() => {
            this.$refs['view-page'].scroll.scrollTo(0, -(this.offset(document.querySelectorAll(':focus')[0]).top - window.innerHeight / 3), 0)
          }, 20)
          this.isShow = false
        } else {
          // 当软键盘收起，在此处操作
          this.isShow = true
          setTimeout(() => {
            this.$refs['view-page'].scroll.scrollTo(0, 0, 0)
          }, 20)
        };
      })
    }
    if (this.$mobileDevice.isIOS) {
      document.body.addEventListener('focusin', () => {
        // 软键盘弹出的事件处理
        this.isShow = false
        window.scrollTo(0, 0)
      })
      document.body.addEventListener('focusout', () => {
        // 软键盘收起显示底部解决IOS底部弹起
        this.isShow = true
      })
      setTimeout(() => {
        // 当焦点在弹出层的输入框之间切换时先不归位
        window.scroll(0, 0) // 确定延时后没有聚焦下一元素，是由收起键盘引起的失焦，则强制让页面归位
      }, 30)
    }
    // if(this.$config.name === 'amxpj') {
    //   history.pushState(null, null, document.URL);
    //   window.addEventListener('popstate', function () {
    //       history.pushState(null, null, document.URL);
    //   });
    // }
  },
  methods: {
    //关闭遮罩层广告
    onCloseShade() {
      this.isShade = false;
      this.isSf = true;
    },
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
        this.selfSiteModel = newVal["site_model"];
        this.$nextTick(() => {
          this.registerList = register;
        });
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
      this.isShade = false
      this.tabIndex = 0;
    },
    goRegister() {
      this.isShade = true
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
      this.loginPwShow = false;
      this.regPwShow = false;
      this.regPw2Show = false;
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
    sessionStorage.removeItem("showBlackAdvert");
  },
};
</script>

<style lang="less" scoped>
.qp-home-header {
  height: 0.88rem;
  width: 100%;
  background-color: #C62721;
  position: relative;
  box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.3);
  background-color: #080808;
  border-bottom: 0.02rem solid rgba(248, 248, 248, 0.1);
  .home-logo {
    float: left;
    height: 100%;
    padding: 0;
    margin-left: 0.18rem;
  }
  .right-button {
    float: right;
    width: 1.9rem;
    margin-top: 0.06rem;
    margin-right: 0.24rem;
  }
}
  .home-right-button-logout{
    position: absolute;
    right: 0.24rem;
    top: 0;
    font-size: 0.28rem;
    line-height: 0.9rem;
    color: #fff;
  }

  .home-right-icon {
    position: absolute;
    display: block;
    width: 0.3rem;
    height: 0.3rem;
    right: 105%;
    top: 0.3rem;
}
/deep/ .user-input-row {
  &::after {
    display: none;
  }
}
.login-box {
  background-color: #0e0e0e !important;
  overflow: hidden;
}
.back-icon {
  position: absolute;
  right: 0.74rem;
  top: 0.48rem;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  .close-wrapper {
    width: 0.41rem;
    height: 0.41rem;
    .line_1 {
      position: absolute;
      width: 1px;
      height: 0.41rem;
      margin-left: 0.2rem;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      background: #d1d1d1;
      border-radius: 0.1rem;
    }
    .line_2 {
      position: absolute;
      width: 1px;
      height: 0.41rem;
      margin-left: 0.2rem;
      -webkit-transform: rotate(135deg);
      transform: rotate(135deg);
      background: #b9b8b8;
      border-radius: 0.1rem;
    }
  }
}

.down-shade {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 3.5rem;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  z-index: 101;
  .down-box {
    width: 100%;
    height: 3.92rem;
    position: relative;
    top: 0.18rem;
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      height: 1rem;
      width: 100%;
      background-color: black;
      z-index: -1;
    }
    .down-box-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 0.36rem;
      .az {
        width: 1.94rem;
        height: 0.44rem;
        background-color: #b70008;
        border-top-right-radius: 0.44rem;
        border-bottom-right-radius: 0.44rem;
        font-size: 0.28rem;
        font-family: PingFang-SC-Bold;
        color: #fff;
      }
      .down-close {
        cursor: pointer;
        width: 0.4rem;
        height: 0.4rem;
      }
    }

    .down-log {
      margin: 0.1rem 0 0.2rem 0;
      img {
        width: 100%;
      }
    }
    .domain {
      width: 5.5rem;
      margin-bottom: 0.2rem;
    }
    &.jj-down-box {
      .mask {
        height: 8rem;
      }
      .down-log {
        margin: 0.1rem 0 0rem 0;
      }
    }
    .down-btn {
      span {
        display: inline-block;
        &:first-child {
          margin-right: 0.16rem;
          animation: heart_beat 0.8s infinite linear;
          cursor: pointer;
          img {
            width: 3.08rem;
            height: 0.9rem;
          }
        }
        &:last-child {
          margin-left: 0.16rem;
          animation: heart_beat 0.8s infinite linear;
          animation-delay: 0.4s;
          cursor: pointer;
          img {
            width: 3.08rem;
            height: 0.9rem;
          }
        }
      }
      @keyframes heart_beat {
        0% {
          transform: scale(0.9);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(0.9);
        }
      }
    }
  }
}
.down-bottom{
  position: fixed;
  bottom: -0.1rem;
  z-index: 502;
  background: #000;
  height: 1.4rem;
  img{
    width:100%;
  }
}
.content {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  transition: all .8s;
  padding-bottom: 4.4rem;
  .btn-group {
    width: 3.4rem;
    margin: 0.9rem auto 0;
    display: flex;
    justify-content: space-around;
    span {
      color: #a3a3a3;
      font-size: 0.42rem;
      position: relative;
      &.active {
        color: #ffdd00;
        text-decoration: #00bdd4;
        &::after {
          position: absolute;
          box-sizing: border-box;
          content: " ";
          right: 0;
          bottom: 0;
          left: 0rem;
          border-bottom: 0.03rem solid #ffdd00;
        }
      }
    }
  }
  .cont-box {
    width: 6rem;
    margin: 0 auto;
    overflow: hidden;
  }
  .form {
    width: 100%;
    margin: 0 auto;
    height: auto;
    ul {
      height: auto;
      li {
        width: 100%;
        height: 0.82rem;
        align-items: center;
        display: flex;
        box-sizing: border-box;
        position: relative;
        margin-top: 0.43rem;
        border: 0.02rem solid rgba(248, 248, 248, 0.2);;
        border-radius: 0.45rem;
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
          margin-left: 0.21rem;
          font-size: 0.5rem;
          color: #cccccc !important;
        }
        .yanjin {
          position: absolute;
          right: 0.2rem;
          font-size: 0.26rem;
        }
        input {
          flex: 1;
          margin-left: 0.24rem;
          font-size: 0.32rem;
          color: #f8f8f8;
        }
        input::-webkit-input-placeholder {
          font-size: 0.32rem;
          text-transform: capitalize !important;
          color: #adafbb;
        }

        input::-moz-placeholder {
          font-size: 0.32rem;
          text-transform: capitalize !important;
          color: #adafbb;
        }

        input::-ms-input-placeholder {
          font-size: 0.32rem;
          text-transform: capitalize !important;
          color: #adafbb;
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
          width: 2.5rem;
          height: 0.58rem;
          background: #fff;
          border-radius: 0.1rem;
          border: none;
          font-size: 0.28rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          border: none !important;
          margin-right: 0.2rem;
        }
        .isGoTime {
          background: #fff;
          border: 1px solid rgb(139, 139, 139);
          color: #fff;
        }
        /deep/ label {
          height: 100%;
          input {
            height: 0.5rem;
            line-height: 0.5rem;
            font-size: 0.32rem;
            color: #f8f8f8;
            &::-webkit-input-placeholder {
              font-size: 0.32rem;
              text-transform: capitalize !important;
            }
            &::-moz-placeholder {
              font-size: 0.32rem;
              text-transform: capitalize !important;
            }
            &::-ms-input-placeholder {
              font-size: 0.32rem;
              text-transform: capitalize !important;
            }
          }
        }
      }
    }
  }
  .toolbar {
    width: 6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.3rem auto 0;
    font-size: 0.3rem;
    color: #9e9e9e;
    .forget-pwd {
      flex: 1;
      text-align: left;
    }
    .remeber_pwd {
      color: rgba(136, 136, 136, 1);
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
    width: 6rem;
    line-height: 0.96rem;
    text-align: center;
    color: #0d0d0d;
    border-radius: 0.48rem;
    border: 0;
    font-size: 0.4rem;
    font-weight: bold;
    background: linear-gradient(180deg, #f2ed76 0%, #ecbd00 97%, #f0ca4c 100%);
    margin-top: 0.6rem;
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
</style>
