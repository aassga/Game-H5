<template>
  <div class="submit-payment" v-if="isNoPay">
    <img class="no-data" src="@src/assets/img/save/no-pay-tongdao.png" alt />
  </div>
  <div
    :class="[
      'submit-payment',
      { 'newQP-box theme-main-bg': $config.newQP || $config.blackTheme },
      { 'blush-box theme-header-bg': $config.blush },
      { 'QP839-box theme-header-bg': $config.isBlackRedTheme },
    ]"
    v-else
  >
    <p class="title theme-color-white" v-if="list && list.length > 1">
      请选择支付通道
    </p>
    <van-tabs
      v-model="portIndex"
      :line-height="0"
      :swipe-threshold="3"
      sticky
      class="pay-tabs theme-after-border-nocolor"
      :class="[
        { 'newQP-box theme-main-bg': $config.newQP || $config.blackTheme },
        { 'blush-box theme-header-bg': $config.blush },
        { 'QP839-box theme-header-bg': $config.isBlackRedTheme },
      ]"
      v-if="list && list.length > 1"
    >
      <van-tab v-for="(port, i) in list" :key="i">
        <template #title>
          <p class="tit theme-color-white">{{ port.name ? port.name : "" }}</p>
          <p class="txt theme-color-gray-1">
            {{
              (port.maxAmount > 1000 ? "大额" : "小额") +
              port.minAmount +
              "-" +
              port.maxAmount
            }}
          </p>
          <img :src="payImg" class="item-icon" v-if="portIndex === i" />
        </template>
      </van-tab>
    </van-tabs>
    <p class="info">
      由于银行管制,导致第三方充值通道不稳定!如果充值一次未成功请换其通道进行充值!
    </p>
    <div
      class="port-content"
      :class="[
        { 'newQP-box theme-main-bg': $config.newQP || $config.blackTheme },
        { 'blush-box theme-header-bg': $config.blush },
        { 'QP839-box theme-header-bg': $config.isBlackRedTheme},
      ]"
    >
      <div
        class="format-mount"
        v-show="!!targetPort && targetPort['formatAmount']"
      >
        <input-row
          v-model="amount"
          :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          type="select"
          :data="targetPort && targetPort['formatAmount'].split(',')"
          ref="selector"
          placeholder="请选择充值金额"
          :title="'固定金额'"
          is-click
          :class="{
            redColor: !$config.newQP && !$config.blackTheme && !$config.blush,
          }"
        >
          <img
            src="../../assets/img/save/white-rmb-icon.png"
            class="img-label"
            v-if="
              $config.newQP ||
              $config.blackTheme ||
              $config.blush ||
              $config.isBlackRedTheme ||
              $config.name === 'dqr'
            "
            slot="label"
          />
          <img
            v-else
            src="../../assets/img/save/rmb-icon.png"
            class="img-label"
            slot="label"
          />
        </input-row>
        <ul
          class="amount-list clearfix"
          v-if="targetPort['formatAmount'].split(',').length"
        >
          <li
            class="amount-item"
            :class="{ active: amount === item }"
            v-for="item in targetPort['formatAmount'].split(',')"
            :key="item"
            @click="amount = item"
          >
            {{ item }}
            <img :src="payImg" class="item-icon" v-if="amount === item" />
          </li>
        </ul>
      </div>
      <div
        class="amount-input"
        :class="[
          { 'newQP-box theme-main-bg': $config.newQP || $config.blackTheme },
          { 'blush-box theme-header-bg': $config.blush },
          { 'QP839-box theme-header-bg': $config.isBlackRedTheme},
        ]"
        v-show="!!targetPort && !targetPort['formatAmount']"
      >
        <!-- <label class="amount-input-label v-keyBroayStates" v-keyBroayStates>
          <img src="../../assets/img/save/yellow-rmb-icon.png" class="label" v-if="$config.newQP || $config.blackTheme || $config.blush"><img v-else src="../../assets/img/save/rmb-icon.png" class="label" >
            <input
              v-if="!!targetPort"
              type="tel"
              class="input"
              maxlength="10"
              v-model="amount"
              
              placeholder="请输入支付金额"
              :class="{redColor:(!$config.newQP && !$config.blackTheme && !$config.blush)}"
            />
        </label> -->
        <input-row
          v-if="!!targetPort"
          v-keyBroayStates
          :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          type="tel"
          max-len="10"
          v-model="amount"
          ref="amount-input"
          placeholder="请输入支付金额"
          :class="{
            redColor: !$config.newQP && !$config.blackTheme && !$config.blush,
          }"
          ><img
            src="../../assets/img/save/white-rmb-icon.png"
            class="img-label"
            slot="label"
            v-if="
              $config.newQP ||
              $config.blackTheme ||
              $config.blush ||
              $config.isBlackRedTheme ||
              $config.name === 'dqr'
            " /><img
            v-else
            src="../../assets/img/save/rmb-icon.png"
            class="img-label"
            slot="label"
        /></input-row>
        <ul class="amount-list clearfix">
          <li
            class="amount-item"
            :class="{ active: amount === item }"
            v-for="item in quick_amount1"
            :key="item"
            @click="amount = item"
          >
            {{ item }}
            <img :src="payImg" class="item-icon" v-if="amount === item" />
          </li>
        </ul>

        <!-- <ul
          class="amount-list amount-list-ul scroll-amount-list"
          v-if="!showScrollList && quick_amount2 && quick_amount2.length"
        >
          <li
            class="amount-item"
            :class="{ active: amount === item }"
            v-for="item in quick_amount2"
            :key="item"
            @click="amount = item"
          >
            {{ item }}
            <img
              :src="payImg"
              class="item-icon"
              v-if="amount === item"
            />
          </li>
        </ul>

        <van-tabs
          v-model="amountIndex"
          @click="getIndex"
          :line-height="0"
          class="scrollable-box amount-list old_money"
          v-if="
            !!targetPort &&
            !targetPort['formatAmount'] &&
            quick_amount2.length &&
            showScrollList
          "
        >
          <van-tab
            :title="item"
            v-for="(item, index) in quick_amount2"
            :key="index"
          >
          <img
              :src="payImg"
              class="item-icon"
              v-if="amount === item"
            />
          </van-tab>
        </van-tabs> -->
      </div>
    </div>

    <a
      href="javascript:void(0)"
      class="save-submit theme-yellow-bg-3 theme-color-black"
      @click="onSubmit"
      >立即支付</a
    >
    <div style="height: 2rem"></div>
    <!-- <ios-alert
      v-model="showPayAlert"
      :width="6"
      class="payAlert"
      ok-text="银行转账" no-text="继续支付"
      :showNo="showNo"
      :ok-callback="okCallback"
      :no-callback="noCallback"
    >
      <div class="title pay-title" slot="title">
        <h4 class="title theme-color-white" style="font-size:0.33rem">{{payAlertText}}</h4>
      </div>
    </ios-alert> -->
    <pub-dialog v-model="showPayDialog" style="z-index: 999">
      <div class="pay-dialog">
        <div class="content">
          <p>
            支付已超额最大额度<span>{{ maxPay }}元</span>
          </p>
          <p>
            大额推荐银行转帐加<span>送{{ bankRate }}%</span>
          </p>
          <img
            src="../../assets/img/save/cancel-btn.png"
            @click="showPayDialog = false"
            class="l-btn"
            v-if="bal_amount <= 0"
          />
          <img
            src="../../assets/img/save/continue-btn.png"
            @click="showPayDialog = false"
            class="l-btn"
            v-else
          />
          <img
            @click="bankTransfer"
            src="../../assets/img/save/bank-btn.png"
            class="r-btn"
          />
        </div>
      </div>
    </pub-dialog>
  </div>
