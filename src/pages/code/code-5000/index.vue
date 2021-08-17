<template>
  <div class="code-5000">
    <img class="img" src="../../../assets/images/code/5000.png" alt>
    <h4 class="title">系统维护升级中</h4>
    <p class="desc">带来不便，敬请谅解</p>
    <p class="time">
      {{$store.state.main.config.close.timeStart}}
      <span class="hr">　---　</span>
      {{$store.state.main.config.close.timeEnd}}
    </p>
    <a class="btn" :href="kfHref">联系客服</a>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'Code5000',
  computed: {
    kfHref () {
      const kf = this.$store.state.main.config['service'].find(item => item.status === 'on')
      if (kf) {
        return kf.url
      } else {
        return ''
      }
    }
  },
  created () {
    if (this.$store.state.main.config) {
      if (this.$store.state.main.config.close.status === 'off') {
        this.$router.push('/')
      }
    } else {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .code-5000 {
    position: fixed;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    overflow: hidden;

    .img {
      width: 4.65rem;
      display: block;
      margin-top: 1rem;
      margin-left: auto;
      margin-right: auto;
    }

    .title {
      margin-top: 1rem;
      color: #666666;
      font-size: 0.5rem;
      line-height: 0.5rem;
    }

    .desc {
      margin-top: 0.16rem;
      color: #888888;
      font-size: 0.24rem;
      line-height: 0.24rem;
    }

    .time {
      margin-top: 0.48rem;
      color: #666666;
      font-size: 0.3rem;
    }

    .btn {
      color: #FFFFff;
      background-color: #D0021B;
      width: 3.64rem;
      height: 0.9rem;
      border-radius: 0.44rem;
      display: block;
      margin: 1rem auto 0 auto;
      font-size: 0.32rem;
    }
  }
</style>
