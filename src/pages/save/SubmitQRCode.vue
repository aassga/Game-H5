<template>
  <div class="submit-qr-code theme-main-bg" v-if="isNoPay">
    <img class="no-data" src="@src/assets/img/save/no-pay-tongdao.png" alt />
  </div>
  <div
    :class="[
      'submit-qr-code theme-main-bg',
      { 'newQP-box': $config.newQP || $config.blackTheme },
      { 'blush-box': $config.blush },
    ]"
    v-else
  >
    <p
      class="pay-title"
      v-if="list && list.length > 1 && $config.home === 'amhg'"
    >
      选择充值通道
    </p>
    <van-tabs
      v-model="portIndex"
      sticky
      :swipe-threshold="5"
      v-show="list && list.length > 1"
      :class="[
        { 'pay-tabs': $config.home === 'amhg' },
        'theme-gradient-bg-1',
        'theme-after-border-nocolor',
      ]"
    >
      <van-tab v-for="(port, i) in list" :key="i">
        <template #title>
          <p class="tit theme-color-white">
            通道{{ $config.home === "amhg" ? replaceReg(i) : i + 1 }}
          </p>
          <img
            :src="payImg"
            class="item-icon"
            v-if="portIndex === i"
            v-show="$config.home === 'amhg'"
          />
        </template>
      </van-tab>
    </van-tabs>
    <div
      class="submit-qr-code-content theme-main-bg-1"
      style="padding-bottom: 0.2rem"
    >
      <img
        class="qr-code user-select"
        :src="targetPort ? staticURL + targetPort.qr_code : ''"
        alt
      />
      <div class="qr-info theme-color-yellow theme-border-yellow">
        长按二维码或截屏保存
      </div>
    </div>
    <div class="submit-qr-code-content theme-main-bg-1">
      <div style="position: relative;">
          <div style="display:none"></div>
          <input-row
            :class="{
              redColor: !$config.newQP && !$config.blackTheme && !$config.blush,
            }"
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
            v-model="name"
            v-keyBroayStates
            type="text"
            label="　　姓名:"
            placeholder="请输入存款姓名"
            class="input-name"
          ></input-row>
        <div class="name-radio">
          <van-checkbox v-model="$store.state.user.saveUserName" shape="square" :checked-color="$config.newQP || $config.blackTheme || $config.blush? '#F6CF32' : '#00bdd4'" :label-position="'left'">保存姓名</van-checkbox>
        </div>
        </div>
      <input-row
        :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
        v-model="order"
        v-keyBroayStates
        type="tel"
        label="　订单号:"
        placeholder="请输入订单号后9位数字"
      ></input-row>
      <input-row
        :class="{
          redColor: !$config.newQP && !$config.blackTheme && !$config.blush,
        }"
        :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
        v-model="amount"
        v-keyBroayStates
        type="tel"
        max-len="10"
        label="存款金额:"
        :placeholder="
          '单笔限额' +
          targetPort.min_amount +
          '~' +
          targetPort.max_amount +
          '元'
        "
      ></input-row>
      <input-row
        label="优惠比例:"
        :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
        v-if="bonusList.length === 1"
      >
        <div class="copy-row" slot="input">
          <p class="name user-select">{{ bonus }}</p>
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
      <input-row
        style="height: 0.02rem"
        v-if="$config.home === 'amhg'"
      ></input-row>
    </div>
    <button
      type="button"
      :disabled="submitting"
      :class="[
        { 'amhg-save-submit': $config.home === 'amhg' },
        'save-submit',
        'theme-bg',
        'theme-yellow-bg-3',
        'theme-color-black',
      ]"
      @click="onSubmit"
    >
      <template v-if="submitting"> 正在提交... </template>
      <template v-else> 确认提交 </template>
    </button>
    <p class="amhg-info" v-if="$config.home === 'amhg'">
      <span>温馨提示</span>
      二维码随时会更换！请每次存款都至[{{ title }}]
      进行操作。入款至已过期二维码，公司无法查收，恕不负责!
    </p>
    <p class="info" v-else>
      温馨提示：二维码随时会更换！请每次存款都至[{{ title }}]
      进行操作。入款至已过期二维码，公司无法查收，恕不负责!
    </p>
    <div style="height:2rem"></div>
  </div>
</template>

