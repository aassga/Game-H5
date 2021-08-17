<template>
  <view-page class="view-page" full-box>
    <title-header title="下级人数" slot="header"></title-header>
    <div class="content-slot" slot="header-static">
      <date-interval v-model="dateIndex" :date.sync="date" default></date-interval>
      <ul class="row title clear-fix">
        <li class="col f-l col-time">时间</li>
        <li class="col f-l col-count">总人数</li>
        <li class="col f-l col-count">新增人数</li>
        <li class="col f-l col-count">存款人数</li>
      </ul>
    </div>
    <van-tabs v-model="dateIndex" class="no-tab" slot="content" animated swipeable :lazy-render="false">
      <van-tab v-for="i in 4" :key="'animation-box-'+i">
        <van-cell-group>
          <van-cell v-for="(item, j) in list[i-1]" :key="item.date+'-'+j">
            <ul class="row clear-fix">
              <li class="col f-l col-time">
                <p class="date">{{item['date']}}</p>
                <p class="week">星期{{item['week']}}</p>
              </li>
              <li class="col f-l col-count">{{item['count']}}</li>
              <li class="col f-l col-count">{{item['newuser']}}</li>
              <li class="col f-l col-count">{{item['deposituser']}}</li>
            </ul>
          </van-cell>
        </van-cell-group>
      </van-tab>
    </van-tabs>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'AgentLowerCount',
  data () {
    return {
      dateIndex: 0,
      date: null,
      list: [[], [], [], []],
      animation: ''
    }
  },
  watch: {
    dateIndex (now, old) {
      this.animation = now > old ? 'slide-left' : 'slide-right'
      this.refreshList()
    }
  },
  created () {
    this.refreshList()
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
    refreshList () {
      const index = this.dateIndex
      this.$store.state.main.loadingText = '正在获取...'
      this.$store.dispatch(
        'agent/lowerPeople',
        { date: index + 1 }
      ).then(res => {
        if (res.code === 200) {
          this.$set(this.list, index, res.data)
        } else {
          this.toastText('获取列表失败', 'top')
        }
        this.$store.state.main.loadingText = ''
      }).catch(() => {
        this.$store.state.main.loadingText = ''
      })
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .view-page {
    .title {
      background-color: #fff;
      margin-top: 0.2rem;
      border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
      height: 0.6rem !important;
      line-height: 0.6rem !important;

      .col-count {
        line-height: 0.6rem;
      }
    }

    .row {
      font-size: 0.28rem;
      line-height: 0.56rem;
      width: 100%;
      box-sizing: border-box;
      text-align: center;

      .col {
        display: block;
        padding: 0;
        margin: 0;

        &-time {
          width: 25%;
        }

        &-count {
          width: 25%;
        }
      }
    }

    .footer {
      left: 0;
      text-align: right;
      font-size: 0.3rem;
      line-height: 0.9rem;
      width: 100%;
      padding: 0 0.24rem;
      box-sizing: border-box;
      z-index: 1000;
      border-top: 0.02rem solid hsla(0, 0%, 95%, 1);

      .red {
        font-size: 0.32rem;
        padding: 0 0.1rem;
      }
    }

    .col {
      color: #888888;

      &-time {

        .date {
          line-height: 0.6rem;
        }

        .week {
          line-height: 0.3rem;
        }
      }

      &-count {
        line-height: 1rem;
      }
    }

    /deep/ .van-cell {
      margin: 0;
    }
  }
</style>
