<template>
  <view-page class="agency-center theme-main-bg-5" full-box :class="{'blush-center':$config.blush}"> 
    <div class="header" slot="header">
      <title-header
        class="title theme-header-bg theme-header-bottom"
        style="background-color: rgba(0,0,0,0) !important;"
        backEvent
        @back="$router.push('/user')"
        title="余额宝"
      >
        <div class="header-right" slot="right">
          <router-link to="/user/YuEBaoExplain">说明</router-link>
        </div>
      </title-header>
    </div>
    <div slot="static" class="theme-agent-bg" :style="headerStyle" v-if="!$config.blackTheme && !$config.newQP&&!$config.blush"></div>
    <div class="content-slot" slot="content">
      <div class="top-panel theme-header-bg">
        <div class="total-money theme-color-white">总金额</div>
        <div class="money theme-color-white" @click="goDetail">{{$store.state.user.YuEBaoData && $store.state.user.YuEBaoData.balance ? $store.state.user.YuEBaoData.balance : "0.00"}}</div>
        <div :class="['last-money',{'black-last-money' : $config.blackTheme}]">
          昨日收益<span class="last-money-num">{{$store.state.user.YuEBaoData && $store.state.user.YuEBaoData.yesterday_fee ? $store.state.user.YuEBaoData.yesterday_fee : '0.00'}}</span>元
        </div>
        <div class="earnings">
          <div class="total-earnings">
            <div class="text theme-color-gray-7">累计收益（元）</div>
            <div class="earnings-money theme-color-white">{{$store.state.user.YuEBaoData && $store.state.user.YuEBaoData.total_fee ? $store.state.user.YuEBaoData.total_fee : '0.00'}}</div>
          </div>
          <div class="rate">
            <div class="text theme-color-gray-7">日利率（%)</div>
            <div class="rate-num theme-color-white">{{$store.state.user.YuEBaoData && $store.state.user.YuEBaoData.day_rate ? $store.state.user.YuEBaoData.day_rate : '0.00'}}</div>
          </div>
        </div>
        <div class="btn-group">
          <router-link to="/user/YuEBaoRoll/OUT" class="roll-out theme-color theme-border-1px theme-border-yellow theme-color-yellow">转出</router-link>
          <router-link to="/user/YuEBaoRoll/IN" class="roll-in theme-bg theme-yellow-bg-2 theme-color-black">转入</router-link>
        </div>
      </div>
      <div class="icon-list theme-header-bg">
        <div class="item">
          <i class="icon iconfont h5-icon-suicunsuiqu theme-color theme-color-yellow"></i>
          <span class="theme-color-gray-7">随存随取</span>
        </div>
        <div class="item">
          <i class="icon iconfont h5-icon-shishishouyi theme-color theme-color-yellow"></i>
          <span class="theme-color-gray-7">实时收益</span>
        </div>
        <div class="item">
          <i class="icon iconfont h5-icon-leijijisuan theme-color theme-color-yellow"></i>
          <span class="theme-color-gray-7">累计计算</span>
        </div>
      </div>
      <div class="bottom-panel theme-header-bg">
        <img class="banner" :src="$config.blackTheme || $config.newQP? require('@src/assets/img/user/YuEBao/black-banner.png') : require('@src/assets/img/user/YuEBao/banner.png')" alt="">
        <div class="level-list theme-border-color-5">
          <ul v-if="$store.state.user.YuEBaoData">
            <li class="theme-border-color-5 theme-color-gray-7">
              <span class="theme-border-color-5">金管家等级</span>
              <span>余额宝日利率</span>
            </li>
            <li class="theme-border-color-5 theme-color-gray-7" v-for="(item,i) in $store.state.user.YuEBaoData.yuebao_lvl" :key="i">
              <span class="theme-border-color-5">{{item.name}}</span>
              <span>{{item.rate}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "YuEBaoCenter",
  data() {
    return {
    };
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$store.dispatch('user/yuebaoIndex').then(res => {
        if(res.code !== 200) {
          this.toastText(res.message);
          setTimeout(() => {
            this.$router.push('/user')
          }, 1500);
        }
      }).catch(err => {
        console.log(err);
      })
    },
    goDetail() {
      this.$router.push('/user/YuEBaoDetail')
    }
  },
  mounted() {},
  computed: {
    headerStyle() {
      return {
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        height: "8.75rem",
        zIndex: "-1"
      };
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
  .header-right {
    position: absolute;
    right: 0.2rem;
    top: 0;
    font-size: 0.3rem;
    a {
      color: #fff;
    }
  }
  .content-slot {
    padding: 0.2rem 0.16rem 0.4rem;
    .top-panel {
      width: 7.18rem;
      height: 6.66rem;
      background: #fff;
      border-radius: 0.1rem;
      box-shadow: 0 0.05rem 0.05rem 0 rgba(0, 0, 0, 0.03);
      text-align: center;
      overflow: hidden;
      .total-money {
        color: #444;
        font-size: 0.32rem;
        margin-top: 0.82rem;
      }
      .money {
        font-size: 0.66rem;
        color: #1D1D1D;
        font-family:PingFang SC;
        font-weight:bold;
      }
      .last-money {
        width: 3.12rem;
        height: 0.75rem;
        line-height: 0.88rem;
        background-image: url('../../../assets/img/user/YuEBao/bubble.png');
        background-size: 100% 100%;
        color: #1D1D1D;
        font-size: 0.26rem;
        margin: 0 auto;
        &.black-last-money {
          background-image: url('../../../assets/img/user/YuEBao/black-bubble.png');
        }
        .last-money-num {
          color: #FF6501;
          font-size: 0.36rem;
          vertical-align: top;
        }
      }
      .earnings {
        margin-top: 0.9rem;
        .total-earnings, .rate {
          display: inline-block;
          width: 50%;
          .text {
            color: #B7B7B7;
            font-size: 0.26rem;
          }
          .earnings-money, .rate-num{
            color: #242424;
            font-size: 0.36rem;
          }
        }
      }
      .btn-group {
        padding: 0 0.47rem;
        margin-top:  0.6rem;
        .roll-out, .roll-in {
          width: 3.02rem;
          height: 0.88rem;
          line-height:  0.88rem;
          border-radius: 0.1rem;
          display: inline-block;
          font-size: 0.38rem;
        }
        .roll-out {
          margin-right: 0.2rem;
        }
        .roll-in {
          color: #fff;
        }
      }
    }
    .icon-list {
      width: 7.18rem;
      height: 2.24rem;
      margin-top: 0.24rem;
      padding: 0.4rem 0.58rem;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      border-radius: 0.1rem;
      .item {
        i {
          display: block;
          font-size: 0.75rem;
        }
        span {
          display: block;
          font-size: 0.3rem;
          font-family:PingFang SC;
          font-weight: bold;
          color:#555555;
          margin-top: 0.2rem;
        }
      }
    }
    .bottom-panel {
      margin-top: 0.24rem;
      padding: 0.3rem 0;
      background-color: #fff;
      border-radius: 0.1rem;
      .banner {
      width: 6.88rem;
      height: 1.32rem;
      margin-bottom: 0.35rem;
      }
      .level-list {
        width: 7.02rem;
        border-top: 0.02rem solid #F2F2F2;
        margin: 0 auto;
        li {
          height: 0.6rem;
          line-height: 0.6rem;
          text-align: center;
          color: #333;
          font-size: 0.26rem;
          border-bottom: 0.02rem solid #F2F2F2;
          span {
            display: inline-block;
            width: 50%;
            &:first-child {
              border-right: 0.02rem solid #F2F2F2;
            }
          }
        }
      }
    }
  }
  .blush-center{

  }
</style>
