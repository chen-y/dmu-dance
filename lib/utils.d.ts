export declare function randomInt(n: number, m: number): number;
export declare function deepCloneArr<E>(arr: Array<E[]>): Array<E[]>;
export declare const ROW_H = 24;
export declare const TEXT_GAP = 10;
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
export declare function generateWavePath(startX: number, startY: number, endX: number, endY: number, waveCount?: number, amplitude?: number): string;
