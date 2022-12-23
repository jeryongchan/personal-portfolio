import styled from "@emotion/styled";
import './initialLetter.css';

const IntroWrapper = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    flex-direction: column
`

const Intro = styled('p')`
    width: 60rem;
    color: #171d19;
    margin: 0.3rem;
    font-family: 'Noto Sans Mono', monospace;
    font-size: 17px
`

const ContentWrapper = styled('div')`
    display: flex;
    align-items: center;
    margin-top: 1.5rem;
    flex-direction: column
`

const Experiences = () => {
    return (
        <>
            <IntroWrapper>
                <Intro>
                    <p className="paragraph">
                        <span>P</span>assionate and highly motivated self-taught web developer seeking an entry-level programming position within a forward-looking team.
                        Previously held a process engineering position which involved extensive data mining and analysis.
                        
                    </p>
                    <p className="paragraphEmphasize">Proficient in MERN stack and fluent in frontend development with React.</p>
                </Intro>
            </IntroWrapper>
            <ContentWrapper>
                <div className="experienceWrapper">
                    <div className="experience">EXPERIENCES</div><img className="icon2" src={"/assets/experience.png"} />
                </div>
            </ContentWrapper>
            <ContentWrapper>
                <div className="flex"><div className="title">Process Engineer at Micron Technologies, Singapore</div><div className="date">Nov 20 to Oct 22</div></div>
                <div className="desc list">
                    <ul>
                        <li>Diagnosed, resolved and optimized process related problems via data mining and analyzing</li>
                        <li>Written multiple Python scripts for automating otherwise tedious but recurring tasks.</li>
                        <li>Worked with DS team in pipeline contruction of new fault detection algorithm using RGB color model based on wafer image.</li>
                        <li>Worked with the Process Engineer Coding Team in creating an internal web platform (Django + Angular) for facilitating process-related workflows.</li>
                    </ul>
                </div>
                <div className="singleTitle topmargin">Computer Science Intern at China Automotive Engineering Research Institute, </div>
                <div className="flex"><div className="title">Chongqing, China</div><div className="date">Dec 19 to Jan 20</div></div>

                <div className="desc">
                    <ul>
                        <li>Worked in designing the UI for an application for computing homography for obstacle detection.</li>
                        <li>Worked in translation of pseudocodes of a collision detection algorithm in C.</li>
                    </ul>
                </div>
            </ContentWrapper>
        </>
    )
}

export default Experiences;