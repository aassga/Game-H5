<template>
  <ul class="lottery-code-selector" v-if="type==='pcdd'">
    <li class="lottery-code-panel">
      <p class="lottery-code-panel-title theme-header-bg theme-color-white">{{play.small||play.big}}</p>
      <ul class="lottery-code-panel-body theme-main-bg-5">
        <li class="lottery-code-item theme-color-active"
            :class="{active:code.includes(codeItem),'lottery-code-circle lottery-code-circle-big':!isNaN(parseInt(codeItem.code))}"
            v-for="(codeItem, codeIndex) in play.code" :key="'code-'+codeIndex" @click="onItemClick(codeItem, codeIndex)">
          <p class="lottery-code-item-name theme-bg-active theme-border-active theme-gradient-bg-2 theme-border-1px theme-color-white" :class="{'active theme-border-yellow':code.includes(codeItem)}">{{codeItem[valKey]}}</p>
          <p class="lottery-code-item-odds theme-color-active theme-color-gray-2" :class="{'active theme-color-yellow-2':code.includes(codeItem)}">{{codeItem.odds}}</p>
        </li>
      </ul>
    </li>
  </ul>
  <ul class="lottery-code-selector" v-else-if="isBallOnly">
    <li class="lottery-code-panel">
      <p class="lottery-code-panel-title theme-header-bg theme-color-white">{{play.big}}</p>
      <ul class="lottery-code-panel-body theme-main-bg-5">
        <li class="lottery-code-item lottery-code-circle theme-color-active" @click="onItemClick(codeItem, codeIndex)"
            :class="{active:code.includes(codeItem),'lottery-code-circle-big':!!play.items[0].code.find(c => c.code.toString().length > 2)}"
            v-for="(codeItem, codeIndex) in play.items[0].code.filter(c => !isNaN(parseInt(c.code)))" :key="'num-'+codeIndex">
          <p class="lottery-code-item-name theme-bg-active theme-border-active theme-gradient-bg-2 theme-border-1px theme-color-white cp-theme-border-1px" :class="{'active theme-border-yellow':code.includes(codeItem)}">{{codeItem[valKey]}}</p>
          <p class="lottery-code-item-odds theme-color-active theme-color-gray-2" :class="{'active theme-color-yellow-2':code.includes(codeItem)}">{{codeItem.odds}}</p>
        </li>
      </ul>
    </li>
    <li class="lottery-code-panel" v-if="play.items[0].code.find(c => isNaN(parseInt(c.code)))">
      <p class="lottery-code-panel-title theme-header-bg theme-color-white">两面</p>
      <ul class="lottery-code-panel-body theme-main-bg-5">
        <li class="lottery-code-item theme-color-active" :class="{active:code.includes(codeItem)}"
            v-for="(codeItem, codeIndex) in play.items[0].code.filter(c => isNaN(parseInt(c.code)))" :key="'lm-'+codeIndex"
            @click="onItemClick(codeItem, codeIndex)">
          <p class="lottery-code-item-name theme-bg-active theme-border-active theme-gradient-bg-2 theme-border-1px theme-color-white cp-theme-border-1px" :class="{'active theme-border-yellow':code.includes(codeItem)}">{{codeItem[valKey]}}</p>
          <p class="lottery-code-item-odds theme-color-active theme-color-gray-2" :class="{'active theme-color-yellow-2':code.includes(codeItem)}">{{codeItem.odds}}</p>
        </li>
      </ul>
    </li>
  </ul>
  <van-tabs v-model="tabIndex" v-else-if="play.big === '二字定位'" class="lottery-code-selector" animated>
    <van-tab :title="small.small" v-for="(small, i) in play.items" :key="i" class="lottery-code-panel">
      <p class="lottery-code-panel-title theme-header-bg theme-color-white">{{small.small[0]}}</p>
      <ul class="lottery-code-panel-body theme-main-bg-5">
        <li class="lottery-code-item lottery-code-circle theme-color-active" @click="onItemClick(codeItem, codeIndex)"
            :class="{active:code.includes(codeItem),'lottery-code-circle-big':!!play.items[0].code.find(c => c.code.toString().length > 2)}"
            v-for="(codeItem, codeIndex) in play.items[0].code.filter((c, i) => i < 10)" :key="'num-'+codeIndex">
          <p class="lottery-code-item-name theme-bg-active theme-border-active theme-gradient-bg-2 theme-border-1px theme-color-white" :class="{'active theme-border-yellow':code.includes(codeItem)}">{{codeItem[valKey]}}</p>
          <p class="lottery-code-item-odds theme-color-active theme-color-gray-2" :class="{'active theme-color-yellow-2':code.includes(codeItem)}">{{codeItem.odds}}</p>
        </li>
      </ul>
      <p class="lottery-code-panel-title theme-header-bg theme-color-white">{{small.small[1]}}</p>
      <ul class="lottery-code-panel-body theme-main-bg-5">
        <li class="lottery-code-item lottery-code-circle theme-color-active" @click="onItemClick(codeItem, codeIndex)"
            :class="{active:code.includes(codeItem),'lottery-code-circle-big':!!play.items[0].code.find(c => c.code.toString().length > 2)}"
            v-for="(codeItem, codeIndex) in play.items[0].code.filter((c, i) => i > 9)" :key="'num-'+codeIndex">
          <p class="lottery-code-item-name theme-bg-active theme-border-active theme-gradient-bg-2 theme-border-1px theme-color-white" :class="{'active theme-border-yellow':code.includes(codeItem)}">{{codeItem[valKey]}}</p>
          <p class="lottery-code-item-odds theme-color-active theme-color-gray-2" :class="{'active theme-color-yellow-2':code.includes(codeItem)}">{{codeItem.odds}}</p>
        </li>
      </ul>
    </van-tab>
  </van-tabs>
  <ul class="lottery-code-selector" v-else>
    <li class="lottery-code-panel" v-if="play.big==='快捷'">
      <p class="lottery-code-panel-title theme-header-bg theme-color-white">{{$route.params.series.toString() === '10008' ? '位置' : '球号'}}</p>
      <ul class="lottery-code-panel-body theme-main-bg-5">
        <li class="lottery-code-item lottery-code-ball theme-color-active" :class="{active:ball.includes(ballItem)}"
            :style="{width:(100/Math.ceil(ballList.length > 5 ? ballList.length / 2 : ballList.length))+'%'}"
            v-for="(ballItem, ballIndex) in ballList" :key="ballIndex" @click="onBallClick(ballItem, ballIndex)">
          <p class="lottery-code-item-name theme-bg-active theme-border-active theme-gradient-bg-2 theme-border-1px theme-color-white cp-theme-border-1px" :class="{'active theme-color-yellow-2 theme-border-yellow':ball.includes(ballItem)}">{{ballItem}}</p>
        </li>
      </ul>
    </li>
    <li class="lottery-code-panel" v-for="(small, smallIndex) in play.items" :key="smallIndex">
      <p class="lottery-code-panel-title theme-header-bg theme-color-white">{{small.small||play.big}}</p>
      <ul class="lottery-code-panel-body theme-main-bg-5">
        <li class="lottery-code-item theme-color-active" v-for="(codeItem, codeIndex) in small.code" :key="'code-'+codeIndex"
            @click="onItemClick(codeItem, codeIndex)" :class="{
            active:code.includes(codeItem),
            'lottery-code-circle':!isNaN(parseInt(codeItem.code)),
            'lottery-code-circle-big':!!small.code.find(c => c.code.toString().length > 2),
            'lottery-code-circle-big-small':codeItem[valKey].toString().length > 3,
            'lottery-code-item-3':!!small.code.find(c => isNaN(c[valKey])&&!c[valKey].includes('~')&&c[valKey].toString().length > 3)
            }">
          <p class="lottery-code-item-name theme-bg-active theme-border-active theme-gradient-bg-2 theme-border-1px theme-color-white cp-theme-border-1px" :class="{'active theme-border-yellow':code.includes(codeItem)}">{{codeItem[valKey]}}</p>
          <p class="lottery-code-item-odds theme-color-active theme-color-gray-2" :class="{'active theme-color-yellow-2':code.includes(codeItem)}">{{codeItem.odds}}</p>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script type="text/javascript">
