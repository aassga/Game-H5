<template>
  <view-page ref="view-page" full-box :position-style="positionStyle">
    <lottery-header slot="header"></lottery-header>

    <section slot="header-static">
      <div class="lottery-header-inline">
        <lottery-result :result="result" :closed.sync="closed" :opening.sync="opening"></lottery-result>
        <lottery-timer :result="result" :closed.sync="closed" :opening.sync="opening"></lottery-timer>
      </div>
      <lottery-play-way-nav v-model="playWayIndex" :play-list="playList"></lottery-play-way-nav>
    </section>

    <section slot="content">
      <van-tabs v-model="playWayIndex" animated swipeable class="lottery-body no-tab theme-header-bg">
        <van-tab class="lottery-play" v-for="(play, i) in newPlayList" :key="i">
          <lottery-code-selector :code.sync="targetCode" :ball.sync="targetBall" :play="play" :ball-list="ballList"
                                 :val-key="i===1?'ball':'name'"></lottery-code-selector>
        </van-tab>
      </van-tabs>

      <lottery-ball-results :result="result" :closed="closed" :opening="opening"></lottery-ball-results>
    </section>

    <div class="closed" slot="content-static" v-show="closed">
      <span class="info">已封盘</span>
    </div>

    <lottery-bet-input @clear="clear" slot="footer" :code.sync="targetCode" :ball.sync="targetBall" :ball-list="ballList"
                       :series="series.toString()" :id="id.toString()" :way="newPlayList[playWayIndex]" :result="result"></lottery-bet-input>

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
  name: 'LotteryDpc',
  components: {
    LotteryCodeSelector,
    LotteryResult,
    LotteryTimer
  },
  mixins: [lotteryMixin],
  computed:{
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
      
    }
  },
  data () {
    return {
      ballList: ['第一球', '第二球', '第三球'],
      newPlayList: []
    }
  },
  watch: {
    playList () {
      const newPlayList = JSON.copyObj(this.playList)

      newPlayList.forEach(big => {
        switch (big.big) {
          case '主盘势':
            big.items.forEach(small => {
              switch (small['small']) {
                case '大':
                case '小':
                  small.code[0]['ball'] = '佰'
                  small.code[1]['ball'] = '拾'
                  small.code[2]['ball'] = '个'
                  small.code[3]['ball'] = '佰拾和尾数'
                  small.code[4]['ball'] = '佰个和尾数'
                  small.code[5]['ball'] = '拾个和尾数'
                  small.code[6]['ball'] = '佰拾个和数'
                  small.code[7]['ball'] = '佰拾个和尾数'
                  break
                case '单':
                case '双':
                  small.code[0]['ball'] = '佰'
                  small.code[1]['ball'] = '拾'
                  small.code[2]['ball'] = '个'
                  small.code[3]['ball'] = '佰拾'
                  small.code[4]['ball'] = '佰个'
                  small.code[5]['ball'] = '拾个'
                  small.code[6]['ball'] = '佰拾个'
                  break
                case '质':
                case '合':
                  small.code[0]['ball'] = '佰'
                  small.code[1]['ball'] = '拾'
                  small.code[2]['ball'] = '个'
                  small.code[3]['ball'] = '佰拾和尾数'
                  small.code[4]['ball'] = '佰个和尾数'
                  small.code[5]['ball'] = '拾个和尾数'
                  small.code[6]['ball'] = '佰拾个和尾数'
                  break
              }
            })
            break

          case '三字组合':
            const SZZH = big['items'][0]['code']
            const XXX = SZZH.find(item => item['code'] === 'XXX')
            const XXO = SZZH.find(item => item['code'] === 'XXO')
            const XOY = SZZH.find(item => item['code'] === 'XOY')
            const Codes = []
            for (let code, item, codeArr, i = 0; i < 1000; i++) {
              code = i < 10 ? '00' + i : i < 100 ? '0' + i : i.toString()
              codeArr = [
                code[0] + code[1] + code[2],
                code[0] + code[2] + code[1],
                code[1] + code[0] + code[2],
                code[1] + code[2] + code[0],
                code[2] + code[1] + code[0],
                code[2] + code[0] + code[1]
              ]
              if (!Codes.find(c => codeArr.includes(c['code']))) {
                if (code[0] === code[1] && code[0] === code[2]) {
                  item = JSON.copyObj(XXX)
                  item['name'] = item['code'] = code
                } else if (code[0] === code[1] || code[0] === code[2] || code[1] === code[2]) {
                  item = JSON.copyObj(XXO)
                  item['name'] = item['code'] = code
                } else {
                  item = JSON.copyObj(XOY)
                  item['name'] = item['code'] = code
                }
                Codes.push(item)
              }
            }

            big['items'][0]['code'] = Codes
            break

          case '二字定位':
            big.items.forEach(small => {
              switch (small['small']) {
                case '佰拾定位':
                  small.code.forEach((code, i) => {
                    code.ball = i < 10 ? '佰' : '拾'
                  })
                  break
                case '佰个定位':
                  small.code.forEach((code, i) => {
                    code.ball = i < 10 ? '佰' : '个'
                  })
                  break
                case '拾个定位':
                  small.code.forEach((code, i) => {
                    code.ball = i < 10 ? '拾' : '个'
                  })
                  break
              }
            })
            break

          case '三字定位':
            big.items[0].code.forEach((code, i) => {
              code.ball = i < 10 ? '佰' : i < 20 ? '拾' : '个'
            })

            const codes = big.items[0].code

            const items = []
            items.push({
              small: '佰',
              code: codes.splice(0, 10)
            })

            items.push({
              small: '拾',
              code: codes.splice(0, 10)
            })

            items.push({
              small: '个',
              code: codes.splice(0, 10)
            })

            big.items = items

            break
        }
      })

      this.newPlayList = newPlayList
    }
  }
}
</script>
