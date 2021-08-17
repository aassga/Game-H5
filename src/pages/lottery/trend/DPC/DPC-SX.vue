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
        <li class="col col-sx">
          <span class="col-content">和值</span>
        </li>
        <li class="col col-sx">
          <span class="col-content">跨度</span>
        </li>
        <li class="col col-sx">
          <span class="col-content">走势</span>
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
        <li class="col col-sx">
          <span class="col-content">
            {{item['hz']}}
          </span>
        </li>
        <li class="col col-sx">
          <span class="col-content">
            {{item['kd']}}
          </span>
        </li>
        <li class="col col-sx">
          <span class="col-content">
            {{item['xt']}}
          </span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script type="text/javascript">

export default {
  name: 'DPC-SX',
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

    .col-sx {
      width: 1.5rem;
    }
  }
</style>
