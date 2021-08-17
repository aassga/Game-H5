<template>
  <view-page class="agent-report theme-header-bg" ref="view-page" full-box :no-scroll="noScroll" @scroll-height-change="scrollHeight=$event" >
    <title-header v-if='tabIndex!= 2' class="theme-main-bg theme-header-bottom" title="财务报表" slot="header" backEvent @back="$router.push('/user/agency-center-new')" ></title-header>
    <title-header v-else class="agent-take-title-header theme-main-bg theme-header-bottom" title="财务报表" slot="header" backEvent @back="$router.push('/user/agency-center-new')" >
      <span class="header-right" slot="right"><i class="text" @click="showFilter = true">{{targetDate.name}}</i><i class="icon iconfont h5-icon-qushi-moreup"></i></span>
    </title-header>
    <div class="content-slot theme-header-bg" slot="header-static">
      <div class="theme-agent-tab header  theme-yellow-bg-6">
        <ul class="header-main theme-color-black">
        <li class="item" @click="tabChange(0)" :class="{'theme-agent-tab-active':tabIndex===0}">
          <div class="bmg" :class="{'active  theme-yellow-bg-2':tabIndex===0}">
            <p class="money">{{teamBalance||'0.00'}}</p>
            <p class="title">团队余额</p>
          </div>
        </li>
        <li class="item" @click="tabChange(1)" :class="{'theme-agent-tab-active':tabIndex===1}">
          <div class="bmg" :class="{'active  theme-yellow-bg-2':tabIndex===1}">
            <p class="money">{{teamCommission||'0.00'}}</p>
            <p class="title">团队佣金</p>
          </div>
        </li>
        <li class="item" @click="tabChange(2)" :class="{'theme-agent-tab-active':tabIndex===2}">
          <div class="bmg" :class="{'active  theme-yellow-bg-2':tabIndex===2}">
            <p class="money">{{teamProfit||'0.00'}}</p>
            <p class="title">团队输赢</p>
          </div>
        </li>
      </ul>
      </div>
    </div>
    <div class="report-content" slot="content" v-touch:left ="onSwipeLeft"  v-touch:right="onSwipeRight">
      <transition-group :name="animation" class="animation-box" tag="p" ref="animationBox" :key="tabIndex">
        <component :key="'list_'+tabIndex" v-bind:is="targetComponent" :tabIndex="tabIndex" :selectedDate ='getSelectedDate'  :dateType='dateType' :scrollHeight='scrollHeight'></component>
      </transition-group>
    </div>
    <div slot="static">
      <van-popup v-model="showFilter" position="bottom" :style="positionStyle" get-container="body" :lazy-render="false">
        <div class="filter-box theme-main-bg">
          <p class="filter-box-title">
            <span class="title theme-color-white">查询时间</span>
            <span class="date ft26" style="margin: 0 0.05rem">(</span>
            <span class="date ft26">{{selectedDate.start ? selectedDate.start : targetDate.start}}</span>
            <span class="date ft26" style="margin: 0 0.1rem">~</span>
            <span class="date ft26">{{selectedDate.start ? selectedDate.end : targetDate.end}}</span>
            <span class="date ft26" style="margin: 0 0.05rem">)</span>
          </p>
          <ul class="list clear-fix">
            <li class="item  f-l theme-color-white theme-gradient-bg-2" v-for="(date, i) in filter.date" :key="i" :class="{'theme-color icon iconfont h5-icon-icon-xuanzhong theme-color active-icon theme-color-yellow':date===selectedDate}" @click="changeDate(date,i)">{{date.name}}</li>
          </ul>
          <div class="active-box">
            <button class="btn btn-cancel theme-border-1px theme-color theme-color-yellow theme-border-yellow theme-header-bg" @click="close">取消</button>
            <button class="btn btn-primary theme-bg theme-yellow-bg theme-color-black" @click="onFilter">确定</button>
          </div>
        </div>
      </van-popup>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import TeamBalance from './TeamBalance.vue'
