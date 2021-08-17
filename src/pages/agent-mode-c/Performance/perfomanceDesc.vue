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
        @back="$router.push('/user/agency-center-modec/performance')"
        :title="nameObject[game]['name']+typeObject[type] + '业绩'"
      ></title-header>
    </div>

    <div class="content-slot" slot="content">
      <div class="top-title">
        <span class="text" v-if="performanceData.most">每万元返佣{{performanceData.most.split('/')[0]}}</span>
        <div @click="goProportion" class="proportion">返佣比例</div>
      </div>
      <div class="header theme-agent-rebate">
        <div class="header-bg">
          <div class="left-area">
            <div class="total">统计时段:{{date.name}}</div>
            <div class="direct">{{type === 'under' ? '直营业绩' : '团队业绩'}}:{{type === 'under' ? performanceData.self : performanceData.agency }}</div>
          </div>
          <div class="right-area">
            <div class="agency">{{type === 'under' ? '返佣金额' : '团队返佣'}}:{{type === 'under' ? performanceData.directCommission : performanceData.rankCommission }}</div>
          </div>
        </div>
        <div class="bor-bot theme-bg"></div>
        <div class="bor-bot theme-bg"></div>
      </div>
      <div class="view-box search-box">
        <span class="search-icon icon iconfont h5-icon-sousuotubiao theme-color"></span>
        <input
          v-model="username"
          class="input"
          type="text"
          placeholder="输入帐号可进行筛选"
          @keyup.enter="onRefresh"
        />
        <span class="date" @click="showDateSelector" v-if="date.name === '上月' || date.name === '本月'">日期筛选</span>
        <span class="date-icon icon iconfont h5-icon-qushi-moreup" @click="showDateSelector"  v-if="date.name === '上月' || date.name === '本月'"></span>
      </div>
      <div class="tab-view">
        <div class="titleList theme-opacity10">
          <span class="title-list-item">下级帐号</span>
          <span class="title-list-item">计算日期</span>
          <span class="title-list-item">{{type === 'under' ? '自身打码' : '团队业绩'}}</span>
          <span class="title-list-item">{{type === 'under' ? '返佣金额' : '团队返佣'}}</span>
        </div>
        <list-view
          class="item-list view-box user-list"
          ref="list"
          :style="{height:(contentHeight-5.3*rem)+'px'}"
          load-more
          @load-top="onRefresh"
          @load-down="loadList"
          :noMore="noMore"
        >
          <ul v-if="list.length">
            <li class="user-item" v-for="(user, i) in list" :key="i">
              <span>{{user.userName}}</span>
              <span>{{dayJs.unix(user.addTime).format('MM-DD')}}</span>
              <span>{{type === 'under' ? user[`${nameObject[game]['type']}ResultsSelfFirst`] : user[`${nameObject[game]['type']}ResultsTeam`]}}</span>
              <span>{{type === 'under' ? user[`${nameObject[game]['type']}DirectCommission`] : user[`${nameObject[game]['type']}RankCommission`]}}</span>
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
      <modec-date-selector ref="modecDateSelector" @callFather="callFather"></modec-date-selector>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import ModecDateSelector from "../components/modec-date-selector/modecDateSelector";
