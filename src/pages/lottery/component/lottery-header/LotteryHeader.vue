<template>
  <div class="lottery-header theme-bg theme-main-bg theme-header-bottom">
    <button class="back-btn" @click="backHome">
      <img src="../../../../assets/img/lottery/back.png" alt="">
      返回
    </button>
    <button v-if="isAppIn || $route.query.cocos" :class="{'lottery-ico':isCss}" class="lottery-name" @click="showMenu=!showMenu">{{$route.query.name}}
      <img src="../../../../assets/img/lottery/close-menu.png" v-if="showMenu">
      <img src="../../../../assets/img/lottery/show-menu.png" v-else>
    </button>
    <button v-else class="lottery-name">{{$route.query.name}}</button>
    <span class="user-balance" v-if="$store.state.user.userInfo"><i class="rmb">¥</i> <i>{{$store.state.user.userInfo.balance}}</i></span>
    <button class="btn-menu" v-if="isAppIn" @click.capture.stop="onMemoShow()">
      <svg t="1564207216511" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1976" width="200" height="200">
        <path
          d="M896 307.2h-768a25.6 25.6 0 0 1 0-51.2h768a25.6 25.6 0 0 1 0 51.2zM896 563.2h-768a25.6 25.6 0 0 1 0-51.2h768a25.6 25.6 0 0 1 0 51.2zM896 819.2h-768a25.6 25.6 0 0 1 0-51.2h768a25.6 25.6 0 0 1 0 51.2z"
          fill="#ffffff" p-id="1977">
        </path>
      </svg>
      <span class="red-dot" v-show="redDot && id==='3630' && !this.personalMode =='no'"></span>
    </button>
    <new-menu v-model="showMenu"></new-menu>
    <lottery-nav-new v-model="showNav" :id="id" v-if="$config.home==='amhg'"></lottery-nav-new>
    <lottery-nav v-model="showNav" :id="id" v-else></lottery-nav>
    <van-popup v-model="showPopup" get-container="body"></van-popup>
  </div>
</template>

<script type="text/javascript">
import NewMenu from '../lottery-menu/newMenu'
import LotteryNav from '../lottery-nav/LotteryNav'
import LotteryNavNew from '../lottery-nav-new/LotteryNavNew'

export default {
  name: 'LotteryHeader',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  components: {
    LotteryNav,
    LotteryNavNew,
    NewMenu
  },
  data () {
    return {
      showMenu: false,
      showNav: false,
      showPopup: false,
      menuList: [],
      showtype: '',
    }
  },
  mounted () {
    setTimeout(() => {
      this.showPopup = !!(window.chromeVersion && window.chromeVersion < 51)
      setTimeout(() => {
        this.showPopup = false
      }, 500)
    }, 500)
  },
  computed: {
    redDot () {
      return !(new Date().getMonth() + 1 > 9)
    },
    isAppIn(){
      return !window.localStorage.isApp || this.$config.name === 'dalao';
    },
    isCss(){
      // var debug = {
      //       osVersion: this.$mobileDevice.osVersion,
      //       isSafari: this.$mobileDevice.isSafari
      //     }
      //     this.$store.state.debugInfo = debug;
      if(this.$mobileDevice.isSafari 
        && this.$mobileDevice.osVersion === '10.0.1'){
        return true;
      }
      return false;
    }
  },
  methods:{
    onMemoShow(){
      this.$store.dispatch('lottery/getLotteryNoCount').then().catch()
      setTimeout(()=>{
        this.showNav=true;
      },100);
    },
    goBack(){
      let type = localStorage.getItem('lotteryHallType')
      this.$router.push({
          path: '/home/type/10000',
          query: {
            type:type
          }
        })
    },
    backHome() {
      // if(this.$route.query.cocos) {
      //   if (/android/i.test(navigator.userAgent)){
      //     window.app.gohome()
      //   } else if (/ipad|iphone|iPod|iOS|mac/i.test(navigator.userAgent)){
      //     window.webkit.messageHandlers.gohome.postMessage(null);
      //   }
      // }else {
      //   this.$router.push('/home/type/10000?name=彩票游戏&id=10000')
      // }
      this.$router.push('/home/type/10000?name=彩票游戏&id=10000')
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .lottery-header {
    height: 0.9rem;
    width: 100vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    color: #fff;
    .lottery-ico{
      i{
        margin-top: 0.08rem;
      }
    }

    .back-btn {
      margin-left: 0.22rem;
      font-size: 0.36rem;
      font-family: PingFang SC;
      font-weight: bold;
      display: flex;
      align-items: center;
      img {
        width: 0.48rem;
        height: 0.48rem;
        margin-right: 0.08rem;
      }
    }
    
    .lottery-name {
      position: absolute;
      outline: 0;
      font-size: 0.349rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      margin-left: 50%;
      transform: translateX(-50%);
      height: 100%;
      white-space: nowrap;
      background: unset;
      text-align: center;
      img {
        width: 0.34rem;
        height: 0.34rem;
        margin-left: 0.08rem;
      }
    }

    /deep/ .van-icon-arrow:before {
      color: #ffffff !important;
    }

    .user-balance {
      flex: 1;
      text-align: right;
      font-size: 0.349rem;
      padding-right: 0.24rem;
    }

    .btn-menu {
      outline: 0;
      background-color: rgba(0, 0, 0, 0);
      transform: scale(1.5);
      font-weight: bold;
      font-size: 0.349rem;
      box-sizing: border-box;
      margin-right: 0.24rem;
      position: relative;

      .red-dot {
        position: absolute;
        width: .1rem;
        height: .1rem;
        background: red;
        border-radius: 50%;
        top: .06rem;
        right: 0;
      }

      .icon {
        width: 0.4rem;
        height: 0.47rem;
        display: block;
      }
    }
  }
</style>
