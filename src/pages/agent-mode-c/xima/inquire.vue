<template>
  <view-page class="agent-center-modec" no-scroll
    :full-box="!isShowFixed"
    @scroll-height-change="height => {this.contentHeight = height}">
    <div class="header" slot="header">
      <title-header class="title" backEvent @back="$router.push('/user/agency-center-modec')" title="洗码查询">
        <div class="header-right">
          <span slot="header">
            <router-link to="/user/agency-center-modec/xm-desc">洗码说明</router-link>
          </span>
        </div>
      </title-header>
    </div>

    <div slot="content" class="content">
      <div class="title-desc">
        <img src="@src/assets/img/agent-center-modec/xima/title-desc.png" alt="">
        <span>由于注单延迟，自助洗码彩金会延迟统计</span>
      </div>
      <div class="search-box theme-agent-tab">
        打码总额:5500:00
        <router-link to="/user/agency-center-modec/xm-desc" class="link-btn theme-color">洗码说明</router-link>
      </div>
      <div class="table">
        <ul>
          <li class="title theme-opacity10">
            <div class="date">游戏平台</div>
            <div class="name">有效打码</div>
            <div class="bet">洗码比例</div>
            <div class="money">洗码金额</div>
          </li>
        </ul>
        <list-view
          class="item-list user-list"
          ref="list"
          :style="{height:(contentHeight - 4.1 * rem)+'px'}"
          load-more
          @load-top="onRefresh"
          @load-down="loadList"
          :noMore="noMore"
        >
          <ul v-if="list.length">
            <li class="user-item" v-for="(user, i) in list" :key="i">
              <span>{{dayJs.unix(formatDate(user.created_at)).format('MM月DD日 HH:mm')}}</span>
              <span>{{user.money}}</span>
            </li>
          </ul>
          <div v-else-if="noMore">
            <img style="width: 100%;margin-top: 1rem;" :src="noDataImg" alt />
            <p style="font-size: 0.3rem;color: #666666">暂无数据</p>
          </div>
        </list-view>
      </div>
      <div class="bottom-fixed">
        <div class="pull-left">
          <div class="monet-area">
            <span class="money-txt">
              洗码金额
            </span>
            <span class="money">
              999.99
            </span>
          </div>
          <div  class="time-area">
            上次结算：2019-02-21 19:06
          </div>
        </div>
        <div class="pull-right theme-bg">
          一键洗码
        </div>
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
      noData: true
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
              startTime: "2010-1-1",
              endTime: "2019-12-03"
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
    formatDate(date) {
      let Timestamp = (new Date(date).getTime()) / 1000
      return Timestamp
    }
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
    isShowFixed() {
      return this.$store.state.main.keyBoardStatus;
    }
  },
  mounted() {
    document.body.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault(); // 阻止默认的处理方式(阻止下拉滑动的效果)
      },
      { passive: false }
    ); // passive 参数不能省略，用来兼容ios和android
  },
  watch: {}
};
</script>

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
  padding: 0.24rem 0.16rem 0;
  .title-desc{
    width: 100%;
    height: .72rem;
    line-height: .72rem;
    background-color: #FFF0E6;
    border-radius: .1rem;
    font-size: .28rem;
    color: #FF7C5B;
    text-align: left;
    margin-bottom: .24rem;
    img {
      width: .36rem;
      height: .36rem;
      margin-left: .24rem;
      margin-right: .08rem;
      vertical-align: middle;
    }
  }
  .search-box {
    position: relative;
    width: 100%;
    height: 0.93rem;
    line-height: 0.93rem;
    color: #fff;
    font-size: 0.32rem;
    border-radius: 0.1rem;
    text-align: left;
    padding: 0 0.24rem;
    background-image: url('../../../assets/img/agent-center-modec/xima/search-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .link-btn {
      display: inline-block;
      width: 1.6rem;
      height: .56rem;
      line-height: .56rem;
      border-radius: .28rem;
      text-align: center;
      background-color: #fff;
      font-size: .28rem;
      margin-left: .8rem;
    }
  }
  .table {
    margin-top: .24rem;
    li {
      display: flex;
      height: 0.88rem;
      line-height: 0.88rem;
      & > div {
        flex: 1;
        font-size: 0.28rem;
        color: #444;
      }
      &.title {
        background-color: #e9f1fe;
        font-weight: bold;
        border-radius:.1rem .1rem 0 0;
      }
      &.list {
        font-weight: normal;
        background-color: #fff;
        border-bottom: 1px dashed #E7E7E7;
        &:last-child{
          border-bottom: none;
          border-radius:0 0 .1rem .1rem;
        }
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
  .bottom-fixed{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .96rem;
    overflow: hidden;
    background-color: #fff;
    .pull-left {
      width: 5rem;
      float: left;
    }
    .pull-right {
      float: right;
      width: 1.96rem;
      height: .96rem;
      line-height: .96rem;
      font-size: .32rem;
      color: #fff;
      background-color: #4D8FFA;
    }
  }
}
</style>