<template>
  <view-page class="agent-center-new theme-header-bg" full-box>
    <div slot="static" class="theme-agent-bg theme-header-bg theme-header-bottom" :style="headerStyle"></div>
    <div class="header theme-header-bg" slot="header">
      <title-header class="title" style="background-color: rgba(0,0,0,0) !important;" backEvent @back="$router.push('/user')" title="个人报表">
        <div class="header-right" slot="right" @click="showDateSelector=true">
          <span style="margin-right: 0.08rem;">{{dataInputName}}</span>
          <span class="date-icon icon iconfont h5-icon-qushi-moreup"></span>
        </div>
      </title-header>
    </div>
    <div class="content" slot="content">
      <div class="commission" :class="{'theme-gradient-bg-3' : $config.blackTheme || $config.newQP,'theme-main-bg-1':$config.blush}">
        <img :src="avatar"/>
        <div class="tittle-info">
          <p class="theme-color-white">{{ userInfo.userName }}</p>
          <img :src="userImg"/>
        </div>
      </div>
      <div class="admin-count theme-color-white" :class="{'theme-gradient-bg-3' : $config.blackTheme || $config.newQP,'theme-main-bg-1':$config.blush}">
        <p class="admin-tittle theme-color-white theme-after-border-color">帐号汇总</p>
        <ul class="admin-num">
          <li v-for="(item, index) in list.slice(0,3)" :key="index">
             <p class="value" :class="{red:parseFloat(item.value)}">{{item.value.toFixed(2)}}</p>
             <p class="label theme-color-white">{{item.name}}</p>
          </li>
        </ul>
      </div>
      <div class="touzhu-count theme-color-white" :class="{'theme-gradient-bg-3' : $config.blackTheme || $config.newQP,'theme-main-bg-1':$config.blush}">
        <p class="touzhu-tittle theme-color-white theme-after-border-color">投注汇总</p>
        <ul class="admin-num">
          <li v-for="(item, index) in list.slice(3,list.length)" :key="index">
             <p class="value" :class="{red:parseFloat(item.value)}">{{item.value.toFixed(2)}}</p>
             <p class="label theme-color-white">{{item.name}}</p>
          </li>
        </ul>
      </div>
    </div>
    <div slot="static">
      <agency-date-selector :dataIndex="1" v-model="targetDate" :defaultIndex="defaultIndex" :show.sync="showDateSelector" :dateName='dateName' @indexEvent="dateSelect" @okSelect="okSelect"></agency-date-selector>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import AgencyDateSelector from '@src/components/agency-date-selector/AgencyDateSelector'
export default {
  name: 'Report',
   components: {
    AgencyDateSelector
  },
  data () {
    return {
      targetDate: null,
      avatars: {},
      dateShow: false,
      list: [],
      defaultIndex:0,
      showDateSelector: false,
      dateName:'',
      dataInputName: '今天',
    }
  },
  computed:{
    userImg(){
      return this.userInfo.is_agency == 1 ? require('../../../assets/img/user/report/daili.png'): require('../../../assets/img/user/report/vip.png')
    },
    userInfo () {
      //console.log('=='+this.$store.state.user.userInfo);
      return JSON.getObjByLocalStorage('userInfo')
    },
    avatar () {
      return this.userInfo ? this.avatars[this.userInfo.pic] || this.avatars.default : this.avatars.default
    },
    headerStyle () {
      return {
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '2.44rem',
        zIndex: '-1',
        // background: 'linear-gradient(180deg, rgba(1, 195, 207, 1) 0%, rgba(47, 115, 255, 1) 100%)'
      }
    },
  },
  created () {
    this.avatars.default = require('../../../assets/img/user/proimt/default.png')
    this.$store.state.user.avatars.forEach(name => {
      this.avatars[name] = require('../../../assets/img/user/proimt/' + name)
    })
  },
  mounted(){
    setTimeout(() => {
        this.refresh();
    },300);
  },
  methods: {
    getDefaultIndex(index){
      
    },
    okSelect(data,index){
      this.defaultIndex = index;
      this.targetDate = data;
      this.dataInputName = data.name || '今天'
      this.refresh();
    },
    dateSelect(index){
       //this.defaultIndex = index;
    },
    refresh () {
      this.$store.state.main.loadingText = '正在获取...'
      this.$store.dispatch('user/report', {
        start: this.targetDate.start,end: this.targetDate.end,
        callback: res => {
          if (res && res.code === 200) {
            this.list = res.data
          } else if (res) {
            this.toastText(res.message, 'top')
            this.list = []
          } else {
            this.toastText('获取数据失败', 'top')
            this.list = []
          }

          this.$store.state.main.loadingText = ''
        }
      })
    }
  },
  beforeDestroy () {
    this.$store.state.main.loadingText = ''
  }
}
</script>

