export default class util {
  static scrollToBottom (dom, scrollTop) {
    this.listenAndroidKeyboardToggle(() => {
      document.querySelector(dom).scrollTop = scrollTop || 9999
    }, () => {
      document.querySelector(dom).scrollTop = scrollTop || 9999
    })
  }

  static listenAndroidKeyboardToggle (onShow, onHide) {
    // 针对 android 机型
    // 通过窗口高度的变化来监听键盘的收起和出现
    let windowInnerHeightNoKeyboard = window.innerHeight
    let windowInnerHeightHasKeyboard = windowInnerHeightNoKeyboard
    if ((/(Android)\s+([\d.]+)/i).test(window.navigator.userAgent)) {
      window.addEventListener('resize', () => {
        if (window.innerHeight < windowInnerHeightNoKeyboard) {
          onShow && onShow(windowInnerHeightNoKeyboard)
        }
        if (window.innerHeight >= windowInnerHeightHasKeyboard) {
          onHide && onHide()
        }
      })
    }
  }

  static isAndroid () {
    if ((/(Android)\s+([\d.]+)/i).test(window.navigator.userAgent)) {
      return true
    }
    return false
  }

  static getUrlPrem (key, url) {
    const search = url || window.location.search
    const pattern = new RegExp(`[?&]${key}=([^&]+|\\w+)`, 'g')
    const matcher = pattern.exec(search)
    let items = null
    if (matcher !== null) {
      try {
        items = decodeURIComponent(decodeURIComponent(matcher[1]))
      } catch (e) {
        try {
          items = decodeURIComponent(matcher[1])
        } catch (e) {
          items = matcher[1]
        }
      }
    }
    return items
  }
}
