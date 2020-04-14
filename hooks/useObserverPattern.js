import { useRef, useEffect } from "react"

export const useObserverPattern = () => {
    const observerStateRef = useRef({
        observerCallbacks: [],
        addObserverCallback: function (callback) {
            this.observerCallbacks.push(callback);
        },
        triggerAllObservers: function () {
            this.observerCallbacks.forEach(callback => callback());
        }
    });

    useEffect(() => {
        const { current: observerState } = observerStateRef;
        observerState.addObserverCallback = observerState.addObserverCallback.bind(observerState);
        observerState.triggerAllObservers = observerState.triggerAllObservers.bind(observerState);
    }, []);


    return {
        observerCallbacks: observerStateRef.current.observerCallbacks,
        addObserverCallback: observerStateRef.current.addObserverCallback,
        triggerObservers: observerStateRef.current.triggerAllObservers
    }
}