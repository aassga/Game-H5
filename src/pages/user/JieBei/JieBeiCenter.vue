<template>
  <view-page class="JieBei-enter theme-header-bg" ref="view-page" full-box load-more @load-top="getJiebeiData" noMore
            :class="[{ jieBei839QpEnter : $config.name === '839qp' }, { jieBeiHtyEnter : $config.name === 'hty' }
            , { jieBeiDqrEnter : $config.name === 'dqr' }]"
  >
    <div class="header" slot="header">
      <title-header
        class="title"
        style="background-color: rgba(0,0,0,0) !important;"
        backEvent
        @back="$router.push('/user')"
        title="免息借呗"
      >
        <div class="header-right" slot="right" @click="openKF">
          <img src="../../../assets/img/user/jieBei/kefu.png" alt />
        </div>
      </title-header>
    </div>
    <div slot="static" :style="headerStyle"></div>
    <div class="content-slot" slot="content">
      <div class="overdue-tip" v-if="jieBeiData.jieInfo && jieBeiData.jieInfo.overdueMsg">
        <img src="../../../assets/img/user/jieBei/overdue-icon.png" alt="">
        {{jieBeiData.jieInfo.overdueMsg}}
      </div>
      <div class="due-tip" v-else-if="jieBeiData.jieInfo && jieBeiData.jieInfo.returnAmounDate2">{{jieBeiData.jieInfo.returnAmounDate2}}</div>
      <div class="top">
        <p class="text">总额度</p>
        <p class="money">{{jieBeiData.jieInfo && jieBeiData.jieInfo.totalAmount ? jieBeiData.jieInfo.totalAmount : '0.00'}}</p>
        <router-link to="/user/JieBeiMy" class="check-btn" :class="{'js85-check-btn' :$config.name ==='js85'}">查看详情</router-link>
      </div>
      <div class="mid theme-main-bg-5">
        <div>
          <div class="text theme-color-gray">本期借款</div>
          <div class="money theme-color-white">{{jieBeiData.jieInfo &&jieBeiData.jieInfo.currentLoan ? jieBeiData.jieInfo.currentLoan : '0.00'}}</div>
        </div>
        <div>
          <div class="text theme-color-gray">待还款</div>
          <div class="money theme-color-white">{{jieBeiData.jieInfo && jieBeiData.jieInfo.alreadyUseAmount ? jieBeiData.jieInfo.alreadyUseAmount : '0.00'}}</div>
        </div>
        <div class="line"></div>
      </div>
      <img class="banner" :src="getBanner" alt />
      <div class="bottom theme-main-bg-5">
        <router-link to="/user/JieBeiLimit" class="cell">
          <img src="../../../assets/img/user/jieBei/center-limit.png" class="cell-img" />
          <span class="des theme-color-white">借呗额度</span>
          <i class="cell-icon van-icon van-icon-arrow van-cell__right-icon theme-color-white"></i>
        </router-link>
        <router-link to="/user/JieBeiRecord" class="cell theme-border-color">
          <img src="../../../assets/img/user/jieBei/center-record.png" class="cell-img" />
          <span class="des theme-color-white">借呗记录</span>
          <i class="cell-icon van-icon van-icon-arrow van-cell__right-icon theme-color-white"></i>
        </router-link>
      </div>
      <div class="btn-group">
        <router-link to="/user/JieBeiApply/borrow" class="borrow theme-yellow-bg-2 theme-color-black">去借款</router-link>
        <router-link to="/user/JieBeiApply/refund" class="refund theme-main-bg-5 theme-color-yellow theme-border-yellow">去还款</router-link>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import centerBanner from '../../../assets/img/user/jieBei/center-banner.png';
import tccpCenterBanner from '../../../assets/img/user/jieBei/tccp-center-banner.png'
import js85CenterBanner from '../../../assets/img/user/jieBei/js85-center-banner.png'

