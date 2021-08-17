<template>
    <div class="getMoney" v-if="bankCard" >
      <van-cell-group class="user-balance clear-fix theme-header-bg">
        <span class="col theme-color-white" style="margin-right:0.04rem">可用总额:</span>
        <span class="col balance">{{availableAmount}}</span>
        <span class="col theme-color-white">&nbsp;元</span>
      </van-cell-group>
      <van-cell-group class="list theme-header-bg">
        <van-cell is-link to="/user/cardedit?tabIndex=0&action=select" class="theme-header-bg">
          <img
            slot="icon"
            class="icon-img"
            :src="bankIcon[bankCard['bankName']] || bankIcon['其它银行']"
            alt
          />
          <span
            slot="title"
            class="title theme-color-white"
          >{{bankCard['bankName']}}(尾号:{{bankCard['cardNum'].substr(-4)}})</span>
        </van-cell>

        <van-cell class="money-input theme-header-bg rmb" v-keyBroayStates>
          <p class="cell-item">
            <span class="label">
              <span class="rmb theme-color-white">¥</span>
            </span>
            <input
              class="input theme-color-white"
              type="number"
              :placeholder="'可提现金额'+amount.toFixed(2)+'元'"
              v-model="money"
              maxlength="13"
            />
            <a class="all theme-color theme-color-yellow" @click="totalMoney()">全部</a>
          </p>
        </van-cell>
        <div class="no-amount theme-header-bg theme-color-white" v-if="parseFloat(this.notAmount)">
          <span class="label theme-color-white" v-html="relanMsg"></span>
          <!-- <span class="label theme-color-white">不可取款:</span> -->
          <!-- <span class="red">{{this.notAmount.toFixed(2)}}</span>元
          <span class="action theme-color theme-color-yellow" @click="toastText(msg, 'top')">查看原因</span> -->
        </div>

        <label class="pass-row theme-header-bg" v-keyBroayStates>
          <span class="label theme-color-white">资金密码:</span>
          <input
            ref = 'input_block'
            class="input theme-color-white"
            type="password"
            placeholder="请输入6位资金密码"
            :maxlength="6"
            v-model="password"
            @focus="focusFun"
            autocomplete="new-password"
          />
        </label>
      </van-cell-group>
      <div style="padding: 0 0.24rem;padding-top:0;margin-top:0.2rem;">
        <van-button ref="bottom_block" type="primary" :disabled="submitting" block @click="onSubmit" class="but theme-yellow-bg theme-color-black">立即提现</van-button>
      </div>
    </div>
</template>

