<template>
  <van-popup class="ios-popup" v-model="isShow" :style="positionStyle" position="bottom" get-container="body" :lazy-render="false">
    <div class="ios-popup-radio">
      <ul class="ios-popup-list">
        <li class="ios-popup-item" :class="{disabled: item.disabled}" v-for="item in list" :key="item[keyName]" @click="onClick(item)">{{item[valName]}}</li>
      </ul>
      <button class="ios-popup-btn theme-color" @click="onCancel">取消</button>
    </div>
  </van-popup>
</template>

<script type="text/javascript">
export default {
  name: 'IosPopupSelect',
  props: {
    value: {
      type: [String, Number, Boolean, Array, Object],
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default () {
        return []
      }
    },
    keyName: {
      type: String,
      default: 'key'
    },
    valName: {
      type: String,
      default: 'value'
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
    isShow: {
      get () {
        return this.show
      },
      set (val) {
        this.$emit('update:show', val)
      }
    }
  },
  methods: {
    onCancel () {
      this.isShow = false
      this.$emit('cancel', false)
    },
    onClick (item) {
      this.isShow = false
      this.$emit('input', item)
      this.$emit('select', item)
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .ios-popup {
    background-color: rgba(0, 0, 0, 0) !important;

    .ios-popup-radio {
      padding: 0.4rem;
      box-sizing: border-box;
      width: 100%;
      font-size: 0.32rem;

      .ios-popup-list {
        border-radius: 0.2rem;
        overflow: hidden;
        margin-bottom: 0.4rem;

        .ios-popup-item {
          display: block;
          width: 100%;
          border-bottom: 1px solid hsla(0, 0%, 95%, 1);

          &:last-child {
            border-bottom: none !important;
          }
        }
      }

      .ios-popup-btn, .ios-popup-item {
        background-color: white;
        width: 100%;
        outline: 0;
        border: none;
        line-height: 1rem;
        font-size: 0.32rem;
        text-align: center;
      }

      .ios-popup-btn {
        border-radius: 0.2rem;
      }

      .ios-popup-item {
        color: #ff2200;
      }

      .ios-popup-item.disabled {
        color: #888888;
      }

      .ios-popup-title {
        color: #888888;
      }
    }
  }
</style>
