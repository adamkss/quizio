import Head from 'next/head';

export default ({ title = null }) => {
    return (
        <>
            <Head>
                {title ?
                    <title>{title}</title>
                    :
                    null
                }
                <link rel="icon" href="/static/favicon.png" />
                <link href="https://fonts.googleapis.com/css?family=Oswald:300,400,500,600,700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css?family=Reenie+Beanie&display=swap" rel="stylesheet"></link>
            </Head>
        </>
    )
}