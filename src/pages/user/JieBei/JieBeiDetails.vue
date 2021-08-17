<template>
  <view-page full-box no-scroll class="theme-header-bg">
    <title-header title="借呗详情" slot="header" class="theme-main-bg theme-header-bottom" backEvent @back="$router.push('/user/JieBeiRecord')"></title-header>
    <div slot="static" :style="headerStyle"></div>
    <div class="content-slot" slot="content">
      <div class="panel theme-main-bg-5">
        <img
          src="../../../assets/img/user/jieBei/paid-off.png"
          class="paid-off"
          v-if="data.type == 0"
        />
        <div class="top theme-border-color">
          <p class="text theme-color-white">{{data.type == 0 ? '本期借款' : '未还款'}}</p>
          <p class="money theme-color-yellow">{{data.type == 0 ? (data.money*1).toFixed(2) : (data.unpaid*1).toFixed(2)}}</p>
        </div>
        <div class="bottom">
          <div class="paid-up" v-if="data.type == 0">好借好还,再借不难</div>
          <div v-else class="no-pay">
            <div>
              <p class="theme-color-white">本期借款</p>
              <p style="color:#FF9429">{{data.statusCode == 2 ? 0.00 : data.money}}</p>
            </div>
            <div>
              <p class="theme-color-white">已还款</p>
              <p style="color:#BC0000">{{data.repayment}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="list" :style="{maxHeight:this.$store.state.main.windowHeight - this.rem * 5.3 + 'px'}">
        <div class="list-item theme-main-bg-5 theme-border-color" v-for="(item,i) in list" :key="i">
          <div class="item-left">
            <p class="money theme-color-white">{{item.amount}}</p>
            <p class="time">{{ dayJs.unix(item.date).format('YYYY-MM-DD HH:mm') }}</p>
          </div>
          <div class="item-right">
            <span :class="['text',`code-${item.statusCode}`]">{{item.status}}</span>
          </div>
        </div>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "JieBeiDetails",
  data() {
    return {
      data: {},
      list: [],
    };
  },
  mounted() {
    this.data = this.$route.query;
    this.list = JSON.parse(localStorage.JieBeiRecord)[this.data.index]['jiehuanInfo']
  },
  methods: {
    
  },
  computed: {
    headerStyle() {
      return {
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        height: "3.47rem",
        zIndex: "-1",
        backgroundColor: this.$config.blackTheme ? "#454236" : '"#4D8FFA"'
      };
    }
  }
};
</script>

<style lang="less" scoped>
.content-slot {
  padding: 0 0.25rem;
  margin: 0 auto;
  .panel {
    position: relative;
    width: 100%;
    height: 3.22rem;
    margin: 0.64rem 0 0.4rem;
    background-color: #fff;
    box-shadow: 0px 0.05rem 0.11rem rgba(0, 63, 112, 0.06);
    border-radius: 0.15rem;
    overflow: hidden;
    z-index: 999;
    .paid-off {
      position: absolute;
      top: 0.11rem;
      right: 0.29rem;
      width: 1.77rem;
      height: 1.77rem;
    }
    .top {
      overflow: hidden;
      height: 1.93rem;
      border-bottom: 0.02rem solid #f5f4f7;
      .text {
        color: #333333;
        font-size: 0.34rem;
        margin-top: 0.3rem;
      }
      .money {
        color: #4d8ffa;
        font-size: 0.6rem;
        margin-top: 0.11rem;
      }
    }
    .bottom {
      height: 1.26rem;
      .paid-up {
        line-height: 1.26rem;
        color: #adafbb;
        font-size: 0.32rem;
      }
      .no-pay {
        font-size: 0.32rem;
        text-align: center;
        overflow: hidden;
        & > div {
          width: 50%;
          float: left;
          :first-child {
            margin-top: 0.18rem;
          }
        }
      }
    }
  }
  .list {
    width: 100%;
    background: #fff;
    box-shadow: 0px 0.05rem 0.11rem rgba(0, 63, 112, 0.06);
    border-radius: 0.15rem;
    overflow-y: auto;
    .list-item {
      overflow: hidden;
      height: 1.43rem;
      padding: 0 0.33rem 0 0.46rem;
      border-bottom: 0.02rem solid #e6e6e6;
      &:last-child {
        border-bottom: none;
      }
      .item-left {
        float: left;
        text-align: left;
        .money {
          color: #333333;
          font-size: 0.32rem;
          margin-top: 0.25rem;
        }
        .time {
          color: #adafbb;
          font-size: 0.26rem;
          margin-top: 0.15rem;
        }
      }
      .item-right {
        float: right;
        font-size: 0.28rem;
        line-height: 1.43rem;
        i {
          font-size: 0.35rem;
          vertical-align: middle;
          color: #d4d5de;
        }
        .code-0 {
          color: #4D8FFA;
        }
        .code-1 {
          color: #039141;
        }
        .code-2 {
          color: #FF0D0D;
        }
        .code-3 {
          color: #ADAFBB;
        }
      }
    }
  }
}
</style>
