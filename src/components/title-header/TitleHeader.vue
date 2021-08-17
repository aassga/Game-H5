<template>
  <div
    class="title-header"
    :style="boxStyle"
    :class="[
      boxClass, 
      { 'aqvns-title-header': $config.isAqvns }
    ]"
  >
    <span
      v-if="isShowback"
      class="header-back icon iconfont h5-icon-left-menu-ico"
      :style="color ? 'color:' + color + ' !important' : ''"
      :class="{ 'theme-color': theme === 'white' }"
      @click="back"
    ></span>
    <slot name="title">
      <h4 class="header-title">{{ title }}</h4>
    </slot>
    <span class="header-right">
      <slot name="right"></slot>
    </span>
    <slot></slot>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "TitleHeader",
  props: {
    title: {
      type: String,
      default: "",
    },
    backEvent: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "default",
    },
    color: {
      type: String,
      default: "",
    },
    isShowback: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    boxClass() {
      switch (this.theme) {
        case "white":
          return [];
        default:
          return ["theme-bg"];
      }
    },
    boxStyle() {
      switch (this.theme) {
        case "white":
          return {
            color: "#444444",
            backgroundColor: "#ffffff",
          };

        default:
          return {
            color: "#ffffff",
          };
      }
    },
  },
  mounted() {},
  methods: {
    back() {
      if (this.backEvent) {
        this.$emit("back");
      } else {
        this.$router.back();
      }
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.title-header {
  height: 0.88rem;
  line-height: 0.88rem;
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  overflow-x: hidden;
  font-size: 0.36rem;
  z-index: 420 !important;
  display: flex;
  align-items: center;
  justify-content: center;

  .header-title {
    font-size: inherit !important;
    line-height: inherit !important;
    text-align: center;
    font-weight: bold;
  }

  .header-back:before {
    position: absolute;
    left: 0;
    top: 0;
    height: 0.9rem !important;
    width: 0.9rem !important;
    line-height: 0.9rem !important;
    display: inline-block;
    font-size: 0.72rem;
    transform: rotateZ(180deg) !important;
  }

  .header-back {
    position: absolute;
    left: 0;
    top: 0;
    height: 0.9rem !important;
    width: 0.9rem !important;
    line-height: 0.9rem !important;
  }

  .header-right {
    height: 100%;
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 start
.aqvns-title-header {
  background-color: #c9a786 !important; //header 底層按鈕按鈕背景顏色
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 end
</style>
