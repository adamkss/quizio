import LayoutSetup from '../layoutSetup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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

    return (
        <>
            <LayoutSetup />
            <div className="main-layout-orchestrator">
                <aside>
                    <section className="aside__app-title-container">
                        <h1>Quizio</h1>
                    </section>
                    <section className="menu-items">
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
                        width: 250px;
                        height: 100vh;
                        color: #212B36;
                        display: flex;
                        flex-direction: column;
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
                        width: calc(100% - 250px);
                    }
                    .menu-items {
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        border-right: 1px solid #DFE3E8;
                        flex-grow: 1;
                    }
                    header {
                        height: 50px;
                        background-color: hsl(210,12%,23%);;
                        padding: 10px 20px;
                        display: flex;
                        align-items: center;
                        z-index: 2;
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