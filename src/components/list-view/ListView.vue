<template>
  <div class="list-view">
    <div ref="content" style="padding: 0;margin: 0;box-sizing: border-box;width: 100%;position: static;"
         :style="{minHeight: (scrollHeight) + 'px'}">
      <div class="load-top" v-show="!loading &&showLoadding">
        <van-loading type="spinner" size="0.6rem" :color="loadTag?$config.newQP || $config.blackTheme? '#F6CF32' : theme.color:'#c3c3c3'"></van-loading>
        <p class="load-info" :class="{'theme-color theme-color-yellow':loadTag}">{{loadTag?'松开':''}}{{topLoadText}}</p>
      </div>
      <div class="loading-top" v-show="loading&&loadTag==='top'">
        <van-loading type="circular" size="0.6rem" :color="theme.color"></van-loading>
      </div>
      <slot></slot>
      <div class="loading-down" v-show="loading&&loadTag==='down'">
        <van-loading type="circular" size="0.6rem" :color="theme.color"></van-loading>
    </div>
      <div class="load-down" v-show="!loading&&!noMore">
        <p class="load-info" :style="downLoadStyle" :class="{'theme-color theme-color-yellow':loadTag}">{{loadTag?'松开':''}}{{downLoadText}}</p>
        <van-loading type="spinner" size="0.6rem" :color="loadTag?$config.newQP || $config.blackTheme? '#F6CF32' : theme.color:'#c3c3c3'"></van-loading>
      </div>
      <div class="load-down" v-show="!loading&&noMore">
        <p class="load-info">没有更多</p>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import IScroll from 'iscroll/build/iscroll-probe'
import themes from '../../style/theme'

function checkDom (el, option) {
  let status = false
  if (!status && option.tagName && option.tagName.test(el.tagName)) status = true
  if (!status && option.className && option.className.test(el.className)) status = true
  return status
}

export default {
  name: 'ListView',
  props: {
    topLoadText: {
      type: String,
      default: '刷新数据'
    },
    showLoadding:{
      type:Boolean,
      default:true
    },
    downLoadText: {
      type: String,
      default: '加载更多'
    },
    downLoadStyle:{
      type: String,
      default: ''
    },
    noMore: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scroll: null,
      scrollHeight: 0,
      loadMoreHeight: 0,
      loading: false,
      loadTag: false,
      loadInited: false,
      useTransition:true
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
      if (this.scroll && !this.loadInited) {
        this.scroll.on('scroll', () => {
          if (!this.loading) {
            if (this.scroll.y > 0) {
              if (this.scroll.y > (this.loadMoreHeight * 0.9)) {
                this.loadTag = 'top'
              } else {
                this.loadTag = ''
              }
            } else if (this.scroll.y < this.scroll.maxScrollY) {
              if (this.scroll.y < this.scroll.maxScrollY - (this.loadMoreHeight * 0.9)) {
                this.loadTag = 'down'
              } else {
                this.loadTag = ''
              }
            }
          }
          /*var debug = {
            x:this.scroll.x,
            y:this.scroll.y,
            maxX:this.scroll.maxScrollX,
            maxY:this.scroll.maxScrollY,
            offsetHeight:this.scroll.scrollerHeight
          }
          this.$store.state.debugInfo = debug;*/
          this.$emit('on-scroll', this.scroll.y)
        })

        this.scroll.on('scrollEnd', () => {
          switch (this.loadTag) {
            case 'top':
              this.loading = true
              this.$emit('load-top')
              break

            case 'down':
              if (!this.noMore) {
                this.loading = true
                this.$emit('load-down')
              }
              break

            default:
          }

          this.$emit('on-scroll-end', this.scroll.y)
        })

        this.loadInited = true
      }
    },
    init () {
      this.scroll = new IScroll(this.$el, {
        click: false,
        useTransition:this.useTransition,
        disableMouse: false,
        mouseWheel: /(linux|win)/.test(window.navigator.platform.toString().toLowerCase()),
        // disablePointer: !/(linux|win)/.test(window.navigator.platform.toString().toLowerCase()),
        eventPassthrough: 'horizontal',
        preventDefault: true,
        // interactiveScrollbars: true,
        // scrollbars: true,
        // fadeScrollbars: true,
        deceleration: 0.0008,
        probeType: 2,
        preventDefaultException: {
          // tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/,
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
    loaded () {
      this.loading = false
      this.loadTag = ''
    },
    scrollToRefresh(){
      this.refresh();
    },
    refresh () {
      if (this.$el) {
        try {
          this.scrollHeight = parseFloat(document.defaultView.getComputedStyle(this.$el).height.toString().replace('px', ''))
        } catch (e) {
          this.scrollHeight = this.$el.clientHeight
        }
      }


      if (this.$el.scrollTo){
        this.$el.scrollTo(0, 0)
      } else{
        this.$el.scrollTop = 0
      }

      this.$nextTick(() => {
        if (this.scroll){
          this.scroll.refresh();
        } 
      })
    }
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
