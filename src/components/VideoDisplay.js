import React from 'react';

import MainPage from './MainPage';
import Instructions from './Instructions';
import Video from './Video';
import Loading from './Loading';

import './VideoDisplay.css';

const VideoDisplay = (props) => {

  var {errorMsg} = props

  errorMsg = props.user.loggedIn ? errorMsg : 'Log in (top right)';

  console.log('errorMsg', errorMsg)
  
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
            disabled={(!props.loading && props.videoID && props.user.loggedIn) ? false : true}>Find faces
        </button>
        {errorMsg &&
        <div style={{color: 'red'}}>{errorMsg}</div>}
        {props.loading && <Loading size='small' />}
      </div>
      <div className='video-top-container'>
        <div className='video-details'>
          <div className='percentage-box'>
            <div style={{position: 'absolute', left: 0, backgroundColor: 'red', width: props.percentageComplete+'%', height: 5}} />
          </div>
          Face detection: {props.percentageComplete}%
        </div>
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
      </div>
      <br />
      <div align='center'>
        Try some free, ready processed videos:
        <div className='free-video-link' onClick={() => props.setVideoURL('youtu.be/Ori23ZvNPsA')}>The One Show: youtu.be/Ori23ZvNPsA</div>
        <div className='free-video-link' onClick={() => props.setVideoURL('youtu.be/1ZSw1oi3Q3U')}>This Morning: youtu.be/1ZSw1oi3Q3U</div>
        <div className='free-video-link' onClick={() => props.setVideoURL('youtu.be/iYZbQIXoVMY')}>Graham Norton Show: youtu.be/iYZbQIXoVMY</div>
        <div className='free-video-link' onClick={() => props.setVideoURL('youtu.be/h1xxC_Rr__U')}>Channel 4 Trailer: youtu.be/h1xxC_Rr__U</div>
      </div>
    </MainPage>
  );
}

export default VideoDisplay;