<template>
  <ul class="lottery-trend">
    <li class="row title nosolid theme-border-color ">
      <ul class="row-content theme-main-bg-5 theme-border-color theme-color-white">
        <li class="col col-issue theme-border-color ">
          <span class="col-content">期号</span>
        </li>
        <li class="col col-result theme-border-color ">
          <span class="col-content">开奖号码</span>
        </li>
        <li class="col col-sx theme-border-color ">
          <span class="col-content">和值</span>
        </li>
        <li class="col col-sx theme-border-color ">
          <span class="col-content">大小</span>
        </li>
        <li class="col col-sx theme-border-color ">
          <span class="col-content">单双</span>
        </li>
        <li class="col col-sx theme-border-color ">
          <span class="col-content">色波</span>
        </li>
      </ul>
    </li>
    <li class="row theme-color-white" :class="i % 2 == 0? 'theme-header-bg' : 'theme-main-bg-5'" v-for="(item, i) in list" :key="i">
      <ul class="row-content">
        <li class="col col-issue theme-border-color ">
          <span class="col-content">{{item.issue}}</span>
        </li>
        <li class="col col-result theme-border-color ">
          <span class="col-content">
            <i class="ball theme-bg" v-for="(num, j) in item.resultInfo.split(',')" :key="j">{{num}}</i>
          </span>
        </li>
        <li class="col col-sx theme-border-color ">
          <span class="col-content">
            {{item['hz']}}
          </span>
        </li>
        <li class="col col-sx theme-border-color ">
          <span class="col-content">
            <i class="ball" :class="{blue:item['dx']==='小',vnsBlue:item['dx']==='小' && $config.home == 'vns',red:item['dx']==='大',vnsRed:item['dx']==='大' && $config.home == 'vns'}">{{item['dx']}}</i>
          </span>
        </li>
        <li class="col col-sx theme-border-color ">
          <span class="col-content">
            <i class="ball" :class="{blue:item['ds']==='单',vnsBlue:item['ds']==='单' && $config.home == 'vns', red:item['ds']==='双',vnsRed:item['ds']==='双' && $config.home == 'vns'}">{{item['ds']}}</i>
          </span>
        </li>
        <li class="col col-sx theme-border-color ">
          <span class="col-content">
            {{item['sb']}}
          </span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script type="text/javascript">

export default {
  name: 'PCDD-SX',
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

    .col-sx {
      width: 1.05rem;
    }
  }
</style>