<style lang="less" type='text/less' scoped>
.header-right {
    position: absolute;
    right: 0.16rem;
    top: 0;
    font-size: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;

    .date-icon {
      font-size: 0.2rem;
      transform: scale(0.7) rotateZ(180deg);
      color: #ffffff;
    }
  }
  .agent-center-new {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #f6f6f6;
    font-size: 0.3rem;
    font-weight: 500;
    line-height: 0.42rem;

    .money {
      color: #E71414;
    }

    .content {
      position: relative;
      z-index: 500;
      padding: 0.12rem 0.15rem 0 0.15rem;
    }
    .commission {
      position: relative;
      height: 1.6rem;
      margin-top: 0.12rem;
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      text-align: center;
      width: 100%;
      overflow: visible;
      background-color: red;
      background:rgba(255,255,255,1);
      box-shadow:0 0.05rem 0.05rem 0 rgba(0,0,0,0.03);
      border-radius:0.1rem;
      align-items: center;
      justify-content: flex-start;
      >img{
        width: 0.96rem;
        height: 0.96rem;
        margin-left: 0.24rem;
        border-radius: 50%;
      }
      >.tittle-info{
        margin-left: 0.16rem;
        text-align: left;
        >p{
          margin-left: 0.08rem;
          height: 0.45rem;
          line-height: 0.45rem;
          color: #444444;
          font-size: 0.32rem;
        }
        >img{
          height: 0.72rem;
          width: 1.34rem;
        }
      }
    }
    .admin-count{
      margin-top: 0.24rem;
      width: 100%;
      height: 2.15rem;
      background-color: #ffffff;
      box-shadow:  0 0.05rem 0.05rem 0 rgba(0,0,0,0.03);
      border-radius: 0.1rem;
      .admin-tittle{
        height: 0.8rem;
        color: #444444;
        font-size: 0.32rem;
        font-weight: bold;
        line-height: 0.8rem;
        text-indent: 0.24rem;
        width: 100%;
        text-align: left;
        position: relative;
        &::after{
          position: absolute;
          box-sizing: border-box;
          content: ' ';
          pointer-events: none;
          right: 0;
          bottom: 0;
          left: 0;
          border-bottom: 0.02rem solid #ebedf0;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
        }
      }
      >.admin-num{
        height: 1.38rem;
        width: 100%;
        >li{
          height: inherit;
          width: calc(100% / 3);
          float: left;
          display: flex;
          flex-direction: column;
          justify-content: center;
          >.value{
            font-size: 0.32rem;
          }
          >.label{
            margin-top: 0.04rem;
            font-size: 0.28rem;
            font-weight:normal !important;
            color: #444444;
          }
        }
      }
    }
    .touzhu-count{
      margin-top: 0.24rem;
      width: 100%;
      height: 2.15rem;
      background-color: #ffffff;
      box-shadow:  0 0.05rem 0.05rem 0 rgba(0,0,0,0.03);
      border-radius: 0.1rem; 
      .touzhu-tittle{
        height: 0.8rem;
        color: #444444;
        font-size: 0.32rem;
        font-weight: bold;
        line-height: 0.8rem;
        text-indent: 0.24rem;
        width: 100%;
        text-align: left;
        position: relative;
        &::after{
          position: absolute;
          box-sizing: border-box;
          content: ' ';
          pointer-events: none;
          right: 0;
          bottom: 0;
          left: 0;
          border-bottom: 0.02rem solid #ebedf0;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
        }
      }
      >.admin-num{
        height: 1.38rem;
        width: 100%;
        >li{
          height: inherit;
          width: calc(100% / 3);
          float: left;
          display: flex;
          flex-direction: column;
          justify-content: center;
          >.value{
            font-size: 0.32rem;
          }
          >.label{
            margin-top: 0.04rem;
            font-size: 0.28rem;
            font-weight:normal !important;
            color: #444444;
          }
        }
      }
    }
    .red {
        color: #ff2200 !important;
    }
}
</style>
