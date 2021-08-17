<template>
<view-page class="agent-center-new" :class="{'theme-main-bg-5':$config.blackTheme || $config.newQP,'theme-main-bg':$config.blush}" full-box>
    <div slot="static" class="theme-agent-bg" :class="{'theme-header-bg':$config.blackTheme || $config.newQP,'theme-main-bg':$config.blush}" :style="headerStyle"></div>
    <div class="header theme-main-bg theme-header-bottom" slot="header">
        <title-header class="title" style="background-color: rgba(0,0,0,0) !important;" backEvent @back="$router.push('/user')" title="代理中心">
            <div class="header-right" slot="right" @click="clickAgentDoc()">
                <span style="margin-right: 0.08rem;">代理教程</span>
            </div>
        </title-header>
    </div>

    <div slot="content" class="content">
        <div class="commission" v-if="agencyType === 'shareholder'">
            <div :class="['header-bg',{'black-header-bg' : $config.blackTheme || $config.newQP || $config.blush}]"></div>
            <div class="commission-item">
                <p class="money red">{{info?info['platformProfit']:'0.00'}}</p>
                <p class="link theme-color-gray-8"><span class="dgd">平台盈利</span></p>
            </div>
            <div class="commission-item">
                <p class="money red">{{info?info['cashProfit']:'0.00'}}</p>
                <p class="link theme-color-gray-8"><span class="dgd">现金利润</span></p>
            </div>
        </div>
        <div class="commission" v-else>
            <div :class="['header-bg',{'black-header-bg' : $config.blackTheme || $config.newQP || $config.blush}]"></div>
            <div class="commission-item">
                <p class="money red">{{info?info['todayCommission']:'0.00'}}</p>
                <p class="link theme-color-gray-8"><span>今日佣金</span></p>
            </div>
            <div class="commission-item">
                <p class="money">{{info?info['yestodayCommission']:'0.00'}}</p>
                <p class="link theme-color-gray-8"><span>昨日佣金</span></p>
            </div>
            <div class="commission-item">
                <p class="money">{{info?info['weekCommission']:'0.00'}}</p>
                <p class="link theme-color-gray-8"><span>本周佣金</span></p>
            </div>
        </div>

        <div class="view-box" :class="{'theme-header-bg':$config.blackTheme || $config.newQP,'theme-main-bg-1':$config.blush}">
            <div class="view-box-header theme-after-border-color" v-if="agencyType === 'shareholder'">
                <p class="info">
                    <span class="label theme-color-white">今日首充:</span>
                    <span class="money">{{info?info['first_deposit_amount']:'0.00'}}</span>
                    <span class="unit theme-color-white">元</span>
                    <span class="theme-color-white" style="color:#444444; font-weight: normal;font-size: 14px;">／</span>
                    <span class="money">{{info?info['first_depositCount']:'0'}}</span>
                    <span class="theme-color-white" style="color:#444444; font-weight: normal;font-size: 14px;">人</span>
                </p>
            </div>
            <div class="view-box-header theme-after-border-color" v-else>
                <p class="info">
                    <span class="label theme-color-white">可领取佣金:</span>
                    <span class="money">{{info?info['nowCommission']:'0.00'}}</span>
                    <span class="unit theme-color-white">元</span>
                </p>
                <button class="btn-take theme-color theme-border-1px theme-color-yellow theme-border-yellow" @click="goAgentTransition">领取</button>
            </div>
            <ul class="action-tab">
                <li class="action-item" @click="personalMode=='mode_b'?$router.push('/user/agency-center-new/open'):info&&info['invite_code_count']<1?$router.push('/user/agency-center-new/open/link'):$router.push('/user/agency-center-new/open')">
                    <span class="icon iconfont h5-icon-dailizhongxinshouye-icon-tuiguangkaihu theme-color action-icon theme-color-yellow"></span>
                    <p class="theme-color-white">推广开户</p>
                </li>
                <li class="action-item" @click="$router.push('/user/agency-center-new/report')">
                    <span class="icon iconfont h5-icon-dailishouye-icon-caiwubaobiao theme-color action-icon theme-color-yellow"></span>
                    <p class="theme-color-white">财务报表</p>
                </li>
                <li class="action-item" @click="goTouZhu">
                    <span class="icon iconfont h5-icon-icon-touzhujilu theme-color action-icon theme-color-yellow"></span>
                    <p class="theme-color-white">投注记录</p>
                </li>
                <li class="action-item" @click="$router.push('/user/agency-center-new/agency-report')">
                    <span class="icon iconfont h5-icon-dailizhongxinshouye-icon-dailibaobiao theme-color action-icon theme-color-yellow"></span>
                    <p class="theme-color-white">代理报表</p>
                </li>
            </ul>
        </div>

        <div class="tram-box" :class="{'theme-header-bg':$config.blackTheme || $config.newQP,'theme-main-bg-1':$config.blush}">
            <div class="tram-box-header theme-after-border-color">
                <span class="title theme-color-white">我的团队</span>
                <span class="look-more" @click="$router.push('/user/agency-center-new/team')"><i>查看更多</i><i class="van-icon van-icon-arrow"></i></span>
            </div>
            <div class="tram-box-content">
                <p class="all-info theme-after-border-color">
                    <span class="info-title theme-color-gray">今日存款:</span>
                    <span class="money theme-color-yellow">{{info?info['depositAmount']:'0.00'}}</span>
                    <span class="theme-color-gray">元</span>
                    <span class="theme-color-gray">／</span>
                    <span class="money theme-color-yellow">{{info?info['depositCount']:'0'}}</span>
                    <span class="theme-color-gray">人</span>
                </p>

                <ul class="action-tab theme-after-border-color" v-if="getAgentMode() === 'mode_a'">
                    <li class="action-item theme-after-border-color">
                        <p class="money theme-color-yellow">{{info?info['is_today_register']:'0'}}</p>
                        <p class="user theme-color-gray">新增用户</p>
                    </li>
                    <li class="action-item">
                        <p class="money theme-color-yellow">{{info?info['agency_count']:'0'}}</p>
                        <p class="user theme-color-gray">用户人数</p>
                    </li>
                    <li class="action-item">
                        <p class="money theme-color-yellow">{{info?info['active_member']:'0'}}</p>
                        <p class="user theme-color-gray">活跃用户</p>
                    </li>
                </ul>

                <ul class="action-tab theme-after-border-color" v-else-if="getAgentMode()==='mode_b' && agencyType!=='shareholder'">
                    <li class="action-item">
                        <p class="money theme-color-yellow">{{info?info['is_today_register']:'0'}}</p>
                        <p class="user theme-color-gray">新增用户</p>
                    </li>
                    <li class="action-item">
                        <p class="money theme-color-yellow">{{info?info['member_count']:'0'}}</p>
                        <p class="user theme-color-gray">会员人数</p>
                    </li>
                    <li class="action-item">
                        <p class="money theme-color-yellow">{{info?info['active_member']:'0'}}</p>
                        <p class="user theme-color-gray">活跃用户</p>
                    </li>
                </ul>

                <ul class="action-tab theme-after-border-color" v-else>
                    <li class="action-item">
                        <p class="money theme-color-yellow">{{info?info['is_today_register']:'0'}}</p>
                        <p class="user theme-color-gray">新增用户</p>
                    </li>
                    <li class="action-item">
                        <p class="money theme-color-yellow">{{info?info['agency_count']:'0'}}</p>
                        <p class="user theme-color-gray">代理人数</p>
                    </li>
                    <li class="action-item">
                        <p class="money theme-color-yellow">{{info?info['member_count']:'0'}}</p>
                        <p class="user theme-color-gray">会员人数</p>
                    </li>
                    <li class="action-item">
                        <p class="money theme-color-yellow">{{info?info['active_member']:'0'}}</p>
                        <p class="user theme-color-gray">活跃用户</p>
                    </li>
                </ul>

                <p class="all-info theme-after-border-color">
                    <span class="info-title theme-color-gray">有效投注:</span>
                    <span class="money theme-color-yellow">{{info?info['validBetAmount']:'0.00'}}</span>
                    <span class="theme-color-gray">元</span>
                    <span class="theme-color-gray">／</span>
                    <span class="money theme-color-yellow">{{info?info['validBetCount']:'0'}}</span>
                    <span class="theme-color-gray">人</span>
                </p>
            </div>
        </div>
    </div>

    <div slot="static">
        <van-dialog v-model="showDividend" :show-confirm-button="false" get-container="body" style="background-color: rgba(0, 0, 0, 0)">
            <div class="dividend-box" @click.once="onDividend">
                <p class="date">
                    <span>{{dayJs.unix(dividendInfo['data_date']).format('M月D日')}}</span>
                    <span>-</span>
                    <span>{{dayJs.unix(dividendInfo['data_date']).add(1, 'M').set('date', 1).subtract(1, 'd').format('M月D日')}}</span>
                    <span>分红</span>
                </p>
                <p class="info">恭喜发财，大吉大利</p>
            </div>
        </van-dialog>
        <ios-alert v-model="showAlert" :ok-callback="onChangeType" ok-text="立即激活" no-text="拒绝" :width="6.2">
            <p class="theme-color-white">
                恭喜您获得最高代理权限！
                <br />
                体验佣金{{configMoney}}元且转帐次数{{configCount}}次
            </p>
        </ios-alert>
    </div>
