<template>
  <div class="code-4000">
    <!--    <p class="info">非法访问</p>-->
    <a class="kf-link" :href="getKF || 'javascript:void(0)'" target="_blank"></a>
  </div>
</template>

<script type="text/javascript">
import pageMixin from '../../mixin'

export default {
  name: 'Code4000',
  mixins: [pageMixin]
}
</script>

<style lang="less" type='text/less' scoped>
  .code-4000 {
    position: fixed;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    overflow: hidden;
    background-image: url("../../../assets/images/code/403.jpg");
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;

    .info {
      color: #FFFFff;
      font-size: 0.64rem;
      margin-top: 3rem;
    }

    .kf-link {
      display: block;
      width: 3.5rem;
      height: 1rem;
      position: absolute;
      left: 2rem;
      top: 7.72rem;
    }
  }
</style>
