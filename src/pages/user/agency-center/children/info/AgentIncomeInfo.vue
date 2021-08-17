<template>
  <view-page class="view-page" full-box load-more ref="view-page"
             @load-top="onPullingDown" @load-down="onPullingUp">
    <div slot="header">
      <title-header :title="date+'收益详情'"></title-header>
    </div>
    <div slot="header-static">
      <ul class="row title clear-fix">
        <li class="col f-l col-time">会员帐号</li>
        <li class="col f-l col-bet">下注详情</li>
        <li class="col f-l col-income">收益</li>
      </ul>
    </div>
    <div class="content-slot" slot="content">
      <ul class="row clear-fix" v-for="(item, i) in list" :key="i">
        <li class="col f-l col-time">{{item['betuname']}}</li>
        <li class="col f-l col-bet">{{item['betmoney']}}</li>
        <li class="col f-l col-income">{{item['givemoney']}}</li>
      </ul>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'AgentIncomeInfo',
  props: {
    date: {
      type: String,
      record: true
    }
  },
  data () {
    return {
      list: [],
      page: 0,
      pageSize: 10,
      noMore: false,
      loading: false
    }
  },
  mounted () {
    this.onPullingDown()
  },
  methods: {
    onPullingDown () {
      this.page = 0
      this.noMore = false
      this.loadList(true)
    },
    onPullingUp () {
      this.loadList()
    },
    loadList (status) {
      if (this.loading) {
        this.toastText('正在获取', 'top')
      } else if (this.noMore) {
        this.toastText('没有更多', 'top')
        this.$refs['view-page'].loaded()
      } else {
        this.$store.state.main.loadingText = '正在加载...'
        this.page++
        this.$store.dispatch(
          'agent/myEarningsSecond',
          {
            date: this.date,
            pageSize: this.pageSize,
            page: this.page
          }
        ).then(res => {
          if (res.code === 200) {
            if (res.data.data.length === 0) {
              this.noMore = true
            }

            if (status) {
              this.list = res.data.data
            } else {
              this.list = this.list.concat(res.data.data)
            }
          } else {
            this.page--
            this.toastText(res.message, 'top')
          }
          this.$store.state.main.loadingText = ''
          this.$refs['view-page'].loaded()
        }).catch(err => {
          this.toastText('获取失败', 'top')
          this.page--
          this.$store.state.main.loadingText = ''
          this.$refs['view-page'].loaded()
        })
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .view-page {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    position: relative;

    .head {
      width: 100%;
      padding: 0;
      margin: 0;
    }

    .body {
      width: 100%;
      height: calc(100% - (0.9rem * 2));
      padding: 0;
      margin: 0;

      .row {
        line-height: 1rem;
        color: #888888;
      }
    }

    .title {
      background-color: #fff;
      border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
      margin-top: 0.16rem;
    }

    .row {
      font-size: 0.28rem;
      line-height: 0.64rem;
      width: 100%;

      .col {
        display: block;
        padding: 0;
        margin: 0;

        &-time {
          width: 34%;
        }

        &-bet {
          width: 33%;
        }

        &-income {
          width: 33%;
        }
      }
    }
  }
</style>
