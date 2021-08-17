<template>
  <div class="container">
    <div class="lottertList">
      <div class="marquee">
        <vux-marquee style="height:.54rem" class="marquee-scroll">
          <vux-marquee-item v-for="item in marqueeList" :key="item" class="align-middle">{{item}}</vux-marquee-item>
        </vux-marquee>
      </div>
      <div class="moneyList">
        <img src="@src/assets/img/invite/moneyList1.png" class="img1" />
        <img src="@src/assets/img/invite/moneyList2.png" class="img2" />
        <img src="@src/assets/img/invite/moneyList3.png" class="img3" />
        <img src="@src/assets/img/invite/moneyList4.png" class="img4" />
      </div>
      <p class="moneyListText">满6人可以申请代理&nbsp;&nbsp;赚取更多佣金</p>
      <p class="invitaText">您的邀请码</p>
      <p
        class="invitaCode"
        v-if="$store.state.agency.intiviData"
      >{{$store.state.agency.intiviData.code}}</p>
    </div>
    <router-link to="/user/invite-share/member" class="shareInvita btn">
      <img src="@src/assets/img/invite/icon-share.png" class="img" />
      分享邀请
    </router-link>
    <div class="copyLink btn" @click="onCopy">
      <img src="@src/assets/img/invite/icon-copy.png" class="img" />
      复制邀请链接
    </div>
    <div class="titleArea">
      <img src="@src/assets/img/invite/agencyTitleIcon.png" alt />
      活动内容
      <img src="@src/assets/img/invite/agencyTitleIcon.png" alt />
    </div>
    <div class="activityArea">
      <div class="activitytitle">达到条件即可获得相应奖励</div>
      <div class="activityInfo">
        <table class="table">
          <thead>
            <tr>
              <th>条件</th>
              <th>有效会员</th>
              <th>累计存款</th>
              <th>打码倍数</th>
              <th>可获奖励</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>一</td>
              <td>2</td>
              <td>3000</td>
              <td>3倍</td>
              <td>38</td>
            </tr>
            <tr>
              <td>二</td>
              <td>3</td>
              <td>5000</td>
              <td>3倍</td>
              <td>58</td>
            </tr>
            <tr>
              <td>三</td>
              <td>5</td>
              <td>6000</td>
              <td>3倍</td>
              <td>88</td>
            </tr>
            <tr>
              <td>四</td>
              <td>6</td>
              <td>10000</td>
              <td>3倍</td>
              <td>188</td>
            </tr>
          </tbody>
        </table>
        <p class="activityText activityText1">
          <img src="@src/assets/img/invite/symbolIcon.png" />达到每一条件均可领取一次，请联系在线客服申请
        </p>
        <p class="activityText activityText2">
          <img src="@src/assets/img/invite/symbolIcon.png" />达到条件四，既可获得彩金同时又可申请晋身代理
        </p>
      </div>
    </div>
    <div class="titleArea">
      <img src="@src/assets/img/invite/agencyTitleIcon.png" alt />
      简单三步&nbsp;&nbsp;立得奖励
      <img src="@src/assets/img/invite/agencyTitleIcon.png" alt />
    </div>
    <div class="threeStep">
      <div class="rowLine1 rowLine"></div>
      <div class="rowLine2 rowLine"></div>
      <div class="step">
        <div class="num">1</div>
        <p>分享二维码</p>
        <p>链接给好友</p>
      </div>
      <div class="step">
        <div class="num">2</div>
        <p>好友注册</p>
        <p>达到活动要求</p>
      </div>
      <div class="step">
        <div class="num">3</div>
        <p>获得奖励</p>
      </div>
    </div>
    <router-link to="/user/invite/member/member-list">
      <img src="@src/assets/img/invite/member-btn.png" class="bottomBtn" alt="好友列表">
    </router-link>
  </div>
</template>

