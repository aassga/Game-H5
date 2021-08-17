<template>
  <section class="lottery-result-box" @click="showMoreModal=!showMoreModal">
    <div class="lottery-result theme-main-bg-5 theme-after-border-color-1">
      <div class="label min-112">
        <p class="issue theme-color-white" v-if="result['lastissue']&&opening">
          {{result['lastissue'].toString().length>9?(parseInt(result['lastissue'])+1).toString().substr(8):(parseInt(result['lastissue'])+1)}}期:
        </p>
        <p class="issue theme-color-white" v-else-if="result['lastissue']">
          {{result['lastissue'].toString().length>9?result['lastissue'].toString().substr(8):result['lastissue']}}期:
        </p>
        <p class="issue theme-color-white" v-else>{{defaultIssue}}期:</p>
      </div>
      <div class="content">
        <ul class="result-num-list" :class="{'num-r-1':['12','13','3630','10044','10045'].includes($route.params.id.toString())}">
          <li v-for="i in 10" :class="getNumClass(i, numArr[i-1], lastArr[i-1])" :key="i">
            {{(closed||!numArr.length) ? '?' : i}}
          </li>
          <li class="more-icon icon iconfont theme-color theme-color-yellow-2" :class="{active: showMoreModal}">
            <span class="h5-icon-qushi-moreup"></span>
          </li>
        </ul>
        <ul class="clear-fix result-num-list">
          <li v-for="(item, i) in (result&&result['lastluzhu']&&!closed&&!opening&&!open&&!moving ? result['lastluzhu'] : '？,？,？,？,？,？,？,？').split(',')"
              :key="item+i" class="res-item f-l theme-gradient-bg-2 theme-border-1px theme-color-yellow-2 cp-theme-border-1px">
            {{item}}
          </li>
        </ul>
      </div>
    </div>
    <div class="more-box">
      <div class="more-list" v-show="showMoreModal"></div>
      <div style="overflow: hidden">
        <transition :name="showMoreModal?'slide-down':'slide-up'">
          <div style="width: 100%" v-show="showMoreModal">
              <ul class="more-list">
                  <li class="row theme-main-bg-5 theme-border-color">
                    <span class="col col-issue theme-border-color theme-color-white">期号</span>
                    <span class="col col-result theme-border-color theme-color-white">开奖号码</span>
                    <span class="col col-info theme-border-color theme-color-white">冠亚</span>
                  </li>
                  <li class="row" v-for="(item,i) in results" :key="item.issue + '_' + i" :class="[{'xysc-row':$route.params.id.toString()==='3630'},i % 2 === 0 ? 'theme-header-bg' : 'theme-main-bg-5']">
                    <div class="xysc theme-header-bg theme-border-color" v-if="['3630','13','12'].includes($route.params.id.toString())">
                      <span class="col col-issue tack theme-border-color theme-color-white">开奖来源</span>
                      <span class="theme-border-color" :class="{'col col-result': true,'num-r-1':['12','13','3630','10044','10045'].includes($route.params.id.toString())}">
                        <span class="xysc-title theme-color-white">【{{item.historyLotteryName}}】</span>
                        <span class="xysc-title xt-title theme-color-white" v-if="results && item.historyOpenTime">
                          {{new Date(item.historyOpenTime*1000).getFullYear()+'年'+ (parseInt(new Date(item['historyOpenTime']*1000).getMonth())+1) + '月'+ new Date(item.historyOpenTime*1000).getDate()+'日'}}
                          </span>
                         <span v-else class="xysc-title theme-color-white">{{initRuslt.yeaer}}年{{ initRuslt.mouth }}月{{ initRuslt.day }}日</span>
                        <span class="xysc-title xt-data theme-color-white">{{item.historyIssue}}期</span>
                      </span>
                      <span class="col col-info"></span>
                    </div>
                    <span class="col col-issue theme-border-color theme-color-white">{{$route.params.id.toString()==='2'?item['issue']:item['issue'].toString().substr(8)}}</span>
                    <span class="theme-border-color" :class="{'col col-result': true,'num-r-1':['12','13','3630','10044','10045'].includes($route.params.id.toString())}">
                      <i v-for="(num, i) in item['resultInfo'].split(',').map(num => parseInt(num))"
                        :class="'num-item theme-color-white pk10-num-'+num" :key="num+'-'+i">
                        {{num}}
                      </i>
                    </span>
                    <span class="col col-info">
                      <i class="ball theme-color-white">{{item['gyh']}}</i>
                      <i :class="{ball:true,red:item['gydx']==='大', vnsRed:item['gydx']==='大' &&  $config.home == 'vns',blue:item['gydx']==='小',vnsBlue:item['gydx']==='小' && $config.home == 'vns',green:item['gydx']==='和'}">
                        {{item['gydx']}}
                      </i>
                      <i :class="{ball:true,red:item['gyds']==='双', vnsRed:item['gyds']==='双' &&  $config.home == 'vns', blue:item['gyds']==='单', vnsBlue:item['gyds']==='单' && $config.home == 'vns'}">
                        {{item['gyds']}}
                      </i>
                    </span>
                  </li>
                </ul>
                <div class="more-button-box">
                  <button class="more-button theme-main-bg-5 theme-border-color theme-color-white" @click="$router.push('/trend/' + $route.params.id + '/0')">
                    <i class="icon-trend icon iconfont h5-icon-H-qushi theme-color theme-color-yellow-2" style="transform: none"></i>
                    查看更多走势
                  </button>
                </div>
          </div>
        </transition>
      </div>
    </div>
    <div v-show="showMoreModal" style="z-index: -1; position: absolute; width: 100%; height: 100vh; background-color:rgba(0, 0, 0, 0.5)"></div>
  </section>
