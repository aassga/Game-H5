<template>
  <div class="container theme-main-bg" v-if="isNoPay || !pageType">
    <img class="no-data" src="@src/assets/img/save/no-pay-tongdao.png" alt/>
  </div>
  <div class="container theme-main-bg" v-else ref="content">
    <div class="swiper-box theme-main-bg" v-if="$config.home!=='amhg'">
      <swiper :options="swiperOption" ref="swiper">
        <swiper-slide v-for="(url, i) in swiperList" :key="i">
          <img
            style="width: 100%;display: block"
            :src="url"
          />
        </swiper-slide>
      </swiper>
      <div v-show="swiperIndex !== swiperList.length - 1" class="swiper-button-next"></div> 
      <div v-show="swiperIndex !== 0" class="swiper-button-prev"></div> 
    </div>
    <div class="bank-form theme-main-bg">
      <div>
        <div class="amhg-bank-tit clearfix" v-if="$config.home==='amhg'">
          <p class="title fl">添加{{payName}}好友转账成功100%</p>
          <p class="jc fr" @click="$router.push('/save/help/'+payName+'转'+payName)">{{payName}}转{{payName}}教程></p>
        </div>
        <div class="bank-tit theme-color-white" v-else>添加{{payName}}好友转账成功100%</div>
        <div :class="['bank-list',{'newqpStyle':$config.newQP || $config.newQP}]">
          <div v-for="(item,i) in bankList" :key="i" :class="['bank-item',{'theme-border-1px':bankIndex === i},pageType]" @click="bankIndex = i">
            <img class="bank-icon" :src="require(`../../assets/img/save/TransferAccount/${pageType}-icon.png`)" alt="">
            <span class="bank-name">{{pageType === 'wx' ? '微信帐号' : '支付宝'}}</span>
          </div>
        </div>
      </div>
      <div class="scrollIntoViewBox">
        <input-row :class="{'grayColor no-border':$config.home==='amhg'}" :label="pageType === 'wx' ? '微信昵称:': '帐号姓名:'" :themeStyle="$config.newQP || $config.blackTheme || $config.blush">
          <div class="copy-row" slot="input">
          <p class="name selector-box user-select">{{bankList[bankIndex]['cardName']}}</p>
          <div :class="[$config.home==='amhg'?'theme-color':'theme-bg','copy','theme-gradient-bg']" @click="onCopy(bankList[bankIndex]['cardName'])">复制</div>
          </div>
        </input-row>
        <input-row :class="{'grayColor':$config.home==='amhg'}" :label="pageType === 'wx' ? '微信帐号:': '转账帐号:'" :themeStyle="$config.newQP || $config.blackTheme || $config.blush">
          <div class="copy-row" slot="input">
          <p class="name selector-box user-select">{{bankList[bankIndex]['cardNum']}}</p>
          <div :class="[$config.home==='amhg'?'theme-color':'theme-bg','copy','theme-gradient-bg']" @click="onCopy(bankList[bankIndex]['cardNum'])">复制</div>
          </div>
        </input-row>
        <div class="line" v-if="$config.home==='amhg'"></div>
        <input-row label="温馨提醒:"   :themeStyle="$config.newQP || $config.blackTheme || $config.blush">
          <div class="copy-row" slot="input">
          <p class="name selector-box user-select">{{bankList[bankIndex]['msgTitle']}}</p>
          </div>
        </input-row>
        <input-row v-keyBroayStates :themeStyle="$config.newQP || $config.blackTheme || $config.blush" ref="name" v-model="name" type="text" label="汇款昵称:" placeholder="请输入1-32位汇款昵称"></input-row>
        <input-row v-keyBroayStates :themeStyle="$config.newQP || $config.blackTheme || $config.blush" ref="amount" v-model="amount" max-len="10" type="tel" label="汇款金额:" :placeholder="'最少'+bankList[bankIndex]['min_amount']+'元'"></input-row>
        <input-row label="优惠比例:" :themeStyle="$config.newQP || $config.blackTheme || $config.blush" v-if="bonusList.length === 1">
          <div class="copy-row" slot="input">
            <p class="name user-select">{{bonus}}</p>
          </div>
        </input-row>
        <input-row
          v-if="bonusList.length > 1"
          v-model="bonus"
          label="优惠比例:"
          type="select"
          placeholder="请选择优惠比例"
          :data="bonusList"
          is-click
          :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
        ></input-row>
        <input-row style="height:0.02rem" v-if="$config.home==='amhg'"></input-row>
      </div>
    </div>
    <div :class="[{'amhg-save-submit':$config.home==='amhg'},'save-submit','theme-bg','theme-yellow-bg','theme-color-black']" @click="onSubmit">确认提交</div>
  </div>
