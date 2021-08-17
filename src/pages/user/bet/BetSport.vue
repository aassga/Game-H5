<template>
  <view-page v-if="isValid" class="body" full-box load-more ref="view-page" @load-top="onPullingDown" @load-down="onPullingUp">
    <title-header :title="!bet?'体育投注列表':'体育投注列表'" class="header" slot="header" @back="back" :back-event="true">
      <span slot="right" class="header-right" @click="onFilterClick" v-if="!bet">筛选</span>
    </title-header>

    <div slot="content">
      <transition-group :name="animation">
        <div class="animation-box" key="list" v-if="!bet">
          <div class="hr2"></div>
          <div v-if="!noData" class="list">
            <div class="item" v-for="(item,i) in list" :key="item.id+'_'+i" @click="bet = item">
              <div class="item-head">
                <span class="name">{{item['platform']}}</span>
                <span class="date-time">{{dayJs.unix(item['betTime']).format('YYYY-MM-DD HH:mm:ss')}}</span>
              </div>
              <div class="item-body">
                <span class="ball"><span>{{item['gameName']}}</span></span>
                <span class="amount">{{item['betAmount']}}</span>
              </div>
              <div class="item-foot">
                <span class="issue">{{item['billNo']}}</span>
                <span :class="'status-'+item['status']"><i class="icon"></i></span>
              </div>
              <span class="link-icon icon iconfont h5-icon-next"></span>
            </div>
          </div>

          <div v-else class="list-empty">
            <div class="img"></div>
            <p class="info">暂无投注记录</p>
          </div>
        </div>
        <div class="animation-box" :key="bet.billNo" v-else>
          <ul class="bet">
            <li class="row" v-for="item in betKeys" :key="item.k">
              <span class="col-l tr">{{item.v}}</span>
              <span :class="{'col-r':true,'red':item.red}">{{getBetItem(item)}}</span>
            </li>
          </ul>
        </div>
      </transition-group>
    </div>

    <div v-if="list.length && !bet" class="record-footer" slot="footer">
      <div class="item">
        <span>总投注:</span>
        <span style="color: #ff2200;"><span class="rmb">¥</span>{{total_bet}}</span>
      </div>
      <div class="item">
        <span>总输赢:</span>
        <span style="color: #ff2200;"><span class="rmb">¥</span>{{total_win}}</span>
      </div>
    </div>

    <van-popup slot="static" v-model="showFilter" position="bottom" get-container="body" :lazy-render="false">
      <van-picker show-toolbar v-model="showFilter" :columns="gameList" :item-height="40" value-key="name" title="选择游戏" :confirm-button-text="'确定'"
                  @confirm="onPlayChange" @cancel="showFilter=false"></van-picker>
    </van-popup>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'BetSport',
  props: {
    date: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      bet: null,
      betKeys: [
        { k: 'billNo', v: '订单号' },
        { k: 'platform', v: '游戏名称' },
        { k: 'betAmount', v: '下注金额', red: true },
        { k: 'validBetAmount', v: '有效投注', red: true },
        { k: 'netAmount', v: '派彩', red: true },
        { k: 'gameName', v: '玩法' },
        { k: 'betTime', v: '下注时间', time: true },
        { k: 'status', v: '状态', status: true }
      ],
      picker: null,
      noData: false,
      platform: '',
      limit: 10,
      page: 0,
      list: [],
      total_bet: '0.00',
      total_win: '0.00',
      refreshing: false,
      gameList: [],
      showFilter: false
    }
  },
  computed: {
    isValid () {
      return this.dayJs(this.date).isValid()
    },
    animation () {
      return this.bet ? 'slide-left' : 'slide-right'
    }
  },
  created () {
    if (!this.isValid) {
      this.toastText('参数错误:无效的日期', 'top')
      this.$router.back()
    }
  },
  mounted () {
    this.getList()

    this.$store.dispatch('main/gameSort', {
      id: '10002',
      callback: res => {
        if (res) {
          let list = [{ id: -1, name: '全部' }]
          Object.keys(res).forEach(id => {
            list = list.concat(res[id])
          })
          this.gameList = list
        }
      }
    })
  },
  methods: {
    onPlayChange (item) {
      if (item.id === -1) {
        this.platform = ''
      } else {
        this.platform = item.code || ''
      }
      this.showFilter = false
      this.onPullingDown()
    },
    getBetItem (item) {
      if (item.time) {
        return this.dayJs.unix(this.bet[item.k]).format('YYYY-MM-DD HH:mm:ss')
      } else if (item.status) {
        return ['待开奖', '已中奖', '未中奖'][this.bet[item.k]]
      } else {
        return this.bet[item.k]
      }
    },
    back () {
      if (this.bet) {
        this.bet = null
      } else {
        this.$router.back()
      }
    },
    onPullingDown () {
      this.list = []
      this.page = 0
      this.getList()
    },
    onPullingUp () {
      this.getList()
    },
    onFilterClick () {
      this.showFilter = true
    },
    getList () {
      if (this.refreshing) {
      } else {
        this.refreshing = true
        this.page++
        this.$store.dispatch('user/getRecordList', {
          data: {
            date: this.date,
            type: this.type,
            platform: this.platform,
            limit: this.limit,
            page: this.page
          },
          callback: res => {
            if (res.code === 200 && res.data.data.list.length >0) {
              this.list = this.list.concat(res.data.data.list)
              this.total_bet = res.data.data.amount.total_bet
              this.total_win = res.data.data.amount.total_win
            } else if (res.message) {
              this.toastText('没有更多数据','top')
            } else if (res.msg) {
              this.toastText(res.msg, 'top')
            }
            this.$refs['view-page'].loaded()
            this.refreshing = false
            this.noData = !this.list.length
          },
          error: res => {
            this.toastText('获取数据失败', 'top')
            this.page--
            this.$refs['view-page'].loaded()
            this.refreshing = false
            this.noData = false
          }
        })
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .header-right {
    position: absolute;
    right: 0.2rem;
    top: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.3rem;
  }

  .body {

    .animation-box {
      width: 100%;
    }

    .slide-right-leave-active.animation-box {
      position: absolute;
      left: 0;
      top: 0;
    }

    .list {
      .item {
        width: 100%;
        margin-bottom: 0.2rem;
        padding: 0 0.45rem 0 0.3rem;
        position: relative;
        box-sizing: border-box;
        background-color: #fff;
        margin-top: 0.2rem;

        &:first-child {
          margin-top: 0;
        }

        &-head, &-body, &-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .name {
            font-size: 0.32rem;
            color: #555;
          }

          .date-time {
            font-size: 0.24rem;
            color: #aaa
          }

          .ball {
            font-size: 0.28rem;
          }

          .amount {
            font-size: 0.28rem;
            color: #ff2200;
          }

          .code {
            flex: 1;
            font-size: 0.28rem;
            color: #ff2200;
          }

          .issue {
            font-size: 0.28rem;
            color: #888
          }

          .issue {
            font-size: 0.28rem;
            color: #888;
            line-height: 0.4rem;
          }

          .status-1, .status-2 {
            color: #888;
            font-size: 0.28rem;

            .icon {
              font-size: 0.4rem;
              transform: translateY(10%);
            }

            .status {
              line-height: 0.4rem;
            }
          }

          .status-1 {
            color: #ff2200;
          }
        }

        &-head {
          height: 0.76rem;
          line-height: 0.76rem;
          position: relative;
          // border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
          position: relative;
          &::after{
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            right: 0;
            bottom: 0;
            left: 0;
            border-bottom: 0.02rem solid #ebedf0;
            -webkit-transform: scaleY(.5);
            transform: scaleY(.5);
          }
        }

        &-body {
          padding: .28rem 0 .14rem 0;
        }

        &-foot {
          padding-bottom: 0.18rem;
          line-height: 0.28rem;
          font-size: 0.28rem;
        }

        .link-icon {
          position: absolute;
          display: block;
          color: #c7c7cb;
          right: 0.04rem;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }

    .list-empty {
      flex: 1;
      width: 100vw;
      margin-top: 1.6rem;

      .img {
        width: 100vw;
        height: 35.7333333vw;
        background-image: url("../../../assets/img/no-data.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }

      .info {
        line-height: 1rem;
        color: #777;
        font-size: 0.28rem;
      }
    }

    .record-footer {
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

    .bet {
      width: 100%;
      flex: 1;

      .row {
        display: block;
        height: 0.7rem;
        line-height: 0.7rem;
        text-align: left;
        font-size: 0.28rem;

        &:after {
          content: '';
          display: table;
          clear: both;
          zoom: 1;
        }

        &:nth-of-type(2n-1) {
          background-color: #fff;
        }

        .col-l, .col-r {
          display: block;
          box-sizing: border-box;
          float: left;
          width: 25%;
          padding-left: 0.36rem;
          color: #888;
          white-space: nowrap;
        }

        .col-r {
          width: 75%;
          color: #424242;
          white-space: nowrap;
        }

        .red {
          color: #ff2200;
        }

        .tr {
          text-align: right;
        }
      }
    }

    span {
      &.status-0 {
        .icon {
          margin-top: -0.04rem;
          display: inline-block;
          width: 0.349rem;
          height: 0.349rem;
          vertical-align: middle;
          margin-right: 0.1rem;
          background-size: contain;
          background-image: url("../../../assets/img/user/bet/status-wait.png");
          position: relative;
          background-repeat: no-repeat;
          top: -0.04rem;
        }

        &::after {
          content: "待开奖";
          color: #09c205;
          line-height: 0.349rem;
          display: inline-block;
          height: 0.349rem;
        }
      }

      &.status-1 {
        .icon {
          margin-top: -0.04rem;
          display: inline-block;
          width: 0.349rem;
          height: 0.349rem;
          vertical-align: middle;
          margin-right: 0.1rem;
          background-size: contain;
          background-image: url("../../../assets/img/user/bet/status-success.png");
          position: relative;
          background-repeat: no-repeat;
          top: -0.04rem;
        }

        &::after {
          content: "已中奖";
          color: #ff2200;
          line-height: 0.349rem;
          display: inline-block;
          height: 0.349rem;
        }
      }

      &.status-2 {
        .icon {
          margin-top: -0.04rem;
          display: inline-block;
          width: 0.349rem;
          height: 0.349rem;
          vertical-align: middle;
          margin-right: 0.1rem;
          background-size: contain;
          background-image: url("../../../assets/img/user/bet/status-false.png");
          position: relative;
          background-repeat: no-repeat;
          top: -0.04rem;
        }

        &::after {
          content: "未中奖";
          color: #888888;
          line-height: 0.349rem;
          display: inline-block;
          height: 0.349rem;
        }
      }

      &.status-3 {
        .icon {
          margin-top: -0.04rem;
          display: inline-block;
          width: 0.349rem;
          height: 0.349rem;
          vertical-align: middle;
          margin-right: 0.1rem;
          background-size: contain;
          background-image: url("../../../assets/img/user/bet/he.png");
          position: relative;
          background-repeat: no-repeat;
          top: -0.04rem;
        }

        &::after {
          content: "和";
          color: #888888;
          line-height: 0.349rem;
          display: inline-block;
          height: 0.349rem;
        }
      }

      &.status-4 {
        .icon {
          margin-top: -0.04rem;
          display: inline-block;
          width: 0.349rem;
          height: 0.349rem;
          vertical-align: middle;
          margin-right: 0.1rem;
          background-size: contain;
          background-image: url("../../../assets/img/user/bet/quxiaio.png");
          position: relative;
          background-repeat: no-repeat;
          top: -0.04rem;
        }

        &::after {
          content: "已撤销";
          color: #888888;
          line-height: 0.349rem;
          display: inline-block;
          height: 0.349rem;
        }
      }

      &.status-5 {
        .icon {
          margin-top: -0.04rem;
          display: inline-block;
          width: 0.349rem;
          height: 0.349rem;
          vertical-align: middle;
          margin-right: 0.1rem;
          background-size: contain;
          background-image: url("../../../assets/img/user/bet/cancel.png");
          position: relative;
          background-repeat: no-repeat;
          top: -0.04rem;
        }

        &::after {
          content: "系统撤销";
          color: #09c205;
          line-height: 0.349rem;
          display: inline-block;
          height: 0.349rem;
        }
      }
    }
  }
</style>
