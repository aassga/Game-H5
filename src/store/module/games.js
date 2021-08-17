export default function (Vue) {
  const $http = Vue.prototype.$http

  const gameStore = {
    namespaced: true,
    state: {
      leftMenu: [],
    },
    getters: {},
    mutations: {},
    actions: {
      /**
       * 获取左侧菜单
       * @param store
       * @param prePage
       * @param callback
       */
      getMenuList(store, { prePage = 12, callback }) {
        if (localStorage['lottery/getMenuList']) {
          let res = []
          try {
            res = JSON.parse(localStorage['lottery/getMenuList'])
          } catch (e) {
            console.error(e)
          }
          if (typeof callback === 'function') callback(res.splice(0, prePage))
        }
        $http.post('/games/lottery/leftMenu', { prePage: 100 }).then(res => {
          localStorage['lottery/getMenuList'] = JSON.stringify(res.data)
          callback(res.data.splice(0, prePage))
        })
      },
      getList(store, { classId, devices, tag, name, callback }) {
        if (localStorage['games/getList']) {
          let res = []
          try {
            res = JSON.parse(localStorage['games/getList'])
          } catch (e) {
            console.error(e)
          }
          if (typeof callback === 'function') callback(res.splice(0, classId))
        }
        $http.post('/games/index', { classId, devices, tag, name }).then(res => {
          res = res.data
          if (res['code'] === 200) {
            localStorage['games/getList'] = JSON.stringify(res.data)
            callback(res.data.splice(0, classId))
          }
        })
      },
      /**
       * 第三方游戏登录
       * @param store
       * @param game
       * @returns {Promise<any>}
       */
      gameLogin(store, game) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/games/login',
            {
              gameName: game.gameName,
              userType: localStorage.Public_User === 'test' ? 1 : 0,
              platform: game.platform,
              device: 'h5'
            }
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 第三方游戏登录
       * @param store
       * @param game
       * @returns {Promise<any>}
       */
      gameLoginNew(store, id) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/games/login',
            {
              id,
              device: 'h5'
            }
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 新版游戏列表
      getGameSort(store, typeId) {
        let apiStr = ''
        switch (typeId) {
          case '10001':
            apiStr = '/gameSortSlot'
          break;
          case '10004':
            apiStr = '/ChessFishSort'
          break;
          case '10005':
            apiStr = '/ChessFishSort'
          break;
        }
        return new Promise((resolve, reject) => {
          $http.post(apiStr, {
            device: 'h5',
            type: typeId === '10001' ? "" : typeId === '10004' ? '1' : '2'
          }
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 新版游戏收藏列表
      getMemberCollectGames(store, type) {
        return new Promise((resolve, reject) => {
          $http.post('/memberCollectGamesV4', {
            type
          }
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      //新版游戏轮播列表
      getSlideshowList(store,data) {
        return new Promise((resolve, reject) => {
          $http.post('/slideshowList',data).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 新版游戏加入收藏
      collectGame(store, data) {
        return new Promise((resolve, reject) => {
          $http.post('/collectGameV4', data).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 新版游戏删除收藏和收藏排序
      deleteCollectGame(store, data) {
        return new Promise((resolve, reject) => {
          $http.post('/deleteCollectGameV4', data
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 新版游戏我的最爱
      getMyloveGame(store, data) {
        return new Promise((resolve, reject) => {
          $http.post('/myloveGame', data
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
    }
  }
  return gameStore
}
