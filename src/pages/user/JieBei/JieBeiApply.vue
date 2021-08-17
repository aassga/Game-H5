<template>
  <view-page full-box class="theme-header-bg">
    <title-header :title="'申请' + type" slot="header" class="theme-main-bg theme-header-bottom"></title-header>
    <div class="content" slot="content">
      <div class="borrow-box theme-main-bg-5" v-if="this.$route.params.type === 'borrow'">
        <p class="info-row theme-after-border-color">
          <span class="label theme-color-white">
            可申请额度:
            <span  style="color:red" v-if="jieBeiData.huanInfo">{{borrowData['limit']}}</span>元
          </span>
        </p>
        <p class="info-row input-row theme-after-border-color">
          <span class="rmb theme-color-white">￥</span>
          <input
            v-if="!!jieBeiData.jieInfo"
            v-model="money"
            v-keyBroayStates
            class="input change-money theme-color-white"
            type="number"
            :placeholder="borrowData['text']"
          />
          <a class="action theme-color theme-color-yellow" @click="money = borrowData['allMoney']">全部</a>
        </p>
      </div>
      <div class="refund-box theme-main-bg-5" v-else>
        <p class="info-row theme-main-bg-5 theme-after-border-color">
          <span class="label theme-color-white">
            帐号余额:
            <span style="color:red">{{userInfo.balance}}</span>元
          </span>
        </p>
        <p class="info-row theme-after-border-color">
          <span class="label theme-color-white">
            欠款金额:
            <span style="color:red">{{jieBeiData.huanInfo && jieBeiData.huanInfo.qiankuan ? (jieBeiData.huanInfo.qiankuan*1).toFixed(2) : '0.00'}}</span>元
          </span>
        </p>
        <p class="info-row input-row theme-after-border-color">
          <span class="rmb theme-color-white">￥</span>
          <input
            v-if="!!jieBeiData.huanInfo"
            v-model="money"
            v-keyBroayStates
            class="input change-money theme-color-white"
            type="number"
            :placeholder="refundData['text']"
          />
          <a class="action theme-color theme-color-yellow" @click="money = refundData['allMoney']">全部</a>
        </p>
      </div>
      <div class="submit-btn theme-bg theme-yellow-bg-2 theme-color-black" @click="submit">确认{{type}}</div>
      <div class="bottom-text" v-if="this.$route.params.type === 'borrow'">最后还款日:{{jieBeiData.jieInfo && jieBeiData.jieInfo.returnAmounDate ? jieBeiData.jieInfo.returnAmounDate : ''}}</div>
      <div class="bottom-text" v-else>请保证帐户余额资金足够还款</div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "JieBeiApply",
  data() {
    return {
      type: "",
      money: "",
      jieBeiData: {},
    };
  },
  created() {
    this.type = this.$route.params.type === "borrow" ? "借款" : "还款";
    this.jieBeiData = this.$store.state.user.jieBeiData;
    if(this.$route.params.type === 'refund') {
      this.$store.dispatch("user/setBalanceToLocal").then();
    }
    this.getJiebeiData();
  },
  computed: {
    borrowData() {
      if(this.jieBeiData.huanInfo && this.jieBeiData.jieInfo) {
        if(Number(this.jieBeiData.huanInfo.qiankuan) > 0) {
          return {
            limit : '0.00',
            text :  `当前欠款${(this.jieBeiData.huanInfo.qiankuan*1).toFixed(2)}元`,
            allMoney: 0,
          }
        }else {
          let text = ''
          let applyMoney = Number(this.jieBeiData.jieInfo.allowAmount)
          if(applyMoney > 10) {
            text = `10.00~${this.jieBeiData.jieInfo.allowAmount}元`
          }else if(applyMoney === 10) {
            text = '可申请10.00元'
          }else if(applyMoney > 0) {
            text = '最低10.00元起'
          }else if(applyMoney === 0) {
            text = '可申请0.00元'
          }
          return {
            limit : this.jieBeiData.jieInfo.allowAmount,
            text :  text,
            allMoney: this.jieBeiData.jieInfo.allowAmount,
          }
        }
      }
    },
    refundData() {
      if(this.jieBeiData.huanInfo) {
        let text = ''
        let applyMoney = Number(this.jieBeiData.huanInfo.zuiduokehuan)
        if(applyMoney === 0) {
          text = '暂无欠款'
        }else if(applyMoney > 0) {
          text = `可还款${(this.jieBeiData.huanInfo.zuiduokehuan*1).toFixed(2)}元`
        }
        return {
          text :  text,
          allMoney: this.jieBeiData.huanInfo.zuiduokehuan,
        }
      }
    }
  },
  methods: {
    getJiebeiData() {
      this.$store
        .dispatch("user/activityJiebeiJieHuanInfo")
        .then(res => {
          if (res.code === 200)
            this.$store.commit("user/setJieBeiData", res.data);
            this.jieBeiData = res.data
        })
        .catch(() => {});
    },
    submit() {
      if (!this.money) {
        this.toastText('请输入金额', 'top')
      }else if(Number(this.jieBeiData.huanInfo.qiankuan) > 0 && this.$route.params.type === "borrow"){
        this.toastText('请先还清欠款再来借款', 'top')
      }else if(Number(this.jieBeiData.jieInfo.allowAmount) === 0 && this.$route.params.type === "borrow") {
        this.toastText('暂无可借额度', 'top')
      }else if ((parseFloat(this.money) > this.jieBeiData.jieInfo.allowAmount) && this.$route.params.type === "borrow") {
        this.toastText('借款金额大于可借额度', 'top')
      }else if(Number(this.jieBeiData.huanInfo.qiankuan) === 0 && this.$route.params.type === "refund") {
        this.toastText('暂无欠款金额', 'top')
      }else if ((parseFloat(this.money) > this.userInfo.balance) && this.$route.params.type === "refund") {
        this.toastText('超出余额，请重新输入', 'top')
      }else if ((parseFloat(this.money) > this.jieBeiData.huanInfo.qiankuan) && this.$route.params.type === "refund") {
        this.toastText(`超出欠款，最多需还${this.jieBeiData.huanInfo.qiankuan}元`, 'top')
      } else if (parseFloat(this.money) < 0) {
        this.toastText('金额不能小于0元', 'top')
      } else if (!parseFloat(this.money)) {
        this.toastText('请输入正确的金额', 'top')
      }else {
        let type = this.$route.params.type === "borrow" ? 'activityJiebeiJie' : 'activityJiebeiHuan'
        this.$store
          .dispatch(`user/${type}`, {
            amount: parseFloat(this.money),
          })
          .then(res => {
            if (res.code === 200) {
              this.$nextTick(() => {
                this.getJiebeiData()
              })
              this.$store.dispatch('user/refreshBalance').then()
              this.$router.push({
                path: "/user/JieBeiResult",
                query: {
                  type: this.$route.params.type,
                  money: this.money,
                  allMoney: Number(this.jieBeiData.huanInfo.qiankuan) - Number(this.money)
                }
              });
              this.money = "";
            } else {
              this.toastText(res.message, "top");
            }
          })
          .catch(() => {
          });
      }
    }
  },
  mounted() {},
  watch:{
    money(val){
      if(this.money && this.money.toString()=='0'){
        this.money=null
      }
    }
  },
};
</script>