<script type="text/javascript">
export default {
  name: "Take",
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  data() {
    return {
      relanMsg:"",
      amount: "",
      availableAmount: "",
      money: "",
      msg: "",
      notAmount: "",
      password: "",
      submitting: false,
      bankCard: null,
      noScroll:false,
      bankIcon: {
        工商银行: require("../../assets/img/save/bank-icon/工商银行logo.png"),
        农业银行: require("../../assets/img/save/bank-icon/农业银行logo.png"),
        建设银行: require("../../assets/img/save/bank-icon/建设银行logo.png"),
        招商银行: require("../../assets/img/save/bank-icon/招商银行logo.png"),
        中国银行: require("../../assets/img/save/bank-icon/中国银行logo.png"),
        浦发银行: require("../../assets/img/save/bank-icon/浦发银行logo.png"),
        中信银行: require("../../assets/img/save/bank-icon/中信银行logo.png"),
        交通银行: require("../../assets/img/save/bank-icon/交通银行logo.png"),
        民生银行: require("../../assets/img/save/bank-icon/民生银行logo.png"),
        兴业银行: require("../../assets/img/save/bank-icon/兴业银行logo.png"),
        邮政银行: require("../../assets/img/save/bank-icon/邮政银行logo.png"),
        光大银行: require("../../assets/img/save/bank-icon/光大银行logo.png"),
        华夏银行: require("../../assets/img/save/bank-icon/华夏银行logo.png"),
        浙商银行: require("../../assets/img/save/bank-icon/浙商银行logo.png"),
        包商银行: require("../../assets/img/save/bank-icon/包商银行logo.png"),
        北京银行: require("../../assets/img/save/bank-icon/北京银行logo.png"),
        上海银行: require("../../assets/img/save/bank-icon/上海银行logo.png"),
        哈尔滨银行: require("../../assets/img/save/bank-icon/哈尔滨银行logo.png"),
        江苏银行: require("../../assets/img/save/bank-icon/江苏银行logo.png"),
        广州农村商业银行: require("../../assets/img/save/bank-icon/广州农村商业银行logo.png"),
        广东发展银行: require("../../assets/img/save/bank-icon/广发银行logo.png"),
        农村信用社: require("../../assets/img/save/bank-icon/农村信用社logo.png"),
        平安银行: require("../../assets/img/save/bank-icon/平安银行logo.png"),
        东莞银行: require("../../assets/img/save/bank-icon/东莞银行logo.png"),
        徽商银行: require("../../assets/img/save/bank-icon/徽商银行logo.png"),
        深圳发展银行: require("../../assets/img/save/bank-icon/深圳发展银行logo.png"),
        北京农商: require("../../assets/img/save/bank-icon/北京农商logo.png"),
        福建农村信用社: require("../../assets/img/save/bank-icon/福建农村信用社logo.png"),
        成都银行: require("../../assets/img/save/bank-icon/成都银行logo.png"),
        浙江网商银行: require("../../assets/img/save/bank-icon/浙江网商银行logo.png"),
        吉林银行: require("../../assets/img/save/bank-icon/吉林银行logo.png"),
        其它银行: require("../../assets/img/save/bank-icon/其它银行logo.png")
      }
    };
  },
  created() {
    if (
      this.$store.state.user.bankData &&
      this.$store.state.user.bankData.length
    ) {
      if (this.$store.state.user.selectedBankId) {
        this.bankCard = this.$store.state.user.bankData.find(
          bank => bank.id === this.$store.state.user.selectedBankId
        );
        if (this.bankCard) {
          this.$store.commit("user/setSelectedBank", this.bankCard.id);
        } else {
          this.$store.commit("user/setSelectedBank", "");
          this.bankCard = this.$store.state.user.bankData[0];
          if (this.bankCard) {
            this.$store.commit("user/setSelectedBank", this.bankCard.id);
          }
        }
      } else {
        this.bankCard = this.$store.state.user.bankData[0];
        if (this.bankCard) {
          this.$store.commit("user/setSelectedBank", this.bankCard.id);
        }
      }

      this.amount = this.$store.state.user.userInfo.balance;

      this.$store.dispatch("user/getWithdrawAmount", res => {
        if (res.code === 200) {
          this.availableAmount = res.data.totalAmount;
          this.amount = res.data.amount;
          this.notAmount = res.data.notAmount;
          this.msg = res.data.msg;
          let msg = res.data.msg;
          let num= msg.match(/\d+\.\d+/g);
          this.relanMsg = msg.replace(num,`<span style='color:${this.$config.newQP?'#E6C245':'#ff2200'}'>${num}</span>`)
        } else {
          this.toastText(res.message);
        }
      });
    } else {
      this.$router.replace("/user/add-bank?relink=" + this.$route.fullPath);
    }
    this.$store.dispatch("user/setBalanceToLocal").then();
  },
  watch: {
    '$store.state.main.keyBoardStatus'(val){
        this.noScroll = val;
      }
  },
  mounted(){
  },
  methods: {
    blurFun(){

    },
    focusFun(){
      
    },
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
                  bank: this.bankCard.id
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
      border-bottom: 0.02rem solid #292929;
    }
  }
  .van-cell {
    &::after {
      border-bottom: 0.02rem solid #292929;
      right: 0.32rem !important;
    }
  }
  /deep/ .van-cell {
    &::after {
      border-bottom: 0.02rem solid #292929;
      right: 0.32rem !important;
    }
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
}
/deep/ .number-input{
  width: 5rem;
}
.getMoney {
  min-width: 100vw;
  max-width: 100vw;
  .icon-img {
    display: block;
    width: 0.7rem;
    height: 0.7rem;
    margin-right: 0.1rem;
    margin-left: 0;
  }

  /deep/ .van-cell {
    padding: 0.22rem 0 0.22rem 0.2rem;
  }
  /deep/ .van-cell-group:first-child {
    // margin-top: 0.3rem;
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

    .icon {
      display: inline-block;
      font-size: 0.58rem;
      width: 1.1rem;
      text-align: center;
    }

    .title {
      font-size: 0.32rem;
    }

    .desc {
      font-size: 0.35rem;
    }

    .cell-content {
      display: flex;
      align-items: center;
      justify-content: start;
      width: 100%;
      box-sizing: border-box;
    }
  }

  .money-input-row {
    width: 100%;
    padding: 0.24rem;
    border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
    box-sizing: border-box;
    justify-content: space-around;
    align-items: center;
    position: relative;

    .label {
      font-size: 0.7rem;
      height: 0.7rem;
      line-height: 0.7rem;
      display: block;
      width: 0.7rem;
      margin-right: 0.04rem;
    }

    .input {
      position: absolute;
      display: block;
      font-size: 0.7rem;
      height: 0.84rem;
      line-height: 0.82rem;
      padding: 0;
      margin: 0;
      transform: translateY(-13%) !important;
      overflow: visible !important;

      &::-webkit-input-placeholder {
        transform: scale(0.5);
        transform-origin: left;
        overflow: visible !important;
      }

      &::-moz-placeholder {
        transform: scale(0.5);
        transform-origin: left;
        overflow: visible !important;
      }
    }

    .all {
      position: absolute;
      display: block;
      line-height: 0.7rem;
      margin-right: 0.2rem;
    }
  }

  .pass-row {
    height: 1.1rem;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 0.24rem !important;
    border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
    box-sizing: border-box;
    overflow: hidden;
    // border-top: 0.02rem solid hsl(0, 0%, 95%);
    .label {
      width: 1.65rem;
      font-size: 0.349rem;
      margin-right: 0.04rem;
      margin-left: 0;
    }

    .input {
      flex: 1;
      font-size: 0.349rem;
      line-height: 0.349rem;
      padding: 0.375rem 0;
      display: inline-block;
      box-sizing: border-box;
    }
  }

  .bank {
    height: 1.22rem;
    line-height: 1.22rem;
    padding: 0 0.3rem;
  }

  .withdraw {
    height: 1.7rem;
    line-height: 1.7rem;
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
      /*transform: translateY(-26%) !important;*/
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
      width: 1.6rem;
      font-size: 0.349rem;
      margin-right: 0.04rem;
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

.iphone {
  .pass-row {
    .input {
      &.placeholder {
        // transform: translateY(18%) !important;
      }

      &::-moz-placeholder {
        // transform: translateY(18%) !important;
      }

      &::-webkit-input-placeholder {
        // transform: translateY(18%) !important;
      }
    }
  }
}
</style>
