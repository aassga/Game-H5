<template>
  <ul class="lottery-trend">
    <li class="row title nosolid">
      <ul class="row-content theme-main-bg-5 theme-border-color theme-color-white">
        <li class="col col-issue theme-border-color">
          <span class="col-content">期号</span>
        </li>
        <li class="col col-result theme-border-color">
          <span class="col-content">开奖号码</span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">第一球</span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">第二球</span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">第三球</span>
        </li>
      </ul>
    </li>
    <li class="row theme-color-white" :class="i % 2 == 0? 'theme-header-bg' : 'theme-main-bg-5'" v-for="(item, i) in list" :key="i">
      <ul class="row-content">
        <li class="col col-issue theme-border-color">
          <span class="col-content">{{item.issue}}</span>
        </li>
        <li class="col col-result theme-border-color">
          <span class="col-content">
            <i class="ball theme-bg" v-for="(num, j) in item.resultInfo.split(',')" :key="j">{{num}}</i>
          </span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">
            <i class="ball" :class="{red:item['dyq'][0]==='大', vnsRed:item['dyq'][0]==='大' && $config.home == 'vns',blue:item['dyq'][0]==='小',vnsBlue:item['dyq'][0]==='小' && $config.home == 'vns', green:item['dyq'][0]==='和'}">{{item['dyq'][0]}}</i>
            <i class="ball" :class="{red:item['dyq'][1]==='双', vnsRed:item['dyq'][1]==='双' && $config.home == 'vns',blue:item['dyq'][1]==='单',vnsBlue:item['dyq'][1]==='单' && $config.home == 'vns', green:item['dyq'][1]==='和'}">{{item['dyq'][1]}}</i>
          </span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">
            <i class="ball" :class="{red:item['deq'][0]==='大', vnsRed:item['deq'][0]==='大' && $config.home == 'vns',blue:item['deq'][0]==='小',vnsBlue:item['deq'][0]==='小' && $config.home == 'vns',green:item['deq'][0]==='和'}">{{item['deq'][0]}}</i>
            <i class="ball" :class="{red:item['deq'][1]==='双', vnsRed:item['deq'][1]==='双' && $config.home == 'vns',blue:item['deq'][1]==='单',vnsBlue:item['deq'][1]==='单' && $config.home == 'vns', green:item['deq'][1]==='和'}">{{item['deq'][1]}}</i>
          </span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">
            <i class="ball" :class="{red:item['dsq'][0]==='大', vnsRed:item['dsq'][0]==='大' && $config.home == 'vns',blue:item['dsq'][0]==='小',vnsBlue:item['dsq'][0]==='小' && $config.home == 'vns',green:item['dsq'][0]==='和'}">{{item['dsq'][0]}}</i>
            <i class="ball" :class="{red:item['dsq'][1]==='双', vnsRed:item['dsq'][1]==='双' && $config.home == 'vns',blue:item['dsq'][1]==='单',vnsBlue:item['dsq'][1]==='单' && $config.home == 'vns', green:item['dsq'][1]==='和'}">{{item['dsq'][1]}}</i>
          </span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script type="text/javascript">

export default {
  name: 'PCDD-JL',
  props: {
    dataList: {
      type: Array
    }
  },
  computed: {
    list () {
      return this.dataList.map(item => {
        item = JSON.copyObj(item)
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
      width: 1.3rem;
    }

    .col-result {
      width: 2rem;
    }

    .col-num {
      width: 1.4rem;
    }
  }
</style>
