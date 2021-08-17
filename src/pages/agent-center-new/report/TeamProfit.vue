<template>
	<div>
		<div class="content-body">
			   <!-- <div class="view-box search-box only-date">
		        <span class="date" @click="showDateSelector=true">{{targetDate&&targetDate.name}}</span>
		        <span class="date-icon icon iconfont h5-icon-qushi-moreup" @click="showDateSelector=true"></span>
		     </div> -->
         <scroll-box :style="{height:(scrollHeight -(0.35*rem))+'px'}">
          <ul class="team-win">
            <li class="team-win-item view-box theme-main-bg-5" v-for="(item, i) in list" :key="i" @mousedown="toRecode(item.type,i)">
                <div class="bmg theme-agent-tab theme-yellow-bg-2" v-if="item.type">
                    <span class="team-win-item-label theme-color-black" :class="item.type.toString().toLowerCase()+'Type'">{{item.name}}</span>
                  </div>
                  <p class="team-win-item-col">
                    <span class="team-win-item-money theme-color-white">{{item.betAmount||'0.00'}}</span>
                    <span class="team-win-item-title theme-color-white">投注</span>
                  </p>
                  <p class="team-win-item-col">
                    <span class="team-win-item-money" :class="{red:parseFloat(item.netAmount)>0,green:parseFloat(item.netAmount)<0}">{{item.netAmount||'0.00'}}</span>
                    <span class="team-win-item-title theme-color-white">输赢</span>
                  </p>
            </li>
          </ul>
         </scroll-box>
		</div>
	</div>
</template>
<script>
import AgencyDateSelector from '@src/components/agency-date-selector/AgencyDateSelector'
export default {
	name: 'TeamProfit',
	props:{
		 tabIndex: {
	      type: Number,
	      default: 1
      },
     selectedDate :{
       type:Object
     },
     dateType: {
       type: Number,
       default : 0
     },
     scrollHeight:{
        type:Number,
        default: 0
    }
	},
	data () {
		return {
      typep: 0,
      isZs: true,
      dates: [],
      otherHeight:1.5,
      // scrollHeight:450,
      list:[],
      noMore:false,
      loading:false,
			showDateSelector: false,
			username:null,
			targetDate: null,
			defaultIndex:0,
		}
	},
	computed:{
  },
	watch:{
    
  },
	created (){
    if(this.selectedDate){
      this.targetDate = this.selectedDate;
    }
    //debugger
    if(localStorage.TeamDateIndex){
      this.defaultIndex = parseInt(localStorage.TeamDateIndex);
      this.defaultDateIndex = parseInt(localStorage.TeamDateIndex);
    }
		// var screenHeight = window.screen.height; //获取屏幕分辨率高度
    //   if(this.$mobileDevice.isIOS){
    //     if(screenHeight == 896){//iphone Xp
    //       this.scrollHeight = screenHeight-400;
    //     }else if(screenHeight == 667){//苹果6
    //       this.scrollHeight = screenHeight-311;
    //     }else if(screenHeight == 812){//iphone x
    //       this.scrollHeight = screenHeight-399;
    //     }else if(screenHeight == 736){//iphone 8
    //       this.scrollHeight = screenHeight-332;
    //     }
    //   }else if(this.$mobileDevice.isAndroid){
    //     if(screenHeight == 780){
    //       this.scrollHeight = screenHeight-380;
    //     }
    //   }
	},
	mounted(){
    //this.loadList();
    var _this = this;
    this.$root.$off("TeamProfitLoadEvent").$on("TeamProfitLoadEvent",item=>{
      _this.defaultIndex = item.defaultIndex;
      _this.targetDate = item.date;
      _this.loadList();
    });
  },
	methods:{
    
    loadList(){
      const data = {}
      if (this.targetDate && !this.noMore) {
        //校验是否选择了日期和是否有更多数据
      data.startTime = this.targetDate.start
      data.endTime = this.targetDate.end
      data.type = 'GroupEarnings';
      } else {
        return
      }
      this.loading = true
      this.toastLoading('加载中');
      this.$store.dispatch('agency/AgencyFinanceList', data).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.list = res.data.data;
          if(this.$config.home == 'tc'){
            this.list = this.list.filter(ff=>{
              return ff.type == "LOTTERY" || ff.type == "CHESS"
            })
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
      });
    },
    toRecode(type,i){
      if (type){
        var parentTabIndex = 0;
        var targetComponent = 'Lottery'
        if(type === 'SLOT'){
          parentTabIndex = 3;
          targetComponent = 'Electronic';
        }else if(type === 'LIVE'){
          parentTabIndex = 2;
          targetComponent = 'Live';
        }else if(type === 'SPORT'){
          parentTabIndex = 4;
          targetComponent = 'Sport';
        }else if(type === 'CHESS'){
          parentTabIndex = 1;
          targetComponent = 'Chess';
        }
        var selectType = 'day';
        if(this.defaultIndex >= 2){
          selectType = 'all';
        }
        // this.$router.push({path:`/user/agency-center-new/recode/report/${type}`,query:{id:i,date:this.defaultDateIndex}})
        this.$router.push({ path:'/user/agency-center-new/bet', query:{
          parentTabIndex: parentTabIndex,
          targetComponent: targetComponent,
          selectType: selectType,
          defaultIndex: this.defaultIndex,
          date: JSON.stringify(this.targetDate) || JSON.stringify({
              name: '今天',
              start: this.dayJs().format('YYYY-MM-DD'),
              end: this.dayJs().format('YYYY-MM-DD')
          })
        }})
      }
      else {
        this.$router.push('/user/agency-center-new/recode')
      }
    },
    formartCode(i){
      switch (i) {
        case 0: 
          return 3
        case 1:
          return 2
        case 2:
          return 4
        case 3:
          return 0
        case 4:
          return  1
        default:
          return 3
      }
    }
	},
	beforeDestroy(){

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
          margin-top: 0.24rem;
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
                    border-bottom: 0.02rem solid #E7E7E7;
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
        &.view-box{
          &:first-child {
             margin: 0 auto;
          }
        }
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
