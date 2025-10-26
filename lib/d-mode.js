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
// @ts-nocheck
import { Directions, Modes, Quantities, } from './types';
import { DNode, DSvgNode } from './d-node';
import { ROW_H } from './utils';
import { DContainer, RLContainer, TBContainer, LRContainer, BTContainer, } from './d-container';
import { generateWavePath } from './utils';
function addAText(text) {
    var dNode = new DNode({
        x: -999999,
        y: -999999,
        text: text,
    });
    return dNode;
}
var DMode = /** @class */ (function () {
    function DMode(options) {
        var _a, _b;
        this.direction = '';
        this.mode = '';
        this.row = 1;
        this.column = 2;
        this.containers = [];
        var parent = options.parent, direction = options.direction, mode = options.mode;
        if (direction) {
            this.direction = direction;
        }
        if (mode) {
            this.mode = mode;
        }
        this.parent = parent;
        var cH = parent.el.clientHeight;
        var cW = parent.el.clientWidth;
        this.initContainers();
        if ([Directions.Bottom, Directions.Top].includes(this.direction)) {
            this.calcContainerCol(cW, ((_a = parent.setting) === null || _a === void 0 ? void 0 : _a.quantity) || Quantities.Low);
        }
        if ([Directions.Left, Directions.Right].includes(this.direction)) {
            this.calcContainerRow(cH, ((_b = parent.setting) === null || _b === void 0 ? void 0 : _b.quantity) || Quantities.Low);
        }
        this.init();
        this.mount(parent.el);
    }
    DMode.prototype.initContainers = function () { };
    DMode.prototype.init = function () { };
    DMode.prototype.mount = function (el) {
        this.containers.forEach(function (container) {
            el.appendChild(container.dom);
        });
    };
    DMode.prototype.update = function () { };
    DMode.prototype.calcContainerRow = function (h, quantity) {
        var _this = this;
        var _a;
        var _b = ((_a = this.parent.setting) === null || _a === void 0 ? void 0 : _a.nodeGaps) || [0, 0], xGap = _b[0], yGap = _b[1];
        var max = h / (ROW_H + yGap);
        if (quantity === Quantities.Low) {
            this.row = Math.floor(max / 3);
        }
        else if (quantity === Quantities.Medium) {
            this.row = Math.floor(max / 2);
        }
        else {
            this.row = Math.floor(max);
        }
        this.containers.forEach(function (container) {
            container.updateRows(_this.row);
        });
    };
    DMode.prototype.calcContainerCol = function (w, quantity) {
        var _this = this;
        this.column = 2;
        this.containers.forEach(function (container) {
            container.updateRows(_this.column);
        });
    };
    DMode.prototype.destroy = function () {
        var _this = this;
        this.containers.forEach(function (container) {
            container.destroy();
            _this.parent.el.removeChild(container.dom);
        });
    };
    return DMode;
}());
export { DMode };
var RLMode = /** @class */ (function (_super) {
    __extends(RLMode, _super);
    function RLMode(options) {
        var _this = _super.call(this, __assign(__assign({}, options), { direction: Directions.Left, mode: Modes.RL })) || this;
        _this.direction = Directions.Left;
        _this.mode = Modes.RL;
        return _this;
    }
    RLMode.prototype.initContainers = function () {
        var container = new RLContainer();
        var parentNode = this.parent.el;
        container.setSize(parentNode.clientWidth, parentNode.clientHeight);
        container.setToFixedLeftStyle();
        this.containers.push(container);
    };
    RLMode.prototype.init = function () { };
    RLMode.prototype.update = function () {
        var _this = this;
        var _a;
        var _b = this.parent.options || {}, onNodeCreate = _b.onNodeCreate, onBeforeNodeMount = _b.onBeforeNodeMount, onAfterNodeMount = _b.onAfterNodeMount, onNodeRemove = _b.onNodeRemove, onAfterNodeMove = _b.onAfterNodeMove, onBeforeNodeMove = _b.onBeforeNodeMove;
        var _c = ((_a = this.parent.setting) === null || _a === void 0 ? void 0 : _a.nodeGaps) || [0, 0], xGap = _c[0], yGap = _c[1];
        this.containers.forEach(function (container) {
            container.update({
                fillAText: function (row) {
                    var text = _this.parent.getTexts(1);
                    if (text[0]) {
                        var dNode = addAText(text[0]);
                        onNodeCreate === null || onNodeCreate === void 0 ? void 0 : onNodeCreate(dNode);
                        dNode.setSpeed({ x: -1, y: 0 });
                        onBeforeNodeMount === null || onBeforeNodeMount === void 0 ? void 0 : onBeforeNodeMount(dNode);
                        dNode.isInserted = true;
                        container.textsRows[row].push(dNode);
                        container.dom.appendChild(dNode.dom);
                        onAfterNodeMount === null || onAfterNodeMount === void 0 ? void 0 : onAfterNodeMount(dNode);
                    }
                },
                beforeMoveText: function (row, text, rect) {
                    if (!text.isInitPosition) {
                        text.isInitPosition = true;
                        text.moveTo(container.w + xGap, row * (ROW_H + yGap));
                    }
                    onBeforeNodeMove === null || onBeforeNodeMove === void 0 ? void 0 : onBeforeNodeMove(text, rect);
                },
                afterMoveText: function (row, text, rect) {
                    onAfterNodeMove === null || onAfterNodeMove === void 0 ? void 0 : onAfterNodeMove(text, rect);
                },
                isNeedRemove: function (text, box) {
                    if (text.x + box.width < 0) {
                        return true;
                    }
                    return false;
                },
                onRemove: function (text) {
                    onNodeRemove === null || onNodeRemove === void 0 ? void 0 : onNodeRemove(text);
                },
            });
        });
    };
    return RLMode;
}(DMode));
export { RLMode };
var LRMode = /** @class */ (function (_super) {
    __extends(LRMode, _super);
    function LRMode(options) {
        var _this = _super.call(this, __assign(__assign({}, options), { direction: Directions.Right, mode: Modes.LR })) || this;
        _this.direction = Directions.Right;
        _this.mode = Modes.LR;
        return _this;
    }
    LRMode.prototype.initContainers = function () {
        var container = new LRContainer();
        var parentNode = this.parent.el;
        container.setSize(parentNode.clientWidth, parentNode.clientHeight);
        container.setToFixedLeftStyle();
        this.containers.push(container);
    };
    LRMode.prototype.update = function () {
        var _this = this;
        var _a;
        var _b = this.parent.options || {}, onNodeCreate = _b.onNodeCreate, onBeforeNodeMount = _b.onBeforeNodeMount, onAfterNodeMount = _b.onAfterNodeMount, onNodeRemove = _b.onNodeRemove, onAfterNodeMove = _b.onAfterNodeMove, onBeforeNodeMove = _b.onBeforeNodeMove;
        var _c = ((_a = this.parent.setting) === null || _a === void 0 ? void 0 : _a.nodeGaps) || [0, 0], xGap = _c[0], yGap = _c[1];
        this.containers.forEach(function (container) {
            container.update({
                fillAText: function (row) {
                    var text = _this.parent.getTexts(1);
                    if (text[0]) {
                        var dNode = addAText(text[0]);
                        onNodeCreate === null || onNodeCreate === void 0 ? void 0 : onNodeCreate(dNode);
                        dNode.setSpeed({ x: 1, y: 0 });
                        onBeforeNodeMount === null || onBeforeNodeMount === void 0 ? void 0 : onBeforeNodeMount(dNode);
                        dNode.isInserted = true;
                        container.textsRows[row].push(dNode);
                        container.dom.appendChild(dNode.dom);
                        onAfterNodeMount === null || onAfterNodeMount === void 0 ? void 0 : onAfterNodeMount(dNode);
                    }
                },
                beforeMoveText: function (row, text, rect) {
                    if (!text.isInitPosition) {
                        text.isInitPosition = true;
                        var box = text.dom.getBoundingClientRect();
                        text.moveTo(-xGap - box.width, row * (ROW_H + yGap));
                    }
                    onBeforeNodeMove === null || onBeforeNodeMove === void 0 ? void 0 : onBeforeNodeMove(text, rect);
                },
                afterMoveText: function (row, text, rect) {
                    onAfterNodeMove === null || onAfterNodeMove === void 0 ? void 0 : onAfterNodeMove(text, rect);
                },
                isNeedRemove: function (text) {
                    var box = text.dom.getBoundingClientRect();
                    if (text.x > container.w + box.width) {
                        return true;
                    }
                    return false;
                },
                onRemove: function (text) {
                    onNodeRemove === null || onNodeRemove === void 0 ? void 0 : onNodeRemove(text);
                },
            });
        });
    };
    return LRMode;
}(DMode));
export { LRMode };
var BTMode = /** @class */ (function (_super) {
    __extends(BTMode, _super);
    function BTMode(options) {
        var _this = _super.call(this, __assign(__assign({}, options), { direction: Directions.Top, mode: Modes.BT })) || this;
        _this.direction = Directions.Top;
        _this.mode = Modes.BT;
        return _this;
    }
    BTMode.prototype.initContainers = function () {
        var container = new BTContainer();
        var parentNode = this.parent.el;
        container.setSize(parentNode.clientWidth, parentNode.clientHeight);
        container.setToFixedLeftStyle();
        this.containers.push(container);
    };
    BTMode.prototype.update = function () {
        var _this = this;
        var _a = this.parent.options || {}, onNodeCreate = _a.onNodeCreate, onBeforeNodeMount = _a.onBeforeNodeMount, onAfterNodeMount = _a.onAfterNodeMount, onNodeRemove = _a.onNodeRemove, onAfterNodeMove = _a.onAfterNodeMove, onBeforeNodeMove = _a.onBeforeNodeMove;
        this.containers.forEach(function (container) {
            container.update({
                fillAText: function (col) {
                    var text = _this.parent.getTexts(1);
                    if (text[0]) {
                        var dNode = addAText(text[0]);
                        onNodeCreate === null || onNodeCreate === void 0 ? void 0 : onNodeCreate(dNode);
                        dNode.setSpeed({ x: 0, y: -1 });
                        onBeforeNodeMount === null || onBeforeNodeMount === void 0 ? void 0 : onBeforeNodeMount(dNode);
                        dNode.isInserted = true;
                        container.textsRows[col].push(dNode);
                        container.dom.appendChild(dNode.dom);
                        onAfterNodeMount === null || onAfterNodeMount === void 0 ? void 0 : onAfterNodeMount(dNode);
                    }
                },
                beforeMoveText: function (index, text, rect) {
                    if (!text.isInitPosition) {
                        text.isInitPosition = true;
                        var box = text.dom.getBoundingClientRect();
                        text.moveTo((container.w / (_this.column + 1)) * (index + 1) - box.width / 2, container.h);
                    }
                    onBeforeNodeMove === null || onBeforeNodeMove === void 0 ? void 0 : onBeforeNodeMove(text, rect);
                },
                afterMoveText: function (index, text, rect) {
                    onAfterNodeMove === null || onAfterNodeMove === void 0 ? void 0 : onAfterNodeMove(text, rect);
                },
                isNeedRemove: function (text) {
                    var box = text.dom.getBoundingClientRect();
                    if (text.y + box.height < 0) {
                        return true;
                    }
                    return false;
                },
                onRemove: function (text) {
                    onNodeRemove === null || onNodeRemove === void 0 ? void 0 : onNodeRemove(text);
                },
            });
        });
    };
    return BTMode;
}(DMode));
export { BTMode };
var TBMode = /** @class */ (function (_super) {
    __extends(TBMode, _super);
    function TBMode(options) {
        var _this = _super.call(this, __assign(__assign({}, options), { direction: Directions.Bottom, mode: Modes.TB })) || this;
        _this.direction = Directions.Bottom;
        _this.mode = Modes.TB;
        return _this;
    }
    TBMode.prototype.initContainers = function () {
        var container = new TBContainer();
        var parentNode = this.parent.el;
        container.setSize(parentNode.clientWidth, parentNode.clientHeight);
        container.setToFixedLeftStyle();
        this.containers.push(container);
    };
    TBMode.prototype.update = function () {
        var _this = this;
        var _a;
        var _b = this.parent.options || {}, onNodeCreate = _b.onNodeCreate, onBeforeNodeMount = _b.onBeforeNodeMount, onAfterNodeMount = _b.onAfterNodeMount, onNodeRemove = _b.onNodeRemove, onAfterNodeMove = _b.onAfterNodeMove, onBeforeNodeMove = _b.onBeforeNodeMove;
        var _c = ((_a = this.parent.setting) === null || _a === void 0 ? void 0 : _a.nodeGaps) || [0, 0], xGap = _c[0], yGap = _c[1];
        this.containers.forEach(function (container) {
            container.update({
                fillAText: function (col) {
                    var text = _this.parent.getTexts(1);
                    if (text[0]) {
                        var dNode = addAText(text[0]);
                        onNodeCreate === null || onNodeCreate === void 0 ? void 0 : onNodeCreate(dNode);
                        dNode.setSpeed({ x: 0, y: 1 });
                        onBeforeNodeMount === null || onBeforeNodeMount === void 0 ? void 0 : onBeforeNodeMount(dNode);
                        dNode.isInserted = true;
                        container.textsRows[col].push(dNode);
                        container.dom.appendChild(dNode.dom);
                        onAfterNodeMount === null || onAfterNodeMount === void 0 ? void 0 : onAfterNodeMount(dNode);
                    }
                },
                beforeMoveText: function (index, text, rect) {
                    if (!text.isInitPosition) {
                        text.isInitPosition = true;
                        var box = text.dom.getBoundingClientRect();
                        text.moveTo((container.w / (_this.column + 1)) * (index + 1) - box.width / 2, -box.height - yGap);
                    }
                    onBeforeNodeMove === null || onBeforeNodeMove === void 0 ? void 0 : onBeforeNodeMove(text, rect);
                },
                afterMoveText: function (index, text, rect) {
                    onAfterNodeMove === null || onAfterNodeMove === void 0 ? void 0 : onAfterNodeMove(text, rect);
                },
                isNeedRemove: function (text) {
                    var box = text.dom.getBoundingClientRect();
                    if (text.y > container.h + box.height) {
                        return true;
                    }
                    return false;
                },
                onRemove: function (text) {
                    onNodeRemove === null || onNodeRemove === void 0 ? void 0 : onNodeRemove(text);
                },
            });
        });
    };
    return TBMode;
}(DMode));
export { TBMode };
var L45DMode = /** @class */ (function (_super) {
    __extends(L45DMode, _super);
    function L45DMode(options) {
        var _this = _super.call(this, __assign(__assign({}, options), { direction: Directions.Left, mode: Modes.L45D })) || this;
        _this.direction = Directions.Left;
        _this.mode = Modes.L45D;
        return _this;
    }
    L45DMode.prototype.initContainers = function () {
        var container = new DContainer();
        var parentNode = this.parent.el;
        var pW = parentNode.clientWidth;
        var pH = parentNode.clientHeight;
        var edgeWidth = Math.sqrt(Math.pow(pW, 2) + Math.pow(pH, 2));
        container.setSize(edgeWidth, (edgeWidth * pH) / pW);
        container.dom.style.transform = 'rotate(-45deg)';
        container.setToFixedLeftStyle();
        this.containers.push(container);
    };
    L45DMode.prototype.update = function () {
        var _this = this;
        var _a;
        var _b = this.parent.options || {}, onNodeCreate = _b.onNodeCreate, onBeforeNodeMount = _b.onBeforeNodeMount, onAfterNodeMount = _b.onAfterNodeMount, onNodeRemove = _b.onNodeRemove, onAfterNodeMove = _b.onAfterNodeMove, onBeforeNodeMove = _b.onBeforeNodeMove;
        var _c = ((_a = this.parent.setting) === null || _a === void 0 ? void 0 : _a.nodeGaps) || [0, 0], xGap = _c[0], yGap = _c[1];
        this.containers.forEach(function (container) {
            container.update({
                fillAText: function (col) {
                    var text = _this.parent.getTexts(1);
                    if (text[0]) {
                        var dNode = addAText(text[0]);
                        onNodeCreate === null || onNodeCreate === void 0 ? void 0 : onNodeCreate(dNode);
                        dNode.setSpeed({ x: -1, y: 0 });
                        onBeforeNodeMount === null || onBeforeNodeMount === void 0 ? void 0 : onBeforeNodeMount(dNode);
                        dNode.isInserted = true;
                        container.textsRows[col].push(dNode);
                        container.dom.appendChild(dNode.dom);
                        onAfterNodeMount === null || onAfterNodeMount === void 0 ? void 0 : onAfterNodeMount(dNode);
                    }
                },
                beforeMoveText: function (index, text, rect) {
                    if (!text.isInitPosition) {
                        text.isInitPosition = true;
                        text.moveTo(container.w + xGap, index * (ROW_H + yGap));
                    }
                    onBeforeNodeMove === null || onBeforeNodeMove === void 0 ? void 0 : onBeforeNodeMove(text, rect);
                },
                afterMoveText: function (index, text, rect) {
                    onAfterNodeMove === null || onAfterNodeMove === void 0 ? void 0 : onAfterNodeMove(text, rect);
                },
                isNeedRemove: function (text) {
                    var box = text.dom.getBoundingClientRect();
                    if (text.x + box.width < 0) {
                        return true;
                    }
                    return false;
                },
                onRemove: function (text) {
                    onNodeRemove === null || onNodeRemove === void 0 ? void 0 : onNodeRemove(text);
                },
            });
        });
    };
    return L45DMode;
}(DMode));
export { L45DMode };
var WaveMode = /** @class */ (function (_super) {
    __extends(WaveMode, _super);
    function WaveMode(options) {
        var _this = _super.call(this, __assign(__assign({}, options), { direction: Directions.Left, mode: Modes.LR })) || this;
        _this.direction = Directions.Left;
        _this.mode = Modes.LR;
        return _this;
    }
    WaveMode.prototype.initContainers = function () {
        var container = new RLContainer();
        container.createSvg();
        var parentNode = this.parent.el;
        container.setSize(parentNode.clientWidth, parentNode.clientHeight);
        container.setToFixedLeftStyle();
        this.containers.push(container);
    };
    WaveMode.prototype.init = function () {
        this.containers.forEach(function (container) {
            container.textsRows.forEach(function (texts, row) {
                var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('id', "d_waveMode-path-".concat(row));
                var y = ROW_H * row + ROW_H;
                path.setAttribute('d', generateWavePath(0, y, container.w, y, 3, 35));
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke', 'transparent');
                container.dom.appendChild(path);
                // textPath.setAttribute()
            });
        });
    };
    WaveMode.prototype.update = function () {
        var _this = this;
        var _a = this.parent.options || {}, onNodeCreate = _a.onNodeCreate, onBeforeNodeMount = _a.onBeforeNodeMount, onAfterNodeMount = _a.onAfterNodeMount, onNodeRemove = _a.onNodeRemove, onAfterNodeMove = _a.onAfterNodeMove, onBeforeNodeMove = _a.onBeforeNodeMove;
        this.containers.forEach(function (container) {
            container.update({
                fillAText: function (col) {
                    var text = _this.parent.getTexts(1);
                    if (text[0]) {
                        var dSvgNode = new DSvgNode({
                            x: -999999,
                            y: -999999,
                            text: text[0],
                        });
                        onNodeCreate === null || onNodeCreate === void 0 ? void 0 : onNodeCreate(dSvgNode);
                        var textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
                        textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "#d_waveMode-path-".concat(col));
                        dSvgNode._text.textContent = '';
                        dSvgNode._text.appendChild(textPath);
                        textPath.textContent = text[0];
                        // DNode.dom.appendChild(textPath);
                        dSvgNode.setSpeed({ x: -1, y: 0 });
                        onBeforeNodeMount === null || onBeforeNodeMount === void 0 ? void 0 : onBeforeNodeMount(dSvgNode);
                        dSvgNode.isInserted = true;
                        container.textsRows[col].push(dSvgNode);
                        container.dom.appendChild(dSvgNode.dom);
                        onAfterNodeMount === null || onAfterNodeMount === void 0 ? void 0 : onAfterNodeMount(dSvgNode);
                    }
                },
                beforeMoveText: function (index, text, rect) {
                    if (!text.isInitPosition) {
                        text.isInitPosition = true;
                        var path = document.querySelector("#d_waveMode-path-".concat(index));
                        text.moveTo(path.getTotalLength() + 5, 0);
                    }
                    onBeforeNodeMove === null || onBeforeNodeMove === void 0 ? void 0 : onBeforeNodeMove(text, rect);
                },
                afterMoveText: function (index, text, rect) {
                    onAfterNodeMove === null || onAfterNodeMove === void 0 ? void 0 : onAfterNodeMove(text, rect);
                },
                isNeedRemove: function (text) {
                    var box = text.dom.getBoundingClientRect();
                    if (text.x + box.width * 4 < 0) {
                        return true;
                    }
                    return false;
                },
                onRemove: function (text) {
                    onNodeRemove === null || onNodeRemove === void 0 ? void 0 : onNodeRemove(text);
                },
            });
        });
    };
    return WaveMode;
}(DMode));
export { WaveMode };
var CollisionMode = /** @class */ (function (_super) {
    __extends(CollisionMode, _super);
    function CollisionMode(options) {
        var _this = _super.call(this, __assign(__assign({}, options), { direction: Directions.Left, mode: Modes.LR })) || this;
        _this.direction = Directions.Left;
        _this.mode = Modes.LR;
        return _this;
    }
    CollisionMode.prototype.initContainers = function () {
        var leftContainer = new LRContainer();
        var rightContainer = new RLContainer();
        var parentNode = this.parent.el;
        leftContainer.setSize(parentNode.clientWidth / 2, parentNode.clientHeight);
        leftContainer.setToFixedLeftStyle();
        this.containers.push(leftContainer);
        rightContainer.setSize(parentNode.clientWidth / 2, parentNode.clientHeight);
        rightContainer.setToFixedRightStyle();
        this.containers.push(rightContainer);
    };
    CollisionMode.prototype.update = function () {
        var _this = this;
        var _a;
        var _b = this.parent.options || {}, onNodeCreate = _b.onNodeCreate, onBeforeNodeMount = _b.onBeforeNodeMount, onAfterNodeMount = _b.onAfterNodeMount, onNodeRemove = _b.onNodeRemove, onAfterNodeMove = _b.onAfterNodeMove, onBeforeNodeMove = _b.onBeforeNodeMove;
        var _c = ((_a = this.parent.setting) === null || _a === void 0 ? void 0 : _a.nodeGaps) || [0, 0], xGap = _c[0], yGap = _c[1];
        this.containers.forEach(function (container) {
            container.update({
                fillAText: function (col) {
                    var text = _this.parent.getTexts(1);
                    if (text[0]) {
                        if (container instanceof LRContainer) {
                            var dNode = addAText(text[0]);
                            onNodeCreate === null || onNodeCreate === void 0 ? void 0 : onNodeCreate(dNode);
                            dNode.setSpeed({ x: 1, y: 0 });
                            onBeforeNodeMount === null || onBeforeNodeMount === void 0 ? void 0 : onBeforeNodeMount(dNode);
                            dNode.isInserted = true;
                            container.textsRows[col].push(dNode);
                            container.dom.appendChild(dNode.dom);
                            onAfterNodeMount === null || onAfterNodeMount === void 0 ? void 0 : onAfterNodeMount(dNode);
                        }
                        if (container instanceof RLContainer) {
                            var dNode = addAText(text[0]);
                            onNodeCreate === null || onNodeCreate === void 0 ? void 0 : onNodeCreate(dNode);
                            dNode.setSpeed({ x: -1, y: 0 });
                            onBeforeNodeMount === null || onBeforeNodeMount === void 0 ? void 0 : onBeforeNodeMount(dNode);
                            dNode.isInserted = true;
                            container.textsRows[col].push(dNode);
                            container.dom.appendChild(dNode.dom);
                            onAfterNodeMount === null || onAfterNodeMount === void 0 ? void 0 : onAfterNodeMount(dNode);
                        }
                    }
                },
                beforeMoveText: function (index, text, rect) {
                    if (!text.isInitPosition) {
                        text.isInitPosition = true;
                        var y = index * (ROW_H + yGap);
                        if (container instanceof LRContainer) {
                            var box = text.dom.getBoundingClientRect();
                            text.moveTo(-5 - box.width, y);
                        }
                        if (container instanceof RLContainer) {
                            text.moveTo(container.w + 5, y);
                        }
                    }
                    onBeforeNodeMove === null || onBeforeNodeMove === void 0 ? void 0 : onBeforeNodeMove(text, rect);
                },
                afterMoveText: function (index, text, rect) {
                    onAfterNodeMove === null || onAfterNodeMove === void 0 ? void 0 : onAfterNodeMove(text, rect);
                },
                isNeedRemove: function (text) {
                    var box = text.dom.getBoundingClientRect();
                    if (container instanceof LRContainer) {
                        if (text.x > container.w) {
                            return true;
                        }
                    }
                    if (container instanceof RLContainer) {
                        if (text.x + box.width < 0) {
                            return true;
                        }
                    }
                    return false;
                },
                onRemove: function (text) {
                    onNodeRemove === null || onNodeRemove === void 0 ? void 0 : onNodeRemove(text);
                },
            });
        });
    };
    return CollisionMode;
}(DMode));
export { CollisionMode };
