<template>
  <view-page full-box class="view-page theme-main-bg-1">
    <title-header
      v-if="!isApp"
      slot="header"
      title="优惠活动"
      class="theme-header-bg theme-header-bottom"
    ></title-header>
    <div slot="content" class="theme-main-bg-2">
      <template>
        <div
          class="content"
          :class="[
            { test1: $config.activityType === 'test1' },
            { 'newqp-content': $config.newQP || $config.blackTheme },
            { 'blush-content': $config.blush },
          ]"
          v-if="activityContent.description"
        >
          <div class="box" v-if="$config.activityType === 'klk'">
            <img class="img" alt :src="activityContent.image.mobile" />
            <div class="box-title">
              <div class="title1">{{ activityContent.title }}</div>
              <div class="title2">{{ activityContent["child_title"] }}</div>
              <button
                :class="[{ openLink: !activityContent.showJump }, 'btn-1']"
              >
                显示详情
              </button>
              <button
                class="btn-2"
                v-if="activityContent.showJump"
                @click.stop="activeJumpUrl(activityContent.jump_button_url)"
              >
                {{ activityContent.jump_button_name }}
              </button>
            </div>
          </div>
          <div class="test1" v-else-if="$config.activityType === 'test1'">
            <img class="img" alt="" :src="activityContent.image.mobile" />
            <span class="title">{{ activityContent.title }}</span>
            <p class="time" v-if="activityContent.offline_time">
              <span>{{ activityContent.online_time }}</span
              >-<span>{{ activityContent.offline_time }}</span>
            </p>
            <p class="time" v-else>永久上架</p>
          </div>
          <img class="img" v-else alt :src="activityContent.image.mobile" />
          <div class="contents" v-if="activityContent['desc_type'] === 'pic'">
            <img :src="activityContent.description.mobile" alt="加载失败" />
          </div>
          <div
            class="contents theme-main-bg-1 no-box-shadow"
            :class="
              $config.name == 'kkqp' ||
              $config.name == 'amxpj' ||
              $config.name == '99qp'
                ? 'blackStyle'
                : 'commonStyle'
            "
            v-else
            v-html="activityContent.description.mobile"
          ></div>
        </div>
      </template>
    </div>
    <div slot="static">
      <pub-dialog v-model="showDialog" :maskClose="true" style="z-index: 9999">
        <div :class="['dialog-box', { checklist: dialogStatus === 'check' }]">
          <div class="close-dialog" @click="showDialog = false">
            <img src="@src/assets/img/activity/close-dialog.png" alt />
          </div>
          <div class="toast" v-if="dialogStatus === 'toast'">
            {{ toastTextContent }}
          </div>
          <div class="check" v-if="dialogStatus === 'check'">
            <scroll-area class="check-scroll">
              <ul>
                <li>
                  <span>会员帐号</span>
                  <span>申请时间</span>
                  <span>申请状态</span>
                </li>
                <div v-if="checkList.length" class="checklist">
                  <li v-for="(item, i) in checkList" :key="i">
                    <span>{{ item.userName }}</span>
                    <span>{{
                      dayJs.unix(item.created_at).format("YYYY-MM-DD HH:mm:ss")
                    }}</span>
                    <span :class="['status-span', item.requirement_status]">{{
                      statusText(item.requirement_status)
                    }}</span>
                  </li>
                </div>
                <div v-else class="noCheckList">未查询到信息</div>
              </ul>
            </scroll-area>
          </div>
        </div>
      </pub-dialog>
    </div>
    <ios-alert
      slot="static"
      v-model="showToast"
      :width="6"
      class="saveIosAlert"
      :class="{blackIosAlert:$config.newQP || $config.blackTheme || $config.blush}"
      ok-text="知道了"
      :show-no="false"
      :ok-callback="closeToast"
      :themeBg="true"
    >
      <div class="title ios-title" slot="title">
        <h2 class="theme-color-white">提示</h2>
        <h4 class="theme-color-white" style="font-size: 0.33rem">
          {{ toastTextContent }}
        </h4>
      </div>
    </ios-alert>
  </view-page>
</template>

