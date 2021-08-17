<template>
  <div
    class="getMoney theme-header-bg"
    :class="[
      { 'newQP-getMoney': $config.newQP || $config.blackTheme },
      { 'blush-getMoney': $config.blush },
      { 'QP839-getMoney': $config.isBlackRedTheme },
    ]"
  >
    <div class="tit theme-color-white">请选择自助提款</div>
    <div class="take-select">
      <div
        :class="{ active: selectIndex === 0 }"
        @click="selectIndex = 0"
        class="theme-main-bg theme-color-white"
      >
        提现银行卡
        <img :src="payImg" class="item-icon" v-if="selectIndex === 0" />
      </div>
      <div
        :class="{ active: selectIndex === 1 }"
        @click="selectIndex = 1"
        class="theme-main-bg theme-color-white"
        v-if="showUsdt"
      >
        提现USDT
        <img :src="payImg" class="item-icon" v-if="selectIndex === 1" />
      </div>
    </div>
    <div class="bank theme-main-bg">
      <div v-if="selectIndex === 0">
        <div class="bank-info theme-color-white" v-if="bankCard">
          <div class="bank-name">{{ bankCard["bankName"] }}</div>
          <div class="bank-num">
            {{ bankCard["cardNum"].replace(/([\d*]{4})/g, "$1 ") }}
          </div>
          <div
            class="btn theme-gradient-bg theme-color-yellow theme-border-yellow"
            :class="{ 'btn-betnew': $config.name === 'betnew' }"
            @click="showPopup = true"
          >
            更换
          </div>
        </div>
        <div class="no-bank theme-color-white" v-else @click="parentIndex(2)">
          +添加銀行卡
        </div>
      </div>
      <div class="usdt" v-if="selectIndex === 1">
        <div class="usdt-info theme-color-white" v-if="usdtCard">
          <div class="usdt-name">{{ usdtCard["usdt_type"] }}</div>
          <div class="usdt-num">{{ usdtCard["cardNum"] }}</div>
          <div
            class="
              usdt-btn
              theme-gradient-bg theme-color-yellow theme-border-yellow
            "
            :class="{ 'usdt-btn-betnew': $config.name === 'betnew' }"
            @click="showPopup = true"
          >
            更换
          </div>
          <!-- <div
            class="copy theme-yellow-bg theme-color-black"
            @click="onCopy(usdtCard.cardNum)"
          >
            复制地址
          </div> -->
        </div>
        <div class="no-usdt theme-color-white" v-else @click="parentIndex(3)">
          +添加USDT
        </div>
      </div>
    </div>
    <div class="tit theme-color-white">提现金额</div>
    <input-row
      v-keyBroayStates
      :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
      type="tel"
      max-len="10"
      v-model="money"
      :placeholder="'可提现金额' + amount + '元'"
      :disabled="this.amount == '0'"
      :focusFunc="focusFunc"
      :class="{
        redColor: !$config.newQP && !$config.blackTheme && !$config.blush,
      }"
    >
      <div
        slot="label"
        class="allmoney theme-color-yellow"
        @click="totalMoney()"
      >
        全部
      </div>
      <img
        src="../../assets/img/save/white-rmb-icon.png"
        class="img-label"
        slot="label"
        v-if="
          $config.newQP ||
          $config.blackTheme ||
          $config.blush ||
          $config.isBlackRedTheme
        " /><img
        v-else
        src="../../assets/img/save/rmb-icon.png"
        class="img-label"
        slot="label"
    /></input-row>
    <div class="tit theme-color-white">资金密码</div>
    <input-row
      v-keyBroayStates
      :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
      type="password"
      max-len="6"
      v-model="password"
      placeholder="请输入资金密码"
      ><img
        src="../../assets/img/save/take/white-take-pw.png"
        class="img-label"
        slot="label"
        v-if="
          $config.newQP ||
          $config.blackTheme ||
          $config.blush ||
          $config.isBlackRedTheme
        " /><img
        v-else
        src="../../assets/img/save/take/take-pw.png"
        class="img-label"
        slot="label"
    /></input-row>
    <button
      type="button"
      class="submit theme-yellow-bg theme-color-black"
      :class="{ 'submit-betnew': $config.name === 'betnew' }"
      :disabled="submitting"
      @touchstart.capture="onSubmit($event)"
    >
      确认提现
    </button>
    <!-- <save-popup :show="showPopup" :btnValue="'确定'" @onConfirm="takeConfirm">
      <div slot="head" class="back-tit">
        <span class="txt theme-color-white">{{
          selectIndex === 0 ? "选择银行" : "选择币种"
        }}</span>
        <span class="btn" @click="showPopup = false">取消</span>
      </div>
      <van-picker
        :default-index="selectIndex === 0 ? defaultBankIndex : defaultUsdtIndex"
        @change="takeChange"
        :visible-item-count="3"
        :columns="selectIndex === 0 ? bankList : usdtList"
        :item-height="55"
        :swipe-duration="300"
        slot="content"
        class="take-picker"
        :class="{ 'black-take-picker': $config.newQP || $config.blackTheme }"
      />
    </save-popup> -->
    <van-popup
      v-model="showPopup"
      get-container="body"
      position="bottom"
      :close-on-click-overlay="false"
      :style="positionStyle"
    >
      <van-picker
        :default-index="selectIndex === 0 ? defaultBankIndex : defaultUsdtIndex"
        @cancel="showPopup = false"
        :confirm-button-text="'确定'"
        :title="selectIndex === 0 ? '选择银行' : '选择币种'"
        show-toolbar
        :columns="selectIndex === 0 ? bankList : usdtList"
        @confirm="takeConfirm"
        :class="[
          { 'black-take-picker': $config.newQP || $config.blackTheme },
          { 'usdt-take-picker': selectIndex === 1 },
        ]"
      />
    </van-popup>
  </div>
