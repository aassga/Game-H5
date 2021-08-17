import LotteryHeader from '../component/lottery-header/LotteryHeader'
import LotteryPlayWayNav from '../component/lottery-play-way-nav/LotteryPlayWayNav'
import LotteryBallResults from '../component/lottery-ball-results/LotteryBallResults'
import LotteryBetInput from '../component/lottery-bet-input/LotteryBetInput'
import RedLope from '../component/red-lope/RedLope'

import '@src/style/lottery/lottery.less'

export default {
  components: {
    LotteryHeader,
    LotteryPlayWayNav,
    LotteryBallResults,
    LotteryBetInput,
    RedLope
  },
  props: {
    series: {
      type: [Number, String],
      required: true
    },
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      result: {},
      playList: [],
      playWayIndex: 0,
      opening: true,
      closed: false,
      targetCode: [],
      targetBall: [],
      errTask: null,
      firstLoad:true ,
      digits: '',
      winnerList:[],
      winnerTime: null,
      currIndex: 0,
    }
  },
  watch: {
    '$store.state.main.lotteryZJ':{
      handler(val){
        if(val.lotteryId == this.$route.params.id){
            this.winnerList.splice(Number(this.currIndex)+1,0,val)
        }
      }
    },
    '$store.state.lottery.playWayStatus': {
      handler (val) {
        if (val && val[this.id.toString()]) {
          this.getPlayWay()
          val[this.id.toString()] = undefined
        }
      }
    },
    closed (now, old) {
      if (now !== old && now==true) {
        this.refreshResult()
        this.clear()
      }
      if (!now) this.opening = true
    },
    playWayIndex () {
      this.$refs['view-page'].scroll.scrollTo(0, 0, 0)
      this.$refs['view-page'].scrollToTop()
      this.clear()
    }
  },
  mounted() {
    // 一个小时重置数据
    // if(this.winnerTime){
    //   clearInterval(this.winnerTime)
    // }
    // this.winnerTime = setInterval(() => {
    //   this.winnerList = []
    //   this.getWinerList()
    // }, 1000*60*24);
  },
  computed:{
    positionStyle(){
      //解决安卓小米position：fixed问题导致按钮错位问题
      if(this.$mobileDevice.isAndroid 
        && this.$mobileDevice.browserName === 'MIUI Browser'){
        return 'position:absolute;'
      }else{
        return 'position:fixed;'
      }
      
    }
  },
  created () {
    if(this.$route.params.series == 99996){
      return false
    }
    // 获取奖池数据
    this.getPoorList()
    // socket 获取奖池数据
    this.$stomp.on('user.lotteryJackpot', res=>{
      try {
        if(res.data.lotteryId ==  this.$route.params.id){
          let newDig = res.data.prizePool;
          this.digits = (Array(8).join('0') +  Math.floor(newDig)).slice(-8);
        }
      } catch (error) {
       console.log('route') 
      }
    })
    this.getWinerList()
    // 获取中奖数据
    this.$stomp.on('user.prizePoolList', res=>{
      try {
        let style=''
        if(this.$route.params.series == 10011){
          style ='color: #E9CB53;font-weight:400'
        }else{
          style= 'color: #FE1300;font-weight:400'
        }
        let socketPoolList = res.data.map(ff=>{
          ff['text'] = `<span>
                      ${ff.mode
                        .replace('%%','<span class="user">'+ff.userName+'</span>')
                        .replace('%%','<span class="lottery_name">【'+ff.lotteryName+'】</span>')
                        .replace('%%', '<span class="money" style="'+style+'">'+ff.amount+'</span>')
                      }
                    </span>`
            return ff
          })
          let socketPoolList2 = socketPoolList.filter(ff=> ff.lotteryId == this.$route.params.id)
          this.winnerList = this.winnerList.concat(socketPoolList2)
      } catch (error) {
       console.log('route') 
      }
    })

    if(this.$route.params.series == 10011){ document.body.className = 'betLottery-k3'}
    else document.body.className = ''
    if (!this.series || isNaN(parseInt(this.series)) || !this.id || isNaN(parseInt(this.id))) {
      this.$router.back()
    } else {
      this.getPlayWay()
    }
    this.refreshResult()
    if (this.$store.state.main.config['lotteryOpenUpdateModel'] === 'websocket') {
      this.$stomp.on(this.id, res => {
        this.result['lastissue'] = res['lastissue']
        this.result['lastluzhu'] = res['lastluzhu']
        this.result['lastresultInfo'] = res['lastresultInfo']
        this.refreshResult()
      })
    } else if (this.id) {
      if (!window.openTask) {
        window.openTask = {}
      }
      if (window.openTask[this.id]) window.clearInterval(window.openTask[this.id])
      window.openTask[this.id] = window.setInterval(() => {
        if (!this.closed && this.opening && this.id) {
          console.log('open ... ')
          this.refreshResult()
        } else console.log('no something ... ')
      }, 5000)
    }
  },
  beforeDestroy () {
    this.$stomp.off(this.id)
    this.$stomp.off('user.prizePoolList')
    this.$stomp.off('user.lotteryJackpot')
    this.winnerList = [];
    if(this.winnerTime) {
      clearInterval(this.winnerTime)
    }
    if (window.openTask && window.openTask[this.id]) window.clearInterval(window.openTask[this.id])
  },
  methods: {
    clear () {
      this.targetCode = []
      this.targetBall = []
    },
    getWinerList() {
      this.$store.dispatch('lottery/getWinnerList', this.$route.params.id).then(res=>{
        if(res.code === 200){
          let style=''
          if(this.$route.params.series == 10011){
            style ='color: #E9CB53;font-weight:400'
          }else{
            style= 'color: #FE1300;font-weight:400'
          }
          this.winnerList = res.data.map(ff=>{
            ff['text'] = `<span>
                            ${ff.mode
                              .replace('%%','<span class="user">'+ff.userName+'</span>')
                              .replace('%%','<span class="lottery_name">【'+ff.lotteryName+'】</span>')
                              .replace('%%', '<span class="money" style="'+style+'">'+ff.amount+'</span>')
                            }
                          </span>`
            return ff
          })
        }
      })
    },
    getPoorList() {
      this.$store.dispatch('lottery/getprizePool',{
        callback:res=>{
          try {
            let newDig = (res.filter(ff=> ff.lotteryId == this.$route.params.id))[0].prizePool;
            this.digits = (Array(8).join('0') +  Math.floor(newDig)).slice(-8);
          } catch (error) {
           console.log('route') 
          }
        }
      })
    },
    getPlayWay () {
      this.$store.dispatch('lottery/getPlayWaySet', {
        id: this.id,
        callback: res => {
          res = res.data
          if (res['code'] === 200) {
            let playList

            res.data.forEach(big => {
              big.items.forEach(small => {
                small.code.forEach(code => {
                  code.ball = small.small || big.big
                })
              })
            })

            if (this.series.toString() === '10011') {
              let playListNew = []
              res.data.forEach(item => {
                playListNew = playListNew.concat(item.items)
              })
              playListNew = playListNew.filter(item=>{return  item.small!=='二同单选'})
              playListNew.map(item=>{if(item.small == '二同复选'){return item.small = '二同'}})
              playList = playListNew
            } else playList = res.data
            this.playList = playList
          } else {
            // this.toastText('获取玩法数据失败', window.TOAST_POSITION.TOP)
          }
        }
      })
    },
    /**
     * 开奖结果刷新
     */
    refreshResult () {
      this.$store.dispatch('lottery/refreshResult', this.id).then(res => {
        res = res.data
        this.result = res.data
        if (res['code'] === 200 && (res.data['djs_next_kaipan'] > 0 || res.data['djs_fengpan'] > 0)) {
          this.closed = res.data['djs_next_kaipan'] > 0
          if (!this.closed) {
            const lastIssue = parseInt(res.data['lastissue'])
            const thisIssue = parseInt(res.data['issue'])
            if (thisIssue - lastIssue === 1) {
              this.opening = false;
            } else if (thisIssue - lastIssue > 1 && thisIssue - lastIssue<=5) {
              this.opening = true
            }else if(thisIssue - lastIssue>5){
              this.opening = false;
            }
          }
        } else {
          if (this.errTask) clearTimeout(this.errTask)
          this.errTask = setTimeout(() => {
            this.refreshResult()
          }, 5000)  

          // this.closed = true
        }
      }).catch(err => {
        console.warn('获取开奖结果失败: ', err)
      })
    }
  }
}