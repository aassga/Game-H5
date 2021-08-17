<template>
  <div v-transfer-dom :class="{dialog:true,show}" v-show="value||show||domShow">
    <div class="dialog-mask" v-show="showMask&&show" @click="onMaskClick"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PubDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    showMask: {
      type: Boolean,
      default: true
    },
    maskClose: {
      type: Boolean,
      default: false
    },
    animationTime: {
      type: Number,
      default: 400
    }
  },
  data () {
    return {
      show: false,
      domShow: false
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.domShow = this.value
        this.$nextTick(() => {
          setTimeout(() => {
            this.show = this.value
          })
        })
      } else {
        this.$nextTick(() => {
          this.show = this.value
          setTimeout(() => {
            this.domShow = this.value
          }, this.animationTime)
        })
      }
    }
  },
  created () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.show = this.value
      })
    })
  },
  methods: {
    hide () {
      this.show = false
      this.$nextTick(() => {
        setTimeout(() => {
          this.$emit('input', false)
        })
      })
    },
    onMaskClick () {
      if (this.maskClose) {
        this.hide()
      }
    }
  }
}
</script>

<style type="text/css" lang="less">
  .dialog {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    display: block;
    box-sizing: border-box;
    z-index: 999;

    &-mask {
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      display: block;
      box-sizing: border-box;
      background-color: rgba(0, 0, 0, 0.5);
    }

    &-content {
      width: 100%;
      padding: 0.4rem;
      text-align: center;
      color: #000;
      font-size: 0.32rem;
      box-sizing: border-box;
    }
  }
</style>
