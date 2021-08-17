<template>
  <div
    :class="[
      'gameScroll',
      `gameScroll${index}`,
      { opacityAnt: currIndex != scrollList.id }
    ]"
    class="betnew-gameScroll"
    :ref="`gameScroll`"
    :style="`height:${gameAreaH}px`"
  >
    <div
      v-if="
        ([
          '10005',
          '20002',
          '10001',
          '10002',
          '10003',
          '10004',
          this.$config.newQP ? '10000' : ''
        ].includes(scrollList.id) &&
          $config.newQP) ||
          (['10005', '20002'].includes(scrollList.id) && !$config.newQP)
      "
      :class="[
        'fish gameItem',
        'gameItem-' + $config.name,
        `gameItemType-${typeNumber}`
      ]"
      ref="gameItem"
    >
      <div
        class="fishItem"
        :class="
          $config.newQP ? `item${scrollList.id}` : ''
        "
        v-for="(item, i) in scrollList.games"
        :key="i"
        @click="onGameClick(item)"
      >
        <div
          class="icon"
        >
          <img  class="icon" v-lazy="imgUrl(item.icon) ">
          <div
            class="name"
            v-if="
              [
                '10001',
                '10002',
                '10003',
                '10004',
              ].includes(scrollList.id)
            "
          >
            {{
              item.id === 99996 && currIndex === 30001
                ? "长龙助手 两面盘神器"
                : item.name
            }}
          </div>
        </div>
      </div>
    </div>
    <div
      :class="[
        'gameItem',
        scrollList.class ? scrollList.class : '',
        ,
        `gameItemType-${typeNumber}`
      ]"
      ref="gameItem"
      v-else
    >
      <div
        class="icon"
        v-for="(item, i) in scrollList.games"
        :key="i"
        @click="gameClick(item)"
      >
        <img  class="icon" v-lazy="imgUrl(item.icon) ">
        <!-- <div class="name">
          {{
            item.id === 99996 && currIndex === 30001
              ? "长龙助手 两面盘神器"
              : item.name
          }}
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import idConfig from "../../../type/new-game/idConfig";
export default {
  props: {
    gameList: {
      type: Object
    },
    currIndex: {
      type: Number
    },
    index: {
      type: Number
    },
    gameAreaH: {
      type: Number
    },
    gameListArr: {
      type: Array
    },
    typeNumber: {
      type: Number
    }
  },
  data() {
    return {
      scroll: null,
      idConfig,
      scrollList: null
    };
  },
  methods: {
    imgUrl(url) {
      if (url.indexOf("longDragon.png") > 0 || url.indexOf("game.png") > 0) {
        return url;
      } else {
        if (this.$config.name === 'betnew' && this.currIndex === 10000) url = url.replace('/m/', '/20001/')
        return this.publicStaticHost + "/images/" + url;
      }
    },
    refresh() {
      this.$refs.gameScroll &&
        (this.$refs.gameScroll.style.height = this.gameAreaH + "px");
      this.scroll && this.scroll.refresh();
    },
    scrollTop() {
      this.scroll && this.scroll.stop();
      this.scroll && this.scroll.scrollTo(0, 0, 0);
    },
    changeIcon(url) {
      let imgName = url.replace(/(.*\/)*([^.]+).*/gi, "$2");
      imgName = "/" + imgName;
      let newIcon = url.replace(imgName, imgName + "_b", 1);
      return newIcon;
    },
    gameClick(item) {
      if (
        (this.currIndex === 10001 || this.currIndex === 10004) &&
        item.id !== 10001
      ) {
        item["id"] = item.gcid;
        item["isgame"] = 0;
      }
      this.onGameClick(item);
    }
  },
  created() {
    this.idConfig = idConfig;
    this.scrollList = JSON.parse(JSON.stringify(this.gameList));
    if (this.scrollList.class === "type1" && this.scrollList.id !== "10000") {
      // this.$set(
      //   this.scrollList.games[0],
      //   "icon",
      //   this.changeIcon(this.scrollList.games[0].icon)
      // );
    } else if (this.scrollList.class === "type2") {
      // if (this.scrollList.id !== "10001") {
      //   this.$set(
      //     this.scrollList.games[0],
      //     "icon",
      //     this.changeIcon(this.scrollList.games[0].icon)
      //   );
      // }
      // this.$set(
      //   this.scrollList.games[1],
      //   "icon",
      //   this.changeIcon(this.scrollList.games[1].icon)
      // );
    }
    this.$nextTick(() => {
      this.refresh();
    });
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.scroll = new BScroll(`.gameScroll${this.index}`, {
          useTransition:
            this.$mobileDevice.osVersion.split(".")[0] >= 13 &&
            this.$mobileDevice.osVersion.split(".")[1] >= 3
              ? false
              : true,
          bindToWrapper: true,
          scrollY: true,
          click: true,
          probeType: 3
        });
        this.scroll.on("touchEnd", (axis, b) => {
          let y = axis.y;
          if (y > 50) {
            this.$emit("changeShowBackTop", false);
            if (this.index !== 0)
              this.$emit("changeCurrIndex", null, "up", false);
            this.scrollTop();
          } else if (y < -90) {
            if (y < this.gameAreaH - this.$refs.gameItem.offsetHeight) {
              this.$emit("changeShowBackTop", false);
              if (this.index < this.gameListArr.length - 1) {
                this.$emit("changeCurrIndex", null, "down", false);
                this.scrollTop();
              }
            }
          }
        });
        this.scroll.on("scroll", (axis, b) => {
          if (axis.y < -140) {
            this.$emit("changeShowBackTop", true);
          } else if (axis.y < 140) {
            this.$emit("changeShowBackTop", false);
          }
        });
      }, 200);
    });
  },
  watch: {
    gameAreaH() {
      this.refresh();
    },
    currIndex() {
      this.refresh();
    },
    gameList() {
      this.refresh();
    }
  }
};
</script>

