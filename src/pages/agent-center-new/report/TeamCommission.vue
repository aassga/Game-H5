<template>
	<div>
		<div class="content-body">
			<div class="view-box search-box theme-header-bg theme-border-1px">
		        <span class="search-icon icon iconfont h5-icon-sousuotubiao theme-color theme-color-yellow"></span>
		        <van-field v-model="username" :class="['input theme-header-bg',{'black-input' : $config.blackTheme || $config.newQP}]" type="text" placeholder="输入帐号可以进行筛选" clearable @blur="onSearch"></van-field>
		        <span class="date theme-color-white" @click="showDateSelector=true">{{targetDate&&targetDate.name}}</span>
		        <span class="date-icon icon iconfont h5-icon-qushi-moreup theme-color-white" @click="showDateSelector=true"></span>
		    </div>
		    <div class="item-list">
		    	<div class="list-content">
		    		<list-view class="view-box list theme-main-bg-5" style="margin-top: 0;padding: 0;" @load-top="onRefresh" 
		    		@load-down="onLoadMore" ref="list" :noMore="noMore" :style="{height:(scrollHeight-(otherHeight*rem))+'px'}">
		    			<div class="view-box theme-main-bg-5" style="margin: 0 auto;border-top-left-radius: 0;border-top-right-radius: 0; height: auto;">
		    				<ul v-if="list.length > 0">
		    					<li class="list-item theme-after-border-color" v-for="(item, i) in list" :key="i">
			                    <p class="list-item-col">
			                      <span class="name theme-color-white">{{item['betuname']}}</span>
			                      <span class="time">{{item['created_at']}}</span>
			                    </p>
			                    <p class="list-item-col">
			                      <span class="money" :class="[item['type'], item['subType']]"  v-if="item['money']">{{(item['money']*1).toFixed(2)}}</span>
			                      <span class="money" :class="[item['type'], item['subType']]"  v-else-if="item['givemoney']">{{(item['givemoney']*1).toFixed(2)}}</span>
			                      <span class="type hse" v-if="item.username!==userInfo.userName||agencyType==='shareholder'"
			                            :class="[item['type'], item['subType']]">{{item['cn_desc']}}</span>
			                    </p>
			                  </li>
		    				</ul>
		    				<div v-else class="noMore">
			                  <img style="width: 100%;margin-top: 1rem;" :src="noDataImg" alt/>
			                  <p class="theme-color-white" style="font-size: 0.3rem;color: #666666">暂无数据</p>
			                 </div>
		    			</div>
		    		</list-view>
		    	</div>
		    </div>
		    <div class="footer theme-main-bg-5">
		    	<ul class="all" v-if="parseFloat(refundCommission)!=0||parseFloat(wage)!=0||parseFloat(profit)!=0"  :class="{right:!(wageType || shareoutbonusType)}">
		          <li class="all-item">
		            <p class="label theme-color-white">返佣:</p>
		            <p class="money red" :class="{red:parseFloat(refundCommission)}">{{refundCommission}}</p>
		          </li>
		          <li class="all-item" v-if="wageType">
		            <p class="label theme-color-white">工资:</p>
		            <p class="money red" :class="{red:parseFloat(wage)}">{{wage}}</p>
		          </li>
		          <li class="all-item" v-if="shareoutbonusType">
		            <p class="label theme-color-white">分红:</p>
		            <p class="money red" :class="{red:parseFloat(profit)}">{{profit}}</p>
		          </li>
		        </ul>
		    </div>
		</div>

		<agency-date-selector :newQP="$config.blackTheme || $config.newQP" v-model="targetDate" @getDefaultIndex="getDefaultIndex"  :show.sync="showDateSelector" :default-index="defaultIndex || 0" @okSelect="getData" :isZs='isZs'></agency-date-selector>
	</div>
</template>
<script>
import AgencyDateSelector from '@src/components/agency-date-selector/AgencyDateSelector'
export default {
	name: 'TeamCommission',
	components: {AgencyDateSelector},
	props:{
		tabIndex: {
	      type: Number,
	      default: 1
    },
    scrollHeight:{
        type:Number,
        default: 0
    }    
	},
	data () {
		return {
      typep: 0,
			dates: [],
      list:[],
      otherHeight:1.5,
			// scrollHeight:445,
			showDateSelector: false,
			username:this.$store.state.user.userNameOfReport,
			targetDate: null,
			defaultDateIndex:0,
			defaultIndex:0,
			loading:false,
			limit: 20,
      		page: 1,
      		shareoutbonusType:1,
      		wageType:1,
      		noMore:false,
      		currentPage:1,
      		refundCommission: 0.00,
	        wage: 0.00,
	        profit: 0.00,
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
		}
	},
	computed:{
    isZs(){
        if(this.personalMode === "mode_b"){
            return false;
        }else{
            return true;
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
  },
	watch:{},
	created (){
    if(localStorage.TeamDateIndex){
      this.defaultIndex =0;
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
      this.onRefresh()
    },
		getDefaultIndex(index){
        localStorage.TeamDateIndex = index;
	      this.defaultDateIndex = index
	  },
		onSearch () {
        this.$store.commit('user/setUserNameOfReport', this.username)
	      this.onRefresh()
	    },
    onRefresh () {
      if (this.targetDate){
          this.loading = false
          this.page = 1
          this.refundCommission = 0.00;
          this.wage = 0.00;
          this.profit = 0.00;
          this.noMore = false
          this.loadList();
        }
    },
	    onLoadMore(){
	    	this.loadList();
	    },
	    loadList(){
	    	const data = {}
	        let that = this;
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
          data.type = 'commission'
          data.typep = this.typep
	        this.currentPage = this.page
          if(this.page == 1){
            this.toastLoading('加载中');
          }
	        this.$store.dispatch('agency/AgencyFinanceList', data).then(res =>{
	        	this.loading = false
          		if (res.code === 200) {
          			if (res.data.data.length) {
          				if(res.data.data.length < this.limit){
          					this.noMore = true;
          				}
          				this.shareoutbonusType = res.data.shareoutbonusType;
          				this.wageType = res.data.wageType;
                  this.refundCommission = res.data.refundCommission;
                  if(parseFloat(this.refundCommission)!=0) this.otherHeight=2.48
          				this.profit = res.data.profit;
          				this.wage = res.data.wage;
          				this.page = this.page + 1;
          				1 == this.currentPage ? this.list = res.data.data : this.list = this.list.concat(res.data.data);
          				this.$refs['list'].loaded();
          				
          			}else{
          				if(this.page === 1){
          					this.list = [];
          				}
          			}
                let item = {
                  teamBalance: res.data.teamBalance,
                  teamProfit: res.data.teamProfit,
                  teamCommission: res.data.teamCommission
                }
                this.$root.$emit("requestEvent",item);
          		}
	        }).catch(err => {

          }).finally(()=>{
              this.$refs['list'].scrollToRefresh();
              this.toastClear();
          });
	    }
	},
	beforeDestroy(){

	}
}
</script>
<style lang="less" type='text/less' scoped>
 .item-list{
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
              &:last-child{
              	border-bottom:none;
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

                }

                .deposit {
                  color: #E71414;
                }

                .withdrawals {
                  color: #00A054;
                }
                .hse{
                  color:#a3a3a3 !important;
                  font-size: 0.24rem;
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
      border-bottom: 0.02rem solid #E7E7E7;

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