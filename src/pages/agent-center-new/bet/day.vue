<template>
	<view-page class="agent-bet theme-header-bg" ref="view-page" full-box @scroll-height-change="scrollHeight=$event" no-scroll>
		<title-header title="投注记录" class="theme-main-bg theme-header-bottom" slot="header" backEvent @back="goback()">
	        <div class="header-right" slot="right">
	            <span>{{dataStr(dateOkName)}}</span>
	        </div>
	    </title-header>
	    <div slot="header-static" :class="['theme-header-bg',{'black-tab' : $config.blackTheme || $config.newQP}]" style="padding: 0.2rem 0 0 0;">
	        <van-tabs v-model="parentTabIndex" :line-height="2" :swipe-threshold="6" @change="onParentChage()">
	            <van-tab v-for="(tab, i) in ($config.home === 'tc' ? tcTabs : tabs)" :key="i" :title="tab.name"></van-tab>
	        </van-tabs>
	    </div>
	    <div class="record-content" slot="content">
	    	<component :dataType="dataType" :key="'day_list_'+parentTabIndex" v-bind:is="targetComponent" :parentTabIndex="parentTabIndex" :scrollHeight="scrollHeight"></component>
	    </div>
	    <div slot="static">
	    </div>
	</view-page>
</template>
<script type="text/javascript">
import Lottery from './type/lottery.vue'
import Live from './type/live.vue'
import Chess from './type/chess.vue'
import Sport from './type/sport.vue'
import Electronic  from './type/electronic.vue'
import Fish from './type/fish.vue'
export default {
	name: 'AgentDayBet',
	components: {
		Lottery,
		Live,
		Chess,
        Electronic,
        Sport,
        Fish
	},
	data () {
		return {
            dateOkName:null,
			date:null,
            queryDate:null,
			defaultIndex: 0,
            showDateSelector: false,
			targetComponent:'Lottery',
			parentTabIndex:0,
			scrollHeight: 0,
			zsType:0,
            dataType:'day',
			tabs:[
		      {
		        name: '彩票',
		        type: 'Lottery'
		      },
		      {
		        name: '棋牌',
		        type: 'Chess'
		      },
		      {
		        name: '视讯',
		        type: 'Live'
              },
              {
		        name: '捕鱼',
		        type: 'Fish'
		      },
		      {
		        name: '电子',
		        type: 'Electronic'
		      },
		      {
		        name: '体育',
		        type: 'Sport'
		      }
            ],
            tcTabs:[
		      {
		        name: '彩票',
		        type: 'Lottery'
		      },
		      {
		        name: '棋牌',
		        type: 'Chess'
		      }
		    ]
		}
	},
	computed:{},
	watch: {},
	created(){
        // this.$store.commit('user/setUserNameOfAgent', '')
        if(localStorage['AgentBetDayTempSave']){
            //当有缓存的时候读取缓存
            var tempSave = JSON.parse(localStorage['AgentBetDayTempSave']);
            this.parentTabIndex = Number(tempSave.parentTabIndex);
            this.targetComponent = tempSave.targetComponent;
            this.zsType = this.$route.query.zsType;
            this.queryDate = this.$route.query.date;
            this.dateOkName = this.$route.query.dateOkName;
            this.date = {
                start: this.queryDate,
                end: this.queryDate
            }
        }else{
            this.zsType = this.$route.query.zsType;
            this.parentTabIndex = Number(this.$route.query.parentTabIndex);
            this.targetComponent = this.$route.query.gameType;
            this.queryDate = this.$route.query.date;
            this.dateOkName = this.$route.query.dateOkName;
            this.date = {
                start: this.queryDate,
                end: this.queryDate
            }
        }
    },
	mounted(){
		setTimeout(()=>{
			this.initData(this.date);
		},100)
	},
	methods:{
        dataStr(v){
            if(v){
                return v.replace('-','月')+'日';
            }
            return '';
        },
		initData(date){
			var item = {
				date: date,
				utype: this.zsType
			};
			var betType = this.tabs[this.parentTabIndex];
			if(betType.type === 'Lottery'){
				this.$root.$emit("LotteryLoadEvent",item);
			}else if(betType.type === 'Chess'){
                this.$root.$emit("ChessLoadEvent",item);
            }else if(betType.type === 'Live'){
                this.$root.$emit("LiveLoadEvent",item);
            }else if(betType.type === 'Fish'){
                this.$root.$emit("FishLoadEvent",item);
            }else if(betType.type === 'Electronic'){
                this.$root.$emit("ElectronicLoadEvent",item);
            }else if(betType.type === 'Sport'){
                this.$root.$emit("SportLoadEvent",item);
            }
		},
        localSave(){//将页面信息存放到本地缓存
            var tempSave = {
                date: this.date, //时间对象
                dataType: this.dataType, //数据类型
                zsType: this.zsType,//直属表示
                parentTabIndex: this.parentTabIndex,//游戏分类选择下标
                targetComponent: this.targetComponent //存放组件名称
            }
            localStorage['AgentBetDayTempSave'] = JSON.stringify(tempSave);
        },
        onParentChage(){
        	//游戏分类切换
        	var betType = this.tabs[this.parentTabIndex];
            this.targetComponent = betType.type; //切换组件
            this.localSave();
            setTimeout(()=>{
                this.initData(this.date);
            },100);
        },
        goback(){
            //销毁删除缓存
            delete localStorage.AgentBetDayTempSave
            this.$router.back();
        }
	},
	beforeDestroy(){}
}
</script>
<style lang="less" scoped>
.black-tab {
    /deep/ .van-tabs {
        .van-tabs__wrap{
            .van-tabs__nav {
                background: linear-gradient(0deg, #0C0C0C, #222222) !important;
                .van-tab {
                    color: #fff;
                }
            }
            .van-tab--active {
                color: #F6CF32 !important;
            }
            .van-tabs__line {
                background-color: #F6CF32 !important;
            }
        }
        &::after {
            border-color: #242424 !important;
        }
    }
  }
/deep/.vux-swiper {
    height: calc(100vh - 90px) !important;
}
/deep/ .van-tabs {
    .van-tab{
        font-size: 0.34rem !important;
    }
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

.agent-bet {
    .record-content {
        .animation-box {
            position: relative;
            left: 0;
            top: 0;
            width: 100%;

            .content-body {
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
        // border-bottom: 0.02rem solid #E7E7E7;
        position: relative;

        &::after {
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
            width: 25%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 0.3rem;
            // font-family: PingFang-SC-Medium, PingFang-SC;
            // font-weight: 500;
            color: #666666;

            &.active {
                font-size: 0.32rem;
                font-weight: 500;
                color: #ffffff;
                background-color: #2C93FF;
            }
        }

        .type-tab-item {
            &:first-child {
                width: 30%;
            }
        }
        .type-tab-item {
            &:nth-child(2) {
                width: 20%;
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
        // height: 1.54rem;
        padding: 0.24rem 0 0.16rem 0;
        display: flex;
        justify-content: stretch;
        align-items: stretch;
        // border-bottom: 0.02rem solid #E7E7E7;
        position: relative;

        &::after {
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

            &::after {
                border-bottom: 0;
            }
        }

        .recode-item-col {
            width: 100%;
            display: flex;
            justify-content: center;
            flex-direction: column;

            &:first-child {
                flex: 1;
                text-align: left;
                align-items: flex-start;
            }

            &:last-child {
                flex: 0.42;
                text-align: right;
                align-items: flex-end;
            }

            .commission {
                display: flex;
                color: #E71414;
                margin-bottom: 0.16rem;
                justify-content: flex-end;
                height: 0.4rem;
                .commission-label {
                    font-size: 0.28rem;
                    line-height: 0.4rem;
                    margin-right: 0.1rem;
                }

                .commission-value {
                    font-size: 0.28rem;
                    line-height: 0.42rem;
                }

                .less {
                    color: #00A054;
                }

                .nolmar {
                    color: #A3A3A3;
                    font-size: 0.24rem;
                }
            }

            .status-ball {
                width: 0.4rem;
                height: 0.4rem;
                // display: flex;
                // justify-content: center;
                // align-items: center;
                font-size: 0.32rem;
                // border-radius: 50%;
                // border: 0.02rem solid #A3A3A3;
                // color: #A3A3A3;
                flex-shrink: 0;
                &.h5-icon-result-false{
                     color: #00A054;
                }
                &.h5-icon-result-mid{
                     color: #E71414;
                }
                &.h5-icon-result-lose{
                     color: #00A054;
                }
                &.h5-icon-result-win{
                     color: #E71414;
                }
                &.h5-icon-result-wait{
                     color: #FF9700;
                }
                &.h5-icon-result-sum{
                     color: #722DF0;
                }
                &.h5-icon-result-withdraw{
                    color: #A3A3A3;
                }
            }

            .info-row {
                display: flex;
                width: 100%;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 0.16rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                .user-name {
                    font-size: 0.32rem;
                    color: #444444;
                    margin-right: 0.1rem;
                    line-height: 0.42rem;
                }

                .bet {
                    font-size: 0.26rem;
                    color: #888888;
                    line-height: 0.33rem;
                }

                .ball {
                    color: #000000;
                    font-size: 0.28rem;

                    >.code {
                        color: #E71414;
                    }
                }
            }

            .info-row:last-child {
                margin-bottom: 0;
            }

            // .time {
            //     font-size: 0.28rem;
            //     color: #999999;
            //     line-height: 0.4rem;
            //     margin-top: 0.16rem;
            // }
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

    .box-amount {
        box-shadow: 0px -6px 5px 0px rgba(0, 0, 0, 0.03);
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

        .amount_right {
            justify-content: flex-end !important;
        }
    }

    .amount_right {
        justify-content: flex-end !important;
    }
}

.content {
    color: #888888;
    font-size: 0.28rem;
    line-height: 1rem;
    position: relative !important;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;

    // &:before {
    //     content: '\E731';
    //     font-family: "iconfont", serif !important;
    //     font-style: normal !important;
    //     font-size: 0.44rem !important;
    //     line-height: 0.44rem !important;
    //     -webkit-font-smoothing: antialiased !important;
    //     color: #ADAFBB !important;
    //     display: block !important;
    //     height: 0.44rem !important;
    //     width: 0.44rem !important;
    //     position: absolute !important;
    //     right: 0.2rem;
    //     top: 50%;
    //     transform: translateY(-50%);
    // }

    &:after {
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0;
        bottom: 0;
        // top: 0;
        // left: 0.3rem;
        border-bottom: 0.03rem solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        width: 100%;
    }

    &:last-child::after {
        content: '';
        border: 0;
    }

    .item {
        position: relative;
        display: inline-block;
        float: left;

        &.date {
            width: 30%;

            .day {
                line-height: 0.6rem;
            }

            .week {
                line-height: 0.3rem;
                padding-bottom: 0.1rem;
            }
        }

        &.count {
            width: 20%;
        }

        &.money {
            width: 25%;
        }

        &.win-or-lose {
            width: 25%;
        }

    }

    .green {
        color: #00A054;
    }

    .red {
        color: #E71414;
    }
}
</style>