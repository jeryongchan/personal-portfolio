import styled from "@emotion/styled";
import './initialLetter.css';

const IntroWrapper = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    margin-left: 12rem;
    flex-direction: column
`


const ContentWrapper = styled('div')`
    display: flex;
    align-items: center;
    margin-top: 4rem;
    margin-left: 1rem;
    flex-direction: column
`

const Contacts = () => {
    return (
        <>

            <ContentWrapper>
                <div className="connectWrapper">
                    <div className="contact"><img className="icon5" src={"/matcha.png"} /><div>Connect with me </div><div>:</div></div>
                </div>
            </ContentWrapper>
            <IntroWrapper>
                <div className="contactWrapper">
                    <img className="icon3" src={"/assets/emailIcon.png"} /><div className="desc3">jeryong96@gmail.com</div>
                </div>
                <div className="contactWrapper">
                    <img className="icon3" src={"/assets/github.png"} /><a className="desc3" target="_blank" href="https://github.com/jeryongchan?tab=repositories">github@jeryongchan</a><img className="icon4" src={"/assets/arrowLink.png"} />
                </div>
                <div className="contactWrapper">
                    <img className="icon3" src={"/assets/linkedin.png"} /><a className="desc3"  target="_blank" href="https://www.linkedin.com/in/jeryongchan">linkedin@jeryongchan</a><img className="icon4" src={"/assets/arrowLink.png"} />
                </div>
            </IntroWrapper>
           
        </>
    )
}

export default Contacts;