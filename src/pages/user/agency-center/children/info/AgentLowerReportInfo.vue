<template>
  <view-page class="view-page" full-box>
    <title-header title="代理报表" slot="header">
        <span class="header-right" slot="right" @click="dateShow=true">
          {{date.name}}<i class="fa fa-fw fa-angle-down"></i>
        </span>
    </title-header>
    <div slot="static">
      <ios-popup-select @select="onClick" :show="dateShow" :list="dates" @cancel="dateShow=false" key-name="index" val-name="name"></ios-popup-select>
    </div>

    <div class="content-slot" slot="content">
      <div class="search-box">
        <input class="input" v-model="userName" type="text" placeholder="请输入帐号"/>
        <button class="button theme-bg" @click="refresh">
          <span class="fa fa-fw fa-search"></span>
        </button>
      </div>
      <ul class="list">
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
  name: 'AgentLowerReportInfo',
  props: {
    uid: {
      type: String,
      required: true
    }
  },
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
      list: [],
      userName: '',
      loading: false
    }
  },
  watch: {
    date () {
      this.refresh()
    }
  },
  created () {
    this.refresh()
  },
  methods: {
    onClick (item) {
      this.date = item
      this.dateShow = false
    },
    refresh () {
      let data = {
        date: this.date.index,
        uname: this.userName,
        uid: this.uid,
        callback: res => {
          if (res.code === 200) {
            this.list = res.data
          } else if (res) {
            this.toastText(res.message, 'top')
            this.list = []
          } else {
            this.toastText('获取数据失败', 'top')
            this.list = []
          }
          this.loading = false
          this.$store.state.main.loadingText = ''
        }
      }
      if (data.uname) {
        delete data.uid
      } else {
        delete data.uname
      }
      if (!this.uid) {
        this.toastText('无效的帐号', 'top')
      } else if (this.loading) {
        this.toastText('正在查询', 'top')
      } else {
        this.loading = true
        this.$store.state.main.loadingText = '查询中...'
        this.$store.dispatch(
          'agent/agencyReportByUser',
          data
        )
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .view-page {
    .header-right {
      position: absolute;
      right: 0.24rem;
      top: 0;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.28rem;
    }

    .cell-box {
      padding: 0.16rem 0.24rem;
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
      }

      .value {
        color: #888888;
      }
    }

    .search-box {
      width: 100%;
      box-sizing: border-box;
      padding: 0 0.24rem;
      margin: 0;
      position: relative;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;

      .input {
        flex: 1;
        font-size: 0.28rem;
        border-top-left-radius: 0.1rem;
        border-bottom-left-radius: 0.1rem;
        line-height: 0.64rem;
        padding: 0 0.24rem;
        -webkit-appearance: none;

        &:focus {
          outline: 0;
        }
      }

      .button {
        width: 0.64rem;
        height: 0.64rem;
        color: #FFFFFF;
        border: none;
        outline: 0;
        border-top-right-radius: 0.1rem;
        border-bottom-right-radius: 0.1rem;
      }
    }

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

    .red {
      color: #ff2200;
    }
  }
</style>
