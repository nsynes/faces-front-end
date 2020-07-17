import React from 'react';

import GoogleButtons from './GoogleButtons';
import './Header.css';

const Header = (props) => {

    const timeRemaining = `${Math.floor(props.user.secondsRemaining/3600)}:${("0" + Math.floor((props.user.secondsRemaining%3600)/60)).slice(-2)}:${("0" + Math.floor((props.user.secondsRemaining%3600)%60)).slice(-2)}`


    return (
        <div className='header-container'>
            <div className='tab-container'>
                <div style={{position: 'absolute', bottom: 0}}>
                    <button className={`tab ${props.selectedTab === 'video' ? 'selected' : ''}`} onClick={props.handleViewClick}>Video</button>
                    <button className={`tab ${props.selectedTab === 'faces' ? 'selected' : ''}`} onClick={props.handleViewClick}>Faces</button>
                    <button className={`tab ${props.selectedTab === 'results' ? 'selected' : ''}`} onClick={props.handleViewClick}>Results</button>
                </div>
            </div>
            <div className='login-container'>
                <div className='video-select-container'>
                <input
                    style={{width: 110}}
                    type="text"
                    name="videoTextBox"
                    value={props.videoTextBox}
                    placeholder={'Video URL'}
                    onChange={props.handleVideoTextBoxChange} />
                <button onClick={props.setVideo}>Select video</button>
                <button
                    onClick={props.startDetection}
                    disabled={(props.videoID && props.user.loggedIn) ? false : true}>Find faces
                </button>
                </div>
                <GoogleButtons
                    loggedIn={props.user.loggedIn}
                    responseGoogleSuccess={props.responseGoogleSuccess}
                    responseGoogleFailure={props.responseGoogleFailure}
                    responseGoogleLogout={props.responseGoogleLogout}>
                </GoogleButtons>
                <div className='login-status'>
                { props.user.loggedIn ? `User: ${props.user.name}`: 'Log in to use the tool' }
                <br/>
                { props.user.secondsRemaining ? `Time remaining (H:M:S): ${timeRemaining}`: ''}
                </div>
            </div>
        </div>
    )
}

export default Header;