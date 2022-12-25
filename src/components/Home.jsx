import styled from "@emotion/styled";
import TypeWriter from "./TypeWriter";
import Portrait from "./Portrait";
import Spinner from "./spinner";
import { useState } from "react";
import WigglingText from "./wigglingText";
import './initialLetter.css';

const OuterWrapper = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 2;
    margin-left: 4rem;
    margin-right: 4rem;
    margin-top: 6rem;
`

const TextWrapper = styled('div')`
    width: 550px;
    justify-content: right;
    margin-right: 0.5rem;
`

const NonTypeWriter = styled('div')`
    padding: 2rem 2rem 0 0;
    margin: 1rem;
    color: #171d19;
    position: relative;
    font-family: consolas;
    font-size: 45px;
    height: 50px
`

const Body = styled('div')`
    padding: 2rem 3rem 0 0;
    text-align: center;
    white-space: pre;
    color: #171d19;
    margin: 1rem;
    position: relative;
    font-family: consolas;
    font-size: 24px
`

const PortraitWrapper = styled('div')`
    margin-left: 0.5rem;
    border-style: solid;
    width: 500px;
    height: 500px;
    // display: flex;
    // justify-content: center;
    // align-items: center;
`

const Home = () => {
    const [loaded, setLoaded] = useState(false);
    const [showWigglingText, setShowWigglingText] = useState(false);
    const [portraitHovered, setPortraitHovered] = useState(false);
    const text = "Hi, I am Jer Yong  ";

    return (
        <OuterWrapper className="outer-wrapper">
            <TextWrapper className="text-wrapper">
                {loaded ?
                    <TypeWriter text={text} /> :
                    <NonTypeWriter>{text}</NonTypeWriter>
                }
                <Body className="caption-wrapper">
                    An aspiring web developer <br />
                    who likes crafting creative and <br />
                    scalable frontend applications.
                </Body>
            </TextWrapper>
            <PortraitWrapper className="portrait-wrapper">
                {!loaded &&
                    <Spinner />
                }
                <Portrait setLoaded={setLoaded} setPortraitHovered={setPortraitHovered} setShowWigglingText={setShowWigglingText} />
                {(showWigglingText && !portraitHovered) && <WigglingText />}
                {(showWigglingText && portraitHovered) &&
                    <div className="portraitWrapper">
                        <a href="https://github.com/jeryongchan/personal-portfolio/blob/master/src/components/Portrait.jsx" className="portraitInfo" target="_blank">
                            Made with Fabric.js
                            <img className="icon6" src={"/assets/arrowLink.png"} />
                        </a>
                        
                    </div>}
            </PortraitWrapper>
        </OuterWrapper >
    );
}

export default Home;