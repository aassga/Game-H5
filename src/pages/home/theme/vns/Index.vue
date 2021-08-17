<template>
  <view-page full-box :class="['home-page',{'black-home-page' : $config.blackTheme}]">
    <home-header slot="header" @on-download="onDownload"></home-header>

    <div slot="content">
      <div class="swiper-box">
        <swiper :options="swiperOption" ref="mySwiper" class="bannerSwiper">
          <swiper-slide v-for="(item, i) in swiperList" :key="i">
            <!-- <img
              style="width: 100%;display: block;transform:translate3d(0,0,0)"
              :src="item.img"
              @click="swiperItemClick(item)"
              alt
            /> -->
            <div class="swiper-item" @click="swiperItemClick(item)" :style="
              'backgroundImage:url('+item.img+');'
              ">
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="notice-box theme-main-bg-3">
        <i class="notice_icon theme-color icon iconfont h5-icon-icon-gonggao theme-color-yellow"></i>
        <van-notice-bar
          class="notice-bar"
          @click="showMarquee"
          v-if="noticeStr && noticeStr.length"
        >
          <div class="notice theme-color-gray-4" v-for="(item,i) in noticeStr" :key="i">{{item.description}}</div>
        </van-notice-bar>
      </div>
      <ul class="list lottery_nav theme-header-bg">
        <li class="item" v-for="(item,i) in listTop" :key="i">
          <img class="icon" :src="$config.blackTheme ? require('../../../../assets/img/black-error-img-home.png') : require('../../../../assets/img/error-img-home.png')" v-real-img="imgUrl(item.icon)" @click="onGameClick(item)" alt/>
          <span class="name theme-color-white">{{item.name}}</span>
        </li>
      </ul>
      <div class="tit" v-if="!$config.blackTheme">
        <span>
          <i class="shu theme-bg"></i>推荐游戏
        </span>
        <span>右滑更多</span>
      </div>
      <div class="theme-gradient-bg-2 game-swiper-box">
        <div class="tit-box" v-if="$config.blackTheme">
          <img src="../../../../assets/img/home/black/home-tit.png" class="black-home-tit">
          <span>右滑更多</span>
        </div>
        <swiper :options="swiperOptionContent" ref="swiper" v-if="showSwiper" class="game-swiper">
          <swiper-slide v-for="(item, i) in listContent" :key="i">
            <ul class="list_two lottery_nav" style="transform:translate3d(0,0,0)">
              <li
                class="item swiper_item theme-main-bg-4"
                v-for="(itemc,i) in item"
                :key="i"
                @click="handleClickSlide(itemc)"
              >
                <!-- <img class="icon" src="../../../../assets/img/error-img-home.png" v-real-img="itemc.icon" alt/> -->
                <img class="icon" :src="imgUrl(itemc.icon)" v-errorAlt="require('../../../../assets/img/error-img-home.png')" alt/>
                <div class="game_title">
                  <span class="name theme-color-white">{{itemc.name}}</span>
                  <span class="name theme-color-gray-5">{{itemc.title}}</span>
                </div>
              </li>
            </ul>
          </swiper-slide>
        </swiper>
      </div>
      <!-- <slot name="NoticeDialog"></slot> -->
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
import homeMixin from "../mixin";
import Header from "./Header";
let vm = null;
export default {
  name: "Index",
  components: {
    HomeHeader: Header,
    swiper,
    swiperSlide
  },
  mixins: [homeMixin],
  data() {
    return {
      tabIndex: null,
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
      swiperOptionContent: {
        autoplay: false,
        autoHeight: true,
        touchRatio: 1,
        loop: true,
        slidesPerView: 1
      },
      url:
        window.location.origin + "/static/jltx/html/active/hongbao/m/index.html",
      showSwiper: false
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
  },
  created() {
    this.getBanner()
    this.getHomeData(7,'20001|20002')
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
    }
  },
  methods: {
    imgUrl (url) {
      return this.publicStaticHost + '/images/'+ url
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
      this.onGameClick(data);
    },
    goRed() {
      if (!this.user) {
        this.$router.push("/admin/login");
      } else {
      }
    },
    showMarquee() {
      this.$store.commit("main/marqueeDialog", true);
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
@import "../../../../style/icon/home-icon-xpj";

.home-page {
  .notice-box {
    width: 100%;
    height: 0.64rem;
    line-height: 0.64rem;
    font-size: 0.28rem;
    background-color: #f3f3f3;
    padding: 0 0.05rem;
    overflow: hidden;
    .notice_icon {
      float: left;
      margin-left: .1rem;
    }
    .notice-bar {
      height: 0.64rem;
      line-height: 0.64rem;
      font-size: 0.28rem;
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
        color: #000;
        display: inline-block;
        margin-right: 0.3rem;
      }
    }
  }

  .swiper-box {
    width: 100%;
    height: 2.9rem;
    background: #fff;
    transform: translate3d(0, 0, 0);
    overflow: hidden;
    /deep/ .bannerSwiper {
      height: 100%;
      .swiper-slide {
        height: 2.9rem;

        img {
          height: 100%;
        }
      }
    }
    .swiper-item {
      width: 100%;
      display: block;
      transform:translate3d(0,0,0);
      height: 2.9rem;
      background-size: 100% 100%;
    }
  }

  .tit {
    width: 100%;
    background: #fff;
    margin-top: 0.16rem;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0.16rem 0.24rem 0 0.24rem;

    span {
      display: block;
      font-size: 0.32rem;
      font-weight: 500;

      .shu {
        width: 0.06rem;
        height: 0.3rem;
        margin-top: 0.06rem;
        margin-right: 0.1rem;
        float: left;
      }
    }

    span:last-of-type {
      height: 100%;
      font-size: 0.24rem;
      line-height: 0.46rem;
      color: #a3a3a3;
    }
  }

  .game-swiper {
    transform: translate3d(0, 0, 0);
    overflow: hidden;
  }

  .list {
    width: 100%;
    background: white;
    padding: 0.08rem 0 0 0;
    margin: 0;
    box-sizing: border-box;

    &:after {
      content: "";
      display: table;
      clear: both;
    }

    .item {
      width: calc(100% / 4);
      margin-top: 0.16rem;
      height: 1.6rem;
      float: left;

      .icon {
        display: block;
        margin: 0 auto;
        width: 1rem;
        min-width: 1rem;
        min-height: 1rem;
        height: 1rem;
      }

      .name {
        display: block;
        color: #555;
        font-size: 0.28rem;
        line-height: 0.42rem;
        height: 0.42rem;
        width: 100%;
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
  &.black-home-page {
    background-color: #000;
    .swiper-box {
      padding: 0;
      background: none;
      /deep/ .bannerSwiper {
        .swiper-slide {
          height: 100%;
        }
      }
      .swiper-item {
        height: 100%;
      }
    }
    .game-swiper-box {
      .tit-box {
        overflow: hidden;
        height: 0.75rem;
        .black-home-tit {
          float: left;
          width: 1.44rem;      
          margin-top: 0.3rem;
          margin-left: 0.24rem;
        } 
        span {
          float: right;
          font-size: 0.24rem;
          color: #6E6E6E;
          margin-right: 0.24rem;
          line-height: 0.9rem;
        }
      }
    }
    .list_two {
      background-color: transparent;
      .item .icon {
        width: 1.2rem;
        height: 1.2rem;
      }
      .game_title {
        flex: 1;
        overflow: hidden;
        .name{
          overflow: hidden; 
          white-space: nowrap; 
          text-overflow: ellipsis;
        }
      }
    }
    .list {
      padding: 0.08rem 0 0.16rem 0;
      .item .icon {
        width: 1.2rem;
        height: 1.2rem;
        min-width: 1.2rem;
        min-height: 1.2rem;
      }
    }
  }
}
</style>
