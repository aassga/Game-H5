<template>
  <van-popup
    @click-overlay="close"
    v-model="showDateSelector"
    :style="positionStyle"
    position="bottom"
    get-container="body"
    :overlay="true"
    :lazy-render="false"
    :close-on-click-overlay="false"
  >
    <div
      :class="[
        'filter-box',
        { 'qp-filter-box': newQP, 'blush-filter-box': $config.blush },
        { 'aqvns-box': $config.isAqvns },
      ]"
      v-if="date"
    >
      <p class="filter-box-title" v-if="targetDate">
        <span class="title">查询时间</span>
        <span class="date" style="margin: 0 0.05rem">(</span>
        <span class="date">{{ targetDate.start }}</span>
        <span class="date" style="margin: 0 0.1rem">~</span>
        <span class="date">{{ targetDate.end }}</span>
        <span class="date" style="margin: 0 0.05rem">)</span>
      </p>
      <ul class="list clear-fix" :class="{ 'date-list-top': dataIndex === 2 }">
        <template v-if="isZs">
          <li
            class="item f-l"
            v-for="(d, i) in listType"
            :key="d.type + '_' + i"
            :class="{ 'active theme-color': d.type === zsType }"
            @click="zsType = d.type"
          >
            <span
              class="
                icon
                iconfont
                h5-icon-icon-xuanzhong
                theme-color
                active-icon
              "
              v-show="d.type === zsType"
            ></span>
            {{ d.name }}
          </li>
        </template>
        <li
          class="item f-l"
          v-for="(d, i) in dataDate"
          :key="i"
          :class="{ 'active theme-color': d === targetDate }"
          @click="
            targetDate = d;
            selectDateIndex = i;
            selectClick(i);
          "
        >
          <span
            class="icon iconfont h5-icon-icon-xuanzhong theme-color active-icon"
            v-show="d === targetDate"
          ></span>
          {{ d.name }}
        </li>
      </ul>
      <div class="active-box" :class="{ 'date-active-box': dataIndex === 2 }">
        <button
          class="btn btn-cancel theme-color theme-border-1px"
          @click="close"
        >
          取消
        </button>
        <button class="btn btn-primary theme-bg" @click="onClick">确定</button>
      </div>
    </div>
  </van-popup>
</template>

