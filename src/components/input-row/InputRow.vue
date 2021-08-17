<template>
  <label :class="['user-input-row',{'themeStyle':themeStyle},{'newQP-inp':$config.newQP || $config.blackTheme},{'blush-inp':$config.blush}]" :for="id" @click="onClick">
    <slot name="label" class="label">
      <span class="label" v-if="label">{{label}}</span>
    </slot>
    <slot name="input">
      <p class="input placeholder" v-if="(disabled || isSelector) && !modal">
        {{placeholder}}
      </p>

      <p class="input" v-else-if="(disabled || isSelector) && modal">
        {{modal}}
      </p>

      <input class="input" @click="forcedFoucus" @blur="blurFun" v-else-if="type === 'number-password' || type === 'num-input'"
             type="tel" :placeholder="placeholder" v-model="modal" :id="id"
             :disabled="disabled || isSelector" :maxlength="maxLen" :minlength="minLen" style="-webkit-text-security:disc"/>

      <input class="input" @click="forcedFoucus" @blur="blurFun" v-else :type="type" :placeholder="placeholder" v-model="modal"
      
          @input="inputFun" :disabled="disabled || isSelector" :maxlength="maxLen" :minlength="minLen" :id="id"/>
    </slot>
    <span v-if="isClick" class="icon iconfont h5-icon-left-menu-ico"></span>
    <input :id="id" @click="forcedFoucus" type="hidden" ref="hidden" v-if="isSelector"/>
    <van-popup :close-on-click-overlay="false" :style="positionStyle" v-model="showPicker" position="bottom" get-container="body">
      <van-picker :class="{'black-picker' : type==='select' && ($config.blackTheme || $config.newQP),'blush-picker' : type==='select' && $config.blush}" v-if="type==='select' || type === 'selectInput'" show-toolbar :columns="data" :title='title' @cancel="showPicker=false" :confirm-button-text="'确定'" :item-height="40" @confirm="onConfirm"></van-picker>
      <van-area :class="{'black-picker' : $config.blackTheme || $config.newQP,'blush-picker':$config.blush}" v-else-if="type==='address'" :confirm-button-text="'确定'" :title="title" :area-list="areaList" @cancel="showPicker=false" @confirm="onConfirm"></van-area>
    </van-popup>
  </label>
</template>

<script type="text/javascript">
const areaList = () => import('./area.js').then(m => m.default)

