<template>
  <div class="d-roll-wrapper">
    <ul
      ref="list"
      class="d-roll-list"
    >
      <li
        v-for="(item, i) of digitOffsetArr"
        :key="i"
        class="d-roll-item"
        :style="{ height: `${cellHeight}px` }"
      >
        <div
          class="d-roll-bar"
          :class="isK3 ? 'k3_roll_bar':''"
          v-html="innerUnitHtml"
          :style="getliStyle(item, i)"
        ></div>
      </li>
    </ul>
  </div>
</template>

<script>
import { Tween, easeToCubicMap, arrayFromCache, getHeight, supportCssCache, callExp } from '../util';

let rollLock = false;
let supportCss = supportCssCache;
const FRAME_TIME = 1000 / 60;
const defaultFlipStra = (before, next) => {
  if (next < before) {
    return true;
  }
  return false;
};

export default {
  name: 'DigitRoll',

  props: {
    rollDigits: {
      type: [String, Number ,Array],
      default: '00000000',
    },

    dur: {
      type: Number,
      default: 1000,
    },

    flipStra: {
      type: [Function, Boolean],
      default: null,
    },

    easeFn: {
      type: [String],
      default: 'Cubic.easeInOut',
    },
    isK3: {
      type: Boolean,
      default : false
    }
  },

  data() {
    const { rollDigits, flipStra } = this;
    const divList = arrayFromCache(10).map((n, i) => `<div class='digcl dig-${i}-${ this.isK3 ? 'k3' : (localStorage.theme ? localStorage.theme : (this.$config.home === 'vns' ? 'bluegreen' : 'default')) }'></div>`);
    let executeStra = null;

    if (typeof flipStra === 'boolean') {
      executeStra = () => flipStra;
    } else {
      executeStra = flipStra || defaultFlipStra;
    }

    return {
      digits: `${rollDigits}`,
      beforeDigits: '0',
      cellHeight: 0,
      maxDur: 0,
      innerUnitHtml: divList.concat(divList).join(''), // 2倍模板
      digitStatArr: [],
      digitOffsetArr: [],
      executeStra,
    };
  },

  watch: {
    rollDigits(value, oldVal) {
      if (rollLock) {
        return;
      }
      const oldLen = `${oldVal}`.length;
      const newLen = `${value}`.length;
      this.digits = `${value}`;

      if (oldLen !== newLen) {
        this.resetStat(newLen);
      }

      setTimeout(() => {
        this.traverseChar();
      }, 0);
    },
  },

  methods: {
    resetStat(len) {
      const newArr = arrayFromCache(len);
      this.digitOffsetArr = newArr.map(() => 0);
      this.digitStatArr = newArr.map(() => ({ figure: 0 }));
      this.beforeDigits = newArr.map(() => 0).join('');
    },

    getliStyle(item, i) {
      const transformPrefix = supportCss('transform');
      if (transformPrefix) {
        this.getliStyle = function getTransformStyle(tItem, ti) {
          const offset = tItem ? `${tItem}px` : '0px';
          const value = `translateY(${offset}) translateZ(0)`;
          const curStat = this.digitStatArr[ti];
          const easeFn = curStat.easeFn || this.easeFn;
          const transitionFunc = easeToCubicMap[easeFn] || easeFn;
          const msDur = curStat.dur || this.dur;
          // const sDurStr = `${msDur / 1000}s`;
          const sDurStr = `${3600-((ti+1) * 400)}ms`
          const transProperty = typeof transformPrefix !== 'boolean' ? `-${transformPrefix}-transform` : 'transform';
          const transStyles = !curStat.noTransition ? {
            transition: `${transProperty} ${sDurStr} ${transitionFunc}`,
          } : {};

          /** Vue会自动侦测并添加相应的前缀,无需自己添加属性前缀  */
          return {
            ...transStyles,
            transform: value,
          };
        };
      } else {
        this.getliStyle = function getMarginStyle(mItem) {
          const offset = mItem ? `${mItem}px` : '0px';

          return {
            marginTop: offset,
          };
        };
      }

      this.getliStyle(item, i);
    },

    getComplete(total) {
      let count = 0;
      const vm = this;
      return function completeRoll() {
        if (++count >= total) {
          vm.beforeDigits = `${vm.digits}`;
          setTimeout(() => {
            rollLock = false;
            vm.$emit('roll-finish');
          }, 4);
        }
      };
    },

    traverseChar(opts = null) {
      const vm = this;
      const { digitStatArr, digits, beforeDigits, executeStra } = vm;
      const completeRoll = vm.getComplete(digitStatArr.length);
      rollLock = true;
      vm.$emit('roll-start');

      digitStatArr.forEach((stat, i) => {
        let dis = 0;
        const before = beforeDigits.charAt(i);
        const next = digits.charAt(i);
        const opt = opts instanceof Array ? opts[i] : {};
        const optFlipStra = typeof opt.flipStra === 'boolean' ? () => opt.flipStra : opt.flipStra;
        const needFlip = optFlipStra ? optFlipStra(before, next) : executeStra(before, next);
        if (needFlip) {
          dis = (~~next + 10) - before;
          vm.digitStatArr[i].flip = true;
        } else {
          dis = next - before;
        }

        if (supportCss('transform')) {
          stat.noTransition = !!0;
          vm.beginCssRoll(dis, i, completeRoll, opt);
        } else {
          vm.beginRoll(dis, i, completeRoll, opt);
        }
      });
    },

    beginCssRoll(dis, i, cb, opt) {
      const vm = this;
      const transitionPrefix = supportCss('transition');
      const transitionEnd = (function whichTransitionEvent(prefix) {
        const pre = prefix.toLowerCase();
        if (typeof prefix === 'boolean' || pre === 'moz') {
          return 'transitionend';
        }
        return `${pre}TransitionEnd`;
      }(transitionPrefix));

      this.beginCssRoll = (aDis, ai, aCb, aOpt) => {
        const { cellHeight, digitStatArr, digitOffsetArr, dur: defaultDur } = vm;
        const curStat = digitStatArr[ai];
        const rollOffset = cellHeight * aDis;
        const beforeOffset = curStat.figure || 0;
        const prePageOffset = cellHeight * 10; // 单倍模板距离
        const $list = vm.$refs.list;
        const $curBar = $list.querySelector(`li:nth-child(${ai + 1}) .d-roll-bar`);

        if (rollOffset === 0) {
          aCb && aCb(i);
          return;
        }

        curStat.figure = beforeOffset - rollOffset;
        curStat.dur = aOpt.dur || defaultDur;

        vm.$set(digitOffsetArr, ai, beforeOffset - rollOffset);

        $curBar.addEventListener(transitionEnd, function transitionDone() {
          if (curStat.flip) {
            const overOffset = curStat.figure;
            curStat.figure = overOffset + prePageOffset;
            curStat.noTransition = !!1;
            curStat.flip = !!0;
          }

          vm.$set(digitOffsetArr, ai, curStat.figure);
          $curBar.removeEventListener(transitionEnd, transitionDone);
          aCb && aCb(i);
        });
      };

      this.beginCssRoll(dis, i, cb, opt);
    },

    beginRoll(dis, i, cb, opt) {
      const vm = this;
      const { cellHeight, digitStatArr, maxDur, dur: defaultDur } = vm;
      const start = 0;
      const rollOffset = cellHeight * dis;
      const dur = opt.dur || defaultDur;
      const judgeFinish = Math.max(dur, maxDur);
      const curStat = digitStatArr[i];
      const beforeOffset = curStat.figure || 0;
      const prePageOffset = cellHeight * 10;

      let now = 0;
      let easeFn = callExp(Tween, opt.easeFn || vm.easeFn);
      easeFn = easeFn || Tween.Cubic.easeInOut;

      function step() {
        const offset = Math.min(easeFn(now, start, rollOffset, dur), rollOffset);
        curStat.figure = beforeOffset - offset;

        if (now === judgeFinish && curStat.flip) {
          const overOffset = curStat.figure;
          curStat.figure = overOffset + prePageOffset;
          curStat.flip = !!0;
        }

        /** optimize combo one frame reflow by vue */
        if (i === digitStatArr.length - 1) {
          vm.digitOffsetArr = digitStatArr.map(item => item.figure);
        }

        if (now === judgeFinish) {
          cb && cb(i);
          return;
        }

        now += FRAME_TIME;

        if (now < judgeFinish) {
          requestAnimationFrame(step);
        } else {
          now = judgeFinish;
          requestAnimationFrame(step);
        }
      }

      step();
    },

    /** for user */
    setDigit(digit, opt) {
      const vm = this;
      let opts = null;
      if (rollLock) {
        return;
      }
      /** formate opts */
      if (typeof digit === 'string' || typeof digit === 'number') {
        vm.digits = `${digit}`;
        if (opt) {
          opts = arrayFromCache(vm.digits.length).map(() => opt);
        }
      } else if (digit instanceof Array) {
        vm.digits = digit.map(({ value, dur }) => {
          if (dur > vm.maxDur) {
            vm.maxDur = dur;
          }
          return value;
        }).join('');
        opts = digit;
      }
      if (vm.digits.length !== vm.beforeDigits.length) {
        vm.resetStat(vm.digits.length);
      }

      setTimeout(() => {
        vm.traverseChar(opts);
      }, 50);
    },
  },

  created() {
    this.resetStat(this.digits.length);
    /** 警告：单元测试设置，请勿自己设置，影响属性判断 */
    if (this.$attrs && this.$attrs.unitTest) {
      supportCss = (pro) => {
        if (this.$attrs.unitTest.supportCssTransForm) {
          return supportCssCache(pro);
        }
        return false;
      };
    }
  },

  mounted() {
    const $list = this.$refs.list;

    this.cellHeight = getHeight($list.querySelector('.d-roll-bar>div'));

    /** 警告：单元测试设置，请勿自己设置，影响正常计算 */
    if (!this.cellHeight && this.$attrs && this.$attrs.unitTest) {
      this.cellHeight = this.$attrs.unitTest.cellHeight;
    }

    this.traverseChar();
  },
};
</script>

