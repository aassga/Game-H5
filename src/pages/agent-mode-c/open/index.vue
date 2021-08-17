<template>
  <view-page
    ref="view-page"
    class="agent-open"
    @scroll-height-change="height => {this.contentHeight = height}"
  >
    <title-header title="推广开户" slot="header"></title-header>

    <div slot="header-static">
      <van-tabs v-model="tabIndex" :line-height="2" line-width="1.4rem">
        <van-tab title="直接开户"></van-tab>
        <van-tab title="推荐好友"></van-tab>
      </van-tabs>
    </div>

    <div slot="content" ref="swipe">
      <transition-group :name="animation">
        <div v-show="tabIndex == 0" key="list1" class="lotter-user">
          <van-cell-group class="view-box" :border="false">
            <van-field
              v-model="$store.state.agency.username"
              class="group-item username"
              type="text"
              label="开户帐号"
              placeholder="请输入6-10位字母或数字"
              :error="false"
              :border="false"
              maxlength="10"
            ></van-field>
            <p class="line"></p>
            <van-field
              v-model="$store.state.agency.password"
              click-right-icon="password"
              class="group-item password"
              type="text"
              label="初始密码"
              placeholder="请输入6-10位字母或数字"
              :border="false"
              disabled
            />
          </van-cell-group>
          <div class="btn theme-bg" @click="onSubmit">确认开户</div>
        </div>
        <div v-show="tabIndex == 1" key="list2" class="lotter-link user">
          <div class="shore-agent" ref="pic">
            <img style="width: 100%" :src="fontImg[3]" alt />
            <ul class="info-row">
              <li class="info-row-item">
                <img class="icon" :src="fontImg[0]" alt />
                <p class="info-1">平台安全运维</p>
                <p class="info-2">
                  <span class="num theme-color">4</span>
                  <span>周年</span>
                </p>
              </li>
              <li class="info-row-item">
                <img class="icon" :src="fontImg[1]" alt />
                <p class="info-1">累计注册</p>
                <p class="info-2">
                  <span class="num theme-color">1000</span>
                  <span>万人</span>
                </p>
              </li>
              <li class="info-row-item">
                <img class="icon" :src="fontImg[2]" alt />
                <p class="info-1">日均交易量</p>
                <p class="info-2">
                  <span class="num theme-color">2</span>
                  <span>亿元</span>
                </p>
              </li>
            </ul>
            <div class="qr-code" ref="qr-code"></div>
          </div>
          <div class="active-box">
            <button class="btn-save theme-color theme-border-1px" @click="onSave">保存图片</button>
            <button
              class="btn-copy theme-bg theme-border"
            >复制链接</button>
          </div>
        </div>
      </transition-group>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import QRCode from "qrcodejs2";
