<template>
  <view-page class="lower-report theme-header-bg" ref="view-page" full-box>
    <div
      slot="static"
      class="theme-bg theme-header-bg"
      :class="[{ 'aqvns-lower-bg': $config.isAqvns }]"
      :style="headerStyle"
    ></div>

    <div class="header theme-header-bg theme-header-bottom" slot="header">
      <title-header
        class="title"
        backEvent
        @back="goBack"
        style="background-color: rgba(0, 0, 0, 0) !important"
        title="个人报表"
      >
        <div class="header-right" slot="right" @click="showDateSelector = true">
          <span>{{ date && date.name }}</span>
          <span class="date-icon icon iconfont h5-icon-qushi-moreup"></span>
        </div>
      </title-header>
    </div>

    <ul class="content" slot="content">
      <li
        class="view-box user-info"
        :class="{
          'theme-gradient-bg-3': $config.blackTheme || $config.newQP,
          'theme-main-bg-1': $config.blush,
        }"
      >
        <img class="avatar" :src="avatar" alt />
        <div>
          <p class="user-name theme-color-white theme-after-border-color">
            {{ username }}
          </p>
          <img
            class="user-type"
            v-if="isAgent === '1'"
            src="../../../assets/img/agent-center-new/user-type-agent.png"
            alt
          />
          <img
            class="user-type"
            v-else
            src="../../../assets/img/agent-center-new/user-type-member.png"
            alt
          />
        </div>
      </li>

      <li
        class="view-box panel"
        :class="{
          'theme-gradient-bg-3': $config.blackTheme || $config.newQP,
          'theme-main-bg-1': $config.blush,
        }"
        v-for="(panel, i) in info.list"
        :key="i"
      >
        <p class="title theme-color-white theme-after-border-color">
          {{ panel.name }}
        </p>
        <ul class="list">
          <li
            class="item theme-after-border-color"
            v-for="(item, j) in panel.list"
            :key="j"
          >
            <p
              class="value"
              :class="{
                red: parseFloat(item.value) > 0,
                green: parseFloat(item.value) < 0,
                'theme-color-white': parseFloat(item.value) == 0,
              }"
            >
              {{ item.value }}
            </p>
            <p class="label theme-color-white">{{ item.name }}</p>
          </li>
        </ul>
      </li>
    </ul>

    <div slot="static">
      <agency-date-selector
        @okSelect="okSelect"
        v-model="date"
        @getDefaultIndex="getDefaultIndex"
        :defaultIndex="defaultIndex"
        :show.sync="showDateSelector"
        :newQP="$config.newQP || $config.blackTheme"
      ></agency-date-selector>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import AgencyDateSelector from "@src/components/agency-date-selector/AgencyDateSelector";

export default {
  name: "LowerReport",
  components: {
    AgencyDateSelector,
  },
  props: {
    uid: {
      type: [String, Number],
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    isAgent: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      baseInfo: [],
      info: [],
      avatars: [],
      date: null,
      showDateSelector: false,
      defaultIndex: 0,
    };
  },
  computed: {
    headerStyle() {
      return {
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        height: "2rem",
        zIndex: "-1",
        // background: 'linear-gradient(180deg, rgba(1, 195, 207, 1) 0%, rgba(47, 115, 255, 1) 100%)'
      };
    },
    avatar() {
      return this.userInfo
        ? this.avatars[this.info.pic] || this.avatars.default
        : this.avatars.default;
    },
  },
  watch: {
    date() {
      this.refresh();
    },
  },
  created() {
    this.defaultIndex = this.$route.query.date * 1;
    this.avatars.default = require("../../../assets/img/user/proimt/default.png");
    this.$store.state.user.avatars.forEach((name) => {
      this.avatars[name] = require("../../../assets/img/user/proimt/" + name);
    });
    if (this.isAgent == 1) {
      try {
        this.baseInfo = JSON.parse(localStorage.baseLowerAgentReport);
      } catch (e) {
        this.baseInfo = [];
      }
    } else {
      try {
        this.baseInfo = JSON.parse(localStorage.baseLowerMemberReport);
      } catch (e) {
        this.baseInfo = [];
      }
    }
  },
  methods: {
    getDefaultIndex(index) {},
    okSelect(date, index, zsType) {
      this.defaultIndex = index;
    },
    goBack() {
      if (this.$route.query.user) {
        this.$router.push("/user");
      } else {
        this.$router.push({
          path: `/user/agency-center-new/team`,
          query: { tabI: this.$route.query.tabI || 0 },
        });
      }
    },
    refresh() {
      if (this.date) {
        this.$store
          .dispatch("agency/agencyNextReport", {
            uid: this.uid,
            startTime: this.date.start,
            endTime: this.date.end,
          })
          .then((res) => {
            if (res.code === 200) {
              this.info = res.data;
            } else {
              this.toastText(res.message, "top");
            }
          })
          .catch((err) => {});
      }
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
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

.lower-report {
  .content {
    padding-top: 0.2rem;
  }

  .view-box:first-child {
    margin-top: 0;
  }

  .user-info {
    height: 1.6rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .avatar {
      width: 0.96rem;
      height: 0.96rem;
      border-radius: 50%;
    }

    .user-name {
      font-size: 0.32rem;
      color: #444444;
      line-height: 0.45rem;
      margin-left: 0.1rem;
    }

    .user-type {
      display: block;
      width: 1.34rem;
      height: 0.72rem;
      margin-left: 0.2rem;
    }
  }

  .panel {
    padding: 0;

    .title {
      font-size: 0.32rem;
      font-weight: 500;
      color: #444444;
      padding: 0 0.24rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 0.78rem;
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
        -webkit-transform: scaleY(0.48);
        transform: scaleY(0.48);
      }
    }

    .list {
      display: flex;
      width: 100%;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 0 0.24rem;

      .item {
        padding: 0.24rem 0;
        overflow: visible;
        width: 100%/3;
        flex-basis: 100%/3;
        // border-top: 0.02rem solid #F3F3F3;
        position: relative;
        &::after {
          position: absolute;
          box-sizing: border-box;
          content: " ";
          pointer-events: none;
          right: 0;
          // bottom: 0;
          top: 0;
          left: 0;
          border-top: 0.02rem solid #ebedf0;
          -webkit-transform: scaleY(0.58);
          transform: scaleY(0.58);
        }

        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3) {
          &::after {
            border: 0;
          }
          border-top: none;
        }

        .value {
          font-size: 0.32rem;
          line-height: 0.45rem;
          color: #444444;
        }

        .label {
          margin-top: 0.04rem;
          font-size: 0.28rem;
          line-height: 0.4rem;
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
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 start
.aqvns-lower-bg{
  background-color: #C9A786 !important;
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 end
</style>
