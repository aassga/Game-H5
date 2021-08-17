<template>
  <view-page class="agent-take-success" full-box>
    <title-header title="领取佣金" slot="header" ></title-header>

    <div class="content-slot" slot="content">
      <div class="view-box">
        <img class="icon-success" src="../../../assets/img/agent-center-new/success.svg" alt/>
        <p class="title">领取成功</p>
        <p class="info"><span>领取金额</span><span class="money">{{($route.query.money*1).toFixed(2)}}</span></p>
        <p class="info"><span>佣金余额</span><span class="money">{{userInfo&&userInfo['agencyInfo']?userInfo['agencyInfo']['balance']:''}}</span></p>
      </div>

      <button class="btn-primary theme-bg" @click="$router.back()">完成</button>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'Success'
}
</script>

<style lang="less" type='text/less' scoped>
  .agent-take-success {

    .view-box {
      background-color: #ffffff;
      padding: 0.64rem 0.24rem 0.4rem 0.24rem;

      .icon-success {
        display: block;
        width: 1.2rem;
        height: 1.2rem;
        color: #1bc167;
        margin: 0 auto;
      }

      .title {
        font-size: 0.38rem;
        color: #444444;
        line-height: 0.53rem;
        margin-top: 0.24rem;
        margin-bottom: 0.4rem;
        font-weight: 500;
        padding-bottom: 0.56rem;
        border-bottom: 0.02rem solid #E7E7E7;
      }

      .info {
        margin-top: 0.3rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #666666;
        font-size: 0.32rem;

        .money {
          color: #444444;
          font-size: 0.36rem;
        }
      }
    }

    .btn-primary {
      border-radius: 0.1rem;
      color: #FFFFff;
      font-size: 0.38rem;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 1rem;
      width: 7rem;
      margin: 0.42rem auto 0 auto;
    }
  }
</style>
