<template>
  <view-page class="agent-center-modec" full-box>
    <title-header
      slot="header"
      class="title"
      backEvent
      @back="$router.push('/user/agency-center-modec')"
      title="业绩查询"
    >
      <div class="header-right" slot="right" @click="showDateSelector=true">
        <span>{{date&&date.name}}</span>
        <span class="date-icon icon iconfont h5-icon-qushi-moreup"></span>
      </div>
    </title-header>
    
    <div slot="content" class="content">
      <div class="header theme-agent-rebate">
        <div class="header-bg">
          <div class="left-area">
            <div class="total">总业绩:<span v-if="perfoData.top && perfoData.top.total">{{perfoData.top.total  || "0.00"}}</span></div>
            <div class="direct">直推业绩:<span  v-if="perfoData.top && perfoData.top.self">{{perfoData.top.self  || "0.00"}}</span></div>
          </div>
          <div class="right-area">
            <router-link class="rebate theme-color" to="/user/agency-center-modec/performance/proportion">返佣比例</router-link>
            <div class="agency">代理业绩:<span v-if="perfoData.top && perfoData.top.agency">{{perfoData.top.agency || "0.00"}}</span></div>
          </div>
        </div>
        <div class="bor-bot theme-bg"></div>
        <div class="bor-bot theme-bg"></div>
      </div>
      <div class="view-cont">
        <div class="collapse">
          <ul v-if="perfoList.length > 0">
            <li
              v-for="(item,i) in perfoList"
              :key="i"
              :class="['perfo-item',item.showItem ? 'theme-agent-tab-opacity' : '']"
            >
              <div
                :class="['title',item.showItem ? 'down' : 'up']"
                @click="item.showItem = !item.showItem"
              >
                <span class="name">{{item.name}}</span>
                <span class="total">{{item.total}}</span>
                <img
                  :class="['img',item.showItem ? 'down' : 'up']"
                  src="@src/assets/img/agent-center-modec/desc/icon-more.png"
                />
              </div>
              <div :class="['cont',item.showItem ? 'down' : 'up']">
                <div class="cont-item">
                  <div class="text">最高返佣</div>
                  <div class="money">{{item.most || '0.00'}}</div>
                </div>
                <router-link :to="`/user/agency-center-modec/performanceDesc/${item.type}/under`" class="cont-item">
                  <div class="text">直推业绩</div>
                  <div class="money">
                    <span>{{item.self || '0.00'}}</span>
                    <img class="img" src="@src/assets/img/agent-center-modec/desc/icon-more.png" />
                  </div>
                </router-link>
                <router-link :to="`/user/agency-center-modec/performanceDesc/${item.type}/jump`"  class="cont-item">
                  <div class="text">代理业绩</div>
                  <div class="money">
                    <span>{{item.agency || '0.00'}}</span>
                    <img class="img" src="@src/assets/img/agent-center-modec/desc/icon-more.png" />
                  </div>
                </router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div slot="static">
      <agency-date-selector
        v-model="date"
        :dataIndex="4"
        :show.sync="showDateSelector"
      ></agency-date-selector>
    </div>
  </view-page>
</template>

