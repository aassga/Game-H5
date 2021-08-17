<template>
  <view-page class="lower-report theme-header-bg" ref="view-page" full-box>
    <div slot="static" class="theme-agent-bg theme-yellow-bg-2" :style="headerStyle"></div>

    <div class="header" slot="header">
      <title-header class="title theme-color-black"  style="background-color: rgba(0,0,0,0) !important;" title="投注详情">
      </title-header>
    </div>

    <div class="content-slot record-list" slot="content" v-if="info">
      <div :class="['view-box theme-header-bg theme-border-1px-1',{'black-view-box': $config.blackTheme || $config.newQP}]" style="padding: 0.16rem;border-radius: 0.2rem;">
        <ul class="list" v-if="type==='LOTTERY'">
          <li class="item">
            <span class="label">订单号</span>
            <span class="value" style="width: 4rem;word-wrap: break-word;">{{info['billNo']}}</span>
          </li>
          <li class="item">
            <span class="label">彩种</span>
            <span class="value">{{info['lotteryName']}}</span>
          </li>
          <li class="item" >
            <span class="label">期数</span>
            <span class="value" v-if="info['gameName'] =='xglhc'">{{info['issue'].toString().substr(4)}}</span>
            <span class="value" v-else-if="['xglhc', 'bjsc', 'bjpcdd', 'xyft'].includes(info['gameName'])">{{info['issue']}}</span>
            <span class="value" v-else>{{info['issue'].toString().substr(8)}}</span>
          </li>
          <li class="item">
            <span class="label">订单数量</span>
            <span class="value">{{info['betCount']}}</span>
          </li>
          <li class="item">
            <span class="label">下注金额</span>
            <span class="value red">{{info['betAmount']}}</span>
          </li>

          <li class="item" v-if="![0,3,4,5].includes(info['status'])">
            <span class="label">有效投注</span>
            <span class="value red">{{info['validBetAmount']}}</span>
          </li>
          <li class="item item2">
            <span class="label">输赢</span>
            <span class="commission-value" v-if="info.status==1">{{info['netAmount']}}</span>
            <span class="commission-value less" v-else-if="info.status==2">{{info['netAmount'].replace('-','')}}</span>
            <span class="value value2 red" :class="'status-ball-'+info.status">{{statusLottery[info.status]}}</span>
          </li>
           <li class="item" v-if="Math.abs(info['fdAmount'])>0">
            <span class="label">会员返点</span>
            <span class="value red">{{info['fdAmount']}}</span>
          </li>
            <!-- <li class="item" v-if="info['status']==1">
            <span class="label">派奖</span>
            <span class="value red">{{info['payoutAmount']}}</span>
          </li> -->
           
          
          <li class="item">
            <span class="label">玩法</span>
            <span class="value">{{info['playwayName']}}</span>
          </li>
          <li class="item">
            <span class="label">下注内容</span>
            <span class="value" v-if="info['ball']">{{info['ball']+'-'+info['betInfo']}}</span>
            <span class="value" v-else>{{info['betInfo']}}</span>
          </li>
           <li class="item">
            <span class="label">下注时间</span>
            <span class="value">{{dayJs.unix(info['betTime']).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </li>
           <li class="item" v-if="![0,4,5].includes(info['status'])">
            <span class="label">结算时间</span>
            <span class="value">{{dayJs.unix(info['openTime']).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </li>
          <li class="item" v-if="[1,2].includes(info['status'])">
            <span class="label">开奖结果</span>
            <div class="value" v-if="['幸运赛车','快速赛车','快乐赛车'].includes(info['lotteryName']) && info.historyIssue">
              {{'['+info['historyLotteryName']+']'+ new Date(info.historyOpenTime*1000).getFullYear()+'年'+ (parseInt(new Date(info['historyOpenTime']*1000).getMonth())+1)+'月'+ new Date(info.historyOpenTime*1000).getDate()+'日'+info.historyIssue+'期'}}
              <div>{{info['result']}}</div>
            </div>
            <span class='value' v-else>{{info['result']}}</span>
          </li>
          
         
        </ul>
        <ul class="list" v-else-if="type==='SPORT'">
          <li class="item">
            <span class="label">订单号</span>
            <span class="value" style="font-size: 0.24rem;width: 4rem;word-wrap: break-word;">{{info['billNo']}}</span>
          </li>
          <li class="item">
            <span class="label">游戏名称</span>
            <span class="value">{{info['platform']}}</span>
          </li>
          <li class="item">
            <span class="label">游戏类型</span>
            <span class="value">{{info['gameName']}}</span>
          </li>
          <li class="item">
            <span class="label">投注金额</span>
            <span class="value red">{{info['betAmount']}}</span>
          </li>
          <li class="item" v-if="status[info.status] !== '待开奖'">
            <span class="label">有效投注</span>
            <span class="value red">{{info['validBetAmount']}}</span>
          </li>
          <li class="item">
            <span class="label">输赢</span>
            <!-- <span class="value" :class="'status-'+info.status">{{status[info.status]}}</span> -->
            <span class="commission-value red" v-if="info.status==1">{{info['netAmount']}}</span>
            <span class="commission-value less" v-else-if="info.status==2">{{info['netAmount'].replace('-','')}}</span>
            <span class="value value2" :class="'status-ball-'+info.status">{{statusOther[info.status]}}</span>
          </li>
          <!--<li class="item" v-if="parseFloat(info['netAmount'])">
            <span class="label">输赢</span>
            <span class="value red">{{info['netAmount']}}</span>
          </li>-->
          <li class="item">
            <span class="label">下注内容</span>
            <ul class="info-list theme-border-color">
              <li class="info-item" v-for="(item, i) in JSON.parse(info['betInfo'])" :key="i">
                <p class="info-item-col">
                  <span class="row">{{item['leaguename']}}</span>
                  <span class="row">
                    <i>{{item['hometeamname']}}</i>
                    <i class="item-vs">VS</i>
                    <i>{{item['awayteamname']}}</i>
                  </span>
                </p>
                <p class="info-item-col">
                  <!-- <span class="row" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                    <i style="margin-right: 0.1rem">赛果:</i>
                    <i>{{info['score']}}</i>
                  </span> -->
                  <span class="row">
                    <i style="margin-right: 0.1rem">赔率:</i>
                    <i class="red" v-if="type==='SPORT'">{{item['odds']}}</i>
                    <i class="red" v-else>{{item['teambetname']}}</i>
                  </span>
                </p>
              </li>
            </ul>
          </li>
          <li class="item">
            <span class="label">下注时间</span>
            <span class="value">{{dayJs.unix(info['betTime']).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </li>
          
        </ul>
        <ul class="list" v-else>
          <li class="item">
            <span class="label">订单号</span>
            <span class="value" style="font-size: 0.24rem;width: 4rem;word-wrap: break-word;">{{info['billNo']}}</span>
          </li>
          <li class="item">
            <span class="label">游戏名称</span>
            <span class="value">{{info['gameName']}}</span>
          </li>
          <li class="item">
            <span class="label">游戏类型</span>
            <span class="value">{{info['platform']}}</span>
          </li>
          <li class="item">
            <span class="label">投注金额</span>
            <span class="value red">{{info['betAmount']}}</span>
          </li>
          <li class="item">
            <span class="label">有效投注</span>
            <span class="value red">{{info['validBetAmount']}}</span>
          </li>
          <li class="item">
            <span class="label">输赢</span>
            <!-- <span class="value" :class="'status-'+info.status">{{status[info['status']]}}</span> -->
            <span class="commission-value red" v-if="info.status==1">{{info['netAmount']}}</span>
            <span class="commission-value less" v-else-if="info.status==2">{{info['netAmount'].replace('-','')}}</span>
            <span class="value value2" :class="'status-ball-'+info.status">{{statusOther[info.status]}}</span>
          </li>
          <!-- <li class="item" v-if="parseFloat(info['netAmount'])">
            <span class="label">派彩</span>
            <span class="value red">{{info['netAmount']<0?"0.00":info['netAmount']}}</span>
          </li> -->
          <li class="item">
            <span class="label">下注结果</span>
            <span class="value">{{info['betInfo']==''?'-':info['betInfo']}}</span>
          </li>
          <li class="item">
            <span class="label">下注时间</span>
            <span class="value">{{dayJs.unix(info['betTime']).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </li>
          
        </ul>
      </div>
    </div>

  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'RecodeInfo',
  computed: {
    headerStyle () {
      return {
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '2rem',
        zIndex: '-1',
      }
    },
    info () {
      return this.$store.state.agency.recodeItem
    }
  },
  data () {
    return {
      cancelling: false,
      type: 'LOTTERY',
      status: [
        '待开奖',
        '已中奖',
        '未中奖',
        '和',
        '撤销',
        '系统撤单'
      ],
      statusLottery: [
        '待',
        '中',
        '未',
        '和',
        '撤',
        '撤'
      ],
      statusOther: [
        '待',
        '赢',
        '输',
        '和',
        '撤',
        '撤'
      ],
    }
  },
  created () {
    if (!this.info) {
      this.$router.back()
    }
    this.type = this.$route.params.type
  },
  methods:{
    chedan(){
      if (this.info && !this.cancelling) {
        this.cancelling = true
        this.$store.dispatch('user/cancelBet', {
          betTime: this.info.betTime,
          recordId: this.info.id
        }).then(res => {
          this.cancelling = false;
          if (typeof res.data === 'string') {
            this.toastText(res.data, 'top')
          } else if (typeof res.message === 'string') {
            this.toastText(res.message, 'top')
          }
          if (res.code === 200) {
            setTimeout(() => {
              this.$router.back()
            }, 1000);
          }
        }).catch(err => {
          this.cancelling = false
        })
      }
    },
    goback() {
      this.$router.push({ path:'/user/record', query:{
        type: this.$route.query['type'] ||  1,
        gameType: this.$route.query['gameType'] || 0,
        winType: this.$route.query['winType'] || 0,
        date: JSON.stringify(this.$route.query['date']) || null,
        details : true
      }})
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
.header-right {
    position: absolute;
    right: 0.16rem;
    top: 0;
    font-size: 0.36rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;   
}
  .lower-report {
    .list {
      border-radius: 0.1rem;
      border: 0.02rem solid #E6F2FF;
      overflow: hidden;
      .item2{
        color: #E71414;
        font-size: 0.3rem;
        line-height: 0.42rem;
      }
      .item {
        background-color: #ffffff;
        min-height: 0.8rem;
        text-align: left;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        width: 100%;

        &:nth-child(2n) {
          background-color: rgba(44, 147, 255, 0.05);
        }

        .info-list {
          flex-shrink: 0;
          width: 100%;
          border-top: 0.02rem solid #D3E7FC;
          padding: 0.2rem 0.24rem;

          .info-item {
            border-bottom: 0.02rem solid #D3E7FC;
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            font-size: 0.28rem;
            line-height: 0.4rem;
            color: #444444;

            &:last-child {
              border-bottom: none;
            }

            .info-item-col {
              min-width: 1.46rem;
              .row {
                display: block;

                &:first-child {
                  margin-bottom: 0.08rem;
                }

                .item-vs {
                  color: #999999;
                  margin: 0 0.1rem;
                }
              }
            }
          }
        }

        .label {
          // padding-left: 0.24rem;
          width: 1.86rem;
          flex-shrink: 0;
          font-size: 0.28rem;
          color: #666666;
          height: 0.8rem;
          display: flex;
          justify-content: flex-end;
          margin-right:.22rem;
          align-items: center;
        }

        .value {
          font-size: 0.28rem;
          color: #111111;
        }
        .value2{
          width: 0.4rem;
          height: 0.4rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.24rem;
          border-radius: 50%;
          border: 0.02rem solid #A3A3A3;
          color: #A3A3A3;
          flex-shrink: 0;
        }
        .commission-value {
            font-size: 0.28rem;
            line-height: 0.42rem;
            margin-right: 0.1rem;
          }
          .less{
            color: #00A054;
          }

        .red {
          color: #E71414;
        }

        .green {
          color: #00A054;
        }

        .status-ball-0 {
          color: #FF9700;
          border-color: #FF9700;
        }

        .status-ball-1 {
          color: #E71414;
          border-color: #E71414;
        }

        .status-ball-2 {
          color: #00A054;
          border-color: #00A054;
        }

        .status-ball-3 {
          color: #722DF0;
          border-color: #722DF0;
        }

        .status-ball-4 {
          color: #A3A3A3;
          border-color: #A3A3A3;
        }

        .status-ball-5 {
          color: #A3A3A3;
          border-color: #A3A3A3;
        }
      }
    }
  }
  .black-view-box > ul > li{
    &:nth-child(odd) {
      background-color: #1D1D1D !important;
    }
    &:nth-child(even) {
      background-color: #292929 !important;
    }
    .info-item {
      color: #fff !important;
    }
    .label {
      color: #fff !important;
    }
    .value {
      color: #fff !important;
    }
    .red {
      color: #E71414 !important;
    }

    .green {
      color: #00A054 !important;
    }

    .status-ball-0 {
      color: #FF9700 !important;
    }

    .status-ball-1 {
      color: #E71414 !important;
    }

    .status-ball-2 {
      color: #00A054 !important;
    }

    .status-ball-3 {
      color: #722DF0 !important;
    }

    .status-ball-4 {
      color: #A3A3A3 !important;
    }

    .status-ball-5 {
      color: #A3A3A3 !important;
    }
  }
</style>