</view-page>
</template>

<script>
export default {
    name: 'AgentCenterNewIndex',
    data() {
        return {
            info: null,
            showDividend: false,
            dividendInfo: {},
            showAlert: false,
        }
    },
    computed: {
        headerStyle() {
            return {
                position: 'absolute',
                left: '0',
                top: '0',
                width: '100%',
                height: '4.52rem',
                zIndex: '-1',
                // background: 'linear-gradient(180deg, rgba(1, 195, 207, 1) 0%, rgba(47, 115, 255, 1) 100%)'
            }
        },
        configMoney() {
            const money = this.$store.state.main.config ? this.$store.state.main.config['total_bet'] : 0
            if (money) {
                if (money >= 10000) {
                    return (parseInt(money.toString().substring(0, money.toString().length - 3)) / 10) + '万'
                } else {
                    return money
                }
            } else {
                return '**'
            }
        },
        configCount() {
            return this.$store.state.main.config ? this.$store.state.main.config['valid_member'] : 0
        },
    },
    created() {
        if (localStorage['agencyIndex']) {
            try {
                this.info = JSON.parse(localStorage['agencyIndex'])
            } catch (e) {
                this.info = null
            }
        }

        this.$store.dispatch('agency/agencyIndex').then(res => {
            if (res && res.code === 200) {
                this.info = res.data
                localStorage['agencyIndex'] = JSON.stringify(this.info)
            } else {
                this.toastText(res.message, 'top')
            }
        }).catch(err => {
            console.log(err)
        })

        this.$store.dispatch('agency/agencyShareoutbonusCheck').then(res => {
            if (res && res.code === 200) {
                if (res.data && res.data.id) {
                    this.dividendInfo = res.data
                    this.showDividend = true
                }
            } else {
                this.toastText(res.message, 'top')
            }
        }).catch(err => {
            console.log(err)
        })
    },
    methods: {
        goTouZhu() {
            this.$router.push({
                path: '/user/agency-center-new/bet'
            })
        },
        onRefresh() {

        },
        onLoadMore() {

        },
        clickAgentDoc() {
            this.$router.push('/agent-doc-list')
        },
        onDividend() {
            this.showDividend = false
            this.$store.dispatch('agency/agencyShareoutbonusSend', this.dividendInfo.id).then(res => {
                if (res && res.code === 200) {
                    this.$router.push('/user/agency-center-new/dividend/' + this.dividendInfo.money)
                } else {
                    this.toastText(res.message, 'top')
                }
            }).catch(err => {
                console.log(err)
            })
        },
        onChangeType() {
            if (!this.show) {
                this.checked = true
                this.$store.dispatch('user/checkCommission', 2).then(res => {
                    this.checked = false
                    if (res.code === 200) {
                        this.$router.push('/user/change-money')
                    }
                }).catch(() => {
                    this.checked = false
                })
            }
            return true
        },
        goAgentTransition() {
            if (this.personalMode === 'mode_b') {
                if (!this.show) {
                    this.checked = true
                    this.$store.dispatch('user/checkCommission', 1).then(res => {
                        this.checked = false
                        if (res.code === 200) {
                            if (res.data[0]['commission_type'] === 0) {
                                this.showAlert = true
                            } else {
                                this.$router.push('/user/agency-center-new/take')
                            }
                        }
                    }).catch(() => {
                        this.checked = false
                    })
                }
            } else {
                this.$router.push('/user/agency-center-new/take')
            }
        },
    }
}
</script>

