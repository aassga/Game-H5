<template>
  <view-page class="login-box">
    <div slot="content" class="container">
      <div class="header self-header">
        <div class="title">
          <img v-if="tabIndex === 0" src="../../assets/img/login/home-login-a/top-login.png" alt="">
          <!-- 2021/07/26 andy說拿掉註冊 -->
          <!-- <img v-if="tabIndex === 1" src="../../assets/img/login/home-login-a/top-reg.png" alt=""> -->
          <div class="click-area">
            <span class="login-btn" @click="goLogin"></span>
            <!-- 2021/07/26 andy說拿掉註冊 -->
            <!-- <span class="reg-btn" @click="goRegister"></span> -->
          </div>
        </div>
      </div>
      <div class="content">
        <div v-if="tabIndex === 0" class="form">
          <div class="title">
            登录
          </div>
          <ul>
            <li class="user-name">
              <i class="icon iconfont h5-icon-icon-username user self-theme-color"></i>
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
                  <li v-for="(item,i) in showRecordList" :key="i" @click="userRecordClick(item)">
                    <span class="recordName">{{item.userName}}</span>
                    <span class="recordPassword">********</span>
                    <span class="recordClear" @click.stop="userRecordDelete(i)">
                      <van-icon name="clear" />
                    </span>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <i class="icon iconfont h5-icon-mimasuo pwd self-theme-color"></i>
              <input
                v-model="password"
                placeholder="请输入密码"
                :type="loginPwShow ? 'text' : 'password'"
                autocomplete="new-password"
              />
              <i :class="['icon','iconfont',loginPwShow ? 'h5-icon-mimayanjing-01' : 'h5-icon-mimabiyan']" @click="loginPwShow = !loginPwShow"></i>
            </li>
            <li v-if="loginVerify=='imgCode'" v-show="isCaptcha && $store.state.user.code.authImg">
              <i class="icon iconfont h5-icon-icon-yzm record self-theme-color"></i>
              <input
                v-model="code"
                maxlength="4"
                placeholder="请输入验证码"
                type="tel"
                autocomplete="new-password"
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
        <!-- 2021/07/26 andy說拿掉註冊 -->
        <!-- <div v-if="tabIndex ===1 " class="form register-form" ref="formHei">
          <ul>
            <li>
              <i class="icon iconfont h5-icon-icon-username user self-theme-color"></i>
              <input
                name="user"
                v-model="modal.userName"
                type="text"
                placeholder="帐号（6-10位字母或数字）"
                maxlength="10"
                @blur="refreshArchCode"
              />
            </li>
            <li>
              <i class="icon iconfont h5-icon-suo pwd self-theme-color"></i>
              <input
                name="password"
                v-model="modal.password"
                :type="regPwShow ? 'text' : 'password'"
                maxlength="20"
                placeholder="密码（8-20位字母或数字）"
              />
              <i :class="['icon','iconfont',regPwShow ? 'h5-icon-mimayanjing-01' : 'h5-icon-mimabiyan']" @click="regPwShow = !regPwShow"></i>
            </li>
            <li>
              <i class="sure-pwd h5-icon-mimasuo icon iconfont self-theme-color"></i>
              <input
                name="password"
                v-model="modal.password2"
                :type="regPw2Show ? 'text' : 'password'"
                placeholder="请确认密码"
                autocomplete="new-password"
                maxlength="20"
              />
              <i :class="['icon','iconfont',regPw2Show ? 'h5-icon-mimayanjing-01' : 'h5-icon-mimabiyan']" @click="regPw2Show = !regPw2Show"></i>
            </li>
            <li v-for="(item, i) in register" :key="'input-' + i">
              <i :class="[item.key ,item.class,'self-theme-color']"></i>
              <input
                :name="item.key"
                v-model="modal[item.key]"
                :type="item.type"
                :maxlength="item.max"
                :placeholder="item.placeholder"
                autocomplete="new-password"
              />
              <button
                v-if="item.key=='sms'"
                @click="stopTime"
                :class="{'isGoTime':!isGoTime}"
                class="message-code nvs-message-code theme-color"
              >{{ isGoTime ?'获取验证码': '重新获取('+stepTime+')'}}</button>
            </li>
            <li v-if="loginVerify=='imgCode'" v-show="showAuth && isCaptcha && $store.state.user.code.authImg">
              <i class="icon iconfont h5-icon-icon-yzm record self-theme-color"></i>
              <input
                v-model="vercode"
                maxlength="4"
                placeholder="请输入验证码"
                type="tel"
                autocomplete="new-password"
              />
              <img
                class="code-num"
                :src="$store.state.user.code.authImg"
                alt
                @click="refreshArchCode"
              />
            </li>
            <li v-if="siteModel === 'invite_code'">
              <i class="yqm icon iconfont h5-icon-icon-trans-password self-theme-color"></i>
              <input
                name="agent"
                v-model="agent"
                class="input"
                maxlength="6"
                type="tel"
                placeholder="请输入邀请码"
                autocomplete="new-password"
                :disabled="hasAgent"
              />
            </li>
          </ul>
        </div> -->
        <div v-if="tabIndex === 0" class="toolbar">
          <span class="forget-pwd" @click="toastText('请联系客服找回密码', 'top')">忘记密码？</span>
          <van-checkbox v-model="record" icon-size="20px">记住密码</van-checkbox>
        </div>
        <div v-if="loginVerify=='wyCode'" id="captchaVns"></div>
      </div>
      <div v-if="tabIndex ===0" :class="['login-btn-area',submitted || userName.length===0 ? 'disabled' :'']" @click="OnLogin">
        <img src="../../assets/img/login/home-login-a/login-btn.png" alt="">
      </div>
      <div class="bottom-tip" v-if="tabIndex ===1">
        <div @click="goLogin" class="go-login">
          <img src="../../assets/img/login/home-login-b/Shape.png" alt="">前往登录
        </div>
        <img @click="Onregister" src="../../assets/img/login/home-login-a/reg-btn.png" class="reg-btn-img" alt="">
      </div>
      <drag-box @clickHandle="dragClick" :h="1.47" :w="1" :x="6" :y="4.6">
        <div slot="content">
          <img src="../../assets/img/login/home-login-a/kefu.png" alt="" style="width:100%;height:100%">
        </div>
      </drag-box>
    </div>
    <slide-verify slot="content-static" v-if="verify" 
            :userName='userName || modal.userName'
            @success="onSuccess"
            @closeVerify='closeVerify'
            ></slide-verify>
            <div id="captchaVns"></div>
    <div slot="content-static" v-if="loginVerify=='wyCode' && wyLoading" class="verify_all">
      <div :class="['verify_before',{'qp-verify_before' : $config.newQP || $config.blackTheme}]">
        <div class="verify_loading" :class="verifyClass"></div>
        <p>安全检测中</p>
      </div>     
    </div>
  </view-page>
