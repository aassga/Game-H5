<template>
  <view-page class="view-page" ref="view-page" :full-box="true"
             :load-more="tabIndex===(personalMode==='mode_b'?1:2)"
             @load-top="onPullingDown" @load-down="onPullingUp"
             @scroll-height-change="scrollHeight=$event">
    <title-header slot="header" title="下级开户"></title-header>

    <div slot="header-static">
      <div class="hr"></div>
      <van-tabs class="tab" v-model="tabIndex" :line-height="2" v-if="personalMode!=='mode_b'">
        <van-tab title="精准开户"></van-tab>
        <van-tab title="创建邀请"></van-tab>
        <van-tab title="管理邀请"></van-tab>
      </van-tabs>
      <van-tabs class="tab" v-model="tabIndex" :line-height="2" v-else>
        <van-tab title="精准开户"></van-tab>
        <van-tab :title="`邀请${siteModel==='invite_code'?'码':'链接'}管理`"></van-tab>
      </van-tabs>
    </div>

    <div class="content-slot" slot="content" v-if="personalMode!=='mode_b'">
      <van-tabs v-model="tabIndex" class="no-tab" animated swipeable :lazy-render="false">
        <van-tab :style="{minHeight:scrollHeight+'px'}">
          <van-cell-group>
            <input-row label="开户类型:" v-if="personalMode==='no'">
              <div class="check-type" slot="input">
                <span :class="{type:true,active: !userType}">代理</span>
                <van-switch v-model="userType" size="0.45rem"></van-switch>
                <span :class="{type:true,active: userType}">会员</span>
              </div>
            </input-row>
            <input-row type="text" label="开户帐号:" placeholder="请输入6-10位数字或字母" max-len="10" v-model="user"></input-row>
            <input-row type="text" label="帐号密码:" placeholder="请输入8-20位数字或字母" max-len="20" v-model="password" disabled></input-row>
          </van-cell-group>
          <van-cell-group>
            <p class="group-title" slot="title">分润设置</p>
            <van-cell is-link :to="'/user/agent/open/odds/'+k+'/edit?t=1'+Date.now()"
                      v-for="(v, k) in refundRebate" v-show="checkGameTypeShow(v.name)" :key="k">
              <div class="cell-box">
                <div class="name">{{v.name}}:</div>
                <div class="value">{{v.list[0].value}}%</div>
              </div>
            </van-cell>
          </van-cell-group>
          <div class="foot-box" style="margin-bottom: 40px">
            <van-button block class="open" type="primary" @click="onOpen">立即开户</van-button>
          </div>
        </van-tab>

        <van-tab :style="{minHeight:scrollHeight+'px'}">
          <van-cell-group v-if="personalMode==='no'">
            <input-row label="开户类型:">
              <div class="check-type" slot="input">
                <span :class="{type:true,active: !userType}">代理</span>
                <van-switch v-model="userType" size="0.45rem"></van-switch>
                <span :class="{type:true,active: userType}">会员</span>
              </div>
            </input-row>
          </van-cell-group>
          <van-cell-group>
            <p class="group-title" slot="title">分润设置</p>
            <van-cell is-link :to="'/user/agent/open/odds/'+k+'/edit?t=2'+Date.now()"
                      v-for="(v, k) in refundRebate" v-show="checkGameTypeShow(v.name)" :key="k">
              <div class="cell-box">
                <div class="name">{{v.name}}:</div>
                <div class="value">{{v.list[0].value}}%</div>
              </div>
            </van-cell>
          </van-cell-group>
          <div class="foot-box" style="margin-bottom: 140px">
            <van-button block type="primary" class="open" @click="onLink">立即开户</van-button>
          </div>
        </van-tab>

        <van-tab :style="{minHeight:scrollHeight+'px'}">
          <ul class="row title clear-fix">
            <li class="f-l col col-link">{{siteModel==='invite_code'?'邀请码':'邀请链接'}}</li>
            <li class="f-l col col-data">状态</li>
            <li class="f-l col col-data">注册人数</li>
          </ul>
          <div class="list">
            <van-cell is-link v-for="(item, i) in list" :key="item+'-'+i">
              <ul class="row clear-fix" @click="actionIndex=i">
                <li class="f-l col col-link">{{siteModel==='invite_code'?item.agencyCode:item.domain}}</li>
                <li class="f-l col col-data">{{item.status==='yes'?'启用':'停用'}}</li>
                <li class="f-l col col-data">{{item['registeredtotal']}}</li>
              </ul>
            </van-cell>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <div class="content-slot" slot="content" v-else>
      <van-tabs v-model="tabIndex" class="no-tab" animated swipeable :lazy-render="false">
        <van-tab :style="{minHeight:scrollHeight+'px'}">
          <van-cell-group>
            <input-row v-model="user" type="text" label="开户帐号:" placeholder="请输入6-10位数字或字母" max-len="10"></input-row>
            <input-row v-model="password" type="text" label="帐号密码:" placeholder="请输入8-20位数字或字母" disabled max-len="20"></input-row>
          </van-cell-group>
          <div class="foot-box" style="margin-bottom: 40px">
            <van-button block class="open" type="primary" @click="onOpen">立即开户</van-button>
          </div>
        </van-tab>
        <van-tab :style="{minHeight:scrollHeight+'px'}">
          <div class="list" :style="{height: listHeight + 'px'}">
            <van-cell is-link v-for="(item, i) in list" :key="item+'-'+i">
              <ul class="row clear-fix" @click="actionIndex=i">
                <li class="f-l col col-link">{{siteModel==='invite_code'?item.agencyCode:item.domain}}</li>
                <li class="f-l col col-data">{{item.status==='yes'?'启用':'停用'}}</li>
                <li class="f-l col col-data">{{item['registeredtotal']}}</li>
              </ul>
            </van-cell>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <div class="foot-box" slot="footer" v-if="personalMode==='mode_b'&&tabIndex===1">
      <van-button block type="primary" class="open" @click="showAlert = true">创建邀请{{siteModel==='invite_code'?'码':'链接'}}</van-button>
    </div>

    <div slot="static">
      <ios-popup-select @select="onAction" :show="actionShow" :list="actions" @cancel="actionShow=false"></ios-popup-select>

      <van-popup v-model="actionOddsShow" position="bottom" get-container="body">
        <div class="odds-list-box">
          <h5 class="odds-header" slot="title">分润详情</h5>
          <van-cell-group class="odds-list">
            <van-cell is-link v-for="(v, k) in $store.state.agent.refundRebate" :key="k"
                      v-show="checkGameTypeShow(v.name)">
              <div class="odds-item" @click="$router.push('/user/agent/open/odds/'+k+'/readonly')">
                <span class="title">{{v.name}}</span>
                <span class="value number-text">{{actionIndex>-1?list[actionIndex][v.list[0].key]:'0'}}%</span>
              </div>
            </van-cell>
          </van-cell-group>
        </div>
      </van-popup>
      <ios-alert v-model="showAlert" :ok-callback="onLink">
        <p class="theme-color-white">您确定创建邀请链接吗？</p>
      </ios-alert>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'AgentOpen',
  data () {
    return {
      scrollHeight: 0,
      showAlert: false,
      tabIndex: parseInt(localStorage['agentOpenIndex']) || 0,
      animation: '',
      userType: false,
      user: '',
      opening: false,
      password: '',
      loading: false,
      page: 0,
      pageSize: 12,
      noMore: false,
      list: [],
      actionIndex: -1,
      actionOddsShow: false,
      key: ''
    }
  },
  watch: {
    tabIndex (now, old) {
      this.animation = now > old ? 'slide-left' : 'slide-right'
      this.clean()
      if ((this.personalMode === 'mode_b' && now === 1) || now === 2) {
        this.onPullingDown()
      }
      localStorage['agentOpenIndex'] = now
    }
  },
  created () {
    if (this.personalMode === 'mode_a') {
      this.userType = false
    } else {
      this.userType = true
    }
    this.setPassWord()
    if (!this.refundRebate) {
      this.$store.dispatch('agent/getRefundRebate').then(res => {
        this.$store.commit('lottery/checkPlayWay')
      })
    }

    this.key = Date.now()
  },
  computed: {
    actions () {
      const actions = []
      if (this.personalMode !== 'mode_b') actions.push({ key: 'look', value: '查看分润' })
      actions.push({ key: 'change', value: this.list[this.actionIndex] && this.list[this.actionIndex].status !== 'yes' ? '启用' : '停用' })
      actions.push({ key: 'copy', value: '复制邀请' + (this.siteModel === 'invite_code' ? '码' : '链接') })
      return actions
    },
    siteModel () {
      return this.$store.state.main.config['site_model']
    },
    actionShow: {
      get () {
        return !this.actionOddsShow && this.actionIndex > -1
      },
      set (val) {
        if (!val && !this.actionOddsShow) {
          this.actionIndex = -1
        }
      }
    },
    refundRebate: {
      get () {
        return this.$store.state.agent.refundRebateForOpen
      },
      set (val) {
        this.$store.state.agent.refundRebateForOpen = val
      }
    }
  },
  mounted () {
    if (this.personalMode === 'mode_b' ? this.tabIndex === 1 : this.tabIndex === 2) {
      this.onPullingDown()
    }
  },
  methods: {
    onAction (val) {
      if (val) {
        switch (val.key) {
          case 'look':
            this.onLook()
            break

          case 'change':
            this.onUp()
            break

          case 'copy':
            this.onCopy()
            break
        }
      }
    },
    setPassWord () {
      let password
      do {
        password = Math.floor(Math.random() * 100000000)
      } while (password.toString().length !== 8)

      this.password = password
    },
    onSwipeLeft () {
      if (this.tabIndex + 1 < (this.personalMode === 'mode_b' ? 2 : 3)) {
        this.tabIndex++
      }
    },
    onSwipeRight () {
      if (this.tabIndex > 0) {
        this.tabIndex--
      }
    },
    onUp () {
      if (this.list[this.actionIndex]) {
        const item = this.list[this.actionIndex]
        this.$store.dispatch(
          'agent/domainUp',
          {
            id: item.id,
            status: item.status === 'yes' ? 'no' : 'yes'
          }
        ).then(res => {
          if (res.code === 200) {
            this.toastText(res.data, 'top')
            this.onPullingDown()
          } else {
            this.toastText(res.message, 'top')
          }
        })
      }
      this.actionIndex = -1
    },
    onLook () {
      this.$store.state.agent.openAgentOdds = this.list[this.actionIndex]
      this.actionOddsShow = true
    },
    onCopy () {
      const text = this.siteModel === 'invite_code' ? this.list[this.actionIndex].agencyCode : this.list[this.actionIndex].domain
      this.$copyText(text).then(() => {
        this.toastText('复制成功', 'top')
      })
      this.actionIndex = -1
    },
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
        this.page++
        this.loading = true
        this.$store.state.main.loadingText = '获取中...'
        this.$store.dispatch(
          'agent/domainList',
          {
            page: this.page,
            pageSize: this.pagesize
          }
        ).then(res => {
          if (res.code === 200) {
            if (status) {
              this.list = res.data.list.data
            } else {
              this.list = this.list.concat(res.data.list.data)
            }
          } else {
            this.toastText(res.message, 'top')
            this.page--
          }
          this.$store.state.main.loadingText = ''
          this.loading = false
          this.$refs['view-page'].loaded()
        }).catch(() => {
          this.page--
          this.$store.state.main.loadingText = ''
          this.loading = false
          this.$refs['view-page'].loaded()
        })
      }
    },
    clean () {
      this.user = ''
      // this.password = '12345678'
      this.setPassWord()
      this.userType = false
      this.refundRebate = JSON.copyObj(this.$store.state.agent.refundRebate)
      this.loading = false
      this.noMore = false
      this.page = 0
    },
    onLink () {
      if (this.opening) {
        this.toastText('正在创建', 'top')
      } else {
        this.opening = true
        this.$store.state.main.loadingText = '创建中...'
        const json = {}
        for (let k in this.refundRebate) {
          if (this.refundRebate.hasOwnProperty(k)) {
            this.refundRebate[k].list.forEach(item => {
              json[item.key] = item.value
            })
          }
        }
        this.$store.dispatch(
          'agent/domainAdd',
          {
            type: this.userType ? 0 : 1,
            json: json
          }
        ).then(res => {
          if (res.code === 200) {
            this.toastText(res.data, 'top')
            this.clean()
            if (this.personalMode === 'mode_b') {
              this.onPullingDown()
            }
          } else {
            this.toastText(res.message, 'top')
          }
          this.opening = false
          this.$store.state.main.loadingText = ''
        }).catch(() => {
          this.toastText('网络错误', 'top')
          this.opening = false
          this.$store.state.main.loadingText = ''
        })
      }
      return true
    },
    onOpen () {
      if (this.opening) {
        this.toastText('正在创建', 'top')
      } else if (this.checkUserForRegister(this.user, 'top')) {
        this.opening = true
        this.$store.state.main.loadingText = '创建中...'
        const json = {}
        for (let k in this.refundRebate) {
          if (this.refundRebate.hasOwnProperty(k)) {
            this.refundRebate[k].list.forEach(item => {
              json[item.key] = item.value
            })
          }
        }
        this.$store.dispatch(
          'agent/createAccount',
          {
            type: this.userType ? 0 : 1,
            name: this.user,
            password: this.password,
            json: json
          }
        ).then(res => {
          if (res.code === 200) {
            this.toastText(res.data, 'top')
            this.clean()
          } else {
            this.toastText(res.message, 'top')
          }
          this.opening = false
          this.$store.state.main.loadingText = ''
        }).catch(() => {
          this.toastText('网络错误', 'top')
          this.opening = false
          this.$store.state.main.loadingText = ''
        })
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .view-page {
    .check-type {
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-wrap: nowrap;
      justify-content: start;
      align-items: center;

      .type {
        color: #aaaaaa;
        font-size: 0.345rem;
      }

      /deep/ .van-switch {
        margin: 0 0.1rem;
      }
    }

    .cell-box {
      width: 100%;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      padding: 0.24rem 0 0.24rem 0.24rem;

      .name {
        width: 1.6rem;
        font-size: 0.32rem;
        line-height: 0.4rem;
        color: #333333;
      }

      .value {
        text-align: right;
        flex: 1;
        color: #333333;
        font-size: 0.345rem;
        line-height: 0.4rem;
      }
    }

    .group-title {
      margin-top: 0.24rem;
      padding: 0 0.24rem;
      color: #888888;
      text-align: left;
      line-height: 0.4rem;
    }

    .children-box {
      position: relative;
      overflow: visible;
      width: 100%
    }

    .foot-box {
      padding: 0.2rem;
    }

    .open {
      font-size: 0.36rem;
      border-radius: 0 !important;
    }

    .row {
      background-color: #fff;
      color: #888888;
      border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
      font-size: 0.28rem;
      box-sizing: border-box;
      list-style: none;
      width: 100%;
      line-height: 0.9rem;

      .col {
        text-align: center;

        &-link {
          width: 64%;
          text-align: left;
          padding-left: 0.24rem;
          box-sizing: border-box;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &-data {
          width: 18%;
          box-sizing: border-box;
        }
      }
    }

    .title {
      background-color: #fff;
      width: 100%;
      line-height: 0.6rem;
      padding-right: 0.6rem;
      padding-left: 0.2rem;
    }

    .hr {
      width: 100%;
      height: 0.2rem;
      background-color: rgba(0, 0, 0, 0) !important;
    }

    .list {
      width: 100%;
      box-sizing: border-box;
      height: 100%;
    }
  }
</style>
