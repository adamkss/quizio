import React from 'react';

export const OnEnterPressBoundary = ({ children, onEnterPressed = null }) => {

    const onKeyDown = React.useCallback((event) => {
        if (event.keyCode === 13) {
            onEnterPressed && onEnterPressed();
        }
    }, [onEnterPressed]);

    return React.cloneElement(children, {
        onKeyDown: onKeyDown
    });
}