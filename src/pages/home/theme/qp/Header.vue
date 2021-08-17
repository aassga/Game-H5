<template>
  <div>
    <div
      class="home-header qp-home-header"
      v-if="
        $config.newQP &&
        $config.name !== 'fhcp' &&
        $config.name !== 'xpj83' &&
        $config.name !== 'js85'
      "
    >
      <img
        class="home-logo"
        :src="logoImg"
        alt=""
        v-if="$config.name !== '500w'"
      />
      <img
        src="@src/assets/img/home/qp/down-gif.gif"
        :class="['right-button', { 'login-right': $store.state.user.token }]"
        @click="$emit('on-download')"
      />
      <a
        href="javascript:void(0)"
        class="home-right-button-logout"
        v-if="$store.state.user.token"
        @click="onLogout"
      >
        <img
          class="home-right-icon"
          src="../../../../assets/img/home/vnsExit.png"
          alt
        />退出
      </a>
    </div>
    <div class="betnew-home-header" v-else-if="$config.name === 'betnew'">
      <img
        class="top-logo"
        :src="require('@site/assets/img/admin/top_logo.png')"
        alt=""
      />
      <div class="content">
        <h2>bet365-体育投注，电子游艺，棋牌竞技，娱乐场</h2>
      </div>
      <button class="button" @click="$emit('on-download')">点击下载</button>
      <!-- 關閉功能先移除, 因為要調整關閉後底下 gameArea 留白的部分比較麻煩 -->
      <!-- <div class="close" @click="$emit('on-closeHeader')">
        <img src="../../../../assets/img/home/qp/down_close_d.png"/>
      </div> -->
    </div>
    <div
      :class="[
        'home-header',
        {
          'qp103-home-header': [
            '103qp',
            'hty',
            'fhcp',
            'dqr',
            'qxcp',
            '839qp',
            'aqvns',
            'dalao',
            'xpj83',
            'js85'
          ].includes($config.name),
        },
        { 'fhcp-home-header': ['fhcp', 'xpj83'].includes($config.name) },
        { 'fhcp-home-header js85-home-header': $config.name === 'js85' },
      ]"
      v-else
    >
      <a
        href="javascript:void(0)"
        class="home-left-button"
        @click="$emit('on-download')"
      ></a>
      <img
        class="home-logo"
        :src="logoImg"
        alt=""
        v-if="$config.name !== '500w'"
      />
      <a
        href="javascript:void(0)"
        class="home-right-button-logout"
        v-if="$store.state.user.token"
        @click="onLogout"
      >
        <img
          class="home-right-icon"
          src="../../../../assets/img/home/vnsExit.png"
          alt
        />退出
      </a>
      <a
        href="javascript:void(0)"
        class="home-right-button"
        v-else
        @click="onLogin()"
      ></a>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Header",
  methods: {
    onLogin() {
      if (this.$config.homeLogin && !this.isApp) {
        this.$config.home === "vns"
          ? this.$router.push("/home-login-b")
          : this.$config.home === "qp"
          ? this.$router.push("/home-login-c")
          : this.$router.push("/home-login-a");
      } else {
        this.$router.push({ path: "/admin/login", replace: true });
      }
    },
  },
  computed: {
    logoImg() {
      // let img = ''
      // if(localStorage['main/logoInfo'] &&  JSON.parse(localStorage['main/logoInfo']).length > 0){
      //   try {
      //       JSON.parse(localStorage['main/logoInfo']).forEach(ff=>{
      //       if(ff.position === 'logo' && ff.clientType === 'mobile') {
      //         img =  localStorage.SiteStaticsUrl + ff.body[0].img
      //       }
      //     })
      //   } catch (error) {
      //     img =  require('@site/assets/img/home/logo.png')
      //   }
      // }else{
      //   img =  require('@site/assets/img/home/logo.png')
      // }
      // return img
      return require("@site/assets/img/home/logo.png");
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.home-header {
  height: 0.88rem;
  width: 100%;
  background-color: #c62721;
  position: relative;
  box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.3);
  &.qp-home-header {
    background-color: #080808;
    .home-logo {
      padding: 0 !important;
      margin-left: 0.18rem !important;
    }
    &::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      right: 0;
      bottom: 0;
      left: 0rem;
      border-bottom: 0.01rem solid rgba(248, 248, 248, 0.1);
    }
    .home-logo {
      float: left;
      margin-left: 0.28rem;
    }
    .right-button {
      float: right;
      width: 1.9rem;
      margin-top: 0.06rem;
      margin-right: 0.24rem;
    }
    .login-right {
      margin-right: 1.4rem;
    }
    .home-right-icon {
      right: 108%;
    }
  }
  .home-left-button {
    display: inline-block;
    position: absolute;
    left: 0.2rem;
    top: 0.2rem;
    width: 1.2rem;
    height: 0.48rem;
    background: url("../../../../assets/img/home/qp/app_down.png");
    background-size: 100% 100%;
    font-family: Tahoma, PingFang-SC-Regular, Helvetica Neue, Helvetica, Arial,
      Hiragino Sans GB, Heiti SC, Microsoft YaHei, WenQuanYi Micro Hei,
      sans-serif !important;
  }

  .home-logo {
    display: block;
    height: 100%;
    margin: 0 auto;
    padding: 0.1rem 0;
    box-sizing: border-box;
  }

  .home-right-button {
    display: inline-block;
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    width: 1.2rem;
    height: 0.48rem;
    background: url("../../../../assets/img/home/qp/zc_dl.png");
    background-size: 100% 100%;
  }
  .home-right-button-logout {
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
    width: 0.3rem;
    height: 0.3rem;
    right: 105%;
    top: 0.3rem;
  }
  &.qp103-home-header {
    .home-left-button {
      top: 0.15rem;
      width: 1.54rem;
      height: 0.59rem;
      background-image: url("../../../../assets/img/home/qp/103qp_app_down.png");
    }
    .home-right-button {
      top: 0.15rem;
      width: 1.54rem;
      height: 0.59rem;
      background-image: url("../../../../assets/img/home/qp/103qp-home-right-button.png");
    }
  }
  &.fhcp-home-header {
    background-color: #080808;
  }
  // &.js85-home-header{
  //   display: flex;
  //   align-items: center;
  //   .home-logo{
  //     height: 0.75rem;
  //   }
  // }
}

.betnew-home-header {
  display: flex;
  border-bottom: 1px solid hsla(0, 0%, 80%, 0.6);
  align-items: center;
  height: 1.12rem;
  padding: 0 0.28rem;
  font-size: 0.24rem;

  .close {
    img {
      width: 0.32rem;
      height: 0.32rem;
    }
  }

  .content {
    flex: 1;
    font-family: DinPro, dinpro;
    font-weight: 600;
    font-size: 0.28rem;
    height: 0.74rem;
    color: #ffffff;
    margin: 0 0.2rem;
    line-height: 0.4rem;
  }

  .top-logo {
    width: 0.8rem;
  }

  .button {
    background-color: #fee21a;
    color: #05684c;
    width: 1.48rem;
    height: 0.52rem;
    line-height: 0.52rem;
    border-radius: 0.1rem;
    margin: 0 0.1rem 0 0;
  }
}
</style>
