<template>
  <view-page class="view-page" full-box >
    <title-header slot="header" title="奖励明细">
      <span class="header-right" slot="right" @click="openKF">
        领取奖励
      </span>
    </title-header>
    <div class="content" slot="content">
      <div class="listArea" v-if="showPage">
        <div v-if="groupList.length > 0">
          <div class="listInfo" v-for="(item, index) in groupList" :key="index">
            <div class="listHeader" @click="item.showList = !item.showList">
              <div class="leftArea">
                <div class="title">{{item.name}}</div>
                <div class="time">{{format(item.time)}}</div>
              </div>
              <div class="rightArea">
                <div class="money">{{item.ciajin}}</div>
                <div class="text">获得彩金</div>
              </div>
              <i :class="['icon','iconfont','h5-icon-left-menu-ico',item.showList ? 'down' : 'up']"></i>
            </div>
            <div :class="['listCont',!item.showList ? 'up' : 'down']">
              <ul>
                <li>
                  <div class="sec leftItem">会员帐号</div>
                  <div class="sec middemItem">累计存款</div>
                  <div class="sec rightItem">有效投注</div>
                </li>
                <div v-if="item.list.length > 0">
                  <li v-for="(list,i) in item.list" :key="i">
                    <div class="sec leftItem">{{list.userName}}</div>
                    <div class="sec middemItem">{{list.pay}}</div>
                    <div class="sec rightItem">{{list.bet}}</div>
                  </li>
                </div>
                <div v-else>
                  <li>暂无奖励</li>
                </div>
              </ul>
            </div>
          </div>
        </div>
        <div v-else class="noList">
          <div class="list-empty">
            <img style="width:100%;margin-top: 1.6rem;" :src="noDataImg" alt="">
            <p class="info">暂无奖励明细</p>
          </div>
        </div>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "Report",
  data() {
    return {
      showPage:false,
      groupList: [
        // {
        //   name: "您满足条件一",
        //   ciajin: "38.00",
        //   time: 1572679103,
        //   list: [
        //     {
        //       bet: "10000.00",
        //       pay: "100.00",
        //       userName: "yao1000",
        //       created_at: 1572679103
        //     },
        //     {
        //       bet: "0.00",
        //       pay: "90.00",
        //       userName: "yao1001",
        //       created_at: 1572679103
        //     },
        //     {
        //       bet: "0.00",
        //       pay: "60.00",
        //       userName: "yao1002",
        //       created_at: 1572679103
        //     },
        //     {
        //       bet: "0.00",
        //       pay: "1000.00",
        //       userName: "yao1003",
        //       created_at: 1572679103
        //     },
        //     {
        //       bet: "0.00",
        //       pay: "50.00",
        //       userName: "yao1004",
        //       created_at: 1572679103
        //     },
        //     {
        //       bet: "0.00",
        //       pay: "0.00",
        //       userName: "yao1005",
        //       created_at: 1572679103
        //     }
        //   ]
        // },
        // {
        //   name: "您满足条件二",
        //   ciajin: "58.00",
        //   time: 1572679103,
        //   list: [
        //     {
        //       bet: "10000.00",
        //       pay: "100.00",
        //       userName: "yao1000",
        //       created_at: 1572679103
        //     },
        //     {
        //       bet: "0.00",
        //       pay: "90.00",
        //       userName: "yao1001",
        //       created_at: 1572679103
        //     },
        //     {
        //       bet: "0.00",
        //       pay: "60.00",
        //       userName: "yao1002",
        //       created_at: 1572679103
        //     },
        //     {
        //       bet: "0.00",
        //       pay: "1000.00",
        //       userName: "yao1003",
        //       created_at: 1572679103
        //     },
        //     {
        //       bet: "0.00",
        //       pay: "50.00",
        //       userName: "yao1004",
        //       created_at: 1572679103
        //     },
        //     {
        //       bet: "0.00",
        //       pay: "0.00",
        //       userName: "yao1005",
        //       created_at: 1572679103
        //     }
        //   ]
        // },
        // {
        //   name: "您满足条件三",
        //   ciajin: "88.00",
        //   time: 1572679103,
        //   list: [
        //   ]
        // }
      ]
    };
  },
  created() {
    this.$store
      .dispatch("agency/getInvitation", {
        activityType: "getInvitationDetails"
      })
      .then(res => {
        if (res.code === 200) {
          this.groupList = res.data
          this.groupList.forEach(item => {
            if(item.list.length > 0) {
              this.$set(item,"showList", true)
            }else {
              this.$set(item,"showList", false)
            }
          })
          this.showPage = true
        }
      });
  },
  watch: {},
  methods: {
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    format(shijianchuo) {
      let time = new Date(shijianchuo * 1000);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      let h = time.getHours();
      let mm = time.getMinutes();
      let s = time.getSeconds();
      return (
        y +
        "-" +
        this.add0(m) +
        "-" +
        this.add0(d) +
        " " +
        this.add0(h) +
        ":" +
        this.add0(mm) +
        ":" +
        this.add0(s)
      );
    },
    openKF() {
      const link = this.getKF();
      if (link) {
        window.tryOpen(link);
      } else {
        this.toastText("暂无客服", "middle");
      }
    }
  },
  computed: {
    noDataImg(){
      if(this.$config.blackTheme || this.$config.newQP) {
        return require('@src/assets/img/yellow.png')
      } else if (this.$config.blush) {
        return require('@src/assets/img/blush.png')
      }else if (this.targetTheme && this.targetTheme['code']) {
        let  matchResult = this.targetTheme['code']
        return require(`@src/assets/img/${matchResult}.png`)
      } else {
        return require('@src/assets/img/no-data.png')
      }
    },
  },
  beforeDestroy() {},
  components: {}
};
</script>

