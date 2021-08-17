<!-- 长龙助手 -->
<template>
<view-page ref="view-page" class="theme-header-bg" full-box :position-style="positionStyle" is-transition>
    <lottery-header slot="header"></lottery-header>
    <section slot="content" class="lotter-clzs" :class="[{'theme-header-bg':$config.blackTheme || $config.newQP},{'theme-main-bg':$config.blush}]">
        <div class="content-clzs" v-if="longList.length>0 ">
            <div class="clzs-list theme-main-bg-5" v-for="(item,index) in longList" :key='index'>
                <clzs-result :result='item' @sortActive='getActive' @update:closed='closeResult'></clzs-result>
            </div>
            <p v-if="longList.length>0 " class="finilly-all theme-color-white">已显示全部</p>
        </div>
    </section>
    <clzs-bet-input slot="footer" :playway='playway' :longDragonType='longDragon' @clearPlayway='clern'></clzs-bet-input>
</view-page>
</template>

<script>
import lotteryMixin from '../mixin'

import clzsBetInput from './../../component/lotteryclsz-bet-input/clzsBetInput'
import clzsResult from './lotteryResult'
export default {
    name: 'lotteryClzs',
    mixins: [lotteryMixin],
    components: {
        clzsBetInput,
        clzsResult
    },
    data() {
        return {
            active: null,
            longList: [],
            task: null,
            backGame: [],
            playway: null,
            longDragon: 1,
            activeKey: '',
            activeIndex: 0,
            getOdds: [],
            letLong: [],
            timer : 0,
        }
    },
    created() {
        this.init()
        this.timer = setInterval(() => {
            this.init()
        }, 10000);
    },
    computed: {

    },
    methods: {
        init() {
            let _self = this
            if(!this.activeKey && !this.activeKey.length > 0) {
                this.$store.dispatch('lottery/getLongDragon', {
                    callback: res => {
                        _self.backGame = Object.values(res.back_game)
                        _self.longList = res.list.filter(res => !(_self.backGame.includes(res.lid)))
                    }
                })
            }
        },
        getActive(playway, longDragon, key, index) {
            if (playway && playway.code && playway.code.length > 0) {
                this.playway = playway
                this.longDragon = longDragon
                this.activeKey = key
                this.activeIndex = index
            } else {
                this.playway = {}
                this.activeKey = ''
            }
        },
        closeResult(data) {
            try {
                let cont = document.getElementsByClassName('content-clzs')[0].getElementsByClassName('theme-bg')
                if (cont && cont.length > 0 && this.activeKey === data) {
                    this.clern()
                    this.toastText("已封盘", "top");
                }
            } catch (error) {

            }
        },
        clern() {
            this.playway = null
            this.$store.state.key.show = false
            this.$store.state.key.target = null
            this.money = ''
            this.longDragon = 1
            this.activeKey = ''
            try {
                let cont = document.getElementsByClassName('content-clzs')[0].getElementsByClassName('theme-bg')
                for (let k = 0; k < cont.length; k++) {
                    cont[k].classList.remove('theme-bg')
                }
            } catch (error) {

            }

        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
}
</script>

<style lang="less" scoped>
/deep/ .auto-box-content {
    // background-color: rgba(241, 241, 241, 0.7);
}

.content-clzs {
    margin: 0.24rem 0.2rem 0.2rem 0.2rem;

    >.clzs-list {
        height: 1.68rem;
        width: 100%;
        padding: 0.2rem 0.16rem 0.2rem 0.28rem;
        margin-bottom: 0.2rem;
        // background-color: red;
        background-color: #FFFFFF;
        box-shadow:0px 0.03rem 0.03rem rgba(205,205,205,0.06);
        border-radius: 0.15rem;
        position: relative;
        display: flex;

        // &::after {
        //     position: absolute;
        //     box-sizing: border-box;
        //     content: ' ';
        //     pointer-events: none;
        //     right: 0;
        //     bottom: 0;
        //     left: 0.32rem;
        //     border-bottom: 0.02rem solid #ebedf0;
        //     -webkit-transform: scaleY(.5);
        //     transform: scaleY(.5);
        // }

        &:last-child {
            height: 1.94rem !important;
        }
    }
    .finilly-all {
        height: 1rem;
        line-height: 0.6rem;
        font-size: 0.28rem;
        color: #444;
    }
}
</style>
