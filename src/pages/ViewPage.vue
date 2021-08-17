<template>
  <div
    class="auto-box"
    :class="{ 'fixed-box': fullBox }"
    :style="{
      height: fullBox ? '100%' : 'auto',
      minHeight: $store.state.main.windowHeight + 'px',
    }"
  >
    <section
      class="auto-box-static"
      :style="{ zIndex: staticZIndex.toString() }"
    >
      <slot name="static"></slot>
    </section>
    <section
      style="width: 100vw"
      :style="{ height: headerHeight + 'px' }"
    ></section>
    <!--<header class="auto-box-header" ref="header" v-transfer-dom="transferHeader" v-no-touch-move>-->
    <header
      class="auto-box-header"
      ref="header"
      v-transfer-dom="transferHeader"
      v-no-touch-move
    >
      <slot name="header"></slot>
    </header>
    <section
      style="width: 100vw"
      :style="{ height: headerStaticHeight + 'px' }"
    ></section>
    <section
      class="auto-box-header-static"
      ref="header-static"
      :style="{ top: headerHeight + 'px' }"
    >
      <slot name="header-static"></slot>
    </section>
    <section
      class="auto-box-content"
      ref="scroll"
      :style="[contentStyle, cocosBackground]"
    >
      <div
        v-if="fullBox"
        style="
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          width: 100%;
          position: static;
        "
        :style="{ minHeight: scrollHeight + (noScroll ? 0 : 4) + 'px' }"
        ref="content"
      >
        <hong-bao-yu
          v-if="$config.showRedPacket && $route.path == '/home'"
        ></hong-bao-yu>
        <div
          class="load-top"
          v-if="loadMore && !noScroll && fullBox"
          v-show="!loading"
        >
          <van-loading
            type="spinner"
            size="0.6rem"
            :color="
              loadTag
                ? $config.newQP || $config.blackTheme
                  ? '#F6CF32'
                  : theme.color
                : '#c3c3c3'
            "
          ></van-loading>
          <p
            class="load-info"
            :class="{ 'theme-color theme-color-yellow': loadTag }"
          >
            {{ loadTag ? "松开" : "" }}{{ topLoadText }}
          </p>
        </div>
        <div
          class="loading-top"
          v-if="loadMore && !noScroll && fullBox"
          v-show="loading && loadTag === 'top'"
        >
          <van-loading
            type="circular"
            size="0.6rem"
            :color="theme.color"
          ></van-loading>
        </div>
        <slot name="content"></slot>
        <div
          class="loading-down"
          v-if="loadMore && !noScroll && fullBox"
          v-show="loading && loadTag === 'down'"
        >
          <van-loading
            type="circular"
            size="0.6rem"
            :color="theme.color"
          ></van-loading>
        </div>
        <div
          class="load-down"
          v-if="loadMore && !noScroll && fullBox"
          v-show="!loading && !noMore"
        >
          <p
            class="load-info"
            :class="{ 'theme-color theme-color-yellow': loadTag }"
          >
            {{ loadTag ? "松开" : "" }}{{ downLoadText }}
          </p>
          <van-loading
            type="spinner"
            size="0.6rem"
            :color="
              loadTag
                ? $config.newQP || $config.blackTheme
                  ? '#F6CF32'
                  : theme.color
                : '#c3c3c3'
            "
          ></van-loading>
        </div>
        <div
          class="load-down"
          v-if="loadMore && !noScroll && fullBox"
          v-show="!loading && noMore"
        >
          <p class="load-info">没有更多</p>
        </div>
      </div>
      <div
        v-else
        style="
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          width: 100%;
          position: static;
        "
        :style="{ minHeight: scrollHeight + 'px' }"
        ref="content"
      >
        <slot name="content"></slot>
      </div>
    </section>
    <section
      style="width: 100%; position: absolute"
      :style="{
        height: scrollHeight + 'px',
        top: headerHeight + headerStaticHeight + 'px',
      }"
    >
      <slot name="content-static"></slot>
    </section>
    <footer class="auto-box-footer" :style="positionStyle" ref="footer">
      <slot name="footer"></slot>
    </footer>
    <div style="width: 100vw" :style="{ height: footerHeight + 'px' }"></div>
  </div>
</template>

