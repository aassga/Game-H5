<template>
  <view-page class="lottery-lhc" ref="view-page" full-box :position-style="positionStyle">
    <lottery-header slot="header"></lottery-header>

    <section slot="header-static">
      <div v-if="[12,13,16,17,18,19,27,3630,3631,3632,10044,10045].includes(Number($route.params.id))"  style="height:0.64rem;background: #fff; z-index:499">
        <i class='icon iconfont h5-icon-icon-gonggao theme-color theme-color-yellow-2' style="margin-right:0.1rem;top:0.15rem;left:0.24rem; position: absolute;z-index:500"></i>
        <simple-notice @curIndex='getCurIndex' :text="winnerList" />
      </div>
      <lottery-result :result="result" :closed.sync="closed" :opening.sync="opening"></lottery-result>
      <lottery-timer :result="result" :closed.sync="closed" :opening.sync="opening" :digits='digits'></lottery-timer>
      <lottery-play-way-nav v-model="playWayIndex" :play-list="playList"></lottery-play-way-nav>
    </section>

    <section class="lottery-body theme-header-bg theme-header-bg" slot="content" v-if="playList && playList.length">
      <van-tabs v-model="playWayIndex" animated  class="lottery-code-selector no-tab" :class="{'black-lottery-code-selector' : $config.blackTheme || $config.newQP}">
        <van-tab v-for="(play, i) in playList" :key="i" @touchmove.native="touchMove">

          <van-tabs v-model="tabIndex[i]" class="lottery-code-panel newQP-after-border-b-color"  :class="['lotter-code-tab'+i,{'black-tab' : $config.blackTheme || $config.newQP,'blush-tab': $config.blush}]"    v-if="checkPlayType(play)===1"  :swipe-threshold="7" :line-width='lineWidth'>
            <van-tab v-for="(item, j) in play.items" :key="j" :title="item.small"  >
              <ul class="lottery-code-panel-body theme-main-bg-5"  v-touch:left ="onSwipeLeft"  v-touch:right="onSwipeRight">
                <li class="lottery-code-item lottery-code-circle" @click="onCodeClick(code)" :class="{'active':targetCode.includes(code)}"
                    v-for="(code, k) in item.code.filter(c => !isNaN(parseInt(c.code)))" :key="'num-'+k">
                  <span class="lottery-code-item-name theme-gradient-bg-2 theme-border-1px theme-color-white cp-theme-border-1px" :class="['code-num-' + code.name,{'theme-border-yellow' : targetCode.includes(code)}]">{{code.name}}</span>
                  <span class="lottery-code-item-odds theme-color-gray-2" :class="{'theme-color-yellow-2' : targetCode.includes(code)}">{{code.odds}}</span>
                </li>
                <li class="hr1 theme-main-bg-6" style="margin-top: 0.28rem"></li>
                <li class="lottery-code-item" v-for="(code, k) in item.code.filter(c => isNaN(parseInt(c.code)))" :key="'code-'+k"
                    @click="onCodeClick(code)" :class="{active:targetCode.includes(code)}">
                  <span class="lottery-code-item-name theme-bg-active theme-gradient-bg-2 theme-border-1px theme-color-white cp-theme-border-1px" :class="{'active theme-border-yellow':targetCode.includes(code)}">{{code.name}}</span>
                  <span class="lottery-code-item-odds theme-color-active theme-color-gray-2" :class="{'active theme-color-yellow-2':targetCode.includes(code)}">{{code.odds}}</span>
                </li>
              </ul>
            </van-tab>
          </van-tabs>
          <ul v-else-if="checkPlayType(play)===0" v-touch:left ="onSwipeLeft"  v-touch:right="onSwipeRight">
            <li class="lottery-code-panel" v-for="(item, j) in play.items" :key="j">
              <p class="lottery-code-panel-title theme-header-bg theme-color-white">{{item.small}}</p>
              <ul class="lottery-code-panel-body theme-main-bg-5">
                <li class="lottery-code-item lottery-code-item-1-6" v-for="(code, k) in item.code" :key="'code-'+k"
                    @click="onCodeClick(code)" :class="{active:targetCode.includes(code)}">
                  <span class="lottery-code-item-name theme-bg-active theme-gradient-bg-2 theme-border-1px theme-color-white cp-theme-border-1px" :class="{'active theme-border-yellow':targetCode.includes(code)}">{{code.name}}</span>
                  <span class="lottery-code-item-odds theme-color-active theme-color-gray-2" :class="{'active theme-color-yellow-2':targetCode.includes(code)}">{{code.odds}}</span>
                </li>
              </ul>
            </li>
          </ul>

          <ul v-else-if="checkPlayType(play)===2" class="danbox" v-touch:left ="onSwipeLeft"  v-touch:right="onSwipeRight">
            <li class="lottery-code-panel" v-for="(code, j) in play.items[0].code" :key="j"
                @click="onCodeClick(code)" :class="{active:targetCode.includes(code)}">
              <p class="lottery-code-panel-title theme-header-bg theme-color-white">{{code.name}} {{code.odds}}</p>
              <ul class="lottery-code-panel-body theme-main-bg-5 theme-border-color" v-if="code['zodiac']">
                <li :class="['lottery-code-item lottery-code-circle',{'balck-lottery-code-item' : $config.blackTheme || $config.newQP|| $config.blush}]" v-for="(num, k) in code['zodiac']" :key="'code-'+k">
                  <span class="lottery-code-item-name theme-color-white" :class="'code-num-' + num">{{num}}</span>
                </li>
              </ul>
              <ul class="lottery-code-panel-body theme-main-bg-5 theme-border-color" v-else>
                <li :class="['lottery-code-item lottery-code-circle',{'balck-lottery-code-item' : $config.blackTheme || $config.newQP|| $config.blush}]" v-for="k in 5" :key="'code-'+k"
                    v-show="(k-1)+code.name.substr(0,1)!=='00'">
                  <span class="lottery-code-item-name theme-color-white" :class="'code-num-' + (k-1)+code.name.substr(0,1)">{{(k-1)+code.name.substr(0,1)}}</span>
                </li>
              </ul>
            </li>
          </ul>

          <van-tabs class="tab-lx" v-model="tabIndex[i]" v-else-if="checkPlayType(play)===3" :line-width='lineWidth'  :class="['lotter-code-tab'+i,{'black-tab' : $config.blackTheme|| $config.newQP,'blush-tab': $config.blush}]">
            <van-tab v-for="(item, j) in play.items" :key="j" :title="item.small">
              <ul class="heBox" v-touch:left ="onSwipeLeft"  v-touch:right="onSwipeRight">
                <li class="lottery-code-panel" v-for="(code, j) in item.code" :key="j" @click="onCodeClick(code)" :class="{active:targetCode.includes(code)}">
                  <p class="lottery-code-panel-title theme-header-bg theme-color-white">{{code.name}}{{code.odds}}</p>
                  <ul class="lottery-code-panel-body theme-main-bg-5 theme-border-color" v-if="code['zodiac']">
                    <li :class="['lottery-code-item lottery-code-circle',{'balck-lottery-code-item' : $config.blackTheme || $config.newQP|| $config.blush}]" v-for="(num, k) in code['zodiac']" :key="'code-'+k">
                      <span class="lottery-code-item-name theme-color-white" :class="'code-num-' + num">{{num}}</span>
                    </li>
                  </ul>
                  <ul class="lottery-code-panel-body theme-main-bg-5 theme-border-color" v-else>
                    <li :class="['lottery-code-item lottery-code-circle',{'balck-lottery-code-item' : $config.blackTheme || $config.newQP|| $config.blush}]" v-for="k in 5" :key="'code-'+k"
                        v-show="(k-1)+code.name.substr(0,1)!=='00'">
                      <span class="lottery-code-item-name theme-color-white" :class="'code-num-' + (k-1)+code.name.substr(0,1)">{{(k-1)+code.name.substr(0,1)}}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </van-tab>
          </van-tabs>

          <van-tabs class="tab-lx"  v-model="tabIndex[i]" v-else-if="checkPlayType(play)===4" :line-width='lineWidth' :class="['lotter-code-tab'+i,{'black-tab' : $config.blackTheme|| $config.newQP,'blush-tab': $config.blush}]">
            <van-tab v-for="(item, j) in play.items" :key="j">
              <div class="tab-title" slot="title" v-if="playWayIndex==10">
                <span>{{item.small.toString()}}</span>
              </div>
              <div class="tab-title" slot="title" v-else>
                <span>{{item.small.toString().substr(0, 3)}}</span>
                <span>({{item.small.toString().substr(3)}})</span>
              </div>
              <ul class="bigBox" v-touch:left ="onSwipeLeft"  v-touch:right="onSwipeRight">
                <li class="lottery-code-panel" v-for="(code, j) in item.code" :key="j" @click="onCodeClick(code)" :class="{active:targetCode.includes(code)}">
                  <p class="lottery-code-panel-title theme-header-bg theme-color-white">{{code.name}} {{code.odds}}</p>
                  <ul class="lottery-code-panel-body theme-main-bg-5 theme-border-color" v-if="code['zodiac']">
                    <li :class="['lottery-code-item lottery-code-circle',{'balck-lottery-code-item' : $config.blackTheme || $config.newQP|| $config.blush}]" v-for="(num, k) in code['zodiac']" :key="'code-'+k">
                      <span class="lottery-code-item-name theme-color-white" :class="'code-num-' + num">{{num}}</span>
                    </li>
                  </ul>
                  <ul class="lottery-code-panel-body theme-main-bg-5 theme-border-color" v-else>
                    <li :class="['lottery-code-item lottery-code-circle',{'balck-lottery-code-item' : $config.blackTheme || $config.newQP|| $config.blush}]" v-for="k in 5" :key="'code-'+k"
                        v-show="(k-1)+code.name.substr(0,1)!=='00'">
                      <span class="lottery-code-item-name theme-color-white" :class="'code-num-' + (k-1)+code.name.substr(0,1)">{{(k-1)+code.name.substr(0,1)}}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </van-tab>
          </van-tabs>

          <van-tabs :class="[{'black-tab' : $config.blackTheme|| $config.newQP,'blush-tab': $config.blush}]" v-model="tabIndex[i]" v-else-if="checkPlayType(play)===5" :line-width='lineWidth' >
            <van-tab v-for="(item, j) in play.items" :key="j" :title="item.small">
              <ul v-touch:left ="onSwipeLeft"  v-touch:right="onSwipeRight">
                <li class="lottery-code-panel" v-for="(code, k) in item.code" :key="k" @click="onCodeClick(code)" :class="{active:targetCode.includes(code)}">
                  <p class="lottery-code-panel-title theme-header-bg theme-color-white">{{code.name}} {{code.odds}}</p>
                  <ul class="lottery-code-panel-body lottery-code-panel-body-sb theme-main-bg-5">
                    <li class="lottery-code-item lottery-code-circle lottery-code-circle-small" v-for="(num, l) in SB[j][k]" :key="'code-'+l">
                      <span class="lottery-code-item-name theme-color-white" :class="'code-num-' + num">{{num}}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </van-tab>
          </van-tabs>
        </van-tab>
      </van-tabs>
    </section>

    <div class="closed" slot="content-static" v-show="closed">
      <span class="info">已封盘</span>
    </div>

    <lottery-bet-input @clear="clear" slot="footer" :code.sync="targetCode" :ball.sync="targetBall" :tabIndex="tabIndex[playWayIndex]" :ball-list="ballList"
                       :series="series.toString()" :id="id.toString()" :way="playList[playWayIndex]" :result="result"></lottery-bet-input>

    <div slot="static">
      <slot></slot>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import lotteryMixin from '../mixin'
