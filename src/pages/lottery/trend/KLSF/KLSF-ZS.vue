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
          <span class="col-content">尾大小</span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">上下盘</span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">奇偶盘</span>
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
            {{item['wdx']}}
          </span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">
            {{item['sxp']}}
          </span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">
            {{item['jop']}}
          </span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script type="text/javascript">

export default {
  name: 'KLSF-ZS',
  props: {
    dataList: {
      type: Array
    }
  },
  computed: {
    list () {
      if (this.dataList && this.dataList.length) {
        return this.dataList.map(item => {
          item = JSON.copyObj(item)
          item.issue = item.issue.toString().substr(8)
          return item
        })
      } else {
        return []
      }
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
      width: 0.7rem;
    }

    .col-result {
      width: 3.8rem;
    }

    .col-num {
      width: 1rem;
    }
  }
</style>
