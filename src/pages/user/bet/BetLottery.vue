<template>
  <view-page v-if="isValid" class="body theme-header-bg" full-box load-more ref="view-page" @load-top="onPullingDown" @load-down="onPullingUp" :noScroll="!!bet" :noMore='noMore'>
    <title-header :title="$route.query.status==='0'?'即时注单':!bet ? '彩票投注列表' :'彩票投注详情'" class="theme-header-bottom theme-header-bg header" @back="back" :back-event="true" slot="header">
      <span slot="right" class="header-right" @click="onCancelClick" v-if="bet&&bet['status']===0">撤单</span>
      <span slot="right" class="header-right" @click="onFilterClick" v-if="!bet">筛选</span>
    </title-header>

    <div slot="content" class="content">
      <transition-group :name="animation">
        <div class="animation-box" v-if="!bet" key="list">
          <div class="hr2 theme-header-bg"></div>
          <div v-if="!noData" class="list">
            <div class="item theme-main-bg" v-for="(item,i) in list" :key="item.id+'_'+i" @click="bet = item">
              <div class="item-head theme-after-border-color">
                <span class="name theme-color-white">{{item['lotteryName']}}</span>
                <span class="date-time">{{dayJs.unix(item['betTime']).format('YYYY-MM-DD HH:mm:ss')}}</span>
              </div>
              <div class="item-body">
                <span class="ball">
                  <i class="theme-color-white">{{item['playwayName']}}</i>
                  <i class="theme-color-white">{{item.ball?':':''}}</i>
                  <i class="theme-color-white">{{item.ball||''}}</i>

                  <i class="theme-color-white">{{item.ball?'-':':'}}</i>
                  <i class="code">{{item['betInfo']}}</i>
                </span>
                <span class="amount">{{item['betAmount']}}</span>
              </div>
              <div class="item-foot">
                <span class="issue" v-if="item['gameName']==='xglhc'">
                  第
                  {{item['issue'].toString().substr(4)}}
                  期
                </span>
                <span class="issue" v-else>
                  第
                  {{['xglhc', 'bjsc', 'bjpcdd', 'xyft'].includes(item['gameName'])?item['issue']:item['issue'].toString().substr(8)}}
                  期
                </span>
                <span :class="'status-'+item['status']">
                <i class="icon"></i>
              </span>
              </div>
              <span class="link-icon icon iconfont h5-icon-next"></span>
            </div>
          </div>

          <div v-else class="list-empty">
            <img class="img" :src="noDataImg" />
            <p class="info">暂无投注记录</p>
          </div>
        </div>
        <div class="animation-box" :key="bet.id" v-else>
          <ul class="bet" slot="content">
            <li class="row theme-main-bg" v-for="item in betKeys" :key="item.k" v-if="getBetItem(item)" :class="{'resultLine':item.k=='result' &&bet['lotteryId'] == 3630}">
              <span class="col-l tr">{{item.v}}</span>
              <span :class="{'col-r':true,'red':item.red,'green':item.green,'theme-color-white' : !item.red && !item.green}" v-html="getBetItem(item)" v-if="getBetItem(item)"></span>
            </li>
          </ul>
        </div>
      </transition-group>
    </div>

    <div v-if="list.length && !bet" class="record-footer theme-header-bg theme-noborder" slot="footer">
      <div class="item">
        <span class="theme-color-white">总投注:</span>
        <span style="color: #ff2200;"><span class="rmb">¥</span>{{total_bet}}</span>
      </div>
      <div class="item">
        <span class="theme-color-white">总输赢:</span>
        <span style="color: #ff2200;"><span class="rmb">¥</span>{{total_win==0?'0.00':Math.floor(total_win*100)/100}}</span>
      </div>
    </div>

    <van-popup slot="static"  v-model="showFilter" position="bottom" get-container="body"  :lazy-render="false" :overlay="false" >
      <van-picker :class="{'black-van-picker':$config.blackTheme || $config.newQP,'blush-van-picker':$config.blush}" show-toolbar  v-model="showFilter" :columns="gameList" :item-height="40" value-key="name" title="选择游戏" :confirm-button-text="'确定'"
                  @confirm="onPlayChange" @cancel="showFilter=false"></van-picker>
    </van-popup>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'BetLottery',
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
        { k: 'lotteryName', v: '彩种' },
        { k: 'issue', v: '期数' },
        { k: 'betAmount', v: '下注金额', red: true },
        { k: 'validBetAmount', v: '有效投注', red: true },
        { k: 'fdAmount', v: '会员返点'},
        { k: 'payoutAmount', v: '派彩', red: true },
        { k: 'betCount', v: '订单数量' },
        { k: 'playwayName', v: '玩法' },
        { k: 'betInfo', v: '下注内容' },
        { k: 'betTime', v: '下注时间', time: true },
        // { k: 'rebate', v: '返点值' },
        // { k: 'fdAmount', v: '返点金额' },
        { k: 'openTime', v: '结算时间', time: true, is: true },
        { k: 'result', v: '开奖结果' },
        { k: 'status', v: '状态', status: true }
      ],
      picker: null,
      noData: false,
      noMore: false,
      platform: '',
      limit: 10,
      page: 0,
      list: [],
      total_bet: '0.00',
      total_win: '0.00',
      refreshing: false,
      cancelling: false,
      gameList: [],
      showFilter: false
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
    isClosed(){
      return this.$store.state.main.closeMask
    },
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
    if (this.$route.query.code) {
      this.platform = this.$route.query.code
      this.onPullingDown()
    }
    if (this.personalMode === 'mode_b') {
      this.betKeys = [
        { k: 'billNo', v: '订单号' },
        { k: 'lotteryName', v: '彩种' },
        { k: 'issue', v: '期数' },
        { k: 'betAmount', v: '下注金额', red: true },
        { k: 'validBetAmount', v: '有效投注', red: true },
        { k: 'fdAmount', v: '会员返点'},
        { k: 'netAmount', v: '派彩', red: true },
        { k: 'betCount', v: '订单数量' },
        { k: 'playwayName', v: '玩法' },
        { k: 'betInfo', v: '下注内容' },
        { k: 'betTime', v: '下注时间', time: true },
        { k: 'openTime', v: '结算时间', time: true, is: true },
        { k: 'result', v: '开奖结果' },
        { k: 'status', v: '状态', status: true }
      ]
    }
  },
  mounted () {
    this.getList()
    this.$store.dispatch('main/getNewGame', {
        idIndex: 4,
        id: '30003',
        callback: baseRes => {
          if (baseRes['30003'] && baseRes['30003'].length) {
            let setId = {
              222 : 10006,
              223 : 10007,
              224 : 10008,
              225 : 10009,
              226 : 10010,
              227 : 10011,
              228 : 10012,
              229 : 10013,
            }
            const ids = baseRes['30003'].map(item => setId[item.id]).join('|')
            this.$store.dispatch('main/getNewGame', {
              idIndex: 4,
              id: ids,
              callback: res => {
                if (res) {
                  let list = [{ id: -1, name: '全部' }]
                  Object.keys(res).forEach(id => {
                    list = list.concat(res[id])
                  })
                  this.gameList = list
                } else {
                  this.gameList = []
                }
              }
            })
          }
        }
      })
  },
  watch:{
    showFilter(){
       this.$store.commit('main/isShowMask',{page:"betLottery",status:this.showFilter})
    },
    isClosed(){
      if(this.isClosed.page == 'betLottery'){
        this.showFilter  = this.isClosed.status
      }
    }
  },
  destroyed(){
    this.$store.commit('main/isShowMask',{page:"betLottery",status:this.showFilter})
  },
  methods: {
    onPlayChange (item) {
      if (item.id === -1) {
        this.platform = ''
      } else {
        this.platform = this.$store.state.main.gameSortV4Note.lottery[item.id]['code'] || ''
      }
      this.list = []
      this.showFilter = false
      this.onPullingDown()
    },
    onCancelClick () {
      if (this.bet && !this.cancelling) {
        this.cancelling = true
        this.$store.dispatch('user/cancelBet', {
          betTime: this.bet.betTime,
          recordId: this.bet.id
        }).then(res => {
          this.cancelling = false;
          if (typeof res.data === 'string') {
            this.toastText(res.data, 'top')
          } else if (typeof res.message === 'string') {
            this.toastText(res.message, 'top')
          }
          if (res.code === 200) {
            this.bet = null
            this.onPullingDown()
          }
        }).catch(err => {
          this.cancelling = false
        })
      }
    },
    getBetItem (item) {
      if (item.is && (!this.bet || !this.bet.status || this.bet.status === 4)) {
        return false
      } else if (item.time) {
        return this.dayJs.unix(this.bet[item.k]).format('YYYY-MM-DD HH:mm:ss')
      } else if (item.status) {
        if(this.bet[item.k] == 1){
          item.red = true;
        }else if(this.bet[item.k] ==0){
          item.green = true
        }
        return ['待开奖', '已中奖', '未中奖', '和', '已撤销','系统撤单'][this.bet[item.k]]
      } else if (item['k'] === 'issue') {
        if (this.bet['gameName'] === 'xglhc') {
          return this.bet[item.k].toString().substr(4)
        } else {
          return ['xglhc', 'bjsc', 'bjpcdd', 'xyft'].includes(this.bet['gameName']) ? this.bet[item.k] : this.bet[item.k].toString().substr(8)
        }
      }
      else if (item['k'] === 'betInfo') {
        if (this.bet['ball']) {
          return this.bet['ball'] + ' - ' + '<span style="color: red;">' + this.bet['betInfo'] + '</span>'
        } else {
          return '<span style="color: red;">' + this.bet['betInfo'] + '</span>'
        }
      }
      else if(item['k']=='validBetAmount'){
        if([1,2].includes(this.bet['status'])){
          return this.bet[item.k]
        }else return
      }
      else if(item['k'] === 'result'){
        if(this.bet['status']){
          if(this.bet['status']==5) return
          else this.bet[item.k]
        }
        if(this.bet['lotteryId'] == 3630 || this.bet['lotteryId'] == 13 ||  this.bet['lotteryId'] == 12){
          if(this.bet.result){
            if(this.bet.historyLotteryName){
              return  '<div class="result-css" style="font-size: 0.28rem !important;line-height: 0.35rem !important;">['+this.bet.historyLotteryName+']'+
              new Date(this.bet.historyOpenTime*1000).getFullYear()+'年'+ (parseInt(new Date(this.bet['historyOpenTime']*1000).getMonth())+1)+'月'+
              new Date(this.bet.historyOpenTime*1000).getDate()+'日 '+ this.bet.historyIssue.toString()+'期'+'<div class="result-css" ">' + this.bet['result'] + '</div>'
            }else if(this.bet.lotteryName){
              return  '<div class="result-css" style="font-size: 0.28rem !important;"><div class="result-css" ">' + this.bet['result'] + '</div>'
            }
          }else{
            return false
          }
        }else{
          return this.bet['result']
        }
      }else if(item['k'] === 'payoutAmount'){
        if(this.bet['status'] !== 2){
          return this.bet[item.k]
        }
      }else if(item['k'] === 'fdAmount'){
        if(this.bet['status'] !== 4 && Math.abs(this.bet[item.k])>0){
          return this.bet[item.k]
        }
      }
      else {
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
      this.page = 0
      this.getList(true)
    },
    onPullingUp () {
      this.getList()
    },
    onFilterClick () {
        this.showFilter = true
    },
    getList (status) {
      if (this.refreshing) {
      } else {
        this.refreshing = true
        this.page++
        const data = {
          date: this.date,
          type: this.type,
          platform: this.platform,
          limit: this.limit,
          page: this.page
        }
        if (this.$route.query.status) {
          data['status'] = this.$route.query.status
        }
        this.$store.dispatch('user/getRecordList', {
          data: data,
          callback: res => {
            if (res.code === 200 && res.data.data.list.length > 0) {
              this.noMore = false
              if(status){
                this.list = res.data.data.list;
              }else{
                this.list = this.list.concat(res.data.data.list)
              }
              this.total_bet = res.data.data.amount.total_bet
              this.total_win = res.data.data.amount.total_win
            }
             else if (res.message) {
               
              if(status){this.list = res.data.data.list;}
              this.toastText('没有更多数据','top')
              this.noMore = true
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
.black-van-picker {
    background: linear-gradient(0deg, #0B0B0B, #100F0F);
    /deep/ .van-picker__toolbar {
      .van-picker__cancel, .van-picker__title ,.van-picker__confirm{ 
        color: #fff !important;
      }
      &::after {
        border: none !important;
      }
    }
    /deep/ .van-picker__columns {
      background: linear-gradient(0deg, #0B0B0B, #100F0F);
      .van-picker-column__item {
        color: #fff;
      }
    }
    /deep/ .van-picker__mask {
      background: none;
    }
  }
  .blush-van-picker {
    background: linear-gradient(0deg, #530107, #7E010C);
    /deep/ .van-picker__toolbar {
      .van-picker__cancel, .van-picker__title ,.van-picker__confirm{ 
        color: #fff !important;
      }
    }
    /deep/ .van-picker__columns {
      background: linear-gradient(0deg, #530107, #7E010C);
      .van-picker-column__item {
        color: #fff;
      }
    }
    /deep/ .van-picker__mask {
      background: none;
    }
  }
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
          width: 5.2rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;
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
          height: 0.45rem;
          line-height: 0.45rem;
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

        padding: .18rem 0 .14rem 0;
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
        padding-left: 0.3rem;
        color: #888;
        white-space: nowrap;
      }

      .col-r {
        width: 75%;
        color: #424242;
        white-space: nowrap;
      }

      .tr {
        text-align: right;
      }

      .red {
        color: #ff2200;
      }
      .green{
        color:#09c205;
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
        height: 0.4rem;
        line-height: 0.4rem;
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
    .resultLine{
      height:0.8rem!important;
      display: flex !important;
      align-items: center;
      line-height: 0.55rem !important;
      .result-css{
        font-size: 0.28rem !important;
        line-height: 0.35rem !important;
      }
    }
  }
</style>
