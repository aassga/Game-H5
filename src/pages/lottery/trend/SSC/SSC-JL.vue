<template>
  <div class="lottery-trend">
    <div class="lottery-trend-body">
      <ul class="lottery-trend-issue">
        <li class="row title issue nosolid theme-main-bg-5 theme-border-color">
          <ul class="row-content">
            <li class="col col-issue theme-color-white">
              <span class="col-content">期号</span>
            </li>
          </ul>
        </li>
        <li class="row issue theme-border-color theme-color-white" :class="i % 2 == 0? 'theme-header-bg' : 'theme-main-bg-5'" v-for="(item, i) in list" :key="i">
          <ul class="row-content">
            <li class="col col-issue">
              <span class="col-content">{{item.issue}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <scroll-box class="lottery-trend-content" direction="horizontal">
        <ul>
          <li class="row title nosolid theme-main-bg-5 theme-noborder" ref="title">
            <ul class="row-content theme-color-white">
              <li class="col col-result theme-border-color">
                <span class="col-content">开奖号码</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">万位</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">千位</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">百位</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">十位</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">个位</span>
              </li>
            </ul>
          </li>
          <li class="row theme-noborder" v-for="(item, i) in list" :key="i" :class="i % 2 == 0? 'theme-header-bg' : 'theme-main-bg-5'">
            <ul class="row-content">
              <li class="col col-result theme-border-color">
                <span class="col-content">
                  <i class="ball theme-bg" v-for="(num, i) in item.resultInfo.split(',')" :key="i">{{num}}</i>
                </span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">
                  <i class="ball" :class="{red:item['ww'][0]==='大', vnsRed: item['ww'][0]==='大' && $config.home == 'vns', blue:item['ww'][0]==='小', vnsBlue: item['ww'][0]==='小' && $config.home == 'vns', green:item['ww'][0]==='和'}">{{item['ww'][0]}}</i>
                  <i class="ball" :class="{red:item['ww'][1]==='双', vnsRed: item['ww'][1]==='双' && $config.home == 'vns', blue:item['ww'][1]==='单', vnsBlue: item['ww'][1]==='单' && $config.home == 'vns', green:item['ww'][1]==='和'}">{{item['ww'][1]}}</i>
                </span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">
                  <i class="ball" :class="{red:item['qw'][0]==='大',vnsRed: item['qw'][0]==='大' && $config.home == 'vns',blue:item['qw'][0]==='小', vnsBlue: item['qw'][0]==='小' && $config.home == 'vns',green:item['qw'][0]==='和'}">{{item['qw'][0]}}</i>
                  <i class="ball" :class="{red:item['qw'][1]==='双',vnsRed: item['qw'][1]==='双' && $config.home == 'vns',blue:item['qw'][1]==='单', vnsBlue: item['qw'][1]==='单' && $config.home == 'vns',green:item['qw'][1]==='和'}">{{item['qw'][1]}}</i>
                </span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">
                  <i class="ball" :class="{red:item['bw'][0]==='大',vnsRed: item['bw'][0]==='大' && $config.home == 'vns',blue:item['bw'][0]==='小', vnsBlue: item['bw'][0]==='小' && $config.home == 'vns',green:item['bw'][0]==='和'}">{{item['bw'][0]}}</i>
                  <i class="ball" :class="{red:item['bw'][1]==='双',vnsRed: item['bw'][1]==='双' && $config.home == 'vns',blue:item['bw'][1]==='单', vnsBlue: item['bw'][1]==='单' && $config.home == 'vns',green:item['bw'][1]==='和'}">{{item['bw'][1]}}</i>
                </span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">
                  <i class="ball" :class="{red:item['sw'][0]==='大',vnsRed: item['sw'][0]==='大' && $config.home == 'vns',blue:item['sw'][0]==='小', vnsBlue: item['sw'][0]==='小' && $config.home == 'vns', green:item['sw'][0]==='和'}">{{item['sw'][0]}}</i>
                  <i class="ball" :class="{red:item['sw'][1]==='双',vnsRed: item['sw'][1]==='双' && $config.home == 'vns',blue:item['sw'][1]==='单', vnsBlue: item['sw'][1]==='单' && $config.home == 'vns',green:item['sw'][1]==='和'}">{{item['sw'][1]}}</i>
                </span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">
                  <i class="ball" :class="{red:item['gw'][0]==='大',vnsRed: item['gw'][0]==='大' && $config.home == 'vns',blue:item['gw'][0]==='小', vnsBlue: item['gw'][0]==='小' && $config.home == 'vns', green:item['gw'][0]==='和'}">{{item['gw'][0]}}</i>
                  <i class="ball" :class="{red:item['gw'][1]==='双',vnsRed: item['gw'][1]==='双' && $config.home == 'vns',blue:item['gw'][1]==='单', vnsBlue: item['gw'][1]==='单' && $config.home == 'vns',green:item['gw'][1]==='和'}">{{item['gw'][1]}}</i>
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
  name: 'PCDD-ZS',
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
    .issue{
      .col{
        border-right:0;
      }
    }

    .col-result {
      width: 2.7rem;
    }

    .col-num {
      width: 1.2rem;
    }
  }
</style>
