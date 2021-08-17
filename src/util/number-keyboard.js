export default {
  install (Vue) {
    Vue.directive('number-keyboard', {
      inserted (
        el, { name, length, oldValue, expression, arg, modifiers }, vnode,
        oldVnode) {
        const context = vnode.context
        let timer = null

        length = length || 8

        el.classList.add('number-input')
        const mask = document.createElement('DIV')
        mask.className = el.className
        if (el.value) {
          mask.innerText = el.value
          mask.classList.remove('placeholder')
        } else {
          mask.innerHTML = `<span>${el.placeholder}</span>`
          mask.classList.add('placeholder')
        }
        mask.setAttribute(el.attributes[0].name, '')
        el.parentElement.insertBefore(mask, el)
        el.style.position = 'absolute'
        el.style.zIndex = '-1'
        el.style.left = '-9999px'
        el.style.top = '-9999px'
        el.mask = mask

        el.addEventListener('click', function (evt) {
          evt.preventDefault()
        })

        el.addEventListener('focus', function (evt) {
          let placeholder = el.placeholder
          mask.setAttribute('placeholder',placeholder)
          evt.preventDefault()
        })

        el.addEventListener('blur', function (evt) {
          evt.preventDefault()
        })

        mask.addEventListener('click', function (evt) {
          evt.stopPropagation()

          setTimeout(function () {
            context.$store.state.key.target = el

            const event = document.createEvent('Event')
            event.initEvent('focus', true, true)
            el.dispatchEvent(event)

            el.classList.add('focus')
            mask.className = el.className
            mask.innerText = el.value
            context.$store.state.key.dot = modifiers.dot
            context.$store.state.key.show = true
            context.$store.state.key.onNumberInput = key => {
              let value = NaN
              if (key === 'del') {
                if (el.value.toString() && el.value.toString().length>1) {
                  value = el.value.toString()
                    .substring(0, el.value.toString().length - 1)
                }else{
                  value = 0
                }
              } else if (key === '清空') {
                value = NaN
              } else if (length && el.value.toString().split('.')[0].length >=
                length && !el.value.toString().includes('.') && key !== '.') {
                value = el.value
              } else {
                if(el.value.toString() == '0'){
                  el.value = ''
                }
                if (!el.value.toString().includes('.') ||
                  (el.value.toString().split('.')[1].length < 2 && key !==
                    '.')) {
                  value = (el.value.toString() + key.toString())
                } else {
                  value = el.value
                }
              }

              if (isNaN(parseFloat(value.toString()))) {
                el.value = ''
              } else {
                if (value.length > 7) {
                  el.value = value.substr(0, 7)
                } else {
                  el.value = value
                }
              }

              const event = document.createEvent('Event')
              event.initEvent('input', true, true)
              el.dispatchEvent(event)
            }

            if (!timer) {
              timer = setInterval(function () {
                if (context.$store.state.key.target !== el) {
                  el.classList.remove('focus')
                  mask.className = el.className
                  if (el.value) {
                    mask.innerText = el.value
                    mask.classList.remove('placeholder')
                  } else {
                    mask.innerHTML = `<span>${el.placeholder}</span>`
                    mask.classList.add('placeholder')
                  }

                  const event = document.createEvent('Event')
                  event.initEvent('blur', true, true)
                  el.dispatchEvent(event)

                  clearInterval(timer)
                  timer = null
                }
              }, 100)
            }
          }, 100)
        })
      },

      update (
        el, { name, value, oldValue, expression, arg, modifiers }, vnode,
        oldVnode) {
        const mask = el.mask
        const context = vnode.context
        if (mask) {
          if (context.$store.state.key.target === el) el.classList.add('focus')
          el.classList.add('number-input')
          mask.className = el.className
          mask.style.height = el.clientHeight + 'px'
          if (el.value) {
            mask.innerText = el.value
            mask.classList.remove('placeholder')
          } else if (context.$store.state.key.target !== el) {
            mask.innerHTML = `<span>${el.placeholder}</span>`
            mask.classList.add('placeholder')
          } else {
            mask.innerText = el.value
            mask.classList.remove('placeholder')
          }
        }
      }
    })
  }
}
