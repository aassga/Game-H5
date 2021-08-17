<template>
  <view-page class="agent-take theme-main-bg" full-box>
    <title-header title="领取佣金" slot="header" :backEvent="backEvent" class="theme-header-bottom theme-header-bg">
      <a class="title-right" slot="right" @click="$router.push('/user/money-rule')" >佣金条款</a>
    </title-header>
    <div class="content" slot="content">
      <div class="view-box theme-gradient-bg">
        <p class="info-row theme-after-border-color">
          <span class="label theme-color-white">代理佣金:</span>
          <span class="money theme-color-yellow">{{userInfo['agencyInfo'] ? userInfo['agencyInfo']['balance'] : '0.00'}}<span class="rmb theme-color-white">元</span></span>
          <a class="action theme-color theme-color-yellow" @click="$router.push('/user/agency-center-new/commission-detail')" v-if="personalMode !== 'mode_c'">佣金明细</a>
        </p>
        <p class="info-row input-row theme-after-border-color">
            <span class="rmb theme-color-white">￥</span>
            <input v-model="money" v-keyBroayStates class="input change-money theme-color-white" type="text" v-number-keyboard.dot="9" :placeholder="'转帐金额 '+userInfo['agencyInfo'].balance">
            <!-- <input class="input" type="number" :placeholder="'转帐金额'+userInfo['agencyInfo'].balance" v-model="money" v-keyBroayStates v-number-keyboard.dot="9"/> -->
            <a class="action theme-color theme-color-yellow" @click="money = userInfo['agencyInfo']['balance']">全部</a>
        </p>
      </div>
      <div style="padding: 0.6rem 0.24rem;padding-top:0;margin-top:0.2rem;">
        <van-button type="primary" block @click="onSubmit" class="but theme-yellow-bg theme-color-black">立即领取</van-button>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'Take',
  data () {
    return {
      money: '',
      submitting: false,
      backEvent:false
    }
  },
  watch:{
    money(val){
      if(this.money && this.money.toString()=='0'){
        this.money=null
      }
    }
  },
  mounted(){
    document.body.id ='take'
    console.log(this.personalMode)
  },
 
  methods: {
    onSubmit () {
      if (!this.money) {
        this.toastText('请输入转帐金额', 'top')
      } else if (!parseFloat(this.money)) {
        this.toastText('请输入正确的金额', 'top')
      } else if (parseFloat(this.money) > parseFloat(this.userInfo['agencyInfo'].balance)) {
        this.toastText('转帐金额不能大于可用金额', 'top')
      } else if (parseFloat(this.money) < 0) {
        this.toastText('转帐金额不能小于0元', 'top')
      } else if (parseFloat(this.money) < 1) {
        this.toastText('转帐金额不能小于1元', 'top')
      } else if (!this.submitting) {
        this.submitting = true
        // this.$store.state.main.loadingText = '转帐中~~'
        this.$store.dispatch('agency/changeMoney', { money: parseFloat(this.money) }).then(res => {
          if (res.code === 200) {
            this.$store.dispatch('user/refreshInfo').then(() => {
              this.$router.replace({
                path: '/user/agency-center-new/take/success',
                query: {
                  money: this.money
                }
              })
              this.money = ''
            })
          } else if (res.message) {
            var that = this;
            this.money=null
            if (res.message.toString().includes('|')) {
               this.$vux.confirm.show({
                content: res.message.toString().replace(/\|/g, '\n'),
                confirmText: '人工客服',
                cancelText: '确定',
                onConfirm(){
                  const link = that.getKF();
                  if(link){
                    if(that.$userAgent.includes('MQQBrowser') || (that.$userAgent.includes("iPhone") && that.$userAgent.includes('SogouMobileBrowser'))){
                      //增加浏览器历史记录
                      window.history.pushState(window.location.href,null,window.location.href);
                      //解决QQ浏览器和苹果搜狗浏览器进入在线客服后卡顿
                      window.location.replace(link)
                    }else{
                      window.tryOpen(link);
                    }
                  }
                }
              });
            } else {
              this.toastText(res.message, 'top')
            }
          }
          setTimeout(() => {
            this.submitting = false
          }, 2500)
        }).catch(() => {
          setTimeout(() => {
            this.submitting = false
          }, 2500)
        })
      }
    },
  },
  destroyed(){
    document.body.id =''
  },
  beforeRouteEnter(to, from, next){
    next(vm=>{
      if(from.path.includes('/user/agency-center-new/dividend')){
        vm.backEvent = true
      }
    })
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .title-right {
    position: absolute;
    right: 0.16rem;
    top: 0;
    color: #fff;
    font-weight: 400;
    font-size: 0.3rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .agent-take-title-header {
    /deep/ .header-back {
      color: #fff5d9 !important;
    }
  }
  /deep/.placeholder span{
    font-size: 0.40rem;
    color: #BBBBBB;
  }
  .agent-take {
    color: #2c3e50;
    font-size: 0.349rem;

    .money {
      color: #E71414;
    }

    .content {
      .view-box {
        padding:0;
        width: calc(100% - 0.32rem);
        border-radius: 0.1rem;
        box-shadow: none;
        margin: 0.2rem 0.16rem 0.2rem 0.16rem;
        .label {
          margin: 0.1rem 0.1rem 0.1rem 0.04rem;
          white-space: nowrap;
          flex-shrink: 0;
          font-size:0.32rem;
          color:#444444;
        }
        .info-row {
          width: 100%;
          height: 1.32rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;

          .money {
            font-size: 0.4rem;
            text-align: left;
            white-space: nowrap;
            flex: 1;
            .rmb{
              font-size: 0.32rem;
              margin-left: 0.06rem;
            }
          }

          .action {
            color: #2C93FF;
            font-size: 0.32rem;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .rmb {
            left:0;
            font-size: 0.7rem;
            color: #444444;
            white-space: nowrap;
          }

          .input {
            flex: 1;
            font-size: 0.7rem;
            padding: 0.3rem 0.3rem 0.3rem 0.15rem;
            color: #444444;
            flex-shrink: 0;
            min-width: 0;
            &::-webkit-input-placeholder {
              transform: scale(0.66) translateY(0.06rem);
              transform-origin: left;
              overflow: visible !important;
            }

          }

          &:last-child {
            border-bottom: none;
          }
        }
        .info-row:nth-child(1){
          padding:0 0.24rem
        }
        .info-row:nth-child(2){
          height:auto;
          padding:0 0.24rem 0 0.13rem!important;
        }
        .input-row {
          padding: 0.1rem 0 !important;
          position: relative;
          .action {
            font-size: 0.32rem;
          }
          .input{
            height: 1.7rem!important;
          }
          .placeholder,.focus{
            padding: 0.3rem 0.3rem 0.3rem 0.15rem;
            position: relative;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 100%;
            text-align: left;
            overflow: hidden;
          }
          .input:empty::before{
            color: #BBBBBB;
            position: absolute;
            font-size:0.4rem;
            left:0.15rem;
            content:attr(placeholder);
          }
        }
        .info-row:after {
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
        }
        .info-row:last-of-type:after{
          height: 0;
        }
      }
    }
  }
</style>
