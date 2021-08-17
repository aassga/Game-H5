<template>
  <div
    class="safety-page theme-main-bg"
    :class="{ 'aqvns-safety-page': $config.isAqvns }"
    :style="{ height: !isShowFixed ? '100%' : '100vh' }"
    v-if="secretKey"
    v-touch:left="onSwipeLeft"
    v-touch:right="onSwipeRight"
  >
    <vux-tab
      v-model="tabIndex"
      :line-height="1"
      animated
      swipeable
      style="background-color: #fff"
      class="theme-gradient-bg-3"
      :active-color="
        $config.newQP || $config.blackTheme || $config.blush || $config.isAqvns
          ? '#F7CE33'
          : targetTheme.color
      "
    >
      <vux-tab-item
        v-for="(item, i) in tabs"
        :key="item.k + '-' + i"
        class="theme-color-white theme-border-bottom-1"
        >{{ item.v }}</vux-tab-item
      >
    </vux-tab>
    <transition-group :name="animationCheck">
      <!--设置登录密码 start-->
      <div class="body theme-main-bg" v-show="tabIndex === 0" :key="0">
        <van-cell-group class="van-cell-group theme-main-bg">
          <input-row
            v-model="modal.oldPassword"
            label="原登录密码"
            v-keyBroayStates
            placeholder="请输入原密码"
            type="password"
            max-len="20"
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>

          <input-row
            v-model="modal.newPassword"
            label="新登录密码"
            v-keyBroayStates
            placeholder="8-20位字母或数字"
            type="password"
            max-len="20"
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>

          <input-row
            v-model="modal.newPassword2"
            label="确认新密码"
            v-keyBroayStates
            placeholder="8-20位字母或数字"
            type="password"
            max-len="20"
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>
        </van-cell-group>
        <div style="width: 100%; padding: 0.24rem; box-sizing: border-box">
          <van-button
            type="primary"
            block
            @click="dlSubmit"
            class="theme-yellow-bg theme-color-black"
            >修改登录密码</van-button
          >
        </div>
      </div>
      <!--设置登录密码 end-->

      <!--设置资金密码 start-->
      <div class="body theme-main-bg" v-show="tabIndex === 1" :key="1">
        <van-cell-group
          class="van-cell-group theme-main-bg"
          v-if="$store.state.user.userInfo['payPassword'] !== 'unset'"
        >
          <input-row
            v-model="modal[1].oldPassword"
            label="原资金密码"
            placeholder="请输入原6位数字资金密码"
            type="number-password"
            v-keyBroayStates
            max-len="6"
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>

          <input-row
            v-model="modal[1].newPassword"
            label="新资金密码"
            placeholder="请输入新6位数字资金密码"
            type="number-password"
            v-keyBroayStates
            max-len="6"
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>

          <input-row
            v-model="modal[1].newPassword2"
            label="确认新密码"
            placeholder="请确认新6位数字资金密码"
            type="number-password"
            v-keyBroayStates
            max-len="6"
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>
        </van-cell-group>
        <van-cell-group
          class="van-cell-group theme-main-bg"
          v-if="$store.state.user.userInfo['payPassword'] === 'unset'"
          title=""
        >
          <input-row
            v-model="modal[1].newPassword"
            label="资金密码"
            placeholder="请输入6位数字资金密码"
            type="number-password"
            v-keyBroayStates
            max-len="6"
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>

          <input-row
            v-model="modal[1].newPassword2"
            label="确认密码"
            placeholder="请确认6位资金密码"
            type="number-password"
            v-keyBroayStates
            max-len="6"
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
          ></input-row>
        </van-cell-group>
        <!-- <van-cell-group class="van-cell-group" title="请回答密保问题"
                          v-if="$store.state.user.userInfo['payPassword']!=='unset'&&$store.state.user.userInfo['secret']!=='unset' && personalMode !== 'mode_c'">
            <input-row :value="$store.state.user.userInfo['secret']" label="密保问题" disabled
                        type="text" v-keyBroayStates></input-row>
            <input-row v-model="modal[1].value" label="密保答案" placeholder="请输入密保答案" type="text" v-keyBroayStates></input-row>
          </van-cell-group>
          <van-cell-group class="van-cell-group" v-if="$store.state.user.userInfo['secret']==='unset' && personalMode !== 'mode_c'" title="设置密保问题">
            <input-row v-model="modal[1].key" label="密保问题" type="select" placeholder="请选择密保问题"
                        :data="secretKey" v-keyBroayStates v-if="secretKey.length" is-click></input-row>
            <input-row v-model="modal[1].value" v-keyBroayStates label="密保答案" placeholder="请输入密保答案" type="text"></input-row>
          </van-cell-group> -->
        <div style="width: 100%; padding: 0.24rem; box-sizing: border-box">
          <van-button
            type="primary"
            block
            class="theme-yellow-bg theme-color-black"
            @click="
              zjSubmit(
                $store.state.user.userInfo['payPassword'],
                $store.state.user.userInfo['secret']
              )
            "
          >
            {{
              $store.state.user.userInfo["payPassword"] !== "unset"
                ? "修改"
                : "设置"
            }}资金密码
          </van-button>
        </div>
      </div>
      <!--设置资金密码 end-->

      <!--设置密保问题 start-->
      <!-- <div  class="body" v-show="tabIndex===2" :key="2">
          <van-cell-group class="van-cell-group" v-if="$store.state.user.userInfo['secret']!=='unset'" title="请回答原密保问题">
            <input-row :value="$store.state.user.userInfo['secret']" label="密保问题" disabled
                        type="text" v-keyBroayStates></input-row>
            <input-row v-model="modal[2].problem" v-keyBroayStates label="密保答案" placeholder="请输入密保答案" type="text"></input-row>
          </van-cell-group>
          <van-cell-group class="van-cell-group" v-if="$store.state.user.userInfo['secret']!=='unset'" title="请设置新密保问题">
            <input-row v-model="modal[2].key" v-keyBroayStates :title="'请选择密保问题'" label="密保问题" type="select" placeholder="请选择密保问题"
                        :data="secretKey" v-if="secretKey.length" is-click></input-row>
            <input-row v-model="modal[2].value" v-keyBroayStates label="密保答案" placeholder="请输入密保答案" type="text"></input-row>
          </van-cell-group>
          <van-cell-group class="van-cell-group" v-if="$store.state.user.userInfo['secret']==='unset'" title="请选择密保问题">
            <input-row v-model="modal[2].key"  v-keyBroayStates :title="'请选择密保问题'" label="密保问题" type="select" placeholder="请选择密保问题"
                        :data="secretKey" v-if="secretKey.length" is-click></input-row>
            <input-row v-model="modal[2].value" v-keyBroayStates label="密保答案" placeholder="请输入密保答案" type="text"></input-row>
          </van-cell-group>
          <div style="width: 100%;padding: 0.24rem;box-sizing: border-box">
            <van-button type="primary" block @click="mbSubmit($store.state.user.userInfo['secret']!=='unset')">
              {{$store.state.user.userInfo['secret']==='unset'? '设置': '修改'}}密保问题
            </van-button>
          </div>
        </div> -->
      <!--设置密保问题 start-->
    </transition-group>
  </div>