import Html2Canvas from "html2canvas";
export default {
  name: "Open",
  data() {
    return {
      contentHeight: 0,
      tabIndex: 0,
      animation: "slide-left",
      submitting: false
    };
  },
  created() {},
  mounted () {
  },
  computed: {
    fontImg() {
      switch (this.targetTheme.code) {
        case "default":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-defaul-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-defaul-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-defaul-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-defaul.png"),
          ];
        case "red":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-red-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-red-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-red-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-red.png"),
          ];
        case "purple":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-purple-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-purple-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-purple-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-purple.png"),
          ];
        case "green":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-green-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-green-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-green-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-green.png"),
          ];
        case "ferrari":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-ferrari-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-ferrari-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-ferrari-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-ferrari.png"),
          ];
        case "gold":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-gold-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-gold-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-gold-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-gold.png"),
          ];
        case "amethyst":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-amethyst-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-amethyst-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-amethyst-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-amethyst.png"),
          ];
        case "bluegreen":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-bluegreen-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-bluegreen-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-bluegreen-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-bluegreen.png"),
          ];
        case "brown":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-brown-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-brown-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-brown-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-brown.png"),
          ];
      }
    }
  },
  methods: {
    // 开户提交
    onSubmit() {
      if (this.submitting) {
        this.toastText("正在提交,请勿重复提交", "top");
      } else if (!this.$store.state.agency.username.trim()) {
        this.toastText("请输入开户帐号", "top");
      } else if (
        !/[A-z\d]{6,10}/.test(this.$store.state.agency.username.trim() || "")
      ) {
        this.toastText("帐号6-10位字母或数字", "top");
      } else {
        let username = "";
        this.submitting = true;
        this.$store
          .dispatch(
            "user/checkUserName",
            this.$store.state.agency.username.trim()
          )
          .then(res => {
            if (res.status === 200) {
              if (res.data.code === 200) {
                const json = {};
                for (let k in this.$store.state.agency.refundRebateForOpen) {
                  if (
                    this.$store.state.agency.refundRebateForOpen.hasOwnProperty(
                      k
                    )
                  ) {
                    this.$store.state.agency.refundRebateForOpen[
                      k
                    ].list.forEach(item => {
                      json[item["platform_en"]] = item.val;
                    });
                  }
                }
                this.$store
                  .dispatch("agency/createAccount", {
                    account_type: 0,
                    account_name: this.$store.state.agency.username.trim(),
                    account_password: this.$store.state.agency.password.trim(),
                    json: JSON.stringify(json)
                  })
                  .then(res => {
                    this.submitting = false;
                    if (res.code === 200) {
                      username = this.$store.state.agency.username;
                      this.showIosAlert({
                        title: "开户成功",
                        content: "帐号、密码已复制",
                        okText: "确定",
                        showNo: false,
                        okCallback: () => {
                          this.$store.state.main.iosAlert.show = false;
                        }
                      });
                      setTimeout(() => {
                        this.$store.state.main.iosAlert.show = false;
                      }, 3000);
                      this.$store.state.agency.refundRebateForOpen = JSON.copyObj(
                        this.$store.state.agency.refundRebate
                      );
                      this.$store.state.agency.username = "";
                      this.userType = 1;
                    } else {
                      this.toastText(res.message, "top");
                    }
                  })
                  .catch(() => {
                    this.submitting = false;
                    this.toastText("网络错误", "top");
                    this.opening = false;
                  });
                setTimeout(() => {
                  this.$copyText(`平台名登录地址: ${window.location.origin}\n帐号:${this.$store.state.agency.username}\n密码:${this.$store.state.agency.password}`)
                }, 500);
              } else {
                this.submitting = false;
                this.toastText(res.data.message, "top");
              }
            } else {
              this.submitting = false;
              this.toastText("检查用户名失败", "top");
            }
          })
          .catch(err => {
            this.submitting = false;
            this.toastText("检查用户名失败", "top");
          });
      }
    },
    // 保存图片
    onSave() {
      Html2Canvas(this.$refs.pic).then(canvas => {
        const base64 = canvas.toDataURL("image/png");
        this.savePicture(
          base64,
          "推广海报_" + this.dayJs().format("YYYY-MM-DD_HH:mm:ss")
        );
      });
    },
  },
  watch: {
    tabIndex(val, old) {
      if (val < old) {
        this.animation = "slide-right";
      } else {
        this.animation = "slide-left";
      }
      if(val === 1) {
        this.$refs["qr-code"].innerHTML = ''
        this.qr = new QRCode(this.$refs["qr-code"], {
          text: 'https://baidu.com',
          width: 2.6 * this.rem,
          height: 2.6 * this.rem,
        });
      }
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
.agent-open {
  .lotter-link,
  .lotter-user {
    width: 100%;
    overflow: hidden;
  }
  .lotter-user {
    .view-box {
      width: 7.18rem;
      height: 2.35rem;
      margin-top: 0.24rem;
      .group-item {
        height: 1.17rem;
        line-height: 1.17rem;
      }
      .line {
        border-bottom: 0.01rem solid #e7e7e7;
        margin-left: 1.8rem;
      }
    }
    .btn {
      width: 7.1rem;
      height: 0.96rem;
      line-height: 0.96rem;
      margin: 0.4rem auto 0;
      border-radius: 0.1rem;
      color: #fff;
      font-size: 0.38rem;
      font-weight: bold;
    }
    /deep/ .van-cell__title {
      font-size: 0.32rem;
      font-weight: 500;
      color: #444444;
    }
    /deep/ .van-field__body {
      input {
        font-size: 0.3rem;
      }
    }
  }
  .shore-agent {
    width: 6.7rem;
    height: 8.08rem;
    margin: .3rem auto 0;
    background-color: #fff;
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.32rem;
      margin-bottom: 0.56rem;
      padding: 0 0.32rem;

      .info-row-item {
        width: 1.5rem;

        .icon {
          display: block;
          width: 0.8rem;
          height: 0.8rem;
          margin: 0 auto;
        }

        .info-1 {
          font-size: 0.24rem;
          color: #666666;
          line-height: 0.33rem;
          margin-top: 0.16rem;
        }

        .info-2 {
          font-size: 0.24rem;
          color: #444444;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 0.5rem;

          .num {
            display: block;
            height: 0.36rem;
            line-height: 0.36rem;
            color: #2c93ff;
            font-size: 0.36rem;
            font-weight: 500;
            margin: 0 0.1rem;
          }
        }
      }
    }
    .qr-code {
      width: 2.6rem;
      height: 2.6rem;
      margin: 0 auto;
      box-shadow:0 0 .15rem 0 rgba(0,0,0,0.1);
      border-radius:.1rem;
    }
  }
  .active-box {
      padding: 0.4rem 0.4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .btn-save {
        width: 3.2rem;
        height: 0.96rem;
        border-radius: 0.1rem;
        background-color:#fff;
        font-size: 0.38rem;
      }

      .btn-copy {
        width: 3.2rem;
        height: 0.96rem;
        background-color: #2c93ff;
        color: #ffffff;
        border-radius: 0.1rem;
        font-size: 0.38rem;
      }
    }
}
</style>
