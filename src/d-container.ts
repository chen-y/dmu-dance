import { type DNodeProps, type TextsList } from "./types";
import { deepCloneArr, ROW_H, TEXT_GAP } from "./utils";

interface ContainerUpdateFns {
  fillAText: (index: number) => void;
  beforeMoveText: (index: number, text: DNodeProps, rect: DOMRect) => void;
  afterMoveText?: (index: number, text: DNodeProps, rect: DOMRect) => void;
  isNeedRemove: (text: DNodeProps, rect: DOMRect) => boolean;
  onRemove: (node: DNodeProps) => void;
}

export class DContainer {
  dom!: HTMLElement | SVGElement;
  textsRows: TextsList = [];
  w: number = 0;
  h: number = 0;

  constructor() {
    this.createDom();
  }

  createDom() {
    this.dom = document.createElement('div');
    this.dom.classList.add('dm-container');
  }

  createSvg() {
    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.dom.classList.add('dm-container');
  }

  setSize(w: number, h: number) {
    const cW = w.toString();
    const cH = h.toString();
    this.w = w;
    this.h = h;
    this.dom.style.setProperty('width', `${cW}px`);
    this.dom.style.setProperty('height', `${cH}px`);
  }

  setToFixedLeftStyle() {
    this.dom.style.top = '0';
    this.dom.style.left = '0';
  }

  setToFixedRightStyle() {
    this.dom.style.top = '0';
    this.dom.style.right = '0';
  }

  adDNode(text: DNodeProps): boolean {
    let isSucceed = false;
    this.textsRows.forEach((row, r) => {
      if (row.length === 0) {
        text.x = this.w + 1;
        text.y = r * ROW_H + 5;
        row.push(text);
        isSucceed = true;
        return;
      }

      const last = row[row.length - 1];
      const box = last.dom.getBoundingClientRect();
      if (last.x + box.width + TEXT_GAP < text.x) {
        row.push(text);
        isSucceed = true;
        return;
      }
    });
    return isSucceed;
  }

  update({ fillAText,beforeMoveText, isNeedRemove, afterMoveText, onRemove }: ContainerUpdateFns) {
    // 第一轮补充内容，将元素添加到页面
    const rows = deepCloneArr(this.textsRows);
    
    rows.forEach((texts, row) => {
      if (texts.length === 0) {
        fillAText(row);
      }

      const last = texts[texts.length - 1];
      if (last) {
        const box = last.dom.getBoundingClientRect();
        const isXInView = last.x >= 0 && last.x + box.width + TEXT_GAP <= this.w;
        const isYInView = last.y >= 0 && last.y + box.height + TEXT_GAP <= this.h;
        if (isXInView && isYInView) {
          fillAText(row);
        }
      }

      texts.forEach((text, col) => {
        const rect = text.dom.getBoundingClientRect();
        // 计算节点不在屏幕容器内（不可见），删除节点
        if (isNeedRemove(text, rect) && text.isInitPosition) {
          text.destroy();
          this.textsRows[row].splice(col, 1);
          this.dom.removeChild(text.dom);
          onRemove?.(text)
          return;
        }

        beforeMoveText(row, text, rect);
        
        if (!text.isStop) {
          text.moveTo(text.x + text.speedX, text.y + text.speedY);
        }

        afterMoveText?.(row, text, rect);
      });
    });
  }

  updateRows(row: number) {
    const len = this.textsRows.length;
    
    if (len < row) {
      for (let i = 0; i < row - len; i++) {
        this.textsRows.push([]);
      }
    } else if (len > row) {
      this.textsRows = this.textsRows.slice(0, row);
    }
  }

  destroy() {
    this.textsRows.forEach(row => {
      row.forEach(text => text.destroy());
    });
    // this.dom.remove();
  }
}

export class RLContainer extends DContainer {
}

export class LRContainer extends DContainer {
}

export class BTContainer extends DContainer {
}

export class TBContainer extends DContainer {
}