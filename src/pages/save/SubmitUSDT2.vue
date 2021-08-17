<template>
  <div class="content" ref="content">
    <div class="usdt-submit" v-if="isNoPay">
      <img class="no-data" :src="require('@src/assets/img/no-pay-tongdao.png')" alt />
    </div>
    <div :class="['usdt-submit','theme-header-bg',{'newQP-box' : $config.newQP || $config.blackTheme},{'blush-box':$config.blush}]" v-else>
      <div class="pay-channels theme-main-bg" v-if="list && list.length > 1">
        <p class="channels theme-color-white">选择支付通道</p>
        <van-tabs v-model="usdtIndex" :line-height='0' :swipe-threshold="3" sticky class="pay-tabs theme-main-bg theme-after-border-nocolor">
          <van-tab v-for="(port, i) in list" :key="i">
              <template #title> 
                <p class="tit theme-color-white">通道{{replaceReg(i)}}</p>
                <img :src="payImg" class="item-icon" v-if="usdtIndex === i">
              </template>
          </van-tab>
        </van-tabs> 
      </div>
        <div class="help-area theme-main-bg">
          <div class="left-area">
            <p class='tit theme-color-white'>USDT收款二维码</p>
            <img :src="targetusdt.qrCodeImg" class="ewm">
            <p class="txt theme-color-yellow">截屏或长按二维码保存</p>
            <p class="desc theme-color-gray-1">请使用APP扫描付款</p>
          </div>
          <div class="right-area">
            <p class='tit theme-color-white'>转账教程</p>
            <a class="link-item" href="/static/public/active/hb/m/index.html" target="_blank">
              <span class="item-name theme-color-white">火币APP转账教程</span>
              <i class="item-icon icon iconfont h5-icon-left-menu-ico"></i>
            </a>
            <a class="link-item" href="/static/public/active/hb/m/index.html " target="_blank">
              <span class="item-name theme-color-white">imToken转账教程</span>
              <i class="item-icon icon iconfont h5-icon-left-menu-ico"></i>
            </a>
            <a class="link-item theme-border-color-yellow" href="https://m.huobi.vc/zh-cn/" target="_blank">
              <span class="item-name color-red theme-color-yellow">火币交易平台</span>
              <i class="item-icon icon iconfont h5-icon-left-menu-ico"></i>
            </a>
            <a class="link-item theme-border-color-yellow" href="https://www.binance.com/cn/" target="_blank">
              <span class="item-name color-red theme-color-yellow">币安交易平台</span>
              <i class="item-icon icon iconfont h5-icon-left-menu-ico"></i>
            </a>
          </div>
        </div>
        <div class="usdt-area">
          <div class="scroll-box">
            <div class="usdt-list">
              <div class="usdt-item theme-main-bg">
                <div class="address-box">
                <span class="address theme-color-white">USDT收款地址</span>  
                <span class="code theme-color-gray">{{targetusdt.address}}</span>  
                </div> 
                <div class="link" @click="onCopy(targetusdt.address)">
                  <i class="icon iconfont h5-icon-lianjie theme-color theme-color-yellow"></i>
                  <div class="txt theme-color-white">复制地址</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="input-area theme-main-bg scrollIntoViewBox" v-if="targetusdt">
          <input-row
            v-keyBroayStates
            ref="bankSerialNumber"
            v-model="bankSerialNumber"
            type="text"
            label="区块链交易ID:"
            placeholder="请输入后六位"
            @input="bankSerialNumberKeyup"
            :maxLen="'6'"
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>
          <input-row
            v-keyBroayStates
            ref="usdtNumber"
            v-model="usdtNumber"
            type="number"
            label="货币数量:"
            @input="usdtNumberKeyup"
            :placeholder="'最小充值数量'+ targetusdt['min_usdt_count']"
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>
          <input-row label="存款汇率:" :themeStyle="$config.newQP || $config.blackTheme || $config.blush">
            <div class="copy-row" slot="input">
              <p :class="['txt',usdtNumber || bankSerialNumber? 'theme-color-white' : 'gray']">{{targetusdt && targetusdt['usdtDepositRate']}}</p>
            </div>
          </input-row>
          <input-row label="转账金额:" :themeStyle="$config.newQP || $config.blackTheme || $config.blush">
            <div class="copy-row" slot="input">
              <p :class="['txt',usdtNumber || bankSerialNumber? 'theme-color-white' : 'gray']">{{amount}}</p>
            </div>
          </input-row>
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
        </div>
      <button
        type="button"
        class="save-submit theme-bg theme-yellow-bg theme-color-black"
        :disabled="submitting"
        @touchstart.capture="onSubmit($event)"
      >
        <template v-if="submitting">正在提交...</template>
        <template v-else>确认提交</template>
      </button>
      <p class="info">温馨提示：使用数字货币存取款，避免银行流水过大被风控，大额娱乐首选！</p>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "SubmitUSDT",
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
  data() {
    return {
      submitting: false,
      list: [],
      isNoPay: false,
      usdtIndex: 0,
      bankSerialNumber: '',
      amount: "0.00",
      usdtNumber: '',
      targetusdt: null,
      bonus:"",
      bonusList: [],
    };
  },
  computed: {
    payImg () {
      let bgTheme = this.$store.state.main.theme
      if(this.$config.newQP || this.$config.blackTheme) {
        return require(`../../assets/img/save/payment/pay_yellow.png`)
      }else {
        return require(`../../assets/img/save/payment/pay_${bgTheme}.png`)
      }
    }
  },
  created() {
    this.$store.dispatch("user/getSaveUsdt", {
      classId: this.id,
      callback: res => {
        if (res.code === 200) {
          this.list = res.data;
          if (this.list.length) {
            this.targetusdt = this.list[0]
            this.usdtIndex = 0
          } else {
            this.isNoPay = true;
          }
        } else {
          this.list = [];
          this.isNoPay = true;
        }
      }
    });
    this.$store.dispatch('user/getDepositBonusList', {depositType:'usdt'}).then(res => {
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
  },
  watch: {
    usdtIndex (val,old) {
      this.targetusdt = this.list[val]
    },
  },
  mounted() {
  },
  methods: {
    replaceReg(reg){ 
      let arr=new Array("一","二","三","四","五","六","七","八","九",'十','十一','十二','十三','十四','十五'); 
      return arr[reg]
    },
    onCopy(str) {
      this.$copyText(str).then(
        e => {
          this.toastText("复制成功", "top");
        },
        e => {
          this.toastText("请手动复制或使用其他浏览器尝试", "top");
        }
      );
    },
    onSubmit(el) {
      el.target.focus();
      let moneyExp = /^\d+(\.\d{1,2})?$/;
      if (this.submitting) {
        this.toastText("正在提交,请稍等~~~", "top");
      } else if (!this.bankSerialNumber || this.bankSerialNumber.length !== 6) {
        this.toastText("请输入区块链交易ID后六位", "top");
      } else if (!this.usdtNumber.length) {
        this.toastText("请输入货币数量", "top");
      } else if (Number(this.usdtNumber) < Number(this.targetusdt['min_usdt_count'])) {
        this.toastText(`最小充值数量${this.targetusdt['min_usdt_count']}`, "top");
      } else if(this.bonusList.length && !this.bonus) {
        this.toastText("请选择优惠比例", "top");
      } else {
        this.submitting = true;
        let submitData = {
          device: "h5",
          depositId: this.targetusdt['id'],
          classId: this.targetusdt['classId'],
          className: this.targetusdt['className'],
          bankId: this.targetusdt['address'],
          bankSerialNumber: this.bankSerialNumber,
          usdt_count: this.usdtNumber,
        }
        if(this.bonusList.length) {
          submitData['bonusRate'] = this.bonus.split(' ')[0].replace('%','')
        }
        this.$store
          .dispatch("user/saveSubmitByUsdt", submitData)
          .then(res => {
            setTimeout(() => {
              this.submitting = false;
            }, 5000);
            setTimeout(() => {
              if(this.bonusList.length) {
                this.bonus = this.bonusList[0]
              }
            }, 500);
            if (res.code === 200) {
              setTimeout(() => {
                this.toastText("提交成功,等待管理员审核", "top");
                this.amount =  "0.00"
                this.bankSerialNumber = ''
                this.usdtNumber = ''
              }, 500);
            } else if (res.message) {
              setTimeout(() => {
                this.amount =  "0.00"
                this.bankSerialNumber = ''
                this.usdtNumber = ''
                this.toastText(res.message, "top");
              }, 500);
            } else if (res.msg) {
              setTimeout(() => {
                this.amount =  "0.00"
                this.bankSerialNumber = ''
                this.usdtNumber = ''
                this.toastText(res.msg, "top");
              }, 500);
            }
          })
          .catch(() => {
            setTimeout(() => {
              this.submitting = false;
            }, 500);
          });
      }
    },
    bankSerialNumberKeyup() {
      this.$nextTick(()=>{
        this.bankSerialNumber = this.bankSerialNumber.replace(/[^\w_]/g,'');
      })
    },
    usdtNumberKeyup() {
      this.$nextTick(()=>{
        this.usdtNumber = this.usdtNumber.replace(/^\D*(\d{0,7}(?:\.\d{0,4})?).*$/g, '$1');
        this.amount = Math.round((Number(this.usdtNumber) * Number(this.targetusdt['usdtDepositRate'])) * 100) / 100 + ''
      })
    },
  }
};
</script>

<style lang="less" type='text/less' scoped>
.usdt-submit {
  width: 100%;
  padding: 0;
  margin: 0;
  height: 100%;
  .help-area {
    background-color: #fff;
    width: 100%;
    overflow: hidden;
    .left-area, .right-area {
      width: 50%;
      float: left;
      .tit {
        color: #333333;
        font-size: 0.34rem;
        margin: 0.37rem auto 0.21rem;
      }
      &.left-area {
        position: relative;
        overflow: hidden;
        .ewm {
          width: 2.58rem;
          height: 2.58rem;
          margin-bottom: 0.24rem;
          -webkit-touch-callout: default;
          -webkit-user-select: none;
          -moz-user-select: none;
          -webkit-user-select: none;
          -o-user-select: none;
          user-select: none;
        }
        .txt {
          color: #060EB5;
          font-size: 0.2rem;
        }
        .desc {
          font-size: 0.16rem;
          color: #414141;
          margin-bottom: 0.22rem;
        }
        &::after {
          position: absolute;
          box-sizing: border-box;
          content: " ";
          right: 0;
          top: 7%;
          width: 0.02rem;
          height: 86%;
          background-color: #DDDDDD;
        }
      }
      &.right-area {
        .link-item {
          display: block;
          width: 3.15rem;
          border-bottom: 0.02rem solid #DDDDDD;
          position: relative;
          margin: 0 auto 0.25rem;
          text-align: left;
          height: 0.55rem;
          line-height: 0.55rem;
          font-weight: bold;
          .item-name {
            display: block;
            height: 0.55rem;
            line-height: 0.55rem;
            color: #333333;
            font-size: 0.3rem;
            &.color-red {
              color: #F63131;
              font-size: 0.34rem;
            }
          }
          .item-icon {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            color: #7C7C7C;
          }
        }
      }
    }
  }
  .pay-channels {
    overflow: hidden;
    background-color: #fff;
    margin-bottom: 0.2rem;
    .channels {
      margin-top: 0.3rem;
      margin-left: 0.2rem;
      font-size: 0.32rem;
      color: #333;
      text-align: left;
      font-weight: bold;
    }
    .pay-tabs {
      position: unset;
      margin-bottom: 0.1rem;
      /deep/.van-tabs__wrap {
        position: unset;
        height: 1.12rem !important;
        .van-tabs__nav {
          padding-left: 0;
          padding-right: 0.14rem;
          box-sizing: border-box;
          background-color: transparent;
          :nth-last-child(2){
            margin-right: 0 !important;
          }
          .van-tab__text {
            display: block;
            width: 100%;
            height: 100%;
            -webkit-line-clamp: inherit;
          }
          .van-tab {
            width: 2.2rem;
            max-width: 2.2rem;
            min-width: 2.2rem;
            height: 0.8rem;
            border-radius: 0.1rem;
            margin-right: 0.14rem;
            margin-top: 0.14rem;
            padding: 0;
            box-sizing: border-box;
            background-color: #F9F9F9;
            position:relative;
            border: 0.02rem solid #ebedf0;
            &.van-tab--active {
              background-color: #fff;
            }
            &:first-child {
              margin-left: 0.14rem;
            }
            .tit {
              font-size: 0.32rem;
              width: 100%;
              height: 0.8rem;
              line-height: 0.8rem;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
              font-weight: normal;
              color: #333;
            }
            .txt {
              width: 100%;
              height: 0.4rem;
              line-height: 0.4rem;
              font-size: 0.24rem;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
              transform: scale(0.94);
              color: #525252;
              font-weight: normal;
            }
            .item-icon {
              position: absolute;
              top: 0;
              right: -0.01rem;
              width: 0.38rem;
              height: 0.31rem;
            }
          }
        }
        .van-tabs__line {
          width: 1.4rem;
        }
      }
    }
    /deep/ .van-ellipsis {
      display: inline-block !important;
    }
  }

  .usdt-area {
    width: 100%;
    height: 2.1rem;
    padding: 0.2rem 0;
    box-sizing: border-box;
    .scroll-box {
      width: 100%;
      height: 100%;
      .usdt-list{
        width: auto;
        min-width: 100%;
        height: 100%;
        .usdt-item {
          position: relative;
          width: 100%;
          height: 1.69rem;
          padding: 0;
          background-color: #fff;
          overflow: hidden;
          padding-top: 0.38rem;
          .address-box {
            font-size: 0.3rem;
            margin-left: 0.32rem;
            width: 73%;
            text-align: left;
            float: left;
            .address {
              display: block;
              color: #333333;
              font-size: 0.32rem;
              line-height: 0.28rem;
              font-weight: bold;
            }
            .code {
              display: block;
              font-size: 0.3rem;
              color: #484848;
              height: 0.3rem;
              line-height: 0.28rem;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
              margin-top: 0.36rem;
            }
          }
          .link,.qr-code {
            height: 0.88rem;
            float: left;
            .icon {
              font-size: 0.44rem;
              margin-top: -0.04rem;
            }
            .txt {
              width: 100%;
              height: 0.4rem;
              line-height: 0.4rem;
              text-align: center;
              font-size: 0.28rem;
              margin-top: 0.14rem;
              font-weight: bold;
            }
          }
          .link, .qr-code{
            display: flex;
            flex-direction: column;
          }
          .link {
            margin-left: 0.23rem;
          }
          .qr-code {
            margin-left: 0.22rem;
          }
        }
      }
    }
  }

  .input-area {
    background-color: #fff;
    .copy-row {
      flex: 1;
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;

      .txt {
        font-size: 0.3rem;
        color: #333;
        text-align: left;
        flex: 1;
        user-select: all !important;
        &.gray {
          color: #A8AAB7;
        }
      }
    }
    .name {
      font-size: 0.3rem;
      color: #333;
      text-align: left;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      -webkit-user-select: all !important;
      -moz-user-select: all !important;
      -ms-user-select: all !important;
      user-select: all !important;
    }
  }

  .save-submit {
    width: 7rem;
    margin: 0.25rem;
    height: 0.9rem;
    display: block;
    font-size: 0.36rem;
    color: #ffffff;
    line-height: 0.9rem;
  }

  .info {
    color: #575e68;
    font-size: 0.28rem;
    padding: 0.2rem 0.3rem 0.4rem 0.3rem;
    line-height: 0.36rem;
    text-align: justify;
  }

  .no-data {
    width: 35%;
    display: block;
    margin: 2rem auto;
    box-sizing: border-box;
  }
  &.newQP-box {
      [class*=van-hairline]::after {
        border-bottom: none !important;
        border: none !important;
      }
      /deep/ [class*=van-hairline]::after {
        border-bottom: none !important;
        border: none !important;
      }
      /deep/.van-tabs__wrap {
        .van-tab {
          color: #fff !important;
          background: linear-gradient(180deg, #181818, #0C0C0C) !important;
          border: 0.02rem solid #383838 !important;
          background-color: #000 !important;
          .van-tab__text {
            color: #fff !important;
          }
          &.van-tab--active {
            border: 0.02rem solid #E5B802 !important;
            .van-tab__text{
              color: #F6D033 !important;
            }
          }
        }
      }
    }
    &.blush-box {
      [class*=van-hairline]::after {
        border-bottom: none !important;
        border: none !important;
      }
      /deep/ [class*=van-hairline]::after {
        border-bottom: none !important;
        border: none !important;
      }
      /deep/.van-tabs__wrap {
        .van-tab {
          color: #fff !important;
           background: linear-gradient(180deg, #72010B, #98010E) !important;
           border: 0.02rem solid #999 !important;
           background-color: #72010B!important;
          .van-tab__text {
            color: #fff !important;
          }
          &.van-tab--active {
            border: 0.02rem solid #E5B802 !important;
            .van-tab__text{
              color: #F6D033 !important;
            }
          }
        }
      }
    }
}
</style>

