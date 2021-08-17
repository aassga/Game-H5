<template>
  <view-page class="add-bank theme-header-bg" :transfer-header="false" :full-box="!isShowFixed">
    <title-header :title="'绑定银行卡'" @back="onBack" :back-event="true" slot="header" class="theme-header-bg theme-header-bottom"></title-header>
    <div class="content-slot theme-main-bg" slot="content">
      <van-cell-group class="theme-header-bg">
        <van-cell class="theme-header-bg theme-after-border-color">
          <input-row
            v-model="name"
            label="帐号姓名"
            placeholder="请输入开户姓名"
            type="text"
            :disabled="!!user['realName']"
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>
        </van-cell>

        <van-cell class="theme-header-bg theme-after-border-color">
          <input-row
            v-model="num"
            label="银行帐号"
            placeholder="请输入银行卡号"
            type="tel"
            class="bank-num"
            ref="num-input"
            min-len ="15"
            max-len="26"
            v-keyBroayStates
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>
        </van-cell>

        <van-cell class="theme-header-bg theme-after-border-color">
          <input-row
            v-model="bank"
            label="开户银行"
            :placeholder="bankInputPlaceholder"
            :title="'开户银行'"
            :type="bankInputType"
            is-click
            :data="commBank"
            v-keyBroayStates
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>
          
        </van-cell>

        <van-cell class="theme-header-bg theme-after-border-color">
          <input-row v-model="address" label="开户地区"  :title="'开户网点'" placeholder="请选择开户地区" type="address" is-click :themeStyle="$config.newQP || $config.blackTheme || $config.blush"></input-row>
        </van-cell>

        <!-- <van-cell>
          <input-row v-model="dot" label="开户网点"  :title="'开户网点'" placeholder="请输入开户网点名称" type="text"></input-row>
        </van-cell> -->
      </van-cell-group>
      <van-cell-group v-if="user['payPassword']==='unset'&&user['secret']==='unset'" class="">
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
            v-model="payPassword2"
            label="确认密码"
            placeholder="请确认6位资金密码"
            type="number-password"
            maxLen="6"
            v-keyBroayStates
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>
        </van-cell>

        <!-- <van-cell>
          <input-row
            v-model="key"
            label="密保问题"
            placeholder="请选择密保问题"
            type="select"
            :title="'请选择密保问题'"
            is-click
            v-keyBroayStates
            v-if="secretKey.length && personalMode !== 'mode_c'"
            :data="secretKey"
          ></input-row>
        </van-cell>

        <van-cell>
        <input-row v-model="value" label="密保答案" placeholder="请输入密保答案" v-if="personalMode !== 'mode_c'" v-keyBroayStates type="text"></input-row>
        </van-cell> -->
      </van-cell-group>
      <van-cell-group v-else-if="user['payPassword']==='unset'" class="theme-header-bg">
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
            v-model="payPassword2"
            label="确认密码"
            placeholder="请确认6位资金密码"
            type="number-password"
            maxLen="6"
            v-keyBroayStates
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>
        </van-cell>
      </van-cell-group>
      <van-cell-group v-else>
        <input-row
          v-model="payPassword"
          label="资金密码"
          placeholder="请输入6位资金密码"
          type="number-password"
          maxLen="6"
          v-keyBroayStates
          class="theme-header-bg theme-after-border-color"
          :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
        ></input-row>
      </van-cell-group>
      <div style="width: 100%;padding: 0.24rem;box-sizing: border-box">
        <van-button block type="primary" @click="onSubmit" class="theme-yellow-bg theme-color-black">提交信息</van-button>
      </div>

      <div class="bottom-info">
        <h4 class="info-title">注意事项：</h4>
        <p class="info-item">1.请牢记资金密码，如果遗失将无法取款</p>
        <p class="info-item">2.请勿泄露您的资金密码，以免资金受到损失</p>
      </div>
      
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "AddBank",
  data() {
    return {
      bankInputType:'select',
      bankInputPlaceholder:'请选择开户银行',
      submitting: false,
      name: "",
      num: "",
      bank: [],
      address: [],
      dot: "",
      payPassword: "",
      payPassword2: "",
      numChange: false,
      secretKey: [],
      isOtherBank: false,
      key: [],
      value: "",
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
      ]
    };
  },
  watch: {
    num(val) {
      // if (this.numChange) {
      //   const input = this.$refs['num-input'].$el.querySelector('input')
      //   this.numChange = false
      //   setTimeout(() => {
      //     input.selectionEnd = input.selectionStart = this.num.length
      //   })
      // }
      // this.num = val.replace(/[\s]/g, '').replace(/([\d]{4})/g, '$1 ')
      // this.numChange = this.num !== val
     
      this.$nextTick(() => {
          this.num = val.replace(/\D/g, "").replace(/....(?!$)/g, "$& ");
          var u = navigator.userAgent;
          var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; 
          if(isAndroid){
            let inputBank=document.getElementsByClassName('input')[1]
            let pos=0
            if(inputBank.selectionStart==inputBank.selectionEnd) pos=inputBank.selectionStart % 4 != 0 ? inputBank.selectionStart:inputBank.selectionStart+1;
            else pos= -1
            if(pos!=-1){
                setTimeout(()=>{
                  inputBank.setSelectionRange(pos,pos)
                },0)
            }
          }
      });
    },
    
    // dot(val){
    //   let dotReg=/^[a-z0-9]+$/i
    //   let str=val.split("")
    //   for(let i in str){
    //     if(dotReg.test(str[i])){
    //       this.toastText("开户网点请勿输入数字和英文", "top");
    //     }
    //   }
    // }
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
    onscrollFun(){

      
    },
    onBack() {
      if (this.$route.query.action === "select") {
        this.$router.go(-2);
      } else {
        this.$router.back();
      }
    },
    onSubmit() {
      let usernameReg = /[~!@#$%^&*()/\|,.<>?"'();:_+-=\[\]{}]/
      let dotReg=/^[a-z0-9]+$/i
      if (this.submitting) {
        this.toastText("正在提交", "top");
      } else if (!this.name) {
        this.toastText("请输入开户姓名", "top");
      } else if(usernameReg.test(this.name) && !this.user["realName"]){
        this.toastText("请输入正确的姓名", "top");
      }
      else if (!/^[\d]{15,21}$/.test(this.num.replace(/[\s]/g, ""))) {
        this.toastText("请输入正确的15位至21位银行卡号", "top");
      } else if (!this.bank) {
        this.toastText("请选择开户银行", "top");
      } else if (!this.address.length) {
        this.toastText("请选择开户地点", "top");
      } 
      // else if (!this.dot.length) {
      //   this.toastText("请输入开户网点", "top");
      // } else if (dotReg.test(this.dot)) {
      //   this.toastText("开户网点请勿输入数字和英文", "top");
      // } 
      else if (this.payPassword.length !== 6) {
        this.toastText("请输入正确的6位资金密码", "top");
      } else if (
        this.user["payPassword"] === "unset" &&
        this.payPassword !== this.payPassword2
      ) {
        this.toastText("两次输入的资金密码不一致", "top");
      } 
      // else if (
      //   this.user["secret"] === "unset" &&
      //   this.user["payPassword"] === "unset" &&
      //   this.personalMode !== 'mode_c' &&
      //   !this.key
      // ) {
      //   this.toastText("请选择密保问题", "top");
      // } else if (
      //   this.user["secret"] === "unset" &&
      //   this.user["payPassword"] === "unset" &&
      //   this.personalMode !== 'mode_c' &&
      //   !this.value
      // ) {
      //   this.toastText("请输入密保答案", "top");
      // } 
      else {
        this.$store.state.main.loadingText = "提交中...";
        const data = {
          // cardName: this.name,
          cardNum: this.num.replace(/[\s]/g, ""),
          bankName: this.bank,
          // cardAddress: this.address + " " + this.dot,
          cardAddress: this.address,
          payPassword: this.payPassword
        };

        if (!this.user["realName"]) {
          data.cardName = this.name;
        }

        if (this.payPassword2) {
          data.payPassword_confirmation = this.payPassword2;
        }

        // if (this.key || this.personalMode === 'mode_c') {
        //   data.key = this.personalMode === 'mode_c' ? '123456' : this.key;
        // }

        // if (this.value || this.personalMode === 'mode_c') {
        //   data.value = this.personalMode === 'mode_c' ? '123456' : this.value;
        // }

        this.submitting = true;
        this.$store
          .dispatch("user/addBank", data)
          .then(res => {
            this.$store.state.main.loadingText = "";
            this.submitting = false;
            if (res.code === 200) {
              this.toastText("添加成功", "top");
              this.$store.dispatch("user/refreshInfo").then(() => {
                this.$store.dispatch("user/refreshBank").then(() => {
                  setTimeout(() => {
                    if(this.$store.state.main.bindBankMsg && this.$store.state.main.bindBankId == '5012'){
                      this.$store.commit("main/setBindBankMsg", '');
                      this.onBack();
                    }else if(this.$route.query.relink) {
                      this.$router.replace('/take')
                    }else if(this.$route.query.user) {
                      this.$router.replace('/user/cardedit?tabIndex=0')
                    }else {
                      this.onBack();
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
    }
  },
  async created() {
    if (!this.user) {
      this.$router.push("/admin/login");
    }
    this.$store.dispatch("user/getSecretKey", {
      callback: res => {
        this.secretKey = res;
      }
    });
    this.name = this.user["realName"];
  }
};
</script>

<style lang="less" type='text/less' scoped>
.add-bank {
  /deep/ .van-cell {
    padding: 0;
  }
  /deep/ .van-hairline--top-bottom::after {
    border-width: 0;
    display: none;
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

  .bank-num {
    /deep/ .input {
      font-size: 0.4rem;
      height: 0.6rem;
      line-height: 0.6rem;
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

.iphone {
  .bank-num {
    /deep/ .input {
      /*transform: translateY(3%);*/

      &::-webkit-input-placeholder {
        transform: translateY(6%);
      }
    }
  }
}
</style>
