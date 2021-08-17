<template>
  <view-page  :class="['container',{'blush-container':$config.blush}]" ref="view-page" full-box>
    <div class="header" slot="header">
      <title-header
        class="title"
        style="background-color: rgba(0,0,0,0) !important;"
        backEvent
        @back="$router.push('/user')"
        title="邀请好友"
      >
        <div class="header-right" slot="right" @click="openKF">
          <img src="../../../../assets/img/user/jieBei/kefu.png" alt />
        </div>
      </title-header>
    </div>
    <div slot="static" class="aaa" :style="headerStyle"></div>
    <div  :class="['content-slot',{'blush-content-slot':$config.blush}]" slot="content">
      <div class="top-row1 blush-color-yellow-2">邀请总奖励</div>
      <router-link to="/user/no-invite/member/my-record" class="top-row2">
        <span class="num">{{data['invite_gift_money_total'] ? data['invite_gift_money_total'] : '0.00'}}</span>
        <van-icon name="arrow" class="arrow" />
      </router-link>
      <div class="top-row3">已邀请<span class="yellow-color">{{data['friends_total'] ? data['friends_total'] : '0'}}</span>人，有效<span class="yellow-color">{{data['invite_friends_count'] ? data['invite_friends_count'] : '0'}}</span>人</div>
      <div class="top-row4">邀请码：{{code['code'] ? code['code'] : '000000'}}</div>
      <div class="top-row5">
        <div class="row left-row blush-red-bg-1 "></div>
        <div class="row right-row blush-red-bg-1"></div>
        未领取奖励
      </div>
      <div class="panel" >
        <img class="get-btn" src="../../../../assets/img/invite/no-member/get-btn.png" alt="" @click="onGet">
        <div class="left-area area">
          <div class="top">
            <p class="tit blush-color-yellow-2">晋级礼金</p>
            <p class="num blush-color-white">{{data['level_money'] ? data['level_money'] : '0.00'}}</p>
          </div>
          <div class="bot">
            <p class="tit blush-color-yellow-2">分红</p>
            <p class="num blush-color-white">{{data['fenhong'] ? data['fenhong'] : '0.00'}}</p>
          </div>
        </div>
        <div class="right-area area">
          <div class="top">
            <p class="tit blush-color-yellow-2">周俸禄</p>
            <p class="num blush-color-white">{{data['week_money'] ? data['week_money'] : '0.00'}}</p>
          </div>
          <div class="bot">
            <p class="tit blush-color-yellow-2">月俸禄</p>
            <p class="num blush-color-white">{{data['month_money'] ? data['month_money'] : '0.00'}}</p>
          </div>
        </div>
      </div>
      <router-link to="/user/no-invite/member/award">
        <img src="../../../../assets/img/invite/no-member/award-bg.png" alt="" class="award">
      </router-link>
      <router-link to="/user/no-invite/member/share" class="share-btn  blush-color-yellow ">
        <img :src="imgUrl('share-icon')" alt="">
          分享邀请
      </router-link>
      <div class="copy-btn blush-color-yellow " @click="onCopy">
         <img :src=" imgUrl('copy-icon')" alt="">
        复制邀请链接
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "no-member",
  data() {
    return {
      data :{},
      code :{}
    };
  },
  created() {
    this.getData()
    this.getCode()
  },
  methods: {
     imgUrl(imgName) {
      return require(`@src/assets/img/invite/no-member/${this.$config.blush ? 'red-' + imgName : imgName}.png`)
    },
    getData() {
      let noInviteData = JSON.parse(sessionStorage.getItem('noInviteData'))
      if(noInviteData) this.data = noInviteData
      this.$store
      .dispatch("agency/getInvitation", {
        activityType: "memberInviteMemberToMyRecordV2"
      })
      .then(res => {
        if (res.code === 200) {
          this.data = res.data
          sessionStorage.setItem('noInviteData',JSON.stringify(res.data))
        }
      });
    },
    getCode() {
      let noInviteCode = JSON.parse(sessionStorage.getItem('noInviteCode'))
      if(noInviteCode) this.code = noInviteCode
      this.$store
      .dispatch("agency/getInvitation", {
        activityType: "getInvitation"
      })
      .then(res => {
        if (res.code === 200) {
          this.code = res.data
          sessionStorage.setItem('noInviteCode',JSON.stringify(res.data))
        }
      });
    },
    openKF() {
      const link = this.getKF();
      if (link) {
        window.tryOpen(link);
      } else {
        this.toastText("暂无客服", "middle");
      }
    },
    onCopy() {
      if (this.code.domain) {
        this.$copyText(this.code.domain).then(
          e => {
            this.toastText("复制成功", "top");
          },
          e => {
            this.toastText("请手动复制或使用其他浏览器尝试", "top");
          }
        );
      } else {
        this.toastText("无可复制内容", "top");
      }
    },
    onGet() {
      this.$store
      .dispatch("agency/getInvitation", {
        activityType: "inviteGift"
      })
      .then(res => {
        if (res.code === 200) {
          if(res.data.code === 200) {
            this.getData()
          }
          this.toastText(res.data.msg, "top");
        }
      });
    }
  },
  mounted() {},
  computed: {
    headerStyle() {
      return {
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        height: "6.86rem",
        zIndex: "-1",
        backgroundImage: `url(${require(`../../../../assets/img/invite/no-member/${this.$config.blush?'red-index-bg':'index-bg' }.png`)})`,
        backgroundSize: "100% 100%"
      };
      
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
.header-right {
  position: absolute;
  right: 0.38rem;
  top: 0.1rem;
  img {
    width: 0.448rem;
    height: 0.38rem;
  }
}
.content-slot {
  padding: 0;
  overflow: hidden;
  .top-row1 {
    color: #fff;
    font-size: 0.3rem;
    margin-top: 0.57rem;
  }
  .top-row2 {
    color: #fff;
    font-size: 0;
    margin-top: 0.04rem;
    .num {
      font-size: 0.65rem;
    }
    .arrow {
      font-size: 0.48rem;
      margin-left: 0.15rem;
      &:before {
        color: #fff !important;
      }
    }
  }
  .top-row3 {
    color: #fff;
    font-size: 0.34rem;
    margin-top: 0.1rem;
    .yellow-color {
      color: #FFC980;
    }
  }
  .top-row4 {
    width: 3.28rem;
    height: 0.68rem;
    line-height: 0.68rem;
    background:linear-gradient(180deg,rgba(255,218,204,1) 0%,rgba(255,255,255,1) 100%);
    box-shadow:0px 0.03rem 0.12rem rgba(0,0,0,0.16);
    border-radius: 0.42rem;
    color: #E42418;
    font-size: 0.32rem;
    margin: 0.29rem auto 0;
  }
  .top-row5 {
    position: relative;
    color: #FFD591;
    font-size: 0.3rem;
    margin-top: 0.39rem;
    .row {
      width: 2rem;
      height: 0.01rem;
      background: #fff;
      position: absolute;
      top: 49%;
      &.left-row {
        left: 0.47rem;
      }
      &.right-row {
        right: 0.47rem;
      }
    }
  }
  .panel {
    position: relative;
    width: 7.1rem;
    height: 2.67rem;
    box-shadow: 0 0.05rem 0.11rem rgba(0,63,112,0.06);
    border-radius: 0.15rem;
    margin: 0.4rem auto 0.22rem;
    background-color: #fff;
    padding: 0 0.48rem 0 0.44rem;
    .get-btn {
      position: absolute;
      left: 2.78rem;
      top: 0.45rem;
      width: 1.83rem;
      height: 1.83rem;
    }
    .area {
      width: 1.82rem;
      height: 100%;
      &.left-area {
        float: left;
      }
      &.right-area {
        float: right;
      }
      .top, .bot {
        overflow: hidden;
        .tit {
          color: #888888;
          font-size: 0.26rem;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        .num {
          color: #333333;
          font-size: 0.28rem;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
      }
      .top {
        height: 1.38rem;
        width: 100%;
        border-bottom: 0.01rem dashed rgba(112,112,112,0.2);
        .tit {
          margin-top: 0.36rem;
        }
        .num {
          margin-top: 0.1rem;
        }
      }
      .bot {
        height: 1.29rem;
        .tit {
          margin-top: 0.15rem;
        }
        .num {
          margin-top: 0.1rem;
        }
      }
    }
  }
  .award {
    width: 7rem;
    height: 1.89rem;
  }
  .share-btn, .copy-btn {
    width: 7rem;
    height: 0.98rem;
    line-height: 0.98rem;
    border-radius: 0.2rem;
    font-size: 0.38rem;
  }
  .share-btn {
    display: block;
    background: #FD454B;
    color: #fff;
    margin: 0.38rem auto 0.2rem;
    img {
      width: 0.35rem;
      height: 0.35rem;
    }
  }
  .copy-btn {
    background: #FFF;
    color: #FD454B;
    margin: 0 auto 0.5rem;
    img {
      width: 0.33rem;
      height: 0.38rem;
    }
  }
}
&.blush-content-slot{

.top-row4{
  
background: linear-gradient(180deg, #F1D99E 0%, #C6A759 100%);
color:#000;
}
.panel{
  
background: linear-gradient(180deg, #7E010C 0%, #72010B 100%);
}
.share-btn{
  // background: #FD454B;
  
background: linear-gradient(180deg, #9D010F 0%, #72010B 100%);
}
.copy-btn{
  background: none;
  
border: 1px solid #FFF392;
}
}
&.blush-container{
 background:#530107;

  }
 
</style>
