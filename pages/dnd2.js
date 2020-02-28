import { useCallback, useState, createContext, useContext, useRef, useEffect, forwardRef, createRef } from "react"

export default () => {
    return (
        <>
            <main>
                <Grid>
                    <Element id={0} />
                    <Element id={1} />
                    <Element id={2} />
                    <Element id={3} />
                    <Element id={4} />
                    <Element id={5} />
                    <Element id={6} />
                    <Element id={7} />
                    <Element id={8} />
                </Grid>
            </main>
            <style jsx>
                {`
            `}
            </style>
        </>
    )
}

const Element = forwardRef(({ id, leftOffset = 0, topOffset = 0, dndIndex }, ref) => {
    const { gridState, setDraggedItemInfo, setDragEnd } = useContext(DNDContext);

    const onMouseDown = useCallback((event) => {
        setDraggedItemInfo({
            draggedItemId: id,
            clientX: event.nativeEvent.clientX,
            clientY: event.nativeEvent.clientY,
            initialOffsetX: event.nativeEvent.offsetX,
            initialOffsetY: event.nativeEvent.offsetY,
            dndIndex
        });
    }, [id]);

    const onMouseUp = useCallback(() => {
        setDragEnd();
    }, []);

    return (
        <>
            <article ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
                {id}
            </article>
            <style jsx>
                {`
                article {
                    width: 300px;
                    height: 200px;
                    border-radius: 10px;
                    box-shadow: 3px 3px 10px grey;
                    background-color: white;
                    cursor: pointer;
                    position: absolute;
                    transition: all 0.5s;
                    ${gridState.draggedItemId === id ?
                        `
                            transition: none;
                            left: ${gridState.clientX - gridState.initialOffsetX}px;
                            top: ${gridState.clientY - gridState.initialOffsetY}px;
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
        draggedItemId: null,
        draggedElementIndex: null,
        clientX: 0,
        clientY: 0,
        initialOffsetX: 0,
        initialOffsetY: 0
    }
}

const getOverlapCoeficcient = ({
    draggedX, draggedY, draggedWidth, draggedHeight,
    targetX, targetY, targetWidth, targetHeight
}) => {
    const deltaX = targetX - draggedX;
    const deltaY = Math.abs(targetY - draggedY);
    if (deltaX >= 0 && deltaX <= (draggedWidth / 2) && deltaY <= draggedHeight) {
        return deltaX + deltaY;
    }
    return -1;
}

const Grid = ({ children, gap = 20 }) => {
    const [gridState, setGridState] = useState(getInitialGridState());
    const gridRef = useRef(null);
    const childrenRefs = useRef([]);
    const [elementPositions, setElementPositions] = useState({});
    const [spaceBeforeIndex, setSpaceBeforeIndex] = useState(null);
    const [maskedElementSpaceIndex, setMaskedElementSpaceIndex] = useState(null);

    const setDraggedItemInfo = useCallback(({
        draggedItemId, initialOffsetX, initialOffsetY, clientX, clientY, dndIndex
    }) => {
        setGridState(gridState => ({
            ...gridState,
            clientX,
            clientY,
            draggedItemId,
            initialOffsetX,
            initialOffsetY,
            draggedElementIndex: dndIndex
        }));
        setMaskedElementSpaceIndex(dndIndex);
    }, []);

    const setDragEnd = useCallback(() => {
        setGridState(getInitialGridState());
        setMaskedElementSpaceIndex(null);
        setSpaceBeforeIndex(null);
    })

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
                    overlapCoeficcient: getOverlapCoeficcient({
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
            .sort((a,b) => a.overlapCoeficcient - b.overlapCoeficcient);
            const elementToMoveIndex = overlappedElements.length > 0 ? overlappedElements[0].index : null;
            console.log(overlappedElements);
            if(elementToMoveIndex) {
                setSpaceBeforeIndex(elementToMoveIndex);
            }
    }, [childrenRefs.current, gridState]);

    const onMouseMove = useCallback((event) => {
        if (gridState.draggedItemId != null) {
            event.preventDefault();
            const { clientX, clientY } = event.nativeEvent;
            setGridState(gridState => ({
                ...gridState,
                clientX,
                clientY
            }))
            verifyOverlappingItems();
        }
    }, [gridState]);

    const show = () => {
        childrenRefs.current.forEach(el => console.log(el.current.getBoundingClientRect()));
    }

    useEffect(() => {
        if (gridRef.current && childrenRefs.current) {
            const gridWidth = Math.floor(gridRef.current.getBoundingClientRect().width);
            const gridHeight = Math.floor(gridRef.current.getBoundingClientRect().height);

            childrenRefs.current.forEach((childRef, index) => {
                let { width: childWidth, height: childHeight } = childRef.current.getBoundingClientRect();
                childWidth = Math.ceil(childWidth);
                childHeight = Math.ceil(childHeight);

                let indexInCalculation = index;

                if (spaceBeforeIndex != null && index >= spaceBeforeIndex) {
                    indexInCalculation++;
                }

                if (maskedElementSpaceIndex != null && index > maskedElementSpaceIndex) {
                    indexInCalculation--;
                }

                const numberOfElementsPerRow = Math.floor(gridWidth / (childWidth + gap));
                const rowNumberOfElement = Math.floor(((indexInCalculation + 1) * (childWidth + gap)) / gridWidth);
                const numberOfElementInRow = indexInCalculation % numberOfElementsPerRow;

                const offsetX = numberOfElementInRow * (childWidth + gap);
                const offsetY = rowNumberOfElement * childHeight + rowNumberOfElement * gap;

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
    }, [childrenRefs, spaceBeforeIndex, maskedElementSpaceIndex]);

    return (
        <>
            <DNDContext.Provider value={{ gridState, setDraggedItemInfo, setDragEnd }}>
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
                <button onClick={show} />
            </DNDContext.Provider>
            <style jsx>
                {`
                .grid {
                    position: relative;
                    height: 700px;
                    overflow: hidden;
                }
            `}
            </style>
        </>
    )
}

const DNDContext = createContext(null);