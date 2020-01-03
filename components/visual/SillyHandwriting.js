export const SillyHandwritingWithOption = ({ text, checked, noMargins = false }) => {
    return (
        <>
            <div className="shell">
                <SillyHandwriting text={text} />
                <Checkmarkplace checked={checked} />
            </div>
            <style jsx>
                {`
                    .shell {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        ${!noMargins ?
                        "margin-top: 60px;"
                        :
                        ""
                        }
                    }
            `}
            </style>
        </>
    )
}
export const SillyHandwriting = ({ text = "Lorem impsum dolor" }) => {
    return (
        <>
            <span>{text}</span>
            <style jsx>
                {`
                    span {
                        font-size: 2em;
                        font-family: 'Reenie Beanie', cursive;
                    }
                `}
            </style>
        </>
    )
}

export const Checkmarkplace = ({ checkmarkplaceColor = "#44318d", checked }) => {
    return (
        <>
            <div className="checkmark-place">
                {checked ?
                    <img src="/static/checkmark.svg" />
                    :
                    null
                }
            </div>
            <style jsx>
                {`
                .checkmark-place {
                    width: 50px;
                    height: 50px;
                    background-color: ${checkmarkplaceColor};
                    border-radius: 45%;
                    position: relative;
                }
                img {
                    width: 60px;
                }
            `}
            </style>
        </>
    )
}