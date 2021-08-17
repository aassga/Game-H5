<template>
<section class="lottery-bet-input-box number-font" v-show="playShow">
    <transition :name="playShow?'slide-up':'slide-down'">
        <div class="lottery-bet-input-div" v-show="playShow" :style="{height: boxHeight+'px'}"></div>
    </transition>
    <div :style="{height:$store.state.key.height+'px'}" v-show="$store.state.key.target===$refs.input"></div>
    <div ref="input-box" :style="positionStyle" class="lottery-bet-input-flex">
        <transition :name="playShow?'slide-up':'slide-down'">
            <div class="lottery-bet-input theme-border" v-show="playShow" :style="keyBoardAnimationStyle">
                <div class="chip-row theme-main-bg-5 theme-border-color">
                    <button class="chip-btn-item btn-item theme-color theme-bg-active theme-border-active theme-gradient-bg-2 theme-border-1px theme-color-white" @touchstart="chipClick(v,i)" v-for="(v,i) in chip" :key="'btn'+i">{{v}}</button>
                    <button class="btn-item theme-color btn-edit theme-main-bg-6 theme-color-white" @click="onEditChip">编辑筹码</button>
                </div>
                <div class="input-row theme-header-bg">
                    <span class="btn-clear" @click="clear"><i class="icon iconfont h5-icon-delbet_icon font"></i><i>清除</i></span>
                    <input ref="input" type="number" class="input theme-main-bg-6 theme-color-white" v-model="money" v-number-keyboard="8" placeholder="请输入金额">
                    <button class="btn-submit theme-bg theme-yellow-bg-2 theme-color-black" @click="onOrder">立即投注</button>
                </div>
            </div>
        </transition>
    </div>
    <pub-dialog v-model="chipEditing" style="z-index: 9999">
        <div class="editor-box theme-gradient-bg-4 theme-color-white">
            <h4 class="editor-header theme-after-border-color">预设金额</h4>
            <ul class="editor-body">
                <li class="editor-item" v-for="(c, i) in editChip" :key="i">
                    <input class="input theme-border-1px theme-color-white" type="tel" v-model="editChip[i]" @blur="onChipBlur(i)" @focus="onChipFocus(i)" placeholder="请输入金额" />
                </li>
            </ul>
            <footer class="editor-footer theme-after-border-color">
                <a href="javascript:void(0)" class="btn btn-no theme-color theme-border theme-border-yellow theme-header-bg theme-color-yellow" @click="onNo">取消</a>
                <a href="javascript:void(0)" class="btn btn-ok theme-bg theme-yellow-bg-2 theme-color-black" @click="onSave">确定</a>
            </footer>
        </div>
    </pub-dialog>
    <div class="mask" v-show="showOrderList" style="position: fixed; z-index:95; top: 0; right: 0; left: 0;bottom: 0;background: rgba(0, 0, 0, 0.1);"></div>
    <vux-popup class="lottery-order-box" :show-mask="false" :style="[orderListStyle,positionStyle]" :close-on-click-overlay="false" @hide-on-blur="showOrderList=$store.state.key.show" v-model="showOrderList" position="bottom" get-container="body" @closed="orderChanged=false">
        <header class="header-box theme-main-bg-5 theme-border-color">
            <h4 class="lottery-order-title theme-color-white">下注清单</h4>
        </header>
        <!--      <scroll-box class="lottery-order-list-box" auto>-->
        <scroll-box ref="order" class="lottery-order-list-box theme-main-bg-5" :style="{maxHeight:(($store.state.key.show?3:6)*0.8)+'rem'}" auto>
            <ul class="lottery-order-list">
                <li v-if='showOrderList' class="lottery-order-item theme-border-color">
                    <span class="lottery-order-item-code theme-color-white">{{ orderList[0].ball+' - '+orderList[0].code  }}</span>
                    <span class="lottery-order-item-odds theme-color-white">赔率:{{ orderList[0].odds }}</span>
                    <span class="theme-color rmb theme-color-yellow-2">¥</span>
                    <input ref="orderList" :class=" money > 0 ? '': 'input-red'" class="input number-font theme-color-white" v-model="money" type="number" v-number-keyboard="7">
                </li>
            </ul>
        </scroll-box>
        <div class="lottery-order-all theme-main-bg-5 theme-color-white">
            <p>共计:<span class="theme-color number-font theme-color-yellow-2">1</span>注,
                <span v-if="isNaN(money) || money <= 0" class="red">请输入正确金额</span>

                <span class='red' v-else-if="money > parseFloat(limit['lotteryBetMax'])">超出单注限额</span>
                <span class='red' v-else-if="(parseFloat(this.money) && parseFloat(this.money) > this.$store.state.user.userInfo.balance)">余额不足</span>
                <span v-else>下注金额<span class="theme-color number-font">{{money}}</span>元</span>
            </p>
        </div>
        <footer class="active-box theme-header-bg">
            <button class="btn-action btn-action-cancel theme-color-white theme-main-bg-7" @click="onBetCancel">取消</button>
            <button class="btn-action btn-action-commit theme-bg theme-yellow-bg-2 theme-color-black" @click="onSubmit">确认</button>
        </footer>
    </vux-popup>
    <vux-loading :show="submitting" text="下注中" v-transfer-dom></vux-loading>
