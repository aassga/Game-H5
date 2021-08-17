<template>
  <div class="header theme-bg">
    <a href="javascript:void(0)" @click="$emit('download')" class="app">APP下载</a>
    <img class="logo" :src="logoImg" alt="">
    <a href="javascript:void(0)" @click="logout" class="action" v-if="user">退出</a>
    <router-link tab="a" href="javascript:void(0)" class="action" to="/admin/login" v-else>
      登录/注册
    </router-link>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'Header',
  computed: {
    user () {
      return this.$store.state.user.userInfo
    },
    logoImg(){
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
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    logout () {
      this.$emit('logout')
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .header {
    width: 100%;
    height: 0.9rem;
    box-sizing: border-box;
    position: relative;
    .logo {
      height: 0.7rem;
      margin: 0.09rem auto;
    }

    .action {
      position: absolute;
      right: 0.2rem;
      top: 0;
      line-height: 0.9rem;
      font-size: 0.3rem;
      color: #fff;
      font-weight: bold;
    }

    .app {
      position: absolute;
      left: 0.2rem;
      top: 0.18rem;
      line-height: 0.52rem;
      font-size: 0.28rem;
      color: #fff;
      border-radius: 0.1rem;
      border: 1px solid #fff;
      padding: 0 0.16rem;
    }
  }
</style>
