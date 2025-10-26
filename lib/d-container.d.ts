import { type DNodeProps, type TextsList } from "./types";
interface ContainerUpdateFns {
    fillAText: (index: number) => void;
    beforeMoveText: (index: number, text: DNodeProps, rect: DOMRect) => void;
    afterMoveText?: (index: number, text: DNodeProps, rect: DOMRect) => void;
    isNeedRemove: (text: DNodeProps, rect: DOMRect) => boolean;
    onRemove: (node: DNodeProps) => void;
}
export declare class DContainer {
    dom: HTMLElement | SVGElement;
    textsRows: TextsList;
    w: number;
    h: number;
    constructor();
    createDom(): void;
    createSvg(): void;
    setSize(w: number, h: number): void;
    setToFixedLeftStyle(): void;
    setToFixedRightStyle(): void;
    adDNode(text: DNodeProps): boolean;
    update({ fillAText, beforeMoveText, isNeedRemove, afterMoveText, onRemove }: ContainerUpdateFns): void;
    updateRows(row: number): void;
    destroy(): void;
}
export declare class RLContainer extends DContainer {
}
export declare class LRContainer extends DContainer {
}
export declare class BTContainer extends DContainer {
}
export declare class TBContainer extends DContainer {
}
export {};
