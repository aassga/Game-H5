<template>
  <view-page full-box :bounce="false">
    <div slot="header" class="header" v-if="!isApp">
      <span class="header-back icon iconfont h5-icon-left-menu-ico" @click="$router.go(-1)"></span>
      <router-link class="rightlink" to="/agent-doc-list">
        <img src="@src/assets/img/agent-doc/header-right.png" />
      </router-link>代理模式
    </div>
    <div class="content" slot="content" ref="content">
      <img src="@src/assets/img/agent-doc/banner.png" class="banner" />
      <div class="cont" ref="cont">
        <img src="@src/assets/img/agent-doc/img1.png" class="img1" />
        <div v-if="personalMode === 'mode_a' || personalMode === 'mode_b'">
          <img src="@src/assets/img/agent-doc/img2.png" class="img2" />
          <img src="@src/assets/img/agent-doc/img3.png" class="img3" />
          <img src="@src/assets/img/agent-doc/img4.png" class="img4" v-if="personalMode === 'mode_a'" />
          <img src="@src/assets/img/agent-doc/b-img4.png" class="b-img4" v-if="personalMode === 'mode_b'" />
          <img src="@src/assets/img/agent-doc/img5.png" class="img5" />
        </div>
        <div v-if="personalMode === 'no'">
          <img src="@src/assets/img/agent-doc/no-img1.png" class="no-img1" />
          <img src="@site/assets/img/agent-doc/no-img2.png" class="no-img2" />
          <img src="@src/assets/img/agent-doc/no-img3.png" class="no-img3" />
        </div>
      </div>
    </div>
  </view-page>
</template>

<script>
export default {
  name: "MoneyRule",
  computed: {
    app() {
      return this.$route.query.app;
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.header {
  position: relative;
  width: 100%;
  height: 0.88rem;
  line-height: 0.88rem;
  color: #fff;
  font-size: 0.36rem;
  font-weight: bold;
  background: url("../../assets/img/agent-doc/header-bg.png");
  background-size: contain;
  .header-back {
    position: absolute;
    left: 0;
    top: 0;
    height: 0.88rem;
    width: 0.88rem;
    line-height: 0.88rem;
    color: #fff;
    font-weight: normal;
    &:before {
      display: inline-block;
      font-size: 0.72rem;
      -webkit-transform: rotateZ(180deg) !important;
      transform: rotateZ(180deg) !important;
    }
  }
  .rightlink {
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -0.32rem;
    width: 1.48rem;
    height: 0.64rem;
    color: #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.content {
  position: relative;
  font-size: 0;
  width: 100%;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: cover;
  .banner {
    width: 7.5rem;
    height: 3.48rem;
  }
  .cont {
    background-color: #4288ff;
    padding: 0 0.24rem;
    min-height: 100%;
    padding-bottom: 1.08rem;
    img {
      width: 100%;
    }
    .img1 {
      height: 7.38rem;
      margin-top: -0.5rem;
    }
    .img2 {
      height: 4.12rem;
      margin-top: 0.5rem;
    }
    .img3 {
      height: 3.57rem;
      margin-top: 0.5rem;
    }
    .img4 {
      height: 2.47rem;
      margin-top: 0.5rem;
    }
    .b-img4 {
      height: 3.57rem;
      margin-top: 0.5rem;
    }
    .img5 {
      height: 2.72rem;
      margin-top: 0.5rem;
    }
    .no-img1{
      height: 2.8rem;
      margin-top: 0.5rem;
    }
    .no-img2{
      height: 2.47rem;
      margin-top: 0.5rem;
    }
    .no-img3{
      height: 2.72rem;
      margin-top: 0.5rem;
    }
  }
}
</style>
