import LayoutSetup from '../layoutSetup';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { useEffect, useState, useCallback, useRef } from 'react';
import { clearToken } from '../../utils/AuthUtils';
import LoadingSpinner from '../LoadingSpinner';

const getRouteNameAfterPath = (path) => {
    switch (path) {
        case "/quizzes": return "Quizio - My quizzes";
        case "/homepage": return "Quizio - Homepage";
        case "/genericQuizzes/[genericQuizId]/results": return "Quizio - Quiz results";
        case "/schools/tests": return "Quizio Schools - Tests";
        case "/schools/[testId]/codes": return "Quizio Schools - Entry Codes";
    }
}

export const QuizzesLayoutWrapper = ({ children, extraParamFromChild, isLoading = false, addObserverCallback = null }) => {
    const { pathname: pathName, asPath } = useRouter();
    const [page, setPage] = useState("");
    const [formalPageName, setFormalPageName] = useState('Quizio');
    const [breadcrumbParts, setBreadcrumbParts] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const mainContentRef = useRef(null);

    useEffect(() => {
        if (pathName) {
            const routeName = getRouteNameAfterPath(pathName);
            setFormalPageName(routeName);
            setPage(routeName);
            switch (routeName) {
                case "Quizio - Homepage": setBreadcrumbParts([{
                    text: "Homepage",
                    link: "/homepage"
                }]); break;
                case "Quizio - My quizzes": setBreadcrumbParts([
                    {
                        text: "My quizzes",
                        link: "/quizzes"
                    }
                ]); break;
                case "Quizio - Quiz results": extraParamFromChild && setBreadcrumbParts([
                    {
                        text: "My quizzes",
                        link: "/quizzes"
                    },
                    {
                        text: extraParamFromChild,
                        link: asPath
                    },
                    {
                        text: "Results",
                        link: asPath
                    }
                ]); break;
                case "Quizio Schools - Tests": setBreadcrumbParts([
                    {
                        text: "Tests (Quizio Schools)",
                        link: "/schools/tests"
                    },
                ]); break;
                case "Quizio Schools - Entry Codes": setBreadcrumbParts([
                    {
                        text: "Tests (Quizio Schools)",
                        link: "/schools/tests"
                    },
                    {
                        text: "Test entry codes",
                        link: asPath
                    }
                ]); break;
            }
        }
    }, [pathName, asPath, extraParamFromChild]);

    const toggleMenuCallback = useCallback(() => {
        setIsMenuOpen(isOpen => !isOpen);
    }, [setIsMenuOpen]);

    const onLogoutClick = useCallback(() => {
        clearToken();
        Router.push('/');
    }, [clearToken, Router]);

    const scrollContentToBottom = useCallback(() => {
        const { current: element } = mainContentRef;
        element.scrollTop = element.scrollHeight;
    }, [mainContentRef]);

    useEffect(() => {
        if (addObserverCallback) {
            addObserverCallback(scrollContentToBottom);
        }
    }, [addObserverCallback, scrollContentToBottom]);

    return (
        <>
            <LayoutSetup title={formalPageName} />
            {isLoading ?
                <LoadingSpinner />
                :
                ''
            }
            <div className="main-layout-orchestrator">
                <aside>
                    <section className="aside__app-title-container">
                        <h1>Quizio</h1>
                    </section>
                    <section>
                        <button className="aside__close-menu" onClick={toggleMenuCallback}>
                            <img src="/static/letter-x.svg" />
                        </button>
                    </section>
                    <section className="aside__menu-items">
                        <Link href="/homepage">
                            <MenuItem name="Homepage" isSelected={page === "Quizio - Homepage"} />
                        </Link>
                        <Link href="/quizzes">
                            <MenuItem name="Quizzes" isSelected={page === "Quizio - My quizzes" || page === "Quizio - Quiz results"} />
                        </Link>
                        <Link href="/schools/tests">
                            <MenuItem name="Tests (Quizio Schools)" isSelected={page === "Quizio Schools - Tests" || page === "Quizio Schools - Entry Codes"} />
                        </Link>
                        <div className="aside__menu-separator" />
                        <MenuItem name="Logout" onClick={onLogoutClick} />
                    </section>
                </aside>
                <div className="right-column">
                    <header>
                        <section>
                            <button className="header__menu-opener" onClick={toggleMenuCallback}>
                                <img src="/static/menu.svg"></img>
                            </button>
                        </section>
                        <ol className="breadcrumbs">
                            <li className="location-part">
                                <Link href="/homepage" >
                                    <a>
                                        Quizio
                                    </a>
                                </Link>
                            </li>
                            {breadcrumbParts.map((breadcrumbPart) =>
                                <li key={breadcrumbPart.text} className="location-part">
                                    <Link href={breadcrumbPart.link}>
                                        <a>
                                            {breadcrumbPart.text}
                                        </a>
                                    </Link>
                                </li>
                            )}
                        </ol>
                    </header>
                    <div className="main-content" ref={mainContentRef}>
                        {children}
                    </div>
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
                        flex-direction: column;
                        ${isMenuOpen ?
                        `display: flex;
                         z-index: 1;`
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
                        cursor: pointer;
                    }
                    .aside__close-menu:active {
                       background-color: hsl(0, 0%, 85%);
                    }
                    .aside__menu-separator {
                        width: 100%;
                        max-width: 300px;
                        height: 1px;
                        background-color: hsl(0, 0%, 85%);
                        margin: 20px 0px;
                    }
                    .header__menu-opener {
                        width: 35px;
                        padding: 4px;
                        margin-right: 10px;
                        margin-left: 5px;
                        background-color: transparent;
                        border: none;
                        outline: none;
                        cursor: pointer;
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
                    }   
                    @media (min-width: 740px) {
                        .right-column {
                            width: calc(100% - 250px);
                        }
                        header {
                            padding: 10px 20px;
                        }
                    }
                    .breadcrumbs {
                        display: flex;
                        list-style: none;
                    }
                    .breadcrumbs .location-part {
                        font-weight: 300;
                        color: rgba(255, 255, 255, 0.8);
                        white-space: nowrap;
                        font-size: 1.2em;
                        animation: FadeIn 0.3s;
                    }
                    @media (min-width: 610px) {
                        .breadcrumbs .location-part {
                            font-size: 1.25em;
                        }
                    }
                    .breadcrumbs .location-part:not(:last-child)::after {
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
                    .breadcrumbs a {
                        color: inherit;
                        text-decoration: none;
                    }
                    .main-content {
                        position: relative;
                        height: calc(100vh - 50px);
                        overflow: auto;
                        z-index: 0;
                        padding-bottom: 70px;
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