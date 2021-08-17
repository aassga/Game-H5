<template>
  <view-page class="login-box" :full-box="!isShowFixed" ref="view-page">
    <div slot="content">
      <div class="content" v-show="!showStep">
        <a class="back-icon" href="javascript:;" @click="goBack()">
        </a>
        <div class="head">
          <img class="img-bg" :src="loginTopImg"/>
          <!-- <div class="down-btn down-btn1">
            <span @click="onDownload"
              ><img src="../../assets/img/login/kyqp/and_btn.png" alt=""
            /></span>
            <span @click="onDownload"
              ><img src="../../assets/img/login/kyqp/ios_btn.png" alt=""
            /></span>
          </div> -->
        </div>
        <div class="title">
          <span @click="goLogin" :class="tabIndex ===0?'active':'theme-color-white'">登录</span>
          <span @click="goRegister" :class="tabIndex ===1?'active':'theme-color-white'">注册</span>
        </div>
        <div class="cont-box">
          <div v-if="tabIndex === 0" class="form">
            <ul>
              <li class="user-name">
                <i>
                  <img src="../../assets/img/login/fhcp/user-icon.png" alt="">
                </i>
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
                <i>
                  <img src="../../assets/img/login/fhcp/pass-icon.png" alt="">
                </i>
                <input-row
                  v-model="password"
                  placeholder="请输入密码"
                  type="password"
                  v-keyBroayStates
                  max-len="20"
                />
              </li>
              <li
                v-if="loginVerify == 'imgCode'"
                v-show="isCaptcha && $store.state.user.code.authImg"
              >
                <i>
                  <img src="../../assets/img/login/fhcp/sms-icon.png" alt="">
                </i>
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
                <i>
                  <img src="../../assets/img/login/fhcp/user-icon.png" alt="">
                </i>
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
                <i>
                  <img src="../../assets/img/login/fhcp/pass-icon.png" alt="">
                </i>
                <input-row
                  v-model="modal.password"
                  placeholder="密码（8-20位字母或数字）"
                  :type="regPwShow ? 'text' : 'password'"
                  max-len="20"
                  v-keyBroayStates
                />
                <span class="yanjin" @click="regPwShow = !regPwShow"
                >
                  <img src="../../assets/img/login/fhcp/yanjin.png" alt="">
                </span>
              </li>
              <li>
                <i>
                  <img src="../../assets/img/login/fhcp/pass2-icon.png" alt="">
                </i>
                <input-row
                  v-model="modal.password2"
                  placeholder="请确认密码"
                  :type="regPw2Show ? 'text' : 'password'"
                  max-len="20"
                  v-keyBroayStates
                />
                <span class="yanjin" @click="regPw2Show = !regPw2Show"
                >
                  <img src="../../assets/img/login/fhcp/yanjin.png" alt="">
                </span>
              </li>
              <li v-for="(item, i) in registerList" :key="'input-' + i">
                <i>
                  <img src="../../assets/img/login/fhcp/phone-icon.png" v-if="item.key == 'phone'">
                  <img src="../../assets/img/login/fhcp/sms-icon.png" v-else>
                </i>
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
                <i>
                  <img src="../../assets/img/login/fhcp/sms-icon.png" alt="">
                </i>
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
                <i>
                  <img src="../../assets/img/login/fhcp/sms-icon.png" alt="">
                </i>
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
            <span class="forget-pwd" @click="toastText('请联系客服找回密码', 'top')">忘记密码？</span>
            <span class="remeber_pwd">记住密码</span>
            <img src="../../assets/img/login/kyqp/open.png" v-if="record" @click="record = false">
            <img src="../../assets/img/login/kyqp/close.png" v-else @click="record = true">
          </div>
          <img src="../../assets/img/login/kyqp/login-btn.png" class="submit" @click="onSubmit" v-if="tabIndex === 0">
          <img src="../../assets/img/login/kyqp/reg-btn.png" class="submit" @click="onSubmit" v-if="tabIndex === 1">
          <div v-if="loginVerify == 'wyCode'" id="captchaVnst"></div>
        </div>
        <div class="bottom-tip">
          <p v-if="tabIndex ===0">还没有帐号，<span @click="goRegister" class="theme-color-yellow">去创建？</span></p>
          <p v-if="tabIndex ===1"><img src="../../assets/img/login/home-login-b/Shape.png" alt="">已有帐号，<span @click="goLogin" class="theme-color-yellow">去登录</span></p>
        </div>
        <drag-box @clickHandle="inService()" :h="1.47" :w="1" :x="6" :y="3.3" v-if="$config.name !== 'ylhg'">
          <div slot="content">
            <img :src="$config.blackTheme ? require('../../assets/img/login/yellow-kefu.png') : require('../../assets/img/login/red-kefu.png')" alt="" style="width:100%;height:100%">
          </div>
        </drag-box>

        <div class="down-shade" v-if="isShade">
        <div class="down-box">
          <!-- <div class="mask"></div> -->
          <div class="down-box-top">
            <!-- <span class="az">800万人安装</span> -->
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
          <!-- <img :src="require('../../assets/img/login/kyqp/' + $config.name +'-domain.png')" class="domain" v-if="$config.name !== '99qp'"> -->
          <div class="down-box-bottom" @click="onDownload"></div>
          <!-- <div class="down-btn">
            <span @click="onDownload"
              ><img src="../../assets/img/login/kyqp/and_btn.png" alt=""
            /></span>
            <span @click="onDownload"
              ><img src="../../assets/img/login/kyqp/ios_btn.png" alt=""
            /></span>
          </div> -->
        </div>
      </div>
      </div>
      <div class="teachStep" v-show="showStep">
        <img :src="require('@site/assets/img/download/help.jpg')" alt="">
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
    <div slot="content-static" v-show="isShow && !showStep" class="down-bottom" @click="onDownload" v-no-touch-move>
      <img :src="require('@site/assets/img/admin/down_bottom.gif')" alt=""/>
    </div>
    <div slot="content-static" v-show="showStep" class="steptxt" @click="showStep = false" v-no-touch-move>
      <div>关闭教程</div>
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
      isShade:false,
      isShow:true,
      showStep: false,
      regPwShow: false,
      regPw2Show: false,
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
    if(!['hty','dqr','839qp','103qp','fhcp','aqvns','dalao'].includes(this.$config.name)) {
      this.goRegister()
    }
    this.checkArchCode();

    this.userRecordList = this.$store.state.user.userRecordList;
    this.showRecordList = this.$store.state.user.userRecordList;
    this.initData(this.$store.state.main.config);
  },
  computed: {
    logoImg(){
      return require('@site/assets/img/admin/admin-logo.png')
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
    },
    loginTopImg(){
     return this.$config.name==='tyc86'? 
     require('@/assets/img/login/tyc86/login-bg.png'):
     require('@/assets/img/login/tccp/login-bg.png')
    }
  },
  watch: {
    showStep ( ){
      this.$refs['view-page'].scroll.scrollTo(0, 0, 0)
      this.$refs['view-page'].scrollToTop()
    },
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
  },
  methods: {
    offset(element) {
      var offest = {
          top: 0,
          left: 0
      };
      var _position;
      getOffset(element, true);

  return offest;

  // 递归获取 offset, 可以考虑使用 getBoundingClientRect
  function getOffset(node, init) {
      // 非Element 终止递归
      if (node.nodeType !== 1) {
          return;
      }
      _position = window.getComputedStyle(node)['position'];

      // position=static: 继续递归父节点
      if (typeof(init) === 'undefined' && _position === 'static') {
          getOffset(node.parentNode);
          return;
      }
      offest.top = node.offsetTop + offest.top - node.scrollTop;
      offest.left = node.offsetLeft + offest.left - node.scrollLeft;

      // position = fixed: 获取值后退出递归
      if (_position === 'fixed') {
          return;
      }

      getOffset(node.parentNode);
  }
},
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
      this.regPwShow = false;
      this.regPw2Show = false;
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
    sessionStorage.removeItem("showBlackAdvert");
  },
};
</script>

