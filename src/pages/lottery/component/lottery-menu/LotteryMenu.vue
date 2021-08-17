<template>
  <van-popup class="van-popup-menu" v-model="show" position="left" get-container="body">
    <div class="lottery-menu">
      <header class="menu-header theme-bg theme-header-bg" @click="$router.push('/home')">
        <i class="icon iconfont h5-icon-fanhui"></i>
        <i class="label">返回大厅</i>
      </header>
      <div class="menu-body clear-fix theme-main-bg-5" v-if="menuList && menuList.length && targetNav">
        <scroll-box ref="scroll" class="menu-nav f-l">
          <ul class="menu-nav-list" ref="nav">
            <li class="menu-nav-item theme-bg-active theme-main-bg-6" :class="[{'active theme-color-black theme-yellow-bg-2':nav&&(targetNav.id===nav.id)},{'theme-color-white':targetNav.id!==nav.id}]" v-for="(nav, i) in menuList" :key="i" @click="targetNav = nav">
              {{nav.name}}
            </li>
          </ul>
        </scroll-box>
        <scroll-box class="menu-item-box f-l">
          <ul class="menu-item-list clear-fix">
            <li class="menu-item-item f-l" v-for="item in targetNav['games']&&targetNav?targetNav['games']:[]" :key="item.id" @click="onClick(item)">
              <img class="logo" :src="imgUrl(item.icon)" alt/>
              <div class="text-list">
                <span class="item-name theme-color-white">{{item.name}}</span>
                <span class="item-desc theme-color-gray-2">{{item.title}}</span>
              </div>
            </li>
          </ul>
        </scroll-box>
      </div>
    </div>
  </van-popup>
</template>

<script type="text/javascript">
export default {
  name: 'LotteryMenu',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    menuList: {
      type: Array,
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
      targetNav: null,
    }
  },
  watch: {
    targetNav () {
      this.targetNavChange()
    },
    menuList(newVal) {
      this.targetNav = newVal[0]
    }
  },
  created() {
    if(this.menuList && this.menuList.length) this.targetNav = this.menuList[0]
  },
  methods: {
    imgUrl (url) {
      return this.publicStaticHost + '/images/'+ url
    },
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
                      series: this.$store.state.main.gameSortV4Note.lottery[game.id]['series'],
                      id: game.id
                    },
                    query: {
                      name: game.name,
                      code: this.$store.state.main.gameSortV4Note.lottery[game.id]['code']
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
    targetNavChange () {
      const nav = this.$refs['nav']
      const scrollBox = this.$refs['scroll']
      if (nav && scrollBox) {
        const scroll = scrollBox.scroll
        const target = nav.childNodes[this.menuList.indexOf(this.targetNav)]
        const height = scrollBox.$el.offsetHeight
        const scrollHeight = scroll.scrollerHeight
        const targetHeight = target.offsetHeight
        const offsetTop = target.offsetTop
        let top = (offsetTop + (targetHeight / 2)) - (height / 2)

        if (top < 0) top = 0
        else if (top > scrollHeight - height) top = scrollHeight - height

        scroll.scrollTo(0, -top, 500)
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  @import "../../../../style/icon/menu-icon-xpj";
  


  .lottery-menu {
    width: 88vw;
    height: 100%;
    background-color: #fff;
    user-select: none;

    .menu-header {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 0.9rem;
      color: #fff;
      display: flex;
      justify-content: start;
      align-items: center;
      flex-wrap: nowrap;
      font-size: 0.349rem;
      padding: 0 0.24rem;
      flex-shrink: 0;
      font-weight: bold;

      .label {
        font-weight: bold;
      }

      .icon {
        font-size: 0.6rem;
        font-weight: 400;
        transform: translateY(-5%);
        margin-top: 0.04rem;
      }
    }

    .menu-body {
      width: 100%;
      height: 100%;
      padding-top: 0.9rem;
      box-sizing: border-box;
      overflow: hidden;
    }

    .menu-nav {
      width: 0.68rem;
      height: 100%;

      .menu-nav-list {
        width: 100%;
        padding: 0.04rem 0;
      }

      .menu-nav-item {
        font-size: 0.3rem;
        background-color: #eee;
        background-clip: padding-box;
        min-height: 2rem;
        padding: 0.14rem 0.12rem;
        display: flex;
        justify-content: center;
        align-items: center;
        word-break: break-all;
        margin-bottom: 0.04rem;
        line-height: 1.6;

        &.active {
          color: #fff;
        }
      }
    }

    .menu-item-box {
      width: 89%;

      .menu-item-list {
        padding-bottom: 0.3rem;
        padding-left: 0.14rem;
      }

      .menu-item-item {
        width: 50%;
        float: left;
        height: 0.9rem;
        display: flex;
        margin-top: .28rem;
        white-space: nowrap;

        .logo {
          width: 0.9rem;
          max-width: 0.9rem;
          height: 0.9rem;
          max-height: 0.9rem;
          /*background-image: url("../../../../assets/img/home/xpj-icon-min.png");*/
          background-repeat: no-repeat;
          background-size: 9.22rem 14.679rem;
          flex-shrink: 0;
        }

        .text-list {
          flex: 1;
          padding-left: 0.14rem;
          box-sizing: border-box;
          padding-top: 0.04rem;
          line-height: 1.6;
          overflow: hidden;
          .item-name {
            display: block;
            font-size: 0.28rem;
            font-weight: bold;
            text-align: left;
            color: #333333;
          }

          .item-desc {
            display: block;
            font-size: 0.24rem;
            color: #999999;
            text-align: left;
            width: 100%;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
        }
      }
    }
  }
</style>
