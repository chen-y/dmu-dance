// @ts-nocheck
import {
  Directions,
  Modes,
  Quantities,
  type DMDanceProps,
  type DModeProps,
} from './types';
import { DNode, DSvgNode } from './d-node';
import { ROW_H } from './utils';
import {
  DContainer,
  RLContainer,
  TBContainer,
  LRContainer,
  BTContainer,
} from './d-container';
import { generateWavePath } from './utils';

function addAText(text: string) {
  const dNode = new DNode({
    x: -999999,
    y: -999999,
    text: text,
  });
  return dNode;
}

interface DModeOptions {
  parent: DMDanceProps;
  width?: number;
  height?: number;
  direction?: string;
  mode?: string;
}

export class DMode implements DModeProps {
  direction: string = '';
  mode: string = '';
  row: number = 1;
  column: number = 2;
  parent: DMDanceProps;
  containers: DContainer[] = [];

  constructor(options: DModeOptions) {
    const { parent, direction, mode } = options;
    if (direction) {
      this.direction = direction;
    }
    if (mode) {
      this.mode = mode;
    }
    this.parent = parent;
    const cH = parent.el.clientHeight;
    const cW = parent.el.clientWidth;

    this.initContainers();

    if ([Directions.Bottom, Directions.Top].includes(this.direction)) {
      this.calcContainerCol(cW, parent.setting?.quantity || Quantities.Low);
    }

    if ([Directions.Left, Directions.Right].includes(this.direction)) {
      this.calcContainerRow(cH, parent.setting?.quantity || Quantities.Low);
    }

    this.init();
    this.mount(parent.el);
  }

  initContainers() {}

  init() {}

  mount(el: HTMLElement) {
    this.containers.forEach((container) => {
      el.appendChild(container.dom);
    });
  }

  update() {}

  calcContainerRow(h: number, quantity: string): void {
    const [xGap, yGap] = this.parent.setting?.nodeGaps || [0, 0];
    const max = h / (ROW_H + yGap);
    if (quantity === Quantities.Low) {
      this.row = Math.floor(max / 3);
    } else if (quantity === Quantities.Medium) {
      this.row = Math.floor(max / 2);
    } else {
      this.row = Math.floor(max);
    }

    this.containers.forEach((container) => {
      container.updateRows(this.row);
    });
  }

  calcContainerCol(w: number, quantity: string): void {
    this.column = 2;
    this.containers.forEach((container) => {
      container.updateRows(this.column);
    });
  }

  destroy() {
    this.containers.forEach((container) => {
      container.destroy();
      this.parent.el.removeChild(container.dom);
    });
  }
}

export class RLMode extends DMode {
  direction: string = Directions.Left;
  mode: string = Modes.RL;

  constructor(options: DModeOptions) {
    super({
      ...options,
      direction: Directions.Left,
      mode: Modes.RL,
    });
  }

  initContainers(): void {
    const container = new RLContainer();
    const parentNode = this.parent.el;

    container.setSize(parentNode.clientWidth, parentNode.clientHeight);
    container.setToFixedLeftStyle();
    this.containers.push(container);
  }

  init(): void {}

  update() {
    const {
      onNodeCreate,
      onBeforeNodeMount,
      onAfterNodeMount,
      onNodeRemove,
      onAfterNodeMove,
      onBeforeNodeMove,
    } = this.parent.options || {};
    const [xGap, yGap] = this.parent.setting?.nodeGaps || [0, 0];
    this.containers.forEach((container) => {
      container.update({
        fillAText: (row) => {
          const text = this.parent.getTexts(1);
          if (text[0]) {
            const dNode = addAText(text[0]);
            onNodeCreate?.(dNode);
            dNode.setSpeed({ x: -1, y: 0 });
            onBeforeNodeMount?.(dNode);
            dNode.isInserted = true;
            container.textsRows[row].push(dNode);
            container.dom.appendChild(dNode.dom);
            onAfterNodeMount?.(dNode);
          }
        },
        beforeMoveText: (row, text, rect) => {
          if (!text.isInitPosition) {
            text.isInitPosition = true;
            text.moveTo(container.w + xGap, row * (ROW_H + yGap));
          }
          onBeforeNodeMove?.(text, rect);
        },
        afterMoveText: (row, text, rect) => {
          onAfterNodeMove?.(text, rect);
        },
        isNeedRemove: (text, box) => {
          if (text.x + box.width < 0) {
            return true;
          }
          return false;
        },
        onRemove(text) {
          onNodeRemove?.(text);
        },
      });
    });
  }
}

export class LRMode extends DMode {
  direction: string = Directions.Right;
  mode: string = Modes.LR;

