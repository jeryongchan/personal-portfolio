import styled from "@emotion/styled";
import './initialLetter.css';

const ContentWrapper = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1.5rem;
    flex-direction: column
`

const Projects = () => {
    return (
        <>
            <ContentWrapper>
                <div className="singleTitle bottom fontIncrement">Multiplayer Online Playing Card Game with Chat Functionality</div>
                <div className="gameLink bottom alignMiddle"><img className="icon" src={"/assets/cardsIcon.png"} /><a href="https://thecardweaver.netlify.app" target="_blank">thecardweaver</a></div>
                <div className="desc2">
                    A project to showcase own's capability in building and deploying a fullstack web application, as well as the proficiency in the following libraries, including but not limited to:
                    <div className="title top">Frontend Libraries</div>
                    <div className="list">

                        <ul>
                            <li>React</li>
                            <li>Redux</li>
                            <li>Socket.IO client</li>
                            <li>Material UI</li>
                            <li>Phaser</li>
                        </ul>
                    </div>
                    <div className="title">Backend Libraries</div>
                    <ul>
                        <li>Express</li>
                        <li>Redis</li>
                        <li>PostgreSQL</li>
                        <li>Socket.IO</li>
                        <li>multer</li>
                    </ul>
                </div >
                <div className="gifDesc">Login authentication, persistent session, and avatar upload functionality.</div>
                <div>
                    <img src={"/assets/profileGif.gif"} />
                </div>
                <div className="gifDesc">Real-time chat functionality with friends.</div>
                <div>
                    <img src={"/assets/chatGif.gif"} />
                </div>
                <div className="gifDesc">Join a 4-player online Big Two card game by entering game PIN or room creation!</div>
                <div>
                    <img src={"/assets/enteringGame.gif"} />
                </div>
                <div className="gifDesc">Smooth drag-and-drop UI for selecting and playing cards.</div>
                <div>
                    <img src={"/assets/singleCardPlay.gif"} />
                </div>
                <div className="gifDesc">Play either single, double, triple or any five-cards combination depending on the current card count!</div>
                <div>
                    <img src={"/assets/fiveCardsPlay.gif"} />
                </div>
                <div className="padding"></div>


            </ContentWrapper>
        </>
    )
}

export default Projects;