<template>
  <view-page class="agent-doc-list theme-header-bg" full-box>
    <title-header class="theme-main-bg theme-header-bottom" :title="title" v-if="!isApp" slot="header"></title-header>
    <div slot="content" class="guildlist_page">
      <ul class="listbox">
        <li v-for="(item,index) in lists" :key='index' class="listbox_li theme-header-bg theme-border-color"><a class="theme-color-white"
          @click='goSwiperList(item,item.id)'>{{item.title}}<span class='icon iconfont h5-icon-next'></span></a></li>
      </ul>
    </div>
  </view-page>
</template>
<script>
export default {
  data () {
    return { 
      title: '金字塔教程',
      lists: [
        { title: '注册代理帐号', id: '0' },
        { title: '进入代理中心', id: '1' },
        { title: '进入推广开户', id: '2' },
        { title: '邀请下级会员', id: '3' },
        { title: '创建下级帐号', id: '4' },
        { title: '进入财务报表', id: '5' },
        { title: '查看投注记录', id: '6' },
        { title: '进入代理报表', id: '7' },
        { title: '进入我的团队', id: '8'},
        { title: '领取佣金入口', id: '9' },
        { title: '查看佣金明细', id: '10' }
        
      ]
    }
  },
  methods: {
    goSwiperList (item, index) {
      this.$router.push({
        path: '/agent-doc-info',
        query: {
          clickIndex: index,
          app: this.$route.query.app
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .guildlist_page {
    // position: absolute;
    // margin-top:.88rem;
    width: 100%;
    -webkit-transition: all .45s cubic-bezier(.55, 0, .1, 1);
    transition: all .45s cubic-bezier(.55, 0, .1, 1);
    // top: 0;
    // bottom: 0;
    // left: 0;
    // right: 0;
    background: rgba(240, 240, 240, 0.897);
    -webkit-backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
    z-index: 10;

    .listbox {
      position: relative;
      margin-top: 0;
      margin-bottom: 0;
      padding-left: 0;
      list-style: none;
      background-color: #fff;
      border: none;

      .listbox_li {
        height: .88rem;
        line-height: .88rem;
        font-family: microsoft yahei;
        position: relative;
        overflow: hidden;
        transform-style: preserve-3d;
        padding: 0 15px;
        border-bottom: 0.015rem solid rgba(235,237,240, 0.5);

        a {
          font-family: microsoft yahei;
          font-size: .28rem;
          position: relative;
          display: block;
          overflow: hidden;
          margin: 0px -15px;
          padding: inherit;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: inherit;
          text-align: left !important;
          border: 0;
          color: #2c3e50;

          span {
            font-family: Muiicons;
            font-size: inherit;
            line-height: 1;
            position: absolute;
            top: 50%;
            display: inline-block;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
            text-decoration: none;
            color: #bbb;
            right: 15px;
            content: '\e662';
            white-space: nowrap;
            display: inline-block;
          }
        }
      }
    }
  }
</style>
