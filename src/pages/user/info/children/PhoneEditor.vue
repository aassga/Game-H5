<template>
  <div :class="['editor','bg',{'newqp-editor' : $config.newQP || $config.blackTheme || $config.blush}]">
    <van-cell-group class="theme-main-bg theme-after-border-nocolor theme-border-bottom-1">
      <van-field  v-model="phone" v-keyBroayStates  type="tel" placeholder="" maxlength=11 clearable class="theme-main-bg"></van-field>
    </van-cell-group>
    <p class="desc theme-color-white">请填写您的手机号</p>
  </div>
</template>

<script type="text/javascript">

export default {
  name: 'PhoneEditor',
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
      phone: ''
    }
  },
  mounted () {
    this.phone = this.$store.state.user.userInfo.phone !== '' ? this.$store.state.user.userInfo.phone : '-'
    if (this.phone) {
      this.$emit('on-title-change', '修改手机')
    } else {
      this.$emit('on-title-change', '设置手机')
    }
  },
  methods: {
    onSave () {
      if (!this.phone) {
        this.toastText('请输入手机号', 'top')
      } else if (!/^1[345789]\d{9}$/.test(this.phone || '')) {
        this.toastText('请输入有效的11位数字手机号码', 'top')
      } else {
        this.$store.dispatch('user/setInfo', { phone: this.phone }).then(res => {
          if (res.code === 200) {
            this.toastText('保存成功', 'top')
            this.$router.back(-1)
            this.$store.dispatch('user/refreshInfo').then().catch()
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
