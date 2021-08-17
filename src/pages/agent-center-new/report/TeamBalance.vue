<template>
	<div>
		<div class="content-body">
			<div class="view-box search-box theme-header-bg" :class="{'theme-border-1px':$config.blackTheme || $config.newQP,'theme-border-white':$config.blush}">
		        <span class="search-icon icon iconfont h5-icon-sousuotubiao theme-color theme-color-yellow"></span>
		        <van-field v-model="username" :class="['input theme-header-bg',{'black-input' : $config.blackTheme || $config.newQP || $config.blush}]" type="text" placeholder="输入帐号可以进行筛选" clearable @blur="onSearch"></van-field>
		        <span class="date theme-color-white" @click="showDateSelector=true">{{targetDate&&targetDate.name}}</span>
		        <span class="date-icon icon iconfont h5-icon-qushi-moreup theme-color-white" @click="showDateSelector=true"></span>
		  </div>
      <ul class="type-tab theme-main-bg-5 theme-after-border-color">
        <li class="type-tab-item" v-for="(type, i) in types" :key="i" :class="[{'active theme-bg theme-yellow-bg-2 theme-color-black':i===currentTabIndex},{'theme-color-white' :i!==currentTabIndex }]"
            @click="changeTab(type,i)">{{type.name}}
        </li>
      </ul>
      <div class="item-list">
        <transition-group :name="animationList" class="animation-list" tag="p" ref="animationList">
          <div class="list-content" :key="'wap'+currentTabIndex">
            <list-view class="view-box theme-main-bg-5  list" style="margin-top: 0;padding: 0;" 
            @load-top="onRefresh" @load-down="onLoadMore" 
            ref="list" :noMore="noMore" :style="{height:(scrollHeight-(otherHeight*rem))+'px'}">
              <div class="view-box theme-main-bg-5" style="margin: 0 auto;border-top-left-radius: 0;border-top-right-radius: 0; height: auto;">
                <ul v-if="list.length > 0">
                  <li class="list-item theme-after-border-color" v-for="(item, i) in list" :key="i">
                    <p class="list-item-col">
                      <span class="name theme-color-white">{{item['username']}}</span>
                      <span class="time">{{item['created_at']}}</span>
                    </p>
                    <p class="list-item-col">
                      <span class="money" :class="[item['type'], item['subType']]"  v-if="item['money']">{{(item['money']*1).toFixed(2)}}</span>
                      <span class="money" :class="[item['type'], item['subType']]"  v-else-if="item['givemoney']">{{(item['givemoney']*1).toFixed(2)}}</span>
                      <!-- <span class="type" v-if="item.username!==userInfo.userName||agencyType==='shareholder'"
                            :class="[item['type'], item['subType']]">{{typeMap[item['type']][item['subType']]}}</span> -->
                      <span class="type hse" v-if="item.type"
                            :class="[item['type'], item['subType']]">{{item['cn_desc']}}</span>      
                    </p>
                  </li>
                </ul>
                <div v-else class="noMore">
                  <img style="width: 100%;" :class="types.length>0?'showTabs':'hideTabs'" :src="noDataImg" alt/>
                  <p class="theme-color-white" style="font-size: 0.3rem;color: #666666">暂无数据</p>
                 </div>
                 <p v-if="totalCount > 5" style="font-size: 0.26rem; line-height: 0.84rem; color: #000;text-align: center;">
                  已显示最近{{totalCount}}条记录
                  </p>
              </div>
            </list-view>
          </div>
        </transition-group>
      </div>
      <div class="footer theme-main-bg-5">
        <ul class="all" v-if="parseFloat(withdrawalsAmount)!=0||parseFloat(depositAmount)!=0">
          <template v-if="currentTabIndex==0">
            <li class="all-item" v-show="parseFloat(depositAmount)!=0" :class="{'current':parseFloat(depositAmount)!=0 && parseFloat(withdrawalsAmount)==0}">
              <span class="label theme-color-white">存款:</span>
              <span class="money red" :class="{red:parseFloat(depositAmount)}">{{depositAmount}}</span>
            </li>
            <li class="all-item" v-show="parseFloat(withdrawalsAmount)!=0" :class="{'current':sy}">
              <span class="label theme-color-white" >提现:</span>
              <span class="money red" :class="{red:parseFloat(withdrawalsAmount)}">{{withdrawalsAmount}}</span>
            </li>
          </template>
          <template v-else>
            <li class="all-item" v-show="currentTabIndex==0 || currentTabIndex==1" :class="{'current':currentTabIndex==1}">
              <span class="label theme-color-white">存款:</span>
              <span class="money red" :class="{red:parseFloat(depositAmount)}">{{depositAmount}}</span>
            </li>
            <li class="all-item" v-show="currentTabIndex!==1" :class="{'current':currentTabIndex==2}">
              <span class="label theme-color-white">提现:</span>
              <span class="money red" :class="{red:parseFloat(withdrawalsAmount)}">{{withdrawalsAmount}}</span>
            </li>
          </template>
          
        </ul>
      </div>
		</div>
		<agency-date-selector :newQP="$config.blackTheme || $config.newQP" v-model="targetDate" @getDefaultIndex="getDefaultIndex"  :show.sync="showDateSelector" :default-index="defaultIndex || 0" :isZs='isZs' @okSelect ='getData'></agency-date-selector>
	</div>
