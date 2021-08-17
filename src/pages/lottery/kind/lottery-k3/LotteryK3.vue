<template>
  <view-page ref="view-page" class="lottery-k3" :position-style="positionStyle" :class="{'show-more':showMoreModal}" full-box @scroll-height-change="height => {this.contentHeight = height}">
    <lottery-k3-header slot="header" :play-way="playList" v-model="playWayIndex">
    </lottery-k3-header>

    <div :class="[12,13,16,17,18,19,27,3630,3631,3632,10044,10045].includes(Number($route.params.id))?'k3-lottery-header-inline':'lottery-header-inline'" slot="header-static">
      <div class="theme-border-color" v-if="[12,13,16,17,18,19,27,3630,3631,3632,10044,10045].includes(Number($route.params.id))" style="height:0.64rem; background: #19593c; border:0.02rem #244532 solid;width: 100%;z-index:499">
        <i class='icon iconfont h5-icon-icon-gonggao theme-color-yellow-2' style="margin-right:0.1rem;top:0.15rem;left:0.24rem; position: absolute;z-index:1; color:#EDF6F1;"></i>
        <simple-notice @curIndex='getCurIndex' :text="winnerList" />
      </div>
      <div class="lottery-result-box lottery-result-box-50 theme-main-bg-5 theme-border-color">
        <p class="last-issue" v-if="opening">{{result?(parseInt(result['lastissue'])+1).toString().substr(8):'????'}}期开奖号码</p>
        <p class="last-issue" v-else>{{result?result['lastissue'].toString().substr(8):'????'}}期开奖号码</p>
        <ul class="result-num">
          <li :class="['ty-k3-num','ty-k3-num-' + (opening?'opening-'+num:num)]" :key="'num'+i"
              v-for="(num, i) in opening?openingNum:(result?result['lastresultInfo'].split(','):[1,2,3])"></li>

          <li style="height: 0.48rem;padding-top: 0.05rem" @click="showMoreModal = !showMoreModal">
            <i style="vertical-align: top" class="theme-color-yellow-before" :class="{'icon iconfont h5-icon-qushi-moreup':true,active:showMoreModal}"></i>
          </li>
        </ul>
      </div>
      <div class="lottery-timer lottery-timer-50 theme-main-bg-5 theme-after-border-color-1">
        <p class="issue theme-color-white" v-if="!closed">{{result&&result['issue']?result['issue'].toString().substr(8):'????'}}期投注截止</p>
        <p class="issue theme-color-white" v-else>{{result?(parseInt(result['issue'])+1).toString().substr(8):'????'}}期开盘</p>
        <p class="time theme-color-yellow-2">{{timeStr}}</p>
        <span :class="['bet-icon',{'black-bet-icon' : $config.blackTheme || $config.newQP},{'blush-bet-icon':$config.blush}]" @click="onBetRecode"></span>
      </div>
      <div class="more-box">
        <div class="modal-box" v-show="showMoreModal" @click="showMoreModal=false"></div>
        <transition :name="showMoreModal?'slide-down':'slide-up'">
          <div v-show="showMoreModal">
            <ul class="more-list theme-border-color">
              <li class="row theme-main-bg-5">
                <span class="col col-issue theme-border-color theme-color-white">期号</span>
                <span class="col col-result theme-border-color theme-color-white">开奖号码</span>
                <span class="col col-info theme-border-color theme-color-white">和值</span>
                <span class="col col-info theme-border-color theme-color-white">大小</span>
                <span class="col col-info theme-border-color theme-color-white">单双</span>
              </li>
              <li :class="['row',i % 2 === 0 ? 'theme-header-bg' : 'theme-main-bg-5']" v-for="(item,i) in results" :key="item.issue + '_' + i">
                <span class="col col-issue theme-border-color theme-color-white" v-if="$route.query.code=='ksk3'">{{item['issue'].toString().substr(-4)}}</span>
                <span class="col col-issue theme-border-color theme-color-white" v-else>{{item['issue'].toString().substr(-3)}}</span>
                <span class="col col-result theme-border-color">
                      <i v-for="(num, j) in item['resultInfo'].split(',')" :class="'ty-k3-num ty-k3-num-'+num" :key="num+j"></i>
                    </span>
                <span class="col col-info theme-border-color theme-color-white">{{item['hz']}}</span>
                <span class="col col-info theme-border-color theme-color-white">
                    <span :class="{ball:true,'ball-1':item['hdx']==='大','ball-2':item['hdx']==='小'}">{{item['hdx']}}</span>
                  </span>
                <span class="col col-info theme-border-color theme-color-white">
                    <span :class="{ball:true,'ball-1':item['hds']==='双','ball-2':item['hds']==='单'}">{{item['hds']}}</span>
                  </span>
              </li>
            </ul>
            <div class="more-button-box">
              <button class="more-button theme-main-bg-5 theme-border-color theme-color-white" @click="$router.push('/trend/' + $route.params.id + '/0')">
                <i class="icon-trend icon iconfont h5-icon-H-qushi theme-color-yellow-2" style="transform: none"></i>
                查看更多走势
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
    
    <div class="play-way-box" :style="{height:contextHeight>0?contextHeight+'rem':''}" slot="content">
      <transition-group name="fade-down">
        <div @click="show = !show" v-if="[12,13,16,17,18,19,27,3630,3631,3632,10044,10045].includes(result.lotteryId)  && digits.length>5" :class="[12,13,16,17,18,19,27,3630,3631,3632,10044,10045].includes(result.lotteryId) ? 'k3_roll': ''" :key="10">
          <div  style="width:3.2rem; display: flex;align-items: center; float: left;height: inherit; margin-left: 1.95rem;">
            <DigitRoll :rollDigits="digits" :flipStra ='true' :isK3='true'/>
          </div>
        </div>
        <div class="content-item" v-if="way['small']==='点数'" :key="1">
          <p class="desc">猜3个开奖号相加的和，3-10为小，11-18为大。</p>
          <ul class="codes">
            <li :class="{active:targetCode.includes(code)}" class="code-item" v-for="(code, i) in way['code']" :key="i" @click="onCodeClick(code)">
              <span class="code-name">{{code['code']}}</span>
              <span class="code-odds">赔率{{code['odds']}}</span>
            </li>
          </ul>
        </div>

        <div class="content-item" v-else-if="way['small']==='三同'" :key="2">
          <p class="desc">对相同的三个号码(111、222、333、444、555、666)中的任意一个或多个进行投注，所选号码开出，即为中奖。赔率{{way['code'][0]['odds']}}倍。</p>
          <ul class="codes">
            <li :class="{active:targetCode.includes(code)}" class="code-item code-item-6" v-for="(code, i) in way['code']" :key="i" @click="onCodeClick(code)">
              <span class="code-name">{{code['code']}}</span>
            </li>
          </ul>
        </div>

        <div class="content-item" v-else-if="way['small']==='二同复选'||way['small']==='二同'" :key="3">
          <p class="desc">从11-66中任选1个或多个号码，选号与奖号(包含11-66，不限顺序)相同，即为中奖（不含豹子）。赔率{{way['code'][0]['odds']}}倍。</p>
          <ul class="codes">
            <li :class="{active:targetCode.includes(code)}" class="code-item code-item-6" v-for="(code, i) in way['code']" :key="i" @click="onCodeClick(code)">
              <span class="code-name">{{code['code']}}</span>
            </li>
          </ul>
        </div>

        <div class="content-item" v-else-if="way['small']==='三同通选'" :key="4">
          <p class="desc">对所有相同的三个号码(111、222、333、444、555、666)进行投注，任意号码开出，即为中奖。赔率{{way['code'][0]['odds']}}倍。</p>
          <ul class="codes">
            <li :class="{active:targetCode.includes(code)}" class="code-item code-item-1" v-for="(code, i) in way['code']" :key="i" @click="onCodeClick(code)">
              <span class="code-name">{{code['code']}}</span>
            </li>
          </ul>
        </div>

        <div class="content-item"  v-else-if="way['small']==='三连通选'" :key="5">
          <p class="desc">对所有的3个相连号码(123、234、345、456)进行投注，任意号码开出，即为中奖。赔率{{way['code'][0]['odds']}}倍。</p>
          <ul class="codes">
            <li :class="{active:targetCode.includes(code)}" class="code-item code-item-1" v-for="(code, i) in way['code']" :key="i" @click="onCodeClick(code)">
              <span class="code-name">{{code['code']}}</span>
            </li>
          </ul>
        </div>

        <div class="content-item" v-else-if="way['small']==='三不同'" :key="6">
          <p class="desc">从1-6中任选3个或多个号码,所选号码与开奖号码的3个号码相同,即为中奖。赔率{{way['code'][0]['odds']}}倍。</p>
          <ul class="codes">
            <li :class="{active:targetBall.includes(i)}" class="code-item code-item-6" v-for="i in 6" :key="i" @click="onBallClick(i)">
              <span class="code-name">{{i}}</span>
            </li>
          </ul>
        </div>

        <div class="content-item" v-else-if="way['small']==='二不同'" :key="8">
          <p class="desc">从1-6中任选2个或多个号码，所选号码与开奖号码任意2个号码相同，即为中奖。赔率{{way['code'][0]['odds']}}倍。</p>
          <ul class="codes">
            <li :class="{active:targetBall.includes(i)}" class="code-item code-item-6" v-for="i in 6" :key="i" @click="onBallClick(i)">
              <span class="code-name">{{i}}</span>
            </li>
          </ul>
        </div>

        <div class="content-item" v-else-if="way['small']==='二同单选'" :key="9">
          <p class="desc">选择1对相同号码和1个不同号码投注，选号与奖号相同，即为中奖。赔率{{way['code'][0]['odds']}}倍。</p>
          <ul class="codes">
            <li :class="{active:targetBall.includes(ii)}" class="code-item code-item-6" v-for="ii in [11,22,33,44,55,66]" :key="ii" @click="onBallClick(ii)">
              <span class="code-name">{{ii}}</span>
            </li>
            <li :class="{active:targetBall.includes(i)}" class="code-item code-item-6" v-for="i in 6" :key="i" @click="onBallClick(i)">
              <span class="code-name">{{i}}</span>
            </li>
          </ul>
        </div>
      </transition-group>
    </div>

    <div class="closed" slot="content-static" v-show="closed">
      <span class="info">已封盘</span>
    </div>

    <lottery-bet-input ref="lotterFoot" @clear="clear" slot="footer" :code.sync="targetCode" :ball.sync="targetBall" :ball-list="ballList"
                       :series="series.toString()" :id="id.toString()" :way="playList[playWayIndex]" :result="result"></lottery-bet-input>

    <div slot="static">
      <van-popup v-model="show" get-container="body">
        <img style="width:6.58rem;" :src="$config.blackTheme || $config.newQP ? require('../../../../assets/img/kaijiang/black_kaijiang_bg.png') : require('../../../../assets/img/kaijiang/kaijiang_bg.png')" />
        <div class="jiangchi_txt">
            <p :class="{'theme-color-white':$config.blackTheme || $config.newQP}">
                1、会员投注每中奖1000元，奖池累积5元，投注越多奖池累积越多。</p>
            <p :class="{'theme-color-white':$config.blackTheme || $config.newQP}">
                2、会员投注中奖时，即有机会击中奖池，获得奖池派彩。彩种结算时，进行奖金派发并推送中奖通知。</p>
            <p :class="{'theme-color-white':$config.blackTheme || $config.newQP}">
                3、中奖金额依据奖池金额进行匹配，随机发放。奖池金额越高，奖金越高，千万大奖等您拿。

            </p>
            <p class="text-ct text-ct-one " :class="{'theme-color-white':$config.blackTheme || $config.newQP}">感谢您对{{this.$config.name === "aqvns"?this.$config.setName:"云博科技"}}的支持！</p>
            <p class="text-ct" :class="{'theme-color-white':$config.blackTheme || $config.newQP}">祝您下注中奖，黄金万两！</p>
        </div>
        <p class="pop_know" @click="show = false"></p>
    </van-popup>
      <slot></slot>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import lotteryMixin from '../mixin'
