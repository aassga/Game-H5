<template>
  <view-page ref="view-page" full-box :noScroll="true" class="view-page">
    <!-- 跳转页面顶部未消失 添加判断 -->
    <title-header  slot="header" title="优惠活动" v-if="!isApp && this.$router.history.current.name === 'activity'" class="theme-header-bg theme-header-bottom"></title-header>
    <div slot="content"
      :class="[{qpBox:($config.home==='qp' || $config.blackTheme) && $config.name !== 'betnew'},
               {'black-box':$config.blackTheme},
               {'blush-box':$config.blush}]"
      :style="{minHeight:$store.state.main.windowHeight - (0.88 * rem)+'px'}">
      <scroll-area
        @load-down="onLoadMore"
        :onDownMore="true"
        :style="{maxHeight:$store.state.main.windowHeight - (0.88 * rem)+'px'}"
        ref="scroll-page"
        :deceleration="0.0008"
      >
        <!--      <van-tabs id="tab1" ref="tab1" v-if="headerList" v-model="type" lineWidth="50px"-->
        <van-tabs id="tab1" ref="tab1" v-if="headerList" v-model="type" lineWidth="50px" :border="false" swipe-threshold="4"
                  @click="onTagClick" class="scrollable-box" :class="[{'newqpStyle':$config.newQP || $config.blackTheme},{'blushStyle':$config.blush}]" line-height="3px">
          <div class="more" v-if="more && headerList.length > 4" @click="hideMore">
            <!--        <div class="more" v-if="more" @click="hideMore">-->
            <img :src="bgurl"/>
          </div>
          <van-tab class="game-type-item theme-bg-active" v-if="tag.id" :class="{active:type===tag.id}"
                   v-for="(tag, i) in headerList" :key="i" :title="tag.activity_cate_name">
          </van-tab>
        </van-tabs>
        <ul v-if="!$config.activityType" class="list">
          <div v-if="$config.activeShowJgjCont">
            <li class="item" v-for="(item, i) in show_active_list" :key="i">
              <div @click="onClick(item)" v-if="item.is_show_banner === 'yes'">
                <img class="img" alt="" :src="item.img">
                <span class="title" v-if="type !== 1">{{item.title1}}</span>
              </div>
              <div :class="['content',['99qp','kkqp','amxpj'].includes($config.name)&&type==1 ?'specialContent':'']" v-if="item.is_show_content === 'yes' && type === 1" v-html="item.description"></div>
            </li>
          </div>
          <div v-else>
            <li class="item" v-for="(item, i) in show_active_list" :key="i" @click="onClick(item)">
              <img class="img" alt="" :src="item.img">
              <span class="title">{{item.title1}}</span>
            </li>
          </div>
        </ul>
        <ul v-else-if="$config.activityType === 'k8'" class="list k8">
          <li class="item item-k8" v-for="(item, i) in show_active_list" :key="i" @click="onClick(item)">
            <img class="img" alt="" :src="item.img">
            <span class="title">{{item.title1}}</span>
          </li>
        </ul>
        <ul v-else-if="$config.activityType === 'test1'" class="list test1">
          <li class="item item-test1" v-for="(item, i) in show_active_list" :key="i" @click="onClick(item)">
            <img class="img" alt="" :src="item.img">
            <span class="title">{{item.title1}}</span>
            <p class="time" v-if="item.offline_time"><span>{{item.online_time}}</span>-<span>{{item.offline_time}}</span></p>
            <p class="time" v-else>永久上架</p>
          </li>
        </ul>
        <ul v-else-if="$config.activityType === 'klk'" class="list">
          <li class="item item-klk" v-for="(item, i) in show_active_list" :key="i" @click="onClick(item)"
              v-show="item.status === 'yes'">
            <div class="box">
              <img class="img" alt="" :src="item.img">
              <div class="box-title">
                <div class="title1">{{item.title1}}</div>
                <div class="title2">{{item.title2}}</div>
                <button :class="[{openLink:!item.showJump},'btn-1']">显示详情</button>
                <button class="btn-2" v-if="item.showJump" @click.stop="activeJumpUrl(item.jump_button_url)">{{item.jump_button_name}}</button>
              </div>
            </div>
          </li>
        </ul>
        <ul v-else-if="$config.activityType === 'title-top'" class="list">
          <li class="item" v-for="(item, i) in show_active_list" :key="i" @click="onClick(item)">
            <span class="title">{{item.title1}}</span>
            <img class="img" alt="" :src="item.img">
          </li>
        </ul>
        <ul v-else-if="$config.activityType === 'no-title'" class="list">
          <li class="item item-no-title" v-for="(item, i) in show_active_list" :key="i" @click="onClick(item)">
            <img class="img" alt="" :src="item.img">
          </li>
        </ul>
        <ul v-else-if="$config.activityType === 'no-title-cjw'" class="list no-title-cjw">
          <li class="item item-no-title-cjw" v-for="(item, i) in show_active_list" :key="i" @click="onClick(item)">
            <img class="img" alt="" :src="item.img">
          </li>
        </ul>
        <ul v-else-if="$config.activityType === 'no-pic'" class="list no-pic">
          <li class="item-no-pic" v-for="(item, i) in show_active_list" :key="i" @click="onClick(item)">
            <div class="media-object-section no-padding">
              <div class="number" :style="{background: (item.bgc || '#d53b2b')}">
                <span>{{i + 1}}</span>
              </div>
            </div>
            <div class="media-object-section content">
              <div class="title">{{item.title1}}</div>
              <p>{{item.title2}}</p>
            </div>
            <div class="icon-right"><i class="van-icon van-icon-arrow"></i></div>
          </li>
        </ul>
      </scroll-area>
    </div>
  </view-page>
