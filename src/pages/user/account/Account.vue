<template>
  <view-page class="record" full-box load-more ref="view-page"
             @load-top="onPullingDown" @load-down="onPullingUp" v-touch:left ="onSwipeLeft"  v-touch:right="onSwipeRight">
    <title-header title="帐变记录" slot="header"></title-header>
    <div class="record-header" slot="header-static">
      <date-interval v-model="dateIndex" :date.sync="date" default></date-interval>
      <div class="hr2"></div>
      <!-- <van-tabs v-model="tabIndex" class="scrollable" :line-height="2" line-width="60px" swipeable animated>
        <van-tab v-for="item in tabs" :key="item.k" :title="item.v">
        </van-tab>
      </van-tabs> -->
       <tg-vux-tab v-model="tabIndex"
        class="record-tab"
        :active-color="targetTheme.color"
        :bar-active-color="targetTheme.color"
        :scroll-threshold="4"
        style="background-color: #fff"
        :line-width="2">
        <tg-vux-tab-item v-for="item in tabs" :key="item.k">{{item.v}}</tg-vux-tab-item>
      </tg-vux-tab>
    </div>
    <van-tabs class="no-tab" slot="content" swipeable animated>
      <van-tab></van-tab>
    </van-tabs>
    <div class="record-content" slot="content"  >
        <transition-group :name="animation" class="animation-box" tag="p" ref="animationBox">
        <div class="content-body" ref="solid" :key="'wrapper_' + tabIndex" >
          <div class="record-body"  v-if="all!==''&&list.length" >
            <div v-for="(item,i) in list" :key="item.id+'_'+i"   class="record-item">
                <h5 class="card-title">{{['others'].includes(tab.k)?item.type:tab.n}}</h5>
                <div class="card-content" slot='content'>
                  <span class="card-code" v-if="!['bonus','agency','others'].includes(tab.k)">{{item.code}}</span>
                  <span class="card-code" v-else-if="['others'].includes(tab.k)">{{item['remarks']}}</span>
                  <span class="card-code" v-else>{{item['remarks']}}</span>
                  <span class="card-amount"><span class="rmb"></span>{{item.amount}}</span>
                </div>
              <div class="card-footer" slot="footer">
                <span class="card-time">{{getTime(item['time']||item['created_at'])}}</span>
                <span :class="['card-status',item['status']]" v-if="!['bonus','others'].includes(tab.k)" @click="showRemark(item)">
                  <i class="fa font fa-clock-o" v-if="['wait', 'payment'].includes(item['status'])"></i>
                  <i class="fa font fa-frown-o" v-else-if="item['status']==='fail'"></i>
                  <i class="fa font fa-smile-o" v-else-if="item['status']==='success'"></i>
                  <i>{{{wait:'审核中',fail:'失败',success:'成功',payment:'交易中'}[item['status']]}}</i>
                </span>
              </div>
            </div>
          </div>
          <div v-else-if="all!==''" class="list-empty">
            <img style="width:100%;margin-top: 1.6rem;" :src="noDataImg" alt="">
            <p class="info">暂无{{tabs[tabIndex].v}}</p>
          </div>
      </div>  
    </transition-group> 
    </div>
    <div class="footer" slot="footer" v-if="list.length">
      <div class="item"></div>
      <div class="item">
        <span>{{text[tab.k]}}</span>
        <span style="color: #ff2200;margin-left: 0.1rem"><span class="rmb"></span>{{all||'0.00'}}</span>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'Account',
  data () {
    return {
      page: 0,
      limit: 5,
      date: null,
      dateIndex: 0,
      tabs: [
        { k: 'withdrawals', v: '提现记录', n: '取款' },
        { k: 'deposit', v: '充值记录', n: '存款' },
        { k: 'bonus', v: '优惠记录', n: '优惠' },
        { k: 'agency', v: '代理记录', n: '收入' },
        { k: 'others', v: '其他记录', n: '' }
      ],
      text: {
        withdrawals: '总提现',
        deposit: '总充值',
        bonus: '总优惠',
        agency: '总代理',
        others: '总额'
      },
      tabIndex: 0,
      list: [],
      all: '',
      animation: 'slide-left',
      loading: false,
      noMore: false,
      clientHeight:0
    }
  },
  mounted () {
    if (!this.$store.state.user.token) {
      this.$router.replace('/admin/login')
    }
  },
  computed: {
    tab () {
      return this.tabs[this.tabIndex]
    },
    user () {
      return this.$store.state.user.userInfo
    },
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
  watch: {
    date () {
      this.page = 0
      this.all = ''
      this.noMore = false
      this.refreshList(true)
    },
    tabIndex (now, old) {
      if (now < old) {
        this.animation = 'slide-right'
      } else {
        this.animation = 'slide-left'
      }
      this.all = ''
      this.page = 0;
      this.noMore = false
      this.$nextTick(() => {
        this.$refs['view-page'].refresh()
        this.refreshList(true)
      })
    }
  },
  created () {
    if (!this.user['is_agency']) {
      this.tabs = [
        { k: 'withdrawals', v: '提现记录', n: '取款' },
        { k: 'deposit', v: '充值记录', n: '存款' },
        { k: 'bonus', v: '优惠记录', n: '优惠' },
        { k: 'others', v: '其他记录', n: '' }
      ]
    }
    if(this.$route.query.id) {
      this.tabIndex = this.$route.query.id
    }
  },
  methods: {
    showRemark (item) {
      if (item['remark']) {
        this.toastText(item['remark'], 'top')
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
    getTime (str) {
      return this.dayJs.unix(str).format('YYYY-MM-DD HH:mm:ss')
    },
    onPullingDown () {
      this.page = 0
      this.all = ''
      this.noMore = false
      this.refreshList(true)
    },
    onPullingUp () {
      this.refreshList()
    },
    refreshList (status) {
        this.page++
        if (this.date && this.tab && this.tab.k) {
          this.$store.dispatch('user/accountMoneyRecord', {
            type: this.tab.k,
            start: this.date.start,
            end: this.date.end,
            page: this.page,
            limit: this.limit
          }).then(data => {
            this.$refs['view-page'].loaded()
            if (typeof data.data.data.amount === 'object') {
              this.all = data.data.data.amount['total_amount']
            } else {
              this.all = data.data.data.amount
            }
            if (status) {
              this.list = data.data.data.list
            } else {
              this.list = this.list.concat(data.data.data.list)
            }
            if(data.data.data.list.length == 0 && !status){
              if (data.message) {
                this.toastText('暂无更多数据')
              } else if (data.msg) {
                this.toastText(data.msg, 'top')
              }
            }
            this.$refs['view-page'].loaded()
            this.refreshing = false
            this.noData = !this.list.length
            
          }).catch(() => {
            this.$refs['view-page'].loaded()
            this.page--
          })
        } else {
          this.list = []
          this.$refs['view-page'].loaded()
        }
      }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  /deep/.van-tabs__nav{
    display: flex;
    .van-tab{
      font-size: 0.32rem;
      color: #333333;
      padding:0;
      flex: 0 0 25% !important;
      span{
        padding:0;
      }
    }
    .van-tabs__line{
      width:19%!important;
    }
  }
 
  /deep/.van-tabs__nav--line{
    padding-bottom: 0.285rem;
  }
  .record-tab{
    background-color: rgb(255, 255, 255);
    padding-top: 0.88rem !important;
    .vux-tab-container{
      top: 0;
      left: 0;
      right: 0;
      overflow: hidden;
      position: absolute;
      .vux-tab{
        background-color: unset !important;
        overflow-x: scroll !important;
        -webkit-overflow-scrolling: touch !important;
        overflow-y: scroll !important;overflow-x: scroll !important;
        height: 45px;
        overflow-scrolling: touch;
        overflow-x: scroll;
        overflow-y: scroll;
        height: 100%;
        width: 100%;
        padding-bottom: 0;
        word-spacing: normal;
        -webkit-overflow-scrolling: touch;
        .vux-tab-item{
          font-size: 0.32rem !important;
          color: #333333;
          -webkit-box-flex: 0 !important;
          -webkit-flex: 0 0 25% !important;
          -ms-flex: 0 0 25% !important;
          flex: 0 0 25% !important;
        }
      }
    }
  }

  .record {
    .record-item {
      background-color: #fff;
      margin-top: 0.2rem;
    }
    .record-content{
         .animation-box{
          position: relative;
          left: 0;
          top: 0;
          width: 100%;
          .content-body{
            width: 100%;
          }
        } 
    }

    .card-title {
      font-size: 0.3rem;
      line-height: 0.76rem;
      color:rgb(44, 62, 80);
      margin: 0 0.24rem;
      text-align: left;
      font-weight:400;
      // border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
      position: relative;
      &::after{
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0;
        bottom: 0;
        left: 0;
        border-bottom: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }
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
      color: #515151;
      flex: 1;
    }

    .font {
      transform: scale(1.24);
      transform-origin: right;
    }

    .card-time {
      color: rgb(153,153,153);
      flex: 1;
    }

    .card-status {
      color: #999999;
    }

    .card-amount, .card-status.success {
      color: #ff2200;
    }

    .card-amount, .card-status.wait {
      color: #09c205;
    }

    .card-amount, .card-status.payment {
      color: #09c205;
    }
    .card-amount, .card-status.fail {
      color: #888888;
    }

    .list-empty {
      flex: 1;
      width: 100vw;
      overflow: hidden;
      .img {
        width: 100vw;
        height: 35.7333333vw;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        margin-top: 1.6rem;
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
      background-color: #fff;

      .item {
        font-size: 0.3rem;
        line-height: 0.9rem;
      }
    }
  }
</style>
