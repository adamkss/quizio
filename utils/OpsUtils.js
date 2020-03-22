export const copyToClipboard = function (text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            alert('here')
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}

export const getArrayAfterElementMove = (array, sourceIndex, targetIndex) => {
    const elementToMove = array[sourceIndex];
    if (sourceIndex < 0 || sourceIndex >= array.length || targetIndex < 0 || targetIndex >= array.length) {
        console.log('Array move source or target index false value.');
        return array;
    }
    if (sourceIndex != targetIndex) {
        if (sourceIndex < targetIndex) {
            return [
                ...array.slice(0, sourceIndex),
                ...array.slice(sourceIndex + 1, targetIndex),
                elementToMove,
                ...array.slice(targetIndex, array.length)
            ]
        } else {
            return [
                ...array.slice(0, targetIndex),
                elementToMove,
                ...array.slice(targetIndex, sourceIndex),
                ...array.slice(sourceIndex + 1, array.length)
            ]
        }
    } else {
        return array;
    }
}