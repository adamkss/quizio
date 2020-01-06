import Head from 'next/head';

export default () => {
    return (
        <>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=Oswald:300,400,500,600,700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css?family=Reenie+Beanie&display=swap" rel="stylesheet"></link>
            </Head>
            <style jsx global>
                {`
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                body, html {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    font-family: 'Oswald', sans-serif;
                }
                .centered {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .full-view-height {
                    height: 100vh;
                }
                .small-lateral-padding {
                    padding: 0px 10px;
                }
                .fancy-shiny-button {
                    outline: none;
                    height: 40px;
                    padding-left: 10px;
                    padding-right: 10px;
                    border-radius: 10px;
                    background: linear-gradient(90deg, #EF34F5 0%, #E74C54 100%);
                    border: none;
                    color: white;
                    font-size: 1em;
                    font-family: 'Oswald', sans-serif;
                    box-shadow: 0px 0px 9px #EF34F5;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 25px;
                }
                .horizontal-centered {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .horizontally-centered {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
                .horizontally-centered-vertical {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }
                .horizontally-end-positioned {
                    width: 100%;
                    display: flex;
                    justify-content: flex-end;
                }
                @keyframes SlideUp {
                0% {
                    transform: translateY(20px);
                    opacity: 0;
                }
                100% {
                    transform: translateY(0px);
                    opacity: 1;
                }
                }
                .fade-and-slide-in {
                    animation: FadeAndSlideIn 1s;
                }
                @keyframes FadeAndSlideIn {
                    0% {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    100% {
                        transform: translateY(0px);
                        opacity: 1;
                    }
                }
                .fade-in {
                    animation: FadeIn 1s;
                }
                @keyframes FadeIn {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
                .icon-button {
                    border: none;
                    outline: none;
                }
                .flex-space {
                    flex-grow: 1;
                }
            `}
            </style>
        </>
    )
}