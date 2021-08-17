<template>
  <view-page class="login-box" :full-box="isScroll" :style="{height:height +'px'}">
    <svg class="bg-img" id="wave" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" slot="static"
         viewBox="0 24 100 35" preserveAspectRatio="none"   :style="{paddingBottom: $store.state.main.tabHeight + 'px'}">
      <defs>
        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
      </defs>
      <g class="parallax">
        <use class="theme-fill-color" xlink:href="#gentle-wave" x="50" y="0"></use>
        <use class="theme-fill-color" xlink:href="#gentle-wave" x="50" y="3"></use>
        <use class="theme-fill-color" xlink:href="#gentle-wave" x="50" y="6"></use>
      </g>
    </svg>
    <template slot="content">
      <img :style="'height:'+logoHeight" class="logo" :src="logoImg" alt="">
      <div class="bbm-box" @keypress.enter="onRegister">
        <label class="input-row">
          <span class="icon iconfont h5-icon-new-index-user theme-color"></span>
          <input name="user" v-model="modal.userName" class="input" type="text" @blur="refreshArchCode"
                 placeholder="帐号(6-10位字母或数字)" autocomplete="new-password" maxlength="10"/>
        </label>
        <label class="input-row">
          <span class="icon iconfont h5-icon-new-index-password theme-color"></span>
          <input name="password" v-model="modal.password" class="input" type="password"
                 placeholder="密码(8-20位字母或数字)" autocomplete="new-password" maxlength="20"/>
        </label>
        <label class="input-row">
          <span class="icon iconfont h5-icon-new-index-password theme-color"></span>
          <input name="password" v-model="modal.password2" class="input" type="password"
                 placeholder="请确认密码" autocomplete="new-password" maxlength="20"/>
        </label>
        <label class="input-row" v-for="(item, i) in register" :key="'input-' + i">
          <span :class="item.class + ' theme-color'"></span>
          <input :name="item.key" v-model="modal[item.key]" class="input" :type="item.type" :maxlength="item.max"
                 :placeholder="item.placeholder" autocomplete="new-password"/>
          <button v-if="item.key=='sms'" @click="stopTime" class="message-code theme-color" :class="{'ReacquireCode':!isGoTime}">{{ isGoTime ?'获取验证码': '重新获取('+stepTime+'s)'}}</button>
        </label>
        <label class="input-row auth" v-if="loginVerify=='imgCode'"  v-show="showAuth">
          <span class="icon iconfont h5-icon-new-index-yzm theme-color"></span>
          <input name="code" v-model="vercode" class="input" type="tel"
                 placeholder="验证码" autocomplete="new-password" maxlength="4"/>
          <img class="auth-code-img" v-if="$store.state.user.code.authImg" :src="$store.state.user.code.authImg" alt @click="refreshArchCode"/>
        </label>
        <label class="input-row" v-if="siteModel === 'invite_code'">
          <span class="icon iconfont h5-icon-new-index-yqm theme-color"></span>
          <input name="agent" v-model="agent" class="input" type="tel"
                 placeholder="请输入邀请码" autocomplete="new-password" :disabled="hasAgent"/>
        </label>
        <div id="reCaptcha"></div>
        <van-button type="primary" class="theme-bg theme-border submit-button" @click="onRegister">立即注册</van-button>
      </div>
      <p class="bottom" :style="{height:isScroll?'auto':'3rem'}">
        已有帐号?
        <a class="tag-a theme-color" @click.stop="$router.replace('/admin/login')">立即登录</a>
      </p>
      <!-- <div style="width: 100%;height: 3rem"></div> -->
    </template>
      <slide-verify slot="content-static" v-if="verify" 
            :userName='modal.userName'
            @success="onSuccess"
            @closeVerify='closeVerify'
            ></slide-verify>
    <div slot="content-static" v-if="loginVerify=='wyCode' && wyLoading" class="verify_all">
      <div :class="['verify_before',{'qp-verify_before' : $config.newQP || $config.blackTheme}]">
        <div class="verify_loading" :class="verifyClass"></div>
        <p>安全检测中</p>
      </div>     
    </div>     
  </view-page>
</template>

