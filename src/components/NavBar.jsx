import { Link } from "react-router-dom";
import styled from "@emotion/styled";

const StyledLink = styled(Link)`
    // color: #F88379;
    // color: #8D9ca4;
    // color: #171d19;
    text-decoration: none;
    margin: 1.8rem;
    position: relative;
    font-family: consolas;
    font-size: 21px;
    color: #dcfcec;
    
`

const NavBarOuterWrapper = styled("div")`
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: right;
    position: relative;
    padding-top: 3rem;
    padding-bottom: 0.8rem;
    padding-left: 2rem;
    padding-right: 2.1rem;
    background-color: #4a5c6c;    
`

const NavBarInnerWrapper = styled("div")`
    display: flex;
    align-items: center;
    position: relative;
    // padding: 0.5rem 2rem;
`
// const Divider = styled("hr")`
//     // border-bottom: 1px solid;
//     // width: 97%
// `


export default function NavBar({ children }) {
    return (
        <>
            <NavBarOuterWrapper className="navbar-outer-wrapper">
                {/* <div className="StyledLink">
                    <StyledLink to="/">Home</StyledLink>
                </div> */}
                <NavBarInnerWrapper className="navbar-inner-wrapper">
                    <StyledLink to="/">.self</StyledLink>
                    <StyledLink to="Projects">.projects</StyledLink>
                    <StyledLink to="Experiences">.experiences</StyledLink>
                    <StyledLink to="Contact">.contacts</StyledLink>
                </NavBarInnerWrapper>
            </NavBarOuterWrapper>
            <br />
            {children}
        </>

    );
}
