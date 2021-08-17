<template>
  <div :class="['editor','bg',{'newqp-editor' : $config.newQP || $config.blackTheme || $config.blush}]">
    <van-cell-group class="theme-main-bg theme-after-border-nocolor theme-border-bottom-1">
      <van-field v-model="wechat" type="text" placeholder="" clearable class="theme-main-bg"></van-field>
    </van-cell-group>
    <p class="desc theme-color-white">请填写您的微信帐号</p>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'WechatEditor',
  props: {
    save: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    save (val) {
      if (val) {
        this.onSave()
        this.$emit('update:save', false)
      }
    }
  },
  data () {
    return {
      wechat: ''
    }
  },
  mounted () {
    this.wechat = this.$store.state.user.userInfo.wechat !== '' ? this.$store.state.user.userInfo.wechat : '-'
    console.log('this.email',this.wechat) //TODO Email
    if (this.wechat) {
      this.$emit('on-title-change', '修改微信')
    } else {
      this.$emit('on-title-change', '设置微信')
    }
  },
  methods: {
    onSave () {
      if (!this.wechat) {
        this.toastText('请输入微信号', 'top')
      } else if (!/^[0-9a-zA-Z_-]([-_a-zA-Z0-9~!@#$￥%^&*()/\|,.<>?"'();:_+-=\[\]{}]{5,19})+$/.test(this.wechat || '')) {
        this.toastText('请输入正确的微信号', 'top')
      } else {
        this.$store.dispatch('user/setInfo', { wechat: this.wechat }).then(res => {
          if (res.code === 200) {
            this.toastText('保存成功', 'top')
            this.$store.dispatch('user/refreshInfo').then().catch()
            setTimeout(() => {
              this.$router.back(-1)
            }, 100)
          } else {
            this.toastText(res.message, 'top')
          }
        }).catch(e => {
          this.toastText('保存失败', 'top')
        })
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .editor {
    width: 100%;
    height: 100%;
    padding: 0;
    box-sizing: border-box;

    /deep/.van-cell{
      padding: 0;
    }
    /deep/ .van-field__control {
      font-size: 0.32rem;
      padding:0.2rem 0.3rem;
      line-height: 0.48rem;
    }

    .desc {
      color: #999;
      font-size: 0.26rem;
      line-height: 1rem;
      text-align: left;
      padding: 0 0.2rem;
    }
    &.newqp-editor {
      /deep/.van-cell input{
        color: #fff;
      }
    }
  }
  .bg{
    background: rgba(0,0,0,0);
  }
</style>
