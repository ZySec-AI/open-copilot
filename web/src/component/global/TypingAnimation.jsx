import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const TypingAnimation = ({ text }) => {
    console.log("call this function");
    const [typedText, setTypedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentIndex < text.length) {
                setTypedText((prevText) => prevText + text[currentIndex]);
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }
        }, 1);  // Adjusted timing for better visibility

        return () => clearTimeout(timer);
    }, [currentIndex, text]);

    return (
        <ReactMarkdown>
            {typedText}
        </ReactMarkdown>
    );
};

export default TypingAnimation;