

export const Directions = {
  Left: 'left',
  Right: 'right',
  Top: 'top',
  Bottom: 'bottom',
}

export const Modes = {
  RL: 'rl',
  LR: 'lr',
  BT: 'bt',
  TB: 'tb',
  L45D: 'rl45d',
}

export const Quantities = {
  Low: 'low', // 1/3
  Medium: 'medium', // 1/2
  High: 'high', // 1/1
}

export interface NodeLifecycleMap {
  onNodeCreate?(d: DNodeProps): void;
  onBeforeNodeMount?(d: DNodeProps): void;
  onAfterNodeMount?(d: DNodeProps): void;
  onBeforeNodeMove?(d: DNodeProps, rect: DOMRect): void;
  onAfterNodeMove?(d: DNodeProps, rect: DOMRect): void;
  onNodeRemove?(d: DNodeProps): void;
}

export interface DNodeProps extends NodeLifecycleMap {
  text?: string;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  isInserted?: boolean;
  isInitPosition?: boolean;
  isStop?: boolean;
  popupVisible?: boolean;
  popup: HTMLElement;
  dom: SVGElement | HTMLElement;
  _text: SVGTextElement | HTMLElement;
  moveTo(dx: number, dy: number): void;
  setText(text: string): void;
  setSpeed(s: { x: number; y: number }): void;
  createDom: () => SVGElement | HTMLElement;
  addPrefixContent(prefix: HTMLElement): void;
  addSuffixContent(suffix: HTMLElement): void;
  destroy(): void;
}

export type TextsList = Array<DNodeProps[]>;

export interface DModeProps {
  direction: string;
  mode: string;
  row: number;
  column: number;
  parent: DMDanceProps;
}

export interface Setting {
  quantity: string;
  nodeGaps?: [number, number];
}

export interface LifecycleMap extends NodeLifecycleMap {

  onModeCreate?: (m: DModeProps) => void;
  onBeforeModeMount?: (m: DModeProps) => void;
  onAfterModeMount?: (m: DModeProps) => void;
}

export interface Options extends LifecycleMap {
  el: HTMLElement;
  // modes: DMode[];
  setting: Setting;
}

export interface DMDanceProps {
  modes: DModeProps[];
  setting?: Setting;
  el: HTMLElement;
  pool: string[];
  options: Options;
  
  setMode(mode: DModeProps): void;
  setModes(modes: DModeProps[]): void;
  setSetting(setting: Setting): void;
  getTexts(num: number): string[];
}
