<template>
  <view-page full-box class="theme-header-bg">
    <title-header :title="type+'成功'" slot="header" class="theme-main-bg theme-header-bottom">
      <div class="header-right" slot="right" @click="$router.push('/user/JieBeiCenter')">
        完成
      </div>
    </title-header>
    <div class="content" slot="content">
      <img :src="$config.blackTheme ? require('../../../assets/img/user/jieBei/black-borrow-img.png') : require('../../../assets/img/user/jieBei/borrow-img.png')" class="result-img" v-if="this.$route.query.type ==='borrow' ">
      <img :src="$config.blackTheme ? require('../../../assets/img/user/jieBei/black-refund-img.png') : require('../../../assets/img/user/jieBei/refund-img.png')" class="result-img" v-else>
      <p class="result-text theme-color-white">{{this.$route.query.type === "borrow" ? '放款中' : '还款成功!'}}</p>
      <p class="result-money theme-color-yellow">{{(this.$route.query.money*1).toFixed(2)}}元</p>
      <div class="result-box theme-main-bg-5">
        <div v-if="this.$route.query.type === 'borrow'" class="borrow-box">
          <div class="theme-border-color">
            <span class="theme-color-white">收款帐户</span>
            <span>帐户余额</span>
          </div>
          <div>
            <span class="theme-color-white">到账时间</span>
            <span>预计5分钟到帐</span>
          </div>
        </div>
        <div v-else class="refund-box">
          <div class="theme-main-bg-5" v-if="(this.$route.query.allMoney*1) > 0 ">
            <span class="theme-color-white">剩余欠款</span>
            <span style="color:#333" class="theme-color-white"><span style="color:#FF5D5D">{{(this.$route.query.allMoney*1).toFixed(2)}}</span>元</span>
          </div>
          <div class="theme-main-bg-5 theme-color-white" v-else>
            本期欠款已还清，5分钟后即可再次借款！
          </div>
        </div>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">

export default {
  name: 'JieBeiResult',
  data () {
    return {
      type :'',
    }
  },
  created() {
    this.type = this.$route.query.type === "borrow" ? "借款" : "还款";
  },
  methods: {
  },
  computed:{
  }
}
</script>

<style lang="less" scoped>
.header-right {
  position: absolute;
  right: 0.38rem;
  font-size: 0.32rem;
  top: 0.03rem;
}
  .content {
    .result-img {
      width: 2.58rem;
      height: 2.58rem;
      margin: 0.66rem auto 0.17rem;
    }
    .result-text {
      font-size: 0.34rem;
      color: #333333;
    }
    .result-money {
      font-size: 0.45rem;
      color: #4D8FFA;
      margin-top: 0.27rem;
    }
    .result-box {
      width: 7rem;
      background: #fff;
      box-shadow: 0px 0.05rem 0.11rem rgba(0,63,112,0.06);
      border-radius: 0.15rem;
      margin: 0.7rem auto 0;
      .borrow-box, .refund-box {
        & > div {
          height: 1.19rem;
          line-height: 1.19rem;
          font-size: 0.32rem;
          border-bottom: 0.02rem solid #E6E6E6;
          padding: 0 0.35rem 0 0.45rem;
          span {
            display: inline-block;
            width: 50%;
            height: 100%;
          }
          :first-child {
            text-align: left;
            color: #333333;
          }
          :last-child {
            text-align: right;
            color: #A4A4A4;
          }
        }
        :last-child {
          border-bottom: none;
        }
      }
    } 
  }
</style>
