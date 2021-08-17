<template>
  <view-page class="agent-open-edit theme-header-bg" ref="view-page" full-box>
    <title-header :title="editRebate['type_cn']"  class="theme-main-bg theme-header-bottom" slot="header"></title-header>

    <div slot="header-static" class="theme-header-bg" style="overflow:hidden">
      <p class="info" v-show="personalMode==='mode_a'">
        <span class="van-icon van-icon-warning-o"></span>
        <span>下级抽成最小为0，不获得返佣。最大不超过0.3%</span>
      </p>

      <div class="edit-top theme-agent-rebate theme-yellow-bg-2">
        <div class="bmg">
          <span class="label theme-color-black">{{editRebate['type_cn']}}</span>
          <p class="info-row">
            <span class="theme-color-black">我的:</span>
            <span class="value theme-color-red">{{selfMax.val}}%</span>
            <span class="span"></span>
            <span class="theme-color-black">下级:</span>
            <span class="value theme-color-red">{{(getFloatOne((selfMax.val*10-(maxDiff.subValue||0)*10)/10)==0?'0.0':getFloatOne((selfMax.val*10-(maxDiff.subValue||0)*10)/10))}}%</span>
          </p>
          <p class="edit-row">
            <span class="edit-label theme-color-black">整体提成</span>
            <span class="edit-action iconfont h5-icon-icon-subtract theme-color-black theme-border-color-4" :class="{maxdisabled:!maxDiff['subValue']||maxDiff['subValue']<=0}" @click="onSub()"></span>
            <span class="edit-value theme-color-black theme-border-color-4" @click="onSelect">{{getFloatOne(maxDiff.subValue) || '0'}}</span>
            <span class="edit-action iconfont h5-icon-icon-plus theme-color-black theme-border-color-4" v-if="personalMode!=='mode_a'" :class="{maxdisabled:maxDiff['subValue']&&(maxDiff['subValue']>=parseFloat(selfMax.val))}" @click="onAdd()"></span>
            <span class="edit-action iconfont h5-icon-icon-plus theme-color-black theme-border-color-4" v-else :class="{maxdisabled:maxDiff['subValue']&&(maxDiff['subValue']>=parseFloat(this.editMax))}" @click="onAdd()"></span>
          </p>
        </div>
        <div class="bor-bot theme-bg theme-yellow-bg-2"></div>
        <div class="bor-bot theme-bg theme-yellow-bg-2"></div>
      </div>
    </div>

    <ul slot="content" class="edit">
      <li class="view-box rebate-item theme-main-bg-5" v-for="(item, i) in editRebate.list" :key="i">
        <span class="label theme-agent-rebate theme-yellow-bg-2 theme-color-black">{{item['platform_cn']}}</span>
        <p class="info-row">
          <span class="theme-color-white">我的:</span>
          <span class="value">{{$store.state.agency.refundRebate[code].list[i].val}}%</span>
          <span class="span"></span>
          <span class="theme-color-white">下级:</span>
          <span class="value">{{item.val==0?'0.0':item.val||'0.0'}}%</span>
        </p>
        <p class="edit-row">
          <span class="edit-label theme-color-white">提成</span>
          <span class="edit-action iconfont h5-icon-icon-subtract theme-color-yellow theme-border-color-3" @click="onSubItem(i)"
                :class="{disabled:!item['subValue']||item['subValue']<=0}"></span>

          <span class="edit-value theme-color-white theme-border-color-3" @click="onSelect(i)" >{{item['subValue']|| '0'}}</span>

          <span class="edit-action iconfont h5-icon-icon-plus theme-color-yellow theme-border-color-3" @click="onAddItem(i)"
                :class="{disabled:item['subValue']&&(item['subValue']>=parseFloat(selfRebate.list[i].val) || (item['subValue']>=parseFloat(editMax) && personalMode=='mode_a'))}"></span>
        </p>
      </li>
    </ul>

    <button slot="footer" class="btn-user-link theme-color theme-gradient-bg-3 theme-color-yellow" style="width: 100%;border-radius: 0" @click="onSave">
      保存
    </button>

    <div slot="static">
      <van-popup v-model="showSelector" position="bottom" get-container="body">
        <van-picker :class="{'black-van-picker':$config.blackTheme || $config.newQP,'blush-van-picker':$config.blush}" show-toolbar v-model="showSelector" :item-height="40" :columns="getValList().map(n => getFloatOne(n))" value-key="name"
                    @confirm="onRebateSelect" @cancel="showSelector=false" :default-index="getValList().indexOf(editVal)"></van-picker>
      </van-popup>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'Edit',
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      editRebate: {},
      editMax: 0.3,
      dates: [],
      showSelector: false,
      editIndex: NaN,
      editVal: 0,
    }
  },
  computed: {
    selfMax () {
      let max = 0
      let index = 0
      this.$store.state.agency.refundRebate[this.code].list.forEach((item, i) => {
        const v = parseFloat(item.val.toString())
        if (v > max) {
          max = v
          index = i
        }
      })
      return this.$store.state.agency.refundRebate[this.code].list[index]
    },
    lowerMax () {
      let max = 0
      let index = 0
      this.editRebate.list.forEach((item, i) => {
        const v = parseFloat(item.val.toString())
        if (v > max) {
          max = v
          index = i
        }
      })
      return this.editRebate.list[index]
    },
    maxDiff () {
      let index = 0
      let val = 0
      this.editRebate.list.forEach((item, i) => {
        const v = parseFloat(item.subValue || 0)
        if (v > val) {
          val = v
          index = i
        }
      })
      return this.editRebate.list[index]
    },
    selfRebate () {
      return this.$store.state.agency.refundRebate[this.code]
    }
  },
  created () {
    this.$store.state.agency.editing = true
    this.editRebate = JSON.copyObj(this.$store.state.agency.refundRebateForOpen[this.code])

    const dates = [0]
    for (let i = 0; i <= this.editMax; i += 0.1) {
      dates.push(Math.round(i * 10 + 1) / 10)
    }
    this.dates = dates
  },
  methods: {
    getValList () {
      if (isNaN(this.editIndex)){
        let max;
        const dates = [0]
        if(this.personalMode === 'mode_a'){   
          if(this.selfMax.val < 0.3){
            //当模式为A，并且当代理的小0.3的时候，只能设置自身
            max = this.getFloatOne(this.selfMax.val || 0)
          }else{
            max = this.getFloatOne(this.editMax || 0)
          }
        }else{
          //max = this.getFloatOne(this.editRebate.max_rate || 0)
          //no模式调整
          max = this.getFloatOne(this.selfMax.val || 0)
        }
        for (let i = 1; i <= max*10; i += 1) {
          dates.push(Math.abs(i) / 10)
        }
        return dates
      }
      else if (this.personalMode === 'mode_a'){
        let maxValue;
        const dates = [0]
        this.editMax > this.selfRebate.list[this.editIndex].val?maxValue = this.selfRebate.list[this.editIndex].val:maxValue = this.editMax;
        const max = this.getFloatOne(maxValue || 0);
        for (let i = 1; i <= max*10; i += 1) {
          dates.push(Math.round(i) / 10)
        }
        return dates
      }
      else {
        const dates = [0];
        const max = parseFloat(this.selfRebate.list[this.editIndex].val) || 0;
        for (let i = 1; i <= max*10; i += 1) {
          dates.push(Math.abs(i) / 10)
        }
        return dates
      }
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
    onSave () {
      this.$store.state.agency.refundRebateForOpen[this.code] = this.editRebate
      this.$store.state.agency.editing = true
      this.$router.back()
    },
    onSelect (index) {
      setTimeout(() => {
        if(!isNaN(index)) {
          this.editIndex = index;
          this.editVal = this.editRebate.list[this.editIndex].subValue || 0
        }else{
          this.editIndex = NaN
        }
        this.showSelector = true
      }, 100)
    },
    onRebateSelect (item) {
      if (!isNaN(this.editIndex)) {
        this.editRebate.list[this.editIndex]['subValue'] =parseFloat(item)==0?item:(item*1).toFixed(1)

        const baseValue = parseFloat(this.$store.state.agency.refundRebate[this.code].list[this.editIndex].val)
        this.editRebate.list[this.editIndex].val = this.getFloatOne(Math.round(baseValue * 10 - this.editRebate.list[this.editIndex]['subValue'] * 10) / 10)
        this.$set(this.editRebate.list, this.editIndex, this.editRebate.list[this.editIndex])
      }
      else{
        let val = parseFloat(item)
        const baseVal = this.getMaxDiffItem(this.editRebate.list )["subValue"] || 0;
        if (val > baseVal) {
          this.onAdd(val - baseVal);
        } else if (val < baseVal) {
          if(val < this.editMax){
             this.onSub(baseVal - val,val);
          }else{
             this.onSub(baseVal - val);
          }
        }
      }
      this.showSelector = false
      this.editIndex = NaN
    },
    getFloatOne (val) {
      val = parseFloat(val)
      if (!val) return '0'
      else if (!val.toString().includes('.')) return val + '.0'
      else return val.toString()
    },
    onAddItem (index) {
      if (!this.editRebate.list[index]['subValue']) this.editRebate.list[index]['subValue'] = 0

      let value = Math.round(this.editRebate.list[index]['subValue'] * 10 + 1) / 10
      let editMax
      if (this.personalMode === 'mode_a'){ this.editMax >this.selfRebate.list[index].val?editMax=this.selfRebate.list[index].val:editMax=this.editMax}
      else editMax = parseFloat(this.selfRebate.list[index].val)

      if (value > editMax) value = editMax
      this.editRebate.list[index]['subValue'] = parseFloat(value)==0?0:(value*1).toFixed(1)

      const baseValue = parseFloat(this.$store.state.agency.refundRebate[this.code].list[index].val)
      this.editRebate.list[index].val = this.getFloatOne(Math.round(baseValue * 10 - this.editRebate.list[index]['subValue'] * 10) / 10)

      this.$set(this.editRebate.list, index, this.editRebate.list[index])
    },
    onSubItem (index) {
      if (!this.editRebate.list[index]['subValue']) this.editRebate.list[index]['subValue'] = 0
      let value = Math.round(this.editRebate.list[index]['subValue'] * 10 - 1) / 10
      if (value < 0) value = 0
      this.editRebate.list[index]['subValue'] = parseFloat(value)==0?0:(value*1).toFixed(1)
      const baseValue = parseFloat(this.$store.state.agency.refundRebate[this.code].list[index].val)
      this.editRebate.list[index].val = this.getFloatOne(Math.round(baseValue * 10 - this.editRebate.list[index]['subValue'] * 10) / 10)

      this.$set(this.editRebate.list, index, this.editRebate.list[index])
    },
    onAdd (val) {
      val = val || 0.1
      this.editRebate.list.forEach((item, i) => {
        const baseValue = parseFloat(this.$store.state.agency.refundRebate[this.code].list[i].val)
        if (!item['subValue']) item['subValue'] = 0
        let value = Math.round(item['subValue'] * 10 + val * 10) / 10
        let editMax
        if (this.personalMode === 'mode_a'){
          if(item.platform_en == "CT_LOTTERY") editMax = parseFloat(this.selfRebate.list[i].val);
          else editMax = this.editMax
        }
        else {
          editMax = parseFloat((this.selfRebate.list[i].val))
        }
        if (value > editMax) value = editMax
        else if(value > baseValue) value = baseValue
        item['subValue'] = parseFloat(value)==0?0:(value*1).toFixed(1)
        item.val = this.getFloatOne(Math.round(baseValue * 10 - item['subValue'] * 10) / 10)
        this.$set(this.editRebate.list, i, this.editRebate.list[i])
      })
    },
    onSub (val) {
      let value
      val = val || 0.1
      this.editRebate.list.forEach((item, i) => {
        let getMaxDiffItem = this.maxDiff.subValue;
        let editMax = parseFloat(this.selfRebate.list[i].val);
        if (!item['subValue']) item['subValue'] = 0;
        if(item.platform_en == "CT_LOTTERY"){getMaxDiffItem>editMax?value = editMax:value = Math.round(item['subValue'] * 10 - val * 10) / 10 }
        else value = Math.round(item['subValue'] * 10 - val * 10) / 10
        if (value < 0) value = 0
        item['subValue'] =  parseFloat(value)==0?0:(value*1).toFixed(1)
        const baseValue = parseFloat(this.$store.state.agency.refundRebate[this.code].list[i].val)
        item.val = this.getFloatOne(Math.round(baseValue * 10 - item['subValue'] * 10) / 10)
        this.$set(this.editRebate.list, i, this.editRebate.list[i])
      })
    }
  }
}
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
  .agent-open-edit {

    .info {
      margin: 0.24rem auto 0 auto;
      width: 7.18rem;
      height: 0.72rem;
      border-radius: 0.1rem;
      background-color: #FFF0E6;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #FF7C5B;
      font-size: 0.28rem;
      padding: 0.16rem;
      box-sizing: border-box;
      .van-icon {
        font-size: 0.36rem;
        margin-right: 0.06rem;
      }
    }
    .edit-top {
      width: 7.18rem;
      height: 1.8rem;
      margin: 0.24rem auto 0 auto;
      border-radius:0.1rem;
      .bmg{
        width: 100%;
        height: 100%;
        background: url("../../../assets/img/agent-center-new/backwaterbg.png") 0 0 no-repeat;
        background-size: 100% 100%;
        color: #FFFFff;
        font-size: 0.3rem;
        padding: 0.24rem 0 0.48rem 0;
        position: relative;
        border-radius:0.1rem;
      }
      .label {
        font-size: 0.32rem;
        font-weight: 500;
        position: absolute;
        left: 0;
        top: 0;
        width: 2.2rem;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .info-row {
        padding-left: 3rem;
        text-align: left;
        margin-bottom: 0.24rem;

        .span {
          display: inline-block;
          width: 0.4rem;
        }
      }

      .edit-row {
        padding-left: 2.375rem;
        height: 0.56rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .edit-label {
          flex-shrink: 0;
          display: inline-block;
          text-align: right;
          white-space: nowrap;
          margin-right: 0.2rem;
        }

        .edit-action {
          font-size: 0.3rem;
          font-family: Arial, sans-serif;
          color: #ffffff;
          font-weight: 500;
          border: 0.02rem solid #ffffff;
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
          &.maxdisabled{
            color:rgba(255,255,255,.4)
          }
          &.disabled {
            color: #EAEAEA;
          }
        }

        .edit-value {
          border-top: 0.02rem solid #ffffff;
          border-bottom: 0.02rem solid #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          height: 0.56rem;
          width: 1.3rem;
        }
      }
      .bor-bot{
        position: absolute;
        bottom: -0.1rem;
        height: 0.1rem;
        width: 7rem;
        left: 50%;
        margin-left: -3.5rem;
        border-radius: 0 0 1rem 1rem;
        opacity: 0.3;
      }
      .bor-bot:last-of-type{
        position: absolute;
        bottom: -0.2rem;
        height: 0.1rem;
        width: 6.7rem;
        left: 45%;
        margin-left: -3rem;
        border-radius: 0 0 1rem 1rem;
        opacity: 0.1;
      }
    }

    .btn-user-link {
      font-weight: 700;
      width: 7.18rem;
      height: 0.96rem;
      border-radius: 0.1rem;
      background-color: #FFFFFF;
      color: #2C93FF;
      font-size: 0.38rem;
      // display: flex;
      display: inline-block;
      text-align: center;
      justify-content: center;
      // align-items: center;
      margin: 0 auto;
      box-shadow: 0 -0.06rem 0.05rem 0 rgba(0,0,0,0.03);
    }

    .rebate-item {
      height: 1.7rem;
      color: #444444;
      font-size: 0.3rem;
      overflow: visible;
      margin: 0 auto 0.32rem auto;
      padding: 0.24rem 0 0.24rem 3rem;
      text-align: left;
      &:first-of-type{
        margin-top: 0.28rem;
      }
      &:last-child {
        margin-bottom: 0;
      }

      .label {
        position: absolute;
        left: 0;
        top: -0.04rem;
        height: 1.78rem;
        width: 2.2rem;
        box-shadow: 0.02rem 0.02rem 0.02rem 0 rgba(12, 62, 120, 0.13), 0 0.02rem 0.02rem 0 rgba(101, 153, 255, 0.25);
        border-radius: 0.16rem 0 0 0.16rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FFFFff;
        font-size: 0.32rem;
        font-weight: bold;
      }

      .info-row {
        line-height: 0.42rem;
        margin-bottom: 0.24rem;

        .span {
          display: inline-block;
          width: 0.4rem;
        }
        .value {
          color: #E71414;
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
          color: #999999;
          font-weight: 500;
          border: 0.02rem solid #dbdbdb;
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
            color: #EAEAEA;
          }
        }

        .edit-value {
          border-top: 0.02rem solid #dbdbdb;
          border-bottom: 0.02rem solid #dbdbdb;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          height: 0.56rem;
          width: 1.3rem;
        }
      }
    }

    .edit-footer {
      padding: 0.24rem 0.16rem;

      .btn-save {
        color: #FFFFff;
        background-color: #2C93FF;
        font-size: 0.38rem;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0.1rem;
        width: 100%;
        height: 0.96rem;
      }
    }
    .edit{padding-bottom: 0.8rem;}
  }
</style>
