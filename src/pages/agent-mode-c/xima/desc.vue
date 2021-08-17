<template>
  <view-page class="agent-center-modec" full-box>
    <div class="header" slot="header">
      <title-header
        class="title"
        backEvent
        @back="$router.push('/user/agency-center-modec/xm-inquire')"
        title="洗码说明"
      ></title-header>
    </div>
    <div slot="header-static">
      <van-tabs v-model="tabIndex" :line-height="2" :swipe-threshold="5">
        <van-tab v-for="(tab, i) in tabs" :key="i" :title="tab.name"></van-tab>
      </van-tabs>
    </div>
    <div slot="content" class="content">
      <transition-group :name="animation" class="animation-box" tag="p" ref="animationBox">
        <div class="content-body" ref="solid" :key="'wrapper_' + tabIndex">
          <div class="table">
            <ul>
              <li class="title">
                <div class="range">洗码范围</div>
                <div class="name">洗码等级</div>
                <div class="proport">洗码比例</div>
              </li>
              <li class="list">
                <div class="range">11</div>
                <div class="name">11</div>
                <div class="proport">1</div>
              </li>
            </ul>
          </div>
        </div>
      </transition-group>
    </div>
  </view-page>
</template>

<script>
export default {
  data() {
    return {
      tabIndex: 0,
      tabs: [
        {
          name: "彩票",
          type: "LOTTERY"
        },
        {
          name: "棋牌",
          type: "CHESS"
        },
        {
          name: "视讯",
          type: "LIVE"
        },
        {
          name: "电子",
          type: "SLOT"
        },
        {
          name: "体育",
          type: "SPORT"
        }
      ],
      animation: "slide-right"
    };
  },
  methods: {},
  components: {},
  watch: {
    tabIndex(val, old) {
      if (val < old) {
        this.animation = "slide-right";
      } else {
        this.animation = "slide-left";
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
          & > div {
            flex: 1;
            font-size: 0.28rem;
            color: #444;
          }
          &.title {
            background-color: #e9f1fe;
            font-weight: bold;
            border-radius:.1rem .1rem 0 0;
          }
          &.list {
            font-weight: normal;
            background-color: #fff;
            border-bottom: 1px dashed #e7e7e7;
            &:last-child {
              border-bottom: none;
              border-radius:0 0 .1rem .1rem;
            }
          }
        }
      }
    }
  }
}
</style>