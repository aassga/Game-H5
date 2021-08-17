<template>
  <view-page full-box style="background:#000">
    <div slot="content" class="content">
      <img src="../../assets/img/androidPage/ios-btn.png" alt="" class="ios-btn">
      <img src="../../assets/img/androidPage/android-btn.png" alt="" class="android-btn">
      <div class="download-btn">
        <a v-if="!$store.state.main.downloadType || $store.state.main.downloadType === ''"
          :href="androidDowUrl"></a>
        <a v-else @click="downApp"></a>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "kyqp",
  data() {
    return {
      androidDowUrl:null,
      theAppKey: ''
    };
  },
  created() {
  },
  methods: {
    downApp () {
      ShareTrace.download()
    },
    find (str, cha, num) {
			var x = str.indexOf(cha);
			for(var i = 0; i < num; i++) {
					x = str.indexOf(cha, x+1);
			}
			return x;
    },
  },
  mounted() {
    var str = window.location.href;
    var index = str.lastIndexOf("#");
    var rl = str.substring(0, index-3);
    setTimeout(() => {
      this.androidDowUrl = window.localStorage.getItem('downloadAndroidLink');
      if(this.$store.state.main.downloadType && this.$store.state.main.downloadType !== '') {
        let str = window.location.href;
        let agent = localStorage['agent'] || localStorage['channelCode'];
        let par1 = "channelCode=" + agent + "&channelDomain=" + str.substring(0, this.find(str, '/', 2));
        let par2 = "channelDomain=" + str.substring(0, this.find(str, '/', 2));
         if (this.$config.name === 'kkqp') {
          if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
            this.theAppKey = "85cf493a8c8a56ae"; // 超级签
          } else {
            this.theAppKey = 'f21275580a0be8ff'; // 企业签
          }
        }
        ShareTrace.init({
          appkey: this.theAppKey, // 此值必填
          param: agent ? par1 : par2,
        });
      }
    }, 300);
  },
  computed: {},
};
</script>

<style lang="less" scoped>
@keyframes heart_beat {
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(0.9);
  }
}
.content {
  width: 100%;
  min-height: 14.48rem;
  background-image: url('../../assets/img/androidPage/bg_backup.jpg');
  background-size: 100% 100%;
  .ios-btn, .android-btn {
    margin-top: 7.95rem;
    width: 3.03rem;
    animation: heart_beat 0.8s infinite linear;
  }
  .android-btn {
    animation-delay: 0.4s;
  }
  .download-btn {
    position: absolute;
    top: 8rem;
    width: 100%;
    height: 5.28rem;
    a {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>