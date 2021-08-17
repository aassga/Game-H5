<template>
  <ul class="lottery-trend">
    <li class="row title nosolid">
      <ul class="row-content theme-main-bg-5 theme-border-color theme-color-white">
        <li class="col col-issue theme-border-color ">
          <span class="col-content">期号</span>
        </li>
        <li class="col col-result theme-border-color ">
          <span class="col-content">开奖号码</span>
        </li>
        <li class="col col-num theme-border-color ">
          <span class="col-content">色波</span>
        </li>
        <li class="col col-num theme-border-color ">
          <span class="col-content">大小</span>
        </li>
        <li class="col col-num theme-border-color ">
          <span class="col-content">单双</span>
        </li>
      </ul>
    </li>
    <li :class="['row',i % 2 === 0 ? 'theme-header-bg' : 'theme-main-bg-5']" v-for="(item, i) in list" :key="i">
      <ul class="row-content theme-color-white">
        <li class="col col-issue theme-border-color ">
          <span class="col-content">{{item.issue}}</span>
        </li>
        <li class="col col-result theme-border-color ">
          <span class="col-content">
            <i class="ball"
               :class="{red:bose.red.includes(parseInt(num)),blue:bose.blue.includes(parseInt(num)),green:bose.green.includes(parseInt(num)),'add theme-color':num==='+'}"
               v-for="(num, j) in item.resultInfo" :key="j">{{num}}</i>
          </span>
        </li>
        <li class="col col-num theme-border-color ">
          <span class="col-content">
            {{item['sb']}}
          </span>
        </li>
        <li class="col col-num theme-border-color ">
          <span class="col-content">
            <i class="ball" :class="{ball: true, blue: item['dx'] === '小',vnsBlue: item['dx'] === '小' && $config.home == 'vns', red: item['dx'] === '大',vnsRed: item['dx'] === '大' && $config.home == 'vns', green: item['dx'] === '和'}">{{item['dx']}}</i>
          </span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">
            <i class="ball" :class="{blue: item['ds'] === '单',vnsBlue: item['ds'] === '单' && $config.home == 'vns', red: item['ds'] === '双', vnsRed: item['ds'] === '双' && $config.home == 'vns', green: item['ds'] === '和'}">{{item['ds']}}</i>
          </span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script type="text/javascript">

export default {
  name: 'LHC-JL',
  props: {
    dataList: {
      type: Array
    }
  },
  data () {
    return {
      bose: {
        red: [1, 7, 13, 19, 23, 29, 35, 45, 2, 8, 12, 18, 24, 30, 34, 40, 46],
        blue: [3, 9, 15, 25, 31, 37, 41, 47, 4, 10, 14, 20, 26, 36, 42, 48],
        green: [5, 11, 17, 21, 27, 33, 39, 43, 6, 16, 22, 28, 32, 38, 44, 49]
      }
    }
  },
  computed: {
    list () {
      return this.dataList.map(item => {
        item = JSON.copyObj(item)
        item.issue = this.$route.params.id.toString() === '1' ? item.issue.toString().substr(4) : item.issue.toString().substr(8)
        item.resultInfo = item.resultInfo.split(',').map(num => num.length === 1 ? '0' + num : num)
        item.resultInfo.splice(6, 0, '+')
        return item
      })
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .lottery-trend {
    .nosolid{
      border-top:none;
    }
    .col-issue {
      width: 0.9rem;
    }

    .col-result {
      width: 3.9rem;

      .blue {
        background-color: #20a2d8 !important;
      }

      .red {
        background-color: #f36055 !important;
      }

      .green {
        background-color: #49bb27 !important;
      }
    }

    .col-num {
      width: 0.9rem;
    }
    .blue {
      background-color: #5598FC;
    }
    .red {
      background-color: #FB162D;
    }
    .green {
      background-color: #4CAF50;
    }
  }
</style>
