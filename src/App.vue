
<template>
  <div
    id="app"
    ref="app"
    :class="[
      'number-font',
      { 'newQP-app': $config.newQP || $config.blackTheme },
    ]"
  >
    <template v-if="isAppIn">
      <transition :name="animate($store.state.main.animation)">
        <keep-alive :include="keepAliveComponents">
          <router-view :key="to" />
        </keep-alive>
      </transition>
    </template>
    <template v-else>
      <keep-alive :include="keepAliveComponents">
        <router-view :key="to" />
      </keep-alive>
    </template>
    <van-tabbar
      class="blackTabs new-qpTabs fhcpTabs"
      :border="false"
      v-if="$config.name === 'fhcp' || $config.name === 'xpj83'"
      ref="tab"
      v-model="tabIndex"
      v-show="showTab"
      v-no-touch-move
      :z-index="501"
    >
      <van-tabbar-item
        v-for="(item, i) in fhcpTabs"
        :key="i"
        @click="tabChange(item)"
      >
        <i slot="icon" :class="item.icon"></i>{{ item.name
        }}<i
          v-if="item.name === '我的'"
          class="msg-count"
          v-show="userInfo && msgCount"
          >{{ msgCount }}</i
        >
      </van-tabbar-item>
    </van-tabbar>

    <van-tabbar
      :class="[
        {
          blackTabs:
            $config.newQP || $config.blackTheme || $config.home === 'qp',
        },
        { 'new-qpTabs': $config.newQP || $config.blackTheme },
        { blushBar: $config.home == 'blush' },
        {tccpBar: $config.name === 'tyc86'}
      ]"
      v-if="$config.name === 'tyc86'"
      class="tyc86Tabs"
      :border="false"
      ref="tab"
      v-model="tabIndex"
      v-show="showTab"
      v-no-touch-move
      :z-index="501"
    >
      <van-tabbar-item
        v-for="(item, i) in tyc86Tabs"
        :key="i"
        @click="tabChange(item)"
      >
        <i slot="icon" :class="item.icon"></i>{{ item.name
        }}<i
          v-if="item.name === '我的'"
          class="msg-count"
          v-show="userInfo && msgCount"
          >{{ msgCount }}</i
        >
      </van-tabbar-item>
    </van-tabbar>    
    <van-tabbar
      :class="[
        {
          blackTabs:
            $config.newQP || $config.blackTheme || $config.home === 'qp',
        },
        { 'new-qpTabs': $config.newQP || $config.blackTheme },
        { blushBar: $config.home == 'blush' },
      ]"
      class="greenTabs"
      :border="false"
      v-else-if="$config.name === 'betnew'"
      ref="tab"
      v-model="tabIndex"
      v-show="showTab"
      v-no-touch-move
      :z-index="501"
    >
      <van-tabbar-item
        v-for="(item, i) in betnewTabs"
        :key="i"
        @click="tabChange(item)"
      >
        <i slot="icon" :class="item.icon"></i>{{ item.name
        }}<i
          v-if="item.name === '我的'"
          class="msg-count"
          v-show="userInfo && msgCount"
          >{{ msgCount }}</i
        >
      </van-tabbar-item>
    </van-tabbar>
    <van-tabbar
      class="cpxpj-tabs"
      :border="false"
      v-else-if="$config.name === 'cpxpj'"
      ref="tab"
      v-model="tabIndex"
      v-show="showTab"
      v-no-touch-move
      :z-index="501"
    >
      <van-tabbar-item
        v-for="(item, i) in cpxpjTabs"
        :key="i"
        @click="tabChange(item)"
      >
        <i slot="icon" :class="item.icon"></i>{{ item.name
        }}<i
          v-if="item.name === '我的'"
          class="msg-count"
          v-show="userInfo && msgCount"
          >{{ msgCount }}</i
        >
      </van-tabbar-item>
    </van-tabbar>
    <van-tabbar
      class="js85-tabs"
      :border="false"
      v-else-if="$config.name === 'js85'"
      ref="tab"
      v-model="tabIndex"
      v-show="showTab"
      v-no-touch-move
      :z-index="501"
    >
      <van-tabbar-item
        v-for="(item, i) in js85Tabs"
        :key="i"
        @click="tabChange(item)"
      >
        <i slot="icon" :class="item.icon"></i>{{ item.name
        }}<i
          v-if="item.name === '我的'"
          class="msg-count"
          v-show="userInfo && msgCount"
          >{{ msgCount }}</i
        >
      </van-tabbar-item>
    </van-tabbar>
    <van-tabbar
      class="aqvns-tabs"
      :border="false"
      v-else-if="$config.name === 'aqvns'"
      ref="tab"
      v-model="tabIndex"
      v-show="showTab"
      v-no-touch-move
      :z-index="501"
    >
      <van-tabbar-item
        v-for="(item, i) in aqvnsTabs"
        :key="i"
        @click="tabChange(item)"
      >
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? item.iconHover : item.icon"
          class="footer-icon-style"
        />
        {{ item.name
        }}<i
          v-if="item.name === '我的'"
          class="msg-count"
          v-show="userInfo && msgCount"
          >{{ msgCount }}</i
        >
      </van-tabbar-item>
    </van-tabbar>

    <van-tabbar
      :class="[
        {
          blackTabs:
            $config.newQP || $config.blackTheme || $config.home === 'qp',
        },
        { 'new-qpTabs': $config.newQP || $config.blackTheme },
        { blushBar: $config.home == 'blush' },
        {}
      ]"
      :border="false"
      v-else-if="
        $store.state.main.personal_commission_mode === 'no' ||
        personalMode === 'no'
      "
      ref="tab"
      v-model="tabIndex"
      v-show="showTab"
      v-no-touch-move
      :z-index="501"
    >
      <van-tabbar-item
        v-for="(item, i) in $config.newQP ? newqpTabs : tabs"
        :key="i"
        @click="tabChange(item)"
      >
        <i slot="icon" :class="item.icon"></i>{{ item.name
        }}<i
          v-if="item.name === '我的'"
          class="msg-count"
          v-show="userInfo && msgCount"
          >{{ msgCount }}</i
        >
      </van-tabbar-item>
    </van-tabbar>
    <van-tabbar
      :class="[
        'blackTabs',
        {
          'new-qpTabs':
            $config.newQP ||
            $config.blackTheme ||
            $config.name === 'fhcp' ||
            $config.name === 'xpj83',
        },
      ]"
      :border="false"
      v-else-if="$config.home === 'qp' && !['kkqp'].includes($config.name)"
      ref="tab"
      v-model="tabIndex"
      v-show="showTab"
      v-no-touch-move
      :z-index="501"
    >
      <van-tabbar-item
        v-for="(item, i) in $config.newQP ||
        $config.name === 'fhcp' ||
        $config.name === 'xpj83'
          ? newqpTabs
          : $config.name === '839qp'
          ? qp839Tabs
          : qpTabs"
        :key="i"
        @click="tabChange(item)"
      >
        <i slot="icon" :class="item.icon"></i>{{ item.name
        }}<i
          v-if="item.name === '我的'"
          class="msg-count"
          v-show="userInfo && msgCount"
          >{{ msgCount }}</i
        >
      </van-tabbar-item>
    </van-tabbar>
    <van-tabbar
      class="amhgTabs"
      :border="false"
      v-else-if="$config.home === 'amhg'"
      ref="tab"
      v-model="tabIndex"
      v-show="showTab"
      v-no-touch-move
      :z-index="501"
    >
      <van-tabbar-item
        v-for="(item, i) in amhgTabs"
        :key="i"
        @click="tabChange(item)"
      >
        <i slot="icon" :class="item.icon"></i>{{ item.name
        }}<i
          v-if="item.name === '我的'"
          class="msg-count"
          v-show="userInfo && msgCount"
          >{{ msgCount }}</i
        >
      </van-tabbar-item>
    </van-tabbar>
    <van-tabbar
      class="atabs"
      v-else-if="['kyqp'].includes($config.name)"
      ref="tab"
      v-model="tabIndex"
      v-show="showTab"
      v-no-touch-move
      :z-index="501"
    >
      <van-tabbar-item
        v-for="(item, i) in qp935"
        :key="i"
        @click="tabChange(item)"
      >
        <i slot="icon" :class="item.icon"></i>{{ item.name
        }}<i
          v-if="item.name === '我的'"
          class="msg-count"
          v-show="userInfo && msgCount"
          >{{ msgCount }}</i
        >
      </van-tabbar-item>
    </van-tabbar>
    <van-tabbar
      :class="{ 'new-qpTabs blackTabs': $config.newQP || $config.blackTheme }"
      class="atabs"
      v-else-if="['vnst'].includes($config.name)"
      ref="tab"
      v-model="tabIndex"
      v-show="showTab"
      v-no-touch-move
      :z-index="501"
    >
      <van-tabbar-item
        v-for="(item, i) in tabs"
        :key="i"
        @click="tabChange(item)"
      >
        <i slot="icon" :class="item.icon"></i>{{ item.name
        }}<i
          v-if="item.name === '我的'"
          class="msg-count"
          v-show="userInfo && msgCount"
          >{{ msgCount }}</i
        >
      </van-tabbar-item>
    </van-tabbar>
    <van-tabbar
      class="blushBar"
      :class="[
      { tccpBar: $config.name === 'tccp'},
      ]"
      v-else-if="$config.home == 'blush'"
      ref="tab"
      v-model="tabIndex"
      v-show="showTab"
      v-no-touch-move
      :z-index="501"
    >
      <van-tabbar-item
        v-for="(item, i) in tabsA"
        :key="i"
        @click="tabChange(item)"
      >
        <i slot="icon" :class="item.icon"></i>{{ item.name
        }}<i
          v-if="item.name === '我的'"
          class="msg-count"
          v-show="userInfo && msgCount"
          >{{ msgCount }}</i
        >
      </van-tabbar-item>
    </van-tabbar>
    <van-tabbar
      :class="{ 'new-qpTabs blackTabs': ['kkqp'].includes($config.name) }"
      class="atabs"
      v-else-if="$config.home !== 'vns'"
      ref="tab"
      v-model="tabIndex"
      v-show="showTab"
      v-no-touch-move
      :z-index="501"
    >
      <van-tabbar-item
        v-for="(item, i) in tabsA"
        :key="i"
        @click="tabChange(item)"
      >
        <i slot="icon" :class="item.icon"></i>{{ item.name
        }}<i
          v-if="item.name === '我的'"
          class="msg-count"
          v-show="userInfo && msgCount"
          >{{ msgCount }}</i
        >
      </van-tabbar-item>
    </van-tabbar>
    <van-tabbar
      v-else
      ref="tab"
      v-model="tabIndex"
      v-show="showTab"
      v-no-touch-move
      :z-index="501"
      :class="[
        {
          'new-qpTabs blackTabs theme-after-border-nocolor':
            $config.newQP || $config.blackTheme,
        },
      ]"
    >
      <van-tabbar-item
        v-for="(item, i) in tabsB"
        :key="i"
        @click="tabChange(item)"
      >
        <i
          slot="icon"
          :class="[tabIndex === i ? item.iconCheck : item.icon]"
        ></i
        >{{ item.name
        }}<i
          v-if="item.name === '我的'"
          class="msg-count"
          v-show="userInfo && msgCount"
          >{{ msgCount }}</i
        >
      </van-tabbar-item>
    </van-tabbar>

    <ios-alert
      v-model="iosAlert.show"
      :ok-callback="iosAlert.okCallback"
      :show-no="false"
      :width="iosAlert.width"
      :top="iosAlert.top"
      :ok-text="iosAlert.okText"
      :no-text="iosAlert.noText"
      :className="className"
    >
      <p
        v-html="iosAlert.title"
        class="ios-title theme-color-white"
        v-if="iosAlert.title"
        slot="title"
      ></p>
      <p
        v-html="iosAlert.content"
        class="ios-content theme-color-white"
        :class="!iosAlert.title ? 'onlyContent' : ''"
        v-if="iosAlert.content"
        slot="content"
      ></p>
    </ios-alert>
    <van-number-keyboard
      v-model="$store.state.key.value"
      @input="$store.state.key.onNumberInput"
      ref="number-keyboard"
      @blur="onNumberBlur"
      @delete="$store.state.key.onNumberInput('del')"
      :extra-key="$store.state.key.dot ? '.' : '清空'"
      :show.sync="$store.state.key.show"
      close-button-text="完成"
      safe-area-1inset-bottom
      :z-index="9999"
      :style="positionStyleApp"
      :class="{ 'black-keyboard': $config.blackTheme || $config.newQP }"
    >
      <span
        class="iconfont h5-icon-qingchu key-del theme-color"
        slot="delete"
      ></span>
    </van-number-keyboard>
    <van-overlay
      class="mask"
      :show="showMask.status"
      @click.stop="closeMask"
      z-index="501"
    ></van-overlay>
    <hong-bao-kai
      v-if="$config.showRedPacket && $route.path == '/home'"
    ></hong-bao-kai>
    <red-packet-close
      v-if="$config.showRedPacket && $route.path == '/home'"
    ></red-packet-close>
    <kai-jiang
      @kjiang="isKaijing"
      :kaijiangObj="kaijiangDate"
      :kaijiang="kaijiang"
    ></kai-jiang>
    <pub-dialog v-model="$store.state.main.stopDialog" style="z-index: 9999">
      <transition name="stop-entry">
        <template>
          <div v-show="$store.state.main.stopDialog" class="notice-dialog-stop">
            <img :src="stopImg" alt />
            <scroll-box auto ref="notice-scroll" class="notice-dialog-content">
              <div
                class="con-text"
                ref="notice-scroll-content"
                v-html="
                  $store.state.main.stopDialogText.replace(/，/g, '</br>')
                "
              ></div>
            </scroll-box>
            <div
              class="notice-dialog-footer"
              :class="$config.home + '-dialog-header'"
              @click="onStopOk"
            >
              <div style="heigth: 1rem" :class="$config.home + '-header'">
                我知道了
              </div>
            </div>
          </div>
        </template>
      </transition>
    </pub-dialog>
    <red-lope :isRedShow="$store.state.main.isRedLop"></red-lope>

    <!-- <jumpnewuser v-if="$config.isNewUserJumpShow"></jumpnewuser> -->

    <pub-dialog v-model="$store.state.main.distanceLogin" style="z-index: 503">
      <distance-login class="distance-login"></distance-login>
    </pub-dialog>
    <pub-dialog
      v-model="$store.state.main.showSaveFailure"
      ref="saveFailure"
      style="z-index: 99"
    >
      <div class="saveFailure-cont">
        <img
          v-if="$store.state.main.saveFailureData.msgImageH5"
          :src="publicStaticHost + $store.state.main.saveFailureData.msgImageH5"
          alt=""
        />
        <div
          class="text theme-color-white"
          v-html="$store.state.main.saveFailureData.msg"
        ></div>
        <i
          class="icon iconfont h5-icon-win-close"
          @click="setShowSaveFailure(false)"
        ></i>
      </div>
    </pub-dialog>
    <pub-dialog v-model="$store.state.main.showBindPhone" :maskClose="true">
      <div class="bindPhone theme-main-bg">
        <i
          class="bindClose icon iconfont tab-icon h5-icon-pc-proxy-_8"
          @click="bindClose"
        ></i>
        <div class="info">
          <p class="theme-color head theme-color-yellow">
            为了保证资金安全，存款前请先绑定手机
          </p>
          <p class="tit theme-color-white">手机号码</p>
          <input-row
            :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
            v-model="phone"
            v-keyBroayStates
            type="tel"
            max-len="11"
            placeholder="请输入手机号码"
          >
          </input-row>
          <p class="tit theme-color-white">手机验证码</p>
          <div class="sms">
            <div></div>
            <input-row
              v-keyBroayStates
              :themeStyle="$config.newQP || $config.blackTheme || $config.blush"
              type="tel"
              max-len="6"
              v-model="sms"
              placeholder="请输入手机验证码"
            >
              />
            </input-row>
            <div
              @click="stopTime"
              class="
                getSms
                theme-border-1px
                theme-color
                theme-border-yellow
                theme-main-bg
                theme-color-yellow
              "
            >
              {{ isGoTime ? "获取验证码" : "重新获取(" + stepTime + ")" }}
            </div>
          </div>
          <p class="tip">
            为了您的隐私安全，信息在确认后将无法修改，如需帮助，请<span
              @click="inService()"
              >联系客服</span
            >
          </p>
        </div>
        <div
          class="btn theme-bg theme-color-yellow theme-bg-yellow"
          @click="bindPhone"
        >
          确定
        </div>
      </div>
    </pub-dialog>
    <ios-alert
      v-model="$store.state.main.bindBank"
      :width="6"
      class="saveIosAlert"
      :ok-text="
        $store.state.main.bindBankId == '5012' ? '前往绑定' : '立即下载'
      "
      :no-text="
        $store.state.main.bindBankId == '5012' ? '暂不绑定' : '暂不下载'
      "
      :ok-callback="
        $store.state.main.bindBankId == '5012' ? goBindBannk : goDownload
      "
    >
      <div class="title ios-title" slot="title">
        <h4 class="title theme-color-white" style="font-size: 0.33rem">
          {{ $store.state.main.bindBankMsg }}
        </h4>
      </div>
    </ios-alert>
    <pub-dialog
      v-model="showHongBao"
      style="z-index: 999"
      slot="hongBao"
      :maskClose="true"
    >
      <div
        class="hongBao"
        v-if="['amxpj', 'kkqp', '99qp', 'vnso', 'amhg'].includes($config.name)"
      >
        <img
          @click="showHongBao = false"
          src="../src/assets/img/home/hongBao-bg.png"
          class="hongBao-bg"
        />
        <img
          @click="clickDownload"
          src="../src/assets/img/home/hongBao-btn.png"
          class="hongBao-btn"
        />
        <span @click="showHongBao = false" class="hongBao-close"
          ><i class="icon iconfont h5-icon-win-close"></i
        ></span>
      </div>
      <div
        class="other-hongBao"
        v-else-if="
          ['betnew', '839qp', 'tccp','tyc86', 'fhcp', 'hty', 'dqr', 'xpj83','js85', 'aqvns', 'cpxpj'].includes(
            $config.name
          )
        "
      >
        <img
          @click="showHongBao = false"
          :src="
            require('../src/assets/img/home/' +
              $config.name +
              '-hongBao-bg.png')
          "
          class="hongBao-bg"
        />
        <div class="hongBao-btn" @click="clickDownload"></div>
        <span @click="showHongBao = false" class="hongBao-close" v-show="!['aqvns', 'cpxpj'].includes($config.name)"
          ><i class="icon iconfont h5-icon-win-close"></i
        ></span>
      </div>
    </pub-dialog>
    <ul class="debug-box">
      <li v-for="(v, k, i) in $store.state.debugInfo" :key="i">
        {{ k }} : {{ v }}
      </li>
    </ul>
  </div>