export default {
  name: 'InputRow',
  props: {
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Array, Number],
      default: ''
    },
    isClick: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array
    },
    maxLen: {
      type: String,
      default: undefined
    },
    minLen: {
      type: String,
      default: undefined
    },
    themeStyle: {
      type: Boolean,
      default: false
    },
    blurFunc: {
      type: Function,
    },
    focusFunc: {
      type: Function
    },
    inputFunc: {
      type: Function
    }
  },
  data () {
    return {
      id: '',
      showPicker: false,
      picker: null,
      areaList: {}
    }
  },
  computed: {
    positionStyle(){
      //解决安卓小米position：fixed问题导致按钮错位问题
      if(this.$mobileDevice.isAndroid 
        && this.$mobileDevice.browserName === 'MIUI Browser'){
        return {
          position:'absolute'
        }
      }else{
        return {
          position:'fixed'
        }
      }
      
    },
    modal: {
      get () {
        if (Object.prototype.toString.call(this.value) === '[object Array]') {
          return this.value.join('')
        } else {
          return this.value
        }
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    inputValue: function () {
      const self = this;
        var value;
        self.data.forEach(function (item, index) {
            if (item.value === self.selectValue) {
                value = item.text;
            }
        });
      return value;
    },
    isSelector () {
      return ['select', 'address'].includes(this.type)
    }
  },
  async created () {
    this.id = 'input-row-' + Math.random().toString().substr(2, 8)

    if (this.type === 'address') {
      this.areaList = await areaList()
    }
  },
  methods: {
      openPopup(){
        if(this.type === 'selectInput'){
          this.showPicker = true;
        }
      },
      changeValue: function () {
        const self = this;
        var text = this.$refs.inputBox.value;
        //遍历修改对应文本值
        self.data.forEach(function (item, index) {
            if (item.value === self.selectValue) {
                item.text = text;
            }
        });
    },
    forcedFoucus(el){
      if(window.isAndroid && this.$route.path.includes('/save/')) {
        this.$store.state.main.keyBoardStatus = true;
        setTimeout(() => {
          el.target.focus()
        }, 100);
      }
      let browserType = window.navigator.userAgent
      if(browserType.includes('iPhone') && !browserType.includes('UCBrowser')){
        el.target.focus()
      }
    },
    onConfirm (val) {
      if (this.type === 'address') {
        let address = ''
        val.forEach(item => {
          address += item.name
        })
        this.$emit('input', address)
      } else {
        this.$emit('input', val)
      }

      this.showPicker = false
    },
    bankNumber (str) {
      str = str.replace(/\s/g, '')
      if (str) {
        return str.replace(/([\S]{4})([\S])/g, '$1 $2')
      } else {
        return ''
      }
    },
    onClick () {
      if(this.focusFunc) {
        this.focusFunc()
      }
      if (this.isSelector){
        //解决键盘收起时遮罩问题
        setTimeout(() => {
            this.showPicker = true
          },500);
      }
    },
    blurFun(){
      if(this.blurFunc) {
        this.blurFunc()
      }
      let browserType = window.navigator.userAgent
      if(this.$mobileDevice.isIOS 
        && browserType.includes('SogouMobileBrowser')
        && this.$mobileDevice.osVersion === '12.1.2'){
        //解决iphone 8 ios:12.1.2键盘收起后底部空白
        var scrolltop = Math.round(document.documentElement.scrollTop||document.body.scrollTop);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
      // setTimeout(() => {
      //   this.$store.state.main.keyBoardStatus = false
      // }, 200);
    },
    inputFun() {
      if(this.inputFunc) {
        this.inputFunc()
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  /deep/.van-picker__toolbar{
    background-color: #fdfdfd;
  }
  
  /deep/ .van-picker-column__item{
    font-size: 0.36rem;
  }
  .black-picker {
    background: linear-gradient(0deg, #0B0B0B, #100F0F);
    /deep/ .van-picker__toolbar {
      background-color: transparent;
      .van-picker__cancel, .van-picker__title ,.van-picker__confirm{ 
        color: #fff !important;
      }
      &::after {
        border: none !important;
      }
    }
    /deep/ .van-picker__columns {
      background: linear-gradient(0deg, #0B0B0B, #100F0F);
      .van-picker-column__item {
        color: #fff;
      }
    }
    /deep/ .van-picker__mask {
      background: none;
    }
  }
    .blush-picker {
   background: linear-gradient(0deg, #530107, #7E010C);
    /deep/ .van-picker__toolbar {
      background-color: transparent;
      .van-picker__cancel, .van-picker__title ,.van-picker__confirm{ 
        color: #fff !important;
      }
      &::after {
        border: none !important;
      }
    }
    /deep/ .van-picker__columns {
     background: linear-gradient(0deg, #530107, #7E010C);
      .van-picker-column__item {
        color: #fff;
      }
    }
    /deep/ .van-picker__mask {
      background: none;
    }
  }

  .user-input-row {
    display: flex;
    align-items: center;
    height: 1rem;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    position: relative;
    padding-left: 0.3rem;
    &::after {
      content: '';
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      left: 0.3rem;
      height: 0.02rem;
    }

    &:first-child::after {
      display: none;
    }

    .label {
      font-size: 0.32rem;
      color: #333;
      margin-right: 0.2rem;
      word-spacing: normal;
      text-align: right;
    }

    .input {
      flex: 1;
      height: 0.5rem;
      display: block;
      line-height: 0.5rem;
      font-size: 0.32rem;
      color: #424242;
      text-align: left;
      position: relative;
      max-width: 9999px;
      /*user-select: all;*/
      /*background-color: red;*/
      /*transform: translateY(-4%);*/

      &.placeholder {
        font-size: 0.32rem;
        color: #adafbb;
      }

      &::-moz-placeholder {
        font-size: 0.32rem;
        color: #adafbb;
      }

      &::-webkit-input-placeholder {
        font-size: 0.32rem;
        color: #adafbb;
      }

      &:disabled {
        background-color: rgba(0, 0, 0, 0);
        color: #424242;
      }

      .bank-input {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 100;
        width: 100%;
        color: transparent;
        background-color: transparent;
      }
    }

    .h5-icon-left-menu-ico {
      color: #ADAFBB !important;
      font-size: 0.44rem !important;
      line-height: 0.44rem !important;
      width: 0.44rem !important;
      height: 0.44rem !important;
      position: absolute !important;
      right: 0.1rem !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
    }
    &.themeStyle {
      &.newQP-inp, &.blush-inp {
        .label {
          color: #FFFFFF !important;;
        }
        .name {
          color: #fff !important;;
        }
        .input {
          color: #fff !important;;
        }
        &::after {
          border-bottom: 0.02rem solid #242424;
        }
        &.blush-inp::after {
          border-bottom: 0.02rem solid #630108;
        }
      }
    }
  }
  .user-input-row::after{
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 0;
    // bottom: 0;
    top: 0;
    left: 0.3rem;
    border-bottom: 0.02rem solid #ebedf0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
  }
  .iphone {
    .user-input-row {
      .input {
        &.placeholder {
          /*transform: translateY(6%);*/
        }

        &::-moz-placeholder {
          /*transform: translateY(6%);*/
        }

        &::-webkit-input-placeholder {
          /*transform: translateY(6%);*/
        }
      }
    }
  }
</style>
