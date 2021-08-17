<template>
  <view-page class="record"  full-box  ref="view-page" :position-style="positionStyle">
    <title-header title="投注记录" slot="header" backEvent @back='goBack' class="header"></title-header>
    <div class="record-header" slot="header-static">
      <date-interval v-model="dateIndex" :date.sync="date" default></date-interval>
      <div class="hr2"></div>
      <van-tabs v-model="tabIndex" class="record-tab" :line-height="2" :swipe-threshold="5">
        <van-tab v-for="item in showTabs" :key="item.k" :title="item.v"></van-tab>
      </van-tabs>
      <div class="hr2"></div>
      <ul class="record-table title clear-fix">
        <li class="item date">时间</li>
        <li class="item count">笔数</li>
        <li class="item money">下注金额</li>
        <li class="item win-or-lose">输赢</li>
      </ul>
    </div>
    <div class="record-content"  slot="content"  v-touch:left ="onSwipeLeft"  v-touch:right="onSwipeRight">
        <transition-group :name="animation" tag="p" class="animation-box">
            <div ref="solid" class="content-body" :key="'wrapper_' + tabIndex" style="width: 100%;">
              <ul class="record-table content clear-fix" v-for="(item, i) in list" :key="'item_' + i" @click="onClick(item)">
              <li class="item date detail-color">
                <p class="day">{{item.date.date}}</p>
                <p class="week">{{item.date['week']}}</p>
              </li>
              <li class="item count">{{item['bet_count']}}</li>
              <li class="item money">{{item['bet_amount']}}</li>
              <li class="item win-or-lose" :class="{'red':parseFloat(item['bet_win_amount'])>=0,'green':parseFloat(item['bet_win_amount'])<0}">{{item['bet_win_amount']}}</li>
            </ul>
          </div>
        </transition-group>
      </div>

    <div class="record-footer" slot="footer">
      <div class="item">
        <span>总投注:</span>
        <span style="color: #ff2200;"><span class="rmb">¥</span>{{total_bet}}</span>
      </div>
      <div class="item">
        <span>总输赢:</span>
        <span style="color:#ff2200"><span class="rmb">¥</span>{{total_win}}</span>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'Bet',
  data () {
    return {
      date: null,
      dateIndex: 0,
      tabs: [
        { k: 'lottery', v: '彩票' },
        { k: 'live', v: '视讯' },
        { k: 'slot', v: '电子' },
        { k: 'chess', v: '棋牌' },
        { k: 'sport', v: '体育' }],
      tabIndex: 0,
      list: [],
      total_bet: '0.00',
      total_win: '0.00',
      animation: 'slide-left',

    }
  },
  created () {
    this.checkList()
    this.tabs.forEach(item => {
      item.show = this.checkGameTypeShow(item.v)
    })
  },
  mounted () {
    if (!this.$store.state.user.token) {
      this.$router.replace('/admin/login')
    }
  },
  computed: {
    positionStyle(){
      //解决安卓小米position：fixed问题导致按钮错位问题
      if(this.$mobileDevice.isAndroid 
        && this.$mobileDevice.browserName === 'MIUI Browser'){
        return 'position:fixed;'
      }else{
        return 'position:fixed;'
      }
      
    },
    tab () {
      return this.showTabs[this.tabIndex]
    },
    showTabs () {
      // return this.tabs.filter(item => item.show)
      return this.tabs
    }
  },
  watch: {
    date: 'refreshList',
    // dateIndex:'refreshList',
    tabIndex (now, old) {
      if (now < old) {
        this.animation = 'slide-right'
      } else {
        this.animation = 'slide-left'
      }
      this.total_bet = '0.00'
      this.total_win = '0.00'
      this.list = []
      this.refreshList()
    }
  },
  methods: {
    goBack(){
      this.$router.push('/home');
    },
    checkList(){
      if(sessionStorage.getItem('params')){
        let params=JSON.parse(sessionStorage.getItem('params'))
        this.tabIndex=params.tabIndex
        this.dateIndex=params.dateIndex
        this.date=params.date
        this.refreshList()
        sessionStorage.clear()
      }
    },
    onSwipeLeft () {
      if (this.tabIndex + 1 < this.showTabs.length) {
        this.tabIndex++
      }
    },
    onSwipeRight () {
      if (this.tabIndex > 0) {
        this.tabIndex--
      }
    },
    onClick (item) {
      sessionStorage.clear()
      let params={
            date:this.date ,
            tabIndex:this.tabIndex,
            dateIndex:this.dateIndex
      }
      sessionStorage.setItem('params', JSON.stringify(params))
      this.$router.push(`/user/record/list/${this.showTabs[this.tabIndex].k}/${item.date.date}`)
    },
    refreshList () {
      this.$refs['view-page'].refresh()
      if (this.date && this.tab && this.tab.k) {
        this.$store.dispatch('user/getRecordSummary', {
          start: this.date.start,
          end: this.date.end,
          game: this.tab.k,
          callback: res => {
            if (res.code === 200) {
              this.total_bet = res.data.amount.total_bet
              this.total_win = res.data.amount.total_win
              this.list = res.data.list
              this.$refs['view-page'].loaded()
            } else {
              this.toastText(res.message, 'top')
            }
          }
        })
      } else {
        this.list = []
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  /deep/ .van-tab{
    color: #333333;

  }
  /deep/.van-tabs__nav{
    .van-tabs__line{
      width: 20%!important;
    }
  }
  .header{}
  .record {
    &-header {
      width: 100%;
    }
    .detail-color{
      color: #888888!important;
    }
    &-table {
      list-style: none;
      padding-right: 0.3rem;
      background-color: #fff;

      .item {
        display: inline-block;
        float: left;
        text-align: center;
        font-size: 0.28rem;

        &.date {
          width: 30%;
          color: #333333;
        }

        &.count {
          width: 20%;
          color: #333333;
        }

        &.money {
          width: 25%;
          color: #333333;
        }

        &.win-or-lose {
          width: 25%;
          color: #333333;
        }
        &.red {
          color: #E71414;
        }
        &.green {
          color: #00A054;
        }

      }

      &.title {
        // border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
        position: relative;
        ::before{
          position: absolute;
          box-sizing: border-box;
          content: ' ';
          pointer-events: none;
          right: 0;
          bottom: 0;
          left: 0;
          border-bottom: 0.02rem solid #ebedf0;
          -webkit-transform: scaleY(.45);
          transform: scaleY(.45);
        }
        background-color: #fff;

        li {
          line-height: 0.88rem;
        }
      }
      &.content {
        color: #888888;
        font-size: 0.28rem;
        line-height: 1rem;
        position: relative !important;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        &:before {
          content: '\E731';
          font-family: "iconfont", serif !important;
          font-style: normal !important;
          font-size: 0.44rem !important;
          line-height: 0.44rem !important;
          -webkit-font-smoothing: antialiased !important;
          color: #ADAFBB !important;
          display: block !important;
          height: 0.44rem !important;
          width: 0.44rem !important;
          position: absolute !important;
          right: 0.2rem;
          top: 50%;
          transform: translateY(-50%);
        }

        &:after {
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            right: 0;
            bottom: 0;
            // top: 0;
            left: 0.3rem;
            border-bottom: 0.03rem solid #ebedf0;
            -webkit-transform: scaleY(.5);
            transform: scaleY(.5);
            width: 100%;
        }
        &:last-child::after{
          content: '';
          border: 0;
        }
        .item {
          position: relative;
          &.date {
            .day {
              line-height: 0.6rem;
            }

            .week {
              line-height: 0.3rem;
              padding-bottom: 0.1rem;
            }
          }

        }
      }
    }
    &-content{
      .animation-box{
        position: relative;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }

    &-footer {
      background-color: #fff;
      height: 0.9rem;
      border-top: 0.02rem solid hsla(0, 0%, 95%, 1);
      display: flex;
      padding: 0 0.32rem;
      line-height: 0.9rem;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;

      .item {
        font-size: 0.3rem;
        line-height: 0.9rem;
      }
    }
  }
</style>