</section>
</template>

<script>
export default {
    name: 'clzsBetInput',
    props: {
        playway: {
            type: Object,
            default: {

            }
        },
        longDragonType: {
            type: Number,
            default : 1
        }
    },
    data() {
        return {
            playShow: false,
            money: '',
            boxHeight: 0,
            chip: [],
            editChip: [],
            chipFocus: [],
            chipEditing: false,
            oldChip: [],
            maxChip: 50000,
            showOrderList: false,
            orderMoney: null,
            banlanceSur: false,
            orderChanged: false,
            orderList: [],
            submitting: false
        }
    },
    watch: {
        'playway': {
            handler(val) {
                this.showOrderList = false
                this.money = ''
                if (val && val.lotteryId && val.code.length > 0) {
                    this.playShow = true
                } else {
                    this.playShow = false
                }
            },
            deep: true
        },
        chipEditing() {
            if (this.chipEditing) {
                this.editChip = JSON.copyObj(this.chip)
                this.oldChip = JSON.copyObj(this.chip)
            }
        }
    },
    computed: {
        orderListStyle() {
            if (this.$store.state.key.show) {
                return {
                    transitionTimingFunction: 'cubic-bezier(1,1,1,1)',
                    transform: `translate3d(0, ${0 - this.$store.state.key.height}px, 0)`
                }
            } else {
                return {}
            }
        },
        keyBoardAnimationStyle() {
            if (this.$store.state.key.target === this.$refs.input) {
                return {
                    transform: 'translateY(' + (-this.$store.state.key.height) + 'px)'
                }
            } else {
                return {}
            }
        },
        positionStyle() {
            //解决安卓小米position：fixed问题导致按钮错位问题
            if (this.$mobileDevice.isAndroid &&
                this.$mobileDevice.browserName === 'MIUI Browser') {
                return {
                    position: 'absolute'
                }
            } else {
                return {
                    position: 'fixed'
                }
            }
        },
        limit() {
            return this.$store.state.main.config ? (this.$store.state.main.config.limit || {}) : {}
        },
    },
    mounted() {
        document.body.id = 'lotterBetPage'
        this.domResize.bind(this.$refs['input-box'], () => {
            if (this.$refs['input-box']) {
                this.boxHeight = this.$refs['input-box'].clientHeight
                console.log(this.boxHeight)
            }
        })
    },
    created() {
        if (this.$store.state.config) {}
        try {
            let chip = JSON.parse(localStorage['chip'])
            if (Object.prototype.toString.call(chip) !== '[object Array]') {
                this.oldChip = this.chip = [50, 500, 1000, 10000]
                localStorage['chip'] = JSON.stringify(this.chip)
            } else {
                chip = chip.map(num => parseInt(num))
                chip.sort((v1, v2) => v1 - v2)
                this.oldChip = this.chip = chip.map(num => num > this.maxChip ? this.maxChip : num)
            }
        } catch (e) {
            this.oldChip = this.chip = [50, 500, 1000, 10000]
            localStorage['chip'] = JSON.stringify(this.chip)
        }
    },
    methods: {
        onSubmit() {
            if (this.orderList.length && !this.submitting) {
                let code = []
                code = this.orderList
                code[0]['money'] = this.money
                const data = {
                    lotteryId: this.playway.lotteryId,
                    issue: this.playway.issue,
                    rebate: 0,
                    code,
                    longDragonType : this.longDragonType || 1
                }
                this.showOrderList = false
                this.submitting = true
                this.$store.dispatch('lottery/submit', {
                    data,
                    callback: (res, err) => {
                        this.submitting = false
                        if (!err) {
                            if (res.status === 200) {
                                res = res.data
                                if (res['code'] === 200) {
                                    this.clear()
                                    this.toastText(res['data'], 'middle')
                                    this.$store.dispatch('user/refreshBalance').then().catch()
                                    // this.$store.dispatch('lottery/getLotteryNoCount').then().catch()
                                } else if (res.message) {
                                    this.$vux.confirm.show({
                                        title: '下注失败',
                                        content: res.message.indexOf('超出单注') == 0 ? '超出单注限额</br>' + '单注最高' + res.message.match(/[0-9]+/g)[0] + '元,最低' + res.message.match(/[0-9]+/g)[1] + '元' : res.message,
                                        confirmText: '确定',
                                        cancelText: '去充值',
                                        onConfirm: () => {
                                            this.clear()
                                        },
                                        onCancel: () => {
                                            this.$router.replace('/save')
                                        }
                                    })

                                }
                            } else {
                                console.error(err)
                            }
                        }
                    }
                })
                // }
                //  else {
                //   this.$dialog({
                //     title: '温馨提示',
                //     message: '请输入有效的投注金额'
                //   })
                // }
            }
        },
        onBetCancel() {
            this.showOrderList = false;
            if (this.$mobileDevice.isAndroid &&
                this.$mobileDevice.browserName === 'MIUI Browser') {
                if (this.$refs['input-box']) {
                    this.boxHeight = this.$refs['input-box'].clientHeight
                }
            }
        },
        onEditChip() {
            this.chipEditing = true
        },
        chipClick(val, index) {
            //下注金额不能大于最大下注金额
            if (this.money) {
                if (parseFloat(this.money) < parseFloat(this.limit['lotteryBetMax'])) {
                    this.money = parseFloat(this.money) + parseFloat(val);
                }
            } else {
                this.money = parseFloat(val);
            }
            var arr = document.getElementsByClassName("chip-btn-item");
            for (var i = 0; i < arr.length; i++) {
                arr[i].classList.remove("active");
                arr[i].classList.remove("theme-border-yellow");
            }
            arr[index].classList.add("active");
            arr[index].classList.add("theme-border-yellow");
        },
        onOrder() {
            if (this.playShow) {
                let status = true
                let money = parseInt(this.money)
                if (isNaN(money) || money < 0) money = 0

                if (!money) {
                    this.toastText('请输入正确的整数金额', 'middle')
                    status = false
                }

                if (status) {
                    this.orderList = JSON.copyObj(this.playway.code)
                    const overlay = document.querySelector('.van-overlay')
                    // if (overlay) overlay.style.zIndex = '9999'
                    // console.log(overlay)
                    this.showOrderList = true
                    if (this.$mobileDevice.isAndroid && this.$mobileDevice.browserName === 'MIUI Browser') {
                        //解决小米手机投注框问题
                        var hFixed = 38.4 + 32.64 + 67.2; //固定总高度
                        var defaultH = 38.4; //默认一行数据的高度
                        if (this.$userAgent.indexOf('MI 8') > -1 &&
                            this.$mobileDevice.osVersion === '9') {
                            //处理小米8高度差异问题
                            hFixed += 20;
                            defaultH = 40;
                        }
                        var countOrder = this.playway.code.length;
                        if (countOrder > 6) {
                            countOrder = 6;
                        }

                        var dFixed = defaultH * countOrder;
                        this.boxHeight = hFixed + dFixed;
                    }
                } else {
                    this.orderList = []
                    this.showOrderList = false
                }
                console.log(this.orderList)
            } else {
                this.orderList = []
                this.showOrderList = false
            }

            this.orderChanged = false
        },
        onSave() {
            localStorage['chip'] = JSON.stringify(this.editChip)
            try {
                let chip = JSON.parse(localStorage['chip'])
                if (Object.prototype.toString.call(chip) !== '[object Array]') {
                    this.oldChip = this.chip = [50, 500, 1000, 10000]
                    localStorage['chip'] = JSON.stringify(this.chip)
                } else {
                    chip = chip.map(num => parseInt(num))
                    chip.sort((v1, v2) => v1 - v2)
                    this.oldChip = this.chip = chip.map(num => num > this.maxChip ? this.maxChip : num)
                }
            } catch (e) {
                this.oldChip = this.chip = [50, 500, 1000, 10000]
                localStorage['chip'] = JSON.stringify(this.chip)
            }

            this.chipEditing = false
        },
        onNo() {
            this.chipEditing = false
            this.chip = JSON.copyObj(this.oldChip)
        },
        onChipBlur(index) {
            if (!/^[\d]+$/.test(this.editChip[index] || '')) {
                this.toastText('请输入正确的正整数', 'middle')
                this.$set(this.editChip, index, this.oldChip[index])
            } else if (parseInt(this.editChip[index]) === 0) {
                this.toastText('预设金额不能为0', 'middle')
                this.$set(this.editChip, index, this.oldChip[index])
            } else if (!this.editChip[index] || !parseInt(this.editChip[index])) {
                this.$set(this.editChip, index, this.oldChip[index])
            } else if (parseInt(this.editChip[index]) && parseInt(this.editChip[index]) > this.maxChip) {
                this.$set(this.editChip, index, this.maxChip)
                this.toastText('最大预设值为' + this.maxChip, 'middle')
            }
        },
        onChipFocus(index) {
            this.$set(this.editChip, index, '')
        },
        clear() {
            this.money = ''
            this.orderList = []
            this.showOrderList = false
            this.chipEditing = false
            this.show = false
            this.$store.state.key.show = false
            this.$store.state.key.target = null
            this.submitting = false
            var arr = document.getElementsByClassName("chip-btn-item");
            for(var i=0;i<arr.length;i++){
                arr[i].classList.remove("active");
                arr[i].classList.remove("theme-border-yellow");
            }
            this.$emit('clearPlayway')
        },
    }
}
</script>

