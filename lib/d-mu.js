var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Quantities } from "./types";
import { DNode, DSvgNode } from "./d-node";
import { DMode, RLMode, LRMode, BTMode, TBMode, L45DMode, WaveMode, CollisionMode } from "./d-mode";
import { DContainer } from "./d-container";
import './dm.css';
import { TEXT_GAP } from "./utils";
export * from './types';
export { DMode, RLMode, LRMode, BTMode, TBMode, L45DMode, WaveMode, CollisionMode, DNode, DSvgNode, DContainer, };
var DMDance = /** @class */ (function () {
    function DMDance(options) {
        this.modes = [];
        this.setting = { quantity: Quantities.High, nodeGaps: [TEXT_GAP, TEXT_GAP] };
        this.pool = [];
        this.currentIndex = 0;
        this.isRunning = false;
        var el = options.el, setting = options.setting;
        this.options = options;
        this.el = el;
        if (setting) {
            this.setting = __assign(__assign({}, this.setting), setting);
        }
        this.init();
    }
    DMDance.prototype.init = function () {
        var rlMode = new RLMode({
            parent: this
        });
        this.setModes([rlMode]);
    };
    DMDance.prototype.update = function () {
        this.modes.forEach(function (mode) { return mode.update(); });
    };
    DMDance.prototype.setMode = function (mode) {
        this.modes = [mode];
    };
    DMDance.prototype.setModes = function (modes) {
        this.modes = modes;
    };
    DMDance.prototype.setSetting = function (setting) {
        this.setting = __assign(__assign({}, this.setting), setting);
    };
    DMDance.prototype.getTexts = function (num) {
        var movedIndex = this.currentIndex + num;
        var texts = this.pool.slice(this.currentIndex, movedIndex);
        this.currentIndex = movedIndex;
        return texts;
    };
    DMDance.prototype.start = function () {
        var _this = this;
        this.isRunning = true;
        this.update();
        this.timer = window.requestAnimationFrame(function () { return _this.start(); });
    };
    DMDance.prototype.stop = function () {
        this.isRunning = false;
        if (this.timer) {
            window.cancelAnimationFrame(this.timer);
        }
        this.timer = undefined;
    };
    DMDance.prototype.destroy = function () {
        this.stop();
        this.modes.forEach(function (mode) { return mode.destroy(); });
    };
    return DMDance;
}());
export { DMDance };
