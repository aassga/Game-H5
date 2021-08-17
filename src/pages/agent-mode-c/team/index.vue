<template>
  <view-page
    ref="view-page"
    class="agent-team"
    no-scroll
    :full-box="!isShowFixed"
    @scroll-height-change="height => {this.contentHeight = height}"
  >
    <div class="header" slot="header">
      <title-header
        class="title"
        backEvent
        @back="$router.push('/user/agency-center-modec')"
        title="我的团队"
      ></title-header>
    </div>

    <div class="content-slot" slot="content">
      <ul class="header theme-agent-tab">
        <li class="item" v-for="(t,i) in titleInfo" :key="i">
          <div class="bmg">
            <p class="num">{{t.num}}</p>
            <p class="name">{{t.name}}</p>
          </div>
        </li>
      </ul>
      <div class="view-box search-box">
        <span class="search-icon icon iconfont h5-icon-sousuotubiao theme-color"></span>
        <input
          v-model="username"
          class="input"
          type="text"
          placeholder="输入帐号可进行筛选"
          @keyup.enter="onRefresh"
        />
        <span class="date" @click="showDateSelector=true">{{date&&date.name}}</span>
        <span class="date-icon icon iconfont h5-icon-qushi-moreup" @click="showDateSelector=true"></span>
      </div>
      <div class="tab-view">
        <ul class="title-list">
          <li
            class="title-list-item"
            :class="'title-list-item'+i"
            v-for="(item, i) in titleList"
            :key="i"
            @click="onOrderChange(item)"
          >
            <span
              :class="{
              'can-order': item.order,  
              'can-order-desc':item.code===targetOrderCode&&orderByDesc==='bigToSmall', 
              'can-order-asc':item.code===targetOrderCode&&orderByDesc==='smallToBig', 
              'can-order-nodata': noData
              }"
            >{{item.name}}</span>
          </li>
        </ul>
        <list-view
          class="item-list view-box user-list"
          style="padding: 0;min-height: calc(100vh - 500px); "
          ref="list"
          :style="{height:(contentHeight - 4.1 * rem)+'px'}"
          load-more
          @load-top="onRefresh"
          @load-down="loadList"
          :noMore="noMore"
        >
          <ul v-if="list.length">
            <li class="user-item" v-for="(user, i) in list" :key="i" @click="showUserInfo(user)">
              <span
                class="user-item-col"
                :class="'user-item-col'+i"
                v-for="(t, i) in titleList"
                :key="i"
              >{{user[t.code]}}</span>
            </li>
          </ul>
          <div v-else-if="noMore">
            <img style="width: 100%;margin-top: 1rem;" :src="noDataImg" alt />
            <p style="font-size: 0.3rem;color: #666666">暂无数据</p>
          </div>
        </list-view>
      </div>
    </div>
    <div slot="static">
      <agency-date-selector
        v-model="date"
        :show.sync="showDateSelector"
      ></agency-date-selector>
    </div>
    <div slot="static">
      <my-team-user-info ref="myTeamUser" :userData="userData"></my-team-user-info>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import AgencyDateSelector from "@src/components/agency-date-selector/AgencyDateSelector";
