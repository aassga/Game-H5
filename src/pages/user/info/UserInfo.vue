<template>
  <view-page
    :class="[
      'info',
      {
        'qp-box':
          ($config.home === 'qp' || $config.blackTheme) &&
          $config.name !== 'betnew',
      },
      { 'aqvns-box': $config.isAqvns },
      { 'blush-box': $config.blush },
    ]"
    full-box
  >
    <title-header
      title="个人资料"
      slot="header"
      class="theme-header-bg theme-header-bottom"
    ></title-header>
    <div
      class="content-slot"
      :class="[
        { 'theme-header-bg': $config.blackTheme },
        { 'theme-main-bg': $config.blush },

      ]"
      slot="content"
    >
      <van-cell-group>
        <van-cell is-link @click="showAvatars = true" class="theme-main-bg-1">
          <img class="avatar" slot="title" :src="avatar" alt="头像" />
          <span class="desc">修改用户头像</span>
        </van-cell>
        <van-cell is-link @click="checkName" class="no-link theme-main-bg-1">
          <span class="title" slot="title">真实姓名</span>
          <span class="desc">{{
            info && info["realName"] ? info["realName"] : "暂无设置"
          }}</span>
        </van-cell>
        <van-cell is-link class="no-link theme-main-bg-1">
          <span class="title" slot="title">帐户名称</span>
          <span class="desc">{{
            info && info["userName"] ? info["userName"] : "暂无设置"
          }}</span>
        </van-cell>
      </van-cell-group>
      <van-cell-group>
        <van-cell is-link to="/user/edit/safety/zj" class="theme-main-bg-1">
          <span class="title" slot="title">资金密码</span>
          <span class="desc">{{
            info && info["payPassword"] !== "unset" ? "已设置" : "暂无设置"
          }}</span>
        </van-cell>
        <van-cell is-link to="/user/edit/phone" class="theme-main-bg-1">
          <span class="title" slot="title">手机号码</span>
          <span class="desc">{{
            info && info["phone"] ? "已设置" : "暂无设置"
          }}</span>
        </van-cell>
        <van-cell
          is-link
          :to="
            info && info['cardNum'] !== 'unset'
              ? '/user/cardedit?tabIndex=0&user=1'
              : '/take?index=2'
          "
          class="theme-main-bg-1"
        >
          <span class="title" slot="title">银行信息</span>
          <span class="desc">{{
            info && info["cardNum"] !== "unset" ? "已设置" : "暂无设置"
          }}</span>
        </van-cell>
        <van-cell is-link to="/user/edit/email" class="theme-main-bg-1">
          <span class="title" slot="title">邮箱帐号</span>
          <span class="desc">{{
            info && info["email"] ? "已设置" : "暂无设置"
          }}</span>
        </van-cell>
        <van-cell is-link to="/user/edit/wechat" class="theme-main-bg-1">
          <span class="title" slot="title">微信帐号</span>
          <span class="desc">{{
            info && info["wechat"] ? "已设置" : "暂无设置"
          }}</span>
        </van-cell>
      </van-cell-group>
      <div style="padding: 0.3rem">
        <van-button
          block
          class="no-radius theme-color-black"
          :class="[
            { 'theme-yellow-bg': $config.blackTheme || $config.newQP },
            { 'theme-gradient-bg-3 theme-color-yellow': $config.blush },
          ]"
          type="primary"
          @click.native="onLogout"
          >安全退出</van-button
        >
      </div>

      <van-popup
        v-model="showAvatars"
        position="bottom"
        get-container="body"
        :class="[
          {
            'newqp-showAvatars':
              $config.newQP || $config.blackTheme || $config.blush,
          },
          { 'aqvns-showAvatars': $config.isAqvns },
          'theme-gradient-bg',
        ]"
      >
        <van-swipe style="background-color: #ffffff" :loop="false">
          <van-swipe-item
            v-for="i in Math.ceil($store.state.user.avatars.length / 8)"
            :key="'p_' + i"
          >
            <div class="avatar-list">
              <div
                :class="{
                  avatar: true,
                  active: (i - 1) * 8 + j - 1 === avatarIndex,
                }"
                v-for="j in 8"
                :key="'a_' + i + '_' + j"
                @click="avatarIndex = (i - 1) * 8 + j - 1"
              >
                <img
                  class="img"
                  :src="avatars[$store.state.user.avatars[(i - 1) * 8 + j - 1]]"
                  alt=""
                />
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>

        <div
          class="footer"
          style="padding: 0 2.5vw 5vw 2.5vw; background-color: #ffffff"
        >
          <van-button
            block
            class="no-radius theme-yellow-bg theme-color-black"
            type="primary"
            @click.native="changeAvatar"
            >确认</van-button
          >
        </div>
      </van-popup>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "UserInfo",
  data() {
    return {
      showAvatars: false,
      avatarIndex: -1,
      avatars: {},
    };
  },
  computed: {
    info() {
      return this.$store.state.user.userInfo;
    },
    avatar() {
      if (this.info && this.info["pic"]) {
        return this.avatars[this.info["pic"]];
      } else {
        return this.avatars.default;
      }
    },
  },
  created() {
    this.avatars.default = require("../../../assets/img/user/proimt/default.png");
    this.$store.state.user.avatars.forEach((name) => {
      this.avatars[name] = require("../../../assets/img/user/proimt/" + name);
    });
  },
  mounted() {
    if (this.info) {
      this.avatarIndex = this.$store.state.user.avatars.indexOf(
        this.info["pic"]
      );
    } else {
      this.goNewLogin();
    }
  },
  methods: {
    checkName() {
      if (!this.info["realName"]) {
        this.$router.push("/take?index=2");
      }
    },
    changeAvatar() {
      if (
        this.avatarIndex !==
        this.$store.state.user.avatars.indexOf(this.info["pic"])
      ) {
        const avatarName = this.$store.state.user.avatars[this.avatarIndex];
        if (avatarName) {
          this.$store
            .dispatch("user/changeAvatar", { avatarName })
            .then((res) => {
              if (res.code === 200) {
                this.toastText("修改成功", "top");
                this.$store.dispatch("user/refreshInfo").then().catch();
              } else {
                this.toastText(res["message"], "top");
              }
            })
            .catch(() => {
              this.toastText("修改失败", "top");
            });
        }
      }
      this.showAvatars = false;
    },
  },
};
</script>

