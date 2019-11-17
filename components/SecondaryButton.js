export default ({ rightAligned = false, centered = false, ...rest }) => {
    const secondaryButton = <SecondaryButton {...rest} />;

    return (
        <>
            {rightAligned ?
                <div className="horizontally-end-positioned">
                    {secondaryButton}
                </div>
                :
                centered ?
                    <div className="horizontally-centered">
                        {secondaryButton}
                    </div>
                    :
                    secondaryButton
            }
        </>
    )
}

const SecondaryButton = ({ title, inactive = false, marginRight = false, marginTop = false, ...rest }) => {
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
                      border: 1px solid rgba(0, 0, 0, 0.3);
                      outline: none;
                      font-family: 'Oswald', serif;
                      border-radius: 8px;
                      color: black;
                      background-color: white;
                      cursor: pointer;
                      font-size: .9em;
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
                  }
                  button.save-question.inactive {
                      background-color: grey;
                      box-shadow: 1px 1px 8px grey;
                      cursor: default;
                  }
                  button.save-question:not(.inactive):hover {
                   background-color: #FF0070;
                   color: white;
                   border: 1px solid transparent;
                  }
                  button.save-question:not(.inactive):active {
                   background-color: #900050;
                  }
                `}
            </style>
        </>
    )
}