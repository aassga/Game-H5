<template>
  <view-page class="agent-link-look" :class="{'theme-header-bg':$config.blackTheme || $config.newQP,'theme-main-bg':$config.blush}" full-box>
    <title-header :title="openData&&(openData['type_cn'])" slot="header" class="theme-main-bg theme-header-bottom"></title-header>
    <div class="content-slot" :class="{'theme-header-bg':$config.blackTheme || $config.newQP,'theme-main-bg':$config.blush}" slot="header-static" v-if="openData">
      <div class="header theme-agent-rebate theme-yellow-bg-2">
        <div class="header_bg theme-color-black">
          <span class="look-item">{{openData['type_cn']}}</span>
          <span class="look-item" >我的:{{myData['max_rate']}}%</span>
          <span class="look-item" style="padding-left: 0.6rem;">下级:{{getVal(myData['max_rate'],maxCommission['commission'])}}%</span>
        </div>
        <div class="bor-bot theme-bg theme-yellow-bg-2"></div>
        <div class="bor-bot theme-bg theme-yellow-bg-2"></div>
      </div>

      <ul class="row title theme-main-bg-9 theme-color-white" :class="{'black-title' :$config.blackTheme|| $config.newQP,'blush-title' :$config.blush}">
        <li class="col col-name">游戏平台</li>
        <li class="col col-value">我的</li>
        <li class="col col-value">下级</li>
        <li class="col col-value">提成</li> 
      </ul>
    </div>

    <ul class="list" :class="{'theme-main-bg-5':$config.blackTheme || $config.newQP,'theme-main-bg-1':$config.blush}" slot="content">
       <li v-for="(item, i) in listArray" :key="i" class="row theme-color-gray theme-after-border-color" :class="{'theme-color-white':$config.blush}">
        <span class="col col-name">{{item['platform_cn']}}</span>
        <span class="col col-value">{{item.myValue}}%</span>
        <span class="col col-value">{{item.openValue}}%</span>
        <span class="col col-value">{{item.commission}}%</span>
      </li>
    </ul>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'look',
  data(){
    return{
       listArray:[],
       maxCommission:"",
    }
  },
  props: {
    index: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    myData () {
      return this.$store.state.agency.refundRebate[this.index]
    },
    openData () {
      return this.$store.state.agency.openDataForLook['platform'][this.index]
    }
  },
  mounted () {
    this.computedData()
  },
  methods: {
    getVal (sv1, sv2) {
      if (!sv1) return ''
      const v1 = parseFloat(sv1)
      const v2 = parseFloat(sv2)
      const val = Math.round((v1 * 10) - (v2 * 10)) / 10
      if (val.toString().includes('.')){
        if(parseFloat(val) < 0){
          return '0.0'
        }else{
          return val.toString()
        }
        
      }
      else return val + '.0'
    },
    computedData(){
       if(this.myData.list.length>0 && this.openData.list.length>0){
            this.listArray=[]
            this.myData.list.forEach((myItem)=>{
                this.openData.list.forEach((openItem)=>{
                    if(myItem['platform_cn']==openItem['platform_cn']){
                        this.listArray.push({
                             platform_cn:myItem['platform_cn'],
                             myValue:myItem['val'],
                             openValue:openItem['val'],
                             commission:this.getVal(myItem['val'],openItem['val'])
                        })
                    }
                })
            })
            this.maxCommission=this.getMax(this.listArray)
       }
    },
    getMax(list) {
      let index = 0;
      let val = 0;
      list.forEach((item, i) => {
        const v = parseFloat(item.commission.toString());
        if (v > val) {
          val = v;
          index = i;
        }
      });
      return list[index];
    },
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .agent-link-look {
    .header {
        width: 7.18rem;
        margin: 0 auto;
        border-radius:.1rem;
        position: relative;
      .header_bg{
        height: 0.96rem;
        background-image:url('../../../assets/img/user/peili_bg@2x.png');
        background-size: 100% 100%;
        padding: 0.27rem 0.24rem 0.47rem 0.24rem;
        color: #ffffff;
        font-size: 0.3rem;
        text-align: left;
        position: relative;
        justify-content: space-between;
        .look-item{
          display: inline-block;
          text-align: center;
          width:33.33%;
          &:first-child {
            display: inline-block;
            text-align: left;
          }
        }
      }
      .bor-bot{
        position: absolute;
        bottom: -0.1rem;
        height: 0.1rem;
        width: 7rem;
        left: 50%;
        margin-left: -3.5rem;
        border-radius: 0 0 1rem 1rem;
        opacity: 0.3;
      }
      .bor-bot:last-of-type{
        position: absolute;
        bottom: -0.2rem;
        height: 0.1rem;
        width: 6.7rem;
        left: 45%;
        margin-left: -3rem;
        border-radius: 0 0 1rem 1rem;
        opacity: 0.1;
      }
    }

    .view-box {
      padding: 0 0.24rem;
    }

    .rebate-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 1.12rem;
      border-bottom: 0.02rem solid #E7E7E7;

      .label {
        font-size: 0.3rem;
        font-weight: 500;
        color: #444444;
        margin-right: 0.7rem;
      }

      .info {
        font-size: 0.3rem;
        color: #444444;
        margin-right: 0.5rem;
      }

      .value {
        color: #D94D46;
      }

      .van-icon {
        color: #999999;
        font-size: 0.24rem;
        font-weight: 500;
        flex: 1;
        text-align: right;
      }

      &:last-child {
        border-bottom: none;
      }
    }

    .action-box {
      padding: 0.32rem 0.16rem;

      .btn-copy {
        width: 7.18rem;
        height: 0.96rem;
        border-radius: 0.1rem;
        background-color: #2C93FF;
        color: #FFFFff;
        font-size: 0.38rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .row {
      position: relative;
      padding: 0;
      height: 0.96rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #444444;
      font-size: 0.28rem;
      //border-bottom: 0.014rem solid #ebedf0;
      &:after{
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0;
        bottom: 0;
        left: 0;
        border-bottom: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }
      &:last-child {
        &:after{
          content:none;
          display:none;
        }
        //border-bottom: none;
      }

      &.title {
        font-weight: 500;
        background-color: rgba(44, 147, 255, 0.12);
        border-top-left-radius: 0.1rem;
        border-top-right-radius: 0.1rem;
        width: 7.18rem;
        margin: 0.34rem auto 0 auto;
        &.black-title {
          background-color: #555246 !important;
        }
        &.blush-title {
          background-color: #882020 !important;
        }
      }

      .col {
        &.col-name {
          flex: 1;
        }

        &.col-value {
          width: 22%;
        }
      }
    }

    .list {
      padding-bottom: 0.24rem;
      background-color: #ffffff;
      border-radius:0.02rem;
    }

    /deep/ .auto-box-content {
      width: 7.18rem;
      margin: 0 0.16rem;
      background-color: rgba(0, 0, 0, 0);
      box-shadow: 0 0.05rem 0.05rem 0 rgba(0, 0, 0, 0.03);
      border-bottom-left-radius: 0.1rem;
      border-bottom-right-radius: 0.1rem;
      position: relative;
      top: -0.24rem;
      padding-top: 0.24rem;
    }

  }
</style>