import MyTeamUserInfo from "../components/my-team-user-info/MyTeamUserInfo";
export default {
  name: "Team",
  components: { AgencyDateSelector, MyTeamUserInfo },
  props: {
    uid: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      titleInfo: [
        {
          name: "团队人数",
          num: "0"
        },
        {
          name: "直属总数",
          num: "0"
        },
        {
          name: "今日新增",
          num: "0"
        }
      ],
      titleList: [
        {
          name: "帐号",
          code: "userName",
          flex: 2
        },
        {
          name: "团队人数",
          code: "teamTotal",
          flex: 2
        },
        {
          name: "团队投注",
          code: "validBetAmount",
          order: true,
          flex: 3
        },
        {
          name: "团队充值",
          code: "depositAmount",
          order: true,
          color: true,
          flex: 3
        }
      ],
      username: "",
      showDateSelector: false,
      date: null,
      targetOrderCode: "default",
      orderByDesc: "bigTosmall",
      page: 0,
      loading: false,
      noMore: false,
      inited: false,
      contentHeight: 0,
      list: [],
      limit: 20,
      userData: {},
      noData: true,
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
    isShowFixed() {
      return this.$store.state.main.keyBoardStatus;
    }
  },
  watch: {
    date() {
      this.onRefresh();
      this.targetOrderCode = "default";
    },
    targetOrderCode() {
      this.onRefresh();
    },
    orderByDesc() {
      this.onRefresh();
    },
    username() {
      this.onRefresh()
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
  created() {},
  methods: {
    onOrderChange(item) {
      if (item.order) {
        if (this.targetOrderCode === item.code) {
          if (this.orderByDesc === 'bigToSmall') this.orderByDesc = 'smallToBig'
          else this.orderByDesc = 'bigToSmall'
        } else {
          this.targetOrderCode = item.code
          this.orderByDesc = 'bigToSmall'
        }
      }
    },
    onRefresh() {
      this.page = 0;
      this.loading = false;
      this.noMore = false;
      this.loadList(true);
    },
    loadList(status) {
      if (!this.date) return;
      if (this.noMore) {
        this.loading = false;
        this.$refs.list.loaded();
        this.toastText("没有更多", "top");
      } else {
        if (!this.loading) {
          this.page++;
          this.loading = true;
          const data = {
            limit: this.limit,
            sortName: this.targetOrderCode,
            sort: this.orderByDesc,
            time_start: this.date.start,
            time_end: this.date.end,
            page: this.page
          };
          this.username.length > 0 ? (data["userName"] = this.username) : "";
          if (this.uid && !isNaN(this.uid)) data.uid = this.uid;
          if (this.page == 1) {
            this.toastLoading("加载中");
          }
          this.$store
            .dispatch("agentModec/getMyTeam", {
              data
            })
            .then(res => {
              this.loading = false;
              this.$refs.list.loaded();
              if (res.code === 200) {
                if (res.data.data.length) {
                  this.noData = false
                  if (status) this.list = res.data.data;
                  else this.list = this.list.concat(res.data.data);
                  if (res.data.last_page === this.page) {
                    this.noMore = true;
                  }
                  let resAmount = res.data.amount;
                  this.titleInfo[0].num = resAmount.agencyTotal;
                  this.titleInfo[1].num = resAmount.totalOfDirect;
                  this.titleInfo[2].num = resAmount.todayAdd;
                } else {
                  if (status) this.list = res.data.data;
                  this.noMore = true;
                }
              } else {
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
    showUserInfo(item) {
      this.userData = item;
      this.$refs.myTeamUser.show = true;
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
.title-right {
  position: absolute;
  top: 0;
  right: 0.16rem;
  font-size: 0.3rem;
  color: #444444;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tab-view {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding-bottom: 0.16rem;

  .item-list {
    overflow: hidden;
  }
}
.agent-team {
  .header {
    width: 7.18rem;
    margin: 0 auto;
    height: 1.46rem;
    background-size: 100%;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    color: #ffffff;
    border-radius: 0.1rem;
    overflow: hidden;
    background-image: url("../../../assets/img/user/dot.png");
    background-size: 100% 100%;
    .item {
      width: 100%/3;
      height: 1.46rem;
      .bmg {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
        .name {
          font-size: 0.3rem;
          line-height: 0.42rem;
          margin-top: 0.08rem;
          text-align: center;
        }
        .num {
          font-size: 0.34rem;
          line-height: 0.48rem;
          text-align: center;
        }
      }
    }
  }
  .search-box {
    height: 0.88rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    .search-icon {
      width: 0.4rem;
      font-size: 0.38rem;
      height: 0.4rem;
      margin-right: 0.24rem;
    }

    .input {
      min-width: 0;
      flex: 1;
      font-size: 0.3rem;
      &:after {
        content: none !important;
      }
    }

    .date {
      color: #999999;
      font-size: 0.3rem;
    }

    .date-icon {
      color: #767676;
      font-size: 0.3rem;
      transform: rotateZ(180deg) scale(0.5);
    }
  }

  .title-list {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    background: rgba(44, 147, 255, 0.12);
    border-radius: 0.1rem 0.1rem 0 0;
    width: 7.18rem;
    margin: 0.24rem auto 0 auto;
    font-size: 0.28rem;
    color: #444444;
    height: 0.9rem;
    font-weight: 500;
    text-align: center;

    .title-list-item {
      flex-shrink: 0;
      text-align: center;
      box-sizing: border-box;
      width: 100%;

      .can-order {
        padding-right: 0.3rem;
        position: relative;
        display: inline-block;
        &:before {
          font-size: 0.26rem;
          content: "\E72B";
          position: absolute;
          right: 0;
          top: 0.03rem;
          display: inline-block;
          color: #999999;
          font: normal normal normal 10px/1 "iconfont";
          text-rendering: auto;
          -webkit-font-smoothing: antialiased;
          transform: scale(0.5);
          height: 0.2rem;
        }

        &:after {
          font-size: 0.26rem;
          // content: '\e688';
          content: "\E72B";
          position: absolute;
          // right: -0.07rem;
          // top: 0.06rem;
          right: 0;
          top: 0.15rem;
          color: #999999;
          display: inline-block;
          // font: normal normal normal 22px/1 "iconfont";
          font: normal normal normal 10px/1 "iconfont";
          text-rendering: auto;
          -webkit-font-smoothing: antialiased;
          transform: rotate(180deg) scale(0.5);
          // transform: scale(0.8);
          height: 0.2rem;
        }
        &.can-order-nodata {
          &:before {
            content: none;
            display: none;
          }

          &:after {
            content: none;
            display: none;
          }
        }
        &.can-order-asc {
          &:before {
            color: #4d8ffa;
          }

          &:after {
          }
        }

        &.can-order-desc {
          &:before {
          }

          &:after {
            color: #4d8ffa;
          }
        }
      }
    }
    .title-list-item0 {
      flex: 3 1 0%;
    }
    .title-list-item1 {
      flex: 2 1 0%;
    }
    .title-list-item2 {
      flex: 3 1 0%;
    }
    .title-list-item3 {
      flex: 3 1 0%;
    }
  }
  .user-list {
    margin-top: 0;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    padding: 0;
    width: 7.18rem;

    .user-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      font-size: 0.28rem;
      color: #444444;
      height: 0.88rem;
      line-height: 0.88rem;
      text-align: center;
      border-bottom: 0.01rem solid #e7e7e7;

      .user-item-col {
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.color {
          color: #e71414;
        }

        &.green {
          color: #00a054 !important;
        }
      }
      .user-item-col0 {
        flex: 3 1 0%;
      }
      .user-item-col1 {
        flex: 2 1 0%;
      }
      .user-item-col2 {
        flex: 3 1 0%;
      }
      .user-item-col3 {
        flex: 3 1 0%;
      }
    }
  }
}
</style>
