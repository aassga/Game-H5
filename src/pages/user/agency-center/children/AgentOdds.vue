<template>
  <view-page class="view-page" full-box>
    <title-header slot="header" title="赔率计算"></title-header>
    <div class="head" slot="header-static">
      <div class="action-row">
        <div class="item" @click="showGames=true">{{gameName}}</div>
        <div class="item" @click="showPlays=true">{{playName}}</div>
      </div>
      <label class="action-row">
        <input class="input" v-model="val" type="number" placeholder="抽取下级点数"/>
        <button class="button theme-bg" @click="onSearch"><span class="fa fa-fw fa-search"></span></button>
      </label>
      <ul class="row title clear-fix">
        <li class="f-l col">游戏玩法</li>
        <li class="f-l col">下级点数</li>
        <li class="f-l col">下级赔率</li>
      </ul>
    </div>
    <div class="body" slot="content">
      <ul class="row clear-fix" v-for="(item, i) in data" :key="item.code+'-'+i">
        <li class="f-l col">{{item.code}}</li>
        <li class="f-l col">{{val}}%</li>
        <li class="f-l col">{{item.odds}}</li>
      </ul>
    </div>
    <div slot="static">
      <van-popup v-model="showGames" position="bottom" get-container="body" :lazy-render="false">
        <van-picker show-toolbar v-model="showGames" :columns="games" :item-height="36" value-key="text" @confirm="onGameChange" @cancel="showGames=false"></van-picker>
      </van-popup>
      <van-popup v-model="showPlays" position="bottom" get-container="body" :lazy-render="false">
        <van-picker show-toolbar v-model="showPlays" :columns="plays" :item-height="40" value-key="text" @confirm="onPlayChange" @cancel="showPlays=false"></van-picker>
      </van-popup>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'AgentOdds',
  data () {
    return {
      val: '',
      game: [],
      activeGame: undefined,
      activePlay: undefined,
      play: [],
      games: [],
      plays: [],
      showGames: false,
      showPlays: false,
      data: null,
      submitting: false
    }
  },
  computed: {
    gameName () {
      if (this.activeGame) {
        return this.games.find(game => game.value === this.activeGame).text
      } else {
        return ''
      }
    },
    playName () {
      if (this.activePlay !== undefined) {
        return this.plays[this.activePlay] ? this.plays[this.activePlay].text : ''
      } else {
        return ''
      }
    }
  },
  watch: {
    activeGame () {
      if (this.activeGame) {
        this.$store.dispatch(
          'lottery/getPlayWaySet',
          {
            id: this.activeGame,
            callback: res => {
              res = res.data
              if (res.code === 200) {
                const plays = []
                res.data.forEach((play, i) => {
                  plays.push({
                    value: i,
                    text: play.big
                  })
                })
                this.plays = plays
                this.play = this.activePlay = this.plays[0].value
              }
            }
          }
        )
      }
    }
  },
  created () {
    this.$store.dispatch('lottery/getGames', {
      callback: res => {
        res = res.data
        if (res['code'] === 200) {
          const games = []
          res.data.forEach(type => {
            type['lottery'].forEach(game => {
              games.push({
                value: game.id.toString(),
                text: game.name
              })
            })
          })
          this.games = games
          if (this.games.length) {
            this.game = this.activeGame = this.games[0].value
          }
        }
      }
    })
  },
  methods: {
    onSearch () {
      this.data = []
      if (this.submitting) {
        this.toastText('正在查询', 'top')
      } else if (!this.val) {
        this.toastText('请输入下级点数', 'top')
      } else if (!this.activeGame) {
        this.toastText('请选择彩种', 'top')
      } else if (!this.activePlay && this.activePlay !== 0) {
        this.toastText('请选择玩法', 'top')
      } else {
        this.submitting = true
        this.$store.state.main.loadingText = '查询中...'
        this.$store.dispatch(
          'agent/getPlaywaySet',
          {
            lid: this.activeGame,
            dot: this.val
          }
        ).then(res => {
          if (res.code === 200) {
            const data = []
            res.data[this.activePlay].items.forEach(children => {
              children.code.forEach(item => {
                if (!data.find(it => it.code === item.code)) {
                  data.push(item)
                }
              })
            })

            this.data = data
          } else {
            this.toastText(res.message, 'top')
          }
          this.submitting = false
          this.$store.state.main.loadingText = ''
        }).catch(() => {
          this.submitting = false
          this.$store.state.main.loadingText = ''
        })
      }
    },
    onGameChange (val) {
      this.game = val
      this.activeGame = this.game.value
      this.showGames = false
    },
    onPlayChange (val) {
      this.play = val
      this.activePlay = this.play.value
      this.showPlays = false
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .view-page {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: column;

    .row {
      border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);
      font-size: 0.28rem;
      line-height: 0.8rem;
      background-color: #fff;

      &.title {
        margin-top: 0.24rem;
        line-height: 0.9rem !important;
      }

      .col {
        width: 33%;
      }
    }

    .head {
      width: 100%;
      box-sizing: border-box;

      .action-row {
        box-sizing: border-box;
        padding: 0 0.24rem;
        width: 100%;
        height: 0.96rem;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        flex-wrap: nowrap;

        .item {
          border-radius: 0.1rem;
          overflow: hidden;
          flex: 1;
          line-height: 0.76rem;
          position: relative;
          color: #666;
          text-align: left;
          padding: 0 0.24rem;
          font-size: 0.3rem;
          background-color: #fff;

          &:first-child {
            margin-right: 0.12rem;
          }

          &:last-child {
            margin-left: 0.12rem;
          }

          &:after {
            content: '';
            display: block;
            position: absolute;
            right: 0.3rem;
            height: 0.2rem;
            width: 0.2rem;
            border-top: 0.02rem solid #666;
            border-right: 0.02rem solid #666;
            transform: rotateZ(45deg) translateY(-50%);
            top: 50%;
          }
        }

        .input {
          flex: 1;
          border-top-left-radius: 0.1rem;
          border-bottom-left-radius: 0.1rem;
          line-height: 0.3rem;
          -webkit-appearance: none;
          font-size: 0.3rem;
          padding: 0.23rem 0.2rem;
          height: 0.76rem;
          box-sizing: border-box;

          &:active, &:hover, &:focus {
            outline: 0;
          }

          &::-webkit-input-placeholder {
            color: #666 !important;
            opacity: 1 !important;
            transform: translateY(4%);
          }

          &::-moz-placeholder {
            color: #666 !important;
            opacity: 1 !important;
            transform: translateY(4%);
          }
        }

        .button {
          width: 0.76rem;
          height: 0.76rem;
          color: #FFFFFF;
          border: none;
          outline: 0;
          border-top-right-radius: 0.1rem;
          border-bottom-right-radius: 0.1rem;
        }
      }
    }

    .body {
      flex: 1;
      width: 100%;
      height: calc(100% - (0.9rem + 2.62rem));
    }
  }
</style>
