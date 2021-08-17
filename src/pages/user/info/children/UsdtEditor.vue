<template>
  <div class="body">
    <div v-if="!list" class="no-usdt">
      <div class="img-box"></div>
      <p class="info">未绑定USDT</p>
    </div>
    <ul v-else class="usdt-list">
      <li class="item" v-for="(item,i) in list" :key="i" @click="onUsdtClick(item)">
        <span class="usdt-name">{{item.usdt_type}}</span>
        <span class="card-num">{{item.cardNum}}</span>
      </li>
    </ul>
    <button v-if="list.length < 2" class="btn-white theme-color theme-yellow-bg theme-color-black" @click="goAddBank">
      <span class="icon iconfont h5-icon-bank-add"></span>
      <span class="content">添加USDT</span>
    </button>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'UsdtEditor',
  data () {
    return {
    }
  },
  computed: {
    list () {
      return this.$store.state.user.usdtData
    }
  },
  created () {
    if(!this.list.length) {
      this.$router.push(`/take?index=3`);
    }
  },
  mounted () {
    this.$store.dispatch('user/refreshUsdt').then()
    if(!this.$route.query.user) {
      this.$emit('on-title-change', 'USDT信息')
    }else {
      this.$emit('on-title-change', '银行信息')
    }
  },
  methods: {
    onUsdtClick (item) {
      if (this.$route.query.action === 'select') {
        this.$store.state.user.takeTabIndex = 1;
        this.$store.commit('user/setSelectedUsdt', item.id)
        this.$router.push('/take')
      }
    },
    goAddBank () {
      if(this.$route.query.user === '1') {
        this.$router.push('/take?index=3')
      }else {
        this.$router.push('/take?index=3')
      }
    }
  },
  watch: {
    list(arr) {
      if(arr.length < 1) {
        this.$router.push(`/take?index=3`);
      }
    }
  },
}
</script>

<style lang="less" type='text/less' scoped>
  .body {
    padding: 0.04rem 0.24rem;
    .usdt-list {
      list-style: none;
      width: 100%;
      margin-top: 0.2rem;
      .item {
        box-sizing: border-box;
        display: block;
        position: relative;
        margin-bottom: 0.24rem;
        width: 7.02rem;
        height: 2.24rem;
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 100% 100%;
        color: #ffffff;
        background-image: url('../../../../assets/img/save/bank-bg/usdt.png');

        .usdt-name {
          position: absolute;
          left: 1.1rem;
          top: 0.3rem;
          font-size: 0.32rem;
        }

        .card-num {
          position: absolute;
          left: 1.1rem;
          top: 0.82rem;
          font-size: 0.44rem;
          text-align: left;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          white-space: normal;
          word-break: break-all;
          padding-right: 0.4rem;
        }
      }
    }

    .no-usdt {
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 0.5rem;

      .img-box {
        width: 100%;
        height: 1.5rem;
        background-image: url("../../../../assets/img/save/no-bank.png");
        background-repeat: no-repeat;
        background-size: 1.7rem 1.5rem;
        background-position: center;
        margin-top: 1.5rem;
      }

      .info {
        line-height: 1.2rem;
        font-size: 0.3rem;
        color: #898989;
      }
    }

    .btn-white {
      outline: 0;
      border: none;
      border-radius: 0.1rem;
      background-color: white;
      width: 7rem;
      display: flex;
      height: 0.88rem;
      align-items: center;
      justify-content: center;
      text-align: center;
      vertical-align: middle;
      .icon {
        font-size: 0.32rem;
        display: inline-block;
        vertical-align: middle;
        transform: scale(1.2);
        margin-right: 0.1rem;
      }

      .content {
        font-size: 0.32rem;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
</style>
