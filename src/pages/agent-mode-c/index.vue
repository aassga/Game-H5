<template>
  <view-page class="agent-center-modec" full-box>
    <div slot="static" class="theme-agent-bg" :style="headerStyle"></div>
    <div class="header" slot="header">
      <title-header
        class="title"
        style="background-color: rgba(0,0,0,0) !important;"
        backEvent
        @back="$router.push('/user')"
        title="代理中心"
      ></title-header>
    </div>

    <div slot="content" class="content">
      <div class="commission">
        <div class="header-bg"></div>
        <div class="totalMoney">
          <div class="money">
            {{isNaN((Number(agentModecData.directCommission) + Number(agentModecData.rankCommission)).toFixed(2)) ?
            "0.00" :
            (Number(agentModecData.directCommission) + Number(agentModecData.rankCommission)).toFixed(2)}}
          </div>
          <div class="text">昨日总佣金</div>
        </div>
        <div class="branch-line"></div>
        <div class="branch-info">
          <ul>
            <li>
              <div class="money">{{agentModecData.directCommission || "0.00"}}</div>
              <div class="name">昨日直推佣金</div>
            </li>
            <li>
              <div class="money">{{agentModecData.rankCommission || "0.00"}}</div>
              <div class="name">昨日级差佣金</div>
            </li>
          </ul>
          <div class="description">总佣金= 直推佣金 + 级差佣金</div>
        </div>
        <div class="collar-group">
          <div class="collar-left collar-item">
            <div class="money">{{agentModecData.allCommission || "0.00"}}</div>
            <div class="text">历史总佣金</div>
            <router-link class="btn" to="/user/agency-center-modec/receiv">领取记录</router-link>
          </div>
          <div class="collar-right collar-item">
            <div class="money">{{agentModecData.agencyBalance || "0.00"}}</div>
            <div class="text">可领取佣金</div>
            <router-link class="btn" to="/user/agency-center-new/take">领取佣金</router-link>
          </div>
        </div>
      </div>
      <div class="view-cont">
        <div class="my-team">
          <div class="tit">我的团队</div>
          <div class="cont">
            <ul>
              <li>
                <div class="num">{{agentModecData.allPeopleCount || "0"}}</div>
                <div class="info">团队总数</div>
              </li>
              <li>
                <div class="num">{{agentModecData.yestodayNewPeopleCount || "0"}}</div>
                <div class="info">昨日新增</div>
              </li>
              <li>
                <div class="num">{{agentModecData.thisMothNewPeopleCount || "0"}}</div>
                <div class="info">本月新增</div>
              </li>
              <li>
                <div class="num">{{agentModecData.agencyPeopleCount || "0"}}</div>
                <div class="info">直属会员</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="link-group">
          <ul>
            <li>
              <router-link to="/user/agency-center-modec/performance">
                <i class="icon iconfont h5-icon-yejichaxun iconColor"></i>
                <div class="text">业绩查询</div>
              </router-link>
            </li>
            <!-- <li>
              <router-link to="/user/agency-center-modec/xm-inquire">
                <i class="icon iconfont h5-icon-ximachaxun iconColor"></i>
                <div class="text">洗码查询</div>
              </router-link>
            </li> -->
            <li>
              <router-link to="/user/agency-center-modec/team">
                <i class="icon iconfont h5-icon-dailizhongxinshouye-icon-dailibaobiao iconColor"></i>
                <div class="text">我的团队</div>
              </router-link>
            </li>
            <li>
              <router-link to="/user/agency-center-modec/desc">
                <i class="icon iconfont icon-tuiguangjiaocheng iconColor"></i>
                <div class="text">推广教程</div>
              </router-link>
            </li>
            <li>
              <router-link to="/user/agency-center-modec/performance/proportion">
                <i class="icon iconfont icon-fanyongbili iconColor"></i>
                <div class="text">返佣比例</div>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="invite">
          <span class="text">推荐好友赚取丰厚佣金，好运齐分享哦</span>
          <span class="invite-btn" @click="$refs.agentDes.show = true">
            <i class="icon iconfont h5-icon-fenxiang"></i>
            分享
          </span>
        </div>
      </div>
    </div>
    <div slot="static">
      <Agent-description ref="agentDes" :agencyCode="agentModecData.agencyCode"></Agent-description>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import AgentDescription from "./components/agent-description/AgentDescription";
