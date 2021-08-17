<template>
  <van-popup class="van-popup-menu" v-model="show" position="right" get-container="body" :lazy-render="false">
    <nav class="lottery-nav">
      <div class="lottery-nav-header theme-bg theme-gradient-bg-2" @click="onBetRecode">
        <img class="icon" src="../../../../assets/img/other/time-reload.png" alt />
        <div class="label">
          <p class="title">即时注单</p>
          <p class="count number-font">{{lotteryNoCount}}</p>
        </div>
      </div>
      <div class="lottery-nav-body theme-main-bg-5">
        <van-cell-group :border="false">
          <van-cell v-if="$route.params.series != '99996'" class="theme-main-bg-5 theme-after-border-color-1" is-link to="/user">
            <i slot="icon" class="icon iconfont h5-icon-betright-member theme-color theme-color-yellow-2"></i>
            <span slot="title" class="label" :class="[{'theme-color-gray-7':$config.blackTheme || $config.newQP},{'theme-color-white':$config.blush}]">个人中心</span>
          </van-cell>
          <van-cell v-if="$route.params.series != '99996'" class="theme-main-bg-5 theme-after-border-color-1"  is-link to="/save">
            <i slot="icon" class="icon iconfont h5-icon-betright-deposit theme-color theme-color-yellow-2"></i>
            <span slot="title" class="label" :class="[{'theme-color-gray-7':$config.blackTheme || $config.newQP},{'theme-color-white':$config.blush}]">在线充值</span>
          </van-cell>
          <van-cell v-if="$route.params.series != '99996'" class="theme-main-bg-5 theme-after-border-color-1" is-link to="/take">
            <i slot="icon" class="icon iconfont h5-icon-betright-drawing theme-color theme-color-yellow-2"></i>
            <span slot="title" class="label" :class="[{'theme-color-gray-7':$config.blackTheme || $config.newQP},{'theme-color-white':$config.blush}]">在线提款</span>
          </van-cell>
          <van-cell is-link @click="onBetRecode1" class="theme-main-bg-5 theme-after-border-color-1">
            <i slot="icon" class="icon iconfont h5-icon-betright-record theme-color theme-color-yellow-2"></i>
            <span slot="title" class="label" :class="[{'theme-color-gray-7':$config.blackTheme || $config.newQP},{'theme-color-white':$config.blush}]">投注记录</span>
          </van-cell>
          <van-cell v-if="$route.params.series != '99996'" class="theme-main-bg-5 theme-after-border-color-1" is-link :to="'/trend/'+$route.params.id">
            <i slot="icon" class="icon iconfont h5-icon-betright-list theme-color theme-color-yellow-2"></i>
            <span slot="title" class="label" :class="[{'theme-color-gray-7':$config.blackTheme || $config.newQP},{'theme-color-white':$config.blush}]">开奖走势</span>
          </van-cell>
          <van-cell is-link @click="onRules" class="theme-main-bg-5 theme-after-border-color-1">
            <i slot="icon" class="icon iconfont h5-icon-betright-rules theme-color theme-color-yellow-2">
               <span class="red-dot" v-show="redDot && id==='3630'&& !this.personalMode =='no'"></span>
            </i>
            <span slot="title" class="label" :class="[{'theme-color-gray-7':$config.blackTheme || $config.newQP},{'theme-color-white':$config.blush}]">
              游戏规则
            </span>
          </van-cell>
        </van-cell-group>
      </div>
    </nav>
    <van-popup v-model="showRules" :close-on-click-overlay="false" get-container="body" style="background-color: white!important;border-radius:0.32rem;width: 5.5rem;">
      <div class="theme-main-bg-5" :class="{'rules-content':true,k3}">
        <div class="rules-header theme-bg theme-yellow-bg-4">
          <p class="title theme-color-black">{{$route.query.name}}规则说明</p>
        </div>
        <div class="rules-body">
          <iframe class="rules-iframe" name="rules" :src="rulesSrc"></iframe>
        </div>
        <div class="rules-footer">
          <vux-button type="primary" action-type="button" class="theme-bg theme-yellow-bg-4 theme-color-black" @click.native="showRules=false">确定</vux-button>
        </div>
      </div>
    </van-popup>
  </van-popup>
</template>



