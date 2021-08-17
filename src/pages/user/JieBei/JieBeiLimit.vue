<template>
  <view-page class="JieBei-enter theme-header-bg" full-box>
    <div class="header" slot="header">
      <title-header slot="header" class="header theme-main-bg theme-header-bottom">
        <span :class="['header-item',{active : headerIndex === 0}]" @click="headerIndex = 0">借呗额度</span>
        <span :class="['header-item',{active : headerIndex === 1}]" @click="headerIndex = 1">借呗规则</span>
      </title-header>
    </div>
    <div class="content-slot" slot="content">
      <div class="limit" v-if="headerIndex === 0">
        <div v-if="list.length">
          <p class="tip theme-yellow-bg-5 theme-color-white">距离下一等级还需{{limitData.next_level_bet}}打码</p> 
          <div class="limit-head theme-main-bg-5 theme-border-color">
            <div class="theme-border-color theme-color-white" v-for="(item,i) in list" :key="i" @click="getLimitData(i)" :class="{'active theme-color-yellow': limitIndex === i}">
              {{item.tab_name}}
            </div>
          </div>
          <div class="limit-list theme-main-bg-5">
            <div class="row theme-border-color theme-color-white">
              <span class="theme-border-color">等级</span>
              <span class="theme-border-color">累积打码</span>
              <span>借款额度</span>
            </div>
            <div class="row theme-border-color theme-color-white" v-for="(item,i) in limitData.list" :key="i">
              <span class="theme-border-color">{{item.level}}级</span>
              <span class="theme-border-color">{{item.betTotal}}</span>
              <span>{{item.jiebei_edu}}</span>
            </div>
          </div>
        </div>
        <div v-else :style="{minHeight:$store.state.main.windowHeight - 0.88 * rem +'px'}">
          <img style="width: 100%;margin-top: 2rem;" :src="noDataImg" alt />
          <p class="theme-color-white" style="font-size: 0.3rem;color: #666666">暂无借呗</p>
        </div>
      </div>
      <div v-else class="rule theme-color-white">
        <p class="tit theme-color-white">借呗规则</p>
        <p>1.<span class="color-red">可借款总额</span>=各借呗类型之和。</p>
        <p>2.各类型借呗等级由各类型的打码决定，投注越多，等级越高，借款额度就越高。如棋牌/电子借呗等级则只计算棋牌/电子的累积有效打码，视讯借呗则只计算视讯的累积有效打码。</p>
        <p>3.<span class="color-red">会员还款时间</span>：最后还款日期为次月3号，超过3号即为逾期。</p>
        <p>例如：在本月1号借款，最后还款日期为次月3号，超过3号即为逾期。</p>
        <p>4.会员还清借款，5分钟后即可再次借款！</p>
        <p>5.会员借款若未还款，则无法再次进行第二次借款！</p>
        <p>6.信用就是价值，价值就是金钱！未还清借款金额则无法帐号交易！</p>
        <p>7.{{$config.setName}}借呗保留对本活动的最终解释权，可随时在无任何告知的情况下停止该活动。</p>
        <p class="tit theme-color-white">逾期还款</p>
        <p class="color-red">1.第一次逾期还款还清借款后一个月内不能借款。</p>
        <p>例如会员A第一次逾期还款： 1月1号借款，2月3号无还清借款，2月4号才还清借款，视为逾期。此时虽然会员A已还清借款但仍然一个月内不能借款，只有到3月4号才能再次借款。</p>
        <p>注：如当月31号还清借款，下月最多只有30号，则下月可在30号进行再次借款。</p>
        <p class="color-red">2.第二次逾期还款还清借款后两个月内不能借款。</p>
        <p>例如会员A第二次逾期还款： 3月4号借款，4月3号无还清借款，4月5号才还清借款，第二次逾期。此时虽然会员A已还清借款但由于是第二次逾期还款，则两个月内不能借款，只有到6月5号才能再次借款。</p>
        <p class="color-red">3.第三次逾期还款还清借款后六个月内不能借款。</p>
        <p>例如会员A第三次逾期还款： 19年6月5号借款，7月3号无还清借款，7月5号才还清借款，第三次逾期。此时虽然会员A已还清借款但由于是第三次逾期还款，则六个月内不能借款，只有到次年20年1月5号才能再次借款。</p>
        <p class="color-red">4.第四次逾期直接取消借呗资格，还清借款后也不可再次借款。</p>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "JieBeiLimit",
  data() {
    return {
      headerIndex:0,
      limitIndex : 0,
      list: [],
      limitData:{},
    };
  },
  created() {
    if (sessionStorage['JiebeiLimit']) {
      this.list = JSON.parse(sessionStorage['JiebeiLimit'])
    }
    this.$store
      .dispatch("user/activityJiebeiEdu")
      .then(res => {
        if (res.code === 200) {
          this.list = res.data
          sessionStorage['JiebeiLimit'] = JSON.stringify(this.list)
          this.getLimitData(this.limitIndex)
        }
      })
      .catch(() => {});
  },
  methods: {
    getLimitData(i) {
      this.limitData = this.list[i]
      this.limitIndex = i
    }
  },
  mounted() {},
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
};
</script>

<style lang="less" type='text/less' scoped>
.header {
  .header-item {
    display: inline-block;
    height: 0.7rem;
    line-height: 0.7rem;
    box-sizing: border-box;
    font-size: 0.34rem;
    &.active {
      border-bottom: 0.04rem solid #FFFFFF;
    }
    &:last-child {
      margin-left: 0.78rem;
    }
  }
}
.content-slot {
  padding: 0;
  overflow: hidden;
  .limit {
    color: #333333;
    font-size: 0.31rem;
    background-color: #fff;
    font-family:Microsoft YaHei;
    .tip {
      height: 0.6rem;
      line-height: 0.6rem;
      color: #6D6D6D;
      font-size: 0.26rem;
      background-color: #EAEFF9;
    }
    .limit-head {
      display: flex;
      text-align: center;
      height: 0.75rem;
      line-height: 0.75rem;
      border-bottom: 0.02rem solid #F5F4F7;
      & > div {
        flex: 1;
        border-right: 0.02rem solid #F5F4F7;
        overflow:hidden; 
        text-overflow:ellipsis; 
        white-space:nowrap;
        font-size: 0.31rem;
        &.active {
          color: #4D8FFA;
        }
      }
      :last-child {
        border-right: none;
      }
    }
    .limit-list {
      .row {
        text-align: center;
        height: 0.75rem;
        line-height: 0.75rem;
        border-bottom: 0.02rem solid #F5F4F7;
        & > span {
          display: inline-block;
          overflow:hidden; 
          text-overflow:ellipsis; 
          white-space:nowrap;
          border-right: 0.02rem solid #F5F4F7;
          font-size: 0.29rem;
        }
        :nth-child(1) {
          width: 27%;
        }
        :nth-child(2) {
          width: 40%;
        }
        :nth-child(3) {
          border-right: none;
          width: 33%;
        }
      }
    }
  }
  .rule {
    font-family:Microsoft YaHei;
    padding: 0.2rem 0.4rem;
    color: #333333;
    font-size: 0.26rem;
    text-align: left;
    line-height: 0.56rem;
    .tit {
      color: #292929;
      font-size: 0.28rem;
      font-weight:800;
    }
    .color-red {
      color: #BC0000;
    }
  }
}
</style>
