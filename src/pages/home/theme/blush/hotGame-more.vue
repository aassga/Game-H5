<template>
  <view-page class="container" full-box :noScroll="true">
    <title-header title="热门游戏" slot="header"  class="theme-header-bg theme-header-bottom"></title-header>
    <div slot="content" class="content">
      <div class="left-nav" ref="leftNav">
        <div class="nav-item" v-for="(item,i) in navList" :key="i" v-show="item['games'].length" :class="{'active':i === curIndex}" @click="curIndex = i">{{item.name}}</div>
      </div>
      <div class="right-game" ref="rightGame">
        <scroll-area class="right-scroll-box" ref="rightScroll">
          <img :src="imgUrl(game.icon)" class="game-item" v-for="(game,k) in navList[curIndex]['games']" :key="k" @click="onGameClick(game)">
        </scroll-area>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import scrollArea from "@src/components/scroll-area";
export default {
  name: 'hotGame-more',
  components:{
    scrollArea
  },
  data () {
    return {
      list: [],
      navList: [
        {
          name:'全部热门',
          games:[],
        },
        {
          name:'热门捕鱼',
          games:[],
        },
        {
          name:'热门彩票',
          games:[],
        },
        {
          name:'热门体育',
          games:[],
        },
        {
          name:'热门视讯',
          games:[],
        },
        {
          name:'热门棋牌',
          games:[],
        },
        {
          name:'热门电子',
          games:[],
        }
      ],
      curIndex:0,
    }
  },
  created () {
    this.list = JSON.parse(localStorage['qpHomeGameList'])[20002]['games']
    this.navList[0]['games'] = this.list
    this.list.forEach((item) => {
      switch (item.platform) {
        case 'fish':
          this.navList[1]['games'].push(item)
          break;
        case 'lottery':
          this.navList[2]['games'].push(item)
          break;
        case 'sport':
          this.navList[3]['games'].push(item)
          break;
        case 'live':
          this.navList[4]['games'].push(item)
          break;
        case 'chess':
          this.navList[5]['games'].push(item)
          break;
        case 'slot':
          this.navList[6]['games'].push(item)
        break;
      }
    })
  },
  mounted () {
    setTimeout(() => {
      this.$refs.rightGame.style.height = window.innerHeight - 1.08 * this.rem + 'px'
      this.$refs.leftNav.style.height = window.innerHeight - 1.15 * this.rem + 'px'
    }, 300);
  },
  methods: {
    imgUrl (url) {
      return this.publicStaticHost + '/images/'+ url
    },
  },
  computed:{
    
  }
}
</script>

<style lang="less" scoped>
.container {
  background-color: #530107;
  .content {
    padding-top: 0.2rem;
    display: flex;
    .left-nav {
      width: 1.67rem;
      height: 10rem;
      background: linear-gradient(180deg, #8C010E 0%, #74010B 100%);
      .nav-item {
        text-align: center;
        width: 100%;
        height: 0.91rem;
        line-height: 0.91rem;
        font-size: 0.3rem;
        color: #fff;
        border-bottom: 0.02rem solid #901B25;
        &.active {
          background: linear-gradient(360deg, #FFB727 0%, #FFD260 100%);
          color: #000000;
        }
      }
    }
    .right-game {
      flex: 1;
      padding: 0 0.24rem;
      text-align: left;
      .game-item {
        width: 1.68rem;
        &:nth-child(3n -1 ) {
          margin: 0 0.15rem;
        }
      }
    }
  }
}
</style>