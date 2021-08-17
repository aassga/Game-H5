<template>
 <div :class="[{'drawer-box':true},{'black-drawer-box':$config.blackTheme || $config.newQP},{'blush-drawer-box':$config.blush}]" :style="(show ? '':'pointer-events: none')">
   <vux-drawer :drawer-style="{'height': '100%','width': '6.62rem'}" :show.sync="show" placement="left">
    <div class="lottery-menu" slot="drawer">
      <header class="menu-header theme-bg theme-header-bg" @click="$router.push('/home')">
        <i class="icon iconfont h5-icon-fanhui"></i>
        <i class="label">返回大厅</i>
      </header>
      <div class="menu-body clear-fix theme-main-bg-8">
        <scroll-box class="menu-item-box f-l">
          <ul class="menu-item-list clear-fix">
            <li
              class="menu-item-item"
              v-for="item in menuList"
              :key="item.id"
            >
              <div class="text-list" v-show="item.games.length>0">
                <h3 :class="['item-name theme-color-white',{'black-item-name' :$config.blackTheme || $config.newQP},{'blush-item-name' :$config.blush}]">{{item.name}}</h3>
                <ul :class="['childList',{'black-childList' : $config.blackTheme || $config.newQP || $config.blush}]">
                  <li
                    v-for="(data,i) in item.games"
                    :key="i"
                    @mousedown="onGameClick(data)"
                    :class="{'weihu':data.repair == '1','active':['bjsc','xysc','klsc'].includes(data.platform)}"
                  >
                    <div class="item-bg theme-color-white" :class="[{'theme-main-bg-5' :$config.blackTheme || $config.newQP},{'theme-main-bg-6' :$config.blush}]">
                       <i :class="{'hot':data.hot=='1','weihu-icon':data.repair == 'yes'}"></i>
                    {{ data.name }}
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </scroll-box>
      </div>
    </div>
  </vux-drawer>
</div>
</template>

<script type="text/javascript">
export default {
  name: "LotteryMenu",
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
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  data() {
    return {
      newSlideList: []
    };
  },
  methods: {
    onClick(game) {
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
            this.$router.push("/admin/login");
          }
        }
      }, 0);
    },
  }
};
</script>

<style lang="less" type='text/less' scoped>
@import "../../../../style/icon/menu-icon-xpj";
.drawer-box{
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    position: fixed;
    z-index: 499;
    display: block !important;
}
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
    font-size: 0.36rem;
    padding: 0 0.12rem;
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
      word-break: break-all;
      margin-bottom: 0.04rem;
      line-height: 1.6;

      &.active {
        color: #fff;
      }
    }
  }

  .menu-item-box {
    width: 100%;

    .menu-item-list {
      padding: 0.24rem 0.08rem 1.1rem 0.24rem;
    }

    .menu-item-item {
      text-align: center;
      .text-list {
        width: 100%;
        box-sizing: border-box;
        padding-top: 0.04rem;
        margin: auto;
        .item-name {
          width: 100%;
          text-align: center;
          height: 0.42rem;
          line-height: 0.42rem;
          margin-bottom: 0.14rem;
          font-size: 0.25rem;
          position: relative;
          color: #777777;
          font-weight: 500;
        }
        .item-name:before {
          content: "";
          position: absolute;
          width: 100%;
          height: 0px;
          top: 50%;
          left: 0px;
          right: 0px;
          -webkit-transform: scaleY(.5);
          transform: scaleY(.5);
          z-index: -1;
          height: 0.02rem;
          border-top: 0.02rem solid #ebedf0;
        }
        .item-name::after {
          content: "";
          position: absolute;
          width: 30%;
          left: 0px;
          right: 0px;
          top: 0px;
          bottom: 0px;
          background-color: #ffffff;
          z-index: -1;
          margin: auto;
        }
        .black-item-name::after {
          background-color: #090909 !important;
        }
        .blush-item-name::after {
          background-color: #640009 !important;
        }
        .childList {
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          width: 100%;
          text-align: left;
          display: flex;
          flex-flow: row wrap;
          align-content: flex-start;
          margin-bottom: 0.1rem;
          li:nth-child(3n){
            margin-right:0;
          }
          .active{
            border-radius:0;
          }
          .weihu{color: #dbdbdb;}
          li {
            margin-bottom:0.16rem;
            // display: inline-block;
            height: 0.72rem;
                 flex: 0 0 33%;
            // width: 1.95rem;
            border-radius: 0.05rem;
            // background: #f8f8f8;
            // margin-right: 0.14rem;
            text-align: center;
            line-height: 0.72rem;
            font-size: 0.25rem;
            font-weight: 600;
            color: #4e4e4e;
            font-family: -apple-system-font, "Helvetica Neue", sans-serif!important;
            .item-bg{
              width:1.95rem;
              position: relative;
              background: #f8f8f8;
              > .hot {
              background-image: url("../../../../assets/img/lottery/icon-hot.png");
              width: 0.56rem;
              height: 0.48rem;
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
            }
          }
          &.black-childList {
            li {
            &.weihu .item-bg{
              color: #dbdbdb !important;
            }
            .item-bg{
              > .hot {
                background-image: url("../../../../assets/img/lottery/black-icon-hot.png");
              }
              > .weihu-icon {
                background-image: url("../../../../assets/img/lottery/black-icon-whz.png");
              }
            }
          }
          }
        }

        .item-desc {
          display: block;
          font-size: 0.24rem;
          color: #999999;
          text-align: left;
        }
      }
    }
  }
}
.black-drawer-box {
  /deep/.vux-drawer > .vux-drawer-content {
    background-color: transparent;
  }
}
.blush-drawer-box {
  /deep/.vux-drawer > .vux-drawer-content {
    background-color: #640009;
  }
}
</style>