</template>

<script>
import { IosAlert } from "./components/ios-alert/IosAlert.vue";
import { KaiJiang } from "./components/kai-jiang/index.vue";
import { HongBaoKai } from "./components/hong-bao-kai/index.vue";
import { RedPacketClose } from "./components/red-packet-close/index.vue";
import { RedLop } from "./components/kai-jiang/index.vue";
import logoMixin from "./pages/home/theme/mixin";
export default {
  mixins: [logoMixin],
  data() {
    return {
      kaijiangDate: {},
      kaijiang: false,
      showTab2: true,
      change: 0,
      active: 0,
      originalHeight: 0,
      className: "",
      tabsInvite:
        this.$config.name == "500w"
          ? [
              // A版显示推广赚钱
              {
                name: "首页",
                icon: "icon iconfont tab-icon h5-icon-foot-home text-color",
                link: "/home",
              },
              {
                name: "取款",
                icon: "icon iconfont tab-icon h5-icon-my-draw",
                link: "/save",
              },
              {
                name: "客服",
                icon: "icon iconfont tab-icon h5-icon-foot-customer",
                link: "",
              },
              // {
              //     name: '推广赚钱',
              //     icon: 'icon iconfont tab-icon tab-icon-bet h5-icon-index-money',
              //     link: '/user/invite'
              // },
              {
                name: "我的",
                icon: "icon iconfont tab-icon h5-icon-foot-my",
                link: "/user",
              },
            ]
          : [
              // A版显示推广赚钱
              {
                name: "首页",
                icon: "icon iconfont tab-icon h5-icon-foot-home text-color",
                link: "/home",
              },
              {
                name: "存款",
                icon: "icon iconfont tab-icon h5-icon-foot-deposit",
                link: "/save",
              },
              {
                name: "客服",
                icon: "icon iconfont tab-icon h5-icon-foot-customer",
                link: "",
              },
              {
                name: "推广赚钱",
                icon: "icon iconfont tab-icon tab-icon-bet h5-icon-index-money",
                link: "/user/invite",
              },
              {
                name: "我的",
                icon: "icon iconfont tab-icon h5-icon-foot-my",
                link: "/user",
              },
            ],
      tabs: [
        {
          name: "首页",
          icon: "icon iconfont tab-icon h5-icon-foot-home text-color",
          link: "/home",
        },
        {
          name: "存款",
          icon: "icon iconfont tab-icon h5-icon-foot-deposit",
          link: "/save",
        },
        {
          name: "客服",
          icon: "icon iconfont tab-icon h5-icon-foot-customer",
          link: "",
        },
        {
          name: "投注记录",
          icon: "icon iconfont tab-icon tab-icon-bet h5-icon-foot-compare",
          link: "/user/record",
        },
        {
          name: "我的",
          icon: "icon iconfont tab-icon h5-icon-foot-my",
          link: "/user",
        },
      ],
      vnsTabsInvite: [
        // B版显示推广赚钱
        {
          name: "首页",
          icon: "icon iconfont tab-icon h5-icon-icon-index",
          iconCheck: "icon iconfont tab-icon h5-icon-icon-index-hover",
          link: "/home",
        },
        {
          name: "存款",
          icon: "icon iconfont tab-icon icon iconfont h5-icon-icon-deposit",
          iconCheck: "icon iconfont tab-icon h5-icon-icon-deposit-hover",
          link: "/save",
        },
        {
          name: "客服",
          icon: "icon iconfont tab-icon h5-icon-icon-service",
          iconCheck: "icon iconfont tab-icon h5-icon-icon-service-hover",
          link: "",
        },
        {
          name: "推广赚钱",
          icon: "icon iconfont tab-icon tab-icon-bet h5-icon-index-moneyb",
          iconCheck: "icon iconfont tab-icon h5-icon-index-moneyhover",
          link: "/user/invite",
        },
        {
          name: "我的",
          icon: "icon iconfont tab-icon h5-icon-icon-my",
          iconCheck: "icon iconfont tab-icon h5-icon-icon-my",
          link: "/user",
        },
      ],
      vnsTabs: [
        {
          name: "首页",
          icon: "icon iconfont tab-icon h5-icon-icon-index",
          iconCheck: "icon iconfont tab-icon h5-icon-icon-index-hover",
          link: "/home",
        },
        {
          name: "存款",
          icon: "icon iconfont tab-icon icon iconfont h5-icon-icon-deposit",
          iconCheck: "icon iconfont tab-icon h5-icon-icon-deposit-hover",
          link: "/save",
        },
        {
          name: "客服",
          icon: "icon iconfont tab-icon h5-icon-icon-service",
          iconCheck: "icon iconfont tab-icon h5-icon-icon-service-hover",
          link: "",
        },
        {
          name: "投注记录",
          icon: "icon iconfont tab-icon tab-icon-bet h5-icon-icon-record",
          iconCheck: "icon iconfont tab-icon h5-icon-icon-record-hover",
          link: "/user/record",
        },
        {
          name: "我的",
          icon: "icon iconfont tab-icon h5-icon-icon-my",
          iconCheck: "icon iconfont tab-icon h5-icon-icon-my",
          link: "/user",
        },
      ],
      QPtabs: [
        {
          name: "首页",
          icon: "icon iconfont h5-icon-shouye",
          iconCheck: "icon iconfont h5-icon-shouye1",
          link: "/home",
          show: true,
        },
        {
          name: "佣金",
          icon: "icon iconfont h5-icon-yongjin1",
          iconCheck: "icon iconfont h5-icon-yongjin",
          link: "/user/change-money",
          show: false,
        },
        {
          name: "客服",
          icon: "icon iconfont h5-icon-kefu1",
          iconCheck: "icon iconfont h5-icon-kefu",
          link: "",
          show: true,
        },
        {
          name: "APP",
          icon: "icon iconfont h5-icon-xiazai",
          iconCheck: "icon iconfont h5-icon-xiazai1",
          link: "/download",
          show: true,
        },
        {
          name: "我的",
          icon: "icon iconfont h5-icon-wode2",
          iconCheck: "icon iconfont h5-icon-wodexuanzhong",
          link: "/user",
          show: true,
        },
      ],
      qp935: [
        {
          name: "首页",
          icon: "icon iconfont tab-icon h5-icon-icon-index",
          iconCheck: "icon iconfont tab-icon h5-icon-icon-index-hover",
          link: "/home",
        },
        {
          name: "存款",
          icon: "icon iconfont tab-icon icon iconfont h5-icon-icon-deposit",
          iconCheck: "icon iconfont tab-icon h5-icon-icon-deposit-hover",
          link: "/save",
        },
        {
          name: "客服",
          icon: "icon iconfont tab-icon h5-icon-icon-service",
          iconCheck: "icon iconfont tab-icon h5-icon-icon-service-hover",
          link: "",
        },
        {
          name: "佣金",
          icon: "icon tab-icon iconfont h5-icon-yongjin1",
          iconCheck: "icon tab-icon iconfont h5-icon-yongjin",
          link: "/user/change-money",
          show: false,
        },
        {
          name: "我的",
          icon: "icon iconfont tab-icon h5-icon-icon-my",
          iconCheck: "icon iconfont tab-icon h5-icon-icon-my",
          link: "/user",
        },
      ],
      qpTabs: [
        {
          name: "首页",
          icon: "icon iconfont tab-icon h5-icon-shouye2",
          link: "/home",
        },
        {
          name: "存款",
          icon: "icon iconfont tab-icon icon iconfont h5-icon-cunkuan",
          link: "/save",
        },
        {
          name: "客服",
          icon: "icon iconfont tab-icon h5-icon-kefu2",
          link: "",
        },
        {
          name: "推广赚钱",
          icon: "icon iconfont tab-icon tab-icon-bet h5-icon-tuiguangzhuanqian",
          link: "/user/invite",
        },
        {
          name: "我的",
          icon: "icon iconfont tab-icon h5-icon-wode3",
          link: "/user",
        },
      ],
      qp839Tabs: [
        {
          name: "首页",
          icon: "icon iconfont tab-icon h5-icon-shouye2",
          link: "/home",
        },
        {
          name: "存款",
          icon: "icon iconfont tab-icon icon iconfont h5-icon-cunkuan",
          link: "/save",
        },
        {
          name: "推广赚钱",
          icon: "icon iconfont tab-icon tab-icon-bet h5-icon-tuiguangzhuanqian",
          link: "/user/invite",
        },
        {
          name: "客服",
          icon: "icon iconfont tab-icon h5-icon-kefu2",
          link: "",
        },
        {
          name: "我的",
          icon: "icon iconfont tab-icon h5-icon-wode3",
          link: "/user",
        },
      ],
      amhgTabs: [
        {
          name: "首页",
          icon: "icon iconfont tab-icon h5-icon-shouye3",
          link: "/home",
        },
        {
          name: "信息",
          icon: "icon iconfont tab-icon h5-icon-xinxi",
          link: "/user/message",
        },
        {
          name: "客服",
          icon: "icon iconfont tab-icon h5-icon-kefu",
          link: "",
        },
        {
          name: "优惠",
          icon: "icon iconfont tab-icon h5-icon-youhui",
          link: "/activity",
        },
        {
          name: "我的",
          icon: "icon iconfont tab-icon h5-icon-wode4",
          link: "/user",
        },
      ],   
      newqpTabs: [
        {
          name: "首页",
          icon: "icon iconfont tab-icon h5-icon-shouye2",
          link: "/home",
        },
        {
          name: "时时返水",
          icon: "icon iconfont tab-icon icon iconfont h5-icon-shishifanshui",
          link: "/user/result",
        },
        {
          name: "客服",
          icon: "icon iconfont tab-icon h5-icon-kefu2",
          link: "",
        },
        {
          name: "投注记录",
          icon: "icon iconfont tab-icon tab-icon-bet h5-icon-icon-record",
          iconCheck: "icon iconfont tab-icon h5-icon-icon-record-hover",
          link: "/user/record",
        },
        {
          name: "我的",
          icon: "icon iconfont tab-icon h5-icon-wode3",
          link: "/user",
        },
      ],
      tyc86Tabs: [
        {
                name: "首页",
                icon: "icon iconfont tab-icon h5-icon-foot-home text-color",
                link: "/home",
              },
              {
                name: "存款",
                icon: "icon iconfont tab-icon h5-icon-foot-deposit",
                link: "/save",
              },
              {
                name: "客服",
                icon: "icon iconfont tab-icon h5-icon-foot-customer",
                link: "",
              },
              {
                name: "推广赚钱",
                icon: "icon iconfont tab-icon tab-icon-bet h5-icon-index-money",
                link: "/user/invite",
              },
              {
                name: "我的",
                icon: "icon iconfont tab-icon h5-icon-foot-my",
                link: "/user",
              },
      ],
      fhcpTabs: [
        {
          name: "首页",
          icon: "icon iconfont tab-icon h5-icon-shouye2",
          link: "/home",
        },
        {
          name: "自助返水",
          icon: "icon iconfont tab-icon icon iconfont h5-icon-shishifanshui",
          link: "/user/result",
        },
        {
          name: "推广赚钱",
          icon: "icon iconfont tab-icon tab-icon-bet h5-icon-tuiguangzhuanqian",
          link: "/user/invite",
        },
        {
          name: "客服",
          icon: "icon iconfont tab-icon h5-icon-zaixiankefu3x",
          link: "",
        },
        {
          name: "我的",
          icon: "icon iconfont tab-icon h5-icon-wode3",
          link: "/user",
        },
      ],
      betnewTabs: [
        {
          name: "首页",
          icon: "icon iconfont tab-icon h5-icon-shouye2",
          link: "/home",
        },
        {
          name: "优惠",
          icon: "icon iconfont tab-icon h5-icon-youhui",
          link: "/activity",
        },
        {
          name: "客服",
          icon: "icon iconfont tab-icon h5-icon-kefu2",
          link: "",
        },
        {
          name: "我的",
          icon: "icon iconfont tab-icon h5-icon-wode3",
          link: "/user",
        },
      ],
      cpxpjTabs: [
        {
          name: "首页",
          icon: "icon iconfont tab-icon h5-icon-shouye-xuanzhong",
          link: "/home",
        },
        {
          name: "优惠",
          icon: "icon iconfont tab-icon icon iconfont h5-icon-liwu4",
          link: "/activity",
        },
        {
          name: "客服",
          icon: "icon iconfont tab-icon h5-icon-zaixiankefu3x",
          link: "",
        },
        {
          name: "代理",
          icon: "icon iconfont tab-icon tab-icon-bet h5-icon-daili1",
          link: "/user/agency-center-new",
        },
        {
          name: "我的",
          icon: "icon iconfont tab-icon h5-icon-wode5",
          link: "/user",
        },
      ],
      js85Tabs: [
        {
          name: "首页",
          icon: "icon iconfont tab-icon h5-icon-shouye-xuanzhong",
          link: "/home",
        },
        {
          name: "自助返水",
          icon: "icon iconfont tab-icon icon iconfont h5-icon-shishifanshui",
          link: "/user/result",
        },
        {
          name: "存取款",
          icon: "icon iconfont tab-icon icon iconfont h5-icon-cunkuan",
          link: "/save",
        },
        {
          name: "推广赚钱",
          icon: "icon iconfont tab-icon tab-icon-bet h5-icon-tuiguangzhuanqian",
          link: "/user/invite",
        },
        {
          name: "客服",
          icon: "icon iconfont tab-icon h5-icon-zaixiankefu3x",
          link: "",
        },
        {
          name: "我的",
          icon: "icon iconfont tab-icon h5-icon-wode5",
          link: "/user",
        },
      ],
      aqvnsTabs: [
        {
          name: "主页",
          icon: require("../src/assets/img/home/aqvns/aqvns-home.png"),
          iconHover: require("../src/assets/img/home/aqvns/aqvns-home-hover.png"),
          link: "/home",
        },
        {
          name: "优惠",
          icon: require("../src/assets/img/home/aqvns/aqvns-tag.png"),
          iconHover: require("../src/assets/img/home/aqvns/aqvns-tag-hover.png"),
          link: "/activity",
        },
        {
          name: "客服",
          icon: require("../src/assets/img/home/aqvns/aqvns-general.png"),
          iconHover: require("../src/assets/img/home/aqvns/aqvns-general-hover.png"),
          link: "",
        },
        {
          name: "推广",
          icon: require("../src/assets/img/home/aqvns/aqvns-money.png"),
          iconHover: require("../src/assets/img/home/aqvns/aqvns-money-hover.png"),
          link: "/user/invite/agency",
        },
        {
          name: "我的",
          icon: require("../src/assets/img/home/aqvns/aqvns-my.png"),
          iconHover: require("../src/assets/img/home/aqvns/aqvns-my-hover.png"),
          link: "/user",
        },
      ],
      lastTouchEnd: 0,
      socket: null,
      socketTimer: 0,
      phone: "",
      sms: "",
      isGoTime: true,
      stepTime: 60,
      interval: null,
      showHongBao: false,
    };
  },
  computed: {
    stopImg() {
      try {
        return require(`@src/assets/img/home/${this.$config.home}-stop.png`);
      } catch (error) {
        return require(`@src/assets/img/home/xpj-stop.png`);
      }
    },
    tabsA() {
      if (this.$config.indexInvite) {
        return this.tabs;
      } else {
        return this.tabsInvite;
      }
    },
    tabsB() {
      if (
        this.$config.indexInvite ||
        this.$config.name === "vnso" ||
        this.$config.name === "amhg"
      ) {
        return this.vnsTabs;
      } else {
        return this.vnsTabsInvite;
      }
    },
    isAppIn() {
      return !window.localStorage.isApp;
    },
    positionStyleApp() {
      // 解决安卓小米position：fixed问题导致按钮错位问题
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
    iosAlert() {
      return this.$store.state.main.iosAlert;
    },
    keepAliveComponents() {
      return this.$store.state.main.keepAliveComponents;
    },
    showMask() {
      return this.$store.state.main.showMask;
    },
    theme() {
      return this.$store.state.main.theme;
    },
    to() {
      return this.$route.fullPath;
    },
    msgCount() {
      return this.$store.state.user.msgCount["allUnReadCount"];
    },
    showTab() {
      if (
        this.$route.fullPath === "/save" ||
        (this.$route.fullPath === "/admin/login" &&
          (["vnst", "blr", "aqvns", "tccp", "tyc86", "vnso", "amhg"].includes(
            this.$config.name
          ) ||
            this.$config.home === "qp"))
      ) {
        return false;
      } else {
        return this.$route.meta.tab && this.$store.state.main.showTab;
      }
    },
    tabIndex: {
      get() {
        if (
          this.$store.state.main.tabIndex === 0 &&
          this.$route.fullPath === "/admin/login"
        ) {
          return -1;
        } else {
          return this.$store.state.main.tabIndex;
        }
      },
      set(val) {
        this.$store.state.main.tabIndex = val;
      },
    },
  },
  watch: {
    theme: "changeTheme",
    tabIndex(now, old) {
      // 客服连接跳转
      let tab = ["mode_c", "mode_d_a"].includes(this.personalMode)
        ? this.qp935[now]
        : this.tabs[now];
      if (this.$config.name === "betnew") tab = this.betnewTabs[now];
      // betnew only 4 tabs
      if (this.$config.name === "js85") tab = this.js85Tabs[now];
      
      else if (this.$config.name === "fhcp" || this.$config.name === "xpj83")
        tab = this.fhcpTabs[now];
      else if (this.$config.name === "839qp") tab = this.qp839Tabs[now];
     
      if (tab && tab.name === "客服") {
        this.tabIndex = old;        
        const link = this.getKF();
        if (link) {
          if (
            this.$userAgent.includes("MQQBrowser") ||
            (this.$userAgent.includes("iPhone") &&
              this.$userAgent.includes("SogouMobileBrowser"))
          ) {
            // 解决QQ浏览器和苹果搜狗浏览器进入在线客服后卡顿
            // 增加浏览器历史记录
            window.history.pushState(
              window.location.href,
              null,
              window.location.href
            );
            window.location.replace(link);
          } else {
            window.tryOpen(link);
          }
        } else {
          this.toastText("暂无客服", "middle");
        }
      } else if (
        tab &&
        tab.name === "佣金" &&
        ["mode_c", "mode_d_a"].includes(this.personalMode)
      ) {
        this.tabIndex = old;
      } else if (
        tab &&
        tab.name === "存款" &&
        this.$config.name === "amhg" &&
        this.$store.state.user.userInfo.phone === ""
      ) {
        this.tabIndex = old;
      }
      if (JSON.stringify(this.userInfo) !== "{}") {
        this.getRedLope();
      }
    },
    userInfo(nowVal) {
      if (JSON.stringify(nowVal) !== "{}") {
        setTimeout(() => {
          this.getRedLope();
        }, 3000);
        this.isShowYuEBao();
        this.JiebeiInfo();
        this.isShowSignin();
      }
      if (JSON.stringify(nowVal) !== "{}" && !nowVal.is_agency) {
        this.QPtabs[1].name = "存款";
        this.QPtabs[1].link = "/save";
      } else {
        this.QPtabs[1].name = "佣金";
        this.QPtabs[1].link = "/user/change-money";
      }
      //判断退出时候的红包雨下不下
      if (JSON.stringify(nowVal) == "{}" && this.$config.showRedPacket) {
        this.isShowpack();
      }
    },
    $route: function (to, from) {
      if (from.fullPath == "/admin/login") {
        if (this.$config.showRedPacket) {
          if (!this.$store.state.user.token) {
            if (!localStorage.hongbaoyuShow)
              this.$store.commit("main/getShowRedPackRain", true);
          } else {
            this.isShowpack();
          }
        }
      }
      if (
        (this.$config.home === "qp" || this.$config.blackTheme) &&
        !this.$config.newQP
      ) {
        let classList = window.document.documentElement.classList;
        let hasClass = classList.value.includes("html-black-bg");
        if (
          to.fullPath === "/admin/login" ||
          (this.$config.name === "blr" && to.fullPath === "/download")
        ) {
          !hasClass
            ? window.document.documentElement.classList.add("html-black-bg")
            : "";
        } else {
          hasClass
            ? window.document.documentElement.classList.remove("html-black-bg")
            : "";
        }
      }
      if (to.query.cocos && to.query.cocos == "1") {
        sessionStorage.setItem("isCocos", "1");
      }
    },
    "$store.state.main.siteId": function () {
      this.initTask();
    },
  },
  created() {
    if (this.$config.newQP) {
      window.document.documentElement.classList.add("html-black-bg");
    }
    let that = this;
    let status;
    window.rem = 100;
    const onResize = function () {
      const width = document.documentElement.offsetWidth;
      window.rem = 100 * (width / 750);
      window.document.documentElement.style.fontSize = window.rem + "px";
      that.$store.state.main.windowHeight = window.innerHeight;
      that.$store.state.main.windowWidth = window.innerWidth;
    };
    // 通过token直接登录
    const vToken = this.getQueryString("token");
    if (vToken != null) {
      window.localStorage.token = vToken || "";
      window.localStorage.isApp = true;
    }

    let currentRoute = this.$route.path;
    const originalHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    window.addEventListener("resize", () => {
      let resizeHeight =
        document.documentElement.clientHeight || document.body.clientHeight;

      if (currentRoute !== "/")
        that.$store.state.main.showTab = resizeHeight >= originalHeight;
    });

    // 检测横屏状态
    window.addEventListener(
      "onorientationchange" in window ? "orientationchange" : "resize",
      hengshuping,
      false
    );

    function hengshuping() {
      if (window.orientation == 180 || window.orientation == 0) {
        that.$store.state.main.showTab = true;
        onResize();
      }
      if (window.orientation == 90 || window.orientation == -90) {
        that.$store.state.main.showTab = false;
        onResize();
      }
    }

    var hiddenProperty =
      "hidden" in document
        ? "hidden"
        : "webkitHidden" in document
        ? "webkitHidden"
        : "mozHidden" in document
        ? "mozHidden"
        : null;
    document.addEventListener("visibilitychange", () => {
      if (document[hiddenProperty]) {
        onResize();
      } else {
        onResize();
      }
    });
    window.onresize = onResize;
    // 返回重新设置字体大小
    let backStatus;
    let backHref;
    if (localStorage.backStatus) backStatus = localStorage.backStatus;
    if (sessionStorage["gameHref"]) {
      backHref = JSON.parse(sessionStorage["gameHref"]);
    }
    window.addEventListener(
      "popstate",
      function (e) {
        if (navigator.userAgent.includes("MQQBrowser") && backStatus) {
          this.$router.push({
            path: backHref,
          });
          localStorage.setItem("backStatus", false);
        }
        onResize();
      },
      false
    );

    // 网络状态监听
    if (navigator.connection) {
      navigator.connection.addEventListener("change", () => {
        const { rtt, downlink, effectiveType, saveData } = navigator.connection;
        console.log(`有效网络连接类型: ${effectiveType}`);
        console.log(`估算的下行速度/带宽: ${downlink}Mb/s`);
        console.log(`估算的往返时间: ${rtt}ms`);
        console.log(`打开/请求数据保护模式: ${saveData}`);

        if (!navigator.onLine) {
          this.showAlert = true;
          this.className = "neteWork";
          this.$store.state.main.iosAlert.content =
            "当前网络不可用,请检查网络后重试";
          this.$store.state.main.iosAlert.show = true;
          this.$store.state.main.iosAlert.okText = "确定";
          this.$store.state.main.iosAlert.showNo = false;
        }
      });
    } else {
      window.onLine = true;
      setInterval(() => {
        if (navigator.onLine) {
          window.onLine = true;
        } else {
          if (window.onLine) {
            window.onLine = false;
            this.showAlert = true;
            this.className = "neteWork";
            this.$store.state.main.iosAlert.content =
              "当前网络不可用,请检查网络后重试";
            this.$store.state.main.iosAlert.show = true;
            this.$store.state.main.iosAlert.okText = "确定";
            this.$store.state.main.iosAlert.showNo = false;
          }
        }
      }, 500);
    }

    // app webview 传递参数
    if (
      this.$route.query.app === "android" &&
      window.android &&
      typeof window.android.getInfo === "function"
    ) {
      delete localStorage.token;
      delete localStorage.url;
      const androidInfoStr = window.android.getInfo();
      if (typeof androidInfoStr === "string") {
        try {
          const androidInfo = JSON.parse(androidInfoStr);
          window.localStorage.token = androidInfo.token || "";
          window.localStorage.url = androidInfo.url || "";
        } catch (e) {
          delete localStorage.token;
          delete localStorage.url;
        }
      }
    }

    // 设置title
    window.document.title = this.$config.title;

    // 初始化主题
    if (!localStorage.theme) {
      this.$store.state.main.theme = this.$config.theme;
      localStorage.theme = this.$config.theme;
    }
    this.changeTheme();
    // 初始化平台
    if (window.isAndroid) {
      window.document.documentElement.classList.add("android");
    } else {
      window.document.documentElement.classList.add("iphone");
    }
    // 针对键盘弹出的处理
    if (window.isAndroid) {
      const originalHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      window.addEventListener("resize", () => {
        let resizeHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        const blur = resizeHeight >= originalHeight;
        if (this.$route.path.includes("/save/") && blur) {
          this.$store.state.main.keyBoardStatus = false;
        }
        if (this.$route.name === "login" || this.$route.name === "register") {
          that.$store.state.main.showTab = blur;
        }
        document.querySelector(".auto-box-header").style.position = blur
          ? "fixed"
          : "absolute";
      });
    } else if (
      !/(linux|win)/.test(window.navigator.platform.toString().toLowerCase())
    ) {
      let task = null;
      window.document.documentElement.addEventListener(
        "focus",
        (evt) => {
          if (evt.target.tagName === "INPUT") {
            if (
              this.$route.name === "login" ||
              this.$route.name === "register"
            ) {
              setTimeout(() => {
                that.$store.state.main.showTab = false;
                if (document.getElementById("wave")) {
                  document.getElementById("wave").style.visibility = "hidden";
                }

                if (document.querySelector(".auto-box-header")) {
                  document.querySelector(".auto-box-header").style.position =
                    "absolute";
                }
              }, 300);
              if (this.$config.name === "vnst" && this.$mobileDevice.isSafari) {
                setTimeout(() => {
                  document.querySelector(".cont-box").scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center",
                  });
                }, 200);
              }
              if (task) clearTimeout(task);
            }
            if (this.$route.path.includes("/save/")) {
              setTimeout(() => {
                if (document.querySelector(".scrollIntoViewBox")) {
                  document.querySelector(".scrollIntoViewBox").scrollIntoView({
                    behavior: "auto",
                    block: "center",
                    inline: "center",
                  });
                }
              }, 100);
            }
          }
        },
        true
      );
      window.document.documentElement.addEventListener(
        "blur",
        (evt) => {
          if (evt.target.tagName === "INPUT") {
            if (
              this.$route.name === "login" ||
              this.$route.name === "register"
            ) {
              task = setTimeout(() => {
                that.$store.state.main.showTab = true;
                if (document.getElementById("wave")) {
                  document.getElementById("wave").style.visibility = "visible";
                }

                if (document.querySelector(".auto-box-header")) {
                  document.querySelector(".auto-box-header").style.position =
                    "fixed";
                }
              }, 300);
            }
          }
        },
        true
      );
    }

    // 窗口切换后台后返回界面的处理
    this.$store.state.main.visibilityState = true;
    window.visibilityChangeManager.on((status) => {
      if (status) {
        setTimeout(() => {
          this.$store.state.main.visibilityState = true;
          this.$store.dispatch("user/refreshBalance", {
            callback: null,
          });
        }, 300);
      } else {
        this.$store.state.main.visibilityState = false;
      }
    });

    this.$store
      .dispatch("lottery/getAllPlayWay")
      .then((res) => {
        this.$store.commit("lottery/checkPlayWay");
      })
      .catch(() => {});
    this.$store.dispatch("main/gameSortV4Note");
    this.$store.dispatch("main/socketHandle");
    setTimeout(() => {
      // 'amxpj','kkqp','99qp','vnso','amhg',
      if(['betnew','839qp','tccp','tyc86','fhcp','hty','dqr','xpj83','js85','aqvns','cpxpj'].includes(this.$config.name) && this.$route.path === '/home' && (!this.userInfo || JSON.stringify(this.userInfo) == "{}")) {
        this.showHongBao =  true
      }
    }, 500);
  },
  mounted() {
    // sharetrace集成初始化 测
    setTimeout(() => {
      if (["103qp"].includes(this.$config.name)) {
        let str = window.location.href;
        let agent = localStorage["agent"] || localStorage["channelCode"];
        let par1 =
          "channelCode=" +
          agent +
          "&channelDomain=" +
          str.substring(0, this.find(str, "/", 2));
        let par2 = "channelDomain=" + str.substring(0, this.find(str, "/", 2));
        if (this.$config.name === "99qp") {
          if (
            localStorage["signer"] ||
            this.$store.state.main.downloadType === "superSign"
          ) {
            this.theAppKey = "bec5d1b55fae6bbd"; // 超级签
          } else {
            this.theAppKey = "eec4bb1cb24b3e2b"; // 企业签
          }
        } else if (this.$config.name === "kkqp") {
          if (
            localStorage["signer"] ||
            this.$store.state.main.downloadType === "superSign"
          ) {
            this.theAppKey = "85cf493a8c8a56ae"; // 超级签
          } else {
            this.theAppKey = "f21275580a0be8ff"; // 企业签
          }
        } else if (this.$config.name === "amxpj") {
          if (
            localStorage["signer"] ||
            this.$store.state.main.downloadType === "superSign"
          ) {
            this.theAppKey = "c336fd2ee19f948d"; // 超级签
          } else {
            this.theAppKey = "62392c363969406d"; // 企业签
          }
        } else if (this.$config.name === "fhcp") {
          if (
            localStorage["signer"] ||
            this.$store.state.main.downloadType === "superSign"
          ) {
            this.theAppKey = "7bb20fdcf47399ad"; // 超级签
          } else {
            this.theAppKey = "d0648a661f3e137d"; // 企业签
          }
        } else if(this.$config.name === 'js85'){
           this.theAppKey = '984da84b0d5c8e5b';
        } else if (this.$config.name === "xpj80") {
          this.theAppKey = "d445a197f1389dcf";
        } else if (this.$config.name === "vns81") {
          this.theAppKey = "e6e705a36eadcdda";
        } else if (this.$config.name === "tyc82") {
          this.theAppKey = "24347371257e5a7d";
        } else if (this.$config.name === "xpj83") {
          this.theAppKey = "18932ec4bbc49b6d";
        } else if (this.$config.name === "hty") {
          this.theAppKey = "e721ac3f4610abfc";
        } else if (this.$config.name === "dqr") {
          this.theAppKey = "30615fd30d7c4f0f";
        } else if (this.$config.name === "vnst") {
          par1 = "channelCode=" + str.substring(0, this.find(str, "/", 2));
          par2 = "channelCode=" + str.substring(0, this.find(str, "/", 2));
          this.theAppKey = "053ca21e689c4dcd";
        } else if (this.$config.name === "103qp") {
          if (
            localStorage["signer"] ||
            this.$store.state.main.downloadType === "superSign"
          ) {
            this.theAppKey = "c938d45c3d7233fc"; // 超级签
          } else {
            this.theAppKey = "e7b92534b318d07e"; // 企业签
          }
        } else if (this.$config.name === "vnso") {
          if (
            localStorage["signer"] ||
            this.$store.state.main.downloadType === "superSign"
          ) {
            this.theAppKey = "0a90b4ac1dff118f"; // 超级签
          } else {
            this.theAppKey = "86d30dc0d6c57a7f"; // 企业签
          }
        }
        ShareTrace.init({
          appkey: this.theAppKey, // 此值必填
          param: agent ? par1 : par2,
          success: () => {
            setTimeout(() => {
              this.$store.commit("main/setShareTrace", ShareTrace);
            }, 600);
          },
        });
      }
    }, 300);
    // 是否调用红包雨的接口
    if (this.$config.showRedPacket) {
      this.isShowpack();
    }
    if (
      this.$device.isIphone &&
      !/(linux|win)/.test(window.navigator.platform.toString().toLowerCase())
    ) {
      let task = null;
      this.$refs.app.addEventListener(
        "focus",
        () => {
          if (this.$route.name === "login" || this.$route.name === "register") {
            this.$store.state.main.showTab = false;
            if (task) clearTimeout(task);
          }
        },
        true
      );
      this.$refs.app.addEventListener(
        "blur",
        () => {
          if (this.$route.name === "login" || this.$route.name === "register") {
            task = setTimeout(() => {
              this.$store.state.main.showTab = true;
            }, 300);
          }
        },
        true
      );
    }
    this.refreshTabHeight();
    // 解决ios上vant键盘放大缩小
    document
      .getElementsByClassName("van-number-keyboard")[0]
      .addEventListener("touchstart", function (event) {
        if (event.touches.length >= 2) {
          event.preventDefault();
        }
      });
    document
      .getElementsByClassName("van-number-keyboard")[0]
      .addEventListener("touchmove", function (event) {
        if (event.touches.length >= 2) {
          event.preventDefault();
        }
      });
    document
      .getElementsByClassName("van-number-keyboard")[0]
      .addEventListener("touchend", function (event) {
        if (event.touches.length >= 2) {
          event.preventDefault();
        }
      });
    if (this.$mobileDevice.isSafari) {
      document
        .getElementsByClassName("van-number-keyboard")[0]
        .addEventListener("touchend", function (event) {
          let now = Date.now();
          if (now - this.lastTouchEnd <= 300) {
            event.preventDefault();
          }
          this.lastTouchEnd = now;
        });
    }

    // 投注列表页，点击筛选按钮后，按住蒙层页面能滑动
    document
      .getElementsByClassName("mask")[0]
      .addEventListener("touchmove", function (event) {
        event.preventDefault();
      });
    /* 禁止ios缩放，双击和双指 */
    let preLastTouchStartAt = 0;
    let lastTouchStartAt = 0;
    const delay = 500;

    document.addEventListener("touchstart", () => {
      preLastTouchStartAt = lastTouchStartAt;
      lastTouchStartAt = +new Date();
    });
    document.addEventListener("touchend", (event) => {
      const touchEndAt = +new Date();
      if (touchEndAt - preLastTouchStartAt < delay) {
        event.preventDefault();
        // event.target.click();
      }
    });
    if (!document.querySelector(".statistics")) {
      this.statistics();
    }
  },
  updated() {
    this.refreshTabHeight();
  },
  methods: {
    clickDownload() {
      this.showHongBao = false;
      this.onDownload();
    },
    goBindBannk() {
      this.$store.commit("main/setBindBank", false);
      this.$store.commit("main/setActiveId", 0);
      this.$router.push("/take");
    },
    goDownload() {
      this.$store.commit("main/setBindBank", false);
      this.$store.commit("main/setActiveId", 0);
      this.$store.commit("main/setBindBankMsg", "");
      this.onDownload();
    },
    stopTime() {
      if (!this.isGoTime) return false;
      if (!this.phone || !/^1[\d]{10}$/.test(this.phone)) {
        this.toastText("请输入正确的手机号");
        return false;
      }
      this.$store.dispatch("user/getPhoneCode", {
        phone: this.phone,
        callback: (res) => {
          if (res.code === 200) {
            this.toastText("短信验证码已发送，5分钟内有效");
            this.isGoTime = false;
            this.interval = setInterval(() => {
              this.stepTime--;
              if (this.stepTime < 0) {
                this.isGoTime = true;
                this.stepTime = 60;
                clearInterval(this.interval);
              }
            }, 1000);
          } else {
            this.isGoTime = true;
            this.toastText(res.message);
          }
        },
      });
    },
    bindClose() {
      this.$store.commit("main/setShowBindPhone", false);
    },
    bindPhone() {
      if (!this.phone || !/^1[\d]{10}$/.test(this.phone)) {
        this.toastText("请输入正确的手机号");
      } else if (!this.sms || this.sms.length !== 6) {
        this.toastText("请输入正确的验证码");
      } else {
        this.$store.dispatch("user/validateSmsPhone", {
          phone: this.phone,
          code: this.sms,
          callback: (res) => {
            if (res.code === 200) {
              this.toastText(res.message);
              this.$store.commit("main/setShowBindPhone", false);
              if (
                this.$route.path === "/activity/content/" &&
                this.$store.state.main.activeId &&
                this.$store.state.main.activeId !== ""
              ) {
                this.$store
                  .dispatch(
                    "main/applyActivity",
                    this.$store.state.main.activeId
                  )
                  .then((res) => {
                    if (res.code === 5012) {
                      this.$store.commit("main/setBindBankMsg", res.message);
                      this.$store.commit("main/setBindBank", true);
                    }
                    this.$store.commit("main/setActiveId", 0);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                this.$store.dispatch("user/refreshInfo");
                if (
                  this.$store.state.main.config.depositBankValidate == "on" &&
                  this.$store.state.user.userInfo.cardNum == "unset"
                ) {
                  this.$store.commit("main/setBindBankMsg", "绑定银行卡");
                  this.$store.commit("main/setBindBankId", 5012);
                  this.$store.commit("main/setBindBank", true);
                } else {
                  this.$router.push("/save");
                }
              }
            } else {
              this.toastText(res.message);
            }
          },
        });
      }
    },
    initTask() {
      // 获取初始化数据
      const getNext = () => {
        if (this.$store.state.main.config) {
          if (this.$store.state.main.config.close.status === "on") {
            this.$router.push("/code/5000");
            return;
          }
          this.$store.dispatch("agency/getRefundRebate").then(() => {
            this.$store.commit("lottery/checkPlayWay");
            this.$store.dispatch("user/refreshBalance", {
              callback: (res) => {
                if (res.code && res.code !== 200) {
                  if (
                    res.message.includes("设备上登录") ||
                    res.message.includes("请登录")
                  ) {
                    this.$store.commit("user/clean");
                    setTimeout(() => {
                      if (!localStorage.token) {
                        this.toastText(res.message, "top");
                        this.$router.push("/");
                        this.$stomp.reInit();
                      }
                    }, 1000);
                  }
                }
              },
            });

            this.$store.dispatch("user/refreshBank").then();
            this.$store.dispatch("user/refreshUsdt").then();
          });
          // 刷新未读消息数量
          this.$store.dispatch("user/refreshMsgCount").then();

          const url = this.$store.state.main.config["service"].find(
            (item) => item.status === "on"
          );
          if (url) {
            const tab = this.tabs.find((item) => item.name === "客服");
            if (tab) {
              tab.link = url.url;
            }
          }
        } else {
          this.$store.state.main.config = JSON.getObjByLocalStorage("config");
          if (this.$store.state.main.config) {
            getNext();
          } else {
            this.$store.dispatch("main/getConfigVerify").then(() => {
              if (this.$store.state.main.config) {
                getNext();
              } else {
                this.toastText("网络错误", "top");
              }
            });
          }
        }
      };
      // this.$store
      //   .dispatch("main/getWebSocket")
      //   .then((res) => {
      //     this.$stomp.init(res.data["wss"]);

      //     this.$stomp.on("user.rebateBonus", (res) => {
      //       this.userMessage(res);
      //     });

      //     this.$stomp.on("user.withdrawCheck", (res) => {
      //       this.userMessage(res);
      //     });

      //     this.$stomp.on("user.lottery", (res) => {
      //       this.userMessage(res);
      //     });

      //     this.$stomp.on("user.DepositOfflineAudit", (res) => {
      //       this.userMessage(res);
      //     });

      //     this.$stomp.on("user.DepositOnlineAudit", (res) => {
      //       this.userMessage(res);
      //     });

      //     this.$stomp.on("user.WithdrawalsAudit", (res) => {
      //       this.userMessage(res);
      //     });

      //     this.$stomp.on("user.DepositOfflineAudit", (res) => {
      //       this.userMessage(res);
      //     });

      //     this.$stomp.on("user.DepositOnlineAudit", (res) => {
      //       this.userMessage(res);
      //     });

      //     this.$stomp.on("user.WithdrawalsAudit", (res) => {
      //       this.userMessage(res);
      //     });

      //     this.$stomp.on("user.EmergencyFinance", (res) => {
      //       this.userMessage(res);
      //     });
      //     // 开奖socket
      //     this.$stomp.on("user.prizePool", (res) => {
      //       this.initKaiJiang(res);
      //     });
      //     // 中奖名单列表
      //     // this.$stomp.on('user.prizePoolList', res=>{
      //     //   res.data.filter(ff=> ff.uid)
      //     //   res.data.forEach(element => {
      //     //     if (element.uid == this.$store.state.user.userInfo.uid) {
      //     //       let data = {
      //     //         lotteryName:'',
      //     //         amount: ''
      //     //       }
      //     //       data.lotteryName = element.lotteryName,
      //     //       data.amount = element.amount
      //     //       this.initKaiJiang(data)
      //     //     }
      //     //   });
      //     // })
      //     // 奖池数字socket
      //     // 彩金池奖池数据
      //     // this.$stomp.on('user.lotteryJackpot', res=>{
      //     //   console.log(res)
      //     // })
      //   })
      //   .catch((err) => {
      //     console.warn(err);
      //     console.log("获取websocket链接失败");
      //   });
      getNext();
      this.$store
        .dispatch("user/refreshInfo")
        .then(() => {
          getNext();
        })
        .catch(() => {
          getNext();
        });
    },
    find(str, cha, num) {
      var x = str.indexOf(cha);
      for (var i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1);
      }
      return x;
    },
    statistics() {
      let head = document.head || document.getElementsByTagName("head")[0];
      let script = document.createElement("script");
      let div = document.createElement("div");
      div.classList = "statistics";
      div.style.position = "fixed";
      div.style.left = "-9999px";
      div.style.top = "-9999px";
      switch (this.$config.name) {
        case "kkqp":
          script.setAttribute(
            "src",
            "https://v1.cnzz.com/z_stat.php?id=1279554176&web_id=1279554176"
          );
          break;
        case "99qp":
          script.setAttribute(
            "src",
            "https://s4.cnzz.com/z_stat.php?id=1279554172&web_id=1279554172"
          );
          break;
        case "vnst":
          script.setAttribute(
            "src",
            "https://s4.cnzz.com/z_stat.php?id=1279554174&web_id=1279554174"
          );
          break;
        case "amxpj":
          script.setAttribute(
            "src",
            "https://s4.cnzz.com/z_stat.php?id=1279554169&web_id=1279554169"
          );
          break;
        case "vnso":
          script.setAttribute(
            "src",
            "https://v1.cnzz.com/z_stat.php?id=1279815692&web_id=1279815692"
          );
          break;
        case "xpj80":
          script.setAttribute(
            "src",
            "https://s9.cnzz.com/z_stat.php?id=1280133603&web_id=1280133603"
          );
          break;
        case "tyc82":
          script.setAttribute(
            "src",
            "https://v1.cnzz.com/z_stat.php?id=1280133979&web_id=1280133979"
          );
          break;
        case "vns81":
          script.setAttribute(
            "src",
            "https://s4.cnzz.com/z_stat.php?id=1280133982&web_id=1280133982"
          );
          break;
        case 'dqr':
          if(window.origin='https://v88575.com'){
            script.setAttribute(
            "src",
            "https://hm.baidu.com/hm.js?44b8de9fa4cced1aa4c79161a1a8fb82"
          );
          } else if(window.origin='https://v88582.com') {
             script.setAttribute(
            "src",
            "https://hm.baidu.com/hm.js?563ac4f0909bebee409016620fd62ece"
          );
          }
          break;  
      }
      div.appendChild(script);
      head.appendChild(div);
    },
    //判断红包雨是否出现
    isShowpack() {
      localStorage.removeItem("hongbaoyuShow");
      if (this.$store.state.user.token) {
        this.$store.dispatch("main/getHongboayuDraw", "A0018").then((res) => {
          if (res.data.code == 200) {
            if (res.data.data == "已领取") {
              this.$store.commit("main/getShowRedPackRain", false);
              this.$store.commit("main/setCloseRedPackRain", false);
            } else {
              this.$store.commit("main/getShowRedPackRain", true);
              this.$store.commit("main/setCloseRedPackRain", true);
            }
          }
        });
      } else {
        this.$store.commit("main/getShowRedPackRain", true);
        this.$store.commit("main/setCloseRedPackRain", true);
      }
    },
    animate(a) {
      if (
        this.$route.path === "/admin/login" &&
        this.$config.home === "qp" &&
        !this.$config.newQP
      ) {
      } else {
        return a;
      }
    },
    onStopOk() {
      this.$store.commit("main/stopDialog", false);
    },
    initKaiJiang(res) {
      if (res && res.data) {
        this.$store.commit("main/isShowMask", {
          page: "",
          status: true,
        });
        this.kaijiangDate = res.data;
        this.kaijiang = true;
      }
    },
    isKaijing() {
      this.$store.commit("main/isShowMask", {
        page: "",
        status: false,
      });
      this.kaijiang = false;
      let style = "";
      if (this.$route.params.series == 10011) {
        style = "color: #E9CB53; font-weight:400";
      } else {
        style = "color: #FE1300;font-weight:400";
      }
      this.$store.commit("main/getLottery", {
        uid: this.kaijiangDate.uid,
        lotteryId: this.kaijiangDate.lotteryId,
        text: `<span>
                                        ${this.kaijiangDate.mode
                                          .replace(
                                            "%%",
                                            '<span class="user">' +
                                              this.kaijiangDate.userName +
                                              "</span>"
                                          )
                                          .replace(
                                            "%%",
                                            '<span class="lottery_name">【' +
                                              this.kaijiangDate.lotteryName +
                                              "】</span>"
                                          )
                                          .replace(
                                            "%%",
                                            '<span class="money" style="' +
                                              style +
                                              '">' +
                                              this.kaijiangDate.amount +
                                              "</span>"
                                          )}
                    </span>`,
      });
    },
    getQueryString(name) {
      var after = window.location.href;
      if (after.indexOf("?") === -1) return null; // 如果url中没有传参直接返回空
      // key存在先通过search取值如果取不到就通过hash来取
      after =
        after.substr(after.indexOf("?") + 1) ||
        window.location.hash.split("?")[1];
      if (after) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = after.match(reg);
        if (r != null) {
          return decodeURIComponent(r[2]);
        } else {
          return null;
        }
      }
    },
    onNumberBlur() {
      setTimeout(() => {
        this.$store.state.key.show = false;
        this.$store.state.key.target = null;
      }, 0);
    },
    refreshTabHeight() {
      if (this.$refs.tab) {
        if (window.navigator.userAgent.toString().includes("QHBrowser")) {
          this.$refs["tab"].$el.style.top = "99%";
        }
        this.$store.state.main.tabHeight = this.$refs.tab.$el.clientHeight;
      } else {
        this.$store.state.main.tabHeight = 0;
      }
      if (this.$refs["number-keyboard"]) {
        this.$store.state.key.height =
          this.$refs["number-keyboard"].$el.clientHeight;
      } else {
        this.$store.state.key.height = 0;
      }
    },
    closeMask() {
      if (this.showMask) {
        setTimeout(() => {
          this.$store.commit("main/isCloseMask", {
            page: this.showMask.page,
            status: false,
          });
        }, 100);
      }
    },
    userMessage(res) {
      if (res.message) {
        this.$dialog
          .alert({
            title: res["typeName"] || "温馨提示",
            message: res.message
              .toString()
              .replace(/\|/g, "\n")
              .replace(
                /【([^【】]+)】/g,
                '<span style="color: red;">$1</span>'
              ),
            className: "van-dialog-message",
          })
          .then(() => {});
      }
    },
    tabChange(item) {
      let curr = this.$route.path;
      if (
        this.$config.name === "103qp" &&
        this.$route.query["channelCode"] &&
        item.link === "/download"
      ) {
        window.open(
          `https://xianluu.github.io/xianlu/103dl/m/index.html?channelCode=${this.$route.query["channelCode"]}&code=1`
        );
      } else {
        if (
          item.link === "/home" ||
          item.link === "/user" ||
          item.link === "/download" ||
          item.link === "/activity" 
        ) {
          if (curr !== item.link) {
            this.$router.push({
              path: item.link,
            });
          }
        } else if (
          item.link === "/user/change-money" &&
          ["mode_c", "mode_d_a"].includes(this.personalMode)
        ) {
          this.toastText("暂未开放", "middle");
        } else if (
          item.link === "/save" ||
          item.link === "/user/record" ||
          item.link === "/user/invite" ||
          item.link === "/user/change-money" ||
          item.link === "/user/result" ||
          item.link === "/user/message" ||
          item.link === "/user/agency-center-new"
        ) {
          if (!this.$store.state.user.token) {
            if (curr !== "/admin/login") {
              this.$router.push({
                path: "/admin/login",
                replace: true,
              });
            }
          } else {
            if (curr !== item.link) {
              if (item.link === "/user/invite") {
                //  this.userInfo["is_agency"]
                //   ? this.$router.push("/user/invite/agency") : this.$router.push("/user/invite/member");
                this.userInfo["is_agency"]
                  ? this.$router.push("/user/invite/agency")
                  : this.personalMode === "no"
                  ? this.$router.push("/user/no-invite/member")
                  : this.$router.push("/user/invite/member");
              } else {
                this.$router.push(item.link);
              }
            }
          }
        } else if(this.$config.name ==='aqvns' && item.link === "/user/invite/agency"){
          if (curr !== item.link) {
            this.$router.push({
              path: item.link,
            });
          }
        }
      }
      //保存首页进入的url地址
      if (item.name == "投注记录") {
        let url = window.location.href.replace("user/record", "home");
        localStorage.setItem("local-url", encodeURIComponent(url));
      }
    },
    changeTheme() {
      const classList = window.document.documentElement.classList;
      for (let i = 0; i < classList.length; i++) {
        if (classList[i].toString().includes("theme-")) {
          window.document.documentElement.classList.remove(
            classList[i].toString()
          );
        }

        if (classList[i].toString().includes("home-")) {
          window.document.documentElement.classList.remove(
            classList[i].toString()
          );
        }
      }
      window.document.documentElement.classList.add(
        "theme-" + this.$store.state.main.theme
      );
      window.document.documentElement.classList.add(
        "home-" + this.$config.home
      );
      if (this.$config.newQP || this.$config.blackTheme) {
        window.document.documentElement.classList.add("theme-newqp");
      }
      if (this.$config.blush) {
        window.document.documentElement.classList.add("theme-blush");
      }
    },
    isShowYuEBao() {
      if (!this.$store.state.user.isShowYuEBao) {
        this.$store
          .dispatch("user/yuebaoOpenStatus")
          .then((res) => {
            if (res.code === 200)
              this.$store.commit("user/setIsShowYuEBao", res.data);
          })
          .catch(() => {});
      }
    },
    JiebeiInfo() {
      if (JSON.stringify(this.$store.state.user.jieBeiData) === "{}") {
        this.$store
          .dispatch("user/activityJiebeiJieHuanInfo")
          .then((res) => {
            if (res.code === 200)
              this.$store.commit("user/setJieBeiData", res.data);
          })
          .catch(() => {});
      }
    },
    isShowSignin() {
      if (!this.$store.state.user.isShowSignin) {
        this.$store
          .dispatch("user/onSignin", {
            type: "display",
          })
          .then((res) => {
            if (res.code === 200)
              this.$store.commit("user/setIsShowSignin", res.data.display);
          })
          .catch(() => {});
      }
    },
    setShowSaveFailure(bool) {
      this.$store.commit("main/setShowSaveFailure", bool);
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
    this.$store.commit("main/isShowMask", {
      page: "",
      status: false,
    });
  },
};
</script>

