<template>
  <view-page class="view-page theme-header-bg" full-box>
    <title-header slot="header" title="奖励明细" class="theme-main-bg theme-header-bottom">
      <span class="header-right" slot="right" @click="openKF">联系客服</span>
    </title-header>
    <div class="content theme-header-bg" slot="content">
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
                <td class="theme-main-bg-5 theme-border-color theme-color-yellow-2" style="width: 0.85rem">等级</td>
                <td class="theme-main-bg-5 theme-border-color theme-color-yellow-2" style="width: 1.65rem">累计打码</td>
                <td class="theme-main-bg-5 theme-border-color theme-color-yellow-2" style="width: 1.25rem">存款金额</td>
                <td class="theme-main-bg-5 theme-border-color theme-color-yellow-2" style="width: 1.35rem">打码量</td>
                <td class="theme-main-bg-5 theme-border-color theme-color-yellow-2" style="width: 1rem">礼金</td>
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
        </div>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "shareReward",
  data() {
    return {
      contentHeight: 0,
      classList: [],
      classConfigList: [],
      activeId: 0
    };
  },
  created() {
    this.contentHeight = this.$store.state.main.windowHeight - 0.88 * this.rem;
    this.getClassList()
  },
  watch: {
    activeId(id) {
      this.getClassConfig(id)
    }
  },
  methods: {
    openKF() {
      this.inService();
    },
    changeNav(id) {
      this.activeId = id;
    },
    getClassList() {
      let classListSess = JSON.parse(sessionStorage.getItem('classList'))
      if(classListSess.length) {
        this.classList = classListSess
        this.activeId = this.classList[0].id
      }
      this.$store
        .dispatch("agency/getInvitation", {
          activityType: "XinJinGuanJiaClass"
        })
        .then(res => {
          if (res.code === 200 && res.data.length) {
            this.classList = res.data
            sessionStorage.setItem('classList',JSON.stringify(this.classList))
            this.activeId = this.classList[0].id
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
          }
        });
    }
  },
  computed: {}
};
</script>

<style lang="less" type='text/less' scoped>
.header-right {
  position: absolute;
  right: 0.24rem;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.32rem;
}
.content {
  background-color: #fff;
  padding: 0 0 0.59rem;
  overflow: hidden;
  color: #333;
  font-size: 0.28rem;
  margin-top: 0.25rem;
  .activityArea {
    width: 7.18rem;
    border-radius: 0.15rem;
    background-color: #fff;
    text-align: center;
    overflow: hidden;
    padding: 0 0.17rem;
    margin: 0 auto;
    .activity-nav {
      width: 100%;
      color: #ea6834;
      margin: 0.25rem auto 0.13rem;
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
      //padding-bottom: 0.48rem;
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
            //max-width:50%;
            //overflow: hidden;
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
              //max-width:25%;
              overflow: hidden;
              height: 0.72rem;
              line-height: 0.72rem;
              background: #fff9f3;
              border-right: 1px solid rgba(255, 220, 189, 1);
              border-bottom: 1px solid rgba(255, 220, 189, 1);
              //padding: 0 0.13rem;
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
        img {
          width: 0.18rem;
          width: 0.19rem;
        }
        &.activityText1 {
          margin: 0.28rem auto 0.36rem;
        }
      }
      .look-more {
        width: 100%;
        height: 1.02rem;
      }
    }
  }
  .noMore {
    margin-top: 1.5rem;
  }
}
</style>