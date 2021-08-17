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
          <span class="col-content">三同号</span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">三不同</span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">三连号</span>
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
            <i class="ball ball-xt-1" v-if="item['xt']==='豹子'">{{item['xt']}}</i>
          </span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">
            <i class="ball ball-xt-1" v-if="item['xt']==='三不同'">{{item['xt']}}</i>
          </span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">
            <i class="ball ball-xt-2" v-if="item['xt']==='三连号'">{{item['xt']}}</i>
          </span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script type="text/javascript">

export default {
  name: 'K3-XT',
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

    .ball-xt-1 {
      background-color: #597d36;
      width: 1rem !important;
      border-radius: 0.05rem !important;
    }

    .ball-xt-2 {
      background-color: #bb9431;
      width: 1rem !important;
      border-radius: 0.05rem !important;
    }
  }
</style>
