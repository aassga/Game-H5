<template>
  <view-page full-box class="theme-header-bg">
    <title-header :title="title" class="theme-main-bg theme-header-bottom" v-if="!isApp" slot="header"></title-header>
    <div slot="content" class="content">
      <swiper class="lunbo_swpier" :options="swiperOption" ref="mySwiper">
        <swiper-slide class="swiper-slide" v-for="(item, index) in AllData" :key="index">
          <div>
            <img :src="item.url" style="display: block;transform:translate3d(0,0,0)" alt>
          </div>
        </swiper-slide>
        <div :class="['swiper-pagination']" slot="pagination"></div>
      </swiper>
    </div>
  </view-page>
</template>
<script>
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

export default {
  components: {
    swiper: VueAwesomeSwiper.swiper,
    swiperSlide: VueAwesomeSwiper.swiperSlide
  },
  data () {
    return {
      aAllData_code: [//A版邀请码
        { url: require('@site/assets/img/agent-doc/LJKH@2x.png') },
        { url: require('@src/assets/img/agent-doc/a/1.png') },
        { url: require('@src/assets/img/agent-doc/a/2.png') },
        { url: require('@src/assets/img/agent-doc/a/3.png') },
        { url: require('@src/assets/img/agent-doc/a/4.png') },
        { url: require('@src/assets/img/agent-doc/a/5.png') },
        { url: require('@src/assets/img/agent-doc/a/6.png') },        
        { url: require('@src/assets/img/agent-doc/a/7.png') },
        { url: require('@src/assets/img/agent-doc/a/10.png') },
        { url: require('@src/assets/img/agent-doc/a/8.png') },
        { url: require('@src/assets/img/agent-doc/a/9.png') }
        
      ],
      aAllData_link: [//A版邀请链接
        { url: require('@site/assets/img/agent-doc/LJKH@2x.png') },
        { url: require('@src/assets/img/agent-doc/a/1.png') },
        { url: require('@src/assets/img/agent-doc/a/2.png') },
        { url: require('@src/assets/img/agent-doc/a/3-1.png') },
        { url: require('@src/assets/img/agent-doc/a/4.png') },
        { url: require('@src/assets/img/agent-doc/a/5.png') },
        { url: require('@src/assets/img/agent-doc/a/6.png') },        
        { url: require('@src/assets/img/agent-doc/a/7.png') },
        { url: require('@src/assets/img/agent-doc/a/10.png') },
        { url: require('@src/assets/img/agent-doc/a/8.png') },
        { url: require('@src/assets/img/agent-doc/a/9.png') }
        
      ],
      aAllData_Agent_B: [//A版B代理模式
        { url: require('@site/assets/img/agent-doc/LJKH@2x.png') },
        { url: require('@src/assets/img/agent-doc/a/1.png') },
        { url: require('@src/assets/img/agent-doc/a/2.png') },
        { url: require('@src/assets/img/agent-doc/a/3-2.png') },
        { url: require('@src/assets/img/agent-doc/a/4-1.png') },
        { url: require('@src/assets/img/agent-doc/a/5.png') },
        { url: require('@src/assets/img/agent-doc/a/6.png') },        
        { url: require('@src/assets/img/agent-doc/a/7.png') },
        { url: require('@src/assets/img/agent-doc/a/10.png') },
        { url: require('@src/assets/img/agent-doc/a/8.png') },
        { url: require('@src/assets/img/agent-doc/a/9.png') }
        
      ],
      bAllData_code:[
        { url: require('@site/assets/img/agent-doc/LJKH@2x.png') },
        { url: require('@src/assets/img/agent-doc/b/1.png') },
        { url: require('@src/assets/img/agent-doc/b/2.png') },
        { url: require('@src/assets/img/agent-doc/b/3.png') },
        { url: require('@src/assets/img/agent-doc/b/4.png') },
        { url: require('@src/assets/img/agent-doc/b/5.png') },
        { url: require('@src/assets/img/agent-doc/b/6.png') },        
        { url: require('@src/assets/img/agent-doc/b/7.png') },
        { url: require('@src/assets/img/agent-doc/b/10.png') },
        { url: require('@src/assets/img/agent-doc/b/8.png') },
        { url: require('@src/assets/img/agent-doc/b/9.png') }
      ],
      bAllData_link:[
        { url: require('@site/assets/img/agent-doc/LJKH@2x.png') },
        { url: require('@src/assets/img/agent-doc/b/1.png') },
        { url: require('@src/assets/img/agent-doc/b/2.png') },
        { url: require('@src/assets/img/agent-doc/b/3-1.png') },
        { url: require('@src/assets/img/agent-doc/b/4.png') },
        { url: require('@src/assets/img/agent-doc/b/5.png') },
        { url: require('@src/assets/img/agent-doc/b/6.png') },        
        { url: require('@src/assets/img/agent-doc/b/7.png') },
        { url: require('@src/assets/img/agent-doc/b/10.png') },
        { url: require('@src/assets/img/agent-doc/b/8.png') },
        { url: require('@src/assets/img/agent-doc/b/9.png') }
      ],
      tcData_link:[
        { url: require('@site/assets/img/agent-doc/LJKH@2x.png') },
        { url: require('@src/assets/img/agent-doc/a/1.png') },
        { url: require('@src/assets/img/agent-doc/a/2.png') },
        { url: require('@src/assets/img/agent-doc/a/3-1.png') },
        { url: require('@src/assets/img/agent-doc/a/4-tc.png') },
        { url: require('@src/assets/img/agent-doc/a/5.png') },
        { url: require('@src/assets/img/agent-doc/a/6.png') },        
        { url: require('@src/assets/img/agent-doc/a/7.png') },
        { url: require('@src/assets/img/agent-doc/a/10.png') },
        { url: require('@src/assets/img/agent-doc/a/8.png') },
        { url: require('@src/assets/img/agent-doc/a/9.png') }
      ],
      blushData_link:[
        { url: require('@site/assets/img/agent-doc/LJKH@2x.png') },
        { url: require('@src/assets/img/agent-doc/bl/1.png') },
        { url: require('@src/assets/img/agent-doc/bl/2.png') },
        { url: require('@src/assets/img/agent-doc/bl/3.png') },
        { url: require('@src/assets/img/agent-doc/bl/4.png') },
        { url: require('@src/assets/img/agent-doc/bl/5.png') },
        { url: require('@src/assets/img/agent-doc/bl/6.png') },        
        { url: require('@src/assets/img/agent-doc/bl/7.png') },
        { url: require('@src/assets/img/agent-doc/bl/10.png') },
        { url: require('@src/assets/img/agent-doc/bl/8.png') },
        { url: require('@src/assets/img/agent-doc/bl/9.png') }
      ],
      title: '金字塔教程'
    }
  },
  computed: {
    AllData(){
      if(this.$config.home === 'vns'){
        if(this.siteModel === 'invite_link'){
          return this.bAllData_link;
        }else{
          return this.bAllData_code;
        }
      }else if(this.$config.home === 'tc'){
        return this.tcData_link
      }else if(this.$config.home === 'blush'){
        return this.blushData_link
      }else{
        if(this.personalMode === "mode_b"){//代理B模式
          return this.aAllData_Agent_B;
        }else{
          if(this.siteModel === 'invite_link'){
            return this.aAllData_link
          }else{
            return this.aAllData_code
          }
        }
        
      }
    },
    swiperOption () {
      return {
        initialSlide: parseInt(this.$route.query.clickIndex.toString()) || 0, // 设定初始化时slide的索引
        direction: 'horizontal', // Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)。
        loop: true, // 无限滚动
        speed: 300, // 滑动速度
        width: window.innerWidth,
        // paginationClickable: true,
        // centeredSlides: true,
        // notNextTick: false,
        // spaceBetween: 30,
        // observeParents: true,
        // observe:true,
        // autoplay: {
        //   delay: 500,
        //   disableOnInteraction: false
        // },
        // navigation: {
        //   nextEl: this.swipern,
        //   prevEl: this.swiperp
        // },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
        //  swiperSlides: [1, 2, 3, 4, 5]
        // mousewheelControl: true
      }
    }
  },
  mounted () {
    // this.$refs.mySwiper.swiper.slideTo(parseInt(this.$route.query.clickIndex), 1000, false)
  }
}
</script>
<style lang="less" scoped>
  .swiper-container {
    margin: 0 auto;
    position: relative;
    overflow: visible;
    list-style: none;
    padding: 0;
    z-index: 1;
  }
  .content {
    transform: translate3d(0, 0, 0);
    overflow: hidden;
  }

  .lunbo_swpier {
    margin-top: 8px;
    max-height: 100%;

    .swiper-slide {
      font-size: 0.28rem;
      display: inline-block;
      width: 100%;
      height: 100%;
      vertical-align: top;
      white-space: normal;
      margin: 0;
      padding: 0;
      border: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      box-sizing: border-box;
      text-size-adjust: 100%;

      div {
        font-size: 14px;
        display: inline-block;
        width: 100%;
        height: 100%;
        vertical-align: top;
        white-space: normal;
        margin: 0;
        padding: 0;
        border: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        box-sizing: border-box;

        img {
          display: block;
          margin: 0 auto;
          height: 11.5rem;
          border: none;
          vertical-align: middle;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          box-sizing: border-box;
          white-space: normal;
        }
      }
    }
  }

  .swiper-pagination {
    width: 100%;
    -webkit-transform: rotate(270deg);
    transform: rotate(360deg);
    position: absolute;
    top: 10.5rem;
  }

  /deep/ .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
    border: 0;
    background: #aaa;
    border-radius: 50%;
    opacity: 1;
  }

  /deep/ .swiper-pagination-bullet-active {
    width: 12px;
    height: 12px;
    border: 0;
    border-radius: 50%;
    opacity: 1;
    background: #007aff;
  }
</style>
