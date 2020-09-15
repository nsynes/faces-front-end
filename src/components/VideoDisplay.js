import React from 'react';

import MainPage from './MainPage';
import Instructions from './Instructions';
import Video from './Video';

const VideoDisplay = (props) => {
  
  return (
    <MainPage visible={props.visible}>
      <Instructions tab='video' />
      <div align='center' style={{marginBottom: '1em'}}>
        <input
            style={{width: 400, maxWidth: '90%'}}
            type="text"
            name="videoTextBox"
            value={props.videoURL}
            placeholder={'Youtube Video URL'}
            onChange={props.handleVideoURLChange} />
        <button
            className='button'
            onClick={props.startDetection}
            disabled={(props.videoID && props.user.loggedIn) ? false : true}>Find faces
        </button>
        {!props.user.loggedIn &&
        <span style={{color: 'red'}}>Login (top right)</span>}
      </div>
      <div className='video-top-container'>
        <div className='video-container'>
        <Video
          videoURL={props.videoURL}
          allFaceLocations={props.allFaceLocations}
          faceGroupTS={props.faceGroupTS}
          faceTS={props.faceTS}
          groupClassification={props.groupClassification}
          labelColours={props.labelColours}
          checksPerSecond={props.checksPerSecond}
          setVideoID={props.setVideoID} />
        </div>
        <div className='video-details'>
          <div className='percentage-box'>
            <div style={{position: 'absolute', left: 0, backgroundColor: 'red', width: props.percentageComplete+'%', height: 5}} />
          </div>
          Face detection: {props.percentageComplete}%
        </div>
      </div>
    </MainPage>
  );
}

export default VideoDisplay;