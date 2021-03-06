export default () => {
    return (
        <>
            <div className="container">
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
            <style jsx>
                {`
                    .container {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100vh;
                        background-color: rgba(0, 0, 0, 0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999999;
                    }
                    .lds-ellipsis {
                        display: inline-block;
                        position: relative;
                        width: 64px;
                        height: 64px;
                    }
                    .lds-ellipsis div {
                        position: absolute;
                        top: 27px;
                        width: 11px;
                        height: 11px;
                        border-radius: 50%;
                        background: #fff;
                        animation-timing-function: cubic-bezier(0, 1, 1, 0);
                    }
                    .lds-ellipsis div:nth-child(1) {
                        left: 6px;
                        animation: lds-ellipsis1 0.6s infinite;
                    }
                    .lds-ellipsis div:nth-child(2) {
                        left: 6px;
                        animation: lds-ellipsis2 0.6s infinite;
                    }
                    .lds-ellipsis div:nth-child(3) {
                        left: 26px;
                        animation: lds-ellipsis2 0.6s infinite;
                    }
                    .lds-ellipsis div:nth-child(4) {
                        left: 45px;
                        animation: lds-ellipsis3 0.6s infinite;
                    }
                    @keyframes lds-ellipsis1 {
                    0% {
                        transform: scale(0);
                    }
                    100% {
                        transform: scale(1);
                    }
                    }
                    @keyframes lds-ellipsis3 {
                    0% {
                        transform: scale(1);
                    }
                    100% {
                        transform: scale(0);
                    }
                    }
                    @keyframes lds-ellipsis2 {
                    0% {
                        transform: translate(0, 0);
                    }
                    100% {
                        transform: translate(19px, 0);
                    }
                    }

                `}
            </style>
        </>
    )
}