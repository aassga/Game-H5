export default function (Vue) {
  const $http = Vue.prototype.$http

  const lotteryStore = {
    namespaced: true,
    state: {
      leftMenu: [],
      playWayStatus: {},
      allPlayWay: null,
      lotteryNoCount:0
    },
    getters: {},
    mutations: {
      /**
       * 检查玩法赔率
       */
      checkPlayWay (state) {
        if (localStorage['refund-rebate'] && state.allPlayWay && localStorage['rebateLotteryConfig']) {
          const allPlayWay = JSON.parse(JSON.stringify(state.allPlayWay))
          const refundRebate = JSON.getObjByLocalStorage('refund-rebate')
          const rebateLotteryConfig = JSON.getObjByLocalStorage('rebateLotteryConfig')
          if (allPlayWay && refundRebate && rebateLotteryConfig) {
            const lotteryRefundRebate = refundRebate.find(item => item['type_en'] === 'LOTTERY').list

            setTimeout(function () {
              allPlayWay.forEach(playWay => {
                const siteOdds = parseFloat(rebateLotteryConfig[playWay.id])
                const userRebate = lotteryRefundRebate.find(rebate => rebate['platform_cn'] === playWay.name)
                if (userRebate) {
                  const userOdds = parseFloat(userRebate.val)
                  playWay.data.forEach(big => {
                    big.items.forEach(small => {
                      small.code.forEach(code => {
                        if (code.odds.toString().includes('/')) {
                          const maxOdds1 = parseInt((parseFloat(code.odds.toString().split('/')[0]) * 1000).toString())
                          const maxOdds2 = parseInt((parseFloat(code.odds.toString().split('/')[1]) * 1000).toString())
                          const odds1 = Math.floor(maxOdds1 * (100 - (siteOdds - userOdds)) * 10 / 1000) / 1000
                          const odds2 = Math.floor(maxOdds2 * (100 - (siteOdds - userOdds)) * 10 / 1000) / 1000
                          code.odds = (odds1.toString().includes('.') ? odds1.toFixed(1) : odds1 ) + '/' + (odds2.toString().includes('.') ? odds2.toFixed(1) : odds2 )
                        } else {
                          const maxOdds = parseInt((parseFloat(code.odds) * 1000).toString())
                          code.odds = Math.floor(maxOdds * (100 - (siteOdds - userOdds)) * 10 / 1000) / 1000
                        }
                      })
                    })
                  })

                  const data = JSON.stringify({
                    data: {
                      code: 200,
                      data: playWay.data,
                      message: '成功',
                      status: 'success'
                    },
                    request: {},
                    status: 200,
                    statusText: 'OK'
                  })

                  if (localStorage['lottery/getPlayWaySet/' + playWay.id] !== data) {
                    localStorage['lottery/getPlayWaySet/' + playWay.id] = data
                    const playWayStatus = JSON.copyObj(state.playWayStatus)
                    playWayStatus[playWay.id.toString()] = true
                    state.playWayStatus = playWayStatus
                  }
                }
              })
            }, 0)
          }
        }
      }
    },
    actions: {
      /**
       * 获取所有彩种玩法
       * @returns {Promise}
       */
      getAllPlayWay (store) {
        return new Promise((resolve, reject) => {
          delete localStorage['/lottery/getPlaywaySetAll']
          if (localStorage.token) {
            $http.get('/lottery/getPlaywaySetAll').then(res => {
              res = res.data
              if (res.code === 200) store.state.allPlayWay = res.data
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          } else {
            setTimeout(function () {
              reject(new Error())
            }, 0)
          }
        })
      },
      /**
       * 获取左侧菜单
       * @param store
       * @param prePage
       * @param filter
       * @param callback
       */
      getMenuList (store, { prePage = 12, filter, callback }) {
        if (localStorage['lottery/getMenuList']) {
          let res = []
          try {
            res = JSON.parse(localStorage['lottery/getMenuList'])
          } catch (e) {
            console.error(e)
          }
          if (typeof filter === 'function') res = filter(res)
          if (typeof callback === 'function') callback(res.splice(0, prePage))
        }
        $http.post('/games/lottery/leftMenu', { prePage: 100 }).then(res => {
          res = res.data
          if (res['code'] === 200) {
            res = res.data
            localStorage['lottery/getMenuList'] = JSON.stringify(res)
            if (typeof filter === 'function') res = filter(res)
            callback(res.splice(0, prePage))
          }
        })
      },
       /**
       * 获取左侧新菜单
       * @param store
       * @param prePage
       * @param filter
       * @param callback
       */
      getNewSlide(store, {callback} ){
        if (!!localStorage['lottery/getNewSilde']) {
            let res = []
            try {
              res = JSON.parse(localStorage['lottery/getNewSilde'])
            } catch (e) {
              console.error(e)
            }
            if (typeof callback === 'function') callback(res)
          }else{
            $http.get('/mobileGameShow').then(res => {
              res = res.data
              if (res['code'] === 200) {
                res = res.data
                localStorage['lottery/getNewSilde'] = JSON.stringify(res)
                callback(res)
              }
          })
        }
      },
      /**
       * 获取开奖走势
       * @param store
       * @param id
       * @param callback
       */
      getResultsPage (store, { lotteryId, pageSize, date, callback }) {
        if (localStorage['lottery/getResultsPage/' + lotteryId]) {
          if (typeof callback === 'function') callback(JSON.parse(localStorage['lottery/getResultsPage/' + lotteryId]))
        }
        $http.post('/lottery/getResults', { lotteryId, pageSize, date }).then(res => {
          if (res && res.data && res.data.code === 200) {
            localStorage['lottery/getResultsPage/' + lotteryId] = JSON.stringify(res)
          }
          if (typeof callback === 'function') callback(res)
        })
      },
      /**
       * 获取取开奖结果
       * @param store
       * @param id
       * @param callback
       * @param noToast
       */
      getResults (store, { id, callback, noToast }) {
        delete localStorage['lottery/getResults/' + id]
        $http.post('/lottery/resultsnew', { lotteryId: id }, {
          headers: {
            noToast
          }
        }).then(res => {
          if (typeof callback === 'function') callback(res)
        })
      },
      /**
       * 刷新开奖结果
       * @param store
       * @param id
       */
      refreshResult ({ dispatch }, id) {
        return new Promise((resolve, reject) => {
          if (id && !isNaN(parseInt(id.toString()))) {
            $http.get('/lottery/getIssue/' + id).then(res => {
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          } else {
            reject()
          }
        })
      },
      /**
       * 获取走势数据
       * @param store
       * @param data
       * @param callback
       * @param status
       */
      getTrend (store, { data, callback, noToast }) {
        const key = `lottery/getTrend/${data.lotteryId}/${data.pageSize}`
        if (data.pageSize === 10) {
          const res = JSON.getObjByLocalStorage(key)
          if (typeof callback === 'function' && res) callback(res)
        } else {
          delete localStorage[key]
        }
        $http.post(
          '/lottery/trend',
          data,
          {
            handler: {
              noToast
            }
          }).then(res => {
          // if (data.pageSize !== 10 && res && res.data && res.data.code === 200) localStorage[key] = JSON.stringify(res)
          delete localStorage[key]
          if (typeof callback === 'function') callback(res)
        })
      },
      /**
       * 获取玩法
       * @param store
       * @param id
       * @param callback
       */
      getPlayWaySet (store, { id, callback }) {
        if (localStorage['lottery/getPlayWaySet/' + id]) {
          if (typeof callback === 'function') callback(JSON.parse(localStorage['lottery/getPlayWaySet/' + id]))
        } else {
          $http.get(
            '/lottery/getPlaywaySet/' + id
          ).then(res => {
            localStorage['lottery/getPlayWaySet/' + id] = JSON.stringify(res)
            if (typeof callback === 'function') callback(res)
          })
        }
      },
      /**
       * 提交下注
       * @param store
       * @param data
       * @param callback
       */
      submit (store, { data, callback }) {
        data.code = JSON.stringify(data.code)
        $http.post('/lottery/submit', data).then(res => {
          if (typeof callback === 'function') callback(res)
        }).catch(err => {
          if (typeof callback === 'function') callback(err, true)
        })
      },
      /**
       * 获取彩票游戏列表
       * @param store
       * @param callback
       */
      getGames (store, { callback }) {
        if (localStorage['lottery/getGames']) {
          if (typeof callback === 'function') callback(JSON.parse(localStorage['lottery/getGames']))
        }
        $http.post('/games/lottery/category').then(res => {
          localStorage['lottery/getGames'] = JSON.stringify(res)
          if (typeof callback === 'function') callback(res)
        })
      },
      getLotteryNoCount (store) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/games/getLotteryNoCount'
          ).then(res => {
            res = res.data;
            store.state.lotteryNoCount = res.data;
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 获取开元棋牌数据
       * @param store
       * @param callback
       */
      getKYChess (store, { callback }) {
        if (localStorage['getKYChess']) {
          if (typeof callback === 'function') callback(JSON.parse(localStorage['getKYChess']))
        }
        $http.post(
          '/games/index',
          {
            classId: 42,
            devices: 'h5',
            tag: '',
            name: ''
          }
        ).then(res => {
          res = res.data
          if (res.code === 200) {
            localStorage['getKYChess'] = JSON.stringify(res.data)
            if (typeof callback === 'function') callback(res.data)
          }
        })
      },
      /**
       * 获取奖池 快速彩票
       * @param store
       * @param lotteryId
       * @param callback
       */
      getprizePool (store, {callback}) {
        $http.get('/prizePool')
          .then(res => {
          res = res.data
          if (res.code === 200) {
            if (typeof callback === 'function') callback(res.data)
          }
        })
      },
      /**
       * 获取中奖名单列表
       * @param store
       * @param lotteryId
       * @param callback
       */
      getWinnerList({ dispatch }, id) {
        return new Promise((resolve, reject) => {
            $http.get('/lotteryJackpot?lid='+id).then(res => {
              if(res.status == 200){
                resolve(res.data)
              }
            }).catch(err => {
              reject(err)
            })
          })
      },
      /**
       * 获取长龙初始化数据
       * @param store
       * @param callback
       */
      getLongDragon (store, {callback}) {
        $http.get('/lotteryLongDragon')
          .then(res => {
          res = res.data
          if (res.code === 200) {
            if (typeof callback === 'function') callback(res.data)
          }
        })
      },
      /**
       * 获取会员下注彩种的历史记录
       * @param store
       * @param callback
       */
      getBetHistory (store, {callback}) {
        $http.get('/gameBetHistory')
          .then(res => {
          res = res.data
          if (res.code === 200) {
            if (typeof callback === 'function') callback(res.data)
          }
        })
      },
      /**
       * 获取所有彩种倒计时时间
       * @param store
       * @param callback
       */
      getLotteryTime({ dispatch }, id) {
        return new Promise((resolve, reject) => {
            $http.get('/lottery/getIssuesV4?id='+id).then(res => {
              if(res.status == 200){
                resolve(res.data)
              }
            }).catch(err => {
              reject(err)
            })
          })
      },
    }
  }

  return lotteryStore
}
