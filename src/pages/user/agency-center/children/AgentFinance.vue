<template>
  <view-page class="record" full-box load-more ref="view-page"
             @load-top="onPullingDown" @load-down="onPullingUp"
             @scroll-height-change="scrollHeight=$event">
    <title-header title="下级财务" slot="header"></title-header>
    <div class="record-header" slot="header-static">
      <div style="width: 100%;height: 0.2rem"></div>
      <date-interval v-model="dateIndex"></date-interval>
      <div style="width: 100%;height: 0.2rem"></div>
      <van-tabs v-model="tabIndex" class="record-tab" :line-height="2">
        <van-tab v-for="item in tabs" :key="item" :title="item"></van-tab>
      </van-tabs>
      <div style="width: 100%;height: 0.2rem"></div>
      <ul class="row clear-fix title" v-if="tabIndex===0">
        <li class="col f-l col-4">会员</li>
        <li class="col f-l col-4">类型</li>
        <li class="col f-l col-4">状态</li>
        <li class="col f-l col-4">金额</li>
      </ul>
      <ul class="row clear-fix title" v-else-if="tabIndex===3">
        <li class="col f-l col-3">优惠名称</li>
        <li class="col f-l col-3">状态</li>
        <li class="col f-l col-3">金额</li>
      </ul>
      <ul class="row clear-fix title" v-else>
        <li class="col f-l col-3">会员</li>
        <li class="col f-l col-3">状态</li>
        <li class="col f-l col-3">金额</li>
      </ul>
    </div>

    <van-tabs v-model="tabIndex" class="content-slot no-tab" slot="content" animated swipeable>
      <van-tab class="list" :style="{minHeight:scrollHeight+'px'}">
        <div class="list-empty" v-show="list[0]&&noMore[0]&&!loading[0]">
          <div class="img"></div>
          <p class="info">暂无数据</p>
        </div>
        <ul class="row clear-fix" v-for="(item, i) in list[0]" :key="'item-'+i">
          <li class="col f-l col-4">{{item['username']}}</li>
          <li class="col f-l col-4">{{item['subType']}}</li>
          <li class="col f-l col-4 ok">{{item['status']==='success'?'成功':'失败'}}</li>
          <li class="col f-l col-4">{{item['amount']}}</li>
        </ul>
      </van-tab>
      <van-tab class="list">
        <div class="list-empty" v-show="list[1]&&noMore[1]&&!loading[1]">
          <div class="img"></div>
          <p class="info">暂无数据</p>
        </div>
        <ul class="row clear-fix" v-for="(item, i) in list[1]" :key="'item-'+i">
          <li class="col f-l col-3">{{item['username']}}</li>
          <li class="col f-l col-3 ok">{{item['status']==='success'?'成功':'失败'}}</li>
          <li class="col f-l col-3">{{item['amount']}}</li>
        </ul>
      </van-tab>
      <van-tab class="list">
        <div class="list-empty" v-show="list[2]&&noMore[2]&&!loading[2]">
          <div class="img"></div>
          <p class="info">暂无数据</p>
        </div>
        <ul class="row clear-fix" v-for="(item, i) in list[2]" :key="'item-'+i">
          <li class="col f-l col-3">{{item['userName']}}</li>
          <li class="col f-l col-3 ok">成功</li>
          <li class="col f-l col-3">{{item['amount']}}</li>
        </ul>
      </van-tab>
      <van-tab class="list">
        <div class="list-empty" v-show="list[3]&&noMore[3]&&!loading[3]">
          <div class="img"></div>
          <p class="info">暂无数据</p>
        </div>
        <ul class="row clear-fix" v-for="(item, i) in list[3]" :key="'item-'+i">
          <li class="col f-l col-3 col-l">{{item['title']}}</li>
          <li class="col f-l col-3 ok">{{item['status']==='success'?'成功':'失败'}}</li>
          <li class="col f-l col-3">{{item['bouns']}}</li>
        </ul>
      </van-tab>
    </van-tabs>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'AgentFinance',
  data () {
    return {
      page: [0, 0, 0, 0],
      limit: 12,
      dateIndex: 0,
      tabs: [
        '存款',
        '取款',
        '返点',
        '优惠'
      ],
      text: {
        withdrawals: '总提现',
        deposit: '总充值',
        bonus: '总优惠',
        agency: '总代理',
        others: '总额'
      },
      tabIndex: 0,
      list: [[], [], [], []],
      animation: 'slide-left',
      loading: [false, false, false, false],
      noMore: [false, false, false, false],
      scrollHeight: 0
    }
  },
  created () {
    if (this.personalMode === 'mode_b') {
      this.tabs = [
        '存款',
        '取款',
        '优惠'
      ]
    }
  },
  mounted () {
    if (!this.$store.state.user.token) {
      this.$router.replace('/admin/login')
    } else {
      this.onPullingDown()
    }
  },
  watch: {
    dateIndex () {
      this.onPullingDown()
    },
    tabIndex (now, old) {
      if (now < old) {
        this.animation = 'slide-right'
      } else {
        this.animation = 'slide-left'
      }
      this.onPullingDown()
    }
  },
  methods: {
    onSwipeLeft () {
      if (this.tabIndex + 1 < this.tabs.length) {
        this.tabIndex++
      }
    },
    onSwipeRight () {
      if (this.tabIndex > 0) {
        this.tabIndex--
      }
    },
    getTime (str) {
      return this.dayJs.unix(str).format('YYYY-MM-DD HH:mm:ss')
    },
    onPullingDown () {
      this.page[this.tabIndex] = 0
      this.loading[this.tabIndex] = false
      this.noMore[this.tabIndex] = false
      this.refreshList(true)
    },
    onPullingUp () {
      this.refreshList()
    },
    refreshList (status) {
      if (this.loading[this.tabIndex]) {

      } else if (this.noMore[this.tabIndex]) {
        this.$refs['view-page'].loaded()
      } else {
        this.$store.state.main.loadingText = '正在获取...'
        this.page[this.tabIndex]++
        this.$store.dispatch('agent/lowerFinance', {
          type: this.tabIndex + 1,
          date: this.dateIndex + 1,
          page: this.page[this.tabIndex],
          limit: this.limit
        }).then(res => {
          this.$refs['view-page'].loaded()
          if (res.code === 200) {
            if (status) {
              this.$set(this.list, this.tabIndex, res.data.data)
            } else {
              const list = this.list[this.tabIndex].concat(res.data.data)
              this.$set(this.list, this.tabIndex, list)
            }
            if (res.data.data.length === 0) {
              this.noMore[this.tabIndex] = true
            }
          } else {
            this.page--
          }
          this.loading[this.tabIndex] = false
          this.$store.state.main.loadingText = ''
        }).catch(() => {
          this.$refs['view-page'].loaded()
          this.page[this.tabIndex]--
          this.loading[this.tabIndex] = false
          this.$store.state.main.loadingText = ''
        })
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .record {
    &-header {
      width: 100%;
    }

    .row {
      width: 100%;
      list-style: none;
      font-size: 0.28rem;
      padding: 0.12rem;
      box-sizing: border-box;
      color: #888888;
      background-color: #fff;

      &.title {
        line-height: 0.64rem;
        border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
      }

      .ok {
        color: #ff2200;
      }

      .col-l {
        text-align: left;
      }

      .col {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.28rem;
        line-height: 0.56rem;
      }

      .col-3 {
        width: 100/3%;
      }

      .col-4 {
        width: 25%;
      }
    }

    .content-body {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .card-title {
      font-size: 0.3rem;
      line-height: 0.76rem;
      margin: 0 0.24rem;
      text-align: left;
      border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
    }

    .card-content, .card-footer {
      width: 100%;
      padding: 0 0.25rem;
      box-sizing: border-box;
      display: flex;
      position: relative;
      justify-content: space-between;
      flex-wrap: nowrap;
      font-size: 0.28rem;
      text-align: left;
      line-height: 0.64rem;
    }

    .card-code {
      color: #333333;
      flex: 1;
    }

    .card-time {
      color: #999999;
      flex: 1;
    }

    .card-status {
      color: #999999;
    }

    .card-amount, .card-status.success {
      color: #ff2200;
    }

    .list-empty {
      width: 100vw;

      .img {
        width: 100vw;
        height: 35.7333333vw;
        background-image: url("../../../../assets/img/no-data.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }

      .info {
        line-height: 1rem;
        color: #777;
        font-size: 0.28rem;
      }
    }

    .footer {
      height: 0.9rem;
      border-top: 0.02rem solid hsla(0, 0%, 95%, 1);
      display: flex;
      padding: 0 0.32rem;
      line-height: 0.9rem;
      align-items: center;
      justify-content: space-between;

      .item {
        font-size: 0.3rem;
        line-height: 0.9rem;
      }
    }
  }
</style>
