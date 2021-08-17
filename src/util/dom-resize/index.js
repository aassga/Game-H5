const elList = []
let timer = 0

function bind (el, next) {
  let obj = {
    el,
    callback: next,
    style: {
      width: getStyle(el, 'width'),
      height: getStyle(el, 'height')
    }
  }
  elList.push(obj)
}

function remove (el) {
  elList.splice(elList.indexOf(el))
  if (elList.indexOf(el) !== -1) {
    elList.splice(elList.indexOf(el), 1)
  }
}

timer = setInterval(() => {
  for (let i = 0; i < elList.length; i++) {
    let dom = elList[i].el
    const style = {
      width: getStyle(dom, 'width'),
      height: getStyle(dom, 'height')
    }
    if (!isStatic(style, elList[i].style)) {
      elList[i].style = {
        width: style.width,
        height: style.height
      }
      elList[i].callback && elList[i].callback()
    }
  }
}, 50)

function getStyle (ele, attr) {
  if (ele && Object.prototype.toString.call(ele).includes('Element')) {
    if (window.getComputedStyle) {
      return window.getComputedStyle(ele, null)[attr]
    }
    return ele['currentStyle'][attr]
  } else {
    return ''
  }
}

function isStatic (obj1, obj2) {
  for (let key in obj1) {
    if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key) && obj1[key] !== obj2[key]) {
      return false
    }
  }
  return true
}

export default {
  bind,
  remove
}
