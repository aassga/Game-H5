<template>
  <view-page :class="['trend','number-font',{'k3':k3}]" ref="view-page" class="theme-header-bg" full-box :load-more="targetLength<maxLen" @load-top="onRefresh" @load-down="onLoadMore">
    <title-header title="开奖走势" slot="header" :style="headerStyle" class="theme-header-bg theme-header-bottom">
      <span slot="right" v-if="isAppIn" class="btn-lottery-selector" @click="showSelector=true">{{game?game.name:''}}</span>
      <span slot="right" v-else class="app-btn-lottery-selector" @click="showSelector=true">{{game?game.name:''}}</span>
    </title-header>

    <div slot="header-static" v-if="game" :class="{'black-tab' : $config.blackTheme || $config.newQP,'blush-tab': $config.blush}">
      <van-tabs v-if="game.series.toString()!=='10006'" line-height="2px" v-model="tabIndex" :title-active-color="targetTheme.color">
        <van-tab v-for="(tab, i) in tabs[game.series]" :title="tab.name" :key="i" class="theme-main-bg-5"></van-tab>
      </van-tabs>
    </div>

    <div slot="content" v-if="game">
      <CP11X5_ZS v-if="game.series.toString()==='10006'" :data-list="dataList"></CP11X5_ZS>
      <van-tabs v-model="tabIndex" slot="content" class="no-tab"  animated :swipeable="false" v-else :lazy-render="true" :duration='0.2'>
        <van-tab v-for="(item, i) in tabs[game.series]" :key="i">
            <keep-alive>
                <component :is="item.component" :data-list="dataList" :id="id.toString()"></component>
            </keep-alive>
        </van-tab>
      </van-tabs>

      <p class="no-more-info theme-color-white" :class="[game.series.toString()==='10011'?'no-more':'']" style="fontSize:0.26rem;line-height: 0.84rem;" :style="{color:game.series.toString()==='10011'?'#c9ebd0':'#000000'}">已显示最近{{targetLength}}期走势</p>
    </div>

    <van-popup slot="static" v-model="showSelector" :style="positionStyle" position="bottom" get-container="body">
      <van-picker show-toolbar :columns="games"  :item-height='40' @confirm="onGameChange" :title="'选择彩种'" :confirm-button-text="'确定'" :default-index="defaultIndex" value-key="name"
         @cancel="showSelector=false" :class="{'black-van-picker':$config.blackTheme || $config.newQP,'blush-van-picker':$config.blush}"></van-picker>
    </van-popup>
  </view-page>
</template>

<script>
import '../../../style/lottery/trend.less'

const CP11X5_ZS = () => import(/* webpackChunkName: "trend" */ './CP11X5/CP11X5-ZS')

const PCDD_JL = () => import(/* webpackChunkName: "trend" */ './PCDD/PCDD-JL')
const PCDD_SX = () => import(/* webpackChunkName: "trend" */ './PCDD/PCDD-SX')
const PCDD_ZS = () => import(/* webpackChunkName: "trend" */ './PCDD/PCDD-ZS')

const KLSF_JL = () => import(/* webpackChunkName: "trend" */ './KLSF/KLSF-JL')
const KLSF_ZS = () => import(/* webpackChunkName: "trend" */ './KLSF/KLSF-ZS')

const SSC_JL = () => import(/* webpackChunkName: "trend" */ './SSC/SSC-JL')
const SSC_XT = () => import(/* webpackChunkName: "trend" */ './SSC/SSC-XT')
const SSC_ZS = () => import(/* webpackChunkName: "trend" */ './SSC/SSC-ZS')

const LHC_JL = () => import(/* webpackChunkName: "trend" */ './LHC/LHC-JL')
const LHC_TW = () => import(/* webpackChunkName: "trend" */ './LHC/LHC-TW')
const LHC_ZH = () => import(/* webpackChunkName: "trend" */ './LHC/LHC-ZH')