<style lang="less" scoped>
.header-right {
    position: absolute;
    right: 0.2rem;
    top: 0;
    font-size: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
}

.dividend-box {
    width: 5.5rem;
    height: 7.5rem;
    background: url("../../assets/img/agent-center-new/dividend.png") no-repeat 0 0;
    background-size: 100% 100%;
    margin: 0 auto;
    padding-top: 0.97rem;

    .date {
        font-size: 0.4rem;
        line-height: 0.56rem;
        color: #FFF0AE;
    }

    .info {
        margin-top: 3.16rem;
        //font-family: 'FZCSJW--GB1-0', 'Times New Roman', SimSun, serif;
        font-size: 0.46rem;
        line-height: 0.55rem;
        color: #F6D89C;
        font-weight: 500;
    }
}

.agent-center-new {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #f6f6f6;
    font-size: 0.3rem;
    font-weight: 500;
    line-height: 0.42rem;

    .money {
        color: #E71414;
    }

    .content {
        position: relative;
        z-index: 500;
    }

    .commission {
        position: relative;
        height: 2.4rem;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        text-align: center;
        width: 100%;
        overflow: visible;

        .header-bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 2.88rem;
            background: url("../../assets/img/agent-center-new/index/header-bg.png") no-repeat 0 0;
            background-size: 100%;
            &.black-header-bg {
                background: url("../../assets/img/agent-center-new/index/black-header-bg.png") no-repeat 0 0;
                background-size: 100%;
            }
        }

        .commission-item {
            flex: 1;
            height: 100%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: stretch;
            flex-direction: column;

            .dgd {
                //font-weight: 400;
                font-size: 0.38rem;
            }

            .money {
                color: #555555;
                font-size: 0.4rem;
                line-height: 0.56rem;
                font-weight: 500;

                &.red {
                    color: #E71414;
                }
            }

            .link {
                margin-top: 0.08rem;
                font-weight: 500;
                color: #666666;
                font-size: 0.3rem;
                line-height: 0.42rem;
                display: flex;
                font-weight: 500;
                justify-content: center;
                align-items: center;
            }
        }
    }

    .view-box {
        position: relative;
        margin: 0.3rem auto 0 auto;
        padding: 0 0.24rem;
        box-sizing: border-box;
        width: 7.18rem;
        background-color: #ffffff;
        border-radius: 0.1rem;
        box-shadow: 0 0.05rem 0.05rem 0 rgba(0, 0, 0, 0.03);

        .view-box-header {
            position: relative;
            height: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .info {
                text-align: left;
                flex: 1;
                font-size: 0.32rem;

                .label {
                    color: #444444;
                    font-weight: normal;
                }

                .money {
                    color: #E71414;
                    font-weight: normal;
                }

                .unit {
                    color: #666666;
                    font-weight: normal;
                }
            }

            .btn-take {
                display: flex;
                background-color: rgba(0, 0, 0, 0) !important;
                border-radius: 0.1rem;
                border: 0.02rem solid #2C93FF;
                color: #2C93FF;
                padding: 0 0.2rem;
                height: 0.56rem;
            }
        }

        .view-box-header::after {
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            right: 0;
            bottom: 0;
            // top: 0;
            left: 0;
            border-bottom: 0.02rem solid #ebedf0;
            -webkit-transform: scaleY(.5);
            transform: scaleY(.5);
        }

        .action-tab {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 1.85rem;
            flex-wrap: nowrap;

            .action-item {
                color: #444444;
                width: 100%;
                flex: 1;

                p {
                    font-weight: normal;
                }

                .action-icon {
                    display: block;
                    font-size: 0.48rem;
                    margin: 0 auto 0.15rem;
                }
            }
        }
    }

    .tram-box {
        position: relative;
        margin: 0.24rem auto 0 auto;
        padding: 0;
        box-sizing: border-box;
        width: 7.18rem;
        background-color: #ffffff;
        border-radius: 0.1rem;
        box-shadow: 0 0.05rem 0.05rem 0 rgba(0, 0, 0, 0.03);

        .tram-box-header {
            position: relative;
            padding: 0 0.2rem;
            height: 0.9rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
                color: #444444;
                font-size: 0.32rem;
                font-weight: 500;
            }

            .look-more {
                color: #a3a3a3;
                font-size: 0.26rem;
                line-height: 0.26rem;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 0.37rem;
                font-size: 0.26rem;
                font-family: PingFang-SC-Medium, PingFang-SC;
                font-weight: 500;
                color: rgba(163, 163, 163, 1);
                line-height: 0.37rem;

            }
        }

        .tram-box-header::after {
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            right: 0;
            bottom: 0;
            // top: 0;
            left: 0;
            border-bottom: 0.02rem solid #ebedf0;
            -webkit-transform: scaleY(.5);
            transform: scaleY(.5);
        }

        .tram-box-content {
            padding: 0 0.24rem;

            .all-info {
                position: relative;
                height: 0.9rem;
                color: #444444;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                font-size: 0.28rem;
                font-weight: normal;

                .info-title {
                    font-size: 0.32rem;
                }

                .money {
                    color: #E71414;
                    font-size: 0.32rem;
                }
            }

            .all-info::after {
                position: absolute;
                box-sizing: border-box;
                content: ' ';
                pointer-events: none;
                right: 0;
                bottom: 0;
                // top: 0;
                left: 0;
                border-bottom: 0.02rem solid #ebedf0;
                -webkit-transform: scaleY(.5);
                transform: scaleY(.5);
            }

            .all-info:last-child {
                border-bottom: none;
            }

            .all-info:last-child::after {
                height: 0;
            }

            .action-tab {
                position: relative;
                width: 100%;
                display: flex;
                justify-content: space-around;
                align-items: center;
                height: 1.85rem;
                flex-wrap: nowrap;

                .action-item {
                    color: #666666;
                    font-size: 0.28rem;
                    /*flex: 1;*/

                    .money {
                        color: #E71414;
                        font-size: 0.32rem;
                        line-height: 0.45rem;
                    }

                    .user {
                        font-weight: 500;
                        margin-top: 0.04rem;
                        font-size: 0.27rem;
                    }
                }
            }

            .action-tab::after {
                position: absolute;
                box-sizing: border-box;
                content: ' ';
                pointer-events: none;
                right: 0;
                bottom: 0;
                // top: 0;
                left: 0;
                border-bottom: 0.02rem solid #ebedf0;
                -webkit-transform: scaleY(.5);
                transform: scaleY(.5);
            }
        }
    }
}
</style>
