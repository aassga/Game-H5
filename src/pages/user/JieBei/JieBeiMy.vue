<template>
  <view-page full-box class="theme-header-bg">
    <title-header title="我的额度" slot="header" class="theme-main-bg theme-header-bottom"></title-header>
    <div class="content" slot="content">
      <div class="panel">
        <p class="total-amount">总额度</p>
        <p class="amount-number">{{jieBeiData.jieInfo && jieBeiData.jieInfo.totalAmount ? jieBeiData.jieInfo.totalAmount : '0.00'}}</p>
        <div class="details">
          <span>本期借款:{{jieBeiData.jieInfo &&jieBeiData.jieInfo.currentLoan ? jieBeiData.jieInfo.currentLoan : '0.00'}}</span>
          <span>待还款:{{jieBeiData.huanInfo && jieBeiData.huanInfo.qiankuan ? jieBeiData.huanInfo.qiankuan : '0.00'}}</span>
        </div>
      </div>
      <div class="list" v-if="jieBeiData.jiebeiEdu.length">
        <div class="list-item theme-main-bg-5"  v-for="(item,i) in jieBeiData.jiebeiEdu" :key="i">
          <div class="item-left">
            <p class="theme-color-white">{{item.name}}</p>
            <p>{{item.level}}级</p>
          </div>
          <div class="item-right">
            <p>可借额度</p>
            <p class="theme-color-white">{{(item.edu*1).toFixed(2)}}</p>
          </div>
        </div>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">

export default {
  name: 'JieBeiMy',
  data () {
    return {
      jieBeiData : {}
    }
  },
  created() {
    this.jieBeiData = this.$store.state.user.jieBeiData;
    this.getJiebeiData();
  },
  methods: {
    getJiebeiData() {
      if (JSON.stringify(this.$store.state.user.jieBeiData) === "{}") {
        this.$store
          .dispatch("user/activityJiebeiJieHuanInfo")
          .then(res => {
            if (res.code === 200)
              this.$store.commit("user/setJieBeiData", res.data);
              this.jieBeiData = res.data
          })
          .catch(() => {});
      }
    },
  },
  computed:{
  }
}
</script>

<style lang="less" scoped>
  .content {
    .panel {
      width: 7rem;
      height: 2.93rem;
      background-image: url('../../../assets/img/user/jieBei/my-bg.png');
      background-size: 100% 100%;
      padding: 0 0.28rem;
      text-align: left;
      margin: 0.2rem auto 0.4rem;
      overflow: hidden;
      .total-amount {
        color: #CEEFFF;
        font-size: 0.3rem;
        margin-top: 0.32rem;
      }
      .amount-number {
        color: #FFFFFF;
        font-size: 0.83rem;
        margin-top: 0.12rem;
      }
      .details {
        overflow: hidden;
        margin-top: 0.3rem;
        & > span {
          color: #CEEFFF;
          font-size: 0.24rem;
        }
        :first-child {
          float: left;
        }
        :last-child {
          float: right;
        }
      }
    }
    .list {
      padding: 0 0.25rem;
      .list-item {
        width: 100%;
        height: 1.51rem;
        margin-bottom: 0.2rem;
        background-color: #fff;
        padding: 0.3rem 0.35rem 0 0.47rem;
        box-shadow:0px 0.05rem 0.11rem rgba(0,63,112,0.06);
        border-radius: 0.15rem;
        color: #333333;
        font-size: 0.29rem;
        .item-left {
          float: left;
          text-align: left;
          :first-child {
            font-size: 0.32rem;
          }
          :last-child {
            color: #A4A4A4;
            margin-top: 0.08rem;
          }
        }
        .item-right {
          float: right;
          text-align: right;
          :first-child {
            font-size: 0.28rem;
            color: #A4A4A4;
          }
          :last-child {
            margin-top: 0.1rem;
          }
        }
      }
    }
  }
</style>
