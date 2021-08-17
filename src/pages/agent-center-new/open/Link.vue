<template>
  <view-page ref="view-page" class="agent-link theme-header-bg" full-box>
    <title-header
      :title="'生成邀请' + (siteModel === 'invite_link' ? '链接' : '码')"
      slot="header"
      back-event
      @back="$router.go(status?-2:-1)"
      class="theme-main-bg theme-header-bottom"
    ></title-header>

    <div style="padding-top: 0.24rem" class="theme-header-bg" slot="header-static">
      <p class="info" v-show="personalMode==='mode_a'">
        <span class="van-icon van-icon-warning-o"></span>
        <span>下级抽成最小为0，不获得返佣。最大不超过0.3%</span>
      </p>
      <van-cell-group
        class="view-box theme-main-bg-5"
        style="margin-top: 0;padding: 0.2rem 0;"
        v-show="!personalMode||personalMode==='no'"
        :border="false"
      >
        <div class="no-link">
          <span class="title theme-color-white">开户类型</span>
          <span class="link-type theme-border-1px theme-color" :class="[{'theme-yellow-bg-2 theme-color-white theme-noborder theme-bg active': userType===1 },{'theme-main-bg-5 theme-color-yellow theme-border-yellow': userType!==1 }]" @click="userType=1">代理</span>
          <span class="link-type theme-border-1px theme-color" :class="[{'theme-yellow-bg-2 theme-color-white theme-noborder theme-bg active': userType===0 },{'theme-main-bg-5 theme-color-yellow theme-border-yellow' : userType!==0}]" @click="userType=0">会员</span>
        </div>
      </van-cell-group>
    </div>

    <div class="content-slot" slot="content">
      <ul v-if="$store.state.agency.refundRebate">
        <li
          class="view-box rebate-item theme-main-bg-5"
          v-for="(item, i) in $store.state.agency.refundRebate"
          :key="i"
        >
          <div class="bmg theme-agent-tab theme-yellow-bg-2">
            <span class="label theme-color-black" :class="getLabelClass(item)">{{item['type_cn'].toString()}}</span>
          </div>
          <div class="rebate-box">
            <p class="info-row">
              <span class="theme-color-white">我的:</span>
              <span class="value">{{getMax(item.list).val}}%</span>
              <span class="span"></span>
              <span class="theme-color-white">下级:</span>
              <span class="value">
                {{getFloatOne((getMax($store.state.agency.refundRebate[i].list).val*10 - (getMaxDiffItem($store.state.agency.refundRebateForOpen[i].list)['subValue'] || 0)*10) / 10)==0?
                '0.0':getFloatOne((getMax($store.state.agency.refundRebate[i].list).val*10 - (getMaxDiffItem($store.state.agency.refundRebateForOpen[i].list)['subValue'] || 0)*10) / 10) }}%
              </span>
            </p>
            <p class="edit-row">
              <span class="edit-label theme-color-white">提成</span>

              <span
                class="edit-action iconfont h5-icon-icon-subtract theme-color-yellow theme-border-color-3"
                @click.stop="onSub(i)"
                :class="{disabled:(getMax($store.state.agency.refundRebateForOpen[i].list)['subValue']||0)<=0}"
              ></span>

              <span
                class="edit-value theme-color-white theme-border-color-3"
                @click.stop="onSelect(i,item.max_rate)"
              >{{getFloatOne(getMaxDiffItem($store.state.agency.refundRebateForOpen[i].list)['subValue']) || '0.0'}}</span>
              <span
                class="edit-action iconfont h5-icon-icon-plus theme-color-yellow theme-border-color-3"
                @click.stop="onAdd(i)"
                :class="{disabled:getMaxDiffItem($store.state.agency.refundRebateForOpen[i].list)['subValue']>=getMaxDiff(i)}"
              ></span>
            </p>
          </div>
          <div class="more-link" @click="$router.push('/user/agency-center-new/open/edit/' + i)">
            <span class="van-icon van-icon-arrow"></span>
          </div>
        </li>
      </ul>

      <button
        slot="footer"
        class="btn-user theme-bg theme-yellow-bg-2 theme-color-black"
        style="margin-top: 0.4rem"
        :disabled="submitting"
        @click="onSubmit"
      >生成邀请{{siteModel === 'invite_link' ? '链接' : '码'}}</button>

      <div style="height: 0.72rem"></div>
    </div>

    <!--    <button slot="footer" class="btn-user-link" style="width: 100%;border-radius: 0" @click="onSubmit">-->
    <!--      生成邀请{{siteModel === 'invite_link' ? '链接' : '码'}}-->
    <!--    </button>-->

    <div slot="static">
      <van-popup v-model="showSelector" position="bottom" get-container="body">
        <van-picker
          show-toolbar
          :item-height="40"
          v-model="showSelector"
          :columns="getValList().map(n => getFloatOne(n))"
          value-key="name"
          @confirm="onRebateSelect"
          @cancel="showSelector=false"
          :default-index="getValList().indexOf(editVal)"
          :class="{'black-van-picker':$config.blackTheme || $config.newQP,'blush-van-picker':$config.blush}"
        ></van-picker>
      </van-popup>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "EditRebate",
  props: {
    status: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      userType: 1,
      showSelector: false,
      editMax: 0.3,
      nums: [],
      editIndex: NaN,
      editVal: 0,
      submitting: false,
      linkList: []
    };
  },
  created() {
    const nums = [0];
    for (let i = 0; i <= this.editMax; i += 0.1) {
      nums.push(Math.round(i * 10 + 1) / 10);
    }
    this.nums = nums;
    if (this.$store.state.agency.editing) {
      this.$store.state.agency.editing = false;
      this.$nextTick(() => {
        this.loaded = true;
      });
    } else {
      this.$store.dispatch("agency/getRefundRebate").then(res => {
        this.$nextTick(() => {
          this.loaded = true;
        });
      });
    }
  },

  methods: {
    getValList() {
      if (isNaN(this.editIndex)) {
        return [];
      } else if (this.personalMode === "mode_a") {
        return this.nums;
      } else {
        const dates = [0];
        let max = parseFloat(
          this.getMax(
            this.$store.state.agency.refundRebate[this.editIndex].list
          ).val
        );
        max = (max * 10) / 10;
        for (let i = 1; i <= max * 10; i += 1) {
          dates.push(Math.abs(i) / 10);
        }
        return dates;
      }
    },
    getMaxDiff(index) {
      if (this.personalMode === "mode_a") return 0.3;
      else
        return parseFloat(
          this.getMax(this.$store.state.agency.refundRebate[index].list).val
        );
    },
    onSubmit() {
      this.submitting = true;
      const json = {};
      for (let k in this.$store.state.agency.refundRebateForOpen) {
        if (this.$store.state.agency.refundRebateForOpen.hasOwnProperty(k)) {
          this.$store.state.agency.refundRebateForOpen[k].list.forEach(item => {
            json[item["platform_en"]] = item.val;
          });
        }
      }
      this.$store
        .dispatch("agency/createInvite", {
          type: this.userType,
          json: JSON.stringify(json)
        })
        .then(res => {
          this.submitting = false;
          if (res.code === 200) {
            this.$store
              .dispatch("agency/getInviteList", {
                page: this.page,
                limit: this.limit
              })
              .then(res => {
                this.linkList = res.data.data;
              });
            this.toastText("生成完成\n推广链接已复制", "top");
            this.$store.state.agency.refundRebateForOpen = JSON.copyObj(
              this.$store.state.agency.refundRebate
            );
            this.userType = 1;
            this.$router.replace("/user/agency-center-new/open");
          } else {
            this.toastText(res.message, "top");
          }
        })
        .catch(() => {
          this.submitting = false;
          this.toastText("网络错误", "top");
          this.opening = false;
        });
      setTimeout(() => {
        this.$copyText(this.linkList[0].domain)
      }, 500);
    },
    /**
     * 下拉选择
     */
    onSelect(index, max) {
      setTimeout(() => {
        this.editIndex = index;
        const list = this.$store.state.agency.refundRebateForOpen[
          this.editIndex
        ].list;
        this.editVal = this.getMaxDiffItem(list)["subValue"];
        this.showSelector = true;
      }, 100);
    },
    /**
     * 下拉选择
     */
    onRebateSelect(val) {
      this.showSelector = false;
      if (!isNaN(this.editIndex)) {
        val = parseFloat(val);
        const baseVal =
          this.getMaxDiffItem(
            this.$store.state.agency.refundRebateForOpen[this.editIndex].list
          )["subValue"] || 0;
        if (val > baseVal) {
          this.onAdd(this.editIndex, val - baseVal);
        } else if (val < baseVal) {
          if (val < this.editMax) {
            this.onSub(this.editIndex, baseVal - val, val);
          } else {
            this.onSub(this.editIndex, baseVal - val);
          }
        }
      }

      this.editIndex = NaN;
    },

    /**
     * 转一位小数
     */
    getFloatOne(val) {
      val = parseFloat(val);
      if (!val) return "0";
      else if (!val.toString().includes(".")) return val + ".0";
      else return val.toString();
    },

    /**
     * 类型中整体加1
     * @param index
     * @param val
     */
    onAdd(index, val) {
      val = val || 0.1;
      this.$store.state.agency.refundRebateForOpen[index].list.forEach(
        (item, i) => {
          const baseValue = parseFloat(
            this.$store.state.agency.refundRebate[index].list[i].val
          );
          if (!item["subValue"]) item["subValue"] = 0;
          let value = Math.round(item["subValue"] * 10 + val * 10) / 10;
          let editMax;
          if (this.personalMode === "mode_a") editMax = this.editMax;
          else
            editMax = parseFloat(
              this.$store.state.agency.refundRebate[index].list[i].val
            );
          if (value > editMax) {
            value = editMax;
          } else if (value > baseValue) {
            value = baseValue;
          }
          item["subValue"] = (value * 1).toFixed(1);
          item.val = this.getFloatOne(
            Math.round(baseValue * 10 - item["subValue"] * 10) / 10
          );
        }
      );
      this.$set(
        this.$store.state.agency.refundRebateForOpen,
        index,
        this.$store.state.agency.refundRebateForOpen[index]
      );
      console.log(this.$store.state.agency.refundRebateForOpen);
    },

    /**
     * 类型中整体减1
     * @param index
     * @param val
     */
    onSub(index, val, currentVal) {
      val = val || 0.1;
      let value;
      let getMaxDiffItem = this.getMaxDiffItem(
        this.$store.state.agency.refundRebateForOpen[index].list
      ).subValue;
      this.$store.state.agency.refundRebateForOpen[index].list.forEach(
        (item, i) => {
          let editMax = parseFloat(
            this.$store.state.agency.refundRebate[index].list[i].val
          );
          if (!item["subValue"]) item["subValue"] = 0;
          if (item.platform_en == "CT_LOTTERY") {
            getMaxDiffItem > editMax
              ? !isNaN(currentVal)
                ? (value = currentVal)
                : (value = editMax)
              : (value = Math.round(item["subValue"] * 10 - val * 10) / 10);
          } else value = Math.round(item["subValue"] * 10 - val * 10) / 10;
          if (value < 0) value = 0;
          item["subValue"] =
            parseFloat(value) == 0 ? 0 : (value * 1).toFixed(1);
          const baseValue = parseFloat(
            this.$store.state.agency.refundRebate[index].list[i].val
          );
          item.val = this.getFloatOne(
            Math.round(baseValue * 10 - item["subValue"] * 10) / 10
          );
        }
      );
      this.$set(
        this.$store.state.agency.refundRebateForOpen,
        index,
        this.$store.state.agency.refundRebateForOpen[index]
      );
    },

    /**
     * 获取类型中的最大值
     * @param list
     * @returns {Object}
     */
    getMax(list) {
      let index = 0;
      let val = 0;
      list.forEach((item, i) => {
        const v = parseFloat(item.val.toString());
        if (v > val) {
          val = v;
          index = i;
        }
      });
      return list[index];
    },

    /**
     * 获取类型中的最大 差值
     * @param list
     * @returns {Object}
     */
    getMaxDiffItem(list) {
      let index = 0;
      let val = 0;
      list.forEach((item, i) => {
        const v = parseFloat(item.subValue || 0);
        if (v > val) {
          val = v;
          index = i;
        }
      });
      return list[index];
    },

    /**
     * 区分背景图
     * @param item
     * @returns {string}
     */
    getLabelClass(item) {
      return "label-" + item["type_en"].toLowerCase();
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
.black-van-picker {
  background: linear-gradient(0deg, #0B0B0B, #100F0F);
  /deep/ .van-picker__toolbar {
    .van-picker__cancel, .van-picker__title ,.van-picker__confirm{ 
      color: #fff !important;
    }
    &::after {
      border: none !important;
    }
  }
  /deep/ .van-picker__columns {
    background: linear-gradient(0deg, #0B0B0B, #100F0F);
    .van-picker-column__item {
      color: #fff;
    }
  }
  /deep/ .van-picker__mask {
    background: none;
  }
}
 .blush-van-picker {
    background: linear-gradient(0deg, #530107, #7E010C);
    /deep/ .van-picker__toolbar {
      .van-picker__cancel, .van-picker__title ,.van-picker__confirm{ 
        color: #fff !important;
      }
    }
    /deep/ .van-picker__columns {
      background: linear-gradient(0deg, #530107, #7E010C);
      .van-picker-column__item {
        color: #fff;
      }
    }
    /deep/ .van-picker__mask {
      background: none;
    }
  }
/deep/ .van-picker {
  width: 7.18rem;
  margin: 0 auto;
  border-top-left-radius: 0.1rem;
  border-top-right-radius: 0.1rem;
}

/deep/ .van-picker__toolbar::after {
  border-top: none;
}

.agent-link {
  /deep/ .van-tab {
    color: #666666 !important;
  }

  /deep/ .van-tab--active {
    color: #2c93ff !important;
  }

  /deep/ .van-tabs__line {
    background-color: #2c93ff !important;
  }

  /deep/ .van-field__control {
    color: #444444 !important;
  }

  /deep/ .van-field__control:disabled {
    color: #444444 !important;
  }

  /deep/ .van-field--error .van-field__control {
    color: #e71414 !important;
  }

  /deep/ .van-field--error .van-field__control::placeholder {
    color: #e71414 !important;
  }

  /deep/ .no-link::after {
    content: none;
  }

  /deep/ .van-cell:not(:last-child)::after {
    left: 1.8rem;
  }

  /deep/ .van-field__label {
    font-size: 0.3rem;
    color: #444444;
  }

  /deep/ .van-field__control {
    font-size: 0.3rem;
  }

  .info {
    margin: 0 auto 0.24rem auto;
    width: 7.18rem;
    height: 0.72rem;
    border-radius: 0.1rem;
    background-color: #fff0e6;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #ff7c5b;
    font-size: 0.28rem;
    padding: 0.16rem;
    box-sizing: border-box;

    .van-icon {
      font-size: 0.36rem;
      margin-right: 0.06rem;
    }
  }

  .van-cell {
    height: 0.9rem;
  }

  .user-type-select {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 0.3rem;

    .user-type-item {
      border-radius: 0.1rem;
      height: 0.72rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.36rem;
      border: 0.02rem solid #2c93ff;
      color: #2c93ff;
      margin-right: 0.3rem;

      &.active {
        background-color: #2c93ff;
        color: #ffffff !important;
        border: none;
      }
    }
  }

  .content-slot {
    padding-top: 0.24rem;
  }

  .btn-user {
    width: 7.18rem;
    height: 0.96rem;
    border-radius: 0.1rem;
    background-color: #2c93ff;
    color: #ffffff;
    font-size: 0.38rem;
    // display: flex;
    display: inline-block;
    text-align: center;
    justify-content: center;
    align-items: center;
    margin: 0.24rem auto 0 auto;
  }

  .btn-user-link {
    width: 7.18rem;
    height: 0.96rem;
    border-radius: 0.1rem;
    background-color: #ffffff;
    color: #2c93ff;
    font-size: 0.38rem;
    display: inline-block;
    text-align: center;
    // display: flex;
    justify-content: center;
    // align-items: center;
    margin: 0 auto;
    box-shadow: 0 -0.06rem 0.05rem 0 rgba(0, 0, 0, 0.03);
  }

  .rebate-item {
    height: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    overflow: visible !important;

    &:first-child {
      margin-top: 0;
    }
    .bmg {
      left: 0;
      top: -0.04rem;
      width: 1.88rem;
      height: 1.62rem;
      position: absolute;
      border-radius: 0.16rem 0 0 0.16rem;
      .label {
        width: 100%;
        height: 100%;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        background-position: 0 0;
        background-size: 100%;
        background-repeat: no-repeat;
        font-size: 0.36rem;
        font-weight: bold;

        &.label-live {
          background-image: url("../../../assets/img/agent-center-new/label-live.png");
        }

        &.label-lottery {
          background-image: url("../../../assets/img/agent-center-new/label-lottery.png");
        }

        &.label-sport {
          background-image: url("../../../assets/img/agent-center-new/label-sport.png");
        }

        &.label-game {
          background-image: url("../../../assets/img/agent-center-new/label-slot.png");
        }

        &.label-chess {
          background-image: url("../../../assets/img/agent-center-new/label-chess.png");
        }
        &.label-fish {
          background-image: url("../../../assets/img/agent-center-new/label-fish.png");
        }
      }
    }

    .rebate-box {
      padding: 0.2rem 0 0.2rem 2.58rem;
      flex: 1;
      height: 100%;
      text-align: left;
      font-size: 0.3rem;
      color: #444444;
      white-space: nowrap;

      .info-row {
        line-height: 0.42rem;
        margin-bottom: 0.24rem;

        .span {
          display: inline-block;
          width: 0.4rem;
        }

        .value {
          color: #e71414;
        }
      }

      .edit-row {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 0.56rem;
        width: 100%;
        white-space: nowrap;
        flex-wrap: nowrap;

        .edit-label {
          margin-right: 0.2rem;
        }

        .edit-action {
          font-size: 0.3rem;
          font-family: Arial, sans-serif;
          color: #a2a2a2;
          font-weight: 500;
          border: 0.03rem solid #dbdbdb;
          width: 0.56rem;
          height: 0.56rem;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;

          &.h5-icon-icon-subtract {
            border-top-left-radius: 0.06rem;
            border-bottom-left-radius: 0.06rem;
          }

          &.h5-icon-icon-plus {
            border-top-right-radius: 0.06rem;
            border-bottom-right-radius: 0.06rem;
          }

          &.disabled {
            color: #eaeaea;
          }
        }

        .edit-value {
          border-top: 0.03rem solid #dbdbdb;
          border-bottom: 0.03rem solid #dbdbdb;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          height: 0.56rem;
          width: 1.3rem;
        }
      }
    }
    .more-link {
      position: relative;
      width: 1rem;
      height: 100%;
      line-height: 1.5rem;
      span {
        position: absolute;
        right: 0.15rem;
        top: 0.6rem;
      }
    }

    .van-icon {
      font-size: 0.3rem;
      color: #999999;
      padding-right: 0.1rem;
    }
  }

  .btn-save {
    width: 7.18rem;
    height: 0.96rem;
    border-radius: 0.1rem;
    background-color: #2c93ff;
    color: #ffffff;
    font-size: 0.38rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .no-link{
    display: flex;
    .title{
      font-size: 0.3rem;
      color: #444444;
      width: 1.8rem;
      line-height: 0.72rem;
    }
    .link-type{
        font-size: 0.3rem;
        border-radius: 0.1rem;
        height: 0.72rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.36rem;
        border: 0.02rem solid #2c93ff;
        color: #2c93ff;
        margin-right: 0.3rem;
      &.active {
        background-color: #2c93ff;
        color: #ffffff !important;
      }
    }
  }
}
</style>
