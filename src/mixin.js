import themes from './style/theme'

export default {
  data() {
    return {
      gameTimer : 0
    }
  },
  computed: {
    /**
     * 当前主题信息
     * @returns {*|null}
     */
    targetTheme() {
      const theme = themes.find(theme => theme.code === this.$store.state.main.theme)
      return theme || null
    },

    /**
     * 当前rem单位对应的ｐｘ值
     * @returns {number}
     */
    rem() {
      return this.$store.state.main.windowWidth / 7.5
    },

    /**
     * 代理模式
     * @returns {any}
     */
    personalMode() {
      return localStorage['personal_commission_mode']
    },

    /**
     * 静态资源域名
     * @returns {string|*}
     */
    publicStaticHost() {
      if (this.$store.state.main.config) {
        return this.$store.state.main.config['statics']
      } else {
        return window.location.pathname
      }
    },

    /**
     * 是否是在原生webview中打开
     * @returns {boolean}
     */
    isApp() {
      return !!this.$route.query.app
    },

    /**
     * 是否在android浏览器中打开
     * @returns {boolean}
     */
    isAndroid() {
      let u = navigator.userAgent
      return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    },

    /**
     * 是否在android浏览器中打开
     * @returns {boolean}
     */
    isIphone() {
      let u = window.navigator.userAgent
      return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    },

    /**
     * 代理类型 agency => 代理  shareholder => 大股东
     * @returns {string|*}
     */
    agencyType() {
      if (this.userInfo && this.userInfo['agencyInfo']) {
        return this.userInfo['agencyInfo']['agencyType']
      } else {
        return ''
      }
    },

    /**
     * 用户信息
     * @returns {Object}
     */
    userInfo() {
      return this.$store.state.user.userInfo || {}
    },

    /**
     * token
     * @returns {string}
     */
    token() {
      return this.$store.state.user.token
    },

    /**
     * 推广模式
     * @returns {string}
     */
    siteModel() {
      return this.$store.state.main.config ? this.$store.state.main.config['site_model'] : ''
    }
  },
  watch: {
    '$route': {
      handler(val) {
        this.$store.state.main.showTab = !!this.$route.meta.tab
        if(val.path === '/admin/login' && this.$config.home === 'qp') {
          this.$store.state.main.showTab = false
        }
      },
      deep: true
    }
  },
  methods: {
    getRedLope() {
      this.$store.dispatch('main/getQipaiShouyeHongbao').then(res => {
        if (res.code === 200) {
          this.$store.commit('main/isShowMask', {
            page: '',
            status: true
          })
          try {
            this.$store.commit('main/getRedLopeMoney', res.data.gift_money)
            this.$store.commit('main/getRedLopeType', res.data.send_type)
            this.$store.commit('main/getRedLopeId', res.data.id)
          } catch (error) {
            this.$store.commit('main/getRedLopeMoney', 0)
          }
          this.$store.commit('main/getisRedLop', true)
        }
      })
    },
    checkAgent(agent) {
      if (agent) {
        return true
      } else {
        this.toastText('请输入邀请码', 'top')
        return false
      }
    },
    checkCode(code) {
      if (!code) {
        this.toastText('请输入验证码', 'top')
      } else if (!/[\d]{4}/.test(code)) {
        this.toastText('验证码为4位数字', 'top')
        return false
      } else {
        return true
      }
    },
    getAgentMode() {
      return localStorage.personal_commission_mode
    },
    number2(num) {
      if (num.toString().length === 1) {
        return '0' + num
      } else {
        return num.toString()
      }
    },
    /**
     * 获取客服链接
     * @returns {string}
     */
    getKF() {
      const kf = this.$store.state.main.config['service'].find(item => item.status === 'on')
      return kf ? kf.url : ''
    },

    inService() {
      const serviceUrl = this.getKF();
      if (!serviceUrl) {
        this.toastText('暂无客服链接', 'middle');
        return;
      }
      let newWin
      if (this.canOpenInNewWin()) {
        newWin = window.open('about:blank', '_blank');
      }
      if (newWin) {
        newWin.location.replace(serviceUrl);
        return;
      }
      if (this.$userAgent.includes('MQQBrowser') || (this.isIphone && this.$userAgent.includes('SogouMobileBrowser'))) {
        //解决QQ浏览器回退后卡顿问题
        //解决Iphone 搜狗浏览器回退卡顿问题
        //增加浏览器历史记录
        window.history.pushState(window.location.href, null, window.location.href);
        window.location.replace(serviceUrl)
      } else {
        window.location.href = serviceUrl
      }

    },
    /**
     * 预览弹窗
     */
    previewAlert() {
      this.$store.state.main.iosAlert.content = '预览版暂不支持!'
      this.$store.state.main.iosAlert.show = true
    },
    /**
     * 返回回调URL
     */
    goBackUrl() {
      if (localStorage.back_url) {
        window.location.href = localStorage.back_url
      }
    },
    /**
     * 搜狗,UC,QQ不可以在新窗口打开
     */
    canOpenInNewWin() {
      const uas = [
        'SogouMobileBrowser',
        'MQQBrowser',
        'UCBrowser'
      ]

      return !uas.some(ua => new RegExp(ua, 'gi').test(window.navigator.userAgent))
    },
    /**
     * 项目点击事件,针对新排序接口
     * @param game
     */
    onGameClick(game) {
      // 99996 长龙助手特殊处理
      if(game.id === 99996) {
        if (localStorage.token) {
          if (localStorage.Public_User === 'test') {
            this.toastText('彩票游戏暂不支持试玩', 'middle')
          } else {
            this.$router.push({
              name: 'lottery',
              params: {
                series: 99996,
                id: game.id
              },
              query: {
                name: game.name,
                code: 99996
              }
            })
          }
        } else {
          this.goNewLogin()
        }
      }else if(game.id === 99997) {
        //更多游戏
      }else if(game.id === 99998) {
        //活动
        if (this.$config.preview) {
          this.previewAlert()
        } else {
          this.$router.push('/activity')
        }
      }else if (this.$store.state.main.gameSortV4Note.lottery[game.id] && !this.$store.state.main.gameSortV4Note.classification[game.gcid]) {
        //彩票
        if (this.$config.preview) {
          // this.$router.push('/lottery/' + game.id)
          this.previewAlert()
        } else if (localStorage.token) {
          if (localStorage.Public_User === 'test') {
            this.toastText('彩票游戏暂不支持试玩', 'middle')
          } else {
            this.$store.dispatch('main/getStopLotteryCheck', game.id).then(res => {
              if (res.data.length > 0) {
                this.$store.commit('main/stopDialogText', res.data)
                this.$store.commit('main/stopDialog', true)
              } else {
                this.$router.push({
                  name: 'lottery',
                  params: {
                    series: this.$store.state.main.gameSortV4Note.lottery[game.id]['series'],
                    id: game.id
                  },
                  query: {
                    name: game.name,
                    code: this.$store.state.main.gameSortV4Note.lottery[game.id]['code'],
                    cocos: sessionStorage['isCocos'] && sessionStorage['isCocos'] == '1' ? '1' : 0
                  }
                })
              }
            })

          }
        } else {
          this.goNewLogin()
        }
      }else if(game.id >= 10000 && game.id<=10005 || game.id >= 10006 && game.id<=10013) {
        //分类
        if([10001,10004,10005].includes(game.id) && this.$store.state.main.goGameNumber > 9) {
          this.toastText("频繁进入游戏,请稍后再试", "middle")
          if(!this.gameTimer) {
            this.gameTimer = setTimeout(() => {
              this.gameTimer = 0
              this.$store.commit("main/setGoGameNumber", 0);
            }, 12000);
          }
        }else {
          this.$router.push({
            path: '/home/type/' + game.id,
            params: {
              name: game.name,
              id: game.id
            },
            query: {
              name: game.name,
              id: game.id
            }
          })
        }
      }else if(game.isgame) {
        //游戏
        if (localStorage.token) {
          let newWin
          if (this.canOpenInNewWin()) {
            newWin = window.open('about:blank', '_blank');
          }
          this.$store.dispatch('games/gameLoginNew', game.id).then(res => {
            if (res.code === 200) {
              if (newWin) {
                //window.history.pushState('/#/home',null,'/#/home');
                newWin.location.replace(res.data.url);
              } else {//
                //let browserType = window.navigator.userAgent
                if (this.$userAgent.includes('MQQBrowser') || (this.isIphone && this.$userAgent.includes('SogouMobileBrowser'))) {
                  //解决QQ浏览器回退后卡顿问题
                  //解决Iphone 搜狗浏览器回退卡顿问题
                  localStorage.setItem('backStatus', true)
                  sessionStorage.setItem('gameHref', JSON.stringify(this.$route.path))
                  //增加浏览器历史记录
                  window.history.pushState(window.location.href, null, window.location.href);
                  window.location.replace(res.data.url)
                } else {
                  window.location.href = res.data.url
                }
              }
            } else if (res.message) {
              if (newWin) newWin.close()
              this.toastText(res.message, 'top')
            } else if (res.msg) {
              if (newWin) newWin.close()
              this.toastText(res.msg, 'top')
            }
          })
        } else {
          this.goNewLogin()
        }
      }else if(!game.isgame && this.$store.state.main.gameSortV4Note.classification[game.id]) {
        //游戏分类
        if (this.$config.newGame) {
          if([10001,10004,10005].includes(this.$store.state.main.gameSortV4Note.classification[game.id]['series']) && this.$store.state.main.goGameNumber > 9) {
            this.toastText("频繁进入游戏,请稍后再试", "middle")
            if(!this.gameTimer) {
              this.gameTimer = setTimeout(() => {
                this.gameTimer = 0
                this.$store.commit("main/setGoGameNumber", 0);
              }, 12000);
            }
          }else {
            this.$router.push({
              path: `/home/type/${this.$store.state.main.gameSortV4Note.classification[game.id]['series']}`,
              query: {
                navId: game.id
              }
            })
          }
        } else {
          this.$router.push('/home/game/' + game.id)
        }
      }else if(!game.isgame && this.$store.state.main.gameSortV4Note.classification[game.gcid]) {
        //游戏分类
        if (this.$config.newGame) {
          this.$router.push({
            path: `/home/type/${this.$store.state.main.gameSortV4Note.classification[game.gcid]['series']}`,
            query: {
              navId: game.gcid
            }
          })
        } else {
          this.$router.push('/home/game/' + game.id)
        }
      }
    },
    /**
     * 退出
     */
    onLogout() {
      this.$store.dispatch('user/logout', {
        callback: (msg) => {
          if (msg) {
            this.toastText(msg.toString().split(' ')[0], 'middle')
          } else {
            this.$store.dispatch("user/refreshMsgCount").then();
            this.toastText('退出成功', 'middle')
            this.$store.commit("user/setIsShowYuEBao", '');
            this.$store.commit("user/setJieBeiData", {});
            this.$store.commit("user/setIsShowSignin", '');
            if(this.$config.homeLogin) {
              if([ 'jsyl','pjdc','qyg','vnst'].includes( this.$config.home)){
                this.$router.push('/home-login-a')
              }else if (['tycjt'].includes(this.$config.home)){
                this.$router.push('/home-login-b')
              }
              else{
                this.$config.home === 'vns' ? this.$router.push('/home-login-b') 
                :this.$config.home === 'qp' ? this.$router.push('/home-login-c') 
                : this.$router.push('/home-login-a')
              }
            }
            this.$store.commit('main/setClosedNoticeDialog', false)
            // this.$store.commit('main/setClosePK10NoticeDialog', false)
            // this.$store.commit('main/setCloseTypeNoticeDialog', false)
            localStorage.removeItem('noticeId')
          }
          if (!this.$route.path === '/home') {
            this.$router.replace('/')
          }
          setTimeout(() => {
            this.$stomp.reInit()
          }, 1000)
        }
      })
    },
    /**
     * 试玩
     * @param callback
     * @param errBack
     */
    testLogin(callback, errBack) {
      this.$store.dispatch('user/testLogin', {
        callback: res => {
          if (res.code === 200) {
            this.toastText('试玩登陆成功', 'middle')
            if (typeof callback === 'function') {
              callback()
            } else {
              if (typeof errBack === 'function') {
                errBack()
              }
            }
            setTimeout(() => {
              this.$stomp.reInit()
            }, 1000)
          } else {
            this.toastText(res.message, 'middle')
            if (typeof errBack === 'function') {
              errBack()
            }
          }
        },
        errBack
      })
    },
    checkGameTypeShow(name) {
      if (this.$config.gameType && this.$config.gameType.length) {
        switch (name) {
          case '彩票返点':
          case '彩票':
            return this.$config.gameType.includes('lottery') && this.personalMode !== 'mode_b'

          case '棋牌返水':
          case '棋牌':
            return this.$config.gameType.includes('chess')

          case '电子返水':
          case '电子':
            return this.$config.gameType.includes('slot')

          case '体育返水':
          case '体育':
            return this.$config.gameType.includes('sport')

          case '视讯返水':
          case '视讯':
            return this.$config.gameType.includes('live')

          default:
            return true
        }
      } else {
        switch (name) {
          case '彩票返点':
          case '彩票':
            return this.personalMode !== 'mode_b'
          default:
            return true
        }
      }
    },
    /**
     * IOS风格弹窗
     * @param param
     */
    showIosAlert(param) {
      this.$store.commit('main/iosAlert', param)
    },
    checkUserForLogin(userName) {
      if (!userName) {
        this.toastText('帐号不能为空', 'middle')
        return false
      } else if (!/^[A-z0-9]{5,20}$/.test(userName || '')) {
        this.toastText('帐号5-20位字母或数字', 'middle')
        return false
      } else {
        return true
      }
    },
    checkUserForRegister(userName, position) {
      if (!userName) {
        this.toastText('帐号不能为空', position || 'middle')
        return false
      } else if (!/^[A-z0-9]{6,10}$/.test(userName || '')) {
        this.toastText('帐号6-10位字母或数字', position || 'middle')
        return false
      } else {
        return true
      }
    },
    checkPassword(password) {
      if (!password) {
        this.toastText('密码不能为空', 'middle')
        return false
      } else if (!/^[A-z0-9]{6,20}$/.test(password || '')) {
        this.toastText('密码6-20位字母或数字', 'middle')
        return false
      } else {
        return true
      }
    },
    checkPasswordForRegister(password) {
      if (!password) {
        this.toastText('密码不能为空', 'middle')
        return false
      } else if (!/^[A-z0-9]{8,20}$/.test(password || '')) {
        this.toastText('密码8-20位字母或数字', 'middle')
        return false
      } else {
        return true
      }
    },
    checkPassword2(p1, p2) {
      if (p1 !== p2) {
        this.toastText('两次输入的密码不一样', 'middle')
        return false
      } else {
        return true
      }
    },
    async copyText(str) {
      if (!this.isIphone) {
        const dom = document.createElement('A')
        dom.style.position = 'fixed'
        dom.style.left = '-9999px'
        dom.style.top = '-9999px'
        dom.style.zIndex = '9999'
        dom.innerText = str
        document.body.append(dom)
        dom.addEventListener('click', function () {
          const range = document.createRange()
          range.selectNode(dom)
          const selection = window.getSelection()
          if (selection.rangeCount > 0) selection.removeAllRanges()
          selection.addRange(range)
          document.execCommand('copy')
          setTimeout(() => {
            dom.remove()
          })
        })
        dom.click()
      } else {
        const dom = document.createElement('TEXTAREA')
        dom.style.position = 'fixed'
        dom.style.left = '-9999px'
        dom.style.top = '-9999px'
        dom.style.zIndex = '9999'
        dom.value = str
        dom.setAttribute('readonly', 'readonly')
        document.body.appendChild(dom)
        dom.addEventListener('click', function () {
          dom.select()
          document.execCommand('copy', false, null)
          setTimeout(() => {
            dom.remove()
          })
        })
        dom.click()
      }
    },
    savePicture(Url, name) {
      const blob = new Blob([''], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = Url
      a.download = name || Url.replace(/(.*\/)*([^.]+.*)/ig, '$2').split('?')[0]
      const e = document.createEvent('MouseEvents')
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
      URL.revokeObjectURL(url)
    },
    forMartIssu(num) {
      let numStr = ''
      if (typeof num === 'number') {
        num = num.toString()
      }
      if (num.length > 8) {
        numStr = num.substring(8)
      } else {
        numStr = num.includes(new Date().getFullYear()) ? num.substring(4) : num
      }
      return numStr
    },
    randomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10);
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        default:
          return 0;
      }
    },
    goNewLogin() {
      if(!this.isApp) {
        if(this.$config.homeLogin) {
          this.$config.home === 'vns' ? this.$router.push('/home-login-b') 
          : this.$config.home === 'qp' ? this.$router.push('/home-login-c') 
          :this.$router.push('/home-login-a')
        }else {
          this.$router.push('/admin/login')
        }
      }
    }
  }
}
