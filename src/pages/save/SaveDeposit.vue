<template>
    <view-page>
        <title-header :title="'存款'" slot="header"></title-header>
        <div style="width: 100%;box-sizing: border-box" slot="content">
            <div class="bank-submit">
                <div class="bank-submit bank-info" style="background-color: #FFFFFF">
                  <p class="help-title">收款银行卡</p>
                  <div class="clear-fix help-box">
                      <img class="bank-icon" :src="kindsInfo.cardImg" alt/>
                      <span class="bank-name">{{kindsInfo.bankName}}</span>-<span class="bank-name">{{kindsInfo.cardName}}</span>
                  </div>
                  <input-row label="账  户">
                      <div class="copy-row" slot="input">
                      <p class="name selector-box user-select">{{kindsInfo.cardNum}}</p>
                      <a href="javascript:void(0)" class="copy theme-bg" @click="onCopy(kindsInfo.cardNum)">复制</a>
                      </div>
                  </input-row>
                  <input-row label="持卡人">
                      <div class="copy-row" slot="input">
                      <p class="name selector-box user-select">{{kindsInfo.cardName}}</p>
                      <a href="javascript:void(0)" class="copy theme-bg" @click="onCopy(kindsInfo.cardName)">复制</a>
                      </div>
                  </input-row>
                  <input-row label="开户行">
                      <div class="copy-row" slot="input">
                      <p class="name selector-box user-select">{{kindsInfo.bankName}}</p>
                      <a href="javascript:void(0)" class="copy theme-bg" @click="onCopy(kindsInfo.bankName)">复制</a>
                      </div>
                  </input-row>
                </div>
                <div  class="bank-submit" style="background-color: #FFFFFF; margin-top:0.23rem">
                   <p class="help-title">汇款方</p>
                   <input-row label="存款金额:">
                        <div class="copy-row" slot="input">
                        <p class="name selector-box user-select" style="color:#FF1012">{{ $route.query.amount}}</p>
                        </div>
                   </input-row>
                   <input-row ref="name" v-model="kindsInfo.depositRealName" type="text" label="存款凭证:" :maxLen="'15'" :placeholder="kindsInfo.className.substr(0,kindsInfo.className.length-1).includes('微信')? '请填写到账时间例：13:18':'填写姓名或卡号后四位'" autofocus=”autofocus></input-row>
                </div>
                <a class="bank-teacher theme-color" :href='helpLink'>{{ kindsInfo.className.substr(0,kindsInfo.className.length-1) }}银行卡教程</a>
                <p class="bank-money">汇款金额：<span>{{ $route.query.amount }}</span>元</p>
                <a href="javascript:void(0)" class="save-submit theme-bg" @click="onSubmit">已向对方转账{{ $route.query.amount }}元</a>
                <p class="submit-info">请在转账完成后再确认转账，我们将在十分钟内确认</p>

                <p class="info">提示：以上银行帐号限本次存款使用，帐号不定期更换！每次存款前请依照本页所显示的银行帐号入款！如入款至已过期帐号，无法查收，本公司恕不负责！</p>
            </div>
        </div>
    </view-page>
</template>

<script type="text/javascript">

import dayJs from 'dayjs'

