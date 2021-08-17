<template>
  <view-page ref="view-page" :noMore="noMore" full-box load-more @load-top="onRefresh" @load-down="onLoaderMore" class="theme-main-bg">
    <title-header class="agent-take-title-header theme-header-bottom theme-header-bg" title="佣金明细" slot="header" color="#ffffff">
      <span class="header-right" slot="right"><i class="text theme-color-yellow" @click="showFilter = true">{{targetDate.name}}</i><i class="icon iconfont h5-icon-qushi-moreup theme-color-yellow"></i></span>
    </title-header>
    <div class="content-slot" slot="content">
      <ul class="list view-box theme-main-bg" v-if="list.length">
        <li class="list-item theme-after-border-color" v-for="(item, i) in list" :key="i">
          <p class="list-item-col">
            <span class="name theme-color-white"  v-if="item['agencyName']">{{item['agencyName']}}</span>
            <span class="name theme-color-white"  v-else-if="item['betuname']">{{item['betuname']}}</span>
            <span class="time">{{item['created_at']}}</span>
          </p>
          <p class="list-item-col">
            <span class="money theme-color-yellow" :class="[item['type'], item['subType']]" v-if="item['money']">{{(item['money']*1).toFixed(2)}}</span>
            <span class="money theme-color-yellow" :class="[item['type'], item['subType']]" v-else-if="item['givemoney']">{{(item['givemoney']*1).toFixed(2)}}</span>
            <span class="type" v-if="item.username!==userInfo.userName||agencyType==='shareholder'"
                  :class="[item['type'], item['subType']]">{{item['cn_desc']}}</span>
          </p>
        </li>
      </ul>
      <div v-else-if="noMore">
        <img style="width: 100%;margin-top: 1rem;" :src='noDataImg' alt/>
        <p style="font-size: 0.3rem;color: #666666">暂无数据</p>
      </div>
    </div>

    <div class="list-footer theme-gradient-bg" :class="parseFloat(income)>0 && parseFloat(outCome)>0 ? '' : 'flex-right'"  v-if="(parseFloat(income)>0  && targetType.code =='commissionDetail') ||(parseFloat(outCome)>0 )  && targetType.code =='commissionDetailTake' "  slot="footer">
      <p class="info-item" v-if="parseFloat(income)>0 && targetType.code =='commissionDetail' "><span class="theme-color-white">收入:</span><span class="value theme-color-yellow" :class="{red:parseFloat(income)>0,green:parseFloat(income)<0}">{{income||'0.00'}}</span></p>
      <p class="info-item" v-if="parseFloat(outCome)>0  && targetType.code =='commissionDetailTake' "><span class="theme-color-white">转出:</span><span class="value theme-color-yellow" :class="{red:parseFloat(outCome)>0,green:parseFloat(outCome)<0}">{{outCome||'0.00'}}</span></p>
    </div>

    <div slot="static">
      <van-popup v-model="showFilter" position="bottom" :style="positionStyle" get-container="body" :lazy-render="false" :close-on-click-overlay="false">
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
            <li class="item  f-l theme-gradient-bg-2 theme-color-white" v-for="(date, i) in filter.date" :key="i" :class="{'theme-color icon iconfont h5-icon-icon-xuanzhong theme-color active-icon theme-color-yellow':date===selectedDate}" @click="changeDate(date)">{{date.name}}</li>
          </ul>
          <p class="filter-box-title theme-color-white">
            <span class="title">交易类型</span>
          </p>
          <ul class="list clear-fix">
            <li class="item f-l theme-gradient-bg-2 theme-color-white" v-for="(type, i) in filter.type" :key="i" :class="{'theme-color icon iconfont h5-icon-icon-xuanzhong theme-color active-icon theme-color-yellow':type===selectedType}" @click="selectedType=type">{{type.name}}</li>
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
export default {
  name: 'CommissionDetail',
  data () {
    return {
      filter: {
        date: [],
        type: [
          {
            name: '佣金',
            code: 'commissionDetail'
          },
          {
            name: '工资',
            code: 'wage'
          },
          {
            name: '分红',
            code: 'profit'
          },
          {
            name: '佣金转账',
            code: 'commissionDetailTake'
          }
        ]
      },
      date:[],
      targetDate: null,
      targetType: null,
      selectedType: null,
      selectedDate: null,
      showFilter: false,
      limit: 20,
      page: 0,
      loading: false,
      noMore: false,
      list: [],
      typeMap: {
        deposit: {
          offline: '公司入款',
          online: '线上支付',
          manual: '人工汇款',
          transfer: '额度转换',
          other: '其他存款'
        },
        withdrawals: {
          withdrawals: '取款成功',
          application: '取款申请',
          refuse: '取款拒绝',
          manual: '人工提款',
          other: '其他取款'
        },
        bonus: {
          bonus: '存款优惠',
          manualBonus: '人工存款优惠',
          giftBonus: '系统彩金派送',
          giftBonusAdmin: '人工彩金派送',
          manualRebateBonus: '人工返水派送',
          AgencyRebateBonus: '代理返水',
          AgencyRebatePoints: '代理返点',
          memberRebateBonus: '会员返水',
          memberRebatePoints: '会员返点',
          AgencyCommissionSelf: '自身佣金',
          AgencyCommissionUp: '代理佣金',
          AgencyWage: '代理日工资',
          AgencyShareOutBonus: '代理分红',
          deductionArrears: '抵扣欠款',
          cancelRebateBonus: '取消返水',
          returnPoints: '撤回返点'
        },
        bet: {
          bet: '下注',
          betWin: '派彩',
          cancelBet: '撤单注销',
          returnBet: '撤回派奖'
        },
        transfer: {
          IN: '转入',
          OUT: '转出',
          AgencyToMember: '代理余额转入会员余额'
        },
        other: {
          other: '其他'
        }
      },
      income: '0.00',
      outCome: '0.00'
    }
  },
  watch: {
    showFilter () {
      this.selectedDate = this.targetDate
      this.selectedType = this.targetType
    },
    // targetDate: 'onRefresh',
    targetType: 'onRefresh'
  },
  created () {
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
    this.targetType = this.selectedType = this.filter.type[0]
    if(this.personalMode == 'no') this.filter.type.splice(2,1)
    // this.onRefresh()
  },
  methods: {
    onFilter () {
      this.targetDate = this.selectedDate
      this.targetType = this.selectedType
      this.showFilter = false
      this.date = this.targetDate
      this.onRefresh()
    },
    onRefresh () {
      this.page = 0
      this.noMore = false
      this.getList(true)
    },
    onLoaderMore () {
      console.log(this.page)
      this.getList()
    },
    changeDate(date){
      this.selectedDate = date;
      // this.targetDate = date;
    },
    close(){
      this.filter.date.forEach((item,index)=>{

        if(item.name == this.date.name){
            this.targetDate = item
        }
      })
      this.showFilter=false
    },
    getList (status) {
      if (this.noMore) {
        this.toastText('没有更多', 'top')
        this.$refs['view-page'].loaded()
      } else if (!this.loading) {
        this.loading = true
        this.page++
        this.$store.dispatch('agency/CommissionDateil', {
          limit: this.limit,
          page: this.page,
          type: this.targetType.code,
          startTime: this.targetDate.start,
          endTime: this.targetDate.end
        }).then(res => {
          this.loading = false
          if (res.code === 200) {
            if (res.data.data.length) {
              if(res.data.wageType==0){
                this.filter.type.forEach((item,index)=>{
                     if(item.code=='wage'){
                        this.filter.type.splice(index,1)
                     }
                })
              }
              if(res.data.data.length < this.limit){
                this.noMore = true;
              }
             if(res.data.shareoutbonusType==0){
                 this.filter.type.forEach((item,index)=>{
                     if(item.code=='profit'){
                        this.filter.type.splice(index,1)
                     }
              })
              }
              if (status) this.list = res.data.data
              else this.list = this.list.concat(res.data.data)
               this.$refs['view-page'].loaded()
              this.$refs['view-page'].refresh();
            } else {
              if(res.data.wageType==0){
                this.filter.type.forEach((item,index)=>{
                     if(item.code=='wage'){
                        this.filter.type.splice(index,1)
                     }
                })
              }
              if(res.data.shareoutbonusType==0){
                 this.filter.type.forEach((item,index)=>{
                     if(item.code=='profit'){
                        this.filter.type.splice(index,1)
                     }
                })
              }
              if (status) this.list = []
              this.noMore = true
              this.$refs['view-page'].loaded() 
              this.$refs['view-page'].refresh();
            }
            this.income = res.data.totalCommission.in
            this.outCome = res.data.totalCommission.out
          } else {
            this.page--
            this.toastText(res.message, 'top')
          }
        }).catch(err => {
          this.loading = false
          this.$refs['view-page'].loaded()
          this.page--
        })
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
  }
}
</script>

<style lang="less" type='text/less' scoped>
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

  .content-slot {
    padding-bottom: 0.24rem;

    .list {
      padding: 0 0.24rem;
      background-color: #ffffff;
      border-top-right-radius: 0;
      border-top-left-radius: 0;
      margin-top: 0;

      .list-item {
        // border-bottom: 0.02rem solid #E7E7E7;
        padding: 0.24rem 0;
        font-size: 0.3rem;
        color: #444444;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
            color: #a3a3a3 !important;
            font-size: 0.24rem;
          }

          .deposit {
            color: #E71414;

            &.offline {

            }

            &.online {

            }

            &.manual {

            }

            &.transfer {

            }

            &.other {

            }
          }

          .withdrawals {
            color: #00A054;

            &.withdrawals {

            }

            &.application {

            }

            &.refuse {

            }

            &.manual {

            }

            &.other {

            }
          }

          .bonus {
            color: #E71414;

            &.bonus {

            }

            &.manualBonus {

            }

            &.giftBonus {

            }

            &.giftBonusAdmin {

            }

            &.manualRebateBonus {

            }

            &.AgencyRebateBonus {

            }

            &.AgencyRebatePoints {

            }

            &.memberRebateBonus {

            }

            &.memberRebatePoints {

            }

            &.AgencyCommissionSelf {

            }

            &.AgencyCommissionUp {

            }

            &.AgencyWage {

            }

            &.AgencyShareOutBonus {

            }

            &.deductionArrears {

            }

            &.cancelRebateBonus {

            }

            &.returnPoints {

            }
          }

          .bet {

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

            &.other {

            }

          }
        }

        &:last-child {
          border-bottom: none;
        }
      }
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

  .list-footer {
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    height: 0.88rem;
    padding: 0 0.32rem;

    .info-item {
      font-size: 0.3rem;
      color: #444444;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;

      .value {
        font-size: 0.32rem;
        color: #E71414;
        margin-left: 0.1rem;
      }
    }
  }
  .flex-right{
    justify-content: flex-end !important;
  }
</style>
