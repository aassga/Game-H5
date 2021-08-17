<template>
  <div v-transfer-dom class="ios-alert" v-show="value" :class="[classDefault,{ 'aqvns-ios-alert': $config.isAqvns }]">
    <div
      class="ios-alert-mask"
      v-show="showMask && show"
      @click="onMaskClick"
    ></div>
    <div
      :class="[{ 'ios-alert-box': true, show: show }, 'theme-main-bg-1']"
      :style="styleBox"
    >
      <div class="ios-alert-content">
        <slot name="title"></slot>
        <slot name="content"></slot>
      </div>
      <div
        class="ios-alert-footer theme-main-bg-1 theme-border-color"
        :class="[{ 'theme-bg': themeBg },{ 'aqvns-ios-alert-footer': $config.isAqvns }]"
        :style="styleFooter"
      >
        <a
          class="footer-action footer-action-no theme-color-white"
          v-if="showNo"
          href="javascript:void(0)"
          @click="onNo"
          >{{ noText }}</a
        >
        <span
          class="footer-action footer-action-hr"
          v-if="
            showNo && !$config.newQP && !$config.blackTheme && !$config.blush
          "
        ></span>
        <a
          class="footer-action footer-action-ok theme-color theme-color-yellow"
          href="javascript:void(0)"
          @click="onOk"
          >{{ okText }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IosAlert",
  props: {
    top: {
      type: String,
      default: "46%",
    },
    className: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 5.5,
    },
    value: {
      type: Boolean,
      default: false,
    },
    noText: {
      type: String,
      default: "取消",
    },

    okText: {
      type: String,
      default: "确定",
    },
    showMask: {
      type: Boolean,
      default: true,
    },
    maskClose: {
      type: Boolean,
      default: false,
    },
    noCallback: {
      type: Function,
      default: undefined,
    },
    okCallback: {
      type: Function,
      default: undefined,
    },
    showNo: {
      type: Boolean,
      default: true,
    },
    bgColor: {
      type: String,
      default: "#FFFFFF",
    },
    themeBg: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: false,
      classDefault: "",
    };
  },
  watch: {
    value() {
      this.$nextTick(() => {
        if (this.value) {
          setTimeout(() => {
            this.show = true;
          });
        } else {
          this.show = false;
        }
      });
    },
    className() {
      this.classDefault = this.className;
    },
  },
  computed: {
    styleBox() {
      return {
        backgroundColor: this.bgColor,
        width: this.width + "rem",
        left: (7.5 - this.width) / 2 + "rem",
        top: this.top,
      };
    },
    styleFooter() {
      return {
        backgroundColor: this.bgColor,
        width: this.width + "rem",
        left: (7.5 - this.width) / 2 + "rem",
      };
    },
  },
  methods: {
    showTask() {
      this.show = true;
      setTimeout(() => {
        this.$emit("input", true);
      }, 400);
    },
    hideTask() {
      this.show = false;
      setTimeout(() => {
        this.$emit("input", false);
      }, 400);
    },
    onNo() {
      if (typeof this.noCallback === "function") {
        if (this.noCallback()) {
          this.hideTask();
        }
      } else {
        this.hideTask();
      }
    },
    onOk() {
      if (typeof this.okCallback === "function") {
        if (this.okCallback()) {
          this.hideTask();
        }
      } else {
        this.hideTask();
      }
    },
    onMaskClick() {
      if (this.maskClose) {
        this.hideTask();
      }
    },
  },
};
</script>

<style type="text/css" lang="less">
.ios-alert {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  display: block;
  box-sizing: border-box;
  z-index: 510;

  &-mask {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    display: block;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.3);
  }

  &-box {
    position: fixed;
    top: 46%;
    left: 1.15rem;
    transform: translateY(0) scale(0);
    width: 5.5rem;
    background-color: #fff;
    border-radius: 0.4rem;
    transition: all 400ms;
    overflow: hidden;
    opacity: 0.98 !important;
    display: block;
    transform-origin: top;

    &.show {
      transform: translateY(-50%) scale(1) !important;
    }
  }
  &-header {
    display: inline-block;
    padding: 0.2rem;
    font-weight: 400 !important;
    font-size: 0.4rem !important;
  }
  &-content {
    width: 100%;
    line-height: 0.48rem;
    text-align: center;
    box-sizing: border-box;
    font-size: 0.349rem;
    color: #333333;
    font-weight: bold;
    .ios-title {
      padding-top: 0.48rem;
      font-size: 0.37rem;
      color: #333333;
      font-weight: bold;
    }
    .ios-content {
      font-size: 0.32rem;
      color: #000;
      max-height: 60vh;
      overflow-y: auto;
      font-weight: 500;
      line-height: 0.4rem;
      white-space: pre-wrap;
      text-align: center;
      word-wrap: break-word;
      padding: 0.43rem 0.6rem;
    }
    .onlyContent {
      padding: 0.48rem 0.6rem !important;
    }
  }

  &-footer {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: stretch;
    border-top: 0.02rem solid hsla(0, 0%, 95%, 1);
    .footer-action {
      font-size: 0.34rem;
      text-align: center;
      box-sizing: border-box;
      font-weight: bold;
      &.footer-action-no {
        color: #222121;
        flex: 1;
      }

      &.footer-action-ok {
        flex: 1;
      }

      &.footer-action-hr {
        display: block;
        width: 0.02rem;
        height: 100%;
        background-color: hsla(0, 0%, 95%, 1);
      }
    }
  }

}

// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 start
.aqvns-ios-alert{
  .ios-alert-box{
    .aqvns-ios-alert-footer{
      .footer-action{
        color: #C9A786 !important;
      }
    }
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 end
</style>
