<template>
  <div class="lottery-menu">
    <div class="mask-box" v-show="show" @click="show=false"></div>
    <transition :name="show?'slide-down':'slide-up'">
      <ul v-show="show" class="menu-item-list clear-fix" :class="[{'theme-header-bg':$config.blackTheme || $config.newQP},{'theme-main-bg' : $config.blush}]">
        <li class="menu-item-item f-l theme-border-1px theme-color-white" :class="[{'black-menu-item-item' : $config.blackTheme || $config.newQP || $config.blush}]" v-for="item in lotteryLists" :key="item.id" @click="onClick(item)">
          <i :class="{'hot':item.hot=='yes','weihu-icon':item.repair == 'yes'}"></i>
          {{item.name}}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'LotteryMenu',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    show: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  data () {
    return {
      lotteryLists: []
    }
  },
  created () {
    this.getLotteryLists()
  },
  methods: {
    onClick (game) {
      setTimeout(() => {
        if(this.$route.params.id == game.id){
          this.show = false
        }else{
            if (this.$config.preview) {
            this.previewAlert();
          } else if (localStorage.token) {
            if (localStorage.Public_User === "test") {
              this.toastText("彩票游戏暂不支持试玩", "middle");
            } else {
              this.$store.dispatch('main/getStopLotteryCheck', game.id).then(res => {
                if (res.data.length > 0) {
                  this.$store.commit('main/stopDialogText', res.data)
                  this.$store.commit('main/stopDialog', true)
                } else {
                  this.show = false
                  this.$router.push({
                    name: 'lottery',
                    params: {
                      series: this.$store.state.main.gameSortV4Note.lottery[game.id].series,
                      id: this.$store.state.main.gameSortV4Note.lottery[game.id].id
                    },
                    query: {
                      name: this.$store.state.main.gameSortV4Note.lottery[game.id].name,
                      code: this.$store.state.main.gameSortV4Note.lottery[game.id].code,
                      token: this.$route.query.token,
                      cocos: this.$route.query.cocos
                    }
                  })
                }
              })
            }
          } else {
            this.show = false
            this.$router.push("/admin/login");
          }
        }
      }, 0);
    },
    getLotteryLists () {
      this.$store.dispatch('main/getNewGame', {
        idIndex: 4,
        id: 10000,
        callback: res => {
          if(res[10000]) {
            this.lotteryLists = res[10000]
          }
        },
      })
    },
  }
}
</script>

<style lang="less" type='text/less' scoped>
  @import "../../../../style/icon/menu-icon-xpj";
  .lottery-menu {
    user-select: none;
    position: absolute;
    top: 0.88rem;
    overflow: visible;
    width: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    z-index: -1;
    .mask-box {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.36);
      width: 100%;
      height: 100vh;
      z-index: -2;
    }
    .menu-body {
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    .menu-item-list {
      padding: 0 0.2rem 0.3rem;
      background-color: #fff;
    }
    .menu-item-item {
      position: relative;
      width: 2.1rem;
      float: left;
      height: 0.76rem;
      line-height: 0.76rem;
      margin-top: .28rem;
      white-space: nowrap;
      font-size: 0.28rem;
      font-weight: bold;
      text-align: center;
      color: #333333;
      border-radius: 0.1rem;
      &:nth-child(3n-1) {
        margin: 0.28rem 0.4rem 0;
      }
      > .hot {
        background-image: url("../../../../assets/img/lottery/icon-hot.png");
        width: 0.38rem;
        height: 0.38rem;
        background-size: 100%;
        background-repeat: no-repeat;
        position: absolute;
        top: 0;
        right: 0;
      }
      > .weihu-icon {
        background-image: url("../../../../assets/img/lottery/icon-whz.png");
        width: 0.56rem;
        height: 0.48rem;
        background-size: 100%;
        background-repeat: no-repeat;
        position: absolute;
        top: 0;
        right: 0;
      }
      &.black-menu-item-item {
        > .hot {
          background-image: url("../../../../assets/img/lottery/black-icon-hot.png");
        }
        > .weihu-icon {
          background-image: url("../../../../assets/img/lottery/black-icon-whz.png");
        }
      }
    }
  }
</style>
