<!-- 个人投注记录列表页面 某一天数据-->
<template>
<view-page :class="['recode','theme-main-bg',{'qp-recode' : $config.newQP || $config.blackTheme,'blush-recode':$config.blush}]" ref="view-page" full-box @scroll-height-change="scrollHeight=$event" no-scroll>
    <title-header title="投注记录" slot="header" backEvent @back="goback" class="theme-header-bottom theme-header-bg">
        <div class="header-right" slot="right">
            <span>{{dataStr(dateOkName)}}</span>
            <!-- <span v-if="dateOkIndex>=0" class="date-icon icon iconfont h5-icon-qushi-moreup"></span> -->
        </div>
    </title-header>
    <div slot="header-static"  style="margin-top:0.2rem">
        <van-tabs v-model="tabIndex" :line-height="2" :swipe-threshold="6" @click="changeTabs(tabIndex)" class="theme-after-border-color">
            <van-tab v-for="(tab, i) in tabs" :key="i" :title="tab.name"></van-tab>
        </van-tabs>
    </div>
    <div class="record-content" slot="content">
        <transition-group :name="animation" class="animation-box" tag="p" ref="animationBox">
            <div class="content-body" ref="solid" :key="'wrapper_' + tabIndex">
                <div>
                    <div v-for="(tab, i) in tabs" :key="i" :class="'tab_'+i" v-show="tabIndex == i">
                        <div class="tab-view">
                            <ul class="type-tab-list theme-gradient-bg theme-after-border-color">
                                <li class="type-tab-item" :class="[{'active theme-bg theme-yellow-bg theme-color-black':j===typeIndex[i],'theme-color-white':j!==typeIndex[i], 'type-tab-item': tab.type === 'LOTTERY' || tab.type === 'SPORT' , 'type-tab-item-one' : tab.type != 'LOTTERY'  && tab.type != 'SPORT'}] " @click="$set(typeIndex, i, j);$refs['swipeType'][i].swipeTo(j)" v-for="(type, j) in ((tab.type === 'LOTTERY') ? lotteryTypes : (tab.type == 'SPORT' ? sportTypes : otherTypes).filter(t => t.name))" :key="j">{{type.name}}
                                </li>
                            </ul>
                            <div class="item-list">
                                <van-swipe @change="taJ=>changeIndex(taJ,i)" :show-indicators="false" :loop="false" ref="swipeType">
                                    <van-swipe-item v-for="(type, j) in ((tab.type === 'LOTTERY') ? lotteryTypes : (tab.type == 'SPORT' ? sportTypes : otherTypes).filter(t => t.name))" :key="j">
                                        <list-view :ref="'list-' + i" class="list-view" style="padding: 0" :style="{height:(scrollHeight-(list[i]&&list[i][j]&&list[i][j].length ? 2.15 : 1.4)*rem)+'px'}" load-more @load-top="onRefresh" @load-down="onLoadMore" :no-more="noMore[i]&&noMore[i][j]" @on-scroll-end="top => { goTopShow[i][j]=top; goTopShow=JSON.copyObj(goTopShow) }">
                                            <div class="view-box theme-main-bg" style="margin: 0 auto;border-top-left-radius: 0;border-top-right-radius: 0">
                                                <ul style="margin-top: 0;padding: 0 0.2rem" v-if="list[i]&&list[i][j]&&list[i][j].length">
                                                    <li class="recode-item theme-after-border-color" :class="tab.type" @click="onItemClick(item)" v-for="(item, k) in list[i]?list[i][j]:[]" :key="k">
                                                        <div class="recode-item-col">
                                                            <p class="info-row theme-color-white">
                                                                <span class="user-name theme-color-white">{{ (entryType == 1 ?( tab.type ==='LOTTERY' ? item.lotteryName : item.platform): item['userName'])}}</span>
                                                            </p>
                                                            <p class="info-row">
                                                                <span class="ball theme-color-yellow" v-if="tab.type==='LOTTERY'">
                                                                    <i>{{item['playwayName']}}</i>
                                                                    <i>{{item.ball?':':''}}</i>
                                                                    <i>{{item.ball||''}}</i>
                                                                    <i>{{item.ball?'-':':'}}</i>
                                                                    <i class="code">{{item['betInfo']}}</i>
                                                                </span>
                                                                <span class="bet bet2 theme-color-yellow" style="margin-right:0.24rem" v-else>{{ item.gameName }}</span>
                                                                <template v-if="tab.type !=='LOTTERY'">
                                                                    <span class="bet bet3 theme-color-gray-2" v-if="tabs[tabIndex].type === 'SPORT'">投注:{{item['betAmount']}}</span>
                                                                    <span class="bet bet3 theme-color-gray-2" v-else>投注:{{item['validBetAmount']}}</span>
                                                                </template>
                                                            </p>
                                                            <p class="info-row">
                                                                <span class="bet theme-color-gray-2" v-if="tab.type==='LOTTERY'" style="margin-right:0.24rem"><span v-if="entryType != 1">{{ item.lotteryName }}</span>{{ entryType != 1 ? '(第'+forMartIssu(item.issue)+'期)' :'第'+forMartIssu(item.issue)+'期 '}}</span>
                                                                <span class="bet theme-color-gray-2" style="overflow: hidden; white-space: nowrap;text-overflow: ellipsis;" v-else><template v-if="entryType == 1">{{  item.billNo  }}</template><template v-else>{{ item.platform+'('+item.billNo+')' }}</template></span>
                                                                <template v-if="tab.type==='LOTTERY'">
                                                                    <span class="bet theme-color-gray-2" v-if="tabs[tabIndex].type === 'SPORT'">投注:{{item['betAmount']}}</span>
                                                                    <span class="bet theme-color-gray-2" v-else>投注:{{item['validBetAmount']}}</span>
                                                                </template>
                                                            </p>
                                                        </div>
                                                        <div class="recode-item-col">
                                                            <p class="commission">
                                                                <span class="commission-value nolmar theme-color-gray-2" :class="(item.status == 1 || item.status == 2) ? '' : 'no-order'">{{ dayJs.unix(item.betTime).format('MM-DD HH:mm:ss') }}</span>
                                                            </p>
                                                            <p class="commission">
                                                                <span class="commission-label"></span>
                                                                <span class="commission-value" v-if="item.status == 1 || item.status == 2" :class="item.status==1 ? '': 'less'">{{ item['netAmount'].replace('-','')}}</span>
                                                                <!-- <span class="status-ball icon iconfont" v-else-if="item.status==4 || item.status==0" :class="statusLottery[item['status']].class"></span> -->
                                                                <template v-if="item.status== 0 || item.status== 4 || item.status== 3">
                                                                    <span class="status-ball icon iconfont" :class="statusLottery[item['status']].class" v-if="tab.type === 'LOTTERY' "></span>
                                                                    <span class="status-ball icon iconfont" :class="statusOther[item['status']].class" v-else></span>
                                                                </template>
                                                            </p>
                                                            <template v-if="item.status==1 || item.status==2">
                                                                <span class="status-ball icon iconfont" :class="statusLottery[item['status']].class" v-if="tab.type === 'LOTTERY' "></span>
                                                                <span class="status-ball icon iconfont" :class="statusOther[item['status']].class" v-else></span>
                                                            </template>
                                                        </div>
                                                    </li>
                                                </ul>

                                                <div v-else-if="noMore[i]&&noMore[i][j]" :style="{minHeight:(scrollHeight-1.4*rem)+'px'}">
                                                    <img style="width: 100%;margin-top: 1rem;" :src="noDataImg" alt />
                                                    <p style="font-size: 0.3rem;color: #666666">暂无数据</p>
                                                </div>
                                                <p v-if="totalCount > 5" style="font-size: 0.26rem; line-height: 0.84rem; color: #000;text-align: center;" :class="{'theme-color-white':$config.blush}">
                                                    已显示最近{{totalCount}}条记录
                                                </p>
                                            </div>
                                        </list-view>
                                        <button class="list-go-top qp-go-top-svg" :style="{backgroundImage: 'url(' + listGoImg + ')'}" v-show="goTopShow[i]&&goTopShow[i][j]&&goTopShow[i][j]<-5*1.52*rem" @click="$refs['list-'+i][j].scroll.scrollTo(0,0,goTopShow[i][j]/-3)"></button>
                                        <div v-if="amount[i]&&amount[i][j]&&Number(amount[i][j]['total_bet'] > 0)" class="box-amount">
                                            <ul class="amount theme-header-bg" :class="{'amount_right':typeIndex[i] ==3}">
                                                <li class="amount-item">
                                                    <span class="item-label theme-color-white">投注:</span>
                                                    <span class="item-value" :class="{red:parseFloat(amount[i][j]['total_bet'])>=0,green:parseFloat(amount[i][j]['total_bet'])<0}">
                                                        {{amount[i][j]['total_bet']||'0.00'}}
                                                    </span>
                                                </li>
                                                <li class="amount-item" v-if="typeIndex[i] !==3">
                                                    <span class="item-label theme-color-white">输赢:</span>
                                                    <span class="item-value" :class="{red:parseFloat(amount[i][j]['total_win'])>=0,green:parseFloat(amount[i][j]['total_win'])<0}">
                                                        {{ formatString(amount[i][j]['total_win'])||'0.00'}}
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
</view-page>
</template>

