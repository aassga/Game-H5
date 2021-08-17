<template>
  <div :class="['editor','bg',{'newqp-editor' : $config.newQP || $config.blackTheme || $config.blush}]">
    <van-cell-group class="theme-main-bg theme-after-border-nocolor theme-border-bottom-1">
      <van-field v-model="email" type="email" placeholder="" clearable class="theme-main-bg"></van-field>
    </van-cell-group>
    <p class="desc theme-color-white">请填写您的邮箱地址</p>
  </div>
</template>

<script type="text/javascript">
export default {
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
      email: ''
    }
  },
  mounted () {
    this.email = this.$store.state.user.userInfo.email !== '' ? this.$store.state.user.userInfo.email : '-'
    console.log('this.email',this.email) //TODO Email
    if (this.email) {
      this.$emit('on-title-change', '修改邮箱')
    } else {
      this.$emit('on-title-change', '设置邮箱')
    }
  },
  methods: {
    onSave () {
      if (!this.email) {
        this.toastText('请输入邮箱地址', 'top')
      } else if (!/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(this.email || '')) {
        this.toastText('请输入有效的邮箱地址', 'top')
      } else {
        this.$store.dispatch('user/setInfo', { email: this.email }).then(res => {
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
