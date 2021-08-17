<template>
  <nav class="lottery-play-way-nav tab-box">
    <div class="lottery-play-way-nav-body theme-main-bg-5 theme-after-border-color-1">
      <!-- <scroll-box class="list-tab" direction="horizontal" ref="scroll">
        <div class="list-box">
          <a class="tab-item theme-bg-active" :class="{active:value===i}" href="javascript:void(0)"
             v-for="(play, i) in list" :key="i" @click="onClick(i)">{{play&&play['big']||play['small']}}</a>
        </div>
      </scroll-box> -->
      <vux-tab class="play-way-tab list-tab" :class="'lottery-'+$route.params.series" ref="play-tab" v-model="tagetCode" :line-width="0" >
        <vux-tab-item class="vux-tab-item theme-color-white" :class="{active:value===i}" @on-item-click="onClick(i)" v-for="(play,i) in list" :key="i" style="border-width: initial;border-style: none; border-image: initial;">
          <span class="item theme-bg-active" :class="{'active theme-yellow-bg-4 theme-color-black':value===i}">{{play&&play['big']||play['small']}}</span>
        </vux-tab-item>
      </vux-tab>
      <button class="btn-more theme-color theme-color-yellow-2" :class="{active:showMore}" @click="showMore=!showMore">
        <i class="icon iconfont h5-icon-qushi-moreup"></i>
      </button>
    </div>
    <div class="lottery-play-way-more">
      <div class="mask-box" v-show="showMore" @click="showMore=false"></div>
      <transition :name="showMore?'slide-down':'slide-up'">
        <ul class="lottery-play-way-more-list theme-main-bg-5" :class="{'theme-border-bottom':$config.newQP || $config.blackTheme || $config.blush}" v-show="showMore">
          <li class="lottery-play-way-more-item  theme-color-active theme-gradient-bg-2 theme-color-white theme-border-1px" :class="{'theme-border-1px active theme-border-yellow theme-color-yellow-2':value===i}"
              v-for="(play, i) in list" :key="i" @click="onClick(i)">{{play&&play['big']||play['small']}}
          </li>
        </ul>
      </transition>
    </div>
  </nav>
</template>

<script type="text/javascript">
export default {
  name: 'LotteryPlayWayNav',
  props: {
    value: {  
      type: Number
    },
    playList: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showMore: false,
      tagetCode:0
    }
  },
  computed: {
    list () {
      if (this.type === 'pcdd') return this.playList[0].items
      else return this.playList
    }
  },
  watch:{
    value(val){
      this.tagetCode = val
    }
  },
  methods: {
    onClick (i) {
      this.$emit('input', i)
      this.showMore = false;
    },
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .lottery-play-way-nav {
    width: 100vw;
    transition: all 0.5s;
    .lottery-play-way-nav-body {
      position: relative;
      width: 100%;
      display: flex;
      // border-bottom: 0.02rem solid hsl(0, 0%, 95%);
      &::after{
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0.2rem;
        bottom: 0;
        // top: 0;
        left: 0rem;
        border-bottom: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }
      justify-content: space-between;
      align-items: stretch;
      flex-wrap: nowrap;
      background-color: #fff;
      padding:0 0.2rem;
      height: 0.88rem;
      z-index: 490;
    }
    .lottery-10008{
      .tab-item{
        padding: 0 0.16rem!important;
      }
    }
    .lottery-10010{
      .tab-item{
        padding: 0 0.19rem!important;
      }
    }
    .lottery-10012{
      .tab-item{
        padding: 0 0.18rem!important;
      }
    }
    .lottery-10006{
      .tab-item{
        padding: 0 0.15rem!important;
      }
    }
    .lottery-10007{
      .vux-tab-item{
        .item{
          margin-right: 0.3rem !important;
          display: inline-block;
          padding: 0 0.2rem;
          margin-right: 0.04rem;
          height: 0.64rem;
          line-height: 0.64rem;
          font-size: 0.32rem;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          border-radius: 0.32rem;
        }
      }
    }
   
    .list-tab {
      flex: 1;
      white-space: nowrap;
      height: 100%;
      line-height: 0.88rem;
      .tab-item {
        font-size: 0.32rem;
        color: #666;
        font-weight: bold;
        display: inline-block;
        white-space: nowrap;
        line-height: 0.64rem;
        padding: 0 0.20rem;
        margin: 0.13rem 0.02rem;
        margin-right:0.12rem;
        border-radius: 0.32rem;

        &.active {
          color: #fff;
        }
      }

      .list-box {
        height: 100%;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
      }
    }

    .btn-more {
      .icon:before {
        display: inline-block;
        font-size: 0.2rem;
        line-height: 0.2rem;
        position: relative;
        top: -0.05rem;
        transition: all 0.5s;
        transform: rotateZ(180deg);
        transform-origin: center 60%;
      }

      &.active .icon:before {
        transform: rotateZ(0deg);
      }
    }

    .lottery-play-way-more {
      position: absolute;
      top: 100%;
      overflow: visible;
      width: 100%;
      box-sizing: border-box;

      .mask-box {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.36);
        width: 100%;
        height: 100vh;
      }

      .lottery-play-way-more-list {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        justify-content: start;
        background-color: #fff;
        position: relative;
        padding-bottom: 0.2rem;

        .lottery-play-way-more-item {
          width: 20%;
          font-size: 0.32rem;
          color: #999999;
          border: 0.02rem solid #d8d8d8;
          border-radius: 0.05rem;
          margin-left: 4%;
          margin-top: 2.5%;
          font-weight: normal;
          text-align: center;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          line-height: 0.66rem;
        }
      }
    }
  }
</style>