import TeamCommission from './TeamCommission.vue'
import TeamProfit from './TeamProfit.vue'
import { debuglog } from 'util'
export default {
  name: 'Report',
  components: {TeamBalance,TeamCommission,TeamProfit},
  props: {
    ti: String,
    di: String
  },
  data () {
    return {
      date:[],
      dateType: 0,
      filter: {
        date: []
      },
      showFilter: false,
      targetDate: null,
      targetType: null,
      selectedType: null,
      selectedDate: null,
      getSelectedDate: null,
      targetComponent:'TeamBalance',
      scrollHeight: 0,
      defaultDateIndex:0,
      tabIndex: 0,
      noScroll:true,
      animation:"slide-right",
      currentTabIndex:0,
      teamBalance: '0.00',
      teamCommission: '0.00',
      teamProfit: '0.00'

    }
  },
  watch: {
    showFilter () {
      this.selectedDate = this.targetDate
      this.selectedType = this.targetType
    },
    tabIndex (val,old) {
      this.currentTabIndex = 0;
      if(val < old){
        this.animation = 'slide-right'
      }else{
        this.animation = 'slide-left'
      }
    }

  },
  created () {
    if(this.$route.query.report) this.tabChange(2)
    
    this.filter.date = [
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
        name: '本月',
        start: this.dayJs().startOf('month').format('YYYY-MM-DD'),
        end: this.dayJs().format('YYYY-MM-DD')
      },
      {
        name: '上月',
        start: this.dayJs().set('date', 1).subtract(1, 'month').format('YYYY-MM-DD'),
        end: this.dayJs().set('date', 1).subtract(1, 'd').format('YYYY-MM-DD')
      }
    ]
    let time = this.$route.query.time ? Number(this.$route.query.time) : 0
    this.targetDate = this.selectedDate = this.filter.date[time]
  },
  mounted(){
    var that = this;
    //设置头部佣金统计
    this.$root.$on("requestEvent",item=>{
        that.teamBalance = item.teamBalance;
        that.teamCommission = item.teamCommission;
        that.teamProfit = item.teamProfit;
    });
  },
  methods: {
    changeDate(date,i){
      this.dateType = i || 0
      this.selectedDate = date;
      // this.targetDate = date;
    },
    onFilter () {
      this.targetDate = this.selectedDate
      this.targetType = this.selectedType
      this.showFilter = false
      this.date = this.targetDate
      this.getSelectedDate = this.targetDate
      this.$root.$emit("TeamProfitLoadEvent",{date:this.date,defaultIndex:this.dateType});
    },
    close(){
      this.filter.date.forEach((item,index)=>{
        if(item.name == this.date.name){
            this.targetDate = item
        }
      })
      this.showFilter=false
    },
    tabChange(value){
      this.tabIndex = value;
      if(value === 0){
        this.targetComponent = 'TeamBalance';
      }else if(value === 1){
        this.targetComponent = 'TeamCommission';
      }else if(value === 2){
        this.targetComponent = 'TeamProfit';
        setTimeout(()=>{
          this.$root.$emit("TeamProfitLoadEvent",{date:this.targetDate,defaultIndex:this.dateType});
        },100)
      }
      this.dateType = 0
    },
    reload() {
      this.$forceUpdate()
    },
    onSwipeLeft () {
      if ((this.tabIndex + 1) <= 2) {
        this.tabIndex++
        this.tabChange(this.tabIndex);
      }
    },
    onSwipeRight () {
      if (this.tabIndex > 0) {
        this.tabIndex--
        this.tabChange(this.tabIndex);
      }
    }

    
  },
  computed:{
    positionStyle(){
      //解决安卓小米position：fixed问题导致按钮错位问题
      if(this.$mobileDevice.isAndroid 
        && this.$mobileDevice.browserName === 'MIUI Browser'){
        return {
          position:'absolute'
        }
      }else{
        return {
          position:'fixed'
        }
      }
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
    isClosed(){
      return this.$store.state.main.closeMask
    },
  },
  beforeDestroy(){
    //销毁清除
    delete localStorage.TeamDateIndex;
    this.$store.commit('user/setUserNameOfReport', '')
  }
}
</script>

