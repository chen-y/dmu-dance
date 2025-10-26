
export function randomInt(n: number, m: number) {
  return Math.floor(Math.random() * (m - n + 1) + n);
}

export function deepCloneArr<E>(arr: Array<E[]>): Array<E[]> {
  return arr.map((item) => {
    if (Array.isArray(item)) {
      const a = item as Array<E[]>;
      return deepCloneArr<E>(a);
    }
    return item;
  }) as Array<E[]>;
}

export const ROW_H = 24;
export const TEXT_GAP = 10;


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
export function generateWavePath(startX: number, startY: number, endX: number, endY: number, waveCount = 3, amplitude = 20) {
  // 计算总长度和中点
  const totalLength = endX - startX;
  const midY = (startY + endY) / 2;
  
  // 初始化路径，移动到起点
  let d = `M ${startX} ${startY}`;
  
  // 计算每个波浪段的长度
  const segmentLength = totalLength / waveCount;
  
  // 生成波浪路径
  for (let i = 1; i <= waveCount; i++) {
    // 控制点X坐标（当前波浪段的中点）
    const controlX = startX + (i - 0.5) * segmentLength;
    // 控制点Y坐标（根据波峰/波谷交替变化）
    const controlY = i % 2 === 0 ? midY - amplitude : midY + amplitude;
    // 目标点X坐标
    const targetX = startX + i * segmentLength;
    // 目标点Y坐标
    const targetY = i === waveCount ? endY : midY;
    
    // 添加二次贝塞尔曲线命令
    d += ` Q ${controlX} ${controlY}, ${targetX} ${targetY}`;
  }
  
  return d;
}