<style lang="less" type='text/less' scoped>
/deep/.van-swipe__indicator {
  background-color: #d0cdd1;
}
/deep/.van-swipe__indicator--active {
  background-color: #04be02;
}
.info {
  .content-slot {
    padding: 0;
    /deep/ .van-cell__title {
      flex: none !important;
      display: flex;
      align-items: center;
    }

    .avatar {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
    }

    .title {
      font-size: 0.345rem;
      line-height: 0.72rem;
      color: #333;
    }

    .desc {
      font-size: 0.345rem;
      line-height: 0.72rem;
      text-align: right;
      flex: 1;
      color: #999;
    }
  }

  /deep/ .van-cell {
    padding: 0.15rem 0.3rem;
  }
  /deep/.van-cell__right-icon {
    margin-right: -0.06rem;
  }
  /deep/ .van-hairline--top-bottom::after {
    border-width: 0;
    display: none;
  }
}

.no-radius {
  font-size: 0.36rem;
}

.avatar-list {
  width: 100vw;
  padding-bottom: 7.2vw;

  &:after {
    content: "";
    display: table;
    clear: both;
    zoom: 1;
  }

  .avatar {
    float: left;
    width: 20vw;
    height: 20vw;
    margin: 4vw 0 0 4vw;
    box-sizing: border-box;
    position: relative;

    .img {
      width: 100%;
      height: 100%;
    }

    &.active:after {
      content: "";
      position: absolute;
      border-radius: 50%;
      left: 0;
      top: 0;
      display: block;
      width: 20vw;
      height: 20vw;
      box-sizing: border-box;
    }
  }
}
.qp-box {
  background-color: #111111;
  font-family: STHeiti, Microsoft YaHei, \\5fae\8f6f\96c5\9ed1, SimSun,
    \\5b8b\4f53, arial !important;
  /deep/ .van-cell {
    background-color: #272829;
    .title {
      color: #fff;
    }
    &::after {
      border-bottom: 0.02rem solid #343434;
    }
  }
}
.blush-box {
  background-color: #640009;
  /deep/ .van-cell {
    background-color: #640009;
    .title {
      color: #fff;
    }
    &::after {
      border-bottom: 0.02rem solid #530107;
    }
  }
}
.newqp-showAvatars {
  .van-swipe {
    background-color: transparent !important;
  }
  .footer {
    background-color: transparent !important;
  }
  .avatar.active::after {
    border-color: #f6cf32;
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 start
.aqvns-box {
  .auto-box-content{
    .content-slot{
      .van-button{
        background-color: #C9A786 !important;
        border: none;
      }
    }
  }
}
.aqvns-showAvatars{
  .van-button{
    border: none;
    background-color: #C9A786 !important;
  }
}
// for aqvns 的 class 使用白色底, 咖啡色系 強制更改樣式 end
</style>
