<template>
  <view-page full-box class="home-page">
    <home-header slot="header" @on-download="onDownload"></home-header>
    <div slot="content">
      <div :class="['swiper-box',
        { 'tccp-swiper-box' : $config.name === 'tccp'},
        { 'tyc86' : $config.name === 'tyc86'},
      ]">
        <swiper :options="swiperOption" ref="mySwiper" class="bannerSwiper">
          <swiper-slide v-for="(item, i) in swiperList" :key="i">
            <div class="swiper-item" @click="swiperItemClick(item)" :style="
              'backgroundImage:url('+item.img+');'
              ">
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="notice-box">
        <i class="notice_icon icon iconfont h5-icon-icon-gonggao"></i>
        <van-notice-bar
          class="notice-bar"
          @click="showMarquee"
          v-if="noticeStr && noticeStr.length"
        >
          <div class="notice" v-for="(item,i) in noticeStr" :key="i">{{item.description}}</div>
        </van-notice-bar>
      </div>
      <!-- <div v-if="$config.name === 'cpxpj'" class="cpxpj-lottery-nav">
        <div class="cpxpj-nav-text">
          <span>欢迎来到澳门太阳城</span>
          <router-link to="/admin/login">点击登录</router-link>
        </div>
        <ul>
          <li class="item" v-for="(item,i) in cpxpjTopList" :key="i">
            <img class="icon" :src="item.img" @click="linkClick(item.type)" alt/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </div> -->
      <ul v-if="$config.name === 'tccp'||$config.name === 'tyc86'" class="list lottery_nav tccpList">
        <li class="item" v-for="(item,i) in listTop" :key="i">
          <img class="icon" src="../../../../assets/img/error-img-home.png" v-real-img="imgUrl(item.icon)" @click="blushGameClick(item)" alt/>
          <span class="name">{{item.name}}</span>
          <i class="msg-count" v-if="item.id === 99991 && msgCount"> {{msgCount}} </i>
        </li>
        <li class="item">
          <img class="icon" src="../../../../assets/img/home/blush/tccp/jiebei.png" @click="goPath('/user/JieBeiCenter')" alt/>
          <span class="name">借呗</span>
        </li>
        <li class="item">
          <img class="icon" src="../../../../assets/img/home/blush/tccp/vip.png"  @click="goJGJ" alt/>
          <span class="name">VIP</span>
        </li>
      </ul>
      <ul v-else class="list lottery_nav">
        <li class="item" v-for="(item,i) in listTop" :key="i">
          <img class="icon" src="../../../../assets/img/error-img-home.png" v-real-img="imgUrl(item.icon)" @click="blushGameClick(item)" alt/>
          <span class="name ">{{item.name}}</span>
          <i class="msg-count" v-if="item.id === 99991 && msgCount"> {{msgCount}} </i>
        </li>
      </ul>

      <!-- <div v-if="$config.name === 'cpxpj'" class="cpxpj-games">
        <cube-scroll-nav-bar
          :current="currIndex"
          :labels="cpxpjGameList"
          @change="changeHandler"
        >
          <div slot-scope="props">
            <img class="cpxpj-tabs" v-if="props.label === props.active" :src="gameListConfig[props.txt].img" />
            <i class="cpxpj-tabs cpxpj-tabs-title" v-if="props.label !== props.active" >{{gameListConfig[props.txt].title}}</i>
          </div>
        </cube-scroll-nav-bar>
        <ul>
          <li v-for="(tab, i) in gameListConfig[currIndex].games" :key="i">
            <div @click="onGameClick(tab)">
              <img :src="[99996,10001].includes(tab.id) ? tab.icon : imgUrl(tab.icon)" alt/>
            </div>
          </li>
        </ul>
      </div> -->
      <div class="blush">
        <div v-for="(item,i) in gameList" :key="i">
          <div class="tit" @click="moreClick(item)">
            <span>
              {{gameListConfig[item].title}}
            </span>
            <span>更多>></span>
          </div>
          <scroll-box  direction="horizontal">
            <vant-tabs class="blush-tab" :swipe-threshold="3" v-model="tabIndex">
              <vant-tab v-for="(tab,i) in gameListConfig[item].games" :key="i">
                <div slot="title" class="blush-tab-item" @click="onGameClick(tab)">
                  <img class="tab-icon" :src="[99996,10001].includes(tab.id) ? tab.icon : imgUrl(tab.icon,item)" alt/>
                  <!-- <span class="tab-name">{{tab.name}}</span> -->
                </div>
              </vant-tab>
            </vant-tabs>
          </scroll-box>
        </div>
      </div>
      <div :class="['footer',
        { 'tyc86' : $config.name === 'tyc86'},
      ]">
         <div class="bg"></div>
      </div>
      <slot name="marqueeDialog"></slot>
    </div>
    <div :style="{height:$store.state.main.tabHeight+'px'}" style="width: 100%" slot="footer"></div>
    <div slot="static">
      <slot name="NoticeDialog"></slot>
      <slot name="marqueeDialog"></slot>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Tabs, Tab } from 'vant'
