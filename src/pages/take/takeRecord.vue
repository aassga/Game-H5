<template>
  <div
    :class="[{ 'QP893-take-record': $config.isBlackRedTheme }]"
  >
    <div
      class="head theme-color-white theme-border-color theme-main-bg-5"
      v-if="list.length < 0"
    >
      <span>订单编号</span>
      <span>提现方式</span>
      <span>金额</span>
      <span>提现时间</span>
      <span>状态</span>
    </div>
    <list-view
      class="list-view"
      :noMore="noData"
      @load-top="onPullingDown"
      @load-down="onPullingUp"
      :style="{ height: $store.state.main.windowHeight - 4 * rem + 'px' }"
      ref="list"
    >
      <div class="view-box theme-main-bg-5">
        <template v-if="list.length > 0">
          <ul
            class="list clear-fix theme-border-color"
            v-for="(item, i) in list"
            :key="'item_' + i"
          >
            <li class="item theme-color-white code">
              {{ item.code }}
            </li>
            <li class="item name theme-color-white">
              {{ item.bankName ? item.bankName : "USDT" }}
            </li>
            <li class="item amount theme-color-white">{{ item.amount }}</li>
            <li class="item time theme-color-white">
              {{ dayJs.unix(item.time).format("YYYY/MM/DD HH:mm:ss") }}
            </li>
            <li class="item status theme-color-white">
              {{
                {
                  wait: "审核中",
                  fail: "失败",
                  success: "成功",
                  virtualWithdrawals: "成功",
                  payment: "交易中",
                }[item["status"]]
              }}
            </li>
          </ul>
        </template>
        <template v-else>
          <div class="no-data" :style="{ height: 9.5 * rem + 'px' }">
            <img :src="noDataImg" alt />
            <p class="theme-color-white">暂无数据</p>
          </div>
        </template>
      </div>
    </list-view>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "takeRecord",
  computed: {
    noDataImg() {
      if (this.$config.blackTheme || this.$config.newQP) {
        return require("@src/assets/img/yellow.png");
      } else if (this.$config.blush || this.$config.isBlackRedTheme) {
        return require("@src/assets/img/blush.png");
      } else if (this.$config.name === "betnew") {
        return require("@src/assets/img/no-data-green.png");
      } else {
        return require("@src/assets/img/bluegreen.png");
      }
    },
  },
  components: {},
  data() {
    return {
      page: 0,
      noData: false,
      limit: 12,
      list: [],
      loading: false,
      scrollHeight: 0,
    };
  },
  created() {
    this.$store.state.main.keyBoardStatus = true;
    this.refreshList();
  },
  beforeDestroy() {
    this.$store.state.main.keyBoardStatus = false;
  },
  watch: {},
  mounted() {},
  methods: {
    onPullingDown() {
      this.page = 0;
      this.loading = false;
      this.noData = false;
      this.refreshList(true);
    },
    onPullingUp() {
      this.refreshList();
    },
    refreshList(status) {
      if (this.noData) {
        this.loading = false;
        this.toastText("没有更多", "top");
      } else {
        if (!this.loading) {
          this.page++;
          this.loading = true;
          if (this.page == 1) {
            this.toastLoading("加载中");
          }
          this.$store
            .dispatch("user/accountMoneyRecord", {
              type: "withdrawals",
              start: this.dayJs().subtract(3, "month").format("YYYY-MM-DD"),
              end: this.dayJs().format("YYYY-MM-DD"),
              page: this.page,
              limit: this.limit,
            })
            .then((data) => {
              this.loading = false;
              this.$refs.list.loaded();
              if (this.page == 1) {
                this.toastClear();
              }
              if (data.code === 200) {
                if (data.data.data.list.length) {
                  this.noData = false;
                  if (status) this.list = data.data.data.list;
                  else this.list = this.list.concat(data.data.data.list);
                } else {
                  if (status) this.list = data.data.data.list;
                  this.noData = true;
                }
              } else {
                this.$refs.list.loaded();
                this.page--;
                this.toastText(data.message);
              }
            });
        }
      }
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.head {
  height: 1.09rem;
  line-height: 1.09rem;
  text-align: center;
  color: #333333;
  font-size: 0.26rem;
  border-bottom: 0.02rem solid #f0f0f0;
  span {
    display: inline-block;
    width: 21%;
    &:last-child {
      width: 16%;
    }
  }
}
.view-box {
  margin: 0;
  padding: 0;
  width: 100%;
  background-color: #fafafa;
  .list {
    text-align: center;
    color: #6f6f6f;
    font-size: 0.25rem;
    border-bottom: 0.02rem solid #f0f0f0;
    padding: 0.2rem 0;
    .item {
      display: inline-block;
      width: 21%;
      word-wrap: break-word;
      vertical-align: middle;
      &:last-child {
        width: 16%;
      }
    }
  }
  .no-data {
    img {
      width: 100%;
      margin-top: 1rem;
    }
    p {
      font-size: 0.3rem;
      color: #666666;
    }
  }
}
.newQP-take {
}
.blush-take {
}

// QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 start
//控制取款紀錄內容區塊樣式
.QP893-take-record {
  .head {
    color: #ffffff; //表格header 標題字體顏色
  }
  .view-box {
    background-color: #1b1d1b; //表格內容背景顏色
    .list {
      color: #ffffff; //表格內容文字顏色
    }
  }
}
// QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 end
</style>