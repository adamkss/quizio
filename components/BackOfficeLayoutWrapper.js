import LayoutSetup from './layoutSetup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const getRouteNameAfterPath = (path) => {
    switch (path) {
        case "/backoffice/courses": return "courses";
        case "/backoffice/courses/[id]/quizzes": return "quizzes";
    }
}

export const BackOfficeLayoutWrapper = ({ children }) => {
    const { pathname: pathName } = useRouter();
    const [page, setPage] = React.useState("");

    useEffect(() => {
        if (pathName)
            setPage(getRouteNameAfterPath(pathName));
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
                        <Link href="/backoffice/courses">
                            <MenuItem name="Quizzes" isSelected={page === "quizzes"} />
                        </Link>
                    </section>
                </aside>
                <main>
                    {children}
                </main>
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
                    main {
                        width: calc(100% - 250px);
                    }
                    .menu-items {
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
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