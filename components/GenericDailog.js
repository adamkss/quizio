export default ({ children, onDismissDialog }) => {
    const onContentWrapperClick = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    return (
        <>
            <div className="dialog-wrapper" onClick={onDismissDialog}>
                <div className="dialog-content-wrapper" onClick={onContentWrapperClick}>
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
            }
            .dialog-content-wrapper {
                min-width: 300px;
                min-height: 300px;
                border-radius: 8px;
                box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.3);
                padding: 25px;
                background-color: white;
            }
        `}
            </style>
        </>
    )
}