<style lang="less" scoped>
/deep/.weui-toast{
    position: fixed;
    z-index: 5001;
    width: 2rem;
    min-height: 2.3rem;
    top: 3.6rem;
    left: 50%;
    margin-left: -3.8em;
    background: rgba(17, 17, 17, 0.7);
    text-align: center;
    border-radius: 5px;
    color: #FFFFFF;
  }
  /deep/.weui-mask{
    background: rgba(0, 0, 0, 0.1);
  }
.h5-icon-guanbi::after {
    content: '';
    width: 0 !important;
}

.lottery-bet-input-box {
    width: 100%;
    background-color: rgba(0, 0, 0, 0);

    .lottery-bet-input-div {
        width: 100%;
    }

    .lottery-bet-input-flex {
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
    }

    .lottery-bet-input {
        width: 100%;
        position: relative;
        transition: all 300ms ease;
        border-top: 0.02rem solid;
        border-top: none;

        .chip-row {
            border-top: 0.02rem #efefef solid;
            background-color: #fff;
            padding: 0 0.22rem;
            width: 100%;
            height: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;
            font-weight: normal;

            .btn-item {
                display: block;
                height: 0.6rem;
                width: 1.2rem;
                box-sizing: border-box;
                outline: 0;
                -webkit-appearance: none;
                border-radius: 0.1rem;
                background-color: #fff;
                margin-right: 0.2rem;
                font-size: 0.32rem;
                border: 0.02rem solid;

                &.active {
                    color: #fff !important;
                    border: none;
                }

                &.btn-edit {
                    background-color: #F6F6F6;
                    width: 1.45rem;
                    border: none;
                    margin-right: 0;
                    font-size: 0.28rem;

                    &.active {
                        color: #fff;
                    }
                }

                &.btn-input,
                &.btn-input:focus {
                    padding: 0.1rem;
                    outline: 0;
                    -webkit-appearance: none;
                    text-align: center;
                }
            }
        }

        .input-row {
            width: 100%;
            height: 1rem;
            background-color: #f6f6f6;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;
            font-size: 0.349rem;
            padding: 0 0.24rem;
            font-weight: normal;

            .btn-clear {
                flex-shrink: 0;
                color: #555555;
                display: flex;
                align-items: center;

                .font {
                    font-size: 0.32rem;
                    margin-right: 0.08rem;
                }
            }

            .input {
                width: 3rem;
                min-width: 0;
                height: 0.7rem;
                font-size: 0.32rem;
                line-height: 0.32rem;
                padding: 0.2rem;
                border-radius: 0.04rem;
                box-shadow: 0 0 0.04rem #d1d1d1;
                box-sizing: border-box;
                color: #323232;
                background: #ffffff;
                margin-right: 0.3rem;
                margin-left: 0.3rem;
                display: -webkit-box;
                display: -webkit-flex;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -webkit-align-items: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-box-pack: center;
                -webkit-justify-content: center;
                -ms-flex-pack: center;
                justify-content: center;
            }

            .btn-submit {
                flex-shrink: 0;
                color: #FFFFFF;
                line-height: 0.7rem;
                padding: 0 0.38rem;
                border-radius: 0.1rem;
            }
        }
    }
}

