import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";

const Text = styled('div')`
    padding: 2rem 2rem 0 0;
    // color: #F88379;
    margin: 1rem;
    color: #171d19;
    position: relative;
    font-family: consolas;
    font-size: 45px;
    height: 50px
`
const log = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}


const TypeWriter = ({ text }) => {
    const index = useRef(0);
    const isAppending = useRef(true);
    const [currentText, setCurrentText] = useState('');
    // const [isAppending.current, setisAppending.current] = useState(true)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (index.current < text.length && isAppending.current) {
                index.current += 1;
                setCurrentText(value => value + text.charAt(index.current - 1));
            }
            else if (index.current >= text.length || index.current === 0) {
                isAppending.current = !isAppending.current;
                if (isAppending.current) {
                    index.current += 1
                    setCurrentText(value => value + text.charAt(index.current - 1));
                } else {
                    index.current -= 1
                    setCurrentText(value => value.slice(0, index.current));
                }
            } else {
                index.current -= 1;
                setCurrentText(value => value.slice(0, index.current));
            }


        }, isAppending.current ? 150 : 75);
        return () => {
            clearTimeout(timeoutId);
        }
    }, [currentText, text])

    return <Text className="typewriter-wrapper">{currentText}</Text>
}

export default TypeWriter;