<template>
  <div class="verify_all">
    <div v-if="!showVerify" :class="['verify_before',{'qp-verify_before' : $config.newQP || $config.blackTheme},{'qp-verify_blush':$config.blush}]">
      <div class="verify_loading" :class="verifyClass"></div>
      <p>安全检测中</p>
    </div>
    <div v-show="showVerify" class="margin_31">
      <div class="slide-verify" id="slideVerify" onselectstart="return false;">
        <div class="verify_title">拖动下方滑块完成拼图</div>
        <!-- <canvas :width="w" :height="h" ref="canvas" style="position: relative; width: 6.2rem; height: 3.1rem;"></canvas> -->
        <img
          :src="img1"
          :width="w"
          :height="h"
          style="position: relative; width: 6.2rem; height: 3.1rem;"
          class="slide-verify-img"
        />
        <div v-if="loading" class="loading_verify"></div>
        <img
          :src="img2"
          :width="block_w"
          :height="h"
          ref="block"
          style="width: 1.04rem;height: 3.1rem;"
          class="slide-verify-block"
        />
        <div
          class="slide-verify-slider container-active"
          :class="{'container-active': containerActive, 'container-success': containerSuccess, 'container-fail': containerFail}"
        >
          <div class="slide-verify-slider-mask" :style="{width: sliderMaskWidth}">
            <!-- slider @mousedown="sliderDown" -->
            <div
              @touchstart="touchStartEvent"
              @touchmove="touchMoveEvent"
              @touchend="touchEndEvent"
              class="slide-verify-slider-mask-item"
              :style="{left: sliderLeft}"
            >
            </div>
          </div>
          <span class="slide-verify-slider-text"></span>
        </div>
        <div class="verify_toobar">
          <span @click="closeVerify"></span>
          <span @click="refresh"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "SlideVerify",
  props: {
    userName: {
      type: String,
      default: ''
    },
    block_w: {
      type: Number,
      default: 57
    },
    // canvas width
    w: {
      type: Number,
      default: 310
    },
    // canvas height
    h: {
      type: Number,
      default: 155
    },
    sliderText: {
      type: String,
      default: "向右拖动滑块填充拼图"
    }
  },
  data() {
    return {
      containerActive: false, // container active class
      containerSuccess: false, // container success class
      containerFail: false, // container fail class
      originX: undefined,
      originY: undefined,
      isMouseDown: false,
      trail: [],
      sliderLeft: 0, // block right offset
      sliderMaskWidth: 0, // mask width
      showVerify: false,
      setLeftX: 0,
      img1: "",
      img2: "",
      slideVerifySlider: 310,
      blockWith: 82,
      blockImgW: 57,
      slideVerifyImg: 310,
      bodyWith: 375,
      loading: false,
    };
  },
  computed: {
    verifyClass() {
      if (this.$config.newQP || this.$config.blackTheme) {
        return 'verify_loadingQP'
      }else if(this.$config.home === 'xpj') {
        return 'verify_loadingA'
      }else if(this.$config.blush){
        return 'verify_loadingBlush'
      }else {
        return 'verify_loadingB'
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initImg();
    },
    initImg() {
      this.$store.dispatch("user/getVerifyImage", this.userName).then(res => {
          if(res.code === 200){
              this.img1 = res.data.img1;
              this.img2 = res.data.img2;
              this.showVerify = true;
          }else{
              this.closeVerify()
              this.$toast(res.message)
          }
      });
    },
    refresh() {
      this.reset();
      this.$emit("refresh");
    },
    touchStartEvent(e) {
      e.preventDefault();
      var theEvent = window.event || e;
      if (theEvent.touches) {
        theEvent = theEvent.touches[0];
      }
      this.originX = theEvent.clientX;
      this.originY = theEvent.clientY;
      this.isMouseDown = true;
      this.$nextTick(()=>{
        this.slideVerifyImg = document.getElementsByClassName('slide-verify-img')[0].offsetWidth
        this.blockImgW = document.getElementsByClassName('slide-verify-block')[0].offsetWidth

        this.slideVerifySlider = document.getElementsByClassName('slide-verify-slider')[0].offsetWidth
        this.blockWith =  document.getElementsByClassName('slide-verify-slider-mask-item')[0].offsetWidth
      })
    },
    touchMoveEvent(e) {
      e.preventDefault();
      if (!this.isMouseDown || this.loading) return false;
      var theEvent = window.event || e;
      if (theEvent.touches) {
        theEvent = theEvent.touches[0];
      }
      const moveX = theEvent.clientX - this.originX;

      const moveY = theEvent.clientY - this.originY;
      if (moveX < 0 || moveX >= this.slideVerifySlider - this.blockWith) return false;
      this.sliderLeft = moveX + "px";
      this.setLeftX = ((this.slideVerifyImg - this.blockImgW ) / (this.slideVerifySlider - this.blockWith)) * moveX;
      this.$refs.block.style.left = this.setLeftX + "px";

      this.containerActive = true;
      this.sliderMaskWidth = moveX + (this.blockWith/2) + "px";
      this.trail.push(moveY);
    },
    touchEndEvent(e) {
      e.preventDefault();
      if (!this.isMouseDown || this.loading) return false;
      this.isMouseDown = false;
      if (e.changedTouches[0].pageX === this.originX) return false;
      this.containerActive = false;
      let name = this.userName;
      const baseX = document.body.offsetWidth / 375
      if (this.setLeftX) {
        this.$store
          .dispatch("user/checkVerify", {
            tnCode: Math.round(this.setLeftX * 2 / baseX),
            userName: name
          })
          .then(res => {
            if (res.code === 200) {
              this.containerSuccess = true;
              this.$emit("success");
              this.closeVerify()
              return;
            } else {
              this.containerFail = true;
              this.$emit("fail");
              setTimeout(() => {
                this.reset();
              }, 1000);
            }
          });
      }
    },
    reset() {
      this.containerActive = false;
      this.containerSuccess = false;
      this.containerFail = false;
      this.sliderLeft = 0;
      this.$refs.block.style.left = 0;
      this.sliderMaskWidth = 0;
      this.img1 = require('../../assets/img/verify/loading_bg.png')
      this.img2 = ''
      this.$refs.block.style.display = 'none'
      this.loading = true
      // generate img
      this.$store.dispatch("user/getVerifyImage",  this.userName).then(res => {
          if(res.code === 200){
              this.img1 = res.data.img1;
              this.img2 = res.data.img2;
              this.$refs.block.style.display = 'block'
              this.loading = false
          }
      });
      this.$emit("fulfilled");
    },
    closeVerify() {
      this.$emit("closeVerify");
    }
  },
  destroyed(){
    //   this.reset()
    //   this.closeVerify()
  }
};
</script>
<style lang="less" type='text/less' scoped >
.verify_all {
  user-select: none;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
  .verify_before {
    width: 3rem;
    height: 3.2rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    border-radius: 0.1rem;
    .verify_loading {
      width: 2.23rem;
      height: 2.23rem;
      margin: 0.26rem auto 0.2rem auto;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      // animation: verifyBefore 1s linear 0.2s infinite alternate;
    }
    .verify_loadingA{
      background-image: url('../../assets/img/verify/saomiao.gif');
    }
    .verify_loadingB{
      background-image: url('../../assets/img/verify/saomiao-b.gif');
    }
    .verify_loadingQP {
      background-image: url('../../assets/img/verify/saomiao-newqp.gif');
    }
    .verify_loadingBlush {
      background-image: url('../../assets/img/verify/saomiao-blush.gif');
    }
    > p {
      font-size: 0.26rem;
      color: #070707;
      text-align: center;
    }
    &.qp-verify_before {
      background: #000;
      > p {
        color: #F6CF32 !important;
      }
    }
    &.qp-verify_blush {
    background: #9c010f;
    > p {
      color: #f5dc9d !important;
    }
  }
  }
  .margin_31 {
    width: 6.84rem;
    height: 6.1rem;
    background-color: #ffffff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 0.1rem;
    .verify_close {
      position: absolute;
      right: 0.12rem;
      top: 0.1rem;
      font-size: 0.5rem;
      z-index: 10;
      background-image: url('../../assets/img/verify/close.png');
      width: 0.58rem;
      height: 0.58rem;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .verify_title {
      height: 1rem;
      font-size: 0.4rem;
      text-align: left;
      line-height: 1rem;
      color: #333333;
      font-weight: 500;
    }
    .loading_verify{
        background-image: url('../../assets/img/verify/loading.gif');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 0.74rem;
        height: 0.74rem;
        position: absolute;
        left: 50%;
        top: 42%;
        transform: translate(-50%, -50%);
    }
    .verify_toobar{
      height: 0.7rem;
      line-height: 0.7rem;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      >span{
        width: 0.46rem;
        height: 0.46rem;
        position: relative;
        top: -0.08rem;
        &:first-child{
          background-image: url('../../assets/img/verify/close.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
          margin-left: 0.42rem;
        }
        &:last-child{
          background-image: url('../../assets/img/verify/again.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
      }
    }
  }
  img {
    user-select: none !important;
  }
}
.slide-verify {
  width: 6.2rem;
  margin: auto;
  position: relative;
}

.slide-verify-block {
  position: absolute;
  left: 0;
  top: 1rem;
}


.slide-verify-slider {
  position: relative;
  text-align: center;
  width: 310px;
  height: 1.06rem;
  line-height: 1.06rem;
  margin-top: 0.08rem;
  padding-top: 0.36rem
}

.slide-verify-slider-mask {
  position: absolute;
  left: 0;
  top: 0.35rem;
  height: 0.3rem;
  border-radius: 0.2rem;
}

.slide-verify-slider-mask-item {
  position: absolute;
  top: -0.35rem;
  left: 0;
  width: 1.64rem;
  height: 1.06rem;
  background-image: url('../../assets/img/verify/normal.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.container-active .slide-verify-slider-mask-item {
  background-image: url('../../assets/img/verify/normal.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.container-active .slide-verify-slider-mask {
  // background-image: url('../../assets/img/verify/active_full.png');
  background-color: #D1E4FF;
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
}

.container-success .slide-verify-slider-mask-item {
  background-image: url('../../assets/img/verify/success.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.container-success .slide-verify-slider-mask {
  background-image: url('../../assets/img/verify/success_full.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.container-fail .slide-verify-slider-mask-item {
  background-image: url('../../assets/img/verify/error.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.container-fail .slide-verify-slider-mask {
  background-image: url('../../assets/img/verify/error_full.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.slide-verify-slider-text {
  font-size: 0.28rem;
  display: inherit;
  height: 0.3rem;
  // margin-top: 0.5rem;
  box-sizing: border-box;
   background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url('../../assets/img/verify/normal_full.png');
}
.container-active .slide-verify-slider-text,
.container-success .slide-verify-slider-text,
.container-fail .slide-verify-slider-text {
  // display: none;
}
</style>