  constructor(options: DModeOptions) {
    super({
      ...options,
      direction: Directions.Right,
      mode: Modes.LR,
    });
  }

  initContainers(): void {
    const container = new LRContainer();
    const parentNode = this.parent.el;

    container.setSize(parentNode.clientWidth, parentNode.clientHeight);
    container.setToFixedLeftStyle();
    this.containers.push(container);
  }

  update(): void {
    const {
      onNodeCreate,
      onBeforeNodeMount,
      onAfterNodeMount,
      onNodeRemove,
      onAfterNodeMove,
      onBeforeNodeMove,
    } = this.parent.options || {};
    const [xGap, yGap] = this.parent.setting?.nodeGaps || [0, 0];
    this.containers.forEach((container) => {
      container.update({
        fillAText: (row) => {
          const text = this.parent.getTexts(1);
          if (text[0]) {
            const dNode = addAText(text[0]);
            onNodeCreate?.(dNode);
            dNode.setSpeed({ x: 1, y: 0 });
            onBeforeNodeMount?.(dNode);
            dNode.isInserted = true;
            container.textsRows[row].push(dNode);
            container.dom.appendChild(dNode.dom);
            onAfterNodeMount?.(dNode);
          }
        },
        beforeMoveText: (row, text, rect) => {
          if (!text.isInitPosition) {
            text.isInitPosition = true;
            const box = text.dom.getBoundingClientRect();

            text.moveTo(-xGap - box.width, row * (ROW_H + yGap));
          }
          onBeforeNodeMove?.(text, rect);
        },
        afterMoveText: (row, text, rect) => {
          onAfterNodeMove?.(text, rect);
        },
        isNeedRemove: (text) => {
          const box = text.dom.getBoundingClientRect();
          if (text.x > container.w + box.width) {
            return true;
          }
          return false;
        },
        onRemove(text) {
          onNodeRemove?.(text);
        },
      });
    });
  }
}

export class BTMode extends DMode {
  direction: string = Directions.Top;
  mode: string = Modes.BT;
  constructor(options: DModeOptions) {
    super({
      ...options,
      direction: Directions.Top,
      mode: Modes.BT,
    });
  }

  initContainers(): void {
    const container = new BTContainer();
    const parentNode = this.parent.el;

    container.setSize(parentNode.clientWidth, parentNode.clientHeight);
    container.setToFixedLeftStyle();
    this.containers.push(container);
  }

  update(): void {
    const {
      onNodeCreate,
      onBeforeNodeMount,
      onAfterNodeMount,
      onNodeRemove,
      onAfterNodeMove,
      onBeforeNodeMove,
    } = this.parent.options || {};
    this.containers.forEach((container) => {
      container.update({
        fillAText: (col) => {
          const text = this.parent.getTexts(1);
          if (text[0]) {
            const dNode = addAText(text[0]);
            onNodeCreate?.(dNode);
            dNode.setSpeed({ x: 0, y: -1 });
            onBeforeNodeMount?.(dNode);
            dNode.isInserted = true;
            container.textsRows[col].push(dNode);
            container.dom.appendChild(dNode.dom);
            onAfterNodeMount?.(dNode);
          }
        },
        beforeMoveText: (index, text, rect) => {
          if (!text.isInitPosition) {
            text.isInitPosition = true;
            const box = text.dom.getBoundingClientRect();

            text.moveTo(
              (container.w / (this.column + 1)) * (index + 1) - box.width / 2,
              container.h
            );
          }
          onBeforeNodeMove?.(text, rect);
        },
        afterMoveText: (index, text, rect) => {
          onAfterNodeMove?.(text, rect);
        },
        isNeedRemove: (text) => {
          const box = text.dom.getBoundingClientRect();
          if (text.y + box.height < 0) {
            return true;
          }
          return false;
        },
        onRemove(text) {
          onNodeRemove?.(text);
        },
      });
    });
  }
}

export class TBMode extends DMode {
  direction: string = Directions.Bottom;
  mode: string = Modes.TB;

  constructor(options: DModeOptions) {
    super({
      ...options,
      direction: Directions.Bottom,
      mode: Modes.TB,
    });
  }

  initContainers(): void {
    const container = new TBContainer();
    const parentNode = this.parent.el;

    container.setSize(parentNode.clientWidth, parentNode.clientHeight);
    container.setToFixedLeftStyle();
    this.containers.push(container);
  }

