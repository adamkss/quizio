import Router from "next/router";

export default ({ rightAligned = false, centered = false, ...rest }) => {
  const primaryButton = <PrimaryButton {...rest} />;

  return (
    <>
      {rightAligned ? (
        <div className="u-horizontally-end-positioned-content">
          {primaryButton}
        </div>
      ) : centered ? (
        <div className="u-horizontally-centered-content">{primaryButton}</div>
      ) : (
        primaryButton
      )}
    </>
  );
};

const getColorBehaviorsForColor = (
  color,
  secondary,
  textColor,
  borderInsteadOfShadow
) => {
  let colors;
  if (secondary) {
    colors = {
      textColor: "black",
      backgroundColorDefault: "white",
      backgroundColorHover: "hsl(0, 0%, 85%)",
      backgroundColorActive: "hsl(0, 0%, 70%)",
      boxShadowDefault: "none",
      boxShadowHover: "none",
      boxShadowActive: "none",
      borderDefault: "1px solid hsl(0, 0%, 75%)",
    };
  } else {
    switch (color) {
      case "green":
        colors = {
          textColor: textColor,
          backgroundColorDefault: "#4BAC60",
          backgroundColorHover: "#4BAC60",
          backgroundColorActive: "darkgreen",
          boxShadowDefault: "1px 1px 8px #4BAC60",
          boxShadowHover: "1px 1px 12px #4BAC60",
          boxShadowActive: "1px 1px 12px darkgreen",
          borderDefault: "none",
        };
        break;
      case "red":
        colors = {
          textColor: textColor,
          backgroundColorDefault: "#ba2232",
          backgroundColorHover: "#ba2232",
          backgroundColorActive: "purple",
          boxShadowDefault: "1px 1px 8px #ba2232",
          boxShadowHover: "1px 1px 12px #ba2232",
          boxShadowActive: "1px 1px 12px purple",
          borderDefault: "none",
        };
        break;
      case "blue":
        colors = {
          textColor: textColor,
          backgroundColorDefault: "blue",
          backgroundColorHover: "#0040FF",
          backgroundColorActive: "blue",
          boxShadowDefault: "1px 1px 8px blue",
          boxShadowHover: "1px 1px 12px #0040FF",
          boxShadowActive: "1px 1px 12px blue",
          borderDefault: "none",
        };
        break;
      case "pink":
        colors = {
          textColor: textColor,
          backgroundColorDefault: "#F64D72",
          backgroundColorHover: "#FF4D90",
          backgroundColorActive: "#b51b45",
          boxShadowDefault: "1px 1px 8px #F64D72",
          boxShadowHover: "1px 1px 12px #FF4D90",
          boxShadowActive: "1px 1px 12px #b51b45",
          borderDefault: "none",
        };
        break;
      case "purple": {
        colors = {
          textColor: textColor,
          backgroundColorDefault: "#43318D",
          backgroundColorHover: "#43318D",
          backgroundColorActive: "#43318D",
          boxShadowDefault: "1px 1px 8px #43318D",
          boxShadowHover: "1px 1px 12px #43318D",
          boxShadowActive: "1px 1px 12px #43318D",
          borderDefault: "none",
        };
        break;
      }
      case "white": {
        colors = {
          textColor: textColor,
          backgroundColorDefault: "white",
          backgroundColorHover: "rgba(0, 0, 0, 0.1)",
          backgroundColorActive: "rgba(0, 0, 0, 0.4)",
          boxShadowDefault: "1px 1px 8px rgba(0,0,0, 0.4)",
          boxShadowHover: "1px 1px 12px rgba(0,0,0, 0.5)",
          boxShadowActive: "1px 1px 12px rgba(0,0,0, 0.5)",
          borderDefault: "none",
        };
        break;
      }
    }
  }
  if (borderInsteadOfShadow) {
    colors.boxShadowActive = "none";
    colors.boxShadowDefault = "none";
    colors.boxShadowHover = "none";
    colors.borderDefault = "1px solid hsl(0, 0%, 75%)";
  }
  return colors;
};

const PrimaryButton = ({
  title,
  color = "green",
  inactive = false,
  marginRight = false,
  marginTop = false,
  customMarginTop = null,
  extraMarginTop = false,
  big = false,
  medium = false,
  linkTo = null,
  onClick,
  growWithScreenSize = false,
  containerWidthAndHeight = false,
  secondary = false,
  noFixedWidth = false,
  textColor = "white",
  borderInsteadOfShadow = false,
  ...rest
}) => {
  const colorsForDifferentStates = getColorBehaviorsForColor(
    color,
    secondary,
    textColor,
    borderInsteadOfShadow
  );
  const onClickHandler = React.useCallback(() => {
    if (linkTo) {
      Router.push(linkTo);
    } else {
      if (onClick) {
        onClick();
      }
    }
  }, [linkTo, onClick]);
  return (
    <>
      <button
        className={`${!inactive ? "" : " inactive"}`}
        onClick={inactive ? null : onClickHandler}
        {...rest}
        title={title}
      >
        {title}
      </button>
      <style jsx>
        {`
                button {
                      width: 100px;
                      border: ${colorsForDifferentStates.borderDefault};
                      outline: none;
                      font-family: 'Oswald', serif;
                      border-radius: 12px;
                      background-color: ${
                        colorsForDifferentStates.backgroundColorDefault
                      };
                      color: ${colorsForDifferentStates.textColor};
                      box-shadow: ${colorsForDifferentStates.boxShadowDefault};
                    ${
                      big
                        ? `
                            width: 200px;
                            font-size: 1.15em;
                            padding: 9px;
                        `
                        : medium
                        ? `
                            width: 130px;
                            font-size: 1.05em;
                            padding: 5px;
                        `
                        : `
                            font-size: 0.9em;
                            padding: 5px;
                        `
                    }
                      cursor: pointer;
                      transition: all 0.3s;
                      ${marginRight ? "margin-right: 10px;" : ""}
                     ${marginTop ? "margin-top: 10px;" : ""}
                     ${extraMarginTop ? "margin-top: 50px;" : ""}
                    ${
                      customMarginTop
                        ? `
                        margin-top: ${customMarginTop}px;
                        `
                        : ``
                    }
                     ${
                       containerWidthAndHeight
                         ? `
                        width: 100%;
                        height: 100%;
                    `
                         : ``
                     }
                    ${noFixedWidth ? `width: auto;` : ``}
                  }

                  button.inactive {
                      background-color: grey;
                      box-shadow: ${
                        borderInsteadOfShadow ? "none" : "1px 1px 8px grey"
                      };
                      cursor: default;
                  }
                  button:not(.inactive):hover {
                    background-color: ${
                      colorsForDifferentStates.backgroundColorHover
                    };
                    box-shadow: ${colorsForDifferentStates.boxShadowHover};
                  }
                  button:not(.inactive):active,
                  button:not(.inactive):focus {
                    background-color: ${
                      colorsForDifferentStates.backgroundColorActive
                    };
                    box-shadow: ${colorsForDifferentStates.boxShadowActive};
                  }

                  @media (min-width: 750px) {
                    button {
                        ${
                          big && growWithScreenSize
                            ? `
                                width: 250px;
                                font-size: 1.4em;
                                padding: 8px;
                            `
                            : ""
                        }
                    }
                }

                 @media (min-width: 1200px) {
                    button {
                        ${
                          big && growWithScreenSize
                            ? `
                                width: 300px;
                                font-size: 1.55em;
                                padding: 8px;
                            `
                            : ""
                        }
                    }
                 }
        }
    }
`}
      </style>
    </>
  );
};
