<template>
  <view-page
    :class="[
      'record',
      'theme-main-bg',
      {
        'qp-record': $config.newQP || $config.blackTheme,
        'blush-record': $config.blush,
      },
      { 'aqvns-record': $config.isAqvns },
    ]"
    full-box
    load-more
    ref="view-page"
    @load-top="onPullingDown"
    @load-down="onPullingUp"
    v-touch:left="onSwipeLeft"
    v-touch:right="onSwipeRight"
  >
    <title-header
      title="帐变记录"
      slot="header"
      class="theme-header-bottom theme-header-bg"
    >
      <div class="header-right" slot="right" @click="showDate()">
        <span>{{ dateOkName }}</span>
        <span class="date-icon icon iconfont h5-icon-qushi-moreup"></span>
      </div>
    </title-header>
    <div class="record-header" slot="header-static" style="margin-top: 0.2rem">
      <van-tabs
        v-model="tabIndex"
        :line-height="2"
        :swipe-threshold="5"
        class="theme-after-border-color"
      >
        <van-tab v-for="item in tabs" :key="item.k" :title="item.v"></van-tab>
      </van-tabs>
    </div>
    <van-tabs
      class="no-tab theme-after-border-color"
      slot="content"
      swipeable
      animated
    >
      <van-tab></van-tab>
    </van-tabs>
    <div class="record-content" slot="content">
      <transition-group
        :name="animation"
        class="animation-box"
        tag="p"
        ref="animationBox"
      >
        <div class="content-body" ref="solid" :key="'wrapper_' + tabIndex">
          <div class="record-body" v-if="all !== '' && list.length">
            <div
              v-for="(item, i) in list"
              :key="item.id + '_' + i"
              class="record-item theme-header-bg theme-after-border-color"
            >
              <h5 class="card-title theme-color-white">
                {{ item.title || item.type }}
              </h5>
              <div class="card-content" slot="content">
                <span
                  class="card-code theme-color-white"
                  v-if="!['bonus', 'agency', 'others'].includes(tab.k)"
                  >{{ item.code }}</span
                >
                <span
                  class="card-code theme-color-white"
                  v-else-if="['others'].includes(tab.k)"
                  >{{ item["remarks"] }}</span
                >
                <span class="card-code theme-color-white" v-else>{{
                  item["remarks"]
                }}</span>
                <span
                  class="card-amount"
                  :class="
                    tabIndex == 4 && item.type && item.amount.includes('-')
                      ? 'fail'
                      : 'success'
                  "
                  ><span class="rmb"></span>{{ item.amount }}</span
                >
              </div>
              <div class="card-footer" slot="footer">
                <span class="card-time theme-color-gray-2">{{
                  getTime(item["time"] || item["created_at"])
                }}</span>
                <span
                  :class="['card-status', item['status']]"
                  @click="showRemark(item)"
                >
                  <i
                    v-if="tabIndex == 0 || tabIndex === 1"
                    :class="item['status']"
                  ></i>
                  <i v-else class="success"></i>
                  <i v-if="tabIndex == 0 || tabIndex === 1">{{
                    {
                      wait: "审核中",
                      fail: "失败",
                      success: "成功",
                      virtualWithdrawals: "成功",
                      payment: "交易中",
                    }[item["status"]]
                  }}</i>
                  <i v-else class="success" style="color: #ff2200">成功</i>
                </span>
              </div>
            </div>
          </div>
          <div
            v-else-if="all !== ''"
            class="list-empty theme-main-bg"
            style="height: 10.72rem"
          >
            <img
              style="width: 100%; margin-top: 1.6rem"
              :src="noDataImg"
              alt=""
            />
            <p class="info">暂无{{ tabs[tabIndex].v }}</p>
          </div>
        </div>
      </transition-group>
    </div>
    <div slot="static">
      <agency-date-selector
        :dataIndex="1"
        v-model="date"
        @getDefaultIndex="getDefaultIndex"
        :defaultIndex="defaultIndex"
        :show.sync="showDateSelector"
        :dateName="dateName"
        @okSelect="okSelect"
        :newQP="$config.newQP || $config.blackTheme"
      ></agency-date-selector>
    </div>
    <div
      class="footer theme-header-bg theme-noborder"
      slot="footer"
      v-if="list.length"
    >
      <div class="item"></div>
      <div class="item">
        <span class="theme-color-white">{{ text[tab.k] }}</span>
        <span style="color: #ff2200; margin-left: 0.1rem"
          ><span class="rmb"></span>{{ all || "0.00" }}</span
        >
      </div>
    </div>
  </view-page>
</template>

