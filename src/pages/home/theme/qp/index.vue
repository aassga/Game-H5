<template>
  <view-page
    full-box
    :noScroll="true"
    :class="[
      'home-page',
      {
        'newqp-home-page':
          $config.newQP || $config.name === 'fhcp' || $config.name === 'xpj83',
      },
      { 'fhcp-home-page': $config.name === 'fhcp' || $config.name === 'xpj83' },
      { 'betnew-home-page': $config.name === 'betnew' },
    ]"
  >
    <div
      slot="header"
      class="down-top"
      v-if="isShow && !$config.newQP && ['737qp'].includes($config.name)"
    >
      <img
        src="@/assets/img/login/dowm/p_close.png"
        @click="closeTop"
        class="left-logo"
      />
      <div class="center">
        <img :src="require('@site/assets/img/admin/top_logo.png')" alt="" />
        <span v-html="money" class="money-span"></span>
      </div>
      <img
        src="@/assets/img/login/dowm/p_top_btn.png"
        class="right-img"
        @click="onDownload"
      />
    </div>
    <home-header
      slot="header"
      @on-download="onDownload"
      @on-closeHeader="onCloseHeader"
      :style="{ transform: 'translateY(' + downTop + 'rem)' }"
      v-if="isShowHeader"
    ></home-header>
    <div
      slot="content"
      :class="[
        'content',
        {
          'newqp-content':
            $config.newQP ||
            $config.name === 'fhcp' ||
            $config.name === 'xpj83'
        },
      ]"
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

        <div v-if="$config.name === 'js85'">
          <div class="js85-box">
            <div
              class="notice-box"
              v-no-touch-move
            >
              <span class="notice-txt">公告</span>
              <van-notice-bar
                class="notice-bar"
                @click="showMarquee"
              >
                <div class="notice" v-for="(item, i) in noticeStr" :key="i">
                  {{ item.description }}
                </div>
              </van-notice-bar>
            </div>
            <div
              class="middle-menu"
              v-no-touch-move
              style="background: #000000;"
            >
              <span 
                class="message"
                @click="$router.push('/activity')"
              >
                <img src="../../../../assets/img/home/qp/js85-activity.png" alt="" />
                优惠活动
              </span>
              <span
                class="message"
                @click="onMessage"
              > 
                <img src="../../../../assets/img/home/qp/js85-message.png" alt="" />
                站内信
                <i
                  class="msg-count"
                  v-show="userInfo && $store.state.user.msgCount['allUnReadCount']"
                >
                  {{ $store.state.user.msgCount["allUnReadCount"] }}
                </i>
              </span>
              <a
                class="etnqp-vip"
                @click="goJGJ()"
              >
                <img
                  class="icon"
                  src="../../../../assets/img/home/qp/js85-vip.png"
                  alt
                />
                VIP
              </a>
            </div>
          </div>
          <div class="js85-games-type-nav">
            <div class="gametype-navbar">
              <ul class="gametype-navbar-item">
                <li
                  v-for="(item, index) in js85GameList"
                  :key="index"
                  :class="currIndex === item ? 'active' : ''"
                  @click="changeHandler(item)"
                >
                  <p>
                    <img
                      :src="
                        currIndex === item
                          ? gameListConfig[item].js85AcImg
                          : gameListConfig[item].js85Img
                      "
                    />
                  </p>
                  <p>{{ gameListConfig[item].title.slice(0, 2) }}</p>
                </li>
              </ul>
            </div>  
          </div>
        </div>

        <div v-else>
          <div
            class="middle-menu"
            v-no-touch-move
            v-if="
              !$config.newQP &&
              $config.name !== 'fhcp' &&
              $config.name !== 'xpj83' &&
              $config.name !== 'betnew'
            "
          >
            <!-- <router-link to="/activity/content/?id=4448&app=" v-if="['aqvns'].includes($config.name)">亏损救援</router-link> -->
            <router-link to="/activity">优惠活动</router-link>

            <router-link
              to="/activity/content/?id=4787&app="
              v-if="['aqvns'].includes($config.name)"
              >抽奖保时捷</router-link
            >
            <span
              v-else-if="
                ['dqr', 'fhcp', 'hty', '839qp', 'xpj83'].includes($config.name)
              "
              class="message"
              @click="onMessage"
            >
              站内信
              <img src="../../../../assets/img/home/qp/message.png" alt="" />
              <i
                class="msg-count"
                v-show="userInfo && $store.state.user.msgCount['allUnReadCount']"
              >
                {{ $store.state.user.msgCount["allUnReadCount"] }}
              </i>
            </span>
            <a href="javascript:void(0)" @click="goPath('/user/info')" v-else
              >个人信息</a
            >

            <router-link
              to="/activity/content/?id=4448&app="
              v-if="['aqvns'].includes($config.name)"
              >亏损救援</router-link
            >
            <a
              href="javascript:void(0)"
              @click="inService()"
              v-show="!['839qp', 'hty', 'dqr'].includes($config.name)"
              v-else
              >在线客服</a
            >
            <a
              class="etnqp-vip"
              @click="goJGJ()"
              v-if="['839qp', 'hty', 'dqr'].includes($config.name)"
            >
              <img
                class="icon"
                src="../../../../assets/img/home/qp/vip.png"
                alt
              />
              VIP
            </a>
          </div>
          <div
            class="notice-box"
            v-no-touch-move
            v-if="$config.name !== 'betnew'"
          >
            <span class="notice-txt">公告</span>
            <van-notice-bar
              class="notice-bar"
              v-if="noticeStr && noticeStr.length"
              @click="showMarquee"
            >
              <div class="notice" v-for="(item, i) in noticeStr" :key="i">
                {{ item.description }}
              </div>
            </van-notice-bar>
          </div>
          <div
            class="h-queMenu"
            v-if="
              $config.newQP || $config.name === 'fhcp' || $config.name === 'xpj83'
            "
            v-no-touch-move
          >
            <div
              class="h-qmlogin"
              v-if="$config.name !== 'fhcp' && $config.name !== 'xpj83'"
            >
              <p class="h-qmtit">
                <span v-if="$store.state.user.token" class="balance"
                  ><i class="money"
                    >￥{{ userInfo ? userInfo.balance : "0.00" }}</i
                  ><i
                    class="icon-refresh icon iconfont h5-icon-h-f"
                    @click="setBalanceToLocal"
                    :class="{ loading: loadingBalance }"
                  ></i>
                </span>
                <span v-else @click="onLogin()">注册/登录</span>
              </p>
              <p class="h-qmrem">
                <span v-if="$store.state.user.token">
                  <span class="user-name">{{
                    userInfo ? userInfo["userName"] : ""
                  }}</span>
                  <p class="user-leave">
                    <span
                      :class="['icon', 'iconfont', `h5-icon-level-V${userLevel}`]"
                    ></span>
                    <span class="name">{{ "VIP" + userLevel }}</span>
                  </p>
                </span>
                <span v-else>请查看总资产</span>
              </p>
            </div>
            <div
              class="h-qmlogin"
              @click="onMessage"
              :class="{
                'fhcp-h-qmlogin':
                  $config.name === 'fhcp' || $config.name === 'xpj83',
              }"
              v-else
            >
              <p class="h-qmtit">
                <img
                  src="../../../../assets/img/home/qp/fhcp-message.png"
                  alt=""
                />
              </p>
              <p class="h-qmrem">
                <span>站内信</span>
                <i
                  class="msg-count"
                  v-show="
                    userInfo && $store.state.user.msgCount['allUnReadCount']
                  "
                  >{{ $store.state.user.msgCount["systemUnReadCount"] }}</i
                >
              </p>
            </div>
            <ul class="h-qmul">
              <li @click="goPath('/save')">
                <p>
                  <img src="../../../../assets/img/home/qp/save.png" alt="" />
                </p>
                <p>存款</p>
              </li>
              <li @click="goPath('/take?path=home')">
                <p>
                  <img src="../../../../assets/img/home/qp/take.png" alt="" />
                </p>
                <p>取款</p>
              </li>
              <li
                @click="goPath('/user/JieBeiCenter')"
                v-if="$config.name !== 'fhcp' && $config.name !== 'xpj83'"
              >
                <p>
                  <img src="../../../../assets/img/home/qp/jiebei.png" alt="" />
                </p>
                <p>借呗</p>
              </li>
              <li @click="$router.push('/activity')">
                <p>
                  <img src="../../../../assets/img/home/qp/activity.png" alt="" />
                </p>
                <p>活动</p>
              </li>
              <li
                @click="goJGJ()"
                v-if="$config.name === 'fhcp' || $config.name === 'xpj83'"
              >
                <p>
                  <img src="../../../../assets/img/home/qp/vip.png" alt="" />
                </p>
                <p>VIP</p>
              </li>
            </ul>
          </div>
          <div
            class="h-queMenu2"
            v-if="$config.name === 'betnew'"
            v-no-touch-move
          >
            <div class="notice-box" v-no-touch-move>
              <span class="notice-txt">
                <img
                  src="../../../../assets/img/home/qp/laba.png"
                  alt=""
                  width="24px"
                />
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
              <span class="labelBanner" @click="showMarquee">热门公告</span>
            </div>
            <div class="h-queSub">
              <div class="h-qmlogin">
                <p class="h-qmtit">
                  <span v-if="$store.state.user.token" class="balance"
                    ><i class="money"
                      >￥{{ userInfo ? userInfo.balance : "0.00" }}</i
                    ><i
                      class="icon-refresh icon iconfont h5-icon-h-f"
                      @click="setBalanceToLocal"
                      :class="{ loading: loadingBalance }"
                    ></i>
                  </span>
                  <span v-else @click="onLogin()">你还未登录</span>
                </p>
                <p class="h-qmrem">
                  <span v-if="$store.state.user.token">
                    <span class="user-name">{{
                      userInfo ? userInfo["userName"] : ""
                    }}</span>
                    <p class="user-leave">
                      <span
                        :class="[
                          'icon',
                          'iconfont',
                          `h5-icon-level-V${userLevel}`,
                        ]"
                      ></span>
                      <span class="name">{{ "VIP" + userLevel }}</span>
                    </p>
                  </span>
                  <span v-else>请查看总资产</span>
                </p>
              </div>
              <ul class="h-qmul">
                <li @click="goPath('/save')">
                  <p>
                    <img
                      src="../../../../assets/img/home/qp/btn_deposit.png"
                      alt=""
                    />
                  </p>
                  <p>存款</p>
                </li>
                <li @click="onMessage">
                  <p>
                    <img
                      src="../../../../assets/img/home/qp/btn_message.png"
                      alt=""
                    />
                  </p>
                  <i
                    class="msg-count-betnew"
                    v-show="
                      userInfo && $store.state.user.msgCount['allUnReadCount']
                    "
                  ></i>
                  <p>站内信</p>
                </li>
                <li @click="goPath('/take?path=home')">
                  <p>
                    <img
                      src="../../../../assets/img/home/qp/btn_withdrawal.png"
                      alt=""
                    />
                  </p>
                  <p>取款</p>
                </li>
                <li @click="goJGJ">
                  <p>
                    <img
                      src="../../../../assets/img/home/qp/betnew_vip.png"
                      alt=""
                    />
                  </p>
                  <p>VIP</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="js85-games"  v-if="$config.name === 'js85'" ref="js85GameListHeight">
        <div class="game-list">
          <div
            class="game-list-type"
            :class="[{ hotgame: currIndex === 20002 }, `gameType-${currIndex}`]"
          >
            <div
              class="game-list-box"
              v-for="(tab, i) in gameListConfig[currIndex].games"
              :key="i"
              @click="onGameClick(tab)"
            >
              <div
                class="icon"
                :style="
                  [99996, 10001].includes(tab.id)
                    ? 'backgroundImage:url(' + tab.icon + ');'
                    : 'backgroundImage:url(' +
                      imgUrl(tab.icon, currIndex) +
                      ');'
                "
              >
                <span
                  class="name"
                  v-if="currIndex !== 20002 && currIndex !== 10005"
                  >{{ tab.name }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="gameArea"
        :class="[
          { gameAreaBetnew: $config.name === 'betnew' },
          { gameArea839Qp: $config.name === '839qp'},
          { gameAreaHty: $config.name === 'hty' },
          { gameAreaHty: $config.name === 'dqr' },
        ]"
        ref="gameArea"
        v-else
      >
        <div
          class="leftNav"
          :class="{ leftNavBetnew: $config.name === 'betnew' }"
          v-if="showLeftNav"
        >
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
                v-if="
                  ($config.newQP ||
                    $config.name === 'fhcp' ||
                    $config.name === 'xpj83') &&
                  currIndex === props.txt
                "
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
            v-if="$config.name === 'betnew'"
          >
            <div v-for="(item, i) in gameList" :key="item">
              <Scroll-betnew-item
                @changeCurrIndex="changeCurrIndex"
                :gameList="gameListConfig[item]"
                :currIndex="currIndex"
                :index="i"
                :gameAreaH="gameAreaH"
                :gameListArr="gameList"
                :typeNumber="item"
                @changeShowBackTop="changeShowBackTop"
                ref="scrollItem"
              ></Scroll-betnew-item>
            </div>
          </div>
          <div
            :class="['right-info', { noLeftAnimatiom: noLeftAnimatiom }]"
            ref="rightInfo"
            v-else
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
        v-if="
          showBackTop &&
          ($config.newQP || $config.name === 'fhcp' || $config.name === 'xpj83')
        "
        style="width: 0.6rem; height: 0.6rem"
        class="back-top"
        @click="changeCurrIndex(gameList[currIndex], null, true)"
      />
      <img
        src="../../../../assets/img/home/qp/back-top.png"
        v-else-if="
          showBackTop &&
          !$config.newQP &&
          ($config.name !== 'fhcp' || $config.name !== 'xpj83')
        "
        class="back-top"
        @click="changeCurrIndex(gameList[currIndex], null, true)"
      />
    </div>
   
    
    <div
      slot="footer"
      class="xf_bottom"
      :class="$config.name + '_bottom'"
      v-if="['aqvns', 'dalao'].includes($config.name) && isShowBottom"
    >
      <span>下载APP，领取更多优惠福利</span>
      <img
        :src="require('@site/assets/img/admin/top_logo.png')"
        class="top_logo"
      />
      <span @click="onDownload"
        ><img src="../../../../assets/img/home/down/download.png" alt=""
      /></span>
      <span @click="onClose"
        ><img src="../../../../assets/img/home/down/close.png" alt=""
      /></span>
    </div>
    <div
      :style="{ height: $store.state.main.tabHeight + 'px' }"
      style="width: 100%"
      slot="footer"
    ></div>
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
import ScrollItem from "./scroll";
import ScrollBetnewItem from "./scrollBetnew";
import homeMixin from "../mixin";
import Header from "./Header";
export default {
  name: "Index",
  components: {
    HomeHeader: Header,
    swiper,
    swiperSlide,
    ScrollItem,
    ScrollBetnewItem,
    CubeScrollNavBar: ScrollNavBar,
  },
  mixins: [homeMixin],
  data() {
    return {
      isShowHeader: true,
      isShowBottom: true,
      isShow: true,
      isShow1: true,
      downTop:
        this.$config.newQP ||
        this.$config.name === "fhcp" ||
        this.$config.name === "xpj83" ||
        !["737qp"].includes(this.$config.name)
          ? 0
          : 0.84,
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
      currIndex: 0 || 20002,
      gameListId: [20002, 10000, 10001, 10002, 10003, 10004, 10005],
      js85GameList: [20002, 10004, 10003, 10005, 10001, 10000, 10002],
      gameList: [],
      gameListConfig: {
        20002: {
          title: "热门",
          type: "fish",
          id: "20002",
          img: require("../../../../assets/img/home/qp/hotGameImg.png"),
          acImg: require("../../../../assets/img/home/qp/ahotGameImg.png"),
          js85Img: require("../../../../assets/img/home/qp/js85-hot-game.png"),
          js85AcImg: require("../../../../assets/img/home/qp/js85-hot-game-hover.png"),
          games: [],
        },
        10005: {
          title: "捕鱼",
          type: "fish",
          id: "10005",
          img: require("../../../../assets/img/home/qp/byGameImg.png"),
          acImg: require("../../../../assets/img/home/qp/abyGameImg.png"),
          js85Img: require("../../../../assets/img/home/qp/js85-fish-game.png"),
          js85AcImg: require("../../../../assets/img/home/qp/js85-fish-game-hover.png"),
          games: [],
        },
        10001: {
          title: "电子",
          type: "slot",
          id: "10001",
          img: require("../../../../assets/img/home/qp/dzGameImg.png"),
          acImg: require("../../../../assets/img/home/qp/adzGameImg.png"),
          js85Img: require("../../../../assets/img/home/qp/js85-e-game.png"),
          js85AcImg: require("../../../../assets/img/home/qp/js85-e-game-hover.png"),
          games: [],
          class:
            this.$config.newQP ||
            this.$config.name === "fhcp" ||
            this.$config.name === "xpj83"
              ? ""
              : "type2",
        },
        10004: {
          title: "棋牌",
          type: "chess",
          id: "10004",
          img: require("../../../../assets/img/home/qp/qpGameImg.png"),
          acImg: require("../../../../assets/img/home/qp/aqpGameImg.png"),
          js85Img: require("../../../../assets/img/home/qp/js85-card-game.png"),
          js85AcImg: require("../../../../assets/img/home/qp/js85-card-game-hover.png"),
          games: [],
          class:
            this.$config.newQP ||
            this.$config.name === "fhcp" ||
            this.$config.name === "xpj83"
              ? ""
              : "type1",
        },
        10003: {
          title: "真人",
          type: "live",
          id: "10003",
          img: require("../../../../assets/img/home/qp/zrGameImg.png"),
          acImg: require("../../../../assets/img/home/qp/azrGameImg.png"),
          js85Img: require("../../../../assets/img/home/qp/js85-video-game.png"),
          js85AcImg: require("../../../../assets/img/home/qp/js85-video-game-hover.png"),
          games: [],
          class:
            this.$config.newQP ||
            this.$config.name === "fhcp" ||
            this.$config.name === "xpj83"
              ? ""
              : "type2",
        },
        10002: {
          title: "体育",
          type: "sport",
          id: "10002",
          img: require("../../../../assets/img/home/qp/tyGameImg.png"),
          acImg: require("../../../../assets/img/home/qp/atyGameImg.png"),
          js85Img: require("../../../../assets/img/home/qp/js85-sport-game.png"),
          js85AcImg: require("../../../../assets/img/home/qp/js85-sport-game-hover.png"),
          games: [],
          class:
            this.$config.newQP ||
            this.$config.name === "fhcp" ||
            this.$config.name === "xpj83"
              ? ""
              : "type2",
        },
        10000: {
          title: "彩票",
          type: "lottery",
          id: "10000",
          img: require("../../../../assets/img/home/qp/lotteryImg.png"),
          acImg: require("../../../../assets/img/home/qp/alotteryImg.png"),
          js85Img: require("../../../../assets/img/home/qp/js85-lottery-game.png"),
          js85AcImg: require("../../../../assets/img/home/qp/js85-lottery-game-hover.png"),
          games: [],
          class:
            this.$config.newQP ||
            this.$config.name === "fhcp" ||
            this.$config.name === "xpj83"
              ? ""
              : "type1",
        },
      },
      showBackTop: false,
      gameAreaH: 0,
      loadingBalance: false,
      showLeftNav: false,
      isMounted: false,
      noLeftAnimatiom: false,
    };
  },
  computed: {
    money() {
      switch (this.$config.name) {
        case "fhcp":
          return '下载手机APP应用，注册即送<i style="color: rgb(227, 18, 11);">9044</i>元';
        case "xpj83":
          return '下载手机APP应用，注册即送<i style="color: rgb(227, 18, 11);">448</i>元';
        case "dqr":
          return '下载手机APP应用，注册即送<i style="color: rgb(227, 18, 11);">8888</i>元';
        case "hty":
          return '下载手机APP应用，注册即送<i style="color: rgb(227, 18, 11);">8824</i>元';
        case "103qp":
          return '下载手机APP应用,注册即送<i style="color: rgb(227, 18, 11);">9999</i>元';
        case "qxcp":
          return '下载手机APP应用，注册即送<i style="color: rgb(227, 18, 11);">8888</i>元';
        case "737qp":
          return '下载手机APP应用，首存<i style="color: red;">30</i>元送<i style="color: red;">68</i>元';
        case "839qp":
          return '下载手机APP应用,注册即送<i style="color: rgb(227, 18, 11);">1.03</i>元';
      }
    },
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
  created() {
    this.getBanner();
    if (
      localStorage["qpHomeGameList"] &&
      localStorage["qpHomeList"] &&
      !JSON.parse(localStorage["qpHomeGameList"])[30001] &&
      JSON.parse(localStorage["qpHomeList"].indexOf(30001)) < 0
    ) {
      this.gameListConfig = JSON.parse(localStorage["qpHomeGameList"]);
      this.gameList = JSON.parse(localStorage["qpHomeList"]);
      this.$nextTick(() => {
        this.setScrollHeight();
        this.currIndex =
          this.gameList[0];
      });
    }
    this.getHomeData(null, "10000|10001|10002|10003|10004|10005|20001|20002");
  },
  activated () {
    this.$nextTick(() => {
      this.currIndex = this.gameList[0]
    })
  },
  watch: {
    gameMap() {
      let obj = {
        id: 20002,
      };
      this.listTop.unshift(obj);
      this.gameList = [];
      if (this.$config.name === "fhcp" || this.$config.name === "xpj83") {
        this.gameListId = [20002, 10004, 10003, 10005, 10001, 10000, 10002]; // 热门-棋牌-真人-捕鱼-电子-彩票-体育
      } else if (this.$config.name === "dqr") {
        this.gameListId = [20002, 10004, 10003, 10005, 10001, 10000, 10002]; // 热门-棋牌-真人-捕鱼-电子-彩票-体育
      } else if (this.$config.name === "839qp") {
        this.gameListId = [20002, 10004, 10003, 10005, 10001, 10000, 10002]; // 热门-棋牌-真人-捕鱼-电子-彩票-体育
      } else if (this.$config.name === "hty") {
        this.gameListId = [20002, 10004, 10003, 10005, 10001, 10000, 10002]; // 热门-棋牌-真人-捕鱼-电子-彩票-体育
      } else if (this.$config.name === 'betnew') {
        this.gameListId = [20002, 10004, 10003, 10002, 10001, 10005, 10000] // 热门-棋牌-真人-体育-电子-捕鱼-彩票
      }

      // 為了改變左側遊戲菜單順序, 所以會在這邊先做 this.gameList.push(item)
      this.gameListId.forEach((item) => {
        this.gameList.push(item);
      });
      this.listTop.forEach((item) => {
        if (this.gameListId.indexOf(item.id) >= 0) {
          // this.gameList.push(item.id)
          switch (item.id) {
            // 彩票
            case 10000:
              let longDragonIcon = "";
              if (this.$config.name === "betnew") {
                longDragonIcon = require("@src/assets/img/home/qp/betnew_longDragon.png");
              } else if(this.$config.name === "js85") {
                longDragonIcon = localStorage.SiteStaticsUrl + "/images/style80/20002/99996.png"
              } else {
                // 原邏輯
                longDragonIcon =
                  this.$config.name === "fhcp" || this.$config.name === "xpj83"
                    ? "style49/m/99996.png"
                    : this.$config.newQP
                    ? require("@src/assets/img/home/qp/xpj_longDragon.png")
                    : require("@src/assets/img/home/qp/longDragon.png");
              }
              let longDragon = {
                code: "",
                icon: longDragonIcon,
                id: 99996,
                name: "长龙助手",
                series: "",
                tag: "",
                title: "",
                type: "other",
                upid: 99996,
              };
              this.gameListConfig[item.id].games = this.hots;
              this.gameListConfig[item.id].games.unshift(longDragon);
              break;
            // 电子
            case 10001:
              this.gameListConfig[item.id].games = this.gameMap[item.id]["list"]
                .filter((item) => item.id == 67)[0]
                ["list"].filter((item) => item.id !== 74);
              if (
                !this.$config.newQP &&
                this.$config.name !== "fhcp" &&
                this.$config.name !== "xpj83" &&
                this.$config.name !== "betnew" &&
                this.$config.name !== "js85"
              ) {
                let game = {
                  icon: require("@src/assets/img/home/qp/game.png"),
                  id: 10001,
                  name: "本站推荐",
                  title: "本站推荐",
                  isgame: 0,
                };
                this.gameListConfig[item.id].games.unshift(game);
              }
              break;
            // 体育 真人
            case 10002:
              this.gameListConfig[item.id].games = this.gameMap[item.id];
              break;
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
              // 捕鱼平台或全部游戏
              // if(['amxpj','kkqp','99qp'].includes(this.$config.name)) {
              //   this.gameListConfig[item.id].games = this.gameMap[item.id]['list'].filter(item => item.id == 193)[0]['list'].filter(item => item.id !== 197)
              // }else {
              //   this.gameListConfig[item.id].games = this.gameMap[item.id]['list'].filter(item => item.id == 193)[0]['list'].filter(item => item.id === 197)[0]['games']
              // }
              this.gameListConfig[item.id].games = this.gameMap[item.id]["list"]
                .filter((item) => item.id == 193)[0]
                ["list"].filter((item) => item.id === 197)[0]["games"];
              // if(this.$config.name === "js85"){
              //     let game = {
              //     icon: require("../../../../assets/img/home/qp/js85-game.png"),
              //     id: 10005,
              //     name: "本站推荐",
              //     title: "本站推荐",
              //     isgame: 0,
              //   };
              //   this.gameListConfig[item.id].games.unshift(game);
              // }
              break;
            //热门
            case 20002:
              this.gameListConfig[item.id].games = this.listContent;
              break;
          }
        }
      })
      this.$nextTick(() => {
        this.setScrollHeight()
        this.currIndex = this.gameList[0];
        localStorage['qpHomeGameList'] = JSON.stringify(this.gameListConfig)
        localStorage['qpHomeList'] = JSON.stringify(this.gameList)
        if (this.isMounted) {
          this.homeGameType()
        }
      })
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
  mounted () {
    if(localStorage['qp-home-scroll-height']) {
      this.gameAreaH = Number(localStorage['qp-home-scroll-height'])
      this.$refs.gameArea && (this.$refs.gameArea.style.height = this.gameAreaH + "px");
      this.$refs.rightInfo && (this.$refs.rightInfo.style.height =
        this.gameAreaH * this.gameList.length + "px");
      this.$refs.currIndex = this.$refs.currIndex.scrollHeight + 'px';

      this.showLeftNav = true;
      this.$refs.leftNav && this.$refs.leftNav.refresh();
    }
    //解决偶尔获取不到localStorage数据问题，导致公告空白
    this.intervalId = window.setInterval(() => {
      this.initNotice();
    }, 100);
    setTimeout(() => {
      this.setScrollHeight();
    }, 100);
    window.addEventListener("resize", () => {
      this.setScrollHeight();
    });
    setTimeout(() => {
      if (this.$refs.mySwiper) {
        this.$refs.mySwiper.swiper.init()
      }
    }, 500)
    setTimeout(() => {
      this.isMounted = true
      if(this.gameList && this.gameList.length) {
        this.homeGameType()
      }
    }, 400);
    
  },
  methods: {
    changeHandler(cur) {
      this.currIndex = cur;
      this.$nextTick(()=>{
        this.$refs.js85GameListHeight.scrollTop = 0
      })
    },
    imgUrl(url, type) {
      let tmpUrl = url;
      if (url.indexOf("longDrago") > 0 || url.indexOf("game") > 0) {
        return tmpUrl;
      } else {
        if (type === 10000) tmpUrl = url.replace("/m/", "/20002/");
        return this.publicStaticHost + "/images/" + tmpUrl;
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
      if (this.$config.name === "betnew") {
        this.changeCurrIndex();
      }
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
    changeCurrIndex(index, direction, backTop) {
      this.$refs.scrollItem[this.gameList.indexOf(this.currIndex)].scrollTop()
      let _index = index
        ? this.gameList.indexOf(index)
        : this.gameList.indexOf(this.currIndex);
      if (direction) {
        if (direction === "up" && _index > 0) {
          _index -= 1;
          this.currIndex = this.gameList[_index];
        } else if (
          direction === "down" &&
          _index < this.gameList.length - 1
        ) {
          _index += 1;
          this.currIndex = this.gameList[_index];
        }
      } else {
        this.currIndex = this.gameList[_index];
      }

      this.$refs.scrollItem[_index].scrollTop();
      this.showBackTop = false;
      // if(backTop) {
      //   this.$refs.scrollItem[_index].scrollTop()
      // }
      this.$refs.scrollItem[_index].scrollTop();
      let righttranslateY = -_index * this.gameAreaH;
      this.$refs.rightInfo.style.transform =
        "translateY(" + righttranslateY + "px)";
    },
    setScrollHeight() {
      if ( this.$config.name === 'js85' ) return
      let clientH =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      if (this.$refs.topArea) {
        this.gameAreaH =
          clientH -
          this.$refs.topArea.offsetHeight -
          this.rem *
            (this.$config.newQP ||
            this.$config.name === "fhcp" ||
            this.$config.name === "xpj83"
              ? 2.2
              : this.isShow && ["737qp"].includes(this.$config.name)
              ? 2.94
              : 2.1);
        if (this.$config.name === "betnew") {
          this.gameAreaH =
            clientH -
            this.$refs.topArea.offsetHeight -
            this.rem * (this.$config.newQP || 2.6);
        }        
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
  updated() {
    // js85 會有 refs 抓到 undefined 的情況, 所以在 updated 多加判斷 排除 undefined 的狀況
    if(this.$config.name === 'js85'){
      let clientH =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      if (this.$refs.topArea){
        this.js85GameHeight =
          clientH -
          this.$refs.topArea.offsetHeight -
          this.rem * 2;
        this.$refs.js85GameListHeight && (this.$refs.js85GameListHeight.style.height = this.js85GameHeight + "px");
      }
    }
  },
};
</script>

<style lang="less" type='text/less' scoped>
.xf_bottom {
  width: 100%;
  height: 0.99rem;
  display: flex;
  align-items: center;
  // background:url('../../../../assets/img/home/down/xf_bg.png');
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
  margin: 0 auto 0.18rem;
  height: 1.47rem;
  padding: 0.23rem 0 0.22rem 0;
  background: linear-gradient(180deg, #171717 0%, #0b0b0b 100%);
  border-radius: 0.16rem 0.16rem 0 0;
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
        }
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
  background: #1b1d1b;
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
      height: 2.62rem;
      background-size: 100% 100%;
    }
  }
  .middle-menu {
    width: 100%;
    height: 0.8rem;
    display: flex;
    justify-content: space-around;
    background: #282828;
    a,
    .message {
      flex: 1;
      margin: 0.2rem 0;
      border-right: 0.02rem solid #444;
      height: 0.4rem;
      line-height: 0.4rem;
      color: #fff;
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

    .etnqp-vip {
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        width: 0.34rem;
        height: 0.29rem;
        margin-right: 0.1rem;
        transform: translateY(-0.05rem);
        position: relative;
        top:0.05rem;
      }
    }
  }
  .notice-box {
    width: 6.9rem;
    height: 0.56rem;
    line-height: 0.56rem;
    font-size: 0.28rem;
    position: relative;
    margin: 0 auto;
    .notice-txt {
      position: absolute;
      left: 0rem;
      color: #fff;
      font-size: 0.27rem;
      font-family: STHeiti, Microsoft YaHei, \\5fae\8f6f\96c5\9ed1, SimSun,
        \\5b8b\4f53, arial;
    }
    .notice-bar {
      height: 0.56rem;
      line-height: 0.56rem;
      font-size: 0.26rem;
      padding: 0 0 0 0.7rem;
      background-color: transparent;
      /deep/ .van-notice-bar__wrap {
        height: 100% !important;
        .van-notice-bar__content {
          white-space: nowrap;
          width: auto;
          font-size: 0.24rem;
          color: #eaeaea;
          .notice {
            display: inline-block;
            margin-right: 0.3rem;
          }
        }
      }
    }
    .labelBanner {
      position: absolute;
      right: -0.1rem;
      top: 0;
      background-image: linear-gradient(
        180deg,
        #069c72,
        #058d67,
        #047e5c,
        #046f51,
        #046147
      );
      height: 0.56rem;
      padding: 0 0.2rem;
      color: #fff;
      border-radius: 1.5rem;
      font-size: 0.2rem;
    }
  }
  .js85-box{
    .notice-box{
      height: 0.45rem !important;
    }
    .middle-menu{
      height: 0.8rem !important;
      .message,.etnqp-vip{
        height: 0.6rem;
        line-height: 0.6rem;
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
              height: 0.88rem;
              line-height: 0.88rem;
              text-align: left;
              background-color: #282828;
              margin-top: 0.06rem;
              text-align: center;

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
                background: #c82721 !important;
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
  .gameArea839Qp,
  .gameAreaHty {
    width: 7.4rem !important;
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
.js85-games-type-nav{
  .gametype-navbar {
    padding: 0.1rem 0 0.1rem 0;
    .gametype-navbar-item {
      background: #000000;
      flex: 1 0 auto;
      display: flex;
      justify-content: space-between;
      li {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        cursor: pointer;
        width: 1rem;
        height: 1rem;
        p {
          &:first-child {
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              height: 0.45rem;
            }
          }
          &:last-child {
            width: 100%;
            text-align: center;
            color: #fff;
            font-size: 0.2rem;
            padding-top:0.04rem
          }
        }
        &.active {
          background: linear-gradient(90deg, #f2ed76, #f0ca4c);
          &:after {
            content: "";
            display: block;
            position: absolute;
            top: 4.7rem;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 0.12rem 0.12rem 0.12rem;
            border-color: transparent transparent #000000 transparent;
          }
          p {
            color: #000000;
          }
        }
      }
    }
  }
}
.js85-games {
  background: #000000;
  // height: calc(100vh - 6.5rem);
  // display: flex;
  // flex-direction: column;
    margin: 0 !important;
    height: 100%;
    // display: flex;
    // flex-direction: row;
    overflow: auto;

  .game-list {
    height: 100%;
    
    .game-list-type {
      display: block;
      min-height: 100%;
      width: 100%;
      font-size: 0;
      .game-list-box {
        width: 1.74rem !important;
        height: 1.74rem !important;
        float: left;
        border-radius: 0.12rem;
        position: relative;
        margin:0 0 0.11rem 0.11rem;
        .icon {
          float: none;
          display: block;
          height: 1.74rem;
          background-size: 100%;
          background-position: center;
          margin-bottom: 0;
          border: none;
          border-radius: 0.1rem;
        }
        .name {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0.4rem;
          line-height: 0.4rem;
          font-size: 0.25rem;
          font-weight: 700;
          font-family: Microsoft YaHei;
          color: #fff;
          background: linear-gradient(90deg, rgba(88, 86, 88, 0.2) 4%, #050306 45%, #050306 55%, rgba(88, 86, 88, 0.2) 96%);
          &::before {
            content: "";
            text-align: center;
            display: inline-block;
            width: 100%;
            height: 0.02rem;
            position: absolute;
            top: 0;
            left: 0;
            background: linear-gradient(90deg, rgba(159, 32, 29, 0) 0%, #a71e16  45%, #a71e16  55%, rgba(159, 32, 29, 0) 100%);
          }
        }
      }
    }
    .gameType-10001 {
      .game-list-box {
        width: 31.5% !important;
      }
    }
    .gameType-10002,
    .gameType-10003,
    .gameType-10004 {
      .game-list-box {
        width: 48% !important;
      }
    }
    // .gameType-10005 {
    //   .game-list-box {
    //     &:nth-child(1) {
    //       width: 97% !important;
    //     }
    //   }
    // }
    // .gameType-10005 {
    //   .game-list-box {
    //     &:nth-child(1) {
    //       .icon {
    //         &::after {
    //           content: "本站推荐";
    //           display: block;
    //           width: 100%;
    //           background: linear-gradient(90deg, rgba(88, 86, 88, 0.2) 4%, #050306 45%, #050306 55%, rgba(88, 86, 88, 0.2) 96%);
    //           border-top: 0.03rem solid transparent;
    //           border-image: linear-gradient(90deg, rgba(159, 32, 29, 0) 0%, #a71e16  45%, #a71e16  55%, rgba(159, 32, 29, 0) 100%);
    //           border-image-slice: 1 0 0 0;
    //           color: #fff;
    //           font-size: 0.25rem;
    //           position: absolute;
    //           bottom: 0rem;
    //           text-align: center;
    //           padding: 0.03rem 0 0.03rem 0.15rem;
    //           font-weight: 550;
    //         }
    //       }
    //     }
    //   }
    // }
  }
  

}
</style>
