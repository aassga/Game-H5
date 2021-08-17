<template>
  <section class="lottery-result-box" @click="showMoreModal=!showMoreModal">
    <div class="lottery-result theme-main-bg-5 theme-after-border-color-1">
      <div class="label">
        <p class="issue theme-color-white" v-if="result['lastissue']&&openStatus">
          {{getIssue(true)}}期:
        </p>
        <p class="issue theme-color-white" v-else-if="result['lastissue']">
          {{getIssue()}}期:
        </p>
        <p class="issue theme-color-white" v-else>{{defaultIssue}}期:</p>
      </div>
      <div class="content">
        <ul class="clear-fix list">
          <li :class="getClass(num)" v-for="(num, i) in numArr" :key="num+'-'+i">
            {{(num!=='＋'&&num.toString().length===1&&num!=='?')?'0'+num:num}}
          </li>
          <li class="more-icon icon iconfont theme-color theme-color-yellow-2" :class="{active:showMoreModal}">
            <span class="h5-icon-qushi-moreup"></span>
          </li>
        </ul> 
        <ul class="clear-fix list">
          <li class="theme-color-white" :class="val==='＋'?'res-item num-add':'res-item'" :key="i"
              v-for="(val, i) in resArr(result&&result['lastluzhu']&&!closed&&!openStatus?result['lastluzhu']:'？,？,？,？,？,？,？')">
            {{val==='＋'?'':val}}
          </li>
          <!-- <li :class="val==='＋'?'res-item num-add':'res-item'" :key="i"
            v-for="(val, i) in resArr(result?result['lastluzhu']:'？,？,？,？,？,？,？')">
          {{val==='＋'?'':val}} -->
        <!-- </li> -->
        </ul>
      </div>
    </div>
    <div class="more-box">
      <div class="modal-box" v-show="showMoreModal"></div>
      <div style="overflow: hidden">
        <transition :name="showMoreModal?'slide-down':'slide-up'">
          <div v-show="showMoreModal">
            <ul class="more-list">
              <li class="row theme-main-bg-5">
                <span class="col col-issue theme-border-color theme-color-white">期号</span>
                <span class="col col-result theme-border-color theme-color-white">开奖号码</span>
                <span class="col col-info theme-border-color theme-color-white">色波</span>
                <span class="col col-info theme-border-color theme-color-white">大小</span>
                <span class="col col-info theme-border-color theme-color-white">单双</span>
              </li>
              <li :class="['row',i % 2 === 0 ? 'theme-header-bg' : 'theme-main-bg-5']" v-for="(item,i) in results" :key="item.issue + '_' + i">
                <span class="col col-issue theme-border-color theme-color-white">
                  {{ forMartIssu(item['issue'])}}
                </span>
                <span class="col col-result theme-border-color theme-color-white">
                  <i :class="getClass(num)" :key="num+'-'+i" v-for="(num, i) in resArr(item['resultInfo'])">
                    {{num!=='＋'&&num.toString().length===1?'0'+num:num}}
                  </i>
                </span>
                <span class="col col-info theme-border-color theme-color-white">{{item['sb']}}</span>
                <span class="col col-info theme-border-color theme-color-white">
                  <span :class="{
                    ball: true,
                    red: item['dx'] === '大',
                    vnsRed: item['dx'] === '大' && $config.home == 'vns',
                    blue: item['dx'] === '小',
                    vnsBlue: item['dx'] === '小' && $config.home == 'vns',
                    green: item['dx'] === '和'
                  }">{{item['dx']}}
                  </span>
                </span>
                <span class="col col-info theme-border-color theme-color-white">
                  <span  :class="{
                    ball: true,
                    red: item['ds'] === '双',
                    vnsRed: item['ds'] === '双' && $config.home == 'vns',
                    blue: item['ds'] === '单',
                    vnsBlue: item['ds'] === '单' && $config.home == 'vns',
                    }"
                  >{{item['ds']}}</span>
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
      showMoreModal: false,
      bose: {
        red: [1, 7, 13, 19, 23, 29, 35, 45, 2, 8, 12, 18, 24, 30, 34, 40, 46],
        blue: [3, 9, 15, 25, 31, 37, 41, 47, 4, 10, 14, 20, 26, 36, 42, 48],
        green: [5, 11, 17, 21, 27, 33, 39, 43, 6, 16, 22, 28, 32, 38, 44, 49]
      },
      numArr: ['?', '?', '?', '?', '?', '?', '＋', '?'],
      results: [],
      task: null,
      openStatus:true
    }
  },
  computed: {
    defaultIssue () {
      switch (this.$route.params.id.toString()) {
        case '4':
        case '17':
          return '???'

        case '16':
          return '????'

        default:
          return '???'
      }
    }
  },
  watch: {
    opening(now,old){
      this.openStatus = now;
    },
    openStatus(){
      this.checkOpen()
    },
    closed () {
      // if (this.closed) {
      //   this.numArr = ['?', '?', '?', '?', '?', '?', '＋', '?']
      // }
    },
    result (now, old) {
      if (now) {
        const issVal = parseInt(now.issue) - parseInt(now.lastissue)
        this.openStatus = !!((now.djs_next_kaipan && issVal === 1) || issVal === 2)
        if (!this.openStatus) {
          const numArr = now['lastresultInfo'].split(',')
          numArr.splice(6, 0, '＋')
          this.numArr = numArr
        }
        if (!old || now['lastresultInfo'] !== old['lastresultInfo']) {
          this.refreshTrend()
        }
      }
    },
  },
  created () {
    this.refreshTrend()
  },
  mounted () {
    if (!window.visibilityChangeManagerTask) window.visibilityChangeManagerTask = {}
    window.visibilityChangeManagerTask[this.$route.params.id] = window.visibilityChangeManager.on(status => {
      if (status) this.refreshTrend(true)
    })

    this.checkOpen()
  },
  methods: {
    getIssue (status) {
      if (status) {
        return this.result['lastissue'].toString().length > 9
          ? (parseInt(this.result['lastissue']) + 1).toString().substr(8)
          : this.result['lastissue'].toString().length > 5
            ? (parseInt(this.result['lastissue']) + 1).toString().substr(5)
            : (parseInt(this.result['lastissue']) + 1)
      } else {
        return this.result['lastissue'].toString().length > 9
          ? parseInt(this.result['lastissue']).toString().substr(8)
          : this.result['lastissue'].toString().length > 4
            ? parseInt(this.result['lastissue']).toString().substr(4)
            : parseInt(this.result['lastissue'])
      }
    },
    resArr (res) {
      const arr = res.split(',')
      arr.splice(6, 0, '＋')
      return arr
    },
    getClass (num) {
      return {
        'num-item': true,
        'ball': num !== '＋',
        'ball-red': this.bose.red.includes(parseInt(num)),
        'ball-green': this.bose.green.includes(parseInt(num)),
        'ball-blue': this.bose.blue.includes(parseInt(num)),
        'num-add theme-color': num === '＋',
        'theme-bg': num === '?'
      }
    },
    checkOpen () {
      if (this.openStatus) {
        const _arr = [
          '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
          '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
          '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
          '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
          '41', '42', '43', '44', '45', '46', '47', '48', '49'
        ]
        this.task = window.setInterval(() => {
          if (this.openStatus || this.closed) {
            const numArr = []
            const arr = JSON.parse(JSON.stringify(_arr))
            for (let i = 0; i < 7; i++) {
              numArr.push(arr.splice(Math.floor(Math.random() * 100) % (49 - i), 1)[0])
            }
            numArr.splice(6, 0, '＋')
            this.numArr = numArr
          }
        }, 250)
      } else {
        const numArr = this.result['lastresultInfo'].split(',')
        numArr.splice(6, 0, '＋')
        this.numArr = numArr
        this.refreshTrend()
        if (this.task) window.clearInterval(this.task)
      }
    },
    refreshTrend (noToast) {
      this.$store.dispatch('lottery/getTrend', {
        noToast,
        data: {
          lotteryId: this.$route.params.id,
          pageSize: 10
        },
        callback: res => {
          this.loading = false
          res = res.data
          if (res['code'] === 200 && res.data.data && res.data.data.list && res.data.data.list.length) {
            res.data.data.list.forEach(item => {
              item['zhz'] = item['resultInfo']
                .split(',')
                .map(n => parseInt(n))
                .reduce((prev, v) => {
                  return prev + v
                }, 0)

              if (item['zhz'] > 30) {
                item['zdx'] = '大'
              } else if (item['zhz'] < 30) {
                item['zdx'] = '小'
              } else {
                item['zdx'] = '和'
              }

              if (item['zhz'] % 2) {
                item['zds'] = '双'
              } else {
                item['zds'] = '单'
              }
            })
            this.results = res.data.data.list
          } else {
            this.results = []
          }
        }
      })
    }
  },
  beforeDestroy () {
    if (window.visibilityChangeManagerTask && window.visibilityChangeManagerTask[this.$route.params.id]) {
      window.visibilityChangeManager.off(window.visibilityChangeManagerTask[this.$route.params.id])
    }
    if (this.task) {
      window.clearInterval(this.task)
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .lottery-result-box {

    .res-item {
      margin: 0.02rem 0.05rem !important;

      &.num-add {
        margin: 0 0.05rem;
        border: none !important;
      }
    }

    .ball-red {
      background-color: #f36055;
    }

    .ball-blue {
      background-color: #20a2d8;
    }

    .ball-green {
      background-color: #49bb27;
    }

    .res-item {
      margin: 0.02rem 0.05rem !important;

      &.num-add {
        margin: 0 0.05rem;
        border: none !important;
      }
    }

    .num-add {
      display: block;
      float: left;
      width: 0.46rem;
      height: 0.46rem;
      line-height: 0.46rem;
      color: #f36055;
      font-weight: 700;
      font-size: 0.28rem;
      background-color: rgba(0, 0, 0, 0) !important;
      text-align: center;
      transform: scale(1.4);
    }

    .last-issue {
      line-height: 0.46rem;
      display: inline-block;
      width: 1.7rem;
      font-size: 0.3rem;
    }

    .result-label {
      color: #5e5e5e;
      width: 1.7rem;
      display: inline-block;
    }

    .list {
      list-style: none;
      display: flex;
      flex-wrap: nowrap;
      justify-content: start;
      align-items: center;

      .num-item {
        display: block;
        border-radius: 50%;
        margin: 0 0.05rem;
        overflow: hidden;
        width: 0.46rem;
        height: 0.46rem;
        line-height: 0.46rem;
        font-weight: 700;
      }

      .icon {
        display: block;
        //border-radius: 50%;
        margin: 0 0.05rem;
        overflow: hidden;
        width: 0.52rem;
        height: 0.52rem;
        line-height: 0.52rem;
        font-weight: 700;
        font-size: 0.2rem;
        text-align: center;
        transition: all 300ms;
        transform: rotateZ(180deg);
        transform-origin: center 54%;

        &.active {
          transform: rotateZ(0);
        }
      }
    }

    .more-box {

      .more-list {
        .row {
          display: block;
          width: 100%;
          height: 0.56rem;

          &:after {
            content: "";
            display: table;
            clear: both;
            zoom: 1;
          }

          .col-issue {
            width: 12%;
          }

          .col-result {
            width: 52%;
          }

          .col-info {
            width: 12%;
          }

          .ball {
            display: block;
            width: 0.4rem;
            height: 0.4rem;
            border-radius: 50%;
            line-height: 0.4rem;
            font-size: 0.26rem;
            color: #FFFFFF;
            float: unset !important;
            overflow: hidden;
            text-align: center;
            box-sizing: border-box;
            font-weight: bold;
          }

          .num-item {
            margin: 0.02rem;
          }

          .num-add {
            margin: 0;
          }

          .blue {
            background-color: #5598FC;
          }
          .vnsBlue{
            background-color: #00bdd4;
          }

          .red {
            background-color: #FB162D;
          }
          .vnsRed {
            background-color: #F76665;
          }

          .green {
            background-color: #4CAF50;
          }
        }
      }
    }
  }
</style>
