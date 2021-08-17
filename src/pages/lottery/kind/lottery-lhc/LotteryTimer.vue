<template>
<section class="lottery-timer theme-main-bg-5 theme-after-border-color-1">
    <div class="label">
        <p class="issue theme-color-white" v-if="result['issue']">
            {{getIssue()}}期:
        </p>
        <p class="issue theme-color-white" v-else>{{defaultIssue}}期:</p>
    </div>
    <div class="content theme-color-white" v-show="closed">
        投注截止<span class="time theme-color theme-color-yellow-2" style="margin-left: 0.06rem">封盘</span>
    </div>
    <div class="content theme-color-white" v-show="!closed">
        投注截止<span class="time theme-color theme-color-yellow-2">{{timeStr}}</span>
    </div>
    <div class="dig-div" v-if="[12,13,16,17,18,19,27,3630,3631,3632,10044,10045].includes(result.lotteryId) && digits.length>5" :style="digStyle" @click="show = !show">
        <div style="width:2rem; display: flex;align-items: center; float: right;height: inherit; margin-right: 0.12rem;">
            <DigitRoll :rollDigits="digits" :flipStra='true' />
        </div>
    </div>
    <van-popup v-model="show" get-container="body">
        <img style="width:6.58rem;" :src="$config.blackTheme || $config.newQP? require('../../../../assets/img/kaijiang/black_kaijiang_bg.png') : require('../../../../assets/img/kaijiang/kaijiang_bg.png')" />
        <div class="jiangchi_txt">
            <p :class="{'theme-color-white':$config.blackTheme|| $config.newQP}">
                1、会员投注每中奖1000元，奖池累积5元，投注越多奖池累积越多。</p>
            <p :class="{'theme-color-white':$config.blackTheme|| $config.newQP}">
                2、会员投注中奖时，即有机会击中奖池，获得奖池派彩。彩种结算时，进行奖金派发并推送中奖通知。</p>
            <p :class="{'theme-color-white':$config.blackTheme|| $config.newQP}">
                3、中奖金额依据奖池金额进行匹配，随机发放。奖池金额越高，奖金越高，千万大奖等您拿。

            </p>
            <p class="text-ct text-ct-one " :class="{'theme-color-white':$config.blackTheme|| $config.newQP}">感谢您对{{this.$config.name === "aqvns"?this.$config.setName:"云博科技"}}的支持！</p>
            <p class="text-ct" :class="{'theme-color-white':$config.blackTheme|| $config.newQP}">祝您下注中奖，黄金万两！</p>
        </div>
        <p class="pop_know" @click="show = false"></p>
    </van-popup>
</section>
</template>

<script>
import DigitRoll from '../../../../components/digitroll'
export default {
    name: 'LotteryTimer',
    components: {
        DigitRoll
    },
    props: {
        result: {
            type: Object,
            required: true
        },
        closed: {
            type: Boolean,
            required: true
        },
        opening: {
            type: Boolean,
            required: true
        },
        digits: {
            type: [String, Array],
            required: true
        }
    },
    data() {
        return {
            show: false,
            time: NaN,
            task: null
        }
    },
    computed: {
        digStyle() {
            return `background-image:url(${require(`../../../../assets/img/digitRoll/jiangchi_${localStorage.theme ? localStorage.theme : (this.$config.home === 'vns' ? 'bluegreen' : 'default') }.png`)})`
        },
        timeStr() {
            if (isNaN(this.time) || this.time < 0) {
                return ''
            } else if (this.time) {
                let day = Math.floor(this.time / 60 / 60 / 24)
                let house = Math.floor((this.time % (60 * 60 * 24)) / 60 / 60)
                let minute = Math.floor((this.time % (60 * 60)) / 60)
                let second = this.time % 60

                minute = minute > 0 ? minute : 0
                second = second > 0 ? second : 0

                if (day) {
                    if (!house) return day + '天' + this.number2(minute) + '分' + this.number2(second) + '秒'
                    return day + '天' + this.number2(house) + '时' + this.number2(minute) + '分' + this.number2(second) + '秒'
                } else if (house) {
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
                return '00:00'
            }
        },
        defaultIssue() {
            switch (this.$route.params.id.toString()) {
                case '1':
                case '19':
                    return '???'

                case '18':
                    return '????'

                default:
                    return '???'
            }
        }
    },
    watch: {
        result:{
            handler:function(val,old){
                if (this.result) {
                    if (this.result['djs_next_kaipan'] > 0) {
                        this.time = this.result['djs_next_kaipan']
                        this.closed = true
                    } else if (this.result['djs_fengpan'] > 0) {
                        this.time = this.result['djs_fengpan']
                        this.closed = false
                    } else {
                        this.closed = true
                        this.removeTask()
                    }
                    this.$emit('update:closed', this.closed)
                }
            },
            immediate:true
        }
    },
    mounted() {
        // 刷新数据
        this.removeTask()

        // 设置计时任务
        this.task = window.setInterval(() => {
            if (this.time > 0) {
                this.time--
            } else if (this.time === 0) {
                this.$emit('update:closed', !this.closed)
                this.time = -1
            }
        }, 1000)
    },
    methods: {
        getIssue() {
            return this.result['issue'].toString().length > 9 ?
                parseInt(this.result['issue']).toString().substr(8) :
                this.result['issue'].toString().length > 4 ?
                parseInt(this.result['issue']).toString().substr(4) :
                parseInt(this.result['issue'])
        },
        removeTask() {
            if (this.task) {
                window.clearInterval(this.task)
            }
        }
    },
    beforeDestroy() {
        this.removeTask()
    }
}
</script>

<style lang="less" scoped>
.lottery-timer {
    background-color: #fff;
}

.dig-div {
    height: 0.56rem;
    display: inline-block;
    width: 3.35rem;
    position: relative;
    top: -0.03rem;
    // background-image: url('../../../../assets/img/digitRoll/jiangchi.png');
    background-size: 100%;
    margin-right: 0.15rem;
}

.pop_know {
    position: absolute;
    width: 4.1rem;
    height: 0.62rem;
    background-image: url('../../../../assets/img/kaijiang/ikonw.png');
    background-size: 100%;
    z-index: 10;
    bottom: 0.85rem;
    margin: auto;
    left: 50%;
    transform: translate(-50%, 0);
}

.jiangchi_like {
    position: absolute;
    bottom: 2.18rem;
    width: 4.1rem;
    color: #444444;
    left: 50%;
    transform: translate(-50%, 0);
    font-size: 0.24rem;
    font-weight: 600;
    background-color: #ffffff;
}

.jiangchi_txt {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    top: 2.32rem;
    width: 4.8rem;
    height: 3.28rem;

    >p {
        font-size: 0.24rem;
        font-weight: 600;
        color: #444444;
        text-align: left;
        line-height: 0.52rem;
        // margin-bottom: 0.12rem;
        // letter-spacing:0.01rem;
    }
    .text-ct{
      text-align: center;
    }
    .text-ct-one{
      margin-top: 0.12rem;
    }
}
</style>
