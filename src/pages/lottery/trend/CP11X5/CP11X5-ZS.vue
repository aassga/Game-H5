<template>
  <div>
    <scroll-selector :class="['scroll-selector',{'black-scroll-selector' :$config.blackTheme || $config.newQP,'blush-scroll-selector' :$config.blush} ]" v-model="index" :list="['第一球','第二球','第三球','第四球','第五球']"></scroll-selector>
    <van-tabs v-model="index" class="lottery-trend no-tab" animated swipeable- :lazy-render="false">
      <van-tab v-for="ballPanel in 5" :key="ballPanel">
        <div class="lottery-trend-body">
          <ul class="lottery-trend-issue">
            <li class="row title theme-main-bg-5 theme-border-color theme-color-white">
              <ul class="row-content">
                <li class="col col-issue nosolid-right">
                  <span class="col-content">期号</span>
                </li>
              </ul>
            </li>
            <li class="row theme-main-bg-5 theme-border-color theme-color-white" v-for="(item, i) in list" :key="i">
              <ul class="row-content">
                <li class="col col-issue nosolid-right">
                  <span class="col-content">{{item.issue}}</span>
                </li>
              </ul>
            </li>
          </ul>
          <scroll-box class="lottery-trend-content" direction="horizontal">
            <ul>
              <li class="row title theme-main-bg-5 theme-border-color theme-color-white" ref="title">
                <ul class="row-content">
                  <li class="col col-result theme-border-color">
                    <span class="col-content">开奖号码</span>
                  </li>
                  <li class="col col-lh theme-border-color">
                    <span class="col-content">龙虎</span>
                  </li>
                  <li class="col col-kd theme-border-color">
                    <span class="col-content">跨度</span>
                  </li>
                  <li class="col col-num theme-border-color" v-for="n in 11" :key="n">
                    <span class="col-content">{{n}}</span>
                  </li>
                </ul>
              </li>
              <li class="row theme-color-white theme-border-color" :class="i % 2 == 0? 'theme-header-bg' : 'theme-main-bg-5'" v-for="(item, i) in list" :key="i">
                <ul class="row-content">
                  <li class="col col-result theme-border-color">
                  <span class="col-content">
                    <i class="ball theme-bg" v-for="(num, i) in item.resultInfo.split(',')" :key="i">{{num}}</i>
                  </span>
                  </li>
                  <li class="col col-lh theme-border-color">
                  <span class="col-content">
                    <i class="ball" :class="{red:item['lh']==='龙',vnsRed:item['lh']==='龙' && $config.home == 'vns',blue:item['lh']==='虎',vnsBlue:item['lh']==='虎' && $config.home == 'vns',green:item['lh']==='和'}">
                       {{item['lh']}}
                    </i>
                  </span>
                  </li>
                  <li class="col col-kd theme-border-color">
                    <span class="col-content">{{item['kd']}}</span>
                  </li>
                  <li class="col col-num theme-border-color" v-for="n in 11" :key="n">
                  <span :ref="'ball-' + (ballPanel - 1) + '-' + i" class="col-content" v-if="n===item.resultNum[ballPanel - 1]">
                    <i class="ball line theme-bg"></i>
                  </span>
                  </li>
                </ul>
              </li>
            </ul>
            <canvas class="trend-canvas" ref="canvas"></canvas>
          </scroll-box>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script type="text/javascript">
import ScrollSelector from '@src/components/scroll-selector/ScrollSelector'

export default {
  name: 'CP11X5-ZS',
  components: {
    ScrollSelector
  },
  props: {
    dataList: {
      type: Array
    }
  },
  data () {
    return {
      index: 0
    }
  },
  computed: {
    list () {
      if (this.dataList && this.dataList.length) {
        return this.dataList.map(item => {
          item = JSON.copyObj(item)
          item.issue = item.issue.toString().substr(8)
          item.resultNum = item.resultInfo.toString().split(',').map(num => parseInt(num))
          return item
        })
      } else {
        return []
      }
    }
  },
  watch: {
    list () {
      this.drawLine()
    },
    index () {
      this.drawLine()
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    drawLine () {
      this.$nextTick(() => {
        this.$refs.canvas.forEach((canvas, i) => {
          const width = canvas.offsetWidth
          const height = canvas.offsetHeight
          const context = canvas.getContext('2d')

          if (window.devicePixelRatio) {
            canvas.height = height * window.devicePixelRatio
            canvas.width = width * window.devicePixelRatio
            context.scale(window.devicePixelRatio, window.devicePixelRatio)
          }

          context.clearRect(0, 0, width, height)
          context.strokeStyle = this.targetTheme.color
          context.fillStyle = '#ffffff'
          context.textBaseline = 'middle'
          context.textAlign = 'center'
          context.font = this.rem * 0.26 + 'px Arial'
          context.lineWidth = 1
          context.beginPath()

          const ps = this.list.map((item, index) => {
            const ball = this.$refs['ball-' + i + '-' + index][0]
            const parent = ball.parentNode
            const x = ball.offsetLeft + (ball.offsetWidth / 2)
            const y = parent.offsetTop + (parent.offsetHeight / 2)
            return { x, y }
          })

          ps.forEach((p, index) => {
            if (index === 0) context.moveTo(p.x, p.y)
            else context.lineTo(p.x, p.y)
          })

          context.stroke()

          ps.forEach((p, index) => {
            context.fillText(this.list[index].resultNum[i], p.x, p.y)
          })
        })
      })
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
.scroll-selector {
    background-color: #fff;
    &.black-scroll-selector {
      background-color: #000;
      /deep/.item {
        color: #fff;
        &.active {
          background-color: #F6CF32 !important;
          color: #000 !important;
        }
      }
    }
    &.blush-scroll-selector {
      background-color: #9D010F;
      /deep/.item {
        color: #fff;
        &.active {
          background-color: #F6CF32 !important;
          color: #000 !important;
        }
      }
    }
  }
  .lottery-trend {
    .nosolid{
      border-top:none;
    }
    .nosolid-right{
      border-right:none;
    }
    .col-issue {
      width: 0.9rem;
    }

    .col-result {
      width: 2.5rem;
    }

    .col-lh {
      width: 0.9rem;
    }

    .col-kd {
      width: 0.9rem;
    }

    .col-num {
      width: 0.58rem;
    }
  }
</style>
