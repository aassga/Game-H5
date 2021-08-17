<template>
  <div class="container theme-main-bg" v-if="isNoPay || !pageType">
    <img class="no-data" src="@src/assets/img/save/no-pay-tongdao.png" alt />
  </div>
  <div
    class="container theme-main-bg"
    v-else
    ref="content"
    :class="[
      { 'newQP-container': $config.newQP || $config.blackTheme },
      { 'blush-container': $config.blush },
    ]"
  >
    <div class="swiper-box theme-main-bg">
      <swiper :options="swiperOption" ref="swiper">
        <swiper-slide v-for="(url, i) in swiperList" :key="i">
          <img style="width: 100%; display: block" :src="url" />
        </swiper-slide>
      </swiper>
      <div
        v-show="swiperIndex !== swiperList.length - 1"
        class="swiper-button-next"
      ></div>
      <div v-show="swiperIndex !== 0" class="swiper-button-prev"></div>
    </div>
    <div class="bank-form theme-main-bg">
      <div>
        <div class="bank-tit theme-color-white">选择汇款卡号</div>
        <div
          :class="[
            'bank-list',
            { newqpStyle: $config.newQP || $config.blackTheme },
          ]"
        >
          <div
            v-for="(item, i) in bankList"
            :key="i"
            :class="['bank-item', { active: bankIndex === i }]"
            @click="bankIndex = i"
          >
            <img class="bank-icon" :src="item.cardImg" alt="" />
            <span class="bank-name">{{ item.bankName }}</span>
            <img :src="payImg" class="item-icon" v-if="bankIndex === i" />
          </div>
        </div>
      </div>
      <div class="scrollIntoViewBox">
        <input-row
          :class="{ 'grayColor no-border': $config.home === 'amhg' }"
          label="收款姓名:"
          :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
        >
          <div class="copy-row" slot="input">
            <p class="name selector-box user-select">
              {{ bankList[bankIndex]["cardName"] }}
            </p>
            <div
              class="copy theme-gradient-bg theme-color-yellow theme-border-yellow"
              @click="onCopy(bankList[bankIndex]['cardName'])"
            >
              复制
            </div>
          </div>
        </input-row>
        <input-row
          :class="{ grayColor: $config.home === 'amhg' }"
          label="收款帐号:"
          :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
        >
          <div class="copy-row" slot="input">
            <p class="name selector-box user-select">
              {{ bankList[bankIndex]["cardNum"] }}
            </p>
            <div
              class="copy theme-gradient-bg theme-color-yellow theme-border-yellow"
              @click="onCopy(bankList[bankIndex]['cardNum'])"
            >
              复制
            </div>
          </div>
        </input-row>
        <div style="position: relative;">
          <div style="display:none"></div>
          <input-row
          :class="{
            redColor: !$config.newQP && !$config.blackTheme && !$config.blush,
          }"
          v-keyBroayStates
          :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ref="name"
          v-model="name"
          type="text"
          label="汇款姓名:"
          placeholder="请输入汇款姓名"
          class="input-name"
        ></input-row>
        <div class="name-radio">
          <van-checkbox v-model="$store.state.user.saveUserName" shape="square" :checked-color="$config.newQP || $config.blackTheme || $config.blush? '#F6CF32' : '#00bdd4'" :label-position="'left'">保存姓名</van-checkbox>
        </div>
        </div>
        <input-row
          :class="{
            redColor: !$config.newQP && !$config.blackTheme && !$config.blush,
          }"
          v-keyBroayStates
          :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ref="amount"
          max-len="10"
          v-model="amount"
          type="tel"
          label="汇款金额:"
          :placeholder="'最少' + bankList[bankIndex]['min_amount'] + '元'"
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
    </div>
    <div
      class="save-submit theme-color-black theme-yellow-bg-3"
      @click="onSubmit"
    >
      确认提交
    </div>
    <div style="height: 2rem"></div>
  </div>
</template>

