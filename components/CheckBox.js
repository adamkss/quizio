import React from 'react';

export default ({ title = "", checked, onChange, marginTop = false, leftSideTitle = false, customMarginTop = null, extraCSS = '' }) => {
    return (
        <>
            <label>
                {leftSideTitle ?
                    <span className="title leftside-text">{title}</span>
                    :
                    null
                }
                <div className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={onChange}></input>
                    <div className="shell">
                        <div className="shell__active-indicator">
                        </div>
                    </div>
                </div>
                {!leftSideTitle ?
                    <span className="title">{title}</span>
                    :
                    null
                }
            </label>
            <style jsx>
                {`
                    label {
                        position: relative;
                        display: flex;
                        align-items: center;
                        ${marginTop ?
                        `margin-top: ${customMarginTop ? customMarginTop : '10px'};`
                        :
                        ""
                    }
                    }
                    input {
                    position: absolute;
                        opacity: 0;
                        height: 100%;
                    }
                    .checkbox-container {
                    display: inline-block;
                        margin-right: 5px;
                        ${extraCSS}
                    }
                    .leftside-text {
                    margin-right: 5px;
                    }
                   .shell {
                    position: relative;
                       width: 64px;
                       height: 31px;
                       box-shadow: 0px 0px 8px hsl(0, 0%, 70%);
                       border-radius: 15px;
                       background-color: hsl(0, 0%, 70%);
                       transition: all 0.5s;
                   }
                   .shell__active-indicator {
                       border-radius: 50%;
                       height: 25px;
                       width: 25px;
                       background-color: hsl(0, 0%, 96%);
                       position: absolute;
                       right: 35px;
                       top: 3px;
                       transition: all 0.5s;
                   }
                   input:checked ~ .shell .shell__active-indicator {
                    right: 2px;
                   }
                   input:checked ~ .shell {
                    background-color: #4CAC60;
                    box-shadow: 0px 0px 8px #4CAC60;
                   }
                   .title {
                    font-size: 1.1rem;
                   }
                `}
            </style>
        </>
    )
}