  update(): void {
    const {
      onNodeCreate,
      onBeforeNodeMount,
      onAfterNodeMount,
      onNodeRemove,
      onAfterNodeMove,
      onBeforeNodeMove,
    } = this.parent.options || {};
    const [xGap, yGap] = this.parent.setting?.nodeGaps || [0, 0];
    this.containers.forEach((container) => {
      container.update({
        fillAText: (col) => {
          const text = this.parent.getTexts(1);
          if (text[0]) {
            const dNode = addAText(text[0]);
            onNodeCreate?.(dNode);
            dNode.setSpeed({ x: 0, y: 1 });
            onBeforeNodeMount?.(dNode);
            dNode.isInserted = true;
            container.textsRows[col].push(dNode);
            container.dom.appendChild(dNode.dom);
            onAfterNodeMount?.(dNode);
          }
        },
        beforeMoveText: (index, text, rect) => {
          if (!text.isInitPosition) {
            text.isInitPosition = true;
            const box = text.dom.getBoundingClientRect();

            text.moveTo(
              (container.w / (this.column + 1)) * (index + 1) - box.width / 2,
              -box.height - yGap
            );
          }
          onBeforeNodeMove?.(text, rect);
        },
        afterMoveText: (index, text, rect) => {
          onAfterNodeMove?.(text, rect);
        },
        isNeedRemove: (text) => {
          const box = text.dom.getBoundingClientRect();
          if (text.y > container.h + box.height) {
            return true;
          }
          return false;
        },
        onRemove(text) {
          onNodeRemove?.(text);
        },
      });
    });
  }
}

export class L45DMode extends DMode {
  direction: string = Directions.Left;
  mode: string = Modes.L45D;
  constructor(options: DModeOptions) {
    super({
      ...options,
      direction: Directions.Left,
      mode: Modes.L45D,
    });
  }

  initContainers(): void {
    const container = new DContainer();
    const parentNode = this.parent.el;
    const pW = parentNode.clientWidth;
    const pH = parentNode.clientHeight;

    const edgeWidth = Math.sqrt(pW ** 2 + pH ** 2);

    container.setSize(edgeWidth, (edgeWidth * pH) / pW);
    container.dom.style.transform = 'rotate(-45deg)';
    container.setToFixedLeftStyle();
    this.containers.push(container);
  }

  update(): void {
    const {
      onNodeCreate,
      onBeforeNodeMount,
      onAfterNodeMount,
      onNodeRemove,
      onAfterNodeMove,
      onBeforeNodeMove,
    } = this.parent.options || {};
    const [xGap, yGap] = this.parent.setting?.nodeGaps || [0, 0];
    this.containers.forEach((container) => {
      container.update({
        fillAText: (col) => {
          const text = this.parent.getTexts(1);
          if (text[0]) {
            const dNode = addAText(text[0]);
            onNodeCreate?.(dNode);
            dNode.setSpeed({ x: -1, y: 0 });
            onBeforeNodeMount?.(dNode);
            dNode.isInserted = true;
            container.textsRows[col].push(dNode);
            container.dom.appendChild(dNode.dom);
            onAfterNodeMount?.(dNode);
          }
        },
        beforeMoveText: (index, text, rect) => {
          if (!text.isInitPosition) {
            text.isInitPosition = true;
            text.moveTo(container.w + xGap, index * (ROW_H + yGap));
          }
          onBeforeNodeMove?.(text, rect);
        },
        afterMoveText: (index, text, rect) => {
          onAfterNodeMove?.(text, rect);
        },
        isNeedRemove: (text) => {
          const box = text.dom.getBoundingClientRect();
          if (text.x + box.width < 0) {
            return true;
          }
          return false;
        },
        onRemove(text) {
          onNodeRemove?.(text);
        },
      });
    });
  }
}

export class WaveMode extends DMode {
  direction: string = Directions.Left;
  mode: string = Modes.LR;
  constructor(options: DModeOptions) {
    super({
      ...options,
      direction: Directions.Left,
      mode: Modes.LR,
    });
  }

  initContainers(): void {
    const container = new RLContainer();
    container.createSvg();
    const parentNode = this.parent.el;

    container.setSize(parentNode.clientWidth, parentNode.clientHeight);
    container.setToFixedLeftStyle();
    this.containers.push(container);
  }