</template>

<script type="text/javascript">
const modal = [
  {
    oldPassword: "",
    newPassword: "",
    newPassword2: "",
  },
  {
    oldPassword: "",
    newPassword: "",
    newPassword2: "",
    key: "",
    value: "",
  },
  {
    problem: "",
    key: "",
    value: "",
  },
];

export default {
  name: "SafetyEditor",
  props: {
    tab: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      title: "asdasd",
      tabs: [],
      tabIndex: 1,
      animationCheck: "slide-left",
      modal: JSON.copyObj(modal),
      secretKey: [],
    };
  },
  computed: {
    isShowFixed() {
      return this.$store.state.main.keyBoardStatus;
    },
  },
  watch: {
    /**
     * 索引变化重置数据,修改标题
     * @param now
     * @param old
     */
    tabIndex(now, old) {
      this.animationCheck = now > old ? "slide-left" : "slide-right";
      this.modal = JSON.copyObj(modal);

      let tag = "修改";

      if (
        this.tabs[this.tabIndex].k === "zj" &&
        this.$store.state.user.userInfo["payPassword"] === "unset"
      ) {
        tag = "设置";
      }

      if (
        this.tabs[this.tabIndex].k === "mb" &&
        this.$store.state.user.userInfo["secret"] === "unset"
      ) {
        tag = "设置";
      }

      this.$emit("on-title-change", tag + this.tabs[this.tabIndex].v);
    },
  },
  mounted() {
    this.$store.dispatch("user/getSecretKey", {
      callback: (res) => {
        this.secretKey = res;
      },
    });
  },
  created() {
    if (this.personalMode === "mode_c") {
      this.tabs = [
        { k: "dl", v: "登录密码" },
        { k: "zj", v: "资金密码" },
      ];
    } else {
      this.tabs = [
        { k: "dl", v: "登录密码" },
        { k: "zj", v: "资金密码" },
        // { k: 'mb', v: '密保问题' }
      ];
    }
    // 获取密保问题列表
    this.tabIndex = this.tabs.indexOf(
      this.tabs.find((item) => item.k === this.tab)
    );
    let tag = "修改";
    if (
      this.tabs[this.tabIndex].k === "zj" &&
      this.$store.state.user.userInfo["payPassword"] === "unset"
    ) {
      tag = "设置";
    }
    if (
      this.tabs[this.tabIndex].k === "mb" &&
      this.$store.state.user.userInfo["secret"] === "unset"
    ) {
      tag = "设置";
    }
    this.$emit("on-title-change", tag + this.tabs[this.tabIndex].v);
  },
  methods: {
    /**
     * 登录密码修改
     */
    dlSubmit() {
      if (!this.modal.oldPassword) {
        this.toastText("请输入原密码", "top");
        return;
      }
      if (!/^[A-z0-9]{6,20}$/.test(this.modal.oldPassword || "")) {
        this.toastText("原登录密码错误", "top");
      } else if (!/^[A-z0-9]{8,20}$/.test(this.modal.newPassword || "")) {
        this.toastText("请输入8-20位新密码", "top");
      } else if (this.modal.newPassword !== this.modal.newPassword2) {
        this.toastText("两次输入的新密码不一致", "top");
      } else if (this.modal.newPassword === this.modal.oldPassword) {
        this.toastText("新密码请勿与原密码一致", "top");
      } else {
        this.$store
          .dispatch("user/resetPassword", {
            oldpassword: this.modal.oldPassword,
            password: this.modal.newPassword,
            password_confirmation: this.modal.newPassword2,
          })
          .then((res) => {
            if (res.code === 200) {
              this.toastText("修改成功", "top");
              this.modal = JSON.copyObj(modal);
              this.$store.dispatch("user/refreshInfo").then().catch();
            } else {
              this.toastText(res.message, "top");
            }
          })
          .catch(() => {
            this.toastText("修改失败", "top");
          });
      }
    },
    onSwipeLeft() {
      if (this.tabIndex + 1 < this.tabs.length) {
        this.tabIndex++;
      }
    },
    onSwipeRight() {
      if (this.tabIndex > 0) {
        this.tabIndex--;
      }
    },
    /**
     * 资金密码设置
     * @param payStatus
     * @param secretStatus
     */
    zjSubmit(payStatus, secretStatus) {
      if (payStatus === "unset" && secretStatus === "unset") {
        // 设置资金密码和密保问题
        if (!/^[\d]{6}$/.test(this.modal[1].newPassword || "")) {
          this.toastText("请输入6位数字密码", "top");
        } else if (this.modal[1].newPassword !== this.modal[1].newPassword2) {
          this.toastText("两次新密码不一致", "top");
        } else if (this.modal[1].newPassword === this.modal[1].oldPassword) {
          this.toastText("新密码请勿与原密码一致", "top");
        } else {
          this.$store
            .dispatch("user/resetPayPassword", {
              pay_password: this.modal[1].newPassword,
              pay_password_confirmation: this.modal[1].newPassword2,
              // key: this.personalMode === 'mode_c' ? '123456' : this.modal[1].key,
              // value: this.personalMode === 'mode_c' ? '123456' : this.modal[1].value,
              status: payStatus === "unset",
            })
            .then((res) => {
              if (res.code === 200) {
                this.toastText("设置成功", "top");
                this.modal = JSON.copyObj(modal);
                this.$store.dispatch("user/refreshInfo").then().catch();
              } else {
                this.toastText(res.message, "top");
              }
            })
            .catch(() => {
              this.toastText("修改失败", "top");
            });
        }
      } else if (payStatus === "unset") {
        // 设置资金密码
        if (!/^[\d]{6}$/.test(this.modal[1].newPassword || "")) {
          this.toastText("请输入6位数字密码", "top");
        } else if (this.modal[1].newPassword !== this.modal[1].newPassword2) {
          this.toastText("两次新密码不一致", "top");
        } else {
          this.$store
            .dispatch("user/resetPayPassword", {
              pay_password: this.modal[1].newPassword,
              pay_password_confirmation: this.modal[1].newPassword2,
              status: payStatus === "unset",
            })
            .then((res) => {
              if (res.code === 200) {
                this.toastText("修改成功", "top");
                this.modal = JSON.copyObj(modal);
                let tag = "修改";
                this.$emit("on-title-change", tag + this.tabs[this.tabIndex].v);
                this.$store.dispatch("user/refreshInfo").then().catch();
              } else {
                this.toastText(res.message, "top");
              }
            })
            .catch(() => {
              this.toastText("修改失败", "top");
            });
        }
      } else if (secretStatus === "unset") {
        // 设置资金密码和密保问题
        if (!/^[\d]{6}$/.test(this.modal[1].oldPassword || "")) {
          this.toastText("请输入正确的6位数字原密码", "top");
        } else if (!/^[\d]{6}$/.test(this.modal[1].newPassword || "")) {
          this.toastText("请输入正确的6位数字新密码", "top");
        } else if (this.modal[1].newPassword !== this.modal[1].newPassword2) {
          this.toastText("两次新密码不一致", "top");
        }
        //  else if (!this.modal[1].key && this.personalMode !== 'mode_c') {
        //   this.toastText('请选择密保问题', 'top')
        // } else if (!this.modal[1].value && this.personalMode !== 'mode_c') {
        //   this.toastText('请输入密保答案', 'top')
        // }
        else {
          this.$store
            .dispatch("user/resetPayPassword", {
              ori_pay_password: this.modal[1].oldPassword,
              new_pay_password: this.modal[1].newPassword,
              new_pay_password_confirmation: this.modal[1].newPassword2,
              // key: this.personalMode === 'mode_c' ? '123456' : this.modal[1].key,
              // value: this.personalMode === 'mode_c' ? '123456' : this.modal[1].value,
              status: payStatus === "unset",
            })
            .then((res) => {
              if (res.code === 200) {
                this.toastText("修改成功", "top");
                this.modal = JSON.copyObj(modal);
                this.$store.dispatch("user/refreshInfo").then().catch();
              } else {
                this.toastText(res.message, "top");
              }
            })
            .catch(() => {
              this.toastText("修改失败", "top");
            });
        }
      } else {
        if (!/^[\d]{6}$/.test(this.modal[1].oldPassword || "")) {
          // 设置资金密码
          this.toastText("请输入正确的6位数字原密码", "top");
        } else if (!/^[\d]{6}$/.test(this.modal[1].newPassword || "")) {
          this.toastText("请输入正确的6位数字新密码", "top");
        } else if (this.modal[1].newPassword !== this.modal[1].newPassword2) {
          this.toastText("两次新密码不一致", "top");
        }
        // else if (!this.modal[1].value && this.personalMode !== 'mode_c') {
        //   this.toastText('请输入密保答案', 'top')
        // }
        else {
          this.$store
            .dispatch("user/resetPayPassword", {
              ori_pay_password: this.modal[1].oldPassword,
              new_pay_password: this.modal[1].newPassword,
              new_pay_password_confirmation: this.modal[1].newPassword2,
              // key: this.$store.state.user.userInfo['secret'],
              // value: this.personalMode === 'mode_c' ? '123456' : this.modal[1].value,
              status: payStatus === "unset",
            })
            .then((res) => {
              if (res.code === 200) {
                this.toastText("修改成功", "top");
                this.modal = JSON.copyObj(modal);
                this.$store.dispatch("user/refreshInfo").then().catch();
              } else {
                this.toastText(res.message, "top");
              }
            })
            .catch(() => {
              this.toastText("修改失败", "top");
            });
        }
      }
    },
    /**
     * 设置密保问题
     * @param status
     */
    mbSubmit(status) {
      if (status) {
        if (!this.modal[2].problem) {
          this.toastText("请输入原密保答案", "top");
        } else if (!this.modal[2].key) {
          this.toastText("请选择密保问题", "top");
        } else if (!this.modal[2].value) {
          this.toastText("请输入密保答案", "top");
        } else {
          this.$store
            .dispatch("user/setSecret", {
              key: this.$store.state.user.userInfo["secret"],
              value: this.modal[2].problem,
              newKey: this.modal[2].key,
              newValue: this.modal[2].value,
            })
            .then((res) => {
              if (res.code === 200) {
                this.toastText("修改成功", "top");
                this.modal = JSON.copyObj(modal);
                this.$store.dispatch("user/refreshInfo").then().catch();
              } else {
                this.toastText(res.message, "top");
              }
            })
            .catch(() => {
              this.toastText("修改失败", "top");
            });
        }
      } else {
        if (!this.modal[2].key) {
          this.toastText("请选择密保问题", "top");
        } else if (!this.modal[2].value) {
          this.toastText("请输入密保答案", "top");
        } else {
          this.$store
            .dispatch("user/setSecret", {
              key: this.modal[2].key,
              value: this.modal[2].value,
            })
            .then((res) => {
              if (res.code === 200) {
                this.toastText("修改成功", "top");
                this.modal = JSON.copyObj(modal);
                this.$store.dispatch("user/refreshInfo").then().catch();
              } else {
                this.toastText(res.message, "top");
              }
            })
            .catch(() => {
              this.toastText("修改失败", "top");
            });
        }
      }
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
/deep/.van-button {
  border-radius: 0;
}
/deep/.van-tab {
  color: #333333;
}
/deep/.van-hairline--top-bottom::after {
  border: 0;
}
/deep/.vux-tab {
  .vux-tab-item {
    font-size: 0.345rem;
  }
}
.safety-page {
  width: 100%;
  box-sizing: border-box;
  position: relative;

  .body {
    position: absolute;
    left: 0;
    top: 0.88rem;
    width: 100%;
  }

  .group-title {
    font-size: 0.3rem;
    line-height: 0.76rem;
    text-align: left;
    padding-left: 0.3rem;
    box-sizing: border-box;
    color: #666666;
  }

  .van-cell-group {
    margin-top: 0.2rem !important;
  }

  /deep/ .van-cell-group__title {
    font-size: 0.3rem;
    text-align: left;
    color: #666666;
  }
}
.content-box {
  &::before {
    content: "";
    height: 0;
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 start
.aqvns-safety-page{
  /deep/.vux-tab-container{
    .vux-tab-item{
      color: #C9A786 !important;
      border-bottom: 0.1rem solid #C9A786;
    }
    .vux-tab-ink-bar{
      background-color: #C9A786 !important;
    }
  }
  .body{
    .van-button{
      border: none;
      background-color: #C9A786 !important;
    }
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 end
</style>
