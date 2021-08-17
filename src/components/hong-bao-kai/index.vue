<template>
    <div :class="this.$store.state.main.isRedPack==true?'red-box':''" v-NoTouchMove>
        <!-- <div class="red-bg"  v-if="this.$store.state.main.isRedPack"  >
            <div class="red-img">
                <p class="red-money"><i>￥</i><span>{{$store.state.main.hongbaoyuMoney}}</span></p> 
                <div class="close-box">
                 <div class="closeBtn" @click="onClse">
                 <img  class="clsoeImg" src="../../assets/img/hongbaoyu/close-btn3.png"/>
                </div>
                </div>
            </div> 
        </div> -->
  </div>

</template>

<script>
export default {
  name: 'hongbaoyu',
  data () {
    return {
    }
  },
  methods: {
      onClse(){
        this.$store.commit('main/getIsRedPack',false);
        this.$store.commit('main/isShowMask', {
        page: '',
        status: false
        })
      },
  }
} 
</script>

<style lang="less" scoped>

/////////////////////////////////
    .red-box {
        width: 100%;
        height: 100%;
        position: absolute;
        animation: scaleDraw 1s ease-in-out 1;
        top: 0;
         z-index: 503;
            .red-bg{
        width: 6.6rem;
        height: 6.6rem;
        position: relative;
        background-size: 100%;
        background-repeat: no-repeat;
        top: 50%;
        position: relative;
        left: 50%;
        z-index:1000;
         transform: translate(-50%, -50%); 
        .red-img{
            position: absolute;
            top:0;
            width: 6.6rem;
            height: 6.6rem;
            background-image: url('../../assets/img/hongbaoyu/open.gif');
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: center;  
            .red-money{
                  display: flex;
                color:#fff;
                position: absolute;
                width: 100%;
                height: 70%;
                justify-content: center;
                align-items: center;
               
                text-align: center;
                i{
                   font-size:0.4rem;
                }
                span{
                  font-size:0.4rem;
                }

            }
            .close-box{
                display: flex;
                position: absolute;  
                justify-content: center;
               align-items: center; 
                width: 100%;
                height: 26%; 
                bottom: 0;
                .closeBtn{
                width: 0.6rem;
                height: 0.6rem;
                img{
                    width:100%;
                    height:100%;
                    cursor:pointer;
                }
            }
        }
        }

       
    }
    }


</style>
