<template>
  <div
    class="content"
    ref="content"
    :class="[
      { 'newQP-container': $config.newQP || $config.blackTheme },
      { 'blush-container': $config.blush },
      { 'QP839-container': $config.isBlackRedTheme },
    ]"
  >
    <div class="usdt-submit theme-header-bg" v-if="isNoPay">
      <img
        class="no-data"
        :src="require('@src/assets/img/no-pay-tongdao.png')"
        alt
      />
    </div>
    <div
      class="usdt-submit theme-header-bg"
      :class="[{ 'QP839-submit': $config.isBlackRedTheme }]"
      v-else
    >
      <div v-if="setp === 1">
        <!-- <div class="title theme-color-white">虚拟币种类</div>
      <div class="species theme-color-white theme-main-bg">
        USDT
        <img
          :src="payImg"
          class="item-icon"
        />
      </div> -->
        <!-- <div class="title theme-color-white">协议</div> -->
        <div class="usdt-area">
          <div class="scroll-box" ref="scrollBox">
            <div class="usdt-list">
              <div
                :class="[
                  'usdt-item',
                  'theme-main-bg',
                  { 'theme-border-1px': $config.newQP || $config.blackTheme },
                  { active: i === usdtIndex },
                ]"
                v-for="(item, i) in list"
                :key="i"
                @click="usdtIndex = i"
              >
                <span class="pay_name theme-color-white">{{
                  item.pay_name
                }}</span>
                <img :src="payImg" class="item-icon" v-if="i === usdtIndex" />
              </div>
            </div>
          </div>
        </div>
        <div class="input-area theme-header-bg" v-if="targetusdt">
          <div class="title theme-color-white">存款金额</div>
          <input-row
            :class="{
              redColor: !$config.newQP && !$config.blackTheme && !$config.blush,
            }"
            v-keyBroayStates
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
            ref="amount"
            v-model="amount"
            type="tel"
            max-len="10"
            placeholder="请输入充值金额"
            ><img
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
          <div class="money-des">
            <p>
              参考汇率<span>1 USDT ≈ {{ targetusdt["usdtDepositRate"] }}</span
              >CNY&nbsp;预计支付<span>{{ usdtNumber }}</span
              >USDT
            </p>
            <p>请以实际支付时的汇率为准，到帐金额为提交订单时的RMB金额。</p>
          </div>
          <ul
            class="amount-list clearfix"
            v-if="quick_amount && quick_amount.length"
          >
            <li
              class="amount-item"
              :class="{ active: amount === item }"
              v-for="item in quick_amount"
              :key="item"
              @click="amount = item"
            >
              {{ item }}
              <img :src="payImg" class="item-icon" v-if="amount === item" />
            </li>
          </ul>
          <!-- <div class="title theme-color-white" v-if="bonusList.length">选择首存返利</div>
          <div class="select" @click="showPicker = true" v-if="bonusList.length">
            <div class="txt">{{bonus}}</div>
            <div class="date-icon icon iconfont h5-icon-qushi-moreup"></div>
          </div> -->
        </div>
      </div>
      <div v-if="setp === 2" class="setp2">
        <div class="setp2-info theme-gradient-bg-2">
          <div class="usdt-num">
            <span class="txt theme-color-white">区块链交易ID:</span>
            <input
              class="theme-color-white"
              ref="bankSerialNumber"
              type="text"
              placeholder="请输入后六位"
              maxlength="6"
              v-model="bankSerialNumber"
            />
          </div>
          <div class="usdt-num">
            <span class="txt theme-color-white">存款金额(元):</span>
            <span class="num theme-color-yellow">{{ amount }} 元</span>
          </div>
          <div class="usdt-num">
            <span class="txt theme-color-white">需转入:</span>
            <span
              @click="onCopy(usdtNumber)"
              class="
                copy
                theme-gradient-bg theme-color-yellow theme-border-yellow
              "
              >复制</span
            >
            <span class="num theme-color-yellow">{{ usdtNumber }} USDT</span>
          </div>
          <p class="address theme-color-white">存款地址</p>
          <div class="qr-area">
            <img :src="targetusdt.qrCodeImg" alt="" />
          </div>
          <div
            class="usdt-address theme-color-gray-9"
            :class="{ 'theme-border-1px': $config.newQP || $config.blackTheme }"
          >
            {{ targetusdt.address }}
          </div>
          <div
            class="copy-address theme-yellow-bg-3 theme-color-black"
            @click="onCopy(targetusdt.address)"
          >
            复制地址
          </div>
        </div>
        <div class="tips theme-gradient-bg-2">
          <p class="tips-tit theme-color-white">温馨提示</p>
          <p class="tips-des theme-color-gray-9">
            1.请勿向上述地址支付任何非<span>{{ targetusdt["pay_name"] }}</span
            >资产，否则资产无法找回；
          </p>
          <p class="tips-des theme-color-gray-9">
            2.当前OKEX/火币/币安交易所USDT最新场外卖出价<span>{{
              targetusdt["usdtDepositRate"]
            }}</span
            >元；
          </p>
          <p class="tips-des theme-color-gray-9">
            3.请确保收款地址存入<span></span
            ><span class="red">(不含手续费）</span>，否则无法到帐；
          </p>
          <p class="tips-des theme-color-gray-9">
            4.您支付至上述存款地址，需要整个网络节点确认，请耐心等待。
          </p>
        </div>
      </div>
      <button
        type="button"
        :class="[
          { 'amhg-save-submit': $config.home === 'amhg' },
          { 'QP839-save-submit': $config.isBlackRedTheme },
          'save-submit',
          'theme-bg',
          'theme-yellow-bg',
          'theme-color-black',
          'theme-yellow-bg-3',
        ]"
        :disabled="submitting"
        @touchstart.capture="onSubmit($event)"
      >
        <template v-if="submitting">正在提交...</template>
        <template v-else>{{ setp == 1 ? "立即存款" : "已支付完成" }}</template>
      </button>
      <div style="height: 2rem"></div>
    </div>
    <save-popup :show="showPicker" :btnValue="'确定'" @onConfirm="onConfirm">
      <div slot="head" class="back-tit">
        <span class="txt theme-color-white">选择首存返利</span>
        <span class="btn" @click="showPicker = false">取消</span>
      </div>
      <van-picker
        :visible-item-count="3"
        :columns="bonusList"
        slot="content"
        class="bank-picker"
        @change="onChange"
      />
    </save-popup>
    <pub-dialog v-model="showDialog" ref="showDialog" style="z-index: 99">
      <div class="dialog-cont">
        <img
          src="../../assets/img/save/usdt/close-dialog.png"
          class="close-btn"
          @click="closeDialog"
        />
        <p class="tit">USDT收款二维码</p>
        <img :src="qrCode" class="qrcode" />
        <p class="tip1">截屏或长按二维码保存</p>
        <p class="tip2">请使用APP扫描付款</p>
      </div>
    </pub-dialog>
  </div>
