<template>
  <view-page full-box :bounce="false" :class="{'black-page':$config.blackTheme || $config.newQP,'blush-page':$config.blush}">
    <div slot="header" :class="['header',{'black-header':$config.blackTheme || $config.newQP,'blush-header':$config.blush}]" v-if="!isApp">
      <span class="header-back icon iconfont h5-icon-left-menu-ico" @click="$router.go(-1)"></span>
      佣金条款
    </div>
    <div class="content" slot="content" ref="content">
      <div :class="personalMode + '-box'">
        <img src="@/assets/img/moneyRule/pic.png" class="pic" />
        <img :src="imgUrl('img1')" class="img1" />
        <div class="text">
          <p>{{$config.setName}}丰富的娱乐游戏</p>
          <p>打造全新的代理模式</p>
          <p>业界佣金最高</p>
          <p>佣金不计洗码量可直接出款</p>
        </div>
        <div v-if="personalMode === 'mode_a' || personalMode === 'mode_b'">
          <img :src="imgUrl('img2')" class="img2" />
          <img :src="imgUrl('img3')" class="img3" />
          <img :src="imgUrl('img4')" class="img4" v-if="personalMode === 'mode_a'" />
          <img
            :src="imgUrl('b-img4')"
            class="b-img4"
            v-if="personalMode === 'mode_b'"
          />
          <img :src="imgUrl('img5')" class="img5" />
          <img :src="imgUrl('img6')" class="img6" v-if="personalMode === 'mode_a'" />
          <img
            :src="imgUrl('b-img6')"
            class="b-img6"
            v-if="personalMode === 'mode_b'"
          />
          <img :src="imgUrl('img7')" class="img7" />
        </div>
        <div v-if="personalMode === 'no'" class="no-mode">
          <img src="@site/assets/img/moneyRule/no-img1.png" class="no-img1" />
          <img :src="imgUrl('no-img2')" class="no-img2" />
          <img src="@site/assets/img/moneyRule/no-img3.png" class="no-img3" />
          <img src="@site/assets/img/moneyRule/no-img4.png" class="no-img4" />
        </div>
        <div class="text-area theme-main-bg">
          <img
            :src="imgUrl('img8')"
            class="img8"
            v-if="personalMode === 'mode_a' || personalMode === 'mode_b'"
          />
          <img
            :src="imgUrl('no-img5')"
            class="no-img5"
            v-if="personalMode === 'no'"
          />
          <div class="text1 theme-color-white">
            <p>李嘉诚说他这辈子都在做的三件事：</p>
            <p>1.赶趋势</p>
            <p>2.抓可能性</p>
            <p>3.找平台</p>
          </div>
          <div class="text2 theme-color-white">
            <p>这个时代不是苦干蛮干可以赚钱，还是要懂得发现新的机会，与时俱进把握趋势！</p>
          </div>
          <div class="text3 theme-color-white">
            <p>你不上台演出，永远只是观众，伴随看着您身边的资源去别的网站娱乐，不如介绍他来{{$config.setName}}注册会员下注，无论输赢，您都能获得实时返利佣金，真正实现躺赚百万不是梦！</p>
          </div>
          <div class="text4 theme-color-white">
            <p>{{$config.setName}}就是您赚钱的最好平台!</p>
          </div>
        </div>
        <div class="bottom-text theme-color-white">*最终解释权归本站所有</div>
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
    },
  },
  created() {},
  mounted() {},
  methods: {
    imgUrl(imgName) {
      let type = ''
      if(this.$config.blackTheme || this.$config.newQP) {
        type = 'black-'
      }else if(this.$config.blush){
        type = 'blush-'
      }
      return require(`@/assets/img/moneyRule/${type ? type + imgName : imgName}.png`)
    }
  },
};
</script>

