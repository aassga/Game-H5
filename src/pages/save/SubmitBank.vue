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
    <div class="bank-submit theme-header-bg" v-if="isNoPay">
      <img
        class="no-data"
        :src="require('@src/assets/img/no-pay-tongdao.png')"
        alt
      />
    </div>
    <div
      class="bank-submit theme-header-bg"
      :class="[{'QP839-submit': $config.isBlackRedTheme }]"
      v-else
    >
      <div v-if="setp === 1">
        <!-- <div class="title theme-color-white">请选择银行</div> -->
        <div class="title theme-color-white">请选择存款银行</div>
        <ul
          :class="[
            'bank-list',
            'clear-fix',
            { newqpStyle: $config.newQP || $config.blackTheme },
          ]"
        >
          <li
            class="bank-item theme-main-bg"
            :class="[
              { active: targetBank.id === bank.id },
              { 'theme-border-1px': $config.newQP || $config.blackTheme },
            ]"
            v-for="bank in list"
            :key="bank.id"
            @click="targetBank = bank"
          >
            <span class="bank-name theme-color-white">{{ bank.bankName }}</span>
            <img
              :src="payImg"
              class="item-icon"
              v-if="targetBank.id === bank.id"
            />
          </li>
        </ul>
        <input-row
          v-model="type"
          type="select"
          placeholder="请选择汇款方式"
          :data="types"
          is-click
          :themeStyle="$config.blackTheme || $config.newQP || $config.blush"
          class="select"
          :isClick="false"
        >
          <span
            slot="label"
            class="date-icon icon iconfont h5-icon-qushi-moreup"
          ></span>
        </input-row>
        <!-- <div class="select" @click="bankPicker = true">
          <div class="txt">{{ type }}</div>
          <div class="date-icon icon iconfont h5-icon-qushi-moreup"></div>
        </div> -->
        <!-- <div class="title theme-color-white">
          存款姓名<span class="des" v-if="!this.userInfo.realName"
            >（为即时到帐，请务必输入正确的存款姓名）</span
          >
        </div> -->
        <div style="position: relative">
          <div style="display: none"></div>
          <input-row
            :class="{
              redColor: !$config.newQP && !$config.blackTheme && !$config.blush,
            }"
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
            v-model="name"
            v-keyBroayStates
            type="text"
            label="存款姓名:"
            placeholder="请输入存款姓名"
            class="input-name"
          ></input-row>
          <div class="name-radio">
            <van-checkbox
              v-model="$store.state.user.saveUserName"
              shape="square"
              :checked-color="
                $config.newQP || $config.blackTheme || $config.blush
                  ? '#F6CF32'
                  : $config.isBlackRedTheme
                  ? '#FF0000'
                  : '#00bdd4'
              "
              :label-position="'left'"
              >保存姓名</van-checkbox
            >
          </div>
        </div>
        <input-row
          :class="{
            redColor: !$config.newQP && !$config.blackTheme && !$config.blush,
          }"
          :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          v-model="amount"
          ref="amount"
          v-keyBroayStates
          type="tel"
          label="存款金额:"
          max-len="10"
          placeholder="请输入存款金额"
        ></input-row>

        <!-- <div class="title theme-color-white">存款金额</div>
          <input-row
            :class="{redColor:(!$config.newQP && !$config.blackTheme && !$config.blush)}"
            v-keyBroayStates
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
            ref="amount"
            v-model="amount"
            type="tel"
            max-len="10"
            placeholder="请输入存款金额"
            ><img src="../../assets/img/save/yellow-rmb-icon.png" class="img-label" slot="label" v-if="$config.newQP || $config.blackTheme || $config.blush"><img v-else src="../../assets/img/save/rmb-icon.png" class="img-label" slot="label"></input-row> -->
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
        <div class="select" @click="savePicker = true" v-if="bonusList.length">
          <div class="txt">{{ bonus }}</div>
          <div class="date-icon icon iconfont h5-icon-qushi-moreup"></div>
        </div> -->
      </div>
      <div v-else class="setp2-info theme-header-bg">
        <p class="info">
          请15分钟内支付完毕。一定要存入下列银行卡账号，不要修改金额，核对正确充值方式,否则不到账!
        </p>
        <div class="bank-info theme-gradient-bg-2">
          <p class="tit theme-color-white">您充值金额為：</p>
          <div class="info-item">
            <span class="left money theme-color-yellow">¥ {{ amount }}</span>
            <span
              class="
                right
                theme-gradient-bg theme-color-yellow theme-border-yellow
              "
              @click="onCopy(amount)"
              >复制</span
            >
          </div>
          <div class="info-item">
            <span class="left theme-color-white"
              >帐户姓名：{{ targetBank.cardName }}</span
            >
            <span
              class="
                right
                theme-gradient-bg theme-color-yellow theme-border-yellow
              "
              @click="onCopy(targetBank.cardName)"
              >复制</span
            >
          </div>
          <div class="info-item">
            <span class="left theme-color-white"
              >帐户号码：{{ targetBank.cardNum }}</span
            >
            <span
              class="
                right
                theme-gradient-bg theme-color-yellow theme-border-yellow
              "
              @click="onCopy(targetBank.cardNum)"
              >复制</span
            >
          </div>
          <div class="info-item">
            <span class="left theme-color-white"
              >银行名称：{{ targetBank.bankName }}</span
            >
            <span
              class="
                right
                theme-gradient-bg theme-color-yellow theme-border-yellow
              "
              @click="onCopy(targetBank.bankName)"
              >复制</span
            >
          </div>
          <div class="info-item">
            <span class="left theme-color-white"
              >开户网点：{{ targetBank.cardAddress }}</span
            >
            <span
              class="
                right
                theme-gradient-bg theme-color-yellow theme-border-yellow
              "
              @click="onCopy(targetBank.cardAddress)"
              >复制</span
            >
          </div>
          <div class="info-item">
            <span class="left theme-color-white">充值方式：{{ type }}</span>
            <span
              class="
                right
                theme-gradient-bg theme-color-yellow theme-border-yellow
              "
              @click="onCopy(type)"
              >复制</span
            >
          </div>
        </div>
        <p class="info">
          当您完成该笔充值后,如果需要再进行充值,请点击充值按钮,重新进行充值。
        </p>
      </div>
      <button
        type="button"
        class="save-submit theme-yellow-bg-3 theme-color-black"
        :class="[
          {
            'QP839-save-submit': $config.isBlackRedTheme
          },
        ]"
        :disabled="submitting"
        @touchstart.capture="onSubmit($event)"
      >
        <template v-if="submitting"> 正在提交... </template>
        <template v-else> {{ setp === 1 ? "去转帐" : "确认提交" }} </template>
      </button>
      <div class="height-box"> </div>
    </div>
    <save-popup :show="savePicker" :btnValue="'确定'" @onConfirm="saveConfirm">
      <div slot="head" class="back-tit">
        <span class="txt theme-color-white">选择首存返利</span>
        <span class="btn" @click="savePicker = false">取消</span>
      </div>
      <van-picker
        @change="saveChange"
        :visible-item-count="3"
        :columns="bonusList"
        slot="content"
        class="bank-picker"
        :class="{ 'black-bank-picker': $config.newQP || $config.blackTheme }"
      />
    </save-popup>

    <!-- <save-popup :show="bankPicker" :btnValue="'确定'" @onConfirm="bankConfirm">
      <van-picker
        @change="bankChange"
        :visible-item-count="4"
        :columns="types"
        slot="content"
        class="bank-picker"
        :class="{'black-bank-picker' : $config.newQP || $config.blackTheme || $config.blush}"
      />
    </save-popup> -->

    <save-popup :show="tipPicker" :btnValue="'知道了'" @onConfirm="tipConfirm">
      <div
        slot="content"
        class="tipPicker"
        :class="[
          { 'black-tipPicker': $config.newQP || $config.blackTheme },
          { 'blush-tipPicker': $config.blush },
          {
            'QP839-tipPicker': $config.isBlackRedTheme
          },
        ]"
      >
        <p class="tit theme-color-yellow">重要提示</p>
        <p class="des theme-color-white">
          请根据充值定单存至正确银行卡帐号,切勿修改金额,仔细核对充值卡号,核对正确充值方式,否则不到帐!
        </p>
      </div>
    </save-popup>
  </div>
