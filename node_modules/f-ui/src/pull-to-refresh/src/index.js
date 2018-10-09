import Vue from 'vue';
import PullToRefreshComponent from './PullToRefresh';
import pullToRefresh from 'mobile-pull-to-refresh';
import ptrAnimatesMaterial from './animates';
// 原版的样式是px为单位的，不支持高清，已经做替换
// import 'mobile-pull-to-refresh/dist/styles/material/style.css';

let PullToRefreshConstructor = Vue.extend(PullToRefreshComponent);

let initInstance = (bottom)=>{
    let instance = new PullToRefreshConstructor({
        el: document.createElement('div'),
    });
    document.body.appendChild(instance.$el);
};

export default {
    install(Vue, {selector='body'}={}) {
        initInstance();
        pullToRefresh({
            container: document.querySelector(selector),
            animates: ptrAnimatesMaterial,
            // animates: ptrAnimatesMaterial2,
            // animates: ptrAnimatesIos,

            refresh() {
                return new Promise((resolve) => {
                    window.document.dispatchEvent(new CustomEvent('pull-to-refresh', {detail: {finish: resolve}}));
                });
            },
        });
    },
};
