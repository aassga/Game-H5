<template>
  <ul class="lottery-trend">
    <li class="row title">
      <ul class="row-content">
        <li class="col col-issue">
          <span class="col-content">期号</span>
        </li>
        <li class="col col-result">
          <span class="col-content">开奖号码</span>
        </li>
        <li class="col col-num">
          <span class="col-content">百位</span>
        </li>
        <li class="col col-num">
          <span class="col-content">十位</span>
        </li>
        <li class="col col-num">
          <span class="col-content">个位</span>
        </li>
      </ul>
    </li>
    <li class="row" v-for="(item, i) in list" :key="i">
      <ul class="row-content">
        <li class="col col-issue">
          <span class="col-content">{{item.issue}}</span>
        </li>
        <li class="col col-result">
          <span class="col-content">
            <i class="ball theme-bg" v-for="(num, j) in item.resultInfo.split(',')" :key="j">{{num}}</i>
          </span>
        </li>
        <li class="col col-num">
          <span class="col-content">
            <i class="ball" :class="{red:item['bw'][0]==='大',blue:item['bw'][0]==='小',green:item['bw'][0]==='和'}">{{item['bw'][0]}}</i>
            <i class="ball" :class="{red:item['bw'][1]==='双',blue:item['bw'][1]==='单',green:item['bw'][1]==='和'}">{{item['bw'][1]}}</i>
          </span>
        </li>
        <li class="col col-num">
          <span class="col-content">
            <i class="ball" :class="{red:item['sw'][0]==='大',blue:item['sw'][0]==='小',green:item['sw'][0]==='和'}">{{item['sw'][0]}}</i>
            <i class="ball" :class="{red:item['sw'][1]==='双',blue:item['sw'][1]==='单',green:item['sw'][1]==='和'}">{{item['sw'][1]}}</i>
          </span>
        </li>
        <li class="col col-num">
          <span class="col-content">
            <i class="ball" :class="{red:item['gw'][0]==='大',blue:item['gw'][0]==='小',green:item['gw'][0]==='和'}">{{item['gw'][0]}}</i>
            <i class="ball" :class="{red:item['gw'][1]==='双',blue:item['gw'][1]==='单',green:item['gw'][1]==='和'}">{{item['gw'][1]}}</i>
          </span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script type="text/javascript">

export default {
  name: 'DPC-JL',
  props: {
    dataList: {
      type: Array
    }
  },
  computed: {
    list () {
      return this.dataList.map(item => {
        item = JSON.copyObj(item)
        item.issue = item.issue.toString().substr(this.$route.params.id.toString() === '29' ? 8 : 4)
        return item
      })
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .lottery-trend {

    .col-issue {
      width: 1rem;
    }

    .col-result {
      width: 2rem;
    }

    .col-num {
      width: 1.5rem;
    }
  }
</style>
