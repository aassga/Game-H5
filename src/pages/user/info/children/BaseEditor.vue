<template>
  <view-page class="user-info-editor theme-main-bg" :full-box="!isShowFixed">
    <title-header :title="title" slot="header" class="theme-header-bg theme-header-bottom">
      <span slot="right" class="header-right" @click="onSave" v-if="['phone','email','wechat'].includes(type)">保存</span>
    </title-header>
    <component :is="comps[type]" :save.sync="save" class="content-box" :tab="tab" slot="content" @on-title-change="changeTitle"></component>
  </view-page>
</template>

<script type="text/javascript">
import PhoneEditor from './PhoneEditor'
import EmailEditor from './EmailEditor'
import WechatEditor from './WechatEditor'
import BankEditor from './BankEditor'
import SafetyEditor from './SafetyEditor'
import UsdtEditor from './UsdtEditor'

export default {
  name: 'BaseEditor',
  components: {
    PhoneEditor,
    EmailEditor,
    WechatEditor,
    BankEditor,
    UsdtEditor
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    tab: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      title: '',
      comps: {
        phone: 'PhoneEditor',
        email: 'EmailEditor',
        wechat: 'WechatEditor',
        bank: 'BankEditor',
        safety: SafetyEditor,
        usdt: 'UsdtEditor'
      },
      save: false
    }
  },
  methods: {
    changeTitle (title) {
      this.title = title
    },
    onSave () {
      this.save = true
    }
  },
  computed:{
    isShowFixed(){
       return this.$store.state.main.keyBoardStatus
    }
  },
  created () {
    if (!this.$store.state.user.userInfo || !this.$store.state.user.token) {
      this.goNewLogin()
    }
    document.documentElement.style.backgroundColor = '#F6F6F6'
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .user-info-editor {

  }

  .header-right {
    position: absolute;
    right: 0.2rem;
    top: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.3rem;
  }
</style>