<script type="text/javascript">
import SlideVerify from '../../components/slide-verify/index'
export default {
  name: 'Register',
  data () {
    return {
        height: window.document.documentElement.clientHeight,
        isGoTime:true,
        stepTime:60,
        timeNode:null,
        interval:null,
      modal: {
        userName: '',
        password: '',
        password2: '',
        archCode: ''
      },
      isScroll:false,
      scrollHeight: 0,
      agent: '',
      hasAgent: false,
      record: false,
      submitted: false,
      height: null,
      vercode: '',
      verify: false,
      captchaIns: null,
      wyLoading: false,
      loginVerify: this.$store.state.main.VerificationCode || 'imgCode'
    }
  },
  components:{
    SlideVerify
  },
  computed: {
    logoImg(){
      let img = ''
      if(localStorage['main/logoInfo'] &&  JSON.parse(localStorage['main/logoInfo']).length > 0){
        try {
            JSON.parse(localStorage['main/logoInfo']).forEach(ff=>{
            if(ff.position === 'register_logo' && ff.clientType === 'mobile') {
              img =  localStorage.SiteStaticsUrl + ff.body[0].img
            }
          })
        } catch (error) {
          img =  require('@site/assets/img/admin/admin-logo.png')
        }
      }else{
        img =  require('@site/assets/img/admin/admin-logo.png')
      }
      return img
    },
    logoHeight () {
      return this.$config.logoChose ? this.$config.logoChose : '1rem'
    },
    siteModel () {
      return this.$store.state.main.config['site_model']
    },
    showAuth () {
      let showAuthVal = false
      try {
        if (!JSON.parse(localStorage.config)) return showAuthVal
        let registerH5Val = JSON.parse(localStorage.config).register.h5
        let index = registerH5Val.indexOf('sms')
        if (index > -1) {
          showAuthVal = false
        } else {
          showAuthVal = true
        }
        return showAuthVal
      } catch (error) {
        return showAuthVal
      }
    },
    register () {
      try {
        if (!JSON.parse(localStorage.config)) return []
        const registerH5 = JSON.parse(localStorage.config).register.h5
        // const registerH5 = ['sms','phone', 'email', 'wechat', 'realName', 'payPassword']
        let register = []
        registerH5.forEach((v, i) => {
          register[i] = {}
          switch (v) {
            case 'phone':
              register[i].placeholder = '请输入手机号'
              register[i].name = '手机号'
              register[i].class = 'icon iconfont h5-icon-new-index-phone'
              register[i].value = ''
              register[i].key = v
              register[i].type = 'tel'
              register[i].check = /^1[\d]{10}$/
              register[i].max = 11
              break
            case 'sms':
              register[i].placeholder = '请输入验证码'
              register[i].name = '手机号验证码'
              register[i].class = 'icon iconfont h5-icon-new-index-yzm'
              register[i].value = ''
              register[i].key = v
              register[i].type = 'tel'
              register[i].check = /[\d]{6}/
              register[i].max = 6
              break
            case 'email':
              register[i].placeholder = '请输入邮箱地址'
              register[i].name = '邮箱地址'
              register[i].class = 'icon iconfont h5-icon-new-index-mail'
              register[i].value = ''
              register[i].key = v
              register[i].type = 'text'
              register[i].check = /^[A-z\d_]+@[A-z\d_]+\.[a-z]+$/
              register[i].max = 99
              break
            case 'wechat':
              register[i].placeholder = '请输入微信号'
              register[i].name = '微信号'
              register[i].class = 'icon iconfont h5-icon-new-index-weixin'
              register[i].value = ''
              register[i].key = v
              register[i].type = 'text'
              register[i].check = /^[\S]+$/
              register[i].max = 32
              break
            case 'realName':
              register[i].placeholder = '真实姓名必须与银行卡姓名一致'
              register[i].name = '真实姓名'
              register[i].class = 'icon iconfont h5-icon-new-index-realname'
              register[i].value = ''
              register[i].key = v
              register[i].type = 'text'
              register[i].check = /^[\S]+$/
              register[i].max = 10
              break
            case 'payPassword':
              register[i].placeholder = '支付密码6位数字'
              register[i].name = '支付密码'
              register[i].class = 'icon iconfont h5-icon-new-index-password'
              register[i].value = ''
              register[i].key = v
              register[i].type = 'password'
              register[i].check = /^[\d]{6}$/
              register[i].max = 6
              break
          }
        })
        return register
      } catch (err) {
        return []
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
    'modal.userName' () {
      this.modal.userName = this.modal.userName.replace(/\s/g, '')
    },
    'modal.password' () {
      this.modal.password = this.modal.password.replace(/\s/g, '')
    },
    'modal.password2' () {
      this.modal.password2 = this.modal.password2.replace(/\s/g, '')
    },
    'modal.archCode' () {
      this.modal.archCode = this.modal.archCode.replace(/\s/g, '')
    },
    archCode () {
      this.modal.archCode = this.archCode
    }
  },
  updated(){
    this.hight=document.body.scrollHeight||document.body.clientHeight
  },
  mounted () {
    if(navigator.userAgent.includes('Redmi Note 5A')&&navigator.userAgent.includes('AppleWebKit')){
      this.isScroll  = true
    }else{
      this.isScroll  = false
    }
    // alert(this.$refs['input-box'])
    // this.$refs['input-box'].addEventListener('focus', () => {
    //   alert(1)
    // }, true)
    let _this = this;
    document.addEventListener("visibilitychange", _this.checkViChange);
  },
  created () {
    if (localStorage['agent']) {
      this.agent = localStorage['agent']
      localStorage.setItem('agentFirst', true)
      this.hasAgent = true
    }
  },
  methods: {
    getWYdata(){
      let _this = this
      _this.wyLoading = true
      this.$store.dispatch('user/getYiDunCode').then(res=>{
        initNECaptcha({
          element: '#reCaptcha',
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
              userName: _this.modal.userName.replace(/\s/g, "")
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
      this.registerUrl()
    },
    // onFail(){
    // },
    // onRefresh(){
    // },
    registerUrl(){
       this.$store.dispatch('user/register', {
          data: this.modal,
          record: this.record,
          callback: (res) => {
            if (typeof res === 'string') {
              this.submitted = false
              this.toastText(res, 'top')
              this.refreshArchCode()
            } else if (res['code'] === 200) {
              this.$store.dispatch('user/refreshBalance').then(res => {
                if (res.code && res.code !== 200) {
                  if (res.message.includes('设备上登录') || res.message.includes('请登录')) {
                    this.$store.commit('user/clean')
                    this.$router.replace('/')
                    this.toastText(res.message, 'top')
                    setTimeout(() => {
                      this.$stomp.reInit()
                    }, 1000)
                  }
                }
              }).catch(err => {

              })

              this.$store.dispatch('user/refreshBank').then()
              this.$store.dispatch('user/refreshUsdt').then()

              setTimeout(() => {
                this.submitted = false
                if (res.data['activity_url']) {
                  if (/^http[s]?/.test(res.data['activity_url'] || '')) {
                    window.location.href = res.data['activity_url']
                  } else if (/^\//.test(res.data['activity_url'] || '')) {
                    window.location.href = window.location.origin + res.data['activity_url']
                  } else {
                    window.location.href = 'http://' + res.data['activity_url']
                  }
                } else {
                  this.$router.replace('/')
                }
              }, 0)

              this.$store.dispatch('lottery/getAllPlayWay').then(res => {
                this.$store.commit('lottery/checkPlayWay')
              }).catch(err => {

              })
              this.$store.dispatch("user/refreshMsgCount").then();
              this.$store.dispatch('agency/getRefundRebate').then(res => {
                this.$store.commit('lottery/checkPlayWay')
              }).catch(err => {

              })

              if(localStorage['agent']){
                localStorage.removeItem('agent')
              }

              setTimeout(() => {
                this.$stomp.reInit()
              }, 1000)
            } else if (res['msg']) {
              this.submitted = false
              this.toastText(res['msg'], 'top')
              this.refreshArchCode()
              this.captchaIns && this.captchaIns.refresh()
            } else if (res['message']) {
              this.submitted = false
              this.toastText(res['message'], 'top')
              this.refreshArchCode()
              this.captchaIns && this.captchaIns.refresh()
            } else {
              this.submitted = false
              this.toastText('注册失败', 'top')
              this.refreshArchCode()
              this.captchaIns && this.captchaIns.refresh()
            }
          }
        })
    },
    onRegister () {
      if (this.$config.preview) {
        this.previewAlert()
        return
      }
      if (this.submitted) return
      if (this.modal.userName && this.modal.userName === this.modal.password) {
        this.toastText('登录密码不能与帐号相同', 'top')
      } else if (this.checkUserForRegister(this.modal.userName) &&
          this.checkPasswordForRegister(this.modal.password) &&
          this.checkPassword2(this.modal.password, this.modal.password2) &&
          this.register.every(item => {
            let tag = true
            if (this.modal[item.key]) {
              this.$set(this.modal, item.key, this.modal[item.key].replace(/\s/g, ''))
              if (item.check.test(this.modal[item.key])) {
                tag = true
              } else {
                tag = false
                this.toastText('请输入正确的' + item.name, 'top')
              }
            } else {
              tag = false
              this.toastText(item.name + '不能为空', 'top')
            }

            return tag
          }) &&
          (this.siteModel !== 'invite_code' || this.checkAgent(this.agent)) &&
          (this.loginVerify =='imgCode' ? this.isNeedAuth(this.showAuth, this.vercode)  :  true)
      ) {
        this.submitted = true
        if (this.siteModel === 'invite_code' || this.siteModel === 'invite_link') {
          if (this.agent !== '') {
            this.modal['invite_code'] = this.agent
          }
        }
        if (this.vercode !== '') {
          this.modal['code'] = this.vercode
        }
        if(this.loginVerify == 'tCode'){
          this.verify = true
        }else if(this.loginVerify == 'wyCode'){
          this.getWYdata()
        }else{
          this.registerUrl()
        }
      }
    },
    checkViChange(){
      let nowTime = ~~((Date.now() - this.timeNode)/1000);
      if(nowTime >= this.stepTime){
        clearInterval(this.interval)
        this.stepTime = 60
        this.isGoTime = true
      }else{
        this.stepTime = 60 - nowTime;
        this.stopTime()
      }
    },
    stopTime(){
      if(!this.isGoTime) return false;
      if(!this.modal.phone || !/^1[\d]{10}$/.test(this.modal.phone)){
        this.toastText('请输入正确的手机号','top')
        return false
      }
      this.$store.dispatch('user/getPhoneCode',{
        phone:this.modal.phone,
        callback: res=>{
          console.log(res)
        }
      })
      this.timeNode = Date.now()
      this.isGoTime = false
      this.interval = setInterval(() => {
        this.stepTime--
        if(this.stepTime < 0){
          this.isGoTime = true
          this.stepTime = 60
          clearInterval(this.interval)
        }
      }, 1000);
    },
    refreshArchCode () {
      this.$store.dispatch('user/refreshAuthCode', { userName: this.modal.userName })
    },
    isNeedAuth (showAuth, code) {
      if(this.loginVerify != 'imgCode'){
        return false
      }
      if (showAuth) {
        let show = this.checkCode(code)
        return show
      } else {
        return true
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .login-box {
    background-color: white;

    .logo {
      display: block;
      height: 1rem;
      padding: .8rem 0 .3rem !important;
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
        &::after{
          position: absolute;
          box-sizing: border-box;
          content: ' ';
          pointer-events: none;
          right: 0;
          bottom: 0;
          left: 0rem;
          border-bottom: 0.02rem solid #ebedf0;
          -webkit-transform: scaleY(.5);
          transform: scaleY(.5);
        }

        .icon {
          font-size: 0.46rem;
          height: 0.48rem;
          display: block;
          transform: translateY(-0.04rem);
          width: 0.56rem;
          text-align: center;
        }

        .input, .input:-webkit-autofill {
          flex: 1;
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

          &:focus {
            -webkit-appearance: none;
            border: none;
            outline: 0;
          }
        }

        &.auth {
          padding: 0.24rem 0;
        }

        .auth-code-img {
          height: 0.6rem;
          transform-origin: right;
        }
        .message-code{
          width:2.1rem;
          height:0.58rem;
          background: #fff;
          border-radius:0.1rem;
          border: 0.02rem solid ;

          color:white;
          font-size:0.28rem;
          font-family:Microsoft YaHei;
          font-weight:400;
        }
        .ReacquireCode{
          //background:#4D8FFA;
        }
      }
      .input-row:nth-last-child(2){
        //border-bottom:none!important;
      }

      .password-row {
        width: 100%;
        font-size: 0.32rem;
        line-height: 1.3rem;
        height: 1.3rem;
        color: #888;

        &:after {
          content: '';
          display: table;
          clear: both;
        }

        .no-password {
          float: left;
        }

        .recode-password {
          float: right;
          word-spacing: normal;

          .switch-box {
            display: inline-block;
            position: relative;
            top: 0.16rem;
          }
        }
      }
    }

    .submit-button {
      margin-top:0.17rem;
      height: 0.9rem;
      line-height: 0.9rem;
      font-size: 0.36rem;
      width: 100%;
      display: block;
      border-radius: 0.1rem;
      border:none;
    }

    .bottom {
      text-align: center;
      margin-top: 0;
      font-size: .32rem;
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
      pointer-events: none;
    }

    .bg-img .parallax > use {
      fill-opacity: 0.2;
    }

    .parallax > use {
      animation: wave-move 20s linear infinite
    }

    .parallax > use:nth-child(1) {
      animation-delay: -2s
    }

    .parallax > use:nth-child(2) {
      animation-delay: -2s;
      animation-duration: 17s
    }

    .parallax > use:nth-child(3) {
      animation-delay: -4s;
      animation-duration: 13s
    }

    @keyframes wave-move {
      0% {
        transform: translate(-1.75rem, 0)
      }

      100% {
        transform: translate(1.75rem, 0)
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
