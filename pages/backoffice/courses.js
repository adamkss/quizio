import LayoutSetup from '../../components/layoutSetup';
import { useEffect, useState, useCallback} from 'react';
import { getAllCourses } from '../../utils/QuizRequests';
import Router from 'next/router';

const blueColor = {
    colorR: 78,
    colorG: 103,
    colorB: 235
}

export default () => {

    const [courses, setCourses] = useState([]);

    useEffect(async () => {
        const courses = await getAllCourses();
        setCourses([...courses, ...courses, ...courses, ...courses]);
    }, []);

    const onTileClick = useCallback((courseId) => {
        Router.push(`/backoffice/courses/${courseId}`);
    }, []);

    return (
        <>
            <LayoutSetup />
            <header>

            </header>
            <main>
                <div className="tiles-container" >
                    {courses.map((course, index) => {
                        return (
                            <Tile
                                id={course.id}
                                title={course.courseName}
                                key={index}
                                color={blueColor}
                                onClick={onTileClick} />
                        )
                    })}
                </div>
            </main>
            <style jsx>
                {`
                    header{
                        height: 140px;
                    } 
                    main {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                    }
                    
                    .tiles-container { 
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                        justify-content: center;
                        margin: -13px -13px;
                    }
                `}
            </style>
        </>
    )
}

const Tile = ({ id, title, color: { colorR = 0, colorG = 0, colorB = 0 }, onClick }) => {
    const onTileClick = useCallback(() => {
        onClick(id);
    }, [id, onClick]);

    return (
        <>
            <div className="course-tile" onClick={onTileClick}>
                <span className="tile-title">
                    {title}
                </span>
            </div>
            <style jsx>
                {`
            .course-tile {
                        width: 200px;
                        height: 150px;
                        box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.4);
                        border-radius: 5px;
                        margin: 13px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 1.7em;
                        color: white;
                        background: linear-gradient(180deg, rgb(${colorR}, ${colorG}, ${colorB}) 0%, rgb(${colorR + Tile.colorDifference}, ${colorG + Tile.colorDifference}, ${colorB + Tile.colorDifference}) 100%);
                        cursor: pointer;
                    }`}
            </style>
        </>
    )
}

Tile.colorDifference = 30;