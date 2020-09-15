import React from 'react';

import GoogleButtons from './GoogleButtons';
import './Header.css';

const Header = (props) => {

    const timeRemaining = `${Math.floor(props.user.secondsRemaining/3600)}:${("0" + Math.floor((props.user.secondsRemaining%3600)/60)).slice(-2)}m:${("0" + Math.floor((props.user.secondsRemaining%3600)%60)).slice(-2)}s`


    return (
        <div className='header-container'>
            <div className='tab-container'>
                <button className={`tab ${props.selectedTab === 'video' ? 'selected' : ''}`} onClick={props.handleViewClick} value='video'>
                    1. Video
                </button>
                <span style={{padding: '.25em'}} />
                <button className={`tab ${props.selectedTab === 'faces' ? 'selected' : ''}`} onClick={props.handleViewClick} value='faces'>
                    2. Faces
                </button>
                <span style={{padding: '.25em'}} />
                <button className={`tab ${props.selectedTab === 'results' ? 'selected' : ''}`} onClick={props.handleViewClick} value='results'>
                    3. Results
                </button>
            </div>
            <div style={{flexGrow: 1}} />
            <div className='login-container'>
                <div className='login-status'>
                    { props.user.loggedIn ? `User: ${props.user.name}`: 'Log in to use the tool' }
                    <br/>
                    { props.user.secondsRemaining ? `Credit: ${timeRemaining}`: ''}
                </div>
                <GoogleButtons
                    loggedIn={props.user.loggedIn}
                    responseGoogleSuccess={props.responseGoogleSuccess}
                    responseGoogleFailure={props.responseGoogleFailure}
                    responseGoogleLogout={props.responseGoogleLogout}>
                </GoogleButtons>
            </div>
        </div>
    )
}

export default Header;