<template>
  <div class="home-header">
    <a href="javascript:void(0)" class="home-left-button" v-if="$config.preview" @click="goBackUrl">返回旧版</a>
    <a href="javascript:void(0)" class="home-left-button" ref="downlodAnd" v-else @click="$emit('on-download')" >APP下载</a>
    <img class="home-logo" :src="logoImg" alt="" v-if="$config.name !== '500w'">
    <a href="javascript:void(0)" class="home-right-button" v-if="$store.state.user.token" @click="onLogout">
      <img class="home-right-icon" src="@src/assets/img/home/exit.png" alt/>退出
    </a>
    <a href="javascript:void(0)" class="home-right-button" v-else @click="onLogin()">
      <img class="home-right-icon" src="@src/assets/img/home/login.png" alt/>{{$config.name === '500w' ? '登录' : '登录/注册'}}
    </a>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'Header',
  data() {
    return {}
  },
  computed: {
    logoImg() {
      let img = ''
      if(localStorage['main/logoInfo'] &&  JSON.parse(localStorage['main/logoInfo']).length > 0){
        try {
            JSON.parse(localStorage['main/logoInfo']).forEach(ff=>{
            if(ff.position === 'logo' && ff.clientType === 'mobile') {
              img =  localStorage.SiteStaticsUrl + ff.body[0].img
            }
          })
        } catch (error) {
          img =  require('@site/assets/img/home/logo.png')
        }
      }else{
        img =  require('@site/assets/img/home/logo.png')
      }
      return img
    }
  },
  methods:{
    onLogin(){
      if(this.$config.homeLogin && !this.isApp) {
        this.$config.home === 'vns' ? this.$router.push('/home-login-b') 
        : this.$config.home === 'qp' ? this.$router.push('/home-login-c') 
        :this.$router.push('/home-login-a')
      }else {
        this.$router.push({path:'/admin/login',replace:true});
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .home-header {
    height: 0.88rem;
    width: 100%;
    background-color: white;
    position: relative;
    box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.3);

    .home-left-button {
      position: absolute;
      left: 0.2rem;
      top: 0.18rem;
      line-height: 0.52rem;
      font-size: 0.28rem;
      color: #19b4f5;
      border-radius: 0.1rem;
      border: 0.021rem solid #19b4f5;
      padding: 0 0.16rem;
      font-family: Tahoma, PingFang-SC-Regular, Helvetica Neue, Helvetica, Arial, Hiragino Sans GB, Heiti SC, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif !important;

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
      right: 0.2rem;
      top: 0;
      font-size: 0.3rem;
      line-height: 0.9rem;
      color: #19b4f5;
    }

    .home-right-icon {
      position: absolute;
      display: block;
      width: 0.3rem;
      height: 0.3rem;
      right: 105%;
      top: 0.3rem;
    }
  }
</style>