<script>
import AgencyDateSelector from "@src/components/agency-date-selector/AgencyDateSelector";
export default {
  name: "Account2",
  components: {
    AgencyDateSelector,
  },
  data() {
    return {
      scrollHeight: 0,
      showSearch: false,
      page: 0,
      limit: 5,
      date: null,
      dateOkName: "今天",
      dateOkIndex: 0,
      defaultIndex: 0,
      showDateSelector: false,
      dateName: "",
      tabs: [
        {
          k: "withdrawals",
          v: "提现",
          n: "提现",
        },
        {
          k: "deposit",
          v: "存款",
          n: "存款",
        },
        {
          k: "bonus",
          v: "优惠",
          n: "优惠",
        },
        {
          k: "agency",
          v: "代理",
          n: "收入",
        },
        {
          k: "others",
          v: "其它",
          n: "",
        },
      ],
      text: {
        withdrawals: "提现:",
        deposit: "存款:",
        bonus: "优惠:",
        agency: "代理:",
        others: "总额:",
      },
      tabIndex: 0,
      list: [],
      all: "",
      animation: "slide-left",
      loading: false,
      noMore: false,
      clientHeight: 0,
    };
  },
  mounted() {
    if (!this.$store.state.user.token) {
      this.$router.replace("/admin/login");
    }
  },
  computed: {
    tab() {
      return this.tabs[this.tabIndex];
    },
    user() {
      return this.$store.state.user.userInfo;
    },
    noDataImg() {
      if (this.$config.newQP || this.$config.blackTheme) {
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
  watch: {
    date() {
      this.page = 0;
      this.all = "";
      this.noMore = false;
      this.refreshList(true);
    },
    tabIndex(now, old) {
      if (now < old) {
        this.animation = "slide-right";
      } else {
        this.animation = "slide-left";
      }
      this.all = "";
      this.page = 0;
      this.noMore = false;
      this.$nextTick(() => {
        this.$refs["view-page"].refresh();
        this.refreshList(true);
      });
    },
  },
  created() {
    if (!this.user["is_agency"]) {
      this.tabs = [
        {
          k: "withdrawals",
          v: "提现",
          n: "取款",
        },
        {
          k: "deposit",
          v: "存款",
          n: "存款",
        },
        {
          k: "bonus",
          v: "优惠",
          n: "优惠",
        },
        {
          k: "others",
          v: "其它",
          n: "",
        },
      ];
    }
    if (this.$route.query.id) {
      this.tabIndex = this.$route.query.id;
    }
  },
  methods: {
    okSelect(data, index) {
      this.dateOkName = data.name || "今天";
      this.dateOkIndex = index;
      this.defaultIndex = index;
      this.refreshList();
    },
    getDefaultIndex(index) {
      console.log(this.defaultIndex);
    },
    showDate() {
      this.showDateSelector = true;
    },
    showRemark(item) {
      if (item["remark"]) {
        this.toastText(item["remark"], "top");
      }
    },
    onSwipeLeft() {
      if (this.tabIndex + 1 < this.tabs.length) {
        this.tabIndex++;
      }
    },
    onSwipeRight() {
      if (this.tabIndex > 0) {
        this.tabIndex--;
      }
    },
    getTime(str) {
      return this.dayJs.unix(str).format("MM-DD HH:mm:ss");
    },
    onPullingDown() {
      this.page = 0;
      this.all = "";
      this.noMore = false;
      this.refreshList(true);
    },
    onPullingUp() {
      this.refreshList();
    },
    refreshList(status) {
      this.page++;
      if (this.date && this.tab && this.tab.k) {
        this.$store
          .dispatch("user/accountMoneyRecord", {
            type: this.tab.k,
            start: this.date.start,
            end: this.date.end,
            page: this.page,
            limit: this.limit,
          })
          .then((data) => {
            this.$refs["view-page"].loaded();
            if (typeof data.data.data.amount === "object") {
              this.all = data.data.data.amount["total_amount"];
            } else {
              this.all = data.data.data.amount;
            }
            if (status) {
              this.list = data.data.data.list;
            } else {
              this.list = this.list.concat(data.data.data.list);
            }
            if (data.data.data.list.length == 0 && !status) {
              if (data.message) {
                // this.toastText('暂无更多数据')
              } else if (data.msg) {
                this.toastText(data.msg, "top");
              }
            }
            this.$refs["view-page"].loaded();
            this.refreshing = false;
            this.noData = !this.list.length;
          })
          .catch(() => {
            this.$refs["view-page"].loaded();
            this.page--;
          });
      } else {
        this.list = [];
        this.$refs["view-page"].loaded();
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.vux-swiper {
  height: calc(100vh - 90px) !important;
}
/deep/ .van-tabs {
  .van-tab {
    font-size: 0.34rem !important;
  }
}
.header-right {
  position: absolute;
  right: 0.16rem;
  top: 0;
  font-size: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;

  .date-icon {
    font-size: 0.2rem;
    transform: scale(0.75) rotateZ(180deg);
    color: #ffffff;
  }
}

/deep/.van-tabs__nav {
  display: flex;

  .van-tab {
    font-size: 0.34rem;
    color: #666666;
    padding: 0;
    // flex: 0 0 25% !important;
    span {
      font-size: 0.34rem;
      padding: 0;
    }
  }

  .van-tabs__line {
    // width: 10% !important;
  }
}

/deep/.van-tabs__nav--line {
  padding-bottom: 0.285rem;
}

.record {
  .record-item {
    background-color: #fff;
    position: relative;
    box-sizing: border-box;
    border: 1px solid transparent;
    &::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      right: 0.24rem;
      bottom: 0;
      left: 0.24rem;
      border-bottom: 0.02rem solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
  .record-item:last-child {
    &::after {
      content: "";
      border-bottom: 0;
    }
  }
  .record-content {
    .animation-box {
      position: relative;
      left: 0;
      top: 0;
      width: 100%;

      .content-body {
        width: calc(100% - 0.32rem);
        margin: 0.24rem 0.16rem;
        > .record-body {
          box-shadow: 0px 0.05rem 0.05rem 0px rgba(0, 0, 0, 0.03);
          border-radius: 0.1rem;
          width: 100%;
        }
      }
    }
  }

  .card-title {
    font-size: 0.3rem;
    height: 0.42rem;
    line-height: 0.42rem;
    color: rgb(44, 62, 80);
    margin: 0.24rem 0 0.16rem 0.24rem;
    text-align: left;
    font-weight: 400;
    // border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
  }

  .card-content,
  .card-footer {
    width: 100%;
    color: #a3a3a3;
    padding: 0 0.24rem;
    box-sizing: border-box;
    display: flex;
    position: relative;
    justify-content: space-between;
    flex-wrap: nowrap;
    font-size: 0.26rem !important;
    text-align: left;
  }
  .card-footer {
    margin-bottom: 0.16rem;
  }

  .card-code {
    font-size: 0.28rem;
    min-height: 0.4rem;
    line-height: 0.4rem;
    margin-bottom: 0.16rem;
    color: #515151;
    flex: 1;
    max-width: 5.6rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .font {
    transform: scale(1.24);
    transform-origin: right;
  }

  .card-time {
    color: rgb(153, 153, 153);
    flex: 1;
  }

  .card-status {
    color: #999999;
    display: flex;
    > i:first-child {
      display: inline-block;
      margin-right: 0.08rem;
      width: 0.34rem;
      height: 0.34rem;
      &.fail {
        background-image: url("../../../assets/img/agent-center-new/account/fail.png");
        background-size: 100%;
        background-repeat: no-repeat;
      }
      &.success,
      &.virtualWithdrawals {
        background-image: url("../../../assets/img/agent-center-new/account/success.png");
        background-size: 100%;
        background-repeat: no-repeat;
      }
      &.payment,
      &.wait {
        background-image: url("../../../assets/img/agent-center-new/account/wait.png");
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
    &.wait,
    &.payment {
      color: #ff9700;
    }
    &.fail {
      color: #00a054;
    }
    &.success,
    &.virtualWithdrawals {
      color: #ff2200;
    }
  }
  .card-amount {
    height: 0.4rem;
    line-height: 0.4rem;
    color: #ff2200;
    font-size: 0.28rem !important;
  }
  .card-amount {
    &.wait,
    .payment {
      color: #09c205;
    }
    &.fail {
      color: #00a054;
    }
    &.success,
    &.virtualWithdrawals {
      color: #ff2200;
    }
  }
  .list-empty {
    flex: 1;
    // width: 100vw;
    background-color: #ffffff;
    box-shadow: 0 0.05rem 0.05rem 0 rgba(0, 0, 0, 0.03);
    border-radius: 0.1rem;
    overflow: hidden;

    .img {
      width: 100vw;
      height: 35.7333333vw;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      margin-top: 1.6rem;
    }

    .info {
      line-height: 1rem;
      color: #777;
      font-size: 0.28rem;
    }
  }

  .footer {
    height: 0.9rem;
    border-top: 0.02rem solid hsla(0, 0%, 95%, 1);
    display: flex;
    padding: 0 0.32rem;
    line-height: 0.9rem;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;

    .item {
      font-size: 0.3rem;
      line-height: 0.9rem;
    }
  }
  &.qp-record {
    /deep/ .auto-box-header-static {
      background-color: #000;
      .van-hairline--top-bottom {
        &::after {
          border: none !important;
        }
      }
      .van-tabs__nav {
        background: linear-gradient(0deg, #0c0c0c, #222222) !important;
        .van-tab {
          color: #fff;
        }
      }
      .van-tab--active {
        color: #f6cf32 !important;
      }
      .van-tabs__line {
        background-color: #f6cf32 !important;
      }
    }
  }
  &.blush-record {
    /deep/ .auto-box-header-static {
      background-color: #530107;
      .van-hairline--top-bottom {
        &::after {
          border: none !important;
        }
      }
      .van-tabs__nav {
        background: linear-gradient(0deg, #9d010f, #72010b) !important;
        .van-tab {
          color: #fff;
        }
      }
      .van-tab--active {
        color: #f6cf32 !important;
      }
      .van-tabs__line {
        background-color: #f6cf32 !important;
      }
    }
    .view-box {
      width: auto;
      padding: 0 0.16rem;
      ul {
        padding: 0 !important;
        li {
          background-color: #640009;
        }
      }
    }
  }
}


// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 start
.aqvns-record{
  /deep/.auto-box-header-static{
    .record-header{
      .van-tab--active{
        color: #C9A786 !important;
        border-color: #C9A786 !important;
      }
      .van-tabs__line{
        background-color: #C9A786 !important;
      }
    }
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 end
</style>
