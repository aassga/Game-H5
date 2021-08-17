<template>
<div class="clzs-compent">
    <div class="list-left">
        <img class="left-img" :src="imgUrl(result.lid)" />
        <div class="left-text">
            <p class="text-title theme-color-white">{{result.lotteryName }}</p>
            <p class="text-issuc">
                <span class='issuc theme-color-gray-7'>{{ forMartIssu(result.issue) }}期</span>
                <span class="time theme-color theme-color-yellow-2">{{ timeStr() }}</span>
            </p>
            <p class="text-info">
                <span class="info-ball theme-main-bg-6 theme-color-gray-6">{{ result.ballTitle }}</span>
                <span class="info-num" :class="classType[result.playwayTitle]">{{ result.playwayTitle }}</span>
                <span class="info-issuc">{{result.num}}期</span>
            </p>
        </div>
    </div>
    <div :class="['list-right',{'black-list-right' : $config.blackTheme || $config.newQP || $config.blush}]">
        <div class="right-da theme-gradient-bg-1 theme-border-1px cp-theme-border-1px" :class="[{'enable' : timeStr()=='开奖中'},{'black-enable' : $config.blackTheme || $config.newQP || $config.blush && timeStr()=='开奖中'}]" @click.prevent="getActive($event, 0,result,JSON.parse(result.playwayJson)[0])">
            <p class="right-text theme-color-white">{{ JSON.parse(result.playwayJson)[0].code }}</p>
            <p :class="[{'theme-color-gray-2':$config.blackTheme || $config.newQP},{'theme-color-red-1':$config.blush}]" >赔{{ JSON.parse(result.playwayJson)[0].odds }}</p>
        </div>
        <div class="right-da theme-gradient-bg-1 theme-border-1px cp-theme-border-1px" :class="[{'enable' : timeStr()=='开奖中'},{'black-enable' : $config.blackTheme || $config.newQP || $config.blush && timeStr()=='开奖中'}]" @click.prevent="getActive( $event, 1,result,JSON.parse(result.playwayJson)[1])">
            <p class="right-text theme-color-white">{{ JSON.parse(result.playwayJson)[1].code }}</p>
            <p :class="[{'theme-color-gray-2':$config.blackTheme || $config.newQP},{'theme-color-red-1':$config.blush}]">赔{{ JSON.parse(result.playwayJson)[1].odds }}</p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'clzsResul',
    props: {
        result: {
            type: Object,
            default: {

            }
        },
        // getOddsProp: {
        //     type: Object
        // }
    },
    data() {
        return {
            active: null,
            longList: [],
            index: 0,
            task: null,
            time: this.result.fengpan,
            playway: {

            },
            longDragon: 1,
            classType: {
                '大': 'big',
                '小': 'small',
                '单': 'dan',
                '双': 'shuang',
                '龙': 'long',
                '虎': 'hu',
                '尾大': 'weiBig',
                '尾小': 'weiSmall'
            }
        }
    },
    watch: {
        'result': {
            handler(val) {
                this.starTime()
            },
            deep: true
        }
    },
    methods: {
        getActive(ev, index, data, playway) {
            let key = ''
            if (this.timeStr() == '开奖中') {
                return false
            } else {
                key = data.code + '_' + data.lid
                try {
                    if (ev && (ev.target.classList.value.includes('theme-bg')) || ev.target.parentElement.classList.value.includes('theme-bg')) {
                        ev.target.classList.remove('theme-bg') || ev.target.parentElement.classList.remove('theme-bg')
                        this.playway = {}
                    } else {
                        let cont = document.getElementsByClassName('content-clzs')[0].getElementsByClassName('theme-bg')
                        for (let k = 0; k < cont.length; k++) {
                            cont[k].classList.remove('theme-bg')
                        }
                        if (ev && ev.target.className.includes('right-da')) {
                            ev.target.classList.add('theme-bg')

                        } else if(ev.target.parentElement.className.includes('right-da')){
                            ev.target.parentElement.classList.add('theme-bg')
                        }
                        playway.money = ''
                        playway.odds = JSON.parse(data.playwayJson)[index].odds
                        let model = {
                            lotteryId: data.lid,
                            issue: data.issue,
                            rebate: 0,
                            code: [playway]
                        }
                        this.playway = model
                        this.longDragon = data.playwayTitle == playway.code ? 1 : 2
                    }
                } catch (error) {

                }
            }
            this.$emit('sortActive', this.playway, this.longDragon, key, index)
        },
        fomartOdd(lid, playway, code) {
            console.log(lid);
            try {
                let odds = ''
                odds = this.getOddsProp[playway + "_" + code].odds
                return odds
            } catch (error) {
            }
        },
        imgUrl(link) {
            if(this.$config.name === 'amxpj') {
                return localStorage.SiteStaticsUrl + '/images/style34/20001/' + link + '.png'
            }else if(this.$config.name === '99qp') {
                return localStorage.SiteStaticsUrl + '/images/style36/20001/' + link + '.png'
            }else if(this.$config.name === 'kkqp') {
                return localStorage.SiteStaticsUrl + '/images/style38/20001/' + link + '.png'
            }else if(this.$config.name === 'tyc82') {
                return localStorage.SiteStaticsUrl + '/images/style69/20001/' + link + '.png'
            }else if(this.$config.name === 'xpj80') {
                return localStorage.SiteStaticsUrl + '/images/style71/20001/' + link + '.png'
            }else if(this.$config.name === 'vns81') {
                return localStorage.SiteStaticsUrl + '/images/style73/20001/' + link + '.png'
            }else if(this.$config.home === 'qp') {
                return localStorage.SiteStaticsUrl + '/images/'+ JSON.parse(localStorage.config).theme +'/m/' + link + '.png '
            }else if(this.$config.home === 'amhg'){
                return localStorage.SiteStaticsUrl + '/images/style14/20001/' + link + '.png '
            }else if(this.$config.name === 'tyc86'){
                return localStorage.SiteStaticsUrl + '/images/style28/20002/' + link + '.png '
            }else {
                return localStorage.SiteStaticsUrl + '/images/'+ JSON.parse(localStorage.config).theme +'/20001/' + link + '.png '
            }
        },
        timeStr() {
            if (isNaN(this.time) || this.time < 0) {
                this.$emit('update:closed', this.result.code + '_' + this.result.lid)
                return '开奖中'
            } else if (this.time) {
                let house = Math.floor(this.time / 60 / 60)
                let minute = Math.floor((this.time % (60 * 60)) / 60)
                let second = this.time % 60

                minute = minute > 0 ? minute : 0
                second = second > 0 ? second : 0

                if (house) {
                    return this.number2(house) +
                        ':' +
                        this.number2(minute) +
                        ':' +
                        this.number2(second)
                } else {
                    return this.number2(minute) +
                        ':' +
                        this.number2(second)
                }
            } else {
                this.$emit('update:closed', this.result.code + '_' + this.result.lid)
                return '开奖中'
            }
        },
        starTime() {
            // 刷新数据
            this.removeTask()
            // 设置计时任务
            this.time = this.result.fengpan
            this.task = window.setInterval(() => {
                if (this.time > 0) {
                    this.time--
                } else if (this.time === 0) {
                    this.$emit('update:closed', this.result.code + '_' + this.result.lid)
                    this.time = -1
                }
            }, 1000)
        },
        removeTask() {
            if (this.task) {
                window.clearInterval(this.task)
            }
        },
        close() {

        }
    },
    mounted() {
        // var lastTouchEnd = 0;
        // document.documentElement.addEventListener('touchend', function (event) {
        //     var now = Date.now();
        //     if (now - lastTouchEnd <= 300) {
        //         event.preventDefault();
        //     }
        //     lastTouchEnd = now;
        // }, false);
        // 刷新数据
        this.removeTask()
        // 设置计时任务
        this.task = window.setInterval(() => {
            if (this.time > 0) {
                this.time--
            } else if (this.time === 0) {
                this.$emit('update:closed')
                this.time = -1
            }
        }, 1000)
    },
}
</script>

