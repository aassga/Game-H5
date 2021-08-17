<template>
  <div class="lottery-trend">
    <div class="lottery-trend-body">
      <ul class="lottery-trend-issue">
        <li class="row title theme-main-bg-5 theme-border-color theme-color-white">
          <ul class="row-content">
            <li class="col col-issue theme-border-color">
              <span class="col-content">期号</span>
            </li>
          </ul>
        </li>
        <li class="row" :class="i % 2 == 0? 'theme-header-bg' : 'theme-main-bg-5'" v-for="(item, i) in list" :key="i">
          <ul class="row-content">
            <li class="col col-issue theme-border-color">
              <span class="col-content">{{item.issue}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <scroll-box class="lottery-trend-content" direction="horizontal">
        <ul>
          <li class="row title theme-main-bg-5 theme-border-color" ref="title">
            <ul class="row-content">
              <li class="col col-result theme-border-color theme-color-white">
                <span class="col-content">开奖号码</span>
              </li>
              <li class="col col-res theme-border-color theme-color-white">
                <span class="col-content">和值</span>
              </li>
              <li class="col col-res theme-border-color theme-color-white">
                <span class="col-content">跨度</span>
              </li>
              <li class="col col-num theme-border-color theme-color-white" v-for="n in 6" :key="n">
                <span class="col-content">{{n}}</span>
              </li>
            </ul>
          </li>
          <li class="row theme-border-color" :class="i % 2 == 0? 'theme-header-bg' : 'theme-main-bg-5'" v-for="(item, i) in list" :key="i">
            <ul class="row-content">
              <li class="col col-result theme-border-color">
                <span class="col-content">
                  <i class="ball ball-k3" :class="'ball-k3-' + num" v-for="(num, j) in item.resultInfo" :key="j"></i>
                </span>
              </li>
              <li class="col col-res theme-border-color">
                <span class="col-content">
                  {{item['hz']}}
                </span>
              </li>
              <li class="col col-res theme-border-color">
                <span class="col-content">
                  {{item['kd']}}
                </span>
              </li>
              <li class="col col-num theme-border-color" v-for="n in 6" :key="n">
                <span class="col-content" v-if="item.resultInfo.includes(n)">
                  <i class="ball line red" :class="'ball-' + item.resultInfo.filter(num => num === n).length">{{n}}</i>
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </scroll-box>
    </div>
  </div>
</template>

<script type="text/javascript">

export default {
  name: 'K3-HM',
  props: {
    dataList: {
      type: Array
    }
  },
  computed: {
    list () {
      return this.dataList.map(item => {
        item = JSON.copyObj(item)
        item.issue = item.issue.toString().substr(8)
        item.resultInfo = item.resultInfo.split(',').map(num => parseInt(num))
        return item
      })
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .lottery-trend {
    .col-issue {
      width: 0.9rem;
    }

    .col-result {
      width: 2rem;
    }

    .col-res {
      width: 0.9rem;
    }

    .col-num {
      width: 0.58rem;
    }

    .ball-2:after {
      content: '2';
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: 0.42rem;
      height: 0.42rem;
      background-color: #bb9431;
      border-radius: 50%;
      right: -0.16rem;
      top: -0.16rem;
      transform: scale(0.5);
    }

    .lottery-trend-body {
      width: 100%;

      &:after {
        content: ' ';
        display: table;
        clear: both;
      }

      .lottery-trend-issue {
        float: left;
        width: 0.9rem;
      }

      .lottery-trend-content {
        float: left;
        width: 6.6rem;
        position: relative;
      }
    }
  }
</style>
