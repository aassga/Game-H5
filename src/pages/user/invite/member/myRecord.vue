<template>
  <view-page class="view-page theme-header-bg" full-box>
    <title-header slot="header" title="我的战绩" class="theme-main-bg theme-header-bottom">
    </title-header>
    <div class="content theme-header-bg" slot="content">
      <div class="container theme-main-bg-5" :style="{minHeight: contentHeight + 'px'}">
        <div class="tit theme-color-white">邀请总奖励(元)</div>
        <h3 class="tit-money theme-color-yellow-2">{{myRecord.invite_gift_money_total}}</h3>
        <div class="click-area theme-main-bg-10">
          <div class="pull-left theme-border-color-2" :class="[{'active theme-color-yellow-2': activeIndex === 0},{'theme-color-white':activeIndex !== 0}]" @click="navHandle(0)">
            <img :src="imgUrl('click-area-1')" alt="">
            <div class="Details">
              <p class="num">{{myRecord.invite_gift_money_count}}</p>
              <p class="txt">已获奖励(份)</p>
            </div>
          </div>
          <div class="pull-right" :class="[{'active theme-color-yellow-2': activeIndex === 1},{'theme-color-white':activeIndex !== 1}]" @click="navHandle(1)">
            <img :src="imgUrl('member-avater')">
            <div class="Details">
              <p class="num">{{myRecord.invite_friends_count}}</p>
              <p class="txt">邀请好友（人）</p>
            </div>
          </div>
        </div>
        <div class="list" v-if="list.length">
          <ul>
            <li v-for="(item,i) in list" :key="i" class="theme-border-color">
              <div class="left pull-left">
                <div class="txt1 theme-color-white">{{item.content}}</div>
                <div class="txt2 theme-color-gray">{{dayJs.unix(item.time).format('YYYY-MM-DD HH:mm')}}</div>
              </div>
              <div class="right pull-right" v-if="activeIndex === 0">
                <div class="txt1 theme-color-white">{{item.invite_gift_money}}</div>
                <div class="txt2 theme-color-gray">{{item.msg}}</div>
              </div>
            </li>
          </ul>
        </div>
        <div v-else class="noMore">
          <img style="width: 100%;" :src="noDataImg" />
          <p class="theme-color-white" style="font-size: 0.3rem;color: #666666">{{activeIndex === 0 ? '暂无邀请奖励' : '暂无邀请好友'}}</p>
        </div>
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
      activeIndex: 0,
      myRecord:{},
      list:[],
    };
  },
  created() {
    this.contentHeight = this.$store.state.main.windowHeight - 1.04 * this.rem
    this.getMyRecord()
  },
  methods: {
    imgUrl(imgName) {
      return require(`@src/assets/img/invite/${this.$config.blackTheme ? 'black-' + imgName : imgName}.png`)
    },
    navHandle(i) {
      this.activeIndex = i 
      if(i === 0) {
        this.list = this.myRecord.invite_gift_money_list
      }else if(i === 1) {
        this.list = this.myRecord.invite_friends_list
      }
    },
    getMyRecord() {
      let myRecordSess = JSON.parse(sessionStorage.getItem('myRecord'))
      if(myRecordSess) {
        this.myRecord = myRecordSess
      }
      this.$store
        .dispatch("agency/getInvitation", {
          activityType: "memberInviteMemberToMyRecord"
        })
        .then(res => {
          if (res.code === 200) {
            this.myRecord = res.data
            sessionStorage.setItem('myRecord',JSON.stringify(res.data))
          }
        });
      this.$nextTick(()=>{
        this.navHandle(0)
      })
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
  padding-top: 0.16rem;
  overflow: hidden;
  color: #333;
  font-size: 0.28rem;
  background-color: #F2F2F2;
  .container {
    background-color: #fff;
    width: 100%;
    height: 100%;
    .tit {
      font-size: .32rem;
      color: #909090;
      padding-top: .52rem;
    }
    .tit-money {
      font-size: .85rem;
      color :#EA6834;
      font-weight: bold;
      margin-top: .1rem;
    }
    .click-area {
      width: 7.18rem;
      height: 1.88rem;
      border-radius: .15rem;
      background-color: #FFF9F4;
      padding: .38rem 0;
      overflow: hidden;
      margin: .45rem auto .4rem;
      .pull-left, .pull-right {
        width: 50%;
        height: 100%;
        overflow: hidden;
        padding-top: .08rem;
        color: #555;
        &.active {
          color: #EA6834;
        }
        img {
          float: left;
          width: .86rem;
          height: .94rem;
        }
        .Details {
          float: left;
          .num {
            font-size: .5rem;
            font-weight: bold;
          }
          .txt {
            font-size: .28rem;
          }
        }
        &.pull-left {
          border-right: 0.01rem solid #FFDCBD;
          img {
            margin-left: .7rem;
          }
          .Details {
            margin-left: .14rem;
          }
        }
        &.pull-right {
          img {
            margin-left: .37rem;
          }
          .Details {
            margin-left: .24rem;
          }
        }
      }
    }
    .list{
      li {
        width: 100%;
        height: 1.28rem;
        padding: .31rem .32rem 0 .32rem;
        border-bottom: .01rem solid #F1F1F1;
        .left,.right {
          .txt1 {
            font-size: .26rem;
            color: #444444;
          }
          .txt2 {
            color: #A1A1A1;
            font-size: .24rem;
            margin-top: .12rem;
          }
        }
        .left {
          text-align: left;
        }
        .right {
          text-align: center;
        }
      }
    }
  }
}
</style>