<style lang="less" type='text/less' scoped>
.agent-take-title-header {
    /deep/ .header-back {
      color: #fff5d9 !important;
    }
  }
  .header-right {
    position: absolute;
    right: 0.16rem;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    color: #ffffff;
    font-size: 0.3rem;

    .icon {
      transform: rotateZ(180deg) scale(0.5);
    }
  }
   .filter-box {
    width: 7.5rem - (0.16rem * 2);
    margin: 0 auto;
    background-color: #ffffff;
    border-top-left-radius: 0.1rem;
    border-top-right-radius: 0.1rem;
    position: relative;

    .close {
      position: absolute;
      right: 0.16rem;
      top: 0.13rem;
      color: #999999;
      font-size: 0.5rem;
    }

    .filter-box-title {
      font-size: 0.32rem;
      font-weight: 500;
      color: #666666;
      line-height: 0.45rem;
      padding-top: 0.56rem;
      padding-left: 0.24rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .title {
        margin-right: 0.1rem;
      }

      .date {
        color: #999999;
      }
      .ft26{
        font-size: 0.26rem;
      }
    }

    .list {

      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 0.24rem;
        margin-top: 0.24rem;
        width: (7.5rem - (0.16rem * 2) - (0.24rem * 4)) / 3;
        font-size: 0.3rem;
        height: 0.76rem;
        color: #333333;
        background: #f5f5f5;
        position: relative;

      }
      .item::before{
        position:absolute;
        right:0;
        bottom:0;
      }
    }

    .active-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.72rem 0.24rem 0.48rem 0.24rem;

      .btn {
        width: (7.5rem - (0.16rem * 2) - (0.24rem * 3)) / 2;
        font-size: 0.38rem;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1rem;
        border-radius: 0.1rem;
        outline: 0;
      }

      .btn-cancel {
        background-color: #ffffff;
        border: 0.02rem solid #2C93FF;
        color: #2C93FF;
      }

      .btn-primary {
        background-color: #2C93FF;
        color: #ffffff;
      }
    }
  }
  .agent-report {
    .report-content{
      .animation-box{
        position: relative;
        left: 0;
        top: 0;
        width: 100%;
        .content-body{
          width: 100%;
        }
        .item-list{
          .animation-list{
            position: relative;
            left: 0;
            top: 0;
            width: 100%;
            .list-content{
              width:100%;
               .list {
                  padding: 0 0.24rem;
                  background-color: #ffffff;
                  border-top-right-radius: 0;
                  border-top-left-radius: 0;
                  width: 7.18rem;
                  margin: 0 auto;
                  .noMore{
                    .showTabs,.hideTabs{
                      margin-top:1rem;
                    }
                   
                  }
                  .list-item {
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
                    padding: 0.24rem 0;
                    font-size: 0.3rem;
                    color: #444444;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .list-item-col {
                      width: 50%;
                      flex: 1;
                      display: flex;
                      justify-content: center;
                      align-items: stretch;
                      flex-direction: column;

                      .name {
                        font-size: 0.3rem;
                        height: 0.42rem;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        margin-bottom: 0.16rem;
                      }

                      .money {
                        font-size: 0.3rem;
                        height: 0.42rem;
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        margin-bottom: 0.16rem;

                        &:last-child {
                          margin-bottom: 0;
                        }
                      }

                      .time {
                        color: #a3a3a3;
                        font-size: 0.26rem;
                        height: 0.4rem;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;

                      }

                      .type {
                        font-size: 0.26rem;
                        height: 0.4rem;
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;

                      }

                      .deposit {
                        color: #E71414;
                      }

                      .withdrawals {
                        color: #00A054;
                      }

                      .bonus {
                        color: #E71414;
                      }

                      .bet {
                        color: #E71414 !important;

                        &.bet {
                          color: #E71414 !important;
                        }

                        &.betWin {
                          color: #E71414 !important;
                        }

                        &.cancelBet {
                          color: #00A054 !important;
                        }

                        &.returnBet {
                          color: #00A054 !important;
                        }

                      }

                      .transfer {
                        color: #E71414 !important;

                        &.IN {
                          color: #E71414 !important;
                        }

                        &.OUT {
                          color: #00A054 !important;
                        }

                        &.AgencyToMember {
                          color: #00A054 !important;
                        }

                      }

                      .other {
                        color: #E71414 !important;

                        &.deductionArrears {
                          color: #00A054 !important;
                        }

                        &.transfer {
                          color: #E71414 !important;
                        }

                        &.other {
                        }
                      }
                    }
                  }
                }
              }
          }
        }
      } 
    }
    .header{
        width: 7.18rem;
        margin: 0 auto;
        border-radius: 0.1rem;
      .header-main{
        height: 1.46rem;
        border-radius: 0.1rem;
        background-size: 100%;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        color: #FFFFff;
        overflow: hidden;
        background-image: url("../../../assets/img/agent-center-new/dot.png");
      }
      .item {
        width: 100%/3;
        height: 100%;

        .bmg {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: stretch;

          .money {
            font-size: 0.34rem;
            line-height: 0.48rem;
          }

          .title {
            margin-top: 0.08rem;
            font-size: 0.3rem;
            line-height: 0.42rem;
          }

          &.active {
            background: url("../../../assets/img/agent-center-new/report/report-header-bg-active.png");
            background-size: 100%;
          }
        }

      }
    }

    .search-box {
      height: 0.9rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      margin-bottom:0.24rem;

      &.only-date {
        width: 1.9rem;
        padding: 0 0.16rem;
        justify-content: flex-end;
        margin-left: 5.44rem;
      }

      .search-icon {
        margin-right: 0.24rem;
        font-size: 0.38rem;
      }

      .input {
        min-width: 0;
        flex: 1;
          font-size:0.26rem;
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
    .types-tab-hide{
      border-bottom:0!important;
      height:0!important;
    }
    .type-tab {
      width: 7.18rem;
      height: 0.9rem;
      margin: 0.24rem auto 0 auto;
      background-color: #ffffff;
      border-top-left-radius: 0.1rem;
      border-top-right-radius: 0.1rem;
      font-size: 0.32rem;
      color: #666666;
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      // border-bottom: 0.02rem solid #E7E7E7;
      &::after{
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0.2rem;
        bottom: 0;
        // top: 0;
        left: 0rem;
        border-bottom: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }

      .type-tab-item {
        width: 100%/3;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &.active {
          color: #FFFFff;
          background-color: #2C93FF;
        }
      }
    }

    .content {
      width: 100%;
      overflow: hidden;

     
    }

    .footer {
      background-color: #ffffff;
      position: relative;
      bottom:0;
      left:0;
      width:100%;
      box-shadow: 0px -6px 5px 0px rgba(0, 0, 0, 0.03);
      .all {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.98rem;
        padding: 0.16rem 0.2rem;

        .all-item {
          /*flex: 1;*/
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #444444;

          .money {
            font-size: 0.32rem;

            &.red {
              color: #E71414;
            }
          }

          .label {
            font-size: 0.28rem;
            line-height: 0.4rem;
          }
        }
      }
      .right{
        justify-content: flex-end;
      }

      .only-one {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 0.98rem;
        color: #444444;
        padding: 0 0.4rem;
        flex-direction: row-reverse;

        .money {
          font-size: 0.32rem;

          &.red {
            color: #E71414;
          }
        }

        .label {
          font-size: 0.28rem;
          line-height: 0.4rem;
        }
      }
    }

    .team-win {
      .team-win-item {
        position: relative;
        height: 1.4rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        padding: 0.24rem 0 0.24rem 1.84rem;
        .bmg{
          position: absolute;
          left: 0;
          top: -0.04rem;
          width: 1.84rem;
          height: 1.48rem;
          border-radius:0.16rem 0 0 0.16rem;

        }
        .team-win-item-label {
          width: 100%;
          height: 100%;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          background-size: 100%;
          background-repeat: no-repeat;
          background-position: 0 0;
          font-weight: 500;
          font-size: 0.36rem;

          &.liveType {
            background-image: url("../../../assets/img/agent-center-new/report/label-report-live.png");
          }

          &.lotteryType {
            background-image: url("../../../assets/img/agent-center-new/report/label-report-lottery.png");
          }

          &.sportType {
            background-image: url("../../../assets/img/agent-center-new/report/label-report-sport.png");
          }

          &.slotType {
            background-image: url("../../../assets/img/agent-center-new/report/label-report-slot.png");
          }

          &.chessType {
            background-image: url("../../../assets/img/agent-center-new/report/label-report-chess.png");
          }
        }

        .team-win-item-col {
          flex: 1;

          .team-win-item-money {
            display: block;
            font-size: 0.32rem;
            line-height: 0.45rem;

            &.red {
              color: #E71414;
            }

            &.green {
              color: #00A054;
            }
          }

          .team-win-item-title {
            margin-top: 0.08rem;
            display: block;
            font-size: 0.28rem;
            line-height: 0.40rem;
            color: #444444;
          }
        }
      }
    }
  }
</style>
