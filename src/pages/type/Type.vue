<template>
  <component :id="id" :title="title" :is="component">
    <pub-dialog v-model="showNoticeDialog" style="z-index: 9999">
      <div
        :class="{
          'notice-dialog':
            noticeContent && noticeContent['desc_format_type'] === 'text',
          'notice-dialog-pic':
            noticeContent && noticeContent['desc_format_type'] === 'pic',
          'notice-dialog-minx': $config.home === 'vns',
          'notice-dialog-tc': $config.home === 'tc',
          'notice-dialog-newqp': $config.newQP || $config.blackTheme,
        }"
      >
        <template v-if="$config.home === 'vns'">
          <img
            v-show="
              noticeContent &&
              $config.home === 'vns' &&
              noticeContent['desc_format_type'] === 'text'
            "
            src="../../assets/img/notice_header.png"
            alt
          />
          <scroll-box
            ref="notice-scroll"
            class="notice-dialog-content"
            style="maxheight: 5rem"
            auto
            v-if="noticeContent && noticeContent['desc_format_type'] === 'text'"
          >
            <div
              class="con-text"
              ref="notice-scroll-content"
              v-html="noticeContent.description"
            ></div>
          </scroll-box>
          <!-- <a href="javascript:void(0)" class="notice-dialog-footer theme-color" @click="onNoticeOk" v-show="noticeContent && $config.home==='vns' && noticeContent['desc_format_type']==='text'">
                    <div style="heigth:1rem;" class="theme-bg">我知道了</div>
                </a> -->
          <div
            class="notice-dialog-footer vns-notice-dialog-footer"
            v-show="
              noticeContent && noticeContent['desc_format_type'] === 'text'
            "
          >
            <div class="vns-btn1" @click="onNoticeOk(1)">我知道了</div>
            <div class="vns-btn2" @click="onNoticeOk(2)">关闭公告</div>
          </div>
          <img
            class="img"
            :src="noticeContent && noticeContent['mob_pic']"
            v-show="
              noticeContent && noticeContent['desc_format_type'] === 'pic'
            "
            @click="onNoticeOk(2)"
            alt
          />
          <div
            class="close-box"
            @click="onNoticeOk(2)"
            v-show="
              noticeContent && noticeContent['desc_format_type'] === 'pic'
            "
          >
            <span class="close"
              ><i class="icon iconfont h5-icon-win-close"></i
            ></span>
          </div>
        </template>
        <template v-else-if="noticeContent && $config.home === 'tc'">
          <scroll-box
            ref="notice-scroll"
            class="notice-dialog-content"
            auto
            v-if="noticeContent && noticeContent['desc_format_type'] === 'text'"
          >
            <div
              class="con-text"
              ref="notice-scroll-content"
              v-html="noticeContent && noticeContent.description"
            ></div>
          </scroll-box>
          <a
            href="javascript:void(0)"
            class="notice-dialog-footer theme-color"
            @click="onNoticeOk(2)"
            v-show="
              noticeContent && noticeContent['desc_format_type'] === 'text'
            "
            >确认</a
          >
          <img
            class="img"
            :src="noticeContent && noticeContent['mob_pic']"
            v-show="
              noticeContent && noticeContent['desc_format_type'] === 'pic'
            "
            alt
          />
          <a
            href="javascript:void(0)"
            class="close van-icon van-icon-cross"
            @click="onNoticeOk(2)"
            v-show="
              noticeContent && noticeContent['desc_format_type'] === 'pic'
            "
            ><i class="icon iconfont h5-icon-win-close"></i
          ></a>
        </template>
        <template v-else>
          <img
            v-show="
              noticeContent && noticeContent['desc_format_type'] === 'text'
            "
            class="top-img"
            :src="qpNoticeImg"
            alt
          />
          <scroll-box
            ref="notice-scroll"
            class="notice-dialog-content"
            auto
            style="padding: 0 0.4rem; maxheight: 5rem"
            v-if="noticeContent && noticeContent['desc_format_type'] === 'text'"
          >
            <div
              class="con-text"
              ref="notice-scroll-content"
              v-html="noticeContent && noticeContent.description"
            ></div>
          </scroll-box>
          <!-- <a href="javascript:void(0)" class="notice-dialog-footer theme-color" @click="onNoticeOk" v-show="noticeContent && noticeContent['desc_format_type']==='text'">
                    <div style="heigth:1rem;" class="theme-bg">我知道了</div>
                </a> -->
          <div
            :class="[
              'notice-dialog-footer',
              $config.home + '-dialog-footer',
              {
                'newqp-notice-dialog-footer':
                  $config.newQP || $config.blackTheme,
              },
            ]"
            v-show="
              noticeContent && noticeContent['desc_format_type'] === 'text'
            "
          >
            <div @click="onNoticeOk(1)">我知道了</div>
            <div @click="onNoticeOk(2)">关闭公告</div>
          </div>
          <img
            class="img"
            :src="noticeContent && noticeContent['mob_pic']"
            v-show="
              noticeContent && noticeContent['desc_format_type'] === 'pic'
            "
            @click="onNoticeOk(2)"
            alt
          />
          <div
            class="close-box"
            @click="onNoticeOk(2)"
            v-show="
              noticeContent && noticeContent['desc_format_type'] === 'pic'
            "
          >
            <span class="close"
              ><i class="icon iconfont h5-icon-win-close"></i
            ></span>
          </div>
        </template>
      </div>
    </pub-dialog>
  </component>
