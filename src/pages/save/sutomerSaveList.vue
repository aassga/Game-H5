<template>
<view-page full-box ref='box' class="theme-main-bg">
    <title-header :title="$route.query.title " slot="header" class="theme-header-bg theme-header-bottom">
        <span class="header-right" @click="tousu">
            <slot name="right">我要投诉</slot>
        </span>
    </title-header>
    <div class="customer-content" slot="content">
        <div class="search-box">
            <div class="refresh-box theme-bg theme-gradient-bg theme-color-yellow" @click="getCustomerLists">
                <i class="icon-refresh icon iconfont h5-icon-h-f theme-color-yellow"></i>
                刷新
            </div>
            <div class="search theme-border-1px">
                <input class="theme-color-white" type="text" placeholder="关键字搜索客服" @blur="onSearch" v-model="search">
                <i class="icon-refresh icon iconfont h5-icon-icon-search1 theme-color theme-color-yellow" @click="onSearch"></i>
            </div>
        </div>
        <!-- <div class="header-bg"></div> -->
        <template v-if="showList.length>0">
            <ul class="content">
                <li class="customer-li" v-for="(item,i) in showList" :key="i">
                    <div class="left">
                        <div class="customer-head">
                            <div class="head-img" :style="{'background-image': `url(${item.headImg})`}">
                            </div>
                        </div>
                        <div class="detail">
                            <div class="cuter-msg">
                                <span class="name">{{item.nickname}}</span>
                            </div>
                            <div class="wjx">
                                <span class="wjs-account">
                                    <i :style="{'background-image': 'url('+aisleId[i - 1]['img']+')'}" v-for="i in item['aisleIds']" :key="i" class="shi"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <a class="jump-kefu" @click="getUserKey(item)">
                        <span :style="{'background-image': 'url('+ljcz+')'}"></span>
                    </a>
                    <span class="save-yh">惠{{ Number(javaYh) }}%</span>
                </li>
            </ul>
        </template>
        <div class="content" v-else>
            <img style="width: 100%;margin-top: 1rem;" :src="noDataImg" alt />
            <p style="font-size: 0.3rem;color: #666666">暂无数据</p>
        </div>
        <van-dialog v-model="showDialog" class="save-dialog" :show-confirm-button="false" :closeOnClickOverlay="true">
            <div class="tit theme-color">VIP充值投诉</div>
            <div class="cont">
                <p>1.VIP充值漏发少发或其它问题，请反馈给我们，我们会查证后立即为您解决。</p>
                <p>2.如遇平台人员向您推荐其它游戏，请截图并举报给我们。查证后会员丰厚奖励。</p>
            </div>
            <div class="btn theme-bg" @click="tousu">
                我要举报
            </div>
        </van-dialog>
    </div>
</view-page>
</template>

