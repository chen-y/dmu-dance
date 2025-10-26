export function randomInt(n, m) {
    return Math.floor(Math.random() * (m - n + 1) + n);
}
export function deepCloneArr(arr) {
    return arr.map(function (item) {
        if (Array.isArray(item)) {
            var a = item;
            return deepCloneArr(a);
        }
        return item;
    });
}
export var ROW_H = 24;
export var TEXT_GAP = 10;
/**
 * 生成波浪形SVG路径
 * @param {number} startX - 起点X坐标
 * @param {number} startY - 起点Y坐标
 * @param {number} endX - 终点X坐标
 * @param {number} endY - 终点Y坐标
 * @param {number} waveCount - 波浪数量（默认3个）
 * @param {number} amplitude - 波浪振幅（默认20）
 * @returns {string} SVG path的d属性值
 */
export function generateWavePath(startX, startY, endX, endY, waveCount, amplitude) {
    if (waveCount === void 0) { waveCount = 3; }
    if (amplitude === void 0) { amplitude = 20; }
    // 计算总长度和中点
    var totalLength = endX - startX;
    var midY = (startY + endY) / 2;
    // 初始化路径，移动到起点
    var d = "M ".concat(startX, " ").concat(startY);
    // 计算每个波浪段的长度
    var segmentLength = totalLength / waveCount;
    // 生成波浪路径
    for (var i = 1; i <= waveCount; i++) {
        // 控制点X坐标（当前波浪段的中点）
        var controlX = startX + (i - 0.5) * segmentLength;
        // 控制点Y坐标（根据波峰/波谷交替变化）
        var controlY = i % 2 === 0 ? midY - amplitude : midY + amplitude;
        // 目标点X坐标
        var targetX = startX + i * segmentLength;
        // 目标点Y坐标
        var targetY = i === waveCount ? endY : midY;
        // 添加二次贝塞尔曲线命令
        d += " Q ".concat(controlX, " ").concat(controlY, ", ").concat(targetX, " ").concat(targetY);
    }
    return d;
}
