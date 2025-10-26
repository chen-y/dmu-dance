import { type DMDanceProps, type DModeProps } from './types';
import { DContainer } from './d-container';
interface DModeOptions {
    parent: DMDanceProps;
    width?: number;
    height?: number;
    direction?: string;
    mode?: string;
}
export declare class DMode implements DModeProps {
    direction: string;
    mode: string;
    row: number;
    column: number;
    parent: DMDanceProps;
    containers: DContainer[];
    constructor(options: DModeOptions);
    initContainers(): void;
    init(): void;
    mount(el: HTMLElement): void;
    update(): void;
    calcContainerRow(h: number, quantity: string): void;
    calcContainerCol(w: number, quantity: string): void;
    destroy(): void;
}
export declare class RLMode extends DMode {
    direction: string;
    mode: string;
    constructor(options: DModeOptions);
    initContainers(): void;
    init(): void;
    update(): void;
}
export declare class LRMode extends DMode {
    direction: string;
    mode: string;
    constructor(options: DModeOptions);
    initContainers(): void;
    update(): void;
}
export declare class BTMode extends DMode {
    direction: string;
    mode: string;
    constructor(options: DModeOptions);
    initContainers(): void;
    update(): void;
}
export declare class TBMode extends DMode {
    direction: string;
    mode: string;
    constructor(options: DModeOptions);
    initContainers(): void;
    update(): void;
}
export declare class L45DMode extends DMode {
    direction: string;
    mode: string;
    constructor(options: DModeOptions);
    initContainers(): void;
    update(): void;
}
export declare class WaveMode extends DMode {
    direction: string;
    mode: string;
    constructor(options: DModeOptions);
    initContainers(): void;
    init(): void;
    update(): void;
}
export declare class CollisionMode extends DMode {
    direction: string;
    mode: string;
    constructor(options: DModeOptions);
    initContainers(): void;
    update(): void;
}
export {};
