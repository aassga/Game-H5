<template>
  <div
    class="addUsdt theme-header-bg"
    :class="[
      { 'newQP-addUsdt': $config.newQP || $config.blackTheme },
      { 'blush-addUsdt': $config.blush },
      { 'QP893-addUsdt': $config.isBlackRedTheme },
    ]"
  >
    <div class="tit theme-color-white">选择币种</div>
    <!-- <div class="select" @click="showPopup = true">
      <div class="txt">{{ usdtType }}</div>
      <div class="date-icon icon iconfont h5-icon-qushi-moreup"></div>
    </div> -->
    <input-row
      :title="'选择币种'"
      v-model="usdtType"
      type="select"
      placeholder="选择币种"
      :data="usdtTypeList"
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
    <div class="tit theme-color-white">开户姓名</div>
    <input-row
      :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
      v-model="cardName"
      v-keyBroayStates
      type="text"
      placeholder="请输入开户姓名"
      class="input-name"
      :disabled="!!user['realName']"
    ></input-row>
    <div class="tit theme-color-white">{{ usdtType.split("-")[1] }}地址</div>
    <!-- <input-row
      :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
      v-model="cardNum"
      v-keyBroayStates
      type="text"
      :placeholder="'请输入'+usdtType.split('-')[1]+'地址'"
      class="input-name"
      :inputFunc="inputFunc"
      max-len="64"
    ></input-row> -->
    <div class="textarea-cell" v-keyBroayStates>
      <textarea
        rows="2"
        class="theme-color-white"
        v-model="cardNum"
        maxlength="50"
        resize="none"
        @input="cardNumChange"
      ></textarea>
      <div class="placeHolder" v-if="!cardNum">
        请输入{{ usdtType.split("-")[1] }}地址
      </div>
    </div>
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
      v-model="payPassword_confirmation"
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
      注意：为了您的资金能够迅速到帐，请确保填写的USDT地址正确。
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
      确认绑定
    </button>
    <!-- <save-popup :show="showPopup" :btnValue="'确定'" @onConfirm="onConfirm">
      <div
        slot="head"
        class="usdt-tit"
        :class="[
          { 'newQP-tit': $config.newQP || $config.blackTheme },
          { 'blush-tit': $config.blush },
        ]"
      >
        <span class="txt theme-color-white">选择币种</span>
        <span class="btn" @click="showPopup = false">取消</span>
      </div>
      <van-picker
        :visible-item-count="3"
        :columns="usdtTypeList"
        slot="content"
        class="usdt-picker"
        @change="onChange"
      />
    </save-popup> -->
  </div>
</template>

