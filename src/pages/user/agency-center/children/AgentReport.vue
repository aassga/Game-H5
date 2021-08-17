<template>
  <view-page class="view-page" full-box>
    <title-header slot="header" title="代理报表" >
      <span class="header-right" slot="right" @click="dateShow=true">
        {{date.name}}<i class="fa fa-fw fa-angle-down"></i>
      </span>
    </title-header>
    <div slot="header-static">
      <ios-popup-select v-model="date" :show.sync="dateShow" :list="dates" key-name="index" val-name="name"></ios-popup-select>
    </div>
    <div class="body" slot="content">
      <ul class="list" style="background-color: #FFFFFF">
        <li class="item" v-for="item in list" :key="item.name">
            <p class="value" :class="{red:parseFloat(item.value)}">{{item.value}}</p>
            <p class="label">{{item.name}}</p>
        </li>
        <li class="item" v-for="item in (3 - list.length % 3) % 3" :key="item">
          <p class="value">&nbsp;</p>
          <p class="label">&nbsp;</p>
        </li>
      </ul>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'AgentReport',
  data () {
    return {
      dateShow: false,
      date: { index: 1, name: '今天' },
      dates: [
        { index: 1, name: '今天' },
        { index: 2, name: '昨天' },
        { index: 3, name: '本月' },
        { index: 4, name: '上月' }
      ],
      list: []
    }
  },
  created () {
    this.refresh()
  },
  watch: {
    date () {
      this.refresh()
    }
  },
  methods: {
    onSwipeLeft () {
      if (this.dateIndex + 1 < 4) {
        this.dateIndex++
      }
    },
    onSwipeRight () {
      if (this.dateIndex > 0) {
        this.dateIndex--
      }
    },
    onClick (item) {
      this.date = item
      this.dateShow = false
    },
    refresh () {
      this.$store.state.main.loadingText = '正在获取...'
      this.$store.dispatch('agent/agencyReport', {
        date: this.date.index,
        callback: res => {
          if (res && res.code === 200) {
            this.list = res.data
          } else if (res) {
            this.toastText(res.message, 'top')
            this.list = []
          } else {
            this.toastText('获取数据失败', 'top')
            this.list = []
          }

          this.$store.state.main.loadingText = ''
        }
      })
    }
  },
  beforeDestroy () {
    this.$store.state.main.loadingText = ''
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .view-page {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .body {
      flex: 1;
      width: 100%;
      height: calc(100% - 0.9rem);
    }

    .header-right {
      position: absolute;
      right: 0.24rem;
      top: 0;
      height: 100%;
      color:#444444;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.32rem;
    }

    .red {
      color: #ff2200 !important
    }

    /*
    .cell-box {
      padding: 0.14rem 0.24rem;
      display: flex;
      position: relative;
      box-sizing: border-box;
      margin: 0;
      width: 100%;
      font-size: 0.3rem;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;

      .title {
        color: @base-font-color-black;
      }

      .value {
        color: #888888;
        font-size: 0.36rem;
      }
    }
    */

    .list {
      margin-top: 0.2rem;
      width: 100%;

      &:after {
        content: '';
        clear: both;
        display: table;
      }

      .item {
        display: block;
        box-sizing: border-box;
        width: calc(100% / 3);
        border-right: 0.02rem solid hsla(0, 0%, 95%, 1);
        border-top: 0.02rem solid hsla(0, 0%, 95%, 1);
        float: left;
        background-color: #fff;
        padding: 0.3rem 0;

        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3) {
          border-top: 0;
        }

        .label {
          width: 100%;
          font-size: 0.3rem;
          line-height: 0.68rem;
        }

        .value {
          width: 100%;
          font-size: 0.345rem;
          line-height: 0.68rem;
        }
      }
    }
  }
</style>