<script type="text/javascript">
export default {
  name: "LotteryNav",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      betCount: 0,
      showRules: false
    };
  },
  computed: {
    positionStyle(){
      return {
          position:'absolute'
        }
    },
    redDot() {
      return !(new Date().getMonth() + 1 > 9);
    },
    lotteryNoCount() {
      return this.$store.state.lottery.lotteryNoCount
        ? this.$store.state.lottery.lotteryNoCount
        : "0";
    },
    k3(){
      return this.$route.params.id === '10010'
    },
    show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    rulesSrc() {
      return this.$store.state.main.config
        ? this.$store.state.main.config["statics"] +
            `${this.$config.blackTheme || this.$config.newQP || this.$config.blush?'blackrules':'rules'}/${this.$route.query.code}.html`
        : "";
    }
  },
  created() {
    // this.onRefreshCount();
  },
  methods: {
    iframeEvent(ev) {
      console.log(ev);
    },
    onRules() {
      if(this.$route.params.series == 99996){
        this.$router.push('/lottery/rules')
      }
      this.show = false;
      this.$nextTick(() => {
        this.showRules = true;
      });
    },
    // onRefreshCount() {
    //   this.$store.dispatch("lottery/getLotteryNoCount").then(res => {
    //     if (res.code === 200) this.betCount = res.data;
    //   });
    // },
    onBetRecode() {
      if (this.$store.state.user.userInfo && this.$store.state.user.token) {
        localStorage.setItem('local-url', encodeURIComponent(window.location.href))
        this.$router.push({ path:'/user/record', query:{
          entry: 1,
          winType: 3,
        }})
      } else {
        this.$router.push("/admin/login");
      }
    },
    onBetRecode1() {
       if (this.$store.state.user.userInfo && this.$store.state.user.token) {
        localStorage.setItem('local-url', encodeURIComponent(window.location.href))
        this.$router.push({ path:'/user/record', query:{
          entry: 2,
          winType: 0,
        }})
      } else {
        this.$router.push("/admin/login");
      }
    }
  }
};
</script>
<style lang="less" type='text/less'>
  /deep/.van-popup{
    background-color: white!important;
  }
  .rules-content {
    z-index: 5000;
    .rules-header {
      z-index: 5000;

    .title {
      text-align: center;
      line-height:0.88rem;
      height:0.88rem;
      font-size: 0.36rem;
      color: #ffffff;
    }
  }

  .rules-body {
    z-index: 5000;
    padding: 0;
    height: 7.5rem;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .rules-iframe {
      outline: 0;
      border: none;
      height: 100%;
      width:96%;
      padding: 0;
      margin: 0;
      width: 100%;
    }
  }

  .rules-footer {
    z-index: 5000;
    padding: 0 0.25rem 0.25rem 0.25rem;
  }

  &.k3 {
    .rules-header {
      z-index: 5000;
      // background-color: @nk3-theme-header-gb-color;

      // .title {
      //   text-align: center;
      //   line-height: @theme-header-height;
      //   height: @theme-header-height;
      //   font-size: 0.36rem;
      //   color: @nk3-font-color;
      // }
    }

    .weui-btn_primary {
      // background-color: @nk3-font-color-active;
    }
  }
}
</style>
<style lang="less" type='text/less' scoped>
  /deep/.weui-dialog{
    position: fixed;
  }
  /deep/.weui-mask{
    background: rgba(0, 0, 0, 0.1);
  }
  .rules-dialog {
    /deep/ .van-dialog__confirm {
      color: #ffffff;
      width: 92%;
      height: 0.9rem;
      margin: 0.24rem auto;
      display: block;
      border-radius: 0.2rem;
    }

    border-radius: 0.4rem;
    opacity: 0.96;
    border: 0;
    overflow: hidden;
    color: #ffffff;
    width: 85%;
    margin: 0.24rem auto;
    display: block;
    position: absolute;
    top: 44%;
    left: 50%;
  }
  .fadeInfo-enter-active,
  .fadeInfo-leave-active {
    transition: all 1s;
  }
  .fadeInfo-enter,
  .fadeInfo-leave-to {
    opacity: 0;
    lert:80%;
  }

.lottery-nav {
  width: 44vw;
  height: 100%;
  background-color: #fff;
  user-select: none;
  .lottery-nav-header {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2006;
    width: 100%;
    height: 1.4rem;
    color: #fff;
    padding: 0.3rem;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    flex-wrap: nowrap;
    text-align: left;

    .icon {
      display: block;
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.2rem;
      flex-shrink: 0;
    }

    .label {
      flex: 1;
      text-align: left;

      .title {
        font-size: 0.36rem;
        line-height: 0.36rem;
        font-weight: bold;
      }

      .count {
        font-size: 0.4rem;
        text-align: left;
        line-height: 0.4rem;
        margin-top: 0.1rem;
      }
    }
  }

  .lottery-nav-body {
    height: 100%;
    width: 100%;
    padding-top: 1.4rem;
    overflow-x: hidden;
    overflow-y: scroll;
    text-align: left;

    .icon {
      font-size: 0.44rem;
      margin-right: 0.2rem;
      position: relative;

       .red-dot {
        position: absolute;
        width: 0.1rem;
        height: 0.1rem;
        background: red;
        border-radius: 50%;
        right: -0.01rem;
        top: 0rem;
      }
    }

    .label {
      font-size: 0.3rem;
      font-weight: bold;
      color: #666;
      display: flex;
      font-family: -apple-system-font, "Helvetica Neue", sans-serif;

    }
  }

  /deep/ .van-cell {
    padding: 0.2rem 0.2rem 0.2rem 0.4rem;
  }

  /deep/ .van-cell__right-icon {
    color: #2c3e50;
  }

  /deep/ .van-cell::after {
    left: 1.02rem;
    border-bottom: 0.02rem solid #ebedf0;
    transform: scaleY(0.5)
  }
}

.lottery-rules {
  overflow: hidden;
  z-index: 5000;
  .lottery-rules-header {
    height: 0.9rem;
    line-height: 0.9rem;
    font-size: 0.36rem;
    display: block;
    color: #fff;
  }
  .lottery-rules-footer {
    font-size: 0.36rem;
    display: block;
    color: #fff;
    background-color: white;
    padding: 0.25rem;
    .lotter-btn {
      height: 0.88rem;
      line-height: 0.88rem;
      width: 100%;
      border-width: 0;
      outline: 0;
      -webkit-appearance: none;
      border-radius:0.1rem
  }
  }

  .rules-body {
    width:99.8%;
    overflow: hidden;
    background-color: white;
    padding: 0.25rem 0 0 0;
    height: 7.75rem;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 5000;
    -webkit-overflow-scrolling: touch;

    .rules-iframe {
      outline: 0;
      border: none;
      height: 100%;
      width: 100%;
      padding: 0;
      margin: 0;
    }
  }
}
</style>