<style lang="less">
@import "./style/reset.css";
@import "./style/theme/index.less";

html,
body,
#app {
  -webkit-overflow-scrolling: auto;
  height: 100%;
  position: absolute;
  width: 100%;
}
.hongBao,
.other-hongBao {
  position: absolute;
  left: 50%;
  top: 43%;
  transform: translate3d(-50%, -50%, 0) scale(0);
  transition: all 400ms;
  transform-origin: top;
  .hongBao-bg {
    width: 6.2rem;
  }
  .hongBao-btn {
    position: absolute;
    top: 8.45rem;
    left: 1.64rem;
    width: 3.11rem;
  }
  .hongBao-close {
    position: absolute;
    right: -0.08rem;
    top: 2.36rem;
    width: 0.64rem;
    height: 0.64rem;
    background-color: #444444;
    border-radius: 50%;
    color: #ffffff;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.other-hongBao {
    .hongBao-btn {
      height: 1rem;
    }
  }
}

.bindPhone {
  position: absolute;
  left: 50%;
  top: 48%;
  width: 6.92rem;
  height: 6.7rem;
  background-color: #fff;
  border-radius: 0.2rem;
  font-family: PingFangTC-Regular, PingFangTC;
  overflow: hidden;
  transform: translate3d(-50%, -50%, 0) scale(0);
  transition: all 400ms;
  transform-origin: top;
  .bindClose {
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    color: #999;
  }
  .info {
    height: 5.66rem;
    padding: 0.55rem 0.45rem 0;
    text-align: left;
  }
  .head {
    font-size: 0.29rem;
  }
  .tit {
    color: #333333;
    font-size: 0.36rem;
    margin-top: 0.2rem;
  }
  .tip {
    color: #666666;
    font-size: 0.29rem;
    margin-top: 0.3rem;
    line-height: 0.4rem;
    span {
      color: #ff8000;
    }
  }
  .btn {
    width: 100%;
    height: 1.04rem;
    line-height: 1.04rem;
    color: #fff;
    font-size: 0.4rem;
  }
  .user-input-row {
    padding-left: 0rem !important;
    height: 0.8rem !important;
    line-height: 0.8rem !important;
    .input {
      height: 0.6rem !important;
      line-height: 0.6rem !important;
      font-size: 0.4rem !important;
    }
    &::after {
      left: 0 !important;
      top: 98% !important;
      margin-right: 0.1rem !important;
    }
  }
  .sms {
    height: 0.8rem !important;
    line-height: 0.8rem !important;
    position: relative;
    .getSms {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0.45rem;
      width: 1.88rem;
      height: 0.51rem;
      line-height: 0.51rem;
      background: #ffffff;
      border-radius: 0.07rem;
      font-size: 0.29rem;
      text-align: center;
    }
  }
}

