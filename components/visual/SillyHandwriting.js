export const SillyHandwritingWithOption = ({ text, checked, noMargins = false, smallMargin = false, width = "50px" }) => {
    return (
        <>
            <div className="shell">
                <SillyHandwriting text={text} />
                <Checkmarkplace checked={checked} width={width} />
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
                        ${ smallMargin ?
                        "margin-top: 20px;"
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

export const Checkmarkplace = ({ checkmarkplaceColor = "#44318d", checked, width }) => {
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
                    width: ${width};
                    height: ${width};
                    background-color: ${checkmarkplaceColor};
                    border-radius: 45%;
                    position: relative;
                }
                img {
                    width: ${width == "50px" ? "60px" : "35px"}
                }
            `}
            </style>
        </>
    )
}