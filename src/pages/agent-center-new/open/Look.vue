<template>
  <view-page class="agent-link-look theme-header-bg" full-box is-transition>
    <title-header  title="查看赔率" slot="header" class="theme-main-bg theme-header-bottom"></title-header>
    <div class="content-slot" slot="content" v-if="openData">
      <div class="header" :class="{'header-code':siteModel === 'invite_code'}">
          <div class="header-title theme-agent-rebate theme-yellow-bg-2">
              <div class="bmg" v-if="siteModel === 'invite_link'">
                 <p class="content-row theme-color-black">{{openData['domain']}}</p>
                  <p class="info-row theme-color-black">
          <!--          <span class="info-row-item">状态:{{openData['status'] === 'yes' ? '启用' : '禁用'}}</span>-->
                    <span class="info-row-item">类型:{{openData['is_agency'] ? '代理' : '会员'}}</span>
                    <span class="info-row-item">注册:{{openData['register_count']}}人</span>
                    <span class="info-row-item"></span>
                  </p>
              </div>
              <div class="bmg" v-else>
                <p class="info-row theme-color-black">
                    <span class="info-row-item">类型:{{openData['is_agency'] ? '代理' : '会员'}}</span>
                    <span class="info-row-item">注册:{{openData['register_count']}}人</span>
                    <span class="info-row-item">邀请码:{{openData['agencyCode']}}</span>
                  </p>
              </div>
              <div class="bor-bot theme-bg theme-yellow-bg-2"></div>
              <div class="bor-bot theme-bg theme-yellow-bg-2"></div>
          </div>
      </div>

      <ul class="view-box theme-main-bg-5">
        <li class="rebate-item theme-after-border-color" v-for="(item, i) in oddsDate" :key="i" @click="$router.push('/user/agency-center-new/open/look/' + i)">
          <span class="label" :class="{'theme-color-gray':$config.blackTheme || $config.newQP,'theme-color-white':$config.blush}">{{item['type_cn']}}</span>
          <span class="label" :class="{'theme-color-gray':$config.blackTheme || $config.newQP,'theme-color-white':$config.blush}">我的:<i class="value">{{item['max_rate']}}%</i></span>
          <span class="label" :class="{'theme-color-gray':$config.blackTheme || $config.newQP,'theme-color-white':$config.blush}">下级:<i class="value">{{getVal(item['max_rate'],item['maxOdds'])}}%</i></span>
          <span class="van-icon van-icon-arrow"></span>
        </li>
        <!-- <li class="rebate-item" v-for="(item, i) in openData.platform" :key="i" @click="$router.push('/user/agency-center-new/open/look/' + i)">
          <span class="label">{{item['type_cn']}}</span>
          <span class="info">我的:<i class="value">{{$store.state.agency.refundRebate[i]['max_rate']}}%</i></span>
          <span class="info">下级:<i class="value">{{item['min_rate']}}%</i></span>
          <span class="van-icon van-icon-arrow"></span>
        </li> -->
      </ul>

      <div class="action-box">
        <button class="btn-copy theme-bg theme-yellow-bg-2 theme-color-black" @click="onCopy">复制邀请{{siteModel === 'invite_link'?'链接':'码'}}</button>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'look',
  data(){
     return {
       oddsDate:[],  
     }  
  },
  computed: {
    openData () {
      return this.$store.state.agency.openDataForLook
    },
    myData () {
      return this.$store.state.agency.refundRebate
    },
  },
  mounted(){
      this.getMaxCommission()
  },
  methods: {
    onCopy () {
      if (this.siteModel === 'invite_link') {
        this.$copyText(`${this.openData['domain']}`)
      } else {
        this.$copyText(`${window.location.origin}\n邀请码: ${this.openData['agencyCode']}`)
      }

      this.toastText('复制成功', 'top')
    },
    getMax(list) {
      let index = 0;
      let val = 0;
      list.forEach((item, i) => {
        const v = parseFloat(item.midOdds.toString());
        if (v > val) {
          val = v;
          index = i;
        }
      });
      return list[index];
    },
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
    getMaxCommission(){
        this.oddsDate=[]
        this.openData.platform.forEach((item,itemIndex)=>{
        this.myData.forEach(initItem=>{
            if(item.type_en==initItem.type_en){
                this.oddsDate.push({
                    type_cn:item.type_cn,
                    list:[],
                    maxOdds:'',
                    max_rate:initItem.max_rate,
                })
                initItem.list.forEach((init)=>{
                      item.list.forEach((listItem)=>{
                           if(init.platform_en==listItem.platform_en){
                                 this.oddsDate[itemIndex]['list'].push({
                                     platform_cn:init.platform_cn,
                                     platform_en:init.platform_en,
                                     midOdds:this.getVal(init.val,listItem.val)
                                 })
                           }
                      })
                })
                this.oddsDate[itemIndex]['maxOdds']=(this.getMax(this.oddsDate[itemIndex]['list'])).midOdds
            }
        })
      })
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .agent-link-look {
    .header-code{
      height:0.96rem !important;
    }
    .header {
      width: 7.18rem;
      height: 1.58rem;
      margin: 0 auto;
      color: #ffffff;
      background-size: 100%;
      .header-title{
        border-radius:0.1rem;
        position: relative;
        .bmg{
          width: 100%;
          height: 100%;
          background:url('../../../assets/img/user/peili_bg@2x.png')0 -20px no-repeat;;
          background-size: 100% 100%;
          color: #FFFFff;
          font-size: 0.3rem;
          padding: 0.24rem 0.24rem 0.28rem 0.24rem;
          position: relative;
          border-radius: 0.2rem;
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

        .content-row {
          display: block;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 0.32rem;
          line-height: 0.45rem;
          text-align: left;
          margin-bottom: 0.24rem;
        }
      .info-row {
        font-size: 0.3rem;
        line-height: 0.42rem;
        width:100%;
        justify-content: space-between;
        .info-row-item {
          display: inline-block;
          text-align: left;
          width:33.33%;
          &:first-child {
            display: inline-block;
            text-align: left;
          }

          &:nth-child(2){
            //padding-left:0.5rem;
          }
        }
        }
      }
    }
    .view-box {
      padding: 0 0.24rem;
      margin-top:0.34rem;
    }

    .rebate-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 1.12rem;
      // border-bottom: 0.01rem solid #E7E7E7;
      position: relative;
      &::after{
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0rem;
        bottom: 0;
        // top: 0;
        left: 0rem;
        border-bottom: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }

      .label {
        font-size: 0.3rem;
        font-weight: bold;
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
      padding: 0.65rem 0.16rem;

      .btn-copy {
        width: 7.18rem;
        height: 0.96rem;
        border-radius: 0.1rem;
        background-color: #2C93FF;
        color: #FFFFff;
        font-size: 0.38rem;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        text-align: center;
        line-height: 0.96rem;
      }
    }
  }
</style>
