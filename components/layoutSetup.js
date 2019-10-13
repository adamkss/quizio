import Head from 'next/head';

export default () => {
    return (
        <>
        <Head>
            <link href="https://fonts.googleapis.com/css?family=Oswald:300,400,500,600,700&display=swap" rel="stylesheet" />
        </Head>
        <style jsx global>
            {`
                * {
                    box-sizing: border-box;
                }
                body, html {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    font-family: 'Oswald', sans-serif;
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
                .horizontally-end-positioned {
                    width: 100%;
                    display: flex;
                    justify-content: flex-end;
                }
            `}
        </style>
        </>
    )
}