<style lang="less" scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.15rem 0.27rem;
  .forget-pwd {
    font-size: 0.3rem;
    color: #ABA8A8;
    flex: 1;
    text-align: left;
    font-family: "Microsoft YaHei", Arial, Verdana, SimSun, SimHei, STHeiti, Helvetica, sans-serif;
  }
  .remeber_pwd {
    color: #ABA8A8;
    font-size: 0.3rem;
    margin-right: 0.16rem;
    font-family: "Microsoft YaHei", Arial, Verdana, SimSun, SimHei, STHeiti, Helvetica, sans-serif;
  }
  img {
    width: 1rem;
    z-index: 999;
  }
}
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
  background-color: rgb(82, 1, 7) !important;
  overflow: hidden;
}
.back-icon {
  position: absolute;
  width: 0.6rem;
  height: 0.6rem;
  top: 0.15rem;
  left: 0.15rem;
  font-size: 0.28rem;
  z-index: 1;
  &:before {
    content: "";
    position: absolute;
    width: 0.26rem;
    height: 0.26rem;
    border: 0.02rem solid #fff;
    border-width: 0.04rem 0 0 0.04rem;
    -webkit-transform: rotate(315deg);
    transform: rotate(315deg);
    top: 0.16rem;
    left: 0.14rem;
  }
}

