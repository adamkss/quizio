import LayoutSetup from '../layoutSetup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';

const getRouteNameAfterPath = (path) => {
    switch (path) {
        case "/quizzes": return "quizzes";
        case "/homepage": return "homepage";
    }
}

export const QuizzesLayoutWrapper = ({ children }) => {
    const { pathname: pathName } = useRouter();
    const [page, setPage] = useState("");
    const [breadcrumbParts, setBreadcrumbParts] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (pathName) {
            const routeName = getRouteNameAfterPath(pathName);
            setPage(routeName);
            switch (routeName) {
                case "homepage": setBreadcrumbParts(["Homepage"]); break;
                case "quizzes": setBreadcrumbParts(["My quizzes"]); break;
            }
        }
    }, [pathName]);

    const toggleMenuCallback = useCallback(() => {
        setIsMenuOpen(isOpen => !isOpen);
    }, [setIsMenuOpen]);

    return (
        <>
            <LayoutSetup />
            <div className="main-layout-orchestrator">
                <aside>
                    <section className="aside__app-title-container">
                        <h1>Quizio</h1>
                    </section>
                    <section>
                        <button className="aside__close-menu" onClick={toggleMenuCallback}>
                            <img src="/static/letter-x.svg"/>
                        </button>
                    </section>
                    <section className="aside__menu-items">
                        <Link href="/homepage">
                            <MenuItem name="Homepage" isSelected={page === "homepage"} />
                        </Link>
                        <Link href="/quizzes">
                            <MenuItem name="Quizzes" isSelected={page === "quizzes"} />
                        </Link>
                        <Link href="/quizzes">
                            <MenuItem name="Quiz Results" isSelected={page === "asd"} />
                        </Link>
                    </section>
                </aside>
                <div className="right-column">
                    <header>
                        <section>
                            <button className="header__menu-opener" onClick={toggleMenuCallback}>
                                <img src="/static/menu.svg"></img>
                            </button>
                        </section>
                        <section className="breadcrumbs">
                            <span className="location-part">Quizio</span>
                            {breadcrumbParts.map((breadcrumbPart, index) =>
                                <span key={index} className="location-part">{breadcrumbPart}</span>
                            )}
                        </section>
                    </header>
                    <main>
                        {children}
                    </main>
                </div>
            </div>
            <style jsx>
                {`
                    .main-layout-orchestrator {
                        display: flex;
                        flex-direction: row;
                        background-color: #F5F6F8;
                    }
                    aside {
                        position: fixed;
                        width: 100vw;
                        height: 100vh;
                        color: #212B36;
                        background-color: #F5F6F8;
                        z-index: 2;
                        flex-direction: column;
                        ${isMenuOpen ?
                            "display: flex;"
                        :
                            "display: none;"
                        }
                    }
                    .aside__menu-items {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        font-size: 1.4em;
                        flex-grow: 1;
                    }
                    .aside__close-menu {
                        position: absolute;
                        top: 60px;
                        left: 10px;
                        border-radius: 50%;
                        width: 45px;
                        padding: 10px;
                        transition: all 0.3s;
                        background-color: inherit;
                        border: none;
                        outline: none;
                    }
                    .aside__close-menu:active {
                       background-color: hsl(0, 0%, 85%);
                    }
                    .header__menu-opener {
                        width: 35px;
                        padding: 4px;
                        margin-right: 10px;
                        margin-left: 5px;
                    }
                    @media (min-width: 740px) {
                        aside {
                            position: relative;
                            width: 250px;
                            height: 100vh;
                            color: #212B36;
                            display: flex;
                            flex-direction: column;
                        }
                        .aside__menu-items {
                            display: flex;
                            padding: 20px;
                            justify-content: start;
                            align-items: start;
                            font-size: 1.1em;
                            border-right: 1px solid #DFE3E8;
                        }
                        .header__menu-opener {
                            display: none;
                        }
                        .aside__close-menu {
                            display: none;
                        }
                    }
                    aside h1,
                    aside h2 {
                        text-align: center;
                        margin: 0;
                    }
                    .aside__app-title-container {
                        height: 50px;
                        color: white;
                        background-color: hsl(210,12%,16%);
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                        justify-content: center;
                    }
                    .aside__app-title-container > h1{
                        font-size: 25px;
                    }   
                    .right-column {
                        width: 100%;
                    }
                    header {
                        height: 50px;
                        background-color: hsl(210,12%,23%);;
                        padding: 5px 5px;
                        display: flex;
                        align-items: center;
                        z-index: 2;
                    }   
                    @media (min-width: 740px) {
                        .right-column {
                            width: calc(100% - 250px);
                        }
                        header {
                            padding: 10px 20px;
                        }
                    }
                    section.breadcrumbs {
                        display: flex;
                    }
                    .breadcrumbs span.location-part {
                        font-weight: 300;
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 1.2em;
                        animation: FadeIn 0.3s;
                    }
                    .breadcrumbs span.location-part:not(:last-child)::after {
                        margin: 0px 10px;
                        content: ">";
                        animation: FadeIn 0.3s;
                    }
                    @keyframes FadeIn {
                        0% {
                            opacity: 0;
                        }
                        100% {
                            opacity: 1;
                        }
                    }
                    main {
                        height: calc(100vh - 50px);
                        overflow: auto;
                        z-index: 1;
                    }
                `}
            </style>
        </>
    )
}

const MenuItem = ({ name, onClick, isSelected }) => {
    return (
        <>
            <div onClick={onClick}>
                <article title={name}>
                    <span className="menu-name">{name}</span>
                </article>
            </div>
            <style jsx>
                {`
                    .menu-name {
                        font-size: 1.2em;
                        cursor: pointer;
                        font-weight: 400;
                    }
                    article {
                        display: inline-block;
                        margin-bottom: 10px;
                    }
                    article::after {
                        content: "";
                        display: block;
                        width: ${isSelected ? "100%" : "0%"};
                        border-bottom: 1px solid #212B36;
                        transition: all 0.3s ease-in;
                        opacity: ${isSelected ? "1" : "0"};
                    }
                    article:hover::after {
                        width: 100%;
                        opacity: 1;
                    }
                `}
            </style>
        </>
    )
}