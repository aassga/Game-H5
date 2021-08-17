<template>
  <div class="scroll-box">
    <div class="scroll-content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/javascript">
import IScroll from 'iscroll'

function checkDom (el, option) {
  let status = false
  if (!status && option.tagName && option.tagName.test(el.tagName)) status = true
  if (!status && option.className && option.className.test(el.className)) status = true
  return status
}

export default {
  name: 'ScrollBox',
  props: {
    direction: {
      type: String,
      default: 'vertical'
    },
    auto: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    contentStyle () {
      if (this.direction === 'vertical') {
        return {
          minHeight: this.auto ? 'auto' : ((this.height + Math.round(this.winWidth / 200)) + 'px'),
          width: '100%'
        }
      } else {
        return {
          // minWidth: this.auto ? 'auto' : ((this.width + Math.round(this.winWidth / 200)) + 'px'),
          minWidth: this.auto ? 'auto' : (this.width + 'px'),
          height: '100%'
        }
      }
    }
  },
  data () {
    return {
      scroll: null,
      height: 0,
      width: 0,
      winWidth: window.innerWidth
    }
  },
  mounted () {
    if (this.$el) {
      this.domResize.bind(this.$el, this.refresh.bind(this))
      this.domResize.bind(this.$el.childNodes[0], this.refresh.bind(this))

      this.scroll = new IScroll(this.$el, {
        useTransition: (this.$mobileDevice.osVersion.split('.')[0]>= 13 && this.$mobileDevice.osVersion.split('.')[1] >= 3) ? false : true,
        bindToWrapper: true,
        click: true,
        disableMouse: true,
        mouseWheel: /(linux|win)/.test(window.navigator.platform.toString().toLowerCase()),
        disablePointer: !/(linux|win)/.test(window.navigator.platform.toString().toLowerCase()),
        disableTouch: false,
        scrollY: this.direction === 'vertical',
        scrollX: this.direction === 'horizontal',
        eventPassthrough: this.direction === 'vertical' ? 'horizontal' : 'vertical',
        preventDefault: true,
        deceleration: 0.0008,
        preventDefaultException: {
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
          // className: /(^|\s)(scrollable|formfield|scrollable-box|selector-box)(\s|$)/
        }
      })

      this.refresh()

      this.$el.addEventListener('touchstart', () => {
        this.refresh()
      })

      this.$el.addEventListener('touchmove', evt => {
        let parent = evt.target
        let status = true
        this.$store.state.debugInfo = []
        while (parent.tagName !== 'BODY' && status) {
          if (checkDom(parent, this.scroll.options.preventDefaultException)) status = false
          else parent = parent.parentNode || parent.parentElement
        }
        if (status) {
          evt.preventDefault()
        }
      })
    }
  },
  beforeDestroy () {
    this.domResize.remove(this.$el)
    this.domResize.remove(this.$el.childNodes[0])
  },
  methods: {
    refresh () {
      if (this.$el) {
        this.height = this.$el.clientHeight
        this.width = this.$el.clientWidth

        this.$nextTick(() => {
          if (this.scroll) this.scroll.refresh()
        })
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .scroll-box {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    overflow: hidden;

    .scroll-content {
      display: table;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      overflow: hidden;
    }
  }
</style>