</template>

<script type="text/javascript">
import { Tab, Tabs } from "vant";
// import BScroll from "better-scroll";
export default {
  name: "SubmitPayment",
  components: {
    vanTabs: Tabs,
    vanTab: Tab,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isNoPay: false,
      submitting: false,
      list: [],
      targetPort: null,
      portIndex: 0,
      name: "",
      order: "",
      amount: "",
      paymentId: "",
      scroll: null,
      quick_amount: ["50", "100", "500", "1000", "5000"],
      quick_amount1: [],
      quick_amount2: [],
      amountIndex: 0,
      showScrollList: false,
      showNo: false,
      showPayDialog: false,
      payAlertText: "",
      maxPay: "",
      bankRate: "",
      bal_amount: "",
      // continue:0,
    };
  },
  computed: {
    payImg() {
      if (this.$config.newQP || this.$config.blackTheme || this.$config.blush) {
        return require(`../../assets/img/save/pay_yellow.png`);
      } else if (this.$config.isBlackRedTheme) {
        return require(`../../assets/img/save/pay_red.png`);
      } else {
        return require(`../../assets/img/save/pay_default.png`);
      }
    },
  },
  watch: {
    portIndex(now, old) {
      this.amountIndex = 0;
      this.$nextTick(() => {
        let vantDom = document.querySelectorAll(
          ".amount-list > .van-tabs__wrap > .van-tabs__nav > .van-tab.van-tab--active"
        )[0];
        if (vantDom && vantDom.classList) {
          vantDom.classList.remove("van-tab--active");
        }
      });
      this.amount = "";
      this.$refs["amount-input"].blur && this.$refs["amount-input"].blur();
      if (
        this.list[this.portIndex]["requestType"] === "NNIA" &&
        this.list[old]["requestType"] !== "NNIA"
      ) {
        this.NNIA(now);
        this.portIndex = old;
      }
      if (this.list[this.portIndex]) {
        this.targetPort = this.list[this.portIndex];
        this.quick_amount = !!this.list[this.portIndex].quick_amount
          ? this.list[this.portIndex].quick_amount.split(",")
          : ["50", "100", "500", "1000", "5000"];
        this.showScrollList = false;
        setTimeout(() => {
          this.showScrollList = true;
          this.$nextTick(() => {
            let vantDom = document.querySelectorAll(
              ".amount-list > .van-tabs__wrap > .van-tabs__nav > .van-tab.van-tab--active"
            )[0];
            if (vantDom && vantDom.classList) {
              vantDom.classList.remove("van-tab--active");
            }
          });
        }, 100);
        this.setQuickAmount();
        this.paymentId = this.targetPort.id;
      } else {
        this.targetPort = null;
        this.paymentId = "";
      }
    },
  },
  created() {
    // this.getList(this.id);
    this.getPaymentMsgImg();
  },
  mounted() {
    // this.scroll = new BScroll(".amount-list", {
    //   scrollX: true,
    //   click: true
    // });
    // this.$refs.selector.$el.addEventListener('touchstart', evt => {
    //   evt.preventDefault()
    // })
  },
  methods: {
    bankTransfer() {
      // this.continue = 0
      this.showPayDialog = false;
      this.$emit("changeHeader", "充值中心");
      this.$store.state.main.saveMoney = this.amount;
    },
    noCallback() {
      // this.continue = 1
      this.showPayDialog = false;
      // this.amount = this.maxPay
    },
    reset() {
      this.amount = "";
      this.portIndex = 0;
      this.getList(this.id);
    },
    getList(id) {
      this.$store.dispatch("user/getSavePayment", {
        categoryId: this.id,
        callback: (res) => {
          if (res.code === 200) {
            this.list = res.data;
            if (this.list && this.list.length) {
              if (this.list[0]) {
                this.isNoPay = false
                this.targetPort = this.list[0];
                this.quick_amount = !!this.list[0].quick_amount
                  ? this.list[0].quick_amount.split(",")
                  : ["50", "100", "500", "1000", "5000"];
                // this.showScrollList = false
                setTimeout(() => {
                  this.showScrollList = true;
                  this.$nextTick(() => {
                    let vantDom = document.querySelectorAll(
                      ".amount-list > .van-tabs__wrap > .van-tabs__nav > .van-tab.van-tab--active"
                    )[0];
                    if (vantDom && vantDom.classList) {
                      vantDom.classList.remove(
                        ".amount-list > van-tab--active"
                      );
                    }
                  });
                }, 100);
                this.setQuickAmount();
                this.$nextTick(() => {
                  try {
                    if (
                      document.querySelectorAll(
                        ".amount-list > .van-tabs__wrap > .van-tabs__nav > .van-tab.van-tab--active"
                      )[0].classList
                    ) {
                      document
                        .querySelectorAll(
                          ".amount-list > .van-tabs__wrap > .van-tabs__nav > .van-tab.van-tab--active"
                        )[0]
                        .classList.remove(".amount-list > van-tab--active");
                    }
                  } catch (error) {
                    console.log(error);
                  }
                });
                this.paymentId = this.targetPort.id;
                if (this.targetPort["requestType"] === "NNIA") {
                  this.NNIA(0);
                  this.portIndex = 0;
                }
              } else {
                this.isNoPay = true;
                this.targetPort = null;
                this.paymentId = "";
              }
            } else {
              this.isNoPay = true;
            }
          } else {
            this.list = [];
            this.paymentId = "";
          }
        },
      });
    },
    setQuickAmount() {
      this.quick_amount1 = this.quick_amount.slice(0, 12);
      // this.quick_amount2 = this.quick_amount.slice(8, this.quick_amount.length);
    },
    getPaymentMsgImg() {
      this.$store
        .dispatch("main/getPaymentMsgImg")
        .then((res) => {
          if (res.code === 200 && JSON.stringify(res.data) !== "[]") {
            let data = JSON.parse(JSON.stringify(res.data));
            let msg = data.msg;
            msg = msg.replace(
              "{payTypeText}",
              `<span style='color:#058dd7'>${data.payTypeText}</span>`
            );
            msg = msg.replace(
              "{preferentialText}",
              `<span style='color:#d0690e'>${data.preferentialText}</span>`
            );
            msg = msg.replace(
              "{giftMoreText}",
              `<span style='color:#c21358'>${data.giftMoreText}</span>`
            );
            data["msg"] = msg;
            this.$store.commit("main/setSaveFailureData", data);
            this.$store.commit("main/setShowSaveFailure", true);
          }
        })
        .catch(() => {});
    },
    getIndex(name, title) {
      this.quick_amount = !!this.targetPort.quick_amount
        ? this.targetPort.quick_amount.split(",")
        : ["50", "100", "500", "1000", "5000"];
      this.setQuickAmount();
      this.amount = title;
      if (name == 0) {
        this.$nextTick(() => {
          try {
            document
              .querySelectorAll(
                ".amount-list > .van-tabs__wrap > .van-tabs__nav > .van-tab"
              )[0]
              .classList.add(".amount-list > van-tab--active");
          } catch (error) {}
        });
      }
    },
    /**
     * 搜狗,UC,QQ不可以在新窗口打开
     */
    canOpenInNewWin() {
      const uas = [
        "SogouMobileBrowser",
        "MQQBrowser",
        "UCBrowser",
        "baidubrowser",
        "MXiOS",
      ];

      return !uas.some((ua) =>
        new RegExp(ua, "gi").test(window.navigator.userAgent)
      );
    },
    NNIA(index) {
      let paymentId = this.list[index].id;
      if (this.submitting) {
        this.toastText("正在获取...", "top");
      } else {
        this.getPaymentMsgImg();
        this.submitting = true;
        this.$store.state.main.loadingText = "正在提交...";
        let newWin;
        if (this.canOpenInNewWin()) {
          newWin = window.open("about:blank", "_blank");
        }
        this.$store
          .dispatch("user/saveSubmitByPayment", {
            paymentId: paymentId,
            money: 0,
            type: "h5",
            categoryId: this.id,
          })
          .then((res) => {
            setTimeout(() => {
              this.submitting = false;
            }, 5000);
            this.$store.state.main.loadingText = "";
            if (res.code === 200) {
              this.amount = "";
              if (res.data.qrCode) {
                if (newWin) newWin.close();
                this.$router.push({
                  path: "/save/qr-code",
                  query: {
                    order: res.data.order,
                    qrcode: res.data.qrCode,
                    name: this.title,
                  },
                });
              } else {
                if (newWin) {
                  newWin.location.replace(res.data["formUrl"]);
                } else {
                  if (
                    this.$userAgent.includes("MQQBrowser") ||
                    (this.isIphone &&
                      this.$userAgent.includes("SogouMobileBrowser"))
                  ) {
                    //解决QQ浏览器回退后卡顿问题
                    //解决Iphone 搜狗浏览器回退卡顿问题
                    localStorage.setItem("backStatus", true);
                    sessionStorage.setItem(
                      "gameHref",
                      JSON.stringify(this.$route.path)
                    );
                    //增加浏览器历史记录
                    window.history.pushState(
                      window.location.href,
                      null,
                      window.location.href
                    );
                    window.location.replace(res.data["formUrl"]);
                  } else {
                    window.location.href = res.data["formUrl"];
                  }
                }
              }
            } else {
              newWin.close();
              setTimeout(() => {
                this.toastText(res.message, "top");
              }, 200);
            }
          })
          .catch(() => {
            newWin.close();
            this.submitting = false;
            this.$store.state.main.loadingText = "";
          });
      }
    },
    onSubmit() {
      if (this.submitting) {
        this.toastText("正在获取...", "top");
      } else if (isNaN(parseFloat(this.amount))) {
        this.toastText("请输入有效的金额", "top");
      } else if (
        !this.targetPort["formatAmount"] &&
        parseFloat(this.amount) < parseFloat(this.targetPort["minAmount"])
      ) {
        this.toastText(
          "支付金额不能小于" + this.targetPort["minAmount"] + "元",
          "top"
        );
      }
      //  else if(this.maxPay && this.amount > this.maxPay && this.continue == 1){
      //   this.showNo = true
      //   this.showPayDialog = true
      //   this.continue = 0
      // }
      else {
        this.getPaymentMsgImg();
        this.submitting = true;
        let newWin;
        this.$store
          .dispatch("user/saveSubmitByPayment", {
            paymentId: this.paymentId,
            money: this.amount,
            type: "h5",
            categoryId: this.id,
            // continue:this.continue
          })
          .then((res) => {
            setTimeout(() => {
              this.submitting = false;
            }, 1000);
            this.$store.state.main.loadingText = "";
            if (res.code === 200) {
              if (this.canOpenInNewWin()) {
                newWin = window.open("about:blank", "_blank");
              }
              this.amount = "";
              // this.continue = 0
              this.showNo = false;
              if (res.data.qrCode) {
                if (newWin) newWin.close();
                this.$router.push({
                  path: "/save/qr-code",
                  query: {
                    order: res.data.order,
                    qrcode: res.data.qrCode,
                    name: this.title,
                  },
                });
              } else {
                if (newWin) {
                  newWin.location.replace(res.data["formUrl"]);
                } else {
                  if (
                    this.$userAgent.includes("MQQBrowser") ||
                    (this.isIphone &&
                      this.$userAgent.includes("SogouMobileBrowser"))
                  ) {
                    //解决QQ浏览器回退后卡顿问题
                    //解决Iphone 搜狗浏览器回退卡顿问题
                    localStorage.setItem("backStatus", true);
                    sessionStorage.setItem(
                      "gameHref",
                      JSON.stringify(this.$route.path)
                    );
                    //增加浏览器历史记录
                    window.history.pushState(
                      window.location.href,
                      null,
                      window.location.href
                    );
                    window.location.replace(res.data["formUrl"]);
                  } else {
                    window.location.href = res.data["formUrl"];
                  }
                }
              }
            }
            // else if(res.code === 5014) {
            //   this.showNo = true
            //   this.payAlertText = res.message
            //   this.maxPay = Number(res.extra.max_amount)
            //   this.showPayDialog = true
            // }
            else if (res.code === 5015) {
              // this.payAlertText = res.message
              this.maxPay = Number(res.extra.dailyAmount);
              this.bankRate = Number(res.extra.bankRate);
              this.bal_amount = Number(res.extra.bal_amount);
              this.showPayDialog = true;
              // this.continue = 0
            } else {
              if (newWin) newWin.close();
              setTimeout(() => {
                this.toastText(res.message, "top");
              }, 200);
            }
          })
          .catch(() => {
            newWin.close();
            this.submitting = false;
            // this.continue = 0
            this.showNo = false;
          });
      }
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.pay-dialog {
  position: absolute;
  left: 50%;
  top: 43%;
  transform: translate3d(-50%, -50%, 0) scale(0);
  transition: all 400ms;
  transform-origin: top;
  .content {
    width: 6.8rem;
    height: 7.1rem;
    background-image: url("../../assets/img/save/pay-bg.png");
    background-size: 100% 100%;
    position: relative;
    overflow: hidden;
    p {
      font-size: 0.45rem;
      font-family: PingFang SC;
      font-weight: bold;
      color: #ffffff;
      height: 0.54rem;
      line-height: 0.54rem;
      &:first-child {
        margin-top: 3.2rem;
      }
      &:nth-child(2) {
        margin-top: 0.2rem;
      }
      span {
        color: #f6ff02;
        font-size: 0.54rem;
        font-weight: bold;
        display: inline-block;
        vertical-align: middle;
        margin-left: 0.02rem;
        height: 0.54rem;
        line-height: 0.45rem;
      }
    }
    .l-btn,
    .r-btn {
      position: absolute;
      bottom: 0.4rem;
      width: 3rem;
      height: 0.74rem;
    }
    .l-btn {
      left: 0.3rem;
    }
    .r-btn {
      right: 0.3rem;
    }
  }
}
.show .pay-dialog {
  transform: translate3d(-50%, -50%, 0) scale(1) !important;
}
.payAlert {
  .title {
    height: auto;
    line-height: 0.55rem !important;
    padding: 0.1rem 0;
  }
}
.amount-list {
  width: 100%;
  padding: 0 0.02rem 0.2rem 0;
  box-sizing: border-box;
  /deep/ .van-hairline--top-bottom::after {
    border-width: 0.02rem 0;
  }
  /deep/ .van-tabs__wrap {
    height: 0.9rem !important;
  }
  /deep/ .van-ellipsis {
    font-size: 0.38rem;
    font-weight: 500;
    color: #333333;
  }
  /deep/ .van-tab__text {
    font-size: 0.4rem;
    font-weight: 500;
    color: #333333;
  }
  /deep/ .van-tab {
    position: relative;
    width: 1.4rem;
    border: 0.02rem solid #f1f1f1;
    flex: none !important;
    margin-right: 0.2rem;
    border-radius: 0.1rem;
    height: 0.9rem !important;
    line-height: 0.9rem !important;
    /deep/ &:last-child {
      margin-right: 0 !important;
    }
  }
  /deep/ .van-tabs__nav {
    box-sizing: border-box;
    padding-left: 0;
    // margin: 0 0.1rem;
  }
  /deep/ .van-tab.van-tab--active {
    color: #000000;
  }
  /deep/ .van-tab.van-tab--active .van-ellipsis {
    color: #000000 !important;
  }

  .amount-item {
    position: relative;
    box-sizing: border-box;
    border-radius: 0.1rem;
    color: #010101;
    font-size: 0.34rem;
    height: 0.76rem;
    line-height: 0.76rem;
    margin-top: 0.2rem;
    margin-right: 0.2rem;
    width: 1.54rem;
    float: left;
    box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.02);
    background-color: #fff;

    &:last-of-type {
      margin-right: 0 !important;
    }

    &.active {
      color: #010101 !important;
      box-shadow: 0px 0px 13px 0px rgba(0, 189, 212, 0.5);
    }
  }
}
/deep/ .van-hairline--top-bottom {
  border-width: 0.02rem 0 !important;
}
/deep/ .user-input-row {
  padding-left: 0 !important;
  &.redColor {
    .input {
      color: red !important;
      font-size: 0.45rem !important;
    }
  }
  &.redColor {
    .placeholder {
      color: #adafbb !important;
    }
  }
  &::after {
    left: 0 !important;
    top: 98%;
    margin-right: 0.1rem;
  }
  &:first-child::after {
    display: block;
  }
}
.amount-input-label {
  .redColor {
    color: red !important;
    font-size: 0.4rem;
  }
}
.item-icon {
  position: absolute;
  width: 0.45rem;
  height: 0.45rem;
  position: absolute;
  right: -0.02rem;
  bottom: -0.04rem;
}
.title {
  margin-left: 0.25rem;
  height: 0.85rem;
  line-height: 0.85rem;
  font-size: 0.33rem;
  color: #333;
  text-align: left;
  .des {
    color: #444444;
    font-size: 0.26rem;
  }
}
.submit-payment {
  width: 100%;
  padding: 0;
  // margin: 0.2rem 0 0 0;
  box-sizing: border-box;
  background-color: #fafafa;
  .pay-title {
    font-size: 0.34rem;
    font-weight: 500;
    color: #333333;
    text-align: left;
    padding: 0.33rem 0 0.35rem 0.22rem;
    background: #fff;
  }
  .rmb {
    font-size: 0.78rem;
  }
  .pay-tabs {
    position: unset;
    padding-bottom: 0.1rem;
    background-color: #fafafa;
    margin-bottom: 0.16rem;
    /deep/.van-tabs__wrap {
      position: unset;
      margin-left: 0.05rem;
      .van-tabs__line {
        display: none;
      }
      .van-tabs__nav {
        padding-left: 0;
        padding-right: 0.14rem;
        box-sizing: border-box;
        :nth-last-child(2) {
          margin-right: 0 !important;
        }
        .van-tab__text {
          display: block;
          width: 100%;
          height: 100%;
        }
        .van-tab {
          width: 2.14rem;
          max-width: 2.14rem;
          min-width: 2.14rem;
          height: 0.87rem;
          border-radius: 0.1rem;
          margin-right: 0.25rem;
          margin-top: 0.14rem;
          padding: 0;
          box-sizing: border-box;
          background-color: #ffffff;
          box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.02);
          position: relative;
          &.van-tab--active {
            box-shadow: 0px 0px 6px 0px rgba(0, 189, 212, 0.5);
            border: none;
          }
          &:first-child {
            margin-left: 0.25rem;
          }
          .tit {
            font-size: 0.36rem;
            width: 100%;
            height: 0.45rem;
            line-height: 0.5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: normal;
            color: #333;
          }
          .txt {
            width: 100%;
            height: 0.4rem;
            line-height: 0.38rem;
            font-size: 0.24rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transform: scale(0.94);
            color: #525252;
            font-weight: normal;
          }
        }
      }
    }
  }
  /deep/ .van-tabs__wrap {
    height: 1.12rem !important;
    .van-tabs__nav {
      background-color: transparent;
      .van-tab__text {
        height: 100%;
        -webkit-line-clamp: inherit;
      }
    }
    .van-tabs__line {
      width: 1.4rem;
    }
  }

  /deep/ .van-tab {
    font-size: 0.3rem !important;
    line-height: 0.84rem !important;
    min-width: 1.5rem;
    max-width: 2.4rem;
  }

  /deep/ .van-ellipsis {
    display: inline-block !important;
  }

  .port-content {
    width: 100%;
    padding: 0;
    background-color: #fafafa;
    /deep/.van-tabs {
      &:after {
        content: none;
        display: none;
      }
    }
    /deep/.van-hairline--top-bottom {
      &:after {
        content: none;
        display: none;
      }
    }
  }

  .format-mount {
    position: relative;
    width: 100%;
    padding: 0 0.25rem;
    box-sizing: border-box;

    /deep/ .input {
      height: 1rem !important;
      line-height: 1rem !important;
      // left: 0.4rem;
      font-size: 0.45rem !important;
      box-sizing: border-box !important;
      font-family: PingFang-SC-Regular, serif !important;
      font-weight: 400;
      color: #666;
      width: 200%;
      transform: none;
      &.placeholder {
        font-size: 0.34rem !important;
      }
    }

    /deep/ .user-input-row {
      height: 1rem !important;
      padding-left: 0 !important;
      // border-bottom: 0.02rem solid #ebedf0;
    }

    /deep/ .img-label {
      width: 0.24rem;
      margin-right: 0.2rem;
    }

    /deep/ .placeholder {
      color: #adafbb;
    }
  }

  .amount-input {
    width: 100%;
    padding: 0 0.25rem !important;
    box-sizing: border-box;
    background-color: #fafafa;
    /deep/.img-label {
      width: 0.24rem;
      margin-right: 0.2rem;
    }
    /deep/.user-input-row input {
      height: 0.6rem;
      line-height: 0.6rem;
      font-size: 0.4rem !important;
    }

    .amount-list-ul {
      width: auto;
      overflow-x: auto;
      white-space: nowrap;
      height: 1.1rem;
      text-align: left;
      &::-webkit-scrollbar {
        display: none;
        width: 0 !important;
      }
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: transparent;
      }
      .amount-item {
        position: relative;
        text-align: center;
        display: inline-block;
        margin-top: 0;
        float: none;
      }
    }

    .old_money {
      height: 1.1rem;
      /deep/ .van-tab {
        width: 1.26rem;
      }
    }
    .new_money {
      /deep/ .van-tab {
        width: 1.4rem;
        // overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .save-submit {
    width: 6.74rem;
    margin: 0.5rem auto 0.25rem;
    height: 0.847rem;
    display: block;
    font-size: 0.4rem;
    color: #ffffff;
    line-height: 0.847rem;
    background: linear-gradient(90deg, #00b2c8 0%, #00bdd4 100%);
    border-radius: 0.43rem;
  }
  .info {
    color: #ff8000;
    font-size: 0.29rem;
    padding: 0.2rem 0.25rem;
    line-height: 0.4rem;
    text-align: justify;
    font-family: PingFangTC-Regular, PingFangTC;
  }
  .no-data {
    width: 35%;
    display: block;
    margin: 0 auto;
    padding-top: 2rem;
    box-sizing: border-box;
  }
  &.newQP-box {
    .pay-tabs {
      margin-bottom: 0.3rem;
    }
    [class*="van-hairline"]::after {
      border-bottom: none !important;
      border: none !important;
    }
    /deep/ [class*="van-hairline"]::after {
      border-bottom: none !important;
      border: none !important;
    }
    .amount-list {
      .amount-item {
        background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0) 0%,
          #000000 100%
        ) !important;
        border: 0.02rem solid #373737 !important;
        color: #f6cf32 !important;
        &.active {
          box-shadow: none !important;
          border: 0.02rem solid #e5b802 !important;
          color: #f6cf32 !important;
        }
      }
    }
    /deep/.van-tabs__wrap {
      .van-tab {
        color: #fff !important;
        background: linear-gradient(180deg, #181818, #0c0c0c) !important;
        border: 0.02rem solid #383838 !important;
        background-color: #000 !important;
        .van-tab__text {
          color: #fff !important;
        }
        &.van-tab--active {
          box-shadow: none !important;
          border: 0.02rem solid #e5b802 !important;
          .van-tab__text p {
            color: #f6d033 !important;
          }
        }
      }
    }
    /deep/ .amount-input {
      .amount-input-label {
        &::before,
        &::after {
          border-top: 0.02rem solid #242424 !important;
          border-bottom: 0.02rem solid #242424 !important;
        }
      }
      .rmb {
        color: #f6d033 !important;
      }
      input {
        color: #fff !important;
      }
    }
    .format-mount {
      /deep/ .user-input-row {
        border-bottom: none;
        &::before {
          // border-top: 0.02rem solid #242424 !important;
        }
      }
      .rmb {
        color: #f6d033 !important;
      }
      /deep/ .input {
        color: #fff !important;
        &.placeholder {
          color: #999 !important;
        }
      }
    }
  }
  &.blush-box {
    .pay-tabs {
      margin-bottom: 0.3rem;
    }
    [class*="van-hairline"]::after {
      border-bottom: none !important;
      border: none !important;
    }
    /deep/ [class*="van-hairline"]::after {
      border-bottom: none !important;
      border: none !important;
    }
    .amount-list .amount-item {
      color: #fff !important;
      border: 0.02rem solid transparent !important;
      background: #530107 !important;
      &.active {
        box-shadow: none !important;
        color: #f6d033 !important;
        border: 0.02rem solid #e5b802 !important;
      }
    }
    /deep/.van-tabs__wrap {
      .van-tab {
        color: #fff !important;
        background: #530107 !important;
        border: 0.02rem solid transparent !important;
        background-color: #72010b !important;
        .van-tab__text {
          color: #fff !important;
        }
        &.van-tab--active {
          box-shadow: none !important;
          border: 0.02rem solid #e5b802 !important;
          .van-tab__text {
            color: #f6d033 !important;
          }
        }
      }
    }
    /deep/ .amount-input {
      .amount-input-label {
        &::before,
        &::after {
          border-top: 0.02rem solid #242424 !important;
          border-bottom: 0.02rem solid #242424 !important;
        }
      }
      .rmb {
        color: #f6d033 !important;
      }
      input {
        color: #fff !important;
      }
    }
    .format-mount {
      /deep/ .user-input-row {
        &::before {
          border-top: 0.02rem solid #242424 !important;
        }
      }
      .rmb {
        color: #f6d033 !important;
      }
      /deep/ .input {
        color: #fff !important;
        &.placeholder {
          color: #999 !important;
        }
      }
    }
  }

  // for QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 start
  //控制 內容 背景顏色 && 按鈕顏色 && 字體顏色
  .QP839-box {
    background-color: #1b1d1b; //充值中心背景顏色
    .format-mount {
      //充值中心控制 按鈕顏色 && 字體顏色 && 邊框顏色
      .amount-list .amount-item {
        color: #fff !important; //充值中心按鈕字體顏色
        border: 0.02rem solid transparent !important; //充值中心按鈕邊框顏色
        background: #272829 !important; //充值中心按鈕背景顏色
        &.active {
          box-shadow: none !important; //充值中心按鈕移除陰影
          background: #1b1d1b !important; //充值中心按鈕背景顏色
          border: 0.02rem solid #c02e26 !important; //充值中心按鈕邊框顏色
        }
      }
    }
    .amount-input {
      //充值中心控制 按鈕顏色 && 字體顏色 && 邊框顏色
      .amount-list .amount-item {
        color: #fff !important; //充值中心按鈕字體顏色
        border: 0.02rem solid transparent !important; //充值中心按鈕邊框顏色
        background: #272829 !important; //充值中心按鈕背景顏色
        &.active {
          box-shadow: none !important; //充值中心按鈕移除陰影
          background: #1b1d1b !important; //充值中心按鈕背景顏色
          border: 0.02rem solid #c02e26 !important; //充值中心按鈕邊框顏色
        }
      }
    }
  }
  // for QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 end
}
</style>
