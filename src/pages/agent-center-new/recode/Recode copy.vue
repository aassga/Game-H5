<template>
  <view-page class="recode" ref="view-page" full-box @scroll-height-change="scrollHeight=$event" no-scroll>
    <title-header title="投注记录" slot="header">
       <div class="header-right" slot="right" @click="showDateSelector=true" v-show="!showSearch" >
        <span>{{date&&date.name}}</span>
        <span class="date-icon icon iconfont h5-icon-qushi-moreup"></span>
      </div>
    </title-header>
    <div slot="header-static" >
      <van-tabs v-model="tabIndex" :line-height="2" :swipe-threshold="5" @click="changeDateIndex = tabIndex">
        <van-tab v-for="(tab, i) in tabs" :key="i" :title="tab.name"></van-tab>
      </van-tabs>
    </div>
    <div class="record-content" slot="content" >
      <transition-group :name="animation" class="animation-box" tag="p" ref="animationBox">
        <div class="content-body" ref="solid" :key="'wrapper_' + tabIndex" >
          <div >
            <div v-for="(tab, i) in tabs" :key="i" :class="'tab_'+i" v-show="tabIndex == i">
              <div class="tab-view">
                  <div class="view-box search-row" v-show="showSearch">
                    <span class="search-icon icon iconfont h5-icon-sousuotubiao theme-color"></span>
                    <van-field v-model="username[i]" class="input" type="text" placeholder="输入帐号可进行筛选" clearable @blur="onSearch"></van-field>
                    <span class="date" @click="showDateSelector=true">{{date&&date.name}}</span>
                    <span class="date-icon icon iconfont h5-icon-qushi-moreup" @click="showDateSelector=true"></span>
                  </div>
                  <ul class="type-tab-list">
                    <li class="type-tab-item" :class="{'active theme-bg':j===typeIndex[i]}" @click="$set(typeIndex, i, j);$refs['swipeType'][i].swipeTo(j)"
                        v-for="(type, j) in (tab.type === 'LOTTERY' ? lotteryTypes : otherTypes.filter(t => t.name))" :key="j">{{type.name}}
                    </li>
                  </ul>
                  <div class="item-list">
                    <van-swipe @change="taJ=>changeIndex(taJ,i)" :show-indicators="false" :loop="false" ref="swipeType" >
                      <van-swipe-item v-for="(type, j) in (tab.type === 'LOTTERY' ? lotteryTypes : otherTypes.filter(t => t.name))" :key="j">
                        <list-view :ref="'list-' + i" class="list-view" style="padding: 0"
                                  :style="{height:showSearch?((scrollHeight-3.28*rem)+'px'):((scrollHeight-2.15*rem)+'px')}"
                                  load-more @load-top="onRefresh" @load-down="onLoadMore" :no-more="noMore[i]&&noMore[i][j]"
                                  @on-scroll-end="top => { goTopShow[i][j]=top; goTopShow=JSON.copyObj(goTopShow) }">
                          <div class="view-box" style="margin: 0 auto;border-top-left-radius: 0;border-top-right-radius: 0"
                              :style="{minHeight:showSearch?((scrollHeight-3.2*rem)+'px'):((scrollHeight-2.4*rem)+'px')}">
                            <ul style="margin-top: 0;padding: 0 0.24rem" v-if="list[i]&&list[i][j]&&list[i][j].length">
                              <li class="recode-item" :class="tab.type" @click="onItemClick(item)"
                                  v-for="(item, k) in list[i]?list[i][j]:[]" :key="k">
                                <div class="recode-item-col">
                                  <p class="info-row">
                                    <span class="user-name" v-if="user">{{item.lotteryName||(tab.type==='SPORT'?item.platform:item.gameName)}}</span>
                                    <span class="user-name" v-else>{{item.userName}}</span>
                                    <span class="bet">投注:{{item['validBetAmount']}}</span>
                                  </p>
                                  <p class="time">{{dayJs.unix(item.betTime).format('MM-DD HH:mm:ss')}}</p>
                                </div>
                                <div class="recode-item-col">
                                  <p class="commission" v-if=" item.status==1">
                                    <span class="commission-label"></span>
                                    <span class="commission-value">{{item['payoutAmount']}}</span>
                                  </p>
                                
                                  <span class="status-ball" :class="'status-ball-'+item['status']" v-if="tab.type === 'LOTTERY'">
                                  {{statusLottery[item['status']][0]}}
                                </span>
                                  <span class="status-ball" :class="'status-ball-'+item['status']" v-else>{{statusOther[item['status']][0]}}</span>
                                </div>
                              </li>
                            </ul>
                            <div v-else-if="noMore[i]&&noMore[i][j]">
                              <img style="width: 100%;margin-top: 1rem;" :src="noDataImg" alt/>
                              <p style="font-size: 0.3rem;color: #666666">暂无数据</p>
                            </div>
                          </div>
                        </list-view>
                        <button class="list-go-top qp-go-top-svg" :style="{backgroundImage: 'url(' + listGoImg + ')'}" v-show="goTopShow[i]&&goTopShow[i][j]&&goTopShow[i][j]<-5*1.52*rem"
                                @click="$refs['list-'+i][j].scroll.scrollTo(0,0,goTopShow[i][j]/-3)"></button>
                        <div v-if="amount[i]&&amount[i][j]" class="box-amount" >
                          <ul class="amount-report" v-if="from==='report'" :class="{'amount_right':typeIndex[i] ==3}">
                            <li class="amount-item">
                              <span class="item-label">投注:</span>
                              <span class="item-value" :class="{red:parseFloat(amount[i][j]['total_bet'])>=0,green:parseFloat(amount[i][j]['total_bet'])<0}">
                                    {{amount[i][j]['total_bet']||'0.00'}}
                                  </span>
                            </li>
                            <li class="amount-item" v-if="typeIndex[i] !== 3">
                              <span class="item-label">盈利:</span>
                              <span class="item-value" :class="{red:parseFloat(amount[i][j]['total_win'])>=0,green:parseFloat(amount[i][j]['total_win'])<0}">
                                    {{amount[i][j]['total_win']||'0.00'}}
                                  </span>
                            </li>
                          </ul>

                          <ul class="amount" v-else :class="{'amount_right':typeIndex[i] ==3}">
                            <li class="amount-item">
                              <span class="item-label">投注:</span>
                              <span class="item-value" :class="{red:parseFloat(amount[i][j]['total_bet'])>=0,green:parseFloat(amount[i][j]['total_bet'])<0}">
                                      {{amount[i][j]['total_bet']||'0.00'}}
                                    </span>
                            </li>
                            <!-- <li class="amount-item" v-if="typeIndex[i]!==3">
                              <span class="item-label">佣金:</span>
                              <span class="item-value"
                                  :class="{red:parseFloat(amount[i][j]['total_earnings'])>0,green:parseFloat(amount[i][j]['total_earnings'])<0}">
                                      {{amount[i][j]['total_earnings']||'0.00'}}
                                    </span>
                            </li> -->
                            <li class="amount-item" v-if="typeIndex[i] !==3">
                              <span class="item-label">盈利:</span>
                              <span class="item-value" :class="{red:parseFloat(amount[i][j]['total_win'])>=0,green:parseFloat(amount[i][j]['total_win'])<0}">
                                      {{amount[i][j]['total_win']||'0.00'}}
                                    </span>
                            </li>
                          </ul>
                        </div>
                      </van-swipe-item>
                    </van-swipe>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
    <div slot="static">
      <agency-date-selector v-model="date" :defaultIndex="defaultIndex" :changeDateIndex="changeDateIndex" :show.sync="showDateSelector"></agency-date-selector>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import AgencyDateSelector from '@src/components/agency-date-selector/AgencyDateSelector'

