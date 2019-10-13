import LayoutSetup from './layoutSetup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const getRouteNameAfterPath = (path) => {
    switch (path) {
        case "/backoffice/courses": return "courses";
        case "/backoffice/courses/[id]/quizzes": return "quizzes";
        case "/backoffice/courses/[id]/quizzes/[quizId]": return "questions";
    }
}

export const BackOfficeLayoutWrapper = ({ children }) => {
    const { pathname: pathName } = useRouter();
    const [page, setPage] = useState("");
    const [breadcrumbParts, setBreadcrumbParts] = useState([]);

    useEffect(() => {
        if (pathName) {
            const routeName = getRouteNameAfterPath(pathName);
            setPage(routeName);
            switch (routeName) {
                case "courses": setBreadcrumbParts(["Courses"]); break;
                case "quizzes": setBreadcrumbParts(["Courses", "Course", "Quizzes"]); break;
                case "questions": setBreadcrumbParts(["Courses", "Course", "Quizzes", "Quiz", "Questions"]); break;
            }
        }
    }, [pathName]);

    return (
        <>
            <LayoutSetup />
            <div className="main-layout-orchestrator">
                <aside>
                    <h1>Conquerio</h1>
                    <h2>- backoffice -</h2>
                    <div className="divider" />
                    <section className="menu-items">
                        <Link href="/backoffice/courses">
                            <MenuItem name="Courses" isSelected={page === "courses"} />
                        </Link>
                    </section>
                </aside>
                <div className="right-column">
                    <header>
                        <section className="breadcrumbs">
                            <span className="location-part">Backoffice</span>
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
                    }
                    aside {
                        width: 250px;
                        height: 100vh;
                        background-color: #123c69;
                        z-index: 2;
                        box-shadow: 0px 0px 5px #123c69;
                    }
                    aside h1,
                    aside h2 {
                        color: white;
                        width: 100%;
                        text-align: center;
                    }
                    aside h1 {
                        font-size: 1.7em;
                        margin-bottom: 0;
                    }
                    aside h2 {
                        font-size: 1.1em;
                        margin-top: 0;
                        font-weight: 400;
                    }
                    .divider {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                    }
                    .divider::after {
                        content: "";
                        width: 90%;
                        border-bottom: 1px solid white;
                    }
                    .right-column {
                        width: calc(100% - 250px);
                        z-index: 1;
                    }
                    .menu-items {
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                    }
                    header {
                        height: 50px;
                        background-color: #24292E;
                        box-shadow: 0px 0px 5px #24292E;
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
                        color: white;
                        font-size: 1.7em;
                        cursor: pointer;
                    }
                    article {
                        display: inline-block;
                        margin-bottom: 10px;
                    }
                    article::after {
                        content: "";
                        display: block;
                        width: ${isSelected ? "100%" : "0%"};
                        border-bottom: 1px solid white;
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