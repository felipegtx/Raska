interface raskaNodeEvents {
    click(x: number, y: number, ele: raskaNode, evt: string): raskaNodeEvents;
    release(x: number, y: number, ele: raskaNode, evt: string): raskaNodeEvents;
}

interface raskaNode {
    attr: any;
    name: string;
    getType(): string;
    canLink(): boolean;
    graphNode: boolean;
    disable(): raskaNode;
    notifyDisableStateOn(node: raskaNode): raskaNode;
    elementDisabledNotification(): raskaNode;
    canReach(node: raskaNode): boolean;
    isLinkable(): boolean;
    canBeMoved(): boolean;
    isSerializable(): boolean;
    addLinkTo(node: raskaNode): boolean;
    removeLinkFrom(node: raskaNode): raskaNode;
    addLinkFrom(node: raskaNode): boolean;
    removeLinkTo(node: raskaNode): raskaNode;
    beforeRemoveLinkTo(doWhat: () => {}): raskaNode;
    normalize(): raskaNode;
    getLinksTo(): Array<raskaNode>;
    getLinksFrom(): Array<raskaNode>;
    clearAllLinks(): raskaNode;
    getChildElements(): Array<raskaNode>;
    addChild(node: raskaNode): raskaNode;
    getParent(): raskaNode;
    getBoundaries(): { x: number; y: number; minX: number; minY: number };
    setParent(node: raskaNode): raskaNode;
    border: {
        color: string;
        whenMoving: { color?: string; active: boolean };
        whenLinking: { color?: string; active: boolean };
        active: boolean;
        width: number;
    };
    position: any;
    x: number;
    y: number;
    getAdjustedCoordinates(): { x: number; y: number };
    canHandleEvents(): boolean;
    on: raskaNodeEvents;
    existsIn(x: number, y: number): boolean;
    adjustPosition(x: number, y: number): raskaNode;
    setWidth(w: number): raskaNode;
    getWidth(): number;
    getAdjustedWidth(): number;
    setHeight(h: number): raskaNode;
    getHeight(): number;
    getAdjustedHeight(): number;
    drawTo(canvas: HTMLCanvasElement, context: any);
}

interface raskaButton {
    name: string;
    enabled: boolean;
    onclick: (canvas: string) => {};
    template: string;
}

interface raskaConfiguration {
    targetCanvasId: string;
    readonly?: boolean;
    frameRefreshRate?: number;
    targetCanvasContainerId?: string;
    toolboxButtons?: Array<raskaButton>;
}

interface raskaEventDetail {
    interactionType: number;
    targetElement: raskaNode;
}

interface raskaAnimationType {
    fadeInWithBoudaries(maxValues: { maxWidth: number; maxHeight: number }): raskaAnimationType;
    fadeIn(step?: number, maxValues?: { maxWidth: number; maxHeight: number }): raskaAnimationType;
    fadeOut(step?: number): raskaAnimationType;
    move(configuration?: (x: number, y: number) => { x: number; y: number }): raskaAnimationType;
    then(what: { execute: () => any }): raskaAnimationType;
    loop(): raskaAnimationType;
    saveInitialStates(): raskaAnimationType;
    stop(): raskaAnimationType;
    execute(interval?: number): raskaAnimationType;
}

interface raskaAnimation {
    on(node: raskaNode): raskaAnimationType;
}

interface Raska {
    installUsing(configuration: raskaConfiguration): Raska;
    newCircle(): raskaNode;
    newLabel(): raskaNode;
    newSquare(): raskaNode;
    newTriangle(): raskaNode;
    plot(node: raskaNode): Raska;
    exportImage(): Raska;
    getElementsRaw(): Object;
    getElementsSlim(): Object;
    getElementsString(): string;
    loadElementsFrom(source: Object): Raska;
    toggleFullScreen(): Raska;
    positionTypes(): any;
    onCanvasInteraction(type: string, trigger: (x: number, y: number, details: raskaEventDetail) => {}): Raska;
    checkCollisionOn(x: number, y: number): boolean;
    tryGetElementOn(x: number, y: number): raskaNode;
    remove(node: raskaNode): Raska;
    getCanvasBoundaries(): { maxH: number; maxW: number };
    clear(): Raska;
    animation: raskaAnimation;
}

declare var raska: Raska;
