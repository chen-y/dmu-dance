import { type Setting, type DMDanceProps, type Options } from "./types";
import { DNode, DSvgNode } from "./d-node";
import { DMode, RLMode, LRMode, BTMode, TBMode, L45DMode, WaveMode, CollisionMode } from "./d-mode";
import { DContainer } from "./d-container";
import './dm.css';
export * from './types';
export { DMode, RLMode, LRMode, BTMode, TBMode, L45DMode, WaveMode, CollisionMode, DNode, DSvgNode, DContainer, };
export declare class DMDance implements DMDanceProps {
    modes: DMode[];
    options: Options;
    setting: Setting;
    el: HTMLElement;
    pool: string[];
    currentIndex: number;
    isRunning: boolean;
    timer?: number;
    constructor(options: Options);
    init(): void;
    update(): void;
    setMode(mode: DMode): void;
    setModes(modes: DMode[]): void;
    setSetting(setting: Setting): void;
    getTexts(num: number): string[];
    start(): void;
    stop(): void;
    destroy(): void;
}
