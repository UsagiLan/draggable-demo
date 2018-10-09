<!-- 组件：房源项 -->

<template>
  <div class="house-item-wrap">
    <div class="img-box">
      <img v-lazy="itemData.picUrl" v-if="itemData.picUrl">
    </div>
    <div class="info-box">
      <div class="title">{{itemData.title}}</div>
      <div class="desc">{{itemData.desc}}</div>
      <div class="price">{{itemData.price | priceFilter}}</div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Lazyload from 'vue-lazyload'
  // 图片懒加载
  Vue.use(Lazyload);
  
  export default {
    props: {
      itemData: {
        type: Object,
        default: function () {
          return {};
        }
      }
    },
    filters: {
      priceFilter (value) {
        if (value != '') {
          return `${value}元/月`;
        }
        return '';
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">

  @import (reference) '../../assets/less/mixin.less';

  .house-item-wrap {
    display: flex;
    align-items: center;

    width: 100%;
    margin: 20px auto 0;
    padding: 20px 30px;
    box-sizing: border-box;
    overflow: hidden;
    background: #fff;

    .img-box {
      width: 170px;
      height: 130px;
      background: #ccc;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info-box {
      height: 130px;
      padding: 0 20px;
      box-sizing: border-box;

      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .text-overflow;

      .title, .desc, .price {
        font-family: PingFangSC-Light;
        font-size: 24px;
        color: #666666;
      }
      .title {
        font-family: PingFangSC-Medium;
      }
    }
  }
</style>
