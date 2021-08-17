<template>
    <div>
      <ul class="lottery_vns">
          <li
            class="item"
            v-for="(item,i) in list"
            :key="i"
            @click.capture.stop="onGameClick(item)"
          >
            <img class="icon" src="../../../../assets/img/error-img-lottery.png" v-real-img="imgUrl(item.icon)" alt/>
            <div class="game_title">
              <span class="name">{{item.name}}</span>
              <hall-time :id="item.id" v-if="item.id && item.name!=='长龙助手'" ></hall-time>
              <span class="title">{{item.title}}</span>
            </div>
          </li>
        </ul>
    </div>
 
</template>

<script>
import HallTime from "../hall-time/timer"
export default {
  name: "LotteryList",
  props:['list'],
  components: {
    HallTime:HallTime
  },
  data() {
    return {
      
    };
  },
  created() {
   
  },
  mounted () {
  },
  methods: {
    imgUrl (url) {
      if(url.indexOf('longDragon.png') > 0) {
        return url
      }else {
        return this.publicStaticHost + '/images/'+ url
      }
    },
  }
};
</script>

<style lang="less" scoped>
  .lottery_vns {
      width: 100%;
      background: #f6f6f6;
      padding: 0.3rem 0 0.5rem 0.3rem;
      margin: 0;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      .item {
        width:2.14rem;
        height:3.1rem;
        margin:0 0.25rem 0.3rem 0;
        position:relative;
        .icon {
          width:100%;
          height:100%;
        }
        .game_title {
          width:100%;
          position:absolute;
          top:1.74rem;
          text-align:center;
          span{
            color:#fff;
            display:block;
            &.name {
              font-size: 0.29rem;
              font-family: PingFang SC;
              font-weight: 800;
              margin-bottom: 0.05rem;
            }
            &.title, &.fenpan {
              font-size: 0.24rem;
              font-family: PingFang SC;
              font-weight: 400;
              color:#fff;
            }
          }
        }
      }
    }
</style>
