<template>
  <view-page class="result theme-main-bg" :class="{ 'aqvns-result': $config.isAqvns }" full-box>
    <title-header
      title="时时返水"
      slot="header"
      class="theme-header-bg theme-header-bottom"
    ></title-header>
    <div class="body" v-if="!refund" slot="content">
      <img
        class="img"
        src="../../../assets/img/user/qp-honest.png"
        style="width: 4.16rem"
        v-if="$config.newQP || $config.blackTheme"
      />
      <img
        class="img"
        src="../../../assets/img/user/honest.png"
        v-else
        alt=""
      />
      <div class="btn-box">
        <van-button
          block
          type="primary"
          class="but theme-yellow-bg theme-color-black"
          @click="onResult"
          >一键返水</van-button
        >
      </div>
      <p class="info">
        所有平台返水都是按美东时间计算,会员可随时返水,由于数据同步有延迟请下注后30分钟左右再来返水!
      </p>
    </div>
    <div class="body" v-if="refund && list.length === 0" slot="content">
      <img class="img-no-data" :src="noDataImg" alt="" />
      <p class="info-no-data">当前暂无返水</p>
    </div>
    <div
      :class="[
        'honest-content',
        'theme-main-bg',
        {
          'newQP-honest': $config.newQP || $config.blackTheme || $config.blush,
        },
      ]"
      v-if="refund && list.length > 0"
      slot="content"
    >
      <div class="main-title theme-gradient-bg-1">
        <span class="theme-color-yellow">游戏类型</span>
        <span class="theme-color-yellow">有效投注</span>
        <span class="theme-color-yellow">返水金额</span>
        <!-- <span class="theme-color-yellow">返水比例</span> -->
      </div>
      <div class="main-content theme-main-bg" ref="honestContent">
        <div
          class="main-row theme-main-bg"
          :class="{
            'theme-border-bottom':
              $config.newQP || $config.blackTheme || $config.blush,
          }"
          v-for="(item, index) in list"
          :key="index"
        >
          <span :class="{ 'theme-color-white': $config.blush }">{{
            item.platformName
          }}</span>
          <span :class="{ 'theme-color-white': $config.blush }">{{
            item.validBetAmount
          }}</span>
          <span :class="{ 'theme-color-white': $config.blush }">{{
            item.amount
          }}</span>
          <!-- <span :class="{ 'theme-color-white': $config.blush }"
            >{{ item.point }}%</span
          > -->
        </div>
      </div>
      <div class="total-refund theme-main-bg">
        <div class="left">
          <span class="theme-color-white">有效投注:</span>
          <span class="theme-color-yellow"
            ><i class="rmb">¥</i>{{ total_amount.validBetAmount }}</span
          >
        </div>
        <div class="right">
          <span class="theme-color-white">总返水:</span>
          <span class="theme-color-yellow"
            ><i class="rmb">¥</i>{{ total_amount.amount }}</span
          >
        </div>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "Result",
  data() {
    return {
      refund: false,
      list: [],
      total_amount: {},
    };
  },
  methods: {
    onResult() {
      this.$store.dispatch("user/refund").then((res) => {
        if (res.code === 200) {
          if (res.data.list.length > 0) {
            this.list = res.data.list
            this.total_amount = res.data["total_amount"];
          }
          this.refund = true;
        } else {
          this.toastText(res.message, "top");
        }
      });
    },
  },
  computed: {
    noDataImg() {
      if (this.$config.blackTheme || this.$config.newQP) {
        return require("@src/assets/img/yellow.png");
      } else if (this.$config.blush) {
        return require("@src/assets/img/blush.png");
      } else if (this.targetTheme && this.targetTheme["code"]) {
        let matchResult = this.targetTheme["code"];
        return require(`@src/assets/img/${matchResult}.png`);
      } else {
        return require("@src/assets/img/no-data.png");
      }
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.result {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .body {
    flex: 1;

    .btn-box {
      padding: 0.24rem;
      box-sizing: border-box;
      width: 100%;
      .but {
        font-size: 0.36rem;
        border-radius: 0.1rem;
      }
    }

    .img {
      width: 100%;
    }

    .img-no-data {
      width: 100%;
      margin-top: 2rem;
      margin-bottom: 0.2rem;
    }

    .info {
      padding: 0.24rem 0.5rem;
      width: 100%;
      box-sizing: border-box;
      text-align: left;
      font-size: 0.28rem;
      color: #888888;
      line-height: 0.48rem;
    }

    .info-no-data {
      padding: 0.24rem 0.5rem;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      font-size: 0.28rem;
      color: #888888;
      line-height: 0.48rem;
    }
  }

  .honest-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    &.newQP-honest {
      .main-title {
        margin-top: 0 !important;
        border: none !important;
      }
    }
    .main-title {
      display: flex;
      height: 0.6rem;
      line-height: 0.6rem;
      border-bottom: 0.015rem solid #ebedf0;
      margin-top: 0.2rem;
      background: #fff;

      span {
        flex: 1;
        font-size: 0.28rem;
        color: #424242;
        text-align: center;
      }
    }

    .main-content {
      overflow: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      flex: 1;

      .main-row {
        display: flex;
        height: 0.9rem;
        line-height: 0.9rem;
        border-bottom: 0.015rem solid #ebedf0;
        background: #fff;

        span {
          flex: 1;
          font-size: 0.28rem;
          color: #888888;
          text-align: center;
        }
      }
    }
  }

  .total-refund {
    width: 100%;
    background: #fff;
    height: 0.9rem;
    line-height: 0.55rem;
    display: flex;
    padding: 0 0.32rem;
    box-sizing: border-box;
    //border-top: 1px solid #f5f5f5;
    .rmb {
      font-family: PingFang-SC-Regular, Helvetica Neue, Helvetica, Arial,
        Hiragino Sans GB, Heiti SC, Microsoft YaHei, WenQuanYi Micro Hei,
        monospace !important;
    }
    div {
      flex: 1;
      text-align: left;

      span:nth-child(1) {
        color: #424242;
        font-size: 0.3rem;
      }

      span:nth-child(2) {
        color: #ff0000;
        font-size: 0.36rem;
      }
    }

    div:nth-child(2) {
      text-align: right;
    }
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 start
.aqvns-result{
  /deep/.body{
    .btn-box{
      .van-button{
        border: none;
        background-color: #C9A786 !important;
      }
    }
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 end
</style>