<style lang="less" scoped>
.header {
  position: relative;
  height: 0.88rem;
  line-height: 0.88rem;
  color: #fff;
  font-size: 0.36rem;
  font-weight: bold;
  background: url("../../../../assets/img/moneyRule/hander-bg.png") no-repeat;
  background-size: contain;
  &.black-header {
    background: url("../../../../assets/img/moneyRule/black-hander-bg.png") no-repeat;
    background-size: contain;
  }
  &.blush-header {
    background: url("../../../../assets/img/moneyRule/blush-hander-bg.png") no-repeat;
    background-size: contain;
  }
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
}
.content {
  position: relative;
  font-size: 0;
  width: 100%;
  overflow: hidden;
  .no-box{
    height: 32.72rem;
    background-image: url('../../../../assets/img/moneyRule/no-bg.jpg');
    background-repeat: no-repeat;
    background-size: cover;
  }
  .mode_a-box {
    height: 43.7rem;
    background-image: url('../../../../assets/img/moneyRule/bg.jpg');
    background-repeat: no-repeat;
    background-size: cover;
  }
  .mode_b-box {
    height: 44.92rem;
    background-image: url('../../../../assets/img/moneyRule/b-bg.jpg');
    background-repeat: no-repeat;
    background-size: cover;
  }
  img {
    z-index: 999;
  }
  .no-mode {
    .no-img1 {
      position: relative;
      width: 7.02rem;
      height: 2.61rem;
      margin: 3.24rem auto 0;
    }
    .no-img2 {
      width: 7.02rem;
      height: 2.79rem;
      margin: 0.5rem auto 0;
    }
    .no-img3 {
      width: 7.02rem;
      height: 6.35rem;
      margin: 0.5rem auto 0;
    }
    .no-img4 {
      width: 7.02rem;
      height: 4.51rem;
      margin: 0.5rem auto 0;
    }
  }
  .pic {
    position: absolute;
    top: 3.27rem;
    right: 0.48rem;
    width: 2.32rem;
    height: 4.03rem;
    z-index: 1;
  }
  .img1 {
    width: 7.02rem;
    height: 2.94rem;
    margin: 0.21rem auto 0;
  }
  .text {
    position: absolute;
    top: 3.84rem;
    left: 0.54rem;
    font-size: 0.34rem;
    color: #fff;
    font-weight: bold;
    line-height: 0.54rem;
    letter-spacing: 0.02rem;
    text-align: left;
    text-shadow: 0px 0.04rem 0px rgba(20, 103, 144, 0.31);
  }
  .img2 {
    position: relative;
    width: 7.02rem;
    height: 3.93rem;
    margin: 3.43rem auto 0;
  }
  .img3 {
    width: 7.02rem;
    height: 3.71rem;
    margin: 0.5rem auto 0;
  }

  .img4 {
    width: 7.02rem;
    height: 2.61rem;
    margin: 0.5rem auto 0;
  }
  .b-img4 {
    width: 7.02rem;
    height: 3.71rem;
    margin: 0.5rem auto 0;
  }
  .img5 {
    width: 7.02rem;
    height: 2.79rem;
    margin: 0.5rem auto 0;
  }
  .img6,
  .b-img6 {
    width: 7.02rem;
    height: 8.42rem;
    margin: 0.5rem auto 0;
  }
  .img7 {
    width: 7.02rem;
    height: 4.5rem;
    margin: 0.5rem auto 0;
  }
  .text-area {
    position: relative;
    width: 7.02rem;
    margin: 0.78rem auto 0;
    padding: 0rem 0.2rem 0.2rem;
    background-color: #fff;
    border-radius: 0.16rem;
    font-family: PingFang SC;
    .img8,
    .no-img5 {
      position: absolute;
      top: -0.28rem;
      left: 50%;
      transform: translateX(-50%);
      width: 3.78rem;
      height: 0.56rem;
    }
    .text1 {
      padding-top: 0.7rem;
      p {
        margin-top: 0.29rem;
        font-size: 0.27rem;
        color: #333333;
      }
    }
    & > div {
      color: #333333;
      margin-top: 0.29rem;
      font-size: 0.27rem;
      text-align: left;
    }
  }
  .bottom-text {
    color: #ffffff;
    font-size: 0.29rem;
    margin-left: 0.23rem;
    text-align: left;
    margin-top: 0.48rem;
  }
}
.black-page {
  .no-box{
    background-image: url('../../../../assets/img/moneyRule/black-no-bg.png');
  }
  .mode_a-box {
    background-image: url('../../../../assets/img/moneyRule/black-bg.png');
  }
  .mode_b-box {
    background-image: url('../../../../assets/img/moneyRule/black-b-bg.png');
  }
}
.blush-page {
  .no-box{
    background-image: url('../../../../assets/img/moneyRule/blush-no-bg.png');
  }
  .mode_a-box {
    background-image: url('../../../../assets/img/moneyRule/blush-bg.png');
  }
  .mode_b-box {
    background-image: url('../../../../assets/img/moneyRule/blush-b-bg.png');
  }
}
</style>
