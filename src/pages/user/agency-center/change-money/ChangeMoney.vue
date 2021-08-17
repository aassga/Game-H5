<template>
  <view-page>
    <title-header slot="header" title="佣金转帐"></title-header>
    <div class="change-money content-slot" slot="content">
      <van-cell-group>
        <van-cell>
          <div class="cell-item top">
            <span>代理佣金:</span>
            <span class="red">{{userInfo['agencyInfo'].balance}}</span>
            <span>元</span>
            <a class="doc-btn theme-bg" href="javascript:void(0)" @click="$router.push('/user/money-rule')" v-if="personalMode==='mode_b'">
              <i class="icon iconfont h5-icon-message"></i><span class="text">佣金条款</span>
            </a>
          </div>
        </van-cell>
        <van-cell>
          <label class="cell-item input-row">
            <span class="label">￥</span>
            <input class="input" type="tel" :placeholder="'转帐金额'+userInfo['agencyInfo'].balance" v-model="money"/>
            <span class="all theme-color" @click="money=userInfo['agencyInfo'].balance">全部</span>
          </label>
        </van-cell>
      </van-cell-group>
      <div style="padding: 0.24rem">
        <van-button block type="primary" @click.native="onSubmit">立即转帐</van-button>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'ChangeMoney',
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  data () {
    return {
      money: '',
      submitting: false
    }
  },
  created () {
    if (!this.userInfo) {
      this.$router.replace('/admin/login')
    }
  },
  methods: {
    onSubmit () {
      if (this.submitting) {
        this.toastText('正在提交', 'top')
      } else if (!this.money) {
        this.toastText('请输入转帐金额', 'top')
      } else if (!parseFloat(this.money)) {
        this.toastText('请输入正确的金额', 'top')
      } else if (parseFloat(this.money) > parseFloat(this.userInfo['agencyInfo'].balance)) {
        this.toastText('转帐金额不能大于可用金额', 'top')
      } else if (parseFloat(this.money) < 0) {
        this.toastText('转帐金额不能小于0元', 'top')
      } else if (parseFloat(this.money) < 1) {
        this.toastText('转帐金额不能小于1元', 'top')
      } else {
        this.submitting = true
        // this.$store.state.main.loadingText = '转帐中~~'
        this.$store.dispatch('agent/changeMoney', { money: parseFloat(this.money) }).then(res => {
          if (res.code === 200) {
            this.toastText('转帐完成', 'top')
            this.money = ''
            this.$store.dispatch('user/refreshInfo').then(() => {
              this.$store.dispatch('user/refreshBalance').then().catch()
              this.$router.back()
            })
          } else {
            if (res.message.toString().includes('|')) {
              this.$store.state.main.iosAlert.content = res.message.toString().replace(/\|/g, '<br/>')
              this.$store.state.main.iosAlert.width = 6.2
              this.$store.state.main.iosAlert.show = true
              this.$store.state.main.iosAlert.showNo = false
              this.$store.state.main.iosAlert.okCallback = () => {
                this.$store.state.main.iosAlert.width = 5.4
                this.$store.state.main.iosAlert.content = ''
                this.$store.state.main.iosAlert.show = false
                this.$store.state.main.iosAlert.showNo = true
                return true
              }
            } else {
              this.toastText(res.message, 'top')
            }
          }
          this.submitting = false
        }).catch(() => {
          this.submitting = false
        })
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .change-money {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;

    .cell-item {
      padding: 0 0.3rem;
      position: relative;
      height: 1.7rem;
      width: 100%;
      text-align: left;
      overflow: hidden;
      &.top {
        height: 1rem;
        line-height: 1rem;
        font-size: 0.349rem;
        margin-left: 0.12rem;

        .doc-btn {
          position: absolute;
          display: block;
          right: 0.2rem;
          top: 0.15rem;
          font-size: 0.28rem !important;
          height: 0.7rem !important;
          color: #FFFFFF;
          border-radius: 0.1rem;
          padding: 0 0.15rem;
          box-sizing: border-box;
          line-height: 0.7rem !important;

          .text {
            margin-left: 0.04rem;
            font-size: 0.32rem;
          }

          .iconfont {
            font-size: 0.32rem;
          }

          /deep/ .van-icon {
            line-height: 0.32rem !important;
            height: 0.32rem !important;
          }

          /deep/ .van-icon-warning-o {
            font-weight: bold;
          }

          /deep/ .van-icon:before {
            position: relative;
            top: 0.05rem;
            transform: rotateZ(180deg);
            font-size: 0.36rem;

          }
        }
      }
    }

    .label {
      font-size: 0.7rem;
      color: #000;
      line-height: 1.7rem;
      position: absolute;
      left: 0.3rem;
      top: 0;
    }

    .input {
      font-size: 0.7rem;
      height: 1rem;
      line-height: 1rem;
      min-width: 0;
      max-width: 5rem;
      position: absolute;
      left: 1.2rem;
      top: 0.35rem;
      width: 200%;
      &::-webkit-input-placeholder {
        transform: scale(0.66) translateY(0.06rem);
        transform-origin: left;
        overflow: visible !important;
      }
    }

    .input-row {
      display: block;
      padding: 0.3rem;
      height: 1.7rem;
    }

    .red {
      color: #ff2200;
    }

    .all {
      font-size: 0.35rem;
      white-space: nowrap;
      line-height: 1.7rem;
      position: absolute;
      right: 0.3rem;
      top: 0;
    }
  }
</style>