export default {
  name: 'SaveDeposit',
  data () {
    return {
      submitting: false,
      kindsInfo:{},
    }
  },
  created () {
    let _this = this;
    this.$store.dispatch('user/getSaveBank', {
      classId: _this.$route.query.classId,
      id: _this.$route.query.id,
      callback: res => {
        if (res.code === 200) {
          _this.kindsInfo = res.data[0]
        } else {
          _this.kindsInfo = []
          _this.toastText(res.message,'top')
        }
      }
    })
  },
  methods: {
    onCopy (str) {
      this.$copyText(str).then(e => {
        this.toastText('复制成功')
      }, e => {
        this.toastText('请手动复制或使用其他浏览器尝试')
      })
    },
    onSubmit () {
      let  regZfb = /^[\u4e00-\u9fa5(·|•)a-zA-Z0-9]+$/;
      let  regWX =  /^[\u4e00-\u9fa5(:|：)a-zA-Z0-9]+$/;
      if (this.submitting) {
        this.toastText('正在提交,请稍等~~~')
      } else if (!this.kindsInfo || !this.kindsInfo.depositRealName  || this.kindsInfo.depositRealName.length<2) {
        this.toastText('请输入存款凭证')
      } else if(this.kindsInfo.className.substr(0,this.kindsInfo.className.length-1).includes('微信') &&  !(regWX.test(this.kindsInfo.depositRealName))){
        this.toastText('请输入正确的存款凭证')
      } else if(this.kindsInfo.className.substr(0,this.kindsInfo.className.length-1).includes('支付宝') && !(regZfb.test(this.kindsInfo.depositRealName))){
         this.toastText('请输入正确的存款凭证')
      } else {
        this.submitting = true
        this.$store.state.main.loadingText = '正在提交...'
        let data = {
          amount: this.$route.query.amount,
          depositId: this.kindsInfo.id,
          bankId: this.kindsInfo.cardNum,
          bankName: this.kindsInfo.bankName,
          bankAccountName: this.kindsInfo.cardName,
          className: this.kindsInfo.className,
          bankSerialNumber: '',
          depositRealName: this.kindsInfo.depositRealName,
          depositTime: dayJs().format('YYYY-MM-DD HH:mm:ss'),
          classId: this.kindsInfo.classId,
          port: 'h5'
        }
        this.$store.dispatch('user/saveSubmitByWxOrZfb', data).then(res => {
          this.submitting = false
          this.$store.state.main.loadingText = ''
          if (res.code === 200) {
            this.toastText('提交成功,等待管理员审核')
            this.type = ['网银转帐']
            this.name = ''
            this.amount = ''
            this.$router.back()
          } else if (res.message) {
            this.toastText(res.message)
          } else if (res.msg) {
            this.toastText(res.msg)
          }
        }).catch(() => {
          this.submitting = false
          this.$store.state.main.loadingText = ''
        })
      }
    }
  },
  computed :{
    helpLink () {
      return this.kindsInfo.className.substr(0,2)==='微信' ? '#/save/help/wx' : '#/save/help/zfb'
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .submit-info{
    text-align: left;
    font-size: 0.28rem;
    color: #FF8600;
    padding-left: 0.3rem;
  }
  .bank-teacher{
    padding-left: 0.3rem;
    font-size: 0.3rem;
    margin-top: 0.24rem;
    text-align: left;
    // color: @theme-color;
    display: block;
  }
  .bank-money{
    padding-left: 0.3rem;
    font-size: 0.3rem;
    margin-top: 1.2rem;
    text-align: left;
    >span{
      color: #FF1012;
    }
  }
  .bank-info{
    /deep/ .label{
      text-align-last: justify !important;
      text-align: justify !important;
      text-align:justify !important;
      text-justify:distribute-all-lines !important;/*ie6-8*/
      text-align-last:justify !important;/* ie9*/
      -moz-text-align-last:justify !important; /*ff*/
      -webkit-text-align-last:justify !important;/*chrome 20+*/
      width: 1rem;
      margin-right: 0.2rem !important;
      position: relative;
      top: 0.24rem;
      &:before{
        right: -0.1rem;
        content: ':';
        position: absolute;
      }
      &:after{
        content: '';
        width: 100%;
        display: inline-block;
      }
    }
  }
  .bank-submit {
    width: 100%;
    padding: 0;
    margin: 0;
    height: 100%;
  
    .help-title {
      padding: 0.24rem 0.3rem;
      font-size: 0.349rem;
      color: #333;
      text-align: left;
    }

    .help-box {
      width: 7.1rem;
      margin: 0 auto;
      line-height: 0.8rem;
      background-color: #EEEEEE;
      border-radius: 0.1rem;
      box-sizing: border-box;
      margin-bottom: 0.25rem;
      padding:  0 0.1rem;
      display: flex;
      align-items: center;
      font-size: 0.26rem;
      color: #2c3e50;
      img{
          height: 0.54rem;
          margin-right: 0.1rem;
      }
      .help-active {
        font-size: 0.26rem;
        color: #060eb5;
      }
    }

    .bank-list {
      width: 7.1rem;
      margin: 0 auto;
      display: block;
      box-sizing: border-box;

      .bank-item {
        width: 2.2rem;
        float: left;
        background-color: #eee;
        border: 1px solid #eee;
        box-sizing: border-box;
        height: 0.8rem;
        margin-right: 0.25rem;
        margin-bottom: 0.25rem;
        border-radius: 0.1rem;
        display: flex;
        justify-content: start;
        align-items: center;

        &:nth-child(3n) {
          margin-right: 0;
        }

        &.active {
          border: 1px solid #4d8ffa;
        }

        .bank-icon {
          width: 0.54rem;
          margin: 0 0.1rem;
          display: inline-block;
        }
      }
    }

    .copy-row {
      flex: 1;
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;

      .name {
        font-size: 0.32rem;
        color: #333;
        text-align: left;
        flex: 1;
        user-select: all !important;
      }

      .copy {
        margin-right: 0.2rem;
        display: block;
        width: 0.8rem;
        height: 0.6rem;
        // background-color: @theme-color;
        color: #fff;
        border-radius: 0.1rem;
        line-height: 0.6rem;
        font-size: 0.26rem;
      }
    }

    .save-submit {
      width: 7rem;
      margin: 0.25rem;
      // background-color: @theme-color;
      height: 0.88rem;
      display: block;
      font-size: .36rem;
      color: #FFFFFF;
      line-height: 0.88rem;
    }

    .info {
      color: #575e68;
      font-size: .28rem;
      padding: .2rem .3rem 0.4rem 0.3rem;
      line-height: .36rem;
      text-align: justify;
    }

    .no-data {
      width: 35%;
      display: block;
      margin: 0 auto;
      padding-top: 2rem;
      box-sizing: border-box;
    }
  }
</style>
