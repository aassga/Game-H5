<template>
  <div>
    <div class="home-header aqvns-home-header">
      <span class="home-left-button" @click="$emit('on-download')"></span>      
      <img class="home-logo" :src="logoImg" alt="">
      <span class="home-right-button" @click="onMessage">
        <i class="msg-count" v-show="userInfo&&$store.state.user.msgCount['allUnReadCount']">
          {{$store.state.user.msgCount['allUnReadCount']}}
        </i>
      </span>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'Header',
  computed:{
    logoImg(){
      return require("@site/assets/img/home/logo.png")
    },
    userInfo () {
      return JSON.getObjByLocalStorage('userInfo')
    },
  },
  methods: {
    onLogin(){
      if(this.$config.homeLogin && !this.isApp) {
        this.$router.push('/home-login-a')
      }else {
        this.$router.push({path:'/admin/login',replace:true});
      }
    },
    onMessage() {
      if(this.userInfo && JSON.stringify(this.userInfo) !== '{}') {
        this.$router.push('/user/message?index=1')
      }else {
        this.$router.push('/admin/login')
      }
    },
  },
}
</script>

<style lang="less" type='text/less' scoped>
  .home-header {
    width: 100%;
    height: 1.2rem;
    position: relative;
    display: flex;
    align-items: center;    
    box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.3);
    background-color: #FFFFFF;
    &.aqvns-home-header {
      .home-logo {
        width: 4.1rem;
        display: block;
        margin: 0 auto;
        padding: 0.1rem 0;
        box-sizing: border-box;
      }
      .home-left-button {
        width: 1.4em;
        height: 0.5rem;
        position: absolute;
        top: 0.4rem;
        left: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background:linear-gradient(180deg, rgb(251,242,232), rgb(219,189,158));
        &:before{
          display: block;
          content: "APP下载";
          color: rgb(94, 77, 58);
          font-size:0.25rem;
          font-weight: 700;
          font-family: Tahoma, PingFang-SC-Regular, Helvetica Neue, Helvetica, Arial, Hiragino Sans GB, Heiti SC, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif !important;
        }
      } 
      .home-right-button {
        width: 1.4em;
        height: 0.5rem;
        position: absolute;
        top: 0.4rem;
        right: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background:linear-gradient(180deg, rgb(251,242,232), rgb(219,189,158));
        .msg-count{
          position:absolute;
          top: -0.2rem;
          left:1rem;
        }
        &:before{
          display: block;
          content: "站內信";
          color: rgb(94, 77, 58);
          font-size:0.25rem;
          font-weight: 700;
          font-family: Tahoma, PingFang-SC-Regular, Helvetica Neue, Helvetica, Arial, Hiragino Sans GB, Heiti SC, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif !important;
        }
        
      }
    }
  }

</style>