import LotteryResult from './LotteryResult'
import LotteryTimer from './LotteryTimer'
import SimpleNotice from '../../component/simple-notice-bar/simple-notice-bar'
export default {
  name: 'LotteryLhc',
  components: {
    LotteryResult,
    LotteryTimer,
    SimpleNotice
  },
  mixins: [lotteryMixin],
  data () {
    return {
      SB: [
        [
          [1, 7, 13, 19, 23, 29, 35, 45, 2, 8, 12, 18, 24, 30, 34, 40, 46],
          [3, 9, 15, 25, 31, 37, 41, 47, 4, 10, 14, 20, 26, 36, 42, 48],
          [5, 11, 17, 21, 27, 33, 39, 43, 6, 16, 22, 28, 32, 38, 44,49]
        ],
        [
          [1, 7, 13, 19, 23, 29, 35, 45],
          [2, 8, 12, 18, 24, 30, 34, 40, 46],
          [29, 30, 34, 35, 40, 45, 46],
          [1, 2, 7, 8, 12, 13, 18, 19, 23, 24],
          [1, 7, 12, 18, 23, 29, 30, 34, 45],
          [2, 8, 13, 19, 24, 35, 40, 46]
        ],
        [
          [3, 9, 15, 25, 31, 37, 41, 47],
          [4, 10, 14, 20, 26, 36, 42, 48],
          [25, 26, 31, 36, 37, 41, 42, 47, 48],
          [3, 4, 9, 10, 14, 15, 20],
          [3, 9, 10, 14, 25, 36, 41, 47],
          [4, 15, 20, 26, 31, 37, 42, 48]
        ],
        [
          [5, 11, 17, 21, 27, 33, 39, 43],
          [6, 16, 22, 28, 32, 38, 44],
          [27, 28, 32, 33, 38, 39, 43, 44],
          [5, 6, 11, 16, 17, 21, 22],
          [5, 16, 21, 27, 32, 38, 43],
          [6, 11, 17, 22, 28, 33, 39, 44]
        ]
      ],
      tabIndex: [],
      ballList: [],
    }
  },
  watch: {
    playWayIndex () {
      this.tabIndex[this.playWayIndex] = 0
    },
    tabIndex: {
      handler () {
        this.clear()
      }
    }
  },
  computed:{
    lineWidth(){
      let datas = this.playList[this.playWayIndex].items;
      return parseFloat(document.body.clientWidth / datas.length)
    }
  },
  mounted () {

  },
  methods: {
    getCurIndex(index){
      this.currIndex = index
    },
     onSwipeLeft () {
      if (this.playWayIndex + 1 < this.playList.length) {
        this.playWayIndex++
      }
    },
    onSwipeRight () {
      if (this.playWayIndex > 0) {
        this.playWayIndex--
      }
    },
    touchMove (evt) {
      if (evt.target.className === 'van-ellipsis') evt.stopPropagation()
    },
    checkPlayType (play) {
      if (['特码', '正码', '正码特', '连码', '全不中'].includes(play.big)) return 1
      else if (['特肖', '一肖', '尾数'].includes(play.big)) return 2
      else if (['合肖'].includes(play.big)) return 3
      else if (['连肖', '连尾'].includes(play.big)) return 4
      else if (['色波'].includes(play.big)) return 5
      else return 0
    },
    onCodeClick (code) {
      const index = this.targetCode.indexOf(code)
      if (index > -1) {
        this.targetCode.splice(index, 1)
      } else if (this.checkCount()) {
        this.targetCode.push(code)
      }
    },
    checkCount () {
      let status = true
      const way = this.playList[this.playWayIndex]
      if (way.big === '连码') {
        if (this.targetCode.length >= 10) {
          this.toastText('不能超过10个号码', 'top')
          status = false
        }
      } else if (way.big === '连肖') {
        const small = way.items[this.tabIndex[this.playWayIndex]]
        const count = small.small.toString().substr(0, 1)
        if (count === '二' && this.targetCode.length >= 2) {
          this.toastText('不能超过2个生肖', 'top')
          status = false
        } else if (count === '三' && this.targetCode.length >= 3) {
          this.toastText('不能超过3个生肖', 'top')
          status = false
        } else if (count === '四' && this.targetCode.length >= 4) {
          this.toastText('不能超过4个生肖', 'top')
          status = false
        } else if (count === '五' && this.targetCode.length >= 5) {
          this.toastText('不能超过5个生肖', 'top')
          status = false
        }
      } else if (way.big === '连尾') {
        const small = way.items[this.tabIndex[this.playWayIndex]]
        const count = small.small.toString().substr(0, 1)

        if (count === '二' && this.targetCode.length >= 2) {
          this.toastText('不能超过2个尾数', 'top')
          status = false
        } else if (count === '三' && this.targetCode.length >= 3) {
          this.toastText('不能超过3个尾数', 'top')
          status = false
        } else if (count === '四' && this.targetCode.length >= 4) {
          this.toastText('不能超过4个尾数', 'top')
          status = false
        } else if (count === '五' && this.targetCode.length >= 5) {
          this.toastText('不能超过5个尾数', 'top')
          status = false
        }
      } else if (way.big === '合肖') {
        const small = way.items[this.tabIndex[this.playWayIndex]]
        const count = small.small.toString()

        if (count === '二肖' && this.targetCode.length >= 2) {
          this.toastText('不能超过2个生肖', 'top')
          status = false
        } else if (count === '三肖' && this.targetCode.length >= 3) {
          this.toastText('不能超过3个生肖', 'top')
          status = false
        } else if (count === '四肖' && this.targetCode.length >= 4) {
          this.toastText('不能超过4个生肖', 'top')
          status = false
        } else if (count === '五肖' && this.targetCode.length >= 5) {
          this.toastText('不能超过5个生肖', 'top')
          status = false
        } else if (count === '六肖' && this.targetCode.length >= 6) {
          this.toastText('不能超过6个生肖', 'top')
          status = false
        } else if (count === '七肖' && this.targetCode.length >= 7) {
          this.toastText('不能超过7个生肖', 'top')
          status = false
        } else if (count === '八肖' && this.targetCode.length >= 8) {
          this.toastText('不能超过8个生肖', 'top')
          status = false
        } else if (count === '九肖' && this.targetCode.length >= 9) {
          this.toastText('不能超过9个生肖', 'top')
          status = false
        } else if (count === '十肖' && this.targetCode.length >= 10) {
          this.toastText('不能超过10个生肖', 'top')
          status = false
        } else if (count === '十一肖' && this.targetCode.length >= 11) {
          this.toastText('不能超过11个生肖', 'top')
          status = false
        }
      } else if (way.big === '全不中') {
        const small = way.items[this.tabIndex[this.playWayIndex]]
        const count = small.small.toString()
        if (count === '二' && this.targetCode.length >= 2) {
          this.toastText('不能超过2个号码', 'top')
          status = false
        } else if (count === '三' && this.targetCode.length >= 3) {
          this.toastText('不能超过3个号码', 'top')
          status = false
        } else if (count === '四' && this.targetCode.length >= 4) {
          this.toastText('不能超过4个号码', 'top')
          status = false
        } else if (count === '五不中' && this.targetCode.length >= 5) {
          this.toastText('不能超过5个号码', 'top')
          status = false
        } else if (count === '六不中' && this.targetCode.length >= 6) {
          this.toastText('不能超过6个号码', 'top')
          status = false
        } else if (count === '七不中' && this.targetCode.length >= 7) {
          this.toastText('不能超过7个号码', 'top')
          status = false
        } else if (count === '八不中' && this.targetCode.length >= 8) {
          this.toastText('不能超过8个号码', 'top')
          status = false
        } else if (count === '九不中' && this.targetCode.length >= 9) {
          this.toastText('不能超过9个号码', 'top')
          status = false
        } else if (count === '十不中' && this.targetCode.length >= 10) {
          this.toastText('不能超过10个号码', 'top')
          status = false
        } else if (count === '十一不中' && this.targetCode.length >= 11) {
          this.toastText('不能超过11个号码', 'top')
          status = false
        } else if (count === '十二不中' && this.targetCode.length >= 12) {
          this.toastText('不能超过12个号码', 'top')
          status = false
        }
      }

      return status
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
 
  .lottery-lhc {
    font-weight: bold;

    .lottery-body {

      .lottery-code-selector {
        .danbox,.bigBox,.heBox{
          .lottery-code-panel-body{
              width: 100%;
              text-align: left;
              border-top: 0.02rem solid rgba(241, 241, 241, 0.6);
              border-bottom: 0.02rem solid rgba(241, 241, 241, 0.6);
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              display: block;
            .lottery-code-item{
                display: inline-block;
                -webkit-box-flex: 1;
                -webkit-flex: 1;
                -ms-flex: 1;
                flex: 1;
                font-weight: 700;
                font-size: 0.38rem;
                width: 0.84rem;
                height: 0.84rem;
                border-radius: 50%;
                text-align: center;
                line-height: 0.84rem;
                border: 1px solid rgba(241, 241, 241, 0.6);
                margin: 0.2rem;
                &.balck-lottery-code-item {
                  border: none;
                }
            }
          }
        }
        .lottery-code-panel {

          .lottery-code-panel-body {

            .lottery-code-item-1-6:nth-child(7),
            .lottery-code-item-1-6:nth-child(10) {
              margin-right: 1rem;
            }

            &.lottery-code-panel-body-sb {
              padding-left: 0;
              padding-right: 0;
              padding-bottom: 0.2rem;
            }

            .lottery-code-item-name {
              font-size: 0.36rem !important;
              font-weight: bold !important;
            }

            .lottery-code-item-odds {
              font-weight: 400 !important;
            }

            .lottery-code-circle-big {

              .lottery-code-item-name {
                width: 0.84rem;
                height: 0.84rem;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.4rem !important;
              }
            }

            .lottery-code-circle-small {
              width: auto;
              padding: 0 0.05rem;
              margin-top: 0.2rem;

              .lottery-code-item-name {
                width: 0.64rem;
                height: 0.64rem;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.36rem !important;
              }
            }

            .code-num-1,
            .code-num-01,
            .code-num-2,
            .code-num-02,
            .code-num-7,
            .code-num-07,
            .code-num-8,
            .code-num-08,
            .code-num-12,
            .code-num-13,
            .code-num-18,
            .code-num-19,
            .code-num-23,
            .code-num-24,
            .code-num-29,
            .code-num-30,
            .code-num-34,
            .code-num-35,
            .code-num-40,
            .code-num-45,
            .code-num-46 {
              color: #f36055;
              border-color: #f36055;
            }

            .code-num-3,
            .code-num-03,
            .code-num-4,
            .code-num-04,
            .code-num-9,
            .code-num-09,
            .code-num-15,
            .code-num-25,
            .code-num-31,
            .code-num-37,
            .code-num-41,
            .code-num-47,
            .code-num-04,
            .code-num-10,
            .code-num-14,
            .code-num-20,
            .code-num-26,
            .code-num-36,
            .code-num-42,
            .code-num-48 {
              color: #20a2d8;
              border-color: #20a2d8;
            }
            .code-num-5,
            .code-num-05,
            .code-num-6,
            .code-num-06,
            .code-num-11,
            .code-num-17,
            .code-num-21,
            .code-num-27,
            .code-num-33,
            .code-num-39,
            .code-num-43,
            .code-num-06,
            .code-num-16,
            .code-num-22,
            .code-num-28,
            .code-num-32,
            .code-num-38,
            .code-num-44,
            .code-num-49 {
              color: #49bb27;
              border-color: #49bb27;
            }
          }
          .blue {
            background-color: #20a2d8;
          }

          .red {
            background-color: #f36055;
          }

          .green {
            background-color: #49bb27;
          }
        }
        .lotter-code-tab9{
          /deep/.van-tabs__nav{
            display:flex;
            .van-tab{
              flex: 0 0 14%;
              flex-basis: 14%!important;
            }
          }
          /deep/.van-tabs__line{
            width:10%!important;
          }
        }
        .lotter-code-tab10{
          /deep/.van-tabs__nav{
            // display: flex!important;
            display: block;
            width: 100%;
            white-space: nowrap;
            overflow-x: scroll;
            line-height: 0;
            -webkit-overflow-scrolling: touch;
            .van-tab{
            -webkit-box-sizing: border-box;
              box-sizing: border-box;
              -webkit-box-flex: 0;
              -webkit-flex: none;
              -ms-flex: none;
              flex: none;
              width: auto !important;
              padding: 0 0.3rem;
              }
            }
            .van-tabs__wrap--scrollable .van-tabs__nav {
              overflow: hidden;
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
            }
            
            .van-tabs__nav--line {
              box-sizing: content-box;
              height: 100%;
              padding-bottom: 0.3rem;
            }
            .van-tabs__nav {
              position: relative;
              display: -webkit-box;
              display: -webkit-flex;
              display: flex;
              background-color: #fff;
              -webkit-user-select: none;
              user-select: none;
          }
          /deep/.van-tab{
            flex:none;
            .van-ellipsis{
              padding:0;
            }
            .tab-title{
              font-size: 0.3rem;
            }
          }
          /deep/.van-tabs__line{
            width:18%!important;
          }
        }
        .lotter-code-tab11{
          /deep/.van-tabs__nav{
            display:flex!important;
            .van-tab{
              flex: 0 0 14%;
              flex-basis: 14%!important;
              padding:0;
            }
            .van-tab:nth-child(10){
              flex: 0 0 20%;
              flex-basis: 18%!important;
            }
          }
          /deep/.van-tabs__line{
            width:12%!important;
          }
        }
        .lotter-code-tab12{
          /deep/.van-tabs__nav{
            // display:flex!important;
             .van-tab {
               padding:0 0.18rem;
              // flex: 0 0 20%;
              // flex-basis: 16.8%!important;
              span{
                  padding:0;
                }
              }
          }
          /deep/.van-tabs__line{
            width:13%!important;
          }
        }

        .active {
          .code-num-1,
          .code-num-01,
          .code-num-2,
          .code-num-02,
          .code-num-7,
          .code-num-07,
          .code-num-8,
          .code-num-08,
          .code-num-12,
          .code-num-13,
          .code-num-18,
          .code-num-19,
          .code-num-23,
          .code-num-24,
          .code-num-29,
          .code-num-30,
          .code-num-34,
          .code-num-35,
          .code-num-40,
          .code-num-45,
          .code-num-46 {
            background-color: #FB162D;
            color: #fff !important;
          }

          .code-num-3,
          .code-num-03,
          .code-num-4,
          .code-num-04,
          .code-num-9,
          .code-num-09,
          .code-num-15,
          .code-num-25,
          .code-num-31,
          .code-num-37,
          .code-num-41,
          .code-num-47,
          .code-num-04,
          .code-num-10,
          .code-num-14,
          .code-num-20,
          .code-num-26,
          .code-num-36,
          .code-num-42,
          .code-num-48 {
            background-color: #5598FC;
            color: #fff !important;
          }

          .code-num-5,
          .code-num-05,
          .code-num-6,
          .code-num-06,
          .code-num-11,
          .code-num-17,
          .code-num-21,
          .code-num-27,
          .code-num-33,
          .code-num-39,
          .code-num-43,
          .code-num-06,
          .code-num-16,
          .code-num-22,
          .code-num-28,
          .code-num-32,
          .code-num-38,
          .code-num-44,
          .code-num-49 {
            background-color: #4CAF50;
            color: #fff !important;
          }
        }

        /deep/ .van-tab {
          font-size: 0.3rem;
          font-weight:400;
        }

        /deep/ .van-hairline--top-bottom::after {
          border-bottom: 0.04rem solid #ebedf0;
          border-top: none;
        }
        .tab-lx {
          .tab-title {
            font-size: 0.26rem;
            line-height: 0.26rem;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 0.88rem;
          }
        }
        &.black-lottery-code-selector {
          &::after {
            border-bottom: none;
          }
          .van-tabs::after {
            border-bottom: none;
          }
        }
      }
    }
  }
  .notice-bar{
    background-color: #F7F7F7;
    position: relative;
    box-sizing: border-box;
    font-size: 0.24rem;
  }
  .black-tab {
    /deep/ .van-tabs__wrap{
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
      &::after {
        border: none !important;
      }
    }
  }
  .blush-tab {
    /deep/ .van-tabs__wrap{
      .van-tabs__nav {
        background: #530107 !important;
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
</style>
