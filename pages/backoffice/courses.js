import { useEffect, useState, useCallback } from 'react';
import { getAllCourses } from '../../utils/QuizRequests';
import Router from 'next/router';
import { BackOfficeLayoutWrapper } from '../../components/BackOfficeLayoutWrapper';

const blueColor = {
    colorR: 78,
    colorG: 103,
    colorB: 235
}

export default () => {

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        (async () => {
            const courses = await getAllCourses();
            setCourses(courses);
        })();
    }, []);

    const onTileClick = useCallback((courseId) => {
        Router.push(`/backoffice/courses/${courseId}/quizzes`);
    }, []);

    return (
        <BackOfficeLayoutWrapper>
            <>
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
                        padding: 20px;
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
        </BackOfficeLayoutWrapper>
    )
}

const Tile = ({ id, title, color: { colorR = 0, colorG = 0, colorB = 0 }, onClick }) => {
    const onTileClick = useCallback(() => {
        onClick(id);
    }, [id, onClick]);

    return (
        <>
            <div className="course-tile">
                <span className="tile-title">
                    {title}
                </span>
                <button className="see-quizes" onClick={onTileClick}><span>See quizes</span></button>
                <button className="see-members"><span>See members</span></button>
            </div>
            <style jsx>
                {`
            .course-tile {
                        width: 350px;
                        padding: 25px;
                        box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.4);
                        border-radius: 5px;
                        margin: 13px;
                        display: flex;
                        flex-direction: column;
                        font-size: 1.9em;
                        color: black;
                        transition: all 0.3s;
                        animation: SlideUp 0.3s;
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
            .tile-title {
                margin-bottom: 20px;
            }
            button {
                padding: 10px;
                font-family: 'Oswald';
                font-size: 0.7em;
                margin-bottom: 10px;
                border: none;
                outline: none;
                text-align: left;
                cursor: pointer;
                border-radius: 5px;
                transition: all 0.3s;
                display: flex;
                padding-right: 20px;
            }
            button:hover {
                background-color: purple;
                color: white;
                box-shadow: 0px 0px 8px purple;
            }
            button:hover::after {
                content: ">";
                display: inline-block;
                flex-grow: 1;
                text-align: right;
                color: white;
            }
            `}
            </style>
        </>
    )
}

// background: linear-gradient(180deg, rgb(${colorR}, ${colorG}, ${colorB}) 0%, rgb(${colorR + Tile.colorDifference}, ${colorG + Tile.colorDifference}, ${colorB + Tile.colorDifference}) 100%);

Tile.colorDifference = 30;