.down-shade {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 9.1rem;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  z-index: 101;
  .down-box {
    width: 100%;
    height: 4.4rem;
    position: relative;
    top: 0rem;
    padding: 0 0.2rem;
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      height: 1rem;
      width: 100%;
      z-index: -1;
    }
    .down-box-top {
      position: absolute;
      top: 0;
      right: 0;
      width: 0.8rem;
      height: 0.8rem;
      .down-close {
        cursor: pointer;
        width: 0.4rem;
        height: 0.4rem;
        transform: translate(-.2rem, -.3rem);
      }
    }
    .down-box-bottom {
      position: absolute;
      bottom: 0;
      display: block;
      width: 100%;
      height: 1.2rem;
    }
    .down-log {
      margin: 0.1rem 0 0rem 0;
      img {
        width: 100%;
      }
    }
    .domain {
      width: 5.5rem;
      margin-bottom: 0.2rem;
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
.down-btn {
  span {
    display: inline-block;
    animation: heart_beat 0.8s infinite linear;
    cursor: pointer;
    img {
      width: 3.08rem;
      height: 1rem;
    }
    &:first-child {
      margin-right: 0.16rem;
    }
    &:last-child {
      margin-left: 0.16rem;
    }
  }
  &.down-btn1 {
    width: 100%;
    position: absolute;
    top: 3rem;
    display: flex;
    justify-content: center;
    img {
      width: 2.7rem;
      height: 0.85rem;
    }
  }
}
.down-bottom{
  position: fixed;
  bottom: 0rem;
  z-index: 502;
  background: #000;
  height: 1.4rem;
  img{
    width:100%;
  }
}
.teachStep {
  z-index: 999;
  img {
    width: 100%;
  }
}
.steptxt {
  position: fixed;
  bottom: 0rem;
  z-index: 502;
  background: rgba(0,0,0,0.9);
  color: #FCD287;
  font-size: 0.38rem;
  height: 1.1rem;
  text-align: center;
  line-height: 1.1rem;
  width: 100%;
  font-family: "Microsoft YaHei", Arial, Verdana, SimSun, SimHei, STHeiti, Helvetica, sans-serif;
}
.content {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  transition: all .8s;
  padding-bottom: 2.6rem;
  .head {
    width: 100%;
    height: 5.9rem;
    background-size: 100% 100%;
    position: fixed;
    .img-bg {
      width: 100%;
    }
  }
  .title {
    padding: 3.7rem 0.24rem 0 0.24rem;
    box-sizing: border-box;
    display: flex;

    > span {
      display: inline-flex;
      height: .9rem;
      flex: 1;
      justify-content: center;
      align-items: center;
      font-size: 0.4rem;
      border: none;
      // border-bottom: 2px solid #efefef;
      border-bottom: 0;
      background-color: rgb(143, 0, 12);
      z-index: 2;

      &:nth-child(1) {
        border-right: 0;
        border-radius: 0.2rem 0 0 0;
      }

      &:nth-child(2) {
        border-left: 0;
        border-radius: 0 0.2rem 0 0;
      }
    }

    .active {
      color: #f9d186;
      border-bottom: 0.05rem solid #f9d186;
    }
  }
  // .btn-group {
  //   width: 100%;
  //   margin: 4.2rem auto 0;
  //   display: flex;
  //   justify-content: space-around;
  //   background: url(../../assets/img/login/kyqp/logBg.png) no-repeat;
  //   background-size: cover;
  //   height: 0.965rem;
  //   overflow: hidden;
  //   img {
  //     width: 50%;
  //     z-index: 99;
  //   }
  // }
  .cont-box {
    width: auto;
    background: rgb(143, 0, 12);
    border-radius: 0 0 10px 10px;
    position: relative;
    margin: 0 0.24rem;
    overflow: hidden;
  }
  
  .bottom-tip {
    margin-top: 0.3rem;
    p {
      color: #CACDD1;
      font-size: 0.30rem;
      text-align: center;
      span {
        color: #FFA800;
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
  .banner {
    font-size: 0;
    img {
      width: 100%;
      margin: 0.1rem 0;
    }
  }
  .checkStep {
    color: #FCD287;
    text-align: center;
    font-size: 0.32rem;
    margin-top: 0.34rem;
    margin-bottom: 0.1rem;
    font-weight: bold;
    font-family: "Microsoft YaHei", Arial, Verdana, SimSun, SimHei, STHeiti, Helvetica, sans-serif;
  }
  .form {
    width: 100%;
    margin: 0 auto;
    height: auto;
    ul {
      height: auto;
      li {
        width: 100%;
        align-items: center;
        display: flex;
        box-sizing: border-box;
        position: relative;
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
          position: absolute;
          top: 50%;
          left: 0.32rem;
          transform: translateY(-68%);
          img {
            width: 0.4rem;
          }
        }
        .yanjin {
          position: absolute;
          right: 0.2rem;
          font-size: 0.26rem;

          img {
            width: 0.5rem;
          }
        }
        input {
          border: none;
          background: transparent;
          outline: none;
          height: 0.9rem;
          border-bottom: 1px solid rgb(162, 19, 31);
          width: 93%;
          margin: 0.28rem;
          padding-left: 0.77rem;
          color: #fff;
          font-size: 0.28rem;
          padding-top: 0.05rem;
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
          padding-left: 0;
          input {
            border: none;
            background: transparent;
            outline: none;
            height: 0.9rem;
            border-bottom: 1px solid rgb(162, 19, 31);
            width: 93%;
            margin: 0 0.28rem;
            padding-left: 0.77rem;
            color: #fff;
            font-size: 0.28rem;
            padding-top: 0.05rem;
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
  .submit {
    width: 95%;
    margin-top: 0.15rem;
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
