<template>
  <view-page class="agent-report theme-header-bg" full-box>
    <title-header title="代理报表" slot="header" class="theme-bg theme-main-bg theme-header-bottom" color="#ffffff" >
      <div class="header-right" slot="right" @click="showDateSelector=true" >
        <span>{{date&&date.name}}</span>
        <span class="date-icon icon iconfont h5-icon-qushi-moreup"></span>
      </div>
    </title-header>

    <!-- <div class="view-box" slot="content">
      <ul class="top theme-agent-rebate">
        <li class="top-item" v-for="index in 3" :key="index">
          <p class="value">{{info[index-1]&&info[index-1].value}}</p>
          <p class="name">{{info[index-1]&&info[index-1].name}}</p>
        </li>
      </ul>
      <ul class="content" v-if="infoData">
        <li class="content-item"  v-for="(item, i) in infoData.filter((o,i) => i > 2)" :key="i">
          <div v-if="personalMode=='mode_b'&& agencyType =='agency' && item.name !=='代理人数'">
            <p class="value" :class="{red:parseFloat(item.value)}">{{item.value}}</p>
            <p class="name">{{item.name}}</p>
          </div>
          <div v-else>
            <p class="value" :class="{red:parseFloat(item.value)}">{{item.value}}</p>
            <p class="name">{{item.name}}</p>
          </div>
        </li>
      </ul>
    </div> -->
    <div class="content-slot theme-header-bg" slot="header-static" v-if="isZs">
      <div class="theme-agent-tab header theme-yellow-bg-6">
        <ul class="header-main theme-color-black">
          <li class="item" @click="tabChange(0)" :class="{'theme-agent-tab-active':tabIndex===0}">
            <div class="bmg" :class="{'active theme-yellow-bg-2':tabIndex===0}">
              全部
            </div>
          </li>
          <li class="item" @click="tabChange(1)" :class="{'theme-agent-tab-active':tabIndex===1}">
            <div class="bmg" :class="{'active theme-yellow-bg-2':tabIndex===1}">
              直属
            </div>
          </li>
          <li class="item" @click="tabChange(2)" :class="{'theme-agent-tab-active':tabIndex===2}">
            <div class="bmg" :class="{'active theme-yellow-bg-2':tabIndex===2}">
              非直属
            </div>
          </li>
        </ul>
        <div class="bor-bot theme-bg theme-yellow-bg-2"></div>
        <div class="bor-bot theme-bg theme-yellow-bg-2"></div>
      </div>
    </div>
    <ul slot="content" class="content theme-main-bg-5" v-if="infoData">
      <li class="content-item theme-after-border-color"  v-for="(item, i) in infoData" :key="i">
        <div v-if="personalMode=='mode_b'&& agencyType =='agency' && item.name !=='代理人数'">
          <p class="value" :class="{red:parseFloat(item.value)}" v-if="['取款人数','存款人数','团队人数','代理人数','会员人数','首存人数','投注人数','注册人数','在线人数'].includes(item.name)">{{item.value}}</p>
          <p class="value" :class="{red:parseFloat(item.value)}" v-else>{{item.value.toFixed(2)}}</p>
          <p class="name theme-color-white">{{item.name}}</p>
        </div>
        <div v-else>
          <p class="value" :class="{red:parseFloat(item.value)}" v-if="['取款人数','存款人数','团队人数','代理人数','会员人数','首存人数','投注人数','注册人数','在线人数'].includes(item.name)">{{item.value}}</p>
          <p class="value" :class="{red:parseFloat(item.value)}" v-else>{{item.value.toFixed(2)}}</p>
          <p class="name theme-color-white">{{item.name}}</p>
        </div>
      </li>
    </ul>
    <div slot="static">
      <agency-date-selector :newQP="$config.blackTheme || $config.newQP" @okSelect="okSelect" v-model="date" @getDefaultIndex="getDefaultIndex" :default-index="defaultIndex || 0" :show.sync="showDateSelector"></agency-date-selector>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import AgencyDateSelector from "@src/components/agency-date-selector/AgencyDateSelector";