const PK10_JL = () => import(/* webpackChunkName: "trend" */ './PK10/PK10-JL')
const PK10_LH = () => import(/* webpackChunkName: "trend" */ './PK10/PK10-LH')
const PK10_ZS = () => import(/* webpackChunkName: "trend" */ './PK10/PK10-ZS')

const K3_JL = () => import(/* webpackChunkName: "trend" */ './K3/K3-JL')
const K3_XT = () => import(/* webpackChunkName: "trend" */ './K3/K3-XT')
const K3_HZ = () => import(/* webpackChunkName: "trend" */ './K3/K3-HZ')
const K3_HM = () => import(/* webpackChunkName: "trend" */ './K3/K3-HM')

const DPC_JL = () => import(/* webpackChunkName: "trend" */ './DPC/DPC-JL')
const DPC_SX = () => import(/* webpackChunkName: "trend" */ './DPC/DPC-SX')
const DPC_ZS = () => import(/* webpackChunkName: "trend" */ './DPC/DPC-ZS')

export default {
  name: 'trend',
  components: {
    CP11X5_ZS,
    PCDD_JL,
    PCDD_SX,
    PCDD_ZS,
    KLSF_JL,
    KLSF_ZS,
    SSC_JL,
    SSC_XT,
    SSC_ZS,
    LHC_JL,
    LHC_TW,
    LHC_ZH,
    PK10_JL,
    PK10_LH,
    PK10_ZS,
    K3_JL,
    K3_XT,
    K3_HZ,
    K3_HM,
    DPC_JL,
    DPC_SX,
    DPC_ZS
  },
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    index: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
    isAppIn(){
      return !window.localStorage.isApp;
    },
    positionStyle(){
      //解决安卓小米position：fixed问题导致按钮错位问题
      if(this.$mobileDevice.isAndroid 
        && this.$mobileDevice.browserName === 'MIUI Browser'){
        return {
          position:'absolute'
        }
      }else{
        return {
          position:'fixed'
        }
      }
    },
    k3 () {
      return this.game && this.game.series.toString() === '10011'
    },
    defaultIndex () {
      return this.games ? this.games.indexOf(this.game) : 0
    },
    headerStyle () {
      if (this.k3 && !this.$config.blackTheme && !this.$config.newQP) {
        return {
          backgroundColor: '#2e6345 !important',
          color: '#c9ebd0 !important'
        }
      } else {
        return {}
      }
    }
  },
  data () {
    return {
      showSelector: false,
      tabIndex: 0,
      maxLen: 100,
      games: [],
      game: null,
      dataList: [],
      loading: false,
      targetLength: 0,
      animation:'slide-right',
      tabs: {
        10008: [
          {
            name: '开奖记录',
            component: 'PK10_JL'
          },
          {
            name: '开奖走势',
            component: 'PK10_ZS'
          },
          {
            name: '龙虎斗',
            component: 'PK10_LH'
          }
        ],
        10013: [
          {
            name: '开奖记录',
            component: 'SSC_JL'
          },
          {
            name: '开奖走势',
            component: 'SSC_ZS'
          },
          {
            name: '形态走势',
            component: 'SSC_XT'
          }
        ],
        10010: [
          {
            name: '开奖记录',
            component: 'LHC_JL'
          },
          {
            name: '头尾禽兽',
            component: 'LHC_TW'
          },
          {
            name: '总和记录',
            component: 'LHC_ZH'
          }
        ],
        10012: [
          {
            name: '开奖记录',
            component: 'KLSF_JL'
          },
          {
            name: '开奖走势',
            component: 'KLSF_ZS'
          }
        ],
        10006: [
          {
            name: '开奖走势',
            component: 'CP11X5_ZS'
          }
        ],
        10007: [
          {
            name: '开奖记录',
            component: 'PCDD_JL'
          },
          {
            name: '和值走势',
            component: 'PCDD_ZS'
          },
          {
            name: '号码属性',
            component: 'PCDD_SX'
          }
        ],
        10009: [
          {
            name: '开奖记录',
            component: 'DPC_JL'
          },
          {
            name: '开奖走势',
            component: 'DPC_ZS'
          },
          {
            name: '号码属性',
            component: 'DPC_SX'
          }
        ],
        10011: [
          {
            name: '开奖记录',
            component: 'K3_JL'
          },
          {
            name: '号码走势',
            component: 'K3_HM'
          },
          {
            name: '和值走势',
            component: 'K3_HZ'
          },
          {
            name: '形态走势',
            component: 'K3_XT'
          }
        ]
      }
    }
  },
  watch: {
    id: 'gameChange',
    gameList: 'gameChange',
    tabIndex(){
      this.$refs['view-page'].scroll.scrollTo(0, 0)
      this.onRefresh()
    },
  },
  created () {
    this.tabIndex = parseInt(this.index) || 0

  },
  mounted () {
    this.getGames()
    this.onRefresh()
  },
  methods: {
    onLoadMore () {
      this.loadList()
    },
    onRefresh () {
      this.dataList = []
      this.loadList(true)
    },
    loadList (statu) {
      if (this.loading) {
        this.toastText('正在获取数据,请稍等')
      } else if (this.dataList.length < this.maxLen) {
        this.loading = true;
        this.$store.dispatch('lottery/getTrend', {
          data: {
            lotteryId: this.id,
            pageSize:statu?20:this.targetLength + 20
          },
          callback: res => {
            if (this.$refs['view-page']) this.$refs['view-page'].loaded()
            this.loading = false
            res = res.data
            if (res.code === 200) {
              this.dataList = res.data.data.list
              this.targetLength = this.dataList.length
            }
          }
        })
      } else {
        this.toastText('暂无更多数据')
        if (this.$refs['view-page']) this.$refs['view-page'].loaded()
      }
    },
    onGameChange (game) {
      this.showSelector = false
      if (this.game !== game) {
        setTimeout(() => {
          this.$router.replace('/trend/' + game.id + '/0')
        }, 300)
      }
    },
    getGames () {
      this.$store.dispatch('main/getNewGame', {
        idIndex: 4,
        id: '30003',
        callback: baseRes => {
          if (baseRes['30003'] && baseRes['30003'].length) {
            let setId = {
              222 : 10006,
              223 : 10007,
              224 : 10008,
              225 : 10009,
              226 : 10010,
              227 : 10011,
              228 : 10012,
              229 : 10013,
            }
            const ids = baseRes['30003'].map(item => setId[item.id]).join('|')
            this.$store.dispatch('main/getNewGame', {
              idIndex: 4,
              id: ids,
              callback: res => {
                if (res) {
                  let list = []
                  Object.keys(res).forEach(id => {
                    list = list.concat(res[id])
                  })
                  this.games = list
                  if(this.$store.state.main.gameSortV4Note.lottery) {
                    this.game = this.$store.state.main.gameSortV4Note.lottery[this.games.find(game => game.id.toString() == this.id.toString())['id']]
                  }
                } else {
                  this.games = []
                }
              }
            })
          }
        }
      })
    },
    selectGame () {
      this.picker.show()
    }
  }
}
</script>

