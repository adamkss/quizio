import Router from 'next/router';

export default ({ rightAligned = false, centered = false, ...rest }) => {
    const primaryButton = <PrimaryButton {...rest} />;

    return (
        <>
            {rightAligned ?
                <div className="horizontally-end-positioned">
                    {primaryButton}
                </div>
                :
                centered ?
                    <div className="horizontally-centered">
                        {primaryButton}
                    </div>
                    :
                    primaryButton
            }
        </>
    )
}

const getColorBehaviorsForColor = (color) => {
    switch (color) {
        case "green":
            return {
                backgroundColorDefault: "#4BAC60",
                backgroundColorHover: "#4BAC60",
                backgroundColorActive: "darkgreen",
                boxShadowDefault: "1px 1px 8px #4BAC60",
                boxShadowHover: "1px 1px 12px #4BAC60",
                boxShadowActive: "1px 1px 12px darkgreen"
            }
        case "red":
            return {
                backgroundColorDefault: "#ba2232",
                backgroundColorHover: "#ba2232",
                backgroundColorActive: "purple",
                boxShadowDefault: "1px 1px 8px #ba2232",
                boxShadowHover: "1px 1px 12px #ba2232",
                boxShadowActive: "1px 1px 12px purple"
            }
        case "blue":
            return {
                backgroundColorDefault: "blue",
                backgroundColorHover: "#0040FF",
                backgroundColorActive: "blue",
                boxShadowDefault: "1px 1px 8px blue",
                boxShadowHover: "1px 1px 12px #0040FF",
                boxShadowActive: "1px 1px 12px blue"
            }
        case "pink":
            return {
                backgroundColorDefault: "#F64D72",
                backgroundColorHover: "#FF4D90",
                backgroundColorActive: "#b51b45",
                boxShadowDefault: "1px 1px 8px #F64D72",
                boxShadowHover: "1px 1px 12px #FF4D90",
                boxShadowActive: "1px 1px 12px #b51b45"
            }
    }
}

const PrimaryButton = ({
    title, color = "green", inactive = false, marginRight = false, marginTop = false, extraMarginTop = false,
    big = false, medium = false, linkTo = null, onClick, growWithScreenSize = false, containerWidthAndHeight = false, ...rest
}) => {
    const colorsForDifferentStates = getColorBehaviorsForColor(color);
    const onClickHandler = React.useCallback(() => {
        if (linkTo) {
            Router.push(linkTo);
        } else {
            onClick();
        }
    }, [linkTo, onClick]);
    return (
        <>
            <button
                className={`save-question${!inactive ? "" : " inactive"}`}
                onClick={inactive ? null : onClickHandler}
                {...rest}
                title={title}>
                {title}
            </button>
            <style jsx>
                {`
                button {
                      width: 100px;
                      border: 0;
                      outline: none;
                      font-family: 'Oswald', serif;
                      border-radius: 12px;
                      background-color: ${colorsForDifferentStates.backgroundColorDefault};
                      color: white;
                      box-shadow: ${colorsForDifferentStates.boxShadowDefault};
                    ${big ?
                        `
                            width: 200px;
                            font-size: 1.15em;
                            padding: 9px;
                        `
                        :
                        medium ?
                            `
                            width: 130px;
                            font-size: 1.15em;
                            padding: 5px;
                        `
                            :
                            `
                            font-size: 0.9em;
                            padding: 5px;
                        `
                    }
                      cursor: pointer;
                      transition: all 0.3s;
                      ${marginRight ?
                        "margin-right: 10px;"
                        :
                        ""
                    }
                     ${marginTop ?
                        "margin-top: 10px;"
                        :
                        ""
                    }
                     ${extraMarginTop ?
                        "margin-top: 50px;"
                        :
                        ""
                    }
                     ${containerWidthAndHeight ?
                    `
                        width: 100%;
                        height: 100%;
                    `
                        :
                        ``
                    }
                  }

                  button.save-question.inactive {
                      background-color: grey;
                      box-shadow: 1px 1px 8px grey;
                      cursor: default;
                  }
                  button.save-question:not(.inactive):hover {
                    background-color: ${colorsForDifferentStates.backgroundColorHover};
                    box-shadow: ${colorsForDifferentStates.boxShadowHover};
                  }
                  button.save-question:not(.inactive):active {
                    background-color: ${colorsForDifferentStates.backgroundColorActive};
                    box-shadow: ${colorsForDifferentStates.boxShadowActive};
                  }

                  @media (min-width: 750px) {
                    button {
                        ${big && growWithScreenSize ?
                        `
                                width: 250px;
                                font-size: 1.4em;
                                padding: 8px;
                            `
                        :
                        ""
                    }
                    }
                }

                 @media (min-width: 1200px) {
                    button {
                        ${big && growWithScreenSize ?
                        `
                                width: 300px;
                                font-size: 1.55em;
                                padding: 8px;
                            `
                        :
                        ""
                    }
                    }
                 }
        }
    }
`}
            </style>
        </>
    )
}