<script type="text/javascript">
import { Checkbox, CheckboxGroup  } from 'vant';
export default {
  name: "SubmitQRCode",
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
  components: {
    vanCheckbox:Checkbox,
    vanCheckboxGroup :CheckboxGroup
  },
  data() {
    return {
      staticURL: this.$store.state.main.config["statics"],
      submitting: false,
      isNoPay: false,
      list: [],
      targetPort: null,
      portIndex: 0,
      name: "",
      order: "",
      amount: "",
      bonus: "",
      bonusList: [],
    };
  },
  computed: {
    payImg() {
      if (this.$config.newQP || this.$config.blackTheme || this.$config.blush) {
        return require(`../../assets/img/save/pay_yellow.png`);
      } else {
        return require(`../../assets/img/save/pay_default.png`);
      }
    },
  },
  watch: {
    portIndex() {
      this.targetPort = this.list[this.portIndex];
      if (this.targetPort.max_amount == "0.00") {
        this.targetPort.max_amount = 10000000;
      }
    },
    id() {
      this.getList(this.id);
    },
    '$store.state.user.saveUserName' (now) {
      if(now) {
        this.name = this.userInfo.realName
      }else {
        this.name = ''
      }
      localStorage.setItem('saveUserName',now)
    },
  },
  created() {
    if(localStorage.getItem('saveUserName') === 'true') {
      this.name = this.userInfo.realName
      this.$store.state.user.saveUserName = true
    }
    this.getList(this.id);
    this.$store
      .dispatch("user/getDepositBonusList", { depositType: "bank" })
      .then((res) => {
        if (res.code === 200 && res.data.length) {
          res.data.forEach((item) => {
            let bonusItem = `${item.bonusRate}% (存款${item.multiple}倍打码)`;
            bonusItem = bonusItem.replace("rate_", "");
            this.bonusList.push(bonusItem);
          });
          this.bonus = this.bonusList[0];
        }
      })
      .catch(() => {});
  },
  methods: {
    reset() {
      if(this.$store.state.user.saveUserName) {
        this.name = this.userInfo.realName
      }
    },
    getList(id) {
      this.$store.dispatch("user/getSaveQRCode", {
        categoryId: id,
        callback: (res) => {
          if (res.code === 200) {
            this.list = res.data;
            if (this.list.length) {
              this.targetPort = this.list[0];
              if (this.targetPort.max_amount == "0.00") {
                this.targetPort.max_amount = 10000000;
              }
            } else {
              this.isNoPay = true;
            }
          } else {
            this.isNoPay = true;
            this.list = [];
          }
        },
      });
    },
    onSubmit() {
      if (this.submitting) {
        this.toastText("正在提交,请稍等~~~", "top");
      } else if (!this.name) {
        this.toastText("请输入正确的中文存款姓名", "top");
      } else if (!/^[\d]{9}$/.test(this.order || "")) {
        this.toastText("请输入正确的订单号后9位", "top");
      } else if (isNaN(parseFloat(this.amount))) {
        this.toastText("请输入有效的存款金额", "top");
      } else if (
        parseFloat(this.targetPort.min_amount) > parseFloat(this.amount)
      ) {
        this.toastText("存款金额不能小于" + this.targetPort.min_amount, "top");
      } else if (
        parseFloat(this.targetPort.max_amount) < parseFloat(this.amount)
      ) {
        this.toastText("存款金额不能大于" + this.targetPort.max_amount, "top");
      } else if (this.bonusList.length && !this.bonus) {
        this.toastText("请选择优惠比例", "top");
      } else {
        this.submitting = true;
        let submitData = {
          QRCodeId: this.targetPort.id,
          amount: this.amount,
          depositTime: this.dayJs().format("YYYY-MM-DD HH:mm:ss"),
          serialNumber: this.order,
          depositAccountName: this.name.split('_')[0],
        };
        if (this.bonusList.length) {
          submitData["bonusRate"] = this.bonus.split(" ")[0].replace("%", "");
        }
        this.$store
          .dispatch("user/saveSubmitByQRCode", submitData)
          .then((res) => {
            setTimeout(() => {
              this.submitting = false;
            }, 5000);
            this.toastText(res.data, "top");
            if (res.code === 200) {
              this.order = "";
              this.amount = "";
              if (this.bonusList.length) {
                this.bonus = this.bonusList[0];
              }
            }
          })
          .catch(() => {
            this.submitting = false;
          });
      }
    },
    replaceReg(reg) {
      let arr = new Array(
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
        "十三",
        "十四",
        "十五"
      );
      return arr[reg];
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.name-radio {
  position: absolute;
  right: 0.38rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.32rem;
  color: #333;
  /deep/.van-checkbox {
    margin-top: 0.03rem;
  }
}
/deep/ .user-input-row {
  &.redColor {
    .input {
      color: red !important;
      font-size: 0.4rem;
    }
    &.input-name {
    .input {
      font-size: 0.32rem !important;
    }
  }
  }
}
.submit-qr-code {
  width: 100%;
  padding: 0;
  background-color: #fafafa;
  .pay-title {
    font-size: 0.34rem;
    font-weight: 500;
    color: #333333;
    text-align: left;
    padding: 0.33rem 0 0.35rem 0.22rem;
    background: #fff;
  }
  /deep/ .van-tabs__wrap {
    margin-bottom: 0.2rem;
    height: 0.9rem !important;
    .van-tabs__nav {
      background-color: #fafafa;
    }
    .van-tabs__line {
      background-color: #00bdd4 !important;
    }
  }

  /deep/ .van-tab {
    // flex: 0.2 !important;
    flex-basis: 20% !important;
    max-width: 1.66rem;
    font-size: 0.3rem !important;
    line-height: 0.9rem !important;
    &.van-tab--active {
      color: #00bdd4 !important;
      border-color: #00bdd4 !important;
    }
  }

  /deep/ .van-ellipsis {
    display: inline !important;
  }

  .pay-tabs {
    position: unset;
    /deep/.van-tabs__wrap {
      position: unset;
      height: 1.12rem !important;
      margin-left: 0.1rem;
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
          width: 1.95rem;
          max-width: 1.95rem;
          min-width: 1.95rem;
          height: 0.9rem;
          border-radius: 0.1rem;
          margin-right: 0.14rem;
          margin-top: 0.14rem;
          padding: 0;
          box-sizing: border-box;
          background-color: #fdfdfd;
          position: relative;
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
            height: 0.9rem;
            line-height: 0.8rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: normal;
            color: #333;
          }
          .item-icon {
            position: absolute;
            top: 0;
            left: 1.55rem;
            width: 0.38rem;
            height: 0.31rem;
          }
        }
      }
    }
  }
  .submit-qr-code-content {
    overflow: hidden;
    background-color: #fafafa;
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

  .qr-code {
    margin: 0.2rem auto;
    width: 5rem;
    height: 5rem;
    display: block;
    user-select: all !important;
    -webkit-user-drag: none;
    -webkit-touch-callout: default;
  }

  .qr-info {
    font-size: 0.36rem;
    width: 5rem;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
    margin: 0 auto;
    border: 0.02rem solid #00bdd4;
    color: #00bdd4;
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
  .amhg-save-submit {
    width: 6.42rem;
    margin: 0.5rem auto;
    height: 0.86rem;
    border-radius: 0.43rem;
    display: block;
    font-size: 0.36rem;
    color: #ffffff;
    line-height: 0.86rem;
    background: #fff;
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
    color: #575e68;
    font-size: 0.28rem;
    padding: 0.2rem 0.3rem 0.6rem 0.3rem;
    line-height: 0.36rem;
    text-align: justify;
    span {
      display: block;
      color: #ff2100;
      margin-bottom: 0.1rem;
    }
  }
  .no-data {
    width: 35%;
    display: block;
    margin: 0 auto;
    padding-top: 2rem;
    box-sizing: border-box;
  }
  &.newQP-box {
    /deep/ .van-tabs {
      position: unset;
      .van-tabs__wrap {
        .van-tabs__nav {
          background: linear-gradient(
            180deg,
            #181818,
            #0c0c0c,
            #0c0c0c
          ) !important;
          .van-tab {
            color: #fff !important;
            background: linear-gradient(180deg, #181818, #0c0c0c) !important;
            background-color: #000 !important;
            .van-tab__text {
              color: #fff !important;
            }
            &.van-tab--active {
              .van-tab__text {
                color: #f6d033 !important;
              }
            }
          }
          .van-tabs__line {
            background-color: #f6cf32 !important;
          }
        }
      }
    }
    /deep/.van-checkbox__label {
      color: #fff;
    }
  }
  &.blush-box {
    /deep/ .van-tabs {
      position: unset;
      .van-tabs__wrap {
        .van-tabs__nav {
          background: linear-gradient(180deg, #72010b, #98010e) !important;
          .van-tab {
            color: #fff !important;
            background: linear-gradient(180deg, #72010b, #98010e) !important;
            background-color: #72010b !important;
            .van-tab__text {
              color: #fff !important;
            }
            &.van-tab--active {
              .van-tab__text {
                color: #f6d033 !important;
              }
            }
          }
          .van-tabs__line {
            background-color: #f6cf32 !important;
          }
        }
      }
    }
    /deep/.van-checkbox__label {
      color: #fff;
    }
  }
}
.newQP-app {
  background-color: black;
}
</style>