<style lang="less" scoped>
  .black-van-picker {
    background: linear-gradient(0deg, #0B0B0B, #100F0F);
    /deep/ .van-picker__toolbar {
      .van-picker__cancel, .van-picker__title ,.van-picker__confirm{ 
        color: #fff !important;
      }
      &::after {
        border: none !important;
      }
    }
    /deep/ .van-picker__columns {
      background: linear-gradient(0deg, #0B0B0B, #100F0F);
      .van-picker-column__item {
        color: #fff;
      }
    }
    /deep/ .van-picker__mask {
      background: none;
    }
  }
  .blush-van-picker {
    background: linear-gradient(0deg, #530107, #7E010C);
    /deep/ .van-picker__toolbar {
      .van-picker__cancel, .van-picker__title ,.van-picker__confirm{ 
        color: #fff !important;
      }
    }
    /deep/ .van-picker__columns {
      background: linear-gradient(0deg, #530107, #7E010C);
      .van-picker-column__item {
        color: #fff;
      }
    }
    /deep/ .van-picker__mask {
      background: none;
    }
  }
  .black-tab {
    /deep/ .van-tabs{
      .van-tabs__wrap::after {
        border: none !important;
      }
      .van-tabs__nav {
        background: linear-gradient(0deg, #0C0C0C, #222222) !important;
        .van-tab {
            color: #fff;
        }
      }
      .van-tab--active {
        color: #F6CF32 !important;
      }
      .van-tabs__line {
        background-color: #F6CF32 !important;
      }
    }
  }
  .blush-tab {
    /deep/ .van-tabs{
      .van-tabs__wrap::after {
        border: none !important;
      }
      .van-tabs__nav {
        background: linear-gradient(0deg, #9D010F, #72010B) !important;
        .van-tab {
            color: #fff;
        }
      }
      .van-tab--active {
        color: #F6CF32 !important;
      }
      .van-tabs__line {
        background-color: #F6CF32 !important;
      }
    }
  }
  .k3{
    /deep/.van-tabs__line{
      width:25%!important;
      webkit-transform: translate3d(0,0,0);
      -moz-transform: translate3d(0,0,0);
      -ms-transform: translate3d(0,0,0);
      -o-transform: translate3d(0,0,0);
      transform: translate3d(0,0,0);
      -webkit-backface-visibility: hidden;
    }
    /deep/.van-tabs{
      &:after{
        content: none;
        display: none;
      }
    }
    /deep/.van-hairline--top-bottom{
      
    }
  }
  /deep/.van-tabs__line{
    width:33%!important;
     webkit-transform: translate3d(0,0,0);
      -moz-transform: translate3d(0,0,0);
      -ms-transform: translate3d(0,0,0);
      -o-transform: translate3d(0,0,0);
      transform: translate3d(0,0,0);
     -webkit-backface-visibility: hidden;
  }

  .app-btn-lottery-selector {
    position: absolute;
    font-size: 0.28rem;
    right: 0.26rem;
    font-weight: bold;
    top: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn-lottery-selector {
    position: absolute;
    font-size: 0.28rem;
    right: 0.66rem;
    font-weight: bold;
    top: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    &:after {
      content: '';
      display: block;
      position: absolute;
      right: -0.4rem;
      top: 0.38rem;
      width: 0;
      height: 0;
      border-width: 0.12rem;
      border-style: solid;
      border-color: #ffffff rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);
    }
  }
  .trend {
    /deep/.van-tabs{
      &:after{
        content: none;
        display: none;
      }
    }
    .trend-box{
      .animation-box{
        
      }
    }
     .no-more-info {
      color: #000000;
      font-size: 0.26rem;
      line-height: 0.84rem;
      text-align: center;
    }
    .no-more{
      color:#c9ebd0!important;
    }
    .cp11x5-tab {
      display: flex;
      margin: 0;
      width: 100%;
      height: 0.72rem;
      padding: 0 3%;
      box-sizing: border-box;
      background-color: #ffffff;
      justify-content: space-between;
      align-items: center;

      .cp11x5-tab-item {
        display: block;
        width: 20%;
        font-size: 0.26rem;
        padding: 0.13rem 0;
        text-align: center;
        border-radius: 0.04rem;
        color: #555;
        font-weight: bold;

        &.active {
          color: #FFFFFF;
        }
      }
    }

    /deep/ .van-tab {
      font-size: 0.3rem;
      font-weight: bold;
      color: #666;
    }
  }

</style>