</template>

<script type="text/javascript">
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from "vue-awesome-swiper";
import dayJs from 'dayjs'
export default {
  name: 'TransferAccount',
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    accountIcon() {

    }
  },
  data () {
    return {
      isNoPay: false,
      pageType: '',
      bankList: [],
      swiperList:[],
      swiperIndex: 0,
      swiperOption: {//swiper3
        autoplay: false,
        navigation: {
          nextEl: '.swiper-button-next', //前进按钮的css选择器或HTML元素。
          prevEl: '.swiper-button-prev', //后退按钮的css选择器或HTML元素。
          hideOnClick: true, //点击slide时显示/隐藏按钮
        },
        on:{
          slideChangeTransitionStart :(e) => {
            this.swiperIndex = this.$refs.swiper.swiper.realIndex
          }
        },
      },
      amount:'',
      name:'',
      bankIndex: 0,
      submitting: false,
      payName: '',
      bonus:"",
      bonusList: [],
    }
  },
  watch: {
    name(newVal,oldVal) {
      if (this.realLength(newVal) > 32) {
        this.$nextTick(()=> {
          this.name = this.realSubstring(newVal, 32);
        })
      }
    }
  },
  created () {
    if(this.title.includes('支付宝')) {
      this.pageType = 'zfb'
      this.payName = '支付宝'
    }else if(this.title.includes('微信')) {
      this.pageType = 'wx'
      this.payName = '微信'
    }
    this.$store.dispatch('user/getDepositBonusList', {depositType:'bank'}).then(res => {
      if(res.code === 200 && res.data.length) {
        res.data.forEach((item) => {
          let bonusItem = `${item.bonusRate}% (存款${item.multiple}倍打码)`
          bonusItem = bonusItem.replace('rate_','')
          this.bonusList.push(bonusItem)
        })
        this.bonus = this.bonusList[0]
      }
    }).catch(() => {
    })
    this.getBanksData()
    this.setSwiperList()
  },
  mounted() {
    setTimeout(() => {
      if(this.$refs.content && this.$refs.content.offsetHeight > window.innerHeight - 0.88 * this.rem) {
        this.$refs.name.$el.addEventListener('click',()=>{
          this.inputFocus()
        })
        this.$refs.amount.$el.addEventListener('click',()=>{
          this.inputFocus()
        })
      }
    }, 300);
  },
  methods: {
    inputFocus(){
      setTimeout(() => {
        if(this.$refs.content) {
          document.body.scrollTop = this.$refs.content.offsetHeight - window.innerHeight + 300
        }
      }, 300)
    },
    getBanksData() {
      this.$store.dispatch('user/getSaveBank', {
        classId: this.id,
        callback: res => {
          if (res.code === 200 && res.data.length) {
            this.bankList = res.data
          } else {
            this.isNoPay = true
          }
        }
      })
    },
    setSwiperList() {
      if(this.$config.newQP || this.$config.blackTheme) {
        if(this.pageType === 'zfb') {
          this.swiperList = [
            require('@src/assets/img/save/TransferAccount/qp-zfbzzfb-1.png'),
            require('@src/assets/img/save/TransferAccount/qp-zfbzzfb-2.png'),
            require('@src/assets/img/save/TransferAccount/qp-zfbzzfb-3.png'),
            require('@src/assets/img/save/TransferAccount/qp-zfbzzfb-4.png'),
            require('@src/assets/img/save/TransferAccount/qp-zfbzzfb-5.png'),
          ]
        }else if(this.pageType === 'wx') {
          this.swiperList = [
            require('@src/assets/img/save/TransferAccount/qp-wxzwx-1.png'),
            require('@src/assets/img/save/TransferAccount/qp-wxzwx-2.png'),
            require('@src/assets/img/save/TransferAccount/qp-wxzwx-3.png'),
            require('@src/assets/img/save/TransferAccount/qp-wxzwx-4.png'),
            require('@src/assets/img/save/TransferAccount/qp-wxzwx-5.png'),
          ]
        }
      }else if(this.$config.blush){
           if(this.pageType === 'zfb') {
          this.swiperList = [
            require('@src/assets/img/save/TransferAccount/blush-zfb-1.png'),
            require('@src/assets/img/save/TransferAccount/blush-zfb-2.png'),
            require('@src/assets/img/save/TransferAccount/blush-zfb-3.png'),
            require('@src/assets/img/save/TransferAccount/blush-zfb-4.png'),
            require('@src/assets/img/save/TransferAccount/blush-zfb-5.png'),
          ]
        }else if(this.pageType === 'wx') {
          this.swiperList = [
            require('@src/assets/img/save/TransferAccount/blush-wx-1.png'),
            require('@src/assets/img/save/TransferAccount/blush-wx-2.png'),
            require('@src/assets/img/save/TransferAccount/blush-wx-3.png'),
            require('@src/assets/img/save/TransferAccount/blush-wx-4.png'),
            require('@src/assets/img/save/TransferAccount/blush-wx-5.png'),
          ]
        }
      }else {
        if(this.pageType === 'zfb') {
          this.swiperList = [
            require('@src/assets/img/save/TransferAccount/zfbzzfb-1.png'),
            require('@src/assets/img/save/TransferAccount/zfbzzfb-2.png'),
            require('@src/assets/img/save/TransferAccount/zfbzzfb-3.png'),
            require('@src/assets/img/save/TransferAccount/zfbzzfb-4.png'),
            require('@src/assets/img/save/TransferAccount/zfbzzfb-5.png'),
          ]
        }else if(this.pageType === 'wx') {
          this.swiperList = [
            require('@src/assets/img/save/TransferAccount/wxzwx-1.png'),
            require('@src/assets/img/save/TransferAccount/wxzwx-2.png'),
            require('@src/assets/img/save/TransferAccount/wxzwx-3.png'),
            require('@src/assets/img/save/TransferAccount/wxzwx-4.png'),
            require('@src/assets/img/save/TransferAccount/wxzwx-5.png'),
          ]
        }
      }
    },
    onSubmit () {
      let data = this.bankList[this.bankIndex]
      if (this.submitting) {
        this.toastText('正在提交,请稍等~~~')
      }else if(this.name.replace(/[^\x00-\xff]/g,"01").length < 1 || this.name.replace(/[^\x00-\xff]/g,"01").length > 32) {
        this.toastText('请输入1-32位汇款昵称')
      }else if (isNaN(parseFloat(this.amount))) {
        this.toastText('请输入有效的金额')
      } else if (parseFloat(this.amount) < parseFloat(data['min_amount'])) {
        this.toastText('支付金额不能小于' + data['min_amount'] + '元')
      } else if (parseFloat(this.amount) > parseFloat(data['max_amount'])) {
        this.toastText('支付金额不能大于' + data['max_amount'] + '元')
      } else if(this.bonusList.length && !this.bonus) {
        this.toastText("请选择优惠比例", "top");
      } else {
        this.submitting = true
        this.$store.state.main.loadingText = '正在提交...'
        let submitData = {
          amount : this.amount,
          bankId: data.cardNum,
          classId: data.classId,
          port: 'h5',
          bankName: data.bankName,
          bankAccountName: data.cardName,
          depositRealName: this.name,
          className: data.className,
          bankSerialNumber: '',
          depositId: data.id,
          depositTime: dayJs().format('YYYY-MM-DD HH:mm:ss'),
        }
        if(this.bonusList.length) {
          submitData['bonusRate'] = this.bonus.split(' ')[0].replace('%','')
        }
        this.$store.dispatch('user/transferAccount', submitData).then(res => {
          this.submitting = false
          this.$store.state.main.loadingText = ''
          if (res.code === 200) {
            this.toastText('提交成功,等待管理员审核')
            this.name = ''
            this.amount = ''
            if(this.bonusList.length) {
              this.bonus = this.bonusList[0]
            }
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
    },
    onCopy (str) {
      this.$copyText(str).then(e => {
        this.toastText('复制成功')
      }, e => {
        this.toastText('请手动复制或使用其他浏览器尝试')
      })
    },
    realLength (str) {
      return str.replace(/[^\x00-\xff]/g, "**").length;
    },
    realSubstring (str,n){
        if(this.realLength(str)<=n){return this;}
        var m=Math.floor(n/2);
        for(var i=m;i<str.length;i++){
            if(this.realLength(str.substr(0,i))>=n){
                return str.substr(0,i)
            }
        }
        return str;
    },
  },
}
</script>

<style lang="less" type='text/less' scoped>
  .container {
    width: 100%;
    padding: 0;
    box-sizing: border-box;
    padding-bottom: 0.5rem;
    .no-data {
      width: 35%;
      display: block;
      margin: 0 auto;
      padding-top: 2rem;
      box-sizing: border-box;
    }
    .swiper-box {
      position: relative;
      padding: 0.14rem 0.05rem 0;
      background-color: #fff;
      /deep/ .swiper-button-prev{
        width: .45rem;
        height: .47rem;
        background-image: url('../../assets/img/save/TransferBank/previous-btn.png');
        left: .56rem;
      }
      /deep/ .swiper-button-next{
        width: .45rem;
        height: .47rem;
        background-image: url('../../assets/img/save/TransferBank/next-btn.png');
        right: .56rem;
      }
    }
    .bank-form{
      background-color: #fff;
      overflow: hidden;
      .pay-text {
        height: 1rem;
        line-height: 1rem;
        font-size: 0.34rem;
        text-align: left;
        padding-left: 0.3rem;
      }
      .bank-tit {
        padding-left: 0.3rem;
        font-size: 0.349rem;
        color: #333;
        text-align: left;
      }
      .amhg-bank-tit {
        padding:0.35rem 0.32rem 0.35rem 0.3rem;
        font-size: 0.349rem;
        color: #333;
        text-align: left;
        .title {
          font-size: 0.32rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #333333;
        }
        .jc {
          font-size: 0.24rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #E9B741;
          margin-top:0.05rem;
        }
      }
      .bank-list {
        padding: 0.14rem 0.27rem 0;
        overflow: hidden;
        .bank-item {
          position: relative;
          float: left;
          width: 2.2rem;
          height: .8rem;
          line-height: 0.76rem;
          background:rgba(238,238,238,1);
          border-radius:0.1rem;
          margin-left: 0.16rem;
          padding-left: 0.72rem;
          box-sizing: border-box;
          border: 0.02rem solid transparent;
          margin-bottom: 0.27rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.32rem;
          &:first-child {
            margin-left: 0;
          }
          &:nth-child(3n + 1) {
            margin-left: 0;
          }
          .bank-icon {
            position: absolute;
            top: 0.12rem;
            width: 0.54rem;
          }
          .bank-name {
            text-align: left;
            line-height: 0.28rem;
          }
          &.wx {
            .bank-icon {
              left: 0.14rem;
            }
          }
          &.zfb {
            .bank-icon {
              left: 0.32rem;
            }
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
      .grayColor {
        /deep/.label {
          color:#A3A5B3;
        }
      } 
      .no-border {
        &::after {
          display:none;
        }
      }
      .redColor {
        /deep/.label {
          color:#FF2100;
        }
      }
      .line {
        height:0.2rem;
        background:#f6f6f6;
      }
    }
    .save-submit {
      width: 7rem;
      margin: 0.3rem 0.25rem 0;
      height: 0.88rem;
      display: block;
      font-size: .36rem;
      color: #FFFFFF;
      line-height: 0.88rem;
    }
    .amhg-save-submit {
      width: 6.42rem;
      height: 0.86rem;
      margin:0.5rem auto;
      border-radius: 0.43rem;
    }
  }
</style>
