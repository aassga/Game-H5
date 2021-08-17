<template>
  <div class="header number-font">
    <div class="header-box" :class="{'blush-header-box':$config.blush}">
      <button class="back-btn" v-if="isAppIn || $route.query.cocos" @click="backHome">
        <img src="../../../../assets/img/lottery/back.png" alt="">
        返回
      </button>
      <!-- <span v-if="isAppIn" class="back-icon fa fa-fw fa-angle-left" @click="$router.push('/home')"></span> -->

      <div class="way-selector" @click.stop="onWaySelectorClick">
        <span class="label">玩法</span>
        <span class="btn">
          <i>{{playWay[value]&&playWay[value]['small']}}</i>
          <i class="theme-color-yellow-2" :class="{'icon iconfont h5-icon-qushi-moreup':true,active:showWay}"></i>
        </span>
      </div>

      <span v-if="isAppIn" class="menu-btn" @click.stop="onMenuSelectorClick">
        <i class="text">{{$route.query.name}}</i>
        <i :class="{'icon iconfont h5-icon-qushi-moreup':true,active:showMenu}"></i>
      </span>
      <span v-else class="menu-btn">
        <i class="text">{{$route.query.name}}</i>
      </span>
    </div>

    <ul class="theme-yellow-bg-4 theme-color-yellow-before" :class="{'right-menu':true,show:showMenu,'black-right-menu' : $config.blackTheme || $config.newQP,'blush-right-menu' : $config.blush}">
      <li
        class="menu-item theme-border-color-2"
        v-for="(item, i) in menu"
        :key="item.id+'-'+i"
        @click="onMenuClick(item)"
      >{{item.name}}</li>
    </ul>

    <transition :name="showWay?'slide-down':'slide-up'">
      <div class="way-box theme-main-bg-5" :style="{height: wayHeight + 'px'}" v-show="showWay">
        <ul class="way-list">
          <li
            :class="{'way-item':true,active:i===value}"
            v-for="(way, i) in playWay"
            :key="i"
            @click="onWayClick(i)"
          >
            <p class="name">{{way['small']}}</p>
            <p class="odds" :class="{small:getOdds(way).toString().length>8}">赔率{{getOdds(way)}}倍</p>
            <ul class="num-list no-margin" v-if="way['small'] === '点数'">
              <li class="ty-k3-num ty-k3-num-1"></li>
              <li class="ty-k3-add">＋</li>
              <li class="ty-k3-num ty-k3-num-2"></li>
              <li class="ty-k3-add">＋</li>
              <li class="ty-k3-num ty-k3-num-3"></li>
            </ul>
            <ul class="num-list" v-else-if="['三同','三同通选'].includes(way['small'])">
              <li class="ty-k3-num ty-k3-num-1"></li>
              <li class="ty-k3-num ty-k3-num-1"></li>
              <li class="ty-k3-num ty-k3-num-1"></li>
            </ul>
            <ul class="num-list" v-else-if="way['small'] === '三不同'">
              <li class="ty-k3-num ty-k3-num-1"></li>
              <li class="ty-k3-num ty-k3-num-3"></li>
              <li class="ty-k3-num ty-k3-num-5"></li>
            </ul>
            <ul class="num-list" v-else-if="way['small'] === '三连通选'">
              <li class="ty-k3-num ty-k3-num-1"></li>
              <li class="ty-k3-num ty-k3-num-2"></li>
              <li class="ty-k3-num ty-k3-num-3"></li>
            </ul>
            <ul class="num-list" v-else-if="['二同','二同单选','二同复选'].includes(way['small'])">
              <li class="ty-k3-num ty-k3-num-1"></li>
              <li class="ty-k3-num ty-k3-num-1"></li>
              <li class="ty-k3-num ty-k3-num-3"></li>
            </ul>
            <ul class="num-list" v-else-if="way['small'] === '二不同'">
              <li class="ty-k3-num ty-k3-num-1"></li>
              <li class="ty-k3-num ty-k3-num-4"></li>
              <li class="ty-k3-num ty-k3-num-4"></li>
            </ul>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Header",
  props: {
    playWay: {
      type: Array,
      required: true
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showWay: false,
      menu: [],
      wayHeight: 0,
      showMenu: false
    };
  },
  computed: {
    isAppIn(){
      return !window.localStorage.isApp;
    }
  },
  created() {
    this.getMenu();
  },
  mounted() {
    this.wayHeight =
      document.documentElement.offsetHeight - this.$el.offsetHeight - this.$parent.$parent.$refs.lotterFoot.$refs['input-box'].offsetHeight;
    window.addEventListener(
      "click",
      evt => {
        this.showMenu = false;
        this.showWay = false;
      },
      false
    );
  },
  methods: {
    backHome() {
      // if(this.$route.query.cocos) {
      //   if (/android/i.test(navigator.userAgent)){
      //     window.app.gohome()
      //   } else if (/ipad|iphone|iPod|iOS|mac/i.test(navigator.userAgent)){
      //     window.webkit.messageHandlers.gohome.postMessage(null);
      //   }
      // }else {
      //   this.$router.push('/home')
      // }
      this.$router.push('/home/type/10000?name=彩票游戏&id=10000')
    },
    getOdds(way) {
      if (way["small"] === "点数") {
        let max = 0;
        let min = 999;
        way["code"].forEach(item => {
          const val = parseFloat(item.odds);
          if (val > max) {
            max = val;
          }
          if (val < min) {
            min = val;
          }
        });
        return min + "~" + max;
      } else {
        return way["code"] && way["code"].length ? way["code"][0]["odds"] : "";
      }
    },
    onWaySelectorClick() {
      this.showWay = !this.showWay;
      this.showMenu = false;
      this.$emit("show-way");
    },
    onMenuSelectorClick() {
      this.showMenu = !this.showMenu;
      this.showWay = false;
      this.$emit("show-menu");
    },
    onWayClick(index) {
      this.$emit("input", index);
    },
    onMenuClick(item) {
      if (item && item.id) {
        this.showMenu = false
        setTimeout(()=>{
          this.onGameClick(item);
        },0)
      }
    },
    getMenu() {
      this.$store.dispatch("main/getNewGame", {
        idIndex:4,
        id: "10011",
        callback: res => {
          if (res && res["10011"]) {
            this.menu = res["10011"];
            if (this.menu.length % 2) {
              this.menu.push({});
            }
          }
        }
      });
    },
    goBack(){
      let type = localStorage.getItem('lotteryHallType')
      this.$router.push({
          path: '/home/type/10000',
          query: {
            type:type
          }
        })
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
@color: #fff;
@bg-color: #000;
@height: 1rem;
.back-btn {
  position: absolute;
  left: 0.22rem;
  font-size: 0.36rem;
  font-family: PingFang SC;
  font-weight: bold;
  display: flex;
  align-items: center;
  color: #fff;
  img {
    width: 0.48rem;
    height: 0.48rem;
    margin-right: 0.08rem;
  }
}
.header {
  height: @height;
  width: 100%;
  position: relative;

  .header-box {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 498;
    background-color: @bg-color;
    height: 100%;
    width: 100%;
    &.blush-header-box {
      background: linear-gradient(276deg, #9D010F 0%, #72010B 100%);
    }
  }

  .back-icon {
    position: absolute;
    left: 0;
    top: 0;
    height: @height;
    width: @height;
    line-height: @height;
    display: inline-block;
    font-size: 0.64rem;
    color: @color;
  }

  .menu-btn {
    position: absolute;
    right: 0;
    height: @height;
    padding: 0 0.2rem;
    display: flex;
    line-height: @height;
    font-size: 0.349rem;
    color: @color;

    .icon {
      display: inline-block;
      margin-left: 0.04rem;
      margin-top: -0.2rem;
      transform: scale(0.6) rotateZ(180deg);
      transform-origin: 50% 45%;
      transition: all 500ms;
      position: relative;
      top: 0.1rem;

      &.active {
        transform: scale(0.6) rotateZ(0deg);
      }
    }
  }

  .way-selector {
    margin: 0 auto;
    height: @height;
    color: @color;

    &:after {
      content: "";
      display: table;
      clear: both;
    }

    .label {
      display: inline-block;
      width: 0.26rem;
      font-size: 0.26rem;
      line-height: 0.3rem;
      height: @height;
      overflow: hidden;
      padding: 0.2rem 0;
      box-sizing: border-box;
      float: left;
    }

    .btn {
      height: 0.7rem;
      box-sizing: border-box;
      font-size: 0.349rem;
      border-radius: 0.06rem;
      border: 1px solid hsla(0, 0%, 100%, 0.5);
      float: left;
      width: auto;
      margin-top: 0.15rem;
      line-height: 0.7rem;
      margin-left: 0.1rem;
      padding: 0 0.12rem;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        display: inline-block;
        margin-left: 0.04rem;
        transform: scale(0.6) translateY(-10%) rotateZ(180deg);
        transform-origin: 50% 55%;
        transition: all 500ms;
        color: #f0c930;

        &.active {
          transform: scale(0.6) translateY(-10%);
        }
      }
    }
  }

  .right-menu {
    position: absolute;
    right: 0;
    top: 100%;
    transition: 500ms;
    transform: scale(0, 0);
    background-color: #fff;
    transform-origin: top right;
    width: 4rem;
    z-index: 499;

    &:after {
      content: "";
      display: table;
      clear: both;
    }

    &:before {
      content: "";
      display: block;
      width: 0;
      height: 0;
      box-sizing: content-box;
      border-width: 0.16rem;
      border-style: solid;
      border-color: #000 #fff #fff #000;
      position: absolute;
      right: 0;
      bottom: 100%;
    }

    &.show {
      transform: scale(1, 1);
    }

    .menu-item {
      display: block;
      width: 50%;
      box-sizing: border-box;
      height: 1rem;
      line-height: 1rem;
      border-top: 0.01rem solid #d8d8d8;
      border-right: 0.01rem solid #d8d8d8;
      float: left;
      font-size: 0.26rem;
      color: #2c3e50;

      &:nth-child(2n) {
        border-right: none;
      }

      &:nth-child(1),
      &:nth-child(2) {
        border-top: none;
      }
    }
    &.black-right-menu::before {
      border-color: #000 #FBD67A #FBD67A #000;;
    }
    &.blush-right-menu::before {
      border-color: transparent #FBD67A #FBD67A transparent;
    }
  }

  .way-box {
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    left: 0;
    top: 100%;
    z-index: 400;
    background-color: #317455;

    .way-list {
      width: 100%;
      height: 100%;
      padding: 0.2rem 0.3rem;

      &:after {
        content: "";
        display: table;
        clear: both;
      }

      .way-item {
        float: left;
        margin: 0.1rem;
        width: 2.1rem;
        height: 2rem;
        box-sizing: border-box;
        border: 1px solid rgba(255, 255, 255, 0.3);

        &.active {
          border-color: #ffaf36;
        }

        .name {
          color: #fff;
          font-size: 0.32rem;
          line-height: 0.64rem;
          font-weight: bold;
        }

        .odds {
          font-size: 0.26rem !important;
          line-height: 0.3rem;
          font-weight: bold;
          padding: 0 !important;
          color: #caebda;
          overflow: hidden;
          text-align: center;
          word-wrap: break-word;
          word-break: break-all;
          overflow: hidden; /*这个参数根据需要来绝对要不要*/
          &.small {
            -webkit-text-size-adjust: none;
            font-size: 0.19rem;
          }
        }
      }
    }
  }

  .num-list {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    height: 0.8rem;
    color: #caebda;

    .ty-k3-add {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.3rem;
      font-weight: bold;
      transform: translateY(-0.03rem);
    }

    &.no-margin {
      .ty-k3-num {
        margin: 0 !important;
      }
    }
  }

  .ty-k3-num {
    width: 0.48rem;
    height: 0.48rem;
    background-size: 200% 600%;
    margin: 0.04rem;
    background-image: url("../../../../assets/img/lottery/k3/dice-k3.png");

    &.ty-k3-num-1 {
      background-position: 0 0;
    }

    &.ty-k3-num-2 {
      background-position: 0 -1 * 0.48rem;
    }

    &.ty-k3-num-3 {
      background-position: 0 -2 * 0.48rem;
    }

    &.ty-k3-num-4 {
      background-position: 0 -3 * 0.48rem;
    }

    &.ty-k3-num-5 {
      background-position: 0 -4 * 0.48rem;
    }

    &.ty-k3-num-6 {
      background-position: 0 -5 * 0.48rem;
    }

    &.ty-k3-num-opening-0 {
      background-position: -0.48rem 0;
    }

    &.ty-k3-num-opening-1 {
      background-position: -0.48rem -1 * 0.48rem;
    }

    &.ty-k3-num-opening-2 {
      background-position: -0.48rem -2 * 0.48rem;
    }

    &.ty-k3-num-opening-3 {
      background-position: -0.48rem -3 * 0.48rem;
    }
  }
}
</style>
