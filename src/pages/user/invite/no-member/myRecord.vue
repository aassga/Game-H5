<template>
  <view-page class="view-page" full-box>
    <title-header slot="header" title="我的战绩">
    </title-header>
    <div :class="['content',{'blush-content':$config.blush}]"  slot="content" :style="{minHeight: contentHeight + 'px'}">
        <div class="top blush-yellow-bg-6">
          <h3 class="tit-money  blush-color-white">{{data['invite_gift_money_total'] ? data['invite_gift_money_total'] : '0.00'}}</h3>
          <div class="tit-text blush-color-yellow-6">邀请总奖励(元)</div>
          <div class="group-area">
            <div :class="['group-item',{active:tabIndex === 0}]" @click="changeTabIndex(0)">
              <div class="num ">{{data['invite_gift_money_count'] ? data['invite_gift_money_count'] : '0'}}</div>
              <div class="txt ">已获奖励(份)</div>
            </div>
            <div :class="['group-item',{active:tabIndex === 1}]"  @click="changeTabIndex(1)">
              <div class="num  ">{{data['friends_total'] ? data['friends_total'] : '0'}}</div>
              <div class="txt">邀请好友(人)</div>
            </div>
            <div :class="['group-item',{active:tabIndex === 2}]"  @click="changeTabIndex(2)">
              <div class="num ">{{data['invite_friends_count'] ? data['invite_friends_count'] : '0'}}</div>
              <div class="txt">有效好友(人)</div>
            </div>
          </div>
        </div>
        <div class="list" v-if="(this.list.constructor === Array && list.length) || (this.list.constructor === Object && JSON.stringify(list) !== '{}')">
          <ul class="row" v-if="tabIndex === 0 || tabIndex === 1">
            <li v-for="(item,i) in list" :key="i">
              <div class="txt1 ">
                <div class="left pull-left cont blush-color-white">{{item.content}}</div>
                <div class="right pull-right" v-if="tabIndex === 0">{{item.invite_gift_money}}</div>
              </div>
              <div class="txt2 ">
                <div class="left pull-left blush-color-gray-11">{{dayJs.unix(item.time).format('YYYY-MM-DD HH:mm')}}</div>
                <div class="right pull-right" v-if="tabIndex === 0">邀请{{item.gift_money_type}}-<span :class="{'unGet' : item.gift_status !== 'yes'}">{{item.gift_status === 'yes' ? '已领取' : '未领取'}}</span></div>
              </div>
            </li>
          </ul>
          <table v-else class="table">
            <thead>
              <tr>
                <th v-for="(item,i) in data['effective_friends_list']['rowList']" :key="i">{{item.rowName}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,i) in data['effective_friends_list']['rowData']" :key="i">
                <td v-for="(info,j) in data['effective_friends_list']['rowList']" :key="j">{{item[info['rowIndex']]}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="noList">
          <img style="width: 100%;" :src="noDataImg" />
          <p class="p1 blush-color-gray-10">暂无数据</p>
          <p class="p2 blush-color-gray-10">{{noListText}}</p>
        </div>
      </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "myRecord",
  data() {
    return {
      contentHeight: 0,
      data: {},
      list: [],
      tabIndex: 0,
      noListText: '暂无邀请奖励',
    };
  },
  created() {
    this.getData()
    this.contentHeight = this.$store.state.main.windowHeight - 1.04 * this.rem
  },
  methods: {
    getData() {
      let noInviteData = JSON.parse(sessionStorage.getItem('noInviteData'))
      if(noInviteData) {
        this.data = noInviteData
        this.changeTabIndex(this.tabIndex)
      }
      this.$store
      .dispatch("agency/getInvitation", {
        activityType: "memberInviteMemberToMyRecordV2"
      })
      .then(res => {
        if (res.code === 200) {
          this.data = res.data
          sessionStorage.setItem('noInviteData',JSON.stringify(res.data))
          this.changeTabIndex(this.tabIndex)
        }
      });
    },
    changeTabIndex(index) {
      this.tabIndex = index
      switch (index) {
        case 0:
          this.list = this.data['invite_gift_money_list']
          this.noListText = '暂无邀请奖励'
          break;
        case 1:
          this.list = this.data['invite_friends_list']
          this.noListText = '暂无邀请好友'
          break;
        case 2:
          this.list = this.data['effective_friends_list']
          this.noListText = '暂无有效好友'
          break;
      }
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
  }
};
</script>

<style lang="less" type='text/less' scoped>
.content {
  overflow: hidden;
  color: #333;
  font-size: 0.28rem;
  background-color: #F2F2F2;
  .top {
    width: 100%;
    height: 3rem;
    background: #fff;
    overflow: hidden;
    .tit-money {
      color: #FD6632;
      font-size: 0.45rem;
      margin-top: 0.27rem;
    }
    .tit-text {
      color: #969696;
      font-size: 0.24rem;
      margin: 0.06rem;
    }
    .group-area {
      overflow: hidden;
      width: 100%;
      margin-top: 0.16rem;
      .group-item {
        position: relative;
        float: left;
        width: 33.33%;
        text-align: center;
        height: 0.91rem;
        color: #333333;
        font-size: 0.28rem;
        &:not(:last-child) {
          &::after {
            content: '';
            display: block;
            position: absolute;
            right: 0;
            top: 0.05rem;
            height: 0.86rem;
            width: 0.02rem;
            background-color: #E6E6E6;
          }
        }
        &.active {
          color:#F3571D;
        }
        .txt {
          margin-top: 0.16rem;
        }
      }
    }
  }
  .list{
    overflow: hidden;
    .row {
      li {
        width: 100%;
        height: 1.28rem;
        padding: .26rem .32rem 0 .32rem;
        border-bottom: .01rem solid #F1F1F1;
        .txt1 {
          overflow:hidden;
          font-size: .26rem;
          color: #333;
          .cont {
            max-width: 5.5rem;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
        }
        .txt2 {
          color: #ADAFBB;
          font-size: .24rem;
          margin-top: .12rem;
          .unGet {
            color: #FD0D1B;
          }
        }
      }
    }
    .table {
      width: 7.04rem;
      border-spacing: 0;
      overflow: hidden;
      margin: 0.24rem auto 0.37rem;
      color: #333333;
      font-size: 0.24rem;
      table-layout: fixed;
      thead {
        border-left: 0.02rem solid #FDCAAE;
        border-top: 0.02rem solid #FDCAAE;
        th{
          background-color: #FFE9DD;
          height: 0.77rem;
          line-height: 0.77rem;
          border-right: 0.02rem solid #FDCAAE;
          border-bottom: 0.02rem solid#FDCAAE;
          width: 100%;
          word-break:keep-all;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
      }
      tbody {
        border-left: 0.02rem solid #FFE8DB;
        border-top: 0.02rem solid #FFE8DB;
        td{
          height: 0.77rem;
          line-height: 0.77rem;
          border-right: 0.02rem solid #FFE8DB;
          border-bottom: 0.02rem solid #FFE8DB;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .list, .noList {
    margin-top: 0.2rem;
    background-color: #fff;
    .p1 {
      font-size: 0.32rem;
      color: #646464;
      font-weight: bold;
    }
    .p2 {
      color: #646464;
      font-size: 0.24rem;
      margin-top: 0.04rem;
      padding-bottom: 0.5rem;
    }
  }
}
.blush-content{
  background-color: #520107;
  .group-item{
     color: #fff!important;
      &.active {
          color:#FBD67A!important;
        }
  }
  .noList{
     background-color: #6F0000;
  }
  .list{
    background-color: #640009;
   
    .row{

      li{
            border-bottom: 0.01rem solid #530107;
             .txt2 {
          .unGet {
            color: #00D008;
          }
        }
      }
    }
    .table{
      color:#fff;
      background-color: #6A030B;
      thead {
         border-left: 0.02rem solid #530107;
        border-top: 0.02rem solid #530107;
        th{
            background-color: #6A030B;
          border-right: 0.02rem solid #530107;
          border-bottom: 0.02rem solid #530107;
        }
    
      }
           tbody {
        border-left: 0.02rem solid #530107;
        border-top: 0.02rem solid #530107;
        td{
        
          border-right: 0.02rem solid #530107;
          border-bottom: 0.02rem solid #530107;
        }
      }
    }
  }
}
</style>