export default {
  name: "direct",
  data() {
    return {
      username: "",
      page: 0,
      loading: false,
      noMore: false,
      inited: false,
      contentHeight: 0,
      list: [],
      limit: 20,
      noData: true,
      game: '',
      type: '',
      nameObject: {
        chess: {
          name: '棋牌',
          type: 'Chess'
        },
        live: {
          name: '视讯',
          type: 'Live',
        },
        slot: {
          name: '电子',
          type: 'Slot'
        },
        lottery: {
          name: '彩票',
          type: 'Lottery'
        },
      },
      typeObject: {
        under: '直推',
        jump: '代理'
      },
      calendarDate:'',
      performanceData: {},
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
  components:{
    ModecDateSelector
  },
  watch: {
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
  created() {
    this.game = this.$route.params.game
    this.type = this.$route.params.type
    if (JSON.stringify(this.$store.state.agentModec.PerformanceDate) === "{}") {
      this.date = {
        name: "今天",
        start: this.dayJs().format("YYYY-MM-DD"),
        end: this.dayJs().format("YYYY-MM-DD")
      };
    } else {
      this.date = this.$store.state.agentModec.PerformanceDate;
    }
    this.loadList(true);
    if (JSON.stringify(this.$store.state.agentModec.PerformanceDate) === "{}") {
      this.$store.dispatch('agentModec/agencyPerformanceLinesModeC',{
        startTime: this.date.start,
        endTime: this.date.end
      } ).then(res => {
        if (res && res.code === 200) {
          this.performanceData = res.data[this.game]
          this.$store.state.agentModec.PerformanceDate = res.data
        } else {
          this.toastText(res.message, 'top')
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      this.performanceData = this.$store.state.agentModec.PerformanceData[this.game]
    }
  },
  methods: {
    showDateSelector() {
      this.$refs.modecDateSelector.show = true;
    },
    onRefresh() {
      this.page = 0;
      this.loading = false;
      this.noMore = false;
      this.loadList(true);
    },
    callFather(date) {
      this.calendarDate = date
      this.onRefresh()
    },
    loadList(status) {
      if (this.noMore) {
        this.loading = false;
        this.$refs.list.loaded();
        this.toastText("没有更多", "top");
      } else {
        if (!this.loading) {
          this.page++;
          this.loading = true;
          const data = {
            type: this.type,
            gameType: this.game,
            limit: this.limit,
            startTime: this.calendarDate ? this.calendarDate : this.date.start,
            endTime: this.calendarDate ? this.calendarDate : this.date.end,
            page: this.page
          };
          this.username.length > 0 ? (data["username"] = this.username) : "";
          if (this.page == 1) {
            this.toastLoading("加载中");
          }
          this.$store
            .dispatch("agentModec/agencyPerformanceDetailsModeC", data)
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
    goProportion() {
      this.$router.push({path:'/user/agency-center-modec/performance/proportion',query: { game: this.game }})
    },
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
  overflow: hidden;
  .top-title {
    width: 7.18rem;
    height: 0.88rem;
    line-height: 0.88rem;
    background-color: #fff0e6;
    border-radius: 0.1rem;
    text-align: left;
    margin: 0 auto;
    border-radius: 0.1rem;
    font-size: 0;
    .text {
      padding-left: 0.24rem;
      color: #ff7c5b;
      font-size: 0.28rem;
      font-weight: 400;
    }
    .proportion {
      display: inline-block;
      width: 1.6rem;
      height: 0.56rem;
      line-height: 0.56rem;
      color: #fff;
      background-color: #ff9955;
      border-radius: 0.28rem;
      text-align: center;
      font-size: 0.28rem;
      margin-left: 1rem;
    }
  }
  .header {
    position: relative;
    width: 7.18rem;
    margin: 0.24rem auto;
    height: 1.58rem;
    color: #ffffff;
    font-size: 0.3rem;
    border-radius: 0.1rem;
    text-align: left;
    .header-bg {
      position: relative;
      width: 100%;
      height: 100%;
      background-image: url("../../../assets/img/agent-center-modec/Performance/Performance-top.png");
      background-size: 100% 100%;
      padding: 0.18rem 0 0 0.24rem;
      .left-area {
        float: left;
        width: 3.5rem;
        .total {
          height: 0.56rem;
          line-height: 0.56rem;
          margin-bottom: 0.18rem;
        }
      }
      .right-area {
        float: left;
        .agency {
          margin-top: 0.715rem;
        }
      }
    }
    .bor-bot {
      position: absolute;
      bottom: -0.1rem;
      height: 0.1rem;
      width: 7rem;
      left: 50%;
      margin-left: -3.5rem;
      border-radius: 0 0 1rem 1rem;
      opacity: 0.3;
      &:last-child {
        bottom: -0.2rem;
        width: 6.7rem;
        left: 45%;
        margin-left: -3rem;
        opacity: 0.1;
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

  .titleList {
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
      flex: 1;
      flex-shrink: 0;
      text-align: center;
      box-sizing: border-box;
      width: 100%;

      .can-order {
        padding-right: 0.3rem;
        position: relative;
        height: 0.28rem;
        display: inline-block;
        line-height: 0.28rem;

        &:before {
          font-size: 0.26rem;
          content: "\F009";
          position: absolute;
          right: 0;
          top: -0.03rem;
          display: inline-block;
          font: normal normal normal 14px/1 "vant-icon";
          text-rendering: auto;
          -webkit-font-smoothing: antialiased;
          transform: scale(0.8);
          height: 0.2rem;
        }

        &:after {
          font-size: 0.26rem;
          content: "\F007";
          position: absolute;
          right: 0;
          top: 0.08rem;
          display: inline-block;
          font: normal normal normal 14px/1 "vant-icon";
          text-rendering: auto;
          -webkit-font-smoothing: antialiased;
          transform: scale(0.8);
          height: 0.2rem;
        }
        &.can-order-asc {
          &:before {
            top: 0;
          }

          &:after {
            content: none;
            display: none;
          }
        }

        &.can-order-desc {
          &:before {
            content: none;
            display: none;
          }

          &:after {
            top: 0;
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
      span {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
    }
  }
}
</style>
