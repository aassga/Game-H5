<template>
  <view-page
    full-box
    load-more
    @load-top="onPullingDown"
    @load-down="onPullingUp"
    ref="view-page"
    class="theme-header-bg"
  >
    <title-header title="借呗记录" slot="header" class="theme-main-bg theme-header-bottom" backEvent @back="$router.push('/user/JieBeiCenter')"></title-header>
    <div class="content-slot" slot="content">
      <div class="list" v-if="list.length">
        <div class="list-item theme-main-bg-5 theme-border-color" @click="goDetails(item,i)" v-for="(item,i) in list" :key="i">
          <div class="item-left">
            <p class="money theme-color-white">{{item.borrow_amount}}</p>
            <p class="time">{{ dayJs.unix(item.date).format('YYYY-MM-DD HH:mm') }}</p>
          </div>
          <div class="item-right">
            <span :class="['text',`code-${item.statusCode}`]">{{item.status}}</span>
            <i class="cell-icon van-icon van-icon-arrow van-cell__right-icon"></i>
          </div>
        </div>
      </div>
      <div v-else>
        <img style="width: 100%;margin-top: 1rem;" :src="noDataImg" alt />
        <p class="theme-color-white" style="font-size: 0.3rem;color: #666666">暂无记录</p>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "JieBeiRecord",
  data() {
    return {
      list: [],
      page: 0,
      limit: 10,
      noMore: false
    };
  },
  computed: {
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
  mounted() {
    this.refreshList();
  },
  methods: {
    goDetails(item,i) {
      if (Number(item.unpaid) === 0 && item.statusCode !== 2 && item.statusCode !== 0) {
        this.$router.push({
          path: "/user/JieBeiDetails",
          query: {
            type: 0,
            money: item.borrow_amount,
            index: i,
            statusCode: item.statusCode
          }
        });
      } else {
        this.$router.push({
          path: "/user/JieBeiDetails",
          query: {
            type: 1,
            unpaid: item.unpaid,
            money: item.borrow_amount,
            index: i,
            statusCode: item.statusCode,
            repayment: item.repayment
          }
        });
      }
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
      this.toastLoading("加载中");
      if (this.noMore) {
        this.$refs["view-page"].loaded();
        this.toastText("没有更多", "top");
      } else {
        this.page++;
        this.$store
          .dispatch("user/activityJiebeiJieHuanList", {
            page: this.page,
            limit: this.limit
          })
          .then(data => {
            this.toastClear();
            this.$refs["view-page"].loaded();
            if (status) {
              this.list = data.data.data;
            } else {
              this.list = this.list.concat(data.data.data);
            }
            localStorage.JieBeiRecord = JSON.stringify(this.list)
            if (data.data.data.length == 0 && !status) {
              this.noMore = true;
              if (data.message) {
              } else if (data.msg) {
                this.toastText(data.msg, "top");
              }
            }
            this.$refs["view-page"].loaded();
            this.refreshing = false;
          })
          .catch(() => {
            this.toastClear();
            this.$refs["view-page"].loaded();
            this.page--;
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.content-slot {
  width: 7rem;
  margin: 0 auto;
  .list {
    background: #fff;
    box-shadow: 0px 0.05rem 0.11rem rgba(0, 63, 112, 0.06);
    border-radius: 0.15rem;
    overflow: hidden;
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
          color: #4d8ffa;
        }
        .code-1 {
          color: #039141;
        }
        .code-2 {
          color: #ff0d0d;
        }
        .code-3 {
          color: #adafbb;
        }
      }
    }
  }
}
</style>
