<template>
  <view-page class="login-box">
    <div slot="content" class="container" :style="{minHeight:$store.state.main.windowHeight+'px'}">
      <div class="self-header">
        <span v-if="tabIndex === 0"><i @click="$router.push('/home')" class="icon iconfont h5-icon-win-close"></i>欢迎登录</span>
        <span v-if="tabIndex === 1"><i @click="$router.push('/home')" class="icon iconfont h5-icon-win-close"></i>欢迎注册</span>
      </div>
      <div class="content">
        <div v-if="tabIndex === 0" class="form">
          <ul>
            <li class="user-name">
              <input
                placeholder="请输入用户名"
                ref="loginUserName"
                v-model="userName"
                @blur="userNameBlur"
                @focus="userNameFocus"
                type="text"
                autocomplete="new-password"
                @input="inputChange"
                v-keyBroayStates
              />
              <i v-if="closeShow" class="icon iconfont h5-icon-guanbi1" @click.stop="onClear"></i> 
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
              <input
                v-model="password"
                placeholder="请输入密码"
                :type="loginPwShow ? 'text' : 'password'"
                autocomplete="new-password"
                v-keyBroayStates
              />
              <i :class="['icon','iconfont',loginPwShow ? 'h5-icon-mimayanjing-01' : 'iconfont h5-icon-mimayincang']" @click="loginPwShow = !loginPwShow"></i>
            </li>
            <li v-if="loginVerify=='imgCode'" v-show="isCaptcha && $store.state.user.code.authImg">
              <input
                v-model="code"
                maxlength="4"
                placeholder="请输入验证码"
                type="tel"
                autocomplete="new-password"
                v-keyBroayStates
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
        <div v-if="tabIndex ===1 " class="form register-form" ref="formHei">
          <ul>
            <li>
              <input
                name="user"
                v-model="modal.userName"
                type="text"
                placeholder="帐号（6-10位字母或数字）"
                maxlength="10"
                v-keyBroayStates
                @blur="refreshArchCode"
              />
            </li>
            <li>
              <input
                name="password"
                v-model="modal.password"
                :type="regPwShow ? 'text' : 'password'"
                maxlength="20"
                placeholder="密码（8-20位字母或数字）"
                v-keyBroayStates
              />
              <i :class="['icon','iconfont',regPwShow ? 'h5-icon-mimayanjing-01' : 'iconfont h5-icon-mimayincang']" @click="regPwShow = !regPwShow"></i>
            </li>
            <li>
              <input
                name="password"
                v-model="modal.password2"
                :type="regPw2Show ? 'text' : 'password'"
                placeholder="请确认密码"
                autocomplete="new-password"
                maxlength="20"
                v-keyBroayStates
              />
              <i :class="['icon','iconfont',regPw2Show ? 'h5-icon-mimayanjing-01' : 'iconfont h5-icon-mimayincang']" @click="regPw2Show = !regPw2Show"></i>
            </li>
            <li v-for="(item, i) in registerList" :key="'input-' + i">
              <input
                :name="item.key"
                v-model="modal[item.key]"
                :type="item.type"
                :maxlength="item.max"
                :placeholder="item.placeholder"
                autocomplete="new-password"
                v-keyBroayStates
              />
              <button
                v-if="item.key=='sms'"
                @click="stopTime"
                :class="{'isGoTime':!isGoTime}"
                class="message-code nvs-message-code theme-color"
              >{{ isGoTime ?'获取验证码': '重新获取('+stepTime+')'}}</button>
            </li>
            <li v-if="loginVerify == 'imgCode'" v-show="showAuth && isCaptcha && $store.state.user.code.authImg">
              <input
                v-model="vercode"
                maxlength="4"
                placeholder="请输入验证码"
                type="tel"
                autocomplete="new-password"
                v-keyBroayStates
              />
              <img
                class="code-num"
                :src="$store.state.user.code.authImg"
                alt
                @click="refreshArchCode"
              />
            </li>
            <li v-if="siteModel === 'invite_code'">
              <input
                name="agent"
                v-model="agent"
                class="input"
                type="tel"
                placeholder="请输入邀请码"
                autocomplete="new-password"
                maxlength="6"
                :disabled="hasAgent"
                v-keyBroayStates
              />
            </li>
          </ul>
        </div>
        <div v-if="tabIndex === 0" class="toolbar">
          
          <span class="remeber_pwd">记住密码</span>
          <van-switch v-model="record" size="0.56rem" inactive-color="#CCCCCC" active-color="#E9B841 !important"></van-switch>
        </div>
        <button
          type="button"
          @click="onSubmit"
          :class="tabIndex ===0  &&  (submitted || userName.length===0 )? 'disabled' :''"
          class="submit self-theme-bg"
        >{{ tabIndex ===0 ? '登录': '立即注册' }}</button>
        <div class="dl-footer">
          <span v-if="tabIndex===0" class="forget-pwd" @click="toastText('请联系客服找回密码', 'top')">忘记密码？</span>
          <span v-if="tabIndex===0" @click="()=>{this.tabIndex = 1}">快速注册</span>
          <span v-if="tabIndex===1" @click="()=>{this.tabIndex = 0}">快速登录</span>
        </div>
        <div v-if="loginVerify=='wyCode'" id="captchaVns"></div>
        <div style="width:100%; height:0.2rem;"></div>
      </div>
      <!-- <div class="bottom-tip">
        <p v-if="tabIndex ===0">没有帐号，<span @click="goRegister">去注册？</span></p>
        <p v-if="tabIndex ===1"><img src="../../assets/img/login/home-login-b/Shape.png" alt="">已有帐号，<span @click="goLogin">去登录</span></p>
      </div> -->
    </div>
    <slide-verify slot="content-static" v-if="verify" 
            :userName='userName || modal.userName'
            @success="onSuccess"
            @closeVerify='closeVerify'
            ></slide-verify>
            <div id="captchaVns"></div>
    <div slot="content-static" v-if="loginVerify=='wyCode' && wyLoading" class="verify_all">
      <div class="verify_before">
        <div class="verify_loading" :class="$config.home === 'xpj'? 'verify_loadingA': 'verify_loadingB'"></div>
        <p>安全检测中</p>
      </div>     
    </div>
  </view-page>
