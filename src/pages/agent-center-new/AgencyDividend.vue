<template>
  <view-page :class="['dividend theme-header-bg',{'black-dividend' : $config.blackTheme || $config.newQP}]" ref="view-page" full-box>
    <div slot="static" class="header-bg"></div>

    <div class="header" slot="header">
      <title-header class="title theme-color-black" style="background-color: rgba(0,0,0,0) !important;" title="领取分红"></title-header>
    </div>

    <div slot="header-static" class="header-info">
      <p class="date theme-color-black">
        {{dayJs().set('date', 1).subtract(1, 'M').format('M月D日')}}-{{dayJs().set('date', 1).subtract(1, 'd').format('M月D日')}}分红
      </p>
      <p class="money theme-color-red">{{money||0.00}}</p>
      <router-link tag="a" class="link theme-color-gray-2" to="/user/agency-center-new/take"><span>已存入佣金，可直接提现</span><i class="van-icon van-icon-arrow"></i></router-link>

      <p class="title theme-color-white">分红记录</p>
    </div>

    <ul class="content-list" slot="content">
      <li v-for="(item, i) in list" :key="i">
        <van-divider v-if="item.year" class="theme-color-white">{{item.year}}年</van-divider>
        <div class="view-box theme-main-bg-5" v-else>
          <p class="top theme-border-color">
            <span class="title theme-color-white">{{dayJs.unix(item['data_date']).month()+1}}月份分红</span>
            <span class="bet">投注:{{123456}}</span>
          </p>
          <ul class="list theme-color-white">
            <li class="col">
              <p class="value" :class="{red:parseFloat(item['profit'])>0,green:parseFloat(item['profit'])<0}">{{item['profit']}}</p>
              <p class="label">平台盈利</p>
            </li>
            <li class="col">
              <p class="value red">{{item['money']}}</p>
              <p class="label">平台分红</p>
            </li>
          </ul>
          <p class="time theme-border-color">{{dayJs.unix(item['addTime']).format('YYYY-MM-DD HH:mm:ss')}}</p>
        </div>
      </li>
    </ul>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'AgencyDividend',
  props: {
    money: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: []
    }
  },
  created () {
    this.$store.dispatch('agency/agencyShareoutbonusList').then(res => {
      if (res && res.code === 200) {
        if (res.data) {
          res.data = [
            {
              'id': 1,
              'profit': '156.50',
              'money': '1.57',
              'data_date': 1559318400,
              'addTime': 1563946428
            },
            {
              'id': 2,
              'profit': '828.00',
              'money': '66.24',
              'data_date': 1559318400,
              'addTime': 1563946428
            },
            {
              'id': 2,
              'profit': '828.00',
              'money': '66.24',
              'data_date': 1546272000,
              'addTime': 1563946428
            },
            {
              'id': 2,
              'profit': '828.00',
              'money': '66.24',
              'data_date': 1514736000,
              'addTime': 1563946428
            }
          ]
          let last
          const list = []
          res.data.forEach(item => {
            const year = this.dayJs.unix(item['data_date']).year()
            if (last && year !== last) list.push({ year })
            list.push(item)
            last = year
          })
          this.list = list
        }
      } else {
        this.toastText(res.message, 'top')
      }
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .dividend {

    /deep/ .van-divider {
      font-size: 0.32rem;
      line-height: 0.45rem;
      font-weight: 500;
      color: #666666;
    }

    /deep/ .auto-box-header-static {
      background-color: rgba(0, 0, 0, 0);
    }

    .header-info {
      padding-top: 0.32rem;

      .date {
        font-size: 0.32rem;
        line-height: 0.45rem;
        background-color: rgba(0, 0, 0, 0);
        color: #FFFFFF;
      }

      .money {
        font-size: 0.54rem;
        line-height: 0.75rem;
        color: #FFF0AE;
        margin-top: 0.3rem;
        font-weight: 500;
      }

      .link {
        font-size: 0.26rem;
        margin-top: 0.2rem;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .title {
        margin-top: 1rem;
        color: #444444;
        font-size: 0.32rem;
        font-weight: 500;
        text-align: left;
        padding: 0 0.2rem;
      }
    }

    .header-bg {
      background: url('../../assets/img/agent-center-new/dividend-header-bg.svg') no-repeat 0 0;
      background-size: 100%;
      height: 4rem;
    }

    .content-list {
      padding-bottom: 0.32rem;
      li:nth-child(1){
        padding-top:0.24rem;
      }
      .view-box {
        margin-top: 0;
        margin-bottom: 0.24rem;
      }

      .top {
        height: 0.9rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 0.02rem solid #E7E7E7;

        .title {
          font-size: 0.32rem;
          color: #444444;
        }

        .bet {
          font-size: 0.26rem;
          color: #999999;
        }
      }

      .list {
        display: flex;
        justify-content: space-between;
        align-items: stretch;

        .col {
          display: block;
          width: 50%;
          padding: 0.3rem 0;

          .value {
            font-size: 0.32rem;
            line-height: 0.45rem;
            color: #444444;
          }

          .red {
            color: #E71414;
          }

          .green {
            color: #00A054;
          }

          .label {
            font-size: 0.28rem;
            line-height: 0.4rem;
            margin-top: 0.04rem;
          }
        }
      }

      .time {
        border-top:0.02rem solid #E7E7E7;
        font-size: 0.24rem;
        display: flex;
        height: 0.66rem;
        justify-content: flex-start;
        align-items: center;
        color: #A3A3A3;
      }
    }
    &.black-dividend {
      .header-bg {
        background: url('../../assets/img/agent-center-new/black-dividend-header-bg.png') no-repeat 0 0;
        background-size: 100%;
      }
    }
  }
</style>
