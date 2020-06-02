import React from 'react';
import YouTube from 'react-youtube';

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

    this.onReady = this.onReady.bind(this);
    this.onPlayVideo = this.onPlayVideo.bind(this);
    this.onPauseVideo = this.onPauseVideo.bind(this);
  }

  onReady(event) {
    console.log('onReady')
    this.setState({
      player: event.target,
    });
  }

  onPlayVideo() {
    this.state.player.playVideo();

    videoInterval = setInterval(() => {
        if ( this.props.videoMetadata ) {
          const n = Math.floor(this.state.player.getCurrentTime() * this.props.videoMetadata.checksPerSecond)
          this.setState({ faceLocations: this.props.allFaceLocations[n] })
        }
    }, 100)
  }

  onPauseVideo() {
    this.state.player.pauseVideo();

    clearInterval(videoInterval);
  }

  onError(error) {
    console.log('onError', error)
  }

  onStateChange(e) {
    console.log('onStateChange', e)
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
    } else {
      return (
        <div align='center'>
          <div style={{ position:'relative', display:'inline-block' }}>
            <YouTube
              className='video'
              videoId={this.props.videoID}
              onReady={this.onReady}
              onPlay={this.onPlayVideo}
              onPause={this.onPauseVideo}
              onError={this.onError}
              onStateChange={this.onStateChange} />
            {this.state.faceLocations && this.state.faceLocations.length > 0 && faceBoxes}
          </div>
          <div className='video-details'>
            Face detection status: {this.props.percentageComplete}%
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