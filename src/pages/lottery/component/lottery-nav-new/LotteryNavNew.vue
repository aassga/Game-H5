<template>
  <van-popup class="van-popup-menu" v-model="show" :closeable="true" close-icon="cross" position="right" get-container="body" :lazy-render="false">
    <nav class="lottery-nav">
      <div class="lottery-nav-header" @click="onBetRecode">
        <img class="icon" src="../../../../assets/img/lottery/amhg/lotterHall.png" alt />
      </div>
      <div class="lottery-nav-body">
        <div class="nav-top">
          <div class="label">
            <span class="title">即时注单</span>
            <span class="count number-font">{{lotteryNoCount}}</span>
          </div>
          <div class="label">
            <span class="title">当前余额</span>
            <span class="count number-font">￥{{userInfo?userInfo.balance:'0.00'}}</span>
          </div>
          <div class="label">
            <span class="title">今日输赢</span>
            <span class="count number-font" :style="{color:(Number(totalWin)<0?'#2EFF66':'#FFE652')}">￥{{totalWin}}</span>
          </div>
        </div>
        <div class="nav-content">
          <div v-if="$route.params.series != '99996'" @click="$router.push('/trend/'+$route.params.id)">
            <i slot="icon" class="icon iconfont h5-icon-kaijiangzoushi"></i>
            <span slot="title" class="label">开奖走势</span>
          </div>
          <div  @click="onBetRecode1">
            <i slot="icon" class="icon iconfont h5-icon-touzhujilu1"></i>
            <span slot="title" class="label">投注记录</span>
          </div>
          <div  @click="$router.push('/user')">
            <i slot="icon" class="icon iconfont h5-icon-gerenzhongxin"></i>
            <span slot="title" class="label">个人中心</span>
          </div>
          <div   @click="$router.push('/save')">
            <i slot="icon" class="icon iconfont h5-icon-zaixianchongzhi"></i>
            <span slot="title" class="label">在线充值</span>
          </div>
          <div  @click="$router.push('/take')">
            <i slot="icon" class="icon iconfont h5-icon-zaixiantikuan"></i>
            <span slot="title" class="label">在线提款</span>
          </div>
          <div  @click="onRules">
            <i slot="icon" class="icon iconfont h5-icon-youxiguize">
               <span class="red-dot" v-show="redDot && id==='3630'&& !this.personalMode =='no'"></span>
              <span class="red-dot" v-show="redDot && id==='13'&& this.personalMode =='no'"></span>
            </i>
            <span slot="title" class="label">游戏规则</span>
          </div>
        </div>
      </div>
    </nav>
    <van-popup v-model="showRules" :close-on-click-overlay="false" get-container="body" style="background-color: white!important;border-radius:0.32rem;width: 5.5rem;">
      <div :class="{'rules-content':true,k3}">
        <div class="rules-header theme-bg">
          <p class="title">{{$route.query.name}}规则说明</p>
        </div>
        <div class="rules-body">
          <iframe class="rules-iframe" name="rules" :src="rulesSrc"></iframe>
        </div>
        <div class="rules-footer">
          <vux-button type="primary" action-type="button" class="theme-bg" @click.native="showRules=false">确定</vux-button>
        </div>
      </div>
    </van-popup>
  </van-popup>
</template>



<script type="text/javascript">
export default {
  name: "LotteryNavNew",
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
      showRules: false,
      totalWin:''
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
            `rules/${this.$route.query.code}.html`
        : "";
    },
    
  },
  created() {
      this.$store.dispatch('user/getRecordSummary', {
          start: this.dayJs().format('YYYY-MM-DD'),
          end: this.dayJs().format('YYYY-MM-DD'),
          game: 'lottery',
          callback: res => {
            this.totalWin = res.data.amount.total_win;
          }
      })
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
    width:100%!important;
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
  .van-popup-menu{
    width:100%!important;
    background:#00B8FF!important;
  }
  /deep/.van-popup__close-icon{
    color:#fff;
  }
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
  width: 100%;
  height: 100%;
  user-select: none;
 .lottery-nav-header {
   text-align:left;
   height:1.1rem;
   padding:0.3rem 0 0 0.48rem;
   img{
     width: 1.93rem;
     height: 0.81rem;
   }
 }
 .lottery-nav-body {
   padding:0.5rem 0 0 0.48rem;
   text-align:left;
   .nav-top {
     .label {
       height: 0.4rem;
       margin-bottom:0.17rem;
       .title {
          font-size: 0.28rem;
          font-weight: 400;
          color: #FFFFFF;
          margin-right:0.4rem;
       }
       .count {
          font-size: 0.36rem;
          font-weight: 800;
          color: #FFE652;
       }
     }
   }
   .nav-content {
     margin-top:0.58rem;
     div{
       height: 0.45rem;
       margin-bottom:0.44rem;
       .iconfont {
         font-size:0.36rem;
         color:#fff;
         margin-right:0.44rem;
       }
       .label {
          font-size: 0.32rem;
          font-weight: 400;
          color: #FFFFFF;
       }
     }
   }
 }
}
</style>
