<template>
  <view-page full-box isTransition>
    <title-header :title="title" back-event @back="back" slot="header"></title-header>
    <div class="home-type" slot="content">
      <!-- <div class="home-type-hr"></div> -->
      <div class="list" v-if="['10004'].includes(id)">
        <ul class="chess_ul chess_10004">
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
      <!--体育版面-->
      <template v-else-if="['10002','10003'].includes(id)">
        <div
          class="list sports-box"
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
                :class="[list.length <=3 ?'sports_li':'sports_li_4',{'active':i===sportIndex},theme]"
                v-for="(item,i) in list"
                :key="i"
                @click="onSportChage(i)"
              >
                <div
                  v-if="$config.name === 'klk' && item.id == '11756'"
                  class="icon"
                  :class="[{'active':i===sportIndex},'icon_xj']"
                  :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/icon/3/'+theme+'/xj.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                >
                  <span class="name">小金体育</span>
                </div>
                <div
                  v-else
                  class="icon"
                  :class="[{'active':i===sportIndex},'icon_'+item.id]"
                  :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/icon/3/'+theme+'/'+item.id+'.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                >
                  <span class="name">{{item.name}}</span>
                </div>
              </li>
            </ul>
          </cube-scroll>
          <van-swipe
            @change="taJ=>sportChangeIndex(taJ)"
            :show-indicators="true"
            :loop="false"
            ref="sportSwipe"
          >
            <van-swipe-item v-for="(item,j) in list" :key="j">
              <div class="sports-swipe-box" v-if="id === '10002'">
                <div class="sports-banner" :class="{'sports-banner-top':9999===item.id}">
                  <div
                    class="sports-banner-img"
                    :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/banner/'+item.id+'.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                  ></div>
                </div>
                <template v-if="item.id !== 9999">
                  <div
                    class="sports-ingame-btn"
                    :class="'ingame-btn-'+theme"
                    @click.capture.stop="playerGame(item)"
                  >开始游戏</div>
                  <div
                    class="sports-remark"
                    v-if="item.id === 38"
                  >亚洲最流行的体育平台，20年高效投注体验，世界一流的超高赔率，操作界面方便直观简单，每日数千场精彩赛事</div>
                   <div
                    class="sports-remark"
                    v-else-if="item.id === 39"
                  >亚洲线上博彩老品牌，深受广大中国彩民的喜爱。高赔率、玩法新颖，为您提供最全面的体育赛事体验。</div>
                  <div
                    class="sports-remark"
                    v-else-if="item.id === 11368"
                  >源自全球领先平台商，新颖玩法，提供多元体育赛事投注，包含足球、棒球、篮球及橄榄球等世界主要体育专案。</div>
                  <div
                    class="sports-remark"
                    v-else-if="item.id === 11752"
                  >每月最少有25,000场篮球，足球，网球和体育滚球赛事。提供市场最多投注盘口体育平台，各式赔率 满足不同玩家</div>
                  <div
                    class="sports-remark"
                    v-else-if="item.id === 11754"
                  >曾获得亚洲年度运营商奖，在全球在线博彩平台中处于领先地位，每日近千场体育赛事满足不同玩家需求。</div>
                  <div
                    class="sports-remark"
                    v-else-if="item.id === 11756"
                  >亚洲最知名的盘口，也是世界娱乐业中的旗帜。为您提供高质量、高赔率及最新的体育游戏。</div>
                  <div class="sports-remark" v-else>更多平台敬请期待...</div>
                  <ul class="sports-memu-ul">
                    <li class="sports-memu-li">
                      <div class="icon">
                        <div
                          class="icon-img"
                          :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/icon/memu/'+item.id+'/1.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                        ></div>
                      </div>
                      <span class="name" v-if="item.id === 38">超高赔率</span>
                      <span class="name" v-if="item.id === 39">品牌悠久</span>
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
                          :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/icon/memu/'+item.id+'/2.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                        ></div>
                      </div>
                      <span class="name" v-if="item.id === 38">界面简单</span>
                      <span class="name" v-if="item.id === 39">赛事最广</span>
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
                          :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/icon/memu/'+item.id+'/3.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                        ></div>
                      </div>
                      <span class="name" v-if="item.id === 38">高效体验</span>
                      <span class="name" v-if="item.id === 39">最佳赔率</span>
                      <span class="name" v-else-if="item.id === 11752">快速结算</span>
                      <span class="name" v-else-if="item.id === 11754">赛事众多</span>
                      <span class="name" v-else-if="item.id === 11756">服务高效</span>
                      <span class="name" v-else-if="item.id === 11368">多元投注</span>
                      <span class="name" v-else>敬请期待</span>
                    </li>
                    <li class="sports-memu-li">
                      <div class="icon">
                        <div
                          class="icon-img"
                          :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/icon/memu/'+item.id+'/4.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                        ></div>
                      </div>
                      <span class="name" v-if="item.id === 38">精彩赛事</span>
                      <span class="name" v-if="item.id === 39">服务一流</span>
                      <span class="name" v-else-if="item.id === 11752">各式赔率</span>
                       <span class="name" v-else-if="item.id === 11754">玩法丰富</span>
                      <span class="name" v-else-if="item.id === 11756">紧追潮流</span>
                      <span class="name" v-else-if="item.id === 11368">玩法众多</span>
                      <span class="name" v-else>敬请期待</span>
                    </li>
                  </ul>
                </template>
                <template v-else>
                  <div class="sports-no-game theme-color">更多平台敬请期待...</div>
                </template>
              </div>
              <div class="sports-swipe-box" v-if="id === '10003'">
                <div class="live-banner">
                  <div
                    class="live-banner-img"
                    :style="{ backgroundImage: 'url('+ require('@src/assets/img/newsports/banner/'+item.id+'.png') +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                  ></div>
                  <div
                    class="live-ingame-btn"
                    :class="'ingame-btn-'+theme"
                    @click.capture.stop="playerGame(item)"
                  >开始游戏</div>
                </div>
              </div>
            </van-swipe-item>
            <div
              :class="[id === '10002' ? 'sports-indicator-box' : 'live-indicator-box',{'sports-more':list[sportIndex].id === 9999}]"
              slot="indicator"
            >
              <i
                class="sports-indicator-i theme-bg-active active"
                :class="{'opacity1':i===swipeSportIndex}"
                v-for="(item,i) in list"
                :key="i"
              ></i>
            </div>
          </van-swipe>
        </div>
        <div class="list" v-else-if="['10002'].includes(id)">
          <ul class="chess_ul chess_10004">
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
              v-for="(item,i) in list"
              :key="i"
              @click.capture.stop="onGameClick(item)"
            >
              <div
                class="icon"
                :style="{ backgroundImage: 'url('+ item.icon +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
                :class="['live_icon_'+item.id]"
              ></div>
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </template>

      <!--<div class="list" v-else-if="['10002'].includes(id)">
        <ul class="chess_ul">
          <li class="chess_li" :class="'lottery_icon_'+item.id" v-for="(item,i) in list" :key="i" @click.capture.stop="onGameClick(item)">
            <div class="icon" :style="'background:url('+item.icon+');background-size:100% 100%;background-position:center;'"></div>
          </li>
        </ul>
      </div>-->
      <div class="list" v-else-if="['10001','10005'].includes(id)">
        <ul class="live_ul" :class="{buyu_icon:id==='10005',game_icon:id==='10001'}">
          <li
            class="live_li"
            v-for="(item,i) in list"
            :key="i"
            @click.capture.stop="onGameClick(item)"
          >
            <div
              class="icon"
              :style="{ backgroundImage: 'url('+ item.icon +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
              :class="[{fish_img:id==='10005'},{slot_img:id==='10001'},'live_icon_'+item.id]"
            ></div>
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="list" v-else>
        <ul class="lottery_ul lottery_icon">
          <li
            class="lottery_li"
            v-for="(item,i) in list"
            :key="i"
            @click.capture.stop="onGameClick(item)"
          >
            <!-- <div
              class="icon"
              :style="{ backgroundImage: 'url('+ item.icon +')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"
            ></div> -->
            <img class="icon" src="../../../../assets/img/error-img-lottery.png" v-real-img="imgUrl(item.icon)" alt/>
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>

    <div slot="static">
      <slot></slot>
    </div>
  </view-page>
