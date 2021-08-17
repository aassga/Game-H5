<template>
  <view-page class="agent-report" ref="view-page" full-box :no-scroll="noScroll" @scroll-height-change="scrollHeight=$event" >
    <title-header  title="财务报表" slot="header"></title-header>
    <div class="content-slot" slot="header-static">
      <div class="theme-agent-tab header">
        <ul class="header-main ">
        <li class="item" @click="tabChange(0)" :class="{'theme-agent-tab-active':tabIndex===0}">
          <div class="bmg" :class="{'active':tabIndex===0}">
            <p class="money">{{teamBalance||'0.00'}}</p>
            <p class="title">团队余额</p>
          </div>
        </li>
        <li class="item" @click="tabChange(1)" :class="{'theme-agent-tab-active':tabIndex===1}">
          <div class="bmg" :class="{'active':tabIndex===1}">
            <p class="money">{{teamCommission||'0.00'}}</p>
            <p class="title">团队佣金</p>
          </div>
        </li>
        <li class="item" @click="tabChange(2)" :class="{'theme-agent-tab-active':tabIndex===2}">
          <div class="bmg" :class="{'active':tabIndex===2}">
            <p class="money">{{teamProfit||'0.00'}}</p>
            <p class="title">团队盈利</p>
          </div>
        </li>
      </ul>
      </div>
    </div>
    <!--v-touch:left ="onSwipeLeft"  v-touch:right="onSwipeRight"-->
    <div class="report-content" slot="content"  >
      <transition-group :name="animation" class="animation-box" tag="p" ref="animationBox">
        <div class="content-body" :key="'list'+tabIndex">
          <div class="view-box search-box" :class="{'only-date':tabIndex===2}">
            <span class="search-icon icon iconfont h5-icon-sousuotubiao theme-color" v-show="tabIndex!==2"></span>
            <van-field v-model="username[tabIndex]" class="input" type="text" placeholder="输入帐号可以进行筛选" clearable v-show="tabIndex!==2" @blur="onSearch"></van-field>
            <span class="date" @click="showDateSelector=true">{{targetDate[tabIndex]&&targetDate[tabIndex].name}}</span>
            <span class="date-icon icon iconfont h5-icon-qushi-moreup" @click="showDateSelector=true"></span>
          </div>
          <ul class="type-tab" v-if="tabIndex===0" :class="{'types-tab-hide':types[tabIndex].length==0}">
            <li class="type-tab-item" v-for="(type, i) in types[tabIndex]" :key="i" :class="{'theme-bg active':typeIndex[tabIndex]===i}"
                @click="$set(typeIndex,tabIndex,i);currentTabIndex = i">{{type.name}}
            </li>
          </ul>
          <div class="item-list" v-if="tabIndex!==2"  slot="content">
            <transition-group :name="animationList" class="animation-list" tag="p" ref="animationList">
                <div class="list-content" :key="'wap'+currentTabIndex" >
                    <list-view class="view-box list" style="margin-top: 0;padding: 0" @load-top="onRefresh" @load-down="onLoadMore" 
                               :style="{height:(scrollHeight-(otherHeight*rem))+'px'}"  ref="list">
                      <div class="view-box" style="margin: 0 auto;border-top-left-radius: 0;border-top-right-radius: 0; height: auto;">
                        <ul v-if="list[tabIndex][currentTabIndex].length">
                          <li class="list-item" v-for="(item, i) in list[tabIndex][currentTabIndex]" :key="i">
                            <p class="list-item-col">
                              <span class="name" v-if="item.username!==userInfo.userName||agencyType==='shareholder'">{{tabIndex == 0?item['username']:item['giveuname']}}</span>
                              <span class="name" v-else>{{typeMap[item['type']][item['subType']]}}</span>
                              <span class="time">{{item['created_at']}}</span>
                            </p>
                            <p class="list-item-col">
                              <span class="money" :class="[item['type'], item['subType']]"  v-if="item['money']">{{(item['money']*1).toFixed(2)}}</span>
                              <span class="money" :class="[item['type'], item['subType']]"  v-else-if="item['givemoney']">{{(item['givemoney']*1).toFixed(2)}}</span>
                              <span class="type" v-if="item.username!==userInfo.userName||agencyType==='shareholder'"
                                    :class="[item['type'], item['subType']]">{{typeMap[item['type']][item['subType']]}}</span>
                            </p>
                          </li>
                        </ul>
                        <div v-else-if="noMore" class="noMore">
                          <img style="width: 100%;" :class="types[tabIndex].length>0?'showTabs':'hideTabs'" src="@src/assets/img/no-data.png" alt/>
                          <p style="font-size: 0.3rem;color: #666666">暂无数据</p>
                         </div>
                      </div>
                    </list-view>
                  
                </div>
            </transition-group>
          </div>
  
        <list-view  v-if="tabIndex==2"  :style="{height:(scrollHeight)+'px'}"  ref="profit" :showLoadding='false' @load-top="onRefreshProfit" :no-more="true" :isRefresh="false" :isLoadMore="false">
          <ul class="team-win" :style="{minHeight:scrollHeight+'px'}">
            <li class="team-win-item view-box" v-for="(item, i) in list[2]" :key="i" @mousedown="toRecode(item.type,i)">
              <div class="bmg theme-agent-tab" v-if="item.type">
                <span class="team-win-item-label" :class="item.type.toString().toLowerCase()+'Type'">{{item.name}}</span>
              </div>
              <p class="team-win-item-col">
                <span class="team-win-item-money">{{item.betAmount||'0.00'}}</span>
                <span class="team-win-item-title">投注</span>
              </p>
              <p class="team-win-item-col">
                <span class="team-win-item-money" :class="{red:parseFloat(item.netAmount)>0,green:parseFloat(item.netAmount)<0}">{{item.netAmount||'0.00'}}</span>
                <span class="team-win-item-title">盈利</span>
              </p>
            </li>
          </ul>
          </list-view>
        </div>
      </transition-group>
    </div>

    <div class="footer" slot='footer'>
        <ul class="all" v-if="tabIndex===1&&currentTabIndex===1&&parseFloat(withdrawalsAmount)!=0||parseFloat(depositAmount)!=0||parseFloat(memberBonus)!=0">
          <li class="all-item">
            <span class="label">提现:</span>
            <span class="money red" :class="{red:parseFloat(withdrawalsAmount)}">{{withdrawalsAmount}}</span>
          </li>
          <li class="all-item">
            <span class="label">充值:</span>
            <span class="money red" :class="{red:parseFloat(depositAmount)}">{{depositAmount}}</span>
          </li>
          <li class="all-item">
            <span class="label">优惠:</span>
            <span class="money red" :class="{red:parseFloat(memberBonus)}">{{memberBonus}}</span>
          </li>
        </ul>
        <p class="only-one" v-else-if="tabIndex===1&&currentTabIndex===2&&parseFloat(depositAmount)!=0">
          <span class="money red" :class="{red:parseFloat(depositAmount)}">{{depositAmount}}</span>
          <span class="label">充值:</span>
        </p>
        <p class="only-one" v-else-if="tabIndex===1&&currentTabIndex===3&&parseFloat(withdrawalsAmount)!=0">
          <span class="money red" :class="{red:parseFloat(withdrawalsAmount)}">{{withdrawalsAmount}}</span>
          <span class="label">提现:</span>
        </p>
        <ul class="all" v-else-if="tabIndex===2&&currentTabIndex===1&&parseFloat(refundCommission)!=0||parseFloat(wage)!=0||parseFloat(profit)!=0"  :class="{right:!(wageType || shareoutbonusType)}">
          <li class="all-item">
            <p class="label">返佣:</p>
            <p class="money red" :class="{red:parseFloat(refundCommission)}">{{refundCommission}}</p>
          </li>
          <li class="all-item" v-if="wageType">
            <p class="label">工资:</p>
            <p class="money red" :class="{red:parseFloat(wage)}">{{wage}}</p>
          </li>
          <li class="all-item" v-if="shareoutbonusType">
            <p class="label">分红:</p>
            <p class="money red" :class="{red:parseFloat(profit)}">{{profit}}</p>
          </li>
        </ul>
        <p class="only-one" v-else-if="tabIndex===2&&currentTabIndex===2&&parseFloat(wage)!=0">
          <span class="money red" :class="{red:parseFloat(wage)}">{{wage}}</span>
          <span class="label">工资:</span>
        </p>
        <p class="only-one" v-else-if="tabIndex===2&&currentTabIndex===3&&parseFloat(profit)!=0">
          <span class="money red" :class="{red:parseFloat(profit)}">{{profit}}</span>
          <span class="label">分红:</span>
      </p>
    </div>

    <div slot="static">
      <agency-date-selector v-model="targetDate[tabIndex]" @getDefaultIndex="getDefaultIndex"  :show.sync="showDateSelector" :default-index="defaultIndex || 0"></agency-date-selector>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import AgencyDateSelector from '@src/components/agency-date-selector/AgencyDateSelector'
