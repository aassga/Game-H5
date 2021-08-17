<template>
  <view-page class="invite theme-header-bg" full-box>
    <div slot="content" class="invite-container">
      <div class="header">
        <router-link to="/user" class="back header-back icon iconfont h5-icon-left-menu-ico"></router-link>
        <router-link class="rightlink rule" to="/user/invite-rule" v-if="$route.params.type === 'member'">
          <img src="@src/assets/img/invite/black-member-button.png" v-if="$config.blackTheme">
          <img src="@src/assets/img/invite/member-button.png" v-else>
        </router-link>
        <router-link class="rightlink money" to="/agent-doc-list" v-else>
          <img src="@src/assets/img/invite/black-invite-button2.png" v-if="$config.blackTheme">
           <img src="@src/assets/img/invite/invite-button3.png" v-else-if='$config.blush'>
          <img src="@src/assets/img/invite/invite-button2.png" v-else>
        </router-link>
      </div>
      <template v-if="$route.params.type === 'agency'">
        <Agency></Agency>
      </template>
      <template v-else>
        <NewMember v-if="$config.newInvite"></NewMember>
        <Member v-else></Member>
      </template>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import Agency from './agency'
import Member from './member'
import NewMember from './member/new-index'
export default {
  name: 'invite',
  created() {
    this.$store
      .dispatch("agency/getInvitation", {activityType: 'getInvitation'})
  },
  components: {
    Agency,Member,NewMember
  }
}
</script>

<style lang="less" type='text/less' scoped>
.invite-container{
  width: 100%;
  height: 100%;
  .header{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    color: #fff;
    z-index: 1;
    .back{
      float: left;
      font-size: .4rem;
      margin:.1rem 0 0 .2rem;
      color: #fff;
      transform: rotateZ(180deg) !important;
      font-size: 0.72rem;
    }
    .rightlink{
      float: right;
      width: 1.54rem;
      font-size: .25rem;
      height: .75rem;
      margin-top: .12rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