</template>

<script type="text/javascript">
import savePopup from "../../components/save-popup/index.vue";
export default {
  name: "Take",
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    payImg() {
      if (this.$config.newQP || this.$config.blackTheme || this.$config.blush) {
        return require(`../../assets/img/save/pay_yellow.png`);
      } else if (this.$config.name === "betnew") {
        return require(`../../assets/img/save/pay_green.png`);
      } else if (this.$config.isBlackRedTheme) {
        return require(`../../assets/img/save/pay_red.png`);
      } else {
        return require(`../../assets/img/save/pay_default.png`);
      }
    },
    positionStyle() {
      //解决安卓小米position：fixed问题导致按钮错位问题
      if (
        this.$mobileDevice.isAndroid &&
        this.$mobileDevice.browserName === "MIUI Browser"
      ) {
        return {
          position: "absolute",
        };
      } else {
        return {
          position: "fixed",
        };
      }
    },
  },
  components: {
    savePopup,
  },
  data() {
    return {
      amount: "",
      money: "",
      password: "",
      submitting: false,
      bankCard: null,
      selectIndex: 0,
      usdtCard: null,
      showPopup: false,
      bankList: [],
      usdtList: [],
      defaultBankIndex: 0,
      defaultUsdtIndex: 0,
      showUsdt: this.$store.state.main.config.limit.usdtWithdrawalsRate,
    };
  },
  created() {
    if (
      this.$store.state.user.bankData &&
      this.$store.state.user.bankData.length
    ) {
      this.$store.state.user.bankData.forEach((item, i) => {
        this.bankList.push(
          item.bankName + item.cardNum.replace(/([\d*]{4})/g, "$1 ")
        );
      });
      if (this.$store.state.user.selectedBankId) {
        this.$store.state.user.bankData.forEach((item, i) => {
          if (item.id === this.$store.state.user.selectedBankId) {
            this.bankCard = item;
            this.defaultBankIndex = i;
          }
        });
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
    }
    if (
      this.$store.state.user.usdtData &&
      this.$store.state.user.usdtData.length
    ) {
      this.$store.state.user.usdtData.forEach((item, i) => {
        this.usdtList.push(item.cardNum);
      });
      if (this.$store.state.user.selectedUsdtId) {
        this.$store.state.user.usdtData.forEach((item, i) => {
          if (item.id === this.$store.state.user.selectedUsdtId) {
            this.defaultUsdtIndex = i;
            this.usdtCard = item;
          }
        });
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
    }
    this.$store.dispatch("user/getWithdrawAmount", (res) => {
      if (res.code === 200) {
        this.amount = res.data.amount;
      } else {
        this.toastText(res.message);
      }
    });
    this.$store.dispatch("user/setBalanceToLocal").then();
  },
  watch: {
    selectIndex() {
      this.resetForm();
    },
  },
  mounted() {},
  methods: {
    totalMoney() {
      this.money = this.amount;
    },
    focusFunc() {
      if (this.amount == "0") {
        this.toastText("可提现金额为0");
      }
    },
    parentIndex(index) {
      this.$emit("clickTab", index);
    },
    takeConfirm(value, index) {
      if (this.selectIndex === 0) {
        this.defaultBankIndex = index;
        this.bankCard = this.$store.state.user.bankData[index];
        this.$store.commit("user/setSelectedBank", this.bankCard.id);
      } else {
        this.defaultUsdtIndex = index;
        this.usdtCard = this.$store.state.user.usdtData[index];
        this.$store.commit("user/setSelectedUsdt", this.usdtCard.id);
      }
      this.showPopup = false;
    },
    onSubmit() {
      //银行卡提现
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
          `取款金额不能小于${this.$store.state.main.config.limit["withdrawalsLimit"]}元`,
          "top"
        );
      } else if (this.password.length < 6) {
        this.toastText("请输入正确的资金密码", "top");
      } else if (this.selectIndex === 0) {
        this.submitting = true;
        this.$store
          .dispatch("user/setBalanceToLocal")
          .then((res) => {
            if (res.code === 200) {
              this.$store
                .dispatch("user/take", {
                  money: parseFloat(this.money),
                  password: this.password,
                  bank: this.bankCard.id,
                })
                .then((res) => {
                  setTimeout(() => {
                    this.submitting = false;
                  }, 1000);
                  if (res.code === 200) {
                    this.toastText(res.data, "top");
                    this.$store.dispatch("user/refreshInfo").then();
                    this.resetForm();
                    this.$store.dispatch("user/getWithdrawAmount", (res) => {
                      if (res.code === 200) {
                        this.amount = res.data.amount;
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
          })
          .catch(() => {
            this.submitting = false;
          });
      } else if (this.selectIndex === 1) {
        this.submitting = true;
        this.$store
          .dispatch("user/setBalanceToLocal")
          .then((res) => {
            if (res.code === 200) {
              this.$store
                .dispatch("user/take", {
                  money: parseFloat(this.money),
                  password: this.password,
                  bank: this.usdtCard.id,
                  withdrawalsType: "usdtWithdrawals",
                  device: "h5",
                })
                .then((res) => {
                  setTimeout(() => {
                    this.submitting = false;
                  }, 1000);
                  if (res.code === 200) {
                    this.toastText(res.data, "top");
                    this.$store.dispatch("user/refreshInfo").then();
                    this.resetForm();
                    this.$store.dispatch("user/getWithdrawAmount", (res) => {
                      if (res.code === 200) {
                        this.amount = res.data.amount;
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
          })
          .catch(() => {
            this.submitting = false;
          });
      }
    },
    onCopy(str) {
      this.$copyText(str).then(
        (e) => {
          this.toastText("复制成功", "top");
        },
        (e) => {
          this.toastText("请手动复制或使用其他浏览器尝试", "top");
        }
      );
    },
    resetForm() {
      this.money = "";
      this.password = "";
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.getMoney {
  background-color: #fafafa;
  min-width: 100vw;
  max-width: 100vw;
  padding: 0 0.28rem;
  text-align: left;
  font-family: PingFangSC-Regular, PingFang SC;
  overflow: hidden;
  .tit {
    margin-top: 0.2rem;
    margin-bottom: 0.1rem;
    color: #333333;
    font-size: 0.33rem;
  }
  .take-select {
    font-size: 0;
    margin-top: 0.2rem;
    div {
      position: relative;
      display: inline-block;
      width: 2.14rem;
      height: 0.87rem;
      line-height: 0.87rem;
      color: #010101;
      font-size: 0.28rem;
      background-color: #fff;
      text-align: center;
      box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.02);
      margin-right: 0.25rem;
      border-radius: 0.09rem;
      border: 0.02rem solid transparent;
      .item-icon {
        position: absolute;
        width: 0.45rem;
        height: 0.45rem;
        right: -0.04rem;
        bottom: -0.04rem;
      }
      &.active {
        box-shadow: 0px 0px 13px 0px rgba(0, 189, 212, 0.5);
      }
    }
  }
  .bank {
    width: 100%;
    box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.02);
    background-color: #fff;
    border-radius: 0.1rem;
    margin-top: 0.2rem;
    padding: 0.3rem;
    .bank-info,
    .usdt-info {
      position: relative;
      width: 100%;
      font-size: 0.32rem;
      color: #333333;
      overflow: hidden;
      .bank-name {
        margin-top: 0.08rem;
      }
      .bank-num {
        margin-top: 0.1rem;
      }
      .btn,
      .usdt-btn {
        position: absolute;
        right: 0;
        top: 0;
        width: 0.89rem;
        height: 0.49rem;
        line-height: 0.49rem;
        background: #ffffff;
        border-radius: 0.07rem;
        border: 0.02rem solid #00bbd2;
        text-align: center;
        font-size: 0.28rem;
      }
      .btn-betnew,
      .usdt-btn-betnew {
        border-color: #037a5d !important;
      }
    }
    .usdt-info {
      height: auto;
      .usdt-name {
        margin-bottom: 0.1rem;
        padding-top: 0.08rem;
      }
      .usdt-num {
        // padding: 0.2rem 0.25rem;
        // border: 0.02rem solid #dddddd;
        // border-radius: 0.1rem;
        word-break: break-word;
      }
      .copy {
        width: 3.48rem;
        height: 0.87rem;
        line-height: 0.87rem;
        background: linear-gradient(90deg, #00b2c8 0%, #00bdd4 100%);
        border-radius: 0.43rem;
        margin: 0.35rem auto 0.1rem;
        text-align: center;
        color: #fff;
        font-size: 0.4rem;
        font-weight: 500;
      }
    }
    .no-bank,
    .no-usdt {
      width: 100%;
      height: 0.8rem;
      line-height: 0.8rem;
      border-radius: 9px;
      color: #bbbbbb;
      text-align: center;
      font-size: 0.34rem;
    }
  }
  .submit {
    width: 100%;
    height: 0.87rem;
    line-height: 0.87rem;
    background: linear-gradient(90deg, #00b2c8 0%, #00bdd4 100%);
    border-radius: 0.4rem;
    color: #fff;
    font-size: 0.4rem;
    font-weight: 500;
    margin-bottom: 0.6rem;
  }
  .submit-betnew {
    background: #037a5d !important;
  }
  /deep/ .user-input-row {
    padding-left: 0 !important;
    height: 0.6rem;
    .input {
      font-size: 0.4rem !important;
      width: 5rem;
      max-width: 5rem;
    }
    &::after {
      left: 0 !important;
      top: 98%;
      margin-right: 0.1rem;
    }
    &:first-child::after {
      display: block;
    }
    .img-label {
      width: 0.24rem;
      margin-right: 0.2rem;
    }
    .allmoney {
      position: absolute;
      font-size: 0.32rem;
      right: 0.25rem;
      color: red;
    }
    &.redColor {
      .input:not(.placeholder) {
        color: red !important;
      }
    }
    .placeholder {
      font-size: 0.32rem !important;
    }
  }
}
.back-tit {
  height: 1rem;
  line-height: 1rem;
  background-color: #fff;
  padding: 0 0.45rem;
  .txt {
    color: #333333;
    font-size: 0.36rem;
    float: left;
  }
  .btn {
    color: #afaeb4;
    font-size: 0.28rem;
    float: right;
  }
}
.usdt-take-picker {
  /deep/.van-picker-column__item {
    /deep/.van-ellipsis {
      width: 100%;
      word-break: break-word;
      white-space: normal;
      text-align: left;
      padding: 0 0.2rem;
    }
  }
}
.usdt-take-picker {
  /deep/.van-picker-column__item {
    .van-ellipsis {
      width: 100%;
      word-break: break-word;
      white-space: normal;
      text-align: left;
      padding: 0 0.2rem;
    }
  }
}
/deep/.usdt-take-picker {
  .van-picker-column__item {
    .van-ellipsis {
      width: 100%;
      word-break: break-word;
      white-space: normal;
      text-align: left;
      padding: 0 0.2rem;
    }
  }
}
.newQP-getMoney {
  .take-select {
    div {
      &.active {
        box-shadow: none;
        border: 0.02rem solid #f6cf32 !important;
        color: #f6cf32 !important;
        img {
          bottom: -0.04rem;
        }
      }
    }
  }
}
.blush-getMoney {
  .take-select {
    div {
      &.active {
        box-shadow: none;
        border: 0.02rem solid #f6cf32 !important;
        color: #f6cf32 !important;
        img {
          bottom: -0.04rem;
        }
      }
    }
  }
}

/deep/.black-take-picker {
  background: linear-gradient(0deg, #0b0b0b, #100f0f);
  .van-picker__toolbar {
    background-color: transparent;
    .van-picker__cancel,
    .van-picker__title,
    .van-picker__confirm {
      color: #fff !important;
    }
    &::after {
      border: none !important;
    }
  }
  .van-picker__columns {
    background: linear-gradient(0deg, #0b0b0b, #100f0f);
    .van-picker-column__item {
      color: #fff;
    }
  }
  .van-picker__mask {
    background: none;
  }
  .label {
    color: #ffffff !important;
  }
  .name {
    color: #fff !important;
  }
  .input {
    color: #fff !important;
  }
  &::after {
    border-bottom: 0.02rem solid #242424;
  }
  &.blush-inp::after {
    border-bottom: 0.02rem solid #630108;
  }
}

// QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 start
//控制 內容 背景顏色 && 按鈕顏色 && 字體顏色
.QP839-getMoney {
  background-color: #1b1d1b;
  .tit {
    color: #ffffff;
  }
  .user-input-row {
    /deep/.input {
      color: #ffffff;
    }
  }
  .take-select {
    div {
      color: #ffffff;
      background: #272829 !important;
      &.active {
        border: 1px solid #c62721 !important;
        box-shadow: none;
        background: #1b1d1b !important;
      }
    }
  }
  .bank {
    box-shadow: none;
    background-color: #272829;
    .bank-info,
    .usdt-info {
      color: #ffffff;
      .btn,
      .usdt-btn {
        background: #1b1d1b !important;
        border: 0.02rem solid #c02e26 !important;
        color: #f55c45;
      }
    }
    .no-bank,
    .no-usdt {
      color: #bbbbbb;
    }
  }
  .submit {
    background: linear-gradient(
      180deg,
      rgb(204, 52, 50) 0%,
      rgb(197, 39, 33) 100%
    ); //送出按鈕顏色
  }
  .allmoney {
    color: #f55c45 !important;
  }
}
// QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 end
</style>