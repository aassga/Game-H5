<template>
  <view-page class="YuEBao-roll theme-main-bg-5" full-box>
    <title-header :title="'余额宝' + rollText" slot="header" class="theme-header-bg theme-header-bottom">
    </title-header>
    <div class="content" slot="content">
      <div class="view-box theme-header-bg">
        <p class="info-row theme-after-border-color">
          <span class="label theme-color-white">{{rollText}}金额：<span style="color:#E71414">{{rollType === 'IN' ? (amount*1).toFixed(2) : (balance*1).toFixed(2)}}</span>元</span>
        </p>
        <p class="info-row input-row theme-after-border-color">
          <span class="rmb theme-color-white">￥</span>
          <input v-model="money" v-keyBroayStates class="input change-money theme-color-white" type="number" :placeholder="rollType === 'IN' ? (amount*1).toFixed(2) : (balance*1).toFixed(2)">
          <a class="action theme-color theme-color-yellow" @click="money = rollType === 'IN' ? (amount*1).toFixed(2) : (balance*1).toFixed(2)">全部</a>
        </p>
        <div class="no-amount theme-color-gray-7" v-if="parseFloat(notAmount)">
          有{{(notAmount*1).toFixed(2)}}元不能转入余额宝
        </div>
      </div>
      <div class="submit-btn theme-bg theme-yellow-bg-2 theme-color-black" @click="onSubmit">确认{{rollText}}</div>
      <div class="explain-text theme-color-gray-7" v-if="rollType === 'IN'">
        说明：可提现金额才能转入，有打码要求的金额不能转入
      </div>
    </div>
     <div slot="static">
      <ios-alert v-model="showAlert" :width="5.5" ref="rollAlertRef" class="roll-alert" :ok-callback="hideAlert" ok-text="确定" :showNo='false'>
        <div class="roll-content" slot="content">
          <img src="../../../assets/img/user/YuEBao/success-icon.png" class="success-icon"> 
          <p class="success-tetx theme-color-white">{{msg}}</p>
          <p v-if="rollType === 'IN'" class="tip-text theme-color-gray">10分钟后开始享受收益</p>
        </div>
      </ios-alert>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'YuEBaoRoll',
  data () {
    return {
      rollType: '',
      rollText: '',
      money: '',
      submitting: false,
      balance: '',
      amount: '',
      notAmount: '',
      showAlert: false,
      msg: '',
    }
  },
  watch:{
    money(val){
      if(this.money && this.money.toString()=='0'){
        this.money=null
      }
    }
  },
  created() {
    this.rollType = this.$route.params.type
    this.rollText = this.rollType === 'IN' ? '转入' : '转出'
    if(this.rollType === 'OUT') this.getYuEBaoBalance()
    if(this.rollType === 'IN') {
      this.$store.dispatch("user/setBalanceToLocal").then();
      this.getWithdrawAmount()
    }
  },
  mounted(){
  },
  methods: {
    getYuEBaoBalance() {
      this.$store.dispatch('user/yuebaoBalance').then(res => {
        this.balance = res.data.balance
      }).catch(err => {
        console.log(err);
      })
    },
    getWithdrawAmount() {
      this.$store.dispatch("user/getWithdrawAmount", res => {
        if (res.code === 200) {
          this.amount = res.data.amount;
          this.notAmount = res.data.notAmount;
        } else {
          this.toastText(res.message);
        }
      });
    },
    getYuebaoIndex() {
      this.$store.dispatch('user/yuebaoIndex').then(res => {
      }).catch(err => {
        console.log(err);
      })
    },
    onSubmit () {
      if (this.submitting) {
        this.toastText("正在提交", "top");
      }else if (!this.money) {
        this.toastText('请输入转帐金额', 'top')
      } else if (!parseFloat(this.money)) {
        this.toastText('请输入正确的金额', 'top')
      } else if ((parseFloat(this.money) > this.balance && this.rollType === 'OUT') || (parseFloat(this.money) > this.amount && this.rollType === 'IN')) {
        this.toastText('转帐金额不能大于可用金额', 'top')
      } else if (parseFloat(this.money) < 0) {
        this.toastText('转帐金额不能小于0元', 'top')
      } else {
        this.submitting = true;
        this.$store
          .dispatch("user/yuebaoTransfer", {
            amount: parseFloat(this.money),
            trans_type: this.rollType
          })
          .then(res => {
            setTimeout(()=>{
              this.submitting = false;
            },5000);
            if (res.code === 200) {
              if(this.rollType === 'IN') {
                this.amount = Number(this.amount) - Number(this.money)
              }
              if(this.rollType === 'OUT') this.getYuEBaoBalance()
              this.msg = res.data
              this.showAlert = true
              this.money = "";
              this.$nextTick(() => {
                this.getYuebaoIndex()
              })
              this.$store.dispatch('user/refreshBalance').then()
            } else {
              this.toastText(res.message, "top");
            }
          })
          .catch(() => {
            this.submitting = false;
          });
      }
    },
    hideAlert(){
      this.$refs.rollAlertRef.hideTask()
      setTimeout(() => {
        this.msg = ''
      }, 400);
    }
  },
}
</script>

<style lang="less" type='text/less' scoped>
  /deep/.placeholder span{
    font-size: 0.5rem;
    color: #d6d6d6;
  }

  .YuEBao-roll {
    color: #2c3e50;
    font-size: 0.349rem;
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
            color: #d6d6d6;
            position: absolute;
            font-size:0.5rem;
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
        .no-amount {
          height: 0.64rem;
          line-height: 0.64rem;
          text-align: left;
          color: #444444;
          font-size: 0.26rem;
          padding-left: 0.27rem;
        }
      }
      .submit-btn {
        width: calc(100% - 0.32rem);
        margin: 0 auto;
        color: #fff;
        height: 0.9rem;
        font-size: 0.36rem;
        line-height: 0.9rem;
        text-align: center;
        border-radius: 0.04rem;
        cursor: pointer;
      }
      .explain-text {
        color: #575E68;
        font-size: 0.28rem;
        padding: 0 0.31rem;
        text-align: left;
        margin-top: 0.3rem;
      }
    }
  }
   .roll-content {
     padding-bottom: 0.26rem;
      .success-icon {
        width: 0.79rem;
        height: 0.79rem;
        margin: 0.34rem auto 0;
      }
      .success-tetx {
        color: #000000;
        font-size: 0.34rem;
       }
      .tip-text {
        color: #939393;
        font-size: 0.28rem;
        font-weight: 400;
      }
    }
</style>
