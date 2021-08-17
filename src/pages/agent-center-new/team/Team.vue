<template>
  <view-page ref="view-page" class="agent-team" :class="{'theme-header-bg':$config.blackTheme || $config.newQP,'theme-main-bg':$config.blush}" :full-box="!isShowFixed" no-scroll @scroll-height-change="height => {this.contentHeight = height}">
    <title-header :title="uid?'下级团队':'我的团队'" class="theme-main-bg theme-header-bottom" slot="header" backEvent @back="goback">
      <!--      <a class="title-right" v-if="!uid" @click="$router.push('/user/agency-center-new/agency-report')">代理报表</a>-->
    </title-header>

    <div class="content-slot" :class="{'theme-header-bg':$config.blackTheme || $config.newQP,'theme-main-bg':$config.blush}"  slot="header-static">
      <ul class="header theme-agent-tab theme-yellow-bg-6">
        <li class="item theme-color-black" :class="{'theme-agent-tab-active theme-yellow-bg-2':tabIndex===i,w50:titleInfo.length===2,w50Modle:personalMode== 'mode_b' &&(agencyType=='shareholder' || agencyType==='agency')}" v-for="(t,i) in titleInfo" :key="i" @click="tabIndex=i">
           <div class="bmg" :class="{w50active:titleInfo.length===2 && tabIndex===i,active:tabIndex===i}">
            <p class="money">{{count[t.code]||0}}</p>
            <p class="title">{{t.name}}</p>
          </div>
        </li>
      </ul>
    </div>

    <vux-swiper :initial-swipe='intallIndex' v-model="tabIndex" :threshold="100" :min-moving-distance="200"  @on-index-change="swiperChange" slot="content" :show-dots="false" :loop="false" ref="swipe">
      <vux-swiper-item v-for="(title, index) in titleList" :key="index">
        <div class="view-box search-box" :class="{'theme-border-1px theme-header-bg':$config.blackTheme || $config.newQP,'theme-border-white theme-main-bg-3':$config.blush}">
          <span class="search-icon icon iconfont h5-icon-sousuotubiao  theme-color theme-color-yellow"></span>
          <!-- <van-field v-model="username[index]" class="input" type="text" placeholder="输入帐号可进行筛选" v-keyBroayStates clearable @blur="onSearch"></van-field> -->
          <input v-model="username" :class="['input',{'black-input theme-header-bg' : $config.blackTheme || $config.newQP,'theme-main-bg-3 theme-color-white':$config.blush}]" type="text" placeholder="输入帐号可进行筛选" @blur="onSearch">
          <span v-if="titleInfo[index].type===1" class="date theme-color-white" @click="showDateSelector=true">{{date&&date.name}}</span>
          <span v-if="titleInfo[index].type===1" class="date-icon icon iconfont h5-icon-qushi-moreup theme-color-white" @click="showDateSelector=true"></span>
        </div>

        <div class="tab-view">
          <ul :class="['title-list',{'black-title-list' : $config.blackTheme || $config.newQP}]">
          <li class="title-list-item theme-color-white" :class="'title-list-item'+i" v-for="(item, i) in title" :key="i" @click="onOrderChange(item, index)">
              <span :class="{
                'can-order':item.order,
                'can-order-desc  theme-after-color-yellow':item.code===targetOrderCode[index]&&orderByDesc[index]==='desc',
                'can-order-asc theme-before-color-yellow':item.code===targetOrderCode[index]&&orderByDesc[index]==='asc',
                'can-order-nodata': noData[index]
                }">{{item.name}}</span>
            </li>
          </ul>
          <list-view :key="index" ref="listBox" class="item-list view-box user-list theme-main-bg-5" style="padding: 0;min-height: calc(100vh - 500px); " :style="{height:(contentHeight-2.44*rem)+'px'}"
                    :noMore="noMore[index]" @load-top="onRefresh" @load-down="onLoadMore" >
            <ul v-if="list[index].length" style="padding: 0 0.24rem;">
              <li class="user-item item-box-x theme-color-white theme-border-color" v-for="(user, i) in list[index]" :key="i" @click="onUserClick(user)">
                <span class="user-item-col" :class="[{'color':t.color&&parseFloat(user[t.code])>0,green:parseFloat(user[t.code])<0},'user-item-col'+i]"
                      v-for="(t, i) in title" :key="i">{{t.time?dayJs.unix(user[t.code]).format('YYYY-MM-DD'):user[t.code]}}</span>
              </li>
            </ul>
            <div v-else-if="noMore[index]">
              <img style="width: 100%;margin-top: 1rem;" :src="noDataImg" alt/>
              <p style="font-size: 0.3rem;color: #666666">暂无数据</p>
            </div>
            <p v-if="totalCount > 5" style="font-size: 0.26rem; line-height: 0.84rem; color: #000;text-align: center;">
              已显示最近{{totalCount}}条记录
              </p>
          </list-view>
        </div>
      </vux-swiper-item>
    </vux-swiper>

    <div slot="static">
      <van-popup v-model="showActions" position="bottom" get-container="body">
        <div class="action-box">
          <ul class="action-list theme-main-bg-5" v-if="targetTitle.type === 3">
            <li class="action-item theme-color theme-color-white theme-border-color" @click="onRecode">投注记录</li>
          </ul>
          <ul class="action-list theme-main-bg-5" v-else>
            <li class="action-item theme-color theme-color-white theme-border-color" @click="onEdit"
                v-if="!uid&&selectedUser&&selectedUser['associated']===1&&personalMode!=='mode_b'">修改提成
            </li>
            <li class="action-item theme-color theme-color-white theme-border-color" @click="onLook">查看报表</li>
            <li class="action-item theme-color theme-color-white theme-border-color" @click="onLower" v-if="titleInfo&&titleInfo[this.tabIndex].type=='1'">查看下级
            </li>
            <li class="action-item theme-color theme-color-white theme-border-color" @click="onChange"
                v-else-if="titleInfo&&titleInfo[this.tabIndex].type!=='1'&& !uid && personalMode!=='mode_b'">升为代理
            </li>
          </ul>

          <button class="action-cancel theme-main-bg-5 theme-color-white" @click="showActions=false">取消</button>
        </div>
      </van-popup>

      <agency-date-selector :newQP="$config.blackTheme || $config.newQP" v-model="date" :show.sync="showDateSelector" :default-index="defaultIndex || 0" @getDefaultIndex="getDefaultIndex" @okSelect="dateSelect"></agency-date-selector>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import AgencyDateSelector from '@src/components/agency-date-selector/AgencyDateSelector'
