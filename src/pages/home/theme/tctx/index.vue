<template>
  <view-page full-box class="home-page tctx-home">
    <home-header slot="header" :data="data" @logout="onLogout" @download="onDownload"></home-header>
    <!--滑动区域-->
    <div slot="content" class="body">
      <!--轮播图-->
      <div class="swiper-box">
        <swiper :options="swiperOption" ref="swiper">
          <swiper-slide v-for="(item, i) in swiperList" :key="i">
            <img
              style="width: 100%;display: block"
              :src="item.img"
              @click="swiperItemClick(item)"
              alt
            />
          </swiper-slide>
        </swiper>
      </div>
      <div class="main">
        <div class="notice-box">
          <van-icon name="volume-o" class="marquee-icon"/>
          <van-notice-bar
            class="notice-bar"
            @click="showMarquee"
            v-if="noticeStr && noticeStr.length"
          >
            <div class="notice" v-for="(item,i) in noticeStr" :key="i">{{item.description}}</div>
          </van-notice-bar>
        </div>
        <ul class="type-tab">
          <li :class="{'type-tab-item':true,active:type==='lottery'}" @click="type='lottery'">彩票游戏</li>
          <li :class="{'type-tab-item':true,active:type==='chess'}" @click="type='chess'">棋牌游戏</li>
        </ul>
        <div
          style="position: relative"
          :style="{height:listHeight+'px'}"
          v-touch:left="onSwiperLeft"
          v-touch:right="onSwiperRight"
        >
          <transition-group :name="animation">
            <div class="animation-box" :key="type">
              <div class="list" v-if="type==='lottery'" ref="lottery-list">
                <a
                  class="item"
                  v-for="(lottery, i) in hots"
                  :key="lottery.id+'-'+i"
                  @click="onGameClick(lottery)"
                  v-if="i < 14"
                >
                  <img class="lottery-icon" src="../../../../assets/img/error-img-home.png" v-real-img="lottery.icon" alt/>
                  <p class="lottery-name">{{lottery.name}}</p>
                  <i v-if="stopId.includes(lottery.id)" class="logo-stop"></i>
                </a>
                <a class="item" @click="$router.push('/home/type')">
                  <img
                    class="lottery-icon"
                    :src="publicStaticHost+'/images/style1/other/more.png'"
                    alt
                  />
                  <p class="lottery-name">更多彩票</p>
                </a>
              </div>

              <div class="chess-list" v-else-if="type==='chess'" ref="chess-list">
                <a
                  class="item"
                  v-for="(chess, i) in chessList"
                  :key="chess.id+'-'+i"
                  @click="goGameClick(chess)"
                >
                  <img class="chess-img" src="../../../../assets/img/error-img-home.png" v-real-img="chess.icon" alt/>
                  <!-- <img :src="chess.icon" class="chess-img" alt /> -->
                  <!-- <p class="chess-name">{{ chess.name }}</p> -->
                </a>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
    <div slot="static">
      <slot name="NoticeDialog"></slot>
      <slot name="marqueeDialog"></slot>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import HomeHeader from "./header";
import { NoticeBar } from "vant";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import homeMixin from "../mixin";