.mask {
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.36);
}
.my-toast-text {
  width: 3rem;
  padding-left: 0.33rem;
  line-height: 0.5rem;
  font-size: 0.34rem;
}
.my-toast-loading {
  width: 1.4rem;
  min-height: 1.4rem;
  padding: 0.3rem;

  .van-toast__text {
    font-weight: 400;
    font-size: 0.32rem;
    margin-top: 0.2rem;
  }

  .van-toast__loading {
    padding: 0;
  }

  .van-loading__spinner {
    width: 0.65rem;
    height: 0.65rem;

    i {
      &:before {
        width: 0.06rem;
        height: 25%;
      }
    }
  }
}

.blackTabs {
  background-color: #000 !important;
  border-top: none !important;
  .van-tabbar-item {
    color: #fff !important;
    .van-tabbar-item__text {
      font-size: 0.25rem !important;
      font-family: STHeiti, Microsoft YaHei, \\5fae\8f6f\96c5\9ed1, SimSun,
        \\5b8b\4f53, arial;
    }
    &.van-tabbar-item--active {
      color: #c62721 !important;
      background-color: transparent;
    }
  }
  &.new-qpTabs {
    position: fixed;
    .van-tabbar-item {
      color: #fff !important;
      &.van-tabbar-item--active {
        color: #f6cf32 !important;
      }
    }
  }
  &.fhcpTabs {
    .van-tabbar-item--active {
      background-color: transparent !important;
    }
  }
}

