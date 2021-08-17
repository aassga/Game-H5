<template>
  <van-popup
    class="save-popup"
    get-container="body"
    v-model="isShow"
    :style="positionStyle"
    :close-on-click-overlay="false"
    :class="[
      { 'newQP-popup': $config.newQP || $config.blackTheme },
      { 'blush-popup': $config.blush },
      { 'QP839-popup': $config.isBlackRedTheme },
    ]"
  >
    <slot name="head" class="head"></slot>
    <slot name="content" class="content"></slot>
    <button
      class="save-popup-btn theme-yellow-bg-3 theme-color-black"
      @click="onCancel"
    >
      {{ btnValue }}
    </button>
  </van-popup>
</template>

<script type="text/javascript">
export default {
  name: "savePopup",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    btnValue: {
      type: String,
      default: "",
    },
  },
  computed: {
    positionStyle() {
      //解决安卓小米position：fixed问题导致按钮错位问题
      if (
        this.$mobileDevice.isAndroid &&
        this.$mobileDevice.browserName === "MIUI Browser"
      ) {
        return {
          position: "absolute",
        };
      } else {
        return {
          position: "fixed",
        };
      }
    },
    isShow: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("update:show", val);
      },
    },
  },
  methods: {
    onCancel() {
      // this.isShow = false
      this.$emit("onConfirm");
    },
    onClick(item) {
      this.isShow = false;
      this.$emit("input", item);
      this.$emit("select", item);
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.save-popup {
  background-color: rgba(0, 0, 0, 0) !important;
  width: 6.92rem;
  font-size: 0;
  border-radius: 0.21rem;
  overflow: hidden;

  .save-popup-btn {
    background: linear-gradient(90deg, #00b2c8 0%, #00bdd4 100%);
    width: 100%;
    height: 1;
    line-height: 1rem;
    font-size: 0.4rem;
    font-weight: bold;
    text-align: center;
    color: #fff;
  }
  &.newQP-popup,
  &.blush-popup {
    background: linear-gradient(180deg, #171717 0%, #0b0b0b 100%);
    /deep/.back-tit,
    /deep/.van-picker {
      background-color: transparent;
    }
    /deep/.van-picker__mask {
      background-image: none;
    }
    /deep/ .van-ellipsis {
      color: #f6cf32;
    }
    /deep/ .van-picker__frame {
      &::after {
        border-bottom: 0.02rem solid #ebedf0 !important;
        border-top: 0.02rem solid #ebedf0 !important;
      }
    }
  }
  &.blush-popup {
    background: linear-gradient(270deg, #73010b, #9d010f) !important;
  }
  &.QP839-popup {
    /deep/.QP839-tipPicker {
      background-color: #272829 !important;
      .tit {
        color: #fff;
      }
      .des {
        color: #fff;
      }
    }
    .save-popup-btn {
      background: linear-gradient(
        180deg,
        rgb(204, 52, 50) 0%,
        rgb(197, 39, 33) 100%
      ); //控制USTD轉帳明細 按鈕顏色
    }
  }
}
</style>
