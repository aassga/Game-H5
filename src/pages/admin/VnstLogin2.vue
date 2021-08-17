<template>
  <div>
    <view-page class="login-box" :full-box="!isShowFixed">
      <div slot="content">
        <i class="icon iconfont h5-icon-left-menu-ico back-icon" @click="goBack()"></i>
        <div class="content">
          <div class="headSwiper" v-show="tabIndex != 2">
            <swiper :options="swiperOption2"
                  ref="mySwiper">
              <swiper-slide>
                <img src="../../assets/img/login/banner1.png"
                    class="swiper-slide">
              </swiper-slide>
              <swiper-slide>
                <img src="../../assets/img/login/banner2.png"
                    class="swiper-slide">
              </swiper-slide>
              <swiper-slide>
                <img src="../../assets/img/login/banner3.png"
                    class="swiper-slide">
              </swiper-slide>
              <swiper-slide>
                <img src="../../assets/img/login/banner4.png"
                    class="swiper-slide">
              </swiper-slide>
              <swiper-slide>
                <img src="../../assets/img/login/banner5.png"
                    class="swiper-slide">
              </swiper-slide>
              <swiper-slide>
                <img src="../../assets/img/login/banner6.png"
                    class="swiper-slide">
              </swiper-slide>
            </swiper>
          </div>
          <img v-show="tabIndex == 2" :src="$config.name === 'vnst' ? require('../../assets/img/login/vnst-header3.png') : require('../../assets/img/login/aqvns-header3.png')" class="header-img" />
          <img v-show="tabIndex != 2" :src="$config.name === 'vnst' ? require('../../assets/img/login/vnst-header2.png') : require('../../assets/img/login/aqvns-vnst-header2.png')" class="header-img header-img2" />
          <div class="img-list">
            <span @click="tabIndex = 0" :class="{'active':tabIndex == 0}"><i class="user"></i> 登录</span>
            <span @click="tabIndex = 1" :class="{'active':tabIndex == 1}"><i class="regin"></i>注册</span>
            <span @click="tabIndex = 2" :class="{'active':tabIndex == 2}"><i class="load"></i>APP下载</span>
          </div>
          <div :class="['cont-box',{'cont-box2':tabIndex == 2}]">
            <div v-show="tabIndex === 0" class="form">
              <ul>
                <li class="user-name">
                  <i
                    class="icon iconfont h5-icon-new-index-user theme-color"
                  ></i>
                  <input-row
                    :blurFunc="userNameBlur"
                    :focusFunc="userNameFocus"
                    ref="loginUserName"
                    v-model="userName"
                    placeholder="请输入帐号"
                    type="text"
                    v-keyBroayStates
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
            <div v-show="tabIndex === 1" class="form register-form" ref="formHei">
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
            <div v-show="tabIndex === 0" class="toolbar">
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
            <div v-show="tabIndex === 2" class="loadContent">
              <div class="downBtn" @click="onDownload('enterprisesignLink')"><img src="../../assets/img/login/load_btn.png" alt=""></div>
              <div class="swiper-box">
                <swiper :options="swiperOption" ref="swiper">
                  <swiper-slide v-for="(item, i) in $config.name === 'vnst' ? slideList : aqSlideList" :key="i">
                    <div class="swiper-item" @click="swiperItemClick(item)" :style="
                      'backgroundImage:url('+item.img+');'
                      ">
                    </div>
                  </swiper-slide>
                </swiper>
                <div class="swiper-pagination"></div>
              </div>
              <div class="loadTeach" @click="install = true" v-if="this.$mobileDevice.isIOS">查看安装引导>></div>
              <div class="game_list">
                <ul>
                  <li><img src="../../assets/img/login/game1.png" alt=""><span @click="onDownload"></span></li>
                  <li><img src="../../assets/img/login/game2.png" alt=""><span @click="onDownload"></span></li>
                  <li><img src="../../assets/img/login/game3.png" alt=""><span @click="onDownload"></span></li>
                </ul>
              </div>
            </div>
            <button
              type="button"
              @click="onSubmit"
              v-show="tabIndex != 2"
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
            <div class="bottom-tip" v-if="tabIndex !== 2">
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
          <img v-show="tabIndex != 2" class="bottom-img" @click="onDownload" :src="$config.name === 'vnst' ? require('../../assets/img/login/vnst-bottom2.gif') : require('../../assets/img/login/aqvns-vnst-bottom2.gif')">
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
      <div slot="footer" class="bottom-img2" v-show="tabIndex == 2 && $config.name === 'vnst'">
        <img @click="onDownload" :src="$config.name === 'vnst' ? require('../../assets/img/login/vnst-bottom3.gif') : require('../../assets/img/login/aqvns-vnst-bottom3.gif')">
      </div>
    </view-page>
    <div class="install"
         v-show="install">
      <div class="install_title">
        <h4>安装教程</h4>
        <a href="javascript:void(0)"
           class="close"
           style="font-size: .5rem;"
           @click="install=false">×</a>
      </div>
      <div id="iosafter" class="wrapper">
        <ul class="down_content">
          <li>
            <img src="@site/assets/img/download/xpj_install_1.png"
                 class="img_01">
            <p>点击下载APP后选择“安装”</p>
          </li>
          <li>
            <img src="@site/assets/img/download/xpj_install_2.png"
                 class="img_01">
            <p>从手机桌面选择[设置]->[通用]</p>
          </li>
          <li>
            <img src="@site/assets/img/download/xpj_install_3.png"
                 class="img_01">
            <p>下滑页面,选择[设备管理]或[描述文件与设备管理]</p>
          </li>
          <li>
            <img src="@site/assets/img/download/xpj_install_4.png"
                 class="img_01">
            <p>点击信任</p>
          </li>
          <li>
            <img src="@site/assets/img/download/xpj_install_5.png"
                 class="img_02">
            <p>选择信任[遇到困难,请随时联系客服]</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import SlideVerify from "../../components/slide-verify/index";
