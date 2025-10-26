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
import { deepCloneArr, ROW_H, TEXT_GAP } from "./utils";
var DContainer = /** @class */ (function () {
    function DContainer() {
        this.textsRows = [];
        this.w = 0;
        this.h = 0;
        this.createDom();
    }
    DContainer.prototype.createDom = function () {
        this.dom = document.createElement('div');
        this.dom.classList.add('dm-container');
    };
    DContainer.prototype.createSvg = function () {
        this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.dom.classList.add('dm-container');
    };
    DContainer.prototype.setSize = function (w, h) {
        var cW = w.toString();
        var cH = h.toString();
        this.w = w;
        this.h = h;
        this.dom.style.setProperty('width', "".concat(cW, "px"));
        this.dom.style.setProperty('height', "".concat(cH, "px"));
    };
    DContainer.prototype.setToFixedLeftStyle = function () {
        this.dom.style.top = '0';
        this.dom.style.left = '0';
    };
    DContainer.prototype.setToFixedRightStyle = function () {
        this.dom.style.top = '0';
        this.dom.style.right = '0';
    };
    DContainer.prototype.adDNode = function (text) {
        var _this = this;
        var isSucceed = false;
        this.textsRows.forEach(function (row, r) {
            if (row.length === 0) {
                text.x = _this.w + 1;
                text.y = r * ROW_H + 5;
                row.push(text);
                isSucceed = true;
                return;
            }
            var last = row[row.length - 1];
            var box = last.dom.getBoundingClientRect();
            if (last.x + box.width + TEXT_GAP < text.x) {
                row.push(text);
                isSucceed = true;
                return;
            }
        });
        return isSucceed;
    };
    DContainer.prototype.update = function (_a) {
        var _this = this;
        var fillAText = _a.fillAText, beforeMoveText = _a.beforeMoveText, isNeedRemove = _a.isNeedRemove, afterMoveText = _a.afterMoveText, onRemove = _a.onRemove;
        // 第一轮补充内容，将元素添加到页面
        var rows = deepCloneArr(this.textsRows);
        rows.forEach(function (texts, row) {
            if (texts.length === 0) {
                fillAText(row);
            }
            var last = texts[texts.length - 1];
            if (last) {
                var box = last.dom.getBoundingClientRect();
                var isXInView = last.x >= 0 && last.x + box.width + TEXT_GAP <= _this.w;
                var isYInView = last.y >= 0 && last.y + box.height + TEXT_GAP <= _this.h;
                if (isXInView && isYInView) {
                    fillAText(row);
                }
            }
            texts.forEach(function (text, col) {
                var rect = text.dom.getBoundingClientRect();
                // 计算节点不在屏幕容器内（不可见），删除节点
                if (isNeedRemove(text, rect) && text.isInitPosition) {
                    text.destroy();
                    _this.textsRows[row].splice(col, 1);
                    _this.dom.removeChild(text.dom);
                    onRemove === null || onRemove === void 0 ? void 0 : onRemove(text);
                    return;
                }
                beforeMoveText(row, text, rect);
                if (!text.isStop) {
                    text.moveTo(text.x + text.speedX, text.y + text.speedY);
                }
                afterMoveText === null || afterMoveText === void 0 ? void 0 : afterMoveText(row, text, rect);
            });
        });
    };
    DContainer.prototype.updateRows = function (row) {
        var len = this.textsRows.length;
        if (len < row) {
            for (var i = 0; i < row - len; i++) {
                this.textsRows.push([]);
            }
        }
        else if (len > row) {
            this.textsRows = this.textsRows.slice(0, row);
        }
    };
    DContainer.prototype.destroy = function () {
        this.textsRows.forEach(function (row) {
            row.forEach(function (text) { return text.destroy(); });
        });
        // this.dom.remove();
    };
    return DContainer;
}());
export { DContainer };
var RLContainer = /** @class */ (function (_super) {
    __extends(RLContainer, _super);
    function RLContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RLContainer;
}(DContainer));
export { RLContainer };
var LRContainer = /** @class */ (function (_super) {
    __extends(LRContainer, _super);
    function LRContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LRContainer;
}(DContainer));
export { LRContainer };
var BTContainer = /** @class */ (function (_super) {
    __extends(BTContainer, _super);
    function BTContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BTContainer;
}(DContainer));
export { BTContainer };
var TBContainer = /** @class */ (function (_super) {
    __extends(TBContainer, _super);
    function TBContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TBContainer;
}(DContainer));
export { TBContainer };
