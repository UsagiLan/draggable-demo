import Vue from 'vue'
import Index from './index.vue'

let DialogConstructor = Vue.extend(Index)

export default (options = {}) => {
  const defaultOption = {
    title: '提示',
    content: '',
    btn: '我知道了',
    callback (index) {
      console.log('callback')
    }
  }

  let {title, content, btn, callback} = Object.assign(defaultOption, options)

  const instance = new DialogConstructor({
    el: document.createElement('div')
  })

  instance.title = title
  instance.content = content
  instance.btn = btn
  instance.callback = callback

  Vue.nextTick(() => {
    document.body.appendChild(instance.$el)
    instance.$utils.stopScrollOn();
    instance.visible = true
  })
}
