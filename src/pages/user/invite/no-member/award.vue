<template>
  <view-page full-box>
    <div class="header" slot="header">
      <title-header slot="header" :class="['header',{'blush-header':$config.blush}]" >
        <span :class="['header-item',{active : headerIndex === 0}]" class="blush-border-color-3" @click="headerIndex = 0">邀请奖励</span>
        <span :class="['header-item',{active : headerIndex === 1}]" class="blush-border-color-3" @click="headerIndex = 1">奖励规则</span>
      </title-header>
    </div>
    <div  :class="['content-slot',{'blush-content-slot':$config.blush}]" slot="content">
      <div v-if="headerIndex === 0">
        <div v-if="headerList.length" class="list">
          <div class="list-header">
            <div class="blush-color-yellow-5" :class="['list-header-item',{active:item.id === headerId}]" v-for="item in headerList" :key="item.class_name" @click="onTabChange(item.id)">{{item.class_name}}</div>
          </div>
          <div class="list-cont blush-bg-color-1 blush-color-white"  v-if="list && list.length">
            <div class="left-list">
              <ul>
                <li class="list-head blush-color-white">好友等级</li>
                <li class="list-item">
                  <span class="span-item blush-color-yellow-6 ">等级</span>
                  <span class="span-item blush-color-yellow-6 ">累积打码</span>
                </li>
                <li v-for="(item,i) in list" :key="i" class="list-item">
                  <span class="span-item">{{item.level}}级</span>
                  <span class="span-item">{{item.betAmount}}</span>
                </li>
              </ul>
            </div>
            <div class="right-list" ref="scrollBox">
              <ul>
                <li class="right-list-head list-head">
                  <span class="span-head span-head1 blush-color-white">邀请者奖励</span>
                  <span class="span-head span-head2">邀请者门槛</span>
                </li>
                <li class="list-item">
                  <span class="span-item blush-color-yellow-6 ">晋级礼金</span>
                  <span class="span-item blush-color-yellow-6 ">周俸禄</span>
                  <span class="span-item blush-color-yellow-6 ">月俸禄</span>
                  <span class="span-item blush-color-yellow-6 ">分红</span>
                  <span class="span-item blush-color-yellow-6 ">邀请人数</span>
                  <span class="span-item blush-color-yellow-6 ">存款金额</span>
                  <span class="span-item blush-color-yellow-6 ">打码量(倍)</span>
                </li>
                <li v-for="(item,i) in list" :key="i" class="list-item">
                  <span class="span-item">{{item.giftAmount}}</span>
                  <span class="span-item">{{item.week_money}}</span>
                  <span class="span-item">{{item.month_money}}</span>
                  <span class="span-item">{{item.fenhong}}</span>
                  <span class="span-item">{{item.renshu}}</span>
                  <span class="span-item">{{item.payMoney}}</span>
                  <span class="span-item">{{item.betMultiple}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div v-else :style="{minHeight:$store.state.main.windowHeight - 0.88 * rem +'px'}">
            <img style="width: 100%;margin-top: 2rem;" :src="noDataImg" alt />
            <p style="font-size: 0.3rem;color: #666666">暂无邀请奖励</p>
          </div>
        </div>
        <div v-else :style="{minHeight:$store.state.main.windowHeight - 0.88 * rem +'px'}">
          <img style="width: 100%;margin-top: 2rem;" :src="noDataImg" alt />
          <p style="font-size: 0.3rem;color: #666666">暂无邀请奖励</p>
        </div>
      </div>
      <div v-else class="rule">
        <p><span class="num">1</span>.即日起，会员邀好友注册，好友达到金管家等级，会员满足邀请人数条件，存款打码要求。即可领取好友对应等级的礼金奖励，周俸禄奖励，月俸禄奖励和分红奖励。（礼金,月俸禄和分红为一月统计一次存款打码，周俸禄为每周统计一次存款打码，打码不区分类型，需满足等级打码要求，并按照会员的实际存款乘以倍数进行计算打码）。</p>
        <p class="color-red"><span class="num">2</span>.金管家礼金有2种类型：只要达到条件可领取双重金管家礼金</p>
        <p>（1）做为会员身份玩家为1种类型，只要自身达到相关金管家等级条件，即可领取自身对应等级的晋级礼金，周俸禄，月俸禄</p>
        <p>（2）做为邀请者身份为1种类型，只要邀好友注册，好友达到金管家等级，会员自身满足好友对应等级的邀请人数，存款打码要求，即可获得另一份邀请礼金，邀请周俸禄，邀请月俸禄和邀请分红奖励</p>
        <p class="color-red">此活动是针对邀请者身份的活动奖励</p>
        <p class="color-red">注：a.当邀请者自身金管家等级 ≥ 5级时，按照列表中的邀请人数条件进行奖励发放</p>
        <p class="color-red">b.当邀请者自身金管家等级＜5级时，需至少邀请2人才可进行奖励发放</p>
        <p>如列表中1~5级邀请人数条件均为1人，当邀请者自身为金管家0~4等级时，要拿到1~5级的邀请奖励需至少邀请2人才能得到奖励</p>
        <p>当邀请者自身为金管家5级时，要拿到1~5级的邀请奖励只需邀请1人就能得到奖邀请励</p>
        <p class="color-red"><span class="num">3</span>.邀请人数：邀请的每个会员必须有金管家等级才算有效的好友人数</p>
        <p><span class="num">4</span>.分红奖励：按照每个好友的现金利润（现金利润=存款-取款）占比进行计算（且在满足人数要求的情况下，对应人数好友必须同时大于等于当前等级才能领取当前等级分红奖励）</p>
        <p>如 1等级邀请人数要求为3人，2等级人数要求也为3人，会员邀请了4个好友A,B,C,D， A在2等级，B在2等级 ,C在1等级,D在0等级，此时发放分红时，会员只能领取A,B,C,3个好友的的1等级分红，不能领取A,B2等级的分红，因为领取2等级分红需要有3个好友并且这3个好友都在2等级才能领取2等级分红，当A在2等级，B在2等级，C也晋升为2等级，D晋升为1等时，此时会员可领取A,B,C三个好友2等级的分红，可领取D的1等级分红，A,B,C,的1等级分红就不能再领了,只能领达到条件的最高级分红</p>
        <p><span class="num">5</span>.领取方式：系统自动发放，需会员主动在邀请好友首页领取</p>
        <p><span class="num">6</span>.发放时间：</p>
        <p>（1）礼金奖励发放时间：每天系统实时发放，每一等级只可领一次</p>
        <p>（2）周俸禄奖励发放时间：每周二12：30系统自动发放，每周二统计上周数据，每周可领取一次</p>
        <p>（3）月俸禄奖励发放时间：每月5号12：30系统自动发放，每月5号统计上月数据，每月可领取一次</p>
        <p>（4）分红奖励发放时间：每月2号15:00系统自动发放，每月2号统计上月数据，每月可领取一次</p>
        <p><span class="num">7</span>.特殊情况：</p>
        <p>礼金奖励：如当好友一次直接达到4等级，会员满足4等级邀请人数，存款打码要求，那会员1，2，3，4等级的礼金奖励均可领取</p>
        <p>周俸禄奖励/月俸禄奖励/分红奖励：如当好友一次直接达到4等级，会员满足4等级邀请人数，存款打码要求，那会员只可领取4等级的邀请奖励</p>
        <p><span class="num">8</span>.金管家等级由各金管家游戏类型的累计有效打码进行计算，如棋牌/电子/捕鱼金管家等级只计算棋牌/电子/捕鱼累计有效打码。</p>
        <p><span class="num">9</span>. 无论是个人或团体，如有任何威胁、滥用或使用不诚实方式套利的行为系统将自动拉入优惠黑名单将不能参与所有优惠，并取消该团队或个人优惠金额盈利金额，只保留本金</p>
        <p><span class="num">10</span>. 同一玩家冒充好友注册将不符合申请礼金/代理条件</p>
        <p><span class="num">11</span>. 玩家晋升为代理后如发现有团体进行对打行为，我司将有权收回代理资格</p>
        <p><span class="num">12</span>. {{$config.setName}}将保留对活动的最终解释权，且在任何情况下可随时更改、停止、取消该优惠权利，谢谢！</p>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import BScroll from "better-scroll";
export default {
  name: "award",
  data() {
    return {
      headerIndex:0,
      list: [],
      headerList: [],
      headerId: '',
      scroll: null,
    };
  },
  created() {
    let noInviteClassList = JSON.parse(sessionStorage.getItem('noInviteClassList'))
    if(noInviteClassList) {
      this.headerList = noInviteClassList
      this.headerId = this.headerList[0].id
      this.getList()
    }
    this.$store
      .dispatch("agency/getInvitation", {
        activityType: "XinJinGuanJiaClass",
      })
      .then(res => {
        if (res.code === 200) {
          this.headerList = res.data
          this.headerId = this.headerList[0].id
          sessionStorage.setItem('noInviteClassList',JSON.stringify(res.data))
          this.getList()
        }
      });
  },
  methods: {
    getList() {
      this.$store
      .dispatch("agency/getInvitation", {
        activityType: "XinJinGuanJiaConfig",
        classId: this.headerId
      })
      .then(res => {
        if (res.code === 200) {
          this.list = res.data
          setTimeout(() => {
            this.scroll ? this.scroll.refresh() : this.initScroll()
          }, 400);
        }
      });
    },
    onTabChange(id) {
      this.headerId = id
      // this.scroll && this.scroll.scrollTo(0,0,0)
    },
    initScroll() {
      if(this.$refs.scrollBox) {
        this.scroll = new BScroll(this.$refs.scrollBox, {
          useTransition: (this.$mobileDevice.osVersion.split('.')[0]>= 13 && this.$mobileDevice.osVersion.split('.')[1] >= 3) ? false : true,
          bindToWrapper: true,
          click: true,
          scrollX: true,
          scrollY: false,
          disableMouse: true,
          eventPassthrough: 'vertical',
          preventDefault: true,
        })
      }
    }
  },
  watch: {
    headerId() {
      this.getList()
    }
  },
  computed: {
    noDataImg(){
      if(this.$config.blackTheme || this.$config.newQP) {
        return require('@src/assets/img/yellow.png')
      } else if (this.$config.blush) {
        return require('@src/assets/img/blush.png')
      }else if (this.targetTheme && this.targetTheme['code']) {
        let  matchResult = this.targetTheme['code']
        return require(`@src/assets/img/${matchResult}.png`)
      } else {
        return require('@src/assets/img/no-data.png')
      }
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
.header {
  .header-item {
    display: inline-block;
    height: 0.7rem;
    line-height: 0.7rem;
    box-sizing: border-box;
    font-size: 0.34rem;
    &.active {
      border-bottom: 0.04rem solid #FFFFFF;
    }
    &:last-child {
      margin-left: 0.78rem;
    }
  }
}
.blush-header{
  .header-item{

    &.active {
        border-bottom: 0.04rem solid #FBD67A;
      }
  }
}
.content-slot {
  padding: 0;
  overflow: hidden;
  .list {
    .list-header {
      width: 100%;
      height: 0.75rem;
      line-height: 0.75rem;
      display: flex;
      background-color: #FFE7E3;
      color: #333333;
      font-size: 0.26rem;
      .list-header-item {
        flex: 1;
        justify-content: space-between;
        border-right: 0.02rem solid #FFC7BE;
        &:last-child {
          border-right: none;
        }
        &.active {
          color: #FA2020;
        }
      }
    }
    .list-cont {
      background-color: #fff;
      overflow: hidden;
      .left-list, .right-list {
        float: left;
        .list-head, .list-item {
          width: 100%;
          height: 0.75rem;
          line-height: 0.75rem;
          color: #333333;
          font-size: 0.26rem;
          border-top: 0.02rem solid #FFE8DB;
          border-right: 0.02rem solid #FFE8DB;
          &.list-head {
            border-top: none;
          }
          &.list-item {
            .span-item {
              display: inline-block;
              height: 100%;
              width: 1.38rem;
              border-right: 0.02rem solid #FFE8DB;
              &:last-child {
                border-right: none;
              }
              &:first-child {
                width: 1.54rem;
              }
            }
          }
        }
        &.left-list {
          width: 2.95rem;
        }
        &.right-list {
          width: calc(100% - 2.95rem);
          overflow: hidden;
          margin-left: -0.02rem;
          ul{
            width: 9.72rem;
            .right-list-head {
              border-right: none;
              overflow: hidden;
              border-left: 0.02rem solid #FFE8DB;
              border-right: 0.02rem solid #FFE8DB;
              span {
                float: left;
                border-right: 0.02rem solid #FFE8DB;
                &.span-head1 {
                  width: 5.52rem;
                  height: 100%;
                }
                &.span-head2 {
                  width: 4.12rem;
                  border-right: none;
                }
              }
            }
            .list-item {
              border-left: 0.02rem solid #FFE8DB;
              overflow: hidden;
              .span-item {
                width: 1.38rem !important;
                float: left;
              }
            }
          }
        }
      }
    }
  }
  .rule {
    width: 100%;
    padding: 0.46rem 0.4rem 0.4rem;
    color: #404040;
    font-size: 0.26rem;
    text-align: left;
    font-family:PingFang SC;
    line-height: 0.56rem;
    .color-red {
      color: #FF2121;
    }
    .num {
      font-weight: bold;
    }
  }
}
.blush-content-slot{
  background-color: #530107;
 .list-header{  
     background-color: #6A030B!important;
      .list-header-item{
        border-right:1px solid #530107!important;

      }
 }
 .list{
  .list-header {
    .list-header-item{
               border-top: 0.02rem solid #530107!important;
              border-right: 0.02rem solid #530107!important;
    }
  }
   .list-cont{
     
     .left-list{
  
       .list-head, .list-item{
           color: #FFFFFF!important;
              border-top: 0.02rem solid #530107!important;
              border-right: 0.02rem solid #530107!important;
             .span-item {
                border-right: 0.02rem solid #530107!important;
             }
          &.list-item {
            .span-item {
              border-right: 0.02rem solid #530107!important;
              &:last-child {
                border-right: none!important;
              }
           
            }
            .span-item:last-child{
               border-right: none;
            }
          }
       }
       
       
     }
       .right-list{
           ul{
              .right-list-head {
                 border-top: 0.02rem solid #530107!important;
              border-right: 0.02rem solid #530107!important;
               border-left: 0.02rem solid #530107!important;
                  span{
                         border-right: 0.02rem solid #530107!important;
                  }
              }
              .list-item{
                 border-left: 0.02rem solid #530107!important;
                     border-top: 0.02rem solid #530107!important; 
    border-right: 0.02rem solid #530107!important;
    span{
       border-right: 0.02rem solid #530107!important;
       color:#FFFFFF;
    }
              }
           }
        
         }
   }
 }
 .rule{
     color: #FFFFFF;
     .color-red{
      color:#FBD67A;
     }
 }
}
</style>
