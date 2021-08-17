<template>
  <section class="lottery-bet-input-box number-font" :class="{'cocos-box' : $route.query.cocos}" v-if="way">
    <transition :name="show?'slide-up':'slide-down'">
      <div class="lottery-bet-input-div" v-show="show" :style="{height: boxHeight+'px'}"></div>
    </transition>
    <div :style="{height:$store.state.key.height+'px'}" v-show="$store.state.key.target===$refs.input"></div>

    <!-- 快三-->
    <div ref="input-box" class="lottery-bet-input-flex lottery-bet-input-flex-k3" v-if="series==='10011'" :style="[keyBoardAnimationStyle,positionStyle]">
      <transition :name="show?'slide-up':'slide-down'">
        <div class="lottery-bet-input theme-border theme-main-bg-5" v-show="show">
          <div class="code-row theme-border-color-1">
            <span class="label theme-color-white">当前选号</span>
            <span class="num-list theme-color-yellow-2">{{codeStr}}</span>
          </div>

          <div class="input-row-k3">
            <span class="label theme-color-white">每注金额</span>
            <input ref="input" class="input theme-color-white theme-main-bg-5 theme-border-1px" type="number" v-model="money" v-number-keyboard="8">
            <span class="label theme-color-white" v-if="money">最高可中<i class="number-font theme-color-yellow-2" style="color: #ffaf36">{{maxWin}}</i>元</span>
            <span class="label theme-color-white" v-else>请输入要投注的金额</span>
          </div>
        </div>
      </transition>
      <div class="info-row" :class="{'theme-gradient-bg':$config.blush}">
        <span class="btn-clear theme-color-yellow-2" @click="clear">清空</span>
        <p class="info">共<i class="number-font">{{orderCount}}</i>注<span v-if="orderMoney">,<i class="number-font">{{orderMoney}}</i>元</span></p>
        <button class="btn-submit theme-color-black theme-yellow-bg-2" @click="onOrder">马上投注</button>
      </div>
    </div>

    <div ref="input-box" :style="positionStyle" class="lottery-bet-input-flex" v-else>
      <transition :name="show?'slide-up':'slide-down'">
        <div class="lottery-bet-input theme-border" v-show="show" :style="keyBoardAnimationStyle">
          <div class="chip-row theme-main-bg-5 theme-border-color-1">
            <button class="chip-btn-item btn-item theme-color theme-bg-active theme-border-active theme-gradient-bg-2 theme-color-white theme-border-1px" @touchstart="chipClick(v,i)" v-for="(v,i) in chip" :key="'btn'+i">{{v}}</button>
            <button class="btn-item theme-color btn-edit theme-gradient-bg-2 theme-color-white theme-border-1px" @click="onEditChip">编辑筹码</button>
          </div>
          <div class="input-row theme-header-bg">
            <span class="btn-clear" @click="clear"><i class="icon iconfont h5-icon-delbet_icon font"></i><i>清除</i></span>
            <input ref="input" type="number" class="input theme-main-bg-7 theme-color-white" v-model="money" v-number-keyboard="8" placeholder="请输入金额">
            <button class="btn-submit theme-bg theme-yellow-bg-2 theme-color-black" @click="onOrder">立即投注</button>
          </div>
        </div>
      </transition>
    </div>

    <pub-dialog v-model="chipEditing" style="z-index: 9999">
      <div class="editor-box theme-gradient-bg-4">
        <h4 class="editor-header theme-after-border-color theme-color-white">预设金额</h4>
        <ul class="editor-body">
          <li class="editor-item" v-for="(c, i) in editChip" :key="i">
            <input class="input theme-border-1px theme-color-white" type="tel" v-model="editChip[i]" @blur="onChipBlur(i)" @focus="onChipFocus(i)" placeholder="请输入金额"/>
          </li>
        </ul>
        <footer class="editor-footer theme-after-border-color">
          <a href="javascript:void(0)" class="btn btn-no theme-color theme-border theme-border-yellow theme-color-yellow" :class="[{'theme-header-bg' :$config.blackTheme},{'theme-main-bg' :$config.blush}]" @click="onNo">取消</a>
          <a href="javascript:void(0)" class="btn btn-ok theme-bg theme-yellow-bg-2 theme-color-black" @click="onSave">确定</a>
        </footer>
      </div>
    </pub-dialog>
    <div class="mask" v-show="showOrderList" style="position: fixed; z-index:95; top: 0; right: 0; left: 0;bottom: 0;background: rgba(0, 0, 0, 0.1);"></div>
    <vux-popup class="lottery-order-box" :show-mask="false"  :style="[orderListStyle,positionStyle]" :close-on-click-overlay="false" @hide-on-blur="showOrderList=$store.state.key.show"
               v-model="showOrderList" position="bottom" get-container="body"  :class="[{'lottery-order-box-k3':series==='10011' && !$config.blackTheme && !$config.blush}]" @closed="orderChanged=false">
      <header class="header-box theme-main-bg-5 theme-border-color">
        <h4 class="lottery-order-title theme-color-white">下注清单</h4>
      </header>
      <!--      <scroll-box class="lottery-order-list-box" auto>-->
      <scroll-box ref="order" class="lottery-order-list-box theme-main-bg-5" :style="{maxHeight:(($store.state.key.show?3:6)*0.8)+'rem'}" auto>
        <ul class="lottery-order-list" v-if="isOnlyOne">
          <li class="lottery-order-item theme-border-color" v-for="(order, i) in newLotteryList" :key="i">
            <span class="lottery-order-item-code theme-color-white">{{order.ball=='二同复选'?'二同':order.ball}} - {{order.code}}</span>
            <span class="lottery-order-item-odds theme-color-white">赔率:{{order.odds}}</span>
            <span class="theme-color rmb theme-color-yellow-2">¥</span>
            <input
              :ref="'orderList'+i"
              :class="{
              'input-red':(isNaN(parseFloat(order.money))||parseFloat(order.money)<=0||parseFloat(order.money)>parseFloat(limit['lotteryBetMax'])) &&series!=='10011',
              'input-yellow':(isNaN(parseFloat(order.money))||parseFloat(order.money)<=0||parseFloat(order.money)>parseFloat(limit['lotteryBetMax'])) &&series==='10011'
              }"
              class="input number-font theme-color-white" v-model="order.money" type="number" v-number-keyboard="7" @focus="orderFocus(i)" @input="orderInput(i)">
            <span :style="{visibility:orderList.length>1?'visible':'hidden'}" @click="onOrderDelete(i)"
                  class="key-no-hide lottery-order-item-delete theme-color icon iconfont h5-icon-guanbi theme-color-yellow-2"></span>
          </li>
        </ul>
        <div class="lottery-order-list lottery-order-list-1 " v-else-if="orderList.length === 1" :class="{'lotter-lhc-box':series == '10010' && ['连码','全不中'].includes(way.big) }">
          <div v-if="this.$route.params.series=='10010' && ['连肖','连尾','合肖'].includes(this.way.big)" class="lhLottery-item">
            <div class="oder-item">
              <span class="name theme-color-white">{{this.way.big}} - {{orderList[0].code}}</span>
              <span v-for="(order, i) in orderList" :key="i" class="num">
                <span class="odds theme-color-white">赔率:{{order.odds}}</span>
                <span class="theme-color rmb theme-color-yellow-2" style="margin-left:0.7rem;font-weight:normal">¥</span>
                <input :ref="'orderList'+i" :class="{'input-red':(isNaN(parseFloat(order.money))||parseFloat(order.money)>parseFloat(limit['lotteryBetMax']))}"
                    class="input number-font theme-color-white" v-model="order.money" type="number" v-number-keyboard="7" @input="orderInput(i)">
              </span>
            </div>
          </div>
           <div v-else class="lottery-item" >
            <p class="lottery-order-item-ball theme-color-white">{{orderList[0].ball}}</p>
            <p class="lottery-order-item-code lottery-order-item-code theme-color-white">【<span class="lianma_list" style="padding: 0 0.05rem;" v-for="(kindex ,i) in ((orderList[0].code)).split(',')" :key="i">{{kindex}}</span>】</p>
            <p class="lottery-order-item" style="border-bottom:0;margin-top:0.15rem" v-for="(order, i) in orderList" :key="i">
              <span class="lottery-order-item-odds theme-color-white">赔率:{{order.odds}}</span>
              <span class="theme-color rmb theme-color-yellow-2">¥</span>
              <input :ref="'orderList'+i" :class="{'input-red':(isNaN(parseFloat(order.money))||parseFloat(order.money)>parseFloat(limit['lotteryBetMax']))}"
                    class="input number-font theme-color-white" v-model="order.money" type="number" v-number-keyboard="7" @input="orderInput(i)">
            </p>
          </div>
        </div>
      </scroll-box>
      <div class="lottery-order-all theme-main-bg-5 theme-color-white">
        <p>共计:<span class="theme-color number-font theme-color-yellow-2">{{orderCount}}</span>注,
          <span v-if="isNaN(orderMoney)||orderList.some(o => parseFloat(o.money) <= 0)" :class="{'red':series!=='10011','yellow':series==='10011'}">请输入正确金额</span>
          
          <span class='red' v-else-if="orderList.some(o => parseFloat(o.money) > parseFloat(limit['lotteryBetMax']))" >超出单注限额</span>
          <span class='red' v-else-if="banlanceSur">余额不足</span>
          <span v-else>下注金额<span class="theme-color number-font">{{orderMoney}}</span>元</span>
        </p>
      </div>
      <footer class="active-box" :class="[{'theme-header-bg' :$config.blackTheme || $config.newQP},{'theme-gradient-bg-4' :$config.blush}]">
        <button class="btn-action btn-action-cancel theme-color-white theme-main-bg-7" @click="onBetCancel">取消</button>
        <button class="btn-action btn-action-commit theme-bg theme-yellow-bg-2 theme-color-black" @click="onSubmit">确认</button>
      </footer>
    </vux-popup>
       <!--下注中-->
      <!-- <vux-dialog :show="submitting"> -->
        <vux-loading :show="submitting" text="下注中" v-transfer-dom></vux-loading>
      <!-- </vux-dialog> -->
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'LotteryBetInput',
  props: {
    code: {
      type: Array,
      required: true
    },
    ball: {
      type: Array,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    series: {
      type: String,
      required: true
    },
    way: {
      type: Object,
      default: null
    },
    ballList: {
      type: Array,
      default () {
        return []
      }
    },
    tabIndex: {
      type: Number,
      default: 0
    },
    result: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      show: false,
      boxHeight: 0,
      chip: [],
      editChip: [],
      chipFocus: [],
      chipEditing: false,
      oldChip: [],
      maxChip: 50000,
      money: '',
      oldMoney:0,
      orderList: [],
      tempOrderList: [],
      showOrderList: false,
      submitting: false,
      orderChanged: false,
      isDeleteStatus:false,
      banlanceSur:false
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
    orderListStyle () {
      if (this.$store.state.key.show) {
        return {
          transitionTimingFunction:'cubic-bezier(1,1,1,1)',
          transform: `translate3d(0, ${0 - this.$store.state.key.height}px, 0)`
        }
      } else {
        return {}
      }
    },
    changeMoney() {
　　　　return this.orderList;
　　},
    limit () {
      return this.$store.state.main.config ? (this.$store.state.main.config.limit || {}) : {}
    },
    newLotteryList(){
      let newLotteryList = this.orderList.map(order=>{
        if (this.series === '10008' && ['龙', '虎'].includes(order.code)) {
          switch (order.ball) {
            case '冠军':
              order.ball = '1V10'
              break
            case '亚军':
              order.ball = '2V9'
              break
            case '第三名':
              order.ball = '3V8'
              break
            case '第四名':
              order.ball = '4V7'
              break
            case '第五名':
              order.ball = '5V6'
              break
            case '第六名':
              order.ball = '5V6'
              break
            case '第七名':
              order.ball = '4V7'
              break
            case '第八名':
              order.ball = '3V8'
              break
            case '第九名':
              order.ball = '2V9'
              break
            case '第十名':
              order.ball = '1V10'
              break
          }
        }
        return order
      })
      return newLotteryList
    },
    keyBoardAnimationStyle () {
      if (this.$store.state.key.target === this.$refs.input) {
        return {
          transform: 'translateY(' + (-this.$store.state.key.height) + 'px)'
        }
      } else {
        return {}
      }
    },
    orderCount () {
      if (this.way && this.way.big === '连码') {
        let count = 0

        const small = this.way.items[this.tabIndex]
        let n
        switch (small.small.toString().substr(0, 1)) {
          case '特':
          case '二':
            n = 2
            break

          case '三':
            n = 3
            break

          case '四':
            n = 4
            break
        }

        if (this.code.length >= n && this.code.length <= 10) {
          const orderList = []
          const ball = this.code[0].ball
          const odds = this.code[0].odds
          const playway = this.code[0].playway

          const task = function (arr, index) {
            if (index < n) {
              for (let i = ((arr[index - 1] + 1) || 0); i < this.code.length; i++) {
                const newArr = [...arr]
                newArr[index] = i
                task(newArr, index + 1)
              }
            } else {
              const code = []
              arr.forEach(i => {
                code.push(this.code[i].code)
              })
              orderList.push({
                code: code.join(','),
                name: code.join(','),
                money: 0,
                ball,
                odds,
                playway
              })
            }
          }.bind(this)
          task([], 0)
          count = orderList.length
        }
        return count
      } else {
        if(this.way.big == '快捷') return this.orderList.length || this.tempOrderList.length;
        else  return this.tempOrderList.length || this.orderList.length;
      }
    },
    orderMoney () {
      // let orderList = this.orderList
      // if (this.orderList.length) orderList = this.orderList;
      // if (this.tempOrderList.length) orderList = this.tempOrderList;
      // if (this.way && this.way.big === '连码' && orderList[0]) {
      //   return this.orderCount * parseInt(orderList[0].money)
      // } else return orderList.map(order => parseInt(order.money)).reduce((prev, v) => prev + v, 0)
      let orderList;
      if(this.way.big == '快捷'){
        orderList = this.orderList
        if (!orderList.length) orderList = this.tempOrderList
      }else{
        orderList = this.tempOrderList
        if (!orderList.length) orderList = this.orderList;
      }
      if (this.way && this.way.big === '连码' && orderList[0]) {
        return this.orderCount * parseInt(orderList[0].money)
      } else return this.orderList.map(order => parseInt(order.money)).reduce((prev, v) => prev + v, 0)
    },
    codeStr () {
      if(this.way && this.way.small == '三不同'){
        const len = this.sortBall.length
        const ball = this.way.small
        let orderSetList = []
        for (let i = 0; i <= len - 3; i++) {
          for (let j = i + 1; j <= len - 2; j++) {
            for (let k = j + 1; k < len; k++) {
              const code = '' + this.sortBall[i] + this.sortBall[j] + this.sortBall[k]
              orderSetList.push(code)
            }
          }
        }
        return orderSetList.join(' ')
      }else if(this.way && this.way.small == '二不同'){
        const len = this.sortBall.length
        const ball = this.way.small
        let orderSetList = []
        for (let i = 0; i <= len - 2; i++) {
          for (let j = i + 1; j < len; j++) {
            const code = '' + this.sortBall[i] + this.sortBall[j]
            orderSetList.push(code)
          }
        }
        return orderSetList.join(' ')
      }
      else{
        return this.sortCode.map(code => code.code).join(' ') || this.sortBall.join(' ')
      }
    },
    maxWin () {
      let maxWin = 0
      if (this.series === '10011') {
        let maxOrder
        switch (this.way.small) {
          case '点数':
            for (let i = 3; i <= 18; i++) {
              let temp = 0
              const numOrder = this.tempOrderList.find(
                order => order.code.toString() === i.toString()
              )
              const dxOrder = this.tempOrderList.find(
                order => order.code.toString() === (i < 11 ? '小' : '大')
              )
              const dsOrder = this.tempOrderList.find(
                order => order.code.toString() === (i % 2 ? '单' : '双')
              )

              if (numOrder) {
                temp +=
                    parseFloat(numOrder.money) * parseFloat(numOrder.odds)
              }
              if (dxOrder) { temp += parseFloat(dxOrder.money) * parseFloat(dxOrder.odds) }
              if (dsOrder) { temp += parseFloat(dsOrder.money) * parseFloat(dsOrder.odds) }

              if (temp > maxWin) maxWin = temp
            }

            break

          case '三同':
          case '三同通选':
          case '三连通选':
          case '三不同':
          case '三同连选':
          case '二同':
          case '二同复选':
          case '二不同':
          case '二同单选':
            this.tempOrderList.forEach(order => {
              if (
                !maxOrder ||
                  parseFloat(order.odds) > parseFloat(maxOrder)
              ) {
                maxOrder = order
              }
            })
            if (maxOrder) {
              maxWin += parseFloat(maxOrder.odds) * maxOrder.money
            }
            break
        }
      }
      if (maxWin) maxWin = ((maxWin * 100) / 100).toFixed(2)
      return maxWin
    },
    sortBall () {
      const arr = JSON.copyObj(this.ball)

      if (this.ball.length > 1) {
        if (this.series === '10011' && this.way && ['三不同', '二不同', '二同单选'].includes(this.way.small)) {
          arr.sort()
        } else {
          for (let i = 0; i < this.ball.length - 1; i++) {
            for (let j = i + 1; j < this.ball.length; j++) {
              if (this.ballList.indexOf(arr[i]) > this.ballList.indexOf(arr[j])) {
                const temp = arr[i]
                arr[i] = arr[j]
                arr[j] = temp
              }
            }
          }
        }
      }
      return arr
    },
    sortCode () {
      const map = {
        '大': -6,
        '小': -5,
        '单': -4,
        '双': -3,
        '龙': -2,
        '虎': -1
      }

      const arr = JSON.copyObj(this.code)

      if (this.code.length > 1) {
        for (let i = 0; i < this.code.length - 1; i++) {
          for (let j = i + 1; j < this.code.length; j++) {
            const i1 = map[arr[i].code.toString()[0]] || parseInt(arr[i].code)
            const i2 = map[arr[j].code.toString()[0]] || parseInt(arr[j].code)

            if (i1 > i2) {
              const temp = arr[i]
              arr[i] = arr[j]
              arr[j] = temp
            }
          }
        }
      }

      return arr
    },
    isOnlyOne () {
      return this.way && !(this.series === '10010' && ['连码', '连肖', '连尾', '合肖', '全不中'].includes(this.way.big))
    }
  },
  watch: {
    chipEditing () {
      if (this.chipEditing) {
        this.editChip = JSON.copyObj(this.chip)
        this.oldChip = JSON.copyObj(this.chip)
      }
    },
    code: 'checkCode',
    ball: 'checkCode',
    way: 'checkCode',
    money () {
      this.orderChanged = true
      this.initMoney()
    },
    orderMoney(){
      if(parseFloat(this.orderMoney) &&parseFloat(this.orderMoney)>this.$store.state.user.userInfo.balance) this.banlanceSur = true
      else this.banlanceSur = false 
    },
    showOrderList(){
      this.isDeleteStatus = this.showOrderList
    }
  },
  created () {
    if (this.$store.state.config) {
    }
    try {
      let chip = JSON.parse(localStorage['chip'])
      if (Object.prototype.toString.call(chip) !== '[object Array]') {
        this.oldChip = this.chip = [50, 500, 1000, 10000]
        localStorage['chip'] = JSON.stringify(this.chip)
      } else {
        chip = chip.map(num => parseInt(num))
        chip.sort((v1, v2) => v1 - v2)
        this.oldChip = this.chip = chip.map(num => num > this.maxChip ? this.maxChip : num)
      }
    } catch (e) {
      this.oldChip = this.chip = [50, 500, 1000, 10000]
      localStorage['chip'] = JSON.stringify(this.chip)
    }
  },
  mounted () {
    document.body.id = 'lotterBetPage'
    this.domResize.bind(this.$refs['input-box'], () => {
      if (this.$refs['input-box']) {
        this.boxHeight = this.$refs['input-box'].clientHeight
      }
    })
  },
  destroyed(){
    document.body.id = ''
  },
  beforeDestroy () {
    this.domResize.remove(this.$refs['input-box'])
  },
  methods: {
    chipClick(val,index){
      //下注金额不能大于最大下注金额
      if(this.money){
        if(parseFloat(this.money) < parseFloat(this.limit['lotteryBetMax'])){
          this.money = parseFloat(this.money)+parseFloat(val);
        }
      }else{
        this.money = parseFloat(val);
      }
      var arr = document.getElementsByClassName("chip-btn-item");
      for(var i=0;i<arr.length;i++){
        arr[i].classList.remove("active");
        arr[i].classList.remove("theme-border-yellow");
        
      }
      arr[index].classList.add("active");
      arr[index].classList.add("theme-border-yellow");
    },
    orderFocus (index) {
      if (this.orderCount > 3) {
        setTimeout(() => {
          if (this.$refs.order && this.$refs.order.scroll) {
            this.$refs.order.scroll.scrollTo(0, -this.rem * (index ? index - 1 : index) * 0.8, 300)
          }
        }, 0)
      }
    },
    orderInput(i){
      let money=  this.$refs['orderList'+i][0].value
      this.tempOrderList.forEach((item,index)=>{
        if(index == i) item.money = money;
      })
    },
    onSubmit () {
      if (this.orderList.length && this.result && this.result['issue'] && !this.submitting) {
        // if (this.orderMoney > 0 && this.orderList.every(o => parseFloat(o.money) > 0)) {
          let code = []

          if (!this.isOnlyOne) {
            this.orderList[0].code.toString().split(',').forEach(c => {
              code.push({
                attach: this.orderList[0].attach,
                ball: this.orderList[0].ball,
                code: c,
                money: this.orderList[0].money,
                odds: this.orderList[0].odds,
                playway: this.orderList[0].playway
              })
            })
          } else if (this.way.items && this.way.items[this.tabIndex].small === '特码包三') {
            this.code.forEach(item => {
              code.push({
                attach: '',
                ball: item.ball,
                code: item.code,
                money: parseInt(this.orderMoney),
                odds: item.odds,
                playway: item.playway
              })
            })
          } else {
            code = JSON.copyObj(this.orderList)
            code.forEach(order => {
              order.odds = order.odds.toString()
              order.money = order.money.toString()
              if (this.series === '10008' && ['龙', '虎'].includes(order.code)) {
                switch (order.ball) {
                  case '冠军':
                    order.ball = '1V10'
                    break
                  case '亚军':
                    order.ball = '2V9'
                    break
                  case '第三名':
                    order.ball = '3V8'
                    break
                  case '第四名':
                    order.ball = '4V7'
                    break
                  case '第五名':
                    order.ball = '5V6'
                    break
                  case '第六名':
                    order.ball = '5V6'
                    break
                  case '第七名':
                    order.ball = '4V7'
                    break
                  case '第八名':
                    order.ball = '3V8'
                    break
                  case '第九名':
                    order.ball = '2V9'
                    break
                  case '第十名':
                    order.ball = '1V10'
                    break
                }
              }
            })
          }
          const data = {
            lotteryId: this.id,
            issue: this.result.issue,
            rebate: 0,
            code
          }
          this.showOrderList = false
          this.submitting = true
          this.$store.dispatch('lottery/submit', {
            data,
            callback: (res, err) => {
              this.submitting = false
              if (!err) {
                if (res.status === 200) {
                  res = res.data
                  if (res['code'] === 200) {
                    this.clear()
                    this.toastText(res['data'], 'middle')
                    this.$store.dispatch('user/refreshBalance').then().catch()
                    // this.$store.dispatch('lottery/getLotteryNoCount').then().catch()
                  } else if (res.message) {
                    var showCancelButton = true;
                    if(this.$config.lotteryPay){
                      showCancelButton = false;
                    }
                    this.$vux.confirm.show({
                      title: '下注失败',
                      content: res.message.indexOf('超出单注')==0?'超出单注限额</br>'+'单注最高'+res.message.match(/[0-9]+/g)[0]+'元,最低'+res.message.match(/[0-9]+/g)[1]+'元':this.$config.blackTheme ? '<span style="color:#fff">' + res.message + '</span>' : res.message,
                      confirmText:'确定',
                      cancelText:'去充值',
                      showCancelButton:showCancelButton,
                      onConfirm: () => {
                      },
                      onCancel:()=>{
                        if(!this.$route.query.token) {
                          this.$router.replace('/save')
                        }
                      }
                    })
                    
                    
                     

                  }
                } else {
                  console.error(err)
                }
              }
            }
          })
        // }
        //  else {
        //   this.$dialog({
        //     title: '温馨提示',
        //     message: '请输入有效的投注金额'
        //   })
        // }
      }
    },
    onOrderDelete (index) {
      this.isDeleteStatus = true;
      if (this.orderList.length > 1) {
        this.orderList.splice(index, 1)
        const hasBall = []
        const hasName = []
        const hasCode = []
        this.orderList.forEach(order => {
          if (!(hasBall.includes(order.ball))) hasBall.push(order.ball)
          if (!(hasName.includes(order.code))) hasName.push(order.name)
          if (!(hasCode.includes(order.code))) hasCode.push(order.code)
        })
        // 二不同 三不同 处理
        let otherBall = hasCode.join(',').replace(/,/g, '')
        let newStr = ''
        let len = otherBall.length
        for (let i = 0; i < len; i++) {
          if (newStr.indexOf(otherBall[i]) === -1) {
            newStr = newStr + otherBall[i] + ','
          }
        }
        otherBall = newStr.substr(0, newStr.length - 1)
        otherBall = otherBall.split(',').map(item => Number(item))
        if (this.way.small === '二不同' || this.way.small === '三不同') {
          this.$emit('update:ball', this.ball.filter(ball => otherBall.includes(ball)))
        } else {
          this.$emit('update:ball', this.ball.filter(ball => hasBall.includes(ball)))
        }
        this.code.map(code =>code.newBall = code.ball +"_"+code.name)
        this.$emit('update:code', this.code.filter(code => hasName.includes(code.newBall)))
      }

    },
    initMoney () {
      let money = parseInt(this.money)
      if (isNaN(money) || money < 0) money = 0
      if (this.tempOrderList.length) {
        this.tempOrderList.forEach(order => {
          order.money = money
        })
      }
      this.tempOrderList = JSON.copyObj(this.tempOrderList)
    },
    onBetCancel(){
      this.showOrderList=false;
      if(this.$mobileDevice.isAndroid 
            && this.$mobileDevice.browserName === 'MIUI Browser'){
        if (this.$refs['input-box']) {
          this.boxHeight = this.$refs['input-box'].clientHeight
        }
      }
    },
    onOrder () {
      if (this.tempOrderList.length) {
        let status = true
        let money = parseInt(this.money)
        if (isNaN(money) || money < 0) money = 0

        if (!money) {
          this.toastText('请输入正确的整数金额', 'middle')
          status = false
        }

        if (status) {
          if (this.orderChanged) this.orderList = JSON.copyObj(this.tempOrderList)
          const overlay = document.querySelector('.van-overlay')
          // if (overlay) overlay.style.zIndex = '9999'
          // console.log(overlay)
          this.showOrderList = true
          if(this.$mobileDevice.isAndroid 
            && this.$mobileDevice.browserName === 'MIUI Browser'){
            //解决小米手机投注框问题
            var hFixed = 38.4+32.64+67.2;//固定总高度
            if(this.series === '10011'){//快三固定高度计算
              hFixed = 38.4+32.64+67.2+55.68;
            }
            var defaultH  = 38.4;//默认一行数据的高度
            if(this.$userAgent.indexOf('MI 8') > -1
              && this.$mobileDevice.osVersion === '9'){
              //处理小米8高度差异问题
              hFixed += 20;
              defaultH = 40;
            }
            var countOrder = this.tempOrderList.length;
            if(countOrder > 6){
              countOrder = 6;
            }
            
            var dFixed = defaultH * countOrder;
            this.boxHeight = hFixed + dFixed;
          }
        } else {
          this.orderList = []
          this.showOrderList = false
        }
      } else {
        this.orderList = []
        this.showOrderList = false

        if (this.series === '10011') this.toastText('至少选择一注号码投注', 'middle')
      }

      this.orderChanged = false
    },
    /**
       * 常规
       * @param orderList
       */
    createOrderDefault (orderList) {
      this.sortCode.forEach(code => {
        orderList.push({
          ball:code.ball,
          code: code.code,
          name:code.ball+"_"+code.name,
          playway: code.playway,
          odds: code.odds,
          attach: '',
          money: 0
        })
      })
    },

    /**
     * 快乐十分
     * @param orderList
     */
    createOrderDirection(orderList){
       this.sortCode.forEach(code => {
        orderList.push({
          ball:this.way.big,
          code: code.code,
          name:code.ball+"_"+code.name,
          playway: code.playway,
          odds: code.odds,
          attach: '',
          money: 0
        })
      })
    },
    /**
       * 快捷
       * @param orderList
       */
    createOrderKj (orderList) {
      this.sortBall.forEach(ball => {
        this.sortCode.forEach(code => {
          orderList.push({
            ball: ball,
            code: code.code,
            playway: code.playway,
            name:code.ball+"_"+code.name,
            odds: code.odds,
            attach: '',
            money: 0
          })
        })
      })
    },
    /**
       * 组合
       * @param orderList
       */
    createOrderZh (orderList) {
      orderList.push({
        code: this.sortCode.map(code => code.code).join(','),
        playway: this.sortCode[0].playway,
        odds: this.sortCode[0].odds,
        ball: this.sortCode[0].ball,
        attach: '',
        name:this.sortCode[0].ball+"_"+this.sortCode[0].name,
        money: 0
      })
    },
    /**
       * 组合
       * @param orderList
       */
    createOrderDpcZh (orderList) {
      orderList.push({
        code: this.sortCode.map(code => code.code).join(','),
        playway: this.sortCode[0].playway,
        odds: this.sortCode[0].odds,
        ball: this.sortCode.map(code => code.ball).join(','),
        attach: '',
        money: 0,
        name:this.sortCode[0].ball+"_"+this.sortCode[0].name,
      })
    },
    checkCode () {
      this.orderChanged = true
      if (!this.ball.length && !this.code.length) {
        this.money = ''
        this.orderList = []
        this.tempOrderList = []

        this.showOrderList = false
        this.chipEditing = false
        this.show = false

        this.$store.state.key.show = false
        this.$store.state.key.target = null

        this.submitting = false
        return
      }
      let orderList = []
      if (this.way) {
        if (this.series === '10010') { // 六合彩
          const small = this.way.items[this.tabIndex]
          const count = ['十一不中', '十二不中', '十一肖'].includes(small.small.toString()) ? small.small.toString() : small.small.toString().substr(0, 1)
          if (this.way.big === '连码') {
            let status = (count === '二' || count === '特') && this.code.length >= 2
            status = status || (count === '三' && this.code.length >= 3)
            status = status || (count === '四' && this.code.length >= 4)
            status = status && this.code.length <= 10

            if (status) this.createOrderZh(orderList)
          } else if (['连肖', '连尾', '合肖', '全不中'].includes(this.way.big)) {
            let status = (count === '二' || count === '特') && this.code.length === 2
            status = status || (count === '三' && this.code.length === 3)
            status = status || (count === '四' && this.code.length === 4)
            status = status || (count === '五' && this.code.length === 5)
            status = status || (count === '六' && this.code.length === 6)
            status = status || (count === '七' && this.code.length === 7)
            status = status || (count === '八' && this.code.length === 8)
            status = status || (count === '九' && this.code.length === 9)
            status = status || (count === '十' && this.code.length === 10)
            status = status || (count === '十一不中' && this.code.length === 11)
            status = status || (count === '十一肖' && this.code.length === 11)
            status = status || (count === '十二不中' && this.code.length === 12)

            if (status) this.createOrderZh(orderList)
          } else {
            this.createOrderDefault(orderList)
          }
        } else if (this.series === '10011') {
          switch (this.way.small) {
            case '三不同':
              if (this.ball.length < 3) {
                orderList = []
              } else {
                const len = this.sortBall.length
                const ball = this.way.small
                for (let i = 0; i <= len - 3; i++) {
                  for (let j = i + 1; j <= len - 2; j++) {
                    for (let k = j + 1; k < len; k++) {
                      const code = '' + this.sortBall[i] + this.sortBall[j] + this.sortBall[k]
                      const obj = this.way.code.find(item => item.name.toString() === code)
                      orderList.push({
                        ball: ball,
                        code: code,
                        attach: '',
                        money: parseInt(this.money),
                        odds: obj.odds,
                        playway: obj.playway
                      })
                    }
                  }
                }
              }
              break
            case '二不同':
              if (this.sortBall.length < 2) {
                orderList = []
              } else {
                const len = this.sortBall.length
                const ball = this.way.small
                for (let i = 0; i <= len - 2; i++) {
                  for (let j = i + 1; j < len; j++) {
                    const code = '' + this.sortBall[i] + this.sortBall[j]
                    const obj = this.way.code.find(item => item.name === code)
                    orderList.push({
                      ball: ball,
                      code: code,
                      attach: '',
                      money: parseInt(this.money),
                      odds: obj.odds,
                      playway: obj.playway
                    })
                  }
                }
              }
              break
            case '二同单选':
              if (this.sortBall.find(item => item.toString().length === 1) &&
                  this.sortBall.find(item => item.toString().length === 2)) {
                const ball = this.way.small
                this.sortBall.filter(item1 => item1.toString().length === 2).forEach(item1 => {
                  this.sortBall.filter(item2 => item2.toString().length === 1).forEach(item2 => {
                    const obj = this.way.code.find(item => item.code.toString() === ('' + item1 + item2))
                    orderList.push({
                      ball: ball,
                      code: '' + item1 + item2,
                      name: '' + item1 + item2,
                      money: parseInt(this.money),
                      odds: obj.odds,
                      playway: this.sortBall[0].playway
                    })
                  })
                })
              } else {
                orderList = []
              }
              break
            default:
              this.createOrderDefault(orderList)
              break
          }
        }else if (this.series === '10009') {
          if (this.way.big === '二字定位' && this.code.length === 2 && this.code[0].ball !== this.code[1].ball) {
            this.createOrderDpcZh(orderList)
          } else if (this.way.big === '三字定位' && this.code.length === 3 &&
              this.code[0].ball !== this.code[1].ball &&
              this.code[0].ball !== this.code[2].ball &&
              this.code[1].ball !== this.code[2].ball) {
            this.createOrderDpcZh(orderList)
          }
        }else if (this.way.big === '快捷') {
          this.createOrderKj(orderList)
        }
        else if (this.series === '10012') {
          if(['第一球','第二球','第三球','第四球','第五球','第六球','第七球','第八球'].includes(this.way.big)){
            this.createOrderDirection(orderList)
          }else{
            this.createOrderDefault(orderList)
          }
        }
        else if (this.way.items[this.tabIndex].small === '特码包三') {
          if (this.code.length === 3) {
            this.createOrderZh(orderList)
          } else {
          }
        } else {
          this.createOrderDefault(orderList)
        }
      }
      this.tempOrderList = orderList;
      if(['三不同','二不同'].includes(this.way.small) && this.isDeleteStatus){
        this.tempOrderList = this.orderList;
      }
      this.initMoney()
      this.show = !!orderList.length
      if (this.showOrderList && !orderList.length) this.showOrderList = false
    },
    onEditChip () {
      this.chipEditing = true
    },
    clear () {
      this.money = ''
      this.orderList = []
      this.tempOrderList = []

      this.showOrderList = false
      this.chipEditing = false
      this.show = false

      this.$store.state.key.show = false
      this.$store.state.key.target = null

      this.submitting = false
      var arr = document.getElementsByClassName("chip-btn-item");
      for(var i=0;i<arr.length;i++){
        arr[i].classList.remove("active");
      }
      this.$emit('clear')
    },
    onSave () {
      localStorage['chip'] = JSON.stringify(this.editChip)
      try {
        let chip = JSON.parse(localStorage['chip'])
        if (Object.prototype.toString.call(chip) !== '[object Array]') {
          this.oldChip = this.chip = [50, 500, 1000, 10000]
          localStorage['chip'] = JSON.stringify(this.chip)
        } else {
          chip = chip.map(num => parseInt(num))
          chip.sort((v1, v2) => v1 - v2)
          this.oldChip = this.chip = chip.map(num => num > this.maxChip ? this.maxChip : num)
        }
      } catch (e) {
        this.oldChip = this.chip = [50, 500, 1000, 10000]
        localStorage['chip'] = JSON.stringify(this.chip)
      }

      this.chipEditing = false
    },
    onNo () {
      this.chipEditing = false
      this.chip = JSON.copyObj(this.oldChip)
    },
    onChipBlur (index) {
      if (!/^[\d]+$/.test(this.editChip[index] || '')) {
        this.toastText('请输入正确的正整数', 'middle')
        this.$set(this.editChip, index, this.oldChip[index])
      } else if (parseInt(this.editChip[index]) === 0) {
        this.toastText('预设金额不能为0', 'middle')
        this.$set(this.editChip, index, this.oldChip[index])
      } else if (!this.editChip[index] || !parseInt(this.editChip[index])) {
        this.$set(this.editChip, index, this.oldChip[index])
      } else if (parseInt(this.editChip[index]) && parseInt(this.editChip[index]) > this.maxChip) {
        this.$set(this.editChip, index, this.maxChip)
        this.toastText('最大预设值为' + this.maxChip, 'middle')
      }
    },
    onChipFocus (index) {
      this.$set(this.editChip, index, '')
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  /deep/.weui-toast{
    position: fixed;
    z-index: 5001;
    width: 2rem;
    min-height: 2.3rem;
    top: 3.6rem;
    left: 50%;
    margin-left: -3.8em;
    background: rgba(17, 17, 17, 0.7);
    text-align: center;
    border-radius: 5px;
    color: #FFFFFF;
  }
  /deep/.weui-mask{
    background: rgba(0, 0, 0, 0.1);
  }
  

  .h5-icon-guanbi::after{
    content:'';
    width:0!important;
  }
  .lottery-bet-input-box {
    width: 100%;
    background-color: rgba(0, 0, 0, 0);

    .lottery-bet-input-div {
      width: 100%;
    }

    .lottery-bet-input-flex {
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
    }

    .lottery-bet-input {
      width: 100%;
      position: relative;
      transition: all 300ms ease;
      border-top: 0.02rem solid;
      border-top: none;

      .chip-row {
        border-top: 0.02rem #efefef solid;
        background-color: #fff;
        padding: 0 0.22rem;
        width: 100%;
        height: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
        font-weight: normal;

        .btn-item {
          display: block;
          height: 0.6rem;
          width: 1.2rem;
          box-sizing: border-box;
          outline: 0;
          -webkit-appearance: none;
          border-radius: 0.1rem;
          background-color: #fff;
          margin-right: 0.2rem;
          font-size: 0.32rem;
          border: 0.02rem solid;
          &.active{
            color: #fff !important;
            border: none;
          }
          &.btn-edit {
            background-color: #F6F6F6;
            width: 1.45rem;
            border: none;
            margin-right: 0;
            font-size: 0.28rem;

            &.active {
              color: #fff;
            }
          }

          &.btn-input, &.btn-input:focus {
            padding: 0.1rem;
            outline: 0;
            -webkit-appearance: none;
            text-align: center;
          }
        }
      }

      .input-row {
        width: 100%;
        height: 1rem;
        background-color: #f6f6f6;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
        font-size: 0.349rem;
        padding: 0 0.24rem;
        font-weight: normal;
        .btn-clear {
          flex-shrink: 0;
          color: #555555;
          display: flex;
          align-items: center;

          .font {
            font-size: 0.32rem;
            margin-right: 0.08rem;
          }
        }

        .input {
          width: 3rem;
          min-width: 0;
          height: 0.7rem;
          font-size: 0.32rem;
          line-height: 0.32rem;
          padding: 0.2rem;
          border-radius: 0.04rem;
          box-shadow: 0 0 0.04rem #d1d1d1;
          box-sizing: border-box;
          color: #323232;
          background: #ffffff;
          margin-right: 0.3rem;
          margin-left: 0.3rem;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -webkit-align-items: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -webkit-justify-content: center;
          -ms-flex-pack: center;
          justify-content: center;
        }

        .btn-submit {
          flex-shrink: 0;
          color: #FFFFFF;
          line-height: 0.7rem;
          padding: 0 0.38rem;
          border-radius: 0.1rem;
        }
      }
    }

    .lottery-bet-input-flex-k3 {
      transition: all 300ms ease;

      .lottery-bet-input {
        background-color: #19593c;
        height: 1.5rem;

        .code-row {
          width: 100%;
          box-sizing: border-box;
          height: 0.75rem;
          text-align: left;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: nowrap;
          border-bottom: 0.02rem solid #164630;

          .label {
            color: #caebda;
            font-size: 0.3rem;
            line-height: 0.75rem;
            padding: 0 0.14rem;
            overflow: hidden;
            white-space: nowrap;
          }

          .num-list {
            color: #ffaf36;
            font-size: 0.3rem;
            line-height: 0.75rem;
            text-align: left;
            font-weight:400;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            width: 80%;
          }
        }

        .input-row-k3 {
          width: 100%;
          box-sizing: border-box;
          height: 0.75rem;
          text-align: left;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: nowrap;

          .input {
            width: 1.6rem;
            height: 0.5rem;
            background-color: #cbeedc;
            color: #19593c;
            border-radius: 0.1rem;
            padding: 0.06rem 0.1rem;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            font-size: 0.3rem;
          }

          .label {
            color: #caebda;
            font-size: 0.3rem;
            line-height: 0.75rem;
            padding: 0 0.14rem;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }

      .info-row {
        background-color: #000;
        width: 100%;
        height: 1.16rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        z-index: 10;

        .btn-submit {
          flex-shrink: 0;
          height: 100%;
          background-color: #ffaf36;
          color: #4e0904;
          font-size: 0.349rem;
          padding: 0 0.26rem;
          font-weight: bold;
        }

        .btn-clear {
          flex-shrink: 0;
          color: #ffaf36;
          font-weight: bold;
          font-size: 0.4rem;
          padding: 0 0.36rem;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .info {
          flex: 1;
          font-size: 0.3rem;
          color: #fff;
          text-align: left;
        }
      }
    }
  }
  .show .editor-box{
    transform: translate(-50%, -50%) scale(1) !important;
  }
  .editor-box {
    width: 6.58rem;
    box-sizing: border-box;
    padding: 0 0.2rem;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    border-radius: 0;
    transition: all 400ms;
    z-index: 451;
    .editor-header {
      position: relative;
      font-size: 0.4rem;
      text-align: center;
      color: #666666;
      height: 0.88rem;
      line-height: 0.88rem;
      box-sizing: border-box;
      display: block;
      // border-bottom: 0.02rem solid #e9e9e9;
      &::after{
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0;
        bottom: 0;
        // top: 0;
        left: 0;
        border-bottom: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }
    }

    .editor-body {
      padding: 0.24rem 0;

      .editor-item {
        width: 100%;
        display: block;
        margin-top: 0.36rem;

        &:first-child {
          margin-top: 0;
        }
      }

      .input {
        width: 4.8rem;
        height: 0.7rem;
        line-height: 0.7rem;
        box-sizing: border-box;
        border-radius: 0.35rem;
        border: 1px solid #ebedf0;
        margin: 0 auto;
        display: block;
        text-align: center;
        color: #323232;
        font-size: 0.3rem;
      }
    }

    .editor-footer {
      box-sizing: border-box;
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: relative;
      // border-top: 0.02rem solid #e9e9e9;
      &::after{
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0rem;
        // bottom: 0;
        top: 0;
        left: 0rem;
        border-top: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }
      padding: 0.24rem 0;

      .btn {
        width: 2.3rem;
        height: 0.7rem;
        line-height: 0.7rem;
        display: block;
        box-sizing: border-box;
        border-radius: 0.35rem;
        font-size: 0.3rem;

        &.btn-no {
          border: 0.02rem solid;
        }

        &.btn-ok {
          color: #FFF;
        }
      }
    }
  }

  .lottery-order-box {
    background-color: #ffffff !important;

    .lottery-order-animation-box {
      transition: all 300ms ease;
      transform: translate3d(0, 0, 0);
    }

    .active-box {
      padding: 0.2rem 0.3rem;
      width: 100%;
      height: 1.4rem;
      display: flex;
      justify-content: space-between;
      align-items: stretch;

      .btn-action {
        //display: flex;
        outline: 0;
        border: none;
        color:#000;
        border-radius: 0.1rem;
        width: 3.3rem;
        font-weight: normal;
        justify-content: center;
        align-items: center;
        font-size: 0.349rem;
        text-align: center;
        &.btn-action-cancel {
          background-color: #f8f8f8;
        }

        &.btn-action-commit {
          color: #FFFFFF;
        }
      }
    }

    .header-box {
      height: 0.8rem;
      width: 100%;
      //border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
      border-bottom: 0.015rem solid #ebedf0;
      display: flex;
      align-items: center;
      justify-content: center;
      .lottery-order-title {
        font-size: 0.349rem;
        color: #000;
      }
    }

    .lottery-order-list-box {
      max-height: 4.8rem;
      width: 100%;
      font-size: 0.28rem;
      text-align: left;
      .lottery-order-list {
        width: 100%;
        padding: 0 0.2rem 0 0.2rem;
      }
      .lottery-order-item {
        font-weight:normal;
        // margin-top:0.2rem;
        color:#000;
        height: 0.8rem;
        width: 100%;
        border-bottom: 0.5px solid #efefef;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
        .lottery-order-item-code {
          flex: 1;
          text-align: left;
        }
        .lottery-order-item-odds {
          flex-shrink: 0;
          min-width: 2rem;
          margin-right: 0.2rem;
          color: rgb(51, 51, 51);
          text-align: left;
          padding-left: 0.4rem;
        }

        .input {
          flex-shrink: 0;
          padding: 0.1rem;
          border: 0.02rem solid #dbdbdb;
          border-radius: 0.06rem;
          width: 1.36rem;
          line-height:0.6rem;
          height:0.6rem!important;
          margin-left: 0.1rem;
          display: flex;
          justify-content: center;
          &.input-red {
            color: red !important;
            border-color: red !important;
          }
          &.input-yellow {
            border-color: #f4c829 !important;
          }
        }

        .lottery-order-item-delete {
          flex-shrink: 0;
          margin-left: 0.1rem;
          font-size: 0.36rem;
          height:0.54rem;
          line-height:0.54rem;
          margin-top: 0.03rem;
        }
      }

      .lottery-order-list-1 {
        .lottery-item{
           .lottery-order-item {
            justify-content: flex-end;
          }
          .lottery-order-item-code {
            flex: auto;
            color: rgb(51, 51, 51);
            border-bottom: 0.02rem solid rgb(230, 230, 230);
            height: 0.56rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-bottom: 0.15rem;
            .lianma_list::after{
              content: ',';
              position: relative;
            }
            .lianma_list:last-child::after {
              content: '';
              position: relative;
            }
          }
          .lottery-order-item-ball {
            margin-top:.25rem;
            height: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            color: #000000;
            font-weight: 500;
            font-size: 0.28rem;
          }
        }
        .oder-item{
          list-style: none;
          border-bottom: 0.02rem solid hsl(0, 0%, 95%);
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          padding: 0;
            -webkit-box-sizing: border-box;
          box-sizing: border-box;
          font-size: 0.32rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          height: 0.8rem;
          line-height: 0.8rem;
          .name{
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            -ms-flex: 1;
            flex: 1;
            text-align: left;
            font-weight: normal;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            margin-right: 0.2rem;
            font-size: 0.28rem;
            color: #000000;
            min-width: 3rem;
            max-width: 3rem;
          }
          .odds{
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: 0.28rem;
            min-width: unset;
            font-weight:normal;
            color:#000;
          }
          .number-input {
            flex-shrink: 0;
            padding: 0.1rem;
            border: 0.02rem solid #dbdbdb;
            border-radius: 0.06rem;
            width: 1.34rem;
            text-align: center;
            height: 0.6rem!important;
            color:#333333;
            font-weight: normal;
            line-height: 0.34rem;
            border: 0.02rem solid #dbdbdb;
            margin-left: 0.1rem;
            display: inline-block;
            &.input-red {
              color: red !important;
              border-color: red !important;
            }
            &.input-yellow {
              border-color: #f4c829 !important;
            }
          }
          .num{
            // -webkit-box-flex: 1;
            // -webkit-flex: 1;
            // -ms-flex: 1;
            // flex: 1;
            text-align: left;
            padding: 0 0.01rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: 0.28rem;
            min-width: 2.1rem;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -ms-flex-wrap: nowrap;
            flex-wrap: nowrap;
          }
        }
      }
      .lotter-lhc-box{
        .number-input{
            width: 1.36rem;
            height: 0.68rem!important;
            line-height: 0.68rem;
            padding: 0 0.06rem;
            border: 1px solid #dbdbdb;
            border-radius: 0.06rem;
            margin: 0 0.1rem;
            font-size: 0.28rem;
            text-indent: 0.1rem;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: #333333;
            text-align: center;
            display: -webkit-inline-box;
            display: -webkit-inline-flex;
            display: -ms-inline-flexbox;
            display: inline-flex;
            -webkit-box-align: center;
            -webkit-align-items: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -webkit-justify-content: center;
            -ms-flex-pack: center;
            justify-content: center;
            overflow: hidden;
        }
      }
    }

    .lottery-order-all {
      height: 0.68rem;
      font-size: 0.3rem;
      font-weight: normal;
      line-height: 0.58rem;
      color:#000;
      // margin-top: 0.2rem;
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      padding: 0.1rem  0.3rem 0 0.3rem;

      .number-font {
        margin: 0 0.04rem;
      }

      .red {
        color: #ff0000;
      }
      .yellow {
        color: #f4c829;
      }
    }
  }

  .lottery-order-box-k3 {
      background-color: #317455 !important;
      z-index:999;
    .lottery-order-item{
      color: #caebda!important;
      .lottery-order-item-code{
        font-size: 0.28rem;
      }
      .lottery-order-item-odds{
        color: #caebda!important
      }
    }
    .lottery-order-title {
      color: #caebda !important;
    }
    .lottery-order-item-odds{
      color: #caebda !important;
    }
    .header-box, .lottery-order-all, .active-box {
      background-color: #19593c !important;
      color: #caebda;
    }

    .header-box, .lottery-order-item, .input {
      border-color: rgba(255, 255, 255, 0.3) !important;
      color: #caebda;

      &.focus {
        // border-color: #f4c829 !important;
      }
    }

    .btn-action-cancel {
      background-color: #cbeedc !important;
      color: #19593c !important;
    }

    .btn-action-commit {
      background-color: #f4c829 !important;
      color: #4e0904 !important;
    }

    .theme-color {
      color: #f4c829 !important;
    }
    .rmb{
      font-weight: normal;
      vertical-align: middle;
      display: inline-block;
      height: 0.3rem;
    }

    .lottery-order-item:last-child {
      border-bottom: none !important;
    }
  }
  .cocos-box {
    .input-row {
      height: 1.15rem !important;
      padding-bottom: 0.15rem !important;
    }
  }
</style>
