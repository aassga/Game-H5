<template>
  <div class="qp-box">
    <div class="down-top clearfix" v-if="isTop && !['103qp','hty','fhcp','dqr','qxcp','839qp','aqvns'].includes($config.name)" v-no-touch-move>
      <img src="../../assets/img/login/dowm/down_close_s.png" @click="onCloseTop" class="left-logo">
      <div class="center">
        <img :src="require('@site/assets/img/admin/top_logo.png')" alt="">
        <div class="txt-area" v-html="money">
        </div>
      </div>
      <img src="../../assets/img/login/dowm/down_top_btn.png" class="right-img" @click="onDownload">
    </div>
    <div :class="['container',{'no-top': ['103qp','hty','fhcp','dqr','qxcp','839qp','aqvns'].includes($config.name)}]" :style="!['103qp','hty','fhcp','dqr','qxcp','839qp','aqvns'].includes($config.name) ? siteTop : '' ">
      <div class="header-top" v-no-touch-move>
          <div class="back" @click="goBack">
            <a>返回</a>
            <div class="left-arrow"></div>
          </div>
          <h1 v-if="tabIndex===0">登录</h1>
          <h1 v-if="tabIndex===1">注册会员</h1>
          <div class="top-right">
            <i v-if="tabIndex===1" @click="goBack" class="icon iconfont h5-icon-shouyeicon"></i>
            <span v-if="tabIndex===0 && !$config.newQP" @click="goHelp">帮助中心</span>
          </div>
      </div>
      <div :class="['vns-header','self-vns-header',{'newqp-header':$config.newQP}]" v-no-touch-move>
        <div class="logo">
          <div class="logo-img">
            <img src="@site/assets/img/admin/admin-logo.png" alt=""/>
          </div>
        </div>
        <div class="title">
          <van-tabs v-model="active" @click="tabClick">
            <van-tab title="会员登录"></van-tab>
            <van-tab  title="帐号注册"></van-tab>
          </van-tabs>
        </div>
      </div>
      <div class="wrap" ref="wrap">
        <div class="content" :class="{'sf':isSf}">
          <div class="bg-color"><div class="left-tran"></div> <div class="right-tran"></div></div>
          <div class="content-box">
            <div v-if="tabIndex === 0" class="form">
              <ul>
                <li class="user-name">
                  <i class="icon icon iconfont h5-icon-yonghu user theme-color"></i>
                  <input
                    class="dlName"
                    placeholder="请输入帐号"
                    ref="loginUserName"
                    v-model="userName"
                    @blur="userNameBlur"
                    @focus="userNameFocus"
                    type="text"
                    autocomplete="new-password"
                    @input="inputChange"
                  />
                  <i v-if="isClose.dlName==1" @click.stop="onClear('dlName')" class="close icon iconfont h5-icon-icon-delete theme-color"></i>
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
                  <i class="icon iconfont h5-icon-mima pwd theme-color"></i>
                  <input
                    v-model="password"
                    placeholder="请输入密码"
                    :type="loginPwShow ? 'text' : 'password'"
                    @blur="onBlur"
                    @focus="onFocus"
                    autocomplete="new-password"
                  />
                  <i :class="['icon','iconfont','pw',loginPwShow ? 'h5-icon-yanjingtubiao' : 'h5-icon-kaiqimima']" @click="loginPwShow = !loginPwShow"></i>
                </li>
                <li class="yzm" v-if="loginVerify=='imgCode'" v-show="isCaptcha && $store.state.user.code.authImg">
                  <i class="icon iconfont h5-icon-icon-yzm record theme-color"></i>
                  <input
                    v-model="code"
                    maxlength="4"
                    placeholder="验证码"
                    @blur="onBlur"
                    @focus="onFocus"
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
            <div v-if="tabIndex ===1 " class="form register-form" ref="formHei">
              <ul>
                <li>
                  <i class="icon iconfont h5-icon-xinghao user theme-color"></i>
                  <input
                    class="zcName"
                    name="user"
                    v-model="modal.userName"
                    type="text"
                    placeholder="帐号6-10位数字和字母"
                    maxlength="10"
                    @blur="onBlur('zcName')"
                    @focus="onFocus"
                    @input="inputChange"
                  />
                  <i v-if="isClose.zcName==1" @click.stop="onClear('zcName')" class="close icon iconfont h5-icon-icon-delete theme-color"></i>
                </li>
                <li>
                  <i class="icon iconfont h5-icon-xinghao pwd theme-color"></i>
                  <input
                    class="password"
                    name="password"
                    v-model="modal.password"
                    type="password"
                    maxlength="20"
                    placeholder="密码8-20个数字和字母"
                    @blur="onBlur('password')"
                    @focus="onFocus"
                    @input="inputChange"
                  />
                  <i v-if="isClose.password==1" @click.stop="onClear('password')" class="close icon iconfont h5-icon-icon-delete theme-color"></i>
                </li>
                <li>
                  <i class="sure-pwd icon iconfont h5-icon-xinghao theme-color"></i>
                  <input
                    class="password2"
                    name="password"
                    v-model="modal.password2"
                    type="password"
                    placeholder="确认密码"
                    autocomplete="new-password"
                    maxlength="20"
                    @blur="onBlur('password2')"
                    @focus="onFocus"
                    @input="inputChange"
                  />
                  <i v-if="isClose.password2==1" @click.stop="onClear('password2')" class="close icon iconfont h5-icon-icon-delete theme-color"></i>
                </li>
                <li v-for="(item, i) in register" :key="'input-' + i">
                  <i :class="[item.key ,item.class,'theme-color']"></i>
                  <input
                    class="archCode"
                    :name="item.key"
                    v-model="modal[item.key]"
                    :type="item.type"
                    :maxlength="item.max"
                    :placeholder="item.placeholder"
                    autocomplete="new-password"
                    @blur="onBlur('archCode')"
                    @focus="onFocus"
                    @input="inputChange"
                  />
                  <i v-if="isClose.archCode==1 && item.key!='sms'" @click.stop="onClear('archCode',item.key)" class="close icon iconfont h5-icon-icon-delete theme-color"></i>
                  <button
                    v-if="item.key=='sms'"
                    @click="stopTime"
                    :class="{'isGoTime':!isGoTime}"
                    class="message-code nvs-message-code theme-color"
                  >{{ isGoTime ?'获取验证码': '重新获取('+stepTime+')'}}</button>
                </li>
                <li class="yzm" v-if="loginVerify=='imgCode'" v-show="showAuth && isCaptcha && $store.state.user.code.authImg">
                  <i class="icon icon iconfont h5-icon-xinghao record theme-color"></i>
                  <input
                    class="yzm"
                    v-model="vercode"
                    maxlength="4"
                    placeholder="验证码"
                    @blur="onBlur"
                    @focus="onFocus"
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
                  <i class="yqm icon iconfont h5-icon-xinghao theme-color"></i>
                  <input
                    class="agent"
                    name="agent"
                    v-model="agent"
                    type="tel"
                    placeholder="请输入邀请码"
                    autocomplete="new-password"
                    :disabled="hasAgent"
                    @blur="onBlur('agent')"
                    @focus="onFocus"
                    @input="inputChange"
                  />
                   <i v-if="isClose.agent==1" @click.stop="onClear('agent')" class="close icon iconfont h5-icon-icon-delete theme-color"></i>
                </li>
              </ul>
            </div>
          </div>
          <button
            type="button"
            @click="onSubmit"
            :class="tabIndex ===0  &&  (submitted || userName.length===0 )? 'disabled' :''"
            class="submit"
          >{{ tabIndex ===0 ? '登录': '注册' }}</button>

          <button
            v-if="tabIndex === 0"
            type="button"
            @click="goRegister"
            class="goReg"
          >立即注册</button>

          <div v-if="loginVerify!='wyCode'" id="captchaVns"></div>
          <div style="width:100%; height:0.4rem;"></div>
          <div class="lxkf" v-if="tabIndex ===0" @click="inService()">联系客服</div>
          <div class="bottom" v-if="$config.home === 'qp'">
            <div class="bottomLink" v-if="tabIndex ===1 ">
              已有帐号 ,
              <span @click="goLogin">去登录</span>
            </div>
          </div>
        </div>
        <div class="down-shade" v-if="isShade" v-no-touch-move>
          <div class="down-box">
            <div class="down-box-top">
              <span class="az">{{$config.name === '839qp' ? '800' : '100'}}万人安装</span>
              <img class="down-close" @click="onCloseShade" src="../../assets/img/login/dowm/down_close_d.png" alt=""/>
            </div>
            <div class="down-log">
              <img :src="require('@site/assets/img/admin/down_center.gif')" alt="">
            </div>
            <div class="down-btn">
              <span @click="onDownload"><img src="../../assets/img/login/dowm/ios_btn.png" alt=""></span>
              <span @click="onDownload"><img src="../../assets/img/login/dowm/and_btn.png" alt=""></span>
            </div>
          </div>
        </div> 
      </div>
      
      
      <!-- <drag-box @clickHandle="inService()" :h="1.47" :w="1" :x="6" :y="3.2">
        <div slot="content">
          <img src="../../assets/img/login/red-kefu.png" alt="" style="width:100%;height:100%">
        </div>
      </drag-box> -->
      
    </div>
    <slide-verify slot="content-static" v-if="verify" 
            :userName='userName || modal.userName'
            @success="onSuccess"
            @closeVerify='closeVerify'
            ></slide-verify>
            <div id="captchaVns"></div>
    <div slot="content-static" v-if="loginVerify=='wyCode' && wyLoading" class="verify_all">
      <div :class="['verify_before',{'qp-verify_before' : $config.newQP}]">
        <div class="verify_loading" :class="verifyClass"></div>
        <p>安全检测中</p>
      </div>     
    </div> 
    <div v-show="isShow" class="down-bottom" @click="onDownload" v-no-touch-move>
        <img :src="require('@site/assets/img/admin/down_bottom.gif')" alt=""/>
    </div>
           
  </div>