  init(): void {
    this.containers.forEach((container) => {
      container.textsRows.forEach((texts, row) => {
        const path = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        path.setAttribute('id', `d_waveMode-path-${row}`);
        const y = ROW_H * row + ROW_H;
        path.setAttribute('d', generateWavePath(0, y, container.w, y, 3, 35));
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'transparent');
        container.dom.appendChild(path);

        // textPath.setAttribute()
      });
    });
  }

  update(): void {
    const {
      onNodeCreate,
      onBeforeNodeMount,
      onAfterNodeMount,
      onNodeRemove,
      onAfterNodeMove,
      onBeforeNodeMove,
    } = this.parent.options || {};
    this.containers.forEach((container) => {
      container.update({
        fillAText: (col) => {
          const text = this.parent.getTexts(1);
          if (text[0]) {
            const dSvgNode = new DSvgNode({
              x: -999999,
              y: -999999,
              text: text[0],
            });
            onNodeCreate?.(dSvgNode);
            const textPath = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'textPath'
            );
            textPath.setAttributeNS(
              'http://www.w3.org/1999/xlink',
              'xlink:href',
              `#d_waveMode-path-${col}`
            );
            dSvgNode._text.textContent = '';
            dSvgNode._text.appendChild(textPath);
            textPath.textContent = text[0];
            // DNode.dom.appendChild(textPath);
            dSvgNode.setSpeed({ x: -1, y: 0 });
            onBeforeNodeMount?.(dSvgNode);
            dSvgNode.isInserted = true;
            container.textsRows[col].push(dSvgNode);
            container.dom.appendChild(dSvgNode.dom);
            onAfterNodeMount?.(dSvgNode);
          }
        },
        beforeMoveText: (index, text, rect) => {
          if (!text.isInitPosition) {
            text.isInitPosition = true;
            const path = document.querySelector(
              `#d_waveMode-path-${index}`
            )! as SVGPathElement;

            text.moveTo(path.getTotalLength() + 5, 0);
          }
          onBeforeNodeMove?.(text, rect);
        },
        afterMoveText: (index, text, rect) => {
          onAfterNodeMove?.(text, rect);
        },
        isNeedRemove: (text) => {
          const box = text.dom.getBoundingClientRect();
          if (text.x + box.width * 4 < 0) {
            return true;
          }
          return false;
        },
        onRemove(text) {
          onNodeRemove?.(text);
        },
      });
    });
  }
}

export class CollisionMode extends DMode {
  direction: string = Directions.Left;
  mode: string = Modes.LR;
  constructor(options: DModeOptions) {
    super({
      ...options,
      direction: Directions.Left,
      mode: Modes.LR,
    });
  }

  initContainers(): void {
    const leftContainer = new LRContainer();
    const rightContainer = new RLContainer();
    const parentNode = this.parent.el;

    leftContainer.setSize(parentNode.clientWidth / 2, parentNode.clientHeight);
    leftContainer.setToFixedLeftStyle();
    this.containers.push(leftContainer);

    rightContainer.setSize(parentNode.clientWidth / 2, parentNode.clientHeight);
    rightContainer.setToFixedRightStyle();
    this.containers.push(rightContainer);
  }

  update(): void {
    const {
      onNodeCreate,
      onBeforeNodeMount,
      onAfterNodeMount,
      onNodeRemove,
      onAfterNodeMove,
      onBeforeNodeMove,
    } = this.parent.options || {};
    const [xGap, yGap] = this.parent.setting?.nodeGaps || [0, 0];
    this.containers.forEach((container) => {
      container.update({
        fillAText: (col) => {
          const text = this.parent.getTexts(1);
          if (text[0]) {
            if (container instanceof LRContainer) {
              const dNode = addAText(text[0]);
              onNodeCreate?.(dNode);
              dNode.setSpeed({ x: 1, y: 0 });
              onBeforeNodeMount?.(dNode);
              dNode.isInserted = true;
              container.textsRows[col].push(dNode);
              container.dom.appendChild(dNode.dom);
              onAfterNodeMount?.(dNode);
            }

            if (container instanceof RLContainer) {
              const dNode = addAText(text[0]);
              onNodeCreate?.(dNode);
              dNode.setSpeed({ x: -1, y: 0 });
              onBeforeNodeMount?.(dNode);
              dNode.isInserted = true;
              container.textsRows[col].push(dNode);
              container.dom.appendChild(dNode.dom);
              onAfterNodeMount?.(dNode);
            }
          }
        },
        beforeMoveText: (index, text, rect) => {
          if (!text.isInitPosition) {
            text.isInitPosition = true;
            const y = index * (ROW_H + yGap);
            if (container instanceof LRContainer) {
              const box = text.dom.getBoundingClientRect();
              text.moveTo(-5 - box.width, y);
            }
            if (container instanceof RLContainer) {
              text.moveTo(container.w + 5, y);
            }
          }
          onBeforeNodeMove?.(text, rect);
        },
        afterMoveText(index, text, rect) {
          onAfterNodeMove?.(text, rect);
        },
        isNeedRemove: (text) => {
          const box = text.dom.getBoundingClientRect();
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
        onRemove(text) {
          onNodeRemove?.(text);
        },
      });
    });
  }
}