</template>

<script>
import TypeTCTX from "./theme/tctx/Index";
import TypeXPJ from "./theme/xpj/Index";
import TypeVNS from "./theme/vns/Index";
import TotteryHall from "./lottery-hall/Index";
import newGame from "./new-game/index";
import qpGame from "./qp-game";
import newqpgame from "./newqp-game";
import AmhgGame from "./amhg-game/index";
export default {
  name: "Type",
  components: {
    TypeTCTX,
    TypeXPJ,
    TypeVNS,
    TotteryHall,
    newGame,
    qpGame,
    newqpgame,
    AmhgGame,
  },
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showNoticeDialog: false,
      notices: [],
      noticeIndex: 0,
      show: true,
      title: this.$route.params.name,
    };
  },
  computed: {
    qpNoticeImg() {
      if (this.$config.newQP || this.$config.blackTheme) {
        return require("../../assets/img/notice_newQP_header.png");
      } else if (this.$config.home === "qp" || this.$config.blush) {
        return require("../../assets/img/notice_black_header.png");
      } else if (this.$config.home === "amhg") {
        return require("../../assets/img/notice_amhg_header.png");
      } else {
        return require("../../assets/img/notice_xpj_header.png");
      }
    },
    stopImg() {
      return require(`@src/assets/img/home/${this.$config.home}-stop.png`);
    },
    imgAlertCloseSizeStyle() {
      return this.$config.imgAlertCloseSizeStyle;
    },
    noticeContent() {
      if (this.notices[this.noticeIndex]) {
        return this.notices[this.noticeIndex];
      } else {
        return null;
      }
    },
    component() {
      // 新版电子棋牌捕鱼
      let paramsId = this.$route.params.id;
      if (
        this.$config.newGame &&
        (paramsId === "10001" || paramsId === "10004" || paramsId === "10005")
      ) {
        if (this.$config.home === "qp" || this.$config.home === "blush") {
          if (this.$config.name === "betnew") return "amhgGame"; // betnew 要使用這個 type
          return this.$config.newQP || this.$config.home === "blush"
            ? "newqpgame"
            : "qpGame";
        } else if (this.$config.home === "amhg") {
          return "amhgGame";
        } else {
          return "newGame";
        }
      }
      if (this.$config.home === "amhg" && paramsId === "10000") {
        return "TotteryHall";
      }
      switch (this.$config.home) {
        case this.VAR.HOME.TC:
          return "TypeTCTX";
        case this.VAR.HOME.XPJ:
          return "TypeXPJ";
        case this.VAR.HOME.VNS:
          return "TypeVNS";
        case this.VAR.HOME.QP:
          return "TypeVNS";
        case this.VAR.HOME.AMHG:
          return "TypeVNS";
        case this.VAR.HOME.CPXPJ:
          return "TypeVNS";
        case this.VAR.HOME.AQVNS:
          return "TypeVNS";
        case this.VAR.HOME.JS85:
          return "TypeVNS";  
        case this.VAR.HOME.BLUSH:
          return "TypeVNS";
        default:
          return "TypeTCTX";
      }
    },
  },
  mounted() {
    if (
      this.$store.state.main.showDialog.game[
        localStorage.token ? "login" : "noLogin"
      ]
    ) {
      setTimeout(() => {
        this.getDialogNotice();
      }, 300);
    }
  },
  watch: {
    "$store.state.main.siteId": {
      handler() {
        if (
          this.$store.state.main.showDialog.home[
            localStorage.token ? "login" : "noLogin"
          ]
        ) {
          this.getDialogNotice();
        }
      },
    },
    showNoticeDialog() {
      if (this.showNoticeDialog) {
        this.$nextTick(() => {
          if (this.$refs["notice-scroll"]) {
            this.$refs["notice-scroll"].refresh();
            this.domResize.bind(this.$refs["notice-scroll-content"], () => {
              this.$refs["notice-scroll"].refresh();
            });
          }
          if (this.noticeContent["desc_format_type"] === "text") {
            const box =
              this.$refs["notice-scroll"].$el.querySelector(".scroll-content");
            if (box) {
              const arr = box.querySelectorAll("*");
              for (let i = 0; i < arr.length; i++) {
                let baseSize = arr[i].style.fontSize;
                if (baseSize && baseSize.includes("px")) {
                  baseSize = parseFloat(baseSize.replace("px", ""));
                  arr[i].style.fontSize = (baseSize * 2) / 100 + "rem";
                } else {
                  arr[i].style.fontSize = "0.32rem";
                }
              }
            }
          }
        });
      }
    },
  },
  methods: {
    onNoticeOk(type) {
      this.showNoticeDialog = false;
      switch (type) {
        case 1:
          localStorage["noticeId"] = this.noticeContent.orderId;
          if (this.userInfo && JSON.stringify(this.userInfo) !== "{}") {
            this.$store.dispatch("main/newNoticeMember", {
              uid: this.userInfo.uid,
              nid: this.noticeContent.id,
            });
          }
          break;
        case 2:
          this.$store.commit("main/setClosedTypeNoticeDialog", true);
          break;
      }
      setTimeout(() => {
        this.noticeIndex++;
        this.$nextTick(() => {
          if (this.noticeContent) {
            this.showNoticeDialogs();
          } else {
            this.noticeIndex = 0;
          }
        });
      }, 500);
    },
    showNoticeDialogs() {
      if (!this.show) {
        return false;
      }
      if (
        this.noticeContent &&
        !this.$store.state.main.closedTypeNoticeDialog &&
        Number(localStorage["noticeId"]) !== Number(this.noticeContent.orderId)
      ) {
        this.showNoticeDialog = true;
        const noticeIndex = this.noticeIndex;
      }
    },
    getDialogNotice() {
      this.$store.state.main.showDialog.home[
        localStorage.token ? "login" : "noLogin"
      ] = false;
      this.$store
        .dispatch("main/getPopups", {
          position: 2,
          status: localStorage.token ? 2 : 1,
          uid: this.userInfo.uid,
        })
        .then((res) => {
          if (res.code === 200) {
            if (res.data.data.length) {
              this.notices = res.data.data.filter((item) => {
                let show = true;
                if (item.status !== "yes") {
                  show = false;
                }
                if (item["offline_at"] && item["publish_at"]) {
                  const now = this.dayJs();
                  const start = this.dayJs.unix(item["publish_at"]);
                  const end = this.dayJs.unix(item["offline_at"]);
                  if (now.isAfter(end) || now.isBefore(start)) {
                    show = false;
                  }
                }
                return show;
              });
              this.$nextTick(() => {
                setTimeout(() => {
                  this.showNoticeDialogs();
                }, 500);
              });
            }
          }
        })
        .catch(() => {
          console.warn("发生错误!");
        });
    },
    beforeDestroy() {
      this.domResize.remove(this.$refs["notice-scroll-content"]);
      this.show = this.showNoticeDialog = false;
    },
  },
};
</script>

