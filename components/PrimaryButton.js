export default ({ rightAligned = false, ...rest }) => {
    const primaryButton = <PrimaryButton {...rest} />;

    return (
        <>
            {rightAligned ?
                <div className="horizontally-end-positioned">
                    {primaryButton}
                </div>
                :
                { primaryButton }
            }
            <style jsx>
                {`
        `}
            </style>
        </>
    )
}

const PrimaryButton = ({ title, inactive = false, ...rest }) => {
    return (
        <>
            <button
                className={`save-question${!inactive ? "" : " inactive"}`}
                {...rest}>
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
                      background-color: #4BAC60;
                      color: white;
                      box-shadow: 1px 1px 8px #4BAC60;
                      cursor: pointer;
                      font-size: .9em;
                      transition: all 0.3s;
                  }
                  button.save-question.inactive {
                      background-color: grey;
                      box-shadow: 1px 1px 8px grey;
                      cursor: default;
                  }
                  button.save-question:not(.inactive):hover {
                      box-shadow: 1px 1px 12px #4BAC60;
                  }
                `}
            </style>
        </>
    )
}