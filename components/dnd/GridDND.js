import { useCallback, useState, createContext, useContext, useRef, useEffect, forwardRef, createRef } from "react"

export const GridElement = forwardRef(({ leftOffset = 0, topOffset = 0, dndIndex, children }, ref) => {
    const { gridState, setDraggedItemInfo, setDragEnd, isDragEnabled } = useContext(DNDContext);
    const [wasWiggleAnimationPlayed, setWasWiggleAnimationPlayed] = useState(false);

    const onMouseDown = useCallback(() => {
        if (isDragEnabled) {
            setDraggedItemInfo({
                clientX: leftOffset,
                clientY: topOffset,
                dndIndex
            });
        }
    }, [leftOffset, topOffset, isDragEnabled]);

    const onMouseUp = useCallback(() => {
        if (isDragEnabled) {
            setDragEnd();
        }
    }, [setDragEnd, isDragEnabled]);

    useEffect(() => {
        if (isDragEnabled) {
            setTimeout(() => {
                setWasWiggleAnimationPlayed(true);
            }, 500);
        } else {
            setWasWiggleAnimationPlayed(false);
        }
    }, [isDragEnabled]);

    return (
        <>
            <div className={`draggable${isDragEnabled && !wasWiggleAnimationPlayed ? ' wiggle-animation' : ''}`} ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
                <div className="children">
                    {children}
                </div>
            </div>
            <style jsx>
                {`
                .draggable {
                    cursor: pointer;
                    position: absolute;
                    transition: all 0.5s;
                    ${isDragEnabled ?
                        `
                        opacity: 0.6;
                        `
                        :
                        ``
                    }
                    ${gridState.draggedElementIndex === dndIndex ?
                        `
                            transition: none;
                            left: ${gridState.clientX}px;
                            top: ${gridState.clientY - 10}px;
                            z-index: 1;
                            opacity: 1;
                        `
                        :
                        `
                            left: ${leftOffset}px;
                            top: ${topOffset}px;
                        `}
                }
                .wiggle-animation {
                    animation: DragEnabledWiggleAnimation 0.5s;
                }
                @keyframes DragEnabledWiggleAnimation {
                    0% {
                        transform: rotate(0deg);
                        opacity: 1;
                    }
                    25% {
                        transform: rotate(-1deg) scale(1.02);
                        opacity: 1;
                    }
                    75% {
                        transform: rotate(1deg) scale(1.02);
                        opacity: 1;
                    }
                    100% {
                        transform: rotate(0deg) scale(1);
                        opacity: 0.6;
                    }
                }
                .children {
                    ${isDragEnabled ?
                        `
                        pointer-events: none;
                        `
                        :
                        ``
                    }
                }
            `}
            </style>
        </>
    )
});

const getInitialGridState = () => {
    return {
        draggedElementIndex: null,
        clientX: 0,
        clientY: 0,
    }
}

const getOverlapCoefficient = ({
    draggedX, draggedY, draggedWidth, draggedHeight,
    targetX, targetY
}) => {
    const deltaX = Math.abs(targetX - draggedX);
    const deltaY = Math.abs(targetY - draggedY);
    const totalDelta = deltaX + deltaY;
    const percentageFromTotalPossible = totalDelta / (draggedWidth + draggedHeight) * 100;

    //TODO: Make this changeable
    if (percentageFromTotalPossible < 20)
        return totalDelta;
    return -1;
}

const getNumberOfRows = ({ numberOfElementsPerRow, numberOfElements }) => {
    return Math.ceil(numberOfElements / numberOfElementsPerRow);
}

const getNumberOfElementsPerRow = ({ gridWidth, childWidth, gap }) => {
    return Math.floor(gridWidth / (childWidth + gap));
}

