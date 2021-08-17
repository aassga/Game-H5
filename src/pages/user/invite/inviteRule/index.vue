<template>
  <view-page class="view-page theme-header-bg" full-box>
    <title-header slot="header" title="活动规则" class="theme-main-bg theme-header-bottom" v-if="!isApp">
      <span class="header-right" slot="right" @click="openKF">联系客服</span>
    </title-header>
    <div class="content theme-main-bg-5 theme-color-white" slot="content">
      <template v-if="$config.newInvite">
        <p>
          1. 会员邀请好友注册，好友晋升金管家等级的同时，在当月内，会员达相应等级存款打码要求，即可进行奖励发放，如当月无达到要求，下月清零，重新开始累积存款打码（打码不区分类型，需满足等级打码要求，并按照会员的实际存款乘以倍数进行计算）。
        </p>
        <p>2. 每一游戏类型，每一等级均可发放一次。</p>
        <p>3. 邀请者奖励={{classList}}。</p>
        <p>4. 金管家等级由各游戏类型的累积有效打码进行计算，如视讯等级只计算视讯的累积有效打码。</p>
        <p>
          5. 当邀请的好友晋升多级，邀请者当月要拿到每一级别
          邀请奖励只需当月累计达到最高级别的存款打码要求，
          即可获得每一级别奖励。
        </p>
        <p>
          例:1等级邀请者存款要求10，打码量存款的2倍为20，
          <br>
          &nbsp;&nbsp;&nbsp;&nbsp;2等级邀请者存款要求30，打码量存款的3倍为90，
          <br>
          &nbsp;&nbsp;&nbsp;&nbsp;如需拿到1，2等级礼金，则当月内需达到总存款30，
          <br>
          &nbsp;&nbsp;&nbsp;&nbsp;打码量根据会员实际存款倍数计算。
        </p>
        <p>
          (1)当会员当月存款30，打码量需达到90，可同时获得1,
          2等级礼金
          <br>
          (2)当会员当月存款31，打码量需达到93，可同时获得1,
          2等级礼金
          <br>
          (3)当会员当月存款31，打码量只达到了90，不满足3倍
          存款要求，则只可获得1等级礼金，要想拿到2等级礼金,
          下月重新开始计算存款打码，达到存款30，打码达到实
          际存款的3倍，即可获得2等级礼金
        </p>
        <p>
          6. 发放时间：系统自动发放，达到好友金管家等级存款
          打码要求即可进行发放。
        </p>
        <p>
          7. 会员晋升为代理后，可继续获得之前邀请好友奖励，
          发展下级后同时可获得下级返佣。
        </p>
        <p>
          8. 无论是个人或团体，如有任何威胁、滥用或使用不诚
          实方式套利的行为系统将自动拉入优惠黑名单将不能参
          与所有优惠，并取消该团队或个人优惠金额盈利金额，
          只保留本金。
        </p>
        <p>9. 同一玩家冒充好友注册将不符合申请礼金/代理条件。</p>
        <p>
          10. 玩家晋升为代理后如发现有团体进行对打行为，我
          司将有权收回代理资格。
        </p>
        <p>
          11.{{$config.setName}}将保留对活动的最终解释权，且在任何
          情况下可随时更改、停止、取消该优惠权利，谢谢！
        </p>
      </template>
      <template v-else>
        <p>1.达到领取奖励条件请联系在线客服申请，每一条件均可领取一次</p>
        <p>2.有效会员达到6人≥6人请联系在线客服申请代理</p>
        <p>3.同一玩家冒充好友注册将不符合申请礼金/代理条件</p>
        <p>4.玩家晋升为代理后如发现有团体进行对打行为，我司将有权收回代理资格</p>
        <p>5. 无论个人或团体，如有任何威胁、滥用或使用不诚实方式套利的行为系统将自动拉入优惠黑名单将不能参与所有优惠，并取消团队或个人优惠金额盈利金额，只保留本金</p>
        <p>6. {{$config.setName}}将保留对活动的最终解释权，且在任何情况下可随时更改、停止、取消该优惠权利，谢谢！</p>
      </template>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "inviteRule",
  data() {
    return {
      classList: []
    };
  },
  created() {
    this.getClassList();
  },
  watch: {},
  methods: {
    openKF() {
      const link = this.getKF();
      if (link) {
        window.tryOpen(link);
      } else {
        this.toastText("暂无客服", "middle");
      }
    },
    getClassList() {
      let classListSess = JSON.parse(sessionStorage.getItem("classList"));
      if (classListSess) {
        classListSess.forEach(item => {
          this.classList.push(item.class_name + "奖励");
        });
        this.classList = this.classList.join("+");
      }
      this.$store
        .dispatch("agency/getInvitation", {
          activityType: "XinJinGuanJiaClass"
        })
        .then(res => {
          if (res.code === 200 && res.data.length) {
            sessionStorage.setItem("classList", JSON.stringify(res.data));
            let list = [];
            res.data.forEach(item => {
              list.push(item.class_name + "奖励");
            });
            this.classList = list.join("+");
          }
        });
    }
  },
  beforeDestroy() {}
};
</script>

<style lang="less" type='text/less' scoped>
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
  color: #444444;
  font-size: 0.28rem;
  line-height: 0.44rem;
  text-align: left;
  margin-top: 0.25rem;
  background-color: #fff;
  padding: 0.25rem 0.3rem;
  p {
    margin-top: 0.25rem;
    &:first-child {
      margin-top: 0;
    }
  }
}
</style>