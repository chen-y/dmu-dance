import { DMode } from './d-mode';
import { type DNodeProps } from './types';
export interface DNodeOptions {
    x: number;
    y: number;
    fontSize?: number;
    text: string;
    speedX?: number;
    speedY?: number;
}
export declare class DNode implements DNodeProps {
    text?: string;
    x: number;
    y: number;
    speedX: number;
    speedY: number;
    fontSize?: number;
    isInserted: boolean;
    isInitPosition: boolean;
    _isStop: boolean;
    popup: HTMLElement;
    _popupVisible: boolean;
    modes: DMode[];
    dom: SVGElement | HTMLElement;
    _text: SVGTextElement | HTMLElement;
    constructor(props: DNodeOptions);
    get isStop(): boolean;
    set isStop(value: boolean);
    get popupVisible(): boolean;
    set popupVisible(value: boolean);
    createDom(): SVGElement | HTMLElement;
    createPopup(): void;
    init(): void;
    movePosition(x: number, y: number): void;
    moveTo(dx: number, dy: number): void;
    setText(text: string): void;
    addPrefixContent(prefix: HTMLElement): void;
    addSuffixContent(suffix: HTMLElement): void;
    setSpeed({ x, y }: {
        x: number;
        y: number;
    }): void;
    insertTo(el: SVGElement): void;
    onStop(): void;
    onClick: (evt: Event) => void;
    onFree: () => void;
    destroy(): void;
}
export declare class DSvgNode extends DNode {
    createDom(): SVGElement;
    movePosition(x: number, y: number): void;
}
