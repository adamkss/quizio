export const executeAsyncFunctionAndObserveState = async (setIsInProgress, func, ...args) => {
    setIsInProgress(true);
    const result = await func(...args);
    setIsInProgress(false);
    return result;
}