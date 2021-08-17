<template>
  <view-page full-box isTransition class="theme-header-bg">
    <title-header v-if="id==='10000'" title="彩票游戏" class="theme-header-bg theme-header-bottom" back-event :isShowback="false" slot="header">
      <button class="back-btn" @click="back">
        <img src="../../../../assets/img/lottery/back.png" alt="">
        返回
      </button>
    </title-header>
    <title-header v-else :title="title" class="theme-header-bg theme-header-bottom" back-event @back="$router.replace('/home')" slot="header"></title-header>
    <div :class="['home-type','home-type-' + $config.home]" slot="content">
      <!--     棋牌 -->
      <div class="list" v-if="['10004'].includes(id)">
        <ul class="new_chess_ul">
          <li
            class="chess_li"
            :class="'lottery_icon_'+item.id"
            v-for="(item,i) in list"
            :key="i"
            @click.capture.stop="onGameClick(item)"
          >
            <div
              class="icon"
              :style="{ backgroundImage: 'url('+ item.icon +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
            ></div>
          </li>
        </ul>
      </div>
      <!--      棋牌-->
      <!--体育版面-->
      <template v-else-if="['10002','10003'].includes(id)">
        <div
          class="list sports-box theme-main-bg"
          v-if="$config.newSports && id === '10002' || $config.newLive && id === '10003'"
          :style="{minHeight: contHeight + 'px'}"
        >
          <cube-scroll
            ref="scroll"
            :data="list"
            direction="horizontal"
            class="horizontal-scroll-list-wrap scrollable"
            :options='scrollOptions'
          >
            <ul class="sports_ul scrollable" ref="sports_ul">
              <li
                :class="[list.length <=3 ?'sports_li':'sports_li_4','theme-gradient-bg',{'active':i===sportIndex},theme]"
                v-for="(item,i) in list"
                :key="i"
                @click="onSportChage(i)"
              >
                <div
                  v-if="['newbet','blr'].includes($config.name) &&item.id===11756"
                  class="icon"
                  :class="[{'active':i===sportIndex},'icon_365']"
                  :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/icon/3/'+theme+'/'+365+'.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                >
                  <span class="name theme-color-yellow-2">365体育</span>
                </div>
                <div
                  v-else
                  class="icon"
                  :class="[{'active':i===sportIndex},'icon_'+item.id]"
                  :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/icon/3/'+theme+'/'+item.id+'.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                >
                  <span class="name theme-color-yellow-2">{{item.name}}</span>
                </div>
              </li>
            </ul>
          </cube-scroll>
          <van-swipe
            @change="taJ=>sportChangeIndex(taJ)"
            :show-indicators="id == '10003' || (id == '10002' && !$config.blackTheme && !$config.newQP)"
            :loop="false"
            ref="sportSwipe"
            class="self-van-swipe"
          >
            <van-swipe-item v-for="(item,j) in list" :key="j">
              <div class="sports-swipe-box" v-if="id === '10002'">
                <div class="sports-banner" :class="{'sports-banner-top':9999===item.id}">
                  <div
                    class="sports-banner-img"
                    :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/banner/'+($config.blackTheme || $config.newQP?'black_'+item.id:$config.blush ?'blush_'+item.id:item.id)+'.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                  ></div>
                </div>
                <template v-if="item.id !== 9999">
                  <div
                    class="sports-ingame-btn"
                    :class="['ingame-btn-'+theme,{'theme-color-black' : $config.home === 'blush'}]"
                    @click.capture.stop="playerGame(item)"
                  >开始游戏</div>
                  <div
                    :class="['sports-remark',{'theme-color-yellow-3' : !$config.blush},{'theme-color-white' : $config.blush}]"
                    v-if="item.id === 38"
                  >亚洲最流行的体育平台，20年高效投注体验，世界一流的超高投注赔率，操作界面方便直观简单，每日数千场精彩赛事</div>
                  <div
                    :class="['sports-remark',{'theme-color-yellow-3' : !$config.blush},{'theme-color-white' : $config.blush}]"
                    v-else-if="item.id === 39"
                  >亚洲线上博彩老品牌，深受广大中国彩民的喜爱。高赔率、玩法新颖，为您提供最全面的体育赛事体验。</div>
                  <div
                    :class="['sports-remark',{'theme-color-yellow-3' : !$config.blush},{'theme-color-white' : $config.blush}]"
                    v-else-if="item.id === 11368"
                  >{{$config.blackTheme || $config.newQP? '源自全球领先平台商，新颖玩法，提供多元体育赛事投注，包含足球、棒球、篮球及橄榄球等世界主要体育专案，更在各项赛事中设计众多玩法，例如让球和大小、全场半场、波胆、最先进球/最后进球等。' : '源自全球领先平台商，新颖玩法，提供多元体育赛事投注，包含足球、棒球、篮球及橄榄球等世界主要体育专案。'}}</div>
                  <div
                    :class="['sports-remark',{'theme-color-yellow-3' : !$config.blush},{'theme-color-white' : $config.blush}]"
                    v-else-if="item.id === 11752"
                  >{{$config.blackTheme || $config.newQP? '亚洲最佳体育平台，每月最少有25,000场篮球，足球，网球和体育滚球赛事。提供市场最多投注盘口体育平台，快速结算，各式赔率 满足不同玩家' : '每月最少有25,000场篮球，足球，网球和体育滚球赛事。提供市场最多投注盘口体育平台，各式赔率 满足不同玩家'}}</div>
                  <div
                    :class="['sports-remark',{'theme-color-yellow-3' : !$config.blush},{'theme-color-white' : $config.blush}]"
                    v-else-if="item.id === 11754"
                  >曾获得亚洲年度运营商奖，在全球在线博彩平台中处于领先地位，每日近千场体育赛事满足不同玩家需求。</div>
                  <div
                    :class="['sports-remark',{'theme-color-yellow-3' : !$config.blush},{'theme-color-white' : $config.blush}]"
                    v-else-if="item.id === 11756"
                  >亚洲最知名的盘口，也是世界娱乐业中的旗帜。为您提供高质量、高赔率及最新的体育游戏。</div>
                  <div :class="['sports-remark',{'theme-color-yellow-3' : !$config.blush},{'theme-color-white' : $config.blush}]" v-else>更多平台敬请期待...</div>
                  <ul class="sports-memu-ul">
                    <li class="sports-memu-li">
                      <div class="icon">
                        <div
                          v-if="$config.home !== 'blush'"
                          class="icon-img"
                          :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/icon/memu/'+($config.blackTheme || $config.newQP?'black':item.id)+'/1.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                        ></div>
                        <div
                          v-else
                          class="icon-img"
                          :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/icon/memu/black/4.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                        ></div>
                      </div>
                      <span class="name theme-color-yellow-4" v-if="$config.blackTheme || $config.newQP">超高赔率</span>
                      <span class="name" style="color:#AA935B" v-else-if="$config.home === 'blush'">品牌悠久</span>
                      <span class="name" v-else-if="item.id === 38">超高赔率</span>
                      <span class="name" v-else-if="item.id === 39">品牌悠久</span>
                      <span class="name" v-else-if="item.id === 11752">亚洲最佳</span>
                      <span class="name" v-else-if="item.id === 11754">全球知名</span>
                      <span class="name" v-else-if="item.id === 11756">亚洲旗帜</span>
                      <span class="name" v-else-if="item.id === 11368">全球领先</span>
                      <span class="name" v-else>敬请期待</span>
                    </li>
                    <li class="sports-memu-li">
                      <div class="icon">
                        <div
                          class="icon-img"
                          :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/icon/memu/'+($config.blackTheme || $config.home === 'blush'?'black':item.id)+'/2.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                        ></div>
                      </div>
                      <span class="name theme-color-yellow-4" v-if="$config.blackTheme || $config.newQP">赛事最广</span>
                      <span class="name" style="color:#AA935B" v-else-if="$config.home === 'blush'">赛事最广</span>
                      <span class="name" v-else-if="item.id === 38">界面简单</span>
                      <span class="name" v-else-if="item.id === 39">赛事最广</span>
                      <span class="name" v-else-if="item.id === 11752">盘口最多</span>
                      <span class="name" v-else-if="item.id === 11754">运营稳健</span>
                      <span class="name" v-else-if="item.id === 11756">超高赔率</span>
                      <span class="name" v-else-if="item.id === 11368">新颖玩法</span>
                      <span class="name" v-else>敬请期待</span>
                    </li>
                    <li class="sports-memu-li">
                      <div class="icon">
                        <div
                          class="icon-img"
                          :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/icon/memu/'+($config.blackTheme || $config.newQP || $config.home === 'blush' ?'black':item.id)+'/3.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                        ></div>
                      </div>
                      <span class="name theme-color-yellow-4" v-if="$config.blackTheme || $config.newQP">最佳赔率</span>
                      <span class="name" style="color:#AA935B" v-else-if="$config.home === 'blush'">最佳赔率</span>
                      <span class="name" v-else-if="item.id === 38">高效体验</span>
                      <span class="name" v-else-if="item.id === 39">最佳赔率</span>
                      <span class="name" v-else-if="item.id === 11752">快速结算</span>
                      <span class="name" v-else-if="item.id === 11754">赛事众多</span>
                      <span class="name" v-else-if="item.id === 11756">服务高效</span>
                      <span class="name" v-else-if="item.id === 11368">多元投注</span>
                      <span class="name" v-else>敬请期待</span>
                    </li>
                    <li class="sports-memu-li">
                      <div class="icon">
                        <div
                          v-if="$config.home !== 'blush'"
                          class="icon-img"
                          :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/icon/memu/'+($config.blackTheme ?'black':item.id)+'/4.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                        ></div>
                        <div
                          v-else
                          class="icon-img"
                          :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/icon/memu/black/1.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                        ></div>
                      </div>
                      <span class="name theme-color-yellow-4" v-if="$config.blackTheme || $config.newQP">服务一流</span>
                      <span class="name" style="color:#AA935B" v-else-if="$config.home === 'blush'">服务一流</span>
                      <span class="name" v-else-if="item.id === 38">精彩赛事</span>
                      <span class="name" v-else-if="item.id === 39">服务一流</span>
                      <span class="name" v-else-if="item.id === 11752">各式赔率</span>
                      <span class="name" v-else-if="item.id === 11754">玩法丰富</span>
                      <span class="name" v-else-if="item.id === 11756">紧追潮流</span>
                      <span class="name" v-else-if="item.id === 11368">玩法众多</span>
                      <span class="name" v-else>敬请期待</span>
                    </li>
                  </ul>
                </template>
                <template v-else>
                  <div class="sports-no-game theme-color theme-color-yellow-2">更多平台敬请期待...</div>
                </template>
              </div>
              <div class="sports-swipe-box" v-if="id === '10003'">
                <div class="live-banner">
                  <div
                    class="live-banner-img"
                    :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/banner/'+($config.blackTheme || $config.newQP?'black_'+item.id:$config.blush ?'blush_'+item.id:item.id)+'.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                  ></div>
                  <div
                    class="live-ingame-btn theme-yellow-bg-3 theme-color-black"
                    :class="'ingame-btn-'+theme"
                    @click.capture.stop="playerGame(item)"
                  >开始游戏</div>
                </div>
              </div>
            </van-swipe-item>
            <div
              v-if="list && list.length && (id == '10003' || (id == '10002' && !$config.blackTheme && !$config.newQP))"
              :class="[id === '10002' ? 'sports-indicator-box' : 'live-indicator-box',{'sports-more':list[sportIndex].id === 9999}]"
              slot="indicator"
            >
              <i
                class="sports-indicator-i theme-bg-active active theme-yellow-bg"
                :class="{'opacity1':i===swipeSportIndex}"
                v-for="(item,i) in list"
                :key="i"
              ></i>
            </div>
          </van-swipe>
        </div>
        <div class="list" v-else-if="['10002'].includes(id)">
          <ul class="new_chess_ul">
            <li
              class="chess_li"
              :class="'lottery_icon_'+item.id"
              v-for="(item,i) in list"
              :key="i"
              @click.capture.stop="onGameClick(item)"
            >
              <div
                class="icon"
                :style="{ backgroundImage: 'url('+ item.icon +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
              ></div>
            </li>
          </ul>
        </div>
        <div class="list" v-else-if="['10003'].includes(id)">
          <ul class="live_ul" :class="{live_icon:id==='10003'}">
            <li
              class="live_li"
              :class="{'no-shadow':!item.icon}"
              v-for="(item,i) in list"
              :key="i"
              @click.capture.stop="onGameClick(item)"
            >
              <img class="icon" :src="item.icon" :class="['live_icon_'+item.id]" alt />
            </li>
          </ul>
        </div>
      </template>
      <!--   捕鱼   -->
      <div class="list" v-else-if="['10001','10005'].includes(id)">
        <ul class="live_ul" :class="{buyu_icon:id==='10005',game_icon:id==='10001'}">
          <li
            class="live_li"
            :class="{'no-shadow':!item.icon}"
            v-for="(item,i) in list"
            :key="i"
            @click.capture.stop="onGameClick(item)"
          >
            <img
              class="icon"
              :src="item.icon"
              :class="[{fish_img:id==='10005'},{slot_img:id==='10001'},'live_icon_'+item.id]"
              alt
            />
          </li>
        </ul>
      </div>
      <!--   捕鱼   -->

      <!--  彩票    -->
      <div class="list" v-else>
        <ul :class="['lottery_vns',{'theme-header-bg':$config.blackTheme || $config.newQP},{'theme-main-bg':$config.blush}]">
          <li
            class="item theme-main-bg-5"
            v-for="(item,i) in list"
            :key="i"
            @click.capture.stop="onGameClick(item)"
          >
            <img class="icon" :src="$config.blackTheme ? require('../../../../assets/img/black-error-img-lottery.png') : require('../../../../assets/img/error-img-lottery.png')" v-real-img="imgUrl(urlImg(item.icon))" alt/>
            <!--          <span class="icon" :class="'lottery_icon_'+item.id" @click="onGameClick(item)"></span>-->
            <div class="game_title">
              <span class="name theme-color-white">{{item.name}}</span>
              <span :class="['name',{'theme-color-gray-7':$config.blackTheme || $config.newQP},{'theme-color-gray':$config.blush}]">{{item.title}}</span>
            </div>
          </li>
        </ul>
      </div>

      <div slot="static">
        <slot></slot>
      </div>
    </div>
  </view-page>
