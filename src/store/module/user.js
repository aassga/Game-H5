export default function (Vue) {
  const $http = Vue.prototype.$http

  const USER_INFO = 'userInfo'
  const USER_RECORD_LIST = 'user-record-list'
  const USER_TOKEN = 'token'
  const USER_PUBLIC_USER = 'Public_User'
  const USER_SELECTED_BANK_ID = 'user-selected-bank-id'
  const USER_SELECTED_USDT_ID = 'user-selected-usdt-id'
  const userStore = {
    namespaced: true,
    state: {
      userNameOfAgent: '',
      userNameOfReport: '',
      HOST_NAME: '',
      token: localStorage[USER_TOKEN] || '',
      selectedBankId: parseInt(localStorage[USER_SELECTED_BANK_ID]) || NaN,
      selectedUsdtId: parseInt(localStorage[USER_SELECTED_USDT_ID]) || NaN,
      userInfo: initUser(),
      // 未读消息数量
      msgCount: {},
      // 验证码相关数据
      code: {
        authImg: '',
        code: '',
      },
      // 网易盾驗證 key
      wyCode: '',
      bankData: [],
      usdtData: [],
      // 记住的用户名密码信息
      userRecordList: JSON.getObjByLocalStorage(USER_RECORD_LIST) || [],
      // 用户头像
      avatars: [
        'photo1.png',
        'photo2.png',
        'photo3.png',
        'photo4.png',
        'photo5.png',
        'photo6.png',
        'photo7.png',
        'photo8.png',
        'photo9.png',
        'photo10.png',
        'photo11.png',
        'photo12.png',
        'photo13.png',
        'photo14.png',
        'photo15.png',
        'photo16.png',
        'photo17.png',
        'photo18.png',
        'photo19.png',
        'photo20.png',
        'photo21.png',
        'photo22.png',
        'photo23.png',
        'photo24.png'
      ],
      isShowSignin: '',
      isShowYuEBao: '',
      YuEBaoData: {},
      jieBeiData: {},
      takeTabIndex: 0,
      Watchman:{},
      WatchmanNumber: 0,
      saveUserName : false
    },
    getters: {
      getUser: state => state.userInfo
    },
    mutations: {
      setSaveUserName(state, bool) {
        state.saveUserName = bool
      },
      setUserNameOfAgent(state, name) {
        state.userNameOfAgent = name
      },
      setUserNameOfReport(state, name) {
        state.userNameOfReport = name
      },
      setSelectedBank(state, id) {
        localStorage[USER_SELECTED_BANK_ID] = state.selectedBankId = id
      },
      setSelectedUsdt(state, id) {
        localStorage[USER_SELECTED_USDT_ID] = state.selectedUsdtId = id
      },
      /**
       * 设置token
       * @param state
       * @param token
       */
      setToken(state, token) {
        localStorage[USER_TOKEN] = token
        state.token = localStorage[USER_TOKEN] || ''
      },

      /**
       * 更新用户信息
       * @param state
       * @param val
       */
      setUser(state, { userInfo, type }) {
        JSON.setObjByLocalStorage(USER_INFO, userInfo)
        state.userInfo = JSON.getObjByLocalStorage(USER_INFO)

        if (type) {
          localStorage[USER_PUBLIC_USER] = type
        }

        // 判断不输入对密码的情况（不过期并且值存在）vm上面加，试玩在试玩按钮
        if (localStorage.Public_User && localStorage.Public_User === 'vm') {
          userStore.state.HOST_NAME = '/frontend/vm'
        } else if (localStorage.Public_User && localStorage.Public_User === 'test') {
          userStore.state.HOST_NAME = '/frontend/test'
        } else {
          userStore.state.HOST_NAME = '/frontend/v1'
        }
      },
      /**
       * 记住密码
       * @param state
       * @param data
       */
      setRecord(state, data) {
        JSON.setObjByLocalStorage(USER_RECORD_LIST, data || [])
        state.userRecordList = JSON.getObjByLocalStorage(USER_RECORD_LIST)
      },
      /**
       * 清除登录
       * @param state
       */
      clean(state, status) {
        if (!status) {
          // const config = localStorage['config']
          // const type = localStorage[USER_PUBLIC_USER]
          // localStorage.clear()
          // localStorage['config'] = config
          // localStorage[USER_PUBLIC_USER] = type
        }

        state.userInfo = localStorage[USER_INFO] = ''
        state.token = localStorage[USER_TOKEN] = ''
        localStorage[USER_PUBLIC_USER] = ''

        checkHost()
      },
      setIsShowSignin(state, str) {
        state.isShowSignin = str
      },
      setIsShowYuEBao(state, str) {
        state.isShowYuEBao = str
      },
      setJieBeiData(state, data) {
        state.jieBeiData = data
      },
      setWyCode(state, key) {
        state.wyCode = key
      }
    },
    actions: {
      checkCommission(store, type) {
        return new Promise((resolve, reject) => {
          $http.post('/agency/commissionType', { type }).then(res => {
            res = res.data
            if (res.code === 200) {
              resolve(res)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      /*
      * 获取手机验证码
      * @parmas phoneNumber
      */
      getPhoneCode(store, { phone, callback }) {
        if (typeof callback === 'function') {
          $http.get('/getSmsCode',
            {
              params: {
                device: 'h5',
                phone: phone,
              },
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }).then(res => {
              res = res.data
              callback(res)
            })
        }
      },
      /*
      * 绑定手机号
      */
      validateSmsPhone(store, { phone,code, callback }) {
        if (typeof callback === 'function') {
          $http.post('/validateSmsPhone',{
            device: 'h5',
            phone:phone,
            code:code
          }).then(res => {
              res = res.data
              callback(res)
            })
        }
      },
      /**
       * 刷新token
       * @param commit
       * @param state
       * @param callback
       */
      refreshToken({ commit, state }, { callback }) {
        $http.post('/member/refresh').then(res => {
          res = res.data
          if (res['code'] === 200) {
            commit('setToken', res.data['token'] || res.data)
            commit('setUser', {
              userInfo: res.data['userInfo'] || res.data['userinfo']
            })
          }
        })
      },
      /**
       * 注册
       * @param store
       * @param username
       * @returns {Promise<any>}
       */
      checkUserName(store, username) {
        return new Promise((resolve, reject) => {
          $http.post('/checkUsername/' + username).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 注册
       * @param commit
       * @param state
       * @param dispatch
       * @param data
       * @param callback
       */
      register({ commit, state, dispatch }, { data, callback }) {
        // 检查用户名是否可用
        $http.post('/checkUsername/' + data.userName).then(res => {
          res = res.data
          if (res['code'] === 200) {
            if(state.Watchman && state.Watchman.getToken) {
              state.Watchman.getToken('b0ee4d4447ca4bdb8a39b92a27378b8e', (token) => {
                if(token && token !== '') {
                  data['anti_code'] = token
                  state.WatchmanNumber = 0
                  dispatch('registerHttp', { data, callback })
                }else if(state.WatchmanNumber < 3){
                  state.WatchmanNumber += 1
                  dispatch('register',{ data, callback })
                }
              });
            }else {
              dispatch('registerHttp', { data, callback })
            }
          } else {
            // 用户名不可用
            if (typeof callback === 'function') callback(res['message'])
          }
        })
      },
      registerHttp({ commit, state, dispatch }, { data, callback }) {
         // 注册
         $http.post('/userRegister',
         Object.assign(data, { captcha_key: state.code.authCode, device: 'h5' }),
         {
           headers: {
             // Accept: 'application/x.tg.v2+json'
           }
         }
       ).then(registerRes => {
         registerRes = registerRes.data
         if (registerRes['code'] === 200) {
           if (registerRes.data.userInfo.userType === 'vm' && localStorage[USER_PUBLIC_USER] !== 'vm') {
             localStorage[USER_PUBLIC_USER] = 'vm'
             checkHost()
             dispatch('register', { data, callback })
           } else {
             commit('setToken', registerRes.data['token'])
             commit('setUser', {
               userInfo: registerRes.data.userInfo,
               type: localStorage[USER_PUBLIC_USER] || 'v1'
             })
             checkHost()
             if (typeof callback === 'function') callback(registerRes)
           }
           setTimeout(() => {
            dispatch('main/socketHandle', {}, {root: true})
          }, 0);
         } else {
           localStorage[USER_PUBLIC_USER] = ''
           commit('clean', true)
           if (typeof callback === 'function') callback(registerRes)
         }
       })
      },
      /**
       * 登录
       * @param commit
       * @param state
       * @param dispatch
       * @param data
       * @param callback
       */
      login({ commit, state, dispatch }, { data, callback }) {
        if(localStorage['jinguanjiaInfo']) localStorage.removeItem('jinguanjiaInfo')
        if(state.Watchman && state.Watchman.getToken) {
          state.Watchman.getToken('b0ee4d4447ca4bdb8a39b92a27378b8e', (token) => {
            if(token && token !== '') {
              data['anti_code'] = token
              state.WatchmanNumber = 0
              dispatch('loginHttp', { data, callback })
            }else if(state.WatchmanNumber < 3){
              state.WatchmanNumber += 1
              dispatch('login',{ data, callback })
            }
          });
        }else {
          dispatch('loginHttp', { data, callback })
        }
      },

      loginHttp({ commit, state, dispatch}, { data, callback }) {
        $http.post(
          '/login',
          Object.assign(data, { captcha_key: state.code.authCode, device: 'h5' }),
          {
            headers: {
              // Accept: 'application/x.tg.v2+json'
            }
          }
        ).then(res => {
          res = res.data
          if (res['code'] === 200) {
            if (res.data.userInfo.userType === 'vm' && localStorage[USER_PUBLIC_USER] !== 'vm') {
              localStorage[USER_PUBLIC_USER] = 'vm'
              checkHost()
              dispatch('vmLogin', { data, callback })
            } else {
              let recordList = JSON.getObjByLocalStorage(USER_RECORD_LIST)
              if (recordList && recordList.length) {
                recordList.forEach((item, i) => {
                  if (item.userName === data.userName) {
                    recordList.splice(i, 1)
                    if (!data.record) {
                      let obj = {
                        userName: data.userName,
                        password: data.password
                      }
                      recordList.unshift(obj)
                    }
                  }
                })
                if (data.record) {
                  let obj = {
                    userName: data.userName,
                    password: data.password
                  }
                  recordList.unshift(obj)
                }
              } else {
                if (data.record) {
                  recordList = [{
                    userName: data.userName,
                    password: data.password
                  }]
                }
              }
              commit('setRecord', recordList)
              commit('setToken', res.data['token'])
              commit('setUser', {
                userInfo: res.data.userInfo,
                type: localStorage[USER_PUBLIC_USER] || 'v1'
              })
              checkHost()
              if (typeof callback === 'function') callback(res)
            }
            setTimeout(() => {
              dispatch('main/socketHandle', {}, {root: true})
            }, 0);
          } else {
            localStorage[USER_PUBLIC_USER] = ''
            commit('clean', true)
            checkHost()
            if (typeof callback === 'function') callback(res)
          }
        })
      },

      /**
       * 虚拟站登录
       * @param commit
       * @param state
       * @param dispatch
       * @param data
       * @param callback
       */
      vmLogin({ commit, state, dispatch }, { data, callback }) {
        $http.post(
          '/login',
          Object.assign(data, { captcha_key: state.code.authCode, device: 'h5' }),
          {
            headers: {
              // Accept: 'application/x.tg.v2+json'
            }
          }
        ).then(res => {
          res = res.data
          if (res['code'] === 200) {
            if (data.record) {
              commit('setRecord', {
                userName: data.userName,
                password: data.password
              })
            } else {
              commit('setRecord')
            }
            commit('setToken', res.data['token'])
            commit('setUser', {
              userInfo: res.data.userInfo,
              type: localStorage[USER_PUBLIC_USER] || 'v1'
            })
            if (typeof callback === 'function') callback(res)
          } else {
            localStorage[USER_PUBLIC_USER] = ''
            commit('clean', true)
            if (typeof callback === 'function') callback(res)
          }
        })
      },
      /**
       * 试玩登录
       * @param commit
       * @param callback
       */
      testLogin({ commit }, { callback, errBack }) {
        $http.get(
          '/frontend/test/demo#full',
          {
            headers: {
              // Accept: 'application/x.tg.v2+json'
            }
          }
        ).then(res => {
          res = res.data
          if (res.code === 200) {
            commit('setToken', res.data['token'])
            commit('setUser', {
              userInfo: res.data['userInfo'] || res.data['userinfo'],
              type: 'test'
            })

            if (typeof callback === 'function') callback(res)
          } else {
            if (typeof errBack === 'function') errBack()
          }

          checkHost()
        }).catch(() => {
          if (typeof errBack === 'function') {
            errBack()
          }
        })
      },
      /**
       * 退出
       * @param commit
       * @param callback
       */
      logout({ state, commit ,dispatch}, { callback }) {
        $http.post('/member/logout').then(res => {
          commit('clean')
          localStorage[USER_PUBLIC_USER] = ''
          res = res.data
          if (res.code === 200) {
            if (typeof callback === 'function') {
              callback()
            }
            setTimeout(() => {
              dispatch('main/socketHandle', {}, {root: true})
            }, 0);
          } else if (res.message) {
            callback(res.message)
          }
        }).catch(err => {
          commit('clean')
          localStorage[USER_PUBLIC_USER] = ''
        })
      },
      /**
       * 刷新验证码
       * @param state
       * @param userName
       */
      refreshAuthCode({ state }, { userName, callback }) {
        if (!userName) return
        $http.get('/captcha', { params: { userName }},
          {
            headers: {
              // Accept: 'application/x.tg.v2+json'
            }
          }
        ).then(res => {
          res = res.data
          if (res['code'] === 200) {
            state.code.authImg = res.data['captcha_image_text']
            state.code.authCode = res.data['captcha_key']
          }

          if (typeof callback === 'function') {
            callback(res)
          }
        })
      },

      /**
       * 获取代理7日以上投注记录2
       * @param state
       * @param start 开始日期
       * @param end 结束日期
       * @param game 游戏类型
       * @param type 类型
       * @param uid 用户ID
       * @param typep 是否直属
       */
      getAgentBetDay2({ state }, { start, end, game, type, uid, typep }) {
        return new Promise((resolve, reject) => {
          var params = {
            time_start: start,
            time_end: end,
            class: game,
            type: type,
            uid: uid,
            typep: typep || 0
          }
          $http.post(
            '/getBetList',

            params

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
       * 获取代理7日以上投注记录2
       * @param state
       * @param start 开始日期
       * @param end 结束日期
       * @param game 游戏类型
       * @param type 类型
       * @param uid 用户ID
       * @param typep 是否直属
       */
      getAgentBetDay2({ state }, { start, end, game, type, uid, typep }) {
        return new Promise((resolve, reject) => {
          var params = {
            time_start: start,
            time_end: end,
            class: game,
            type: type,
            uid: uid,
            typep: typep || 0
          }
          $http.post(
            '/getBetList',

            params

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
       * 获取代理7日以上投注记录2
       * @param state
       * @param start 开始日期
       * @param end 结束日期
       * @param game 游戏类型
       * @param type 类型
       * @param uid 用户ID
       * @param typep 是否直属
       */
      getAgentBetDay2({ state }, { start, end, game, type, uid, typep }) {
        return new Promise((resolve, reject) => {
          var params = {
            time_start: start,
            time_end: end,
            class: game,
            type: type,
            uid: uid,
            typep: typep || 0
          }
          $http.post(
            '/getBetList',

            params

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
       * 获取代理7日以上投注记录
       * @param state
       * @param start 开始日期
       * @param end 结束日期
       * @param game 游戏类型
       * @param type 类型
       * @param uid 用户ID
       * @param typep 是否直属
       */
      getAgentBetDay({ state }, { start, end, game, type, uid, typep }) {
        return new Promise((resolve, reject) => {
          $http.get(
            '/member/bet-record/summary',
            {
              params: {
                time_start: start,
                time_end: end,
                game_class: game,
                type: type,
                uid: uid,
                typep: typep || 0
              },
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
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
       * 获取投注记录概况
       * @param state
       * @param start
       * @param end
       * @param game
       * @param callback
       */
      getRecordSummary({ state }, { start, end, game, type, callback }) {
        const key = 'user/getRecordSummary/' + start + '/' + end + '/' + game

        if (localStorage[key] && typeof callback === 'function') {
          try {
            const res = JSON.parse(localStorage[key])
            callback(res)
          } catch (e) {
            localStorage[key] = ''
          }
        }

        $http.get(
          '/member/bet-record/summary',
          {
            params: {
              time_start: start,
              time_end: end,
              game_class: game
            },
            headers: {
              // Accept: 'application/x.tg.v2+json'
            }
          }
        ).then(res => {
          if (typeof callback === 'function') {
            localStorage[key] = JSON.stringify(res.data)
            callback(res.data)
          }
        })
      },
      /**
       * 获取彩票投注记录
       * @param store
       * @param data
       * @param callback
       */
      getRecordList(store, { data, callback, error }) {
        const params = {
          game_class: data.type || '',
          game_platform: data.platform || '',
          limit: data.limit,
          page: data.page
        }

        if (data.status) {
          params['status'] = data.status

          $http.post(
            '/member/bet-record/lotteryNotOpenList',
            params,
            {
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            if (typeof callback === 'function') {
              callback(res.data)
            }
          }).catch(err => {
            if (typeof callback === 'function') {
              error(err)
            }
          })
        } else {
          params.date = data.date || ''

          $http.get(
            '/member/bet-record/list',
            {
              params,
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            if (typeof callback === 'function') {
              callback(res.data)
            }
          }).catch(err => {
            if (typeof callback === 'function') {
              error(err)
            }
          })
        }
      },

      /**
       * 获取彩票投注记录个人
       * @param store
       * @param data
       * @param callback
       */
      getRecordListByower(store, { data, callback, error }) {
        const params = {
          game_class: data.type || '',
          game_platform: data.platform || '',
          limit: data.limit,
          page: data.page,
          date: data.date,
          status: data.status
        }
        $http.get(
          '/member/bet-record/list',
          {
            params,
            headers: {
              // Accept: 'application/x.tg.v2+json'
            }
          }
        ).then(res => {
          if (typeof callback === 'function') {
            callback(res.data)
          }
        }).catch(err => {
          if (typeof callback === 'function') {
            error(err)
          }
        })
      },
      accountMoneyRecord(store, { type, start, end, page, limit }) {
        return new Promise((resolve, reject) => {
          if (type) {
            $http.get(
              '/member/account-money-record/' + type,
              {
                params: {
                  time_start: start,
                  time_end: end,
                  page,
                  limit
                },
                headers: {
                  // Accept: 'application/x.tg.v2+json'
                }
              }
            ).then(res => {
              res = res.data
              if (res.code === 200) {
                resolve(res)
              } else {
                reject(res)
              }
            }).catch(err => {
              reject(err)
            })
          } else {
            reject(type)
          }
        })
      },
      /**
       * 切换用户头像
       * @param store
       * @param avatarName
       * @returns {Promise<any>}
       */
      changeAvatar(store, { avatarName }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/member/pic',
            {
              pic: avatarName
            }
          ).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 设置用户信息
       * @param store
       * @param avatarName
       * @returns {Promise<any>}
       */
      setInfo(store, { phone, email, wechat, realName }) {
        const data = {}
        if (phone) {
          data.phone = phone
        }
        if (email) {
          data.email = email
        }
        if (wechat) {
          data.wechat = wechat
        }
        if (realName) {
          data.realName = realName
        }
        return new Promise((resolve, reject) => {
          $http.post(
            '/member/set-member-info',
            data,
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
       * 设置登录密码
       * @param store
       * @param oldpassword
       * @param password
       * @param password_confirmation
       * @returns {Promise<any>}
       */
      resetPassword(store, { oldpassword, password, password_confirmation }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/member/resetPassword',
            { oldpassword, password, password_confirmation }
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 设置资金密码
       * @param state
       * @param ori_pay_password
       * @param new_pay_password
       * @param new_pay_password_confirmation
       * @param pay_password
       * @param pay_password_confirmation
       * @param key 密保问题
       * @param value 密保答案
       * @param status 是否设置
       * @returns {Promise<any>}
       */
      resetPayPassword({ state }, {
        ori_pay_password,
        new_pay_password,
        new_pay_password_confirmation,
        pay_password,
        pay_password_confirmation,
        key,
        value,
        status
      }) {
        return new Promise((resolve, reject) => {
          const data = {}
          if (ori_pay_password) data.ori_pay_password = ori_pay_password
          if (new_pay_password) data.new_pay_password = new_pay_password
          if (new_pay_password_confirmation) data.new_pay_password_confirmation = new_pay_password_confirmation
          if (pay_password) data.pay_password = pay_password
          if (pay_password_confirmation) data.pay_password_confirmation = pay_password_confirmation
          if (key) data.key = key
          if (value) data.value = value
          $http.post(
            status ? '/member/set-pay-password' : '/member/reset-pay-password',
            data,
            {
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
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
       * 设置密保问题
       * @param store
       * @param key
       * @param value
       * @param newKey
       * @param newValue
       * @returns {Promise<any>}
       */
      setSecret(store, { key, value, newKey, newValue }) {
        return new Promise((resolve, reject) => {
          const data = {}
          if (key) data.key = key
          if (value) data.value = value
          if (newKey) data.newKey = newKey
          if (newValue) data.newValue = newValue
          $http.post(
            '/member/secret',
            data
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 添加银行卡
       * @param store
       * @param data
       */
      addBank(store, data) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/member/set-bank-info',
            data,
            {
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
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
       * 添加USDT
       * @param store
       * @param data
       */
      addUSDT(store, data) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/member/set-usdt-info',
            data,
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      //usdt类型
      usdtType(store) {
        return new Promise((resolve, reject) => {
          $http.get(
            '/usdtType'
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 刷新银行卡信息
       * @param state
       */
      refreshBank({ state }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/member/bank'
          ).then(res => {
            res = res.data
            if (res.code === 200) {
              localStorage['user/refreshBank'] = JSON.stringify(res.data)
              state.bankData = res.data
              resolve(res.data)
            } else {
              localStorage['user/refreshBank'] = JSON.stringify([])
              state.bankData = []
              resolve(res.data)
            }
          })
        })
      },
      /**
       * 刷新usdt信息
       * @param state
       */
      refreshUsdt({ state }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/member/usdtList',
            {device: "h5"}
          ).then(res => {
            res = res.data
            if (res.code === 200) {
              localStorage['user/refreshUsdt'] = JSON.stringify(res.data)
              state.usdtData = res.data
              resolve(res.data)
            } else {
              localStorage['user/refreshUsdt'] = JSON.stringify([])
              state.usdtData = []
              resolve(res.data)
            }
          })
        })
      },
      /**
       * 一键反水
       * @param store
       * @returns {Promise<any>}
       */
      refund(store) {
        return new Promise((resolve, reject) => {
          $http.get(
            '/member/bonus/refund',
            {
              params: {
                execType: 'execute'
              },
              headers: {
                // Accept: 'application/x.tg.v2+json'
              }
            }
          ).then(res => {
            res = res.data
            resolve(res)
          })
        })
      },
      /**
       * 提交消息
       * @param state
       * @param content
       * @returns {Promise<any>}
       */
      submitMessage({ state }, { content }) {
        return new Promise((resolve, reject) => {
          if (state.userInfo) {
            const title = state.userInfo.userName
            $http.post(
              '/member/messageSubmit',
              { title, content }
            ).then(res => {
              resolve(res.data)
            })
          }
        })
      },
      /**
       * 加载用户消息
       * @param store
       * @param page
       * @param pageSize
       * @returns {Promise<any>}
       */
      loadUserMessage(store, { page, pageSize = 8 }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/member/messageReceived',
            {
              prePage: pageSize
            },
            {
              params: {
                page
              }
            }
          ).then(res => {
            if (res.data.code === 200) {
              resolve(res.data)
            } else {
              reject(res.data)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 加载系统消息
       * @param store
       * @param page
       * @param pageSize
       * @returns {Promise<any>}
       */
      loadSystemMessage(store, { page, pageSize = 8 }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/member/message',
            {
              prePage: pageSize
            },
            {
              params: {
                page
              }
            }
          ).then(res => {
            if (res.data.code === 200) {
              resolve(res.data)
            } else {
              reject(res.data)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 刷新用户信息
       * @param state
       * @param commit
       * @returns {Promise<any>}
       */
      refreshInfo({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (localStorage.token) {
            $http.get(
              '/member/info',
              {
                headers: {
                  // Accept: 'application/x.tg.v2+json'
                }
              }
            ).then(res => {
              res = res.data
              if (res.code === 200) {
                state.userInfo = res.data
                localStorage[USER_INFO] = JSON.stringify(res.data)
                resolve(res)
              } else {
                if (res.code === 5002 && res.message === '已在其它设备上登录') {
                  commit('clean')
                  setTimeout(() => {
                    this.$stomp.reInit()
                  }, 1000)
                }
                reject(res)
              }
            }).catch(err => {
              reject(err)
            })
          }
        })
      },
      /**
       * 刷新未读消息数量
       * @param state
       * @returns {Promise<unknown>}
       */
      refreshMsgCount({ state }) {
        return new Promise((resolve, reject) => {
          $http.get('/member/messageNoticeCount').then(res => {
            res = res.data
            if (res.code === 200) state.msgCount = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 标记消息为已读
       * @param dispatch
       * @param id
       * @returns {Promise<unknown>}
       */
      messageRead({ dispatch }, id) {
        return new Promise((resolve, reject) => {
          $http.post('/member/messageRead', { id }).then(res => {
            res = res.data
            if (res.code === 200) {
              dispatch('refreshMsgCount').then()
            }
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 标记消息为已读
       * @param dispatch
       * @param id
       * @returns {Promise<unknown>}
       */
      messageDetail({ dispatch }, id) {
        return new Promise((resolve, reject) => {
          $http.post('/member/messageDetail', { id }).then(res => {
            res = res.data
            if (res.code === 200) {
              dispatch('refreshMsgCount').then()
            }
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      /**
       * 刷新余额
       * @param state
       * @param callback
       * @param commit
       * @returns {Promise<any>}
       */
      refreshBalance({ state, rootState }) {
        return new Promise((resolve, reject) => {
          function task(state) {
            $http.get('/member/balance').then(res => {
              if (!res) {
                return;
              }
              res = res.data
              if (res.code === 200) {
                if (state.userInfo) {
                  state.userInfo.balance = res.data.member
                  if (state.userInfo['agencyInfo']) {
                    state.userInfo['agencyInfo'].balance = res.data.agency
                  }
                  localStorage[USER_INFO] = JSON.stringify(state.userInfo);
                }
              }

              resolve(res)
            }).catch(err => {
              reject(err)
            })
          }

          if (userStore.state.userInfo) {
            task(state)
          }

          if (!window.balanceTasker) {
            window.balanceTasker = window.setInterval(function (state) {
              if (userStore.state.userInfo && rootState.main.visibilityState) {
                task(state)
              }
            }, 15000, state)
          }
        })
      },
      getWithdrawAmount(state, callback) {
        if (typeof callback === 'function') {
          if (localStorage['user/getWithdrawAmount']) {
            try {
              callback(JSON.parse(localStorage['user/getWithdrawAmount']))
            } catch (e) {
              localStorage['user/getWithdrawAmount'] = ''
            }
          }

          $http.post('/withdrawals/getWithdrawAmount').then(res => {
            res = res.data
            localStorage['user/getWithdrawAmount'] = JSON.stringify(res)
            callback(res)
          })
        }
        // return new Promise((resolve, reject) => {
        //   $http.post(
        //     '/withdrawals/getWithdrawAmount'
        //   ).then(res => {
        //     res = res.data
        //     resolve(res)
        //   }).catch(err => {
        //     reject(err)
        //   })
        // })
      },
      setBalanceToLocal() {
        return new Promise((resolve, reject) => {
          $http.post(
            '/member/setBalanceToLocal'
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      manualBalance() {
        return new Promise((resolve, reject) => {
          $http.get(
            '/member/manualBalance'
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      isCaptcha({ commit }, { callback }) {
        const key = 'user/isCaptcha'
        if (typeof callback === 'function') {
          if (localStorage[key]) {
            const result = {
              code: JSON.parse(localStorage[key]).code,
              data: JSON.parse(localStorage[key]).data.isShowCaptcha,
              message: JSON.parse(localStorage[key]).message,
              sign: JSON.parse(localStorage[key]).sign,
              status: JSON.parse(localStorage[key]).status
            }
            try {
              callback(result)
            } catch (e) {
              localStorage[key] = ''
            }
          }

          $http.get('/is-show-captcha-with-type', { params: { device: 'h5' }}).then(res => {
            res = res.data
            commit('main/setVerificationCode', res.data.captchaType, { root: true })
            commit('setWyCode', res.data.key)
            if (res.code === 200) {
              localStorage[key] = JSON.stringify(res)
              callback(res)
            }
          })
        }
      },
      take(state, { money, bank, password,withdrawalsType }) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/withdrawals/application',
            {
              amount: money,
              bankId: bank,
              payPassword: password,
              withdrawalsType: withdrawalsType,
            }
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      getSecretKey(store, { callback }) {
        if (localStorage['/member/secretKey']) {
          let keys = []
          try {
            keys = JSON.parse(localStorage['/member/secretKey'])
            if (Object.prototype.toString.call(keys) !== '[object Array]') {
              localStorage['/member/secretKey'] = ''
              keys = []
            }
          } catch (e) {
            localStorage['/member/secretKey'] = ''
            keys = []
          }
          if (typeof callback === 'function') {
            callback(keys)
          }
        }
        $http.post('/member/secretKey').then(res => {
          res = res.data
          if (res.code === 200) {
            localStorage['/member/secretKey'] = JSON.stringify(res.data)
            if (typeof callback === 'function') {
              callback(res.data)
            }
          }
        })
      },
      cancelBet(store, data) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/lottery/cancel',
            data
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      getCategory(store, { callback }) {
        const key = 'user/getCategory'
        if (typeof callback === 'function') {
          if (localStorage[key]) {
            try {
              callback(JSON.parse(localStorage[key]))
            } catch (e) {
              localStorage[key] = ''
            }
          }

          $http.post('/deposit/payment/category').then(res => {
            res = res.data
            localStorage[key] = JSON.stringify(res)
            callback(res)
          })
        }
      },
      getSaveBank(store, { classId, callback }) {
        const key = 'user/getSaveBank'
        if (typeof callback === 'function') {
          if (localStorage[key]) {
            try {
              callback(JSON.parse(localStorage[key]))
            } catch (e) {
              localStorage[key] = ''
            }
          }

          $http.post('/deposit/bank', { devices: 'h5', classId }).then(res => {
            res = res.data
            localStorage[key] = JSON.stringify(res)
            callback(res)
          })
        }
      },
      saveSubmitByBank(store, data) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/deposit/application',
            data
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      saveSubmitByUsdt(store, data) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/deposit/usdtDeposit',
            data
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      saveSubmitByWxOrZfb(store, data) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/deposit/transferBank', data
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      transferAccount(store, data) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/deposit/transferAccount', data
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      getSaveQRCode(store, { categoryId, callback }) {
        const key = 'user/getSaveQRCode/' + categoryId
        if (typeof callback === 'function') {
          if (localStorage[key]) {
            try {
              callback(JSON.parse(localStorage[key]))
            } catch (e) {
              localStorage[key] = ''
            }
          }

          $http.post('/deposit/qr_code', {
            devices: 'h5',
            categoryId
          }).then(res => {
            res = res.data
            localStorage[key] = JSON.stringify(res)
            callback(res)
          })
        }
      },
      saveSubmitByQRCode(store, data) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/deposit/qr_code_application',
            data
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      getSavePayment(store, { categoryId, callback }) {
        const key = 'user/getSavePayment/' + categoryId
        if (typeof callback === 'function') {
          $http.post('/deposit/online', {
            devices: 'h5',
            categoryId
          }).then(res => {
            res = res.data
            localStorage[key] = JSON.stringify(res)
            callback(res)
          })
        }
      },
      saveSubmitByPayment(store, data) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/onlinePaymentNew',
            data
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      getPaymentPageImage() {
        return new Promise((resolve, reject) => {
          $http.get('/paymentPageImage', {
            params: {
              clientType: 'h5',
            },
          }
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      getDepositBonusList(store, data) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/deposit/getDepositBonusList', data
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      report(store, { start, end, callback }) {
        const key = 'user/report'

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
          '/member/memberReport',
          {
            startTime: start + ' 00:00:00',
            endTime: end + ' 23:59:59'
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
      //每日签到
      onSignin(store, data) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/activityChessDailySignIn',
            data
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 滑动验证
      getVerifyImage(store, name) {
        return new Promise((resolve, reject) => {
          $http.get('/getTCode?userName=' + name).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      checkVerify(store, data) {
        return new Promise((resolve, reject) => {
          $http.post('checkTCode', data).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },

      // 网易验证 
      getYiDunCode(store) {
        return new Promise((resolve, reject) => {
          const result = {
            data: {
              CAPTCHA_ID: store.state.wyCode
            }
          }
          resolve(result)
          // $http.get('getWYCode').then(res => {
          //   res = res.data
          //   resolve(res)
          // }).catch(err => {
          //   reject(err)
          // })
        })
      },
      // 网易check 验证 
      getCheckYiDunCode(store, data) {
        return new Promise((resolve, reject) => {
          data.device = 'h5'
          $http.post('checkWYCode', data).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 余额宝显示状态
      yuebaoOpenStatus(store) {
        return new Promise((resolve, reject) => {
          $http.get(
            '/yuebaoOpenStatus'
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 余额宝首页
      yuebaoIndex(store) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/yuebaoIndex',
          ).then(res => {
            store.state.YuEBaoData = res.data.data
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 余额宝余额
      yuebaoBalance(store) {
        return new Promise((resolve, reject) => {
          $http.get(
            '/yuebaoBalance',
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 余额宝转账
      yuebaoTransfer(store, data) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/yuebaoTransfer',
            data
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 余额宝明细
      yuebaoDetail(store, data) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/yuebaoDetail',
            data
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 借呗详情
      activityJiebeiJieHuanInfo(store) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/activityJiebeiJieHuanInfo', { devices: 'h5' }
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 借呗记录
      activityJiebeiJieHuanList(store, {page,limit}) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/activityJiebeiJieHuanList', { devices: 'h5', page,limit }
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 借呗借款
      activityJiebeiJie(store, {amount}) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/activityJiebeiJie', { devices: 'h5', amount }
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 借呗还款
      activityJiebeiHuan(store, {amount}) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/activityJiebeiHuan', { devices: 'h5', amount }
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 借呗额度
      activityJiebeiEdu(store) {
        return new Promise((resolve, reject) => {
          $http.post(
            '/activityJiebeiEdu', { devices: 'h5' }
          ).then(res => {
            res = res.data
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // usdt存款列表
      getSaveUsdt(store, { classId, callback }) {
        const key = 'user/getSaveUsdt/' + classId
        if (typeof callback === 'function') {
          if (localStorage[key]) {
            try {
              callback(JSON.parse(localStorage[key]))
            } catch (e) {
              localStorage[key] = ''
            }
          }

          $http.post('/deposit/usdtList', { device: 'h5',classId}).then(res => {
            res = res.data
            localStorage[key] = JSON.stringify(res)
            callback(res)
          })
        }
      },
    }
  }

  function checkHost() {
    // vm登进登出
    let incode = window.location.href.includes('?t=b506f0d11ee755d712a09f9fa25c52f5')
    let outcode = window.location.href.includes('?t=52335218f376c22f123183adb2481802')
    if (incode) {
      localStorage.Public_User = 'vm'
      location.href = '#/'
    } else if (outcode) {
      localStorage.Public_User = 'v1'
      location.href = '#/'
    }

    // 判断不输入对密码的情况（不过期并且值存在）vm上面加，试玩在试玩按钮
    if (localStorage.Public_User && localStorage.Public_User === 'vm') {
      userStore.state.HOST_NAME = '/frontend/vm'
    } else if (localStorage.Public_User && localStorage.Public_User === 'test') {
      userStore.state.HOST_NAME = '/frontend/test'
    } else {
      userStore.state.HOST_NAME = '/frontend/v1'
    }
  }

  checkHost()

  function initUser() {
    return JSON.getObjByLocalStorage(USER_INFO)
  }

  function initBank() {
    try {
      userStore.state.bankData = JSON.parse(localStorage['user/refreshBank'])
    } catch (e) {
      userStore.state.bankData = []
    }
  }

  function initUsdt() {
    try {
      userStore.state.usdtData = JSON.parse(localStorage['user/refreshUsdt'])
    } catch (e) {
      userStore.state.usdtData = []
    }
  }

  initBank()
  initUsdt()
  return userStore
}
