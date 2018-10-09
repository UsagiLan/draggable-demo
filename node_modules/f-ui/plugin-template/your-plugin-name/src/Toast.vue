<template>
    <div v-show="show" class="toast">
        <p v-for="item in output" :key="item">{{item}}</p>
    </div>
</template>

<script>
export default {
    name: 'toast',
    computed: {
        output() {
            if (typeof this.msg == 'string') {
                return [this.msg];
            } else {
                return this.msg;
            }
        },
    },
    methods: {
    },
    data() {
        return {
            msg: '',
            show: false,
        };
    },
};
</script>

<style lang="scss" scoped>
@import '../../common/css/utils.scss';
.toast {
    line-height: rem(90);
    text-align: center;
    background-color: #000;
    opacity: 0.7;
    color: #fff;
    font-size: rem(30);
    width: rem(370);
    border-radius: rem(2);
    position: fixed;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 30;
}
</style>