<style lang="less" scoped>
/deep/.placeholder span {
  font-size: 0.5rem;
  color: #d6d6d6;
}
.content {
  padding: 0 0.16rem;
  .borrow-box,
  .refund-box {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0.05rem 0.11rem rgba(0, 63, 112, 0.06);
    border-radius: 0.15rem;
    margin: 0.2rem 0;
    .label {
          margin: 0.1rem 0.1rem 0.1rem 0.04rem;
          white-space: nowrap;
          flex-shrink: 0;
          font-size:0.32rem;
          color:#444444;
        }
        .info-row {
          width: 100%;
          height: 1.32rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;

          .money {
            font-size: 0.4rem;
            text-align: left;
            white-space: nowrap;
            flex: 1;
            .rmb{
              font-size: 0.32rem;
              margin-left: 0.06rem;
            }
          }

          .action {
            color: #2C93FF;
            font-size: 0.32rem;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .rmb {
            left:0;
            font-size: 0.7rem;
            color: #444444;
            white-space: nowrap;
          }

          .input {
            flex: 1;
            font-size: 0.7rem;
            padding: 0.3rem 0.3rem 0.3rem 0.15rem;
            color: #444444;
            flex-shrink: 0;
            min-width: 0;
            &::-webkit-input-placeholder {
              transform: scale(0.66) translateY(0.06rem);
              transform-origin: left;
              overflow: visible !important;
            }

          }

          &:last-child {
            border-bottom: none;
          }
        }
        .info-row{
          padding:0 0.24rem
        }
        .input-row{
          height:auto;
          padding:0 0.24rem 0 0.13rem!important;
        }
        .input-row {
          position: relative;
          .action {
            font-size: 0.32rem;
          }
          .input{
            height: 1.7rem!important;
          }
          .placeholder,.focus{
            padding: 0.3rem 0.3rem 0.3rem 0.15rem;
            position: relative;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 100%;
            text-align: left;
            overflow: hidden;
          }
          .input:empty::before{
            color: #d6d6d6;
            position: absolute;
            font-size:0.5rem;
            left:0.15rem;
            content:attr(placeholder);
          }
        }
        .info-row:after {
           position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            right: 0;
            bottom: 0;
            left: 0;
            border-bottom: 0.02rem solid #ebedf0;
            -webkit-transform: scaleY(.5);
            transform: scaleY(.5);
        }
        .info-row:last-of-type:after{
          height: 0;
        }
  }
  .submit-btn {
    color: #fff;
    height: 0.9rem;
    font-size: 0.36rem;
    line-height: 0.9rem;
    text-align: center;
    border-radius: 0.04rem;
    cursor: pointer;
  }
  .bottom-text {
    margin-top: 0.3rem;
    color: #a4a4a4;
    font-size: 0.28rem;
  }
}
</style>
