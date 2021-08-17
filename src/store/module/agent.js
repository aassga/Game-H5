export default function (Vue) {
  const $http = Vue.prototype.$http

  const KEYS = {
    REFUND_REBATE: 'refund-rebate'
  }

  const agentStore = {
    namespaced: true,
    state: {
      agentListSelected: null,
      refundRebate: JSON.getObjByLocalStorage(KEYS.REFUND_REBATE),
      refundRebateForOpen: JSON.getObjByLocalStorage(KEYS.REFUND_REBATE),
      openAgentOdds: null
    },
    getters: {},
    mutations: {},
    actions: {
      /**
       * 代理转帐
       * @param store
       * @param money
       */
      changeMoney (store, { money }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/agency/agencyToMember',
            { money },
            {
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 今日收益
       * @returns {Promise<any>}
       */
      todayEarnings () {
        return new Promise((resolve, reject) => {
          $http.get(
            '/agency/todayEarnings',
            {
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 获取代理收益预览
       * @param store
       * @param date
       * @returns {Promise<any>}
       */
      myEarnings (store, { date }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/agency/myEarnings',
            { date },
            {
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 获取代理收益明细
       * @param store
       * @param date
       * @param page
       * @param pageSize
       * @returns {Promise<any>}
       */
      myEarningsSecond (store, { date, page, pageSize }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/agency/myEarningsSecond',
            { date, pageSize },
            {
              params: {
                page
              },
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 获取下级人数
       * @param store
       * @param date
       * @returns {Promise<any>}
       */
      lowerPeople (store, { date }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/agency/lowerPeople',
            { date },
            {
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 获取代理报表
       * @param store
       * @param date
       * @param callback
       * @returns {Promise<any>}
       */
      agencyReport (store, { date, callback }) {
        const key = 'agent/agencyReportByUser'

        if (localStorage[key] && typeof callback === 'function') {
          let res = null

          try {
            res = JSON.parse(localStorage[key])
          } catch (e) {
            localStorage[key] = ''
          }

          callback(res)
        }

        $http.post(
          '/agency/agencyReport',
          {
            date
          },
          {
            headers: {
              // Accept: 'application/x.tg.v2+json'
            }
          }
        ).then(res => {
          localStorage[key] = JSON.stringify(res.data)

          if (typeof callback === 'function') {
            callback(res.data)
          }
        }).catch(() => {
          localStorage[key] = ''

          if (typeof callback === 'function') {
            callback(null)
          }
        })
      },
      /**
       * 获取下级列表
       * @param store
       * @param type
       * @param uid
       * @param pageSize
       * @param page
       */
      lowerList (store, { type, uid, pageSize, page }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/agency/lowerList',
            { type, uid, pagesize: pageSize },
            {
              params: {
                page
              },
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 升级普通会员为代理
       * @param store
       * @param uid
       * @returns {Promise<any>}
       */
      lowerUpStatus (store, { uid }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/agency/lowerUpStatus',
            { uid, val: 'yes', type: 2 },
            {
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
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
            $http.get(
              '/member/refund-rebate',
              {
                headers: {
                  // Accept: 'application/x.tg.v2+json'
                }
              }
            ).then(res => {
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
                localStorage[KEYS.REFUND_REBATE] = JSON.stringify(newData)
              }
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          }
        })
      },
      /***
       * 更新代理返点
       * @param store
       * @param uid
       * @param data
       * @returns {Promise<any>}
       */
      lowerUpRefund (store, { uid, data }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/agency/lowerUpRefund',
            {
              uid,
              json_value: JSON.stringify(data)
            },
            {
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 代理赔率计算
       * @param store
       * @param lid
       * @param dot
       * @returns {Promise<any>}
       */
      getPlaywaySet (store, { lid, dot }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/agency/getPlaywaySet',
            {
              lid,
              dot
            },
            {
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 获取下级财务
       * @param store
       * @param type
       * @param date
       * @param page
       * @param limit
       */
      lowerFinance (store, { type, date, page, limit = 12 }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/agency/lowerFinance',
            {
              date,
              type,
              pagesize: limit
            },
            {
              params: {
                page
              },
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 下级报表列表
       * @param store
       * @param date
       * @param uid
       * @param page
       * @param pageSize
       * @returns {Promise<any>}
       */
      lowerReport (store, { date, uid, page, pageSize }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/agency/lowerReport',
            {
              date,
              uid,
              pagesize: pageSize
            },
            {
              params: {
                page
              },
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 获取会员代理报表
       * @param store
       * @param date
       * @param userName
       * @param callback
       * @returns {Promise<any>}
       */
      agencyReportByUser (store, data) {
        const key = 'agent/agencyReportByUser/' + (data.uid || '')
        const callback = data.callback
        delete data.callback
        if (localStorage[key] && typeof callback === 'function') {
          let res = null

          try {
            res = JSON.parse(localStorage[key])
          } catch (e) {
            localStorage[key] = ''
          }

          callback(res)
        }

        $http.post(
          '/agency/agencyReport',
          data,
          {
            headers: {
              // Accept: 'application/x.tg.v2+json'
            }
          }
        ).then(res => {
          localStorage[key] = JSON.stringify(res.data)

          if (typeof callback === 'function') {
            callback(res.data)
          }
        }).catch(() => {
          localStorage[key] = ''

          if (typeof callback === 'function') {
            callback(null)
          }
        })
      },
      /**
       * 创建下级帐户
       * @param store
       * @param type
       * @param name
       * @param password
       * @param json
       */
      createAccount (store, { type, name, password, json }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/member/create-account',
            {
              account_type: type,
              account_name: name,
              account_password: password,
              json_value: JSON.stringify(json)
            },
            {
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 创建邀请
       * @param store
       * @param type
       * @param json
       */
      domainAdd (store, { type, json }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/agency/domainAdd',
            {
              type,
              json_value: JSON.stringify(json)
            },
            {
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 分页获取邀请链接
       * @param store
       * @param page
       * @param pageSize
       * @returns {Promise<any>}
       */
      domainList (store, { page, pageSize }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/agency/domainList',
            {
              pagesize: pageSize
            },
            {
              params: {
                page
              },
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      domainUp (store, { id, status }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/agency/domainUp',
            {
              id,
              status
            },
            {
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      }
    }
  }

  return agentStore
}
