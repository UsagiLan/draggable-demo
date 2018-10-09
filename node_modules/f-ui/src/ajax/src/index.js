import Axios from 'axios';
export default {
    install(Vue) {
        Object.defineProperties(Vue.prototype, {
            $ajax: {
                get() {
                    return Axios;
                },
            },
        });
    },
};
