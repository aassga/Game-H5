<template>
  <view-page class="home-type" style="background-color:#ffffff" @left="onSwiperLeft" @right="onSwiperRight" header-touch>
    <title-header slot="header" title="全部彩票" back-event @back="$router.replace('/home')" v-no-touch-move></title-header>

    <vant-tabs class="lottery-tab" :swipe-threshold="3" v-model="tabIndex" slot="header-static">
      <vant-tab v-for="(tab,i) in tabs" :key="i">
        <div slot="title" class="lottery-tab-item">
          <img class="tab-icon" :src="tab.icon" alt/>
          <!--            <span class="tab-icon tctx-icon" :class="'tctx_title_icon_'+tab.id"></span>-->
          <span class="tab-name">{{tab.name}}</span>
        </div>
      </vant-tab>
    </vant-tabs>

    <div slot="content" style="min-height: 100%">
      <div style="position: relative;" :style="{height:listHeight+'px'}">
        <transition :name="animation">
          <ul class="list" :key="tabs[tabIndex].id+'-'+loaded" ref="list"
              v-if="tabs[tabIndex]&&list[tabs[tabIndex].id]">
            <li class="item" v-for="(lottery,i) in list[tabs[tabIndex].id]" :key="i" @click="onGameClick(lottery)">
              <img class="lottery-img-icon" src="../../../../assets/img/error-img-lottery.png" v-real-img="lottery.icon" alt/>
              <!--              <span class="lottery-img-icon lottery-size" :class="'tctx_icon_'+lottery.id"></span>-->
              <p class="lottery-name">{{lottery.name}}</p>
              <i v-if="stopId.includes(lottery.id)" class="logo-stop"></i>
            </li>
          </ul>
        </transition>
      </div>
    </div>

    <div slot="static">
      <slot></slot>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import { Tabs, Tab } from 'vant'

export default {
  name: 'TypeTCTX',
  components: {
    vantTabs: Tabs,
    vantTab: Tab
  },
  data () {
    return {
      stopId: [], //2 , 5, 7 , 10
      tabIndex: 0,
      tabs: [],
      list: {},
      desc: {},
      listHeight: 0,
      animation: '',
      loaded: 0
    }
  },
  computed: {
    allPath () {
      return this.$store.state.main.config['statics'] + 'images/' + this.$store.state.main.config['theme'] + '/other/all.png?v=' + window.VERSION
    },
    checkTabs () {
      const tab = []
      this.tabs.forEach(item => {
        if (!item.type || this.list.find(lottery => lottery.className === item.type)) {
          tab.push(item)
        }
      })
      return tab
    }
  },
  watch: {
    tabIndex (now, old) {
      this.animation = now > old ? 'slide-left' : 'slide-right'
      this.$nextTick(() => {
        this.checkHeight()
      })
    }
  },
  created () {
    this.getTab()
  },
  methods: {
    checkHeight () {
      this.listHeight = this.$refs.list ? this.$refs.list.offsetHeight : 0
    },
    getTab () {
      this.$store.dispatch('main/gameSort', {
        id: '10000',
        callback: res => {
          if (res) {
            const tabs = res['10000'] || []

            if (tabs && tabs.length) {
              tabs.splice(0, 0, {
                code: 'all',
                icon: this.publicStaticHost + '/images/default/m/all.png',
                id: 10000,
                lock: 0,
                name: '全部彩票',
                series: 10000,
                tag: '',
                type: 'lottery-list'
              })

              this.tabs = tabs

              this.$store.dispatch('main/gameSort', {
                id: this.tabs.map(tab => tab.id).join('|'),
                callback: res => {
                  if (res) {
                    this.loaded++
                    this.list = res
                    this.checkHeight()
                  } else {
                    this.list = {}
                  }
                }
              })
            } else {
              this.tabs = []
            }
          }
        }
      })
    },
    onSwiperLeft () {
      if (this.tabIndex + 1 < this.tabs.length) {
        this.tabIndex++
      }
    },
    onSwiperRight () {
      if (this.tabIndex > 0) {
        this.tabIndex--
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .home-type {
    background-color: #efeef4;
    width: 100%;
    height: 100%;
    position: relative;

    .lottery-tab {
      background-color: #22292c;
      padding-top: 0;

      /deep/ .van-tabs__wrap {
        height: 1.5rem;
      }

      /deep/ .van-tabs__line {
        display: none;
      }

      /deep/ .van-tabs__nav {
        background-color: #22292c;
      }

      /deep/ .van-hairline--top-bottom::after {
        border-width: 0;
        display: none;
      }
    }

    .lottery-tab-item {
      background-color: #22292c;
      padding: 0.06rem 0;
      color: #5c5f60;
      box-sizing: border-box;
      height: 1.5rem;
      width: 100%;

      .tab-icon {
        width: 0.6rem;
        height: 0.6rem;
        max-width: 0.6rem;
        max-height: 0.6rem;
        display: block;
        margin: 0.16rem auto;
        opacity: 0.6;
      }

      .tctx-icon {
        background-image: url(/static/img/tctx_icon.png);
        background-repeat: no-repeat;
        background-size: 7.03rem 14.72rem;
      }

      .tab-name {
        margin-top: 0.04rem;
        font-size: 0.349rem;
        line-height: 0.349rem;
        display: block;
      }
    }

    /deep/ .van-tab {
      padding: 0 !important;
      margin: 0 !important;
      width: 2.16rem !important;
    }

    /deep/ .van-tab--active .lottery-tab-item {
      background-color: #151b1d;
      color: #f2f2f2;
    }

    /deep/ .van-tab--active .lottery-tab-item .tab-icon {
      opacity: 1 !important;
    }

    .scroll-box {
      width: 100%;
      box-sizing: border-box;
      position: absolute;
    }

    .list {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      border-top: 0.01rem solid #d8d8d8;
      background-color: #fff;
      box-sizing: border-box;
      overflow: visible;
      /*border-bottom: 0.01rem solid #d8d8d8;*/

      &:after {
        content: '';
        display: table;
        clear: both;
      }

      .item {
        width: calc(100% / 3);
        display: block;
        float: left;
        border-bottom: 0.01rem solid #d8d8d8;
        border-right: 0.01rem solid #d8d8d8;
        box-sizing: border-box;
        padding: 0.2rem 0;
        height: 1.76rem;
        line-height: 0;
        position: relative;
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

        .lottery-img-icon {
          width: 0.8rem;
          height: 0.8rem;
          display: block;
          margin: 0 auto;
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

        .lottery-name {
          margin-top: 0.2rem;
          font-size: 0.3rem;
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
  }
</style>
