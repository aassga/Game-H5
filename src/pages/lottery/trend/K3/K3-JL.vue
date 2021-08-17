<template>
  <ul class="lottery-trend">
    <li class="row title theme-border-color">
      <ul class="row-content theme-main-bg-5 theme-border-color theme-color-white">
        <li class="col col-issue theme-border-color theme-color-white">
          <span class="col-content">期号</span>
        </li>
        <li class="col col-result theme-border-color theme-color-white">
          <span class="col-content">开奖号码</span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">和值</span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">大小</span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">单双</span>
        </li>
      </ul>
    </li>
    <li class="row" :class="i % 2 == 0? 'theme-header-bg' : 'theme-main-bg-5'" v-for="(item, i) in list" :key="i">
      <ul class="row-content">
        <li class="col col-issue theme-border-color theme-color-white">
          <span class="col-content">{{item.issue}}</span>
        </li>
        <li class="col col-result theme-border-color theme-color-white">
          <span class="col-content">
            <i class="ball ball-k3" :class="'ball-k3-' + num" v-for="(num, j) in item.resultInfo.split(',')" :key="j"></i>
          </span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">
            {{item['hz']}}
          </span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">
            <i class="ball" :class="{red:item['hdx']==='大',blue:item['hdx']==='小',green:item['hdx']==='和'}">{{item['hdx']}}</i>
          </span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">
            <i class="ball" :class="{red:item['hds']==='双',blue:item['hds']==='单',green:item['hds']==='和'}">{{item['hds']}}</i>
          </span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script type="text/javascript">

export default {
  name: 'K3-JL',
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
