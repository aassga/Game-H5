<template>
  <van-popup
    v-model="showDateSelector"
    :style="positionStyle"
    position="bottom"
    get-container="body"
    :overlay="true"
    :lazy-render="false"
    :close-on-click-overlay="true"
  >
    <div class="container theme-main-bg" ref="container">
      <div class="close theme-noborder" :style="lineStyle">
        <van-icon name="cross" @click="showDateSelector = false" :color="$config.blush || $config.blackTheme || $config.newQP? '#EAD092' : '#262626'" />
      </div>
      <div class="scroll-box" ref="scrollBox">
        <div style="min-height:100%" ref="scrollArea">
          <div
            class="my-game"
            :style="{paddingBottom: !showRecommendList.length ? rem * 0.15 + 'px' : ''}"
          >
            <div class="clearfix">
              <div class="tit theme-color-yellow-2">我的游戏</div>
              <div class="des">{{editState ? '拖动可以排序' : '点击进入游戏'}}</div>
              <div
                class="btn theme-color theme-color-yellow-2 theme-border-yellow"
                @click="saveEdit"
              >{{editState ? '完成' : '编辑'}}</div>
            </div>
            <div class="collect">
              <div class="collect-list clearfix" v-if="selfCollectList && selfCollectList.length">
                <vue-draggable
                  v-model="selfCollectList"
                  @end="collectListMoveEnd"
                  @unchoose="choose"
                  @start="collectListMove"
                  :options="{disabled:!editState,animation:300,handle:'.cont',scroll:true,scrollSpeed:2000,scrollSensitivity:10}"
                >
                  <div
                    class="collect-item theme-main-bg-5"
                    v-for="(item, i) in selfCollectList"
                    :key="i"
                    @click="gameClick(item,i)"
                  >
                    <div v-on:click.stop="cancelCollect(item,i)">
                      <img
                        src="@src/assets/img/game/new-game/remove-icon.png"
                        alt
                        class="remove-icon"
                        v-if="editState"
                      />
                    </div>
                    <div class="cont theme-color-white">{{item.name}}</div>
                    <img :src="idConfig[gameSortV4Note.data[item.id]['series']].blackFirmIcon" class="firm" v-if="$config.blush || $config.blackTheme || $config.newQP && gameSortV4Note.data && gameSortV4Note.data[item.id] && gameSortV4Note.data[item.id]['series'] && idConfig[gameSortV4Note.data[item.id]['series']]">
                    <img
                      :src="$config.home !== 'vns' ? idConfig[gameSortV4Note.data[item.id]['series']].AfirmIcon : idConfig[gameSortV4Note.data[item.id]['series']].BfirmIcon"
                      class="firm"
                      v-if="!$config.blush && !$config.blackTheme && !$config.newQP && gameSortV4Note.data && gameSortV4Note.data[item.id] && gameSortV4Note.data[item.id]['series'] && idConfig[gameSortV4Note.data[item.id]['series']]"
                    />
                  </div>
                </vue-draggable>
              </div>
              <div class="no-collect" v-else>
                <div v-if="userInfo && JSON.stringify(userInfo) !== '{}'" class="no-collect-area">
                  <img src="@src/assets/img/game/new-game/no-collect-bg-blush.png" v-if="$config.blush"/>
                  <img src="@src/assets/img/game/new-game/no-collect-bg.png" v-else />
                  <p class="no-collect-text theme-color-white">请点击官方推荐添加游戏</p>
                </div>
                <div v-else class="no-userInfo-area">
                  <img src="@src/assets/img/game/new-game/no-userInfo-img-blush.png" v-if="$config.blush" />
                  <img src="@src/assets/img/game/new-game/no-userInfo-img.png" v-else />
                  <router-link to="/admin/login" class="no-collect-text theme-bg theme-color-black theme-yellow-bg-1">请先登陆</router-link>
                </div>
              </div>
            </div>
          </div>
          <div
            class="recommend"
            v-if="showRecommendList && showRecommendList.length || !popupRecommend.length"
          >
            <div class="clearfix">
              <div class="tit theme-color-yellow-2">官方推荐</div>
              <div class="des">点击添加游戏</div>
            </div>
            <div class="recommend-list" v-if="showRecommendList.length">
              <div
                class="recommend-item theme-main-bg-5"
                v-for="(item, i) in showRecommendList"
                :key="i"
                @click="joinCollect(item)"
              >
                <van-icon name="plus" class="icon" :color="$config.blush || $config.blackTheme || $config.newQP? '#fff' : '#222'" />
                <div class="cont theme-color-white">{{item.name}}</div>
                <img :src="idConfig[gameSortV4Note.data[item.id]['series']].blackFirmIcon" class="firm" v-if="$config.blackTheme || $config.blackTheme || $config.newQP && gameSortV4Note.data && gameSortV4Note.data[item.id] && gameSortV4Note.data[item.id]['series'] && idConfig[gameSortV4Note.data[item.id]['series']]">
                <img
                  :src="$config.home !== 'vns' ? idConfig[gameSortV4Note.data[item.id]['series']].AfirmIcon : idConfig[gameSortV4Note.data[item.id]['series']].BfirmIcon"
                  class="firm"
                  v-if="!$config.blush && !$config.blackTheme && !$config.newQP && gameSortV4Note.data && gameSortV4Note.data[item.id] && gameSortV4Note.data[item.id]['series'] && idConfig[gameSortV4Note.data[item.id]['series']]"
                />
              </div>
            </div>
            <div v-else class="no-recommend">
              <img class="no-data" src="@src/assets/img/game/new-game/no-data.png" alt />
              <p class="info">暂无游戏</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script type="text/javascript">
