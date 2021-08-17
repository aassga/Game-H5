<template>
  <view-page style="background-color:#F6F6F6" header-touch full-box :noScroll="true" ref="viewPage">
    <title-header
      slot="header"
      class="header-top"
      v-no-touch-move
      :isShowback="false"
      style="background-color:#fff !important"
    >
      <div :class="[{FocusSearch:isFocusSearch},'top-bar1']">
        <span class="header-back icon iconfont h5-icon-left-menu-ico" @click="goBack"></span>
        <img src="@src/assets/img/game/new-game/search-icon.png" class="search-icon" />
        <div class="search-text" @click="changeIsFocus(true)">游戏名称搜索</div>
        <img
          src="@src/assets/img/game/new-game/control-btn.png"
          class="control-btn"
          @click="showPopup = true"
        />
      </div>
      <div :class="[{FocusSearch:isFocusSearch},'top-bar2']" @click="changeIsFocus(true)">
        <span
          class="header-back icon iconfont h5-icon-left-menu-ico"
          @click.stop="changeIsFocus(false)"
        ></span>
        <img src="@src/assets/img/game/new-game/search-icon.png" class="search-icon" />
        <van-search
          ref="vanSearch"
          v-model="searchGame"
          placeholder="游戏名称搜索"
          shape="round"
          right-icon
          left-icon
          background="rgba(255, 255, 255, 0)"
          :clearable="false"
        />
        <img
          src="@src/assets/img/game/new-game/clear-icon.png"
          class="clear-icon"
          @click.stop="searchGame = ''"
          v-if="searchGame.length"
        />
        <img
          src="@src/assets/img/game/new-game/control-btn.png"
          class="control-btn"
          @click.stop="showPopup = true"
          v-else
        />
      </div>
      <div class="gray-bar"></div>
    </title-header>
    <div class="content newSolt" slot="content" ref="content">
      <div v-show="!isFocusSearch">
        <!-- 电子，棋牌并且左侧导航数据加载完成 -->
        <div
          class="clearfix"
          v-if="leftNavList.length > 0 && leftListArr.length > 0"
        >
          <div class="fl left-nav" ref="leftNav" v-if="leftListArr.length > 0">
            <cube-scroll-nav-bar
              direction="vertical"
              :current="current"
              :labels="leftListArr"
              :options='scrollOptions'
              ref="cubeNavBar"
            >
              <div
                slot-scope="props"
                :class="[current === props.index ? 'theme-agent-tab-active' : '']"
                @click="changeHandler(props.index)"
              >
                <img :src="current === props.index?leftNavList[props.index].icon_active:leftNavList[props.index].icon" alt />
                <div class="item-area">
                  <div class="game-name">{{ leftNavList[props.index].name}}</div>
                </div>
              </div>
            </cube-scroll-nav-bar>
          </div>
          <div class="fl right-game" ref="rightGame">
            <van-tabs
              class="top-nav"
              v-model="typeListAction"
              v-if="leftNavActive === 99 || leftNavActive === 98 || leftNavActive === 97"
              :swipe-threshold="5"
              @change="navChangeHandle"
              :border="false"
              :line-height="2.5"
            >
              <van-tab v-for="(item,i) in typeList" :title="item.name" :key="i"></van-tab>
            </van-tabs>
            <div
              class="top"
              v-if="leftNavActive > 10 && leftNavActive !== 99 && leftNavActive !== 98 && leftNavActive !== 97"
            >
              <van-tabs
                class="navTabs1 newGameVanTabs"
                v-model="gameTypeActive"
                v-if="gameTypeList && gameTypeList.length > 1"
                @change="setLineHandle"
                :line-width="0"
                :line-height="0"
                :border="false"
              >
                <van-tab v-for="(item,i) in gameTypeList" :title="item.name" :key="i"></van-tab>
              </van-tabs>
              <van-tabs
                v-model="lineActive"
                class="navTabs2 newGameVanTabs"
                v-if="lineList && lineList.length > 1"
                @change="setShowGameHandle"
                :line-width="0"
                :line-height="0"
                :border="false"
              >
                <van-tab v-for="(item,i) in lineList" :title="item.name" :key="i"></van-tab>
              </van-tabs>
            </div>
            <scroll-area
              class="right-scroll-box"
              ref="rightScroll"
              style="padding: 0"
              @load-down="onLoadMore"
              @changeShowReturnTop="changeShowReturnTop"
              :onDownMore="true"
            >
              <div class="right-game-scroll">
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
                <div
                  class="top"
                  v-if="leftNavActive < 10 || leftNavActive === 99 || leftNavActive === 98 || leftNavActive === 97" 
                >
                  <van-tabs
                    class="navTabs1 newGameVanTabs"
                    v-model="gameTypeActive"
                    v-if="gameTypeList && gameTypeList.length > 1"
                    @change="setLineHandle"
                    :line-width="0"
                    :line-height="0"
                    :border="false"
                  >
                    <van-tab v-for="(item,i) in gameTypeList" :title="item.name" :key="i"></van-tab>
                  </van-tabs>
                  <van-tabs
                    v-model="lineActive"
                    class="navTabs2 newGameVanTabs"
                    v-if="lineList && lineList.length > 1"
                    @change="setShowGameHandle"
                    :line-width="0"
                    :line-height="0"
                    :border="false"
                  >
                    <van-tab v-for="(item,i) in lineList" :title="item.name" :key="i"></van-tab>
                  </van-tabs>
                </div>
                <div class="animation-box" ref="animationBox" v-if="isShow">
                  <ul class="clearfix game-list" v-show="showGameList && showGameList.length > 0">
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
                      <span
                        :class="['span-1',{'modeB' : $config.home ==='vns'}]"
                        v-if="gameSortV4Note.data && gameSortV4Note.data[per.id] && gameSortV4Note.data[per.id]['series'] && idConfig[gameSortV4Note.data[per.id]['series']]"
                      >{{ idConfig[gameSortV4Note.data[per.id]['series']].name}}</span>
                      <span
                        class="span-2"
                        v-if="typeId !== '10004' && per.payline && per.payline !== '0'"
                      >{{Number(per.payline) ? per.payline + '线' : per.payline}}</span>
                      <div class="game-bottom">
                        <span class="game-name">{{ per.name }}</span>
                        <div class="game-collect" @click.capture.stop="collectHandle(per)">
                          <img
                            src="../../../assets/img/game/new-game/heart.png"
                            v-if="!per.isCollect"
                          />
                          <img src="../../../assets/img/game/new-game/heart_red.png" v-else />
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div v-if="!showGameList || showGameList.length < 1" class="list-empty">
                    <img class="no-data" src="@src/assets/img/game/new-game/no-data.png" alt />
                    <p class="info">暂无游戏</p>
                  </div>
                </div>
              </div>
            </scroll-area>
          </div>
        </div>
        <span :class="[{showReturnTop:showReturnTop},'returnTop','theme-bg']" @click="returnTop"></span>
      </div>
      <scroll-area v-show="isFocusSearch" class="right-scroll-box" style="padding: 0">
        <div style="height: 100%">
          <div class="search-hint" v-if="!searchGame.trim()">
            <div class="history" v-if="historylist.length" style="height:auto">
              <div class="title">
                搜索历史
                <img
                  src="@src/assets/img/game/new-game/delete-icon.png"
                  class="delete-icon"
                  @click="historylist = []"
                />
              </div>
              <div
                class="hint-item"
                v-for="(item,i) in historylist"
                :key="i"
                @click="changeSearchGame(item)"
              >{{item}}</div>
            </div>
            <div class="hot" style="height:auto">
              <div class="gray-bar" v-if="historylist.length"></div>
              <div class="title">
                热搜榜
                <img src="@src/assets/img/game/new-game/hot-search.png" class="hot-search" />
              </div>
              <div class="list" v-if="hotGameList && hotGameList.length">
                <div
                  class="hot-item"
                  v-for="(item,i) in hotGameList"
                  :key="i"
                  @click="changeSearchGame(item.name,true)"
                >
                  <div class="hot-name">{{item.name}}</div>
                </div>
              </div>
              <div v-else class="no-hotGame-list">
                <img class="no-data" src="@src/assets/img/game/new-game/no-data.png" alt />
                <p class="info">暂无游戏</p>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="search-box" ref="searchBox" v-if="!isLoding">
              <ul
                class="clearfix game-list"
                v-if="showSearchGameList && showSearchGameList.length > 0"
              >
                <li class="fl" v-for="(per, index) in showSearchGameList" :key="index">
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
                  <span
                    :class="['span-1',{'modeB' : $config.home ==='vns'}]"
                    v-if="gameSortV4Note.data && gameSortV4Note.data[per.id] && gameSortV4Note.data[per.id]['series'] && idConfig[gameSortV4Note.data[per.id]['series']]"
                  >{{ idConfig[gameSortV4Note.data[per.id]['series']].name}}</span>
                  <span
                    class="span-2"
                    v-if="typeId !== '10004' && per.payline && per.payline !== '0'"
                  >{{Number(per.payline) ? per.payline + '线' : per.payline}}</span>
                  <div class="game-bottom">
                    <span class="game-name">{{ per.name }}</span>
                    <div class="game-collect" @click.capture.stop="collectHandle(per)">
                      <img src="../../../assets/img/game/new-game/heart.png" v-if="!per.isCollect" />
                      <img src="../../../assets/img/game/new-game/heart_red.png" v-else />
                    </div>
                  </div>
                </li>
              </ul>
              <div v-else class="list-empty">
                <img class="no-data" src="@src/assets/img/game/new-game/no-data.png" alt />
                <p class="info">{{searchGame.trim() ? '未找到符合相关条件的游戏' : '暂无游戏'}}</p>
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
import idConfig from "./idConfig";
import popupBottom from "../new-game/popupBottom";
import scrollArea from "@src/components/scroll-area";
export default {
  name: "amhgGame",
  components: {
    "van-search": Search,
    "van-tab": Tab,
    "van-tabs": Tabs,
    swiper,
    swiperSlide,
    CubeScrollNavBar: ScrollNavBar,
    popupBottom,
    scrollArea
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
      collectClick: true,
      currentPage: 0,
      pageShowGame: 18,
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
      gameSortV4Note: {},
    };
  },
  watch: {
    searchGame(newVal, oldVal) {
      this.toastLoading("加载中");
      this.isLoding = true;
      clearTimeout(this.searchTimer);
      if (this.searchGame.trim()) {
        this.allSearchGameList = this.setCollectList(this.allSearchGameList);
        this.searchTimer = setTimeout(() => {
          this.showSearchGameList = this.allSearchGameList.filter(item => {
            if (item.name.includes(this.searchGame.trim())) {
              return item;
            }
          });
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
      handler: function(v) {
        this.siteId = v;
        this.getSlideshowList();
      },
      deep: true
    },
    '$store.state.main.gameSortV4Note'(newVal) {
      this.gameSortV4Note = newVal
    }
  },
  computed: {
    scrollOptions () {
        return {
          // bounce: false
          useTransition:  (this.$mobileDevice.osVersion.split('.')[0]>= 13 && this.$mobileDevice.osVersion.split('.')[1] >= 3) ? false : true
        }
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
      if(this.personalMode === 'mode_c') {
        this.leftNavList.forEach((item,i) => {
          if(item.name === 'PT电子') {
            this.leftNavList.splice(i,1)
          }
        })
      }
      if(this.$route.query.navId) {
        this.leftNavList.forEach((item,i) => {
          if(this.$route.query.navId == item.gcid) {
            this.current = i;
            this.changeLeftNav(item, true);
          }
        })
      }else {
        this.changeLeftNav(this.leftNavList[0], true);
      }
      for (let i = 0; i < navData.length; i++) {
        this.leftListArr[i] = i;
      }
    }
    this.getMemberCollectGames();
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
      let minH =
        document.querySelector(".cube-scroll-content") &&
        document.querySelector(".cube-scroll-content").offsetHeight +
          this.rem * 0.32;
      this.scrollHeight = clientH - 1.48 * this.rem;
      this.$refs.leftNav &&
        (this.$refs.leftNav.style.height =
          this.scrollHeight < minH
            ? this.scrollHeight - 1 + "px"
            : minH + "px");
      this.$refs.rightGame &&
        (this.$refs.rightGame.style.height = this.scrollHeight + "px");
      this.$refs.fishScroll &&
        (this.$refs.fishScroll.style.height = this.scrollHeight + "px");
      this.$refs.content &&
        (this.$refs.content.style.height =
          this.scrollHeight + this.rem * 0.2 + "px");
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
      this.$nextTick(res => {
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
          classId: this.typeId
        })
        .then(res => {
          if (res && res.code === 200) {
            this.AllBannerList = res.data;
            this.$nextTick(()=>{
              this.changeBannerList();
            })
          }
        })
        .catch(err => {});
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
          this.bannerList.forEach(item => {
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
        }else if(this.$config.name === 'fhcp' || this.$config.name === 'xpj83' ) {
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
                      ele["icon_active"] = this.idConfig[ele.id].icon
                        ? this.idConfig[ele.id].icon_active
                        : "";
                  }else if(ele.id <= 8) {
                    ele["icon"] = this.idConfig[[ele.id]]
                      ? this.idConfig[[ele.id]].icon
                      : "";
                      ele["icon_active"] = this.idConfig[[ele.id]]
                        ? this.idConfig[[ele.id]].icon_active
                        : "";
                  }
                  else if(ele.id !== 9){
                    ele["icon"] = this.idConfig[ele.gcid]
                      ? this.idConfig[ele.gcid].icon
                      : "";
                    ele["icon_active"] = this.idConfig[ele.gcid]
                      ? this.idConfig[ele.gcid].icon_active
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
              if(this.personalMode === 'mode_c') {
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
      list.forEach(listItem => {
        this.$set(listItem, "isCollect", false);
        this.checkImgExists(listItem);
        this.collectList.forEach(collectItem => {
          if (
            listItem.id === collectItem.id
          ) {
            this.$set(listItem, "sortid", collectItem.sortid);
            this.$set(listItem, "isCollect", true);
          }
        });
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
          const currentKeysString = currentKeys
            .sort()
            .join("")
            .toLowerCase();
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
    goBack(){
        this.$router.push({
          path: '/home',
          query: {
            homeGameType:this.typeId
          }
        })
    }
  }
};
</script>

<style lang="less" scoped>
.gray-bar {
  height: 0.2rem;
  width: 100%;
  background-color: #f6f6f6;
}
.header-top {
  overflow: hidden;
  flex-wrap: wrap;
  background-color: #fff !important;
  font-family: Microsoft YaHei !important;
  height: 1.08rem;
  .header-back {
    color: #070203;
  }
  .gray-bar {
    position: absolute;
    bottom: 0;
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
    .search-text {
      float: left;
      width: 5.2rem;
      height: 0.64rem;
      line-height: 0.64rem;
      margin: 0.12rem 0 0 1.5rem;
      font-size: 0.33rem;
      color: #7a7a7a;
      text-align: left;
    }
    .control-btn {
      float: right;
      width: 0.38rem;
      height: 0.38rem;
      margin-top: 0.25rem;
      margin-right: 0.33rem;
    }
    .search-icon {
      position: absolute;
      top: 50%;
      margin-top: -0.16rem;
      left: 1.05rem;
      width: 0.32rem;
      height: 0.32rem;
    }
  }
  .top-bar2 {
    position: absolute;
    left: 100%;
    top: 0;
    width: 100%;
    height: 0.88rem;
    z-index: 2;
    &.FocusSearch {
      left: 0%;
    }
    .search-icon {
      position: absolute;
      top: 50%;
      margin-top: -0.16rem;
      left: 1.05rem;
      width: 0.32rem;
      height: 0.32rem;
    }
    .van-search {
      position: relative;
      width: 3.85rem;
      height: 0.88rem;
      line-height: 0.88rem;
      padding: 0;
      margin-left: 1.5rem;
      border-radius: 0.35rem;
      overflow: hidden;
      font-weight: normal;
      .van-search__content {
        border-radius: 0;
        background: none;
        padding-left: 0.34rem;
        /deep/ .van-cell {
          font-size: 0.28rem;
          input {
            color: #000000;
            font-size: 0.33rem;
            width: 5.5rem;
            &::-webkit-input-placeholder {
              color: #7a7a7a;
            }
            &:-moz-placeholder {
              color: #7a7a7a;
            }
            &::-moz-placeholder {
              color: #7a7a7a;
            }
            &:-ms-input-placeholder {
              color: #7a7a7a;
            }
          }
        }
      }
    }
    .control-btn {
      position: absolute;
      right: 0.35rem;
      top: 50%;
      transform: translateY(-50%);
      width: 0.38rem;
      height: 0.38rem;
    }
    .clear-icon {
      position: absolute;
      right: 0.35rem;
      top: 50%;
      transform: translateY(-50%);
      width: 0.3636rem;
      height: 0.3636rem;
    }
  }
}
.content {
  padding-top: 0.2rem;
  overflow: hidden;
  font-family: Microsoft YaHei !important;
  background: #F6F6F6;
  .game-list {
    width: 100%;
    li {
      width: 2.42rem;
      margin: 0 0 0.2rem 0;
      font-size: 0;
      position: relative;
      border-radius: 0.1rem;
      box-shadow: 0 0.03rem 0.16rem 0 rgba(0, 0, 0, 0.08);
      .error-icon {
        position: absolute;
        left: 50%;
        top: 0.95rem;
        transform: translateX(-50%);
        width: 1.5rem;
      }
      .error-img {
        width: 2.42rem;
        height: 2.42rem;
        border-radius: 0.1rem;
      }
      .game-list-img {
        width: 2.42rem;
        height: 2.42rem;
        border-radius: 0.1rem;
        &[lazy="loading"] {
          background: url("../../../assets/img/game/new-game/loading.gif")
            no-repeat;
          background-position: 50% 50%;
        }
      }
      &:nth-child(2n) {
        margin: 0 0 0.2rem 0.28rem;
      }
      .span-1 {
        position: absolute;
        left: 0.11rem;
        top: 0.1rem;
        padding: 0 0.12rem;
        min-width: 0.742rem;
        height: 0.32rem;
        line-height: 0.32rem;
        font-size: 0.22rem;
        text-align: center;
        color: #fff;
        border-radius: 0.05rem;
        background: linear-gradient(
          133deg,
          rgba(11, 130, 254, 1) 0%,
          rgba(92, 168, 255, 1) 100%
        );
        &.modeB {
          background: linear-gradient(
            247deg,
            rgba(1, 190, 212, 1) 0%,
            rgba(96, 233, 249, 1) 100%
          );
        }
      }
      .span-2 {
        position: absolute;
        left: 0.11rem;
        top: 0.5rem;
        height: 0.32rem;
        line-height: 0.32rem;
        font-size: 0.22rem;
        text-align: center;
        color: #fff;
        border-radius: 0.05rem;
        background: linear-gradient(133deg, #4affed 0%, #0097ce 100%);
        min-width: 0.742rem;
        padding: 0 0.12rem;
      }
      .game-bottom {
        position: relative;
        height: 0.5rem;
        line-height: 0.5rem;
        text-align: left;
        padding-left: 0.1rem;
        .game-name {
          display: block;
          color: #000;
          font-size: 0.26rem;
          max-width: 1.88rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .game-collect {
          position: absolute;
          bottom: 0rem;
          right: 0rem;
          width: 0.9rem;
          height: 0.7rem;
          text-align: center;
          img {
            position: absolute;
            bottom: 0.09rem;
            right: 0.1rem;
            width: 0.32rem;
            height: 0.32rem;
          }
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
          .game-collect {
            img {
              position: absolute;
              width: 0.32rem;
              height: 0.32rem;
              right: 0.1rem;
              bottom: 0.1rem;
            }
          }
        }
      }
    }
  }
  .search-box {
    .game-list {
      width: 100%;
      li {
        width: 2.13rem;
        height: 2.63rem;
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
          width: 2.13rem;
          height: 2.13rem;
          border-radius: 0.1rem;
        }
        .game-list-img {
          width: 2.13rem;
          height: 2.13rem;
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
          text-align: left;
          padding-left: 0.1rem;
          .game-name {
            display: block;
            color: #000;
            font-size: 0.26rem;
            max-width: 1.62rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .game-collect {
            position: absolute;
            bottom: 0rem;
            right: 0rem;
            width: 0.9rem;
            height: 0.7rem;
            text-align: center;
            img {
              position: absolute;
              width: 0.32rem;
              height: 0.32rem;
              right: 0.1rem;
              bottom: 0.1rem;
            }
          }
        }
      }
    }
  }
  .left-nav {
    margin-left: 0.24rem;
    width: 1.6rem;
    overflow: hidden;
    border-radius: 0.15rem;
    padding-bottom: 0.32rem;
    /deep/.cube-scroll-nav-bar{
      background: none;
    }
    /deep/ .cube-scroll-wrapper {
      width: 100%;
      .cube-scroll-nav-bar-item {
        position: relative;
        width: 100%;
        height: 1rem;
        color: #111;
        font-weight: 400;
        padding: 0;
        border-radius: 0.15rem;
        margin-bottom: 0.3rem;
        background: #fff;
          img {
            height: 0.37rem;
            margin-top:0.1rem;
          }
          .item-area {
            width: 1.35rem;
            height: 100%;
            margin: 0 auto;
            .game-name {
              position: absolute;
              bottom: 0.1rem;
              left: 50%;
              transform: translateX(-50%);
              width: 100%;
              font-size: 0.26rem;
              font-weight: 500;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #A1A1B2;
              font-weight: 500;
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
        }
      }
      .theme-agent-tab-active{
        border-radius: 0.1rem;
        height: 1rem;
      }
    }
    .bottomIcon {
      position: relative;
      width: 100%;
      height: 0.38rem;
      z-index: 9999;
      .iconfont {
        position: absolute;
        left: 50%;
        top: 45%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        font-size: 0.26rem;
      }
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
  .right-game {
    position: relative;
    color: #333;
    margin-left: 0.28rem;
    width: calc(100vw - 2.368rem);
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    .top-nav {
      height: 0.5rem;
      margin-bottom: 0.2rem;
      position: unset;
      
      /deep/ .van-tabs__wrap {
        height: 0.52rem;
        overflow: hidden;
        border-bottom: 0.01rem solid #eeeeee;
        
        .van-tabs__nav--line {
          background: none!important;
          .van-tab {
            max-width: 25%;
            min-width: 1.02rem;
            height: 0.5rem;
            line-height: 0.4rem;
            display: inline-block;
            font-size: 0.3rem;
            text-align: center;
            -webkit-box-flex: 0;
            -webkit-flex: none;
            -ms-flex: none;
            flex: none;
            color: #000;
            margin-right: 0.038rem;
            &:nth-last-child(2) {
              margin-right: 0;
            }
          }
          .van-tabs__line {
            bottom: 0.3rem;
            max-width: 20%;
            min-width: 0.7rem;
          }
        }
      }
    }
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
    .top {
      /deep/ .van-tabs {
        position: unset;
        &.navTabs1 {
          margin-bottom: 0.2rem;
          .van-tab {
            font-size: 0.26rem;
          }
        }
        &.navTabs2 {
          margin-bottom: 0.2rem;
          .van-tab {
            font-size: 0.24rem;
          }
        }
        .van-tabs__wrap {
          height: 0.56rem;
          line-height: 0.56rem;
          .van-tabs__nav{
            background: none;
          }
          .van-tab {
            min-width: 1.02rem;
            height: 0.56rem;
            line-height: 0.56rem;
            display: inline-block;
            border-radius: 0.07rem;
            text-align: center;
            background: #fff;
            margin-right: 0.2rem;
            color: #000;
            flex: none;
            &:nth-last-child(2) {
              margin-right: 0rem;
            }
          }
          .van-tab--active {
            color: #fff!important;
          }
        }
      }
    }
    .right-game-scroll {
      min-height: 100%;
      .swiper-area {
        margin-bottom: 0.2rem;
      }
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
      color: #333;
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
      color: #333;
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
      border-top: 0.015rem solid #f4f4f4;
      .hot-item {
        width: 33.33%;
        height: 0.85rem;
        padding: 0.15rem 0;
        float: left;
        box-sizing: border-box;
        text-align: center;
        font-size: 0.28rem;
        color: #333;
        border-bottom: 0.015rem solid #f4f4f4;
        .hot-name {
          height: 0.53rem;
          line-height: 0.53rem;
          border-right: 0.015rem solid #f4f4f4;
          text-align: left;
          padding-left: 0.3rem;
          width: 2.5rem;
          overflow:hidden; 
          text-overflow:ellipsis; 
          white-space:nowrap; 
          &:nth-child(3n) {
            border-right: 0;
          }
        }
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
</style>
