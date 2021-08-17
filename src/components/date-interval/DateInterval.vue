<template>
  <ul class="select-box">
    <li v-for="(item, i) in list" :key="item.label"
        class="theme-bg-active" :class="{item:true,active:value===i}"
        @click="$emit('input', i) && $emit('update:date', item)">{{item.label}}
    </li>
  </ul>
</template>

<script type="text/javascript">
import dayJs from 'dayjs'

export default {
  name: 'DateInterval',
  props: {
    date: {
      type: Object,
      default: null
    },
    value: {
      type: Number,
      default: 0
    },
    default: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default () {
        return [
          {
            label: '本周',
            start: dayJs().set('day', dayJs().get('day') ? 1 : -6).format('YYYY-MM-DD'),
            end: dayJs().format('YYYY-MM-DD')
          },
          {
            label: '上周',
            start: dayJs().set('day', dayJs().get('day') ? 1 : -6).subtract(7, 'day').format('YYYY-MM-DD'),
            end: dayJs().set('day', dayJs().get('day') ? 0 : -7).format('YYYY-MM-DD')
          },
          {
            label: '本月',
            start: dayJs().set('date', 1).format('YYYY-MM-DD'),
            end: dayJs().format('YYYY-MM-DD')
          },
          {
            label: '上月',
            start: dayJs().set('date', 1).subtract(1, 'month').format('YYYY-MM-DD'),
            end: dayJs().set('date', 1).subtract(1, 'day').format('YYYY-MM-DD')
          }
        ]
      }
    }
  },
  data () {
    return {}
  },
  mounted () {
    if (this.default && !this.value) {
      this.$emit('update:date', this.list[this.value])
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .select-box {
    width: 100%;
    display: flex;
    justify-content: space-around;
    list-style: none;
    background-color: #fff;
    height: 0.88rem;
    line-height: 0.88rem;
    align-items: center;

    .item {
      color: #333333;
      font-size: 0.349rem;
      line-height: 0.44rem;
      padding: 0.1rem 0.33rem;
      margin: 0.16rem 0;
      display: inline-block;

      &.active {
        border-radius: 0.2rem;
        color: #FFFFFF;
      }
    }
  }
</style>
