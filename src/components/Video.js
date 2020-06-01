import React from 'react';
import YouTube from 'react-youtube';
import './Video.css';

var interval;

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

    interval = setInterval(() => {
        if ( this.props.videoMetadata ) {
          const n = Math.floor(this.state.player.getCurrentTime() * this.props.videoMetadata.checksPerSecond)
          this.setState({ faceLocations: this.props.allFaceLocations[n] })
        }
    }, 100)
  }

  onPauseVideo() {
    this.state.player.pauseVideo();

    clearInterval(interval);
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
              style={{width: '100%', height: '100%'}}
              videoId={this.props.videoID}
              onReady={this.onReady}
              onPlay={this.onPlayVideo}
              onPause={this.onPauseVideo}
              onError={this.onError}
              onStateChange={this.onStateChange} />
            {this.state.faceLocations && this.state.faceLocations.length > 0 && faceBoxes}
          </div>
        </div>
      );
    }
    
  }
}

export default Video;