<template>
  <view-page full-box class="home-page">
    <home-header slot="header" @on-download="onDownload"></home-header>
    <div slot="content" class="content">
      <div class="topArea" ref="topArea">
        <div class="swiper-box">
          <swiper :options="swiperOption" ref="swiper" v-no-touch-move>
            <swiper-slide v-for="(item, i) in swiperList" :key="i">
              <img
                style="width: 100%;display: block;transform:translate3d(0,0,0)"
                :src="item.img"
                @click="swiperItemClick(item)"
                alt=""
              />
            </swiper-slide>
          </swiper>
        </div>
        <div class="notice-box" v-no-touch-move>
          <span class="notice-txt"><img src="../../../../assets/img/home/amhg/laba.png" alt=""></span>
          <van-notice-bar class="notice-bar" v-if="noticeStr && noticeStr.length" @click="showMarquee">
            <div class="notice" v-for="(item,i) in noticeStr" :key="i">{{item.description}}</div>
          </van-notice-bar>
        </div>
        <div class="h-queMenu">
          <div class="h-qmlogin">
            <p class="h-qmtit">
              <span v-if="$store.state.user.token"> ￥{{userInfo?userInfo.balance:'0.00'}} </span>
              <span v-else @click="onLogin()">注册/登录</span>
            </p>
            <p class="h-qmrem">
                <span v-if="$store.state.user.token">
                  {{userInfo?userInfo['userName']:''}} 
                  <p class="user-leave">
                    <span :class="['icon','iconfont',`h5-icon-level-V${Object.keys($store.state.agency.jinguanjiaInfo).length!==0?$store.state.agency.jinguanjiaInfo['level']:0}`]"></span>
                    <span class="name">{{Object.keys($store.state.agency.jinguanjiaInfo).length!==0?'VIP' + $store.state.agency.jinguanjiaInfo['level']:'VIP0'}}</span>
                  </p>
                </span>
                <span v-else>请查看总资产</span>
            </p>
          </div>
          <ul class="h-qmul">
            <li @click="goPath('/save')">
              <p class="h-img">
                <img src="../../../../assets/img/home/amhg/ck.png" alt="">
              </p>
              <p class="h-text">存款</p>
            </li>
            <li @click="goPath('/take?path=home')">
              <p class="h-img">
                <img src="../../../../assets/img/home/amhg/qk.png" alt="">
              </p>
              <p class="h-text">取款</p>
            </li>
            <li @click="goJGJ">
              <P class="h-img">
                <img src="../../../../assets/img/home/amhg/vvip.png" alt="">
              </p>
              <p class="h-text">VIP</p>
            </li>
            <li @click="goPath('/user/JieBeiCenter')">
              <p class="h-img">
                <img src="../../../../assets/img/home/amhg/zz.png" alt="">
              </p>
              <p class="h-text">借呗</p>
            </li>
          </ul>
        </div>
      </div>
        <div class="gameArea" ref="gameArea">
          <div class="leftNav">
            <ul>
              <li 
                v-for="(item,i) in gameList" 
                :class="active === item?'active':''"
                :key="i" 
                v-if="gameListConfig[item].games.length"
                @click="navClick(item)">
                <div class="navBox">
                  <img :src="active === item ?gameListConfig[item].img_acitve : gameListConfig[item].img" alt class="img"/>
                  <div class="name">{{gameListConfig[item].title}}</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="right-box">
              <ul v-if="games && active !== 10000" class="ulList">
                <li 
                  v-for="(item,i) in games" :key="i"
                  :class="active===10002&&games.length===4?'tyImg4':active===10002&&games.length<=3?'tyImg3':'gameImg'"
                  @click="gameClick(item)"
                >
                  <img :src="imgUrl(item.icon)" alt="" />
                </li>
              </ul>
              <ul v-if="games&&active===10000" class="lotteryList">
                <li @click="onGameClick(games[0])" class="lottery-big">
                  <img :src="games[0].icon" alt="" />
                </li>
                <li class="lottery-small">
                  <div
                  v-for="(item,i) in games" :key="i"
                  @click="onGameClick(item)"
                  v-if="item.name!=='彩票大厅'"
                  >
                    <img :src="imgUrl(item.icon)" alt="" />
                    <span class="name" >{{item.name}}</span>
                  </div>
                </li>
              </ul>
          </div>
          <img src="../../../../assets/img/home/amhg/yellow_top.png" v-if="showBackTop" class="back-top" @click="changeCurrIndex(gameList[0],null,true)">
        </div>
        <div class="home-footer">
          <img src="../../../../assets/img/home/amhg/footer.png" alt="" width="100%">
        </div>
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
import { ScrollNavBar } from "cube-ui";
import homeMixin from "../mixin";
import Header from "./Header";
import idConfig from "../../../type/new-game/idConfig";
import { setTimeout } from 'timers';
import { throws } from 'assert';
export default {
  name: "Index",
  components: {
    HomeHeader: Header,
    swiper,
    swiperSlide,
    CubeScrollNavBar: ScrollNavBar,
  },
  mixins: [homeMixin],
  data() {
    return {
      active:20002,
      noticeStr: [],
      intervalId: null,
      url:
        window.location.origin +
        "/static/jltx/html/active/hongbao/m/index.html",
      swiperOption: {
        autoplay: {
          disableOnInteraction: false,
        },
      },
      gameListId: [20002, 10003, 10004, 10001, 10005, 10000, 10002],
      gameList: [],
      gameListConfig: {
        20002: {
          title: "热门",
          type: "fish",
          id: "20002",
          img: require("../../../../assets/img/home/amhg/hotGameImg.svg"),
          img_acitve: require("../../../../assets/img/home/amhg/hotGameImg_active.svg"),
          games: [],
        },
        10005: {
          title: "捕鱼",
          type: "fish",
          id: "10005",
          img: require("../../../../assets/img/home/amhg/byGameImg.svg"),
          img_acitve: require("../../../../assets/img/home/amhg/byGameImg_active.svg"),
          games: [],
        },
        10001: {
          title: "电子",
          type: "slot",
          id: "10001",
          img: require("../../../../assets/img/home/amhg/dzGameImg.svg"),
          img_acitve: require("../../../../assets/img/home/amhg/dzGameImg_active.svg"),
          games: [],
          class: "type2",
        },
        10004: {
          title: "棋牌",
          type: "chess",
          id: "10004",
          img: require("../../../../assets/img/home/amhg/qpGameImg.svg"),
          img_acitve: require("../../../../assets/img/home/amhg/qpGameImg_active.svg"),
          games: [],
          class: "type1",
        },
        10003: {
          title: "真人",
          type: "live",
          id: "10003",
          img: require("../../../../assets/img/home/amhg/zrGameImg.svg"),
          img_acitve: require("../../../../assets/img/home/amhg/zrGameImg_active.svg"),
          games: [],
          class: "type2",
        },
        10002: {
          title: "体育",
          type: "sport",
          id: "10002",
          img: require("../../../../assets/img/home/amhg/tyGameImg.svg"),
          img_acitve: require("../../../../assets/img/home/amhg/tyGameImg_active.svg"),
          games: [],
          class: "type2",
        },
        10000: {
          title: "彩票",
          type: "lottery",
          id: "30001",
          img: require("../../../../assets/img/home/amhg/lotteryImg.svg"),
          img_acitve: require("../../../../assets/img/home/amhg/lotteryImg_active.svg"),
          games: [],
          class: "type1",
        }
      },
      timer: true,
      showBackTop: false,
      gameAreaH: 0,
      showLeftNav: false,
      games: null
    };
  },
  computed: {
    userInfo () {
      return JSON.getObjByLocalStorage('userInfo')
    },
  },
  created() {
  this.getBanner()
   if(localStorage['jinguanjiaInfo']) {
     this.$store.state.agency.jinguanjiaInfo = JSON.parse(localStorage['jinguanjiaInfo'])
   }
   this.getHomeData()
  //    console.log(this.$route.query.homeGameType)
  // this.active = this.$route.query.homeGameType? Number(this.$route.query.homeGameType) : 20002
    
  },
  watch: {
     gameMap() {
      this.gameList = []
      let obj = {
        id : 20002,
      }
      if(this.listTop){
         this.listTop.unshift(obj)
      }else{
        this.listTop = [{id:20002}]
      }
      this.listTop.forEach((item) => {
        if (this.gameListId.indexOf(item.id) >= 0) {
          this.gameList.push(item.id)
          switch (item.id) {
            // 彩票
            case 10000:
              let longDragon = {
                code : "",
                icon: require("@src/assets/img/home/amhg/longDragon.svg"),
                id: 99996,
                name: "长龙助手",
                series: "",
                tag: "",
                title: "",
                type: "other",
                upid: 99996,
              }
              let lotteryHall = {
                code : "",
                icon: require("@src/assets/img/home/amhg/lotteryHall.png"),
                id: 10000,
                name: "彩票大厅",
                series: "",
                tag: "",
                title: "",
                type: "list",
                upid: 10000,
              }
              this.gameListConfig[item.id].games = this.hots
              this.gameListConfig[item.id].games.unshift(longDragon)
              this.gameListConfig[item.id].games.unshift(lotteryHall)
              break;
            // 电子
            case 10001:
              if(Object.keys(this.gameMap[item.id]).length) {
                this.gameMap[item.id]['list'].forEach((listItem,i)=>{
                  if(listItem.name.indexOf('平台') != -1) {
                    this.gameListConfig[item.id].games = this.gameMap[item.id]['list'][i]['list'].filter(item => item.id !== 74)
                  }
                })
              }
              break;
            // 真人
            case 10003 :
              this.gameListConfig[item.id].games = this.gameMap[item.id] 
              break;
            // 体育
            case 10002: 
              if(this.gameMap[item.id].length) {
                if(this.gameMap[item.id].length>4){
                this.gameListConfig[item.id].games = this.gameMap[item.id]
                } else {
                  this.gameListConfig[item.id].games = this.gameMap[item.id]
                  let len = this.gameListConfig[item.id].games.length;
                  if(len<5) {
                    this.gameListConfig[item.id].games.forEach(item=>{
                      this.$set(item,'icon',this.changeIcon(item.icon,len))
                    })
                  }
                }
              }
              break;
            // 棋牌
            case 10004:
              if(Object.keys(this.gameMap[item.id]).length) {
                this.gameMap[item.id]['list'].forEach((listItem,i)=>{
                  if(listItem.name.indexOf('平台') != -1) {
                    this.gameListConfig[item.id].games = this.gameMap[item.id]['list'][i]['list'].filter(item => item.id !== 17)
                  }
                })
              }
              break;
            // 捕鱼
            case 10005: 
              if(Object.keys(this.gameMap[item.id])) {
                this.gameMap[item.id]['list'].forEach((listItem,i)=>{
                  if(listItem.name.indexOf('平台') != -1) {
                    this.gameListConfig[item.id].games = this.gameMap[item.id]['list'][i]['list'].filter(item => item.id !== 197)
                  }
                })
              }
              break;
            //热门
            
            case 20002: 
            this.gameListConfig[item.id].games = this.listContent
              break;
          }
        }
      })
      this.$nextTick(()=>{
        if(this.$route.query.homeGameType) {
          this.active = this.$route.query.homeGameType? Number(this.$route.query.homeGameType) : 20002
          this.navClick(this.active)
        } else {
          if((this.gameList[0]===20002&&this.gameListConfig[20002].games.length)||this.gameList.length===1){
            this.navClick(20002)
          }else{
            try{
              this.gameList.forEach(item=>{
                if(this.gameListConfig[item].games.length) {
                  throw this.navClick(item)
                }
              })
            }catch(e) {}
            
          }
        }
      })
    }
  },
  mounted() {
    //解决偶尔获取不到localStorage数据问题，导致公告空白
    this.intervalId = window.setInterval(() => {
      this.initNotice();
    }, 100);
  },
  methods: {
    imgUrl (url) {
      if(url.indexOf('longDragon.svg') > 0 || url.indexOf('game_more.png') > 0) {
        return url
      }else {
        return this.publicStaticHost + '/images/'+ url
      }
    },
    goJGJ() {
       window.location.href = window.location.origin + '/static/public/active/jgj/m/index.html';
    },
    goPath(path) {
      if (!this.$store.state.user.token) {
        this.$router.push('/admin/login')
      }else {
        this.$router.push(path)
      }
    },
    onLogin(){
      if(this.$config.homeLogin && !this.isApp) {
        this.$config.home === 'vns' ? this.$router.push('/home-login-b') 
        : this.$config.home === 'black' ? this.$router.push('/home-login-c') 
        :this.$router.push('/home-login-a')
      }else {
          this.$router.push({path:'/admin/login',replace:true});
      }
    },
    initNotice() {
      if (JSON.parse(localStorage.getItem("marqueeList"))) {
        this.noticeStr = JSON.parse(localStorage.getItem("marqueeList"));
      }
      if (this.noticeStr && this.noticeStr.length > 0) {
        window.clearInterval(this.intervalId);
      }
    },
    showMarquee() {
      this.$store.commit("main/marqueeDialog", true);
    },
    gameClick(item) {
      if((this.active === 10001 || this.active === 10004 || this.active === 10005) && item.id !== 10001 && item.id !== 10004 && item.id !== 10005) {
        item['id'] = item.gcid
        item['isgame'] = this.active === 10001 || this.active === 10005 ? 0 : 1
      }
      if(this.active !== 30001){
        item['type'] = 'game'
      }
      this.onGameClick(item)
    },
    changeIcon(url,len) {
      let imgName = url.replace(/(.*\/)*([^.]+).*/ig,'$2')
      let newIcon;
      if(len===4) newIcon = url.replace(imgName,imgName+ '_a');
      if(len<=3) newIcon = url.replace(imgName,imgName+ '_b');
      return newIcon
    },
    navClick(item){
      this.active = item;
      
      let more = {}
      this.listTop.forEach(t=>{
        if(item === t.id) {
          more = t;
          more.icon = require("@src/assets/img/home/amhg/game_more.png")
        }
      })
      if(item === 20002){
        this.games = this.gameListConfig[item].games.slice(0,6);
      } else if(item === 10000) {
        this.games = this.gameListConfig[item].games.slice(0,7);
      } else {
        if (this.gameListConfig[item].games.length>6) {
          this.games = this.gameListConfig[item].games.slice(0,5);
          this.games.push(more);
        } else {
          this.games = this.gameListConfig[item].games
        }
      }
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
.home-page {
  background: #F9F9F9;
  .swiper-box {
    width: 7rem;
    height: 2rem;
    margin:0 auto;
    border-radius: 11px;
    transform: translate3d(0, 0, 0);
    overflow: hidden;
    .swiper-container-autoheight {
      height: 100%;
      .swiper-slide {
        height: 100%;
        img {
          height: 100%;
        }
      }
    }
  }
  .notice-box {
    width: 6.9rem;
    height: 0.72rem;
    line-height: 0.56rem;
    font-size: 0.28rem;
    position: relative;
    margin: 0 auto;
    background:#F9F9F9;
    .notice-txt {
      position: absolute;
      left: 0rem;
      line-height: 0.74rem;
      img{
        width: 0.41rem;
        height: 0.3rem;
      }
    }
    .notice-bar {
      height: 0.72rem;
      line-height: 0.72rem;
      font-size: 0.26rem;
      padding: 0 0 0 0.7rem;
      background-color: transparent;
      /deep/ .van-notice-bar__wrap {
        height: 100% !important;
        .van-notice-bar__content {
          white-space: nowrap;
          width: auto;
          font-size: 0.24rem;
          color: #A1A1B2;
        }
      }
    }
  }
  .h-queMenu{
    display: flex;
    justify-content: space-between;
    width: 7rem;
    margin: 0 auto;
    height: 79px;
    padding: .24rem 0 .22rem .22rem;
    background-color: #fff;
    margin-bottom: 0.24rem;
    .h-qmlogin{
      width: 4.8rem;
      
      .h-qmtit{
        font-size: .36rem;
        font-weight: 500;
        margin-bottom: 0.15rem;
        color: #585863;
        text-align: left;
        padding-left:0.1rem;
        span{
          font-size: .35rem;
          }
        }
      .h-qmrem{
          font-size: .26rem;
          color: #a1a1b2;
          display: flex;
          align-items: center;
          width: 100%;
          padding-left:0.1rem;
          span{
            line-height: .48rem;
            .user-leave{
              display: inline;
              color: #EEC04C;
              .icon{
                font-size: 0.4rem;
                vertical-align: middle;
              }
              .name{
                margin-left: 0.05rem;
                font-size: 0.28rem;
              }
            }
          }
        }
      
      
    }
    .h-qmul{
      flex: 1 0 auto;
      display: flex;
      justify-content: space-between;
      li{
        width:1rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        cursor: pointer;
        .h-img{
          display: flex;
          justify-content: center;
          align-items: center;
          img{
             width: 0.91rem;
            height: 0.94rem;
          }
        }
        .h-text{
          width: 100%;
          text-align: center;
          color: #585863;
          font-size: .28rem;
          margin-top:-0.1rem;
        }
      }
    }
  }
  .gameArea{
    width:7rem;
    height: 100%;
    margin: 0 auto;
    display: flex;
    // flex-direction: row;
    // overflow: hidden;
    // position: relative;
    .leftNav {
      width: 1.82rem;
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      ul{
        li{
          width:1.6rem;
          height: 0.88rem;
          background: #FFFFFF;
          box-shadow: 0px 3px 6px rgba(184, 184, 184, 0.04);
          opacity: 1;
          border-radius: 0.1rem;
          text-align:center;
          margin-bottom:0.15rem;
          .navBox{
            height: 100%;
            display: flex;
            align-items: center;
            img{
              width: 0.5rem;
              height: 0.5rem;
              margin: 0 0.1rem 0 0.2rem;
            }
            .name{
              display:inline;
              font-size:0.3rem;
              font-weight:500;
              color:#A1A1B2;
            }
          }
          &.active{
            background: linear-gradient(92deg, #FFCB47 0%, #ECBD49 100%);
            box-shadow: 0px 3px 6px #F0DBA5;
            .name{
              color:#fff;
            }
          }
        }
      }
    }
    .right-box {
      width: 100%;
      margin-left: 0.06rem;
      overflow: hidden;
      flex: 1;
      .ulList{
        display:flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li{
          width: 2.5rem;
          background: #D6D6D6;
          box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.07);
          opacity: 1;
          border-radius: 5px;
          margin-bottom: 0.23rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .gameImg{
          height: 2.2rem;
        }
        .tyImg4{
          height: 3.4rem;
        }
        .tyImg3{
          width:5.2rem;
          height: 2.2rem;
        }
      }
      .lotteryList {
          .lottery-big {
            width:100%;
            height:2.47rem;
            border-radius: 5px;
            margin-bottom: 0.23rem;
            img {
              width:100%;
              height:100%;
            }
          }
          .lottery-small{
            width:100%;
            background:url('../../../../assets/img/home/amhg/lottery_bg.png') no-repeat 100% 100%;
            background-size: contain;
            display:flex;
            justify-content:flex-start;
            flex-wrap:wrap;
            div{
              width:33.3333%;
              text-align:center;
              margin-bottom:0.51rem;
              img{
              width:1.15rem;
              height:1.15rem;
              }

              .name{
                display:block;
                font-size:.24rem;
                color:#81818D;
                margin-top:0.15rem;
              }
            }
            
          }
      }
    }
    .back-top {
    width: 0.86rem;
    height: 0.86rem;
    position: absolute;
    bottom: 0.3rem;
    right: 0.31rem;
    }
  
  }
  .home-footer{
    padding:0.4rem 0;
    text-align:center;
    img{
      width:6.88rem;
    }
  }
}
</style>


