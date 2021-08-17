<template>
    <div class="hall-timer">
      <span v-show="closed">已封盘</span>
      <span v-show="!closed">{{timeStr}}</span>
    </div>
 
</template>

<script>

export default {
  name: "HallTime",
  props:['id','result'],
  data() {
    return {
      show: false,
      time: NaN,
      task: null,
      errTask :null,
      closed:false
    };
  },
  computed: {
    timeStr () {
      if (isNaN(this.time) || this.time < 0) {
        return '--'
      } else if (this.time) {
        let house = Math.floor(this.time / 60 / 60)
        let minute = Math.floor((this.time % (60 * 60)) / 60)
        let second = this.time % 60

        minute = minute > 0 ? minute : 0
        second = second > 0 ? second : 0

        if (house) {
          return this.number2(house) +
              ':' +
              this.number2(minute) +
              ':' +
              this.number2(second)
        } else {
          return this.number2(minute) +
              ':' +
              this.number2(second)
        }
      } else {
        return '00:00'
      }
    },
    
  },
  watch: {
    result:{
      handler:function(val,old){
        if (this.result) {
          if (this.result['djs_next_kaipan'] > 0) {
            this.time = this.result['djs_next_kaipan']
            this.closed = true
          } else if (this.result['djs_fengpan'] > 0) {
            this.time = this.result['djs_fengpan']
            this.closed = false
          } else {
            this.closed = true
            this.removeTask()
          }
           this.$emit('update:closed', this.closed)
        }
      },
      immediate:true
    }
  },
  created() {
    // this.getTimeList(this.id);
  },
mounted () {
    // 刷新数据
    this.removeTask()
    // 设置计时任务
    this.task = window.setInterval(() => {
      if (this.time > 0) {
        this.time--
      } else if (this.time === 0) {
        this.closed = true;
        this.$emit('update:closed', this.closed)
        this.time = -1
      }
    }, 1000)
  },
  methods: {
    removeTask () {
      if (this.task) {
        window.clearInterval(this.task)
      }
    },
  },
  beforeDestroy () {
    this.removeTask()
  }
};
</script>

<style lang="less" scoped>
    .hall-timer {
      font-size: 0.24rem;
      font-family: PingFang SC;
      font-weight: 400;
      color:#fff;
      margin-bottom: 0.05rem;
    }
</style>
