<template>
  <view-page class="add-usdt" :transfer-header="false" :full-box="!isShowFixed">
    <title-header :title="'绑定USDT'" @back="onBack" :back-event="true" slot="header" class="theme-header-bg theme-header-bottom"></title-header>
    <div class="content-slot theme-main-bg" slot="content">
      <van-cell-group class="theme-header-bg">
        <van-cell class="theme-header-bg theme-after-border-color">
          <input-row
            v-model="cardName"
            label="帐号姓名"
            placeholder="请输入开户姓名"
            type="text"
            v-keyBroayStates
            :disabled="!!user['realName']"
            :maxLen="'10'"
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>
        </van-cell>

        <!-- <van-cell>
          <input-row
            v-model="cardNum"
            label="USDT地址"
            placeholder="请输入您的USDT-ERC20收款地址"
            type="text"
            class="cardNum"
            :maxLen="'50'"
            @input="cardNumChange"
          ></input-row>
        </van-cell> -->
        <div class="textarea-cell">
          <span class="label theme-color-white">USDT地址</span>
          <textarea rows="2" class="theme-color-white" v-model="cardNum" maxlength="50" resize="none" @input="cardNumChange"></textarea>
          <div class="placeHolder" v-if="!cardNum">请输入您的USDT-ERC20收款地址</div>
        </div>
      </van-cell-group>
      <van-cell-group v-if="user['payPassword']==='unset' || (user['payPassword']==='unset'&&user['secret']==='unset')" class="theme-header-bg">
        <van-cell class="theme-header-bg theme-after-border-color">
          <input-row
            v-model="payPassword"
            label="资金密码"
            placeholder="请输入6位资金密码"
            type="number-password"
            maxLen="6"
            v-keyBroayStates
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>
        </van-cell>

        <van-cell class="theme-header-bg theme-after-border-color">
          <input-row
            v-model="payPassword_confirmation"
            label="确认密码"
            placeholder="请确认6位资金密码"
            type="number-password"
            maxLen="6"
            v-keyBroayStates
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>
        </van-cell>
      </van-cell-group>
      <van-cell-group v-else class="theme-header-bg theme-after-border-color">
        <input-row
          v-model="payPassword"
          label="资金密码"
          placeholder="请输入6位资金密码"
          type="number-password"
          maxLen="6"
          v-keyBroayStates
          :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
        ></input-row>
      </van-cell-group>
      <div style="width: 100%;padding: 0.24rem;box-sizing: border-box">
        <van-button block type="primary" @click="onSubmit" class="theme-yellow-bg theme-color-black">提交信息</van-button>
      </div>

      <div class="bottom-info">
        <h4 class="info-title">注意事项：</h4>
        <p class="info-item">1.绑定地址必须为USDT-ERC20地址</p>
        <p class="info-item">2.请务必再三确认连接名称为：ERC20地址</p>
        <p class="info-item">3.如绑定地址遇到未知问题请及时联系客服</p>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "AddUsdt",
  data() {
    return {
      submitting: false,
      cardName: "",
      cardNum: "",
      payPassword: "",
      payPassword_confirmation: "",
    };
  },
  computed: {
    user() {
      return this.$store.state.user.userInfo;
    },
     isShowFixed(){
      if(this.$mobileDevice.isIOS 
        && this.$mobileDevice.browserName !=='UCBrowser' 
        && this.$mobileDevice.osVersion !== '12.4'
        && !this.$userAgent.includes('SogouMobileBrowser')){
        return this.$store.state.main.keyBoardStatus
      }else{
        return true;
      }
    }
  },
  mounted(){
  },
  methods: {
    onBack() {
      if(this.$route.query.relink || this.$store.state.user.usdtData.length < 1) {
        this.$store.state.user.takeTabIndex = 0
      }
      this.$router.back();
    },
    onSubmit() {
      let usernameReg = /[~!@#$%^&*()/\|,.<>?"'();:_+-=\[\]{}]/
      if (this.submitting) {
        this.toastText("正在提交", "top");
      } else if (!this.cardName) {
        this.toastText("请输入开户姓名", "top");
      } else if(usernameReg.test(this.cardName) && !this.user["realName"]){
        this.toastText("请输入正确的姓名", "top");
      } else if(!this.cardNum) {
        this.toastText("请输入USDT地址", "top");
      } else if (this.payPassword.length !== 6) {
        this.toastText("请输入正确的6位资金密码", "top");
      } else if (
        this.user["payPassword"] === "unset" &&
        this.payPassword !== this.payPassword_confirmation
      ) {
        this.toastText("两次输入的资金密码不一致", "top");
      } 
      else {
        this.$store.state.main.loadingText = "提交中...";
        const data = {
          device: 'h5',
          cardNum: this.cardNum.replace(/[\s]/g, ""),
          payPassword: this.payPassword
        };
        if (!this.user["realName"]) {
          data.cardName = this.cardName
        }
        if (this.payPassword_confirmation) {
          data.payPassword_confirmation = this.payPassword_confirmation;
        }
        this.submitting = true;
        this.$store
          .dispatch("user/addUSDT", data)
          .then(res => {
            this.$store.state.main.loadingText = "";
            this.submitting = false;
            if (res.code === 200) {
              this.toastText("添加成功", "top");
              this.$store.dispatch("user/refreshInfo").then(() => {
                this.$store.dispatch("user/refreshUsdt").then(() => {
                  setTimeout(() => {
                    if(this.$route.query.user === '1') {
                      this.$router.replace('/user/cardedit?tabIndex=1&user=1');
                    }else {
                      this.$router.back();
                    }
                  }, 100);
                });
              });
            } else {
              let message = res.message.split(/\s/)
              this.toastText(message.splice(0,4), "top");
            }
          })
          .catch(() => {
            this.$store.state.main.loadingText = "";
            this.toastText("添加失败", "top");
          });
      }
    },
    cardNumChange() {
      this.$nextTick(() =>{
        this.cardNum = this.cardNum.replace(/[^\w]/g,'')
      })
    }
  },
  async created() {
    if (!this.user) {
      this.$router.push("/admin/login");
    }
    this.cardName = this.user["realName"];
  }
};
</script>

