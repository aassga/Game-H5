export default function (Vue) {
  const $http = Vue.prototype.$http

  const agentModec = {
    namespaced: true,
    state: {
      agentModecData: {},
      PerformanceData: {},
      PerformanceDate: {},
    },
    getters: {},
    mutations: {},
    actions: {
      /** 
       * 代理中心首页信息
       * @returns {Promise<any>}
      */
      agencyPaidToPromoteModeC({ state }) {
        return new Promise((resolve, reject) => {
          if (localStorage.token) {
            $http.post('/agencyPaidToPromoteModeC').then(res => {
              if (res.status === 200) {
                resolve(res.data)
                state.agentModecData = res.data.data
              } else {
                reject(res)
              }
            }).catch(err => {
              reject(err)
            })
          }
        })
      },
      /** 
       * 获取业绩综合
       * @param time
       * @returns {Promise<any>}
      */
      agencyPerformanceLinesModeC({state}, time) {
        return new Promise((resolve, reject) => {
          $http.post('/agencyPerformanceLinesModeC', time).then(res => {
            if (res && res.status === 200) {
              state.PerformanceData = res.data.data
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
       * 获取业绩列表
       * @returns {Promise<any>}
      */
     agencyPerformanceDetailsModeC(store, date) {
      return new Promise((resolve, reject) => {
        $http.post('/agencyPerformanceDetailsModeC', date).then(res => {
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
       * 获取我的团队
       * @param time_start
       * @param time_end
       * @param limit
       * @param page
       * @returns {Promise<any>}
      */
      getMyTeam(store, { data }) {
        return new Promise((resolve, reject) => {
          if (localStorage.token) {
            $http.get('/myTeam', {
              params: data
            }
            ).then(res => {
              if (res && res.status === 200) {
                resolve(res.data)
              } else {
                reject(res)
              }
            }).catch(err => {
              reject(err)
            })
          }
        })
      },
      /** 
       * 返佣比例
       * @returns {Promise<any>}
      */
      agencyPerformanceConfigModeC(store) {
        return new Promise((resolve, reject) => {
          if (localStorage.token) {
            $http.get('/agencyPerformanceConfigModeC').then(res => {
              if (res && res.status === 200) {
                resolve(res.data)
              } else {
                reject(res)
              }
            }).catch(err => {
              reject(err)
            })
          }
        })
      },
    }
  }

  return agentModec
}
