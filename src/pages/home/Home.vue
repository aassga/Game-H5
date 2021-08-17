<template>
  <component :is="name">
    <pub-dialog
      v-model="showNoticeDialog"
      style="z-index: 9999"
      slot="NoticeDialog"
    >
      <div
        :class="{
          'notice-dialog':
            noticeContent && noticeContent['desc_format_type'] === 'text',
          'notice-dialog-pic':
            noticeContent && noticeContent['desc_format_type'] === 'pic',
          'notice-dialog-minx': $config.home === 'vns',
          'notice-dialog-tc': $config.home === 'tc',
          'notice-dialog-aqvns': $config.home === 'aqvns',
          'notice-dialog-newqp': $config.newQP || $config.blackTheme,
        }"
      >
        <template v-if="$config.home === 'vns' && !$config.blackTheme">
          <img
            v-show="
              noticeContent && noticeContent['desc_format_type'] === 'text'
            "
            src="../../assets/img/notice_header.png"
            alt
          />
          <scroll-box
            auto
            ref="notice-scroll"
            class="notice-dialog-content"
            style="maxheight: 5rem"
            v-if="noticeContent && noticeContent['desc_format_type'] === 'text'"
          >
            <div
              class="con-text"
              ref="notice-scroll-content"
              v-html="noticeContent.description"
            ></div>
          </scroll-box>
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
            v-show="
              noticeContent && noticeContent['desc_format_type'] === 'pic'
            "
            @click="onNoticeOk(2)"
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
            :class="{ 'blush-close-box': $config.blush }"
            @click="onNoticeOk(2)"
            v-show="
              noticeContent && noticeContent['desc_format_type'] === 'pic'
            "
          >
            <span class="close" v-if="!$config.blush"
              ><i class="icon iconfont h5-icon-win-close"></i
            ></span>
            <img src="@src/assets/img/blush-close.png" alt="" v-else />
          </div>
        </template>
      </div>
    </pub-dialog>
    <pub-dialog
      v-model="$store.state.main.marqueeDialog"
      style="z-index: 9999"
      slot="marqueeDialog"
    >
      <div
        :class="[
          'marqueeDialog',
          'show',
          
          {
            'qp-marqueeDialog': $config.newQP || $config.blackTheme,
            'blush-marqueeDialog': $config.blush,
            'aqvns-marqueeDialog': $config.home === 'aqvns',
          },
        ]"
      >
        <div class="tit">
          <img :src="dialogTopImg" alt />
          <img
            src="@src/assets/img/marquee-close-btn.png"
            @click="closeMarquee"
            class="close-btn"
          />
        </div>
        <div class="cont" ref="marqueeDialog">
          <ul>
            <li v-for="(item, i) in noticeStr" :key="i">
              {{ i + 1 }}.
              {{ item.description }}
              <div class="time" :class="{ 'theme-color-white': $config.blush }">
                {{ item.updated_at }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </pub-dialog>
    <!-- 新人优惠 -->
    <!-- <pub-dialog
      v-model="showNewUser"
      style="z-index: 99"
      slot="newUser"
    >
      <div class="newUser">
            <div class="black-newUser" v-if="$config.newQP || $config.blackTheme">
                <img src="../../assets/img/home/newUser/black-box.png" alt="" class="black-box">
                <img src="../../assets/img/home/newUser/black-cancel-btn.png" alt="" @click="showNewUser = false" class="black-cancel">
                <img src="../../assets/img/home/newUser/black-primary-btn.png" alt="" class="black-primary">
            </div>
            <div class="default-newUser" v-if="!$config.newQP && !$config.blackTheme">
                <img src="../../assets/img/home/newUser/box.png" alt="">
                <img src="../../assets/img/home/newUser/cancel-btn.png" alt="">
                <img src="../../assets/img/home/newUser/primary-btn.png" alt="">
            </div>
      </div>
    </pub-dialog> -->
  </component>
</template>

<script>
import * as homes from "./theme";
import BScroll from "better-scroll";
export default {
  name: 'home',
  components: {
    HomeXpj: homes.HomeXpj,
    HomeTctx: homes.HomeTctx,
    HomeVns: homes.HomeVns,
    HomeQP: homes.HomeQP,
    HomeAmhg: homes.HomeAmhg,
    HomeBlush: homes.HomeBlush,
    HomeCpxpj: homes.HomeCpxpj,
    HomeAqvns: homes.HomeAqvns,
    // HomeJs85: homes.HomeJs85,
  },
  data() {
    return {
      showNoticeDialog: false,
      notices: [],
      noticeIndex: 0,
      noticeContent: null,
      show: true,
      getDateTimer: 0,
      showNewUser: false,
    };
  },
  created() {
    if (!!localStorage["channelCode"]) return;
    if (
      localStorage["agent"] &&
      !localStorage["agentFirst"] &&
      !["935qp", "632qp", "kyqp", "839qp", "k78qp","aqvns"].includes(
        this.$config.name
      )
    ) {
      if (this.$config.home == "vns") {
        if (this.$config.name === "blr") {
          this.$router.replace("/admin/login");
        } else {
          this.$router.replace("/admin/vns-login");
        }
      } else if (this.$config.home == "qp") {
        this.$router.replace("/admin/login?index=1");
      } else if (this.$config.home == "amhg") {
        this.$router.replace("/admin/login?index=1");
      } else {
        ["vnst","aqvns"].includes(this.$config.name)
          ? this.$router.replace("/admin/login?index=1")
          : this.$router.replace("/admin/register");
      }
    }
    setTimeout(() => {
      this.toastClear();
    }, 200);
    if (
      localStorage["userInfo"] &&
      JSON.stringify(localStorage["userInfo"]) !== "{}" &&
      !localStorage["jinguanjiaInfo"]
    ) {
      this.$store.dispatch("agency/memberCenterJinguanjiaInfo");
    }
  },
  computed: {
    qpNoticeImg() {
      if (this.$config.newQP || this.$config.blackTheme) {
        return require("../../assets/img/notice_newQP_header.png");
      } else if (this.$config.home === "qp" || this.$config.blush) {
        return require("../../assets/img/notice_black_header.png");
      } else if (this.$config.home === "amhg") {
        return require("../../assets/img/notice_amhg_header.png");
      } else if (this.$config.home === "aqvns") {
        return require("../../assets/img/notice_aqvns_header.png");
      } else {
        return require("../../assets/img/notice_xpj_header.png");
      }
    },
    name() {
      switch (this.$config.home) {
        case this.VAR.HOME.BLUSH:
          return "HomeBlush";
        case this.VAR.HOME.XPJ:
          return "HomeXpj";
        case this.VAR.HOME.TC:
          return "HomeTctx";
        case this.VAR.HOME.VNS:
          return "HomeVns";
        case this.VAR.HOME.QP:
          return "HomeQP";
        case this.VAR.HOME.AMHG:
          return "HomeAmhg";
        case this.VAR.HOME.CPXPJ:
          return "HomeCpxpj";
        case this.VAR.HOME.AQVNS:
          return "HomeAqvns";
        case this.VAR.HOME.JS85:
          return "HomeJs85";  
        default:
          return "HomeXpj";
      }
    },
    imgAlertCloseSizeStyle() {
      return this.$config.imgAlertCloseSizeStyle;
    },
    // noticeContent() {
    //     if (this.notices[this.noticeIndex]) {
    //         return this.notices[this.noticeIndex];
    //     } else {
    //         return null;
    //     }
    // },
    noticeStr() {
      let list = null;
      if (JSON.parse(localStorage.getItem("marqueeList"))) {
        list = JSON.parse(localStorage.getItem("marqueeList"));
      } else {
        list = this.$store.state.main.marqueeList;
      }
      return list;
    },
    dialogTopImg() {
      if (this.$config.newQP || this.$config.blackTheme) {
        return require("@src/assets/img/marquee-dialog-topQP.png");
      } else if (this.$config.home === "qp" || this.$config.blush) {
        if (this.$config.name === 'betnew') return require('@src/assets/img/marquee-dialog-topBetnew.png')
        return require("@src/assets/img/marquee-dialog-topC.png");
      } else if (this.$config.home === "vns") {
        return require("@src/assets/img/marquee-dialog-topB.png");
      } else if (this.$config.home === "amhg") {
        return require("@src/assets/img/marquee-dialog-topD.png");
      } else if(this.$config.home === "cpxpj") {
        return require("@src/assets/img/marquee-dialog-topC.png");
      } else if(this.$config.home === "aqvns") {
        return require("@src/assets/img/marquee-dialog-top-aqvns.png");
      } else {
        return require("@src/assets/img/marquee-dialog-topA.png");
      }
    },
  },
  watch: {
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
    "$store.state.main.marqueeDialog"(newVal) {
      if (newVal) {
        setTimeout(() => {
          if (this.$refs.marqueeDialog) {
            new BScroll(this.$refs.marqueeDialog, {
              scrollY: true,
              click: true,
            });
          }
        }, 500);
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.getDialogNotice();
    }, 200);

    this.getQpNotices();
  },
  methods: {
    getQpNotices() {
      this.$store.state.main.showDialog.home[
        localStorage.token ? "login" : "noLogin"
      ] = false;
      this.$store
        .dispatch("main/getQpNotices", {
          status: localStorage.token ? 2 : 1,
        })
        .then((res) => {
          if (res.code === 200) {
            let qpNotices = null;
            if (res.data.data.length) {
              qpNotices = res.data.data.filter((item) => {
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
            this.$store.commit("main/marqueeList", qpNotices);
            localStorage.setItem("marqueeList", JSON.stringify(qpNotices));
          }
        })
        .catch(() => {
          console.warn("发生错误!");
        });
    },
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
          this.$store.commit("main/setClosedNoticeDialog", true);
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
      if (this.noticeContent) {
        if (this.noticeIndex >= this.notices.length) {
          return false;
        }
        if (
          !this.$store.state.main.closedNoticeDialog &&
          Number(localStorage["noticeId"]) !==
            Number(this.noticeContent.orderId)
        ) {
          this.showNoticeDialog = true;
        }
        const noticeIndex = this.noticeIndex;
      }
    },
    getDialogNotice() {
      this.$store.state.main.showDialog.home[
        localStorage.token ? "login" : "noLogin"
      ] = false;
      this.$store
        .dispatch("main/getPopups", {
          position: 1,
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
              if (this.notices[this.noticeIndex]) {
                this.noticeContent = this.notices[this.noticeIndex];
              }
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
    closeMarquee() {
      this.$store.commit("main/marqueeDialog", false);
    },
  },
  beforeDestroy() {
    this.domResize.remove(this.$refs["notice-scroll-content"]);
    this.show = this.showNoticeDialog = false;
    clearInterval(this.getDateTimer);
  },
};
</script>

<style lang="less" scoped>
.newUser {
  position: absolute;
  left: 50%;
  top: 38%;
  transform: translate3d(-50%, -50%, 0) scale(0);
  transition: all 400ms;
  transform-origin: top;
  .black-newUser {
    width: 7.14rem;
    height: 7.9rem;
    margin: 0 auto;
    .black-box {
      width: 100%;
      height: 100%;
    }
    .black-cancel {
      position: absolute;
      bottom: 0.45rem;
      left: 0.4rem;
      width: 2.84rem;
      height: 0.75rem;
    }
    .black-primary {
      position: absolute;
      bottom: 0.35rem;
      right: 0.5rem;
      width: 2.9rem;
      height: 0.84rem;
    }
  }
}

.marqueeDialog {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 6.86rem;
  max-height: 10.85rem;
  background-color: #fff;
  border-radius: 0.2rem;
  overflow: hidden;
  font-size: 0.28rem;
  color: #333333;
  text-align: left;
  transform: translate3d(-50%, -50%, 0) scale(0);
  transition: all 400ms;
  transform-origin: top;
  &.qp-marqueeDialog {
    background: rgba(0, 0, 0, 0.77);
    .cont {
      color: #ffffff;
      li {
        border-bottom: 0.01rem solid #666;
      }
    }
  }
  &.blush-marqueeDialog {
    background: linear-gradient(0deg, #71020b, #3d0c0d);
    .cont {
      color: #ffffff;
      li {
        border-bottom: 0.01rem solid #666;
      }
    }
  }
  .tit {
    width: 100%;
    height: 1rem;
    margin-bottom: 0.26rem;

    img {
      width: 100%;
      height: 100%;
    }

    .close-btn {
      position: absolute;
      top: 0.18rem;
      right: 0.32rem;
      width: 0.632rem;
      height: 0.632rem;
    }
  }

  .cont {
    padding: 0 0.24rem;
    max-height: 7.85rem;
    overflow: hidden;

    ul {
      li {
        border-bottom: 0.01rem solid #e7e7e7;
        padding: 0 0 0.2rem 0;

        .time {
          text-align: right;
          font-size: 0.24rem;
          color: #666666;
          margin-top: 0.2rem;
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}

.aqvns-marqueeDialog{
  .cont{
    ul{
      li{
        padding: 0.2rem 0;
        line-height: 0.45rem;
        font-weight: 500;
      }
    }
  }
}

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
    &.blush-close-box {
      img {
        width: 0.64rem;
        margin-top: 0.28rem;
      }
    }
  }
}

.notice-dialog-minx,
.notice-dialog {
  width: 6.62rem;
  box-sizing: border-box;
  padding: 0;
  position: absolute;
  top: 48%;
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
    font-size: 0.28rem;
    max-height: 7.5rem;
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
        background: #e9b741 !important;
      }
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
    .vns-header {
      background: linear-gradient(90deg, #6be5c9, #58c1bf);
    }

    .xpj-header {
      background-color: #2ea6ee;
    }
  }

  .vns-dialog-header {
    padding: 0;
    height: 1.1rem;

    > div {
      font-size: 0.34rem;
      border-radius: 0;
      color: #fff;
      margin-top: 0.2rem;
      height: 0.9rem;
      line-height: 0.9rem;
      font-size: 0.38rem;
    }
  }

  .xpj-dialog-header {
    height: 1.2rem;

    > div {
      font-size: 0.34rem;
      height: 0.8rem;
      line-height: 0.8rem;
      border-radius: 0.1rem;
      color: #fff;
      margin-top: 0.2rem;
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
    .con-text {
      color: #fff;
    }
  }
  .notice-dialog-footer {
    background-color: rgba(0, 0, 0, 0.8);
  }
  .top-img {
    background-color: #000;
  }
}

.notice-dialog-aqvns {
  .notice-dialog-footer {
    > div {
      width: 2.46rem;
      height: 0.72rem;
      line-height: 0.72rem;
      background: #DDC2A8;
      border-radius: 0.1rem;
      font-size: 0.34rem;
      color: #fff;
    }
  }

}


.isFull {
  width: 100%;
}

.show .notice-dialog,
.show .notice-dialog-pic,
.show .notice-dialog-minx,
.show .marqueeDialog,
.show .newUser{
  transform: translate3d(-50%, -50%, 0) scale(1) !important;
}
</style>
