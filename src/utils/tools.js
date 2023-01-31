function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

let debounceTimer = null
export const debounce = (func, wait, options) => {
  let leading = false
  let trailing = true
  let context, args

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function!')
  }

  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  return function () {
    context = this
    args = arguments

    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    } else {
      leading && func.apply(context, args)
    }
    debounceTimer = setTimeout(() => {
      trailing && func.apply(context, args)
      debounceTimer = null
    }, wait)
  }
}

export const throttle = (func, wait, options) => {
  let leading = true
  let trailing = true
  let context, timer, args, fnCallTime
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }
  function callFn() {
    let now = Date.now()
    if (now - fnCallTime < wait) return
    func.apply(context, args)
    fnCallTime = now
  }
  return function () {
    context = this
    args = arguments
    if (timer) return
    timer = setTimeout(() => {
      trailing && callFn()
      timer = null
    }, wait)
    leading && callFn()
  }
}