</template>

<script type="text/javascript">
import '@src/style/lottery/lottery.less'

export default {
  name: 'LotteryResult',
  props: {
    result: {
      type: Object,
      required: true
    },
    closed: {
      type: Boolean,
      required: true
    },
    opening: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      trendPageSize: [3630, 13 ,12],
      numArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      lastArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      activeArr: [],
      animationStatus: '',
      moving: false,
      open: false,
      showMoreModal: false,
      results: [],
      initRuslt:{
        name:'北京赛车',
        yeaer:'????',
        mouth:'??',
        day:'??',
        iussu:'??????'
      }
    }
  },
  computed: {
    defaultIssue () {
      switch (this.$route.params.id.toString()) {
        case '2':
          return '??????'

        case '3630':
        case '13':
        case '3':
          return '???'

        case '12':
        case '10044':
        case '10045':
          return '????'

        default:
          return '???'
      }
    }
  },
  watch: {
    result () {
      if (this.result) {
        if (!this.animationStatus) {
          this.$nextTick(() => {
            if (this.opening) {
              this.animationStatus = 'num-animation-active'
              if (this.closed) this.activeArr = []
              if (this.opening && !this.closed && !this.moving) this.animationTask()
            } else {
              this.animationStatus = 'num-animation'
              this.lastArr = this.numArr
              this.numArr = this.result['lastresultInfo'].split(',').map(num => parseInt(num))
            }
          })
        }
      }
    },
    closed () {
      if (this.closed) this.activeArr = []
      if (this.opening && !this.closed) {
        this.animationTask()
      }
    },
    opening () {
      if (!this.opening && this.results.length) this.refreshTrend()
    }
  },
  created () {
    this.refreshTrend()
  },
  mounted () {
    if (!window.visibilityChangeManagerTask) window.visibilityChangeManagerTask = {}
    window.visibilityChangeManagerTask[this.$route.params.id] = window.visibilityChangeManager.on(status => {
      if (status) this.refreshTrend(true)
    })
  },
  methods: {
    refreshTrend (noToast) {
      this.$store.dispatch('lottery/getTrend', {
        noToast,
        data: {
          lotteryId: this.$route.params.id,
          pageSize:  this.trendPageSize.includes(Number(this.$route.params.id)) ? 5: 10
        },
        callback: res => {
          this.loading = false
          res = res.data
          if (res['code'] === 200 && res.data.data && res.data.data.list && res.data.data.list.length) {
            res.data.data.list.forEach(item => {
              item['resultInfo'] = item['resultInfo'].split(',').map(num => parseInt(num)).join(',')

              item['zhz'] = item['resultInfo'].split(',').splice(0, 2).map(n => parseInt(n)).reduce((prev, v) => {
                return prev + v
              }, 0)

              if (item['zhz'] > 11) {
                item['zdx'] = '大'
              } else {
                item['zdx'] = '小'
              }

              if (item['zhz'] % 2 === 0) {
                item['zds'] = '双'
              } else {
                item['zds'] = '单'
              }
            })
            if (['3630','13'].includes(this.$route.params.id.toString())) {
              this.results = res.data.data.list.slice(0, 5)
            } else {
              let newarr=[]
              let list=res.data.data.list
              for(let i in list){
                if(i<5&&list[i].lotteryName=="kssc"){
                  newarr.push(list[i])
                }
              }
              //no 模式 快速赛车-查看更多走势窗口最多显示5条记录，实际遮了全屏,限制数组长度
              if(list[0].lotteryName=="kssc"){
                this.results = newarr
              }else{
                this.results = res.data.data.list
              }

            }
          } else {
            this.results = []
          }
        }
      })
    },
    getNumClass (i, now, old) {
      const arr = ['num-item']

      arr.push('num-animation-' + (this.numArr.indexOf(i) + 1))

      arr.push(this.animationStatus || 'num-animation')

      if (!this.closed) arr.push('pk10-num-' + i)
      else arr.push('pk10-num-none')

      if (this.open) arr.push('num-animation-open')

      if (this.activeArr.includes(i)) {
        arr.push('active-moving')
        if (now < old) arr.push('num-animation-left')
        if (now > old) arr.push('num-animation-right')
      }
      return arr
    },
    animationTask () {
      this.moving = true
      this.animationStatus = 'num-animation-active'
      const arr = JSON.copyObj(this.numArr)
      const count = Math.floor(Math.random() * 100) % 3
      if (count) {
        const oldIndex = (Math.floor(Math.random() * 100) % 5) + 5
        const newIndex = Math.floor(Math.random() * 100) % (oldIndex - 3)
        const num = arr.splice(oldIndex, 1)[0]
        arr.splice(newIndex, 0, num)
        this.lastArr = this.numArr
        this.numArr = arr
        this.activeArr = [num]
      } else {
        const oldIndex1 = (Math.floor(Math.random() * 100) % 4) + 6
        const oldIndex2 = Math.floor(Math.random() * 100) % 4
        const temp = Math.ceil((oldIndex1 - oldIndex2) / 2) - 1
        const newIndex1 = oldIndex1 - temp
        const newIndex2 = oldIndex2 + temp
        const num1 = arr.splice(oldIndex1, 1)[0]
        arr.splice(newIndex1, 0, num1)
        const num2 = arr.splice(oldIndex2, 1)[0]
        arr.splice(newIndex2, 0, num2)
        this.lastArr = this.numArr
        this.numArr = arr
        this.activeArr = [num1, num2]
      }

      if (this.opening) {
        setTimeout(this.animationTask.bind(this), 2000)
      } else {
        setTimeout(() => {
          this.moving = false
          this.animationOver()
        }, 2000)
      }
    },
    animationOver () {
      this.open = true
      this.animationStatus = 'num-animation'

      setTimeout(() => {
        this.open = false
      }, 400)

      setTimeout(() => {
        this.animationStatus = 'num-animation'
        this.activeArr = []
        this.lastArr = this.numArr
        this.numArr = this.result['lastresultInfo'].split(',').map(num => parseInt(num))
      }, 300)
    }
  },
  beforeDestroy () {
    if (window.visibilityChangeManagerTask && window.visibilityChangeManagerTask[this.$route.params.id]) {
      window.visibilityChangeManager.off(window.visibilityChangeManagerTask[this.$route.params.id])
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .lottery-result-box {
    .min-112{
      // min-width: 1.12rem;
      text-align: left;
    }
    .pk10-num-1 {
      background-color: #FAA000;
      border-color: #FAA000;
      color: #fff;
    }

    .pk10-num-2 {
      background-color: #0171D3;
      border-color: #0171D3;
      color: #fff;
    }

    .pk10-num-3 {
      background-color: #666669;
      border-color: #666669;
      color: #fff;
    }

    .pk10-num-4 {
      background-color: #FC7103;
      border-color: #FC7103;
      color: #fff;
    }

    .pk10-num-5 {
      background-color: #00A39F;
      border-color: #00A39F;
      color: #fff;
    }

    .pk10-num-6 {
      background-color: #5034F7;
      border-color: #5034F7;
      color: #fff;
    }

    .pk10-num-7 {
      background-color: #8B858F;
      border-color: #8B858F;
      color: #fff;
    }

    .pk10-num-8 {
      background-color: #DCB600;
      border-color: #DCB600;
      color: #fff;
    }

    .pk10-num-9 {
      background-color: #970101;
      border-color: #970101;
      color: #fff;
    }

    .pk10-num-10 {
      background-color: #05A102;
      border-color: #05A102;
      color: #fff;
    }

    .pk10-bet-num-r-0 {
      border-radius: 0;
    }

    .pk10-bet-num-r-1 {
      border-radius: 0.2rem;
    }

    .result-num-list {
      display: block;
    }

    .num-item {
      display: block;
      overflow: visible;
      width: 0.42rem;
      height: 0.42rem;
      line-height: 0.44rem;
      color: #FFFFFF;
      font-weight: 700;
      margin: 0.04rem 0.02rem 0.02rem 0.03rem;
      text-align: center;
      border-radius: 0;
    }

    .num-animation {
      float: none !important;
      position: absolute;
      top: 0.04rem;
      margin: 0 !important;
    }

    .num-animation-active {
      float: none !important;
      position: absolute;
      top: 0.04rem;
      margin: 0 !important;
      transition: left 2s cubic-bezier(0.5, 0, 0.5, 1);
    }

    .active-moving {
      z-index: 499 !important;
    }

    .num-item:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0);
      z-index: -1 !important;
      border-radius: 0.04rem;
      transform: scale(0);
    }

    .num-animation-open:before {
      background-color: #efefef;
      z-index: 420 !important;
      transform: scale(1.2);
      transition: all 400ms;
    }

    .num-animation-left {
    }

    .num-animation-right {
    }

    .num-animation-1 {
      left: 0.04rem * 1 + 0.42rem * 0;
    }

    .num-animation-2 {
      left: 0.04rem * 2 + 0.42rem * 1;
    }

    .num-animation-3 {
      left: 0.04rem * 3 + 0.42rem * 2;
    }

    .num-animation-4 {
      left: 0.04rem * 4 + 0.42rem * 3;
    }

    .num-animation-5 {
      left: 0.04rem * 5 + 0.42rem * 4;
    }

    .num-animation-6 {
      left: 0.04rem * 6 + 0.42rem * 5;
    }

    .num-animation-7 {
      left: 0.04rem * 7 + 0.42rem * 6;
    }

    .num-animation-8 {
      left: 0.04rem * 8 + 0.42rem * 7;
    }

    .num-animation-9 {
      left: 0.04rem * 9 + 0.42rem * 8;
    }

    .num-animation-10 {
      left: 0.04rem * 10 + 0.42rem * 9;
    }

    .more-icon {
      position: absolute;
      left: 0.04rem * 12 + 0.42rem * 10;
    }

    .num-r-1 {
      .num-item {
        border-radius: 0.1rem;
      }
    }

    .more-box {
      .xysc {
        background: #fff;
        border-bottom: 0.01rem solid #efefef;
        width: 100%;
        height: 0.56rem;
        .tack{
          font-size: 0.24rem !important;
          font-weight: 400 !important;
          font-family: PingFang SC !important;
        }
        .xysc-title {
          font-size: 0.24rem;
          color: #606060;
          font-weight: normal;

          &:last-of-type {
            margin-left: .06rem;
          }
        }
      }

      .row {
        height: auto;

        &.xysc-row {
          background: #f8f8f8;
        }
      }
      .row:nth-child(1){
         border-bottom: 0.01rem solid #efefef;
      }

      .col-issue {
        width: 14%;
      }

      .col-result {
        width: 64%;
      }

      .col-info {
        width: 22%;
      }

      .more-list .row .ball {
        display: inline-block;
        width: 0.46rem;
        height: 0.46rem;
        border-radius: 0.1rem;
        line-height: 0.46rem;
        font-size: 0.28rem;
        border: 1px solid hsla(0, 0%, 95%, 1);
        box-sizing: border-box;
        margin-right: 0.06rem;
        font-weight: bold;
        color: #606060;
        background-color: rgba(0, 0, 0, 0);

        &.blue {
            color: #5598FC;
          }
        &.vnsBlue{
          color: #00bdd4;
        }

        &.red {
          color: #FB162D;
        }
        &.vnsRed {
          color: #F76665;
        }

        &.green {
          color: #4CAF50;
        }
      }

      .more-list .row .num-item {
        display: inline-block;
        width: 0.4rem;
        height: 0.4rem;
        margin-right: 0.04rem;
        line-height: 0.4rem;
        color: #FFFFFF;
        font-weight: bold;
      }
    }
  }
</style>