<script type="text/javascript">
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import dayJs from "dayjs";
import { Checkbox, CheckboxGroup  } from 'vant';
export default {
  name: "TransferBank",
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
    swiper,
    swiperSlide,
    vanCheckbox:Checkbox,
    vanCheckboxGroup :CheckboxGroup
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
  data() {
    return {
      isNoPay: false,
      payName: "",
      pageType: "",
      bankList: [],
      swiperList: [],
      swiperIndex: 0,
      swiperOption: {
        //swiper3
        autoplay: false,
        navigation: {
          nextEl: ".swiper-button-next", //前进按钮的css选择器或HTML元素。
          prevEl: ".swiper-button-prev", //后退按钮的css选择器或HTML元素。
          hideOnClick: true, //点击slide时显示/隐藏按钮
        },
        on: {
          slideChangeTransitionStart: (e) => {
            this.swiperIndex = this.$refs.swiper.swiper.realIndex;
          },
        },
      },
      amount: "",
      name: "",
      bankIndex: 0,
      submitting: false,
      bonus: "",
      bonusList: [],
    };
  },
  watch: {
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
    if (this.title.includes("支付宝")) {
      this.pageType = "zfb";
      this.payName = "支付宝";
    } else if (this.title.includes("微信")) {
      this.pageType = "wx";
      this.payName = "微信";
    }
    this.$store
      .dispatch("user/getDepositBonusList", { depositType: "bank" })
      .then((res) => {
        if (res.code === 200 && res.data.length) {
          res.data.forEach((item) => {
            let bonusItem = `${item.bonusRate}% (充值${item.multiple}倍打码)`;
            bonusItem = bonusItem.replace("rate_", "");
            this.bonusList.push(bonusItem);
          });
          this.bonus = this.bonusList[0];
        }
      })
      .catch(() => {});
    this.getBanksData();
    this.setSwiperList();
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
      if(this.$store.state.user.saveUserName) {
        this.name = this.userInfo.realName
      }
    },
    inputFocus() {
      setTimeout(() => {
        document.body.scrollTop =
          this.$refs.content.offsetHeight - window.innerHeight + 300;
      }, 300);
    },
    getBanksData() {
      this.$store.dispatch("user/getSaveBank", {
        classId: this.id,
        callback: (res) => {
          if (res.code === 200 && res.data.length) {
            this.bankList = res.data;
          } else {
            this.isNoPay = true;
          }
        },
      });
    },
    setSwiperList() {
      if (this.$config.newQP || this.$config.blackTheme) {
        if (this.pageType === "zfb") {
          this.swiperList = [
            require("@src/assets/img/save/TransferBank/qp-zfb-1.png"),
            require("@src/assets/img/save/TransferBank/qp-zfb-2.png"),
            require("@src/assets/img/save/TransferBank/qp-zfb-3.png"),
          ];
        } else {
          this.swiperList = [
            require("@src/assets/img/save/TransferBank/qp-wx-1.png"),
            require("@src/assets/img/save/TransferBank/qp-wx-2.png"),
            require("@src/assets/img/save/TransferBank/qp-wx-3.png"),
            require("@src/assets/img/save/TransferBank/qp-wx-4.png"),
            require("@src/assets/img/save/TransferBank/qp-wx-5.png"),
            require("@src/assets/img/save/TransferBank/qp-wx-6.png"),
            require("@src/assets/img/save/TransferBank/qp-wx-7.png"),
          ];
        }
      } else if (this.$config.blush) {
        if (this.pageType === "zfb") {
          this.swiperList = [
            require("@src/assets/img/save/TransferBank/blush-zfb-1.png"),
            require("@src/assets/img/save/TransferBank/blush-zfb-2.png"),
            require("@src/assets/img/save/TransferBank/blush-zfb-3.png"),
          ];
        } else {
          this.swiperList = [
            require("@src/assets/img/save/TransferBank/blush-wx-1.png"),
            require("@src/assets/img/save/TransferBank/blush-wx-2.png"),
            require("@src/assets/img/save/TransferBank/blush-wx-3.png"),
            require("@src/assets/img/save/TransferBank/blush-wx-4.png"),
            require("@src/assets/img/save/TransferBank/blush-wx-5.png"),
            require("@src/assets/img/save/TransferBank/blush-wx-6.png"),
            require("@src/assets/img/save/TransferBank/blush-wx-7.png"),
          ];
        }
      } else {
        if (this.pageType === "zfb") {
          this.swiperList = [
            require("@src/assets/img/save/TransferBank/zfb-1.png"),
            require("@src/assets/img/save/TransferBank/zfb-2.png"),
            require("@src/assets/img/save/TransferBank/zfb-3.png"),
          ];
        } else {
          this.swiperList = [
            require("@src/assets/img/save/TransferBank/wx-1.png"),
            require("@src/assets/img/save/TransferBank/wx-2.png"),
            require("@src/assets/img/save/TransferBank/wx-3.png"),
            require("@src/assets/img/save/TransferBank/wx-4.png"),
            require("@src/assets/img/save/TransferBank/wx-5.png"),
            require("@src/assets/img/save/TransferBank/wx-6.png"),
            require("@src/assets/img/save/TransferBank/wx-7.png"),
          ];
        }
      }
    },
    onSubmit() {
      let data = this.bankList[this.bankIndex];
      if (this.submitting) {
        this.toastText("正在提交,请稍等~~~");
      } else if (!this.name) {
        this.toastText("请输入有效的汇款姓名", "top");
      } else if (isNaN(parseFloat(this.amount))) {
        this.toastText("请输入有效的金额");
      } else if (parseFloat(this.amount) < parseFloat(data["min_amount"])) {
        this.toastText("支付金额不能小于" + data["min_amount"] + "元");
      } else if (parseFloat(this.amount) > parseFloat(data["max_amount"])) {
        this.toastText("支付金额不能大于" + data["max_amount"] + "元");
      } else if (this.bonusList.length && !this.bonus) {
        this.toastText("请选择优惠比例", "top");
      } else {
        this.submitting = true;
        this.$store.state.main.loadingText = "正在提交...";
        let submitData = {
          amount: this.amount,
          depositId: data.id,
          bankId: data.cardNum,
          bankName: data.bankName,
          bankAccountName: data.cardName,
          className: data.className,
          bankSerialNumber: "",
          depositRealName: this.name.split("_")[0],
          depositTime: dayJs().format("YYYY-MM-DD HH:mm:ss"),
          classId: data.classId,
          port: "h5",
        };
        if (this.bonusList.length) {
          submitData["bonusRate"] = this.bonus.split(" ")[0].replace("%", "");
        }
        this.$store
          .dispatch("user/saveSubmitByWxOrZfb", submitData)
          .then((res) => {
            this.submitting = false;
            this.$store.state.main.loadingText = "";
            if (res.code === 200) {
              this.toastText("提交成功,等待管理员审核");
              this.amount = "";
              if (this.bonusList.length) {
                this.bonus = this.bonusList[0];
              }
            } else if (res.message) {
              this.toastText(res.message);
            } else if (res.msg) {
              this.toastText(res.msg);
            }
          })
          .catch(() => {
            this.submitting = false;
            this.$store.state.main.loadingText = "";
          });
        // this.$router.push({ path: '/save/saveDeposit' , query:{
        //   id:data.id,
        //   classId:data.classId,
        //   amount:data.amount
        // }})
      }
    },
    onCopy(str) {
      this.$copyText(str).then(
        (e) => {
          this.toastText("复制成功");
        },
        (e) => {
          this.toastText("请手动复制或使用其他浏览器尝试");
        }
      );
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
  &.input-name {
    .input {
      font-size: 0.32rem !important;
    }
  }
}
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
    background-color: #fafafa;
    /deep/ .swiper-button-prev {
      width: 0.45rem;
      height: 0.47rem;
      background-image: url("../../assets/img/save/TransferBank/previous-btn.png");
      left: 0.56rem;
    }
    /deep/ .swiper-button-next {
      width: 0.45rem;
      height: 0.47rem;
      background-image: url("../../assets/img/save/TransferBank/next-btn.png");
      right: 0.56rem;
    }
  }
  .bank-form {
    background-color: #fafafa;
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
      padding: 0.35rem 0.32rem 0.35rem 0.3rem;
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
        color: #e9b741;
        margin-top: 0.05rem;
      }
    }
    .bank-list {
      padding: 0.14rem 0.27rem 0;
      overflow: hidden;
      .bank-item {
        position: relative;
        float: left;
        width: 2.2rem;
        height: 0.8rem;
        line-height: 0.76rem;
        background: #fff;
        border-radius: 0.1rem;
        margin-left: 0.16rem;
        font-size: 0.26rem;
        padding-left: 0.82rem;
        box-sizing: border-box;
        margin-bottom: 0.27rem;
        display: flex;
        justify-content: start;
        align-items: center;
        font-size: 0.26rem;
        box-shadow: 0 0 0.18rem 0 rgb(0 0 0 / 2%);
        &:first-child {
          margin-left: 0;
        }
        &:nth-child(3n + 1) {
          margin-left: 0;
        }
        .bank-icon {
          position: absolute;
          left: 0.18rem;
          top: 0.12rem;
          width: 0.54rem;
        }
        .bank-name {
          text-align: left;
          line-height: 0.28rem;
        }
        .item-icon {
          width: 0.45rem;
          height: 0.45rem;
          position: absolute;
          right: -0.02rem;
          bottom: -0.04rem;
        }
        &.active {
          box-shadow: 0px 0px 13px 0px rgba(0, 189, 212, 0.5);
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
        border-radius: 0.1rem;
        line-height: 0.6rem;
        font-size: 0.26rem;
        border: 0.02rem solid #00bbd2;
        color: #00bbd2;
      }
    }
    .grayColor {
      /deep/.label {
        color: #a3a5b3;
      }
    }
    .no-border {
      &::after {
        display: none;
      }
    }
    .line {
      height: 0.2rem;
      background: #f6f6f6;
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
}
.newQP-container {
  .bank-item {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      #000000 100%
    ) !important;
    border: 0.02rem solid #373737 !important;
    color: #f6cf32;
    &.active {
      box-shadow: none !important;
      border: 0.02rem solid #f6cf32 !important;
    }
  }
  /deep/.van-checkbox__label {
    color: #fff;
  }
}
.blush-container {
  .bank-item {
    background: linear-gradient(0deg, #72010b, #98010e) !important;
    color: #f6cf32;
    &.active {
      box-shadow: none !important;
      border: 0.02rem solid #f6cf32 !important;
    }
  }
  /deep/.van-checkbox__label {
    color: #fff;
  }
}
</style>