<style lang="less" type='text/less' scoped>
.add-usdt {
  /deep/ .van-cell {
    padding: 0;
  }
  /deep/ .van-hairline--top-bottom::after {
    border-width: 0;
    display: none;
  }
  .textarea-cell {
    position: relative;
    align-items: center;
    font-size: 0.26rem;
    height: 1.48rem;
    width: 100%;
    overflow: hidden;
    padding-left: 0.3rem;
    .label {
      float: left;
      font-size: 0.32rem;
      color: #333;
      margin-right: 0.2rem;
      margin-top: 0.34rem;
      word-spacing: normal;
      text-align: left;
    }
    textarea {
      position: absolute;
      top: 0.34rem;
      left: 1.9rem;
      width: 5.4rem;
      border: none;
      font-size: 0.32rem;
      color: #333333;
      resize: none;
      line-height: 0.45rem;
    }
    .placeHolder {
      float: left;
      margin-top: 0.34rem;
      font-size: 0.32rem;
      color: #b3b5c0;
    }
  }
  .otherBank {
    position: relative;
    .h5-icon-left-menu-ico {
      position: absolute;
      right: 0;
      top: 0;
      color: #adafbb !important;
      font-size: 0.44rem !important;
      line-height: 0.44rem !important;
      width: 0.44rem !important;
      height: 0.44rem !important;
      position: absolute !important;
      right: 0.1rem !important;
      top: 50% !important;
      -webkit-transform: translateY(-50%) !important;
      transform: translateY(-50%) !important;
    }
  }
  .bottom-info {
    width: 100%;
    box-sizing: border-box;
    padding: 0 0.3rem 0.6rem 0.3rem;

    .info-title {
      font-size: 0.3rem;
      color: #ff2200;
      padding-bottom: 0.1rem;
      text-align: left;
    }

    .info-item {
      text-align: left;
      color: #999;
      font-size: 0.26rem;
      line-height: 0.48rem;
    }
  }

  .submit {
    outline: 0;
    border: none;
    border-radius: 0;
    color: #fff;
    width: 100%;
    line-height: 0.9rem;
    font-size: 0.36rem;
    text-align: center;
  }
}
</style>