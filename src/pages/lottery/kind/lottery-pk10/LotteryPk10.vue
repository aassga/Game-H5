<template>
  <view-page ref="view-page" full-box :position-style="positionStyle">
    <lottery-header slot="header" :id="id.toString()"></lottery-header>
    <section slot="header-static">
      <!-- <div class="xysc-open" style="position: relative;z-index: 900;" v-if="['3630','13','12'].includes($route.params.id.toString())">
        <span class="xysc-title">开奖来源</span>
        <span class="xysc-title" :class="{'MIUI':isMiUI}">【{{!closed ? result.lasthistorylotteryname:'????'}}】</span>
        <span class="xysc-title xt-title" :class="{'MIUI':isMiUI}" v-if="result &&result.lasthistorypentime">
          {{!closed ? new Date(result.lasthistorypentime*1000).getFullYear()+'年'+ (parseInt(new Date(result.lasthistorypentime*1000).getMonth())+1) + '月'+ new Date(result.lasthistorypentime*1000).getDate()+'日' :'????年??月??日'}}
        </span>
        <span v-else class="xysc-title">{{initRuslt.yeaer}}年{{ initRuslt.mouth }}月{{ initRuslt.day }}日</span>
        <span class="xysc-title xt-data">{{!closed ? result.lasthistoryissue : '??????'}}期</span>
      </div> -->
      <div v-if="[12,13,16,17,18,19,27,3630,3631,3632,10044,10045].includes(Number($route.params.id))"  style="height:0.64rem;background: #fff; z-index:499">
        <i class='icon iconfont h5-icon-icon-gonggao theme-color theme-color-yellow-2' style="margin-right:0.1rem;top:0.15rem;left:0.24rem; position: absolute;z-index:500"></i>
        <simple-notice @curIndex='getCurIndex' :text="winnerList" />
      </div>
      <lottery-result :result="result" :closed.sync="closed" :opening.sync="opening"></lottery-result>
      <lottery-timer :result="result" :closed.sync="closed" :opening.sync="opening" :digits='digits'></lottery-timer>
      <lottery-play-way-nav v-model="playWayIndex" :play-list="playList"></lottery-play-way-nav>
    </section>

    <section slot="content" class="lotter-pk10">
      <van-tabs v-model="playWayIndex" animated swipeable class="lottery-body no-tab theme-header-bg">
        <van-tab class="lottery-play" v-for="(play, i) in playList" :key="i">
          <lottery-code-selector :code.sync="targetCode" :ball.sync="targetBall" :play="play" :ball-list="ballList"></lottery-code-selector>
        </van-tab>
      </van-tabs>

      <lottery-ball-results class="ball-results-box" :result="result" :closed="closed" :opening="opening" :id="id.toString()"></lottery-ball-results>
    </section>

    <div class="closed" slot="content-static" v-show="closed">
      <span class="info">已封盘</span>
    </div>

    <lottery-bet-input @clear="clear" slot="footer" :code.sync="targetCode" :ball.sync="targetBall" :ball-list="ballList"
                       :series="series.toString()" :id="id.toString()" :way="playList[playWayIndex]" :result="result"></lottery-bet-input>

    <div slot="static">
      <pub-dialog v-model="showNoticeDialog">
        <div class="notice-dialog" style="z-index: 9999">
          <template>
            <img src="../../../../assets/img/home/newAlert.png" alt/>
            <scroll-box ref="notice-scroll" class="notice-dialog-content" auto style="padding: 0 0.4rem">
              <div class="con-text" ref="notice-scroll-content" v-html="noticeText"></div>
            </scroll-box>
            <a href="javascript:void(0)" class="notice-dialog-footer theme-color" @click="showNoticeDialog = false">
              <div style="heigth:1rem;" class="theme-bg">我知道了</div>
            </a>
          </template>
        </div>
      </pub-dialog>
      <slot></slot>
    </div>

  </view-page>
</template>

