export default {
    install(Vue) {
        let keyboardUp = { status: false };
        let oriHeight = window.innerHeight;
        let oriWidth = window.innerWidth;
        const ua = navigator.userAgent;
        if (ua.match(/iPhone/i) || ua.match(/iPod/i)) {
            let focusoutTimer;
            window.addEventListener('focusin', () => {
                clearTimeout(focusoutTimer);
                keyboardUp.status = true;
            });
            window.addEventListener('focusout', () => {
                focusoutTimer = setTimeout(() => {
                    keyboardUp.status = false;
                }, 500);
            });
        } else {
            window.addEventListener('resize', function () {
                if (oriWidth == window.innerWidth) {
                    if (oriHeight <= window.innerHeight) {
                        keyboardUp.status = false;
                    } else {
                        keyboardUp.status = true;
                    }
                } else {
                    oriHeight = window.innerHeight;
                    oriWidth = window.innerWidth;
                }
            });
        }
        Vue.mixin({
            data() {
                return {
                    keyboardUp,
                };
            },
        });
    },
};