<style lang="less" scoped>
@keyframes opacityAnimation {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.gameScroll {
  height: 100%;
  overflow: hidden;
  &.newqp-gameScroll {
    .fishItem {
      width: 1.74rem !important;
      height: 1.74rem !important;
      margin-bottom: 0.185rem !important;
      .icon {
        height: 1.74rem !important;
      }
      .itemName {
        background-color: #080808 !important;
        border-radius: 0px 0px 0.15rem 0.15rem !important;
      }
    }
    .item10002,
    .item10003,
    .item10004,
    .item10001 {
      width: 49% !important;
      margin: 0 !important;
      border-radius: 0 !important;
      margin-bottom: 0.08rem !important;
    }
    .item10002 {
      width: 100% !important;
      height: 1.6rem !important;
      .icon {
        height: 1.6rem !important;
      }
    }
    // .item10004{
    //   &:nth-child(2n -1) {
    //     margin-right: 2% !important;
    //   }
    // }
    .item10003,
    .item10004,
    .item10001 {
      &:nth-child(2n) {
        margin-right: 2% !important;
      }
      &:nth-child(1) {
        width: 100% !important;
      }
    }
    .item10001 {
      height: 1.64rem !important;
      margin-top: 0.12rem;
      .icon {
        height: 100% !important;
      }
    }
  }
  &.opacityAnt {
    animation: opacityAnimation 0s 0.25s linear forwards;
  }
  .gameItem {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    min-height: 101%;
    width: 100%;
    overflow: hidden;
    font-size: 0;
    .icon {
      position: relative;
      display: block;
      width: 100%;
      margin-bottom: 0.06rem;
      float: left;
      background-size: 100% 100%;
      background-position: center;
      border-radius: 0.1rem;
      &:first-child {
        margin-left: 0;
      }
      .name {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0.55rem;
        line-height: 0.58rem;
        font-size: 0.28rem;
        font-weight: 700;
        font-family: Microsoft YaHei;
        color: #fff;
        padding-left: 0.12rem;
        background: linear-gradient(
          90deg,
          #050306 0%,
          rgba(88, 86, 88, 0.2) 96%
        );
        text-align: left;
        &::before {
          content: "";
          text-align: center;
          display: inline-block;
          width: 100%;
          height: 0.02rem;
          position: absolute;
          top: 0;
          left: 0;
          background: linear-gradient(
            62deg,
            #a71e16 0%,
            rgba(159, 32, 29, 0) 100%
          );
        }
      }
    }
    &.fish {
      overflow: hidden;
      .fishItem {
        position: relative;
        width: 2.65rem;
        height: 2.65rem;
        float: left;
        border-radius: 0.12rem;
        margin-bottom: 0.12rem;
        overflow: hidden;
        
        .icon {
          float: none;
          display: block;
          width: 100%;
          height: 2.65rem;
          background-size: 100% 100%;
          background-position: center;
          margin-bottom: 0;
          border: none;
        }
        .itemName {
          width: 100%;
          height: 0.45rem;
          line-height: 0.47rem;
          font-size: 0.24rem;
          font-family: Microsoft YaHei;
          color: #fff;
          background: #222222;
          text-align: center;
        }
        .idName {
          position: absolute;
          left: 50%;
          bottom: 0.44rem;
          width: 1.26rem;
          height: 0.38rem;
          line-height: 0.38rem;
          color: #fff;
          font-size: 0.26rem;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          background-color: rgba(6, 1, 5, 0.6);
          border-radius: 20rem;
          margin-left: -0.68rem;
        }
      }
      .fishItem:first-child {
        width: 100%;
      }
    }
    &.gameItemType-20002, &.gameItemType-10005 {
      .fishItem {
        position: relative;
        width: 1.81rem;
        height: 1.81rem;
        float: left;
        border-radius: 0.12rem;
        margin-bottom: 0.12rem;
        overflow: hidden;
        margin: 0 0 0.2rem 0;

        .icon {
          float: none;
          display: block;
          width: 100%;
          height: 100%;
          background-size: 100% 100%;
          background-position: center;
          margin-bottom: 0;
          border: none;
        }
      }
      .fishItem:first-child {
        width: 1.81rem;
      }

      .fishItem:nth-child(3n-1){
        margin: 0 .05rem !important;
      }
    }
    // 捕魚的樣式改為跟熱門一樣, 確定後這邊註解的 code 可刪除
    // &.gameItemType-10005 {
    //   display: flex;
    //   justify-content: space-between;
    // }
    &.type1,
    &.type2 {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      flex-direction: row;
      align-content: flex-start;
      .icon {
        width: 2.65rem;
        height: 2.65rem;
      }
    }
    &.type2 {
      .icon:first-child {
        width: 100%;
      }
    }

    &.gameItem-fhcp ,&.gameItem-xpj83 {
      .item10000 {
        width: 49% !important;
        height: 2.02rem !important;
        margin: 0 !important;
        border-radius: 0 !important;
        margin-bottom: 0.08rem !important;
        &:nth-child(2n) {
          margin-right: 2% !important;
        }
        &:nth-child(1) {
          width: 100% !important;
        }
        .icon {
          height: 2rem !important;
        }
      }
    }

    &.gameItemType-10001, &.gameItemType-10002 {
      &.type2 {
        .icon:first-child {
          width: 2.65rem !important;
        }
      }
    }
    &.gameItemType-10000 {
      &.type1 {
        .icon:first-child {
          width: 100% !important;
        }
      }
    }
  }
}
</style>
