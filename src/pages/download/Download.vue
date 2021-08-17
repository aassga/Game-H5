<template>
  <component :is="theme"></component>
</template>

<script>
import downloadDefault from './theme/default'
import downloadXpj from './theme/xpj'
import downloadH5 from './theme/h5/websiteInformation'
import downloadXPJH5 from './theme/XPJH5/websiteInformation'
import downloadKYQP from './theme/kyqp/index'
import downloadSuperSign from './theme/superSign/index'
import downloadAMXPJ from './theme/amxpj/index'

// import downloadAmvnsr from './theme/amvnsr/index'
export default {
  name: 'Download',
  components: {
    downloadDefault,
    downloadXpj,
    downloadH5,
    downloadXPJH5,
    downloadKYQP,
    downloadSuperSign,
    downloadAMXPJ,
    // downloadAmvnsr
  },
  computed: {
    theme () {
      switch (this.$config.downloadTheme) {
        case 'xpj':
          return 'downloadXpj'
        case 'h5':
          return 'downloadH5'
        case 'xpjh5':
          return 'downloadXPJH5'
        case 'kyqp':
          return 'downloadKYQP'
        case 'superSign':
          return 'downloadSuperSign'
        case 'amxpj':
          return 'downloadAMXPJ'
        default:
          return 'downloadDefault'
      }
    }
  },
  created () {
  },
  mounted(){
    if(!(window.localStorage.getItem('downloadAndroidLink') && window.localStorage.getItem('downloadIosLink'))){
      this.$store
            .dispatch('main/getConfigVerify')
            .then(() => {
              this.initDown();
            })
            .catch(err => {
                this.$store.dispatch('main/setConfig').then(() => {
                  this.initDown();
          })
      })
    }else {
      this.initDown();
    }
    
  },
  methods:{
    initDown(){
      if (this.isAndroid) {
        var downUrl = window.localStorage.getItem('downloadAndroidLink');
        if (downUrl) {
          if (this.$config.autoDownload.android) {
            if(downUrl && downUrl.length > 0  && !downUrl.includes('http')){
              downUrl = location.origin + ""+downUrl;
            }
            window.location.href = downUrl;
            setTimeout(() => {
              this.$router.push('/')
            })
          }
        } else {
          this.$router.push('/')
          setTimeout(() => {
            this.$store.state.main.iosAlert.content = '<span style="font-weight:400;">暂不支持安卓APP下载<span>'
            this.$store.state.main.iosAlert.show = true
            this.$store.state.main.iosAlert.okText = '确定'
            this.$store.state.main.iosAlert.showNo = false
          })
        }
      } else {
        if(this.$config.download.appStore){
          let model = {
            siteCode: this.$config.download.appStore
          }
          new OpenInstall({
              appKey : "u4gzdw",
              onready : function() {
                  this.schemeWakeup();
                  this.wakeupOrInstall();
                  return false;
              }
          }, model);
          setTimeout(() => {
            this.$router.push('/')
          })
          return;
        }
        if (window.localStorage.getItem('downloadIosLink')) {
          if (this.$config.autoDownload.ios) {
            window.location.href = this.$config.download.ios
            setTimeout(() => {
              this.$router.push('/')
            })
          }
        } else {
          this.$router.push('/')
          setTimeout(() => {
            this.$store.state.main.iosAlert.content = '<span style="font-weight:400;">暂不支持苹果APP下载</span>'
            this.$store.state.main.iosAlert.show = true
            this.$store.state.main.iosAlert.okText = '确定'
          })
        }
      }
    }
  }
}
</script>
