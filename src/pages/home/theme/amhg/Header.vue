<template>
  <div class="home-header clearfix">
    <div class="home-header-lf">
      <img class="home-logo" src="@site/assets/img/home/logo.png" alt="" v-if="$config.name !== '500w'">
      最佳博彩认证推荐品牌
    </div>
    <div class="home-header-rt">
       <span @click="$emit('on-download')">APP下载</span>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'Header',
  methods: {
  },
  computed: {
    logoImg() {
      let img = ''
      if(localStorage['main/logoInfo'] &&  JSON.parse(localStorage['main/logoInfo']).length > 0){
        try {
            JSON.parse(localStorage['main/logoInfo']).forEach(ff=>{
            if(ff.position === 'logo' && ff.clientType === 'mobile') {
              img =  localStorage.SiteStaticsUrl + ff.body[0].img
            }
          })
        } catch (error) {
          img =  require('@site/assets/img/home/logo.png')
        }
      }else{
        img =  require('@site/assets/img/home/logo.png')
      }
      return img
    }
  },
}
</script>

<style lang="less" type='text/less' scoped>
  .home-header {
    width: 100%;
    height: 1.08rem;
    margin:0 auto;
    background: #f9f9f9;
    padding:0 0.3rem;
    .home-header-lf{
      float: left;
      height: 100%;
      font-size: 0.28rem;
      font-weight:bold;
      color: #707070;
      padding-top:0.2rem;
      .home-logo {
        width: 2.06rem;
        height: 0.68rem;
        box-sizing: border-box;
        vertical-align: bottom;
        margin-right: 0.08rem;
      }
    }
    .home-header-rt{
      float: right;
      height: 100%;
      display: flex;
      align-items: center;
      span{
        width:1.55rem;
        height: 0.52rem;
        line-height: 0.52rem;
        border: 1px solid #707070;
        border-radius: 95px;
        font-size: 0.26rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #707070;
      }
    }
  }
</style>