import LotteryK3Header from './LotteryK3Header'
import DigitRoll from '../../../../components/digitroll'
import SimpleNotice from '../../component/simple-notice-bar/simple-notice-bar'
export default {
  name: 'LotteryK3',
  components: {
    LotteryK3Header,
    DigitRoll,
    SimpleNotice
  },
  mixins: [lotteryMixin],
  data () {
    return {
      show: false,
      openingNum: [0, 0, 0],
      showMoreModal: false,
      contextHeight:0,
      results: [],
      time: 0,
      contentHeight: 0,
      ballList: []
    }
  },
  watch: {
    result () {
      if(this.result){
        const issVal = parseInt(this.result.issue) - parseInt(this.result.lastissue)
        this.opening = !!((this.result.djs_next_kaipan && issVal === 1) ||issVal === 2)
      }
      if (this.result['djs_next_kaipan'] > 0) {
        this.time = this.result['djs_next_kaipan']
      } else if (this.result['djs_fengpan'] > 0) {
        this.time = this.result['djs_fengpan']
      } else {
        if (this.task) {
          window.clearInterval(this.task)
        }

        if (this.openTask) {
          window.clearInterval(this.openTask)
        }
      }
    },
    opening () {
      if (!this.opening) this.refreshTrend()
    }
  },
  computed: {
    
    way () {
      if([12,13,16,17,18,19,27,3630,3631,3632,10044,10045].includes(Number(this.$route.params.id))){
        if(this.playWayIndex === 0){
          //当玩法为点数时,并且屏幕高度过小的时候设置高度
          var screenHeight = window.screen.height;//获取屏幕高度
          if(screenHeight <= 667){
            //苹果小手机
            this.contextHeight = 9;
          }else if(screenHeight <= 736){
            //苹果大手机
            this.contextHeight = 9.8;
          }
        }else{
          this.contextHeight = 0;
        }
      }
      return this.playList[this.playWayIndex]
    },
    timeStr () {
      if (this.time > 0) {
        let hours = Math.floor(this.time / 60 / 60)
        let minute = Math.floor((this.time % (60 * 60)) / 60)
        let second = this.time % 60
        if (hours) {
          return (
            this.number2(hours) +
              ':' +
              this.number2(minute) +
              ':' +
              this.number2(second)
          )
        } else {
          return (

            this.number2(minute) +
              ':' +
              this.number2(second)
          )
        }
      } else {
        return '00:00'
      }
    }
  },
  created () {

    this.task = window.setInterval(() => {
      if (this.time > 0) {
        this.time--
      } else if (this.time === 0) {
        this.closed = !this.closed
        this.time = -1
      }
    }, 1000)

    this.openTask = window.setInterval(() => {
      if (this.opening || this.closed) {
        const num = (this.openingNum[0] + 1) % 4
        this.openingNum = [num, num, num]
      }
    },80)

    if (!window.visibilityChangeManagerTask) window.visibilityChangeManagerTask = {}
    window.visibilityChangeManagerTask[this.$route.params.id] = window.visibilityChangeManager.on(status => {
      if (status) this.refreshTrend(true)
    })

    this.refreshTrend()
  },
  mounted(){
    
  },
  methods: {
    getCurIndex(index){
      this.currIndex = index
    },
    onBallClick (ball) {
      let other
      if (ball.toString().length === 1) {
        other = '' + ball + ball
      } else {
        other = ball.toString()[0]
      }

      const otherIndex = this.targetBall.indexOf(parseInt(other))
      if (otherIndex > -1) {
        this.targetBall.splice(otherIndex, 1)
      }

      const index = this.targetBall.indexOf(ball)
      if (index > -1) {
        this.targetBall.splice(index, 1)
      } else {
        this.targetBall.push(ball)
      }
    },
    onCodeClick (code) {
      const index = this.targetCode.indexOf(code)
      if (index > -1) {
        this.targetCode.splice(index, 1)
      } else {
        this.targetCode.push(code)
      }
    },
    onBetRecode () {
      if (this.$store.state.user.userInfo && this.$store.state.user.token) {
        this.$router.push(`/user/record/list/lottery/${this.dayJs().format('YYYY-MM-DD')}?status=0`)
      } else {
        this.goNewLogin()
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
              item['zhz'] = item['resultInfo'].split(',').map(n => parseInt(n)).reduce((prev, v) => {
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

    if (this.openTask) {
      window.clearInterval(this.openTask)
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .lottery-k3 {
    background-color: #317455;
    color: #caebda!important;

    .ty-k3-num {
      width: 0.48rem;
      height: 0.48rem;
      background-size: 2*0.5rem 6*0.5rem;
      margin: 0.04rem;
      background-image: url("../../../../assets/img/lottery/k3/dice-k3.png");

      &.ty-k3-num-1 {
        background-position: 0 0;
      }

      &.ty-k3-num-2 {
        background-position: 0 -1*0.5rem;
      }

      &.ty-k3-num-3 {
        background-position: 0 -2*0.5rem;
      }

      &.ty-k3-num-4 {
        background-position: 0 -3*0.5rem;
      }

      &.ty-k3-num-5 {
        background-position: 0 -4*0.5rem;
      }

      &.ty-k3-num-6 {
        background-position: 0 -5*0.5rem;
      }

      &.ty-k3-num-opening-0 {
        background-position: -0.5rem 0;
      }

      &.ty-k3-num-opening-1 {
        background-position: -0.5rem -1*0.5rem;
      }

      &.ty-k3-num-opening-2 {
        background-position: -0.5rem -2*0.5rem;
      }

      &.ty-k3-num-opening-3 {
        background-position: -0.5rem -3*0.5rem;
      }
    }

    .header-box {
      position: revert;
      width: 100%;
    }

    .content-box {
      flex: 1;
      width: 100%;
      position: relative;

      .content-animation-box {
        position: relative;
        width: 100%;
      }
    }

    .input-tctx-k3-box {
      height: 1.5rem;
      background-color: #19593c;
      position: absolute;
      width: 100%;
      left: 0;
      top: 100%;
      transform: translateY(0);
      transition: all 400ms;

      &.show {
        transform: translateY(-100%);
      }

      .num-row {
        border-bottom: 0.02rem solid #164630;
      }

      .money-row,
      .num-row {
        width: 100%;
        box-sizing: border-box;
        height: 0.75rem;
        text-align: left;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: nowrap;
      }

      .row-label,
      .amount {
        color: #caebda;
        font-size: 0.3rem;
        line-height: 0.75rem;
        padding: 0 0.14rem;
        overflow: hidden;
        white-space: nowrap;

        .num {
          color: #ffaf36;
        }
      }

      .num-list {
        color: #ffaf36;
        font-size: 0.3rem;
        line-height: 0.75rem;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        width: 80%;
      }

      .input,
      .input:focus {
        width: 1.6rem;
        height: 0.5rem;
        background-color: #cbeedc;
        color: #19593c;
        border-radius: 0.1rem;
        padding: 0 0.1rem;
        box-sizing: border-box;
        font-size: 0.3rem;
      }
    }

    .footer-box {
      width: 100%;
      height: 1.16rem;
      box-sizing: border-box;
      background-color: black;
      z-index: 450;
      display: flex;
      align-items: stretch;
      line-height: 1.16rem;
      justify-content: space-between;

      .clean-btn {
        color: #ffaf36;
        font-weight: bold;
        font-size: 0.4rem;
        padding: 0 0.36rem;
      }

      .order-count {
        font-size: 0.3rem;
        color: #fff;
        flex: 1;
        text-align: left;
      }

      .submit-btn,
      .submit-btn:active {
        height: 100%;
        background-color: #ffaf36;
        color: #4e0904;
        font-weight: bold;
        font-size: 0.349rem;
        padding: 0 0.26rem;
        border: 0;
        margin: 0;
        box-sizing: border-box;
      }
    }

    .play-way-box {
      .content-item {
        padding: 0.2rem;
      }
      // .content-item-roll{
      //   margin-top: 
      // }

      .codes {
        width: 100%;
        text-align: center;

        .code-item {
          width: 1.36rem;
          display: inline-block;
          margin: 0.05rem 0.08rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-sizing: border-box;

          &.code-item-6 {
            width: 1rem !important;
            height: 0.9rem;
            padding: 0.16rem 0;
          }

          &.code-item-1 {
            width: 4rem !important;
            height: 0.9rem;
            padding: 0.16rem 0;
          }

          .code-name {
            width: 100%;
            display: block;
            font-size: 0.38rem;
            color: #fff;
            line-height: 0.54rem;
          }

          .code-odds {
            width: 100%;
            display: block;
            font-size: 0.24rem;
            line-height: 0.24rem;
            color: #caebda;
            margin-bottom: 0.08rem;
            white-space: nowrap;
          }

          &.active {
            border-color: #f4c829;

            .code-name,
            .code-odds {
              color: #f4c829;
            }
          }
        }
      }

      .desc {
        color: #caebda;
        font-size: 0.26rem;
        line-height: 0.36rem;
        padding: 0.1rem 0.2rem;
        font-weight: bold;
      }
    }

    .lottery-result-box {
      background-color: #19593c;
      position: relative;
      z-index: 500;
      border-right: 0.02rem solid #164630;
      box-sizing: border-box;

      .icon {
        display: inline-block;
        margin-left: 0.04rem;
        transform: scale(0.64) translateY(-10%) rotateZ(180deg);
        transform-origin: 50% 55%;
        transition: all 500ms;
        color: #78ba9e;

        &:before {
          color: #78ba9e;
        }

        &.active {
          transform: scale(0.64) translateY(-10%);
        }
      }

      .last-issue {
        width: 100%;
        color: #caebda;
        text-align: center;
        font-size: 0.3rem;
        line-height: 0.3rem;
        height: 0.3rem;
        margin-top: 0.2rem;
        font-weight: bold;
      }

      .result-num {
        margin-top: 0.1rem;
        width: 100%;
        display: flex;
        height: 0.5rem;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
      }
    }

    .lottery-timer {
      background-color: #19593c;
      width: 50%;
      //height: 100%;
      box-sizing: border-box;
      float: left;
      border: none;
      position: relative;
      &:after{
        content:none;
        display:none;
      }
      .bet-icon {
        position: absolute;
        top: 50%;
        right: 0;
        display: block;
        width: 0.44rem;
        height: 0.44rem;
        transform: translateY(-50%);
        box-sizing: border-box;
        border-width: 0.22rem;
        border-style: solid;
        border-color: transparent #317455 transparent transparent;
        &.black-bet-icon {
          border-color: transparent #272727 transparent transparent;
        }
        &.blush-bet-icon {
          border-color: transparent #73010C transparent transparent;
        }
      }

      .issue {
        width: 100%;
        color: #caebda;
        text-align: center;
        font-size: 0.3rem;
        line-height: 0.3rem;
        height: 0.3rem;
        margin-top: 0.2rem;
      }

      .time {
        font-size: 0.5rem;
        line-height: 0.5rem;
        color: #caebda;
        margin-top: 0.1rem;
        font-weight: bold;
      }
    }

    .submit-header,
    .all-info,
    .submit-footer {
      background: #19593c;
      color: #caebda;

      .num {
        color: #f4c829;
      }
    }

    .bc {
      background: #176441;
    }

    .submit-content,
    .order {
      background: #317455;
      color: #caebda;
      border-bottom: 0.02rem solid rgba(255, 255, 255, 0.3);
      border-top: none;

      .num {
        color: #f4c829;
      }
    }

    .ty-k3-num {
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
    }

    .more-box {
      width: 100vw;
      position: absolute;
      left: 0;
      top: calc(100%);
      z-index: 498;

      .num-item {
        display: inline-block;
        margin: 0.05rem 0.1rem;
        overflow: hidden;
        width: 0.42rem;
        height: 0.42rem;
        line-height: 0.52rem;
        color: #caebda;
        font-weight: 700;
        background-repeat: no-repeat;
        background-size: 100%;
      }

      .modal-box {
        z-index: -1;
        position: absolute;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
      }

      .more-list {
        background-color: #317455;
        list-style: none;
        font-size: 0.28rem;
        line-height: 0.56rem;
        border-top: 0.02rem solid #245638;
        color: #c9ebd0;

        .row {
          display: block;
          width: 100%;
          height: 0.56rem;

          &:nth-of-type(2n + 1) {
            background-color: #35684e;
          }

          &:nth-of-type(2n + 0) {
            background-color: #2e6345;
          }

          &:after {
            content: "";
            display: table;
            clear: both;
            zoom: 1;
          }

          .col {
            float: left;
            border-right: 0.02rem solid #456f59;
            box-sizing: border-box;
            height: 0.56rem;
            overflow: hidden;
            display: inline-block;
            font-weight: bold;

            &:last-of-type {
              border-right: none;
            }
          }

          .col-issue {
            width: 16%;
          }

          .col-result {
            width: 34.3%;
          }

          .col-info {
            width: 16%;
          }

          .ball {
            display: inline-block;
            margin: 0 auto;
            width: 0.42rem;
            height: 0.42rem;
            border-radius: 50%;
            line-height: 0.44rem;
            font-size: 0.28rem;
          }

          .ball-1 {
            background-color: #597d36;
            font-weight: normal!important;
          }

          .ball-2 {
            background-color: #bb9431;
            font-weight: normal!important;
          }
        }
      }

      .more-button-box {
        width: 100%;
        background-color: rgba(0, 0, 0, 0);

        .more-button {
          display: block;
          line-height: 0.56rem;
          padding: 0 0.2rem;
          outline: 0;
          border-top: none;
          border-right: 0.02rem solid #456f59;
          border-bottom: 0.02rem solid #456f59;
          border-left: 0.02rem solid #456f59;
          background-color: #2e6345;
          border-bottom-left-radius: 0.1rem;
          border-bottom-right-radius: 0.1rem;
          color: #c9ebd0;
          font-size: 0.28rem;
          font-weight: bold;

          &:before {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            right: 100%;
            font-weight: bold;
          }

          .icon {
            color: #c9ebd0;
            font-size: 0.28rem;
            font-weight: bold;
            margin-top: 0.04rem;
          }
        }
      }
    }
  }

  .show-more {
    /deep/ .auto-box-footer {
      position: static;
    }
  }
  .k3_roll{
    height: 1.56rem;
    line-height: 1.56rem;
    width: 6.47rem;
    margin: 0 auto;
    background-image: url('../../../../assets/img/digitRoll/jiangchi_k3.png');
    background-size: 100%;
    margin-top: 0.3rem;
  }
  .pop_know {
    position: absolute;
    width: 4.1rem;
    height: 0.62rem;
    background-image: url('../../../../assets/img/kaijiang/ikonw.png');
    background-size: 100%;
    z-index: 10;
    bottom: 0.85rem;
    margin: auto;
    left: 50%;
    transform: translate(-50%, 0);
}

.jiangchi_like {
    position: absolute;
    bottom: 2.18rem;
    width: 4.1rem;
    color: #444444;
    left: 50%;
    transform: translate(-50%, 0);
    font-size: 0.24rem;
    font-weight: 600;
    background-color: #ffffff;
}

.jiangchi_txt {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    top: 2.32rem;
    width: 4.8rem;
    height: 3.28rem;

    >p {
        font-size: 0.24rem;
        font-weight: 600;
        color: #444444;
        text-align: left;
        line-height: 0.52rem;
        // margin-bottom: 0.12rem;
        // letter-spacing:0.01rem;
    }
    .text-ct{
      text-align: center;
    }
    .text-ct-one{
      margin-top: 0.12rem;
    }
}
.notice-bar{
      // background-color: #F7F7F7;
      color: #EDF6F1 !important;
      position: relative;
      box-sizing: border-box;
      font-size: 0.24rem;
      .money{
        color: #E9CB53 !important;
      }
    }
</style>