import { setTimeout } from 'timers';

export default {
  name: 'Team',
  components: { AgencyDateSelector },
  props: {
    uid: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      intallIndex:0,
      contentHeight: 0,
      count: {},
      totalCount:0,
      selectedUser: null,
      inited: false,
      defaultIndex:0,
      backEvent:false,
      tabIndex: this.$route.query.tabI || 0,
      username: '',
      lastUserName: ['', '', ''],
      date: null,
      showDateSelector: false,
      limit: 20,
      page: 0,
      loading: [
        false,
        false,
        false
      ],
      noMore: [
        false,
        false,
        false
      ],
      noData:[
        true,
        true,
        true
      ],
      titleInfo: [
        {
          name: '代理人数',
          code: 'agencyPeopleCount',
          type: 1
        },
        {
          name: '会员人数',
          code: 'memberPeopleCount',
          type: 2
        },
        {
          name: '在线人数',
          code: 'onlinePeopleCount',
          type: 3
        }
      ],
      titleList: [
        [
          {
            name: '帐号',
            code: 'userName',
            flex: 2
          },
          {
            name: '团队人数',
            code: 'agencyPeopleCount',
            flex: 2
          },
          {
            name: '团队投注',
            code: 'validBetAmount',
            order: true,
            flex: 3
          },
          {
            name: '团队盈利',
            code: 'teamNet',
            order: true,
            color: true,
            flex: 3
          }
        ],
        [
          {
            name: '帐号',
            code: 'userName',
            flex: 3
          },
          {
            name: '注册时间',
            code: 'created_at',
            order: true,
            time: true,
            flex: 3
          },
          {
            name: '余额',
            code: 'balance',
            order: true,
            color: true,
            flex: 4
          }
        ],
        [
          {
            name: '帐号',
            code: 'userName',
            flex: 3
          },
          {
            name: '投注',
            code: 'validBetAmount',
            order: true,
            flex: 3.5
          },
          {
            name: '盈利',
            code: 'profit',
            order: true,
            color: true,
            flex: 3.5
          }
        ]
      ],
      targetOrderCode: [ 'default', 'default', 'default'],
      orderByDesc: [
        'asc',
        'asc',
        'asc'
      ],
      list: [
        [],
        [],
        []
      ]
    }
  },
  computed: {
    showActions: {
      get () {
        return !!this.selectedUser
      },
      set (val) {
        if (!val) this.selectedUser = null
      }
    },
    isShowFixed(){
      return this.$store.state.main.keyBoardStatus
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
    targetTitle () {
      return this.titleInfo[this.tabIndex]
    }
  },
  watch: {
    tabIndex () {
      this.noData = [true,true,true];
      this.onRefresh()
    },
    // date () {
    //   console.log(this.date)
    //   this.targetOrderCode= [ 'default', 'default', 'default']
    // },
    targetOrderCode () {
      if(!this.$route.query.tabI){
        this.onRefresh()
      }else{
        return
      }
    },
    orderByDesc () {
      this.onRefresh()
    }
  },
  mounted () {
      setTimeout(()=>{
         this.date={
            name: '今天',
            start: this.dayJs().format('YYYY-MM-DD'),
            end: this.dayJs().format('YYYY-MM-DD')
        }
        this.onRefresh()
      },300)
      document.body.addEventListener('touchmove', function (e) {
          e.preventDefault() // 阻止默认的处理方式(阻止下拉滑动的效果)
      }, {passive: false}) // passive 参数不能省略，用来兼容ios和android
  },
  created () {

    // 代理
    // if (this.agencyType !== 'shareholder') {
    //   if (this.personalMode === 'mode_a') {
    //     this.titleInfo.splice(1, 1)
    //     this.titleList.splice(1, 1)
    //   } else if (this.personalMode === 'mode_b') {
    //     this.titleInfo.splice(0, 1)
    //     this.titleList.splice(0, 1)
    //   }
    // }
    if (this.personalMode == 'mode_a') {
      if (this.personalMode !=='shareholder') {
        this.titleInfo.splice(1, 1)
        this.titleList.splice(1, 1)
      }else{
        this.titleInfo.splice(1, 1)
      }
    }else if (this.personalMode === 'mode_b') {
      if(this.agencyType !== 'shareholder'){
        this.titleInfo.splice(0, 1)
        this.titleList.splice(0, 1)
      }else if(this.agencyType == 'shareholder' && this.$route.fullPath == '/user/agency-center-new/team'){
        this.titleInfo.splice(1, 1)
        this.titleList.splice(1, 1)
      }else if(this.agencyType == 'shareholder' && this.uid){
        this.titleInfo.splice(0, 1)
        this.titleList.splice(0, 1)
      }
    }
    this.intallIndex = JSON.parse(localStorage.teamTabIndex || 0)
    this.tabIndex = JSON.parse(localStorage.teamTabIndex || 0)
  },
  beforeRouteLeave(to, from, next) {
    if(to.fullPath=="/user/agency-center-new"){
      delete localStorage.teamTabIndex
    }
    next()
  },
  beforeRouteEnter(to, from, next){
    next(vm=>{
      if(from.path.includes('/user/agency-center-new/team/lower-report')){
        vm.backEvent = true
      }
    })
  },
  methods: {
    swiperChange(index){
      this.tabIndex = index;
    },
    dateSelect(date,index){
        this.defaultIndex = index
        this.targetOrderCode= [ 'default', 'default', 'default']
        // this.onRefresh()
    },
    goback(){
      if(this.uid) this.$router.back()
      else this.$router.push({path:`/user/agency-center-new`})
    },
    onUserClick (user) {
      localStorage.setItem('teamTabIndex',this.tabIndex)
      if (this.targetTitle.type === 3) {
        // this.$router.push({path:'/user/agency-center-new/recode/user/' + user.userName,query:{uid:user.uid}})
        this.$router.push({ path:'/user/agency-center-new/bet', query:{
          parentTabIndex: 0,
          targetComponent: 'Lottery',
          selectType: 'day',
          defaultIndex: 0,
          date: JSON.stringify({
              name: '今天',
              start: this.dayJs().format('YYYY-MM-DD'),
              end: this.dayJs().format('YYYY-MM-DD')
          }),
          uid: user.uid
        }})
      } else {
        this.selectedUser = user
      }
    },
    getDefaultIndex(date){
      // this.defaultIndex = date
    },
    onRecode () {
      const selectedUser = this.selectedUser
      this.$router.push('/user/agency-center-new/recode/user/' + selectedUser.userName)
    },
    onEdit () {
      const selectedUser = this.selectedUser
      this.selectedUser = null
      this.$router.push(`/user/agency-center-new/team/lower-edit/${selectedUser.uid}/${selectedUser.userName}/${this.titleInfo[this.tabIndex].type}`)
    },
    onLook () {
      const selectedUser = this.selectedUser
      this.selectedUser = null
      this.$router.push({
        path:`/user/agency-center-new/team/lower-report/${selectedUser.uid}/${selectedUser.userName}/${this.titleInfo[this.tabIndex].type}`,query:{date:this.defaultIndex,tabI:this.tabIndex}
      })
    },
    onLower () {
      const selectedUser = this.selectedUser
      this.selectedUser = null
      this.$router.push('/user/agency-center-new/team/' + selectedUser.uid)
    },
    onChange () {
      const selectedUser = this.selectedUser
      this.selectedUser = null
      this.$store.dispatch('agency/lowerUp', selectedUser.uid).then(res => {
        if (res.code === 200) {
          this.toastText('操作成功', 'top')
          this.onRefresh()
        } else {
          this.toastText(res.message.toString().split(' ')[0], 'top')
        }
      }).catch(err => {
        this.toastText('操作失败', 'top')
      })
    },
    onOrderChange (item, index) {
      if (item.order) {
        if (this.targetOrderCode[index] === item.code) {
          if (this.orderByDesc[index] === 'asc') this.$set(this.orderByDesc, index, 'desc')
          else this.$set(this.orderByDesc, index, 'asc')
        } else {
          this.$set(this.targetOrderCode, index, item.code)
          this.$set(this.orderByDesc, index, 'asc')
        }
      }
    },
    onSearch () {
      if (this.lastUserName[this.tabIndex] !== this.username && (this.username || this.lastUserName)) {
        this.onRefresh()
        this.lastUserName[this.tabIndex] = this.username
      }
    },
    onRefresh () {
      if(this.date){
        this.inited = false
        this.page = 0;
        this.totalCount = 0;
        this.loading[this.tabIndex] = false
        this.noMore[this.tabIndex] = false
        this.loadList(true)
      }
    },
    onLoadMore () {
      this.loadList()
    },
    loadList (status) {
      let tabIndex = this.tabIndex
      if (this.titleInfo[tabIndex].type === 1 && !this.date) return
      if (this.noMore[tabIndex]) {
        this.$set(this.loading, tabIndex, false)
        this.toastText('没有更多', 'top')
      } else {
        if (!this.loading[tabIndex]) {
          this.page++
          this.$set(this.loading, tabIndex, true)
          const data = {
            type: this.titleInfo[tabIndex].type,
            pagesize: this.limit,
            orderby: this.targetOrderCode[tabIndex],
            ascdesc: this.orderByDesc[tabIndex],
            uid: this.userInfo.uid
          }
          if (this.titleInfo[tabIndex].type === 1 && this.date) {
            data.startTime = this.date.start
            data.endTime = this.date.end
          }
          if (this.username) data.likeName = this.username
          if (this.uid && !isNaN(this.uid)) data.uid = this.uid
          if(this.page == 1){
            this.toastLoading('加载中');
          }
          
          this.$store.dispatch('agency/agencyMyteam', {
            data,
            page: this.page
          }).then(res => {
            this.$set(this.loading, tabIndex, false)
            this.$refs.listBox[tabIndex].loaded()
            if (res.code === 200) {
              this.count = res.data['dataPublic']
              if (res.data.data.length) {
                this.noData[tabIndex] = false;
                if (status){
                  this.$set(this.list, tabIndex, res.data.data);
                }else {
                  this.$set(this.list, tabIndex, this.list[tabIndex].concat(res.data.data));
                }
                if(res.data.data.length < this.limit){
                  //暂无更新数据
                  this.noMore[tabIndex] = true
                }
                this.totalCount = this.totalCount + res.data.data.length;
              } else {
                if (status) this.$set(this.list, tabIndex, res.data.data)
                this.noMore[tabIndex] = true
              }
            } else {
              this.page--
              this.toastText(res.message, 'top')
            }
          }).catch(err => {
            this.$set(this.loading, tabIndex, false)
            this.$refs.listBox[tabIndex].loaded()
            this.page--
          }).finally(()=>{
            // this.page = 0
            this.$set(this.loading, tabIndex, false)
            this.$refs.listBox[tabIndex].loaded()
            this.$refs.listBox[tabIndex].refresh()
            if(this.page == 1){
              this.toastClear();
            }
            this.$nextTick(()=>{
              let _self = this
              setTimeout(() => {
                if (_self.$refs['listBox'][_self.tabIndex].scroll){
                  _self.$refs.listBox[_self.tabIndex].scroll.scrollTo(0,0)
                }
              }, 300);
            })
          })
        }
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>

  /deep/.vux-swiper{
      height: 100vh!important;
      .vux-swiper-item{
        // position: relative!important;
      }
    }
  .title-right {
    position: absolute;
    top: 0;
    right: 0.16rem;
    font-size: 0.3rem;
    color: #444444;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-box {
    padding: 0 0.16rem 0.16rem 0.16rem;
    width: 100%;

    .action-list {
      background-color: rgba(255, 255, 255, 0.94);
      width: 100%;
      font-size: 0.36rem;
      color: #2C93FF;
      border-radius: 0.1rem;

      .action-item {
        height: 1.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 0.02rem solid #E7E7E7;
        &:last-child {
          border-bottom: none;
        }
      }
    }

    .action-cancel {
      margin-top: 0.16rem;
      width: 100%;
      background-color: #ffffff;
      height: 1.16rem;
      border-radius: 0.1rem;
      font-size: 0.36rem;
      color: #666666;
    }
  }

  .agent-team {
    .header {
      width: 7.18rem;
      margin: 0 auto;
      height: 1.46rem;
      background-size: 100%;
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      color: #FFFFff;
      border-radius: 0.1rem;
      overflow: hidden;
      background-image:url('../../../assets/img/user/dot.png');
      background-size: 100% 100%;
      // background-image: url("../../../assets/img/user/team_bg.png");
      .w50Modle{
        width:100%/2!important;
        height:1.44rem;
      }
      .theme-agent-tab{
        .bmg{
          background-image:url("../../../assets/img/user/team-left@2x.png");
          background-size: 100%;
        }
      }
      .item {
        width: 100%/3;
        height: 1.46rem;


        .bmg {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: stretch;
          .money {
            font-size: 0.34rem;
            line-height: 0.48rem;
            text-align: center;
          }

          .title {
            margin-top: 0.08rem;
            font-size: 0.3rem;
            line-height: 0.42rem;
            text-align: center;
          }

          &.active {
            background: url("../../../assets/img/agent-center-new/team/team-header-bg-active.png") no-repeat  -1.01rem 0.065rem;
            background-size: 142%;
          }
          &.w50active {
            background: url("../../../assets/img/agent-center-new/team/team-header-bg-active-50.png") no-repeat 0 0.22rem;
            background-size: 100%;
          }
          &.w50Modle{

          }
        }

        &.w50 {
          width: 100%/2;
        }

      }
    }

    .search-box {
      height: 0.9rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;

      .search-icon {
        width: 0.4rem;
        font-size: 0.38rem;
        height: 0.4rem;
        margin-right: 0.24rem;
      }

      .input {
        min-width: 0;
        flex: 1;
        font-size: 0.3rem;
        &:after {
          content: none !important;
        }
        &.black-input {
          color: #fff;
        }
      }

      .date {
        color: #999999;
        font-size: 0.3rem;
      }

      .date-icon {
        color: #767676;
        font-size: 0.3rem;
        transform: rotateZ(180deg) scale(0.5);
      }
    }

    .title-list {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      background: rgba(44, 147, 255, 0.12);
      border-radius: 0.1rem 0.1rem 0 0;
      width: 7.18rem;
      margin: 0.24rem auto 0 auto;
      font-size: 0.28rem;
      color: #444444;
      height: 0.9rem;
      font-weight: 500;
      text-align: center;
      &.black-title-list {
        background-color: #454236 !important;
      }

      .title-list-item {
        flex-shrink: 0;
        text-align: center;
        box-sizing: border-box;
        width: 100%;
        color: #555555;

        .can-order {
          padding-right: 0.3rem;
          position: relative;
          display: inline-block;          
          &:before {
            font-size: 0.26rem;
            content: '\E72B';
            position: absolute;
            right: 0;
            top: 0.03rem;
            display: inline-block;
            color:#999999;
            font: normal normal normal 10px/1 "iconfont";
            text-rendering: auto;
            -webkit-font-smoothing: antialiased;
            transform: scale(0.5);
            height: 0.2rem;
          }

          &:after {
            font-size: 0.26rem;
            // content: '\e688';
            content: '\E72B';
            position: absolute;
            // right: -0.07rem;
            // top: 0.06rem;
            right: 0;
            top:0.15rem;
            color:#999999;
            display: inline-block;
            // font: normal normal normal 22px/1 "iconfont";
            font: normal normal normal 10px/1 "iconfont";
            text-rendering: auto;
            -webkit-font-smoothing: antialiased;
             transform:rotate(180deg) scale(0.5);
            // transform: scale(0.8);
            height: 0.2rem;
          }
          &.can-order-nodata{
            &:before {
              content: none;
              display: none;
              
            }

            &:after {
              content: none;
              display: none;
            }
          }
          &.can-order-asc {

            &:before {
              color:#4D8FFA;
              
            }

            &:after {
              
            }
          }

          &.can-order-desc {

            &:before {

              
            }

            &:after {
              color:#4D8FFA;
            }
          }
        }
      }
      .title-list-item0{
        flex:3 1 0%;
      }
      .title-list-item1{
         flex:2 1 0%;
      }
      .title-list-item2{
         flex:3 1 0%;
      }
      .title-list-item3{
         flex:3 1 0%;
      }
    }

    .tab-view {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-wrap: nowrap;
      padding-bottom: 0.16rem;

      .item-list {
        overflow: hidden;
      }
    }

    .user-list {
      margin-top: 0;
      border-top-right-radius: 0;
      border-top-left-radius: 0;
      padding: 0;
      width: 7.18rem;
    }
    .item-box-x{
      /*&:after{
        position: absolute;
        box-sizing: border-box;
        content: "";
        pointer-events: none;
        right: 0;
        bottom: 0;
        left: 0;
        border-bottom: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }*/
    }
    .user-item {
      position: relative;
      display: flex;
      padding: 0;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      font-size: 0.28rem;
      color: #444444;
      height: 0.88rem;
      line-height: 0.88rem;
      text-align: center;
      border-bottom: 0.014rem solid #ebedf0;
      
      .user-item-col {
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.color {
          color: #E71414;
        }

        &.green {
          color: #00A054 !important;
        }
      }
      .user-item-col0{
        flex:3 1 0%;
      }
      .user-item-col1{
        flex:2 1 0%;
      }
      .user-item-col2{
        flex:3 1 0%;
      }
      .user-item-col3{
        flex:3 1 0%;
      }

    }
  }
</style>
