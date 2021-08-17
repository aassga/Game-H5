import Stomp from 'stompjs'

class $stomp {
  constructor () {
    this.server = ''
    this.connected = false
    this.listeners = {}
    this.id = ''
    this.siteId = ''
    this.group = ''
    this.chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  }

  generateMixed (n) {
    let res = ''
    for (let i = 0; i < n; i++) {
      let id = Math.ceil(Math.random() * 35)
      res += this.chars[id]
    }
    return res
  }

  init (server) {
    if (this.connected) {
      return false
    }
    this.server = server
    this.siteId = JSON.parse(localStorage.config)['siteId']

    if (!this.siteId) {
      return false
    }

    this.connect()
  }

  callback (greeting) {
    const data = JSON.parse(greeting.body)
    if (data.type === 'user.lotteryOpen') {
      data.data.forEach(item => {
        const listener = this.listeners[item.lotteryId]
        if (typeof listener === 'function') {
          listener(item)
        }
      })
    }

    if (data.type) {
      const listener = this.listeners[data.type]
      if (typeof listener === 'function') {
        listener(data)
      }
    }
  }

  connect () {
    this.socket = Stomp.client(this.server)

    if (localStorage['userInfo']) {
      this.id = `${JSON.parse(localStorage['userInfo'])['uid']}`
    }

    if (localStorage['Public_User'] === 'test') {
      this.group = 'test'
    } else if (localStorage['Public_User'] === 'vm') {
      this.group = 'vm'
    } else if (localStorage['Public_User'] === 'v1' && localStorage['token']) {
      this.group = 'member'
    } else {
      this.group = 'anonymous'
      this.id = this.siteId + '_' + new Date().getTime() + this.generateMixed(16)
    }

    this.headers = {
      id: this.id,
      group: this.group,
      siteid: this.siteId
    }

    this.message = {
      'all': '/topic/public',
      'group': '/group/' + this.headers.group,
      'site': '/group/' + this.siteId,
      'alone': '/user/' + this.headers.group + '_' + this.headers.id + '/message'
    }

    this.socket.connect(
      this.headers,
      () => {
        this.connected = true
        this.socket.subscribe(this.message.all, this.callback.bind(this))
        this.socket.subscribe(this.message.group, this.callback.bind(this))
        this.socket.subscribe(this.message.alone, this.callback.bind(this))
        this.socket.subscribe(this.message.site, this.callback.bind(this))
      },
      () => {
        this.connected = false
        this.socket.disconnect()
      }
    )

    this.socket.debug = function (str) {
      // debug 默认输出到控制台，赋值个函数替换它控制台不打印信息
      // console.log(str)
    }
  }

  disconnect () {
    this.connected = false
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  reInit () {
    this.disconnect()
    this.connect()
  }

  on (id, callback) {
    this.listeners[id] = callback
  }

  off (id) {
    if (this.listeners[id]) {
      this.listeners[id] = undefined
    }
  }
}

export default {
  install (Vue) {
    Vue.prototype.$stomp = new $stomp()
  }
}