<script type="text/javascript">
export default {
  name: "AgencyDateSelector",
  props: {
    isZs: {
      type: Boolean,
      default: false,
    },
    value: {
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
    defaultIndex: {
      type: Number,
      default: 0,
    },
    dataIndex: {
      type: Number,
      default: 1,
    },
    changeDateIndex: {
      type: Number,
      default: 0,
    },
    dateName: {
      type: String,
      default: "",
    },
    newQP: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    dataDate() {
      switch (this.dataIndex) {
        case 1:
          return this.dates;
        case 2:
          return this.dates2;
        case 3:
          return this.dates3;
        case 4:
          return this.dates4;
        default:
          return this.dates;
      }
    },
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
    showDateSelector: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("update:show", val);
      },
    },
    isClosed() {
      return this.$store.state.main.closeMask;
    },
    date: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  data() {
    return {
      dates: {},
      dates2: {},
      selectDateIndex: 0,
      targetDate: null,
      zsType: 0,
    };
  },
  created() {
    this.listType = [
      { name: "全部", type: 0 },
      { name: "直属", type: 1 },
      { name: "非直属", type: 2 },
    ];
    this.dates = [
      {
        name: "今天",
        start: this.dayJs().format("YYYY-MM-DD"),
        end: this.dayJs().format("YYYY-MM-DD"),
      },
      {
        name: "昨天",
        start: this.dayJs().subtract(1, "d").format("YYYY-MM-DD"),
        end: this.dayJs().subtract(1, "d").format("YYYY-MM-DD"),
      },
      {
        name: "近7天",
        start: this.dayJs().subtract(6, "d").format("YYYY-MM-DD"),
        end: this.dayJs().format("YYYY-MM-DD"),
      },
      {
        name: "本月",
        start: this.dayJs().startOf("month").format("YYYY-MM-DD"),
        end: this.dayJs().format("YYYY-MM-DD"),
      },
      {
        name: "上月",
        start: this.dayJs()
          .set("date", 1)
          .subtract(1, "month")
          .format("YYYY-MM-DD"),
        end: this.dayJs().set("date", 1).subtract(1, "d").format("YYYY-MM-DD"),
      },
    ];
    this.dates2 = [
      {
        name: "今天",
        start: this.dayJs().format("YYYY-MM-DD"),
        end: this.dayJs().format("YYYY-MM-DD"),
      },
      {
        name: "昨天",
        start: this.dayJs().subtract(1, "d").format("YYYY-MM-DD"),
        end: this.dayJs().subtract(1, "d").format("YYYY-MM-DD"),
      },
      {
        name: "近7天",
        start: this.dayJs().subtract(6, "d").format("YYYY-MM-DD"),
        end: this.dayJs().format("YYYY-MM-DD"),
      },
    ];
    this.dates3 = [
      {
        name: "今天",
        start: this.dayJs().format("YYYY-MM-DD"),
        end: this.dayJs().format("YYYY-MM-DD"),
      },
      {
        name: "昨天",
        start: this.dayJs().subtract(1, "d").format("YYYY-MM-DD"),
        end: this.dayJs().subtract(1, "d").format("YYYY-MM-DD"),
      },
      {
        name: "本月",
        start: this.dayJs().startOf("month").format("YYYY-MM-DD"),
        end: this.dayJs().format("YYYY-MM-DD"),
      },
      {
        name: "上月",
        start: this.dayJs()
          .set("date", 1)
          .subtract(1, "month")
          .format("YYYY-MM-DD"),
        end: this.dayJs().set("date", 1).subtract(1, "d").format("YYYY-MM-DD"),
      },
    ];
    this.dates4 = [
      {
        name: "今天",
        start: this.dayJs().format("YYYY-MM-DD"),
        end: this.dayJs().format("YYYY-MM-DD"),
      },
      {
        name: "昨天",
        start: this.dayJs().subtract(1, "d").format("YYYY-MM-DD"),
        end: this.dayJs().subtract(1, "d").format("YYYY-MM-DD"),
      },
      {
        name: "近7天",
        start: this.dayJs().subtract(6, "d").format("YYYY-MM-DD"),
        end: this.dayJs().format("YYYY-MM-DD"),
      },
      {
        name: "本月",
        start: this.dayJs().startOf("month").format("YYYY-MM-DD"),
        end: this.dayJs().format("YYYY-MM-DD"),
      },
      {
        name: "上月",
        start: this.dayJs()
          .set("date", 1)
          .subtract(1, "month")
          .format("YYYY-MM-DD"),
        end: this.dayJs().set("date", 1).subtract(1, "d").format("YYYY-MM-DD"),
      },
    ];
    this.$nextTick(() => {
      if (this.dateName)
        this.targetDate = this.dataDate.filter((date) => {
          return date.name == this.dateName;
        })[0];
      else this.targetDate = this.dataDate[this.defaultIndex || 0];
      this.$emit("input", this.targetDate);
    });
  },

  watch: {
    showDateSelector() {
      this.$store.commit("main/isShowMask", {
        page: "report",
        status: this.showDateSelector,
      });
    },
    value() {
      if (!this.value) {
        this.targetDate = this.dataDate[this.defaultIndex || 0];
        this.$emit("input", this.targetDate);
      } else {
        this.targetDate = this.dataDate[this.defaultIndex || 0];
      }
    },
    isClosed() {
      if (this.isClosed.page == "report") {
        this.showDateSelector = this.isClosed.status;
      }
    },
    defaultIndex() {
      this.targetDate = this.dataDate[this.defaultIndex || 0];
      this.$emit("input", this.targetDate);
    },
    changeDateIndex() {
      if (this.dateName)
        this.targetDate = this.dataDate.filter((date) => {
          return date.name == this.dateName;
        })[0];
      else this.targetDate = this.dataDate[0];
      this.$emit("input", this.targetDate);
    },
    selectDateIndex(val, old) {
      this.$emit("getDefaultIndex", val);
    },
  },
  methods: {
    selectClick(index) {
      this.$emit("indexEvent", index);
    },
    onClick() {
      this.date = this.targetDate;
      this.showDateSelector = false;
      this.$emit(
        "okSelect",
        this.targetDate,
        this.selectDateIndex,
        this.zsType
      );
    },

    close() {
      this.dataDate.forEach((item, index) => {
        if (item.name == this.date.name) {
          this.targetDate = item;
        }
      });
      this.showDateSelector = false;
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.filter-box {
  width: 7.5rem - (0.16rem * 2);
  margin: 0 auto;
  background-color: #ffffff;
  border-top-left-radius: 0.1rem;
  border-top-right-radius: 0.1rem;
  position: relative;
  .date-list-top {
    padding-top: 0.15rem;
  }
  .date-active-box {
    padding: 0.52rem 0.24rem 0.48rem 0.24rem !important;
  }
  .close {
    position: absolute;
    right: 0.16rem;
    top: 0.13rem;
    color: #999999;
    font-size: 0.5rem;
  }

  .filter-box-title {
    font-size: 0.32rem;
    font-weight: 500;
    color: #666666;
    line-height: 0.45rem;
    padding-top: 0.56rem;
    padding-left: 0.24rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .title {
      margin-right: 0.1rem;
      font-size: 0.32rem;
      font-family: PingFang-SC;
      font-weight: 500;
      color: rgba(102, 102, 102, 1);
    }

    .date {
      font-size: 0.26rem;
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
      line-height: 0.5rem;
      font-family: PingFang-SC-Medium, PingFang-SC;
    }
  }

  .list {
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 0.24rem;
      border-radius: 0.05rem;
      margin-top: 0.24rem;
      width: (7.5rem - (0.16rem * 2) - (0.24rem * 4)) / 3;
      font-size: 0.3rem;
      height: 0.76rem;
      color: #333333;
      background: #f5f5f5;
      position: relative;
      &.active {
        color: #2c93ff;
        background-size: 100%;
      }
      .active-icon {
        position: absolute;
        right: -0.01rem;
        bottom: -0.01rem;
      }
    }
  }

  .active-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.72rem 0.24rem 0.48rem 0.24rem;

    .btn {
      width: (7.5rem - (0.16rem * 2) - (0.24rem * 3)) / 2;
      font-size: 0.38rem;
      display: inline-block;
      text-align: center;
      height: 1rem;
      border-radius: 0.1rem;
      outline: 0;
    }

    .btn-cancel {
      background-color: #ffffff;
      border: 0.02rem solid #2c93ff;
      color: #2c93ff;
    }

    .btn-primary {
      background-color: #2c93ff;
      color: #ffffff;
    }
  }
  &.qp-filter-box {
    background: linear-gradient(180deg, #181818, #0c0c0c, #0c0c0c);
    .title {
      color: #fff;
    }
    .item {
      color: #fff;
      background: linear-gradient(0deg, #0c0c0c, #222222) !important;
      &.active {
        color: #f6cf32 !important;
        span {
          color: #f6cf32 !important;
        }
      }
    }
    .btn-cancel {
      background-color: #000 !important;
      color: #f6cf32 !important;
      border-color: #f6cf32 !important;
    }
    .btn-primary {
      background: linear-gradient(0deg, #f1eb72, #ecbe04) !important;
      color: #000 !important;
    }
  }
  &.blush-filter-box {
    background: linear-gradient(0deg, #530107, #7e010c);
    .title {
      color: #fff;
    }
    .item {
      color: #fff;
      background: linear-gradient(0deg, #9d010f, #72010b) !important;
      border: 1px solid #90252e;
      &.active {
        color: #f6cf32 !important;
        border: 1px solid #fbd67a;
        span {
          color: #f6cf32 !important;
        }
      }
    }
    .btn-cancel {
      background-color: #640009 !important;
      color: #f6cf32 !important;
      border-color: #f6cf32 !important;
    }
    .btn-primary {
      background: linear-gradient(0deg, #f1eb72, #ecbe04) !important;
      color: #000 !important;
    }
  }
  &.aqvns-box{
    .active{
      color: #C9A786 !important;
    }
    .active-box{
      .btn{
        color: #C9A786 !important;
        border: 0.02rem solid #C9A786 !important;
      }
      .theme-bg{
        color: #ffffff !important;;
        background-color: #C9A786 !important;
      }
    }
  }
}
</style>
