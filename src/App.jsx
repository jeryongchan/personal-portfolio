import Home from "./components/Home";
import Contact from "./components/Contact";
import Experiences from "./components/Experiences";
import Projects from "./components/Projects";
import NotFound from "./components/NotFound";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import { Global, css } from '@emotion/react'
import styled from "@emotion/styled";


const AppWrapper = styled('div')`
    // border: solid;
    // background-color: black;
    background-color: #dcfcdc;
`

const WidthLimiter = styled('div')`
    display: grid;
    grid-template-columns: 1fr 72rem 1fr;
    height: 100vh;
    overflow-y: auto;
    scrollbar-gutter: stable;
    scrollbar-color: #282828 #202124  
    `

const PlaceHolder = styled('div')`
    // background-color: #4C5858;
    background-color: #202124 ;

`

function App() {
    return (
        <WidthLimiter className="width-limiter">
            <PlaceHolder className="placeholder"></PlaceHolder>
            <AppWrapper className="app-wrapper">
                <Global
                    styles={css`
              body {
                caret-color: transparent;
                
                background-color: #202124;
                margin: 0;
                padding: 0;
                min-height: '100vh';
                max-width: '100vw';
                selector { cursor: none; };
                
              }
            `}
                />
                <NavBar>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Contact" element={<Contact />} />
                        <Route path="/Experiences" element={<Experiences />} />
                        <Route path="/Projects" element={<Projects />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </NavBar>
            </AppWrapper >
            <PlaceHolder className="placeholder"></PlaceHolder>
        </WidthLimiter>
    );
}

export default App;
