<template>
  <view-page ref="view-page" full-box :position-style="positionStyle">
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

    <section slot="content" class="lotter-klsf">
      <van-tabs v-model="playWayIndex" animated swipeable class="lottery-body no-tab theme-header-bg">
        <van-tab class="lottery-play" v-for="(play, i) in playList" :key="i">
          <lottery-code-selector :code.sync="targetCode" :ball.sync="targetBall" :play="play" :ball-list="ballList"></lottery-code-selector>
        </van-tab>
      </van-tabs>

      <lottery-ball-results class="big-ball" :result="result" :closed="closed" :opening="opening"></lottery-ball-results>
    </section>

    <div class="closed" slot="content-static" v-show="closed">
      <span class="info">已封盘</span>
    </div>

    <lottery-bet-input @clear="clear" slot="footer" :code.sync="targetCode" :ball.sync="targetBall" :ball-list="ballList"
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
import LotteryCodeSelector from '../../component/lottery-code-selector/LotteryCodeSelector'
import SimpleNotice from '../../component/simple-notice-bar/simple-notice-bar'
export default {
  name: 'LotteryKlsf',
  components: {
    LotteryCodeSelector,
    LotteryResult,
    LotteryTimer,
    SimpleNotice
  },
  mixins: [lotteryMixin],
  data () {
    return {
      ballList: ['第一球', '第二球', '第三球', '第四球', '第五球', '第六球', '第七球', '第八球']
    }
  },
  methods: {
    getCurIndex(index){
      this.currIndex = index
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
.lotter-klsf{
    /deep/.van-tabs{
      &:after{
        content:none;
        display:none;
      }
    }
  }
  .notice-bar{
    background-color: #F7F7F7;
    position: relative;
    box-sizing: border-box;
    font-size: 0.24rem;
  }
</style>
