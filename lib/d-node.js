var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ROW_H } from './utils';
var DNode = /** @class */ (function () {
    function DNode(props) {
        var _this = this;
        this.x = 0;
        this.y = 0;
        this.speedX = 1;
        this.speedY = 1;
        this.isInserted = false;
        this.isInitPosition = false;
        this._isStop = false;
        this._popupVisible = false;
        this.modes = [];
        this.onClick = function (evt) {
            evt.stopPropagation();
            _this.onStop();
        };
        this.onFree = function () {
            _this.isStop = false;
            _this.popupVisible = false;
        };
        var text = props.text, x = props.x, y = props.y, speedX = props.speedX, speedY = props.speedY;
        this.x = x;
        this.y = y;
        this.text = text;
        this.speedX = speedX || 0;
        this.speedY = speedY || 0;
        this.createDom();
        this.moveTo(x, y);
        this.init();
    }
    Object.defineProperty(DNode.prototype, "isStop", {
        get: function () {
            return this._isStop;
        },
        set: function (value) {
            if (value) {
                this.dom.style.setProperty('z-index', '2');
            }
            else {
                this.dom.style.setProperty('z-index', null);
            }
            this._isStop = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DNode.prototype, "popupVisible", {
        get: function () {
            return this._popupVisible;
        },
        set: function (value) {
            var _a, _b, _c, _d;
            this._popupVisible = value;
            if (value) {
                if (this.y > ROW_H) {
                    (_a = this.popup) === null || _a === void 0 ? void 0 : _a.classList.add('fixed-top');
                }
                else {
                    (_b = this.popup) === null || _b === void 0 ? void 0 : _b.classList.add('fixed-bottom');
                }
                (_c = this.popup) === null || _c === void 0 ? void 0 : _c.style.setProperty('display', 'block');
            }
            else {
                (_d = this.popup) === null || _d === void 0 ? void 0 : _d.style.setProperty('display', 'none');
            }
        },
        enumerable: false,
        configurable: true
    });
    DNode.prototype.createDom = function () {
        var wrapper = document.createElement('div');
        wrapper.classList.add('dm-node');
        wrapper.style.setProperty('transform', "translate(".concat(this.x, "px, ").concat(this.y, "px)"));
        // 弹幕文本
        var textNode = document.createElement('div');
        textNode.textContent = this.text || '';
        this._text = textNode;
        textNode.classList.add('dm-node-text');
        // 
        var prefixNode = document.createElement('div');
        prefixNode.classList.add('dm-node-prefix');
        var suffixNode = document.createElement('div');
        suffixNode.classList.add('dm-node-suffix');
        wrapper.appendChild(prefixNode);
        wrapper.appendChild(textNode);
        wrapper.appendChild(suffixNode);
        this.dom = wrapper;
        this.createPopup();
        return wrapper;
    };
    DNode.prototype.createPopup = function () {
        var popup = document.createElement('div');
        popup.classList.add('dm-node-popup');
        this.dom.appendChild(popup);
        this.popup = popup;
    };
    DNode.prototype.init = function () {
        this.dom.addEventListener('click', this.onClick);
        document.addEventListener('click', this.onFree);
    };
    DNode.prototype.movePosition = function (x, y) {
        this.dom.style.setProperty('transform', "translate(".concat(x, "px, ").concat(y, "px)"));
    };
    DNode.prototype.moveTo = function (dx, dy) {
        this.x = dx;
        this.y = dy;
        this.movePosition(dx, dy);
    };
    DNode.prototype.setText = function (text) {
        this.text = text;
    };
    DNode.prototype.addPrefixContent = function (prefix) {
        var prefixNode = this.dom.querySelector('.dm-node-prefix');
        if (prefixNode) {
            prefixNode.appendChild(prefix);
        }
    };
    DNode.prototype.addSuffixContent = function (suffix) {
        var suffixNode = this.dom.querySelector('.dm-node-suffix');
        if (suffixNode) {
            suffixNode.appendChild(suffix);
        }
    };
    DNode.prototype.setSpeed = function (_a) {
        var x = _a.x, y = _a.y;
        var sX = x !== null && x !== void 0 ? x : this.speedX;
        var sY = y !== null && y !== void 0 ? y : this.speedY;
        this.speedX = sX;
        this.speedY = sY;
    };
    DNode.prototype.insertTo = function (el) {
        if (this.isInserted) {
            return;
        }
        if (el) {
            el.appendChild(this.dom);
            this.isInserted = true;
        }
    };
    DNode.prototype.onStop = function () {
        this.isStop = true;
        this.popupVisible = true;
    };
    DNode.prototype.destroy = function () {
        this.dom.removeEventListener('click', this.onClick);
        document.removeEventListener('click', this.onFree);
    };
    return DNode;
}());
export { DNode };
var DSvgNode = /** @class */ (function (_super) {
    __extends(DSvgNode, _super);
    function DSvgNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DSvgNode.prototype.createDom = function () {
        var wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        wrapper.classList.add('dm-node');
        var textNode = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textNode.setAttribute('dominant-baseline', 'middle');
        this._text = textNode;
        textNode.textContent = this.text || '';
        wrapper.appendChild(textNode);
        this.dom = wrapper;
        return wrapper;
    };
    DSvgNode.prototype.movePosition = function (x, y) {
        this._text.setAttribute('x', x.toString());
        this._text.setAttribute('y', y.toString());
    };
    return DSvgNode;
}(DNode));
export { DSvgNode };
