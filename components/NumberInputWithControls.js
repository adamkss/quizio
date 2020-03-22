import { useState, useCallback } from "react"

export const NumberInputWithControls = ({ minimum = null, maximum = null, width = null, valueSetter = null, ...rest }) => {
    const [value, setValue] = useState(0);

    const setNewValue = useCallback((newValue) => {
        let isNewValueValid = true;
        if (maximum != null) {
            if (newValue > maximum)
                isNewValueValid = false;
        }
        if (minimum != null) {
            if (newValue < minimum)
                isNewValueValid = false;
        }
        if (isNewValueValid) {
            setValue(newValue);
            valueSetter && valueSetter(newValue);
        }
    }, [minimum, maximum]);

    const onPlusClick = useCallback(() => {
        setNewValue(value + 1);
    }, [value]);

    const onMinusClick = useCallback(() => {
        setNewValue(value - 1);
    }, [value]);

    const onManualNumberChange = useCallback((event) => {
        let inputValue = event.target.value;
        //if there's empty text then put the input value to 0
        if (inputValue == '')
            inputValue = 0;
        setNewValue(parseInt(inputValue, 10));
    }, [setNewValue]);

    return (
        <>
            <div className="wrapper">
                <button className="control-button minus-button" onClick={onMinusClick}>
                    -
            </button>
                <input className="number-input" type="text" value={value} onChange={onManualNumberChange} />
                <button className="control-button plus-button" onClick={onPlusClick}>
                    +
            </button>
            </div>
            <style jsx>
                {`
                .wrapper {
                    --border-radius: 8px;
                    display: flex;
                    font-size: 1.5rem;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
                    border-radius: var(--border-radius);
                    transition: all 0.3s;
                    ${width ?
                        `
                        width: ${width};
                    `
                        :
                        ``
                    }
                }
                .control-button {
                    outline: none;
                    border: none;
                    font-size: inherit;
                    font-family: inherit;
                    padding: 5px;
                    flex: 1;
                    cursor: pointer;
                    background-color: white;
                    transition: all 0.3s;
                    font-size: 1.3em;
                }
                .control-button:active {
                    background-color: rgba(0,0,0,0.1);
                }
                .minus-button {
                    border-top-left-radius: var(--border-radius);
                    border-bottom-left-radius: var(--border-radius);
                }
                .plus-button {
                    border-top-right-radius: var(--border-radius);
                    border-bottom-right-radius: var(--border-radius);
                }
                .number-input {
                    outline: none;
                    border: none;
                    max-width: 120px;
                    padding: 5px;
                    border-left: 1px solid rgba(0, 0, 0, 0.3);
                    border-right: 1px solid rgba(0, 0, 0, 0.3);
                    text-align: center;
                    font-size: inherit;
                    font-family: inherit;
                }
            `}
            </style>
        </>
    )
}