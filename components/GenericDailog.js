export default ({ children, title, onDismissDialog, ...rest }) => {
    const onContentWrapperClick = React.useCallback((event) => {
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
            }
            .dialog-content-wrapper {
                width: calc(100% - 30px);
                min-width: 300px;
                max-width: 500px;
                max-height: 500px;
                border-radius: 8px;
                box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.3);
                padding: 25px;
                background-color: white;
                animation: DialogIn 0.4s;
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