<template>
  <div class="lottery-trend">
    <div class="lottery-trend-body">
      <ul class="lottery-trend-issue">
        <li class="row title issue nosolid theme-main-bg-5 theme-color-white theme-border-color">
          <ul class="row-content">
            <li class="col col-issue">
              <span class="col-content">期号</span>
            </li>
          </ul>
        </li>
        <li class="row issue theme-color-white theme-border-color" v-for="(item, i) in list" :key="i" :class="i % 2 == 0? 'theme-header-bg' : 'theme-main-bg-5'">
          <ul class="row-content">
            <li class="col col-issue">
              <span class="col-content">{{item.issue}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <scroll-box class="lottery-trend-content" direction="horizontal">
        <ul>
          <li class="row title nosolid theme-border-color" ref="title">
            <ul class="row-content theme-main-bg-5 theme-color-white">
              <li class="col col-result theme-border-color">
                <span class="col-content">开奖号码</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">前三</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">中三</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">后三</span>
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
              <li class="col col-num theme-border-color">
                <span class="col-content">牛牛</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">梭哈</span>
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
                <span class="col-content">{{item['qs']}}</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">{{item['zs']}}</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">{{item['hs']}}</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">{{item['hz']}}</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">{{item['dx']}}</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">{{item['ds']}}</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">{{item['lh']}}</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">{{item['nn']}}</span>
              </li>
              <li class="col col-num theme-border-color">
                <span class="col-content">{{item['sh']}}</span>
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
  name: 'PCDD-XT',
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
      width: 1rem;
    }
  }
</style>
