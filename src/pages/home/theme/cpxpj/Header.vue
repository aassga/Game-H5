<template>
  <div>
    <div
      :class="[
        $config.name === 'cpxpj'
          ? 'header-cpxpj-Bg home-header'
          : 'header-Bg home-header'
      ]"
    >
      <a
        href="javascript:void(0)"
        class="home-left-button"
        @click="$emit('on-download')"
      ></a>
      <img class="home-logo" :src="logoImg" alt="" />
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
      <p class="home-right-button" v-else @click="onLogin"></p>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Header",
  methods: {
    onLogin() {
      this.$router.push({ path: "/admin/login", replace: true });
    }
  },
  computed: {
    logoImg() {
      return require("@site/assets/img/home/logo.png");
    }
  }
};
</script>
<style lang="less" type="text/less" scoped>
.home-header {
  height: 0.88rem;
  width: 100%;
  position: relative;
  .home-left-button {
    display: inline-block;
    position: absolute;
    left: 0.22rem;
    top: 0.12rem;
    width: 1.63rem;
    height: 0.64rem;
    background: url("../../../../assets/img/home/blush/down.png");
    background-size: 100% 100%;
    font-family: Tahoma, PingFang-SC-Regular, Helvetica Neue, Helvetica, Arial,
      Hiragino Sans GB, Heiti SC, Microsoft YaHei, WenQuanYi Micro Hei,
      sans-serif !important;
  }
  .home-logo {
    display: block;
    height: 100%;
    margin: 0 auto;
    padding: 0.03rem 0;
    box-sizing: border-box;
  }
  .home-right-button {
    background: url("../../../../assets/img/home/blush/login-btn.png");
    background-size: 100% 100%;
    position: absolute;
    right: 0.22rem;
    top: 0.12rem;
    width: 1.64rem;
    height: 0.65rem;
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
}
.header-Bg {
  background: linear-gradient(276deg, #9d010f 0%, #72010b 100%);
}
.header-cpxpj-Bg {
  background: #b10214;
}
</style>
