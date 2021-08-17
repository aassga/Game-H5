<template>
  <view-page ref="view-page" full-box :position-style="positionStyle">
    <lottery-header slot="header"></lottery-header>

    <section slot="header-static">
      <lottery-result :result="result" :closed.sync="closed" :opening.sync="opening"></lottery-result>
      <lottery-timer :result="result" :closed.sync="closed" :opening.sync="opening" :digits='digits'></lottery-timer>
      <lottery-play-way-nav v-model="playWayIndex" :play-list="playList"></lottery-play-way-nav>
    </section>

    <section slot="content" class="lotter-11x5">
      <van-tabs v-model="playWayIndex" animated swipeable class="lottery-body no-tab theme-header-bg">
        <van-tab class="lottery-play" v-for="(play, i) in playList" :key="i">
          <lottery-code-selector :code.sync="targetCode" :ball.sync="targetBall" :play="play" :ball-list="ballList"></lottery-code-selector>
        </van-tab>
      </van-tabs>

      <lottery-ball-results :result="result" :closed="closed" :opening="opening"></lottery-ball-results>
    </section>

    <div class="closed" slot="content-static" v-show="closed">
      <span class="info">已封盘</span>
    </div>

    <lottery-bet-input @clear="clear" slot="footer" :code.sync="targetCode" :ball.sync="targetBall"  :ball-list="ballList"
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

export default {
  name: 'LotteryCp11x5',
  components: {
    LotteryCodeSelector,
    LotteryResult,
    LotteryTimer
  },
  mixins: [lotteryMixin],
  
  data () {
    return {
      ballList: ['第一球', '第二球', '第三球', '第四球', '第五球']
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>

.lotter-11x5{
    /deep/.van-tabs{
      &:after{
        content:none;
        display:none;
      }
    }

  }
</style>
