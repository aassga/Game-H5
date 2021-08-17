(function () {
  let hidden, visibilityChange
  if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden'
    visibilityChange = 'visibilitychange'
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden'
    visibilityChange = 'msvisibilitychange'
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden'
    visibilityChange = 'webkitvisibilitychange'
  }

  const listeners = []

  function handleVisibilityChange () {
    listeners.forEach(listener => {
      if (typeof listener === 'function') {
        listener(document.visibilityState === 'visible')
      }
    })
  }

  if (typeof document.addEventListener === 'undefined' || typeof document[hidden] === 'undefined') {
    console.log('This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.')
  } else {
    document.addEventListener(visibilityChange, handleVisibilityChange, false)
  }

  window.visibilityChangeManager = {
    on (fn) {
      if (typeof fn === 'function') listeners.push(fn)
      return listeners.indexOf(fn)
    },
    off (index) {
      listeners[index] = null
    }
  }
})()