</template>

<script>
import { scroll } from "cube-ui";
export default {
  name: "TypeVNS",
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      list: [],
      scrollHeight: 0,
      headerHeight: 0,
      animation: "",
      minContent: 0,
      sportIndex: 0,
      swipeSportIndex: 0,
      inGameLoging: true
    };
  },
  components: {
    cubeScroll: scroll
  },
  computed: {
    theme() {
      return this.$config.blackTheme || this.$config.newQP || this.$config.home === 'blush' ? 'black' : this.$store.state.main.theme;
    },
    title() {
      switch (this.id) {
        case "10004":
          return "棋牌游戏";
        case "10000":
          return "彩票游戏";
        case "10003":
          return "真人视讯";
        case "10005":
          return "捕鱼游戏";
        case "10001":
          return "电子游艺";
        case "10002":
          return "体育赛事";
        default:
          return "彩票游戏";
      }
    },
    contHeight() {
      return this.$store.state.main.windowHeight - this.rem * 0.88;
    },
    scrollOptions () {
      return {
        useTransition: (this.$mobileDevice.osVersion.split('.')[0]>= 13 && this.$mobileDevice.osVersion.split('.')[1] >= 3) ? false : true
      }
    },
  },
  watch: {
    sportIndex(newVal, oldVal) {
      let leftIndex = 0;
      if (newVal > oldVal) {
        if (newVal > 1) {
          leftIndex = newVal - 1;
          leftIndex =
            leftIndex > this.list.length - 4 ? this.list.length - 4 : leftIndex;
        }
      } else {
        if (newVal < this.list.length - 1) {
          leftIndex = newVal + 1;
          leftIndex = leftIndex - 3 >= 0 ? leftIndex - 3 : 0;
        }
      }
      this.$nextTick(() => {
        this.$refs.scroll.scrollTo(-leftIndex * (1.8 * this.rem), 0, 300);
      });
    }
  },
  created() {
    if (this.id) {
      const id = this.id;
      const idConfig = {
        10000:4,
        10001:2,
        10002:6,
        10003:5,
        10004:1,
        10005:3,
      }
      this.$store.dispatch("main/getNewGame", {
        idIndex: idConfig[id],
        id,
        callback: res => {
          if (res && res[id]) {
            this.list = res[id];
            if (id == 10000) {
                console.log('config:'+this.$config.home)
              const longDragonTheme = this.$config.name === '839qp' ? 'style41' : JSON.parse(localStorage.config).theme
               let icon = ""
              if(this.$config.home === 'qp'){
                 icon =localStorage.SiteStaticsUrl +
                  "/images/" +
                  longDragonTheme +
                  "/m/99996.png"
              } else if(this.$config.name === 'tyc86'){
              
                icon =localStorage.SiteStaticsUrl +
                  "/images/" +
                  'style28' +
                  "/20002/99996.png"
                
              } else{
              icon = localStorage.SiteStaticsUrl +
                  "/images/" +
                  longDragonTheme +
                  "/20002/99996.png"
              }
              this.list.unshift({
                id: 99996,
                name: "长龙助手",
                upid: 99996,
                title: "两面盘神器",
                icon:icon,
                series: 99996,
                tag: "HOT,JPT",
                code: "1042",
                type: "lottery"
              });
            }
            if (
              ["10001", "10005"].includes(this.id) &&
              this.list.length % 3 !== 0
            ) {
              this.list.push({});
            }
            if (id == 10002 && this.$config.newSports && this.list && this.list.length < 4) {
              //体育
              var temp = {
                id: 9999,
                name: "敬请期待"
              };
              this.list.push(temp);
            }
            this.$nextTick(() => {
              this.list.forEach((ele,i) => {
                if(ele.id == this.$route.query.gameId) {
                  this.sportIndex = i
                }
              });
            })
          }
        }
      });
    }
  },
  mounted() {},
  methods: {
    back() {
      if(sessionStorage['isCocos'] && sessionStorage['isCocos'] == '1') {
        if (/android/i.test(navigator.userAgent)){
          window.app.gohome()
        } else if (/ipad|iphone|iPod|iOS|mac/i.test(navigator.userAgent)){
          window.webkit.messageHandlers.gohome.postMessage(null);
        }
      }else {
        this.$router.replace('/home')
      }
    },
    imgUrl (url) {
      if(url.indexOf('99996.png') > 0) {
        return url
      }else {
        return this.publicStaticHost + '/images/'+ url
      }
    },
    onSportChage(index, item) {
      this.sportIndex = index;
      this.$refs.sportSwipe.swipeTo(index);
    },
    sportChangeIndex(index) {
      this.swipeSportIndex = index;
      this.sportIndex = index;
    },
    playerGame(item) {
      if (this.inGameLoging) {
        this.inGameLoging = false;
        this.onGameClick(item);
      }
      if (!this.inGameLoging) {
        setTimeout(() => {
          this.inGameLoging = true;
        }, 5000);
      }
    },
    urlImg(url) {
      if(this.$config.home === 'qp') {
        return url.replace('/20001/','/m/')
      }else {
        return url
      }
    },
    goBack(){
      if(this.$config.home==='amhg') {
        this.$router.push({
          path: '/home',
          query: {
            homeGameType:this.id
          }
        })
      }else{
        this.$router.replace('/home')
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../style/icon/home-icon-xpj";
/deep/ .cube-scroll-content {
  display: inline-block;
}
.self-van-swipe {
  transform:translate3d(0,0,0);
  overflow: hidden;
  .van-swipe-item {
    transform:translate3d(0,0,0);
  }
}

.back-btn {
  position: absolute;
  left: 0.22rem;
  font-size: 0.36rem;
  font-family: PingFang SC;
  font-weight: bold;
  display: flex;
  align-items: center;
  color: #fff;
  img {
    width: 0.48rem;
    height: 0.48rem;
    margin-right: 0.08rem;
  }
}
.home-type-hr {
  width: 100%;
  box-sizing: border-box;
  height: 0.2rem;
  background: none !important;
  min-height: 100%;
}

/*.live_icon {*/
/*  .icon {*/
/*    background-image: url("../../../../assets/img/game/live-icon.png");*/
/*    background-repeat: no-repeat;*/
/*    background-size: 13.51rem 4.8rem;*/
/*  }*/
/*}*/

/*.game_icon {*/
/*  .icon {*/
/*    background-image: url("../../../../assets/img/game/game-icon.png");*/
/*    background-repeat: no-repeat;*/
/*    background-size: 13.51rem 4.8rem;*/
/*  }*/
/*}*/

/*.buyu_icon {*/
/*  .icon {*/
/*    background-image: url("../../../../assets/img/game/buyu-icon.png");*/
/*    background-repeat: no-repeat;*/
/*    background-size: 13.51rem 4.8rem;*/
/*  }*/
/*}*/

.home-type {
  position: relative;
  width: 100%;
  height: 100%;

  /*.lottery_icon {*/
  /*  .icon {*/
  /*    display: block;*/
  /*    background-image: url("../../../../assets/img/home/xpj-icon-min.png");*/
  /*    background-repeat: no-repeat;*/
  /*    background-size: 12.74rem 20.283rem;*/
  /*  }*/
  /*}*/
  .sports-box {
    .sports-swipe-box {
      padding: 0 0.24rem 0.24rem;
    }

    .sports-banner {
      width: 7.02rem;
      height: 5.6rem;

      .sports-banner-img {
        width: 7.02rem;
        height: 5.6rem;
      }
    }

    .live-banner {
      width: 7.02rem;
      height: 8.44rem;
      position: relative;
      .live-banner-img {
        width: 7.02rem;
        height: 8.44rem;
      }
      .live-ingame-btn {
        position: absolute;
        left: 0.06rem;
        top: 3.1rem;
        width: 2.6rem;
        height: 0.8rem;
        line-height: 0.8rem;
        text-align: center;
        border-radius: 0.35rem;
        color: #ffffff;
        font-size: 0.38rem;
      }
    }

    .sports-banner-top {
      width: 7.02rem;
      height: 7.98rem;

      .sports-banner-img {
        width: 7.02rem;
        height: 7.98rem;
      }
    }

    .sports-ingame-btn {
      width: 3.8rem;
      height: 0.8rem;
      border-radius: 0.4rem;
      font-size: 0.4rem;
      color: #fff;
      font-weight: bold;
      margin: auto;
      line-height: 0.8rem;
      margin-bottom: 0.6rem;
    }

    .ingame-btn-default {
      background: linear-gradient(90deg, #4779ea, #7da6fb);
    }

    .ingame-btn-red {
      background: linear-gradient(90deg, #eb2736, #fe848e);
    }

    .ingame-btn-deepred {
      background: linear-gradient(90deg, #C62721, #fe848e);
    }
    .ingame-btn-yellow {
      background: linear-gradient(90deg,#f4d486, #ECBD49);
    }
    .ingame-btn-purple {
      background: linear-gradient(90deg, #1c7baf, #2ea9ed);
    }

    .ingame-btn-green {
      background: linear-gradient(90deg, #178453, #36cc89);
    }

    .ingame-btn-ferrari {
      background: linear-gradient(90deg, #eb312d, #fd7673);
    }

    .ingame-btn-gold {
      background: linear-gradient(90deg, #4859a2, #7088ed);
    }

    .ingame-btn-bluegreen {
      background: linear-gradient(90deg, #0cabcd, #75e6ff);
    }

    .ingame-btn-amethyst {
      background: linear-gradient(90deg, #c5258c, #f85dc1);
    }

    .ingame-btn-black {
      width: 3.8rem;
      height: 0.8rem;
      background: linear-gradient(90deg, #C6A759, #F1D99E);
      border-radius: 0.4rem;
      margin-top: 0.24rem;
      margin-bottom: 0.2rem;
    }

    .sports-remark {
      padding: 0.1rem;
      align-items: center;
      justify-content: center;
      text-align: left;
      font-size: 0.26rem;
      color: #0a0a0a;
    }

    .sports-no-game {
      //color: #1999FB;
      font-size: 0.4rem;
      font-weight: bold;
      padding-top: 0.6rem;
    }

    .sports-indicator-box,
    .live-indicator-box {
      position: absolute;
      left: 50%;
      display: flex;
      transform: translateX(-50%);
      &.sports-indicator-box {
        top: 6.73rem;
      }
      &.live-indicator-box {
        left: 1.6rem;
        top: 4.34rem;
      }
      &.sports-more {
        top: 8.25rem;
      }
      .sports-indicator-i {
        width: 0.15rem;
        height: 0.15rem;
        border-radius: 100%;
        opacity: 0.3;
        transition: opacity 0.2s;

        &.opacity1 {
          opacity: 1;
        }

        &:not(:last-child) {
          margin-right: 0.12rem;
        }
      }
    }

    .sports-memu-ul {
      box-sizing: border-box;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      text-align: center;
      flex-wrap: nowrap;
      overflow: hidden;
      margin-top: 0.25rem;
      margin-bottom: 0.1rem;

      .sports-memu-li {
        width: 1.2rem;
        height: 1.4rem;

        .icon {
          width: 1rem;
          height: 1rem;
          margin: auto;

          .icon-img {
            width: 1rem;
            height: 1rem;
          }
        }

        .name {
          display: block;
          font-size: 0.28rem;
          color: #0a0a0a;
        }
      }
    }
  }

  .list {
    width: 100%;
    height: 100%;
    margin: 0;
    background: #ffffff;

    .sports_ul {
      padding: 0.26rem 0.3rem 0.2rem 0.29rem;
      box-sizing: border-box;
      width: 100%;
      white-space: nowrap;
      overflow-x: auto;
      height: 1.86rem;
      &::-webkit-scrollbar {
        display: none;
      }
      .sports_li {
        width: 1.97rem;
        height: 1.55rem;
        border-radius: 0.2rem;
        margin-left: 0.5rem;
        background: #f6f6f8;
        float: left;
        list-style-type: none;
        &:first-child {
          margin-left: 0;
        }
        &.active {
          color: #fff;

          &.default {
            background: linear-gradient(to bottom, #8bb0fc, #3e77f9);
          }

          &.red {
            background: linear-gradient(to bottom, #ff5562, #cb0e1d);
          }

          &.yellow {
            background: linear-gradient(to bottom, #f4d486, #ECBD49);
          }

          &.deepred {
            background: linear-gradient(to bottom, #f85d58, #C62721);
          }

          &.purple {
            background: linear-gradient(to bottom, #3dadeb, #016399);
          }

          &.green {
            background: linear-gradient(to bottom, #36cc89, #08663b);
          }

          &.ferrari {
            background: linear-gradient(to bottom, #fb5c59, #cd1e1a);
          }

          &.gold {
            background: linear-gradient(to bottom, #617cef, #1f3493);
          }

          &.amethyst {
            background: linear-gradient(to bottom, #ef34ad, #991169);
          }

          &.bluegreen {
            background: linear-gradient(to bottom, #75e6ff, #0cabcd);
          }
          .name {
            color: #fff !important;
          }
        }
        .icon {
          width: 100%;
          height: 100%;
          overflow: hidden;

          .name {
            display: block;
            font-size: 0.28rem;
            margin-top: 0.97rem;
            color: #4a4a4a;
          }

          &.active {
            &.icon_38 {
              background-image: url("../../../../assets/img/newsports/icon/3/38_active.png") !important;
            }

            &.icon_39 {
              background-image: url("../../../../assets/img/newsports/icon/3/39_active.png") !important;
            }

            &.icon_11752 {
              background-image: url("../../../../assets/img/newsports/icon/3/11752_active.png") !important;
            }

            &.icon_11754 {
              background-image: url("../../../../assets/img/newsports/icon/3/11754_active.png") !important;
            }

            &.icon_365 {
              background-image: url("../../../../assets/img/newsports/icon/3/365_active.png") !important;
            }

            &.icon_11756 {
              background-image: url("../../../../assets/img/newsports/icon/3/11756_active.png") !important;
            }

            &.icon_11368 {
              background-image: url("../../../../assets/img/newsports/icon/3/11368_active.png") !important;
            }

            &.icon_9999 {
              background-image: url("../../../../assets/img/newsports/icon/3/9999_active.png") !important;
            }

            &.icon_30 {
              background-image: url("../../../../assets/img/newsports/icon/3/30_active.png") !important;
            }
            &.icon_31 {
              background-image: url("../../../../assets/img/newsports/icon/3/31_active.png") !important;
            }
            &.icon_32 {
              background-image: url("../../../../assets/img/newsports/icon/3/32_active.png") !important;
            }
            &.icon_34 {
              background-image: url("../../../../assets/img/newsports/icon/3/34_active.png") !important;
            }
            &.icon_42 {
              background-image: url("../../../../assets/img/newsports/icon/3/42_active.png") !important;
            }
            &.icon_43 {
              background-image: url("../../../../assets/img/newsports/icon/3/43_active.png") !important;
            }
            &.icon_48 {
              background-image: url("../../../../assets/img/newsports/icon/3/48_active.png") !important;
            }
            &.icon_3180 {
              background-image: url("../../../../assets/img/newsports/icon/3/3180_active.png") !important;
            }
            &.icon_11758 {
              background-image: url("../../../../assets/img/newsports/icon/3/11758_active.png") !important;
            }
            &.icon_11543 {
              background-image: url("../../../../assets/img/newsports/icon/3/11543_active.png") !important;
            }
            &.icon_12033 {
              background-image: url("../../../../assets/img/newsports/icon/3/12033_active.png") !important;
            }
            &.icon_12035 {
              background-image: url("../../../../assets/img/newsports/icon/3/12035_active.png") !important;
            }
          }
        }

        .icon_38 {
        }

        .icon_39 {
          margin: auto;
        }

        .icon_9999 {
          margin: auto;
        }
      }

      .sports_li_4 {
        width: 1.5rem;
        height: 1.4rem;
        border-radius: 0.2rem;
        background: #f6f6f8;
        margin-left: 0.3rem;
        list-style-type: none;
        display: inline-block;
        &:first-child {
          margin-left: 0;
        }
        &.active {
          color: #fff;

          &.default {
            background: linear-gradient(to bottom, #8bb0fc, #3e77f9);
          }

          &.red {
            background: linear-gradient(to bottom, #ff5562, #cb0e1d);
          }
          &.yellow {
            background: linear-gradient(to bottom, #f4d486, #ECBD49);
          }
          &.deepred {
            background: linear-gradient(to bottom, #f85d58, #C62721);
          }

          &.purple {
            background: linear-gradient(to bottom, #3dadeb, #016399);
          }

          &.green {
            background: linear-gradient(to bottom, #36cc89, #08663b);
          }

          &.ferrari {
            background: linear-gradient(to bottom, #fb5c59, #cd1e1a);
          }

          &.gold {
            background: linear-gradient(to bottom, #617cef, #1f3493);
          }

          &.amethyst {
            background: linear-gradient(to bottom, #ef34ad, #991169);
          }

          &.bluegreen {
            background: linear-gradient(to bottom, #75e6ff, #0cabcd);
          }
          .name {
            color: #fff !important;
          }
        }
        &.activa {
          background: linear-gradient(to bottom, #28f7ff, #1996fb);
        }
        .icon {
          width: 100%;
          height: 100%;
          overflow: hidden;

          .name {
            display: block;
            font-size: 0.28rem;
            margin-top: 0.87rem;
            color: #4a4a4a;
          }

          &.active {
            &.icon_38 {
              background-image: url("../../../../assets/img/newsports/icon/3/38_active.png") !important;
            }

            &.icon_39 {
              background-image: url("../../../../assets/img/newsports/icon/3/39_active.png") !important;
            }

            &.icon_11752 {
              background-image: url("../../../../assets/img/newsports/icon/3/11752_active.png") !important;
            }

             &.icon_11754 {
              background-image: url("../../../../assets/img/newsports/icon/3/11754_active.png") !important;
            }

            &.icon_365 {
              background-image: url("../../../../assets/img/newsports/icon/3/365_active.png") !important;
            }

            &.icon_11756 {
              background-image: url("../../../../assets/img/newsports/icon/3/11756_active.png") !important;
            }

            &.icon_11368 {
              background-image: url("../../../../assets/img/newsports/icon/3/11368_active.png") !important;
            }

            &.icon_9999 {
              background-image: url("../../../../assets/img/newsports/icon/3/9999_active.png") !important;
            }

            &.icon_30 {
              background-image: url("../../../../assets/img/newsports/icon/3/30_active.png") !important;
            }
            &.icon_31 {
              background-image: url("../../../../assets/img/newsports/icon/3/31_active.png") !important;
            }
            &.icon_32 {
              background-image: url("../../../../assets/img/newsports/icon/3/32_active.png") !important;
            }
            &.icon_34 {
              background-image: url("../../../../assets/img/newsports/icon/3/34_active.png") !important;
            }
            &.icon_42 {
              background-image: url("../../../../assets/img/newsports/icon/3/42_active.png") !important;
            }
            &.icon_43 {
              background-image: url("../../../../assets/img/newsports/icon/3/43_active.png") !important;
            }
            &.icon_48 {
              background-image: url("../../../../assets/img/newsports/icon/3/48_active.png") !important;
            }
            &.icon_3180 {
              background-image: url("../../../../assets/img/newsports/icon/3/3180_active.png") !important;
            }
            &.icon_11758 {
              background-image: url("../../../../assets/img/newsports/icon/3/11758_active.png") !important;
            }
            &.icon_11543 {
              background-image: url("../../../../assets/img/newsports/icon/3/11543_active.png") !important;
            }
            &.icon_12033 {
              background-image: url("../../../../assets/img/newsports/icon/3/12033_active.png") !important;
            }
            &.icon_12035 {
              background-image: url("../../../../assets/img/newsports/icon/3/12035_active.png") !important;
            }
          }
        }
      }
    }

    .lottery_vns {
      width: 100%;
      background: white;
      padding: 0.3rem 0.24rem;
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

    .lottery_ul {
      padding: 0.16rem 0.1rem 0.4rem 0.1rem;
      display: flex;
      justify-content: start;
      align-items: center;
      flex-wrap: wrap;
      background-color: #fff;
      text-align: center;

      .lottery_li {
        display: block;
        width: 25%;
        margin-top: 0.26rem;
        text-align: center;

        &:nth-of-type(1),
        &:nth-of-type(2),
        &:nth-of-type(3),
        &:nth-of-type(4) {
          margin-top: 0.1rem;
        }

        .icon {
          display: block;
          margin: 0 auto;
          width: 1.25rem;
          min-width: 1.25rem;
          min-height: 1.25rem;
          height: 1.25rem;
          // line-height: 0.46rem;
        }

        span {
          color: #555;
          display: block;
          height: 0.28rem;
          font-size: 0.28rem;
          line-height: 0.28rem;
          margin-top: 0.1rem;
          text-align: center;
        }
      }
    }

    .live_ul {
      width: 100%;
      height: 100%;
      display: flex;
      padding: 0.24rem 0.24rem;
      flex-wrap: wrap;
      justify-content: space-between;

      .live_li {
        width: 2.18rem;
        background: #fff;
        overflow: hidden;
        border-radius: 10px;
        margin-bottom: 0.24rem;
        box-shadow: 0 0.15rem 0.1rem #f6f6f6;

        img {
          display: block;
          width: 100%;
        }
      }

      .no-shadow {
        box-shadow: none;
      }
    }

    .sport_ul {
      box-sizing: border-box;
      width: 100%;
      padding: 0.24rem 0.24rem;

      .sport_li:nth-of-type(1) {
        width: 100%;
        border-radius: 10px;

        img {
          width: 100%;
          display: block;
        }
      }

      .sport_li:nth-of-type(2) {
        width: 3.6rem;
        height: 4.8rem;
        -webkit-clip-path: polygon(0 0%, 78% 0%, 100% 100%, 0% 100%);
        clip-path: polygon(0 0%, 78% 0%, 100% 100%, 0% 100%);
        background-size: 98% 100%;
        background-repeat: no-repeat;
        -webkit-shape-outside: margin-box;
        shape-outside: margin-box;
        margin-top: 0.24rem;
        overflow: hidden;

        img {
          width: 100%;
          display: block;
        }
      }

      .sport_li:nth-of-type(3) {
        width: 4.03rem;
        height: 2.28rem;
        -webkit-clip-path: polygon(0 0%, 100% 0%, 100% 100%, 10% 100%);
        clip-path: polygon(0 0%, 100% 0%, 100% 100%, 10% 100%);
        position: absolute;
        left: 42.8%;
        top: 3.51rem;
        overflow: hidden;

        img {
          width: 100%;
          display: block;
        }
      }

      .sport_li:nth-of-type(4) {
        width: 3.61rem;
        height: 2.28rem;
        -webkit-clip-path: polygon(0 0%, 100% 0%, 100% 100%, 11% 100%);
        clip-path: polygon(0 0%, 100% 0%, 100% 100%, 11% 100%);
        position: absolute;
        left: 48.6%;
        top: 6.03rem;
        overflow: hidden;

        img {
          width: 100%;
          display: block;
        }
      }
    }

    .new_chess_ul {
      padding: 0.16rem 0.24rem;
      box-sizing: border-box;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .chess_li {
        margin-bottom: 0.24rem;
        width: 3.39rem;
        height: 2.4999rem;

        .icon {
          width: 100%;
          height: 100%;
        }
      }
    }

    .chess_ul {
      box-sizing: border-box;
      width: 100%;
      padding: 0.24rem 0.24rem;

      .chess_li {
        width: 100%;
        border-radius: 10px;

        img {
          width: 100%;
          display: block;
        }
      }

      .chess_li:nth-of-type(2) {
        width: 3.56rem;
        height: 3.2rem;
        -webkit-clip-path: polygon(0 0%, 78% 0%, 100% 100%, 0% 100%);
        clip-path: polygon(0 0%, 78% 0%, 100% 100%, 0% 100%);
        shape-outside: margin-box;
        margin-top: 0.24rem;

        img {
          width: 100%;
          display: block;
          height: 100%;
        }
      }

      .chess_li:nth-of-type(3) {
        width: 3.85rem;
        height: 3.2rem;
        -webkit-clip-path: polygon(0 0%, 100% 0%, 100% 100%, 0% 100%);
        clip-path: polygon(0 0%, 100% 0%, 100% 100%, 0% 100%);
        position: absolute;
        left: 45.3%;
        top: 3.38rem;

        img {
          width: 100%;
          display: block;
          height: 100%;
        }
      }

      .chess_li:nth-of-type(4) {
        width: 4.44rem;
        height: 3.2rem;
        -webkit-clip-path: polygon(0 0%, 95% 0%, 100% 100%, 0% 100%);
        clip-path: polygon(0 0%, 95% 0%, 100% 100%, 0% 100%);
        shape-outside: margin-box;
        border-radius: 0.2rem 0 0.4rem 0.2rem;
        margin-top: 0.24rem;

        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      .chess_li:nth-of-type(5) {
        width: 2.97rem;
        height: 3.2rem;
        -webkit-clip-path: polygon(0 0%, 100% 0%, 100% 100%, 0% 100%);
        clip-path: polygon(0 0%, 100% 0%, 100% 100%, 0% 100%);
        position: absolute;
        left: 57%;
        top: 6.8rem;

        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
    }
  }
  &.home-type-blush {
    .list .sports_ul .sports_li_4{
      &.active {
      background: linear-gradient(0deg, #ECBE4A, #F1D89C) !important;
        .name{
          color: #520107 !important;
        }
        .icon {
          &.icon_38 {
            background-image: url("../../../../assets/img/newsports/icon/3/38_active_blush.png") !important;
          }

          &.icon_39 {
            background-image: url("../../../../assets/img/newsports/icon/3/39_active_blush.png") !important;
          }

          &.icon_11752 {
            background-image: url("../../../../assets/img/newsports/icon/3/11752_active_blush.png") !important;
          }

            &.icon_11754 {
            background-image: url("../../../../assets/img/newsports/icon/3/11754_active_blush.png") !important;
          }

          &.icon_365 {
            background-image: url("../../../../assets/img/newsports/icon/3/365_active_blush.png") !important;
          }

          &.icon_11756 {
            background-image: url("../../../../assets/img/newsports/icon/3/11756_active_blush.png") !important;
          }

          &.icon_11368 {
            background-image: url("../../../../assets/img/newsports/icon/3/11368_active_blush.png") !important;
          }

          &.icon_9999 {
            background-image: url("../../../../assets/img/newsports/icon/3/9999_active_blush.png") !important;
          }

          &.icon_30 {
            background-image: url("../../../../assets/img/newsports/icon/3/30_active_blush.png") !important;
          }
          &.icon_31 {
            background-image: url("../../../../assets/img/newsports/icon/3/31_active_blush.png") !important;
          }
          &.icon_32 {
            background-image: url("../../../../assets/img/newsports/icon/3/32_active_blush.png") !important;
          }
          &.icon_34 {
            background-image: url("../../../../assets/img/newsports/icon/3/34_active_blush.png") !important;
          }
          &.icon_42 {
            background-image: url("../../../../assets/img/newsports/icon/3/42_active_blush.png") !important;
          }
          &.icon_43 {
            background-image: url("../../../../assets/img/newsports/icon/3/43_active_blush.png") !important;
          }
          &.icon_48 {
            background-image: url("../../../../assets/img/newsports/icon/3/48_active_blush.png") !important;
          }
          &.icon_3180 {
            background-image: url("../../../../assets/img/newsports/icon/3/3180_active_blush.png") !important;
          }
          &.icon_11758 {
            background-image: url("../../../../assets/img/newsports/icon/3/11758_active_blush.png") !important;
          }
          &.icon_11543 {
            background-image: url("../../../../assets/img/newsports/icon/3/11543_active_blush.png") !important;
          }
          &.icon_12033 {
            background-image: url("../../../../assets/img/newsports/icon/3/12033_active_blush.png") !important;
          }
          &.icon_12035 {
            background-image: url("../../../../assets/img/newsports/icon/3/12035_active_blush.png") !important;
          }
        }
      }
    } 
  }
}
</style>
