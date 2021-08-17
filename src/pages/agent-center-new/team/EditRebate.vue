<template>
  <view-page ref="view-page" class="agent-link theme-header-bg" full-box>
    <title-header title="修改提成" slot="header" class="theme-main-bg theme-header-bottom"></title-header>

    <div class="content-slot" slot="content">
      <p class="info" v-if="personalMode ==='mode_a'">
        <span class="van-icon van-icon-warning-o"></span>
        <span >下级抽成最小为0，不获得返佣。最大不超过0.3%</span>
      </p>
      <p class="view-box user-info theme-main-bg-5 theme-color-white">
        <span class="label">帐号:</span>
        <span class="user-name">{{username}}</span>
        <img
          class="user-type"
          v-if="isAgent==='1'"
          src="../../../assets/img/agent-center-new/user-type-agent.png"
          alt
        />
        <img
          class="user-type"
          v-else
          src="../../../assets/img/agent-center-new/user-type-member.png"
          alt
        />
      </p>

      <ul v-if="$store.state.agency.refundRebate">
        <li
          class="view-box rebate-item theme-main-bg-5"
          v-for="(item, i) in $store.state.agency.refundRebate"
          :key="i"
        
        >
          <div class="bmg theme-agent-tc-bg theme-yellow-bg-2">
            <span
              class="label theme-color-black"
              :class="getLabelClass(item)"
            >{{item['type_cn'].toString().substr(0, 2) + '佣金'}}</span>
          </div>
          <div class="rebate-box">
            <p class="info-row">
              <span class="theme-color-white">我的:</span>
              <span class="value">{{getMax(item.list).val}}%</span>
              <span class="span"></span>
              <span class="theme-color-white">下级:</span>
              <span class="value">{{(getFloatOne((getMax($store.state.agency.refundRebate[i].list)['val']*10-(getMaxSubValue($store.state.agency.refundRebateForOpen[i].list)['subValue']||0)*10)/10)==0?'0.0':getFloatOne((getMax($store.state.agency.refundRebate[i].list)['val']*10-(getMaxSubValue($store.state.agency.refundRebateForOpen[i].list)['subValue']||0)*10)/10))}}%</span>
              <!-- <span class="value">{{((getMin($store.state.agency.refundRebateForOpen[i].list).val)*1).toFixed(1)}}%</span> -->
            </p>
            <p class="edit-row">
              <span class="edit-label theme-color-white">提成</span>

              <span
                class="edit-action iconfont h5-icon-icon-subtract theme-color-yellow theme-border-color-3"
                @click.stop="onSub(i)"
                :class="{disabled:(getMaxSubValue($store.state.agency.refundRebateForOpen[i].list)['subValue']||0)<=0}"
              ></span>

              <span
                class="edit-value theme-color-white theme-border-color-3"
                @click.stop="onSelect(i,item.max_rate)"
              >{{getFloatOne(getMaxSubValue($store.state.agency.refundRebateForOpen[i].list)['subValue']) || '0'}}</span>

              <span
                class="edit-action iconfont h5-icon-icon-plus theme-color-yellow theme-border-color-3"
                @click.stop="onAdd(i,0.1,item.max_rate)"
                :class="{disabled:personalMode=='mode_a'?getMax($store.state.agency.refundRebateForOpen[i].list)['subValue'] >=editMax :getMaxSubValue($store.state.agency.refundRebateForOpen[i].list)['subValue'] >= getMax(item.list).val}"
              ></span>
            </p>
          </div>
          <div class="more-link" @click="$router.push('/user/agency-center-new/open/edit/' + i)">
            <span class="van-icon van-icon-arrow"></span>
          </div>
        </li>
      </ul>

      <div style="padding: 0.72rem 0.16rem">
        <button class="btn-save theme-bg theme-yellow-bg-2 theme-color-black" @click="onSubmit">保存</button>
      </div>
    </div>

    <div slot="static">
      <van-popup v-model="showSelector" position="bottom" get-container="body" :lazy-render="false">
        <van-picker
          show-toolbar
          v-model="showSelector"
          :columns="nums.map(n => getFloatOne(n))"
          :item-height='40'
          value-key="name"
          @confirm="onRebateSelect"
          @cancel="showSelector=false"
          :default-index="nums.indexOf(editVal)"
          :class="{'black-van-picker':$config.blackTheme || $config.newQP,'blush-van-picker':$config.blush}"
        ></van-picker>
      </van-popup>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "Link",
  props: {
    uid: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    isAgent: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showSelector: false,
      editMax: 0.3,
      nums: [],
      editIndex: NaN,
      editVal: 0,
      editRebate:[],
      MaxList:[]
    };
  },
  created() {
    const nums = [0];
    for (let i = 0; i <= this.editMax; i += 0.1) {
      nums.push(Math.round(i * 10 + 1) / 10);
    }
    this.nums = nums;
    
    if (this.$store.state.agency.editing) {
      // this.$store.state.agency.refundRebateForOpen = JSON.parse(localStorage.refundRebateForOpen)
      // this.getMaxList()
      this.$store.state.agency.editing = false;
    } else {
      this.$store.dispatch("agency/getRefundRebate").then(res => {
        if (res.code === 200) {
          this.$store
            .dispatch("agency/getLowerRefundRebate", this.uid)
            .then(res => {
              if (res.code === 200) {
                res.data.forEach((type, typeIndex) => {
                  type.list.forEach((item, itemIndex) => {
                    const baseVal = this.$store.state.agency.refundRebate[typeIndex].list[itemIndex].val;
                    item.subValue =Math.round((parseFloat(baseVal) - parseFloat(item.val)) * 10) / 10;
                  });
                });
                this.$store.state.agency.refundRebateForOpen = res.data;
                localStorage.refundRebateForOpen = JSON.stringify(res.data)
                // this.getMaxList()
              } else {
                this.toastText(res.message, "top");
              }
            });
        } else {
          this.toastText(res.message, "top");
        }
      });
    }
  },
 
  methods: {
     getMaxList(){
      let index = 0
      let val = 0
      this.$store.state.agency.refundRebateForOpen.forEach((item,i)=>{
        item.list.forEach((listItem,listIndex)=>{
            let v = parseFloat(listItem.subValue || 0)
            if (v > val) {
              val = v
              index = listIndex
            }
        })
        this.MaxList.push(this.$store.state.agency.refundRebateForOpen[i].list[index].subValue)
      })
    },
    onSubmit() {
      if (this.submitting) {
        this.toastText("正在提交,请勿重复提交", "top");
      } else {
        const json = {};
        for (let k in this.$store.state.agency.refundRebateForOpen) {
          if (this.$store.state.agency.refundRebateForOpen.hasOwnProperty(k)) {
            this.$store.state.agency.refundRebateForOpen[k].list.forEach(
              item => {
                json[item["platform_en"]] = item.val;
              }
            );
          }
        }

        this.submitting = true;
        this.$store
          .dispatch("agency/modifyRate", {
            uid: this.uid,
            json: JSON.stringify(json)
          })
          .then(res => {
            this.submitting = false;
            if (res.code === 200) {
              this.toastText("修改成功", "top");
              this.$store.state.agency.refundRebateForOpen = JSON.copyObj(
                this.$store.state.agency.refundRebate
              );
              this.$router.back();
            } else {
              this.toastText(res.message, "top");
            }
          })
          .catch(() => {
            this.submitting = false;
            this.toastText("网络错误", "top");
            this.opening = false;
          });
      }
    },
    /**
     * 下拉选择
     */
    onSelect(index,max) {
      const nums = [0];
      if(this.personalMode === 'no'){
        this.editMax = (max*10)/10;
        for (let i = 1; i <= this.editMax*10; i += 1) {
          nums.push(Math.round(i) / 10);
        }
      }else{
        let maxBl = this.editMax;
        if(this.personalMode === 'mode_a'){
          //代理A模式下佣金比例调整限制
          if(max <= 0.3){

            //当我的佣金比例小于等于0.3的时候，最大调整为我当前的佣金比例
            maxBl = max;
          }else{
            //当我的佣金比例大于0.3的时候，最大也只能调整0.3
            maxBl = 0.3;
          }
        }
        for (let i = 1; i <= maxBl*10; i += 1) {
          nums.push(Math.round(i) / 10);
        }
      }
      this.nums = nums;      
      setTimeout(() => {
        this.showSelector = true;
        this.editIndex = index;
        if(this.personalMode === 'mode_a'){
          //代理A模式下佣金比例调整限制
          if(max <= 0.3){
            //当我的佣金比例小于等于0.3的时候，最大调整为我当前的佣金比例
            this.editVal = max;
          }else{
            //当我的佣金比例大于0.3的时候，最大也只能调整0.3
            this.editVal = 0.3;
          }
        }else{
          this.editVal = this.getMaxSubValue(this.$store.state.agency.refundRebateForOpen[this.editIndex].list)["subValue"];
        }        
      }, 450);
    },
    /**
     * 下拉选择
     */
    onRebateSelect(val) {
      this.showSelector = false;
      if (!isNaN(this.editIndex)) {
        val = parseFloat(val);
        const baseVal =
          this.getMaxSubValue(
            this.$store.state.agency.refundRebateForOpen[this.editIndex].list
          )["subValue"] || 0;
        if (val > baseVal) {
          this.onAdd(this.editIndex, val - baseVal);
        } else if (val < baseVal) {
          this.onSub(this.editIndex, baseVal - val);
        }
      }

      this.editIndex = NaN;
    },

    /**
     * 转一位小数
     */
    getFloatOne(val) {
      // console.log(val)
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
    onAdd(index, val , max) {
      if(this.personalMode === 'no'){
        this.editMax = max ? JSON.parse(max) : this.nums[this.nums.length-1];
      }
      if(this.personalMode === 'mode_a'){
        //代理A模式下佣金比例调整限制
          if(max <= 0.3){
            //当我的佣金比例小于等于0.3的时候，最大调整为我当前的佣金比例
            this.editMax = max;
          }else{
            //当我的佣金比例大于0.3的时候，最大也只能调整0.3
            this.editMax = 0.3;
          }
      }
      val = val || 0.1;
      let self = this;
      this.$store.state.agency.refundRebateForOpen[index].list.forEach(
        (item, i) => {
          if (!item["subValue"]) item["subValue"] = 0;
          let value = Math.round(item["subValue"] * 10 + val * 10) / 10;
          // if(index == 3){
          //   self.editMax = parseFloat(this.$store.state.agency.refundRebate[index].list[i].val)
          // }
          if (value > self.editMax) {value = self.editMax;}
          item["subValue"] = value;
          const baseValue = parseFloat(
            self.$store.state.agency.refundRebate[index].list[i].val
          );
          if(item["subValue"]>baseValue){item["subValue"]= baseValue} 
          item.val = self.getFloatOne(
            Math.round(baseValue * 10 - item["subValue"] * 10) / 10
          )<0?0:self.getFloatOne(
            Math.round(baseValue * 10 - item["subValue"] * 10) / 10
          );
          self.$set(
            self.$store.state.agency.refundRebateForOpen,
            index,
            self.$store.state.agency.refundRebateForOpen[index]
          );
        }
      );
    },

    /**
     * 类型中整体减1
     * @param index
     * @param val
     */
    onSub(index, val) {
      val = val || 0.1;
      this.$store.state.agency.refundRebateForOpen[index].list.forEach(
        (item, i) => {
          if (!item["subValue"]) item["subValue"] = 0;

          let value = Math.round(item["subValue"] * 10 - val * 10) / 10;
          if (value < 0) value = 0;
          item["subValue"] = value;

          const baseValue = parseFloat(
            this.$store.state.agency.refundRebate[index].list[i].val
          );
          item.val = this.getFloatOne(
            Math.round(baseValue * 10 - item["subValue"] * 10) / 10
          );

          this.$set(
            this.$store.state.agency.refundRebateForOpen,
            index,
            this.$store.state.agency.refundRebateForOpen[index]
          );
        }
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
    getMaxSubValue(list){
      let index = 0;
      let val = 0;
      list.forEach((item, i) => {
        const v = parseFloat(item.subValue);
        if (v > val) {
          val = v;
          index = i;
        }
      });
      return list[index];
    },
    getMin(list){
      let index = 0;
      let val = 100;
      let isMin = false;
      list.forEach((item, i) => {
        const v = parseFloat(item.val.toString());
        if (v < val) {
          val = v;
          index = i;
        }
        const sub = parseFloat(item.subValue);
        if(sub > 0){
          //表示有下级占成
          isMin = true;
        }
      });
      if(isMin){
        return list[index];
      }else{
        //取最大值
        val = 0;
        list.forEach((item, i) => {
          const v = parseFloat(item.val.toString());
          if (v > val) {
            val = v;
            index = i;
          }
       
        });
        return list[index];
      }
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
/deep/ .van-picker {
  width: 7.18rem;
  margin: 0 auto;
  border-top-left-radius: 0.1rem;
  border-top-right-radius: 0.1rem;
}

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

  .info {
    margin: 0.04rem auto 0 auto;
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

  .user-info {
    padding: 0 0.24rem;
    display: flex;
    font-size: 0.32rem;
    justify-content: flex-start;
    align-items: center;
    height: 1.1rem;
    color: #444444;

    .user-type {
      display: block;
      width: 1.34rem;
      height: 0.72rem;
      margin-left: 0.2rem;
    }
  }

  .rebate-item {
    height: 1.7rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    overflow: visible !important;
    .bmg {
      left: 0;
      top: -0.04rem;
      width: 1.88rem;
      height: 1.82rem;
      position: absolute;
      border-radius: 0.16rem 0 0 0.16rem;
    }

    .label {
      left: 0;
      top: -0.04rem;
      width: 1.88rem;
      height: 1.82rem;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      background-position: 0 0;
      background-size: 100%;
      background-repeat: no-repeat;
      font-size: 0.36rem;
      position: absolute;

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
    }

    .rebate-box {
      padding: 0.24rem 0 0.24rem 2.58rem;
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
          font-size: 0.26rem;
          font-family: Arial, sans-serif;
          color: #999999;
          font-weight: 500;
          border: 0.03rem solid #dbdbdb;
          width: 0.56rem;
          height: 0.56rem;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;

          &.edit-action-sub {
            border-top-left-radius: 0.06rem;
            border-bottom-left-radius: 0.06rem;
          }

          &.edit-action-add {
            border-top-right-radius: 0.06rem;
            border-bottom-right-radius: 0.06rem;
          }

          &.edit-action-sub:before {
            content: "－";
          }

          &.edit-action-add:before {
            content: "＋";
          }

          &.disabled {
            color: #EAEAEA;
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
    .more-link{
      position: relative;
      width:1rem;
      height:100%;
      line-height:1.5rem;
      span{
        position: absolute;
        right:0.15rem;
        top:0.6rem;
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
}
</style>
