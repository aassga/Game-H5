<template>
  <view-page
    :full-box="!isShowFixed"
    v-if="isLoading"
    ref="view-page"
    class="container"
    :class="[
      { 'newQP-box theme-main-bg': $config.newQP || $config.blackTheme },
      { 'blush-box theme-header-bg': $config.blush },
      { 'QP839-box theme-header-bg': $config.isBlackRedTheme },
      { 'js85-box theme-header-bg': $config.name === 'js85' },
    ]"
    
  >
    <title-header
      :title="title"
      slot="header"
      class="header theme-header-bottom theme-header-bg theme-color-white"
      :theme="'white'"
      :color="
        $config.newQP ||
        $config.blackTheme ||
        $config.blush ||
        $config.isBlackRedTheme
          ? '#fff'
          : '#252525'
      "
      backEvent
      @back="headerBack"
      :class="[
        {
          'newQP-header': $config.newQP || $config.blackTheme || $config.blush,
        },
        { 'blush-header': $config.blush },
        { 'QP839-header': $config.isBlackRedTheme },
      ]"
    ></title-header>
    <div class="body" slot="content">
      <div v-if="list && list.length">
        <div class="box-top" v-show="title === '充值中心'">
          <van-tabs
            swipe-threshold="4"
            @click="onPayChange"
            ref="tabs"
            class="theme-main-bg-3"
          >
            <van-tab
              v-model="active"
              v-for="(item, i) in list"
              :key="i"
              class="theme-main-bg-3"
            >
              <div slot="title">
                <span
                  class="icon"
                  :style="
                    'backgroundImage:url(' + staticURL + item.classIcon + ');'
                  "
                ></span>
                <span class="name">{{ item.className }}</span>
              </div>
            </van-tab>
          </van-tabs>
        </div>
        <div class="box-content">
          <submit-bank
            :id="id"
            :title="className"
            v-if="id && classType === 'bank'"
            ref="bank"
            @changeHeader="changeHeader"
          ></submit-bank>
          <submit-payment
            :id="id"
            :title="className"
            v-if="id && classType === 'payment'"
            @changeHeader="changeHeader"
            ref="payment"
          ></submit-payment>
          <submit-qrcode
            :id="id"
            :title="className"
            v-if="id && classType === 'qr_code'"
            ref="qr_code"
          ></submit-qrcode>
          <submit-usdt
            :id="id"
            v-if="id && classType === 'virtual'"
            ref="virtual"
            @changeHeader="changeHeader"
          ></submit-usdt>
          <Virtual
            :id="id"
            v-if="id && classType === 'virtual1'"
            ref="virtual1"
            @changeHeader="changeHeader"
          ></Virtual>
          <transfer-account
            :id="id"
            :title="className"
            v-if="id && classType === 'transfer_account'"
            ref="transfer_account"
          ></transfer-account>
          <transfer-bank
            :id="id"
            :title="className"
            v-if="id && classType === 'transfer_bank'"
            ref="transfer_bank"
          ></transfer-bank>
        </div>
        <!-- <div
          v-if="$config.name === 'aqvns'"
          slot="content-static"
          class="down-bottom"
          @click="onDownload"
          v-no-touch-move
          >
            <img :src="require('../../assets/img/home/aqvns/aqvns-bottom.png')" alt="" />
          </div> -->
      </div>
      <div v-else>
        <img style="width: 100%; margin-top: 1rem" :src="noDataImg" alt />
        <p :class="{ 'js85-box-title': $config.name === 'js85' }" style="font-size: 0.3rem; color: #666666">当前暂无充值通道</p>
      </div>
      <img
        :src="PaymentImage"
        alt=""
        class="paymentImage"
        v-if="PaymentImage && PaymentImage.length && list && list.length"
      />
    </div>
    <div
      v-if="['cpxpj','aqvns'].includes($config.name)"
      slot="content-static"
      class="down-bottom"
      @click="onDownload"
    >
      <img :src="downImg" alt="" />
    </div>

    <div
      :style="{ width: '100%', height: $store.state.main.tabHeight + 'px' }"
      slot="footer"
    >
      <ios-alert
        v-model="nameInputShow"
        :width="5.4"
        :ok-callback="onNameSubmit"
        :no-callback="onNameCancel"
        class="saveIosAlert"
        :showNo="false"
      >
        <div class="title ios-title" slot="title">
          <h4 class="title theme-color-white">请填写真实姓名</h4>
          <p class="info theme-color-yellow" style="color: #000">
            姓名绑定后将无法修改
          </p>
        </div>
        <input
          type="text"
          slot="content"
          v-model="realName"
          class="
            input
            name-input
            theme-main-bg theme-border-color theme-color-white
          "
          autocomplete="off"
          placeholder="真实姓名"
        />
      </ios-alert>
    </div>

  </view-page>
