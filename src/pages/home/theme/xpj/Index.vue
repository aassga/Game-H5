<template>
  <view-page full-box class="home-page">
    <home-header slot="header" @on-download="onDownload"></home-header>
    <div slot="content">
      <div class="swiper-box">
        <!-- <vux-swiper
          :list="swiperList"
          :show-desc-mask="false"
          loop
          auto
          :aspect-ratio="300/750"
          dots-position="center"
          ref="swiper"
          @on-click-list-item="swiperItemClick"
          :show-dots="false"
        ></vux-swiper>-->
        <swiper :options="swiperOption" ref="swiper" v-if="swiperList && swiperList.length">
          <swiper-slide v-for="(item, i) in swiperList" :key="i">
              <div class="swiper-item" @click="swiperItemClick(item)" :style="
                'backgroundImage:url('+item.img+');'
                ">
              </div>
          </swiper-slide>
        </swiper>
      </div>

      <div class="notice-box">
        <i class="marquee-icon"></i>
        <van-notice-bar
          class="notice-bar"
          @click="showMarquee"
          v-if="noticeStr && noticeStr.length"
        >
          <div class="notice" v-for="(item,i) in noticeStr" :key="i">{{item.description}}</div>
        </van-notice-bar>
      </div>
      <ul class="list lottery_nav" ref="list" v-if="$config.name != '500w'">
        <li class="item" v-for="(item,i) in listTop" :key="i" @click="onGameClick(item)">
          <img
            class="icon"
            src="../../../../assets/img/error-img-home.png"
            v-real-img="imgUrl(item.icon)"
            alt
          />
          <span class="name">{{item.name}}</span>
        </li>
      </ul>
      <div class="tit" v-if="$config.name != '500w'">
        <span class="tit-left">
          <img src="@src/assets/img/home/recommend-icon.png" />推荐游戏
        </span>
        <span class="tit-right">年度最火爆游戏</span>
      </div>
      <ul class="list lottery_nav recommendList" v-if="$config.name != '500w'">
        <li class="item" v-for="(item,i) in listContent" :key="i" @click="onGameClick(item)">
          <img
            class="icon"
            src="../../../../assets/img/error-img-home.png"
            v-real-img="imgUrl(item.icon)"
            alt
          />
          <span class="name">{{item.name}}</span>
        </li>
      </ul>
      <!-- <slot name="NoticeDialog"></slot>
      <slot name="marqueeDialog"></slot>-->
    </div>

    <div slot="footer" class="xf_bottom" v-if="$config.name==='aqvns'&&isShow">
      <span>下载APP，领取更多优惠福利</span>
      <span @click="onDownload"><img src="../../../../assets/img/home/down/download.png" alt=""></span>
      <span @click="onClose"><img src="../../../../assets/img/home/down/close.png" alt=""></span>
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
      isShow:true,
      hotLen: 14,
      animation: "",
      listHeight: 0,
      chessList: [],
      redLope: true,
      noticeStr: [],
      intervalId: null,
      url:
        window.location.origin +
        "/static/jltx/html/active/hongbao/m/index.html",
      swiperOption: {
        autoplay: {
          disableOnInteraction: false
        }
      }
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
    }
  },
  created() {
    this.getBanner()
    this.getHomeData(7,'20001|20002')
  },
  mounted() {
    //解决偶尔获取不到localStorage数据问题，导致公告空白
    this.intervalId = window.setInterval(() => {
      this.initNotice();
    }, 100);

  },
  methods: {
    imgUrl (url) {
      return this.publicStaticHost + '/images/'+ url
    },
    initNotice() {
      if (JSON.parse(localStorage.getItem("marqueeList"))) {
        this.noticeStr = JSON.parse(localStorage.getItem("marqueeList"));
      }else if(this.$store.state.main.marqueeList) {
        this.noticeStr = this.$store.state.main.marqueeList
      }
      if (this.noticeStr && this.noticeStr.length > 0) {
        window.clearInterval(this.intervalId);
      }
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
    onClose(){
      this.isShow = false;
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
@import "../../../../style/icon/home-icon-xpj";

.xf_bottom{
  width: 100%;
  height: 0.99rem;
  display: flex;
  align-items: center;
  background:url('../../../../assets/img/home/down/xf_bg.png');
  background-size: 100% 100%;
  position: fixed;
  bottom: 58px;
  span{
    height: 100%;
    display: flex;
    align-items: center;
    &:first-child{
      font-size:0.3rem;
      color:#fff;
      margin-left:0.95rem;
      i{
        font-size: 0.36rem;
        line-height: 0;
        color: #ff2403;
      }
    }
    &:nth-child(2){
      margin-left:0.58rem;
      img{
        width: 1.6rem;
        height: 0.58rem;
      }
    }
    &:last-child{
      margin-left:0.1rem;
      img{
        width: 0.32rem;
        height: 0.32rem;
      }
    }
  }
}
.home-page {
  .notice-box {
    width: 100%;
    height: 0.64rem;
    line-height: 0.64rem;
    font-size: 0.28rem;
    position: relative;
    background-color: #f3f3f3;
    padding: 0 0.05rem;
    .marquee-icon {
      position: absolute;
      top: 0;
      left: 0.05rem;
      width: 0.6rem;
      height: 0.64rem;
      background-image: url("../../../../assets/img/home/notice-icon.png");
      background-position: 0.1rem 0.14rem;
      background-size: 0.4rem 0.36rem;
      background-repeat: no-repeat;
    }
    .notice-bar {
      height: 0.64rem;
      line-height: 0.64rem;
      font-size: 0.28rem;
      padding: 0 0 0 0.6rem;
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
  /deep/.vux-slider {
    .vux-swiper {
      min-height: 3rem;
    }
  }

  .swiper-box {
    height: 2.892857142857143rem;
    transform: translate3d(0, 0, 0);
    overflow: hidden;
    .swiper-item {
      width: 100%;
      display: block;
      transform:translate3d(0,0,0);
      height: 2.892857142857143rem;
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
    padding: 0.25rem 0.15rem;
    overflow: hidden;
    align-items: center;
    .tit-left {
      display: block;
      font-size: 0.34rem;
      color: #1f1f1f;
      float: left;
      margin-left: 0.32rem;
      img {
        width: 0.35rem;
        height: 0.42rem;
        vertical-align: text-bottom;
        margin-right: 0.14rem;
      }
    }

    .tit-right {
      height: 100%;
      line-height: 0.46rem;
      color: #656363;
      float: right;
      font-size: 0.28rem !important;
      margin-right: 0.2rem;
    }
  }
  .list {
    width: 100%;
    background: white;
    padding: 0 0.08rem 0.25rem;
    margin: 0;
    box-sizing: border-box;
    &:after {
      content: "";
      display: table;
      clear: both;
    }

    .item {
      width: calc(100% / 4);
      margin-top: 0.25rem;
      float: left;
      .icon {
        display: block;
        margin: 0 auto;
        width: 1.15rem;
        min-width: 1.15rem;
        min-height: 1.15rem;
        height: 1.15rem;
      }

      .name {
        display: block;
        color: #555;
        font-size: 0.28rem;
        line-height: 0.28rem;
        margin-top: 0.1rem;
        width: 100%;
      }
    }
    &.recommendList {
      padding: 0 0.08rem 0.3rem;
      .item {
        margin-top: 0.3rem;
      }
      .item:nth-child(-n + 4) {
        margin-top: 0rem;
      }
    }
  }
}
</style>
