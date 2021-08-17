<template>
  <view-page :full-box="!isShowFixed" :no-scroll="noScroll" :class="['theme-main-bg',{'newQP-card':$config.newQP || $config.blackTheme}]">
    <title-header :title="title" slot="header" class="theme-header-bg theme-header-bottom" backEvent @back="goback"></title-header>
    <div class="card-content" slot="header-static" v-if="showUsdt && showUsdt !== '0' && $route.query.action !== 'select'">
      <div class="bank" @click="tabIndex = 0">
        <img src="../../../../assets/img/save/take/take-bank.png" alt class="icon" />
        <p class="txt">银行卡</p>
        <img
          src="../../../../assets/img/save/take/triangle.png"
          alt
          class="triangle"
          v-if="tabIndex == 0"
        />
      </div>
      <div class="usdt" @click="tabIndex = 1">
        <img src="../../../../assets/img/save/take/take-usdt.png" alt class="icon" />
        <p class="txt">USDT</p>
        <img
          src="../../../../assets/img/save/take/triangle.png"
          alt
          class="triangle"
          v-if="tabIndex == 1"
        />
      </div>
      <div class="line"></div>
    </div>
    <div class="content" slot="content">
      <transition-group :name="animation" class="animation-box" tag="div" ref="animationBox">
        <component :key="tabIndex" :is="comp" @on-title-change="changeTitle"></component>
      </transition-group>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import bank from "./BankEditor";
import usdt from "./UsdtEditor";
export default {
  name: "Take",
  data() {
    return {
      tabIndex: 0,
      animation: "slide-right",
      noScroll: false,
      showUsdt: this.$store.state.main.config.limit.usdtWithdrawalsRate,
      title :''
    };
  },
  created() {
    this.tabIndex = this.$route.query.tabIndex
    if(this.$route.query.action !== 'select') {
      this.$store.dispatch("main/setConfig").then((res) => {
      if(res.code === 200) {
        this.showUsdt = res.data.siteConfig.limit.usdtWithdrawalsRate
      }
    })
    }
  },
  mounted() {},
  components: {
    bank,
    usdt,
  },
  computed: {
    isShowFixed() {
      return this.$store.state.main.keyBoardStatus;
    },
    comp() {
      return this.tabIndex == 0 ? bank : usdt;
    },
  },
  methods: {
    goback() {
      this.$router.back();
    },
    changeTitle (title) {
      this.title = title
    },
  },
  watch: {
    tabIndex: {
      handler: function (val, old) {
        if (val < old) {
          this.animation = "slide-right";
        } else {
          this.animation = "slide-left";
        }
      },
      deep: true,
    },
    "$store.state.main.keyBoardStatus"(val) {
      this.noScroll = val;
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
/deep/.vux-swiper {
  height: 100vh !important;
}
.theme-default .card-content {
  background-image: url("../../../../assets/img/save/take/theme-default.png");
  background-size: 100% 100%;
  .line {
    background-color: #a2c3fb;
  }
}

.theme-red .card-content {
  background-image: url("../../../../assets/img/save/take/theme-red.png");
  background-size: 100% 100%;
  .line {
    background-color: #fd9ba8;
  }
}
.theme-deepred .card-content {
  background-image: url("../../../../assets/img/save/take/theme-deepred.png");
  background-size: 100% 100%;
  .line {
    background-color: #fd9ba8;
  }
}
.theme-yellow .card-content {
  background-image: url("../../../../assets/img/save/take/theme-yellow.png");
  background-size: 100% 100%;
  .line {
    background-color: #FAD064;
  }
}
.theme-purple .card-content {
  background-image: url("../../../../assets/img/save/take/theme-purple.png");
  background-size: 100% 100%;
  .line {
    background-color: #2498d0;
  }
}

.theme-green .card-content {
  background-image: url("../../../../assets/img/save/take/theme-green.png");
  background-size: 100% 100%;
  .line {
    background-color: #32cd8e;
  }
}

.theme-ferrari .card-content {
  background-image: url("../../../../assets/img/save/take/theme-ferrari.png");
  background-size: 100% 100%;
  .line {
    background-color: #fc8f8f;
  }
}

.theme-gold .card-content {
  background-image: url("../../../../assets/img/save/take/theme-gold.png");
  background-size: 100% 100%;
  .line {
    background-color: #6781df;
  }
}

.theme-bluegreen .card-content {
  background-image: url("../../../../assets/img/save/take/theme-bluegreen.png");
  background-size: 100% 100%;
  .line {
    background-color: #7ae1f7;
  }
}

.theme-amethyst .card-content {
  background-image: url("../../../../assets/img/save/take/theme-amethyst.png");
  background-size: 100% 100%;
  .line {
    background-color: #cd4ea0;
  }
}

.theme-newqp {
  .card-content {
    background-image: url("../../../../assets/img/save/take/theme-newqp.png");
    background-size: 100% 100%;
    .line {
      background-color: #fff !important;
    }
  }
}

.newQP-card {
  /deep/ .auto-box-header-static {
    background-color: #0c0c0c !important;
  }
}

.card-content {
  position: relative;
  width: 7.06rem;
  height: 2.1rem;
  margin: 0.2rem auto 0;
  .bank,
  .usdt {
    position: relative;
    display: inline-block;
    width: 50%;
    height: 100%;
    line-height: 1rem;
    text-align: center;
    color: #fff;
    font-size: 0.34rem;
    line-height: 0.66rem;
    .icon {
      width: 0.6rem;
      height: 0.44rem;
      margin-top: 0.5rem;
    }
    .triangle {
      width: 0.36rem;
      height: 0.18rem;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .line {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 0.02rem;
    height: 1.62rem;
  }
}

.content {
  .animation-box {
    left: 0;
    top: 0;
    width: 100%;
    .content-body {
      width: 100%;
    }
  }
}
</style>
