import { Quantities, type Setting, type DMDanceProps, type Options } from "./types";
import { DNode, DSvgNode } from "./d-node";
import { DMode, RLMode, LRMode, BTMode, TBMode, L45DMode, WaveMode, CollisionMode } from "./d-mode";
import { DContainer } from "./d-container";
import './dm.css';

import { TEXT_GAP } from "./utils";

export * from './types'

export {
  DMode,
  RLMode,
  LRMode,
  BTMode,
  TBMode,
  L45DMode,
  WaveMode,
  CollisionMode,
  DNode,
  DSvgNode,
  DContainer,
}

export class DMDance implements DMDanceProps {
  modes: DMode[] = [];
  options: Options;
  setting: Setting = { quantity: Quantities.High, nodeGaps:[TEXT_GAP, TEXT_GAP] };
  el: HTMLElement;
  pool: string[] = [];
  currentIndex: number = 0;

  isRunning: boolean = false;
  
  timer?: number;
  
  constructor(options: Options) {
    const { el, setting } = options;
    this.options = options;
    this.el = el;
    if (setting) {
      this.setting = { ...this.setting, ...setting };
    }

    this.init();
  }

  init() {
    const rlMode = new RLMode({
      parent: this
    });
    this.setModes([rlMode]);
  }

  update() {
    this.modes.forEach(mode => mode.update());
  }


  setMode(mode: DMode): void {
    this.modes = [mode];
  }

  setModes(modes: DMode[]): void {
    this.modes = modes;
  }

  setSetting(setting: Setting): void {
    this.setting = { ...this.setting, ...setting };
  }

  getTexts(num: number): string[] {
    const movedIndex = this.currentIndex + num;
    const texts = this.pool.slice(this.currentIndex, movedIndex);
    this.currentIndex = movedIndex;
    return texts;
  }

  start() {
    this.isRunning = true;
    this.update();
    this.timer = window.requestAnimationFrame(() => this.start());
  }

  stop() {
    this.isRunning = false;
    if (this.timer) {
      window.cancelAnimationFrame(this.timer);
    }
    this.timer = undefined;
  }

  destroy() {
    this.stop();
    this.modes.forEach(mode => mode.destroy());
  }
}