</template>

<script>
import scrollArea from '@src/components/scroll-area'

export default {
  name: 'activity',
  components: {
    scrollArea
  },
  computed: {
    bgurl () {
      // let bgTheme1 = this.$config.theme;
      // console.log(bgTheme1)
      // console.log(this.$store.state.main.theme)
      // let bgTheme = localStorage.theme ? localStorage.theme : 'default'
      let bgTheme = this.$store.state.main.theme
      if(this.$config.home==='qp' || this.$config.blackTheme || this.$config.blush){
        return require(`../../assets/img/activity/more_black.png`)
      }else{
        return require(`../../assets/img/activity/more_${bgTheme}.png`)
      }
    }
  },
  data () {
    return {
      more: false,
      tabLength: 0,
      lineWidth: '61px',
      active_list: [],
      show_active_list: [],
      activityList: [],
      headerList: [{
        activity_cate_name: '全部优惠',
        id: -1
      }],
      type: 0,
      bgc: ['#d5465b', '#2e85d5', '#d5519d', '#0fd59c', '#d5a99d', '#2ec3d5', '#7cd52f', '#d5824f', '#5576d5', '#d5ce36'],
      num: 0,
      pageShowList: 10,
      currentPage: 0
    }
  },
  created () {
    /* 获取活动分类 */
    // console.log(this.$config)
    this.$store.dispatch('main/getActivityCateList', {
      callback: res => {
        // console.log(res)
        if (res && res.code === 200) {
          // 获取数据成功
          this.headerList = [{
            activity_cate_name: '全部优惠',
            id: -1
          }]
          res.data && res.data.map((item, index) => {
            this.headerList.push(item)
          })
          this.$nextTick(() => {
            if(this.$route.query.activityId) {
              this.type = Number(this.$route.query.activityId)
            }
          })
        }
        // console.log(this.headerList)
      }
    })
    /* 获取活动详情 */
    let data = {
      client_type: 'mobile'
    }
    if (this.$route.query.preview) {
      data.preview = 1
    }
    this.$store.dispatch('main/activityList', {
      data: data,
      callback: res => {
        if (res && res.code === 200) {
          this.active_list = this.activityList = res.data.map((item, index) => {
            if (item.description) {
              try {
                item.description = JSON.parse(item.description)
              } catch (e) {
                item.description = null
              }
            }
            if (item.image) {
              try {
                item.image = JSON.parse(item.image)
              } catch (e) {
                item.image = null
              }
            }
            if (item.url_link) {
              try {
                item.url_link = JSON.parse(item.url_link)
              } catch (e) {
                item.url_link = null
              }
            }
            if (item.jump_button_name && item.jump_button_url) {
              if (item.jump_switch) {
                this.$store.state.user.userInfo ? item.showJump = true : item.showJump = false
              } else {
                item.showJump = true
              }
            } else {
              item.showJump = false
            }
            // return item
            let obj = {}
            obj.title1 = item.title
            obj.title2 = item['child_title']
            obj.img = item['image'].mobile
            obj.id = item.id
            obj.activity_cate_id = item.activity_cate_id
            obj.status = item.status
            obj.login = false
            obj.online_time = item.online_time ? this.formatDate(item.online_time) : item.online_time
            obj.offline_time = item.offline_time ? this.formatDate(item.offline_time) : false
            obj.jump_button_name = item.jump_button_name
            obj.jump_button_url = item.jump_button_url
            obj.jump_switch = item.jump_switch
            obj.showJump = item.showJump
            obj.is_show_banner = item.is_show_banner
            obj.is_show_content = item.is_show_content
            obj.description = item.description.mobile
            if (index <= this.bgc.length) {
              this.num = index
            } else {
              this.num = index % this.bgc.length
            }
            obj.bgc = this.bgc[this.num]
            if (item['read_status'] === 'login_after' && !localStorage.token) {
              obj.type = 'login'
              obj.param = '请登录'
            } else if (item['activity_status'] === 0) {
              obj.type = 'dialog'
              obj.param = '精彩活动，敬请期待！'
            } else if (item['activity_type'] === 'url_activity') {
              obj.type = 'single'
              obj.param = item['url_link'].mobile
              if (obj.param.includes('http')) {
                obj.type = 'other'
              }
            } else if (item['activity_type'] === 'apply_activity') {
              obj.type = 'apply'
            } else {
              obj.type = 'content'
            }
            return obj
          })
          if (this.active_list.length > this.pageShowList) {
            this.show_active_list = JSON.parse(JSON.stringify(this.active_list.slice(0, this.pageShowList)))
          } else {
            this.show_active_list = JSON.parse(JSON.stringify(this.active_list))
          }
        } else {
          this.toastText(res.message, 'middle')
        }
      }
    })
  },
  mounted () {
    // this.totalLength()
    // 活动导航滑动隐藏更多
    this.$nextTick(() => {
      // this.totalLength()
      let that = this
      setTimeout(() => {
        this.totalLength()
        /* if (this.tabLength <= window.screen.width + 20) {
              this.more = false
            } */
        // console.log( document.getElementById('tab1'))
        document.getElementById('tab1').addEventListener('touchmove', function (e) {
          that.hideMore()
        }, { passive: false })
      }, 200)
    })
    /*  document.getElementById('#tab1').addEventListener('touchmove', function (e) {
            console.log(1111)
          }, { passive: false }) */
  },
  updated() {
    window.onresize()
  },
  methods: {
    onLoadMore () {
      let maxPage = Math.floor(this.active_list.length / this.pageShowList)
      if (maxPage > 0) {
        this.currentPage += 1
        if (maxPage === this.currentPage) {
          this.pushList(
            this.active_list.slice(
              this.currentPage * this.pageShowList,
              this.active_list.length
            )
          )
        } else if (maxPage > this.currentPage) {
          this.pushList(
            this.active_list.slice(
              this.currentPage * this.pageShowList,
              (this.currentPage + 1) * this.pageShowList
            )
          )
        }
      }
      this.$nextTick(res => {
        this.$refs['scroll-page'].refresh()
      })
    },
    pushList (list) {
      this.show_active_list.push(...list)
    },
    hideImg (name, title) {
      /* if (title.length == 3) {
             this.lineWidth = '50px'
           } else if (title.length == 4) {
             this.lineWidth = '60px'
           } else {
             this.lineWidth = '30px'
           } */
    },
    totalLength () {
      this.tabLength = 0
      // console.log(document.getElementById('tab1').firstChild.firstChild.childNodes)
      // console.log(document.getElementById('tab1').firstChild.firstChild.lastChild)
      let lastLength = document.getElementById('tab1').firstChild.firstChild.lastChild.offsetWidth
      let tabs = document.getElementById('tab1').firstChild.firstChild.childNodes
      // let tabs = this.$refs.tab1
      // console.log(document.getElementById('tab1').children[0].children[0].children)
      // let tabs = document.getElementById('tab1').children[0].children[0].children
      for (let i of tabs) {
        // console.log(i.offsetWidth)
        this.tabLength += i.offsetWidth
      }
      this.tabLength = this.tabLength - lastLength
      if (this.tabLength > window.screen.width + 10) {
        this.more = true
      }
    },
    hideMore () {
      /* this.totalLength() */
      this.more = false
    },
    onTagClick (name, title) {
      // console.log(name)
      // console.log(this.headerList[name].id)
      // console.log(this.activityList)
      if (name !== 0) {
        this.active_list = this.activityList.filter((item, index) => {
          // console.log(item.activity_cate_id)
          if (item.activity_cate_id.includes(this.headerList[name].id)) {
            return item
          }
        })
      } else {
        this.active_list = this.activityList
      }
      this.currentPage = 0
      if (this.active_list.length > this.pageShowList) {
        this.show_active_list = JSON.parse(JSON.stringify(this.active_list.slice(0, this.pageShowList)))
      } else {
        this.show_active_list = JSON.parse(JSON.stringify(this.active_list))
      }
    },
    onClick (item) {
      switch (item.type) {
        case 'login':
          this.showIosAlert({
            content: item.param,
            okText: this.isApp ? '确定' : '登录',
            showNo: !this.isApp,
            okCallback: () => {
              this.goNewLogin()
              return true
            }
          })
          break

        case 'dialog':
          this.showIosAlert({
            content: item.param,
            showNo: false
          })
          break

        case 'content':
          if (this.type !== 1 || !['935qp', 'kyqp', '632qp', '839qp', 'k78qp'].includes(this.$config.name)) {
            this.$router.push({
              path: '/activity/content/',
              query: {
                id: item.id,
                app: this.isApp ? '1' : ''
              }
            })
          }
          break
        case 'single':
          if (this.isApp) window.location.href = window.location.origin + item.param + '?app=app'
          else window.location.href = window.location.origin + item.param
          break

        case 'other':
          window.open(item.param, '_blank')
          break
      }
    },
    activeJumpUrl (link) {
      window.open(link)
    },
    formatDate (date) {
      let myDate = new Date(date * 1000)
      let y = myDate.getFullYear()
      let m = myDate.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = myDate.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '/' + m + '/' + d
    }
  },
  beforeRouteEnter (to, from, next) {
    let currentTop = localStorage.contentScrollTop
    next(vm => {
      vm.$nextTick(() => {
        if (from.name == 'ActivityContent') {
          if (vm.$refs['scroll-page'] && vm.$refs['scroll-page'].scroll) {
            setTimeout(() => {
              vm.$refs['scroll-page'].scroll.scrollTo(0, +currentTop, 0)
              vm.$refs['scroll-page'].refresh()
              vm.$refs['scroll-page'].scroll.refresh()
            }, 20)
          }
        }
      })
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'ActivityContent') {
      this.$store.commit('main/noKeepAlive', from.name)
    } else {
      localStorage.contentScrollTop = this.$refs['scroll-page'].scroll.absStartY
    }
    next()
  }
}
</script>

<style type="text/less" lang="less" rel="stylesheet" scoped>
  /deep/ .van-tabs::after {
    position: absolute;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 0;
    bottom: 0;
    left: 0;
    border-bottom: 0.02rem solid #ebedf0;
    -webkit-transform: scaleY(0.6);
    transform: scaleY(0.6);
  }

  /deep/ .van-tabs--line {
    font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 400;

    .more {
      width: 1.64rem;
      height: 0.7rem;
      position: absolute;
      right: 0;
      top: 0.05rem;
      /*background-image: url(../../assets/img/activity/more_default.png);*/
      background-size: 100% 100%;

      img {
        width: 100%;
        display: block;
      }
    }

    .van-tabs__wrap {
      text-align: left;
      height: 0.84rem;
      // border-bottom: 0.02rem solid #ebedf0;
      &:after {
        /*border-width: 0 0 0.04rem;*/
        /*border-color: #dadada;*/
      }

      .van-tabs__nav--line {
        padding-bottom: 0;
        /*display: flex;*/
        /*text-align: left;*/

        .van-tab {
          color: #333333;
          line-height: 0.84rem;
          padding: 0 0.25rem;
          flex: unset;
        }

        .van-tabs__line {
          bottom: 0;
          border-radius: unset !important;

        }

        .van-tab--active {
          font-weight: 400 !important;
        }
      }
    }

  }

  /*未完成自适应*/
  /deep/ .tab1 {
    .van-tabs__wrap {
      .van-tabs__nav--line {
        display: flex;
        justify-content: space-around;

        .van-tab {
          color: #333333;
          line-height: 0.84rem;
          padding: 0 0.25rem;
          flex-basis: unset !important;

          .van-ellipsis {
            overflow: auto;
            white-space: unset;
            text-overflow: unset;
          }
        }

        .van-tabs__line {
          bottom: 0;
          border-radius: unset !important;

        }

        .van-tab--active {
          font-weight: 400 !important;
        }
      }
    }

  }

  .view-page {
    .list {
      padding: 0.2rem;
      background-color: #fff;
      /* &.k8 {
         background-color: #141414;
       }*/
      &.test1 {
        padding: 0.2rem 0;
      }
      &.no-pic {
        padding: 0.2rem 0;
        background-color: inherit;
      }

      &.no-title-cjw {
        overflow: hidden;
      }
    }

    .item {
      position: relative;
      margin-bottom: 0.2rem;
      box-sizing: border-box;
      width: 100%;
      display: block;
      border: 0.02rem solid #ebedf0;
      border-radius: 0.1rem;
      overflow: hidden;
      /*&.van-hairline--surround::after {
        !*border-width: 0.04rem;*!
        border-radius: 0.1rem;
        !*transform: scaleY(.5);*!
        overflow: hidden;
      }*/
      /* &::after {
         position: absolute;
         box-sizing: border-box;
         content: ' ';
         pointer-events: none;
         top: -50%;
         right: -50%;
         bottom: -50%;
         left: -50%;
         border: 0.02rem solid #ebedf0;
         border-radius: 0.1rem;
         transform: scale(1);
       }*/

      &.item-k8 {
        .img {
          margin-bottom: 8px;
          border-radius: 8px;
        }

        .title {
          font-size: 18px;
          font-weight: 700;
          line-height: 22px;
          height: auto;
          color: #000000;
          padding-left: 0;
          /*margin-bottom: 4px;*/
        }

        border: none;
        /*border-bottom: 0.02rem solid #ebedf0;*/
        border-radius: unset;
        margin-bottom: 8px;
      }

      &.item-test1 {
        .img {
          vertical-align: middle;
          /*margin-bottom: 8px;*/
          /*border-radius: 8px;*/
        }

        .title {
          position: absolute;
          right: 0.5rem;
          top: 0.2rem;
          text-align: right;
          font-family: Microsoft YaHei;
          font-size: 0.3rem;
          font-weight: 700;
          line-height: unset;
          height: auto;
          color: #333333;
          padding-left: 0;
          /*margin-bottom: 4px;*/
        }
        .time {
          position: absolute;
          right: 0.5rem;
          top: 0.64rem;
          text-align: right;
          font-family: Microsoft YaHei;
          font-size: 12px;
          color: #6c7c9d;
        }

        border: none;
        /*border-bottom: 0.02rem solid #ebedf0;*/
        border-radius: unset;
        margin-bottom: 0.1rem;
      }

      &.item-klk {
        margin-bottom: 0.15rem;
        width: 100%;
        display: block;
        overflow: hidden;
        /*border: none;*/

        .box {
          display: flex;
          align-items: center;
          padding: 0.1rem;
          background: #f3f3f3;
          /* border: 0.01rem solid #ebedf0;
           border-radius: 0.1rem;*/

          .img {
            width: 55%;
            border-radius: 0.1rem;
            display: block;
          }

          .box-title {
            width: 45%;
            padding-left: 0.2rem;
            display: block;
            vertical-align: middle;
            line-height: 1;
            text-align: left;
            overflow: hidden;

            .title1 {
              color: #fd4746;
              font-size: 0.3rem;
              line-height: 1.8;
            }

            .title2 {
              color: #9c6a39;
              font-size: 0.25rem;
              line-height: 2.2;
            }

            .btn-1, .btn-2 {
              background: #bb9a55;
              color: #ffffff;
              width: 1.4rem;
              height: .75rem;
              line-height: .75rem;
              text-align: center;
              border-radius: 0.1rem;
              border: none;
              font-size: 0.3rem;

              &.btn-1 {
                float: left;

                &.openLink {
                  float: right;
                }
              }

              &.btn-2 {
                float: right;
              }
            }
          }
        }
      }

      &.item-no-title {
        border: none;
      }

      &.item-no-title-cjw {
        border: none;
        width: 49%;
        float: left;
      }

      &.item-no-title-cjw:nth-child(odd) {
        margin-right: 2%;
      }

      .title {
        /*border-bottom: 0.02rem solid #e6eaed;*/
        box-sizing: border-box;
        font-size: 0.32rem;
        line-height: 0.72rem;
        height: 0.72rem;
        display: block;
        width: 100%;
        font-weight: 700;
        color: #333333;
        padding-left: 10px;
        text-align: left;
      }

      .img {
        width: 100%;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        display: block;
      }
    }

    .item-no-pic {
      margin: 0 auto 0.3rem;
      background: #fff;
      padding: 0.15rem 0;
      position: relative;
      overflow: hidden;
      text-decoration: none;
      color: #000;
      display: -webkit-box;
      display: flex;
      flex-wrap: nowrap;

      .media-object-section {
        -webkit-box-flex: 0;
        flex: 0 1 auto;
      }

      .number {
        width: 3.15em;
        height: 3.15em;
        line-height: 3.15em;
        text-align: center;
        border-radius: 50%;
        background: #fe8580;
        color: #fff;
        float: left;
        margin-left: .3rem;
        margin-top: .1em;
        margin-right: .2rem;
        position: relative;

        span {
          font-size: 1em;
          color: white;
        }

        &::before {
          content: '';
          text-align: center;
          display: inline-block;
          line-height: 2em;
          width: 2em;
          height: 2em;
          border: 1px solid;
          border-radius: 50%;
          font-size: .8em;
          margin-top: .5em;
          padding: .1em;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
        }
      }

      .content {
        width: 4.9rem;
        text-align: left;

        .title {
          font-size: 1.25em;
          letter-spacing: .05em;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          line-height: 1.4;
        }

        .title + p {
          color: #686868;
          font-size: 1.1em;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          margin: 0;
        }
      }

      .icon-right {
        position: absolute;
        font-size: 0.4rem;
        right: 0.1em;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        width: 1em;
        height: 1em;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        top: 50%;
        margin-top: -0.5em;
        color: #989898;
      }
    }

    /deep/ .content {
      padding: 2%;

      .red {
        color: #ff0000;
        font-weight: bold;
      }

      img {
        width: 100%;
      }

      h4,
      h2 {
        font-size: 0.26rem;
        margin: 0.3rem 0 0.1rem;
        font-weight: bold;
        text-align: left;
        color: #000;
      }

      h4:first-child,
      h2:first-child {
        margin: 0.1rem 0 0.1rem;
      }

      p {
        font-size: 0.24rem;
        margin: 0;
        font-weight: bold;
        text-align: left;
        color: #000;
        line-height: 1.8;
      }

      table {
        width: 100%;
        font-size: 0.28rem;
        margin-bottom: 0.2rem;
        text-align: center;
        border: 1px solid #bdbfc2;
        border-spacing: 0;
        border-collapse: collapse;
        color: #000000;

        .firstRow {
          background: #dcdcdc;
          color: #000000;
          border-bottom: 1px solid #bdbfc2;

          td {
            font-weight: bold;
          }
        }

        td {
          padding: 5px 0;
          border: 1px solid #bdbfc2;
          vertical-align: middle;
          font-weight: bold;
          font-size: 0.24rem;
        }
      }

      .text {
        p {
          position: relative;
          padding-left: 0.3rem;

          .num {
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }
    }
    //荣耀vip
  // /deep/ .specialContent{
  //   table{
  //      color: #e5dbc6;
  //   }
  //   p{
  //     color:#fff;
  //   }
  // }
    /deep/ .specialContent{

    table{
       color: #fff;
         .firstRow {
        background: #2A2928;
        background:linear-gradient(  #443828,#a38c6c  );
        color: #fff!important;
        border-bottom: 1px solid#443828;
      }
          td{
           border: 1px solid #443828!important;
        }
    }
    p{
      color:#fff;
    }
  }


   /deep/ .qpBox{
      .van-tabs::after{
         border-bottom: 0.02rem solid #3c3c3c!important;
       }
     .van-tabs__wrap{
       .van-tabs__nav{
         background: #111!important;
       }
       .van-tab--active{
         color: #fff!important;
       }
       .van-tab{
         color:#aeaeae;
       }
     }
      background: #111;
      .list{
        background: #111;
        .item{
          border: 0.02rem solid #303030;
          .title{
            color: #fff;
          }
        }
      }
    &.black-box {
      .van-tabs::after{
         border-bottom: none !important;
      }
    }
  }
  /deep/ .blush-box {
    .van-tabs::after{
         border-bottom: 0.02rem solid #530107!important;
       }
     .van-tabs__wrap{
       .van-tabs__nav{
        background: linear-gradient(0deg, #9D010F, #72010B)!important;
       }
       .van-tab--active{
         color: #FBD67A!important;
       }
       .van-tab{
         color:#fff;
       }
     }
      background: #530107;
      .list{
        background: #530107;
        .item{
          border: none;
          background-color: #640009;
          .title{
            color: #FBD67A;
            font-weight: normal;
          }
        }
      }
  }
  }
</style>
