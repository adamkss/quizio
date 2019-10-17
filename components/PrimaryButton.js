export default ({ rightAligned = false, ...rest }) => {
    const primaryButton = <PrimaryButton {...rest} />;

    return (
        <>
            {rightAligned ?
                <div className="horizontally-end-positioned">
                    {primaryButton}
                </div>
                :
                primaryButton
            }
        </>
    )
}

const PrimaryButton = ({ title, inactive = false, marginRight = false, red = false, ...rest }) => {
    return (
        <>
            <button
                className={`save-question${!inactive ? "" : " inactive"}`}
                {...rest}
                title={title}>
                {title}
            </button>
            <style jsx>
                {`
                button {
                      width: 100px;
                      height: 30px;
                      border: 0;
                      outline: none;
                      font-family: 'Oswald', serif;
                      border-radius: 8px;
                      ${red ?
                        "background-color: #ba2232;"
                        :
                        "background-color: #4BAC60;"
                    }
                      color: white;
                      ${red ?
                        "box-shadow: 1px 1px 8px #ba2232;"
                        :
                        "box-shadow: 1px 1px 8px #4BAC60;"
                    }
                      cursor: pointer;
                      font-size: .9em;
                      transition: all 0.3s;
                      ${marginRight ?
                        "margin-right: 10px;"
                        :
                        null
                    }
                  }
                  button.save-question.inactive {
                      background-color: grey;
                      box-shadow: 1px 1px 8px grey;
                      cursor: default;
                  }
                  button.save-question:not(.inactive):hover {
                    ${red ?
                        "box-shadow: 1px 1px 12px #ba2232;"
                        :
                        "box-shadow: 1px 1px 12px #4BAC60;"
                    }
                  }
                `}
            </style>
        </>
    )
}