<template>
<transition name="bounce">
    <template v-if="isRedShow">
        <!-- 砸金蛋 redLopeType = 2 -->
        <div v-if="$store.state.main.redLopeType == 2" class="red-box egg" v-NoTouchMove> 
            <div class="box-wrap">
                <div class="preloadImg"></div>
                <div class="red-close" @click="openEgg" v-if="!isMoney" :class="isOpen ? 'open_red':''">
                </div>
                <div v-show='isMoney'>
                    <div class="red-open">
                        <!-- <div class="red-close-btn" @click.stop="close"></div> -->
                        <p class="get-money" :style="[$store.state.main.redLopeMoney.toString().length>6?{fontSize:'0.8rem'}:'']">{{$store.state.main.redLopeMoney}}元</p>
                        <div class="getMoney" @click="getMoney"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 大紅包 redLopeType = 1 || 0 || default -->
        <div v-else class="red-box hongbao" v-NoTouchMove>
            <div class="red-close"  v-if="!isMoney" :class="isOpen ? 'open_red':''">
                <div class="red-close-btn" @click="close"></div>
                <button @click="openHongbao"></button>
            </div>
            <div class="red-open" v-show='isMoney'>
                <div class="red-open-jb" ref="openJb">
                    <span class="jb1"></span>
                    <span class="jb2"></span>
                    <span class="jb3"></span>
                </div>
                <div class="red-open-zb" ref="openZb">
                    <span class="zb1"></span>
                    <span class="zb2"></span>
                    <span class="zb3"></span>
                    <span class="zb4"></span>
                    <span class="zb5"></span>
                </div>
                <p class="get-money">{{ $store.state.main.redLopeMoney }}</p>
                <div class="red-close-btn" @click="close"></div>
                <button @click="getMoney"></button>
            </div>
        </div>
    </template>
</transition>
</template>

<script>
export default {
    name: 'RedLope',
    props:{
        isRedShow :{
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isOpen: false,
            isMoney: false
        }
    },
    watch:{

    },
    created(){

    },
    methods: {
        close() {
            this.$store.commit('main/getisRedLop',false)
            this.$store.commit('main/isShowMask', {
                page: '',
                status: false
            })
            setTimeout(() => {
                this.isOpen = false
                this.isMoney = false
            }, 2000);
        },
        openHongbao(){
            if(this.$refs['openJb']){
                this.$refs['openJb'].style.visibility = 'visible'
                this.$refs['openZb'].style.visibility = 'visible'
            }
            this.$nextTick(()=>{
               this.isOpen = true
               setTimeout(() => {
                  this.isMoney = true 
               }, 1000);
               setTimeout(() => {
                   this.$refs['openJb'].style.visibility = 'hidden'
               }, 2500);
               setTimeout(() => {
                   this.$refs['openZb'].style.visibility = 'hidden'
               }, 3500);
            })
        },
        openEgg(){
            this.$nextTick(()=>{
                this.isOpen = true
                setTimeout(() => {
                    this.isMoney = true 
                }, 2800);
            })
        },
        getMoney(){
            this.$store.dispatch('main/getQipaiShouyeHongbaoLingqu', this.$store.state.main.redLopeId).then(res=>{
                if(res.code === 200) {
                    this.close()
                    setTimeout(() => {
                        this.getRedLope()
                    }, 1000);
                }
            })
        }
    },
    beforeDestroy() {
        this.close()
    }
    
}
</script>

<style lang="less">
.bounce-enter-active {
    animation: bounce-in 0s;
}
.bounce-leave-to{
    animation: bounce-in 1s reverse !important;
}
.bounce-leave-active {
    animation: bounce-in 1s reverse;
}
.bounce-leave-active.filter{
    background-color: transparent !important;
}

// egg
@keyframes openRedEgg1Hammer {
    0% {
        visibility: visible;
        
    }
    0%, 50% {
        transform: rotate(0);
        right: 11px;
    } 
    25%, 75% , 100%{
        transform-origin: bottom right;
        transform: rotate(-10deg);
        right: 63px;
    }
    100%{
        visibility: hidden;
    }
} 
 