</template>

<script>
import { scroll } from "cube-ui";
export default {
  name: "TypeXPJ",
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  components: {
    cubeScroll: scroll
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
  computed: {
    scrollOptions () {
      return {
        // bounce: false,
        useTransition: (this.$mobileDevice.osVersion.split('.')[0]>= 13 && this.$mobileDevice.osVersion.split('.')[1] >= 3) ? false : true
      }
    },
    imStyle() {
      if (this.sportIndex === 2) {
        return {
          bottom: "0.1rem"
        };
      }
    },
    theme() {
      return this.$store.state.main.theme;
    },
    title() {
      return this.$route.query.name;
    },
    contHeight() {
      return this.$store.state.main.windowHeight - this.rem * 0.88;
    }
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
      if (this.list.length !== 3) {
        this.$nextTick(() => {
          this.$refs.scroll.scrollTo(-leftIndex * (1.8 * this.rem), 0, 300);
        });
      }
    }
  },
  created() {
    if (this.id) {
      const idConfig = {
        10000:4,
        10001:2,
        10002:6,
        10003:5,
        10004:1,
        10005:3,
      }
      const id = this.id;
      this.$store.dispatch("main/getNewGame", {
        idIndex: idConfig[id],
        id,
        callback: res => {
          if (res && res[id]) {
            this.list = res[id];
            if (id == 10000) {
              this.list.unshift({
                id: 99996,
                name: "长龙助手",
                upid: 99996,
                title: "两面盘神器",
                icon:
                  localStorage.SiteStaticsUrl +
                  "/images/" +
                  JSON.parse(localStorage.config).theme +
                  "/20001/99996.png",
                series: 99996,
                tag: "HOT,JPT",
                code: "1042",
                type: "lottery"
              });
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
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../style/icon/home-icon-xpj";
/deep/ .cube-scroll-content {
  display: inline-block;
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
    }
    .ingame-btn-default {
      background: linear-gradient(90deg, #4779ea, #7da6fb);
    }

    .ingame-btn-red {
      background: linear-gradient(90deg, #eb2736, #fe848e);
    }

    .ingame-btn-yellow {
      background: linear-gradient(90deg, #f4d486, #ECBD49);
    }

    .ingame-btn-deepred {
      background: linear-gradient(90deg, #C62721, #fe848e);
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

    .sports-remark {
      padding: 0.1rem;
      align-items: center;
      justify-content: center;
      text-align: left;
      font-size: 0.26rem;
      color: #0a0a0a;
      margin-top: 0.6rem;
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
      margin-top: 0.1rem;
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
            background: linear-gradient(to bottom,#f4d486, #ECBD49);
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
            &.icon_xj {
              background-image: url("../../../../assets/img/newsports/icon/3/xj_active.png") !important;
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
            background: linear-gradient(to bottom,#f4d486, #ECBD49);
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
            &.icon_xj {
              background-image: url("../../../../assets/img/newsports/icon/3/xj_active.png") !important;
            }
          }
        }
      }
    }

    .chess_ul {
      padding: 0.16rem 0.3rem;
      box-sizing: border-box;
      width: 100%;

      .chess_li {
        margin-bottom: 0.15rem;

        .icon {
          width: 100%;
          height: 2.8rem;
        }
      }
    }

    .chess_10004 {
      padding: 0.16rem 0.24rem;
      box-sizing: border-box;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .chess_li {
        margin-bottom: 0.24rem;
        width: 3.39rem;
        height: 3.015rem;

        .icon {
          width: 100%;
          height: 100%;
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
          width: 1.15rem;
          min-width: 1.15rem;
          min-height: 1.15rem;
          height: 1.15rem;
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
      padding: 0 0.15rem 0.15rem 0.15rem;
      box-sizing: border-box;
      justify-content: start;
      flex-wrap: wrap;
      display: flex;
      align-items: center;

      .live_li {
        display: flex;
        align-items: center;
        width: 33.333333333%;
        flex-direction: column;
        justify-content: space-between;

        .icon {
          width: 2.25rem;
          max-width: 2.25rem;
          max-height: 2.4rem;
          height: 2.4rem;
        }

        // .fish_img {
        //   width: 2.25rem;
        //   height: 2.3rem;
        // }

        // .slot_img {
        //   width: 2.22rem;
        //   height: 2.42rem;
        // }

        span {
          height: 0.56rem;
          line-height: 0.56rem;
          font-size: 0.3rem;
          color: #666;
          display: block;
        }
      }
    }
  }
}
</style>
