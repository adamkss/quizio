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

const Element = forwardRef(({ id, leftOffset = 0, topOffset = 0 }, ref) => {
    const { gridState, setDraggedItemInfo, setDragEnd } = useContext(DNDContext);

    const onMouseDown = useCallback((event) => {
        setDraggedItemInfo({
            draggedItemId: id,
            clientX: event.nativeEvent.clientX,
            clientY: event.nativeEvent.clientY,
            initialOffsetX: event.nativeEvent.offsetX,
            initialOffsetY: event.nativeEvent.offsetY
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
                    ${gridState.draggedItemId === id ?
                        `
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
        clientX: 0,
        clientY: 0,
        initialOffsetX: 0,
        initialOffsetY: 0
    }
}

const Grid = ({ children, gap = 20 }) => {
    const [gridState, setGridState] = useState(getInitialGridState());
    const gridRef = useRef(null);
    const childrenRefs = useRef([]);
    const [elementPositions, setElementPositions] = useState({});

    const setDraggedItemInfo = useCallback(({ draggedItemId, initialOffsetX, initialOffsetY, clientX, clientY }) => {
        setGridState(gridState => ({
            ...gridState,
            clientX,
            clientY,
            draggedItemId,
            initialOffsetX,
            initialOffsetY
        }))
    }, []);

    const setDragEnd = useCallback(() => {
        setGridState(getInitialGridState());
    })

    const onMouseMove = useCallback((event) => {
        if (gridState.draggedItemId != null) {
            const { clientX, clientY } = event.nativeEvent;
            setGridState(gridState => ({
                ...gridState,
                clientX,
                clientY
            }))
        }
        event.preventDefault();
    }, [gridState]);

    useEffect(() => {
        if (gridRef.current && childrenRefs.current) {
            const gridWidth = Math.floor(gridRef.current.getBoundingClientRect().width);
            const gridHeight = Math.floor(gridRef.current.getBoundingClientRect().height);

            childrenRefs.current.forEach((childRef, index) => {
                let { width: childWidth, height: childHeight } = childRef.current.getBoundingClientRect();
                childWidth = Math.ceil(childWidth);
                childHeight = Math.ceil(childHeight);

                const numberOfElementsPerRow = Math.floor(gridWidth / (childWidth + gap));
                const rowNumberOfElement = Math.floor(((index + 1) * (childWidth + gap)) / gridWidth);
                const numberOfElementInRow = index % numberOfElementsPerRow;

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
    }, [childrenRefs]);

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
                                topOffset: elementPositions[index] ? elementPositions[index].offsetY : 0
                            }
                        );
                    })}
                </div>
            </DNDContext.Provider>
            <style jsx>
                {`
                .grid {
                    position: relative;
                }
            `}
            </style>
        </>
    )
}

const DNDContext = createContext({
    elementMovingId: null
});