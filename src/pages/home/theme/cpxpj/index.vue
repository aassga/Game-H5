<template>
  <view-page full-box class="home-page">
    <home-header slot="header" @on-download="onDownload"></home-header>
    <div slot="content">
      <div
        :class="[$config.name === 'cpxpj' ? 'cpxpj-swiper-box' : 'swiper-box']"
      >
        <swiper :options="swiperOption" ref="mySwiper" class="bannerSwiper">
          <swiper-slide v-for="(item, i) in swiperList" :key="i">
            <div
              class="swiper-item"
              @click="swiperItemClick(item)"
              :style="'backgroundImage:url(' + item.img + ');'"
            ></div>
          </swiper-slide>
        </swiper>
      </div>
      <div
        :class="[$config.name === 'cpxpj' ? 'notice-box-cpxpj' : 'notice-box']"
      >
        <i class="notice_icon icon iconfont h5-icon-icon-gonggao"></i>
        <van-notice-bar
          class="notice-bar"
          @click="showMarquee"
          v-if="noticeStr && noticeStr.length"
        >
          <div class="notice" v-for="(item, i) in noticeStr" :key="i">
            {{ item.description }}
          </div>
        </van-notice-bar>
        <span class="labelBanner" @click="showMarquee">热门公告</span>
      </div>
      <div class="cpxpj-lottery-nav">
        <!-- <div class="cpxpj-nav-text">
          <span>欢迎来到澳门太阳城</span>
          <router-link to="/admin/login">点击登录</router-link>
        </div> -->
        <ul>
          <li class="item" v-for="(item, i) in cpxpjTopList" :key="i">
            <img
              class="icon"
              :src="item.img"
              @click="linkClick(item.type)"
              alt
            />
            <span class="name">{{ item.name }}</span>
            <i class="msg-count" v-if="item.type === 'message' && msgCount">
              {{ msgCount }}
            </i>
          </li>
        </ul>
      </div>

      <div class="cpxpj-games">
        <div class="gametype-navbar">
          <div
            class="gametype-navbar-item"
            v-for="(item, index) in cpxpjGameList"
            :key="index"
            @click="changeHandler(item)"
          >
            <img
              :src="gameListConfig[item].img"
              v-if="currIndex === item"
              v-lazy="gameListConfig[item].img"
            />
            <i class="" v-else>{{ gameListConfig[item].title.slice(0, 2) }}</i>
          </div>
        </div>
        <ul :class="[ { hotgame: currIndex === 20002 }, `gameType-${currIndex}`]"
        >
          <li v-for="(tab, i) in gameListConfig[currIndex].games" :key="i">
            <div @click="onGameClick(tab)">
              <img
                v-lazy="
                  [99996, 10001].includes(tab.id) ? tab.icon : imgUrl(tab.icon)
                "
                alt
              />
            </div>
          </li>
        </ul>
      </div>
      <!-- <div class="footer">
         <div class="bg"></div>
      </div> -->
      <slot name="marqueeDialog"></slot>
    </div>
    <div
      :style="{ height: $store.state.main.tabHeight + 'px' }"
      style="width: 100%"
      slot="footer"
    ></div>
    <div slot="static">
      <slot name="NoticeDialog"></slot>
      <slot name="marqueeDialog"></slot>
      <slot name="bindPhone"></slot>
    </div>
    <div slot="static">
      <pub-dialog v-model="showDialog" :maskClose="true" style="z-index: 502">
        <div class="dialog-box">
          <div class="content">
            <div
              class="no-open"
              v-if="!isOpen"
              :class="showAnimation ? 'open-sign' : ''"
            >
              <div class="open-btn" @click="onOpenSign"></div>
            </div>
            <div class="opened" v-else>
              <div class="sign-money">{{ signMoney }}</div>
              <div class="get-btn" @click="onGetSign"></div>
            </div>
          </div>
          <div class="close" @click="showDialog = false"></div>
        </div>
      </pub-dialog>
    </div>
    <div slot="static">
      <ios-alert
        v-model="signAlert"
        ref="signAlertRef"
        class="sign-alert"
        :ok-callback="hideAlert"
        ok-text="确定"
        :showNo="false"
      >
        <p class="sign-content theme-color-white" slot="content">
          {{ signMsg }}
        </p>
      </ios-alert>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Tabs, Tab } from "vant";