<style>
  .d-roll-wrapper{
    /* margin: 20px auto; */
    width: 100%;
    margin-top: 0.06rem;

  }
  .d-roll-list{
    margin: 0 auto;
    padding: 0;
    text-align: center;
    display: flex;
    overflow: hidden;
  }
  .d-roll-list .d-roll-item{
    list-style: none;
    float: left;
    flex-grow: 1;
    overflow: hidden;
  }
  .d-roll-item>.d-roll-bar{
    backface-visibility: hidden;
    perspective: 1000;
  }
  .d-roll-item>.d-roll-bar>div{
    line-height: 0.32rem;
    height: 0.32rem;
    margin-right: 0.04rem;
    box-sizing: border-box !important;
  }
  .digcl{
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
  .k3_roll_bar div{
    height: 0.6rem !important;
  }
  .dig-0-k3{
    background-image: url('../../../assets/img/digitRoll/dig-0-k3.png');
  }
  .dig-1-k3{
    background-image: url('../../../assets/img/digitRoll/dig-1-k3.png');
  }
  .dig-2-k3{
    background-image: url('../../../assets/img/digitRoll/dig-2-k3.png');
  }
  .dig-3-k3{
    background-image: url('../../../assets/img/digitRoll/dig-3-k3.png');
  }
  .dig-4-k3{
    background-image: url('../../../assets/img/digitRoll/dig-4-k3.png');
  }
  .dig-5-k3{
    background-image: url('../../../assets/img/digitRoll/dig-5-k3.png');
  }
  .dig-6-k3{
    background-image: url('../../../assets/img/digitRoll/dig-6-k3.png');
  }
  .dig-7-k3{
    background-image: url('../../../assets/img/digitRoll/dig-7-k3.png');
  }
  .dig-8-k3{
    background-image: url('../../../assets/img/digitRoll/dig-8-k3.png');
  }
  .dig-9-k3{
    background-image: url('../../../assets/img/digitRoll/dig-9-k3.png');
  }


  .dig-0-default{
    background-image: url('../../../assets/img/digitRoll/dig-0-default.png');
  }
  .dig-1-default{
    background-image: url('../../../assets/img/digitRoll/dig-1-default.png');
  }
  .dig-2-default{
    background-image: url('../../../assets/img/digitRoll/dig-2-default.png');
  }
  .dig-3-default{
    background-image: url('../../../assets/img/digitRoll/dig-3-default.png');
  }
  .dig-4-default{
    background-image: url('../../../assets/img/digitRoll/dig-4-default.png');
  }
  .dig-5-default{
    background-image: url('../../../assets/img/digitRoll/dig-5-default.png');
  }
  .dig-6-default{
    background-image: url('../../../assets/img/digitRoll/dig-6-default.png');
  }
  .dig-7-default{
    background-image: url('../../../assets/img/digitRoll/dig-7-default.png');
  }
  .dig-8-default{
    background-image: url('../../../assets/img/digitRoll/dig-8-default.png');
  }
  .dig-9-default{
    background-image: url('../../../assets/img/digitRoll/dig-9-default.png');
  }

  .dig-0-red{
    background-image: url('../../../assets/img/digitRoll/dig-0-red.png');
  }
  .dig-1-red{
    background-image: url('../../../assets/img/digitRoll/dig-1-red.png');
  }
  .dig-2-red{
    background-image: url('../../../assets/img/digitRoll/dig-2-red.png');
  }
  .dig-3-red{
    background-image: url('../../../assets/img/digitRoll/dig-3-red.png');
  }
  .dig-4-red{
    background-image: url('../../../assets/img/digitRoll/dig-4-red.png');
  }
  .dig-5-red{
    background-image: url('../../../assets/img/digitRoll/dig-5-red.png');
  }
  .dig-6-red{
    background-image: url('../../../assets/img/digitRoll/dig-6-red.png');
  }
  .dig-7-red{
    background-image: url('../../../assets/img/digitRoll/dig-7-red.png');
  }
  .dig-8-red{
    background-image: url('../../../assets/img/digitRoll/dig-8-red.png');
  }
  .dig-9-red{
    background-image: url('../../../assets/img/digitRoll/dig-9-red.png');
  }

  .dig-0-deepred{
    background-image: url('../../../assets/img/digitRoll/dig-0-deepred.png');
  }
  .dig-1-deepred{
    background-image: url('../../../assets/img/digitRoll/dig-1-deepred.png');
  }
  .dig-2-deepred{
    background-image: url('../../../assets/img/digitRoll/dig-2-deepred.png');
  }
  .dig-3-deepred{
    background-image: url('../../../assets/img/digitRoll/dig-3-deepred.png');
  }
  .dig-4-deepred{
    background-image: url('../../../assets/img/digitRoll/dig-4-deepred.png');
  }
  .dig-5-deepred{
    background-image: url('../../../assets/img/digitRoll/dig-5-deepred.png');
  }
  .dig-6-deepred{
    background-image: url('../../../assets/img/digitRoll/dig-6-deepred.png');
  }
  .dig-7-deepred{
    background-image: url('../../../assets/img/digitRoll/dig-7-deepred.png');
  }
  .dig-8-deepred{
    background-image: url('../../../assets/img/digitRoll/dig-8-deepred.png');
  }
  .dig-9-deepred{
    background-image: url('../../../assets/img/digitRoll/dig-9-deepred.png');
  }

   .dig-0-yellow{
    background-image: url('../../../assets/img/digitRoll/dig-0-yellow.png');
  }
  .dig-1-yellow{
    background-image: url('../../../assets/img/digitRoll/dig-1-yellow.png');
  }
  .dig-2-yellow{
    background-image: url('../../../assets/img/digitRoll/dig-2-yellow.png');
  }
  .dig-3-yellow{
    background-image: url('../../../assets/img/digitRoll/dig-3-yellow.png');
  }
  .dig-4-yellow{
    background-image: url('../../../assets/img/digitRoll/dig-4-yellow.png');
  }
  .dig-5-yellow{
    background-image: url('../../../assets/img/digitRoll/dig-5-yellow.png');
  }
  .dig-6-yellow{
    background-image: url('../../../assets/img/digitRoll/dig-6-yellow.png');
  }
  .dig-7-yellow{
    background-image: url('../../../assets/img/digitRoll/dig-7-yellow.png');
  }
  .dig-8-yellow{
    background-image: url('../../../assets/img/digitRoll/dig-8-yellow.png');
  }
  .dig-9-yellow{
    background-image: url('../../../assets/img/digitRoll/dig-9-yellow.png');
  }

  .dig-0-purple{
    background-image: url('../../../assets/img/digitRoll/dig-0-purple.png');
  }
  .dig-1-purple{
    background-image: url('../../../assets/img/digitRoll/dig-1-purple.png');
  }
  .dig-2-purple{
    background-image: url('../../../assets/img/digitRoll/dig-2-purple.png');
  }
  .dig-3-purple{
    background-image: url('../../../assets/img/digitRoll/dig-3-purple.png');
  }
  .dig-4-purple{
    background-image: url('../../../assets/img/digitRoll/dig-4-purple.png');
  }
  .dig-5-purple{
    background-image: url('../../../assets/img/digitRoll/dig-5-purple.png');
  }
  .dig-6-purple{
    background-image: url('../../../assets/img/digitRoll/dig-6-purple.png');
  }
  .dig-7-purple{
    background-image: url('../../../assets/img/digitRoll/dig-7-purple.png');
  }
  .dig-8-purple{
    background-image: url('../../../assets/img/digitRoll/dig-8-purple.png');
  }
  .dig-9-purple{
    background-image: url('../../../assets/img/digitRoll/dig-9-purple.png');
  }
  

  .dig-0-green{
    background-image: url('../../../assets/img/digitRoll/dig-0-green.png');
  }
  .dig-1-green{
    background-image: url('../../../assets/img/digitRoll/dig-1-green.png');
  }
  .dig-2-green{
    background-image: url('../../../assets/img/digitRoll/dig-2-green.png');
  }
  .dig-3-green{
    background-image: url('../../../assets/img/digitRoll/dig-3-green.png');
  }
  .dig-4-green{
    background-image: url('../../../assets/img/digitRoll/dig-4-green.png');
  }
  .dig-5-green{
    background-image: url('../../../assets/img/digitRoll/dig-5-green.png');
  }
  .dig-6-green{
    background-image: url('../../../assets/img/digitRoll/dig-6-green.png');
  }
  .dig-7-green{
    background-image: url('../../../assets/img/digitRoll/dig-7-green.png');
  }
  .dig-8-green{
    background-image: url('../../../assets/img/digitRoll/dig-8-green.png');
  }
  .dig-9-green{
    background-image: url('../../../assets/img/digitRoll/dig-9-green.png');
  }

  .dig-0-ferrari{
    background-image: url('../../../assets/img/digitRoll/dig-0-ferrari.png');
  }
  .dig-1-ferrari{
    background-image: url('../../../assets/img/digitRoll/dig-1-ferrari.png');
  }
  .dig-2-ferrari{
    background-image: url('../../../assets/img/digitRoll/dig-2-ferrari.png');
  }
  .dig-3-ferrari{
    background-image: url('../../../assets/img/digitRoll/dig-3-ferrari.png');
  }
  .dig-4-ferrari{
    background-image: url('../../../assets/img/digitRoll/dig-4-ferrari.png');
  }
  .dig-5-ferrari{
    background-image: url('../../../assets/img/digitRoll/dig-5-ferrari.png');
  }
  .dig-6-ferrari{
    background-image: url('../../../assets/img/digitRoll/dig-6-ferrari.png');
  }
  .dig-7-ferrari{
    background-image: url('../../../assets/img/digitRoll/dig-7-ferrari.png');
  }
  .dig-8-ferrari{
    background-image: url('../../../assets/img/digitRoll/dig-8-ferrari.png');
  }
  .dig-9-ferrari{
    background-image: url('../../../assets/img/digitRoll/dig-9-ferrari.png');
  }
  
  .dig-0-gold{
    background-image: url('../../../assets/img/digitRoll/dig-0-gold.png');
  }
  .dig-1-gold{
    background-image: url('../../../assets/img/digitRoll/dig-1-gold.png');
  }
  .dig-2-gold{
    background-image: url('../../../assets/img/digitRoll/dig-2-gold.png');
  }
  .dig-3-gold{
    background-image: url('../../../assets/img/digitRoll/dig-3-gold.png');
  }
  .dig-4-gold{
    background-image: url('../../../assets/img/digitRoll/dig-4-gold.png');
  }
  .dig-5-gold{
    background-image: url('../../../assets/img/digitRoll/dig-5-gold.png');
  }
  .dig-6-gold{
    background-image: url('../../../assets/img/digitRoll/dig-6-gold.png');
  }
  .dig-7-gold{
    background-image: url('../../../assets/img/digitRoll/dig-7-gold.png');
  }
  .dig-8-gold{
    background-image: url('../../../assets/img/digitRoll/dig-8-gold.png');
  }
  .dig-9-gold{
    background-image: url('../../../assets/img/digitRoll/dig-9-gold.png');
  }

  .dig-0-bluegreen{
    background-image: url('../../../assets/img/digitRoll/dig-0-bluegreen.png');
  }
  .dig-1-bluegreen{
    background-image: url('../../../assets/img/digitRoll/dig-1-bluegreen.png');
  }
  .dig-2-bluegreen{
    background-image: url('../../../assets/img/digitRoll/dig-2-bluegreen.png');
  }
  .dig-3-bluegreen{
    background-image: url('../../../assets/img/digitRoll/dig-3-bluegreen.png');
  }
  .dig-4-bluegreen{
    background-image: url('../../../assets/img/digitRoll/dig-4-bluegreen.png');
  }
  .dig-5-bluegreen{
    background-image: url('../../../assets/img/digitRoll/dig-5-bluegreen.png');
  }
  .dig-6-bluegreen{
    background-image: url('../../../assets/img/digitRoll/dig-6-bluegreen.png');
  }
  .dig-7-bluegreen{
    background-image: url('../../../assets/img/digitRoll/dig-7-bluegreen.png');
  }
  .dig-8-bluegreen{
    background-image: url('../../../assets/img/digitRoll/dig-8-bluegreen.png');
  }
  .dig-9-bluegreen{
    background-image: url('../../../assets/img/digitRoll/dig-9-bluegreen.png');
  }

  .dig-0-amethyst{
    background-image: url('../../../assets/img/digitRoll/dig-0-amethyst.png');
  }
  .dig-1-amethyst{
    background-image: url('../../../assets/img/digitRoll/dig-1-amethyst.png');
  }
  .dig-2-amethyst{
    background-image: url('../../../assets/img/digitRoll/dig-2-amethyst.png');
  }
  .dig-3-amethyst{
    background-image: url('../../../assets/img/digitRoll/dig-3-amethyst.png');
  }
  .dig-4-amethyst{
    background-image: url('../../../assets/img/digitRoll/dig-4-amethyst.png');
  }
  .dig-5-amethyst{
    background-image: url('../../../assets/img/digitRoll/dig-5-amethyst.png');
  }
  .dig-6-amethyst{
    background-image: url('../../../assets/img/digitRoll/dig-6-amethyst.png');
  }
  .dig-7-amethyst{
    background-image: url('../../../assets/img/digitRoll/dig-7-amethyst.png');
  }
  .dig-8-amethyst{
    background-image: url('../../../assets/img/digitRoll/dig-8-amethyst.png');
  }
  .dig-9-amethyst{
    background-image: url('../../../assets/img/digitRoll/dig-9-amethyst.png');
  }
</style>