export default {
  mixins: [homeMixin],
  name: "HomeTctx",
  components: {
    swiper,
    swiperSlide,
    HomeHeader,
    vantNoticeBar: NoticeBar
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      stopId: [], //2 , 5, 7 , 10
      hotLen: 14,
      type: "lottery",
      animation: "",
      listHeight: 0,
      chessList: []
    };
  },
  watch: {
    type() {
      if (this.type === "chess") {
        this.animation = "slide-left";
        this.$nextTick(() => {
          if (this.$refs["chess-list"]) {
            this.listHeight = this.$refs["chess-list"].offsetHeight;
          }
        });
      } else {
        this.animation = "slide-right";
        this.$nextTick(() => {
          if (this.$refs["lottery-list"]) {
            this.listHeight = this.$refs["lottery-list"].offsetHeight;
          }
        });
      }
    }
  },
  computed: {
    morePath() {
      return (
        this.$store.state.main.config["statics"] +
        "images/" +
        this.$store.state.main.config["theme"] +
        "/other/more.png?v=" +
        window.VERSION
      );
    },
    noticeStr() {
      let list = null
      if(JSON.parse(localStorage.getItem('marqueeList'))) {
        list =JSON.parse(localStorage.getItem('marqueeList'))
      }else {
        list = this.$store.state.main.marqueeList
      }
      return list
    },
    scrollHeight() {
      return "0.02rem";
    }
  },
  mounted() {
    if (this.type === "chess") {
      this.animation = "slide-left";
      this.$nextTick(() => {
        if (this.$refs["chess-list"]) {
          this.listHeight = this.$refs["chess-list"].offsetHeight;
        }
      });
    } else {
      this.animation = "slide-right";
      this.$nextTick(() => {
        if (this.$refs["lottery-list"]) {
          this.listHeight = this.$refs["lottery-list"].offsetHeight;
        }
      });
    }
  },
  created() {
    this.getBanner()
    this.getChess();
    this.getHomeData(null,'10000|10001|10002|10003|10004|10005|20001|20002')
  },
  updated() {
    if (this.$refs["lottery-list"]) {
      this.listHeight = this.$refs["lottery-list"].offsetHeight;
    }
    this.$nextTick(() => {
      if (this.$refs["lottery-list"]) {
        this.listHeight = this.$refs["lottery-list"].offsetHeight;
      }
    });
  },
  methods: {
    getChess() {
      this.$store
        .dispatch("games/getGameSort", '10004')
        .then(res=>{
          try {
              this.chessList = res.data.list.platform[0].list['0_0'].list['0_0_0'].list  || [];
          } catch (error) {
              this.chessList =  [];
          }
          
        })
    },
    onSwiperLeft() {
      if (this.type === "lottery") {
        this.type = "chess";
      }
    },
    onSwiperRight() {
      if (this.type === "chess") {
        this.type = "lottery";
      }
    },
    showMarquee() {
      this.$store.commit("main/marqueeDialog", true);
    },
    goGameClick(item) {
      item['type'] = 'game'
      this.onGameClick(item)
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
.tctx-home {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  .notice-box {
    width: 100%;
    height: 0.8rem;
    line-height: 0.8rem;
    overflow: hidden;
    padding: 0 .32rem;
    background: #fff;
    .marquee-icon {
      font-size: 0.32rem;
      min-width: .44rem;
      line-height: .8rem;
      float: left;
      transform: scale(1.2) !important;
    }
    .notice-bar {
      height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.28rem;
      padding: 0;
      background-color: transparent;
      color: #000;
      /deep/ .van-notice-bar__wrap {
        height: 100% !important;
        .van-notice-bar__content{
          white-space:nowrap;
          width:auto;
        }
      }
      .notice {
        color: #000;
        display: inline-block;
        margin-right: .3rem;
      }
    }
  }
  .body {
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    border-bottom: 0.02rem solid transparent;
  }

  .animation-box {
    position: absolute;
    width: 100%;
  }

  .list {
    width: 100%;
    background-color: #fff;

    &:after {
      content: "";
      display: table;
      clear: both;
    }

    .item {
      position: relative;
      width: calc(100% / 3);
      display: block;
      float: left;
      border-bottom: 0.01rem solid #d8d8d8;
      border-right: 0.01rem solid #d8d8d8;
      box-sizing: border-box;
      padding: 0.2rem 0;
      height: 1.7rem;

      &:nth-child(3n) {
        border-right: none;
      }

      .icon-img {
        width: 0.84rem;
        height: 0.84rem;
        display: block;
        margin: 0 auto;
        border-radius: 50%;
        box-shadow: 0 0.04rem 0.08rem rgba(0, 0, 0, 0.5);
        box-sizing: border-box;

        &.more {
          .icon-svg {
            fill: #fa7e00;
            width: 100%;
            height: 100%;
            transform: scale(1.18);
          }
        }
      }

      .lottery-size {
        width: 0.8rem;
        height: 0.8rem;
        min-width: 0.8rem;
        min-height: 0.8rem;
        display: inline-block;
        background-image: url(/static/img/tctx_icon.png);
        background-repeat: no-repeat;
        background-size: 6.25rem 13.08rem;
      }
      .logo-stop{
        width: 1.15rem;
        height: 0.34rem;
        position: absolute;
        left: 0;
        top: 0;
        background-image: url(../../../../assets/img/home/newYearMB.png);
        background-repeat: no-repeat;
        background-size: 100%;
      }
      .lottery-icon {
        width: 0.8rem;
        height: 0.8rem;
        line-height: 0.8rem;
        display: block;
        margin: 0 auto;
        border-radius: 50%;
        box-sizing: border-box;
        font-size: 0.2rem;
        position: relative;
        text-align: center;
        line-height: 0;

        &:before {
          font-size: 0.8rem;
          position: relative;
        }

        .icon-copy {
          position: absolute;
          left: 0;
          top: 0;

          &:before {
            text-shadow: 0 0.04rem 0.04rem #fff !important;
          }
        }

        &.lottery-icon-ssc {
          color: #38b366;

          &:before {
            text-shadow: 0 0.04rem 0.08rem rgba(56, 179, 102, 0.5);
          }
        }

        &.lottery-icon-pk10 {
          color: #f22751;

          &:before {
            text-shadow: 0 0.04rem 0.08rem rgba(242, 39, 81, 0.5);
          }
        }

        &.lottery-icon-lhc {
          color: #3ab39e;

          &:before {
            text-shadow: 0 0.04rem 0.08rem rgba(58, 179, 158, 0.5);
          }
        }

        &.lottery-icon-11x5 {
          color: #218ddd;

          &:before {
            text-shadow: 0 0.04rem 0.08rem rgba(33, 141, 221, 0.5);
          }
        }

        &.lottery-icon-pcdd {
          color: #e41404;

          &:before {
            text-shadow: 0 0.04rem 0.08rem rgba(228, 20, 4, 0.5);
          }
        }

        &.lottery-icon-k3 {
          color: #e41404;

          &:before {
            text-shadow: 0 0.04rem 0.08rem rgba(228, 20, 4, 0.5);
          }
        }

        &.lottery-icon-dpc {
          color: #00b7ee;

          &:before {
            text-shadow: 0 0.04rem 0.08rem rgba(0, 183, 238, 0.5);
          }
        }

        &.lottery-icon-pl {
          color: #38b366;

          &:before {
            text-shadow: 0 0.04rem 0.08rem rgba(56, 179, 102, 0.5);
          }
        }

        &.lottery-icon-klsf {
          color: #ff8504;

          &:before {
            text-shadow: 0 0.04rem 0.08rem rgba(255, 133, 4, 0.5);
          }
        }

        &.lottery-icon-more {
          color: #fc0000;

          &:before {
            text-shadow: 0 0.04rem 0.08rem rgba(252, 0, 0, 0.5);
          }
        }
      }

      .lottery-name {
        margin-top: 0.16rem;
        font-size: 0.28rem;
        line-height: 0.3rem;
        margin-bottom: 0.06rem;
        font-weight: 400;
        text-align: center;
        letter-spacing: 0.02rem;
        color: #333;
      }

      .lottery-desc {
        color: #989898;
        font-size: 0.24rem;
        line-height: 0.3rem;
        height: 0.3rem;
        min-height: 0.3rem;
        letter-spacing: 0.02rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: center;
      }
    }
  }

  .chess-list {
    padding: 0.3rem;
    box-sizing: border-box;
    width: 100%;
    background-color: #fff;

    &::after {
      content: "";
      display: table;
      clear: both;
    }

    .item {
      width: 1.725rem;
      height: 1.725rem;
      display: block;
      float: left;
      padding: 0;
      box-sizing: border-box;

      .chess-img {
        width: 100%;
        height: 100%;
        padding: 0.24rem;
        box-sizing: border-box;
      }
      .chess-name{
        color: #000;
        font-size: 0.26rem;
        max-width: 1.88rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .type-tab {
    width: 100%;
    height: 1.06rem;
    box-sizing: border-box;

    &:after {
      content: "";
      display: table;
      zoom: 1;
      clear: both;
    }

    .type-tab-item {
      float: left;
      width: 50%;
      height: 0.88rem;
      line-height: 0.88rem;
      margin-top: 0.16rem;
      font-size: 0.345rem;
      background-color: #e5e5e5;

      &.active {
        background-color: #fff;
        font-weight: bold;
      }
    }
  }
}
</style>
