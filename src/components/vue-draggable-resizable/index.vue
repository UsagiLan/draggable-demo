<template>
  <div
    class="vdr"
    :style="style"
    :class="{
      draggable: draggable,
      resizable: resizable,
      active: enabled,
      dragging: dragging,
      resizing: resizing
    }"
    @mousedown.stop="elmDown"
    @touchstart.stop="elmDown"
    @dblclick="fillParent"
    @blur="elmUp"
  >
    <!--v-for="handle in handles"-->
    <div
      v-if="active"
      class="handle"
      :key="'br'"
      :class="'handle-br'"
      :style="{ display: enabled ? 'block' : 'none'}"
      @mousedown.stop.prevent="handleDown('br', $event)"
      @touchstart.stop.prevent="handleDown('br', $event)"
    ></div>
    <div
      v-if="active"
      class="handle"
      :key="'tl'"
      :class="'handle-tl'"
      :style="{ display: enabled ? 'block' : 'none'}"
      @mousedown.stop.prevent="handleDown('tl', $event)"
      @touchstart.stop.prevent="handleDown('tl', $event)"
    ></div>
    <div
      v-if="active"
      class="handle"
      :key="'bl'"
      :class="'handle-bl'"
      :style="{ display: enabled ? 'block' : 'none'}"
      @click.stop.prevent="removeElement($event)"
    ></div>
    <div class="list" v-if="typeof elementUrls === 'string'">
      <img class="images" :src="elementUrls" alt="">
    </div>
    <div class="list" v-else-if="elementUrls instanceof Array">
      <img class="images" v-for="(url, index) in elementUrls" :key="index" :src="url" alt="">
    </div>
  </div>
</template>

<script>
import { matchesSelectorToParentElements } from './dom'
import { getAngle, preLoadImages, throttle } from './fns'

