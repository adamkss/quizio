import Router from 'next/router';

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

const SecondaryButton = ({ title, inactive = false, marginRight = false, marginTop = false, big = false, linkTo = null, ...rest }) => {
    const onClickHandler = React.useCallback(() => {
        if (linkTo) {
            Router.push(linkTo);
        }
    }, [linkTo]);
    return (
        <>
            <button
                className={`save-question${!inactive ? "" : " inactive"}`}
                onClick={onClickHandler}
                {...rest}
                title={title}>
                {title}
            </button>
            <style jsx>
                {`
                button {
                      width: 100px;
                      border: 1px solid rgba(0, 0, 0, 0.3);
                      outline: none;
                      font-family: 'Oswald', serif;
                      border-radius: 12px;
                      color: black;
                      background-color: white;
                      cursor: pointer;
                      ${big ?
                        `
                            width: 200px;
                            font-size: 1.15em;
                            padding: 9px;
                        `
                        :
                        `
                            font-size: 0.9em;
                            padding: 5px;
                        `
                    }
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