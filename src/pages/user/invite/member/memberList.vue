<template>
  <view-page class="view-page" full-box style="background:#fff">
    <title-header slot="header" title="好友列表">
      <span class="header-right" slot="right" @click="openKF">领取奖励</span>
    </title-header>
    <div class="content" slot="content">
      <div v-if="menberList && menberList.length > 0">
        <div class="tit">
          <ul>
            <li>
              <span>会员帐号</span>
              <span>累计存款</span>
              <span>有效投注</span>
            </li>
          </ul>
        </div>
        <div class="list">
          <li v-for="(item,i) in menberList" :key="i">
            <span>{{item.userName}}</span>
            <span>{{item.pay}}</span>
            <span>{{item.bet}}</span>
          </li>
        </div>
        <div class="total">
          <li>
            <span>总计</span>
            <span>{{total.payTotal}}</span>
            <span>{{total.betTotal}}</span>
          </li>
        </div>
      </div>
      <div v-else class="noMore">
        <img style="width: 100%;" :src="noDataImg" />
        <p style="font-size: 0.3rem;color: #666666">暂无邀请好友</p>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "menberList",
  data() {
    return {
      menberList: [],
      total: {}
    };
  },
  created() {
    this.$store
      .dispatch("agency/getInvitation", {
        activityType: "getInvitationDetails"
      })
      .then(res => {
        if (res.code === 200) {
          this.menberList = res.data.list;
          this.total = res.data.total;
        }
      });
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
  }
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
  background-color: #fff;
  padding: 0.16rem 0;
  overflow: hidden;
  color: #333;
  font-size: 0.28rem;
  .tit,
  .total {
    background-color: #f1f1f1;
    font-weight: bold;
  }
  .list {
    li:nth-child(even) {
      background-color: #f9f9f9;
    }
    li:nth-child(odd) {
      background-color: #fff;
    }
  }
  li {
    width: 100%;
    display: flex;
    height: 0.76rem;
    line-height: 0.76rem;
    & > span {
      flex: 1;
    }
  }
  .noMore {
    margin-top: 1.5rem;
  }
}
</style>