<template>
  <div
    class="addBank theme-header-bg"
    :class="[
      { 'newQP-addBank': $config.newQP || $config.blackTheme },
      { 'blush-addBank': $config.blush },
      { 'QP893-addBank': $config.isBlackRedTheme },
    ]"
  >
    <div class="tit theme-color-white">持卡人姓名</div>
    <input-row
      :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
      v-model="name"
      v-keyBroayStates
      type="text"
      placeholder="请输入提卡人姓名"
      class="input-name"
      :disabled="!!user['realName']"
    ></input-row>
    <input-row
      :title="'开户银行'"
      v-model="bank"
      type="select"
      placeholder="请选择开户银行"
      :data="commBank"
      is-click
      :themeStyle="$config.blackTheme || $config.newQP || $config.blush"
      class="select"
      :isClick="false"
      v-keyBroayStates
    >
      <span
        slot="label"
        class="date-icon icon iconfont h5-icon-qushi-moreup"
      ></span>
    </input-row>
    <div class="tit theme-color-white">银行卡号</div>
    <input-row
      :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
      v-model="num"
      v-keyBroayStates
      type="tel"
      placeholder="请输入银行卡号"
      class="input-name"
      min-len="15"
      max-len="25"
    ></input-row>
    <div class="tit theme-color-white">开户地区</div>
    <input-row
      v-model="address"
      :title="'开户网点'"
      placeholder="请选择开户地区"
      type="address"
      is-click
      :themeStyle="
        $config.newQP || $config.blackTheme || $config.blush || $config.isBlackRedTheme
      "
      :isClick="false"
      class="select"
      ><span
        slot="label"
        class="date-icon icon iconfont h5-icon-qushi-moreup"
      ></span
    ></input-row>
    <div class="tit theme-color-white">资金密码</div>
    <input-row
      v-keyBroayStates
      :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
      type="password"
      max-len="6"
      v-model="payPassword"
      placeholder="请输入资金密码"
      :class="{
        redColor: !$config.newQP && !$config.blackTheme && !$config.blush,
      }"
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
    <div class="tit theme-color-white" v-if="user['payPassword'] === 'unset'">
      确认资金密码
    </div>
    <input-row
      v-if="user['payPassword'] === 'unset'"
      v-keyBroayStates
      :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
      type="password"
      max-len="6"
      v-model="payPassword2"
      placeholder="请确认6位资金密码"
      :class="{
        redColor: !$config.newQP && !$config.blackTheme && !$config.blush,
      }"
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
    <p class="des">
      请认真仔细填写您的银行帐号，填写的银行帐号必须和持卡人姓名一致否则申请出款时会导致出款失败，为了您的资金能快速到帐请务必仔细填写，谢谢！
    </p>
    <button
      type="button"
      class="submit theme-yellow-bg theme-color-black"
      :class="[
        { 'submit-betnew': $config.name === 'betnew' },
        { 'submit-839qp': $config.isBlackRedTheme },
      ]"
      :disabled="submitting"
      @touchstart.capture="onSubmit($event)"
    >
      确认提交
    </button>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "addBank",
  computed: {},
  components: {},
  data() {
    return {
      name: "",
      bank: "",
      num: "",
      address: [],
      payPassword: "",
      payPassword2: "",
      submitting: false,
      commBank: [
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
        "吉林银行",
        "浙江网商银行",
      ],
    };
  },
  created() {
    this.name = this.user["realName"];
  },
  watch: {
    num(val) {
      this.$nextTick(() => {
        this.num = val.replace(/\D/g, "").replace(/....(?!$)/g, "$& ");
        var u = navigator.userAgent;
        var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
        if (isAndroid) {
          let inputBank = document.getElementsByClassName("input")[1];
          let pos = 0;
          if (inputBank.selectionStart == inputBank.selectionEnd)
            pos =
              inputBank.selectionStart % 4 != 0
                ? inputBank.selectionStart
                : inputBank.selectionStart + 1;
          else pos = -1;
          if (pos != -1) {
            setTimeout(() => {
              inputBank.setSelectionRange(pos, pos);
            }, 0);
          }
        }
      });
    },
  },
  mounted() {},
  computed: {
    user() {
      return this.$store.state.user.userInfo;
    },
  },
  methods: {
    onSubmit() {
      let usernameReg = /[~!@#$%^&*()/\|,.<>?"'();:_+-=\[\]{}]/;
      if (this.submitting) {
        this.toastText("正在提交");
      } else if (!this.name) {
        this.toastText("请输入提卡人姓名");
      } else if (usernameReg.test(this.name)) {
        this.toastText("请输入正确的提卡人姓名");
      } else if (!/^[\d]{15,21}$/.test(this.num.replace(/[\s]/g, ""))) {
        this.toastText("请输入正确的15位至21位银行卡号");
      } else if (!this.bank) {
        this.toastText("请选择开户银行");
      } else if (!this.address.length) {
        this.toastText("请选择开户地点");
      } else if (this.payPassword.length !== 6) {
        this.toastText("请输入正确的6位资金密码");
      } else if (
        this.user["payPassword"] === "unset" &&
        this.payPassword !== this.payPassword2
      ) {
        this.toastText("两次输入的资金密码不一致");
      } else {
        const data = {
          cardNum: this.num.replace(/[\s]/g, ""),
          bankName: this.bank,
          cardAddress: this.address,
          payPassword: this.payPassword,
          cardName: this.name,
        };
        if (this.payPassword2) {
          data.payPassword_confirmation = this.payPassword2;
        }
        this.submitting = true;
        this.$store
          .dispatch("user/addBank", data)
          .then((res) => {
            this.submitting = false;
            if (res.code === 200) {
              this.toastText("添加成功");
              this.$store.dispatch("user/refreshInfo").then(() => {
                this.$store.dispatch("user/refreshBank").then(() => {
                  this.parentIndex(0);
                });
              });
            } else {
              let message = res.message.split(/\s/);
              this.toastText(message.splice(0, 4));
            }
          })
          .catch(() => {
            this.toastText("添加失败");
          });
      }
    },
    parentIndex(index) {
      this.$emit("clickTab", index);
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.addBank {
  padding: 0 0.29rem;
  font-family: PingFangSC-Regular, PingFang SC;
  background-color: #fafafa;
  .tit {
    font-size: 0.36rem;
    line-height: 0.6rem;
    color: #333;
    text-align: left;
  }
  /deep/ .user-input-row {
    padding-left: 0 !important;
    height: 0.8rem;
    margin-bottom: 0.2rem;
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
      padding-left: 0.3rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
  .des {
    color: #666666;
    font-size: 0.29rem;
    text-align: left;
    margin-top: 0.2rem;
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
    margin: 0.3rem 0 0.5rem;
  }
  .submit-betnew {
    background: #037a5d !important;
  }
}

.newQP-addBank {
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
.blush-addBank {
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
// QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 start
//控制 新增銀行卡內容 背景顏色 && 按鈕顏色 && 字體顏色
.QP893-addBank {
  background-color: #1b1d1b; //添加提款背景樣式
  .tit {
    color: #ffffff; //添加提款標題顏色
  }
  .user-input-row {
    /deep/.input {
      color: #ffffff; //添加提款輸入框顏色
    }
  }
  .submit-839qp {
    background: linear-gradient(
      180deg,
      rgb(204, 52, 50) 0%,
      rgb(197, 39, 33) 100%
    ); //送出按鈕顏色
  }
  .select {
    background-color: #272829; //添加提款下拉選單背景顏色
    .icon {
      color: #ffffff; //添加提款下拉選單icon
    }
  }
  .des {
    color: #ffffff; //添加提款提示文字顏色
  }
}
// QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 end
</style>