.show .editor-box {
    transform: translate(-50%, -50%) scale(1) !important;
}

.editor-box {
    width: 6.58rem;
    box-sizing: border-box;
    padding: 0 0.2rem;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    border-radius: 0;
    transition: all 400ms;
    z-index: 451;

    .editor-header {
        position: relative;
        font-size: 0.4rem;
        text-align: center;
        color: #666666;
        height: 0.88rem;
        line-height: 0.88rem;
        box-sizing: border-box;
        display: block;

        // border-bottom: 0.02rem solid #e9e9e9;
        &::after {
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

    .editor-body {
        padding: 0.24rem 0;

        .editor-item {
            width: 100%;
            display: block;
            margin-top: 0.36rem;

            &:first-child {
                margin-top: 0;
            }
        }

        .input {
            width: 4.8rem;
            height: 0.7rem;
            line-height: 0.7rem;
            box-sizing: border-box;
            border-radius: 0.35rem;
            border: 1px solid #ebedf0;
            margin: 0 auto;
            display: block;
            text-align: center;
            color: #323232;
            font-size: 0.3rem;
        }
    }

    .editor-footer {
        box-sizing: border-box;
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: relative;

        // border-top: 0.02rem solid #e9e9e9;
        &::after {
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            right: 0rem;
            // bottom: 0;
            top: 0;
            left: 0rem;
            border-top: 0.02rem solid #ebedf0;
            -webkit-transform: scaleY(.5);
            transform: scaleY(.5);
        }

        padding: 0.24rem 0;

        .btn {
            width: 2.3rem;
            height: 0.7rem;
            line-height: 0.7rem;
            display: block;
            box-sizing: border-box;
            border-radius: 0.35rem;
            font-size: 0.3rem;

            &.btn-no {
                border: 0.02rem solid;
            }

            &.btn-ok {
                color: #FFF;
            }
        }
    }
}

.lottery-order-box {
    background-color: #ffffff !important;

    .lottery-order-animation-box {
        transition: all 300ms ease;
        transform: translate3d(0, 0, 0);
    }

    .active-box {
        padding: 0.2rem 0.3rem;
        width: 100%;
        height: 1.4rem;
        display: flex;
        justify-content: space-between;
        align-items: stretch;

        .btn-action {
            //display: flex;
            outline: 0;
            border: none;
            color: #000;
            border-radius: 0.1rem;
            width: 3.3rem;
            font-weight: normal;
            justify-content: center;
            align-items: center;
            font-size: 0.349rem;
            text-align: center;

            &.btn-action-cancel {
                background-color: #f8f8f8;
            }

            &.btn-action-commit {
                color: #FFFFFF;
            }
        }
    }

    .header-box {
        height: 0.8rem;
        width: 100%;
        //border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
        border-bottom: 0.015rem solid #ebedf0;
        display: flex;
        align-items: center;
        justify-content: center;

        .lottery-order-title {
            font-size: 0.349rem;
            color: #000;
        }
    }

    .lottery-order-list-box {
        max-height: 4.8rem;
        width: 100%;
        font-size: 0.28rem;
        text-align: left;

        .lottery-order-list {
            width: 100%;
            padding: 0 0.2rem 0 0.2rem;
        }

        .lottery-order-item {
            font-weight: normal;
            // margin-top:0.2rem;
            color: #000;
            height: 0.8rem;
            width: 100%;
            border-bottom: 0.5px solid #efefef;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;

            .lottery-order-item-code {
                flex: 1;
                text-align: left;
            }

            .lottery-order-item-odds {
                flex-shrink: 0;
                min-width: 2rem;
                margin-right: 0.2rem;
                color: rgb(51, 51, 51);
                text-align: left;
                padding-left: 0.4rem;
            }

            .input {
                flex-shrink: 0;
                padding: 0.1rem;
                border: 0.02rem solid #dbdbdb;
                border-radius: 0.06rem;
                width: 1.36rem;
                line-height: 0.6rem;
                height: 0.6rem !important;
                margin-left: 0.1rem;
                display: flex;
                justify-content: center;

                &.input-red {
                    color: red !important;
                    border-color: red !important;
                }

                &.input-yellow {
                    border-color: #f4c829 !important;
                }
            }

            .lottery-order-item-delete {
                flex-shrink: 0;
                margin-left: 0.1rem;
                font-size: 0.36rem;
                height: 0.54rem;
                line-height: 0.54rem;
                margin-top: 0.03rem;
            }
        }

        .lottery-order-list-1 {
            .lottery-item {
                .lottery-order-item {
                    justify-content: flex-end;
                }

                .lottery-order-item-code {
                    flex: auto;
                    color: rgb(51, 51, 51);
                    border-bottom: 0.02rem solid rgb(230, 230, 230);
                    height: 0.56rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    padding-bottom: 0.15rem;

                    .lianma_list::after {
                        content: ',';
                        position: relative;
                    }

                    .lianma_list:last-child::after {
                        content: '';
                        position: relative;
                    }
                }

                .lottery-order-item-ball {
                    margin-top: .25rem;
                    height: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    color: #000000;
                    font-weight: 500;
                    font-size: 0.28rem;
                }
            }

            .oder-item {
                list-style: none;
                border-bottom: 0.02rem solid hsl(0, 0%, 95%);
                display: -webkit-box;
                display: -webkit-flex;
                display: -ms-flexbox;
                display: flex;
                padding: 0;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                font-size: 0.32rem;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                height: 0.8rem;
                line-height: 0.8rem;

                .name {
                    -webkit-box-flex: 1;
                    -webkit-flex: 1;
                    -ms-flex: 1;
                    flex: 1;
                    text-align: left;
                    font-weight: normal;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    margin-right: 0.2rem;
                    font-size: 0.28rem;
                    color: #000000;
                    min-width: 3rem;
                    max-width: 3rem;
                }

                .odds {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    font-size: 0.28rem;
                    min-width: unset;
                    font-weight: normal;
                    color: #000;
                }

                .number-input {
                    flex-shrink: 0;
                    padding: 0.1rem;
                    border: 0.02rem solid #dbdbdb;
                    border-radius: 0.06rem;
                    width: 1.34rem;
                    text-align: center;
                    height: 0.6rem !important;
                    color: #333333;
                    font-weight: normal;
                    line-height: 0.34rem;
                    border: 0.02rem solid #dbdbdb;
                    margin-left: 0.1rem;
                    display: inline-block;

                    &.input-red {
                        color: red !important;
                        border-color: red !important;
                    }

                    &.input-yellow {
                        border-color: #f4c829 !important;
                    }
                }

                .num {
                    // -webkit-box-flex: 1;
                    // -webkit-flex: 1;
                    // -ms-flex: 1;
                    // flex: 1;
                    text-align: left;
                    padding: 0 0.01rem;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    font-size: 0.28rem;
                    min-width: 2.1rem;
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-pack: justify;
                    -ms-flex-pack: justify;
                    justify-content: space-between;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    -ms-flex-wrap: nowrap;
                    flex-wrap: nowrap;
                }
            }
        }

        .lotter-lhc-box {
            .number-input {
                width: 1.36rem;
                height: 0.68rem !important;
                line-height: 0.68rem;
                padding: 0 0.06rem;
                border: 1px solid #dbdbdb;
                border-radius: 0.06rem;
                margin: 0 0.1rem;
                font-size: 0.28rem;
                text-indent: 0.1rem;
                font-family: PingFang-SC-Medium;
                font-weight: 500;
                color: #333333;
                text-align: center;
                display: -webkit-inline-box;
                display: -webkit-inline-flex;
                display: -ms-inline-flexbox;
                display: inline-flex;
                -webkit-box-align: center;
                -webkit-align-items: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-box-pack: center;
                -webkit-justify-content: center;
                -ms-flex-pack: center;
                justify-content: center;
                overflow: hidden;
            }
        }
    }

    .lottery-order-all {
        height: 0.68rem;
        font-size: 0.3rem;
        font-weight: normal;
        line-height: 0.58rem;
        color: #000;
        // margin-top: 0.2rem;
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        padding: 0.1rem 0.3rem 0 0.3rem;

        .number-font {
            margin: 0 0.04rem;
        }

        .red {
            color: #ff0000;
        }

        .yellow {
            color: #f4c829;
        }
    }
}
</style>
