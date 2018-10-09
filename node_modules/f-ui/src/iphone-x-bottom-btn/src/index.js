export default {
    install(Vue, options) {
        Vue.directive('iphone-x-bottom-btn', {
            inserted(el, binding) {
                const isIphoneX =
                    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
                    window.screen &&
                    window.screen.height == '812' &&
                    window.screen.width == '375';
                if (!isIphoneX) {
                    return;
                }
                const arg = binding.arg;
                if (arg) {
                    el.classList.add(arg);
                } else {
                    el.style['margin-bottom'] = '0.9rem';
                    el.style['width'] = '9.2rem';
                    el.style['margin-left'] = '0.4rem';
                    el.style['height'] = '1.067rem';
                    el.style['line-height'] = '1.067rem';
                    const bg = document.createElement('div');
                    bg.style['width'] = '10rem';
                    bg.style['height'] = '2.1067rem';
                    bg.style['background'] = '#FFF';
                    bg.style['position'] = 'fixed';
                    bg.style['bottom'] = '0';
                    bg.style['left'] = '0';
                    bg.style['border-top'] = 'solid 1px #eee';
                    const parent = el.parentNode;
                    parent.replaceChild(bg, el);
                    bg.appendChild(el);
                }
            },
        });
    },
};
