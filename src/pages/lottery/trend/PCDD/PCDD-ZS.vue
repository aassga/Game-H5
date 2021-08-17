<template>
  <div class="lottery-trend">
    <div class="lottery-trend-body">
      <ul class="lottery-trend-issue">
        <li class="row title nosolid">
          <ul class="row-content theme-main-bg-5 theme-border-color theme-color-white">
            <li class="col col-issue theme-border-color">
              <span class="col-content">期号</span>
            </li>
          </ul>
        </li>
        <li class="row theme-border-color theme-color-white" :class="i % 2 == 0? 'theme-header-bg' : 'theme-main-bg-5'" v-for="(item, i) in list" :key="i">
          <ul class="row-content">
            <li class="col col-issue theme-border-color">
              <span class="col-content">{{item.issue}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <scroll-box class="lottery-trend-content" direction="horizontal">
        <ul>
          <li class="row title nosolid theme-border-color" ref="title">
            <ul class="row-content theme-main-bg-5 theme-border-color theme-color-white">
              <li class="col col-result theme-border-color">
                <span class="col-content">开奖号码</span>
              </li>
              <li class="col col-num theme-border-color" v-for="n in 28" :key="n">
                <span class="col-content">{{n-1}}</span>
              </li>
            </ul>
          </li>
          <li class="row theme-border-color" :class="i % 2 == 0? 'theme-header-bg' : 'theme-main-bg-5'" v-for="(item, i) in list" :key="i">
            <ul class="row-content">
              <li class="col col-result theme-border-color">
                <span class="col-content">
                  <i class="ball theme-bg" v-for="(num, i) in item.resultInfo.split(',')" :key="i">{{num}}</i>
                </span>
              </li>
              <li class="col col-num theme-border-color" v-for="n in 28" :key="n">
                <span :ref="'ball-' + i" class="col-content" v-if="(n-1)===item['hz']">
                  <i class="ball line theme-bg"></i>
                </span>
              </li>
            </ul>
          </li>
        </ul>
        <canvas class="trend-canvas" ref="canvas"></canvas>
      </scroll-box>
    </div>
  </div>
</template>

<script type="text/javascript">

export default {
  name: 'PCDD-ZS',
  props: {
    dataList: {
      type: Array
    }
  },
  computed: {
    list () {
      return this.dataList.map(item => {
        item = JSON.copyObj(item)
        return item
      })
    }
  },
  watch: {
    list () {
      this.drawLine()
    },
    dataList:{
      handler(newVal,oldVal){
        this.drawLine()
      },
      deep:true
    }
  },
  mounted () {
    if(this.dataList){
       this.drawLine()
    }
  },
  methods: {
    drawLine () {
      this.$nextTick(() => {
        const canvas = this.$refs.canvas
        const width = canvas.offsetWidth
        const height = canvas.offsetHeight
        const context = canvas.getContext('2d')
        if (window.devicePixelRatio) {
          if(window.devicePixelRatio>=3){
            canvas.height = height*(window.devicePixelRatio-1)
            canvas.width =width*(window.devicePixelRatio-1)
            context.scale(window.devicePixelRatio-1, window.devicePixelRatio-1)
          }else{
            canvas.height = height * window.devicePixelRatio
            canvas.width = width * window.devicePixelRatio
            context.scale(window.devicePixelRatio, window.devicePixelRatio)
          }
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
          const ball = this.$refs['ball-' + index][0]
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
          context.fillText(this.list[index]['hz'], p.x, p.y)
        })
      })
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .lottery-trend {
    .nosolid{
      border-top:none;
    }
    .col-issue {
      width: 1.3rem;
    }

    .col-result {
      width: 2rem;
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

    .lottery-trend-body {
      width: 100%;

      &:after {
        content: ' ';
        display: table;
        clear: both;
      }

      .lottery-trend-issue {
        float: left;
        width: 1.3rem;
      }

      .lottery-trend-content {
        float: left;
        width: 6.2rem;
        position: relative;
      }
    }
  }
</style>
