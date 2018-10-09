export function isFunction (func) {
  return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]'
}

export function getAngle(x1, y1,  x2, y2){
  var x = Math.abs(x1 - x2);
  var y = Math.abs(y1 - y2);
  var z = Math.sqrt(x*x + y*y);
  return  Math.round((Math.asin(y / z) / Math.PI*180));
}

export function preLoadImages (arr) {
  let newImages = [], loadedImages = 0
  let postAction = function(){}  //此处增加了一个postAction函数
  arr = (typeof arr !== "object")? [arr] : arr
  function imageLoadPost(){
    loadedImages++
    if (loadedImages === arr.length){
      postAction(newImages) //加载完成用我们调用postAction函数并将newImages数组做为参数传递进去
    }
  }
  for (let i = 0; i < arr.length; i++){
    newImages[i] = new Image()
    newImages[i].src = arr[i]
    newImages[i].onload = function(){
      imageLoadPost()
    }
    newImages[i].onerror = function(){
      imageLoadPost()
    }
  }
  return { //此处返回一个空白对象的done方法
    done:function(f){
      postAction = f || postAction
    }
  }
}

export function throttle(func, wait, leading, trailing) {
  var timer, lastCall = 0, flag = true
  console.log('throttle')
  return function() {
    var context = this
    var args = arguments
    var now = +(new Date()).getTime()
    flag = now - lastCall > wait
    console.log(flag)
    if (leading && flag) {
      lastCall = now
      return func.apply(context, args)
    }
    if (!timer && trailing && !(flag && leading)) {
      console.log('---')
      timer = setTimeout(function () {
        timer = null
        lastCall = +(new Date()).getTime()
        func.apply(context, args)
        console.log(lastCall)
      }, wait)
    } else {
      lastCall = now
    }
  }
}
