<template>
    <div class="content-body">
        <div class="tab-view" v-if="dataType !== 'all'">
            <div class="view-box search-row theme-header-bg theme-border-1px">
                <span class="search-icon icon iconfont h5-icon-sousuotubiao theme-color theme-color-yellow"></span>
                <van-field v-model="username" :class="['input theme-header-bg theme-color-white',{'black-input' : $config.blackTheme || $config.newQP}]" type="text" placeholder="输入帐号可进行筛选" clearable @blur="onSearch"></van-field>
            </div>
        </div>
        <ul class="type-tab-list theme-main-bg-5 theme-after-border-color" v-if="dataType === 'all'">
            <!--7日以上数据表头-->
            <li class="type-tab-item" v-for="(type, j) in dayTitle" :key="j">
                {{type.name}}
            </li>
        </ul>
        <ul class="type-tab-list theme-main-bg-5 theme-after-border-color" v-if="dataType === 'day'">
            <li class="type-tab-item" :class="[{'active theme-bg theme-yellow-bg-2 theme-color-black':j===tabIndex},{'theme-color-white' :j!==tabIndex }]" v-for="(type, j) in otherTypes" @click="onTabChage(j)" :key="j">
                {{type.name}}
            </li>
        </ul>
        <div class="item-list">
            <transition-group :name="animationList" class="animation-list" tag="p" ref="animationList">
                <div class="list-content" :key="'chess_all_wap_'+tabIndex" v-if="dataType === 'all'">
                    <!--7日以上数据内容-->
                    <list-view class="list-view" style="margin-top: 0;padding: 0;" :noMore="true" @load-top="onRefreshDay" @load-down="onRefreshDay" 
                    ref="all-list" :style="{height:(scrollHeight-(allOtherHeight*rem))+'px'}">
                    <div class="view-box theme-main-bg-5" style="margin: 0 auto;padding:0;border-top-left-radius: 0;border-top-right-radius: 0">
                        <template v-if="list.length > 0">
                            <ul class="record-table content clear-fix theme-after-border-color" v-for="(item, i) in list" :key="'item_' + i" @click="getOneDay(item)">
                                <li class="item date detail-color theme-color-white">
                                    <p class="day">{{item.date.date.slice(5,item.date.date.length)}}</p>
                                    <p class="week">{{item.date['week']}}</p>
                                </li>
                                <li class="item count theme-color-white">{{item['bet_count']}}</li>
                                <li class="item money theme-color-white">{{item['bet_amount']}}</li>
                                <li class="item win-or-lose" :class="{'red':parseFloat(item['bet_win_amount'])>=0,'green':parseFloat(item['bet_win_amount'])<0}">{{item['bet_win_amount']}}</li>
                            </ul>
                        </template>
                        <template v-else>
                            <div :style="{height:(scrollHeight-(allOtherHeight*rem))+'px'}">
                                <img style="width: 100%;margin-top: 1rem;" :src="noDataImg" alt />
                                <p class="theme-color-white" style="font-size: 0.3rem;color: #666666">暂无数据</p>
                            </div>
                        </template>
                    </div>
                </list-view>
                </div>
                <!--某一天天的数据-->
                <div class="list-content" :key="'lottery_wap_'+tabIndex" v-if="dataType === 'day'">                    
                    <list-view class="list-view" style="margin-top: 0;padding: 0;" 
                        @load-top="onRefresh" @load-down="onLoadMore" 
                        ref="list" :noMore="noMore" :style="{height:(scrollHeight-(otherHeight*rem))+'px'}">
                        <div class="view-box theme-main-bg-5" style="margin: 0 auto;border-top-left-radius: 0;border-top-right-radius: 0">
                            <ul style="margin-top: 0;" v-if="list.length">
                                <li class="recode-item theme-after-border-color" @click="onItemClick(item)" v-for="(item, k) in list" :key="k">
                                    <div class="recode-item-col">
                                        <p class="info-row">
                                            <span class="user-name theme-color-white">{{item['userName']}}</span>
                                        </p>
                                        <p class="info-row">
                                            <span class="bet theme-color-yellow" style="margin-right:0.24rem;color:#000000;">{{ item.gameName }}</span>
                                            <span class="bet theme-color-gray-2">投注:{{item['validBetAmount']}}</span>
                                        </p>
                                        <p class="info-row">
                                            <span class="bet theme-color-gray-2" style="overflow: hidden; white-space: nowrap;text-overflow: ellipsis;font-size: 0.26rem;">{{ item.platform+'('+item.billNo+')' }}</span>
                                        </p>
                                    </div>
                                    <div class="recode-item-col">
                                        <p class="commission">
                                            <span class="commission-value nolmar theme-color-gray-2">{{ dayJs.unix(item.betTime).format('MM-DD HH:mm:ss') }}</span>
                                        </p>
                                        <p class="commission">
                                            <span class="commission-label"></span>
                                            <span class="commission-value" v-if="item.status==1">{{item['netAmount']}}</span>
                                            <span class="commission-value less" v-else-if="item.status==2">{{item['netAmount'].replace('-','')}}</span>
                                        </p>
                                        <span class="status-ball icon iconfont" :class="statusOther[item['status']].class">
                                            <!-- {{statusLottery[item['status']][0]}}
                                            {{ statusLottery[item] }} -->
                                        </span>
                                    </div>
                                </li>
                            </ul>
                            <div v-else :style="{height:(scrollHeight-(otherHeight*rem))+'px'}">
                                <img style="width: 100%;margin-top: 1rem;" :src="noDataImg" alt />
                                <p class="theme-color-white" style="font-size: 0.3rem;color: #666666">暂无数据</p>
                            </div>
                            <p v-if="totalCount > 5" class="theme-color-white" style="font-size: 0.26rem; line-height: 0.84rem; color: #000;text-align: center;">
                            已显示最近{{totalCount}}条记录
                            </p>
                        </div>
                    </list-view>
                    
                </div>
            </transition-group>
            <div v-if="dataType === 'day'" class="box-amount" :key="'lottery_wap_total_'+tabIndex">
                <ul class="amount theme-header-bg">
                    <li class="amount-item">
                        <span class="item-label theme-color-white">投注:</span>
                        <span class="item-value" :class="{red:parseFloat(oneDayAmount['total_bet'])>=0,green:parseFloat(oneDayAmount['total_bet'])<0}">
                            {{ oneDayAmount['total_bet']||'0.00'}}
                        </span>
                    </li>
                    <li class="amount-item">
                        <span class="item-label theme-color-white">输赢:</span>
                        <span class="item-value" :class="{red:parseFloat(oneDayAmount['total_win'])>=0,green:parseFloat(oneDayAmount['total_win'])<0}">
                            {{ oneDayAmount['total_win']||'0.00'}}
                        </span>
                    </li>
                </ul>
            </div>
            <div v-if="dataType === 'all'" class="box-amount" :key="'lottery_all_wap_total_'+tabIndex">
                <ul class="amount theme-header-bg">
                    <li class="amount-item">
                        <span class="item-label theme-color-white">投注:</span>
                        <span class="item-value" :class="{red:parseFloat(dayTotalAmount['total_bet'])>=0,green:parseFloat(dayTotalAmount['total_bet'])<0}">
                            {{ dayTotalAmount['total_bet']||'0.00'}}
                        </span>
                    </li>
                    <li class="amount-item">
                        <span class="item-label theme-color-white">输赢:</span>
                        <span class="item-value" :class="{red:parseFloat(dayTotalAmount['total_win'])>=0,green:parseFloat(dayTotalAmount['total_win'])<0}">
                            {{ dayTotalAmount['total_win']||'0.00'}}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    name: 'AgentBetFish',
    props:{
        parentTabIndex: {
          type: Number,
          default: 0
        },
        scrollHeight:{
            type:Number,
            default: 0
        },
        userId:{
            type:Number,
            default: 0
        },
        dataType:{
            type:String,
            default: 'day'
        }
    },
    data () {
        return {
            list:[],
            date:null,
            username:null,
            tabIndex:0,
            noMore:false,
            otherHeight:3.3,
            allOtherHeight:2.2,
            animationList:'slide-right',
            utype:0, //是否直属
            //dataType:'day',//all表示7日以上的数据查询,day表示查询7天内的数据，此字段控制显示格式
            otherTypes: [{
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
                }
            ],
            dayTitle: [{
                    name: '时间',
                    key: 'time'
                },
                {
                    name: '笔数',
                    key: 'count'
                },
                {
                    name: '下注',
                    key: 'money'
                },
                {
                    name: '输赢',
                    key: 'winOrLose'
                }
            ],
            statusOther: [
                { name: '待', class :'h5-icon-result-wait'},
                { name: '赢', class :'h5-icon-result-win'},
                { name: '输', class :'h5-icon-result-lose'},
                { name: '和', class :'h5-icon-result-sum'},
                { name: '撤', class :'h5-icon-result-withdraw'},
                { name: '撤', class :'h5-icon-result-withdraw'},
            ],
            dayTotalAmount:{//7日以上数据统计
                total_bet: '0.00',
                total_win: '0.00'
            },
            oneDayAmount:{//当天明细数据统计
                total_bet: '0.00', 
                total_win: '0.00'
            },
            limit:20,
            page:1,
            totalCount:0 //每日数据总数
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
    },
    watch:{
        tabIndex:{
          handler:function(val,old){
              if(val < old){
                this.animationList = 'slide-right'
              }else{
                this.animationList = 'slide-left'
              }
          },
          deep:true
        },
    },
    created (){
        this.username = this.$store.state.user.userNameOfAgent
    },
    mounted(){
        var _this = this;
        this.$root.$off("FishLoadEvent").$on("FishLoadEvent",item=>{
            //彩票数据加载事件发布
            _this.date = item.date;
            _this.utype = item.utype;
            //_this.dataType = item.dataType;
            _this.list = [];
            _this.init();
        });
    },
    methods:{
        init(){
            setTimeout(()=>{
                if(this.dataType === 'day'){
                    this.onRefresh();
                }else{
                    this.getOhterDayList();
                }
            },100);
        },
        getBillNo(val){
            return val.substring(0,18)+'...';
        },
        onTabChage(val){
            this.tabIndex = val;
            this.list = [];
            this.onRefresh();
        },
        onItemClick(item){
            this.$store.state.agency.recodeItem = item
            this.$router.push('/user/agency-center-new/recode/info/FISH');
        },
        onRefresh(){
            //下拉刷新数据
            this.totalCount = 0;
            this.page = 1;
            this.loadMore(true);
        },
        onLoadMore(){
            //上拉加载更多
            this.loadMore();
        },
        getOneDay(item){
            //查询7日以上的数据，点击跳转查询某一天的数据列表
            this.$router.push({
                path:'/user/agency-center-new/bet-day',
                query:{
                    zsType: this.utype,
                    gameType: 'Lottery',
                    parentTabIndex:0,
                    date: item.date.date,
                    dateOkName: item.date.date.slice(5, item.date.date.length)
                }
            });
        },
        onSearch() {
            //数据搜索
            this.$store.commit('user/setUserNameOfAgent',this.username)
            this.onRefresh();
        },
        onRefreshDay(){
            this.getOhterDayList();
        },
        getOhterDayList(){
            //获取7日以上的数据
            const data = {
                start: this.date.start,//开始日期
                end: this.date.end,//结束日期
                game: 0,//游戏类型
                type:1,
                typep: this.utype
            }
            this.toastLoading('加载中');
            this.$store.dispatch('user/getAgentBetDay2',data).then(res =>{
                if (res.code == 200) {
                    this.$refs['all-list'].loaded();
                    this.list = res.data.list;
                    this.dayTotalAmount = res.data.amount;
                }else {
                    this.list = []
                    this.dayTotalAmount = {
                        total_bet: 0.00,
                        total_win: 0.00
                    }
                }
            }).catch(err => {
                this.toastText('获取数据失败', 'top');
            }).finally(()=>{
                this.toastClear();
                this.$refs['all-list'].scrollToRefresh();
            });
        },
        loadMore(status) {
            //获取一天的投注记录
            const data = {
                gameType: 'FISH',
                time_start: this.date.start,
                time_end: this.date.end,
                limit: this.limit,
                page: this.page,
                type: this.utype, //是否直属
                status:this.otherTypes[this.tabIndex].status
            }
            if(!!this.username){
                data.userName = this.username;
                data.query_type = 1
            }else{
                delete data.userName
                delete data.query_type
            }
            if(this.userId > 0){
                data.uid = this.userId;
                data.query_type = 1
            }else{
                delete data.uid
                delete data.query_type
            }
            if(this.page == 1){
              this.toastLoading('加载中');
            }
            this.$store.dispatch('agency/agencyGameRecords', data).then(res => {
                if (res.code === 200) {
                    this.$refs['list'].loaded();
                    if (res.data && res.data.data && res.data.data.length) {
                        if(res.data.data.length < this.limit){
                            //当数据小于当前限制行数的时候，设置没有更多数据
                            this.noMore = true;
                        }
                        this.totalCount = this.totalCount + res.data.data.length;
                        this.page = this.page +1;
                        if (status) {
                            //第一次加载
                            this.list = res.data.data;
                        }else{
                            this.list = this.list.concat(res.data.data);
                        }
                    }else{
                        this.totalCount = 0;
                        this.list = [];
                    }
                    this.oneDayAmount = res.data.amount;
                }else{
                    this.totalCount = 0;
                    this.list = [];
                }
            }).catch(err => {

            }).finally(() => {
                this.toastClear();
                this.$refs['list'].scrollToRefresh();
            });
        }
    },
    beforeDestroy(){
        this.toastClear();
    }
}
</script>
<style lang="less" type='text/less' scoped>
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

.content-body {
    width: 100%;
    .animation-list{
        position: relative;
        left: 0;
        top: 0;
        width: 100%;
        .list-content{
            width:100%;
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
            width: 100%/3;
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
        padding: 0.06rem 0 0.16rem 0;
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
                margin-bottom: 0.12rem;
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
                    font-size: 0.28rem;
                    color: #888888;
                    line-height: 0.33rem;
                    max-width: 4.7rem;
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
        position: absolute;
        bottom:0;
        width: 100%;
        display: block;
        z-index: 99;
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
        border-bottom: 0.02rem solid #ebedf0;
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
            width: 25%;

            .day {
                line-height: 0.6rem;
            }

            .week {
                line-height: 0.3rem;
                padding-bottom: 0.1rem;
            }
        }

        &.count {
            width: 25%;
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