export default {
  name: "JieBeiCenter",
  data() {
    return {
      jieBeiData: {},
      centerBanner,
      tccpCenterBanner,
      js85CenterBanner
    };
  },
  created() {
    this.jieBeiData = this.$store.state.user.jieBeiData;
    this.getJiebeiData();
    if (!this.$store.state.user.token) {
      this.$router.replace('/admin/login')
    }
  },
  methods: {
    getJiebeiData() {
      this.$store
        .dispatch("user/activityJiebeiJieHuanInfo")
        .then(res => {
          if (res.code === 200)
            this.$store.commit("user/setJieBeiData", res.data);
            this.jieBeiData = res.data
            this.$refs['view-page'].loaded()
        })
        .catch(() => {});
    },
    openKF() {
      const link = this.getKF();
      if (link) {
        window.tryOpen(link);
      } else {
        this.toastText("暂无客服", "middle");
      }
    },
  },
  mounted() {},
  computed: {
    headerStyle() {
      let backgroundImage
      if (['tccp','tyc86'].includes(this.$config.name)) backgroundImage = 'none'
      else if (['839qp', 'hty', 'dqr'].includes(this.$config.name)) backgroundImage = `url(${require('../../../assets/img/user/jieBei/center-839qp-bg.png')})`
      else if (this.$config.name === 'js85') backgroundImage = `url(${require('../../../assets/img/user/jieBei/js85-center-bg.png')})`
      else backgroundImage = `url(${require('../../../assets/img/user/jieBei/center-bg.png')})`
      return {
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        height: "5.74rem",
        zIndex: "-1",
        backgroundImage: backgroundImage,
        backgroundSize: "100% 100%"
      }
    },
    getBanner () {
      if (['tccp','tyc86', '839qp', 'hty', 'dqr'].includes(this.$config.name)) return tccpCenterBanner
      if(this.$config.name ==='js85' ) return js85CenterBanner
      return centerBanner
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
.header-right {
  position: absolute;
  right: 0.38rem;
  top: 0.1rem;
  img {
    width: 0.448rem;
    height: 0.38rem;
  }
}
.content-slot {
  padding: 0;
  overflow: hidden;
  .due-tip {
    position: absolute;
    top: 0;
    left: 0;
    width: 2.79rem;
    height: 0.66rem;
    line-height: 0.66rem;
    background: #00389A;
    opacity: 0.24;
    border-radius: 0px 1.23rem 1.35rem 0px;
    color: #CEEFFF;
    font-size: 0.24rem;
    padding-left: 0.22rem;
    text-align: left;
  }
  .overdue-tip{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.68rem;
    line-height: 0.68rem;
    background:#00389A;
    opacity:0.24;
    font-size: 0.24rem;
    color: #FFFFFF;
    text-align: left;
    img {
      width: 0.32rem;
      height: 0.32rem;
      margin-left: 0.18rem;
      margin-right: 0.05rem;
      vertical-align: middle;
    }
  }
  .top {
    color: #fff;
    text-align: center;
    .text {
      font-size: 0.3rem;
      margin-top: 0.93rem;
    }
    .money {
      font-size: 0.83rem;
      margin: 0.1rem;
    }
    .check-btn {
      display: block;
      width: 2.98rem;
      height: 0.74rem;
      line-height: 0.74rem;
      background: linear-gradient(
        360deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(226, 241, 255, 1) 100%
      );
      box-shadow: 0px 0.03rem 0.12rem rgba(0, 0, 0, 0.16);
      border-radius: 0.42rem;
      color: #2195df;
      font-size: 0.3rem;
      margin: 0 auto;
      margin-top: 0.2rem;
    }
    .js85-check-btn{
      background: linear-gradient(0deg, #C6A759, #F1D99E) !important;
      color: #0E0E0E !important;
    }
  }
  .mid {
    width: 7.1rem;
    height: 1.22rem;
    background-color: #fff;
    box-shadow: 0 0.05rem 0.11rem rgba(0, 63, 112, 0.06);
    border-radius: 0.15rem;
    margin: 0.8rem auto 0;
    position: relative;
    .line {
      position: absolute;
      left: 50%;
      top: 0.24rem;
      width: 0.02rem;
      height: 0.73rem;
      background-color: #f5f4f7;
    }
    & > div {
      width: 50%;
      text-align: center;
      display: inline-block;
      .text {
        color: #a1a2ab;
        font-size: 0.26rem;
        margin-top: 0.18rem;
      }
      .money {
        color: #333333;
        font-size: 0.34rem;
        margin-top: 0.04rem;
      }
    }
  }
  .banner {
    width: 7rem;
    height: 1.48rem;
    margin: 0.15rem auto 0.34rem;
  }
  .bottom {
    width: 100%;
    height: 2.27rem;
    background-color: #fff;
    box-shadow: 0px 0px 0.17rem rgba(55, 149, 184, 0.12);
    text-align: left;
    .cell {
      display: block;
      height: 1.13rem;
      width: 750px;
      border-top: 0.02rem solid #e6e6e6;
      position: relative;
      .cell-img {
        position: absolute;
        top: 0.38rem;
        left: 0.62rem;
        width: 0.44rem;
        height: 0.4rem;
      }
      .des {
        color: #333333;
        font-size: 0.36rem;
        margin-left: 1.4rem;
        line-height: 1.13rem;
        height: 1.13rem;
        display: inline-block;
        float: left;
      }
      .cell-icon {
        position: absolute;
        font-size: 0.3rem;
        margin-left: 4.14rem;
        line-height: 1.13rem;
      }
    }
    :first-child {
      border-top: none;
    }
  }
  .btn-group {
    padding: 0 0.22rem;
    margin-bottom: 0.3rem;
    display: flex;
    justify-content: space-between;
    margin-top: 1.23rem;
    font-size: 0.38rem;
    .borrow {
      background: linear-gradient(
        204deg,
        rgba(77, 143, 250, 1) 0%,
        rgba(54, 148, 255, 1) 100%
      );
      color: #fff;
    }
    .refund {
      background-color: #fff;
      color: #2198ff;
      border: 0.02rem solid #2198ff;
    }
    & > a {
      display: block;
      width: 3.22rem;
      height: 0.98rem;
      line-height: 0.98rem;
      border-radius: 0.2rem;
    }
  }
}

.jieBei839QpEnter, .jieBeiHtyEnter, .jieBeiDqrEnter {
  background: #272829;
  .top {
    .check-btn {
      color: #b31818 !important;
    }
  }
  .mid {
    background-color: #272829 !important;
    .money {
      color: #fff !important;
    }
  }
  .bottom {
    background-color: #272829 !important;
    .cell {
      border-color: #3A0206 !important;
      .des {
        color: #fff !important;
      }
    }
  }
  .btn-group {
    .borrow {
      color: #0E0E0E !important;
      background: -webkit-gradient(linear, left bottom, left top, from(#C6A759), to(#F1D99E)) !important;
      background: -webkit-linear-gradient(bottom, #C6A759, #F1D99E) !important;
      background: linear-gradient(0deg, #C6A759, #F1D99E) !important;
    }
    .refund {
      background-color: #272829 !important;
      color: #F6CF32 !important;
      border: 0.02rem solid #E6C245 !important;
    }
  }
}
</style>
