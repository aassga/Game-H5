<template>
  <div>
    <scroll-selector :class="['scroll-selector',{'black-scroll-selector' :$config.blackTheme || $config.newQP,'blush-scroll-selector' :$config.blush} ]" v-model="index" :list="['冠军','亚军','第三','第四','第五','第六','第七','第八','第九','第十']" v-if="dataList&&list"></scroll-selector>
    <van-tabs v-model="index" class="lottery-trend no-tab" animated swipeable- :lazy-render="false" v-if="dataList&&list">
      <van-tab v-for="ballPanel in 10" :key="ballPanel">
        <div class="lottery-trend-body" v-if="dataList&&list">
          <ul>
            <li class="row title theme-border-color">
              <ul class="row-content theme-main-bg-5 theme-color-white">
                <li class="col col-issue theme-border-color">
                  <span class="col-content theme-border-color">期号</span>
                </li>
                <li class="col col-num theme-border-color" v-for="n in 10" :key="n">
                  <span class="col-content">{{n}}</span>
                </li>
              </ul>
            </li>
            <li :class="['row',i % 2 === 0 ? 'theme-header-bg' : 'theme-main-bg-5']" v-for="(item, i) in list" :key="i">
              <ul class="row-content">
                <li class="col col-issue theme-border-color theme-color-white">
                  <span class="col-content">{{item.issue}}</span>
                </li>
                <li class="col col-num theme-border-color" v-for="n in 10" :key="n">
                  <span class="col-content">
                    <i class="ball line theme-bg" :ref="'ball-' + (ballPanel - 1) + '-' + i" v-if="n === item.resultInfo[ballPanel-1]"></i>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
          <canvas class="trend-canvas" ref="canvas"></canvas>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script type="text/javascript">
import ScrollSelector from '@src/components/scroll-selector/ScrollSelector'
import { setTimeout } from 'timers';

export default {
  name: 'PK10-ZS',
  components: {
    ScrollSelector
  },
  props: {
    dataList: {
      type: Array
    }
  },
  computed: {
    list () {
      return this.dataList.map(item => {
        item = JSON.copyObj(item)
        item.issue = this.$route.params.id.toString() === '2' ? item.issue : item.issue.toString().substr(8)
        item.resultInfo = item.resultInfo.toString().split(',').map(num => parseInt(num))
        return item
      })
    }
  },
  data () {
    return {
      index: 0,
      dataCount:0,
      canvas:null,
      ballNumber:0,
    }
  },
  watch: {
    list () {
      if(this.list.length>0){
        this.dataCount = this.list.length
        this.canvas = this.$refs['canvas']
        this.drawLine()
      }
    },
    index () {
      this.ballNumber = this.index
      this.drawLine()
    },
    dataList:{
      handler(newVal,oldVal){
        this.dataCount = this.list.length
        this.canvas = this.$refs['canvas']
        this.drawLine()
      },
      deep:true
    }
  },
  mounted () {
    if(this.dataList){
        this.dataCount = this.dataList.length
        this.canvas = this.$refs['canvas']
        this.drawLine()
    }
  },
  methods: {
    deepClone(obj){
        const isObject = args => (typeof args === 'object' || typeof args === 'function') && typeof args !== null
        if (!isObject) throw new Error('Not Reference Types')
        let newObj = Array.isArray(obj) ? [...obj] : { ...obj }
        Reflect.ownKeys(newObj).map(key => {
            newObj[key] = isObject(obj[key]) ? this.deepClone(obj[key]) : obj[key]
        })
        return newObj
    },
    drawLine () {
      this.$nextTick(() => {
        if (this.canvas && this.canvas[this.ballNumber]) {
          const canvas = this.canvas[this.ballNumber]
          let ps = []
          let ball
          for (let i = 0; i < this.dataCount; i++) {
          const ball = this.$refs['ball-' + this.ballNumber + '-' + i][0]
            ps.push({
              x: ball.offsetLeft + (ball.offsetWidth / 2),
              y: ball.offsetTop + (ball.offsetHeight / 2)
            })
          }
          const context = canvas.getContext('2d')
          const width = canvas.width = canvas.offsetWidth
          const height = canvas.height = canvas.offsetHeight
          if (window.devicePixelRatio) {
            canvas.height = height * window.devicePixelRatio
            canvas.width = width * window.devicePixelRatio
            context.scale(window.devicePixelRatio, window.devicePixelRatio)
          }
          context.clearRect(0, 0, context.width, context.height)
          context.strokeStyle = this.targetTheme.color
          context.fillStyle = '#ffffff'
          context.textBaseline = 'middle'
          context.font = this.rem * 0.26 + 'px Arial'
          context.textAlign = 'center'
          context.lineWidth = 1
          context.beginPath()
          ps.forEach((p, i) => {
            if (i) {
              context.lineTo(p.x, p.y)
            } else {
              context.moveTo(p.x, p.y)
            }
          })
          context.stroke()
          ps.forEach((p, index) => {
            context.fillText(this.list[index].resultInfo[this.ballNumber], p.x, p.y)
          })
        }
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
    .col-issue {
      width: 1.1rem;
    }

    .col-num {
      width: 0.64rem;
    }
   
  }
</style>
