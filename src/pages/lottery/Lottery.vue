<template>
  <component :series="series" :id="id" class="lottery theme-header-bg" :is="lotteryType">
    <red-lope v-transfer-dom v-if="true"></red-lope>
  </component>
</template>

<script type="text/javascript">
import {
  LotteryCp11x5,
  LotteryPcdd,
  LotteryPk10,
  LotteryLhc,
  LotteryK3,
  LotteryKlsf,
  LotterySsc,
  LotteryDpc,
  LotteryClzs
} from "../../pages";
import RedLope from "@src/pages/lottery/component/red-lope/RedLope";

export default {
  name: "Lottery",
  components: {
    RedLope,
    LotteryCp11x5,
    LotteryPcdd,
    LotteryPk10,
    LotteryLhc,
    LotteryK3,
    LotteryKlsf,
    LotterySsc,
    LotteryDpc,
    LotteryClzs
  },
  props: {
    series: {
      type: [Number, String],
      request: true
    },
    id: {
      type: [Number, String],
      request: true
    }
  },
  data() {
    return {
      playList: null,
      showPopup: false
    };
  },
  beforeRouteEnter: (to, from, next) => {
    localStorage.setItem('lotteryHallType',from.query.type)
    next()
  },
  computed: {
    lotteryType() {
      let name = "";
      switch (this.series.toString()) {
        case "10006":
          name = "LotteryCp11x5";
          break;

        case "10007":
          name = "LotteryPcdd";
          break;

        case "10008":
          name = "LotteryPk10";
          break;

        case "10009":
          name = "LotteryDpc";
          break;

        case "10010":
          name = "LotteryLhc";
          break;

        case "10011":
          name = "LotteryK3";
          break;

        case "10012":
          name = "LotteryKlsf";
          break;

        case "10013":
          name = "LotterySsc";
          break;
        case "99996": 
          name = 'LotteryClzs'  
      }

      return name;
    }
  },
  created() {
    this.$store.dispatch("user/setBalanceToLocal").then();
    
  }
};
</script>

<style lang="less" type='text/less' scoped>
</style>