<script>
import {
    Dialog
} from 'vant';
export default {
    name: 'customerSaveContent',
    props: {
        // newCustomerList: {
        //   type: Array
        // }
    },
    data() {
        return {
            javaKf: '',
            javaYh: '0',
            tokenDate: '',
            newCustomerList: [],
            fillLink: '',
            url: require('../../assets/img/newSave/King@2x.png'),
            wjx: require('../../assets//img/newSave/shixing@2x.png'),
            wjxBan: require('../../assets/img/newSave/wujiaox@2x.png'),
            bank: require('../../assets/img/newSave/bank@2x.png'),
            zfb: require('../../assets/img/newSave/zfb@2x.png'),
            weixin: require('../../assets/img/newSave/weixin@2x.png'),
            ljcz: require('../../assets/img/newSave/save-cz.png'),
            aisleId:[
                {
                    name: '微信充值',
                    img: require('../../assets/img/newSave/vip-wx.png')
                },
                {
                    name: '支付宝充值',
                    img: require('../../assets/img/newSave/vip-zfb.png')
                },
                {
                    name: '银行卡充值',
                    img: require('../../assets/img/newSave/vip-yhk.png')
                },
                {
                    name: '支付宝极速入款',
                    color : '#00A9F2'
                },
                {
                    name: '云闪付充值',
                    img: require('../../assets/img/newSave/vip-ysf.png')
                }
            ],
            search: '',
            showList: [],
            showDialog : false
        }
    },
    computed: {
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
    created() {
        this.getJavaKf()
    },
    mounted() {

    },
    watch: {},
    methods: {
        tousu() {
            if(this.showDialog) {
                this.showDialog = false
                const link = this.getKF()
                if (link) {
                    if (this.$userAgent.includes('MQQBrowser') || (this.$userAgent.includes('iPhone') && this.$userAgent.includes('SogouMobileBrowser'))) {
                        // 解决QQ浏览器和苹果搜狗浏览器进入在线客服后卡顿
                        // 增加浏览器历史记录
                        window.history.pushState(window.location.href, null, window.location.href)
                        window.location.replace(link)
                    } else {
                        window.tryOpen(link)
                    }
                } else {
                    this.toastText('暂无客服', 'middle')
                }
            }else {
                this.showDialog = true
            }
        },
        // 计算五角星实心个数
        swjxAccount(rank) {
            let list = rank.split('.')
            let swjx = Number(list[0])
            let yu = Number(list[1])
            if (yu > 5) {
                swjx += 1
            }
            return swjx
        },
        getJavaKf() {
            this.$store.dispatch('main/getJavaKf').then(res => {
                if (res.code === 200) {
                    this.javaKf = decodeURIComponent(res.data.link)
                    this.javaYh = res.data.preferential || '0'
                    this.tokenDate = res.data.token
                    if (this.tokenDate != '') {
                        this.getCustomerLists()
                    }
                } else {
                    this.toastText(res.message.split(' '), 'top')
                }
            })
        },
        getCustomerLists() {
            this.toastLoading('加载中');
            this.search = ''
            this.$store.dispatch('main/getCustomerLists', {
                token: this.tokenDate,
                hierarchyId: this.$store.state.user.userInfo.levelId,
                url : this.$route.query.url
            }).then(res => {
                if (res.code === 0) {
                    let list = res.data
                    if (list) {
                        this.newCustomerList = list
                        this.showList = list
                        this.toastClear();
                    }
                } else {
                    this.toastText(res.data.msg, 'top')
                    this.toastClear();
                }
            })
        },
        // 获取客户的key
        getUserKey(data) {
            let newWin
            if (this.canOpenInNewWin()) {
                newWin = window.open('', '_self','',false);
            }
            this.$store.dispatch('main/getUseKey').then(res => {
                if (res.code === 200) {
                    this.fillLink = res.data.data.url + '&port=4&type=0&key=' + res.data.data.key + '&aisleId=' + data['aisleIds'][0] + '&theme='+ localStorage['theme'] + '&agentId=' + data.agentId;
                    window.history.pushState(window.location.href, null, window.location.href);
                    window.location.replace(this.fillLink)
                    // if (newWin) {
                    //     newWin.location.replace(this.fillLink);
                    // } else {
                    //     if (this.$userAgent.includes('MQQBrowser') || (this.isIphone && this.$userAgent.includes('SogouMobileBrowser'))) {
                    //         //增加浏览器历史记录
                    //         window.history.pushState(window.location.href, null, window.location.href);
                    //         window.location.replace(this.fillLink)
                    //     } else {
                    //         window.location.href = this.fillLink
                    //     }
                    // }
                } else {
                    if (newWin) newWin.close()
                    // Dialog.alert({
                    //     message: res.message
                    // });
                    this.showAlert = true
                    this.className = 'neteWork'
                    this.$store.state.main.iosAlert.content = res.message
                    this.$store.state.main.iosAlert.show = true
                    this.$store.state.main.iosAlert.okText = '确定'
                    this.$store.state.main.iosAlert.showNo = false
                }
            })
        },
        canOpenInNewWin() {
            const uas = [
                'SogouMobileBrowser',
                'MQQBrowser',
                'UCBrowser'
            ]
            return !uas.some(ua => new RegExp(ua, 'gi').test(window.navigator.userAgent))
        },
        onSearch() {
            this.toastLoading('加载中');
            if(this.search) {
                this.showList = this.newCustomerList.filter(
                    item =>  item.nickname.indexOf(this.search) > -1
                )
            }else {
                this.showList = this.newCustomerList
            }
            this.$nextTick(() => {
                this.toastClear();
            })
        }
    },
    components: {}
}
</script>

<style lang="less" scoped>
.customer-content{
    padding-top: 0.22rem;
}
.header-right {
    position: absolute;
    right: 0.16rem;
    top: 0;
    font-weight: 400;
    font-size: 0.3rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.search-box {
    width: calc(100% - 0.4rem);
    margin: 0 auto 0.22rem;
    display: flex;
    height: 0.88rem;
    line-height: 0.88rem;
    .refresh-box {
        width: 1.37rem;
        height: 0.88rem;
        font-size: 0.3rem;
        color: #fff;
        border-radius: 0.1rem;
    }
    .search {
        flex: 1;
        margin-left: 0.2rem;
        height: 0.88rem;
        border-radius: 0.1rem;
        font-size: 0.3rem;
        input {
            width: 85%;
        }
        i {
            font-size: 0.35rem;
        }
    }
}

.header-bg {
    background-image: url('../../assets/img/newSave/header-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 2rem;
    width: calc(100% - 0.4rem);
    margin: 0 auto;
}

.content {
    margin: 0.4rem 0.2rem;
    font-size: 0.26rem;
}

.customer-li {
    padding-left: 0.15rem;
    border-radius: 0.1rem;
    text-align: left !important;
    margin-bottom: 0.4rem;
    vertical-align: middle;
    display: flex;
    position: relative;
    background-image: url('../../assets/img/newSave/save-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .left {
        float: left;
        height: 1.8rem;
        display: flex;
        align-items: center;
        position: relative;

        .customer-head {
            display: inline-block;

            .head-img {
                width: 1.14rem;
                height: 1.14rem;
                background-repeat: no-repeat;
                border-radius: 50%;
                background-size: cover;
            }

            .hot {
                position: absolute;
                width: 0.32rem;
                height: 0.59rem;
                left: 0;
                top: 0;
                background-size: contain;
                background-repeat: no-repeat;
            }
        }

        .detail {
            display: inline-block;
            margin: 0.2rem 0rem 0.2rem 0.26rem;
            display: flex;
            flex-direction: column;
            height: calc(100% - 0.4rem);
            justify-content: space-between;

            .cuter-msg {
                .name {
                    font-size: 0.36rem;
                    color: #865D16;
                }

                .amount {
                    margin-left: 0.23rem;
                    font-size: 0.2rem;
                    color: #999999;
                }
            }

            .wjx {
                position: relative;
                top: -0.05rem;

                .wjs-account {
                    vertical-align: middle;
                    i {
                        display: inline-block;
                        width: 0.5rem;
                        height: 0.3rem;
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-size: 100% 100%;
                    }
                }
            }

            .save-type {
                display: flex;
                align-items: center;
                color: #926C32;
                span {
                   
                }

                // .img-bank {
                //   width: 0.45rem;
                //   height: 0.3rem;
                // }
                // .img-zfb {
                //   width: 0.45rem;
                //   height: 0.3rem;
                // }
                // .img-weixin {
                //   width: 0.45rem;
                //   height: 0.3rem;
                // }
            }
        }
    }

    .jump-kefu {
        height: 100%;
        display: block;
        margin: auto;
        justify-content: center;
        align-items: center;
        display: flex;
        position: absolute;
        right: 0.15rem;

        span {
            display: inline-block;
            width: 1.8rem;
            height: 0.68rem;
            line-height: 0.5rem;
            background-repeat: no-repeat;
            background-size: contain;
        }
    }

    .save-yh {
        position: absolute;
        width: 2rem;
        height: 0.5rem;
        right: 0.2rem;
        top: -0.1rem;
        background-image: url('../../assets/img/newSave/save-yh.png');
        background-repeat: no-repeat;
        background-size: 100%;
        line-height: 0.38rem;
        text-align: center;
        color: #FFFFFF;
        font-size: 0.22rem;
    }
}
.save-dialog {
    .tit {
        font-size: 0.46rem;
        padding: 0.2rem 0 0.16rem;
    }
    .cont {
        font-size: 0.26rem;
        text-align: left;
        padding:0 0.34rem 0.3rem;
    }
    .btn {
        width: 5rem;
        height: 0.84rem;
        line-height: 0.84rem;
        font-size: 0.36rem;
        color: #fff;
        margin: 0 auto 0.3rem;
        border-radius: 0.05rem;
    }
}
</style>
