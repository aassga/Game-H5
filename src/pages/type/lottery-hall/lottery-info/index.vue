<template>
  <div class="lotter-box" :style="{height:height+'px'}">
      <div class="lotter-box-top">
          <p><span class="title">即时注单：</span><span class="zhudan"> {{lotteryNoCount}}</span></p>
          <p><span class="title">当前余额：</span><span class="yue">￥{{userInfo?userInfo.balance:'0.00'}}</span></p>
          <p><span class="title">今日输赢：</span><span class="shuying" :style="{color:(Number(totalWin)<0?'#2EFF66':'#FFE652')}">￥{{totalWin}}</span></p>
      </div>
      <div class="lottery-box-content">
          <div  @click="$router.push('/trend/'+id+'/0')">
            <i slot="icon" class="icon iconfont h5-icon-kaijiangzoushi"></i>
            <span slot="title" class="label">开奖走势</span>
          </div>
          <div  @click="onBetRecode1">  
            <i slot="icon" class="icon iconfont h5-icon-touzhujilu1"></i>
            <span slot="title" class="label">投注记录</span>
          </div>
          <div @click="$router.push('/user')">
            <i slot="icon" class="icon iconfont h5-icon-gerenzhongxin"></i>
            <span slot="title" class="label">个人中心</span>
          </div>
          <div @click="$router.push('/save')">
            <i slot="icon" class="icon iconfont h5-icon-zaixianchongzhi"></i>
            <span slot="title" class="label">在线充值</span>   
          </div>
          <div @click="$router.push('/take?path=home/type/10000?type=lotteryInfo')">
            <i slot="icon" class="icon iconfont h5-icon-zaixiantikuan"></i>
            <span slot="title" class="label">在线提款</span>
          </div>
      </div>
  </div>
</template>



<script type="text/javascript">
export default {
  name: "LotteryInfo",
  data() {
    return {
      height:window.document.documentElement.clientHeight,
      betCount: 0,
      showRules: false,
      totalWin:'',
      lotteryNoCount:'',
      id:''
    };
  },
  computed: {
   
  },
  created() {
      this.getTotalWin();
      this.getLotteryNoCount();
      this.getGames();  
  },
  methods: {
    getGames () {
      this.$store.dispatch('main/getNewGame', {
        id: '30001',
        callback: baseRes => {
          if (baseRes['30001'] && baseRes['30001'].length) {
            let setId = {
              222 : 10006,
              223 : 10007,
              224 : 10008,
              225 : 10009,
              226 : 10010,
              227 : 10011,
              228 : 10012,
              229 : 10013,
            }
            const ids = (baseRes['30001'].slice(1)).map(item => setId[item.id]).join('|')
            this.$store.dispatch('main/getNewGame', {
              id: ids,
              callback: res => {
                if (res) {
                  let list = []
                  Object.keys(res).forEach(id => {
                    list = list.concat(res[id])
                  })
                  this.games = list
                  this.id = this.games[0].id
                } else {
                  this.games = []
                }
              }
            })
          }
        }
      })
    },
    getLotteryNoCount(){
      this.$store.dispatch('lottery/getLotteryNoCount')
      .then(res=>{
        this.lotteryNoCount = res.data;
      })
    },
    getTotalWin(){
      this.$store.dispatch('user/getRecordSummary', {
          start:this.dayJs().format('YYYY-MM-DD'),
          end: this.dayJs().format('YYYY-MM-DD'),
          game: 'lottery',
          callback: res => {
            this.totalWin =  res.data.amount.total_win;
          }
      })
    },
    onBetRecode() {
      if (this.$store.state.user.userInfo && this.$store.state.user.token) {
        localStorage.setItem('local-url', encodeURIComponent(window.location.href))
        this.$router.push({ path:'/user/record', query:{
          entry: 1,
          winType: 3,
        }})
      } else {
        this.$router.push("/admin/login");
      }
    },
    onBetRecode1() {
       if (this.$store.state.user.userInfo && this.$store.state.user.token) {
        localStorage.setItem('local-url', encodeURIComponent(window.location.href))
        this.$router.push({ path:'/user/record', query:{
          entry: 2,
          winType: 0,
        }})
      } else {
        this.$router.push("/admin/login");
      }
    }
  }
};
</script>
<style lang="less" type='text/less'>
  .lotter-box {
      background:#00B8FF;
      text-align:left;
      padding-left:0.48rem;
    .lotter-box-top {
        p {
            font-size: 0.28rem;
            font-weight: 400;
            font-family: PingFang SC;
            height:0.4rem;
            line-height:0.4rem;
            color: #FFFFFF;
            margin-bottom:0.17rem;
            .title {
                margin-right:0.30rem;
            }
            .zhudan,.yue {
                font-size: 0.36rem;
                font-weight: 800;
                color: #FFE652;
            }
            .shuying {
                font-size: 0.36rem;
                font-weight: 800;
                color: #2EFF66;
            }
        }
    }
    .lottery-box-content {
        margin-top:0.58rem;
        div {
          height: 0.45rem;
          margin-bottom: 0.44rem;
            .iconfont {
                font-size:0.36rem;
                color:#fff!important;
                margin-right:0.44rem;
            }
            .label {
                font-size: 0.32rem;
                font-family: PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
            }
        }
    }
  }
</style>
