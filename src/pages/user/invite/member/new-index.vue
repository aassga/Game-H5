<template>
  <div :class="['container',{'black-container' : $config.blackTheme}]">
    <img :src="imgUrl('member-top-img1')" class="member-top-img1">
    <img :src="imgUrl('member-top-img2')" class="member-top-img2">
    <div class="lottertList theme-main-bg-5">
      <div class="marquee">
        <vux-marquee style="height:.54rem" class="marquee-scroll">
          <vux-marquee-item v-for="item in marqueeList" :key="item" class="align-middle theme-color-yellow-2">{{item}}</vux-marquee-item>
        </vux-marquee>
      </div>
      <p class="text1 theme-color-yellow-2">尊享每个好友金管家晋级礼金</p>
      <img :src="imgUrl('invite-group')" class="group-img">
      <p class="text2 ">好友越多 等级越高 您赚越多</p>
      <p class="text3">奖励无上限  开启璀璨人生</p>
      <p class="invitaText theme-color-white">您的邀请码</p>
      <p
        class="invitaCode theme-color-yellow-2"
        v-if="$store.state.agency.intiviData"
      >{{$store.state.agency.intiviData.code}}</p>
    </div>
    <router-link to="/user/invite-share/member" class="shareInvita btn">
      <img :src="imgUrl('shareInvita-btn')" class="img" />
    </router-link>
    <div class="copyLink btn" @click="onCopy">
      <img :src="imgUrl('copyLink-btn')" class="img" />
    </div>
    <div class="activityArea theme-main-bg-5">
      <!-- <div class="activity-nav">
        <div class="item-box" v-for="(item,i) in classList" :key="i" :class="{active: activeId === item.id}" @click="changeNav(item.id)">
          <div class="nav-item">{{item.class_name}}</div>
        </div>
      </div> -->
      <table class="activity-nav">
        <thead>
            <tr>
              <th class="item-box theme-color-white" colspan="1" v-for="(item,i) in classList" :key="i" :class="{'active theme-color-yellow-2': activeId === item.id}" @click="changeNav(item.id)">
                <div :class="['nav-item',{'theme-after-bg-yellow' : activeId === item.id}]">{{item.class_name}}</div>
              </th>
            </tr>
          </thead>
      </table>
      <div class="activityInfo">
        <table class="table theme-border-color">
          <thead>
            <tr>
              <th class="theme-main-bg-9 theme-color-white theme-border-color" colspan="2">好友等级</th>
              <th class="theme-main-bg-9 theme-color-white theme-border-color" colspan="3">邀请者门槛奖励</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="theme-main-bg-5 theme-border-color theme-color-yellow-2">等级</td>
              <td class="theme-main-bg-5 theme-border-color theme-color-yellow-2">累计打码</td>
              <td class="theme-main-bg-5 theme-border-color theme-color-yellow-2">存款金额</td>
              <td class="theme-main-bg-5 theme-border-color theme-color-yellow-2">打码量</td>
              <td class="theme-main-bg-5 theme-border-color theme-color-yellow-2">礼金</td>
            </tr>
            <tr v-for="(item,i) in classConfigList" :key="i">
              <td class="theme-main-bg-5 theme-border-color theme-color-white">{{item.level}}</td>
              <td class="theme-main-bg-5 theme-border-color theme-color-white">{{item.betAmount}}</td>
              <td class="theme-main-bg-5 theme-border-color theme-color-white">{{item.payMoney}}</td>
              <td class="theme-main-bg-5 theme-border-color theme-color-white">{{item.betMultiple}}</td>
              <td class="theme-main-bg-5 theme-border-color theme-color-white">{{item.giftAmount}}</td>
            </tr>
          </tbody>
        </table>
        <p class="activityText activityText1">
          <img :src="imgUrl('symbolIcon')" />根据好友的金管家等级存款打码要求进行奖励发放
        </p>
        <p class="activityText activityText1">
          <img :src="imgUrl('symbolIcon')" />每一游戏类型，每一等级均可发放一次
        </p>
        <router-link to="/user/invite/member/share-reward">
          <img :src="imgUrl('look-more')" class="look-more">
        </router-link>
      </div>
    </div>
    <div class="titleArea theme-color-yellow-2">
      <img :src="imgUrl('agencyTitleIcon')" alt />
      简单三步&nbsp;&nbsp;立得奖励
      <img :src="imgUrl('agencyTitleIcon')" alt />
    </div>
    <div class="threeStep">
      <img :src="imgUrl('member-threeStep')">
    </div>
    <div class="titleArea myRecord theme-color-yellow-2">
      <img :src="imgUrl('agencyTitleIcon')" alt />
      我的战绩
      <img :src="imgUrl('agencyTitleIcon')" alt />
    </div>
    <div class="myRecordArea theme-main-bg-5">
      <div class="pull-left">
        <img :src="imgUrl('member-money')" alt="">
        <div class="money-area">
          <p class="money-info theme-color-yellow-2">
            {{myRecord.invite_gift_money_total}}
          </p>
          <p class="money-txt theme-color-white">
            邀请总奖励（元）
          </p>
        </div>
      </div>
      <div class="pull-right">
        <img src="@src/assets/img/invite/member-avater.png" alt="">
        <div class="user-area">
          <p class="user-num theme-color-yellow-2">{{myRecord.invite_friends_count}}</p>
          <p class="user-txt theme-color-white">邀请好友（人）</p>
        </div>
      </div>
    </div>
    <router-link to="/user/invite/member/my-record">
      <img :src="imgUrl('member-bottomBtn')" class="bottomBtn" alt="查看详情">
    </router-link>
  </div>
