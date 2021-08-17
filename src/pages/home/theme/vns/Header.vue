<template>
  <div class="home-header theme-bg vns-home-header theme-main-bg">
    <div v-if="$config.blackTheme">
      <a href="javascript:void(0)" class="home-left-button" v-if="$config.preview" @click="goBackUrl">返回旧版</a>
      <img src="@src/assets/img/home/black/app-download.png" class="home-left-button black-home-left-button" v-else @click="$emit('on-download')">
      <img class="home-logo" src="@site/assets/img/home/logo.png" alt="">
      <a href="javascript:void(0)" class="home-right-button" v-if="$store.state.user.token" @click="onLogout">
        <img class="home-right-icon" src="@src/assets/img/home/black/blackExit.png" alt/>退出
      </a>
      <a href="javascript:void(0)" class="home-right-button" v-else @click="onLogin()">
        <span v-if="['103qp','aqvns','737qp'].includes($config.name)" style="font-size:0.3rem"><img class="home-right-icon" style="right:105%" src="@src/assets/img/user/vnsLogin.png" alt/>登录/注册</span>
        <span v-else><img class="home-right-icon" src="@src/assets/img/user/vnsLogin.png" alt/>登录</span>
      </a>
    </div>
    <div v-else>
      <a href="javascript:void(0)" class="home-left-button" v-if="$config.preview" @click="goBackUrl">返回旧版</a>
      <a href="javascript:void(0)" class="home-left-button" v-else v-show="$config.name !== 'ylhg'" @click="$emit('on-download')">APP下载</a>
      <img class="home-logo" src="@site/assets/img/home/logo.png" alt="">
      <a href="javascript:void(0)" class="home-right-button" v-if="$store.state.user.token" @click="onLogout">
        <img class="home-right-icon" src="@src/assets/img/home/vnsExit.png" alt/>退出
      </a>
      <a href="javascript:void(0)" class="home-right-button" v-else @click="onLogin()">
        <span v-if="['103qp','aqvns','737qp'].includes($config.name)" style="font-size:0.3rem"><img class="home-right-icon" style="right:105%" src="@src/assets/img/user/vnsLogin.png" alt/>登录/注册</span>
        <span v-else><img class="home-right-icon" src="@src/assets/img/user/vnsLogin.png" alt/>登录/注册</span>
      </a>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'Header',
  methods: {
    onLogin(){
      if(this.$config.homeLogin && !this.isApp) {
        this.$config.home === 'vns' ? this.$router.push('/home-login-b') 
        : this.$config.home === 'qp' ? this.$router.push('/home-login-c') 
        :this.$router.push('/home-login-a')
      }else {
        if(['blr','vnso','amhg'].includes(this.$config.name)) {
          this.$router.push('/admin/login')
        }else {
          this.$router.push('/admin/vns-login')
        }
      }
    }
  },
}
</script>

<style lang="less" type='text/less' scoped>
  .home-header {
    height: 0.88rem;
    width: 100%;
    background-color: white;
    position: relative;
    & > div {
      height: 100%;
    }
    .home-left-button {
      position: absolute;
      left: 0.2rem;
      top: 0.18rem;
      line-height: 0.52rem;
      font-size: 0.28rem;
      border-radius: 0.1rem;
      padding: 0 .16rem;
      color: #fff;
      border: 0.02rem solid #fff;
      &.black-home-left-button {
        border: none;
        width: 1.48rem;
        height: 0.56rem;
        padding: 0;
      }
    }

    .home-logo {
      display: block;
      height: 100%;
      margin: 0 auto;
      padding: 0.1rem 0;
      box-sizing: border-box;
    }

    .home-right-button {
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
      width: 0.35rem;
      height: 0.35rem;
      right: 115%;
      top: 0.25rem;
    }
  }
</style>