<script type="text/javascript">
import savePopup from "@src/components/save-popup/index.vue";
export default {
  name: "addUsdt",
  computed: {},
  components: {
    savePopup,
  },
  data() {
    return {
      submitting: false,
      cardName: "",
      cardNum: "",
      payPassword: "",
      payPassword_confirmation: "",
      usdtTypeList: [],
      usdtType: "",
      usdtIndex: 0,
      showPopup: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user.userInfo;
    },
  },
  created() {
    this.$store
      .dispatch("user/usdtType")
      .then((res) => {
        if (res.code === 200) {
          this.usdtTypeList = res.data;
          this.usdtType = this.usdtTypeList[0];
        }
      })
      .catch(() => {});
    this.cardName = this.user["realName"];
  },
  mounted() {},
  methods: {
    cardNumChange() {
      this.$nextTick(() => {
        this.cardNum = this.cardNum.replace(/[^\w]/g, "");
      });
    },
    onChange(picker, value, index) {
      this.usdtIndex = index;
    },
    onConfirm() {
      this.usdtType = this.usdtTypeList[this.usdtIndex];
      this.showPopup = false;
    },
    onSubmit() {
      let usernameReg = /[~!@#$%^&*()/\|,.<>?"'();:_+-=\[\]{}]/;
      if (this.submitting) {
        this.toastText("正在提交");
      } else if (!this.cardName) {
        this.toastText("请输入开户姓名");
      } else if (usernameReg.test(this.cardName)) {
        this.toastText("请输入正确的开户姓名");
      } else if (!this.cardNum) {
        this.toastText("请输入USDT地址");
      } else if (this.payPassword.length !== 6) {
        this.toastText("请输入正确的6位资金密码");
      } else if (
        this.user["payPassword"] === "unset" &&
        this.payPassword !== this.payPassword_confirmation
      ) {
        this.toastText("两次输入的资金密码不一致");
      } else {
        const data = {
          device: "h5",
          cardNum: this.cardNum.replace(/[\s]/g, ""),
          payPassword: this.payPassword,
          cardName: this.cardName,
          usdt_type: this.usdtType,
        };
        if (this.payPassword_confirmation) {
          data.payPassword_confirmation = this.payPassword_confirmation;
        }
        this.submitting = true;
        this.$store
          .dispatch("user/addUSDT", data)
          .then((res) => {
            this.submitting = false;
            if (res.code === 200) {
              this.toastText("添加成功");
              this.$store.dispatch("user/refreshInfo").then(() => {
                this.$store.dispatch("user/refreshUsdt").then(() => {
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
    inputFunc() {
      this.$nextTick(() => {
        this.cardNum = this.cardNum.replace(/[^\w]/g, "");
      });
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.textarea-cell {
  position: relative;
  align-items: center;
  font-size: 0.26rem;
  height: 0.86rem;
  width: 100%;
  overflow: hidden;
  &::after {
    position: absolute;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: 0;
    top: 0;
    left: 0.3rem;
    border-bottom: 0.02rem solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 0 !important;
    top: 98%;
    margin-right: 0.1rem;
  }
  textarea {
    position: absolute;
    top: 0rem;
    left: 0;
    height: 0.8rem;
    width: 5.4rem;
    border: none;
    font-size: 0.32rem;
    color: #333333;
    resize: none;
    line-height: 0.45rem;
  }
  .placeHolder {
    float: left;
    margin-top: 0.15rem;
    font-size: 0.32rem;
    color: #b3b5c0;
  }
}
.usdt-tit {
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
.usdt-picker {
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
.addUsdt {
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
    &.select .input {
      padding-left: 0.3rem;
    }
  }
  .select {
    position: relative;
    width: 6.92rem;
    height: 0.87rem;
    line-height: 0.87rem;
    padding: 0 0.33rem;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #f2f2fa;
    border-radius: 0.09rem;
    color: #333333;
    font-size: 0.3rem !important;
    text-align: left;
    box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.02);
    margin: 0.2rem auto;
    .icon {
      position: absolute;
      top: 0%;
      right: 0.24rem;
      font-size: 0.3rem;
      transform: scale(0.5) rotateZ(180deg);
      color: #000;
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
    margin: 0.4rem 0 0.6rem;
  }
  .submit-betnew {
    background: #037a5d !important;
  }
}

.newQP-addUsdt {
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
.blush-addUsdt {
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
.newQP-tit {
  background: linear-gradient(180deg, #171717 0%, #0b0b0b 100%) !important;
}
.blush-tit {
  background: linear-gradient(270deg, #73010b, #9d010f) !important;
}

// QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 start
//控制 新增USDTD內容 背景顏色 && 按鈕顏色 && 字體顏色
.QP893-addUsdt {
  background-color: #1b1d1b; //添加USTD背景樣式
  .tit {
    color: #ffffff; //添加USTD標題顏色
  }
  .user-input-row {
    /deep/.input {
      color: #ffffff; //添加USTD輸入框顏色
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
    background-color: #272829; //添加USTD下拉選單背景顏色
    .icon {
      color: #ffffff; //添加USTD下拉選單icon
    }
  }
  .textarea-cell {
    textarea {
      color: #ffffff; //添加USTD輸入框文字顏色
    }
  }
  .des {
    color: #ffffff; //添加USTD提示文字顏色
  }
}
// QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 end
</style>