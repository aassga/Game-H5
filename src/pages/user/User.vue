<template>
  <view-page
    :class="[
      'view-page',
      {
        'qp-box':
          (this.$config.home === 'qp' || $config.name === 'js85' || $config.blackTheme || $config.blush) &&
          $config.name !== 'betnew',
      },
      { 'aqvns-box': $config.isAqvns },
      'theme-main-bg',
    ]"
    :transfer-header="false"
    full-box
  >
    <div class="user-header theme-header-bg" slot="header">
      <div class="user-header-bg">
        <p class="title">个人中心</p>
        <div class="box-info" v-if="userInfo">
          <div class="user-info" @click="$router.push('/user/info')">
            <img class="user-img" :src="avatar" alt="" />
            <div class="user-info-content">
              <p class="user-name">
                {{ userInfo ? userInfo["userName"] : "" }}
              </p>
              <p class="user-leave">
                <span
                  :class="['icon', 'iconfont', `h5-icon-level-V${userLevel}`]"
                ></span>
                <span class="name">{{ "VIP" + userLevel }}</span>
              </p>
            </div>
          </div>
        </div>
        <div v-else class="login-box">
          <button
            :class="[
              'login-btn',
              'theme-bg',
              'theme-yellow-bg',
              'theme-color-black',
              { 'amhg-btn': $config.home === 'amhg' },
            ]"
            @click="$router.push('/admin/login')"
          >
            登录/注册
          </button>
        </div>
        <ul class="user-nav theme-bg theme-gradient-bg theme-user-nav-bg">
          <li
            class="nav-item"
            @click="$router.push(userInfo ? '/user/message' : '/admin/login')"
          >
            <span class="icon iconfont h5-icon-my-message">
              <i
                class="msg-count"
                v-show="
                  userInfo && $store.state.user.msgCount['allUnReadCount']
                "
              >
                {{ $store.state.user.msgCount["allUnReadCount"] }}
              </i>
            </span>
            <span class="lab">我的信息</span>
          </li>
          <li
            v-if="$config.name != '500w'"
            class="nav-item"
            @click="$router.push(userInfo ? '/save' : '/admin/login')"
          >
            <span class="icon iconfont h5-icon-my-deposit"></span>
            <span class="lab">我要存款</span>
          </li>
          <li class="nav-item" @click="onWithdraw()">
            <span class="icon iconfont h5-icon-my-draw"></span>
            <span class="lab">我要提现</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="scroller-content-box content-slot theme-main-bg" slot="content">
      <van-cell-group class="user-balance" :border="false">
        <div
          class="only-balance theme-main-bg"
          :class="
            $config.home === 'qp' || $config.blackTheme ? 'qp-balance' : ''
          "
          v-if="!userInfo || !userInfo['is_agency']"
        >
          <span class="col icon iconfont h5-icon-tent-money theme-color"></span>
          <span class="col qp-balance">帐号余额</span>
          <span
            class="col balance"
            style="padding-top: 0 !important; margin-left: 0.1rem"
          >
            <span class="col-flex">
              <i class="rmb" :style="marginTop" style="margin-right: 0.05rem"
                >¥</i
              >
              <i>{{ userInfo ? userInfo.balance : "0.00" }}</i>
              <i
                v-if="userInfo"
                class="icon-refresh icon iconfont h5-icon-h-f"
                style="margin-left: 0.2rem"
                :class="{ loading: loadingBalance }"
                @click="setBalanceToLocal"
              ></i>
            </span>
          </span>
        </div>
        <div
          :class="[
            'money-box',
            { 'qp-money-box': $config.home === 'qp' || $config.blackTheme },
          ]"
          v-else
        >
          <div class="item theme-main-bg">
            <span
              class="col icon iconfont h5-icon-tent-money theme-color"
            ></span>
            <div class="item-content">
              <p class="col col-flex qp-col">
                <span>帐号余额</span>
                <span
                  class="icon-refresh icon iconfont h5-icon-h-f"
                  :class="{ loading: loadingBalance }"
                  @click="setBalanceToLocal"
                ></span>
              </p>
              <p class="col balance">
                <span class="rmb">¥</span
                >{{ userInfo ? userInfo.balance : "0.00" }}
              </p>
            </div>
          </div>
          <div class="item theme-main-bg" @click="goAgentTransition">
            <span class="col icon iconfont h5-icon-h-proxy theme-color"></span>
            <div class="item-content qp-col">
              <p class="col">代理佣金</p>
              <p class="col balance">
                <span class="rmb">¥</span
                >{{ userInfo ? userInfo["agencyInfo"].balance : "0.00" }}
              </p>
            </div>
            <span
              class="change theme-border-1px theme-color"
              v-if="
                userInfo['agencyInfo'] &&
                parseFloat(userInfo['agencyInfo'].balance) > 0
              "
              >领取</span
            >
          </div>
        </div>
      </van-cell-group>
      <div
        v-if="this.$config.home === 'qp' || this.$config.home === 'js85' || $config.blackTheme || $config.blush"
      >
        <van-cell-group class="list" :border="false">
          <van-cell
            is-link
            class="theme-main-bg"
            :to="userInfo ? '/user/YuEBaoCenter' : '/admin/login'"
            v-if="$store.state.user.isShowYuEBao === 'on'"
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-yuebao theme-color"
            ></span>
            <span slot="title" class="title">余额宝</span>
            <span class="desc">这个余额宝会生钱</span>
          </van-cell>
          <van-cell
            class="theme-main-bg"
            is-link
            :to="userInfo ? '/user/JieBeiCenter' : '/admin/login'"
            v-if="$store.state.user.jieBeiData.show === true"
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-jiebei theme-color"
            ></span>
            <span slot="title" class="title">免息借呗</span>
            <span class="desc">0利息0抵押0担保</span>
          </van-cell>
          <van-cell
            class="theme-main-bg"
            is-link
            :to="userInfo ? '/user/account' : '/admin/login'"
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-tent-record theme-color"
            ></span>
            <span slot="title" class="title">帐变记录</span>
            <span class="desc">查看存/提、转帐记录</span>
          </van-cell>
          <van-cell class="theme-main-bg" is-link @click="onBetRecode1">
            <span
              slot="icon"
              class="icon iconfont h5-icon-bet-record theme-color"
            ></span>
            <span slot="title" class="title">投注记录</span>
            <span class="desc">查看投注记录</span>
          </van-cell>
          <van-cell
            class="theme-main-bg"
            is-link
            :to="userInfo ? '/user/result' : '/admin/login'"
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-backwater theme-color"
            ></span>
            <span slot="title" class="title">时时返水</span>
            <span class="desc">查看返水记录</span>
          </van-cell>
          <van-cell
            class="theme-main-bg"
            is-link
            @click="onShowSignin"
            v-if="$store.state.user.isShowSignin === 'yes'"
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-ziyuan1 theme-color"
            ></span>
            <span slot="title" class="title">每日签到</span>
            <span class="desc">天天领礼金</span>
          </van-cell>
          <van-cell class="theme-main-bg" is-link @click="onUserReport()">
            <span
              slot="icon"
              class="icon iconfont h5-icon-person_total1 theme-color"
            ></span>
            <span slot="title" class="title">个人报表</span>
            <span class="desc">个人总报表</span>
          </van-cell>
          <van-cell
            class="theme-main-bg"
            v-if="
              userInfo &&
              userInfo['is_agency'] &&
              $config.name != 'xpj83'
            "
            is-link
            @click="onAgentCenter()"
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-acting-center theme-color"
            ></span>
            <span slot="title" class="title">代理中心</span>
            <span class="desc">代理收益中心</span>
          </van-cell>
          <van-cell
            class="theme-main-bg"
            v-if="userInfo && $config.showInvite && $config.name != '500w'"
            is-link
            :to="
              userInfo['is_agency']
                ? '/user/invite/agency'
                : personalMode === 'no'
                ? '/user/no-invite/member'
                : '/user/invite/member'
            "
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-icon-yaohaoyou theme-color"
            ></span>
            <span slot="title" class="title">邀请好友</span>
            <span class="desc">{{
              userInfo["is_agency"]
                ? "赚取佣金奖励"
                : personalMode === "no"
                ? "尊享四重奖励"
                : "赚取礼金奖励"
            }}</span>
          </van-cell>
          <van-cell
            class="theme-main-bg"
            is-link
            :to="userInfo ? '/user/info' : '/admin/login'"
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-personal-data theme-color"
            ></span>
            <span slot="title" class="title">个人资料</span>
            <span class="desc">修改详细资料</span>
            <!-- <span class="desc" >修改{{personalType}}详细资料</span> -->
          </van-cell>
          <van-cell
            class="theme-main-bg"
            is-link
            :to="userInfo ? '/user/edit/safety/dl' : '/admin/login'"
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-account-safe theme-color"
            ></span>
            <span slot="title" class="title">帐号安全</span>
            <span class="desc">设置帐号密码</span>
            <!-- <span class="desc">设置{{personalType}}密保问题</span> -->
          </van-cell>
          <van-cell class="theme-main-bg" is-link @click="onClear">
            <span
              slot="icon"
              class="icon iconfont h5-icon-clear-cache theme-color"
            ></span>
            <span slot="title" class="title">清除缓存</span>
          </van-cell>
          <van-cell
            class="theme-main-bg"
            is-link
            @click.stop="onThemeFun"
            v-if="
              $config.home !== 'qp' && $config.home !== 'js85' && !$config.blackTheme && !$config.blush
            "
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-change-skin theme-color"
            ></span>
            <span slot="title" class="title">一键换肤</span>
          </van-cell>
          <van-cell class="theme-main-bg" is-link to="/about">
            <span
              slot="icon"
              class="icon iconfont h5-icon-about-us theme-color"
            ></span>
            <span slot="title" class="title">关于我们</span>
          </van-cell>
        </van-cell-group>
      </div>
      <div v-else>
        <div style="width: 100%; height: 0.01rem"></div>
        <van-cell-group class="list" :border="false">
          <van-cell
            is-link
            :to="userInfo ? '/user/YuEBaoCenter' : '/admin/login'"
            v-if="$store.state.user.isShowYuEBao === 'on'"
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-yuebao theme-color"
            ></span>
            <span slot="title" class="title">余额宝</span>
            <span class="desc">这个余额宝会生钱</span>
          </van-cell>
          <van-cell
            is-link
            :to="userInfo ? '/user/JieBeiCenter' : '/admin/login'"
            v-if="$store.state.user.jieBeiData.show === true"
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-jiebei theme-color"
            ></span>
            <span slot="title" class="title">免息借呗</span>
            <span class="desc">0利息0抵押0担保</span>
          </van-cell>
          <van-cell is-link :to="userInfo ? '/user/account' : '/admin/login'">
            <span
              slot="icon"
              class="icon iconfont h5-icon-tent-record theme-color"
            ></span>
            <span slot="title" class="title">帐变记录</span>
            <span class="desc">查看存/提、转帐记录</span>
          </van-cell>
          <van-cell is-link @click="onBetRecode1">
            <span
              slot="icon"
              class="icon iconfont h5-icon-bet-record theme-color"
            ></span>
            <span slot="title" class="title">投注记录</span>
            <span class="desc">查看投注记录</span>
          </van-cell>
          <van-cell is-link :to="userInfo ? '/user/result' : '/admin/login'">
            <span
              slot="icon"
              class="icon iconfont h5-icon-backwater theme-color"
            ></span>
            <span slot="title" class="title">时时返水</span>
            <span class="desc">查看返水记录</span>
          </van-cell>
          <van-cell
            is-link
            @click="onShowSignin"
            v-if="$store.state.user.isShowSignin === 'yes'"
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-ziyuan1 theme-color"
            ></span>
            <span slot="title" class="title">每日签到</span>
            <span class="desc">天天领礼金</span>
          </van-cell>
        </van-cell-group>

        <van-cell-group class="list" :border="false">
          <van-cell is-link @click="onUserReport()">
            <span
              slot="icon"
              class="icon iconfont h5-icon-person_total1 theme-color"
            ></span>
            <span slot="title" class="title">个人报表</span>
            <span class="desc">个人总报表</span>
          </van-cell>
          <van-cell
            v-if="
              userInfo &&
              userInfo['is_agency'] &&
              $config.name != 'xpj83' &&
              $config.name !== 'cpxpj' && 
              $config.name !== 'aqvns'
            "
            is-link
            @click="onAgentCenter()"
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-acting-center theme-color"
            ></span>
            <span slot="title" class="title">代理中心</span>
            <span class="desc">代理收益中心</span>
          </van-cell>
          <van-cell
            v-if="userInfo && $config.showInvite && $config.name != '500w' && $config.name !== 'aqvns'"
            is-link
            :to="
              userInfo['is_agency']
                ? '/user/invite/agency'
                : personalMode === 'no'
                ? '/user/no-invite/member'
                : '/user/invite/member'
            "
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-icon-yaohaoyou theme-color"
            ></span>
            <span slot="title" class="title">邀请好友</span>
            <span class="desc">{{
              userInfo["is_agency"]
                ? "赚取佣金奖励"
                : personalMode === "no"
                ? "尊享四重奖励"
                : "赚取礼金奖励"
            }}</span>
          </van-cell>
          <van-cell is-link :to="userInfo ? '/user/info' : '/admin/login'">
            <span
              slot="icon"
              class="icon iconfont h5-icon-personal-data theme-color"
            ></span>
            <span slot="title" class="title">个人资料</span>
            <span class="desc">修改详细资料</span>
            <!-- <span class="desc" >修改{{personalType}}详细资料</span> -->
          </van-cell>
          <van-cell
            is-link
            :to="userInfo ? '/user/edit/safety/dl' : '/admin/login'"
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-account-safe theme-color"
            ></span>
            <span slot="title" class="title">帐号安全</span>
            <span class="desc">设置帐号密码</span>
            <!-- <span class="desc">设置{{personalType}}密保问题</span> -->
          </van-cell>
        </van-cell-group>

        <van-cell-group class="list" :border="false">
          <van-cell is-link @click="onClear">
            <span
              slot="icon"
              class="icon iconfont h5-icon-clear-cache theme-color"
            ></span>
            <span slot="title" class="title">清除缓存</span>
          </van-cell>
          <van-cell
            is-link
            @click.stop="onThemeFun"
            v-if="
              $config.home !== 'qp' &&
              $config.home !== 'amhg' &&
              $config.home !== 'cpxpj' &&
              $config.home !== 'aqvns' &&
              !$config.blackTheme
            "
          >
            <span
              slot="icon"
              class="icon iconfont h5-icon-change-skin theme-color"
            ></span>
            <span slot="title" class="title">一键换肤</span>
          </van-cell>
          <van-cell is-link to="/about">
            <span
              slot="icon"
              class="icon iconfont h5-icon-about-us theme-color"
            ></span>
            <span slot="title" class="title">关于我们</span>
          </van-cell>
        </van-cell-group>
      </div>
      <div style="width: 100%; height: 0.2rem"></div>
    </div>

    <div style="width: 100%" slot="footer">
      <div
        style="width: 100%"
        :style="{ height: $store.state.main.tabHeight + 'px' }"
      ></div>
    </div>

    <div slot="static">
      <van-popup
        :style="positionStyle"
        v-model="themePickerShow"
        class="theme-popup"
        position="bottom"
        get-container="body"
      >
        <div
          v-for="theme in themes"
          :key="theme.code"
          class="theme-list"
          @click="onChangeTheme(theme.code)"
        >
          <span
            class="color icon iconfont h5-icon-change-skin"
            :style="{ color: theme.color }"
          ></span>
          <span class="name">{{ theme.name }}</span>
          <span
            v-show="$store.state.main.theme === theme.code"
            class="
              icon
              iconfont
              h5-icon-changeskin-icon
              theme-color theme-active
            "
          ></span>
        </div>
      </van-popup>

      <ios-alert
        v-model="showAlert"
        :ok-callback="onChangeType"
        ok-text="立即激活"
        no-text="拒绝"
        :width="6.2"
      >
        <p class="jhAgent theme-color-white" slot="content">
          恭喜您获得最高代理权限！
          <br />
          体验佣金{{ configMoney }}元且转帐次数{{ configCount }}次
        </p>
      </ios-alert>
    </div>
    <div slot="static">
      <pub-dialog v-model="showDialog" style="z-index: 502">
        <div class="dialog-box">
          <div class="content">
            <div
              class="no-open"
              v-if="!isOpen"
              :class="showAnimation ? 'open-sign' : ''"
            >
              <div class="open-btn" @click="onOpenSign"></div>
            </div>
            <div class="opened" v-else>
              <div class="sign-money">{{ signMoney }}</div>
              <!-- <div class="get-btn" @click="onGetSign"></div> -->
              <div class="close-btn" @click="onGetSign"></div>
            </div>
          </div>
          <!-- <div class="close" @click="showDialog = false"></div> -->
        </div>
      </pub-dialog>
    </div>
    <div slot="static">
      <ios-alert
        v-model="signAlert"
        ref="signAlertRef"
        class="sign-alert"
        :ok-callback="hideAlert"
        ok-text="确定"
        :showNo="false"
      >
        <p class="sign-content theme-color-white" slot="content">
          {{ signMsg }}
        </p>
      </ios-alert>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import themes from "../../style/theme";