<script>

export default {
    name: 'bet3OneDay',
    data() {
        return {
            entryType:1,
            dateOkName: '今天',
            dateOkIndex: 0,
            goTopShow: [],
            scrollHeight: 0,
            resetLoading: true,
            tabs: [],
            tabIndex: 0,
            animation: 'slide-right',
            defaultIndex: 0,
            listIndex: 0,
            dateName: '',
            changeDateIndex: 0,
            date: [null, null, null, null, null,null],
            username: '',
            uid: '',
            totalCount: 0,
            lotteryTypes: [{
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
                },
                {
                    name: '',
                    status: ''
                }
            ],
            sportTypes: [
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
                    name: '待结算',
                    status: 0
                }
            ],
            typeIndex: [],
            loading: [],
            noMore: [],
            tabChangeIndex: 0,
            page: 0,
            limit: 20,
            showSearch: false,
            list: [],
            amount: [],
            statusLottery: [
                { name: '待', class :'h5-icon-result-wait'},
                { name: '中', class :'h5-icon-result-mid'},
                { name: '未', class :'h5-icon-result-false'},
                { name: '和', class :'h5-icon-result-sum'},
                { name: '撤', class :'h5-icon-result-withdraw'},
                { name: '撤', class :'h5-icon-result-withdraw'}
            ],
            statusOther: [
                { name: '待', class :'h5-icon-result-wait'},
                { name: '赢', class :'h5-icon-result-win'},
                { name: '输', class :'h5-icon-result-lose'},
                { name: '和', class :'h5-icon-result-sum'},
                { name: '撤', class :'h5-icon-result-withdraw'},
                { name: '撤', class :'h5-icon-result-withdraw'},
            ],
            defaultTabIndex: 0,
            tabCount: 0,
        }
    },
    computed: {
        noDataImg(){
            if(this.$config.newQP || this.$config.blackTheme) {
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
            if(this.$config.newQP || this.$config.blackTheme) {
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
        tabs() {
            this.tabs.forEach((item, i) => {
                if (item.type === 'LOTTERY' || item.type === 'SPORT' ) {
                    this.noMore[i] = [false, false, false, false]
                    this.loading[i] = [false, false, false, false]
                    this.goTopShow[i] = [0, 0, 0, 0]
                    this.list[i] = [
                        [],
                        [],
                        [],
                        []
                    ]
                    this.typeIndex[i] = 0
                    this.amount[i] = [{}, {}, {}, {}]
                } else {
                    this.noMore[i] = [false, false, false]
                    this.loading[i] = [false, false, false]
                    this.goTopShow[i] = [0, 0, 0]
                    this.list[i] = [
                        [],
                        [],
                        []
                    ]
                    this.typeIndex[i] = 0
                    this.amount[i] = [{}, {}, {}]
                }

                if (item.type === this.type) this.tabIndex = this.defaultTabIndex = i
            })
        },
        date() {
            console.log('ss2')
        },
        tabIndex(val, old) {
            this.username = ''
            if (val < old) {
                this.animation = 'slide-right'
            } else {
                this.animation = 'slide-left'
            }
            if (!sessionStorage.getItem('recode')) {
                //this.dateName='';this.date=this.filterDate[0]
            } else {
                sessionStorage.clear()
            }

            this.$nextTick(() => {

                this.goTopShow[this.tabIndex][this.typeIndex[this.tabIndex]] = 0
                this.goTopShow = JSON.copyObj(this.goTopShow)
                if (this.dateOkIndex > 1) {
                    this.$refs['list-dates-' + this.tabIndex].scroll.scrollTo(0, 0, 0)
                } else {
                    if (this.$refs['list-' + this.tabIndex] && this.$refs['list-' + this.tabIndex][this.typeIndex[this.tabIndex]]) {
                        this.$refs['list-' + this.tabIndex][this.typeIndex[this.tabIndex]].scroll.scrollTo(0, 0, 0)
                    }
                }
            })
        },

        tabChangeIndex() {
            //this.defaultIndex = 0;
        },
        typeIndex: {
            handler(val, old) {
                //if(this.listIndex == val[this.tabIndex]){

                this.$nextTick(() => {
                    if (!sessionStorage.getItem('recode')) this.dateName = ''
                    else sessionStorage.clear()
                    this.goTopShow[this.tabIndex][this.typeIndex[this.tabIndex]] = 0
                    this.goTopShow = JSON.copyObj(this.goTopShow)
                    if (this.dateOkIndex > 1) {
                        this.$refs['list-dates-' + this.tabIndex].scroll.scrollTo(0, 0, 0)
                    } else {
                        if (this.$refs['list-' + this.tabIndex] && this.$refs['list-' + this.tabIndex][this.typeIndex[this.tabIndex]]) {
                            this.$refs['list-' + this.tabIndex][this.typeIndex[this.tabIndex]].scroll.scrollTo(0, 0, 0)
                        }
                    }
                })
            },
            deep: true
        }
    },
    created() {
        // this.checkList()
        this.init()
        if (this.$route.params) {
            this.tabs.map((item, index) => {
                if (item.type == this.$route.params.type) {
                    this.$forceUpdate();
                    this.tabIndex = index
                }
            })
        }
        if(['amxpj','99qp','kkqp','fhcp','103qp','839qp','dqr','hty','tccp','tyc86','xpj83'].includes(this.$config.name)) {
            this.tabs = [{
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
                name: '捕鱼',
                type: 'FISH'
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
        }else if(this.personalMode === 'mode_c') {
            this.tabs = [
            {
                name: '棋牌',
                type: 'CHESS'
            },
            {
                name: '视讯',
                type: 'LIVE'
            },
            {
                name: '捕鱼',
                type: 'FISH'
            },
            {
                name: '电子',
                type: 'SLOT'
            },
            {
                name: '体育',
                type: 'SPORT'
            },
        ]
        }else if(this.$config.home === 'tc') {
            this.tabs = [
                {
                    name: '彩票',
                    type: 'LOTTERY'
                },
                {
                    name: '棋牌',
                    type: 'CHESS'
                }
            ]
        }else {
            this.tabs = [{
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
                name: '捕鱼',
                type: 'FISH'
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
        }
    },
    beforeDestroy() {
       
    },
    mounted() {
        setTimeout(() => {
            this.onRefresh();
        }, 100);
    },
    methods: {
        dataStr(v){
            if(v){
                return v.slice(5,v.length).replace('-','月')+'日';
            }
            return '';
        },
        formatString(data){
            if(typeof data == 'string'){
                return data
            }else{
                return data
            }
        },
        init() {
            this.defaultIndex = this.$route.query['dateType'] ? Number(this.$route.query['dateType']) : 0
            this.tabIndex = this.$route.query['gameType'] || 0
            this.dateOkName = this.date.start = this.$route.query['date']
            this.$nextTick(() => {
                let _self = this
                setTimeout(() => {
                    this.$set(this.typeIndex, (Number(_self.$route.query['gameType']) || 0), Number(_self.$route.query['winType']) || 0)
                    if (_self.$refs['swipeType']) {
                        _self.$refs['swipeType'][this.typeIndex, (Number(_self.$route.query['gameType']) || 0)].swipeTo(Number(_self.$route.query['winType']) || 0)
                    }
                }, 100);
            })
        },
        forMartIssu(num) {
            if(typeof num === 'number'){
               num = num.toString()
            }
            let numStr = ''
            if (num.length > 8) {
                numStr = num.substring(8)
            } else {
                numStr = num.includes(new Date().getFullYear()) ? num.substring(4) : num
            }
            return numStr
        },
        showDate() {
            if (this.dateOkIndex >= 0) {
                this.showDateSelector = true
            }
        },
        changeTabs(index) {
            if (this.dateOkIndex > 1) {
                this.getOhterDayList()
            } else {
                this.tabIndex = index;
                this.typeIndex = [0,0,0,0,0,0]
                setTimeout(() => {
                    this.onRefresh();
                }, 100);
            }
        },
        onItemClick(item) {
            this.$store.state.agency.recodeItem = item
            this.$router.push({
                path: '/user/betInfo',
                query: {
                    gameType: this.tabIndex || 0,
                    winType: this.typeIndex[this.tabIndex] || 0,
                    dateIndex: this.$route.query['dateIndex'],
                    isHome:2
                }
            })

        },
        changeIndex(tabJ, i) {
            this.$set(this.typeIndex, i, tabJ)
            this.listIndex = tabJ;
            // this.$refs[]
            setTimeout(() => {
                this.onRefresh();
            }, 100);
        },
        goback() {
            this.$router.push({
                path: '/user/record',
                query: {
                    gameType: this.tabIndex || 0,
                    winType: this.typeIndex[this.tabIndex] || 0,
                    dateIndex: this.$route.query['dateIndex'],
                }
            })
        },
        onRefresh() {
            if (this.list[this.tabIndex] && this.date) {
                this.totalCount = 0;
                this.page = 0
                this.noMore[this.tabIndex][this.typeIndex[this.tabIndex]] = false
                this.loading[this.tabIndex][this.typeIndex[this.tabIndex]] = false
                this.loadMore(true)
            }
        },
        onLoadMore() {
            this.loadMore()
        },
        
        // 获取时间节点的数据 今天 昨天
        loadMore(status) {
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
                    type: (this.tabs[tabIndex].type).toLowerCase(),
                    date:  this.date.start,
                    limit: this.limit,
                    page: this.page,
                }
                if (this.tabs[tabIndex].type === 'LOTTERY' || this.tabs[tabIndex].type === 'SPORT' ) {
                    if (this.lotteryTypes[typeIndex].status.toString().length) data.status = this.lotteryTypes[typeIndex].status
                } else {
                    if (this.otherTypes[typeIndex].status.toString().length) data.status = this.otherTypes[typeIndex].status
                }
                if (this.page == 1) {
                    this.toastLoading('加载中');
                }
                let _self = this
                this.$store.dispatch('user/getRecordListByower',{ data, callback: res=>{
                    this.loading[tabIndex][typeIndex] = false
                    this.$refs['list-' + tabIndex][typeIndex].loaded()
                    if (res.code === 200) {
                        if (res.data && res.data.data && res.data.data.list && res.data.data.list.length) {
                            if (status) {
                                _self.$nextTick(() => {
                                    _self.$set(_self.list[tabIndex], typeIndex, res.data.data.list)
                                    _self.$forceUpdate();
                                })
                                if (res.data.data.list.length === 0) {
                                    this.noDataImg = `../../../assets/img/${this.targetTheme['code']}.png`
                                }
                            } else {
                                _self.list[tabIndex][typeIndex] = _self.list[tabIndex][typeIndex].concat(res.data.data.list)
                            }
                            if (res.data.data.list.length < this.limit) {
                                this.noMore[tabIndex][typeIndex] = true
                            }
                            this.totalCount = this.totalCount + res.data.data.list.length;
                            this.amount[tabIndex][typeIndex] = res.data.data.amount
                        } else {
                            if (status) {
                                this.list[tabIndex][typeIndex] = [];
                                this.amount[tabIndex][typeIndex] = res.data.data.amount;
                            }
                            this.noMore[tabIndex][typeIndex] = true
                        }
                        this.toastClear();
                        this.list = JSON.copyObj(this.list)
                    } else {
                        this.toastText(res.message, 'top')
                        this.page--
                    }
                },error:err=>{
                    this.page--
                    this.toastClear();
                    this.loading[tabIndex][typeIndex] = false
                }})
            } else if (this.loading[tabIndex][typeIndex]) {
                this.toastText('正在加载', 'top')
            }
        }
    }
}
</script>

<style lang="less" scoped>
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

.recode {
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
        
        .type-tab-item-one {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 0.3rem;
            flex: 1;
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
        .type-tab-item-one{
             &:first-child {
                width: 30%;
            }
            &:nth-child(2) {
                width: 20%;
            }
        }
        // .type-tab-item {
        //     &:first-child {
        //         width: 30%;
        //     }
        // }
        // .type-tab-item {
        //     &:nth-child(2) {
        //         width: 20%;
        //     }
        // }
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
                .no-order{
                    position: relative;
                    top: -0.15rem;
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
                // overflow: hidden;
                // text-overflow: ellipsis;
                // white-space: nowrap;
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
                    max-width: 4rem;
                }
                .bet2 {
                    color: #000000;
                }
                // .bet3{
                //     color: #A3A3A3;
                // }
                // .bet4{
                //     color: #E71414;
                // }

                .ball {
                    color: #000000;
                    font-size: 0.28rem;
                    max-width: 4.85rem;
                    >.code {
                        word-wrap: normal;
                        display:inline-block;
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
    &.qp-recode {
        /deep/ .auto-box-header-static {
            background-color: #000;
            .van-hairline--top-bottom {
                &::after {
                    border: none !important;
                }
            }
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
        .list-go-top {
            width: 0.8rem;
            height: 0.8rem;
        }
        .view-box {
            width: auto;
            padding: 0 0.2rem;
            ul {
                padding: 0 !important;
                li {
                    background-color: #0B0B0B;
                }
            }
        }
    }
    &.blush-recode {
        /deep/ .auto-box-header-static {
            background-color: #72010B;
            .van-hairline--top-bottom {
                &::after {
                    border: none !important;
                }
            }
            .van-tabs__nav {
                background: linear-gradient(0deg, #9D010F, #72010B) !important;
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
        .view-box {
            width: auto;
            padding: 0 0.16rem;
            ul {
                padding: 0 !important;
                li {
                    background-color: #640009;
                }
            }
        }
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
