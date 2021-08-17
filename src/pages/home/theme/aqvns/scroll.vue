<template>
  <div
    :class="[
      'gameScroll',
      `gameScroll${index}`,
      { opacityAnt: currIndex != scrollList.id }
    ]"
    :ref="`gameScroll`"
    :style="`height:${gameAreaH}px`"
  >
    <div
      v-if="['10005', '20002', '10000'].includes(scrollList.id)"
      :class="['fish gameItem', 'gameItem-' + $config.name]"
      ref="gameItem"
    >
      <div
        class="fishItem"
        v-for="(item, i) in scrollList.games"
        :key="i"
        @click="onGameClick(item)"
      >
        <div
          class="icon"
          :style="'backgroundImage:url(' + imgUrl(item.icon) + ');'"
        >
          <div
            class="name"
            v-if="['10001', '10002', '10003', '10004'].includes(scrollList.id)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <div
      :class="['gameItem', scrollList.class ? scrollList.class : '']"
      ref="gameItem"
      v-else
    >
      <div
        class="icon"
        v-for="(item, i) in scrollList.games"
        :key="i"
        @click="gameClick(item)"
        :style="'backgroundImage:url(' + imgUrl(item.icon) + ');'"
      >
        <div v-if="['10001', '10003', '10002', '10004']" class="name">
          <span class="name-box"
            ><span>{{ item.name }}</span></span
          >
        </div>
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
      type: Object,
    },
    currIndex: {
      type: Number,
    },
    index: {
      type: Number,
    },
    gameAreaH: {
      type: Number,
    },
    gameListArr: {
      type: Array,
    },
  },
  data() {
    return {
      scroll: null,
      idConfig,
      scrollList: null,
    };
  },
  methods: {
    imgUrl (url) {
      return this.publicStaticHost + '/images/'+ url

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
    gameClick(item) {
      if (
        (this.currIndex === 10001 || this.currIndex === 10004) &&
        item.id !== 10001
      ) {
        item["id"] = item.gcid;
        item["isgame"] = 0;
      }
      this.onGameClick(item);
    },
  },
  created() {
    this.idConfig = idConfig;
    this.scrollList = JSON.parse(JSON.stringify(this.gameList));
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
          probeType: 3,
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
    },
  },
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
  &.opacityAnt {
    animation: opacityAnimation 0s 0.25s linear forwards;
  }
  .gameItem {
    display: block;
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
      border-radius: 0.2rem;
      box-shadow: 0 0 0.15rem #00000036;
      &:first-child {
        margin-left: 0;
      }
      .name {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0.5rem;
        line-height: 0.58rem;
        font-size: 0.28rem;
        font-weight: 500;
        font-family: Microsoft YaHei;
        color: #967247;
        padding-left: 0.12rem;
        background: #e2e9f6;
        text-align: left;
        border-radius: 0 0 0.1rem 0.1rem;
        .name-box {
          content: "";
          display: inline-block;
          position: absolute;
          height: 0.6rem;
          top: -0.1rem;
          left: 0;
          bottom: 0;
          background: #ffffff65;
          border-radius: 0 0.2rem 0 0.1rem;
          span {
            position: relative;
            top: 0.1rem;
            left: 0.1rem;
            font-weight: 500;
            padding: 0 0.3rem 0 0;
            margin: 0px 0 0;
          }
        }
      }
    }
    &.fish {
      overflow: hidden;
      .fishItem {
        position: relative;
        width: 1.57rem;
        height: 1.6rem;
        float: left;
        border-radius: 0.12rem;
        margin-bottom: 0.12rem;
        overflow: hidden;
        box-shadow: 0 0.1em 0.5em #0000005e;
        &:nth-of-type(3n-1) {
          margin: 0 0.144rem;
        }
        .icon {
          float: none;
          display: block;
          width: 100%;
          height: 1.56rem;
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
    }
    &.type1,
    &.type2 {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      flex-direction: row;
      align-content: flex-start;
      .icon {
        width: 49.2%;
        height: 3.5rem;
      }
    }
  }
}
</style>