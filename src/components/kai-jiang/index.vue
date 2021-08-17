<template>
<transition name="bounce">
    <div class="red-box" v-show="kaijiang" v-NoTouchMove>
        <div class="red-top"></div>
        <!-- <div></div> -->
        <div class="red-cont">
            <div class="jinbi-cont" ref="jinbi">
                <!-- <i class="jinbi"></i>
                <img src="/static/kaijiang/hongbao.png" /> -->
            </div>
            <p class="text">恭喜您在【{{ kaijiangObj.lotteryName }}】击中奖池</p>
            <p class="money" ref="kaijiang">{{ kaijiangObj.amount }}<span>元</span></p>
            <p class="balance">已放入您的帐户余额</p>
            <div class="ikonw" @click="$emit('kjiang')"></div>
            <div id='leafContainer'  @click="$emit('kjiang')" ref="leaf">
            </div>
        </div>
    </div>
</transition>
</template>

<script>
export default {
    name: 'KaiJiang',
     props:{
        kaijiangObj:{
            type: Object,
            default: null
        },
        kaijiang:{
            type: Boolean,
            default: false
        }    
    },
    data() {
        return {
          NUMBER_OF_LEAVES: 30,
          width: window.screen.width,
          cretime: null,
          setTime: null
        }
    },
    watch:{
        'kaijiang':{
            handler(val){
                this.$nextTick(()=>{
                    if(this.setTime){
                        clearTimeout(this.setTime)
                    }
                    if(this.cretime){
                        clearInterval(this.cretime)
                    }
                    let kaij = this.$refs['kaijiang']
                    this.cretime = setInterval(() => {
                        kaij.innerText = Math.floor((Math.random()*1e7))+'元'                
                    }, 100);
                    this.setTime = setTimeout(() => {
                        if(this.cretime){
                            clearInterval(this.cretime)
                        }
                        kaij.innerText = this.kaijiangObj.amount + '元'
                    }, 3000);
                })
            }
        }
    },
    created(){
        this.init()
    },
    methods: {
        init() {
            this.$nextTick(()=>{
                var container = this.$refs['leaf']
                for (var i = 0; i < this.NUMBER_OF_LEAVES; i++) {
                    container.appendChild(this.createALeaf());
                }
                var jinbi = this.$refs['jinbi'];
                for (let index = 0; index < 10; index++) {
                    jinbi.appendChild(this.createdJinBi())
                    jinbi.appendChild(this.createdHongBao())
                    
                }
            })
        },
        randomInteger(low, high) {
            return low + Math.floor(Math.random() * (high - low));
        },
        randomFloat(low, high) {
            return low + Math.random() * (high - low);
        },
        pixelValue(value) {
            return value + 'px';
        },

        durationValue(value) {
            return value + 's';
        },
        createALeaf() {
            var leafDiv = document.createElement('div');
            var image = document.createElement('img');
            image.src = require('../../assets/img/kaijiang/money' + this.randomInteger(3, 7) + '.png');
            leafDiv.style.top = '-100px';
            leafDiv.style.position = 'absolute';
            leafDiv.style.width = '20px';
            leafDiv.style.height = '15px';
            leafDiv.style.animationIterationCount ='infinite, infinite';
            leafDiv.style.animationDirection = 'normal, normal';
            leafDiv.style.animationTimingFunction = 'linear, ease-in';
            leafDiv.style.left = this.pixelValue(this.randomInteger(0, this.width));
            leafDiv.style.animationName = 'fade, drop';
            image.style.width = '20px';
            image.style.height = '15px';
            var fadeAndDropDuration = this.durationValue(this.randomFloat(5, 10));
            var spinDuration = this.durationValue(this.randomFloat(3, 9));
            image.style.animationName = (Math.random() < 0.5) ? 'clockwiseSpin' : 'counterclockwiseSpinAndFlip';
            leafDiv.style.animationDuration = fadeAndDropDuration + ', ' +  fadeAndDropDuration;
            leafDiv.style.animationDelay = '1s ,1s';
            image.style.animationIterationCount ='infinite';
            image.style.animationDirection = 'alternate';
            image.style.animationTimingFunction = 'ease-in-out';
            image.style.animationIterationCount = 'infinite, infinite';
            image.style.transformOrigin = '50% -100%';
            image.style.animationDuration = spinDuration;
            leafDiv.appendChild(image);
            return leafDiv;
        },
        createdJinBi() {
            var iTag = document.createElement('i')
            iTag.style.width = '0.63rem'
            iTag.style.height = '0.54rem'
            iTag.style.position = 'absolute'
            iTag.style.display = 'inline-block'
            iTag.style.left = this.pixelValue(this.randomInteger(20, this.width - 150));
            iTag.style.top = '-2rem'
            iTag.style.backgroundImage = "url("+require('../../assets/img/kaijiang/jinbi.png')+")"
            iTag.style.backgroundSize ='100%'
            iTag.style.backgroundRepeat = 'no-repeat'
            iTag.style.backgroundPosition = 'center'
            iTag.style.animationIterationCount ='infinite, infinite';
            iTag.style.animationDirection = 'normal, normal';
            iTag.style.animationTimingFunction = 'linear, ease-in';
            iTag.style.animationName = 'fade, drop';
            var fadeAndDropDuration = this.durationValue(this.randomFloat(5, 10));
            iTag.style.animationDuration = fadeAndDropDuration + ', ' +  fadeAndDropDuration;
            iTag.style.animationDelay= '2s'
            return iTag
        },
        createdHongBao() {
            var imgTag = document.createElement('img')
            imgTag.src = require('../../assets/img/kaijiang/hongbao.png')
            imgTag.style.position = 'absolute'
            imgTag.style.left = this.pixelValue(this.randomInteger(20, this.width - 150));
            imgTag.style.top = '-2rem';
            imgTag.style.width = '0.47rem'
            imgTag.style.height = '0.51rem'
            imgTag.style.backgroundSize = '100%'
            imgTag.style.backgroundRepeat = 'no-repeat'
            imgTag.style.backgroundPosition = 'center'
            imgTag.style.animationIterationCount ='infinite, infinite';
            imgTag.style.animationDirection = 'normal, normal';
            imgTag.style.animationTimingFunction = 'linear, ease-in';
            imgTag.style.animationName = 'fade, drop';
            var fadeAndDropDuration = this.durationValue(this.randomFloat(5, 10));
            imgTag.style.animationDuration = fadeAndDropDuration + ', ' +  fadeAndDropDuration;
            imgTag.style.animationDelay= '2s'
            
            return imgTag
        }
    },
    beforeDestroy() {
        if(this.setTime){
            clearTimeout(this.setTime)
        }
        if(this.cretime){
            clearInterval(this.cretime)
        }
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
@keyframes hezi-on {
    from {
        transform: translate(0px, 0.58rem);
    }

    to{
        transform: translate(0, 0.18rem);
    }
}
@keyframes dous-b {
    from {
        transform:rotate(2deg)  translate(0, 0.18rem);
        transform-origin: center;
    }

    to{
        transform:rotate(-2deg) translate(0, 0.18rem);
        transform-origin: center;
    }
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes fade {
    0% {
        opacity: 1;
    }

    95% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

@keyframes drop {
    0% {
        transform: translate(0px, 0rem);
    }

    100% {
        transform: translate(0px, 300px);
    }
}

@keyframes clockwiseSpin {
    0% {
        transform: rotate(-50deg);
    }

    100% {
        transform: rotate(50deg);
    }
}

@keyframes counterclockwiseSpinAndFlip {
    0% {
        transform: scale(-1, 1) rotate(50deg);
    }

    100% {
        transform: scale(-1, 1) rotate(-50deg);
    }
}
@keyframes scaleDraw {
    from{
        transform :scale(0)
    }

    to{
        transform: scale(1)
    }
}
</style>
<style lang="less" scoped>
//  @import '../../../assets/less/animate.min.css';

.red-box {
    // width: 5.473rem;
    // height: 6.687rem;
    margin: 2.92rem auto;
    position: absolute;
    top: 0;
    z-index: 503;
    left: 16%;
    // transform: scale(0)
    animation: scaleDraw 1s ease-in-out 1;
    .red-top {
        height: 1.445rem;
        width: 4.793rem;
        background-image: url(../../assets/img/kaijiang/gaizi.png);
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        margin: auto;
        transform: translate(0px, 0.58rem);
        animation-name: hezi-on , dous-b;
        animation-duration: 0.2s ,0.2s;
        animation-delay: 1s , 1.5s;
        animation-iteration-count: 1 ,infinite;
        animation-fill-mode: forwards ,forwards;
        animation-direction: normal ,alternate;
        animation-timing-function: ease-in, linear;
    }

    .red-cont {
        position: relative;
        width: 5.473rem;
        height: 5.53rem;
        background-image: url(../../assets/img/kaijiang/hezi.png);
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        margin: 0.1rem auto;
        overflow: hidden;
        .text{
            margin-top: 1.1rem;
            text-align: center;
            font-size: 0.25rem;
            color: #E48428;
        }
        .money {
            color:#F7211E;
            text-align: center; 
            margin-top: 0.25rem;
            font-size: 0.62rem;
            >span{
                font-size: 0.33rem;
                margin-left: 0.02rem;
            }
        }
        .balance{
            font-size: 0.25rem;
            font-weight: normal;
            color: #F7211E;
            position: absolute;
            left: 50%;
            transform: translate(-50%,0);
            bottom: 2.15rem;
            z-index: 10;
        }
        .ikonw{
            width: 3.82rem;
            height: 0.8rem;
            // margin: 0.55rem auto 0 auto;
            background-image: url(../../assets/img/kaijiang/button.png);
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: center;
            position: absolute;
            left: 50%;
            transform: translate(-50%,0);
            bottom: 0.8rem;
        }
    }
}

#leafContainer , .jinbi-cont {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    top: 0;
    z-index: 0
}
.jinbi-cont{
  
}
</style>
<style lang="less" scoped>


</style>
