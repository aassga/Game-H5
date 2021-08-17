<template>
  <div class="filter"
  :class="themeMode"
  v-if="isOpen && $route.path === '/home'">
    <transition name="bounce">
      <div class="box-newuser" :class="themeMode">
        <img class="main" :src="imgList.imgBgMain" alt="" />
        <div class="numbers">
          <span class="freebonus">30</span>
          <span class="save">500.00</span>
          <span class="bonus">500</span>
          <span class="least">9750.00</span>
        </div>
        <div class="buttons">
          <img :src="imgList.imgBtnNo" class="no" @click="close" alt="" />
          <img :src="imgList.imgBtnYes" class="yes" alt="" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "JumpNewuser",
  props: { },
  data() {
    return {
      a: 30,
      themeMode: this.$config.newUserJumpTheme || 'dark',
      isOpen: true,
      imgList: {},
      ligntModeImg:{
        imgBgMain: require('@/assets/img/jump/lightMode/bg-main.png'),
        imgBtnNo: require('@/assets/img/jump/lightMode/btn-no.png'),
        imgBtnYes: require('@/assets/img/jump/lightMode/btn-yes.png'),
      },
      darkModeImg:{
        imgBgMain: require('@/assets/img/jump/darkMode/bg-main.png'),
        imgBtnNo: require('@/assets/img/jump/darkMode/btn-no.png'),
        imgBtnYes: require('@/assets/img/jump/darkMode/btn-yes.png'),
      },
    };
  },
  methods: {
    close() {
      this.isOpen = false
    },
    changeThemeImg() {
      switch (this.themeMode) {
        case 'light':
          this.imgList = this.ligntModeImg
          break;
        case 'dark':
          this.imgList = this.darkModeImg
          break;
        default:
          this.imgList = this.darkModeImg
    }
    },
  },
  created() {
    this.changeThemeImg()
  },
  beforeDestroy() {
    // this.close();
    console.log("!!!!!!!!!!destroy")
  },
};
</script>

<style lang="less">
.bounce-enter-active {
  animation: bounce-in 0s;
}
.bounce-leave-to {
  animation: bounce-in 1s reverse !important;
}
.bounce-leave-active {
  animation: bounce-in 1s reverse;
}
.bounce-leave-active.filter {
  background-color: transparent !important;
}
</style>

<style lang="less" scoped>
// mixin
.top-left(@t:0; @l:0;) {
  top: @t;
  left: @l;
}
//
.filter {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 10002;
  &.dark {
    background: rgba(0, 0, 0, 0.5);
  }
  &.light {
    background: rgba(0, 0, 0, 0.4);
  }
}
.box-newuser {
  display: block;
  margin: auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 20px);

  .main {
    display: block;
    width: 100%;
  }
  .numbers {
    width: 100%;
    height: 100%;
    position: absolute;
    span {
      position: absolute;
    }
    .freebonus::after {
      content: '%';
    }
    .bonus::after {
      content: '元';
    }
  }

  .buttons {
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: space-around;
    img {
      cursor: pointer;
    }
  }

  // theme customize
  &.dark {
    .numbers {
      .top-left(0, 0);
      span {
        color: #ea1a28;
        font-weight: bold;
        &:after {
          font-size: 0.75em;
        }
      }
      .freebonus {
        .top-left(40%, 62%);
        font-size: 50px;
      }
      .save {
        .top-left(57.5%, 30%);
        font-size: 20px;
      }
      .bonus {
        .top-left(55%, 60%);
        font-size: 34px;
      }
      .least {
        .top-left(68.2%, 38.6%);
        font-size: 20px;
      }
    }
    .buttons {
      bottom: 0;
      padding: 16px;
      padding-right: 20px;
      .no {
        width: 45%;
        margin-bottom: 5px;
      }
      .yes {
        width: 45%;
      }
    }
  }

  &.light {
    .numbers {
      .top-left(0, 0);
      span {
        color: #ea1a28;
        font-weight: bold;
        &:after {
          font-size: 0.75em;
        }
      }
      .freebonus {
        .top-left(42.5%, 63%);
        font-size: 50px;
      }
      .save {
        .top-left(58.7%, 32.2%);
        font-size: 20px;
      }
      .bonus {
        .top-left(56.5%, 60.5%);
        font-size: 34px;
      }
      .least {
        .top-left(68.5%, 40%);
        font-size: 20px;
      }
    }
    .buttons {
      bottom: 10px;
      padding: 18px;
      padding-right: 20px;
      .no {
        width: 43%;
      }
      .yes {
        width: 43%;
      }
    }
  }
}
</style>