export default {
  name: 'Recode',
  components: {
    AgencyDateSelector
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
    },
    user: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      goTopShow: [],
      scrollHeight: 0,
      resetLoading:true,
      tabs: [],
      tabIndex:  0,
      animation:'slide-right',
      defaultIndex:0,
      listIndex: 0,
      showDateSelector: false,
      changeDateIndex:0,
      date: [null, null, null, null, null],
      username: ['', '', '', '', ''],
      lotteryTypes: [
        {
          name: '全部',
          status: ''
        },
        {
          name: '已中奖',
          status: 1
        },
        {
          name: '未中奖',
          status: 2
        },
        {
          name: '待开奖',
          status: 0
        }
      ],
      otherTypes: [
        {
          name: '全部',
          status: ''
        },
        {
          name: '赢',
          status: 1
        },
        {
          name: '输',
          status: 2
        },
        {
          name: '',
          status: ''
        }
      ],
      typeIndex: [],
      loading: [],
      noMore: [],
      tabChangeIndex:0,
      page: 0,
      limit: 20,
      showSearch:true,
      list:[],
      amount: [],
      statusLottery: [
        '待',
        '中',
        '未',
        '和',
        '撤',
        '撤'
      ],
      statusOther: [
        '待',
        '赢',
        '输',
        '和',
        '撤',
        '撤'
      ],
      defaultTabIndex: 0,
      filterDate:[
          {
            name: '今天',
            start: this.dayJs().format('YYYY-MM-DD'),
            end: this.dayJs().format('YYYY-MM-DD')
          },
          {
            name: '昨天',
            start: this.dayJs().subtract(1, 'd').format('YYYY-MM-DD'),
            end: this.dayJs().subtract(1, 'd').format('YYYY-MM-DD')
          },
          {
            name: '近7天',
            start: this.dayJs().subtract(7, 'd').format('YYYY-MM-DD'),
            end: this.dayJs().format('YYYY-MM-DD')
          },
          {
            name: '近30天',
            start: this.dayJs().subtract(30, 'd').format('YYYY-MM-DD'),
            end: this.dayJs().format('YYYY-MM-DD')
          },
          {
            name: '上月',
            start: this.dayJs().set('date', 1).subtract(1, 'month').format('YYYY-MM-DD'),
            end: this.dayJs().set('date', 1).subtract(1, 'd').format('YYYY-MM-DD')
          }
      ],
      tabCount:0,
    }
  },
  computed:{
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
    listGoImg() {
      if(this.$config.newQP || this.$config.blackTheme){
        return require('../../../assets/img/home/qp/qp-back-top.svg')
      }else if (this.targetTheme && this.targetTheme['code']) {
        let matchResult = this.targetTheme['code']
        return require(`../../../assets/img/agent-center-new/${matchResult}.png`)
      } else {
        return require('../../../assets/img/agent-center-new/default.png')
      }
    }
  },
  watch: {
    tabs () {
      this.tabs.forEach((item, i) => {
        if (item.type === 'LOTTERY') {
          this.noMore[i] = [false, false, false, false]
          this.loading[i] = [false, false, false, false]
          this.goTopShow[i] = [0, 0, 0, 0]
          this.list[i] = [[], [], [], []]
          this.typeIndex[i] = 0
          this.amount[i] = [{}, {}, {}, {}]
        } else {
          this.noMore[i] = [false, false, false]
          this.loading[i] = [false, false, false]
          this.goTopShow[i] = [0, 0, 0]
          this.list[i] = [[], [], []]
          this.typeIndex[i] = 0
          this.amount[i] = [{}, {}, {}]
        }

        if (item.type === this.type) this.tabIndex = this.defaultTabIndex = i
      })
    },
    date () {
      this.onRefresh()
    },
    tabIndex (val,old) {
      if(val<old){
        this.animation = 'slide-right'
      }else{
        this.animation = 'slide-left'
      }
      this.onRefresh()
      this.$nextTick(() => {

        this.goTopShow[this.tabIndex][this.typeIndex[this.tabIndex]] = 0
        this.goTopShow = JSON.copyObj(this.goTopShow)
        this.$refs['list-' + this.tabIndex][this.typeIndex[this.tabIndex]].scroll.scrollTo(0, 0, 0)
      })
      // if (this.typeIndex === 0) {
      //   this.onRefresh()
      // } else {
      //   this.typeIndex = 0
      //   this.$nextTick(() => {
      //     this.$refs['swipeType'][this.tabIndex].swipeTo(0, { immediate: true })
      //   })
      // }
    },
    tabChangeIndex(){
     this.defaultIndex = 0;
    },
    typeIndex:{
      handler(val,old){
        if(this.listIndex == val[this.tabIndex]){
          this.onRefresh()
        }
        this.$nextTick(() => {
          this.goTopShow[this.tabIndex][this.typeIndex[this.tabIndex]] = 0
          this.goTopShow = JSON.copyObj(this.goTopShow)
          this.$refs['list-' + this.tabIndex][this.typeIndex[this.tabIndex]].scroll.scrollTo(0, 0, 0)
        })
      },
      deep:true
    }
  },
  created () {
    if(this.$route.params.type){
      this.tabs.map((item,index)=> {if(item.type == this.$route.params.type){this.$forceUpdate();this.tabIndex =  index}})
    }
    if(this.$route.query.date){
      this.defaultIndex = +this.$route.query.date;
    }
    if(this.$route.matched[0].path =='/user/agency-center-new/recode/user/:user'){
      this.showSearch = false
    }

    // try {
    //   this.tabs = JSON.parse(localStorage.reportWin)
    // } catch (e) {
    //   this.tabs = []
    // }

    // const nowadays = this.dayJs().format('YYYY-MM-DD')
    // this.$store.dispatch('agency/AgencyProfit', {
    //   startTime: nowadays,
    //   endTime: nowadays
    // }).then(res => {
    //   if (res.code === 200) {
    //     this.tabs = res.data.data
    //     localStorage.reportWin = JSON.stringify(res.data.data)
    //   } else {
    //     this.toastText(res.message, 'top')
    //   }
    // }).catch(err => {
    //
    // })
    // console.log(this.tabs)

    this.tabs = [
      {
        name: '彩票',
        type: 'LOTTERY'
      },
      {
        name: '棋牌',
        type: 'CHESS'
      },
      {
        name: '视讯',
        type: 'LIVE'
      },
      {
        name: '电子',
        type: 'SLOT'
      },
      {
        name: '体育',
        type: 'SPORT'
      }
    ]

    if (this.user) this.username = [this.user, this.user, this.user, this.user, this.user]
  },
  methods: {
    onItemClick (item) {
      this.$store.state.agency.recodeItem = item
      this.$router.push('/user/agency-center-new/recode/info/' + this.tabs[this.tabIndex].type)
    },
    changeIndex(tabJ,i){
      this.$set(this.typeIndex, i,tabJ);this.listIndex = tabJ;
    },
    onSearch () {
      this.onRefresh()
    },
    onRefresh () {
      if (this.list[this.tabIndex] && this.date) {
        this.page = 0
        this.noMore[this.tabIndex][this.typeIndex[this.tabIndex]] = false
        this.loading[this.tabIndex][this.typeIndex[this.tabIndex]] = false
        this.loadMore(true)
      }
    },
    onLoadMore () {
      this.loadMore()
    },
    loadMore (status) {
      const tabIndex = this.tabIndex
      const typeIndex = this.typeIndex[tabIndex]
      if (!this.tabs.length) return
      if (this.noMore[tabIndex][typeIndex]) {
        this.loading[tabIndex][typeIndex] = false
        this.$refs['list-' + tabIndex][typeIndex].loaded()
        this.toastText('没有更多', 'top')
      } else if (!this.loading[tabIndex][typeIndex]) {
        this.page++
        this.loading[tabIndex][typeIndex] = true
        const data = {
          gameType: this.tabs[tabIndex].type,
          time_start: this.date.start || this.filterDate[0].start,
          time_end: this.date.end || this.filterDate[0].end,
          limit: this.limit,
          page: this.page
        }
        if (this.tabs[tabIndex].type === 'LOTTERY') {
          if (this.lotteryTypes[typeIndex].status.toString().length) data.status = this.lotteryTypes[typeIndex].status
        } else {
          if (this.otherTypes[typeIndex].status.toString().length) data.status = this.otherTypes[typeIndex].status
        }

        if (this.username[tabIndex]) data.userName = this.username[tabIndex]

        if (this.user) data.queryType = 1
        let self = this;
        this.$store.dispatch('agency/agencyGameRecords', data).then(res => {
          this.loading[tabIndex][typeIndex] = false
          this.$refs['list-' + tabIndex][typeIndex].loaded()
          if (res.code === 200) {
            if (res.data && res.data.data && res.data.data.length) {
              if (status) {
                 this.$forceUpdate();this.$set(this.list[tabIndex], typeIndex, res.data.data)
                if(res.data.data.length===0){
                  this.noDataImg = `../../../assets/img/${this.targetTheme['code']}.png`
                }
              } else {
                this.list[tabIndex][typeIndex] = this.list[tabIndex][typeIndex].concat(res.data.data)
              }
              this.amount[tabIndex][typeIndex] = res.data.amount
            } else {
              if (status) {this.list[tabIndex][typeIndex] = [];this.amount[tabIndex][typeIndex] = res.data.amount;}
              this.noMore[tabIndex][typeIndex] = true
            }

            this.list = JSON.copyObj(this.list)
          } else {
            this.toastText(res.message, 'top')
            this.page--
          }
        }).catch(err => {
          this.page--
          this.loading[tabIndex][typeIndex] = false
          this.$refs['list-' + tabIndex][typeIndex].loaded()
        })
      } else if (this.loading[tabIndex][typeIndex]) {
        this.toastText('正在加载', 'top')
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>

/deep/.vux-swiper{
  height:calc(100vh - 90px)!important;
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
      transform: scale(0.5) rotateZ(180deg);
      color: #ffffff;
    }
  }



  .recode {
    .record-content{
      .animation-box{
        position: relative;
        left: 0;
        top: 0;
        width: 100%;
        .content-body{
          width: 100%;
        }
      } 
    }
    .search-row {
      height: 0.9rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;

      &.only-date {
        width: 1.9rem;
        padding: 0 0.16rem;
        justify-content: flex-end;
        margin-left: 5.44rem;
        height: 0.72rem;
      }

      .search-icon {
        font-size: 0.38rem;
        margin-right: 0.24rem;
      }

      .input {
        min-width: 0;
        flex: 1;

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

    .tab-view {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-wrap: nowrap;
      padding-bottom: 0.16rem;

      .item-list {
        flex: 1;
        overflow: hidden;
      }
    }

    .list-view {
      width: 100%;
      margin-top: 0;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      overflow: hidden;
    }

    .type-tab-list {
      border-top-left-radius: 0.1rem;
      border-top-right-radius: 0.1rem;
      background-color: #ffffff;
      font-size: 0.3rem;
      color: #666666;
      border-bottom: 0.02rem solid #E7E7E7;
      width: 7.18rem;
      margin: 0.24rem auto 0;
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      height: 0.9rem;
      text-align: center;
      flex-wrap: nowrap;
      overflow: hidden;

      .type-tab-item {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        width:0.9rem;
        font-size:0.3rem;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        color:rgba(102,102,102,1);
        &.active {
          font-size: 0.32rem;
          font-weight: 500;
          color: #ffffff;
          background-color: #2C93FF;
        }
      }
    }

    .list-go-top {
      position: absolute;
      right: 0.22rem;
      bottom: 2rem;
      width: 1rem;
      height: 1rem;
      // background: url("../../../assets/img/agent-center-new/go-top.png") no-repeat 0 0;
      background-size: 100%;
    }

    .recode-item {
      height: 1.54rem;
      padding: 0.32rem 0 0.24rem 0;
      display: flex;
      justify-content: stretch;
      align-items: stretch;
      // border-bottom: 0.02rem solid #E7E7E7;
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

      &:last-child {
        border-bottom: none;
      }

      .recode-item-col {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;

        &:first-child {
          flex: 0.64;
          text-align: left;
          align-items: flex-start;
        }

        &:last-child {
          flex: 0.36;
          text-align: right;
          align-items: flex-end;
        }

        .commission {
          display: flex;
          color: #E71414;
          margin-bottom: 0.16rem;
          justify-content: flex-end;

          .commission-label {
            font-size: 0.28rem;
            line-height: 0.4rem;
            margin-right: 0.1rem;
          }

          .commission-value {
            font-size: 0.3rem;
            line-height: 0.42rem;
          }
        }

        .status-ball {
          width: 0.4rem;
          height: 0.4rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.24rem;
          border-radius: 50%;
          border: 0.02rem solid #A3A3A3;
          color: #A3A3A3;
          flex-shrink: 0;

          &.status-ball-0 {
            color: #FF9700;
            border-color: #FF9700;
          }

          &.status-ball-1 {
            color: #E71414;
            border-color: #E71414;
          }

          &.status-ball-2 {
            color: #00A054;
            border-color: #00A054;
          }

          &.status-ball-3 {
            color: #722DF0;
            border-color: #722DF0;
          }

          &.status-ball-4 {
            color: #A3A3A3;
            border-color: #A3A3A3;
          }

          &.status-ball-5 {
            color: #A3A3A3;
            border-color: #A3A3A3;
          }
        }

        .info-row {
          display: flex;
          width: 100%;
          justify-content: flex-start;
          align-items: center;

          .user-name {
            font-size: 0.32rem;
            color: #444444;
            margin-right: 0.1rem;
            line-height: 0.42rem;
          }

          .bet {
            font-size: 0.24rem;
            color: #999999;
            line-height: 0.33rem;
          }
        }

        .time {
          font-size: 0.28rem;
          color: #999999;
          line-height: 0.4rem;
          margin-top: 0.16rem;
        }
      }
    }

    .amount-report {
      width: 100%;
      height: 0.9rem;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      padding: 0 0.32rem;
      background-color: #ffffff;
      .amount-item {
        display: flex;
        align-items: center;

        &:first-child {
          justify-content: flex-start;
        }

        &:last-child {
          justify-content: flex-end;
        }

        .item-label {
          font-size: 0.3rem;
          line-height: 0.42rem;
          color: #444444;
          margin-right: 0.1rem;
        }

        .item-value {
          font-size: 0.32rem;
          line-height: 0.45rem;
          color: #444444;
        }

        .red {
          color: #E71414;
        }

        .green {
          color: #00A054;
        }
      }
    }
    .box-amount{
      box-shadow:0px -6px 5px 0px rgba(0,0,0,0.03);
      position: relative;
      .amount {
        width: 100%;
        height: 0.98rem;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.16rem 0.2rem;
        background-color: #ffffff;


        .amount-item {
          /*width: 100%;*/
          /*flex: 1;*/
          display: flex;
          align-items: center;

          .item-label {
            font-size: 0.3rem;
            line-height: 0.42rem;
            color: #444444;
          }

          .item-value {
            font-size: 0.32rem;
            line-height: 0.45rem;
            color: #E71414;
          }

          .red {
            color: #E71414;
          }

          .green {
            color: #00A054;
          }
        }
      }
      .amount_right{
        justify-content: flex-end!important;
      }
    }
    .amount_right{
      justify-content:flex-end!important;
    }
  }
</style>
