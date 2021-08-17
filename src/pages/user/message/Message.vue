<template>
  <view-page
    :class="[
      'message-center',
      'theme-header-bg',
      { newqpStyle: $config.newQP || $config.blackTheme },
      { blushStyle: $config.blush },
      { 'aqvns-message': $config.isAqvns },
      { 'js85-message': $config.name === 'js85' },
    ]"
    ref="view-page"
    :full-box="isShowFixed"
    :load-more="tabIndex !== 1"
    @load-top="onRefresh"
    @load-down="onLoadMore"
    @scroll-height-change="scrollHeight = $event"
  >
    <title-header
      title="信息中心"
      back-event
      @back="onBack"
      slot="header"
      class="theme-header-bottom theme-header-bg"
    ></title-header>
    <div slot="header-static" v-if="!data">
      <van-tabs
        v-model="tabIndex"
        :line-height="2"
        class="theme-after-border-color"
      >
        <van-tab>
          <p class="tab-title" slot="title">
            <i>已发信息</i>
            <i class="msg-count" v-show="msgCount['replyUnReadCount']">{{
              msgCount["replyUnReadCount"]
            }}</i>
          </p>
        </van-tab>
        <van-tab>
          <p class="tab-title" slot="title">
            <i>编写信息</i>
          </p>
        </van-tab>
        <van-tab>
          <p class="tab-title" slot="title">
            <i>系统信息</i>
            <i class="msg-count" v-show="msgCount['systemUnReadCount']">{{
              msgCount["systemUnReadCount"]
            }}</i>
          </p>
        </van-tab>
      </van-tabs>
    </div>
    <div class="body" slot="content">
      <transition-group :name="animation" class="animation-box">
        <div
          key="page-list"
          v-if="!data"
          :style="{
            height: isHeight ? scrollHeight + 'px' : '100%',
            width: '100%',
          }"
        >
          <div class="tab-content">
            <transition :name="animationTab" class="content-box">
              <div v-if="tabIndex == 0">
                <div
                  class="no-data"
                  v-show="userNoMore && userMessage.length === 0"
                >
                  <img
                    style="width: 100%; margin-top: 1.6rem"
                    :src="noDataImg"
                    alt=""
                  />
                  <p class="info theme-color-white">暂无信息</p>
                </div>
                <div class="msg-list theme-gradient-bg-1">
                  <div
                    v-for="(item, i) in userMessage"
                    :key="item.id + '_' + i"
                    is-link
                    class="list-item theme-after-border-color"
                    @touchstart="touchStart"
                    @touchend.capture="touchEnd"
                  >
                    <span
                      class="more-icon icon iconfont h5-icon-icon-more-"
                    ></span>
                    <div class="cell-left theme-gradient-bg">
                      <div
                        :class="{
                          'msg-item': true,
                          ok: item['received'] && item['received'].length,
                        }"
                        @click="data = item"
                      >
                        <div class="flex">
                          <span
                            v-if="
                              item['status'] === 'no' ||
                              (item['received'].length &&
                                item['unReadCount'] > 0)
                            "
                            class="
                              item-icon
                              fa fa-fw fa-envelope
                              theme-color theme-color-yellow
                            "
                            ><i
                              class="msg-count"
                              v-show="item['unReadCount']"
                              >{{ item["unReadCount"] }}</i
                            ></span
                          >
                          <span
                            v-else-if="item['status'] === 'yes'"
                            class="item-icon fa fa-fw fa-envelope-open"
                          >
                            <i class="msg-count" v-show="item['unReadCount']">{{
                              item["unReadCount"]
                            }}</i>
                          </span>
                          <div class="flex-right">
                            <span class="title flex-1 theme-color-white">{{
                              item["received"] && item["received"].length
                                ? "站长已回复"
                                : item["status"] === "yes"
                                ? "站长已查看"
                                : "站长未查看"
                            }}</span>
                            <span
                              class="time theme-color-gray-10"
                              style="float: right"
                              >{{
                                dayJs
                                  .unix(item["send_time"])
                                  .format("YYYY-MM-DD")
                              }}</span
                            >
                          </div>
                        </div>
                        <p class="content theme-color-gray-10">
                          {{ item.content }}
                        </p>
                      </div>
                    </div>
                    <!-- <div class="link-right">
                        <p class="link-delete" @click="deleteLink(item,i)">删除</p>
                      </div> -->
                  </div>
                </div>
              </div>
              <div v-if="tabIndex == 1">
                <div class="edit">
                  <van-field
                    style="padding: 5px; height: auto !important"
                    class="theme-main-bg theme-border-color"
                    v-model="text"
                    @blur="blurFun"
                    @focus="focusFun"
                    maxlength="2000"
                    placeholder="请输入您的问题，我们会第一时间回复。谢谢"
                    rows="10"
                    type="textarea"
                  ></van-field>
                  <van-button
                    type="primary"
                    block
                    @click="onSubmit"
                    class="theme-yellow-bg theme-color-black"
                    >提交</van-button
                  >
                </div>
              </div>
              <div v-if="tabIndex == 2">
                <div
                  class="no-data"
                  v-show="systemMessage && systemMessage.length === 0"
                >
                  <img
                    style="width: 100%; margin-top: 1.6rem"
                    :src="noDataImg"
                    alt=""
                  />
                  <p class="info theme-color-white">暂无信息</p>
                </div>
                <ul class="msg-list theme-gradient-bg-1">
                  <li
                    v-for="(item, i) in systemMessage"
                    :key="item.id + '_' + i"
                    class="cell-item theme-after-border-color"
                    is-link
                  >
                    <span
                      class="more-icon icon iconfont h5-icon-icon-more-"
                    ></span>
                    <div
                      class="msg-item"
                      :class="{
                        ok: item['received'] && item['received'].length,
                      }"
                      @click="data = item"
                    >
                      <div class="flex">
                        <span
                          v-if="item['status'] === 'yes'"
                          class="item-icon fa fa-fw fa-envelope-open"
                        ></span>
                        <span
                          v-else
                          class="
                            item-icon
                            fa fa-fw fa-envelope
                            theme-color theme-color-yellow
                          "
                        >
                          <i class="msg-count">{{ 1 }}</i>
                        </span>
                        <div class="flex-right">
                          <span
                            class="title flex-1"
                            :class="[
                              { 'theme-color': item['status'] !== 'yes' },
                              {
                                'theme-color-yellow': item['status'] !== 'yes',
                              },
                              { 'theme-color-white': $config.blush },
                            ]"
                            >{{ item["title"] }}</span
                          >
                          <span class="time theme-color-gray-10">{{
                            dayJs.unix(item["send_time"]).format("YYYY-MM-DD")
                          }}</span>
                        </div>
                      </div>
                      <p class="content theme-color-gray-10">
                        {{ item.content }}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </transition>
          </div>
        </div>
        <ul class="page-item animation-box" key="page-item" v-else>
          <li class="msg-item theme-gradient-bg-3 theme-noborder">
            <p
              class="content"
              :class="[
                { 'theme-color-gray': $config.blackTheme },
                { 'theme-color-white': $config.blush },
              ]"
            >
              {{ data.content }}
            </p>
            <p class="time">
              {{ dayJs.unix(data["send_time"]).format("YYYY-MM-DD HH:mm:ss") }}
            </p>
          </li>
          <li
            class="msg-item theme-gradient-bg-3 theme-noborder"
            v-for="(item, i) in data['received']"
            :key="item.id + '_' + i"
          >
            <p class="title">
              <span class="fa fa-fw fa-envelope"></span>
              <span>{{ item.title }}</span>
            </p>
            <p class="content">{{ item.content }}</p>
            <p class="time">
              {{ dayJs.unix(item["send_time"]).format("YYYY-MM-DD HH:mm:ss") }}
            </p>
          </li>
        </ul>
      </transition-group>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "Message",
  data() {
    return {
      isHeight: false,
      scrollHeight: 0,
      data: null,
      tabIndex: 0,
      text: "",
      submitting: false,
      userMessage: [],
      userPage: 0,
      isShowFixed: true,
      userPageSize: 20,
      userLoading: false,
      userNoMore: false,
      systemMessage: [],
      systemPage: 0,
      systemPageSize: 20,
      systemLoading: false,
      systemNoMore: false,
      animation: "",
      animationTab: "",
    };
  },
  watch: {
    tabIndex(now, old) {
      this.animationTab = now > old ? "slide-left" : "slide-right";
      this.$nextTick(() => {
        if (now === 0) {
          this.onPullingDownUser(true);
          if (
            this.$mobileDevice.isIOS &&
            this.$mobileDevice.browserName === "UCBrowser" &&
            this.$mobileDevice.osVersion === "12.4"
          ) {
            this.isShowFixed = true;
          }
        } else if (now === 2) {
          this.onPullingDownSystem(true);
          if (
            this.$mobileDevice.isIOS &&
            this.$mobileDevice.browserName === "UCBrowser" &&
            this.$mobileDevice.osVersion === "12.4"
          ) {
            this.isShowFixed = true;
          }
        } else if (now === 1) {
          if (
            this.$mobileDevice.isIOS &&
            this.$mobileDevice.browserName === "UCBrowser" &&
            this.$mobileDevice.osVersion === "12.4"
          ) {
            this.isShowFixed = false;
          }
        }
        this.$refs["view-page"] && this.$refs["view-page"].refresh();
      });
    },
    data() {
      this.animation = this.data ? "slide-left" : "slide-right";
      if (this.data && this.data.id) {
        if (this.tabIndex === 0 && this.data["unReadCount"]) {
          this.data["unReadCount"] = 0;
          this.$store.dispatch("user/messageRead", this.data.id).then();
        } else if (this.tabIndex === 2) {
          this.data["status"] = "yes";
          this.$store.dispatch("user/messageDetail", this.data.id).then();
        }
      }
    },
  },
  computed: {
    msgCount() {
      return this.$store.state.user.msgCount;
    },
    noDataImg() {
      if (this.$config.newQP || this.$config.blackTheme ) {
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
  },
  created() {
    if (
      this.$userAgent.includes("iPhone") &&
      this.$userAgent.includes("SogouMobileBrowser") &&
      this.$mobileDevice.osVersion === "12.4.1"
    ) {
      //解决iphone x 12.4.1 搜狗浏览器显示不全
      this.isHeight = true;
    }
    if (this.$route.query.index) {
      this.tabIndex = Number(this.$route.query.index);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.dispatch("user/refreshMsgCount").then();
      setTimeout(() => {
        this.onPullingDownUser(true);
        this.onPullingDownSystem(true);
      }, 0);
    });
  },
  methods: {
    blurFun() {
      if (
        this.$mobileDevice.isIOS &&
        this.$mobileDevice.browserName === "UCBrowser" &&
        this.$mobileDevice.osVersion === "12.4"
      ) {
        //this.isShowFixed = true;
      }
    },
    focusFun() {
      if (
        this.$mobileDevice.isIOS &&
        this.$mobileDevice.browserName === "UCBrowser" &&
        this.$mobileDevice.osVersion === "12.4"
      ) {
        //this.isShowFixed = false;
      }
    },
    //滑动开始
    touchStart(e) {
      this.startX = e.touches[0].clientX;
    },
    //滑动结束
    touchEnd(e) {
      let parentElement = e.currentTarget.parentElement;
      this.endX = e.changedTouches[0].clientX;
      if (parentElement.dataset.type == 0 && this.startX - this.endX > 50) {
        this.restSlide();
        parentElement.dataset.type = 1;
      }
      if (parentElement.dataset.type == 1 && this.startX - this.endX < -50) {
        this.restSlide();
        parentElement.dataset.type = 0;
      }
      this.startX = 0;
      this.endX = 0;
    },
    //判断是否滑动
    checkSlide() {
      let listItems = document.querySelectorAll(".link-item");
      for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].dataset.type == 1) {
          return true;
        }
      }
      return false;
    },
    onRefresh() {
      if (this.tabIndex === 0) this.onPullingDownUser();
      else if (this.tabIndex === 2) this.onPullingDownSystem();
    },
    onLoadMore() {
      if (this.tabIndex === 0) this.onPullingUpUser();
      else if (this.tabIndex === 2) this.onPullingUpSystem();
    },
    onSwipeLeft() {
      if (this.tabIndex + 1 < 3) {
        this.tabIndex++;
      }
    },
    onSwipeRight() {
      if (this.tabIndex > 0) {
        this.tabIndex--;
      }
    },
    onBack() {
      if (this.data) {
        this.data = null;
      } else {
        this.$router.back();
      }
    },
    onPullingDownSystem() {
      this.systemPage = 0;
      this.systemNoMore = false;
      this.loadSystemMessage(true);
    },
    onPullingDownUser() {
      this.userPage = 0;
      this.userNoMore = false;
      this.loadUserMessage(true);
    },
    onPullingUpSystem() {
      this.loadSystemMessage();
    },
    onPullingUpUser() {
      this.loadUserMessage();
    },
    /**
     * 加载用户消息
     */
    loadUserMessage(status) {
      if (this.userNoMore) {
        this.toastText("没有更多", "top");
        this.$refs["view-page"].loaded();
      } else if (!this.userLoading) {
        this.userPage++;
        this.userLoading = true;
        this.$store
          .dispatch("user/loadUserMessage", {
            page: this.userPage,
            pageSize: this.userPageSize,
          })
          .then((res) => {
            if (status) {
              this.userMessage = res.data.data;
            } else {
              this.userMessage = this.userMessage.concat(res.data.data);
            }
            if (res.data.data.length === 0) {
              this.userNoMore = true;
            }
            this.userLoading = false;
            this.$refs["view-page"].loaded();
          })
          .catch((err) => {
            if (err && err.message) {
              // this.toastText(err.message, 'top')
              console.log(err);
            } else {
              this.toastText("加载失败", "top");
            }
            this.userLoading = false;
            this.$refs["view-page"].loaded();
          });
      }
    },
    /**
     * 加载系统消息
     */
    loadSystemMessage(status) {
      if (this.systemNoMore) {
        this.toastText("没有更多", "top");
        this.$refs["view-page"].loaded();
      } else if (!this.systemLoading) {
        this.systemPage++;
        this.systemLoading = true;
        this.$store
          .dispatch("user/loadSystemMessage", {
            page: this.systemPage,
            pageSize: this.systemPageSize,
          })
          .then((res) => {
            if (status) {
              this.systemMessage = res.data.data;
            } else {
              this.systemMessage = this.systemMessage.concat(res.data.data);
            }

            if (res.data.data.length === 0) {
              this.systemNoMore = true;
            }
            this.systemLoading = false;
            this.$refs["view-page"].loaded();
          })
          .catch((err) => {
            if (err && err.message) {
              // this.toastText(err.message, 'top')
              console.log(err);
            } else {
              this.toastText("加载失败", "top");
            }
            this.systemLoading = false;
            this.$refs["view-page"].loaded();
          });
      }
    },
    /**
     * 提交用户消息
     */
    onSubmit() {
      if (!this.text) {
        this.toastText("请输入内容", "top");
      } else if (!this.submitting) {
        this.submitting = true;
        this.$store.state.main.loadingText = "提交中...";
        this.$store
          .dispatch("user/submitMessage", { content: this.text })
          .then((res) => {
            this.text = "";
            if (res.code === 200) {
              this.toastText("发送成功", "top");
            } else {
              this.toastText(res.message, "top");
            }
            this.$store.state.main.loadingText = "";
            this.submitting = false;
          })
          .catch(() => {
            this.$store.state.main.loadingText = "";
            this.submitting = false;
          });
      }
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.newqpStyle {
  /deep/ .van-tabs__nav {
    background-color: #0c0c0c !important;
  }
  /deep/ textarea {
    color: #fff !important;
  }
}
/deep/ .theme-newqp {
  background-color: #fff;
}
.message-center {
  .body {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    .animation-box {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      // display: flex;
      // justify-content: space-between;
      // flex-direction: column;
      // align-items: center;
      .tab-content {
        // width: 100%;
        // flex: 1;
        // position: relative;
      }
    }
  }

  .page-item {
    list-style: none;
    width: 100%;
    justify-content: start;

    .msg-item {
      width: 100%;
      background-color: #ffffff;
      border-bottom: 0.02rem solid hsl(0, 0%, 95%);
      margin-top: 0.1rem;
      .content {
        overflow: hidden;
        width: 100%;
        text-overflow: ellipsis;
        white-space: unset !important;
        box-sizing: border-box;
        text-align: left;
      }

      .time {
        text-align: right;
        color: #777777;
      }

      .title {
        text-align: left;
      }
    }
  }

  /deep/ .van-tabs {
    /*background-color: #f4f4f4;*/
    .van-tabs__line {
      width: 2.5rem !important;
    }
  }
  /deep/.van-cell {
    border-bottom: 0.01rem solid #ebedf0;
  }
  /deep/.van-cell-group > *:not(:first-child)::after {
    border: none;
  }

  /deep/ .van-tab {
    color: #666666;
    .van-tab__text {
      overflow: unset;
    }
  }

  .tab-title {
    position: relative;
    display: inline;

    .msg-count {
      left: 80%;
      top: -0.24rem;
    }
  }

  .no-data {
    width: 100%;
    box-sizing: border-box;
    padding-top: 1.5rem;

    .img {
      width: 100%;
    }

    .info {
      margin-top: 0.5rem;
      color: #777777;
      font-size: 0.28rem;
    }
  }

  .msg-list {
    width: 100%;
    margin-top: 0.24rem;
    box-sizing: border-box;
    background-color: #ffffff;
    .list-item {
      position: relative;
      // border-bottom: 0.03rem solid hsl(0, 0%, 95%) !important;
      &::after {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        right: 0;
        bottom: 0;
        // top: 0;
        left: 0;
        border-bottom: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }
    .list-item:last-child {
      border-bottom: none !important;
    }
    .more-icon {
      color: #adafbb;
      font-size: 0.3rem;
      position: absolute;
      right: 0.1rem;
      top: 0.5rem;
    }
    .cell-item {
      position: relative;
      padding: 0.1rem 0;
      // border-top: 0.03rem solid hsl(0, 0%, 95%) !important;
      &::after {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        right: 0;
        bottom: 0;
        // top: 0;
        left: 0;
        border-bottom: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }
  }

  .msg-item {
    padding: 0.12rem 0.24rem;
    box-sizing: border-box;
    width: 100%;
    font-size: 0.3rem;
    line-height: 0.5rem;
    color: #aaa;

    .item-icon {
      position: absolute;
      font-size: 0.36rem;
      left: 0;
      top: 0.05rem;

      .msg-count {
        top: -0.32rem;
        left: 30%;
      }
    }

    .flex {
      width: 95%;
      position: relative;
      .flex-right {
        text-align: left;
        display: flex;
        margin-left: 0.4rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .flex-1 {
        flex: 1;
      }

      .title {
        text-align: left;
        margin: 0 0.1rem;
        transform: translateY(2px);
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #777777;
      }

      .time {
        transform: translateY(2px);
        white-space: nowrap;
        color: #777777;
      }
    }

    .content {
      overflow: hidden;
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-sizing: border-box;
      text-align: left;
      color: #777777;
      padding-right: 0.24rem;
    }
  }

  .edit {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0.24rem;

    /deep/ .van-cell {
      border-radius: 5px;
    }

    /deep/ .van-cell:not(:last-child)::after {
      border: none;
    }
  }

  .van-button {
    margin-top: 0.24rem;
    border-radius: 5px;
  }
}
.newqpStyle {
  /deep/ .auto-box-header-static {
    .van-hairline--top-bottom {
      &::after {
        border: none !important;
      }
    }
    .van-tabs__nav {
      .van-tab {
        color: #fff;
      }
    }
  }
}
.blushStyle {
  /deep/ .van-tabs__nav {
    background: linear-gradient(0deg, #9d010f, #72010b) !important;
    .van-tab {
      color: #fff;
    }
  }
  /deep/ textarea {
    color: #fff !important;
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 start
.aqvns-message{
  .theme-color{
    color: #C9A786 !important;
  }
  /deep/.van-button{
    background-color: #C9A786 !important;
    border: none;
  }
  /deep/.van-tab--active{
    color: #C9A786 !important;
  }
  /deep/.van-tabs__line{
    background-color: #C9A786 !important;
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 end

// for js85 的 class 使用白色底, 咖啡色系 強制更改樣式 start
.js85-message{
  .content{
    color:#FFFFFF !important;
    padding-right: 0 !important;
  }
}
// for js85 的 class 使用白色底, 咖啡色系 強制更改樣式 start
</style>
