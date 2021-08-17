<template>
  <section class="lottery-result-box" @click="showMoreModal=!showMoreModal">
    <div class="lottery-result theme-main-bg-5 theme-after-border-color-1">
      <div class="label">
        <p class="issue theme-color-white" v-if="result['lastissue']&&opening">
          {{ result['lastissue'].toString().length>9? (parseInt(result['lastissue']).toString().substr(8)> 41 ? parseInt(result['lastissue']).toString().substr(8) : (parseInt(result['lastissue'])+1).toString().substr(8)):(parseInt(result['lastissue'])+1)}}期:
        </p>
        <p class="issue theme-color-white" v-else-if="result['lastissue']">
          {{result['lastissue'].toString().length>9?result['lastissue'].toString().substr(8):result['lastissue']}}期:
        </p>
        <p class="issue theme-color-white" v-else>{{defaultIssue}}期:</p>
      </div>
      <div class="content">
        <ul class="result-num-list" v-if="!opening">
          <li class="num-item theme-bg  theme-yellow-bg-4 theme-color-black" v-for="(num, i) in result['lastresultInfo'].split(',')" :key="i">
            {{num}}
          </li>
          <li class="more-icon icon iconfont theme-color theme-color-yellow-2" :class="{active: showMoreModal}">
            <span class="h5-icon-qushi-moreup"></span>
          </li>
        </ul>
        <ul class="result-num-list" v-else>
          <li class="num-item theme-bg  theme-yellow-bg-4 theme-color-black" v-for="(num, i) in numArr" :key="i">
            {{(closed) ? '?' : num}}
          </li>
          <li class="more-icon icon iconfont theme-color theme-color-yellow-2" :class="{active: showMoreModal}">
            <span class="h5-icon-qushi-moreup"></span>
          </li>
        </ul>
        <ul class="clear-fix result-num-list">
          <li v-for="(item, i) in (result&&result['lastluzhu']? result['lastluzhu'] : '？,？,？,？,？').split(',')"
              :key="item+i" class="res-item f-l theme-gradient-bg-2 theme-border-1px theme-color-yellow-2">
            {{item}}
          </li>
        </ul>
      </div>
    </div>
    <div class='more-box'>
      <div class="modal-box" v-show="showMoreModal"></div>
      <div style="overflow: hidden">
        <transition :name="showMoreModal?'slide-down':'slide-up'">
          <div v-show="showMoreModal">
            <ul class="more-list">
              <li class="row theme-main-bg-5">
                <span class="col col-issue theme-border-color theme-color-white">期号</span>
                <span class="col col-result theme-border-color theme-color-white">开奖号码</span>
                <span class="col col-info theme-border-color theme-color-white">和值</span>
                <span class="col col-info theme-border-color theme-color-white">大小</span>
                <span class="col col-info theme-border-color theme-color-white">单双</span>
              </li>
              <li :class="['row',i % 2 === 0 ? 'theme-header-bg' : 'theme-main-bg-5']" v-for="(item,i) in results" :key="item.issue + '_' + i">
                <span class="col col-issue theme-border-color theme-color-white" v-if="$route.meta.code!=='ksssc'">{{item['issue'].toString().substr(-3)}}</span>
                <span class="col col-issue theme-border-color theme-color-white" v-else>{{item['issue'].toString().substr(-4)}}</span>
                <span class="col col-result theme-border-color">
                  <i class="ball num theme-bg" v-for="(num, i) in item['resultInfo'].split(',')" :key="i">{{num}}</i>
                </span>
                <span class="col col-info theme-border-color theme-color-white">{{item['hz']}}</span>
                <span class="col col-info theme-border-color">
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
                <span class="col col-info theme-border-color">
                  <span :class="{
                    ball: true,
                    red: item['ds'] === '双',
                    vnsRed: item['ds'] === '双' && $config.home == 'vns',
                    blue: item['ds'] === '单',
                    vnsBlue: item['ds'] === '单' && $config.home == 'vns'
                    }">{{item['ds']}}
                  </span>
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
      results: [],
      numArr: [],
      task: null
    }
  },
  computed: {
    defaultIssue () {
      switch (this.$route.params.id.toString()) {
        case '5':
          return '???'

        default:
          return '???'
      }
    }
  },
  watch: {
    opening: 'checkOpen'
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
    checkOpen () {
      if (this.opening) {
        this.task = setInterval(() => {
          const arr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
          this.numArr = [
            arr[Math.floor(Math.random() * 100) % 20],
            arr[Math.floor(Math.random() * 100) % 20],
            arr[Math.floor(Math.random() * 100) % 20],
            arr[Math.floor(Math.random() * 100) % 20],
            arr[Math.floor(Math.random() * 100) % 20],
            arr[Math.floor(Math.random() * 100) % 20],
            arr[Math.floor(Math.random() * 100) % 20],
            arr[Math.floor(Math.random() * 100) % 20]
          ]
        }, 250)
      } else {
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
    .more-box {

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
        display: inline-block;
        width: 0.42rem;
        height: 0.42rem;
        border-radius: 0.21rem;
        line-height: 0.42rem;
        font-size: 0.28rem;
        font-weight: bold;
        color: #FFFFFF;

        &.num {
          margin-right: 0.04rem;
        }
      }
    }
  }
</style>
