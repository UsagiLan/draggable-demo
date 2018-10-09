export default {
    install(Vue, options) {
        Vue.directive('touch-class', {
            bind: function (el, binding) {
                const arg = binding.arg;
                el.addEventListener('touchstart', (event) => {
                    el.classList.add(arg || 'touched');
                });
                el.addEventListener('touchend', (event) => {
                    el.classList.remove(arg || 'touched');
                });
            },
        }
        );
    },
};
