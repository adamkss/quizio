import { useCallback, useState, createContext, useContext, useRef, useEffect, forwardRef, createRef } from "react"

export const GridElement = forwardRef(({ leftOffset = 0, topOffset = 0, dndIndex, children }, ref) => {
    const { gridState, setDraggedItemInfo, setDragEnd, isDragEnabled } = useContext(DNDContext);
    const [wasWiggleAnimationPlayed, setWasWiggleAnimationPlayed] = useState(false);
    const longPressTimer = useRef(null);

    const enableDragging = useCallback(({ byTouch = false, initialTouchClientX = null, initialTouchClientY = null }) => {
        if (byTouch) {
            setDraggedItemInfo({
                clientX: leftOffset,
                clientY: topOffset,
                initialTouchClientX,
                initialTouchClientY,
                dndIndex,
                byTouch
            });
        } else {
            setDraggedItemInfo({
                clientX: leftOffset,
                clientY: topOffset,
                dndIndex,
                byTouch
            });
        }
    }, [leftOffset, topOffset, dndIndex, setDraggedItemInfo]);

    const onMouseDown = useCallback(() => {
        if (isDragEnabled) {
            enableDragging({});
        }
    }, [isDragEnabled, enableDragging]);

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

    const onTouchStart = useCallback((event) => {
        if (isDragEnabled) {
            const initialTouchClientX = event.nativeEvent.touches[0].clientX;
            const initialTouchClientY = event.nativeEvent.touches[0].clientY;
            longPressTimer.current = setTimeout(() => {
                enableDragging({
                    byTouch: true,
                    initialTouchClientX,
                    initialTouchClientY
                });
            }, 1000);
        }
    }, [longPressTimer, isDragEnabled, enableDragging]);

    const onTouchEnd = useCallback(() => {
        if (isDragEnabled) {
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
            }
            setDragEnd();
        }
    }, [longPressTimer, isDragEnabled, setDragEnd]);

    return (
        <>
            <div
                className={`draggable${isDragEnabled && !wasWiggleAnimationPlayed ? ' wiggle-animation' : ''}`}
                ref={ref}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}>
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
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    touch-callout: none;
                    -webkit-tap-highlight-color: transparent;
                }
                .draggable:active,
                .draggable:focus {
                    outline: none;
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
        byTouch: false,
        initialClientX: null,
        initialClientY: null,
        initialTouchClientY: null,
        initialTouchClientY: null
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
    const direction = (targetX - draggedX) > 0 ? 'LEFT' : 'RIGHT';
    let overlapCoefficient;
    //TODO: Make this changeable
    if (percentageFromTotalPossible < 20) {
        overlapCoefficient = totalDelta;
    } else {
        overlapCoefficient = -1;
    }
    return { overlapCoefficient, direction };
}

const getNumberOfRows = ({ numberOfElementsPerRow, numberOfElements }) => {
    return Math.ceil(numberOfElements / numberOfElementsPerRow);
}

const getNumberOfElementsPerRow = ({ gridWidth, childWidth, gap }) => {
    return Math.floor(gridWidth / (childWidth + gap));
}

