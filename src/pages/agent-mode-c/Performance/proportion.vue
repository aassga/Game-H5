<template>
  <view-page
    class="agent-center-modec"
    @scroll-height-change="height => {this.contentHeight = height}"
  >
    <div class="header" slot="header">
      <title-header class="title" backEvent @back="$router.go('-1')" title="返佣比例"></title-header>
    </div>
    <div slot="header-static">
      <van-tabs v-model="tabIndex" :line-height="2" :swipe-threshold="5" :duration='0'>
        <van-tab v-for="(tab, i) in tabs" :key="i" :title="tab.name"></van-tab>
      </van-tabs>
    </div>
    <div slot="content" class="content" v-touch:left ="onSwipeLeft"  v-touch:right="onSwipeRight">
      <transition-group :name="animation" class="animation-box" tag="p" ref="animationBox">
        <div class="content-body" ref="solid" :key="'wrapper_' + tabIndex">
          <scroll-box :style="{height: (contentHeight)+'px'}">
            <div class="table">
              <ul>
                <li class="title theme-opacity10">
                  <div class="range">代理级别</div>
                  <div class="name">团队业绩/日</div>
                  <div class="proport">返佣额度</div>
                </li>
              </ul>
              <div class="tableList">
                <ul v-if="list && list.length > 0">
                  <li class="user-item" v-for="(user, i) in list" :key="i">
                    <span class="user-item-col user-item-col1">{{user.agencyLevel}}</span>
                    <span class="user-item-col user-item-col2">{{user.proportion}}</span>
                    <span class="user-item-col user-item-col3">{{user.proportionTitle}}</span>
                  </li>
                </ul>
                <div style="min-height:8rem" v-else-if="nolist">
                  <img style="width: 100%;margin-top: 1rem;" :src="noDataImg" alt />
                  <p style="font-size: 0.3rem;color: #666666">暂无数据</p>
                </div>
              </div>
            </div>
          </scroll-box>
        </div>
      </transition-group>
    </div>
  </view-page>
</template>

<script>
export default {
  data() {
    return {
      tabIndex: null,
      tabConfig: {
        chess : '棋牌',
        slot: '电子',
        live: '视讯',
        lottery: '彩票',
        getfish: '捕鱼',
      },
      tabs: [],
      animation: "",
      contentHeight: 0,
      allGame: {},
      list: [],
      nolist: false,
    };
  },
  created() {
    this.loadList();
  },
  methods: {
    loadList() {
      this.toastLoading('加载中');
      this.$store
        .dispatch("agentModec/agencyPerformanceConfigModeC")
        .then(res => {
          console.log(res);
          this.toastClear()
          if (res.code === 200) {
            if (JSON.stringify(res.data) !== '{}') {
              this.allGame = res.data;
              for (const key in this.tabConfig) {
                if(this.allGame[key]) {
                  let obj = {
                    name : this.tabConfig[key],
                    type : key
                  }
                  this.tabs.push(obj)
                }
              }
              if(this.$route.query.game) {
                this.tabs.forEach((item,i) => {
                  if(item.type === this.$route.query.game ) {
                    this.tabIndex = i
                  }
                })
              }else {
                this.tabIndex = 0
              }
              this.list = this.allGame[this.tabs[this.tabIndex].type];
            }
          }
        })
        .catch(err => {});
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
  },
  components: {},
  computed: {
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
    tabIndex(val, old) {
      if(this.tabs.length) {
        this.list = this.allGame[this.tabs[val].type];
      }
      if(this.list && this.list.length > 0) {
        this.nolist = false
      }else {
        this.nolist = true
      }
      if(old !== null) {
        if (val < old) {
          this.animation = "slide-right";
        } else {
          this.animation = "slide-left";
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.header-right {
  position: absolute;
  right: 0.16rem;
  top: 0;
  font-size: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    color: #fff;
  }
}
.content {
  .animation-box {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    .content-body {
      width: 100%;
      .table {
        padding: 0.24rem 0.16rem;
        li {
          display: flex;
          height: 0.88rem;
          line-height: 0.88rem;
          & > div,
          & > span {
            flex: 1;
            font-size: 0.28rem;
            color: #444;
          }
          &.title {
            background-color: #e9f1fe;
            font-weight: bold;
            border-radius: 0.1rem 0.1rem 0 0;
          }
          &.list {
            font-weight: normal;
            background-color: #fff;
            border-bottom: 1px dashed #e7e7e7;
            &:last-child {
              border-bottom: none;
            }
          }
        }
        .view {
          margin-top: 0;
        }
      }
      .tableList {
        background-color: #fff;
        overflow-y: auto;
        border-radius: 0 0 0.1rem 0.1rem;
        box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.03);
        li {
          border-bottom: 0.01rem solid #e7e7e7;
          &:last-child {
            border-bottom: 0.01rem solid none;
          }
        }
      }
    }
  }
}
</style>