import homeMixin from "../mixin";
import Header from "./Header";
import { scroll } from "cube-ui";

let vm = null;
export default {
  name: "TypeCPXPJ",
  components: {
    HomeHeader: Header,
    swiper,
    swiperSlide,
    vantTabs: Tabs,
    vantTab: Tab
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
      noticeStr: [],
      intervalId: null,
      swiperOption: {
        init: false,
        autoplay: {
          disableOnInteraction: false
        },
        observer: true,
        observeParents: true
      },
      
      url:
        window.location.origin +
        "/static/jltx/html/active/hongbao/m/index.html",
      showSwiper: false,
      currIndex: 0 || 20002,
      gameListId: [20002, 10005, 10001, 10004, 10003, 10002, 10000],
      gameList: [],
      cpxpjGameList: [20002, 10001, 10004, 10003, 10005, 10000, 10002],
      gameListConfig: {
        20002: {
          title: "热门游戏",
          type: "fish",
          id: "20002",
          img: require("../../../../../sites/cpxpj/assets/img/home/hot-game.png"),
          games: []
        },
        10005: {
          title: "捕鱼游戏",
          type: "fish",
          id: "10005",
          img: require("../../../../../sites/cpxpj/assets/img/home/fish-game.png"),
          games: []
        },
        10001: {
          title: "电子游戏",
          type: "slot",
          id: "10001",
          img: require("../../../../../sites/cpxpj/assets/img/home/e-game.png"),
          games: []
        },
        10004: {
          title: "棋牌游戏",
          type: "chess",
          id: "10004",
          img: require("../../../../../sites/cpxpj/assets/img/home/card-game.png"),
          games: []
        },
        10003: {
          title: "真人视讯",
          type: "live",
          id: "10003",
          img: require("../../../../../sites/cpxpj/assets/img/home/video-game.png"),
          games: []
        },
        10002: {
          title: "体育赛事",
          type: "sport",
          id: "10002",
          img: require("../../../../../sites/cpxpj/assets/img/home/sport-game.png"),
          games: []
        },
        10000: {
          title: "彩票投注",
          type: "lottery",
          id: "10000",
          img: require("../../../../../sites/cpxpj/assets/img/home/lottery-game.png"),
          games: []
        }
      },
      cpxpjTopList: [
        {
          type: "deposit",
          name: "存款",
          img: require("../../../../../sites/cpxpj/assets/img/home/home_icon_deposit.png")
        },
        {
          type: "withraw",
          name: "取款",
          img: require("../../../../../sites/cpxpj/assets/img/home/home_icon_withdraw.png")
        },
        {
          type: "message",
          name: "站内信",
          img: require("../../../../../sites/cpxpj/assets/img/home/232.png")
        },
        {
          type: "check",
          name: "签到",
          img: require("../../../../../sites/cpxpj/assets/img/home/wtewtwetw.png")
        },
        {
          type: "rain",
          name: "抢红包",
          img: require("../../../../../sites/cpxpj/assets/img/home/home_icon_rain.png")
        },
        {
          type: "housekeeper",
          name: "金管家",
          img: require("../../../../../sites/cpxpj/assets/img/home/home_icon_vip.png")
        }
      ],
      timer: false,
      showDialog: false,
      signData: {},
      signMoney: "",
      showAnimation: false,
      isOpen: false,
      isGet: false,
      signAlert: false,
      signMsg: ""
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
    msgCount() {
      return this.$store.state.user.msgCount.allUnReadCount;
    }
  },
  created() {
    this.getBanner()
    vm = this;
    if (localStorage["qpHomeGameList"] && localStorage["qpHomeList"]) {
      this.gameListConfig = JSON.parse(localStorage["qpHomeGameList"]);
      this.gameList = JSON.parse(localStorage["qpHomeList"]);
      this.$nextTick(() => {
        this.currIndex = this.gameList[0];
        this.timer = true;
      });
    } else {
      this.timer = true;
    }
    this.getHomeData(null,'10000|10001|10002|10003|10004|10005|20001|20002')
  },
  mounted() {
    // 解决偶尔获取不到localStorage数据问题，导致公告空白
    this.intervalId = window.setInterval(() => {
      this.initNotice();
    }, 100);
    setTimeout(() => {
      if (this.$refs.mySwiper) {
        this.$refs.mySwiper.swiper.init();
      }
      if (this.$refs.scrollbar) {
        this.$refs.scrollbar.refresh();
      }
    }, 500);
  },
  watch: {
    listContent(newVal) {
      this.showSwiper = false;
      if (newVal.length) {
        this.$nextTick(() => {
          this.showSwiper = true;
        });
      }
    },
    swiperList(newVal) {
      if (newVal.length) {
        this.$nextTick(() => {
          if (this.$refs.mySwiper) {
            this.$refs.mySwiper.swiper.init();
          }
        });
      }
    },
    listTop() {
      if (this.listTop.length < 8) {
        let kefuObj = {
          icon: require("../../../../assets/img/home/blush/kf.svg"),
          name: "在线客服",
          type: "kefu"
        };
        this.listTop.push(kefuObj);
      }
    },
    gameMap() {
      if (this.timer) {
        this.timer = false;
        let obj = {
          id: 20002
        };
        let listTopGame = JSON.parse(JSON.stringify(this.listTop));
        listTopGame.unshift(obj);
        this.gameList = [];
        listTopGame.forEach(item => {
          let id = item.id;
          if (this.gameListId.indexOf(id) >= 0) {
            this.gameList.push(id);
            switch (item.id) {
              // 彩票
              case 10000:
                let longDragon = {
                  code: "",
                  icon:
                    localStorage.SiteStaticsUrl + "/images/style67/m/99996.png",
                  id: 99996,
                  name: "长龙助手",
                  series: "",
                  tag: "",
                  title: "",
                  type: "other",
                  upid: 99996
                };
                this.gameListConfig[item.id].games = this.hots;
                this.gameListConfig[id].games.unshift(longDragon);
                break;
              // 电子
              case 10001:
                this.gameListConfig[item.id].games = this.gameMap[item.id][
                  "list"
                ]
                  .filter(item => item.id == 67)[0]
                  ["list"].filter(item => item.id !== 74);
                this.gameListConfig[item.id].games.forEach(info => {
                  delete info.list;
                });
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
              case 10002:
              case 10003:
                this.gameListConfig[item.id].games = this.gameMap[item.id];
                break;
              // 棋牌
              case 10004:
                this.gameListConfig[item.id].games = this.gameMap[item.id][
                  "list"
                ]
                  .filter(item => item.id == 16)[0]
                  ["list"].filter(item => item.id !== 17);
                break;
              // 捕鱼
              case 10005:
                this.gameListConfig[item.id].games = this.gameMap[item.id][
                  "list"
                ]
                  .filter(item => item.id == 193)[0]
                  ["list"].filter(item => item.id === 197)[0]["games"];
                break;
              //热门
              case 20002:
                this.gameListConfig[item.id].games = this.listContent;
                break;
            }
          }
        });
        this.$nextTick(() => {
          this.currIndex =
            this.$config.name === "cpxpj"
              ? this.cpxpjGameList[0]
              : this.gameList[0];
          localStorage["qpHomeGameList"] = JSON.stringify(this.gameListConfig);
          localStorage["qpHomeList"] = JSON.stringify(this.gameList);
        });
        setTimeout(() => {
          this.timer = true;
        }, 1000);
      }
    }
  },
  methods: {
    changeHandler(cur) {
      this.currIndex = cur;
    },
    imgUrl(url, item) {
      if (url.indexOf("kf") > 0) {
        return url;
      } else {
        if (!item || item === 20002) {
          return this.publicStaticHost + "/images/" + url;
        } else {
          return (
            this.publicStaticHost + "/images/" + url.replace("/m/", "/20000/")
          );
        }
      }
    },
    initNotice() {
      if (JSON.parse(localStorage.getItem("marqueeList"))) {
        this.noticeStr = JSON.parse(localStorage.getItem("marqueeList"));
      } else if (this.$store.state.main.marqueeList) {
        this.noticeStr = this.$store.state.main.marqueeList;
      }
      if (this.noticeStr && this.noticeStr.length > 0) {
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
      if (item.id === 99991) {
        if (this.user) {
          this.$router.push("/user/message?index=1");
        } else {
          this.$router.push("/admin/login");
        }
      } else if (item.type === "kefu") {
        this.inService();
      } else {
        this.onGameClick(item);
      }
    },
    linkClick(type) {
      if (this.user) {
        switch (type) {
          case "deposit":
            this.$router.push("/save");
            break;
          case "withraw":
            this.$router.push("/take?path=home");
            break;
          case "message":
            this.$router.push("/user/message?index=1");
            break;
          case "check":
            window.location.href =
              window.location.origin + "/static/cpxpj/html/active/qiandao/m/index.html";
            // this.onShowSignin();
            break;
               case "rain":
            window.location.href =
              window.location.origin + "/static/cpxpj/html/active/czjhb/m/index.html";
            break;
          case "housekeeper":
            window.location.href =
              window.location.origin + "/static/public/active/jgj/m/index.html";
            break;
          default:
            return;
        }
      } else {
        this.$router.push("/admin/login");
      }
    },
    moreClick(item) {
      if (item === 20002) {
        this.$router.push("/hotgame-more");
      } else if ([10001, 10002, 10003, 10004, 10005].includes(item)) {
        this.$router.push({
          path: "/home/type/" + item,
          params: {
            name: this.gameListConfig[item].title,
            id: item
          },
          query: {
            name: this.gameListConfig[item].title,
            id: item
          }
        });
      } else if (item === 10000) {
        this.onGameClick(this.gameListConfig[item].games[0]);
      }
    },
    onShowSignin() {
      if (this.isGet) {
        this.onShowAlert("今日已领取,请明日再来");
      } else {
        this.getSignin();
      }
    },
    getSignin() {
      this.$store
        .dispatch("user/onSignin", {
          type: "DailySignInList"
        })
        .then(res => {
          this.signData = res.data;
          if (this.signData.dailySignIn.gift_money_receive === "yes") {
            this.isGet = true;
            this.onShowAlert("今日已领取,请明日再来");
          } else {
            if (this.signData.weilingqu === "yes") {
              this.isOpen = true;
              this.signMoney = this.signData.dailySignIn.gift_money;
            }
            if (this.signData.msg_tankuang) {
              this.onShowAlert(this.signData.msg_tankuang);
            } else {
              this.showDialog = true;
              this.signMoney = this.signData.dailySignIn.gift_money;
            }
          }
        })
        .catch(() => {});
    },
    onOpenSign() {
      this.$store
        .dispatch("user/onSignin", {
          type: "open"
        })
        .then(res => {
          if (res.code === 200) {
            this.showAnimation = true;
            setTimeout(() => {
              this.isOpen = true;
            }, 1000);
          } else {
            this.onShowAlert(res.message);
          }
        })
        .catch(() => {});
    },
    onGetSign() {
      this.$store
        .dispatch("user/onSignin", {
          type: "lingqu",
          id: this.signData.dailySignIn.id
        })
        .then(res => {
          if (res.code === 200) {
            this.showDialog = false;
            this.isGet = true;
          } else {
            this.onShowAlert(res.message)
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    onShowAlert(msg) {
      this.signMsg = msg;
      this.signAlert = true;
    },
    hideAlert() {
      this.$refs.signAlertRef.hideTask();
      setTimeout(() => {
        this.signMsg = "";
      }, 400);
      if (this.signMsg === "请您绑定银行卡再来签到") {
        this.$router.push("/user/add-bank");
      } else if (this.signMsg === "请您充值后再来签到！") {
        this.$router.push("/save");
      }
    }
  }
};
</script>

<style lang="less" type="text/less" scoped>
@import "../../../../style/icon/home-icon-xpj";
.home-page {
  background: #7e010c;

  .notice-box {
    width: 7.25rem;
    height: 0.58rem;
    line-height: 0.58rem;
    font-size: 0.28rem;
    background-color: #7e010c;
    padding: 0 0.05rem;
    overflow: hidden;
    border-bottom: 0.02rem solid rgba(255, 255, 225, 0.14);
    .notice_icon {
      color: #ecbe4a;
      float: left;
      margin-left: 0.22rem;
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
  .notice-box-cpxpj {
    height: 0.58rem;
    line-height: 0.58rem;
    font-size: 0.28rem;
    background-color: #fbfbfb;
    padding: 0 0.05rem;
    overflow: hidden;
    border-bottom: 0.02rem solid rgba(255, 255, 225, 0.14);
    position: relative;
    .notice_icon {
      color: #fc8a44;
      float: left;
      margin-left: 0.22rem;
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
        color: #707070;
        display: inline-block;
      }
    }
    .labelBanner {
      padding: 0 0.12rem;
      height: 0.46rem;
      line-height: 0.46rem;
      position: absolute;
      right: 0.1rem;
      top: 50%;
      transform: translateY(-50%);
      background: #fec456;
      color: #fff;
      border-radius: 1.5rem;
      font-size: 0.2rem;
    }
  }

  .swiper-box {
    width: 100%;
    height: 2.01rem;
    padding: 0 0.24rem;
    background: #7e010c;
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
      transform: translate3d(0, 0, 0);
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
      transform: translate3d(0, 0, 0);
      height: 3.5rem;
      background-size: 100% 100%;
    }
  }

  .cpxpj-lottery-nav {
    background: #ffffff;
    width: 100%;
    min-height: 1.5rem;
    .cpxpj-nav-text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      padding-left: 9px;
      padding-right: 15px;
      span {
        font-size: 15px;
        color: #707070;
      }
      a {
        font-size: 16px;
        color: #151515;
        font-weight: bold;
      }
    }
    ul {
      .item {
        width: calc(100% / 6);
        margin-top: 7px;
        height: 0.9rem;
        float: left;
        position: relative;
      }
      .icon {
        display: block;
        margin: 0 auto;
        width: 43px;
        min-width: 43px;
        min-height: 40px;
        height: 40px;
      }
      .name {
        display: block;
        font-size: 0.26rem;
        width: 100%;
        color: #707070;
      }
    }
  }

  .blush {
    background: #530107;
    width: 100%;
    border-radius: 0.15rem 0.15rem 0 0;
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
        color: #ecbe4a;
      }
      span:last-of-type {
        height: 100%;
        color: #fff;
        font-size: 0.22rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #faf3e0;
      }
    }
    .blush-tab {
      background-color: #530107;
      padding-top: 0;

      /deep/ .van-tabs__wrap {
        height: 1.5rem;
        z-index: 999;
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
        color: #faf3e0;
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
          color: #faf3e0;
          display: block;
        }
      }
    }
  }

  .blush-cpxpj {
    background: #530107;
    width: 100%;
    border-radius: 0.15rem 0.15rem 0 0;
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
        color: #ecbe4a;
      }
      span:last-of-type {
        height: 100%;
        color: #fff;
        font-size: 0.22rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #faf3e0;
      }
    }
    .blush-tab {
      background-color: #530107;
      padding-top: 0;

      /deep/ .van-tabs__wrap {
        height: 1.5rem;
        z-index: 999;
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
        color: #faf3e0;
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
          color: #faf3e0;
          display: block;
        }
      }
    }
  }

  .cpxpj-games {
    background: #f5f5f9;

    .gametype-navbar {
      display: flex;
      white-space: nowrap;
      justify-content: space-between;
      padding: 0.2rem;

      .gametype-navbar-item {
        font-size: 14px;
        height: 44px;
        display: inline-flex;
        align-items: center;

        img {
          height: 100%;
        }
      }
    }
    ul {
      padding-left: 15px;
      padding-right: 15px;
      display: grid;
      justify-content: space-between;
      grid-template-columns: repeat(auto-fill, 170px);
      grid-gap: 5px;
      li {
        margin-top: 5px;
      }
      img {
        width: 100%;
        border-radius: 8px;
      }
    }

    ul.hotgame, .gameType-10005 {
      grid-template-columns: repeat(auto-fill, 110px);
    }
  }

  .footer {
    background: #530107;
    width: 100%;
    padding: 0.23rem 0.31rem 0.5rem;
    .bg {
      width: 6.88rem;
      height: 8.78rem;
      background: url("../../../../assets/img/home/blush/bg.png");
      background-size: 100% 100%;
    }
  }
  .game-swiper {
    transform: translate3d(0, 0, 0);
    overflow: hidden;
  }

  .list {
    width: 100%;
    background: #7e010c;
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
        color: #ecbe4a;
      }
      .msg-count {
        position: absolute;
        top: -0.18rem;
        left: 52%;
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
// 每日簽到
@keyframes openSign {
  20% {
    transform: translate(-50%, -50%) scale(1.4, 0.4);
  }
  40% {
    transform: translate(-50%, -50%) scale(1, 1.2);
    transform-origin: bottom;
  }
  70% {
    transform: translate(-50%, -50%) scale(1, 0.9);
    transform-origin: bottom;
  }
  100% {
    transform: translate(-50%, -50%) scale(1, 1);
  }
}

.dialog-box {
  width: 6.31rem;
  height: 6.25rem;
  position: fixed;
  left: 50%;
  top: 50%;
  color: #000000;
  text-align: center;
  transform: translate3d(-50%, -50%, 0) scale(0);
  transition: all 500ms;
  transform-origin: center;
  .content {
    .no-open {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 5.79rem;
      height: 5.17rem;
      background: url("../../../../assets/img/user/signIn/noOpen-bg.png")
        no-repeat center center / 100%;
      margin: 0.7rem auto 0;
      overflow: hidden;
      .open-btn {
        width: 1.55rem;
        height: 1.65rem;
        background: url("../../../../assets/img/user/signIn/open-btn.png")
          no-repeat center center / 100%;
        margin: 2.19rem 2.03rem 0 2.21rem;
      }
      &.open-sign {
        animation: openSign 1s cubic-bezier(0.72, 0.58, 0.93, 0.72) 1;
      }
    }
    .opened {
      position: relative;
      width: 6.31rem;
      height: 6.13rem;
      background: url("../../../../assets/img/user/signIn/opened-bg.png")
        no-repeat center center / 100%;
      margin: 0.1rem auto 0;
      overflow: hidden;
      .get-btn {
        width: 1.55rem;
        height: 1.65rem;
        background: url("../../../../assets/img/user/signIn/get-btn.png")
          no-repeat center center / 100%;
        margin: 0.15rem auto 0;
      }
      .sign-money {
        margin: 1.7rem auto 0;
        font-size: 0.67rem;
        background: linear-gradient(
          180deg,
          rgba(198, 41, 36, 1) 0%,
          rgba(241, 93, 21, 1) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
  .close {
    position: absolute;
    top: 0;
    right: 1rem;
    width: 0.71rem;
    height: 0.71rem;
    background: url("../../../../assets/img/user/signIn/close-btn.png")
      no-repeat center center / 100%;
  }
}
.show .dialog-box {
  transform: translate3d(-50%, -50%, 0) scale(1);
}
// 每日簽到 end
</style>
