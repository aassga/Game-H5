<template>
<div ref="noticeBarContainer" class="notice-bar theme-header-bg theme-color-white theme-after-border-color-1 theme-before-border-color">
    <div class="notice-bar-wrapper" :style="{
        'transition-property': 'transform',
        'transform': `translate(0px, ${diff}px)`,
        'transition-timing-function': `${effect}`,
        'transition-duration': `${duration / speed}s`}">
        <p v-for="(item, index) in noticeList" :key="'notice-bar-item-' + index" :style="{
          'transition-property': 'transform',
          'height': `${elHeight}px`,
          'line-height': `${elHeight}px`,
          'transform': `translate(${item.diff}px, 0px)`,
          'transition-timing-function': 'linear',
          'transition-duration': `${itemDuration / rollSpeed}s`
        }" class="notice-bar-item" :class="['notice-bar-item-' + index, { 'ellipsis': !isRoll}]">
            <!-- <span v-if="isHtml" v-html="item.text"></span> -->
            <span class="item-bar-span" :class=" item.uid == $store.state.user.userInfo.uid ? ($route.params.series == 10011 ? 'item-bar-open-k3' :'item-bar-open') : ''" v-html="item.text"></span>
        </p>
    </div>
</div>
</template>

<script>
export default {
    name: "SimpleNotice",
    props: {
        text: {
            default: "",
            type: [String, Array]
        },
        delay: {
            default: 2,
            type: Number
        },
        speed: {
            default: 1,
            type: Number
        },
        rollSpeed: {
            default: 1,
            type: Number
        },
        effect: {
            default: "ease-in-out",
            type: String
        },
        isRoll: {
            default: false,
            type: Boolean
        },
        isRollComplete: {
            default: true,
            type: Boolean
        },
        isHtml: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            noticeBar: null, // 当前容器
            curEl: null, // 当前 滚动的条目
            elHeight: 0, // 容器高度
            elWidth: 0, // 容器宽度
            diff: 0, // 偏移量
            curIndex: 0, // 当前滚动条目索引
            duration: 0.5, // 容器动画默认运动时间
            itemDuration: 3, // 容器条目动画默认运动时间
            timer: null, // 定时器标识
            noticeList: [], // 广播信息列表
            isItemMoveComplete: false // item 是否滚动完毕
        };
    },
    computed: {
        isRollItem() {
            return this.isItemMove() && !this.isItemMoveComplete && this.isRoll;
        }
    },
    mounted() {
        this.init();
    },
    watch: {
        text: {
            handler(val) {
                const list = typeof val === "string" ? [val] : val;
                this.noticeList = list.map(item=>{
                    item['diff'] = 0;
                    item['text'] = item.text
                    return item
                })
                this.run()
            },
            immediate: true
        }
    },
    methods: {
        init() {
            this.noticeBar = this.$refs["noticeBarContainer"];
            this.elHeight = this.noticeBar.offsetHeight;
            this.elWidth = this.noticeBar.offsetWidth;
            this._bindEvent();
            this.startMoving();
        },
        _bindEvent() {
            if (!this.noticeBar) return;
            this.noticeBar.addEventListener("transitionend", this.transitionHandler);
        },
        isItemMove() {
            if (!this.curEl || !this.noticeBar) return false;
            return this.curEl.children[0].offsetWidth > this.elWidth;
        },
        run() {
            this.curEl = document.querySelector(`.notice-bar-item-${this.curIndex}`);
            if (this.curIndex < this.noticeList.length) {
                this.isRollItem ? this.itemMove() : this.wrapMove();
            } else {
                // this.resetWrapMove();
                // this.diff = 0- ((this.curIndex -1) * this.elHeight)
                return false
            }
        },
        transitionHandler(e) {
            e.stopPropagation();
            this.isItemMoveComplete = false;
            this.run();
        },
        itemTransitionHandler(e) {
            e.stopPropagation();
            this.isItemMoveComplete = true;
            this.run();
        },
        wrapMove() {
            this.duration = 0.5;
            this.starTimer(
                () => {
                    this.curIndex++;
                    if(this.curIndex < this.noticeList.length){
                        this.diff -= this.elHeight;
                    }else{
                        this.diff = 0-((this.curIndex-1) * this.elHeight)
                        this.curIndex = this.noticeList.length
                    }
                    this.$emit('curIndex',this.curIndex)

                },
                this.isItemMoveComplete && this.isRollComplete ? 100 : this.delay * 1000
            );
        },
        resetWrapMove() {
            this.duration = 0;
            this.curIndex = 0;
            this.diff = 0;
            this.startMoving();
        },
        itemMove() {
            if (!this.curEl) return;
            this.curEl.removeEventListener(
                "transitionend",
                this.itemTransitionHandler
            );
            this.curEl.addEventListener("transitionend", this.itemTransitionHandler);
            this.isItemMoveComplete = false;
            this.itemDuration = 0;
            this.noticeList[this.curIndex].diff = 0;
            this.starTimer(() => {
                this.itemDuration = 3;
                const itemDiff = this.isRollComplete ?
                    this.curEl.children[0].offsetWidth :
                    this.curEl.children[0].offsetWidth - this.elWidth;
                this.noticeList[this.curIndex].diff = -itemDiff;
            }, this.delay * 1000);
        },
        startMoving() {
            this.starTimer(() => this.run(), 100);
        },
        starTimer(func, interval) {
            this.clearTimer();
            this.timer = setTimeout(func, interval);
        },
        clearTimer() {
            if (this.timer) clearTimeout(this.timer);
        }
    }
};
</script>

<style lang="less" scoped>
.notice-bar {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-size: 0.26rem !important;
    text-indent: 0.5rem;
    font-weight: 400 !important;
    z-index: 499;
    color: #261a1a;
    &-item {
        margin: 0;
        padding: 0;
        white-space: nowrap;

        &.ellipsis {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .item-bar-span{
        display: inline-flex;
        text-align: left;
        width: 100%;
        height: 100%;
        opacity: 1;
        text-indent: 0.2rem;
        align-items: center;
        .money{
            color: #FE1300;
        }
    }
    .item-bar-open{
        animation: clockwiseSpin 0.8s 0.5s 6;
    }
    .item-bar-open-k3{
        animation: clockwiseSpinK3 0.8s 0.5s 6;
    }
    
}
@keyframes clockwiseSpin {
    from{
        opacity: 0.2;
        color: #ff0000;
        font-weight: 400 !important;
        transform: scale(0.98)
    }
    to{
        opacity: 1;
        color: #ff0000 ;
        font-weight: 400 !important;
        transform: scale(1)
    }
}
@keyframes clockwiseSpinK3 {
    from{
        opacity: 0.2;
        color: #E9CB53;
        font-weight: 400 !important;
        transform: scale(0.98)
    }
    to{
        opacity: 1;
        color: #E9CB53 ;
        font-weight: 400 !important;
        transform: scale(1)
    }
}
</style>
