<!-- 组件：输入框 -->

<template>
  <section class="input-warp" :class="{active:isActive}">
    <input class="input"
           :type="type"
           :name="name"
           :value="value"
           :placeholder="placeholder"
           :readonly="readonly"
           :disabled="disabled"
           :maxlength="maxlength"
           :minlength="minlength"
           ref="input"
           @focus="handleFocus"
           @blur="handleBlur"
           @input="handleInput"/>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        isActive: false,
        events: {
          focus: 'focus',
          blur: 'blur',
          input: 'input'
        }
      };
    },
    props: {
      type: {
        type: String,
        default: 'text'
      },
      name: String,
      value: [String, Number],
      readonly: Boolean,
      disabled: Boolean,
      maxlength: Number,
      minlength: Number,
      placeholder: String
    },
    watch: {
      value: {
        handler: function (value, old) {
          if (value != '') {
            this.isActive = true;
          }
        },
        immediate: true
      }
    },
    methods: {
      handleFocus (e) {
        this.isActive = true;
        this.$emit(this.events.focus, e);
      },
      handleBlur (e) {
        if (this.value == '') {
          this.isActive = false;
        }
        this.$emit(this.events.blur, e);
      },
      handleInput (e) {
        this.$emit(this.events.input, e.target.value);
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  .input-warp {
    width: 100%;
    position: relative;
    text-align: left;
    background: #ccc;
    border: 1px solid #ccc; /*no*/

    .input {
      width: 100%;
      display: block;
      line-height: 60px;
      height: 60px;
      font-size: 38px;
      color: #aaa;
      text-align: left;
      border: none;
    }
    &.active {
      .input {
        color: #000;
      }
    }
  }
</style>
