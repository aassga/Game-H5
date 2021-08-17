<template>
  <div class="customer-content">
    <ul class="content"
        v-if="newCustomerList.length>0">
      <li class="customer-li"
          v-for="(item,i) in newCustomerList"
          :key="i">
        <div class="left">
          <div class="customer-head">
            <div class="head-img"
                 :style="{'background-image': 'url('+kfLink+item['imgUrl']+')'}">
            </div>
            <!-- <div v-if='i===0 || i===1'
                 class="hot"
                 :style="{'background-image': 'url('+hot+')'}"></div>
            <div v-else
                 class="hot"
                 :style="{'background-image': 'url('+tj+')'}"></div> -->
          </div>
          <div class="detail">
            <div class="cuter-msg">
              <span class="name">{{item.username}}</span>
              <!-- <span class="amount">成交单量：{{item.orderCount}}</span> -->
            </div>
            <div class="wjx">
              <span class="wjs-account">
                <i :style="{'background-image': 'url('+wjx+')'}"
                   v-for="i in swjxAccount(item.rank)"
                   :key="i"
                   class="shi"></i>
                <i :style="{'background-image': 'url('+wjxBan+')'}"
                   v-for="i in bwjxAccount(item.rank)"
                   :key="i"
                   class="shi"></i>
                <span class="score">{{item.rank}}</span>
              </span>
            </div>
            <div class="save-type">
              <span class="img-bank"
                    :style="{'background-image': 'url('+bank+')'}"
                    v-if="item.aisleId.indexOf('3') != -1"></span>
              <span class="img-zfb"
                    :style="{'background-image': 'url('+zfb+')'}"
                    v-if="item.aisleId.indexOf('2') != -1"></span>
              <span class="img-weixin"
                    :style="{'background-image': 'url('+weixin+')'}"
                    v-if="item.aisleId.indexOf('1') != -1"></span>
            </div>
          </div>
        </div>

        <a class="jump-kefu" @click="getUserKey(item)">
          <span>充值</span>
        </a>
      </li>
    </ul>
    <div class="content"
         v-else>暂无人工入款客服</div>
  </div>
</template>

<script>
import { Dialog } from 'vant';
export default {
  name: 'customerSaveContent',
  props: {
    newCustomerList: {
      type: Array
    }
  },
  data () {
    return {
      fillLink:'',
      url: require('../../assets/img/newSave/King@2x.png'),
      wjx: require('../../assets//img/newSave/shixing@2x.png'),
      wjxBan: require('../../assets/img/newSave/wujiaox@2x.png'),
      bank: require('../../assets/img/newSave/bank@2x.png'),
      zfb: require('../../assets/img/newSave/zfb@2x.png'),
      weixin: require('../../assets/img/newSave/weixin@2x.png'),
      tqjx: 5, // 总的五角星数据
      kfLink: 'http://1636272.com/' // 客服头像链接
    }
  },
  computed: {
  },
  created () {

  },
  mounted () {
  },
  watch: {
  },
  methods: {
    // 计算五角星实心个数
    swjxAccount (rank) {
      let list = rank.split('.')
      let swjx = Number(list[0])
      let yu = Number(list[1])
      if (yu > 5) {
        swjx += 1
      }
      return swjx
    },
    // 计算半星的个数
    bwjxAccount (rank) {
      let list = rank.split('.')
      let yu = Number(list[1])
      let harfStar
      if (list.length > 0) {
        harfStar = !(yu > 5)
      } else {
        harfStar = false
      }
      return harfStar
    },
    // 获取客户的key
    getUserKey(data){
      this.$store.dispatch('main/getUseKey').then(res => {
      if (res.code === 200) {
        this.fillLink = res.data.data.url+'&port=4&type=0&key='+res.data.data.key+'&customerUuid='+data.customerUuid;
        window.location.href = this.fillLink
      } else {
        Dialog.alert({
          message: res.message
        });
      }
    })
    },
  },
  components: {
  }
}

</script>

<style scoped lang="less">
.content {
  margin: 0.2rem 0.2rem;
  font-size: 0.26rem;
}
.customer-li {
  background-color: #fff;
  padding-left: 0.12rem;
  border-radius: 0.16rem;
  overflow: hidden;
  height: 1.7rem;
  text-align: left !important;
  margin-bottom: 0.2rem;
  vertical-align: middle;
  .left {
    float: left;
    height: 1.7rem;
    display: flex;
    align-items: center;
    position: relative;
    .customer-head {
      display: inline-block;
      .head-img {
        width: 1.41rem;
        height: 1.4rem;
        background-repeat: no-repeat;
        border-radius: 0.16rem;
        background-size: cover;
      }
      .hot {
        position: absolute;
        width: 0.32rem;
        height: 0.59rem;
        left: 0;
        top: 0;
        background-size: contain;
        background-repeat: no-repeat;
      }
    }
    .detail {
      display: inline-block;
      margin-left: 0.26rem;
      .cuter-msg {
        .name {
          font-size: 0.28rem;
          color: #121212;
        }
        .amount {
          margin-left: 0.23rem;
          font-size: 0.2rem;
          color: #999999;
        }
      }
      .wjx {
        margin-top: 0.1rem;
        margin-bottom: 0.08rem;
        .wjs-account {
          vertical-align: middle;
          i {
            display: inline-block;
            width: 0.29rem;
            height: 0.28rem;
            background-repeat: no-repeat;
            background-size: contain;
            margin-right: 0.13rem;
          }
          .score {
            margin-left: 0.08rem;
            color: #ff7e00;
            font-size: 0.26rem;
          }
        }
      }
      .save-type {
        display: flex;
        align-items: center;
        span {
          display: inline-block;
          background-size: contain;
          background-repeat: no-repeat;
          margin-right: 0.31rem;
        }
        .img-bank {
          width: 0.41rem;
          height: 0.25rem;
        }
        .img-zfb {
          width: 0.33rem;
          height: 0.32rem;
        }
        .img-weixin {
          width: 0.37rem;
          height: 0.3rem;
        }
      }
    }
  }

  .jump-kefu {
    float: right;
    height: 100%;
    display: block;
    span {
      color: #fff;
      display: inline-block;
      width: 1.56rem;
      height: 100%;
      line-height: 1.7rem;
      text-align: center;
    }
  }
}
</style>
