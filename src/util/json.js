JSON.getObjByLocalStorage = function (key) {
  const val = localStorage[key]
  let obj = null
  if (val) {
    try {
      obj = JSON.parse(val)
    } catch (e) {
      localStorage[key] = ''
      obj = null
    }
  }
  return obj
}

JSON.setObjByLocalStorage = function (key, val) {
  if (val) {
    if (typeof val === 'object') {
      localStorage[key] = JSON.stringify(val)
    }
  } else {
    localStorage[key] = ''
  }
}

JSON.copyObj = function (obj, def) {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch (e) {
    return def || null
  }
}