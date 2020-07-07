import React from 'react';
import ReactPlayer from 'react-player'
//import YouTube from 'react-youtube';

import Loading from './Loading';
import './Video.css';

var videoInterval;

class Video extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      player: null,
      faceLocations: [] // top, right, bottom, left
    };

    this.onPlayVideo = this.onPlayVideo.bind(this);
    this.onPauseVideo = this.onPauseVideo.bind(this);
  }

  onPlayVideo() {

    videoInterval = setInterval(() => {
        if ( this.props.checksPerSecond ) {
          const n = Math.floor(this.player.getCurrentTime() * this.props.checksPerSecond)
          this.setState({ faceLocations: this.props.allFaceLocations[n] })
        }
    }, 100)
  }

  onPauseVideo() {

    clearInterval(videoInterval);
  }

  onError(error) {
    console.log('onError', error)
  }

  ref = player => {
    this.player = player
  }

  render() {
    
    if ( this.state.faceLocations ) {
      var faceBoxes = this.state.faceLocations.map((loc) => {
        return <div className='face-box' key={`${loc}`}
                    style={{top: `${loc[0]}%`, left: `${loc[3]}%`, width: `${(loc[1]-loc[3])}%`, height: `${(loc[2]-loc[0])}%`}} />
      })
    }

    if ( this.props.videoID === '') {
      return (null)
    } else if (this.props.videoType === 'youtube') {
      return (
        <div className='video-top-container'>
          <div className='video-container'>
            <ReactPlayer
              className='react-player'
              ref={this.ref}
              url={`https://www.youtube.com/watch?v=${this.props.videoID}`}
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
            Face detection: {this.props.percentageComplete}%
            <div className='percentage-box'>
              <div style={{position: 'absolute', left: 0, backgroundColor: 'red', width: this.props.percentageComplete+'%', height: 5}} />
            </div>
            <div style={{height: 40}}>
              {this.props.loading && <Loading size='small'/>}
            </div>
          </div>
        </div>
      );
    }    
  }
}

export default Video;