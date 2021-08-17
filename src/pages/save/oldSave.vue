<template>
  <view-page full-box v-if="isLoading" ref='box'>
    <title-header title="线上存款" slot="header" backEvent @back='goBack'></title-header>
    <ul class="list" slot="content">
      <li class="item" @click="onPayClick(bank)">
        <img class="icon" :src="bank.classIcon" alt/>
        <div class="content">
          <p class="title">{{bank.className}}</p>
          <p class="desc">{{bank.classRemarks}}</p>
        </div>
        
        <span class="span iconfont h5-icon-left-menu-ico"></span>
      </li>

      <li class="item" v-for="item in list" :key="item.id" @click="onPayClick(item)">
        <img class="icon" :src="staticURL+item.classIcon" alt/>
        <div class="content">
          <p class="title">{{item.className}}</p>
          <p class="desc">{{item.classRemarks}}</p>
        </div>
        <span class="span iconfont h5-icon-left-menu-ico"></span>
      </li>
    </ul>

    <div :style="{width:'100%',height:$store.state.main.tabHeight+'px'}" slot="footer" >
      <ios-alert v-model="nameInputShow" :width="5.4" :ok-callback="onNameSubmit" :no-callback="onNameCancel" class="saveIosAlert">
          <div class="title ios-title" slot="title">
            <h4 class="title">请填写真实姓名</h4>
            <p class="info" style="color:#000">姓名绑定后将无法修改</p>
          </div>
          <input type="text" slot='content' v-model="realName" class="input name-input" autocomplete="off" placeholder="真实姓名"/>
      </ios-alert>
    </div>
  </view-page>
</template>

<script type="text/javascript">

export default {
  name: 'Save',
  data () {
    return {
      staticURL: '',
      submitting: false,
      realName: '',
      nameInputShow: false,
      list: [],
      bank: {
        classIcon: require('../../assets/img/save/bank.png'),
        className: '银行转帐',
        classRemarks: '充值无限额,您的首选!',
        classStatus: 'yes',
        classType: 'bank',
        devices: 'pc,h5,android,ios',
        id: 0,
        sequence: 0
      },
      isLoading:true
    }
  },
  watch: {
    '$store.state.main.config': {
      handler () {
        this.staticURL = this.$store.state.main.config['statics']
      },
      deep: true
    },
    '$store.state.main.keyBoardStatus'(val){
        let style = this.$refs.box.$el.style
        if(style.textShadow === ''){
          style.textShadow = 'rgba(0,0,0,0) 0 0 0';
        }else{
          style.textShadow = '';
        }
      }
  },
  created () {
    if (this.$store.state.main.config) {
      this.staticURL = this.$store.state.main.config['statics']
    }

    if (!this.$store.state.user.token) {
      this.$router.replace('/admin/login')
    } else {
      this.$store.dispatch('user/getCategory', {
        callback: res => {
          if (res.code === 200) {
            this.list = res.data
          } else {
            this.list = []
          }
        }
      })
    }
  },
  mounted () {
    setTimeout(() => {
      this.checkName()
    }, 500)
  },
  methods: {
    goBack(){
      this.$router.push('/home');
    },
    checkName () {
      if (this.$store.state.user.token && this.$store.state.user.userInfo && !this.$store.state.user.userInfo.realName) {
        this.nameInputShow = true
        return false
      } else {
        return true
      }
    },
    onNameSubmit () {
      if (this.submitting) {
        this.toastText('正在提交中,请勿重复提交~~~', 'middle')
      } else if (!this.realName) {
        this.toastText('请输入真实姓名', 'middle')
      } else {
        this.submitting = true
        this.$store.dispatch('user/setInfo', { realName: this.realName }).then(res => {
          this.submitting = false
          if (res.code === 200) {
            this.toastText('设置成功', 'middle')
            this.$store.dispatch('user/refreshInfo').then(() => {
              this.nameInputShow = false
            })
          } else {
            this.toastText(res.message, 'middle')
          }
        })
      }
      return false
    },
    onNameCancel () {
      this.realName = ''
      this.nameInputShow = false
      // setTimeout(() => {
      //   this.$router.back()
      // }, 500)
      return true
    },
    onPayClick (item) {
      if (!this.checkName()) {

      } else if (item.classStatus === 'yes') {
        this.$router.push({
          path: '/save/' + item.classType + '/' + item.id,
          query: {
            title: item.className
          }
        })
      } else {
        this.showIosAlert({
          content: '支付方式暂不可用',
          showNo: false
        })
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
 .name-input {
      margin-top: 0.1rem !important;
      width: 100% !important;
      display: inline-block !important;
      box-sizing: border-box !important;
      font-family: PingFang-SC-Regular, serif !important;
      font-weight: 400 !important;
      border: 1px solid #E5E5E5 !important;
      font-size: 0.32rem !important;
      line-height: 0.64rem !important;
      padding: 0.08rem 0.2rem !important;
      border-radius: 0.1rem !important;
      background: #ffffff !important;
    }
  .name-input-box {
    width: 100% !important;
    box-sizing: border-box !important;
    text-align: center !important;
    height: 2rem !important;

    .title {
      font-size: 0.36rem !important;
      line-height: 0.36rem !important;
      font-weight: bold !important;
      text-align: center !important;
      margin-bottom: 0.22rem !important;
    }

    .info {
      font-size: 0.32rem !important;
      line-height: 0.32rem !important;
      font-weight: 400 !important;
      margin-bottom: 0.16rem !important;
    }

   
  }
</style>

<style lang="less" type='text/less' scoped>
  .list {
    width: 100%;
    padding: 0.2rem 0 0 0;
    margin: 0;
    box-sizing: border-box;

    .item {
      width: 100%;
      padding: 0.2rem;
      margin: 0;
      box-sizing: border-box;
      background-color: #FFFFFF;
      height: 1.3rem;
      display: flex;
      justify-content: space-around;
      align-items: stretch;
      position: relative;

      &::after {
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0;
        // bottom: 0;
        top: 0;
        left: 0.2rem;
        border-bottom: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }

      &:first-of-type::after {
        content: none !important;
      }

      .icon {
        width: 0.9rem;
        height: 0.9rem;
        display: block;
      }

      .content {
        height: 0.9rem;
        flex: 1;
        text-align: left;
        margin-left: 0.2rem;

        .title {
          font-size: 0.36rem;
          color: #2c3e50;
          line-height: 0.36rem;
        }

        .desc {
          margin-top: 0.2rem;
          font-size: 0.26rem;
          color: #999;
          line-height: 0.26rem;
        }
      }

      .span {
        position: relative;
        color: #ADAFBB !important;
        font-size: 0.5rem;
        width: 0.5rem;
        right: -0.1rem;
        line-height: 0.87rem;
      }
    }
  }
  
</style>
