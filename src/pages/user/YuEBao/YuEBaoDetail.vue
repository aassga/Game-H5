<template>
  <view-page
    class="detail theme-main-bg-5"
    full-box
    load-more
    ref="view-page"
    @load-top="onPullingDown"
    @load-down="onPullingUp"
    v-touch:left="onSwipeLeft"
    v-touch:right="onSwipeRight"
  >
    <title-header class="theme-header-bg theme-header-bottom" title="余额宝明细" slot="header">
      <div class="header-right" slot="right" @click="showDate()">
        <span>{{dateOkName}}</span>
        <span class="date-icon icon iconfont h5-icon-qushi-moreup"></span>
      </div>
    </title-header>
    <div :class="['detail-header theme-header-bg',{'black-tab' : $config.blackTheme || $config.newQP},{'blush-tab' : $config.blush}]" slot="header-static">
      <van-tabs v-model="tabIndex" :line-height="2" :swipe-threshold="5">
        <van-tab v-for="(item) in tabs" :key="item.k" :title="item.v"></van-tab>
      </van-tabs>
    </div>
    <div class="detail-content" slot="content">
      <transition-group :name="animation" class="animation-box" tag="p" ref="animationBox">
        <div class="content-body" ref="solid" :key="'wrapper_' + tabIndex">
          <div v-if="!list.length || loading" class="list-empty theme-header-bg" style="height:10.72rem">
            <img style="width:100%;margin-top: 1.6rem;" :src="noDataImg" alt />
            <p class="info theme-color-white">暂无{{tabs[tabIndex].v}}</p>
          </div>
          <div class="detail-body" v-else>
            <div v-for="(item,i) in list" :key="item.id+'_'+i" class="detail-item theme-header-bg theme-after-border-color">
              <h5 class="card-title theme-color-white">{{text[item.type]}}</h5>
              <div class="card-content" slot="content">
                <span class="card-code theme-color-white">{{item.order_no}}</span>
                <span
                  class="card-amount"
                  :class="item.type"
                >
                  {{ item.amount }}
                </span>
              </div>
              <div class="card-footer" slot="footer">
                <span class="card-time">{{getTime(item['time']||item['created_at'])}}</span>
              </div>
            </div>
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
        :newQP="$config.blackTheme"
      ></agency-date-selector>
    </div>
    <div class="footer theme-header-bg theme-border-color theme-color-white" slot="footer" v-if="list.length">
      <div class="item" v-if="tabIndex == 0 || tabIndex == 1">
        <span>利息:</span>
        <span style="color: #FF9700;margin-left: 0.1rem">
          {{totalAmount.fee||'0.00'}}
        </span>
      </div>
      <div class="item" v-if="tabIndex == 0 || tabIndex == 3">
        <span>转出:</span>
        <span style="color: #00A054;margin-left: 0.1rem">
          {{totalAmount.out||'0.00'}}
        </span>
      </div>
      <div class="item" v-if="tabIndex == 0 || tabIndex == 2">
        <span>转入:</span>
        <span style="color: #EB4343;margin-left: 0.1rem">
          {{totalAmount.in||'0.00'}}
        </span>
      </div>
    </div>
  </view-page>
</template>

