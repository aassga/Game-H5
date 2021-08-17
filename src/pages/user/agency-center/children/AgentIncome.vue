<template>
  <view-page class="view-page" full-box>
    <div slot="header">
      <title-header title="我的收益"></title-header>
    </div>
    <div slot="header-static">
      <date-interval v-model="dateIndex" :date.sync="date" default></date-interval>
      <ul class="row title clear-fix">
        <li class="col f-l col-time">时间</li>
        <li class="col f-l col-bet">投注额<span v-if="personalMode!=='mode_b'">(直属)</span></li>
        <li class="col f-l col-income">分润额<span v-if="personalMode!=='mode_b'">(直属)</span></li>
      </ul>
    </div>
    <van-tabs v-model="dateIndex" class="content-slot no-tab" slot="content" animated swipeable :lazy-render="false">
      <van-tab v-for="(data, i) in list" :key="i">
        <van-cell v-for="(item, j) in list[i]" :key="item.date+'-'+j" is-link :to="'/user/agent/income/'+item['date']">
          <ul class="row clear-fix">
            <li class="col f-l col-time">
              <p class="date">{{item['date']}}</p>
              <p class="week">星期{{item['week']}}</p>
            </li>
            <li :class="{'col f-l col-bet':true,red:parseFloat(item['allbetAmount'])}">
              {{item['allbetAmount']}}
              <span v-if="personalMode!=='mode_b'">({{item['lowerbetAmount']}})</span>
            </li>
            <li :class="{'col f-l col-income':true,red:parseFloat(item['allnetAmount'])}">
              {{item['allnetAmount']}}
              <span v-if="personalMode!=='mode_b'">({{item['lowerbetAmount']}})</span>
            </li>
          </ul>
        </van-cell>
      </van-tab>
    </van-tabs>
    <div slot="footer">
      <p class="footer">分润额<span class="red"><span class="rmb">¥</span>{{totalAmount}}</span></p>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'AgentIncome',
  data () {
    return {
      dateIndex: 0,
      date: null,
      list: [[], [], [], []],
      totalAmount: '0.00',
      animation: ''
    }
  },
  watch: {
    dateIndex (now, old) {
      this.animation = now > old ? 'slide-left' : 'slide-right'
      this.refreshList()
    }
  },
  created () {
    this.refreshList()
  },
  methods: {
    onSwipeLeft () {
      if (this.dateIndex + 1 < 4) {
        this.dateIndex++
      }
    },
    onSwipeRight () {
      if (this.dateIndex > 0) {
        this.dateIndex--
      }
    },
    refreshList () {
      const index = this.dateIndex
      this.$store.state.main.loadingText = '正在获取...'
      this.$store.dispatch(
        'agent/myEarnings',
        { date: index + 1 }
      ).then(res => {
        if (res.code === 200) {
          this.$set(this.list, index, res.data.list)
          this.totalAmount = res.data['totalnetAmount']
        } else {
          this.toastText('获取列表失败', 'top')
        }
        this.$store.state.main.loadingText = ''
      }).catch(() => {
        this.$store.state.main.loadingText = ''
      })
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .view-page {
    /deep/ .van-cell {
      padding: 0 0.2rem 0 0;
    }

    .title {
      background-color: #fff;
      margin-top: 0.16rem;
      padding-right: 0.6rem;
      border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);

      .col {
        line-height: unset !important;
      }
    }

    .red {
      color: #ff2200 !important
    }

    .row {
      font-size: 0.28rem;
      line-height: 0.56rem;
      width: 100%;

      .col {
        display: block;
        padding: 0;
        margin: 0;
        text-align: center;

        &-time {
          width: 32%;
        }

        &-bet {
          width: 32%;
        }

        &-income {
          width: 32%;
        }
      }
    }

    .footer {
      background-color: #fff;
      left: 0;
      text-align: right;
      font-size: 0.3rem;
      line-height: 0.9rem;
      width: 100%;
      padding: 0 0.24rem;
      box-sizing: border-box;
      z-index: 1000;
      border-top: 0.02rem solid hsla(0, 0%, 95%, 1);

      .red {
        font-size: 0.32rem;
        padding: 0 0.1rem;
      }
    }

    .col {
      color: #888888;

      &-time {
        .date {
          line-height: 0.6rem;
        }

        .week {
          line-height: 0.3rem;
        }
      }

      &-bet {
        line-height: 1rem;
      }

      &-income {
        line-height: 1rem;
      }
    }
  }
</style>
