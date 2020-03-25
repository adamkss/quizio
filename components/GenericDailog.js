export default ({ children, title, onDismissDialog, loading = false, ...rest }) => {
    const onContentWrapperClick = React.useCallback((event) => {
        //see whether the clicked area is part of the wrapper and not the content
        if (event.target.dataset.clickToQuit) {
            onDismissDialog();
        }
    }, [onDismissDialog]);

    return (
        <>
            <div className="dialog-wrapper" onClick={onContentWrapperClick} data-click-to-quit {...rest} >
                <div className="dialog-content-wrapper">
                    {title ? <h1>{title}</h1> : null}
                    {children}
                    {loading ?
                        <LoadingScreen />
                        :
                        null
                    }
                </div>
            </div>
            <style jsx>
                {`
            .dialog-wrapper {
                position: fixed;
                top: 0;
                left:0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 99999;
                font-size: 0.9rem;
            }
            @media (min-width: 500px ) {
                .dialog-wrapper {
                    font-size: 1rem;
                }
            }
            .dialog-content-wrapper {
                width: calc(100% - 30px);
                min-width: 300px;
                max-width: 500px;
                max-height: 95vh;
                border-radius: 8px;
                box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.3);
                padding: 8px;
                background-color: white;
                animation: DialogIn 0.2s;
                position: relative;
                overflow: auto;
            }
            @media (min-width: 340px) {
                .dialog-content-wrapper {
                    padding: 15px;
                }
            }
            @media (min-width: 440px) {
                .dialog-content-wrapper {
                    padding: 25px;
                }
            }
            @keyframes DialogIn { 
                0% {
                    transform: scale(0.9);
                    opacity: 0;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            h1 {
                font-size: 1.7em;
                font-weight: 500;
                margin-bottom: 10px;
            }
        `}
            </style>
        </>
    )
}

const LoadingScreen = () => {
    return (
        <>
            <div className="wrapper">
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
            <style jsx>
                {`
                .wrapper {
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.3);
                    border-radius: 8px;
                    animation: LoadingScreenIn 0.5s;
                }
                @keyframes LoadingScreenIn {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
                .lds-ring {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.8);
                z-index: 99999;
                display: inline-block;
                width: 80px;
                height: 80px;
                }
                .lds-ring div {
                box-sizing: border-box;
                display: block;
                position: absolute;
                width: 64px;
                height: 64px;
                margin: 8px;
                border: 7px solid;
                border-radius: 50%;
                animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-color: hsl(0,0%,100%) transparent transparent transparent;
                }
                .lds-ring div:nth-child(1) {
                animation-delay: -0.45s;
                }
                .lds-ring div:nth-child(2) {
                animation-delay: -0.3s;
                }
                .lds-ring div:nth-child(3) {
                animation-delay: -0.15s;
                }
                @keyframes lds-ring {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
                }
            `}
            </style>
        </>
    )
}