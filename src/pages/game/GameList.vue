<template>
  <view-page style="background-color: #fff" full-box ref="view-page">
    <div class="game-header theme-bg" slot="header">
      <span class="header-back fa fa-fw fa-angle-left" @click="$router.back()"></span>
      <input v-model="searchText" type="text" class="search-input" placeholder="关键词搜索"/>
      <button class="search-btn" @click="onSearch">搜索</button>
      <span class="header-menu fa fa-fw fa-list-ul" @click="showMenu=true"></span>
    </div>

    <div slot="static" >
      <van-popup v-model="showMenu" position="right" class="game-right-menu" style="background-color: #ffffff !important;" get-container="body">
        <h4 class="game-right-menu-header theme-color">游戏平台</h4>
        <ul class="game-type-list">
          <li class="game-type-item theme-bg-active" :class="{active:targetId===type.id}" @click="targetId=type.id;upid = type.upid;$refs['view-page'].scroll.scrollTo(0,0,0)"
              v-for="(type, i) in gameTypeList" :key="i">
            {{type.name}}
          </li>
        </ul>

        <div class="game-right-menu-hr"  v-if="(rollList[targetId]&&rollList[targetId].type&&rollList[targetId].type.length) && upid != 10004"></div>

        <h4 class="game-right-menu-header theme-color"
            v-if="(rollList[targetId]&&rollList[targetId].type&&rollList[targetId].type.length)  && upid != 10004 ">
          类型
        </h4>
        <ul class="game-type-list"
            v-if="(rollList[targetId]&&rollList[targetId].type&&rollList[targetId].type.length)  && upid != 10004">
          <li class="game-type-item theme-bg-active" :class="{active:type===tag.tag}" @click="type=tag.tag;$refs['view-page'].scroll.scrollTo(0,0,0)"
              v-for="(tag, i) in rollList[targetId].type" :key="i">
            {{tag.name}}
          </li>
        </ul>

        <div class="game-right-menu-hr"
             v-if="(rollList[targetId]&&rollList[targetId].line&&rollList[targetId].line.length) && upid != 10004"></div>

        <h4 class="game-right-menu-header theme-color"
            v-if="(rollList[targetId]&&rollList[targetId].line&&rollList[targetId].line.length) && upid != 10004">
          赔付线
        </h4>
        <ul class="game-type-list"
            v-if="(rollList[targetId]&&rollList[targetId].line&&rollList[targetId].line.length) && upid != 10004">
          <li class="game-type-item theme-bg-active" :class="{active:line===tag.tag}" @click="line=tag.tag;$refs['view-page'].scroll.scrollTo(0,0,0)"
              v-for="(tag, i) in rollList[targetId].line" :key="i">
            {{tag.name}}
          </li>
        </ul>

        <div class="game-right-menu-hr"
             v-if="(rollList[targetId]&&rollList[targetId].thirt&&rollList[targetId].thirt.length) && upid != 10004"></div>

        <h4 class="game-right-menu-header theme-color"
            v-if="(rollList[targetId]&&rollList[targetId].thirt&&rollList[targetId].thirt.length) && upid != 10004">
          游戏风格
        </h4>
        <ul class="game-type-list"
            v-if="(rollList[targetId]&&rollList[targetId].thirt&&rollList[targetId].thirt.length) && upid != 10004">
          <li class="game-type-item theme-bg-active" :class="{active:thirt===tag.tag}" @click="thirt=tag.tag;$refs['view-page'].scroll.scrollTo(0,0,0)"
              v-for="(tag, i) in rollList[targetId].thirt" :key="i">
            {{tag.name}}
          </li>
        </ul>
      </van-popup>
    </div>

    <div class="game-content" slot="content" :class="'games'+targetId">
      <van-tabs v-if="rollList[targetId]&&rollList[targetId].type&&rollList[targetId].type.length" v-model="tagIndex"
                @click="onTagClick" class="scrollable-box" :line-height="2">
        <van-tab class="game-type-item theme-bg-active" :class="{active:type===tag.tag}"
                 v-for="(tag, i) in rollList[targetId].type" :key="i" :title="tag.name">
        </van-tab>
      </van-tabs>
      <div v-if="targetType" class="game-prize-pool">
        <p class="game-prize-pool-title theme-color">{{targetType.name}}总奖池</p>
        <div class="game-prize-pool-content">
          <ul class="list rmb">
            <li class="item rmb" style="left: 1.42rem">{{prizePollVal[0]}}</li>
            <li class="item rmb" style="left: 1.90rem">{{prizePollVal[1]}}</li>
            <li class="item rmb" style="left: 2.36rem">{{prizePollVal[2]}}</li>
            <li class="item rmb" style="left: 2.79rem">{{prizePollVal[3]}}</li>
            <li class="item rmb" style="left: 3.24rem">{{prizePollVal[4]}}</li>
            <li class="item rmb" style="left: 3.68rem">{{prizePollVal[5]}}</li>
            <li class="item rmb" style="left: 4.12rem">{{prizePollVal[6]}}</li>
            <li class="item rmb" style="left: 4.54rem">{{prizePollVal[7]}}</li>
            <li class="item rmb" style="left: 4.98rem">{{prizePollVal[8]}}</li>
            <li class="item rmb" style="left: 5.42rem">{{prizePollVal[9]}}</li>
            <li class="item rmb" style="left: 5.86rem">{{prizePollVal[10]}}</li>
            <li class="item rmb" style="left: 6.30rem">{{prizePollVal[11]}}</li>
            <li class="item rmb" style="left: 6.74rem">{{prizePollVal[12]}}</li>
          </ul>
        </div>
      </div>
      <ul class="game-list">
        <li class="game-item" v-for="(game, i) in targetGameList" :key="i" @click="onGameClick(game)">
          <div class="icon" v-lazy:background-image="game.icon" style="background-size:100% 100%;background-position:center;"></div>
          <span class="name">{{game.name}}</span>
          <!-- <button class="game-btn" @click="onGameClick(game)">立刻游戏</button> -->
          <!--            <button class="game-btn game-btn-try theme-bg" style="margin-top: 0.1rem" @click="tryGame(game)" v-if="noLogin">-->
          <!--              立刻试玩-->
          <!--            </button>-->
        </li>
      </ul>
      <div class="none" v-if="targetGameList.length===0">
        <img src="../../assets/img/no-data.png" alt="">
        <p>暂无游戏</p>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import rollList from './roll-list'