@keyframes openRedEgg1Bg {
    0% {
        background-image: url('../../assets/img/kaijiang/egg/close.png');
    }
    100%{
        background-image: none;
    }
} 
 
@keyframes openRedEgg2Bg {
    0% { 
        background-image: url('../../assets/img/kaijiang/egg/close.png');
    } 
    18%{
        background-image: url('../../assets/img/kaijiang/egg/5.png');
    }
    36%{
        background-image: url('../../assets/img/kaijiang/egg/6.png');
    }
    54%{
        background-image: url('../../assets/img/kaijiang/egg/7.png');
    }
    72%{
        background-image: url('../../assets/img/kaijiang/egg/8.png');
    }
    90%, 100%{
        background-image: url('../../assets/img/kaijiang/egg/9.png');
    }
}

 
@keyframes openRedEgg3Bg {
    0% { 
        background-image: url('../../assets/img/kaijiang/egg/10.png');
    } 
    6%, 48% {
        background-image: url('../../assets/img/kaijiang/egg/11.png');
    }
    12%, 54% {
        background-image: url('../../assets/img/kaijiang/egg/12.png');
    }
    18%, 60% {
        background-image: url('../../assets/img/kaijiang/egg/13.png');
    }
    24%, 66% {
        background-image: url('../../assets/img/kaijiang/egg/14.png');
    }
    30%, 72% {
        background-image: url('../../assets/img/kaijiang/egg/15.png');
    }
    36%, 78% {
        background-image: url('../../assets/img/kaijiang/egg/16.png');
    }
    42%, 84% {
        background-image: url('../../assets/img/kaijiang/egg/17.png');
    }
    90%, 100%{
        background-image: url('../../assets/img/kaijiang/egg/24.png');
    }
}


// hongbao
@keyframes scaleDraw {
    from{
        transform :scale(0)
    }

    to{
        transform: scale(1)
    }
}

