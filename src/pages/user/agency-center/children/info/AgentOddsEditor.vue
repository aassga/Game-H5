<template>
  <view-page class="view-page" full-box>
    <title-header :title="typeObj&&typeObj.v" slot="header"></title-header>
    <div class="title" style="margin-top: 0.2rem" slot="header-static">
      <span class="label flex-1">{{typeObj&&typeObj.v}}设置</span>
      <span class="label">统一设置</span>
      <span class="action-0 theme-color" @click="onActive()">－</span>
      <span class="action-1 theme-color" @click="onActive(true)">＋</span>
    </div>
    <div class="content" slot="content" v-if="user">
      <van-cell-group>
        <van-cell is-link v-for="item in list" :key="item">
          <div class="cell" @click="activeKey=item">
            <span class="label">{{label(item)}}</span>
            <span class="value">{{modal[item]}}%</span>
          </div>
        </van-cell>
      </van-cell-group>
    </div>
    <div class="foot" slot="footer">
      <van-button :disabled="submitting" type="primary" block @click="onSubmit">提交修改</van-button>
    </div>

    <van-popup slot="static" v-model="show" position="bottom" get-container="body">
      <van-picker show-toolbar :columns="numbers" :item-height="40" @confirm="onNumberChange" @cancel="show=false"></van-picker>
    </van-popup>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'AgentOddsEditor',
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      types: [
        { k: 'LIVE', v: '视讯返水' },
        { k: 'GAME', v: '电子返水' },
        { k: 'SPORT', v: '体育返水' },
        { k: 'LOTTERY', v: '彩票返点' },
        { k: 'CHESS', v: '棋牌返水' },
        { k: 'CT_LOTTERY', v: '彩票返水' }
      ],
      typeObj: null,
      modal: null,
      list: [],
      submitting: false,
      activeKey: '',
      val: []
    }
  },
  computed: {
    numbers () {
      const numbers = []
      let max = 0
      let min = 0
      if (this.activeKey && this.type) {
        max = parseFloat(this.$store.state.agent.refundRebate[this.type].list.find(game => game.key === this.activeKey).value) * 100
        // max = 1.5 * 100
      }
      if (this.personalMode !== 'no') {
        if (max === 0) {
          min = max
        } else {
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
    },
    show: {
      get () {
        return !!this.activeKey
      },
      set (val) {
        this.activeKey = val ? this.activeKey : ''
      }
    },
    user () {
      return this.$store.state.agent.agentListSelected
    },
    refundRebate () {
      return this.$store.state.agent.refundRebate
    },
    key () {
      return this.type === 'lotterys' ? 'ct_lottery' : this.type
    }
  },
  created () {
    if (!this.refundRebate || !this.refundRebate.length) {
      this.$store.dispatch('agent/getRefundRebate').then(() => {
        this.$store.commit('lottery/checkPlayWay')
        this.typeObj = this.types.find(item => item.k === this.type.toUpperCase())
        if (!this.user || !this.typeObj) {
          this.$router.back()
          return
        }
        this.list = Object.keys(this.user).filter(item => {
          let res = !!item.includes(this.type.toUpperCase())
          if (this.type.toUpperCase() === 'LOTTERY') {
            res = res && !['CT_LOTTERY', 'VR_LOTTERY'].includes(item)
          } else if (this.type.toUpperCase() === 'CT_LOTTERY') {
            res = ['CT_LOTTERY', 'VR_LOTTERY'].includes(item)
          }
          return res && this.label(item)
        })
        this.modal = {}
        this.list.forEach(item => {
          this.modal[item] = this.user[item]
        })
      })
    } else {
      this.typeObj = this.types.find(item => item.k === this.type.toUpperCase())
      if (!this.user || !this.typeObj) {
        this.$router.back()
        return
      }
      this.list = Object.keys(this.user).filter(item => {
        let res = !!item.includes(this.type.toUpperCase())
        if (this.type.toUpperCase() === 'LOTTERY') {
          res = res && !['CT_LOTTERY', 'VR_LOTTERY'].includes(item)
        } else if (this.type.toUpperCase() === 'CT_LOTTERY') {
          res = ['CT_LOTTERY', 'VR_LOTTERY'].includes(item)
        }
        return res && this.label(item)
      })
      this.modal = {}
      this.list.forEach(item => {
        this.modal[item] = this.user[item]
      })
    }
  },
  methods: {
    onNumberChange (val) {
      this.modal[this.activeKey] = val.value
      this.activeKey = ''
    },
    onActive (status) {
      let min = 0
      let val, max
      min = 0
      const modal = {}
      this.list.forEach(item => {
        val = parseFloat(this.modal[item])
        max = parseFloat(this.$store.state.agent.refundRebate[this.type].list.find(game => game.key === item).value)
        if (this.personalMode !== 'no') {
          min = max - 0.3
        }
        if (status) {
          const target = this.refundRebate[this.type]
          if (!target) {
            return false
          }
          // max = 1.5
          if (val < max) {
            val += 0.1
            modal[item] = Math.round(val * 100) / 100
          } else {
            modal[item] = this.modal[item]
          }
        } else {
          if (val > min && val) {
            val -= 0.1
            modal[item] = Math.round(val * 100) / 100
          } else {
            modal[item] = this.modal[item]
          }
        }
      })
      this.modal = modal
    },
    label (key) {
      const item = this.refundRebate[this.key]['list'].find(item => item.key === key)
      if (item) {
        return item.name
      } else {
        return ''
      }
    },
    onSubmit () {
      if (this.submitting) {
        this.toastText('正在提交,请勿重复提交', 'top')
      } else {
        this.submitting = true
        this.$store.state.main.loadingText = '正在提交...'
        const keys = Object.keys(this.user).filter(item => Object.keys(this.refundRebate).some(r => item.includes(r.toUpperCase())))
        const modal = {}
        keys.forEach(item => {
          modal[item] = this.modal[item] || this.user[item]
        })
        this.$store.dispatch(
          'agent/lowerUpRefund',
          {
            uid: this.user.uid,
            data: modal
          }
        ).then(res => {
          if (res.code === 200) {
            this.toastText('修改成功', 'top')
            setTimeout(() => {
              this.$router.back()
            }, 1000)
          } else {
            this.toastText(res.message, 'top')
          }
          this.submitting = false
          this.$store.state.main.loadingText = ''
        }).catch(() => {
          this.submitting = false
          this.$store.state.main.loadingText = ''
        })
      }
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
