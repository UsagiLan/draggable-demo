<template>
  <div class="dialog-wrap" v-if="visible">
    <div class="dialog-box">
      <h5 class="dialog-title" v-if="title">{{ title }}</h5>
      <p class="dialog-content">{{ content }}</p>
      <div class="btn-box">
        <div class="btn-item" v-if="Object.prototype.toString.apply(btn) === '[object Array]'" v-for="(b, i) in btn"
             :key="i" @click="handleItemBtnClick(i)">{{b}}
        </div>
        <div class="btn-item" v-if="typeof btn === 'string'" @click="handleItemBtnClick(0)">{{ btn }}</div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        visible: false // 是否展现窗口
      }
    },
    props: {
      title: { // 标题
        type: String,
        default: ''
      },
      content: { // 详细提示
        type: String,
        default: ''
      },
      btn: { // 按钮配置
        type: [String, Array],
        default: '我知道了'
      },
      callback: {
        type: Function,
        default: (index) => {
        }
      }
    },
    methods: {
      handleItemBtnClick (index) {
        this.visible = false;
        this.$utils.stopScrollOff();
        this.callback(index);
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  .dialog-wrap {
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
    .dialog-box {
      display: inline-block;
      background-color: #fff;
      text-align: center;
      border-radius: 3px;
      position: relative;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .dialog-title {
        font-size: 30px;
        color: #333;
        padding: 30px;
      }
      .dialog-content {
        font-size: 24px;
        color: #333;
        padding: 0 60px;
      }
      .btn-box {
        display: flex;
      }
      .btn-item {
        margin-top: 30px;
        flex: 1;
        height: 80px;
        line-height: 80px;
        text-align: center;
        font-size: 30px;
        color: #333;
        border-top: 1px solid #f3f3f3;
        border-left: 1px solid #f3f3f3;
      }
      .btn-item:first-child {
        border-right: 0;
      }
    }
  }
</style>
