<template>
    <div class="getMoney" v-if="usdtCard">
      <van-cell-group class="user-balance clear-fix theme-header-bg">
        <span class="col theme-color-white" style="margin-right: 0.04rem;">可用总额:</span>
        <span class="col balance">{{availableAmount}}</span>
        <span class="col theme-color-white">&nbsp;元</span>
      </van-cell-group>

      <van-cell-group class="list theme-header-bg">
        <van-cell is-link to="/user/cardedit?tabIndex=1&action=select" class="theme-header-bg">
          <img 
            slot="icon"
            class="icon-img"
            src="../../assets/img/save/take/usdt-take.png" alt="">
          <span
            slot="title"
            class="title theme-color-white"
          >USDT-ERC20(尾号:{{usdtCard['cardNumLast']}})</span>
        </van-cell>
        <van-cell class="money-input theme-header-bg" v-keyBroayStates>
          <p class="cell-item">
            <span class="label">
              <span class="rmb theme-color-white">¥</span>
            </span>
            <input
              class="input theme-color-white"
              type="number"
              :placeholder="'可提现金额'+amount+'元'"
              v-model="money"
              maxlength="13"
            />
            <a class="all theme-color theme-color-yellow" @click="totalMoney()">全部</a>
          </p>
        </van-cell>
        <div class="no-amount" v-if="parseFloat(this.notAmount)">
          <span class="label theme-color-white">不可取款:</span>
          <span class="red">{{this.notAmount}}</span>元
          <span class="action theme-color theme-color-yellow" @click="toastText(msg, 'top')">查看原因</span>
        </div>
        <label class="label-row theme-color-white" v-keyBroayStates>
          <span class="label">提现汇率:</span>
          <p class="name">{{usdtCard['usdtDepositRate']}}</p>
        </label>
        <label class="label-row theme-color-white" v-keyBroayStates>
          <span class="label">货币数量:</span>
          <p class="name">{{usdtNumber}}</p>
        </label>
        <label class="label-row theme-color-white" v-keyBroayStates>
          <span class="label">资金密码:</span>
          <input
            ref = 'input_block'
            class="input theme-color-white"
            type="password"
            placeholder="请输入6位资金密码"
            :maxlength="6"
            v-model="password"
            autocomplete="new-password"
            style="width:5rem"
          />
        </label>
      </van-cell-group>
    
      <div style="padding: 0 0.24rem;padding-top:0;margin-top:0.2rem;">
        <van-button ref="bottom_block" type="primary" :disabled="submitting" block @click="onSubmit" class="but theme-yellow-bg theme-color-black">立即提现</van-button>
      </div>
      <div class="bottom-info">
        <p >温馨提示：</p>
        <p >1.收款地址绑定错误请及时联系客服解绑</p>
        <p >2.提款前请务必再三确认收款地址为USDT-ERC20</p>
      </div>
    </div>
</template>