const getEffectiveGridWidth = ({ childWidth, numberOfElementsPerRow, gap, insidePadding }) => {
    return Math.ceil((childWidth + gap) * numberOfElementsPerRow) + 2 * insidePadding;
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
    centeredHorizontally = false
}) => {
    const [gridState, setGridState] = useState(getInitialGridState());
    const gridContainerRef = useRef(null);
    const [gridHeight, setGridHeight] = useState(0);
    const [effectiveGridWidth, setEffectiveGridWidth] = useState(0);
    const childrenRefs = useRef([]);
    const [elementPositions, setElementPositions] = useState({});
    const [spaceBeforeIndex, setSpaceBeforeIndex] = useState(null);
    const [spaceAfterIndex, setSpaceAfterIndex] = useState(null);
    const [maskedElementSpaceIndex, setMaskedElementSpaceIndex] = useState(null);
    const [gridScrollX, setGridScrollX] = useState(null);

    const LayoutElements = useCallback(() => {
        if (gridContainerRef.current && childrenRefs.current) {
            const childWidth = Math.ceil(childrenRefs.current[0] ? childrenRefs.current[0].current.getBoundingClientRect().width : 0);
            const childHeight = Math.ceil(childrenRefs.current[0] ? childrenRefs.current[0].current.getBoundingClientRect().height : 0);

            const gridWidth = Math.floor(gridContainerRef.current.getBoundingClientRect().width) - 2 * insidePadding;

            const numberOfElementsPerRow = getNumberOfElementsPerRow({ gridWidth, childWidth, gap }) || 1;

            const effectiveGridWidth = getEffectiveGridWidth({ childWidth, numberOfElementsPerRow, gap, insidePadding });
            setEffectiveGridWidth(effectiveGridWidth);

            const numberOfRows = getNumberOfRows({ numberOfElementsPerRow, numberOfElements: childrenRefs.current.length });
            if (gridState.draggedElementIndex == null) {
                const gridHeight = numberOfRows * childHeight + 2 * insidePadding + gap * (numberOfRows - 1);
                setGridHeight(gridHeight);
            }
            childrenRefs.current.forEach((childRef, index) => {
                let indexInCalculation = index;

                if (spaceBeforeIndex != null && index >= spaceBeforeIndex) {
                    indexInCalculation++;
                }

                if (spaceAfterIndex != null && index >= (spaceAfterIndex + 1)) {
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
    }, [childrenRefs, spaceBeforeIndex, spaceAfterIndex, maskedElementSpaceIndex, insidePadding, gridContainerRef, gridState]);

    useEffect(() => {
        LayoutElements();
    }, [childrenRefs, spaceBeforeIndex, spaceAfterIndex, maskedElementSpaceIndex, children]);

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
        clientX, clientY, dndIndex, byTouch = false,
        initialTouchClientX = null, initialTouchClientY = null
    }) => {
        if (isDragEnabled) {
            if (byTouch) {
                setGridState(gridState => ({
                    ...gridState,
                    initialClientY: clientY,
                    initialClientX: clientX,
                    clientX,
                    clientY,
                    initialTouchClientX,
                    initialTouchClientY,
                    draggedElementIndex: dndIndex,
                    byTouch
                }));
            } else {
                setGridState(gridState => ({
                    ...gridState,
                    clientX,
                    clientY,
                    draggedElementIndex: dndIndex,
                    byTouch
                }));
            }
            setMaskedElementSpaceIndex(dndIndex);
        }
    }, [isDragEnabled]);

    const setDragEnd = useCallback(() => {
        let targetIndex = null;
        if (spaceBeforeIndex != null) {
            targetIndex = spaceBeforeIndex;
        } else {
            if (spaceAfterIndex != null) {
                targetIndex = spaceAfterIndex + 1;
            }
        }
        if (targetIndex != null) {
            onElementMove({ sourceIndex: gridState.draggedElementIndex, targetIndex });
        }
        setGridState(getInitialGridState());
        setMaskedElementSpaceIndex(null);
        setSpaceBeforeIndex(null);
        setSpaceAfterIndex(null);
    }, [gridState, spaceBeforeIndex, spaceAfterIndex, onElementMove]);

    const verifyOverlappingItems = useCallback(() => {
        const draggedItemBoundingRect = childrenRefs.current[gridState.draggedElementIndex].current.getBoundingClientRect();
        const overlappedElements = childrenRefs.current
            .map((child, index) => ({
                boundingRect: child.current.getBoundingClientRect(),
                index
            }))
            .filter(element => element.index != gridState.draggedElementIndex)
            .map((element) => {
                return {
                    index: element.index,
                    overlapInformation: getOverlapCoefficient({
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
            .filter(element => element.overlapInformation.overlapCoefficient != -1)
            .sort((a, b) => a.overlapInformation.overlapCoefficient - b.overlapInformation.overlapCoefficient);
        const overlappedElement = overlappedElements.length > 0 ? overlappedElements[0] : null;
        if (overlappedElement != null) {
            if (overlappedElement.overlapInformation.direction === 'LEFT') {
                setSpaceBeforeIndex(overlappedElement.index);
                setSpaceAfterIndex(null);
            } else {
                setSpaceAfterIndex(overlappedElement.index);
                setSpaceBeforeIndex(null);
            }
        }
    }, [childrenRefs.current, gridState]);

    //Smooth scrolling here! (setTimeout always re-triggering this function if needed)
    useEffect(() => {
        if (gridScrollX != null) {
            const topOffsetRelativeToWindow = childrenRefs.current[gridState.draggedElementIndex].current.getBoundingClientRect().top;
            if (topOffsetRelativeToWindow < 50 && gridScrollX >= 0) {
                setTimeout(() => {
                    const difference = -1;
                    setGridScrollX(gridScrollX + difference);
                    gridContainerRef.current.scrollTop += difference;
                    setGridState(gridState => ({
                        ...gridState,
                        clientY: gridState.clientY + difference
                    }))
                }, 10);
            }
        }
    }, [gridScrollX])

    const scrollIfNeeded = useCallback(() => {
        const topOffsetRelativeToWindow = childrenRefs.current[gridState.draggedElementIndex].current.getBoundingClientRect().top;
        const parentScrollTop = gridContainerRef.current.scrollTop;
        if (topOffsetRelativeToWindow < 50 && parentScrollTop > 0) {
            setGridScrollX(parentScrollTop);
        } else {
            setGridScrollX(null);
        }
    }, [gridState, childrenRefs.current, gridContainerRef.current]);

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
            scrollIfNeeded();
        }
    }, [gridState, isDragEnabled]);

    const onTouchMove = useCallback((event) => {
        if (gridState.draggedElementIndex != null && isDragEnabled) {
            event.preventDefault();
            const movementX = gridState.initialTouchClientX - event.nativeEvent.touches[0].clientX;
            const movementY = gridState.initialTouchClientY - event.nativeEvent.touches[0].clientY;
            setGridState(gridState => ({
                ...gridState,
                clientX: gridState.initialClientX - movementX,
                clientY: gridState.initialClientY - movementY
            }))
            verifyOverlappingItems();
        }
    }, [gridState, isDragEnabled]);

    return (
        <>
            <DNDContext.Provider value={{ gridState, setDraggedItemInfo, setDragEnd, isDragEnabled }}>
                <div className="wrapper" ref={gridContainerRef}>
                    <div className="grid"
                        onMouseMove={onMouseMove}
                        onTouchMove={onTouchMove}>
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
                    height: ${fixedHeight ? fixedHeight : `${gridHeight}px`};
                    ${centeredHorizontally ?
                        `
                    display: flex;
                    justify-content: center;`
                        :
                        ``
                    }
                     ${scrollable ?
                        `overflow: auto;`
                        :
                        ``
                    }
                    ${wrapperCSS}
                }
                .grid {
                    width: ${effectiveGridWidth ? `${effectiveGridWidth}px` : '100%'};
                    position: relative;
                    ${insidePadding ?
                        `padding: ${insidePadding}px;`
                        :
                        ``
                    }
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