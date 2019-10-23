export default ({ noMarginTop, noMarginBottom, title, onChange, valueSetter = null, width = "400px", marginTop = "5px", ...rest }) => {
    const onValueChangeCallback = React.useCallback((event) => {
        valueSetter(event.target.value);
    }, [valueSetter]);

    //TODO: Implement htmlFor attribute with lodash _uniqueId method
    return (
        <>
            <label>{title}</label>
            <input type="text" {...rest} onChange={valueSetter ? onValueChangeCallback : onChange}></input>
            <style jsx>
                {`
                label {
                      font-size: 1.2em;
                      display: block;
                  }
                 input {
                      display: block;
                      width: ${width};
                      outline: none;
                      border: 1px solid rgba(0, 0, 0, 0.4);
                      border-radius: 5px;
                      padding: 10px;
                      font-size: 1em;
                      ${noMarginTop ?
                        null
                        :
                        `margin-top: ${marginTop};`
                    }
                    ${noMarginBottom ?
                        null
                        :
                        "margin-bottom: 10px;"
                    }
                  }
                  input:focus {
                      border: 1px solid transparent;
                      box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.4);
                  }
            `}
            </style>
        </>
    )
}