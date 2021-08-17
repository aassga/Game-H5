<template>
  <view-page class="view-page" full-box>
    <title-header :title="title" slot="header"></title-header>
    <div class="title" style="margin-top: 0.2rem" slot="header-static" v-if="readonly!=='readonly'">
      <span class="label flex-1">{{title}}设置</span>
      <span class="label">统一设置</span>
      <span class="action-0 theme-color" @click="onActive()">－</span>
      <span class="action-1 theme-color" @click="onActive(true)">＋</span>
    </div>
    <div slot="content" class="content-slot">
      <van-cell-group v-if="readonly==='readonly'">
        <van-cell v-for="(v, k) in keyArr" :key="k">
          <div class="cell">
            <span class="label">{{v}}</span>
            <span class="value">{{list[k]}}%</span>
          </div>
        </van-cell>
      </van-cell-group>
      <van-cell-group v-else>
        <van-cell is-link v-for="item in list" :key="item.key" @click="activeKey=item.key">
          <div class="cell">
            <span class="label">{{item.name}}</span>
            <span class="value">{{item.value}}%</span>
          </div>
        </van-cell>
      </van-cell-group>
    </div>
    <div class="foot" slot="footer" v-if="readonly!=='readonly'">
      <van-button type="primary" block @click="onSave">保存</van-button>
    </div>

    <van-popup slot="static" v-model="show" position="bottom" get-container="body">
      <van-picker show-toolbar :item-height="40" :columns="numbers" @confirm="onNumberChange" @cancel="show=false"></van-picker>
    </van-popup>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'AgentOpenOdds',
  props: {
    type: {
      type: String,
      default: ''
    },
    readonly: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      list: [],
      activeKey: '',
      val: [],
      keyArr: {}
    }
  },
  computed: {
    title () {
      return this.$store.state.agent.refundRebate[this.type] ? this.$store.state.agent.refundRebate[this.type].name : ''
    },
    show: {
      get () {
        return !!this.activeKey
      },
      set (val) {
        this.activeKey = val ? this.activeKey : ''
      }
    },
    numbers () {
      const numbers = []
      let max = 0
      let min = 0
      if (this.activeKey) {
        max = parseFloat(this.$store.state.agent.refundRebate[this.type].list.find(game => game.key === this.activeKey).value) * 100
        if (this.personalMode !== 'no') {
          min = max - 30
        }
      }
      for (let i = max; i >= min; i -= 10) {
        const val = i / 100
        if (val >= 0) {
          numbers.push({
            text: val + '%',
            value: val
          })
        }
      }
      return numbers
    }
  },
  created () {
    if (!this.$store.state.agent.refundRebate) {
      this.$store.dispatch('agency/getRefundRebate').then(() => {
        this.$store.commit('lottery/checkPlayWay')
        if (this.readonly === 'readonly') {
          this.list = this.$store.state.agent.openAgentOdds
          if (this.list) {
            const keyArr = {}
            this.$store.state.agent.refundRebate[this.type].list.forEach(item => {
              keyArr[item.key] = item.name
            })
            this.keyArr = keyArr
          }
        } else {
          this.list = JSON.copyObj(this.$store.state.agent.refundRebateForOpen[this.type].list)
        }
      })
    } else {
      if (this.readonly === 'readonly') {
        this.list = this.$store.state.agent.openAgentOdds
        if (this.list) {
          const keyArr = {}
          this.$store.state.agent.refundRebate[this.type].list.forEach(item => {
            keyArr[item.key] = item.name
          })
          this.keyArr = keyArr
        }
      } else {
        this.list = JSON.copyObj(this.$store.state.agent.refundRebateForOpen[this.type].list)
      }
    }
  },
  methods: {
    onNumberChange (val) {
      this.list.find(item => item.key === this.activeKey).value = val.value
      this.activeKey = ''
    },
    onActive (status) {
      let min = 0
      let val, max, list
      min = 0
      list = this.list
      list.forEach(item => {
        val = parseFloat(item.value)
        max = parseFloat(this.$store.state.agent.refundRebate[this.type].list.find(game => game.key === item.key).value)
        if (this.personalMode !== 'no') {
          min = max - 0.3
        }
        if (status) {
          if (val < max) {
            val += 0.1
            item.value = Math.round(val * 100) / 100
          }
        } else {
          if (val > min && val) {
            val -= 0.1
            item.value = Math.round(val * 100) / 100
          }
        }
      })
      this.list = list
    },
    onSave () {
      this.$store.state.agent.refundRebateForOpen[this.type].list = JSON.copyObj(this.list)
      this.$store.state.agent.refundRebateForOpen = JSON.copyObj(this.$store.state.agent.refundRebateForOpen)
      this.$router.back()
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .view-page {
    .title {
      background-color: #fff;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      position: relative;
      width: 100%;
      height: 0.9rem;
      padding: 0.24rem;
      margin: 0;
      box-sizing: border-box;
      text-align: left;

      .flex-1 {
        flex: 1;
      }

      .label {
        font-size: 0.3rem;
        color: #555;
      }

      .action-0, .action-1 {
        display: block;
        width: 1rem;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        border: 1px solid hsla(0, 0%, 95%, 1);
        font-size: 0.4rem;

        &:active {
          background-color: #efefef;
        }
      }

      .action-0 {
        margin-left: 0.24rem;
        border-bottom-left-radius: 0.1rem;
        border-top-left-radius: 0.1rem;
      }

      .action-1 {
        border-left: none;
        border-bottom-right-radius: 0.1rem;
        border-top-right-radius: 0.1rem;
      }
    }

    .cell {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      position: relative;
      width: 100%;
      padding: 0.2rem 0 0.2rem 0.2rem;
      margin: 0;
      box-sizing: border-box;

      .label {
        font-size: 0.32rem;
      }

      .value {
        margin-right: 0.24rem;
        font-size: 0.345rem;
        line-height: 0.4rem;
      }
    }

    .foot {
      width: 100%;
      box-sizing: border-box;
      padding: 0.12rem 0.24rem;
      border-top: 0.02rem solid hsla(0, 0%, 95%, 1);
    }
  }
</style>