import '../../../../style/lottery/lottery.less'

export default {
  name: 'LotteryCodeSelector',
  props: {
    code: {
      type: Array,
      required: true
    },
    play: {
      type: Object,
      required: true
    },
    ball: {
      type: Array,
      required: true
    },
    ballList: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      default: ''
    },
    valKey: {
      type: String,
      default: 'name'
    }
  },
  computed: {
    isBallOnly () {
      return (['冠军', '亚军'].includes(this.play.big) || /^第[\S]([名球])$/.test(this.play.big)) && this.$route.params.series.toString() !== '10012'
    }
  },
  data () {
    return {
      tabIndex: 0
    }
  },
  watch: {
    code (newval) {
      // this.$emit('update:code', this.code)
      // this.$emit('update:ball', [])
    },
    tabIndex () {
      this.$emit('update:code', [])
      this.$emit('update:ball', [])
    },
    play () {
      this.$emit('update:code', [])
      this.$emit('update:ball', [])
    }
  },
  created () {
    this.$emit('update:code', [])
    this.$emit('update:ball', [])
  },
  methods: {
    onItemClick (code, i) {
      const index = this.code.indexOf(code)
      if (index > -1) {
        this.code.splice(index, 1)
      } else if (this.type === 'pcdd') {
        if (this.play.small === '特码包三') {
          if (this.code.length < 3) {
            this.code.push(code)
          } else this.toastText('特码包三最多选择三个号码', 'top')
        } else {
          this.code.push(code)
        }
      } else if (this.play.big === '二字定位') {
        const old = this.code.find(c => c.ball === code.ball)
        if (old) {
          this.code.splice(this.code.indexOf(old), 1, code)
        } else {
          this.code.push(code)
        }
      } else if (this.play.big === '三字定位') {
        const old = this.code.find(c => c.ball === code.ball)
        if (old) {
          this.code.splice(this.code.indexOf(old), 1, code)
        } else {
          this.code.push(code)
        }
      } else {
        this.code.push(code)
      }
    },
    /**
       * 球号点击（快捷玩法）
       * @param ball
       */
    onBallClick (ball) {
      const index = this.ball.indexOf(ball)
      if (index > -1) {
        this.ball.splice(index, 1)
      } else {
        this.ball.push(ball)
      }
    }
  }
}
</script>
