<template>
  <view-page class="agency-center" full-box>
    <div class="head" slot="header">
      <title-header title="代理中心"></title-header>
    </div>
    <div slot="header-static">
      <img src="../../../assets/img/agent/agency-index.png" alt="" class="head-img"/>
      <van-cell-group>
        <van-cell is-link to="/user/agent/income">
          <div class="cell-box title-box">
            <p class="flex-1 text">今日收益<span class="money red">{{todayEarnings}}</span>元</p>
            <span class="desc">查看详情</span>
          </div>
        </van-cell>
      </van-cell-group>
    </div>
    <div class="content-slot" slot="content">
      <van-cell-group>
        <van-cell is-link v-for="item in list" :key="item.icon" :to="item.link+'?t='+Date.now()">
          <div class="cell-box">
            <span class="theme-color" :class="'icon iconfont h5-icon-' + item.icon"></span>
            <div class="flex-1">
              <p class="title">{{item.title}}</p>
              <p class="desc">{{item.desc}}</p>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'AgencyCenter',
  data () {
    return {
      todayEarnings: 0,
      headerHeight: 0,
      list: [
        {
          title: '代理报表',
          desc: '代理总报表',
          icon: 'daili-list',
          link: '/user/agent/report'
        },
        {
          title: '下级开户',
          desc: '为下级建立帐号',
          icon: 'open-account1',
          link: '/user/agent/open'
        },
        {
          title: '下级列表',
          desc: '查询下级列表',
          icon: 'member-list',
          link: '/user/agent/list'
        },
        {
          title: '下级财务',
          desc: '查询下级资金明细',
          icon: 'money-list1',
          link: '/user/agent/finance'
        },
        {
          title: '下级报表',
          desc: '下级代理和会员详细报表',
          icon: 'level-form1',
          link: '/user/agent/lower-report'
        },
        {
          title: '下级人数',
          desc: '下级会员人数',
          icon: 'level-number1',
          link: '/user/agent/lower-count'
        }
      ]
    }
  },
  created () {
    if (this.personalMode !== 'mode_b') {
      this.list.push(
        {
          title: '赔率计算',
          desc: '下级返点赔率计算',
          icon: 'Cal-odds',
          link: '/user/agent/odds'
        }
      )
    }
  },
  mounted () {
    localStorage['agentOpenIndex'] = ''
    this.$store.dispatch('agent/todayEarnings').then(res => {
      if (res.code === 200) {
        this.todayEarnings = res.data.money
      }
    })
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .agency-center {
    .head {
      width: 100%;
    }

    .head-img {
      width: 100%;
      display: block;
      height: 2.4rem;
    }

    /deep/ .van-cell {
      padding: 0.1rem 0.24rem;
    }

    .cell-box {
      width: 100%;
      box-sizing: border-box;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 1rem;

      &.title-box {
        height: 0.8rem;

        .desc {
          font-size: 0.3rem !important;
        }
      }

      .flex-1 {
        flex: 1;
      }

      .text {
        font-size: 0.349rem;
        color: #424242;
        text-align: left;
      }

      .desc {
        font-size: 0.26rem;
        color: #aaaaaa;
        margin-right: 0.12rem;
        line-height: 0.26rem;
      }

      .red {
        color: #ff2200;
      }

      .money {
        padding: 0 0.12rem;
      }

      .icon {
        font-size: 0.76rem;
        margin-right: 0.24rem;
      }

      .title {
        font-size: 0.349rem;
        line-height: 0.349rem;
        color: #424242;
        margin-bottom: 0.18rem;
      }
    }
  }
</style>