</template>

<script>
import BScroll from "better-scroll";
import SlideVerify from '../../components/slide-verify/index'
import logoMixin from "../home/theme/mixin";
export default {
  name: "AmhgLogin",
  data() {
    return {
      closeShow:false,
      regPw2Show: false,
      regPwShow: false,
      loginPwShow: false,
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
      registerList: [],
      showAuth:null,
      selfSiteModel:null,
    };
  },
  components: {
    SlideVerify,
  },
  created() {
    if(sessionStorage['showBlackAdvert'] && sessionStorage['showBlackAdvert'] == '1') {
      this.goRegister()
    }
    if(this.$route.query.index === '1') {
       this.goRegister()
    }
    if (localStorage["agent"]) {
      // c模式不直接进入注册
      if(this.personalMode !== 'mode_c') {
        this.goRegister()
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
          code: "",
        };
      }
    },
    "$store.state.main.config"(newVal) {
      this.initData(newVal)
    },
    tabIndex() {
      this.resetFrom();
      this.captchaIns && this.captchaIns.refresh()
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
    // onFail(){
    // },
    // onRefresh(){
    // },
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
    goBack() {
      this.$router.push("/home");
    },
    goLogin() {
      this.tabIndex = 0;
    },
    goRegister() {
      this.tabIndex = 1;
      //注册时获取验证码
      if(this.loginVerify != 'imgCode') return
      this.refreshArchCode();
    },
    onSubmit(evt) {
      if (this.tabIndex === 0) {
        this.vnsOnLogin();
      } else {
        this.vnsOnregister();
      }
    },
    vnsOnLogin() {
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
    vnsOnregister() {
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
        this.registerList.every(item => {
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
        (this.loginVerify =='imgCode' ? this.isNeedAuth(this.showAuth, this.vercode)  :  true)
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
      setTimeout(() => {
        this.closeShow = false;
      }, 0);
    },
    inputChange(e) {
      let val = e.target.value;
      this.closeShow = val===''? false : true;
    },
    onClear() {
      this.userName = "";
      this.closeShow = false;
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
  color: #42C4D3;
}
.self-theme-bg {
  background-color: #E9B841;
}
.login-box {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background: url("../../assets/img/login/home-login-d/login_bg.png") 0 0 no-repeat;
  background-size: 100%;
  z-index: 502;
  .view-page-content {
    background-color: #fff;
    width: 7.02rem;
    margin: 0 auto;
    margin-top: -0.02rem;
  }
}

.self-header{
  text-align: left;
  margin:0.15rem 0 0 0.25rem;
  span{
    font-size:0.45rem;
    font-weight: bold;
    font-family: PingFang SC;
    color: #262B2F;
    .iconfont{
      font-size:0.3rem;
      color:#000;
      margin-right: 0.18rem;
    }
  }
}

.content {
  width: 7.02rem;
  background-color: #fff;
  box-sizing: border-box;
  margin-left: 0.24rem;
  box-shadow:0px 0.08rem 0.4rem 0px rgba(0, 0, 0, 0.14);
  border-radius:0.2rem;
  margin-top:2.6rem;
  .form {
    padding: 0 0.25rem;
    height: auto;
    ul {
      height: auto;
      li {
        height: 1.2rem;
        align-items: flex-end;
        display: flex;
        box-sizing: border-box;
        position: relative;
        padding-bottom: 0.2rem;
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
                border-bottom: 0.01rem solid #F0EFF2;
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
          font-size:0.45rem;
          color:#d3d3e5;
          margin-right: 0.2rem;
          margin-top: 0.1rem;
          background-size: contain;
          background-position: center center;
          background-repeat: no-repeat;
        }
        input {
          flex: 1;
          margin-left: 0.24rem;
          font-size: 0.36rem;
          font-family: PingFang SC;
          margin-top: 0.02rem;
          color: #5E5E66;
        }
        input::-webkit-input-placeholder {
          font-size: 0.36rem;
          color: #D6D7DC;
          font-weight: 400;
          text-transform: capitalize !important;
        }

        input::-moz-placeholder {
          font-size: 0.36rem;
          color: #D6D7DC;
          font-weight: 400;
          text-transform: capitalize !important;
        }

        input::-ms-input-placeholder {
          font-size: 0.36rem;
          color: #D6D7DC;
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
    justify-content: flex-end;
    margin: 0 0.27rem;
    .remeber_pwd {
      color: #A2A1AF;
      font-size: 0.3rem;
      //font-weight: 400;
      margin-right: 0.16rem;
    }

    .van-switch {
      width:1.04rem;
      height: 0.48rem;
      background: #fff!important;
      transition: all 400ms;
      /deep/.van-switch__node{
        width:0.39rem!important;
        height: 0.4rem!important;
        background: #B9B9B9!important;
        margin:0.04rem 0 0 0.08rem;
      }
    }
    
    .van-switch--on {
      transition: all 400ms;
      /deep/.van-switch__node{
        width:0.39rem!important;
        height: 0.4rem!important;
        background: #fff!important;
        margin:0.04rem 0 0 0.08rem;
      }
    }
  }
  .submit {
    height: 0.86rem;
    width: 6.42rem;
    line-height: 0.86rem;
    text-align: center;
    color: #ffffff;
    box-shadow: 0px 5px 25px 0px rgba(38, 91, 77, 0.06);
    border-radius: 0.47rem;
    border: 0;
    font-size: 0.36rem;
    font-weight: 400;
    margin-top: 0.3rem;
    &.disabled,
    &:disabled {
      opacity: 0.7;
    }
  }
  .dl-footer {
    text-align: center;
    span {
      font-size: .27rem;
      color: #A2A1AF;
      padding: 0 .59rem;
      line-height: 1.07rem;
      &:nth-child(2){
        position: relative;
      }
      &:nth-child(2)::after{
        content: "";
        left: -.08rem;
        top: .04rem;
        border-right: .03rem solid #A2A1AF;
        height: .24rem;
        position: absolute;
      }
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
// .bottom-tip {
//   margin-top: 0.2rem;
//   p {
//     color: #CACDD1;
//     font-size: 0.36rem;
//     text-align: center;
//     span {
//       color: #FFA800;
//     }
//     img {
//       display: inline-block;
//       width: 0.39rem;
//       height: 0.24rem;
//       margin-right: .1rem;
//       vertical-align: unset;
//     }
//   }
// }
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
    > p {
      font-size: 0.26rem;
      color: #070707;
      text-align: center;
    }
  }
}
</style>