import vueDraggable from "vuedraggable";
import idConfig from "../new-game/idConfig";
export default {
  name: "AgencyDateSelector",
  props: {
    show: {
      type: Boolean,
      required: false
    },
    collectList: {
      type: Array,
      default: []
    },
    popupRecommend: {
      type: Array,
      default: []
    },
    gameSortV4Note: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      editState: false,
      showRecommendList: [],
      selfCollectList: [],
      scroll: null,
      showTitLine: false,
      idConfig: {},
      typeId: "",
      isMove: false,
      chooseBool: true,
    };
  },
  created() {
    this.typeId = this.$route.params.id;
    this.idConfig = idConfig;
  },
  mounted() {
    this.$refs.container && (this.$refs.container.style.maxHeight =
      this.$store.state.main.windowHeight - this.rem * 1.2 + "px");
    this.$refs.scrollArea && (this.$refs.scrollArea.style.maxHeight =
      this.$store.state.main.windowHeight - this.rem * 2.2 + "px");
  },
  methods: {
    saveEdit() {
      this.editState = !this.editState;
    },
    setRecommendList() {
      let arr1 = this.showRecommendList;
      let arr2 = JSON.parse(JSON.stringify(this.collectList));
      if (arr1.length && arr2.length) {
        for (let i = arr1.length - 1; i >= 0; i--) {
          for (let j = arr2.length - 1; j >= 0; j--) {
            if (arr1[i].upid === arr2[j].upid && arr1[i].id === arr2[j].id) {
              this.$nextTick(() => {
                this.showRecommendList.splice(i, 1);
              });
            }
          }
        }
      }
    },
    joinCollect(item) {
      if (!this.$store.state.user.userInfo || !this.$store.state.user.token) {
        this.$router.push("/admin/login");
      } else {
        this.selfCollectList.push(item);
        this.$emit("joinCollect", item, true);
      }
    },
    gameClick(item, i) {
      if (!this.editState) {
        this.$emit("clickGameHandle", item);
      }
    },
    cancelCollect(item, i) {
      this.popupRecommend.some(info => {
        if (info.id === item.id && info.upid === item.upid) {
          this.showRecommendList.unshift(item);
          return true;
        }
      });
      this.selfCollectList.splice(i, 1);
      this.$emit("cancelCollect", item, true);
    },
    setTitleLineShow() {
      this.$refs.scrollBox.addEventListener("scroll", $e => {
        $e.target.scrollTop > 5
          ? (this.showTitLine = true)
          : (this.showTitLine = false);
      });
    },
    collectListMove() {
      this.isMove = true;
    },
    collectListMoveEnd() {
      this.isMove = false;
      let idList = [];
      this.selfCollectList.forEach(item => {
        idList.push(item.sortid);
      });
      this.$nextTick(() => {
        this.$store
          .dispatch("games/deleteCollectGame", {
            sortids: idList.join(",")
          })
          .then(res => {
            if (res.code === 200) {
              this.$emit("getMemberCollectGames");
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    choose(item) {
      if(this.chooseBool) {
        this.chooseBool = false
        if (!this.isMove) {
          this.cancelCollect(this.selfCollectList[item.oldIndex], item.oldIndex);
        }
        setTimeout(() => {
          this.chooseBool = true
        }, 500);
      }
    }
  },
  computed: {
    positionStyle() {
      //解决安卓小米position：fixed问题导致按钮错位问题
      if (
        this.$mobileDevice.isAndroid &&
        this.$mobileDevice.browserName === "MIUI Browser"
      ) {
        return {
          position: "absolute"
        };
      } else {
        return {
          position: "fixed"
        };
      }
    },
    showDateSelector: {
      get(val) {
        if (val.show) {
          this.setRecommendList();
          this.setTitleLineShow();
          this.$nextTick(() => {
            this.selfCollectList = this.collectList;
          });
        }
        return this.show;
      },
      set(val) {
        if (!val) {
          this.$refs.scrollBox.scrollTop = 0;
        }
        this.editState = false;
        this.$emit("update:show", val);
      }
    },
    lineStyle() {
      if (this.showTitLine) {
        return {
          borderBottom: "1px solid #ebedf0"
        };
      }
    }
  },
  components: {
    vueDraggable
  },
  watch: {
    collectList(list) {
      this.selfCollectList = list;
    },
    popupRecommend(list) {
      this.showRecommendList = JSON.parse(JSON.stringify(list));
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
.container {
  position: relative;
  width: 7.5rem;
  background-color: #ffffff;
  border-top-left-radius: 0.2rem;
  border-top-right-radius: 0.2rem;
  color: #222;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .close {
    position: relative;
    height: 50px;
    text-align: left;
    color: #262626;
    padding: 0 0.23rem;
    border-bottom: 1px solid transparent;
    .van-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.42rem;
    }
  }
  .scroll-box {
    position: relative;
    overflow-y: auto;
    flex: 1;
    .my-game,
    .recommend {
      overflow: hidden;
      padding: 0 0.23rem;
      .tit {
        float: left;
        height: 0.5rem;
        line-height: 0.5rem;
        margin-right: 0.14rem;
        font-size: 0.32rem;
        color: #000;
      }
      .des {
        font-size: 0.26rem;
        color: #999;
        float: left;
        height: 0.5rem;
        line-height: 0.5rem;
      }
      .btn {
        float: right;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.26rem;
        text-align: center;
        border-radius: 0.49rem;
        padding: 0 0.2rem;
        box-sizing: content-box;
      }
      .firm {
        position: absolute;
        right: 0rem;
        top: 0;
        width: 0.56rem;
        height: 0.56rem;
      }
      .no-collect {
        width: 7.03rem;
        margin: 0.42rem auto 0;
        border-radius: 0.26rem;
        img {
          width: 2.6rem;
          height: 1.99rem;
          margin-top: 0.59rem;
        }
        .no-collect-text {
          text-align: center;
          color: #222;
          font-size: 0.28rem;
          margin-top: -0.1rem;
        }
        .no-userInfo-area {
          img {
            width: 2.98rem;
            height: 2.29rem;
            margin-top: 0.59rem;
          }
          .no-collect-text {
            display: block;
            text-align: center;
            width: 2.41rem;
            height: 0.6rem;
            line-height: 0.6rem;
            color: #fff;
            font-size: 0.28rem;
            margin-top: -0.1rem;
            border-radius: 0.12rem;
            margin: 0 auto;
          }
        }
      }
      &.my-game {
        .collect {
          font-size: 0;
          .collect-list {
            margin-top: 0.36rem;
            .collect-item {
              position: relative;
              float: left;
              width: 2.18rem;
              height: 0.76rem;
              line-height: 0.76rem;
              border-radius: 0.08rem;
              background-color: #f4f5f7;
              color: #222;
              font-size: 0.28rem;
              margin-bottom: 0.24rem;
              &:nth-child(3n + 2) {
                margin: 0 0.24rem 0.24rem;
              }
              .cont {
                width: 1.6rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin: 0 auto;
                -webkit-touch-callout: default;
                -webkit-user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -o-user-select: none;
                user-select: none;
                color: #000;
              }
              .remove-icon {
                position: absolute;
                top: -0.18rem;
                right: -0.18rem;
                color: #cacaca;
                z-index: 999;
                width: 0.32rem;
                height: 0.32rem;
              }
            }
          }
        }
      }
      &.recommend {
        margin-top: 0.15rem;
        padding-bottom: 0.1rem;
        .recommend-list {
          margin-top: 0.36rem;
          .recommend-item {
            position: relative;
            float: left;
            width: 2.18rem;
            height: 0.76rem;
            line-height: 0.76rem;
            border-radius: 0.08rem;
            color: #222;
            box-shadow: 1px 0.02rem 0.09rem rgba(78, 78, 78, 0.16);
            margin-bottom: 0.24rem;
            padding-left: 0.5rem;
            &:nth-child(3n + 2) {
              margin: 0 0.24rem 0.24rem;
            }
            .icon {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              left: 0.17rem;
              font-size: 0.3rem;
              display: inline-block;
            }
            .cont {
              width: 1.5rem;
              text-align: left;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 0.28rem;
              -webkit-touch-callout: default;
              -webkit-user-select: none;
              -moz-user-select: none;
              -webkit-user-select: none;
              -o-user-select: none;
              user-select: none;
            }
          }
        }
        .no-recommend {
          .no-data {
            width: 4.52rem;
            height: 5.01rem;
            margin: 0.2rem auto 0;
          }
          .info {
            color: #333;
            font-size: 0.3rem;
            margin-top: -0.36rem;
          }
        }
      }
    }
  }
}
</style>