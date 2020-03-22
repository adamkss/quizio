import { useState, useEffect } from "react"

export const Code = ({ code = "1234", fontSize = "1rem", extraCSS = "", inversedColors = false }) => {
    const [codeElements, setCodeElements] = useState([]);

    useEffect(() => {
        let array = [];
        for (let i = 0; i < code.length; i++) {
            array = [...array, code[i]];
        }
        setCodeElements(array);
    }, [code]);

    return (
        <>
            <div className="code">
                {codeElements.map(character =>
                    <div className="code__element">
                        <span>{character}</span>
                    </div>
                )}
            </div>
            <style jsx>
                {`
            .code {
                display: flex;
                justify-content: center;
                font-size: ${fontSize};
                ${extraCSS}
            }
            .code__element {
                padding: 8px;
                background-color: ${inversedColors ? "black" : "white"};
                color: ${inversedColors ? "white" : "black"};
            }
            .code__element:not(:last-child) {
                margin-right: 4px;
            }
            .code__element:first-child {
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
            }
            .code__element:last-child {
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
            }
        `}
            </style>
        </>
    )
}