export default {
  replace: true,
  name: 'VueDraggableResizable',
  props: {
    elementUrls: {
      type: [Array, String]
    },
    active: {
      type: Boolean, default: false
    },
    draggable: {
      type: Boolean, default: true
    },
    resizable: {
      type: Boolean, default: true
    },
    w: {
      type: Number,
      default: 200,
      validator: function (val) {
        return val > 0
      }
    },
    h: {
      type: Number,
      default: 200,
      validator: function (val) {
        return val > 0
      }
    },
    minw: {
      type: Number,
      default: 50,
      validator: function (val) {
        return val >= 0
      }
    },
    minh: {
      type: Number,
      default: 50,
      validator: function (val) {
        return val >= 0
      }
    },
    x: {
      type: Number,
      default: 0,
      validator: function (val) {
        return typeof val === 'number'
      }
    },
    y: {
      type: Number,
      default: 0,
      validator: function (val) {
        return typeof val === 'number'
      }
    },
    z: {
      type: [ String, Number ],
      default: 'auto',
      validator: function (val) {
        let valid = (typeof val === 'string') ? val === 'auto' : val >= 0
        return valid
      }
    },
    handles: {
      type: Array,
      default: function () {
        return ['tr']
      },
      validator: function (val) {
        var s = new Set(['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'])

        return new Set(val.filter(h => s.has(h))).size === val.length
      }
    },
    dragHandle: {
      type: String,
      default: null
    },
    dragCancel: {
      type: String,
      default: null
    },
    axis: {
      type: String,
      default: 'both',
      validator: function (val) {
        return ['x', 'y', 'both'].indexOf(val) !== -1
      }
    },
    grid: {
      type: Array,
      default: function () {
        return [1, 1]
      }
    },
    parent: {
      type: Boolean, default: false
    },
    maximize: {
      type: Boolean, default: false
    }
  },

  created: function () {
    this.parentX = 0
    this.parentW = 9999
    this.parentY = 0
    this.parentH = 9999

    this.mouseX = 0
    this.mouseY = 0

    this.lastMouseX = 0
    this.lastMouseY = 0

    this.mouseOffX = 0
    this.mouseOffY = 0

    this.rotateBeginX = 0  // 旋转时鼠标的前一个位置
    this.rotateBeginY = 0

    this.elmX = 0  // 元素本身位置的left值
    this.elmY = 0  // 元素本身位置的top值

    this.elmW = 0  // 元素本身尺寸的width值
    this.elmH = 0  // 元素本身尺寸的height值

    this.x0 = 0
    this.y0 = 0
    this.elmAngle = 0 // 元素旋转的角度差
    //则元素中心点的坐标为 (elmX+elmW/2, elmY+elmH/2)
  },
  mounted: function () {
    document.documentElement.addEventListener('mousemove', this.handleMove, true)
    // document.documentElement.addEventListener('mousemove', ()=> {
    //   console.log('===')
    //   throttle(this.handleMove, 10, false, true)();
    //   }, true)
    document.documentElement.addEventListener('mousedown', this.deselect, true)
    document.documentElement.addEventListener('mouseup', this.handleUp, true)

    // touch events bindings
    document.documentElement.addEventListener('touchmove', this.handleMove, true)
    // document.documentElement.addEventListener('touchmove', ()=> {
    //   console.log('===')
    //   throttle(this.handleMove, 10, false, true)();
    // }, true)
    document.documentElement.addEventListener('touchend touchcancel', this.deselect, true)
    document.documentElement.addEventListener('touchstart', this.handleUp, true)

    this.elmX = parseInt(this.$el.style.left)
    this.elmY = parseInt(this.$el.style.top)
    this.elmW = this.$el.offsetWidth || this.$el.clientWidth
    this.elmH = this.$el.offsetHeight || this.$el.clientHeight

    this.reviewDimensions()

    // 预加载图片后计算图片宽高比
    preLoadImages(this.elementUrls).done((imgs) => {
      let w = imgs[0].width, h = imgs[0].height;
      this.ratio = w / h
      // this.angleOffSet = 90 - 180 / (Math.PI / Math.atan(h / w))
      // console.log(h / w, this.angleOffSet)
    })
  },
  beforeDestroy: function () {
    document.documentElement.removeEventListener('mousemove', this.handleMove, true)
    document.documentElement.removeEventListener('mousedown', this.deselect, true)
    document.documentElement.removeEventListener('mouseup', this.handleUp, true)

    // touch events bindings removed
    document.documentElement.addEventListener('touchmove', this.handleMove, true)
    document.documentElement.addEventListener('touchend touchcancel', this.deselect, true)
    document.documentElement.addEventListener('touchstart', this.handleUp, true)
  },

  data: function () {
    return {
      top: this.y,
      left: this.x,
      width: this.w,
      height: this.h,
      resizing: false,
      dragging: false,
      enabled: this.active,
      handle: null,
      zIndex: this.z,
      ratio: 1, //拖拽框的宽高比 即 w/h的值
      elmAngle: 0,
      // angleOffSet: 0,
      lastAngle: 0  // 上次拖拽停止后的旋转角度
    }
  },

  methods: {
    reviewDimensions: function () {
      if (this.minw > this.w) this.width = this.minw

      if (this.minh > this.h) this.height = this.minh

      if (this.parent) {
        const parentW = parseInt(this.$el.parentNode.clientWidth, 10)
        const parentH = parseInt(this.$el.parentNode.clientHeight, 10)

        this.parentW = parentW
        this.parentH = parentH

        if (this.w > this.parentW) this.width = parentW

        if (this.h > this.parentH) this.height = parentH

        if ((this.x + this.w) > this.parentW) this.width = parentW - this.x

        if ((this.y + this.h) > this.parentH) this.height = parentH - this.y
      }

      this.elmW = this.width
      this.elmH = this.height

      this.$emit('resizing', this.left, this.top, this.width, this.height)
    },
    // 选中该元素时
    elmDown: function (e) {
      const target = e.target || e.srcElement

      if (this.$el.contains(target)) {
        if (
          (this.dragHandle && !matchesSelectorToParentElements(target, this.dragHandle, this.$el)) ||
          (this.dragCancel && matchesSelectorToParentElements(target, this.dragCancel, this.$el))) {
          return
        }

        e.preventDefault()

        this.reviewDimensions()

        if (!this.enabled) {
          this.enabled = true

          this.$emit('activated')
          this.$emit('update:active', true)
        }

        if (this.draggable) {
          this.dragging = true
        }
      }
    },
    // 该元素失去焦点时
    elmUp: function () {
      console.log('!!!!')
      this.active = false;
    },
    deselect: function (e) {
      console.log('------->',e.type)
      if (e.type.indexOf('touch') !== -1) {
        this.mouseX = e.changedTouches[0].clientX
        this.mouseY = e.changedTouches[0].clientY
      } else {
        this.mouseX = e.pageX || e.clientX + document.documentElement.scrollLeft
        this.mouseY = e.pageY || e.clientY + document.documentElement.scrollTop
      }

      this.lastMouseX = this.mouseX
      this.lastMouseY = this.mouseY

      const target = e.target || e.srcElement
      const regex = new RegExp('handle-([trmbl]{2})', '')

      if (!this.$el.contains(target) && !regex.test(target.className)) {
        if (this.enabled) {
          this.enabled = false

          this.$emit('deactivated')
          this.$emit('update:active', false)
        }
      }
    },
    handleDown: function (handle, e) {
      this.handle = handle

      console.log(e.touches[0])
      if(handle.indexOf('tl') >= 0 && this.rotateBeginX === 0) {
        this.rotateBeginX = e.touches[0].clientX;
        this.rotateBeginY = e.touches[0].clientY;
        console.log(e.touches[0].clientX.toFixed(2), e.touches[0].clientY.toFixed(2))
      }
      if (e.stopPropagation) e.stopPropagation()
      if (e.preventDefault) e.preventDefault()

      this.resizing = true
    },
    fillParent: function (e) {
      if (!this.parent || !this.resizable || !this.maximize) return

      let done = false

      const animate = () => {
        if (!done) {
          window.requestAnimationFrame(animate)
        }

        if (this.axis === 'x') {
          if (
            this.width === this.parentW && this.left === this.parentX
          ) done = true
        } else if (this.axis === 'y') {
          if (
            this.height === this.parentH && this.top === this.parentY
          ) done = true
        } else if (this.axis === 'both') {
          if (
            this.width === this.parentW &&
            this.height === this.parentH &&
            this.top === this.parentY &&
            this.left === this.parentX
          ) done = true
        }

        if (this.axis === 'x' || this.axis === 'both') {
          if (this.width < this.parentW) {
            this.width++
            this.elmW++
          }

          if (this.left > this.parentX) {
            this.left--
            this.elmX--
          }
        }

        if (this.axis === 'y' || this.axis === 'both') {
          if (this.height < this.parentH) {
            this.height++
            this.elmH++
          }

          if (this.top > this.parentY) {
            this.top--
            this.elmY--
          }
        }

        this.$emit('resizing', this.left, this.top, this.width, this.height)
      }

      window.requestAnimationFrame(animate)
    },
    handleMove: function (e) {
      const isTouchMove = e.type.indexOf('touchmove') !== -1
      this.mouseX = isTouchMove
        ? e.touches[0].clientX
        : e.pageX || e.clientX + document.documentElement.scrollLeft
      this.mouseY = isTouchMove
        ? e.touches[0].clientY
        : e.pageY || e.clientY + document.documentElement.scrollTop

      let diffResizeX = Math.abs(this.mouseX - this.x0) - Math.abs(this.lastMouseX - this.x0) + this.mouseOffX
      let diffX = this.mouseX - this.lastMouseX + this.mouseOffX
      let diffResizeY = Math.abs(this.mouseY - this.y0) - Math.abs(this.lastMouseY - this.y0) + this.mouseOffY
      let diffY = this.mouseY - this.lastMouseY + this.mouseOffY


      this.mouseOffX = this.mouseOffY = 0

      this.lastMouseX = this.mouseX
      this.lastMouseY = this.mouseY


      let dX = diffX
      let dY = diffY

      if (this.resizing) {
        if (this.handle.indexOf('br') >= 0) {
          if (this.elmH + dY < this.minh) this.mouseOffY = (dY - (diffResizeY = this.minh - this.elmH))
          else if (this.parent && this.elmY + this.elmH + dY > this.parentH) this.mouseOffY = (dY - (diffResizeY = this.parentH - this.elmY - this.elmH))
          this.elmH += diffResizeY

          if (this.elmW + dX < this.minw) this.mouseOffX = (dX - (diffResizeX = this.minw - this.elmW))
          else if (this.parent && this.elmX + this.elmW + dX > this.parentW) this.mouseOffX = (dX - (diffResizeX = this.parentW - this.elmX - this.elmW))
          this.elmW += diffResizeX
        }

        this.left = (Math.round(this.elmX / this.grid[0]) * this.grid[0])
        this.top = (Math.round(this.elmY / this.grid[1]) * this.grid[1])

        // this.width = (Math.round(this.elmW / this.grid[0]) * this.grid[0])
        // this.height = (Math.round(this.elmW / this.grid[0]) * this.grid[0]) / this.ratio
        this.height = (Math.round(this.elmH / this.grid[1]) * this.grid[1])
        this.width = (Math.round(this.elmH / this.grid[1]) * this.grid[1]) * this.ratio
        this.$emit('resizing', this.left, this.top, this.width, this.height)

        if (this.handle.indexOf('tl') >= 0) {
          let endX = e.touches[0].clientX, endY = e.touches[0].clientY;
          console.log(endX.toFixed(2), endY.toFixed(2))
          let [x1, y1, x2, y2] = [this.rotateBeginX, this.rotateBeginY, endX, endY]
          this.rotateElement(x1, y1, x2, y2)
        }

      } else if (this.dragging) {
        if (this.parent) {
          if (this.elmX + dX < this.parentX) this.mouseOffX = (dX - (diffX = this.parentX - this.elmX))
          else if (this.elmX + this.elmW + dX > this.parentW) this.mouseOffX = (dX - (diffX = this.parentW - this.elmX - this.elmW))

          if (this.elmY + dY < this.parentY) this.mouseOffY = (dY - (diffY = this.parentY - this.elmY))
          else if (this.elmY + this.elmH + dY > this.parentH) this.mouseOffY = (dY - (diffY = this.parentH - this.elmY - this.elmH))
        }

        this.elmX += diffX
        this.elmY += diffY

        if (this.axis === 'x' || this.axis === 'both') {
          this.left = (Math.round(this.elmX / this.grid[0]) * this.grid[0])
        }
        if (this.axis === 'y' || this.axis === 'both') {
          this.top = (Math.round(this.elmY / this.grid[1]) * this.grid[1])
        }

        this.$emit('dragging', this.left, this.top)
      }

      this.x0 = this.elmX + this.elmW/2;
      this.y0 = this.elmY + this.elmH/2;
      console.log(this.x0, this.y0)
    },
    handleUp: function (e) {
      if (e.type.indexOf('touch') !== -1) {
        this.lastMouseX = e.changedTouches[0].clientX
        this.lastMouseY = e.changedTouches[0].clientY
      }
      this.handle = null
      if (this.resizing) {
        this.resizing = false
        this.$emit('resizestop', this.left, this.top, this.width, this.height)
      }
      if (this.dragging) {
        this.dragging = false
        this.$emit('dragstop', this.left, this.top)
      }

      this.elmX = this.left
      this.elmY = this.top
    },

    //删除元素
    removeElement: function (e) {

    },

    // //旋转元素 (x1,y1)是鼠标起始点 (x2,y2)是鼠标终点
    // rotateElement: function (x1, y1, x2, y2) {
    //   //计算元素中心点的位置
    //   // let x0 = this.elmX + this.elmW/2;
    //   // let y0 = this.elmY + this.elmH/2;
    //   // console.log('----->',x1, y1, x2, y2)
    //   // console.log(this.x0, this.y0)
    //   let angle1 = getAngle(x1, y1, this.x0, this.y0);
    //   let angle2 = getAngle(x2, y2, this.x0, this.y0);
	//
    //   // console.log(angle2,angle1)
    //   this.elmAngle = angle2 - angle1;
    //   console.log(this.elmAngle)
    // },
    rotateElement: function (beginPointX, beginPointY, endPointX, endPointY) {
      console.log(beginPointX, beginPointY, endPointX, endPointY)
      var x1 = (beginPointX - this.x0);
      var y1 = (beginPointY - this.y0);

      //得到 向量2
      var x2 = (endPointX - this.x0);
      var y2 = (endPointY - this.y0);

      //计算cos =(x1x2+y1y2)/[√(x1²+y1²)*√(x2²+y2²)]
      var cos =( x1 * x2 + y1 * y2) /( Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2)) * Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2)) );

      // console.log('cos--->', cos)
      var radina = Math.acos(cos);
      // console.log('radina--->', radina);

      // 角度
      this.elmAngle =  Math.ceil(180 / (Math.PI / radina));

      //如果在初始滑动位置与中点的连线的下边 就需要加 180度
      // console.log('-----(',endPointX,',', -endPointY,')(' + this.x0, -this.y0 + ')   ||| ', -(this.height/this.width) * (endPointX - this.x0) - this.y0);

      if(-endPointY < -(this.height/this.width) * (endPointX - this.x0) - this.y0){
        console.log('1111')
        this.elmAngle = Math.ceil(180 + (180 - this.elmAngle));
      }

      console.log('====>',this.elmAngle)

    }
  },

  computed: {
    style: function () {
      return {
        top: this.top + 'px',
        left: this.left + 'px',
        width: this.width + 'px',
        height: this.height + 'px',
        zIndex: this.zIndex,
        border: this.enabled? '1px dashed #AAAAAA': 'none',
        transform: 'rotate(' + this.elmAngle + 'deg)'
      }
    }
  },

  watch: {
    active: function (val) {
      this.enabled = val
    },
    z: function (val) {
      if (val >= 0 || val === 'auto') {
        this.zIndex = val
      }
    }
  }
}
</script>

<style scoped>
  .vdr {
    position: absolute;
    box-sizing: content-box;
    font-size: 0;
  }
  .handle {
    box-sizing: border-box;
    display: none;
    position: absolute;
    width: 20px;
    height: 20px;
    font-size: 1px;
    background: #EEE;
    border: 1px solid #333;
    border-radius: 50%;
  }

  .handle-br {
    bottom: -10px;
    right: -10px;
  }
  .handle-tl {
    top: -10px;
    left: -10px;
  }
  .handle-bl {
    bottom: -10px;
    left: -10px;
  }

  .list {
    width: 100%;
  }
  .images {
    width: inherit;
    /*position: absolute;*/
  }

  @media only screen and (max-width: 768px) {
    /* For mobile phones: */
    [class*="handle-"]:before {
      content: '';
      left: -30px;
      right: -30px;
      bottom: -30px;
      top: -30px;
      position: absolute;
    }
  }

</style>