<script>
import scrollArea from "@src/components/scroll-area";
export default {
  name: "ActivityContent",
  data() {
    return {
      id: "",
      activityContent: {},
      showDialog: false,
      toastTextContent: "",
      dialogStatus: "",
      checkList: [],
      showToast: false,
    };
  },
  components: {
    scrollArea,
  },
  created() {
    this.id = this.$route.query.id;
    this.$store.dispatch("main/activityContent", {
      id: this.id,
      callback: (res) => {
        if (res && res.code === 200) {
          const activityContent = res.data;
          try {
            activityContent.image = JSON.parse(activityContent.image);
            activityContent.online_time = activityContent.online_time
              ? this.formatDate(activityContent.online_time)
              : activityContent.online_time;
            activityContent.offline_time = activityContent.offline_time
              ? this.formatDate(activityContent.offline_time)
              : false;
            activityContent.description = JSON.parse(
              activityContent.description
            );
          } catch (e) {
            activityContent.image = { mobile: "" };
            activityContent.description = { mobile: "" };
          }
          if (
            activityContent.jump_button_name &&
            activityContent.jump_button_url
          ) {
            if (activityContent.jump_switch) {
              this.$store.state.user.userInfo
                ? (activityContent["showJump"] = true)
                : (activityContent["showJump"] = false);
            } else {
              activityContent["showJump"] = true;
            }
          } else {
            activityContent["showJump"] = false;
          }
          this.activityContent = activityContent;
          // 935棋牌添加按钮
          this.$nextTick(() => {
            const _Elements = document.querySelectorAll(".applyBtn");
            const Imgs = `
              <img src="${require("@src/assets/img/activity/apply-way.png")}" class="applyWay">
              <img src="${require("@src/assets/img/activity/click-get.png")}" class="applyBtnImg">
            `;
            const checkImg = `
              <img src="${require("@src/assets/img/activity/check-btn.png")}" class="checkBtn">
            `;
            _Elements.forEach((element) => {
              element.innerHTML = Imgs;
              // 排除充值和洗码
              if (
                element.attributes.id.value !== "A999" &&
                element.attributes.id.value !== "A888"
              ) {
                element.innerHTML += checkImg;
                element.children[2].onclick = () => {
                  this.checkPlan(
                    element.attributes.id.value,
                    element.children[2]
                  );
                };
              }
              element.children[1].onclick = () => {
                this.getHandle(
                  element.attributes.id.value,
                  element.children[1]
                );
              };
            });
            const applyBtn = document.querySelectorAll(".applyButton");
            const applyImg = `<img src="${require("@src/assets/img/activity/apply.gif")}" class="applyBtnImg">`;
            applyBtn.forEach((element) => {
              element.innerHTML = applyImg;
              // 排除充值和洗码
              if (
                element.attributes.id.value !== "A999" &&
                element.attributes.id.value !== "A888"
              ) {
              }
              element.children[0].onclick = () => {
                this.getHandle1(
                  element.attributes.id.value,
                  element.children[0]
                );
              };
            });
            const applyBtn1 = document.querySelectorAll(".applyButton1");
            const applyImg1 = `<img src="${require("@src/assets/img/activity/redbao.png")}" class="applyBtnImg">`;
            applyBtn1.forEach((element) => {
              element.innerHTML = applyImg1;
              // 排除充值和洗码
              if (
                element.attributes.id.value !== "A999" &&
                element.attributes.id.value !== "A888"
              ) {
              }
              element.children[0].onclick = () => {
                this.getHandle1(
                  element.attributes.id.value,
                  element.children[0]
                );
              };
            });
            const applyTexts = document.querySelectorAll(".applyText");
            applyTexts.forEach((element) => {
              element.onclick = () => {
                this.getHandle2(
                  element.attributes.id.value,
                  element.children[0]
                );
              };
            });
            /* 下载 */
            const downLinks = document.querySelectorAll('.downLink')
            let ua = window.navigator.userAgent.toLowerCase()
            downLinks.forEach((element) => {
              if (localStorage.config) {
                if (/iphone/.test(ua) || /ipad/.test(ua)) {
                  element.href = this.$config.download.ios
                } else if (/android/.test(ua)) {
                  element.href = this.$config.download.android
                } else {
                  element.href = '/static/' + this.$config.name + '/html/download/index.html'
                }
              }
            })
          })
        } else {
          this.toastText(res.message, "middle")
        }
      },
    });
  },
  methods: {
    closeToast() {
      this.showToast = false;
    },
    activeJumpUrl(link) {
      window.open(link);
    },
    getHandle(id, element) {
      element.classList.add("applyBtnClick");
      setTimeout(() => {
        element.classList.remove("applyBtnClick");
      }, 600);
      if (localStorage.token) {
        switch (id) {
          // 充值
          case "A999":
            this.nativeGoRecharge(1);
            break;
          //洗码
          case "A888":
            this.nativeGoRecharge(2);
            break;
          default:
            this.dialogStatus = "toast";
            this.showToast = true;
            this.$store
              .dispatch("main/applyActivity", id)
              .then((res) => {
                if (res.code === 200) {
                  this.toastTextContent = res.data;
                } else {
                  this.toastTextContent = res.message;
                }
              })
              .catch((err) => {
                console.log(err);
              });
        }
      } else {
        // this.$router.push("/admin/login");
        this.toastText("请先登录", "middle");
      }
    },
    getHandle1(id, element) {
      element.classList.add("applyBtnClick");
      setTimeout(() => {
        element.classList.remove("applyBtnClick");
      }, 600);
      /* this.toastText('庆祝欧洲杯6月12日00:00正式开始申请', 'middle')
      return false */
      if (localStorage.token) {
        switch (id) {
          // 充值
          case "A999":
            this.nativeGoRecharge(1);
            break;
          // 洗码
          case "A888":
            this.nativeGoRecharge(2);
            break;
          default:
            this.dialogStatus = "toast";
            this.showToast = true;
            this.$store
              .dispatch("main/applyActivity", id)
              .then((res) => {
                if (res.code === 200) {
                  this.toastTextContent = res.data;
                } else {
                  this.toastTextContent = res.message;
                }
              })
              .catch((err) => {
                console.log(err);
              });
        }
      } else {
        this.$router.push("/admin/login");
        // this.toastText('请先登录', 'middle')
      }
    },
    getHandle2(id, element) {
      /* this.toastText('庆祝欧洲杯6月12日00:00正式开始申请', 'middle')
      return false */
      if (localStorage.token) {
        switch (id) {
          // 充值
          case "A999":
            this.nativeGoRecharge(1);
            break;
          // 洗码
          case "A888":
            this.nativeGoRecharge(2);
            break;
          default:
            this.$store
              .dispatch("main/applyActivity", id)
              .then((res) => {
                if (res.code === 5011 || res.code === 5011.1) {
                  this.$store.commit("main/setShowBindPhone", true);
                  this.$store.commit("main/setActiveId", id);
                } else if (res.code === 5012 || res.code === 5013) {
                  this.$store.commit("main/setActiveId", 0);
                  this.$store.commit("main/setBindBankMsg", res.message);
                  this.$store.commit("main/setBindBank", true);
                  this.$store.commit("main/setBindBankId", res.code);
                } else if (res.code === 200) {
                  this.toastTextContent = res.data;
                  this.dialogStatus = "toast";
                  this.showToast = true;
                  this.$store.commit("main/setActiveId", 0);
                } else {
                  this.toastTextContent = res.message;
                  this.dialogStatus = "toast";
                  this.showToast = true;
                  this.$store.commit("main/setActiveId", 0);
                }
              })
              .catch((err) => {
                console.log(err);
              });
        }
      } else {
        this.$router.push("/admin/login");
        // this.toastText('请先登录', 'middle')
      }
    },
    checkPlan(id, element) {
      element.classList.add("applyBtnClick");
      setTimeout(() => {
        element.classList.remove("applyBtnClick");
      }, 600);
      if (localStorage.token) {
        this.dialogStatus = "check";
        this.showDialog = true;
        this.$store
          .dispatch("main/activityApplyListShow", id)
          .then((res) => {
            if (res.code === 200 && res.data.data) {
              this.checkList = res.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // this.$router.push("/admin/login");
        this.toastText("请先登录", "middle");
      }
    },
    statusText(status) {
      switch (status) {
        case "yes":
          return "成功";
        case "no":
          return "失败";
        default:
          return "待审核";
      }
    },
    formatDate(date) {
      let myDate = new Date(date * 1000);
      let y = myDate.getFullYear();
      let m = myDate.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = myDate.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "/" + m + "/" + d;
    },
  },
};
</script>

<style lang="less" scoped>
.saveIosAlert {
  .ios-title {
    padding-top: 0.26rem !important;
    h2 {
      color: #333333;
      font-size: 0.38rem;
      font-family: PingFangTC-Regular, PingFangTC;
    }
    h4 {
      color: #010000;
      font-size: 0.32rem;
      font-family: PingFangTC-Regular, PingFangTC;
      font-weight: 0 !important;
      margin-top: 0.24rem;
    }
  }
  /deep/.ios-alert-footer {
    border-top: none !important;
    a {
      color: #fff !important;
    }
  }
  &.blackIosAlert {
    /deep/.ios-alert-footer {
      border-top: 0.02rem solid #333 !important;
    }
  }
}
.contents {
  padding: 2%;
  background: #fff;
  border-radius: 10px;
  margin-top: 0.2rem;
  /*margin: 0.2rem auto;*/
  box-shadow: 5px 5px 10px #ccc;
}

.view-page {
  /deep/ .view-page-content {
    background-color: #fff;
  }

  /deep/ .content {
    flex: 1;
    padding: 0.2rem;
    /*padding-bottom: 0.2rem;*/
    /*margin: 0.2rem 0;*/
    line-height: 1.5;
    &.test1 {
      padding: 0.2rem 0;
      .contents {
        margin: 0.1rem 0.2rem 0.2rem;
      }
    }

    .box {
      display: flex;
      align-items: center;
      padding: 0.1rem;
      background: #f3f3f3;
      border: 1px solid #dadada;
      border-radius: 0.1rem;

      .img {
        width: 55%;
        border-radius: 0.1rem;
        display: block;
      }

      .box-title {
        width: 45%;
        padding-left: 0.2rem;
        display: block;
        vertical-align: middle;
        line-height: 1;
        text-align: left;

        .title1 {
          color: #fd4746;
          font-size: 0.3rem;
          line-height: 1.8;
        }

        .title2 {
          color: #9c6a39;
          font-size: 0.25rem;
          line-height: 2.2;
        }

        .btn-1,
        .btn-2 {
          background: #bb9a55;
          color: #ffffff;
          width: 1.4rem;
          height: 0.75rem;
          line-height: 0.75rem;
          text-align: center;
          border-radius: 0.1rem;
          border: none;
          font-size: 0.3rem;
          &.btn-1 {
            float: left;
            &.openLink {
              float: right;
            }
          }
          &.btn-2 {
            float: right;
          }
        }
      }
    }
    .test1 {
      position: relative;
      margin-bottom: 0.2rem;
      box-sizing: border-box;
      width: 100%;
      display: block;
      border: 0.02rem solid #ebedf0;
      border-radius: 0.1rem;
      overflow: hidden;
      .img {
        vertical-align: middle;
        /*margin-bottom: 8px;*/
        /*border-radius: 8px;*/
      }

      .title {
        position: absolute;
        right: 0.5rem;
        top: 0.3rem;
        text-align: right;
        font-family: Microsoft YaHei;
        font-size: 0.3rem;
        font-weight: 700;
        line-height: unset;
        height: auto;
        color: #333333;
        padding-left: 0;
        /*margin-bottom: 4px;*/
      }
      .time {
        position: absolute;
        right: 0.5rem;
        top: 0.74rem;
        text-align: right;
        font-family: Microsoft YaHei;
        font-size: 12px;
        color: #6c7c9d;
      }
      border: none;
      /*border-bottom: 0.02rem solid #ebedf0;*/
      border-radius: unset;
      margin-bottom: 8px;
    }

    .red {
      color: #ff0000;
      font-weight: bold;
    }

    img {
      width: 100%;
    }

    h4,
    h2 {
      font-size: 0.26rem;
      margin: 0.3rem 0 0.1rem;
      font-weight: bold;
      text-align: left;
      color: #000;
    }

    h4:first-child,
    h2:first-child {
      margin: 0.1rem 0 0.1rem;
    }

    p {
      font-size: 0.24rem;
      margin: 0;
      font-weight: bold;
      text-align: left;
      color: #000;
      line-height: 1.8;
    }

    .commonStyle {
      table {
        width: 100%;
        font-size: 0.28rem;
        margin-bottom: 0.2rem;
        text-align: center;
        border-spacing: 0;
        border-collapse: collapse;
        color: #000000;

        .firstRow {
          background: #dcdcdc;
          color: #000000;
          border-bottom: 1px solid #bdbfc2;

          td {
            font-weight: bold;
          }
        }

        td {
          padding: 5px 0;
          border: 1px solid #bdbfc2;
          vertical-align: middle;
          font-weight: bold;
          font-size: 0.24rem;
        }
      }
    }
    .blackStyle {
      table {
        width: 100%;
        font-size: 0.28rem;
        margin-bottom: 0.2rem;
        text-align: center;
        // border: 1px solid #443828;
        border-spacing: 0;
        border-collapse: collapse;

        .firstRow {
          background: #2a2928;
          background: linear-gradient(#443828, #a38c6c);
          color: #fff !important;
          border-bottom: 1px solid#443828;

          td {
            font-weight: bold;
          }
        }

        td {
          padding: 5px 0;
          border: 1px solid #443828;
          vertical-align: middle;
          font-weight: bold;
          font-size: 0.24rem;
        }
      }
    }
    .text {
      p {
        position: relative;
        padding-left: 0.3rem;
        .num {
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }
    @keyframes btnScale {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
      }
    }
    .applyBtn {
      width: 100%;
      display: block;
      &::after {
        content: "020";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
        zoom: 1;
      }
      .applyBtnImg {
        width: 2.7rem;
        transform: scale(1);
        vertical-align: top;
        float: left;
        margin-left: 0.2rem;
        &.applyBtnClick {
          animation: btnScale 0.6s forwards;
        }
      }
      .checkBtn {
        width: 2.7rem;
        float: right;
        transform: scale(1);
        vertical-align: top;
        &.applyBtnClick {
          animation: btnScale 0.6s forwards;
        }
      }
      .applyWay {
        width: 0.7rem;
        float: left;
      }
    }
    .applyButton {
      width: 100%;
      display: block;
      &::after {
        content: "020";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
        zoom: 1;
      }
      .applyBtnImg {
        width: 1.7rem;
        transform: scale(1);
        vertical-align: top;
        &.applyBtnClick {
          animation: btnScale 0.6s forwards;
        }
      }
    }
    .applyButton1 {
      width: 100%;
      display: block;
      &::after {
        content: "020";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
        zoom: 1;
      }
      .applyBtnImg {
        width: 1.2rem;
        transform: scale(1);
        vertical-align: top;
        &.applyBtnClick {
          animation: btnScale 0.6s forwards;
        }
      }
    }
    &.newqp-content {
      .title {
        color: #fff;
      }
      h4,
      h2 {
        color: #fff;
      }
      p {
        color: #fff;
      }
      table {
        color: #fff;
        .firstRow {
          color: #000;
        }
      }
    }
    &.blush-content {
      .firstRow {
        background: linear-gradient(
          180deg,
          #95000d 0%,
          #72010b 100%
        ) !important;
        td {
          color: #fbd67a;
        }
      }
      .title {
        color: #fff;
      }
      h4,
      h2 {
        color: #fff;
      }
      p {
        color: #fff;
      }
      table {
        color: #fff;
        .firstRow {
          color: #000;
        }
      }
    }
  }
  .dialog-box {
    width: 92%;
    height: 3.5rem;
    position: fixed;
    left: 50%;
    top: 50%;
    background-image: url("../../assets/img/activity/check-bg.png");
    background-size: 100% 100%;
    border: 1px solid rgba(72, 60, 46, 1);
    border-radius: 4px;
    font-size: 0.24rem;
    color: #000000;
    text-align: center;
    transform: translate3d(-50%, -50%, 0) scale(0);
    // transition: all 400ms;
    transform-origin: top;
    &.checklist {
      height: 4.5rem;
    }
    .close-dialog {
      width: 0.5rem;
      height: 0.5rem;
      position: absolute;
      top: -0.25rem;
      right: -0.25rem;
      font-size: 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .toast {
      width: 86%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 22px;
      color: #dab78a;
      text-align: center;
      word-wrap: break-word;
      word-break: break-all;
    }
    .check {
      width: 85%;
      height: 82%;
      margin: 6% auto 0;
      &::-webkit-scrollbar {
        display: none;
      }
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      .check-scroll {
        height: 100%;
        ul {
          width: 100%;
          text-align: center;
          padding: 0;
          box-sizing: border-box;
          border-top: 1px solid #433a30;
          & > li {
            &:first-child {
              span {
                color: #dab78a;
              }
            }
          }
          li {
            list-style-type: none;
            overflow: hidden;
            border: 1px solid #433a30;
            border-top: none;
            span {
              float: left;
              box-sizing: border-box;
              color: #fff;
              height: 0.55rem;
              line-height: 0.55rem;
              font-size: 0.24rem;
              &:nth-child(1),
              &:nth-child(3) {
                width: 27%;
              }
              &:nth-child(2) {
                width: 46%;
                border-left: 1px solid #433a30;
                border-right: 1px solid #433a30;
              }
              &.status-span {
                color: #fb374b;
              }
              &.yes {
                color: #59a8c9;
              }
              &.no {
                color: #777;
              }
            }
          }
          .noCheckList {
            width: 100%;
            height: 1.5rem;
            line-height: 1.5rem;
            color: #fff;
            border: 1px solid #433a30;
            border-top: none;
            box-sizing: border-box;
            font-size: 0.28rem;
          }
        }
      }
    }
  }
  .show .dialog-box {
    transform: translate3d(-50%, -50%, 0) scale(1) !important;
  }
}
</style>
