import React from 'react';
import ReactPlayer from 'react-player'

import MainPage from './MainPage';
import Instructions from './Instructions';
import './VideoDisplay.css';

var videoInterval;

class VideoDisplay extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      faceLocations: [] // top, right, bottom, left
    };

    this.onPlayVideo = this.onPlayVideo.bind(this);
    this.onPauseVideo = this.onPauseVideo.bind(this);
  }

  onPlayVideo() {
    videoInterval = setInterval(() => {
        if ( this.props.checksPerSecond ) {
          const n = Math.floor(this.player.getCurrentTime() * this.props.checksPerSecond)
          this.setState({ faceLocations: this.props.allFaceLocations[n], n: n })
        }
    }, 100)
  }

  onPauseVideo() {
    clearInterval(videoInterval);
  }

  onReady = (e) => {
    var queryParams = this.getQueryParams(e.props.url);
    var videoID;    
    if ( queryParams['v'] ) {
      videoID = queryParams['v']
    } else {
      videoID = e.props.url.split('youtu.be/')[1]
    }
    this.props.setVideoID(videoID)
  }

  getQueryParams = (url) => {
    const queryString = url.split('?')[1];
    if ( queryString ) {
      var a = queryString.split('&');
      if (a == "") return {};
      var b = {};
      for (var i = 0; i < a.length; ++i) {
        var p=a[i].split('=', 2);
        if (p.length == 1) b[p[0]] = "";
        else b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
      return b;
    } else {
      return {};
    }
  }

  onError = (error) => {
    console.log('onError', error)
    this.props.setVideoID('')
  }

  ref = player => {
    this.player = player
  }

  render() {

    const { faceTS, faceGroupTS, groupClassification, labelColours } = this.props;
    const { n, faceLocations } = this.state;
    var boxColour;
    
    if ( faceLocations ) {
      var faceBoxes = faceLocations.map((loc, ix) => {
        if ( faceTS[n] && faceTS[n][ix] ) {
          boxColour = faceTS[n] && faceTS[n][ix] ? labelColours[faceTS[n][ix]] : '#ffffff';
        } else {
          boxColour = faceGroupTS[n] && faceGroupTS[n][ix] && groupClassification[faceGroupTS[n][ix]] ? labelColours[groupClassification[faceGroupTS[n][ix]]] : '#ffffff';
        }
        return <div className='face-box' key={`${loc}`}
                  style={{top: `${loc[0]}%`, left: `${loc[3]}%`, width: `${(loc[1]-loc[3])}%`, height: `${(loc[2]-loc[0])}%`, color: boxColour}} />
      })
    }

    return (
      <MainPage visible={this.props.visible}>
        <Instructions tab='video' />
        <div align='center' style={{marginBottom: '1em'}}>
          <input
              style={{width: 400, maxWidth: '90%'}}
              type="text"
              name="videoTextBox"
              value={this.props.videoURL}
              placeholder={'Youtube Video URL'}
              onChange={this.props.handleVideoURLChange} />
          <button
              className='button'
              onClick={this.props.startDetection}
              disabled={(this.props.videoID && this.props.user.loggedIn) ? false : true}>Find faces
          </button>
          {!this.props.user.loggedIn &&
          <span style={{color: 'red'}}>Login (top right)</span>}
        </div>
        <div className='video-top-container'>
          <div className='video-container'>
            <ReactPlayer
              className='react-player'
              ref={this.ref}
              url={this.props.videoURL}
              width='100%'
              height='100%'
              controls={true}
              onReady={this.onReady}
              onPlay={this.onPlayVideo}
              onPause={this.onPauseVideo}
              onError={this.onError} />
            {this.state.faceLocations && this.state.faceLocations.length > 0 && faceBoxes}
          </div>
          <div className='video-details'>
            <div className='percentage-box'>
              <div style={{position: 'absolute', left: 0, backgroundColor: 'red', width: this.props.percentageComplete+'%', height: 5}} />
            </div>
            Face detection: {this.props.percentageComplete}%
          </div>
        </div>
      </MainPage>
    );
  }
}

export default VideoDisplay;