import homeMixin from "../mixin";
import Header from "./Header";
import { scroll } from "cube-ui"

let vm = null;
export default {
  name: "Index",
  components: {
    HomeHeader: Header,
    swiper,
    swiperSlide,
    vantTabs: Tabs,
    vantTab: Tab,
  },
  mixins: [homeMixin],
  data() {
    return {
      tabIndex: 0,
      hotLen: 14,
      animation: "",
      listHeight: 0,
      chessList: [],
      redLope: true,
      noticeStr:[],
      intervalId:null,
      swiperOption: {
        init: false,
        autoplay : {
          disableOnInteraction: false
        }, 
        observer: true,
        observeParents: true,
      },
      url:window.location.origin + "/static/jltx/html/active/hongbao/m/index.html",
      showSwiper: false,
      currIndex: 0 || 20002,
      gameListId: [20002, 10005, 10001, 10004, 10003, 10002,10000],
      gameList: [],
      cpxpjGameList: [20002, 10001, 10004, 10003, 10005, 10000, 10002],
      gameListConfig: {
        20002: {
          title: '热门游戏',
          type: "fish",
          id: "20002",
          img: require('../../../../../sites/cpxpj/assets/img/home/hot-game.png'),
          games: [],
        },
        10005: {
          title: '捕鱼游戏',
          type: "fish",
          id: "10005",
          img: require('../../../../../sites/cpxpj/assets/img/home/fish-game.png'),
          games: [],
        },
        10001: {
          title: '电子游戏',
          type: "slot",
          id: "10001",
          img: require('../../../../../sites/cpxpj/assets/img/home/e-game.png'),
          games: [],
        },
        10004: {
          title: '棋牌游戏',
          type: "chess",
          id: "10004",
          img: require('../../../../../sites/cpxpj/assets/img/home/card-game.png'),
          games: [],
        },
        10003: {
          title: '真人视讯',
          type: "live",
          id: "10003",
          img: require('../../../../../sites/cpxpj/assets/img/home/video-game.png'),
          games: [],
        },
        10002: {
          title: '体育赛事',
          type: "sport",
          id: "10002",
          img: require('../../../../../sites/cpxpj/assets/img/home/sport-game.png'),
          games: [],
        },
        10000: {
          title: '彩票投注',
          type: "lottery",
          id: "10000",
          img: require('../../../../../sites/cpxpj/assets/img/home/lottery-game.png'),
          games: [],
        },
      },
      // cpxpjTopList: [
      //   {
      //     type: 'deposit',
      //     name: '存款',
      //     img: require('../../../../../sites/cpxpj/assets/img/home/home_icon_deposit.png')
      //   },
      //   {
      //     type: 'withraw',
      //     name: '取款',
      //     img: require('../../../../../sites/cpxpj/assets/img/home/home_icon_withdraw.png')
      //   },
      //   {
      //     type: 'message',
      //     name: '站内信',
      //     img: require('../../../../../sites/cpxpj/assets/img/home/232.png')
      //   },
      //   {
      //     type: 'check',
      //     name: '签到',
      //     img: require('../../../../../sites/cpxpj/assets/img/home/wtewtwetw.png')
      //   },
      //   {
      //     type: 'housekeeper',
      //     name: '金管家',
      //     img: require('../../../../../sites/cpxpj/assets/img/home/home_icon_vip.png')
      //   },
      // ],
      timer: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user.userInfo;
    },
    checkUrl() {
      if (this.user) {
        return this.url;
      } else {
        return "javascript: void(0)";
      }
    },
    msgCount(){
      return this.$store.state.user.msgCount.allUnReadCount
    },
  },
  created() {
    this.getBanner()
     vm = this;
     if(localStorage['qpHomeGameList'] && localStorage['qpHomeList']) {
      this.gameListConfig = JSON.parse(localStorage['qpHomeGameList'])
      this.gameList = JSON.parse(localStorage['qpHomeList'])
      this.$nextTick(() =>{
        this.currIndex = this.gameList[0];
        this.timer = true
      })
    }else {
      this.timer = true
    }
    this.getHomeData(null,'10000|10001|10002|10003|10004|10005|20001|20002')
  },
  mounted(){
    //解决偶尔获取不到localStorage数据问题，导致公告空白
    this.intervalId = window.setInterval(()=>{
      this.initNotice();
    },100);
    setTimeout(() => {
      if(this.$refs.mySwiper) {
        this.$refs.mySwiper.swiper.init()
      }
    }, 500);
  },
  watch: {
    listContent(newVal) {
      this.showSwiper = false
      if(newVal.length) {
        this.$nextTick(()=>{
          this.showSwiper = true
        })
      }
    },
    swiperList(newVal) {
      if(newVal.length) {
        this.$nextTick(()=>{
          if(this.$refs.mySwiper) {
            this.$refs.mySwiper.swiper.init()
          }
        })
      }
    },
    listTop() {
      if(this.listTop.length < 8) {
        let kefuObj = {
          icon: require('../../../../assets/img/home/blush/kf.svg'),
          name: "在线客服",
          type: "kefu"
        }
        this.listTop.push(kefuObj)
      }
    },
    gameMap() {
      if(this.timer) {
        this.timer = false
        let obj = {
          id : 20002,
        }
        let listTopGame= JSON.parse(JSON.stringify(this.listTop));
        listTopGame.unshift(obj)
        this.gameList = []
        if (this.$config.name === 'tccp' || this.$config.name === 'tyc86' ) {
          const tccpMapTable = {
            20002: 0,
            10004: 1,
            10003: 2,
            10005: 3,
            10001: 4,
            10000: 5,
            10002: 6,
            99998: 7,
            99991: 8
          }
          this.listTop.map(item => { item.sort = tccpMapTable[item.id] })
          this.listTop.sort((a, b) => {
            return a.sort - b.sort
          })
          this.gameListId = [20002, 10004, 10003, 10005, 10001, 10000, 10002] // 热门-棋牌-真人-捕鱼-电子-彩票-体育
        }
        // 為了改變遊戲菜單順序, 所以會在這邊先做 this.gameList.push(item)
        this.gameListId.forEach((item) => {
          this.gameList.push(item)
        })
        listTopGame.forEach(item => {
          let id = item.id
          if (this.gameListId.indexOf(id) >= 0) {
            switch (item.id) {
            // 彩票
            case 10000:
              let longDragonImg =""
              if(this.$config.name ==="tyc86"){
               longDragonImg =  localStorage.SiteStaticsUrl +"/images/style28/20002/99996.png"
              }else{
               longDragonImg =  localStorage.SiteStaticsUrl +"/images/" +JSON.parse(localStorage.config).theme +"/20002/99996.png"
              }
              let longDragon = {
                code : "",
                icon: longDragonImg,
                id: 99996,
                name: "长龙助手",
                series: "",
                tag: "",
                title: "",
                type: "other",
                upid: 99996,
              }
              this.gameListConfig[item.id].games = this.hots
              this.gameListConfig[id].games.unshift(longDragon)
              break;
              // 电子
            case 10001:
              this.gameListConfig[item.id].games = this.gameMap[item.id]['list'].filter(item => item.id == 67)[0]['list'].filter(item => item.id !== 74)
              this.gameListConfig[item.id].games.forEach((info) => {
                delete info.list
              })
              // let game = {
              //   code: "GAME",
              //   icon: require("@src/assets/img/home/blush/recommend.png"),
              //   id: 10001,
              //   lock: 0,
              //   name: "本站推荐",
              //   series: 10001,
              //   tag: "",
              //   title: "本站推荐",
              //   type: "game-list",
              //   upid: 10001,
              // }
              // this.gameListConfig[id].games.unshift(game)
              break;
              // 体育 真人
              case 10002: case 10003 :
                this.gameListConfig[item.id].games = this.gameMap[item.id]
                break;
              // 棋牌
              case 10004: 
                this.gameListConfig[item.id].games = this.gameMap[item.id]['list'].filter(item => item.id == 16)[0]['list'].filter(item => item.id !== 17)
                break;
              // 捕鱼
              case 10005: 
              this.gameListConfig[item.id].games = this.gameMap[item.id]['list'].filter(item => item.id == 193)[0]['list'].filter(item => item.id === 197)[0]['games']
                break;
              //热门
              case 20002: 
              this.gameListConfig[item.id].games = this.listContent
                break;
            }
          }
        });
        this.$nextTick(() =>{
          this.currIndex = this.gameList[0];
          localStorage['qpHomeGameList'] = JSON.stringify(this.gameListConfig)
          localStorage['qpHomeList'] = JSON.stringify(this.gameList)
        })
        setTimeout(() => {
          this.timer = true
        }, 1000);
      }
    }
  },
  methods: {
     changeHandler(cur) {
      this.currIndex = cur
    },
    imgUrl (url,item) {
      if(url.indexOf('kf') > 0) {
        return url
      } else{
        if(!item || item === 20002) {
          return this.publicStaticHost + '/images/'+ url
        }else {
          return this.publicStaticHost + '/images/'+ url.replace('/m/','/20000/')
        }
      } 
    },
    initNotice(){
      if(JSON.parse(localStorage.getItem('marqueeList'))) {
        this.noticeStr =JSON.parse(localStorage.getItem('marqueeList'))
      }else if(this.$store.state.main.marqueeList) {
        this.noticeStr = this.$store.state.main.marqueeList
      }
      if(this.noticeStr && this.noticeStr.length > 0){
        window.clearInterval(this.intervalId);
      }
    },
    handleClickSlide(data) {
      this.onGameClick(JSON.parse(data));
    },
    goRed() {
      if (!this.user) {
        this.$router.push("/admin/login");
      } else {
      }
    },
    showMarquee() {
      this.$store.commit("main/marqueeDialog", true);
    },
    blushGameClick(item) {
      // 站内信
      if(item.id === 99991) {
        if(this.user) {
          this.$router.push('/user/message?index=1')
        }else {
          this.$router.push('/admin/login')
        }
      } else if(item.type === 'kefu') {
        this.inService()
      } else {
        this.onGameClick(item);
      }
    },
    linkClick(type) {
      if (this.user) {
        switch (type) {
          case 'deposit':
            this.$router.push('/save')
            break;
          case 'withraw':
            this.$router.push('/take?path=home')
            break;
          case 'message':
            this.$router.push('/user/message?index=1')
            break;
          default:
            return;
        }
      } else {
        this.$router.push('/admin/login')
      }
    },
    moreClick(item) {
      if (item=== 20002) {
        if (this.$config.name === 'tccp' || this.$config.name === 'tyc86' ) this.$router.push('/home/type/10004?name=棋牌游戏&id=10004')
        else this.$router.push('/hotgame-more')
      } else if ([10001,10002,10003,10004,10005].includes(item)) {
        this.$router.push({
          path: '/home/type/' + item,
          params: {
            name: this.gameListConfig[item].title,
            id: item
          },
          query: {
            name: this.gameListConfig[item].title,
            id: item
          }
        })
      }else if(item === 10000) {
        this.onGameClick(this.gameListConfig[item].games[0])
      }
    },
    goJGJ () {
      window.location.href = window.location.origin + '/static/public/active/jgj/m/index.html'
    },
    goPath (path) {
      if (!this.$store.state.user.token) {
        this.$router.push('/admin/login')
      } else {
        this.$router.push(path)
      }
    },
  }
};
</script>

