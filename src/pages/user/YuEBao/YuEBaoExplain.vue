<template>
  <view-page class="about theme-header-bg" full-box :class="{'blush-abt':$config.blush}">
    <title-header title="余额宝说明" slot="header" v-if="!isApp" class="theme-header-bg theme-header-bottom"></title-header>
    <div class="content" slot="content">
      <p class="theme-color-white">
        {{$config.setName}}全新推出【余额宝】功能，绝对是您的最佳理财博士，让您<span class="red-color">闲钱也有收益</span>，体验躺着也能赚钱的快感。
      </p>
      <h4 class="tit theme-color-white">余额宝说明</h4>
      <p class="theme-color-white">1、存款金额满足一倍打码后即可转入余额宝，<span class="red-color">最低转入金额为 80元（打码不足一倍或低于80无法转入）</span></p>
      <p class="theme-color-white">2、返利以十分钟为一个结算周期，每次结算后所有金额未转出，则自动进入下一周期结算。</p>
      <p class="theme-color-white">3、计算时间以每整10分开始计算利息，<span class="red-color">例如：08:28:00转入金额，08:30:00开始计算利息，08:40:00发放10分钟利息。</span></p>
      <p class="theme-color-white">4、转入金额根据帐号金管家等级可获得相应比例的<span class="red-color">高额返利，等级越 高，获得返利比例越高。</span></p>
      <p class="theme-color-white">5、<span class="red-color">余额宝内所有金额随时可转出进行购彩或直接提现，非常灵 活便捷。</span></p>
      <p class="theme-color-white">注：<span class="red-color">余额宝每10分钟收益=（本金/24/6）×日利率。</span>如： 您的帐号金管家等级为1级，转入1000000元至余额宝，以0.2%的日利率计算，
        10分钟后的收益=1000000/24/6×0.2%=<span class="blue-color theme-color-yellow">13.888889</span>元，即可获得本金+利息为1000013.888889元，
        若您没有转出，则自动进行下一周期结算，以此类推，<span class="red-color">100万每日最低收益（未计算利滚利）=1000000×0.2%=2000元</span>
      </p>
    </div>
  </view-page>
</template>

<script type="text/javascript">

export default {
  name: 'YuEBaoExplain',
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {
  },
  computed:{
   
  }
}
</script>

<style lang="less" scoped>
  .content {
    font-family: MicrosoftYaHei;
    text-align: left;
    padding: 0.3rem 0;
    .auto-box-content {
      background-color: #fff;
    }
    .tit {
      color: #333333;
      font-size: 0.34rem;
      margin-top: 0.3rem;
      margin-bottom: 0.15rem;
      padding: 0 .23rem;
    }
    p {
      color: #333333;
      font-size: 0.26rem;
      margin-bottom: 0.15rem;
      padding: 0 .23rem;
    }
    .red-color {
      color: #FA1414;
    }
    .blue-color {
      color: #4D8FFA;
    }
  }
  .blush-abt{
     .red-color{
       color: #FBD67A;
     }
  }
</style>
