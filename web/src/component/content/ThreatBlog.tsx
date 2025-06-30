import React, { useState, useEffect, useRef } from "react";
import { categoryBlog } from "../data/Mockdata";
import { useCustomTheme } from "../style/common.style";
import CircularProgress from "@mui/material/CircularProgress";
const Blog = ({ value }:{value:any}) => {
    return (
        <div className="border border-gray-300 p-14 bg-white rounded-lg shadow-md transition-transform hover:scale-105 hover:shadow-lg">
            <h3 className="text-blue-500 font-semibold text-lg mb-2">{value.title}</h3>
            <p className="text-gray-800">{value.description}</p>
            <div className="flex justify-between items-center mt-2 text-gray-500">
                <p>{value.date}</p>
                <p>{value.created_by}</p>
            </div>
        </div>
    );
};

const ThreatBlog = () => {
    const { matches } = useCustomTheme();
    const initialDisplayCount = 9;
    const [displayCount, setDisplayCount] = useState(initialDisplayCount);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleScroll = () => {
        const container = containerRef.current;
        if (container && container.scrollTop + container.clientHeight >= container.scrollHeight) {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setDisplayCount((prevCount) => prevCount + 9);
            }, 2000);
        }
    };

    useEffect(() => {
        const container = containerRef.current!;
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            ref={containerRef}
            className={`bg-gray-100 ${matches ? "p-4" : "p-8"}`}
            style={{ height: matches ? "auto" : "92vh", overflow: "auto" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 justify-center items-center">
                {categoryBlog.slice(0, displayCount).map((value, index) => (
                    <div key={index}>
                        <Blog value={value} />
                    </div>
                ))}
            </div>
            {isLoading && (
                <div className="justify-center text-center pt-9">
                    <CircularProgress />
                </div>
            )}
        </div>
    );
};

export default ThreatBlog;
