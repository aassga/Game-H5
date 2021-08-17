<template>
  <section class="lottery-timer lottery-timer-50 theme-main-bg-5 theme-after-border-color-1">
    <div class="label">
      <p class="issue theme-color-white" v-if="result['issue']">
        {{result['issue'].toString().length>9?result['issue'].toString().substr(8):result['issue']}}期
      </p>
      <p class="issue theme-color-white" v-else>{{defaultIssue}}期</p>
    </div>
    <div class="content theme-color-white" v-show="closed">
      <span>投注截止</span><span class="time theme-color theme-color-yellow-2" style="margin-left: 0.06rem;font-size: 0.36rem">封盘</span>
    </div>
    <div class="content theme-color-white" v-show="!closed">
      <span>投注截止</span><span class="time theme-color theme-color-yellow-2">{{timeStr}}</span>
    </div>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'LotteryTimer',
  props: {
    result: {
      type: Object,
      required: true
    },
    closed: {
      type: Boolean,
      required: true
    },
    opening: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      time: NaN,
      task: null
    }
  },
  computed: {
    timeStr () {
      if (isNaN(this.time) || this.time < 0) {
        return ''
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
    defaultIssue () {
      switch (this.$route.params.id.toString()) {
        case '4':
        case '17':
          return '???'

        case '16':
          return '????'

        default:
          return '???'
      }
    }
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
  mounted () {
    // 刷新数据
    this.removeTask()

    // 设置计时任务
    this.task = window.setInterval(() => {
      if (this.time > 0) {
        this.time--
      } else if (this.time === 0) {
        this.$emit('update:closed', !this.closed)
        this.time = -1
      }
    }, 1000)
  },
  methods: {
    removeTask () {
      if (this.task) {
        window.clearInterval(this.task)
      }
    }
  },
  beforeDestroy () {
    this.removeTask()
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .lottery-timer {
    background-color: #fff;
  }
</style>