<style lang="less" type='text/less' scoped>
@import "../../../../style/icon/home-icon-xpj";
.home-page {
  background:  #7E010C;
  .notice-box {
    width: 7.25rem;
    height: 0.58rem;
    line-height: 0.58rem;
    font-size: 0.28rem;
    background-color: #7E010C;
    padding: 0 0.05rem;
    overflow: hidden;
    border-bottom: 0.02rem solid  rgba(255,255,225,0.14);
    .notice_icon {
      color: #ECBE4A;
      float: left;
      margin-left: .22rem;
    }
    .notice-bar {
      height: 0.58rem;
      line-height: 0.58rem;
      font-size: 0.24rem;
      padding: 0 0 0 0.2rem;
      background-color: transparent;
      /deep/ .van-notice-bar__wrap {
        height: 100% !important;
        .van-notice-bar__content {
          white-space: nowrap;
          width: auto;
        }
      }
      .notice {
        color: #fff;
        display: inline-block;
        margin-right: 0.3rem;
      }
    }
  }
  // .notice-box-cpxpj {
  //   height: 0.58rem;
  //   line-height: 0.58rem;
  //   font-size: 0.28rem;
  //   background-color: #FBFBFB;
  //   padding: 0 0.05rem;
  //   overflow: hidden;
  //   border-bottom: 0.02rem solid  rgba(255,255,225,0.14);
  //   .notice_icon {
  //     color: #FC8A44;
  //     float: left;
  //     margin-left: .22rem;
  //   }
  //   .notice-bar {
  //     height: 0.58rem;
  //     line-height: 0.58rem;
  //     font-size: 0.24rem;
  //     padding: 0 0 0 0.2rem;
  //     background-color: transparent;
  //     /deep/ .van-notice-bar__wrap {
  //       height: 100% !important;
  //       .van-notice-bar__content {
  //         white-space: nowrap;
  //         width: auto;
  //       }
  //     }
  //     .notice {
  //       color: #707070;
  //       display: inline-block;
  //     }
  //   }
  // }

  .swiper-box {
    width: 100%;
    height: 2.01rem;
    padding: 0 0.24rem;
    background: #7E010C;
    transform: translate3d(0, 0, 0);
    overflow: hidden;
    margin-top: 0.08rem;
    /deep/ .bannerSwiper {
      height: 100%;
      .swiper-slide {
        height: 2.01rem;
        img {
          height: 100%;
        }
      }
    }
    .swiper-item {
      width: 100%;
      display: block;
      transform:translate3d(0,0,0);
      height: 2.01rem;
      background-size: 100% 100%;
    }
  }

  .cpxpj-swiper-box {
    width: 100%;
    height: 3.5rem;
    transform: translate3d(0, 0, 0);
    overflow: hidden;
    /deep/ .bannerSwiper {
      width: 100%;
      height: 100%;
      .swiper-slide {
        height: 3.5rem;
        img {
          height: 100%;
        }
      }
    }
    .swiper-item {
      width: 100%;
      display: block;
      transform:translate3d(0,0,0);
      height: 3.5rem;
      background-size: 100% 100%;
    }
  }

  .tccp-swiper-box {
    padding: 0 !important;
    height: 2.2rem !important;
    .swiper-slide {
      height: 2.2rem !important;
    }
    .swiper-item {
      height: 2.2rem !important;
    }
  }

  .tyc86.swiper-box {
    margin-top: 0 !important;
    padding: 0 !important;
    height: 2.2rem !important;
    .swiper-slide {
      height: 2.2rem !important;
    }
    .swiper-item {
      height: 2.2rem !important;
    }
  }

  // .cpxpj-lottery-nav {
  //   background: #ffffff;
  //   width: 100%;
  //   min-height: 100px;
  //   .cpxpj-nav-text {
  //     display: flex;
  //     justify-content: space-between;
  //     align-items: center;
  //     padding-top: 10px;
  //     padding-left: 9px;
  //     padding-right: 15px;
  //     span {
  //       font-size: 15px;
  //       color: #707070;
  //     }
  //     a {
  //       font-size: 16px;
  //       color: #151515;
  //       font-weight: bold;
  //     }
  //   }
  //   ul {
  //     .item {
  //       width: calc(100% / 5);
  //       margin-top: 7px;
  //       height: 0.9rem;
  //       float: left;
  //     }
  //     .icon {
  //       display: block;
  //       margin: 0 auto;
  //       width: 43px;
  //       min-width: 43px;
  //       min-height: 40px;
  //       height: 40px;
  //     }
  //     .name {
  //       display: block;
  //       font-size: 0.26rem;
  //       width: 100%;
  //       color: #707070;
  //     }
  //   }
  // }
  
  .blush{
     background: #530107;
     width: 100%;
     border-radius: 0.15rem 0.15rem 0 0 ;
  .tit {
    width: 100%;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0.16rem 0.24rem 0.23rem 0.24rem;

    span {
      display: block;
      font-size: 0.24rem;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 0.29rem;
      color: #ECBE4A;
    }
    span:last-of-type {
      height: 100%;
      color: #fff;
      font-size: 0.22rem;
      font-family: PingFang SC;
      font-weight: 400;
      color: #FAF3E0;
    }
  }
  .blush-tab {
    background-color: #530107;
    padding-top: 0;

    /deep/ .van-tabs__wrap {
      height: 1.5rem;
      z-index:999;
    }

    /deep/ .van-tabs__line {
      display: none;
    }

    /deep/ .van-tabs__nav {
      background-color: #530107;
      padding-left: 0.07rem;
      padding-right: 0;
      .van-tab {
        flex: none;
        padding: 0 0.17rem;
      }
    }

    /deep/ .van-hairline--top-bottom::after {
      border-width: 0;
      display: none;
    }
    .blush-tab-item {
      background-color: #530107;
      color: #FAF3E0;
      box-sizing: border-box;
      height: 1.5rem;
      width: 100%;

      .tab-icon {
        width: 1.4rem;
        height: 1.4rem;
        max-width: 1.4rem;
        max-height: 1.4rem;
        display: block;
        border-radius: 0.1rem;
      }
      .tab-name {
        margin-top: 0.22rem;
        font-size: 0.22rem;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 0.22rem;
        color: #FAF3E0;
        display: block;
      }
    }
  } 

  }

  // .blush-cpxpj{
  //    background: #530107;
  //    width: 100%;
  //    border-radius: 0.15rem 0.15rem 0 0 ;
  //   .tit {
  //     width: 100%;
  //     display: flex;
  //     justify-content: space-between;
  //     box-sizing: border-box;
  //     padding: 0.16rem 0.24rem 0.23rem 0.24rem;

  //     span {
  //       display: block;
  //       font-size: 0.24rem;
  //       font-family: PingFang SC;
  //       font-weight: bold;
  //       line-height: 0.29rem;
  //       color: #ECBE4A;
  //     }
  //     span:last-of-type {
  //       height: 100%;
  //       color: #fff;
  //       font-size: 0.22rem;
  //       font-family: PingFang SC;
  //       font-weight: 400;
  //       color: #FAF3E0;
  //     }
  //   }
  //   .blush-tab {
  //     background-color: #530107;
  //     padding-top: 0;

  //     /deep/ .van-tabs__wrap {
  //       height: 1.5rem;
  //       z-index:999;
  //     }

  //     /deep/ .van-tabs__line {
  //       display: none;
  //     }

  //     /deep/ .van-tabs__nav {
  //       background-color: #530107;
  //       padding-left: 0.07rem;
  //       padding-right: 0;
  //       .van-tab {
  //         flex: none;
  //         padding: 0 0.17rem;
  //       }
  //     }

  //     /deep/ .van-hairline--top-bottom::after {
  //       border-width: 0;
  //       display: none;
  //     }
  //     .blush-tab-item {
  //       background-color: #530107;
  //       color: #FAF3E0;
  //       box-sizing: border-box;
  //       height: 1.5rem;
  //       width: 100%;

  //       .tab-icon {
  //         width: 1.4rem;
  //         height: 1.4rem;
  //         max-width: 1.4rem;
  //         max-height: 1.4rem;
  //         display: block;
  //         border-radius: 0.1rem;
  //       }
  //       .tab-name {
  //         margin-top: 0.22rem;
  //         font-size: 0.22rem;
  //         font-family: PingFang SC;
  //         font-weight: 400;
  //         line-height: 0.22rem;
  //         color: #FAF3E0;
  //         display: block;
  //       }
  //     }
  //   }
  // }

  // .cpxpj-games {
  //   background: #F5F5F9;
  //   .cube-scroll-nav-bar_horizontal {
  //     background: #F5F5F9;
  //   }
  //   ul {
  //     padding-left: 15px;
  //     padding-right: 15px;
  //     display: grid;
  //     justify-content: space-between;
  //     grid-template-columns: repeat(auto-fill, 170px);
  //     grid-gap: 5px;
  //     li {
  //       margin-top: 5px;
  //     }
  //     img {
  //       width: 100%;
  //       border-radius: 8px;
  //     }
  //   }
  // }

  // .cpxpj-tabs {
  //   min-width: 83px;
  //   height: 44px;
  // }
  // .cpxpj-tabs-title {
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  // }

  .footer{
       background: #530107;
       width: 100%;
       padding:0.23rem 0.31rem 0.5rem;
     .bg{
       width: 6.88rem;
       height: 8.78rem;
       background: url('../../../../assets/img/home/blush/bg.png');
       background-size: 100% 100%;
     }
  }

  .tyc86.footer {
    .bg {
      background-image: url('../../../../../sites/tyc86/assets/img/home/bg.png') !important;
    }
  }

  .game-swiper {
    transform: translate3d(0, 0, 0);
    overflow: hidden;
  }

  .list {
    width: 100%;
    background: #7E010C;
    padding: 0 0 0.26rem 0;
    margin: 0;
    box-sizing: border-box;

    &:after {
      content: "";
      display: table;
      clear: both;
    }

    .item {
      width: calc(100% / 4);
      margin-top: 0.2rem;
      height: 0.9rem;
      float: left;
      position: relative;

      .icon {
        display: block;
        margin: 0 auto;
        width: 0.55rem;
        min-width: 0.55rem;
        min-height: 0.55rem;
        height: 0.55rem;
      }

      .name {
        display: block;
        color: #fff;
        font-size: 0.26rem;
        width: 100%;
        color: #ECBE4A;
      }
      .msg-count {
        position: absolute;
        top: -0.18rem;
        left: 49%;
        color: #ffffff;
        background-color: #ff4021;
        font-size: 0.4rem;
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        display: block;
        height: 0.56rem;
        width: 0.56rem;
        line-height: 0.56rem;
        text-align: center;
        border-radius: 0.28rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &.tccpList {
      .item {
        width: calc(100% / 5);
        .icon {
          margin-bottom: .1rem;
        }
      }
    }
  }

  .list_two {
    width: 100%;
    background: white;
    padding: 0.16rem 0.24rem;
    margin: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .item {
      width: 3.43rem;
      height: 1.48rem;
      background: #f7f7f7;
      display: flex;
      align-items: center;
      margin-bottom: 0.16rem;

      .icon {
        display: block;
        width: 1rem;
        height: 1rem;
        margin-left: 0.16rem;
      }

      .game_title {
        height: 1rem;
        margin-left: 0.24rem;
        padding: 0.1rem 0;
        span:first-of-type {
          display: block;
          font-size: 0.3rem;
          color: #555555;
          text-align: left;
          max-width: 1.9rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        span:last-of-type {
          display: block;
          font-size: 0.24rem;
          color: #999999;
          text-align: left;
          margin-top: 0.08rem;
        }
      }
    }
  }
}
</style>