@keyframes openRed {
    20%{
         transform :translate(-50%, -50%) scale(1.4,0.4)
    }
    40%{
        transform: translate(-50%, -50%) scale(1,1.2);
        transform-origin: bottom;
    }
    // 60%{
    //     transform: translate(-50%, -50%) scale(1,1);
    //     transform-origin: bottom;
    // }
    70%{
        transform: translate(-50%, -50%) scale(1,0.9);
        transform-origin: bottom;
    }
    100%{
        transform: translate(-50%, -50%) scale(1,1);
    } 
}
@keyframes roatejb{
    10%{
        transform:translateY(4px) rotateX(72deg)
    }
    20%{
        transform:translateY(8px) rotateX(144deg)
    }
    30%{
        transform:translateY(12px) rotateX(216deg)
    }
    40%{
        transform:translateY(16PX) rotateX(288deg)
    }
    50%{
        transform:translateY(20PX) rotateX(360deg);
    }
    60%{
        transform:translateY(24px) rotateX(432deg)
    }
    70%{
        transform:translateY(28px) rotateX(504deg)
    }
    80%{
        transform:translateY(32px) rotateX(576deg)
    }
    90%{
        transform:translateY(36PX) rotateX(648deg);
        opacity: 0.5;
    }
    100%{
        transform:translateY(40PX) rotateX(720deg);
        opacity: 0;
    }
}
@keyframes rotezb1{
    0%{
        transform:translateY(0) rotateY(0deg)
    }
    10%{
        transform:translateY(20px) rotateY(-80deg)
    }
    20%{
        transform:translateY(40px) rotateY(-10deg)
    }
    30%{
        transform:translateY(60PX) rotateY(70deg)
    }
    40%{
        transform:translateY(80PX) rotateY(-8deg);
    }
    50%{
        transform:translateY(100PX) rotateY(-70deg);
    }
    60%{
        transform:translateY(120PX) rotateY(3deg);
    }
    70%{
        transform:translateY(140PX) rotateY(60deg);
    }
    80%{
        transform:translateY(160PX) rotateY(-6deg);
    }
    90%{
        transform:translateY(180PX) rotateY(-50deg);
        opacity: 0.5;
    }
    100%{
        transform:translateY(200PX) rotateY(0deg);
        opacity: 0;
    }
}
</style>
<style lang="less" scoped>
.red-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 503;
    animation: scaleDraw 1s ease-in-out 1;
    .open_red{
        animation: openRed 1s cubic-bezier(0.72, 0.58, 0.93, 0.72) 1;
    }

    &.hongbao {
        .red-close{
            width: 4.95rem;
            height: 5.84rem;
            background-image: url(../../assets/img/kaijiang/red_close.png);
            background-size: 100%;
            background-repeat: no-repeat;
            top: 50%;
            left: 50%;
            position: relative;
            transform: translate(-50%, -50%);
            .red-close-btn {
                width: 0.7rem;
                height: 0.72rem;
                position: absolute;
                right: -0.3rem;
                top: -0.3rem;
                background-image: url(../../assets/img/kaijiang/red_close_btn.png);
                background-size: 100%;
                background-repeat: no-repeat;
            }
            >button{
                height: 2rem;
                width: 2rem; 
                position: absolute;
                left: 1.5rem;
                bottom: 1.2rem;
            }
        }
        .red-open{
            width: 7.5rem;
            height: 8.26rem;
            background-image: url(../../assets/img/kaijiang/red-open-box.png);
            background-size: 100%;
            background-repeat: no-repeat;
            top: 50%;
            left: 50%;
            position: relative;
            transform: translate(-50%, -50%);
            .red-open-jb{
                height: 1.6rem;
                width: 4.2rem;
                margin: auto;
                display: flex;
                justify-content: space-around;
                overflow: hidden;
                >span{
                    width: 0.6rem;
                    height: 0.6rem;
                    display: inline-block;
                    background-image: url(../../assets/img/kaijiang/red_jb.png);
                    background-size: 100%;
                    background-repeat: no-repeat;
                    animation: roatejb 1.5s linear 1;
                }
            }
            .red-open-zb{
                height: 4rem;
                width: 5.2rem;
                margin: auto;
                >span{
                    &:nth-child(1){
                        display: inline-block;
                        width: 0.56rem;
                        height: 0.45rem;
                        background-image: url(../../assets/img/kaijiang/jb1.png);
                        background-size: 100%;
                        background-repeat: no-repeat;
                        position: relative;
                        left: -1.2rem;
                        top: -.3rem;  
                        animation: rotezb1 3s linear 1;
                    }
                    &:nth-child(2){
                        display: inline-block;
                        width: 0.56rem;
                        height: 0.47rem;
                        background-image: url(../../assets/img/kaijiang/jb2.png);
                        background-size: 100%;
                        background-repeat: no-repeat;
                        position: relative;
                        left: -0.8rem;
                        top: -.3rem;
                        animation: rotezb1 2.8s linear 1;
                    }
                    &:nth-child(3){
                        display: inline-block;
                        width: 0.47rem;
                        height: 0.38rem;
                        background-image: url(../../assets/img/kaijiang/jb3.png);
                        background-size: 100%;
                        background-repeat: no-repeat;
                        position: relative;
                        right: -1rem;
                        top: -.3rem;
                        animation: rotezb1 3.2s linear 1;
                    }
                    &:nth-child(4){
                        display: inline-block;
                        width: 0.46rem;
                        height: 0.39rem;
                        background-image: url(../../assets/img/kaijiang/jb4.png);
                        background-size: 100%;
                        background-repeat: no-repeat;
                        position: relative;
                        right: -1rem;
                        top: 0.1rem;
                        animation: rotezb1 2.6s linear 1;
                    }
                    &:nth-child(5){
                        display: inline-block;
                        width: 0.29rem;
                        height: 0.26rem;
                        background-image: url(../../assets/img/kaijiang/jb5.png);
                        background-size: 100%;
                        background-repeat: no-repeat;
                        position: relative;
                        right: -1rem;
                        top: -.3rem;
                        animation: rotezb1 3s linear 1;
                    }
                }
            }
            .get-money{
                position: absolute;
                width: 80%;
                height: 1rem;
                font-size: 0.9rem;
                line-height: 0.9rem;
                color: #E32A03;
                font-weight: 400;
                left: 50%;
                transform: translate(-50%, 0);
                top: 2.8rem;
            }
            .red-close-btn {
                width: 0.7rem;
                height: 0.72rem;
                position: absolute;
                right: 1.1rem;
                top: 0.8rem;
                background-image: url(../../assets/img/kaijiang/red_close_btn.png);
                background-size: 100%;
                background-repeat: no-repeat;
            }
            >button{
                height: 2rem;
                width: 2rem; 
                position: absolute;
                left: 2.8rem;
                bottom: 2.5rem;
            }
        }
    }
    &.egg {
        .box-wrap {
            width: 100vw;
            height: 100vh;
            position: absolute;
        }

        .preloadImg {
            visibility: hidden;
            background: url('../../assets/img/kaijiang/egg/close.png'),
                        url('../../assets/img/kaijiang/egg/5.png'),
                        url('../../assets/img/kaijiang/egg/6.png'),
                        url('../../assets/img/kaijiang/egg/7.png'),
                        url('../../assets/img/kaijiang/egg/8.png'),
                        url('../../assets/img/kaijiang/egg/9.png'),
                        url('../../assets/img/kaijiang/egg/10.png'),
                        url('../../assets/img/kaijiang/egg/11.png'),
                        url('../../assets/img/kaijiang/egg/12.png'),
                        url('../../assets/img/kaijiang/egg/13.png'),
                        url('../../assets/img/kaijiang/egg/14.png'),
                        url('../../assets/img/kaijiang/egg/15.png'),
                        url('../../assets/img/kaijiang/egg/16.png'),
                        url('../../assets/img/kaijiang/egg/17.png'),
                        url('../../assets/img/kaijiang/egg/24.png');
        }
        .red-close{
            width: 100%;
            height: 100%;
            background-image: url('../../assets/img/kaijiang/egg/close.png');
            background-repeat: no-repeat;
            background-position: center;
            background-size: 105%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            position: absolute;
            display: flex;
            
            &:before {
                transition: opacity 1s;
                content: "";
                width: calc(300px);
                height: calc(250px);
                background: url('../../assets/img/kaijiang/egg/hammer.png') no-repeat right top / 32%;
                margin: auto;
            }
            &.open_red { 
                animation: openRedEgg1Bg 0.1s 1 step-end;
                animation-delay: 0.8s;
                animation: openRedEgg2Bg 2s 1 step-end;
                animation-delay: 0.5s; 
                animation-fill-mode: forwards;
                &:before { 
                    visibility: hidden;
                    animation: openRedEgg1Hammer 0.8s 1 cubic-bezier(0.72, 0.58, 0.93, 0.72); 
                    animation-fill-mode: forwards; 
                }
            }
        }
        .red-open{
            width: 100%;
            height: 100%;
            top: 50%;
            left: 50%;
            position: absolute;
            transform: translate(-50%, -50%);
            animation: openRedEgg3Bg 3s 1 step-end;
            animation-fill-mode: forwards;
            background-image: url('../../assets/img/kaijiang/egg/24.png');
            background-repeat: no-repeat;
            background-position: center;
            background-size: 150%;
            .get-money{
                position: absolute;
                line-height:100px;
                font-size: 1em;
                line-height: 1rem;
                color: #E32A03;
                top: 50%;
                left: 50%;
                text-align: center;
                transform: translate(-50%, -50%);
                font-weight: bold;
                text-shadow: #fff 0px 2px 2px;
                letter-spacing: 0.05em;
            }
            .getMoney{
                width: 220px;
                height: 40px;
                position: absolute;
                top: 54.5%;
                left: 50%;
                transform: translate(-50%, calc(-50% + 75px));
                cursor: pointer;
            }
            // .red-close-btn{
            //     width: 0.7rem;
            //     height: 0.72rem;
            //     position: absolute;
            //     left: 50%;
            //     top: 50%;
            //     transform: translate(calc(-50% + 130px), calc(-50% - 140px));
            //     background-image: url(../../assets/img/kaijiang/red_close_btn.png);
            //     background-size: 100%;
            //     background-repeat: no-repeat;
            //     cursor: pointer;
            //     z-index: 505;
            // }
        }
    }
}

</style>