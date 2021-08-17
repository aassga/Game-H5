<template>
  <div class="lottery-trend">
    <div class="lottery-trend-body">
      <ul class="lottery-trend-issue">
        <li class="row title nosolid nosolid-right">
          <ul class="row-content theme-main-bg-5 theme-border-color theme-color-white">
            <li class="col col-issue theme-border-color">
              <span class="col-content">期号</span>
            </li>
          </ul>
        </li>
        <li class="row nosolid-right theme-color-white" :class="i % 2 == 0? 'theme-header-bg' : 'theme-main-bg-5'" v-for="(item, i) in list" :key="i">
          <ul class="row-content">
            <li class="col col-issue theme-border-color">
              <span class="col-content">{{item.issue}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <scroll-box class="lottery-trend-content" direction="horizontal">
        <ul>
          <li class="row title nosolid theme-border-color" ref="title">
            <ul class="row-content theme-main-bg-5 theme-border-color theme-color-white">
              <li class="col col-result theme-border-color">
                <span class="col-content">开奖号码</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">和值</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">大小</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">单双</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">龙虎</span>
              </li>
            </ul>
          </li>
          <li class="row theme-color-white theme-border-color" :class="i % 2 == 0? 'theme-header-bg' : 'theme-main-bg-5'" v-for="(item, i) in list" :key="i">
            <ul class="row-content">
              <li class="col col-result theme-border-color">
                <span class="col-content">
                  <i class="ball theme-bg" v-for="(num, i) in item.resultInfo.split(',')" :key="i">{{num}}</i>
                </span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">
                  {{item['hz']}}
                </span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">
                  <i class="ball" :class="{blue: item['dx'] === '小',vnsBlue: item['dx'] === '小' && $config.home == 'vns', red: item['dx'] === '大', vnsRed: item['dx'] === '大' && $config.home == 'vns', green: item['dx'] === '和'}">{{item['dx']}}</i>
                </span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">
                  <i class="ball" :class="{blue: item['ds'] === '单',vnsBlue: item['ds'] === '单' && $config.home == 'vns', red: item['ds'] === '双',vnsRed: item['ds'] === '双' && $config.home == 'vns', green: item['ds'] === '和'}">{{item['ds']}}</i>
                </span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">
                  <i class="ball" :class="{blue: item['lh'] === '虎',vnsBlue: item['lh'] === '虎' && $config.home == 'vns', red: item['lh'] === '龙',vnsRed: item['lh'] === '龙' && $config.home == 'vns', green: item['lh'] === '和'}">{{item['lh']}}</i>
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
  name: 'KLSF-JL',
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
    .nosolid-right{
      border-right:none;
    }
    .row-content{
      width: 100%;
    }
    .col-issue {
      width: 100%;
    }

    .col-result {
      width: 3.8rem;
    }

    .col-num {
      width: 1.1rem;
    }
  }
</style>
