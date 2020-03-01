import { useCallback, useState, createContext, useContext, useRef, useEffect, forwardRef, createRef } from "react"

export const GridElement = forwardRef(({ leftOffset = 0, topOffset = 0, dndIndex }, ref) => {
    const { gridState, setDraggedItemInfo, setDragEnd } = useContext(DNDContext);

    const onMouseDown = useCallback(() => {
        setDraggedItemInfo({
            clientX: leftOffset,
            clientY: topOffset,
            dndIndex
        });
    }, [leftOffset, topOffset]);

    const onMouseUp = useCallback(() => {
        setDragEnd();
    }, [setDragEnd]);

    return (
        <>
            <div className="draggable" ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
                {dndIndex}
            </div>
            <style jsx>
                {`
                .draggable {
                    width: 300px;
                    height: 250px;
                    border-radius: 10px;
                    box-shadow: 3px 3px 10px grey;
                    background-color: white;
                    cursor: pointer;
                    position: absolute;
                    transition: all 0.5s;
                    ${gridState.draggedElementIndex === dndIndex ?
                        `
                            transition: none;
                            left: ${gridState.clientX}px;
                            top: ${gridState.clientY - 10}px;
                            z-index: 1;
                        `
                        :
                        `
                            left: ${leftOffset}px;
                            top: ${topOffset}px;
                        `}
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
    fixedHeight = 0,
    insidePadding = 0
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
    }, [childrenRefs, spaceBeforeIndex, maskedElementSpaceIndex, insidePadding]);

    useEffect(() => {
        LayoutElements();
    }, [childrenRefs, spaceBeforeIndex, maskedElementSpaceIndex]);

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
        setGridState(gridState => ({
            ...gridState,
            clientX,
            clientY,
            draggedElementIndex: dndIndex
        }));
        setMaskedElementSpaceIndex(dndIndex);
    }, []);

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
        if (gridState.draggedElementIndex != null) {
            event.preventDefault();
            const { movementX, movementY } = event.nativeEvent;
            setGridState(gridState => ({
                ...gridState,
                clientX: gridState.clientX + movementX,
                clientY: gridState.clientY + movementY
            }))
            verifyOverlappingItems();
        }
    }, [gridState]);

    return (
        <>
            <DNDContext.Provider value={{ gridState, setDraggedItemInfo, setDragEnd }}>
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
                    height: ${fixedHeight > 0 ? fixedHeight : gridHeight}px;
                    transition: all 0.3s;
                    ${fixedHeight > 0 || gridHeight > 0 ?
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

const DNDContext = createContext(null);