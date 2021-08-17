<template>
  <section class="lottery-ball-results" :class="['lottery-ball-'+$route.params.series,'tabs-'+typesLength]" ref="ballResult" v-if='results'>
    <ul class="lottery-ball-nav theme-main-bg-5 theme-after-border-color-1 theme-before-border-color">
      <li class="lottery-ball-item f-l theme-color-active theme-after-border-color-1" :class="{'active theme-color-yellow-2':showBall,'theme-color-white':$config.blush}" @click="ballClick">
        {{results.list[ballIndex].title}}<i class="icon iconfont h5-icon-qushi-moreup" :class="{'fo':!showBall}"></i>
      </li>
      <li class="lottery-ball-item f-l theme-color-active" :class="{'active theme-color-yellow-2':!showBall,'theme-color-white':$config.blush}" @click="showBall = false">
        两面长龙
      </li>
    </ul>

    <div :class="['ball-box',{'black-ball-box':$config.blackTheme || $config.newQP,'blush-ball-box':$config.blush}]" v-if="showBall" >
      <van-tabs v-model="typeIndex" :line-height="2" swipeable  :swipe-threshold="5" :lazy-render="false" :duration="0.6">
        <van-tab v-for="(type, i) in results.list[ballIndex].list" :key="i" :title="type.title">
          <scroll-box class="ball-scroll" direction="horizontal" ref="scroll">
            <canvas class="ball-canvas" ref="canvas" :style="canvasStyle(dataList[ballIndex][typeIndex])"></canvas>
          </scroll-box>
        </van-tab>
      </van-tabs>
    </div>

    <div class="double-box" v-show="!showBall">
      <ul class="double-list">
        {{results.double}}
        <li class="double-item theme-border-color" v-for="(double, i) in results['double:']" :key="i">
          <span class="double-info" :class="{'theme-color-white':$config.blush}">{{double.info}}</span>
          <span class="double-info" :class="{'theme-color-white':$config.blush}">{{double.value}}</span>
          <span class="double-info theme-color">{{double.count}}</span>
        </li>
      </ul>
    </div>

    <van-popup v-model="showPicker" :style="positionStyle" position="bottom" get-container="body" >
      <van-picker :class="{'black-van-picker':$config.blackTheme || $config.newQP,'blush-van-picker':$config.blush}" show-toolbar v-model="showPicker" :columns="results.list" :confirm-button-text="'确定'" value-key="title" :item-height="40" @confirm="onBallChange" @cancel="showPicker=false"></van-picker>
    </van-popup>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'LotteryBallResults',
  props: {  
    result: {
      type: Object,
      required: true
    },
    closed: {
      type: Boolean,
      required: true
    },
    fill: {
      type: Boolean,
      default () {
        return this.$config.home == this.VAR.HOME.VNS
      }
    },
    opening: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      results: null,
      ballIndex: 0,
      typeIndex: 0,
      showBall: true,
      showPicker: false,
      dataList: [],
      rows: 8,
      size: 0.34,
      borderColor: 'hsl(0, 0%, 95%)',
      colors: { blue: '#5598FC', red: '#fb162b', green: '#4caf50' },
      typesLength:0
    }
  },
  computed: {
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
    pxSize () {
      return this.size * this.$store.state.main.windowWidth / 7.5
    },
    playWayIndex(){
      return this.$parent.$parent.playWayIndex
    },
    lotteryPath(){
      return this.$route.params.series
    }
  },
  watch: {
    playWayIndex(){
      this.showBall = true
      this.refreshCanvasAll()
    },
    ballIndex(){
      this.typesLength = this.results.list[this.ballIndex].list.length
      this.refreshCanvasAll()
    },
    typeIndex(){
      this.toEnd()
      this.refreshCanvasAll()
    },
    results:{
      handler:function(val,old){
         const dataList = []
          if (this.results && this.results.list && this.results.list.length) {
            this.results.list.forEach(ballData => {
              let num =  ballData.title.replace(/[^0-9]/ig,"")
              ballData.title = ballData.title.replace(/\d+/g,this.intToChinese(num))
              const ballDataList = []
              ballData.list.forEach(typeData => {
                const typeDataList = []
                let last = null
                typeData.list.forEach(item => {
                  if (last && last.val === item) {
                    last.count++
                  } else {
                    last = {
                      val: item,
                      count: 1
                    }
                    typeDataList.push(last)
                  }
                })
                typeDataList.reverse()
                let arr = []
                let arr2 = []
                for (let i = 0; i < typeDataList.length; i++) {
                  arr.push([])
                }
                typeDataList.forEach((col, index) => {
                  for (let i = 0; i < col.count; i++) {
                    arr[index].push(col.val)
                  }
                })

                arr.forEach(col => arr2.push(col.splice(0, this.rows)))

                arr.forEach((col, index) => {
                  if (col.length) {
                    let tag = this.rows - 1
                    for (let i = tag; i > 0; i--) {
                      if (!arr2[index][i]) {
                        tag = i
                        break
                      }
                    }
                    for (let i = 0; i < col.length; i++) {
                      if (!arr2[index + i + 1]) {
                        arr2[index + i + 1] = []
                      }
                      arr2[index + i + 1][tag] = col[i]
                    }
                  }
                })

                arr2.push([])
                arr2.push([])

                const count = Math.floor(7.5 / this.size)
                const len = arr2.length
                if (len < count) {
                  for (let i = 0; i < count - len; i++) {
                    arr2.push([])
                  }
                }
                ballDataList.push(arr2)
              })
              dataList.push(ballDataList)
            })
          }

          this.dataList = dataList

          this.refreshCanvasAll()
      },
      deep:true
    },
    opening () {
      if (!this.opening && this.results) this.refreshBallResults()
    },

  },
  created () {
    if(this.$route.params.series=='10008'){
      document.body.className = 'lottery-PK10'
    }
    if(this.$config.home === this.VAR.HOME.VNS){
      this.colors = { blue: '#00bdd4', red: '#F76665', green: '#4caf50' };
    }
    this.refreshBallResults()

   
  },
  mounted () {
    if (!window.visibilityChangeManagerTask) window.visibilityChangeManagerTask = {}
    window.visibilityChangeManagerTask['ball-' + this.$route.params.id] = window.visibilityChangeManager.on(status => {
      if (status) {
        //this.refreshTrend(true)
      }
    })
  },
  methods: {
    toEnd () {
      this.$nextTick(() => {
        if (this.$refs.scroll && this.$refs.scroll[this.typeIndex].scroll) {
          this.$refs.scroll[this.typeIndex].refresh()
          this.$refs.scroll[this.typeIndex].scroll.scrollTo(this.$refs.scroll[this.typeIndex].scroll.maxScrollX, 0, 0)
        }
      })
    },
    intToChinese ( str ) {
      str = str+'';
      var len = str.length-1;
      var idxs = ['','十','百','千','万','十','百','千','亿','十','百','千','万','十','百','千','亿'];
      var num  = ['零','一','二','三','四','五','六','七','八','九'];

      return str.replace(/([1-9]|0+)/g,function( $, $1, idx, full) {
        var pos = 0;
        if( $1[0] != '0' ){
          pos = len-idx;
          if( idx == 0 && $1[0] == 1 && idxs[len-idx] == '十'){
            return idxs[len-idx]; 
          }
          return num[$1[0]] + idxs[len-idx]; 
        } else {
          var left = len - idx;
          var right = len - idx + $1.length;
          if( Math.floor(right/4) - Math.floor(left/4) > 0 ){
            pos = left - left%4;
          }
          if( pos ){
            return idxs[pos] + num[$1[0]];
          } else if( idx + $1.length >= len ){
            return '';
          }else {
            return num[$1[0]]
          }
        }
      });
    },
   
    replaceReg(reg,str){ 
      let arr=new Array("零","一","二","三","四","五","六","七","八","九",'十'); 
      return str.replace(reg,function(m){return arr[m];}) 
    },
    canvasStyle (data) {
      if(!data || !data.length) return
      return {
        height: (this.pxSize * this.rows + this.$store.state.main.windowWidth / 7.5 * 0.04) + 'px',
        width:  (this.pxSize * data.length + this.$store.state.main.windowWidth / 7.5 * 0.04) + 'px'
      }
    },
    refreshCanvasAll () {
      this.$nextTick(() => {
        if (this.$refs.canvas && this.$refs.canvas.length) {
          this.$refs.canvas.forEach((canvas, index) => {
            this.refreshCanvas(canvas, this.dataList[this.ballIndex][index], index)
          })
        }
      })
    },
    refreshCanvas (canvas, data, index) {
      this.$nextTick(() => {
        if(!data || !data.length) return
        const width = this.pxSize * data.length + this.$store.state.main.windowWidth / 7.5 * 0.04
        const height = this.pxSize * this.rows + this.$store.state.main.windowWidth / 7.5 * 0.04
        const context = canvas.getContext('2d')

        if (window.devicePixelRatio) {
          canvas.height = height * window.devicePixelRatio
          canvas.width = width * window.devicePixelRatio
          context.scale(window.devicePixelRatio, window.devicePixelRatio)
        }

        context.clearRect(0, 0, width, height)
        context.strokeStyle = this.borderColor
        context.lineWidth = 1
  	    context.strokeStyle = this.$config.newQP ? '#373737' : '#EBEDF0'
        context.beginPath()

        context.moveTo(0, 1)
        context.lineTo(width, 1)
        for (let i = 0; i < this.rows; i++) {
          const y = (i + 1) * this.pxSize + 1
          context.moveTo(0, y)
          context.lineTo(width, y)
        }

        context.moveTo(1, 0)
        context.lineTo(1, height)
        for (let i = 0; i < data.length; i++) {
          const x = (i + 1) * this.pxSize + 1
          context.moveTo(x, 0)
          context.lineTo(x, height)
        }

        context.stroke()
        context.beginPath()

        let fontSize
        let size = this.pxSize / 2 - 2
        if (this.isAndroid) {
          context.font = '0.18rem Helvetica'
        } else {
          fontSize = parseInt(this.pxSize) - 8
          context.font = fontSize + 'px Helvetica'
        }

        context.textAlign = 'center'
        for (let x = 0; x < data.length; x++) {
          for (let y = 0; y < data[x].length; y++) {
            const val = data[x][y]
            if (val) {
              switch (val) {
                case '和':
                  context.strokeStyle = this.colors.green
                  context.fillStyle = this.colors.green
                  break
                case '大':
                case '龙':
                case '双':
                  context.strokeStyle = this.colors.red
                  context.fillStyle = this.colors.red
                  break
                default:
                  context.strokeStyle = this.colors.blue
                  context.fillStyle = this.colors.blue
                  break
              }

              const pX = ((x + 0.5) * this.pxSize) + 1
              const pY = ((y + 0.5) * this.pxSize) + 1

              context.arc(
                pX,
                pY,
                size,
                0,
                2 * Math.PI)

              if (this.fill) {
                context.fill()
                context.stroke()
                context.beginPath()

                context.fillStyle = '#ffffff'
              }

              if (this.isAndroid) {
                context.fillText(val, pX, pY + this.pxSize / 4 - 1)
              } else {
                context.fillText(val, pX, pY + fontSize / 2 - 1.7)
              }

              context.stroke()
              context.beginPath()
            }
          }
        }

        context.stroke()

        this.$nextTick(() => {
          if (this.$refs.scroll && this.$refs.scroll[index]) {
            const scroll = this.$refs.scroll[index].scroll
            scroll.scrollTo(scroll.maxScrollX, 0, 0)
          }
        })
      })
    },
    onBallChange (ball, index) {
      this.showPicker = false
      this.ballIndex = index
    },
    ballClick () {
      if (this.showBall){ 
        this.showPicker = true
      }
      else this.showBall = true
      this.refreshCanvasAll()
    },
    refreshBallResults (noToast) {
      this.$store.dispatch('lottery/getResults', {
        noToast,
        id: this.$route.params.id,
        callback: res => {
          res = res.data
          if (res['code'] === 200) {
            this.results = res.data[this.$route.query.code]
            this.typesLength = this.results.list[this.ballIndex].list.length
            if (this.results && this.results['double:']) {
              this.results['double:'] = this.results['double:'].map(double => {
                const str = JSON.stringify(double)
                return {
                  info: str.replace(/^{"([\S]+) - ([\S]{1,2})":([\d]+)}$/, '$1'),
                  value: str.replace(/^{"([\S]+) - ([\S]{1,2})":([\d]+)}$/, '$2'),
                  count: str.replace(/^{"([\S]+) - ([\S]{1,2})":([\d]+)}$/, '$3')
                }
              })
            }
          } else {
            this.results = null
            // this.toastText('获取路珠数据失败', window.TOAST_POSITION.TOP)
          }
        }
      })
    }
  },
  beforeDestroy () {
    if (window.visibilityChangeManagerTask && window.visibilityChangeManagerTask['ball-' + this.$route.params.id]) {
      window.visibilityChangeManager.off(window.visibilityChangeManagerTask['ball-' + this.$route.params.id])
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
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
  .ball-results-box{
      /deep/.van-tab{
        font-size: 0.32rem;
        padding: 0 0.22rem;
        width: auto;
        -webkit-box-flex: unset !important;
        -webkit-flex: unset !important;
        -ms-flex: unset !important;
        flex: unset !important;
        display: inline-block;
        white-space: nowrap;
        color: #555;
        font-weight: 700;
      }
    }
  .lottery-ball-10008{
    /deep/.van-tab{
        padding: 0 0.2rem;
    }
    /deep/.van-tabs__line{
      width:15%;
    }
  }
  .big-ball{
    /deep/.van-tabs{
      .van-tabs__line{
        width:30%!important;
      }
    }
  }
  .lottery-ball-results {
    width: 100%;

    .lottery-ball-nav {
      width: 100%;
      // border-top: 0.02rem solid hsla(0, 0%, 95%, 1);
      // border-bottom: 0.02rem solid #ebedf0;
      height: 0.76rem;
      position: relative;
      &:after{
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0;
        bottom: 0;
        left: 0;
        border-bottom: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        // width: 100%;
      }
      &:before{
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0;
        top: 0;
        left: 0;
        border-top: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }

      .lottery-ball-item {
        width: 50%;
        font-size: 0.32rem;
        font-weight: bold;
        height: 0.76rem;
        line-height: 0.76rem;
        color: #555;

        &:first-child {
          // border-right: 0.02rem solid hsla(0, 0%, 95%, 1);
          position: relative;
          &::after{
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            right: 0;
            bottom: 0;
            // left: 0;
            border-right: 0.02rem solid #ebedf0;
            -webkit-transform: scaleX(.5);
            transform: scaleX(.5);
            height: 0.76rem;
          }
        }

        .icon {
          margin: 0 0.04rem;
          display: inline-block;
          position: relative;
          top: -0.07rem;
          transform: rotateZ(180deg) scale(0.75);
          font-size: 0.20rem;
        }
        .fo{
          color: #b9b4ac;
        }
      }
    }

  

    .ball-box {
      width: 100%;
      &.black-ball-box {
        /deep/ .van-tabs{
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
      &.blush-ball-box {
        /deep/ .van-tabs{
          .van-tabs__nav {
            background: linear-gradient(180deg, #9D010F 0%, #72010B 100%) !important;
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
      /deep/ .van-tabs {
        padding-top: 0;
        &:after{
          content:none;
          display:none;
        }
      }

      /deep/ .van-tabs__wrap {
        height: 0.76rem;
        border-bottom: none;
      }
      /deep/.van-hairline--top-bottom{
        &:after{
          content:none;
          display:none;
        }
      }
      /deep/ .van-tab {
        font-weight: bold;
        color: #555;
        font-size: 0.3rem;
        line-height: 0.76rem;
        font-size: 0.3rem;
          // padding: 0 0.22rem;
          // width: auto;
          // -webkit-box-flex: unset !important;
          // -webkit-flex: unset !important;
          // -ms-flex: unset !important;
          // flex: unset !important;
          // display: inline-block;
          // white-space: nowrap;
          // color: #555;
          // font-weight: 700;
      }

      .ball-scroll {
        white-space: nowrap;
        margin: 0;
        padding: 0.02rem 0;
        box-sizing: border-box;

        .ball-canvas {
          display: table;
          white-space: nowrap;
          min-width: 100vw;
        }
      }
    }
    

    .double-box {
      width: 100%;

      .double-list {
        width: 100%;
        .double-item {
          width: 100%;
          display: flex;
          height: 0.6rem;
          justify-content: space-between;
          align-items: stretch;
          border-top: 0.02rem solid hsla(0, 0%, 95%, 1);
          &:first-child{
            border-top:none;
          }
          .double-info {
            flex: 1;
            text-align: center;
            font-size: 0.28rem;
            line-height: 0.6rem;
          }
        }
      }
    }
  }
</style>
