export default function (Vue) {
  const $http = Vue.prototype.$http

  const agencyStore = {
    namespaced: true,
    state: {
      refundRebate: JSON.getObjByLocalStorage('refund-rebate'),
      refundRebateForOpen: JSON.getObjByLocalStorage('refund-rebate'),
      openDataForLook: localStorage['open-data-look'] ? JSON.parse(localStorage['open-data-look']) : null,
      editing: false,
      username: '',
      password: '12345678',
      openTabIndex: 0,
      recodeItem: null,
      intiviData:{},
      jinguanjiaInfo:{},
    },
    getters: {},
    mutations: {},
    actions: {
      agencyIndex () {
        return new Promise((resolve, reject) => {
          $http.get('/agencyIndex').then(res => {
            if (res && res.status === 200) {
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 代理转帐
       * @param store
       * @param money
       */
      changeMoney (store, { money }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/agency/agencyToMember',
            { money }
          ).then(res => {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 获取反水数据
       * @param state
       * @returns {Promise<any>}
       */
      getRefundRebate ({ state }) {
        return new Promise((resolve, reject) => {
          if (localStorage.token) {
            $http.get('/rate').then(res => {
              if(!res){
                return;
              }   
              res = res.data

              let newData = []
              if(JSON.parse(localStorage.siteConfig).home == 'tc' ){
                res.data.forEach(ff=>{
                  if(ff.type_en == "LOTTERY" || ff.type_en == "CHESS") {
                    newData.push(ff)
                  }
                })
              }else{
                newData = res.data
              }

              if (res.code === 200) {
                state.refundRebateForOpen = JSON.copyObj(newData)
                state.refundRebate = JSON.copyObj(newData)
                localStorage['refund-rebate'] = JSON.stringify(newData)
              }
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          }
        })
      },
      getLowerRefundRebate (store, uid) {
        return new Promise((resolve, reject) => {
          if (localStorage.token) {
            $http.get('/descendentsRate', {
              params: { uid }
            }).then(res => {
              res = res.data
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          }
        })
      },
      modifyRate (store, { uid, json }) {
        return new Promise((resolve, reject) => {
          if (localStorage.token) {
            $http.post('/modifyRate', { uid, json }).then(res => {
              res = res.data
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          }
        })
      },
      createAccount (store, data) {
        return new Promise((resolve, reject) => {
          if (localStorage.token) {
            $http.post('/createAccount', data).then(res => {
              res = res.data
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          }
        })
      },
      createInvite (store, data) {
        return new Promise((resolve, reject) => {
          if (localStorage.token) {
            $http.post('/createInvite', data).then(res => {
              res = res.data
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          }
        })
      },
      getInviteList (store, { page, limit }) {
        return new Promise((resolve, reject) => {
          if (localStorage.token) {
            // if(!localStorage.getInviteList){
              $http.get('/inviteList', {
                params: {
                  page,
                  limit
                }
              }).then(res => {
                res = res.data;
                localStorage.getInviteList = JSON.stringify(res);
                resolve(res)
              }).catch(err => {
                reject(err)
              })
            // }
            // else{
            //   let getInviteList = JSON.parse(localStorage.getInviteList)
            //   resolve(getInviteList)
            // }
          }
        })
      },
      /**
       * 团队余额&&佣金(共用)
       * @param store
       * @param username
       * @param limit
       * @param page
       * @param startTime
       * @param endTime
       * @param type
       * @constructor
       */
      AgencyFinanceList (store, { username, limit, page, startTime, endTime, type ,typep }) {
        return new Promise((resolve, reject) => {
          const data = {}
          if (username) data.username = username
          if (limit) data.limit = limit
          if (page) data.page = page

          data.startTime = startTime
          data.endTime = endTime
          data.type = type
          data.typep = typep || 0
          $http.post(
            '/AgencyFinanceList',
            data
          ).then(res => {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 佣金明细
       * @param store
       * @param username
       * @param limit
       * @param page
       * @param startTime
       * @param endTime
       * @param type
       * @constructor
       */
      CommissionDateil (store, { username, limit, page, startTime, endTime, type }) {
        return new Promise((resolve, reject) => {
          const data = {}
          if (username) data.username = username
          if (limit) data.limit = limit
          if (page) data.page = page

          data.startTime = startTime
          data.endTime = endTime
          data.type = type

          $http.post(
            '/commissionDetail',
            data
          ).then(res => {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 团队盈利
       * @param store
       * @param startTime
       * @param endTime
       * @returns {Promise<any>}
       * @constructor
       */
      AgencyProfit (store, { startTime, endTime }) {
        return new Promise((resolve, reject) => {
          const data = {}
          data.startTime = startTime
          data.endTime = endTime

          $http.post('/AgencyProfit', data).then(res => {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 我的团队
       * @param store
       * @param data
       * @param page
       * @returns {Promise<any>}
       */
      agencyMyteam (store, { data, page }) {
        return new Promise((resolve, reject) => {
          $http.post('/agencyMyteam', data, {
            params: {
              page
            }
          }).then(res => {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      agencyReport (store, data) {
        return new Promise((resolve, reject) => {
          $http.post('/agencyReport', data).then(res => {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      agencyNextReport (store, data) {
        return new Promise((resolve, reject) => {
          $http.post('/agencyNextReport', data).then(res => {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      agencyGameRecords (store, data) {
        return new Promise((resolve, reject) => {
          $http.get('/agencyGameRecords', {
            params: data
          }).then(res => {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      agencyShareoutbonusCheck (store) {
        return new Promise((resolve, reject) => {
          $http.get('/agencyShareoutbonusCheck').then(res => {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      agencyShareoutbonusSend (store, id) {
        return new Promise((resolve, reject) => {
          $http.post('/agencyShareoutbonusSend', { id }).then(res => {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      agencyLinkDeleted (store, id) {
        return new Promise((resolve, reject) => {
          $http.get('/deleteInvite',{params:id}).then(res => {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      agencyShareoutbonusList (store) {
        return new Promise((resolve, reject) => {
          $http.get('/agencyShareoutbonusList').then(res => {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      lowerUp (store, uid) {
        return new Promise((resolve, reject) => {
          $http.post('/lowerUp', {
            uid,
            is_agency: 1
          }).then(res => {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 获取邀请信息
      getInvitation ({state}, data) {
        return new Promise((resolve, reject) => {
          $http.post('/inviteFriendsToRegister', data).then(res => {
            if (res.status === 200) {
              resolve(res.data)
              if(data.activityType === 'getInvitation') {
                if(res.data.data.domain.includes('/#/#/')) {
                  res.data.data.domain = res.data.data.domain.replace("#/","")
                }
                state.intiviData = res.data.data
              }
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 金管家信息
      memberCenterJinguanjiaInfo ({state}) {
        return new Promise((resolve, reject) => {
          $http.post('/memberCenterJinguanjiaInfo', {
            type : 'memberCenterJinguanjiaInfo'
          }).then(res => {
            if (res.status === 200) {
              if(res.data.code === 200) {
                localStorage['jinguanjiaInfo'] = JSON.stringify(res.data.data)
                state.jinguanjiaInfo = res.data.data
              }
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
    }
  }
  return agencyStore
}