.greenTabs {
  background-image: linear-gradient(
    180deg,
    #069c72,
    #058d67,
    #047e5c,
    #046f51,
    #046147
  );
  border-radius: 0.4rem 0.4rem 0 0;

  &.van-tabbar {
    border-top: none;
  }

  .van-tabbar-item {
    color: #96b39e !important;
    .van-tabbar-item__icon {
    }

    .van-tabbar-item__text {
      color: #fff;
    }
  }

  .van-tabbar-item--active {
    background-color: transparent;

    .van-tabbar-item__icon {
      color: #fee21a;
    }

    .van-tabbar-item__text {
      color: #fee21a;
    }
  }
}

.van-tabbar {
  height: 1.16rem !important;
  bottom: unset;
  top: 100%;
  -webkit-transform: translateY(-100%);
  transform: translateY(-100%);
  background-color: #fff;
  height: 1.16rem;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-top: 0.02rem solid hsl(0, 0%, 95%);
  position: absolute;

  .van-tabbar-item {
    //display: flex !important;
    //align-items: center !important;
    color: #555555;
  }
}
.amhgTabs {
  height: 1rem !important;
  border: none;
  .van-tabbar-item {
    color: #afafbb !important;
    .van-tabbar-item__icon {
      line-height: 0.55rem;
      .iconfont {
        font-size: 0.38rem !important;
      }
    }
    .van-tabbar-item__text {
      font-size: 0.24rem !important;
      font-family: PingFang SC;
    }
    &.van-tabbar-item--active {
      color: #1b1f22 !important;
      .van-tabbar-item__icon {
        width: 0.9rem;
        height: 0.9rem;
        border-top-left-radius: 50%;
        border-top-right-radius: 50%;
        background: #fff;
        margin-top: -18px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        .tab-icon {
          width: 0.7rem;
          height: 0.7rem;
          line-height: 0.7rem;
          margin: 0 auto;
          border-radius: 50%;
          background: #ecbd49;
          margin-top: 0.1rem;
        }
        .iconfont {
          color: #fff;
        }
      }
      .van-tabbar-item__text {
        margin-top: -0.02rem;
        z-index: 1;
      }
    }
  }
}