</template>

<script>
import BScroll from "better-scroll";
import SlideVerify from '../../components/slide-verify/index'
import { Checkbox, CheckboxGroup } from 'vant';
export default {
  name: "BHomeLogin",
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
        archCode: ""
      },
      vercode: "",
      showRecoed: false,
      userRecordList: [],
      showRecordList: [],
      verify: false,
      captchaIns: null,
      wyLoading: false,
      loginVerify: this.$store.state.main.VerificationCode || 'imgCode', // type  tCode: 滑动验证 imgCode： 图片验证  wyCode：网易盾
      loginPwShow: false,
      regPwShow: false,
      regPw2Show: false,
    };
  },
  components: {
    SlideVerify,
    vanCheckbox : Checkbox,
  },
  created() {
    if (localStorage["agent"]) {
      this.agent = localStorage["agent"];
      this.hasAgent = true;
    }
    if(sessionStorage['showBlackAdvert'] && sessionStorage['showBlackAdvert'] == '1') {
      this.goRegister()
    }
    
    this.checkArchCode();
    
    this.userRecordList = this.$store.state.user.userRecordList;
    this.showRecordList = this.$store.state.user.userRecordList;
  },
  computed: {
    showAuth() {
      let showAuthVal = false;
      try {
        if (!JSON.parse(localStorage.config)) return showAuthVal;
        let registerH5Val = JSON.parse(localStorage.config).register.h5;
        let index = registerH5Val.indexOf("sms");
        if (index > -1) {
          showAuthVal = false;
        } else {
          showAuthVal = true;
        }
        return showAuthVal;
      } catch (error) {
        return showAuthVal;
      }
    },
    siteModel() {
      return this.$store.state.main.config["site_model"];
    },
    register() {
      //动态设置注册所需资料
      try {
        if (!JSON.parse(localStorage.config)) return [];
        const registerH5 = JSON.parse(localStorage.config).register.h5;
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
        return register;
      } catch (err) {
        return [];
      }
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
    '$store.state.main.VerificationCode'(newVal){
      this.loginVerify = newVal
    },
    archCode() {
      this.modal.archCode = this.archCode;
    },
    "modal.userName"() {
      if (!this.modal.userName) {
        this.$store.state.user.code = {
          authImg: "",
          code: ""
        };
      }
    },
    tabIndex() {
      this.resetFrom();
      this.captchaIns && this.captchaIns.refresh()
      this.showRecoed = false;
      this.$store.state.user.code = {
        authImg: "",
        code: ""
      };
    },
    userName() {
      this.userName = this.userName.replace(/\s/g, "");
      this.showRecordList = this.userRecordList.filter(item => {
        let itemLowerCase = item.userName.toLowerCase()
        let userNameLowerCase = this.userName.toLowerCase()
        if (itemLowerCase.includes(userNameLowerCase)) {
          return item;
        }
      });
    },
    showRecoed() {
      this.initScroll()
    }
  },
  mounted() {
    let _this = this;
    document.addEventListener("visibilitychange", _this.checkViChange);
    this.initScroll()
  },
  methods: {
    dragClick() {
      this.inService();
    },
    getWYdata(){
      let _this = this
      _this.wyLoading = true
      this.$store.dispatch('user/getYiDunCode').then(res=>{
        initNECaptcha({
          element: '#captchaVns',
          captchaId: res.data.CAPTCHA_ID,
          mode: 'popup',
          width: 'auto',
          appendTo: 'body',
          feedbackEnable : false,
          onClose: function(){
            _this.submitted = false
          },
          onVerify: function(err, result){
            if(err) return
            _this.$store.dispatch('user/getCheckYiDunCode',{
              NECaptchaValidate: result.validate,
              userName: (_this.userName || _this.modal.userName).replace(/\s/g, "")
            }).then(res=>{
              if(res.code === 200){
                _this.onSuccess()
              }
            })
          },
        }, function (instance) {
          // 初始化成功后得到验证实例instance，可以调用实例的方法
          _this.captchaIns = instance
          _this.wyLoading = false
          instance.popUp()
        }, function (err) {
          // 初始化失败后触发该函数，err对象描述当前错误信息
        })
      })
    },
    closeVerify(){
      this.verify = false
      this.submitted = false
    },
    onSuccess(){
      if (this.tabIndex === 0) {
        this.getLoginUrl();
      } else {
        this.getRegisterUrl();
      }
    },
    getRegisterUrl(){
        this.$store.dispatch("user/register", {
          data: this.modal,
          record: this.record,
          callback: res => {
            if (typeof res === "string") {
              this.submitted = false;
              this.toastText(res, "top");
              this.refreshArchCode();
            } else if (res["code"] === 200) {
              this.$store
                .dispatch("user/refreshBalance")
                .then(res => {
                  if (res.code && res.code !== 200) {
                    if (
                      res.message.includes("设备上登录") ||
                      res.message.includes("请登录")
                    ) {
                      this.$store.commit("user/clean");
                      this.$router.replace("/");
                      this.toastText(res.message, "top" ,this.loginVerify=='imgCode'? 1000 : 2000);
                      setTimeout(() => {
                        this.$stomp.reInit();
                      }, 1000);
                    }
                  }
                })
                .catch(err => {});

              this.$store.dispatch("user/refreshBank").then();
              this.$store.dispatch('user/refreshUsdt').then()

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
                .then(res => {
                  this.$store.commit("lottery/checkPlayWay");
                })
                .catch(err => {});
              this.$store.dispatch("user/refreshMsgCount").then();
              this.$store
                .dispatch("agency/getRefundRebate")
                .then(res => {
                  this.$store.commit("lottery/checkPlayWay");
                })
                .catch(err => {});

              if(localStorage['agent']){
                localStorage.removeItem('agent')
              }
              setTimeout(() => {
                this.$stomp.reInit();
              }, 1000);
            } else if (res["msg"]) {
              this.submitted = false;
              this.toastText(res["msg"], "top", this.loginVerify=='imgCode'? 1000 : 2000);
              this.refreshArchCode();
              this.captchaIns && this.captchaIns.refresh()
            } else if (res["message"]) {
              this.submitted = false;
              this.toastText(res["message"], "top" ,this.loginVerify=='imgCode'? 1000 : 2000);
              this.refreshArchCode();
              this.captchaIns && this.captchaIns.refresh()
            } else {
              this.submitted = false;
              this.toastText("注册失败", "top" , this.loginVerify=='imgCode'? 1000 : 2000);
              this.refreshArchCode();
              this.captchaIns && this.captchaIns.refresh()
            }
          }
        });
    },
    getLoginUrl(){
        const data = {
          userName: this.userName.replace(/\s/g, ""),
          password: this.password.replace(/\s/g, ""),
          record: this.record
        };
        if (this.isCaptcha) {
          if(this.loginVerify != 'imgCode'){
            data.code = 1111
          }else{
            data.code = this.code.replace(/\s/g, "");
          }
        }
        this.$store.dispatch("user/login", {
          data,
          callback: res => {
            this.submitted = false;
            this.$store.state.main.loadingText = "";
            if (res.code === 200) {
              this.$store
                .dispatch("user/refreshBalance")
                .then(res => {
                  if (res.code && res.code !== 200) {
                    if (
                      res.message.includes("设备上登录") ||
                      res.message.includes("请登录")
                    ) {
                      this.$store.commit("user/clean");
                      this.$router.replace("/");
                      this.toastText(res.message, "top" ,this.loginVerify=='imgCode'? 1000 : 2000);

                      setTimeout(() => {
                        this.$stomp.reInit();
                      }, 1000);
                    }
                  }
                })
                .catch(err => {});

              this.$store.dispatch("user/refreshBank").then();
              this.$store.dispatch('user/refreshUsdt').then()

              setTimeout(
                function() {
                  this.$router.push("/");
                  this.submitted = false;
                }.bind(this),
                1000
              );

              this.$store
                .dispatch("lottery/getAllPlayWay")
                .then(res => {
                  this.$store.commit("lottery/checkPlayWay");
                })
                .catch(err => {});
              this.$store.dispatch("user/refreshMsgCount").then();

              this.$store
                .dispatch("agency/getRefundRebate")
                .then(res => {
                  this.$store.commit("lottery/checkPlayWay");
                })
                .catch(err => {});
              
              if(localStorage['agent']){
                localStorage.removeItem('agent')
              }
              setTimeout(() => {
                this.$stomp.reInit();
              }, 1000);
            } else {
              this.submitted = false;
              this.toastText(res.message, "middle");
              if(this.loginVerify == 'tCode'){
                this.verify = false
              }else if(this.loginVerify == 'wyCode'){
                this.captchaIns && this.captchaIns.refresh()
              }else{
                if (this.isCaptcha) {
                  this.refreshArchCode();
                } else {
                  this.checkArchCode();
                }
              }
            }
          }
        });
    },
    initScroll() {
      setTimeout(() => {
        this.$refs.userRecordList && new BScroll(this.$refs.userRecordList, {
          scrollY: true,
          scrollX: false,
          click: true,
          autoBlur: false
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
        callback: res => {
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
        }
      });
    },
    goLogin() {
      this.tabIndex = 0;
      if(this.loginVerify != 'imgCode') return
      this.refreshArchCode();
    },
    goRegister() {
      this.tabIndex = 1;
      //注册时获取验证码
      if(this.loginVerify != 'imgCode') return
      this.refreshArchCode();
    },
    OnLogin() {
      if (this.$config.preview) {
        this.previewAlert();
      } else if (
        this.checkUserForLogin(this.userName) &&
        this.checkPassword(this.password) &&
        (this.isCaptcha ? (this.loginVerify == 'imgCode' ? this.checkCode(this.code) : true )  : true)
      ) {
        this.submitted = true;
        if(this.loginVerify =='tCode'){
          this.verify = true
        }else if(this.loginVerify =='wyCode'){
          this.getWYdata()
        }else{
          this.getLoginUrl()
        }

      }
    },
    checkArchCode() {
      this.submitted = true;
      this.$store.dispatch("user/isCaptcha", {
        callback: res => {
          this.submitted = false;
          if (res.code !== 200 || res.data === 0) {
            this.isCaptcha = false;
          } else {
            this.isCaptcha = true;
            if (!this.$store.state.user.code.authImg) {
              this.refreshArchCode();
            }
          }
        }
      });
    },
    refreshArchCode() {
      if(this.loginVerify != 'imgCode') return
      if (this.tabIndex === 0) {
        if (this.userName && !this.submitted && this.isCaptcha) {
          this.submitted = true;
          this.$store.dispatch("user/refreshAuthCode", {
            userName: this.userName || this.modal.userName,
            callback: res => {
              this.submitted = false;
            }
          });
        } else {
          this.submitted = false;
          this.$store.state.user.code = {
            authImg: "",
            code: ""
          };
        }
      } else {
        this.$store.dispatch('user/refreshAuthCode', { userName: this.modal.userName })
      }
    },
    isNeedAuth(showAuth, code) {
      if(this.loginVerify != 'imgCode'){
        return false
      }
      if (showAuth) {
        let show = this.checkCode(code);
        return show;
      } else {
        return true;
      }
    },
    Onregister() {
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
        this.register.every(item => {
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
        (this.siteModel !== "invite_code" || this.checkAgent(this.agent)) &&
        (this.loginVerify =='imgCode' ? this.isNeedAuth(this.showAuth, this.vercode)  :  true)
      ) {
        this.submitted = true;
        if (
          this.siteModel === "invite_code" ||
          this.siteModel === "invite_link"
        ) {
          if (this.agent !== "") {
            this.modal["agent"] = this.modal["invite_code"] = this.agent;
          }

          if (this.vercode !== "") {
            this.modal["code"] = this.vercode;
          }
        }
        if(this.loginVerify == 'tCode'){
          this.verify = true
        }else if(this.loginVerify == 'wyCode'){
          this.getWYdata()
        }else{
          this.getRegisterUrl()
        }
      }
    },
    resetFrom() {
      this.userName = "";
      this.password = "";
      this.code = "";
      this.vercode = "";
      this.loginPwShow = false;
      this.regPwShow = false;
      this.regPw2Show = false;
      if (!localStorage["agent"]) this.agent = "";
      this.modal = {
        userName: "",
        password: "",
        password2: "",
        archCode: ""
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
      this.showRecordList = this.userRecordList
      this.$store.commit("user/setRecord", this.userRecordList);
    },
    userNameFocus() {
      this.showRecoed = true;
    },
    userNameBlur() {
      if(this.loginVerify == 'imgCode'){
        setTimeout(() => {
          this.showRecoed = false;
          this.refreshArchCode();
        }, 0);
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
    this.$store.state.user.code = {
      authImg: "",
      code: ""
    };
    sessionStorage.removeItem('showBlackAdvert')
  }
};
</script>

<style lang="less" scoped>
.self-theme-color {
  background:linear-gradient(90deg,rgba(23,234,217,1),rgba(96,120,234,1));
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}
.self-theme-bg {
  background-color: #42C4D3;
}

.login-box {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background: url("../../assets/img/login/home-login-a/bg.png") 0 0 no-repeat;
  background-size: 100%;
  .view-page-content {
    background-color: #fff;
    width: 7.02rem;
    margin: 0 auto;
    margin-top: -0.02rem;
  }
}
.container {
  overflow: hidden;
}

.header {
  width: 100%;
  .title {
    width: 7rem;
    height: .9rem;
    margin: 3.4rem auto 0rem;
    box-sizing: border-box;
    position: relative;
    img {
      width: 7rem;
      height: .8rem;
    }
    .click-area {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      span {
        display: inline-block;
        width: 50%;
        height: 100%;
      }
    }
  }

  .back {
    width: 0.88rem;
    height: 0.88rem;
    position: absolute;
    left: 0rem;
    top: 0rem;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      color: #fff;
      transform: scale(1.2) rotate(180deg);
      display: inline-block;
    }
  }
}

.content {
  width: 7rem;
  background-color: #fff;
  box-sizing: border-box;
  margin: 0 auto;
  box-shadow:0px 0.2rem 0.37rem 0.13rem rgba(4,192,211,0.1);
  border-radius: 0 0 0.1rem 0.1rem;
  .title{
    font-size: 24px;
    height: 80px;
    text-align: left;
    padding-top: 0.5rem;
    padding-left: 0.32rem;
  }
  .form {
    padding: 0 0.25rem;
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
                &:after {
                  background-color: #fff;
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
          width: 2.1rem;
          height: 0.58rem;
          // background: rgba(241, 241, 241, 1);
          background: #fff;
          border-radius: 0.1rem;
          border: none;
          font-size: 0.28rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          border: 1px solid #00bdd4;
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
    font-size: 0.3rem;
    .forget-pwd {
      color: #6078EA;
      flex: 1;
      text-align: left;
    }
    /deep/ .van-checkbox__label {
      color: #666666;
    }
  }
  .register-form {
    height: auto;
    li {
      &:last-child{
        &::after {
          background-color: #fff;
        }
      }
    }
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

.login-btn-area {
  height: 1.45rem;
  width: 7rem;
  margin: 0.57rem auto 0;
  img {
    width: 100%;
    height: 100%;
  }
  &.disabled,
  &:disabled {
    opacity: 0.7;
  }
}
.bottom-tip {
  width: 7rem;
  margin: 0.6rem auto 0;
  height: 1.45rem;
  line-height: 1rem;
  overflow: hidden;
  text-align: left;
  color: #666666;
  font-size: 0.3rem;
  .go-login {
    float: left;
    img {
      display: inline-block;
      width: 0.39rem;
      height: 0.24rem;
      margin-right: .1rem;
      vertical-align: unset;
    }
  }
  .reg-btn-img {
    width: 3.31rem;
    height: 100%;
    float: right;
  }
}
.verify_all{
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
    .verify_loadingA{
      background-image: url('../../assets/img/verify/saomiao.gif');
    }
    .verify_loadingB{
      background-image: url('../../assets/img/verify/saomiao-b.gif');
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
