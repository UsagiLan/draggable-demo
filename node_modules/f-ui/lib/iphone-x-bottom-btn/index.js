module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
    install: function install(Vue, options) {
        Vue.directive('iphone-x-bottom-btn', {
            inserted: function inserted(el, binding) {
                var isIphoneX = /iPad|iPhone|iPod/.test(navigator.userAgent) && window.screen && window.screen.height == '812' && window.screen.width == '375';
                if (!isIphoneX) {
                    return;
                }
                var arg = binding.arg;
                if (arg) {
                    el.classList.add(arg);
                } else {
                    el.style['margin-bottom'] = '0.9rem';
                    el.style['width'] = '9.2rem';
                    el.style['margin-left'] = '0.4rem';
                    el.style['height'] = '1.067rem';
                    el.style['line-height'] = '1.067rem';
                    var bg = document.createElement('div');
                    bg.style['width'] = '10rem';
                    bg.style['height'] = '2.1067rem';
                    bg.style['background'] = '#FFF';
                    bg.style['position'] = 'fixed';
                    bg.style['bottom'] = '0';
                    bg.style['left'] = '0';
                    bg.style['border-top'] = 'solid 1px #eee';
                    var parent = el.parentNode;
                    parent.replaceChild(bg, el);
                    bg.appendChild(el);
                }
            }
        });
    }
});

/***/ })
/******/ ]);