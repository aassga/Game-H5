<template>
  <view-page class="view-page" full-box :bounce="false" :deceleration="0.004">
    <div class="content" slot="content">
      <div class="header">
        <div class="back header-back icon iconfont h5-icon-left-menu-ico" @click="$router.go(-1)"></div>
        <span v-if="$route.params.id === 'member' && $config.newInvite">
          分享邀请
        </span>
      </div>
      <template v-if="$route.params.id === 'agency'">
        <agency-share/>
      </template>
      <template v-else>
        <new-member-share v-if="$config.newInvite"/>
        <member-share v-else/>
      </template>
      
    </div>
  </view-page>
</template>

<script type="text/javascript">
import agencyShare from './agencyShare'
import memberShare from './memberShare'
import newMemberShare from './newMemberShare'
export default {
  name: "inviteShare",
  computed: {
    viewHeight() {
      return this.$store.state.main.windowHeight - 0.88 * this.rem
    }
  },
  components:{
    agencyShare,
    memberShare,
    newMemberShare
  },
};
</script>

<style lang="less" type='text/less' scoped>
.header{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    color: #fff;
    z-index: 9999;
    .back{
      position: absolute;
      top: .1rem;
      left: .2rem;
      font-size: .4rem;
      color: #fff;
      transform: rotateZ(180deg) !important;
      font-size: 0.72rem;
    }
    span {
      font-size: .36rem;
    }
  }
</style>