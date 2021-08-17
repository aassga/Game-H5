<template>
  <view-page ref="view-page" full-box :position-style="positionStyle">
    <lottery-header slot="header"></lottery-header>

    <section slot="header-static">
      <div class="lottery-header-inline">
        <lottery-result :result="result" :closed.sync="closed" :opening.sync="opening"></lottery-result>
        <lottery-timer :result="result" :closed.sync="closed" :opening.sync="opening"></lottery-timer>
      </div>
      <lottery-play-way-nav v-model="playWayIndex" :play-list="playList" type="pcdd"></lottery-play-way-nav>
    </section>

    <section slot="content" class="lotter-pcdd">
      <van-tabs v-model="playWayIndex" animated swipeable class="lottery-body no-tab theme-header-bg">
        <van-tab class="lottery-play" v-for="(play, i) in playList[0].items" :key="i">
          <lottery-code-selector :code.sync="targetCode" :ball.sync="targetBall" :play="play" :ball-list="ballList" type="pcdd"></lottery-code-selector>
        </van-tab>
      </van-tabs>

      <lottery-ball-results :result="result" :closed="closed" :opening="opening"></lottery-ball-results>
    </section>

    <div class="closed" slot="content-static" v-show="closed">
      <span class="info">已封盘</span>
    </div>

    <lottery-bet-input @clear="clear" slot="footer" :code.sync="targetCode" :ball.sync="targetBall" :tab-index="playWayIndex" :ball-list="ballList"
                       :series="series.toString()" :id="id.toString()" :way="playList[0]" :result="result"></lottery-bet-input>

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
      ballList: []
    }
  },
  watch: {
    targetCode () {
      // console.log(this.targetCode)
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .lotter-pcdd{
    /deep/.van-tabs{
      &:after{
        content:none;
        display:none;
      }
    }

  }
  .vux-tab-item{
    .item{
      display: inline-block;
      padding: 0 0.2rem;
      margin-right: 0.04rem;
      height: 0.64rem;
      line-height: 0.64rem;
      font-size: 0.32rem;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-radius: 0.32rem!important;
    }
  }
</style>