export const Grid = ({
    children,
    gap = 0,
    onElementMove = ({ sourceIndex, targetIndex }) => { },
    wrapperCSS = '',
    scrollable = false,
    fixedHeight = null,
    insidePadding = 0,
    isDragEnabled = true,
}) => {
    const [gridState, setGridState] = useState(getInitialGridState());
    const gridRef = useRef(null);
    const [gridHeight, setGridHeight] = useState(0);
    const childrenRefs = useRef([]);
    const [elementPositions, setElementPositions] = useState({});
    const [spaceBeforeIndex, setSpaceBeforeIndex] = useState(null);
    const [maskedElementSpaceIndex, setMaskedElementSpaceIndex] = useState(null);

    const LayoutElements = useCallback(() => {
        if (gridRef.current && childrenRefs.current) {
            const gridWidth = Math.floor(gridRef.current.getBoundingClientRect().width) - 2 * insidePadding;

            const childWidth = Math.ceil(childrenRefs.current[0] ? childrenRefs.current[0].current.getBoundingClientRect().width : 0);
            const childHeight = Math.ceil(childrenRefs.current[0] ? childrenRefs.current[0].current.getBoundingClientRect().height : 0);
            const numberOfElementsPerRow = getNumberOfElementsPerRow({ gridWidth, childWidth, gap });
            const numberOfRows = getNumberOfRows({ numberOfElementsPerRow, numberOfElements: childrenRefs.current.length });
            const gridHeight = numberOfRows * childHeight + 2 * insidePadding + gap * (numberOfRows - 1);
            setGridHeight(gridHeight);
            childrenRefs.current.forEach((childRef, index) => {
                let indexInCalculation = index;

                if (spaceBeforeIndex != null && index >= spaceBeforeIndex) {
                    indexInCalculation++;
                }

                if (maskedElementSpaceIndex != null && index > maskedElementSpaceIndex) {
                    indexInCalculation--;
                }

                const rowNumberOfElement = Math.floor(indexInCalculation / numberOfElementsPerRow);
                const numberOfElementInRow = indexInCalculation % numberOfElementsPerRow;

                const offsetX = numberOfElementInRow * (childWidth + gap) + insidePadding;
                const offsetY = rowNumberOfElement * childHeight + rowNumberOfElement * gap + insidePadding;

                setElementPositions(elementPositions => {
                    return {
                        ...elementPositions,
                        [index]: {
                            offsetX,
                            offsetY
                        }
                    }
                })
            })
        }
    }, [childrenRefs, spaceBeforeIndex, maskedElementSpaceIndex, insidePadding, gridRef]);

    useEffect(() => {
        LayoutElements();
    }, [childrenRefs, spaceBeforeIndex, maskedElementSpaceIndex, children]);

    useEffect(() => {
        const listener = () => {
            LayoutElements();
        }
        window.addEventListener('resize', listener);
        return () => {
            window.removeEventListener('resize', listener);
        }
    }, [LayoutElements]);

    const setDraggedItemInfo = useCallback(({
        clientX, clientY, dndIndex
    }) => {
        if (isDragEnabled) {
            setGridState(gridState => ({
                ...gridState,
                clientX,
                clientY,
                draggedElementIndex: dndIndex
            }));
            setMaskedElementSpaceIndex(dndIndex);
        }
    }, [isDragEnabled]);

    const setDragEnd = useCallback(() => {
        onElementMove({ sourceIndex: gridState.draggedElementIndex, targetIndex: spaceBeforeIndex });
        setGridState(getInitialGridState());
        setMaskedElementSpaceIndex(null);
        setSpaceBeforeIndex(null);
    }, [gridState, spaceBeforeIndex, onElementMove]);

    const verifyOverlappingItems = useCallback(() => {
        const draggedItemBoundingRect = childrenRefs.current[gridState.draggedElementIndex].current.getBoundingClientRect();
        let overlappingItem;
        const overlappedElements = childrenRefs.current
            .map((child, index) => ({
                boundingRect: child.current.getBoundingClientRect(),
                index
            }))
            .filter(element => element.index != gridState.draggedElementIndex)
            .map((element) => {
                return {
                    index: element.index,
                    overlapCoeficcient: getOverlapCoefficient({
                        draggedX: draggedItemBoundingRect.x,
                        draggedY: draggedItemBoundingRect.y,
                        draggedWidth: draggedItemBoundingRect.width,
                        draggedHeight: draggedItemBoundingRect.height,
                        targetX: element.boundingRect.x,
                        targetY: element.boundingRect.y,
                        targetWidth: element.boundingRect.width,
                        targetHeight: element.boundingRect.height
                    })
                };
            })
            .filter(element => element.overlapCoeficcient != -1)
            .sort((a, b) => a.overlapCoeficcient - b.overlapCoeficcient);
        const elementToMoveIndex = overlappedElements.length > 0 ? overlappedElements[0].index : null;
        if (elementToMoveIndex != null) {
            setSpaceBeforeIndex(elementToMoveIndex);
        }
    }, [childrenRefs.current, gridState]);

    const onMouseMove = useCallback((event) => {
        if (gridState.draggedElementIndex != null && isDragEnabled) {
            event.preventDefault();
            const { movementX, movementY } = event.nativeEvent;
            setGridState(gridState => ({
                ...gridState,
                clientX: gridState.clientX + movementX,
                clientY: gridState.clientY + movementY
            }))
            verifyOverlappingItems();
        }
    }, [gridState, isDragEnabled]);

    return (
        <>
            <DNDContext.Provider value={{ gridState, setDraggedItemInfo, setDragEnd, isDragEnabled }}>
                <div className="wrapper">
                    <div ref={gridRef} className="grid" onMouseMove={onMouseMove}>
                        {React.Children.map(children, (child, index) => {
                            let childRef = childrenRefs.current[index];
                            //we assign it a ref if it doesn't have one
                            if (!childRef) {
                                childRef = createRef();
                                childrenRefs.current[index] = childRef;
                            }
                            return React.cloneElement(child,
                                {
                                    ref: childRef,
                                    leftOffset: elementPositions[index] ? elementPositions[index].offsetX : 0,
                                    topOffset: elementPositions[index] ? elementPositions[index].offsetY : 0,
                                    dndIndex: index
                                }
                            );
                        })}
                    </div>
                </div>
            </DNDContext.Provider>
            <style jsx>
                {`
                .wrapper {
                    width: 100%;
                    ${wrapperCSS}
                }
                .grid {
                    width: 100%;
                    position: relative;
                    ${scrollable ?
                        `overflow: auto;`
                        :
                        ``
                    }
                    ${insidePadding ?
                        `padding: ${insidePadding}px;`
                        :
                        ``
                    }
                    height: ${fixedHeight ? fixedHeight : `${gridHeight}px`};
                    transition: all 0.3s;
                    ${fixedHeight || gridHeight > 0 ?
                        `
                        opacity: 1;
                        `
                        :
                        `
                        opacity: 0;
                        `
                    }
                }
            `}
            </style>
        </>
    )
}

export const DNDContext = createContext(null);