import logoMixin from "../home/theme/mixin";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name: "VnstLogin",
  mixins: [logoMixin],
  data() {
    return {
      swiperIndex: 3,
      swiperOption2: {
        loop: true,
        autoplay: false,
        effect: 'coverflow',
        slidesPerView: 3,
        centeredSlides: true,
        on:{
          slideChange: () => {
            if(this.$refs.mySwiper && this.$refs.mySwiper.swiper) {
              this.swiperIndex = this.$refs.mySwiper.swiper.activeIndex
            }
          },
        },
      },
      swiperOption: {
        autoplay: {
          disableOnInteraction: false,
        },
        pagination:{
          el:'.swiper-pagination',
          clickable:true,
        },
      },
      slideList:[
        {img:require('../../assets/img/login/ban1.png')},
        {img:require('../../assets/img/login/ban2.png')},
        {img:require('../../assets/img/login/ban3.png')},
        {img:require('../../assets/img/login/ban4.png')},
        {img:require('../../assets/img/login/ban5.png')},
        {img:require('../../assets/img/login/ban6.png')},
      ],
      aqSlideList:[
        {img:require('../../assets/img/login/ban1.png')},
        {img:require('../../assets/img/login/aqvns-ban2.png')},
        {img:require('../../assets/img/login/ban2.png')},
        {img:require('../../assets/img/login/aqvns-ban3.png')},
        {img:require('../../assets/img/login/ban4.png')},
        {img:require('../../assets/img/login/aqvns-ban6.gif')},
      ],
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
      showDownLog : true,
      install: false,
    };
  },
  components: {
    SlideVerify,
    swiper,
    swiperSlide,
  },
  created() {
    this.$store.state.main.windowHeight
    if(sessionStorage['showBlackAdvert'] == '1') {
      this.goRegister();
    }else if (sessionStorage['showBlackAdvert'] == '2') {
      this.tabIndex = 2
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
    this.changeView('login');
    setInterval(() => {
      if(this.$refs.mySwiper && this.$refs.mySwiper.swiper) {
        if(this.swiperIndex + 1 === 10 ){
          this.swiperIndex = 4
          this.$refs.mySwiper.swiper.slideNext()
        }else {
          this.swiperIndex += 1
          this.$refs.mySwiper.swiper.slideTo(this.swiperIndex, 200, false)
        }
      }
    }, 2500);
  },
  methods: {
    changeView(status) {
      this.isShow = true;
      if (status == 'login') {
        this.showLogin = true;
        this.showRegin = false;
        this.showLoad = false;
        this.isShow = 1;
      } else if (status == 'regin') {
        this.showLogin = false;
        this.showRegin = true;
        this.showLoad = false;
        this.isShow = 2;
      } else {
        this.showLogin = false;
        this.showRegin = false;
        this.showLoad = true;
        this.isShow = 3;
      }

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
        this.$refs.loginUserName.$el.getElementsByTagName('input')[0].blur();
      }, 20);
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
.swiper-container-3d .swiper-slide-shadow-left, .swiper-container-3d .swiper-slide-shadow-right{
  background-image:linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)) !important;
}
/deep/.swiper-container-3d .swiper-slide-shadow-left, /deep/.swiper-container-3d .swiper-slide-shadow-right{
  background-image:linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)) !important;
}
/deep/.swiper-pagination-clickable .swiper-pagination-bullet{
  margin: 0.08rem !important;
}
/deep/ .user-input-row  {
  &::after{
    display: none;
  }
}
.swiper-pagination{
  width: 100%;
  bottom: -0.04rem;
}
.swiper-pagination-bullet{
  margin: 10px!important;
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
  z-index: 999;
}
.content {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  font-size: 0;
  
  .header-img {
    width: 100%;
    height: 5.45rem;
    display: block;
    &.header-img2 {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .headSwiper{
    margin-top: 3.6rem;
    overflow: hidden;
    .swiper-container {
      box-sizing: border-box;
      width: 100%;
      height: 1.8rem;
      background:transparent;
      margin-bottom: 0.05rem;
    }
    /deep/ .swiper-slide-prev {
      transform: scale(1.9, 0.9) !important;
      width: 1.5rem !important;
    }
    // /deep/ .swiper-slide-duplicate{
    //   transform: translate3d(0px, 0px, -200px) rotateX(0deg) rotateY(100deg);
    // }
    /deep/ .swiper-slide-active {
      width: 4.6rem !important;
      z-index: 100000 !important;
      transform: unset !important;
    }
    /deep/ .swiper-slide-next {
      transform: scale(1.9, 0.9) !important;
      width: 1.5rem !important;
    }
    img.swiper-slide {
      // width: 4.6rem;
      height: 1.94rem;
    }
  }
  @keyframes heart_beat{
    0%{transform:scale(.9)}
    50%{transform:scale(1.1)}
    100%{transform:scale(.9)}
  }
  .loadContent{
    .downBtn{
      width: 4.27rem;
      height: 1.7rem;
      margin: 0 auto;
      padding-top: .4rem;
      img{
        width: 100%;
        animation: heart_beat .8s infinite linear;
      }
    }
    .swiper-box {
      height: 4.9rem;
      transform: translate3d(0, 0, 0);
      overflow: hidden;
      .swiper-container-autoheight {
        height: 100%;
        .swiper-slide {
          height: 100%;
          img {
            height: 100%;
          }
        }
      }
      .swiper-item {
        width: 100%;
        display: block;
        transform:translate3d(0,0,0);
        height: 4.7rem;
        background-size: 100% 100%;
      }
      
    }
    .loadTeach{
      height: 1rem;
      text-align: center;
      line-height: 1rem;
      color: #4A2E0A;
      font-size: 0.36rem;
    }
    .game_list{
          padding: 0 0.1rem;
      li{
        position: relative;
        width: 100%;
        height: 3.42rem;
        &:last-child {
          margin-bottom: 1.2rem;
        }
        img{
          height: 100%;
          width: 100%;
        }
        span {
          position: absolute;
          top: 0;
          right: 0;
          width: 2rem;
          height: 100%;
        }
      }
    }
  }
  .img-list {
    display: flex;
    margin: 0 auto;
    width: 7.02rem;
    justify-content: space-between;
    margin-top: 0.1rem;
    .active{
      background: url('../../assets/img/login/btn_bg.png') no-repeat;
      background-size: 100% 100%;
      color: #fff;
      .user{
        background: url('../../assets/img/login/user_ac.png') no-repeat;
        background-size: 0.45rem 0.45rem;
      }
      .regin{
        background: url('../../assets/img/login/regin_ac.png') no-repeat;
        background-size: 0.45rem 0.45rem;
      }
      .load{
        background: url('../../assets/img/login/load_ac.png') no-repeat;
        background-size: 0.45rem 0.45rem;
      }

    }
    span{
      display: inline-block;
      width: 2.24rem;
      height: 0.96rem;
      color: #146EFF;
      font-size: 0.38rem;
      line-height:0.9rem;
      margin-bottom: 0.02rem;
      i{
        display: inline-block;
        width: 0.45rem;
        height: 55%;
        vertical-align: middle;
        margin-top: 0.04rem;
      }
      .user{
        background: url('../../assets/img/login/user.png') no-repeat;
        background-size: 0.45rem 0.45rem;
        margin-right: -0.04rem;
      }
      .regin{
        background: url('../../assets/img/login/regin.png') no-repeat;
        background-size: 0.45rem 0.45rem;
        margin-right: 0.06rem;
      }
      .load{
        background: url('../../assets/img/login/load.png') no-repeat;
        background-size: 0.45rem 0.45rem;
        margin-right: 4px;
      }
    }
  }
  .cont-box2{
    width: 100%!important;
  }
  .cont-box {
    width: 7.02rem;
    margin: 0 auto;
    // box-shadow: 0px 0.02rem 0.16rem 0px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    background-color: #fff;
  }
  .bottom-img {
    width: 100%;
    height: 1.5rem;
    margin-top: 0.24rem;
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
          color: #adafbb;
          font-weight: 400;
          text-transform: capitalize !important;
        }

        input::-moz-placeholder {
          font-size: 0.32rem;
          color: #adafbb;
          font-weight: 400;
          text-transform: capitalize !important;
        }

        input::-ms-input-placeholder {
          font-size: 0.32rem;
          color: #adafbb;
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
.bottom-img2 {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 79%);
  font-size: 0;
  img {
    width: 100%;
    height: 100%;
  }
}
.install {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  .install_title {
    width: 100%;
    height: 0.8rem;
    position: absolute;
    top: 25%;
    left: 0;
    box-sizing: border-box;
    background: #fff;
    border-bottom: 1px #ddd solid;
    display: flex;
    justify-content: space-between;
    padding: 0 0.2rem;
    line-height: 0.8rem;
    z-index: 1000;
    h4{
      font-size: 14px;
    }
  }
  .wrapper {
    width: 100%;
    height: 70%;
    position: relative;
    top: 30%;
    left: 0;
    overflow-x: hidden !important;
    overflow-y: scroll !important;
    background: #fff;
    box-sizing: border-box;
    padding: 0 0.385rem;
    -webkit-overflow-scrolling: touch;
    .down_content {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      p{
        font-size: 14px;
      }
      li {
        margin-top: 0.4rem;
        height: auto;
        p {
          width: 100%;
          text-align: center;
        }
        img.img_01 {
          width: 6.73rem;
          height: auto;
        }
        img.img_02 {
          width: 6.73rem;
          height: auto;
        }
        &:nth-last-of-type(1) {
          margin-bottom: 10px;
        }
      }
    }
    .ios_mask {
      width: 100%;
      height: 100%;
      position: fixed;
      background: rgba(0, 0, 0, 0.9);
      top: 0;
      left: 0;
      text-align: center;
      z-index: 1000;
    }

    .ios_mask img {
      position: absolute;
      top: 7.8rem;
      left: 1.1rem;
      width: 5.28rem;
      height: 1.31rem;
      transform-origin: center 0.9rem;
      animation: iosWobble 1s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }

    .ios_mask button {
      width: 4.4rem;
      height: 0.94rem;
      border: 1px #fff solid;
      border-radius: 0.94rem;
      text-align: center;
      background: #ffffff;
      line-height: 0.94rem;
      font-size: 0.32rem;
      color: #007aff;
      box-shadow: 0px 0px 7px 2px #007fff;
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
    }

    @media screen and (device-height: 736px) {
      .ios_mask img {
        top: 7rem !important;
      }

      .ios_mask button {
        bottom: 0.6rem;
      }
    }

    @media screen and (device-height: 667px) {
      .ios_mask img {
        top: 7rem !important;
      }

      .ios_mask button {
        bottom: 0.6rem;
      }
    }

    @media screen and (device-height: 568px) {
      .ios_mask img {
        top: 7rem !important;
      }

      .ios_mask button {
        bottom: 0.6rem;
      }
    }

    @keyframes iosWobble {
      0% {
        transform: rotate(0deg);
      }
      10% {
        transform: rotate(5deg);
      }
      20% {
        transform: rotate(10deg);
      }
      30% {
        transform: rotate(5deg);
      }
      40% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(0deg);
      }
      60% {
        transform: rotate(0deg);
      }
      70% {
        transform: rotate(-5deg);
      }
      80% {
        transform: rotate(-10deg);
      }
      90% {
        transform: rotate(-5deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }
  }
}
</style>
