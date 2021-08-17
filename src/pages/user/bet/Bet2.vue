<template>
  <view-page
    :class="[
      'recode',
      'theme-main-bg',
      {
        'qp-recode': $config.newQP || $config.blackTheme,
        'blush-recode': $config.blush,
      },
      { 'aqvns-box': $config.isAqvns },
    ]"
    ref="view-page"
    full-box
    @scroll-height-change="scrollHeight = $event"
    no-scroll
  >
    <title-header
      title="投注记录"
      slot="header"
      backEvent
      @back="goback"
      class="theme-header-bottom theme-header-bg"
    >
      <div class="header-right" slot="right" @click="showDate()">
        <span>{{ date.name }}</span>
        <span class="date-icon icon iconfont h5-icon-qushi-moreup"></span>
      </div>
    </title-header>
    <div
      v-if="defaultIndex == 0 || defaultIndex == 1"
      slot="header-static"
      :style="{ marginTop: $config.blush ? '0' : '0.2rem' }"
    >
      <van-tabs
        v-model="tabIndex"
        :line-height="2"
        :swipe-threshold="6"
        @click="changeTabs(tabIndex)"
        class="theme-after-border-color"
      >
        <van-tab v-for="(tab, i) in tabs" :key="i" :title="tab.name"></van-tab>
      </van-tabs>
    </div>
    <div
      class="record-content"
      :class="{
        'theme-header-bg': $config.blackTheme,
        'theme-main-bg': $config.blush,
      }"
      slot="content"
    >
      <transition-group
        :name="animation"
        class="animation-box"
        tag="p"
        ref="animationBox"
      >
        <div
          v-if="defaultIndex == 0 || defaultIndex == 1"
          class="content-body"
          ref="solid"
          :key="'wrapper_' + tabIndex"
        >
          <div>
            <div
              v-for="(tab, i) in tabs"
              :key="i"
              :class="'tab_' + i"
              v-show="tabIndex == i"
            >
              <div class="tab-view">
                <ul
                  class="
                    type-tab-list
                    theme-gradient-bg theme-after-border-color
                  "
                >
                  <li
                    :class="[
                      {
                        'type-tab-item':
                          tab.type === 'LOTTERY' || tab.type === 'SPORT',
                        'type-tab-item-one':
                          tab.type != 'LOTTERY' && tab.type != 'SPORT',
                      },
                      { 'theme-color-white': j !== typeIndex[i] },
                      {
                        'active theme-bg theme-yellow-bg theme-color-black':
                          j === typeIndex[i],
                      },
                    ]"
                    @click="
                      $set(typeIndex, i, j);
                      $refs['swipeType'][i].swipeTo(j);
                    "
                    v-for="(type, j) in tab.type === 'LOTTERY'
                      ? lotteryTypes
                      : (tab.type == 'SPORT' ? sportTypes : otherTypes).filter(
                          (t) => t.name
                        )"
                    :key="j"
                  >
                    {{ type.name }}
                  </li>
                </ul>
                <div class="item-list">
                  <van-swipe
                    @change="(taJ) => changeIndex(taJ, i)"
                    :show-indicators="false"
                    :loop="false"
                    ref="swipeType"
                  >
                    <van-swipe-item
                      v-for="(type, j) in tab.type === 'LOTTERY'
                        ? lotteryTypes
                        : (tab.type == 'SPORT'
                            ? sportTypes
                            : otherTypes
                          ).filter((t) => t.name)"
                      :key="j"
                    >
                      <list-view
                        :ref="'list-' + i"
                        class="list-view"
                        style="padding: 0"
                        :style="{
                          height:
                            scrollHeight -
                            (list[i] && list[i][j] && list[i][j].length
                              ? 2.15
                              : 1.4) *
                              rem +
                            'px',
                        }"
                        load-more
                        @load-top="onRefresh"
                        @load-down="onLoadMore"
                        :no-more="noMore[i] && noMore[i][j]"
                        @on-scroll-end="
                          (top) => {
                            goTopShow[i][j] = top;
                            goTopShow = JSON.copyObj(goTopShow);
                          }
                        "
                      >
                        <div
                          class="view-box theme-main-bg"
                          style="
                            margin: 0 auto;
                            border-top-left-radius: 0;
                            border-top-right-radius: 0;
                          "
                        >
                          <ul
                            style="margin-top: 0; padding: 0 0.2rem"
                            v-if="list[i] && list[i][j] && list[i][j].length"
                          >
                            <li
                              class="recode-item theme-after-border-color"
                              :class="tab.type"
                              @click="onItemClick(item)"
                              v-for="(item, k) in list[i] ? list[i][j] : []"
                              :key="k"
                            >
                              <div class="recode-item-col">
                                <p class="info-row">
                                  <span class="user-name theme-color-white">{{
                                    entryType == 1
                                      ? tab.type === "LOTTERY"
                                        ? item.lotteryName
                                        : item.platform
                                      : item["userName"]
                                  }}</span>
                                </p>
                                <p class="info-row">
                                  <span
                                    class="ball theme-color-yellow"
                                    v-if="tab.type === 'LOTTERY'"
                                  >
                                    <i style="display: inline-block">{{
                                      item["playwayName"]
                                    }}</i>
                                    <i>{{ item.ball ? ":" : "" }}</i>
                                    <i>{{ item.ball || "" }}</i>
                                    <i>{{ item.ball ? "-" : ":" }}</i>
                                    <i class="code">{{ item["betInfo"] }}</i>
                                  </span>
                                  <span
                                    class="bet bet2 theme-color-yellow"
                                    style="margin-right: 0.24rem"
                                    v-else
                                    >{{ item.gameName }}</span
                                  >
                                  <template v-if="tab.type !== 'LOTTERY'">
                                    <span
                                      class="bet bet3 theme-color-gray-2"
                                      v-if="tabs[tabIndex].type === 'SPORT'"
                                      >投注:<span class="bet4">{{
                                        item["betAmount"]
                                      }}</span></span
                                    >
                                    <span
                                      class="bet bet3 theme-color-gray-2"
                                      v-else
                                      >投注:<span class="bet4">{{
                                        item["validBetAmount"]
                                      }}</span></span
                                    >
                                  </template>
                                </p>
                                <p class="info-row">
                                  <span
                                    class="bet theme-color-gray-2"
                                    v-if="tab.type === 'LOTTERY'"
                                    style="margin-right: 0.24rem"
                                    ><span v-if="entryType != 1">{{
                                      item.lotteryName
                                    }}</span
                                    >{{
                                      entryType != 1
                                        ? "(第" +
                                          forMartIssu(item.issue) +
                                          "期)"
                                        : "第" + forMartIssu(item.issue) + "期 "
                                    }}</span
                                  >
                                  <span
                                    class="bet theme-color-gray-2"
                                    style="
                                      overflow: hidden;
                                      white-space: nowrap;
                                      text-overflow: ellipsis;
                                    "
                                    v-else
                                    ><template v-if="entryType == 1">{{
                                      item.billNo
                                    }}</template
                                    ><template v-else>{{
                                      item.platform + "(" + item.billNo + ")"
                                    }}</template></span
                                  >
                                  <template v-if="tab.type === 'LOTTERY'">
                                    <span
                                      class="bet theme-color-gray-2"
                                      v-if="tabs[tabIndex].type === 'SPORT'"
                                      >投注:{{ item["betAmount"] }}</span
                                    >
                                    <span class="bet theme-color-gray-2" v-else
                                      >投注:{{ item["validBetAmount"] }}</span
                                    >
                                  </template>
                                </p>
                              </div>
                              <div class="recode-item-col">
                                <p class="commission">
                                  <span
                                    class="
                                      commission-value
                                      nolmar
                                      theme-color-gray-2
                                    "
                                    :class="
                                      item.status == 1 || item.status == 2
                                        ? ''
                                        : 'no-order'
                                    "
                                    >{{
                                      dayJs
                                        .unix(item.betTime)
                                        .format("MM-DD HH:mm:ss")
                                    }}</span
                                  >
                                </p>
                                <p class="commission">
                                  <span class="commission-label"></span>
                                  <span
                                    class="commission-value"
                                    v-if="item.status == 1"
                                    >{{
                                      item["payoutAmount"] || item["netAmount"]
                                    }}</span
                                  >
                                  <span
                                    class="commission-value less"
                                    v-else-if="item.status == 2"
                                    >{{
                                      item["netAmount"].replace("-", "")
                                    }}</span
                                  >
                                  <span
                                    class="status-ball icon iconfont"
                                    v-else-if="
                                      item.status == 4 ||
                                      item.status == 0 ||
                                      item.status == 3 ||
                                      item.status == 5
                                    "
                                    :class="statusOther[item['status']].class"
                                  ></span>
                                </p>
                                <template
                                  v-if="item.status == 1 || item.status == 2"
                                >
                                  <span
                                    class="status-ball icon iconfont"
                                    :class="statusLottery[item['status']].class"
                                    v-if="tab.type === 'LOTTERY'"
                                  ></span>
                                  <span
                                    class="status-ball icon iconfont"
                                    :class="statusOther[item['status']].class"
                                    v-else
                                  ></span>
                                </template>
                              </div>
                            </li>
                          </ul>

                          <div
                            v-else-if="noMore[i] && noMore[i][j]"
                            :style="{ height: scrollHeight - 1.4 * rem + 'px' }"
                          >
                            <img
                              style="width: 100%; margin-top: 1rem"
                              :src="noDataImg"
                              alt
                            />
                            <p style="font-size: 0.3rem; color: #666666">
                              暂无数据
                            </p>
                          </div>
                          <p
                            v-if="totalCount > 5"
                            style="
                              font-size: 0.26rem;
                              line-height: 0.84rem;
                              color: #000;
                              text-align: center;
                            "
                            :class="{ 'theme-color-white': $config.blush }"
                          >
                            已显示最近{{ totalCount }}条记录
                          </p>
                        </div>
                      </list-view>
                      <button
                        class="list-go-top qp-go-top-svg"
                        :style="{ backgroundImage: 'url(' + listGoImg + ')' }"
                        v-show="
                          goTopShow[i] &&
                          goTopShow[i][j] &&
                          goTopShow[i][j] < -5 * 1.52 * rem
                        "
                        @click="
                          $refs['list-' + i][j].scroll.scrollTo(
                            0,
                            0,
                            goTopShow[i][j] / -3
                          )
                        "
                      ></button>
                      <div
                        v-if="
                          amount[i] &&
                          amount[i][j] &&
                          Number(amount[i][j]['total_bet'] > 0)
                        "
                        class="box-amount"
                      >
                        <ul
                          class="amount-report theme-header-bg"
                          v-if="from === 'report'"
                          :class="{ amount_right: typeIndex[i] == 3 }"
                        >
                          <li class="amount-item">
                            <span class="item-label theme-color-white"
                              >投注:</span
                            >
                            <span
                              class="item-value"
                              :class="{
                                red: parseFloat(amount[i][j]['total_bet']) >= 0,
                                green:
                                  parseFloat(amount[i][j]['total_bet']) < 0,
                              }"
                            >
                              {{ amount[i][j]["total_bet"] || "0.00" }}
                            </span>
                          </li>
                          <li class="amount-item" v-if="typeIndex[i] !== 3">
                            <span class="item-label theme-color-white"
                              >盈利:</span
                            >
                            <span
                              class="item-value"
                              :class="{
                                red: parseFloat(amount[i][j]['total_win']) >= 0,
                                green:
                                  parseFloat(amount[i][j]['total_win']) < 0,
                              }"
                            >
                              {{ amount[i][j]["total_win"] || "0.00" }}
                            </span>
                          </li>
                        </ul>

                        <ul
                          class="amount theme-header-bg"
                          v-else
                          :class="{ amount_right: typeIndex[i] == 3 }"
                        >
                          <li class="amount-item">
                            <span class="item-label theme-color-white"
                              >投注:</span
                            >
                            <span
                              class="item-value"
                              :class="{
                                red: parseFloat(amount[i][j]['total_bet']) >= 0,
                                green:
                                  parseFloat(amount[i][j]['total_bet']) < 0,
                              }"
                            >
                              {{ amount[i][j]["total_bet"] || "0.00" }}
                            </span>
                          </li>
                          <li class="amount-item" v-if="typeIndex[i] !== 3">
                            <span class="item-label theme-color-white"
                              >输赢:</span
                            >
                            <span
                              class="item-value"
                              :class="{
                                red: parseFloat(amount[i][j]['total_win']) >= 0,
                                green:
                                  parseFloat(amount[i][j]['total_win']) < 0,
                              }"
                            >
                              {{
                                formatString(amount[i][j]["total_win"]) ||
                                "0.00"
                              }}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </van-swipe-item>
                  </van-swipe>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else :key="'typer_' + tabIndex">
          <ul class="type-tab-list theme-gradient-bg theme-after-border-color">
            <li
              class="type-tab-item-one theme-color-white"
              v-for="(type, j) in dataOtherList"
              :key="j"
            >
              {{ type.name }}
            </li>
          </ul>
          <list-view
            :ref="'list-dates-' + tabIndex"
            class="list-view"
            style="padding: 0"
            :style="{
              height:
                scrollHeight -
                (Number(otherAmout['total_bet']) > 0 ? 2.14 : 1.4) * rem +
                'px',
            }"
            no-more
            @load-top="getOhterDayList"
          >
            <div
              class="view-box theme-main-bg"
              style="
                margin: 0 auto;
                padding: 0;
                border-top-left-radius: 0;
                border-top-right-radius: 0;
              "
            >
              <template v-if="otherList.length > 0">
                <ul
                  class="
                    record-table
                    content
                    clear-fix
                    theme-after-border-color
                  "
                  v-for="(item, i) in otherList"
                  :key="'item_' + i"
                  @click="getOneDay(item)"
                  :class="{ 'theme-color-white': $config.blush }"
                >
                  <li class="item date detail-color">
                    <p class="day">
                      {{ item.date.date.slice(5, item.date.date.length) }}
                    </p>
                    <p class="week">{{ item.date["week"] }}</p>
                  </li>
                  <li class="item count">{{ item["bet_count"] }}</li>
                  <li class="item money">{{ item["bet_amount"] }}</li>
                  <li
                    class="item win-or-lose"
                    :class="{
                      red: parseFloat(item['bet_win_amount']) >= 0,
                      green: parseFloat(item['bet_win_amount']) < 0,
                    }"
                  >
                    {{ item["bet_win_amount"] }}
                  </li>
                </ul>
              </template>
              <div v-else>
                <img
                  style="width: 100%; margin-top: 1rem"
                  :src="noDataImg"
                  alt
                />
                <p style="font-size: 0.3rem; color: #666666">暂无数据</p>
              </div>
            </div>
          </list-view>
          <div class="box-amount" v-if="Number(otherAmout['total_bet']) > 0">
            <ul class="amount theme-header-bg">
              <li class="amount-item">
                <span class="item-label theme-color-white">投注:</span>
                <span
                  class="item-value"
                  :class="{
                    red: parseFloat(otherAmout['total_bet']) >= 0,
                    green: parseFloat(otherAmout['total_bet']) < 0,
                  }"
                >
                  {{ otherAmout["total_bet"] || "0.00" }}
                </span>
              </li>
              <li class="amount-item">
                <span class="item-label theme-color-white">输赢:</span>
                <span
                  class="item-value"
                  :class="{
                    red: parseFloat(otherAmout['total_win']) >= 0,
                    green: parseFloat(otherAmout['total_win']) < 0,
                  }"
                >
                  {{ formatString(otherAmout["total_win"]) || "0.00" }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </transition-group>
    </div>
    <div slot="static">
      <agency-date-selector
        :dataIndex="1"
        v-model="date"
        :defaultIndex="defaultIndex"
        :show.sync="showDateSelector"
        :dateName="dateName"
        @okSelect="okSelect"
        :newQP="$config.newQP || $config.blackTheme"
      ></agency-date-selector>
    </div>
  </view-page>
</template>

<script>
import AgencyDateSelector from "@src/components/agency-date-selector/AgencyDateSelector";

export default {
  name: "bet2",
  components: {
    AgencyDateSelector,
  },
  props: {
    type: {
      type: String,
      default: "",
    },
    from: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 直属 非直属
      zsType: 0,
      // 入口类型 1 主页的 个人中心的入口 2 代理的入口
      entryType: 1,
      oldInfo: {
        dateIndex: 0,
      },
      // 时间段 投注 盈利
      otherAmout: {
        total_bet: "0.00",
        total_win: "0.00",
      },
      // 时间段 数据
      otherList: [],
      dataOtherList: [
        {
          name: "时间",
          key: "time",
        },
        {
          name: "笔数",
          key: "count",
        },
        {
          name: "下注",
          key: "money",
        },
        {
          name: "输赢",
          key: "winOrLose",
        },
      ],
      dateOkIndex: 0,
      goTopShow: [],
      scrollHeight: 0,
      resetLoading: true,
      tabs: [],
      tabIndex: 0,
      animation: "slide-right",
      defaultIndex: 0,
      listIndex: 0,
      dateName: "",
      showDateSelector: false,
      changeDateIndex: 0,
      date: [null, null, null, null, null, null],
      username: "",
      uid: "",
      totalCount: 0,
      lotteryTypes: [
        {
          name: "全部",
          status: "",
        },
        {
          name: "已中奖",
          status: 1,
        },
        {
          name: "未中奖",
          status: 2,
        },
        {
          name: "待开奖",
          status: 0,
        },
      ],
      sportTypes: [
        {
          name: "全部",
          status: "",
        },
        {
          name: "赢",
          status: 1,
        },
        {
          name: "输",
          status: 2,
        },
        {
          name: "待结算",
          status: 0,
        },
      ],
      otherTypes: [
        {
          name: "全部",
          status: "",
        },
        {
          name: "赢",
          status: 1,
        },
        {
          name: "输",
          status: 2,
        },
        {
          name: "",
          status: "",
        },
      ],
      typeIndex: [],
      loading: [],
      noMore: [],
      tabChangeIndex: 0,
      page: 0,
      limit: 20,
      showSearch: false,
      list: [],
      amount: [],
      statusLottery: [
        {
          name: "待",
          class: "h5-icon-result-wait",
        },
        {
          name: "中",
          class: "h5-icon-result-mid",
        },
        {
          name: "未",
          class: "h5-icon-result-false",
        },
        {
          name: "和",
          class: "h5-icon-result-sum",
        },
        {
          name: "撤",
          class: "h5-icon-result-withdraw",
        },
        {
          name: "撤",
          class: "h5-icon-result-withdraw",
        },
      ],
      statusOther: [
        {
          name: "待",
          class: "h5-icon-result-wait",
        },
        {
          name: "赢",
          class: "h5-icon-result-win",
        },
        {
          name: "输",
          class: "h5-icon-result-lose",
        },
        {
          name: "和",
          class: "h5-icon-result-sum",
        },
        {
          name: "撤",
          class: "h5-icon-result-withdraw",
        },
        {
          name: "撤",
          class: "h5-icon-result-withdraw",
        },
      ],
      defaultTabIndex: 0,
      tabCount: 0,
    };
  },
  computed: {
    noDataImg() {
      if (this.$config.newQP || this.$config.blackTheme) {
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
    listGoImg() {
      if (this.$config.newQP || this.$config.blackTheme) {
        return require("../../../assets/img/home/qp/qp-back-top.svg");
      } else if (this.targetTheme && this.targetTheme["code"]) {
        let matchResult = this.targetTheme["code"];
        return require(`../../../assets/img/agent-center-new/${matchResult}.png`);
      } else {
        return require("../../../assets/img/agent-center-new/default.png");
      }
    },
  },
  watch: {
    tabs() {
      this.tabs.forEach((item, i) => {
        if (item.type === "LOTTERY" || item.type === "SPORT") {
          this.noMore[i] = [false, false, false, false];
          this.loading[i] = [false, false, false, false];
          this.goTopShow[i] = [0, 0, 0, 0];
          this.list[i] = [[], [], [], []];
          this.typeIndex[i] = 0;
          this.amount[i] = [{}, {}, {}, {}];
        } else {
          this.noMore[i] = [false, false, false];
          this.loading[i] = [false, false, false];
          this.goTopShow[i] = [0, 0, 0];
          this.list[i] = [[], [], []];
          this.typeIndex[i] = 0;
          this.amount[i] = [{}, {}, {}];
        }

        if (item.type === this.type) this.tabIndex = this.defaultTabIndex = i;
      });
    },
    date() {
      // console.log('ss2')
      setTimeout(() => {
        this.$refs["view-page"].refresh();
      }, 100);
    },
    tabIndex(val, old) {
      this.totalCount = 0;
      this.username = "";
      if (val < old) {
        this.animation = "slide-right";
      } else {
        this.animation = "slide-left";
      }
      if (!sessionStorage.getItem("recode")) {
        //this.dateName='';this.date=this.filterDate[0]
      } else {
        sessionStorage.clear();
      }

      this.$nextTick(() => {
        this.goTopShow[this.tabIndex][this.typeIndex[this.tabIndex]] = 0;
        this.goTopShow = JSON.copyObj(this.goTopShow);
        if (this.defaultIndex > 1) {
          if (this.$refs["list-dates-" + this.tabIndex]) {
            this.$refs["list-dates-" + this.tabIndex].scroll.scrollTo(0, 0, 0);
          }
        } else {
          if (
            this.$refs["list-" + this.tabIndex] &&
            this.$refs["list-" + this.tabIndex][this.typeIndex[this.tabIndex]]
          ) {
            this.$refs["list-" + this.tabIndex][
              this.typeIndex[this.tabIndex]
            ].scroll.scrollTo(0, 0, 0);
          }
        }
      });
      // if (this.typeIndex === 0) {
      //   this.onRefresh()
      // } else {
      //   this.typeIndex = 0
      //   this.$nextTick(() => {
      //     this.$refs['swipeType'][this.tabIndex].swipeTo(0, { immediate: true })
      //   })
      // }
    },

    tabChangeIndex() {
      //this.defaultIndex = 0;
    },
    typeIndex: {
      handler(val, old) {
        //if(this.listIndex == val[this.tabIndex]){

        this.$nextTick(() => {
          if (!sessionStorage.getItem("recode")) this.dateName = "";
          else sessionStorage.clear();
          this.goTopShow[this.tabIndex][this.typeIndex[this.tabIndex]] = 0;
          this.goTopShow = JSON.copyObj(this.goTopShow);
          if (this.defaultIndex > 1) {
            this.$refs["list-dates-" + this.tabIndex].scroll.scrollTo(0, 0, 0);
          } else {
            if (
              this.$refs["list-" + this.tabIndex] &&
              this.$refs["list-" + this.tabIndex][this.typeIndex[this.tabIndex]]
            ) {
              this.$refs["list-" + this.tabIndex][
                this.typeIndex[this.tabIndex]
              ].scroll.scrollTo(0, 0, 0);
            }
          }
        });
      },
      deep: true,
    },
  },
  created() {
    // this.checkList()
    this.init();
    if (
      [
        "amxpj",
        "99qp",
        "kkqp",
        "fhcp",
        "103qp",
        "839qp",
        "dqr",
        "hty",
        "tccp",
         "tyc86",
        "xpj83",
      ].includes(this.$config.name)
    ) {
      this.tabs = [
        {
          name: "彩票",
          type: "LOTTERY",
        },
        {
          name: "棋牌",
          type: "CHESS",
        },
        {
          name: "视讯",
          type: "LIVE",
        },
        {
          name: "捕鱼",
          type: "FISH",
        },
        {
          name: "电子",
          type: "SLOT",
        },
        {
          name: "体育",
          type: "SPORT",
        },
      ];
    } else if (this.personalMode === "mode_c") {
      this.tabs = [
        {
          name: "棋牌",
          type: "CHESS",
        },
        {
          name: "视讯",
          type: "LIVE",
        },
        {
          name: "捕鱼",
          type: "FISH",
        },
        {
          name: "电子",
          type: "SLOT",
        },
        {
          name: "体育",
          type: "SPORT",
        },
      ];
    } else if (this.$config.home === "tc") {
      this.tabs = [
        {
          name: "彩票",
          type: "LOTTERY",
        },
        {
          name: "棋牌",
          type: "CHESS",
        },
      ];
    } else {
      this.tabs = [
        {
          name: "彩票",
          type: "LOTTERY",
        },
        {
          name: "棋牌",
          type: "CHESS",
        },
        {
          name: "视讯",
          type: "LIVE",
        },
        {
          name: "捕鱼",
          type: "FISH",
        },
        {
          name: "电子",
          type: "SLOT",
        },
        {
          name: "体育",
          type: "SPORT",
        },
      ];
    }
  },
  beforeDestroy() {
    this.toastClear();
  },
  mounted() {
    setTimeout(() => {
      this.init();
    }, 100);
  },
  methods: {
    formatString(data) {
      if (typeof data == "string") {
        // return data.replace('-','')
        return data;
      } else {
        return data;
      }
    },
    init() {
      this.defaultIndex = this.$route.query["dateIndex"]
        ? Number(this.$route.query["dateIndex"])
        : 0;
      this.tabIndex = Number(this.$route.query["gameType"]) || 0;
      if (this.$route.query["dateIndex"] > 1) {
        this.getOhterDayList();
      } else {
        this.onRefresh();
      }
      this.$nextTick(() => {
        let _self = this;
        setTimeout(() => {
          this.$set(
            this.typeIndex,
            Number(_self.$route.query["gameType"]) || 0,
            Number(_self.$route.query["winType"]) || 0
          );
          if (_self.$refs["swipeType"]) {
            _self.$refs["swipeType"][
              (this.typeIndex, Number(_self.$route.query["gameType"]) || 0)
            ].swipeTo(Number(_self.$route.query["winType"]) || 0);
          }
        }, 100);
      });
    },
    forMartIssu(num) {
      if (typeof num === "number") {
        num = num.toString();
      }
      let numStr = "";
      if (num.length > 8) {
        numStr = num.substring(8);
      } else {
        numStr = num.includes(new Date().getFullYear())
          ? num.substring(4)
          : num;
      }
      return numStr;
    },
    showDate() {
      if (this.dateOkIndex >= 0) {
        this.showDateSelector = true;
      }
    },
    getOneDay(data) {
      // this.$router.push('/user/recordOneDay')
      this.$router.push({
        path: "/user/recordOneDay",
        query: {
          date: data.date.date,
          gameType: this.tabIndex || 0,
          dateIndex: this.defaultIndex,
        },
      });
    },
    // 获取时间段数据  七日 30天 等
    getOhterDayList() {
      this.toastLoading("加载中");
      let _self = this;
      let date = {
        start: this.dayJs().subtract(1, "d").format("YYYY-MM-DD"),
        end: this.dayJs().format("YYYY-MM-DD"),
      };
      if (this.$route.query["dateIndex"] > 1) {
        switch (this.$route.query["dateIndex"] * 1) {
          case 2:
            date.start = this.dayJs().subtract(6, "d").format("YYYY-MM-DD");
            date.end = this.dayJs().format("YYYY-MM-DD");
            break;
          case 3:
            (date.start = this.dayJs().startOf("month").format("YYYY-MM-DD")),
              (date.end = this.dayJs().format("YYYY-MM-DD"));
            break;
          case 4:
            (date.start = this.dayJs()
              .set("date", 1)
              .subtract(1, "month")
              .format("YYYY-MM-DD")),
              (date.end = this.dayJs()
                .set("date", 1)
                .subtract(1, "d")
                .format("YYYY-MM-DD"));
            break;
          default:
            date.start = this.dayJs().subtract(6, "d").format("YYYY-MM-DD");
            date.end = this.dayJs().format("YYYY-MM-DD");
            break;
        }
      }
      this.$store
        .dispatch("user/getAgentBetDay2", {
          start: this.date.start || date.start,
          end: this.date.end || date.end,
          game: 0,
          type: 0,
        })
        .then((res) => {
          if (res.code == 200) {
            this.toastClear();
            this.otherList = res.data.list;
            this.otherAmout = res.data.amount;
            // this.loading = false
            this.$nextTick(() => {
              if (_self.$refs["list-dates-" + _self.tabIndex]) {
                setTimeout(() => {
                  _self.$refs["list-dates-" + _self.tabIndex].loaded();
                  _self.$refs["list-dates-" + _self.tabIndex].scroll.scrollTo(
                    0,
                    0,
                    0
                  );
                }, 300);
              }
            });
          } else {
            this.otherList = [];
            this.otherAmout = {
              total_bet: "0.00",
              total_win: "0.00",
            };
          }
        })
        .catch((err) => {
          this.toastText("获取数据失败", "top");
        })
        .finally(() => {
          this.toastClear();
          if (this.$refs["list-dates" + _self.tabIndex]) {
            this.$refs["list-dates" + _self.tabIndex].scrollToRefresh();
          }
        });
    },
    okSelect(data, index, zsType) {
      this.defaultIndex = index;
      this.zsType = zsType || 0;
      this.dateOkIndex = index;
      this.oldInfo.dateIndex = index;
      // this.onRefresh();
      if (index > 1) {
        this.username = "";
        this.getOhterDayList();
      } else {
        this.onRefresh();
      }
    },
    changeTabs(index) {
      if (this.defaultIndex > 1) {
        this.getOhterDayList();
      } else {
        this.tabIndex = index;
        this.typeIndex = [0, 0, 0, 0, 0, 0];
        setTimeout(() => {
          this.onRefresh();
        }, 100);
      }
    },
    onItemClick(item) {
      this.$store.state.agency.recodeItem = item;
      // this.$router.push('/user/agency-center-new/recode/info/' + this.tabs[this.tabIndex].type)
      this.$router.push({
        path: "/user/betInfo",
        query: {
          gameType: this.tabIndex || 0,
          winType: this.typeIndex[this.tabIndex] || 0,
          dateIndex: this.dateOkIndex,
          isHome: 1,
        },
      });
    },
    changeIndex(tabJ, i) {
      this.$set(this.typeIndex, i, tabJ);
      this.listIndex = tabJ;
      // this.$refs[]
      setTimeout(() => {
        this.onRefresh();
      }, 100);
    },
    onSearch() {
      this.onRefresh();
    },
    goback() {
      let url = decodeURIComponent(
        decodeURIComponent(localStorage["local-url"])
      );
      let urlName = url.split("/#/")[1];
      if (localStorage["local-url"]) {
        let oldUlr = decodeURIComponent(
          decodeURIComponent(localStorage["local-url"])
        ).match(/#(\S*)/)[1];
        if (decodeURIComponent(localStorage["local-url"]).includes("?")) {
          let goUlr = oldUlr.split("?")[0];
          let goQuery = oldUlr.split("?")[1];
          if (goUlr && goQuery) {
            let goQueryMap = goQuery.split("&").map((ff) => {
              return {
                name: ff.split("=")[0],
                value: ff.split("=")[1],
              };
            });
            let queryModel = {};
            goQueryMap.forEach((element) => {
              queryModel[element.name] = element.value;
            });
            this.$router.push({
              path: goUlr,
              query: queryModel,
            });
          } else {
            urlName == "home"
              ? this.$router.push("/home")
              : this.$router.push("/user");
          }
        } else {
          urlName == "home"
            ? this.$router.push("/home")
            : this.$router.push("/user");
        }
      } else {
        this.$router.back();
      }
    },
    onRefresh() {
      if (this.list[this.tabIndex] && this.date) {
        this.totalCount = 0;
        this.page = 0;
        this.noMore[this.tabIndex][this.typeIndex[this.tabIndex]] = false;
        this.loading[this.tabIndex][this.typeIndex[this.tabIndex]] = false;
        this.loadMore(true);
      }
      this.totalCount = 0;
    },
    onLoadMore() {
      this.loadMore();
    },

    // 获取时间节点的数据 今天 昨天
    loadMore(status) {
      const tabIndex = this.tabIndex;
      const typeIndex = this.typeIndex[tabIndex];
      if (!this.tabs.length) return;
      if (this.noMore[tabIndex][typeIndex]) {
        this.loading[tabIndex][typeIndex] = false;
        this.$refs["list-" + tabIndex][typeIndex].loaded();
        this.toastText("没有更多", "top");
      } else if (!this.loading[tabIndex][typeIndex]) {
        this.page++;
        this.loading[tabIndex][typeIndex] = true;
        const data = {
          type: this.tabs[tabIndex].type.toLowerCase(),
          date: this.date.start,
          limit: this.limit,
          page: this.page,
        };
        if (
          this.tabs[tabIndex].type === "LOTTERY" ||
          this.tabs[tabIndex].type === "SPORT"
        ) {
          if (this.lotteryTypes[typeIndex].status.toString().length)
            data.status = this.lotteryTypes[typeIndex].status;
        } else {
          if (this.otherTypes[typeIndex].status.toString().length)
            data.status = this.otherTypes[typeIndex].status;
        }
        if (this.page == 1) {
          this.toastLoading("加载中");
        }
        let _self = this;
        this.$store.dispatch("user/getRecordListByower", {
          data,
          callback: (res) => {
            this.loading[tabIndex][typeIndex] = false;
            this.$refs["list-" + tabIndex][typeIndex].loaded();
            if (res.code === 200) {
              if (
                res.data &&
                res.data.data &&
                res.data.data.list &&
                res.data.data.list.length
              ) {
                if (status) {
                  this.totalCount = 0;
                  _self.$forceUpdate();
                  _self.$nextTick(() => {
                    _self.$set(
                      _self.list[tabIndex],
                      typeIndex,
                      res.data.data.list
                    );
                    _self.$forceUpdate();
                  });
                  if (res.data.data.list.length === 0) {
                    this.noDataImg = `../../../assets/img/${this.targetTheme["code"]}.png`;
                  }
                } else {
                  _self.list[tabIndex][typeIndex] = _self.list[tabIndex][
                    typeIndex
                  ].concat(res.data.data.list);
                }
                if (res.data.data.list.length < this.limit) {
                  this.noMore[tabIndex][typeIndex] = true;
                }
                this.totalCount = this.totalCount + res.data.data.list.length;
                this.amount[tabIndex][typeIndex] = res.data.data.amount;
              } else {
                if (status) {
                  this.list[tabIndex][typeIndex] = [];
                  this.amount[tabIndex][typeIndex] = res.data.data.amount;
                }
                this.noMore[tabIndex][typeIndex] = true;
                this.totalCount = 0;
              }

              this.list = JSON.copyObj(this.list);
              if (this.page == 1) {
                this.toastClear();
              }
            } else {
              this.totalCount = 0;
              this.toastText(res.message, "top");
              this.page--;
            }
          },
          error: (err) => {
            this.page--;
            this.loading[tabIndex][typeIndex] = false;
          },
        });
      } else if (this.loading[tabIndex][typeIndex]) {
        this.toastText("正在加载", "top");
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.vux-swiper {
  height: calc(100vh - 90px) !important;
}

/deep/ .van-tabs {
  .van-tab {
    font-size: 0.34rem !important;
  }
}

.header-right {
  position: absolute;
  right: 0.16rem;
  top: 0;
  font-size: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;

  .date-icon {
    font-size: 0.2rem;
    transform: scale(0.5) rotateZ(180deg);
    color: #ffffff;
  }
}

.recode {
  .record-content {
    .animation-box {
      position: relative;
      left: 0;
      top: 0;
      width: 100%;

      .content-body {
        width: 100%;
      }
    }
  }

  .search-row {
    height: 0.9rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;

    &.only-date {
      width: 1.9rem;
      padding: 0 0.16rem;
      justify-content: flex-end;
      margin-left: 5.44rem;
      height: 0.72rem;
    }

    .search-icon {
      font-size: 0.38rem;
      margin-right: 0.24rem;
    }

    .input {
      min-width: 0;
      flex: 1;

      &:after {
        content: none !important;
      }
    }

    .date {
      color: #999999;
      font-size: 0.3rem;
    }

    .date-icon {
      color: #767676;
      font-size: 0.3rem;
      transform: rotateZ(180deg) scale(0.5);
    }
  }

  .tab-view {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: nowrap;

    .item-list {
      flex: 1;
      overflow: hidden;
    }
  }

  .list-view {
    width: 100%;
    margin-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    overflow: hidden;
  }

  .type-tab-list {
    border-top-left-radius: 0.1rem;
    border-top-right-radius: 0.1rem;
    background-color: #ffffff;
    font-size: 0.3rem;
    color: #666666;
    // border-bottom: 0.02rem solid #E7E7E7;
    position: relative;

    &::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      right: 0;
      bottom: 0;
      left: 0;
      border-bottom: 0.02rem solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }

    width: 7.18rem;
    margin: 0.24rem auto 0;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    height: 0.9rem;
    text-align: center;
    flex-wrap: nowrap;
    overflow: hidden;

    .type-tab-item {
      width: 25%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 0.3rem;
      // font-family: PingFang-SC-Medium, PingFang-SC;
      // font-weight: 500;
      color: #666666;

      &.active {
        font-size: 0.32rem;
        font-weight: 500;
        color: #ffffff;
        background-color: #2c93ff;
      }
    }

    .type-tab-item-one {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 0.3rem;
      flex: 1;
      // font-family: PingFang-SC-Medium, PingFang-SC;
      // font-weight: 500;
      color: #666666;

      &.active {
        font-size: 0.32rem;
        font-weight: 500;
        color: #ffffff;
        background-color: #2c93ff;
      }
    }

    .type-tab-item-one {
      &:first-child {
        width: 30%;
      }

      &:nth-child(2) {
        width: 20%;
      }
    }
  }

  .list-go-top {
    position: absolute;
    right: 0.22rem;
    bottom: 2rem;
    width: 1rem;
    height: 1rem;
    // background: url("../../../assets/img/agent-center-new/go-top.png") no-repeat 0 0;
    background-size: 100%;
  }

  .recode-item {
    // height: 1.54rem;
    padding: 0.24rem 0 0.16rem 0;
    display: flex;
    justify-content: stretch;
    align-items: stretch;
    // border-bottom: 0.02rem solid #E7E7E7;
    position: relative;

    &::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      right: 0;
      bottom: 0;
      left: 0;
      border-bottom: 0.02rem solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }

    &:last-child {
      border-bottom: none;

      &::after {
        border-bottom: 0;
      }
    }

    .recode-item-col {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;

      &:first-child {
        flex: 1;
        text-align: left;
        align-items: flex-start;
      }

      &:last-child {
        flex: 0.5;
        text-align: right;
        align-items: flex-end;
        min-width: 1.75rem;
      }

      .commission {
        display: flex;
        color: #e71414;
        margin-bottom: 0.16rem;
        justify-content: flex-end;
        height: 0.4rem;

        .commission-label {
          font-size: 0.28rem;
          line-height: 0.4rem;
          margin-right: 0.1rem;
        }

        .commission-value {
          font-size: 0.28rem;
          line-height: 0.42rem;
        }

        .less {
          color: #00a054;
        }

        .nolmar {
          color: #a3a3a3;
          font-size: 0.24rem;
        }

        .no-order {
          position: relative;
          top: -0.15rem;
        }
      }

      .status-ball {
        width: 0.4rem;
        height: 0.4rem;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        font-size: 0.32rem;
        // border-radius: 50%;
        // border: 0.02rem solid #A3A3A3;
        // color: #A3A3A3;
        flex-shrink: 0;

        &.h5-icon-result-false {
          color: #00a054;
        }

        &.h5-icon-result-mid {
          color: #e71414;
        }

        &.h5-icon-result-lose {
          color: #00a054;
        }

        &.h5-icon-result-win {
          color: #e71414;
        }

        &.h5-icon-result-wait {
          color: #ff9700;
        }

        &.h5-icon-result-sum {
          color: #722df0;
          position: relative;
          top: -0.16rem;
        }

        &.h5-icon-result-withdraw {
          color: #a3a3a3;
          position: relative;
          top: -0.16rem;
        }
      }

      .info-row {
        display: flex;
        width: 100%;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 0.16rem;

        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        .user-name {
          font-size: 0.32rem;
          color: #444444;
          margin-right: 0.1rem;
          line-height: 0.42rem;
        }

        .bet {
          max-width: 4rem;
          font-size: 0.28rem;
          color: #888888;
          line-height: 0.33rem;
        }

        .bet2 {
          color: #000000;
        }

        // .bet3{
        //     color: #A3A3A3;
        // }
        // .bet4{
        //     color: #E71414;
        // }
        .ball {
          color: #000000;
          font-size: 0.28rem;
          max-width: 4.85rem;

          // display: flex;
          // align-items: center;
          > .code {
            color: #e71414;
            display: inline-block;
            word-wrap: normal;
            // max-width: 2.3rem;
            // overflow: hidden;
            // white-space: nowrap;
            // text-overflow: ellipsis;
          }
        }
      }

      .info-row:last-child {
        margin-bottom: 0;
      }

      // .time {
      //     font-size: 0.28rem;
      //     color: #999999;
      //     line-height: 0.4rem;
      //     margin-top: 0.16rem;
      // }
    }
  }

  .amount-report {
    width: 100%;
    height: 0.9rem;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    padding: 0 0.32rem;
    background-color: #ffffff;

    .amount-item {
      display: flex;
      align-items: center;

      &:first-child {
        justify-content: flex-start;
      }

      &:last-child {
        justify-content: flex-end;
      }

      .item-label {
        font-size: 0.3rem;
        line-height: 0.42rem;
        color: #444444;
        margin-right: 0.1rem;
      }

      .item-value {
        font-size: 0.32rem;
        line-height: 0.45rem;
        color: #444444;
      }

      .red {
        color: #e71414;
      }

      .green {
        color: #00a054;
      }
    }
  }

  .box-amount {
    box-shadow: 0px -6px 5px 0px rgba(0, 0, 0, 0.03);
    position: relative;

    .amount {
      width: 100%;
      height: 0.98rem;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.16rem 0.2rem;
      background-color: #ffffff;

      .amount-item {
        /*width: 100%;*/
        /*flex: 1;*/
        display: flex;
        align-items: center;

        .item-label {
          font-size: 0.3rem;
          line-height: 0.42rem;
          color: #444444;
        }

        .item-value {
          font-size: 0.32rem;
          line-height: 0.45rem;
          color: #e71414;
        }

        .red {
          color: #e71414;
        }

        .green {
          color: #00a054;
        }
      }
    }

    .amount_right {
      justify-content: flex-end !important;
    }
  }

  .amount_right {
    justify-content: flex-end !important;
  }
  &.qp-recode {
    /deep/ .auto-box-header-static {
      background-color: #000;
      .van-hairline--top-bottom {
        &::after {
          border: none !important;
        }
      }
      .van-tabs__nav {
        background: linear-gradient(0deg, #0c0c0c, #222222) !important;
        .van-tab {
          color: #fff;
        }
      }
      .van-tab--active {
        color: #f6cf32 !important;
      }
      .van-tabs__line {
        background-color: #f6cf32 !important;
      }
    }
    .view-box {
      width: auto;
      padding: 0 0.2rem;
      ul {
        padding: 0 !important;
        li {
          background-color: #0b0b0b;
        }
      }
    }
  }
  &.blush-recode {
    /deep/ .auto-box-header-static {
      background-color: #72010b;
      .van-hairline--top-bottom {
        &::after {
          border: none !important;
        }
      }
      .van-tabs__nav {
        background: linear-gradient(0deg, #9d010f, #72010b) !important;
        .van-tab {
          color: #fff;
        }
      }
      .van-tab--active {
        color: #f6cf32 !important;
      }
      .van-tabs__line {
        background-color: #f6cf32 !important;
      }
    }
    .view-box {
      width: auto;
      padding: 0 0.16rem;
      ul {
        padding: 0 !important;
        width: 7.18rem;
        margin: 0 auto;
        li {
          background-color: #640009;
        }
      }
    }
  }
}

.content {
  color: #888888;
  font-size: 0.28rem;
  line-height: 1rem;
  position: relative !important;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  // &:before {
  //     content: '\E731';
  //     font-family: "iconfont", serif !important;
  //     font-style: normal !important;
  //     font-size: 0.44rem !important;
  //     line-height: 0.44rem !important;
  //     -webkit-font-smoothing: antialiased !important;
  //     color: #ADAFBB !important;
  //     display: block !important;
  //     height: 0.44rem !important;
  //     width: 0.44rem !important;
  //     position: absolute !important;
  //     right: 0.2rem;
  //     top: 50%;
  //     transform: translateY(-50%);
  // }

  &:after {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: 0;
    bottom: 0;
    // top: 0;
    // left: 0.3rem;
    border-bottom: 0.02rem solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    width: 100%;
  }

  &:last-child::after {
    content: "";
    border: 0;
  }

  .item {
    position: relative;
    display: inline-block;
    float: left;

    &.date {
      width: 25%;

      .day {
        line-height: 0.6rem;
      }

      .week {
        line-height: 0.3rem;
        padding-bottom: 0.1rem;
      }
    }

    &.count {
      width: 25%;
    }

    &.money {
      width: 25%;
    }

    &.win-or-lose {
      width: 25%;
    }
  }

  .green {
    color: #00a054;
  }

  .red {
    color: #e71414;
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 start
.aqvns-box{
  /deep/.auto-box-header-static{
    .van-tab--active{
        color: #C9A786 !important;
        border-color: #C9A786 !important;
    }
    .van-tabs__line{
      background-color: #C9A786 !important;
    }
  }
  /deep/.auto-box-content{
    .tab-view{
      .active{
        background-color: #C9A786 !important;
      }
    }
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 end
</style>