.van-tabbar-item__icon {
  // height: 0.44rem;
  // line-height: 0.44rem;
  height: 0.54rem;
  line-height: 0.54rem;
  margin-bottom: 0 !important;
}

.van-tabbar-item__icon,
.tab-icon {
  font-size: 0.44rem !important;
}

.tab-icon-bet {
  font-size: 0.44rem !important;
}

.van-tabbar-item__text {
  //text-indent: -0.1rem;
  font-size: 0.26rem !important;
  list-style: 0.26rem;
}

.key-del {
  font-size: 0.8rem !important;
}

.van-key {
  height: 0.99rem;
  line-height: 0.99rem;
  font-size: 0.6rem;
  font-weight: 400;
}

.van-key--gray {
  font-size: 0.349rem;
}

.van-number-keyboard__close {
  font-size: 0.349rem;
}

.van-number-keyboard {
  -webkit-touch-callout: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  user-select: none;
  .van-hairline--top {
    &:after {
      content: none;
      display: none;
    }
  }

  .van-number-keyboard__body {
    .van-hairline {
      &:after {
        border-bottom: none;
      }
    }
  }
}

.black-keyboard {
  background-color: #161616;
  .van-key {
    background: linear-gradient(180deg, #171717, #0b0b0b);
    color: #fff;
    border: 0.02rem solid #373737;
  }
  .van-number-keyboard__close,
  .h5-icon-qingchu {
    color: #fbd67a !important;
  }
}

.theme-newqp .betLottery-k3 .black-keyboard {
  .van-number-keyboard__close,
  .h5-icon-qingchu {
    color: #fbd67a !important;
  }
}

.atabs {
  &:after {
    content: none;
    border-bottom: none !important;
  }
}
.blushBar {
  width: 100%;
  height: 1.5rem !important;
  background: url("./assets/img/home/blush/redB.png") -0.082rem;
  background-size: 100% 100%;
  border-top: 0;
  padding-top: 0.3rem;
  &:after {
    content: none;
    border-bottom: none !important;
  }
  .van-tabbar-item {
    color: #fff !important;
    &.van-tabbar-item--active {
      color: #e3b237 !important;
    }
  }
  .van-tabbar-item:nth-child(3) {
    &:after {
      content: "";
      position: absolute;
      bottom: 0.32rem;
      height: 0.94rem;
      width: 0.94rem;
      background-blend-mode: normal, normal;
      border-radius: 100%;
      z-index: 0;
      background-image: linear-gradient(-180deg, #eed187, #e3b237);
    }
    .van-tabbar-item__icon {
      display: none;
      z-index: 600;
      margin-top: -0.9rem;
    }
    .van-tabbar-item__text {
      z-index: 601;
      margin-top: -0.45rem;
      font-size: 0.3rem !important;
      font-weight: 600;
      color: #000;
    }
  }

  &.tccpBar {
    .van-tabbar-item--active {
      background-color: transparent !important;
    }
  }
}

.msg-count {
  position: absolute;
  top: -0.1rem;
  left: 45%;
  color: #ffffff;
  background-color: #ff4021;
  font-size: 0.4rem;
  transform: scale(0.5);
  display: block;
  height: 0.56rem;
  width: 0.56rem;
  line-height: 0.56rem;
  text-align: center;
  border-radius: 0.28rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// .slide-left-enter-active {
//   transition: all 450ms ease;
//   position: absolute;
//   left: 0;
//   top: 0;
//   height: 100%;
// }

// .slide-left-leave-active {
//   transition: all 450ms ease;
//   position: absolute;
//   left: 0;
//   top: 0;
//   height: 100%;
// }

// .slide-left-enter {
//   transform: translate3d(100%, 0, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-left-enter-to {
//   transform: translate3d(0, 0, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-left-leave {
//   transform: translate3d(0, 0, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-left-leave-to {
//   transform: translate3d(-100%, 0, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-right-enter-active {
//   transition: all 450ms ease;
//   position: absolute;
//   left: 0;
//   top: 0;
//   height: 100%;
// }

// .slide-right-leave-active {
//   transition: all 450ms ease;
//   position: absolute;
//   left: 0;
//   top: 0;
//   height: 100%;
// }

// .slide-right-enter {
//   transform: translate3d(-100%, 0, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-right-enter-to {
//   transform: translate3d(0, 0, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-right-leave {
//   transform: translate3d(0, 0, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-right-leave-to {
//   transform: translate3d(100%, 0, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-down-enter-active {
//   transition: all 450ms ease;
//   position: absolute;
//   left: 0;
//   top: 0;
//   width: 100%;
// }

// .slide-down-leave-active {
//   transition: all 450ms ease;
//   position: absolute;
//   left: 0;
//   top: 0;
//   width: 100%;
// }

// .slide-down-enter {
//   transform: translate3d(0, -100%, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-down-enter-to {
//   transform: translate3d(0, 0, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-down-leave {
//   transform: translate3d(0, 0, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-down-leave-to {
//   transform: translate3d(0, 100%, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-up-enter-active {
//   transition: all 450ms ease;
//   position: absolute;
//   left: 0;
//   top: 0;
//   width: 100%;
// }

// .slide-up-leave-active {
//   transition: all 450ms ease;
//   position: absolute;
//   left: 0;
//   top: 0;
//   width: 100%;
// }

// .slide-up-enter {
//   transform: translate3d(0, 100%, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-up-enter-to {
//   transform: translate3d(0, 0, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-up-leave {
//   transform: translate3d(0, 0, 0);
//   -webkit-backface-visibility: hidden;
// }

// .slide-up-leave-to {
//   transform: translate3d(0, -100%, 0);
//   -webkit-backface-visibility: hidden;
// }
.slide-left-enter-active {
  transition: all 450ms ease;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}

.slide-left-leave-active {
  transition: all 450ms ease;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}

.slide-left-enter {
  transform: translate3d(100%, 0, 0);
  -webkit-backface-visibility: hidden;
}

.slide-left-enter-to {
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
}

.slide-left-leave {
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
}

.slide-left-leave-to {
  transform: translate3d(-100%, 0, 0);
  -webkit-backface-visibility: hidden;
}

.slide-right-enter-active {
  transition: all 450ms ease;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}

.slide-right-leave-active {
  transition: all 450ms ease;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}

.slide-right-enter {
  transform: translate3d(-100%, 0, 0);
  -webkit-backface-visibility: hidden;
}

.slide-right-enter-to {
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
}

.slide-right-leave {
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
}

.slide-right-leave-to {
  transform: translate3d(100%, 0, 0);
  -webkit-backface-visibility: hidden;
}

.slide-down-enter-active {
  transition: all 450ms ease;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}

.slide-down-leave-active {
  transition: all 450ms ease;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}

.slide-down-enter {
  transform: translate3d(0, -100%, 0);
  -webkit-backface-visibility: hidden;
}

.slide-down-enter-to {
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
}

.slide-down-leave {
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
}

.slide-down-leave-to {
  transform: translate3d(0, 100%, 0);
  -webkit-backface-visibility: hidden;
}

.slide-up-enter-active {
  transition: all 450ms ease;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}

.slide-up-leave-active {
  transition: all 450ms ease;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}

.slide-up-enter {
  transform: translate3d(0, 100%, 0);
  -webkit-backface-visibility: hidden;
}

.slide-up-enter-to {
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
}

.slide-up-leave {
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
}

.slide-up-leave-to {
  transform: translate3d(0, -100%, 0);
  -webkit-backface-visibility: hidden;
}

.weui-dialog__bd {
  padding: 0;
  min-height: auto;
  font-weight: 0 !important;
}

.weui-dialog__hd {
  padding: 0.2rem;
}

.weui-dialog__title {
  display: inline-block;
  // padding-top: 0.1rem;
  line-height: 1rem;
}

.vux-tab.scrollable {
  -webkit-overflow-scrolling: touch !important;
  overflow-y: scroll !important;
  overflow-x: scroll !important;
  height: 45px;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
  overflow-x: scroll;
  overflow-y: scroll;
  height: 100%;
  width: 98.5%;
  padding-bottom: 0;
  word-spacing: normal;
  -webkit-overflow-scrolling: touch;
}

.vux-tab-ink-bar {
  bottom: 0 !important;
  // height: 0.04rem !important;
}

.vux-tab-container {
  height: auto !important;
  // .vux-tab{
  //   .vux-tab-item:nth-child(5){
  //     margin-right: 1rem;
  //   }
  // }
}

.lottery-10013 {
  .vux-tab-item {
    .item {
      margin-right: 0.12rem !important;
    }
  }
}

.mint-loadmore-top {
  .mint-loadmore-text {
    font-size: 0.28rem;
  }
}

.mint-loadmore-bottom {
  .mint-loadmore-text {
    font-size: 0.28rem;
  }
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

.lottery-10012 {
  .vux-tab-item {
    .item {
      margin-right: 0.12rem !important;
    }
  }
}

#take {
  .weui-dialog__bd {
    padding: 0.48rem 0.2rem !important;
    font-size: 0.32rem;
    font-weight: 500;
    line-height: 0.55rem;
    color: rgb(0, 0, 0);
  }
}

.lottery-10010 {
  .vux-tab {
    .vux-tab-item {
      .item {
        display: inline-block;
        padding: 0 0.24rem;
        height: 0.64rem;
        line-height: 0.64rem;
        font-size: 0.32rem;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        -webkit-transition: background-color 400ms;
        transition: background-color 400ms;
        border-radius: 0.32rem;
      }
    }
  }
}

.saveIosAlert {
  .ios-title {
    padding-top: 0.4rem !important;

    .title {
      font-size: 0.37rem;
      color: #333333;
      font-weight: bold;
    }

    .info {
      padding-top: 0.18rem;
      font-size: 0.32rem !important;
      line-height: 0.32rem !important;
      font-weight: 400 !important;
      margin-bottom: 0.16rem !important;
    }
  }

  .ios-alert-content {
    padding: 0.22rem 0.4rem 0.4rem 0.4rem !important;
  }

  .ios-alert-content {
    height: auto !important;
    padding: 0rem 0.4rem 0.4rem 0.4rem !important;
  }
}

.agent-open-edit {
  .auto-box-content {
    top: 0.2rem;
  }
}

.tab-box {
  width: 100%;
  min-height: 44px;
  box-sizing: border-box;
  display: flex;
  position: relative;
  border-bottom: 0.02rem solid hsla(0, 0%, 95%, 0.6);

  .play-way-tab {
    flex: 1;
    width: 100%;

    .vux-tab {
      white-space: nowrap;
    }

    .item {
      font-weight: 700 !important;
    }

    .vux-tab-selected .item {
      color: #ffffff;
      font-weight: 700;
    }
  }

  .vux-tab-item {
    font-size: 0.3rem;
    width: auto;
    flex: unset !important;
    display: inline-block;
    background-size: 0 !important;
    background: unset !important;

    .item {
      display: inline-block;
      padding: 0 0.2rem;
      margin-right: 0.04rem;
      height: 0.64rem;
      line-height: 0.64rem;
      font-size: 0.32rem;
      box-sizing: border-box;
      border-radius: 0.32rem;
    }
  }

  .icon {
    display: block;
    line-height: 44px;
    margin-left: 0.2rem;
    font-size: 0.2rem;
    transition: all 400ms;
  }

  .radio-box {
    position: absolute;
    display: block;
    left: 0;
    top: 100%;
    width: 100%;
    /*z-index: 498;*/
    text-align: left;

    .radio-transition-box {
      background-color: #fafafa;
      box-sizing: border-box;
      padding: 0;
    }

    .default-item-class,
    .selected-item-class {
      border: 0.02rem solid #d8d8d8;
      border-radius: 0.05rem;
      color: #999999;
      width: 21%;
      text-align: center;
      margin: 2%;
      box-sizing: border-box;
      height: 0.7rem;
      font-size: 0.32rem;
    }

    .selected-item-class {
    }

    .item-content {
      display: block;
      height: 100%;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
      font-size: 0.32rem;
      line-height: 0.66rem;
    }
  }
}
.notice-dialog-stop {
  width: 6.4rem;
  box-sizing: border-box;
  padding: 0;
  position: absolute;
  top: 46%;
  left: 50%;
  border-radius: 0.4rem;
  transform-origin: top;
  opacity: 0.96;
  transition: all 400ms;
  background-color: unset;
  transform: translate3d(-50%, -50%, 0) scale(0);

  img {
    width: 100%;
    display: block;
    position: relative;
    top: 0.02rem;
  }

  .notice-dialog-content {
    display: block;
    padding: 0.2rem 0.4rem;
    background-color: #fff;
    text-align: left;
    font-size: 0.36rem;
    max-height: 7.5rem;
    margin-top: -0.02rem;
    overflow: hidden;

    .con-text {
      padding: 0.2rem 0;
      color: #000000;
      line-height: 0.56rem;
      text-align: center;
    }
  }

  .notice-dialog-footer {
    display: block;
    width: 100%;
    height: 1.4rem;
    background: #fff;
    border: none;
    padding: 0 0.3rem;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 0 0 0.2rem 0.2rem;
    margin-top: -0.02rem;
    position: relative;

    .vns-header {
      background: linear-gradient(90deg, #6be5c9, #58c1bf);
    }

    .xpj-header {
      background-color: #2ea6ee;
    }
    .tc-header {
      background-color: #2ea6ee;
    }
  }

  .vns-dialog-header {
    padding: 0;
    height: 1.1rem;

    > div {
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
  .tc-dialog-header {
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

.show .notice-dialog-stop {
  transform: translate3d(-50%, -50%, 0) scale(1) !important;
}

@keyframes rotate {
  from {
    transform: rotateZ(360deg);
  }

  to {
    transform: rotateZ(0deg);
  }
}

.distance-login,
.saveFailure-cont {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0) scale(0);
  transition: all 400ms;
  transform-origin: center;
}

.show .distance-login,
.show .saveFailure-cont,
.show .bindPhone,
.show .hongBao,
.show .other-hongBao {
  transform: translate3d(-50%, -50%, 0) scale(1) !important;
}
.yidun_popup.yidun_popup--light .yidun_modal__title {
  font-size: 0.36rem !important;
}
.yidun.yidun--light .yidun_tips__text {
  font-size: 0.32rem !important;
}
.saveFailure-cont {
  top: 48%;
  img {
    width: 6.35rem;
    height: 6.29rem;
  }
  .icon {
    box-sizing: content-box;
    display: block;
    color: #fff;
    width: 0.6rem;
    height: 0.6rem;
    line-height: 0.63rem;
    border-radius: 50%;
    border: 0.04rem solid #fff;
    color: #fff;
    margin: 0.1rem auto 0;
  }
  .text {
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 1.14rem;
    padding: 0.24rem 0.38rem 0.2rem;
    color: #4d5556;
    font-size: 0.34rem;
    text-align: left;
    text-indent: 0.4rem;
    font-family: Microsoft YaHei;
    line-height: 0.54rem;
  }
}

.cpxpj-tabs {
  &.van-tabbar {
    border-top: none;
  }

  .van-tabbar-item {
    .van-tabbar-item__icon {
      color: #878b90;
    }

    .van-tabbar-item__text {
      color: #878b90;
    }
  }

  .van-tabbar-item--active {
    background-color: transparent;

    .van-tabbar-item__icon {
      color: #fc8a44;
    }

    .van-tabbar-item__text {
      color: #fc8a44;
    }
  }
}

.js85-tabs {
  background-color: #000000;
  position: fixed;
  bottom:0;
  &.van-tabbar {
    border-top: none;
    height: 1.1rem !important;
    line-height: 1.1rem !important;
  } 

  .van-tabbar-item {
    .van-tabbar-item__icon {
      color: #ffffff;
    }

    .van-tabbar-item__text {
      color: #ffffff;
    }
  }

  .van-tabbar-item--active {
    background-color: transparent;

    .van-tabbar-item__icon {
      color: #f6cf31;
    }

    .van-tabbar-item__text {
      color: #f6cf31;
    }
  }
}

.aqvns-tabs {
  &.van-tabbar {
    height: 1rem !important;
    border-top: none;
    box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.2);
  }
  .van-tabbar-item {
    img {
      height: 1em;
    }
    .van-tabbar-item__icon {
      height: 0.4rem;
      color: #878b90;
    }
    .van-tabbar-item__text {
      color: rgb(155, 161, 189);
      font-weight: 500;
    }
  }
  .van-tabbar-item--active {
    background-color: transparent;
    &::before {
      content: "";
      display: block;
      width: 0.7rem;
      border-top: 0.05rem solid rgb(166, 135, 98);
      position: absolute;
      top: 0;
    }
    .van-tabbar-item__icon {
      color: #fc8a44;
    }
    .van-tabbar-item__text {
      color: rgb(165, 135, 98);
    }
  }
}
</style>
