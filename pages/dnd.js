import { useCallback, useState, createContext, useContext } from "react"

export default () => {
    return (
        <>
            <main>
                <Grid>
                    <Element id={1} />
                    <Element id={2} />
                    <Element id={3} />
                    <Element id={4} />
                    <Element id={5} />
                    <Element id={6} />
                    <Element id={7} />
                </Grid>
            </main>
            <style jsx>
                {`
            `}
            </style>
        </>
    )
}

const Element = ({ id }) => {
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
            <article onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
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
                    ${gridState.draggedItemId === id ?
                        `
                            position: fixed;
                            left: ${gridState.clientX - gridState.initialOffsetX}px;
                            top: ${gridState.clientY - gridState.initialOffsetY}px;
                        `
                        :
                        `
                        `}
                }
            `}
            </style>
        </>
    )
}

const getInitialGridState = () => {
    return {
        draggedItemId: null,
        clientX: 0,
        clientY: 0,
        initialOffsetX: 0,
        initialOffsetY: 0
    }
}
const Grid = ({ children }) => {
    const [gridState, setGridState] = useState(getInitialGridState());

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
        if (gridState.draggedItemId) {
            const { clientX, clientY } = event.nativeEvent;
            setGridState(gridState => ({
                ...gridState,
                clientX,
                clientY
            }))
        }
    }, [gridState]);

    return (
        <>
            <DNDContext.Provider value={{ gridState, setDraggedItemInfo, setDragEnd }}>
                <div className="grid" onMouseMove={onMouseMove}>
                    {children}
                </div>
            </DNDContext.Provider>
            <style jsx>
                {`
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    justify-items: center;
                    gap: 20px;
                }
            `}
            </style>
        </>
    )
}

const DNDContext = createContext({
    elementMovingId: null
});