<template>
  <ul class="lottery-trend">
    <li class="row title nosolid theme-header-bg">
      <ul class="row-content">
        <li class="col col-issue theme-border-color theme-color-white">
          <span class="col-content">期号</span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">1龙虎</span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">2龙虎</span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">3龙虎</span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">4龙虎</span>
        </li>
        <li class="col col-num theme-border-color theme-color-white">
          <span class="col-content">5龙虎</span>
        </li>
      </ul>
    </li>
    <li :class="['row',i % 2 === 0 ? 'theme-header-bg' : 'theme-main-bg-5']" v-for="(item, i) in list" :key="i">
      <ul class="row-content">
        <li class="col col-issue theme-border-color theme-color-white">
          <span class="col-content">{{item.issue}}</span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">
            <i class="ball" :class="{red:item['lh1']==='龙', vnsRed:item['lh1']==='龙' && $config.home == 'vns',blue:item['lh1']==='虎', vnsBlue:item['lh1']==='虎' &&  $config.home == 'vns',green:item['lh1']==='和'}">{{item['lh1']}}</i>
          </span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">
            <i class="ball" :class="{red:item['lh2']==='龙', vnsRed:item['lh2']==='龙' && $config.home == 'vns',blue:item['lh2']==='虎', vnsBlue:item['lh2']==='虎' &&  $config.home == 'vns',green:item['lh2']==='和'}">{{item['lh2']}}</i>
          </span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">
            <i class="ball" :class="{red:item['lh3']==='龙', vnsRed:item['lh3']==='龙' && $config.home == 'vns',blue:item['lh3']==='虎', vnsBlue:item['lh3']==='虎' &&  $config.home == 'vns',green:item['lh3']==='和'}">{{item['lh3']}}</i>
          </span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">
            <i class="ball" :class="{red:item['lh4']==='龙', vnsRed:item['lh4']==='龙' && $config.home == 'vns',blue:item['lh4']==='虎', vnsBlue:item['lh4']==='虎' &&  $config.home == 'vns',green:item['lh4']==='和'}">{{item['lh4']}}</i>
          </span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">
            <i class="ball" :class="{red:item['lh5']==='龙', vnsRed:item['lh5']==='龙' && $config.home == 'vns',blue:item['lh5']==='虎', vnsBlue:item['lh5']==='虎' &&  $config.home == 'vns',green:item['lh5']==='和'}">{{item['lh5']}}</i>
          </span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script type="text/javascript">

export default {
  name: 'PK10-LH',
  props: {
    dataList: {
      type: Array
    }
  },
  computed: {
    list () {
      return this.dataList.map(item => {
        item = JSON.copyObj(item)
        item.issue = this.$route.params.id.toString() === '2' ? item.issue : item.issue.toString().substr(8)
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
      width: 1rem;
    }

    .col-num {
      width: 1.3rem;
    }
  }
</style>