<script type="text/javascript">
import IScroll from "iscroll/build/iscroll-probe";
import BScroll from "better-scroll";
import themes from "../style/theme";

function checkDom(el, option) {
  let status = false;
  if (!status && option.tagName && option.tagName.test(el.tagName))
    status = true;
  if (!status && option.className && option.className.test(el.className))
    status = true;
  return status;
}

export default {
  name: "ViewPage",
  props: {
    fullBox: {
      type: Boolean,
      default: false,
    },
    loadMore: {
      type: Boolean,
      default: false,
    },
    transferHeader: {
      type: Boolean,
      default: true,
    },
    isTransition: {
      type: Boolean,
      default: false,
    },
    topLoadText: {
      type: String,
      default: "刷新数据",
    },
    positionStyle: {
      type: String,
      default: "position: fixed;",
    },
    downLoadText: {
      type: String,
      default: "加载更多",
    },
    staticZIndex: {
      type: [String, Number],
      default: "1",
    },
    noMore: {
      type: Boolean,
      default: false,
    },
    noScroll: {
      type: Boolean,
      default: false,
    },
    // 上下拖动弹性
    bounce: {
      type: Boolean,
      default: true,
    },
    bounceEasing: {
      style: "cubic-bezier(0,0,1,1)",
      fn: function (k) {
        return k;
      },
    },
    // 屏幕滚动阻力
    deceleration: {
      type: Number,
      default: 0.0008,
    },
  },
  data() {
    return {
      headerHeight: 0,
      headerStaticHeight: 0,
      footerHeight: 0,
      scroll: null,
      loadMoreHeight: 0,
      loading: false,
      loadTag: false,
      loadInited: false,
      maxScrollY: 200,
      footerBottom: 0,
      top: 0,
      loadReset: true,
      isRotate: false,
      useTransition: true,
    };
  },
  computed: {
    theme() {
      return (
        themes.find((theme) => theme.code === this.$store.state.main.theme) ||
        {}
      );
    },
    scrollHeight() {
      if (
        this.$mobileDevice.isIOS &&
        this.$route.path === "/take" &&
        (this.$mobileDevice.osVersion === "13.1.3" ||
          this.$mobileDevice.osVersion === "13.1.2" ||
          this.$mobileDevice.osVersion === "12.2") &&
        this.$mobileDevice.isSafari
      ) {
        //解决取款页面键盘弹起后遮挡问题
        //return this.$store.state.main.windowHeight - this.headerHeight - this.headerStaticHeight - this.footerHeight + 200;
      }
      return (
        this.$store.state.main.windowHeight -
        this.headerHeight -
        this.headerStaticHeight -
        this.footerHeight
      );
    },
    contentStyle() {
      if (this.fullBox) {
        if (this.$config.home === "tc") {
          //体彩天下版本
          return {
            height: this.scrollHeight - 6 + "px",
            overflow: "hidden !important",
          };
        } else {
          return {
            height: this.scrollHeight + "px",
            overflow: "hidden !important",
          };
        }
      } else {
        return { height: "auto" };
      }
    },
    cocosBackground() {
      if (
        (this.$config.blackTheme || this.$config.newQP) &&
        this.$route.query.cocos &&
        this.$route.fullPath.includes("/lottery") &&
        this.$route.fullPath !== "/lottery/rules"
      ) {
        return {
          background: "#001",
        };
      }
    },
  },
  watch: {
    scrollHeight() {
      const content = this.$refs.content.querySelector(".content-slot");
      if (content) {
        content.style.minHeight = this.scrollHeight + "px";
      }
      this.$emit("scroll-height-change", this.scrollHeight);
    },
    fullBox() {
      if (this.fullBox) {
        window.document.documentElement.classList.add("view-page");
      } else {
        window.document.documentElement.classList.remove("view-page");
      }
      this.init();
    },
    loadMore() {
      this.initLoad();
    },
    noScroll() {
      this.init();
    },
  },
  created() {
    this.loadMoreHeight = Math.round(window.innerWidth / 5);
    if (this.$mobileDevice.isIOS && this.isTransition) {
      this.useTransition = false;
    }
    if (this.isTransition) {
      this.useTransition = false;
    }
    if (
      this.$mobileDevice.osVersion.split(".")[0] >= 13 &&
      this.$mobileDevice.osVersion.split(".")[1] >= 3
    ) {
      this.useTransition = false;
    }
    if (this.fullBox) {
      window.document.documentElement.classList.add("view-page");
    } else {
      window.document.documentElement.classList.remove("view-page");
    }
  },
  mounted() {
    this.domResize.bind(this.$refs["header"], this.refresh.bind(this));
    this.domResize.bind(this.$refs["header-static"], this.refresh.bind(this));
    this.domResize.bind(this.$refs["footer"], this.refresh.bind(this));
    this.$refs.scroll.addEventListener(
      "touchstart",
      (evt) => {
        if (event.touches.length >= 2 && this.scroll) {
          this.scroll.destroy();
          this.scroll = null;
        }
        this.refresh();
      },
      false
    );
    this.$refs.scroll.addEventListener("touchend", () => {
      if (!this.scroll) {
        this.init();
      }
    });
    window.addEventListener("resize", () => {
      this.refresh();
    });
    this.init();
    this.initLoad();
    let self = this;
    let timer = null;
    let timer3 = null;
    let originalMove = IScroll.prototype._move;
    IScroll.prototype._move = function () {
      originalMove.apply(this, arguments);
      IScroll.prototype._execEvent.call(this, "scrollMove");
    };
    //解决input光标错位
    document.body.addEventListener("focusin", function (focusEv) {
      if (self.scroll) {
        let style = focusEv.target.style;
        self.scroll.on("scrollMove", function test() {
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(test, 0);
          if (style.textShadow === "") {
            style.textShadow = "rgba(0,0,0,0) 0 0 0";
          } else {
            style.textShadow = "";
          }
        });
      }
    });
    document.body.addEventListener("focusout", function (focusEv) {
      clearTimeout(timer3);
      timer3 = setTimeout(() => {
        window.scrollTo({ top: 0 });
      }, 10);
      if (self.scroll) {
        clearTimeout(timer);
        focusEv.target.style.textShadow = "";
      }
    });
  },
  methods: {
    scrollToTop() {
      this.scroll && this.scroll.stop && this.scroll.stop();
      this.scroll && this.scroll.scrollTo(0, 0, 0);
    },
    isFullScreen() {
      return (
        document.body.scrollHeight == window.screen.height &&
        document.body.scrollWidth == window.screen.width
      );
    },
    initLoad() {
      if (this.scroll && this.loadMore && !this.loadInited) {
        this.scroll.on("scroll", () => {
          if (!this.loading) {
            if (this.scroll.y > 0) {
              if (this.scroll.y > this.loadMoreHeight * 0.9) {
                this.loadTag = "top";
              } else {
                this.loadTag = "";
              }
            } else if (this.scroll.y < this.scroll.maxScrollY) {
              if (
                this.scroll.y <
                this.scroll.maxScrollY - this.loadMoreHeight * 0.9
              ) {
                this.loadTag = "down";
              } else {
                this.loadTag = "";
              }
            }
          }
        });
        this.scroll.on("scrollEnd", () => {
          switch (this.loadTag) {
            case "top":
              this.loading = true;
              this.$emit("load-top");
              break;

            case "down":
              if (!this.noMore) {
                this.loading = true;
                this.$emit("load-down");
              }
              break;
            default:
          }
        });
        this.loadInited = true;
      }
    },
    init() {
      if (this.fullBox && !this.noScroll) {
        let scrollType = this.$route.name === "lottery" ? BScroll : IScroll;
        this.scroll = new scrollType(this.$refs.scroll, {
          click: false,
          useTransition: this.useTransition,
          disableMouse: false,
          mouseWheel: /(linux|win)/.test(
            window.navigator.platform.toString().toLowerCase()
          ),
          // disablePointer: !/(linux|win)/.test(window.navigator.platform.toString().toLowerCase()),
          eventPassthrough: "horizontal",
          preventDefault: true,
          // interactiveScrollbars: true,
          // scrollbars: true,
          // fadeScrollbars: true,
          deceleration: this.deceleration,
          probeType: 2,
          bounce: this.bounce,
          preventDefaultException: {
            // tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/,
            className:
              /(^|\s)(van-tabs__wrap--scrollable|scrollable|formfield|scrollable-box|selector-box|scroll-amount-list)(\s|$)/,
          },
        });
        this.refresh();
        this.scroll.refresh();
        this.$nextTick(() => {
          this.refresh();
          this.scroll.refresh();
        });

        // this.$el.addEventListener("gesturestart",event=> {

        //   event.stopPropagation()
        //   event.preventDefault()
        // },false);
        this.$el.addEventListener("touchmove", (evt) => {
          let parent = evt.target;
          let status = true;
          while (parent.tagName !== "BODY" && status && this.scroll) {
            if (checkDom(parent, this.scroll.options.preventDefaultException))
              status = false;
            else parent = parent.parentNode || parent.parentElement;
          }
          if (status) evt.preventDefault();
        });
        this.scroll.on("scrollEnd", () => {
          if (this.scroll.y == -4) {
            //刷新回退问题
            this.scroll.scrollTo(0, 0, 500);
          }
        });

        //解决UC上拉不回滚
        this.scroll.on("scrollMove", () => {
          if (
            this.scroll.y < this.scroll.maxScrollY &&
            this.scroll.pointY < 30
          ) {
            this.scroll.scrollTo(0, this.scroll.maxScrollY, 400);
            return;
          } else if (
            this.scroll.y > 0 &&
            this.scroll.pointY > window.innerHeight - 1
          ) {
            this.scroll.scrollTo(0, 0, 400);
            return;
          }
        });
      } else setTimeout(this.refresh.bind(this), 0);
    },
    loaded() {
      this.loading = false;
      this.loadTag = "";
    },

    refresh() {
      var screenHeight = window.screen.height; //获取屏幕分辨率高度
      if (this.$refs["header"]) {
        try {
          this.headerHeight = parseFloat(
            document.defaultView
              .getComputedStyle(this.$refs["header"])
              .height.toString()
              .replace("px", "")
          );
          this.top = this.$refs["header"].offsetHeight;
        } catch (e) {
          this.headerHeight = this.$refs["header"].clientHeight;
        }
      }
      var width = document.documentElement.clientWidth;
      var height = document.documentElement.clientHeight;

      if (
        this.$mobileDevice.isIOS &&
        this.$mobileDevice.isSafari &&
        ["13.1.2", "13.5.1"].includes(this.$mobileDevice.osVersion)
      ) {
        //解决ios自带浏览器系统版本13.1.2旋转后高度问题
        if (width > height) {
          //横屏校验
          if (this.scrollHeight >= 290) {
            //iphone x 小屏幕 并且会隐藏工具栏
            this.isRotate = true;
          }
        } else {
          if (this.isRotate) {
            //进行过旋转，刷新复原界面高度
            window.location.reload();
          }
        }
      }
      if (this.$refs["header-static"]) {
        try {
          this.headerStaticHeight = parseFloat(
            document.defaultView
              .getComputedStyle(this.$refs["header-static"])
              .height.toString()
              .replace("px", "")
          );
        } catch (e) {
          this.headerStaticHeight = this.$refs["header-static"].clientHeight;
        }
      }
      if (this.$refs["footer"]) {
        try {
          if (width > height) {
            //横屏校验
            this.footerHeight = 0;
          } else {
            var curr = this.$route.path;
            if (curr === "/home" || curr === "/user") {
              //首页和会员中心设置底部高度为55防止横屏后在竖屏底部空白
              this.footerHeight = 55;
            } else {
              this.footerHeight = parseFloat(
                document.defaultView
                  .getComputedStyle(this.$refs["footer"])
                  .height.toString()
                  .replace("px", "")
              );
            }
          }
        } catch (e) {
          this.footerHeight = this.$refs["footer"].clientHeight;
        }
      }

      if (this.fullBox && this.$refs.scroll) {
        if (typeof this.$refs.scroll.scrollTo === "function")
          this.$refs.scroll.scrollTo(0, 0);
        else this.$refs.scroll.scrollTop = 0;
      }
      this.$nextTick(() => {
        if (this.scroll) this.scroll.refresh();
      });
    },
  },
  beforeDestroy() {
    this.domResize.remove(this.$refs["header"]);
    this.domResize.remove(this.$refs["header-static"]);
    this.domResize.remove(this.$refs["footer"]);
    if (this.scroll) this.scroll.destroy();
  },
};
</script>