</template>
<script>
import AgencyDateSelector from '@src/components/agency-date-selector/AgencyDateSelector'
export default {
	name: 'TeamBalance',
	components: {AgencyDateSelector},
	props:{
		tabIndex: {
	      type: Number,
	      default: 0
      },
    scrollHeight:{
        type:Number,
        default: 0
    }  
	},
	data () {
		return {
      typep: 0,
      otherHeight:2.3,
      noMore:false,
      typeIndex:0,
      // scrollHeight:350,
			dates: [],
      list:[],
			showDateSelector: false,
			username: this.$store.state.user.userNameOfReport,
			targetDate: null,
			defaultDateIndex:0,
			defaultIndex:0,
      loading:false,
      limit: 20,
      page: 1,
      totalCount:0,
      currentTabIndex:0,
      animationList:'slide-right',
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
      types:[
          {
            name: '全部',
            code: 'amountAll'
          },
          {
            name: '存款',
            code: 'deposit'
          },
          {
            name: '提现',
            code: 'withdrawals'
          }
        ],
        depositAmount: '0.00',
        withdrawalsAmount: '0.00',
        memberBonus: '0.00',
        currentPage:1
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
    sy(){
      return parseFloat(this.withdrawalsAmount)!=0 && parseFloat(this.depositAmount) == 0
    },
    isZs(){
        if(this.personalMode === "mode_b"){
            return false;
        }else{
            return true;
        }
    }
  },
	watch:{
    currentTabIndex:{
      handler:function(val,old){
      if(val < old){
        this.animationList = 'slide-right'
      }else{
        this.animationList = 'slide-left'
      }
      this.totalCount = 0;
      //this.onRefresh()
      },
      deep:true
    },
  },
	created (){
    if(localStorage.TeamDateIndex){
      this.defaultIndex = 0;
      this.defaultDateIndex = parseInt(localStorage.TeamDateIndex);
    }
	},
	mounted(){
    setTimeout(() => {
        this.onRefresh();
    });
  },
	methods:{
    getData( date, dateIndex, zsType){
      this.defaultIndex = dateIndex;
      this.typep = zsType
      this.targetDate = date
      this.totalCount = 0;
      this.onRefresh()
    },
    // dateSelect(index){
    //   localStorage.TeamDateIndex = index;
    //   this.defaultDateIndex =index
    //   //this.onRefresh();
    // },
    changeTab(item,i){
      this.currentTabIndex = i;
      this.list = [];
      this.totalCount = 0;
      this.onRefresh();
    },
		  getDefaultIndex(index){
	      this.defaultDateIndex = index;
	    },
		  onSearch () {
        this.$store.commit('user/setUserNameOfReport', this.username)
	      this.onRefresh()
	    },
	    onRefresh () {
         if (this.targetDate){
          this.loading = false
          this.page = 1
          this.currentPage = 1;
          this.depositAmount = 0.00;
          this.withdrawalsAmount = 0.00;
          this.memberBonus = 0.00;
          this.noMore = false
          this.loadList();
         }
	    },
      onLoadMore(){
        this.loadList();
      },
      //数据加载函数
      loadList(){
        const data = {}
        if (this.targetDate && !this.noMore) {
          //校验是否选择了日期和是否有更多数据
        data.startTime = this.targetDate.start
        data.endTime = this.targetDate.end
        } else {
          return
        }
        this.loading = true
        data.username = this.username
        data.limit = this.limit
        data.page = this.page
        if(this.isZs){
          data.typep = this.typep
        }
        //设置查询类型
        data.type = this.types[this.currentTabIndex].code
        if(this.page == 1){
          this.toastLoading('加载中');
        }
        this.currentPage = this.page;
        this.$store.dispatch('agency/AgencyFinanceList', data).then(res =>{
          this.loading = false
          if (res.code === 200) {
            this.$refs['list'].loaded()
            if (res.data.data.length) {
              if(res.data.data.length < this.limit){
                //当数据小于当前限制行数的时候，设置没有更多数据
                this.noMore = true;
              }
              this.page = this.page +1;
              1 == this.currentPage ? this.list = res.data.data : this.list = this.list.concat(res.data.data);
              this.depositAmount = res.data.depositAmount;
              this.withdrawalsAmount = res.data.withdrawalsAmount;
              this.memberBonus = res.data.memberBonus;
              if(parseFloat(this.withdrawalsAmount)!=0||parseFloat(this.depositAmount)!=0||parseFloat(this.memberBonus)!=0){this.otherHeight=3.43}
              this.totalCount = this.totalCount + res.data.data.length;
            }else{
              if(this.page === 1){
                this.list = [];
                
              }
            }
            let item = {
              teamBalance: res.data.teamBalance,
              teamCommission: res.data.teamCommission,
              teamProfit: res.data.teamProfit
            }
            this.$root.$emit("requestEvent",item);
          }
        }).catch(err => {

        }).finally(()=>{
            this.toastClear();
            this.$refs['list'].scrollToRefresh();
        });
      }
	},
	beforeDestroy(){

	}
}
</script>
<style lang="less" type='text/less' scoped>
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
                .hse{
                  color:#a3a3a3 !important;
                  font-size: 0.24rem;
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
                  color: #E71414;

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
        &.black-input {
          /deep/ .van-field__control {
            color: #fff;
          }
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
        right: 0rem;
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
      position:fixed;
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
        .current{
             flex: 1;
             justify-content: flex-end;
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