</template>

<script type="text/javascript">
import IScroll from "iscroll/build/iscroll-probe";
import savePopup from "../../components/save-popup/index.vue";
export default {
  name: "SubmitUSDT",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      submitting: false,
      list: [],
      isNoPay: false,
      usdtIndex: 0,
      amount: "",
      usdtNumber: 0,
      showDialog: false,
      qrCode: "",
      targetusdt: null,
      scroll: null,
      bonus: "",
      bonusList: [],
      quick_amount: [],
      showPicker: false,
      setp: 1,
      pickerIndex: 0,
      bankSerialNumber: "",
    };
  },
  created() {
    this.$store.dispatch("user/getSaveUsdt", {
      classId: this.id,
      callback: (res) => {
        if (res.code === 200) {
          this.list = res.data;
          if (this.list.length) {
            this.targetusdt = this.list[0];
            this.usdtIndex = 0;
          } else {
            this.isNoPay = true;
          }
          setTimeout(() => {
            this.scroll && this.scroll.refresh();
          }, 300);
        } else {
          this.list = [];
          this.isNoPay = true;
        }
      },
    });
    this.$store
      .dispatch("user/getDepositBonusList", { depositType: "usdt" })
      .then((res) => {
        if (res.code === 200 && res.data.length) {
          res.data.forEach((item) => {
            let bonusItem = `首存返利${item.bonusRate}%`;
            bonusItem = bonusItem.replace("rate_", "");
            this.bonusList.push(bonusItem);
          });
          this.bonus = this.bonusList[0];
        }
      })
      .catch(() => {});
  },
  watch: {
    usdtIndex(val, old) {
      this.targetusdt = this.list[val];
    },
    targetusdt(now, old) {
      if (now.quick_amount) {
        this.quick_amount = now.quick_amount.split(",");
      } else {
        this.quick_amount = [];
      }
    },
    amount(now) {
      if (Number(now) <= 0) {
        this.amount = "";
        this.usdtNumber = "";
      } else {
        this.usdtNumber =
          (
            Math.round(
              (now / Number(this.targetusdt["usdtDepositRate"])) * 1000
            ) / 1000
          ).toFixed(3) + "";
      }
    },
  },
  components: {
    savePopup,
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
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.scroll = new IScroll(this.$refs.scrollBox, {
          useTransition:
            this.$mobileDevice.osVersion.split(".")[0] >= 13 &&
            this.$mobileDevice.osVersion.split(".")[1] >= 3
              ? false
              : true,
          bindToWrapper: true,
          click: true,
          scrollX: true,
          scrollY: false,
          disableMouse: true,
          eventPassthrough: "vertical",
          preventDefault: true,
          bounceTime: 300,
        });
      });
    }, 300);
  },
  methods: {
    setp1() {
      this.setp = 1;
    },
    onChange(picker, value, index) {
      this.pickerIndex = index;
    },
    onConfirm() {
      this.bonus = this.bonusList[this.pickerIndex];
      this.showPicker = false;
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
    onSubmit(el) {
      el.target.focus();
      if (this.setp == 1) {
        if (!this.amount.length) {
          this.toastText("请输入充值金额", "top");
        } else if (
          Number(this.amount) < Number(this.targetusdt["min_amount"])
        ) {
          this.toastText(`最小充值金额${this.targetusdt["min_amount"]}`, "top");
        } else if (this.bonusList.length && !this.bonus) {
          this.toastText("请选择优惠比例", "top");
        } else {
          this.$emit("changeHeader", "虚拟币充值");
          this.setp = 2;
        }
      } else {
        if (this.submitting) {
          this.toastText("正在提交,请稍等~~~", "top");
        } else if (
          !this.bankSerialNumber ||
          this.bankSerialNumber.length !== 6
        ) {
          this.toastText("请输入区块链交易ID后六位", "top");
        } else {
          this.submitting = true;
          let submitData = {
            device: "h5",
            depositId: this.targetusdt["id"],
            classId: this.targetusdt["classId"],
            className: this.targetusdt["className"],
            bankId: this.targetusdt["address"],
            usdt_count: this.usdtNumber,
            bankSerialNumber: this.bankSerialNumber,
          };
          if (this.bonusList.length) {
            submitData["bonusRate"] = this.bonus
              .split("首存返利")[1]
              .replace("%", "");
          }
          this.$store
            .dispatch("user/saveSubmitByUsdt", submitData)
            .then((res) => {
              setTimeout(() => {
                this.submitting = false;
              }, 500);
              setTimeout(() => {
                if (this.bonusList.length) {
                  this.bonus = this.bonusList[0];
                }
              }, 500);
              if (res.code === 200) {
                setTimeout(() => {
                  this.toastText("提交成功,等待管理员审核", "top");
                  this.amount = "";
                  this.usdtNumber = 0;
                  this.setp = 1;
                  this.bankSerialNumber = "";
                  this.$emit("changeHeader", "充值中心");
                }, 500);
              } else if (res.message) {
                setTimeout(() => {
                  this.amount = "";
                  this.usdtNumber = 0;
                  this.setp = 1;
                  this.bankSerialNumber = "";
                  this.toastText(res.message, "top");
                  this.$emit("changeHeader", "充值中心");
                }, 500);
              } else if (res.msg) {
                setTimeout(() => {
                  this.amount = "";
                  this.usdtNumber = 0;
                  this.setp = 1;
                  this.bankSerialNumber = "";
                  this.toastText(res.msg, "top");
                  this.$emit("changeHeader", "充值中心");
                }, 500);
              }
            })
            .catch(() => {
              setTimeout(() => {
                this.submitting = false;
              }, 500);
            });
        }
      }
    },
    showDialogHandle(img) {
      this.qrCode = img;
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
      this.qrCode = "";
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.setp2 {
  font-family: PingFangTC-Regular, PingFangTC;
  overflow: hidden;
  .setp2-info {
    width: 6.92rem;
    background-color: #fff;
    box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.05);
    border-radius: 0.18rem;
    margin-bottom: 0.22rem;
    padding: 0 0.27rem;
    margin-top: 0.2rem;
    overflow: hidden;
    .head {
      overflow: hidden;
      text-align: center;
      border-bottom: 0.02rem solid #e4e4e4;
      .money-txt {
        margin-top: 0.15rem;
        color: #555555;
        font-size: 0.28rem;
      }
      .amount {
        color: #ff8000;
        font-size: 0.6rem;
        padding-bottom: 0.18rem;
      }
    }
    .usdt-num {
      overflow: hidden;
      height: 0.85rem;
      line-height: 0.85rem;
      font-size: 0.32rem;
      color: #333333;
      input {
        text-align: right;
        width: 4rem;
        &::placeholder {
          // float: right;
        }
      }
      .txt {
        float: left;
      }
      .num {
        float: right;
        margin-right: 0.2rem;
        color: #fe9932;
      }
      .copy {
        width: 0.9rem;
        height: 0.5rem;
        line-height: 0.5rem;
        margin-top: 0.185rem;
        float: right;
        font-size: 0.28rem;
        border: 0.02rem solid #00bbd2;
        color: #00bbd2;
        border-radius: 0.08rem;
      }
    }
    .address {
      height: 0.85rem;
      line-height: 0.85rem;
      text-align: left;
      font-size: 0.32rem;
      color: #333333;
    }
    .qr-area {
      width: 2.26rem;
      height: 2.26rem;
      background: #ffffff;
      box-shadow: 0px 0px 13px 0px rgba(221, 221, 221, 1);
      border-radius: 0.18rem;
      margin: 0 auto;
      padding: 0.14rem;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .usdt-address {
      width: 100%;
      line-height: 0.45rem;
      font-size: 0.32rem;
      color: #333333;
      margin-top: 0.2rem;
      border-radius: 9px;
      border: 0.02rem solid #dddddd;
      word-wrap: break-word;
      text-align: left;
      padding: 0 0.2rem;
    }
    .copy-address {
      width: 3.48rem;
      height: 0.87rem;
      line-height: 0.87rem;
      margin: 0.36rem auto 0.45rem;
      background: linear-gradient(90deg, #00b2c8 0%, #00bdd4 100%);
      border-radius: 0.43rem;
      color: #fff;
      font-size: 0.4rem;
    }
  }
  .tips {
    text-align: left;
    width: 6.92rem;
    padding: 0.3rem 0.25rem;
    background-color: #fff;
    box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.05);
    border-radius: 0.18rem;
    .tips-tit {
      font-size: 0.33rem;
      color: #333333;
      font-weight: 400;
    }
    .tips-des {
      color: #555555;
      font-size: 0.27rem;
    }
    span {
      color: #ff8000;
    }
    .red {
      color: #f64062;
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
.usdt-submit {
  width: 100%;
  padding: 0;
  margin: 0;
  height: 100%;
  background-color: #fafafa;
  padding-left: 0.29rem;
  .select {
    width: 6.92rem;
    height: 0.87rem;
    line-height: 0.87rem;
    padding: 0 0.33rem;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #f2f2fa;
    border-radius: 0.09rem;
    .txt {
      color: #333333;
      font-size: 0.3rem;
      float: left;
    }
    .icon {
      float: right;
      font-size: 0.3rem;
      transform: scale(0.5) rotateZ(180deg);
      color: #000;
    }
  }
  .item-icon {
    width: 0.45rem;
    height: 0.45rem;
    position: absolute;
    right: -0.02rem;
    bottom: -0.04rem;
  }
  .title {
    height: 0.85rem;
    line-height: 0.85rem;
    font-size: 0.33rem;
    color: #333;
    text-align: left;
  }
  .amount-list {
    width: 100%;
    box-sizing: border-box;
    .amount-item {
      position: relative;
      box-sizing: border-box;
      border-radius: 0.1rem;
      width: 1.54rem;
      color: #000;
      font-size: 0.34rem;
      height: 0.76rem;
      line-height: 0.76rem;
      margin-top: 0.2rem;
      margin-right: 0.2rem;
      width: 1.5rem;
      float: left;
      box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.02);
      background-color: #fff;
      &:last-of-type {
        margin-right: 0 !important;
      }

      &.active {
        box-shadow: 0px 0px 13px 0px rgba(0, 189, 212, 0.5);
        color: #000 !important;
      }
    }
  }
  /deep/ .user-input-row {
    padding-left: 0rem;
    .input {
      height: 0.6rem;
      line-height: 0.6rem;
      font-size: 0.4rem !important;
    }
    &.redColor {
      .input {
        color: red !important;
        font-size: 0.4rem;
      }
    }
    .img-label {
      width: 0.24rem;
      margin-right: 0.2rem;
    }
    &::after {
      left: 0 !important;
      top: 98%;
      margin-right: 0.1rem;
    }
  }
  .species {
    position: relative;
    width: 2.14rem;
    height: 0.87rem;
    line-height: 0.87rem;
    border-radius: 0.1rem;
    background-color: #fff;
    overflow: hidden;
    font-size: 0.31rem;
    color: #010101;
    box-shadow: 0px 0px 13px 0px rgba(0, 189, 212, 0.5);
  }
  .help-area {
    background-color: #fafafa;
    padding-bottom: 0.32rem;
    .help-title {
      padding: 0.24rem 0.2rem;
      font-size: 0.349rem;
      color: #333;
      text-align: left;
    }

    .help-box {
      display: block;
      width: 7.1rem;
      height: 0.84rem;
      line-height: 0.84rem;
      margin: 0 auto;
      background-color: #fff5d9;
      border-radius: 0.1rem;
      border: 0.01rem solid #ededed;
      box-sizing: border-box;
      font-size: 0.28rem;
      padding: 0 0.24rem;
      a {
        display: inline-block;
        color: #060eb5d1;
        &:first-child {
          float: left;
        }
        &:last-child {
          float: right;
        }
        &:active {
          color: #060eb5;
        }
      }
    }
  }
  .amhg-help-area {
    padding: 0.33rem 0.32rem 0.35rem 0.22rem;
    background: #fff;
    .address {
      font-size: 0.34rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    .jc {
      font-size: 0.24rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #e9b741;
      margin-top: 0.05rem;
    }
  }

  .usdt-area {
    width: 100%;
    box-sizing: border-box;
    .scroll-box {
      width: 100%;
      height: 100%;
      .usdt-list {
        width: auto;
        min-width: 100%;
        height: 100%;
        white-space: nowrap;
        display: inline-block;
        .usdt-item {
          float: left;
          position: relative;
          width: 2.14rem;
          height: 0.87rem;
          line-height: 0.87rem;
          border-radius: 0.1rem;
          margin-right: 0.2rem;
          padding: 0;
          background-color: #fff;
          overflow: hidden;
          font-size: 0.31rem;
          color: #010101;
          box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.02);
          &.active {
            box-shadow: 0px 0px 13px 0px rgba(0, 189, 212, 0.5);
          }
          .link,
          .qr-code {
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
            }
          }
          .link,
          .qr-code {
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
  .line {
    height: 0.2rem;
    background: #f6f6f6;
  }

  .input-area {
    background-color: #fafafa;
    .money-des {
      margin-top: 0.1rem;
      color: #555555;
      font-size: 0.28rem;
      text-align: left;
      span {
        color: #ff8000;
        padding: 0 0.1rem;
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

      .txt {
        font-size: 0.3rem;
        color: #333;
        text-align: left;
        flex: 1;
        user-select: all !important;
        &.gray {
          color: #a8aab7;
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
    color: #575e68;
    font-size: 0.28rem;
    padding: 0.2rem 0.3rem 0.4rem 0.3rem;
    line-height: 0.36rem;
    text-align: justify;
  }
  .amhg-info {
    margin-top: 0.2rem;
    span {
      display: block;
      color: #ff2100;
      margin-bottom: 0.1rem;
    }
    color: #575e68;
    font-size: 0.28rem;
    padding: 0.2rem 0.3rem 0.4rem 0.3rem;
    line-height: 0.36rem;
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
.dialog-cont {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0) scale(0);
  transition: all 400ms;
  transform-origin: center;
}

.show .dialog-cont {
  transform: translate3d(-50%, -50%, 0) scale(1) !important;
}
.dialog-cont {
  width: 5.98rem;
  height: 6.18rem;
  background-color: #fff;
  border-radius: 0.2rem;
  text-align: center;
  font-family: PingFang SC;
  .tit {
    color: #3b3b3b;
    font-size: 0.36rem;
    margin-top: 0.3rem;
    font-weight: bold;
  }
  .qrcode {
    width: 3rem;
    height: 3rem;
    margin: 0.57rem auto 0;
    -webkit-touch-callout: default;
    -webkit-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
  .tip1 {
    color: #4d8ffa;
    font-size: 0.28rem;
    margin-top: 0.2rem;
    font-weight: 500;
  }
  .tip2 {
    color: #6d6d6d;
    font-size: 0.26rem;
    font-weight: 500;
    margin-top: 0.1rem;
  }
  .close-btn {
    width: 0.3rem;
    height: 0.3rem;
    position: absolute;
    right: 0.56rem;
    top: 0.34rem;
  }
}
.newQP-container {
  .usdt-num {
    input {
      &::placeholder {
        // color: #666 !important;
      }
    }
  }
  .species,
  .usdt-item.active {
    box-shadow: none !important;
    border: 0.02rem solid #f6cf32 !important;
    span {
      color: #f6cf32 !important;
    }
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
        border: 0.02rem solid #f6cf32 !important;
        color: #f6cf32 !important;
      }
    }
  }
  .select {
    background-color: #161616;
    .txt {
      color: #fff;
    }
    .icon {
      color: #9e9e9e;
    }
  }
}
.blush-container {
  .species,
  .usdt-item.active {
    box-shadow: none !important;
    border: 0.02rem solid #f6cf32 !important;
    span {
      color: #f6cf32 !important;
    }
  }
  .amount-list {
    .amount-item {
      background: #530107 !important;
      color: #f6cf32 !important;
      &.active {
        box-shadow: none !important;
        border: 0.02rem solid #f6cf32 !important;
        color: #f6cf32 !important;
      }
    }
  }
  .select {
    background-color: #530107;
    .txt {
      color: #fff;
    }
    .icon {
      color: #9e9e9e;
    }
  }
}

// for QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 start
//控制 內容 背景顏色 && 按鈕顏色 && 字體顏色
.QP839-container {
  .QP839-submit {
    background-color: #1b1d1b; //USTD轉帳背景顏色
    .usdt-item {
      background: #272829; //USTD轉帳按鈕背景顏色
      color: #fff; //USTD轉帳按鈕字體顏色
    }
    .species,
    .usdt-item.active {
      box-shadow: none !important; //USTD轉帳按鈕選中去除陰影
      border: 1px solid #c62721 !important; //USTD轉帳按鈕選中邊框顏色
      background: #1b1d1b !important; //USTD轉帳按鈕選中背景顏色
      span {
        color: #fff !important; //USTD轉帳按鈕選中字體顏色
      }
    }
    //控制存款金額內容 背景顏色 && 輸入框 && 字體顏色
    .input-area.theme-header-bg {
      background-color: #1b1d1b; //USTD轉帳內容背景顏色
      .title {
        color: #fff; //USTD轉帳標題字體顏色
      }
      //控制USTD轉帳按鈕 背景顏色 && 字體顏色
      .amount-list {
        .amount-item {
          background: #272829 !important; //USTD按鈕背景顏色
          color: #ffffff !important; //USTD按鈕字體顏色
          &.active {
            box-shadow: none !important; //USTD按鈕選中去除陰影
            border: 0.02rem solid #c62721 !important; //USTD按鈕選中邊框顏色
            color: #ffffff !important; //USTD按鈕選中字體顏色
            background: #1b1d1b !important; //USTD按鈕選中背景顏色
          }
        }
      }

      //控制USTD轉帳提示文字 字體顏色
      .money-des {
        color: #fff; //USTD轉帳提示字體顏色
        span {
          color: #f55c45; //USTD轉帳提示特別標註字體顏色
        }
      }
    }

    //控制USTD轉帳明細 背景顏色 && 字體顏色
    .setp2-info {
      background-color: #272829; //USTD轉帳明細背景顏色
      .usdt-num {
        color: #ffffff; //USTD轉帳明細字體顏色
        .num {
          color: #f55c45 //USTD轉帳明細字體金額顏色
;
        }
        .copy {
          border: 0.02rem solid #c02e26; //USTD轉帳明細複製按鈕邊框顏色
          color: #f55c45; //USTD轉帳明細複製按鈕文字顏色
        }
      }
      //控制USTD轉帳明細 QRcode
      .qr-area {
        box-shadow: none; //控制USTD轉帳明細 QRcode 移除陰影
      }
      //控制USTD轉帳明細 QRcode 存款位置
      .address {
        color: #ffffff;
      }
      //控制USTD轉帳明細 QRcode 編號
      .usdt-address {
        border: none; //控制USTD轉帳明細 QRcode 移除陰影
        color: #ffffff; //控制USTD轉帳明細 QRcode 編號字體顏色
      }
      //控制USTD轉帳明細 QRcode 送出按鈕
      .copy-address {
        background: linear-gradient(
          180deg,
          rgb(204, 52, 50) 0%,
          rgb(197, 39, 33) 100%
        ); //控制USTD轉帳明細 按鈕顏色
      }
    }
    //控制USTD轉帳提示
    .tips {
      background: #272829 !important; //控制USTD轉帳提示 背景顏色
      .tips-tit {
        color: #ffffff //控制USTD轉帳提示 標題字體顏色
;
      }
      .tips-des {
        color: #ffffff; //控制USTD轉帳提示 內容字體顏色
        span {
          color: #f55c45 //控制USTD轉帳提示 內容特殊標註字體顏色
;
        }
      }
    }
    .QP839-save-submit {
      background: linear-gradient(
        180deg,
        rgb(204, 52, 50) 0%,
        rgb(197, 39, 33) 100%
      ); //送出按鈕顏色
    }
  }
}
// for QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 end
</style>