<script>
export default {
  props: {},
  name: "member",
  data() {
    return {
      marqueeList: [
        "超过1,000,00+人成为代理",
        "好友越多  你赚越多",
        "代理身份拥有更多特权",
        "佣金实时到账",
        "业界赔率最高",
      ]
    };
  },
  methods: {
    onCopy() {
      if (this.$store.state.agency.intiviData) {
        this.$copyText(this.$store.state.agency.intiviData.domain).then(
          e => {
            this.toastText("复制成功", "top");
          },
          e => {
            this.toastText("请手动复制或使用其他浏览器尝试", "top");
          }
        );
      } else {
        this.toastText("无可复制内容", "top");
      }
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
  created() {},
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  background-image: url("../../../../assets/img/invite/oldMemberBg.jpg");
  background-size: cover;
  overflow: hidden;
  font-size: 0.32rem;
  padding: 0 0.3rem 0.3rem;
  .lottertList {
    position: relative;
    margin-top: 4rem;
    width: 100%;
    height: 4.82rem;
    background-color: #fff;
    border-radius: 0.15rem;
    color: #555555;
    text-align: center;
    .marquee {
      position: absolute;
      top: -.38rem;
      left: 50%;
      transform: translateX(-50%);
      width: 4.5rem;
      height: 0.77rem;
      line-height: 0.77rem;
      background-image: url("../../../../assets/img/invite/lotteryTopBg.png");
      background-size: contain;
      text-align: center;
      color: #fc1a1a;
      font-size: 0.28rem;
      z-index: 2;
      .marquee-scroll {
        margin-top: .1rem;
        .align-middle {
          height: 0.54rem;
          line-height: .54rem;
          width: 100%;
          overflow: hidden;
        }
      }
    }
    .moneyList {
      position: relative;
      width: 100%;
      height: 3.2rem;
      padding-top: 0.5rem;
      & > img {
        position: absolute;
      }
      .img1 {
        width: 2.5rem;
        height: 2.76rem;
        left: 0.4rem;
        z-index: 4;
      }
      .img2 {
        width: 2.32rem;
        height: 2.56rem;
        z-index: 3;
        left: 2rem;
        top: 0.62rem;
      }
      .img3 {
        width: 2.14rem;
        height: 2.38rem;
        z-index: 2;
        left: 3.4rem;
        top: 0.73rem;
      }
      .img4 {
        width: 2rem;
        height: 2.2rem;
        z-index: 1;
        left: 4.7rem;
        top: 0.8rem;
      }
    }
    .moneyListText {
      margin-top: .3rem;
      font-size: 0.28rem;
      color: #555555;
    }
    .invitaText {
      position: absolute;
      bottom: 0.32rem;
      left: 1.48rem;
      color: #555555;
      font-size: 0.32rem;
    }
    .invitaCode {
       position: absolute;
      bottom: 0.23rem;
      left: 3.3rem;
      font-size: 0.56rem;
      font-weight: bold;
      color: #EA6834;
      letter-spacing: .02rem;
    }
  }
  .btn {
    display: block;
    width: 100%;
    height: 1.03rem;
    line-height: 1.03rem;
    color: #c4561e;
    font-size: 0.36rem;
    font-weight: bold;
    background: linear-gradient(
      0deg,
      rgba(232, 178, 92, 1),
      rgba(255, 241, 183, 1)
    );
    border-radius: 0.48rem;
    &.shareInvita {
      margin-top: 0.5rem;
      .img {
        width: 0.36rem;
        height: 0.36rem;
        vertical-align: middle;
      }
    }
    &.copyLink {
      margin-top: 0.4rem;
      .img {
        width: 0.41rem;
        height: 0.4rem;
        vertical-align: middle;
      }
    }
  }
  .titleArea {
    width: 100%;
    height: 0.7rem;
    line-height: 0.7rem;
    margin-top: 0.5rem;
    margin-bottom: 0.2rem;
    color: #fff;
    text-align: center;
    font-size: 0.36rem;
    img {
      width: 0.36rem;
      height: 0.27rem;
      vertical-align: middle;
    }
  }
  .activityArea {
    width: 100%;
    height: 6.5rem;
    border-radius: 0.15rem;
    background-color: #fff;
    text-align: center;
    overflow: hidden;
    padding: 0 0.25rem;
    .activitytitle {
      color: #ea6834;
      font-size: 0.32rem;
      margin: 0.2rem 0;
      font-weight: bold;
    }
    .activityInfo {
      font-size: 0.28rem;
      .table {
        width: 100%;
        border: 1px solid rgba(255, 220, 189, 1);
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 0.15rem;
        overflow: hidden;
        thead {
          th {
            height: 0.72rem;
            line-height: 0.72rem;
            background-color: rgba(255, 240, 229, 1);
            border-right: 1px solid rgba(255, 220, 189, 1);
            border-bottom: 1px solid rgba(255, 220, 189, 1);
            &:last-child {
              border-right: none;
            }
          }
        }
        tbody {
          tr {
            td {
              height: 0.72rem;
              line-height: 0.72rem;
              background: #fff9f3;
              border-right: 1px solid rgba(255, 220, 189, 1);
              border-bottom: 1px solid rgba(255, 220, 189, 1);
              &:last-child {
                border-right: none;
              }
            }
            &:last-child {
              td {
                border-bottom: none;
              }
            }
          }
        }
      }
      .activityText {
        color: #888888;
        font-size: 0.28rem;
        img {
          width: 0.18rem;
          width: 0.19rem;
        }
        &.activityText1 {
          margin-top: 0.6rem;
        }
        &.activityText2 {
          margin-top: 0.2rem;
        }
      }
    }
  }
  .threeStep {
    position: relative;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 2.08rem;
    background-color: #fff;
    border-radius: 0.15rem;
    color: #555555;
    font-size: 0.28rem;
    text-align: center;
    .rowLine {
      position: absolute;
      width: 1.88rem;
      height: 0.02rem;
      background-color: #ffdcbd;
    }
    .rowLine1 {
      top: 0.49rem;
      left: 1.349rem;
    }
    .rowLine2 {
      top: 0.49rem;
      right: 1.349rem;
    }
    .step {
      flex: 1;
      .num {
        margin: 0.3rem auto;
        color: #fff;
        width: 0.42rem;
        height: 0.42rem;
        line-height: .42rem;
        background-color: #ea6834;
        border-radius: 50%;
        z-index: 1;
      }
      &:last-child {
        p {
          line-height: 0.65rem;
        }
      }
    }
  }
  .bottomBtn {
    display: block;
    width: 4.38rem;
    height: 1.02rem;
    margin: .57rem auto .47rem;
  }
}
</style>