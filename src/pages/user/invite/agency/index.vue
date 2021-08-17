<template>
  <div :class="['container',{'black-container' : $config.blackTheme},{'blush-container': $config.blush}]">
    <img :src="imgUrl('agency-top-img1')" class="top-img1">
    <img :src="imgUrl('agency-top-img2')" class="top-img2">
    <div class="marquee">
      <vux-marquee style="height:.54rem" class="marquee-scroll">
        <vux-marquee-item v-for="item in marqueeList" :key="item" class="align-middle theme-color-yellow-2">{{item}}</vux-marquee-item>
      </vux-marquee>
    </div>
    <div class="invite-mode theme-main-bg-5">
      <p class="invite-text theme-color-yellow-2">无限级代理模式</p>
      <p class="code-text theme-color-white">您的邀请码</p>
      <p
        class="invitaCode theme-color-yellow-2"
        v-if="$store.state.agency.intiviData"
      >{{$store.state.agency.intiviData.code}}</p>
    </div>

    <router-link to="/user/invite-share/agency" class="shareInvita btn">
      <img :src="imgUrl('shareInvita-btn')" />
    </router-link>
    <img :src="imgUrl('copyLink-btn')" class="copyLink btn" @click="onCopy" />
    <div class="titleArea threeStepTit theme-color-yellow-2">
      <img :src="imgUrl('agencyTitleIcon')" alt />
      简单三步&nbsp;立得佣金
      <img :src="imgUrl('agencyTitleIcon')" alt />
    </div>
    <div class="threeStep theme-main-bg-5 theme-color-white">
      <div class="rowLine1 rowLine theme-main-bg-7"></div>
      <div class="rowLine2 rowLine theme-main-bg-7"></div>
      <div class="step">
        <div class="num theme-yellow-bg-4 theme-color-black">1</div>
        <p>分享二维码</p>
        <p>链接给好友</p>
      </div>
      <div class="step">
        <div class="num theme-yellow-bg-4 theme-color-black">2</div>
        <p>好友注册</p>
        <p>并投注</p>
      </div>
      <div class="step">
        <div class="num theme-yellow-bg-4 theme-color-black">3</div>
        <p>获得佣金</p>
      </div>
    </div>
    <div class="titleArea myMoney theme-color-yellow-2">
      <img :src="imgUrl('agencyTitleIcon')" alt />
      我的战绩
      <img :src="imgUrl('agencyTitleIcon')" alt />
    </div>
    <div class="myArea theme-main-bg-5" @click="goAccount">
      <img :src="imgUrl('pig')" class="pigImg">
      <div class="right-area">
        <div class="text theme-color-white">累计获得佣金</div>
        <div class="getMoney theme-color-yellow-2">{{getMoney}}</div>
        <img :src="imgUrl('more')" class="more-img">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  name: "agency",
  data() {
    return {
      marqueeList: [
        "下级和下下级投注佣金归你",
        "超过1,000,00+人赚到奖励",
        "佣金实时到账",
        "业界赔率最高",
      ],
      getMoney: ""
    };
  },
  methods: {
    imgUrl(imgName) {
      let newImgName = ''
      if(this.$config.blackTheme) {
        newImgName = 'black-' + imgName
      }else if (this.$config.blush) {
        newImgName = 'blush-' + imgName
      }else {
        newImgName = imgName
      }
      return require(`@src/assets/img/invite/${newImgName}.png`)
    },
    onCopy() {
      if (this.$store.state.agency.intiviData) {
        this.$copyText(this.$store.state.agency.intiviData.domain).then(
          e => {
            this.toastText("复制成功", "top");
          },
          e => {
            this.toastText("请手动复制或使用其他浏览器尝试", "top");
          }
        );
      } else {
        this.toastText("无可复制内容", "top");
      }
    },
    goAccount() {
      this.$router.push({path: "/user/agency-center-new/commission-detail",query:{'time':'3'}});
    }
  },
  created() {
    this.$store
      .dispatch("agency/getInvitation", {
        activityType: "myRecord"
      })
      .then(res => {
        if (res.code === 200) {
          this.getMoney = res.data;
        }
      });
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100%;
  height: 20.1rem;
  background-image: url("../../../../assets/img/invite/memberBg.jpg");
  background-size: cover;
  overflow: hidden;
  font-size: 0.32rem;
  padding: 0 0.32rem 0.3rem;
  .top-img1{
    width: 5.99rem;
    height: .84rem;
    margin: 1.8rem auto .26rem;
  }
  .top-img2{
    width: 5.28rem;
    height: .58rem;
    margin: 0 auto;
  }
  .invite-mode {
    position: relative;
    width: 100%;
    height: 5.21rem;
    background-color: #fff;
    background-image: url("../../../../assets/img/invite/picture.png");
    background-size: 6.12rem 3.02rem;
    background-position: 0.37rem 1.19rem;
    margin-top: .68rem;
    border-radius: 0.15rem;
    overflow: hidden;
    .invite-text {
      font-size: 0.44rem;
      font-weight: bold;
      color: #E8463E;
      margin-top: 0.38rem;
      letter-spacing: 0.1rem;
    }
    .code-text {
      position: absolute;
      bottom: 0.25rem;
      left: 1.48rem;
      color: #555555;
      font-size: 0.32rem;
    }
    .invitaCode {
      position: absolute;
      bottom: 0.18rem;
      left: 3.3rem;
      font-size: 0.56rem;
      font-weight: bold;
      color: #EA6834;
      letter-spacing: .02rem;
    }
  }

  .marquee {
    position: absolute;
    top: 3.94rem;
    left: 50%;
    transform: translateX(-50%);
    width: 4.5rem;
    height: 0.77rem;
    line-height: 0.77rem;
    background-image: url("../../../../assets/img/invite/shape-dongtai.png");
    background-size: contain;
    text-align: center;
    color: #fc1a1a;
    font-size: 0.28rem;
    z-index: 2;
    .marquee-scroll {
      margin-top: .1rem;
      .align-middle {
        height: 0.54rem;
        line-height: .54rem;
        width: 100%;
        overflow: hidden;
      }
    }
  }

  .btn {
    display: block;
    width: 100%;
    height: 1.03rem;
    img {
      width: 100%;
      height: 100%;
    }
    &.shareInvita {
      margin-top: 0.54rem;
    }
    &.copyLink {
      margin-top: 0.18rem;
    }
  }

  .titleArea {
    width: 100%;
    height: 0.7rem;
    line-height: 0.7rem;
    margin-bottom: 0.2rem;
    color: #fff;
    text-align: center;
    font-size: 0.36rem;
    img {
      width: 0.36rem;
      height: 0.27rem;
      vertical-align: middle;
    }
    &.threeStepTit{
      margin-top: 0.4rem;
    }
    &.myMoney{
      margin-top: 0.48rem;
    }
  }

  .threeStep {
    position: relative;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 2.08rem;
    background-color: #fff;
    border-radius: 0.15rem;
    color: #555555;
    font-size: 0.28rem;
    text-align: center;
    .rowLine {
      position: absolute;
      width: 1.88rem;
      height: 0.02rem;
      background-color: #ffdcbd;
    }
    .rowLine1 {
      top: 0.49rem;
      left: 1.349rem;
    }
    .rowLine2 {
      top: 0.49rem;
      right: 1.349rem;
    }
    .step {
      flex: 1;
      .num {
        margin: 0.3rem auto;
        color: #fff;
        width: 0.42rem;
        height: 0.42rem;
        line-height: .42rem;
        background-color: #E57671;
        border-radius: 50%;
        z-index: 1;
      }
      &:last-child {
        p {
          line-height: 0.65rem;
        }
      }
    }
  }

  .myArea {
    position: relative;
    width: 100%;
    height: 2.08rem;
    background-color: #fff;
    border-radius: .15rem;
    margin-top: .3rem;
    overflow: hidden;
    .pigImg{
      float: left;
      width: 2.69rem;
      height: 1.73rem;
      margin: .25rem 0 .10rem .26rem;
    }
    .right-area{
      width: 2.8rem;
      float: left;
      .text {
        color: #555555;
        font-size: .28rem;
        font-weight: 500;
        margin-top: .63rem;
      }
      .getMoney {
        color: #e8463e;
        font-size: 0.5rem;
        margin-top: .1rem;
      }
      .more-img{
        position: absolute;
        right: .5rem;
        top: .89rem;
        width: .17rem;
        height: .3rem;
      }
    }
  }
  &.black-container {
    background-image: url("../../../../assets/img/invite/black-memberBg.png");
    .marquee {
      background-image: url("../../../../assets/img/invite/black-shape-dongtai-red.png");
    }
    .invite-mode {
      background-image: url("../../../../assets/img/invite/black-picture.png");
    }
  }
  &.blush-container{
     background-image: url("../../../../assets/img/invite/blush-memberBg.png");
     .marquee {
      background-image: url("../../../../assets/img/invite/blush-shape-dongtai-red.png");
    }
    .invite-mode {
      background-image: url("../../../../assets/img/invite/blush-picture.png");
    }
  }
}
</style>