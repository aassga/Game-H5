<template>
  <view-page :transfer-header="false" :full-box="!isShowFixed"  class="theme-main-bg-2">
    <title-header 
    :title="$route.query.title ? $route.query.title 
    : id==='jc'?'转账教程' 
    : id==='支付宝转卡'?'支付宝转银行卡教程'
    : id==='微信转卡'?'微信转银行卡教程'
    : id==='支付宝转支付宝'?'支付宝转支付宝教程'
    : id==='微信转微信'?'微信转微信教程'
    : id==='wx' ? '微信转帐教程' : '支付宝转帐教程'"  slot="header" class="theme-header-bg theme-header-bottom"></title-header>
    <div style="width: 100%;box-sizing: border-box" slot="content">
      <component :id="$route.params.id" :title="$route.query.title" :is="comp"></component>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import SubmitBank from './SubmitBank'
import SubmitQRCode from './SubmitQRCode'
import SubmitPayment from './SubmitPayment'
import SubmitHelp from './SubmitHelp'
import TransferBank from './TransferBank'
import TransferAccount from './TransferAccount'
import SubmitUSDT from './SubmitUSDT'
import SubmitUSDT2 from './SubmitUSDT2'
export default {
  name: 'SaveSubmit',
  components: {
    SubmitBank,
    SubmitQRCode,
    SubmitPayment,
    SubmitHelp,
    TransferBank,
    TransferAccount,
    SubmitUSDT,
    SubmitUSDT2,
  },
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data(){
    return{
      isLoad:true,
    }
  },
  created(){
      sessionStorage.clear()
      let params={
            tabIndex:1,
      }
      sessionStorage.setItem('params', JSON.stringify(params))
  },
  computed: {
    comp () {
      switch (this.type) {
        case 'bank':
          return 'SubmitBank'
        case 'qr_code':
          return 'SubmitQRCode'
        case 'payment':
          return 'SubmitPayment'
        case 'help':
          return 'SubmitHelp'
        case 'transfer_bank':
          return 'TransferBank' 
        case 'transfer_account' : 
          return 'TransferAccount'
        case 'virtual': 
          if(this.$config.home === 'amhg') {
            return 'SubmitUSDT'
          }else {
            return 'SubmitUSDT2'
          }
        default:
          return ''
      }
    },
    isShowFixed(){
      return this.$store.state.main.keyBoardStatus
    }
  }
}
</script>