export default {
  name: 'GameList',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showNoticeDialog: false,
      notices: [],
      noticeIndex: 0,
      show: true,
      showMenu: false,
      gameTypeList: [],
      targetId: '',
      targetGameList: [],
      baseTargetGameList: [],
      targetType: null,
      prizePollVal: '',
      timeTask: null,
      type: '',
      line: '',
      thirt: '',
      searchText: '',
      rollList,
      upid :''
    }
  },
  computed: {
    noLogin () {
      return !this.$store.state.user.token
    },
    noticeContent () {
      if (this.notices[this.noticeIndex]) {
        return this.notices[this.noticeIndex]
      } else {
        return null
      }
    },
    tagIndex: {
      get () {
        if (this.rollList[this.targetId] && this.rollList[this.targetId].type && this.rollList[this.targetId].type.length) {
          return this.rollList[this.targetId].type.indexOf(this.type)
        } else {
          return 0
        }
      },
      set (val) {
        if (this.rollList[this.targetId] && this.rollList[this.targetId].type && this.rollList[this.targetId].type.length) {
          this.type = this.rollList[this.targetId].type[val].tag
        } else {
          this.type = ''
        }
      }
    }
  },
  watch: {
    type () {
      if (this.rollList[this.targetId] && this.rollList[this.targetId].type && this.rollList[this.targetId].type.length) {
        this.rollList[this.targetId].type.forEach((type, i) => {
          if (type.tag === this.type) {
            this.tagIndex = i
            return false
          }
        })
      } else {
        this.type = ''
      }
      this.filterGameList()
    },
    showNoticeDialog () {
      if (this.showNoticeDialog) {
        this.$nextTick(() => {
          if (this.$refs['notice-scroll']) {
            this.$refs['notice-scroll'].refresh()
            this.domResize.bind(this.$refs['notice-scroll-content'], () => {
              this.$refs['notice-scroll'].refresh()
            })
          }
        })
      }
    },
    targetId () {
      this.targetType = this.gameTypeList.find(type => Number(type.id) === this.targetId)
      this.searchText = this.thirt = this.type = this.line = ''
      this.tagIndex = 0
      this.getGameList()
    },
    line: 'filterGameList',
    thirt: 'filterGameList'
  },
  created () {
    this.getTypes()
    this.timeTask = setInterval(() => {
      const prizePollVal = ('¥' + Date.now().toString().substr(2, 11)).split('')
      prizePollVal.splice(10, 0, '.')
      this.prizePollVal = prizePollVal
    }, 88)
  },
  mounted () {
    // if (this.$store.state.main.showDialog.game[localStorage.token ? 'login' : 'noLogin']) {
    //   setTimeout(() => {
    //     this.getDialogNotice()
    //   }, 300)
    // }
  },
  beforeDestroy () {
    if (this.timeTask) {
      clearInterval(this.timeTask)
    }
  },
  methods: {
    tryGame (game) {
      if (this.$config.preview) {
        this.previewAlert()
        return
      }
      const newWin = window.open('', '_blank')
      this.testLogin(() => {
        this.$store.dispatch('games/gameLoginNew', game.id).then(res => {
          if (res.code === 200) {
            if (newWin) {
              newWin.location.href = res.data.url
            } else {
              window.location.href = res.data.url
            }
            return true
          } else if (res.message) {
            if (newWin) newWin.close()
            this.toastText(res.message, 'top')
          } else if (res.msg) {
            if (newWin) newWin.close()
            this.toastText(res.msg, 'top')
          }
        })
      }, () => {

      })
    },
    onNoticeOk () {
      this.showNoticeDialog = false
      setTimeout(() => {
        this.noticeIndex++
        this.$nextTick(() => {
          if (this.noticeContent) {
            this.showNoticeDialogs()
          } else {
            this.noticeIndex = 0
          }
        })
      }, 500)
    },
    showNoticeDialogs () {
      if (!this.show) {
        return false
      }

      if (this.noticeContent) {
        this.showNoticeDialog = true
      }
    },
    getDialogNotice () {
      this.$store.state.main.showDialog.game[localStorage.token ? 'login' : 'noLogin'] = false

      this.$store.dispatch('main/getPopups', {
        position: 1,
        status: localStorage.token ? 2 : 1
      }).then(res => {
        if (res.code === 200) {
          if (res.data.data.length) {
            this.notices = res.data.data.filter(item => item.status === 'yes')
            this.$nextTick(() => {
              setTimeout(() => {
                this.showNoticeDialogs()
              }, 500)
            })
          }
        }
      })
    },
    onTagClick (index, title) {
      this.type = this.rollList[this.targetId].type[index].tag
    },
    onSearch () {
      this.filterGameList()
    },
    filterGameList () {
      this.targetGameList = this.baseTargetGameList.filter(item => {
        let temp = true

        temp = temp && (this.type ? item.tag.includes(this.type) : true)
        temp = temp && (this.line ? item.tag.includes(this.line) : true)
        temp = temp && (this.thirt ? item.tag.includes(this.thirt) : true)
        temp = temp && (this.searchText ? item.name.includes(this.searchText) : true)

        return temp
      })
    },
    getGameList () {
      if (this.targetId) {
        this.$store.dispatch('main/gameSort', {
          id: this.targetId,
          callback: (res, id) => {
            if (this.targetId === id && res && res[this.targetId]) {
              this.targetGameList = this.baseTargetGameList = res[this.targetId]
            }
          }
        })
      }
    },
    getTypes () {
      this.$store.dispatch('main/gameSort', {
        id: '10001|10004',
        callback: res => {
          if (res && res['10001'] && res['10004']) {
            this.gameTypeList = res['10004'].concat(res['10001'])
            this.targetId = parseInt(this.id) || (this.gameTypeList[0] ? this.gameTypeList[0].id : '')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" type="text/less">
  .game-right-menu {
    height: 100%;
    width: 75%;
    text-align: left;
    z-index: 9999 !important;

    .game-right-menu-header {
      margin-bottom: .1rem;
      padding: 0 0 0 .24rem;
      font-size: 0.32rem;
      font-weight: 400;
      line-height: 0.56rem;
    }

    .game-type-list {
      width: 100%;
      padding: 0;
      margin: 0;
      box-sizing: border-box;

      &::after {
        content: '';
        display: table;
        clear: both;
      }

      .game-type-item {
        float: left;
        margin-left: 4%;
        width: 44%;
        height: .28rem;
        padding: 0.14rem 0;
        text-align: center;
        line-height: 0.28rem;
        font-size: 0.28rem;
        background-color: #eee;
        margin-bottom: 0.2rem;
        border-radius: 0.28rem;
        color: #666;
        box-sizing: content-box;

        &.active {
          color: #fff;
        }
      }
    }

    .game-right-menu-hr {
      border: none;
      outline: none;
      width: 92%;
      background-color: #ccc;
      display: block;
      height: 0.02rem;
      margin: 0.1rem 4%;
    }
  }
</style>

<style lang="less" type='text/less' scoped>
  .game-header {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    height: 1.1rem;
    width: 100%;
    position: relative;

    .header-back {
      display: block;
      font-size: 0.8rem;
      color: #ffffff;
      width: 1.1rem;
      height: 1.1rem;
      position: absolute;
      left: 0;
      top: 0;
      line-height: 1.1rem;
    }

    .header-menu {
      display: block;
      font-size: 0.6rem;
      color: #ffffff;
      width: 1.1rem;
      height: 1.1rem;
      position: absolute;
      right: 0;
      top: 0;
      line-height: 1.1rem;
    }

    .search-input {
      display: block;
      box-sizing: border-box;
      height: 0.7rem;
      line-height:0.8rem;
      font-size: 0.3rem;
      padding: 0 0.35rem 0 0.35rem;
      border-radius: 0.35rem;
      background-color: rgba(255, 255, 255, 0.24);
      width: 3.5rem;
      position: absolute;
      top: 0.2rem;
      left: 1.8rem;
      color: #ffffff;
      text-align: left;
    }

    .search-input::-webkit-input-placeholder {
      color: #FFFFff;
      text-align: center;
    }

    .search-input::-moz-placeholder {
      color: #FFFFff;
      text-align: center;
    }

    .search-btn {
      display: block;
      border: 0;
      outline: 0;
      position: absolute;
      top: 0.2rem;
      right: 1rem;
      color: #FFFFFF;
      border-radius: 0.1rem;
      height: 0.7rem;
      width: 1rem;
      font-size: 0.3rem;
      background-color: rgba(255, 255, 255, 0.24);
    }
  }
   .games10019,.games10015{
      /deep/ .van-tabs__wrap--scrollable .van-tab {
        display: inline-block !important;
        padding: 0 0.22rem!important;
        white-space: nowrap !important;
        font-size: 0.32rem !important;
      }
    }
    .games10016{
      /deep/ .van-tabs__wrap--scrollable .van-tab {
        display: inline-block !important;
        padding: 0 0.25rem!important;
        white-space: nowrap !important;
        font-size: 0.32rem !important;
      }
    }

  .game-content {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    width: 100%;
    white-space: nowrap;

    /deep/ .van-tabs__wrap--scrollable .van-tabs__nav {
      /*display: inline-block !important;*/
      width: 100%;
      white-space: nowrap !important;
      overflow-x: scroll !important;
      -webkit-overflow-scrolling: touch !important;
    }
    /deep/ .van-tabs__wrap--scrollable .van-tabs__nav {
      /*display: inline-block !important;*/
      display: block !important;
      width: 100%;
      white-space: nowrap !important;
      overflow-x: scroll !important;
      -webkit-overflow-scrolling: touch !important;
    }



    /deep/ .van-tabs__wrap--scrollable .van-tab {
      display: inline-block !important;
      padding: 0 0.2rem;
      white-space: nowrap !important;
      // font-size: 0.3rem !important;
    }

    .game-prize-pool {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      width: 100%;

      .game-prize-pool-title {
        height: .6rem;
        line-height: .6rem;
        font-size: .36rem;
        padding: 0.1rem;
        font-weight: 400;
        text-align: left;
        box-sizing: content-box;
      }

      .game-prize-pool-content {
        background-image: url("../../assets/img/game/dt-jackpot.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 7.3rem;
        margin: 0 0.1rem;
        height: 0.8rem;

        .list {
          display: block;
          height: 100%;
          width: 100%;
          background-clip: content-box;
          box-sizing: border-box;
          padding: 0.14rem 0.14rem 0.14rem 1.4rem;
          position: relative;

          .item {
            float: left;
            display: block;
            height: 100%;
            line-height: 0.52rem;
            width: 0.36rem;
            position: absolute;
            top: 0.14rem;
            font-size: 0.29rem;
            color: #fff;
          }
        }
      }
    }

    .none {
      // position: absolute;
      width: 100%;
      text-align: center;
      top: 50%;
      transform: translateY(-1.34rem);
      color: #999999;
      font-size: .28rem;
      margin-top: 3.2rem;

      img {
        width: 100%;
      }
    }

    .game-list {
      width: 100%;
      margin: 0;
      box-sizing: border-box;
      padding: 0.2rem 0 0.3rem;

      &::after {
        content: '';
        display: table;
        clear: both;
      }

      .game-item {
        float: left;
        margin-left: 0.3rem;
        // margin-top: 0.3rem;
        margin-bottom:.08rem;
        width: 2.1rem;
        display: block;

        .icon {
          display: block;
          width: 2.1rem;
          height: 2.1rem;
        }

        .name {
          display: block;
          color: #787876;
          height: 0.5rem;
          overflow: hidden;
          word-wrap: break-word;
          word-break: break-all;
          line-height: 0.5rem;
          white-space: nowrap;
          width: 100%;
          text-overflow: ellipsis;
          font-size: 0.26rem;
          font-weight: 400;
        }

        .game-btn {
          outline: 0;
          border: 0;
          display: block;
          background: #f90;
          text-align: center;
          color: #fff;
          cursor: pointer;
          border-radius: .3rem;
          width: 85%;
          margin: 0 auto;
          font-size: 0.28rem;
          height: 0.6rem;
          line-height: 0.6rem;
        }

        .game-btn-try {

        }
      }
    }
  }

  .notice-dialog {
    width: 6.4rem;
    box-sizing: border-box;
    padding: 0.2rem 0.4rem 0 0.4rem;
    background-color: #fff;
    position: absolute;
    top: 46%;
    left: 50%;
    border-radius: 0.4rem;
    transform: translate3d(-50%, -50%, 0) scale(0);
    transform-origin: top;
    opacity: 0.96;
    transition: all 400ms;

    .notice-dialog-content {
      display: block;
      padding: 0.4rem 0;
      text-align: left;
      font-size: 0.32rem;
      max-height: 7.5rem;
      overflow: hidden;
    }

    .notice-dialog-footer {
      height: 0.9rem;
      line-height: 0.9rem;
      display: block;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      text-align: center;
      font-size: 0.34rem;
    }
  }

  .notice-dialog-pic {
    width: 6.4rem;
    box-sizing: border-box;
    padding: 0;
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0) scale(0);
    transform-origin: top;
    transition: all 400ms;

    .img {
      width: 100%;
      display: block;
    }

    .close {
      position: absolute;
      right: 0;
      top: 0;
      width: 1rem;
      height: 1rem;
      display: block;
    }
  }

  .show .notice-dialog,
  .show .notice-dialog-pic {
    transform: translate3d(-50%, -50%, 0) scale(1) !important;
  }

  .iphone {
    .search-input::-webkit-input-placeholder {
      top: -0.03rem;
      position: relative;
    }

    .search-input::-moz-placeholder {
      top: -0.03rem;
      position: relative;
    }
  }
</style>
