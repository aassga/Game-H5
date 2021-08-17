<template>
  <div v-if="$store.state.main.showRedPackRain">
  <img  @click="open" src="../../assets/img/hongbaoyu/hby.gif" :class="getClass()" :style="getStyle(item)" v-for="item in count" :key="item" @webkitAnimationIteration='iterationEvent(item, $event)'>
</div>

</template>

<script>
export default {
  name: 'hongbaoyu',
  props: {
    count: {
      type: Number,
      default: 12
    },
    minSize: {
      type: Number,
      default: 68
    },
    maxSize: {
      type: Number,
      default: 90
    },
  },
  data () {
    return {
    }
  },
  created(){ 
     if(this.$route.fullPath=='/admin/login'){
         this.$store.commit('main/getShowRedPackRain',false) 
     }
  },
  methods: {
      open(){
         if(this.$store.state.user.token){    
              this.$store.dispatch('main/getHongboayuLinqu','A0018').then(res=>{
                 if(res.data.code==200){
                      this.$store.commit('main/getIsRedPack',true)
                      this.$store.commit('main/getHongbaoyuMoney',res.data.data.git_amount);
                      this.$store.commit('main/getShowRedPackRain',false)
                      this.$store.commit('main/setCloseRedPackRain',false)
                      localStorage.removeItem('hongbaoyuShow')
                      this.$store.commit('main/isShowMask', {
                        page: '',
                        status: true
                     }) 
                  }else{
                     this.toastText(res.data.message, 'middle')
                  }
              })
         }else{
              this.toastText('请先登录', 'middle')
              this.$router.push("/admin/login")
         }
      },
    iterationEvent (item, $event) {
      $event.target.style.cssText = this.getStyle(item)
    },
    getClass () {
      return `hb-item hbsd-${Math.floor(Math.random() * 50 + 30)}`
    },
    getStyle (item) {
       return `width:${(this.maxSize/80)}rem;
      left:${item*6+2}%;
      transform: translateY(-30vh);
      margin-top:${Math.floor((Math.random() * 100.8493 + 10))}px
      `
    }
  }
}
</script>

<style lang="less" scoped>
.hb-item{
  position: absolute;
  top: 0;
  z-index: 511;
  cursor: pointer;
}
/////////////////////////////////
@keyframes startHB {
  0% {
    transform: translateY(-200px);
    -ms-transform:translateY(-200px);
    -webkit-transform:translateY(-200px);
  }
  100% {
    transform: translateY(70vh);
    -ms-transform:translateY(70vh);
    -webkit-transform:translateY(70vh);
  }
}

@keyframes chandou{
    0%{margin-left:0.5rem}
    10%{margin-left:-0.5rem}
    20%{margin-left:0.7rem}
    30%{margin-left:-0.7rem}
    40%{margin-left:0.5rem}
    50%{margin-left:-0.5rem}
    60%{margin-left:0.3rem}
    70%{margin-left:-0.5rem}
    80%{margin-left:0.8rem}
    90%{margin-left:-0.2rem}
    100%{margin-left:0;}
}

 .for(@i,@t:@i/2.5s,@f:@i/2.5s) when(@i <= 100) { //@i、@cor循环的初值
    .for(@i + 1); //@i + 1 相当于"++i"
    .hbsd-@{i} {
        animation: startHB @t  linear infinite,chandou  @f infinite linear alternate both;
        -ms-transform:startHB @t  linear infinite,chandou  @f infinite linear alternate both;
       -webkit-transform:startHB @t  linear infinite,chandou  @f infinite linear alternate both;
    }
}
.for(1,1);        
</style>
