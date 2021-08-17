<template>
  <view-page
    class="agent-center-modec"
    no-scroll
    :full-box="!isShowFixed"
    @scroll-height-change="height => {this.contentHeight = height}"
  >
    <div class="header" slot="header">
      <title-header
        class="title"
        backEvent
        @back="$router.push('/user/agency-center-modec')"
        title="领取记录"
      ></title-header>
    </div>
    <div slot="content" class="content">
      <div class="tab-view">
        <ul class="title-list theme-opacity10">
          <li class="title-list-item">
            <span>领取时间</span>
            <span>领取金额</span>
          </li>
        </ul>
        <list-view
          class="item-list user-list"
          ref="list"
          :style="{height:(contentHeight - 1.38 * rem)+'px'}"
          load-more
          @load-top="onRefresh"
          @load-down="loadList"
          :noMore="noMore"
        >
          <ul v-if="list.length">
            <li class="user-item" v-for="(user, i) in list" :key="i">
              <span>{{getTime(user.created_at)}}</span>
              <span>{{user.money}}</span>
            </li>
          </ul>
          <div v-else-if="noMore">
            <img style="width: 100%;margin-top: 1rem;" :src="noDataImg" alt />
            <p style="font-size: 0.3rem;color: #666666">暂无数据</p>
          </div>
        </list-view>
        <span :class="[{showReturnTop:showReturnTop},'returnTop','theme-bg']" @click="returnTop"></span>
      </div>
    </div>
  </view-page>
</template>

<script>
export default {
  data() {
    return {
      page: 0,
      loading: false,
      noMore: false,
      inited: false,
      contentHeight: 0,
      list: [],
      limit: 20,
      noData: true,
      showReturnTop: false,
    };
  },
  created() {
    this.loadList();
  },
  methods: {
    onRefresh() {
      this.page = 0;
      this.loading = false;
      this.noMore = false;
      this.loadList(true);
    },
    getTime (str) {
      let _str = str.replace(/\-/g, "/")
      let Timestamp = (Date.parse(new Date(_str))) / 1000
      return this.dayJs.unix(Timestamp).format('MM月DD日 HH:mm')
    },
    loadList(status) {
      if (this.noMore) {
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
            .dispatch("agency/CommissionDateil", {
              limit: this.limit,
              page: this.page,
              type: "commissionDetailTake",
              startTime: this.dayJs.unix(this.userInfo.created_at).format('YYYY-MM-DD'),
              endTime: this.dayJs().format('YYYY-MM-DD'),
            })
            .then(res => {
              this.loading = false;
              this.$refs.list.loaded();
              if (res.code === 200) {
                if (res.data.data.length) {
                  this.noData = false;
                  if (status) this.list = res.data.data;
                  else this.list = this.list.concat(res.data.data);
                  if (res.data.last_page === this.page) {
                    this.noMore = true;
                  }
                } else {
                  if (status) this.list = res.data.data;
                  this.noMore = true;
                }
              } else {
                this.$refs.list.loaded();
                this.page--;
                this.toastText(res.message, "top");
              }
            })
            .catch(err => {
              this.loading = false;
              this.$refs.list.loaded();
              this.page--;
            })
            .finally(() => {
              this.loading = false;
              this.$refs.list.loaded();
              this.$refs.list.refresh();
              if (this.page == 1) {
                this.toastClear();
              }
            });
        }
      }
    },
    returnTop() {
      this.$refs.list.scroll.scrollTo(0, 0, 200)
    }
  },
  components: {},
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
    isShowFixed() {
      return this.$store.state.main.keyBoardStatus;
    },
  },
  mounted() {
    document.body.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault(); // 阻止默认的处理方式(阻止下拉滑动的效果)
      },
      { passive: false }
    ); // passive 参数不能省略，用来兼容ios和android
    setTimeout(() => {
      this.$refs.list.scroll.probeType = 2
      this.$refs.list.scroll.on('scrollEnd', () => {
        if(this.$refs.list.scroll.y > -6 * this.rem) {
          this.showReturnTop = false
        }else {
          this.showReturnTop = true
        }
      });
    }, 1000);
  },
  watch: {}
};
</script>y

<style lang="less" scoped>
.header-right {
  position: absolute;
  right: 0.16rem;
  top: 0;
  font-size: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    color: #fff;
  }
}
.content {
  .tab-view {
    padding: 0.24rem 0.16rem;
    .title-list {
      width: 100%;
      height: 0.88rem;
      line-height: 0.88rem;
      border-radius: 0.1rem 0.1rem 0px 0px;
      .title-list-item {
        font-size: 0;
        span {
          display: inline-block;
          width: 50%;
          text-align: center;
          font-size: 0.28rem;
        }
      }
    }
    .item-list {
      position: relative;
      transition: all 0.2s;
      margin: 0 auto;
      box-sizing: border-box;
      background-color: #ffffff;
      border-radius: 0 0 .1rem 0.1rem;
      box-shadow:0px 5px 5px 0px rgba(0,0,0,0.03);
      .user-item {
        height: .88rem;
        line-height: .88rem;
        color: #444444;
        font-size: .28rem;
        border-bottom: .01rem solid #E7E7E7;
        & > span {
          display: inline-block;
          width: 50%;
          text-align: center;
        }
      }
    }
    .returnTop {
      position: fixed;
      bottom: -1.5rem;
      right: 0.3rem;
      width: 0.8rem;
      height: 0.8rem;
      background: url("../../../assets/img/game/new-game/return-top.png") no-repeat;
      background-size: contain;
      border-radius: 50%;
      transition: all 0.2s linear;
      &.showReturnTop {
        bottom: .5rem;
      }
    }
  }
}
</style>