<script type="text/javascript">
import lotteryMixin from '../mixin'
import LotteryResult from './LotteryResult'
import LotteryTimer from './LotteryTimer'
import LotteryCodeSelector from '../../component/lottery-code-selector/LotteryCodeSelector'
import SimpleNotice from '../../component/simple-notice-bar/simple-notice-bar'
export default {
  name: 'LotteryPk10',
  components: {
    LotteryCodeSelector,
    LotteryResult,
    LotteryTimer,
    SimpleNotice
  },
  mixins: [lotteryMixin],
  data () {
    return {
      ballList: ['冠军', '亚军', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'],
      noticeText: '',
      showNoticeDialog: false,
      initRuslt:{
        name:'北京赛车',
        yeaer:'????',
        mouth:'??',
        day:'??',
        iussu:'??????'
      },
      closed:false,
      isMiUI:false
    }
  },
  methods: {
    getCurIndex(index){
      this.currIndex = index
    },
    // 获取弹框次数
    getAlert () {
      if (this.id.toString() === '3630') {
        this.$http.get('/member/messageAlert').then(res => {
          if (res.data.code === 200) {
            if (res.data.data) {
              this.noticeText = res.data.data
              this.showNoticeDialog = true
            }
          }
        }).catch(e => console.log(e))
      }
    }
  },
  created () {
    if(navigator.userAgent.toLowerCase().includes('miui') ||navigator.userAgent.toLowerCase().includes('mi') ){
      this.isMiUI = true
    }
    this.getAlert()
  },
  mounted(){
    // setInterval(() => {
    //   this.ballList = this.ballList.splice(0,3).concat([`第八${Math.ceil(Math.random()*10)}名`, `第九${Math.ceil(Math.random()*10)}名`, `第十${Math.ceil(Math.random()*10)}名` , `第十一${Math.ceil(Math.random()*10)}名` ,`第十二${Math.ceil(Math.random()*10)}名`])
    //   console.log(this.ballList)
    // }, 3000);
  }
}
</script>
<style lang="less" type='text/less' scoped>
  .notice-bar{
    // height: 0.8rem;
    background-color: #F7F7F7;
    position: relative;
    box-sizing: border-box;
    font-size: 0.24rem;
    &::before{
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 0;
      top: 0;
      left: 0;
      border-top: 0.02rem solid #E9E9E9;
      transform: scaleY(.5);
    }
    &::after{
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 0;
      bottom: 0;
      left: 0;
      border-bottom: 0.02rem solid #E9E9E9;
      transform: scaleY(.5);
    }
  }
  .lotter-pk10{
    /deep/.van-tabs{
      &:after{
        content:none;
        display:none;
      }
    }

  }
  .xysc-open {
    width: 100%;
    height: 0.5rem;
    line-height: 0.5rem;
    text-align: left;
    padding-left: 0.2rem;
    position: relative;
    z-index: 600;
    left: 0;
    top: 0;
    background: #fff;

    .xysc-title {
      font-size: 0.28rem;
      color: #606060;
      font-weight: normal;

      &:last-of-type {
        margin-left: .06rem;
      }
    }
    .MIUI{
        left: -2px!important;
    }
  }

  .notice-dialog {
    width: 6.4rem;
    box-sizing: border-box;
    padding: 0;
    position: absolute;
    top: 46%;
    left: 50%;
    border-radius: 0.4rem;
    transform: translate3d(-50%, -50%, 0) scale(0);
    transform-origin: top;
    opacity: 0.96;
    transition: all 400ms;
    background-color: unset;

    img {
      width: 100%;
      display: block;
    }

    .notice-dialog-content {
      display: block;
      padding: 0.2rem 0.4rem;
      background-color: #fff;
      text-align: left;
      font-size: 0.32rem;
      max-height: 7.5rem;
      margin-top: -0.02rem;
      overflow: hidden;

      .con-text {
        padding: 0.2rem 0;
        color: #333333;
        line-height: 0.5rem;
      }
    }

    .notice-dialog-footer {
      display: block;
      width: 100%;
      height: 1.4rem;
      background: #fff;
      border: none;
      padding: 0 0.3rem;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 0 0 0.2rem 0.2rem;
      margin-top: -0.02rem;
      position: relative;

      > div {
        font-size: 0.34rem;
        height: 0.8rem;
        line-height: 0.8rem;
        border-radius: 0.1rem;
        color: #fff;
        margin-top: 0.3rem;
      }
    }

    .notice-dialog-footer::after {
      content: '';
      position: absolute;
      top: 0.08rem;
      left: 0;
      width: 100%;
      height: 0.02rem;
      background: #E7E7E7;
      transform: scaleY(0.5);
    }
  }

  .show .notice-dialog {
    transform: translate3d(-50%, -50%, 0) scale(1) !important;
  }
</style>
