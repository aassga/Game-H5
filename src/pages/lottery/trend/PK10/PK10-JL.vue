<template>
  <ul class="lottery-trend" :class="'lottery'+$route.params.id">
    <li class="row title nosolid theme-border-color" :class="{'trend-title':['13','3630','12'].includes(id)}" >
      <ul class="row-content theme-header-bg theme-color-white">
        <li class="col col-issue theme-border-color">
          <span class="col-content">期号</span>
        </li>
        <li class="col col-result theme-border-color">
          <span class="col-content">开奖号码</span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">冠亚</span>
        </li>
      </ul>
    </li>
    <li class="row" v-for="(item, i) in list" :key="i">
      <ul class="row-content theme-main-bg-5" :class="{'xysc-content':['13','3630','12'].includes(id)}" v-if="['13','3630','12'].includes(id)">
        <li class="col col-issue theme-border-color">
          <span class="col-content xysc-title theme-color-white">开奖来源</span>
        </li>
        <li class="col col-result theme-border-color">
          <span class="col-content">
            <span class="xysc-title theme-color-white">【{{item.historyLotteryName}}】</span>
            <span class="xysc-title theme-color-white" xt-title> {{new Date(item.historyOpenTime*1000).getFullYear()+'年'+ (parseInt(new Date(item['historyOpenTime']*1000).getMonth())+1) + '月'+ new Date(item.historyOpenTime*1000).getDate()+'日'}}</span>
            <span class="xysc-title xt-data theme-color-white">{{item.historyIssue}}期</span>
          </span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">

          </span>
        </li>
      </ul>
      <ul class="row-content theme-header-bg" :class="{'xysc-content':['13','3630','12'].includes(id)}">
        <li class="col col-issue theme-border-color">
          <span class="col-content theme-color-white">{{item.issue}}</span>
        </li>
        <li class="col col-result theme-border-color">
          <span class="col-content">
            <i class="ball ball-pk10 theme-bg" :class="['ball-pk10-'+parseInt(num),'ball-pk10-r-'+(['2','3'].includes($route.params.id.toString())?0:1)]"
               v-for="(num, j) in item.resultInfo.split(',')" :key="j">{{parseInt(num)}}</i>
          </span>
        </li>
        <li class="col col-num theme-border-color">
          <span class="col-content">
            <i :class="['ball','ball-res',{'black-color': $config.blackTheme || $config.newQP}]">{{item['gyh']}}</i>
            <i class="ball ball-res" :class="{red:item['gydx']==='大', vnsRed:item['gydx']==='大' && $config.home == 'vns', blue:item['gydx']==='小',vnsBlue:item['gydx']==='小' && $config.home == 'vns',green:item['gydx']==='和'}">
              {{item['gydx']}}
            </i>
            <i class="ball ball-res" :class="{red:item['gyds']==='双',vnsRed:item['gyds']==='双' && $config.home == 'vns', blue:item['gyds']==='单', vnsBlue:item['gyds']==='单' && $config.home == 'vns'}">
              {{item['gyds']}}
            </i>
          </span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script type="text/javascript">

export default {
  name: 'PK10-JL',
  props: {
    dataList: {
      type: Array
    },
    id: {
      type: String,
      default: ''
    }
  },
  mounted(){
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
  .lottery13{
    background-color: red;
    .row:nth-child(n+1){
      background-color: #f8f8f8;
      .row-content:nth-child(1){
        background-color: white;
      }
    }
  }
  .lottery-trend {
  .nosolid{
      border-top:none;
    }
    .row {
      height: auto;
    }

    .row-content {
      display: block;
      // padding: .06rem 0;
      height: 0.6rem;
    }
    .xysc-content{
      background: #fff;
      &:last-of-type{
        background: #f8f8f8;
      }
    }
    .xysc-title {
      font-size: 0.24rem;
      color: #606060;
      font-weight: normal;
    }
   

    .xysc-title:last-of-type {
      margin-left: 0.08rem;
    }

    .col-issue {
      width: 1.1rem;
    }

    .col-result {
      width: 4.8rem;
    }

    .col-num {
      width: 1.6rem;
    }
  
    .ball-pk10 {

      &.ball-pk10-1 {
        background-color: #FAA000 !important;
        border-color: #FAA000 !important;
        color: #fff !important;
      }

      &.ball-pk10-2 {
        background-color: #0171D3 !important;
        border-color: #0171D3 !important;
        color: #fff !important;
      }

      &.ball-pk10-3 {
        background-color: #666669 !important;
        border-color: #666669 !important;
        color: #fff !important;
      }

      &.ball-pk10-4 {
        background-color: #FC7103 !important;
        border-color: #FC7103 !important;
        color: #fff !important;
      }

      &.ball-pk10-5 {
        background-color: #00A39F !important;
        border-color: #00A39F !important;
        color: #fff !important;
      }

      &.ball-pk10-6 {
        background-color: #5034F7 !important;
        border-color: #5034F7 !important;
        color: #fff !important;
      }

      &.ball-pk10-7 {
        background-color: #8B858F !important;
        border-color: #8B858F !important;
        color: #fff !important;
      }

      &.ball-pk10-8 {
        background-color: #DCB600 !important;
        border-color: #DCB600 !important;
        color: #fff !important;
      }

      &.ball-pk10-9 {
        background-color: #970101 !important;
        border-color: #970101 !important;
        color: #fff !important;
      }

      &.ball-pk10-10 {
        background-color: #05A102 !important;
        border-color: #05A102 !important;
        color: #fff !important;
      }

      &.ball-pk10-r-0 {
        border-radius: 0 !important;
      }

      &.ball-pk10-r-1 {
        border-radius: 0.1rem !important;
      }
    }

    .ball-res {
      color: #333 !important;
      border-radius: 0.1rem !important;
      border: 0.02rem solid #f3f3f3 !important;
      font-weight: bold!important;
      &.black-color {
        color: #fff !important;
      }
      &.red {
        color: #FB162D !important;
        background-color: rgba(0, 0, 0, 0) !important;
      }

      &.vnsRed {
        color: #F76665 !important;
        background-color: rgba(0, 0, 0, 0) !important;
      }
      &.blue {
        color: #5598FC !important;
        background-color: rgba(0, 0, 0, 0) !important;
      }

      &.vnsBlue{
        color: #00bdd4 !important;
        background-color: rgba(0, 0, 0, 0) !important;
      }

      &.green {
        color: #4CAF50 !important;
        background-color: rgba(0, 0, 0, 0) !important;
      }
    }
  }
</style>