<style lang="less" type='text/less' scoped>
@keyframes maxHeight100 {
  0% {
    max-height: 0px;
  }
  100% {
    max-height: 999px;
  }
}
@keyframes maxHeight0 {
  0% {
    max-height: 999px;
  }
  100% {
    max-height: 0px;
  }
}
.header-right {
  position: absolute;
  right: 0.24rem;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.32rem;
}
.content {
  font-family: PingFang-SC-Medium;
  .listArea {
    .listInfo {
      overflow: hidden;
      background-color: #fff;
      min-height: 1.2rem;
      border-bottom: 1px solid #f6f6f8;
      text-align: left;
      .listHeader {
        padding: 0 0.3rem;
        position: relative;
        height: 1.2rem;
        overflow: hidden;
        .leftArea {
          float: left;
          .title {
            color: #424242;
            font-size: 0.34rem;
            margin-top: 0.2rem;
          }
          .time {
            color: #aaaaaa;
            font-size: 0.26rem;
          }
        }
        .rightArea {
          float: right;
          margin-right: 0.45rem;
          .money {
            color: #ff2200;
            font-size: 0.34rem;
            margin-top: 0.2rem;
          }
          .text {
            color: #aaaaaa;
            font-size: 0.26rem;
          }
        }
        .iconfont {
          position: absolute;
          right: 0.15rem;
          top: 50%;
          font-size: 0.45rem;
          color: #aaaaaa;
          transition: all .1s linear;
          &.up{
            transform: translateY(-50%) rotate(0deg);
          }
          &.down {
            transform: translateY(-50%) rotate(90deg)
          }
        }
      }
      .listCont {
        background-color: #F6F6F8;
        color: #333333;
        font-size: .28rem;
        overflow: hidden;
        max-height: 0px;
        &.up {
          animation: maxHeight0 .2s linear forwards;
          height: auto;
        }
        &.down {
          animation: maxHeight100 .2s linear forwards;
          height: auto;
        }
        ul {
          li {
            display: flex;
            border-bottom: 1px solid #edeaea;
            height: .76rem;
            line-height: .76rem;
            justify-content: center;
            .sec {
              flex: 1;
              text-align: center;
            }
          }
        }
      }
    }
    .noList {
      line-height: 1rem;
      color: #777;
      font-size: 0.28rem;
    }
  }
}
</style>