</template>

<script>
import BScroll from "better-scroll";
import SlideVerify from '../../components/slide-verify/index'
import { setTimeout } from 'timers';
import logoMixin from '../home/theme/mixin'
export default {
  name: "VnsLogin",
  mixins: [logoMixin],
  data() {
    return {
      isShow:true,
      isSf:false,
      siteTop:{
        position:'absolute',
        top: '0.84rem',
        left:'0',
      },
      isTop:true,
      isShade:false,
      authList:[],
      config:[],
      className:'',
      isClose:{
        agent:0,
        archCode:0,
        password:0,
        password2:0,
        dlName:0,
        zcName:0,
      },
      loginPwShow:false,
      active:0,
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
      loginVerify: this.$store.state.main.VerificationCode || 'imgCode' // type  tCode: 滑动验证 imgCode： 图片验证  wyCode：网易盾
    };
  },
  components: {
    SlideVerify
  },
  created() {
    if(sessionStorage['showBlackAdvert'] && sessionStorage['showBlackAdvert'] == '1') {
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
  },
  computed: {
    money() {
      switch (this.$config.name) {
        case 'fhcp':
          return '下载手机APP应用，注册即送9044元'
        case 'dqr':
          return '下载手机APP应用，注册即送8888元'
        case 'hty':
          return '下载手机APP应用，注册即送8824元'
        case '103qp':
          return '下载手机APP应用，注册即送9999元'
        case 'qxcp':
          return '下载手机APP应用，注册即送8888元'
        case '737qp':
          return '下载手机APP应用，首存30元送68元' 
        case '839qp':
          return '下载手机APP应用，注册即送1.03元'
      }
    },
    showAuth() {
      let showAuthVal = false;
      try {
        if(localStorage.config==undefined){
           this.$store.dispatch("main/setConfig").then((res) => {
            if(res.code === 200) {
              this.authList = res.data;
            }
          })
        }else{
          this.authList = JSON.parse(localStorage.config);
        }
        if (!this.authList) return showAuthVal;
        let registerH5Val = this.authList.register.h5;
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
      return this.$store.state.main.config ? this.$store.state.main.config['site_model'] : ''
    },
    register() {
      //动态设置注册所需资料
      try {
        if(localStorage.config==undefined){
           this.$store.dispatch("main/setConfig").then((res) => {
            if(res.code === 200) {
              this.config = res.data;
            }
          })
        }else{
          this.config = JSON.parse(localStorage.config);
        }
        if (!this.config) return [];
        let registerH5 = this.config.register.h5;
        let register = [];
        registerH5.forEach((v, i) => {
          register[i] = {};
          switch (v) {
            case "phone":
              register[i].placeholder = "请输入手机号";
              register[i].name = "手机号";
              register[i].class = "icon iconfont h5-icon-xinghao";
              register[i].value = "";
              register[i].key = v;
              register[i].type = "tel";
              register[i].check = /^1[\d]{10}$/;
              register[i].max = 11;
              break;
            case "sms":
              register[i].placeholder = "请输入验证码";
              register[i].name = "手机号验证码";
              register[i].class = "icon iconfont h5-icon-xinghao";
              register[i].value = "";
              register[i].key = v;
              register[i].type = "tel";
              register[i].check = /[\d]{6}/;
              register[i].max = 6;
              break;
            case "email":
              register[i].placeholder = "请输入邮箱地址";
              register[i].name = "邮箱地址";
              register[i].class = "icon iconfont h5-icon-xinghao";
              register[i].value = "";
              register[i].key = v;
              register[i].type = "text";
              register[i].check = /^[A-z\d_]+@[A-z\d_]+\.[a-z]+$/;
              register[i].max = 99;
              break;
            case "wechat":
              register[i].placeholder = "请输入微信号";
              register[i].name = "微信号";
              register[i].class = "icon iconfont h5-icon-xinghao";
              register[i].value = "";
              register[i].key = v;
              register[i].type = "text";
              register[i].check = /^[\S]+$/;
              register[i].max = 32;
              break;
            case "realName":
              register[i].placeholder = "真实姓名必须与银行卡姓名一致";
              register[i].name = "真实姓名";
              register[i].class = "icon iconfont h5-icon-xinghao";
              register[i].value = "";
              register[i].key = v;
              register[i].type = "text";
              register[i].check = /^[\S]+$/;
              register[i].max = 10;
              break;
            case "payPassword":
              register[i].placeholder = "请输入支付密码";
              register[i].name = "支付密码";
              register[i].class = "icon iconfont h5-icon-xinghao";
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
      this.$refs.wrap.scrollTo(0,0)
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
    this.initScroll();

    //解决input获焦底部下载广告弹起
     if(this.$mobileDevice.isAndroid){
        let originalHeight=document.documentElement.clientHeight ||document.body.clientHeight;
        window.addEventListener('resize', ()=> {
          var resizeHeight=document.documentElement.clientHeight || document.body.clientHeight;
          if(resizeHeight-0<originalHeight-0){
             //当软键盘弹起，在此处操作
              this.isShow = false;
          }else{
            //当软键盘收起，在此处操作
            this.isShow = true;
          };
        })
      } 
       if(this.$mobileDevice.isIOS){
        document.body.addEventListener('focusin', () => {
                //软键盘弹出的事件处理
                this.isShow = false;
            })
          document.body.addEventListener('focusout', () => {
                //软键盘收起显示底部解决IOS底部弹起
                this.isShow = true;
            })
        }
  },
  methods: {
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
      this.$config.homeLogin = false;
      this.$router.push("/home");
    },
    goHelp() {
      this.$config.homeLogin = false;
      this.$router.push("/help");
    },
    tabClick(val){
      val === 0 ? this.goLogin() : this.goRegister();
    },
    goLogin() {
      this.isShade = false
      this.tabIndex = 0;
      this.active = 0
    },
    goRegister() {
      this.tabIndex = 1;
      this.active = 1
      this.isShade = true
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
      this.loginPwShow = false;
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
           this.isClose.dlName = 0;
          this.refreshArchCode();
        }, 0);
      }
    },
    onBlur(val){
      setTimeout(()=>{
          switch(this.className){
          case 'zcName':
            this.refreshArchCode();
          this.isClose.zcName = 0;
          break;
          case 'password':
          this.isClose.password = 0;
          break;
          case 'password2':
          this.isClose.password2 = 0;
          break;
          case 'archCode':
          this.isClose.archCode = 0;
          break;
          case 'agent':
          this.isClose.agent = 0;
          break;
        }
      },0)
    },
    onFocus(){
      //this.isShow = false;
    },
    inputChange(e){
      this.className = e.target.className;
      let val = e.target.value;
      if(this.className == 'dlName') this.isClose.dlName = val === '' ? 0 : 1;
      if(this.className == 'zcName') this.isClose.zcName = val === '' ? 0 : 1;
      if(this.className == 'password') this.isClose.password = val === '' ? 0 : 1;
      if(this.className == 'password2') this.isClose.password2 = val === '' ? 0 : 1;
      if(this.className == 'archCode') this.isClose.archCode = val === '' ? 0 : 1;
      if(this.className == 'agent') this.isClose.agent = val === '' ? 0 : 1;
    },
    onClear(val,key){
      if(val === 'dlName') this.userName = '';
      if(val === 'zcName') this.modal.userName = '';
      if(val === 'password') this.modal.password = '';
      if(val === 'password2') this.modal.password2 = '';
      if(val === 'archCode') this.modal[key] = '';
      if(val==='agent') this.agent = '';
      switch(this.className){
        case 'dlName':
        this.isClose.dlName = 0;
        break;
        case 'zcName':
        this.isClose.zcName = 0;
        break;
        case 'password':
        this.isClose.password = 0;
        break;
        case 'password2':
        this.isClose.password2 = 0;
        break;
        case 'archCode':
        this.isClose.archCode = 0;
        break;
        case 'agent':
        this.isClose.agent = 0;
        break;
      }
    },
    //关闭遮罩层广告
    onCloseShade(){
      this.isShade = false;
      this.isSf = true;
    },
    //关闭顶部广告
    onCloseTop(){
      this.isTop = false;
      this.siteTop = {
        position:'absolute',
        top:'0',
        left:'0',
      }
    },
    
  },
  beforeDestroy() {
    clearInterval(this.interval);
    this.$store.state.user.code = {
      authImg: "",
      code: ""
    };
    sessionStorage.removeItem('showBlackAdvert')
  },
};
</script>

<style lang="less" scoped>
/deep/.login-container {
  min-height: 100%;
}
.qp-box {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  left: 0;
  top: 0;
  background-color: #000 !important;
  position:relative;
  .down-bottom{
      position: fixed;
      bottom: -0.1rem;
      z-index: 502;
      background: #000;
      img{
        width:100%;
      }
  }
  
  
  .container{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    height: 100%;
    position: fixed!important;
    top:0.78rem;
    width: 100%;
    transition: all .8s;
    &.no-top {
      top: 0 !important;
    }
  .self-vns-header {
    .title span{
      color: #666;
      background-color: #f3f3f3;
      &.active {
        color:rgb(200, 162, 125)!important;
        border-bottom: 0.06rem solid rgb(200, 162, 125) !important;
      }
    }
  }
  .wrap{
    overflow-y: scroll;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    position: relative;
    .sf{animation: sf .8s linear;}
    @keyframes sf{
             0%{transform:scale(0.5);opacity: 0;}
             50%{transform:scale(0.8);opacity: 0.5;}
            100%{transform:scale(1);opacity: 1;}
        }
    .down-shade{
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      position: absolute;
      top:0;
      left:0;
      bottom: 0;
      right: 0;
      margin:auto;
      z-index: 101;
      .down-box{
        width:100%;
        height: 3.92rem;
        position: relative;
        top:0.18rem;
      .down-box-top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right:0.36rem;
        .az{
          width: 1.94rem;
          height: 0.44rem;
          background-color: #b70008;
          border-top-right-radius: 0.44rem;
          border-bottom-right-radius: 0.44rem;
          font-size: 0.28rem;
          font-family: PingFang-SC-Bold;
          color: #fff;
        }
        .down-close{
          cursor: pointer;
          width: 0.4rem;
          height: 0.4rem;
        }
      }
      
      .down-log{
        margin: 0.1rem 0 0.2rem 0;
        img{
          width: 100%;
        }
      }
      .down-btn{
        span{
          display: inline-block;
          &:first-child{
            margin-right: 0.16rem;
            animation: heart_beat .8s infinite linear;
            cursor: pointer;
            img{
              width: 3.08rem;
              height: 0.9rem;
            }
          }
           &:last-child{
            margin-left: 0.16rem;
            animation: heart_beat .8s infinite linear;
            animation-delay: .4s;
            cursor: pointer;
            img{
              width: 3.08rem;
              height: 0.9rem;
            }
          }
        }
        @keyframes heart_beat{
            0%{transform:scale(.9)}
            50%{transform:scale(1.1)}
            100%{transform:scale(.9)}
        }
      }
    }
  }
  }
  .content {
    background: #000;
    color: #fff !important;
    position: relative;
      .bg-color{
        position: absolute;
        top: 0.8rem;
        width: 100%;
        z-index: 1;
        .left-tran {
            position: absolute;
            left: 0;
            top: -0.8rem;
            width: 0;
            height: 0;
            border-color: #28282a transparent transparent;
            border-style: solid;
            border-width: 0.8rem 0 0 0.8rem;
        }
      .right-tran {
          position: absolute;
          right: 0;
          top: -0.8rem;
          width: 0;
          height: 0;
          border-color: #28282a transparent transparent;
          border-style: solid;
          border-width: 0.8rem 0.8rem 0 0;
      }
    }
    .content-box{
      width: 80%;
      margin: 0 auto;
       border:2px;
      // border: 0.01rem solid 28282a;
      background-color: #28282a;
      overflow-y: scroll;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      position: relative;
      
      // z-index: 10;
      .forget-pwd {
        color: #E42018FF!important
      }
      .iconfont {
        color: #E42018FF!important
      }
      .pw{
          position: absolute;
          right: 0.32rem;
          color: #999999 !important;
          font-size: 0.36rem;
      }
      
    }
    .lxkf{
      width: 80%;
      margin:0 auto;
      text-align: left;
      color: #fba601 !important;
      font-size: 0.28rem;
    }
    .bottom {
      color: #fff;
      font-size: 0.28rem;
      margin:-0.24rem 0 1.8rem 0;
      span {
        text-decoration:underline;
        color: #fba601;
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
  }
  
}
.down-top{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 0.84rem;
  display: flex;
  align-items: center;
  border-radius: 5px;
  background: url('../../assets/img/login/dowm/top_bg.png');
  background-size: 100% 100%;
  .left-logo {
    margin: 0 0.12rem;
    width: 0.23rem;
    height: 0.23rem;
  }
  .center {
    font-size:0.28rem;
    color: #fff;
    display: flex;
    align-items: center;
    height: 100%;
    width: 5.2rem;
    margin: 0;
    img{
      width: 0.62rem;
      height: 0.62rem;
      margin-right: 0.12rem;
      float: left;
    }
  }
  .right-img {
    margin-left:0.16rem;
    width: 1.56rem;
    height: 0.52rem;
  }
}
 .header-top{
    background: #202021;
    padding: 1px 0;
      .back {
      position: absolute;
      top: 0.2rem;
      left: 0.36rem;
      display: block;
      font-size: 0.28rem;
      line-height: 0.42rem;
      color: #fff;
      a{
        padding-left: 0.32rem;
        font-size: 0.28rem;
      }
    .left-arrow {
          position: absolute;
          width: 0.6rem;
          height: 0.6rem;
          top: -0.08rem;
          left: -0.1rem;
          font-size: 0.28rem;
      }
    .left-arrow:before {
          content: "";
          position: absolute;
          width: 0.26rem;
          height: 0.26rem;
          border: 0.02rem solid #fff;
          border-width: 0.02rem 0 0 0.02rem;
          -webkit-transform: rotate(315deg);
          transform: rotate(315deg);
          top: 0.16rem;
          left: 0.14rem;
      }
    }
    h1{
        margin: 0 1.76rem;
        height: 0.78rem;
        width: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 0.78rem;
        text-align: center;
        font-size: 0.32rem;
        font-family: 'WeiRuanYaHei';
        color: #fff;
    }
    .top-right{
        position: absolute;
        top: 0.15rem;
        right: 0.3rem;
        display: block;
        font-size: 0.28rem;
        color: #fff; 
        .iconfont{
          font-size:0.4rem;
        } 
    }
  }

.vns-header {
  width: 100%;
  background: #27282A;
  background-size: cover;
  overflow: visible;
  box-sizing: border-box;
  &.newqp-header {
    .logo-img img {
      width: 2.69rem !important;
      height: auto !important;
    }
  }
  .logo{
    width:100%;
    .logo-img{
      height:1.6rem;
      display: flex;
      align-items: center;
      img{
        width: 3.69rem;
        margin: 0 auto;
      }
    }
    p{
      font-size: 0.24rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.15rem;
    }
  }
  .title {
    width: 80%;
    margin:0 auto;
    box-sizing: border-box;
    display: flex;
    /deep/.van-tab{
      display: inline!important;
      line-height: 0.4rem!important;
      font-size:0.28rem!important;
      color: #858585!important;
      background: #27282A!important;
    }
    /deep/.van-tabs::after{
      border-bottom: 3px solid #3f3f40!important;
    }
    /deep/.van-tabs__wrap::after{
      display: none!important;
    }
    /deep/.van-tabs__line{
      width: 50%!important;
      background: #C52721!important;
    }
    /deep/.van-tab--active{
      font-weight: normal!important;
      background:#27282A!important;
      color: #C52721!important;
    }
    /deep/.van-tabs--line .van-tabs__wrap{
      height: 0.72rem!important;
      background: #27282A!important;
    }
  }
}
.content {
  width: 100%;
  box-shadow: 0px 0.05rem 0.25rem 0px rgba(38, 91, 77, 0.06);
  box-sizing: border-box;
  .form {
    height: auto;
    ul {
      height: auto;
      padding: 0.2rem 0.1rem 0.5rem;
      li {
        width:5.6rem;
        height:0.76rem;
        display: flex;
        align-items: center;
        margin:0 auto;
        border: none;
        background-color: #323232;
        border-radius: 30px;
        margin-top: 0.3rem;
        padding-left:0.4rem;
        position: relative;
        .iconfont {
          color: #E42018FF!important
        }
        &:after {
          position: absolute;
          right: 0;
          bottom: 0;
          height: 1px;
          content: "";
          transform: scaleY(0.5);
          // background-color: #efefef;
          width: 100%;
        }

        &.user-name {
          position: relative;
          .userRecordList {
            position: absolute;
            left: 0.7rem;
            top: 0.9rem;
            width: 4.8rem;
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
         input:focus {
             font-family: 'WeiRuanYaHei'!important;
        }
        input {
          width: 4.46rem;
          height: 0.56rem;
          
          padding-left: 0.2rem;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          font-size: 0.28rem;
          font-family: 'WeiRuanYaHei'!important;
          color: #fff;
        }
        input::-webkit-input-placeholder {
          font-size: 0.28rem;
         font-family: 'WeiRuanYaHei'!important;
          color: #fff;
          text-transform: capitalize !important;
        }

        input::-moz-placeholder {
          font-size: 0.28rem;
         font-family: 'WeiRuanYaHei'!important;
          color: #fff;
          text-transform: capitalize !important;
        }

        input::-ms-input-placeholder {
          font-size: 0.28rem;
         font-family: 'WeiRuanYaHei'!important;
          color: #fff;
          text-transform: capitalize !important;
        }
      input:-webkit-autofill , textarea:-webkit-autofill, select:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
            background-color: #27282A !important;//设置input框记住密码背景颜色
            background-image: none;
            transition: background-color 50000s ease-in-out 0s;
            -webkit-text-fill-color: #fff !important;//设置浏览器默认密码字体颜色
        }
    
        .close{
            position: absolute;
            right: 0.28rem;
        }
        .user,
        .pwd,
        .record {
          color:#d3d3d3;
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
      .yzm{
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
        width: 3.6rem;
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        margin-left: 0.08rem;
        .code-num{
          position: absolute;
          left: 3.7rem;
          border-radius: 0.1rem;
          width: 1.76rem;
          height: 0.65rem;
          pointer-events: painted !important;
          font-size: 0.32rem;
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
      color: rgba(136, 136, 136, 1);
      flex: 1;
      text-align: left;
    }

    .remeber_pwd {
      color: rgba(136, 136, 136, 1);
      font-size: 0.3rem;
      margin-right: 0.16rem;
    }

    .van-switch {
      transition: all 400ms;
    }

    .van-switch--on {
      transition: all 400ms;
    }
  }
  .submit , .goReg{
    width: 80%;
    height: 0.7rem;
    border-radius: 0.05rem;
    font-size: 0.3rem;
    color: #fff;
    margin-top: 0.3rem;
    background:#C92526;
    &.goReg {
      background: #4fa1d0;
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
      color:#E42018FF!important;
    }
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
