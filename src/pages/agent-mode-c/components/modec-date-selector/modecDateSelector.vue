<template>
  <van-popup v-model="show" :style="positionStyle" position="bottom"  get-container="body" :overlay="true" :lazy-render="false">
    <div class="container">
      <div class="tit">
        {{this.dateYear}}年{{this.dateMouth}}月
        <span class="close" @click="show = false">
          <img src="@src/assets/img/agent-center-modec/index/close-agent-des.png" />
        </span>
      </div>
      <div class="cont">
        <div class="date-title">
          <span>一</span>
          <span>二</span>
          <span>三</span>
          <span>四</span>
          <span>五</span>
          <span>六</span>
          <span>日</span>
        </div>
        <div class="days">
          <div class="day" v-for="(item,i) in days" :key="i" :class="[{isThisMonth: item.isThisMonth},{selectDay: item.isThisMonth && selectDay === item.dayNum}]" @click="selectDayFunc(item)">
            {{item.dayNum}}
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script type="text/javascript">
export default {
  name: "AgentDescription",
  props: {
  },
  computed: {
    positionStyle(){
      //解决安卓小米position：fixed问题导致按钮错位问题
      if(this.$mobileDevice.isAndroid 
        && this.$mobileDevice.browserName === 'MIUI Browser'){
        return {
          position:'absolute'
        }
      }else{
        return {
          position:'fixed'
        }
      }
    },
  },
  data() {
    return {
      show: false,
      days: [],
      dateYear: 0,
      dateMouth: 0,
      dateDay: 0,
      isCurMouth: false,
      selectDay: 0,
    };
  },
  created() {
    let date = this.$store.state.agentModec.PerformanceDate;
    if(JSON.stringify(date) !== '{}') {
      this.dateYear = date.end.split('-')[0]
      this.dateMouth = date.end.split('-')[1]
      this.dateDay = Number(date.end.split('-')[2])
      this.isCurMouth = date.name === '本月'
      this.getMonthDaysArray(this.dateYear, this.dateMouth,'')
    }
  },
  methods: {
    // 返回当前月天数
    getWeekday(year, month, day) {
      let num = new Date(year, month - 1, day).getDay() === 0 ? 7 : new Date(year, month - 1, day).getDay()
      return num
    },
    getMonthDays(year, month) {
      return new Date(year, month, 0).getDate();
    },
    getweeksInMonth(year, month) {
      let days = getMonthDays(year, month);
      let FirstDayWeekday = getWeekday(year, month, 1);
      return Math.ceil((days + FirstDayWeekday) / 7);
    },
    getMonthDaysArray(year, month, day) {
      if (typeof day === "undefined" && year === YEAR && month === MONTH)
        day = DAY;
      let dayArrays = [];
      let days = this.getMonthDays(year, month),
        preDays = this.getMonthDays(year, month - 1);
      let thisMonthFirstDayInWeek = this.getWeekday(year, month, 1),
        thisMonthLastDayInWeek = this.getWeekday(year, month, days);
      //上月在当月日历面板中的排列
      for (let i = 1; i < thisMonthFirstDayInWeek; i++) {
        dayArrays.push({
          dayNum: preDays - thisMonthFirstDayInWeek + i + 1
        });
      }
      //当月日历面板中的排列
      for (let i = 1; i <= days; i++) {
        let obj = {
          dayNum: i,
        }
        if(i <= this.dateDay) {
          obj['isThisMonth'] = true
        }
        dayArrays.push(obj);
      }
      //下月在当月日历面板中的排列
      for (let i = 1; i <= 7 - thisMonthLastDayInWeek; i++) {
        dayArrays.push({
          dayNum: i
        });
      }
      this.days = dayArrays
    },
    selectDayFunc(item){
      if(item.isThisMonth && item.dayNum !== this.selectDay) {
        this.selectDay = item.dayNum
        let date = `${this.dateYear}-${this.dateMouth}-${this.selectDay < 10 ? '0' + this.selectDay : this.selectDay}`
        this.$emit("callFather",date)
        this.show = false
      } 
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
.container {
  width: 7.18rem;
  margin: 0 auto;
  background-color: #fff;
  font-family: PingFang-SC-Medium, PingFang-SC;
  border-radius: 0.1rem 0.1rem 0 0;
  .tit {
    position: relative;
    width: 100%;
    height: 0.98rem;
    line-height: 0.98rem;
    border-bottom: 0.01rem solid #e7e7e7;
    color: #444444;
    font-size: 0.32rem;
    img {
      position: absolute;
      top: 50%;
      margin-top: -0.2rem;
      right: 0.16rem;
      width: 0.41rem;
      height: 0.41rem;
    }
  }
  .cont {
    font-size: 0.32rem;
    color: #888;
    margin-top: 0.24rem;
    padding-bottom: .18rem;
    .date-title {
      width: 100%;
      margin-bottom: .18rem;
      span {
        display: inline-block;
        width: 14.285%;
      }
    }
    .days {
      width: 100%;
      text-align: left;
      .day {
        color: #BBBBBB;
        text-align: center;
        display: inline-block;
        width: 14.285%;
        height: .72rem;
        line-height: .72rem;
        &.isThisMonth {
          color: #444;
        }
        &.selectDay {
          color: #4D8FFA;
        }
      }
    }
  }
}
</style>