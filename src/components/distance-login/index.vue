<template>
  <div :class="['content','clearfix',$config.newQP || $config.blackTheme ? 'model-newqp' : $config.home==='amhg'?'model-d': $config.home==='xpj' ? 'model-a' : 'model-b',{'model-blush':$config.blush}]">
    <img class="close-btn" src="../../assets/img/distance-login/close-btn.png" @click="Logout">
    <div class="cont">
      <div class="text">当前帐号异地登录，为了您账户资金安全请您输入资金密码验证身份</div>
    </div>
    <div class="form">
      <input-row v-model="password" type="number-password" v-keyBroayStates max-len="6"></input-row>
      <ul>
        <li v-for="i in 6" :key="i">
          <span v-if="password.length >= i">
            <img src="../../assets/img/distance-login/modelNewqp-input.png" v-if="$config.newQP || $config.blackTheme || $config.blush">
          </span>
        </li>
      </ul>
    </div>
    <div class="login-btn" @click="submit">验证登入</div>
  </div>
</template>

<script>
export default {
  name: "distance-login",
  data() {
    return {
      password: '',
      submitting: false
    };
  },
  created() {
  },
  methods: {
    Logout() {
      this.hide()
      this.onLogout()
    },
    hide() {
      this.$parent.hide()
    },
    submit() {
      if (this.submitting) {
        
      }else if(!this.password) {
        this.toastText('请输入资金密码')
      }else if(this.password.length !== 6) {
        this.toastText('资金密码位数不正确')
      }else {
        this.submitting = true
        this.$store.dispatch('main/validatePayPassword', { pay_password: this.password,device: 'h5' }).then(res => {
          if (res.code === 200) {
            if(localStorage['userInfo'] && JSON.stringify(localStorage['userInfo']) !== '{}') {
              this.$store.dispatch('agency/memberCenterJinguanjiaInfo')
            }
            this.$store.dispatch("user/refreshBank").then();
            this.$store.dispatch('user/refreshUsdt').then()
            this.$store.dispatch("agency/getRefundRebate")
            this.hide()
            if(localStorage['userInfo'] && JSON.stringify(localStorage['userInfo']) !== '{}') {
              this.$store.dispatch('agency/memberCenterJinguanjiaInfo')
            }
          } else {
            this.toastText(res.message, 'middle')
          }
          this.submitting = false
        })
      }
    },
  },
  watch: {
    '$store.state.main.distanceLogin' (newVal) {
      this.password = ''
    } 
  }
};
</script>

<style type="text/css" lang="less" scoped>
.content {
  position: relative;
  &.model-a {
    width: 5.76rem;
    height: 6.6rem;
    background-image: url('../../assets/img/distance-login/modelA-bg.png');
    background-size: 100% 100%;
    .cont {
      width:5rem;
      font-size:0.3rem;
      color:#000;
      line-height:0.42rem;
      margin: 3.1rem auto 0.4rem;
      padding: 0 !important;
      .text {
        font-size: 0.3rem  !important;
      }
    }
    .login-btn {
      width: 5.08rem;
      height: 0.72rem;
      line-height: 0.72rem;
      color: #fff;
      font-size: 0.4rem;
      background: #35A7EE;
      border-radius: 0.07rem;
      margin: 0.65rem auto 0;
    }
    .close-btn {
      top: 0.45rem;
      right: -0.2rem;
    }
  }
  &.model-b {
    width: 5.76rem;
    height: 6.30rem;
    background-image: url('../../assets/img/distance-login/modelB-bg.png');
    background-size: 100% 100%;
    .cont {
      width:5rem;
      font-size: 0.28rem;
      color: #000;
      line-height: 0.42rem;
      margin: 3.09rem auto 0.3rem;
    }
    .login-btn {
      width: 100%;
      height: 0.72rem;
      line-height: 0.72rem;
      color: #fff;
      font-size: 0.4rem;
      margin-top: 0.76rem;
    }
    .close-btn {
      top: 0.18rem;
      right: -0.15rem;
    }
  }
  &.model-d {
    width: 5.76rem;
    height: 6.30rem;
    background-image: url('../../assets/img/distance-login/modelD-bg.png');
    background-size: 100% 100%;
    .cont {
      width:5rem;
      font-size: 0.28rem;
      color: #000;
      line-height: 0.42rem;
      margin: 3.09rem auto 0.3rem;
    }
    .login-btn {
      width: 100%;
      height: 0.72rem;
      line-height: 0.72rem;
      color: #fff;
      font-size: 0.4rem;
      margin-top: 0.76rem;
    }
    .close-btn {
      top: 0.18rem;
      right: -0.15rem;
    }
  }
  .close-btn {
    position: absolute;
    top: 0.45rem;
    right: -0.34rem;
    width: 0.68rem;
    height: 0.68rem;
  }
  .form {
    width: 4rem;
    height: 0.625rem;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    .user-input-row {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      outline: none;
      color: transparent;
      -webkit-text-fill-color: transparent;
      caret-color:transparent;
      padding: 0;
      overflow: hidden;
      /deep/ input {
        caret-color:transparent;
        color: transparent;
        letter-spacing:0.52rem;
        padding-left: 0.08rem;
      }
    }
    ul {
      display: flex;
      justify-content: space-between;
      li {
        width: 0.5rem;
        height: 0.6rem;
        border: 0.02rem solid #333;
        border-radius: 0.05rem;
        box-sizing: border-box;
         span {
          display: block;
          width: 0.3rem;
          height: 0.3rem;
          border-radius: 50%;
          background-color: #000;
          margin: 0.13rem auto;
         }
      }
    }
  }
  &.model-newqp {
    width: 6.27rem;
    height: 6.81rem;
    background-image: url('../../assets/img/distance-login/modelNewqp-bg.png');
    background-size: 100% 100%;
    .cont {
      width:5rem;
      font-size: 0.28rem;
      color: #ABABAB;
      line-height: 0.42rem;
      margin: 3.35rem auto 0.52rem;
    }
    .login-btn {
      width: 100%;
      height: 0.72rem;
      line-height: 0.72rem;
      color: #331306;
      font-size: 0.4rem;
      margin-top: 0.76rem;
    }
    .close-btn {
      top: 0.18rem;
      right: -0.15rem;
    }
    .form {
      width: 4.5rem;
      ul li {
        border: 0.02rem solid #878787;
        span {
          width: 100%;
          height: 100%;
          background-color: transparent;
          margin: 0;
          font-size: 0;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  &.model-blush{
    width: 6.27rem;
    height: 6.81rem;
    background-image: url('../../assets/img/distance-login/modelBlush-bg.png');
    background-size: 100% 100%;
    .text {
      color: #fff;
    }
    .form {
      width: 4.5rem;
      ul li {
        border: 0.02rem solid #878787;
        span {
          width: 100%;
          height: 100%;
          background-color: transparent;
          margin: 0;
          font-size: 0;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .login-btn {
      margin-top: 1.2rem;
      color: #000;
    }
  }
}
</style>
