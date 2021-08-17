<template>
  <div class="list-view">
    <div ref="content" style="padding: 0;margin: 0;box-sizing: border-box;width: 100%;position: static;">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/javascript">
import IScroll from 'iscroll/build/iscroll-probe'
import BScroll from "better-scroll";
import themes from '../../style/theme'

function checkDom (el, option) {
  let status = false
  if (!status && option.tagName && option.tagName.test(el.tagName)) status = true
  if (!status && option.className && option.className.test(el.className)) status = true
  return status
}

export default {
  name: 'scrollarea',
  props:{
    onDownMore:{
      type: Boolean,
      default: false
    },
    // 屏幕滚动阻力
    deceleration: {
      type: Number,
      default: 0.002,
    }
  },
  data () {
    return {
      scroll: null,
      scrollHeight: 0,
      loadMoreHeight: 0,
      useTransition:true,
    }
  },
  computed: {
    theme () {
      return themes.find(theme => theme.code === this.$store.state.main.theme) || {}
    }
  },
  watch: {
    loadMore () {
      this.initLoad()
    }
  },
  created () {
    this.loadMoreHeight = Math.round((window.innerWidth / 5))
    if(this.$mobileDevice.isIOS){
      this.useTransition = false;
    }
    if(this.$mobileDevice.osVersion.split('.')[0]>= 13 && this.$mobileDevice.osVersion.split('.')[1] >= 3){
      this.useTransition = false;
    }
  },
  mounted () {
    this.domResize.bind(this.$el, this.refresh.bind(this))
    this.$el.addEventListener('touchstart', evt => {
      this.refresh()
    }, false)

    this.init()
    this.initLoad()
  },
  methods: {
    initLoad () {
      this.scroll.on('scroll', () => {
        if(Math.abs(this.scroll.y) > this.scrollHeight - this.rem * 6) {
          this.$emit('changeShowReturnTop',true)
        }else {
          this.$emit('changeShowReturnTop',false)
        }
        this.loadTag = 'up'
           if (this.scroll.y <= this.scroll.maxScrollY) {
              this.loadTag = 'down'
            }
          this.$emit('on-scroll', this.scroll.y)
        })
        this.scroll.on('scrollStart', () => {
          this.scroll.stop();
        })
        this.scroll.on('scrollEnd', () => {
          if(this.loadTag === 'down' && this.onDownMore) {
            this.$emit('load-down')
          }
        })
    },
    init () {
      this.scroll = new BScroll(this.$el, {
        click: false,
        useTransition:this.useTransition,
        disableMouse: false,
        mouseWheel: /(linux|win)/.test(window.navigator.platform.toString().toLowerCase()),
        eventPassthrough: 'horizontal',
        preventDefault: true,
        deceleration: this.deceleration,
        probeType: 3,
        preventDefaultException: {
          className: /(^|\s)(van-tabs__wrap--scrollable|scrollable|formfield|scrollable-box|selector-box)(\s|$)/
        }
      })
      this.refresh()
      this.scroll.refresh()
      this.$nextTick(() => {
        this.refresh()
        this.scroll.refresh()
      })

      this.$el.addEventListener('touchmove', evt => {
        let parent = evt.target
        let status = true
        while (parent.tagName !== 'BODY' && status) {
          if (checkDom(parent, this.scroll.options.preventDefaultException)) status = false
          else parent = parent.parentNode || parent.parentElement
        }
        if (status) evt.preventDefault()
      })
    },
    refresh () {
      if (this.$el) {
        try {
          this.scrollHeight = parseFloat(document.defaultView.getComputedStyle(this.$el).height.toString().replace('px', ''))
        } catch (e) {
          this.scrollHeight = this.$el.clientHeight
        }
      }
      this.$nextTick(() => {
        if (this.scroll){
          this.scroll.refresh();
        } 
      })
    },
  },
  beforeDestroy () {
    this.domResize.remove(this.$el)
    if (this.scroll) this.scroll.destroy()
  }
}
</script>

<style type="text/less" lang="less" scoped>
  .list-view {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style>