</template>

<script>
export default {
  props: {},
  name: "agency",
  data() {
    return {
      marqueeList: [
        "超过1,000,00+人成为代理",
        "好友越多  晋升代理机率越大",
        "晋升代理享下级返佣  好友礼金",
        "佣金实时到账",
        "业界赔率最高",
      ],
      classList:[],
      classConfigList: [],
      activeId: 0,
      myRecord:{},
    };
  },
  methods: {
    imgUrl(imgName) {
      return require(`@src/assets/img/invite/${this.$config.blackTheme ? 'black-' + imgName : imgName}.png`)
    },
    onCopy() {
      if (this.$store.state.agency.intiviData) {
        this.$copyText(this.$store.state.agency.intiviData.domain).then(
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
    openKF() {
      const link = this.getKF();
      if (link) {
        window.tryOpen(link);
      } else {
        this.toastText("暂无客服", "middle");
      }
    },
    changeNav(id) {
      this.activeId = id 
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
    },
    getClassList() {
      let classListSess = JSON.parse(sessionStorage.getItem('classList'))
      if(classListSess) {
        this.classList = classListSess
        if(this.classList.length) {
          this.activeId = this.classList[0].id
        }
      }
      this.$store
        .dispatch("agency/getInvitation", {
          activityType: "XinJinGuanJiaClass"
        })
        .then(res => {
          if (res.code === 200) {
            this.classList = res.data
            sessionStorage.setItem('classList',JSON.stringify(this.classList))
            if(this.classList.length) {
              this.activeId = this.classList[0].id
            }
          }
        });
    },
    getClassConfig(id) {
      this.$store
        .dispatch("agency/getInvitation", {
          activityType: "XinJinGuanJiaConfig",
          classId: id,
        })
        .then(res => {
          if (res.code === 200) {
            this.classConfigList = res.data
            if(this.classConfigList.length > 5) {
              this.classConfigList = this.classConfigList.splice(0,5)
            }
          }
        });
    }
  },
  created() {
    this.getMyRecord()
    this.getClassList()
  },
  watch: {
    activeId(id) {
      this.getClassConfig(id)
    }
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  max-height: 31.19rem;
  background-image: url("../../../../assets/img/invite/AgencyBg.jpg");
  background-size: cover;
  overflow: hidden;
  font-size: 0.32rem;
  .member-top-img1 {
    width: 6.15rem;
    height: .99rem;
    margin: 1.65rem auto .04rem;
  }
  .member-top-img2 {
    width: 3.94rem;
    height: .58rem;
  }
  .lottertList {
    position: relative;
    margin: .47rem auto 0;
    width: 6.86rem;
    height: 6.14rem;
    background-color: #fff;
    border-radius: 0.15rem;
    color: #555555;
    text-align: center;
    box-shadow:0px .18rem .34rem .04rem rgba(255,0,0,0.63);
    border: .01rem solid transparent;
    .marquee {
      position: absolute;
      top: -.38rem;
      left: 50%;
      transform: translateX(-50%);
      width: 4.5rem;
      height: 0.76rem;
      line-height: 0.76rem;
      background-image: url("../../../../assets/img/invite/shape-dongtai-red.png");
      background-size: contain;
      text-align: center;
      color: #fc1a1a;
      font-size: 0.28rem;
      z-index: 2;
      .marquee-scroll {
        margin-top: .06rem;
        .align-middle {
          height: 0.54rem;
          line-height: .54rem;
          width: 100%;
          overflow: hidden;
        }
      }
    }
    .group-img {
      width: 3.94rem;
      height: 2.58rem;
      margin: .15rem auto .2rem;
    }
    .text1 {
      margin-top: .38rem;
      font-size: .46rem;
      color: #FE2D1E;
    }
    .text2 {
      font-size: .3rem;
      color: #A1A1A1;
    }
    .text3 {
      margin-top: .05rem;
      font-size: .38rem;
      font-weight: bold;
      background:linear-gradient(90deg,rgba(255,175,0,1) 0%, rgba(254,48,34,1) 100%);
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
    }
    .invitaText {
      position: absolute;
      bottom: 0.23rem;
      left: 1.48rem;
      color: #555555;
      font-size: 0.32rem;
      height: .678rem;
      line-height: .678rem;
    }
    .invitaCode {
      position: absolute;
      bottom: 0.23rem;
      left: 3.3rem;
      font-size: 0.56rem;
      font-weight: bold;
      color: #EA6834;
      letter-spacing: .02rem;
      height: .678rem;
      line-height: .678rem;
    }
  }
  .btn {
    display: block;
    width: 6.88rem;
    height: 1.02rem;
    line-height: 1.02rem;
    color: #c4561e;
    font-size: 0.36rem;
    font-weight: bold;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
    }
    &.shareInvita {
      margin-top: 0.5rem;
    }
    &.copyLink {
      margin-top: 0.2rem;
    }
  }
  .titleArea {
    width: 100%;
    height: 0.7rem;
    line-height: 0.7rem;
    margin-top: 0.5rem;
    margin-bottom: 0.1rem;
    color: #fff;
    text-align: center;
    font-size: 0.36rem;
    img {
      width: 0.36rem;
      height: 0.27rem;
      vertical-align: middle;
    }
    &.myRecord {
      margin-top: .1rem;
    }
  }
  .activityArea {
    width: 7.18rem;
    max-height: 9.1rem;
    border-radius: 0.15rem;
    background-color: #fff;
    text-align: center;
    overflow: hidden;
    padding: 0 0.17rem;
    margin: .57rem auto 0;
    .activity-nav {
      width: 100%;
      color: #EA6834;
      margin: .25rem auto .13rem;
      overflow: hidden;
      .item-box {
        position: relative;
        overflow: hidden;
        color: #EA6834;
        font-size: 0.32rem;
        font-weight: bold;
        padding-bottom: 0.12rem;
        &.active {
          color: #555555;
          .nav-item {
            &::after {
              display:block;
              content:'';
              position: absolute;
              bottom: 0;
              left: 0;
              height: 0.06rem;
              width: 100%;
              background-color: #FFD9B8;
              border-radius: 0.03rem;
            }
          }
        }
        .nav-item {
          padding: 0 0.2rem;
        }
      }
    }
    .activityInfo {
      font-size: 0.28rem;
      .table {
        width: 100%;
        border: 1px solid rgba(255, 220, 189, 1);
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 0.15rem;
        overflow: hidden;
        color: #555;
        thead {
          th {
            height: 0.72rem;
            line-height: 0.72rem;
            background-color: rgba(255, 240, 229, 1);
            border-right: 1px solid rgba(255, 220, 189, 1);
            border-bottom: 1px solid rgba(255, 220, 189, 1);
            &:last-child {
              border-right: none;
            }
          }
        }
        tbody {
          tr {
            td {
              height: 0.72rem;
              line-height: 0.72rem;
              background: #fff9f3;
              border-right: 1px solid rgba(255, 220, 189, 1);
              border-bottom: 1px solid rgba(255, 220, 189, 1);
              &:first-child {
                padding: 0 .13rem;
              }
              &:last-child {
                border-right: none;
              }
            }
            &:last-child {
              td {
                border-bottom: none;
              }
            }
          }
        }
      }
      .activityText {
        color: #888888;
        font-size: 0.28rem;
        text-align: left;
        padding-left: .08rem;
        img {
          width: 0.18rem;
          width: 0.19rem;
        }
        &.activityText1 {
          margin: .2rem auto .3rem;
        }
      }
      .look-more{
        width: 100%;
        height: 1.02rem;
        margin-bottom: .27rem;
      }
    }
  }
  .threeStep {
    width: 100%;
    height: 2.55rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .myRecordArea {
    position: relative;
    width: 7.18rem;
    height: 2.27rem;
    border-radius: .15rem;
    box-shadow:0px .12rem .24rem 0 rgba(255,58,0,0.33);
    background-color: #fff;
    margin: 0 auto;
    padding: .58rem 0;
    overflow: hidden;
    & > div {
      width: 50%;
      height: 100%;
      float: left;
      height: 1.11rem;
    }
    .pull-left {
      position: relative;
      border-right: 0.01rem solid #FFDCBD;
      img {
        position: absolute;
        bottom: .14rem;
        left: 0.17rem;
        width: 1.05rem;
        height: .57rem;
      }
      .money-area{
        padding-left: 1.09rem;
        .money-info {
          color: #EA6834;
          font-size: .4rem;
          font-weight: bold;
          padding-top: .07rem;
        }
        .money-txt {
          padding-top: .14rem;
          color: #555555;
          font-size: .24rem;
        }
      }
    }
    .pull-right {
      text-align: left;
      overflow: hidden;
      img {
        float: left;
        width: .85rem;
        height: .94rem;
        margin-left: .37rem;
        margin-top: .08rem;
      }
      .user-area {
        padding-left: 1.47rem;
        text-align: center;
        .user-num{
          color: #EA6834;
          font-size: .4rem;
          font-weight: bold;
          padding-top: .07rem;
        }
        .user-txt{
          padding-top: .14rem;
          color: #555555;
          font-size: .28rem;
        }
      }
    }
  }
  .bottomBtn {
    display: block;
    width: 3.11rem;
    height: .86rem;
    margin: .39rem auto;
  }
  &.black-container {
    background-image: url("../../../../assets/img/invite/black-AgencyBg.jpg");
    .lottertList, .myRecordArea {
      box-shadow: none;
    }
    .marquee {
      background-image: url("../../../../assets/img/invite/black-shape-dongtai-red.png");
    }
    .text3 { 
      background: linear-gradient(0deg, #B58B24 0%, #EFD69A 100%);
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
    }
  }
}
</style>