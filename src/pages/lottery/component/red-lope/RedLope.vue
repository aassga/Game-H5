<template>
  <transition name="bounce">
    <div class="red-box" v-if="show" @click="open()">
      <div class="bg">
        <img class="logo" src="@site/assets/img/home/logo.png" alt="">
        <img class="game_logo" :src="gameLogo" alt="">
        <p class="text">恭喜您获得{{lotteryName}}的随机红包</p>
      </div>
      <ul class="ani">
        <li v-for="(item,index) in lopeList" :key="index" :style="itemStyle(index)">
          <img :src="item" alt="">
        </li>
      </ul>
    </div>
    <div class="sucTake" v-if="isSuccess">
      <span class="header-back icon iconfont h5-icon-left-menu-ico" @click="isSuccess=false"></span>
      <img class="suc_game_logo" :src="gameLogo" alt="">
      <p class="suc_text">恭喜您获得{{lotteryName}}的随机红包</p>
      <p class="suc_text_two">恭喜发财，大吉大利</p>
      <p class="money"><span>{{amount}}</span>元</p>
      <p class="suc_text_two">已存入帐号余额</p>
      <p class="goPlay" @click="goLottery()">好运临头赶紧投注></p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'RedLope',
  data () {
    return {
      lopeList: [],
      isSuccess: false,
      gameLogo: require('../../../../assets/img/redLope/game_logo.png'),
      lotteryName: '五分时时彩',
      amount: '',
      showType: '',
      show: false,
      timeRed:null
    }
  },
  methods: {
    itemStyle (i) {
      return {
        animation: 'ani_li 2s ease-in ' + Math.floor(i / 3) * 360 + 'ms',
        left: +Math.ceil(Math.random() * 30) * 2.3 + 10 + '%'
      }
    },
    // 打开红包
    open () {
      this.$http.post('/preferential/HongyundangtouDeliveryGift').then(res => {
        if (res.data.code === 200) {
          this.show = false
          this.isSuccess = true
        } else {
          this.$dialog({
            title: '温馨提示',
            message: res['data']['message']
          })
          this.show = false
        }
      }).catch(e => console.log(e))
    },
    // 点击跳往投注
    goLottery () {
      this.isSuccess = false
      if (this.showType === 'designationGameName') {
        this.$router.push({ path: '/lottery/' + this.gameLogo })
      } else {
        return false
      }
    },
  },
  created () {
    const s1 = require('../../../../assets/img/redLope/s-1.png')
    const s2 = require('../../../../assets/img/redLope/s-2.png')
    const s3 = require('../../../../assets/img/redLope/s-3.png')
    let arr = [s1, s2, s3]
    for (let i = 0; i < 24; i++) {
      this.lopeList.push(arr[Math.floor(Math.random() * (2 + 1))])
    }
  },
  mounted () {
  },
  computed: {},
  beforeDestroy () {
    clearInterval(this.timeRed)
  }
}
</script>

<style lang="less">
  .bounce-enter-active {
    animation: bounce-in .3s;
  }

  .bounce-leave-active {
    animation: bounce-in .3s reverse;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes ani_li {
    from {
      transform: translateY(-10vh);
    }
    to {
      transform: translateY(100vh);
    }
  }
</style>

<style lang="less" scoped>
  .red-box {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 9997;
    left: 0;
    top: 0;

    .ani {
      width: 100%;
      height: 100%;
      position: fixed;
      z-index: 9999;
      left: 0;
      top: 0;
      overflow: hidden;

      li {
        width: 0.8rem;
        position: absolute;
        transform: translateY(-10vh);

        img {
          width: 100%;
        }
      }
    }

    .bg {
      width: 100%;
      left: 0;
      top: 0;
      height: 9.74rem;
      background: url('../../../../assets/img/redLope/bg.png') 0 0 no-repeat;
      background-size: 100% 100%;
      margin-top: 1.85rem;
      overflow: hidden;
      position: fixed;
      z-index: 9999;

      .logo {
        display: block;
        height: 0.36rem;
        margin: auto;
        margin-top: 1.56rem;
      }

      .game_logo {
        display: block;
        border-radius: 50%;
        width: 1.54rem;
        margin: auto;
        margin-top: .6rem;
      }

      .text {
        width: 100%;
        text-align: center;
        color: rgba(255, 255, 255, 1);
        font-size: 0.28rem;
        margin-top: 0.32rem;
      }
    }
  }

  .sucTake {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    background: #fff url("../../../../assets/img/redLope/suc_bg.png") 0 0 no-repeat;
    background-size: 100%;

    .header-back:before {
      position: absolute;
      left: 0;
      top: 0;
      display: inline-block;
      font-size: 0.72rem;
      transform: rotateZ(180deg) !important;
      color: #fff;
    }

    .header-back {
      position: absolute;
      left: 0;
      top: 0;
    }

    .suc_game_logo {
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 50%;
      overflow: hidden;
      display: block;
      margin: auto;
      margin-top: 2.25rem;
    }

    .suc_text {
      font-size: 0.34rem;
      color: rgba(255, 247, 162, 1);
      text-align: center;
      margin-top: 0.49rem;
      font-weight: 500;
    }

    .suc_text_two {
      font-size: 0.26rem;
      color: #ffffff;
      text-align: center;
      margin-top: 0.18rem;
    }

    .money {
      height: 0.77rem;
      line-height: 0.77rem;
      font-size: 0.26rem;
      text-align: center;
      color: rgba(255, 247, 162, 1);
      margin-top: 0.92rem;

      span {
        font-size: 0.77rem;
        color: rgba(255, 247, 162, 1);
        font-weight: 500;
        margin-right: 0.1rem;
      }
    }

    .goPlay {
      text-align: center;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      font-size: 0.34rem;
      margin-top: 2.29rem;
    }
  }
</style>