<style lang="less" scoped>
.clzs-compent {
    display: flex;
    width: 100%;

    >.list-left {
        width: 4.35rem;
        display: flex;
        align-items: center;

        >img {
            width: 1.2rem;
            height: 1.2rem;
        }

        >.left-text {
            flex: 1;
            margin-left: 0.25rem;
            display: flex;
            flex-direction: column;
            max-width: 2.9rem;
            overflow: hidden;
            height: 100%;
            justify-content: space-between;

            >.text-title {
                height: 0.4rem;
                font-size: 0.32rem;
                color: #000;
                line-height: 0.4rem;
                text-align: left;
                // font-weight: 600;
                // font-family: PingFang SC,Helvetica Neue,Helvetica,Arial,Hiragino Sans GB,Heiti SC,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;
            }

            >.text-issuc {
                text-align: left;
                display: flex;

                >.issuc {
                    height: 0.32rem;
                    font-size: 0.28rem;
                    line-height: 0.32rem;
                    color: #000000;
                    margin-right: 0.28rem;
                    font-weight: 400;
                }

                >.time {
                    height: 0.32rem;
                    font-size: 0.28rem;
                    line-height: 0.32rem;
                }
            }

            >.text-info {
                display: flex;
                margin-top: 0.05rem;

                >span {
                    height: 0.38rem;
                    line-height: 0.38rem;
                    border-radius: 0.06rem;
                    margin-right: 0.08rem;
                    padding: 0 0.12rem;
                    font-size: 0.24rem;
                }

                >.info-ball {
                    background-color: #CACDC6;
                    color: #FFFFFF;
                    text-align: center;
                }

                >.info-num {
                    background-color: #50B65E;
                    color: #FFFFFF;
                    text-align: center;
                }

                >.big {
                    background: rgba(237, 96, 87, 1);
                }

                >.small {
                    background: rgba(28, 185, 102, 1);
                }

                >.dan {
                    background: rgba(105, 112, 243, 1);
                }

                >.shuang {
                    background: rgba(56, 132, 249, 1);
                }

                >.long {
                    background: rgba(28, 185, 102, 1);
                }

                >.hu {
                    background: rgba(237, 96, 87, 1);
                }

                >.weiBig {
                    background: rgba(237, 96, 87, 1);
                }

                >.weiSmall {
                    background: rgba(28, 185, 102, 1);
                }

                >.info-issuc {
                    background-color: #ED6057;
                    color: #FFFFFF;
                    text-align: center;
                }
            }
        }
    }

    >.list-right {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .right-text{
            font-weight:420;
            color: #999999;
        }
        >div {
            width: 1.1rem;
            height: 1.1rem;
            border: 0.02rem solid rgba(241, 241, 241, 0.8);
            border-radius: 0.13rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            >p {
                &:nth-child(1) {
                    color: #555;
                    // font-weight: bold;
                    font-size: 0.37rem;
                }

                &:nth-child(2) {
                    width: auto;
                    color: #7F7F7F;
                    font-size: 0.21rem;
                    // margin-top: 0.1rem;
                }
            }

            >.active {
                background-color: #4D8FFA;
                border: 0 !important;
                color: #FFFFFF !important;
            }
        }

        >.theme-bg {
            border: none !important;

            >p {
                color: #FFFFFF !important;
                border: none !important;
            }
        }

        >.enable {
            position: relative;
            &:after {
                content: '';
                background-image: url('../../../../assets/img/lottery/clzs/fengpan.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;
                position: absolute;
                top: -0.04rem;
                right: -0.02rem;
                width: 0.63rem;
                height: 0.54rem;
            }
            &.black-enable {
                &::after {
                    background-image: url('../../../../assets/img/lottery/clzs/black-fengpan.png');
                }
            }

            >p {
                &:nth-child(1) {
                    color: #B4B4B4 !important;
                }

                &:nth-child(2) {
                    color: #B4B4B4 !important;
                }
            }

        }
        &.black-list-right {
            >.theme-bg {
                border: 0.02rem solid #E6C245 !important;;
            }
        }
    }
}
</style>