import IScroll from 'iscroll/build/iscroll-probe'
import { debuglog } from 'util'
export default {
  name: 'Report',
  components: {AgencyDateSelector},
  props: {
    ti: String,
    di: String
  },
  data () {
    return {
      scrollHeight: 0,
      info: {},
      all:false,
      defaultDateIndex:0,
      inited: false,
      tabIndex: 0,
      noScroll:true,
      defaultTabIndex: 0,
      username: ['', '', ''],
      animation:"slide-right",
      dates: [],
      animationList:'slide-right',
      currentTabIndex:0,
      targetDate: [null, null, null],
      showDateSelector: false,
      limit: 20,
      page: 0,
      tabData:3,
      otherHeight:2.3,
      loading: false,
      defaultIndex:0,
      noMore: false,
      copyTypes:[],
      types: [
        [
          {
            name: '全部',
            code: 'amountAll'
          },
          {
            name: '充值',
            code: 'deposit'
          },
          {
            name: '提现',
            code: 'withdrawals'
          }
        ],
        [
          {
            name: '全部',
            code: 'commission'
          },
          {
            name: '工资',
            code: 'wage'
          },
          {
            name: '分红',
            code: 'profit'
          }
        ]
      ],
      typeIndex: [0, 0],
      list: [
        [
          [],
          [],
          []
        ],
        [
          [],
          [],
          []
        ],
        []
      ],
      preList: [
        [
          [],
          [],
          []
        ],
        [
          [],
          [],
          []
        ]
      ],
      typeMap: {
        deposit: {
          offline: '公司入款',
          online: '线上支付',
          manual: '人工汇款',
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
          bonus: '系统存款优惠',
          manualBonus: '人工存款优惠',
          giftBonus: '系统活动优惠',
          giftBonusAdmin: '人工活动优惠',
          memberRebateBonus: '系统返水优惠', // 返到member表 自己打码产生给自己的反水
          manualRebateBonus: '人工返水优惠',
          // 下面属于 佣金大类
          AgencyRebateBonus: '下级返佣', // 返到agency表 合并成 下级返佣
          AgencyRebatePoints: '下级返佣', // 返到agency表 合并成 下级返佣
          AgencyCommissionSelf: '自身返拥', // 会员打码给自己agency反的佣金 ab模式
          AgencyCommissionUp: '下级返佣', // 会员打码给上级agency反的佣金 ab模式
          returnPoints: '扣除佣金',
          AgencyWage: '日工资',
          AgencyShareOutBonus: '月分红',
          // 下面属于 投注大类
          memberRebatePoints: '会员返点', // 返到member表 自己打码产生给自己的反点 例如 六合彩特B玩法
          cancelRebatePoints: '撤回返点' // 返到member表 自己打码产生给自己的反点 例如 六合彩特B玩法
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
          deductionArrears: '余额还款',
          transfer: '额度转换失败',
          other: '其他'
        }
      },
      depositAmount: '0.00',
      withdrawalsAmount: '0.00',
      memberBonus: '0.00',
      teamBalance: '0.00',
      teamCommission: '0.00',
      teamProfit: '0.00',
      refundCommission: '0.00',
      wage: '0.00',
      profit: '0.00',
      shareoutbonusType:1,
      wageType:1,
      firstLoadFlag:true,
      scroll:null,
      showFooter:true
    }
  },
  watch: {
    tabIndex (val,old) {
      this.currentTabIndex = 0;
      this.typeIndex[this.tabIndex] = 0
      if(val < old){
        this.animation = 'slide-right'
      }else{
        this.animation = 'slide-left'
      }
      if(this.tabIndex == 1 && this.currentTabIndex ==0){
        if(this.refundCommission ==0  && this.wage==0 && this.profit==0){this.showFooter = false}
        else{this.showFooter = true}
      }
      this.$nextTick(()=>{
        this.dates.forEach((item,index)=>{
          if(item.name == this.targetDate[val].name){
            this.defaultIndex = index
          }
        })
      })
      this.onRefresh()
    },
    currentTabIndex:{
      handler:function(val,old){
      if(val < old){
        this.animationList = 'slide-right'
      }else{
        this.animationList = 'slide-left'
      }
      this.onRefresh()
      },
      deep:true
    },
    targetDate () {
      this.onRefresh()
    },
    typeIndex () {
      this.$nextTick(()=>{
        this.onRefresh()
      })
    }
  },
  created () {
     this.dates = [
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
        start: this.dayJs().subtract(30, 'day').format('YYYY-MM-DD'),
        end: this.dayJs().format('YYYY-MM-DD')
      },
      {
        name: '上月',
        start: this.dayJs().set('date', 1).subtract(1, 'month').format('YYYY-MM-DD'),
        end: this.dayJs().set('date', 1).subtract(1, 'd').format('YYYY-MM-DD')
      }
    ]
    try {
      const data = JSON.parse(localStorage.reportData)
      this.depositAmount = data['depositAmount'] || '0.00'
      this.withdrawalsAmount = data['withdrawalsAmount'] || '0.00'
      this.memberBonus = data['memberBonus'] || '0.00'
      this.teamBalance = data['teamBalance'] || '0.00'
      this.teamCommission = data['teamCommission'] || '0.00'
      this.teamProfit = data['teamProfit'] || '0.00'
      this.refundCommission = data['refundCommission'] || '0.00'
      this.wage = data['wage'] || '0.00'
      this.profit = data['profit'] || '0.00'
    } catch (e) {
      this.depositAmount = '0.00'
      this.withdrawalsAmount = '0.00'
      this.memberBonus = '0.00'
      this.teamBalance = '0.00'
      this.teamCommission = '0.00'
      this.teamProfit = '0.00'
      this.refundCommission = '0.00'
      this.wage = '0.00'
      this.profit = '0.00'
    }

    try {
      this.$set(this.list, 2, JSON.parse(localStorage.reportWin))
    } catch (e) {
      this.$set(this.list, 2, [])
    }

    this.tabIndex = this.defaultTabIndex = parseInt(this.ti) || 0
    this.typeIndex[this.tabIndex] = 0
    this.copyTypes = [...this.types];
    this.onRefresh()
  },
  methods: {
    tabChange(index){
      if(index === 0){
        this.otherHeight = 2.3;
      }else if(index === 1){
        this.otherHeight = 1.5;
      }
      this.tabIndex = index;
    },
    reload() {
      this.$forceUpdate()
    },
    onSwipeLeft () {
      if (this.tabIndex + 1 < this.list.length) {
        this.tabIndex++
      }
    },
    onSwipeRight () {
      if (this.tabIndex > 0) {
        this.tabIndex--
      }
    },
    toRecode (type,i) {
      if (type){this.$router.push({path:`/user/agency-center-new/recode/report/${type}`,query:{id:i,date:this.defaultDateIndex}})}
      else this.$router.push('/user/agency-center-new/recode')
    },
    getDefaultIndex(date){
      this.defaultDateIndex = date
    },
    onSearch () {
      this.onRefresh()
    },
    onRefreshProfit(){
      this.$refs['profit'].loaded()
    },
    onRefresh () {
      if (this.targetDate[this.tabIndex]) {
        this.loading = false
        this.page = 0
        this.noMore = false
        if (this.tabIndex !== 2) this.preList[this.tabIndex][this.typeIndex[this.tabIndex]] = []
        this.loadList(true)
      } else if (this.tabIndex === 2) {
        this.loadList(true)
      }
    },
    onLoadMore () {
      this.loadList()
    },
    loadList (status) {
      const tabIndex = this.tabIndex
      const data = {}
      if (this.targetDate[tabIndex]) {
        data.startTime = this.targetDate[tabIndex].start
        data.endTime = this.targetDate[tabIndex].end
      } else {
        return
      }
      this.loading = true

      if (tabIndex !== 2) {
        this.page++
        const typeIndex = this.typeIndex[tabIndex]
        data['username'] = this.username[tabIndex]
        data.limit = this.limit
        data.page = this.page
        if(this.copyTypes[tabIndex].length>0 ){
          data.type = this.copyTypes[tabIndex][typeIndex].code
        }else{
          data.type = 'amountAll'
        }
        if (this.noMore) {
          this.page--
          this.loading = false
          this.$refs['list'].loaded()
          this.toastText('没有更多', 'top')
        } else {
          this.$store.dispatch('agency/AgencyFinanceList', data).then(res => {
            this.loading = false
            this.$refs['list'].loaded()
            if (res.code === 200) {
              this.$refs['view-page'].refresh()
              this.depositAmount = res.data['depositAmount'] || '0.00'
              this.withdrawalsAmount = res.data['withdrawalsAmount'] || '0.00'
              this.memberBonus = res.data['memberBonus'] || '0.00'
              if(this.firstLoadFlag){
                this.teamBalance = res.data['teamBalance'] || '0.00'
                this.teamCommission = res.data['teamCommission'] || '0.00'
                this.teamProfit = res.data['teamProfit'] || '0.00'
              }else{
                  if(this.tabIndex == 0)this.teamBalance = res.data['teamBalance'] || '0.00'
                  if(this.tabIndex == 1)this.teamCommission = res.data['teamCommission'] || '0.00'
              }
              
              this.refundCommission = res.data['refundCommission'] || '0.00'
              this.wage = res.data['wage'] || '0.00'
              this.profit = res.data['profit'] || '0.00'
              this.shareoutbonusType = res.data['shareoutbonusType']
              this.wageType =  res.data['wageType']
              if(this.firstLoadFlag && this.tabIndex == 1){
                if(!this.shareoutbonusType && this.wageType)     { this.types[this.tabIndex].splice(2,1);this.tabData = 2}
                else if(!this.wageType && this.shareoutbonusType){ this.types[this.tabIndex].splice(1,1);this.tabData = 2}
                else if(!this.shareoutbonusType &&!this.wageType){ this.types[this.tabIndex] = [];this.otherHeight =1.5;this.$forceUpdate();this.tabData = 1}
                this.firstLoadFlag = false
                this.$refs['list'].loaded()
              }

              if(this.withdrawalsAmount ==0  && this.depositAmount==0 && this.memberBonus==0){this.showFooter = false}
                else{this.showFooter = true}
              if (res.data.data.length) { 
                this.all = false;
                this.list[tabIndex][typeIndex] = res.data.data;
                if (status) {this.$forceUpdate();this.$set(this.list[tabIndex], typeIndex, res.data.data);
                this.$refs['list'].loaded()
                }
                else {this.$set(this.list[tabIndex], typeIndex, this.list[tabIndex][typeIndex].concat(res.data.data));
                this.$refs['list'].loaded()
                }
              } else {
                this.all = true
                if(status){
                  this.$refs['list'].loaded()
                  this.$set(this.list[tabIndex], typeIndex, res.data.data);
                  this.depositAmount =  '0.00'
                  this.withdrawalsAmount = '0.00'
                  this.memberBonus = '0.00'
                  this.refundCommission =  '0.00'
                  this.wage = '0.00'
                  this.profit = '0.00'
                }
                this.noMore = true

              }
            } else {
              this.page--
              this.toastText(res.message, 'top')
            }
          }).catch(err => {
            this.page--
            this.loading = false
            this.$refs['list'].loaded()
          })
        }
      } else {
        this.loading = true
        this.$store.dispatch('agency/AgencyProfit', data).then(res => {
          this.loading = false
          this.$refs['view-page'].loaded()
          if (res.code === 200) {
            this.$set(this.list, 2, res.data.data)
            this.depositAmount = res.data['depositAmount'] || '0.00'
            this.withdrawalsAmount = res.data['withdrawalsAmount'] || '0.00'
            this.memberBonus = res.data['memberBonus'] || '0.00'
            // this.teamBalance = res.data['teamBalance'] || '0.00'
            // this.teamCommission = res.data['teamCommission'] || '0.00'
            this.teamProfit = res.data['teamProfit'] || '0.00'
            this.refundCommission = res.data['refundCommission'] || '0.00'
            this.wage = res.data['wage'] || '0.00'
            this.profit = res.data['profit'] || '0.00'
            localStorage.reportData = JSON.stringify({
              depositAmount: this.depositAmount,
              withdrawalsAmount: this.withdrawalsAmount,
              memberBonus: this.memberBonus,
              teamBalance: this.teamBalance,
              teamCommission: this.teamCommission,
              teamProfit: this.teamProfit,
              refundCommission: this.refundCommission,
              wage: this.wage,
              profit: this.profit
            })

            localStorage.reportWin = JSON.stringify(res.data.data)
          } else {
            this.toastText(res.message, 'top')
          }
        }).catch(err => {
          this.loading = false
          this.$refs['view-page'].loaded()
        })
      }
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
    isClosed(){
      return this.$store.state.main.closeMask
    },
  }
}
</script>

<style lang="less" type='text/less' scoped>
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
        height: 1.44rem;

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
      position: relative;
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