<script>
import AgencyDateSelector from "@src/components/agency-date-selector/AgencyDateSelector";
export default {
  data() {
    return {
      perfoData: {},
      perfoNameObj: {
        chess: '棋牌业绩',
        live: '视讯业绩',
        slot: '电子业绩',
        lottery: '彩票业绩',
      },
      perfoList: [],
      date: null,
      showDateSelector: false,
    };
  },
  created(){
  },
  mounted () {
  },
  methods: {},
  components: {
    AgencyDateSelector
  },
  watch: {
    'date'(newVal) {
      this.$store.state.agentModec.PerformanceDate = newVal
      this.$store.dispatch('agentModec/agencyPerformanceLinesModeC',{
        startTime: this.date.start,
        endTime: this.date.end
      } ).then(res => {
        if (res && res.code === 200) {
          this.perfoData = res.data
          this.perfoList = []
          for (const key in this.perfoNameObj) {
            if(this.perfoNameObj[key]) {
              let item = this.perfoData[key]
              this.$set(item,'showItem',false)
              this.$set(item,'name',this.perfoNameObj[key])
              this.$set(item,'type',key)
              this.perfoList.push(item)
            }
          }
        } else {
          this.toastText(res.message, 'top')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
};
</script>

<style lang="less" scoped>
.header-right {
  position: absolute;
  right: 0.16rem;
  top: 0;
  font-size: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .date-icon{
    font-size: 0.2rem;
    transform: scale(0.5) rotateZ(180deg);
  }
}
.content {
  overflow: hidden;
  padding-bottom: 0.3rem;
  .header {
    position: relative;
    width: 7.18rem;
    margin: 0.24rem auto;
    height: 1.58rem;
    color: #ffffff;
    font-size: 0.3rem;
    border-radius: 0.1rem;
    text-align: left;
    .header-bg {
      position: relative;
      width: 100%;
      height: 100%;
      background-image: url("../../../assets/img/agent-center-modec/Performance/Performance-top.png");
      background-size: 100% 100%;
      padding: 0.18rem 0 0 0.24rem;
      .left-area {
        float: left;
        width: 3.5rem;
        .total {
          height: 0.56rem;
          line-height: 0.56rem;
          margin-bottom: 0.18rem;
        }
      }
      .right-area {
        float: left;
        .rebate {
          display: block;
          text-align: center;
          width: 1.6rem;
          height: 0.56rem;
          line-height: 0.56rem;
          background-color: #fff;
          border-radius: 0.28rem;
          margin-bottom: 0.18rem;
          font-size: 0.28rem;
        }
      }
    }
    .bor-bot {
      position: absolute;
      bottom: -0.1rem;
      height: 0.1rem;
      width: 7rem;
      left: 50%;
      margin-left: -3.5rem;
      border-radius: 0 0 1rem 1rem;
      opacity: 0.3;
      &:last-child {
        bottom: -0.2rem;
        width: 6.7rem;
        left: 45%;
        margin-left: -3rem;
        opacity: 0.1;
      }
    }
  }
  .view-cont {
    width: 7.18rem;
    margin: 0.44rem auto 0;
    border-radius: 0.1rem;
    overflow: hidden;
    background-color: #fff;
    .perfo-item {
      width: 100%;
      transition: all 0.15s linear;
      &:last-child {
        .title {
          border-bottom: none;
        }
      }
      .title {
        font-size: 0.3rem;
        height: 1.12rem;
        line-height: 1.12rem;
        color: #444;
        text-align: left;
        position: relative;
        margin: 0 0.24rem;
        border-bottom: 0.01rem solid #cecece;
        .name {
          font-weight: bold;
          margin-right: 0.8rem;
        }
        .img {
          position: absolute;
          top: 50%;
          margin-top: -0.12rem;
          right: 0;
          width: 0.13rem;
          height: 0.24rem;
          transition: all 0.15s linear;
          &.up {
            transform: rotateZ(0deg);
          }
          &.down {
            transform: rotateZ(90deg);
          }
        }
        &.down {
          border-bottom: 0.01rem solid #cecece;
          .total {
            color: #e71414;
          }
        }
      }
      .cont {
        margin: 0 0.24rem;
        height: 0px;
        transition: all 0.2s linear;
        display: flex;
        overflow: hidden;
        &.up {
          height: 0px;
        }
        &.down {
          height: 1.44rem;
        }
        .cont-item {
          flex: 1;
          font-size: 0.28rem;
          border-right: 0.01rem solid #e7e7e7;
          margin: 0.32rem 0;
          &:last-child {
            border-right: none;
          }
          .text {
            color: #666666;
          }
          .money {
            color: #e71414;
            margin-top: 0.16rem;
            img {
              width: 0.12rem;
              height: 0.23rem;
              margin-left: 0.08rem;
            }
          }
        }
      }
    }
  }
}
</style>