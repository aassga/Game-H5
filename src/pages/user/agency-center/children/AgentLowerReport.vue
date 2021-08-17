<template>
  <view-page class="view-page" ref="view-page" load-more full-box @load-top="onPullingDown" @load-down="onPullingUp">
    <title-header title="下级报表" slot="header">
      <span class="header-right" slot="right" @click="dateShow=true">
          {{date.name}}<i class="fa fa-fw fa-angle-down"></i>
      </span>
    </title-header>
    <div class="head" slot="header-static">
      <ul class="row title clear-fix">
        <li class="col f-l col-count">帐号</li>
        <li class="col f-l col-count">类型</li>
        <li class="col f-l col-count">投注人数</li>
        <li class="col f-l col-count">盈利</li>
      </ul>
    </div>
    <div class="content" slot="content">
      <div class="no-data" v-show="!loading && !list.length">
        <img class="img" src="../../../../assets/img/no-data.png" alt=""/>
        <p class="info">暂无下级</p>
      </div>
      <van-cell-group>
        <van-cell v-for="(user, i) in list" :key="user.uid+'-'+i" is-link @click="actionUser=user">
          <ul class="row clear-fix">
            <li class="col f-l col-count">{{user['userName'].slice(0,user['userName'].length-2)}}**</li>
            <li class="col f-l col-count">{{user['type']}}</li>
            <li class="col f-l col-count">{{user['countuser']}}</li>
            <li class="col f-l col-count tr">{{user['net']}}</li>
          </ul>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="foot" slot="footer" v-if="!!showBack">
      <van-button type="primary" block @click="onBack">返回上级</van-button>
    </div>

    <div slot="static">
      <ios-popup-select @select="onClick" :show="dateShow" :list="dates" @cancel="dateShow=false" key-name="index" val-name="name"></ios-popup-select>
      <ios-popup-select @select="onAction" :show="actionUserStatus" :list="actions" @cancel="actionUserStatus=false"></ios-popup-select>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'AgentLowerReport',
  data () {
    return {
      title: [],
      first: [],
      uid: '',
      actionUser: null,
      dateShow: false,
      date: { index: 1, name: '今天' },
      dates: [
        { index: 1, name: '今天' },
        { index: 2, name: '昨天' },
        { index: 3, name: '本月' },
        { index: 4, name: '上月' }
      ],
      animation: '',
      pageSize: 12,
      list: [],
      loading: false,
      page: 0,
      noMore: false
    }
  },
  watch: {
    date () {
      this.onPullingDown()
    },
    uid () {
      this.onPullingDown()
    }
  },
  computed: {
    actions () {
      const actions = []

      if (this.actionUser) {
        actions.push({
          key: this.actionUser['userName'],
          value: this.actionUser['userName'],
          disabled: true
        })

        actions.push({
          key: 'look',
          value: '查看报表'
        })

        if (this.actionUser['type'] === '代理') {
          actions.push({
            key: 'lower',
            value: '查看下级'
          })
        }
      }

      return actions
    },
    showBack () {
      return !!this.uid && this.uid !== this.$store.state.user.userInfo.uid
    },
    refundRebate () {
      return this.$store.state.agent.refundRebate
    },
    actionUserStatus: {
      get () {
        return !!this.actionUser
      },
      set (val) {
        this.actionUser = val ? this.actionUser : null
      }
    }
  },
  mounted () {
    if (this.$store.state.user.userInfo) {
      this.uid = this.$store.state.user.userInfo.uid
      this.title.push(this.$store.state.user.userInfo.userName)
    }
  },
  methods: {
    onAction (action) {
      switch (action.key) {
        case 'look':
          this.onReport()
          break

        case 'lower':
          this.onLower()
          break
      }
    },
    onBack () {
      this.uid = this.first.pop()
      this.title.pop()
    },
    onReport () {
      const actionUser = this.actionUser
      this.actionUser = null
      this.$router.push('/user/agent/lower-report/info/' + actionUser.uid.toString())
    },
    onLower () {
      this.first.push(this.uid)
      this.title.push(this.actionUser.userName)
      this.uid = this.actionUser.uid
      this.actionUser = null
      this.$nextTick(() => {
        this.$refs['view-page'].refresh()
      })
    },
    onClick (item) {
      this.date = item
      this.dateShow = false
    },
    onPullingDown () {
      this.page = 0
      this.noMore = false
      this.loadList(true)
    },
    onPullingUp () {
      this.loadList(false)
    },
    loadList (status) {
      if (this.loading) {
        this.toastText('正在获取', 'top')
      } else if (this.noMore) {
        this.toastText('没有更多', 'top')
        this.$refs['view-page'].loaded()
      } else {
        this.page++
        this.$store.state.main.loadingText = '正在加载...'
        this.loading = true
        this.$store.dispatch(
          'agent/lowerReport',
          {
            date: this.date.index,
            page: this.page,
            pageSize: this.pageSize,
            uid: this.uid
          }
        ).then(res => {
          this.$refs['view-page'].loaded()
          this.$store.state.main.loadingText = ''
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
          this.loading = false
        }).catch(() => {
          this.$refs['view-page'].loaded()
          this.$store.state.main.loadingText = ''
          this.toastText('获取失败', 'top')
          this.page--
          this.loading = false
        })
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .view-page {
    .tr {
      box-sizing: border-box;
      padding-right: 0.04rem !important;
    }

    .header-right {
      position: absolute;
      right: 0.24rem;
      top: 0;
      font-size: 0.32rem;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .body {
      width: 100%;

      .row {
        color: #888888;
      }
    }

    .foot {
      height: 1.2rem;
      width: 100%;
      padding: 0.24rem;
      box-sizing: border-box;
    }

    .no-data {
      width: 100%;

      .img {
        width: 100%;
      }

      .info {
        text-align: center;
        color: #777777;
        font-size: 0.28rem;
        line-height: 1.2rem;
      }
    }

    .row {
      font-size: 0.28rem;
      line-height: 0.56rem;
      width: 100%;
      box-sizing: border-box;
      text-align: center;

      .col {
        display: block;
        padding: 0;
        margin: 0;
        height: 0.56rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &-count {
          width: 25%;
        }
      }
    }

    .title {
      margin-top: 0.16rem;
      padding: 0 0.64rem 0 0.2rem;
      box-sizing: border-box;
      position: relative;
      background-color: #fff;

      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 100%;
        transform: translateY(-100);
        right: 0;
        left: 0;
        height: 0.02rem;
        background-color: hsla(0, 0%, 95%, 1);
        z-index: 450;
      }
    }

    /deep/ .van-cell-group {
      margin-top: 0;
    }

    /deep/ .van-cell {
      padding: 0.1rem 0 0.1rem 0.2rem;
    }
  }
</style>
