<template>
  <div class="body">
    <div v-if="cardNum==='unset'" class="no-bank">
      <div class="img-box"></div>
      <p class="info">未绑定银行卡</p>
    </div>
    <ul v-else class="bank-list">
      <li class="item" v-for="(item,i) in list" :key="item.id + '_' + i" @click="onBankClick(item)"
          :ref="'item' + i" :id="'testtest' + i" :style="getBankBg(item)">
        <div v-if="item.status === 'no'" class="dialog">
          <span class="yitiyong" :style="getBankBgTy(item)"></span>
        </div>
        <span class="bank-name">{{item.bankName}}</span>
        <span class="card-num">{{item.cardNum.replace(/([\d*]{4})/g, '$1 ')}}</span>
      </li>
    </ul>
    <button v-if="list.length < 5" class="btn-white theme-color theme-yellow-bg theme-color-black" @click="$router.push('/take?index=2')">
      <span class="icon iconfont h5-icon-bank-add"></span>
      <span class="content">添加银行卡</span>
    </button>
  </div>
</template>

<script type="text/javascript">
const disabledBankImg = require('../../../../assets/img/save/bank-disabled.png')

export default {
  name: 'BankEditor',
  data () {
    return {
      bankList: [
        '工商银行',
        '农业银行',
        '建设银行',
        '招商银行',
        '中国银行',
        '浦发银行',
        '中信银行',
        '交通银行',
        '民生银行',
        '兴业银行',
        '邮政银行',
        '光大银行',
        '华夏银行',
        '浙商银行',
        '包商银行',
        '北京银行',
        '上海银行',
        '东莞银行',
        '广发银行',
        '平安银行',
        '徽商银行',
        '江苏银行',
        '农村信用社',
        '哈尔滨银行',
        '深圳发展银行',
        '广州农村商业银行',
        "北京农商",
        "福建农村信用社",
        "成都银行",
        "浙江网商银行",
        "吉林银行",
        '其它银行'
      ],
      bankListImg: {}
    }
  },
  computed: {
    cardNum () {
      return this.$store.state.user.userInfo.cardNum
    },
    list () {
      return this.$store.state.user.bankData
    }
  },
  created () {
    this.bankList.forEach(bankName => {
      this.bankListImg[bankName] = require(`../../../../assets/img/save/bank-bg/${bankName}.png`)
    })
    if(this.cardNum==='unset' && this.$route.query.user) {
      this.$router.replace(`/take?index=2`);
    }
  },
  mounted () {
    this.$store.dispatch('user/refreshBank').then()
    this.$emit('on-title-change', '银行信息')
  },
  methods: {
    getBankBgTy (item) {
      if (item.status === 'no') {
        return `background-image: url('${disabledBankImg}')`
      }
    },
    getBankBg (item) {
      return `background-image: url('${this.bankListImg[this.bankList.includes(item.bankName) ? item.bankName : '其它银行']}.png')`
    },
    onBankClick (item) {
      if (item.status === 'no') {
        return false
      }
      if (this.$route.query.action === 'select') {
        this.$store.state.user.takeTabIndex = 0;
        this.$store.commit('user/setSelectedBank', item.id)
        this.$router.push('/take')
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .body {
    padding: 0.04rem 0.24rem;
    .bank-list {
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

        .dialog {
          position: absolute;
          background: #fff;
          opacity: 0.4;

          > span {
            width: 2.3rem;
            height: 1.01rem;
            background-size: 100% 100%;
            right: 0.2rem;
            top: 0.1rem;
            position: absolute;
          }
        }

        .bank-name {
          position: absolute;
          left: 1.1rem;
          top: 0.3rem;
          font-size: 0.32rem;
        }

        .card-num {
          position: absolute;
          left: 1.1rem;
          top: 1.1rem;
          font-size: 0.44rem;
          text-align: left;
        }
      }
    }

    .no-bank {
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
      width: 100%;
      display: flex;
      // display:table-cell;
      height: 0.88rem;
      align-items: center;
      justify-content: center;
      // padding: 0.28rem 0;
      text-align: center;
      vertical-align: middle;
      margin-bottom: 0.2rem;
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