export default {
  name: "User",
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
    marginTop() {
      if (
        this.$mobileDevice.isAndroid &&
        this.$mobileDevice.browserName === "UCBrowser"
      ) {
        return "margin-top:0.08rem;";
      } else {
        return "margin-top: 0.02rem;";
      }
    },
    configMoney() {
      const money = this.$store.state.main.config
        ? this.$store.state.main.config["limit_amount"]
        : 0;
      if (money) {
        if (money >= 10000) {
          return (
            parseInt(
              money.toString().substring(0, money.toString().length - 3)
            ) /
              10 +
            "万"
          );
        } else {
          return money;
        }
      } else {
        return "**";
      }
    },
    personalType() {
      if (this.agencyType == "shareholder") {
        if (this.personalMode === "mode_b") {
          return "会员";
        } else {
          return "用户";
        }
      } else {
        return "用户";
      }
    },
    configCount() {
      return this.$store.state.main.config
        ? this.$store.state.main.config["draw_money_num"]
        : 0;
    },
    userInfo() {
      return JSON.getObjByLocalStorage("userInfo");
    },
    avatar() {
      return this.userInfo
        ? this.avatars[this.userInfo.pic] || this.avatars.default
        : this.avatars.default;
    },
    themes() {
      if (this.$config.home == "vns") {
        return themes.filter((item) => {
          return (
            item.code !== "default" &&
            item.code !== "red" &&
            item.code !== "brown" &&
            item.code !== "deepred" &&
            item.code !== "yellow"
          );
        });
      } else if (this.$config.home == "xpj") {
        return themes.filter((item) => {
          return (
            item.code !== "amethyst" &&
            item.code !== "bluegreen" &&
            item.code !== "brown" &&
            item.code !== "deepred" &&
            item.code !== "yellow"
          );
        });
      } else {
        return themes.filter((item) => {
          return (
            item.code !== "amethyst" &&
            item.code !== "bluegreen" &&
            item.code !== "brown" &&
            item.code !== "deepred" &&
            item.code !== "yellow"
          );
        });
      }
    },
    userLevel() {
      if (this.personalMode === "no") {
        if (localStorage["jinguanjiaInfo"]) {
          this.$store.state.agency.jinguanjiaInfo = JSON.parse(
            localStorage["jinguanjiaInfo"]
          );
          return this.$store.state.agency.jinguanjiaInfo["level"];
        } else {
          return "0";
        }
      } else {
        return this.userInfo ? this.userInfo["levelId"] : "1";
      }
    },
  },
  created() {
    document.body.className = "user-box";
    this.avatars.default = require("../../assets/img/user/proimt/default.png");
    this.$store.state.user.avatars.forEach((name) => {
      this.avatars[name] = require("../../assets/img/user/proimt/" + name);
    });
    switch (this.$config.agentCenter) {
      case this.VAR.AGENTCENTER.NEW:
        this.agentCenter = "/user/agency-center-new";
        break;
      case this.VAR.AGENTCENTER.MODEC:
        this.agentCenter = "/user/agency-center-modec";
        break;
      default:
        break;
    }
    if (
      localStorage["userInfo"] &&
      JSON.stringify(localStorage["userInfo"]) !== "{}" &&
      !localStorage["jinguanjiaInfo"]
    ) {
      this.$store.dispatch("agency/memberCenterJinguanjiaInfo");
    }
    setTimeout(() => {
      this.toastClear();
    }, 200);
  },
  beforeDestroy() {
    document.body.className = "";
  },
  data() {
    return {
      avatars: {},
      balance: 0,
      themePickerShow: false,
      scrollHeight: "100%",
      show: false,
      showAlert: false,
      loadingBalance: false,
      agentCenter: "",
      showDialog: false,
      signData: {},
      signMoney: "",
      showAnimation: false,
      isOpen: false,
      isGet: false,
      signAlert: false,
      signMsg: "",
    };
  },
  methods: {
    onThemeFun() {
      setTimeout(() => {
        this.themePickerShow = true;
      }, 100);
    },
    onBetRecode1() {
      if (this.userInfo) {
        localStorage.setItem(
          "local-url",
          encodeURIComponent(window.location.href)
        );
        this.$router.push({
          path: "/user/record",
          query: {
            entry: 1,
          },
        });
      } else {
        this.$router.push("/admin/login");
      }
    },
    onWithdraw() {
      if (this.userInfo) {
        this.$router.push({ path: "/take" });
      } else {
        this.$router.push({ path: "/admin/login", replace: true });
      }
    },
    onUserReport() {
      if (this.userInfo) {
        if (this.userInfo.is_agency == 1) {
          //代理
          this.$router.push({
            path: `/user/agency-center-new/team/lower-report/${this.userInfo.uid}/${this.userInfo.userName}/1`,
            query: { date: 0, tabI: 1, user: true },
          });
        } else {
          this.$router.push("/user/report");
        }
      } else {
        this.goNewLogin();
      }
    },
    onAgentCenter() {
      //  && !['935qp', '632qp','kyqp','839qp','k78qp'].includes(this.$config.name)
      if (
        (["mode_c", "mode_d_a"].includes(this.personalMode) ||
          ["aqvns"].includes(this.$config.name)) &&
        !["103qp"].includes(this.$config.name)
      ) {
        this.toastText("暂未开放", "middle");
      } else {
        this.$router.push(this.agentCenter);
      }
    },
    setBalanceToLocal() {
      if (!this.loadingBalance) {
        this.loadingBalance = true;

        this.$store
          .dispatch("user/manualBalance")
          .then((res) => {
            if (res.code === 200) {
              this.userInfo.balance = res.data.balance;
              localStorage["userInfo"] = JSON.stringify(this.userInfo);
            } else {
              this.toastText(res.message, "top");
            }
            setTimeout(() => {
              this.loadingBalance = false;
            }, 5000);
          })
          .catch((err) => {
            setTimeout(() => {
              this.loadingBalance = false;
            }, 5000);
          });
      }
    },
    refreshBalance() {
      this.$store.dispatch("user/refreshBalance").then().catch();

      setTimeout(() => {
        this.loadingBalance = false;
      }, 5000);
    },
    onChangeType() {
      if (!this.show) {
        this.checked = true;
        this.$store
          .dispatch("user/checkCommission", 2)
          .then((res) => {
            this.checked = false;
            if (res.code === 200) {
              this.$router.push("/user/change-money");
            }
          })
          .catch(() => {
            this.checked = false;
          });
      }
      return true;
    },
    goAgentTransition() {
      if (this.personalMode === "mode_b") {
        if (!this.show) {
          this.checked = true;
          this.$store
            .dispatch("user/checkCommission", 1)
            .then((res) => {
              this.checked = false;
              if (res.code === 200) {
                if (res.data[0]["commission_type"] === 0) {
                  this.showAlert = true;
                } else {
                  this.$router.push("/user/agency-center-new/take");
                }
              }
            })
            .catch(() => {
              this.checked = false;
            });
        }
      } else if (["mode_c", "mode_d_a"].includes(this.personalMode)) {
        this.toastText("暂未开放", "middle");
      } else {
        this.$router.push("/user/agency-center-new/take");
      }
    },
    onClear() {
      this.$vux.confirm.show({
        title: "清除缓存",
        cancelText: "取消",
        confirmText: "确定",
        onConfirm: () => {
          localStorage.clear();
          this.toastText("清除成功", "top");
          setTimeout(() => {
            this.$router.push("/");
            window.location.reload(true);
          }, 2000);
        },
      });
      // this.$dialog.confirm({
      //   title: '清除缓存',
      //   className: 'user-dialog'
      // }).then(() => {
      //   localStorage.clear()
      //   this.toastText('清除成功', 'top')
      //   setTimeout(() => {
      //     this.$router.push('/')
      //     window.location.reload(true)
      //   }, 2000)
      // }).catch(() => {
      //   // on cancel
      // })
    },
    onChangeTheme(code) {
      this.$store.commit("main/setTheme", code);
      this.themePickerShow = false;
    },
    onShowSignin() {
      if (this.isGet) {
        this.onShowAlert("今日已领取,请明日再来");
      } else {
        this.getSignin();
      }
    },
    getSignin() {
      this.$store
        .dispatch("user/onSignin", {
          type: "DailySignInList",
        })
        .then((res) => {
          this.signData = res.data;
          if (this.signData.dailySignIn.gift_money_receive === "yes") {
            this.isGet = true;
            this.onShowAlert("今日已领取,请明日再来");
          } else {
            if (this.signData.weilingqu === "yes") {
              this.isOpen = true;
              this.signMoney = this.signData.dailySignIn.gift_money;
            }
            if (this.signData.msg_tankuang) {
              this.onShowAlert(this.signData.msg_tankuang);
            } else {
              this.showDialog = true;
              this.signMoney = this.signData.dailySignIn.gift_money;
            }
          }
        })
        .catch(() => {});
    },
    onOpenSign() {
      this.$store
        .dispatch("user/onSignin", {
          type: "open",
        })
        .then((res) => {
          if (res.code === 200) {
            this.showAnimation = true;
            setTimeout(() => {
              this.isOpen = true;
            }, 1000);
          } else {
            this.onShowAlert(res.message);
          }
        })
        .catch(() => {});
    },
    onGetSign() {
      this.$store
        .dispatch("user/onSignin", {
          type: "lingqu",
          id: this.signData.dailySignIn.id,
        })
        .then((res) => {
          if (res.code === 200) {
            this.showDialog = false;
            this.isGet = true;
          } else {
            this.onShowAlert(res.message);
          }
        })
        .catch(() => {});
    },
    onShowAlert(msg) {
      this.signMsg = msg;
      this.signAlert = true;
    },
    hideAlert() {
      this.$refs.signAlertRef.hideTask();
      setTimeout(() => {
        this.signMsg = "";
      }, 400);
      if (this.signMsg === "请您绑定银行卡再来签到") {
        this.$router.push("/take?index=2");
      } else if (this.signMsg === "请您充值后再来签到！") {
        this.$router.push("/save");
      }
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.clear-fix {
  background-color: white;
}
.jhAgent {
  padding: 0.4rem;
  font-weight: normal !important;
}
.theme-popup {
  z-index: 9999 !important;
}

.theme-active {
  position: absolute;
  top: 0.24rem;
  right: 0.24rem;
  z-index: 9999;
}

.scroller-content-box {
  /deep/ .van-cell {
    height: 1rem;
    padding: 0 0.1rem 0 0;
  }

  /*/deep/ .van-cell__title {*/
  /*  flex: none !important;*/
  /*}*/

  /deep/ .van-cell__value {
    flex: 2;
  }
}

.user-header {
  height: 3.2rem;
  width: 100%;
  .amhg-btn {
    background: #fff !important;
    color: #e28f00 !important;
  }
  &-bg {
    width: 100%;
    height: 100%;
    background: url("../../assets/img/user/starbg.png") no-repeat 0 0;
    background-size: 100% 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    .title {
      font-size: 0.36rem;
      color: #ffffff;
      text-align: center;
      font-weight: 700;
      line-height: 0.36rem;
      margin-top: 0.36rem;
    }

    .login-box {
      text-align: center;

      .login-btn {
        color: #ffffff;
        outline: 0;
        border: none;
        font-size: 0.32rem;
        line-height: 0.68rem;
        width: 2.2rem;
        border-radius: 0.349rem;
      }
    }

    .box-info {
      width: 100%;
      display: flex;
      justify-content: center;

      .user-info {
        color: #ffffff;
        text-align: left;
        margin: 0 auto;

        &:after {
          content: "";
          display: table;
          clear: both;
          zoom: 1;
        }

        .user-img {
          width: 1.1rem;
          height: 1.1rem;
          box-sizing: border-box;
          border: 0.05rem solid #fff;
          border-radius: 50%;
          float: left;
        }

        .user-info-content {
          float: left;
          height: 1.1rem;
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          margin-left: 0.2rem;
          line-height: 0.5rem;
          font-size: 0.3rem;

          .user-name {
            font-size: 0.349rem;
          }

          .user-leave {
            vertical-align: center;

            &:after {
              content: "";
              display: table;
              clear: both;
              zoom: 1;
            }

            .icon {
              display: inline-block;
              font-size: 0.4rem;
              height: 0.5rem;
              float: left;
            }

            .name {
              display: inline-block;
              height: 0.5rem;
              float: left;
              margin-left: 0.1rem;
              font-size: 0.28rem;
            }
          }
        }
      }
    }

    .user-nav {
      list-style: none;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      height: 0.88rem;

      .nav-item {
        flex: 1;
        vertical-align: top;
        height: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;

        .lab {
          display: inline-block;
          font-size: 0.349rem;
          line-height: 0.72rem;
          vertical-align: center;
          height: 0.72rem;
          margin-left: 0.04rem;
        }

        .icon {
          display: inline-block;
          line-height: 0.76rem;
          height: 0.72rem;
          vertical-align: center;
          font-size: 0.349rem;
          position: relative;

          .msg-count {
            position: absolute;
            top: -0.16rem;
            left: 30%;
            color: #ffffff;
            background-color: #ff4021;
            font-size: 0.4rem;
            transform: scale(0.5);
            height: 0.56rem;
            width: 0.56rem;
            line-height: 0.56rem;
            display: inline-block;
            text-align: center;
            border-radius: 0.28rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-family: Arial sans-serif;
          }
        }
      }
    }
  }
}

.user-balance {
  width: 100%;
  background-color: rgba(0, 0, 0, 0) !important;
  font-size: 0.349rem;
  height: 1.26rem;
  color: #333;

  .money-box {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    &.qp-money-box {
      &::after {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        right: 0.32rem;
        bottom: 0;
        left: 0.32rem;
        border-bottom: 0.02rem solid #343434;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }
    .item {
      width: 3.65rem;
      box-sizing: border-box;
      position: relative;
      background-color: white;
    }
  }

  .change {
    position: absolute;
    right: 0.2rem;
    top: 0.19rem;
    font-size: 0.26rem;
    line-height: 1;
    width: 0.8rem;
    height: 0.4rem;
    border-radius: 0.05rem;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    .fa {
      color: #999999;
      font-size: 0.2rem;
      line-height: 0.26rem;
    }
  }

  .col {
    float: left;
    font-size: 0.349rem;
    line-height: 1.26rem;
    height: 100%;
    position: relative;
  }

  .icon {
    display: inline-block;
    font-size: 0.65rem;
    width: 1.1rem;
  }

  .icon-refresh {
    font-size: 0.349rem;
    position: absolute;
    // font-weight: bold;
    top: 0;
    right: 0.3rem;
    display: block;
    width: 0.42rem;
    transform-origin: 43% 47%;
    color: #616161;

    &.loading {
      color: #bbbbbb;
      // animation: rotate(-90deg) 1.5s linear;
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
      -webkit-transition: -webkit-transform 1s linear;
      transition: transform 1s linear;
    }
  }

  .balance {
    padding-top: 0.08rem;
    font-size: 0.349rem;
    color: #ff2200;
    margin-left: 0.2rem;
  }

  .item-content {
    float: left;
    padding-top: 0.2rem;
    width: 2.5rem;

    .col {
      float: none;
      line-height: 0.43rem;
      text-align: left;
      margin: 0;
      position: relative;
      width: 100%;

      &.col-flex {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }
  }

  .only-balance {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.26rem;
    background-color: #ffffff;
    position: relative;
    .col {
      float: none !important;
      line-height: 1;
      height: auto;
    }

    .balance {
      flex: 1;
      text-align: left;
      white-space: nowrap;

      .col-flex {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }

    .icon-refresh {
      position: static;
      margin-right: 0.5rem;
    }
  }
  .blak-balance::after {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: 0.32rem;
    bottom: 0;
    left: 0.32rem;
    border-bottom: 0.02rem solid #343434;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}

.list {
  text-align: left;
  font-size: 0.349rem;

  .icon {
    display: inline-block;
    font-size: 0.58rem;
    width: 1.1rem;
    text-align: center;
  }

  .title {
    font-size: 0.349rem;
    color: #333;
  }

  .desc {
  }

  .cell-content {
    display: flex;
    align-items: center;
    justify-content: start;
    width: 100%;
    box-sizing: border-box;
  }
}

.theme-list {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 0.24rem 0.24rem;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  position: relative;

  &:before {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: 0.2rem;
    // bottom: 0;
    top: 0;
    left: 0.2rem;
    border-bottom: 0.02rem solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  &:first-child::before {
    display: none;
  }

  .name {
    flex: 1;
    font-size: 0.3rem;
    color: #2c3e50;
    padding-left: 0.1rem;
    margin-right: 0.6rem;
    text-align: left;
  }

  .color {
    margin: 0 0.1rem;
    transform: scale(1.5);
  }

  .fa {
    font-size: 0.36rem;
  }
}

@keyframes openSign {
  20% {
    transform: translate(-50%, -50%) scale(1.4, 0.4);
  }
  40% {
    transform: translate(-50%, -50%) scale(1, 1.2);
    transform-origin: bottom;
  }
  70% {
    transform: translate(-50%, -50%) scale(1, 0.9);
    transform-origin: bottom;
  }
  100% {
    transform: translate(-50%, -50%) scale(1, 1);
  }
}

.dialog-box {
  width: 6.31rem;
  height: 6.25rem;
  position: fixed;
  left: 50%;
  top: 50%;
  color: #000000;
  text-align: center;
  transform: translate3d(-50%, -50%, 0) scale(0);
  transition: all 500ms;
  transform-origin: center;
  .content {
    .no-open {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 5.79rem;
      height: 5.17rem;
      background: url("../../assets/img/user/signIn/noOpen-bg.png") no-repeat
        center center / 100%;
      margin: 0.7rem auto 0;
      overflow: hidden;
      .open-btn {
        width: 1.55rem;
        height: 1.65rem;
        background: url("../../assets/img/user/signIn/open-btn.png") no-repeat
          center center / 100%;
        margin: 2.19rem 2.03rem 0 2.21rem;
      }
      &.open-sign {
        animation: openSign 1s cubic-bezier(0.72, 0.58, 0.93, 0.72) 1;
      }
    }
    .opened {
      position: relative;
      width: 4.92rem;
      height: 6.72rem;
      background: url("../../assets/img/user/signIn/user-opened-bg.png")
        no-repeat center center / 100%;
      margin: 0.1rem auto 0;
      overflow: hidden;
      .get-btn {
        width: 1.55rem;
        height: 1.65rem;
        background: url("../../assets/img/user/signIn/get-btn.png") no-repeat
          center center / 100%;
        margin: 0.15rem auto 0;
      }
      .close-btn {
        position: absolute;
        bottom: 0rem;
        height: 1rem;
        width: 100%;
      }
      .sign-money {
        position: absolute;
        top: 3.92rem;
        right: 1.7rem;
        font-size: 1.06rem;
        background: linear-gradient(0deg, #f42800 0.146484375%, #f96602 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-family: FZYanSongS-EB-GB;
        font-weight: bold;
      }
    }
  }
  .close {
    position: absolute;
    top: 0;
    right: 1rem;
    width: 0.71rem;
    height: 0.71rem;
    background: url("../../assets/img/user/signIn/close-btn.png") no-repeat
      center center / 100%;
  }
}
.show .dialog-box {
  transform: translate3d(-50%, -50%, 0) scale(1);
}

.neteWork {
  .ios-content {
    color: rgb(0, 0, 0);
    font-size: 0.3rem;
    line-height: 0.5rem;
    font-weight: 700 !important;
    padding: 0.41rem 0.38rem 0.31rem 0.38rem !important;
  }
}
.sign-content {
  font-size: 0.32rem;
  color: #000;
  max-height: 60vh;
  overflow-y: auto;
  font-weight: 500;
  line-height: 0.4rem;
  text-align: center;
  word-wrap: break-word;
  padding: 0.48rem 0.6rem !important;
}

.qp-box {
  background-color: #272829;
  font-family: STHeiti, Microsoft YaHei, \\5fae\8f6f\96c5\9ed1, SimSun,
    \\5b8b\4f53, arial;
  .scroller-content-box {
    .user-balance .money-box .item,
    .only-balance {
      background-color: #272829;
      .qp-balance {
        color: #fff;
      }
      .iconfont {
        color: #fff !important;
      }
      .qp-col {
        color: #fff !important;
      }
      .balance {
        color: #ff5e46 !important;
      }
      .change {
        border: 0.02rem solid #ff5e46 !important;
        color: #ff5e46 !important;
      }
      .col-flex {
        .rmb {
          margin-top: 0 !important;
        }
      }
    }
    /deep/ .van-cell {
      background-color: #272829;
      .iconfont {
        color: #fff !important;
      }
      .title {
        color: #fff !important;
      }
      &:after {
        border-bottom: 0.02rem solid #343434 !important;
      }
    }
  }
}

// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 start
.aqvns-box{
  //控制 header 背景顏色 && 字體顏色
  /deep/.auto-box-header{
    .user-header{
      background: linear-gradient(0deg, #E3CBB3, #F9EFE3) !important; //header 漸層背景顏色
      .title{
        color: #5D4C3A !important; //header 標題字體顏色
        font-weight: 550 !important; //header 標題字體寬度
      }
      .login-btn{
        background: linear-gradient(0deg, #BF9972, #DABEA7); //header 登入按鈕漸層背景顏色
        color: #000000 !important; //header 登入按鈕文字顏色
        font-weight: 500 !important; //header 登入按鈕文字寬度
      }
      .theme-bg{
        background-color: #C9A786 !important; //header 底層按鈕按鈕背景顏色
      }
    }
    
  }
  //控制內容區塊樣式
  /deep/.auto-box-content{
    .theme-color{
      color: #C9A786 !important; //iconfont 顏色
    }
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 end
</style>
