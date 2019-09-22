import { useEffect, useRef } from 'react';
import Head from 'next/head';
import { TweenMax } from 'gsap';

const FeatureCard = ({ title, picturePath }) => {
    return (
        <>
            <div className="feature-card">
                <h1>{title}</h1>
                <img src={picturePath} />
            </div>
            <style jsx>
                {`
                    .feature-card {
                        width: 185px;
                        height: 185px;
                        background-color: white;
                        box-shadow: 0px 0px 10px grey;
                        border-radius: 10px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
                        position: relative;
                    }

                    .feature-card h1 {
                        text-align: center;
                        font-weight: 400;
                        font-size: 1.6em;
                    }

                    .feature-card img {
                        position: absolute;
                        width: 80px;
                        top: 45%;
                        left: 50%;
                        transform: translatex(-50%);
                    }

                    .feature-card:hover {
                        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                    }

                    .feature-card:not(:nth-child(1)) {
                        margin-left: 25px;
                    }
                `}
            </style>
        </>
    )
}

export default () => {
    let headingElement = useRef(null);
    let subheadingElement = useRef(null);
    let headingImageElement = useRef(null);

    let featureCardsHolder = useRef(null);

    useEffect(() => {
        TweenMax.from(
            headingElement,
            1,
            {
                y: 40,
                opacity: 0
            },
        );
        TweenMax.from(
            subheadingElement,
            1,
            {
                y: 40,
                opacity: 0,
                delay: 0.3
            },
        );
        TweenMax.from(
            headingImageElement,
            1,
            {
                x: 40,
                opacity: 0,
                delay: 0.3
            }
        );
        TweenMax.from(
            featureCardsHolder,
            1,
            {
                y: 40,
                opacity: 0,
                delay: .3
            }
        )
    }, []);

    return (
        <>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=Oswald:300,400,500,600,700&display=swap" rel="stylesheet" />
            </Head>
            <header>
                <div className="horizontal-centered justify-space-around">
                    <section>
                        <h1 ref={ref => headingElement = ref}>Conquerio</h1>
                        <h2 ref={ref => subheadingElement = ref}>Începe-ti cariera în IT <span className="bold">acum.</span></h2>
                    </section>
                    <img src="/static/macbook.png" ref={ref => headingImageElement = ref} />
                </div>
                <section className="horizontal-centered feature-cards-holder" ref={ref => featureCardsHolder = ref}>
                    <FeatureCard title="Învață și câștigă puncte" picturePath="/static/trophy.svg" />
                    <FeatureCard title="Urmărește-ți progresul" picturePath="/static/king.svg" />
                    <FeatureCard title="Primește diplome" picturePath="/static/diploma.svg" />
                </section>
                <button className="see-details">Să începem! Înregistrare.</button>
                <button className="login-already-user">Deja utilizator? Autentificare.</button>
            </header>

            <main>
                <section className="feature-detail first-detail">
                </section>
                <section className="feature-detail second-detail">
                </section>
            </main>

            <style jsx global>
                {`
                body, html {
                    padding: 0;
                    margin: 0;
                    font-family: 'Oswald', sans-serif;
                }
                h1, h2 {
                    margin: 0;
                }
                `}
            </style>
            <style jsx>
                {`

            header {
                width: 100%;
                padding-bottom: 40px;
                background: rgb(0,27,103);
                background: linear-gradient(270deg, rgba(0,27,103,1) 0%, rgba(78,103,235,1) 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                clip-path: polygon(50% 0%, 100% 0, 100% 93%, 50% 100%, 0 93%, 0 0);
            }
            .horizontal-centered {
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
            }
            .justify-space-around {
                justify-content: space-around;
            }

            button.see-details {
                outline: none;
                height: 40px;
                padding-left: 10px;
                padding-right: 10px;
                border-radius: 10px;
                background: linear-gradient(90deg, #EF34F5 0%, #E74C54 100%);
                border: none;
                color: white;
                font-size: 1.4em;
                font-family: 'Oswald', sans-serif;
                box-shadow: 0px 0px 9px #EF34F5;
                cursor: pointer;
                transition: all 0.3s;
                margin-top: 25px;
            }

            button.see-details:hover {
                box-shadow: 0px 0px 10px white;
                transform: scale(1.05);
            }
            
            button.login-already-user {
                outline: none;
                height: 40px;
                background: transparent;
                border: none;
                color: white;
                font-size: 1em;
                cursor: pointer;
                margin-top: 25px;
                font-family: 'Oswald', sans-serif;
                font-weight: 200;
                background-color: rgba(0,0,0,0.2);
                color: white;
                transition: all 0.3s;
            }

            button.login-already-user:hover {
                color: black;
                background-color: white;
            }

            header h1,
            header h2 {
                font-family: 'Oswald', sans-serif;
                color: white;
            }
            header h1 {
                font-size: 6em;
                font-weight: 500;
            }
            header h2 {
                font-size: 2em;
                font-weight: 300;
            }
            header h2 span.bold {
                font-weight: 600;
            }
            header img {
                width: 350px;
                transform: rotate(2deg) scale(1.3) translateY(30px);
            }
            .lol {
                background-color: red;
            }
            
            main {
            }

            .main-features-cards {
                display: flex;
                flex-direction: row;
                justify-content: center;
                flex-wrap: wrap;
            }

            .feature-detail {
                width: 100%;
                height: 300px;
            }
            .feature-detail:not(:last-child) {
            }

            .first-detail {
            }

            .second-detail {
            }
            `}
            </style>
        </>
    )

}