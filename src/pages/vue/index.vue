<!-- 示例页面 -->
<template>
  <article class="page">
    <div id="content" style="height: 400px; width: 100%; border: 1px solid red; position: relative;"
    @click.stop.prevent="clickBg">
      <vue-draggable-resizable v-for="(item, key) in elementList" :elementUrls="item" :key="key" :w="100" :h="80"  :parent="true" :active="activeKey === key" @activated="onActivated(key)">
        <!--<img class="images" :src="item" alt="" >-->
        <!--<img class="images" src="../../assets/imgs/share.png" alt="">-->
      </vue-draggable-resizable>
    </div>
    <button type="button" @click="toCanvas">点击拍照</button>
    <img class="canvasContainer" :src="canvasPic" alt="">
  </article>
</template>

<script>
  /* 页面所需组件 */
  import html2canvas from 'html2canvas';
  import VueDraggableResizable from '@/components/vue-draggable-resizable/index.vue'
  import touch from './touch.min.js'
  export default {
    data () {
      return {
        width: 0,
        height:0,
        x: 0,
        y: 0,
        activeKey: undefined,
        canvasPic: '',
        elementList: [
          ["https://c.58cdn.com.cn/frs/upload/back.4bb48519df85a4c9713d7ff77f027c45.svg","https://pic4.58cdn.com.cn/nowater/fangfe/n_v21c8d1218d4ce4c0abb49f30e4b967074.jpg"],
          "https://pic4.58cdn.com.cn/nowater/fangfe/n_v21c8d1218d4ce4c0abb49f30e4b967074.jpg",
          "https://pic6.58cdn.com.cn/nowater/fangfe/n_v2e68e4aa93e2a49d8a690b23e511986fc.jpg"],
      }
    },
    watch: {
    },
    created: function () {
    },
    mounted () {
      // this.overScroll(document.querySelector('#content'));
      // document.body.addEventListener('touchmove', function(evt) {
      //   if(!evt._isScroller) {
      //     evt.preventDefault();
      //   }
      // });
        console.log(touch)
    },
    methods: {
      /**
       * 获取数据：列表信息
       */
      fetchData () {
        fetchListData({
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          keyword: this.searchData.value
        })
          .then(res => {
            if (res && res.code == 0 && res.data && res.data.list) {
              this.houseDate.list = res.data.list;
            } else {
              console.error('数据异常请稍后再试！')
              this.$toast('message', '2000');
            }
          })
          .catch(err => {
            console.error(err);
            //this.$toast('服务器异常请稍后再试！');
          })
      },

      onActivated: function (key) {
        this.activeKey = key;
      },
      overScroll : function(el) {
        el.addEventListener('touchstart', function() {
          var top = el.scrollTop
            ,totalScroll = el.scrollHeight
            ,currentScroll = top + el.offsetHeight;
          if(top === 0) {
            el.scrollTop = 1;
          }else if(currentScroll === totalScroll) {
            el.scrollTop = top - 1;
          }
        });

        el.addEventListener('touchmove', function(evt) {
          if(el.offsetHeight < el.scrollHeight)
            evt._isScroller = true;
        });
      },
      toCanvas : function () {
        var canvas = document.createElement("canvas");
        html2canvas(document.getElementById('content'), {
          canvas: canvas,
          useCORS:true,
          logging:true,
        })
          .then((canvas) => {
          // document.body.appendChild(canvas);
          // let canvasEle = canvas.getContext("2d");
          this.canvasPic = canvas.toDataURL("image/png");
        });
      },
      clickBg: function (e) {
        this.activeKey = undefined;
      }

    },
    components: {
      VueDraggableResizable
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @import '../../assets/less/base.less';

  #app{
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .canvasContainer{
    width: inherit;
  }
  .page {
    position: relative;
    width: 100%;
    height: 100%;
    background: #F6F6F6;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;


    /* 搜索 */
    .search {
      width: 100%;
      padding: 20px 30px;
      box-sizing: border-box;
      background: #fff;
    }

    /* 列表 */
    .list {
      width: 100%;
    }
    .images{
      width: inherit;
      position: absolute;
    }
  }
</style>
