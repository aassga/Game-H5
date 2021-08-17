<template>
  <div
    class="xuanfu"
    id="moveDiv"
    @touchstart="down"
    @touchmove.prevent="move"
    @touchend="end"
    @click="clickHandle"
    :style="dragStyle"
  >
    <slot name="content" class="content"></slot>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "DateInterval",
  props: {
    w:{
      type: Number,
      default: ''
    },
    h:{
      type: Number,
      default: ''
    },
    x:{
      type: Number,
      default: ''
    },
    y:{
      type: Number,
      default: ''
    },
  },
  data() {
    return {
      flags: false,
      position: { x: 0, y: 0 },
      nx: "",
      ny: "",
      dx: "",
      dy: "",
      xPum: "",
      yPum: "",
      windowW: "",
      windowH: ""
    };
  },
  computed: {
    dragStyle() {
      return {
        height: this.h + 'rem',
        width: this.w + 'rem',
        left: this.x + 'rem',
        top: this.y + 'rem',
      }
    }
  },
  mounted() {
    this.windowW = window.innerWidth
    this.windowH = window.innerHeight
  },
  methods: {
    down() {
      this.flags = true;
      let touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.position.x = touch.clientX;
      this.position.y = touch.clientY;
      this.dx = moveDiv.offsetLeft;
      this.dy = moveDiv.offsetTop;
    },
    move() {
      if (this.flags) {
        let touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        this.xPum = this.dx + this.nx;
        this.yPum = this.dy + this.ny;
        if(this.yPum > 0 && this.yPum < this.windowH - this.h * this.rem) {
          moveDiv.style.top = this.yPum + "px";
        }
        if(this.xPum > 0 && this.xPum < this.windowW - this.w * this.rem) {
          moveDiv.style.left = this.xPum + "px";
        }
      }
    },
    //鼠标释放时候的函数
    end() {
      this.flags = false;
    },
    clickHandle() {
      this.$emit('clickHandle')
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
.xuanfu {
  z-index: 9999;
  position: fixed;
  .content {
    width: 100%;
    height: 100%;
    z-index: 999;
  }
}
</style>
