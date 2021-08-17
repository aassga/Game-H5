<template>
  <view-page
    class="newqp-view"
    header-touch
    full-box
    :noScroll="true"
    ref="viewPage"
  >
    <title-header
      slot="header"
      class="header-top theme-header-bg"
      v-no-touch-move
      :isShowback="false"
    >
      <div :class="[{ FocusSearch: isFocusSearch }, 'top-bar1']">
        <img
          src="@src/assets/img/game/back-icon.png"
          class="h-back"
          @click="$router.push('/')"
        />
        <div class="search-box clearfix">
          <img
            src="@src/assets/img/game/newqp-search-icon.png"
            class="search-icon"
          />
          <div class="search-text" @click="changeIsFocus(true)">
            游戏名称搜索
          </div>
          <img
            src="@src/assets/img/game/new-game/black-control-btn.png"
            class="control-btn"
            @click="showPopup = true"
          />
        </div>
      </div>
      <div
        :class="[{ FocusSearch: isFocusSearch }, 'top-bar2']"
        @click="changeIsFocus(true)"
      >
        <img
          src="@src/assets/img/game/back-icon.png"
          class="h-back"
          @click.stop="changeIsFocus(false)"
        />
        <div class="search-box clearfix">
         <img
            src="@src/assets/img/game/newqp-search-icon.png"
            class="search-icon"
          />
          <div class="search-placeholder" v-if="showSearchPlaceholder && !searchGame">
            游戏名称搜索
          </div>
          <van-search
            ref="vanSearch"
            v-model="searchGame"
            shape="round"
            right-icon
            left-icon
            background="rgba(255, 255, 255, 0)"
            :clearable="false"
            @blur="showSearchPlaceholder = true"
            @focus="showSearchPlaceholder = false"
          />
        </div>
        <img
          src="@src/assets/img/game/qp-clear-icon.png"
          class="clear-icon"
          @click.stop="searchGame = ''"
          v-if="searchGame.length"
        />
      </div>
    </title-header>
    <div :class="['content newSolt theme-main-bg',{'blush-content':$config.blush}]" slot="content" ref="content">
      <div v-show="!isFocusSearch">
        <!-- 电子，棋牌并且左侧导航数据加载完成 -->
        <div
          class="clearfix"
          v-if="leftNavList.length > 0 && leftListArr.length > 0"
        >
          <div class="top" ref="topArea">
            <van-tabs
              class="newGameVanTabs"
              v-model="typeListAction"
              v-if="
                leftNavActive === 99 ||
                leftNavActive === 98 ||
                leftNavActive === 97
              "
              :swipe-threshold="4"
              @change="navChangeHandle"
              :border="false"
              background="#000"
              :line-width="0"
              :line-height="0"
            >
              <van-tab
                v-for="(item, i) in typeList"
                :title="item.name"
                :key="i"
              ></van-tab>
            </van-tabs>
            <van-tabs
              class="newGameVanTabs"
              v-model="gameTypeActive"
              v-if="gameTypeList && gameTypeList.length > 1"
              @change="setLineHandle"
              :swipe-threshold="4"
              :line-width="0"
              :line-height="0"
              :border="false"
              background="#000"
            >
              <van-tab
                v-for="(item, i) in gameTypeList"
                :title="item.name"
                :key="i"
              ></van-tab>
            </van-tabs>
            <van-tabs
              v-model="lineActive"
              class="newGameVanTabs"
              v-if="lineList && lineList.length > 1"
              @change="setShowGameHandle"
              :swipe-threshold="4"
              :line-width="0"
              :line-height="0"
              :border="false"
              background="#000"
            >
              <van-tab
                v-for="(item, i) in lineList"
                :title="item.name"
                :key="i"
              ></van-tab>
            </van-tabs>
          </div>
          <div class="game-area">
            <div class="fl left-box">
              <div class="left-nav" ref="leftNav" v-if="leftListArr.length > 0">
                <cube-scroll-nav-bar
                  direction="vertical"
                  :current="current"
                  :labels="leftListArr"
                  :options="scrollOptions"
                  ref="cubeNavBar"
                >
                  <div
                    slot-scope="props"
                    :class="[
                      current === props.index ? 'theme-agent-tab-active' : '',
                      'borderRadius',
                    ]"
                    @click="changeHandler(props.index)"
                  >
                    <div class="item-area">
                      <div class="game-name">
                        {{ leftNavList[props.index].name }}
                      </div>
                    </div>
                  </div>
                </cube-scroll-nav-bar>
              </div>
            </div>
            <div class="fl right-game theme-main-bg" ref="rightGame">
              <scroll-area
                class="right-scroll-box"
                ref="rightScroll"
                style="padding: 0"
                @load-down="onLoadMore"
                @changeShowReturnTop="changeShowReturnTop"
                :onDownMore="true"
              >
                <div class="right-game-scroll theme-main-bg">
                  <div class="swiper-area" v-show="bannerList.length">
                    <vux-swiper
                      :list="bannerList"
                      :show-desc-mask="false"
                      loop
                      auto
                      :height="rem * 1.6949 + 'px'"
                      dots-position="center"
                      ref="swiper"
                      @on-click-list-item="swiperItemClick"
                      :show-dots="false"
                    ></vux-swiper>
                  </div>
                  <div class="animation-box" ref="animationBox" v-if="isShow">
                    <ul
                      class="clearfix game-list"
                      v-show="showGameList && showGameList.length > 0"
                    >
                      <li
                        class="fl"
                        v-for="(per, index) in showGameList"
                        :key="index"
                      >
                        <div v-if="per.imgExists">
                          <img
                            class="game-list-img"
                            :src="imgUrl(per.icon)"
                            v-lazy="imgUrl(per.icon)"
                            @click="clickGameHandle(per)"
                          />
                        </div>
                        <div v-else @click="clickGameHandle(per)">
                          <img
                            class="error-icon"
                            :src="idConfig[gameSortV4Note.data[per.id]['series']].errorIcon"
                            v-if="gameSortV4Note.data && gameSortV4Note.data[per.id] && idConfig[gameSortV4Note.data[per.id]['series']] && idConfig[gameSortV4Note.data[per.id]['series']]"
                          />
                          <img
                            class="error-img"
                            src="../../../assets/img/game/new-game/lazy-error-bg.png"
                            alt
                          />
                        </div>
                        <div class="game-bottom">
                          <span class="game-name">{{ per.name }}</span>
                        </div>
                      </li>
                    </ul>
                    <div
                      v-if="!showGameList || showGameList.length < 1"
                      class="list-empty"
                    >
                      <img
                        class="no-data"
                        src="@src/assets/img/game/qp-no-data.png"
                      />
                      <p class="info">暂无游戏</p>
                    </div>
                  </div>
                </div>
              </scroll-area>
            </div>
          </div>
        </div>
        <img src="@src/assets/img/home/qp/qp-back-top.svg" v-if="$config.newQP || $config.blackTheme" style="width:0.6rem;height:0.6rem" :class="[{ showReturnTop: showReturnTop }, 'returnTop']" @click="returnTop">
        <span
          :class="[{ showReturnTop: showReturnTop }, 'returnTop', 'theme-bg']"
          @click="returnTop"
          v-else
        ></span>
      </div>
      <scroll-area
        v-show="isFocusSearch"
        class="right-scroll-box"
        style="padding: 0"
      >
        <div style="height: 100%">
          <div class="search-hint" v-if="!searchGame.trim()">
            <div class="history" v-if="historylist.length" style="height: auto">
              <div class="title">
                搜索历史
                <img
                  src="@src/assets/img/game/new-game/delete-icon.png"
                  class="delete-icon"
                  @click="historylist = []"
                />
              </div>
              <div
                class="hint-item theme-gradient-bg theme-color-white theme-border-1px theme-noborder"
                v-for="(item, i) in historylist"
                :key="i"
                @click="changeSearchGame(item)"
              >
                {{ item }}
              </div>
            </div>
            <div class="hot" style="height: auto">
              <div class="gray-bar" v-if="historylist.length && !$config.blush"></div>
              <div class="title">
                热搜榜
                <img
                  src="@src/assets/img/game/new-game/hot-search.png"
                  class="hot-search"
                />
              </div>
              <div class="list theme-noborder" v-if="hotGameList && hotGameList.length">
                <div
                  class="hot-item theme-noborder"
                  v-for="(item, i) in hotGameList"
                  :key="i"
                  @click="changeSearchGame(item.name, true)"
                >
                  <div class="hot-name theme-noborder">{{ item.name }}</div>
                </div>
              </div>
              <div v-else class="no-hotGame-list">
                <img
                  class="no-data"
                  src="@src/assets/img/game/qp-no-data.png"
                />
                <p class="info">暂无游戏</p>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="search-box" ref="searchBox" v-if="!isLoding">
              <ul
                class="clearfix game-list"
                v-if="showSearchGameList && showSearchGameList.length > 0"
                style="margin-top:0.2rem"
              >
                <li
                  class="fl"
                  v-for="(per, index) in showSearchGameList"
                  :key="index"
                >
                  <div v-if="per.imgExists">
                    <img
                      class="game-list-img"
                      :src="imgUrl(per.icon)"
                      v-lazy="imgUrl(per.icon)"
                      @click="clickGameHandle(per)"
                    />
                  </div>
                  <div v-else @click="clickGameHandle(per)">
                    <img
                      class="error-icon"
                      :src="idConfig[gameSortV4Note.data[per.id]['series']].errorIcon"
                      v-if="idConfig[gameSortV4Note.data[per.id]['series']] && idConfig[gameSortV4Note.data[per.id]['series']].errorIcon"
                    />
                    <img
                      class="error-img"
                      src="../../../assets/img/game/new-game/lazy-error-bg.png"
                      alt
                    />
                  </div>
                  <div class="game-bottom">
                    <span class="game-name">{{ per.name }}</span>
                  </div>
                </li>
              </ul>
              <div v-else class="list-empty">
                <img
                  class="no-data"
                  src="@src/assets/img/game/qp-no-data.png"
                />
                <p class="info">
                  {{
                    searchGame.trim() ? "未找到符合相关条件的游戏" : "暂无游戏"
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </scroll-area>
      <popup-bottom
        ref="popupBottom"
        :show.sync="showPopup"
        :collectList="collectList"
        :popupRecommend="popupRecommend"
        @clickGameHandle="clickGameHandle"
        @cancelCollect="cancelCollect"
        @joinCollect="joinCollect"
        @getMemberCollectGames="getMemberCollectGames"
        :gameSortV4Note="gameSortV4Note"
      />
    </div>
    <div slot="static">
      <slot></slot>
    </div>
  </view-page>
</template>

<script>
import { Search, Tab, Tabs } from "vant";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import homeMixin from "../../home/theme/mixin";
import { ScrollNavBar } from "cube-ui";
import idConfig from "../new-game/idConfig";
import popupBottom from "./popupBottom";
import scrollArea from "@src/components/scroll-area";
export default {
  name: "Game",
  components: {
    "van-search": Search,
    "van-tab": Tab,
    "van-tabs": Tabs,
    swiper,
    swiperSlide,
    CubeScrollNavBar: ScrollNavBar,
    scrollArea,
    popupBottom
  },
  mixins: [homeMixin],
  data() {
    return {
      current: 0,
      searchGame: "",
      bannerList: [],
      AllBannerList: [],
      leftNavActive: null,
      leftNavList: [],
      leftListArr: [],
      allGameList: [],
      showGameList: [],
      typeList: [
      ],
      typeListAction: 0,
      gameTypeList: [],
      gameTypeActive: 0,
      lineList: [],
      lineActive: 0,
      collectList: [],
      currentPage: 0,
      pageShowGame: 24,
      scrollHeight: 0,
      idConfig: {},
      typeId: 0,
      showReturnTop: false,
      isFocusSearch: false,
      historylist: [],
      hotGameList: [],
      allSearchGameList: [],
      showSearchGameList: [],
      showPopup: false,
      popupRecommend: [],
      searchTimer: 0,
      isLoding: false,
      myLoveGameList: [],
      isShow: true,
      siteId: 0,
      showSearchPlaceholder: false,
      gameSortV4Note: {},
    };
  },
  watch: {
    searchGame(newVal, oldVal) {
      this.toastLoading("加载中");
      this.isLoding = true;
      clearTimeout(this.searchTimer);
      if (this.searchGame.trim()) {
        this.searchTimer = setTimeout(() => {
          this.showSearchGameList = this.allSearchGameList.filter((item) => {
            if (item.name.includes(this.searchGame.trim())) {
              return item;
            }
          });
          this.$nextTick(() => {
            this.showSearchGameList = this.setCollectList(this.showSearchGameList);
          })
          this.toastClear();
          this.isLoding = false;
        }, 500);
      } else {
        this.toastClear();
        this.isLoding = false;
      }
    },
    // 历史搜索保存
    historylist(newVal) {
      localStorage.setItem(
        `${this.typeId}histortSearchgame`,
        JSON.stringify(newVal)
      );
    },
    "$store.state.main.siteId": {
      handler: function (v) {
        this.siteId = v;
        this.getSlideshowList();
      },
      deep: true, //深度监听
    },
    '$store.state.main.gameSortV4Note'(newVal) {
      this.gameSortV4Note = newVal
    }
  },
  computed: {
    scrollOptions() {
      return {
        // bounce: false
        useTransition:
          this.$mobileDevice.osVersion.split(".")[0] >= 13 &&
          this.$mobileDevice.osVersion.split(".")[1] >= 3
            ? false
            : true,
      };
    },
  },
  mounted() {
    // 进屏动画完成后
    setTimeout(() => {
      this.initScroll();
    }, 200);
    setTimeout(() => {
      this.initScroll();
    }, 600);
  },
  created() {
    // iphone6 7 8 safari chrome频繁进入页面报错
    if(screen.height == 667 && screen.width == 375 && (this.$mobileDevice.isSafari || (/AppleWebKit/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent)))) {
      this.$store.commit("main/setGoGameNumber", this.$store.state.main.goGameNumber + 1);
      this.gameNumberTimer = setTimeout(() => {
        this.$store.commit("main/setGoGameNumber", 0);
      }, 5000);
    }
    this.toastLoading("加载中");
    if(localStorage.gameSortV4Note) {
      this.gameSortV4Note = JSON.parse(localStorage.gameSortV4Note)
    }
    this.typeId = this.$route.params.id;
    this.idConfig = idConfig;
    if (
      localStorage.config &&
      JSON.parse(localStorage.config) &&
      JSON.parse(localStorage.config)["siteId"]
    ) {
      this.siteId = JSON.parse(localStorage.config)["siteId"];
      this.getSlideshowList();
    }
    let localHistortList = JSON.parse(
      localStorage.getItem(`${this.typeId}histortSearchgame`)
    );
    if (localHistortList) {
      this.historylist = localHistortList;
    }
    let localTypeList = JSON.parse(
      localStorage.getItem(`${this.typeId}typeList`)
    );
    if (localTypeList) {
      this.typeList = localTypeList;
    }
    let navData = JSON.parse(localStorage.getItem(`${this.typeId}leftNavList`));
    if (navData && navData.length > 0) {
      this.leftNavList = navData;
      //删除我的最爱
      if (
        (!this.$store.state.user.userInfo || !this.$store.state.user.token) &&
        this.leftNavList[0].name === "我的最爱"
      ) {
        this.leftNavList.splice(0, 1);
      }
      //c模式去掉pt电子
      if (this.personalMode === "mode_c" && this.$config.name !== 'kkqp' && this.$config.name !== '99qp') {
        this.leftNavList.forEach((item, i) => {
          if (item.name === "PT电子") {
            this.leftNavList.splice(i, 1);
          }
        });
      }
      if (this.$route.query.navId) {
        this.leftNavList.forEach((item, i) => {
          if (this.$route.query.navId == item.gcid) {
            this.current = i;
            this.changeLeftNav(item, true);
          }
        });
      } else {
        this.changeLeftNav(this.leftNavList[0], true);
      }
      for (let i = 0; i < navData.length; i++) {
        this.leftListArr[i] = i;
      }
    }
    if(this.userInfo && JSON.stringify(this.userInfo) !== '{}') {
      this.getMyLove();
    }else {
      this.getData();
    }
  },
  methods: {
    imgUrl (url) {
      if(this.leftNavList[this.current].name.indexOf('最爱') != -1) {
        return url
      }else {
        return this.publicStaticHost + '/images/'+ url
      }
    },
    initScroll() {
      let clientH =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      let topH = this.$refs.topArea && this.$refs.topArea.offsetHeight
      this.scrollHeight = clientH - topH - 1.4 * this.rem;
      this.$refs.leftNav && (this.$refs.leftNav.style.height = this.scrollHeight + "px");
      this.$refs.rightGame && (this.$refs.rightGame.style.height = this.scrollHeight + "px");
      this.$refs.content && (this.$refs.content.style.height = this.scrollHeight + this.rem * 1.8 + "px");
      this.$refs.cubeNavBar && this.$refs.cubeNavBar.refresh();
      this.$refs.rightScroll && this.$refs.rightScroll.refresh();
    },
    onLoadMore() {
      let maxPage = Math.floor(this.allGameList.length / this.pageShowGame);
      if (maxPage > 0) {
        this.currentPage += 1;
        if (maxPage === this.currentPage) {
          this.gameListSlice(
            this.allGameList.slice(
              this.currentPage * this.pageShowGame,
              this.allGameList.length
            )
          );
        } else if (maxPage > this.currentPage) {
          this.gameListSlice(
            this.allGameList.slice(
              this.currentPage * this.pageShowGame,
              (this.currentPage + 1) * this.pageShowGame
            )
          );
        }
      }
      this.$nextTick((res) => {
        this.$refs.rightScroll.refresh();
      });
    },
    // 收藏游戏列表
    getMemberCollectGames(isPopupEmit) {
      if (this.$store.state.user.userInfo || this.$store.state.user.token) {
        let type = "";
        switch (this.typeId) {
          case "10001":
            type = "slot";
            break;
          case "10004":
            type = "chess";
            break;
          case "10005":
            type = "fish";
            break;
        }
        this.$store
          .dispatch("games/getMemberCollectGames", type)
          .then(res => {
            if (res && res.code === 200) {
              this.collectList = res.data;
              this.collectList.forEach(ele => {
                this.$set(ele, "isCollect", true);
              });
              if(isPopupEmit && this.typeList[this.typeListAction].name === '收藏') {
                this.showGameList = this.collectList
              }
              if (this.showGameList.length > 0) {
                this.setCollectList(this.showGameList);
              }
              if (this.showSearchGameList && this.showSearchGameList.length) {
                this.setCollectList(this.showSearchGameList);
              }
              this.$refs.popupBottom &&
                (this.$refs.popupBottom.selfCollectList = this.collectList);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //轮播图
    getSlideshowList() {
      this.$store
        .dispatch("games/getSlideshowList", {
          siteId: this.siteId,
          classId: this.typeId,
        })
        .then((res) => {
          if (res && res.code === 200) {
            this.AllBannerList = res.data;
            this.$nextTick(()=>{
              this.changeBannerList();
            })
          }
        })
        .catch((err) => {});
    },
    changeBannerList() {
      this.bannerList = [];
      let nameToId = {
        推荐游戏: 1,
        推荐捕鱼: 1,
        热门游戏: 2,
        热门捕鱼: 2,
        最新游戏: 3,
        最新捕鱼: 3,
      };
      if (this.leftNavList.length && this.AllBannerList[nameToId[this.leftNavList[this.current].name]]) {
        this.bannerList = this.AllBannerList[
          nameToId[this.leftNavList[this.current].name]
        ];
        if (this.bannerList.length > 0) {
          this.bannerList.forEach((item) => {
            this.$set(item, "img", localStorage.SiteStaticsUrl + item.image);
          });
        }
      }
    },
    getMyLove() {
      if(this.userInfo && JSON.stringify(this.userInfo) !== '{}') {
        let data = {
          type: this.typeId,
          device: "h5",
        };
        if(this.$config.name === 'qygj') {
          data['style'] = 'style30'
        }else if(this.$config.name === 'bet365') {
          data['style'] = 'style31'
        }else if(this.$config.name === 'vnst') {
          data['style'] = 'style32'
        }else if(this.$config.name === 'amvnsr') {
          data['style'] = 'style33'
        }else if(this.$config.name === 'amxpj') {
          data['style'] = 'style34'
        }else if(this.$config.name === '99qp') {
          data['style'] = 'style36'
        }else if(this.$config.name === 'kkqp') {
          data['style'] = 'style38'
        }else if(this.$config.name === 'klk') {
          data['style'] = 'style40'
        }else if(this.$config.name === '839qp') {
          data['style'] = 'style41'
        }else if(this.$config.name === 'qmcp') {
          data['style'] = 'style43'
        }else if(this.$config.name === 'hty') {
          data['style'] = 'style45'
        }else if(this.$config.name === 'dqr') {
          data['style'] = 'style47'
        }else if(this.$config.name === 'fhcp'|| this.$config.name === 'xpj83') {
          data['style'] = 'style49'
        }else if(this.$config.name === 'js85') {
          data['style'] = 'style80'
        }else if(this.$config.name === 'dalao') {
          data['style'] = 'style51'
        }else if(this.$config.name === 'aqvns') {
          data['style'] = 'style53'
        }else if(this.$config.name === 'ybcp') {
          data['style'] = 'style55'
        }else if(this.$config.name === 'ecp') {
          data['style'] = 'style57'
        }else if(this.$config.name === 'amvns') {
          data['style'] = 'style59'
        }else if(this.$config.name === 'amhg') {
          data['style'] = 'style61'
        }else if(this.$config.name === 'cpxpj') {
          data['style'] = 'style67'
        }else if(this.$config.name === 'betnew') {
          data['style'] = 'style63'
        }else if(this.$config.name === 'tyc86') {
          data['style'] = 'style28'
        }else if(this.$config.name === 'tyc82') {
          data['style'] = 'style69'
        }else if(this.$config.name === 'xpj80') {
          data['style'] = 'style71'
        }else if(this.$config.name === 'vns81') {
          data['style'] = 'style73'
        }else if(this.$config.home === 'qp') {
          this.$config.newQP ? data['style'] = 'style17' : data['style'] = 'style13'
        }else if(['blr'].includes(this.$config.name)) {
          data['style'] = 'style24'
        }else if(['tycjt'].includes(this.$config.name)) {
          data['style'] = 'style26'
        }
        this.$store
          .dispatch("games/getMyloveGame", data)
          .then((res) => {
            if (res.code === 200) {
              this.myLoveGameList = res.data;
              if (
                this.$store.state.user.userInfo &&
                this.$store.state.user.token &&
                this.myLoveGameList.length &&
                this.leftNavList[0] &&
                this.leftNavList[0].name !== "我的最爱"
              ) {
                // 我的最爱插入第一条
                let myLoveData = {
                  id: 9,
                  name: "我的最爱",
                  games: this.myLoveGameList,
                  icon: require("../../../assets/img/game/new-game/my-love.png"),
                };
                this.leftNavList.unshift(myLoveData);
                this.changeLeftNav(this.leftNavList[0], true);
              }
            }
            this.getData();
          })
          .catch(err => {
            console.log(err);
          });
      }else {
        this.getData();
      }
    },
    // 游戏列表
    getData() {
      const idIndex = {
        10001: 2,
        10004: 1,
        10005: 3,
      }
      let id = this.typeId
      this.$store.dispatch("main/getNewGame", {
        idIndex : idIndex[id],
        id,
        callback: res => {
          if (res && res[id]) {
            let localLeftNavList = [];
            let localTypeList = [
              {
                id: 0,
                name: "全部",
              }
            ]
            if (this.myLoveGameList.length) {
              // 我的最爱插入第一条
              let myLoveData = {
                id: 9,
                name: "我的最爱",
                games: this.myLoveGameList,
                icon: require("../../../assets/img/game/new-game/my-love.png")
              };
              localLeftNavList.unshift(myLoveData);
            }
            const list = res[id].list
            let resetName = {
              热门游戏: "热门",
              热门捕鱼: "热门",
              最新游戏: "最新",
              最新捕鱼: '最新',
              推荐游戏: "推荐",
              推荐捕鱼: '推荐',
              奖金池游戏: "奖池",
              街机游戏: "街机",
              捕鱼游戏: "捕鱼",
              牛牛游戏: "牛牛",
              百人游戏: "百人",
              经典游戏: "经典"
            };
            list.forEach((listItem,i) => {
              if(listItem.name.indexOf('标签') != -1) {
                list[i]['list'].forEach(ele => {
                  // 官方推荐
                  if (ele.name.includes('热门')) {
                    this.popupRecommend = ele.games;
                    this.setPopupRecommendList(this.popupRecommend);
                    this.hotGameList = ele.games.slice(0, 18);
                  }
                  // 存入左侧导航
                  if (ele.leftColumn) {
                    switch (ele.name) {
                      case "推荐游戏":
                        ele.id = 0;
                        break;
                      case "推荐捕鱼":
                        ele.id = 0;
                        break;
                      case "热门游戏":
                        ele.id = 1;
                        break;
                      case "热门捕鱼":
                        ele.id = 1;
                        break;
                      case "奖金池游戏":
                        ele.name = "奖池游戏";
                        ele.id = 2;
                        break;
                      case "最新游戏":
                        ele.id = 3;
                        break;
                      case "最新捕鱼":
                        ele.id = 3;
                        break;
                      case "街机游戏":
                        ele.id = 4;
                        break;
                      case "捕鱼游戏":
                        ele.id = 5;
                        break;
                      case "牛牛游戏":
                        ele.id = 6;
                        break;
                      case "百人游戏":
                        ele.id = 7;
                        break;
                      case "经典游戏":
                        ele.id = 8;
                        break;
                    }
                    localLeftNavList.push(ele);
                    // 存入右侧全部游戏选项
                  } else {
                    ele.name = resetName[ele.name];
                    localTypeList.push(ele);
                  }
                });
                localTypeList.push({
                  id: 100,
                  name: "收藏",
                  list: []
                });
              }
              if (listItem.name.indexOf('平台') != -1) {
                localLeftNavList = localLeftNavList.concat(list[i]['list']);
                localLeftNavList.forEach((ele, i) => {
                  if (ele.name.includes('全部')) {
                    ele.name = "全部游戏";
                    let changeId = {
                      "10001" : 99,
                      "10004" : 98,
                      "10005" : 97,
                    }
                    ele.id = changeId[this.typeId]
                    if(ele.games && ele.games.length) {
                      this.$set(localTypeList[0], "games", ele.games);
                    }else {
                      this.$set(localTypeList[0], "list", ele.list);
                    }
                    this.getArrayList(ele);
                  } else if (ele.name === "彩金池游戏") {
                    ele.name = "奖池游戏";
                  }
                  if([97,98,99].includes(ele.id)) {
                    ele["icon"] = this.idConfig[ele.id].icon
                      ? this.idConfig[ele.id].icon
                      : "";
                  }else if(ele.id <= 8) {
                    ele["icon"] = this.idConfig[[ele.id]]
                      ? this.idConfig[[ele.id]].icon
                      : "";
                  }
                  else if(ele.id !== 9){
                    ele["icon"] = this.idConfig[ele.gcid]
                      ? this.idConfig[ele.gcid].icon
                      : "";
                  }
                });
              }
            })
            if(!this.typeList.length) {
              this.typeList = localTypeList
            }
            try {
              localStorage.setItem(
                `${this.typeId}leftNavList`,
                JSON.stringify(localLeftNavList)
              );
              localStorage.setItem(
                `${this.typeId}typeList`,
                JSON.stringify(localTypeList)
              );
            }catch (err){
              console.log(err)
            }
            //防止二次渲染兼容我的最爱列表
            if(this.leftNavList.length === 1 ){
              this.leftNavList.push(localLeftNavList)
            }else {
              this.leftNavList = localLeftNavList;
            }
              //c模式去掉pt电子
              if(this.personalMode === 'mode_c' && this.$config.name !== 'kkqp' && this.$config.name !== '99qp') {
                this.leftNavList.forEach((item,i) => {
                  if(item.name === 'PT电子') {
                    this.leftNavList.splice(i,1)
                  }
                })
              }
              this.leftListArr = []
              for (let i = 0; i < this.leftNavList.length; i++) {
                this.leftListArr[i] = i;
              }
              let isNavId = false
              if(this.$route.query.navId) {
                this.leftNavList.forEach((item,i) => {
                  if(this.$route.query.navId == item.gcid) {
                    this.current = i;
                    this.changeLeftNav(item, true);
                    isNavId = true
                  }
                })
                this.$nextTick(()=>{
                  if(!isNavId) {
                    this.showToastText('当前游戏不存在，请尝试其它游戏！');
                    this.current = 0;
                    this.changeLeftNav(this.leftNavList[0], true);
                  }
                })
                }else {
                  this.changeLeftNav(this.leftNavList[0], true);
                }
              this.initScroll();
              this.$refs.cubeNavBar && this.$refs.cubeNavBar.refresh();
            this.$refs.rightScroll && this.$refs.rightScroll.refresh();
            this.$nextTick(() => {
              this.$refs.rightScroll && this.$refs.rightScroll.refresh();
            });
          }
        }
      });
    },
    changeLeftNav(item, isFirst = false) {
      if (this.leftNavActive !== item.id) {
        this.resetData();
        this.leftNavActive = item.id;
        this.changeBannerList();
        if (item.list instanceof Array && item.list.length) {
          this.setTypeList(item);
        } else {
          this.setShowGameList(item, isFirst);
        }
      }
    },
    changeHandler(index) {
      this.current = index;
      this.changeLeftNav(this.leftNavList[index]);
    },
    setTypeList(item) {
      this.allGameList = [];
      this.showGameList = [];
      this.gameTypeList = [];
      this.gameTypeActive = 0;
      this.lineList = [];
      this.lineActive = 0;
      if (item.id === 99 || item.id === 98 || item.id === 97) {
        this.typeListAction = 0;
      }
      if (item.list instanceof Array && item.list.length) {
        this.setGameTypeList(item.list);
      } else {
        this.setShowGameList(item);
      }
    },
    navChangeHandle(index) {
      this.searchGame = "";
      this.allGameList = [];
      this.showGameList = [];
      this.gameTypeList = [];
      this.gameTypeActive = 0;
      this.lineList = [];
      this.lineActive = 0;
      if (this.typeList[index].name === "收藏") {
        if (!this.$store.state.user.userInfo || !this.$store.state.user.token) {
          this.$router.push("/admin/login");
        }
        let obj = {
          games: this.collectList
        };
        this.setShowGameList(obj);
      } else {
        if (this.typeList[index].list instanceof Array && this.typeList[index].list.length) {
          this.setGameTypeList(this.typeList[index].list, true);
        } else {
          this.setShowGameList(this.typeList[index]);
        }
      }
    },
    setGameTypeList(_gameTypeList) {
      this.allGameList = [];
      this.showGameList = [];
      this.lineList = [];
      this.lineActive = 0;
      if (_gameTypeList instanceof Array && _gameTypeList.length) {
        _gameTypeList.forEach( item => {
          if (item.name === "老虎机游戏") {
            this.$set(item, "name", "老虎机");
          }else if (item.name === "全部游戏") {
            this.$set(item, "name", "全部");
          }
          this.gameTypeList.push(item);
        });
         if (this.gameTypeList && this.gameTypeList.length > 0) {
            this.setLineList(this.gameTypeList[0], 0);
          }
      } else {
        this.setShowGameList(_gameTypeList);
      }
    },
    setLineHandle(index) {
      this.setLineList(this.gameTypeList[index], index);
    },
    setLineList(item, index) {
      this.lineList = [];
      this.lineActive = 0;
      let _lineList = item;
      if (_lineList.games instanceof Array && _lineList.games.length) {
        this.setShowGameList(_lineList)
      } else {
        for (const key in _lineList['list']) {
          this.lineList.push(_lineList['list'][key]);
        }
        if (this.lineList && this.lineList.length > 0) {
          this.setShowGameList(this.lineList[0]);
        }else {
          this.setShowGameList(item);
        }
      }
    },
    setShowGameHandle(index) {
      this.setShowGameList(this.lineList[index]);
    },
    setShowGameList(item, isFirst) {
      this.toastClear();
      this.isShow = false;
      this.currentPage = 0;
      this.allGameList = item.games;
      this.showGameList = [];
      this.returnTop();
      if (this.allGameList.length > this.pageShowGame) {
        this.gameListSlice(
          this.allGameList.slice(this.currentPage, this.pageShowGame)
        );
      } else {
        this.showGameList = this.setCollectList(this.allGameList);
      }
      setTimeout(() => {
        this.isShow = true;
        this.initScroll();
      }, 0);
      setTimeout(() => {
        this.$refs.animationBox &&
          (this.$refs.animationBox.className = "animation-box");
      }, 200);
    },
    gameListSlice(list) {
      this.showGameList.push(...this.setCollectList(list));
    },
    setCollectList(list) {
      list.forEach((listItem) => {
        this.checkImgExists(listItem);
      });
      return list;
    },
    returnTop() {
      if (this.$refs.rightScroll) {
        this.$refs.rightScroll.scroll.stop();
        this.$refs.rightScroll.scroll.scrollTo(0, 0, 0);
      }
    },
    resetData() {
      this.leftNavActive = null;
      this.typeListAction = 0;
      this.allGameList = [];
      this.showGameList = [];
      this.gameTypeList = [];
      this.gameTypeActive = 0;
      this.lineList = [];
      this.lineActive = 0;
    },
    //加入收藏
    collectHandle(item) {
      if (!this.$store.state.user.userInfo || !this.$store.state.user.token) {
        this.$router.push("/admin/login");
      } else {
        if (this.searchGame) {
          this.addHistorylist();
        }
        if (this.collectClick) {
          this.collectClick = false;
          if (item.isCollect) {
            this.cancelCollect(item);
          } else {
            this.joinCollect(item);
          }
        }
      }
    },
    joinCollect(item, isPopupEmit) {
      let arr = [];
      let type = "";
      switch (this.typeId) {
        case "10001":
          type = "slot";
          break;
        case "10004":
          type = "chess";
          break;
        case "10005":
          type = "fish";
          break;
      }
      this.leftNavList.forEach(ele => {
        let Obj = {
          id: ele.id,
          name: ele.name
        };
        arr.push(Obj);
      });
      let orName = "";
      arr.forEach(val => {
        if (Number.parseFloat(val.id) === Number.parseFloat(item.upid)) {
          orName = val.name;
        }
      });
      this.$set(item, "isCollect", true);
      this.$store
        .dispatch("games/collectGame", {
          game_name: item.name,
          game_desc: JSON.stringify({
            ...item,
            love: "yes",
            orName: orName
          }),
          type: type
        })
        .then(res => {
          if (res.code == 200) {
            this.getMemberCollectGames(isPopupEmit);
            if (!isPopupEmit) {
              this.showToastText(`${item.name}收藏成功`);
            }
          } else if (res.code == 400) {
            if (!isPopupEmit) {
              this.showToastText(`${item.name}已收藏`);
            }
            item.isCollect = true;
          } else {
            if (!isPopupEmit) {
              this.showToastText(`${item.name}收藏失败`);
            }
          }
          setTimeout(() => {
            this.collectClick = true;
          }, 300);
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancelCollect(item, isPopupEmit) {
      this.$store
        .dispatch("games/deleteCollectGame", {
          deleteids: item.sortid
        })
        .then(res => {
          if (res.code == 200) {
            item.isCollect = false;
            this.collectList.forEach((ele, i) => {
              if (
                ele.upid === item.upid &&
                ele.id === item.id &&
                !isPopupEmit
              ) {
                this.collectList.splice(i, 1);
              }
            });
            this.$nextTick(() => {
              if (this.showGameList.length > 0) {
                this.setCollectList(this.showGameList);
              }
            });
            if (!isPopupEmit) {
              this.showToastText(`${item.name}取消收藏`);
            }
          } else {
            if (!isPopupEmit) {
              this.showToastText(`${item.name}取消收藏失败`);
            }
          }
          setTimeout(() => {
            this.collectClick = true;
          }, 300);
        })
        .catch(err => {
          console.log(err);
        });
    },
    clickGameHandle(item) {
      item.type = "game";
      item.isgame = true
      if (this.searchGame) {
        this.addHistorylist();
      }
      this.onGameClick(item);
    },
    addHistorylist() {
      this.historylist.forEach((item, i) => {
        if (item === this.searchGame) {
          this.historylist.splice(i, 1);
        }
      });
      this.historylist.unshift(this.searchGame);
    },
    changeIsFocus(bool) {
      this.isFocusSearch = bool;
      if (bool) {
        document.querySelector(".van-field__control").focus();
      } else {
        this.searchGame = "";
        setTimeout(() => {
          this.initScroll();
        }, 300);
      }
    },
    changeSearchGame(name, isHot) {
      this.searchGame = name;
      if (isHot) {
        this.addHistorylist();
      }
      document.querySelector(".van-field__control").focus();
    },
    getArrayList(obj) {
      if (obj.list instanceof Array && obj.list.length) {
        this.getArrayList(obj.list[0]);
      } else {
        this.allSearchGameList = obj.games;
        this.showSearchGameList = obj.games;
      }
    },
    //判断图片是否成功访问
    checkImgExists(item) {
      var ImgObj = new Image();
      if(this.leftNavList[this.current].name.indexOf('最爱') != -1) {
        ImgObj.src = item.icon;
      }else {
        ImgObj.src = this.publicStaticHost + '/images/'+ item.icon;
      }
      this.$set(item, "imgExists", true);
      ImgObj.onerror = () => {
        this.$set(item, "imgExists", false);
      };
    },
    changeShowReturnTop(bool) {
      this.showReturnTop = bool;
    },
    // 数组内对象去重
    setPopupRecommendList(arr) {
      const result = [];
      const duplicatesIndices = [];
      arr.forEach((current, index) => {
        if (duplicatesIndices.includes(index)) return;
        result.push(current);
        for (
          let comparisonIndex = index + 1;
          comparisonIndex < arr.length;
          comparisonIndex++
        ) {
          const comparison = arr[comparisonIndex];
          const currentKeys = Object.keys(current);
          const comparisonKeys = Object.keys(comparison);
          if (currentKeys.length !== comparisonKeys.length) continue;
          const currentKeysString = currentKeys.sort().join("").toLowerCase();
          const comparisonKeysString = comparisonKeys
            .sort()
            .join("")
            .toLowerCase();
          if (currentKeysString !== comparisonKeysString) continue;
          let valuesEqual = true;
          for (let i = 0; i < currentKeys.length; i++) {
            const key = currentKeys[i];
            if (current[key] !== comparison[key]) {
              valuesEqual = false;
              break;
            }
          }
          if (valuesEqual) duplicatesIndices.push(comparisonIndex);
        } // end for loop
      }); // end arr.forEach()
      this.popupRecommend = result;
    },
    showToastText(text) {
      this.toastText(text, "middem");
    },
  },
};
</script>

<style lang="less" scoped>
.newqp-view {
  background: #000;
}
/deep/.van-tabs::after {
  border-bottom: none;
}
.gray-bar {
  height: 0.2rem;
  width: 100%;
  background-color: #000;
}
.header-top {
  overflow: hidden;
  flex-wrap: wrap;
  background-color: #fff !important;
  font-family: Microsoft YaHei !important;
  height: 0.88rem;
  background-color: #080808 !important;
  border-bottom: 0.02rem solid rgba(248, 248, 248, 0.1);
  /deep/ .van-cell {
    input {
      color: #fff !important;
      font-size: 0.36rem;
      width: 5.5rem;
      &::-webkit-input-placeholder {
        color: #fff !important;
      }
      &:-moz-placeholder {
        color: #fff !important;
      }
      &::-moz-placeholder {
        color: #fff !important;
      }
      &:-ms-input-placeholder {
        color: #fff !important;
      }
    }
  }
  .h-back {
    position: absolute;
    top: 0.2rem;
    left: 0.25rem;
    width: 0.28rem;
  }
  .top-bar1 {
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    height: 0.88rem;
    width: 100%;
    z-index: 1;
    &.FocusSearch {
      left: -100%;
    }
    .search-box {
      width: 3rem;
      margin-left: 0.9rem;
    }
    .search-text {
      float: left;
      width: 4.5rem;
      height: 0.5rem;
      line-height: 0.53rem;
      margin: -0.42rem 0 0 0.5rem;
      font-size: 0.36rem;
      color: #fff;
      text-align: left;
    }
    .control-btn {
      position: absolute;
      right: 0.35rem;
      top: 50%;
      transform: translateY(-50%);
      width: 0.38rem;
      height: 0.38rem;
    }
    .search-icon {
      float: left;
      margin-top: 0.25rem;
      width: 0.36rem;
      height: 0.36rem;
    }
  }
  .top-bar2 {
    position: absolute;
    left: 100%;
    top: 0;
    width: 100%;
    height: 0.76rem;
    z-index: 2;
    &.FocusSearch {
      left: 0%;
    }
    // .search-box{
    //     width:2.53rem;
    //     margin:0 auto;
    // }
    .search-icon {
      position: absolute;
      top: 55%;
      margin-top: -0.16rem;
      left: 0.9rem;
      width: 0.36rem;
      height: 0.36rem;
    }
    .search-placeholder {
      position: absolute;
      left: 1.4rem;
      color: #fff;
      font-size: 0.36rem;
    }
    .van-search {
      position: relative;
      width: 3.85rem;
      padding: 0;
      margin-top: 0.06rem;
      margin-left: 1.2rem;
      border-radius: 0.35rem;
      font-weight: normal;
      .van-search__content {
        border-radius: 0;
        background: none;
        /deep/ .van-cell {
          font-size: 0.28rem;
          input {
            color: #eaaeae;
            font-size: 0.36rem;
            width: 5.5rem;
            &::-webkit-input-placeholder {
              color: #eaaeae;
            }
            &:-moz-placeholder {
              color: #eaaeae;
            }
            &::-moz-placeholder {
              color: #eaaeae;
            }
            &:-ms-input-placeholder {
              color: #eaaeae;
            }
          }
        }
      }
    }
    .clear-icon {
      position: absolute;
      right: 0.35rem;
      top: 55%;
      transform: translateY(-50%);
      width: 0.3636rem;
      height: 0.3636rem;
    }
  }
}
.content {
  overflow: hidden;
  font-family: Microsoft YaHei !important;
  .left-box {
    background: linear-gradient(180deg, #171717 0%, #0b0b0b 100%) !important;
  }
  .game-list {
    width: 100%;
    margin: 0 auto;
    li {
      width: 1.68rem;
      height: 2.18rem;
      margin: 0 0 0.2rem 0.18rem;
      font-size: 0;
      position: relative;
      border-radius: 0.1rem;
      box-shadow: 0 0.03rem 0.16rem 0 rgba(0, 0, 0, 0.08);
      background: #000;
      .error-icon {
        position: absolute;
        left: 50%;
        top: 0.35rem;
        transform: translateX(-50%);
        width: 1.5rem;
      }
      .error-img {
        width: 1.68rem;
        height: 1.68rem;
        border-radius: 0.1rem;
      }
      .game-list-img {
        width: 1.68rem;
        height: 1.68rem;
        border-radius: 0.1rem;
        &[lazy="loading"] {
          background: url("../../../assets/img/game/new-game/loading.gif")
            no-repeat;
          background-position: 50% 50%;
        }
      }
      .game-bottom {
        position: relative;
        height: 0.5rem;
        line-height: 0.5rem;
        text-align: center;
        .game-name {
          display: block;
          color: #fff;
          font-size: 0.22rem;
          max-width: 1.88rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .fish-game-scroll {
    .game-list {
      li {
        width: 2.13rem;
        height: 2.63rem;
        margin: 0 0 0.2rem 0.28rem;
        .game-list-img {
          width: 2.13rem;
          height: 2.13rem;
          border-radius: 0.1rem;
        }
        .error-img {
          width: 2.13rem;
          height: 2.13rem;
          border-radius: 0.1rem;
        }
        .error-icon {
          top: 0.7rem;
          width: 1.1rem;
        }
        .game-bottom {
          .game-name {
            max-width: 1.62rem;
          }
        }
      }
    }
  }
  .search-box {
    padding-top:0.1rem;
    .game-list {
      width: 100%;
      li {
        width: 1.17rem;
        height: 1.56rem;
        margin: 0 0 0.2rem 0.28rem;
        font-size: 0;
        position: relative;
        border-radius: 0.1rem;
        box-shadow: 0 0.03rem 0.16rem 0 rgba(0, 0, 0, 0.08);
        .error-icon {
          position: absolute;
          top: 0.7rem;
          left: 50%;
          transform: translateX(-50%);
          width: 1.1rem;
        }
        .error-img {
          width: 1.17rem;
          height: 1.17rem;
          border-radius: 0.1rem;
        }
        .game-list-img {
          width: 1.17rem;
          height: 1.17rem;
          border-radius: 0.1rem;
          &[lazy="loading"] {
            background: url("../../../assets/img/game/new-game/loading.gif")
              no-repeat;
            background-position: 50% 50%;
          }
        }
        .game-bottom {
          position: relative;
          height: 0.38rem;
          line-height: 0.38rem;
          text-align: left;
          padding-left: 0.1rem;
          .game-name {
            display: block;
            color: #fff;
            font-size: 0.22rem;
            max-width: 1.62rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  .left-nav {
    width: 1.7rem;
    overflow: hidden;
    box-shadow: 1px 0px 0.16rem rgba(0, 0, 0, 0.08);
    background: #000;
    /deep/ .cube-scroll-wrapper {
      width: 100%;
      background: linear-gradient(180deg, #171717 0%, #0b0b0b 100%) !important;
      .cube-scroll-nav-bar-item {
        position: relative;
        width: 100%;
        height: 0.84rem;
        line-height: 0.84rem;
        color: #fff;
        font-weight: 400;
        padding: 0;
        border-bottom: 0.02rem solid #2b2b2b;
        &:last-child {
          border-bottom: none;
        }
        .borderRadius {
          width: 100%;
          height: 100%;
          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .item-area {
            width: 1.35rem;
            height: 100%;
            margin: 0 auto;
            position: relative;
            .game-name {
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              width: 100%;
              font-size: 0.27rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #fff;
              font-weight: 400;
            }
          }
        }
        &:first-child {
          .item-area {
            border-top: none;
          }
        }
        &.cube-scroll-nav-bar-item_active {
          color: #fff;
          .item-area {
            border-top: none;
            font-weight: bold;
            .game-name {
              color: #fff;
              font-weight: bold;
            }
          }
          & + .cube-scroll-nav-bar-item {
            .item-area {
              border-top: none;
            }
          }
          .theme-agent-tab-active {
            background-color: #f6cf32;
            .game-name {
              color: #000000 !important;
            }
          }
        }
      }
    }
    /deep/.theme-agent-tab-active {
      background: #c82721;
    }
    /deep/.cube-scroll-nav-bar-item_active .item-area .game-name {
      font-weight: 500 !important;
    }
  }
  @keyframes fade {
    0% {
      opacity: 0;
      transform: translateY(0.23rem);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .top-nav {
    height: 0.5rem;
    margin-bottom: 0.2rem;
    padding: 0 0.21rem 0 0.18rem;
    position: unset;
    /deep/.van-tabs__wrap {
      height: 0.56rem;
      line-height: 0.59rem;
      overflow: hidden;
      .van-tabs__nav--complete {
        padding: 0;
      }
      .van-tabs__line {
        display: none;
      }
      .van-tab {
        min-width: 1.02rem;
        height: 101%;
        line-height: 0.59rem;
        display: inline-block;
        border-radius: 0.07rem;
        text-align: center;
        background: #222;
        margin-right: 0.2rem;
        color: #fff;
        font-size: 0.26rem;
        flex: none;
        float: left;
        &:nth-last-child(2) {
          margin-right: 0;
        }
      }
    }
  }
  .top {
    padding: 0 0.21rem 0 0.18rem;
    .newGameVanTabs {
      margin-top: 0.2rem;
    }
    /deep/ .van-tabs {
      position: unset;
      flex-basis: 22%;
      .van-tabs__wrap {
        height: 0.56rem;
        line-height: 0.56rem;
        .van-tabs__nav--complete {
          padding: 0;
        }
        .van-tab {
          min-width: 1.02rem;
          height: 101%;
          line-height: 0.59rem;
          display: inline-block;
          border-radius: 0.07rem;
          text-align: center;
          background: #222;
          margin-right: 0.2rem;
          color: #fff;
          flex: none;
          float: left;
          font-size: 0.27rem;
          &:nth-last-child(2) {
            margin-right: 0;
          }
        }
        .van-tab--active {
          background: #c62721 !important;
          color: #fff !important;
        }
      }
    }
  }
  /deep/ .van-tabs {
    .van-tabs__wrap {
      .van-tab {
        background: linear-gradient(
          180deg,
          #171717 0%,
          #0b0b0b 100%
        ) !important;
        &.van-tab--active {
          background: #f6cf32 !important;
          color: #000000 !important;
          font-weight: 500 !important;
        }
      }
    }
  }
  .game-area {
    margin-top: 0.2rem;
  }
  .right-game {
    position: relative;
    color: #333;
    width: calc(100vw - 1.7rem);
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #000;
    .right-scroll-box {
      position: relative;
      overflow: hidden;
      flex: 1;
    }
    .animation-box {
      height: 100%;
      overflow: hidden;
      transform: translateY(0);
      animation: fade 0.3s forwards;
    }
    .vux-slider {
      width: 100%;
      // margin-bottom: 0.2rem;
    }
    .right-game-scroll {
      min-height: 100%;
      .swiper-area {
        margin-bottom: 0.2rem;
      }
    }
  }
  &.blush-content {
    /deep/.van-tabs__nav {
      background-color: #530107 !important;
      .van-tab {
        background: linear-gradient(180deg, #95000D 0%, #72010B 100%) !important;
      }
    }
    .left-nav /deep/.cube-scroll-wrapper {
      background: linear-gradient(180deg, #95000D 0%, #72010B 100%) !important;
      .cube-scroll-nav-bar-item {
        border-bottom:0.02rem solid #901B25;
      }
    }
    .game-list .fl {
      background-color: #8B010D;
    }
  }
}
.returnTop {
  position: fixed;
  bottom: -1rem;
  right: 0.08rem;
  width: 0.8rem;
  height: 0.8rem;
  background: url("../../../assets/img/game/new-game/return-top.png") no-repeat;
  background-size: contain;
  border-radius: 50%;
  transition: all 0.2s linear;
  &.showReturnTop {
    bottom: 1rem;
  }
}
.list-empty {
  flex: 1;
  overflow: hidden;
  font-size: 0;
  .no-data {
    width: 4.52rem;
    height: 5.01rem;
    margin: 1.6rem auto 0;
  }
  .info {
    padding-bottom: 0.2rem;
    color: #333;
    font-size: 0.3rem;
    margin-top: -0.36rem;
  }
}
.search-hint {
  .history {
    max-height: 3.94rem;
    overflow: hidden;
    padding: 0 0 0.1rem 0.31rem;
    .title {
      height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.3rem;
      font-weight: bold;
      color: #fff;
      text-align: left;
      overflow: hidden;
      position: relative;
      .delete-icon {
        position: absolute;
        right: 0.35rem;
        top: 50%;
        transform: translateY(-50%);
        width: 0.29rem;
        height: 0.32rem;
      }
    }
    .hint-item {
      float: left;
      height: 0.63rem;
      line-height: 0.63rem;
      padding: 0 0.25rem;
      color: #333;
      background-color: #f5f5f5;
      font-size: 0.28rem;
      margin-right: 0.3rem;
      margin-bottom: 0.16rem;
    }
  }
  .hot {
    .title {
      height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.3rem;
      font-weight: bold;
      color: #fff;
      text-align: left;
      overflow: hidden;
      padding-left: 0.3rem;
      img {
        margin-top: 0.09rem;
        width: 0.2729rem;
        height: 0.2826rem;
      }
    }
    .list {
      overflow: hidden;
      border-top: 0.015rem solid #282828;
      .hot-item {
        width: 33.33%;
        height: 0.85rem;
        padding: 0.15rem 0;
        float: left;
        box-sizing: border-box;
        text-align: center;
        font-size: 0.28rem;
        color: #fff;
        border-bottom: 0.015rem solid #282828;
        .hot-name {
          height: 0.53rem;
          line-height: 0.53rem;
          border-right: 0.015rem solid #282828;
          text-align: left;
          padding-left: 0.3rem;
          width: 2.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:nth-child(3n) {
            border-right: 0;
          }
        }
        // .hot-name:last-child{
        //     border-right: none;
        // }
      }
    }
    .no-hotGame-list {
      img {
        width: 4.52rem;
        height: 5.01rem;
        margin: 0.3rem auto 0;
      }
      .info {
        padding-bottom: 0.2rem;
        color: #333;
        font-size: 0.3rem;
        margin-top: -0.36rem;
      }
    }
  }
}
/deep/.auto-box-content {
  background: #000;
}
/deep/.van-tabs::after {
  border-bottom: none;
}
</style>