</template>

<script type="text/javascript">
import saveList from "./sutomerSaveList";
import SubmitBank from "./SubmitBank";
import SubmitPayment from "./SubmitPayment";
import SubmitQrcode from "./SubmitQRCode";
import SubmitUsdt from "./SubmitUSDT";
import TransferAccount from "./TransferAccount";
import TransferBank from "./TransferBank";
import Virtual from "./virtual";
export default {
  name: "Save",
  components: {
    saveList,
    SubmitBank,
    SubmitPayment,
    SubmitQrcode,
    SubmitUsdt,
    TransferAccount,
    TransferBank,
    Virtual,
  },
  data() {
    return {
      id: "",
      className: "",
      classType: "",
      active: 0,
      staticURL: "",
      submitting: false,
      realName: "",
      nameInputShow: false,
      list: [],
      bank: {
        classIcon: require("../../assets/img/save/bank.png"),
        className: "银行转帐",
        classRemarks: "充值无限额,您的首选!",
        classStatus: "yes",
        classType: "bank",
        devices: "pc,h5,android,ios",
        id: 0,
        sequence: 0,
      },
      isLoading: true,
      PaymentImage: "",
      title: "充值中心",
    };
  },
  computed: {
    noDataImg() {
      if (this.$config.newQP || this.$config.blackTheme) {
        return require("@src/assets/img/yellow.png");
      } else if (this.$config.blush) {
        return require("@src/assets/img/blush.png");
      } else if (this.targetTheme && this.targetTheme["code"]) {
        let matchResult = this.targetTheme["code"];
        return require(`@src/assets/img/${matchResult}.png`);
      } else {
        return require("@src/assets/img/no-data.png");
      }
    },
    isShowFixed() {
      return this.$store.state.main.keyBoardStatus;
    },
    downImg () {
      if (['cpxpj'].includes(this.$config.name)) {
        return require('../../../src/assets/img/save/' + this.$config.name + '-save-bottom.png')
      } else if(['aqvns'].includes(this.$config.name)){
        return require('../../../src/assets/img/save/' + this.$config.name + '-save-bottom.gif')
      }
      return ''
    }
  },
  watch: {
    "$store.state.main.config": {
      handler() {
        this.staticURL = this.$store.state.main.config["statics"];
      },
      deep: true,
    },
    "$store.state.main.keyBoardStatus"(val) {
      let style = this.$refs["view-page"].$el.style;
      if (style.textShadow === "") {
        style.textShadow = "rgba(0,0,0,0) 0 0 0";
      } else {
        style.textShadow = "";
      }
    },
  },
  created() {
    if (this.$store.state.main.config) {
      this.staticURL = this.$store.state.main.config["statics"];
    }
    if (!this.$store.state.user.token) {
      this.$router.replace("/admin/login");
    } else {
      this.$store.dispatch("user/getCategory", {
        callback: (res) => {
          if (res.code === 200) {
            this.list = res.data;
            this.id = res.data[0].id + "";
            this.className = res.data[0].className;
            this.classType = res.data[0].classType;
            this.onPayChange(0);
          } else {
            this.list = [];
          }
        },
      });
    }
    this.$store.dispatch("user/getPaymentPageImage").then((res) => {
      if (res.code === 200) {
        if (res.data.img && res.data.img.length) {
          this.PaymentImage = res.data.img;
        }
      }
    });
  },
  mounted() {
    setTimeout(() => {
      this.checkName();
    }, 500);
  },
  methods: {
    headerBack() {
      if (this.title === "充值中心") {
        this.$router.back();
      } else {
        this.title = "充值中心";
        this.$refs[this.classType].setp1 && this.$refs[this.classType].setp1();
        setTimeout(() => {
          this.$refs["view-page"].scrollToTop();
        }, 20);
      }
    },
    changeHeader(title) {
      this.title = title;
      if (title === "充值中心") {
        this.$refs.tabs.scrollTo(this.list[0].className);
        this.onPayChange(0);
      }
      setTimeout(() => {
        this.$refs["view-page"].scrollToTop();
      }, 20);
    },
    checkName() {
      if (
        this.$store.state.user.token &&
        this.$store.state.user.userInfo &&
        !this.$store.state.user.userInfo.realName
      ) {
        this.nameInputShow = true;
        return false;
      } else {
        return true;
      }
    },
    onNameSubmit() {
      if (this.submitting) {
        this.toastText("正在提交中,请勿重复提交~~~", "middle");
      } else if (!this.realName) {
        this.toastText("请输入真实姓名", "middle");
      } else {
        this.submitting = true;
        this.$store
          .dispatch("user/setInfo", { realName: this.realName })
          .then((res) => {
            this.submitting = false;
            if (res.code === 200) {
              this.toastText("设置成功", "middle");
              this.$store.dispatch("user/refreshInfo").then(() => {
                this.nameInputShow = false;
              });
            } else {
              this.toastText(res.message, "middle");
            }
          });
      }
      return false;
    },
    onNameCancel() {
      this.realName = "";
      this.nameInputShow = false;
      return true;
    },
    onPayClick(item) {
      if (!this.checkName()) {
      } else if (item.classStatus === "yes") {
        if (item.classType == "vip_link") {
          let _theme = localStorage.theme;
          if (this.$config.newQP || this.$config.blackTheme) {
            _theme = "black";
          } else if (this.$config.blush) {
            _theme = "blush";
          }
          window.location.href = `${decodeURIComponent(
            item.vip_url
          )}&port=4&webUrl=${
            window.location.origin
          }&hotGame=4&theme=${_theme}&kf=${this.getKF()}`;
        } else {
          this.$router.push({
            path: "/save/" + item.classType + "/" + item.id,
            query: {
              title: item.className,
            },
          });
        }
      } else {
        this.showIosAlert({
          content: "支付方式暂不可用",
          showNo: false,
        });
      }
    },
    onPayChange(index) {
      if (this.list[index].classType == "vip_link") {
        let _theme = localStorage.theme;
        if (this.$config.newQP || this.$config.blackTheme) {
          _theme = "black";
        } else if (this.$config.blush) {
          _theme = "blush";
        }
        window.location.href = `${decodeURIComponent(
          this.list[index].vip_url
        )}&port=4&webUrl=${
          window.location.origin
        }&hotGame=4&theme=${_theme}&kf=${this.getKF()}`;
      } else {
        this.active = index;
        this.id = this.list[index].id + "";
        this.className = this.list[index].className;
        setTimeout(() => {
          if (
            this.list[index].classType === "payment" &&
            this.list[index].className === "虚拟币支付"
          ) {
            this.classType = "virtual1";
          } else {
            this.classType = this.list[index].classType;
          }
          setTimeout(() => {
            this.$refs[this.classType].reset &&
              this.$refs[this.classType].reset();
          }, 20);
        }, 100);
      }
    },
    errorImg(item) {
      if (item.className.includes("支付宝")) {
        return require("../../assets/img/error-img-alipay.png");
      } else if (item.className.includes("微信")) {
        return require("../../assets/img/error-img-WX.png");
      } else if (item.className.includes("京东")) {
        return require("../../assets/img/error-img-JD.png");
      } else if (item.className.includes("银行")) {
        return require("../../assets/img/error-img-YH.png");
      } else if (item.className.includes("网银")) {
        return require("../../assets/img/error-img-WY.png");
      } else if (item.className.includes("银联")) {
        return require("../../assets/img/error-img-YL.png");
      } else if (item.className.includes("USDT转账")) {
        return require("../../assets/img/error-img-WY.png");
      } else if (item.className.includes("USDT支付")) {
        return require("../../assets/img/error-img-WY.png");
      }
    },
    // 避免引入整個 mixin 造成誤導, 所以把 onDownload 方法拉出來放到這
    onDownload (type) {
      if (this.isAndroid) {
        var downUrl = window.localStorage.getItem('downloadAndroidLink')
        if (downUrl) {
          if (['blr', 'vnst', '103qp', '839qp', '99qp', 'jsqp', 'kkqp', 'k78qp', '935qp', '632qp','kyqp', 'fhcp', '737qp', 'aqvns','dqr', 'hty','qxcp','vnso','tccp','tyc86','dalao','amxpj','amhg','vnso','betnew','cpxpj','xpj83','xpj80','vns81','tyc82'].includes(this.$config.name) && (this.$store.state.main.downloadType && this.$store.state.main.downloadType !== '')) {
            ShareTrace.download()
          } else {
            if (this.$config.autoDownload.android) {
              if (downUrl && downUrl.length > 0  && !downUrl.includes('http')) {
                downUrl = location.origin + "" + this.$config.download.android;
              }
              window.location.href = downUrl;
            } else {
              this.$router.push('/download')
            }
          }
        } else {
          this.$store.state.main.iosAlert.content = '<span style="font-weight:700;">暂不支持安卓APP下载</span>'
          this.$store.state.main.iosAlert.show = true
          this.$store.state.main.iosAlert.okText = '确定'
        }
      } else { 
        if (this.$config.download.appStore) {
          let model = {
            siteCode: this.$config.download.appStore
          }
          new OpenInstall({
              appKey : "u4gzdw",
              onready : function() {
                  this.schemeWakeup();
                  this.wakeupOrInstall();
                  return false;
              }
          }, model);
          setTimeout (() => {
            this.$router.push('/')
          })
          return;
        }
        if (['betnew', 'cpxpj'].includes(this.$config.name)) {
          ShareTrace.download()
          return
        }
        if (['99qp','kkqp','vnst','vnso','amxpj','amhg','103qp','839qp','jsyl','fhcp','vnst','aqvns','dqr','tyc','tccp','tyc86','cpxpj','bet365','betnew','935qp','amvnsr','vns81','pjdc','tycjt','xpj','qygj','hty','tyc82','xpj80','xpj83','dalao'].includes(this.$config.name)) {
          let _url = ''
          if(type === 'enterprisesignLink') {
            _url = window.localStorage.getItem('enterprisesignLink')
          }else {
            _url = window.localStorage.getItem('supersignLink')
          }
          window.history.pushState(window.location.href, null, window.location.href);
          window.location.replace(_url)
        } else if (window.localStorage.getItem('downloadIosLink')) {
          if (this.$config.autoDownload.ios) {
            window.location.href = this.$config.download.ios
          } else {
            if (this.$store.state.main.downloadType === 'testflight') {
              let query = ''
              let goPath = ''
              let agent = localStorage['agent'] || localStorage['channelCode'];
              let downloadUrl = this.$config.download.ios
              if(agent) {
                query = '?agent=' + agent
                downloadUrl ? query += ('&downloadUrl=' + downloadUrl) : ''
              }else {
                query = '?downloadUrl=' + downloadUrl
              }
              query += '&windowHref=' +  window.location.href
              if(this.$store.state.main.ShareTrace && this.$store.state.main.ShareTrace.downloadUrl) {
                query += '&ShareTrace=1'
                goPath = this.$store.state.main.ShareTrace.downloadUrl + query
              }else {
                goPath = window.location.origin + '/app-download/index.html' + query
              }
              window.history.pushState(window.location.href, null, window.location.href)
              window.location.href = goPath
            }else{
              this.$router.push('/download')
            }
          }
        } else {
          this.showAlert = true
          this.$store.state.main.iosAlert.content = '<span style="font-weight:400;">暂不支持苹果APP下载</span>'
          this.$store.state.main.iosAlert.show = true
          this.$store.state.main.iosAlert.okText = '确定'
        }
      }
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
.container {
  background-color: #fafafa;
}
.name-input {
  margin-top: 0.1rem !important;
  width: 100% !important;
  display: inline-block !important;
  box-sizing: border-box !important;
  font-family: PingFang-SC-Regular, serif !important;
  font-weight: 400 !important;
  border: 1px solid #e5e5e5;
  font-size: 0.32rem !important;
  line-height: 0.64rem !important;
  padding: 0.08rem 0.2rem !important;
  border-radius: 0.1rem !important;
  background: #ffffff;
}
.name-input-box {
  width: 100% !important;
  box-sizing: border-box !important;
  text-align: center !important;
  height: 2rem !important;

  .title {
    font-size: 0.36rem !important;
    line-height: 0.36rem !important;
    font-weight: bold !important;
    text-align: center !important;
    margin-bottom: 0.22rem !important;
  }

  .info {
    font-size: 0.32rem !important;
    line-height: 0.32rem !important;
    font-weight: 400 !important;
    margin-bottom: 0.16rem !important;
  }
}
.paymentImage {
  width: 100%;
  margin: 0.2rem auto 0;
}
.header {
  // position: fixed;
  // top: 0;
  background-color: #ffffff !important;
  color: #252525 !important;
  box-shadow: 0px 1px 0px 0px #ededed;
}
.save-tab {
  padding: 0 0.88rem;
  height: 0.8rem;
  margin: 0.2rem auto 0;
  display: flex;
  font-size: 0.34rem;
  justify-content: space-between;
  background-color: #fff;
  span {
    display: block;
    height: 0.8rem;
    line-height: 0.8rem;
    padding: 0 0.31rem;
    text-align: center;
  }
}
.list {
  width: 100%;
  margin: 0;
  box-sizing: border-box;

  .item {
    width: 100%;
    padding: 0.2rem;
    margin: 0;
    box-sizing: border-box;
    background-color: #ffffff;
    height: 1.3rem;
    display: flex;
    justify-content: space-around;
    align-items: stretch;
    position: relative;

    &::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      right: 0;
      top: 0;
      left: 0.2rem;
      border-bottom: 0.02rem solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }

    &:first-of-type::after {
      content: none !important;
    }

    .icon {
      width: 0.9rem;
      height: 0.9rem;
      display: block;
    }

    .content {
      height: 0.9rem;
      flex: 1;
      text-align: left;
      margin-left: 0.2rem;

      .title {
        font-size: 0.36rem;
        color: #2c3e50;
        line-height: 0.36rem;
      }

      .desc {
        margin-top: 0.2rem;
        font-size: 0.26rem;
        color: #999;
        line-height: 0.26rem;
      }
    }

    .span {
      position: relative;
      color: #adafbb !important;
      font-size: 0.5rem;
      width: 0.5rem;
      right: -0.1rem;
      line-height: 0.87rem;
    }
  }
  .blush {
    &::after {
      border-bottom: 0.02rem solid #999 !important;
    }
  }
}
.newQP-app {
  .list .item {
    &::after {
      border-bottom: 0.02rem solid #2c2c2c;
    }
  }
}
.body {
  background: #fff;
  // margin-top: 0.88rem;
  .box-top {
    .title {
      font-size: 0.34rem;
      font-weight: 500;
      color: #333333;
      text-align: left;
      padding: 0.35rem 0 0.35rem 0.22rem;
    }
    /deep/.van-tabs {
      .van-tabs__wrap {
        height: 1.86rem;
        .van-tabs__nav--complete,
        .van-tabs__nav {
          padding: 0;
          background-color: #fafafa;
        }
        .van-tabs__line {
          background-color: transparent !important;
        }
        .van-tab {
          width: 1.54rem !important;
          height: 1.45rem !important;
          max-width: 1.54rem !important;
          max-height: 1.45rem !important;
          min-width: 1.54rem !important;
          min-height: 1.45rem !important;
          padding: 0;
          margin-top: 0.22rem;
          border-radius: 0.1rem;
          margin-right: 0.24rem;
          .van-tab__text {
            div {
              width: 1.54rem !important;
              height: 1.45rem !important;
              background-color: #f2f2fa;
              border-radius: 0.1rem;
              position: relative;
              overflow: hidden;
              .icon {
                display: block;
                background-size: 100% 100%;
                width: 0.69rem;
                height: 0.69rem;
                border-radius: 50%;
                margin: 0.14rem auto 0;
              }
              .active-icon {
                width: 0.38rem;
                height: 0.31rem;
                position: absolute;
                top: 0;
                right: 0;
              }
              .name {
                display: block;
                font-size: 0.27rem;
                color: #212121;
                margin-top: -0.2rem;
              }
            }
          }
          &:first-child {
            margin-left: 0.29rem;
          }
        }
        .van-tab--active {
          font-weight: normal !important;
          box-shadow: 0px 0px 13px 0px rgba(0, 189, 212, 0.5);
          .van-tab__text {
            div {
              background: #fff;
              // box-shadow: 0px 0px 13px 0px rgba(0, 189, 212, 0.5);
            }
          }
        }
        &::after {
          border: none;
        }
      }
      &::after {
        border: none;
      }
    }
  }
  .box-content {
    /deep/.user-input-row::after {
      right: 0.3rem;
    }
  }
}
.newQP-header {
  box-shadow: 0px 1px 0px 0px #373737 !important;
}
.blush-header {
  box-shadow: none !important;
}
.newQP-box {
  .box-top {
    /deep/.van-tabs {
      .van-tabs__nav--complete,
      .van-tabs__nav {
        background: #0b0b0b linear-gradient(180deg, #171717 0%, #0b0b0b 100%);
      }
      .van-tab {
        border: 0.02rem solid #373737;
        box-sizing: content-box;
        .van-tab__text div {
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 0%,
            #000000 100%
          ) !important;
          .name {
            color: #fff !important;
          }
        }
        &.van-tab--active {
          box-shadow: none !important;
          border: 0.02rem solid #f6cf32 !important;
          .van-tab__text div .name {
            color: #f6cf32 !important;
          }
        }
      }
    }
  }
}
.blush-box {
  .box-top {
    /deep/.van-tabs {
      .van-tabs__nav--complete,
      .van-tabs__nav {
        background-color: #530107 !important;
      }
      .van-tab {
        border: 0.02rem solid transparent;
        box-sizing: content-box;
        .van-tab__text div {
          background: linear-gradient(0deg, #72010b, #98010e) !important;
          .name {
            color: #fff !important;
          }
        }
        &.van-tab--active {
          box-shadow: none !important;
          border: 0.02rem solid #f6cf32 !important;
          .van-tab__text div .name {
            color: #f6cf32 !important;
          }
        }
      }
    }
  }
}

// for QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 start
//控制 header 背景顏色 && 字體顏色
.QP839-header {
  background-color: #c02e26 !important; //header 背景顏色
  /deep/.header-title {
    color: #ffffff; ///header標題文字顏色
  }
}
//控制內容區塊樣式
.QP839-box {
  background-color: #1b1d1b; //充值中心背景顏色
  //控制內容按鈕 背景顏色 && 按鈕顏色 && 字體顏色
  .box-top {
    /deep/.van-tabs {
      .van-tabs__nav--complete,
      .van-tabs__nav {
        background-color: #1b1d1b !important; //充值中心支付方式按鈕背景顏色
      }
      .van-tab {
        box-sizing: content-box;
        box-shadow: none !important;
        .van-tab__text div {
          background: #272829 !important; //充值中心支付方式按鈕各別顏色
          .name {
            color: #fff !important; //充值中心文字各別顏色
          }
        }
        &.van-tab--active {
          border: 0.02rem solid #c62721; //充值中心支付方式按鈕選中邊框顏色
          background: #1b1d1b !important; //充值中心支付方式按鈕選中顏色
        }
      }
    }
  }

  //控制內容 背景顏色 && 字體顏色
  .box-content {
    /deep/.submit-payment {
      background-color: #1b1d1b; //充值內容背景顏色
      .title {
        color: #ffffff //選擇支付通道字體顏色
;
      }
      .pay-tabs {
        background-color: #1b1d1b; //充值通道背景顏色
        .van-sticky {
          .van-tab {
            background: #272829 !important; //充值通道按鈕背景顏色
            box-shadow: none;
            .van-tab__text {
              .tit {
                color: #ffffff; //充值通道標題字體顏色
              }
              .txt {
                color: #ffffff93; //充值通道金額字體顏色
              }
            }
            &.van-tab--active {
              border: 0.02rem solid #c62721 !important; //充值通道按鈕選中邊框顏色
              background: #1b1d1b !important; //充值通道按鈕選中背景顏色
            }
          }
        }
      }
      .info {
        color: #ffffff; //充值中心內容提示字體顏色
      }
      .port-content {
        background-color: #1b1d1b; //充值中心選擇充值金額背景顏色
      }
      .save-submit {
        background: linear-gradient(
          180deg,
          rgb(204, 52, 50) 0%,
          rgb(197, 39, 33) 100%
        ); //送出按鈕顏色
      }
    }
    .bank-submit {
    }
  }
}
// for QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 end
// for js85 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 start
.js85-box{
  .body{
    background-color: #000000;
    .js85-box-title{
      color: #FFFFFF !important;
    }
  }
}
// for js85 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 start

// 底飄
.down-bottom {
  position: fixed;
  bottom: 0;
  z-index: 502;
  font-size: 0;
  img {
    width: 100%;
  }
}
</style>
