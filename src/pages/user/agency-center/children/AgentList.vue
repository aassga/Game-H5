<template>
  <view-page ref="view-page" full-box load-more @load-top="onPullingDown" @load-down="onPullingUp">
    <title-header slot="header" title="下级列表"></title-header>
    <div class="head" slot="header-static">
      <van-cell-group v-if="personalMode==='no'">
        <van-tabs v-model="tabIndex" :line-height="2">
          <van-tab v-for="item in tabs" :key="item.k" :title="item.v"></van-tab>
        </van-tabs>
      </van-cell-group>
      <ul class="row title clear-fix" :style="{paddingRight:personalMode!=='mode_b'?'0.6rem':'0'}">
        <li class="col f-l col-count-4">会员</li>
        <li class="col f-l col-count-4">姓名</li>
        <li class="col f-l col-count-4">状态</li>
        <li class="col f-l col-count-4">类型</li>
      </ul>
    </div>

    <div class="content" slot="content">
      <img width="100%" src="../../../../assets/img/no-data.png" alt="" v-if="!list[tabIndex].length">
      <van-cell-group>
        <van-cell v-for="(user, i) in list[tabIndex]" :key="user.uid+'-'+i" :is-link="personalMode!=='mode_b'" @click="onItemClick(user)">
          <ul class="row clear-fix">
            <li class="col f-l col-count-4">
              {{user['userName'].slice(0,user['userName'].length-2)}}**
            </li>
            <li class="col f-l col-count-4">
              {{user['realName']||'无'}}
            </li>
            <li class="col f-l col-count-4">
              {{user['status']==='yes'?'启用':'禁用'}}
            </li>
            <li class="col f-l col-count-4">
              {{user['is_agency']?'代理':'会员'}}
            </li>
          </ul>
        </van-cell>
      </van-cell-group>
    </div>

    <div slot="static" v-if="personalMode!=='mode_b'">
      <ios-popup-select @select="onAction" :show="actionUserStatus" :list="actions" @cancel="actionUserStatus=false"></ios-popup-select>

      <van-popup v-model="changeOddsShow" class="odds-list-box" position="bottom" get-container="body">
        <h5 class="odds-header">赔率详情</h5>
        <van-cell-group class="odds-list">
          <van-cell is-link v-for="(v, k) in refundRebate" :key="k" v-show="checkGameTypeShow(v.name)">
            <div class="odds-item" @click="$router.push('/user/agent/list/edit-odds/'+k+'?t='+Date.now())">
              <span class="title">{{v.name}}</span>
              <span class="value">{{$store.state.agent.agentListSelected&&v.list[0]?$store.state.agent.agentListSelected[v.list[0].key]:''}}%</span>
            </div>
          </van-cell>
        </van-cell-group>
      </van-popup>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'AgentList',
  data () {
    return {
      actionUser: null,
      changeOdds: false,
      tabs: [
        { k: 2, v: '全部' },
        { k: 1, v: '代理' },
        { k: 0, v: '会员' }
      ],
      tabIndex: 0,
      animation: '',
      pageSize: 12,
      list: [[], [], []],
      loading: [false, false, false],
      page: [0, 0, 0],
      noMore: [false, false, false]
    }
  },
  watch: {
    tabIndex (now, old) {
      this.animation = now > old ? 'slide-left' : 'slide-right'
      this.page[this.tabIndex] = 0
      this.noMore[now] = false
      this.loadList(true, now)
    }
  },
  computed: {
    actions () {
      const actions = []
      if (this.personalMode !== 'mode_b') actions.push({ key: 'edit', value: '修改赔率' })
      if (this.actionUser && !this.actionUser['is_agency']) actions.push({ key: 'change', value: '升为代理' })
      return actions
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
    },
    changeOddsShow: {
      get () {
        return this.changeOdds && !!this.$store.state.agent.agentListSelected
      },
      set (val) {
        this.changeOdds = val
      }
    }
  },
  created () {
    if (!this.refundRebate) {
      this.$store.dispatch('agent/getRefundRebate').then(res => {
        this.$store.commit('lottery/checkPlayWay')
      })
    }
    if (this.personalMode === 'mode_a') {
      this.tabs = [
        { k: 1, v: '代理' }
      ]
    } else if (this.personalMode === 'mode_b') {
      this.tabs = [
        { k: 0, v: '会员' }
      ]
    } else {
      this.tabs = [
        { k: 2, v: '全部' },
        { k: 1, v: '代理' },
        { k: 0, v: '会员' }
      ]
    }
  },
  mounted () {
    this.onPullingDown()
  },
  methods: {
    onAction (action) {
      switch (action.key) {
        case 'edit':
          this.onChangeOdds()
          break

        case 'change':
          this.onToAgent()
          break
      }
    },
    onItemClick (user) {
      if (this.personalMode !== 'mode_b') {
        this.actionUser = user
      } else {
        this.actionUser = null
      }
    },
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
    onToAgent () {
      this.$store.state.main.loadingText = '请稍后...'
      this.$store.dispatch('agent/lowerUpStatus', { uid: this.actionUser.uid }).then(res => {
        if (res.code === 200) {
          this.toastText(res.data, 'top')
          this.onPullingDown()
        } else {
          this.toastText(res.message, 'top')
        }
        this.$store.state.main.loadingText = ''
      }).catch(() => {
        this.$store.state.main.loadingText = ''
      })
      this.actionUser = null
    },
    onChangeOdds () {
      this.$store.state.agent.agentListSelected = this.actionUser
      this.actionUser = null
      this.changeOdds = true
    },
    onPullingDown () {
      this.page[this.tabIndex] = 0;
      this.noMore[this.tabIndex] = false
      this.loadList(true, this.tabIndex)
    },
    onPullingUp () {
      this.loadList(true, this.tabIndex)
    },
    loadList (status, index) {
      if (this.loading[index]) {
        this.toastText('正在获取', 'top')
      } else if (this.noMore[index]) {
        this.toastText('没有更多', 'top')
        this.$refs['view-page'].loaded()
      } else {
        this.page[this.tabIndex]++
        this.$store.state.main.loadingText = '正在加载...'
        this.loading[index] = true
        this.$store.dispatch(
          'agent/lowerList',
          {
            type: this.tabs[index].k,
            page: this.page[index],
            pageSize: this.pageSize,
            uid: ''
          }
        ).then(res => {
          this.$refs['view-page'].loaded()
          if (res.code === 200) {
            if (res.data.data.length === 0) {
              this.noMore[index] = true
              this.$store.state.main.loadingText = ''
              this.loading[index] = false
              return false
            }
            if (status) {
              this.$set(this.list, index, res.data.data)
            } else {
              this.$set(this.list, index, this.list[index].concat(res.data.data))
            }
          } else {
            this.page[index]--
            this.toastText(res.message, 'top')
          }
          this.$store.state.main.loadingText = ''
          this.loading[index] = false
        }).catch(() => {
          this.toastText('获取失败', 'top')
          this.page[index]--
          this.$store.state.main.loadingText = ''
          this.loading[index] = false
          this.$refs['view-page'].loaded()
        })
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .view-page {
    .head {
      width: 100%;
    }

    .row {
      color: #888888;

      &.title {
        background-color: #fff;
        margin-top: 0.2rem;
        border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
      }
    }

    .animation-box {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
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
      padding: 0.1rem 0;

      .col {
        text-align: center;
        display: block;
        padding: 0;
        margin: 0;
        height: 0.56rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &-count-4 {
          width: 25%;
        }

        &-count-3 {
          width: 33.333333%;
        }
      }
    }
  }
</style>
