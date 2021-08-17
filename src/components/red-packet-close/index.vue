<template>
<div v-if="$store.state.main.closeRedPackRain" :class="$config.name=='aqvns'?'js-close':'js-closeall'" >
    <img  class="js-close-snow" src="../../assets/img/hongbaoyu/closeR.png"  
    @click='onBtn'>
</div>
</template>

<script>
export default {
  name: 'redpacketclose',
  data () {
    return {
    }
  },
  methods: {
     onBtn(){
       this.$store.commit('main/setCloseRedPackRain',false)
       this.$store.commit('main/getShowRedPackRain',false)
       localStorage.setItem('hongbaoyuShow',true)
     },
  }
}
</script>

<style lang="less" scoped>
    .js-close{
        width: 1.2rem;
        height: 1.2rem;
        position: fixed;
        z-index: 520;
        right:0.1rem;
        bottom: 2.2rem;
        width:0.8rem;
        height:0.8rem;
        .js-close-snow{
         width:100%;
         height: 100%;
        }
    }
    .js-closeall{
       width: 1.2rem;
        height: 1.2rem;
        position: fixed;
        z-index: 520;
        right:0.1rem;
        bottom: 1.1rem;
        width:0.8rem;
        height:0.8rem;
        .js-close-snow{
         width:100%;
         height: 100%;
        }
    }
</style>
