import { useRef } from "react"

export const useObserverPattern = () => {
    const observerStateRef = useRef(function () {
        var observerCallbacks = [];
        function addObserverCallback(callback) {
            observerCallbacks.push(callback);
        };
        function triggerAllObservers() {
            observerCallbacks.forEach(callback => callback());
        };
        return {
            observerCallbacks,
            addObserverCallback,
            triggerAllObservers
        }
    }());

    return {
        observerCallbacks: observerStateRef.current.observerCallbacks,
        addObserverCallback: observerStateRef.current.addObserverCallback,
        triggerObservers: observerStateRef.current.triggerAllObservers
    }
}