<style lang="less">
.notice-dialog-pic {
  width: 6.4rem;
  box-sizing: border-box;
  padding: 0;
  position: absolute;
  top: 46%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0) scale(0);
  transform-origin: top;
  transition: all 400ms;

  .img {
    width: 100%;
    display: block;
  }

  .close-box {
    position: relative;
    left: 50%;
    top: 0rem;
    transform: translateX(-50%);
    width: 1.2rem;
    height: 1.2rem;
    .close {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 0.64rem;
      height: 0.64rem;
      background-color: #444444;
      border-radius: 50%;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.notice-dialog {
  width: 6.62rem;
  box-sizing: border-box;
  padding: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 0.4rem;
  transform: translate3d(-50%, -50%, 0) scale(0);
  transform-origin: top;
  opacity: 0.96;
  transition: all 400ms;
  background-color: unset;

  img {
    width: 100%;
    display: block;
  }

  .notice-dialog-content {
    display: block;
    padding: 0.2rem 0.4rem;
    background-color: #fff;
    text-align: left;
    font-size: 0.32rem;
    max-height: 6.5rem;
    margin-top: -0.02rem;
    overflow: hidden;

    .con-text {
      padding: 0.2rem 0;
      color: #333333;
      line-height: 0.5rem;
    }
  }

  .notice-dialog-footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    background: #fff;
    padding: 0.25rem 0.4rem 0.25rem;
    border-radius: 0 0 0.2rem 0.2rem;

    &.vns-notice-dialog-footer {
      padding: 0.3rem 0.4rem 0.3rem;
    }
    &.qp-dialog-footer {
      & > div {
        background: #c62721 !important;
      }
    }
    &.amhg-dialog-footer {
      & > div {
        background: #e9b842 !important;
      }
    }
    & > div {
      width: 2.46rem;
      height: 0.72rem;
      line-height: 0.72rem;
      background: rgba(0, 169, 244, 1);
      border-radius: 0.1rem;
      font-size: 0.34rem;
      color: #fff;
    }
    .vns-btn1,
    .vns-btn2 {
      width: 2.6rem;
      height: 0.72rem;
      line-height: 0.72rem;
      font-size: 0.36rem;
      color: #fff;
      border-radius: 0.36rem;
    }
    .vns-btn1 {
      background: linear-gradient(
        262deg,
        rgba(3, 205, 176, 1),
        rgba(1, 187, 210, 1)
      );
    }
    .vns-btn2 {
      background-color: #313131;
    }
    &.newqp-notice-dialog-footer {
      & > div {
        background: linear-gradient(180deg, #f1eb72, #ecbe04) !important;
        color: #000000;
      }
    }
    &.blush-dialog-footer {
      & > div {
        background: #c62721 !important;
      }
    }
  }
}

.notice-dialog-tc {
  width: 6.4rem;
  box-sizing: border-box;
  padding: 0.2rem 0.4rem 0 0.4rem;
  background-color: #fff;
  position: absolute;
  top: 46%;
  left: 50%;
  border-radius: 0.4rem;
  transform: translate3d(-50%, -50%, 0) scale(0);
  transform-origin: top;
  opacity: 0.96;
  transition: all 400ms;

  .notice-dialog-content {
    display: block;
    padding: 0.4rem 0;
    text-align: left;
    font-size: 0.32rem;
    max-height: 7.5rem;
    overflow: hidden;
  }

  .notice-dialog-footer {
    height: 0.88rem;
    line-height: 0.88rem;
    display: block;
    border-top: 0.02rem solid hsla(0, 0%, 95%, 1);
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    text-align: center;
    font-size: 0.34rem;
  }

  .notice-dialog-footer::after {
    height: 0;
  }
}
.notice-dialog-newqp {
  border-radius: 0.18rem;
  overflow: hidden;
  .notice-dialog-content {
    background-color: rgba(0, 0, 0, 0.8);
    .con-text p {
      color: #fff !important;
    }
  }
  .notice-dialog-footer {
    background-color: rgba(0, 0, 0, 0.8);
  }
  .top-img {
    background-color: #000;
  }
}

.show .notice-dialog,
.show .notice-dialog-pic {
  transform: translate3d(-50%, -50%, 0) scale(1) !important;
}
</style>
