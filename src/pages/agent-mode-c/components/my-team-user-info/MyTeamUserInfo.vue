<template>
  <van-popup v-model="show" :style="positionStyle" position="bottom"  get-container="body" :overlay="true" :lazy-render="false">
    <div class="container">
      <div class="tit">
        详细信息
        <span class="close" @click="show = false">
          <img src="@src/assets/img/agent-center-modec/index/close-agent-des.png" />
        </span>
      </div>
      <div class="cont">
        <div class="top-info">
          <div class="pull-left top-left">
            <img :src="avatar" class="avatar">
            <div class="name">
              <span class="chineseName" v-if="userData.chineseName">{{userData.chineseName}}</span>
              <span class="userName">{{userData.userName}}</span>
            </div>
          </div>
          <div class="pull-left reg-time">
            <div class="time">{{getTime(userData.userRegistrationTime)}}</div>
            <div class="text">注册时间</div>
          </div>
        </div>
        <div class="list">
          <div class="left-list">
            <ul class="pull-right">
              <li>
                <span class="text">昨日总佣金</span>
                <span class="num">{{userData.yesterdayAllCommission}}</span>
              </li>
              <li>
                <span class="text">昨日直推佣金</span>
                <span class="num">{{userData.yesterdayDirectCommission}}</span>
              </li>
              <li>
                <span class="text">昨日级差佣金</span>
                <span class="num">{{userData.yesterdayRankCommission}}</span>
              </li>
              <li>
                <span class="text">今日预估佣金</span>
                <span class="num">{{userData.todayAboutCommission}}</span>
              </li>
            </ul>
          </div>
          <div class="right-list">
            <ul class="pull-left">
              <li>
                <span class="text">团队总人数</span>
                <span class="num">{{userData.teamTotal}}</span>
              </li>
              <li>
                <span class="text">直属会员总数</span>
                <span class="num">{{userData.directlyTotal}}</span>
              </li>
              <li>
                <span class="text">昨日团队新增</span>
                <span class="num">{{userData.yesterdayTeamAdd}}</span>
              </li>
              <li>
                <span class="text">本月团队新增</span>
                <span class="num">{{userData.currentMonthTeamAdd}}</span>
              </li>
            </ul>
          </div>
          <div class="line"></div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script type="text/javascript">
export default {
  name: "AgentDescription",
  props: {
    userData: {
      type: Object
    },
  },
  data () {
    return {
      avatars: {}
    }
  },
  computed: {
    info () {
      return this.$store.state.user.userInfo
    },
    avatar () {
      return require('../../../../assets/img/user/proimt/default.png')
    },
    positionStyle(){
      //解决安卓小米position：fixed问题导致按钮错位问题
      if(this.$mobileDevice.isAndroid 
        && this.$mobileDevice.browserName === 'MIUI Browser'){
        return {
          position:'absolute'
        }
      }else{
        return {
          position:'fixed'
        }
      }
    },
  },
  data() {
    return {
      show: false
    };
  },
  created() {},
  watch: {},
  methods: {
    getTime (str) {
      return this.dayJs.unix(str).format('YYYY-MM-DD')
    },
  }
};
</script>

<style lang="less" type='text/less' scoped>
.pull-left {
  float: left;
}

.pull-right {
  float: right;
}
.container {
  width: 7.18rem;
  height: 5.11rem;
  margin: 0 auto;
  background-color: #fff;
  font-family: PingFang-SC-Medium, PingFang-SC;
  border-radius: 0.1rem 0.1rem 0 0;
  overflow: hidden;
  .tit {
    position: relative;
    width: 100%;
    height: 0.98rem;
    line-height: 0.98rem;
    border-bottom: 0.01rem solid #e7e7e7;
    color: #444444;
    font-size: 0.32rem;
    font-weight: bold;
    img {
      position: absolute;
      top: 50%;
      margin-top: -0.2rem;
      right: 0.16rem;
      width: 0.41rem;
      height: 0.41rem;
    }
  }
  .cont {
    height: 100%;
    .top-info{
      height: 1.04rem;
      overflow: hidden;
      padding: .24rem 0 0 .32rem;
      font-size: .3rem;
      box-sizing: content-box;
      color: #444;
      .top-left {
        overflow: hidden;
        .avatar {
          float: left;
          width: 1.04rem; 
          height: 1.04rem;
          border-radius: 50%;
        }
        .name {
          float: left;
          text-align: left;
          margin-left: .16rem;
          margin-top: .1rem;
          max-width: 2.7rem;
          span {
            display: block;
            height: .42rem;
            line-height: .42rem;
            overflow:hidden; 
            text-overflow:ellipsis; 
            white-space:nowrap; 
          }
        }
      }
      .reg-time{
        text-align: left;
        margin-top: .11rem;
        margin-left: .88rem;
        height: .42rem;
        line-height: .42rem;
        .text {
          color: #A3A3A3;
        }
      }
    }
    .list {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-size: .28rem;
      color: #444;
      margin-top: .4rem;
      .left-list, .right-list {
        display: inline-block;
        width: 50%;
        &.left-list {
          padding-right: .4rem;
        }
        &.right-list {
          padding-left: .4rem;
        }
        ul {
          li {
            margin-bottom: .16rem;
            text-align: left;
            .text {
              display: inline-block;
              margin-right: .16rem;
              width: 1.68rem;
              height: .4rem;
              line-height: .4rem;
              text-align: right;
            }
            .num {
              color: #E71414;
            }
          }
        }
      }
      .line{
        position: absolute;
        top: .45rem;
        left: 50%;
        width: 0.02rem;
        height: 1.2rem;
        background-color: #E7E7E7;
        border-radius: .02rem;
      }
    }
  }
}
</style>