<script type="text/javascript">
export default {
  name: "usdtTake",
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
  },
  data() {
    return {
      amount: "",
      availableAmount: "",
      money: "",
      password: "",
      submitting: false,
      msg: '',
      usdtNumber: '0.00',
      noScroll:false,
      usdtCard: null,
      notAmount: "",
      msg: "",
    };
  },
  created() {
    if(this.$store.state.user.usdtData && this.$store.state.user.usdtData.length) {
      if (this.$store.state.user.selectedUsdtId) {
        this.usdtCard = this.$store.state.user.usdtData.find(
          usdt => usdt.id === this.$store.state.user.selectedUsdtId
        );
        if (this.usdtCard) {
          this.$store.commit("user/setSelectedUsdt", this.usdtCard.id);
        } else {
          this.$store.commit("user/setSelectedUsdt", "");
          this.usdtCard = this.$store.state.user.usdtData[0];
          if (this.usdtCard) {
            this.$store.commit("user/setSelectedUsdt", this.usdtCard.id);
          }
        }
      } else {
        this.usdtCard = this.$store.state.user.usdtData[0];
        if (this.usdtCard) {
          this.$store.commit("user/setSelectedUsdt", this.usdtCard.id);
        }
      }
      this.amount = this.$store.state.user.userInfo.balance;
      this.$store.dispatch("user/getWithdrawAmount", res => {
        if (res.code === 200) {
          this.availableAmount = res.data.totalAmount;
          this.amount = res.data.amount;
          this.msg = res.data.msg;
          this.notAmount = res.data.notAmount;
        } else {
          this.toastText(res.message);
        }
      });
    }else {
      this.$router.push("/user/add-usdt?relink=" + this.$route.fullPath);
    }
  },
  mounted(){
  },
  watch: {
    '$store.state.main.keyBoardStatus'(val){
      this.noScroll = val;
    },
    'money' (val) {
      if(Number(val) == 0 || val == '') {
        this.usdtNumber = '0.00'
      }else {
        this.usdtNumber = (Number(val) / Number(this.usdtCard['usdtDepositRate'])).toFixed(4)
      }
    }
  },
  methods: {
    totalMoney() {
      this.money = this.amount;
    },
    onSubmit() {
      this.$refs['bottom_block'].focus()
      if (this.submitting) {
        this.toastText("正在提交", "top");
      } else if (!this.money) {
        this.toastText("请输入取款金额", "top");
      } else if (!parseFloat(this.money)) {
        this.toastText("请输入正确的金额", "top");
      } else if (parseFloat(this.money) > this.amount) {
        this.toastText("取款金额不能大于可用金额", "top");
      } else if (
        parseFloat(this.money) <
        this.$store.state.main.config.limit["withdrawalsLimit"]
      ) {
        this.toastText(
          `取款金额不能小于${
            this.$store.state.main.config.limit["withdrawalsLimit"]
          }元`,
          "top"
        );
      } else if (this.password.length < 6) {
        this.toastText("请输入正确的资金密码", "top");
      } else {
        this.submitting = true;
        this.$store
          .dispatch("user/setBalanceToLocal")
          .then(res => {
            if (res.code === 200) {
              this.$store
                .dispatch("user/take", {
                  money: parseFloat(this.money),
                  password: this.password,
                  bank: this.usdtCard.id,
                  withdrawalsType: 'usdtWithdrawals',
                  device: "h5",
                })
                .then(res => {
                  setTimeout(()=>{
                    this.submitting = false;
                  },5000);
                  if (res.code === 200) {
                    this.toastText("提款完成", "top");
                    this.$store.dispatch("user/refreshInfo").then();
                    this.money = "";
                    this.password = "";
                    this.$store.dispatch("user/getWithdrawAmount", res => {
                      if (res.code === 200) {
                        this.availableAmount = res.data.totalAmount;
                        this.amount = res.data.amount;
                        this.notAmount = res.data.notAmount;
                        this.msg = res.data.msg;
                      } else {
                        this.toastText(res.message, "top");
                      }
                    });
                  } else {
                    this.toastText(res.message, "top");
                  }
                })
                .catch(() => {
                  this.submitting = false;
                });
            } else {
              this.toastText(res.message, "top");
              this.submitting = false;
            }
          }).catch(() => {
            this.submitting = false;
          });
      }
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
.newQP-take {
  [class*=van-hairline]::after {
    border-bottom: none !important;
    border: none !important;
  }
  .money-input {
    &::after {
      right: 0.3rem!important;
    }
  }
  .label-row {
    position: relative;
    border-bottom: none !important;
    &::after {
      right: 0.3rem!important;
      border-bottom: 0.02rem solid #ebedf0!important;
    }
  }
  .no-amount {
    border-top: none!important;
    border-bottom: none!important;
    &::after {
      position: absolute;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 0.3rem;
      bottom: 0;
      left: 0.3rem;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      border-bottom: 0.02rem solid #292929!important;;
    }
  }
  .van-cell {
    &::after {
      border-bottom: 0.02rem solid #292929!important;;
      right: 0.32rem !important;
    }
  }
  /deep/ .van-cell {
    &::after {
      border-bottom: 0.02rem solid #292929!important;;
      right: 0.32rem !important;
    }
  }
  .label-row {
    &::after {
      border-bottom: 0.02rem solid #292929!important;;
    }
  }
}
.getMoney {
  min-width: 100vw;
  max-width: 100vw;
  /deep/ .van-cell {
    padding: 0.22rem 0 0.22rem 0.2rem;
  }

  .label-row {
    height: 1.1rem;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 0.24rem !important;
    box-sizing: border-box;
    overflow: hidden;
    border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
    .label {
      width: 1.56rem;
      font-size: 0.349rem;
      margin-left: 0;
    }

    .name {
      flex: 1;
      font-size: 0.349rem;
      line-height: 0.349rem;
      padding: 0.375rem 0;
      display: inline-block;
      box-sizing: border-box;
    }
  }
  .user-balance {
    width: 100%;
    font-size: 0.349rem;
    height: 1.14rem;
    color: #666666;
    padding-left: 0.24rem;
    line-height: 1.14rem;
    .col {
      float: left;
      font-size: 0.349rem;
      height: 100%;
      color: #000;
    }

    .icon {
      display: inline-block;
      font-size: 0.65rem;
      width: 1.1rem;
    }

    .balance {
      font-size: 0.349rem;
      color: #ff2200;
    }
  }

  .list {
    text-align: left;
    font-size: 0.35rem;

    .title {
      font-size: 0.32rem;
    }

    .icon-img {
      display: block;
      width: 0.7rem;
      height: 0.7rem;
      margin-right: 0.1rem;
      margin-left: 0;
    }
  }

  .money-input {
    padding: 0.3rem 0.24rem !important;

    .flex {
      align-items: center;
      width: 100%;
      box-sizing: border-box;
    }

    .cell-item {
      position: relative;
      display: block;
      height: 1rem;
      width: 100%;
      box-sizing: border-box;
    }

    .label {
      font-size: 0.7rem;
      color: #000;
      position: absolute;
      box-sizing: border-box;
      display: block;
      width: 0.7rem;
      height: 1rem;
      line-height: 1rem;
    }

    .input {
      font-family: Arial, sans-serif !important;
      top: 0.12rem;
      left: 0.8rem;
      position: absolute;
      display: block;
      font-size: 0.7rem;
      height: 0.78rem;
      line-height: 0.76rem;
      padding: 0;
      margin: 0;
      max-width: 5.4rem;
      overflow: visible !important;

      &::-webkit-input-placeholder {
        transform: scale(0.66) translateY(0.1rem);
        transform-origin: left;
        overflow: visible !important;
      }

      &::-moz-placeholder {
        transform: scale(0.66) translateY(0.1rem);
        transform-origin: left;
        overflow: visible !important;
      }
    }

    .all {
      font-size: 0.35rem;
      position: absolute;
      white-space: nowrap;
      height: 1rem;
      line-height: 1rem;
      display: block;
      right: 0;
      top: 0;
    }
  }
  .red {
    color: #ff2200;
  }

  .no-amount {
    font-size: 0.345rem;
    padding: 0.16rem 0.24rem !important;
    box-sizing: border-box;
    border-top: 0.02rem solid hsl(0, 100%, 100%);
    border-bottom:  0.02rem solid hsl(0, 0%, 95%);
    position: relative;

    .label {
      display: inline-block;
      width: 1.56rem;
      font-size: 0.349rem;
      margin-left: 0;
    }

    .action {
      position: absolute;
      right: 0.24rem;
      top: 0.18rem;
    }
  }
}

.but {
  font-size: 0.36rem;
}

.bottom-info {
  width: 100%;
  box-sizing: border-box;
  padding: 0.49rem 0.3rem 0.6rem 0.3rem;
  p {
    text-align: left;
    color: #575E68;
    font-size: 0.28rem;
    line-height: 0.48rem;
  }
}
.blush-take {
  [class*=van-hairline]::after {
    border-bottom: none !important;
    border: none !important;
  }
  .pass-row {
    border-bottom: none !important;
  }
  .money-input {
    &::after {
      right: 0.3rem!important;
    }
  }
  .no-amount {
    border-top: none!important;
    border-bottom: none!important;
    &::after {
      position: absolute;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 0.3rem;
      bottom: 0;
      left: 0.3rem;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      border-bottom: 0.02rem solid #530107;
    }
  }
  .van-cell {
    &::after {
      border-bottom: 0.02rem solid #530107;
      right: 0.32rem !important;
    }
  }
  /deep/ .van-cell {
    &::after {
      border-bottom: 0.02rem solid #530107;
      right: 0.32rem !important;
    }
  }
  .label-row {
    border-bottom: 0.02rem solid #530107;
  }
}
</style>