<script>
import AgencyDateSelector from "@src/components/agency-date-selector/AgencyDateSelector";
export default {
  name: "YuEBaoDetail",
  components: {
    AgencyDateSelector
  },
  data() {
    return {
      scrollHeight: 0,
      page: 0,
      limit: 10,
      date: null,
      dateOkName: "今天",
      dateOkIndex: 0,
      defaultIndex: 0,
      showDateSelector: false,
      dateName: "",
      tabs: [
        {
          k: "ALL",
          v: "全部",
          n: "全部"
        },
        {
          k: "FEE",
          v: "利息",
          n: "利息"
        },
        {
          k: "IN",
          v: "转入",
          n: "转入"
        },
        {
          k: "OUT",
          v: "转出",
          n: "转出"
        }
      ],
      text: {
        FEE: "利息",
        IN: "转入",
        OUT: "转出",
      },
      tabIndex: 0,
      list: [],
      animation: "slide-left",
      loading: false,
      noMore: false,
      clientHeight: 0,
      totalAmount : {
        fee: '0.00',
        in: '0.00',
        out: '0.00',
      },
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
    noDataImg(){
      if(this.$config.blackTheme || this.$config.newQP) {
        return require('@src/assets/img/yellow.png')
      } else if (this.$config.blush) {
        return require('@src/assets/img/blush.png')
      }else if (this.targetTheme && this.targetTheme['code']) {
        let  matchResult = this.targetTheme['code']
        return require(`@src/assets/img/${matchResult}.png`)
      } else {
        return require('@src/assets/img/no-data.png')
      }
    },
  },
  watch: {
    date() {
      this.page = 0;
      this.noMore = false;
      this.refreshList(true);
    },
    tabIndex(now, old) {
      if (now < old) {
        this.animation = "slide-right";
      } else {
        this.animation = "slide-left";
      }
      this.page = 0;
      this.noMore = false;
      this.$nextTick(() => {
        this.$refs["view-page"].refresh();
        this.refreshList(true);
      });
    }
  },
  created() {
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
      this.noMore = false;
      this.refreshList(true);
    },
    onPullingUp() {
      this.refreshList();
    },
    refreshList(status) {
      if (this.noMore) {
        this.$refs['view-page'].loaded()
      }else {
        this.loading = true
        this.toastLoading('加载中');
        this.page++;
      if (this.date && this.tab && this.tab.k) {
        this.$store
          .dispatch("user/yuebaoDetail", {
            type: this.tab.k,
            startTime: this.date.start,
            endTime: this.date.end,
            page: this.page,
            limit: this.limit
          })
          .then(data => {
            this.toastClear();
            this.loading = false
            this.$refs["view-page"].loaded();
            if (status) {
              this.list = data.data.list;
            } else {
              this.list = this.list.concat(data.data.list);
            }
            if (data.data.list.length == 0 && !status) {
              this.noData = true;
              if (data.message) {
              } else if (data.msg) {
                this.toastText(data.msg, "top");
              }
            }
            this.$refs["view-page"].loaded();
            this.refreshing = false;
            this.totalAmount = data.data.total_amount
          })
          .catch(() => {
            this.toastClear();
            this.loading = false
            this.$refs["view-page"].loaded();
            this.page--;
          });
      } else {
        this.list = [];
        this.$refs["view-page"].loaded();
      }
      }
    }
  }
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
.black-tab {
  /deep/ .van-tabs {
    .van-tabs__wrap{
        .van-tabs__nav {
            background: linear-gradient(0deg, #0C0C0C, #222222) !important;
            .van-tab {
                color: #fff;
            }
        }
        .van-tab--active {
            color: #F6CF32 !important;
        }
        .van-tabs__line {
            background-color: #F6CF32 !important;
        }
    }
    &::after {
        border-color: #242424 !important;
    }
  }
}
.blush-tab {
  /deep/ .van-tabs {
    .van-tabs__wrap{
        .van-tabs__nav {  
             background: linear-gradient(0deg, #6D000A, #7B010C)!important;
            .van-tab {
                color: #fff;
            }
        }
        .van-tab--active {
            color: #F6CF32 !important;
        }
        .van-tabs__line {
            background-color: #F6CF32 !important;
        }
    }
    &::after {
        border-color:#6D000A !important;
    }
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
    span {
      font-size: 0.34rem;
      padding: 0;
    }
  }
}

/deep/.van-tabs__nav--line {
  padding-bottom: 0.285rem;
}

.IN {
  color: #EB4343;
}

.OUT {
  color: #00A054;
}

.FEE {
  color: #FF9700;
}

.detail {
  .detail-item {
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
  .detail-item:last-child {
    &::after {
      content: "";
      border-bottom: 0;
    }
  }
  .detail-content {
    .animation-box {
      position: relative;
      left: 0;
      top: 0;
      width: 100%;

      .content-body {
        width: calc(100% - 0.32rem);
        margin: 0.24rem 0.16rem;
        > .detail-body {
          box-shadow: 0px 0.05rem 0.05rem 0px rgba(0, 0, 0, 0.03);
          border-radius: 0.1rem;
          width: 100%;
          overflow: hidden;
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
  }

  .font {
    transform: scale(1.24);
    transform-origin: right;
  }

  .card-time {
    color: rgb(153, 153, 153);
    flex: 1;
  }
  .card-amount {
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.28rem !important;
  }
  .list-empty {
    flex: 1;
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
    flex-direction: row-reverse;
    .item {
      font-size: 0.3rem;
      line-height: 0.9rem;
    }
  }
}
</style>