</template>

<script type="text/javascript">
import savePopup from "../../components/save-popup/index.vue";
import { Checkbox, CheckboxGroup } from "vant";
const commBank = [
  "工商银行",
  "农业银行",
  "建设银行",
  "招商银行",
  "中国银行",
  "浦发银行",
  "中信银行",
  "交通银行",
  "民生银行",
  "兴业银行",
  "邮政银行",
  "光大银行",
  "华夏银行",
  "浙商银行",
  "包商银行",
  "北京银行",
  "上海银行",
  "东莞银行",
  "广发银行",
  "平安银行",
  "徽商银行",
  "江苏银行",
  "农村信用社",
  "哈尔滨银行",
  "深圳发展银行",
  "广州农村商业银行",
  "北京农商",
  "福建农村信用社",
  "成都银行",
  "浙江网商银行",
  "吉林银行",
  "其它银行",
];

const commBankIcon = {};

export default {
  name: "SubmitBank",
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
    savePopup,
    vanCheckbox: Checkbox,
    vanCheckboxGroup: CheckboxGroup,
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
  data() {
    return {
      submitting: false,
      list: [],
      isNoPay: false,
      targetBank: null,
      types: [
        "网银转帐",
        "手机转帐",
        "支付宝转帐",
        "微信转帐",
        "银行柜台",
        "ATM现金",
        "ATM转卡",
        "其他",
      ],
      commBank,
      type: "网银转帐",
      name: "",
      amount: "",
      min: 0,
      bonus: "",
      bonusList: [],
      value: "",
      bankPicker: false,
      quick_amount: [],
      bankIndex: 0,
      savePicker: false,
      saveIndex: 0,
      setp: 1,
      tipPicker: false,
    };
  },
  watch: {
    "$store.state.user.saveUserName"(now) {
      if (now) {
        this.name = this.userInfo.realName;
      } else {
        this.name = "";
      }
      localStorage.setItem("saveUserName", now);
    },
    targetBank(now, old) {
      if (now.quick_amount) {
        this.quick_amount = now.quick_amount.split(",");
      } else {
        this.quick_amount = [];
      }
    },
  },
  created() {
    if (localStorage.getItem("saveUserName") === "true") {
      this.name = this.userInfo.realName;
      this.$store.state.user.saveUserName = true;
    }
    this.min = parseFloat(this.$store.state.main.config.limit.paymentLimit);
    this.$store.dispatch("user/getSaveBank", {
      callback: (res) => {
        if (res.code === 200) {
          this.list = res.data;
          if (this.list.length) {
            this.targetBank = this.list[0];
          } else {
            this.isNoPay = true;
          }
        } else {
          this.list = [];
          this.isNoPay = true;
        }
      },
    });
    this.$store
      .dispatch("user/getDepositBonusList", { depositType: "bank" })
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
    if (this.$store.state.main.saveMoney)
      this.amount = this.$store.state.main.saveMoney;
  },
  mounted() {
    setTimeout(() => {
      if (
        this.$refs.content.offsetHeight >
        window.innerHeight - 0.88 * this.rem
      ) {
        this.$refs.name.$el.addEventListener("click", () => {
          this.inputFocus();
        });
        this.$refs.amount.$el.addEventListener("click", () => {
          this.inputFocus();
        });
      }
    }, 300);
  },
  methods: {
    reset() {
      if (this.$store.state.user.saveUserName) {
        this.name = this.userInfo.realName;
      }
    },
    setp1() {
      this.setp = 1;
    },
    tipConfirm() {
      this.tipPicker = false;
      this.setp = 2;
      this.$emit("changeHeader", "网银转账");
    },
    saveConfirm() {
      this.bonus = this.bonusList[this.saveIndex];
      this.savePicker = false;
    },
    saveChange(picker, value, index) {
      this.saveIndex = index;
    },
    bankConfirm() {
      this.type = this.types[this.bankIndex];
      this.bankPicker = false;
    },
    bankChange(picker, value, index) {
      this.bankIndex = index;
    },
    inputFocus() {
      setTimeout(() => {
        document.body.scrollTop =
          this.$refs.content.offsetHeight - window.innerHeight + 300;
      }, 300);
    },
    getBankIcon(bank) {
      return commBankIcon[bank.bankName] || commBankIcon["其他银行"];
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
      let moneyExp = /^\d+(\.\d{1,2})?$/;
      if (this.setp === 1) {
        if (!this.targetBank || !this.targetBank.id) {
          this.toastText("请选择有效的银行卡", "top");
        } else if (!this.type) {
          this.toastText("请选择汇款方式", "top");
        } else if (!this.name) {
          this.toastText("请输入有效的汇款姓名", "top");
        } else if (!moneyExp.test(this.amount)) {
          this.toastText("请输入有效的汇款金额", "top");
        } else if (parseFloat(this.amount) < this.min) {
          this.toastText("最小汇款金额" + this.min + "元", "top");
        } else if (this.bonusList.length && !this.bonus) {
          this.toastText("请选择优惠比例", "top");
        } else {
          this.tipPicker = true;
          // this.$store
          // .dispatch("user/setInfo", { realName: this.name })
          // .then((res) => {
          //   if (res.code === 200) {
          //     this.$store.dispatch("user/refreshInfo").then(() => {
          //     });
          //   } else {
          //   }
          // });
        }
      } else {
        if (this.submitting) {
          this.toastText("正在提交,请稍等~~~", "top");
        } else {
          this.submitting = true;
          let submitData = {
            port: "h5",
            amount: this.amount,
            depositId: this.targetBank.id,
            bankId: this.targetBank.cardNum,
            bankName: this.targetBank.bankName,
            bankAccountName: this.targetBank.cardName,
            bankSerialNumber: "",
            type: this.type,
            depositRealName: this.name.split("_")[0],
            depositTime: this.dayJs().format("YYYY-MM-DD HH:mm:ss"),
          };
          if (this.bonusList.length) {
            submitData["bonusRate"] = this.bonus
              .split("首存返利")[1]
              .replace("%", "");
          }
          this.$store
            .dispatch("user/saveSubmitByBank", submitData)
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
                  this.type = "网银转帐";
                  this.name = "";
                  this.amount = "";
                  this.setp = 1;
                  this.$emit("changeHeader", "充值中心");
                }, 500);
              } else if (res.message) {
                setTimeout(() => {
                  this.name = "";
                  this.amount = "";
                  this.setp = 1;
                  this.$emit("changeHeader", "充值中心");
                  this.toastText(res.message, "top");
                }, 500);
              } else if (res.msg) {
                setTimeout(() => {
                  this.name = "";
                  this.amount = "";
                  this.toastText(res.msg, "top");
                  this.setp = 1;
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
  },
  beforeDestroy() {
    this.$store.state.main.saveMoney = "";
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
.height-box {
  height: 1rem;
}
.tipPicker {
  padding: 0.27rem 0.42rem 0.4rem;
  background-color: #fff;
  .tit {
    color: #333333;
    font-size: 0.34rem;
  }
  .des {
    color: #010000;
    font-size: 0.28rem;
    padding: 0.25rem 0;
    text-align: left;
  }
  &.black-tipPicker {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      #000000 100%
    ) !important;
  }
  &.blush-tipPicker {
    background-color: #530107;
  }
}
.bank-picker {
  /deep/.van-picker-column__item {
    justify-content: left;
    padding-left: 0.45rem;
    &.van-picker-column__item--selected {
      background-color: #f1fafe;
    }
  }
  /deep/.van-picker__frame {
    &::after {
      border-width: 0;
    }
  }
  &.black-bank-picker {
    /deep/.van-picker-column__item {
      &.van-picker-column__item--selected {
        background-color: transparent;
      }
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
/deep/ .user-input-row {
  padding-left: 0rem;
  .input {
    height: 0.6rem;
    line-height: 0.6rem;
    font-size: 0.4rem !important;
  }
  .img-label {
    width: 0.24rem;
  }
  &::after {
    left: 0 !important;
    top: 98%;
    margin-right: 0.1rem;
  }
  &.redColor {
    .input {
      color: red !important;
    }
  }
  &.input-name {
    .input {
      font-size: 0.32rem !important;
    }
  }
}
.bank-submit {
  overflow: hidden;
  .item-icon {
    width: 0.45rem;
    height: 0.45rem;
    position: absolute;
    right: -0.02rem;
    bottom: -0.04rem;
  }
  width: 100%;
  padding-left: 0.29rem;
  margin: 0;
  height: 100%;
  background-color: #fafafa;
  .title {
    height: 0.85rem;
    line-height: 0.85rem;
    font-size: 0.28rem;
    color: #333;
    text-align: left;
    .des {
      color: #444444;
      font-size: 0.26rem;
    }
  }

  .select {
    width: 6.92rem;
    height: 0.87rem;
    line-height: 0.87rem;
    padding: 0 0.33rem;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #f2f2fa;
    border-radius: 0.09rem;
    /deep/.input {
      color: #333333;
      font-size: 0.3rem !important;
      float: left;
    }
    .icon {
      position: absolute;
      right: 0.24rem;
      font-size: 0.3rem;
      transform: scale(0.5) rotateZ(180deg);
      color: #000;
    }
    /deep/&::after {
      display: none !important;
    }
  }

  .bank-list {
    width: 7.1rem;
    margin: 0 auto;
    display: block;
    box-sizing: border-box;

    .bank-item {
      position: relative;
      width: 1.58rem;
      float: left;
      box-sizing: border-box;
      height: 0.76rem;
      line-height: 0.76rem;
      margin-right: 0.18rem;
      margin-bottom: 0.18rem;
      border-radius: 0.1rem;
      font-size: 0.26rem;
      text-align: center;
      background: #ffffff;
      box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.02);
      &:nth-child(4n) {
        margin-right: 0;
      }
      &.active {
        box-shadow: 0px 0px 13px 0px rgba(0, 189, 212, 0.5);
      }
      .bank-name {
        line-height: 0.28rem;
      }
    }
  }

  .amount-list {
    width: 100%;
    box-sizing: border-box;
    .amount-item {
      position: relative;
      box-sizing: border-box;
      border-radius: 0.1rem;
      width: 1.54rem;
      color: #555555;
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

  .copy-row {
    flex: 1;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;

    .name {
      font-size: 0.3rem;
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
      color: #00bdd4;
      border-radius: 0.1rem;
      line-height: 0.6rem;
      font-size: 0.26rem;
      border: 0.02rem solid #00bbd2;
    }
  }
  .save-submit {
    width: 6.74rem;
    margin: 0.5rem auto 0.5rem;
    height: 0.847rem;
    display: block;
    font-size: 0.4rem;
    color: #ffffff;
    line-height: 0.847rem;
    background: linear-gradient(90deg, #00b2c8 0%, #00bdd4 100%);
    border-radius: 0.43rem;
  }
  .no-data {
    width: 35%;
    display: block;
    margin: 0 auto;
    padding-top: 2rem;
    box-sizing: border-box;
  }
}
.setp2-info {
  text-align: left;
  padding: 0.2rem 0.28rem 0 0;
  background-color: #fafafa;
  .info {
    color: #666666;
    font-size: 0.28rem;
    margin-bottom: 0.28rem;
  }
  .bank-info {
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.05);
    border-radius: 0.18rem;
    padding: 0.38rem 0.22rem 0.25rem 0.28rem;
    margin-bottom: 0.24rem;
    .tit {
      color: #333333;
      font-size: 0.33rem;
    }
    .info-item {
      width: 100%;
      height: 0.85rem;
      line-height: 0.85rem;
      overflow: hidden;
      .left {
        float: left;
        color: #333333;
        font-size: 0.33rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 5.4rem;
        &.money {
          color: #ff8000;
          font-size: 0.5rem;
        }
      }
      .right {
        float: right;
        width: 0.89rem;
        height: 0.49rem;
        line-height: 0.49rem;
        border-radius: 0.07rem;
        border: 0.02rem solid #00bbd2;
        color: #00bbd2;
        margin-top: 0.18rem;
        background-color: #fff;
        font-size: 0.29rem;
        text-align: center;
      }
    }
  }
}
.newQP-container {
  .bank-item.active {
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
  /deep/.van-checkbox__label {
    color: #fff;
  }
}

.blush-container {
  .bank-item.active {
    box-shadow: none !important;
    color: #f6cf32 !important;
    border: 0.02rem solid #f6cf32 !important;
    span {
      color: #f6cf32 !important;
    }
  }
  .amount-list {
    .amount-item {
      background-color: #530107 !important;
      color: #f6cf32 !important;
      &.active {
        box-shadow: none !important;
        color: #f6cf32 !important;
        border: 0.02rem solid #f6cf32 !important;
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
  /deep/.van-checkbox__label {
    color: #fff;
  }
}
// for QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 start
.QP839-container {
  .QP839-submit {
    background-color: #1b1d1b; //hty网銀背景顏色
    .bank-item {
      background: #272829; //hty网銀按鈕背景顏色
      color: #fff; //hty网銀按鈕字體顏色
    }
    .title {
      color: #fff; //hty网銀標題字體顏色
    }
    .species,
    .bank-item.active {
      box-shadow: none !important; //hty网銀按鈕選中去除陰影
      border: 1px solid #c62721 !important; //hty网銀按鈕選中邊框顏色
      background: #1b1d1b !important; //hty网銀按鈕選中背景顏色
      span {
        color: #fff !important; //hty网銀按鈕選中字體顏色
      }
    }
    .select {
      .icon {
        color: #fff; //hty网銀標題字體顏色
      }
      /deep/.input {
        color: #fff; //hty网銀標題字體顏色
      }
    }
    .name-radio {
      /deep/.van-checkbox__label {
        color: #fff //hty网銀保存姓名字體顏色 ;
      }
    }
    //控制hty网銀按鈕 背景顏色 && 字體顏色
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
    //控制存款金額內容 背景顏色 && 輸入框 && 字體顏色
    .user-input-row {
      background-color: #1b1d1b; //hty网銀內容背景顏色
      /deep/.label {
        color: #fff; //hty网銀標題字體顏色
      }
    }

    //控制hty网銀明細 背景顏色 && 字體顏色
    .setp2-info {
      background-color: #1b1d1b; //hty网銀背景顏色
      .info {
        color: #ffffff; //hty网銀明細字體顏色
      }
      .bank-info {
        background-color: #272829; //hty网銀明細背景顏色
        .tit {
          color: #ffffff; //hty网銀明細字體顏色
        }
        .info-item {
          .money {
            color: #f55c45 !important; //hty网銀明細字體金額顏色
          }
          .left {
            color: #ffffff;
          }
          .right {
            border: 0.02rem solid #c02e26; //hty网銀明細複製按鈕邊框顏色
            color: #f55c45; //hty网銀明細複製按鈕文字顏色
            background-color: #272829;
          }
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
