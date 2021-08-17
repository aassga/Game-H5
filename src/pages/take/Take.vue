<template>
  <view-page
    :full-box="!isShowFixed"
    :class="[
      'view-page',
      'theme-header-bg',
      { 'newQP-take': $config.newQP || $config.blackTheme },
      { 'blush-take': $config.blush },
      { 'QP839-take': $config.isBlackRedTheme },
    ]"
    :no-scroll="noScroll"
    ref="viewPage"
  >
    <title-header
      v-if="$config.name === 'betnew'"
      :title="list[tabIndex].name"
      slot="header"
      backEvent
      @back="$router.back()"
      class="theme-header-bottom theme-header-bg"
    ></title-header>
    <title-header
      v-else
      :title="list[tabIndex].name"
      slot="header"
      backEvent
      @back="$router.back()"
      class="header theme-header-bottom theme-header-bg theme-color-white"
      :theme="'white'"
      :color="
        $config.newQP || $config.blackTheme || $config.blush || $config.isBlackRedTheme
          ? '#fff'
          : '#252525'
      "
      :class="[
        {
          'newQP-header': $config.newQP || $config.blackTheme || $config.blush,
        },
        { 'blush-header': $config.blush },
        { 'QP839-header': $config.isBlackRedTheme },
      ]"
    ></title-header>
    <div
      class="take-content"
      :class="[{ 'QP839-content': $config.isBlackRedTheme }]"
      slot="header-static"
    >
      <ul
        class="tab-list"
        :class="[
          { 'theme-header-bg': $config.newQP || $config.blackTheme },
          { 'theme-main-bg': $config.blush },
          { 'QP839-theme-main-bg': $config.isBlackRedTheme },
          { 'no-usdt': list.length < 4 },
        ]"
      >
        <li
          v-for="(item, i) in list"
          :key="i"
          class="theme-main-bg-3"
          @click="clickTab(i)"
          :class="{ active: tabIndex === i }"
        >
          <img
            :src="
              $config.newQP || $config.blackTheme || $config.blush
                ? item.yellowicon
                : $config.name === 'betnew'
                ? item.greenicon
                : $config.isBlackRedTheme
                ? item.redicon
                : item.icon
            "
            alt=""
            class="icon"
          />
          <span class="name theme-color-white">{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <div class="content" slot="content">
      <!-- :name="animation" -->
      <transition-group class="animation-box" tag="div" ref="animationBox">
        <component :key="tabIndex" :is="comp" @clickTab="clickTab"></component>
      </transition-group>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import UserTake from "./userTake";
import AddBank from "./addBank";
import AddUsdt from "./addUsdt";
import TakeRecord from "./takeRecord";
export default {
  name: "Take",
  data() {
    return {
      tabIndex: 0,
      animation: "slide-right",
      noScroll: false,
      showUsdt: this.$store.state.main.config.limit.usdtWithdrawalsRate,
      list: [
        {
          name: "自助提款",
          icon: require("../../assets/img/save/take/take-self-icon.png"),
          yellowicon: require("../../assets/img/save/take/take-self-icon-y.png"),
          greenicon: require("../../assets/img/save/take/take-self-icon-g.png"),
          redicon: require("../../assets/img/save/take/take-self-icon-red.png"),
        },
        {
          name: "提现记录",
          icon: require("../../assets/img/save/take/take-record-icon.png"),
          yellowicon: require("../../assets/img/save/take/take-record-icon-y.png"),
          greenicon: require("../../assets/img/save/take/take-record-icon-g.png"),
          redicon: require("../../assets/img/save/take/take-record-icon-red.png"),
        },
        {
          name: "添加银行",
          icon: require("../../assets/img/save/take/take-bank-icon.png"),
          yellowicon: require("../../assets/img/save/take/take-bank-icon-y.png"),
          greenicon: require("../../assets/img/save/take/take-bank-icon-g.png"),
          redicon: require("../../assets/img/save/take/take-bank-icon-red.png"),
        },
      ],
    };
  },
  created() {
    this.$store.dispatch("user/refreshUsdt").then();
    this.$store.dispatch("user/refreshBank").then();
  },
  mounted() {
    if (this.$route.query.index)
      this.tabIndex = Number(this.$route.query.index);
    if (this.showUsdt) {
      let usdt = {
        name: "添加USDT",
        icon: require("../../assets/img/save/take/take-usdt-icon.png"),
        yellowicon: require("../../assets/img/save/take/take-usdt-icon-y.png"),
        greenicon: require("../../assets/img/save/take/take-usdt-icon-g.png"),
        redicon: require("../../assets/img/save/take/take-usdt-icon-red.png"),
      };
      this.list.push(usdt);
    }
  },
  components: {
    UserTake,
    AddBank,
    AddUsdt,
    TakeRecord,
  },
  computed: {
    isShowFixed() {
      return this.$store.state.main.keyBoardStatus;
    },
    comp() {
      switch (this.tabIndex) {
        case 0:
          return UserTake;
        case 1:
          return TakeRecord;
        case 2:
          return AddBank;
        case 3:
          return AddUsdt;
      }
    },
  },
  methods: {
    clickTab(index) {
      this.tabIndex = index;
      setTimeout(() => {
        this.$refs["viewPage"].scrollToTop();
      }, 20);
    },
  },
  watch: {
    tabIndex: {
      handler: function (val, old) {
        if (val < old) {
          this.animation = "slide-right";
        } else {
          this.animation = "slide-left";
        }
        this.$store.state.user.takeTabIndex = val;
        this.$nextTick(() => {
          this.$refs.viewPage.refresh();
        });
      },
      deep: true,
    },
    "$store.state.main.keyBoardStatus"(val) {
      this.noScroll = val;
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.view-page {
  background-color: #fafafa;
}

/deep/ .auto-box-header-static {
  position: absolute !important;
}

.header {
  background-color: #ffffff !important;
  color: #252525 !important;
  box-shadow: 0px 1px 0px 0px #ededed;
}

.take-content {
  position: relative;
  width: 100%;
  background-color: #fafafa;
  .tab-list {
    height: 1.86rem;
    display: flex;
    justify-content: space-between;
    padding: 0 0.29rem;
    li {
      float: left;
      width: 1.54rem;
      height: 1.45rem;
      margin-top: 0.22rem;
      border-radius: 0.1rem;
      background-color: #f2f2fa;
      .icon {
        display: block;
        background-size: 100% 100%;
        width: 0.7rem;
        height: 0.7rem;
        margin: 0.14rem auto 0;
      }
      .name {
        display: block;
        font-size: 0.27rem;
        color: #212121;
        margin-top: 0.07rem;
      }
      &.active {
        box-shadow: 0px 0px 13px 0px rgba(0, 189, 212, 0.5);
      }
    }
    &.no-usdt {
      justify-content: start;
      li {
        margin-right: 0.3rem;
      }
    }
  }
}

.content {
  .animation-box {
    left: 0;
    top: 0;
    width: 100%;
    .content-body {
      width: 100%;
    }
  }
}
.newQP-take {
  /deep/ .auto-box-header-static {
    background-color: #0c0c0c !important;
  }
  .tab-list {
    li {
      border: 0.02rem solid transparent;
      &.active {
        box-shadow: none;
        border: 0.02rem solid #f6cf32;
        .name {
          color: #f6cf32 !important;
        }
      }
    }
  }
}
.newQP-header {
  box-shadow: 0px 1px 0px 0px #373737 !important;
}

.blush-take {
  /deep/ .auto-box-header-static {
    background-color: #530107 !important;
  }
  .tab-list {
    li {
      border: 0.02rem solid transparent;
      &.active {
        box-shadow: none;
        border: 0.02rem solid #f6cf32;
        .name {
          color: #f6cf32 !important;
        }
      }
    }
  }
}
.blush-header {
  box-shadow: none !important;
}

// for QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 start
//控制 header 背景顏色 && 字體顏色
.QP839-header {
  background-color: #c02e26 !important; //header 背景顏色
  /deep/.header-title {
    color: #ffffff; ///header 字體顏色
  }
}
//控制內容區塊樣式
.QP839-take {
  background-color: #1b1d1b; //提款選項背景顏色
  .QP839-content {
    background-color: #1b1d1b; //提款選項背景顏色
    .QP839-theme-main-bg {
      .theme-main-bg-3 {
        background: #272829 !important; //提款按鈕各別顏色
        &.active {
          border: 1px solid #c62721 !important; //提款按鈕選中邊框顏色
          box-shadow: none; //提款按鈕選中移除陰影
          background: #1b1d1b !important; //提款按鈕選中顏色
        }
        .name {
          color: #ffffff; //提款按鈕文字顏色
        }
      }
    }
  }
}
// for QP839 的 class 使用黑色底黑色底, 紅色系 強制更改樣式 end
</style>