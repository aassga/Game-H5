<template>
  <scroll-box ref="scroll" class="scroll-selector" direction="horizontal">
    <ul class="list">
      <li class="item theme-bg-active" :class="{active:i===val}" v-for="(item, i) in list" :key="i" @click="onClick(item, i)">{{item}}</li>
    </ul>
  </scroll-box>
</template>

<script type="text/javascript">
export default {
  name: 'ScrollSelector',
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      type: Number,
      default: 0
    }
  },
  computed: {
    val: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    value: 'runAnimation'
  },
  methods: {
    onClick (item, i) {
      this.val = i
      this.$emit('on-item-click', item, i)
    },
    runAnimation () {
      const scrollBox = this.$refs['scroll']
      const nav = scrollBox.$el.childNodes[0].childNodes[0]
      if (nav && scrollBox) {
        const scroll = scrollBox.scroll
        const target = nav.childNodes[this.value]
        const width = scrollBox.$el.offsetWidth
        const scrollWidth = scroll.scrollerWidth
        const targetWidth = target.offsetWidth
        let  offsetLeft= 0;
        if(navigator.userAgent.includes('iPhone')){
         offsetLeft = target.offsetLeft - 385;
        }else{
         offsetLeft = target.offsetLeft;
        }
        let left = (offsetLeft + (targetWidth / 2)) - (width / 2)
        if (left < 0) left = 0
        else if (left > scrollWidth - width) left = scrollWidth - width
        scroll.scrollTo(-left, 0, 500)
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .scroll-selector {

    .list {
      white-space: nowrap;
      height: 0.7rem;
      padding: 0.1rem 0.2rem;
      display: flex;
      flex-wrap: nowrap;
      min-width: 100%;
      box-sizing: border-box;
      justify-content: space-around;
    }

    .item {
      font-size: 0.26rem;
      color: #555555;
      display: flex;
      white-space: nowrap;
      padding: 0 0.2rem;
      height: 0.5rem;
      overflow: hidden;
      flex-shrink: 0;
      border-radius: 0.05rem;
      font-weight: bold;
      justify-content: center;
      align-items: center;

      &.active {
        color: #FFFFFF;
        font-weight: bold;
      }
    }
  }
</style>