export default {
  name: "AgentReport",
  components: { AgencyDateSelector },
  data() {
    return {
      tabIndex: 0,
      date: null,
      defaultIndex:0,
      showDateSelector: false,
      info: []
    };
  },
  watch: {
    date() {
      
    },
    info(val){
      if(val){
        val = val.filter((obj)=>{
          return obj.name !== '会员人数'
        })
      }
    }
  },
  computed:{
    isZs(){
        if(this.personalMode === "mode_b"){
            return false;
        }else{
            return true;
        }
    },
    infoData(){
      if(this.personalMode == 'mode_a'){
        return this.info.filter((obj)=>{ return obj.name !=='会员人数'})
      }else if(this.personalMode == 'mode_b'){
        if(this.agencyType == 'agency'){
          return this.info.filter((obj)=>{ return obj.name !=='代理人数'})
        }else{
          return this.info
        }
      }
      else{
        return this.info
      }
    }
  },
  created() {
    if (localStorage.agencyReport) {
      try {
        this.info = JSON.parse(localStorage.agencyReport);
      } catch (e) {
        delete localStorage.agencyReport;
        this.info = {};
      }
    }
  },
  mounted(){
    setTimeout(()=>{
      this.initData();
    },100)
  },
  methods:{
    getDefaultIndex(index){
      
    },
    okSelect(date, index, zsType) {
      this.defaultIndex = index;
      this.date = date;
      this.initData();
    },
    initData(){
      if (this.date) {
        this.toastLoading('加载中');
        var data = {
          startTime: this.date.start,
          endTime: this.date.end,
          uid: this.userInfo.uid,
          type: this.tabIndex
        }
        this.$store
          .dispatch("agency/agencyReport", data)
          .then(res => {
            if (res.code === 200) {
              localStorage.agencyReport = JSON.stringify(res.data);
              this.info = res.data;
            }
          }).finally(()=>{
            this.toastClear();
          });
      }
    },
    tabChange(type){
      this.tabIndex = type;
      this.toastLoading('加载中');
      this.$store
          .dispatch("agency/agencyReport", {
            startTime: this.date.start,
            endTime: this.date.end,
            uid: this.userInfo.uid,
            type: type
          })
          .then(res => {
            if (res.code === 200) {
              localStorage.agencyReport = JSON.stringify(res.data);
              this.info = res.data;
            }
          }).finally(()=>{
            this.toastClear();
          });
    },
  }
};
</script>

<style lang="less" type='text/less' scoped>
.header-right {
  position: absolute;
  right: 0.16rem;
  top: 0;
  font-size: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .date-icon {
    font-size: 0.2rem;
    transform: scale(0.5) rotateZ(180deg);
  }
}

.agent-report {
  background-color: #F5F5F5;
  .auto-box-content{
    background-color: #F5F5F5;
  }
  // .view-box {
  //   overflow: hidden;
  //   padding: 0;
  // }

  // .name {
  //   font-size: 0.28rem;
  //   line-height: 0.4rem;
  //   margin-top: 0.04rem;
  // }

  // .value {
  //   font-size: 0.32rem;
  //   line-height: 0.45rem;

  //   &.red {
  //     color: #e71414;
  //   }
  // }

  // .top {
  //   height: 1.9rem;
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   padding: 0.48rem 0.2rem;
  //   color: #ffffff;
  //   text-align: center;

  //   .top-item {
  //     flex: 1;
  //   }
  // }
  .header{
        width: 7.18rem;
        margin: 0 auto;
        border-radius: 0.1rem;
      .header-main{
        height: 1.20rem;
        border-radius: 0.1rem;
        background-size: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #FFFFff;
        overflow: hidden;
        background-image: url("../../../assets/img/agent-center-new/dot.png");
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
      .item {
        width: 100%/3;
        height: inherit;

        .bmg {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 0.36rem;
          &.active {
            background: url("../../../assets/img/agent-center-new/report/report-header-bg-active1.png");
            background-size: 100%;
          }
        }

      }
    }
  .content {
    margin: 0.34rem 0.2rem 0 .2rem;
    color: #444444;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    box-shadow:0px 5px 5px 0px rgba(0,0,0,0.03);
    border-radius:10px;
    background-color: #FFFFff;
    .content-item {
      width: 33.333%;
      padding: 0.24rem 0;
      flex-shrink: 0;
      flex-basis: 33.333%;
      position: relative;
      // border-bottom: 0.02rem solid #f3f3f3;
      .value{
        font-size: 0.32rem;
        font-weight: normal !important;
        color: #E71414;
      }
      .name{
        font-size: 0.28rem;
        //font-weight: 500;
        color: #444444;
        margin-top: 0.08rem;
      }
      &::after{
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
    }
  }
}
</style>