export default {
  name: "AgentModeC",
  data() {
    return {
      agentModecData: {},
    };
  },
  computed: {
    headerStyle() {
      return {
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        height: "8.17rem",
        zIndex: "-1"
      };
    }
  },
  created() {
    //获取首页信息
    this.$store.dispatch("agentModec/agencyPaidToPromoteModeC");
    if (JSON.stringify(this.$store.state.agentModec.agentModecData) !== {}) {
      this.agentModecData = this.$store.state.agentModec.agentModecData;
    }
  },
  methods: {},
  components: {
    AgentDescription
  },
  watch: {
    "$store.state.agentModec.agentModecData"(newVal) {
      this.agentModecData = newVal;
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
.agent-center-modec {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f6f6f6;
  font-size: 0.3rem;
  font-weight: 500;
  line-height: 0.42rem;
  font-family: PingFang-SC-Bold, PingFang-SC;
  .content {
    position: relative;
    z-index: 500;
    .commission {
      position: relative;
      height: 3.95rem;
      width: 100%;
      overflow: visible;
      padding-top: 0.25rem;
      .header-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 4.97rem;
        background: url("../../assets/img/agent-center-modec/index/header-bg.png")
          no-repeat 0 0;
        background-size: 100%;
        z-index: -1;
      }

      .branch-line {
        position: absolute;
        left: 50%;
        top: 1.35rem;
        margin-left: -2.73rem;
        width: 5.46rem;
        height: 0.96rem;
        background: url("../../assets/img/agent-center-modec/index/branch-line.png")
          no-repeat 0 0;
        background-size: 100%;
      }
      .branch-info {
        padding: 0 0.2rem;
        margin-top: 0.46rem;
        ul {
          width: 100%;
          display: flex;
          li {
            flex: 1;
            .money {
              height: 0.56rem;
              line-height: 0.56rem;
              font-size: 0.4rem;
              font-weight: 500;
              color: #444444;
            }
            .name {
              width: 1.92rem;
              height: 0.52rem;
              line-height: 0.52rem;
              border: 0.01rem solid #bbbbbb;
              border-radius: 0.05rem;
              text-align: center;
              color: #666666;
              font-size: 0.28rem;
              margin: 0.08rem auto 0;
              font-weight: 500;
            }
          }
        }
        .description {
          margin-top: 0.32rem;
          color: #c89457;
          font-size: 0.3rem;
          font-weight: 500;
        }
      }
      .collar-group {
        overflow: hidden;
        margin-top: 1.1rem;
        .collar-item {
          font-weight: 500;
          .money {
            height: 0.7rem;
            line-height: 0.7rem;
            font-size: 0.5rem;
            color: #ffe0b9;
          }
          .text {
            font-size: 0.28rem;
            color: #fff;
          }
          .btn {
            display: block;
            width: 2rem;
            height: 0.72rem;
            line-height: 0.72rem;
            background: linear-gradient(180deg, #fff6ea 0%, #ffd3a0 100%);
            box-shadow: 0 -0.01rem 0.05rem 0 rgba(218, 162, 94, 1);
            border-radius: 0.08rem;
            margin-top: 0.16rem;
            font-size: 0.3rem;
            color: #a47033;
          }
        }
        .collar-left {
          float: left;
          margin-left: 0.8rem;
        }
        .collar-right {
          float: right;
          margin-right: 0.8rem;
        }
      }
      .totalMoney {
        .money {
          font-size: 0.5rem;
          height: 0.7rem;
          line-height: 0.7rem;
          font-weight: bold;
          color: #e71414;
          text-align: center;
        }
        .text {
          color: #333333;
          font-size: 0.3rem;
          font-weight: 500;
        }
      }
    }
    .view-cont {
      margin-top: 3.3rem;
      width: 100%;
      padding: 0.24rem 0.16rem 0.57rem;
      background-color: #f5f5f5;
      .my-team {
        width: 100%;
        height: 2.43rem;
        background-color: #fff;
        box-shadow: 0px 0.05rem 0.05rem 0px rgba(0, 0, 0, 0.03);
        border-radius: 0.1rem;
        .tit {
          margin: 0 0.24rem;
          height: 0.89rem;
          line-height: 0.89rem;
          color: #444444;
          font-size: 0.32rem;
          font-weight: bold;
          border-bottom: 1px solid #f3f3f3;
          text-align: left;
        }
        .cont {
          ul {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 1.53rem;
            li {
              flex: 1;
              color: #111111;
              font-weight: 500;
              .num {
                height: 0.45rem;
                line-height: 0.45rem;
                margin-top: 0.24rem;
                font-size: 0.32rem;
              }
              .info {
                height: 0.4rem;
                line-height: 0.4rem;
                margin-top: 0.04rem;
                color: #444444;
                font-size: 0.28rem;
              }
            }
          }
        }
      }
      .link-group {
        width: 100%;
        height: 1.85rem;
        background-color: #fff;
        box-shadow: 0px 0.05rem 0.05rem 0px rgba(0, 0, 0, 0.03);
        border-radius: 0.1rem;
        margin-top: 0.24rem;
        ul {
          display: flex;
          flex-direction: row;
          width: 100%;
          height: 100%;
          li {
            flex: 1;
            font-weight: 500;
            padding-top: 0.4rem;
            .iconfont {
              font-size: 0.4rem;
            }
            .text {
              color: #444444;
              font-size: 0.3rem;
              font-weight: 500;
              margin-top: 0.19rem;
            }
          }
        }
      }
      .invite {
        width: 100%;
        height: 0.88rem;
        line-height: 0.88rem;
        background-color: #fff0e6;
        border-radius: 0.1rem;
        text-align: left;
        margin-top: 0.4rem;
        .text {
          padding-left: 0.24rem;
          color: #ff7c5b;
          font-size: 0.28rem;
          font-weight: 400;
        }
        .invite-btn {
          display: inline-block;
          width: 1.4rem;
          height: 0.56rem;
          line-height: 0.56rem;
          color: #fff;
          background-color: #ff9955;
          border-radius: 0.28rem;
          text-align: center;
          font-size: 0.28rem;
          margin-left: 0.32rem;
          .iconfont {
            font-size: 0.28rem;
          }
        }
      }
    }
  }
}
</style>
