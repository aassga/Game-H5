<template>
  <view-page full-box :noScroll="true" class="home-page">
    <home-header
      slot="header"
      @on-download="onDownload"
      @on-closeHeader="onCloseHeader"
      :style="{ transform: 'translateY(' + downTop + 'rem)' }"
      v-if="isShowHeader"
    ></home-header>
    <div
      slot="content"
      class="content"
      :style="{ transform: 'translateY(' + downTop + 'rem)' }"
    >
      <div class="topArea" ref="topArea">
        <div class="swiper-box">
          <swiper :options="swiperOption" ref="mySwiper" v-no-touch-move>
            <swiper-slide v-for="(item, i) in swiperList" :key="i">
              <div
                class="swiper-item"
                @click="swiperItemClick(item)"
                :style="'backgroundImage:url(' + item.img + ');'"
              ></div>
            </swiper-slide>
          </swiper>
        </div>
        <div class="notice-box" v-no-touch-move>
          <span class="notice-txt"
            >
            <img src="../../../../assets/img/home/aqvns/aqvns-marquee.png" alt="" />
          </span>
          <van-notice-bar
            class="notice-bar"
            v-if="noticeStr && noticeStr.length"
            @click="showMarquee"
          >
            <div class="notice" v-for="(item, i) in noticeStr" :key="i">
              {{ item.description }}
            </div>
          </van-notice-bar>
          <span class="labelBanner" @click="showMarquee"
            >
            <img src="../../../../assets/img/home/aqvns/aqvns-marquee-line.png" alt="" />
            0706.com</span
          >
        </div>
        <div class="h-queMenu" v-no-touch-move>
          <!-- <span class="login" v-if="$store.state.user.token" @click="onLogout">退出</span> -->
          <span class="login" v-if="$store.state.user.token">
            <p >
              <span v-if="$store.state.user.token" class="balance"
                ><i class="money"
                  >￥{{ userInfo ? userInfo.balance : "0.00" }}</i
                ><i
                  class="icon-refresh icon iconfont h5-icon-h-f"
                  @click="setBalanceToLocal"
                  :class="{ loading: loadingBalance }"
                ></i>
              </span>
            </p>
          </span>
          <span v-else>
            <router-link to="/admin/login"
              ><span class="login">登录/注册</span></router-link
            >
          </span>
          <ul class="h-qmul">
            <li @click="goPath('/save')">
              <p>
                <img src="../../../../assets/img/home/aqvns/aqvns-save.png" alt="" />
              </p>
              <p>存款</p>
            </li>
            <li @click="goPath('/take?path=home')">
              <p>
                <img src="../../../../assets/img/home/aqvns/aqvns-give.png" alt="" />
              </p>
              <p>取款</p>
            </li>
            <li @click="onShowSignin">
              <p>
                <img src="../../../../assets/img/home/aqvns/aqvns-check.png" alt="" />
              </p>
              <p>签到</p>
            </li>
            <li @click="goRedPacket()" class="aqvns-red-packet">
              <p>
                <img src="../../../../assets/img/home/aqvns/aqvns-red-packet.png" alt="" />
              </p>
              <p>抢红包</p>
            </li>
            <li @click="goJGJ()">
              <p>
                <img src="../../../../assets/img/home/aqvns/aqvns-vip.png" alt="" />
              </p>
              <p>VIP</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="gameArea" ref="gameArea">
        <div class="leftNav" v-if="showLeftNav">
          <cube-scroll-nav-bar
            direction="vertical"
            :current="currIndex"
            :labels="gameList"
            @change="changeCurrIndex"
            ref="leftNav"
          >
            <div slot-scope="props" v-if="gameListConfig[props.txt]">
              <img
                v-lazy="gameListConfig[props.txt].acImg"
                v-if="currIndex === props.txt"
                class="img"
              />
              <img v-lazy="gameListConfig[props.txt].img" v-else class="img" />
              <span class="name">{{ gameListConfig[props.txt].title }}</span>
            </div>
          </cube-scroll-nav-bar>
        </div>
        <div class="right-box">
          <div
            :class="['right-info', { noLeftAnimatiom: noLeftAnimatiom }]"
            ref="rightInfo"
          >
            <div v-for="(item, i) in gameList" :key="i">
              <Scroll-item
                @changeCurrIndex="changeCurrIndex"
                :gameList="gameListConfig[item]"
                :currIndex="currIndex"
                :index="i"
                :gameAreaH="gameAreaH"
                :gameListArr="gameList"
                @changeShowBackTop="changeShowBackTop"
                ref="scrollItem"
              ></Scroll-item>
            </div>
          </div>
        </div>
      </div>
      <img
        src="../../../../assets/img/home/qp/qp-back-top.svg"
        v-if="showBackTop && $config.name === 'aqvns'"
        style="width: 0.6rem; height: 0.6rem"
        class="back-top"
        @click="changeCurrIndex(gameList[currIndex], null, true)"
      />
      <img
        src="../../../../assets/img/home/qp/back-top.png"
        v-else-if="showBackTop && $config.name !== 'aqvns'"
        class="back-top"
        @click="changeCurrIndex(gameList[currIndex], null, true)"
      />
    </div>
    <div
      :style="{ height: $store.state.main.tabHeight + 'px' }"
      style="width: 100%"
      slot="footer"
    ></div>
    <div slot="static">
      <slot name="NoticeDialog"></slot>
      <slot name="marqueeDialog"></slot>
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
import { ScrollNavBar } from "cube-ui";
import ScrollItem from "./scroll";
import homeMixin from "../mixin";
import Header from "./Header";
export default {
  name: "Index",
  components: {
    HomeHeader: Header,
    swiper,
    swiperSlide,
    ScrollItem,
    CubeScrollNavBar: ScrollNavBar,
  },
  mixins: [homeMixin],
  data() {
    return {
      isShowHeader: true,
      isShowBottom: true,
      isShow: true,
      isShow1: true,
      downTop: 0,
      noticeStr: [],
      intervalId: null,
      url:
        window.location.origin +
        "/static/jltx/html/active/hongbao/m/index.html",
      swiperOption: {
        init: false,
        autoplay: {
          disableOnInteraction: false
        },
        observer: true,
        observeParents: true,
        loop: true
      },
      currIndex: 0,
      gameListId: [20002, 10004, 10001, 10005, 10003, 10000, 10002],
      betnewGameListId: [20002, 10004, 10001, 10005, 10003, 10000, 10002], // 体育-热门-电子-棋牌-真人-捕鱼-彩票
      gameList: [],
      betnewGameList: [],
      gameListConfig: {
        20002: {
          title: "热门游戏",
          type: "fish",
          id: "20002",
          img: require("../../../../assets/img/home/aqvns/hotGameImg.png"),
          acImg: require("../../../../assets/img/home/aqvns/ahotGameImg.png"),
          games: [],
        },
        10005: {
          title: "捕鱼游戏",
          type: "fish",
          id: "10005",
          img: require("../../../../assets/img/home/aqvns/byGameImg.png"),
          acImg: require("../../../../assets/img/home/aqvns/abyGameImg.png"),
          games: [],
        },
        10001: {
          title: "电子游艺",
          type: "slot",
          id: "10001",
          img: require("../../../../assets/img/home/aqvns/hotGameImg.png"),
          acImg: require("../../../../assets/img/home/aqvns/ahotGameImg.png"),
          games: [],
          class: "type2",
        },
        10004: {
          title: "棋牌游戏",
          type: "chess",
          id: "10004",
          img: require("../../../../assets/img/home/aqvns/qpGameImg.png"),
          acImg: require("../../../../assets/img/home/aqvns/aqpGameImg.png"),
          games: [],
          class :"type1",
        },
        10003: {
          title: "真人娱乐",
          type: "live",
          id: "10003",
          img: require("../../../../assets/img/home/aqvns/zrGameImg.png"),
          acImg: require("../../../../assets/img/home/aqvns/azrGameImg.png"),
          games: [],
          class: "type2",
        },
        10002: {
          title: "体育赛事",
          type: "sport",
          id: "10002",
          img: require("../../../../assets/img/home/aqvns/tyGameImg.png"),
          acImg: require("../../../../assets/img/home/aqvns/atyGameImg.png"),
          games: [],
          class: "type2",
        },
        10000: {
          title: "彩票游戏",
          type: "lottery",
          id: "10000",
          img: require("../../../../assets/img/home/aqvns/lotteryImg.png"),
          acImg: require("../../../../assets/img/home/aqvns/alotteryImg.png"),
          games: [],
          class: "type1",
        },
      },
      showBackTop: false,
      gameAreaH: 0,
      loadingBalance: false,
      showLeftNav: false,
      isMounted: false,
      noLeftAnimatiom: false,
      signAlert: false,
      signMsg: "",
    };
  },
  created() {
    this.getBanner()
    if (
      localStorage["qpHomeGameList"] &&
      localStorage["qpHomeList"] &&
      !JSON.parse(localStorage["qpHomeGameList"])[30001] &&
      JSON.parse(localStorage["qpHomeList"].indexOf(30001)) < 0
    ) {
      this.gameListConfig = JSON.parse(localStorage["qpHomeGameList"]);
      this.gameList = JSON.parse(localStorage["qpHomeList"]);
      this.betnewGameList = JSON.parse(localStorage["qpHomeList"]);
      this.$nextTick(() => {
        this.setScrollHeight();
        this.currIndex = this.gameList[0];
      });
    }
    this.getHomeData(null,'10000|10001|10002|10003|10004|10005|20001|20002')
  },
  activated() {
    this.$nextTick(() => {
      this.currIndex = this.gameList[0];
    });
  },
  watch: {
    gameMap() {
      let obj = {
        id: 20002,
      };
      this.listTop.unshift(obj);
      this.gameList = [];
      this.betnewGameList = [];
      this.betnewGameListId.forEach((item) => {
        this.betnewGameList.push(item);
      });
      // 為了改變左側遊戲菜單順序, 所以會在這邊先做 this.gameList.push(item)
      this.gameListId.forEach((item) => {
        this.gameList.push(item);
      });
      this.listTop.forEach((item) => {
        if (this.gameListId.indexOf(item.id) >= 0) {
          switch (item.id) {
            // 彩票
            case 10000:
              this.gameListConfig[item.id].games = this.hots;
              break;
            // 电子
            case 10001:
              this.gameListConfig[item.id].games = this.gameMap[item.id]["list"]
                .filter((item) => item.id == 67)[0]
                ["list"].filter((item) => item.id !== 74);
              break;
            // 体育 真人
            case 10002:
            case 10003:
              this.gameListConfig[item.id].games = this.gameMap[item.id];
              break;
            // 棋牌
            case 10004:
              this.gameListConfig[item.id].games = this.gameMap[item.id]["list"]
                .filter((item) => item.id == 16)[0]
                ["list"].filter((item) => item.id !== 17);
              break;
            // 捕鱼
            case 10005:
              this.gameListConfig[item.id].games = this.gameMap[item.id]["list"]
                .filter((item) => item.id == 193)[0]
                ["list"].filter((item) => item.id === 197)[0]["games"];
              break;
            //热门
            case 20002:
              this.gameListConfig[item.id].games = this.listContent;
              break;
          }
        }
      });
      this.$nextTick(() => {
        this.setScrollHeight();
        this.currIndex = this.gameList[0];
        localStorage["qpHomeGameList"] = JSON.stringify(this.gameListConfig);
        localStorage["qpHomeList"] = JSON.stringify(this.gameList);
        if (this.isMounted) {
          this.homeGameType();
        }
      });
    },
    swiperList (newVal) {
      if (newVal.length) {
        this.$nextTick(() => {
          if (this.$refs.mySwiper) {
            this.$refs.mySwiper.swiper.init()
          }
        })
      }
    }  
  },
  mounted() {
    if (localStorage["qp-home-scroll-height"]) {
      this.gameAreaH = Number(localStorage["qp-home-scroll-height"]);
      this.$refs.gameArea &&
        (this.$refs.gameArea.style.height = this.gameAreaH + "px");
      this.$refs.rightInfo &&
        (this.$refs.rightInfo.style.height =
          this.gameAreaH * this.gameList.length + "px");
      this.showLeftNav = true;
      this.$refs.leftNav && this.$refs.leftNav.refresh();
    }
    //解决偶尔获取不到localStorage数据问题，导致公告空白
    this.intervalId = window.setInterval(() => {
      this.initNotice();
    }, 100);
    setTimeout(() => {
      this.setScrollHeight();
    }, 300);
    window.addEventListener("resize", () => {
      this.setScrollHeight();
    });
    setTimeout(() => {
      this.isMounted = true;
      if (this.gameList && this.gameList.length) {
        this.homeGameType();
      }
    }, 400);
  },
  computed:{
    userLevel() {
      if (this.personalMode === "no") {
        if (localStorage["jinguanjiaInfo"]) {
          this.$store.state.agency.jinguanjiaInfo = JSON.parse(
            localStorage["jinguanjiaInfo"]
          );
          return this.$store.state.agency.jinguanjiaInfo["level"];
        } else {
          return "0";
        }
      } else {
        return this.userInfo ? this.userInfo["levelId"] : "1";
      }
    },
  },
  methods: {
    onShowAlert(msg) {
      this.signMsg = msg;
      this.signAlert = true;
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
          type: "DailySignInList",
        })
        .then((res) => {
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
    hideAlert() {
      this.$refs.signAlertRef.hideTask();
      setTimeout(() => {
        this.signMsg = "";
      }, 400);
      if (this.signMsg === "请您绑定银行卡再来签到") {
        this.$router.push("/take?index=2");
      } else if (this.signMsg === "请您充值后再来签到！") {
        this.$router.push("/save");
      }
    },
    onCloseHeader() {
      this.isShowHeader = false;
    },
    taskAward() {
      if (this.isApp)
        window.location.href =
          window.location.origin +
          "/static/public/active/task/m/index.html" +
          "?app=app";
      else
        window.location.href =
          window.location.origin + "/static/public/active/task/m/index.html";
    },
    onMessage() {
      if (this.userInfo && JSON.stringify(this.userInfo) !== "{}") {
        this.$router.push("/user/message?index=1");
      } else {
        this.$router.push("/admin/login");
      }
    },
    homeGameType() {
      let homeGameTypeNum = Number(this.$route.query.homeGameType);
      if (homeGameTypeNum && this.gameList.indexOf(homeGameTypeNum) >= 0) {
        this.noLeftAnimatiom = true;
        this.currIndex = Number(homeGameTypeNum);
        this.changeCurrIndex();
        setTimeout(() => {
          this.noLeftAnimatiom = false;
        }, 300);
      }
    },
    changeShowBackTop(bool) {
      this.showBackTop = bool;
    },
    goPath(path) {
      if (!this.$store.state.user.token) {
        this.$router.push("/admin/login");
      } else {
        this.$router.push(path);
      }
    },
    goJGJ() {
      window.location.href =
        window.location.origin + "/static/public/active/jgj/m/index.html";
    },
    goRedPacket() {
      window.location.href =
        window.location.origin + "/static/aqvns/html/active/czjhb/m/index.html";
    },
    //关闭上面飘窗
    closeTop() {
      this.isShow = false;
      this.downTop = 0;
      this.setScrollHeight();
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
    showMarquee() {
      this.$store.commit("main/marqueeDialog", true);
    },
    changeCurrIndex(index, direction) {
      this.$refs.scrollItem[this.gameList.indexOf(this.currIndex)].scrollTop();
      let _index = index
        ? this.gameList.indexOf(index)
        : this.gameList.indexOf(this.currIndex);
      if (direction) {
        if (direction === "up" && _index > 0) {
          _index -= 1;
          this.currIndex = this.gameList[_index];
        } else if (direction === "down" && _index < this.gameList.length - 1) {
          _index += 1;
          this.currIndex = this.gameList[_index];
        }
      } else {
        this.currIndex = this.gameList[_index];
      }

      this.$refs.scrollItem[_index].scrollTop();
      this.showBackTop = false;
      this.$refs.scrollItem[_index].scrollTop();
      let righttranslateY = -_index * this.gameAreaH;
      this.$refs.rightInfo.style.transform =
        "translateY(" + righttranslateY + "px)";
    },
    setScrollHeight() {
      let clientH =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      if (this.$refs.topArea) {
        this.gameAreaH = clientH - this.$refs.topArea.offsetHeight - this.rem * 2.1;
        this.$refs.gameArea &&
          (this.$refs.gameArea.style.height = this.gameAreaH + "px");
        this.$refs.rightInfo &&
          (this.$refs.rightInfo.style.height =
            this.gameAreaH * this.gameList.length + "px");
        this.showLeftNav = true;
        this.$refs.leftNav && this.$refs.leftNav.refresh();
      }
    },
    setBalanceToLocal() {
      if (!this.loadingBalance) {
        this.loadingBalance = true;
        this.$store
          .dispatch("user/manualBalance")
          .then((res) => {
            if (res.code === 200) {
              localStorage["userInfo"] = JSON.stringify(this.userInfo);
            } else {
              this.toastText(res.message, "top");
            }
            setTimeout(() => {
              this.loadingBalance = false;
            }, 5000);
          })
          .catch((err) => {
            setTimeout(() => {
              this.loadingBalance = false;
            }, 5000);
          });
      }
    },
    onClose() {
      this.isShowBottom = false;
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.xf_bottom {
  width: 100%;
  height: 0.99rem;
  display: flex;
  align-items: center;
  background-size: 100% 100%;
  position: fixed;
  bottom: 58px;
  background-color: rgba(0, 0, 0, 0.4);
  span {
    height: 100%;
    display: flex;
    align-items: center;
    &:first-child {
      font-size: 0.3rem;
      color: #fff;
      margin-left: 0.95rem;
      i {
        font-size: 0.36rem;
        line-height: 0;
        color: #ff2403;
      }
    }
    &:nth-child(3) {
      margin-left: 0.46rem;
      img {
        width: 1.6rem;
        height: 0.58rem;
      }
    }
    &:last-child {
      margin-left: 0.1rem;
      img {
        width: 0.32rem;
        height: 0.32rem;
      }
    }
  }
  .top_logo {
    position: absolute;
    left: 0.1rem;
    top: 0.1rem;
    width: 0.8rem;
  }
  &.aqvns_bottom {
    span {
      &:first-child {
        color: #fffe22;
        font-weight: bold;
      }
    }
  }
}
.h-queMenu {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0 auto;
  // height: 1.47rem;
  padding: 0.23rem 0 0.22rem 0;
  // background: linear-gradient(180deg, #171717 0%, #0B0B0B 100%);
  border-radius: 0.16rem 0.16rem 0 0;
  .login {
    width: 7em;
    display: block;
    line-height: 2.5em;
    font-size: 0.33rem;
    color: #a58762;
    font-weight: 600;
    .money{
      padding-right: 0.2rem;
    }
  }
  .h-qmlogin {
    width: 7em;
    padding-left: 0.2rem;
    p {
      &.h-qmtit {
        font-size: 0.34rem;
        font-weight: 500;
        margin-bottom: 0.1rem;
        color: rgb(165, 135, 98);
        text-align: left;
        height: 0.42rem;
        line-height: 0.42rem;
        margin-left: 0.15rem;
        padding-top: 0.07rem;
        .balance {
          margin-left: -0.05rem;
          overflow: hidden;
          .money {
            display: block;
            float: left;
            max-width: 2rem;
            margin-left: -0.07rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .icon-refresh {
            display: block;
            float: left;
            margin-left: 0.1rem;
            transform-origin: 50%;
            &.loading {
              -webkit-transform: rotate(360deg);
              transform: rotate(360deg);
              -webkit-transition: -webkit-transform 1s linear;
              transition: transform 1s linear;
            }
          }
        }
        span {
          font-size: 0.34rem;
        }
      }
      &.h-qmrem {
        font-size: 0.26rem;
        color: #a1a1b2;
        display: flex;
        align-items: center;
        width: 100%;
        padding-left: 0.15rem;
        span {
          line-height: 0.34rem;
          .user-leave {
            display: inline;
            color: #eec04c;
            padding-left: 0.08rem;
            .icon {
              font-size: 0.4rem;
              vertical-align: middle;
            }
            .name {
              margin-left: 0.05rem;
              font-size: 0.28rem;
            }
          }
        }
      }
    }
    &.fhcp-h-qmlogin {
      width: 1.4rem;
      padding-right: 0.5rem;
      box-sizing: content-box;
      .h-qmtit {
        text-align: center;
        img {
          width: 0.56rem;
        }
      }
      .h-qmrem {
        position: relative;
        display: block;
        color: #fff;
        font-size: 0.32rem;
        img {
          width: 0.08rem;
          vertical-align: middle;
          margin-left: 0.1rem;
        }
        .msg-count {
          left: 75%;
          top: -0.25rem;
        }
      }
    }
  }
  .h-qmul {
    flex: 1 0 auto;
    display: flex;
    // justify-content: space-between;
    li {
      width: 1rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      cursor: pointer;
      p {
        &:first-child {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 0.54rem;
            height: 0.46rem;
          }
        }
        &:last-child {
          width: 100%;
          text-align: center;
          color: rgb(153, 159, 188);
          font-size: 0.24rem;
          line-height: 0.4rem;
        }
      }
    }
    .aqvns-red-packet{
      /deep/img{
        width: 0.35rem !important;
        height: 0.5rem !important;
      }
    }
  }
}
.h-queMenu2 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  margin: 0 auto 0.18rem;
  height: 1.47rem;
  padding: 0 0 0.22rem 0;
  .h-queSub {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .h-qmlogin {
    width: 2.8rem;
    padding-left: 0.24rem;
    p {
      &.h-qmtit {
        font-size: 0.34rem;
        font-weight: 500;
        margin-bottom: 0.1rem;
        color: #fff;
        text-align: left;
        height: 0.42rem;
        line-height: 0.42rem;
        margin-left: 0.15rem;
        padding-top: 0.07rem;
        .balance {
          margin-left: -0.05rem;
          overflow: hidden;
          .money {
            display: block;
            float: left;
            max-width: 2rem;
            margin-left: -0.07rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .icon-refresh {
            display: block;
            float: left;
            margin-left: 0.1rem;
            transform-origin: 50%;
            &.loading {
              -webkit-transform: rotate(360deg);
              transform: rotate(360deg);
              -webkit-transition: -webkit-transform 1s linear;
              transition: transform 1s linear;
            }
          }
        }
        span {
          font-size: 0.34rem;
        }
      }
      &.h-qmrem {
        font-size: 0.26rem;
        color: #a1a1b2;
        display: flex;
        align-items: center;
        width: 100%;
        padding-left: 0.15rem;
        span {
          line-height: 0.34rem;
          .user-leave {
            display: inline;
            color: #eec04c;
            padding-left: 0.08rem;
            .icon {
              font-size: 0.4rem;
              vertical-align: middle;
            }
            .name {
              margin-left: 0.05rem;
              font-size: 0.28rem;
            }
          }
        }
      }
    }
    &.fhcp-h-qmlogin {
      width: 1.4rem;
      padding-right: 0.5rem;
      box-sizing: content-box;
      .h-qmtit {
        text-align: center;
        img {
          width: 0.56rem;
        }
      }
      .h-qmrem {
        position: relative;
        display: block;
        color: #fff;
        font-size: 0.32rem;
        img {
          width: 0.08rem;
          vertical-align: middle;
          margin-left: 0.1rem;
        }
        .msg-count {
          left: 75%;
          top: -0.25rem;
        }
      }
    }
  }
  .h-qmul {
    flex: 1 0 auto;
    display: flex;
    justify-content: space-between;
    li {
      width: 1.1rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      cursor: pointer;
      position: relative;
      p {
        &:first-child {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 0.54rem;
            height: 0.46rem;
          }
        }
        &:last-child {
          width: 100%;
          text-align: center;
          color: #fff;
          font-size: 0.24rem;
          line-height: 0.22rem;
          margin-top: 0.1rem;
        }
      }
    }

    .msg-count-betnew {
      height: 0.2rem;
      width: 0.2rem;
      line-height: 0.2rem;
      text-align: center;
      border-radius: 0.28rem;
      background: #ff5c5c;
      font-size: 0.2rem;
      position: absolute;
      right: 0.25rem;
      top: 0rem;
    }
  }
}
.home-header {
  transition: all 0.8s;
  position: relative;
}
.down-top {
  width: 100%;
  height: 0.84rem;
  display: flex;
  align-items: center;
  background-color: #313131;
  position: fixed;
  z-index: 100;
  .left-logo {
    margin: 0 0.12rem;
    width: 0.32rem;
    height: 0.32rem;
  }
  .center {
    font-size: 0.28rem;
    color: #fff;
    display: flex;
    align-items: center;
    height: 100%;
    width: 5.3rem;
    margin: 0;
    .money-span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    img {
      width: 0.58rem;
      height: 0.58rem;
      margin-right: 0.1rem;
      float: left;
    }
    .txt-area {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: left;
      .top-txt {
        font-size: 0.3rem;
      }
      .bot-txt {
        font-size: 0.26rem;
      }
    }
  }
  .right-img {
    width: 1.54rem;
    height: 0.47rem;
  }
}
.home-page {
  background: #ffffff;
  &.newqp-home-page {
    background-color: #000000;
    .swiper-box {
      height: 2.44rem;
      .swiper-item {
        height: 2.44rem;
      }
    }
    .h-queMenu {
      height: 1.05rem;
      padding: 0.08rem 0 0 0;
      margin: 0.04rem auto 0.18rem;
    }
  }
  &.betnew-home-page {
    background-color: #14805e;
    .labelBanner {
      padding: 0 0.12rem !important;
      height: 0.46rem !important;
      line-height: 0.46rem !important;
    }
  }
  &.fhcp-home-page {
    .swiper-box {
      height: 2.62rem;
      .swiper-item {
        height: 2.62rem;
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
  .swiper-box {
    height: 2.62rem;
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
    .swiper-item {
      width: 100%;
      display: block;
      transform: translate3d(0, 0, 0);
      height: 3rem;
      background-size: 100% 100%;
    }
  }
  .middle-menu {
    width: 100%;
    height: 0.8rem;
    display: flex;
    justify-content: space-around;
    // background: #282828;
    a,
    .message {
      flex: 1;
      margin: 0.2rem 0;
      border-right: 0.02rem solid #444;
      height: 0.4rem;
      line-height: 0.4rem;
      color: rgb(165, 135, 98);
      font-family: STHeiti, Microsoft YaHei, \\5fae\8f6f\96c5\9ed1, SimSun,
        \\5b8b\4f53, arial;
      font-size: 0.26rem;
      background-color: transparent;
      text-decoration: none;
      &:last-child {
        border-right: 0;
      }
    }
    .message {
      position: relative;
      img {
        width: 0.34rem;
        vertical-align: middle;
      }
      .msg-count {
        left: 65%;
        top: -0.2rem;
      }
    }
  }
  .notice-box {
    width: 6.9rem;
    height: 0.56rem;
    line-height: 0.56rem;
    font-size: 0.28rem;
    position: relative;
    margin: 0.1rem auto 0 auto;
    border-radius: 0.5em;
    box-shadow: rgba(0, 0, 0, 0.2) 0 0 0.35em 0px inset;
    .notice-txt {
      position: absolute;
      left: 1em;
      top: 0.3em;
      color: #000000;
      font-size: 0.25rem;
      img {
        height: 1.5em;
      }
    }
    .notice-bar {
      width: 4.4rem;
      height: 0.56rem;
      line-height: 0.6rem;
      font-size: 0.26rem;
      padding: 0 0 0 0.75rem;
      background-color: transparent;
      /deep/ .van-notice-bar__wrap {
        height: 100% !important;
        .van-notice-bar__content {
          white-space: nowrap;
          width: auto;
          font-size: 0.24rem;
          .notice {
            display: inline-block;
            margin-right: 0.3rem;
            color: #000000;
          }
        }
      }
    }
    .labelBanner {
      position: absolute;
      right: 0.1rem;
      top: 0;
      height: 0.56rem;
      padding: 0 0.2rem;
      color: #000000;
      border-radius: 1.5rem;
      font-size: 0.3rem;
      display: flex;
      align-items: center;
      font-weight: 600;
      img {
        height: 0.4rem;
        padding-right: 0.07rem;
        background-color: #FFFFFF;
      }
    }
  }
  .gameArea {
    width: 6.9rem;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    .leftNav {
      width: 1.82rem;
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      /deep/ .cube-scroll-nav-bar {
        background-color: transparent;
        .cube-scroll-wrapper {
          position: absolute;
          left: 0;
          overflow: visible;
          width: 100%;
          .cube-scroll-list-wrapper {
            overflow: visible !important;
            .cube-scroll-nav-bar-item {
              position: relative;
              padding: 0;
              width: 100%;
              height: 0.8rem;
              line-height: 0.8rem;
              text-align: left;
              margin-top: 0.06rem;
              text-align: center;
              border-radius: 6px;
              img {
                width: 0.38rem;
                height: 0.38rem;
                vertical-align: text-top;
              }
              .name {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                color: rgb(155, 161, 189);
                font-family: STHeiti, Microsoft YaHei, \\5fae\8f6f\96c5\9ed1,
                  SimSun, \\5b8b\4f53, arial;
                font-size: 0.25rem;
                padding-left: 0.06rem;
              }
              &.cube-scroll-nav-bar-item_active {
                background: linear-gradient(
                  90deg,
                  rgb(225, 200, 176),
                  rgb(191, 153, 118)
                ) !important;
                box-shadow: 0 0.1em 0.5em #0000005e;
                .name {
                  color: rgb(255, 255, 255);
                }
              }
              &:first-child {
                margin-top: 0;
              }
            }
          }
        }
      }
    }
    .leftNavBetnew {
      width: 1.5rem !important;
      height: 101%;
      /deep/ .cube-scroll-nav-bar {
        background-color: transparent;
        .cube-scroll-wrapper {
          position: absolute;
          left: 0;
          overflow: visible;
          width: 100%;
          .cube-scroll-list-wrapper {
            overflow: visible !important;
            .cube-scroll-nav-bar-items {
              padding-bottom: 0.1rem;
            }
            .cube-scroll-nav-bar-item {
              border-radius: 0.25rem;
              background-image: linear-gradient(
                180deg,
                #069c72,
                #058d67,
                #047e5c,
                #046f51,
                #046147
              );
              box-shadow: 1px 1px 3px rgb(0 0 0 / 16%);
              border: 1px solid #058d67;
              background-size: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 1.3rem;
              height: 0.96rem;
              margin: 0 0 0.15rem 0;
              position: relative;
              padding: 0;

              img {
                width: 0.38rem;
                height: 0.38rem;
                vertical-align: text-top;
              }
              .name {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                color: #fff;
                font-family: STHeiti, Microsoft YaHei, \\5fae\8f6f\96c5\9ed1,
                  SimSun, \\5b8b\4f53, arial;
                font-size: 0.3rem;
                padding-left: 0.06rem;
              }
              &.cube-scroll-nav-bar-item_active {
                background-image: linear-gradient(
                  180deg,
                  #767676,
                  #646464,
                  #535353,
                  #434343,
                  #333
                ) !important;
                border: 1px solid #646464;
              }
              &:first-child {
                margin-top: 0;
              }
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
      .right-info {
        position: relative;
        transform: translateY(0%);
        transition: all 0.3s ease-out;
        overflow-x: hidden;
        .scrollArea {
          overflow: hidden;
        }
        &.noLeftAnimatiom {
          transition: all 0s ease-out;
        }
      }
    }
  }
  .gameAreaBetnew {
    width: 7.1rem !important;
  }
  .content {
    transition: all 0.8s;
    &.newqp-content {
      .notice-box {
        width: 7.28rem !important;
        .notice-txt {
          color: #989898;
          font-size: 0.28rem;
        }
        .notice {
          font-size: 0.26rem;
          color: #989898;
        }
      }
      .gameArea {
        width: 7.4rem !important;
        margin: 0 !important;
        .leftNav {
          width: 1.7rem !important;
          /deep/ .cube-scroll-nav-bar {
            background: linear-gradient(
              180deg,
              #171717 0%,
              #0b0b0b 100%
            ) !important;
            .cube-scroll-nav-bar-item {
              margin-top: 0rem !important;
              border-bottom: 0.02rem solid #2b2b2b;
              background: transparent !important;
              height: 0.88rem;
              line-height: 0.88rem;
              &:last-child {
                border: none;
              }
              &:first-child {
                margin-top: 0 !important;
              }
              .name {
                font-family: Microsoft YaHei !important;
                font-size: 0.3rem;
                color: #f2f3f4 !important;
              }
              &.cube-scroll-nav-bar-item_active {
                background: linear-gradient(
                  180deg,
                  #f2ed76 0%,
                  #f0ca4c 100%
                ) !important;
                .name {
                  color: #000000 !important;
                }
              }
            }
          }
        }
        .right-box {
          margin-left: 0.144rem;
        }
      }
    }
  }
}
.sign-content {
  font-size: 0.32rem;
  color: #000;
  max-height: 60vh;
  overflow-y: auto;
  font-weight: 500;
  line-height: 0.4rem;
  text-align: center;
  word-wrap: break-word;
  padding: 0.48rem 0.6rem !important;
}
</style>
