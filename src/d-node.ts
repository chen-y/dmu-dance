import { DMode } from './d-mode';
import { type DNodeProps } from './types'
import { ROW_H } from './utils';

export interface DNodeOptions {
  x: number;
  y: number;
  fontSize?: number;
  text: string;
  speedX?: number;
  speedY?: number;
}

export class DNode implements DNodeProps {
  text?: string;
  x: number = 0;
  y: number = 0;
  speedX: number = 1;
  speedY: number = 1;
  fontSize?: number;
  isInserted: boolean = false;
  isInitPosition: boolean = false;
  _isStop: boolean = false;
  popup!: HTMLElement;
  _popupVisible: boolean = false;
  modes: DMode[] = [];
  dom!: SVGElement | HTMLElement;
  _text!: SVGTextElement | HTMLElement;

  constructor(props: DNodeOptions) {
    const { text, x, y, speedX , speedY } = props;
    this.x = x;
    this.y = y;
    this.text = text;
    this.speedX = speedX || 0;
    this.speedY = speedY || 0;
    this.createDom();
    this.moveTo(x, y);
    this.init();
  }

  get isStop() {
    return this._isStop;
  }

  set isStop(value: boolean) {
    if (value) {
      this.dom.style.setProperty('z-index', '2');
    } else {
      this.dom.style.setProperty('z-index', null);
    }
    this._isStop = value;
  }

  get popupVisible() {
    return this._popupVisible;
  }

  set popupVisible(value: boolean) {
    this._popupVisible = value;
    if (value) {
      if (this.y > ROW_H) {
        this.popup?.classList.add('fixed-top');
      } else {
        this.popup?.classList.add('fixed-bottom');
      }
      this.popup?.style.setProperty('display', 'block');
    } else {
      this.popup?.style.setProperty('display', 'none');
    }
  }

  createDom(): SVGElement | HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('dm-node');
    wrapper.style.setProperty('transform', `translate(${this.x}px, ${this.y}px)`);
    // 弹幕文本
    const textNode = document.createElement('div');
    textNode.textContent = this.text || '';
    this._text = textNode;
    textNode.classList.add('dm-node-text');
    // 
    const prefixNode = document.createElement('div');
    prefixNode.classList.add('dm-node-prefix');
    const suffixNode = document.createElement('div');
    suffixNode.classList.add('dm-node-suffix');
    wrapper.appendChild(prefixNode);
    wrapper.appendChild(textNode);
    wrapper.appendChild(suffixNode);
    this.dom = wrapper;
    this.createPopup();
    return wrapper;
  }

  createPopup() {
    const popup = document.createElement('div');
    popup.classList.add('dm-node-popup');

    this.dom.appendChild(popup);
    this.popup = popup;
  }

  init() {
    this.dom.addEventListener('click', this.onClick);
    document.addEventListener('click', this.onFree);
  }

  movePosition(x: number, y: number) {
    this.dom.style.setProperty('transform', `translate(${x}px, ${y}px)`);
  }

  moveTo(dx: number, dy: number): void {
    this.x = dx;
    this.y = dy;
    this.movePosition(dx, dy);
  }

  setText(text: string): void {
    this.text = text;
  }

  addPrefixContent(prefix: HTMLElement) {
    const prefixNode = this.dom.querySelector('.dm-node-prefix');
    if (prefixNode) {
      prefixNode.appendChild(prefix);
    }
  }

  addSuffixContent(suffix: HTMLElement) {
    const suffixNode = this.dom.querySelector('.dm-node-suffix');
    if (suffixNode) {
      suffixNode.appendChild(suffix);
    }
  }

  addPopupContent(node: HTMLElement) {
    const popup = this.dom.querySelector('.dm-node-popup');
    if (popup) {
      popup.appendChild(node);
    }
  }

  setSpeed({x, y}: { x: number; y: number }): void {
    const sX = x ?? this.speedX;
    const sY = y ?? this.speedY;
    this.speedX = sX;
    this.speedY = sY;
  }

  insertTo(el: SVGElement) {
    if (this.isInserted) {
      return;
    }
    if (el) {
      el.appendChild(this.dom)
      this.isInserted = true;
    }
  }

  onStop() {
    this.isStop = true;
    this.popupVisible = true;
  }

  onClick = (evt: Event) => {
    evt.stopPropagation();
    this.onStop();
  }

  onFree = () => {
    this.isStop = false;
    this.popupVisible = false;
  }

  destroy() {
    this.dom.removeEventListener('click', this.onClick);
    document.removeEventListener('click', this.onFree);
  }
}

export class DSvgNode extends DNode {

  createDom() {
    const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    wrapper.classList.add('dm-node');
    const textNode = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textNode.setAttribute('dominant-baseline', 'middle');
    this._text = textNode;
    textNode.textContent = this.text || '';
    wrapper.appendChild(textNode);
    this.dom = wrapper;
    return wrapper as SVGElement;
  }

  movePosition(x: number, y: number): void {
    this._text.setAttribute('x', x.toString());
    this._text.setAttribute('y', y.toString());
  }
}